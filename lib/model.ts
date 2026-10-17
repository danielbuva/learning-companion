export type Json = Record<string, any>;
export const kinds = ["profile", "course", "source", "skill", "question", "attempt", "plan", "review", "session", "activity", "assessment", "artifact", "policy", "job", "preference", "connection", "share"] as const;
export type Kind = typeof kinds[number];
export type Item = { id: string; kind: Kind; version: number; created: string; updated: string; data: Json };
export type State = {
  schema: 1; records: Record<string, Record<string, Item>>; history: Json[];
  receipts: Record<string, { digest: string; result: Json }>;
  tombstones: string[]; exposures: Record<string, number>;
  access: { read: boolean; write: boolean; background: boolean; recording: boolean; excluded: string[] };
  consentChallenges?:Record<string,{expires:number;resolved?:Json;accessFingerprint:string}>;
  confirmationChallenges?:Record<string,{expires:number;requestId:string;requestVersion:number;resolved?:Json}>;
  pendingFileDeletes?:string[];
};
export type Command = { action: string; kind?: Kind; id?: string; version?: number; key?: string; data?: Json; [key: string]: any };
export class Fault extends Error {
  constructor(public code: string, message: string, public status = 400) { super(message); }
}
export const emptyState = (): State => ({ schema: 1, records: Object.fromEntries(kinds.map(k => [k, {}])), history: [], receipts: {}, tombstones: [], exposures: {}, access: { read: true, write: false, background: false, recording: true, excluded: [] } });
export const all = (s: State, kind: string): Item[] => Object.values(s.records[kind] ?? {});
export const jsonBytes=(value:unknown)=>new TextEncoder().encode(JSON.stringify(value)).byteLength;
export function item(s: State, kind: string, id: string): Item {
  const r = s.records[kind]?.[id];
  if (!r) throw new Fault("not_found", `${kind} ${id} is unavailable or deleted.`, 404);
  return r;
}
export function checkVersion(r: Item, version?: number) {
  if (version !== r.version) throw new Fault("conflict", `Expected version ${r.version}; fetch current state before editing.`, 409);
}
export function fingerprint(value: unknown): string {
  const stable = (v: any): string => v && typeof v === "object" ? Array.isArray(v) ? `[${v.map(stable)}]` : `{${Object.keys(v).sort().map(k => `${JSON.stringify(k)}:${stable(v[k])}`).join(",")}}` : JSON.stringify(v);
  const input = stable(value); let a = 2166136261, b = 5381;
  for (const ch of input) { a = Math.imul(a ^ ch.charCodeAt(0), 16777619); b = Math.imul(b, 33) ^ ch.charCodeAt(0); }
  return (a >>> 0).toString(16) + (b >>> 0).toString(16);
}
export const dimensions = ["retrieve", "explain", "apply", "discriminate", "transfer", "generate", "independence"];
export function evidence(s: State, skillId: string) {
  const attempts = all(s, "attempt").filter(a => a.data.skillIds?.includes(skillId) && !a.data.invalidated && a.data.actor === "learner" && !["defective","no_attempt"].includes(a.data.assessment?.outcome));
  const dims: Json = Object.fromEntries(dimensions.map(d => [d, "?"]));
  const independent = attempts.filter(a => a.data.support === 0 && !a.data.exposed && a.data.origin !== "self_reported" && a.data.origin !== "imported" && a.data.assessment?.outcome === "correct");
  for (const d of dimensions) {
    const relevant = attempts.filter(a => a.data.assessment?.dimensions?.includes(d));
    const clean = independent.filter(a => relevant.includes(a));
    const supported = relevant.filter(a => a.data.assessment?.outcome === "correct");
    if (relevant.length) dims[d] = clean.length >= 2 ? 3 : clean.length ? 2 : supported.length ? 1 : 0;
  }
  dims.independence = independent.length >= 2 ? 3 : independent.length ? 2 : attempts.length ? 0 : "?";
  const sound = independent.some(a => a.data.assessment.reasoning === "sound");
  const contrast = independent.some(a => a.data.novelty === "near_transfer" || a.data.assessment.dimensions?.includes("discriminate"));
  const locallyReady = independent.length > 0 && sound && contrast;
  const delayed = independent.some(a => a.data.delayed === true && a.data.delayEvidence?.previousAt && Date.parse(a.created) > Date.parse(a.data.delayEvidence.previousAt));
  const robust = locallyReady && (delayed || independent.some(a => a.data.novelty === "near_transfer" && a.data.unlabelled === true));
  const retrievalFailure = attempts.some(a => a.data.delayed && a.data.assessment?.outcome === "incorrect" && !attempts.some(b => b.created > a.created && b.data.delayed && b.data.assessment?.outcome === "correct"));
  return { status: retrievalFailure ? "needs_review" : robust ? "robust" : locallyReady ? "locally_ready" : attempts.length ? "developing" : "unassessed", dimensions: dims, retention: delayed ? "demonstrated_delayed" : "unobserved", uncertainty: independent.length >= 2 ? "medium" : "high", attempts: attempts.map(a => a.id), independentSuccesses: independent.length, reason: !attempts.length ? "No assessed learner work yet." : !independent.length ? "Supported, exposed, or incomplete evidence; independent performance remains untested." : !sound ? "A correct independent answer is recorded; decisive reasoning remains untested." : !contrast ? "A contrasting or varied independent case is still needed." : retrievalFailure ? "Delayed retrieval needs review; prior application evidence is preserved." : "Independent reasoning and a varied case are recorded. Retention is a separate dimension." };
}
export function adaptive(observation: Json): Json {
  if (observation.directAnswer) return { function: "teach", action: "direct_solution", support: 6, evidence: "exposure_only", next: "Provide the requested answer; no compulsory quiz." };
  if (observation.repeatedStall >= 2) return { function: "restore_progress", action: "switch_representation", next: "Use a concrete contrast or worked substep; do not reword the same failed hint." };
  if (observation.response === "no_attempt") return { function: "teach", action: "compact_model", next: "Supply the missing prerequisite, then offer one feasible action." };
  if (observation.outcome === "correct" && observation.support > 0) return { function: "fade", action: "remove_one_support_layer", next: "Use a fresh parallel item without the revealed structure." };
  if (observation.outcome === "correct" && observation.reasoning === "sound") return { function: "test", action: "boundary_or_transfer", next: "Change a meaningful condition or move on with a review tag." };
  if (observation.outcome === "correct") return { function: "diagnose", action: "decisive_reasoning", next: "Ask for the governing relation only when it affects the move-on decision." };
  if (observation.reasoning === "sound" || observation.reasoning === "locally_valid") return { function: "restore_progress", action: "local_error_flag", next: "Preserve valid work; inspect the earliest consequential divergence." };
  return { function: "diagnose", action: "distinguishing_microcase", hypotheses: [{ claim: "Task interpretation or missing rule", uncertainty: "high" }], next: "Use one targeted probe; do not infer a durable trait." };
}
export function publicActivity(r: Item): Item {
  const copy = structuredClone(r);
  delete copy.data.answer; delete copy.data.solution; delete copy.data.hints;
  delete copy.data.privateTests; delete copy.data.answerKey;
  if(copy.data.initialState)for(const key of ["answer","solution","hints","answerKey","privateTests"])delete copy.data.initialState[key];
  for(const state of [copy.data.state,copy.data.initialState?.state])if(state)for(const key of ["expected","answer","solution","answerKey","privateTests"])delete state[key];
  if(copy.data.validator)copy.data.validator={type:copy.data.validator.type};
  return copy;
}
