// Bounded harness fault controls only, not installed product qualification.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm'),assert=require('node:assert/strict'),{EventEmitter}=require('node:events');
const file=path.join(__dirname,'test-487-docker-runner.cjs'),source=fs.readFileSync(file,'utf8'),hash=x=>crypto.createHash('sha256').update(x).digest('hex');
async function scenario(fault){
  const manifest=JSON.stringify({files:[{path:'proof',sha256:hash('intact'),mode:0o644}],candidate_sha256:'synthetic',source_revision:'synthetic'}),runtime='[]';
  let after=false,summary,resolve;const complete=new Promise(r=>resolve=r);
  const fakeFs={existsSync:()=>false,mkdirSync:()=>{},lstatSync:()=>({isFile:()=>true,nlink:1,mode:0o644}),realpathSync:x=>x,
    readFileSync:p=>p==='/capsule/capsule-manifest.json'?manifest:p==='/capsule/runtime-downloads.json'?runtime:p==='/etc/os-release'?'fixture':after&&fault==='custody'?'changed':'intact',
    writeFileSync:(p,data)=>{if(fault==='persistence'&&p.endsWith('.stdout.txt'))throw Error('synthetic stream persistence failure');if(p.endsWith('/receipt.json')){summary=JSON.parse(data);resolve();}}};
  const fakeChild={execFileSync:()=>'',spawn:()=>{const child=new EventEmitter();child.stdout=new EventEmitter();child.stderr=new EventEmitter();
    setImmediate(()=>{if(fault==='launch')child.emit('error',Error('synthetic launch failure'));else{child.stdout.emit('data',Buffer.from(fault==='progress-only'?'{"event":"started"}\n':'{"kind":"synthetic-final-receipt","pass":true}\n'));after=true;child.emit('close',0,null);}});return child;}};
  const fakeProcess={platform:'linux',version:'v24.18.0',arch:'arm64',getuid:()=>10001,execPath:'/node',env:{MDKG_CAPSULE_MANIFEST_SHA256:fault==='preflight'?'wrong':hash(manifest),MDKG_RUNTIME_MANIFEST_SHA256:hash(runtime),MDKG_EXPECTED_ARCH:'arm64',MDKG_REAL_NPM:'/npm',MDKG_LINUX_FAMILIES:'readonly,capability-umask'}};
  vm.runInNewContext(source,{require:name=>name==='node:fs'?fakeFs:name==='node:child_process'?fakeChild:require(name),__dirname:'/capsule/.mdkg/artifacts/goal-86',process:fakeProcess,console:{log:()=>{},error:()=>{}},Buffer});
  const timeout=setTimeout(()=>resolve(),1000);await complete;clearTimeout(timeout);assert(summary,'summary missing');
  assert.equal(summary.pass,false);
  if(fault==='preflight'){assert.equal(summary.completed.length,0);assert.deepEqual(summary.unverified,['readonly','capability-umask']);}
  else{assert.equal(summary.completed[0].pass,false);if(fault==='launch'||fault==='progress-only'){if(fault==='launch')assert.match(summary.completed[0].launch_error,/synthetic launch/);assert.deepEqual(summary.unverified,[]);}
    else{assert.deepEqual(summary.unverified,['capability-umask']);assert(summary.outer_error);assert(fault==='persistence'?summary.completed[0].persistence_error:summary.completed[0].custody_error);}}
  return {fault,pass:true,aggregate_failed:true,unverified:summary.unverified,completed:summary.completed.map(({name,pass,launch_error,persistence_error,custody_error})=>({name,pass,launch_error,persistence_error,custody_error}))};
}
(async()=>{const cases=[];for(const fault of ['preflight','launch','persistence','custody','progress-only'])cases.push(await scenario(fault));console.log(JSON.stringify({kind:'test487-runner-failure-accounting',harness_sha256:hash(source),node:process.version,cases,pass:true,limitations:['Synthetic runner orchestration faults only; no package behavior or security clearance']}));})().catch(error=>{console.error(error);process.exitCode=1;});
