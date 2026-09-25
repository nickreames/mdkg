// Validation-output admission, not an OS sandbox or an ancestor-race remedy.
// Never delete an existing destination to make room for qualification evidence.
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

function within(parent, child) {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative));
}

function outputPath(value, forbiddenRoots = []) {
  if (typeof value !== "string" || !value.trim()) throw new Error("qualification output requires an exact directory");
  const target = path.resolve(value);
  if (target === path.parse(target).root || target === path.resolve(os.homedir()) ||
      forbiddenRoots.some((root) => within(target, path.resolve(root)))) {
    throw new Error(`qualification output cannot be a protected root or its ancestor: ${target}`);
  }
  return target;
}

function directoryChain(directory, { allowMissing = false } = {}) {
  const target = path.resolve(directory), root = path.parse(target).root;
  let current = root;
  const chain = [{ path: root, stat: fs.lstatSync(root) }];
  for (const part of path.relative(root, target).split(path.sep).filter(Boolean)) {
    current = path.join(current, part);
    let stat;
    try { stat = fs.lstatSync(current); }
    catch (error) { if (!allowMissing || error.code !== "ENOENT") throw error; }
    if (stat && !stat.isDirectory()) throw new Error(`qualification directory cannot traverse a link or non-directory: ${current}`);
    chain.push({ path: current, stat });
  }
  return chain;
}

function assertDirectoryChain(directory) {
  directoryChain(directory);
  return path.resolve(directory);
}

function createDirectory(chain) {
  // Check each admitted existing component again, and create missing components
  // exclusively. Refuse competing creation; do not adopt it or clean it up.
  for (const entry of chain) {
    if (!entry.stat) {
      fs.mkdirSync(entry.path, { mode: 0o700 });
      entry.stat = fs.lstatSync(entry.path);
    } else {
      const current = fs.lstatSync(entry.path);
      if (!current.isDirectory() || current.dev !== entry.stat.dev || current.ino !== entry.stat.ino) {
        throw new Error(`qualification directory identity changed: ${entry.path}`);
      }
    }
  }
}

function prepareEmptyDirectory(value, { forbiddenRoots = [] } = {}) {
  const target = outputPath(value, forbiddenRoots);
  const chain = directoryChain(target, { allowMissing: true });
  if (chain.at(-1).stat && fs.readdirSync(target).length !== 0) {
    throw new Error(`qualification output directory is not empty; choose a fresh directory: ${target}`);
  }
  createDirectory(chain);
  if (fs.readdirSync(target).length !== 0) throw new Error(`qualification output directory changed before use: ${target}`);
  return target;
}

function createRunDirectory(value, { forbiddenRoots = [], prefix = "run-" } = {}) {
  const target = outputPath(value, forbiddenRoots);
  if (!/^[a-z][a-z0-9-]*-$/.test(prefix)) throw new Error("qualification run prefix must be a plain basename prefix");
  createDirectory(directoryChain(target, { allowMissing: true }));
  return fs.mkdtempSync(path.join(target, prefix));
}

function readRegularJsonFile(file, maxBytes = 1024 * 1024) {
  assertDirectoryChain(path.dirname(file));
  const initial = fs.lstatSync(file);
  if (!initial.isFile() || initial.nlink !== 1 || initial.size > maxBytes) {
    throw new Error("qualification JSON must be a bounded independent regular file");
  }
  const fd = fs.openSync(file, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW ?? 0) | (fs.constants.O_NONBLOCK ?? 0));
  try {
    const opened = fs.fstatSync(fd);
    if (!opened.isFile() || opened.nlink !== 1 || opened.dev !== initial.dev || opened.ino !== initial.ino || opened.size > maxBytes) {
      throw new Error("qualification JSON identity changed before reading");
    }
    const data = Buffer.alloc(opened.size + 1);
    let bytes = 0, count;
    while (bytes < data.length && (count = fs.readSync(fd, data, bytes, data.length - bytes, null)) > 0) bytes += count;
    const final = fs.fstatSync(fd), named = fs.lstatSync(file);
    if (bytes !== opened.size || final.size !== opened.size || final.mtimeMs !== opened.mtimeMs || final.ctimeMs !== opened.ctimeMs ||
        !named.isFile() || named.nlink !== 1 || named.dev !== opened.dev || named.ino !== opened.ino) {
      throw new Error("qualification JSON identity changed while reading");
    }
    return JSON.parse(data.subarray(0, bytes).toString("utf8"));
  } finally { fs.closeSync(fd); }
}

module.exports = { assertDirectoryChain, createRunDirectory, prepareEmptyDirectory, readRegularJsonFile, within };
