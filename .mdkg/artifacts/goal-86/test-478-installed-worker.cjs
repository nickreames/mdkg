// Trusted fixture controller/preload: installed CLI only, no graph-module imports.
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process');
const specPath = process.env.MDKG_TEST478_PRELOAD;
if (specPath) {
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const root = fs.realpathSync(spec.root), cwd = fs.realpathSync(process.cwd());
  assert(root.startsWith('/private/tmp/mdkg-collaboration-'));
  assert.equal(cwd, fs.realpathSync(spec.cwd));
  assert(cwd.startsWith(root + path.sep));
  const owned = file => {
    const resolved = path.resolve(file);
    assert(resolved.startsWith(root + path.sep)); return resolved;
  };
  const targets = new Set((spec.targets || []).map(relative => owned(path.resolve(cwd, relative))));
  const owner = path.join(cwd, '.mdkg/index/write.lock/owner.json');
  const handles = new Map(), open = fs.openSync, close = fs.closeSync, rename = fs.renameSync;
  let fired = false;
  function published(file) {
    const target = path.resolve(String(file));
    if (fired) return;
    if (spec.mode === 'kill' && targets.has(target)) {
      fired = true; process.kill(process.pid, 'SIGKILL');
    } else if (spec.mode === 'hold' && target === owner) {
      fired = true;
      assert.equal(JSON.parse(fs.readFileSync(owner, 'utf8')).pid, process.pid);
      fs.writeFileSync(owned(spec.ready), JSON.stringify({ pid: process.pid, owner }), { flag: 'wx', mode: 0o600 });
      const deadline = Date.now() + 20000;
      while (!fs.existsSync(owned(spec.gate))) {
        assert(Date.now() < deadline, 'fixture lock barrier timed out');
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
      }
    }
  }
  fs.openSync = function(file, flags) {
    const fd = open.apply(this, arguments);
    if (typeof file === 'string' && typeof flags === 'number' && (flags & fs.constants.O_WRONLY)) handles.set(fd, file);
    return fd;
  };
  fs.closeSync = function(fd) {
    const file = handles.get(fd); handles.delete(fd);
    const value = close.apply(this, arguments); if (file) published(file); return value;
  };
  fs.renameSync = function(from, to) { const value = rename.apply(this, arguments); published(to); return value; };
} else {
  async function main() {
    const spec = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
    const root = fs.realpathSync(spec.root);
    assert(root.startsWith('/private/tmp/mdkg-collaboration-'));
    assert(fs.realpathSync(spec.cli).startsWith(root + path.sep));
    const owned = file => { assert(path.resolve(file).startsWith(root + path.sep)); return file; };
    const children = [];
    function launch(job, preload = false) {
      assert(fs.realpathSync(job.cwd).startsWith(root + path.sep));
      const options = preload ? ['--require', __filename] : [];
      const child = cp.spawn(process.execPath, [...options, spec.cli, ...job.args, '--json'], {
        cwd: job.cwd, env: { ...process.env, ...(preload ? { MDKG_TEST478_PRELOAD: owned(job.preload) } : {}) },
        stdio: ['ignore', 'pipe', 'pipe'], detached: false,
      });
      children.push(child);
      let stdout = '', stderr = '';
      child.stdout.on('data', chunk => { stdout += chunk; assert(stdout.length < 16 * 1024 * 1024); });
      child.stderr.on('data', chunk => { stderr += chunk; assert(stderr.length < 16 * 1024 * 1024); });
      const result = new Promise((resolve, reject) => {
        child.on('error', reject);
        child.on('close', (status, signal) => resolve({ status, signal, stdout, stderr }));
      });
      return { child, result };
    }
    async function waitReady(files) {
      const deadline = Date.now() + 15000;
      while (!files.every(file => fs.existsSync(owned(file)))) {
        assert(children.every(child => child.exitCode === null && child.signalCode === null), 'writer exited before lock barrier');
        assert(Date.now() < deadline, 'fixture writers did not reach the lock barrier');
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }
    const accept = result => { assert.equal(result.signal, null); assert.equal(result.status, 0, result.stderr + result.stdout); return JSON.parse(result.stdout); };
    try {
      if (spec.mode === 'parallel') {
        const pending = spec.jobs.map(job => launch(job, true));
        await waitReady(spec.jobs.map(job => job.ready));
        const owners = spec.jobs.map(job => JSON.parse(fs.readFileSync(job.ready, 'utf8')));
        assert.notEqual(owners[0].pid, owners[1].pid);
        fs.writeFileSync(owned(spec.gate), 'release\n', { flag: 'wx', mode: 0o600 });
        const rows = (await Promise.all(pending.map(row => row.result))).map(accept);
        console.log(JSON.stringify({ mode: spec.mode, simultaneous_owned_locks: true, owners, rows }));
      } else if (spec.mode === 'exclusion') {
        const held = launch(spec.holder, true); await waitReady([spec.holder.ready]);
        const refused = await launch(spec.competitor).result;
        assert.notEqual(refused.status, 0); assert.equal(refused.signal, null); assert.match(refused.stderr, /mutation lock/);
        const peer = accept(await launch(spec.peer).result);
        assert.equal(held.child.exitCode, null, 'original owner must remain live during peer success');
        fs.writeFileSync(owned(spec.gate), 'release\n', { flag: 'wx', mode: 0o600 });
        const owner = accept(await held.result);
        console.log(JSON.stringify({ mode: spec.mode, same_checkout_refused: true, other_checkout_succeeded: true, owner, peer }));
      } else if (spec.mode === 'kill') {
        const result = await launch(spec.job, true).result;
        assert.equal(result.signal, 'SIGKILL'); assert.equal(result.status, null);
        console.log(JSON.stringify({ mode: spec.mode, child_terminal: true, signal: result.signal }));
      } else throw Error('unsupported fixture worker mode');
    } finally {
      // Only direct children created by this controller. The outer existing
      // process-group supervisor remains responsible for descendant quiescence.
      for (const child of children) if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
    }
  }
  main().catch(error => { console.error(error.stack); process.exitCode = 1; });
}
