import { D1Repository,transact } from "./store.ts";
import { Fault } from "./model.ts";
import type {Json} from "./model.ts";
import type {Repository} from "./store.ts";
const mimeTypes=["image/png","image/jpeg","image/webp","application/pdf","audio/mpeg","audio/wav","audio/webm","audio/mp4"];
async function boundedBytes(response:Response,max=8_000_000){
  if(!response.body)throw new Fault("empty_file","The source contains no bytes.");const reader=response.body.getReader(),parts:Uint8Array[]=[];let total=0;
  try{while(true){const r=await reader.read();if(r.done)break;total+=r.value.length;if(total>max)throw new Fault("too_large","File exceeds the 8 MB limit.",413);parts.push(r.value);}}catch(e){await reader.cancel();throw e;}
  const result=new Uint8Array(total);let offset=0;for(const part of parts){result.set(part,offset);offset+=part.length;}return result;
}
export async function uploadFromTool(repo:Repository,bucket:R2Bucket|undefined,owner:string,data:Json,key:string){
  const current=await repo.load(owner);if(!current.state.access.read||!current.state.access.write||!current.state.access.recording)throw new Fault("write_denied","Source upload requires learner-authorized tutor writing and recording.",403);
  if(!bucket)throw new Fault("storage_unavailable","Original-file storage is unavailable.",503);
  if(!key||!data.name||!mimeTypes.includes(data.mimeType))throw new Fault("invalid_upload","Supply a retry key, original filename, and a supported MIME type.");
  let bytes:Uint8Array;
  if(data.base64){if(data.base64.length>350_000)throw new Fault("too_large","Use an authorized host file URL for larger files.",413);try{bytes=Uint8Array.from(atob(data.base64),(c:string)=>c.charCodeAt(0));}catch{throw new Fault("invalid_base64","Source bytes are not valid base64.");}}
  else if(data.downloadUrl){
    const url=new URL(data.downloadUrl);
    if(url.protocol!=="https:"||url.username||url.password||!(["files.openai.com","files.oaiusercontent.com"].includes(url.hostname)||url.hostname.endsWith(".oaiusercontent.com")))throw new Fault("untrusted_file_origin","Only an authorized native ChatGPT file URL is accepted. Do not infer access from a filename.",403);
    const response=await fetch(url,{redirect:"error"});if(!response.ok)throw new Fault("source_unavailable","The authorized file URL could not be read. Its content was not inspected or saved.",response.status===403?403:400);bytes=await boundedBytes(response);
  }else throw new Fault("source_bytes_required","Supply original bytes or a currently authorized host file URL.");
  const digest=Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new Uint8Array(bytes).buffer))).map(b=>b.toString(16).padStart(2,"0")).join("");
  const handle=Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(key)))).map(b=>b.toString(16).padStart(2,"0")).join("");
  const sourceId=`file-${handle}`,previous=current.state.records.source[sourceId];
  if(previous){if(previous.data.sha256!==digest)throw new Fault("key_reused","This upload retry key belongs to different original bytes.",409);return {record:previous,saved:true,replayed:true};}
  const fileId=crypto.randomUUID();await bucket.put(`${owner}/${fileId}`,bytes,{httpMetadata:{contentType:data.mimeType}});
  try{return await transact(repo,owner,{action:"put",kind:"source",id:sourceId,key,data:{title:data.name,fileId,mimeType:data.mimeType,size:bytes.length,sha256:digest,courseId:data.courseId,editable:false,origin:"authorized original source supplied through chat",versionLabel:"1",limitations:["Stored original. Interpretation, transcription, and grading require actual inspection."]}},"tutor");}
  catch(e){await bucket.delete(`${owner}/${fileId}`);throw e;}
}
export async function fileFetch(request:Request,env:Cloudflare.Env):Promise<Response|null>{
  const u=new URL(request.url);if(!u.pathname.startsWith("/api/files"))return null;
  const owner=request.headers.get("oai-authenticated-user-id");if(!owner)return Response.json({error:"Sign in required"},{status:401});
  if(!env.DB||!env.BUCKET)return Response.json({error:"File storage unavailable; nothing saved"},{status:503});
  const repo=new D1Repository(env.DB);
  try{
    if(request.method==="GET"){
      const id=u.searchParams.get("source");if(!id)throw new Fault("source_required","Source ID required");
      const r=await transact(repo,owner,{action:"get",kind:"source",id},"learner");
      const blob=await env.BUCKET.get(`${owner}/${r.record.data.fileId}`);if(!blob)throw new Fault("file_missing","Original file unavailable",404);
      return new Response(blob.body,{headers:{"Content-Type":r.record.data.mimeType,"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff","Content-Security-Policy":"default-src 'none'; sandbox"}});
    }
    if(request.method!=="POST")return new Response(null,{status:405});
    if(request.headers.get("origin")!==u.origin)throw new Fault("origin_denied","Same-origin upload required",403);
    if(Number(request.headers.get("content-length"))>8_500_000)throw new Fault("too_large","Upload limit is 8 MB",413);
    const form=await request.formData(),file=form.get("file");
    if(!file||typeof file==="string")throw new Fault("file_required","Choose a supported file");
    if(file.size>8_000_000||!mimeTypes.includes(file.type))throw new Fault("unsupported_file","Supported: PNG/JPEG/WebP, PDF, MP3/WAV/WebM/MP4 audio; maximum 8 MB",413);
    const id=crypto.randomUUID(),key=`${owner}/${id}`;
    await env.BUCKET.put(key,file.stream(),{httpMetadata:{contentType:file.type}});
    try{
      const result=await transact(repo,owner,{action:"put",kind:"source",id:`file-${id}`,key:`upload-${id}`,data:{title:file.name,fileId:id,mimeType:file.type,size:file.size,courseId:form.get("courseId")||undefined,editable:false,origin:"learner authorized original upload",versionLabel:"1",limitations:file.type==="application/pdf"?["Original PDF retained; automatic text/OCR extraction is unavailable. The tutor must inspect authorized pages before citing them."]:file.type.startsWith("audio/")?["Original audio retained; transcription and pronunciation require actual audio inspection, never inferred from text."]:["Original image retained; interpretation uncertainty must be stated before grading."]}},"learner");return Response.json(result,{headers:{"Cache-Control":"private, no-store"}});
    }catch(e){await env.BUCKET.delete(key);throw e;}
  }catch(e){return Response.json({error:e instanceof Error?e.message:"File operation failed",saved:false},{status:e instanceof Fault?e.status:400});}
}
