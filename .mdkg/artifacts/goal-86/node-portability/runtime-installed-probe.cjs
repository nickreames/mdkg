// Local intermediate qualification only. Not the final release ladder/seal.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const repo = path.resolve(__dirname, '../../../..');
const { createOwnedFixture, finalizeFixture } = require(path.join(repo, 'scripts/qualification-fixture'));
const { createSmokeCommands } = require(path.join(repo, 'scripts/qualification-smoke'));
const { runFixtureProcess } = require(path.join(repo, 'scripts/qualification-process'));
const { withVerifiedArtifact } = require(path.join(repo, 'scripts/qualification-artifact'));
const { assertNodeRuntime } = require(path.join(repo, 'dist/core/node_runtime'));
assertNodeRuntime();
const unsupportedNode = process.argv[2];
if (!unsupportedNode || !path.isAbsolute(unsupportedNode)) throw Error('provide an explicit local unsupported Node executable');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const inventory = root => {
  const result = {};
  const visit = dir => {
    for (const name of fs.readdirSync(dir).sort()) {
      const file = path.join(dir, name), stat = fs.lstatSync(file), rel = path.relative(root, file);
      if (stat.isDirectory()) { result[rel] = { kind: 'directory', mode: stat.mode }; visit(file); }
      else { assert(stat.isFile(), 'fixture must contain regular files'); result[rel] = { kind: 'file', mode: stat.mode, bytes: stat.size, sha256: hash(file) }; }
    }
  };
  visit(root); return result;
};
const fixture = createOwnedFixture({ base: '/private/tmp', prefix: 'mdkg-portable-installed-' });
let error, result;
try {
  const commands = createSmokeCommands(fixture, {
    ...process.env, PATH: path.dirname(process.execPath) + path.delimiter + process.env.PATH,
    npm_execpath: process.env.npm_execpath || '/opt/homebrew/lib/node_modules/npm/bin/npm-cli.js',
    npm_config_offline: 'true',
  });
  const pack = fixture.resolve('pack'), install = fixture.resolve('install'), graph = fixture.resolve('graph'), tests = fixture.resolve('tests');
  for (const dir of [pack, install, graph, tests]) fs.mkdirSync(dir);
  // Intermediate bytes only: bypass lifecycle hooks explicitly, never report
  // this as passing prepack/security/full-release acceptance.
  const packed = JSON.parse(commands.npm(['pack', repo, '--ignore-scripts', '--json', '--pack-destination', pack], { env: { NPM_CONFIG_OFFLINE: 'true' } }).stdout)[0];
  assert.equal(packed.version, '0.6.0');
  assert(packed.files.every(entry => !entry.path.startsWith('.mdkg/') && !/\.(node|dylib|so|exe)$/.test(entry.path)));
  const tarball = path.join(pack, path.basename(packed.filename)), sha256 = hash(tarball);
  const run = fn => withVerifiedArtifact(tarball, sha256, fn).result;
  run(() => commands.npm(['install', '--offline', '--ignore-scripts', '--prefix', install, tarball]));
  const installed = path.join(install, 'node_modules/mdkg'), cli = path.join(installed, 'dist/cli.js');
  const contract = JSON.parse(fs.readFileSync(path.join(installed, 'package.json')));
  assert.equal(contract.engines.node, '>=24.18.0 <25');
  const positive = [];
  for (const args of [
    ['init', '--graph-only'], ['new', 'task', 'Portable installed proof', '--json'],
    ['index'], ['validate', '--json'], ['db', 'init', '--json'],
    ['db', 'migrate', '--json'], ['db', 'verify', '--json'], ['db', 'stats', '--json'],
  ]) {
    const output = run(() => commands.node(cli, args, graph));
    positive.push({ command: args, exit_code: output.status });
  }
  const observed = run(() => commands.node(path.join(repo, 'dist/tests/core/sqlite_memory_observation.test.js'), [], graph,
    { nodeArgs: ['--test'], env: { MDKG_TEST_PACKAGE: installed, TMPDIR: tests } }));
  assert.match(observed.stdout, /(?:#|ℹ) tests 25/);
  assert.match(observed.stdout, /(?:#|ℹ) pass 25/);
  assert.match(observed.stdout, /(?:#|ℹ) fail 0/);
  const negative = [];
  const unsupportedVersion = runFixtureProcess(fixture.root, unsupportedNode, ['--version'], { cwd: graph, env: commands.environment }).stdout.trim();
  for (const args of [['init', '--graph-only'], ['index'], ['db', 'verify', '--json'], ['mcp', 'serve', '--stdio']]) {
    const before = inventory(graph);
    const output = run(() => runFixtureProcess(fixture.root, unsupportedNode, [cli, ...args], { cwd: graph, env: commands.environment }));
    assert.equal(output.status, 2);
    assert.match(output.stderr, /unsupported.*>=24\.18\.0 <25/);
    assert.deepEqual(inventory(graph), before);
    negative.push({ command: args, exit_code: output.status, complete_inventory_unchanged: true });
  }
  result = {
    schema_version: 1, status: 'INTERMEDIATE_INSTALLED_PASS_NOT_RELEASE_READY',
    runtime: process.version, platform: process.platform, arch: process.arch,
    tarball: { sha256, integrity: packed.integrity, files: packed.files.map(entry => entry.path).sort() },
    positive, installed_observer_tests: { tests: 25, pass: 25, fail: 0, skip: 0 },
    unsupported_runtime: unsupportedVersion, negative,
    limitations: ['prepack/postinstall lifecycle intentionally not exercised by this bounded probe', 'not final candidate, Linux, Windows, recovery, independent review, coverage or release seal'],
  };
} catch (failure) { error = failure; }
const cleanup = finalizeFixture(fixture, { error });
console.log(JSON.stringify({ ...result, cleanup }, null, 2));
