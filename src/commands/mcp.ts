import fs from "fs";
import path from "path";
import { Readable, Writable } from "stream";
import { StringDecoder } from "string_decoder";
import { collectStatus } from "./status";
import { collectValidateReceipt } from "./validate";
import { loadConfig } from "../core/config";
import { readPackageVersion } from "../core/version";
import { loadIndex } from "../graph/index_cache";
import { readNodeBody } from "../graph/node_body";
import { collectGoalScope, GOAL_SCOPE_ACTIONABLE_TYPES } from "../graph/goal_scope";
import { Index, IndexNode } from "../graph/indexer";
import { ALLOWED_TYPES } from "../graph/node";
import { loadTemplateHeadingMap } from "../templates/headings";
import { buildPack } from "../pack/pack";
import { applyPackBudgets } from "../pack/budget";
import { resolvePackProfile, shapePackBodies } from "../pack/profile";
import { filterNodes } from "../util/filter";
import { NotFoundError, UsageError } from "../util/errors";
import { formatResolveError, resolveQid } from "../util/qid";
import { sortNodesByQid, sortNodesForNext } from "../util/sort";
import { toNodeDetailJson, toNodeSummaryJson } from "./query_output";

const MCP_PROTOCOL_VERSION = "2025-06-18";
const SERVER_NAME = "mdkg";
const MAX_SEARCH_LIMIT = 100;
const DEFAULT_SEARCH_LIMIT = 20;
const MAX_PACK_NODES = 100;
const DEFAULT_PACK_NODES = 20;
const DEFAULT_PACK_MAX_CHARS = 120_000;
const MAX_MCP_LINE_BYTES = 1024 * 1024;
const MAX_MCP_JSON_DEPTH = 64;
const MAX_MCP_BATCH_ITEMS = 50;
const MAX_MCP_SHOW_BODY_BYTES = 256 * 1024;
const MAX_MCP_TOOL_PAYLOAD_BYTES = 512 * 1024;
const MAX_MCP_RESPONSE_BYTES = 1024 * 1024;

type JsonRpcId = string | number | null;
type JsonObject = Record<string, unknown>;

type JsonRpcRequest = {
  jsonrpc?: unknown;
  id?: unknown;
  method?: unknown;
  params?: unknown;
};

type JsonRpcResponse =
  | {
      jsonrpc: "2.0";
      id: JsonRpcId;
      result: unknown;
    }
  | {
      jsonrpc: "2.0";
      id: JsonRpcId;
      error: {
        code: number;
        message: string;
        data?: unknown;
      };
    };

export type McpServeCommandOptions = {
  root: string;
  stdio?: boolean;
  input?: Readable;
  output?: Writable;
};

type McpContext = {
  root: string;
};

type McpTool = {
  name: string;
  title: string;
  description: string;
  inputSchema: JsonObject;
  outputSchema?: JsonObject;
};

function objectSchema(properties: JsonObject, required: string[] = []): JsonObject {
  return {
    type: "object",
    additionalProperties: false,
    properties,
    required,
  };
}

const stringProp = (description: string): JsonObject => ({ type: "string", description });
const numberProp = (description: string): JsonObject => ({ type: "integer", description });
const booleanProp = (description: string): JsonObject => ({ type: "boolean", description });

const MCP_TOOLS: McpTool[] = [
  {
    name: "mdkg_status",
    title: "mdkg status",
    description: "Return read-only mdkg operator status for the selected root.",
    inputSchema: objectSchema({}),
  },
  {
    name: "mdkg_workspace_list",
    title: "mdkg workspace list",
    description: "List root workspaces and configured read-only subgraph aliases.",
    inputSchema: objectSchema({}),
  },
  {
    name: "mdkg_search",
    title: "mdkg search",
    description: "Search mdkg graph metadata across local and read-only subgraph indexes.",
    inputSchema: objectSchema(
      {
        query: stringProp("Search query."),
        ws: stringProp("Optional workspace or subgraph alias."),
        type: stringProp("Optional node type filter."),
        status: stringProp("Optional node status filter."),
        limit: numberProp("Maximum result count, capped at 100."),
      },
      ["query"]
    ),
  },
  {
    name: "mdkg_show",
    title: "mdkg show",
    description: "Show one mdkg node by local id, qid, or subgraph qid.",
    inputSchema: objectSchema(
      {
        id: stringProp("Node id or qid."),
        ws: stringProp("Optional workspace or subgraph alias hint."),
        meta_only: booleanProp("Return metadata without Markdown body."),
      },
      ["id"]
    ),
  },
  {
    name: "mdkg_pack",
    title: "mdkg pack",
    description: "Build a bounded in-memory context pack without writing .mdkg/pack files.",
    inputSchema: objectSchema(
      {
        id: stringProp("Pack root id or qid."),
        ws: stringProp("Optional workspace or subgraph alias hint."),
        profile: stringProp("Pack profile: standard, concise, or headers. Defaults to concise."),
        max_nodes: numberProp("Maximum node count, capped at 100."),
        max_chars: numberProp("Maximum estimated character budget. Defaults to 120000."),
      },
      ["id"]
    ),
  },
  {
    name: "mdkg_goal_current",
    title: "mdkg goal current",
    description: "Return the selected local goal or the unique active local root goal fallback.",
    inputSchema: objectSchema({ ws: stringProp("Optional local workspace alias.") }),
  },
  {
    name: "mdkg_goal_next",
    title: "mdkg goal next",
    description: "Return the next actionable local node inside a goal scope without mutating active_node.",
    inputSchema: objectSchema({
      id: stringProp("Optional goal id or qid. Defaults to selected or unique active goal."),
      ws: stringProp("Optional local workspace alias."),
    }),
  },
  {
    name: "mdkg_validate",
    title: "mdkg validate",
    description: "Return the read-only validation receipt for the selected root.",
    inputSchema: objectSchema({}),
  },
];

function toolDescription(tool: McpTool): JsonObject {
  return {
    name: tool.name,
    title: tool.title,
    description: tool.description,
    inputSchema: tool.inputSchema,
    ...(tool.outputSchema ? { outputSchema: tool.outputSchema } : {}),
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  };
}

function asObject(value: unknown): JsonObject {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return {};
  }
  return value as JsonObject;
}

function requireString(args: JsonObject, key: string): string {
  const value = args[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new UsageError(`${key} is required and must be a non-empty string`);
  }
  return value;
}

function optionalString(args: JsonObject, key: string): string | undefined {
  const value = args[key];
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new UsageError(`${key} must be a non-empty string`);
  }
  return value;
}

function optionalBoolean(args: JsonObject, key: string): boolean | undefined {
  const value = args[key];
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value !== "boolean") {
    throw new UsageError(`${key} must be a boolean`);
  }
  return value;
}

function optionalInteger(args: JsonObject, key: string): number | undefined {
  const value = args[key];
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new UsageError(`${key} must be an integer`);
  }
  return value;
}

function clampLimit(raw: number | undefined, fallback: number, max: number): number {
  if (raw === undefined) {
    return fallback;
  }
  if (raw < 1) {
    throw new UsageError("limit values must be positive integers");
  }
  return Math.min(raw, max);
}

function normalizeWorkspace(value?: string): string | undefined {
  if (!value || value === "all") {
    return undefined;
  }
  return value.toLowerCase();
}

function loadReadOnlyIndex(root: string): { config: ReturnType<typeof loadConfig>; index: Index } {
  const config = loadConfig(root);
  const { index } = loadIndex({
    root,
    config,
    useCache: false,
    allowReindex: false,
    includeImports: true,
  });
  return { config, index };
}

function ensureKnownWorkspace(
  config: ReturnType<typeof loadConfig>,
  ws: string | undefined
): string | undefined {
  if (!ws) {
    return undefined;
  }
  if (!config.workspaces[ws] && !config.subgraphs[ws]) {
    throw new NotFoundError(`workspace or subgraph not found: ${ws}`);
  }
  return ws;
}

function buildSearchText(node: IndexNode): string {
  const attributeTokens = Object.entries(node.attributes ?? {}).flatMap(([key, value]) => {
    if (Array.isArray(value)) {
      return [key, ...value.map((item) => String(item))];
    }
    return [key, String(value)];
  });
  return [
    node.id,
    node.qid,
    node.type,
    node.title,
    node.path,
    ...node.tags,
    ...node.owners,
    ...node.links,
    ...node.artifacts,
    ...node.refs,
    ...node.aliases,
    ...node.skills,
    ...attributeTokens,
  ]
    .join(" ")
    .toLowerCase();
}

function matchesSearch(node: IndexNode, terms: string[]): boolean {
  const haystack = buildSearchText(node);
  return terms.every((term) => haystack.includes(term));
}

function selectedGoalState(root: string): { qid: string; id: string; ws: string; selected_at: string } | undefined {
  const filePath = path.join(root, ".mdkg", "state", "selected-goal.json");
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")) as JsonObject;
    if (
      typeof parsed.qid === "string" &&
      typeof parsed.id === "string" &&
      typeof parsed.ws === "string" &&
      typeof parsed.selected_at === "string"
    ) {
      return {
        qid: parsed.qid.toLowerCase(),
        id: parsed.id.toLowerCase(),
        ws: parsed.ws.toLowerCase(),
        selected_at: parsed.selected_at,
      };
    }
  } catch {
    return undefined;
  }
  return undefined;
}

function activeGoalCandidates(index: Index, ws?: string): IndexNode[] {
  return Object.values(index.nodes)
    .filter((node) => node.type === "goal")
    .filter((node) => !node.source?.imported)
    .filter((node) => (ws ? node.ws === ws : true))
    .filter((node) => node.status === "progress" && node.attributes.goal_state === "active")
    .sort((a, b) => a.qid.localeCompare(b.qid));
}

function isArchivedGoal(node: IndexNode | undefined): boolean {
  return Boolean(
    node &&
      node.type === "goal" &&
      (node.status === "archived" || node.attributes.goal_state === "archived")
  );
}

function resolveGoal(
  root: string,
  index: Index,
  idOrQid: string | undefined,
  ws: string | undefined
): { source: "explicit" | "selected" | "unique_active"; node: IndexNode; warnings: string[] } {
  const warnings: string[] = [];
  if (idOrQid) {
    const resolved = resolveQid(index, idOrQid, ws);
    if (resolved.status !== "ok") {
      throw new NotFoundError(formatResolveError("goal", idOrQid, resolved, ws));
    }
    const node = index.nodes[resolved.qid];
    if (!node || node.type !== "goal") {
      throw new UsageError(`mdkg_goal_next requires a goal node; got ${idOrQid}`);
    }
    return { source: "explicit", node, warnings };
  }

  const selected = selectedGoalState(root);
  if (selected) {
    const node = index.nodes[selected.qid];
    if (node && (!ws || node.ws === ws)) {
      return { source: "selected", node, warnings };
    }
    warnings.push("selected goal is missing or outside the requested workspace");
  }

  const active = activeGoalCandidates(index, ws);
  if (active.length === 1) {
    return { source: "unique_active", node: active[0], warnings };
  }
  if (active.length > 1) {
    throw new UsageError(`multiple active local goals found: ${active.map((node) => node.qid).join(", ")}`);
  }
  throw new NotFoundError("no selected or active local goal found");
}

function isConcreteGoalCandidate(node: IndexNode, statusRanks: Set<string>): boolean {
  if (node.source?.imported) {
    return false;
  }
  if (!GOAL_SCOPE_ACTIONABLE_TYPES.has(node.type)) {
    return false;
  }
  if (!node.status || !statusRanks.has(node.status)) {
    return false;
  }
  return node.status !== "done" && node.status !== "archived";
}

function toolResult(payload: unknown, isError = false): JsonObject {
  const compact = JSON.stringify(payload);
  if (Buffer.byteLength(compact, "utf8") > MAX_MCP_TOOL_PAYLOAD_BYTES) {
    throw new UsageError(`MCP tool payload exceeds byte limit: ${MAX_MCP_TOOL_PAYLOAD_BYTES}`);
  }
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(payload, null, 2),
      },
    ],
    structuredContent: payload,
    isError,
  };
}

function listWorkspaces(root: string): JsonObject {
  const config = loadConfig(root);
  return {
    action: "mcp.workspace_list",
    root,
    workspaces: Object.entries(config.workspaces)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([alias, entry]) => ({
        alias,
        path: entry.path,
        mdkg_dir: entry.mdkg_dir,
        enabled: entry.enabled,
        visibility: entry.visibility,
      })),
    subgraphs: Object.entries(config.subgraphs)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([alias, entry]) => ({
        alias,
        enabled: entry.enabled,
        visibility: entry.visibility,
        permissions: [...entry.permissions],
        source_path: entry.source_path,
        source_repo: entry.source_repo,
        sources: entry.sources.map((source) => ({
          label: source.label,
          path: source.path,
          enabled: source.enabled,
          expected_profile: source.expected_profile,
        })),
      })),
  };
}

function searchTool(root: string, args: JsonObject): JsonObject {
  const query = requireString(args, "query");
  const type = optionalString(args, "type")?.toLowerCase();
  const status = optionalString(args, "status")?.toLowerCase();
  const limit = clampLimit(optionalInteger(args, "limit"), DEFAULT_SEARCH_LIMIT, MAX_SEARCH_LIMIT);
  const { config, index } = loadReadOnlyIndex(root);
  const ws = ensureKnownWorkspace(config, normalizeWorkspace(optionalString(args, "ws")));
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const matches = sortNodesByQid(
    filterNodes(Object.values(index.nodes), { ws, type, status }).filter((node) =>
      matchesSearch(node, terms)
    )
  );
  return {
    command: "mcp.search",
    query,
    count: matches.length,
    limit,
    truncated: matches.length > limit,
    items: matches.slice(0, limit).map(toNodeSummaryJson),
  };
}

function showTool(root: string, args: JsonObject): JsonObject {
  const id = requireString(args, "id");
  const metaOnly = optionalBoolean(args, "meta_only") ?? false;
  const { config, index } = loadReadOnlyIndex(root);
  const ws = ensureKnownWorkspace(config, normalizeWorkspace(optionalString(args, "ws")));
  const resolved = resolveQid(index, id, ws);
  if (resolved.status !== "ok") {
    throw new NotFoundError(formatResolveError("id", id, resolved, ws));
  }
  const node = index.nodes[resolved.qid];
  if (!node) {
    throw new NotFoundError(`node not found: ${id}`);
  }
  return {
    command: "mcp.show",
    item: toNodeDetailJson(
      node,
      metaOnly ? undefined : readNodeBody(root, node, MAX_MCP_SHOW_BODY_BYTES)
    ),
  };
}

function packTool(root: string, args: JsonObject): JsonObject {
  const id = requireString(args, "id");
  const profile = optionalString(args, "profile") ?? "concise";
  const maxNodes = clampLimit(optionalInteger(args, "max_nodes"), DEFAULT_PACK_NODES, MAX_PACK_NODES);
  const maxChars = clampLimit(optionalInteger(args, "max_chars"), DEFAULT_PACK_MAX_CHARS, DEFAULT_PACK_MAX_CHARS);
  const { config, index } = loadReadOnlyIndex(root);
  const ws = ensureKnownWorkspace(config, normalizeWorkspace(optionalString(args, "ws")));
  const resolved = resolveQid(index, id, ws);
  if (resolved.status !== "ok") {
    throw new NotFoundError(formatResolveError("id", id, resolved, ws));
  }
  const resolvedProfile = resolvePackProfile({ profile });
  const built = buildPack({
    root,
    index,
    rootQid: resolved.qid,
    depth: config.pack.default_depth,
    edges: [...config.pack.default_edges],
    verbose: false,
    maxNodes,
    verboseCoreListPath: path.resolve(root, config.pack.verbose_core_list_path),
    wsHint: ws,
    includeLatestCheckpoint: true,
    maxTraversalNodes: MAX_PACK_NODES * 10,
    maxBodyBytes: maxChars,
  });
  const headingMap =
    resolvedProfile.bodyMode === "summary"
      ? loadTemplateHeadingMap(root, config, Array.from(ALLOWED_TYPES))
      : {};
  const shaped = shapePackBodies(built.pack, { resolved: resolvedProfile, templateHeadingMap: headingMap });
  const budgeted = applyPackBudgets(shaped, { maxChars }, resolvedProfile.profile).pack;
  return {
    command: "mcp.pack",
    warnings: built.warnings,
    pack: budgeted,
  };
}

function goalCurrentTool(root: string, args: JsonObject): JsonObject {
  const { config, index } = loadReadOnlyIndex(root);
  const ws = ensureKnownWorkspace(config, normalizeWorkspace(optionalString(args, "ws")));
  const selected = selectedGoalState(root);
  const selectedNode = selected ? index.nodes[selected.qid] : undefined;
  if (selectedNode && (!ws || selectedNode.ws === ws)) {
    return {
      command: "mcp.goal_current",
      source: "selected",
      selected,
      goal: toNodeSummaryJson(selectedNode),
    };
  }
  const active = activeGoalCandidates(index, ws);
  return {
    command: "mcp.goal_current",
    source: active.length === 1 ? "unique_active" : "none",
    selected: selected ?? null,
    goal: active.length === 1 ? toNodeSummaryJson(active[0]) : null,
    active_count: active.length,
    active_goals: active.map(toNodeSummaryJson),
  };
}

function goalNextTool(root: string, args: JsonObject): JsonObject {
  const { config, index } = loadReadOnlyIndex(root);
  const ws = ensureKnownWorkspace(config, normalizeWorkspace(optionalString(args, "ws")));
  const loaded = resolveGoal(root, index, optionalString(args, "id"), ws);
  const warnings = [...loaded.warnings];
  if (isArchivedGoal(loaded.node)) {
    warnings.push(`${loaded.node.qid} is archived and has no actionable next work`);
    return {
      command: "mcp.goal_next",
      goal_source: loaded.source,
      goal: toNodeSummaryJson(loaded.node),
      node: null,
      warnings,
    };
  }
  if (loaded.node.status === "done" || String(loaded.node.attributes.goal_state ?? "") === "achieved") {
    return {
      command: "mcp.goal_next",
      goal_source: loaded.source,
      goal: toNodeSummaryJson(loaded.node),
      node: null,
      warnings,
    };
  }

  const statusPreference = config.work.next.status_preference.map((status) => status.toLowerCase());
  const statusRanks = new Set(statusPreference);
  const scope = collectGoalScope(index, loaded.node);
  for (const missing of scope.missingRefs) {
    warnings.push(`scope_refs references missing node: ${missing}`);
  }
  for (const invalid of scope.invalidRefs) {
    warnings.push(`scope contains non-actionable or unsupported node: ${invalid}`);
  }
  const activeNode = typeof loaded.node.attributes.active_node === "string"
    ? loaded.node.attributes.active_node
    : undefined;
  if (activeNode) {
    const resolved = resolveQid(index, activeNode, loaded.node.ws);
    const node = resolved.status === "ok" ? index.nodes[resolved.qid] : undefined;
    if (node && scope.actionableQids.has(node.qid) && isConcreteGoalCandidate(node, statusRanks)) {
      return {
        command: "mcp.goal_next",
        goal_source: loaded.source,
        goal: toNodeSummaryJson(loaded.node),
        node: toNodeSummaryJson(node),
        warnings,
      };
    }
    warnings.push(`active_node is not an actionable local concrete item: ${activeNode}`);
  }

  const candidates = Array.from(scope.actionableQids)
    .map((qid) => index.nodes[qid])
    .filter((node): node is IndexNode => Boolean(node))
    .filter((node) => isConcreteGoalCandidate(node, statusRanks));
  const selected = sortNodesForNext(candidates, {
    statusPreference,
    priorityMax: config.work.priority_max,
  })[0];
  return {
    command: "mcp.goal_next",
    goal_source: loaded.source,
    goal: toNodeSummaryJson(loaded.node),
    node: selected ? toNodeSummaryJson(selected) : null,
    warnings,
  };
}

function callTool(context: McpContext, name: string, args: JsonObject): JsonObject {
  switch (name) {
    case "mdkg_status":
      return toolResult(collectStatus(context.root));
    case "mdkg_workspace_list":
      return toolResult(listWorkspaces(context.root));
    case "mdkg_search":
      return toolResult(searchTool(context.root, args));
    case "mdkg_show":
      return toolResult(showTool(context.root, args));
    case "mdkg_pack":
      return toolResult(packTool(context.root, args));
    case "mdkg_goal_current":
      return toolResult(goalCurrentTool(context.root, args));
    case "mdkg_goal_next":
      return toolResult(goalNextTool(context.root, args));
    case "mdkg_validate":
      return toolResult(collectValidateReceipt({ root: context.root, json: true }));
    default:
      throw new UsageError(`Unknown tool: ${name}`);
  }
}

function jsonRpcError(id: JsonRpcId, code: number, message: string, data?: unknown): JsonRpcResponse {
  return {
    jsonrpc: "2.0",
    id,
    error: {
      code,
      message,
      ...(data === undefined ? {} : { data }),
    },
  };
}

function jsonRpcResult(id: JsonRpcId, result: unknown): JsonRpcResponse {
  return { jsonrpc: "2.0", id, result };
}

function requestId(value: unknown): JsonRpcId {
  if (typeof value === "string" || typeof value === "number" || value === null) {
    return value;
  }
  return null;
}

function errorCode(err: unknown): number {
  if (err instanceof UsageError) {
    return -32602;
  }
  if (err instanceof NotFoundError) {
    return -32004;
  }
  return -32000;
}

export function handleMcpRequest(context: McpContext, raw: JsonRpcRequest): JsonRpcResponse | undefined {
  const id = requestId(raw.id);
  if (raw.jsonrpc !== "2.0" || typeof raw.method !== "string") {
    return jsonRpcError(id, -32600, "Invalid Request");
  }
  if (raw.id === undefined && raw.method !== "notifications/initialized") {
    return undefined;
  }

  try {
    switch (raw.method) {
      case "initialize": {
        const params = asObject(raw.params);
        const requestedVersion =
          typeof params.protocolVersion === "string" ? params.protocolVersion : MCP_PROTOCOL_VERSION;
        return jsonRpcResult(id, {
          protocolVersion: requestedVersion === MCP_PROTOCOL_VERSION ? MCP_PROTOCOL_VERSION : MCP_PROTOCOL_VERSION,
          capabilities: {
            tools: {
              listChanged: false,
            },
          },
          serverInfo: {
            name: SERVER_NAME,
            title: "mdkg local read-only MCP server",
            version: readPackageVersion(),
          },
          instructions:
            "Read-only mdkg graph inspection over stdio. No mutation tools, shell execution, arbitrary file reads, SQL, or environment secret access are exposed.",
        });
      }
      case "notifications/initialized":
        return undefined;
      case "ping":
        return jsonRpcResult(id, {});
      case "tools/list":
        return jsonRpcResult(id, { tools: MCP_TOOLS.map(toolDescription) });
      case "tools/call": {
        const params = asObject(raw.params);
        if (typeof params.name !== "string" || params.name.trim().length === 0) {
          throw new UsageError("tools/call requires params.name");
        }
        return jsonRpcResult(
          id,
          callTool(context, params.name, asObject(params.arguments))
        );
      }
      default:
        return jsonRpcError(id, -32601, `Method not found: ${raw.method}`);
    }
  } catch (err) {
    return jsonRpcError(id, errorCode(err), err instanceof Error ? err.message : String(err));
  }
}

export function handleMcpMessage(context: McpContext, message: unknown): JsonRpcResponse[] {
  if (Array.isArray(message)) {
    if (message.length === 0 || message.length > MAX_MCP_BATCH_ITEMS) {
      return [jsonRpcError(null, -32600, `batch item count must be between 1 and ${MAX_MCP_BATCH_ITEMS}`)];
    }
    return message
      .map((item) => handleMcpRequest(context, item as JsonRpcRequest))
      .filter((item): item is JsonRpcResponse => Boolean(item));
  }
  const response = handleMcpRequest(context, message as JsonRpcRequest);
  return response ? [response] : [];
}

function jsonNestingWithinLimit(input: string): boolean {
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (const character of input) {
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === '"') {
        inString = false;
      }
      continue;
    }
    if (character === '"') {
      inString = true;
    } else if (character === "{" || character === "[") {
      depth += 1;
      if (depth > MAX_MCP_JSON_DEPTH) {
        return false;
      }
    } else if (character === "}" || character === "]") {
      depth -= 1;
    }
  }
  return true;
}

function writeBoundedMcpResponse(output: Writable, response: JsonRpcResponse): void {
  let serialized = JSON.stringify(response);
  if (Buffer.byteLength(serialized, "utf8") > MAX_MCP_RESPONSE_BYTES) {
    serialized = JSON.stringify(
      jsonRpcError(response.id, -32000, `MCP response exceeds byte limit: ${MAX_MCP_RESPONSE_BYTES}`)
    );
  }
  output.write(`${serialized}\n`);
}

export async function runMcpServeCommand(options: McpServeCommandOptions): Promise<0> {
  if (!options.stdio) {
    throw new UsageError("mdkg mcp serve requires --stdio");
  }
  const input = options.input ?? process.stdin;
  const output = options.output ?? process.stdout;
  const context: McpContext = { root: options.root };
  const decoder = new StringDecoder("utf8");
  let pending = "";
  let discardingOversizedLine = false;

  const processLine = (line: string): void => {
    const trimmed = line.trim();
    if (!trimmed) {
      return;
    }
    if (!jsonNestingWithinLimit(trimmed)) {
      writeBoundedMcpResponse(output, jsonRpcError(null, -32600, `JSON nesting exceeds limit: ${MAX_MCP_JSON_DEPTH}`));
      return;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      writeBoundedMcpResponse(output, jsonRpcError(null, -32700, "Parse error"));
      return;
    }
    for (const response of handleMcpMessage(context, parsed)) {
      writeBoundedMcpResponse(output, response);
    }
  };

  for await (const chunk of input) {
    const text = decoder.write(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
    let start = 0;
    for (let index = 0; index < text.length; index += 1) {
      if (text[index] !== "\n") {
        continue;
      }
      const segment = text.slice(start, index).replace(/\r$/, "");
      if (discardingOversizedLine) {
        discardingOversizedLine = false;
      } else if (Buffer.byteLength(pending, "utf8") + Buffer.byteLength(segment, "utf8") > MAX_MCP_LINE_BYTES) {
        writeBoundedMcpResponse(output, jsonRpcError(null, -32600, `request line exceeds byte limit: ${MAX_MCP_LINE_BYTES}`));
      } else {
        processLine(pending + segment);
      }
      pending = "";
      start = index + 1;
    }
    if (start < text.length && !discardingOversizedLine) {
      pending += text.slice(start);
      if (Buffer.byteLength(pending, "utf8") > MAX_MCP_LINE_BYTES) {
        pending = "";
        discardingOversizedLine = true;
        writeBoundedMcpResponse(output, jsonRpcError(null, -32600, `request line exceeds byte limit: ${MAX_MCP_LINE_BYTES}`));
      }
    }
  }
  pending += decoder.end();
  if (!discardingOversizedLine && pending.trim()) {
    processLine(pending);
  }
  return 0;
}
