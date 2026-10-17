import { emptyState, Fault } from "./model.ts";
import type { State, Command, Json } from "./model.ts";
import { execute, isRead } from "./engine.ts";
import {encodeState,decodeState} from "./state-codec.ts";
import {tutorScope} from "./privacy.ts";
export interface Repository { load(owner:string):Promise<{revision:number;state:State}>; save(owner:string,revision:number,state:State):Promise<boolean> }
export {tutorScope} from "./privacy.ts";
export class D1Repository implements Repository {
  constructor(private db:D1Database){}
  async load(owner:string){
    const r=await this.db.prepare("SELECT revision, document FROM learner_records WHERE owner = ?").bind(owner).first<{revision:number;document:string}>();
    return r?{revision:r.revision,state:decodeState(JSON.parse(r.document))}:{revision:-1,state:emptyState()};
  }
  async save(owner:string,revision:number,state:State){
    const result=revision===-1
      ?await this.db.prepare("INSERT OR IGNORE INTO learner_records (owner, revision, document, updated) VALUES (?, 0, ?, ?)").bind(owner,JSON.stringify(encodeState(state)),new Date().toISOString()).run()
      :await this.db.prepare("UPDATE learner_records SET revision = revision + 1, document = ?, updated = ? WHERE owner = ? AND revision = ?").bind(JSON.stringify(encodeState(state)),new Date().toISOString(),owner,revision).run();
    return result.meta.changes===1;
  }
}
export async function transact(repo:Repository,owner:string,command:Command,actor="tutor"):Promise<Json>{
  for(let retry=0;retry<6;retry++){
    const {revision,state}=await repo.load(owner);
    // Mutate an isolated copy. A validation error or failed CAS never changes stored work.
    if(actor==="tutor"&&!isRead(command.action)&&state.access.excluded.length){const scoped=tutorScope(state),refs=[command.id,...(command.ids??[]),command.data?.courseId,command.data?.sourceId,command.data?.activityId,...(command.data?.sourceIds??[]),...(command.data?.skillIds??[]),...(command.data?.questionIds??[])];for(const id of refs)if(id&&Object.values(state.records).some(g=>Object.hasOwn(g,id))&&!Object.values(scoped.records).some(g=>Object.hasOwn(g,id)))throw new Fault("excluded","The learner excluded this record or a referenced source.",403);const originalFile=command.data?.fileId;if(originalFile&&Object.values(state.records.source).some(r=>r.data.fileId===originalFile&&!Object.hasOwn(scoped.records.source,r.id)))throw new Fault("excluded","The original file is outside the tutor's selected scope.",403);}
    const result=execute(actor==="tutor"&&isRead(command.action)?tutorScope(state):state,command,actor);
    if(isRead(command.action)||command.action==="discover")return {...result,revision};
    if(await repo.save(owner,revision,state))return {...result,revision:revision+1};
  }
  throw new Fault("busy","Several concurrent edits occurred. Your draft is retained; refresh and retry.",409);
}
export async function runJobs(repo:Repository,owner:string){
  const started=Date.now();const {state}=await repo.load(owner);
  for(const job of Object.values(state.records.job)){
    if(Date.now()-started>25_000)break;
    if(job.data.status!=="queued")continue;
    try{await transact(repo,owner,{action:"finish_job",id:job.id,version:job.version,key:`worker-${job.id}-${job.data.generation}`},"worker");}
    catch(error){if(!(error instanceof Fault))throw error;if(!["conflict","busy","job_changed"].includes(error.code))await transact(repo,owner,{action:"fail_job",id:job.id,version:job.version,key:`worker-failure-${job.id}-${job.data.generation}`,code:error.code,reason:error.message},"worker").catch(()=>{});}
  }
}
