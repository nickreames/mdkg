// Private qualification infrastructure; never part of the npm runtime payload.
// Transfer explicit inputs only. No canonical graph, Git metadata or credentials.
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const assert = require('node:assert/strict');
const repo = path.resolve(__dirname, '../../..');
const expected = '6154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca';
const capturePath = '.mdkg/artifacts/goal-86/private/candidate-0.6.0-6154e4ea920bfa09.qualification-inputs-bug61.json';
const digest = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
assert.equal(digest(path.join(repo, capturePath)), '29e0f1e2a62cb56160e58f8534ee1d96d6c512ab9bea12ffd50bb16af897496f');
const capture = JSON.parse(fs.readFileSync(path.join(repo, capturePath)));
const [destination] = process.argv.slice(2);
assert(destination && path.isAbsolute(destination));
const parent = fs.realpathSync(path.dirname(destination));
assert(parent.startsWith('/private/tmp/mdkg-linux-'));
assert.equal(destination, path.join(parent, 'capsule'));
assert(!fs.existsSync(destination));
const rows = new Map();
for (const row of capture.source_inputs.files) rows.set(row.path, { ...row, role: 'bound-source-input' });
for (const row of capture.qualification_inputs) rows.set(row.path, { ...row, role: 'bound-qualification-input' });
const extra = [capturePath,
  '.mdkg/artifacts/goal-86/private/candidate-0.6.0-6154e4ea920bfa09.tgz',
  '.mdkg/artifacts/goal-86/test-479-installed-ownership.cjs',
  '.mdkg/artifacts/goal-86/test-479-state-admission.cjs',
  '.mdkg/artifacts/goal-86/node-portability/recovery-admission-worker.cjs',
  '.mdkg/artifacts/goal-86/test-487-linux-runner.cjs',
  'tests/fixtures/transport-state.cjs'];
for (const relative of extra) rows.set(relative, { path: relative, sha256: digest(path.join(repo, relative)), role: 'explicit-fixture-input' });
fs.mkdirSync(destination, { mode: 0o700 });
for (const row of rows.values()) {
  assert(!path.isAbsolute(row.path) && !row.path.split('/').includes('..'));
  const input = path.join(repo, row.path), stat = fs.lstatSync(input);
  assert(stat.isFile() && !stat.isSymbolicLink());
  assert.equal(fs.realpathSync(input), input);
  assert.equal(digest(input), row.sha256, row.path);
  if (row.mode !== undefined) assert.equal(stat.mode & 0o777, row.mode, row.path);
  row.mode = stat.mode & 0o777;
  const output = path.join(destination, row.path);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.copyFileSync(input, output, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(output, row.mode);
  assert.equal(digest(output), row.sha256);
}
const manifest = { kind: 'private-linux-qualification-capsule', candidate_sha256: expected,
  source_revision: '6d23981e70bc68798def73c81b9cd5fa7bc9f3df',
  source_inputs_sha256: capture.source_inputs.sha256,
  files: [...rows.values()].sort((a,b) => a.path.localeCompare(b.path)) };
fs.writeFileSync(path.join(destination, 'capsule-manifest.json'), JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
console.log(JSON.stringify({ destination, files: rows.size, manifest_sha256: digest(path.join(destination, 'capsule-manifest.json')) }));
