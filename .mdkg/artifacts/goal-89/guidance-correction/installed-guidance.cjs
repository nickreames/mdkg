const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const source = '/workspace/mdkg-cloud-goal89';
const installed = '/workspace/mdkg-cloud-review-cache/goal89-review-correction-final/npm-consumer/node_modules/mdkg';
const { createOwnedFixture } = require(path.join(source, 'scripts/qualification-fixture.js'));
const fixture = createOwnedFixture({ prefix: 'mdkg-installed-guidance-' });
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
try {
  // Repository-only documentation is an explicit overlay, not npm package content.
  for (const file of ['package.json', 'CHANGELOG.md']) fs.copyFileSync(path.join(installed, file), fixture.resolve(file));
  fs.cpSync(path.join(installed, 'dist'), fixture.resolve('dist'), { recursive: true });
  const overlays = ['tests/release-guidance.test.mjs', 'docs/start-here/install.md',
    'docs/src/content/docs/start-here/install.md', 'docs/src/content/docs/project/changelog.md'];
  for (const file of overlays) {
    fs.mkdirSync(path.dirname(fixture.resolve(file)), { recursive: true });
    fs.copyFileSync(path.join(source, file), fixture.resolve(file));
  }
  console.log(JSON.stringify({ kind: 'installed-metadata-repository-doc-overlay', node: process.version,
    installed_version: JSON.parse(fs.readFileSync(path.join(installed, 'package.json'))).version,
    package_json_sha256: hash(path.join(installed, 'package.json')), unchanged_test_sha256: hash(fixture.resolve(overlays[0])),
    overlays: Object.fromEntries(overlays.map(file => [file, hash(fixture.resolve(file))])) }));
  const result = fixture.runNode(['--test', '--test-name-pattern', 'both install guides|published changelog chronology',
    fixture.resolve('tests/release-guidance.test.mjs')], { cwd: fixture.root, timeout: 30000 });
  process.stdout.write(result.stdout); process.stderr.write(result.stderr); process.exitCode = result.status;
} finally { fixture.cleanup(); }
