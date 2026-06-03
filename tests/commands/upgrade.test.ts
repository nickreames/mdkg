import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const { runInitCommand } = require("../../commands/init");
const { runUpgradeCommand } = require("../../commands/upgrade");
const {
  createInitManifest,
  writeInitManifest,
} = require("../../commands/init_manifest");
import { makeTempDir, writeFile } from "../helpers/fs";

const packageVersion = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), "package.json"), "utf8")
).version;

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

function setupSeed(seed: string, marker: string): void {
  writeFile(path.join(seed, "config.json"), JSON.stringify(BASE_CONFIG, null, 2));
  writeFile(path.join(seed, "core", "core.md"), `# core ${marker}\n\nrule-1\n`);
  writeFile(path.join(seed, "templates", "default", "task.md"), `---\nid: {{id}}\ntype: task\nmarker: ${marker}\n---\n`);
  writeFile(path.join(seed, "README.md"), `# mdkg ${marker}\n`);
  writeFile(path.join(seed, "AGENT_START.md"), `# AGENT_START ${marker}\n`);
  writeFile(path.join(seed, "CLI_COMMAND_MATRIX.md"), `# CLI Command Matrix ${marker}\n`);
  writeFile(path.join(seed, "llms.txt"), `Read AGENT_START.md first. ${marker}\n`);
  writeFile(path.join(seed, "AGENTS.md"), `# Agents ${marker}\nRead AGENT_START.md first.\n`);
  writeFile(path.join(seed, "CLAUDE.md"), `# Claude ${marker}\nRead AGENT_START.md first.\n`);
  for (const slug of [
    "select-work-and-ground-context",
    "build-pack-and-execute-task",
    "verify-close-and-checkpoint",
  ]) {
    const extraLines =
      marker === "current" && slug === "verify-close-and-checkpoint"
        ? [
            "",
            "## Bundle-Aware Commit Gate",
            "",
            "Run `mdkg archive compress --all` and `mdkg bundle create --profile private` before commit.",
          ]
        : [];
    writeFile(
      path.join(seed, "skills", "default", slug, "SKILL.md"),
      [
        "---",
        `name: ${slug}`,
        `description: use ${slug} when ${marker} bootstrap scaffolding is active`,
        `tags: [stage:${slug.startsWith("select") ? "plan" : slug.startsWith("build") ? "execute" : "review"}]`,
        "---",
        "",
        "# Goal",
        "",
        `Seeded ${marker} skill.`,
        ...extraLines,
      ].join("\n")
    );
  }
}

function setupCurrentAndLegacySeeds(): { oldSeed: string; currentSeed: string } {
  const oldSeed = makeTempDir("mdkg-upgrade-old-seed-");
  const currentSeed = makeTempDir("mdkg-upgrade-current-seed-");
  setupSeed(oldSeed, "old");
  setupSeed(currentSeed, "current");
  const legacyManifest = createInitManifest(oldSeed, "0.0.9");
  writeInitManifest(path.join(currentSeed, "legacy", "v0.0.9-init-manifest.json"), legacyManifest);
  return { oldSeed, currentSeed };
}

function captureUpgrade(fn: () => unknown): unknown {
  const originalLog = console.log;
  try {
    console.log = (() => undefined) as typeof console.log;
    return fn();
  } finally {
    console.log = originalLog;
  }
}

test("runUpgradeCommand defaults to dry-run and does not write files", () => {
  const root = makeTempDir("mdkg-upgrade-dry-run-");
  const { oldSeed, currentSeed } = setupCurrentAndLegacySeeds();
  runInitCommand({ root, seedRoot: oldSeed, agent: true });

  const before = fs.readFileSync(path.join(root, "AGENT_START.md"), "utf8");
  const receipt = captureUpgrade(() => runUpgradeCommand({ root, seedRoot: currentSeed })) as {
    dry_run: boolean;
    changes: Array<{ action: string; path: string }>;
  };

  assert.equal(receipt.dry_run, true);
  assert.ok(receipt.changes.some((change) => change.action === "update" && change.path === "AGENT_START.md"));
  assert.equal(fs.readFileSync(path.join(root, "AGENT_START.md"), "utf8"), before);
});

test("runUpgradeCommand apply updates managed assets, writes manifest, and syncs mirrors", () => {
  const root = makeTempDir("mdkg-upgrade-apply-");
  const { oldSeed, currentSeed } = setupCurrentAndLegacySeeds();
  runInitCommand({ root, seedRoot: oldSeed, agent: true });

  const receipt = captureUpgrade(() => runUpgradeCommand({ root, seedRoot: currentSeed, apply: true })) as {
    dry_run: boolean;
    changes: Array<{ action: string; path: string }>;
    safe_to_apply: boolean;
    will_write_paths: string[];
    apply_side_effects: Array<{ category: string; path: string }>;
  };

  assert.equal(receipt.dry_run, false);
  assert.equal(receipt.safe_to_apply, true);
  assert.ok(receipt.changes.some((change) => change.action === "update" && change.path === "AGENT_START.md"));
  assert.ok(receipt.changes.some((change) => change.action === "sync"));
  assert.ok(receipt.will_write_paths.includes(".mdkg/init-manifest.json"));
  assert.ok(receipt.apply_side_effects.some((change) => change.category === "skill_mirror"));
  assert.match(fs.readFileSync(path.join(root, "AGENT_START.md"), "utf8"), /current/);
  assert.match(
    fs.readFileSync(
      path.join(root, ".mdkg", "skills", "select-work-and-ground-context", "SKILL.md"),
      "utf8"
    ),
    /current skill/
  );
  assert.match(
    fs.readFileSync(
      path.join(root, ".agents", "skills", "select-work-and-ground-context", "SKILL.md"),
      "utf8"
    ),
    /current skill/
  );
  assert.match(
    fs.readFileSync(
      path.join(root, ".mdkg", "skills", "verify-close-and-checkpoint", "SKILL.md"),
      "utf8"
    ),
    /mdkg archive compress --all/
  );
  assert.match(
    fs.readFileSync(
      path.join(root, ".agents", "skills", "verify-close-and-checkpoint", "SKILL.md"),
      "utf8"
    ),
    /mdkg bundle create --profile private/
  );

  const manifest = JSON.parse(fs.readFileSync(path.join(root, ".mdkg", "init-manifest.json"), "utf8"));
  assert.equal(manifest.mdkg_version, packageVersion);

  const secondReceipt = captureUpgrade(() => runUpgradeCommand({ root, seedRoot: currentSeed })) as {
    changes: unknown[];
  };
  assert.deepEqual(secondReceipt.changes, []);
});

test("runUpgradeCommand preserves customized docs and default skills", () => {
  const root = makeTempDir("mdkg-upgrade-custom-");
  const { oldSeed, currentSeed } = setupCurrentAndLegacySeeds();
  runInitCommand({ root, seedRoot: oldSeed, agent: true });
  writeFile(path.join(root, "AGENT_START.md"), "# Custom agent start\n");
  writeFile(
    path.join(root, ".mdkg", "skills", "select-work-and-ground-context", "SKILL.md"),
    "---\nname: select-work-and-ground-context\ndescription: custom local skill\n---\n\n# Custom\n"
  );

  const receipt = captureUpgrade(() => runUpgradeCommand({ root, seedRoot: currentSeed, apply: true })) as {
    changes: Array<{ action: string; path: string }>;
    safe_to_apply: boolean;
    preserved_customizations: Array<{ path: string }>;
    blocking_conflicts: unknown[];
  };

  assert.equal(receipt.safe_to_apply, true);
  assert.equal(receipt.blocking_conflicts.length, 0);
  assert.ok(receipt.changes.some((change) => change.action === "conflict" && change.path === "AGENT_START.md"));
  assert.ok(receipt.preserved_customizations.some((change) => change.path === "AGENT_START.md"));
  assert.ok(
    receipt.changes.some(
      (change) =>
        change.action === "conflict" &&
        change.path === ".mdkg/skills/select-work-and-ground-context/SKILL.md"
    )
  );
  assert.equal(fs.readFileSync(path.join(root, "AGENT_START.md"), "utf8"), "# Custom agent start\n");
  assert.match(
    fs.readFileSync(
      path.join(root, ".mdkg", "skills", "select-work-and-ground-context", "SKILL.md"),
      "utf8"
    ),
    /custom local skill/
  );
});

test("runUpgradeCommand migrates legacy config without replacing custom config", () => {
  const root = makeTempDir("mdkg-upgrade-config-");
  const { currentSeed } = setupCurrentAndLegacySeeds();
  const legacyConfig = { ...BASE_CONFIG } as Record<string, unknown>;
  delete legacyConfig.schema_version;
  delete legacyConfig.workspaces;
  writeFile(path.join(root, ".mdkg", "config.json"), JSON.stringify(legacyConfig, null, 2));

  const receipt = captureUpgrade(() => runUpgradeCommand({ root, seedRoot: currentSeed, apply: true })) as {
    changes: Array<{ action: string; path: string }>;
  };
  const config = JSON.parse(fs.readFileSync(path.join(root, ".mdkg", "config.json"), "utf8"));

  assert.ok(receipt.changes.some((change) => change.action === "migrate" && change.path === ".mdkg/config.json"));
  assert.equal(config.schema_version, 1);
  assert.deepEqual(config.workspaces, {
    root: { path: ".", enabled: true, mdkg_dir: ".mdkg" },
  });
});

test("runUpgradeCommand does not add skills or events to non-agent workspaces", () => {
  const root = makeTempDir("mdkg-upgrade-non-agent-");
  const { oldSeed, currentSeed } = setupCurrentAndLegacySeeds();
  runInitCommand({ root, seedRoot: oldSeed });

  captureUpgrade(() => runUpgradeCommand({ root, seedRoot: currentSeed, apply: true }));

  assert.equal(fs.existsSync(path.join(root, ".mdkg", "skills")), false);
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "work", "events", "events.jsonl")), false);
  assert.equal(fs.existsSync(path.join(root, "AGENT_START.md")), false);
  assert.equal(fs.existsSync(path.join(root, "AGENTS.md")), false);
  assert.equal(fs.existsSync(path.join(root, "CLAUDE.md")), false);
});

test("runUpgradeCommand repairs legacy agent workspaces missing wrapper docs", () => {
  const root = makeTempDir("mdkg-upgrade-legacy-agent-wrappers-");
  const { oldSeed, currentSeed } = setupCurrentAndLegacySeeds();
  runInitCommand({ root, seedRoot: oldSeed, agent: true });
  fs.rmSync(path.join(root, "AGENTS.md"), { force: true });
  fs.rmSync(path.join(root, "CLAUDE.md"), { force: true });

  const dryRun = captureUpgrade(() => runUpgradeCommand({ root, seedRoot: currentSeed })) as {
    changes: Array<{ action: string; path: string }>;
    safe_to_apply: boolean;
  };
  assert.equal(dryRun.safe_to_apply, true);
  assert.ok(dryRun.changes.some((change) => change.action === "create" && change.path === "AGENTS.md"));
  assert.ok(dryRun.changes.some((change) => change.action === "create" && change.path === "CLAUDE.md"));
  assert.equal(fs.existsSync(path.join(root, "AGENTS.md")), false);

  captureUpgrade(() => runUpgradeCommand({ root, seedRoot: currentSeed, apply: true }));
  assert.ok(fs.existsSync(path.join(root, "AGENTS.md")));
  assert.ok(fs.existsSync(path.join(root, "CLAUDE.md")));
});

test("runUpgradeCommand skips ignored event logs and reports safe apply metadata", () => {
  const root = makeTempDir("mdkg-upgrade-ignored-events-");
  const { oldSeed, currentSeed } = setupCurrentAndLegacySeeds();
  runInitCommand({ root, seedRoot: oldSeed, agent: true });
  fs.rmSync(path.join(root, ".mdkg", "work", "events", "events.jsonl"), { force: true });
  writeFile(path.join(root, ".gitignore"), ".mdkg/work/events/\n");

  const receipt = captureUpgrade(() => runUpgradeCommand({ root, seedRoot: currentSeed })) as {
    safe_to_apply: boolean;
    will_write_paths: string[];
    changes: Array<{ action: string; path: string; category: string }>;
  };

  assert.equal(receipt.safe_to_apply, true);
  assert.ok(
    receipt.changes.some(
      (change) =>
        change.action === "skip" &&
        change.category === "event_log" &&
        change.path === ".mdkg/work/events/events.jsonl"
    )
  );
  assert.ok(
    receipt.changes.some(
      (change) =>
        change.action === "update" &&
        change.category === "ignore_policy" &&
        change.path === ".gitignore"
    )
  );
  assert.equal(receipt.will_write_paths.includes(".mdkg/work/events/events.jsonl"), false);
  assert.equal(receipt.will_write_paths.includes(".gitignore"), true);

  captureUpgrade(() => runUpgradeCommand({ root, seedRoot: currentSeed, apply: true }));
  assert.match(fs.readFileSync(path.join(root, ".gitignore"), "utf8"), /\.mdkg\/archive\/\*\*\/source\//);
  assert.match(fs.readFileSync(path.join(root, ".gitignore"), "utf8"), /\.mdkg\/db\/runtime\//);
  assert.match(fs.readFileSync(path.join(root, ".gitignore"), "utf8"), /\.mdkg\/db\/\*\*\/\*\.sqlite-wal/);
});
