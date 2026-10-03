import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {target,fixture,inventory,node,quiet}=require('./fixtures/independent-graphs.cjs');
const {runCli,runCliAsync}=require(path.join(target,'dist/cli.js'));
const {COMMAND_OPTIONS}=require(path.join(target,'dist/commands/option_contract.js'));
const familyCommands=[
  ['init'],['upgrade','--json'],['new','task','new selected task','--json'],
  ['show','task-1','--json'],['list','--json'],['search','synthetic','--json'],
  ['pack','task-1','--dry-run'],['handoff','create','task-1','--json'],
  ['skill','list','--json'],['capability','list','--json'],['manifest','list','--json'],['spec','list','--json'],
  ['archive','list','--json'],['bundle','list','--json'],['graph','refs','task-1','--json'],['git','inspect','--json'],
  ['subgraph','list','--json'],['work','validate','--json'],['loop','list','--json'],['goal','current','--json'],
  ['task','update','task-1','--note','isolated evidence','--json'],['next'],['validate','--json'],['status','--json'],
  ['fix','plan','--family','index','--json'],['db','stats','--json'],['event','enable','--json'],
  ['checkpoint','new','isolated checkpoint'],['index'],['guide'],['format','--headings','--dry-run','--json'],
  ['doctor','--json'],['workspace','ls','--json'],['working','list','--json'],
];
function ft(name,fn){test(name,async t=>{const x=fixture();try{await fn(x,t);}finally{x.cleanup();}});}

ft('registry preview preserves graphs and unknown init creates nothing; exact apply registers only metadata',x=>{
  const before=inventory(x.host);
  const r=x.cmd(['init','--graph','unknown']);assert.equal(r.status,1);assert.match(r.stderr,/unknown graph/i);
  assert.deepEqual(inventory(x.host),before);
  const p=JSON.parse(x.ok(['graph','register','personal','--target','memory/personal','--json']).stdout);
  assert.match(p.plan_hash,/^[0-9a-f]{64}$/);assert.deepEqual(inventory(x.host),before);
  x.ok(['graph','register','personal','--target','memory/personal','--apply','--plan-hash',p.plan_hash,'--json']);
  assert.equal(fs.existsSync(path.join(x.host,'.mdkg-graphs.local.json')),true);
  assert.equal(x.f.git.run(x.host,['check-ignore','memory/personal/.mdkg/config.json']).status,0);
  assert.equal(x.f.git.run(x.host,['check-ignore','.mdkg-graphs.local.json']).status,0);
  const after=inventory(x.host);for(const [p,h] of Object.entries(before))if(p!=='.gitignore')assert.equal(after[p],h,p);
});

ft('same numeric node aliases query and allocate only within the explicitly named independent root',x=>{
  x.register();
  const a=JSON.parse(x.ok(['show','task-1','--json']).stdout), b=JSON.parse(x.ok(['show','task-1','--graph','personal','--json']).stdout);
  assert.match(JSON.stringify(a),/team task/);assert.doesNotMatch(JSON.stringify(a),/private synthetic canary/);
  assert.match(x.ok(['show','task-1','--graph','default','--json']).stdout,/team task/);
  assert.match(JSON.stringify(b),/private synthetic canary/);
  const before=inventory(path.join(x.host,'.mdkg'));
  x.ok(['new','task','named allocation','--graph','personal','--json']);
  assert.deepEqual(inventory(path.join(x.host,'.mdkg')),before);
  assert.match(x.ok(['search','named allocation','--graph','personal','--json']).stdout,/named allocation/);
  assert.doesNotMatch(x.ok(['search','named allocation','--json']).stdout,/named allocation/);
});

ft('every concrete command refuses an unknown graph before graph/config/output/subprocess effects',async(x,t)=>{
  for(const [kind,invoke] of [['sync',runCli],['async',runCliAsync]]) {
    for(const command of Object.keys(COMMAND_OPTIONS).filter(s=>!['graph register','graph unregister','graph registrations'].includes(s))) {
      await t.test(`${kind}: ${command}`,async()=>{
        const before=inventory(x.host),errors=[];
        const code=await invoke([...command.split(' '),'--graph','unknown'],{cwd:()=>x.host,log:()=>{},error:s=>errors.push(String(s))});
        assert.equal(code,1,command);assert.match(errors.join('\n'),/unknown graph/i,command);
        assert.deepEqual(inventory(x.host),before,command);
      });
    }
  }
});

test('malformed and repeated selectors refuse before cwd discovery on both entrypoints',async()=>{
  for(const invoke of [runCli,runCliAsync])for(const argv of [
    ['show','task-1','--graph'],['--version','--graph=../private'],['--help','--graph=Personal'],
    ['show','task-1','--graph=2'],['show','task-1','--graph=personal','--graph=personal'],
    ['graph','register','personal','--graph=default'],['graph','unregister','personal','--graph=personal'],
  ]){
    let calls=0;const code=await invoke(argv,{cwd:()=>{calls++;throw Error('cwd reached');},log:()=>{},error:()=>{}});
    assert.equal(code,1,argv.join(' '));assert.equal(calls,0,argv.join(' '));
  }
});

ft('help and version are graph-independent; selector is visible in every concrete command contract',async x=>{
  for(const invoke of [runCli,runCliAsync])for(const args of [['--version'],['help','show'],['show','--help']]) {
    const logs=[];let cwd=0;
    assert.equal(await invoke([...args,'--graph','personal'],{cwd:()=>{cwd++;throw Error('graph read');},log:s=>logs.push(s),error:()=>{}}),0);
    assert.equal(cwd,0);assert.ok(logs.length);
  }
  for(const [key,flags]of Object.entries(COMMAND_OPTIONS))if(!['graph register','graph unregister','graph registrations'].includes(key))assert.ok(flags.includes('--graph'),key);
});

ft('all command families positively use the named root while preserving the host default graph',async(x,t)=>{
  x.register();
  const {previewWorking,applyWorking}=require(path.join(target,'dist/commands/working.js'));
  const p=previewWorking(x.personal,{action:'init',ids:[]});applyWorking(x.personal,p,p.plan_hash);
  x.ok(['db','init','--graph','personal','--json']);x.ok(['db','migrate','--graph','personal','--json']);
  for(const args of familyCommands){
    await t.test(args.join(' '),()=>{
      const before=inventory(path.join(x.host,'.mdkg'));
      const r=x.cmd([...args,'--graph','personal']);
      assert.equal(r.status,0,args.join(' ')+'\n'+r.stderr+'\n'+r.stdout);
      assert.match(r.stderr,/selected graph: personal/);assert.deepEqual(inventory(path.join(x.host,'.mdkg')),before,args.join(' '));
    });
  }
});

ft('missing, changed, copied and default-colliding identity bindings refuse without repair',x=>{
  x.register();const marker=path.join(x.personal,'.mdkg/working-host.json'),saved=fs.readFileSync(marker);
  for(const content of [null,Buffer.from('{broken'),Buffer.from(JSON.stringify({format:'mdkg-working-host',version:1,host_id:crypto.randomUUID()}))]) {
    if(content===null)fs.unlinkSync(marker);else fs.writeFileSync(marker,content);
    const before=inventory(x.host);const r=x.cmd(['init','--graph','personal']);assert.notEqual(r.status,0);assert.deepEqual(inventory(x.host),before);
    fs.writeFileSync(marker,saved);
  }
  const other=path.join(x.host,'memory/other');fs.cpSync(x.personal,other,{recursive:true});
  const before=inventory(x.host);assert.notEqual(x.cmd(['graph','register','other','--target','memory/other','--json']).status,0);assert.deepEqual(inventory(x.host),before);
  fs.copyFileSync(path.join(x.host,'.mdkg/working-host.json'),marker);
  assert.notEqual(x.cmd(['graph','register','alias','--target','memory/personal','--json']).status,0);
});

ft('registry targets reject traversal, case aliases, links, nested roots and host mirror overlap',x=>{
  for(const targetPath of ['../outside','/absolute','memory/../personal','memory/Personal','.mdkg','.agents','memory/personal/.mdkg']) {
    const before=inventory(x.host);assert.notEqual(x.cmd(['graph','register','personal','--target',targetPath,'--json']).status,0,targetPath);assert.deepEqual(inventory(x.host),before);
  }
  fs.symlinkSync(x.personal,path.join(x.host,'linked'),'dir');assert.notEqual(x.cmd(['graph','register','linked','--target','linked','--json']).status,0);
  x.register();assert.notEqual(x.cmd(['graph','register','nested','--target','memory/personal/child','--json']).status,0);
  const registry=path.join(x.host,'.mdkg-graphs.local.json');fs.linkSync(registry,path.join(x.host,'hardlinked-registry'));
  assert.notEqual(x.cmd(['show','task-1','--graph','personal','--json']).status,0);
});

ft('stale registration and an active host registry lock preserve both graph trees',x=>{
  const args=['graph','register','personal','--target','memory/personal','--json'];
  const p=JSON.parse(x.ok(args).stdout);fs.appendFileSync(path.join(x.host,'.gitignore'),'# authored change\n');
  let before=inventory(x.host);assert.notEqual(x.cmd([...args,'--apply','--plan-hash',p.plan_hash]).status,0);assert.deepEqual(inventory(x.host),before);
  const next=JSON.parse(x.ok(args).stdout);fs.mkdirSync(path.join(x.host,'.mdkg-graphs.lock'));
  before=inventory(x.host);assert.notEqual(x.cmd([...args,'--apply','--plan-hash',next.plan_hash]).status,0);assert.deepEqual(inventory(x.host),before);
});

ft('registry refuses non-Git or invalid Git hosts before ignore or registration changes',x=>{
  fs.renameSync(path.join(x.host,'.git'),x.f.resolve('retained-git'));
  for(const visibility of ['private','internal','public']) {
    const before=inventory(x.host),r=x.cmd(['graph','register','personal','--target','memory/personal','--visibility',visibility,'--json']);
    assert.notEqual(r.status,0);assert.match(r.stderr,/requires a Git work tree/);assert.deepEqual(inventory(x.host),before);
  }
  fs.writeFileSync(path.join(x.host,'.git'),'gitdir: '+x.f.resolve('missing-repository')+'\n');
  const before=inventory(x.host),r=x.cmd(['graph','register','personal','--target','memory/personal','--json']);
  assert.notEqual(r.status,0);assert.match(r.stderr,/invalid host Git metadata/);assert.deepEqual(inventory(x.host),before);
});

ft('private registrations refuse public/internal output and graph transport before writes',x=>{
  x.register();
  for(const args of [['pack','task-1','--visibility','public'],['pack','task-1','--visibility','internal'],
    ['bundle','create','--pack-profile','public'],['capability','list','--visibility','public','--json'],
    ['graph','clone','--target','copied'],['graph','fork','--target','copied']]) {
    const before=inventory(x.host),r=x.cmd([...args,'--graph','personal']);assert.notEqual(r.status,0,args.join(' '));
    assert.match(r.stderr,/private graph/);assert.deepEqual(inventory(x.host),before);
  }
  x.ok(['pack','task-1','--graph','personal','--out','private-pack.md']);
  assert.match(fs.readFileSync(path.join(x.personal,'private-pack.md'),'utf8'),/private synthetic canary/);
});

ft('unregister forgets metadata only, is hash-gated and preserves private ignore entries and bytes',x=>{
  x.register();const before=inventory(x.personal),args=['graph','unregister','personal','--json'];
  const p=JSON.parse(x.ok(args).stdout);assert.deepEqual(inventory(x.personal),before);
  x.ok([...args,'--apply','--plan-hash',p.plan_hash]);assert.deepEqual(inventory(x.personal),before);
  assert.equal(x.f.git.run(x.host,['check-ignore','memory/personal/.mdkg/config.json']).status,0);
  assert.notEqual(x.cmd(['show','task-1','--graph','personal','--json']).status,0);
  x.register();assert.match(x.ok(['show','task-1','--graph','personal','--json']).stdout,/private synthetic canary/);
});

ft('default dispatch never reads a registered large ignored private graph or its registry',async x=>{
  x.register();x.ok(['index']);
  async function measure() {
    const original={readFileSync:fs.readFileSync,readdirSync:fs.readdirSync,openSync:fs.openSync};
    const originalRead=fs.readSync;
    const calls=[];let bytes=0;const bytesBefore=process.memoryUsage().rss;const begin=performance.now();
    fs.readSync=function(...args){const n=originalRead.apply(fs,args);bytes+=n;return n;};
    for(const key of Object.keys(original))fs[key]=function(file,...args){
      const p=typeof file==='string'?path.resolve(file):'';calls.push({key,path:p});
      assert.ok(!p.startsWith(x.personal+path.sep)&&p!==x.personal&&!p.endsWith('/.mdkg-graphs.local.json'),'default opened private boundary '+p);
      const value=original[key].call(fs,file,...args);
      return value;
    };
    const outputs=[];const oldLog=console.log;console.log=(...v)=>outputs.push(v.join(' '));
    try{assert.equal(await runCliAsync(['--root',x.host,'search','team','--json'],{log:s=>outputs.push(s),error:s=>outputs.push(s)}),0);}
    finally{console.log=oldLog;Object.assign(fs,original);fs.readSync=originalRead;}
    assert.doesNotMatch(outputs.join('\n'),/PRIVATE_LARGE_CANARY|private synthetic canary|memory\/personal/);
    return {calls:calls.length,read_bytes:bytes,elapsed_ms:performance.now()-begin,rss_delta:process.memoryUsage().rss-bytesBefore};
  }
  const small=await measure();for(let i=2;i<=2002;i++)node(x.personal,`PRIVATE_LARGE_CANARY_${i}`,i);
  const large=await measure();
  assert.equal(large.calls,small.calls);assert.equal(large.read_bytes,small.read_bytes);
  assert.ok(large.elapsed_ms<10000);assert.ok(large.rss_delta<96*1024*1024);assert.ok(large.calls<1000);assert.ok(large.read_bytes<4*1024*1024);
  console.log('SCALING_EVIDENCE '+JSON.stringify({private_synthetic_nodes:[1,2002],small,large,instrumentation:'JS file/directory/open calls and readSync bytes; native SQLite internal I/O is not instrumented',budgets:{calls:1000,read_bytes:4*1024*1024,elapsed_ms:10000,rss_delta:96*1024*1024}}));
});

ft('MCP positively binds its whole session to the named root without creating host caches',x=>{
  x.register();const before=inventory(path.join(x.host,'.mdkg'));
  const requests=[{jsonrpc:'2.0',id:1,method:'initialize',params:{}},
    {jsonrpc:'2.0',id:2,method:'tools/call',params:{name:'mdkg_show',arguments:{id:'task-1'}}},
    {jsonrpc:'2.0',id:3,method:'tools/call',params:{name:'mdkg_pack',arguments:{id:'task-1'}}}];
  const r=x.stdio(['mcp','serve','--stdio','--graph','personal'],requests.map(v=>JSON.stringify(v)).join('\n')+'\n');
  assert.equal(r.status,0,r.stderr);assert.match(r.stderr,/selected graph: personal/);
  const lines=r.stdout.trim().split('\n').map(JSON.parse);assert.equal(lines.length,3);
  for(const line of lines)assert.ok(!line.error,JSON.stringify(line.error));
  assert.match(JSON.stringify(lines.slice(1)),/private synthetic canary/);
  assert.doesNotMatch(JSON.stringify(lines.slice(1)),/team task/);
  assert.deepEqual(inventory(path.join(x.host,'.mdkg')),before);
});

ft('both entrypoints select identically and overlapping asynchronous contexts are invocation-local',async x=>{
  x.register();const {resolveGraphContext}=require(path.join(target,'dist/core/graph_selection.js'));
  const {withGraphContext,currentGraphContext}=require(path.join(target,'dist/core/graph_context.js'));
  const personal=resolveGraphContext(x.host,'personal'),team=resolveGraphContext(x.host);
  assert.ok(Object.isFrozen(personal));assert.ok(Object.isFrozen(personal.binding));
  const before=currentGraphContext();
  await Promise.all([personal,team].map(ctx=>withGraphContext(ctx,async()=>{
    await new Promise(r=>setTimeout(r,5));assert.equal(currentGraphContext(),ctx);
  })));
  assert.equal(currentGraphContext(),before);
  for(const invoke of [runCli,runCliAsync]) {
    const old=console.log,out=[];console.log=(...v)=>out.push(v.join(' '));
    try{assert.equal(await invoke(['show','task-1','--graph','personal','--json'],{cwd:()=>x.host,error:()=>{}}),0);}
    finally{console.log=old;}
    assert.match(out.join('\n'),/private synthetic canary/);assert.doesNotMatch(out.join('\n'),/team task/);
  }
});

ft('registry interruption preserves graph bytes and requires a fresh preview after ignore changes',x=>{
  const {previewGraphRegistry,applyGraphRegistry}=require(path.join(target,'dist/core/graph_selection.js'));
  const request={action:'register',name:'personal',target:'memory/personal'};
  const p=previewGraphRegistry(x.host,request),before=inventory(x.personal);
  assert.throws(()=>applyGraphRegistry(x.host,p,p.plan_hash,()=>{throw Error('synthetic interruption');}),/synthetic interruption/);
  assert.equal(fs.existsSync(path.join(x.host,'.mdkg-graphs.local.json')),false);
  assert.equal(fs.existsSync(path.join(x.host,'.mdkg-graphs.lock')),false);
  assert.deepEqual(inventory(x.personal),before);
  assert.throws(()=>applyGraphRegistry(x.host,p,p.plan_hash),/stale/);
  const next=previewGraphRegistry(x.host,request);applyGraphRegistry(x.host,next,next.plan_hash);
  assert.deepEqual(inventory(x.personal),before);
});

ft('registration rechecks changed binding at the ignore-to-registry boundary without repairing it',x=>{
  const {previewGraphRegistry,applyGraphRegistry}=require(path.join(target,'dist/core/graph_selection.js'));
  const p=previewGraphRegistry(x.host,{action:'register',name:'personal',target:'memory/personal'});
  const marker=path.join(x.personal,'.mdkg/working-host.json');
  assert.throws(()=>applyGraphRegistry(x.host,p,p.plan_hash,()=>{
    fs.writeFileSync(marker,JSON.stringify({format:'mdkg-working-host',version:1,host_id:crypto.randomUUID()}));
  }),/changed|stale/);
  assert.equal(fs.existsSync(path.join(x.host,'.mdkg-graphs.local.json')),false);
  assert.equal(fs.existsSync(path.join(x.host,'.mdkg-graphs.lock')),false);
});

ft('tracked private graph and forced-tracked registry refuse; internal root deliberately permits tracking',x=>{
  x.f.git.run(x.host,['add','-f','--','memory/personal/.mdkg/config.json']);
  const before=inventory(x.host);assert.notEqual(x.cmd(['graph','register','personal','--target','memory/personal','--json']).status,0);
  assert.deepEqual(inventory(x.host),before);
  x.register('team','memory/personal','internal');
  assert.match(x.ok(['show','task-1','--graph','team','--json']).stdout,/private synthetic canary/);
  x.f.git.run(x.host,['add','-f','--','.mdkg-graphs.local.json']);
  assert.notEqual(x.cmd(['show','task-1','--graph','team','--json']).status,0);
});

ft('registered root loss can be forgotten without graph reads, repair or deletion',x=>{
  x.register();const moved=path.join(x.host,'memory/moved');fs.renameSync(x.personal,moved);
  const before=inventory(moved),args=['graph','unregister','personal','--json'];
  const p=JSON.parse(x.ok(args).stdout);x.ok([...args,'--apply','--plan-hash',p.plan_hash]);
  assert.deepEqual(inventory(moved),before);
});

ft('registered working storage retains foreign/missing host refusal and independent writer locks',x=>{
  x.register();const {previewWorking,applyWorking}=require(path.join(target,'dist/commands/working.js'));
  const {withMutationLock}=require(path.join(target,'dist/util/lock.js'));
  for(const root of [x.host,x.personal]){const p=previewWorking(root,{action:'init',ids:[]});applyWorking(root,p,p.plan_hash);}
  fs.cpSync(path.join(x.host,'.mdkg/working'),path.join(x.personal,'.mdkg/working'),{recursive:true});
  const before=inventory(x.host);const r=x.cmd(['working','verify','--graph','personal','--json']);
  assert.notEqual(r.status,0);assert.match(r.stderr,/foreign/);assert.deepEqual(inventory(x.host),before);
  assert.equal(withMutationLock(x.host,0,()=>withMutationLock(x.personal,0,()=>42)),42);
  assert.equal(fs.existsSync(path.join(x.host,'.mdkg/index/write.lock')),false);
  assert.equal(fs.existsSync(path.join(x.personal,'.mdkg/index/write.lock')),false);
  fs.unlinkSync(path.join(x.personal,'.mdkg/working-host.json'));
  assert.notEqual(x.cmd(['working','init','--graph','personal','--json']).status,0);
});

ft('canonical-v2 binding is preserved as canonical identity and copied namespace refuses registration',x=>{
  const {createGraphFormat}=require(path.join(target,'dist/graph/identity.js'));
  const {resolveGraphContext}=require(path.join(target,'dist/core/graph_selection.js'));
  for(const d of ['core','design','work'])fs.rmSync(path.join(x.personal,'.mdkg',d),{recursive:true});
  fs.unlinkSync(path.join(x.personal,'.mdkg/working-host.json'));
  const format=createGraphFormat();fs.writeFileSync(path.join(x.personal,'.mdkg/graph.json'),JSON.stringify(format));
  x.register();const ctx=resolveGraphContext(x.host,'personal');
  assert.deepEqual(ctx.binding,{kind:'canonical-v2',id:format.graph_id});
  assert.equal(JSON.parse(fs.readFileSync(path.join(x.personal,'.mdkg/graph.json'),'utf8')).graph_id,format.graph_id);
  const before=inventory(x.host);const copy=path.join(x.host,'memory/copied');fs.cpSync(x.personal,copy,{recursive:true});
  assert.notEqual(x.cmd(['graph','register','copied','--target','memory/copied','--json']).status,0);
  for(const [p,h]of Object.entries(before))assert.equal(inventory(x.host)[p],h,p);
});

ft('malformed registry and changed host namespace refuse without fallback or metadata mutation',x=>{
  x.register();const registry=path.join(x.host,'.mdkg-graphs.local.json'),old=fs.readFileSync(registry);
  for(const raw of ['{broken',JSON.stringify({format:'mdkg-graph-registry',version:99,graphs:[]}),old.toString().replace('"version": 1','"version": 1, "unknown": true'),' '.repeat(65537)]){
    fs.writeFileSync(registry,raw);const before=inventory(x.host);
    assert.notEqual(x.cmd(['show','task-1','--graph','personal','--json']).status,0);assert.deepEqual(inventory(x.host),before);
  }
  fs.writeFileSync(registry,old);fs.writeFileSync(path.join(x.host,'.mdkg/working-host.json'),JSON.stringify({format:'mdkg-working-host',version:1,host_id:crypto.randomUUID()}));
  const before=inventory(x.host);assert.notEqual(x.cmd(['show','task-1','--graph','personal','--json']).status,0);assert.deepEqual(inventory(x.host),before);
});

ft('named outputs reject other graph paths and linked destinations before output effects',x=>{
  x.register();
  fs.symlinkSync(x.host,path.join(x.personal,'linked-host'),'dir');
  for(const output of ['../../.mdkg/copied.md','linked-host/.mdkg/copied.md']){
    const before=inventory(x.host),r=x.cmd(['pack','task-1','--graph','personal','--out',output]);
    assert.notEqual(r.status,0);assert.deepEqual(inventory(x.host),before);
  }
});

ft('equal goal and task numbers retain separate selections, claims, events and loop runs',x=>{
  x.register();
  for(const root of [x.host,x.personal]) {
    const goal=node(root,'synthetic goal');fs.unlinkSync(goal);
    node(root,root===x.host?'team task':'private synthetic canary');
    fs.writeFileSync(path.join(root,'.mdkg/work/goal-1-synthetic.md'),
      '---\nid: goal-1\ntype: goal\ntitle: synthetic goal\nstatus: progress\npriority: 1\ngoal_state: active\ngoal_condition: synthetic only\nscope_refs: [task-1]\nrequired_skills: []\nrequired_checks: []\nmax_iterations: 25\nblocked_after_attempts: 3\ntags: []\nowners: []\nlinks: []\nartifacts: []\nrelates: []\nrefs: []\naliases: []\nskills: []\ncreated: 2026-10-03\nupdated: 2026-10-03\n---\n\n# Overview\n\nSynthetic isolation fixture.\n');
    x.ok(['goal','select','goal-1','--json'],root);
  }
  const before=inventory(path.join(x.host,'.mdkg'));
  x.ok(['goal','claim','task-1','--graph','personal','--json']);
  x.ok(['task','start','task-1','--run-id','private-run','--graph','personal','--json']);
  const template=path.join(x.personal,'.mdkg/templates/loops/synthetic.loop.md');
  fs.mkdirSync(path.dirname(template),{recursive:true});
  fs.writeFileSync(template,'---\nid: loop-1\ntype: loop\ntitle: synthetic loop\nstatus: todo\npriority: 1\nloop_mode: readonly\nloop_role: template\nscope_refs: []\nmaterialization_mode: planning_only\ntemplate_refs: []\nchild_refs: []\npre_run_questions: []\nrequired_actions: []\nrequested_actions: []\nprohibited_actions: []\nevidence_lanes: []\nrun_refs: []\ntags: []\nowners: []\nlinks: []\nartifacts: []\nrelates: []\nrefs: []\naliases: [synthetic-loop]\nskills: []\ncreated: 2026-10-03\nupdated: 2026-10-03\n---\n\n# Operating Model\n\nSynthetic loop.\n');
  const fork=JSON.parse(x.ok(['loop','fork','synthetic','--scope','goal-1','--planning-only','--graph','personal','--json']).stdout);
  assert.ok(fork.loop.id);x.ok(['loop','plan',fork.loop.id,'--graph','personal','--json']);
  assert.deepEqual(inventory(path.join(x.host,'.mdkg')),before);
  assert.match(fs.readFileSync(path.join(x.personal,'.mdkg/work/goal-1-synthetic.md'),'utf8'),/active_node: task-1/);
  assert.doesNotMatch(fs.readFileSync(path.join(x.host,'.mdkg/work/goal-1-synthetic.md'),'utf8'),/active_node: task-1/);
  assert.match(JSON.stringify(inventory(x.personal)),/selected-goal/);
  assert.match(fs.readFileSync(path.join(x.personal,'.mdkg/work/events/events.jsonl'),'utf8'),/private-run/);
});

ft('equal queue/message IDs settle only in selected DB and snapshot state',x=>{
  x.register();
  for(const root of [x.host,x.personal])for(const args of [
    ['db','init','--json'],['db','migrate','--json'],['db','queue','create','work','--json'],
    ['db','queue','enqueue','work','msg-1','--payload-json',JSON.stringify({canary:root===x.host?'team':'private synthetic canary'}),'--json'],
    ['db','queue','claim','work','--lease-owner','same-owner','--lease-ms','60000','--json'],
  ])x.ok(args,root);
  const before=inventory(path.join(x.host,'.mdkg'));
  x.ok(['db','queue','ack','work','msg-1','--lease-owner','same-owner','--graph','personal','--json']);
  x.ok(['db','snapshot','seal','--graph','personal','--json']);
  assert.equal(JSON.parse(x.ok(['db','snapshot','verify','--graph','personal','--json']).stdout).status,'valid');
  assert.deepEqual(inventory(path.join(x.host,'.mdkg')),before);
  const team=JSON.parse(x.ok(['db','queue','list','work','--json']).stdout);
  assert.match(JSON.stringify(team),/leased/);assert.doesNotMatch(JSON.stringify(team),/private synthetic canary|acked/);
  const selected=x.ok(['db','queue','list','work','--graph','personal','--json']).stdout;
  assert.match(selected,/acked|private synthetic canary/);
});

ft('canonical skills and both native mirrors belong only to the selected root',x=>{
  x.register();const before=inventory(x.host);
  x.ok(['skill','new','private-synthetic','Private synthetic','--description','private synthetic canary','--graph','personal']);
  x.ok(['skill','sync','--graph','personal','--json']);
  for(const directory of ['.mdkg/skills','.agents/skills','.claude/skills']) {
    const body=fs.readFileSync(path.join(x.personal,directory,'private-synthetic/SKILL.md'),'utf8');
    assert.match(body,/private synthetic canary/);
    assert.equal(fs.existsSync(path.join(x.host,directory,'private-synthetic')),false);
  }
  const after=inventory(x.host);for(const [p,h]of Object.entries(before))if(!p.startsWith('memory/personal/'))assert.equal(after[p],h,p);
});

ft('default packs, indexes, public bundles and Git inventory exclude private canaries',x=>{
  x.register();node(x.personal,'PRIVATE_EXPORT_CANARY',2);
  const configPath=path.join(x.host,'.mdkg/config.json'),config=JSON.parse(fs.readFileSync(configPath,'utf8'));
  config.workspaces.root.visibility='public';fs.writeFileSync(configPath,JSON.stringify(config,null,2)+'\n');
  x.ok(['index']);x.ok(['pack','task-1','--out','team-pack.md']);
  x.ok(['bundle','create','--profile','public','--output','team-public.mdkg.zip','--json']);
  const {readZipEntries}=require(path.join(target,'dist/util/zip.js'));
  const entries=readZipEntries(fs.readFileSync(path.join(x.host,'team-public.mdkg.zip')));
  assert.doesNotMatch(entries.map(e=>e.name).join('\n'),/memory\/personal|mdkg-graphs/);
  assert.doesNotMatch(entries.map(e=>e.data.toString('utf8')).join('\n'),/PRIVATE_EXPORT_CANARY|private synthetic canary/);
  for(const file of ['team-pack.md','.mdkg/index/mdkg.json'])if(fs.existsSync(path.join(x.host,file)))
    assert.doesNotMatch(fs.readFileSync(path.join(x.host,file),'utf8'),/PRIVATE_EXPORT_CANARY|private synthetic canary/);
  const untracked=x.f.git.run(x.host,['ls-files','--others','--exclude-standard']).stdout;
  assert.doesNotMatch(untracked,/memory\/personal|mdkg-graphs/);
});
