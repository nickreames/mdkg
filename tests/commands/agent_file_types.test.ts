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

function copyValidFixtures(root: string): void {
  fs.cpSync(
    path.join(fixtureRoot(), "valid"),
    path.join(root, ".mdkg", "work", "agent"),
    { recursive: true }
  );
  writeSkill(root, "review-loop");
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
  assert.equal(index.nodes["root:agent.image-generator"].type, "spec");
  assert.deepEqual(index.nodes["root:agent.image-generator"].attributes.skill_refs, [
    "author-agent-spec",
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
  assert.ok(logs.some((line) => line.includes("skill_refs: author-agent-spec")));
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
  assert.deepEqual(spec.frontmatter.skill_refs, ["author-agent-spec"]);
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

test("new command scaffolds agent workflow spec files with canonical filenames", () => {
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

  assert.equal(output.stderr, "");
  assert.deepEqual(JSON.parse(output.stdout), {
    action: "created",
    node: {
      workspace: "root",
      id: "spec-1",
      qid: "root:spec-1",
      path: ".mdkg/work/spec-1-image-worker/SPEC.md",
      type: "spec",
      title: "Image Worker",
    },
  });

  const specPath = path.join(root, ".mdkg", "work", "spec-1-image-worker", "SPEC.md");
  const content = fs.readFileSync(specPath, "utf8");
  assert.match(content, /type: spec/);
  assert.match(content, /role: subagent/);
  assert.match(content, /skill_refs: \[\]/);
  assert.match(content, /tool_refs: \[\]/);
  assert.match(content, /model_refs: \[\]/);
  assert.match(content, /wasm_component_refs: \[\]/);
  assert.match(content, /runtime_image_refs: \[\]/);
  assert.match(content, /subagent_refs: \[\]/);

  silenceErrors(() => runValidateCommand({ root, quiet: true }));
  const config = loadConfig(root);
  const index = buildIndex(root, config);
  assert.equal(index.nodes["root:spec-1"].type, "spec");
  assert.equal(index.nodes["root:spec-1"].path, ".mdkg/work/spec-1-image-worker/SPEC.md");
  assert.deepEqual(index.nodes["root:spec-1"].attributes.skill_refs, []);
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

  assert.equal(output.stderr, "");
  assert.deepEqual(JSON.parse(output.stdout), {
    action: "created",
    node: {
      workspace: "root",
      id: "agent.room-trio-image-worker",
      qid: "root:agent.room-trio-image-worker",
      path: ".mdkg/work/agent.room-trio-image-worker-room-trio-image-worker/SPEC.md",
      type: "spec",
      title: "Room Trio Image Worker",
    },
  });

  silenceErrors(() => runValidateCommand({ root, quiet: true }));
  const config = loadConfig(root);
  const index = buildIndex(root, config);
  assert.equal(index.nodes["root:agent.room-trio-image-worker"].type, "spec");
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
