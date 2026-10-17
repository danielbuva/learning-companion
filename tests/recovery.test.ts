import test from "node:test";
import assert from "node:assert/strict";
import {emptyState,evidence} from "../lib/model.ts";
import type {State,Command} from "../lib/model.ts";
import {execute} from "../lib/engine.ts";
import {transact,runJobs} from "../lib/store.ts";
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
test("cold workspace projections conceal nested expected outputs, including checkpoint copies",()=>{
  const repo=new Repo();run(repo.state,{action:"put",kind:"activity",id:"cold-code",data:{type:"code",mode:"assess",state:{expected:"SECRET_TARGET"},solution:"SECRET_SOLUTION"}});
  run(repo.state,{action:"put",kind:"session",id:"cold-session",data:{activityId:"cold-code"}});run(repo.state,{action:"checkpoint",id:"cold-session",version:1});
  const view=JSON.stringify(run(repo.state,{action:"snapshot"}));assert.ok(!view.includes("SECRET_TARGET"));assert.ok(!view.includes("SECRET_SOLUTION"));
});
test("record size limits count UTF-8 bytes rather than JavaScript characters",()=>{
  const repo=new Repo();assert.throws(()=>run(repo.state,{action:"put",kind:"source",id:"large-unicode",data:{content:"😀".repeat(80_000)}}),/300 KB/);
  assert.equal(repo.state.records.source["large-unicode"],undefined);
});
test("background preparation fails honestly when an authorized source version changes",async()=>{
  const repo=new Repo();seed(repo);repo.state.access.background=true;run(repo.state,{action:"request_job",id:"changed-source-job",data:{type:"memory_sheet",purpose:"Prepare the selected revision",sourceIds:["demo-algorithms-source"]}});
  run(repo.state,{action:"patch",kind:"source",id:"demo-algorithms-source",version:1,data:{content:"A revised assumption"}});await runJobs(repo,"owner");
  assert.equal(repo.state.records.job["changed-source-job"].data.status,"failed");assert.equal(repo.state.records.job["changed-source-job"].data.failureCode,"source_changed");assert.equal(repo.state.records.artifact["changed-source-job-output"],undefined);
});
test("source comparison keeps exact historical and current statements without learner attribution",()=>{
  const repo=new Repo();run(repo.state,{action:"put",kind:"source",id:"revision",data:{title:"Synthetic conventions",content:"Header\nOld assumption\nFooter"}});run(repo.state,{action:"patch",kind:"source",id:"revision",version:1,data:{content:"Header\nCorrected assumption\nFooter",origin:"instructor clarification"}});
  const compared=run(repo.state,{action:"compare",kind:"source",id:"revision",leftVersion:1,rightVersion:2});assert.deepEqual(compared.contentChanges.before.lines,["Old assumption"]);assert.deepEqual(compared.contentChanges.after.lines,["Corrected assumption"]);assert.equal(compared.left.version,1);assert.equal(Object.values(repo.state.records.attempt).length,0);
});
test("question validation performs structural checks without claiming semantic correctness",async()=>{
  const repo=new Repo();seed(repo);repo.state.access.background=true;run(repo.state,{action:"put",kind:"question",id:"leaky-question",data:{prompt:"The answer is four colors. What is it?",answer:"four colors",sourceIds:["demo-algorithms-source"]}});
  run(repo.state,{action:"request_job",id:"validate",data:{type:"validate_questions",purpose:"Check the synthetic item structure",sourceIds:["demo-algorithms-source"],questionIds:["leaky-question"]}});await runJobs(repo,"owner");
  const result=JSON.parse(repo.state.records.artifact["validate-output"].data.content);assert.equal(result.validated,false);assert.ok(result.checks[0].issues.includes("missing_criteria"));assert.ok(result.checks[0].issues.includes("possible_answer_leak"));assert.equal(Object.values(repo.state.records.attempt).length,0);
});
test("a learner-profile schema stays a template instead of becoming an actual personal profile",()=>{
  const repo=new Repo();run(repo.state,{action:"import_policy",id:"roles",data:{content:"<!-- BEGIN FILE: Learner_Profile_Template.yaml -->goals: []<!-- END FILE: Learner_Profile_Template.yaml --><!-- BEGIN FILE: Learner_Profile_Private.md -->Synthetic explicit preference<!-- END FILE: Learner_Profile_Private.md -->"}});
  assert.equal(Object.values(repo.state.records.profile).length,1);assert.equal(repo.state.records.artifact["roles-schema-0"].data.layer,"profile");assert.equal(repo.state.records.artifact["roles-schema-0"].data.template,true);
});
test("an empty numeric response is not a correct zero or evidence of inability",()=>{
  const repo=new Repo();run(repo.state,{action:"put",kind:"skill",id:"zero-skill",data:{title:"Zero is a number"}});run(repo.state,{action:"put",kind:"activity",id:"zero",data:{type:"card",validator:{type:"number",expected:0},skillIds:["zero-skill"]}});
  const result=run(repo.state,{action:"submit",id:"zero",version:1,data:{answer:"  "}});assert.equal(result.attempt.data.assessment.outcome,"no_attempt");assert.equal(evidence(repo.state,"zero-skill").status,"unassessed");
});
test("invalid items leave explicit coverage gaps and tutor responses cannot satisfy independence",()=>{
  const repo=new Repo();run(repo.state,{action:"put",kind:"question",id:"q",data:{prompt:"Return zero",points:1}});run(repo.state,{action:"put",kind:"assessment",id:"bar",data:{questionIds:["q"],rules:{threshold:1,independent:true}}});run(repo.state,{action:"put",kind:"activity",id:"a",data:{type:"card",questionId:"q",assessmentId:"bar",validator:{type:"number",expected:0}}});repo.state.access.write=true;
  const submitted=execute(repo.state,{action:"submit",id:"a",version:1,key:"tutor-response",data:{answer:"0"}},"tutor");
  const score=run(repo.state,{action:"get",kind:"assessment",id:"bar"}).record.data.result;assert.equal(score.total,1);assert.equal(score.rows[0].independent,false);assert.equal(score.passed,false);
  run(repo.state,{action:"invalidate",id:submitted.attempt.id,version:1,reason:"Defective item"});const invalid=run(repo.state,{action:"get",kind:"assessment",id:"bar"}).record.data.result;assert.equal(invalid.maximum,0);assert.equal(invalid.coverageComplete,false);assert.equal(invalid.next,"replace_defective_items");assert.match(invalid.explanation,/no learner failure/);
  assert.throws(()=>run(repo.state,{action:"grade",id:submitted.attempt.id,version:2,data:{reason:"Invalid points",assessment:{outcome:"correct",score:999}}}),/available points/);
});
