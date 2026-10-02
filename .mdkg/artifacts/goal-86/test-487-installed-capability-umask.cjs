// Test-only drivers use the exact installed package's modules, CLI and seeds.
// Adding inert tests to an owned install does not change any original payload byte.
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const repo = path.resolve(__dirname, '../../..');
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const { createOwnedFixture, finalizeFixture } = require(path.join(repo, 'scripts/qualification-fixture'));
const { createSmokeCommands } = require(path.join(repo, 'scripts/qualification-smoke'));
const { copyVerifiedArtifact, withVerifiedArtifact } = require(path.join(repo, 'scripts/qualification-artifact'));
const { admitRetainedCandidate, captureQualificationInputs } = require(path.join(repo, 'scripts/retained-release-candidate'));
const { inventory } = require(path.join(repo, 'tests/fixtures/cache-freshness.cjs'));
const base = path.join(__dirname, 'private/candidate-0.6.0-6154e4ea920bfa09');
const options = { tarball: base + '.tgz', sha256: '6154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca',
  inputs: base + '.package-inputs-dec100.json', inputsSha256: 'bcc8b6e1ec5aac804e20ef2fe6676ecfdfa8ae367f69e35a884b5b5980c8fe90' };
const tests = [['commands/node_runtime_admission.test.js', [2]], ['commands/pack_output_containment.test.js', [6]]];
const helpers = ['helpers/fs.js', 'helpers/config.js', 'helpers/templates.js', 'helpers/identity_recovery.js'];
const admitted = admitRetainedCandidate(repo, options), harness = captureQualificationInputs(repo);
const driverHash = hash(fs.readFileSync(__filename));
const compiledInputs = [...tests.map(([name]) => name), ...helpers].map(name => ({ name,
  source_sha256: hash(fs.readFileSync(path.join(repo, 'tests', name.replace(/\.js$/, '.ts')))),
  sha256: hash(fs.readFileSync(path.join(repo, 'dist/tests', name))) }));
const fixture = createOwnedFixture({ base: '/private/tmp', prefix: 'mdkg-installed-behavior-' });
const commands = createSmokeCommands(fixture, { ...process.env,
  npm_execpath: process.env.MDKG_REAL_NPM || fs.realpathSync('/opt/homebrew/opt/node@24/bin/npm'),
  PATH: path.dirname(process.execPath) + path.delimiter + process.env.PATH });
let failure, installed, originalInventory, instrumentedInventory;
const originalFiles = [], completed = [], started = Date.now();
function verify() {
  admitRetainedCandidate(repo, options, { previous: admitted });
  assert.equal(captureQualificationInputs(repo).sha256, harness.sha256);
  assert.equal(hash(fs.readFileSync(__filename)), driverHash);
  for (const row of compiledInputs) {
    assert.equal(hash(fs.readFileSync(path.join(repo, 'dist/tests', row.name))), row.sha256);
    assert.equal(hash(fs.readFileSync(path.join(repo, 'tests', row.name.replace(/\.js$/, '.ts')))), row.source_sha256);
  }
  for (const row of originalFiles) assert.equal(hash(fs.readFileSync(path.join(installed, row.path))), row.sha256);
  if (instrumentedInventory) assert.equal(inventory(installed), instrumentedInventory);
}
try {
  const tarball = fixture.resolve('candidate.tgz'); copyVerifiedArtifact(options.tarball, tarball, options.sha256);
  const prefix = fixture.resolve('installed'); fs.mkdirSync(prefix);
  withVerifiedArtifact(tarball, options.sha256, () => commands.npm([
    'install', '--offline', '--prefix', prefix, tarball, '--foreground-scripts'], { env: { NPM_CONFIG_OFFLINE: 'true' } }));
  installed = path.join(prefix, 'node_modules/mdkg'); originalInventory = inventory(installed);
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(file);
      else { assert(entry.isFile(), 'unexpected installed entry: ' + file);
        originalFiles.push({ path: path.relative(installed, file), sha256: hash(fs.readFileSync(file)) }); }
    }
  }
  visit(installed); originalFiles.sort((a, b) => a.path.localeCompare(b.path));
  assert.equal(originalFiles.length, admitted.payload_count);
  const copies = path.join(installed, 'dist/tests'), scratch = fixture.resolve('scratch');
  assert(!fs.existsSync(copies), 'installed package unexpectedly contains test drivers'); fs.mkdirSync(scratch);
  for (const row of compiledInputs) {
    const target = path.join(copies, row.name); fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(repo, 'dist/tests', row.name), target, fs.constants.COPYFILE_EXCL);
    assert.equal(hash(fs.readFileSync(target)), row.sha256);
  }
  // Qualification-only metadata for the existing metadata assertion; not shipped payload.
  assert(!fs.existsSync(path.join(installed,'package-lock.json')));
  fs.copyFileSync(path.join(repo,'package-lock.json'),path.join(installed,'package-lock.json'),fs.constants.COPYFILE_EXCL);
  instrumentedInventory = inventory(installed);
  const guard = fixture.resolve('deny-canonical-implementation.cjs');
  fs.writeFileSync(guard, `const M=require('node:module'),original=M._resolveFilename;
M._resolveFilename=function(...args){const r=original.apply(this,args);if(typeof r==='string'&&(${JSON.stringify([path.join(repo,'dist')+path.sep,path.join(repo,'src')+path.sep])}).some(s=>r.startsWith(s)))throw Error('canonical implementation import refused: '+r);return r;};`);
  const env = { ...commands.environment, MDKG_TEST_PACKAGE: installed,
    TMPDIR: scratch, TMP: scratch, TEMP: scratch, NODE_OPTIONS: '--require=' + guard };
  for (const [name, cases] of tests) {
    verify(); const begin = Date.now();
    const result = fixture.runNode(['--test', '--test-reporter=tap', '--test-concurrency=1', path.join(copies, name)], {
      env, timeout: 300000, maxBuffer: 16 * 1024 * 1024 });
    const counts = Object.fromEntries(['tests', 'pass', 'fail', 'cancelled', 'skipped', 'todo'].map(key => {
      const match = result.stdout.match(new RegExp('^# ' + key + ' (\\d+)$', 'm')); return [key, match ? Number(match[1]) : null];
    }));
    completed.push({ family: name, test487_cases: cases, exit_code: result.status, counts,
      duration_ms: Date.now() - begin, stdout_sha256: hash(result.stdout), stderr_sha256: hash(result.stderr),
      cases: result.stdout.split('\n').filter(line => /^(?:not )?ok \d+ /.test(line)),
      ...(result.status === 0 ? {} : { diagnostics: result.stdout + result.stderr }) });
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert(counts.tests > 0); assert.equal(counts.pass, counts.tests); assert.equal(counts.fail, 0); assert.equal(counts.skipped, 0);
    verify(); console.log(JSON.stringify({ event: 'family-passed', family: name, counts, duration_ms: Date.now() - begin }));
  }
} catch (error) { failure = error; }
const receipt = { schema_version: 1, kind: 'test487-installed-capability-umask', owner: 'root:test-487',
  candidate_sha256: options.sha256, input_manifest_sha256: options.inputsSha256,
  package_inputs_sha256: admitted.package_inputs_sha256, harness_inputs_sha256: harness.sha256,
  compiledInputs, driver_sha256: driverHash, node: process.version, platform: process.platform,
  architecture: process.arch, duration_ms: Date.now() - started, completed,
  installed_inventory_sha256: originalInventory, original_payload_files: originalFiles.length,
  original_payload_file_manifest_sha256: hash(JSON.stringify(originalFiles)),
  original_payload_bytes_preserved: true, inert_test_additions: compiledInputs.length, qualification_only_lockfile_sha256: hash(fs.readFileSync(path.join(repo,'package-lock.json'))),
  instrumented_inventory_sha256: instrumentedInventory, canonical_implementation_imports_refused: true,
  limitations: ['This receipt records its actual platform; independent acceptance remains separate',
    'Mixed installed CLI/internal-module regressions with inert test drivers added to an owned install; all original payload bytes pinned',
    'Init/upgrade identity regressions use synthetic closed graphs; untouched packaged seed qualification remains separately evidenced by Test477',
    'Existing umask022/private-mode controls only; no general ACL/owner preservation claim',
    'Bugs46/47 remain deferred/unresolved; no blocked historical context or remote actions'] };
try { const cleanup = finalizeFixture(fixture, { error: failure, verify });
  receipt.cleanup = { removed: cleanup.removed, owned_fixture_only: true }; receipt.pass = true;
} catch (error) { receipt.pass = false; receipt.error = error.message; process.exitCode = 1; }
console.log(JSON.stringify(receipt));
