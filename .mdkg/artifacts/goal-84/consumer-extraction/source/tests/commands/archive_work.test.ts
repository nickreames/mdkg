import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { spawnSync } from "node:child_process";
import { makeTempDir } from "../helpers/fs";

const cliPath = path.resolve(__dirname, "..", "..", "cli.js");
const { createDeterministicZip } = require("../../util/zip") as {
  createDeterministicZip: (entryName: string, data: Buffer) => Buffer;
};

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

function sha256Buffer(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function updateConfig(root: string, mutate: (config: any) => void): void {
  const configPath = path.join(root, ".mdkg", "config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  mutate(config);
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
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

function convertManifestScaffoldToLegacySpec(root: string, node: { path: string }): { path: string } {
  const manifestPath = path.join(root, node.path);
  const specPath = path.join(path.dirname(manifestPath), "SPEC.md");
  fs.renameSync(manifestPath, specPath);
  updateFrontmatter(specPath, { type: "spec" });
  return { ...node, path: path.relative(root, specPath).split(path.sep).join("/") };
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
      "--visibility",
      "public",
      "--title",
      "Key Input Doc",
      "--refs",
      "https://example.invalid/input",
      "--json",
    ], root).stdout
  );
  assert.equal(created.archive.id, "archive.key-input-doc");
  assert.equal(created.archive.archive_uri, "archive://archive.key-input-doc");
  assert.equal(created.archive.visibility, "public");

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

  const listed = JSON.parse(run(["archive", "list", "--kind", "source", "--visibility", "public", "--json"], root).stdout);
  assert.equal(listed.count, 1);
  assert.equal(listed.items[0].id, "archive.key-input-doc");
  assert.equal(listed.items[0].visibility, "public");

  const shown = JSON.parse(run(["archive", "show", "archive://archive.key-input-doc", "--json"], root).stdout);
  assert.equal(shown.item.id, "archive.key-input-doc");
  run(["validate"], root);
});

test("archive add redacts outside-repo source paths", () => {
  const root = makeTempDir("mdkg-archive-external-source-");
  const externalRoot = makeTempDir("mdkg-archive-external-input-");
  run(["init", "--agent"], root);

  const sourcePath = path.join(externalRoot, "external_input.txt");
  fs.writeFileSync(sourcePath, "external input\n", "utf8");
  const created = JSON.parse(
    run([
      "archive",
      "add",
      sourcePath,
      "--id",
      "archive.external-input",
      "--json",
    ], root).stdout
  );

  const sidecar = path.join(root, created.archive.path);
  const content = fs.readFileSync(sidecar, "utf8");
  assert.match(content, /^source_path: external:external_input\.txt$/m);
  assert.doesNotMatch(content, new RegExp(externalRoot.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  run(["validate"], root);
});

test("archive validation and verify fail on missing zip cache and raw source drift", () => {
  const root = makeTempDir("mdkg-archive-missing-zip-");
  run(["init", "--agent"], root);
  fs.mkdirSync(path.join(root, "inputs"), { recursive: true });
  fs.writeFileSync(path.join(root, "inputs", "payload.txt"), "payload\n", "utf8");
  run(["archive", "add", "inputs/payload.txt", "--id", "archive.payload", "--json"], root);

  const zipPath = path.join(root, ".mdkg", "archive", "archive.payload", "payload.txt.zip");
  fs.rmSync(zipPath);
  const missingZipValidate = runFailure(["validate"], root);
  assert.match(missingZipValidate.stderr, /compressed cache missing/);
  const missingZipVerify = JSON.parse(runFailure(["archive", "verify", "archive.payload", "--json"], root).stdout);
  assert.equal(missingZipVerify.ok, false);
  assert.match(missingZipVerify.results[0].errors.join("\n"), /compressed cache missing/);

  run(["archive", "compress", "archive.payload", "--json"], root);
  const rawPath = path.join(root, ".mdkg", "archive", "archive.payload", "source", "payload.txt");
  fs.writeFileSync(rawPath, "payload drift\n", "utf8");
  const driftValidate = runFailure(["validate"], root);
  assert.match(driftValidate.stderr, /raw sha256 mismatch/);
  assert.match(driftValidate.stderr, /raw byte_size mismatch/);
  const driftVerify = JSON.parse(runFailure(["archive", "verify", "archive.payload", "--json"], root).stdout);
  assert.match(driftVerify.results[0].errors.join("\n"), /raw sha256 mismatch/);
  assert.match(driftVerify.results[0].errors.join("\n"), /raw byte_size mismatch/);
});

test("archive validation and verify fail on corrupt zip payloads even when compressed hash matches", () => {
  const root = makeTempDir("mdkg-archive-corrupt-zip-");
  run(["init", "--agent"], root);
  fs.mkdirSync(path.join(root, "inputs"), { recursive: true });
  fs.writeFileSync(path.join(root, "inputs", "payload.txt"), "payload\n", "utf8");
  run(["archive", "add", "inputs/payload.txt", "--id", "archive.payload", "--json"], root);

  const sidecar = path.join(root, ".mdkg", "archive", "archive.payload", "payload.txt.md");
  const zipPath = path.join(root, ".mdkg", "archive", "archive.payload", "payload.txt.zip");
  const corruptZip = Buffer.from("not a zip");
  fs.writeFileSync(zipPath, corruptZip);
  updateFrontmatter(sidecar, {
    compressed_sha256: `sha256:${sha256Buffer(corruptZip)}`,
  });

  const validateFailure = runFailure(["validate"], root);
  assert.match(validateFailure.stderr, /zip read failed/);
  const verifyFailure = runFailure(["archive", "verify", "archive.payload", "--json"], root);
  const receipt = JSON.parse(verifyFailure.stdout);
  assert.equal(receipt.ok, false);
  assert.match(receipt.results[0].errors.join("\n"), /zip read failed/);
});

test("archive validation fails on zip payload hash and byte size mismatches", () => {
  const root = makeTempDir("mdkg-archive-zip-payload-mismatch-");
  run(["init", "--agent"], root);
  fs.mkdirSync(path.join(root, "inputs"), { recursive: true });
  fs.writeFileSync(path.join(root, "inputs", "payload.txt"), "payload\n", "utf8");
  run(["archive", "add", "inputs/payload.txt", "--id", "archive.payload", "--json"], root);

  const sidecar = path.join(root, ".mdkg", "archive", "archive.payload", "payload.txt.md");
  const zipPath = path.join(root, ".mdkg", "archive", "archive.payload", "payload.txt.zip");
  const replacementZip = createDeterministicZip("payload.txt", Buffer.from("different payload\n"));
  fs.writeFileSync(zipPath, replacementZip);
  updateFrontmatter(sidecar, {
    compressed_sha256: `sha256:${sha256Buffer(replacementZip)}`,
  });

  const failure = runFailure(["validate"], root);
  assert.match(failure.stderr, /zip payload sha256 mismatch/);
  assert.match(failure.stderr, /zip payload byte_size mismatch/);
});

test("archive validation requires source_path in sidecars", () => {
  const root = makeTempDir("mdkg-archive-source-path-required-");
  run(["init", "--agent"], root);
  fs.mkdirSync(path.join(root, "inputs"), { recursive: true });
  fs.writeFileSync(path.join(root, "inputs", "payload.txt"), "payload\n", "utf8");
  run(["archive", "add", "inputs/payload.txt", "--id", "archive.payload", "--json"], root);

  const sidecar = path.join(root, ".mdkg", "archive", "archive.payload", "payload.txt.md");
  const content = fs
    .readFileSync(sidecar, "utf8")
    .split(/\r?\n/)
    .filter((line) => !line.startsWith("source_path:"))
    .join("\n");
  fs.writeFileSync(sidecar, content, "utf8");

  const failure = runFailure(["validate"], root);
  assert.match(failure.stderr, /source_path is required/);
});

test("doctor warns for large archive zip caches and threshold zero disables it", () => {
  const root = makeTempDir("mdkg-archive-large-cache-");
  run(["init", "--agent"], root);
  updateConfig(root, (config) => {
    config.archive.large_cache_warning_bytes = 1;
  });
  fs.mkdirSync(path.join(root, "inputs"), { recursive: true });
  fs.writeFileSync(path.join(root, "inputs", "payload.txt"), "payload\n", "utf8");
  run(["archive", "add", "inputs/payload.txt", "--id", "archive.payload", "--json"], root);

  const warned = JSON.parse(run(["doctor", "--json"], root).stdout);
  const largeCache = warned.checks.find((check: { name: string }) => check.name === "archive-large-cache");
  assert.equal(largeCache.level, "warn");
  assert.match(largeCache.detail, /archive\.payload\/payload\.txt\.zip/);

  updateConfig(root, (config) => {
    config.archive.large_cache_warning_bytes = 0;
  });
  const disabled = JSON.parse(run(["doctor", "--json"], root).stdout);
  const disabledLargeCache = disabled.checks.find((check: { name: string }) => check.name === "archive-large-cache");
  assert.equal(disabledLargeCache.level, undefined);
  assert.match(disabledLargeCache.detail, /disabled/);
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

  const manifest = JSON.parse(run(["new", "manifest", "Image Worker", "--id", "agent.image-worker", "--json"], root).stdout).node;
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
  updateFrontmatter(path.join(root, manifest.path), {
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
      "--trigger-ref",
      "trigger://manual/generate-image",
      "--input-refs",
      "archive://archive.prompt",
      "--queue-refs",
      "queue://project-db/image-generation/order.generate-image-1",
      "--requested-outputs",
      "image_url:url:required",
      "--constraint-refs",
      "https://example.invalid/constraint",
      "--json",
    ], root).stdout
  ).node;
  const matchingOrder = JSON.parse(
    run([
      "work",
      "order",
      "new",
      "Generate Image Order Copy",
      "--id",
      "order.generate-image-2",
      "--work-id",
      "work.generate-image",
      "--requester",
      "user://ExampleRequester",
      "--request-ref",
      "request://GenerateImage/1",
      "--trigger-ref",
      "trigger://manual/generate-image",
      "--input-refs",
      "archive://archive.prompt",
      "--queue-refs",
      "queue://project-db/image-generation/order.generate-image-1",
      "--requested-outputs",
      "image_url:url:required",
      "--constraint-refs",
      "https://example.invalid/constraint",
      "--json",
    ], root).stdout
  ).node;

  const supplementalPath = path.join(inputDir, "supplemental.txt");
  fs.writeFileSync(supplementalPath, "supplemental source\n", "utf8");
  const orderArtifact = JSON.parse(
    run([
      "work",
      "artifact",
      "add",
      `root:${order.id}`,
      "inputs/supplemental.txt",
      "--id",
      "archive.supplemental",
      "--kind",
      "source",
      "--json",
    ], root).stdout
  );
  assert.equal(orderArtifact.target.qid, `root:${order.id}`);
  assert.equal(orderArtifact.archive.archive_uri, "archive://archive.supplemental");

  const outputPath = path.join(inputDir, "image.txt");
  fs.writeFileSync(outputPath, "artifact placeholder\n", "utf8");
  const outputHash = `sha256:${sha256(outputPath)}`;
  const supplementalEvidenceHash = "sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc";
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
      "superseded",
      "--cost-ref",
      "cost://redacted/generate-image-1",
      "--redaction-policy",
      "redacted_summary",
      "--artifacts",
      "artifact://image-output-placeholder",
      "--proof-refs",
      "https://example.invalid/proof",
      "--attestation-refs",
      "attestation://example",
      "--evidence-hashes",
      outputHash,
      "--input-hashes",
      outputHash,
      "--output-hashes",
      outputHash,
      "--json",
    ], root).stdout
  ).node;
  assert.equal(receipt.id, "receipt.generate-image-1");

  const artifact = JSON.parse(
    run([
      "work",
      "artifact",
      "add",
      `root:${receipt.id}`,
      "inputs/image.txt",
      "--id",
      "archive.image-output",
      "--kind",
      "artifact",
      "--json",
    ], root).stdout
  );
  assert.equal(artifact.archive.archive_uri, "archive://archive.image-output");

  run([
    "work",
    "order",
    "update",
    `root:${order.id}`,
    "--status",
    "completed",
    "--add-input-refs",
    "archive://archive.prompt,archive://archive.prompt",
    "--add-queue-refs",
    "queue://project-db/image-generation/order.generate-image-1,queue://project-db/image-generation/order.generate-image-1,queue://project-db/image-generation/manual-checkpoint",
    "--add-artifacts",
    "artifact://image-output-placeholder,artifact://image-output-placeholder",
    "--json",
  ], root);
  run([
    "work",
    "receipt",
    "update",
    `root:${receipt.id}`,
    "--receipt-status",
    "verified",
    "--add-artifacts",
    "artifact://image-output-placeholder,artifact://image-output-placeholder",
    "--add-proof-refs",
    "archive://archive.image-output,archive://archive.image-output",
    "--add-evidence-hashes",
    `${outputHash},${supplementalEvidenceHash},${supplementalEvidenceHash}`,
    "--json",
  ], root);
  run([
    "work",
    "receipt",
    "update",
    `root:${receipt.id}`,
    "--receipt-status",
    "superseded",
    "--add-attestation-refs",
    "attestation://review/superseded,attestation://review/superseded",
    "--json",
  ], root);
  run(["format"], root);
  const orderContent = fs.readFileSync(path.join(root, order.path), "utf8");
  assert.match(orderContent, /^order_status: completed$/m);
  assert.match(orderContent, /requester: user:\/\/ExampleRequester/);
  assert.match(orderContent, /request_ref: request:\/\/GenerateImage\/1/);
  assert.match(orderContent, /trigger_ref: trigger:\/\/manual\/generate-image/);
  const payloadHash = orderContent.match(/^payload_hash: (sha256:[a-f0-9]{64})$/m)?.[1];
  assert.ok(payloadHash, "work order should include a deterministic payload hash");
  const matchingOrderContent = fs.readFileSync(path.join(root, matchingOrder.path), "utf8");
  assert.match(matchingOrderContent, new RegExp(`^payload_hash: ${payloadHash}$`, "m"));
  assert.equal((orderContent.match(/queue:\/\/project-db\/image-generation\/order\.generate-image-1/g) ?? []).length, 1);
  assert.equal((orderContent.match(/queue:\/\/project-db\/image-generation\/manual-checkpoint/g) ?? []).length, 1);
  assert.equal((orderContent.match(/archive:\/\/archive\.prompt/g) ?? []).length, 1);
  assert.equal((orderContent.match(/archive:\/\/archive\.supplemental/g) ?? []).length, 1);
  assert.equal((orderContent.match(/artifact:\/\/image-output-placeholder/g) ?? []).length, 1);
  const receiptContent = fs.readFileSync(path.join(root, receipt.path), "utf8");
  assert.match(receiptContent, /^receipt_status: superseded$/m);
  assert.match(receiptContent, /^redaction_policy: redacted_summary$/m);
  assert.match(receiptContent, /proof_refs: \[[^\]]*https:\/\/example\.invalid\/proof[^\]]*\]/);
  assert.match(receiptContent, /proof_refs: \[[^\]]*archive:\/\/archive\.image-output[^\]]*\]/);
  assert.match(receiptContent, /attestation_refs: \[attestation:\/\/example, attestation:\/\/review\/superseded\]/);
  assert.equal((receiptContent.match(/artifact:\/\/image-output-placeholder/g) ?? []).length, 1);
  assert.equal((receiptContent.match(/archive:\/\/archive\.image-output/g) ?? []).length, 2);
  assert.equal((receiptContent.match(new RegExp(outputHash, "g")) ?? []).length, 3);
  assert.equal((receiptContent.match(new RegExp(supplementalEvidenceHash, "g")) ?? []).length, 1);
  assert.match(receiptContent, new RegExp(`input_hashes: \\[${outputHash}\\]`));
  assert.match(receiptContent, new RegExp(`output_hashes: \\[${outputHash}\\]`));

  const orderStatus = JSON.parse(run(["work", "order", "status", `root:${order.id}`, "--json"], root).stdout);
  assert.equal(orderStatus.kind, "work_order_status");
  assert.equal(orderStatus.order.qid, `root:${order.id}`);
  assert.equal(orderStatus.order.status, "completed");
  assert.equal(orderStatus.order.work_qid, `root:${work.id}`);
  assert.equal(orderStatus.order.requester, "user://ExampleRequester");
  assert.equal(orderStatus.order.queue_refs.length, 2);
  assert.equal(orderStatus.order.artifacts.length, 1);
  assert.equal(orderStatus.receipt_count, 1);
  assert.equal(orderStatus.receipts[0].qid, `root:${receipt.id}`);
  assert.equal(orderStatus.receipts[0].receipt_status, "superseded");
  assert.equal(orderStatus.receipts[0].redaction_policy, "redacted_summary");
  assert.deepEqual(orderStatus.receipts[0].evidence_hashes.sort(), [
    outputHash,
    supplementalEvidenceHash,
  ].sort());
  const missingStatus = runFailure(["work", "order", "status", "order.missing", "--json"], root);
  assert.match(missingStatus.stderr, /work order not found in workspace root: order\.missing/);

  const verifiedReceipt = JSON.parse(run(["work", "receipt", "verify", `root:${receipt.id}`, "--json"], root).stdout);
  assert.equal(verifiedReceipt.kind, "work_receipt_verify");
  assert.equal(verifiedReceipt.ok, true);
  assert.equal(verifiedReceipt.receipt.qid, `root:${receipt.id}`);
  assert.equal(verifiedReceipt.receipt.work_order_qid, `root:${order.id}`);
  assert.equal(verifiedReceipt.work_order.qid, `root:${order.id}`);
  assert.equal(verifiedReceipt.work_order.work_qid, `root:${work.id}`);
  assert.equal(verifiedReceipt.checks.find((check: { name: string }) => check.name === "evidence_present").ok, true);
  assert.equal(verifiedReceipt.checks.find((check: { name: string }) => check.name === "archive_refs").ok, true);
  assert.deepEqual(verifiedReceipt.errors, []);

  const emptyReceipt = JSON.parse(
    run([
      "work",
      "receipt",
      "new",
      "Empty Evidence Receipt",
      "--id",
      "receipt.empty-evidence",
      "--work-order-id",
      order.id,
      "--outcome",
      "success",
      "--json",
    ], root).stdout
  ).node;
  const verifyFailure = runFailure(["work", "receipt", "verify", emptyReceipt.id, "--json"], root);
  const failedReceipt = JSON.parse(verifyFailure.stdout);
  assert.equal(failedReceipt.kind, "work_receipt_verify");
  assert.equal(failedReceipt.ok, false);
  assert.ok(
    failedReceipt.errors.some((error: string) =>
      error.includes("receipt has no artifacts, proof refs, attestations, or hashes")
    )
  );
  assert.match(verifyFailure.stderr, /receipt verification failed/);

  const invalidNew = runFailure([
    "work",
    "receipt",
    "new",
    "Invalid Receipt",
    "--id",
    "receipt.invalid-status",
    "--work-order-id",
    order.id,
    "--outcome",
    "success",
    "--receipt-status",
    "archived",
    "--json",
  ], root);
  assert.match(invalidNew.stderr, /--receipt-status must be one of recorded, verified, rejected, superseded/);
  const invalidUpdate = runFailure(["work", "receipt", "update", receipt.id, "--receipt-status", "archived", "--json"], root);
  assert.match(invalidUpdate.stderr, /--receipt-status must be one of recorded, verified, rejected, superseded/);
  const invalidRedactionPolicy = runFailure([
    "work",
    "receipt",
    "new",
    "Invalid Redaction",
    "--id",
    "receipt.invalid-redaction",
    "--work-order-id",
    order.id,
    "--outcome",
    "success",
    "--redaction-policy",
    "raw_runtime_log",
    "--json",
  ], root);
  assert.match(invalidRedactionPolicy.stderr, /--redaction-policy must be one of refs_and_hashes_only, redacted_summary, external_private/);
  const invalidEvidenceHash = runFailure([
    "work",
    "receipt",
    "update",
    receipt.id,
    "--add-evidence-hashes",
    "sha256:not-a-hash",
    "--json",
  ], root);
  assert.match(invalidEvidenceHash.stderr, /--add-evidence-hashes must be sha256:<64 lowercase hex chars>/);
  const invalidPayloadHash = runFailure([
    "work",
    "order",
    "new",
    "Invalid Hash Order",
    "--id",
    "order.invalid-hash",
    "--work-id",
    work.id,
    "--requester",
    "user://ExampleRequester",
    "--payload-hash",
    "sha256:not-a-hash",
    "--json",
  ], root);
  assert.match(invalidPayloadHash.stderr, /--payload-hash must be sha256:<64 lowercase hex chars>/);

  run(["validate"], root);
  run(["index"], root);
  const pack = run(["pack", receipt.id, "--dry-run", "--stats"], root);
  assert.match(pack.stdout, /archive.image-output/);
});

test("work trigger creates deterministic submitted order mirrors without executing work", () => {
  const root = makeTempDir("mdkg-work-trigger-cli-");
  run(["init", "--agent"], root);

  const manifest = JSON.parse(run(["new", "manifest", "Image Worker", "--id", "agent.image-worker", "--json"], root).stdout).node;
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
  updateFrontmatter(path.join(root, manifest.path), {
    work_contracts: `[${path.basename(path.dirname(work.path))}/WORK.md]`,
    relates: "[work.generate-image]",
  });

  const triggered = JSON.parse(
    run([
      "work",
      "trigger",
      "work.generate-image",
      "--requester",
      "user://ExampleRequester",
      "--json",
    ], root).stdout
  );
  assert.equal(triggered.action, "triggered");
  assert.equal(triggered.node.type, "work_order");
  assert.match(triggered.node.id, /^order\.work\.generate\.image\.[a-f0-9]{12}$/);
  assert.equal(triggered.trigger.work_qid, "root:work.generate-image");
  assert.equal(triggered.trigger.executed, false);
  assert.deepEqual(triggered.trigger.enqueue, { requested: false });
  assert.match(triggered.trigger.payload_hash, /^sha256:[a-f0-9]{64}$/);

  const orderContent = fs.readFileSync(path.join(root, triggered.node.path), "utf8");
  assert.match(orderContent, /^work_id: work\.generate-image$/m);
  assert.match(orderContent, /^requester: user:\/\/ExampleRequester$/m);
  assert.match(orderContent, /^order_status: submitted$/m);
  assert.match(orderContent, /^trigger_ref: trigger\.mdkg-work-trigger$/m);
  assert.match(orderContent, new RegExp(`^payload_hash: ${triggered.trigger.payload_hash}$`, "m"));
  assert.match(orderContent, /requested_outputs: \[image_url:url:required\]/);
  assert.doesNotMatch(orderContent, /receipt_status:/);

  const repeated = runFailure([
    "work",
    "trigger",
    "work.generate-image",
    "--requester",
    "user://ExampleRequester",
    "--json",
  ], root);
  assert.match(repeated.stderr, /node already exists/);

  const missingDbEnqueue = runFailure([
    "work",
    "trigger",
    "agent.image-worker",
    "--id",
    "order.manifest-trigger-missing-db",
    "--title",
    "Manifest Triggered Missing Db",
    "--requester",
    "user://ManifestRequester",
    "--enqueue",
    "local_queue",
    "--json",
  ], root);
  assert.match(missingDbEnqueue.stderr, /work trigger --enqueue requires a valid project DB/);

  run(["db", "init", "--json"], root);
  run(["db", "migrate", "--json"], root);
  const missingQueueEnqueue = runFailure([
    "work",
    "trigger",
    "agent.image-worker",
    "--id",
    "order.manifest-trigger-missing-queue",
    "--title",
    "Manifest Triggered Missing Queue",
    "--requester",
    "user://ManifestRequester",
    "--enqueue",
    "local_queue",
    "--json",
  ], root);
  assert.match(missingQueueEnqueue.stderr, /project DB queue not found: local_queue/);

  run(["db", "queue", "create", "local_queue", "--json"], root);
  const manifestTriggered = JSON.parse(
    run([
      "work",
      "trigger",
      "agent.image-worker",
      "--id",
      "order.manifest-trigger",
      "--title",
      "Manifest Triggered Order",
      "--requester",
      "user://ManifestRequester",
      "--enqueue",
      "local_queue",
      "--json",
    ], root).stdout
  );
  assert.equal(manifestTriggered.node.id, "order.manifest-trigger");
  assert.equal(manifestTriggered.node.title, "Manifest Triggered Order");
  assert.equal(manifestTriggered.trigger.source_qid, "root:agent.image-worker");
  assert.equal(manifestTriggered.trigger.work_qid, "root:work.generate-image");
  assert.equal(manifestTriggered.trigger.executed, false);
  assert.deepEqual(manifestTriggered.trigger.enqueue, {
    requested: true,
    queue_name: "local_queue",
    queue_ref: "queue://project-db/local_queue/order.manifest-trigger",
    message_id: "order.manifest-trigger",
    enqueued: true,
    created: true,
    duplicate: false,
    message_status: "ready",
    message_payload_hash: manifestTriggered.trigger.enqueue.message_payload_hash,
  });
  assert.match(manifestTriggered.trigger.enqueue.message_payload_hash, /^sha256:[a-f0-9]{64}$/);
  const queued = JSON.parse(
    run(["db", "queue", "show", "local_queue", "order.manifest-trigger", "--json"], root).stdout
  );
  assert.equal(queued.message.dedupe_key, "root:order.manifest-trigger");
  assert.equal(queued.message.status, "ready");
  const queuedPayload = JSON.parse(queued.message.payload_json);
  assert.equal(queuedPayload.kind, "mdkg.work_order.triggered");
  assert.equal(queuedPayload.work_order_qid, "root:order.manifest-trigger");
  assert.equal(queuedPayload.work_qid, "root:work.generate-image");
  assert.equal(queuedPayload.source_qid, "root:agent.image-worker");
  assert.equal(queuedPayload.payload_hash, manifestTriggered.trigger.payload_hash);
  assert.equal(queuedPayload.queue_ref, "queue://project-db/local_queue/order.manifest-trigger");

  const manifestOrderContent = fs.readFileSync(path.join(root, manifestTriggered.node.path), "utf8");
  assert.match(manifestOrderContent, /queue_refs: \[queue:\/\/project-db\/local_queue\/order\.manifest-trigger\]/);

  run(["validate"], root);
});

test("workflow creation rolls back when its automatic event cannot be appended", () => {
  const root = makeTempDir("mdkg-work-event-rollback-");
  run(["init", "--agent"], root);
  const outside = makeTempDir("mdkg-work-event-rollback-outside-");
  const sentinel = path.join(outside, "events.jsonl");
  fs.writeFileSync(sentinel, "sentinel\n", "utf8");
  const eventsPath = path.join(root, ".mdkg", "work", "events", "events.jsonl");
  fs.rmSync(eventsPath);
  fs.symlinkSync(sentinel, eventsPath);

  const failure = runFailure([
    "work", "contract", "new", "Rollback Work",
    "--id", "work.rollback",
    "--agent-id", "agent.rollback",
    "--kind", "generic",
    "--inputs", "prompt:text:required",
    "--outputs", "result:text:required",
    "--json",
  ], root);
  assert.match(failure.stderr, /symbolic link|linked/i);
  assert.equal(
    fs.existsSync(path.join(root, ".mdkg", "work", "work.rollback-rollback-work", "WORK.md")),
    false
  );
  assert.equal(fs.readFileSync(sentinel, "utf8"), "sentinel\n");
});

test("work trigger accepts legacy SPEC refs during the compatibility release", () => {
  const root = makeTempDir("mdkg-work-trigger-legacy-spec-cli-");
  run(["init", "--agent"], root);

  const legacySpec = convertManifestScaffoldToLegacySpec(
    root,
    JSON.parse(
      run(["new", "manifest", "Legacy Spec Worker", "--id", "agent.legacy-spec-worker", "--json"], root)
        .stdout
    ).node
  );
  const work = JSON.parse(
    run([
      "work",
      "contract",
      "new",
      "Legacy Spec Render",
      "--id",
      "work.legacy-spec-render",
      "--agent-id",
      "agent.legacy-spec-worker",
      "--kind",
      "artifact_rendering",
      "--inputs",
      "prompt:text:required",
      "--outputs",
      "artifact_uri:uri:required",
      "--required-capabilities",
      "model.runtime.generate",
      "--pricing-model",
      "included",
      "--json",
    ], root).stdout
  ).node;
  updateFrontmatter(path.join(root, legacySpec.path), {
    work_contracts: `[${path.basename(path.dirname(work.path))}/WORK.md]`,
    relates: "[work.legacy-spec-render]",
  });

  const triggered = JSON.parse(
    run([
      "work",
      "trigger",
      "agent.legacy-spec-worker",
      "--id",
      "order.legacy-spec-trigger",
      "--title",
      "Legacy SPEC Triggered Order",
      "--requester",
      "user://LegacySpecRequester",
      "--json",
    ], root).stdout
  );
  assert.equal(triggered.node.id, "order.legacy-spec-trigger");
  assert.equal(triggered.trigger.source_qid, "root:agent.legacy-spec-worker");
  assert.equal(triggered.trigger.work_qid, "root:work.legacy-spec-render");
  assert.equal(triggered.trigger.executed, false);
  assert.equal(legacySpec.path.endsWith("/SPEC.md"), true);

  const orphan = convertManifestScaffoldToLegacySpec(
    root,
    JSON.parse(
      run(["new", "manifest", "Legacy Orphan Worker", "--id", "agent.legacy-orphan", "--json"], root)
        .stdout
    ).node
  );
  const orphanFailure = runFailure([
    "work",
    "trigger",
    "agent.legacy-orphan",
    "--id",
    "order.legacy-orphan-trigger",
    "--requester",
    "user://LegacySpecRequester",
    "--json",
  ], root);
  assert.match(orphanFailure.stderr, /legacy SPEC\.md root:agent\.legacy-orphan has no resolvable WORK\.md contract/);
  assert.equal(orphan.path.endsWith("/SPEC.md"), true);

  run(["validate"], root);
});

test("work trigger accepts canonical manifest refs and reports manifest-first contract errors", () => {
  const root = makeTempDir("mdkg-work-trigger-manifest-cli-");
  run(["init", "--agent"], root);

  const manifest = JSON.parse(
    run(["new", "manifest", "Manifest Worker", "--id", "agent.manifest-worker", "--json"], root).stdout
  ).node;
  const work = JSON.parse(
    run([
      "work",
      "contract",
      "new",
      "Render Thumbnail",
      "--id",
      "work.render-thumbnail",
      "--agent-id",
      "agent.manifest-worker",
      "--kind",
      "image_generation",
      "--inputs",
      "source:image:required",
      "--outputs",
      "thumbnail_url:url:required",
      "--required-capabilities",
      "model.image.generate",
      "--pricing-model",
      "included",
      "--json",
    ], root).stdout
  ).node;
  updateFrontmatter(path.join(root, manifest.path), {
    work_contracts: `[${path.basename(path.dirname(work.path))}/WORK.md]`,
    relates: "[work.render-thumbnail]",
  });

  const manifestTriggered = JSON.parse(
    run([
      "work",
      "trigger",
      "agent.manifest-worker",
      "--id",
      "order.manifest-trigger",
      "--title",
      "Manifest Triggered Order",
      "--requester",
      "user://ManifestRequester",
      "--json",
    ], root).stdout
  );
  assert.equal(manifestTriggered.node.id, "order.manifest-trigger");
  assert.equal(manifestTriggered.trigger.source_qid, "root:agent.manifest-worker");
  assert.equal(manifestTriggered.trigger.work_qid, "root:work.render-thumbnail");
  assert.equal(manifestTriggered.trigger.executed, false);

  const orphan = JSON.parse(
    run(["new", "manifest", "Orphan Manifest Worker", "--id", "agent.orphan-worker", "--json"], root).stdout
  ).node;
  const orphanFailure = runFailure([
    "work",
    "trigger",
    "agent.orphan-worker",
    "--id",
    "order.orphan-trigger",
    "--requester",
    "user://ManifestRequester",
    "--json",
  ], root);
  assert.match(orphanFailure.stderr, /MANIFEST\.md root:agent\.orphan-worker has no resolvable WORK\.md contract/);
  assert.equal(orphan.path.endsWith("/MANIFEST.md"), true);

  const multi = JSON.parse(
    run(["new", "manifest", "Multi Manifest Worker", "--id", "agent.multi-worker", "--json"], root).stdout
  ).node;
  const multiA = JSON.parse(run([
    "work",
    "contract",
    "new",
    "Multi Work A",
    "--id",
    "work.multi-a",
    "--agent-id",
    "agent.multi-worker",
    "--kind",
    "analysis",
    "--inputs",
    "request:text:required",
    "--outputs",
    "result:text:required",
    "--json",
  ], root).stdout).node;
  const multiB = JSON.parse(run([
    "work",
    "contract",
    "new",
    "Multi Work B",
    "--id",
    "work.multi-b",
    "--agent-id",
    "agent.multi-worker",
    "--kind",
    "analysis",
    "--inputs",
    "request:text:required",
    "--outputs",
    "result:text:required",
    "--json",
  ], root).stdout).node;
  updateFrontmatter(path.join(root, multi.path), {
    work_contracts: `[${path.basename(path.dirname(multiA.path))}/WORK.md, ${path.basename(path.dirname(multiB.path))}/WORK.md]`,
    relates: "[work.multi-a, work.multi-b]",
  });
  const multiFailure = runFailure([
    "work",
    "trigger",
    "agent.multi-worker",
    "--id",
    "order.multi-trigger",
    "--requester",
    "user://ManifestRequester",
    "--json",
  ], root);
  assert.match(
    multiFailure.stderr,
    /MANIFEST\.md root:agent\.multi-worker has multiple work contracts; trigger one explicitly: root:work\.multi-a, root:work\.multi-b/
  );

  run(["validate"], root);
});
