// Existing per-finding regressions against retained installed bytes only.
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const repo = path.resolve(__dirname, '../../..');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const families = {
  'bundle-provenance': ['qualifyBundleProvenance', 'root:bug-44'],
  'source-read-admission': ['qualifySourceReadAdmission', 'root:bug-48'],
  'skill-registry-admission': ['qualifySkillRegistryAdmission', 'root:bug-49'],
  'snapshot-verification': ['qualifySnapshotVerification', 'root:bug-50'],
  'snapshot-containment': ['qualifySnapshotContainment', 'root:bug-51'],
};
async function main() {
  if (process.argv[2] === '--worker') {
    const [family, cli, tempRoot] = process.argv.slice(3); assert(families[family]);
    const proof = await require(path.join(repo, 'tests/fixtures', family + '.cjs'))[families[family][0]]({ cli, tempRoot });
    console.log(JSON.stringify(proof)); process.exitCode = proof.pass ? 0 : 1; return;
  }
  const selected = process.argv[2] || 'all'; assert(selected === 'all' || families[selected]);
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
  const fixture = createOwnedFixture({ base: '/private/tmp', prefix: 'mdkg-containment-' });
  const commands = createSmokeCommands(fixture, { ...process.env,
    npm_execpath: fs.realpathSync('/opt/homebrew/opt/node@24/bin/npm'),
    PATH: path.dirname(process.execPath) + path.delimiter + process.env.PATH });
  const completed = [], started = Date.now(); let failure, installedBefore, installed;
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
    assert.equal(JSON.parse(fs.readFileSync(path.join(installed, 'package.json'))).version, '0.6.0');
    installedBefore = inventory(installed);
    for (const family of Object.keys(families).filter(name => selected === 'all' || selected === name)) {
      verify(); const begin = Date.now();
      const result = fixture.runNode([__filename, '--worker', family, path.join(installed, 'dist/cli.js'), fixture.root], {
        env: commands.environment, timeout: 300000, maxBuffer: 16 * 1024 * 1024 });
      const proof = JSON.parse(result.stdout); verify();
      completed.push({ family, finding_owner: families[family][1], exit_code: result.status,
        duration_ms: Date.now() - begin, proof });
      assert.equal(result.status, 0, JSON.stringify(proof) + result.stderr);
      assert.equal(proof.pass, true);
      console.log(JSON.stringify({ event: 'family-passed', family, cases: proof.cases.length,
        duration_ms: Date.now() - begin }));
    }
  } catch (error) { failure = error; }
  const receipt = { schema_version: 1, kind: 'test479-current-installed-containment', owner: 'root:test-479',
    context_qids: ['root:test-488', 'root:goal-86'], node: process.version, platform: process.platform,
    architecture: process.arch, duration_ms: Date.now() - started, candidate_sha256: options.sha256,
    input_manifest_sha256: options.inputsSha256, package_inputs_sha256: admitted.package_inputs_sha256,
    harness_inputs_sha256: harness.sha256, driver_sha256: driverHash, installed_inventory_sha256: installedBefore,
    completed, limitations: ['Native macOS only; remaining platforms and real read-only filesystem stay open',
      'Five existing finding families only; not complete fourteen-finding acceptance or independent review',
      'CLI and MCP consumers; installed ZIP codec used only for synthetic fixture construction/inspection',
      'Bugs46/47 remain deferred and unresolved; no blocked historical scan context accessed'] };
  try { const cleanup = finalizeFixture(fixture, { error: failure, verify });
    receipt.cleanup = { removed: cleanup.removed, owned_fixture_only: true }; receipt.pass = true;
  } catch (error) { receipt.pass = false; receipt.error = error.message; process.exitCode = 1; }
  console.log(JSON.stringify(receipt));
}
main().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
