// Actual offline prepack/build/readiness proof with root dependencies only.
// This is a qualification harness, not the final package ladder or security scan.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const repo = path.resolve(__dirname, '../../..');
const { createOwnedFixture, finalizeFixture } = require(path.join(repo, 'scripts/qualification-fixture'));
const candidate = require(path.join(repo, 'scripts/retained-release-candidate'));
const { verifyArtifactFile, assertSameArtifact } = require(path.join(repo, 'scripts/qualification-artifact'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const tarball = path.join(repo, '.mdkg/artifacts/goal-86/private/candidate-0.6.0-6154e4ea920bfa09.tgz');
const sha256 = '6154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca';
const before = verifyArtifactFile(tarball, sha256);
const packageInputs = candidate.capturePackageInputs(repo);
const harnessInputs = candidate.captureQualificationInputs(repo);
const fixture = createOwnedFixture({ base: '/private/tmp', prefix: 'mdkg-package-gates-' });
const started = Date.now();
let failure, receipt;
try {
  const root = fixture.resolve('repository'); fs.mkdirSync(root);
  const copy = relative => {
    const destination = path.join(root, relative);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.cpSync(path.join(repo, relative), destination, { recursive: true, verbatimSymlinks: true });
  };
  for (const file of packageInputs.files) copy(file.path);
  for (const relative of ['scripts', 'tests', 'node_modules', 'docs/_generated', '.npmignore',
    '.github/workflows/release-readiness.yml', 'security/v0.5.0-remediation-matrix.json',
    'examples/demo-agentic-coding/.mdkg', 'examples/template-mdkg-dev/.mdkg',
    '.mdkg/bundles/private/examples/demo-agentic-coding.mdkg.zip',
    '.mdkg/bundles/private/examples/template-mdkg-dev.mdkg.zip']) copy(relative);
  for (const name of fs.readdirSync(path.join(repo, '.mdkg/work'))) {
    if (/^task-(76[4-9]|77[0-3])-/.test(name)) copy('.mdkg/work/' + name);
  }
  for (const site of ['docs', 'mdkg-dev']) assert.equal(fs.existsSync(path.join(root, site, 'node_modules')), false);
  const npm = fs.realpathSync('/opt/homebrew/opt/node@24/bin/npm');
  const env = { ...process.env, PATH: path.dirname(process.execPath) + path.delimiter + process.env.PATH,
    MDKG_RELEASE_SCOPE: 'package', NPM_CONFIG_OFFLINE: 'true', npm_config_offline: 'true',
    NPM_CONFIG_CACHE: fixture.resolve('npm-cache'), npm_config_cache: fixture.resolve('npm-cache'),
    NPM_CONFIG_REGISTRY: 'http://127.0.0.1:9', npm_config_registry: 'http://127.0.0.1:9',
    NPM_CONFIG_USERCONFIG: fixture.resolve('empty-npmrc'), NPM_CONFIG_GLOBALCONFIG: fixture.resolve('empty-global-npmrc'),
    NPM_CONFIG_AUDIT: 'false', NPM_CONFIG_FUND: 'false', TMPDIR: fixture.resolve('tmp') };
  fs.mkdirSync(env.TMPDIR); fs.writeFileSync(env.NPM_CONFIG_USERCONFIG, ''); fs.writeFileSync(env.NPM_CONFIG_GLOBALCONFIG, '');
  const result = fixture.runNode([npm, 'run', 'prepack', '--offline'], { cwd: root, env, timeout: 120000, maxBuffer: 4 * 1024 * 1024 });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.deepEqual(candidate.builtPayload(root), candidate.archivePayload(tarball, sha256));
  for (const site of ['docs', 'mdkg-dev']) {
    assert.equal(fs.existsSync(path.join(root, site, 'node_modules')), false);
    assert.equal(fs.existsSync(path.join(root, site, 'dist')), false);
  }
  receipt = { schema_version: 1, owner: 'root:task-843', test: 'root:test-490',
    kind: 'isolated-package-prepack-qualification', ok: true, node: process.version,
    platform: process.platform, architecture: process.arch, duration_ms: Date.now() - started,
    artifact_sha256: sha256, package_inputs_sha256: packageInputs.sha256,
    qualification_inputs_sha256: harnessInputs.sha256,
    command: 'npm run prepack --offline', package_scope: true, website_dependency_trees: 0,
    website_builds: 0, installed_or_downloaded_dependencies: false, payload_files: candidate.builtPayload(root).length,
    new_tarball_created: false, original_artifact_preserved: true,
    stdout_sha256: hash(result.stdout), stderr_sha256: hash(result.stderr),
    limits: ['Local macOS build/prepack evidence only', 'Not the full37-smoke ladder',
      'Historical matrix verification is not fresh independent security acceptance'] };
} catch (error) { failure = error; }
const cleanup = finalizeFixture(fixture, { error: failure, verify() {
  assertSameArtifact(before, verifyArtifactFile(tarball, sha256));
  assert.equal(candidate.capturePackageInputs(repo).sha256, packageInputs.sha256);
  assert.equal(candidate.captureQualificationInputs(repo).sha256, harnessInputs.sha256);
} });
receipt.cleanup = { removed: cleanup.removed, owned_fixture_only: true };
console.log(JSON.stringify(receipt, null, 2));
