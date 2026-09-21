// Synthetic snapshot validity cases, reusable against exact installed bytes.
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const assert = require('node:assert/strict'), { spawnSync } = require('node:child_process');

function qualifySnapshotVerification({ cli, tempRoot, node = process.execPath }) {
  const owned = fs.mkdtempSync(path.join(tempRoot, 'snapshot-validity-'));
  const env = { PATH: process.env.PATH, TMPDIR: owned, LC_ALL: 'C', GIT_CONFIG_NOSYSTEM: '1',
    GIT_CONFIG_GLOBAL: '/dev/null', GIT_TERMINAL_PROMPT: '0' };
  const run = (root, args) => spawnSync(node, [cli, ...args], { cwd: root, env, encoding: 'utf8', timeout: 4000, killSignal: 'SIGKILL', maxBuffer: 2 * 1024 * 1024 });
  const ok = r => { assert.equal(r.error, undefined); assert.equal(r.signal, null); assert.equal(r.status, 0, r.stdout + r.stderr); return r; };
  const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
  function inventory(root) {
    const result = [];
    const walk = dir => { for (const name of fs.readdirSync(dir).sort()) {
      const p = path.join(dir, name), s = fs.lstatSync(p), rel = path.relative(root, p);
      if (s.isDirectory()) { result.push([rel, 'dir', s.mode]); walk(p); }
      else if (s.isSymbolicLink()) result.push([rel, 'link', fs.readlinkSync(p)]);
      else if (s.isFile()) result.push([rel, 'file', s.mode, hash(fs.readFileSync(p))]);
      else result.push([rel, 'special', s.mode]);
    }}; walk(root); return result;
  }
  const cases = [], base = path.join(owned, 'base');
  const check = (name, fn) => { try { fn(); cases.push({ name, pass: true }); }
    catch (error) { cases.push({ name, pass: false, error: error.message }); } };
  let number = 0;
  function setup() {
    const root = path.join(owned, String(++number)); fs.cpSync(base, root, { recursive: true });
    return { root, snapshot: path.join(root, '.mdkg/db/state/project.sqlite'),
      manifest: path.join(root, '.mdkg/db/state/project.manifest.json'),
      runtime: path.join(root, '.mdkg/db/runtime/project.sqlite') };
  }
  const editManifest = (f, edit) => { const m = JSON.parse(fs.readFileSync(f.manifest)); edit(m); fs.writeFileSync(f.manifest, JSON.stringify(m)); };
  const asDirectory = p => { fs.unlinkSync(p); fs.mkdirSync(p); fs.writeFileSync(path.join(p, 'preserve.txt'), 'SYNTHETIC USER CONTENT\n'); };
  const asFifo = p => { fs.unlinkSync(p); const r = spawnSync('mkfifo', [p], { env, encoding: 'utf8', timeout: 3000 }); assert.equal(r.status, 0, r.stderr); };
  function inspect(f, status) {
    const before = inventory(f.root);
    const verify = run(f.root, ['db', 'snapshot', 'verify', '--json']);
    assert.equal(verify.error, undefined, String(verify.error)); assert.equal(verify.signal, null);
    const payload = JSON.parse(verify.stdout);
    const valid = status === 'valid' || status === 'stale';
    assert.equal(payload.ok, valid); assert.equal(payload.status, status);
    assert.equal(verify.status === 0, valid, verify.stdout + verify.stderr);
    if (valid) {
      for (const name of ['snapshot-file', 'manifest-file', 'manifest-shape', 'sqlite-integrity', 'snapshot-hash', 'snapshot-size', 'table-counts', 'migrations', 'queue-policy']) {
        assert.equal(payload.checks.filter(c => c.name === name && c.ok).length, 1, 'missing successful mandatory check: ' + name);
      }
      assert.equal(payload.failure_count, 0);
    } else {
      assert(payload.failure_count > 0); assert(payload.errors.length > 0);
      for (const c of payload.checks.filter(c => !c.ok)) assert(c.errors.length > 0, c.name + ' has no diagnostic');
    }
    const observed = JSON.parse(ok(run(f.root, ['db', 'snapshot', 'status', '--json'])).stdout);
    const { action: _, ...v } = payload, { action: __, ...s } = observed; assert.deepEqual(s, v);
    const text = run(f.root, ['db', 'snapshot', 'verify']); assert.equal(text.error, undefined);
    assert.equal(text.status === 0, valid); assert.equal(/db snapshot verify ok/.test(text.stdout), valid);
    assert.match(ok(run(f.root, ['db', 'snapshot', 'status'])).stdout, new RegExp('db snapshot status: ' + status));
    assert.deepEqual(inventory(f.root), before, 'observation changed snapshot/runtime/Git index or authored state');
  }
  try {
    fs.mkdirSync(base);
    ok(run(base, ['init', '--graph-only'])); ok(run(base, ['db', 'init', '--json']));
    ok(run(base, ['db', 'migrate', '--json'])); ok(run(base, ['db', 'snapshot', 'seal', '--json']));
    const git = args => { const r = spawnSync('git', args, { cwd: base, env, encoding: 'utf8', timeout: 4000 }); assert.equal(r.status, 0, r.stderr); };
    git(['-c', 'init.templateDir=', 'init', '-q']); fs.writeFileSync(path.join(base, 'authored.txt'), 'Preserve staged bytes\n'); git(['add', '--', 'authored.txt']);
    check('valid drained snapshot executes every mandatory check without effects', () => inspect(setup(), 'valid'));
    for (const paths of [['snapshot'], ['manifest'], ['snapshot', 'manifest']]) {
      check(`nonempty directories at ${paths.join('+')} are invalid`, () => { const f = setup(); paths.forEach(p => asDirectory(f[p])); inspect(f, 'invalid'); });
      check(`missing ${paths.join('+')} reports missing`, () => { const f = setup(); paths.forEach(p => fs.unlinkSync(f[p])); inspect(f, 'missing'); });
    }
    for (const key of ['snapshot', 'manifest']) {
      check(`${key} FIFO refuses without blocking`, () => { const f = setup(); asFifo(f[key]); inspect(f, 'invalid'); });
      check(`${key} device target refuses`, () => { const f = setup(); fs.unlinkSync(f[key]); fs.symlinkSync('/dev/null', f[key]); inspect(f, 'invalid'); });
      check(`${key} linked directory is invalid`, () => { const f = setup(); fs.unlinkSync(f[key]); fs.symlinkSync(path.dirname(f[key]), f[key]); inspect(f, 'invalid'); });
    }
    check('malformed manifest is invalid', () => { const f = setup(); fs.writeFileSync(f.manifest, '{'); inspect(f, 'invalid'); });
    check('unsupported manifest shape is invalid', () => { const f = setup(); fs.writeFileSync(f.manifest, '[]'); inspect(f, 'invalid'); });
    check('corrupt SQLite snapshot is invalid', () => { const f = setup(); fs.writeFileSync(f.snapshot, 'SYNTHETIC NON DATABASE\n'); inspect(f, 'invalid'); });
    for (const [field, value] of [['snapshot_sha256', 'sha256:wrong'], ['byte_size', -1], ['table_counts', []], ['migrations', []], ['queue_summary', {}]]) {
      check(`mismatched ${field} is invalid`, () => { const f = setup(); editManifest(f, m => m[field] = value); inspect(f, 'invalid'); });
    }
    check('absent runtime retains valid portable snapshot', () => { const f = setup(); fs.unlinkSync(f.runtime); inspect(f, 'valid'); });
    check('missing source hash with runtime present reports missing', () => { const f = setup(); editManifest(f, m => m.source_runtime_sha256 = null); inspect(f, 'missing'); });
    check('configured snapshot path uses its derived manifest and rejects directories', () => {
      const f = setup(), configPath = path.join(f.root, '.mdkg/config.json'), config = JSON.parse(fs.readFileSync(configPath));
      config.db.state_path = '.mdkg/db/state/custom.sqlite'; fs.writeFileSync(configPath, JSON.stringify(config));
      fs.renameSync(f.snapshot, path.join(f.root, config.db.state_path));
      fs.renameSync(f.manifest, path.join(f.root, '.mdkg/db/state/custom.manifest.json'));
      f.snapshot = path.join(f.root, config.db.state_path); f.manifest = path.join(f.root, '.mdkg/db/state/custom.manifest.json');
      inspect(f, 'valid'); asDirectory(f.manifest); inspect(f, 'invalid');
    });
    check('changed runtime is stale but still structurally valid', () => { const f = setup(); ok(run(f.root, ['db', 'queue', 'create', 'synthetic', '--json'])); inspect(f, 'stale'); });
    check('paused ready queue snapshot is valid under its declared policy', () => {
      const f = setup(); ok(run(f.root, ['db', 'queue', 'create', 'synthetic', '--json']));
      ok(run(f.root, ['db', 'queue', 'enqueue', 'synthetic', 'one', '--payload-json', '{"synthetic":true}', '--json']));
      ok(run(f.root, ['db', 'queue', 'pause', 'synthetic', '--reason', 'fixture', '--json']));
      ok(run(f.root, ['db', 'snapshot', 'seal', '--queue-policy', 'paused', '--json'])); inspect(f, 'valid');
      editManifest(f, m => m.queue_policy = 'drain'); inspect(f, 'invalid');
    });
    return { pass: cases.every(c => c.pass), cases, fixture_cleanup: 'exact owned mkdtemp removed' };
  } finally { fs.rmSync(owned, { recursive: true, force: true }); }
}
module.exports = { qualifySnapshotVerification };
