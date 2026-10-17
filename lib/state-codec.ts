import {fingerprint,jsonBytes,Fault} from "./model.ts";
import type {State} from "./model.ts";
type Encoded={encoding:"learning-text-dictionary-v1";state:any;texts:Record<string,string>};
// Deduplicate exact long strings across records, prior versions, and retry receipts.
// This is lossless storage encoding, not a change to evidence or an access grant.
export function encodeState(state:State):Encoded{
  const texts:Record<string,string>={},ids=new Map<string,string>();
  function encode(value:any):any{
    if(typeof value==="string"&&value.length>=1024){const known=ids.get(value);if(known)return {$lcText:known};let id=fingerprint(value),suffix=0;while(Object.hasOwn(texts,id)&&texts[id]!==value)id=`${fingerprint(value)}-${++suffix}`;texts[id]=value;ids.set(value,id);return {$lcText:id};}
    if(Array.isArray(value))return value.map(encode);
    if(value&&typeof value==="object"){
      const encoded=Object.fromEntries(Object.entries(value).filter(([,v])=>v!==undefined).map(([k,v])=>[k,encode(v)]));
      return Object.hasOwn(value,"$lcText")||Object.hasOwn(value,"$lcLiteral")?{$lcLiteral:encoded}:encoded;
    }
    return value;
  }
  return {encoding:"learning-text-dictionary-v1",state:encode(state),texts};
}
export function decodeState(value:any):State{
  if(value?.encoding!=="learning-text-dictionary-v1")return value as State;
  function decode(v:any,literal=false):any{
    if(Array.isArray(v))return v.map(x=>decode(x));
    if(v&&typeof v==="object"){
      if(!literal&&Object.keys(v).length===1&&Object.hasOwn(v,"$lcText")){if(!Object.hasOwn(value.texts,v.$lcText))throw new Fault("storage_corrupt","A stored text reference is unavailable. No empty record was substituted.",503);return value.texts[v.$lcText];}
      if(!literal&&Object.keys(v).length===1&&Object.hasOwn(v,"$lcLiteral"))return decode(v.$lcLiteral,true);
      return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,decode(x)]));
    }
    return v;
  }
  return decode(value.state) as State;
}
export const storedBytes=(state:State)=>jsonBytes(encodeState(state));
