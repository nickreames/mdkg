const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const assert = require('node:assert/strict'), { spawnSync } = require('node:child_process');

// CLI-only fixture: runnable unchanged against installed candidate bytes.
function qualifyNativeGitCustody({ cli, tempRoot, node = process.execPath }) {
  const owned = fs.mkdtempSync(path.join(tempRoot, 'native-git-custody-'));
  const env = { PATH: process.env.PATH, TMPDIR: owned, LC_ALL: 'C', GIT_CONFIG_NOSYSTEM: '1',
    GIT_CONFIG_GLOBAL: process.platform === 'win32' ? 'NUL' : '/dev/null', GIT_TERMINAL_PROMPT: '0' };
  const run = (root, args, extra = {}) => spawnSync(node, [cli, ...args], { cwd: root, env: { ...env, ...extra },
    encoding: 'utf8', timeout: 20000, killSignal: 'SIGKILL', maxBuffer: 4 * 1024 * 1024 });
  const ok = r => { assert.equal(r.error, undefined); assert.equal(r.signal, null); assert.equal(r.status, 0, r.stdout + r.stderr); return r; };
  const git = (root, args) => ok(spawnSync('git', ['-c', 'core.hooksPath=/dev/null', '-c', 'user.name=Fixture',
    '-c', 'user.email=fixture@example.invalid', ...args], { cwd: root, env, encoding: 'utf8', timeout: 10000 })).stdout.trim();
  const inventory = root => {
    const rows = [];
    function walk(directory) { for (const name of fs.readdirSync(directory).sort()) {
      const file = path.join(directory, name), stat = fs.lstatSync(file), key = path.relative(root, file);
      if (stat.isDirectory()) { rows.push([key, 'directory', stat.mode]); walk(file); }
      else if (stat.isSymbolicLink()) rows.push([key, 'link', fs.readlinkSync(file)]);
      else if (stat.isFile()) rows.push([key, 'file', stat.mode, crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')]);
      else rows.push([key, 'special', stat.mode]);
    } }
    walk(root); return rows;
  };
  const cases = []; let sequence = 0;
  const check = (name, fn) => { try { fn(); cases.push({ name, pass: true }); } catch (error) { cases.push({ name, pass: false, error: error.message }); } };
  const seed = path.join(owned, 'seed');
  const setup = () => {
    const area = path.join(owned, String(++sequence)), root = path.join(area, 'repo');
    fs.mkdirSync(area); fs.cpSync(seed, root, { recursive: true }); return { area, root };
  };
  const config = (root, edit) => { const file = path.join(root, '.mdkg/config.json'), value = JSON.parse(fs.readFileSync(file)); edit(value); fs.writeFileSync(file, JSON.stringify(value)); };
  const refuse = (f, args, extra) => {
    const before = inventory(f.area), result = run(f.root, args, extra);
    assert.equal(result.error, undefined); assert.equal(result.signal, null); assert.notEqual(result.status, 0, 'native Git destination accepted');
    assert.match(result.stdout + result.stderr, /Git metadata|Git destination tree inventory/);
    assert.deepEqual(inventory(f.area), before, 'refusal changed Git, graph, SQLite or unrelated fixture custody');
  };
  try {
    fs.mkdirSync(seed);
    for (const args of [['init', '--graph-only'], ['new', 'task', 'Synthetic custody'], ['db', 'init'], ['db', 'migrate'],
      ['db', 'snapshot', 'seal'], ['bundle', 'create', '--profile', 'private']]) ok(run(seed, args));
    for (const kind of ['root', 'nested', 'bare-root', 'bare-nested', 'separate-root', 'separate-nested', 'worktree']) check(`materialize cleanup preserves ${kind} native Git`, () => {
      const f = setup(), output = path.join(f.root, 'generated/child');
      ok(run(f.root, ['subgraph', 'add', 'child', '.mdkg/bundles/private/all.mdkg.zip']));
      ok(run(f.root, ['subgraph', 'materialize', 'child', '--target', 'generated']));
      const marker = fs.readFileSync(path.join(output, '.mdkg-materialized.json'));
      if (kind === 'worktree') {
        const source = path.join(f.area, 'source'); fs.mkdirSync(source); git(source, ['init', '-q']);
        git(source, ['commit', '--allow-empty', '--no-verify', '-qm', 'synthetic ancestor']);
        fs.rmSync(output, { recursive: true }); git(source, ['worktree', 'add', '-qb', 'fixture', output]);
        fs.writeFileSync(path.join(output, '.mdkg-materialized.json'), marker);
      } else {
        const target = kind.includes('nested') ? path.join(output, 'nested/developer') : output; fs.mkdirSync(target, { recursive: true });
        git(target, kind.startsWith('bare') ? ['init', '--bare', '-q'] : kind.startsWith('separate')
          ? ['init', '-q', '--separate-git-dir', path.join(target, 'admin')] : ['init', '-q']);
      }
      refuse(f, ['subgraph', 'materialize', 'child', '--target', 'generated', '--clean', '--gitignore', '--json']);
    });
    check('materialize remains usable and cleanable in an ordinary generated tree', () => {
      const f = setup(); ok(run(f.root, ['subgraph', 'add', 'child', '.mdkg/bundles/private/all.mdkg.zip']));
      for (const flags of [[], ['--clean']]) ok(run(f.root, ['subgraph', 'materialize', 'child', '--target', 'generated', ...flags, '--json']));
      assert(fs.existsSync(path.join(f.root, 'generated/child/.mdkg-materialized.json')));
    });
    check('bounded recursive inventory refuses without partial extraction or cleanup', () => {
      const f = setup(); ok(run(f.root, ['subgraph', 'add', 'child', '.mdkg/bundles/private/all.mdkg.zip']));
      ok(run(f.root, ['subgraph', 'materialize', 'child', '--target', 'generated']));
      config(f.root, c => { c.index.limits.max_files = 1; });
      refuse(f, ['subgraph', 'materialize', 'child', '--target', 'generated', '--clean', '--json']);
    });
    check('incoming growth refuses before deleting the previous materialized tree', () => {
      const f = setup(); ok(run(f.root, ['subgraph', 'add', 'child', '.mdkg/bundles/private/all.mdkg.zip']));
      ok(run(f.root, ['subgraph', 'materialize', 'child', '--target', 'generated']));
      const oldEntries = inventory(path.join(f.root, 'generated/child')).length;
      const growth = path.join(f.root, '.mdkg/artifacts/growth'); fs.mkdirSync(growth, { recursive: true });
      for (let i = 0; i < oldEntries + 1; i++) fs.writeFileSync(path.join(growth, `${i}.txt`), 'synthetic incoming growth\n');
      ok(run(f.root, ['bundle', 'create', '--profile', 'private']));
      config(f.root, c => { c.index.limits.max_files = oldEntries; });
      refuse(f, ['subgraph', 'materialize', 'child', '--target', 'generated', '--clean', '--json']);
    });
    check('incoming bare-store markers refuse before extraction or replacement', () => {
      const f = setup(); ok(run(f.root, ['subgraph', 'add', 'child', '.mdkg/bundles/private/all.mdkg.zip']));
      ok(run(f.root, ['subgraph', 'materialize', 'child', '--target', 'generated']));
      const bare = path.join(f.root, '.mdkg/artifacts/bare'); fs.mkdirSync(path.join(bare, 'objects'), { recursive: true });
      for (const name of ['HEAD', 'config', 'objects/sentinel']) fs.writeFileSync(path.join(bare, name), 'synthetic marker\n');
      ok(run(f.root, ['bundle', 'create', '--profile', 'private']));
      refuse(f, ['subgraph', 'materialize', 'child', '--target', 'generated', '--clean', '--json']);
    });
    check('boundary-equal incoming inventory remains materializable', () => {
      const f = setup(); ok(run(f.root, ['subgraph', 'add', 'child', '.mdkg/bundles/private/all.mdkg.zip']));
      ok(run(f.root, ['subgraph', 'materialize', 'child', '--target', 'generated']));
      const entries = inventory(path.join(f.root, 'generated/child')).length;
      config(f.root, c => { c.index.limits.max_files = entries; });
      ok(run(f.root, ['subgraph', 'materialize', 'child', '--target', 'generated', '--clean', '--json']));
      assert.equal(inventory(path.join(f.root, 'generated/child')).length, entries);
    });
    for (const kind of ['dotgit', 'separate', 'runtime-sidecar', 'snapshot-sidecar', 'manifest', 'runtime']) check(`snapshot seal preserves ${kind} native Git`, () => {
      const f = setup(), gitRoot = ['dotgit', 'runtime'].includes(kind) ? path.join(f.root, '.mdkg/db/child') : f.root;
      fs.mkdirSync(gitRoot, { recursive: true });
      git(gitRoot, kind === 'separate' ? ['init', '-q', '--separate-git-dir', path.join(f.root, '.mdkg/db/admin')] : ['init', '-q']);
      fs.writeFileSync(path.join(gitRoot, 'staged.txt'), 'native staged sentinel\n'); git(gitRoot, ['add', 'staged.txt']);
      const index = kind === 'separate' ? path.join(f.root, '.mdkg/db/admin/index') : path.join(gitRoot, '.git/index'); let extra = {};
      if (kind === 'dotgit' || kind === 'separate') config(f.root, c => { c.db.state_path = path.relative(f.root, index); });
      else if (kind === 'runtime') config(f.root, c => { c.db.runtime_path = path.relative(f.root, index); });
      else {
        const destination = path.join(f.root, kind === 'manifest' ? '.mdkg/db/custom/project.manifest.json' :
          kind === 'runtime-sidecar' ? '.mdkg/db/runtime/project.sqlite-journal' : '.mdkg/db/state/project.sqlite-wal');
        fs.mkdirSync(path.dirname(destination), { recursive: true }); fs.copyFileSync(index, destination); extra = { GIT_INDEX_FILE: destination };
        if (kind === 'manifest') config(f.root, c => { c.db.state_path = '.mdkg/db/custom/project.sqlite'; });
      }
      refuse(f, ['db', 'snapshot', 'seal', '--json'], extra);
    });
    for (const statePath of ['.mdkg/db/state/project.sqlite', '.mdkg/db/custom/project.sqlite', '.mdkg/db/root-snapshot.sqlite']) check(`snapshot seal/reseal preserve Git with legitimate ${statePath}`, () => {
      const f = setup(); git(f.root, ['init', '-q']); fs.writeFileSync(path.join(f.root, 'staged.txt'), 'native staged sentinel\n'); git(f.root, ['add', 'staged.txt']);
      fs.mkdirSync(path.dirname(path.join(f.root, statePath)), { recursive: true });
      config(f.root, c => { c.db.state_path = statePath; }); const before = inventory(path.join(f.root, '.git'));
      for (let i = 0; i < 2; i++) ok(run(f.root, ['db', 'snapshot', 'seal', '--json']));
      assert.equal(JSON.parse(ok(run(f.root, ['db', 'snapshot', 'verify', '--json'])).stdout).ok, true);
      assert.deepEqual(inventory(path.join(f.root, '.git')), before);
    });
    return { pass: cases.every(item => item.pass), cases, fixture_cleanup: 'exact owned mkdtemp removed' };
  } finally { fs.rmSync(owned, { recursive: true, force: true }); }
}
module.exports = { qualifyNativeGitCustody };
