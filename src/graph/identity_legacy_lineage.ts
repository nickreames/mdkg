import path from "path";
import { UsageError } from "../util/errors";
import { canonicalJson, identityHash } from "./identity";
import { assertCompleteIdentityHistory } from "./identity_history";
import { AuthoredNode, AuthoredSnapshot, readAuthoredSnapshot, readGraphGit } from "./identity_snapshot";
import { getWorkspaceDocRoots } from "./workspace_files";
import { workspaceDocumentOwner } from "./workspace_ownership";
import { ALLOWED_TYPES, parseNode } from "./node";
import { loadTemplateSchemas } from "./template_schema";
import { validateConfigSchema } from "../core/config";

export type LegacyLineageEvidence = {
  schema_version: 1;
  ancestor: string;
  head: string;
  revisions: Array<{ revision: string; parents: string[]; tree_hash: string; descends_from_ancestor: boolean }>;
};
export type LegacyContinuity = {
  qid: string;
  reasons: string[];
  observations: Array<{ at: string; nodes: Array<{ path: string; type: string; hash: string }> }>;
};

// Same existing bounded-history contract as v2 reconciliation. Inspect the full
// reachable interval, not first-parent or --ancestry-path: a merged side branch
// may have forked before the accepted ancestor. Boundary parents matter too.
function revisionInventory(root: string, ancestor: string, head: string): Map<string, string[]> {
  assertCompleteIdentityHistory(root);
  const rows = readGraphGit(root, ["rev-list", "--parents", "--max-count=2049", `${ancestor}..${head}`])!
    .trim().split("\n").filter(Boolean);
  if (rows.length > 2048) throw new UsageError("legacy identity history exceeds the bounded review limit; explicit history audit required");
  const result = new Map<string, string[]>([[ancestor, []]]);
  for (const row of rows) {
    const [revision, ...parents] = row.split(" ");
    if (![revision, ...parents].every((id) => /^[0-9a-f]{40,64}$/.test(id))) throw new UsageError("unclassifiable legacy history inventory");
    result.set(revision, parents);
  }
  for (const parents of [...result.values()]) for (const parent of parents) {
    if (!result.has(parent)) result.set(parent, []);
  }
  if (result.size > 4096) throw new UsageError("legacy identity parent inventory exceeds the bounded review limit");
  if (!result.has(head)) throw new UsageError("legacy history is missing its current HEAD");
  return new Map([...result].sort(([a], [b]) => a.localeCompare(b)));
}

// Read stage-0 objects directly. No write-tree, temporary index, checkout or
// staging side effect. A staged deletion followed by an unstaged recreation is
// observable here even though HEAD and the worktree alone appear continuous.
function stagedNodes(root: string, current: AuthoredSnapshot): AuthoredNode[] {
  const listing = readGraphGit(root, ["ls-files", "--stage", "-z"])!;
  const roots = getWorkspaceDocRoots(root, current.config).map((ws) => ({ ...ws,
    relative: path.relative(root, ws.root).split(path.sep).join("/") }));
  const owner = workspaceDocumentOwner(current.config);
  const templates = loadTemplateSchemas(root, current.config, ALLOWED_TYPES);
  const nodes: AuthoredNode[] = [];
  let total = 0;
  for (const row of listing.split("\0").filter(Boolean)) {
    const match = /^(\d+) ([0-9a-f]+) (\d)\t([\s\S]+)$/.exec(row);
    if (!match) throw new UsageError("unclassifiable staged legacy graph input");
    const [, mode, object, stage, file] = match;
    const workspace = roots.find((ws) => owner(file) === ws.alias &&
      /^(core|design|work|archive)\/[\s\S]+\.md$/.test(path.posix.relative(ws.relative, file)));
    const local = workspace ? path.posix.relative(workspace.relative, file) : "";
    const config = file === ".mdkg/config.json";
    if (!config && (!workspace || local === "core/core.md" || (local.startsWith("archive/") && local.split("/").includes("source")))) continue;
    if (stage !== "0" || !/^100(644|755)$/.test(mode)) throw new UsageError(`unmerged or non-regular legacy provenance input: ${file}`);
    const size = Number(readGraphGit(root, ["cat-file", "-s", object])!.trim());
    total += size;
    if (!Number.isSafeInteger(size) || size < 0 || size > current.config.index.limits.max_file_bytes ||
      total > current.config.index.limits.max_total_bytes || nodes.length >= current.config.index.limits.max_files) {
      throw new UsageError("staged legacy graph exceeds configured discovery limits");
    }
    const content = readGraphGit(root, ["cat-file", "blob", object])!;
    if (config) {
      if (canonicalJson(validateConfigSchema(JSON.parse(content)).workspaces) !== canonicalJson(current.config.workspaces)) {
        throw new UsageError("staged workspace ownership changed; explicit ownership migration required");
      }
      continue;
    }
    const node = parseNode(content, path.resolve(root, file), {
      workStatusEnum: current.config.work.status_enum, priorityMin: current.config.work.priority_min,
      priorityMax: current.config.work.priority_max, templateSchemas: templates, deferArchiveIntegrity: true,
    });
    if (node.identity) throw new UsageError(`staged legacy provenance already has immutable identity: ${file}`);
    nodes.push({ path: file, ws: workspace!.alias, qid: `${workspace!.alias}:${node.id}`, hash: identityHash(content), content, node });
  }
  return nodes;
}

export function inspectLegacyLineage(root: string, current: AuthoredSnapshot, ancestor: AuthoredSnapshot, head: string): {
  evidence: LegacyLineageEvidence; continuity: LegacyContinuity[];
} {
  const inventory = revisionInventory(root, ancestor.revision!, head);
  const revisions: LegacyLineageEvidence["revisions"] = [];
  const ancestors = new Map(ancestor.nodes.map((node) => [node.qid, node]));
  const continuity = new Map<string, LegacyContinuity>();
  for (const node of current.nodes) if (ancestors.has(node.qid)) {
    continuity.set(node.qid, { qid: node.qid, reasons: [], observations: [] });
  }
  // Retain compact per-QID observations, never all historical node bodies.
  // Coalesce consecutive identical observations; full revision hashes above
  // still bind every inspected input. Reuse the configured aggregate byte
  // budget for the evidence itself, not a new hard-coded compatibility limit.
  let evidenceBytes = 0;
  const last = new Map<string, string>();
  const observe = (at: string, nodes: AuthoredNode[]) => {
    const byQid = new Map<string, LegacyContinuity["observations"][number]["nodes"]>();
    for (const node of nodes) if (continuity.has(node.qid)) {
      const entries = byQid.get(node.qid) ?? [];
      entries.push({ path: node.path, type: node.node.type, hash: node.hash });
      byQid.set(node.qid, entries);
    }
    for (const [qid, item] of continuity) {
      const entries = (byQid.get(qid) ?? []).sort((a, b) => a.path.localeCompare(b.path));
      const signature = canonicalJson(entries);
      if (last.get(qid) === signature) continue;
      last.set(qid, signature);
      const observation = { at, nodes: entries };
      evidenceBytes += Buffer.byteLength(canonicalJson(observation));
      if (evidenceBytes > current.config.index.limits.max_total_bytes) {
        throw new UsageError("legacy lineage evidence exceeds configured aggregate byte budget; explicit history audit required");
      }
      item.observations.push(observation);
      const previous = ancestors.get(qid)!;
      if (entries.length !== 1 || entries[0].path !== previous.path || entries[0].type !== previous.node.type) {
        item.reasons.push(`continuity differs at ${at}: expected one ${previous.node.type} at ${previous.path}`);
      }
    }
  };
  for (const [revision, parents] of inventory) {
    const snapshot = revision === ancestor.revision ? ancestor : readAuthoredSnapshot(root, revision);
    if (snapshot.format.format_version !== 1) throw new UsageError("legacy history contains adopted identities; explicit lineage audit required");
    revisions.push({ revision, parents, tree_hash: snapshot.tree_hash,
      descends_from_ancestor: readGraphGit(root, ["merge-base", "--is-ancestor", ancestor.revision!, revision], true) !== undefined });
    observe(revision, snapshot.nodes);
  }
  observe("index", stagedNodes(root, current));
  observe("worktree", current.nodes);
  const predatingCount = revisions.filter((revision) => !revision.descends_from_ancestor).length;
  for (const item of continuity.values()) {
    if (predatingCount) item.reasons.push(`merged provenance predates accepted ancestor in ${predatingCount} inspected revisions; review lineage inventory`);
    item.reasons = [...new Set(item.reasons)].sort();
  }
  return { evidence: { schema_version: 1, ancestor: ancestor.revision!, head, revisions }, continuity: [...continuity.values()] };
}

export function verifyLegacyLineage(root: string, evidence: LegacyLineageEvidence): void {
  if (evidence.schema_version !== 1 || ![evidence.ancestor, evidence.head].every((id) => /^[0-9a-f]{40,64}$/.test(id))) {
    throw new UsageError("invalid reviewed legacy lineage evidence");
  }
  const actual = [...revisionInventory(root, evidence.ancestor, evidence.head)];
  const expected = evidence.revisions.map((entry) => [entry.revision, entry.parents]);
  if (canonicalJson(actual) !== canonicalJson(expected)) throw new UsageError("reviewed legacy history inventory moved; preserve state and re-plan");
  for (const entry of evidence.revisions) {
    if (readAuthoredSnapshot(root, entry.revision).tree_hash !== entry.tree_hash) throw new UsageError(`reviewed legacy revision changed: ${entry.revision}`);
  }
}
