import { test } from "node:test";
import assert from "node:assert/strict";
import path from "path";
const { loadConfig } = require("../../core/config");
const { LATEST_SCHEMA_VERSION, migrateConfig } = require("../../core/migrate");
import { makeTempDir, writeFile } from "../helpers/fs";

const BASE_CONFIG = {
  schema_version: 1,
  tool: "mdkg",
  root_required: true,
  archive: {
    large_cache_warning_bytes: 26214400,
  },
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
  subgraphs: {},
  pack: {
    default_depth: 2,
    default_edges: ["parent", "epic", "relates"],
    verbose_core_list_path: ".mdkg/core/core.md",
    limits: {
      max_nodes: 25,
      max_bytes: 2000000,
    },
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
    root: {
      path: ".",
      enabled: true,
      mdkg_dir: ".mdkg",
      visibility: "private",
    },
  },
};

test("loadConfig reads and validates config", () => {
  const root = makeTempDir("mdkg-config-");
  const configPath = path.join(root, ".mdkg", "config.json");
  writeFile(configPath, JSON.stringify(BASE_CONFIG, null, 2));

  const config = loadConfig(root);
  assert.equal(config.schema_version, LATEST_SCHEMA_VERSION);
  assert.equal(config.workspaces.root.path, ".");
  assert.equal(config.workspaces.root.visibility, "private");
  assert.equal(config.archive.large_cache_warning_bytes, 26214400);
  assert.equal(config.capabilities.cache_path, ".mdkg/index/capabilities.json");
  assert.equal(config.bundles.output_dir, ".mdkg/bundles");
  assert.equal(config.bundles.default_profile, "private");
  assert.equal(config.db.enabled, false);
  assert.equal(config.db.schema_version, 1);
  assert.equal(config.db.root_path, ".mdkg/db");
  assert.equal(config.db.schema_path, ".mdkg/db/schema");
  assert.equal(config.db.migrations_path, ".mdkg/db/schema/migrations");
  assert.equal(config.db.runtime_path, ".mdkg/db/runtime/project.sqlite");
  assert.equal(config.db.state_path, ".mdkg/db/state/project.sqlite");
  assert.equal(config.db.receipts_path, ".mdkg/db/receipts");
  assert.equal(config.db.migration_table, "mdkg_schema_migration");
  assert.equal(config.index.backend, "json");
  assert.deepEqual(config.subgraphs, {});
  assert.deepEqual(config.customization, {
    standards: {
      profile: "default",
      refs: [],
    },
    core_docs: {
      custom_paths: [],
    },
    skill_mirrors: {
      targets: [".agents/skills", ".claude/skills"],
    },
  });
});

test("loadConfig migrates legacy config without schema_version and defaults capability bundle and db fields", () => {
  const root = makeTempDir("mdkg-config-");
  const configPath = path.join(root, ".mdkg", "config.json");
  const legacyConfig = { ...BASE_CONFIG } as Record<string, unknown>;
  delete legacyConfig.schema_version;
  delete legacyConfig.archive;
  delete legacyConfig.capabilities;
  delete legacyConfig.bundles;
  delete legacyConfig.db;
  delete legacyConfig.subgraphs;
  const workspaces = JSON.parse(JSON.stringify(legacyConfig.workspaces)) as Record<string, Record<string, unknown>>;
  delete workspaces.root.visibility;
  legacyConfig.workspaces = workspaces;
  writeFile(configPath, JSON.stringify(legacyConfig, null, 2));

  const config = loadConfig(root);
  assert.equal(config.schema_version, LATEST_SCHEMA_VERSION);
  assert.equal(config.workspaces.root.mdkg_dir, ".mdkg");
  assert.equal(config.workspaces.root.visibility, "private");
  assert.equal(config.archive.large_cache_warning_bytes, 26214400);
  assert.equal(config.capabilities.cache_path, ".mdkg/index/capabilities.json");
  assert.equal(config.bundles.output_dir, ".mdkg/bundles");
  assert.equal(config.bundles.default_profile, "private");
  assert.equal(config.db.enabled, false);
  assert.equal(config.db.root_path, ".mdkg/db");
  assert.equal(config.db.runtime_path, ".mdkg/db/runtime/project.sqlite");
  assert.deepEqual(config.subgraphs, {});
  assert.deepEqual(config.customization.skill_mirrors.targets, [".agents/skills", ".claude/skills"]);
});

test("loadConfig accepts organization customization overlays and custom mirror targets", () => {
  const root = makeTempDir("mdkg-config-customization-");
  const configPath = path.join(root, ".mdkg", "config.json");
  const config = JSON.parse(JSON.stringify(BASE_CONFIG));
  config.customization = {
    standards: {
      profile: "acme",
      refs: ["standards/acme.md", "archive://standards.acme"],
    },
    core_docs: {
      custom_paths: ["standards/COLLABORATION.md"],
    },
    skill_mirrors: {
      targets: [".agents/skills", ".claude/skills", ".codex/skills"],
    },
  };
  writeFile(configPath, JSON.stringify(config, null, 2));

  const loaded = loadConfig(root);
  assert.equal(loaded.customization.standards.profile, "acme");
  assert.deepEqual(loaded.customization.standards.refs, ["standards/acme.md", "archive://standards.acme"]);
  assert.deepEqual(loaded.customization.core_docs.custom_paths, ["standards/COLLABORATION.md"]);
  assert.deepEqual(loaded.customization.skill_mirrors.targets, [".agents/skills", ".claude/skills", ".codex/skills"]);
});

test("loadConfig rejects unsafe customization overlay paths", () => {
  const root = makeTempDir("mdkg-config-customization-invalid-");
  const configPath = path.join(root, ".mdkg", "config.json");
  const config = JSON.parse(JSON.stringify(BASE_CONFIG));
  config.customization = {
    standards: {
      profile: "acme",
      refs: [],
    },
    core_docs: {
      custom_paths: ["../outside.md"],
    },
    skill_mirrors: {
      targets: [".agents/skills", "/tmp/skills"],
    },
  };
  writeFile(configPath, JSON.stringify(config, null, 2));

  assert.throws(
    () => loadConfig(root),
    /customization\.core_docs\.custom_paths\[0\] cannot contain parent-directory components[\s\S]*customization\.skill_mirrors\.targets\[1\] must be relative/
  );
});

test("loadConfig accepts project db config distinct from index backend", () => {
  const root = makeTempDir("mdkg-config-db-");
  const configPath = path.join(root, ".mdkg", "config.json");
  const config = JSON.parse(JSON.stringify(BASE_CONFIG));
  config.index.backend = "json";
  config.db = {
    enabled: true,
    schema_version: 2,
    root_path: ".mdkg/db",
    schema_path: ".mdkg/db/schema",
    migrations_path: ".mdkg/db/schema/migrations",
    runtime_path: ".mdkg/db/runtime/app.sqlite",
    state_path: ".mdkg/db/state/app.sqlite",
    receipts_path: ".mdkg/db/receipts",
    migration_table: "project_schema_migration",
  };
  writeFile(configPath, JSON.stringify(config, null, 2));

  const loaded = loadConfig(root);
  assert.equal(loaded.index.backend, "json");
  assert.equal(loaded.db.enabled, true);
  assert.equal(loaded.db.schema_version, 2);
  assert.equal(loaded.db.runtime_path, ".mdkg/db/runtime/app.sqlite");
  assert.equal(loaded.db.migration_table, "project_schema_migration");
});

test("loadConfig derives omitted project db paths from custom root path", () => {
  const root = makeTempDir("mdkg-config-db-root-");
  const configPath = path.join(root, ".mdkg", "config.json");
  const config = JSON.parse(JSON.stringify(BASE_CONFIG));
  config.db = {
    enabled: false,
    schema_version: 1,
    root_path: ".project-db",
    migration_table: "mdkg_schema_migration",
  };
  writeFile(configPath, JSON.stringify(config, null, 2));

  const loaded = loadConfig(root);
  assert.equal(loaded.db.root_path, ".project-db");
  assert.equal(loaded.db.schema_path, ".project-db/schema");
  assert.equal(loaded.db.migrations_path, ".project-db/schema/migrations");
  assert.equal(loaded.db.runtime_path, ".project-db/runtime/project.sqlite");
  assert.equal(loaded.db.state_path, ".project-db/state/project.sqlite");
  assert.equal(loaded.db.receipts_path, ".project-db/receipts");
});

test("loadConfig accepts subgraph config and rejects workspace alias collisions", () => {
  const root = makeTempDir("mdkg-config-subgraph-");
  const configPath = path.join(root, ".mdkg", "config.json");
  writeFile(
    configPath,
    JSON.stringify(
      {
        ...BASE_CONFIG,
        subgraphs: {
          child_repo: {
            enabled: true,
            visibility: "internal",
            permissions: ["read"],
            source_path: "children/child-repo",
            source_repo: "git@example.com:child.git",
            max_stale_seconds: 60,
            sources: [
              {
                path: ".mdkg/bundles/private/child.mdkg.zip",
                expected_profile: "public",
              },
            ],
          },
        },
      },
      null,
      2
    )
  );

  const config = loadConfig(root);
  assert.equal(config.subgraphs.child_repo.sources[0].path, ".mdkg/bundles/private/child.mdkg.zip");
  assert.equal(config.subgraphs.child_repo.visibility, "internal");
  assert.equal(config.subgraphs.child_repo.sources[0].expected_profile, "public");
  assert.deepEqual(config.subgraphs.child_repo.permissions, ["read"]);
  assert.equal(config.subgraphs.child_repo.source_path, "children/child-repo");
  assert.equal(config.subgraphs.child_repo.max_stale_seconds, 60);

  writeFile(
    configPath,
    JSON.stringify(
      {
        ...BASE_CONFIG,
        subgraphs: {
          root: {
            enabled: true,
            visibility: "private",
            permissions: ["read"],
            max_stale_seconds: 3600,
            sources: [
              {
                path: ".mdkg/bundles/private/root.mdkg.zip",
                expected_profile: "private",
              },
            ],
          },
        },
      },
      null,
      2
    )
  );
  assert.throws(() => loadConfig(root), /subgraphs.root must not collide with workspaces.root/);
});

test("loadConfig rejects non-private subgraphs backed by private profiles", () => {
  const root = makeTempDir("mdkg-config-subgraph-visibility-");
  const configPath = path.join(root, ".mdkg", "config.json");
  writeFile(
    configPath,
    JSON.stringify(
      {
        ...BASE_CONFIG,
        subgraphs: {
          child_repo: {
            enabled: true,
            visibility: "public",
            permissions: ["read"],
            max_stale_seconds: 3600,
            sources: [
              {
                path: ".mdkg/bundles/private/child.mdkg.zip",
                expected_profile: "private",
              },
            ],
          },
        },
      },
      null,
      2
    )
  );

  assert.throws(
    () => loadConfig(root),
    /subgraphs\.child_repo\.sources\[0\]\.expected_profile must be public when subgraphs\.child_repo\.visibility is public/
  );
});

test("loadConfig maps legacy bundle_imports into subgraphs", () => {
  const root = makeTempDir("mdkg-config-legacy-bundle-imports-");
  const configPath = path.join(root, ".mdkg", "config.json");
  const legacyConfig = { ...BASE_CONFIG } as Record<string, unknown>;
  delete legacyConfig.subgraphs;
  legacyConfig.bundle_imports = {
    child_repo: {
      path: ".mdkg/bundles/private/child.mdkg.zip",
      enabled: true,
      visibility: "internal",
      expected_profile: "public",
      source_path: "children/child-repo",
      max_stale_seconds: 60,
    },
  };
  writeFile(configPath, JSON.stringify(legacyConfig, null, 2));

  const config = loadConfig(root);
  assert.equal(config.subgraphs.child_repo.sources[0].path, ".mdkg/bundles/private/child.mdkg.zip");
  assert.equal(config.subgraphs.child_repo.visibility, "internal");
  assert.equal(config.subgraphs.child_repo.sources[0].expected_profile, "public");
  assert.deepEqual(config.subgraphs.child_repo.permissions, ["read"]);
  assert.equal(config.subgraphs.child_repo.source_path, "children/child-repo");
  assert.equal(config.subgraphs.child_repo.max_stale_seconds, 60);
});

test("loadConfig accepts contained relative registered workspace paths", () => {
  const root = makeTempDir("mdkg-config-");
  const configPath = path.join(root, ".mdkg", "config.json");
  writeFile(
    configPath,
    JSON.stringify(
      {
        ...BASE_CONFIG,
        workspaces: {
          ...BASE_CONFIG.workspaces,
          docs: {
            path: "packages/docs",
            enabled: true,
            mdkg_dir: "docs-mdkg",
            visibility: "internal",
          },
        },
      },
      null,
      2
    )
  );

  const config = loadConfig(root);

  assert.equal(config.workspaces.docs.path, "packages/docs");
  assert.equal(config.workspaces.docs.mdkg_dir, "docs-mdkg");
  assert.equal(config.workspaces.docs.visibility, "internal");
});

test("loadConfig rejects config paths that escape the repo root", () => {
  const root = makeTempDir("mdkg-config-contained-paths-");
  const configPath = path.join(root, ".mdkg", "config.json");

  for (const [section, field, value, pattern] of [
    [
      "index",
      "global_index_path",
      "../index.json",
      /index.global_index_path cannot contain parent-directory components/,
    ],
    [
      "index",
      "global_index_path",
      path.join(root, ".mdkg", "index", "global.json"),
      /index.global_index_path must be relative/,
    ],
    ["index", "global_index_path", " ", /index.global_index_path cannot be empty/],
    [
      "index",
      "global_index_path",
      ".mdkg/index/global.json\0bad",
      /index.global_index_path cannot contain NUL bytes/,
    ],
    [
      "capabilities",
      "cache_path",
      "../capabilities.json",
      /capabilities.cache_path cannot contain parent-directory components/,
    ],
    [
      "capabilities",
      "cache_path",
      path.join(root, ".mdkg", "index", "capabilities.json"),
      /capabilities.cache_path must be relative/,
    ],
    ["capabilities", "cache_path", " ", /capabilities.cache_path cannot be empty/],
    [
      "capabilities",
      "cache_path",
      ".mdkg/index/capabilities.json\0bad",
      /capabilities.cache_path cannot contain NUL bytes/,
    ],
    [
      "bundles",
      "output_dir",
      "../bundles",
      /bundles.output_dir cannot contain parent-directory components/,
    ],
    [
      "bundles",
      "output_dir",
      path.join(root, ".mdkg", "bundles"),
      /bundles.output_dir must be relative/,
    ],
    ["bundles", "output_dir", " ", /bundles.output_dir cannot be empty/],
    [
      "bundles",
      "output_dir",
      ".mdkg/bundles\0bad",
      /bundles.output_dir cannot contain NUL bytes/,
    ],
    [
      "db",
      "root_path",
      "../db",
      /db.root_path cannot contain parent-directory components/,
    ],
    [
      "db",
      "root_path",
      path.join(root, ".mdkg", "db"),
      /db.root_path must be relative/,
    ],
    ["db", "root_path", " ", /db.root_path cannot be empty/],
    [
      "db",
      "runtime_path",
      "../runtime/project.sqlite",
      /db.runtime_path cannot contain parent-directory components/,
    ],
    [
      "db",
      "runtime_path",
      path.join(root, ".mdkg", "db", "runtime", "project.sqlite"),
      /db.runtime_path must be relative/,
    ],
    [
      "db",
      "runtime_path",
      ".mdkg/other/project.sqlite",
      /db.runtime_path must be inside db.root_path/,
    ],
    [
      "db",
      "state_path",
      ".mdkg/state/project.sqlite",
      /db.state_path must be inside db.root_path/,
    ],
    [
      "db",
      "receipts_path",
      ".mdkg/receipts",
      /db.receipts_path must be inside db.root_path/,
    ],
    [
      "pack",
      "verbose_core_list_path",
      "../core.md",
      /pack.verbose_core_list_path cannot contain parent-directory components/,
    ],
    [
      "pack",
      "verbose_core_list_path",
      path.join(root, ".mdkg", "core", "core.md"),
      /pack.verbose_core_list_path must be relative/,
    ],
    ["pack", "verbose_core_list_path", " ", /pack.verbose_core_list_path cannot be empty/],
    [
      "pack",
      "verbose_core_list_path",
      ".mdkg/core/core.md\0bad",
      /pack.verbose_core_list_path cannot contain NUL bytes/,
    ],
    [
      "templates",
      "root_path",
      "../templates",
      /templates.root_path cannot contain parent-directory components/,
    ],
    [
      "templates",
      "root_path",
      path.join(root, ".mdkg", "templates"),
      /templates.root_path must be relative/,
    ],
    ["templates", "root_path", " ", /templates.root_path cannot be empty/],
    [
      "templates",
      "root_path",
      ".mdkg/templates\0bad",
      /templates.root_path cannot contain NUL bytes/,
    ],
  ] as const) {
    const config = JSON.parse(JSON.stringify(BASE_CONFIG));
    config[section][field] = value;
    writeFile(configPath, JSON.stringify(config, null, 2));

    assert.throws(() => loadConfig(root), pattern);
  }
});

test("loadConfig validates optional bundle defaults", () => {
  const root = makeTempDir("mdkg-config-bundles-");
  const configPath = path.join(root, ".mdkg", "config.json");
  const config = JSON.parse(JSON.stringify(BASE_CONFIG));
  config.bundles.default_profile = "public";
  writeFile(configPath, JSON.stringify(config, null, 2));
  assert.equal(loadConfig(root).bundles.default_profile, "public");

  config.bundles.default_profile = "external";
  writeFile(configPath, JSON.stringify(config, null, 2));
  assert.throws(
    () => loadConfig(root),
    /bundles\.default_profile must be one of private, public/
  );
});

test("loadConfig validates optional workspace visibility", () => {
  const root = makeTempDir("mdkg-config-visibility-");
  const configPath = path.join(root, ".mdkg", "config.json");
  const config = JSON.parse(JSON.stringify(BASE_CONFIG));
  config.workspaces.docs = {
    path: "docs",
    enabled: true,
    mdkg_dir: ".mdkg",
    visibility: "public",
  };
  writeFile(configPath, JSON.stringify(config, null, 2));
  assert.equal(loadConfig(root).workspaces.docs.visibility, "public");

  config.workspaces.docs.visibility = "partner";
  writeFile(configPath, JSON.stringify(config, null, 2));
  assert.throws(
    () => loadConfig(root),
    /workspaces\.docs\.visibility must be one of private, internal, public/
  );
});

test("loadConfig rejects invalid numeric config invariants", () => {
  const root = makeTempDir("mdkg-config-numeric-invariants-");
  const configPath = path.join(root, ".mdkg", "config.json");

  for (const [mutate, pattern] of [
    [
      (config: typeof BASE_CONFIG) => {
        config.archive.large_cache_warning_bytes = -1;
      },
      /archive.large_cache_warning_bytes must be a non-negative integer/,
    ],
    [
      (config: typeof BASE_CONFIG) => {
        config.archive.large_cache_warning_bytes = 1.5;
      },
      /archive.large_cache_warning_bytes must be an integer/,
    ],
    [
      (config: typeof BASE_CONFIG) => {
        config.db.schema_version = 0;
      },
      /db.schema_version must be a positive integer/,
    ],
    [
      (config: typeof BASE_CONFIG) => {
        config.db.schema_version = 1.5;
      },
      /db.schema_version must be an integer/,
    ],
    [
      (config: typeof BASE_CONFIG) => {
        config.pack.default_depth = -1;
      },
      /pack.default_depth must be a non-negative integer/,
    ],
    [
      (config: typeof BASE_CONFIG) => {
        config.pack.default_depth = 1.5;
      },
      /pack.default_depth must be an integer/,
    ],
    [
      (config: typeof BASE_CONFIG) => {
        config.pack.limits.max_nodes = 0;
      },
      /pack.limits.max_nodes must be a positive integer/,
    ],
    [
      (config: typeof BASE_CONFIG) => {
        config.pack.limits.max_nodes = 3.5;
      },
      /pack.limits.max_nodes must be an integer/,
    ],
    [
      (config: typeof BASE_CONFIG) => {
        config.pack.limits.max_bytes = -1;
      },
      /pack.limits.max_bytes must be a positive integer/,
    ],
    [
      (config: typeof BASE_CONFIG) => {
        config.pack.limits.max_bytes = 10.5;
      },
      /pack.limits.max_bytes must be an integer/,
    ],
    [
      (config: typeof BASE_CONFIG) => {
        config.work.priority_min = 1.25;
      },
      /work.priority_min must be an integer/,
    ],
    [
      (config: typeof BASE_CONFIG) => {
        config.work.priority_max = 9.5;
      },
      /work.priority_max must be an integer/,
    ],
    [
      (config: typeof BASE_CONFIG) => {
        config.work.priority_min = 9;
        config.work.priority_max = 1;
      },
      /work.priority_min must be less than or equal to work.priority_max/,
    ],
  ] as const) {
    const config = JSON.parse(JSON.stringify(BASE_CONFIG));
    mutate(config);
    writeFile(configPath, JSON.stringify(config, null, 2));

    assert.throws(() => loadConfig(root), pattern);
  }
});

test("loadConfig rejects unsupported project db profile config and bad migration table names", () => {
  const root = makeTempDir("mdkg-config-db-profile-");
  const configPath = path.join(root, ".mdkg", "config.json");
  const config = JSON.parse(JSON.stringify(BASE_CONFIG));
  (config.db as Record<string, unknown>).profile = "wedding_crm";
  writeFile(configPath, JSON.stringify(config, null, 2));
  assert.throws(() => loadConfig(root), /db profiles are not supported in this release/);

  delete config.db.profile;
  config.db.migration_table = "ProjectSchemaMigration";
  writeFile(configPath, JSON.stringify(config, null, 2));
  assert.throws(
    () => loadConfig(root),
    /db.migration_table must be a lowercase SQL identifier using \[a-z0-9_\]/
  );
});

test("loadConfig rejects invalid pack default edge config invariants", () => {
  const root = makeTempDir("mdkg-config-pack-edge-invariants-");
  const configPath = path.join(root, ".mdkg", "config.json");

  for (const [mutate, pattern] of [
    [
      (config: typeof BASE_CONFIG) => {
        config.pack.default_edges = ["parent", "unknown"];
      },
      /pack.default_edges\[1\] must be one of parent, epic, relates, blocked_by, blocks, prev, next/,
    ],
    [
      (config: typeof BASE_CONFIG) => {
        config.pack.default_edges = ["Parent"];
      },
      /pack.default_edges\[0\] must be lowercase/,
    ],
    [
      (config: typeof BASE_CONFIG) => {
        config.pack.default_edges = ["blocked-by"];
      },
      /pack.default_edges\[0\] must be one of parent, epic, relates, blocked_by, blocks, prev, next/,
    ],
    [
      (config: typeof BASE_CONFIG) => {
        config.pack.default_edges = ["relates", "relates"];
      },
      /pack.default_edges must not contain duplicate value "relates"/,
    ],
    [
      (config: typeof BASE_CONFIG) => {
        config.pack.default_edges = [" "];
      },
      /pack.default_edges\[0\] must not be empty/,
    ],
  ] as const) {
    const config = JSON.parse(JSON.stringify(BASE_CONFIG));
    mutate(config);
    writeFile(configPath, JSON.stringify(config, null, 2));

    assert.throws(() => loadConfig(root), pattern);
  }
});

test("loadConfig accepts empty pack default edge list", () => {
  const root = makeTempDir("mdkg-config-empty-default-edges-");
  const configPath = path.join(root, ".mdkg", "config.json");
  const config = JSON.parse(JSON.stringify(BASE_CONFIG));
  config.pack.default_edges = [];
  writeFile(configPath, JSON.stringify(config, null, 2));

  assert.deepEqual(loadConfig(root).pack.default_edges, []);
});

test("loadConfig rejects invalid status config invariants", () => {
  const root = makeTempDir("mdkg-config-status-invariants-");
  const configPath = path.join(root, ".mdkg", "config.json");

  for (const [mutate, pattern] of [
    [
      (config: typeof BASE_CONFIG) => {
        config.work.status_enum = [];
      },
      /work.status_enum must not be empty/,
    ],
    [
      (config: typeof BASE_CONFIG) => {
        config.work.status_enum = ["todo", "InProgress"];
      },
      /work.status_enum\[1\] must be lowercase/,
    ],
    [
      (config: typeof BASE_CONFIG) => {
        config.work.status_enum = ["todo", "todo"];
      },
      /work.status_enum must not contain duplicate value "todo"/,
    ],
    [
      (config: typeof BASE_CONFIG) => {
        config.work.status_enum = ["todo", " "];
      },
      /work.status_enum\[1\] must not be empty/,
    ],
    [
      (config: typeof BASE_CONFIG) => {
        config.work.next.status_preference = [];
      },
      /work.next.status_preference must not be empty/,
    ],
    [
      (config: typeof BASE_CONFIG) => {
        config.work.next.status_preference = ["progress", "Todo"];
      },
      /work.next.status_preference\[1\] must be lowercase/,
    ],
    [
      (config: typeof BASE_CONFIG) => {
        config.work.next.status_preference = ["progress", "progress"];
      },
      /work.next.status_preference must not contain duplicate value "progress"/,
    ],
    [
      (config: typeof BASE_CONFIG) => {
        config.work.next.status_preference = ["ready"];
      },
      /work.next.status_preference\[0\] must be listed in work.status_enum/,
    ],
    [
      (config: typeof BASE_CONFIG) => {
        config.work.next.strategy = "priority_only";
      },
      /work.next.strategy must be one of chain_then_priority/,
    ],
  ] as const) {
    const config = JSON.parse(JSON.stringify(BASE_CONFIG));
    mutate(config);
    writeFile(configPath, JSON.stringify(config, null, 2));

    assert.throws(() => loadConfig(root), pattern);
  }
});

test("loadConfig rejects configs that disable root-required operation", () => {
  const root = makeTempDir("mdkg-config-root-required-");
  const configPath = path.join(root, ".mdkg", "config.json");
  writeFile(configPath, JSON.stringify({ ...BASE_CONFIG, root_required: false }, null, 2));

  assert.throws(() => loadConfig(root), /root_required must be true/);
});

test("loadConfig rejects non-root workspaces that point at root path", () => {
  const root = makeTempDir("mdkg-config-non-root-root-path-");
  const configPath = path.join(root, ".mdkg", "config.json");
  writeFile(
    configPath,
    JSON.stringify(
      {
        ...BASE_CONFIG,
        workspaces: {
          ...BASE_CONFIG.workspaces,
          docs: {
            path: "./",
            enabled: true,
            mdkg_dir: ".mdkg",
          },
        },
      },
      null,
      2
    )
  );

  assert.throws(
    () => loadConfig(root),
    /workspaces\.docs\.path must not be "\." for non-root workspaces/
  );
});

test("loadConfig rejects duplicate registered workspace document roots", () => {
  const root = makeTempDir("mdkg-config-duplicate-doc-root-");
  const configPath = path.join(root, ".mdkg", "config.json");
  writeFile(
    configPath,
    JSON.stringify(
      {
        ...BASE_CONFIG,
        workspaces: {
          ...BASE_CONFIG.workspaces,
          docs: {
            path: "docs",
            enabled: true,
            mdkg_dir: ".mdkg",
          },
          docs_copy: {
            path: "docs/.",
            enabled: true,
            mdkg_dir: "./.mdkg",
          },
        },
      },
      null,
      2
    )
  );

  assert.throws(
    () => loadConfig(root),
    /workspaces\.docs_copy document root duplicates workspaces\.docs/
  );
});

test("loadConfig rejects missing or malformed root workspace", () => {
  const root = makeTempDir("mdkg-config-root-workspace-");
  const configPath = path.join(root, ".mdkg", "config.json");

  for (const [workspaces, pattern] of [
    [
      {
        docs: {
          path: "docs",
          enabled: true,
          mdkg_dir: ".mdkg",
        },
      },
      /workspaces\.root is required/,
    ],
    [
      {
        root: {
          path: "docs",
          enabled: true,
          mdkg_dir: ".mdkg",
        },
      },
      /workspaces\.root\.path must be "\."/,
    ],
    [
      {
        root: {
          path: ".",
          enabled: false,
          mdkg_dir: ".mdkg",
        },
      },
      /workspaces\.root\.enabled must be true/,
    ],
    [
      {
        root: {
          path: ".",
          enabled: true,
          mdkg_dir: "root-mdkg",
        },
      },
      /workspaces\.root\.mdkg_dir must be "\.mdkg"/,
    ],
  ] as const) {
    writeFile(
      configPath,
      JSON.stringify(
        {
          ...BASE_CONFIG,
          workspaces,
        },
        null,
        2
      )
    );

    assert.throws(() => loadConfig(root), pattern);
  }
});

test("loadConfig rejects malformed registered workspace aliases", () => {
  const root = makeTempDir("mdkg-config-workspace-alias-");
  const configPath = path.join(root, ".mdkg", "config.json");

  for (const [alias, pattern] of [
    ["Docs", /workspaces\.Docs alias must be lowercase and use \[a-z0-9_\]/],
    ["docs-team", /workspaces\.docs-team alias must be lowercase and use \[a-z0-9_\]/],
    ["1docs", /workspaces\.1docs alias must be lowercase and use \[a-z0-9_\]/],
    ["all", /workspaces\.all alias is reserved/],
  ] as const) {
    writeFile(
      configPath,
      JSON.stringify(
        {
          ...BASE_CONFIG,
          workspaces: {
            ...BASE_CONFIG.workspaces,
            [alias]: {
              path: "docs",
              enabled: true,
              mdkg_dir: ".mdkg",
            },
          },
        },
        null,
        2
      )
    );

    assert.throws(() => loadConfig(root), pattern);
  }
});

test("migrateConfig upgrades legacy root-only config deterministically", () => {
  const legacyConfig = { ...BASE_CONFIG } as Record<string, unknown>;
  delete legacyConfig.schema_version;
  delete legacyConfig.workspaces;

  const first = migrateConfig(legacyConfig);
  const second = migrateConfig(legacyConfig);

  assert.deepEqual(first, second);
  assert.equal(first.from, 0);
  assert.equal(first.to, LATEST_SCHEMA_VERSION);

  const migrated = first.config as Record<string, unknown>;
  assert.equal(migrated.schema_version, LATEST_SCHEMA_VERSION);
  assert.deepEqual(migrated.workspaces, {
    root: {
      path: ".",
      enabled: true,
      mdkg_dir: ".mdkg",
    },
  });
  assert.equal(legacyConfig.schema_version, undefined);
  assert.equal(legacyConfig.workspaces, undefined);
});

test("loadConfig rejects future schema_version clearly", () => {
  const root = makeTempDir("mdkg-config-");
  const configPath = path.join(root, ".mdkg", "config.json");
  writeFile(
    configPath,
    JSON.stringify({ ...BASE_CONFIG, schema_version: LATEST_SCHEMA_VERSION + 1 }, null, 2)
  );

  assert.throws(
    () => loadConfig(root),
    new RegExp(`schema_version ${LATEST_SCHEMA_VERSION + 1} is newer than supported`)
  );
});

test("loadConfig rejects non-integer schema_version", () => {
  const root = makeTempDir("mdkg-config-");
  const configPath = path.join(root, ".mdkg", "config.json");
  writeFile(configPath, JSON.stringify({ ...BASE_CONFIG, schema_version: 1.5 }, null, 2));

  assert.throws(() => loadConfig(root), /schema_version must be an integer/);
});

test("loadConfig rejects workspace paths that escape the repo root", () => {
  const root = makeTempDir("mdkg-config-");
  const configPath = path.join(root, ".mdkg", "config.json");

  for (const [field, value, pattern] of [
    ["path", "../outside", /workspaces.docs.path cannot contain parent-directory components/],
    ["path", path.join(root, "outside"), /workspaces.docs.path must be relative/],
    ["path", "docs\0bad", /workspaces.docs.path cannot contain NUL bytes/],
    [
      "mdkg_dir",
      "../.mdkg",
      /workspaces.docs.mdkg_dir cannot contain parent-directory components/,
    ],
    ["mdkg_dir", path.join(root, ".mdkg"), /workspaces.docs.mdkg_dir must be relative/],
    ["mdkg_dir", ".mdkg\0bad", /workspaces.docs.mdkg_dir cannot contain NUL bytes/],
  ] as const) {
    const workspace = {
      path: "docs",
      enabled: true,
      mdkg_dir: ".mdkg",
      [field]: value,
    };
    writeFile(
      configPath,
      JSON.stringify(
        {
          ...BASE_CONFIG,
          workspaces: {
            ...BASE_CONFIG.workspaces,
            docs: workspace,
          },
        },
        null,
        2
      )
    );

    assert.throws(() => loadConfig(root), pattern);
  }
});
