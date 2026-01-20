import { test } from "node:test";
import assert from "node:assert/strict";
import path from "path";
const { runNextCommand } = require("../../commands/next");
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeDefaultTemplates } from "../helpers/templates";

type TaskOptions = {
  id: string;
  type: string;
  title: string;
  status?: string;
  priority?: number;
  prev?: string;
  next?: string;
  wsPath?: string;
};

function writeConfig(root: string, withAlpha = false): void {
  const workspaces: Record<string, { path: string; enabled: boolean; mdkg_dir: string }> = {
    root: { path: ".", enabled: true, mdkg_dir: ".mdkg" },
  };
  if (withAlpha) {
    workspaces.alpha = { path: "alpha", enabled: true, mdkg_dir: ".mdkg" };
  }

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
    workspaces,
  };

  writeFile(path.join(root, ".mdkg", "config.json"), JSON.stringify(config, null, 2));
}

function writeTask(root: string, options: TaskOptions): void {
  const wsPath = options.wsPath ?? ".";
  const base = wsPath === "." ? root : path.join(root, wsPath);
  const lines: string[] = [
    "---",
    `id: ${options.id}`,
    `type: ${options.type}`,
    `title: ${options.title}`,
  ];
  if (options.status) {
    lines.push(`status: ${options.status}`);
  }
  if (options.priority !== undefined) {
    lines.push(`priority: ${options.priority}`);
  }
  if (options.prev) {
    lines.push(`prev: ${options.prev}`);
  }
  if (options.next) {
    lines.push(`next: ${options.next}`);
  }
  lines.push(
    "tags: []",
    "owners: []",
    "links: []",
    "artifacts: []",
    "relates: []",
    "blocked_by: []",
    "blocks: []",
    "refs: []",
    "aliases: []",
    "created: 2026-01-06",
    "updated: 2026-01-06",
    "---",
    ""
  );

  writeFile(
    path.join(base, ".mdkg", "work", `${options.id}.md`),
    lines.join("\n")
  );
}

function captureConsole(fn: () => void): { logs: string[]; errors: string[] } {
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
    fn();
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
  return { logs, errors };
}

test("runNextCommand follows next across workspaces", () => {
  const root = makeTempDir("mdkg-next-chain-");
  writeConfig(root, true);
  writeDefaultTemplates(root);

  writeTask(root, {
    id: "task-1",
    type: "task",
    title: "Root task",
    status: "todo",
    priority: 2,
    next: "alpha:task-2",
  });
  writeTask(root, {
    id: "task-2",
    type: "task",
    title: "Alpha task",
    status: "todo",
    priority: 1,
    prev: "root:task-1",
    wsPath: "alpha",
  });

  const { logs, errors } = captureConsole(() => {
    runNextCommand({ root, id: "task-1", ws: "root" });
  });

  assert.equal(errors.length, 0);
  assert.equal(logs.length, 1);
  assert.ok(logs[0].includes("alpha:task-2"));
});

test("runNextCommand falls back to priority selection and excludes epic/checkpoint/done", () => {
  const root = makeTempDir("mdkg-next-fallback-");
  writeConfig(root);
  writeDefaultTemplates(root);

  writeTask(root, {
    id: "task-0",
    type: "task",
    title: "Seed task",
    status: "done",
    priority: 0,
  });
  writeTask(root, {
    id: "task-1",
    type: "task",
    title: "Priority zero",
    status: "backlog",
    priority: 1,
  });
  writeTask(root, {
    id: "task-2",
    type: "task",
    title: "Lower priority",
    status: "progress",
    priority: 2,
  });
  writeTask(root, {
    id: "epic-1",
    type: "epic",
    title: "Epic zero",
    status: "progress",
    priority: 0,
  });
  writeTask(root, {
    id: "chk-1",
    type: "checkpoint",
    title: "Checkpoint zero",
    status: "progress",
    priority: 0,
  });

  const { logs } = captureConsole(() => {
    runNextCommand({ root, id: "task-0" });
  });

  assert.equal(logs.length, 1);
  assert.ok(logs[0].includes("root:task-1"));
});

test("runNextCommand orders by status preference and treats missing priority as lowest", () => {
  const root = makeTempDir("mdkg-next-status-");
  writeConfig(root);
  writeDefaultTemplates(root);

  writeTask(root, {
    id: "task-1",
    type: "task",
    title: "Todo",
    status: "todo",
    priority: 2,
  });
  writeTask(root, {
    id: "task-2",
    type: "task",
    title: "Progress",
    status: "progress",
    priority: 2,
  });
  writeTask(root, {
    id: "task-3",
    type: "task",
    title: "No priority",
    status: "progress",
  });

  const { logs } = captureConsole(() => {
    runNextCommand({ root });
  });

  assert.equal(logs.length, 1);
  assert.ok(logs[0].includes("root:task-2"));
});

test("runNextCommand respects workspace filtering for priority selection", () => {
  const root = makeTempDir("mdkg-next-ws-");
  writeConfig(root, true);
  writeDefaultTemplates(root);

  writeTask(root, {
    id: "task-1",
    type: "task",
    title: "Root task",
    status: "progress",
    priority: 0,
  });
  writeTask(root, {
    id: "task-1",
    type: "task",
    title: "Alpha task",
    status: "progress",
    priority: 1,
    wsPath: "alpha",
  });

  const { logs } = captureConsole(() => {
    runNextCommand({ root, ws: "alpha" });
  });

  assert.equal(logs.length, 1);
  assert.ok(logs[0].includes("alpha:task-1"));
});

test("runNextCommand prints a prompt and exits when no candidates exist", () => {
  const root = makeTempDir("mdkg-next-empty-");
  writeConfig(root);
  writeDefaultTemplates(root);

  const { logs, errors } = captureConsole(() => {
    runNextCommand({ root });
  });

  assert.equal(logs.length, 0);
  assert.equal(errors.length, 1);
  assert.ok(errors[0].includes("no matching work items found"));
});

test("runNextCommand ignores done-only work items", () => {
  const root = makeTempDir("mdkg-next-done-only-");
  writeConfig(root);
  writeDefaultTemplates(root);

  writeTask(root, {
    id: "task-1",
    type: "task",
    title: "Done task",
    status: "done",
    priority: 0,
  });
  writeTask(root, {
    id: "bug-1",
    type: "bug",
    title: "Done bug",
    status: "done",
    priority: 1,
  });
  writeTask(root, {
    id: "feat-1",
    type: "feat",
    title: "Done feat",
    status: "done",
    priority: 2,
  });

  const { logs, errors } = captureConsole(() => {
    runNextCommand({ root });
  });

  assert.equal(logs.length, 0);
  assert.equal(errors.length, 1);
  assert.ok(errors[0].includes("no matching work items found"));
});
