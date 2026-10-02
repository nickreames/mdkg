// Reuse three existing manifest-backed consumer smokes with retained bytes.
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const repo = path.resolve(__dirname, '../../..');
const { createOwnedFixture, finalizeFixture } = require(path.join(repo, 'scripts/qualification-fixture'));
const { createSmokeCommands } = require(path.join(repo, 'scripts/qualification-smoke'));
const { withVerifiedArtifact } = require(path.join(repo, 'scripts/qualification-artifact'));
const { admitRetainedCandidate, captureQualificationInputs } = require(path.join(repo, 'scripts/retained-release-candidate'));
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const base = path.join(__dirname, 'private/candidate-0.6.0-6154e4ea920bfa09');
const options = { tarball:base+'.tgz', sha256:'6154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca',
  inputs:base+'.package-inputs-dec100.json', inputsSha256:'bcc8b6e1ec5aac804e20ef2fe6676ecfdfa8ae367f69e35a884b5b5980c8fe90' };
const admitted=admitRetainedCandidate(repo, options), harness=captureQualificationInputs(repo), driverHash=hash(fs.readFileSync(__filename));
const fixture=createOwnedFixture({base:'/private/tmp',prefix:'mdkg-installed-work-family-'});
const npm=fs.realpathSync('/opt/homebrew/opt/node@24/bin/npm');
const commands=createSmokeCommands(fixture,{...process.env,npm_execpath:npm});
const completed=[],started=Date.now(); let failure, deliveries=[], consumptions=[];
const verify=()=>{admitRetainedCandidate(repo,options,{previous:admitted});
  assert.equal(captureQualificationInputs(repo).sha256,harness.sha256); assert.equal(hash(fs.readFileSync(__filename)),driverHash);};
try {
  const receipts=fixture.resolve('receipts'),bin=fixture.resolve('bin');fs.mkdirSync(receipts);fs.mkdirSync(bin);
  const proxy=path.join(bin,'npm');fs.writeFileSync(proxy,`#!${process.execPath}\nprocess.argv.splice(2,0,'npm');require(${JSON.stringify(path.join(repo,'scripts/npm-smoke-proxy.js'))});\n`,{flag:'wx',mode:0o755});
  const env={...commands.environment,PATH:path.dirname(process.execPath)+path.delimiter+process.env.PATH,
    npm_execpath:proxy,MDKG_REAL_NPM:npm,MDKG_SMOKE_TARBALL:options.tarball,
    MDKG_SMOKE_TARBALL_SHA256:options.sha256,MDKG_SMOKE_TMPDIR:fixture.root,TMPDIR:fixture.root,
    MDKG_BUILD_RECEIPT_DIR:receipts,MDKG_RELEASE_SCOPE:'package',NPM_CONFIG_OFFLINE:'true',npm_config_offline:'true'};
  delete env.MDKG_KEEP_SMOKE_TMP;
  for(const script of ['smoke-archive-work.js','smoke-work-invocation.js','smoke-graph-clone.js']){
    verify(); const begin=Date.now();
    // Each top-level smoke owns supervision and cleanup. Avoid a nested fixture
    // controller or outer timeout that could orphan its inner owned workers.
    const result=withVerifiedArtifact(options.tarball,options.sha256,()=>spawnSync(process.execPath,[path.join(repo,'scripts',script)],{
      cwd:fixture.root,env:{...env,MDKG_SMOKE_ID:script},encoding:'utf8',maxBuffer:16*1024*1024})).result;
    completed.push({script,exit_code:result.status,signal:result.signal,duration_ms:Date.now()-begin,
      stdout:result.stdout,stderr:result.stderr});
    assert.equal(result.status,0,result.stdout+result.stderr);assert.equal(result.signal,null);verify();
    console.log(JSON.stringify({event:'smoke-passed',script,duration_ms:Date.now()-begin}));
  }
  const rows=name=>fs.readFileSync(path.join(receipts,name),'utf8').trim().split('\n').map(JSON.parse);
  deliveries=rows('artifact-usages.jsonl');consumptions=rows('artifact-consumptions.jsonl');
  assert.equal(deliveries.length,3);assert.equal(consumptions.length,3);
  for(const row of deliveries) assert.equal(row.sha256,options.sha256);
  for(const row of consumptions){assert.equal(row.before_sha256,options.sha256);assert.equal(row.after_sha256,options.sha256);assert.equal(row.consumer_exit_status,0);}
  verify();
}catch(error){failure=error;}
const receipt={schema_version:1,kind:'test480-current-installed-work-archive-fork',owner:'root:test-480',
  node:process.version,platform:process.platform,architecture:process.arch,candidate_sha256:options.sha256,
  package_inputs_sha256:admitted.package_inputs_sha256,input_manifest_sha256:options.inputsSha256,
  harness_inputs_sha256:harness.sha256,driver_sha256:driverHash,duration_ms:Date.now()-started,completed,deliveries,consumptions,
  limitations:['Three existing smokes only, not the complete37-smoke release ladder.','Native macOS only; old-client/runtime/platform and independent acceptance remain separate.']};
try{const cleanup=finalizeFixture(fixture,{error:failure,verify});receipt.cleanup={removed:cleanup.removed,owned_fixture_only:true};receipt.pass=true;}
catch(error){receipt.pass=false;receipt.error=error.message;process.exitCode=1;}
console.log(JSON.stringify(receipt));
