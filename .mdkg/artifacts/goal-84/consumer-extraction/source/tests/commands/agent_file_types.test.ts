import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const { loadConfig } = require("../../core/config");
const { buildIndex } = require("../../graph/indexer");
const { runPackCommand } = require("../../commands/pack");
const { runSearchCommand } = require("../../commands/search");
const { runShowCommand } = require("../../commands/show");
const { runValidateCommand } = require("../../commands/validate");
const { runNewCommand } = require("../../commands/new");
const { runCapabilityListCommand } = require("../../commands/capability");
const {
  runWorkContractNewCommand,
  runWorkOrderNewCommand,
  runWorkOrderStatusCommand,
  runWorkReceiptNewCommand,
  runWorkReceiptVerifyCommand,
  runWorkValidateCommand,
} = require("../../commands/work");
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";

function fixtureRoot(): string {
  return path.resolve(__dirname, "..", "..", "..", "tests", "fixtures", "agent");
}

function writeConfig(root: string): void {
  const config = {
    schema_version: 1,
    tool: "mdkg",
    root_required: true,
    index: {
      auto_reindex: true,
      tolerant: false,
      global_index_path: ".mdkg/index/global.json",
    },
    pack: {
      default_depth: 2,
      default_edges: ["parent", "epic", "relates"],
      verbose_core_list_path: ".mdkg/core/core.md",
      limits: { max_nodes: 25, max_bytes: 2000000 },
    },
    templates: {
      root_path: ".mdkg/templates",
      default_set: "default",
      workspace_overrides_enabled: false,
    },
    work: {
      status_enum: ["backlog", "blocked", "todo", "progress", "review", "done"],
      priority_min: 0,
      priority_max: 9,
      next: {
        strategy: "chain_then_priority",
        status_preference: ["progress", "todo", "review", "blocked", "backlog"],
      },
    },
    workspaces: {
      root: { path: ".", enabled: true, mdkg_dir: ".mdkg" },
    },
  };

  writeFile(path.join(root, ".mdkg", "config.json"), JSON.stringify(config, null, 2));
}

function setupWorkspace(root: string): void {
  writeConfig(root);
  writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg", "core", "core.md"), "# core\n");
}

function writeSkill(root: string, slug: string): void {
  writeFile(
    path.join(root, ".mdkg", "skills", slug, "SKILL.md"),
    [
      "---",
      `name: ${slug}`,
      `description: ${slug} guidance`,
      "tags: [stage:review]",
      "---",
      "",
      "# Goal",
      "",
      "Provide review guidance.",
    ].join("\n")
  );
}

function writeSpecWithKind(root: string, specKind: string, id?: string): string {
  const normalizedId = id ?? `spec.${specKind.replace(/_/g, "-")}`;
  const specPath = path.join(root, ".mdkg", "work", normalizedId, "SPEC.md");
  writeFile(
    specPath,
    [
      "---",
      `id: ${normalizedId}`,
      "type: spec",
      `title: ${specKind} fixture`,
      "version: 0.1.0",
      `spec_kind: ${specKind}`,
      "role: tool_service",
      "runtime_mode: tool_service",
      "work_contracts: []",
      "requested_capabilities: []",
      "skill_refs: []",
      "tool_refs: []",
      "model_refs: []",
      "wasm_component_refs: []",
      "runtime_image_refs: []",
      "subagent_refs: []",
      "resource_profile: builder",
      "update_policy: manual",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "refs: []",
      "aliases: []",
      "created: 2026-06-06",
      "updated: 2026-06-06",
      "---",
      "# Purpose",
      "",
      "Fixture reusable capability surface.",
      "",
      "# Runtime",
      "",
      "Tool service runtime.",
      "",
      "# Work Contracts",
      "",
      "No work contracts in this fixture.",
      "",
      "# Capabilities",
      "",
      "No requested capabilities in this fixture.",
    ].join("\n")
  );
  return specPath;
}

function writeManifestWithKind(
  root: string,
  manifestKind: string,
  id?: string,
  frontmatterType = "manifest"
): string {
  const normalizedId = id ?? `manifest.${manifestKind.replace(/_/g, "-")}`;
  const manifestPath = path.join(root, ".mdkg", "work", normalizedId, "MANIFEST.md");
  writeFile(
    manifestPath,
    [
      "---",
      `id: ${normalizedId}`,
      `type: ${frontmatterType}`,
      `title: ${manifestKind} fixture`,
      "version: 0.1.0",
      `spec_kind: ${manifestKind}`,
      "role: tool_service",
      "runtime_mode: tool_service",
      "work_contracts: []",
      "requested_capabilities: []",
      "skill_refs: []",
      "tool_refs: []",
      "model_refs: []",
      "wasm_component_refs: []",
      "runtime_image_refs: []",
      "subagent_refs: []",
      "resource_profile: builder",
      "update_policy: manual",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "refs: []",
      "aliases: []",
      "created: 2026-06-25",
      "updated: 2026-06-25",
      "---",
      "# Purpose",
      "",
      "Fixture reusable manifest capability surface.",
      "",
      "# Runtime",
      "",
      "Tool service runtime.",
      "",
      "# Work Contracts",
      "",
      "No work contracts in this fixture.",
      "",
      "# Capabilities",
      "",
      "No requested capabilities in this fixture.",
    ].join("\n")
  );
  return manifestPath;
}

function writeManifestSemanticDocument(filePath: string, id: string, type: "manifest" | "spec"): void {
  writeFile(
    filePath,
    [
      "---",
      `id: ${id}`,
      `type: ${type}`,
      "title: Duplicate Bridge Fixture",
      "version: 0.1.0",
      "spec_kind: agent",
      "role: tool_service",
      "runtime_mode: tool_service",
      "work_contracts: []",
      "requested_capabilities: []",
      "skill_refs: []",
      "tool_refs: []",
      "model_refs: []",
      "wasm_component_refs: []",
      "runtime_image_refs: []",
      "subagent_refs: []",
      "resource_profile: builder",
      "update_policy: manual",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "refs: []",
      "aliases: []",
      "created: 2026-06-25",
      "updated: 2026-06-25",
      "---",
      "# Purpose",
      "",
      "Fixture reusable capability surface.",
      "",
      "# Runtime",
      "",
      "Tool service runtime.",
      "",
      "# Work Contracts",
      "",
      "No work contracts in this fixture.",
      "",
      "# Capabilities",
      "",
      "No requested capabilities in this fixture.",
    ].join("\n")
  );
}

function writeWorkOrderValidationFixture(
  root: string,
  overrides: Partial<Record<"payload_hash" | "queue_refs" | "trigger_ref", string>>
): void {
  writeFile(
    path.join(root, ".mdkg", "work", "work-fixture", "WORK.md"),
    [
      "---",
      "id: work.fixture",
      "type: work",
      "title: Fixture Work",
      "version: 1.0.0",
      "agent_id: spec.fixture",
      "kind: generic",
      "pricing_model: included",
      "required_capabilities: [capability.fixture]",
      "skill_refs: []",
      "tool_refs: []",
      "model_refs: []",
      "wasm_component_refs: []",
      "runtime_image_refs: []",
      "subagent_refs: []",
      "inputs: [request:text:required]",
      "outputs: [result:text:required]",
      "receipt_required: true",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "refs: []",
      "aliases: []",
      "created: 2026-06-06",
      "updated: 2026-06-06",
      "---",
      "# Capability",
      "",
      "Fixture work contract.",
    ].join("\n")
  );
  writeFile(
    path.join(root, ".mdkg", "work", "order-fixture", "WORK_ORDER.md"),
    [
      "---",
      "id: order.fixture",
      "type: work_order",
      "title: Fixture Order",
      "version: 0.1.0",
      "work_id: work.fixture",
      "work_version: 1.0.0",
      "requester: user.fixture",
      "order_status: submitted",
      "request_ref: request.fixture",
      `trigger_ref: ${overrides.trigger_ref ?? "trigger.fixture"}`,
      `payload_hash: ${overrides.payload_hash ?? "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}`,
      "input_refs: []",
      `queue_refs: ${overrides.queue_refs ?? "[queue.fixture]"}`,
      "requested_outputs: [result:text:required]",
      "constraint_refs: []",
      "artifact_policy: commit_sidecar_and_zip",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: [work.fixture]",
      "refs: []",
      "aliases: []",
      "created: 2026-06-06",
      "updated: 2026-06-06",
      "---",
      "# Request",
      "",
      "Fixture work order.",
    ].join("\n")
  );
}

function writeReceiptValidationFixture(
  root: string,
  overrides: Partial<Record<"redaction_policy" | "evidence_hashes", string>>
): void {
  writeWorkOrderValidationFixture(root, {});
  writeFile(
    path.join(root, ".mdkg", "work", "receipt-fixture", "RECEIPT.md"),
    [
      "---",
      "id: receipt.fixture",
      "type: receipt",
      "title: Fixture Receipt",
      "version: 0.1.0",
      "work_order_id: order.fixture",
      "receipt_status: recorded",
      "outcome: success",
      "cost_ref: cost.redacted",
      `redaction_policy: ${overrides.redaction_policy ?? "refs_and_hashes_only"}`,
      "proof_refs: [proof.fixture]",
      "attestation_refs: [attestation.fixture]",
      `evidence_hashes: ${overrides.evidence_hashes ?? "[sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa]"}`,
      "input_hashes: [sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb]",
      "output_hashes: [sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc]",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: [order.fixture]",
      "refs: []",
      "aliases: []",
      "created: 2026-06-06",
      "updated: 2026-06-06",
      "---",
      "# Outcome",
      "",
      "Fixture receipt.",
    ].join("\n")
  );
}

function copyValidFixtures(root: string): void {
  fs.cpSync(
    path.join(fixtureRoot(), "valid"),
    path.join(root, ".mdkg", "work", "agent"),
    { recursive: true }
  );
  writeSkill(root, "review-loop");
}

function replaceInFile(filePath: string, search: string, replacement: string): void {
  const content = fs.readFileSync(filePath, "utf8");
  assert.ok(content.includes(search), `expected ${filePath} to include ${search}`);
  writeFile(filePath, content.replace(search, replacement));
}

function insertAfterLine(filePath: string, line: string, insertedLines: string[]): void {
  replaceInFile(filePath, line, [line, ...insertedLines].join("\n"));
}

function silenceErrors<T>(fn: () => T): T {
  const originalError = console.error;
  console.error = () => {};
  try {
    return fn();
  } finally {
    console.error = originalError;
  }
}

function captureOutput(fn: () => void): { stdout: string; stderr: string } {
  const stdout: string[] = [];
  const stderr: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args: unknown[]) => {
    stdout.push(args.map(String).join(" "));
  };
  console.error = (...args: unknown[]) => {
    stderr.push(args.map(String).join(" "));
  };
  try {
    fn();
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
  return { stdout: stdout.join("\n"), stderr: stderr.join("\n") };
}

function captureThrownOutput(fn: () => void): {
  stdout: string;
  stderr: string;
  error: unknown;
} {
  const stdout: string[] = [];
  const stderr: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;
  let error: unknown;
  console.log = (...args: unknown[]) => {
    stdout.push(args.map(String).join(" "));
  };
  console.error = (...args: unknown[]) => {
    stderr.push(args.map(String).join(" "));
  };
  try {
    fn();
  } catch (err) {
    error = err;
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
  return { stdout: stdout.join("\n"), stderr: stderr.join("\n"), error };
}

test("validate and index accept valid Agent workflow file fixtures", () => {
  const root = makeTempDir("mdkg-agent-valid-");
  setupWorkspace(root);
  copyValidFixtures(root);

  silenceErrors(() => runValidateCommand({ root, quiet: true }));

  const config = loadConfig(root);
  const index = buildIndex(root, config);
  assert.equal(index.nodes["root:agent.image-generator"].type, "manifest");
  assert.equal(index.nodes["root:agent.image-generator"].path, ".mdkg/work/agent/image-agent/MANIFEST.md");
  assert.deepEqual(index.nodes["root:agent.image-generator"].attributes.skill_refs, [
    "author-agent-manifest",
  ]);
  assert.deepEqual(index.nodes["root:agent.image-generator"].attributes.tool_refs, [
    "tool.mdkg.pack",
  ]);
  assert.deepEqual(index.nodes["root:agent.image-generator"].attributes.model_refs, [
    "model.image-generate",
  ]);
  assert.deepEqual(index.nodes["root:agent.image-generator"].attributes.wasm_component_refs, [
    "wasm.image-normalizer",
  ]);
  assert.deepEqual(index.nodes["root:agent.image-generator"].attributes.runtime_image_refs, [
    "image.agent-image-generator.1.0.0",
  ]);
  assert.deepEqual(index.nodes["root:agent.image-generator"].attributes.subagent_refs, [
    "agent.image-generator",
  ]);
  assert.equal(index.nodes["root:agent.legacy-spec-worker"].type, "spec");
  assert.equal(index.nodes["root:agent.legacy-spec-worker"].path, ".mdkg/work/agent/legacy-spec-agent/SPEC.md");
  assert.equal(index.nodes["root:work.legacy-spec-render"].attributes.agent_id, "agent.legacy-spec-worker");
  assert.equal(index.nodes["root:work.generate-image"].attributes.kind, "image_generation");
  assert.deepEqual(index.nodes["root:work.generate-image"].attributes.skill_refs, [
    "author-agent-work-contract",
  ]);
  assert.equal(index.nodes["root:work.generate-image"].attributes.pricing_model, "included");
  assert.deepEqual(index.nodes["root:work.generate-image"].attributes.tool_refs, [
    "tool.artifact-uploader",
  ]);
  assert.deepEqual(index.nodes["root:work.generate-image"].attributes.model_refs, [
    "model.image-generate",
  ]);
  assert.deepEqual(index.nodes["root:work.generate-image"].attributes.wasm_component_refs, [
    "wasm.image-normalizer",
  ]);
  assert.deepEqual(index.nodes["root:work.generate-image"].attributes.runtime_image_refs, [
    "image.agent-image-generator.1.0.0",
  ]);
  assert.deepEqual(index.nodes["root:work.generate-image"].attributes.subagent_refs, [
    "agent.image-generator",
  ]);
  assert.equal(index.nodes["root:receipt.generate-image-1"].attributes.work_order_id, "order.generate-image-1");
  assert.deepEqual(index.reverse_edges.relates["root:work.generate-image"].sort(), [
    "root:agent.image-generator",
    "root:feedback.image-quality-1",
    "root:order.generate-image-1",
    "root:proposal.work-generate-image-1",
  ]);
  assert.equal(
    index.nodes["root:proposal.skill-review-loop-1"].attributes.target_id,
    "skill.review-loop"
  );
  assert.deepEqual(index.nodes["root:proposal.skill-review-loop-1"].attributes.evidence_refs, [
    "feedback.image-quality-1",
    "receipt.generate-image-1",
    "skill.review-loop",
  ]);
  assert.equal(index.nodes["root:receipt.runtime-render-1"].attributes.receipt_status, "superseded");
  assert.deepEqual(index.nodes["root:order.runtime-render-1"].attributes.input_refs, [
    "artifact://runtime/input",
  ]);
  assert.deepEqual(index.nodes["root:order.runtime-render-1"].attributes.requested_outputs, [
    "artifact_uri:uri:required",
    "receipt_markdown:file:required",
  ]);
  assert.equal(index.nodes["root:order.runtime-render-1"].attributes.artifact_policy, "commit_sidecar_and_zip");
  assert.deepEqual(index.nodes["root:receipt.runtime-render-1"].attributes.proof_refs, [
    "tool.fixture-renderer",
    "artifact://runtime/proof",
  ]);
  assert.deepEqual(index.nodes["root:receipt.runtime-render-1"].attributes.input_hashes, [
    "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  ]);
  assert.deepEqual(index.nodes["root:receipt.runtime-render-1"].attributes.output_hashes, [
    "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  ]);
});

test("validate and index accept contract profile metadata on workflow surfaces", () => {
  const root = makeTempDir("mdkg-agent-contract-profile-valid-");
  setupWorkspace(root);
  const manifestPath = writeManifestWithKind(root, "agent", "agent.profiled");
  insertAfterLine(manifestPath, "work_contracts: []", [
    "contract_profile: omni-room",
    "validation_policy_ref: policy.validation",
    "evidence_policy_ref: policy.evidence",
  ]);
  writeReceiptValidationFixture(root, {});

  const workPath = path.join(root, ".mdkg", "work", "work-fixture", "WORK.md");
  insertAfterLine(workPath, "kind: generic", ["contract_profile: omni-room"]);
  const orderPath = path.join(root, ".mdkg", "work", "order-fixture", "WORK_ORDER.md");
  insertAfterLine(orderPath, "order_status: submitted", [
    "contract_profile: omni-room",
    "validation_policy_ref: policy.validation",
    "evidence_policy_ref: policy.evidence",
  ]);
  const receiptPath = path.join(root, ".mdkg", "work", "receipt-fixture", "RECEIPT.md");
  insertAfterLine(receiptPath, "redaction_policy: refs_and_hashes_only", [
    "contract_profile: omni-room",
    "receipt_kind: worker",
    "redaction_class: internal",
    "validation_policy_ref: policy.validation",
    "evidence_policy_ref: policy.evidence",
  ]);

  silenceErrors(() => runValidateCommand({ root, quiet: true }));

  const config = loadConfig(root);
  const index = buildIndex(root, config);
  assert.equal(index.nodes["root:agent.profiled"].attributes.contract_profile, "omni-room");
  assert.equal(index.nodes["root:agent.profiled"].attributes.validation_policy_ref, "policy.validation");
  assert.equal(index.nodes["root:agent.profiled"].attributes.evidence_policy_ref, "policy.evidence");
  assert.equal(index.nodes["root:work.fixture"].attributes.contract_profile, "omni-room");
  assert.equal(index.nodes["root:order.fixture"].attributes.contract_profile, "omni-room");
  assert.equal(index.nodes["root:order.fixture"].attributes.validation_policy_ref, "policy.validation");
  assert.equal(index.nodes["root:order.fixture"].attributes.evidence_policy_ref, "policy.evidence");
  assert.equal(index.nodes["root:receipt.fixture"].attributes.contract_profile, "omni-room");
  assert.equal(index.nodes["root:receipt.fixture"].attributes.receipt_kind, "worker");
  assert.equal(index.nodes["root:receipt.fixture"].attributes.redaction_class, "internal");
  assert.equal(index.nodes["root:receipt.fixture"].attributes.validation_policy_ref, "policy.validation");
  assert.equal(index.nodes["root:receipt.fixture"].attributes.evidence_policy_ref, "policy.evidence");
});

test("validate and work validate accept omni-room profile mode for compatible metadata", () => {
  const root = makeTempDir("mdkg-agent-contract-profile-mode-valid-");
  setupWorkspace(root);
  const manifestPath = writeManifestWithKind(root, "agent", "agent.profile-mode");
  insertAfterLine(manifestPath, "work_contracts: []", ["contract_profile: omni-room"]);
  writeReceiptValidationFixture(root, {});
  const receiptPath = path.join(root, ".mdkg", "work", "receipt-fixture", "RECEIPT.md");
  insertAfterLine(receiptPath, "redaction_policy: refs_and_hashes_only", [
    "contract_profile: omni-room",
    "receipt_kind: final",
    "redaction_class: public",
  ]);

  const validateOutput = captureOutput(() =>
    runValidateCommand({ root, profile: "omni-room", json: true })
  );
  const validateReceipt = JSON.parse(validateOutput.stdout);
  assert.equal(validateOutput.stderr, "");
  assert.equal(validateReceipt.ok, true);
  assert.equal(validateReceipt.validation_profile, "omni-room");

  const workOutput = captureOutput(() =>
    runWorkValidateCommand({ root, id: "receipt.fixture", profile: "omni-room", json: true })
  );
  const workReceipt = JSON.parse(workOutput.stdout);
  assert.equal(workOutput.stderr, "");
  assert.equal(workReceipt.ok, true);
  assert.equal(workReceipt.validation_profile, "omni-room");
  assert.equal(workReceipt.error_count, 0);
});

test("read-only work commands rebuild a missing graph index without persisting it", () => {
  const root = makeTempDir("mdkg-agent-work-observational-");
  setupWorkspace(root);
  writeReceiptValidationFixture(root, {});
  const indexDir = path.join(root, ".mdkg", "index");
  fs.rmSync(indexDir, { recursive: true, force: true });

  const commands = [
    () => runWorkValidateCommand({ root, id: "receipt.fixture", json: true }),
    () => runWorkOrderStatusCommand({ root, id: "order.fixture", json: true }),
    () => runWorkReceiptVerifyCommand({ root, id: "receipt.fixture", json: true }),
  ];
  for (const command of commands) {
    const output = captureOutput(command);
    assert.notEqual(output.stdout, "");
    assert.equal(fs.existsSync(indexDir), false);
  }
});

test("validate warns for ambiguous and unknown contract profile metadata in generic mode", () => {
  const root = makeTempDir("mdkg-agent-contract-profile-warnings-");
  setupWorkspace(root);
  const manifestPath = writeManifestWithKind(root, "agent", "agent.profile-warnings");
  insertAfterLine(manifestPath, "work_contracts: []", [
    "profile: runtime-owned",
    "contract_profile: custom-room",
  ]);
  writeReceiptValidationFixture(root, {});
  const receiptPath = path.join(root, ".mdkg", "work", "receipt-fixture", "RECEIPT.md");
  replaceInFile(
    receiptPath,
    "redaction_policy: refs_and_hashes_only",
    [
      "contract_profile: custom-room",
      "receipt_kind: reviewer",
      "redaction_class: sensitive",
    ].join("\n")
  );

  const output = captureOutput(() => runValidateCommand({ root, json: true }));
  const receipt = JSON.parse(output.stdout);
  const warningIds = receipt.warning_diagnostics.map(
    (diagnostic: { id: string }) => diagnostic.id
  );

  assert.equal(output.stderr, "");
  assert.equal(receipt.ok, true);
  assert.ok(warningIds.includes("contract-profile.ambiguous-field"));
  assert.ok(warningIds.includes("contract-profile.unknown"));
  assert.ok(warningIds.includes("receipt-kind.unknown"));
  assert.ok(warningIds.includes("redaction-class.unknown"));
  assert.ok(warningIds.includes("redaction-class.missing-policy"));
});

test("profile mode escalates incompatible contract profile metadata to errors", () => {
  const root = makeTempDir("mdkg-agent-contract-profile-mode-invalid-");
  setupWorkspace(root);
  const manifestPath = writeManifestWithKind(root, "agent", "agent.profile-mode-invalid");
  insertAfterLine(manifestPath, "work_contracts: []", [
    "profile: runtime-owned",
    "contract_profile: custom-room",
  ]);
  writeReceiptValidationFixture(root, {});
  const receiptPath = path.join(root, ".mdkg", "work", "receipt-fixture", "RECEIPT.md");
  replaceInFile(
    receiptPath,
    "redaction_policy: refs_and_hashes_only",
    [
      "contract_profile: custom-room",
      "receipt_kind: reviewer",
      "redaction_class: sensitive",
    ].join("\n")
  );

  const validateOutput = captureThrownOutput(() =>
    runValidateCommand({ root, profile: "omni-room", json: true })
  );
  const validateReceipt = JSON.parse(validateOutput.stdout);

  assert.match(String(validateOutput.error), /validation failed/);
  assert.equal(validateOutput.stderr, "");
  assert.equal(validateReceipt.ok, false);
  assert.equal(validateReceipt.validation_profile, "omni-room");
  assert.ok(
    validateReceipt.errors.some((error: string) =>
      error.includes("contract-profile.ambiguous-field")
    )
  );
  assert.ok(
    validateReceipt.errors.some((error: string) =>
      error.includes("contract-profile.incompatible")
    )
  );
  assert.ok(
    validateReceipt.errors.some((error: string) => error.includes("receipt-kind.incompatible"))
  );
  assert.ok(
    validateReceipt.errors.some((error: string) =>
      error.includes("redaction-class.incompatible")
    )
  );
  assert.ok(
    validateReceipt.errors.some((error: string) =>
      error.includes("redaction-class.missing-policy")
    )
  );

  const workOutput = captureThrownOutput(() =>
    runWorkValidateCommand({ root, id: "receipt.fixture", profile: "omni-room", json: true })
  );
  const workReceipt = JSON.parse(workOutput.stdout);
  const errorCodes = workReceipt.diagnostics
    .filter((diagnostic: { severity: string }) => diagnostic.severity === "error")
    .map((diagnostic: { code: string }) => diagnostic.code);

  assert.match(String(workOutput.error), /workflow validation failed/);
  assert.equal(workOutput.stderr, "");
  assert.equal(workReceipt.ok, false);
  assert.equal(workReceipt.validation_profile, "omni-room");
  assert.ok(errorCodes.includes("contract-profile.incompatible"));
  assert.ok(errorCodes.includes("receipt-kind.incompatible"));
  assert.ok(errorCodes.includes("redaction-class.incompatible"));
  assert.ok(errorCodes.includes("redaction-class.missing-policy"));
});

test("validate rejects malformed contract profile metadata with stable ids", () => {
  const root = makeTempDir("mdkg-agent-contract-profile-invalid-");
  setupWorkspace(root);
  const manifestPath = writeManifestWithKind(root, "agent", "agent.profile-invalid");
  insertAfterLine(manifestPath, "work_contracts: []", ["contract_profile: Omni Room"]);
  writeReceiptValidationFixture(root, {});
  const receiptPath = path.join(root, ".mdkg", "work", "receipt-fixture", "RECEIPT.md");
  insertAfterLine(receiptPath, "redaction_policy: refs_and_hashes_only", [
    "receipt_kind: Worker",
    "redaction_class: Secret Class",
  ]);
  writeFile(
    path.join(root, ".mdkg", "work", "receipt-class-invalid", "RECEIPT.md"),
    [
      "---",
      "id: receipt.class-invalid",
      "type: receipt",
      "title: Fixture Receipt Class Invalid",
      "version: 0.1.0",
      "work_order_id: order.fixture",
      "receipt_status: recorded",
      "outcome: success",
      "redaction_policy: refs_and_hashes_only",
      "redaction_class: Secret Class",
      "proof_refs: []",
      "attestation_refs: []",
      "evidence_hashes: []",
      "input_hashes: []",
      "output_hashes: []",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: [order.fixture]",
      "refs: []",
      "aliases: []",
      "created: 2026-06-06",
      "updated: 2026-06-06",
      "---",
      "# Outcome",
      "",
      "Fixture invalid redaction class.",
    ].join("\n")
  );

  const output = captureThrownOutput(() => runValidateCommand({ root, json: true }));
  const receipt = JSON.parse(output.stdout);

  assert.match(String(output.error), /validation failed/);
  assert.equal(output.stderr, "");
  assert.equal(receipt.ok, false);
  assert.ok(
    receipt.errors.some((error: string) => error.includes("contract-profile.invalid"))
  );
  assert.ok(receipt.errors.some((error: string) => error.includes("receipt-kind.invalid")));
  assert.ok(receipt.errors.some((error: string) => error.includes("redaction-class.invalid")));
});

test("validate accepts repos with no SPEC files and capability list reports zero specs", () => {
  const root = makeTempDir("mdkg-agent-no-spec-");
  setupWorkspace(root);

  silenceErrors(() => runValidateCommand({ root, quiet: true }));

  const config = loadConfig(root);
  const index = buildIndex(root, config);
  assert.equal(
    (Object.values(index.nodes) as Array<{ type: string }>).filter(
      (node) => node.type === "spec"
    ).length,
    0
  );

  const output = captureOutput(() =>
    runCapabilityListCommand({ root, kind: "spec", json: true })
  );
  const receipt = JSON.parse(output.stdout);
  assert.equal(receipt.kind, "capability");
  assert.equal(receipt.count, 0);
  assert.deepEqual(receipt.items, []);
});

test("validate accepts canonical MANIFEST files as manifest semantic records", () => {
  const root = makeTempDir("mdkg-agent-manifest-");
  setupWorkspace(root);
  writeManifestWithKind(root, "agent", "agent.manifest-worker");

  silenceErrors(() => runValidateCommand({ root, quiet: true }));

  const config = loadConfig(root);
  const index = buildIndex(root, config);
  const manifest = index.nodes["root:agent.manifest-worker"];
  assert.equal(manifest.type, "manifest");
  assert.equal(manifest.path, ".mdkg/work/agent.manifest-worker/MANIFEST.md");
  assert.equal(manifest.attributes.spec_kind, "agent");
  assert.equal(manifest.attributes.role, "tool_service");

  const output = captureOutput(() =>
    runCapabilityListCommand({ root, kind: "spec", json: true })
  );
  const receipt = JSON.parse(output.stdout);
  assert.equal(receipt.kind, "capability");
  assert.equal(receipt.count, 1);
  assert.equal(receipt.items[0].kind, "spec");
  assert.equal(receipt.items[0].node_type, "manifest");
  assert.equal(receipt.items[0].path, ".mdkg/work/agent.manifest-worker/MANIFEST.md");
  assert.equal(receipt.items[0].spec.spec_kind, "agent");
});

test("validate warns for legacy SPEC files during the compatibility release", () => {
  const root = makeTempDir("mdkg-agent-legacy-spec-warning-");
  setupWorkspace(root);
  writeSpecWithKind(root, "agent", "agent.legacy-worker");

  const output = captureOutput(() => runValidateCommand({ root, json: true }));
  const receipt = JSON.parse(output.stdout);
  assert.equal(receipt.ok, true);
  assert.equal(receipt.error_count, 0);
  assert.equal(receipt.warning_count, 1);
  assert.equal(receipt.warning_diagnostics[0].id, "manifest.compat.spec_legacy");
  assert.match(receipt.warnings[0], /SPEC\.md is legacy; MANIFEST\.md is the canonical manifest filename/);
});

test("validate warns for transitional MANIFEST files using legacy type spec", () => {
  const root = makeTempDir("mdkg-agent-transitional-manifest-");
  setupWorkspace(root);
  writeManifestWithKind(root, "agent", "agent.transitional-worker", "spec");

  const output = captureOutput(() => runValidateCommand({ root, json: true }));
  const receipt = JSON.parse(output.stdout);
  assert.equal(receipt.ok, true);
  assert.equal(receipt.error_count, 0);
  assert.equal(receipt.warning_count, 1);
  assert.equal(receipt.warning_diagnostics[0].id, "manifest.compat.type_spec");
  assert.match(receipt.warnings[0], /MANIFEST\.md uses legacy type: spec; use type: manifest/);

  const config = loadConfig(root);
  const index = buildIndex(root, config);
  assert.equal(index.nodes["root:agent.transitional-worker"].type, "spec");
  assert.equal(index.nodes["root:agent.transitional-worker"].path, ".mdkg/work/agent.transitional-worker/MANIFEST.md");
});

test("validate rejects sibling MANIFEST and SPEC files in one logical unit", () => {
  const root = makeTempDir("mdkg-agent-manifest-spec-duplicate-");
  setupWorkspace(root);
  const unitDir = path.join(root, ".mdkg", "work", "agent-duplicate");
  writeManifestSemanticDocument(path.join(unitDir, "MANIFEST.md"), "agent.duplicate-manifest", "manifest");
  writeManifestSemanticDocument(path.join(unitDir, "SPEC.md"), "agent.duplicate-spec", "spec");

  const output = captureThrownOutput(() => runValidateCommand({ root, json: true }));
  const receipt = JSON.parse(output.stdout);
  assert.equal(receipt.ok, false);
  assert.ok(
    receipt.errors.some((error: string) =>
      error.includes(".mdkg/work/agent-duplicate") &&
      error.includes("MANIFEST.md and SPEC.md cannot both exist in the same logical unit")
    )
  );

  const config = loadConfig(root);
  assert.throws(
    () => buildIndex(root, config),
    /MANIFEST\.md and SPEC\.md cannot both exist in the same logical unit/
  );
});

test("validate accepts all allowed MANIFEST spec_kind values", () => {
  const root = makeTempDir("mdkg-agent-manifest-kind-valid-");
  setupWorkspace(root);
  const allowedKinds = [
    "cli_tool",
    "api",
    "agent",
    "runtime_agent",
    "capability",
    "tool",
    "model",
    "runtime_image",
    "integration",
    "project_service",
  ];

  for (const kind of allowedKinds) {
    writeManifestWithKind(root, kind);
  }

  silenceErrors(() => runValidateCommand({ root, quiet: true }));

  const config = loadConfig(root);
  const index = buildIndex(root, config);
  for (const kind of allowedKinds) {
    const qid = `root:manifest.${kind.replace(/_/g, "-")}`;
    assert.equal(index.nodes[qid].type, "manifest");
    assert.equal(index.nodes[qid].attributes.spec_kind, kind);
  }
});

test("validate reports actionable diagnostics for documentation-only MANIFEST spec_kind values", () => {
  const documentationOnlyKinds = [
    "gap_register",
    "checkpoint",
    "roadmap",
    "audit",
    "go_no_go",
    "planning_note",
    "launch_checklist",
  ];

  for (const kind of documentationOnlyKinds) {
    const root = makeTempDir(`mdkg-agent-manifest-kind-misuse-${kind}-`);
    setupWorkspace(root);
    writeManifestWithKind(root, kind);

    const output = captureThrownOutput(() => runValidateCommand({ root, json: true }));
    const receipt = JSON.parse(output.stdout);

    assert.match(String(output.error), /validation failed/);
    assert.equal(output.stderr, "");
    assert.equal(receipt.ok, false);
    assert.ok(
      receipt.errors.some((error: string) =>
        error.includes(`spec_kind ${kind} is documentation-only`) &&
        error.includes("MANIFEST.md must define a reusable invocable capability surface") &&
        error.includes("legacy SPEC.md follows the same contract")
      ),
      `${kind} did not produce documentation-only MANIFEST guidance`
    );
  }
});

test("runtime-style work order and receipt fixtures validate and pack deterministic evidence", () => {
  const root = makeTempDir("mdkg-agent-runtime-style-");
  setupWorkspace(root);
  copyValidFixtures(root);

  silenceErrors(() => runValidateCommand({ root, quiet: true }));

  const out = ".mdkg/pack/runtime-receipt.json";
  runPackCommand({
    root,
    id: "receipt.runtime-render-1",
    depth: 3,
    edges: ["relates"],
    format: "json",
    out,
    noCache: true,
  });

  const payload = JSON.parse(fs.readFileSync(path.join(root, out), "utf8"));
  const qids = payload.nodes.map((node: { qid: string }) => node.qid);
  assert.ok(qids.includes("root:receipt.runtime-render-1"));
  assert.ok(qids.includes("root:order.runtime-render-1"));
  assert.ok(qids.includes("root:work.runtime-render"));
  assert.ok(qids.includes("root:agent.runtime-worker"));

  const receipt = payload.nodes.find((node: { qid: string }) => node.qid === "root:receipt.runtime-render-1");
  assert.equal(receipt.frontmatter.receipt_status, "superseded");
  assert.deepEqual(receipt.frontmatter.artifacts, ["artifact://runtime/output"]);
  assert.deepEqual(receipt.frontmatter.proof_refs, [
    "tool.fixture-renderer",
    "artifact://runtime/proof",
  ]);
  assert.deepEqual(receipt.frontmatter.input_hashes, [
    "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  ]);
  assert.deepEqual(receipt.frontmatter.output_hashes, [
    "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  ]);

  const order = payload.nodes.find((node: { qid: string }) => node.qid === "root:order.runtime-render-1");
  assert.deepEqual(order.frontmatter.input_refs, ["artifact://runtime/input"]);
  assert.deepEqual(order.frontmatter.requested_outputs, [
    "artifact_uri:uri:required",
    "receipt_markdown:file:required",
  ]);
  assert.deepEqual(order.frontmatter.constraint_refs, [
    "policy.runtime-safe",
    "fixture://runtime/constraints",
  ]);
  assert.equal(order.frontmatter.artifact_policy, "commit_sidecar_and_zip");
});

test("work validate reports typed workflow diagnostics and raw marker warnings", () => {
  const root = makeTempDir("mdkg-agent-work-validate-");
  setupWorkspace(root);
  copyValidFixtures(root);
  const workPath = path.join(root, ".mdkg", "work", "agent", "runtime-work", "WORK.md");
  fs.appendFileSync(
    workPath,
    [
      "",
      "# Boundary Review",
      "",
      "RAW_PAYLOAD_MARKER should be replaced with a payload hash or external artifact ref.",
      "",
    ].join("\n"),
    "utf8"
  );

  const output = captureOutput(() =>
    runWorkValidateCommand({ root, id: "work.runtime-render", json: true })
  );
  assert.equal(output.stderr, "");
  const receipt = JSON.parse(output.stdout);
  assert.equal(receipt.action, "work.validate");
  assert.equal(receipt.ok, true);
  assert.equal(receipt.type, "all");
  assert.equal(receipt.target.qid, "root:work.runtime-render");
  assert.equal(receipt.checked_count, 1);
  assert.equal(receipt.error_count, 0);
  assert.equal(receipt.warning_count, 1);
  assert.equal(receipt.diagnostics[0].severity, "warning");
  assert.equal(receipt.diagnostics[0].code, "raw-content.raw_payload");
  assert.equal(receipt.diagnostics[0].qid, "root:work.runtime-render");
});

test("work validate type filters catch malformed workflow files before indexing", () => {
  const root = makeTempDir("mdkg-agent-work-validate-invalid-");
  setupWorkspace(root);
  fs.mkdirSync(path.join(root, ".mdkg", "work", "invalid-work"), { recursive: true });
  fs.cpSync(
    path.join(fixtureRoot(), "invalid", "missing-input-schema", "WORK.md"),
    path.join(root, ".mdkg", "work", "invalid-work", "WORK.md")
  );

  const output = captureThrownOutput(() =>
    runWorkValidateCommand({ root, type: "work", json: true })
  );
  const receipt = JSON.parse(output.stdout);
  assert.match(String(output.error), /workflow validation failed/);
  assert.equal(output.stderr, "");
  assert.equal(receipt.action, "work.validate");
  assert.equal(receipt.ok, false);
  assert.equal(receipt.type, "work");
  assert.equal(receipt.checked_count, 1);
  assert.equal(receipt.error_count, 1);
  assert.ok(receipt.errors[0].includes("inputs is required"));
  assert.equal(receipt.diagnostics[0].severity, "error");
  assert.equal(receipt.diagnostics[0].code, "schema.invalid");
});

test("validate rejects invalid Agent workflow fixtures", () => {
  const invalidRoot = path.join(fixtureRoot(), "invalid");
  for (const fixtureName of fs.readdirSync(invalidRoot).sort()) {
    const root = makeTempDir(`mdkg-agent-invalid-${fixtureName}-`);
    setupWorkspace(root);
    fs.cpSync(
      path.join(invalidRoot, fixtureName),
      path.join(root, ".mdkg", "work", "bad"),
      { recursive: true }
    );

    assert.throws(
      () => silenceErrors(() => runValidateCommand({ root, quiet: true })),
      /validation failed/
    );
  }
});

test("validate reports missing SPEC work contract references", () => {
  const root = makeTempDir("mdkg-agent-missing-work-contract-");
  setupWorkspace(root);
  fs.cpSync(
    path.join(fixtureRoot(), "invalid", "missing-work-contract"),
    path.join(root, ".mdkg", "work", "bad"),
    { recursive: true }
  );

  const output = captureThrownOutput(() => runValidateCommand({ root, json: true }));
  const receipt = JSON.parse(output.stdout);

  assert.match(String(output.error), /validation failed/);
  assert.equal(output.stderr, "");
  assert.equal(receipt.ok, false);
  assert.ok(
    receipt.errors.some((error: string) =>
      error.includes(
        "root:agent.missing-work-contract: work_contracts[0] references missing WORK.md missing/WORK.md"
      )
    )
  );
});

test("validate reports SPEC work contract owner mismatches", () => {
  const root = makeTempDir("mdkg-agent-spec-work-owner-mismatch-");
  setupWorkspace(root);
  fs.cpSync(
    path.join(fixtureRoot(), "invalid", "spec-work-owner-mismatch"),
    path.join(root, ".mdkg", "work", "bad"),
    { recursive: true }
  );

  const output = captureThrownOutput(() => runValidateCommand({ root, json: true }));
  const receipt = JSON.parse(output.stdout);

  assert.match(String(output.error), /validation failed/);
  assert.equal(output.stderr, "");
  assert.equal(receipt.ok, false);
  assert.ok(
    receipt.errors.some((error: string) =>
      error.includes(
        "root:agent.owner-mismatch: work_contracts[0] references root:work.owner-mismatch owned by agent_id agent.other, not agent.owner-mismatch"
      )
    )
  );
});

test("validate reports missing Agent workflow subagent references", () => {
  const root = makeTempDir("mdkg-agent-missing-subagent-ref-");
  setupWorkspace(root);
  fs.cpSync(
    path.join(fixtureRoot(), "invalid", "missing-subagent-ref"),
    path.join(root, ".mdkg", "work", "bad"),
    { recursive: true }
  );

  const output = captureThrownOutput(() => runValidateCommand({ root, json: true }));
  const receipt = JSON.parse(output.stdout);

  assert.match(String(output.error), /validation failed/);
  assert.equal(output.stderr, "");
  assert.equal(receipt.ok, false);
  assert.ok(
    receipt.errors.some((error: string) =>
      error.includes(
        "root:agent.missing-subagent-ref: subagent_refs[0] references missing SPEC.md agent.missing"
      )
    )
  );
});

test("validate reports non-subagent SPEC references in subagent refs", () => {
  const root = makeTempDir("mdkg-agent-non-subagent-ref-");
  setupWorkspace(root);
  fs.cpSync(
    path.join(fixtureRoot(), "invalid", "non-subagent-ref"),
    path.join(root, ".mdkg", "work", "bad"),
    { recursive: true }
  );

  const output = captureThrownOutput(() => runValidateCommand({ root, json: true }));
  const receipt = JSON.parse(output.stdout);

  assert.match(String(output.error), /validation failed/);
  assert.equal(output.stderr, "");
  assert.equal(receipt.ok, false);
  assert.ok(
    receipt.errors.some((error: string) =>
      error.includes(
        "root:work.non-subagent-ref: subagent_refs[0] references root:agent.not-subagent with role orchestrator, not subagent"
      )
    )
  );
});

test("validate reports missing WORK_ORDER work references", () => {
  const root = makeTempDir("mdkg-agent-missing-work-order-work-");
  setupWorkspace(root);
  fs.cpSync(
    path.join(fixtureRoot(), "invalid", "missing-work-order-work"),
    path.join(root, ".mdkg", "work", "bad"),
    { recursive: true }
  );

  const output = captureThrownOutput(() => runValidateCommand({ root, json: true }));
  const receipt = JSON.parse(output.stdout);

  assert.match(String(output.error), /validation failed/);
  assert.equal(output.stderr, "");
  assert.equal(receipt.ok, false);
  assert.ok(
    receipt.errors.some((error: string) =>
      error.includes("root:order.missing-work: work_id references missing WORK.md work.missing")
    )
  );
});

test("validate rejects WORK contracts without capabilities or dependency refs", () => {
  const root = makeTempDir("mdkg-agent-empty-work-contract-");
  setupWorkspace(root);
  writeFile(
    path.join(root, ".mdkg", "work", "empty-work", "WORK.md"),
    [
      "---",
      "id: work.empty-contract",
      "type: work",
      "title: Empty Contract",
      "version: 0.1.0",
      "agent_id: agent.empty-contract",
      "kind: generic",
      "pricing_model: included",
      "required_capabilities: []",
      "skill_refs: []",
      "tool_refs: []",
      "model_refs: []",
      "wasm_component_refs: []",
      "runtime_image_refs: []",
      "subagent_refs: []",
      "inputs: [request:text:required]",
      "outputs: [result:text:required]",
      "receipt_required: true",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "refs: []",
      "aliases: []",
      "created: 2026-06-06",
      "updated: 2026-06-06",
      "---",
      "# Capability",
      "",
      "This fixture intentionally has no capability anchor.",
    ].join("\n")
  );

  const output = captureThrownOutput(() => runValidateCommand({ root, json: true }));
  const receipt = JSON.parse(output.stdout);

  assert.match(String(output.error), /validation failed/);
  assert.equal(output.stderr, "");
  assert.equal(receipt.ok, false);
  assert.ok(
    receipt.errors.some((error: string) =>
      error.includes(
        "WORK.md must include at least one required_capabilities entry or dependency ref"
      )
    )
  );
});

test("validate accepts WORK_ORDER trigger refs payload hashes and queue refs", () => {
  const root = makeTempDir("mdkg-agent-work-order-valid-trigger-");
  setupWorkspace(root);
  writeWorkOrderValidationFixture(root, {
    trigger_ref: "trigger://manual/work-order",
    queue_refs: "[queue://project-db/work-order/order.fixture]",
  });

  silenceErrors(() => runValidateCommand({ root, quiet: true }));

  const config = loadConfig(root);
  const index = buildIndex(root, config);
  assert.equal(
    index.nodes["root:order.fixture"].attributes.payload_hash,
    "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  );
  assert.deepEqual(index.nodes["root:order.fixture"].attributes.queue_refs, [
    "queue://project-db/work-order/order.fixture",
  ]);
});

test("validate rejects malformed WORK_ORDER payload hashes", () => {
  const root = makeTempDir("mdkg-agent-work-order-bad-payload-hash-");
  setupWorkspace(root);
  writeWorkOrderValidationFixture(root, { payload_hash: "sha256:not-a-hash" });

  const output = captureThrownOutput(() => runValidateCommand({ root, json: true }));
  const receipt = JSON.parse(output.stdout);

  assert.match(String(output.error), /validation failed/);
  assert.equal(output.stderr, "");
  assert.equal(receipt.ok, false);
  assert.ok(
    receipt.errors.some((error: string) =>
      error.includes("payload_hash must be sha256:<64 lowercase hex chars>")
    )
  );
});

test("validate rejects malformed WORK_ORDER queue refs", () => {
  const root = makeTempDir("mdkg-agent-work-order-bad-queue-ref-");
  setupWorkspace(root);
  writeWorkOrderValidationFixture(root, { queue_refs: "[not a queue ref]" });

  const output = captureThrownOutput(() => runValidateCommand({ root, json: true }));
  const receipt = JSON.parse(output.stdout);

  assert.match(String(output.error), /validation failed/);
  assert.equal(output.stderr, "");
  assert.equal(receipt.ok, false);
  assert.ok(
    receipt.errors.some((error: string) =>
      error.includes("queue_refs[0] must be a portable id or URI ref")
    )
  );
});

test("validate reports WORK_ORDER work version mismatches", () => {
  const root = makeTempDir("mdkg-agent-work-order-version-mismatch-");
  setupWorkspace(root);
  fs.cpSync(
    path.join(fixtureRoot(), "invalid", "work-order-version-mismatch"),
    path.join(root, ".mdkg", "work", "bad"),
    { recursive: true }
  );

  const output = captureThrownOutput(() => runValidateCommand({ root, json: true }));
  const receipt = JSON.parse(output.stdout);

  assert.match(String(output.error), /validation failed/);
  assert.equal(output.stderr, "");
  assert.equal(receipt.ok, false);
  assert.ok(
    receipt.errors.some((error: string) =>
      error.includes(
        "root:order.version-mismatch: work_version 2.0.0 does not match root:work.version-mismatch version 1.0.0"
      )
    )
  );
});

test("validate accepts RECEIPT evidence hashes and redaction policies", () => {
  const root = makeTempDir("mdkg-agent-receipt-evidence-valid-");
  setupWorkspace(root);
  writeReceiptValidationFixture(root, {
    redaction_policy: "redacted_summary",
    evidence_hashes: "[sha256:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd]",
  });

  silenceErrors(() => runValidateCommand({ root, quiet: true }));

  const config = loadConfig(root);
  const index = buildIndex(root, config);
  assert.equal(index.nodes["root:receipt.fixture"].attributes.redaction_policy, "redacted_summary");
  assert.deepEqual(index.nodes["root:receipt.fixture"].attributes.evidence_hashes, [
    "sha256:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
  ]);
});

test("validate rejects malformed RECEIPT evidence hashes", () => {
  const root = makeTempDir("mdkg-agent-receipt-bad-evidence-hash-");
  setupWorkspace(root);
  writeReceiptValidationFixture(root, { evidence_hashes: "[sha256:not-a-hash]" });

  const output = captureThrownOutput(() => runValidateCommand({ root, json: true }));
  const receipt = JSON.parse(output.stdout);

  assert.match(String(output.error), /validation failed/);
  assert.equal(output.stderr, "");
  assert.equal(receipt.ok, false);
  assert.ok(
    receipt.errors.some((error: string) =>
      error.includes("evidence_hashes[0] must be sha256:<64 lowercase hex chars>")
    )
  );
});

test("validate rejects unsupported RECEIPT redaction policies", () => {
  const root = makeTempDir("mdkg-agent-receipt-bad-redaction-policy-");
  setupWorkspace(root);
  writeReceiptValidationFixture(root, { redaction_policy: "raw_runtime_log" });

  const output = captureThrownOutput(() => runValidateCommand({ root, json: true }));
  const receipt = JSON.parse(output.stdout);

  assert.match(String(output.error), /validation failed/);
  assert.equal(output.stderr, "");
  assert.equal(receipt.ok, false);
  assert.ok(
    receipt.errors.some((error: string) =>
      error.includes("redaction_policy must be one of refs_and_hashes_only, redacted_summary, external_private")
    )
  );
});

test("validate reports missing RECEIPT work order references", () => {
  const root = makeTempDir("mdkg-agent-missing-receipt-work-order-");
  setupWorkspace(root);
  fs.cpSync(
    path.join(fixtureRoot(), "invalid", "missing-receipt-work-order"),
    path.join(root, ".mdkg", "work", "bad"),
    { recursive: true }
  );

  const output = captureThrownOutput(() => runValidateCommand({ root, json: true }));
  const receipt = JSON.parse(output.stdout);

  assert.match(String(output.error), /validation failed/);
  assert.equal(output.stderr, "");
  assert.equal(receipt.ok, false);
  assert.ok(
    receipt.errors.some((error: string) =>
      error.includes(
        "root:receipt.missing-order: work_order_id references missing WORK_ORDER.md order.missing"
      )
    )
  );
});

test("validate reports missing DISPUTE receipt references", () => {
  const root = makeTempDir("mdkg-agent-missing-dispute-receipt-");
  setupWorkspace(root);
  fs.cpSync(
    path.join(fixtureRoot(), "invalid", "missing-dispute-receipt"),
    path.join(root, ".mdkg", "work", "bad"),
    { recursive: true }
  );

  const output = captureThrownOutput(() => runValidateCommand({ root, json: true }));
  const receipt = JSON.parse(output.stdout);

  assert.match(String(output.error), /validation failed/);
  assert.equal(output.stderr, "");
  assert.equal(receipt.ok, false);
  assert.ok(
    receipt.errors.some((error: string) =>
      error.includes(
        "root:dispute.missing-receipt: receipt_id references missing RECEIPT.md receipt.missing"
      )
    )
  );
});

test("validate reports DISPUTE receipt work order mismatches", () => {
  const root = makeTempDir("mdkg-agent-dispute-receipt-order-mismatch-");
  setupWorkspace(root);
  fs.cpSync(
    path.join(fixtureRoot(), "invalid", "dispute-receipt-order-mismatch"),
    path.join(root, ".mdkg", "work", "bad"),
    { recursive: true }
  );

  const output = captureThrownOutput(() => runValidateCommand({ root, json: true }));
  const receipt = JSON.parse(output.stdout);

  assert.match(String(output.error), /validation failed/);
  assert.equal(output.stderr, "");
  assert.equal(receipt.ok, false);
  assert.ok(
    receipt.errors.some((error: string) =>
      error.includes(
        "root:dispute.order-mismatch: receipt_id receipt.order-a belongs to work_order_id order.a, not order.b"
      )
    )
  );
});

test("validate reports missing FEEDBACK target references", () => {
  const root = makeTempDir("mdkg-agent-missing-feedback-target-");
  setupWorkspace(root);
  fs.cpSync(
    path.join(fixtureRoot(), "invalid", "missing-feedback-target"),
    path.join(root, ".mdkg", "work", "bad"),
    { recursive: true }
  );

  const output = captureThrownOutput(() => runValidateCommand({ root, json: true }));
  const receipt = JSON.parse(output.stdout);

  assert.match(String(output.error), /validation failed/);
  assert.equal(output.stderr, "");
  assert.equal(receipt.ok, false);
  assert.ok(
    receipt.errors.some((error: string) =>
      error.includes(
        "root:feedback.missing-target: target_id references missing node work.missing"
      )
    )
  );
});

test("validate reports missing PROPOSAL target references", () => {
  const root = makeTempDir("mdkg-agent-missing-proposal-target-");
  setupWorkspace(root);
  fs.cpSync(
    path.join(fixtureRoot(), "invalid", "missing-proposal-target"),
    path.join(root, ".mdkg", "work", "bad"),
    { recursive: true }
  );

  const output = captureThrownOutput(() => runValidateCommand({ root, json: true }));
  const receipt = JSON.parse(output.stdout);

  assert.match(String(output.error), /validation failed/);
  assert.equal(output.stderr, "");
  assert.equal(receipt.ok, false);
  assert.ok(
    receipt.errors.some((error: string) =>
      error.includes(
        "root:proposal.missing-target: target_id references missing node work.missing"
      )
    )
  );
});

test("validate reports missing skill proposal target references", () => {
  const root = makeTempDir("mdkg-agent-missing-skill-proposal-target-");
  setupWorkspace(root);
  fs.cpSync(
    path.join(fixtureRoot(), "invalid", "missing-skill-proposal-target"),
    path.join(root, ".mdkg", "work", "bad"),
    { recursive: true }
  );

  const output = captureThrownOutput(() => runValidateCommand({ root, json: true }));
  const receipt = JSON.parse(output.stdout);

  assert.match(String(output.error), /validation failed/);
  assert.equal(output.stderr, "");
  assert.equal(receipt.ok, false);
  assert.ok(
    receipt.errors.some((error: string) =>
      error.includes(
        "root:proposal.missing-skill-target: target_id references missing skill skill.missing-review-loop"
      )
    )
  );
});

test("validate reports missing PROPOSAL evidence references", () => {
  const root = makeTempDir("mdkg-agent-missing-proposal-evidence-");
  setupWorkspace(root);
  fs.cpSync(
    path.join(fixtureRoot(), "invalid", "missing-proposal-evidence"),
    path.join(root, ".mdkg", "work", "bad"),
    { recursive: true }
  );

  const output = captureThrownOutput(() => runValidateCommand({ root, json: true }));
  const receipt = JSON.parse(output.stdout);

  assert.match(String(output.error), /validation failed/);
  assert.equal(output.stderr, "");
  assert.equal(receipt.ok, false);
  assert.ok(
    receipt.errors.some((error: string) =>
      error.includes(
        "root:proposal.missing-evidence: evidence_refs[0] references missing node feedback.missing"
      )
    )
  );
});

test("search, show, and pack expose Agent workflow file metadata through existing commands", () => {
  const root = makeTempDir("mdkg-agent-commands-");
  setupWorkspace(root);
  copyValidFixtures(root);

  const logs: string[] = [];
  const errors: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args: unknown[]) => {
    logs.push(args.map(String).join(" "));
  };
  console.error = (...args: unknown[]) => {
    errors.push(args.map(String).join(" "));
  };
  try {
    runSearchCommand({ root, query: "image_generation", type: "work", noCache: true });
    runShowCommand({ root, id: "work.generate-image", noCache: true });
    runSearchCommand({
      root,
      query: "image.agent-image-generator.1.0.0",
      type: "spec",
      noCache: true,
    });
    runShowCommand({ root, id: "agent.image-generator", noCache: true });
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }

  assert.ok(logs.some((line) => line.includes("root:work.generate-image")));
  assert.ok(logs.some((line) => line.includes("root:agent.image-generator")));
  assert.ok(logs.some((line) => line.includes("kind: image_generation")));
  assert.ok(logs.some((line) => line.includes("skill_refs: author-agent-manifest")));
  assert.ok(logs.some((line) => line.includes("wasm_component_refs: wasm.image-normalizer")));
  assert.ok(logs.some((line) => line.includes("runtime_image_refs: image.agent-image-generator.1.0.0")));
  assert.ok(logs.some((line) => line.includes("inputs: source_image:file:optional, prompt:text:required")));
  assert.ok(errors.some((line) => line.includes("count: 1")));

  const out = ".mdkg/pack/receipt.json";
  runPackCommand({
    root,
    id: "receipt.generate-image-1",
    depth: 3,
    edges: ["relates"],
    format: "json",
    out,
    noCache: true,
  });

  const payload = JSON.parse(fs.readFileSync(path.join(root, out), "utf8"));
  const qids = payload.nodes.map((node: { qid: string }) => node.qid);
  assert.ok(qids.includes("root:receipt.generate-image-1"));
  assert.ok(qids.includes("root:order.generate-image-1"));
  assert.ok(qids.includes("root:work.generate-image"));
  assert.ok(qids.includes("root:agent.image-generator"));
  const receipt = payload.nodes.find((node: { qid: string }) => node.qid === "root:receipt.generate-image-1");
  assert.equal(receipt.frontmatter.work_order_id, "order.generate-image-1");
  const spec = payload.nodes.find((node: { qid: string }) => node.qid === "root:agent.image-generator");
  assert.deepEqual(spec.frontmatter.skill_refs, ["author-agent-manifest"]);
  assert.deepEqual(spec.frontmatter.tool_refs, ["tool.mdkg.pack"]);
  assert.deepEqual(spec.frontmatter.model_refs, ["model.image-generate"]);
  assert.deepEqual(spec.frontmatter.wasm_component_refs, ["wasm.image-normalizer"]);
  assert.deepEqual(spec.frontmatter.runtime_image_refs, ["image.agent-image-generator.1.0.0"]);
  assert.deepEqual(spec.frontmatter.subagent_refs, ["agent.image-generator"]);
  const work = payload.nodes.find((node: { qid: string }) => node.qid === "root:work.generate-image");
  assert.deepEqual(work.frontmatter.skill_refs, ["author-agent-work-contract"]);
  assert.deepEqual(work.frontmatter.tool_refs, ["tool.artifact-uploader"]);
  assert.deepEqual(work.frontmatter.model_refs, ["model.image-generate"]);
  assert.deepEqual(work.frontmatter.wasm_component_refs, ["wasm.image-normalizer"]);
  assert.deepEqual(work.frontmatter.runtime_image_refs, ["image.agent-image-generator.1.0.0"]);
  assert.deepEqual(work.frontmatter.subagent_refs, ["agent.image-generator"]);
});

test("new command treats spec as a legacy alias for canonical manifest files", () => {
  const root = makeTempDir("mdkg-agent-new-spec-");
  setupWorkspace(root);

  const output = captureOutput(() =>
    runNewCommand({
      root,
      type: "spec",
      title: "Image Worker",
      json: true,
      now: new Date("2026-03-11T00:00:00Z"),
    })
  );

  assert.match(output.stderr, /mdkg new spec is legacy; use mdkg new manifest/);
  assert.deepEqual(JSON.parse(output.stdout), {
    action: "created",
    node: {
      workspace: "root",
      id: "manifest-1",
      qid: "root:manifest-1",
      path: ".mdkg/work/manifest-1-image-worker/MANIFEST.md",
      type: "manifest",
      title: "Image Worker",
    },
  });

  const manifestPath = path.join(root, ".mdkg", "work", "manifest-1-image-worker", "MANIFEST.md");
  const content = fs.readFileSync(manifestPath, "utf8");
  assert.match(content, /type: manifest/);
  assert.match(content, /spec_kind: capability/);
  assert.match(content, /role: tool_service/);
  assert.match(content, /runtime_mode: tool_service/);
  assert.match(content, /skill_refs: \[\]/);
  assert.match(content, /tool_refs: \[\]/);
  assert.match(content, /model_refs: \[\]/);
  assert.match(content, /wasm_component_refs: \[\]/);
  assert.match(content, /runtime_image_refs: \[\]/);
  assert.match(content, /subagent_refs: \[\]/);

  silenceErrors(() => runValidateCommand({ root, quiet: true }));
  const config = loadConfig(root);
  const index = buildIndex(root, config);
  assert.equal(index.nodes["root:manifest-1"].type, "manifest");
  assert.equal(index.nodes["root:manifest-1"].path, ".mdkg/work/manifest-1-image-worker/MANIFEST.md");
  assert.deepEqual(index.nodes["root:manifest-1"].attributes.skill_refs, []);
});

test("new command scaffolds canonical manifest files", () => {
  const root = makeTempDir("mdkg-agent-new-manifest-");
  setupWorkspace(root);

  const output = captureOutput(() =>
    runNewCommand({
      root,
      type: "manifest",
      title: "Manifest Worker",
      json: true,
      now: new Date("2026-03-11T00:00:00Z"),
    })
  );

  assert.equal(output.stderr, "");
  assert.deepEqual(JSON.parse(output.stdout), {
    action: "created",
    node: {
      workspace: "root",
      id: "manifest-1",
      qid: "root:manifest-1",
      path: ".mdkg/work/manifest-1-manifest-worker/MANIFEST.md",
      type: "manifest",
      title: "Manifest Worker",
    },
  });

  const manifestPath = path.join(root, ".mdkg", "work", "manifest-1-manifest-worker", "MANIFEST.md");
  const content = fs.readFileSync(manifestPath, "utf8");
  assert.match(content, /type: manifest/);
  assert.match(content, /spec_kind: capability/);
  assert.match(content, /role: tool_service/);

  silenceErrors(() => runValidateCommand({ root, quiet: true }));
  const config = loadConfig(root);
  const index = buildIndex(root, config);
  assert.equal(index.nodes["root:manifest-1"].type, "manifest");
  assert.equal(index.nodes["root:manifest-1"].path, ".mdkg/work/manifest-1-manifest-worker/MANIFEST.md");
});

test("new command uses bundled template fallback when a local agent template is missing", () => {
  const root = makeTempDir("mdkg-agent-new-bundled-template-");
  setupWorkspace(root);
  fs.rmSync(path.join(root, ".mdkg", "templates", "default", "manifest.md"));

  const output = captureOutput(() =>
    runNewCommand({
      root,
      type: "spec",
      title: "Fallback Worker",
      json: true,
      now: new Date("2026-03-11T00:00:00Z"),
    })
  );

  assert.match(output.stderr, /using bundled template fallback for manifest/);
  assert.match(output.stderr, /mdkg new spec is legacy; use mdkg new manifest/);
  const payload = JSON.parse(output.stdout);
  assert.equal(payload.node.id, "manifest-1");
  assert.equal(payload.node.path, ".mdkg/work/manifest-1-fallback-worker/MANIFEST.md");

  const manifestPath = path.join(root, ".mdkg", "work", "manifest-1-fallback-worker", "MANIFEST.md");
  const content = fs.readFileSync(manifestPath, "utf8");
  assert.match(content, /type: manifest/);
  assert.match(content, /spec_kind: capability/);
  assert.match(content, /role: tool_service/);

  const warnings: string[] = [];
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    warnings.push(args.map(String).join(" "));
  };
  try {
    runValidateCommand({ root });
  } finally {
    console.error = originalError;
  }
  assert.ok(warnings.some((line) => line.includes("bundled template schema fallback")));
});

test("new command does not silently fallback for an explicit missing template set", () => {
  const root = makeTempDir("mdkg-agent-new-missing-custom-template-");
  setupWorkspace(root);

  const output = captureThrownOutput(() =>
    runNewCommand({
      root,
      type: "spec",
      title: "Custom Template Worker",
      template: "custom",
      json: true,
      now: new Date("2026-03-11T00:00:00Z"),
    })
  );

  assert.equal(output.stdout, "");
  assert.equal(output.stderr, "");
  assert.match(String(output.error), /template not found: custom\/manifest\.md/);
  assert.equal(
    fs.existsSync(path.join(root, ".mdkg", "work", "manifest-1-custom-template-worker", "MANIFEST.md")),
    false
  );
});

test("new command accepts explicit portable ids for agent workflow files", () => {
  const root = makeTempDir("mdkg-agent-new-explicit-id-");
  setupWorkspace(root);

  const output = captureOutput(() =>
    runNewCommand({
      root,
      type: "spec",
      title: "Room Trio Image Worker",
      id: "agent.room-trio-image-worker",
      json: true,
      now: new Date("2026-03-11T00:00:00Z"),
    })
  );

  assert.match(output.stderr, /mdkg new spec is legacy; use mdkg new manifest/);
  assert.deepEqual(JSON.parse(output.stdout), {
    action: "created",
    node: {
      workspace: "root",
      id: "agent.room-trio-image-worker",
      qid: "root:agent.room-trio-image-worker",
      path: ".mdkg/work/agent.room-trio-image-worker-room-trio-image-worker/MANIFEST.md",
      type: "manifest",
      title: "Room Trio Image Worker",
    },
  });

  silenceErrors(() => runValidateCommand({ root, quiet: true }));
  const config = loadConfig(root);
  const index = buildIndex(root, config);
  assert.equal(index.nodes["root:agent.room-trio-image-worker"].type, "manifest");
});

test("new command scaffolds agent workflow work files with dependency refs", () => {
  const root = makeTempDir("mdkg-agent-new-work-");
  setupWorkspace(root);

  const output = captureOutput(() =>
    runNewCommand({
      root,
      type: "work",
      title: "Image Generation",
      json: true,
      now: new Date("2026-03-11T00:00:00Z"),
    })
  );

  assert.equal(output.stderr, "");
  assert.deepEqual(JSON.parse(output.stdout), {
    action: "created",
    node: {
      workspace: "root",
      id: "work-1",
      qid: "root:work-1",
      path: ".mdkg/work/work-1-image-generation/WORK.md",
      type: "work",
      title: "Image Generation",
    },
  });

  const workPath = path.join(root, ".mdkg", "work", "work-1-image-generation", "WORK.md");
  const content = fs.readFileSync(workPath, "utf8");
  assert.match(content, /type: work/);
  assert.match(content, /required_capabilities: \[capability\.example\]/);
  assert.match(content, /skill_refs: \[\]/);
  assert.match(content, /tool_refs: \[\]/);
  assert.match(content, /model_refs: \[\]/);
  assert.match(content, /wasm_component_refs: \[\]/);
  assert.match(content, /runtime_image_refs: \[\]/);
  assert.match(content, /subagent_refs: \[\]/);

  silenceErrors(() => runValidateCommand({ root, quiet: true }));
  const config = loadConfig(root);
  const index = buildIndex(root, config);
  assert.equal(index.nodes["root:work-1"].type, "work");
  assert.equal(index.nodes["root:work-1"].path, ".mdkg/work/work-1-image-generation/WORK.md");
  assert.deepEqual(index.nodes["root:work-1"].attributes.skill_refs, []);
});

test("new command scaffolds contract profile metadata for workflow file types", () => {
  const root = makeTempDir("mdkg-agent-new-contract-profile-");
  setupWorkspace(root);

  runNewCommand({
    root,
    type: "manifest",
    title: "Profile Worker",
    id: "agent.profile-worker",
    contractProfile: "omni-room",
    validationPolicyRef: "policy.validation",
    evidencePolicyRef: "policy.evidence",
    now: new Date("2026-03-11T00:00:00Z"),
  });
  runNewCommand({
    root,
    type: "work",
    title: "Profile Work",
    id: "work.example",
    contractProfile: "omni-room",
    now: new Date("2026-03-11T00:00:00Z"),
  });
  runNewCommand({
    root,
    type: "work_order",
    title: "Profile Order",
    id: "order.example",
    contractProfile: "omni-room",
    validationPolicyRef: "policy.validation",
    evidencePolicyRef: "policy.evidence",
    now: new Date("2026-03-11T00:00:00Z"),
  });
  runNewCommand({
    root,
    type: "receipt",
    title: "Profile Receipt",
    id: "receipt.example",
    contractProfile: "omni-room",
    receiptKind: "final",
    redactionClass: "public",
    validationPolicyRef: "policy.validation",
    evidencePolicyRef: "policy.evidence",
    now: new Date("2026-03-11T00:00:00Z"),
  });

  silenceErrors(() => runValidateCommand({ root, quiet: true, profile: "omni-room" }));

  const config = loadConfig(root);
  const index = buildIndex(root, config);
  assert.equal(index.nodes["root:agent.profile-worker"].attributes.contract_profile, "omni-room");
  assert.equal(index.nodes["root:agent.profile-worker"].attributes.validation_policy_ref, "policy.validation");
  assert.equal(index.nodes["root:agent.profile-worker"].attributes.evidence_policy_ref, "policy.evidence");
  assert.equal(index.nodes["root:work.example"].attributes.contract_profile, "omni-room");
  assert.equal(index.nodes["root:order.example"].attributes.contract_profile, "omni-room");
  assert.equal(index.nodes["root:order.example"].attributes.validation_policy_ref, "policy.validation");
  assert.equal(index.nodes["root:order.example"].attributes.evidence_policy_ref, "policy.evidence");
  assert.equal(index.nodes["root:receipt.example"].attributes.contract_profile, "omni-room");
  assert.equal(index.nodes["root:receipt.example"].attributes.receipt_kind, "final");
  assert.equal(index.nodes["root:receipt.example"].attributes.redaction_class, "public");
  assert.equal(index.nodes["root:receipt.example"].attributes.validation_policy_ref, "policy.validation");
  assert.equal(index.nodes["root:receipt.example"].attributes.evidence_policy_ref, "policy.evidence");
});

test("work helper new commands scaffold contract profile metadata", () => {
  const root = makeTempDir("mdkg-agent-work-helper-contract-profile-");
  setupWorkspace(root);
  writeManifestWithKind(root, "agent", "agent.helper-worker");

  captureOutput(() =>
    runWorkContractNewCommand({
      root,
      title: "Helper Work",
      id: "work.helper",
      agentId: "agent.helper-worker",
      kind: "helper",
      inputs: "request:text:required",
      outputs: "result:text:required",
      contractProfile: "omni-room",
      json: true,
    })
  );
  captureOutput(() =>
    runWorkOrderNewCommand({
      root,
      title: "Helper Order",
      id: "order.helper",
      workId: "work.helper",
      requester: "user.example",
      contractProfile: "omni-room",
      validationPolicyRef: "policy.validation",
      evidencePolicyRef: "policy.evidence",
      json: true,
    })
  );
  captureOutput(() =>
    runWorkReceiptNewCommand({
      root,
      title: "Helper Receipt",
      id: "receipt.helper",
      workOrderId: "order.helper",
      outcome: "success",
      contractProfile: "omni-room",
      receiptKind: "worker",
      redactionClass: "internal",
      validationPolicyRef: "policy.validation",
      evidencePolicyRef: "policy.evidence",
      json: true,
    })
  );

  silenceErrors(() => runValidateCommand({ root, quiet: true, profile: "omni-room" }));

  const config = loadConfig(root);
  const index = buildIndex(root, config);
  assert.equal(index.nodes["root:work.helper"].attributes.contract_profile, "omni-room");
  assert.equal(index.nodes["root:order.helper"].attributes.contract_profile, "omni-room");
  assert.equal(index.nodes["root:order.helper"].attributes.validation_policy_ref, "policy.validation");
  assert.equal(index.nodes["root:order.helper"].attributes.evidence_policy_ref, "policy.evidence");
  assert.equal(index.nodes["root:receipt.helper"].attributes.contract_profile, "omni-room");
  assert.equal(index.nodes["root:receipt.helper"].attributes.receipt_kind, "worker");
  assert.equal(index.nodes["root:receipt.helper"].attributes.redaction_class, "internal");
  assert.equal(index.nodes["root:receipt.helper"].attributes.validation_policy_ref, "policy.validation");
  assert.equal(index.nodes["root:receipt.helper"].attributes.evidence_policy_ref, "policy.evidence");
});
