import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {target,fixture,inventory,node,quiet}=require('./fixtures/independent-graphs.cjs');
const {runCli,runCliAsync}=require(path.join(target,'dist/cli.js'));
const {previewGraphRegistry,applyGraphRegistry}=require(path.join(target,'dist/core/graph_selection.js'));
const exception='\n/memory/personal/\n!/memory/personal/\n/memory/personal/*\n!/memory/personal/.mdkg/\n/memory/personal/.mdkg/*\n!/memory/personal/.mdkg/work/\n';
function ft(name,fn){test(name,async t=>{const x=fixture();try{await fn(x,t);}finally{x.cleanup();}});}
function publicContents(x){const file=path.join(x.personal,'.mdkg/config.json'),c=JSON.parse(fs.readFileSync(file));c.workspaces.root.visibility='public';fs.writeFileSync(file,JSON.stringify(c,null,2)+'\n');}
function secondRoot(x){const root=path.join(x.host,'memory/disposable');fs.mkdirSync(root);quiet(()=>require(path.join(target,'dist/commands/init.js')).runInitCommand({root}));x.register('disposable','memory/disposable');return root;}
function changeHost(x){fs.writeFileSync(path.join(x.host,'.mdkg/working-host.json'),JSON.stringify({format:'mdkg-working-host',version:1,host_id:crypto.randomUUID()}));}
function registry(x){return JSON.parse(fs.readFileSync(path.join(x.host,'.mdkg-graphs.local.json')));}
function applyUnregister(x){const args=['graph','unregister','disposable','--json'],p=JSON.parse(x.ok(args).stdout);x.ok([...args,'--apply','--plan-hash',p.plan_hash]);}
function assertNoPrivateStaged(x){
  x.f.git.run(x.host,['add','--','.']);
  assert.equal(x.f.git.run(x.host,['ls-files','--cached','--','memory/personal']).stdout,'');
  const payload=x.f.git.run(x.host,['diff','--cached','--']).stdout;
  assert.doesNotMatch(payload,/private synthetic canary|PRIVATE_REVIEW_CANARY|mdkg-graph-registry/);
}

ft('private registration refuses normalized export scopes before effects on both entrypoints',async(x,t)=>{
  publicContents(x);x.register();
  const cases=[];
  for(const visibility of ['public','PUBLIC','Public','internal','INTERNAL','Internal']) {
    cases.push(['pack','task-1','--visibility',visibility,'--out','refused.md']);
    cases.push(['capability','list','--visibility',visibility,'--json']);
  }
  for(const flag of ['--profile','--pack-profile'])for(const profile of ['public','PUBLIC','Public'])
    cases.push(['bundle','create',flag,profile,'--output','refused.zip','--json']);
  for(const [label,invoke] of [['sync',runCli],['async',runCliAsync]])for(const args of cases) {
    await t.test(label+': '+args.join(' '),async()=>{
      const before=inventory(x.host),logs=[],errors=[];
      const code=await invoke([...args,'--graph','personal'],{cwd:()=>x.host,log:s=>logs.push(String(s)),error:s=>errors.push(String(s))});
      assert.equal(code,1);assert.match(errors.join('\n'),/private graph/);
      assert.doesNotMatch(logs.join('\n'),/private synthetic canary/);
      assert.deepEqual(inventory(x.host),before);
    });
  }
  for(const visibility of ['private','PRIVATE','Private']) {
    const name='allowed-'+visibility+'.md';x.ok(['pack','task-1','--graph','personal','--visibility',visibility,'--out',name]);
    assert.match(fs.readFileSync(path.join(x.personal,name),'utf8'),/private synthetic canary/);
  }
  for(const profile of ['private','PRIVATE']) {
    const name='allowed-'+profile+'.zip';x.ok(['bundle','create','--graph','personal','--profile',profile,'--output',name,'--json']);
    const entries=require(path.join(target,'dist/util/zip.js')).readZipEntries(fs.readFileSync(path.join(x.personal,name)));
    assert.match(entries.map(e=>e.data.toString('utf8')).join('\n'),/private synthetic canary/);
  }
});

ft('registration previews a final whole-directory exclusion over authored exceptions before ordinary Git staging',x=>{
  const file=path.join(x.host,'.gitignore');fs.appendFileSync(file,exception);
  const authored=fs.readFileSync(file,'utf8'),graphBefore=inventory(x.personal);
  const args=['graph','register','personal','--target','memory/personal','--json'],p=JSON.parse(x.ok(args).stdout);
  assert.ok(p.ignore_additions.includes('/memory/personal/'));assert.equal(fs.readFileSync(file,'utf8'),authored);
  x.ok([...args,'--apply','--plan-hash',p.plan_hash]);assert.deepEqual(inventory(x.personal),graphBefore);
  assert.ok(fs.readFileSync(file,'utf8').startsWith(authored));
  x.ok(['new','task','PRIVATE_REVIEW_CANARY_IGNORE_EXCEPTION','--graph','personal','--json']);
  assertNoPrivateStaged(x);
});

ft('authored later exceptions refuse selected reads and writes until an explicit exclusion preview is applied',x=>{
  x.register();const file=path.join(x.host,'.gitignore');fs.appendFileSync(file,exception);
  const authored=fs.readFileSync(file,'utf8'),before=inventory(x.host);
  assert.equal(x.f.git.run(x.host,['check-ignore','memory/personal/.mdkg/config.json']).status,0);
  for(const args of [['new','task','PRIVATE_REVIEW_CANARY_IGNORE_EXCEPTION','--json'],['show','task-1','--json']]) {
    const r=x.cmd([...args,'--graph','personal']);assert.equal(r.status,1);assert.match(r.stderr,/private graph root must remain ignored/);
    assert.deepEqual(inventory(x.host),before);
  }
  // Refusal preserves authored rules; repair is a separate reviewed mutation.
  const args=['graph','register','personal','--target','memory/personal','--json'],p=JSON.parse(x.ok(args).stdout);
  assert.ok(p.ignore_additions.includes('/memory/personal/'));assert.equal(fs.readFileSync(file,'utf8'),authored);
  x.ok([...args,'--apply','--plan-hash',p.plan_hash]);assert.ok(fs.readFileSync(file,'utf8').startsWith(authored));
  x.ok(['new','task','PRIVATE_REVIEW_CANARY_REPAIRED','--graph','personal','--json']);assertNoPrivateStaged(x);
});

ft('fully ignored private tasks events scratch mirrors and future files remain absent from staged payload',x=>{
  x.register();x.ok(['task','update','task-1','--note','PRIVATE_REVIEW_CANARY_EVENT','--graph','personal','--json']);
  for(const rel of ['future/PRIVATE_REVIEW_CANARY.txt','.agents/skills/private/SKILL.md','.mdkg/working/future/note.md']) {
    const file=path.join(x.personal,rel);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,'PRIVATE_REVIEW_CANARY');
  }
  assertNoPrivateStaged(x);
  const p=previewGraphRegistry(x.host,{action:'register',name:'personal',target:'memory/personal',visibility:'private'});
  assert.deepEqual(p.ignore_additions,[]);
});

ft('unrelated unregister preserves prior host binding and leaves remaining mappings refused',x=>{
  x.register();const second=secondRoot(x),original=registry(x),personalBefore=inventory(x.personal),secondBefore=inventory(second);
  changeHost(x);assert.match(x.cmd(['show','task-1','--graph','personal','--json']).stderr,/host namespace binding changed/);
  applyUnregister(x);
  const after=registry(x);assert.deepEqual(after.default_binding,original.default_binding);
  assert.deepEqual(after.graphs,original.graphs.filter(e=>e.name==='personal'));
  const r=x.cmd(['show','task-1','--graph','personal','--json']);assert.equal(r.status,1);assert.match(r.stderr,/host namespace binding changed/);
  assert.deepEqual(inventory(x.personal),personalBefore);assert.deepEqual(inventory(second),secondBefore);
  const before=inventory(x.host);assert.equal(x.cmd(['graph','register','personal','--target','memory/personal','--json']).status,1);assert.deepEqual(inventory(x.host),before);
});

ft('unavailable mapping removal preserves host binding and remaining graph bytes after a host change',x=>{
  x.register();const second=secondRoot(x),original=registry(x),before=inventory(x.personal),retained=path.join(x.host,'memory/retained');
  fs.renameSync(second,retained);const secondBefore=inventory(retained);changeHost(x);applyUnregister(x);
  assert.deepEqual(registry(x).default_binding,original.default_binding);assert.deepEqual(inventory(x.personal),before);assert.deepEqual(inventory(retained),secondBefore);
  assert.equal(x.cmd(['show','task-1','--graph','personal','--json']).status,1);
});

ft('host mutation after unregister preview refuses stale apply without approving remaining mappings',x=>{
  x.register();secondRoot(x);const p=previewGraphRegistry(x.host,{action:'unregister',name:'disposable'}),original=registry(x);
  changeHost(x);const before=inventory(x.host);
  assert.throws(()=>applyGraphRegistry(x.host,p,p.plan_hash),/stale registry plan/);
  assert.deepEqual(registry(x),original);assert.deepEqual(inventory(x.host),before);
});

ft('host mutation under unregister writer lock is detected and retains original registry binding',x=>{
  x.register();secondRoot(x);const p=previewGraphRegistry(x.host,{action:'unregister',name:'disposable'}),original=registry(x),before=inventory(x.personal);
  assert.throws(()=>applyGraphRegistry(x.host,p,p.plan_hash,()=>changeHost(x)),/inputs changed during application/);
  assert.deepEqual(registry(x),original);assert.deepEqual(inventory(x.personal),before);assert.equal(fs.existsSync(path.join(x.host,'.mdkg-graphs.lock')),false);
});
