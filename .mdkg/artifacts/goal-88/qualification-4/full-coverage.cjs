// One bounded complete thresholded run; no coverage policy or test selector changes.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const repo='/workspace/mdkg-cloud-goal88',out='/workspace/mdkg-cloud-goal88-cache/qualification-4';
const candidate=require(path.join(repo,'scripts/retained-release-candidate'));
const ladder=require(path.join(repo,'scripts/release-ladder'));
const prior=JSON.parse(fs.readFileSync('/workspace/mdkg-cloud-goal88-cache/candidate-2/custody.json'));
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const boundary=ladder.captureTrackedBoundary(repo),packageInputs=candidate.capturePackageInputs(repo),qualification=candidate.captureQualificationInputs(repo);
const admission=candidate.admitRetainedCandidate(repo,prior);
const started=Date.now(),log=fs.openSync(path.join(out,'full-coverage.log'),'wx');
const receipt={kind:'bounded-full-thresholded-coverage',source_head:boundary.head,source_diff_sha256:crypto.createHash('sha256').update(spawnSync('git',['diff','--binary','HEAD'],{cwd:repo}).stdout).digest('hex'),runtime:process.version,platform:process.platform,arch:process.arch,package_inputs_sha256:packageInputs.sha256,qualification_inputs_sha256:qualification.sha256,artifact_sha256:prior.sha256,driver_sha256:hash(__filename),command:[process.execPath,'scripts/coverage-contract.js','run'],outer_bound_seconds:900,coverage_policy:'unchanged thresholds89/77/96; unchanged complete discovered test files; ordinary full tests included under coverage'};
fs.writeFileSync(path.join(out,'full-coverage-start.json'),JSON.stringify(receipt,null,2)+'\n');
try {
 const result=spawnSync(process.execPath,['scripts/coverage-contract.js','run'],{cwd:repo,env:{...process.env,TMPDIR:'/dev/shm/mdkg-goal88-fixtures/full-coverage-review',MDKG_COVERAGE_DIR:path.join(out,'coverage'),MDKG_PUBLISHED_052_TARBALL:'/workspace/mdkg-cloud-goal88-cache/mdkg-0.5.2-published.tgz',XDG_CONFIG_HOME:path.join(out,'astro-config'),ASTRO_TELEMETRY_DISABLED:'1'},stdio:['ignore',log,log],timeout:900000,killSignal:'SIGTERM'});
 const after=candidate.admitRetainedCandidate(repo,prior,{previous:admission});
 const tracked=ladder.compareTrackedBoundaries(boundary,ladder.captureTrackedBoundary(repo));
 const frozen=packageInputs.sha256===candidate.capturePackageInputs(repo).sha256&&qualification.sha256===candidate.captureQualificationInputs(repo).sha256&&tracked.ok;
 Object.assign(receipt,{exit:result.status,signal:result.signal,error:result.error?.message,timed_out:result.error?.code==='ETIMEDOUT',duration_ms:Date.now()-started,frozen_inputs:frozen,tracked_boundary:tracked,admission:after,evidence_files:fs.readdirSync(path.join(out,'coverage'))});
 fs.writeFileSync(path.join(out,'full-coverage-receipt.json'),JSON.stringify(receipt,null,2)+'\n');
 process.exitCode=frozen?(result.status??1):2;
} finally {fs.closeSync(log);}
