import {build} from 'esbuild';
import {readdir,mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
await mkdir('.sites-runtime/tests',{recursive:true});
const entries=(await readdir('tests')).filter(p=>p.endsWith('.test.ts')).map(p=>'tests/'+p);
await build({entryPoints:entries,outdir:'.sites-runtime/tests',bundle:true,platform:'node',format:'esm',target:'node22',packages:'external'});
const result=spawnSync(process.execPath,['--test',...entries.map(p=>p.replace('tests/','.sites-runtime/tests/').replace('.ts','.js'))],{stdio:'inherit'});
process.exit(result.status??1);
