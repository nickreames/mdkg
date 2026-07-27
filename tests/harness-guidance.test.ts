import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const repoRoot = path.resolve(process.cwd());
const { runInitCommand } = require("../commands/init") as {
  runInitCommand(options: {
    root: string;
    seedRoot: string;
    agent: boolean;
    noUpdateIgnores?: boolean;
  }): void;
};

const loopSteps = [
  "mdkg loop show <loop-id> --json",
  "mdkg skill show pursue-mdkg-loop",
  "mdkg loop plan <loop-id> --json",
  "mdkg loop next <loop-id> --json",
  "mdkg pack <loop-id> --pack-profile concise --dry-run --stats",
  "answer or record pre-run questions and approval requirements",
  "work every authorized linked lane before marking the loop done or blocked",
];

function captureConsole(fn: () => void): void {
  const log = console.log;
  const error = console.error;
  try {
    console.log = () => undefined;
    console.error = () => undefined;
    fn();
  } finally {
    console.log = log;
    console.error = error;
  }
}

function normalize(source: string): string {
  return source.replace(/\s+/g, " ").trim();
}

function assertOrdered(source: string, identities: string[]): void {
  const normalized = normalize(source);
  let cursor = -1;
  for (const identity of identities) {
    const index = normalized.indexOf(identity, cursor + 1);
    assert.ok(index > cursor, `missing or out-of-order guidance: ${identity}`);
    cursor = index;
  }
}

function activeLoopSection(source: string): string {
  const start = source.indexOf("If an active loop is known:");
  const end = [
    source.indexOf("\nIf no task is known:", start),
    source.indexOf("\nIf the active task is not known:", start),
  ].filter((value) => value > start).sort((a, b) => a - b)[0] ?? -1;
  assert.ok(start >= 0 && end > start, "active-loop quickstart section is missing");
  return source.slice(start, end);
}

function runGit(args: string[]) {
  return spawnSync("git", ["-C", repoRoot, ...args], { encoding: "utf8" });
}

test("root public built and fresh startup wrappers preserve ordered loop routing semantics", () => {
  const freshRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-harness-guidance-init-"));
  captureConsole(() => runInitCommand({
    root: freshRoot,
    seedRoot: path.join(repoRoot, "dist", "init"),
    agent: true,
    noUpdateIgnores: true,
  }));
  const surfaces = [
    ["root", path.join(repoRoot, "AGENT_START.md")],
    ["public source", path.join(repoRoot, "assets", "init", "AGENT_START.md")],
    ["built public", path.join(repoRoot, "dist", "init", "AGENT_START.md")],
    ["fresh init", path.join(freshRoot, "AGENT_START.md")],
  ] as const;
  for (const [identity, filePath] of surfaces) {
    assertOrdered(activeLoopSection(fs.readFileSync(filePath, "utf8")), loopSteps);
    assert.ok(fs.readFileSync(filePath, "utf8").includes("pursue-mdkg-loop"), identity);
  }
  assert.notEqual(
    fs.readFileSync(surfaces[0][1], "utf8"),
    fs.readFileSync(surfaces[1][1], "utf8"),
    "audience-specific startup wrappers must not require whole-file equality",
  );
});

test("each required loop routing identity fails independently when removed", () => {
  const source = activeLoopSection(fs.readFileSync(path.join(repoRoot, "AGENT_START.md"), "utf8"));
  assertOrdered(source, loopSteps);
  for (const identity of loopSteps) {
    const changed = normalize(source).split(identity).join("");
    assert.throws(() => assertOrdered(changed, loopSteps), new RegExp(identity
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\s+/g, "\\s+")));
  }
});

test("contributor guidance matches tracked SQLite and ignored transient index state", () => {
  const tracked = runGit(["ls-files", "--error-unmatch", ".mdkg/index/mdkg.sqlite"]);
  assert.equal(tracked.status, 0, tracked.stderr);
  const sqliteIgnored = runGit(["check-ignore", ".mdkg/index/mdkg.sqlite"]);
  assert.equal(sqliteIgnored.status, 1, sqliteIgnored.stdout);
  for (const transient of [
    ".mdkg/index/global.json",
    ".mdkg/index/write.lock/example",
    ".mdkg/index/mdkg.sqlite-wal",
    ".mdkg/index/mdkg.sqlite-shm",
    ".mdkg/index/mdkg.sqlite-journal",
  ]) {
    const ignored = runGit(["check-ignore", "-q", transient]);
    assert.equal(ignored.status, 0, `${transient}: ${ignored.stderr}`);
  }

  const guidance = normalize(fs.readFileSync(path.join(repoRoot, "CONTRIBUTING.md"), "utf8"));
  for (const contract of [
    "intentionally tracks `.mdkg/index/mdkg.sqlite`",
    "`.mdkg/index/*.json`",
    "`git ls-files .mdkg/index`",
    "`git check-ignore .mdkg/index/<path>`",
    "Do not blanket-delete, reset, or restore `.mdkg/index/`",
    "Initialized consumer repositories may choose a different policy",
  ]) {
    assert.ok(guidance.includes(contract), `missing contributor index contract: ${contract}`);
  }
});

test("test guide dynamically covers command core graph pack util root TS and root MJS families", () => {
  const guide = normalize(fs.readFileSync(path.join(repoRoot, "tests", "README.md"), "utf8"));
  for (const family of ["commands", "core", "graph", "pack", "util"]) {
    const files = fs.readdirSync(path.join(repoRoot, "tests", family))
      .filter((entry) => entry.endsWith(".test.ts"));
    assert.ok(files.length > 0, `expected current ${family} tests`);
    assert.ok(guide.includes(`tests/${family}/*.test.ts`), `missing ${family} family guidance`);
  }
  assert.ok(
    fs.readdirSync(path.join(repoRoot, "tests")).some((entry) => entry.endsWith(".test.ts")),
    "expected root TypeScript tests",
  );
  assert.ok(
    fs.readdirSync(path.join(repoRoot, "tests")).some((entry) => entry.endsWith(".test.mjs")),
    "expected root MJS tests",
  );
  for (const contract of [
    "tests/*.test.ts",
    "tests/*.test.mjs",
    "npm run test",
    "npm run build:test",
    "node --test dist/tests/commands/<name>.test.js",
    "npm run test:public-release",
    "rather than freezing transient test counts",
  ]) {
    assert.ok(guide.includes(contract), `missing test-family contract: ${contract}`);
  }
  assert.doesNotMatch(guide, /CLI(?: command)? tests? (?:are|is) deferred/i);
});
