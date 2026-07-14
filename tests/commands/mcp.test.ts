import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
const { handleMcpRequest } = require("../../commands/mcp") as {
  handleMcpRequest: (context: { root: string }, raw: Record<string, unknown>) => any;
};
const { runMcpServeCommand } = require("../../commands/mcp") as {
  runMcpServeCommand: (options: { root: string; stdio: boolean; input: NodeJS.ReadableStream; output: NodeJS.WritableStream }) => Promise<number>;
};
import { Readable, Writable } from "node:stream";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";

const cliPath = path.resolve(__dirname, "..", "..", "cli.js");

function run(root: string, args: string[]) {
  const result = spawnSync(process.execPath, [cliPath, ...args], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, `${args.join(" ")}\n${result.stdout}\n${result.stderr}`);
  return result;
}

function writeWork(
  root: string,
  type: "goal" | "task" | "spike",
  id: string,
  title: string,
  status: string,
  extra: string[] = []
): void {
  writeFile(
    path.join(root, ".mdkg", "work", `${id}.md`),
    [
      "---",
      `id: ${id}`,
      `type: ${type}`,
      `title: ${title}`,
      `status: ${status}`,
      "priority: 1",
      ...extra,
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
      `# ${title}`,
      "",
      "MCP fixture body.",
    ].join("\n")
  );
}

function createMcpRepo(): string {
  const root = makeTempDir("mdkg-mcp-");
  writeRootConfig(root);
  writeDefaultTemplates(root);
  writeFile(path.join(root, ".mdkg", "core", "core.md"), "# Core\n");
  writeWork(root, "goal", "goal-1", "MCP release goal", "progress", [
    "goal_state: active",
    "goal_condition: MCP smoke passes",
    "scope_refs: [task-1, spike-1]",
    "active_node: task-1",
    "required_skills: []",
    "required_checks: [npm run build]",
  ]);
  writeWork(root, "task", "task-1", "MCP inspect task", "todo", ["parent: goal-1"]);
  writeWork(root, "spike", "spike-1", "MCP research spike", "todo", ["parent: goal-1"]);
  run(root, ["index"]);
  return root;
}

function callTool(root: string, name: string, args: Record<string, unknown> = {}) {
  return handleMcpRequest(
    { root },
    {
      jsonrpc: "2.0",
      id: `${name}-1`,
      method: "tools/call",
      params: { name, arguments: args },
    }
  );
}

function structured(response: any): any {
  assert.equal(response.jsonrpc, "2.0");
  assert.ok(!response.error, JSON.stringify(response.error));
  return response.result.structuredContent;
}

test("mcp initialize and tools/list advertise read-only mdkg tools", () => {
  const root = createMcpRepo();
  const initialized = handleMcpRequest(
    { root },
    {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "0" } },
    }
  );
  assert.equal(initialized.result.protocolVersion, "2025-06-18");
  assert.equal(initialized.result.serverInfo.name, "mdkg");
  assert.deepEqual(initialized.result.capabilities, { tools: { listChanged: false } });

  const listed = handleMcpRequest({ root }, { jsonrpc: "2.0", id: 2, method: "tools/list" });
  const tools = listed.result.tools as Array<{ name: string; annotations: Record<string, unknown> }>;
  assert.deepEqual(
    tools.map((tool) => tool.name),
    [
      "mdkg_status",
      "mdkg_workspace_list",
      "mdkg_search",
      "mdkg_show",
      "mdkg_pack",
      "mdkg_goal_current",
      "mdkg_goal_next",
      "mdkg_validate",
    ]
  );
  assert.ok(tools.every((tool) => tool.annotations.readOnlyHint === true));
  assert.ok(tools.every((tool) => tool.annotations.destructiveHint === false));
  assert.ok(!tools.some((tool) => /task|activate|archive|graph_import|queue|shell|sql/i.test(tool.name)));
});

test("mcp read-only tools inspect local graph state without writes", () => {
  const root = createMcpRepo();
  const beforeFiles = new Set(fs.readdirSync(path.join(root, ".mdkg", "work")).sort());

  const search = structured(callTool(root, "mdkg_search", { query: "MCP inspect", limit: 5 }));
  assert.equal(search.command, "mcp.search");
  assert.equal(search.count, 1);
  assert.equal(search.items[0].qid, "root:task-1");

  const show = structured(callTool(root, "mdkg_show", { id: "task-1" }));
  assert.equal(show.command, "mcp.show");
  assert.equal(show.item.id, "task-1");
  assert.match(show.item.body, /MCP fixture body/);

  const pack = structured(callTool(root, "mdkg_pack", { id: "goal-1", max_nodes: 5 }));
  assert.equal(pack.command, "mcp.pack");
  assert.equal(pack.pack.meta.root, "root:goal-1");
  assert.ok(pack.pack.nodes.length >= 2);

  const current = structured(callTool(root, "mdkg_goal_current"));
  assert.equal(current.command, "mcp.goal_current");
  assert.equal(current.goal.qid, "root:goal-1");

  const next = structured(callTool(root, "mdkg_goal_next"));
  assert.equal(next.command, "mcp.goal_next");
  assert.equal(next.node.qid, "root:task-1");

  const validate = structured(callTool(root, "mdkg_validate"));
  assert.equal(validate.action, "validated");
  assert.equal(validate.ok, true);

  const workFilesAfter = new Set(fs.readdirSync(path.join(root, ".mdkg", "work")).sort());
  assert.deepEqual(workFilesAfter, beforeFiles);
});

test("mcp goal next returns null for achieved goals without stale active-node warnings", () => {
  const root = createMcpRepo();
  const goalPath = path.join(root, ".mdkg", "work", "goal-1.md");
  const content = fs.readFileSync(goalPath, "utf8")
    .replace("status: progress", "status: done")
    .replace("goal_state: active", "goal_state: achieved");
  fs.writeFileSync(goalPath, content, "utf8");
  run(root, ["index"]);

  const next = structured(callTool(root, "mdkg_goal_next", { id: "goal-1" }));
  assert.equal(next.command, "mcp.goal_next");
  assert.equal(next.node, null);
  assert.ok(!next.warnings.some((warning: string) => warning.includes("active_node")));
});

test("mcp workspace list includes configured subgraphs and unknown mutation tools fail closed", () => {
  const root = createMcpRepo();
  const configPath = path.join(root, ".mdkg", "config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  config.subgraphs.child_demo = {
    enabled: true,
    visibility: "private",
    permissions: ["read"],
    source_path: "projects/child_demo",
    source_repo: "child-demo",
    max_stale_seconds: 3600,
    sources: [
      {
        label: "child_demo",
        path: ".mdkg/bundles/private/subgraphs/child_demo.mdkg.zip",
        enabled: true,
        expected_profile: "private",
      },
    ],
  };
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");

  const workspaceList = structured(callTool(root, "mdkg_workspace_list"));
  assert.equal(workspaceList.action, "mcp.workspace_list");
  assert.equal(workspaceList.workspaces[0].alias, "root");
  assert.equal(workspaceList.subgraphs[0].alias, "child_demo");
  assert.deepEqual(workspaceList.subgraphs[0].permissions, ["read"]);

  const unknown = callTool(root, "mdkg_task_update", { id: "task-1", status: "done" });
  assert.equal(unknown.jsonrpc, "2.0");
  assert.equal(unknown.error.code, -32602);
  assert.match(unknown.error.message, /Unknown tool/);

  const invalid = handleMcpRequest({ root }, { jsonrpc: "2.0", id: 9, method: "tools/call", params: {} });
  assert.equal(invalid.error.code, -32602);
  assert.match(invalid.error.message, /params.name/);
});

test("mcp bounds request lines nesting batches and node bodies", async () => {
  const root = createMcpRepo();
  const taskPath = path.join(root, ".mdkg", "work", "task-1.md");
  fs.appendFileSync(taskPath, `\n${"x".repeat(256 * 1024)}\n`, "utf8");
  const oversizedBody = callTool(root, "mdkg_show", { id: "task-1" });
  assert.ok(oversizedBody.error);
  assert.match(oversizedBody.error.message, /byte limit/);

  const deep = `${"[".repeat(65)}0${"]".repeat(65)}`;
  const batch = JSON.stringify(Array.from({ length: 51 }, (_, id) => ({ jsonrpc: "2.0", id, method: "ping" })));
  const oversizedLine = `${" ".repeat(1024 * 1024 + 1)}\n`;
  const chunks: string[] = [];
  const output = new Writable({
    write(chunk, _encoding, callback) {
      chunks.push(chunk.toString());
      callback();
    },
  });
  await runMcpServeCommand({
    root,
    stdio: true,
    input: Readable.from([`${deep}\n${batch}\n`, oversizedLine]),
    output,
  });
  const responses = chunks.join("").trim().split(/\r?\n/).map((line) => JSON.parse(line));
  assert.ok(responses.some((response) => /nesting exceeds/.test(response.error?.message ?? "")));
  assert.ok(responses.some((response) => /batch item count/.test(response.error?.message ?? "")));
  assert.ok(responses.some((response) => /request line exceeds/.test(response.error?.message ?? "")));
});
