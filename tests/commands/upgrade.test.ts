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
  db: {
    enabled: false,
    schema_version: 1,
    root_path: ".mdkg/db",
    schema_path: ".mdkg/db/schema",
    migrations_path: ".mdkg/db/schema/migrations",
    runtime_path: ".mdkg/db/runtime/project.sqlite",
    state_path: ".mdkg/db/state/project.sqlite",
    receipts_path: ".mdkg/db/receipts",
    migration_table: "mdkg_schema_migration",
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
  if (marker === "current") {
    writeFile(
      path.join(seed, "core", "COLLABORATION.md"),
      [
        "---",
        "id: rule-7",
        "type: rule",
        "title: collaboration profile",
        "tags: [collaboration]",
        "owners: []",
        "links: []",
        "artifacts: []",
        "relates: [rule-human]",
        "refs: []",
        "aliases: [collaboration]",
        "created: 2026-06-27",
        "updated: 2026-06-27",
        "---",
        "",
        "# Purpose",
        "",
        "Current collaboration seed.",
      ].join("\n")
    );
    writeFile(
      path.join(seed, "core", "HUMAN.md"),
      [
        "---",
        "id: rule-human",
        "type: rule",
        "title: human working profile legacy alias",
        "tags: [human, collaboration]",
        "owners: []",
        "links: []",
        "artifacts: []",
        "relates: [rule-7]",
        "refs: []",
        "aliases: [human]",
        "created: 2026-06-27",
        "updated: 2026-06-27",
        "---",
        "",
        "# Compatibility",
        "",
        "HUMAN.md is a one-release legacy alias for COLLABORATION.md.",
      ].join("\n")
    );
  }
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

function legacySpecContent(title = "Legacy probe capability"): string {
  return [
    "---",
    "id: agent.legacy-probe",
    "type: spec",
    `title: ${title}`,
    "version: 0.1.0",
    "spec_kind: agent",
    "role: subagent",
    "runtime_mode: standalone",
    "work_contracts: []",
    "requested_capabilities: []",
    "resource_profile: default",
    "update_policy: manual",
    "tags: [manifest, legacy]",
    "owners: []",
    "links: []",
    "artifacts: []",
    "refs: []",
    "aliases: [legacy-probe]",
    "skills: []",
    "created: 2026-06-26",
    "updated: 2026-06-26",
    "---",
    "",
    "# Purpose",
    "",
    "Preserve this body during migration.",
  ].join("\n");
}

function manifestContent(): string {
  return legacySpecContent("Canonical probe capability").replace("type: spec", "type: manifest");
}

function writeLegacySpecFixture(root: string): { sourcePath: string; targetPath: string } {
  const dir = path.join(root, ".mdkg", "work", "agent.legacy-probe");
  const sourcePath = path.join(dir, "SPEC.md");
  const targetPath = path.join(dir, "MANIFEST.md");
  writeFile(sourcePath, legacySpecContent());
  return { sourcePath, targetPath };
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

test("runUpgradeCommand creates collaboration doc and preserves customized human alias", () => {
  const root = makeTempDir("mdkg-upgrade-collaboration-");
  const { oldSeed, currentSeed } = setupCurrentAndLegacySeeds();
  runInitCommand({ root, seedRoot: oldSeed, agent: true });
  fs.rmSync(path.join(root, ".mdkg", "core", "COLLABORATION.md"), { force: true });
  writeFile(path.join(root, ".mdkg", "core", "HUMAN.md"), "# Custom legacy human profile\n");

  const receipt = captureUpgrade(() => runUpgradeCommand({ root, seedRoot: currentSeed, apply: true })) as {
    changes: Array<{ action: string; category: string; path: string }>;
    preserved_customizations: Array<{ path: string }>;
  };

  assert.ok(
    receipt.changes.some(
      (change) =>
        change.action === "create" &&
        change.category === "core" &&
        change.path === ".mdkg/core/COLLABORATION.md"
    )
  );
  assert.ok(receipt.preserved_customizations.some((change) => change.path === ".mdkg/core/HUMAN.md"));
  assert.match(fs.readFileSync(path.join(root, ".mdkg", "core", "COLLABORATION.md"), "utf8"), /id: rule-7/);
  assert.equal(fs.readFileSync(path.join(root, ".mdkg", "core", "HUMAN.md"), "utf8"), "# Custom legacy human profile\n");
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
  assert.equal(config.db.enabled, false);
  assert.equal(config.db.root_path, ".mdkg/db");
  assert.deepEqual(config.customization.skill_mirrors.targets, [".agents/skills", ".claude/skills"]);
});

test("runUpgradeCommand reports and preserves operator customization overlays", () => {
  const root = makeTempDir("mdkg-upgrade-customization-overlay-");
  const { currentSeed } = setupCurrentAndLegacySeeds();
  runInitCommand({ root, seedRoot: currentSeed, agent: true });
  const configPath = path.join(root, ".mdkg", "config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.subgraphs = {};
  config.customization = {
    standards: {
      profile: "acme",
      refs: ["standards/acme.md"],
    },
    core_docs: {
      custom_paths: ["standards/COLLABORATION.md"],
    },
    skill_mirrors: {
      targets: [".agents/skills", ".claude/skills", ".codex/skills"],
    },
  };
  writeFile(configPath, JSON.stringify(config, null, 2));

  const dryRun = captureUpgrade(() => runUpgradeCommand({ root, seedRoot: currentSeed })) as {
    safe_to_apply: boolean;
    will_write_paths: string[];
    preserved_customizations: Array<{ category: string; path: string; reason: string }>;
    changes: Array<{ action: string; category: string; path: string }>;
  };

  assert.equal(dryRun.safe_to_apply, true);
  assert.equal(dryRun.will_write_paths.includes(".mdkg/config.json"), false);
  assert.ok(
    dryRun.changes.some(
      (change) => change.action === "skip" && change.category === "customization_overlay" && change.path === ".mdkg/config.json"
    )
  );
  assert.ok(dryRun.preserved_customizations.some((change) => change.category === "customization_overlay"));

  captureUpgrade(() => runUpgradeCommand({ root, seedRoot: currentSeed, apply: true }));
  const appliedConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
  assert.deepEqual(appliedConfig.customization.skill_mirrors.targets, [".agents/skills", ".claude/skills", ".codex/skills"]);
  assert.deepEqual(appliedConfig.customization.core_docs.custom_paths, ["standards/COLLABORATION.md"]);
  assert.equal(appliedConfig.customization.standards.profile, "acme");
});

test("runUpgradeCommand migrates achieved goal active_node to last_active_node", () => {
  const root = makeTempDir("mdkg-upgrade-goal-lifecycle-");
  const { oldSeed, currentSeed } = setupCurrentAndLegacySeeds();
  runInitCommand({ root, seedRoot: oldSeed, agent: true });
  writeFile(
    path.join(root, ".mdkg", "work", "goal-1.md"),
    [
      "---",
      "id: goal-1",
      "type: goal",
      "title: Closed legacy goal",
      "status: done",
      "priority: 1",
      "goal_state: achieved",
      "goal_condition: already complete",
      "scope_refs: [task-1]",
      "active_node: task-1",
      "required_skills: []",
      "required_checks: []",
      "max_iterations: 25",
      "blocked_after_attempts: 3",
      "tags: []",
      "owners: []",
      "links: []",
      "artifacts: []",
      "relates: []",
      "blocked_by: []",
      "blocks: []",
      "refs: []",
      "aliases: []",
      "skills: []",
      "created: 2026-06-17",
      "updated: 2026-06-17",
      "---",
      "",
      "# Closed legacy goal",
    ].join("\n")
  );

  const dryRun = captureUpgrade(() => runUpgradeCommand({ root, seedRoot: currentSeed })) as {
    changes: Array<{ action: string; category: string; path: string }>;
  };
  assert.ok(
    dryRun.changes.some(
      (change) =>
        change.action === "migrate" &&
        change.category === "goal_lifecycle" &&
        change.path === ".mdkg/work/goal-1.md"
    )
  );
  assert.match(fs.readFileSync(path.join(root, ".mdkg", "work", "goal-1.md"), "utf8"), /^active_node: task-1$/m);

  captureUpgrade(() => runUpgradeCommand({ root, seedRoot: currentSeed, apply: true }));
  const migrated = fs.readFileSync(path.join(root, ".mdkg", "work", "goal-1.md"), "utf8");
  assert.doesNotMatch(migrated, /^active_node:/m);
  assert.match(migrated, /^last_active_node: task-1$/m);
});

test("runUpgradeCommand dry-run reports legacy SPEC to MANIFEST migrations without writing files", () => {
  const root = makeTempDir("mdkg-upgrade-spec-dry-run-");
  const { currentSeed } = setupCurrentAndLegacySeeds();
  runInitCommand({ root, seedRoot: currentSeed, agent: true });
  const { sourcePath, targetPath } = writeLegacySpecFixture(root);

  const receipt = captureUpgrade(() => runUpgradeCommand({ root, seedRoot: currentSeed })) as {
    dry_run: boolean;
    safe_to_apply: boolean;
    will_write_paths: string[];
    changes: Array<{ action: string; category: string; path: string; target_path?: string }>;
  };

  assert.equal(receipt.dry_run, true);
  assert.equal(receipt.safe_to_apply, true);
  assert.ok(
    receipt.changes.some(
      (change) =>
        change.action === "migrate" &&
        change.category === "manifest_migration" &&
        change.path === ".mdkg/work/agent.legacy-probe/SPEC.md" &&
        change.target_path === ".mdkg/work/agent.legacy-probe/MANIFEST.md"
    )
  );
  assert.ok(receipt.will_write_paths.includes(".mdkg/work/agent.legacy-probe/MANIFEST.md"));
  assert.ok(fs.existsSync(sourcePath));
  assert.equal(fs.existsSync(targetPath), false);
});

test("runUpgradeCommand apply renames legacy SPEC to MANIFEST and normalizes type", () => {
  const root = makeTempDir("mdkg-upgrade-spec-apply-");
  const { currentSeed } = setupCurrentAndLegacySeeds();
  runInitCommand({ root, seedRoot: currentSeed, agent: true });
  const { sourcePath, targetPath } = writeLegacySpecFixture(root);

  const receipt = captureUpgrade(() => runUpgradeCommand({ root, seedRoot: currentSeed, apply: true })) as {
    dry_run: boolean;
    safe_to_apply: boolean;
    changes: Array<{ action: string; category: string; path: string; target_path?: string }>;
  };

  assert.equal(receipt.dry_run, false);
  assert.equal(receipt.safe_to_apply, true);
  assert.ok(
    receipt.changes.some(
      (change) =>
        change.action === "migrate" &&
        change.category === "manifest_migration" &&
        change.path === ".mdkg/work/agent.legacy-probe/SPEC.md" &&
        change.target_path === ".mdkg/work/agent.legacy-probe/MANIFEST.md"
    )
  );
  assert.equal(fs.existsSync(sourcePath), false);
  assert.ok(fs.existsSync(targetPath));
  const migrated = fs.readFileSync(targetPath, "utf8");
  assert.match(migrated, /^id: agent\.legacy-probe$/m);
  assert.match(migrated, /^type: manifest$/m);
  assert.doesNotMatch(migrated, /^type: spec$/m);
  assert.match(migrated, /^title: Legacy probe capability$/m);
  assert.match(migrated, /Preserve this body during migration\./);

  const secondReceipt = captureUpgrade(() => runUpgradeCommand({ root, seedRoot: currentSeed })) as {
    changes: Array<{ category: string }>;
  };
  assert.equal(secondReceipt.changes.some((change) => change.category === "manifest_migration"), false);
});

test("runUpgradeCommand blocks legacy SPEC migration when sibling MANIFEST exists", () => {
  const root = makeTempDir("mdkg-upgrade-spec-conflict-");
  const { currentSeed } = setupCurrentAndLegacySeeds();
  runInitCommand({ root, seedRoot: currentSeed, agent: true });
  const { sourcePath, targetPath } = writeLegacySpecFixture(root);
  writeFile(targetPath, manifestContent());

  const receipt = captureUpgrade(() => runUpgradeCommand({ root, seedRoot: currentSeed, apply: true })) as {
    safe_to_apply: boolean;
    will_write_paths: string[];
    blocking_conflicts: Array<{ action: string; category: string; path: string; target_path?: string }>;
    changes: Array<{ action: string; category: string; path: string; target_path?: string }>;
  };

  assert.equal(receipt.safe_to_apply, false);
  assert.ok(
    receipt.blocking_conflicts.some(
      (change) =>
        change.action === "conflict" &&
        change.category === "manifest_migration" &&
        change.path === ".mdkg/work/agent.legacy-probe/SPEC.md" &&
        change.target_path === ".mdkg/work/agent.legacy-probe/MANIFEST.md"
    )
  );
  assert.equal(receipt.will_write_paths.includes(".mdkg/work/agent.legacy-probe/MANIFEST.md"), false);
  assert.ok(fs.existsSync(sourcePath));
  assert.ok(fs.existsSync(targetPath));
  assert.match(fs.readFileSync(sourcePath, "utf8"), /^type: spec$/m);
  assert.match(fs.readFileSync(targetPath, "utf8"), /^type: manifest$/m);
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
