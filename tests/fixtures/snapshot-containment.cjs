const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const assert = require('node:assert/strict'), { spawnSync } = require('node:child_process');

function qualifySnapshotContainment({ cli, tempRoot, node = process.execPath }) {
  const owned = fs.mkdtempSync(path.join(tempRoot, 'snapshot-containment-'));
  const env = { PATH: process.env.PATH, TMPDIR: owned, LC_ALL: 'C', GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null', GIT_TERMINAL_PROMPT: '0' };
  const run = (root, args) => spawnSync(node, [cli, ...args], { cwd: root, env, encoding: 'utf8', timeout: 4000, killSignal: 'SIGKILL', maxBuffer: 2 * 1024 * 1024 });
  const ok = r => { assert.equal(r.error, undefined); assert.equal(r.status, 0, r.stdout + r.stderr); return r; };
  const hash = b => crypto.createHash('sha256').update(b).digest('hex');
  const inventory = root => { const result = []; const walk = dir => { for (const name of fs.readdirSync(dir).sort()) {
    const p = path.join(dir, name), s = fs.lstatSync(p), rel = path.relative(root, p);
    if (s.isDirectory()) { result.push([rel, 'dir', s.mode]); walk(p); }
    else if (s.isSymbolicLink()) result.push([rel, 'link', fs.readlinkSync(p)]);
    else if (s.isFile()) result.push([rel, 'file', s.mode, hash(fs.readFileSync(p))]);
    else result.push([rel, 'special', s.mode]);
  }}; walk(root); return result; };
  const base = path.join(owned, 'base'), cases = []; let count = 0;
  const check = (name, fn) => { try { fn(); cases.push({ name, pass: true }); } catch (e) { cases.push({ name, pass: false, error: e.message }); } };
  function setup() {
    const area = path.join(owned, String(++count)), root = path.join(area, 'repo'); fs.mkdirSync(area); fs.cpSync(base, root, { recursive: true });
    const paths = { snapshot: path.join(root, '.mdkg/db/state/project.sqlite'), manifest: path.join(root, '.mdkg/db/state/project.manifest.json'), runtime: path.join(root, '.mdkg/db/runtime/project.sqlite') };
    return { area, root, paths };
  }
  function refused(f, command, sentinel) {
    const before = inventory(f.area), r = run(f.root, ['db', 'snapshot', command, '--json']);
    assert.equal(r.error, undefined, String(r.error)); assert.equal(r.signal, null);
    if (command === 'seal') assert.notEqual(r.status, 0, 'seal accepted unsafe input');
    else { const p = JSON.parse(r.stdout); assert.equal(p.ok, false, 'inspection accepted unsafe input'); assert.equal(p.status, 'invalid'); assert.equal(r.status === 0, command === 'status'); }
    if (sentinel) assert(!(r.stdout + r.stderr).includes(hash(sentinel)), 'external sentinel digest disclosed');
    assert.deepEqual(inventory(f.area), before, 'refusal changed repository or external sentinel');
  }
  try {
    fs.mkdirSync(base); for (const args of [['init', '--graph-only'], ['db', 'init'], ['db', 'migrate'], ['db', 'snapshot', 'seal']]) ok(run(base, args));
    for (const command of ['verify', 'status', 'seal']) for (const key of ['snapshot', 'manifest', 'runtime']) {
      for (const mode of ['external-link', 'internal-link', 'dangling-link', 'ancestor-link', 'fifo', 'directory']) {
        check(`${command} rejects ${key} ${mode} before effects`, () => {
          const f = setup(), p = f.paths[key], bytes = fs.readFileSync(p);
          if (mode === 'ancestor-link') { const dir = path.dirname(p), external = path.join(f.area, 'external-dir'); fs.renameSync(dir, external); fs.symlinkSync(external, dir); }
          else {
            fs.unlinkSync(p);
            if (mode === 'fifo') { const r = spawnSync('mkfifo', [p], { env, encoding: 'utf8' }); assert.equal(r.status, 0, r.stderr); }
            else if (mode === 'directory') { fs.mkdirSync(p); fs.writeFileSync(path.join(p, 'keep'), 'preserve'); }
            else { const target = path.join(mode === 'internal-link' ? f.root : f.area, 'sentinel'); if (mode !== 'dangling-link') fs.writeFileSync(target, bytes); fs.symlinkSync(target, p); }
          }
          refused(f, command, bytes);
        });
      }
    }
    for (const command of ['verify', 'status']) check(`${command} rejects oversized manifest before parse`, () => {
      const f = setup(), cpath = path.join(f.root, '.mdkg/config.json'), c = JSON.parse(fs.readFileSync(cpath));
      c.index.limits.max_file_bytes = 4096; fs.writeFileSync(cpath, JSON.stringify(c)); fs.appendFileSync(f.paths.manifest, ' '.repeat(8192)); refused(f, command);
    });
    for (const command of ['verify', 'status', 'seal']) {
      check(`${command} does not disclose arbitrary external snapshot digest`, () => {
        const f = setup(), bytes = Buffer.from('SYNTHETIC PRIVATE SNAPSHOT SENTINEL\n'), outside = path.join(f.area, 'outside');
        fs.writeFileSync(outside, bytes); fs.unlinkSync(f.paths.snapshot); fs.symlinkSync(outside, f.paths.snapshot); refused(f, command, bytes);
      });
      for (const key of ['snapshot', 'runtime']) for (const suffix of ['-wal', '-shm', '-journal']) check(`${command} rejects linked ${key}${suffix} sidecar`, () => {
        const f = setup(), outside = path.join(f.area, 'outside'); fs.writeFileSync(outside, 'SYNTHETIC SIDECAR'); fs.symlinkSync(outside, f.paths[key] + suffix); refused(f, command);
      });
    }
    check('first seal and regular reseal retain old snapshot hash', () => {
      const f = setup(); fs.unlinkSync(f.paths.snapshot); fs.unlinkSync(f.paths.manifest);
      const first = JSON.parse(ok(run(f.root, ['db', 'snapshot', 'seal', '--json'])).stdout); assert.equal(first.old_snapshot_sha256, null);
      const expected = 'sha256:' + hash(fs.readFileSync(f.paths.snapshot));
      const second = JSON.parse(ok(run(f.root, ['db', 'snapshot', 'seal', '--json'])).stdout); assert.equal(second.old_snapshot_sha256, expected);
      assert.equal(JSON.parse(ok(run(f.root, ['db', 'snapshot', 'verify', '--json'])).stdout).ok, true);
    });
    check('portable absent-runtime snapshot verifies without writes', () => {
      const f = setup(); fs.unlinkSync(f.paths.runtime); const before = inventory(f.area);
      assert.equal(JSON.parse(ok(run(f.root, ['db', 'snapshot', 'verify', '--json'])).stdout).status, 'valid'); assert.deepEqual(inventory(f.area), before);
    });
    return { pass: cases.every(c => c.pass), cases, fixture_cleanup: 'exact owned mkdtemp removed' };
  } finally { fs.rmSync(owned, { recursive: true, force: true }); }
}
module.exports = { qualifySnapshotContainment };
