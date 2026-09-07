import path from "path";
import { UsageError } from "../util/errors";
import { archiveIdFromUri, isUriRef } from "../util/refs";
import { formatFrontmatter, FrontmatterValue } from "./frontmatter";
import {
  canonicalJson, createGraphFormat, deriveIdentityUuid, GRAPH_FORMAT_PATH,
  identityHash, identityRef, NodeIdentity, requireIdentityUuid,
} from "./identity";
import { mapGraphReferenceFields, matchesWorkContractPath } from "./identity_refs";
import {
  AuthoredSnapshot, graphControlSnapshot, GraphControlSnapshot, indexAuthoredSnapshot,
  readAuthoredSnapshot, readGraphGit,
} from "./identity_snapshot";
import { ALLOWED_TYPES, parseNode } from "./node";
import { loadTemplateSchemas } from "./template_schema";

export type GraphFileChange = { path: string; before: string | null; after: string | null };
export type MigrationParameters = { graphId: string; origin: string; ancestor?: string };
export type LegacyIdentityMapping = {
  qid: string;
  path: string;
  identity: NodeIdentity;
  stable_ref: string;
  origin_kind: "accepted-ancestor" | "branch-addition";
  ancestor_path: string | null;
  before_hash: string;
  after_hash?: string;
};
export type IdentityPlanBase = {
  schema_version: 1;
  action: "graph.migrate.plan" | "graph.reconcile.plan";
  input_tree_hash: string;
  input_files: Record<string, string>;
  control: GraphControlSnapshot;
  writes: GraphFileChange[];
  receipt_path: string;
  blocking: string[];
  generated_exclusions: string[];
  plan_hash: string;
  dependency_files?: Record<string, string | null>;
  skill_dependency_paths?: string[];
  revision_evidence?: Array<{ revision: string; tree_hash: string }>;
};
export type MigrationPlan = IdentityPlanBase & {
  action: "graph.migrate.plan";
  parameters: MigrationParameters;
  ancestor: { revision: string; tree_hash: string } | null;
  mappings: LegacyIdentityMapping[];
};

// Preserve body bytes (including CRLF and immutable quoted receipt material).
// Only the explicitly approved structured header is serialized differently.
export function replaceGraphFrontmatter(content: string, frontmatter: Record<string, FrontmatterValue>): string {
  if (!/^---\r?\n/.test(content)) throw new UsageError("graph node is missing its frontmatter header");
  const end = /\r?\n---(?:\r?\n|$)/g.exec(content);
  if (!end) throw new UsageError("graph node is missing its frontmatter boundary");
  const eol = content.startsWith("---\r\n") ? "\r\n" : "\n";
  const body = content.slice(end.index + end[0].length);
  return ["---", ...formatFrontmatter(frontmatter), "---", ""].join(eol) + body;
}

export function graphPlanHash(plan: Omit<MigrationPlan, "plan_hash">): string {
  return identityHash(canonicalJson(plan));
}

export function planLegacyIdentityMigration(root: string, parameters: MigrationParameters): MigrationPlan {
  const graphId = requireIdentityUuid(parameters.graphId, "--graph-id");
  const origin = requireIdentityUuid(parameters.origin, "--origin");
  const current = readAuthoredSnapshot(root);
  if (current.format.format_version !== 1) throw new UsageError("graph already has identity; migration cannot reassign existing identities");
  const control = graphControlSnapshot(root);
  if (control.head && !parameters.ancestor) {
    throw new UsageError("legacy Git migration requires an explicit accepted --ancestor; do not independently assign aliases on divergent branches");
  }
  const ancestor = parameters.ancestor ? readAuthoredSnapshot(root, parameters.ancestor) : undefined;
  if (ancestor && ancestor.format.format_version !== 1) {
    throw new UsageError("ancestor already has identities; use its authored identity mapping instead of a new legacy namespace");
  }
  if (ancestor && control.head && readGraphGit(root, ["merge-base", "--is-ancestor", ancestor.revision!, control.head], true) === undefined) {
    throw new UsageError("accepted ancestor is not an ancestor of the current local HEAD");
  }
  const currentQids = new Map(current.nodes.map((entry) => [entry.qid, entry]));
  const ancestorQids = new Map(ancestor?.nodes.map((entry) => [entry.qid, entry]) ?? []);
  if (currentQids.size !== current.nodes.length || (ancestor && ancestorQids.size !== ancestor.nodes.length)) {
    throw new UsageError("legacy aliases are ambiguous; migrate independent branches before integration or supply reviewed identity evidence");
  }
  const blocking: string[] = [];
  const mappings: LegacyIdentityMapping[] = current.nodes.map((entry) => {
    const previous = ancestorQids.get(entry.qid);
    if (previous && (previous.path !== entry.path || previous.node.type !== entry.node.type)) {
      blocking.push(`${entry.path}: ancestor alias moved or changed type; explicit rename/recreation identity evidence is required`);
    }
    const kind = previous ? "accepted-ancestor" : "branch-addition";
    const nodeId = previous
      ? deriveIdentityUuid(graphId, kind, [ancestor!.revision!, previous.qid, previous.path])
      : deriveIdentityUuid(graphId, kind, [origin, entry.qid, entry.path]);
    const identity = { graph_id: graphId, node_id: nodeId };
    return { qid: entry.qid, path: entry.path, identity, stable_ref: identityRef(identity), origin_kind: kind,
      ancestor_path: previous?.path ?? null, before_hash: entry.hash };
  });
  const mappingByQid = new Map(mappings.map((entry) => [entry.qid, entry]));
  const writes: GraphFileChange[] = [];
  const templates = loadTemplateSchemas(root, current.config, ALLOWED_TYPES);
  const candidateNodes = current.nodes.map((entry) => {
    const mapping = mappingByQid.get(entry.qid)!;
    const frontmatter = mapGraphReferenceFields(entry.node.frontmatter, (ref, field) => {
      ref = archiveIdFromUri(ref) ?? ref;
      if (isUriRef(ref) || ref.startsWith("skill.")) return ref;
      if (field === "work_contracts") {
        const targets = current.nodes.filter((candidate) => candidate.ws === entry.ws && candidate.node.type === "work" && matchesWorkContractPath(candidate.path, ref));
        if (targets.length === 1) return mappingByQid.get(targets[0].qid)!.stable_ref;
        blocking.push(`${entry.path}: work_contracts path ${ref} has ${targets.length} proven bindings; expected exactly one`);
        return ref;
      }
      const qid = ref.includes(":") ? ref : `${entry.ws}:${ref}`;
      const target = mappingByQid.get(qid);
      if (target) return target.stable_ref;
      blocking.push(`${entry.path}: ${field} reference ${ref} lacks a proven identity binding`);
      return ref;
    });
    frontmatter.graph_id = graphId;
    frontmatter.node_id = mapping.identity.node_id;
    const after = replaceGraphFrontmatter(entry.content, frontmatter);
    const node = parseNode(after, path.resolve(root, entry.path), {
      workStatusEnum: current.config.work.status_enum, priorityMin: current.config.work.priority_min,
      priorityMax: current.config.work.priority_max, templateSchemas: templates,
    });
    mapping.after_hash = identityHash(after);
    writes.push({ path: entry.path, before: entry.content, after });
    return { ...entry, content: after, hash: mapping.after_hash, node };
  });
  // A separate intent identity avoids a circular hash between the manifest,
  // receipt path, and the final reviewed plan. The journal records plan_hash.
  const intentHash = identityHash(canonicalJson({
    graph_id: graphId, origin, input_tree_hash: current.tree_hash,
    ancestor: ancestor ? { revision: ancestor.revision, tree_hash: ancestor.tree_hash } : null, mappings,
  }));
  const receiptPath = `.mdkg/identity/migrations/${intentHash.slice(7)}.json`;
  const format = { ...createGraphFormat(graphId), migration_receipt: receiptPath };
  const manifestContent = `${JSON.stringify(format, null, 2)}\n`;
  writes.push({ path: GRAPH_FORMAT_PATH, before: null, after: manifestContent });
  const candidate: AuthoredSnapshot = { ...current, format, nodes: candidateNodes };
  try { indexAuthoredSnapshot(candidate); }
  catch (error) { blocking.push(`strict candidate validation: ${error instanceof Error ? error.message : String(error)}`); }
  const receipt = {
    schema_version: 1, kind: "graph-identity-migration", intent_hash: intentHash,
    graph_id: graphId, origin, ancestor: ancestor ? { revision: ancestor.revision, tree_hash: ancestor.tree_hash } : null,
    input_tree_hash: current.tree_hash, mappings,
    manifest_hash: identityHash(manifestContent), body_policy: "preserve exact historical body bytes",
    execution_state_policy: "selection, claims, runtime DB and Git staging are not migrated",
  };
  writes.push({ path: receiptPath, before: null, after: `${JSON.stringify(receipt, null, 2)}\n` });
  for (const change of writes) {
    if (path.isAbsolute(change.path) || change.path.split("/").includes("..")) throw new UsageError("migration produced an unsafe path");
  }
  const body: Omit<MigrationPlan, "plan_hash"> = {
    schema_version: 1, action: "graph.migrate.plan",
    parameters: { graphId, origin, ...(ancestor ? { ancestor: ancestor.revision! } : {}) },
    input_tree_hash: current.tree_hash, input_files: current.files, control,
    ancestor: ancestor ? { revision: ancestor.revision!, tree_hash: ancestor.tree_hash } : null,
    mappings, writes, receipt_path: receiptPath, blocking: [...new Set(blocking)].sort(),
    generated_exclusions: [".mdkg/index/", ".mdkg/bundles/", ".mdkg/pack/", ".mdkg/state/", ".mdkg/db/", ".mdkg/events/", ".git/"],
  };
  return { ...body, plan_hash: graphPlanHash(body) };
}

export function publicMigrationPlan<T extends IdentityPlanBase>(plan: T) {
  return {
    ...plan,
    safe_to_apply: plan.blocking.length === 0,
    writes: plan.writes.map((change) => ({ path: change.path,
      before_hash: change.before === null ? null : identityHash(change.before),
      after_hash: change.after === null ? null : identityHash(change.after),
    })),
    side_effects: "none-preview", git_staging: "unchanged",
    next_action: "review exact identities, mappings, exclusions and plan hash before explicit application",
  };
}
