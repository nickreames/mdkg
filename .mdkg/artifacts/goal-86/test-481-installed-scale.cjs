// Existing representative scale/lifecycle scenarios, on the retained artifact.
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const repo = path.resolve(__dirname, '../../..');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
if (process.argv[2] === '--worker') {
  const [bin, tempBase] = process.argv.slice(3);
  const proof = require(path.join(repo, 'scripts/installed-scale-goal')).runInstalledScaleGoal({
    bin, tempBase, nodeCount: 2000, commandTimeoutMs: 600000 });
  console.log(JSON.stringify(proof));
} else {
  const { createOwnedFixture, finalizeFixture } = require(path.join(repo, 'scripts/qualification-fixture'));
  const { createSmokeCommands } = require(path.join(repo, 'scripts/qualification-smoke'));
  const { copyVerifiedArtifact, withVerifiedArtifact } = require(path.join(repo, 'scripts/qualification-artifact'));
  const { admitRetainedCandidate, captureQualificationInputs } = require(path.join(repo, 'scripts/retained-release-candidate'));
  const { inventory } = require(path.join(repo, 'tests/fixtures/cache-freshness.cjs'));
  const base = path.join(__dirname, 'private/candidate-0.6.0-6154e4ea920bfa09');
  const options = { tarball: base + '.tgz', sha256: '6154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca',
    inputs: base + '.package-inputs-dec100.json', inputsSha256: 'bcc8b6e1ec5aac804e20ef2fe6676ecfdfa8ae367f69e35a884b5b5980c8fe90' };
  const admitted = admitRetainedCandidate(repo, options), driverHash = hash(fs.readFileSync(__filename));
  const harness = captureQualificationInputs(repo);
  const fixture = createOwnedFixture({ base: '/private/tmp', prefix: 'mdkg-scale-goal-' });
  const commands = createSmokeCommands(fixture, { ...process.env,
    npm_execpath: fs.realpathSync('/opt/homebrew/opt/node@24/bin/npm'),
    PATH: path.dirname(process.execPath) + path.delimiter + process.env.PATH });
  const started = Date.now(); let failure, installedBefore, installed, receipt;
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
    installed = path.join(prefix, 'node_modules/mdkg');
    installedBefore = inventory(installed); verify();
    console.log(JSON.stringify({ event: 'scale-started', nodes: 2000, node: process.version,
      candidate_sha256: options.sha256, qualification_allowance_ms: 600000, product_sla: false }));
    const result = fixture.runNode([__filename, '--worker', path.join(installed, 'dist/cli.js'), fixture.root], {
      env: commands.environment, timeout: 1800000, maxBuffer: 16 * 1024 * 1024 });
    assert.equal(result.status, 0, result.stdout + result.stderr); verify();
    receipt = { schema_version: 1, kind: 'test481-current-installed-scale-and-routing', owner: 'root:test-481',
      node: process.version, platform: process.platform, architecture: process.arch, duration_ms: Date.now() - started,
      candidate_sha256: options.sha256, input_manifest_sha256: options.inputsSha256,
      package_inputs_sha256: admitted.package_inputs_sha256, harness_inputs_sha256: harness.sha256,
      driver_sha256: driverHash, installed_inventory_sha256: installedBefore, proof: JSON.parse(result.stdout),
      limitations: ['macOS only; remaining platform rows stay open', 'No canonical graph migration or publication',
        'Qualification allowance is not a new product performance target'] };
  } catch (error) { failure = error; console.error(JSON.stringify({ event: 'qualification-failed', error: error.message })); }
  const cleanup = finalizeFixture(fixture, { error: failure, verify });
  receipt.cleanup = { removed: cleanup.removed, owned_fixture_only: true };
  console.log(JSON.stringify(receipt));
}
