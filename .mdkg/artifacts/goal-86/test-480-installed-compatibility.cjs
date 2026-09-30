// Test480 current-candidate consumer proof. Runtime behavior is invoked only
// through the installed CLI; source modules below are qualification fixtures.
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const repo = path.resolve(__dirname, '../../..');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const families = ['cache-freshness', 'changed-warnings'];
if (process.argv[2] === '--worker') {
  const [family, cli, tempRoot] = process.argv.slice(3);
  assert(families.includes(family));
  const result = family === 'cache-freshness'
    ? require(path.join(repo, 'tests/fixtures/cache-freshness.cjs')).qualifyCacheFreshness({ cli, tempRoot })
    : require(path.join(repo, 'tests/fixtures/changed-warnings.cjs')).qualifyChangedWarnings({ cli, tempRoot });
  delete result.owner;
  console.log(JSON.stringify(result));
} else {
  const selected = process.argv[2] || 'all'; assert(selected === 'all' || families.includes(selected));
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
  const fixture = createOwnedFixture({ base: '/private/tmp', prefix: 'mdkg-compatibility-' });
  const commands = createSmokeCommands(fixture, { ...process.env,
    npm_execpath: fs.realpathSync('/opt/homebrew/opt/node@24/bin/npm'),
    PATH: path.dirname(process.execPath) + path.delimiter + process.env.PATH });
  const completed = [], started = Date.now();
  let failure, installedBefore, installed, receipt;
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
    const cli = path.join(installed, 'dist/cli.js');
    assert.equal(JSON.parse(fs.readFileSync(path.join(installed, 'package.json'))).version, '0.6.0');
    installedBefore = inventory(installed);
    for (const family of families.filter(name => selected === 'all' || selected === name)) {
      verify(); const begin = Date.now();
      const result = fixture.runNode([__filename, '--worker', family, cli, fixture.root], {
        env: commands.environment, timeout: 300000, maxBuffer: 16 * 1024 * 1024 });
      assert.equal(result.status, 0, result.stdout + result.stderr);
      const proof = JSON.parse(result.stdout); verify();
      completed.push({ family, duration_ms: Date.now() - begin, proof });
      console.log(JSON.stringify({ event: 'family-passed', family, cases: (proof.cases || proof.rows).length,
        duration_ms: Date.now() - begin }));
    }
    receipt = { schema_version: 1, kind: 'test480-current-installed-compatibility', owner: 'root:test-480',
      node: process.version, platform: process.platform, architecture: process.arch, duration_ms: Date.now() - started,
      candidate_sha256: options.sha256, input_manifest_sha256: options.inputsSha256,
      package_inputs_sha256: admitted.package_inputs_sha256, harness_inputs_sha256: harness.sha256,
      driver_sha256: driverHash, installed_inventory_sha256: installedBefore, completed,
      limitations: ['macOS only; remaining platform rows stay open', 'No canonical graph migration or bundle refresh',
        'These cases do not complete all Test480 obligations or final release acceptance'] };
  } catch (error) { failure = error; console.error(JSON.stringify({ event: 'qualification-failed',
    completed_families: completed.map(row => row.family), error: error.message })); }
  const cleanup = finalizeFixture(fixture, { error: failure, verify });
  receipt.cleanup = { removed: cleanup.removed, owned_fixture_only: true };
  console.log(JSON.stringify(receipt));
}
