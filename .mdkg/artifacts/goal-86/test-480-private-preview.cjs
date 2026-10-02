// Private current-graph rehearsal. No canonical mutation, migration apply,
// runtime database transfer, operational payload execution or public export.
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const repo = path.resolve(__dirname, '../../..');
const { createOwnedFixture, finalizeFixture } = require(path.join(repo, 'scripts/qualification-fixture'));
const { createSmokeCommands } = require(path.join(repo, 'scripts/qualification-smoke'));
const { copyVerifiedArtifact, withVerifiedArtifact } = require(path.join(repo, 'scripts/qualification-artifact'));
const { admitRetainedCandidate, captureQualificationInputs } = require(path.join(repo, 'scripts/retained-release-candidate'));
const { inventory } = require(path.join(repo, 'tests/fixtures/cache-freshness.cjs'));
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const base = path.join(__dirname, 'private/candidate-0.6.0-6154e4ea920bfa09');
const options = { tarball: base + '.tgz', sha256: '6154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca',
  inputs: base + '.package-inputs-dec100.json', inputsSha256: 'bcc8b6e1ec5aac804e20ef2fe6676ecfdfa8ae367f69e35a884b5b5980c8fe90' };
const admitted = admitRetainedCandidate(repo, options), harness = captureQualificationInputs(repo);
const driverHash = hash(fs.readFileSync(__filename));
const roots = ['.mdkg/config.json', '.mdkg/work', '.mdkg/design', '.mdkg/core',
  '.mdkg/archive', '.mdkg/templates', '.mdkg/skills'];
const config = JSON.parse(fs.readFileSync(path.join(repo, '.mdkg/config.json')));
for (const graph of Object.values(config.subgraphs || {})) for (const source of graph.sources || []) {
  assert(typeof source.path === 'string' && source.path.startsWith('.mdkg/bundles/') &&
    !source.path.split('/').some(x => x === '..' || x === '.'));
  roots.push(source.path);
}
function sourceInventory() {
  const result = [], seen = new Set(); let bytes = 0;
  function visit(relative) {
    if (seen.has(relative)) return; seen.add(relative);
    const file = path.join(repo, relative), stat = fs.lstatSync(file);
    assert.equal(fs.realpathSync(file), file, 'linked graph input refused');
    if (stat.isDirectory()) for (const name of fs.readdirSync(file).sort()) visit(relative + '/' + name);
    else {
      assert(stat.isFile() && stat.nlink === 1, 'nonregular/shared graph input refused');
      bytes += stat.size; assert(bytes <= 536870912 && result.length < 100000);
      result.push({ path: relative, sha256: hash(fs.readFileSync(file)), mode: stat.mode & 0o777, bytes: stat.size });
    }
  }
  for (const root of roots) visit(root);
  result.sort((a,b) => a.path.localeCompare(b.path));
  return { sha256: hash(JSON.stringify(result)), files: result, bytes };
}
const source = sourceInventory();
const fixture = createOwnedFixture({ base: '/private/tmp', prefix: 'mdkg-private-rehearsal-' });
const commands = createSmokeCommands(fixture, { ...process.env,
  npm_execpath: fs.realpathSync('/opt/homebrew/opt/node@24/bin/npm'),
  PATH: path.dirname(process.execPath) + path.delimiter + process.env.PATH });
let failure, installed, installedBefore, proof; const start = Date.now();
const verify = () => {
  admitRetainedCandidate(repo, options, { previous: admitted });
  assert.equal(captureQualificationInputs(repo).sha256, harness.sha256);
  assert.equal(hash(fs.readFileSync(__filename)), driverHash);
  assert.equal(sourceInventory().sha256, source.sha256, 'canonical graph input moved');
  if (installedBefore) assert.equal(inventory(installed), installedBefore);
};
try {
  const tarball = fixture.resolve('candidate.tgz'); copyVerifiedArtifact(options.tarball, tarball, options.sha256);
  const prefix = fixture.resolve('installed'); fs.mkdirSync(prefix);
  withVerifiedArtifact(tarball, options.sha256, () => commands.npm([
    'install', '--offline', '--prefix', prefix, tarball, '--foreground-scripts']));
  installed = path.join(prefix, 'node_modules/mdkg'); installedBefore = inventory(installed);
  const graph = fixture.resolve('graph'); fs.mkdirSync(graph, { mode: 0o700 });
  for (const row of source.files) {
    const target = path.join(graph, row.path); fs.mkdirSync(path.dirname(target), { recursive: true, mode: 0o700 });
    fs.copyFileSync(path.join(repo, row.path), target, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(target, 0o600);
    assert.equal(hash(fs.readFileSync(target)), row.sha256);
  }
  const before = inventory(graph), graphId = crypto.randomUUID(), origin = crypto.randomUUID();
  const args = ['graph', 'migrate', '--graph-id', graphId, '--origin', origin, '--json'];
  const result = commands.node(path.join(installed, 'dist/cli.js'), args, graph,
    { allowFailure: true, timeout: 300000 });
  assert([0,2].includes(result.status), result.stderr);
  const plan = JSON.parse(result.stdout);
  const blockers = plan.blocking || [];
  assert(blockers.some(value => String(value).includes('mdkg://goal-10')),
    'expected historical ambiguous reference must remain a migration blocker');
  assert.equal(plan.safe_to_apply, false);
  assert.equal(inventory(graph), before, 'preview modified the private graph copy');
  verify();
  const historical = source.files.find(row => row.path === '.mdkg/work/task-309-close-goal-10-evidence-and-confirm-publish-ready-not-published.md');
  assert.equal(historical.sha256, 'ec203c4bc774a84a30adb04864ae4fecfad6189e5242658a238aa53a676f3a93');
  proof = { command: args, exit_code: result.status, stdout_sha256: hash(result.stdout), stdout_bytes: Buffer.byteLength(result.stdout),
    stderr_sha256: hash(result.stderr), plan_hash: plan.plan_hash, safe_to_apply: plan.safe_to_apply,
    blockers, mapping_count: plan.mapping?.length, proposed_write_count: plan.writes?.length,
    preview_observational: true, canonical_preserved: true, historical_node_sha256: historical.sha256 };
} catch(error) { failure = error; }
const receipt = { schema_version:1, kind:'test480-current-private-migration-rehearsal', owner:'root:test-480',
  candidate_sha256:options.sha256, input_manifest_sha256:options.inputsSha256,
  package_inputs_sha256:admitted.package_inputs_sha256, harness_inputs_sha256:harness.sha256,
  graph_input_sha256:source.sha256, graph_files:source.files.length, graph_bytes:source.bytes,
  graph_roots:roots, excluded:'Derived indexes/caches, events, selection, runtime DB, artifact bodies and Git metadata are not graph authoring inputs and were not copied. Registered read-only graph bundles were copied byte-for-byte, never rebuilt or executed.',
  node:process.version, platform:process.platform, architecture:process.arch, driver_sha256:driverHash,
  duration_ms:Date.now()-start, proof,
  disposition:'Evidence-bound unsupported historical alias-shaped immutable reference; no mapping invention, canonical migration, historic rewrite or apply authorization.',
  limits:['Private local preview only; safe_to_apply=false is the expected preserved condition, not a successful migration claim.',
    'No Git ancestry is fabricated; this standalone-copy preview does not prove ancestry-grounded migration application.',
    'macOS only; family/platform/security/ladder/seal acceptance remains separate.'] };
try { const cleanup = finalizeFixture(fixture, { error: failure, verify });
  receipt.cleanup = { removed: cleanup.removed, owned_fixture_only:true }; receipt.pass = true;
} catch(error) { receipt.pass=false; receipt.error=error.message; process.exitCode=1; }
console.log(JSON.stringify(receipt));
