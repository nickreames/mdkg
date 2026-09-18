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

const compactSteps = ["mdkg show <qid>", "mdkg skill list", "mdkg skill show <slug>", "mdkg pack <qid> --pack-profile concise"];
const focusedLoopSteps = [
  "mdkg loop show <loop> --json", "mdkg loop plan <loop> --json",
  "mdkg loop next <loop> --json", "mdkg pack <loop> --pack-profile concise --dry-run --stats",
  "Build a completion matrix before execution", "Ask or surface pre-run questions",
  "Work the linked graph, not just the first branch",
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

test("legacy startup and compact adapters preserve focused loop discovery without duplicating procedures", t => {
  const freshRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-harness-guidance-init-"));
  t.after(() => fs.rmSync(freshRoot, { recursive: true, force: true }));
  captureConsole(() => runInitCommand({
    root: freshRoot,
    seedRoot: path.join(repoRoot, "dist", "init"),
    agent: true,
    noUpdateIgnores: true,
  }));
  assertOrdered(activeLoopSection(fs.readFileSync(path.join(repoRoot, "AGENT_START.md"), "utf8")), loopSteps);
  const routers = [
    ["public source", path.join(repoRoot, "assets", "init", "AGENT_START.md")],
    ["built public", path.join(repoRoot, "dist", "init", "AGENT_START.md")],
    ["fresh init", path.join(freshRoot, ".mdkg", "AGENT_START.md")],
  ] as const;
  for (const [identity, filePath] of routers) {
    const source = fs.readFileSync(filePath, "utf8");
    assertOrdered(source, compactSteps);
    assert.match(source, /Never load the whole command/);
    assert.doesNotMatch(source, /If an active loop is known:/, identity);
  }
  assert.equal(fs.existsSync(path.join(freshRoot, "AGENT_START.md")), false);
  for (const adapter of ["AGENTS.md", "CLAUDE.md"]) {
    const body = fs.readFileSync(path.join(freshRoot, adapter), "utf8");
    assert.match(body, /\[\.mdkg\/AGENT_START\.md\]\(\.mdkg\/AGENT_START\.md\)/);
    assert.doesNotMatch(body, /mdkg loop plan/);
  }
  const freshRouter = fs.readFileSync(routers[2][1], "utf8");
  for (const link of freshRouter.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const target = path.resolve(freshRoot, ".mdkg", link[1]);
    assert.ok(target.startsWith(path.join(freshRoot, ".mdkg") + path.sep), link[1]);
    assert.ok(fs.existsSync(target), `broken focused resource link: ${link[1]}`);
  }
  const canonical = fs.readFileSync(path.join(repoRoot, ".mdkg/skills/pursue-mdkg-loop/SKILL.md"), "utf8");
  assertOrdered(canonical, focusedLoopSteps);
  for (const surface of [path.join(repoRoot, "assets/init/skills/default"), path.join(repoRoot, "dist/init/skills/default"), path.join(freshRoot, ".mdkg/skills")]) {
    assert.equal(fs.readFileSync(path.join(surface, "pursue-mdkg-loop/SKILL.md"), "utf8"), canonical);
  }
});

test("compact routing and focused loop procedures reject each removed required step", () => {
  for (const [file, steps] of [
    ["assets/init/AGENT_START.md", compactSteps],
    [".mdkg/skills/pursue-mdkg-loop/SKILL.md", focusedLoopSteps],
  ] as const) {
    const body = normalize(fs.readFileSync(path.join(repoRoot, file), "utf8"));
    assertOrdered(body, [...steps]);
    for (const step of steps) assert.throws(() => assertOrdered(body.split(step).join(""), [...steps]), /missing or out-of-order guidance/);
  }
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
