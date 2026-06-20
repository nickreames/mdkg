#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const packageVersion = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")).version;
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
  return { stdout: result.stdout.trim(), stderr: result.stderr.trim(), combined: `${result.stdout}${result.stderr}` };
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

function git(cwd, args) {
  return run(GIT_CMD, args, { cwd });
}

function packAndInstall(tempRoot) {
  const packDir = path.join(tempRoot, "pack");
  const prefix = path.join(tempRoot, "npm-prefix");
  fs.mkdirSync(packDir, { recursive: true });
  fs.mkdirSync(prefix, { recursive: true });

  const packOutput = run(NPM_CMD, ["pack", "--silent", "--dry-run=false", "--pack-destination", packDir], {
    cwd: repoRoot,
  }).stdout;
  const tarballName = packOutput
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .pop();
  assert(tarballName, "unable to determine npm pack output tarball");
  const tarballPath = path.join(packDir, path.basename(tarballName));
  assertExists(tarballPath);

  const install = run(NPM_CMD, ["install", "-g", tarballPath, "--prefix", prefix, "--foreground-scripts"], {
    cwd: tempRoot,
    env: { npm_config_prefix: prefix },
  });
  assert(install.combined.includes(`mdkg ${packageVersion} installed.`), "postinstall output missing package version");

  const binPath = process.platform === "win32" ? path.join(prefix, "mdkg.cmd") : path.join(prefix, "bin", "mdkg");
  assertExists(binPath);
  return { binPath, tarballPath };
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

function assertCheckpointBody(root, receipt, kind) {
  assert(receipt.checkpoint.kind === kind, `expected checkpoint kind ${kind}`);
  const filePath = path.join(root, receipt.checkpoint.path);
  assertExists(filePath);
  const content = fs.readFileSync(filePath, "utf8");
  assert(content.includes(`checkpoint_kind: ${kind}`), `checkpoint missing kind ${kind}`);
  for (const heading of [
    "## Command Evidence",
    "## Pass / Fail Status",
    "## Known Warnings",
    "## Changed Surfaces",
    "## Boundaries",
    "## Follow-up Refs",
  ]) {
    assert(content.includes(heading), `checkpoint ${kind} missing ${heading}`);
  }
  return filePath;
}

function createSpecAndWork(binPath, root) {
  const spec = parseJson(mdkg(binPath, ["new", "spec", "Integration UX Agent", "--id", "agent.integration-ux", "--json"], root).stdout).node;
  const work = parseJson(
    mdkg(
      binPath,
      [
        "work",
        "contract",
        "new",
        "Integration UX Work",
        "--id",
        "work.integration-ux",
        "--agent-id",
        "agent.integration-ux",
        "--kind",
        "integration_validation",
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
    ).stdout
  ).node;
  updateFrontmatter(path.join(root, spec.path), {
    work_contracts: `[${path.basename(path.dirname(work.path))}/WORK.md]`,
    relates: "[work.integration-ux]",
  });
  return { spec, work };
}

function main() {
  const tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-integration-ux-smoke-"));
  try {
    const { binPath, tarballPath } = packAndInstall(tempRoot);
    const root = path.join(tempRoot, "repo");
    fs.mkdirSync(root, { recursive: true });
    git(root, ["init", "-q"]);
    git(root, ["config", "user.email", "mdkg@example.test"]);
    git(root, ["config", "user.name", "mdkg smoke"]);

    mdkg(binPath, ["init", "--agent"], root);
    const goal = parseJson(mdkg(binPath, ["new", "goal", "integration UX implementation goal", "--json"], root).stdout).node;
    const task = parseJson(
      mdkg(binPath, ["new", "task", "integration UX executable task", "--status", "progress", "--priority", "1", "--json"], root).stdout
    ).node;
    const context = parseJson(
      mdkg(binPath, ["new", "task", "integration UX context note", "--status", "todo", "--priority", "2", "--json"], root).stdout
    ).node;
    const evidence = parseJson(
      mdkg(binPath, ["new", "task", "integration UX evidence note", "--status", "done", "--priority", "3", "--json"], root).stdout
    ).node;

    updateFrontmatter(path.join(root, goal.path), {
      status: "progress",
      goal_state: "active",
      active_node: task.id,
      scope_refs: `[${task.id}]`,
      context_refs: `[${context.id}, https://example.invalid/integration-context]`,
      evidence_refs: `[${evidence.id}, proof://integration-ux/evidence]`,
      required_checks: "[node dist/cli.js validate --json, npm run smoke:handoff]",
    });
    updateFrontmatter(path.join(root, task.path), {
      parent: goal.id,
      context_refs: `[${context.id}]`,
      evidence_refs: `[${evidence.id}, proof://integration-ux/task-proof]`,
    });

    const taskPath = path.join(root, task.path);
    fs.appendFileSync(taskPath, "\n# Private Notes\n\nRAW_PAYLOAD_MARKER should warn but never appear in handoff content.\n", "utf8");

    const checkpointKinds = ["implementation", "test-proof", "goal-closeout", "audit", "handoff"];
    const checkpointIds = [];
    for (const kind of checkpointKinds) {
      const receipt = parseJson(
        mdkg(
          binPath,
          [
            "checkpoint",
            "new",
            `${kind} integration checkpoint`,
            "--kind",
            kind,
            "--relates",
            goal.id,
            "--scope",
            task.id,
            "--json",
          ],
          root
        ).stdout
      );
      assertCheckpointBody(root, receipt, kind);
      checkpointIds.push(receipt.checkpoint.id);
    }

    const workflow = createSpecAndWork(binPath, root);
    const triggered = parseJson(
      mdkg(
        binPath,
        [
          "work",
          "trigger",
          workflow.work.id,
          "--id",
          "order.integration-ux",
          "--title",
          "Integration UX Work Order",
          "--requester",
          "user://integration-smoke",
          "--json",
        ],
        root
      ).stdout
    );
    assert(triggered.trigger.executed === false, "work trigger must not execute work");
    mdkg(
      binPath,
      [
        "work",
        "receipt",
        "new",
        "Integration UX Receipt",
        "--id",
        "receipt.integration-ux",
        "--work-order-id",
        "order.integration-ux",
        "--outcome",
        "success",
        "--receipt-status",
        "recorded",
        "--proof-refs",
        "proof://integration-ux/work-order",
        "--evidence-hashes",
        triggered.trigger.payload_hash,
        "--json",
      ],
      root
    );
    assert(parseJson(mdkg(binPath, ["work", "receipt", "verify", "receipt.integration-ux", "--json"], root).stdout).ok === true, "receipt verify failed");
    const workflowValidation = parseJson(mdkg(binPath, ["work", "validate", "--json"], root).stdout);
    assert(workflowValidation.ok === true, "workflow validation failed");
    assert(workflowValidation.checked_count >= 4, "workflow validation inspected too few records");

    const queueContract = parseJson(mdkg(binPath, ["db", "queue", "contract", "--json"], root).stdout);
    assert(queueContract.contract.contract_id === "mdkg.project_db.queue.adapter.v1", "queue adapter contract id mismatch");
    assert(
      queueContract.contract.payload_hash.canonicalization.includes("serialized deterministically"),
      "queue contract missing payload hash semantics"
    );
    assert(queueContract.contract.claim.selection.includes("oldest ready"), "queue contract missing oldest-ready claim semantics");
    assert(queueContract.contract.claim.lease.includes("lease_owner"), "queue contract missing lease-owner claim semantics");
    assert(queueContract.contract.settlement.ack.includes("lease owner"), "queue contract missing lease-owner settlement semantics");

    mdkg(binPath, ["index"], root);
    const refs = parseJson(mdkg(binPath, ["graph", "refs", task.id, "--json"], root).stdout);
    assert(refs.outgoing.context_refs.some((edge) => edge.qid === `root:${context.id}`), "graph refs missing context ref");
    assert(refs.outgoing.evidence_refs.some((edge) => edge.qid === `root:${evidence.id}`), "graph refs missing evidence ref");

    const handoff = parseJson(mdkg(binPath, ["handoff", "create", goal.id, "--depth", "2", "--json"], root).stdout);
    assert(handoff.ok === true, "handoff creation failed");
    assert(handoff.included_qids.includes(`root:${task.id}`), "handoff missing executable task");
    assert(handoff.included_qids.includes(`root:${checkpointIds[checkpointIds.length - 1]}`), "handoff missing latest checkpoint");
    assert(handoff.content.includes("integration UX executable task"), "handoff missing task summary");
    assert(handoff.content.includes("proof://integration-ux/task-proof"), "handoff missing evidence ref");
    assert(handoff.content.includes("raw_payload"), "handoff missing raw marker warning");
    assert(!handoff.content.includes("RAW_PAYLOAD_MARKER"), "handoff leaked raw marker content");

    const outPath = ".mdkg/handoffs/integration-ux.md";
    mdkg(binPath, ["handoff", "create", goal.id, "--out", outPath, "--json"], root);
    const writtenHandoff = fs.readFileSync(path.join(root, outPath), "utf8");
    assert(writtenHandoff.includes("mdkg Agent Handoff"), "written handoff missing title");
    assert(!writtenHandoff.includes("RAW_PAYLOAD_MARKER"), "written handoff leaked raw marker content");

    fs.writeFileSync(
      taskPath,
      fs.readFileSync(taskPath, "utf8").replace("\n# Private Notes\n\nRAW_PAYLOAD_MARKER should warn but never appear in handoff content.\n", "\n"),
      "utf8"
    );

    const packPath = ".mdkg/pack/integration-ux.json";
    mdkg(
      binPath,
      [
        "pack",
        task.id,
        "--format",
        "json",
        "--edges",
        "context_refs,evidence_refs",
        "--depth",
        "2",
        "--out",
        packPath,
      ],
      root
    );
    const packed = JSON.parse(fs.readFileSync(path.join(root, packPath), "utf8"));
    const packedQids = packed.nodes.map((node) => node.qid);
    assert(packedQids.includes(`root:${task.id}`), "pack missing task");
    assert(packedQids.includes(`root:${context.id}`), "pack missing context ref");
    assert(packedQids.includes(`root:${evidence.id}`), "pack missing evidence ref");

    const search = parseJson(mdkg(binPath, ["search", "integration UX", "--json"], root).stdout);
    assert(search.count >= 4, "search missed integration UX records");
    const shownGoal = parseJson(mdkg(binPath, ["show", goal.id, "--json"], root).stdout).item;
    assert(shownGoal.edges.context_refs.includes(`root:${context.id}`), "show missing goal context ref");
    assert(shownGoal.edges.evidence_refs.includes("proof://integration-ux/evidence"), "show missing goal evidence URI");
    const formatDryRun = parseJson(mdkg(binPath, ["format", "--headings", "--dry-run", "--json"], root).stdout);
    assert(formatDryRun.action === "format.headings" && formatDryRun.dry_run === true, "heading formatter dry-run action mismatch");
    const validate = parseJson(mdkg(binPath, ["validate", "--json"], root).stdout);
    assert(validate.ok === true, "integration UX repo did not validate");
    assert(validate.warning_count === 0, `expected zero validation warnings, got ${validate.warning_count}`);

    console.log(
      JSON.stringify(
        {
          smoke: "integration-ux",
          ok: true,
          packageVersion,
          tempRoot,
          tarballPath,
          root,
        },
        null,
        2
      )
    );
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
