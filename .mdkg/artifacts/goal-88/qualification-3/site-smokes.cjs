// Bounded diagnostic execution of unchanged package smoke definitions.
// This does not claim the coverage-first release ladder passed.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const repo='/workspace/mdkg-cloud-goal88',dir='/workspace/mdkg-cloud-goal88-cache/candidate-2';
const ladder=require(path.join(repo,'scripts/release-ladder'));
const candidate=require(path.join(repo,'scripts/retained-release-candidate'));
const {withVerifiedArtifact}=require(path.join(repo,'scripts/qualification-artifact'));
const custody=JSON.parse(fs.readFileSync(path.join(dir,'custody.json')));
const manifest=JSON.parse(fs.readFileSync(path.join(repo,'scripts/smoke-manifest.json')));
ladder.validateManifest(manifest,JSON.parse(fs.readFileSync(path.join(repo,'package.json'))));
const all=ladder.canonicalEntries(manifest,'prepublish',undefined,'repository').filter(entry=>entry.prerequisites.includes('site_profile_cache'));
const from=Number(process.argv[2]||0),to=Number(process.argv[3]||all.length);
if(!Number.isInteger(from)||!Number.isInteger(to)||from<0||to>9||from>=to||all.length!==9)throw Error('bad bounded smoke range');
const receipts=path.join('/workspace/mdkg-cloud-goal88-cache/qualification-3',`sites-${from}-${to}-${process.env.MDKG_SITE_ATTEMPT||"b"}`),clean=`/dev/shm/mdkg-goal88-fixtures/sites-${from}-${to}-${process.env.MDKG_SITE_ATTEMPT||"b"}`;
fs.mkdirSync(receipts,{recursive:false});fs.mkdirSync(clean,{recursive:true});
const before=ladder.captureTrackedBoundary(repo),qualification=candidate.captureQualificationInputs(repo);
const admitted=candidate.admitRetainedCandidate(repo,custody);
const locate=name=>fs.realpathSync(spawnSync('which',[name],{encoding:'utf8'}).stdout.trim());
const tools={npm:locate('npm'),npx:locate('npx')},env=ladder.releaseEnvironment(clean,tools,'repository');
const bin=path.join(clean,'bin');fs.mkdirSync(bin);
for(const tool of ['npm','npx'])fs.writeFileSync(path.join(bin,tool),`#!/usr/bin/env node\nprocess.argv.splice(2,0,${JSON.stringify(tool)});require(${JSON.stringify(path.join(repo,'scripts/npm-smoke-proxy.js'))});\n`,{mode:0o755});
Object.assign(env,{PATH:bin+path.delimiter+env.PATH,npm_execpath:path.join(bin,'npm'),MDKG_SMOKE_TARBALL:custody.tarball,
 MDKG_SMOKE_TARBALL_SHA256:custody.sha256,MDKG_PUBLISHED_052_TARBALL:'/workspace/mdkg-cloud-goal88-cache/mdkg-0.5.2-published.tgz'});
const results=[],started=Date.now(),deadline=started+6*60*1000;
function save(final=false){fs.writeFileSync(path.join(receipts,'receipt.json'),JSON.stringify({kind:'diagnostic-repository-site-smoke-batch',final,
 coverage_gate:'NOT_RUN_BY_THIS_BATCH',source_head:before.head,from,to,declared_repository_site_smokes:9,artifact_sha256:custody.sha256,
 package_inputs_sha256:admitted.package_inputs_sha256,qualification_inputs_sha256:qualification.sha256,
 driver_sha256:crypto.createHash('sha256').update(fs.readFileSync(__filename)).digest('hex'),runtime:process.version,platform:process.platform,arch:process.arch,
 duration_ms:Date.now()-started,results},null,2)+'\n');}
try{
 save();
 for(const entry of all.slice(from,to)){
  const remaining=deadline-Date.now();if(remaining<=0)throw Error('bounded smoke batch exceeded6minutes');
  const start=Date.now();const consumed=withVerifiedArtifact(custody.tarball,custody.sha256,()=>spawnSync(process.execPath,[path.join(repo,entry.entrypoint)],
   {cwd:repo,env:{...env,MDKG_SMOKE_ID:entry.canonical},encoding:'utf8',timeout:Math.min(entry.timeout_seconds*1000,remaining),maxBuffer:32*1024*1024}));
  const r=consumed.result,log=entry.canonical.replace(/[^a-zA-Z0-9_.-]/g,'-')+'.log';
  fs.writeFileSync(path.join(receipts,log),`stdout:\n${r.stdout||''}\nstderr:\n${r.stderr||''}\n`);
  results.push({id:entry.canonical,entrypoint:entry.entrypoint,exit:r.status,signal:r.signal,error:r.error?.message,timed_out:r.error?.code==='ETIMEDOUT',duration_ms:Date.now()-start,log,artifact:consumed.verification});
  save();console.log(`${entry.canonical}: exit=${r.status} duration_ms=${Date.now()-start}`);
 }
 const after=candidate.admitRetainedCandidate(repo,custody,{previous:admitted});
 const boundary=ladder.compareTrackedBoundaries(before,ladder.captureTrackedBoundary(repo));
 if(!boundary.ok||qualification.sha256!==candidate.captureQualificationInputs(repo).sha256)throw Error('frozen input boundary drift');
 fs.writeFileSync(path.join(receipts,'boundary.json'),JSON.stringify({boundary,admission:after},null,2)+'\n');save(true);
 process.exitCode=results.every(r=>r.exit===0)?0:1;
}catch(error){fs.writeFileSync(path.join(receipts,'batch-error.log'),String(error.stack)+'\n');save();throw error;}
finally{for(const file of ['artifact-usages.jsonl','build-events.jsonl'])if(fs.existsSync(path.join(clean,file)))fs.copyFileSync(path.join(clean,file),path.join(receipts,file));}
