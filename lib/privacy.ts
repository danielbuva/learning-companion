import type {State} from "./model.ts";
export function tutorScope(state:State):State{
  if(!state.access.excluded.length)return state;
  const s=structuredClone(state),blocked=new Set(s.access.excluded),blockedFiles=new Set<string>();let changed=true;
  while(changed){changed=false;for(const group of Object.values(s.records))for(const r of Object.values(group)){
    if(blocked.has(r.id)){if(r.kind==="source"&&r.data.fileId&&!blockedFiles.has(r.data.fileId)){blockedFiles.add(r.data.fileId);changed=true;}continue;}
    const refs=[r.data.courseId,r.data.sourceId,r.data.activityId,r.data.sourcePolicy,r.data.branchedFrom,r.data.splitFrom,r.data.priorEvidenceReference,...(r.data.sourceIds??[]),...(r.data.skillIds??[]),...(r.data.mergedFrom??[]),...(r.data.priorEvidenceReferences??[])];
    if(refs.some(id=>blocked.has(id))||r.kind==="source"&&blockedFiles.has(r.data.fileId)||r.data.checkpoint&&[...blocked].some(id=>JSON.stringify(r.data.checkpoint).includes(id))){blocked.add(r.id);if(r.kind==="source"&&r.data.fileId)blockedFiles.add(r.data.fileId);changed=true;}
  }}
  for(const group of Object.values(s.records))for(const id of Object.keys(group))if(blocked.has(id))delete group[id];
  s.history=s.history.filter(e=>![...blocked].some(id=>JSON.stringify(e).includes(id)));s.receipts={};
  return s;
}
