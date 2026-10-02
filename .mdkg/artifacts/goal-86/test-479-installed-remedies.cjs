// Remaining existing remedy regressions. Tests import installed modules only;
// these are mixed CLI/internal-module proofs, not all public CLI coverage.
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const repo = path.resolve(__dirname, '../../..');
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
if (process.argv[2] === '--transport-worker') {
  const proof = require(path.join(repo, 'tests/fixtures/transport-admission.cjs')).qualifyTransportAdmission({
    cli: process.argv[3], tempRoot: process.argv[4] });
  console.log(JSON.stringify(proof)); process.exitCode = proof.pass ? 0 : 1;
} else {
  const { createOwnedFixture, finalizeFixture } = require(path.join(repo, 'scripts/qualification-fixture'));
  const { createSmokeCommands } = require(path.join(repo, 'scripts/qualification-smoke'));
  const { copyVerifiedArtifact, withVerifiedArtifact } = require(path.join(repo, 'scripts/qualification-artifact'));
  const { admitRetainedCandidate, captureQualificationInputs } = require(path.join(repo, 'scripts/retained-release-candidate'));
  const { inventory } = require(path.join(repo, 'tests/fixtures/cache-freshness.cjs'));
  const base = path.join(__dirname, 'private/candidate-0.6.0-6154e4ea920bfa09');
  const options = { tarball: base + '.tgz', sha256: '6154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca',
    inputs: base + '.package-inputs-dec100.json', inputsSha256: 'bcc8b6e1ec5aac804e20ef2fe6676ecfdfa8ae367f69e35a884b5b5980c8fe90' };
  const admitted = admitRetainedCandidate(repo, options), harness = captureQualificationInputs(repo);
  const driverHash = hash(fs.readFileSync(__filename));
  const fixture = createOwnedFixture({ base: '/private/tmp', prefix: 'mdkg-installed-remedies-' });
  const commands = createSmokeCommands(fixture, { ...process.env,
    npm_execpath: fs.realpathSync('/opt/homebrew/opt/node@24/bin/npm'),
    PATH: path.dirname(process.execPath) + path.delimiter + process.env.PATH });
  const tests = [
    ['commands/upgrade_approval.test.js', 'root:bug-52'],
    ['commands/init_manifest_ownership.test.js', 'root:bug-53'],
    ['commands/numeric_allocation.test.js', 'root:bug-54'],
    ['commands/loop_seed_safety.test.js', 'root:bug-55'],
    ['commands/loop_seed_budget.test.js', 'root:bug-56'],
    ['commands/archive_payload_ownership.test.js', 'root:bug-57'],
    ['commands/mcp_request_admission.test.js', 'root:bug-58'],
    ['commands/skill_git_metadata.test.js', 'root:bug-59'],
    ['core/sqlite_observation.test.js', 'root:bug-60'],
    ['core/sqlite_memory_observation.test.js', 'root:bug-60'],
  ];
  const compiledInputs = [...tests.map(([name]) => name), 'helpers/fs.js', 'helpers/config.js', 'helpers/templates.js']
    .map(name => ({ name, sha256: hash(fs.readFileSync(path.join(repo, 'dist/tests', name))) }));
  const completed = [], started = Date.now(); let failure, installed, installedBefore;
  const verify = () => {
    admitRetainedCandidate(repo, options, { previous: admitted });
    assert.equal(captureQualificationInputs(repo).sha256, harness.sha256);
    assert.equal(hash(fs.readFileSync(__filename)), driverHash);
    for (const row of compiledInputs) assert.equal(hash(fs.readFileSync(path.join(repo, 'dist/tests', row.name))), row.sha256);
    if (installedBefore) assert.equal(inventory(installed), installedBefore);
  };
  try {
    const tarball = fixture.resolve('candidate.tgz'); copyVerifiedArtifact(options.tarball, tarball, options.sha256);
    const prefix = fixture.resolve('installed'); fs.mkdirSync(prefix);
    withVerifiedArtifact(tarball, options.sha256, () => commands.npm([
      'install', '--offline', '--prefix', prefix, tarball, '--foreground-scripts'], { env: { NPM_CONFIG_OFFLINE: 'true' } }));
    installed = path.join(prefix, 'node_modules/mdkg'); installedBefore = inventory(installed);
    const copies = fixture.resolve('tests'), scratch = fixture.resolve('scratch'); fs.mkdirSync(scratch);
    for (const row of compiledInputs) {
      const target = path.join(copies, row.name); fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(path.join(repo, 'dist/tests', row.name), target, fs.constants.COPYFILE_EXCL);
      assert.equal(hash(fs.readFileSync(target)), row.sha256);
    }
    const guard = fixture.resolve('deny-canonical-implementation.cjs');
    fs.writeFileSync(guard, `const M=require('node:module'),p=require('node:path'),original=M._resolveFilename;
M._resolveFilename=function(...args){const r=original.apply(this,args);if(typeof r==='string'&&(${JSON.stringify([path.join(repo,'dist')+path.sep,path.join(repo,'src')+path.sep])}).some(s=>r.startsWith(s)))throw Error('canonical implementation import refused: '+r);return r;};`);
    const env = { ...commands.environment, MDKG_TEST_PACKAGE: installed,
      TMPDIR: scratch, TMP: scratch, TEMP: scratch, NODE_OPTIONS: '--require=' + guard };
    for (const [name, owner] of tests) {
      verify(); const begin = Date.now();
      const result = fixture.runNode(['--test', '--test-reporter=tap', '--test-concurrency=1', path.join(copies, name)], {
        env, timeout: 300000, maxBuffer: 16 * 1024 * 1024 });
      const counts = Object.fromEntries(['tests', 'pass', 'fail', 'cancelled', 'skipped', 'todo'].map(key => {
        const match = result.stdout.match(new RegExp('^# ' + key + ' (\\d+)$', 'm')); return [key, match ? Number(match[1]) : null];
      }));
      completed.push({ family: name, finding_owner: owner, exit_code: result.status, counts,
        duration_ms: Date.now() - begin, stdout_sha256: hash(result.stdout), stderr_sha256: hash(result.stderr),
        cases: result.stdout.split('\n').filter(line => /^(?:not )?ok \d+ /.test(line)),
        ...(result.status === 0 ? {} : { diagnostics: result.stdout + result.stderr }) });
      assert.equal(result.status, 0, result.stdout + result.stderr);
      assert(counts.tests > 0); assert.equal(counts.pass, counts.tests); assert.equal(counts.fail, 0); assert.equal(counts.skipped, 0);
      verify(); console.log(JSON.stringify({ event: 'family-passed', family: name, counts, duration_ms: Date.now() - begin }));
    }
    const begin = Date.now(), result = fixture.runNode([__filename, '--transport-worker', path.join(installed, 'dist/cli.js'), scratch], {
      env, timeout: 300000, maxBuffer: 16 * 1024 * 1024 });
    const proof = JSON.parse(result.stdout); completed.push({ family: 'transport-admission', finding_owner: 'root:bug-45',
      exit_code: result.status, duration_ms: Date.now() - begin, proof });
    assert.equal(result.status, 0, JSON.stringify(proof)); assert.equal(proof.pass, true); verify();
  } catch (error) { failure = error; }
  const receipt = { schema_version: 1, kind: 'test479-current-installed-remaining-remedies', owner: 'root:test-479',
    candidate_sha256: options.sha256, input_manifest_sha256: options.inputsSha256,
    package_inputs_sha256: admitted.package_inputs_sha256, harness_inputs_sha256: harness.sha256,
    compiledInputs, driver_sha256: driverHash, node: process.version, platform: process.platform,
    architecture: process.arch, duration_ms: Date.now() - started, completed, installed_inventory_sha256: installedBefore,
    canonical_implementation_imports_refused: true,
    limitations: ['Native macOS only; other platforms and independent acceptance remain open',
      'Mixed installed CLI and shipped internal-module regressions, not all public CLI tests',
      'Bugs46/47 remain deferred/unresolved; no blocked historical context or remote actions'] };
  try { const cleanup = finalizeFixture(fixture, { error: failure, verify });
    receipt.cleanup = { removed: cleanup.removed, owned_fixture_only: true }; receipt.pass = true;
  } catch (error) { receipt.pass = false; receipt.error = error.message; process.exitCode = 1; }
  console.log(JSON.stringify(receipt));
}
