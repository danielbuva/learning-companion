import { emptyState, Fault } from "./model.ts";
import type { State, Command, Json } from "./model.ts";
import { execute, isRead } from "./engine.ts";
export interface Repository { load(owner:string):Promise<{revision:number;state:State}>; save(owner:string,revision:number,state:State):Promise<boolean> }
export function tutorScope(state:State):State{
  if(!state.access.excluded.length)return state;
  const s=structuredClone(state),blocked=new Set(s.access.excluded);let changed=true;
  while(changed){changed=false;for(const group of Object.values(s.records))for(const r of Object.values(group)){
    if(blocked.has(r.id))continue;
    const refs=[r.data.courseId,r.data.sourceId,r.data.activityId,r.data.sourcePolicy,...(r.data.sourceIds??[]),...(r.data.skillIds??[])];
    if(refs.some(id=>blocked.has(id))||r.data.checkpoint&&[...blocked].some(id=>JSON.stringify(r.data.checkpoint).includes(id))){blocked.add(r.id);changed=true;}
  }}
  for(const group of Object.values(s.records))for(const id of Object.keys(group))if(blocked.has(id))delete group[id];
  s.history=s.history.filter(e=>![...blocked].some(id=>JSON.stringify(e).includes(id)));s.receipts={};
  return s;
}
export class D1Repository implements Repository {
  constructor(private db:D1Database){}
  async load(owner:string){
    const r=await this.db.prepare("SELECT revision, document FROM learner_records WHERE owner = ?").bind(owner).first<{revision:number;document:string}>();
    return r?{revision:r.revision,state:JSON.parse(r.document) as State}:{revision:-1,state:emptyState()};
  }
  async save(owner:string,revision:number,state:State){
    const result=revision===-1
      ?await this.db.prepare("INSERT OR IGNORE INTO learner_records (owner, revision, document, updated) VALUES (?, 0, ?, ?)").bind(owner,JSON.stringify(state),new Date().toISOString()).run()
      :await this.db.prepare("UPDATE learner_records SET revision = revision + 1, document = ?, updated = ? WHERE owner = ? AND revision = ?").bind(JSON.stringify(state),new Date().toISOString(),owner,revision).run();
    return result.meta.changes===1;
  }
}
export async function transact(repo:Repository,owner:string,command:Command,actor="tutor"):Promise<Json>{
  for(let retry=0;retry<6;retry++){
    const {revision,state}=await repo.load(owner);
    // Mutate an isolated copy. A validation error or failed CAS never changes stored work.
    if(actor==="tutor"&&!isRead(command.action)&&command.id&&!tutorScope(state).records[command.kind??"activity"]?.[command.id]&&Object.values(state.records).some(g=>g[command.id!])&&state.access.excluded.length){
      const scoped=tutorScope(state);if(!Object.values(scoped.records).some(g=>g[command.id!]))throw new Fault("excluded","The learner excluded this record or its source.",403);
    }
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
