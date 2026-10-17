import { D1Repository,transact } from "./store.ts";
import { Fault } from "./model.ts";
const mimeTypes=["image/png","image/jpeg","image/webp","application/pdf","audio/mpeg","audio/wav","audio/webm","audio/mp4"];
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
