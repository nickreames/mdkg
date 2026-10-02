// Private Test479 qualification: exact retained package, no production source imports.
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const repo = path.resolve(__dirname, '../../..');
const { createOwnedFixture } = require(path.join(repo, 'scripts/qualification-fixture'));
const { createSmokeCommands } = require(path.join(repo, 'scripts/qualification-smoke'));
const { verifyArtifactFile, copyVerifiedArtifact, withVerifiedArtifact } = require(path.join(repo, 'scripts/qualification-artifact'));
const { runTransportStateFixtures } = require(path.join(repo, 'tests/fixtures/transport-state.cjs'));
const { exerciseInstalledGraphRecovery } = require(path.join(repo, 'scripts/installed-graph-recovery'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const expected = process.env.MDKG_EXPECTED_CANDIDATE_SHA256;
assert.match(expected || '', /^[a-f0-9]{64}$/); assert(process.env.MDKG_REAL_NPM);
const selected = process.env.MDKG_TEST479_FAMILY || 'all';
assert(['all', 'transport', 'recovery'].includes(selected), 'unknown qualification family');
const candidate = path.join(__dirname, 'private', `candidate-0.6.0-${expected.slice(0, 16)}.tgz`);
const capture = candidate.replace(/\.tgz$/, '.qualification-inputs-bug61.json');
const captureHash = hash(capture), captured = JSON.parse(fs.readFileSync(capture));
assert.equal(captured.sha256, expected);
const drivers = [__filename, path.join(repo, 'tests/fixtures/transport-state.cjs'),
  path.join(repo, 'scripts/installed-graph-recovery.js')].map(file => ({ file, sha256: hash(file) }));
function sourceCheck() {
  for (const row of captured.source_inputs.files) {
    const file = path.join(repo, row.path); assert.equal(hash(file), row.sha256, row.path);
    assert.equal(fs.lstatSync(file).mode & 0o777, row.mode, row.path);
  }
  for (const row of captured.qualification_inputs || []) assert.equal(hash(path.join(repo, row.path)), row.sha256);
  for (const row of drivers) assert.equal(hash(row.file), row.sha256, row.file);
}
sourceCheck(); verifyArtifactFile(candidate, expected); verifyArtifactFile(capture, captureHash);
const fixture = createOwnedFixture({ base: '/private/tmp', prefix: 'mdkg-ownership-' });
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
  if (selected === 'all' || selected === 'transport') family('portable-state-and-malformed-transport', () =>
    runTransportStateFixtures({ packageRoot: installed, root: fixture.resolve('transport'), commands }));
  if (selected === 'all' || selected === 'recovery') family('sampled-migration-and-reconciliation-recovery', () =>
    exerciseInstalledGraphRecovery(cli, fixture.root, commands.environment));
  sourceCheck(); verifyArtifactFile(candidate, expected); verifyArtifactFile(capture, captureHash);
  console.log(JSON.stringify({ kind: 'test479-local-installed-ownership', started_at: started, setup_ms: setupMs,
    runtime: process.version, platform: process.platform, arch: process.arch, selected_family: selected,
    candidate_sha256: expected, input_capture_sha256: captureHash, source_inputs_sha256: captured.source_inputs.sha256,
    drivers, completed, cleanup: fixture.cleanup(), final_artifact_pass: false }));
} catch (error) {
  console.error(JSON.stringify({ kind: 'test479-local-installed-ownership-failure', fixture_retained: fixture.root,
    completed, message: error.stack || error.message }));
  process.exitCode = 1;
}
