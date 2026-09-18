const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
function inventory(root) {
  const result = [];
  function visit(dir) { for (const name of fs.readdirSync(dir).sort()) {
    const file = path.join(dir, name), stat = fs.lstatSync(file);
    result.push([path.relative(root, file), stat.mode, stat.isFile() ? hash(fs.readFileSync(file)) :
      stat.isSymbolicLink() ? fs.readlinkSync(file) : 'directory']);
    if (stat.isDirectory()) visit(file);
  } } visit(root); return hash(JSON.stringify(result));
}

/** Native Git and installed CLI only; no source/internal package imports. */
function qualifyChangedWarnings({ cli, node = process.execPath, tempRoot, topologies = ['standalone', 'worktree', 'submodule', 'gitdir'], expectFixed = true }) {
  const owner = fs.mkdtempSync(path.join(tempRoot, 'changed-warning-'));
  const env = { PATH: path.dirname(node) + path.delimiter + process.env.PATH, LC_ALL: 'C', TMPDIR: owner,
    GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null', GIT_OPTIONAL_LOCKS: '0', GIT_TERMINAL_PROMPT: '0' };
  const native = (cwd, args) => {
    const result = spawnSync('git', ['--no-optional-locks', '-c', 'core.hooksPath=/dev/null', '-c', 'core.fsmonitor=false',
      '-c', 'user.name=mdkg fixture', '-c', 'user.email=fixture@example.invalid', ...args], { cwd, env, encoding: 'utf8', timeout: 30000 });
    assert.equal(result.error, undefined); assert.equal(result.status, 0, result.stderr); return result.stdout;
  };
  const invoke = (cwd, args, status = 0, overrideEnv = {}) => {
    const result = spawnSync(node, [cli, ...args], { cwd, env: { ...env, ...overrideEnv }, encoding: 'utf8', timeout: 60000, maxBuffer: 8e6 });
    assert.equal(result.error, undefined); assert.equal(result.status, status, `${args.join(' ')}\n${result.stdout}\n${result.stderr}`);
    return result;
  };
  const rows = [];
  for (const topology of topologies) for (const nested of [false, true]) {
    const scope = path.join(owner, topology + (nested ? '-nested' : '-root')); fs.mkdirSync(scope);
    const repo = path.join(scope, 'repo'); fs.mkdirSync(repo);
    let checkout = repo;
    if (topology === 'gitdir') native(scope, ['init', '--separate-git-dir=' + path.join(scope, 'metadata'), repo]);
    else native(repo, ['init', '-q']);
    native(repo, ['commit', '--allow-empty', '-qm', 'fixture root']);
    if (topology === 'worktree') {
      checkout = path.join(scope, 'linked'); native(repo, ['worktree', 'add', '-qb', 'fixture', checkout]);
    } else if (topology === 'submodule') {
      const host = path.join(scope, 'host'); fs.mkdirSync(host); native(host, ['init', '-q']);
      native(host, ['commit', '--allow-empty', '-qm', 'fixture host']);
      native(host, ['-c', 'protocol.file.allow=always', 'submodule', 'add', repo, 'child']);
      native(host, ['add', '--', '.gitmodules', 'child']); native(host, ['commit', '-qm', 'fixture submodule']);
      checkout = path.join(host, 'child');
    }
    // Git's prefix is raw text with a terminator; internal newlines/backslashes
    // are literal POSIX filename characters, not whitespace to trim/normalize.
    const root = nested ? path.join(checkout, 'nested project\\literal\nline') : checkout;
    fs.mkdirSync(root, { recursive: true }); invoke(root, ['init', '--agent']);
    const tasks = [];
    for (let id = 1; id <= 6; id++) tasks.push(JSON.parse(invoke(root, ['new', 'task', 'Warning path ' + id, '--json']).stdout).node);
    const names = ['ordinary.md', 'with space.md', 'with\nnewline.md', 'with\\literal.md', 'rename-before.md', 'unchanged.md'];
    const files = tasks.map((task, index) => {
      const file = '.mdkg/work/' + names[index], original = path.join(root, task.path), text = fs.readFileSync(original, 'utf8');
      const frontmatter = text.match(/^---\n[\s\S]*?\n---/); assert(frontmatter);
      fs.unlinkSync(original); fs.writeFileSync(path.join(root, file), frontmatter[0] + '\n'); return file;
    });
    // An unchanged graph error must still be emitted by changed-only validation.
    const unchanged = path.join(root, files[5]);
    const unchangedBody = fs.readFileSync(unchanged, 'utf8');
    assert.match(unchangedBody, /^relates: \[\]$/m);
    fs.writeFileSync(unchanged, unchangedBody.replace(/^relates: \[\]$/m, 'relates: [task-999]'));
    native(root, ['add', '--', '.']); native(root, ['commit', '-qm', 'synthetic graph']);
    for (const file of files.slice(0, 4)) fs.appendFileSync(path.join(root, file), '\nChanged without headings.\n');
    native(root, ['add', '--', files[0], files[1], files[2]]);
    const renamed = '.mdkg/work/renamed with\\literal\nline.md';
    native(root, ['mv', '--', files[4], renamed]);
    const prototype = fs.readFileSync(path.join(root, files[0]), 'utf8');
    const untracked = '.mdkg/work/untracked\\literal\nline.md', copied = '.mdkg/work/copied with space.md';
    fs.writeFileSync(path.join(root, untracked), prototype.replace('id: task-1\n', 'id: task-7\n'));
    fs.writeFileSync(path.join(root, copied), prototype.replace('id: task-1\n', 'id: task-8\n'));
    native(root, ['add', '--', copied]);
    native(root, ['config', 'status.renames', 'copies']);
    const rawStatus = native(root, ['status', '--porcelain=v1', '-z', '--untracked-files=all', '--', '.mdkg']);
    assert.match(rawStatus, /R  /, 'native staged rename positive control');
    const prefix = nested ? path.basename(root) + '/' : '';
    assert(rawStatus.includes(`C  ${prefix}${copied}\0${prefix}${files[0]}\0`), 'native copy source and destination positive control');
    const expectedPaths = [...files.slice(0, 4), files[4], renamed, untracked, copied].sort();
    const trackedCachePaths = native(root, ['ls-files', '-z', '--', '.mdkg/index']).split('\0').filter(Boolean);
    for (const cache of ['present', 'absent']) {
      if (cache === 'absent') fs.rmSync(path.join(root, '.mdkg/index'), { recursive: true });
      const casePaths = [...expectedPaths, ...(cache === 'absent' ? trackedCachePaths : [])].sort();
      const overrideEnv = { GIT_OPTIONAL_LOCKS: cache === 'present' ? '1' : undefined };
      const before = inventory(scope);
      const full = JSON.parse(invoke(root, ['validate', '--json'], 2, overrideEnv).stdout);
      const changed = JSON.parse(invoke(root, ['validate', '--changed-only', '--json'], 2, overrideEnv).stdout);
      assert.deepEqual(changed.errors, full.errors); assert(full.errors.some(error => error.includes('task-999')));
      assert.equal(inventory(scope), before, 'all checkout, host/worktree Git metadata and staging bytes unchanged');
      const expectedWarnings = full.warning_diagnostics.filter(w => w.path !== undefined && casePaths.includes(w.path));
      assert.equal(full.warning_diagnostics.filter(w => w.qid?.startsWith('root:task-')).length, 48);
      const actualPaths = changed.warning_filter.changed_paths;
      const missingPaths = casePaths.filter(file => !actualPaths.includes(file));
      const warningsMatch = JSON.stringify(changed.warning_diagnostics) === JSON.stringify(expectedWarnings);
      const pathsMatch = JSON.stringify(actualPaths) === JSON.stringify(casePaths);
      rows.push({ topology, nested, cache, caller_optional_locks: overrideEnv.GIT_OPTIONAL_LOCKS ?? 'unset',
        native_rename_and_copy: true, expected_paths: casePaths, changed_paths: actualPaths, missing_paths: missingPaths,
        expected_warnings: expectedWarnings.length, actual_warnings: changed.warning_diagnostics.length,
        warnings_match: warningsMatch, paths_match: pathsMatch, global_errors_preserved: true, inventory_unchanged: true });
    }
  }
  if (expectFixed) assert(rows.every(row => row.warnings_match && row.paths_match), JSON.stringify(rows));
  return { owner, runtime: process.version, platform: process.platform, arch: process.arch, cli_sha256: hash(fs.readFileSync(cli)), rows };
}
module.exports = { qualifyChangedWarnings };
