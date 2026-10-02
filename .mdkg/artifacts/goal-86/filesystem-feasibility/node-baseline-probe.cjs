const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
if (!process.argv[2]) throw new Error('usage: node probe.cjs <compiled-filesystem-authority-module>');
const authority = require(path.resolve(process.argv[2]));

const scratch = fs.realpathSync(os.tmpdir());
function ownedFixture(name, fn) {
  const base = fs.mkdtempSync(path.join(scratch, `${name}-`));
  try { return fn(base); }
  finally { fs.rmSync(base, { recursive: true, force: true }); }
}
function mode(file) { return (fs.statSync(file).mode & 0o777).toString(8); }
function acl(file) {
  const result = spawnSync('ls', ['-dle', file], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr.trim());
  return result.stdout.split('\n').filter((line) => /^\s+\d+:/.test(line));
}

const metadata = ownedFixture('metadata', (base) => {
  const source = path.join(base, 'source');
  const copy = path.join(base, 'copy');
  fs.writeFileSync(source, 'synthetic');
  fs.chmodSync(source, 0o600);
  fs.copyFileSync(source, copy);
  const copiedMode = mode(copy);
  fs.unlinkSync(copy);
  fs.chmodSync(source, 0o644);
  const grant = spawnSync('chmod', ['+a', 'user:nobody deny read', source], { encoding: 'utf8' });
  if (grant.status !== 0) return { copiedMode, aclProbe: `unsupported:${grant.stderr.trim()}` };
  const sourceAcl = acl(source);
  fs.copyFileSync(source, copy);
  return { copiedMode, sourceAcl, copyAcl: acl(copy), copyMode: mode(copy) };
});

function race(name, sink) {
  return ownedFixture(name, (base) => {
    const root = path.join(base, 'root');
    const trusted = path.join(root, 'trusted');
    const moved = path.join(root, 'trusted-before-swap');
    const outside = path.join(base, 'outside');
    fs.mkdirSync(trusted, { recursive: true });
    fs.mkdirSync(outside);
    fs.writeFileSync(path.join(trusted, 'item'), 'inside');
    fs.writeFileSync(path.join(outside, 'item'), 'outside');
    const target = path.join(trusted, 'item');
    const originalOpen = fs.openSync;
    const originalRm = fs.rmSync;
    let swapped = false;
    const swap = () => {
      if (swapped) return;
      swapped = true;
      fs.renameSync(trusted, moved);
      fs.symlinkSync(outside, trusted, 'dir');
    };
    fs.openSync = function(file, ...args) {
      if (path.resolve(String(file)) === target) swap();
      return originalOpen.call(this, file, ...args);
    };
    fs.rmSync = function(file, ...args) {
      if (path.resolve(String(file)) === target) swap();
      return originalRm.call(this, file, ...args);
    };
    let result;
    try { result = sink(root); }
    catch (error) { result = `error:${error.code || error.name}`; }
    finally { fs.openSync = originalOpen; fs.rmSync = originalRm; }
    const outsideContent = fs.existsSync(path.join(outside, 'item'))
      ? fs.readFileSync(path.join(outside, 'item'), 'utf8') : 'removed';
    const movedContent = fs.readFileSync(path.join(moved, 'item'), 'utf8');
    return { swapped, result, outsideContent, movedContent };
  });
}
const races = {
  read: race('read', root => authority.readContainedFile({ root, relativePath: 'trusted/item' })),
  append: race('append', root => authority.appendContainedFile({ root, relativePath: 'trusted/item' }, '+append') && 'appended'),
  remove: race('remove', root => authority.removeContainedPath({ root, relativePath: 'trusted/item' }) && 'removed'),
};
assert.equal(races.read.result, 'outside');
assert.equal(races.append.outsideContent, 'outside+append');
assert.equal(races.remove.outsideContent, 'removed');
process.stdout.write(JSON.stringify({ metadata, races }, null, 2) + '\n');
