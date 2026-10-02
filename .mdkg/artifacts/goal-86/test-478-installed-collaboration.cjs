// Test478 local qualification. One retained installed artifact; not a release seal.
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const repo = path.resolve(__dirname, '../../..');
const { createOwnedFixture } = require(path.join(repo, 'scripts/qualification-fixture'));
const { createSmokeCommands } = require(path.join(repo, 'scripts/qualification-smoke'));
const { acceptOwnedGitFixture } = require(path.join(repo, 'scripts/qualification-git'));
const { runFixtureNode, runFixtureProcess } = require(path.join(repo, 'scripts/qualification-process'));
const { verifyArtifactFile, copyVerifiedArtifact, withVerifiedArtifact } = require(path.join(repo, 'scripts/qualification-artifact'));
const { exerciseIdentityCollaboration } = require(path.join(repo, 'scripts/installed-identity-collaboration'));
const { qualifyGitObservation } = require(path.join(repo, 'tests/fixtures/git-observation.cjs'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const digest = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const expected = process.env.MDKG_EXPECTED_CANDIDATE_SHA256;
assert.match(expected || '', /^[a-f0-9]{64}$/); assert(process.env.MDKG_REAL_NPM);
const selectedFamily = process.env.MDKG_TEST478_FAMILY || 'all';
assert(['all', 'linked'].includes(selectedFamily), 'unsupported qualification family');
const candidate = path.join(__dirname, 'private', `candidate-0.6.0-${expected.slice(0, 16)}.tgz`);
const capture = candidate.replace(/\.tgz$/, '.inputs.json'), captureHash = hash(capture);
const captured = JSON.parse(fs.readFileSync(capture)); assert.equal(captured.sha256, expected);
const drivers = [__filename, path.join(__dirname, 'test-478-installed-worker.cjs')].map(file => ({ file, sha256: hash(file) }));
const sourceCheck = () => {
  for (const row of captured.source_inputs.files) {
    const file = path.join(repo, row.path); assert.equal(hash(file), row.sha256, row.path);
    assert.equal(fs.lstatSync(file).mode & 0o777, row.mode);
  }
  for (const row of drivers) assert.equal(hash(row.file), row.sha256);
};
sourceCheck(); verifyArtifactFile(candidate, expected); verifyArtifactFile(capture, captureHash);
const fixture = createOwnedFixture({ base: '/private/tmp', prefix: 'mdkg-collaboration-' });
const commands = createSmokeCommands(fixture, { ...process.env, npm_execpath: process.env.MDKG_REAL_NPM,
  PATH: path.dirname(process.execPath) + path.delimiter + process.env.PATH });
const fixtureGit = acceptOwnedGitFixture(fixture.root, commands.environment);
const inventory = root => {
  const out = {};
  const walk = dir => { for (const name of fs.readdirSync(dir).sort()) {
    const file = path.join(dir, name), stat = fs.lstatSync(file), relative = path.relative(root, file);
    assert(!stat.isSymbolicLink(), `unexpected linked fixture file ${relative}`);
    out[relative] = stat.isDirectory() ? ['directory', stat.mode] : ['file', stat.mode, hash(file)];
    if (stat.isDirectory()) walk(file);
  } }; walk(root); return out;
};
const completed = [], started = new Date().toISOString();
try {
  const tarball = fixture.resolve('candidate.tgz'); copyVerifiedArtifact(candidate, tarball, expected);
  const prefix = fixture.resolve('installed'); fs.mkdirSync(prefix);
  withVerifiedArtifact(candidate, expected, () => withVerifiedArtifact(tarball, expected,
    () => commands.npm(['install', '--offline', '--prefix', prefix, tarball, '--foreground-scripts'], { env: { NPM_CONFIG_OFFLINE: 'true' } })));
  const installed = path.join(prefix, 'node_modules/mdkg'), cli = path.join(installed, 'dist/cli.js');
  assert.equal(JSON.parse(fs.readFileSync(path.join(installed, 'package.json'))).engines.node, '>=24.18.0 <25');
  const installedBefore = inventory(installed);
  function family(name, callback) {
    const begin = performance.now(); sourceCheck(); assert.deepEqual(inventory(installed), installedBefore);
    const proof = withVerifiedArtifact(capture, captureHash, () => withVerifiedArtifact(candidate, expected, callback));
    sourceCheck(); assert.deepEqual(inventory(installed), installedBefore);
    const row = { name, duration_ms: performance.now() - begin, proof: proof.result.result,
      artifact_verification: proof.result.verification, capture_verification: proof.verification };
    completed.push(row); console.log(JSON.stringify({ event: 'family-passed', name, duration_ms: row.duration_ms })); return row.proof;
  }
  const git = (cwd, args, allowFailure = false) => commands.git(args, cwd, { allowFailure });
  const g = (cwd, args) => git(cwd, args).stdout.trim();
  const run = (cwd, args, allowFailure = false, options = {}) => commands.node(cli, args, cwd, { allowFailure, ...options });
  const json = (cwd, args) => JSON.parse(run(cwd, [...args, '--json']).stdout);
  const write = (root, relative, bytes) => { const file = path.join(root, relative); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, bytes); };
  const commit = (root, paths, message) => { if (paths.length) g(root, ['add', '--', ...paths]); g(root, ['commit', '-m', message]); return g(root, ['rev-parse', 'HEAD']); };
  const refuse = (base, cwd, args, pattern) => { const before = inventory(base), result = run(cwd, [...args, '--json'], true);
    assert.notEqual(result.status, 0); assert.match(result.stderr + result.stdout, pattern);
    assert.deepEqual(inventory(base), before); return { exit_code: result.status, diagnostic_sha256: digest(result.stderr + result.stdout) }; };
  if (selectedFamily === 'all') {
    family('existing-installed-identity-collaboration', () => exerciseIdentityCollaboration(cli, fixture.root));
    family('existing-installed-git-observation', () => {
      const { results, ...summary } = qualifyGitObservation({ cli, tempRoot: fixture.root });
      // Bind the complete case ledger without duplicating hundreds of hash rows.
      return { ...summary, results_sha256: digest(results), result_count: results.length,
        all_case_custody_checks_passed: results.every(row => row.exact_indexes_preserved && row.staged_entries_preserved && row.filesystem_bookend_preserved) };
    });
  }
  family('linked-worktree-concurrency-recovery-integration', () => {
    const base = fixture.resolve('linked'), seed = path.join(base, 'seed'), control = path.join(base, 'control');
    fs.mkdirSync(seed, { recursive: true }); fs.mkdirSync(control);
    run(seed, ['init', '--graph-only']); json(seed, ['db', 'init']); json(seed, ['db', 'migrate']);
    const configuration = path.join(seed, '.mdkg/config.json'), config = JSON.parse(fs.readFileSync(configuration));
    config.index.backend = 'sqlite'; config.index.lock_timeout_ms = 50;
    fs.writeFileSync(configuration, JSON.stringify(config, null, 2) + '\n');
    const migrate = ['graph', 'migrate', '--graph-id', crypto.randomUUID(), '--origin', crypto.randomUUID()];
    const migration = json(seed, migrate); assert.deepEqual(migration.blocking, []);
    json(seed, [...migrate, '--apply', '--plan-hash', migration.plan_hash]);
    const common = json(seed, ['new', 'task', 'Shared worktree ancestor']).node;
    const goal = json(seed, ['new', 'goal', 'Checkout-local selection']).node;
    write(seed, 'src/features.cjs', "module.exports = ['base'];\n");
    g(seed, ['init', '-b', 'main']);
    const ancestor = commit(seed, ['.gitignore', '.mdkg/config.json', '.mdkg/graph.json', '.mdkg/core', '.mdkg/templates', '.mdkg/work', '.mdkg/db/schema', 'src/features.cjs'], 'common graph and source');
    const left = path.join(base, 'left'), right = path.join(base, 'right');
    g(seed, ['worktree', 'add', '-b', 'developer-a', left]); g(seed, ['worktree', 'add', '-b', 'developer-b', right]);
    const descriptions = [left, right].map(root => fixtureGit.describe(root));
    assert.equal(descriptions[0].common, descriptions[1].common); assert.notEqual(descriptions[0].gitDir, descriptions[1].gitDir);
    const index = root => path.resolve(root, g(root, ['rev-parse', '--git-path', 'index']));
    const graphId = root => JSON.parse(fs.readFileSync(path.join(root, '.mdkg/graph.json'))).graph_id;
    assert.equal(graphId(left), graphId(right)); assert(graphId(left));
    for (const root of [left, right]) { json(root, ['db', 'init']); json(root, ['db', 'migrate']); json(root, ['goal', 'activate', goal.id]); }
    let sequence = 0;
    const worker = path.join(__dirname, 'test-478-installed-worker.cjs');
    function workerRun(spec) {
      const file = path.join(control, `job-${++sequence}.json`);
      fs.writeFileSync(file, JSON.stringify({ root: fixture.root, cli, ...spec }), { flag: 'wx', mode: 0o600 });
      return JSON.parse(commands.node(worker, [file], fixture.root, { timeout: 90000 }).stdout);
    }
    function heldJob(cwd, args, gate) {
      const id = ++sequence, preload = path.join(control, `hold-${id}.json`), ready = path.join(control, `ready-${id}.json`);
      fs.writeFileSync(preload, JSON.stringify({ mode: 'hold', root: fixture.root, cwd, ready, gate }), { flag: 'wx', mode: 0o600 });
      return { cwd, args, ready, preload };
    }
    const gate = path.join(control, 'parallel-release');
    const concurrent = workerRun({ mode: 'parallel', gate, jobs: [left, right].map(cwd => heldJob(cwd, ['new', 'task', 'Parallel authored task', '--refs', common.id], gate)) });
    const [a, b] = concurrent.rows.map(row => row.node);
    assert.equal(a.id, b.id); assert.equal(a.path, b.path); assert.notEqual(a.stable_ref, b.stable_ref);
    for (const [root, node] of [[left, a], [right, b]]) assert(fs.readFileSync(path.join(root, node.path), 'utf8').includes(common.stable_ref));
    const exclusionGate = path.join(control, 'exclusion-release');
    const exclusion = workerRun({ mode: 'exclusion', gate: exclusionGate,
      holder: heldJob(left, ['new', 'task', 'Active left writer'], exclusionGate),
      competitor: { cwd: left, args: ['new', 'task', 'Refused second writer'] },
      peer: { cwd: right, args: ['new', 'task', 'Independent right writer'] } });
    const linked = json(right, ['new', 'task', 'Cross-linked contribution', '--parent', b.id, '--refs', common.id + ',' + b.id]).node;
    assert(fs.readFileSync(path.join(right, linked.path), 'utf8').includes(b.stable_ref));
    const editsGate = path.join(control, 'edits-release');
    const edits = workerRun({ mode: 'parallel', gate: editsGate, jobs: [
      heldJob(left, ['task', 'update', common.stable_ref, '--status', 'progress'], editsGate),
      heldJob(right, ['task', 'update', common.stable_ref, '--status', 'done'], editsGate),
    ] });
    for (const [root, queue] of [[left, 'left'], [right, 'right']]) {
      json(root, ['db', 'queue', 'create', queue]); json(root, ['db', 'queue', 'enqueue', queue, 'one', '--payload-json', '{"synthetic":true}']);
      run(root, ['index']);
    }
    const localStates = ['.mdkg/index/mdkg.sqlite', '.mdkg/state/selected-goal.json', '.mdkg/db/runtime/project.sqlite'];
    for (const relative of localStates) assert.notEqual(fs.statSync(path.join(left, relative)).ino, fs.statSync(path.join(right, relative)).ino);
    g(right, ['add', '--', b.path]);
    fs.appendFileSync(path.join(right, b.path), '\nUnstaged authored evidence.\n');
    const observational = [];
    for (const backend of ['json', 'sqlite']) {
      const original = [left, right].map(root => fs.readFileSync(path.join(root, '.mdkg/config.json')));
      for (const root of [left, right]) { const cfg = JSON.parse(fs.readFileSync(path.join(root, '.mdkg/config.json'))); cfg.index.backend = backend;
        write(root, '.mdkg/config.json', JSON.stringify(cfg, null, 2) + '\n'); run(root, ['index']); }
      for (const warmth of ['warm', 'cold']) {
        const saved = [left, right].map((root, i) => ({ from: path.join(root, '.mdkg/index'), to: path.join(control, `cache-${backend}-${i}`) }));
        if (warmth === 'cold') for (const row of saved) fs.renameSync(row.from, row.to);
        const before = inventory(base), gitIndexes = [hash(index(left)), hash(index(right))];
        for (const [root, node] of [[left, a], [right, b], [right, linked]]) for (const command of [
          ['show', node.stable_ref], ['list', '--type', 'task'], ['search', node.title], ['validate'], ['git', 'inspect'],
        ]) {
          const output = runFixtureNode(fixture.root, cli, ['--root', root, ...command, '--json'], {
            cwd: fixture.root, env: { ...commands.environment, GIT_OPTIONAL_LOCKS: '1' }, timeout: 30000 });
          assert.equal(output.status, 0, output.stderr); const value = JSON.parse(output.stdout);
          if (command[0] === 'show') assert.equal(value.item.stable_ref, node.stable_ref);
          if (command[0] === 'validate') assert.equal(value.ok, true);
          observational.push({ backend, warmth, checkout: path.basename(root), command: command[0], explicit_root: true, optional_locks: '1' });
        }
        assert.deepEqual(inventory(base), before); assert.deepEqual([hash(index(left)), hash(index(right))], gitIndexes);
        if (warmth === 'cold') for (const row of saved) { assert(!fs.existsSync(row.from)); fs.renameSync(row.to, row.from); }
      }
      for (let i = 0; i < 2; i++) write([left, right][i], '.mdkg/config.json', original[i]);
    }
    for (const [root, timeout, feature] of [[left, 200, 'target'], [right, 300, 'incoming']]) {
      const cfg = JSON.parse(fs.readFileSync(path.join(root, '.mdkg/config.json'))); cfg.index.lock_timeout_ms = timeout;
      write(root, '.mdkg/config.json', JSON.stringify(cfg, null, 2) + '\n');
      write(root, 'src/features.cjs', `module.exports = ['base', '${feature}'];\n`); write(root, `${feature}-only.txt`, `${feature}\n`);
    }
    const external = 'external-receipt.json', externalBytes = JSON.stringify({ subject: b.stable_ref, evidence: 'synthetic immutable receipt' }) + '\n';
    write(right, external, externalBytes); write(left, 'unknown-user.txt', 'preserve unknown user bytes\n');
    const targetHead = commit(left, [a.path, exclusion.owner.node.path, common.path, goal.path, '.mdkg/config.json', 'src/features.cjs', 'target-only.txt'], 'target graph and source');
    const incoming = commit(right, [b.path, linked.path, exclusion.peer.node.path, common.path, goal.path, external, '.mdkg/config.json', 'src/features.cjs', 'incoming-only.txt'], 'incoming graph and source');
    const args = ['graph', 'reconcile', '--ancestor', ancestor, '--incoming', incoming];
    const conflict = json(left, args); assert(conflict.blocking.length); assert(conflict.classifications.find(row => row.stable_ref === common.stable_ref).conflicts.includes('status'));
    refuse(base, left, [...args, '--apply', '--plan-hash', conflict.plan_hash], /conflict|decision|blocking/i);
    write(left, 'decision.json', JSON.stringify({ [common.stable_ref]: { take: 'target', reason: 'Retain reviewed target lifecycle while separately integrating source and config.' } }));
    const approvedArgs = [...args, '--decisions', 'decision.json'];
    const plan = json(left, approvedArgs); assert.deepEqual(plan.blocking, []);
    const symbolicArgs = ['graph', 'reconcile', '--ancestor', ancestor, '--incoming', 'developer-b', '--decisions', 'decision.json'];
    const symbolicPlan = json(left, symbolicArgs);
    write(right, 'later-incoming.txt', 'later sibling commit, separately reviewed\n');
    const newerIncoming = commit(right, ['later-incoming.txt'], 'advance sibling after review');
    refuse(base, left, [...symbolicArgs, '--apply', '--plan-hash', symbolicPlan.plan_hash], /stale|hash/i);
    assert.equal(json(left, approvedArgs).plan_hash, plan.plan_hash, 'exact pinned incoming must remain stable');
    write(right, 'decision.json', JSON.stringify({ [common.stable_ref]: { take: 'target', reason: 'Retain right lifecycle during independent recovery-isolation fixture.' } }));
    const rightArgs = ['graph', 'reconcile', '--ancestor', ancestor, '--incoming', targetHead, '--decisions', 'decision.json'];
    const rightPlan = json(right, rightArgs); assert.deepEqual(rightPlan.blocking, []);
    for (const [cwd, params, reviewed] of [[left, approvedArgs, plan], [right, rightArgs, rightPlan]]) {
      const preload = path.join(control, `kill-${++sequence}.json`);
      fs.writeFileSync(preload, JSON.stringify({ mode: 'kill', root: fixture.root, cwd, targets: reviewed.writes.map(row => row.path) }), { flag: 'wx', mode: 0o600 });
      workerRun({ mode: 'kill', job: { cwd, args: [...params, '--apply', '--plan-hash', reviewed.plan_hash], preload } });
      assert(fs.existsSync(path.join(cwd, '.mdkg/index/write.lock/owner.json')));
    }
    const approve = (cwd, reviewed, mode) => { const before = inventory(base), result = json(cwd, ['graph', 'recover', reviewed.plan_hash]);
      assert.deepEqual(inventory(base), before); assert.equal(result.recovery[mode].ready, true, JSON.stringify(result)); return result.recovery[mode].lock_evidence; };
    const leftEvidence = approve(left, plan, 'resume'), rightEvidence = approve(right, rightPlan, 'rollback');
    refuse(base, right, ['graph', 'recover', rightPlan.plan_hash, '--rollback', '--lock-evidence', leftEvidence, '--confirm-quiescent'], /stale|hash|evidence/i);
    const rightPaused = inventory(right), rightIndex = hash(index(right));
    json(left, ['graph', 'recover', plan.plan_hash, '--resume', '--lock-evidence', leftEvidence, '--confirm-quiescent']);
    assert.deepEqual(inventory(right), rightPaused); assert.equal(hash(index(right)), rightIndex);
    write(right, '.mdkg/index/write.lock/unknown-user-note', 'unknown lock contents must survive\n');
    refuse(base, right, ['graph', 'recover', rightPlan.plan_hash, '--rollback', '--lock-evidence', rightEvidence, '--confirm-quiescent'], /unknown|incomplete|custody/i);
    fs.unlinkSync(path.join(right, '.mdkg/index/write.lock/unknown-user-note')); // Only the exact synthetic file authored above.
    const leftRecovered = inventory(left), leftIndex = hash(index(left));
    json(right, ['graph', 'recover', rightPlan.plan_hash, '--rollback', '--lock-evidence', approve(right, rightPlan, 'rollback'), '--confirm-quiescent']);
    assert.deepEqual(inventory(left), leftRecovered); assert.equal(hash(index(left)), leftIndex);
    assert(!fs.existsSync(path.join(left, '.mdkg/index/write.lock'))); assert(!fs.existsSync(path.join(right, '.mdkg/index/write.lock')));
    assert.notEqual(json(left, ['show', b.stable_ref]).item.id, b.id);
    const semantic = commit(left, plan.writes.map(row => row.path), 'reviewed exact graph result after owned recovery');
    const graphPaths = [...new Set([...g(left, ['ls-files', '.mdkg/work']).split('\n'), ...g(right, ['ls-files', '.mdkg/work']).split('\n'), '.mdkg/graph.json', ...plan.writes.map(row => row.path)])].filter(Boolean);
    assert(!graphPaths.includes('.mdkg/config.json'), 'configuration is separately reviewed, never blanket graph ours');
    const reviewedGraph = new Map(graphPaths.map(relative => [relative, fs.existsSync(path.join(left, relative)) ? fs.readFileSync(path.join(left, relative)) : null]));
    const reviewedConfig = fs.readFileSync(path.join(right, '.mdkg/config.json'));
    const mergedSource = "module.exports = ['base', 'target', 'incoming'];\n";
    const merge = git(left, ['merge', '--no-ff', '--no-commit', incoming], true); assert.equal(merge.status, 1, merge.stderr);
    const conflicts = [...new Set(g(left, ['ls-files', '--unmerged', '-z']).split('\0').filter(Boolean).map(row => row.slice(row.indexOf('\t') + 1)))];
    assert(conflicts.includes('.mdkg/config.json')); assert(conflicts.includes('src/features.cjs')); assert(conflicts.includes(a.path));
    // An unresolved JSON config is rejected before Git-stage inspection. Resolve
    // only its reviewed working bytes, leaving every Git stage unresolved, then
    // independently exercise the semantic graph command's Git-stage fence.
    refuse(base, left, approvedArgs, /failed to read config/i);
    write(left, '.mdkg/config.json', reviewedConfig);
    refuse(base, left, approvedArgs, /unmerged|unresolved|conflict/i);
    assert(conflicts.every(relative => reviewedGraph.has(relative) || ['.mdkg/config.json', 'src/features.cjs'].includes(relative)));
    for (const [relative, bytes] of reviewedGraph) {
      const file = path.join(left, relative);
      if (bytes === null) { if (fs.existsSync(file)) { assert(fs.lstatSync(file).isFile()); fs.unlinkSync(file); } }
      else write(left, relative, bytes);
    }
    write(left, '.mdkg/config.json', reviewedConfig); write(left, 'src/features.cjs', mergedSource);
    g(left, ['add', '--', ...graphPaths, '.mdkg/config.json', 'src/features.cjs']);
    assert.equal(g(left, ['ls-files', '--unmerged', '-z']), '');
    const allowedMerge = new Set([...graphPaths, '.mdkg/config.json', 'src/features.cjs', 'incoming-only.txt', external]);
    const stagedPaths = g(left, ['diff', '--cached', '--name-only']).split('\n').filter(Boolean);
    assert(stagedPaths.every(relative => allowedMerge.has(relative)), JSON.stringify(stagedPaths));
    assert.equal(fs.readFileSync(path.join(left, external), 'utf8'), externalBytes);
    assert.equal(fs.readFileSync(path.join(left, 'unknown-user.txt'), 'utf8'), 'preserve unknown user bytes\n');
    const sourceTest = path.join(control, 'source-test.cjs');
    fs.writeFileSync(sourceTest, "require('node:assert/strict').deepEqual(require(process.argv[2]), ['base','target','incoming']);\n");
    commands.node(sourceTest, [path.join(left, 'src/features.cjs')], base);
    run(left, ['index']); assert.equal(json(left, ['validate']).ok, true);
    const mergeHead = commit(left, [], 'native ancestry-preserving source plus graph integration');
    g(left, ['merge-base', '--is-ancestor', semantic, mergeHead]); g(left, ['merge-base', '--is-ancestor', incoming, mergeHead]);
    const repeatBefore = inventory(base);
    refuse(base, left, approvedArgs, /stale|unnecessary/i);
    const replay = json(left, args); assert.equal(replay.replay.noop, true); assert.deepEqual(replay.writes, []);
    json(left, [...args, '--apply', '--plan-hash', replay.plan_hash]); assert.deepEqual(inventory(base), repeatBefore);
    assert.equal(fs.readFileSync(path.join(right, external), 'utf8'), externalBytes);
    // A native worktree retention lock is not mdkg execution ownership.
    const binding = fixtureGit.describe(seed);
    const lockArgs = ['--no-optional-locks', '-c', 'core.fsmonitor=false', ...binding.prefix, 'worktree', 'lock', '--reason', 'synthetic retention only', left];
    const locked = runFixtureProcess(fixture.root, 'git', lockArgs, { cwd: seed, env: fixtureGit.environment, timeout: 30000 });
    assert.equal(locked.status, 0, locked.stderr);
    const retention = path.join(fixtureGit.describe(left).gitDir, 'locked'), retentionHash = hash(retention);
    const retentionNode = json(left, ['new', 'task', 'Writer under native retention lock']).node;
    assert(retentionNode.stable_ref); assert.equal(hash(retention), retentionHash);
    return { graph_id: graphId(left), ancestor, target: targetHead, incoming, newer_incoming: newerIncoming, semantic_commit: semantic, merge_commit: mergeHead,
      simultaneous_creation: concurrent.simultaneous_owned_locks, same_identity_parallel_edits: edits.simultaneous_owned_locks,
      alias_collision: a.id, distinct_stable_identities: [a.stable_ref, b.stable_ref], exclusion,
      local_states: localStates, observations: observational, pinned_input_stability: true, advanced_symbolic_ref_refused: true,
      two_actual_sigkill_journals: true, cross_checkout_approval_refused: true, peer_journal_lock_and_index_preserved: true,
      unknown_lock_file_refused_without_cleanup: true, unresolved_git_stages_refused: true,
      native_conflicts: conflicts, graph_resolution_paths: graphPaths, configuration_resolution: 'explicit incoming configuration; not semantic graph overwrite',
      merged_source_sha256: hash(path.join(left, 'src/features.cjs')), staged_merge_paths: stagedPaths, ancestry_and_replay: true, stale_decision_reuse_refused: true,
      external_receipt_sha256: crypto.createHash('sha256').update(externalBytes).digest('hex'), native_retention_lock_is_not_writer_lease: true,
      limitations: ['Newer incoming source-only commit remains intentionally unmerged; old reviewed incoming was pinned.', 'Submodule-backed linked worktree mutation is not inferred from observational submodule coverage.'] };
  });
  sourceCheck(); verifyArtifactFile(candidate, expected); verifyArtifactFile(capture, captureHash);
  console.log(JSON.stringify({ kind: 'test478-local-installed-collaboration', started_at: started, runtime: process.version,
    platform: process.platform, arch: process.arch, candidate_sha256: expected, input_capture_sha256: captureHash,
    source_inputs_sha256: captured.source_inputs.sha256, selected_family: selectedFamily, drivers, completed, cleanup: fixture.cleanup(), final_artifact_pass: false }));
} catch (error) {
  console.error(JSON.stringify({ kind: 'test478-local-installed-collaboration-failure', fixture_retained: fixture.root,
    completed, message: error.stack || error.message })); process.exitCode = 1;
}
