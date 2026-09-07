import fs from "fs";
import path from "path";
import { Config } from "../core/config";
import { FrontmatterValue } from "./frontmatter";
import { ALLOWED_TYPES, parseNode } from "./node";
import { EdgeMap } from "./edges";
import { listWorkspaceDocFilesByAlias } from "./workspace_files";
import { collectGraphErrors, validateGraph } from "./validate_graph";
import { loadTemplateSchemas } from "./template_schema";
import { collectManifestSiblingConflicts } from "./agent_file_types";
import { assertNoGraphConflictMarkers, assertNodeFormat, GraphFormatV2, identityRef, NodeIdentity, readGraphFormat } from "./identity";
import { UsageError } from "../util/errors";
import { normalizeIndexIdentityReferences } from "./identity_refs";
import { buildSubgraphsIndex, mergeSubgraphsIntoIndex } from "./subgraphs";

export type IndexNode = {
  id: string;
  identity?: NodeIdentity;
  qid: string;
  alias_qid?: string;
  ws: string;
  type: string;
  title: string;
  status?: string;
  priority?: number;
  created: string;
  updated: string;
  tags: string[];
  owners: string[];
  links: string[];
  artifacts: string[];
  refs: string[];
  aliases: string[];
  skills: string[];
  attributes: Record<string, FrontmatterValue>;
  path: string;
  edges: EdgeMap;
  source?: {
    imported: boolean;
    read_only: boolean;
    subgraph_alias: string;
    original_qid: string;
    original_ws: string;
    original_path: string;
    bundle_path: string;
    bundle_hash?: string;
    profile?: string;
    visibility?: string;
    permissions?: string[];
    stale: boolean;
    warnings: string[];
    source_repo?: string;
    source_git_head?: string | null;
  };
};

export type Index = {
  meta: {
    tool: string;
    schema_version: number;
    generated_at: string;
    root: string;
    workspaces: string[];
    latest_checkpoint_qid?: Record<string, string>;
    graph_format?: GraphFormatV2;
    inspection_errors?: string[];
  };
  workspaces: Record<string, { path: string; enabled: boolean }>;
  nodes: Record<string, IndexNode>;
  reverse_edges: Record<string, Record<string, string[]>>;
};

export type IndexOptions = {
  tolerant?: boolean;
  inspection?: boolean;
};

function normalizeEdgeTarget(value: string, ws: string): string {
  if (value.includes(":")) {
    return value;
  }
  return `${ws}:${value}`;
}

function normalizeEdges(edges: EdgeMap, ws: string): EdgeMap {
  return {
    epic: edges.epic ? normalizeEdgeTarget(edges.epic, ws) : undefined,
    parent: edges.parent ? normalizeEdgeTarget(edges.parent, ws) : undefined,
    prev: edges.prev ? normalizeEdgeTarget(edges.prev, ws) : undefined,
    next: edges.next ? normalizeEdgeTarget(edges.next, ws) : undefined,
    relates: edges.relates.map((value) => normalizeEdgeTarget(value, ws)),
    blocked_by: edges.blocked_by.map((value) => normalizeEdgeTarget(value, ws)),
    blocks: edges.blocks.map((value) => normalizeEdgeTarget(value, ws)),
    context_refs: (edges.context_refs ?? []).map((value) => normalizeEdgeTarget(value, ws)),
    evidence_refs: (edges.evidence_refs ?? []).map((value) => normalizeEdgeTarget(value, ws)),
  };
}

function addReverseEdge(
  reverse: Record<string, Record<string, string[]>>,
  edgeKey: string,
  target: string,
  source: string
): void {
  if (!reverse[edgeKey]) {
    reverse[edgeKey] = {};
  }
  if (!reverse[edgeKey][target]) {
    reverse[edgeKey][target] = [];
  }
  reverse[edgeKey][target].push(source);
}

export function buildIndex(root: string, config: Config, options: IndexOptions = {}): Index {
  const graphFormat = readGraphFormat(root);
  const inspection = graphFormat.format_version === 2 && options.inspection === true;
  const tolerant = options.tolerant ?? config.index.tolerant;
  const templateSchemas = loadTemplateSchemas(root, config, ALLOWED_TYPES);
  const nodes: Record<string, IndexNode> = {};
  const idsByWorkspace: Record<string, Set<string>> = {};
  const identityPaths = new Map<string, string>();
  const docFilesByAlias = listWorkspaceDocFilesByAlias(root, config);
  const workspaceAliases = Object.keys(docFilesByAlias).sort();

  for (const alias of workspaceAliases) {
    idsByWorkspace[alias] = new Set();
    const files = docFilesByAlias[alias];
    const manifestConflicts = collectManifestSiblingConflicts(files, (dirPath) =>
      path.relative(root, dirPath).split(path.sep).join("/") || "."
    );
    if (manifestConflicts.length > 0 && !tolerant) {
      throw new Error(manifestConflicts[0]);
    }
    for (const filePath of files) {
      if (path.basename(filePath) === "core.md" && path.basename(path.dirname(filePath)) === "core") {
        continue;
      }
      try {
        const content = fs.readFileSync(filePath, "utf8");
        if (graphFormat.format_version === 2) assertNoGraphConflictMarkers(content, filePath);
        const node = parseNode(content, filePath, {
          workStatusEnum: config.work.status_enum,
          priorityMin: config.work.priority_min,
          priorityMax: config.work.priority_max,
          templateSchemas,
        });
        assertNodeFormat(graphFormat, node.identity, filePath);
        if (node.identity) {
          const ref = identityRef(node.identity);
          if (identityPaths.has(ref)) throw new Error(`duplicate immutable identity ${ref}: ${identityPaths.get(ref)} and ${filePath}`);
          identityPaths.set(ref, filePath);
        }

        const aliasQid = `${alias}:${node.id}`;
        const collision = idsByWorkspace[alias].has(node.id);
        if (collision) {
          if (!inspection) throw new Error(`duplicate id ${node.id} in workspace ${alias}; use read-only identity inspection and reviewed reconciliation`);
          const previous = nodes[aliasQid];
          if (previous?.identity) {
            delete nodes[aliasQid];
            previous.alias_qid = aliasQid;
            previous.qid = identityRef(previous.identity);
            nodes[previous.qid] = previous;
          }
        }
        idsByWorkspace[alias].add(node.id);

        const qid = collision && node.identity ? identityRef(node.identity) : aliasQid;
        const relPath = path.relative(root, filePath);
        const normalizedEdges = normalizeEdges(node.edges, alias);

        nodes[qid] = {
          id: node.id,
          ...(node.identity ? { identity: node.identity } : {}),
          qid,
          ...(collision ? { alias_qid: aliasQid } : {}),
          ws: alias,
          type: node.type,
          title: node.title,
          status: node.status,
          priority: node.priority,
          created: node.created,
          updated: node.updated,
          tags: node.tags,
          owners: node.owners,
          links: node.links,
          artifacts: node.artifacts,
          refs: node.refs,
          aliases: node.aliases,
          skills: node.skills,
          attributes: node.attributes,
          path: relPath,
          edges: normalizedEdges,
        };
      } catch (err) {
        if (!tolerant || graphFormat.format_version === 2 || err instanceof UsageError) {
          throw err;
        }
      }
    }
  }

  normalizeIndexIdentityReferences({ nodes });
  const reverse_edges: Record<string, Record<string, string[]>> = {};
  for (const [qid, node] of Object.entries(nodes)) {
    const edges = node.edges;
    if (edges.epic) {
      addReverseEdge(reverse_edges, "epic", edges.epic, qid);
    }
    if (edges.parent) {
      addReverseEdge(reverse_edges, "parent", edges.parent, qid);
    }
    if (edges.prev) {
      addReverseEdge(reverse_edges, "prev", edges.prev, qid);
    }
    if (edges.next) {
      addReverseEdge(reverse_edges, "next", edges.next, qid);
    }
    for (const target of edges.relates) {
      addReverseEdge(reverse_edges, "relates", target, qid);
    }
    for (const target of edges.blocked_by) {
      addReverseEdge(reverse_edges, "blocked_by", target, qid);
    }
    for (const target of edges.blocks) {
      addReverseEdge(reverse_edges, "blocks", target, qid);
    }
    for (const target of edges.context_refs ?? []) {
      addReverseEdge(reverse_edges, "context_refs", target, qid);
    }
    for (const target of edges.evidence_refs ?? []) {
      addReverseEdge(reverse_edges, "evidence_refs", target, qid);
    }
  }

  for (const edgeKey of Object.keys(reverse_edges)) {
    for (const target of Object.keys(reverse_edges[edgeKey])) {
      reverse_edges[edgeKey][target].sort();
    }
  }

  const workspaces: Record<string, { path: string; enabled: boolean }> = {};
  for (const alias of Object.keys(config.workspaces).sort()) {
    const entry = config.workspaces[alias];
    workspaces[alias] = { path: entry.path, enabled: entry.enabled };
  }

  const index: Index = {
    meta: {
      tool: config.tool,
      schema_version: config.schema_version,
      generated_at: new Date().toISOString(),
      root,
      workspaces: workspaceAliases,
      ...(graphFormat.format_version === 2 ? { graph_format: graphFormat } : {}),
    },
    workspaces,
    nodes,
    reverse_edges,
  };

  const validationOptions = {
    allowMissing: tolerant,
    externalWorkspaces: new Set(Object.keys(config.subgraphs ?? {})),
  };
  // A local v2 index remains local-owned, but reference validation must include
  // independently verified mounted identities before any index is persisted.
  const imports = graphFormat.format_version === 2 && Object.keys(config.subgraphs).length > 0
    ? buildSubgraphsIndex(root, config) : undefined;
  const importErrors = imports?.index.subgraphs.flatMap((entry) => entry.errors.map((error) => `subgraph ${entry.alias}: ${error}`)) ?? [];
  const validationIndex = imports ? mergeSubgraphsIntoIndex(index, imports) : index;
  if (inspection) {
    const errors = [...importErrors, ...collectGraphErrors(validationIndex, validationOptions)];
    if (errors.length > 0) index.meta.inspection_errors = errors;
  } else {
    if (importErrors.length) throw new UsageError(importErrors.join("; "));
    validateGraph(validationIndex, validationOptions);
  }

  const latestCheckpointByWorkspace: Record<string, string> = {};
  for (const alias of workspaceAliases) {
    const candidates = Object.values(nodes)
      .filter((node) => node.ws === alias && node.type === "checkpoint")
      .sort((a, b) => {
        if (a.updated !== b.updated) {
          return b.updated.localeCompare(a.updated);
        }
        if (a.created !== b.created) {
          return b.created.localeCompare(a.created);
        }
        return b.qid.localeCompare(a.qid);
      });
    if (candidates.length > 0) {
      latestCheckpointByWorkspace[alias] = candidates[0].qid;
    }
  }
  if (Object.keys(latestCheckpointByWorkspace).length > 0) {
    index.meta.latest_checkpoint_qid = latestCheckpointByWorkspace;
  }

  return index;
}
