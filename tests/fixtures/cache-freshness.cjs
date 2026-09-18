const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const assert = require('node:assert/strict');

const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
function inventory(root) {
  const entries = [];
  function visit(dir) {
    for (const name of fs.readdirSync(dir).sort()) {
      const file = path.join(dir, name), stat = fs.lstatSync(file);
      entries.push([path.relative(root, file), stat.mode, stat.isFile() ? hash(fs.readFileSync(file)) :
        stat.isSymbolicLink() ? fs.readlinkSync(file) : 'directory']);
      if (stat.isDirectory()) visit(file);
    }
  }
  visit(root); return hash(JSON.stringify(entries));
}

/** CLI-only consumer fixture: no imports from source or installed internals. */
function qualifyCacheFreshness({ cli, node = process.execPath, tempRoot }) {
  const owner = fs.mkdtempSync(path.join(tempRoot, 'cache-qualification-'));
  const cases = [];
  const env = { PATH: path.dirname(node) + path.delimiter + process.env.PATH, LC_ALL: 'C', TMPDIR: owner,
    GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null', GIT_OPTIONAL_LOCKS: '0', GIT_TERMINAL_PROMPT: '0' };
  const invoke = (root, args, expected = 0, input) => {
    const result = spawnSync(node, [cli, ...args], { cwd: root, env, input, encoding: 'utf8', maxBuffer: 8e6, timeout: 60000 });
    assert.equal(result.error, undefined, String(result.error));
    assert.equal(result.status, expected, `${args.join(' ')}\n${result.stdout}\n${result.stderr}`);
    return result;
  };
  const json = (root, args) => JSON.parse(invoke(root, [...args, '--json']).stdout);
  const write = (file, content) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, content); };
  for (const format of ['legacy', 'v2']) for (const backend of ['json', 'sqlite']) {
    const seed = path.join(owner, `${format}-${backend}-seed`); fs.mkdirSync(seed);
    invoke(seed, ['init', '--graph-only']);
    const configFile = path.join(seed, '.mdkg/config.json');
    const config = JSON.parse(fs.readFileSync(configFile, 'utf8')); config.index.backend = backend;
    fs.writeFileSync(configFile, JSON.stringify(config));
    const task = json(seed, ['new', 'task', 'Cache original task']).node;
    const rule = json(seed, ['new', 'rule', 'Cache original rule']).node;
    const skillPath = '.mdkg/skills/cache-proof/SKILL.md';
    write(path.join(seed, skillPath), '---\nname: cache-proof\ndescription: Cache original skill\ntags: [original]\n---\n# Purpose\nSynthetic cache evidence.\n');
    invoke(seed, ['index']);
    if (format === 'v2') {
      const args = ['graph', 'migrate', '--graph-id', crypto.randomUUID(), '--origin', crypto.randomUUID()];
      const plan = json(seed, args);
      assert.deepEqual(plan.blocking, []);
      invoke(seed, [...args, '--apply', '--plan-hash', plan.plan_hash, '--json']);
    }
    const git = args => {
      const result = spawnSync('git', ['-c', 'core.hooksPath=/dev/null', ...args], { cwd: seed, env, encoding: 'utf8' });
      assert.equal(result.status, 0, result.stderr);
    };
    git(['init', '-q']); git(['add', '--', task.path, rule.path]);
    for (const state of ['fresh', 'copied-stale', 'equal-time', 'older-time', 'deleted', 'absent']) {
      const root = path.join(owner, `${format}-${backend}-${state}`);
      fs.cpSync(seed, root, { recursive: true, preserveTimestamps: true });
      const nodeFile = path.join(root, task.path), ruleFile = path.join(root, rule.path), skillFile = path.join(root, skillPath);
      const changed = [[nodeFile, 'Cache original task', 'Cache current task'], [ruleFile, 'Cache original rule', 'Cache current rule'],
        [skillFile, 'Cache original skill', 'Cache current skill']];
      for (const [file, old, next] of changed) {
        const content = fs.readFileSync(file, 'utf8'); assert.ok(content.includes(old));
        fs.writeFileSync(file, content.replace(old, next) + '\nCurrent authored body sentinel.\n');
      }
      if (state === 'fresh') invoke(root, ['index']);
      else if (state === 'absent') fs.rmSync(path.join(root, '.mdkg/index'), { recursive: true });
      else {
        const stamp = Date.now() / 1000 + 60;
        for (const name of fs.readdirSync(path.join(root, '.mdkg/index'))) fs.utimesSync(path.join(root, '.mdkg/index', name), stamp, stamp);
        for (const [file] of changed) fs.utimesSync(file, state === 'equal-time' ? stamp : 1, state === 'equal-time' ? stamp : 1);
        if (state === 'deleted') { fs.unlinkSync(nodeFile); fs.unlinkSync(ruleFile); fs.unlinkSync(skillFile); }
      }
      const before = inventory(root);
      const reads = state === 'deleted' ? [
        { args: ['search', 'Cache original task', '--json'], check: r => assert.equal(JSON.parse(r.stdout).count, 0) },
        { args: ['show', task.id, '--json'], exit: 3, check: r => assert.match(r.stderr, /not found/) },
        { args: ['skill', 'search', 'Cache original skill', '--json'], check: r => assert.equal(JSON.parse(r.stdout).count, 0) },
        { args: ['capability', 'search', 'Cache original rule', '--json'], check: r => assert.equal(JSON.parse(r.stdout).count, 0) },
      ] : [
        { args: ['show', task.id, '--json'], check: r => { const item = JSON.parse(r.stdout).item; assert.equal(item.title, 'Cache current task'); assert.match(item.body, /Current authored body sentinel/); } },
        { args: ['search', 'Cache current task', '--json'], check: r => assert.equal(JSON.parse(r.stdout).count, 1) },
        { args: ['list', '--type', 'task', '--json'], check: r => assert.ok(JSON.parse(r.stdout).items.some(item => item.title === 'Cache current task')) },
        { args: ['skill', 'show', 'cache-proof', '--json'], check: r => assert.equal(JSON.parse(r.stdout).item.description, 'Cache current skill') },
        { args: ['skill', 'search', 'Cache current skill', '--json'], check: r => assert.equal(JSON.parse(r.stdout).count, 1) },
        { args: ['capability', 'search', 'Cache current rule', '--json'], check: r => assert.equal(JSON.parse(r.stdout).count, 1) },
        { args: ['pack', task.id, '--dry-run', '--skills', 'none'], check: r => assert.match(r.stdout, /dry-run: no files written/) },
        { args: ['mcp', 'serve', '--stdio'], input: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call',
          params: { name: 'mdkg_pack', arguments: { id: task.id, profile: 'standard' } } }) + '\n', check: r => {
            const output = JSON.parse(r.stdout); assert.equal(output.error, undefined);
            assert.match(JSON.stringify(output.result.structuredContent), /Cache current task/);
            assert.match(JSON.stringify(output.result.structuredContent), /Current authored body sentinel/);
          } },
      ];
      for (const read of reads) {
        const result = invoke(root, read.args, read.exit ?? 0, read.input); read.check(result);
        assert.equal(inventory(root), before, `${format}/${backend}/${state}/${read.args.join(' ')} preserves bytes and staging`);
        cases.push({ format, backend, state, command: read.args.join(' '), result: 'pass' });
      }
      if (!['fresh', 'deleted', 'absent'].includes(state)) {
        const args = ['show', task.id, '--no-reindex', '--json'];
        const result = invoke(root, args);
        assert.equal(JSON.parse(result.stdout).item.title, format === 'v2' ? 'Cache current task' : 'Cache original task');
        if (format === 'legacy') assert.match(result.stderr, /index is stale/);
        cases.push({ format, backend, state, command: 'explicit-no-reindex', result: 'pass' });
        const bypass = json(root, ['show', task.id, '--no-cache', '--no-reindex']); assert.equal(bypass.item.title, 'Cache current task');
        cases.push({ format, backend, state, command: 'explicit-no-cache', result: 'pass' });
        assert.equal(inventory(root), before);
      }
      // Genuine normal authoring is a positive control, separate from reads.
      // The equal-time case deliberately places source dates in the future.
      // Reset only after all read assertions, before measuring a new writer's
      // health; preserving the legacy mtime warning is intentional.
      for (const [file] of changed) if (fs.existsSync(file)) fs.utimesSync(file, 1, 1);
      invoke(root, ['index']);
      const created = json(root, ['new', 'task', 'Post observation control']).node;
      assert.equal(json(root, ['show', created.id]).item.title, 'Post observation control');
      if (backend === 'sqlite') invoke(root, ['db', 'index', 'verify', '--json']);
      cases.push({ format, backend, state, command: 'normal-index-and-authoring', result: 'pass' });
    }
  }
  for (const backend of ['json', 'sqlite']) for (const state of ['zip-restored', 'raw-repaired', 'zip-corrupted']) {
    const root = path.join(owner, `archive-${backend}-${state}`);
    fs.cpSync(path.join(owner, `legacy-${backend}-seed`), root, { recursive: true });
    const configFile = path.join(root, '.mdkg/config.json'), config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    config.index.tolerant = true; fs.writeFileSync(configFile, JSON.stringify(config));
    const payload = Buffer.from('Synthetic cache archive payload\n'); fs.writeFileSync(path.join(root, 'payload.txt'), payload);
    const archive = json(root, ['archive', 'add', 'payload.txt', '--id', 'archive.proof', '--title', 'Cache archive proof']).archive;
    const raw = path.join(root, archive.stored_path), compressed = path.join(root, archive.compressed_path);
    const zip = fs.readFileSync(compressed);
    if (state === 'zip-restored') fs.unlinkSync(compressed);
    if (state === 'raw-repaired') fs.writeFileSync(raw, 'Corrupt raw payload');
    invoke(root, ['index', '--tolerant']);
    if (state === 'raw-repaired') fs.writeFileSync(raw, payload);
    else fs.writeFileSync(compressed, state === 'zip-restored' ? zip : Buffer.from('Corrupt ZIP'));
    fs.utimesSync(state === 'raw-repaired' ? raw : compressed, 1, 1);
    const before = inventory(root), present = state !== 'zip-corrupted';
    const search = json(root, ['search', 'Cache archive proof']); assert.equal(search.count, present ? 1 : 0);
    const show = invoke(root, ['show', 'archive.proof', '--json'], present ? 0 : 3);
    if (present) assert.equal(JSON.parse(show.stdout).item.title, 'Cache archive proof');
    else assert.match(show.stderr, /not found/);
    assert.equal(inventory(root), before);
    for (const command of ['search archive', 'show archive']) cases.push({ format: 'legacy', backend, state, command, result: 'pass' });
    invoke(root, ['archive', 'compress', 'archive.proof', '--json']);
    assert.equal(json(root, ['archive', 'verify', 'archive.proof']).ok, true);
    cases.push({ format: 'legacy', backend, state, command: 'explicit-compression-and-verification', result: 'pass' });
  }
  return { owner, cases, runtime: process.version, platform: process.platform, arch: process.arch, cli_sha256: hash(fs.readFileSync(cli)) };
}
module.exports = { qualifyCacheFreshness, inventory };
