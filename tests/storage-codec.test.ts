import test from "node:test";
import assert from "node:assert/strict";
import {emptyState,fingerprint,jsonBytes} from "../lib/model.ts";
import {encodeState,decodeState,storedBytes} from "../lib/state-codec.ts";
test("storage encoding preserves exact private text and literal marker-shaped source objects",()=>{
  const state=emptyState(),text="Synthetic private teaching policy. ".repeat(100);
  state.records.source.example={id:"example",kind:"source",version:1,created:"",updated:"",data:{content:text,literal:{$lcText:fingerprint(text)},nested:{$lcLiteral:{$lcText:"a literal"}}}};
  const encoded=encodeState(state);assert.equal(Object.keys(encoded.texts).length,1);assert.deepEqual(decodeState(JSON.parse(JSON.stringify(encoded))),state);assert.deepEqual(decodeState(state),state);
});
test("repeated policy versions share text storage without erasing history or authorization",()=>{
  const state=emptyState(),text="Synthetic policy section with preserved exact wording. ".repeat(3000);
  for(let i=0;i<20;i++)state.history.push({id:`event-${i}`,before:{kind:"policy",id:"private-policy",version:i,data:{parts:[{name:"Manual",text}]}}});
  assert.ok(jsonBytes(state)>2_000_000);assert.ok(storedBytes(state)<200_000);
  const decoded=decodeState(encodeState(state));assert.equal(decoded.history.length,20);assert.equal(decoded.history[19].before.data.parts[0].text,text);assert.deepEqual(decoded.access,state.access);
});
