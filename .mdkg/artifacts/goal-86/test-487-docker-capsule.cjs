// Repository-owned qualification adapter, not an mdkg runtime feature.
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const repo = path.resolve(__dirname, '../../..');
const { admitRetainedCandidate, capturePackageInputs, captureQualificationInputs, builtPayload } = require(path.join(repo, 'scripts/retained-release-candidate'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const base = '.mdkg/artifacts/goal-86/private/candidate-0.6.0-6154e4ea920bfa09';
const options = { tarball: path.join(repo, base + '.tgz'), sha256: '6154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca',
  inputs: path.join(repo, base + '.package-inputs-dec100.json'), inputsSha256: 'bcc8b6e1ec5aac804e20ef2fe6676ecfdfa8ae367f69e35a884b5b5980c8fe90' };
const destination = process.argv[2];
assert(destination && /^\/private\/tmp\/mdkg-docker-g86-[A-Za-z0-9]+\/capsule$/.test(destination));
assert.equal(fs.realpathSync(path.dirname(destination)), path.dirname(destination));
assert(!fs.existsSync(destination));
admitRetainedCandidate(repo, options);
const pkg = capturePackageInputs(repo), harness = captureQualificationInputs(repo), files = new Map(), derivatives = [];
fs.mkdirSync(destination, { mode: 0o755 });
function put(relative, bytes, mode, provenance) {
  assert(!path.isAbsolute(relative) && !relative.split('/').includes('..'));
  const file = path.join(destination, relative); fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, bytes, { flag: 'wx', mode }); fs.chmodSync(file, mode);
  files.set(relative, { path: relative, sha256: hash(bytes), mode, ...provenance });
}
function copy(relative, expected) {
  if(files.has(relative)) return;
  const file = path.join(repo, relative), stat = fs.lstatSync(file), bytes = fs.readFileSync(file);
  assert(stat.isFile() && stat.nlink === 1 && fs.realpathSync(file) === file, relative);
  if(expected) assert.equal(hash(bytes), expected, relative);
  put(relative, bytes, stat.mode & 0o777, { role: 'unchanged-current-input' });
}
for(const row of [...pkg.files, ...harness.files]) copy(row.path, row.sha256);
for(const row of builtPayload(repo)) copy(row.path, row.sha256);
// Compiled drivers are inert additions, not substitutes for installed product modules.
function compiled(relative) {
  for(const entry of fs.readdirSync(path.join(repo, relative), { withFileTypes: true })) {
    const next = relative + '/' + entry.name;
    if(entry.isDirectory()) compiled(next); else { assert(entry.isFile()); copy(next); }
  }
}
compiled('dist/tests');
for(const suffix of ['.tgz', '.package-inputs-dec100.json', '.inputs.json', '.qualification-inputs-bug61.json']) copy(base + suffix);
for(const name of ['test-487-docker-runner.cjs', 'test-487-docker-readonly.cjs', 'test-478-installed-worker.cjs',
  'node-portability/recovery-admission-worker.cjs']) copy('.mdkg/artifacts/goal-86/' + name);
const oldDrivers = ['test-477-installed-bootstrap.cjs', 'test-478-installed-collaboration.cjs',
  'test-478-indirection-qualification.cjs', 'test-479-installed-ownership.cjs', 'test-479-state-admission.cjs',
  'test-479-installed-containment.cjs', 'test-479-installed-remedies.cjs', 'test-480-installed-compatibility.cjs',
  'test-480-installed-work-smokes.cjs', 'test-480-old-client-runtime.cjs', 'test-481-installed-scale.cjs',
  'test-483-installed-behavior.cjs', 'test-483-installed-pack-controls.cjs', 'test-484-installed-generic.cjs', 'test-486-linux-options.cjs', 'test-487-installed-capability-umask.cjs'];
for(const name of oldDrivers) {
  const sourceName=name==='test-486-linux-options.cjs'?'test-480-installed-work-smokes.cjs':name==='test-487-installed-capability-umask.cjs'?'test-483-installed-behavior.cjs':name;
  const relative = '.mdkg/artifacts/goal-86/' + name, original = fs.readFileSync(path.join(__dirname, sourceName), 'utf8');
  let text = original; const changes = [];
  function replace(before, after, required = false) {
    const count = text.split(before).length - 1;
    if(required) assert.equal(count, 1, name + ': adapter anchor ' + before);
    if(count) { text = text.split(before).join(after); changes.push({ before, after, count }); }
  }
  replace("fs.realpathSync('/opt/homebrew/opt/node@24/bin/npm')", 'process.env.MDKG_REAL_NPM');
  replace("'.qualification-inputs-bug61.json'", "'.linux-inputs.json'");
  replace("'.inputs.json'", name.startsWith('test-477') ? "'.linux-bootstrap-inputs.json'" : "'.linux-inputs.json'");
  replace('candidate-source-input-capture-not-release-seal', 'linux-bootstrap-input-capture-not-release-seal');
  replace('Native macOS only', 'This Linux execution only'); replace('macOS only', 'This Linux execution only');
  replace('Linux rows remain open.', 'Other platform rows remain separately accounted.');
  replace('This is one explicit topology on macOS arm64; not recursive nested-submodule or cross-platform clearance.', 'This is one explicit topology on the recorded Linux architecture; not recursive nested-submodule or cross-platform clearance.');
  if(name==='test-487-installed-capability-umask.cjs') {
    const begin=text.indexOf('const tests = ['),end=text.indexOf('\nconst helpers =',begin);
    assert(begin>0&&end>begin);const removed=text.slice(begin,end);
    const replacement="const tests = [['commands/node_runtime_admission.test.js', [2]], ['commands/pack_output_containment.test.js', [6]]];";
    text=text.slice(0,begin)+replacement+text.slice(end);changes.push({purpose:'Focused installed runtime capability and umask cases only; assertions unchanged',removed_sha256:hash(removed),replacement});
    replace('  instrumentedInventory = inventory(installed);', "  // Qualification-only metadata for the existing metadata assertion; not shipped payload.\n  assert(!fs.existsSync(path.join(installed,'package-lock.json')));\n  fs.copyFileSync(path.join(repo,'package-lock.json'),path.join(installed,'package-lock.json'),fs.constants.COPYFILE_EXCL);\n  instrumentedInventory = inventory(installed);",true);
    replace("kind: 'test483-current-installed-behavior', owner: 'root:test-483'", "kind: 'test487-installed-capability-umask', owner: 'root:test-487'",true);
    replace('test483_cases: cases', 'test487_cases: cases',true);
    replace('inert_test_additions: compiledInputs.length,', "inert_test_additions: compiledInputs.length, qualification_only_lockfile_sha256: hash(fs.readFileSync(path.join(repo,'package-lock.json'))),",true);
    replace('Historical website cache case5 is deferred to Epic258 by Dec100, not counted as a pass', 'Existing umask022/private-mode controls only; no general ACL/owner preservation claim');
  }
  if(name==='test-486-linux-options.cjs') {
    replace("['smoke-archive-work.js','smoke-work-invocation.js','smoke-graph-clone.js']", "['smoke-command-matrix.js']", true);
    replace('assert.equal(deliveries.length,3);assert.equal(consumptions.length,3);', 'assert.equal(deliveries.length,1);assert.equal(consumptions.length,1);', true);
    replace("kind:'test480-current-installed-work-archive-fork',owner:'root:test-480'", "kind:'test486-current-installed-option-admission',owner:'root:test-486'", true);
    replace('Three existing smokes only, not the complete37-smoke release ladder.', 'Existing command-matrix smoke, not the complete37-smoke release ladder.');
  }
  if(name === 'test-480-old-client-runtime.cjs') {
    const begin = text.indexOf("  const runtimeName='node-v24.15.0-darwin-arm64'"), end = text.indexOf('  for(const runtime of runtimes){', begin);
    assert(begin > 0 && end > begin);
    const removed = text.slice(begin, end);
    const replacement = "  const runtimes=['24.15.0','26.0.0'].map(v=>'/opt/node-v'+v+'-linux-'+process.arch+'/bin/node');\n" +
      "  downloads.push(...JSON.parse(fs.readFileSync('/capsule/runtime-downloads.json')).filter(r=>r.arch===process.arch));\n";
    text = text.slice(0, begin) + replacement + text.slice(end);
    changes.push({ purpose: 'offline real Linux runtime paths; refusal assertions unchanged', removed_sha256: hash(removed), replacement });
  }
  if(name==='test-481-installed-scale.cjs') {
    replace('nodeCount: 2000, commandTimeoutMs: 600000', "nodeCount: 2000, commandTimeoutMs: process.env.MDKG_SCALE_EMULATED_RETRY==='sqlite' ? 900000 : 600000, scaleBackends: process.env.MDKG_SCALE_EMULATED_RETRY==='sqlite' ? ['sqlite'] : ['json','sqlite']",true);
    replace('qualification_allowance_ms: 600000, product_sla: false', "qualification_allowance_ms: process.env.MDKG_SCALE_EMULATED_RETRY==='sqlite' ? 900000 : 600000, scale_backends: process.env.MDKG_SCALE_EMULATED_RETRY==='sqlite' ? ['sqlite'] : ['json','sqlite'], product_sla: false",true);
    replace('timeout: 1800000, maxBuffer:', 'timeout: 2400000, maxBuffer:',true);
    replace("const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');", "const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');\nif(process.env.MDKG_SCALE_EMULATED_RETRY){assert.equal(process.env.MDKG_SCALE_EMULATED_RETRY,'sqlite');assert.equal(process.platform,'linux');assert.equal(process.arch,'x64');}",true);
  }
  put(relative, text, 0o644, { role: 'portable-fixture-derivative', original_sha256: hash(original) });
  derivatives.push({ path: relative, source: sourceName, original_sha256: hash(original), derivative_sha256: hash(text), changes });
}
const capture = { schema_version: 1, kind: 'linux-current-input-capture-not-release-seal', sha256: options.sha256,
  original_capture_sha256: hash(fs.readFileSync(path.join(repo, base + '.inputs.json'))),
  package_input_manifest_sha256: options.inputsSha256, source_inputs: pkg, qualification_inputs: harness.files };
put(base + '.linux-inputs.json', JSON.stringify(capture, null, 2) + '\n', 0o644, { role: 'current-linux-input-capture' });
// Match Test477's ordered snapshot exactly while preserving the original capture.
const ordered = [];
function visit(relative) {
  const file = path.join(destination, relative), stat = fs.lstatSync(file);
  if(stat.isDirectory()) for(const child of fs.readdirSync(file).sort()) visit(path.join(relative, child));
  else ordered.push({ path: relative, sha256: hash(fs.readFileSync(file)), mode: stat.mode & 0o777 });
}
for(const name of ['src','assets/init','scripts','package.json','package-lock.json','tsconfig.json','tsconfig.build.json','README.md','CLI_COMMAND_MATRIX.md','CHANGELOG.md','CONTRIBUTING.md','LICENSE']) visit(name);
put(base + '.linux-bootstrap-inputs.json', JSON.stringify({ ...capture, kind: 'linux-bootstrap-input-capture-not-release-seal',
  source_inputs: { sha256: hash(JSON.stringify(ordered)), files: ordered } }, null, 2) + '\n', 0o644, { role: 'current-linux-bootstrap-capture' });
admitRetainedCandidate(repo, options);
assert.equal(captureQualificationInputs(repo).sha256, harness.sha256);
const manifest = { schema_version: 1, kind: 'goal86-linux-installed-capsule',
  source_revision: execFileSync('git', ['rev-parse','HEAD'], { cwd: repo, encoding: 'utf8', env: {...process.env,GIT_OPTIONAL_LOCKS:'0'} }).trim(),
  candidate_sha256: options.sha256, package_inputs_sha256: pkg.sha256, harness_inputs_sha256: harness.sha256,
  files: [...files.values()].sort((a,b)=>a.path.localeCompare(b.path)), derivatives,
  exclusions: ['canonical work graph, events, selection, runtime databases, Git metadata, credentials, security reports, consumer payloads'] };
fs.writeFileSync(path.join(destination, 'capsule-manifest.json'), JSON.stringify(manifest, null, 2) + '\n', {flag:'wx',mode:0o644});
console.log(JSON.stringify({ destination, files: files.size, manifest_sha256: hash(fs.readFileSync(path.join(destination,'capsule-manifest.json'))), package_inputs_sha256: pkg.sha256, harness_inputs_sha256: harness.sha256 }));
