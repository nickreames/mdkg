import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { createOwnedFixture } = require('../scripts/qualification-fixture');
const { createSmokeCommands } = require('../scripts/qualification-smoke');
const { runCliOptionFixtures } = require('./fixtures/cli-options.cjs');
const repo = path.resolve(import.meta.dirname, '..');

function owned(t) {
  const fixture = createOwnedFixture({ base: process.env.MDKG_SMOKE_TMPDIR, prefix: 'cli-options-controller-' });
  t.after(() => fixture.cleanup());
  return fixture;
}

test('CLI option qualification requires its owned controller before graph writes', t => {
  const fixture = owned(t), packageRoot = fixture.resolve('package');
  fs.mkdirSync(packageRoot);
  const root = fixture.resolve('scenario');
  assert.throws(() => runCliOptionFixtures({ packageRoot, root }), /owned smoke controller/);
  assert.equal(fs.existsSync(root), false);
});

test('CLI option qualification refuses roots and packages outside its accepted fixture', t => {
  const parent = createOwnedFixture({ base: process.env.MDKG_SMOKE_TMPDIR, prefix: 'cli-options-parent-' });
  const fixture = createOwnedFixture({ base: parent.root, prefix: 'inner-' });
  t.after(() => { fixture.cleanup(); parent.cleanup(); });
  const commands = createSmokeCommands(fixture), packageRoot = fixture.resolve('package');
  fs.mkdirSync(packageRoot);
  const outside = parent.resolve('outside');
  assert.throws(() => runCliOptionFixtures({ ownedRoot: fixture.root, commands, packageRoot, root: outside }), /escapes/);
  assert.equal(fs.existsSync(outside), false);
  assert.throws(() => runCliOptionFixtures({ ownedRoot: fixture.root, commands, packageRoot: parent.root, root: fixture.resolve('scenario') }), /escapes/);
  assert.equal(fs.existsSync(fixture.resolve('scenario')), false);
});

test('CLI option qualification refuses a linked package path before graph writes', t => {
  const fixture = owned(t), commands = createSmokeCommands(fixture);
  const actual = fixture.resolve('actual'), packageRoot = fixture.resolve('package');
  fs.mkdirSync(actual); fs.symlinkSync(actual, packageRoot, 'dir');
  const root = fixture.resolve('scenario');
  assert.throws(() => runCliOptionFixtures({ ownedRoot: fixture.root, commands, packageRoot, root }), /link|directory/);
  assert.equal(fs.existsSync(root), false);
});

test('CLI option qualification refuses a different real controller before writes', t => {
  const first = owned(t), second = owned(t), commands = createSmokeCommands(first);
  const packageRoot = second.resolve('package'), root = second.resolve('scenario');
  fs.mkdirSync(packageRoot);
  const firstBefore = fs.readdirSync(first.root), secondBefore = fs.readdirSync(second.root);
  assert.throws(() => runCliOptionFixtures({ ownedRoot: second.root, commands, packageRoot, root }), /controller does not own/);
  assert.deepEqual(fs.readdirSync(first.root), firstBefore);
  assert.deepEqual(fs.readdirSync(second.root), secondBefore);
  assert.equal(fs.existsSync(root), false);
});

test('CLI option qualification refuses a released controller before writes', t => {
  const fixture = owned(t), commands = createSmokeCommands(fixture);
  const packageRoot = fixture.resolve('package'), root = fixture.resolve('scenario');
  fs.mkdirSync(packageRoot); fixture.cleanup();
  assert.throws(() => runCliOptionFixtures({ ownedRoot: fixture.root, commands, packageRoot, root }), /released/);
  assert.equal(fs.existsSync(fixture.root), false);
});

test('installed option coverage is part of the existing manifest-backed matrix smoke', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(repo, 'scripts/smoke-manifest.json')));
  const entry = manifest.aliases.find(row => row.alias === 'smoke:matrix');
  assert.equal(entry.entrypoint, 'scripts/smoke-command-matrix.js');
  assert(entry.prerequisites.includes('immutable_package_artifact'));
  const matrix = fs.readFileSync(path.join(repo, entry.entrypoint), 'utf8');
  assert.match(matrix, /runCliOptionFixtures\(/);
  assert.match(matrix, /option_qualification/);
  const fixture = fs.readFileSync(path.join(repo, 'tests/fixtures/cli-options.cjs'), 'utf8');
  assert.match(fixture, /commands\.git\(/);
  assert.match(fixture, /commands\.node\(/);
  assert.doesNotMatch(fixture, /spawnSync|node:child_process|\/usr\/bin\/git|\/dev\/null/);
});
