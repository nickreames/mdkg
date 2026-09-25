// Process-local supervision for trusted disposable Node/Git qualification trees.
// Not an OS sandbox: deliberately detached descendants are outside this model.
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { assertDirectoryChain, within } = require("./qualification-output");

const groups = new Map();
const nested = () => globalThis[Symbol.for("mdkg.qualification.supervised-child")] === true;
function groupExists(pid) {
  try { process.kill(-pid, 0); return true; }
  catch (error) {
    if (error.code === "ESRCH") return false;
    if (error.code === "EPERM") return true;
    throw error;
  }
}
function assertFixtureProcessesQuiescent(directory) {
  const root = fs.realpathSync(directory);
  if (nested()) throw new Error(`nested fixture cleanup belongs to the outer supervisor; retain ${root}`);
  checkGroups(root);
}
function checkGroups(root) {
  for (const [pid, owner] of groups) {
    if (!within(root, owner) && !within(owner, root)) continue;
    if (groupExists(pid)) throw new Error(`fixture process group ${pid} has not exited; retain ${root}`);
    groups.delete(pid);
  }
}
function runFixtureProcess(root, command, args, { cwd = root, env = process.env, timeout = 120000, maxBuffer = 1024 * 1024, input } = {}) {
  if (process.platform === "win32") throw new Error("owned fixture process groups are unqualified on Windows");
  if (!Number.isSafeInteger(timeout) || timeout <= 0) throw new Error("fixture process timeout must be a positive integer");
  if (!path.isAbsolute(cwd) || !within(root, cwd)) throw new Error("fixture process cwd must be within its owned root");
  assertDirectoryChain(root); assertDirectoryChain(cwd);
  checkGroups(root);
  const inherited = nested();
  const childArgs = command === process.execPath ? ["--require", path.join(__dirname, "qualification-process-context.js"), ...args] : args;
  const result = spawnSync(command, childArgs, { cwd, env, encoding: "utf8", timeout, maxBuffer, input, detached: !inherited, killSignal: "SIGKILL" });
  if (result.pid && inherited && (result.error || result.signal)) {
    // An inner timeout cannot prove that its grandchildren exited. Terminate the
    // current supervised worker; every enclosing synchronous supervisor escalates
    // similarly until the external owner kills/checks the one shared group. Never
    // accept an inherited PID from environment as permission to signal a group.
    fs.writeSync(2, `nested fixture process failed; retain until outer shutdown: ${result.error?.message || result.signal}\n`);
    process.kill(process.pid, "SIGKILL");
    throw new Error("nested fixture termination unexpectedly returned");
  }
  if (result.pid && !inherited) {
    groups.set(result.pid, root);
    try {
      if (groupExists(result.pid)) {
        try { process.kill(-result.pid, "SIGKILL"); }
        catch (error) { if (error.code !== "ESRCH") throw error; }
        result.error ||= new Error("fixture child exited with descendants still running");
      } else groups.delete(result.pid);
    } catch (error) { result.error ||= error; }
  }
  if (result.signal) result.error ||= new Error(`fixture child terminated by ${result.signal}`);
  // Callers must independently check quiescence before cleanup, including when
  // this throw unwinds through an outer fixture's finally block.
  if (result.error) throw new Error(`fixture process failed; root=${root}: ${result.error.message}`, { cause: result.error });
  return result;
}

function runFixtureNode(root, script, args, { nodeArgs = [], ...options } = {}) {
  const file = process.platform === "win32" && script.endsWith(".cmd") ? path.join(path.dirname(script), "node_modules/mdkg/dist/cli.js") : script;
  return runFixtureProcess(root, process.execPath, [...nodeArgs, file, ...args], options);
}

module.exports = { runFixtureProcess, runFixtureNode, assertFixtureProcessesQuiescent };
