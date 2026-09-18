'use strict';
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const assert = require('node:assert/strict'), { spawnSync } = require('node:child_process');

// Consumer qualification: installed CLI processes only, no source/module imports.
function qualifyWriterAdmission({ cli, publishedCli, preFenceCli, node = process.execPath, tempRoot }) {
  const owner = fs.mkdtempSync(path.join(tempRoot, 'writer-admission-')), rows = [];
  const env = { PATH: path.dirname(node) + path.delimiter + process.env.PATH, LC_ALL: 'C', TMPDIR: owner,
    GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1', GIT_OPTIONAL_LOCKS: '0' };
  const hash = data => crypto.createHash('sha256').update(data).digest('hex');
  const read = (root, file) => fs.readFileSync(path.join(root, file), 'utf8');
  function inventory(root) {
    const out = {};
    function walk(dir) { for (const name of fs.readdirSync(dir).sort()) {
      const p = path.join(dir, name), s = fs.lstatSync(p), rel = path.relative(root, p);
      out[rel] = { mode: s.mode, value: s.isDirectory() ? 'directory' : s.isSymbolicLink() ? fs.readlinkSync(p) : hash(fs.readFileSync(p)) };
      if (s.isDirectory()) walk(p);
    } }
    walk(root); return out;
  }
  function run(root, args, binary = cli) {
    const r = spawnSync(node, [binary, ...args], { cwd: root, env, encoding: 'utf8', timeout: 60000, maxBuffer: 8e6 });
    assert.equal(r.error, undefined, String(r.error)); return r;
  }
  const ok = (root, args, binary) => { const r = run(root, args, binary); assert.equal(r.status, 0, r.stderr + r.stdout); return r; };
  const json = (root, args, binary) => JSON.parse(ok(root, [...args, '--json'], binary).stdout);
  function git(root, args) {
    const r = spawnSync('git', ['--no-optional-locks', '-c', 'core.fsmonitor=false', '-c', 'core.hooksPath=/dev/null',
      '-c', 'user.name=mdkg fixture', '-c', 'user.email=fixture@example.invalid', ...args], { cwd: root, env, encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr); return r.stdout.trim();
  }
  const writeConfig = (root, change) => {
    const p = path.join(root, '.mdkg/config.json'), raw = JSON.parse(fs.readFileSync(p, 'utf8'));
    change(raw); fs.writeFileSync(p, JSON.stringify(raw, null, 2) + '\n');
  };
  const clone = (root, name, warm = true) => {
    const out = path.join(owner, name);
    fs.cpSync(root, out, { recursive: true, preserveTimestamps: warm, filter: src => path.basename(src) !== '.git' });
    return out;
  };
  function migrate(root, ancestor, binary = cli) {
    const args = ['graph', 'migrate', '--graph-id', crypto.randomUUID(), '--origin', crypto.randomUUID(), ...(ancestor ? ['--ancestor', ancestor] : [])];
    const before = inventory(owner), plan = json(root, args, binary);
    assert.equal(plan.safe_to_apply, true, JSON.stringify(plan));
    assert.deepEqual(inventory(owner), before, 'preview changed fixture or Git state');
    ok(root, [...args, '--apply', '--plan-hash', plan.plan_hash], binary);
    return plan;
  }
  for (const topology of ['standalone', 'worktree']) {
    const repo = path.join(owner, topology); fs.mkdirSync(repo);
    ok(repo, ['init', '--graph-only']);
    assert.equal(JSON.parse(read(repo, '.mdkg/config.json')).schema_version, 1);
    const first = json(repo, ['new', 'task', 'Original node']);
    git(repo, ['init', '-q']);
    git(repo, ['add', '--', '.mdkg/config.json', '.mdkg/templates', '.mdkg/core', first.node.path]);
    git(repo, ['commit', '-qm', 'synthetic ancestor']);
    const ancestor = git(repo, ['rev-parse', 'HEAD']);
    let root = repo;
    if (topology === 'worktree') { root = path.join(owner, 'linked'); git(repo, ['worktree', 'add', '-b', 'fixture-incoming', root, ancestor]); }
    const indexPath = path.resolve(root, git(root, ['rev-parse', '--git-path', 'index']));
    const indexHash = hash(fs.readFileSync(indexPath));
    const plan = migrate(root, ancestor);
    assert.equal(plan.writes[0].path, '.mdkg/config.json');
    assert.equal(JSON.parse(read(root, '.mdkg/config.json')).schema_version, 2);
    assert.equal(hash(fs.readFileSync(indexPath)), indexHash);
    const repeatBefore = inventory(owner);
    json(root, ['graph', 'recover', plan.plan_hash, '--resume']);
    assert.deepEqual(inventory(owner), repeatBefore);
    const linked = json(root, ['new', 'task', 'Uncommitted linked node', '--refs', first.node.id]);
    assert.match(read(root, linked.node.path), /refs: \[mdkg:\/\//);
    json(root, ['show', linked.node.id]);
    assert.equal(hash(fs.readFileSync(indexPath)), indexHash);
    if (topology === 'worktree') assert.equal(JSON.parse(read(repo, '.mdkg/config.json')).schema_version, 1);
    rows.push({ scenario: 'explicit-adoption-uncommitted-references-and-staging', topology, pass: true });

    if (topology !== 'standalone') continue;
    ok(root, ['event', 'enable']);
    const snapshot = '.mdkg/db/state/project.sqlite';
    fs.mkdirSync(path.dirname(path.join(root, snapshot)), { recursive: true });
    const setup = spawnSync(node, ['-e', 'const{DatabaseSync}=require("node:sqlite");const d=new DatabaseSync(process.argv[1]);d.exec("CREATE TABLE fixture(value TEXT)");d.close()', path.join(root, snapshot)], { env, encoding: 'utf8' });
    assert.equal(setup.status, 0, setup.stderr);
    const commands = [
      ['new', 'task', 'Blocked writer'], ['event', 'enable'], ['event', 'append', '--kind', 'TEST', '--status', 'ok', '--refs', first.node.id],
      ['index'], ['db', 'index', 'rebuild'], ['db', 'init'], ['db', 'snapshot', 'seal'], ['init'], ['init', '--force'],
      ['validate', '--out', 'reports/check.txt'], ['validate', '--json-out', 'reports/check.json'],
      ['db', 'snapshot', 'dump', '--snapshot', snapshot, '--output', 'reports/snapshot.txt'],
    ];
    for (const capability of ['writer', 'feature', 'config']) for (const [i, args] of commands.entries()) {
      const target = clone(root, `${capability}-${i}`);
      if (capability === 'config') writeConfig(target, raw => { raw.schema_version = 99; });
      else {
        const p = path.join(target, '.mdkg/graph.json'), manifest = JSON.parse(fs.readFileSync(p, 'utf8'));
        if (capability === 'writer') manifest.writer_min = 99; else manifest.required_features.push('future-feature');
        fs.writeFileSync(p, JSON.stringify(manifest));
      }
      const before = inventory(target), r = run(target, args);
      assert.notEqual(r.status, 0, args.join(' '));
      assert.match(r.stderr + r.stdout, /unsupported|newer than supported/);
      assert.deepEqual(inventory(target), before, args.join(' '));
      rows.push({ scenario: 'unknown-capability-no-effects', capability, command: args, exit: r.status, pass: true });
    }
    for (const warm of [false, true]) for (const args of [['new', 'task', 'Old writer'], ['task', 'update', first.node.id, '--priority', '2']]) {
      const target = clone(root, `old-${warm}-${args[0]}`, warm), before = inventory(target), r = run(target, args, publishedCli);
      assert.notEqual(r.status, 0); assert.match(r.stderr, /schema_version 2 is newer than supported/);
      assert.deepEqual(inventory(target), before);
      rows.push({ scenario: 'published-0.5.2-fenced', warm, command: args, exit: r.status, pass: true });
    }
    for (const force of [false, true]) {
      const target = clone(root, `old-init-${force}`), before = inventory(target), args = ['init', ...(force ? ['--force'] : [])];
      const r = ok(target, args, publishedCli), after = inventory(target);
      const changed = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(p => JSON.stringify(before[p]) !== JSON.stringify(after[p]));
      assert.ok(changed.length > 0, 'actual old init bypass should remain explicit evidence, not retroactive protection');
      assert.equal(JSON.parse(read(target, '.mdkg/config.json')).schema_version, force ? 1 : 2);
      rows.push({ scenario: 'published-0.5.2-init-is-not-retroactively-controlled', force, exit: r.status, changed, pass: true });
    }
    const diagnostic = clone(root, 'diagnostic');
    const manifest = JSON.parse(read(diagnostic, '.mdkg/graph.json')); manifest.writer_min = 99;
    fs.writeFileSync(path.join(diagnostic, '.mdkg/graph.json'), JSON.stringify(manifest));
    const before = inventory(diagnostic), r = run(diagnostic, ['validate', '--json']);
    assert.equal(r.status, 2); assert.ok(JSON.parse(r.stdout).errors.some(e => /unsupported/.test(e)));
    assert.deepEqual(inventory(diagnostic), before);
    rows.push({ scenario: 'console-diagnostics-read-only', pass: true });
  }
  const prior = path.join(owner, 'pre-fence-adopter'); fs.mkdirSync(prior);
  ok(prior, ['init', '--graph-only'], preFenceCli);
  const nodeBefore = json(prior, ['new', 'task', 'Pre-release adopter'], preFenceCli).node.path;
  migrate(prior, undefined, preFenceCli);
  assert.equal(JSON.parse(read(prior, '.mdkg/config.json')).schema_version, 1);
  const identityBefore = read(prior, nodeBefore), formatBefore = read(prior, '.mdkg/graph.json'), before = inventory(prior);
  const upgrade = json(prior, ['upgrade', '--only', '.mdkg/config.json']);
  assert.equal(upgrade.safe_to_apply, true, JSON.stringify(upgrade));
  assert.ok(upgrade.will_write_paths.includes('.mdkg/config.json'));
  assert.deepEqual(inventory(prior), before);
  json(prior, ['upgrade', '--only', '.mdkg/config.json', '--apply', '--plan-hash', upgrade.plan_hash]);
  assert.equal(JSON.parse(read(prior, '.mdkg/config.json')).schema_version, 2);
  assert.equal(read(prior, nodeBefore), identityBefore); assert.equal(read(prior, '.mdkg/graph.json'), formatBefore);
  rows.push({ scenario: 'actual-pre-fence-package-reviewed-upgrade', pass: true });
  for (const terminal of ['completed', 'recovered']) for (const change of ['operation', 'dependency']) {
    const target = clone(prior, `terminal-${terminal}-${change}`), mode = terminal === 'completed' ? '--resume' : '--recover';
    json(target, ['upgrade', mode, '--plan-hash', upgrade.plan_hash]);
    const stable = inventory(target);
    const repeat = json(target, ['upgrade', mode, '--plan-hash', upgrade.plan_hash]);
    assert.equal(repeat.recovery_state, terminal); assert.deepEqual(inventory(target), stable);
    const changed = change === 'operation' ? '.mdkg/config.json' : '.mdkg/graph.json';
    fs.appendFileSync(path.join(target, changed), '\n');
    const moved = inventory(target), r = run(target, ['upgrade', mode, '--plan-hash', upgrade.plan_hash]);
    assert.notEqual(r.status, 0); assert.match(r.stderr, /custody|dependency|collision|stale/);
    assert.deepEqual(inventory(target), moved);
    rows.push({ scenario: 'terminal-upgrade-repeat-binds-custody', terminal, change, pass: true });
  }
  return { owner, rows, boundary: 'CLI-only intermediate qualification; no killed-writer, final platform or security clearance' };
}
module.exports = { qualifyWriterAdmission };
