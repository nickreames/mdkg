const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { assertDirectoryChain, within } = require('../../scripts/qualification-output');

const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
function inventory(root) {
  const files = {};
  function walk(dir) {
    for (const name of fs.readdirSync(dir).sort()) {
      const file = path.join(dir, name), stat = fs.lstatSync(file, { bigint: true });
      files[path.relative(root, file)] = {
        kind: stat.isDirectory() ? 'directory' : stat.isSymbolicLink() ? 'symlink' : 'file',
        mode: String(stat.mode), uid: String(stat.uid), gid: String(stat.gid),
        ino: String(stat.ino), nlink: String(stat.nlink),
        mtime_ns: String(stat.mtimeNs), ctime_ns: String(stat.ctimeNs),
        sha256: stat.isFile() ? sha256(fs.readFileSync(file)) : undefined,
        target: stat.isSymbolicLink() ? fs.readlinkSync(file) : undefined,
      };
      if (stat.isDirectory()) walk(file);
    }
  }
  walk(root);
  return files;
}
function changed(before, after) {
  return [...new Set([...Object.keys(before), ...Object.keys(after)])]
    .filter(file => JSON.stringify(before[file]) !== JSON.stringify(after[file]));
}

function runCliOptionFixtures({ packageRoot, root, ownedRoot, commands }) {
  assert(commands && typeof commands.node === 'function' && typeof commands.git === 'function' &&
    typeof commands.assertOwned === 'function' && commands.environment &&
    typeof ownedRoot === 'string' && path.isAbsolute(ownedRoot),
  'CLI option qualification requires an explicit owned smoke controller');
  assert(commands.assertOwned() === ownedRoot && commands.fixtureRoot === ownedRoot,
    'CLI option qualification controller does not own the supplied fixture root');
  assert(path.isAbsolute(root) && path.isAbsolute(packageRoot));
  assert(root !== ownedRoot && within(ownedRoot, root) && packageRoot !== ownedRoot && within(ownedRoot, packageRoot),
    'CLI option fixture path escapes its accepted ownership root');
  assertDirectoryChain(ownedRoot);
  assertDirectoryChain(path.dirname(root));
  assertDirectoryChain(packageRoot);
  fs.mkdirSync(root, { recursive: false });
  const graph = path.join(root, 'graph'); fs.mkdirSync(graph);
  const cli = path.join(packageRoot, 'dist/cli.js');
  const contract = JSON.parse(fs.readFileSync(path.join(packageRoot, 'dist/command-contract.json'), 'utf8'));
  assert(Array.isArray(contract.option_admission), 'installed package lacks concrete option contract');
  const safeEnv = commands.environment;
  const invoke = (args, cwd = graph, env = safeEnv) => {
    const result = commands.node(cli, args, cwd, { env, allowFailure: true, timeout: 20000 });
    assert.equal(result.error, undefined, args.join(' '));
    assert.equal(result.signal, null, args.join(' '));
    return result;
  };
  const success = (args, cwd = graph) => {
    const result = invoke(args, cwd);
    assert.equal(result.status, 0, `${args.join(' ')}: ${result.stderr}`);
    return result;
  };
  success(['init']);
  // Init authors the graph scaffold; explicitly build caches before testing
  // observational verification and refusal against an already indexed graph.
  success(['index']);
  fs.writeFileSync(path.join(graph, 'preserve-unknown.txt'), 'synthetic user-owned sentinel\n', { flag: 'wx' });
  const git = args => {
    const result = commands.git(args, graph);
    assert.equal(result.status, 0, result.stderr);
  };
  git(['init', '-b', 'main']);
  git(['add', '--', 'preserve-unknown.txt']);
  git(['commit', '-m', 'fixture baseline']);
  fs.writeFileSync(path.join(graph, 'preserve-unknown.txt'), 'staged fixture bytes\n');
  git(['add', '--', 'preserve-unknown.txt']);
  fs.writeFileSync(path.join(graph, 'preserve-unknown.txt'), 'unstaged fixture bytes\n');

  const trapDir = path.join(root, 'traps'); fs.mkdirSync(trapDir);
  const marker = path.join(root, 'unexpected-subprocess');
  for (const name of ['git', 'ssh', 'gh', 'curl']) {
    fs.writeFileSync(path.join(trapDir, name), `#!${process.execPath}\nrequire('node:fs').appendFileSync(${JSON.stringify(marker)}, ${JSON.stringify(name + '\n')}); process.exit(93);\n`, { mode: 0o755, flag: 'wx' });
  }
  const trappedEnv = { ...safeEnv, PATH: [trapDir, path.dirname(process.execPath), safeEnv.PATH || ''].join(path.delimiter) };
  const rejected = [
    ...contract.option_admission.map(item => [...item.command.split(' '), '--unsupported-option']),
    ['index', '--verify', '--json'], ['index', '--json'],
    ['new', 'task', 'No create', '--dry-run'], ['task', 'done', 'task-1', '--dry-run'],
    ['goal', 'done', 'goal-1', '--dry-run'], ['upgrade', '--aply'],
    ['db', 'queue', 'ack', 'queue', 'message', '--paused'],
    ['db', 'queue', 'create', 'queue', '--lease-ms=100'],
    ['goal', 'clear', '--ws=child'], ['fix', 'ids', '--family=refs'],
    ['graph', 'refs', 'task-1', '--target=outside'], ['graph', 'migrate', '--xml'],
    ['new', 'task', 'No create', '--priority', '1bad'],
    ['new', 'task', 'No create', '--priority'], ['new', 'task', 'No create', '--priority='],
    ['new', 'task', 'No create', '-typo'],
    ['task', 'update', 'task-1', '--note', '--unknown-output'],
    ['search', 'query', '--limit=bad', '--limit=2'],
    ['upgrade', '--apply=bad', '--apply=false'], ['init', '--force', 'unexpected'],
    ['index', '--tolerant=maybe'], ['init', '--agent=maybe'],
    ['pack', '--list-profiles', '--out=discarded.md'],
    ['--root', '--mistyped'], ['--help', '--unsupported-option'], ['--version', '--unsupported-option'],
    ['validate', '--pricing-model=anything'], ['init', '--omni'],
    ['new', 'task', 'No create', '--receipt-kind=summary'],
    ['new', 'task', 'No create', '--cases=case-one'],
    ['new', 'task', 'No create', '--id=semantic'],
    ['new', 'rule', 'No create', '--priority=1'],
    ['new', 'rule', 'No create', '--status=todo'],
    ['new', 'rule', 'No create', '--parent=task-1'],
    ['new', 'rule', 'No create', '--skills=example'],
    ['new', 'task', 'No create', '--supersedes=dec-1'],
    ['new', 'work', 'No create', '--validation-policy-ref=policy://example'],
    ...['clone', 'fetch', 'push', 'materialize', 'closeout', 'push-ready'].map(command => ['git', command]),
  ];
  // The installed module's two public entrypoints must reject before even
  // asking for a cwd. The CLI process loop above also proves full filesystem
  // and executable-trap preservation around those refusals.
  const apiScript = `const assert=require('node:assert/strict');
    const {runCli,runCliAsync}=require(${JSON.stringify(cli)});
    (async()=>{let checked=0;
      for(const invoke of [runCli,runCliAsync]) for(const argv of ${JSON.stringify(rejected)}) {
        let cwdCalls=0;
        const code=await invoke(argv,{cwd:()=>{cwdCalls++;throw new Error('cwd must not be read');},log:()=>{},error:()=>{}});
        assert.equal(code,1,argv.join(' '));assert.equal(cwdCalls,0,argv.join(' '));checked++;
      }
      process.stdout.write(JSON.stringify({checked}));
    })().catch(error=>{console.error(error);process.exitCode=1;});`;
  const apiPath = path.join(root, 'installed-entrypoint-refusals.cjs');
  fs.writeFileSync(apiPath, apiScript, { flag: 'wx', mode: 0o600 });
  const before = inventory(root);
  const failures = [];
  for (const args of rejected) {
    const result = invoke(args, graph, trappedEnv);
    const changes = changed(before, inventory(root));
    if (result.status !== 1 || changes.length || fs.existsSync(marker)) {
      failures.push({ args, code: result.status, changes, stderr: result.stderr });
    }
  }
  assert.deepEqual(failures, []);
  const apiResult = commands.node(apiPath, [], graph, { env: trappedEnv, allowFailure: true, timeout: 20000 });
  assert.equal(apiResult.status, 0, apiResult.stderr);
  const entrypointRefusals = JSON.parse(apiResult.stdout).checked;
  assert.equal(entrypointRefusals, rejected.length * 2);
  assert.deepEqual(changed(before, inventory(root)), []);

  const cold = path.join(root, 'unindexed'); fs.mkdirSync(cold);
  success(['init', '--graph-only'], cold);
  const coldBefore = inventory(root);
  const coldCases = rejected.filter(args => args[0] === 'new' || args[0] === 'index');
  for (const args of coldCases) {
    const result = invoke(args, cold, trappedEnv);
    assert.equal(result.status, 1, `${args.join(' ')}: ${result.stderr}`);
    assert.deepEqual(changed(coldBefore, inventory(root)), [], args.join(' '));
  }

  const indexPath = path.join(graph, '.git/index');
  const stagedBefore = sha256(fs.readFileSync(indexPath));
  const positives = [];
  let snapshot = inventory(root);
  success(['db', 'index', 'verify', '--json']);
  assert.deepEqual(changed(snapshot, inventory(root)), []);
  positives.push('db-index-verify-is-observational');
  snapshot = inventory(root);
  success(['index', '--tolerant=false']);
  assert(changed(snapshot, inventory(root)).some(file => file.includes('.mdkg/index/')));
  positives.push('explicit-index-still-rebuilds');
  const created = JSON.parse(success(['new', 'task', 'CLI positive control', '--priority=2', '--json']).stdout);
  const id = created.node?.qid ?? created.node?.id ?? created.qid ?? created.id;
  assert(id, JSON.stringify(created));
  success(['task', 'start', id, '--note=--json', '--json']);
  const shown = JSON.parse(success(['show', id, '-w', 'ROOT', '--json']).stdout);
  assert.match(JSON.stringify(shown), /CLI positive control/);
  assert.match(JSON.stringify(shown), /progress/);
  positives.push('new-task-lifecycle-and-show-alias');
  const manifest = JSON.parse(success(['new', 'manifest', 'Generic manifest control',
    '--id=agent.option-control', '--contract-profile=generic', '--json']).stdout);
  assert.equal(manifest.node.id, 'agent.option-control');
  const testNode = JSON.parse(success(['new', 'test', 'Case option control', '--cases=case-one', '--json']).stdout);
  assert.equal(testNode.node.type, 'test');
  positives.push('type-specific-manifest-and-test-options');
  const literal = JSON.parse(success(['new', 'task', '--json', '--', '--pricing-model', '-literal']).stdout);
  assert.match(JSON.stringify(literal), /--pricing-model -literal/);
  positives.push('explicit-positional-terminator');
  const alternate = path.join(root, 'flag-first-init'); fs.mkdirSync(alternate);
  success(['--agent', 'init'], alternate);
  assert(fs.existsSync(path.join(alternate, 'AGENTS.md')));
  positives.push('boolean-agent-before-init');
  success(['help', 'init', '--agent']);
  success(['init', '--agent', '--help']);
  success(['init', '--agent', 'true', '--help']);
  success(['init', '--agent', 'false', '--help']);
  positives.push('agent-overload-help-and-legacy-separate-booleans');
  assert.equal(sha256(fs.readFileSync(indexPath)), stagedBefore);
  assert.equal(fs.readFileSync(path.join(graph, 'preserve-unknown.txt'), 'utf8'), 'unstaged fixture bytes\n');
  assert.equal(fs.existsSync(marker), false);
  return { kind: 'installed-cli-option-qualification', runtime: process.version,
    platform: process.platform, architecture: process.arch,
    package_version: contract.package_version, cli_sha256: sha256(fs.readFileSync(cli)),
    command_contract_hash: contract.contract_hash, concrete_commands: contract.option_admission.length,
    rejected_cases: rejected.length, rejection_failures: failures,
    installed_entrypoint_refusals: entrypointRefusals,
    unindexed_graph_refusals: coldCases.length,
    inventory_entry_count: Object.keys(before).length,
    inventory_sha256: sha256(JSON.stringify(before)),
    subprocess_traps: ['git', 'ssh', 'gh', 'curl'], subprocess_calls: 0,
    subprocess_evidence_scope: 'zero hits on the four PATH executable traps; not universal process instrumentation',
    inventory_scope: 'complete option-qualification subtree including its graph and native Git metadata',
    positive_controls: positives, git_index_preserved: true, unknown_file_preserved: true,
    final_artifact_qualification: false };
}
module.exports = { runCliOptionFixtures };
