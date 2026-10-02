// One offline non-root execution per explicitly selected family; no repacking.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),os=require('node:os'),assert=require('node:assert/strict');
const {spawn,execFileSync}=require('node:child_process');
const repo=path.resolve(__dirname,'../../..'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const manifestPath=path.join(repo,'capsule-manifest.json');let manifest,environment;
const output=process.env.MDKG_LINUX_OUTPUT||'/private/tmp/mdkg-linux-results';
assert(/^\/private\/tmp\/mdkg-linux-results(?:-[a-z0-9-]+)?$/.test(output));assert(!fs.existsSync(output));fs.mkdirSync(output,{mode:0o700});
function verify(){for(const row of manifest.files){const file=path.join(repo,row.path),s=fs.lstatSync(file);assert(s.isFile()&&s.nlink===1,row.path);assert.equal(fs.realpathSync(file),file);assert.equal(hash(fs.readFileSync(file)),row.sha256,row.path);assert.equal(s.mode&0o777,row.mode,row.path);}}
const command=(name,args)=>execFileSync(name,args,{encoding:'utf8',timeout:10000}).trim();
function inspectEnvironment(){return {platform:process.platform,arch:process.arch,node:process.version,uid:process.getuid(),kernel:os.release(),
  os_release:fs.readFileSync('/etc/os-release','utf8'),git:command('git',['--version']),npm:command(process.execPath,[process.env.MDKG_REAL_NPM,'--version']),
  root_filesystem:command('findmnt',['-n','-o','SOURCE,FSTYPE,OPTIONS','--target','/']),fixture_filesystem:command('findmnt',['-n','-o','SOURCE,FSTYPE,OPTIONS','--target','/private/tmp']),
  packages:command('dpkg-query',['-W','-f=${Package} ${Version}\n','git','ca-certificates','xz-utils','libc6']),
  native_or_emulated:process.arch==='arm64'?'native ARM64 Linux on ARM64 host':'emulated x86_64 Linux on ARM64 host; no native performance claim'};}
const families=[['bootstrap','test-477-installed-bootstrap.cjs'],['collaboration','test-478-installed-collaboration.cjs'],
  ['gitdir','test-478-indirection-qualification.cjs',{MDKG_TEST478_TOPOLOGY:'gitdir'}],['submodule','test-478-indirection-qualification.cjs',{MDKG_TEST478_TOPOLOGY:'submodule'}],
  ['ownership','test-479-installed-ownership.cjs'],['state-admission','test-479-state-admission.cjs'],['containment','test-479-installed-containment.cjs'],
  ['remedies','test-479-installed-remedies.cjs'],['compatibility','test-480-installed-compatibility.cjs'],['work','test-480-installed-work-smokes.cjs'],
  ['runtime','test-480-old-client-runtime.cjs'],['behavior','test-483-installed-behavior.cjs'],['pack-controls','test-483-installed-pack-controls.cjs'],
  ['generic','test-484-installed-generic.cjs'],['options','test-486-linux-options.cjs'],['readonly','test-487-docker-readonly.cjs'],['scale','test-481-installed-scale.cjs'],
  ['capability-umask','test-487-installed-capability-umask.cjs']];
const selected=(process.env.MDKG_LINUX_FAMILIES||families.map(x=>x[0]).join(',')).split(',');
const completed=[],started=new Date().toISOString();
async function run([name,driver,extra={}]){verify();const start=Date.now(),streams={stdout:'',stderr:''};
  console.log(JSON.stringify({event:'family-started',name,arch:process.arch}));
  const result=await new Promise(resolve=>{const child=spawn(process.execPath,[path.join(__dirname,driver)],{cwd:repo,env:{...process.env,...extra,TMPDIR:'/private/tmp',TMP:'/private/tmp',TEMP:'/private/tmp'},stdio:['ignore','pipe','pipe']});
    for(const stream of ['stdout','stderr'])child[stream].on('data',bytes=>{streams[stream]+=bytes; if(stream==='stdout')for(const line of bytes.toString().split('\n'))if(line.length<600&&line.includes('"event"'))console.log(line);});
    child.once('error',error=>resolve({status:null,signal:null,launch_error:error.message}));child.once('close',(status,signal)=>resolve({status,signal}));});
  const row={name,driver,...result,duration_ms:Date.now()-start,pass:false};
  completed.push(row);
  try{for(const stream of ['stdout','stderr']){fs.writeFileSync(path.join(output,name+'.'+stream+'.txt'),streams[stream],{flag:'wx',mode:0o600});row[stream+'_sha256']=hash(streams[stream]);}}
  catch(error){row.persistence_error=error.message;throw error;}
  const lines=streams.stdout.split('\n').filter(Boolean);try{row.receipt=JSON.parse(lines.at(-1));}catch{row.parse_failed=true;}
  row.pass=Boolean(!result.launch_error&&result.status===0&&result.signal===null&&typeof row.receipt?.kind==='string'&&row.receipt.pass!==false);
  try{verify();row.capsule_after_verified=true;}catch(error){row.pass=false;row.custody_error=error.message;throw error;}
  console.log(JSON.stringify({event:'family-finished',name,arch:process.arch,pass:row.pass,duration_ms:row.duration_ms}));
  if(!row.pass)console.error(streams.stderr.slice(-2000));
}
async function main(){let failure;
  try{
    assert(selected.length&&new Set(selected).size===selected.length&&selected.every(x=>families.some(y=>y[0]===x)));
    manifest=JSON.parse(fs.readFileSync(manifestPath));
    assert.equal(hash(fs.readFileSync(manifestPath)),process.env.MDKG_CAPSULE_MANIFEST_SHA256);
    assert.equal(hash(fs.readFileSync('/capsule/runtime-downloads.json')),process.env.MDKG_RUNTIME_MANIFEST_SHA256);
    assert.equal(process.platform,'linux');assert.equal(process.version,'v24.18.0');assert.equal(process.getuid(),10001);
    assert(['arm64','x64'].includes(process.arch));assert.equal(process.arch,process.env.MDKG_EXPECTED_ARCH);
    verify();environment=inspectEnvironment();
    for(const family of families.filter(x=>selected.includes(x[0])))await run(family);
    verify();
  }catch(error){failure=error;console.error(error);}
  const unverified=selected.filter(name=>!completed.some(row=>row.name===name));
  const receipt={kind:'test487-local-docker-installed-families',started_at:started,completed_at:new Date().toISOString(),candidate_sha256:manifest?.candidate_sha256,
    capsule_manifest_sha256:process.env.MDKG_CAPSULE_MANIFEST_SHA256,runtime_manifest_sha256:process.env.MDKG_RUNTIME_MANIFEST_SHA256,source_revision:manifest?.source_revision,
    package_inputs_sha256:manifest?.package_inputs_sha256,harness_inputs_sha256:manifest?.harness_inputs_sha256,environment,completed,unverified,
    ...(failure?{outer_error:failure.message}:{}),pass:!failure&&unverified.length===0&&completed.length===selected.length&&completed.every(x=>x.pass),
    limitations:['Platform subset evidence only until aggregate acceptance; not publication readiness or security clearance','Bugs46/47 deferred/unresolved; Windows and hosted CI unqualified','Copied fixture adapters are separately hash-bound; no shipped package inputs changed']};
  fs.writeFileSync(path.join(output,'receipt.json'),JSON.stringify(receipt,null,2)+'\n',{flag:'wx',mode:0o600});console.log(JSON.stringify({event:'qualification-finished',pass:receipt.pass,output}));if(!receipt.pass)process.exitCode=1;
}
main().catch(e=>{console.error(e);process.exitCode=1;});
