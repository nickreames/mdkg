import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import os from "os";
import path from "path";
import { spawn } from "node:child_process";
const { runCli } = require("../../cli");
const { loadConfig } = require("../../core/config");
const { reserveSqliteNumericId, writeSqliteIndex } = require("../../graph/sqlite_index");

const binPath = path.resolve(__dirname, "..", "..", "cli.js");

function makeRoot(prefix: string): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function captureRun(argv: string[], cwd: string): { code: number; stdout: string; stderr: string } {
  const stdout: string[] = [];
  const stderr: string[] = [];
  const consoleLog = console.log;
  const consoleError = console.error;
  try {
    console.log = ((...args: unknown[]) => stdout.push(args.map(String).join(" "))) as typeof console.log;
    console.error = ((...args: unknown[]) => stderr.push(args.map(String).join(" "))) as typeof console.error;
    const code = runCli(argv, {
      cwd: () => cwd,
      log: (...args: unknown[]) => stdout.push(args.map(String).join(" ")),
      error: (...args: unknown[]) => stderr.push(args.map(String).join(" ")),
    });
    return { code, stdout: stdout.join("\n"), stderr: stderr.join("\n") };
  } finally {
    console.log = consoleLog;
    console.error = consoleError;
  }
}

function readJson(filePath: string): Record<string, any> {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath: string, value: unknown): void {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function spawnMdkg(argv: string[], cwd: string): Promise<{ status: number | null; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [binPath, ...argv], { cwd, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("close", (status) => {
      resolve({ status, stdout, stderr });
    });
  });
}

test("fresh init defaults to sqlite backend and index writes mdkg.sqlite", () => {
  const root = makeRoot("mdkg-sqlite-init-");
  assert.equal(captureRun(["init", "--agent"], root).code, 0);
  const config = readJson(path.join(root, ".mdkg", "config.json"));
  assert.equal(config.index.backend, "sqlite");
  assert.equal(config.index.sqlite_path, ".mdkg/index/mdkg.sqlite");
  assert.equal(config.index.sqlite_commit_warning_bytes, 52428800);
  assert.equal(config.index.lock_timeout_ms, 10000);

  const index = captureRun(["index"], root);
  assert.equal(index.code, 0);
  assert.match(index.stdout, /sqlite index written: \.mdkg\/index\/mdkg\.sqlite/);
  const sqlitePath = path.join(root, ".mdkg", "index", "mdkg.sqlite");
  assert.equal(fs.existsSync(sqlitePath), true);
  const { DatabaseSync } = require("node:sqlite");
  const db = new DatabaseSync(sqlitePath);
  try {
    const row = db.prepare("SELECT value FROM meta WHERE key = 'root'").get();
    assert.equal(row.value, ".");
  } finally {
    db.close();
  }
  assert.equal(captureRun(["doctor"], root).code, 0);
  assert.equal(captureRun(["validate"], root).code, 0);
});

test("SQLite rebuild and ID reservation reject linked index ancestry", (t) => {
  const root = makeRoot("mdkg-sqlite-linked-index-");
  const outside = makeRoot("mdkg-sqlite-linked-outside-");
  assert.equal(captureRun(["init", "--agent"], root).code, 0);
  fs.rmSync(path.join(root, ".mdkg", "index"), { recursive: true, force: true });
  try {
    fs.symlinkSync(outside, path.join(root, ".mdkg", "index"), "dir");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EPERM") {
      t.skip("symbolic links unavailable");
      return;
    }
    throw error;
  }
  const config = loadConfig(root);

  assert.throws(
    () =>
      writeSqliteIndex({
        root,
        config,
        nodeIndex: { nodes: {} },
        skillsIndex: { skills: {} },
        capabilitiesIndex: { records: [] },
        subgraphsIndex: { subgraphs: [] },
      }),
    (error: unknown) => (error as { code?: string }).code === "ERR_CONTAINED_PATH_LINK"
  );
  assert.throws(
    () => reserveSqliteNumericId({ root, config, ws: "root", prefix: "task", currentMax: 0 }),
    (error: unknown) => (error as { code?: string }).code === "ERR_CONTAINED_PATH_LINK"
  );
  assert.equal(fs.existsSync(path.join(outside, "mdkg.sqlite")), false);
});

test("legacy config without sqlite fields remains json backend", () => {
  const root = makeRoot("mdkg-sqlite-legacy-");
  assert.equal(captureRun(["init", "--agent"], root).code, 0);
  const configPath = path.join(root, ".mdkg", "config.json");
  const config = readJson(configPath);
  delete config.index.backend;
  delete config.index.sqlite_path;
  delete config.index.sqlite_commit_warning_bytes;
  delete config.index.lock_timeout_ms;
  writeJson(configPath, config);

  assert.equal(captureRun(["doctor"], root).code, 0);
  const loaded = captureRun(["show", "rule-soul", "--json"], root);
  assert.equal(loaded.code, 0);
});

test("parallel new and checkpoint commands allocate unique ids", async () => {
  const root = makeRoot("mdkg-sqlite-parallel-");
  assert.equal(captureRun(["init", "--agent"], root).code, 0);
  assert.equal(captureRun(["index"], root).code, 0);

  const createCalls = Array.from({ length: 8 }, (_, index) =>
    spawnMdkg(["new", "task", `parallel task ${index}`, "--status", "todo", "--priority", "1", "--json"], root)
  );
  const createResults = await Promise.all(createCalls);
  for (const result of createResults) {
    assert.equal(result.status, 0, result.stderr);
  }
  const ids = createResults.map((result) => JSON.parse(result.stdout).node.id);
  assert.equal(new Set(ids).size, ids.length);

  const checkpointCalls = Array.from({ length: 8 }, (_, index) =>
    spawnMdkg(["checkpoint", "new", `parallel checkpoint ${index}`, "--json"], root)
  );
  const checkpointResults = await Promise.all(checkpointCalls);
  for (const result of checkpointResults) {
    assert.equal(result.status, 0, result.stderr);
  }
  const checkpointIds = checkpointResults.map((result) => JSON.parse(result.stdout).checkpoint.id);
  assert.equal(new Set(checkpointIds).size, checkpointIds.length);
  assert.equal(captureRun(["validate"], root).code, 0);
});
