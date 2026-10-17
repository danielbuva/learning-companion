import { transact, runJobs, D1Repository } from "./store.ts";
import { Fault } from "./model.ts";
import { mcpResult } from "./mcp.ts";
import { demoCommands, activityTemplate, activityTypes } from "./synthetic.ts";
import { widgetDocument } from "./widget-document";
import {base64} from "./exports";
import {authorizeFromHost,confirmFromHost} from "./consent";
import {uploadFromTool} from "./files";
import {flushFileDeletes} from "./erasure";

const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
export async function learningFetch(request:Request, env:Cloudflare.Env,ctx:ExecutionContext):Promise<Response|null>{
  const url=new URL(request.url),path=url.pathname;
  if(path==="/health")return json({status:"ready",product:"Learning Companion",version:"1.0.0"});
  if(!["/mcp","/api/learning"].includes(path))return null;
  if(request.method!=="POST")return new Response(null,{status:405,headers:{Allow:"POST"}});
  const owner=request.headers.get("oai-authenticated-user-id");
  if(!owner)return json({error:{code:"authentication_required",message:"Sign in with ChatGPT to access your private learning record."}},401);
  if(path==="/api/learning"){
    const origin=request.headers.get("origin");
    if(!origin||new URL(origin).origin!==url.origin)return json({error:{code:"origin_denied",message:"Use the same-origin learner interface."}},403);
  }
  if(!env.DB)return json({error:{code:"storage_unavailable",message:"Durable storage is unavailable. Your draft has not been saved."}},503);
  if(Number(request.headers.get("content-length")??0)>500_000)return json({error:{code:"too_large",message:"Split large inputs into sections."}},413);
  const repo=new D1Repository(env.DB);
  let rpcId:string|number|null=null;
  try{
    const text=await request.text();if(text.length>500_000)throw new Fault("too_large","Split large inputs into sections.",413);
    const body=JSON.parse(text);
    rpcId=body.id??null;
    if(path==="/mcp"&&body.method==="tools/call"&&body.params?.name==="learning_authorize")return json({jsonrpc:"2.0",id:rpcId,result:await authorizeFromHost(repo,owner,body.params)});
    if(path==="/mcp"&&body.method==="tools/call"&&body.params?.name==="learning_confirm"){
      const result=await confirmFromHost(repo,owner,body.params);
      if(result.structuredContent?.permanent){const erasure=await flushFileDeletes(repo,owner,env.BUCKET);result.structuredContent.erasure=erasure;result.content=[{type:"text",text:JSON.stringify(result.structuredContent)}];}
      return json({jsonrpc:"2.0",id:rpcId,result});
    }
    const run=async(command:any)=>{
      if(command.action==="upload_source")return uploadFromTool(repo,env.BUCKET,owner,command.data??{},command.key);
      if(command.action==="source_file"){
        const r=await transact(repo,owner,{action:"get",kind:"source",id:command.id},path==="/mcp"?"tutor":"learner");
        if(!r.record.data.fileId||!env.BUCKET)throw new Fault("file_unavailable","No original file is available for this source.",404);
        const file=await env.BUCKET.get(`${owner}/${r.record.data.fileId}`);if(!file)throw new Fault("file_missing","Original file unavailable.",404);
        return {sourceId:command.id,mimeType:r.record.data.mimeType,base64:base64(new Uint8Array(await file.arrayBuffer())),limitations:r.record.data.limitations};
      }
      const result=await transact(repo,owner,command,path==="/mcp"?"tutor":"learner");
      if(result.permanent)result.erasure=await flushFileDeletes(repo,owner,env.BUCKET);
      else if(command.action==="snapshot")ctx.waitUntil(flushFileDeletes(repo,owner,env.BUCKET));
      if(command.action==="request_job"||(command.action==="control_job"&&command.control==="resume"))ctx.waitUntil(runJobs(repo,owner));
      return result;
    };
    if(path==="/mcp"){
      const result=await mcpResult(body,run,widgetDocument);
      return result?json(result):new Response(null,{status:202});
    }
    if(body.action==="seed_demo"){
      const previous=await transact(repo,owner,{action:"search",query:"",kind:"course"},"learner");
      if(previous.records.some((r:any)=>r.id==="demo-algorithms"))return json(await run({action:"snapshot"}));
      for(const command of demoCommands())await run(command);
      return json(await run({action:"snapshot"}));
    }
    if(body.action==="new_activity"){
      if(!activityTypes.includes(body.type))throw new Fault("invalid_type","Unknown activity type.");
      return json(await run({action:"put",kind:"activity",id:body.id,key:body.key,data:{...activityTemplate(body.type),...body.data}}));
    }
    return json(await run(body));
  }catch(error){
    const fault=error instanceof Fault?error:new Fault("operation_failed",error instanceof Error?error.message:"Operation failed",400);
    if(path==="/mcp")return json({jsonrpc:"2.0",id:rpcId,error:{code:-32000,message:fault.message,data:{code:fault.code,saved:false}}});
    return json({error:{code:fault.code,message:fault.message},saved:false},fault.status);
  }
}
