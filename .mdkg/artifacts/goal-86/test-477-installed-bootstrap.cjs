// Local Test477 runner. Reuses manifest-backed installed smokes; not a release seal.
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const repo = path.resolve(__dirname, '../../..');
const { createOwnedFixture } = require(path.join(repo, 'scripts/qualification-fixture'));
const { createSmokeCommands } = require(path.join(repo, 'scripts/qualification-smoke'));
const { assertDirectoryChain, readRegularJsonFile } = require(path.join(repo, 'scripts/qualification-output'));
const { verifyArtifactFile, copyVerifiedArtifact, withVerifiedArtifact } = require(path.join(repo, 'scripts/qualification-artifact'));
const { PUBLISHED_052, readLocalBaseline } = require(path.join(repo, 'scripts/published-upgrade-baseline'));
const expected = process.env.MDKG_EXPECTED_CANDIDATE_SHA256;
assert.match(expected || '', /^[a-f0-9]{64}$/);
assert(process.env.MDKG_PUBLISHED_052_TARBALL, 'explicit local published baseline required; no download fallback');
assert(process.env.MDKG_REAL_NPM, 'explicit local npm executable required');
readLocalBaseline(process.env.MDKG_PUBLISHED_052_TARBALL);
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const version = JSON.parse(fs.readFileSync(path.join(repo, 'package.json'))).version;
assert.equal(version, '0.6.0');
const retainedDirectory = path.join(__dirname, 'private');
assertDirectoryChain(retainedDirectory);
const candidate = path.join(retainedDirectory, `candidate-${version}-${expected.slice(0, 16)}.tgz`);
const inputCapture = candidate.replace(/\.tgz$/, '.inputs.json');
const runnerHash = digest(fs.readFileSync(__filename));
const snapshot = () => {
  const files = [];
  const visit = relative => {
    const file = path.join(repo, relative), stat = fs.lstatSync(file);
    if (stat.isDirectory()) for (const child of fs.readdirSync(file).sort()) visit(path.join(relative, child));
    else { assert(stat.isFile() && stat.nlink === 1, `nonregular source input: ${relative}`);
      files.push({ path: relative.split(path.sep).join('/'), sha256: digest(fs.readFileSync(file)), mode: stat.mode & 0o777 }); }
  };
  for (const relative of ['src', 'assets/init', 'scripts', 'package.json', 'package-lock.json',
    'tsconfig.json', 'tsconfig.build.json', 'README.md', 'CLI_COMMAND_MATRIX.md',
    'CHANGELOG.md', 'CONTRIBUTING.md', 'LICENSE']) visit(relative);
  return { sha256: digest(JSON.stringify(files)), files };
};
const before = snapshot();
const fixture = createOwnedFixture({ base: '/private/tmp', prefix: 'mdkg-bootstrap-qualification-' });
const commands = createSmokeCommands(fixture, { ...process.env, npm_execpath: process.env.MDKG_REAL_NPM });
const completed = [], started = new Date().toISOString();
const jsonLines = file => fs.existsSync(file) ? fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map(JSON.parse) : [];
try {
  let packed = null;
  if (!fs.existsSync(candidate)) {
    const packDirectory = fixture.resolve('pack'); fs.mkdirSync(packDirectory);
    const output = commands.npm(['pack', repo, '--silent', '--offline', '--dry-run=false', '--pack-destination', packDirectory]).stdout;
    const filename = output.split(/\r?\n/).map(line => line.trim()).filter(Boolean).at(-1);
    assert.equal(filename, `mdkg-${version}.tgz`, 'normal npm pack must return the expected final filename');
    packed = { filename, version, method: 'normal npm prepack with exact artifact hash admission' };
    const fresh = fixture.resolve(path.join('pack', filename));
    verifyArtifactFile(fresh, expected);
    assert.deepEqual(snapshot(), before, 'source inputs changed during packing');
    copyVerifiedArtifact(fresh, candidate, expected);
    fs.writeFileSync(inputCapture, JSON.stringify({ schema_version: 1,
      kind: 'candidate-source-input-capture-not-release-seal', version,
      sha256: expected, runtime: process.version, runner_sha256: runnerHash,
      source_inputs: before }, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
  } else {
    const captured = readRegularJsonFile(inputCapture);
    assert.equal(captured.kind, 'candidate-source-input-capture-not-release-seal');
    assert.equal(captured.sha256, expected);
    assert.deepEqual(captured.source_inputs, before, 'retained candidate source-input capture is stale');
  }
  const artifact = verifyArtifactFile(candidate, expected);
  const admittedCapture = readRegularJsonFile(inputCapture);
  assert.equal(admittedCapture.sha256, expected);
  assert.deepEqual(admittedCapture.source_inputs, before);
  const captureHash = digest(fs.readFileSync(inputCapture));
  verifyArtifactFile(inputCapture, captureHash);
  const receipts = fixture.resolve('receipts'); fs.mkdirSync(receipts);
  const bin = fixture.resolve('bin'); fs.mkdirSync(bin);
  const proxy = path.join(bin, 'npm');
  fs.writeFileSync(proxy, `#!${process.execPath}\nprocess.argv.splice(2,0,'npm');require(${JSON.stringify(path.join(repo, 'scripts/npm-smoke-proxy.js'))});\n`, { flag: 'wx', mode: 0o755 });
  const environment = { ...commands.environment,
    PATH: [path.dirname(process.execPath), process.env.PATH || ''].join(path.delimiter),
    npm_execpath: proxy, MDKG_REAL_NPM: process.env.MDKG_REAL_NPM,
    MDKG_SMOKE_TARBALL: candidate, MDKG_SMOKE_TARBALL_SHA256: expected,
    MDKG_PUBLISHED_052_TARBALL: process.env.MDKG_PUBLISHED_052_TARBALL,
    MDKG_SMOKE_TMPDIR: fixture.root, TMPDIR: fixture.root,
    MDKG_BUILD_RECEIPT_DIR: receipts, NPM_CONFIG_OFFLINE: 'true', npm_config_offline: 'true' };
  delete environment.MDKG_KEEP_SMOKE_TMP;
  for (const entry of ['smoke-init.js', 'smoke-upgrade.js']) {
    const begin = performance.now();
    // These top-level smokes own and supervise their own fixture processes and
    // finalization. Do not nest their cleanup under a worker-context preload.
    // No outer timeout/kill is applied; on any failure retain this root.
    const captureConsumed = withVerifiedArtifact(inputCapture, captureHash,
      () => withVerifiedArtifact(candidate, expected, () => spawnSync(process.execPath,
      [path.join(repo, 'scripts', entry)], { cwd: fixture.root,
        env: { ...environment, MDKG_SMOKE_ID: entry }, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })));
    const consumed = captureConsumed.result;
    const result = consumed.result;
    const run = { entrypoint: `scripts/${entry}`, duration_ms: performance.now() - begin,
      exit_code: result.status, signal: result.signal, artifact_verification: consumed.verification,
      input_capture_verification: captureConsumed.verification,
      stdout: result.stdout, stderr: result.stderr };
    completed.push(run);
    assert.equal(result.error, undefined);
    assert.equal(result.signal, null);
    assert.equal(result.status, 0, JSON.stringify(run));
    assert.deepEqual(snapshot(), before, 'source inputs changed during installed qualification');
    console.log(JSON.stringify({ event: 'installed-smoke-passed', entrypoint: entry, duration_ms: run.duration_ms, candidate_sha256: expected }));
  }
  const deliveries = jsonLines(path.join(receipts, 'artifact-usages.jsonl'));
  const consumptions = jsonLines(path.join(receipts, 'artifact-consumptions.jsonl'));
  const baselines = jsonLines(path.join(receipts, 'baseline-consumptions.jsonl'));
  assert.equal(deliveries.length, 2); assert.equal(consumptions.length, 2); assert.equal(baselines.length, 2);
  for (const row of deliveries) assert.equal(row.sha256, expected);
  for (const row of consumptions) {
    assert.equal(row.before_sha256, expected); assert.equal(row.after_sha256, expected); assert.equal(row.consumer_exit_status, 0);
  }
  for (const row of baselines) {
    assert.equal(row.before_sha256, PUBLISHED_052.sha256); assert.equal(row.after_sha256, PUBLISHED_052.sha256); assert.equal(row.consumer_exit_status, 0);
  }
  verifyArtifactFile(candidate, expected);
  verifyArtifactFile(inputCapture, captureHash);
  readLocalBaseline(process.env.MDKG_PUBLISHED_052_TARBALL);
  assert.deepEqual(snapshot(), before);
  assert.equal(digest(fs.readFileSync(__filename)), runnerHash);
  const receipt = { kind: 'test477-local-installed-bootstrap', started_at: started,
    runtime: process.version, platform: process.platform, architecture: process.arch,
    candidate: { path: candidate, sha256: expected, bytes: artifact.bytes,
      integrity: 'sha512-' + crypto.createHash('sha512').update(fs.readFileSync(candidate)).digest('base64'), retained: true, sealed: false,
      input_capture: inputCapture, input_capture_sha256: captureHash },
    runner_sha256: runnerHash,
    source_inputs: { sha256: before.sha256, file_count: before.files.length, manifest: inputCapture },
    pack: packed, baseline: { ...PUBLISHED_052, source: 'verified-local-cache-no-download' },
    completed, deliveries, consumptions, baselines, source_inputs_unchanged: true,
    cleanup: fixture.cleanup(), final_artifact_qualification: false };
  console.log(JSON.stringify(receipt));
} catch (error) {
  console.error(JSON.stringify({ kind: 'test477-local-installed-bootstrap-failure', fixture_retained: fixture.root,
    completed, message: error.message }));
  process.exitCode = 1;
}
