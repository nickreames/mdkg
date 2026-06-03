import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";
import fs from "fs";
import path from "path";
const { runInitCommand } = require("../../commands/init");
const { runDoctorCommand } = require("../../commands/doctor");
const { runUpgradeCommand } = require("../../commands/upgrade");
const { runValidateCommand } = require("../../commands/validate");
import { makeTempDir, writeFile } from "../helpers/fs";

const BASE_CONFIG = {
  schema_version: 1,
  tool: "mdkg",
  root_required: true,
  index: {
    auto_reindex: true,
    tolerant: false,
    global_index_path: ".mdkg/index/global.json",
  },
  capabilities: {
    cache_path: ".mdkg/index/capabilities.json",
  },
  bundles: {
    output_dir: ".mdkg/bundles",
    default_profile: "private",
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
    root: { path: ".", enabled: true, mdkg_dir: ".mdkg", visibility: "private" },
  },
};

function setupSeed(seed: string, includeAgentDocs = true): void {
  writeFile(path.join(seed, "config.json"), JSON.stringify(BASE_CONFIG, null, 2));
  writeFile(path.join(seed, "core", "core.md"), "# core\n\nrule-soul\nrule-human\nrule-1\nrule-2\n");
  writeFile(path.join(seed, "templates", "default", "task.md"), "---\nid: {{id}}\n---\n");
  writeFile(path.join(seed, "README.md"), "# mdkg\n");
  writeFile(path.join(seed, "AGENT_START.md"), "# AGENT_START\n");
  writeFile(path.join(seed, "CLI_COMMAND_MATRIX.md"), "# CLI Command Matrix\n");
  writeFile(path.join(seed, "llms.txt"), "Read `AGENT_START.md` first.\n");
  if (includeAgentDocs) {
    writeFile(path.join(seed, "AGENTS.md"), "# Agents\nRead `AGENT_START.md` first.\n");
    writeFile(path.join(seed, "CLAUDE.md"), "# Claude\nRead `AGENT_START.md` first.\n");
  }
  for (const slug of [
    "select-work-and-ground-context",
    "build-pack-and-execute-task",
    "verify-close-and-checkpoint",
  ]) {
    writeFile(
      path.join(seed, "skills", "default", slug, "SKILL.md"),
      [
        "---",
        `name: ${slug}`,
        `description: use ${slug} when bootstrap scaffolding is created`,
        "---",
        "",
        "# Goal",
        "",
        "Seeded test skill.",
      ].join("\n")
    );
  }
}

function captureConsole<T>(fn: () => T): T {
  const originalLog = console.log;
  const originalError = console.error;
  try {
    console.log = (() => undefined) as typeof console.log;
    console.error = (() => undefined) as typeof console.error;
    return fn();
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
}

function sha256(filePath: string): string {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function assertManifestPathsExistAndMatch(root: string): Array<{ path: string; category: string; sha256: string }> {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, ".mdkg", "init-manifest.json"), "utf8")) as {
    files: Array<{ path: string; category: string; sha256: string }>;
  };
  for (const file of manifest.files) {
    const absolute = path.join(root, file.path);
    assert.ok(fs.existsSync(absolute), `manifest path should exist: ${file.path}`);
    assert.equal(sha256(absolute), file.sha256, `manifest hash should match: ${file.path}`);
  }
  return manifest.files;
}

test("runInitCommand copies seed assets, creates directories, and updates ignores by default", () => {
  const root = makeTempDir("mdkg-init-root-");
  const seed = makeTempDir("mdkg-init-seed-");
  setupSeed(seed);

  runInitCommand({ root, seedRoot: seed });

  assert.ok(fs.existsSync(path.join(root, ".mdkg", "config.json")));
  assert.ok(fs.existsSync(path.join(root, ".mdkg", "README.md")));
  assert.ok(fs.existsSync(path.join(root, ".mdkg", "core", "core.md")));
  assert.ok(fs.existsSync(path.join(root, ".mdkg", "templates", "default", "task.md")));
  assert.ok(fs.existsSync(path.join(root, ".mdkg", "init-manifest.json")));
  assert.ok(fs.existsSync(path.join(root, ".mdkg", "work")));
  assert.ok(fs.existsSync(path.join(root, ".mdkg", "design")));

  const manifest = JSON.parse(fs.readFileSync(path.join(root, ".mdkg", "init-manifest.json"), "utf8"));
  assert.equal(manifest.schema_version, 1);
  assert.equal(manifest.tool, "mdkg");
  assert.ok(manifest.files.some((file: { path: string }) => file.path === ".mdkg/config.json"));
  assert.ok(manifest.files.some((file: { path: string }) => file.path === ".mdkg/templates/default/task.md"));
  assert.equal(manifest.files.some((file: { category: string }) => file.category === "agent_doc"), false);
  assert.equal(manifest.files.some((file: { category: string }) => file.category === "startup_doc"), false);
  assert.equal(manifest.files.some((file: { category: string }) => file.category === "default_skill"), false);
  assert.equal(fs.existsSync(path.join(root, "AGENT_START.md")), false);
  assert.equal(fs.existsSync(path.join(root, "AGENTS.md")), false);
  assert.equal(fs.existsSync(path.join(root, "CLAUDE.md")), false);
  assertManifestPathsExistAndMatch(root);

  const gitignore = fs.readFileSync(path.join(root, ".gitignore"), "utf8");
  assert.match(gitignore, /\.mdkg\/index\//);
  assert.match(gitignore, /\.mdkg\/db\/runtime\//);
  assert.match(gitignore, /\.mdkg\/db\/\*\*\/\*\.sqlite-wal/);
  assert.match(gitignore, /\.mdkg\/db\/\*\*\/\*\.sqlite-shm/);
  assert.match(gitignore, /\.mdkg\/db\/\*\*\/\*\.sqlite-journal/);
  assert.match(gitignore, /\.mdkg\/db\/\*\*\/\*\.lock/);
  assert.match(gitignore, /\.mdkg\/db\/\*\*\/\*\.tmp/);
  assert.match(gitignore, /\.mdkg\/pack\//);
  assert.match(gitignore, /\.mdkg\/archive\/\*\*\/source\//);
  const npmignore = fs.readFileSync(path.join(root, ".npmignore"), "utf8");
  assert.match(npmignore, /\.mdkg\//);
  assert.match(npmignore, /\.mdkg\/index\//);
  assert.match(npmignore, /\.mdkg\/pack\//);
});

test("runInitCommand agent mode creates complete startup and wrapper docs", () => {
  const root = makeTempDir("mdkg-init-agent-");
  const seed = makeTempDir("mdkg-init-agent-seed-");
  setupSeed(seed);

  runInitCommand({ root, seedRoot: seed, agent: true });

  assert.ok(fs.existsSync(path.join(root, "AGENTS.md")));
  assert.ok(fs.existsSync(path.join(root, "CLAUDE.md")));
  assert.ok(fs.existsSync(path.join(root, "llms.txt")));
  assert.ok(fs.existsSync(path.join(root, "AGENT_START.md")));
  assert.ok(fs.existsSync(path.join(root, "CLI_COMMAND_MATRIX.md")));
  const manifestFiles = assertManifestPathsExistAndMatch(root);
  assert.ok(manifestFiles.some((file) => file.path === "AGENTS.md" && file.category === "agent_doc"));
  assert.ok(manifestFiles.some((file) => file.path === "CLAUDE.md" && file.category === "agent_doc"));
  assert.ok(manifestFiles.some((file) => file.path === "AGENT_START.md" && file.category === "startup_doc"));
  assert.ok(
    manifestFiles.some(
      (file) => file.path === ".mdkg/skills/select-work-and-ground-context/SKILL.md" && file.category === "default_skill"
    )
  );
});

test("runInitCommand supports global ignore opt-out", () => {
  const root = makeTempDir("mdkg-init-no-ignores-");
  const seed = makeTempDir("mdkg-init-no-ignores-seed-");
  setupSeed(seed, false);

  runInitCommand({ root, seedRoot: seed, noUpdateIgnores: true });

  assert.equal(fs.existsSync(path.join(root, ".gitignore")), false);
  assert.equal(fs.existsSync(path.join(root, ".npmignore")), false);
});

test("runInitCommand explicit ignore flags override global opt-out", () => {
  const root = makeTempDir("mdkg-init-explicit-ignores-");
  const seed = makeTempDir("mdkg-init-explicit-ignores-seed-");
  setupSeed(seed, false);

  runInitCommand({
    root,
    seedRoot: seed,
    noUpdateIgnores: true,
    updateGitignore: true,
    updateDockerignore: true,
  });

  assert.ok(fs.existsSync(path.join(root, ".gitignore")));
  assert.equal(fs.existsSync(path.join(root, ".npmignore")), false);
  assert.ok(fs.existsSync(path.join(root, ".dockerignore")));
});

test("runInitCommand agent mode scaffolds soul/human/skills/events/mirrors and core pin order", () => {
  const root = makeTempDir("mdkg-init-agent-bootstrap-");
  runInitCommand({ root, agent: true });

  const soulPath = path.join(root, ".mdkg", "core", "SOUL.md");
  const humanPath = path.join(root, ".mdkg", "core", "HUMAN.md");
  const registryPath = path.join(root, ".mdkg", "skills", "registry.md");
  const planSkillPath = path.join(root, ".mdkg", "skills", "select-work-and-ground-context", "SKILL.md");
  const executeSkillPath = path.join(root, ".mdkg", "skills", "build-pack-and-execute-task", "SKILL.md");
  const reviewSkillPath = path.join(root, ".mdkg", "skills", "verify-close-and-checkpoint", "SKILL.md");
  const eventsPath = path.join(root, ".mdkg", "work", "events", "events.jsonl");
  const coreListPath = path.join(root, ".mdkg", "core", "core.md");
  const agentsSkillsPath = path.join(root, ".agents", "skills");
  const claudeSkillsPath = path.join(root, ".claude", "skills");
  const agentsDocPath = path.join(root, "AGENTS.md");
  const claudeDocPath = path.join(root, "CLAUDE.md");
  const agentStartPath = path.join(root, "AGENT_START.md");
  const cliMatrixPath = path.join(root, "CLI_COMMAND_MATRIX.md");
  const llmsPath = path.join(root, "llms.txt");

  assert.ok(fs.existsSync(soulPath));
  assert.ok(fs.existsSync(humanPath));
  assert.ok(fs.existsSync(registryPath));
  assert.ok(fs.existsSync(planSkillPath));
  assert.ok(fs.existsSync(executeSkillPath));
  assert.ok(fs.existsSync(reviewSkillPath));
  assert.ok(fs.existsSync(eventsPath));
  assert.ok(fs.existsSync(agentsSkillsPath));
  assert.ok(fs.existsSync(claudeSkillsPath));
  assert.ok(fs.existsSync(agentsDocPath));
  assert.ok(fs.existsSync(claudeDocPath));
  assert.ok(fs.existsSync(agentStartPath));
  assert.ok(fs.existsSync(cliMatrixPath));
  assert.ok(fs.existsSync(llmsPath));

  const soul = fs.readFileSync(soulPath, "utf8");
  assert.match(soul, /id: rule-soul/);
  assert.match(soul, /type: rule/);

  const human = fs.readFileSync(humanPath, "utf8");
  assert.match(human, /id: rule-human/);
  assert.match(human, /type: rule/);

  const eventsLine = fs.readFileSync(eventsPath, "utf8").split(/\r?\n/).find((line) => line.trim().length > 0);
  assert.ok(eventsLine);
  const parsed = JSON.parse(eventsLine ?? "{}") as Record<string, unknown>;
  assert.equal(parsed.workspace, "root");
  assert.equal(parsed.agent, "mdkg");
  assert.equal(parsed.kind, "RUN_STARTED");
  assert.equal(parsed.status, "ok");
  assert.ok(Array.isArray(parsed.refs));
  assert.ok(Array.isArray(parsed.artifacts));
  assert.equal(typeof parsed.notes, "string");
  assert.match(String(parsed.notes), /init agent scaffold target initialized/);

  const registry = fs.readFileSync(registryPath, "utf8");
  assert.match(registry, /select-work-and-ground-context/);
  assert.match(registry, /build-pack-and-execute-task/);
  assert.match(registry, /verify-close-and-checkpoint/);

  const executeSkill = fs.readFileSync(executeSkillPath, "utf8");
  assert.match(executeSkill, /mdkg archive compress --all/);
  assert.match(executeSkill, /mdkg bundle create --profile private/);

  const reviewSkill = fs.readFileSync(reviewSkillPath, "utf8");
  assert.match(reviewSkill, /Bundle-Aware Commit Gate/);
  assert.match(reviewSkill, /mdkg archive compress --all/);
  assert.match(reviewSkill, /mdkg archive verify --json/);
  assert.match(reviewSkill, /mdkg bundle create --profile private/);

  const gitignore = fs.readFileSync(path.join(root, ".gitignore"), "utf8");
  assert.match(gitignore, /\.mdkg\/archive\/\*\*\/source\//);
  assert.match(gitignore, /\.mdkg\/db\/runtime\//);
  assert.doesNotMatch(gitignore, /\.mdkg\/work\/events\/\*\.jsonl/);

  const agentStart = fs.readFileSync(agentStartPath, "utf8");
  assert.match(agentStart, /\.mdkg\/core\/SOUL\.md/);
  assert.match(agentStart, /\.mdkg\/core\/HUMAN\.md/);
  assert.match(agentStart, /select-work-and-ground-context/);
  assert.match(agentStart, /markdown edits for narrative\/body updates/);

  const cliMatrix = fs.readFileSync(cliMatrixPath, "utf8");
  assert.match(cliMatrix, /mdkg new spec "<title>" \[options\] \[--json\]/);
  assert.match(cliMatrix, /mdkg validate \[--out <path>\] \[--quiet\] \[--json\]/);
  assert.match(cliMatrix, /mdkg skill validate \[<slug>\] \[--json\]/);

  const llms = fs.readFileSync(llmsPath, "utf8");
  assert.match(llms, /AGENT_START\.md/);

  for (const docsPath of [agentStartPath, agentsDocPath, claudeDocPath, cliMatrixPath, path.join(root, ".mdkg", "README.md")]) {
    const content = fs.readFileSync(docsPath, "utf8");
    assert.doesNotMatch(content, /mdkg init --llm/);
    assert.doesNotMatch(content, /--llm --agent/);
  }

  const coreLines = fs
    .readFileSync(coreListPath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
  assert.deepEqual(coreLines.slice(0, 2), ["rule-soul", "rule-human"]);
  assert.equal(coreLines.filter((value) => value === "rule-soul").length, 1);
  assert.equal(coreLines.filter((value) => value === "rule-human").length, 1);

  assert.ok(fs.existsSync(path.join(root, ".agents", "skills", "select-work-and-ground-context", "SKILL.md")));
  assert.ok(fs.existsSync(path.join(root, ".agents", "skills", "build-pack-and-execute-task", "SKILL.md")));
  assert.ok(fs.existsSync(path.join(root, ".agents", "skills", "verify-close-and-checkpoint", "SKILL.md")));
  assert.ok(fs.existsSync(path.join(root, ".claude", "skills", "select-work-and-ground-context", "SKILL.md")));
  assert.ok(fs.existsSync(path.join(root, ".claude", "skills", "build-pack-and-execute-task", "SKILL.md")));
  assert.ok(fs.existsSync(path.join(root, ".claude", "skills", "verify-close-and-checkpoint", "SKILL.md")));
  assert.match(
    fs.readFileSync(path.join(root, ".agents", "skills", "verify-close-and-checkpoint", "SKILL.md"), "utf8"),
    /mdkg archive compress --all/
  );
  assert.match(
    fs.readFileSync(path.join(root, ".claude", "skills", "verify-close-and-checkpoint", "SKILL.md"), "utf8"),
    /mdkg bundle create --profile private/
  );

  const config = JSON.parse(fs.readFileSync(path.join(root, ".mdkg", "config.json"), "utf8"));
  assert.deepEqual(Object.keys(config.workspaces), ["root"]);
  assert.equal(config.capabilities.cache_path, ".mdkg/index/capabilities.json");
  assert.equal(config.bundles.output_dir, ".mdkg/bundles");
  assert.equal(config.bundles.default_profile, "private");
  assert.equal(config.workspaces.root.visibility, "private");
  assertManifestPathsExistAndMatch(root);
  captureConsole(() => runDoctorCommand({ root }));
  captureConsole(() => runValidateCommand({ root }));
  const upgradeReceipt = captureConsole(() => runUpgradeCommand({ root, json: true })) as { changes: unknown[] };
  assert.deepEqual(upgradeReceipt.changes, []);
  captureConsole(() => runInitCommand({ root, agent: true }));
  const secondUpgradeReceipt = captureConsole(() => runUpgradeCommand({ root, json: true })) as { changes: unknown[] };
  assert.deepEqual(secondUpgradeReceipt.changes, []);
});

test("runInitCommand base init passes doctor and validate without agent bootstrap", () => {
  const root = makeTempDir("mdkg-init-base-health-");
  runInitCommand({ root });

  assert.equal(fs.existsSync(path.join(root, "AGENT_START.md")), false);
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "skills")), false);
  assertManifestPathsExistAndMatch(root);
  captureConsole(() => runDoctorCommand({ root }));
  captureConsole(() => runValidateCommand({ root }));
  const upgradeReceipt = captureConsole(() => runUpgradeCommand({ root, json: true })) as { changes: unknown[] };
  assert.deepEqual(upgradeReceipt.changes, []);
});

test("runInitCommand mirror collision preflight fails before seed writes", () => {
  const root = makeTempDir("mdkg-init-mirror-collision-");
  writeFile(
    path.join(root, ".agents", "skills", "select-work-and-ground-context", "SKILL.md"),
    "# unmanaged local skill\n"
  );

  assert.throws(
    () => runInitCommand({ root, agent: true }),
    /already exists and is not mdkg-managed/
  );
  assert.equal(fs.existsSync(path.join(root, ".mdkg")), false);
  assert.equal(fs.existsSync(path.join(root, "AGENT_START.md")), false);
});

test("runInitCommand preflights mirror collisions for existing canonical skills", () => {
  const root = makeTempDir("mdkg-init-existing-skill-collision-");
  writeFile(
    path.join(root, ".mdkg", "skills", "custom-review", "SKILL.md"),
    "---\nname: custom-review\ndescription: custom review workflow\n---\n\n# Custom\n"
  );
  writeFile(
    path.join(root, ".agents", "skills", "custom-review", "SKILL.md"),
    "# unmanaged mirror\n"
  );

  assert.throws(
    () => runInitCommand({ root, agent: true }),
    /already exists and is not mdkg-managed/
  );
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "config.json")), false);
  assert.equal(fs.existsSync(path.join(root, "AGENT_START.md")), false);
});

test("published init seed config remains root-only", () => {
  const assetConfig = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), "assets", "init", "config.json"), "utf8")
  );
  assert.deepEqual(Object.keys(assetConfig.workspaces), ["root"]);
  assert.equal(assetConfig.capabilities.cache_path, ".mdkg/index/capabilities.json");
  assert.equal(assetConfig.bundles.output_dir, ".mdkg/bundles");
  assert.equal(assetConfig.bundles.default_profile, "private");
  assert.equal(assetConfig.workspaces.root.visibility, "private");
});
