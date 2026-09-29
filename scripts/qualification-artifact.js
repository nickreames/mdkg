// Qualification integrity checks, not an OS sandbox or a filesystem-race claim.
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

function verifyArtifactFile(file, expectedHash) {
  if (typeof file !== "string" || !file || !/^[a-f0-9]{64}$/.test(expectedHash)) {
    throw new Error("artifact verification requires an exact path and SHA-256");
  }
  const absolute = path.resolve(file);
  const initial = fs.lstatSync(absolute);
  if (!initial.isFile() || initial.nlink !== 1) throw new Error("artifact must be an independent regular file, not a link");
  const fd = fs.openSync(absolute, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW ?? 0) | (fs.constants.O_NONBLOCK ?? 0));
  try {
    const opened = fs.fstatSync(fd);
    if (!opened.isFile() || opened.nlink !== 1 || opened.dev !== initial.dev || opened.ino !== initial.ino) {
      throw new Error("artifact identity changed before verification");
    }
    const hash = crypto.createHash("sha256"), buffer = Buffer.alloc(65536);
    let count, bytes = 0;
    while ((count = fs.readSync(fd, buffer, 0, buffer.length, null)) > 0) {
      hash.update(buffer.subarray(0, count)); bytes += count;
    }
    const final = fs.fstatSync(fd), named = fs.lstatSync(absolute), actual = hash.digest("hex");
    if (!named.isFile() || named.dev !== opened.dev || named.ino !== opened.ino || named.nlink !== 1 ||
      final.size !== opened.size || bytes !== final.size || final.mtimeMs !== opened.mtimeMs ||
      final.ctimeMs !== opened.ctimeMs || actual !== expectedHash) {
      throw new Error(`artifact hash or identity mismatch: expected ${expectedHash}, got ${actual}`);
    }
    return { path: absolute, sha256: actual, bytes, dev: final.dev, ino: final.ino };
  } finally { fs.closeSync(fd); }
}

function copyVerifiedArtifact(source, destination, expectedHash) {
  const original = verifyArtifactFile(source, expectedHash);
  const target = path.resolve(destination);
  if (target === original.path) throw new Error("artifact delivery cannot replace the canonical artifact");
  let existing;
  try { existing = fs.lstatSync(target); }
  catch (error) { if (error.code !== "ENOENT") throw error; }
  if (existing) {
    const copy = verifyArtifactFile(target, expectedHash);
    if (copy.dev === original.dev && copy.ino === original.ino) throw new Error("artifact delivery cannot share the canonical inode");
  } else {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(original.path, target, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(target, 0o444);
  }
  // Keep failures visible; do not delete/replace existing or uncertain paths.
  const copy = verifyArtifactFile(target, expectedHash);
  const current = verifyArtifactFile(original.path, expectedHash);
  assertSameArtifact(original, current);
  if (copy.dev === current.dev && copy.ino === current.ino) throw new Error("artifact delivery shares the canonical inode");
  return copy;
}

function assertSameArtifact(before, after) {
  if (before.path !== after.path || before.dev !== after.dev || before.ino !== after.ino ||
      before.sha256 !== after.sha256 || before.bytes !== after.bytes) {
    throw new Error("artifact identity changed or was replaced during qualification");
  }
}

function withVerifiedArtifact(file, expectedHash, consume) {
  const before = verifyArtifactFile(file, expectedHash);
  let result, consumerError;
  try { result = consume(); } catch (error) { consumerError = error; }
  let after;
  try { after = verifyArtifactFile(file, expectedHash); assertSameArtifact(before, after); }
  catch (error) {
    if (consumerError) throw new AggregateError([consumerError, error], `consumer failed and artifact verification failed: ${consumerError.message}; ${error.message}`);
    throw error;
  }
  if (consumerError) throw consumerError;
  return { result, verification: { before_sha256: before.sha256, after_sha256: after.sha256,
    bytes: after.bytes, identity_preserved: true } };
}

module.exports = { assertSameArtifact, copyVerifiedArtifact, verifyArtifactFile, withVerifiedArtifact };
