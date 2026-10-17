import type {Repository} from "./store.ts";
import type {Json} from "./model.ts";
import {Fault,fingerprint} from "./model.ts";
import {execute} from "./engine.ts";
// Host-level MRTR inputResponses are intentionally outside model tool arguments.
// A tutor-supplied `arguments.data` cannot approve a grant.
export async function authorizeFromHost(repo:Repository,owner:string,params:Json):Promise<Json>{
  const capabilities=params._meta?.["io.modelcontextprotocol/clientCapabilities"];
  const supportsForm=capabilities?.elicitation&&(capabilities.elicitation.form!==undefined||capabilities.elicitation.url===undefined);
  if(!supportsForm&&!params.requestState)return {resultType:"complete",content:[{type:"text",text:"This client has not advertised native permission forms. The learner can approve routine tutor access in the private Site's Account & privacy view."}],structuredContent:{status:"requires_learner_consent",url:"https://learning-companion.copperplume66.chatgpt.site"}};
  for(let retry=0;retry<6;retry++){
    const {revision,state}=await repo.load(owner);state.consentChallenges??={};
    if(params.requestState){
      const challenge=state.consentChallenges[params.requestState];
      if(!challenge||challenge.expires<Date.now())throw new Fault("confirmation_expired","Request a fresh learner permission form.",403);
      if(challenge.resolved)return {resultType:"complete",content:[{type:"text",text:"Permission decision already saved."}],structuredContent:challenge.resolved};
      if(challenge.accessFingerprint!==fingerprint(state.access))throw new Fault("confirmation_stale","Permissions changed since this form opened. Request a fresh form.",409);
      const response=params.inputResponses?.consent;
      if(!response)throw new Fault("host_response_required","The host must supply the learner's form response outside tool arguments.",403);
      let result:Json;
      if(response.action!=="accept")result={status:"declined",saved:true,access:state.access};
      else{
        const values=response.content??{};for(const key of ["read","write","background","recording"])if(typeof values[key]!=="boolean")throw new Fault("invalid_confirmation","The permission form requires explicit boolean choices.");
        result=execute(state,{action:"consent",key:`host-consent-${params.requestState}`,data:values},"learner");
      }
      challenge.resolved=result;if(await repo.save(owner,revision,state))return {resultType:"complete",content:[{type:"text",text:JSON.stringify(result)}],structuredContent:result};
    }else{
      const token=crypto.randomUUID();state.consentChallenges[token]={expires:Date.now()+15*60_000,accessFingerprint:fingerprint(state.access)};
      for(const [id,c]of Object.entries(state.consentChallenges))if(c.expires<Date.now())delete state.consentChallenges[id];
      if(await repo.save(owner,revision,state))return {resultType:"input_required",requestState:token,inputRequests:{consent:{method:"elicitation/create",params:{mode:"form",message:"Choose the tutor's standing access to your private Learning Companion record. Routine updates cover learning records only. External services, publishing, sharing, and permanent deletion still require separate authorization. Background preparation has a 25-second limit and no external spend.",requestedSchema:{type:"object",properties:{read:{type:"boolean",title:"Allow tutor record reading",default:state.access.read},write:{type:"boolean",title:"Allow routine learning-record updates",default:false},background:{type:"boolean",title:"Allow bounded background preparation",default:false},recording:{type:"boolean",title:"Record learning activity",default:state.access.recording}},required:["read","write","background","recording"]}}}}};
    }
  }
  throw new Fault("busy","Permissions changed concurrently; reopen the form.",409);
}

export async function confirmFromHost(repo:Repository,owner:string,params:Json):Promise<Json>{
  const capabilities=params._meta?.["io.modelcontextprotocol/clientCapabilities"];
  if(!params.requestState&&!(capabilities?.elicitation&&(capabilities.elicitation.form!==undefined||capabilities.elicitation.url===undefined)))return {resultType:"complete",content:[{type:"text",text:"This client has no native confirmation form. Review the pending request in the private Site's Account & privacy view."}],structuredContent:{status:"requires_learner_confirmation",saved:false}};
  for(let retry=0;retry<6;retry++){
    const {revision,state}=await repo.load(owner);state.confirmationChallenges??={};
    if(!state.access.read)throw new Fault("read_denied","Tutor access is revoked; use the private learner interface.",403);
    if(params.requestState){
      const challenge=state.confirmationChallenges[params.requestState];
      if(!challenge||challenge.expires<Date.now())throw new Fault("confirmation_expired","Request a fresh confirmation form.",403);
      if(challenge.resolved)return {resultType:"complete",content:[{type:"text",text:"Decision already saved."}],structuredContent:challenge.resolved};
      const response=params.inputResponses?.confirmation;
      if(!response)throw new Fault("host_response_required","Only the host's learner response can approve this request.",403);
      const approved=response.action==="accept"&&response.content?.approve===true;
      const result=execute(state,{action:"confirm",id:challenge.requestId,version:challenge.requestVersion,approved,key:`host-confirm-${params.requestState}`},"learner");
      // Deletion may scrub cached state. Reinsert only this decision receipt, without deleted content.
      state.confirmationChallenges??={};state.confirmationChallenges[params.requestState]={...challenge,resolved:result};
      if(await repo.save(owner,revision,state))return {resultType:"complete",content:[{type:"text",text:JSON.stringify(result)}],structuredContent:result};
    }else{
      const request=state.records.share[params.arguments?.requestId];
      if(!request||request.data.status!=="awaiting_learner_confirmation")throw new Fault("request_unavailable","This confirmation request is unavailable or already resolved.",404);
      const token=crypto.randomUUID();state.confirmationChallenges[token]={expires:Date.now()+15*60_000,requestId:request.id,requestVersion:request.version};
      for(const [id,c]of Object.entries(state.confirmationChallenges))if(c.expires<Date.now())delete state.confirmationChallenges[id];
      if(await repo.save(owner,revision,state))return {resultType:"input_required",requestState:token,inputRequests:{confirmation:{method:"elicitation/create",params:{mode:"form",message:request.data.type==="request_delete"?`${request.data.title}. This permanently erases the selected learning record and related checkpoints, evidence, and originals. It cannot be undone. This does not delete unrelated records.`:`${request.data.title}. Approve only this selected snapshot for the declared purpose and destination: ${JSON.stringify(request.data.scope)}. This does not itself publish or send it; the tutor must separately perform and report any authorized delivery.`,requestedSchema:{type:"object",properties:{approve:{type:"boolean",title:request.data.type==="request_delete"?"Permanently delete the selected record":"Approve the selected sharing scope",default:false}},required:["approve"]}}}}};
    }
  }
  throw new Fault("busy","The request changed concurrently; reopen the form.",409);
}
