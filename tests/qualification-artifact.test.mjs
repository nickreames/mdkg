import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { createRequire } from 'node:module';

const repo = path.resolve(import.meta.dirname, '..');
const { verifyArtifactFile, withVerifiedArtifact } = createRequire(import.meta.url)('../scripts/qualification-artifact.js');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
function fixture(t) {
  const base = fs.existsSync('/private/tmp') ? '/private/tmp' : os.tmpdir();
  const root = fs.mkdtempSync(path.join(base, 'mdkg-artifact-custody-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const artifact = path.join(root, 'candidate.tgz');
  fs.writeFileSync(artifact, 'synthetic candidate bytes\n');
  const sha256 = hash(artifact);
  const destination = path.join(root, 'consumer');
  const provided = path.join(destination, path.basename(artifact));
  const env = { ...process.env, MDKG_SMOKE_TARBALL: artifact, MDKG_SMOKE_TARBALL_SHA256: sha256,
    MDKG_BUILD_RECEIPT_DIR: root, MDKG_SMOKE_ID: 'synthetic-consumer' };
  const provide = (target = destination) => spawnSync(process.execPath,
    [path.join(repo, 'scripts/npm-smoke-proxy.js'), 'npm', 'pack', '--pack-destination', target],
    { cwd: root, env, encoding: 'utf8', timeout: 10000 });
  return { root, artifact, sha256, destination, provided, provide, env };
}

test('candidate delivery uses independent bytes instead of a writable hard link', t => {
  const f = fixture(t), r = f.provide();
  assert.equal(r.status, 0, r.stderr);
  const source = fs.statSync(f.artifact), copy = fs.statSync(f.provided);
  assert.ok(source.dev !== copy.dev || source.ino !== copy.ino, 'consumer shares the canonical artifact inode');
  assert.equal(hash(f.provided), f.sha256);
  fs.chmodSync(f.provided, 0o600);
  fs.writeFileSync(f.provided, Buffer.alloc(copy.size, 88));
  assert.equal(hash(f.artifact), f.sha256, 'consumer mutation changed the canonical artifact');
});

test('candidate delivery cannot remove the canonical artifact by selecting its directory', t => {
  const f = fixture(t), r = f.provide(f.root);
  assert.notEqual(r.status, 0);
  assert.equal(hash(f.artifact), f.sha256, 'self-delivery removed or changed the canonical artifact');
});

test('candidate delivery preserves an existing unrelated destination', t => {
  const f = fixture(t);
  fs.mkdirSync(f.destination); fs.writeFileSync(f.provided, 'unrelated sentinel');
  const r = f.provide();
  assert.notEqual(r.status, 0);
  assert.equal(fs.readFileSync(f.provided, 'utf8'), 'unrelated sentinel');
  assert.equal(hash(f.artifact), f.sha256);
});

test('repeated delivery preserves a matching independent copy', t => {
  const f = fixture(t);
  assert.equal(f.provide().status, 0);
  const before = fs.statSync(f.provided);
  assert.equal(f.provide().status, 0);
  assert.equal(fs.statSync(f.provided).ino, before.ino);
  assert.equal(hash(f.provided), f.sha256);
});

test('artifact verification refuses symlinks and hard links without changing targets', t => {
  const f = fixture(t), link = path.join(f.root, 'linked.tgz');
  fs.symlinkSync(f.artifact, link);
  assert.throws(() => verifyArtifactFile(link, f.sha256), /independent regular file/);
  fs.unlinkSync(link); fs.linkSync(f.artifact, link);
  assert.throws(() => verifyArtifactFile(f.artifact, f.sha256), /independent regular file/);
  assert.equal(hash(f.artifact), f.sha256);
});

test('consumer checks bind unchanged candidate bytes before and after execution', t => {
  const f = fixture(t); let calls = 0;
  const result = withVerifiedArtifact(f.artifact, f.sha256, () => { calls++; return 'accepted'; });
  assert.equal(calls, 1); assert.equal(result.result, 'accepted');
  assert.equal(result.verification.before_sha256, f.sha256);
  assert.equal(result.verification.after_sha256, f.sha256);
});

test('a changed candidate fails before the consumer is called', t => {
  const f = fixture(t); let called = false;
  fs.writeFileSync(f.artifact, Buffer.alloc(fs.statSync(f.artifact).size, 65));
  assert.throws(() => withVerifiedArtifact(f.artifact, f.sha256, () => { called = true; }), /hash or identity mismatch/);
  assert.equal(called, false);
});

test('same-size mutation during a successful consumer invalidates qualification', t => {
  const f = fixture(t);
  assert.throws(() => withVerifiedArtifact(f.artifact, f.sha256, () => {
    fs.writeFileSync(f.artifact, Buffer.alloc(fs.statSync(f.artifact).size, 65)); return 0;
  }), /hash or identity mismatch/);
});

test('consumer failure is retained when unchanged artifact bytes are verified', t => {
  const f = fixture(t), failure = new Error('synthetic consumer failure');
  assert.throws(() => withVerifiedArtifact(f.artifact, f.sha256, () => { throw failure; }), error => error === failure);
});

test('both consumer failure and candidate corruption remain visible', t => {
  const f = fixture(t);
  assert.throws(() => withVerifiedArtifact(f.artifact, f.sha256, () => {
    fs.writeFileSync(f.artifact, 'changed'); throw new Error('consumer failed');
  }), error => error instanceof AggregateError && error.errors.length === 2 && /consumer failed/.test(error.message));
});

for (const mutate of [false, true]) {
  test(`install proxy verifies delivered bytes around the consumer (mutation=${mutate})`, t => {
    const f = fixture(t); assert.equal(f.provide().status, 0);
    const fakeNpm = path.join(f.root, 'fake-npm.js');
    fs.writeFileSync(fakeNpm, mutate ?
      "const fs=require('node:fs');const p=process.argv[3];fs.chmodSync(p,0o600);fs.writeFileSync(p,Buffer.alloc(fs.statSync(p).size,88));" :
      "process.stdout.write('synthetic local installation control\\n');");
    const r = spawnSync(process.execPath, [path.join(repo, 'scripts/npm-smoke-proxy.js'), 'npm', 'install', f.provided],
      { cwd: f.root, env: { ...f.env, MDKG_REAL_NPM: fakeNpm }, encoding: 'utf8', timeout: 10000 });
    assert.equal(hash(f.artifact), f.sha256);
    const receipt = path.join(f.root, 'artifact-consumptions.jsonl');
    if (mutate) {
      assert.notEqual(r.status, 0); assert.match(r.stderr, /hash or identity mismatch/);
      assert.equal(fs.existsSync(receipt), false);
    } else {
      assert.equal(r.status, 0, r.stderr);
      const entry = JSON.parse(fs.readFileSync(receipt, 'utf8'));
      assert.equal(entry.before_sha256, f.sha256); assert.equal(entry.after_sha256, f.sha256);
      assert.equal(entry.consumer_exit_status, 0);
    }
  });
}

test('install refuses a changed delivered tarball before invoking the consumer', t => {
  const f = fixture(t); assert.equal(f.provide().status, 0);
  fs.chmodSync(f.provided, 0o600); fs.writeFileSync(f.provided, 'tampered delivery');
  const fakeNpm = path.join(f.root, 'fake-npm.js'), marker = path.join(f.root, 'executed');
  fs.writeFileSync(fakeNpm, `require('node:fs').writeFileSync(${JSON.stringify(marker)}, 'unexpected')`);
  const r = spawnSync(process.execPath, [path.join(repo, 'scripts/npm-smoke-proxy.js'), 'npm', 'install', f.provided],
    { cwd: f.root, env: { ...f.env, MDKG_REAL_NPM: fakeNpm }, encoding: 'utf8', timeout: 10000 });
  assert.notEqual(r.status, 0); assert.match(r.stderr, /hash or identity mismatch/);
  assert.equal(fs.existsSync(marker), false); assert.equal(hash(f.artifact), f.sha256);
});

test('install refuses an unrecorded tarball instead of counting a different candidate', t => {
  const f = fixture(t); assert.equal(f.provide().status, 0);
  const other = path.join(f.root, 'unrecorded.tgz'); fs.copyFileSync(f.provided, other);
  const r = spawnSync(process.execPath, [path.join(repo, 'scripts/npm-smoke-proxy.js'), 'npm', 'install', other],
    { cwd: f.root, env: { ...f.env, MDKG_REAL_NPM: process.execPath }, encoding: 'utf8', timeout: 10000 });
  assert.notEqual(r.status, 0); assert.match(r.stderr, /recorded verified tarball delivery/);
  assert.equal(hash(f.artifact), f.sha256);
});

test('published baseline declaration cannot substitute caller-supplied hashes for the pinned release', t => {
  const f=fixture(t), baseline=path.join(f.root,'published-mdkg-0.5.2.tgz'), marker=path.join(f.root,'executed');
  fs.copyFileSync(f.artifact,baseline);
  const fake=path.join(f.root,'fake-npm.js');fs.writeFileSync(fake,`require('node:fs').writeFileSync(${JSON.stringify(marker)},'bad');`);
  const r=spawnSync(process.execPath,[path.join(repo,'scripts/npm-smoke-proxy.js'),'npm','install',baseline,'--offline'],
    {cwd:f.root,env:{...f.env,MDKG_SMOKE_BASELINE_TARBALL:baseline,MDKG_SMOKE_BASELINE_SHA256:hash(baseline),MDKG_REAL_NPM:fake},encoding:'utf8',timeout:10000});
  assert.notEqual(r.status,0);assert.match(r.stderr,/baseline.*mismatch/);
  assert.equal(fs.existsSync(marker),false);assert.equal(fs.existsSync(path.join(f.root,'baseline-consumptions.jsonl')),false);
});

for(const mutate of [false,true])test(`real proxy keeps synthetic pinned-baseline consumption separate from candidate proof (mutation=${mutate})`,t=>{
  const f=fixture(t),baseline=path.join(f.root,'synthetic-baseline.tgz'),preload=path.join(f.root,'synthetic-pin.cjs'),fake=path.join(f.root,'fake-npm.js');
  fs.writeFileSync(baseline,'synthetic pinned baseline bytes, not a published package\n');
  const bytes=fs.readFileSync(baseline),pin={version:'synthetic-test-only',bytes:bytes.length,sha256:hash(baseline),integrity:'sha512-'+crypto.createHash('sha512').update(bytes).digest('base64')};
  // Test-process-only module injection exercises the real proxy/verifier route.
  // Production accepts only the source-pinned 0.5.2; no CLI or environment pin override exists.
  fs.writeFileSync(preload,`const b=require(${JSON.stringify(path.join(repo,'scripts/published-upgrade-baseline.js'))});const read=b.readLocalBaseline;b.PUBLISHED_052=${JSON.stringify(pin)};b.readLocalBaseline=file=>read(file,b.PUBLISHED_052);`);
  fs.writeFileSync(fake,mutate?`require('node:fs').writeFileSync(${JSON.stringify(baseline)},'tampered');`:'console.log("synthetic consumer only");');
  const r=spawnSync(process.execPath,['--require',preload,path.join(repo,'scripts/npm-smoke-proxy.js'),'npm','install','-g',baseline,'--prefix',path.join(f.root,'prefix'),'--offline','--no-audit','--no-fund'],
    {cwd:f.root,env:{...f.env,MDKG_SMOKE_BASELINE_TARBALL:baseline,MDKG_REAL_NPM:fake},encoding:'utf8',timeout:10000});
  const receipt=path.join(f.root,'baseline-consumptions.jsonl');
  assert.equal(hash(f.artifact),f.sha256);assert.equal(fs.existsSync(path.join(f.root,'artifact-consumptions.jsonl')),false);
  if(mutate){assert.notEqual(r.status,0);assert.match(r.stderr,/hash or identity mismatch/);assert.equal(fs.existsSync(receipt),false);}
  else {assert.equal(r.status,0,r.stderr);const entry=JSON.parse(fs.readFileSync(receipt,'utf8'));assert.equal(entry.kind,'published-upgrade-baseline');assert.equal(entry.version,'synthetic-test-only');assert.equal(entry.before_sha256,pin.sha256);assert.equal(entry.after_sha256,pin.sha256);assert.equal(entry.consumer_exit_status,0);}
});

test('baseline route requires one exact declared artifact and offline invocation',t=>{
  const f=fixture(t),baseline=path.join(f.root,'baseline.tgz');fs.copyFileSync(f.artifact,baseline);
  for(const args of [['install',baseline],['install',f.artifact,'--offline'],['install',baseline,f.artifact,'--offline'],
    ['install',baseline,'--offline',f.root],['install',baseline,'--offline','other-package'],
    ['install',baseline,'--offline','--offline=false'],['install',baseline,'--offline','--registry=https://example.invalid'],
    ['install',baseline,'--offline','--prefix','--offline=false']]){
    const r=spawnSync(process.execPath,[path.join(repo,'scripts/npm-smoke-proxy.js'),'npm',...args],{cwd:f.root,env:{...f.env,MDKG_SMOKE_BASELINE_TARBALL:baseline},encoding:'utf8',timeout:10000});
    assert.notEqual(r.status,0);assert.match(r.stderr,/one exact declared offline tarball/);
  }
  assert.equal(fs.existsSync(path.join(f.root,'baseline-consumptions.jsonl')),false);
});
