import path from "path";
import { writeFile } from "./fs";

export function writeRootConfig(root: string): void {
  const config = {
    schema_version: 1,
    tool: "mdkg",
    root_required: true,
    archive: {
      large_cache_warning_bytes: 26214400,
    },
    index: {
      auto_reindex: true,
      tolerant: false,
      backend: "json",
      global_index_path: ".mdkg/index/global.json",
      sqlite_path: ".mdkg/index/mdkg.sqlite",
      sqlite_commit_warning_bytes: 52428800,
      lock_timeout_ms: 10000,
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
  writeFile(path.join(root, ".mdkg", "config.json"), JSON.stringify(config, null, 2));
}
