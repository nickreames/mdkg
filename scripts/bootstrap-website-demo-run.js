#!/usr/bin/env node

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const MATERIALIZER_VERSION = "2.0";
const BINDING_TARGET = "RUN_BINDING.json";
const INTERFACE_TARGET = "CHILD_INTERFACE.json";
const SEAL_TARGET = "IMMUTABLE_CHILD_CONTRACT.json";

const EXPECTED_IMMUTABLE_FIELDS = [
  "schema_version",
  "kind",
  "materializer_version",
  "semantic_source_release",
  "run_id",
  "target_root",
  "detail_route",
  "output_route",
  "component_key",
  "positioning_brief",
  "designated_harness",
  "timing_profile_ref",
  "output_destinations",
  "receipt_destinations"
];

const EXPECTED_RUNTIME_MUTABLE_FIELDS = [
  ".mdkg/index/**",
  ".mdkg/state/**",
  ".mdkg/pack/**",
  ".mdkg/work/events/**",
  "artifacts/**",
  "site/**",
  "runtime checkpoints",
  "work status and evidence_refs"
];

const REQUIRED_STORY = new Set([
  "clear hero promise",
  "context or problem framing",
  "Plan -> Work -> Evidence",
  "what completed why and what comes next",
  "inspectable source-to-execution proof",
  "quickstart and feedback CTA"
]);

const ALLOWED_CREATIVE_LATITUDE = new Set([
  "composition",
  "visual metaphor",
  "section order",
  "typographic hierarchy",
  "local public-safe imagery",
  "CSS-only motion",
  "bounded marketing copy"
]);

const FORBIDDEN_BINDING_KEYS = new Set([
  "approval",
  "authority",
  "credentials",
  "token",
  "cookie",
  "provider_payload",
  "origin_sha",
  "lease",
  "quiet_window",
  "allowlist",
  "push"
]);

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
  for (const required of ["source", "target", "start-goal", "manifest", "release", "binding", "receipt"]) {
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

function hashIdentity(filePath) {
  return `sha256:${sha256File(filePath)}`;
}

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function normalizeRelative(repoRoot, candidate, label) {
  const absolute = path.resolve(repoRoot, candidate);
  const relative = path.relative(repoRoot, absolute).split(path.sep).join("/");
  if (!relative || relative === "." || relative.startsWith("../") || path.isAbsolute(relative)) {
    throw new BootstrapError("path_outside_repo", `${label} must be a contained repository-relative path`);
  }
  return { absolute, relative };
}

function assertContainedRelative(candidate, label, classification = "invalid_manifest") {
  const normalized = candidate.split(path.sep).join("/");
  if (
    !normalized ||
    normalized.startsWith("/") ||
    normalized === ".." ||
    normalized.startsWith("../") ||
    normalized.includes("/../")
  ) {
    throw new BootstrapError(classification, `${label} must be a contained relative path: ${candidate}`);
  }
  return normalized;
}

function readJson(filePath, classification, label) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new BootstrapError(classification, `${label} is unreadable: ${error.message}`);
  }
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

function inventory(root, excluded = []) {
  return walkFiles(root, { excluded }).map(({ absolute, relative }) => ({
    path: relative,
    sha256: sha256File(absolute),
    mode: (fs.statSync(absolute).mode & 0o777).toString(8).padStart(4, "0")
  }));
}

function semanticCategory(relative) {
  if (relative.startsWith(".agents/") || relative.startsWith(".claude/")) return "skill-mirror";
  if (relative.startsWith(".mdkg/design/")) return "design";
  if (relative.startsWith(".mdkg/work/")) return "work";
  if (relative.startsWith(".mdkg/skills/")) return "canonical-skill";
  if (relative.startsWith(".mdkg/core/")) return "core";
  if (relative.startsWith(".mdkg/templates/")) return "template";
  if (relative.startsWith(".mdkg/")) return "graph-scaffold";
  return "operator";
}

function isGeneratedSemanticExclusion(relative) {
  return (
    relative.startsWith(".mdkg/index/") ||
    relative.startsWith(".mdkg/state/") ||
    relative.startsWith(".mdkg/pack/") ||
    relative.startsWith(".mdkg/work/events/") ||
    relative.startsWith(".mdkg/db/runtime/") ||
    relative.startsWith(".mdkg/subgraphs/") ||
    relative.includes(".sqlite-wal") ||
    relative.includes(".sqlite-shm") ||
    relative.includes(".sqlite-journal")
  );
}

function semanticInventory(root, manifest) {
  const releasedOperatorInputs = new Set(manifest.entries.map((entry) => entry.source_path));
  return walkFiles(root)
    .filter(
      (item) =>
        !isGeneratedSemanticExclusion(item.relative) &&
        (item.relative.startsWith(".mdkg/") || releasedOperatorInputs.has(item.relative))
    )
    .map(({ absolute, relative }) => ({
      path: relative,
      sha256: sha256File(absolute),
      mode: (fs.statSync(absolute).mode & 0o777).toString(8).padStart(4, "0"),
      category: semanticCategory(relative)
    }));
}

function inventoryIdentity(rows) {
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
  const manifest = readJson(manifestPath, "invalid_manifest", "Operator manifest");
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
    entry.source_path = assertContainedRelative(entry.source_path, "source_path");
    entry.target_path = assertContainedRelative(entry.target_path, "target_path");
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
  for (const requiredTarget of ["README.md", ".gitignore", "DEMO_HANDOFF_PROMPT.md"]) {
    if (!targets.has(requiredTarget)) {
      throw new BootstrapError("invalid_manifest", `Manifest is missing required operator target: ${requiredTarget}`);
    }
  }
  return manifest;
}

function loadRelease(repoRoot, releasePath, expectedSourceRoot, startGoal) {
  const release = readJson(releasePath, "invalid_source_release", "Semantic source release");
  if (
    release.schema_version !== "1.0" ||
    release.kind !== "website-demo-semantic-source-release" ||
    release.materializer_version !== MATERIALIZER_VERSION ||
    release.source_root !== expectedSourceRoot ||
    release.start_goal !== startGoal ||
    release.first_actionable !== "spike-1" ||
    !Array.isArray(release.expected_chain) ||
    !Array.isArray(release.required_qids) ||
    !release.authored_inventory ||
    release.authored_inventory.policy !==
      "authored mdkg graph plus released operator manifest inputs minus generated runtime state" ||
    !Number.isInteger(release.authored_inventory.file_count) ||
    !/^sha256:[a-f0-9]{64}$/.test(release.authored_inventory.sha256)
  ) {
    throw new BootstrapError("invalid_source_release", "Source release metadata or inventory is invalid");
  }
  const expectedChain = ["spike-1", "task-1", "test-1", "task-2", "test-2", "task-3", "test-3"];
  if (JSON.stringify(release.expected_chain) !== JSON.stringify(expectedChain)) {
    throw new BootstrapError("invalid_source_release", "Source release expected chain is not canonical");
  }
  const requiredExclusions = [
    ".mdkg/index/**",
    ".mdkg/state/**",
    ".mdkg/pack/**",
    ".mdkg/work/events/**",
    ".mdkg/db/runtime/**",
    ".mdkg/subgraphs/**",
    "*.sqlite-wal",
    "*.sqlite-shm",
    "*.sqlite-journal"
  ];
  if (JSON.stringify(release.authored_inventory.exclusions) !== JSON.stringify(requiredExclusions)) {
    throw new BootstrapError("invalid_source_release", "Source release generated-state exclusions are not canonical");
  }
  for (const dependencyName of ["operator_manifest", "run_binding_schema", "timed_run_contract", "materializer"]) {
    const dependency = release[dependencyName];
    if (!dependency || !dependency.path || !/^[a-f0-9]{64}$/.test(dependency.sha256)) {
      throw new BootstrapError("invalid_source_release", `Source release dependency is invalid: ${dependencyName}`);
    }
    const dependencyLocation = normalizeRelative(repoRoot, dependency.path, dependencyName);
    if (!fs.existsSync(dependencyLocation.absolute) || sha256File(dependencyLocation.absolute) !== dependency.sha256) {
      throw new BootstrapError("source_release_dependency_drift", `Source release dependency drift: ${dependencyName}`);
    }
  }
  return release;
}

function verifyReleaseInputs(sourceRoot, release, manifest) {
  const rows = semanticInventory(sourceRoot, manifest);
  if (
    rows.length !== release.authored_inventory.file_count ||
    inventoryIdentity(rows) !== release.authored_inventory.sha256
  ) {
    throw new BootstrapError("source_release_input_drift", "Semantic authored source inventory drifted");
  }
  return rows;
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

function assertNoForbiddenBindingKeys(value, trail = []) {
  if (!value || typeof value !== "object") return;
  for (const [key, nested] of Object.entries(value)) {
    if (FORBIDDEN_BINDING_KEYS.has(key.toLowerCase())) {
      throw new BootstrapError("binding_authority_leakage", `Forbidden binding field: ${[...trail, key].join(".")}`);
    }
    assertNoForbiddenBindingKeys(nested, [...trail, key]);
  }
}

function assertExactKeys(value, expected, label) {
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  if (JSON.stringify(actual) !== JSON.stringify(wanted)) {
    throw new BootstrapError("invalid_binding", `${label} fields are not exact`);
  }
}

function loadBinding(bindingPath, targetRelative, semanticRelease, timedRunIdentity) {
  const binding = readJson(bindingPath, "invalid_binding", "Run binding");
  assertNoForbiddenBindingKeys(binding);
  assertExactKeys(binding, [
    "schema_version",
    "kind",
    "materializer_version",
    "semantic_source_release",
    "run_id",
    "target_root",
    "detail_route",
    "output_route",
    "component_key",
    "positioning_brief",
    "designated_harness",
    "timing_profile_ref",
    "output_destinations",
    "receipt_destinations",
    "immutable_fields",
    "runtime_mutable_fields"
  ], "Run binding");
  if (
    binding.schema_version !== "1.0" ||
    binding.kind !== "website-demo-run-binding" ||
    binding.materializer_version !== MATERIALIZER_VERSION
  ) {
    throw new BootstrapError("invalid_binding", "Binding schema, kind, or materializer version is invalid");
  }
  if (binding.semantic_source_release !== semanticRelease) {
    throw new BootstrapError("binding_release_mismatch", "Binding semantic source release does not match");
  }
  if (binding.target_root !== targetRelative) {
    throw new BootstrapError("binding_target_mismatch", "Binding target_root does not match --target");
  }
  if (!/^(demo-[0-9]{3}|fixture-[a-z0-9-]+)$/.test(binding.run_id)) {
    throw new BootstrapError("invalid_binding", "Binding run_id is invalid");
  }
  const detailMatch = binding.detail_route.match(/^\/demo\/([0-9]+)\/$/);
  if (
    !detailMatch ||
    binding.output_route !== `${binding.detail_route}output/` ||
    binding.component_key !== `demo-${detailMatch[1]}`
  ) {
    throw new BootstrapError("invalid_binding", "Binding routes and component key are inconsistent");
  }
  if (!["codex", "claude-code"].includes(binding.designated_harness)) {
    throw new BootstrapError("invalid_binding", "Binding designated_harness is invalid");
  }
  if (binding.timing_profile_ref !== timedRunIdentity) {
    throw new BootstrapError("binding_timing_mismatch", "Binding timing profile does not match accepted contract");
  }
  assertExactKeys(binding.positioning_brief, [
    "audience",
    "offer_boundary",
    "required_story",
    "creative_latitude",
    "prohibited_defaults"
  ], "positioning_brief");
  if (
    typeof binding.positioning_brief.audience !== "string" ||
    binding.positioning_brief.audience.length < 12 ||
    typeof binding.positioning_brief.offer_boundary !== "string" ||
    binding.positioning_brief.offer_boundary.length < 12 ||
    !Array.isArray(binding.positioning_brief.required_story) ||
    binding.positioning_brief.required_story.length < 5 ||
    !binding.positioning_brief.required_story.every((item) => REQUIRED_STORY.has(item)) ||
    !Array.isArray(binding.positioning_brief.creative_latitude) ||
    binding.positioning_brief.creative_latitude.length < 3 ||
    !binding.positioning_brief.creative_latitude.every((item) => ALLOWED_CREATIVE_LATITUDE.has(item)) ||
    !Array.isArray(binding.positioning_brief.prohibited_defaults) ||
    binding.positioning_brief.prohibited_defaults.length < 2
  ) {
    throw new BootstrapError("invalid_binding", "Binding positioning brief is invalid");
  }
  assertExactKeys(binding.output_destinations, ["portable_component", "local_preview"], "output_destinations");
  if (
    binding.output_destinations.portable_component !== "site/src/components/DemoOutput.astro" ||
    binding.output_destinations.local_preview !== "site/src/pages/index.astro"
  ) {
    throw new BootstrapError("invalid_binding", "Binding output destinations are invalid");
  }
  const expectedReceipts = {
    creative_direction: "artifacts/creative-direction.md",
    implementation: "artifacts/implementation-receipt.json",
    local_validation: "artifacts/local-validation.json",
    integration: "artifacts/integration-receipt.json",
    canonical_validation: "artifacts/canonical-route-validation.json",
    publication: "artifacts/publication-receipt.json",
    live_verification: "artifacts/live-verification-receipt.json"
  };
  assertExactKeys(binding.receipt_destinations, Object.keys(expectedReceipts), "receipt_destinations");
  if (JSON.stringify(binding.receipt_destinations) !== JSON.stringify(expectedReceipts)) {
    throw new BootstrapError("invalid_binding", "Binding receipt destinations are invalid");
  }
  if (
    JSON.stringify(binding.immutable_fields) !== JSON.stringify(EXPECTED_IMMUTABLE_FIELDS) ||
    JSON.stringify(binding.runtime_mutable_fields) !== JSON.stringify(EXPECTED_RUNTIME_MUTABLE_FIELDS)
  ) {
    throw new BootstrapError("invalid_binding", "Binding immutable or runtime-mutable field classes drifted");
  }
  return binding;
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
    const canonical = path.join(targetRoot, assertContainedRelative(entry.canonical_skill_path, "canonical_skill_path"));
    const mirror = path.join(targetRoot, entry.target_path);
    if (!fs.existsSync(canonical)) {
      throw new BootstrapError("missing_canonical_skill", `Canonical target skill is absent: ${entry.canonical_skill_path}`);
    }
    if (sha256File(canonical) !== sha256File(mirror)) {
      throw new BootstrapError("skill_mirror_mismatch", `Skill mirror differs from canonical skill: ${entry.target_path}`);
    }
  }
}

function verifyAuthoredChild(targetRoot, releasedEntries) {
  const rows = [];
  for (const entry of releasedEntries) {
    const targetPath = path.join(targetRoot, entry.path);
    if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isFile()) {
      throw new BootstrapError("authored_child_drift", `Authored child input is absent: ${entry.path}`);
    }
    const sha256 = sha256File(targetPath);
    const mode = (fs.statSync(targetPath).mode & 0o777).toString(8).padStart(4, "0");
    if (sha256 !== entry.sha256 || mode !== entry.mode) {
      throw new BootstrapError("authored_child_drift", `Authored child input drift: ${entry.path}`);
    }
    rows.push({ path: entry.path, sha256, mode, category: entry.category });
  }
  return rows;
}

function writeOrVerifyJson(targetRoot, relative, value, mode, classification) {
  const targetPath = path.join(targetRoot, relative);
  const expected = stableJson(value);
  if (mode === "create") {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, expected, "utf8");
  }
  if (!fs.existsSync(targetPath) || fs.readFileSync(targetPath, "utf8") !== expected) {
    throw new BootstrapError(classification, `${relative} differs from the accepted value`);
  }
  return sha256File(targetPath);
}

function buildInterface(release, semanticRelease, binding, bindingSha256) {
  return {
    schema_version: "1.0",
    kind: "website-demo-child-interface",
    materializer_version: MATERIALIZER_VERSION,
    semantic_source_release: semanticRelease,
    binding_sha256: bindingSha256,
    run_id: binding.run_id,
    target_root: binding.target_root,
    goal_qid: `root:${release.start_goal}`,
    first_actionable_qid: `root:${release.first_actionable}`,
    authored_chain: release.expected_chain.map((id) => `root:${id}`),
    detail_route: binding.detail_route,
    output_route: binding.output_route,
    component_key: binding.component_key,
    designated_harness: binding.designated_harness,
    timing_profile_ref: binding.timing_profile_ref,
    output_destinations: binding.output_destinations,
    receipt_destinations: binding.receipt_destinations,
    external_authority_required_for: [
      "shared-source integration",
      "Git commit and normal push",
      "provider visibility and public verification"
    ],
    authority_stored_in_child: false
  };
}

function buildSeal(release, semanticRelease, bindingSha256, interfaceSha256, authoredChildEntries, manifestSha256) {
  return {
    schema_version: "1.0",
    kind: "website-demo-immutable-child-contract",
    materializer_version: MATERIALIZER_VERSION,
    semantic_source_release: semanticRelease,
    binding_sha256: bindingSha256,
    interface_sha256: interfaceSha256,
    operator_manifest_sha256: manifestSha256,
    authored_chain: release.expected_chain.map((id) => `root:${id}`),
    required_qids: release.required_qids,
    authored_child_entries: authoredChildEntries,
    immutable_requirements: [
      "Static Astro semantic HTML and CSS",
      "zero client-side JavaScript and runtime scripts",
      "Ocean Flow public-safe accessible output",
      "portable DemoOutput.astro plus thin caller adapter",
      "build-once serial shared-output validation",
      "external caller authority for shared-source Git and provider work",
      "exact-SHA READY deployments and bound public routes",
      "truthful fallback and closure consistency"
    ],
    runtime_mutable_fields: EXPECTED_RUNTIME_MUTABLE_FIELDS,
    authored_graph_edits_after_materialization: false
  };
}

function verifyExpectedTargetInventory(targetRoot, manifest, receiptRelative) {
  const allowed = new Set([
    ...walkFiles(path.join(targetRoot, ".mdkg")).map((item) => `.mdkg/${item.relative}`),
    ...manifest.entries.map((entry) => entry.target_path),
    BINDING_TARGET,
    INTERFACE_TARGET,
    SEAL_TARGET,
    receiptRelative
  ]);
  const unexpected = walkFiles(targetRoot)
    .map((item) => item.relative)
    .filter((relative) => !allowed.has(relative));
  if (unexpected.length > 0) {
    throw new BootstrapError("unexpected_target_content", `Unexpected generated target: ${unexpected[0]}`);
  }
}

function verifyChild(repoRoot, cliPath, targetRelative, release) {
  const rootArgs = ["--root", targetRelative];
  const validate = runJson(repoRoot, cliPath, [...rootArgs, "validate", "--json"], "validation_failed");
  if (validate.ok !== true || validate.warning_count !== 0 || validate.error_count !== 0) {
    throw new BootstrapError("validation_failed", "Child validation did not pass with zero warnings and errors");
  }
  const goal = runJson(repoRoot, cliPath, [...rootArgs, "goal", "show", release.start_goal, "--json"], "goal_id_mismatch");
  if (goal.goal.id !== release.start_goal || goal.goal.qid !== `root:${release.start_goal}`) {
    throw new BootstrapError("goal_id_mismatch", `Selected goal id changed: ${goal.goal.id}`);
  }
  const next = runJson(repoRoot, cliPath, [...rootArgs, "goal", "next", release.start_goal, "--json"], "routing_failed");
  if (!next.node || next.node.id !== release.first_actionable || (next.warnings || []).length !== 0) {
    throw new BootstrapError("routing_failed", `Child goal did not route cleanly to ${release.first_actionable}`);
  }
  const edgeList = "parent,epic,relates,blocked_by,blocks,prev,next,context_refs,evidence_refs";
  const packArgs = (profile) => [
    ...rootArgs,
    "pack",
    next.node.id,
    "--profile",
    profile,
    "--depth",
    "8",
    "--edges",
    edgeList,
    "--skills",
    "auto",
    "--skills-depth",
    "full",
    "--dry-run",
    "--stats"
  ];
  const conciseQids = packQids(run(repoRoot, cliPath, packArgs("concise"), "pack_failed"));
  const standardQids = packQids(run(repoRoot, cliPath, packArgs("standard"), "pack_failed"));
  for (const qid of release.required_qids) {
    if (!conciseQids.includes(qid) || !standardQids.includes(qid)) {
      throw new BootstrapError("pack_failed", `Child pack is missing ${qid}`);
    }
  }
  return {
    validation: { ok: true, warning_count: 0, error_count: 0 },
    routing: {
      goal_qid: goal.goal.qid,
      first_actionable_qid: next.node.qid,
      authored_chain: release.expected_chain.map((id) => `root:${id}`),
      warning_count: 0
    },
    packs: {
      edge_list: edgeList,
      concise: { root_qid: next.node.qid, node_count: conciseQids.length, included_qids: conciseQids },
      standard: { root_qid: next.node.qid, node_count: standardQids.length, included_qids: standardQids }
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
    const releaseLocation = normalizeRelative(repoRoot, args.release, "release");
    const bindingLocation = normalizeRelative(repoRoot, args.binding, "binding");
    const receiptLocation = normalizeRelative(repoRoot, args.receipt, "receipt");
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
    const release = loadRelease(repoRoot, releaseLocation.absolute, source.relative, args["start-goal"]);
    const semanticRelease = hashIdentity(releaseLocation.absolute);
    const timedRunIdentity = `sha256:${release.timed_run_contract.sha256}`;
    const binding = loadBinding(bindingLocation.absolute, target.relative, semanticRelease, timedRunIdentity);
    const bindingSha256 = sha256File(bindingLocation.absolute);
    const manifestSha256 = sha256File(manifestLocation.absolute);

    if (release.operator_manifest.path !== manifestLocation.relative || release.operator_manifest.sha256 !== manifestSha256) {
      throw new BootstrapError("source_release_dependency_drift", "Selected operator manifest is not the released manifest");
    }
    const releasedAuthoredEntries = verifyReleaseInputs(source.absolute, release, manifest);
    verifyManifestSources(source.absolute, manifest);

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
    const authoredChildEntries = verifyAuthoredChild(target.absolute, releasedAuthoredEntries);

    writeOrVerifyJson(target.absolute, BINDING_TARGET, binding, mode, "binding_tamper");
    const childInterface = buildInterface(release, semanticRelease, binding, bindingSha256);
    const interfaceSha256 = writeOrVerifyJson(
      target.absolute,
      INTERFACE_TARGET,
      childInterface,
      mode,
      "interface_drift"
    );
    const childSeal = buildSeal(
      release,
      semanticRelease,
      bindingSha256,
      interfaceSha256,
      authoredChildEntries,
      manifestSha256
    );
    const childSealSha256 = writeOrVerifyJson(
      target.absolute,
      SEAL_TARGET,
      childSeal,
      mode,
      "seal_drift"
    );

    verifyExpectedTargetInventory(target.absolute, manifest, receiptRelativeToTarget);
    const generatedInventory = inventory(target.absolute, [receiptRelativeToTarget]);
    let previousReceipt = null;
    if (mode === "verify-only") {
      previousReceipt = readJson(receiptLocation.absolute, "invalid_previous_receipt", "Previous bootstrap receipt");
      if (
        previousReceipt.semantic_source_release !== semanticRelease ||
        previousReceipt.binding_sha256 !== bindingSha256 ||
        previousReceipt.child_interface_sha256 !== interfaceSha256 ||
        previousReceipt.child_contract_seal_sha256 !== childSealSha256 ||
        JSON.stringify(previousReceipt.generated_inventory) !== JSON.stringify(generatedInventory)
      ) {
        throw new BootstrapError("inventory_drift", "Verify-only inventory differs from the accepted bootstrap receipt");
      }
    }

    const child = verifyChild(repoRoot, cliPath, target.relative, release);
    const receipt = {
      schema_version: "2.0",
      kind: "website-demo-bootstrap-receipt",
      state: "pass",
      mode,
      command:
        `node scripts/bootstrap-website-demo-run.js --source ${source.relative} --target ${target.relative} ` +
        `--start-goal ${args["start-goal"]} --manifest ${manifestLocation.relative} ` +
        `--release ${releaseLocation.relative} --binding ${bindingLocation.relative} ` +
        `--receipt ${receiptLocation.relative}`,
      canonical_fork_command:
        `mdkg graph fork ${source.relative}/.mdkg --target ${target.relative} ` +
        `--start-goal ${args["start-goal"]} --json`,
      materializer_version: MATERIALIZER_VERSION,
      materializer_sha256: sha256File(__filename),
      source_root: source.relative,
      semantic_source_release: semanticRelease,
      source_release_path: releaseLocation.relative,
      operator_manifest_path: manifestLocation.relative,
      operator_manifest_sha256: manifestSha256,
      binding_source_path: bindingLocation.relative,
      binding_sha256: bindingSha256,
      target_root: target.relative,
      start_goal: args["start-goal"],
      preserved_ids: true,
      selected_goal_qid: child.routing.goal_qid,
      child_interface_path: INTERFACE_TARGET,
      child_interface_sha256: interfaceSha256,
      child_contract_seal_path: SEAL_TARGET,
      child_contract_seal_sha256: childSealSha256,
      authored_child_entry_count: authoredChildEntries.length,
      authored_child_entries: authoredChildEntries,
      cli_source_tree_hash: fork ? fork.source_hash.source_tree_hash : previousReceipt.cli_source_tree_hash,
      generated_inventory: generatedInventory,
      generated_file_count: generatedInventory.length,
      validation: child.validation,
      routing: child.routing,
      packs: child.packs,
      repeat_result:
        mode === "verify-only"
          ? "identical release binding authored child operator interface seal routing packs and inventory"
          : "first absent-target creation",
      external_authority_granted: false,
      work_started: false,
      failure_classification: null
    };
    fs.mkdirSync(path.dirname(receiptLocation.absolute), { recursive: true });
    fs.writeFileSync(receiptLocation.absolute, stableJson(receipt), "utf8");
    process.stdout.write(stableJson(receipt));
  } catch (error) {
    const classification = error instanceof BootstrapError ? error.classification : "unexpected_failure";
    const failure = {
      schema_version: "2.0",
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
