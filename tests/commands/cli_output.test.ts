import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";
import { writeFile } from "../helpers/fs";

const cli = path.resolve(__dirname, "../../cli.js");
const payload = "output-✓-界\n".repeat(65536) + "END-OF-DRAIN-FIXTURE";
const digest = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");

function fixture(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-cli-output-"));
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg/work/task-1.md"), [
    "---", "id: task-1", "type: task", "title: Output fixture", "status: todo",
    "priority: 1", "tags: []", "owners: []", "links: []", "artifacts: []",
    "relates: []", "blocked_by: []", "blocks: []", "refs: []", "aliases: []",
    "skills: []", "created: 2026-09-09", "updated: 2026-09-09", "---",
    "# Overview", "", payload, "",
  ].join("\n"));
  return root;
}

function fileOutput(root: string, args: string[], code = 0, stream: "stdout" | "stderr" = "stdout"): Buffer {
  const target = path.join(root, "output.bin");
  const fd = fs.openSync(target, "w", 0o600);
  try {
    const r = spawnSync(process.execPath, args, {
      cwd: root, timeout: 30000, maxBuffer: 8 * 1024 * 1024,
      stdio: stream === "stdout" ? ["ignore", fd, "pipe"] : ["ignore", "pipe", fd],
    });
    assert.ifError(r.error);
    assert.equal(r.signal, null);
    assert.equal(r.status, code);
  } finally {
    fs.closeSync(fd);
  }
  return fs.readFileSync(target);
}

for (const format of ["text", "json", "xml", "toon", "md"]) {
  test(`CLI drains complete large UTF-8 ${format} output to a pipe`, () => {
    const root = fixture();
    try {
      const nodePath = path.join(root, ".mdkg/work/task-1.md");
      const original = fs.readFileSync(nodePath);
      const args = [cli, "show", "task-1", ...(format === "text" ? [] : [`--${format}`])];
      const expected = fileOutput(root, args);
      assert.ok(expected.length > 900000);
      assert.ok(expected.includes(Buffer.from("END-OF-DRAIN-FIXTURE")));
      const r = spawnSync(process.execPath, args, { cwd: root, timeout: 30000, maxBuffer: 8 * 1024 * 1024 });
      assert.ifError(r.error);
      assert.equal(r.status, 0);
      assert.equal(r.signal, null);
      assert.equal(r.stdout.length, expected.length, "stdout must not be truncated on exit");
      assert.equal(digest(r.stdout), digest(expected), "pipe and file must be byte-equivalent");
      if (format === "json") assert.ok(JSON.parse(r.stdout.toString()).item.body.endsWith("END-OF-DRAIN-FIXTURE"));
      assert.deepEqual(fs.readFileSync(nodePath), original);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
}

test("CLI waits for a slow output consumer without truncation", async () => {
  const root = fixture();
  try {
    const args = [cli, "show", "task-1", "--json"];
    const expected = fileOutput(root, args);
    const chunks: Buffer[] = [], errors: Buffer[] = [];
    const child = spawn(process.execPath, args, { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
    let delay: ReturnType<typeof setTimeout> | undefined;
    child.stdout.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
      child.stdout.pause();
      delay = setTimeout(() => child.stdout.resume(), 5);
    });
    child.stderr.on("data", (chunk: Buffer) => errors.push(chunk));
    const timer = setTimeout(() => child.kill("SIGKILL"), 30000);
    try {
      const code = await new Promise<number | null>((resolve, reject) => {
        child.once("error", reject);
        child.once("close", (code, signal) => signal ? reject(new Error(`unexpected signal ${signal}`)) : resolve(code));
      });
      assert.equal(code, 0, Buffer.concat(errors).toString());
      const actual = Buffer.concat(chunks);
      assert.equal(actual.length, expected.length);
      assert.equal(digest(actual), digest(expected));
    } finally {
      clearTimeout(timer);
      if (delay) clearTimeout(delay);
      if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

for (const rejected of [false, true]) {
  test(`CLI drains large ${rejected ? "rejected async" : "handled command"} diagnostics with the correct exit code`, () => {
    const root = fixture();
    try {
      // Generate the message in the child, not in OS argv (which has size limits).
      const prelude = `const cli=require(${JSON.stringify(cli)}); const message='diagnostic-界'.repeat(100000)+'END-OF-ERROR';`;
      const script = rejected
        ? prelude + "process.cwd=()=>{throw new Error(message)}; cli.main(['show','task-1']);"
        : prelude + "cli.main(['show',message]);";
      const args = ["-e", script], code = rejected ? 4 : 3;
      const expected = fileOutput(root, args, code, "stderr");
      assert.ok(expected.length > 1000000);
      assert.ok(expected.includes(Buffer.from("END-OF-ERROR")));
      const r = spawnSync(process.execPath, args, { cwd: root, timeout: 30000, maxBuffer: 8 * 1024 * 1024 });
      assert.ifError(r.error);
      assert.equal(r.status, code);
      assert.equal(r.stderr.length, expected.length);
      assert.equal(digest(r.stderr), digest(expected));
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
}
