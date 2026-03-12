import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const { runInitCommand } = require("../../commands/init");
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

function setupSeed(seed: string, includeAgentDocs = true): void {
  writeFile(path.join(seed, "config.json"), JSON.stringify(BASE_CONFIG, null, 2));
  writeFile(path.join(seed, "core", "core.md"), "# core\n\nrule-1\nrule-2\n");
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

test("runInitCommand copies seed assets, creates directories, and updates ignores by default", () => {
  const root = makeTempDir("mdkg-init-root-");
  const seed = makeTempDir("mdkg-init-seed-");
  setupSeed(seed);

  runInitCommand({ root, seedRoot: seed });

  assert.ok(fs.existsSync(path.join(root, ".mdkg", "config.json")));
  assert.ok(fs.existsSync(path.join(root, ".mdkg", "README.md")));
  assert.ok(fs.existsSync(path.join(root, ".mdkg", "core", "core.md")));
  assert.ok(fs.existsSync(path.join(root, ".mdkg", "templates", "default", "task.md")));
  assert.ok(fs.existsSync(path.join(root, ".mdkg", "work")));
  assert.ok(fs.existsSync(path.join(root, ".mdkg", "design")));

  const gitignore = fs.readFileSync(path.join(root, ".gitignore"), "utf8");
  assert.match(gitignore, /\.mdkg\/index\//);
  assert.match(gitignore, /\.mdkg\/pack\//);
  const npmignore = fs.readFileSync(path.join(root, ".npmignore"), "utf8");
  assert.match(npmignore, /\.mdkg\//);
  assert.match(npmignore, /\.mdkg\/index\//);
  assert.match(npmignore, /\.mdkg\/pack\//);
});

test("runInitCommand creates startup docs when requested", () => {
  const root = makeTempDir("mdkg-init-agent-");
  const seed = makeTempDir("mdkg-init-agent-seed-");
  setupSeed(seed);

  runInitCommand({ root, seedRoot: seed, createLlm: true });

  assert.ok(fs.existsSync(path.join(root, "AGENTS.md")));
  assert.ok(fs.existsSync(path.join(root, "CLAUDE.md")));
  assert.ok(fs.existsSync(path.join(root, "llms.txt")));
  assert.ok(fs.existsSync(path.join(root, "AGENT_START.md")));
  assert.ok(fs.existsSync(path.join(root, "CLI_COMMAND_MATRIX.md")));
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

  const gitignore = fs.readFileSync(path.join(root, ".gitignore"), "utf8");
  assert.doesNotMatch(gitignore, /\.mdkg\/work\/events\/\*\.jsonl/);

  const agentStart = fs.readFileSync(agentStartPath, "utf8");
  assert.match(agentStart, /\.mdkg\/core\/SOUL\.md/);
  assert.match(agentStart, /\.mdkg\/core\/HUMAN\.md/);
  assert.match(agentStart, /select-work-and-ground-context/);
  assert.match(agentStart, /markdown edits for narrative\/body updates/);

  const llms = fs.readFileSync(llmsPath, "utf8");
  assert.match(llms, /AGENT_START\.md/);

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
});
