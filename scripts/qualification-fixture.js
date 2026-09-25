// Process-local ownership for disposable qualification roots. Not an OS sandbox
// or a general filesystem-authority replacement (the Node ancestor race remains).
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { assertDirectoryChain, within } = require("./qualification-output");
const { runFixtureProcess, assertFixtureProcessesQuiescent } = require("./qualification-process");

function createOwnedFixture({ base = fs.realpathSync(os.tmpdir()), prefix = "mdkg-fixture-" } = {}) {
  if (!/^[a-z][a-z0-9-]*-$/.test(prefix)) throw new Error("fixture prefix must be a plain basename prefix");
  assertDirectoryChain(base);
  const root = fs.mkdtempSync(path.join(base, prefix));
  const anchors = [];
  for (let current = root; ; current = path.dirname(current)) {
    const stat = fs.lstatSync(current);
    anchors.push({ path: current, dev: stat.dev, ino: stat.ino });
    if (current === path.dirname(current)) break;
  }
  let removed = false;
  function assertOwned() {
    if (removed) throw new Error("fixture ownership has already been released");
    for (const anchor of anchors) {
      const stat = fs.lstatSync(anchor.path);
      if (!stat.isDirectory() || stat.dev !== anchor.dev || stat.ino !== anchor.ino) {
        throw new Error(`fixture identity changed; preserve uncertain paths: ${anchor.path}`);
      }
    }
    return root;
  }
  function resolve(relative) {
    assertOwned();
    if (typeof relative !== "string" || !relative || path.isAbsolute(relative)) throw new Error("fixture path must be relative");
    const target = path.resolve(root, relative);
    if (target === root || !within(root, target)) throw new Error("fixture path escapes its owned root");
    return target;
  }
  function cleanup() {
    if (removed) return { removed: false, already_released: true, root };
    assertOwned();
    assertFixtureProcessesQuiescent(root);
    // Only the exact directory minted above; never discover deletion targets by
    // matching names, adopting a caller path, or walking sibling directories.
    fs.rmSync(root, { recursive: true, force: false });
    removed = true;
    return { removed: true, root };
  }
  function runNode(args, { cwd = root, env = process.env, timeout = 120000, maxBuffer = 1024 * 1024 } = {}) {
    assertOwned();
    return runFixtureProcess(root, process.execPath, args, { cwd, env: isolatedFixtureEnvironment(env), timeout, maxBuffer });
  }
  return Object.freeze({ root, assertOwned, resolve, cleanup, runNode });
}

function describeFailure(error, seen = new Set()) {
  if (!(error instanceof Error)) return String(error);
  if (seen.has(error)) return "[previously reported failure]";
  seen.add(error);
  const nested = error instanceof AggregateError ? error.errors : [];
  return [error.message, ...nested.map(failure => describeFailure(failure, seen)),
    ...(error.cause === undefined ? [] : [describeFailure(error.cause, seen)])].join("\n");
}

function finalizeFixture(fixture, { error, verify = () => {} } = {}) {
  const errors = error ? [error] : [];
  let cleanup = { removed: false, root: fixture.root };
  try { verify(); } catch (failure) { errors.push(failure); }
  // Input drift and fixture ownership are separate evidence: one must not
  // prevent checking the other, and neither may hide the original failure.
  try { cleanup = fixture.cleanup(); } catch (failure) { errors.push(failure); }
  if (errors.length) throw new AggregateError(errors,
    `fixture qualification failed; cleanup=${JSON.stringify(cleanup)}\n${errors.map(error => describeFailure(error)).join("\n")}`);
  return cleanup;
}

function isolatedFixtureEnvironment(input = process.env) {
  const env = Object.fromEntries(Object.entries(input).filter(([key]) => key.toUpperCase() !== "GIT" && !key.toUpperCase().startsWith("GIT_")));
  return {
    ...env,
    GIT_CONFIG_NOSYSTEM: "1",
    GIT_CONFIG_GLOBAL: process.platform === "win32" ? "NUL" : "/dev/null",
    GIT_TERMINAL_PROMPT: "0",
    GIT_OPTIONAL_LOCKS: "0",
    GIT_ATTR_NOSYSTEM: "1",
  };
}

module.exports = { createOwnedFixture, isolatedFixtureEnvironment, finalizeFixture };
