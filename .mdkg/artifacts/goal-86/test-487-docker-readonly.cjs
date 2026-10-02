// Real read-only Docker root filesystem, not chmod masquerading as EROFS.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const repo=path.resolve(__dirname,'../../..'),root='/home/mdkg/read-only';
const {createOwnedFixture,finalizeFixture}=require(path.join(repo,'scripts/qualification-fixture'));
const {createSmokeCommands}=require(path.join(repo,'scripts/qualification-smoke'));
const {runFixtureProcess,assertFixtureProcessesQuiescent}=require(path.join(repo,'scripts/qualification-process'));
const {inventory}=require(path.join(repo,'tests/fixtures/cache-freshness.cjs'));
const {admitRetainedCandidate}=require(path.join(repo,'scripts/retained-release-candidate'));
const base=path.join(__dirname,'private/candidate-0.6.0-6154e4ea920bfa09'),options={tarball:base+'.tgz',sha256:process.env.MDKG_EXPECTED_CANDIDATE_SHA256,
  inputs:base+'.package-inputs-dec100.json',inputsSha256:'bcc8b6e1ec5aac804e20ef2fe6676ecfdfa8ae367f69e35a884b5b5980c8fe90'};
admitRetainedCandidate(repo,options);assert.equal(process.platform,'linux');assert.equal(process.getuid(),10001);
if(process.argv[2]==='--prepare'){
  assert(!fs.existsSync(root));fs.mkdirSync(root);
  const fixture=createOwnedFixture({base:'/private/tmp',prefix:'mdkg-ro-preparation-'}),commands=createSmokeCommands(fixture,{...process.env,npm_execpath:process.env.MDKG_REAL_NPM});
  let failure;
  try{const prefix=fixture.resolve('installed');fs.mkdirSync(prefix);
    commands.npm(['install','--offline','--prefix',prefix,options.tarball,'--foreground-scripts']);const installed=path.join(prefix,'node_modules/mdkg'),cli=path.join(installed,'dist/cli.js');
    fs.cpSync(installed,path.join(root,'installed'),{recursive:true,errorOnExist:true,force:false});
    for(const backend of ['json','sqlite'])for(const format of ['legacy','v2']){
      const graph=fixture.resolve(backend+'-'+format);fs.mkdirSync(graph);
      const invoke=args=>commands.node(cli,args,graph),json=args=>JSON.parse(invoke([...args,'--json']).stdout);
      invoke(['init','--graph-only']);const file=path.join(graph,'.mdkg/config.json'),config=JSON.parse(fs.readFileSync(file));config.index.backend=backend;fs.writeFileSync(file,JSON.stringify(config));
      json(['new','task','Read only observation']);json(['db','init']);json(['db','migrate']);json(['db','snapshot','seal']);
      if(format==='v2'){const args=['graph','migrate','--graph-id',crypto.randomUUID(),'--origin',crypto.randomUUID()],plan=json(args);assert.deepEqual(plan.blocking,[]);json([...args,'--apply','--plan-hash',plan.plan_hash]);}
      invoke(['index']);fs.cpSync(graph,path.join(root,backend+'-'+format),{recursive:true,errorOnExist:true,force:false});
    }
  }catch(e){failure=e;}
  finalizeFixture(fixture,{error:failure});console.log(JSON.stringify({prepared:true,candidate_sha256:options.sha256,root}));
}else{
  const before=inventory(root),cli=path.join(root,'installed/dist/cli.js'),cases=[];
  function semantic(args,stdout,name){
    const result=args.includes('--json')?JSON.parse(stdout):null;
    const task=item=>{assert.equal(item.id,'task-1');assert.equal(item.qid,'root:task-1');assert.equal(item.title,'Read only observation');
      if(name.endsWith('-v2')){assert(item.identity?.graph_id&&item.identity?.node_id);assert.match(item.stable_ref,/^mdkg:\/\//);}};
    switch(args[0]){
      case 'status':assert.equal(result.action,'status');assert.equal(result.ok,true);assert.equal(result.graph.ok,true);assert.equal(result.graph.node_count,11);assert.equal(result.graph.stale,false);assert.equal(result.db.ok,true);break;
      case 'list':assert.equal(result.command,'list');assert.equal(result.count,11);task(result.items.find(x=>x.id==='task-1'));break;
      case 'show':assert.equal(result.command,'show');task(result.item);assert.match(result.item.body,/# Acceptance Criteria/);break;
      case 'search':assert.equal(result.command,'search');assert.equal(result.count,1);task(result.items[0]);break;
      case 'next':assert.match(stdout,/root:task-1 \| task \| backlog\/p9 \| Read only observation/);break;
      case 'validate':assert.equal(result.action,'validated');assert.equal(result.ok,true);assert.equal(result.error_count,0);assert.deepEqual(result.errors,[]);break;
      case 'pack':assert.match(stdout,/dry-run: no files written/);assert.match(stdout,/root: root:task-1/);assert.match(stdout,/included_nodes:\n- root:task-1/);break;
      case 'db':assert.equal(result.ok,true);
        if(args[1]==='stats'){assert.equal(result.action,'db-stats');assert.equal(result.enabled,true);assert.equal(result.migration_count,5);assert.deepEqual(result.transient_files,[]);assert.equal(result.tables.find(x=>x.name==='project_queue_message').row_count,0);assert.equal(result.state_snapshot.exists,true);}
        else{assert.equal(result.failure_count,0);assert.deepEqual(result.errors,[]);assert(result.checks.length>0&&result.checks.every(x=>x.ok===true));
          assert.equal(result.action,args[1]==='snapshot'?'db-snapshot-verify':args[1]==='index'?'db-index-verify':'db-verify');
          if(args[1]==='snapshot')assert.equal(result.status,'valid');}
        break;
      default:assert.fail('missing semantic assertion');
    }
  }
  assert.throws(()=>fs.writeFileSync(path.join(root,'must-refuse'),'synthetic'),e=>e.code==='EROFS');
  for(const name of ['json-legacy','json-v2','sqlite-legacy','sqlite-v2']){
    const graph=path.join(root,name),observations=[['status','--json'],['list','--json'],['show','task-1','--json'],['search','Read only','--json'],['next'],['validate','--json'],['pack','task-1','--dry-run','--stats'],['db','verify','--json'],['db','stats','--json'],['db','snapshot','verify','--json']];
    if(name.startsWith('sqlite'))observations.push(['db','index','verify','--json']);
    for(const args of [...observations,['new','task','Must refuse readonly write']]){
      const r=runFixtureProcess(root,process.execPath,[cli,...args],{cwd:graph,env:process.env,timeout:120000,maxBuffer:8*1024*1024});
      if(args[0]==='new'){assert.notEqual(r.status,0);assert.match(r.stderr,/read-only|EROFS|permission|EACCES/i);}else{assert.equal(r.status,0,r.stderr);semantic(args,r.stdout,name);}
      assert.equal(inventory(root),before);cases.push({fixture:name,command:args,pass:true,refused:args[0]==='new',semantic_assertion:args[0]!=='new'});
    }
  }
  assertFixtureProcessesQuiescent(root);admitRetainedCandidate(repo,options);
  console.log(JSON.stringify({kind:'linux-real-readonly-filesystem',candidate_sha256:options.sha256,node:process.version,platform:process.platform,arch:process.arch,uid:process.getuid(),cases,pass:true,inventory_sha256:before,
    filesystem:'Docker read-only image root; direct write independently returned EROFS',limitations:['Warm/fresh JSON and SQLite indexes on a read-only filesystem; this does not establish the cold-cache/read-only cross-product','Not a fix for deferred Bugs46/47; image/volume and native/emulated identities are in outer receipt']}));
}
