// Native macOS qualification fixture only. No product OS-specific helper.
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const repo = path.resolve(__dirname, '../../..');
const { createOwnedFixture, finalizeFixture } = require(path.join(repo, 'scripts/qualification-fixture'));
const { createSmokeCommands } = require(path.join(repo, 'scripts/qualification-smoke'));
const { runFixtureProcess } = require(path.join(repo, 'scripts/qualification-process'));
const { copyVerifiedArtifact, withVerifiedArtifact } = require(path.join(repo, 'scripts/qualification-artifact'));
const { admitRetainedCandidate, captureQualificationInputs } = require(path.join(repo, 'scripts/retained-release-candidate'));
const { inventory } = require(path.join(repo, 'tests/fixtures/cache-freshness.cjs'));
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
assert.equal(process.platform, 'darwin');
const base = path.join(__dirname, 'private/candidate-0.6.0-6154e4ea920bfa09');
const options = { tarball: base + '.tgz', sha256: '6154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca',
  inputs: base + '.package-inputs-dec100.json', inputsSha256: 'bcc8b6e1ec5aac804e20ef2fe6676ecfdfa8ae367f69e35a884b5b5980c8fe90' };
const admitted = admitRetainedCandidate(repo, options), harness = captureQualificationInputs(repo);
const driverHash = hash(fs.readFileSync(__filename));
const fixture = createOwnedFixture({ base: '/private/tmp', prefix: 'mdkg-readonly-volume-' });
const commands = createSmokeCommands(fixture, { ...process.env,
  npm_execpath: fs.realpathSync('/opt/homebrew/opt/node@24/bin/npm'),
  PATH: path.dirname(process.execPath) + path.delimiter + process.env.PATH });
const source = fixture.resolve('source'), mount = fixture.resolve('mount'), image = fixture.resolve('graphs.dmg');
fs.mkdirSync(source); fs.mkdirSync(mount); const originalMount = fs.statSync(mount);
const started = Date.now(), cases = [], diskCommands = []; let failure, installed, installedBefore, imageHash;
const mounted = () => { const stat = fs.statSync(mount); return stat.dev !== originalMount.dev || stat.ino !== originalMount.ino; };
const disk = args => {
  const r = runFixtureProcess(fixture.root, '/usr/bin/hdiutil', args, {
    cwd: fixture.root, env: commands.environment, timeout: 120000, maxBuffer: 1024 * 1024 });
  diskCommands.push({ args, status: r.status, stdout: r.stdout, stderr: r.stderr }); return r;
};
const verify = () => {
  admitRetainedCandidate(repo, options, { previous: admitted });
  assert.equal(captureQualificationInputs(repo).sha256, harness.sha256);
  assert.equal(hash(fs.readFileSync(__filename)), driverHash);
  if (installedBefore) assert.equal(inventory(installed), installedBefore);
  if (imageHash) assert.equal(hash(fs.readFileSync(image)), imageHash);
};
try {
  const tarball = fixture.resolve('candidate.tgz'); copyVerifiedArtifact(options.tarball, tarball, options.sha256);
  const prefix = fixture.resolve('installed'); fs.mkdirSync(prefix);
  withVerifiedArtifact(tarball, options.sha256, () => commands.npm([
    'install', '--offline', '--prefix', prefix, tarball, '--foreground-scripts'], { env: { NPM_CONFIG_OFFLINE: 'true' } }));
  installed = path.join(prefix, 'node_modules/mdkg'); installedBefore = inventory(installed);
  const cli = path.join(installed, 'dist/cli.js');
  const invoke = (root, args, allowFailure = false) => commands.node(cli, args, root, { allowFailure });
  const json = (root, args) => JSON.parse(invoke(root, [...args, '--json']).stdout);
  for (const backend of ['json', 'sqlite']) for (const format of ['legacy', 'v2']) {
    const root = path.join(source, backend + '-' + format); fs.mkdirSync(root);
    invoke(root, ['init', '--graph-only']);
    const file = path.join(root, '.mdkg/config.json'), config = JSON.parse(fs.readFileSync(file));
    config.index.backend = backend; fs.writeFileSync(file, JSON.stringify(config));
    json(root, ['new', 'task', 'Read only observation']);
    json(root, ['db', 'init']); json(root, ['db', 'migrate']); json(root, ['db', 'snapshot', 'seal']);
    if (format === 'v2') {
      const args = ['graph', 'migrate', '--graph-id', crypto.randomUUID(), '--origin', crypto.randomUUID()];
      const plan = json(root, args); assert.deepEqual(plan.blocking, []);
      json(root, [...args, '--apply', '--plan-hash', plan.plan_hash]);
    }
    invoke(root, ['index']);
  }
  const created = disk(['create', '-srcfolder', source, '-format', 'UDRO', '-fs', 'HFS+', '-volname', 'mdkg-readonly-fixture', image]);
  assert.equal(created.status, 0, created.stderr); imageHash = hash(fs.readFileSync(image));
  const attached = disk(['attach', '-readonly', '-noautoopen', '-mountpoint', mount, image]);
  assert.equal(attached.status, 0, attached.stderr); assert(mounted(), 'image was not mounted');
  assert.throws(() => fs.writeFileSync(path.join(mount, 'must-refuse'), 'synthetic'), e => e.code === 'EROFS');
  for (const name of fs.readdirSync(source)) {
    const root = path.join(mount, name), before = inventory(root);
    const observations = [ ['status', '--json'], ['list', '--json'], ['show', 'task-1', '--json'],
      ['search', 'Read only', '--json'], ['next'], ['validate', '--json'],
      ['pack', 'task-1', '--dry-run', '--stats'], ['db', 'verify', '--json'], ['db', 'stats', '--json'],
      ['db', 'snapshot', 'verify', '--json'] ];
    if (name.startsWith('sqlite-')) observations.push(['db', 'index', 'verify', '--json']);
    for (const args of observations) {
      const r = invoke(root, args); assert.equal(r.status, 0);
      if (args.includes('--json')) JSON.parse(r.stdout);
      assert.equal(inventory(root), before); cases.push({ fixture: name, command: args, pass: true, observational: true });
    }
    const refused = invoke(root, ['new', 'task', 'Must refuse readonly write'], true);
    assert.notEqual(refused.status, 0); assert.match(refused.stderr, /read-only|EROFS|permission|EACCES/i);
    assert.equal(inventory(root), before); cases.push({ fixture: name, command: ['new', 'task'], pass: true, refused: true });
  }
  verify();
} catch (error) { failure = error; }
let cleanup;
try {
  if (mounted()) { const detached = disk(['detach', mount]); assert.equal(detached.status, 0, detached.stderr); }
  assert.equal(mounted(), false, 'preserve fixture while mounted');
  cleanup = finalizeFixture(fixture, { error: failure, verify });
} catch (error) { failure = error; }
console.log(JSON.stringify({ schema_version: 1, kind: 'test479-real-readonly-filesystem', pass: !failure,
  owner: 'root:test-479', candidate_sha256: options.sha256, input_manifest_sha256: options.inputsSha256,
  package_inputs_sha256: admitted.package_inputs_sha256, harness_inputs_sha256: harness.sha256,
  driver_sha256: driverHash, platform: process.platform, architecture: process.arch, node: process.version,
  duration_ms: Date.now() - started, filesystem: 'HFS+ read-only UDRO image', cases, diskCommands,
  image_sha256: imageHash, cleanup, error: failure?.message,
  limitations: ['Native macOS disk-image proof only; not Linux/platform acceptance',
    'No native product helper, canonical migration or protected state changes'] }));
if (failure) process.exitCode = 1;
