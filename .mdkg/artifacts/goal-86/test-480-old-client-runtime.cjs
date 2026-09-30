// Installed old-client boundary and actual unsupported-runtime qualification.
// Pinned public downloads stay inside one owned disposable fixture.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const repo=path.resolve(__dirname,'../../..');
const {createOwnedFixture,finalizeFixture}=require(path.join(repo,'scripts/qualification-fixture'));
const {createSmokeCommands}=require(path.join(repo,'scripts/qualification-smoke'));
const {runFixtureProcess}=require(path.join(repo,'scripts/qualification-process'));
const {copyVerifiedArtifact,withVerifiedArtifact}=require(path.join(repo,'scripts/qualification-artifact'));
const {admitRetainedCandidate,captureQualificationInputs}=require(path.join(repo,'scripts/retained-release-candidate'));
const {preparePublishedBaseline,PUBLISHED_052}=require(path.join(repo,'scripts/published-upgrade-baseline'));
const {inventory}=require(path.join(repo,'tests/fixtures/cache-freshness.cjs'));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const base=path.join(__dirname,'private/candidate-0.6.0-6154e4ea920bfa09');
const options={tarball:base+'.tgz',sha256:'6154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca',
  inputs:base+'.package-inputs-dec100.json',inputsSha256:'bcc8b6e1ec5aac804e20ef2fe6676ecfdfa8ae367f69e35a884b5b5980c8fe90'};
const admitted=admitRetainedCandidate(repo,options),harness=captureQualificationInputs(repo),driverHash=hash(fs.readFileSync(__filename));
const fixture=createOwnedFixture({base:'/private/tmp',prefix:'mdkg-old-client-runtime-'});
const commands=createSmokeCommands(fixture,{...process.env,npm_execpath:fs.realpathSync('/opt/homebrew/opt/node@24/bin/npm'),
  PATH:path.dirname(process.execPath)+path.delimiter+process.env.PATH});
const run=(file,args,options)=>runFixtureProcess(fixture.root,file,args,options);
function fileRows(root){const result={};function visit(dir){for(const name of fs.readdirSync(dir).sort()){
  const absolute=path.join(dir,name),stat=fs.lstatSync(absolute),relative=path.relative(root,absolute);
  if(stat.isDirectory())visit(absolute);else{assert(stat.isFile());result[relative]=hash(fs.readFileSync(absolute));}}}
  visit(root);return result;}
const rows=[],downloads=[],started=Date.now();let failure,installed,installedBefore,oldInstalled,oldBefore;
const verify=()=>{admitRetainedCandidate(repo,options,{previous:admitted});assert.equal(captureQualificationInputs(repo).sha256,harness.sha256);
  assert.equal(hash(fs.readFileSync(__filename)),driverHash);if(installedBefore)assert.equal(inventory(installed),installedBefore);
  if(oldBefore)assert.equal(inventory(oldInstalled),oldBefore);};
async function get(url,max){const response=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(45000)});
  assert(response.ok&&!response.redirected&&response.body);let n=0;const chunks=[];for await(const chunk of response.body){n+=chunk.length;assert(n<=max);chunks.push(chunk);}return Buffer.concat(chunks,n);}
async function main(){
try{
  const tarball=fixture.resolve('candidate.tgz');copyVerifiedArtifact(options.tarball,tarball,options.sha256);
  const prefix=fixture.resolve('candidate-install');fs.mkdirSync(prefix);
  withVerifiedArtifact(tarball,options.sha256,()=>commands.npm(['install','--offline','--prefix',prefix,tarball,'--foreground-scripts']));
  installed=path.join(prefix,'node_modules/mdkg');installedBefore=inventory(installed);const cli=path.join(installed,'dist/cli.js');
  const baseline=await preparePublishedBaseline(fixture.root);downloads.push({kind:'published-package',url:PUBLISHED_052.url,sha256:baseline.sha256,integrity:baseline.integrity,bytes:baseline.bytes});
  const oldPrefix=fixture.resolve('old-install');fs.mkdirSync(oldPrefix);
  withVerifiedArtifact(baseline.path,baseline.sha256,()=>commands.npm(['install','--offline','--prefix',oldPrefix,baseline.path,'--foreground-scripts']));
  oldInstalled=path.join(oldPrefix,'node_modules/mdkg');oldBefore=inventory(oldInstalled);const oldCli=path.join(oldInstalled,'dist/cli.js');
  assert.equal(JSON.parse(fs.readFileSync(path.join(oldInstalled,'package.json'))).version,'0.5.2');
  const graph=fixture.resolve('graph');fs.mkdirSync(graph);commands.node(cli,['init','--graph-only'],graph);
  commands.node(oldCli,['new','task','Published legacy writer control','--json'],graph);
  rows.push({case:'published0.5.2 legacy writer positive',pass:true});
  const planArgs=['graph','migrate','--graph-id',crypto.randomUUID(),'--origin',crypto.randomUUID()];
  const plan=JSON.parse(commands.node(cli,[...planArgs,'--json'],graph).stdout);assert.deepEqual(plan.blocking,[]);
  commands.node(cli,[...planArgs,'--apply','--plan-hash',plan.plan_hash,'--json'],graph);
  assert.equal(JSON.parse(fs.readFileSync(path.join(graph,'.mdkg/config.json'))).schema_version,2);
  for(const state of ['warm','cold']){
    const copy=fixture.resolve('fenced-'+state);fs.cpSync(graph,copy,{recursive:true,errorOnExist:true,force:false});
    if(state==='cold')fs.rmSync(path.join(copy,'.mdkg/index'),{recursive:true,force:true});
    for(const args of [['new','task','Must refuse','--json'],['task','start','task-1','--json']]){
      const before=inventory(copy),out=commands.node(oldCli,args,copy,{allowFailure:true});
      assert.notEqual(out.status,0);assert.match(out.stderr+out.stdout,/schema_version/);assert.equal(inventory(copy),before);
      rows.push({case:'published0.5.2 '+state+' fenced writer refusal',command:args,exit_code:out.status,inventory_unchanged:true,pass:true});
    }
    const current=commands.node(cli,['new','task','Compatible writer','--refs','task-1','--json'],copy);
    assert.match(fs.readFileSync(path.join(copy,JSON.parse(current.stdout).node.path),'utf8'),/mdkg:\/\//);
    rows.push({case:'current '+state+' v2 compatible writer positive',pass:true});
  }
  for(const force of [false,true]){
    const copy=fixture.resolve(force?'old-force-init':'old-init');fs.cpSync(graph,copy,{recursive:true,errorOnExist:true,force:false});
    const before=inventory(copy),beforeFiles=fileRows(copy),out=commands.node(oldCli,['init',...(force?['--force']:[])],copy,{allowFailure:true});
    assert.equal(out.status,0);const current=JSON.parse(fs.readFileSync(path.join(copy,'.mdkg/config.json')));
    assert.equal(current.schema_version,force?1:2);assert.notEqual(inventory(copy),before);
    const afterFiles=fileRows(copy),changedPaths=[...new Set([...Object.keys(beforeFiles),...Object.keys(afterFiles)])].sort().filter(p=>beforeFiles[p]!==afterFiles[p]);
    rows.push({case:'published0.5.2 '+(force?'force-init':'init')+' bypass',exit_code:out.status,
      disposition:force?'UNSUPPORTED OLD EXECUTABLE: schema2 fence removed; not a safety pass':'UNSUPPORTED OLD EXECUTABLE: manifest writes ignore schema2 admission; not a no-effect safety pass',
      schema_after:current.schema_version,inventory_changed:true,changed_paths:changedPaths});
  }
  const runtimeName='node-v24.15.0-darwin-arm64',url='https://nodejs.org/download/release/v24.15.0/';
  const sums=await get(url+'SHASUMS256.txt',262144),line=sums.toString('utf8').split('\n').find(s=>s.endsWith('  '+runtimeName+'.tar.gz'));
  assert(line&&/^[a-f0-9]{64}  /.test(line));const expected=line.slice(0,64),bytes=await get(url+runtimeName+'.tar.gz',64*1024*1024);assert.equal(hash(bytes),expected);
  const archive=fixture.resolve('node24.15.tar.gz');fs.writeFileSync(archive,bytes,{flag:'wx',mode:0o600});
  const entries=run('tar',['-tzf',archive],{cwd:fixture.root,env:commands.environment,timeout:30000,maxBuffer:4*1024*1024});
  assert.equal(entries.status,0);for(const entry of entries.stdout.trim().split('\n'))assert(entry.startsWith(runtimeName+'/')&&!entry.split('/').includes('..'));
  const extracted=run('tar',['-xzf',archive,'-C',fixture.root],{cwd:fixture.root,env:commands.environment,timeout:30000});assert.equal(extracted.status,0,extracted.stderr);
  const runtimes=[path.join(fixture.root,runtimeName,'bin/node'),fs.realpathSync('/opt/homebrew/bin/node')];
  downloads.push({kind:'official-node-runtime',url:url+runtimeName+'.tar.gz',sha256:expected,bytes:bytes.length,checksum_manifest_sha256:hash(sums)});
  for(const runtime of runtimes){
    const version=run(runtime,['--version'],{cwd:fixture.root,env:commands.environment});assert.equal(version.status,0);
    assert(['v24.15.0','v26.0.0'].includes(version.stdout.trim()));const binaryHash=hash(fs.readFileSync(runtime));
    for(const args of [['init','--graph-only'],['index'],['db','verify','--json'],['mcp','serve','--stdio']]){
      const before=inventory(graph),out=run(runtime,[cli,...args],{cwd:graph,env:commands.environment,timeout:15000});
      assert.equal(out.status,2);assert.match(out.stderr,/unsupported.*>=24\.18\.0 <25/);assert.equal(inventory(graph),before);
      rows.push({case:'actual unsupported runtime refuses',runtime:version.stdout.trim(),binary_sha256:binaryHash,command:args,exit_code:out.status,inventory_unchanged:true,pass:true});
    }
    for(const args of [['--help'],['--version']]){const before=inventory(graph),out=run(runtime,[cli,...args],{cwd:graph,env:commands.environment,timeout:15000});
      assert.equal(out.status,0);assert.equal(inventory(graph),before);rows.push({case:'unsupported runtime discovery positive',runtime:version.stdout.trim(),command:args,pass:true});}
  }
  verify();
}catch(error){failure=error;}
const receipt={schema_version:1,kind:'test480-current-old-client-runtime-boundary',owner:'root:test-480',consumer:'root:test-482',
  candidate_sha256:options.sha256,input_manifest_sha256:options.inputsSha256,package_inputs_sha256:admitted.package_inputs_sha256,
  harness_inputs_sha256:harness.sha256,driver_sha256:driverHash,node:process.version,platform:process.platform,architecture:process.arch,
  duration_ms:Date.now()-started,rows,downloads,limits:['Native macOS only; Linux rows remain open.','Old init bypass is an observed unsupported behavior, not accepted secure authoring.','No canonical migration, package changes or global runtime installation.']};
try{const cleanup=finalizeFixture(fixture,{error:failure,verify});receipt.cleanup={removed:cleanup.removed,owned_fixture_only:true};receipt.pass=true;}
catch(error){receipt.pass=false;receipt.error=error.message;process.exitCode=1;}
console.log(JSON.stringify(receipt));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
