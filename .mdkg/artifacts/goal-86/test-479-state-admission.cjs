// Test479 supplement: real runtime/selector exclusion and live recovery admission.
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const repo = path.resolve(__dirname, '../../..');
const { createOwnedFixture } = require(path.join(repo, 'scripts/qualification-fixture'));
const { createSmokeCommands } = require(path.join(repo, 'scripts/qualification-smoke'));
const { verifyArtifactFile, copyVerifiedArtifact, withVerifiedArtifact } = require(path.join(repo, 'scripts/qualification-artifact'));
const recoveryWorker = path.join(__dirname, 'node-portability/recovery-admission-worker.cjs');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const expected = process.env.MDKG_EXPECTED_CANDIDATE_SHA256;
assert.match(expected || '', /^[a-f0-9]{64}$/); assert(process.env.MDKG_REAL_NPM);
const selected = process.env.MDKG_TEST479_SUPPLEMENT || 'all';
assert(['all', 'runtime-state', 'admission'].includes(selected), 'unknown qualification family');
const candidate = path.join(__dirname, 'private', `candidate-0.6.0-${expected.slice(0, 16)}.tgz`);
const capture = candidate.replace(/\.tgz$/, '.qualification-inputs-bug61.json');
const captureHash = hash(capture), captured = JSON.parse(fs.readFileSync(capture));
assert.equal(captured.sha256, expected);
const drivers = [__filename, recoveryWorker].map(file => ({ file, sha256: hash(file) }));
function sourceCheck() {
  for (const row of captured.source_inputs.files) {
    const file = path.join(repo, row.path); assert.equal(hash(file), row.sha256, row.path);
    assert.equal(fs.lstatSync(file).mode & 0o777, row.mode, row.path);
  }
  for (const row of captured.qualification_inputs || []) assert.equal(hash(path.join(repo, row.path)), row.sha256);
  for (const row of drivers) assert.equal(hash(row.file), row.sha256, row.file);
}
sourceCheck(); verifyArtifactFile(candidate, expected); verifyArtifactFile(capture, captureHash);
const fixture = createOwnedFixture({ base: '/private/tmp', prefix: 'mdkg-ownership-state-' });
const commands = createSmokeCommands(fixture, { ...process.env, npm_execpath: process.env.MDKG_REAL_NPM,
  PATH: path.dirname(process.execPath) + path.delimiter + process.env.PATH });
const inventory = root => {
  const rows = [];
  const walk = dir => { for (const name of fs.readdirSync(dir).sort()) {
    const file = path.join(dir, name), s = fs.lstatSync(file), relative = path.relative(root, file);
    assert(!s.isSymbolicLink(), `unexpected package link ${relative}`);
    if (s.isDirectory()) { rows.push([relative, 'directory', s.mode]); walk(file); }
    else { assert(s.isFile()); rows.push([relative, 'file', s.mode, hash(file)]); }
  } }; walk(root); return rows;
};
const completed = [], started = new Date().toISOString();
try {
  const tarball = fixture.resolve('candidate.tgz'); copyVerifiedArtifact(candidate, tarball, expected);
  const prefix = fixture.resolve('installed'); fs.mkdirSync(prefix);
  const setupStart = performance.now();
  withVerifiedArtifact(candidate, expected, () => withVerifiedArtifact(tarball, expected,
    () => commands.npm(['install', '--offline', '--prefix', prefix, tarball, '--foreground-scripts'], { env: { NPM_CONFIG_OFFLINE: 'true' } })));
  const setupMs = performance.now() - setupStart;
  const installed = path.join(prefix, 'node_modules/mdkg'), cli = path.join(installed, 'dist/cli.js');
  const pkg = JSON.parse(fs.readFileSync(path.join(installed, 'package.json')));
  assert.equal(pkg.version, '0.6.0'); assert.equal(pkg.engines.node, '>=24.18.0 <25');
  const installedBefore = inventory(installed);
  function family(name, callback) {
    sourceCheck(); assert.deepEqual(inventory(installed), installedBefore);
    const begin = performance.now();
    const checked = withVerifiedArtifact(capture, captureHash, () => withVerifiedArtifact(candidate, expected, callback));
    sourceCheck(); assert.deepEqual(inventory(installed), installedBefore);
    const row = { name, duration_ms: performance.now() - begin, proof: checked.result.result,
      artifact_verification: checked.result.verification, capture_verification: checked.verification };
    completed.push(row);
    console.log(JSON.stringify({ event: 'family-passed', name, duration_ms: row.duration_ms,
      cases: Array.isArray(row.proof.cases) ? row.proof.cases.length : row.proof.cases }));
  }
  const run = (cwd, args, allowFailure = false) => commands.node(cli, args, cwd, { allowFailure, timeout: 30000 });
  const json = (cwd, args) => JSON.parse(run(cwd, [...args, '--json']).stdout);
  if (selected === 'all' || selected === 'runtime-state') family('actual-runtime-and-selector-transport', () => {
    const root = fixture.resolve('runtime-producer'); fs.mkdirSync(root);
    run(root, ['init', '--graph-only']); json(root, ['db', 'init']); json(root, ['db', 'migrate']);
    const configPath = path.join(root, '.mdkg/config.json'), config = JSON.parse(fs.readFileSync(configPath));
    config.workspaces.root.visibility = 'public'; fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
    const goal = json(root, ['new', 'goal', 'Portable intent without a checkout lease']).node;
    json(root, ['goal', 'select', goal.id]);
    const selection = '.mdkg/state/selected-goal.json';
    assert(fs.existsSync(path.join(root, selection))); assert.equal(json(root, ['goal', 'current']).source, 'selected');
    const marker = 'SYNTHETIC_CHECKOUT_EXECUTION_ONLY', checkpointMarker = 'SYNTHETIC_EXPLICIT_PORTABLE_CHECKPOINT';
    json(root, ['db', 'queue', 'create', 'work']);
    json(root, ['db', 'queue', 'enqueue', 'work', 'active', '--payload-json', JSON.stringify({ value: marker })]);
    const claim = json(root, ['db', 'queue', 'claim', 'work', '--lease-owner', 'synthetic-ephemeral-owner', '--lease-ms', '60000']);
    assert.equal(claim.message.message_id, 'active');
    assert.equal(claim.message.queue_name, 'work');
    assert.equal(claim.message.status, 'leased');
    assert.equal(claim.message.lease_owner, 'synthetic-ephemeral-owner');
    assert(fs.readFileSync(path.join(root, config.db.runtime_path)).includes(Buffer.from(marker)));
    const { readZipEntries } = require(path.join(installed, 'dist/util/zip.js'));
    const bundles = {};
    const create = (profile, name) => {
      const output = path.join(root, name + '.zip');
      json(root, ['bundle', 'create', '--profile', profile, '--output', output]);
      return { output, entries: new Map(readZipEntries(fs.readFileSync(output)).map(row => [row.name, row.data])) };
    };
    const cases = [];
    const reject = (cwd, args, pattern) => {
      const before = inventory(cwd), result = run(cwd, [...args, '--json'], true);
      assert.notEqual(result.status, 0); assert.match(result.stdout + result.stderr, pattern);
      assert.deepEqual(inventory(cwd), before);
    };
    const liveOnly = create('private', 'live-without-checkpoint');
    for (const [file, bytes] of liveOnly.entries) {
      assert(!file.startsWith('.mdkg/state/'), file);
      assert(!file.startsWith('.mdkg/db/runtime/'), file);
      assert(!bytes.includes(Buffer.from(marker)), 'live execution payload exported in ' + file);
    }
    cases.push({ name: 'actual-leased-runtime-and-selected-goal-excluded', pass: true });
    const liveClone = path.join(root, 'live-only-clone');
    json(root, ['graph', 'clone', liveOnly.output, '--target', 'live-only-clone']);
    assert(!fs.existsSync(path.join(liveClone, config.db.runtime_path)));
    assert(!fs.existsSync(path.join(liveClone, selection)));
    reject(liveClone, ['db', 'queue', 'claim', 'work', '--lease-owner', 'synthetic-ephemeral-owner', '--lease-ms', '60000'], /runtime|migrat|initializ|database/i);
    cases.push({ name: 'clone-does-not-restore-runtime-selection-or-queue-authority', pass: true });
    reject(root, ['db', 'snapshot', 'seal'], /ready=0, leased=1/);
    cases.push({ name: 'leased-queue-prevents-unapproved-snapshot', pass: true });
    json(root, ['db', 'queue', 'ack', 'work', 'active', '--lease-owner', 'synthetic-ephemeral-owner']);
    json(root, ['db', 'queue', 'enqueue', 'work', 'portable', '--payload-json', JSON.stringify({ value: checkpointMarker })]);
    json(root, ['db', 'queue', 'pause', 'work', '--reason', 'explicit synthetic portability test']);
    const sealed = json(root, ['db', 'snapshot', 'seal', '--queue-policy', 'paused']);
    assert(fs.readFileSync(path.join(root, config.db.state_path)).includes(Buffer.from(checkpointMarker)));
    const checkpointHash = hash(path.join(root, config.db.state_path));
    cases.push({ name: 'explicit-paused-queue-snapshot-created', pass: true, checkpoint_sha256: checkpointHash });
    for (const profile of ['public', 'private']) {
      const exported = create(profile, 'sealed-' + profile); bundles[profile] = exported;
      assert(!exported.entries.has(selection)); assert(!exported.entries.has(config.db.runtime_path));
      assert.equal(exported.entries.has(config.db.state_path), profile === 'private');
      for (const [file, bytes] of exported.entries) {
        assert(!file.startsWith('.mdkg/state/'), file); assert(!file.startsWith('.mdkg/db/runtime/'), file);
        if (profile === 'public') {
          assert(!bytes.includes(Buffer.from(marker)), file); assert(!bytes.includes(Buffer.from(checkpointMarker)), file);
        }
      }
      if (profile === 'private') assert.deepEqual(exported.entries.get(config.db.state_path), fs.readFileSync(path.join(root, config.db.state_path)));
      else assert(JSON.parse(exported.entries.get('manifest.json')).transport_exclusions.some(row => row.reason === 'private-db-payload'));
      cases.push({ name: profile + '-actual-state-boundaries', pass: true });
    }
    for (const mode of ['clone', 'fork']) {
      const target = path.join(root, 'sealed-' + mode);
      json(root, ['graph', mode, bundles.private.output, '--target', 'sealed-' + mode]);
      assert.equal(hash(path.join(target, config.db.state_path)), checkpointHash);
      assert(!fs.existsSync(path.join(target, config.db.runtime_path)));
      assert(!fs.existsSync(path.join(target, selection)));
      const before = inventory(target);
      const verified = json(target, ['db', 'snapshot', 'verify']);
      assert.equal(verified.ok, true); assert.equal(verified.status, 'valid');
      const current = json(target, ['goal', 'current']);
      assert.notEqual(current.source, 'selected');
      assert.deepEqual(inventory(target), before);
      reject(target, ['db', 'queue', 'claim', 'work', '--lease-owner', 'synthetic-ephemeral-owner', '--lease-ms', '60000'], /runtime|migrat|initializ|database/i);
      cases.push({ name: 'private-' + mode + '-exact-portable-snapshot-without-live-authority', pass: true });
    }
    const observer = fixture.resolve('public-observer'); fs.mkdirSync(observer); run(observer, ['init', '--graph-only']);
    const localInput = path.join(observer, 'public.zip'); fs.copyFileSync(bundles.public.output, localInput);
    json(observer, ['subgraph', 'add', 'sample', 'public.zip', '--profile', 'public']);
    json(observer, ['subgraph', 'materialize', 'sample', '--target', '.mdkg/subgraphs']);
    const view = path.join(observer, '.mdkg/subgraphs/sample');
    for (const p of [selection, config.db.runtime_path, config.db.state_path]) assert(!fs.existsSync(path.join(view, p)), p);
    cases.push({ name: 'public-inspection-tree-restores-no-checkout-state-or-private-checkpoint', pass: true });
    return { cases, runtime: process.version, actual_sqlite_runtime: true,
      actual_queue_claim: { message_id: claim.message.message_id, status: claim.message.status, lease_owner: claim.message.lease_owner },
      selected_goal_file_excluded: true, snapshot_queue_policy: sealed.queue_policy ?? 'paused',
      limitations: ['Structural local transport proof, not remote execution/authentication/attestation.', 'An authored lifecycle goal is project knowledge, not an imported checkout lease.'] };
  });
  if (selected === 'all' || selected === 'admission') family('live-and-ambiguous-recovery-admission', () => {
    const root = fixture.resolve('recovery-admission'); fs.mkdirSync(root);
    const result = JSON.parse(commands.node(recoveryWorker, [cli, root], root, { timeout: 120000 }).stdout);
    assert.equal(result.cases.length, 6); assert(result.cases.every(row => row.pass));
    return result;
  });
  sourceCheck(); verifyArtifactFile(candidate, expected); verifyArtifactFile(capture, captureHash);
  console.log(JSON.stringify({ kind: 'test479-state-admission', started_at: started, setup_ms: setupMs,
    runtime: process.version, platform: process.platform, arch: process.arch, selected_family: selected,
    candidate_sha256: expected, input_capture_sha256: captureHash, source_inputs_sha256: captured.source_inputs.sha256,
    drivers, completed, cleanup: fixture.cleanup(), final_artifact_pass: false }));
} catch (error) {
  console.error(JSON.stringify({ kind: 'test479-state-admission-failure', fixture_retained: fixture.root,
    completed, message: error.stack || error.message }));
  process.exitCode = 1;
}
