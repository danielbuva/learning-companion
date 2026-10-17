import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyState} from '../lib/model.ts';
import {authorizeFromHost} from '../lib/consent.ts';
class Repo{state=emptyState();revision=0;async load(){return {revision:this.revision,state:structuredClone(this.state)};}async save(_o:string,v:number,s:typeof this.state){if(v!==this.revision)return false;this.state=s;this.revision++;return true;}}
const supported={_meta:{'io.modelcontextprotocol/clientCapabilities':{elicitation:{form:{}}}}};
test('native consent does not grant access while a form is pending',async()=>{const repo=new Repo();const r=await authorizeFromHost(repo,'owner',supported);assert.equal(r.resultType,'input_required');assert.ok(r.inputRequests.consent);assert.equal(repo.state.access.write,false);});
test('model arguments cannot fabricate a native consent response',async()=>{const repo=new Repo();const r=await authorizeFromHost(repo,'owner',supported);await assert.rejects(()=>authorizeFromHost(repo,'owner',{requestState:r.requestState,arguments:{inputResponses:{consent:{action:'accept',content:{read:true,write:true,background:true,recording:true}}}}}),/host must supply/);assert.equal(repo.state.access.write,false);});
test('host consent response applies only explicit choices and is retry safe',async()=>{const repo=new Repo();const r=await authorizeFromHost(repo,'owner',supported);const params={requestState:r.requestState,inputResponses:{consent:{action:'accept',content:{read:true,write:true,background:false,recording:true}}}};await authorizeFromHost(repo,'owner',params);assert.equal(repo.state.access.write,true);assert.equal(repo.state.access.background,false);const revision=repo.revision;await authorizeFromHost(repo,'owner',params);assert.equal(repo.revision,revision);});
test('native decline grants no capabilities',async()=>{const repo=new Repo();const r=await authorizeFromHost(repo,'owner',supported);await authorizeFromHost(repo,'owner',{requestState:r.requestState,inputResponses:{consent:{action:'decline'}}});assert.equal(repo.state.access.write,false);});
test('unsupported clients get an honest permission equivalent',async()=>{const repo=new Repo();const r=await authorizeFromHost(repo,'owner',{_meta:{'io.modelcontextprotocol/clientCapabilities':{elicitation:{url:{}}}}});assert.equal(r.structuredContent.status,'requires_learner_consent');assert.equal(repo.state.access.write,false);});
test('expired or stale forms cannot expand access',async()=>{const repo=new Repo();const r=await authorizeFromHost(repo,'owner',supported);repo.state.access.read=false;await assert.rejects(()=>authorizeFromHost(repo,'owner',{requestState:r.requestState,inputResponses:{consent:{action:'accept'}}}),/changed since/);assert.equal(repo.state.access.write,false);});

test('overview does not dump private policy bodies or personal profile content',async()=>{
 const {execute}=await import('../lib/engine.ts');const s=emptyState();
 execute(s,{action:'import_policy',id:'private',key:'private-import',data:{content:'<!-- BEGIN FILE: A_Tutor_Operating_Manual.md -->PRIVATE_ENGINE_BODY<!-- END FILE: A_Tutor_Operating_Manual.md --><!-- BEGIN FILE: Learner_Profile_Example.md -->PRIVATE_PROFILE_BODY<!-- END FILE: Learner_Profile_Example.md -->'}},'learner');
 const overview=JSON.stringify(execute(s,{action:'snapshot'},'learner'));assert.ok(!overview.includes('PRIVATE_ENGINE_BODY'));assert.ok(!overview.includes('PRIVATE_PROFILE_BODY'));
 const policy=execute(s,{action:'get',kind:'policy',id:'private',part:'A_Tutor_Operating_Manual.md'},'learner');assert.equal(policy.part.text,'PRIVATE_ENGINE_BODY');
});

test('synthetic demonstrations cannot create personal independent-performance evidence',async()=>{
 const {execute}=await import('../lib/engine.ts');const {demoCommands}=await import('../lib/synthetic.ts');const {evidence}=await import('../lib/model.ts');const s=emptyState();for(const c of demoCommands())execute(s,c,'learner');
 const r=execute(s,{action:'submit',id:'demo-graph',version:1,key:'synthetic-action',data:{selection:'C'}},'learner');assert.equal(r.attempt.data.actor,'synthetic');assert.equal(evidence(s,'demo-algorithms-skill-1').independentSuccesses,0);
});
