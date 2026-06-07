#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const tempBase = fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir();
const NPM_CMD = process.env.npm_execpath || (process.platform === "win32" ? "npm.cmd" : "npm");
const GIT_CMD = process.env.GIT || (process.platform === "win32" ? "git.exe" : "git");

function commandEnv(extra = {}) {
  const npmCache = process.env.NPM_CONFIG_CACHE || path.join(tempBase, "mdkg-npm-cache");
  fs.mkdirSync(npmCache, { recursive: true });
  return {
    ...process.env,
    NPM_CONFIG_CACHE: npmCache,
    npm_config_cache: npmCache,
    NPM_CONFIG_DRY_RUN: "false",
    npm_config_dry_run: "false",
    ...extra,
  };
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || repoRoot,
    env: commandEnv(options.env || {}),
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status !== 0) {
    throw new Error(
      [
        `command failed: ${command} ${args.join(" ")}`,
        `cwd: ${options.cwd || repoRoot}`,
        `exit: ${result.status}`,
        `stdout:\n${result.stdout}`,
        `stderr:\n${result.stderr}`,
      ].join("\n")
    );
  }
  return result.stdout.trim();
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertExists(filePath) {
  assert(fs.existsSync(filePath), `expected path to exist: ${filePath}`);
}

function parseJson(output) {
  return JSON.parse(output);
}

function mdkg(binPath, args, cwd) {
  return run(binPath, args, { cwd });
}

function updateFrontmatter(filePath, replacements) {
  const content = fs.readFileSync(filePath, "utf8");
  const next = content.replace(/^---\n([\s\S]*?)\n---/, (_match, rawFrontmatter) => {
    const seen = new Set();
    const lines = rawFrontmatter.split(/\r?\n/).map((line) => {
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

function packAndInstall(tempRoot) {
  const packDir = path.join(tempRoot, "pack");
  const prefix = path.join(tempRoot, "prefix");
  fs.mkdirSync(packDir, { recursive: true });
  fs.mkdirSync(prefix, { recursive: true });

  const packOutput = run(NPM_CMD, ["pack", "--silent", "--dry-run=false", "--pack-destination", packDir]);
  const tarball = packOutput
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .pop();
  assert(tarball, "npm pack did not return a tarball");
  const tarballPath = path.join(packDir, path.basename(tarball));
  assertExists(tarballPath);

  run(NPM_CMD, ["install", "-g", tarballPath, "--prefix", prefix, "--foreground-scripts"], {
    cwd: tempRoot,
    env: { npm_config_prefix: prefix },
  });
  const binPath = process.platform === "win32" ? path.join(prefix, "mdkg.cmd") : path.join(prefix, "bin", "mdkg");
  assertExists(binPath);
  return { binPath, tarballPath };
}

function createSpecAndWork(binPath, root) {
  const spec = parseJson(mdkg(binPath, ["new", "spec", "Invocation Worker", "--id", "agent.invocation-worker", "--json"], root)).node;
  const work = parseJson(
    mdkg(
      binPath,
      [
        "work",
        "contract",
        "new",
        "Invoke Work",
        "--id",
        "work.invoke",
        "--agent-id",
        "agent.invocation-worker",
        "--kind",
        "work_invocation",
        "--inputs",
        "request_ref:ref:required",
        "--outputs",
        "receipt_ref:ref:required",
        "--required-capabilities",
        "mdkg.graph.read,mdkg.graph.write",
        "--pricing-model",
        "included",
        "--json",
      ],
      root
    )
  ).node;
  updateFrontmatter(path.join(root, spec.path), {
    work_contracts: `[${path.basename(path.dirname(work.path))}/WORK.md]`,
    relates: "[work.invoke]",
  });
  return { spec, work };
}

function verifyReceipt(binPath, root, receiptId) {
  const verified = parseJson(mdkg(binPath, ["work", "receipt", "verify", receiptId, "--json"], root));
  assert(verified.ok === true, `receipt did not verify: ${receiptId}`);
  assert(verified.checks.some((check) => check.name === "work_order_link" && check.ok), "missing work_order_link check");
  assert(verified.checks.some((check) => check.name === "evidence_present" && check.ok), "missing evidence_present check");
  return verified;
}

function main() {
  const tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-work-invocation-smoke-"));
  try {
    const { binPath, tarballPath } = packAndInstall(tempRoot);
    const root = path.join(tempRoot, "repo");
    fs.mkdirSync(root, { recursive: true });
    run(GIT_CMD, ["init", "-q"], { cwd: root });

    mdkg(binPath, ["init", "--agent"], root);
    createSpecAndWork(binPath, root);

    const direct = parseJson(
      mdkg(
        binPath,
        [
          "work",
          "trigger",
          "agent.invocation-worker",
          "--id",
          "order.invoke-direct",
          "--title",
          "Direct Invocation Order",
          "--requester",
          "user://Smoke",
          "--json",
        ],
        root
      )
    );
    assert(direct.trigger.executed === false, "direct trigger executed work");
    assert(direct.trigger.enqueue.requested === false, "direct trigger unexpectedly requested queue delivery");

    let status = parseJson(mdkg(binPath, ["work", "order", "status", "order.invoke-direct", "--json"], root));
    assert(status.receipt_count === 0, "direct order should start without receipts");
    mdkg(
      binPath,
      [
        "work",
        "receipt",
        "new",
        "Direct Invocation Receipt",
        "--id",
        "receipt.invoke-direct",
        "--work-order-id",
        "order.invoke-direct",
        "--outcome",
        "success",
        "--proof-refs",
        "proof://work-invocation/direct",
        "--evidence-hashes",
        direct.trigger.payload_hash,
        "--json",
      ],
      root
    );
    verifyReceipt(binPath, root, "receipt.invoke-direct");
    status = parseJson(mdkg(binPath, ["work", "order", "status", "order.invoke-direct", "--json"], root));
    assert(status.receipt_count === 1, "direct order should link one receipt");

    assert(parseJson(mdkg(binPath, ["db", "init", "--json"], root)).ok === true, "db init failed");
    assert(parseJson(mdkg(binPath, ["db", "migrate", "--json"], root)).applied_count === 5, "db migrate failed");
    assert(parseJson(mdkg(binPath, ["db", "verify", "--json"], root)).ok === true, "db verify failed");
    mdkg(binPath, ["db", "queue", "create", "invocation", "--json"], root);

    const queued = parseJson(
      mdkg(
        binPath,
        [
          "work",
          "trigger",
          "work.invoke",
          "--id",
          "order.invoke-queued",
          "--title",
          "Queued Invocation Order",
          "--requester",
          "user://Smoke",
          "--enqueue",
          "invocation",
          "--json",
        ],
        root
      )
    );
    assert(queued.trigger.enqueue.enqueued === true, "queued trigger did not enqueue");
    assert(queued.trigger.enqueue.queue_ref === "queue://project-db/invocation/order.invoke-queued", "queued trigger ref mismatch");
    const message = parseJson(mdkg(binPath, ["db", "queue", "show", "invocation", "order.invoke-queued", "--json"], root)).message;
    const payload = JSON.parse(message.payload_json);
    assert(payload.work_order_qid === "root:order.invoke-queued", "queue payload missing work order qid");
    assert(payload.payload_hash === queued.trigger.payload_hash, "queue payload hash mismatch");
    const claimed = parseJson(
      mdkg(binPath, ["db", "queue", "claim", "invocation", "--lease-owner", "smoke-worker", "--lease-ms", "5000", "--json"], root)
    ).message;
    assert(claimed.message_id === "order.invoke-queued", "queue claim returned the wrong message");
    mdkg(binPath, ["db", "queue", "ack", "invocation", "order.invoke-queued", "--lease-owner", "smoke-worker", "--json"], root);
    const stats = parseJson(mdkg(binPath, ["db", "queue", "stats", "invocation", "--json"], root)).stats;
    assert(stats.by_status.acked === 1, "queue ack count mismatch");

    mdkg(
      binPath,
      [
        "work",
        "receipt",
        "new",
        "Queued Invocation Receipt",
        "--id",
        "receipt.invoke-queued",
        "--work-order-id",
        "order.invoke-queued",
        "--outcome",
        "success",
        "--proof-refs",
        "queue://project-db/invocation/order.invoke-queued",
        "--evidence-hashes",
        queued.trigger.enqueue.message_payload_hash,
        "--json",
      ],
      root
    );
    verifyReceipt(binPath, root, "receipt.invoke-queued");

    mdkg(binPath, ["index"], root);
    const chain = parseJson(mdkg(binPath, ["capability", "search", "SPEC WORK_ORDER RECEIPT", "--kind", "work", "--json"], root));
    const workRecord = chain.items.find((item) => item.id === "work.invoke");
    assert(workRecord, "capability chain search missing work.invoke");
    assert(workRecord.linkage.spec_qids.includes("root:agent.invocation-worker"), "chain missing SPEC qid");
    assert(workRecord.linkage.work_order_qids.includes("root:order.invoke-direct"), "chain missing direct order qid");
    assert(workRecord.linkage.work_order_qids.includes("root:order.invoke-queued"), "chain missing queued order qid");
    assert(workRecord.linkage.receipt_qids.includes("root:receipt.invoke-direct"), "chain missing direct receipt qid");
    assert(workRecord.linkage.receipt_qids.includes("root:receipt.invoke-queued"), "chain missing queued receipt qid");

    mdkg(binPath, ["db", "verify", "--json"], root);
    mdkg(binPath, ["validate"], root);
    console.log(`work invocation smoke passed: ${path.basename(tarballPath)} at ${tempRoot}`);
  } finally {
    if (tempRoot && fs.existsSync(tempRoot)) {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  }
}

try {
  main();
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
}
