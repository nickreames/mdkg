// Test489: one installed artifact, local intermediate qualification, no release seal.
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const repo = path.resolve(__dirname, '../../../..');
const { createOwnedFixture, finalizeFixture } = require(path.join(repo, 'scripts/qualification-fixture'));
const { createSmokeCommands } = require(path.join(repo, 'scripts/qualification-smoke'));
const { withVerifiedArtifact } = require(path.join(repo, 'scripts/qualification-artifact'));
const { exerciseInstalledGraphRecovery } = require(path.join(repo, 'scripts/installed-graph-recovery'));
const { qualifyInterruptedWriter } = require(path.join(repo, 'tests/fixtures/interrupted-writer.cjs'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const inventory = root => {
  const out = {};
  const walk = dir => { for (const name of fs.readdirSync(dir).sort()) {
    const file = path.join(dir, name), stat = fs.lstatSync(file), rel = path.relative(root, file);
    out[rel] = stat.isDirectory() ? ['directory', stat.mode] : stat.isSymbolicLink() ? ['link', fs.readlinkSync(file)] : ['file', stat.mode, hash(file)];
    if (stat.isDirectory()) walk(file);
  } };
  walk(root); return out;
};
const fixture = createOwnedFixture({ base: '/private/tmp', prefix: 'mdkg-portable-combined-' });
let error, result;
try {
  const commands = createSmokeCommands(fixture, { ...process.env,
    PATH: path.dirname(process.execPath) + path.delimiter + process.env.PATH,
    npm_execpath: process.env.npm_execpath || '/opt/homebrew/lib/node_modules/npm/bin/npm-cli.js',
  });
  const dirs = Object.fromEntries(['pack', 'install', 'tests', 'scratch'].map(name => [name, fixture.resolve(name)]));
  for (const dir of Object.values(dirs)) fs.mkdirSync(dir);
  // Preserve only compiled test drivers before normal prepack rebuild removes them.
  // Every implementation require and CLI process below resolves the installed package.
  fs.mkdirSync(path.join(dirs.tests, 'core')); fs.mkdirSync(path.join(dirs.tests, 'helpers'));
  const drivers = ['core/sqlite_memory_observation.test.js', 'core/sqlite_observation.test.js', 'helpers/fs.js'];
  const driverHashes = drivers.map(name => {
    const original = path.join(repo, 'dist/tests', name), destination = path.join(dirs.tests, name);
    fs.copyFileSync(original, destination, fs.constants.COPYFILE_EXCL);
    return { path: 'dist/tests/' + name, sha256: hash(destination) };
  });
  const packedOutput = commands.npm(['pack', repo, '--json', '--pack-destination', dirs.pack], { env: { NPM_CONFIG_OFFLINE: 'true' } }).stdout;
  const rows = JSON.parse(packedOutput.slice(packedOutput.lastIndexOf('\n[') + 1));
  assert.equal(rows.length, 1); const packed = rows[0]; assert.equal(packed.version, '0.6.0');
  assert(packed.files.every(row => !row.path.startsWith('.mdkg/') && !/\.(node|dylib|so|exe)$/.test(row.path)));
  const tarball = path.join(dirs.pack, path.basename(packed.filename)), sha256 = hash(tarball);
  const verified = callback => withVerifiedArtifact(tarball, sha256, callback).result;
  verified(() => commands.npm(['install', '--offline', '--prefix', dirs.install, tarball, '--foreground-scripts']));
  const installed = path.join(dirs.install, 'node_modules/mdkg'), cli = path.join(installed, 'dist/cli.js');
  assert.equal(JSON.parse(fs.readFileSync(path.join(installed, 'package.json'))).engines.node, '>=24.18.0 <25');
  const installedManifest = packed.files.map(row => ({ path: row.path, sha256: hash(path.join(installed, row.path)) }));
  const assertInstalled = () => { for (const row of installedManifest) assert.equal(hash(path.join(installed, row.path)), row.sha256, row.path); };
  const family = callback => verified(() => { assertInstalled(); const value = callback(); assertInstalled(); return value; });
  const trap = fixture.resolve('forbid-product-os-probes.cjs'), attempted = fixture.resolve('os-attempts.jsonl');
  fs.writeFileSync(attempted, '', { flag: 'wx', mode: 0o600 });
  fs.writeFileSync(trap, `const fs=require('node:fs'),cp=require('node:child_process'),path=require('node:path');
const append=fs.appendFileSync,product=${JSON.stringify(installed + path.sep)};
const inProduct=()=>String(new Error().stack).includes(product);
const reject=detail=>{append(${JSON.stringify(attempted)},JSON.stringify({detail})+'\\n');throw Error('forbidden product OS dependency: '+detail);};
for(const name of ['openSync','readFileSync','readlinkSync','statSync','lstatSync','existsSync']){const original=fs[name];fs[name]=function(file,...args){if(typeof file==='string'&&/^\\/(proc(?:\\/|$)|dev\\/fd(?:\\/|$))/.test(file)&&inProduct())reject(name+':'+file);return original.call(this,file,...args);};}
for(const name of ['spawnSync','spawn','execSync','execFileSync']){const original=cp[name];cp[name]=function(command,...args){if(path.basename(String(command))!=='git'&&inProduct())reject(name+':'+command);return original.call(this,command,...args);};}
for(const name of ['getuid','geteuid'])if(process[name]){const original=process[name];process[name]=function(){if(inProduct())reject(name);return original.call(this);};}
`, { flag: 'wx', mode: 0o600 });
  const options = { nodeArgs: ['--require', trap], env: { MDKG_TEST_PACKAGE: installed, TMPDIR: dirs.scratch, TEMP: dirs.scratch, TMP: dirs.scratch, NODE_OPTIONS: '--require=' + trap } };
  const worktrees = family(() => {
    const base = fixture.resolve('worktrees'); fs.mkdirSync(base);
    const seed = path.join(base, 'seed'); fs.mkdirSync(seed);
    const git = (cwd, args, allowFailure = false) => commands.git(args, cwd, { allowFailure });
    const g = (cwd, args) => git(cwd, args).stdout.trim();
    const run = (cwd, args, allowFailure = false) => commands.node(cli, args, cwd, { ...options, allowFailure });
    const json = (cwd, args) => JSON.parse(run(cwd, [...args, '--json']).stdout);
    const commit = (cwd, paths, title) => { if (paths.length) g(cwd, ['add', '--', ...paths]); g(cwd, ['commit', '-m', title]); return g(cwd, ['rev-parse', 'HEAD']); };
    run(seed, ['init', '--graph-only']); json(seed, ['db', 'init']); json(seed, ['db', 'migrate']);
    const configFile = path.join(seed, '.mdkg/config.json'), config = JSON.parse(fs.readFileSync(configFile));
    config.index.backend = 'sqlite'; config.index.lock_timeout_ms = 1; fs.writeFileSync(configFile, JSON.stringify(config, null, 2) + '\n');
    const migrationArgs = ['graph', 'migrate', '--graph-id', crypto.randomUUID(), '--origin', crypto.randomUUID()];
    const migration = json(seed, migrationArgs); assert.deepEqual(migration.blocking, []);
    json(seed, [...migrationArgs, '--apply', '--plan-hash', migration.plan_hash]);
    const common = json(seed, ['new', 'task', 'Shared worktree ancestor']).node;
    const goal = json(seed, ['new', 'goal', 'Local fixture selection']).node;
    g(seed, ['init', '-b', 'main']);
    const ancestor = commit(seed, ['.gitignore', '.mdkg/config.json', '.mdkg/graph.json', '.mdkg/core', '.mdkg/templates', '.mdkg/work', '.mdkg/db/schema'], 'synthetic worktree ancestor');
    const left = path.join(base, 'left'), right = path.join(base, 'right');
    g(seed, ['worktree', 'add', '-b', 'developer-a', left]);
    g(seed, ['worktree', 'add', '-b', 'developer-b', right]);
    const indexPath = cwd => path.resolve(cwd, g(cwd, ['rev-parse', '--git-path', 'index']));
    const leftIndex = indexPath(left), rightIndex = indexPath(right);
    assert.notEqual(leftIndex, rightIndex);
    for (const cwd of [left, right]) { json(cwd, ['db', 'init']); json(cwd, ['db', 'migrate']); json(cwd, ['goal', 'activate', goal.id]); }
    const a = json(left, ['new', 'task', 'Developer A uncommitted node']).node;
    let b;
    const { withMutationLock } = require(path.join(installed, 'dist/util/lock'));
    withMutationLock(left, 100, () => {
      const before = inventory(left);
      const busy = run(left, ['new', 'task', 'Must refuse competing writer'], true);
      assert.notEqual(busy.status, 0); assert.match(busy.stderr, /mutation lock/); assert.deepEqual(inventory(left), before);
      b = json(right, ['new', 'task', 'Developer B independent node']).node;
      assert.deepEqual(inventory(left), before, 'another checkout writer changed left-owned state');
    });
    assert.equal(a.id, b.id); assert.notEqual(a.stable_ref, b.stable_ref);
    const linked = json(right, ['new', 'task', 'Developer B cross-link', '--refs', common.id + ',' + b.id]).node;
    assert(fs.readFileSync(path.join(right, linked.path), 'utf8').includes(b.stable_ref));
    for (const [cwd, queue] of [[left, 'left'], [right, 'right']]) {
      json(cwd, ['db', 'queue', 'create', queue]);
      json(cwd, ['db', 'queue', 'enqueue', queue, 'one', '--payload-json', '{"synthetic":true}']);
      json(cwd, ['db', 'queue', 'claim', queue, '--lease-owner', queue, '--lease-ms', '60000']);
      json(cwd, ['db', 'queue', 'ack', queue, 'one', '--lease-owner', queue]);
      json(cwd, ['db', 'snapshot', 'seal']); json(cwd, ['db', 'snapshot', 'verify']);
      run(cwd, ['index']); json(cwd, ['db', 'index', 'verify']);
    }
    const states = ['.mdkg/index/mdkg.sqlite', '.mdkg/state/selected-goal.json', '.mdkg/db/runtime/project.sqlite'];
    for (const relative of states) assert.notEqual(fs.statSync(path.join(left, relative)).ino, fs.statSync(path.join(right, relative)).ino);
    g(right, ['add', '--', b.path]);
    const indices = [hash(leftIndex), hash(rightIndex)], beforeReads = inventory(base);
    for (const [cwd, node] of [[left, a], [right, b], [right, linked]]) {
      assert.equal(json(cwd, ['show', node.stable_ref]).item.stable_ref, node.stable_ref);
      json(cwd, ['status']); json(cwd, ['validate']);
    }
    assert.deepEqual(inventory(base), beforeReads); assert.deepEqual([hash(leftIndex), hash(rightIndex)], indices);
    const external = 'external-evidence.json', externalBytes = JSON.stringify({ subject: b.stable_ref, evidence: 'synthetic immutable receipt' }) + '\n';
    fs.writeFileSync(path.join(right, external), externalBytes); fs.writeFileSync(path.join(right, 'feature.txt'), 'incoming source remains separate\n');
    const incoming = commit(right, [b.path, linked.path, goal.path, external, 'feature.txt'], 'incoming cross-linked work');
    commit(left, [a.path, goal.path], 'independent target work');
    const args = ['graph', 'reconcile', '--ancestor', ancestor, '--incoming', incoming];
    const beforePreview = inventory(base), plan = json(left, args); assert.deepEqual(plan.blocking, []);
    assert.deepEqual(inventory(base), beforePreview); const staged = hash(leftIndex);
    json(left, [...args, '--apply', '--plan-hash', plan.plan_hash]); assert.equal(hash(leftIndex), staged);
    assert.notEqual(json(left, ['show', b.stable_ref]).item.id, b.id);
    const semantic = commit(left, plan.writes.map(row => row.path), 'reviewed exact mdkg reconciliation');
    // Review the complete union of tracked graph paths, then resolve only those
    // paths to the exact reviewed result. Never use blanket ours for .mdkg.
    const union = [...new Set([...g(left, ['ls-files', '.mdkg']).split('\n'), ...g(right, ['ls-files', '.mdkg']).split('\n')])].filter(Boolean);
    const reviewed = new Map(union.map(relative => { const file = path.join(left, relative); return [relative, fs.existsSync(file) ? fs.readFileSync(file) : null]; }));
    const merge = git(left, ['merge', '--no-ff', '--no-commit', incoming], true); assert([0, 1].includes(merge.status), merge.stderr);
    const conflicts = [...new Set(g(left, ['ls-files', '--unmerged', '-z']).split('\0').filter(Boolean).map(row => row.slice(row.indexOf('\t') + 1)))];
    assert(conflicts.every(relative => reviewed.has(relative)), 'unreviewed non-graph conflict');
    for (const [relative, bytes] of reviewed) {
      const file = path.join(left, relative);
      if (bytes === null) { if (fs.existsSync(file)) { assert(fs.lstatSync(file).isFile()); fs.unlinkSync(file); } }
      else { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, bytes); }
    }
    const changed = g(left, ['diff', '--name-only']).split('\n').filter(Boolean);
    if (changed.length) g(left, ['add', '--', ...changed]);
    assert.equal(g(left, ['ls-files', '--unmerged', '-z']), '');
    assert.equal(fs.readFileSync(path.join(left, external), 'utf8'), externalBytes);
    assert.equal(fs.readFileSync(path.join(left, 'feature.txt'), 'utf8'), 'incoming source remains separate\n');
    run(left, ['index']); json(left, ['validate']);
    const mergeHead = commit(left, [], 'native ancestry-preserving integration');
    g(left, ['merge-base', '--is-ancestor', semantic, mergeHead]); g(left, ['merge-base', '--is-ancestor', incoming, mergeHead]);
    const replayBefore = inventory(base), replay = json(left, args);
    assert.equal(replay.replay.noop, true); assert.deepEqual(replay.writes, []);
    json(left, [...args, '--apply', '--plan-hash', replay.plan_hash]); assert.deepEqual(inventory(base), replayBefore);
    assert.equal(fs.readFileSync(path.join(right, external), 'utf8'), externalBytes);
    return { linked_worktrees: 2, backend: 'sqlite', common_ancestor: ancestor, incoming, semantic_commit: semantic, merge_commit: mergeHead,
      aliases_collide: true, stable_identities_differ: true, cross_links_preserved: true, per_checkout_states: states,
      same_checkout_exclusion: true, other_checkout_writer_succeeds_while_lock_held: true, reads_and_staging_preserved: true,
      native_merge_conflicts: conflicts, exact_reviewed_graph_preserved: true, source_and_external_evidence_preserved: true, ancestry_and_repeat_integration_verified: true };
  });
  console.error('PORTABILITY_PHASE worktrees passed');
  const testFamilies = [];
  for (const [file, expected] of [['sqlite_memory_observation.test.js', 25], ['sqlite_observation.test.js', 61]]) {
    const started = performance.now();
    const output = family(() => commands.node(path.join(dirs.tests, 'core', file), [], dirs.scratch,
      { ...options, nodeArgs: ['--test', '--test-reporter=tap', '--require', trap], timeout: 180000 }));
    const count = name => Number(output.stdout.match(new RegExp('^# ' + name + ' (\\d+)$', 'm'))?.[1]);
    assert.equal(count('tests'), expected); assert.equal(count('pass'), expected);
    assert.equal(count('fail'), 0); assert.equal(count('skipped'), 0);
    testFamilies.push({ file, tests: expected, pass: expected, fail: 0, skipped: 0, duration_ms: performance.now() - started });
    console.error('PORTABILITY_PHASE ' + file + ' passed ' + expected);
  }
  const resourceWorker = fixture.resolve('memory-resource-worker.cjs');
  fs.writeFileSync(resourceWorker, `const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const [installed,file,expected]=process.argv.slice(2),size=fs.statSync(file).size;
const sqlite=require('node:sqlite'),Native=sqlite.DatabaseSync,original=Native.prototype.deserialize,alloc=Buffer.alloc;
let image_allocations=0,image_bytes=0,deserializations=0,deserialize_input_bytes=0;
Buffer.alloc=function(bytes,...args){if(bytes===size){image_allocations++;image_bytes+=bytes;}return alloc(bytes,...args);};
Native.prototype.deserialize=function(image){deserializations++;deserialize_input_bytes+=image.byteLength;return original.call(this,image);};
const observe=require(path.join(installed,'dist/core/sqlite_observation')).withSelectedSqliteObservation;
const before=process.memoryUsage(),peakBefore=process.resourceUsage().maxRSS,started=performance.now();
const row=observe(file,db=>db.prepare('SELECT length(value) AS bytes FROM sample').get());
assert.equal(row.bytes,Number(expected));assert.equal(image_allocations,1);assert.equal(deserializations,1);
console.log(JSON.stringify({file_bytes:size,payload_bytes:Number(expected),duration_ms:performance.now()-started,image_allocations,image_bytes,deserializations,deserialize_input_bytes,memory_before:before,memory_after:process.memoryUsage(),maxRSS_before:peakBefore,maxRSS_after:process.resourceUsage().maxRSS}));
`, { flag: 'wx', mode: 0o600 });
  const resourceCases = family(() => [1, 16, 64].map(mib => {
    const scope = fixture.resolve('memory-' + mib); fs.mkdirSync(scope);
    const file = path.join(scope, 'fixture.sqlite'), bytes = mib * 1024 * 1024;
    const db = new (require('node:sqlite').DatabaseSync)(file);
    try { db.exec('CREATE TABLE sample(value BLOB)'); db.prepare('INSERT INTO sample VALUES(zeroblob(?))').run(bytes); }
    finally { db.close(); }
    const before = inventory(scope);
    const output = commands.node(resourceWorker, [installed, file, String(bytes)], scope, options);
    assert.deepEqual(inventory(scope), before);
    return { ...JSON.parse(output.stdout), complete_inventory_unchanged: true };
  }));
  console.error('PORTABILITY_PHASE memory measurements passed');
  const startedRecovery = performance.now();
  const caught = family(() => exerciseInstalledGraphRecovery(cli, fixture.root, commands.environment, { nodeArgs: options.nodeArgs }));
  console.error('PORTABILITY_PHASE caught-error recovery passed ' + caught.cases.length);
  const killed = family(() => qualifyInterruptedWriter({ cli, node: process.execPath, tempRoot: fixture.root, nodeArgs: options.nodeArgs }));
  const recoveryDuration = performance.now() - startedRecovery;
  console.error('PORTABILITY_PHASE real-kill recovery passed ' + killed.rows.length);
  assert.equal(fs.readFileSync(attempted, 'utf8'), '', 'swallowed product OS probes still invalidate proof');
  result = { schema_version: 1, status: 'LOCAL_INSTALLED_PORTABILITY_PASS_NOT_FINAL_RELEASE',
    runtime: process.version, platform: process.platform, arch: process.arch,
    tarball: { sha256, integrity: packed.integrity, files: installedManifest },
    driver_hashes: driverHashes, test_families: testFamilies, resource_cases: resourceCases,
    installed_caught_error_cases: caught.cases, installed_sigkill_cases: killed.rows, recovery_duration_ms: recoveryDuration,
    worktrees, prepack_postinstall: 'passed', os_probe_attempts: 0,
    limitations: ['Local macOS arm64 only; Linux final qualification remains Test487; Windows unqualified',
      'Intermediate candidate, not full coverage, independent security acceptance, full release ladder or sealed release artifact',
      'One JavaScript image and one deserialize call measured; native allocator copies and concurrent OOM are not bounded by these measurements',
      'Bugs46/47 remain deferred and unresolved; operator intent is not authentication or proof of hostile-filesystem safety'] };
} catch (failure) { error = failure; }
const cleanup = finalizeFixture(fixture, { error });
console.log('MDKG_COMBINED_RESULT\n' + JSON.stringify({ ...result, cleanup }, null, 2));
