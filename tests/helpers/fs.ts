import fs from "fs";
import os from "os";
import path from "path";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

export function makeTempDir(prefix: string): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

export function writeFile(filePath: string, contents: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents, "utf8");
}

export function touch(filePath: string, timeMs: number): void {
  const time = new Date(timeMs / 1000);
  fs.utimesSync(filePath, time, time);
}

// A staging-preservation fixture needs actual Git administration, not a lone
// synthetic .git/index that makes topology discovery fail before the test.
export function initializeTestGitIndex(root: string): Buffer {
  assert(path.isAbsolute(root) && fs.statSync(root).isDirectory());
  assert(!fs.existsSync(path.join(root, ".git")), "fixture Git metadata already exists");
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith("GIT_")));
  Object.assign(env, { GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_SYSTEM: os.devNull,
    GIT_CONFIG_GLOBAL: os.devNull, GIT_OPTIONAL_LOCKS: "0", GIT_TERMINAL_PROMPT: "0" });
  for (const args of [["-c", "init.defaultBranch=fixture", "init", "--template=", "-q"], ["read-tree", "--empty"]]) {
    const result = spawnSync("git", args, { cwd: root, env, encoding: "utf8", timeout: 5000 });
    assert.equal(result.error, undefined); assert.equal(result.status, 0, result.stderr);
  }
  return fs.readFileSync(path.join(root, ".git/index"));
}
