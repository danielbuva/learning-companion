import test from "node:test";
import assert from "node:assert/strict";
import {emptyState,evidence} from "../lib/model.ts";
import type {State,Command} from "../lib/model.ts";
import {execute} from "../lib/engine.ts";
import {transact} from "../lib/store.ts";
import {confirmFromHost} from "../lib/consent.ts";
import {flushFileDeletes} from "../lib/erasure.ts";
import {demoCommands} from "../lib/synthetic.ts";
class Repo{state=emptyState();revision=0;async load(){return {revision:this.revision,state:structuredClone(this.state)};}async save(_o:string,v:number,s:State){if(v!==this.revision)return false;this.state=s;this.revision++;return true;}}
let n=0;const run=(s:State,c:Command)=>execute(s,{key:`recovery-${++n}`,...c},"learner");
const supported={_meta:{"io.modelcontextprotocol/clientCapabilities":{elicitation:{form:{}}}}};
function seed(repo:Repo){for(const c of demoCommands())execute(repo.state,c,"learner");repo.state.access.write=true;}
test("native deletion is pending until an explicit host response, never tool arguments",async()=>{
  const repo=new Repo();seed(repo);const request=run(repo.state,{action:"request_delete",kind:"activity",id:"demo-graph"}).record;
  const form=await confirmFromHost(repo,"owner",{...supported,arguments:{requestId:request.id}});
  assert.ok(repo.state.records.activity["demo-graph"]);assert.equal(form.resultType,"input_required");
  await assert.rejects(()=>confirmFromHost(repo,"owner",{requestState:form.requestState,arguments:{inputResponses:{confirmation:{action:"accept",content:{approve:true}}}}}),/host/);
  assert.ok(repo.state.records.activity["demo-graph"]);
  const result=await confirmFromHost(repo,"owner",{requestState:form.requestState,inputResponses:{confirmation:{action:"accept",content:{approve:true}}}});
  assert.equal(result.structuredContent.permanent,true);assert.equal(repo.state.records.activity["demo-graph"],undefined);
  const revision=repo.revision;await confirmFromHost(repo,"owner",{requestState:form.requestState,inputResponses:{confirmation:{action:"accept",content:{approve:true}}}});assert.equal(repo.revision,revision);
});
test("stale deletion cannot erase a newer edit",async()=>{
  const repo=new Repo();seed(repo);const request=run(repo.state,{action:"request_delete",kind:"activity",id:"demo-graph"}).record;
  const form=await confirmFromHost(repo,"owner",{...supported,arguments:{requestId:request.id}});
  run(repo.state,{action:"patch",kind:"activity",id:"demo-graph",version:1,data:{title:"A newer draft"}});
  await assert.rejects(()=>confirmFromHost(repo,"owner",{requestState:form.requestState,inputResponses:{confirmation:{action:"accept",content:{approve:true}}}}),/version/);
  assert.equal(repo.state.records.activity["demo-graph"].data.title,"A newer draft");
});
test("deletion scrubs approved snapshots and keeps failed original erasure retryable",async()=>{
  const repo=new Repo();seed(repo);repo.state.records.source["demo-algorithms-source"].data.fileId="synthetic-file";
  const share=run(repo.state,{action:"request_share",kind:"source",id:"demo-algorithms-source"}).record;
  run(repo.state,{action:"confirm",id:share.id,version:1,approved:true});
  const request=run(repo.state,{action:"request_delete",kind:"course",id:"demo-algorithms"}).record;
  run(repo.state,{action:"confirm",id:request.id,version:1,approved:true});
  assert.ok(!JSON.stringify(repo.state).includes("A tentative distance is the best cost"));
  assert.ok(!Object.values(repo.state.records.share).some(r=>r.data.snapshot));
  const failed=await flushFileDeletes(repo,"owner",{delete:async()=>{throw new Error("Temporary object-store failure");}} as any);
  assert.equal(failed.originals,"pending_retry");assert.deepEqual(repo.state.pendingFileDeletes,["synthetic-file"]);
  const keys:string[]=[];const done=await flushFileDeletes(repo,"owner",{delete:async(key:string)=>{keys.push(key);}} as any);
  assert.equal(done.originals,"complete");assert.deepEqual(keys,["owner/synthetic-file"]);assert.deepEqual(repo.state.pendingFileDeletes,[]);
});
test("portable history imports preserve work and cannot certify independent evidence or transfer access",async()=>{
  const original=new Repo();seed(original);original.state.records.course["demo-algorithms"].data.synthetic=false;original.state.records.activity["demo-graph"].data.synthetic=false;
  const attempt=run(original.state,{action:"submit",id:"demo-graph",version:1,data:{selection:"C",reasoning:"The minimum is safe under nonnegative weights."}}).attempt;
  run(original.state,{action:"grade",id:attempt.id,version:1,data:{assessment:{outcome:"correct",score:1,reasoning:"sound",dimensions:["apply","discriminate"]},reason:"Synthetic fixture rubric"}});
  const exported=run(original.state,{action:"export",format:"json"});
  const restored=new Repo();await transact(restored,"owner",{action:"import",key:"restore",data:exported.content},"learner");
  assert.equal(restored.state.access.write,false);assert.equal(Object.values(restored.state.records.attempt).length,1);
  assert.equal(evidence(restored.state,"demo-algorithms-skill-1").independentSuccesses,0);
  assert.deepEqual(restored.state.records.activity["demo-graph"].data.state.distances,{A:0,B:3,C:1,D:6,E:null});
  const before=JSON.stringify(restored.state);await assert.rejects(()=>transact(restored,"owner",{action:"import",key:"collision",data:exported.content},"learner"),/already exists/);assert.equal(JSON.stringify(restored.state),before);
  await transact(restored,"owner",{action:"import",key:"copy",data:{...exported.content,namespace:"copy"}},"learner");assert.equal(restored.state.records.activity["copy-demo-graph"].data.courseId,"copy-demo-algorithms");
});
test("unmastered-only exports omit mixed sources and honor the selected evidence standard",()=>{
  const repo=new Repo();seed(repo);repo.state.records.course["demo-algorithms"].data.synthetic=false;repo.state.records.activity["demo-graph"].data.synthetic=false;
  const a=run(repo.state,{action:"submit",id:"demo-graph",version:1,data:{selection:"C"}}).attempt;
  run(repo.state,{action:"grade",id:a.id,version:1,data:{assessment:{outcome:"correct",reasoning:"sound",dimensions:["apply","discriminate"]},reason:"Synthetic fixture rubric"}});
  const skill=repo.state.records.activity["demo-graph"].data.skillIds[0];assert.equal(evidence(repo.state,skill).status,"locally_ready");
  const source=repo.state.records.source["demo-algorithms-source"];
  run(repo.state,{action:"patch",kind:"source",id:source.id,version:1,data:{sections:[{skillIds:[skill],content:"CLEARED_SECTION"},{skillIds:["demo-algorithms-skill-3"],content:"UNCLEARED_SECTION"}]}});
  const local=run(repo.state,{action:"export",unmasteredOnly:true,format:"markdown"});assert.ok(!/^CLEARED_SECTION$/m.test(local.content));assert.ok(local.content.includes("UNCLEARED_SECTION"));
  const robust=run(repo.state,{action:"export",unmasteredOnly:true,evidenceStandard:"robust",format:"markdown"});assert.ok(robust.content.includes("CLEARED_SECTION"));
});
