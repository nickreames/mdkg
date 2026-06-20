import crypto from "crypto";
import fs from "fs";
import path from "path";
import { loadConfig } from "../core/config";
import { loadIndex } from "../graph/index_cache";
import { IndexNode } from "../graph/indexer";
import { buildPack } from "../pack/pack";
import { measurePack } from "../pack/metrics";
import { PackNode, PackResult } from "../pack/types";
import { atomicWriteFile } from "../util/atomic";
import { NotFoundError, UsageError } from "../util/errors";
import { formatResolveError, resolveQid } from "../util/qid";
import { readPackageVersion } from "../core/version";

export type HandoffCreateCommandOptions = {
  root: string;
  id: string;
  ws?: string;
  out?: string;
  json?: boolean;
  depth?: number;
};

type RawMarkerWarning = {
  qid: string;
  path: string;
  marker_id: "raw_prompt" | "raw_payload" | "raw_secret";
  message: string;
};

const RAW_CONTENT_MARKERS: Array<{
  id: RawMarkerWarning["marker_id"];
  pattern: RegExp;
  description: string;
}> = [
  { id: "raw_prompt", pattern: /\bRAW_PROMPT_MARKER\b/i, description: "raw prompt marker" },
  { id: "raw_payload", pattern: /\bRAW_PAYLOAD_MARKER\b/i, description: "raw payload marker" },
  { id: "raw_secret", pattern: /\bRAW_SECRET_MARKER\b|BEGIN [A-Z ]*PRIVATE KEY|secret\s*=/i, description: "raw secret marker" },
];

function normalizeWorkspace(value?: string): string | undefined {
  if (!value || value === "all") {
    return undefined;
  }
  return value;
}

function outputPath(root: string, out?: string): string | undefined {
  if (!out) {
    return undefined;
  }
  const resolved = path.resolve(root, out);
  const rootWithSep = root.endsWith(path.sep) ? root : `${root}${path.sep}`;
  if (resolved !== root && !resolved.startsWith(rootWithSep)) {
    throw new UsageError("--out must stay within the repo root");
  }
  return resolved;
}

function sha256(value: string): string {
  return `sha256:${crypto.createHash("sha256").update(value).digest("hex")}`;
}

function listAttribute(node: IndexNode | PackNode, key: string): string[] {
  const value = "attributes" in node ? node.attributes[key] : undefined;
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function stringAttribute(node: IndexNode | PackNode, key: string): string | undefined {
  const value = "attributes" in node ? node.attributes[key] : undefined;
  return typeof value === "string" ? value : undefined;
}

function collectRawMarkerWarnings(pack: PackResult): RawMarkerWarning[] {
  const warnings: RawMarkerWarning[] = [];
  for (const node of pack.nodes) {
    for (const marker of RAW_CONTENT_MARKERS) {
      if (marker.pattern.test(node.body)) {
        warnings.push({
          qid: node.qid,
          path: node.path,
          marker_id: marker.id,
          message: `${marker.description} detected; handoff omitted raw body content for this node`,
        });
      }
    }
  }
  return warnings;
}

function nodeLine(node: PackNode): string {
  const parts = [`${node.qid}`, node.type, node.title];
  const state = [node.status, node.priority !== undefined ? `p${node.priority}` : undefined].filter(Boolean).join("/");
  if (state) {
    parts.push(state);
  }
  parts.push(node.path);
  return `- ${parts.join(" | ")}`;
}

function renderList(values: string[], empty = "- none"): string[] {
  if (values.length === 0) {
    return [empty];
  }
  return values.map((value) => `- ${value}`);
}

function renderNodeRefs(node: PackNode): string[] {
  const lines: string[] = [];
  if (node.refs.length > 0) {
    lines.push(`  refs: ${node.refs.join(", ")}`);
  }
  if (node.context_refs.length > 0) {
    lines.push(`  context_refs: ${node.context_refs.join(", ")}`);
  }
  if (node.evidence_refs.length > 0) {
    lines.push(`  evidence_refs: ${node.evidence_refs.join(", ")}`);
  }
  return lines;
}

function renderHandoff(params: {
  rootNode: PackNode;
  indexNode: IndexNode;
  pack: PackResult;
  rawWarnings: RawMarkerWarning[];
}): string {
  const { rootNode, indexNode, pack, rawWarnings } = params;
  const stats = measurePack(pack);
  const lines: string[] = [];
  const requiredChecks = listAttribute(indexNode, "required_checks");
  const requiredSkills = listAttribute(indexNode, "required_skills");
  const goalCondition = stringAttribute(indexNode, "goal_condition");
  const activeNode = stringAttribute(indexNode, "active_node");
  const lastActiveNode = stringAttribute(indexNode, "last_active_node");
  const latestCheckpoint = pack.meta.latest_checkpoint_qid
    ? pack.nodes.find((node) => node.qid === pack.meta.latest_checkpoint_qid)
    : undefined;

  lines.push("# mdkg Agent Handoff");
  lines.push("");
  lines.push("Use this handoff as a sanitized graph summary. Inspect source files before mutating durable state.");
  lines.push("");
  lines.push("## Target");
  lines.push(`- qid: ${rootNode.qid}`);
  lines.push(`- type: ${rootNode.type}`);
  lines.push(`- title: ${rootNode.title}`);
  if (rootNode.status) {
    lines.push(`- status: ${rootNode.status}`);
  }
  if (rootNode.priority !== undefined) {
    lines.push(`- priority: ${rootNode.priority}`);
  }
  lines.push(`- path: ${rootNode.path}`);
  if (goalCondition) {
    lines.push(`- goal_condition: ${goalCondition}`);
  }
  if (activeNode) {
    lines.push(`- active_node: ${activeNode}`);
  }
  if (lastActiveNode) {
    lines.push(`- last_active_node: ${lastActiveNode}`);
  }
  lines.push("");
  lines.push("## Boundaries");
  lines.push("- mdkg is durable semantic memory and graph state, not raw execution trace storage.");
  lines.push("- Do not include raw secrets, credentials, model prompts, provider payloads, cookies, tokens, or bulky runtime artifacts in mdkg nodes or handoffs.");
  lines.push("- Use refs, hashes, redacted summaries, archive links, artifact links, and checkpoints for evidence.");
  lines.push("- Treat subgraph nodes as read-only planning context unless you are operating in the owning repo.");
  lines.push("- Run validation before closing work or handing execution to another agent.");
  lines.push("");
  lines.push("## Recommended Next Steps");
  if (rootNode.type === "goal") {
    lines.push(`- Run \`mdkg goal current --json\` and \`mdkg goal next ${rootNode.id} --json\` to confirm routing.`);
    lines.push("- Claim one actionable local node before implementation with `mdkg goal claim <goal-id> <work-id> --json`.");
  } else {
    lines.push(`- Run \`mdkg show ${rootNode.id} --json\` and \`mdkg pack ${rootNode.id}\` to refresh local context.`);
    lines.push("- Use `mdkg task start|update|done` for lifecycle updates when the node is task-like.");
  }
  lines.push("- Keep detailed implementation notes in Markdown body sections, not CLI flags.");
  lines.push("");
  lines.push("## Required Checks");
  lines.push(...renderList(requiredChecks));
  lines.push("");
  lines.push("## Required Skills");
  lines.push(...renderList(requiredSkills));
  lines.push("");
  lines.push("## Latest Checkpoint");
  if (latestCheckpoint) {
    lines.push(nodeLine(latestCheckpoint));
  } else {
    lines.push("- none");
  }
  lines.push("");
  lines.push("## Included Graph Context");
  for (const node of pack.nodes) {
    lines.push(nodeLine(node));
    lines.push(...renderNodeRefs(node));
  }
  lines.push("");
  lines.push("## Raw Content Warnings");
  if (rawWarnings.length === 0) {
    lines.push("- none");
  } else {
    for (const warning of rawWarnings) {
      lines.push(`- ${warning.qid} (${warning.path}): ${warning.marker_id} - ${warning.message}`);
    }
  }
  lines.push("");
  lines.push("## Pack Summary");
  lines.push(`- generated_at: ${pack.meta.generated_at}`);
  lines.push(`- node_count: ${pack.nodes.length}`);
  lines.push(`- tokens_estimate: ${stats.totals.tokens_estimate}`);
  lines.push(`- truncated: max_nodes=${pack.meta.truncated.max_nodes} max_bytes=${pack.meta.truncated.max_bytes}`);
  if (pack.meta.truncated.dropped.length > 0) {
    lines.push(`- dropped: ${pack.meta.truncated.dropped.join(", ")}`);
  }
  lines.push("");
  lines.push("## Handoff Prompt");
  lines.push("Continue from the target above. Preserve the boundaries, verify current repo state, use mdkg commands for structured lifecycle changes, and record validation evidence before closeout.");
  lines.push("");
  return lines.join("\n");
}

export function runHandoffCreateCommand(options: HandoffCreateCommandOptions): void {
  if (!options.id) {
    throw new UsageError("mdkg handoff create requires <id-or-qid>");
  }
  const config = loadConfig(options.root);
  const ws = normalizeWorkspace(options.ws);
  if (ws && !config.workspaces[ws] && !config.subgraphs[ws]) {
    throw new NotFoundError(`workspace not found: ${ws}`);
  }
  const { index, stale, rebuilt, warnings } = loadIndex({
    root: options.root,
    config,
    useCache: true,
    allowReindex: true,
  });
  if (stale && !rebuilt) {
    console.error("warning: index is stale; run mdkg index to refresh");
  }
  for (const warning of warnings) {
    console.error(`warning: ${warning}`);
  }
  const resolved = resolveQid(index, options.id, ws);
  if (resolved.status !== "ok") {
    throw new NotFoundError(formatResolveError("id", options.id, resolved, ws));
  }
  const indexNode = index.nodes[resolved.qid];
  if (!indexNode) {
    throw new NotFoundError(`node not found: ${resolved.qid}`);
  }
  const depth = options.depth ?? config.pack.default_depth;
  if (!Number.isInteger(depth) || depth < 0) {
    throw new UsageError("--depth must be a non-negative integer");
  }
  const buildResult = buildPack({
    root: options.root,
    index,
    rootQid: resolved.qid,
    depth,
    edges: ["parent", "epic", "relates", "blocked_by", "blocks", "context_refs", "evidence_refs"],
    verbose: false,
    maxNodes: config.pack.limits.max_nodes,
    verboseCoreListPath: path.resolve(options.root, config.pack.verbose_core_list_path),
    wsHint: ws,
    includeLatestCheckpoint: true,
  });
  for (const warning of buildResult.warnings) {
    console.error(`warning: ${warning}`);
  }
  const rootNode = buildResult.pack.nodes[0];
  if (!rootNode) {
    throw new NotFoundError(`node not found: ${resolved.qid}`);
  }
  const rawWarnings = collectRawMarkerWarnings(buildResult.pack);
  const content = renderHandoff({
    rootNode,
    indexNode,
    pack: buildResult.pack,
    rawWarnings,
  });
  const contentHash = sha256(content);
  const outPath = outputPath(options.root, options.out);
  if (outPath) {
    atomicWriteFile(outPath, content);
  }
  const receipt = {
    action: "handoff-created",
    ok: true,
    mdkg_version: readPackageVersion(),
    target: {
      qid: rootNode.qid,
      id: rootNode.id,
      type: rootNode.type,
      title: rootNode.title,
      path: rootNode.path,
      status: rootNode.status,
    },
    output_path: outPath ? path.relative(options.root, outPath).split(path.sep).join("/") : null,
    content_sha256: contentHash,
    raw_marker_warning_count: rawWarnings.length,
    raw_marker_warnings: rawWarnings,
    latest_checkpoint_qid: buildResult.pack.meta.latest_checkpoint_qid ?? null,
    included_qids: buildResult.pack.nodes.map((node) => node.qid),
    pack: {
      node_count: buildResult.pack.nodes.length,
      generated_at: buildResult.pack.meta.generated_at,
      truncated: buildResult.pack.meta.truncated,
    },
    content,
  };
  if (options.json) {
    console.log(JSON.stringify(receipt, null, 2));
    return;
  }
  if (outPath) {
    console.log(`handoff written: ${outPath}`);
    console.log(`sha256: ${contentHash}`);
    if (rawWarnings.length > 0) {
      console.log(`raw marker warnings: ${rawWarnings.length}`);
    }
    return;
  }
  console.log(content);
}
