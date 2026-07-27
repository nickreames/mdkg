#!/usr/bin/env node

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

class BootstrapError extends Error {
  constructor(classification, message) {
    super(message);
    this.name = "BootstrapError";
    this.classification = classification;
  }
}

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) {
      throw new BootstrapError("invalid_arguments", `Unexpected argument: ${arg}`);
    }
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw new BootstrapError("invalid_arguments", `Missing value for ${arg}`);
    }
    values[arg.slice(2)] = value;
    index += 1;
  }
  for (const required of ["source", "target", "start-goal", "manifest", "receipt"]) {
    if (!values[required]) {
      throw new BootstrapError("invalid_arguments", `Missing --${required}`);
    }
  }
  return values;
}

function sha256Buffer(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function sha256File(filePath) {
  return sha256Buffer(fs.readFileSync(filePath));
}

function normalizeRelative(repoRoot, candidate, label) {
  const absolute = path.resolve(repoRoot, candidate);
  const relative = path.relative(repoRoot, absolute).split(path.sep).join("/");
  if (!relative || relative === "." || relative.startsWith("../") || path.isAbsolute(relative)) {
    throw new BootstrapError("path_outside_repo", `${label} must be a contained repository-relative path`);
  }
  return { absolute, relative };
}

function assertManifestRelative(candidate, label) {
  const normalized = candidate.split(path.sep).join("/");
  if (
    !normalized ||
    normalized.startsWith("/") ||
    normalized === ".." ||
    normalized.startsWith("../") ||
    normalized.includes("/../")
  ) {
    throw new BootstrapError("invalid_manifest", `${label} must be a contained relative path: ${candidate}`);
  }
  return normalized;
}

function walkFiles(root, options = {}) {
  const excluded = new Set(options.excluded || []);
  if (!fs.existsSync(root)) return [];
  const files = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const absolute = path.join(directory, entry.name);
      const relative = path.relative(root, absolute).split(path.sep).join("/");
      if (excluded.has(relative)) continue;
      if (entry.isDirectory()) visit(absolute);
      else if (entry.isFile()) files.push({ absolute, relative });
      else throw new BootstrapError("unsupported_target_entry", `Unsupported filesystem entry: ${relative}`);
    }
  };
  visit(root);
  return files;
}

function inventory(root, excluded) {
  return walkFiles(root, { excluded }).map(({ absolute, relative }) => ({
    path: relative,
    sha256: sha256File(absolute),
    mode: (fs.statSync(absolute).mode & 0o777).toString(8).padStart(4, "0")
  }));
}

function treeHash(root) {
  const rows = inventory(root, []);
  return `sha256:${sha256Buffer(Buffer.from(JSON.stringify(rows)))}`;
}

function run(repoRoot, cliPath, args, classification) {
  const result = spawnSync(process.execPath, [cliPath, ...args], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || "").trim().split("\n").slice(-1)[0] || "command failed";
    throw new BootstrapError(classification, `${args.slice(0, 3).join(" ")}: ${detail}`);
  }
  return result.stdout;
}

function runJson(repoRoot, cliPath, args, classification) {
  const stdout = run(repoRoot, cliPath, args, classification);
  try {
    return JSON.parse(stdout);
  } catch {
    throw new BootstrapError(classification, `Command did not return JSON: ${args.join(" ")}`);
  }
}

function packQids(output) {
  return output
    .split("\n")
    .filter((line) => line.startsWith("- root:"))
    .map((line) => line.slice(2).trim());
}

function loadManifest(manifestPath, expectedSourceRoot) {
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (error) {
    throw new BootstrapError("invalid_manifest", `Manifest is unreadable: ${error.message}`);
  }
  if (
    manifest.schema_version !== "1.0" ||
    manifest.kind !== "website-demo-operator-materialization-manifest" ||
    manifest.source_root !== expectedSourceRoot ||
    !Array.isArray(manifest.entries) ||
    manifest.entries.length === 0
  ) {
    throw new BootstrapError("invalid_manifest", "Manifest schema, kind, source root, or entries are invalid");
  }
  const targets = new Set();
  for (const entry of manifest.entries) {
    entry.source_path = assertManifestRelative(entry.source_path, "source_path");
    entry.target_path = assertManifestRelative(entry.target_path, "target_path");
    if (targets.has(entry.target_path)) {
      throw new BootstrapError("duplicate_manifest_target", `Duplicate manifest target: ${entry.target_path}`);
    }
    targets.add(entry.target_path);
    if (!/^[a-f0-9]{64}$/.test(entry.sha256) || !/^[0-7]{4}$/.test(entry.mode)) {
      throw new BootstrapError("invalid_manifest", `Invalid hash or mode for ${entry.target_path}`);
    }
    if (entry.required !== true || !entry.projection_family) {
      throw new BootstrapError("invalid_manifest", `Required/projection metadata missing for ${entry.target_path}`);
    }
  }
  return manifest;
}

function verifyManifestSources(sourceRoot, manifest) {
  for (const entry of manifest.entries) {
    const sourcePath = path.join(sourceRoot, entry.source_path);
    if (!fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isFile()) {
      throw new BootstrapError("missing_source_input", `Required manifest source is absent: ${entry.source_path}`);
    }
    if (sha256File(sourcePath) !== entry.sha256) {
      throw new BootstrapError("manifest_source_hash_mismatch", `Manifest source hash mismatch: ${entry.source_path}`);
    }
  }
}

function materialize(sourceRoot, targetRoot, manifest, mode) {
  for (const entry of manifest.entries) {
    const sourcePath = path.join(sourceRoot, entry.source_path);
    const targetPath = path.join(targetRoot, entry.target_path);
    if (mode === "create") {
      if (fs.existsSync(targetPath)) {
        if (sha256File(targetPath) !== entry.sha256) {
          throw new BootstrapError("unexpected_generated_target", `Fork created conflicting target: ${entry.target_path}`);
        }
      } else {
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.copyFileSync(sourcePath, targetPath);
        fs.chmodSync(targetPath, Number.parseInt(entry.mode, 8));
      }
    }
    if (!fs.existsSync(targetPath)) {
      throw new BootstrapError("missing_target_input", `Required materialized target is absent: ${entry.target_path}`);
    }
    if (sha256File(targetPath) !== entry.sha256) {
      const classification = entry.projection_family.startsWith("skill-mirror")
        ? "skill_mirror_mismatch"
        : "target_content_drift";
      throw new BootstrapError(classification, `Materialized target hash mismatch: ${entry.target_path}`);
    }
  }
}

function verifySkillMirrors(targetRoot, manifest) {
  for (const entry of manifest.entries.filter((item) => item.canonical_skill_path)) {
    const canonical = path.join(targetRoot, assertManifestRelative(entry.canonical_skill_path, "canonical_skill_path"));
    const mirror = path.join(targetRoot, entry.target_path);
    if (!fs.existsSync(canonical)) {
      throw new BootstrapError("missing_canonical_skill", `Canonical target skill is absent: ${entry.canonical_skill_path}`);
    }
    if (sha256File(canonical) !== sha256File(mirror)) {
      throw new BootstrapError("skill_mirror_mismatch", `Skill mirror differs from canonical skill: ${entry.target_path}`);
    }
  }
}

function verifyExpectedTargetInventory(targetRoot, manifest, receiptRelative) {
  const allowed = new Set([
    ...walkFiles(path.join(targetRoot, ".mdkg")).map((item) => `.mdkg/${item.relative}`),
    ...manifest.entries.map((entry) => entry.target_path),
    receiptRelative
  ]);
  const unexpected = walkFiles(targetRoot)
    .map((item) => item.relative)
    .filter((relative) => !allowed.has(relative));
  if (unexpected.length > 0) {
    throw new BootstrapError("unexpected_target_content", `Unexpected generated target: ${unexpected[0]}`);
  }
}

function verifyChild(repoRoot, cliPath, targetRelative, startGoal) {
  const rootArgs = ["--root", targetRelative];
  const validate = runJson(repoRoot, cliPath, [...rootArgs, "validate", "--json"], "validation_failed");
  if (validate.ok !== true || validate.warning_count !== 0 || validate.error_count !== 0) {
    throw new BootstrapError("validation_failed", "Child validation did not pass with zero warnings and errors");
  }
  const goal = runJson(repoRoot, cliPath, [...rootArgs, "goal", "show", startGoal, "--json"], "goal_id_mismatch");
  if (goal.goal.id !== startGoal || goal.goal.qid !== `root:${startGoal}`) {
    throw new BootstrapError("goal_id_mismatch", `Selected goal id changed: ${goal.goal.id}`);
  }
  const next = runJson(repoRoot, cliPath, [...rootArgs, "goal", "next", startGoal, "--json"], "routing_failed");
  if (!next.node || next.node.id !== "spike-1" || (next.warnings || []).length !== 0) {
    throw new BootstrapError("routing_failed", "Child goal did not route cleanly to spike-1");
  }

  const edgeList = "parent,epic,relates,blocked_by,blocks,prev,next,context_refs,evidence_refs";
  const packArgs = (profile) => [
    ...rootArgs,
    "pack",
    next.node.id,
    "--profile",
    profile,
    "--depth",
    "1",
    "--edges",
    edgeList,
    "--skills",
    "auto",
    "--skills-depth",
    "full",
    "--dry-run",
    "--stats"
  ];
  const conciseOutput = run(repoRoot, cliPath, packArgs("concise"), "pack_failed");
  const standardOutput = run(repoRoot, cliPath, packArgs("standard"), "pack_failed");
  const conciseQids = packQids(conciseOutput);
  const standardQids = packQids(standardOutput);
  const requiredQids = [
    "root:goal-1",
    "root:epic-1",
    "root:spike-1",
    "root:task-1",
    "root:test-1",
    "root:prd-2",
    "root:edd-1",
    "root:dec-1",
    "root:dec-2",
    "root:chk-2"
  ];
  for (const qid of requiredQids) {
    if (!conciseQids.includes(qid) || !standardQids.includes(qid)) {
      throw new BootstrapError("pack_failed", `Child pack is missing ${qid}`);
    }
  }
  return {
    validation: {
      ok: true,
      warning_count: 0,
      error_count: 0
    },
    routing: {
      goal_qid: goal.goal.qid,
      first_actionable_qid: next.node.qid,
      warning_count: 0
    },
    packs: {
      edge_list: edgeList,
      concise: {
        root_qid: next.node.qid,
        node_count: conciseQids.length,
        included_qids: conciseQids
      },
      standard: {
        root_qid: next.node.qid,
        node_count: standardQids.length,
        included_qids: standardQids
      }
    }
  };
}

function main() {
  const repoRoot = process.cwd();
  const cliPath = path.join(repoRoot, "dist", "cli.js");
  let args;
  let target = null;
  let mode = "unknown";
  try {
    if (!fs.existsSync(path.join(repoRoot, "package.json")) || !fs.existsSync(cliPath)) {
      throw new BootstrapError("not_repository_root", "Run this command from the mdkg repository root");
    }
    args = parseArgs(process.argv.slice(2));
    const source = normalizeRelative(repoRoot, args.source, "source");
    target = normalizeRelative(repoRoot, args.target, "target");
    const manifestLocation = normalizeRelative(repoRoot, args.manifest, "manifest");
    const receiptAbsolute = path.resolve(repoRoot, args.receipt);
    const receiptRepoRelative = path.relative(repoRoot, receiptAbsolute).split(path.sep).join("/");
    const receiptLocation = {
      absolute: receiptAbsolute,
      relative:
        receiptRepoRelative && !receiptRepoRelative.startsWith("../") && !path.isAbsolute(receiptRepoRelative)
          ? receiptRepoRelative
          : receiptAbsolute
    };
    const receiptRelativeToTarget = path.relative(target.absolute, receiptLocation.absolute).split(path.sep).join("/");
    if (
      receiptRelativeToTarget.startsWith("../") ||
      receiptRelativeToTarget === ".." ||
      path.isAbsolute(receiptRelativeToTarget)
    ) {
      throw new BootstrapError("receipt_outside_target", "Receipt must be contained by the target root");
    }
    if (!fs.existsSync(source.absolute) || !fs.existsSync(path.join(source.absolute, ".mdkg"))) {
      throw new BootstrapError("missing_source_root", "Source root or source .mdkg graph is absent");
    }

    const manifest = loadManifest(manifestLocation.absolute, source.relative);
    verifyManifestSources(source.absolute, manifest);
    const manifestSha256 = sha256File(manifestLocation.absolute);
    const sourceTreeHash = treeHash(path.join(source.absolute, ".mdkg"));
    const previousReceiptExists = fs.existsSync(receiptLocation.absolute);

    if (fs.existsSync(target.absolute)) {
      if (!previousReceiptExists) {
        throw new BootstrapError("unexpected_target", "Target exists without a prior bootstrap receipt");
      }
      mode = "verify-only";
    } else {
      mode = "create";
      fs.mkdirSync(path.dirname(target.absolute), { recursive: true });
    }

    let fork = null;
    if (mode === "create") {
      const forkArgs = [
        "graph",
        "fork",
        `${source.relative}/.mdkg`,
        "--target",
        target.relative,
        "--start-goal",
        args["start-goal"],
        "--json"
      ];
      fork = runJson(repoRoot, cliPath, forkArgs, "fork_failed");
      if (fork.ok !== true || fork.preserved_ids !== true) {
        throw new BootstrapError("fork_failed", "Graph fork did not preserve ids");
      }
    }

    materialize(source.absolute, target.absolute, manifest, mode);
    verifySkillMirrors(target.absolute, manifest);
    verifyExpectedTargetInventory(target.absolute, manifest, receiptRelativeToTarget);

    const generatedInventory = inventory(target.absolute, [receiptRelativeToTarget]);
    let previousReceipt = null;
    if (mode === "verify-only") {
      previousReceipt = JSON.parse(fs.readFileSync(receiptLocation.absolute, "utf8"));
      if (
        previousReceipt.source_tree_hash !== sourceTreeHash ||
        previousReceipt.manifest_sha256 !== manifestSha256 ||
        JSON.stringify(previousReceipt.generated_inventory) !== JSON.stringify(generatedInventory)
      ) {
        throw new BootstrapError("inventory_drift", "Verify-only inventory differs from the accepted bootstrap receipt");
      }
    }

    const child = verifyChild(repoRoot, cliPath, target.relative, args["start-goal"]);
    const receipt = {
      schema_version: "1.0",
      kind: "website-demo-bootstrap-receipt",
      state: "pass",
      mode,
      command:
        `node scripts/bootstrap-website-demo-run.js --source ${source.relative} --target ${target.relative} ` +
        `--start-goal ${args["start-goal"]} --manifest ${manifestLocation.relative} --receipt ${receiptLocation.relative}`,
      canonical_fork_command:
        `mdkg graph fork ${source.relative}/.mdkg --target ${target.relative} ` +
        `--start-goal ${args["start-goal"]} --json`,
      source_root: source.relative,
      source_tree_hash: sourceTreeHash,
      cli_source_tree_hash: fork ? fork.source_hash.source_tree_hash : previousReceipt.cli_source_tree_hash,
      target_root: target.relative,
      start_goal: args["start-goal"],
      preserved_ids: true,
      selected_goal_qid: child.routing.goal_qid,
      manifest_path: manifestLocation.relative,
      manifest_sha256: manifestSha256,
      generated_inventory: generatedInventory,
      generated_file_count: generatedInventory.length,
      validation: child.validation,
      routing: child.routing,
      packs: child.packs,
      repeat_result: mode === "verify-only" ? "identical inventory and hashes" : "first absent-target creation",
      failure_classification: null
    };
    fs.mkdirSync(path.dirname(receiptLocation.absolute), { recursive: true });
    fs.writeFileSync(receiptLocation.absolute, `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
    process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
  } catch (error) {
    const classification = error instanceof BootstrapError ? error.classification : "unexpected_failure";
    const failure = {
      schema_version: "1.0",
      kind: "website-demo-bootstrap-failure",
      state: "fail",
      mode,
      target_root: target ? target.relative : null,
      failure_classification: classification,
      message: error.message
    };
    process.stderr.write(`${JSON.stringify(failure)}\n`);
    process.exitCode = 1;
  }
}

main();
