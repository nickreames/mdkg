const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const repo = path.resolve(__dirname, '../../../..');
const { createOwnedFixture, finalizeFixture } = require(path.join(repo, 'scripts/qualification-fixture'));
const { createSmokeCommands } = require(path.join(repo, 'scripts/qualification-smoke'));
const { withVerifiedArtifact } = require(path.join(repo, 'scripts/qualification-artifact'));
const expected = process.argv[2]; assert.match(expected || '', /^[a-f0-9]{64}$/);
const fixture = createOwnedFixture({ base: '/private/tmp', prefix: 'mdkg-recovery-admission-' });
let result, error;
try {
  const commands = createSmokeCommands(fixture, { ...process.env, PATH: path.dirname(process.execPath) + path.delimiter + process.env.PATH,
    npm_execpath: process.env.npm_execpath || '/opt/homebrew/lib/node_modules/npm/bin/npm-cli.js' });
  const pack = fixture.resolve('pack'), install = fixture.resolve('install'), graph = fixture.resolve('graph');
  for (const dir of [pack, install, graph]) fs.mkdirSync(dir);
  const output = commands.npm(['pack', repo, '--json', '--pack-destination', pack], { env: { NPM_CONFIG_OFFLINE: 'true' } }).stdout;
  const packed = JSON.parse(output.slice(output.lastIndexOf('\n[') + 1))[0];
  const tarball = path.join(pack, path.basename(packed.filename));
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(tarball)).digest('hex'), expected, 'supplement must use the identical qualified bytes');
  result = withVerifiedArtifact(tarball, expected, () => {
    commands.npm(['install', '--offline', '--prefix', install, tarball, '--foreground-scripts']);
    const cli = path.join(install, 'node_modules/mdkg/dist/cli.js');
    return JSON.parse(commands.node(path.join(__dirname, 'recovery-admission-worker.cjs'), [cli, graph], graph, { timeout: 120000 }).stdout);
  }).result;
  result.tarball_sha256 = expected; result.integrity = packed.integrity;
  result.scope = 'Targeted installed recovery admission supplement; previous combined families reused only for identical tarball bytes';
} catch (failure) { error = failure; }
const cleanup = finalizeFixture(fixture, { error });
console.log(JSON.stringify({ ...result, cleanup }, null, 2));
