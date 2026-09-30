// Installed CLI only. Invoked inside an owned, supervised disposable fixture.
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const { spawn, spawnSync } = require('node:child_process');
const [cli, root] = process.argv.slice(2);
assert(path.isAbsolute(cli) && path.isAbsolute(root));
assert.equal(fs.realpathSync(root), root);
const inventory = () => {
  const out = {}; const walk = dir => { for (const name of fs.readdirSync(dir).sort()) {
    const p = path.join(dir, name), s = fs.lstatSync(p); assert(!s.isSymbolicLink());
    out[path.relative(root, p)] = [s.mode, s.isDirectory() ? 'directory' : crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')];
    if (s.isDirectory()) walk(p);
  } }; walk(root); return out;
};
const env = { ...process.env, TMPDIR: root, TEMP: root, TMP: root };
const run = (args, preload) => spawnSync(process.execPath, [...(preload ? ['--require', preload] : []), cli, ...args], { cwd: root, env, encoding: 'utf8', timeout: 30000 });
const json = args => { const r = run([...args, '--json']); assert.equal(r.error, undefined); assert.equal(r.status, 0, r.stderr + r.stdout); return JSON.parse(r.stdout); };
const pause = path.join(root, 'pause-owned-writer.cjs'), ambiguous = path.join(root, 'ambiguous-pid-probe.cjs');
fs.writeFileSync(pause, `const fs=require('node:fs'),path=require('node:path');
const root=${JSON.stringify(root)},target=path.resolve(root,process.env.OWNED_TARGET);
if(fs.realpathSync(process.cwd())!==root||!target.startsWith(root+path.sep))throw Error('fixture boundary');
let stopped=false;const stop=p=>{if(!stopped&&path.resolve(String(p))===target){stopped=true;fs.writeSync(1,'OWNED_WRITER_PAUSED\\n');Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,60000);throw Error('owned worker was not stopped by its parent');}};
const rename=fs.renameSync,open=fs.openSync,close=fs.closeSync,handles=new Map();
fs.renameSync=function(a,b){const r=rename.apply(this,arguments);stop(b);return r;};
fs.openSync=function(p,flags){const fd=open.apply(this,arguments);if(typeof flags==='number'&&(flags&fs.constants.O_WRONLY)&&path.resolve(String(p))===target)handles.set(fd,p);return fd;};
fs.closeSync=function(fd){const p=handles.get(fd);handles.delete(fd);const r=close.apply(this,arguments);if(p)stop(p);return r;};
`, { flag: 'wx', mode: 0o600 });
fs.writeFileSync(ambiguous, "const kill=process.kill;process.kill=function(pid,signal){if(signal===0)throw Object.assign(Error('synthetic ambiguous local PID probe'),{code:'EPERM'});return kill.call(this,pid,signal);};\n", { flag: 'wx', mode: 0o600 });
const children = new Set(), cases = [];
async function main() {
  const init = run(['init', '--graph-only']); assert.equal(init.status, 0, init.stderr);
  json(['new', 'task', 'Recovery admission fixture']);
  const args = ['graph', 'migrate', '--graph-id', crypto.randomUUID(), '--origin', crypto.randomUUID()];
  const plan = json(args); assert.deepEqual(plan.blocking, []);
  fs.writeFileSync(path.join(root, 'unrelated.txt'), 'preserved fixture evidence\n');
  const child = spawn(process.execPath, ['--require', pause, cli, ...args, '--apply', '--plan-hash', plan.plan_hash, '--json'],
    { cwd: root, env: { ...env, OWNED_TARGET: plan.writes[0].path }, stdio: ['ignore', 'pipe', 'pipe'] });
  children.add(child); let stdout = '', stderr = '';
  const exited = new Promise(resolve => child.once('close', (code, signal) => { children.delete(child); resolve({ code, signal }); }));
  child.stderr.on('data', data => { stderr += data; });
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => { child.kill('SIGKILL'); reject(Error('owned pause timed out: ' + stderr)); }, 20000);
    child.once('error', error => { clearTimeout(timer); reject(error); });
    child.once('close', () => { clearTimeout(timer); reject(Error('owned writer exited before pause: ' + stderr)); });
    child.stdout.on('data', data => { stdout += data; if (stdout.includes('OWNED_WRITER_PAUSED\n')) { clearTimeout(timer); resolve(); } });
  });
  const recover = ['graph', 'recover', plan.plan_hash];
  const reject = (name, extra, preload, pattern) => {
    const before = inventory(), output = run([...recover, '--resume', '--confirm-quiescent', '--lock-evidence', extra, '--json'], preload);
    assert.equal(output.error, undefined); assert.notEqual(output.status, 0, name);
    if (pattern) assert.match(output.stderr + output.stdout, pattern);
    assert.deepEqual(inventory(), before, name); cases.push({ name, pass: true, complete_inventory_unchanged: true });
  };
  try {
    for (const suspended of [false, true]) {
      if (suspended) child.kill('SIGSTOP');
      const before = inventory(), inspected = json(recover);
      assert.equal(inspected.recovery.resume.ready, false); assert.match(inspected.recovery.resume.reason, /live, suspended or reused/);
      assert.deepEqual(inventory(), before);
      reject(suspended ? 'suspended-writer-refused' : 'live-writer-refused', 'sha256:' + '0'.repeat(64), undefined, /live, suspended or reused/);
    }
  } finally { child.kill('SIGKILL'); assert.equal((await exited).signal, 'SIGKILL'); }
  const review = json(recover), evidence = review.recovery.resume.lock_evidence;
  assert.equal(review.recovery.resume.ready, true);
  reject('ambiguous-pid-refused', evidence, ambiguous, /ambiguous|unavailable/);
  for (const relative of ['.mdkg/index/write.lock/unknown.txt', '.mdkg/work/task-999-unknown.md']) {
    const file = path.join(root, relative), bytes = 'unknown owned fixture test bytes\n';
    fs.writeFileSync(file, bytes, { flag: 'wx', mode: 0o600 });
    reject('unknown-entry-refused:' + relative, evidence);
    assert.equal(fs.readFileSync(file, 'utf8'), bytes); fs.unlinkSync(file);
  }
  const approvals = json(recover).recovery;
  const outcomes = await Promise.all(['resume', 'rollback'].map(mode => new Promise((resolve, reject) => {
    const c = spawn(process.execPath, [cli, ...recover, '--' + mode, '--confirm-quiescent', '--lock-evidence', approvals[mode].lock_evidence, '--json'], { cwd: root, env });
    children.add(c); let out = '', err = ''; c.stdout.on('data', data => { out += data; }); c.stderr.on('data', data => { err += data; });
    c.once('error', reject); c.once('close', (code, signal) => { children.delete(c); resolve({ mode, code, signal, out, err }); });
  })));
  assert.equal(outcomes.filter(row => row.code === 0).length, 1, JSON.stringify(outcomes));
  const winner = outcomes.find(row => row.code === 0), state = winner.mode === 'resume' ? 'applied' : 'rolled-back';
  assert.equal(json(recover).state, state);
  const journal = JSON.parse(fs.readFileSync(path.join(root, '.mdkg/state/identity-transactions', plan.plan_hash.slice(7) + '.json')));
  for (const row of journal.plan.writes) assert.equal(fs.existsSync(path.join(root, row.path)) ? fs.readFileSync(path.join(root, row.path), 'utf8') : null, row[winner.mode === 'resume' ? 'after' : 'before']);
  assert.equal(fs.existsSync(path.join(root, '.mdkg/index/write.lock')), false);
  const terminal = inventory(); json([...recover, '--' + winner.mode]); assert.deepEqual(inventory(), terminal);
  assert.equal(fs.readFileSync(path.join(root, 'unrelated.txt'), 'utf8'), 'preserved fixture evidence\n');
  cases.push({ name: 'competing-opposite-recovery-one-winner', pass: true, winning_mode: winner.mode, exact_terminal_bytes: true, repeated_terminal_read_only: true });
  return { cases, runtime: process.version, platform: process.platform, arch: process.arch, ambiguity: 'synthetic EPERM refusal control', live_and_suspended: 'actual owned child process' };
}
main().then(result => console.log(JSON.stringify(result))).catch(async error => {
  await Promise.all([...children].map(child => new Promise(resolve => { child.once('close', resolve); child.kill('SIGKILL'); })));
  console.error(error); process.exitCode = 1;
});
