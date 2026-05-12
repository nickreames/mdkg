import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
const {
  runWorkspaceAddCommand,
  runWorkspaceDisableCommand,
  runWorkspaceEnableCommand,
  runWorkspaceListCommand,
  runWorkspaceRemoveCommand,
} = require("../../commands/workspace");
import { makeTempDir, writeFile } from "../helpers/fs";

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

function captureConsoleLog(operation: () => void): string[] {
  const lines: string[] = [];
  const originalLog = console.log;
  console.log = (...args: unknown[]) => {
    lines.push(args.map(String).join(" "));
  };
  try {
    operation();
  } finally {
    console.log = originalLog;
  }
  return lines;
}

test("workspace add creates entry and directories", () => {
  const root = makeTempDir("mdkg-workspace-add-");
  writeConfig(root);

  runWorkspaceAddCommand({ root, alias: "polish", workspacePath: "polish" });

  const raw = JSON.parse(
    fs.readFileSync(path.join(root, ".mdkg", "config.json"), "utf8")
  );
  assert.ok(raw.workspaces.polish);
  assert.equal(raw.workspaces.polish.path, "polish");

  assert.ok(fs.existsSync(path.join(root, "polish", ".mdkg", "core")));
  assert.ok(fs.existsSync(path.join(root, "polish", ".mdkg", "design")));
  assert.ok(fs.existsSync(path.join(root, "polish", ".mdkg", "work")));
});

test("workspace add migrates legacy root-only config before writing", () => {
  const root = makeTempDir("mdkg-workspace-add-legacy-");
  writeConfig(root);
  const configPath = path.join(root, ".mdkg", "config.json");
  const raw = JSON.parse(fs.readFileSync(configPath, "utf8"));
  delete raw.schema_version;
  delete raw.workspaces;
  fs.writeFileSync(configPath, JSON.stringify(raw, null, 2), "utf8");

  runWorkspaceAddCommand({ root, alias: "docs", workspacePath: "docs" });

  const updated = JSON.parse(fs.readFileSync(configPath, "utf8"));
  assert.equal(updated.schema_version, 1);
  assert.deepEqual(Object.keys(updated.workspaces).sort(), ["docs", "root"]);
  assert.equal(updated.workspaces.root.path, ".");
  assert.equal(updated.workspaces.docs.path, "docs");
  assert.ok(fs.existsSync(path.join(root, "docs", ".mdkg", "work")));
});

test("workspace add rejects duplicate document roots before writing", () => {
  const root = makeTempDir("mdkg-workspace-duplicate-doc-root-");
  writeConfig(root);
  runWorkspaceAddCommand({ root, alias: "docs", workspacePath: "docs" });

  assert.throws(
    () =>
      runWorkspaceAddCommand({
        root,
        alias: "docs_copy",
        workspacePath: "docs/.",
        mdkgDir: "./.mdkg",
      }),
    /workspace document root already registered by docs/
  );

  const raw = JSON.parse(fs.readFileSync(path.join(root, ".mdkg", "config.json"), "utf8"));
  assert.equal(raw.workspaces.docs_copy, undefined);
  assert.deepEqual(Object.keys(raw.workspaces).sort(), ["docs", "root"]);
});

test("workspace add rejects paths that escape the repo root before writing", () => {
  const root = makeTempDir("mdkg-workspace-add-escape-");
  writeConfig(root);

  assert.throws(
    () => runWorkspaceAddCommand({ root, alias: "outside", workspacePath: "../outside" }),
    /workspace path cannot contain parent-directory components/
  );
  assert.throws(
    () => runWorkspaceAddCommand({ root, alias: "absolute", workspacePath: path.join(root, "docs") }),
    /workspace path must be relative/
  );
  assert.throws(
    () => runWorkspaceAddCommand({ root, alias: "nul", workspacePath: "docs\0bad" }),
    /workspace path cannot contain NUL bytes/
  );
  assert.throws(
    () =>
      runWorkspaceAddCommand({
        root,
        alias: "bad_mdkg",
        workspacePath: "docs",
        mdkgDir: "../.mdkg",
      }),
    /workspace mdkg dir cannot contain parent-directory components/
  );

  const raw = JSON.parse(fs.readFileSync(path.join(root, ".mdkg", "config.json"), "utf8"));
  assert.deepEqual(Object.keys(raw.workspaces), ["root"]);
  assert.equal(fs.existsSync(path.join(root, "docs")), false);
});

test("workspace rm deletes entry", () => {
  const root = makeTempDir("mdkg-workspace-rm-");
  writeConfig(root);
  runWorkspaceAddCommand({ root, alias: "polish", workspacePath: "polish" });

  runWorkspaceRemoveCommand({ root, alias: "polish" });

  const raw = JSON.parse(
    fs.readFileSync(path.join(root, ".mdkg", "config.json"), "utf8")
  );
  assert.ok(!raw.workspaces.polish);
});

test("workspace enable and disable update registered workspace state", () => {
  const root = makeTempDir("mdkg-workspace-toggle-");
  writeConfig(root);
  runWorkspaceAddCommand({ root, alias: "docs", workspacePath: "docs" });

  runWorkspaceDisableCommand({ root, alias: "docs" });

  const disabled = JSON.parse(
    fs.readFileSync(path.join(root, ".mdkg", "config.json"), "utf8")
  );
  assert.equal(disabled.workspaces.docs.enabled, false);
  assert.ok(fs.existsSync(path.join(root, "docs", ".mdkg", "work")));

  runWorkspaceEnableCommand({ root, alias: "docs" });

  const enabled = JSON.parse(
    fs.readFileSync(path.join(root, ".mdkg", "config.json"), "utf8")
  );
  assert.equal(enabled.workspaces.docs.enabled, true);
  assert.equal(enabled.workspaces.docs.path, "docs");
  assert.equal(enabled.workspaces.docs.mdkg_dir, ".mdkg");
});

test("workspace ls json prints deterministic registered workspace payload", () => {
  const root = makeTempDir("mdkg-workspace-list-json-");
  writeConfig(root);
  runWorkspaceAddCommand({ root, alias: "docs", workspacePath: "docs" });
  runWorkspaceAddCommand({
    root,
    alias: "api",
    workspacePath: "api",
    mdkgDir: ".knowledge",
  });
  runWorkspaceDisableCommand({ root, alias: "docs" });

  const lines = captureConsoleLog(() => {
    runWorkspaceListCommand({ root, json: true });
  });

  assert.equal(lines.length, 1);
  assert.deepEqual(JSON.parse(lines[0]), {
    workspaces: [
      { alias: "api", path: "api", enabled: true, mdkg_dir: ".knowledge" },
      { alias: "docs", path: "docs", enabled: false, mdkg_dir: ".mdkg" },
      { alias: "root", path: ".", enabled: true, mdkg_dir: ".mdkg" },
    ],
  });
});

test("workspace mutation commands print deterministic json receipts", () => {
  const root = makeTempDir("mdkg-workspace-mutation-json-");
  writeConfig(root);

  const addLines = captureConsoleLog(() => {
    runWorkspaceAddCommand({
      root,
      alias: "docs",
      workspacePath: "docs",
      mdkgDir: ".knowledge",
      json: true,
    });
  });
  assert.deepEqual(JSON.parse(addLines[0]), {
    action: "added",
    workspace: {
      alias: "docs",
      path: "docs",
      enabled: true,
      mdkg_dir: ".knowledge",
    },
  });

  const disableLines = captureConsoleLog(() => {
    runWorkspaceDisableCommand({ root, alias: "docs", json: true });
  });
  assert.deepEqual(JSON.parse(disableLines[0]), {
    action: "disabled",
    workspace: {
      alias: "docs",
      path: "docs",
      enabled: false,
      mdkg_dir: ".knowledge",
    },
  });

  const enableLines = captureConsoleLog(() => {
    runWorkspaceEnableCommand({ root, alias: "docs", json: true });
  });
  assert.deepEqual(JSON.parse(enableLines[0]), {
    action: "enabled",
    workspace: {
      alias: "docs",
      path: "docs",
      enabled: true,
      mdkg_dir: ".knowledge",
    },
  });

  const removeLines = captureConsoleLog(() => {
    runWorkspaceRemoveCommand({ root, alias: "docs", json: true });
  });
  assert.deepEqual(JSON.parse(removeLines[0]), {
    action: "removed",
    workspace: {
      alias: "docs",
      path: "docs",
      enabled: true,
      mdkg_dir: ".knowledge",
    },
  });

  const raw = JSON.parse(fs.readFileSync(path.join(root, ".mdkg", "config.json"), "utf8"));
  assert.equal(raw.workspaces.docs, undefined);
});
