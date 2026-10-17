import { transact, runJobs, D1Repository } from "./store.ts";
import { Fault } from "./model.ts";
import { mcpResult } from "./mcp.ts";
import { demoCommands, activityTemplate, activityTypes } from "./synthetic.ts";
import { widgetDocument } from "./widget-document";

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
  try{
    const text=await request.text();if(text.length>500_000)throw new Fault("too_large","Split large inputs into sections.",413);
    const body=JSON.parse(text);
    const run=async(command:any)=>{
      const result=await transact(repo,owner,command,path==="/mcp"?"tutor":"learner");
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
    if(path==="/mcp")return json({jsonrpc:"2.0",id:null,error:{code:-32000,message:fault.message,data:{code:fault.code,saved:false}}});
    return json({error:{code:fault.code,message:fault.message},saved:false},fault.status);
  }
}
