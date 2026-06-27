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

function assertIncludes(haystack, needle, message) {
  assert(haystack.includes(needle), `${message}: missing ${needle}`);
}

function parseJson(output) {
  return JSON.parse(output);
}

function mdkg(binPath, args, cwd) {
  return run(binPath, args, { cwd });
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
  const packageRoot = path.join(prefix, "lib", "node_modules", "mdkg");
  assertExists(binPath);
  assertExists(path.join(packageRoot, "README.md"));
  return { binPath, packageRoot, tarballPath };
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

function assertValidateOk(output, label) {
  const parsed = parseJson(output);
  if (Object.prototype.hasOwnProperty.call(parsed, "ok")) {
    assert(parsed.ok === true, `${label} was not ok`);
  }
  if (Array.isArray(parsed.errors)) {
    assert(parsed.errors.length === 0, `${label} had validation errors`);
  }
  return parsed;
}

function assertHelp(packageRoot, binPath, root) {
  const rootReadme = fs.readFileSync(path.join(packageRoot, "README.md"), "utf8");
  const seededReadme = fs.readFileSync(path.join(packageRoot, "dist", "init", "README.md"), "utf8");
  assertIncludes(rootReadme, "mdkg work trigger work.generate-image --id order.generate-image-1 --requester user://example", "root README trigger example");
  assertIncludes(rootReadme, "mdkg work order status order.generate-image-1 --json", "root README status example");
  assertIncludes(rootReadme, "--work-order-id order.generate-image-1", "root README receipt example");
  assertIncludes(rootReadme, "Create a manual order instead of a trigger-created order", "root README manual order boundary");
  assertIncludes(seededReadme, "mdkg work trigger work.example --id order.example-1 --requester user://example", "seeded README trigger example");
  assertIncludes(seededReadme, "mdkg work order status order.example-1 --json", "seeded README status example");
  assertIncludes(seededReadme, "--work-order-id order.example-1", "seeded README receipt example");
  assertIncludes(seededReadme, "Create a manual order instead of a trigger-created order", "seeded README manual order boundary");

  const workHelp = mdkg(binPath, ["help", "work"], root);
  assertIncludes(workHelp, "mdkg work order new|status|update", "work help");
  assertIncludes(workHelp, "mdkg work receipt new|verify|update", "work help");
  const triggerHelp = mdkg(binPath, ["help", "work", "trigger"], root);
  assertIncludes(triggerHelp, "mdkg work trigger work.example --id order.example-1 --requester user://example --json", "work trigger help");
  assertIncludes(triggerHelp, "Accepted targets: direct WORK.md ref, or MANIFEST.md/SPEC.md ref with exactly one resolvable work contract.", "work trigger help");
  const orderHelp = mdkg(binPath, ["help", "work", "order"], root);
  assertIncludes(orderHelp, "work order status is read-only and reports deterministic JSON order state plus linked receipts.", "work order help");
  const receiptHelp = mdkg(binPath, ["help", "work", "receipt"], root);
  assertIncludes(receiptHelp, "work receipt verify is read-only and reports deterministic JSON linkage", "work receipt help");
  const specHelp = mdkg(binPath, ["help", "spec", "validate"], root);
  assertIncludes(specHelp, "With no reference, validates the graph and all MANIFEST.md/SPEC.md capability records.", "spec validate help");
  assertIncludes(specHelp, "With a reference, also ensures that the specific manifest capability exists.", "spec validate help");
}

function createSpecAndWork(binPath, root) {
  const spec = parseJson(mdkg(binPath, ["new", "spec", "mdkg cli tool spec", "--id", "agent.example-cli", "--json"], root)).node;
  const work = parseJson(
    mdkg(
      binPath,
      [
        "work",
        "contract",
        "new",
        "mdkg cli tool spec work",
        "--id",
        "work.example",
        "--agent-id",
        "agent.example-cli",
        "--kind",
        "cli_validation",
        "--inputs",
        "request_ref:ref:required",
        "--outputs",
        "validation_receipt:json:required",
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
    relates: "[work.example]",
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
  const tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-cli-ux-polish."));
  const { binPath, packageRoot, tarballPath } = packAndInstall(tempRoot);
  const root = path.join(tempRoot, "repo");
  fs.mkdirSync(root, { recursive: true });
  run(GIT_CMD, ["init", "-q"], { cwd: root });

  mdkg(binPath, ["init", "--agent"], root);
  assertHelp(packageRoot, binPath, root);
  assertValidateOk(mdkg(binPath, ["validate", "--json"], root), "initial validate");

  const emptySpecs = parseJson(mdkg(binPath, ["spec", "list", "--json", "--no-cache"], root));
  assert(emptySpecs.count === 0, `expected no SPEC records after init, got ${emptySpecs.count}`);
  assertValidateOk(mdkg(binPath, ["spec", "validate", "--json"], root), "empty spec validate");

  const { spec, work } = createSpecAndWork(binPath, root);
  assertExists(path.join(root, spec.path));
  assertExists(path.join(root, work.path));
  mdkg(binPath, ["index"], root);

  const specs = parseJson(mdkg(binPath, ["spec", "list", "--json", "--no-cache"], root));
  assert(specs.count === 1, `expected one SPEC record, got ${specs.count}`);
  assert(specs.items[0].id === "agent.example-cli", "spec list returned unexpected SPEC");
  assert(parseJson(mdkg(binPath, ["spec", "show", "agent.example-cli", "--json", "--no-cache"], root)).item.id === "agent.example-cli", "spec show failed");
  assertValidateOk(mdkg(binPath, ["spec", "validate", "agent.example-cli", "--json", "--no-cache"], root), "named spec validate");

  const discovery = parseJson(mdkg(binPath, ["capability", "search", "mdkg cli tool spec", "--json", "--no-cache"], root));
  assert(discovery.items.some((item) => item.id === "agent.example-cli"), "capability search missing SPEC");
  assert(discovery.items.some((item) => item.id === "work.example"), "capability search missing WORK");

  const triggered = parseJson(
    mdkg(
      binPath,
      ["work", "trigger", "work.example", "--id", "order.example-1", "--requester", "user://example", "--json"],
      root
    )
  );
  assert(triggered.trigger.executed === false, "work trigger executed work");
  assert(triggered.trigger.enqueue.requested === false, "work trigger unexpectedly requested queue delivery");
  assertExists(path.join(root, triggered.node.path));
  const status = parseJson(mdkg(binPath, ["work", "order", "status", "order.example-1", "--json"], root));
  assert(status.order.id === "order.example-1", "work order status returned the wrong order");
  assert(status.order.status === "submitted", "work order did not start submitted");
  assert(status.receipt_count === 0, "new order should not have receipts");

  mdkg(
    binPath,
    [
      "work",
      "receipt",
      "new",
      "Example Receipt",
      "--id",
      "receipt.example-1",
      "--work-order-id",
      "order.example-1",
      "--outcome",
      "success",
      "--receipt-status",
      "recorded",
      "--proof-refs",
      "proof://cli-ux-polish/order.example-1",
      "--evidence-hashes",
      triggered.trigger.payload_hash,
      "--json",
    ],
    root
  );
  verifyReceipt(binPath, root, "receipt.example-1");
  const statusWithReceipt = parseJson(mdkg(binPath, ["work", "order", "status", "order.example-1", "--json"], root));
  assert(statusWithReceipt.receipt_count === 1, "work order did not link receipt");

  assert(parseJson(mdkg(binPath, ["db", "init", "--json"], root)).ok === true, "db init failed");
  assert(parseJson(mdkg(binPath, ["db", "migrate", "--json"], root)).applied_count === 5, "db migrate failed");
  assert(parseJson(mdkg(binPath, ["db", "verify", "--json"], root)).ok === true, "db verify failed");
  assert(parseJson(mdkg(binPath, ["db", "queue", "create", "invocation", "--json"], root)).queue.status === "active", "queue create failed");

  const queued = parseJson(
    mdkg(
      binPath,
      [
        "work",
        "trigger",
        "work.example",
        "--id",
        "order.example-queued",
        "--requester",
        "user://example",
        "--enqueue",
        "invocation",
        "--json",
      ],
      root
    )
  );
  assert(queued.trigger.executed === false, "queued work trigger executed work");
  assert(queued.trigger.enqueue.enqueued === true, "queued work trigger did not enqueue");
  const message = parseJson(mdkg(binPath, ["db", "queue", "show", "invocation", "order.example-queued", "--json"], root)).message;
  assert(message.message_id === "order.example-queued", "queue message id mismatch");
  const messagePayload = JSON.parse(message.payload_json);
  assert(messagePayload.work_order_qid === "root:order.example-queued", "queue payload missing work order qid");
  assert(messagePayload.payload_hash === queued.trigger.payload_hash, "queue payload hash mismatch");

  mdkg(binPath, ["index"], root);
  assertValidateOk(mdkg(binPath, ["validate", "--json"], root), "final validate");
  const search = mdkg(binPath, ["search", "mdkg cli tool spec", "--json"], root);
  assert(search.includes("mdkg cli tool spec"), "search did not find created records");
  assert(parseJson(mdkg(binPath, ["show", "order.example-1", "--json"], root)).item.id === "order.example-1", "show order failed");
  assert(parseJson(mdkg(binPath, ["show", "receipt.example-1", "--json"], root)).item.id === "receipt.example-1", "show receipt failed");

  console.log(`cli ux polish smoke passed: ${path.basename(tarballPath)} at ${tempRoot}`);
}

try {
  main();
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(err instanceof Error && err.stack ? err.stack : message);
  process.exit(1);
}
