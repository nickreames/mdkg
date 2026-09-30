// Retained installed consumer boundary; no exported legacy payload execution.
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const repo = path.resolve(__dirname, '../../..');
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const { createOwnedFixture, finalizeFixture } = require(path.join(repo, 'scripts/qualification-fixture'));
const { createSmokeCommands } = require(path.join(repo, 'scripts/qualification-smoke'));
const { copyVerifiedArtifact, withVerifiedArtifact } = require(path.join(repo, 'scripts/qualification-artifact'));
const { admitRetainedCandidate, captureQualificationInputs } = require(path.join(repo, 'scripts/retained-release-candidate'));
const { inventory } = require(path.join(repo, 'tests/fixtures/cache-freshness.cjs'));
const { verifyGenericBoundary } = require(path.join(repo, 'scripts/installed-generic-boundary'));
const base = path.join(__dirname, 'private/candidate-0.6.0-6154e4ea920bfa09');
const options = { tarball: base + '.tgz', sha256: '6154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca',
  inputs: base + '.package-inputs-dec100.json', inputsSha256: 'bcc8b6e1ec5aac804e20ef2fe6676ecfdfa8ae367f69e35a884b5b5980c8fe90' };
const admitted = admitRetainedCandidate(repo, options), harness = captureQualificationInputs(repo);
const driverHash = hash(fs.readFileSync(__filename));
const fixture = createOwnedFixture({ base: '/private/tmp', prefix: 'mdkg-generic-boundary-' });
const commands = createSmokeCommands(fixture, { ...process.env,
  npm_execpath: fs.realpathSync('/opt/homebrew/opt/node@24/bin/npm'),
  PATH: path.dirname(process.execPath) + path.delimiter + process.env.PATH });
const started = Date.now(); let failure, installed, installedBefore, proof;
const removed = [];
const verify = () => {
  admitRetainedCandidate(repo, options, { previous: admitted });
  assert.equal(captureQualificationInputs(repo).sha256, harness.sha256);
  assert.equal(hash(fs.readFileSync(__filename)), driverHash);
  if (installedBefore) assert.equal(inventory(installed), installedBefore);
};
try {
  const tarball = fixture.resolve('candidate.tgz'); copyVerifiedArtifact(options.tarball, tarball, options.sha256);
  const prefix = fixture.resolve('installed'); fs.mkdirSync(prefix);
  withVerifiedArtifact(tarball, options.sha256, () => commands.npm([
    'install', '--offline', '--prefix', prefix, tarball, '--foreground-scripts'], { env: { NPM_CONFIG_OFFLINE: 'true' } }));
  installed = path.join(prefix, 'node_modules/mdkg'); installedBefore = inventory(installed);
  proof = verifyGenericBoundary({ packageRoot: installed, tarballPath: tarball, tempRoot: fixture.root, commands });
  const cli = path.join(installed, 'dist/cli.js'), root = fixture.resolve('retired-git'); fs.mkdirSync(root);
  commands.node(cli, ['init', '--graph-only'], root);
  commands.git(['init', '-b', 'main'], root);
  const marker = fixture.resolve('forbidden-subprocess'), preload = fixture.resolve('refusal-trap.cjs');
  fs.writeFileSync(preload, `const cp=require('node:child_process'),fs=require('node:fs');
for(const key of ['spawn','spawnSync','exec','execSync','execFile','execFileSync','fork'])cp[key]=()=>{fs.writeFileSync(${JSON.stringify(marker)},key);throw Error('forbidden subprocess');};`);
  const before = inventory(root);
  for (const command of ['clone', 'fetch', 'push', 'materialize', 'closeout', 'push-ready']) {
    const result = commands.node(cli, ['git', command], root, { allowFailure: true, nodeArgs: ['--require', preload] });
    assert.equal(result.status, 1); assert.match(result.stdout + result.stderr, /unknown|not supported|unsupported|Usage/i);
    assert.equal(fs.existsSync(marker), false); assert.equal(inventory(root), before);
    removed.push({ command: 'git ' + command, pass: true, writes: false, subprocesses: false });
  }
  const inspect = commands.node(cli, ['git', 'inspect', '--json'], root); JSON.parse(inspect.stdout);
  assert.equal(inventory(root), before); verify();
} catch (error) { failure = error; }
const receipt = { schema_version: 1, kind: 'test484-current-installed-generic-boundary', owner: 'root:test-484',
  candidate_sha256: options.sha256, input_manifest_sha256: options.inputsSha256,
  package_inputs_sha256: admitted.package_inputs_sha256, harness_inputs_sha256: harness.sha256,
  driver_sha256: driverHash, node: process.version, platform: process.platform, architecture: process.arch,
  duration_ms: Date.now() - started, generic: proof, removed_git: removed,
  observational_git_positive: !failure, installed_inventory_sha256: installedBefore,
  limitations: ['Native macOS only; remaining platform and full package-parity gates stay open',
    'Synthetic historical-shaped imported bundle; not recovered public evidence',
    'Structural local contracts do not prove consumer adoption or external execution',
    'No blocked historical scan context, remote Git or publication'] };
try { const cleanup = finalizeFixture(fixture, { error: failure, verify });
  receipt.cleanup = { removed: cleanup.removed, owned_fixture_only: true }; receipt.pass = true;
} catch (error) { receipt.pass = false; receipt.error = error.message; process.exitCode = 1; }
console.log(JSON.stringify(receipt));
