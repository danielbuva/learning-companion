import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const origin=process.env.LC_SMOKE_ORIGIN??'http://127.0.0.1:5180';
if(!['localhost','127.0.0.1'].includes(new URL(origin).hostname))throw new Error('Synthetic preview only.');
const signed=await fetch(origin+'/signin-with-chatgpt?return_to=/',{redirect:'manual'});
const cookie=signed.headers.getSetCookie().map(v=>v.split(';')[0]).join('; ');
async function read(command){const response=await fetch(origin+'/api/learning',{method:'POST',headers:{Cookie:cookie,Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(command)});assert.equal(response.status,200);return response.json();}
const sources=await read({action:'search',kind:'source',query:'synthetic-guide.pdf'});
const source=sources.records.find(r=>r.data.extraction?.pages===2);assert.ok(source,'Complete the browser PDF extraction journey first.');
const exact=await read({action:'get',kind:'source',id:source.id});
assert.match(exact.record.data.extractedText,/tentative distance/);assert.match(exact.record.data.extractedText,/1 \+ 2 = 3/);
const original=await fetch(origin+'/api/files?source='+source.id,{headers:{Cookie:cookie}});
const hash=v=>createHash('sha256').update(v).digest('hex');
assert.equal(hash(new Uint8Array(await original.arrayBuffer())),hash(await readFile('.private/fixtures/synthetic-guide.pdf')));
console.log('PASS: real browser extraction retained both pages, exact embedded text, and byte-identical original PDF.');
