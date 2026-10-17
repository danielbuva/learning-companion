import assert from 'node:assert/strict';
const origin=process.env.LC_SMOKE_ORIGIN??'http://127.0.0.1:5180';
const target=new URL(origin);if(!['127.0.0.1','localhost'].includes(target.hostname))throw new Error('Local smoke is restricted to loopback synthetic auth.');
const signIn=await fetch(origin+'/signin-with-chatgpt?return_to=/',{redirect:'manual'});
const cookie=signIn.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ');
if(!cookie)throw new Error('Local synthetic sign-in unavailable.');
async function request(path,body){const r=await fetch(origin+path,{method:'POST',headers:{'Content-Type':'application/json',Cookie:cookie,Origin:origin,Accept:'application/json, text/event-stream','MCP-Protocol-Version':'2026-07-28'},body:JSON.stringify(body)});return {response:r,value:await r.json()};}
const api=async command=>{const {response,value}=await request('/api/learning',command);if(!response.ok)throw new Error(JSON.stringify(value));return value;};
const mcp=async(name,args)=>{const {value}=await request('/mcp',{jsonrpc:'2.0',id:crypto.randomUUID(),method:'tools/call',params:{name,arguments:args}});if(value.error)throw new Error(JSON.stringify(value.error));return value.result.structuredContent;};
const initial=await api({action:'snapshot'}),oldAccess=initial.access;
const id='http-smoke-'+crypto.randomUUID();
try{
  const discovered=await request('/mcp',{jsonrpc:'2.0',id:1,method:'server/discover',params:{_meta:{'io.modelcontextprotocol/protocolVersion':'2026-07-28'}}});
  assert.ok(discovered.value.result.supportedVersions.includes('2026-07-28'));
  await api({action:'consent',key:id+'-grant',data:{write:true,read:true,background:true,recording:true}});
  await mcp('learning_write',{action:'source_course',id,key:id+'-course',data:{title:'Synthetic HTTP verification',goal:'Verify real durable tool calls',content:'# Synthetic guide\n## A testable relation\nInspect assumptions before applying a method.'}});
  await Promise.all(['a','b'].map(suffix=>mcp('learning_write',{action:'put',kind:'activity',id:id+'-'+suffix,key:id+'-'+suffix,data:{title:'Synthetic activity '+suffix,type:'card',courseId:id,prompt:'State one assumption.',draft:{answer:''}}})));
  const submitted=await mcp('learning_write',{action:'submit',id:id+'-a',version:1,key:id+'-submission',learnerResponse:true,data:{answer:'The relevant condition holds.'}});
  const retry=await mcp('learning_write',{action:'submit',id:id+'-a',version:1,key:id+'-submission',learnerResponse:true,data:{answer:'The relevant condition holds.'}});
  assert.equal(submitted.attempt.id,retry.attempt.id);
  const res=await mcp('learning_read',{action:'get',kind:'activity',id:id+'-a'});assert.equal(res.record.data.draft.answer,'The relevant condition holds.');
  const conflict=await request('/mcp',{jsonrpc:'2.0',id:9,method:'tools/call',params:{name:'learning_write',arguments:{action:'patch',kind:'activity',id:id+'-a',version:1,key:id+'-conflict',data:{draft:{answer:'stale'}}}}});assert.equal(conflict.value.error.data.code,'conflict');assert.equal(conflict.value.id,9);
  const pack=await mcp('learning_write',{action:'request_job',id:id+'-job',key:id+'-job',data:{type:'practice_pack',purpose:'Synthetic preparation',sourceIds:[id+'-source']}});assert.equal(pack.record.data.status,'queued');
  let job;for(let i=0;i<20;i++){job=(await mcp('learning_read',{action:'get',kind:'job',id:id+'-job'})).record;if(job.data.status==='completed')break;await new Promise(r=>setTimeout(r,100));}assert.equal(job.data.status,'completed');
  const png=Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j5XsAAAAASUVORK5CYII='),c=>c.charCodeAt(0));
  const form=new FormData();form.set('courseId',id);form.set('file',new File([png],'synthetic-pixel.png',{type:'image/png'}));
  const uploaded=await fetch(origin+'/api/files',{method:'POST',headers:{Cookie:cookie,Origin:origin},body:form});const file=await uploaded.json();assert.equal(uploaded.status,200);
  const original=await fetch(origin+'/api/files?source='+file.record.id,{headers:{Cookie:cookie}});assert.deepEqual(new Uint8Array(await original.arrayBuffer()),png);
  const viaTool=await mcp('learning_source_upload',{key:id+'-tool-upload',name:'synthetic-pixel.png',mimeType:'image/png',base64:Buffer.from(png).toString('base64'),courseId:id});
  const originalTool=await request('/mcp',{jsonrpc:'2.0',id:11,method:'tools/call',params:{name:'learning_source_file',arguments:{sourceId:viaTool.record.id}}});assert.equal(originalTool.value.result.content[0].data,Buffer.from(png).toString('base64'));
  const docx=await mcp('learning_read',{action:'export',ids:[id+'-source'],format:'docx'});assert.equal(Buffer.from(docx.base64,'base64').readUInt32LE(0),0x04034b50);
  const unauthorized=await fetch(origin+'/api/learning',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:'{"action":"snapshot"}'});assert.equal(unauthorized.status,401);
  console.log('PASS: actual local HTTP MCP discovery/read/write, separate exercise writes, idempotent submission, stale-version rejection, background completion, original image storage/readback, Word export, and missing-identity refusal.');
}finally{
  const course=await api({action:'get',kind:'course',id}).catch(()=>null);
  if(course){const req=await api({action:'request_delete',kind:'course',id,key:id+'-request-cleanup'});await api({action:'confirm',id:req.record.id,version:req.record.version,approved:true,key:id+'-cleanup'});}
  await api({action:'consent',key:id+'-restore-grants',data:oldAccess});
}
