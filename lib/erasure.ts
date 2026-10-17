import type {Repository} from "./store.ts";
// The record deletion and original-file erasure have different failure boundaries.
// Keep an outbox so an R2 failure cannot become a false "save failed" or lose retry work.
export async function flushFileDeletes(repo:Repository,owner:string,bucket:Pick<R2Bucket,"delete">|undefined){
  const {state}=await repo.load(owner),pending=(state.pendingFileDeletes??[]).slice(0,50);
  if(!pending.length)return {records:"deleted",originals:"complete"};
  if(!bucket)return {records:"deleted",originals:"pending_retry",remaining:pending.length};
  const deleted=new Set<string>();
  for(const id of pending){try{await bucket.delete(`${owner}/${id}`);deleted.add(id);}catch{}}
  for(let retry=0;retry<6;retry++){
    const {revision,state:current}=await repo.load(owner);current.pendingFileDeletes=(current.pendingFileDeletes??[]).filter(id=>!deleted.has(id));
    if(await repo.save(owner,revision,current))return {records:"deleted",originals:current.pendingFileDeletes.length?"pending_retry":"complete",remaining:current.pendingFileDeletes.length};
  }
  return {records:"deleted",originals:"pending_retry",remaining:pending.length};
}
