import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { spawnSync } from "node:child_process";
import { makeTempDir } from "../helpers/fs";

const cliPath = path.resolve(__dirname, "..", "..", "cli.js");

function run(args: string[], cwd: string): { stdout: string; stderr: string } {
  const result = spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, `${args.join(" ")}\n${result.stderr}\n${result.stdout}`);
  return { stdout: result.stdout.trim(), stderr: result.stderr.trim() };
}

function runFailure(args: string[], cwd: string): { stdout: string; stderr: string } {
  const result = spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: "utf8",
  });
  assert.notEqual(result.status, 0, `${args.join(" ")} unexpectedly succeeded`);
  return { stdout: result.stdout.trim(), stderr: result.stderr.trim() };
}

function sha256(filePath: string): string {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function updateFrontmatter(filePath: string, replacements: Record<string, string>): void {
  const content = fs.readFileSync(filePath, "utf8");
  const next = content.replace(/^---\n([\s\S]*?)\n---/, (_match, rawFrontmatter) => {
    const seen = new Set<string>();
    const lines = rawFrontmatter.split(/\r?\n/).map((line: string) => {
      for (const [key, value] of Object.entries(replacements)) {
        if (line.startsWith(`${key}:`)) {
          seen.add(key);
          return `${key}: ${value}`;
        }
      }
      return line;
    });
    for (const [key, value] of Object.entries(replacements)) {
      if (!seen.has(key)) {
        lines.push(`${key}: ${value}`);
      }
    }
    return `---\n${lines.join("\n")}\n---`;
  });
  fs.writeFileSync(filePath, next, "utf8");
}

test("archive commands create deterministic sidecars and verify zip caches without raw source", () => {
  const root = makeTempDir("mdkg-archive-cli-");
  run(["init", "--agent"], root);

  const inputDir = path.join(root, "inputs");
  fs.mkdirSync(inputDir, { recursive: true });
  const sourcePath = path.join(inputDir, "key_input_doc.txt");
  fs.writeFileSync(sourcePath, "important input\n", "utf8");

  const created = JSON.parse(
    run([
      "archive",
      "add",
      "inputs/key_input_doc.txt",
      "--id",
      "archive.key-input-doc",
      "--kind",
      "source",
      "--title",
      "Key Input Doc",
      "--refs",
      "https://example.invalid/input",
      "--json",
    ], root).stdout
  );
  assert.equal(created.archive.id, "archive.key-input-doc");
  assert.equal(created.archive.archive_uri, "archive://archive.key-input-doc");

  const sidecar = path.join(root, ".mdkg", "archive", "archive.key-input-doc", "key_input_doc.txt.md");
  const rawCopy = path.join(root, ".mdkg", "archive", "archive.key-input-doc", "source", "key_input_doc.txt");
  const zipPath = path.join(root, ".mdkg", "archive", "archive.key-input-doc", "key_input_doc.txt.zip");
  assert.equal(fs.existsSync(sidecar), true);
  assert.equal(fs.existsSync(rawCopy), true);
  assert.equal(fs.existsSync(zipPath), true);
  const firstZipHash = sha256(zipPath);

  const firstVerify = JSON.parse(run(["archive", "verify", "archive://archive.key-input-doc", "--json"], root).stdout);
  assert.equal(firstVerify.ok, true);
  assert.equal(firstVerify.results[0].raw_present, true);

  run(["archive", "compress", "archive.key-input-doc", "--json"], root);
  assert.equal(sha256(zipPath), firstZipHash);

  fs.rmSync(rawCopy);
  const secondVerify = JSON.parse(run(["archive", "verify", "archive://archive.key-input-doc", "--json"], root).stdout);
  assert.equal(secondVerify.ok, true);
  assert.equal(secondVerify.results[0].raw_present, false);

  const listed = JSON.parse(run(["archive", "list", "--kind", "source", "--json"], root).stdout);
  assert.equal(listed.count, 1);
  assert.equal(listed.items[0].id, "archive.key-input-doc");

  const shown = JSON.parse(run(["archive", "show", "archive://archive.key-input-doc", "--json"], root).stdout);
  assert.equal(shown.item.id, "archive.key-input-doc");
  run(["validate"], root);
});

test("archive validation fails on missing local archive refs", () => {
  const root = makeTempDir("mdkg-archive-missing-ref-");
  run(["init", "--agent"], root);
  const taskId = "task-1";
  fs.writeFileSync(
    path.join(root, ".mdkg", "work", "task-1.md"),
    [
      "---",
      `id: ${taskId}`,
      "type: task",
      "title: Archive ref task",
      "status: todo",
      "priority: 1",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: [archive://archive.missing]",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "created: 2026-05-17",
      "updated: 2026-05-17",
      "---",
      "",
      "# Overview",
      "",
      "Missing archive ref fixture.",
      "",
    ].join("\n"),
    "utf8"
  );

  const failure = runFailure(["validate"], root);
  assert.match(failure.stderr, new RegExp(`${taskId}: artifacts\\[0\\] references missing archive archive://archive.missing`));
});

test("work lifecycle helpers create validation-clean contract order receipt and archive chains", () => {
  const root = makeTempDir("mdkg-work-cli-");
  run(["init", "--agent"], root);

  const spec = JSON.parse(run(["new", "spec", "Image Worker", "--id", "agent.image-worker", "--json"], root).stdout).node;
  const work = JSON.parse(
    run([
      "work",
      "contract",
      "new",
      "Generate Image",
      "--id",
      "work.generate-image",
      "--agent-id",
      "agent.image-worker",
      "--kind",
      "image_generation",
      "--inputs",
      "prompt:text:required",
      "--outputs",
      "image_url:url:required",
      "--required-capabilities",
      "model.image.generate",
      "--pricing-model",
      "included",
      "--json",
    ], root).stdout
  ).node;
  updateFrontmatter(path.join(root, spec.path), {
    work_contracts: `[${path.basename(path.dirname(work.path))}/WORK.md]`,
    relates: "[work.generate-image]",
  });

  const inputDir = path.join(root, "inputs");
  fs.mkdirSync(inputDir, { recursive: true });
  const inputPath = path.join(inputDir, "prompt.txt");
  fs.writeFileSync(inputPath, "prompt: high contrast product image\n", "utf8");
  run(["archive", "add", "inputs/prompt.txt", "--id", "archive.prompt", "--kind", "source", "--json"], root);

  const order = JSON.parse(
    run([
      "work",
      "order",
      "new",
      "Generate Image Order",
      "--id",
      "order.generate-image-1",
      "--work-id",
      "work.generate-image",
      "--requester",
      "user://ExampleRequester",
      "--request-ref",
      "request://GenerateImage/1",
      "--input-refs",
      "archive://archive.prompt",
      "--requested-outputs",
      "image_url:url:required",
      "--constraint-refs",
      "https://example.invalid/constraint",
      "--json",
    ], root).stdout
  ).node;

  const outputPath = path.join(inputDir, "image.txt");
  fs.writeFileSync(outputPath, "artifact placeholder\n", "utf8");
  const outputHash = `sha256:${sha256(outputPath)}`;
  const receipt = JSON.parse(
    run([
      "work",
      "receipt",
      "new",
      "Generate Image Receipt",
      "--id",
      "receipt.generate-image-1",
      "--work-order-id",
      "order.generate-image-1",
      "--outcome",
      "success",
      "--receipt-status",
      "recorded",
      "--cost-ref",
      "cost://redacted/generate-image-1",
      "--artifacts",
      "artifact://image-output-placeholder",
      "--proof-refs",
      "https://example.invalid/proof",
      "--attestation-refs",
      "attestation://example",
      "--input-hashes",
      outputHash,
      "--output-hashes",
      outputHash,
      "--json",
    ], root).stdout
  ).node;

  const artifact = JSON.parse(
    run([
      "work",
      "artifact",
      "add",
      receipt.id,
      "inputs/image.txt",
      "--id",
      "archive.image-output",
      "--kind",
      "artifact",
      "--json",
    ], root).stdout
  );
  assert.equal(artifact.archive.archive_uri, "archive://archive.image-output");

  run(["work", "order", "update", order.id, "--status", "completed", "--json"], root);
  run(["work", "receipt", "update", receipt.id, "--receipt-status", "verified", "--add-proof-refs", "archive://archive.image-output", "--json"], root);
  run(["format"], root);
  const orderContent = fs.readFileSync(path.join(root, order.path), "utf8");
  assert.match(orderContent, /requester: user:\/\/ExampleRequester/);
  assert.match(orderContent, /request_ref: request:\/\/GenerateImage\/1/);

  run(["validate"], root);
  run(["index"], root);
  const pack = run(["pack", receipt.id, "--dry-run", "--stats"], root);
  assert.match(pack.stdout, /archive.image-output/);
});
