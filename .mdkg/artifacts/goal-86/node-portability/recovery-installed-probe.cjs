// Task841 intermediate installed-byte evidence. Not the final release seal.
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const repo = path.resolve(__dirname, '../../../..');
const { createOwnedFixture, finalizeFixture } = require(path.join(repo, 'scripts/qualification-fixture'));
const { createSmokeCommands } = require(path.join(repo, 'scripts/qualification-smoke'));
const { withVerifiedArtifact } = require(path.join(repo, 'scripts/qualification-artifact'));
const { exerciseInstalledGraphRecovery } = require(path.join(repo, 'scripts/installed-graph-recovery'));
const { qualifyInterruptedWriter } = require(path.join(repo, 'tests/fixtures/interrupted-writer.cjs'));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const fixture = createOwnedFixture({ base: '/private/tmp', prefix: 'mdkg-portable-recovery-installed-' });
let error, result;
try {
  const commands = createSmokeCommands(fixture, { ...process.env,
    PATH: path.dirname(process.execPath) + path.delimiter + process.env.PATH,
    npm_execpath: process.env.npm_execpath || '/opt/homebrew/lib/node_modules/npm/bin/npm-cli.js',
  });
  const pack = fixture.resolve('pack'), install = fixture.resolve('install');
  fs.mkdirSync(pack); fs.mkdirSync(install);
  // Normal prepack/postinstall are exercised, but are not the full release gate.
  const packedOutput = commands.npm(['pack', repo, '--json', '--pack-destination', pack], { env: { NPM_CONFIG_OFFLINE: 'true' } }).stdout;
  // npm may prepend successful lifecycle stdout before its final JSON array.
  const packedRows = JSON.parse(packedOutput.slice(packedOutput.lastIndexOf('\n[') + 1));
  assert(Array.isArray(packedRows) && packedRows.length === 1);
  const packed = packedRows[0];
  assert.equal(packed.version, '0.6.0');
  assert(packed.files.every(entry => !entry.path.startsWith('.mdkg/') && !/\.(node|dylib|so|exe)$/.test(entry.path)));
  const tarball = path.join(pack, path.basename(packed.filename)), sha256 = hash(tarball);
  const run = callback => withVerifiedArtifact(tarball, sha256, callback).result;
  run(() => commands.npm(['install', '--offline', '--prefix', install, tarball, '--foreground-scripts']));
  const installed = path.join(install, 'node_modules/mdkg'), cli = path.join(installed, 'dist/cli.js');
  const trap = fixture.resolve('forbid-os-probes.cjs'), attempted = fixture.resolve('os-probe-attempts.jsonl');
  fs.writeFileSync(attempted, '', { flag: 'wx', mode: 0o600 });
  fs.writeFileSync(trap, `const fs=require('node:fs'),cp=require('node:child_process'),path=require('node:path');
const append=fs.appendFileSync;
const reject=detail=>{append(${JSON.stringify(attempted)},JSON.stringify({detail})+'\\n');throw Error('forbidden OS dependency: '+detail);};
for(const name of ['openSync','readFileSync','readlinkSync','statSync','lstatSync','existsSync']){const original=fs[name];fs[name]=function(file,...args){if(typeof file==='string'&&/^\\/(proc(?:\\/|$)|dev\\/fd(?:\\/|$))/.test(file))reject(name+':'+file);return original.call(this,file,...args);};}
for(const name of ['spawnSync','spawn','execSync','execFileSync']){const original=cp[name];cp[name]=function(command,...args){if(path.basename(String(command))!=='git')reject(name+':'+command);return original.call(this,command,...args);};}
for(const name of ['getuid','geteuid'])if(process[name])process[name]=()=>reject(name);
`, { flag: 'wx', mode: 0o600 });
  const started = performance.now(), nodeArgs = ['--require', trap];
  const caught = run(() => exerciseInstalledGraphRecovery(cli, fixture.root, commands.environment, { nodeArgs }));
  const killed = run(() => qualifyInterruptedWriter({ cli, node: process.execPath, tempRoot: fixture.root, nodeArgs }));
  assert.equal(fs.readFileSync(attempted, 'utf8'), '', 'even swallowed OS probe attempts invalidate this proof');
  result = {
    schema_version: 1, status: 'INTERMEDIATE_INSTALLED_RECOVERY_PASS_NOT_RELEASE_READY',
    runtime: process.version, platform: process.platform, arch: process.arch,
    tarball: { sha256, integrity: packed.integrity, files: packed.files.map(entry => entry.path).sort() },
    installed_caught_error_cases: caught.cases, installed_sigkill_cases: killed.rows,
    recovery_duration_ms: performance.now() - started,
    prepack_postinstall: 'passed', os_probe_attempts: 0,
    probe_hashes: {
      admission_preload: hash(trap), caught_error_preload: caught.fault_preload_sha256,
      sigkill_preload: killed.fixture_preload_sha256,
    },
    limitations: ['Intermediate macOS arm64 artifact only; not final candidate, Linux or Windows qualification',
      'Operator assertions are fixture-owned intent, not OS proof or authentication',
      'Deferred Bugs46/47 remain unresolved; no claim of ACL or ancestor-race hardening',
      'No full-suite coverage, independent security acceptance or final artifact seal'],
  };
} catch (failure) { error = failure; }
const cleanup = finalizeFixture(fixture, { error });
console.log(JSON.stringify({ ...result, cleanup }, null, 2));
