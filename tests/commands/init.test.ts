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
  if (includeAgentDocs) {
    writeFile(path.join(seed, "AGENTS.md"), "# Agents\n");
    writeFile(path.join(seed, "CLAUDE.md"), "# Claude\n");
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
  assert.match(gitignore, /\.mdkg\/work\/events\/\*\.jsonl/);

  const npmignore = fs.readFileSync(path.join(root, ".npmignore"), "utf8");
  assert.match(npmignore, /\.mdkg\//);
  assert.match(npmignore, /\.mdkg\/index\//);
  assert.match(npmignore, /\.mdkg\/pack\//);
});

test("runInitCommand creates agent docs when requested", () => {
  const root = makeTempDir("mdkg-init-agent-");
  const seed = makeTempDir("mdkg-init-agent-seed-");
  setupSeed(seed);

  runInitCommand({ root, seedRoot: seed, createLlm: true });

  assert.ok(fs.existsSync(path.join(root, "AGENTS.md")));
  assert.ok(fs.existsSync(path.join(root, "CLAUDE.md")));
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

test("runInitCommand omni mode scaffolds soul/human/skills/events and core pin order", () => {
  const root = makeTempDir("mdkg-init-omni-");
  const seed = makeTempDir("mdkg-init-omni-seed-");
  setupSeed(seed, false);

  runInitCommand({ root, seedRoot: seed, omni: true });

  const soulPath = path.join(root, ".mdkg", "core", "SOUL.md");
  const humanPath = path.join(root, ".mdkg", "core", "HUMAN.md");
  const registryPath = path.join(root, ".mdkg", "skills", "registry.md");
  const eventsPath = path.join(root, ".mdkg", "work", "events", "events.jsonl");
  const coreListPath = path.join(root, ".mdkg", "core", "core.md");

  assert.ok(fs.existsSync(soulPath));
  assert.ok(fs.existsSync(humanPath));
  assert.ok(fs.existsSync(registryPath));
  assert.ok(fs.existsSync(eventsPath));

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

  const coreLines = fs
    .readFileSync(coreListPath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
  assert.deepEqual(coreLines.slice(0, 2), ["rule-soul", "rule-human"]);
  assert.equal(coreLines.filter((value) => value === "rule-soul").length, 1);
  assert.equal(coreLines.filter((value) => value === "rule-human").length, 1);
});
