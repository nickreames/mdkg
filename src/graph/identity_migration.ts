import path from "path";
import { validateConfigSchema } from "../core/config";
import { readContainedFile } from "../core/filesystem_authority";
import { identityWriterConfig } from "../core/migrate";
import { UsageError } from "../util/errors";
import { archiveIdFromUri, isUriRef } from "../util/refs";
import { formatFrontmatter, frontmatterSourceBounds, FrontmatterValue } from "./frontmatter";
import {
  canonicalJson, createGraphFormat, deriveIdentityUuid, GRAPH_FORMAT_PATH,
  identityHash, identityRef, NodeIdentity, requireIdentityUuid,
} from "./identity";
import { mapGraphReferenceFields, matchesWorkContractPath } from "./identity_refs";
import {
  AuthoredSnapshot, graphControlSnapshot, GraphControlSnapshot,
  readAuthoredSnapshot, readGraphGit,
} from "./identity_snapshot";
import { ALLOWED_TYPES, parseNode } from "./node";
import { loadTemplateSchemas } from "./template_schema";
import { inspectLegacyLineage, LegacyContinuity, LegacyLineageEvidence } from "./identity_legacy_lineage";
import { assertCompleteIdentityHistory } from "./identity_history";
import { assertCandidateDependencies, candidateDependencyWriteConflicts, CandidateValidationContract, validateIdentityCandidate } from "./identity_validation";

export type GraphFileChange = { path: string; before: string | null; after: string | null };
export type MigrationDecision = { take: "restore-ancestor" | "new-identity"; reason: string; review_hash: string };
export type MigrationParameters = { graphId: string; origin: string; ancestor?: string; decisions?: Record<string, MigrationDecision> };
export type LegacyIdentityMapping = {
  qid: string;
  path: string;
  identity: NodeIdentity;
  stable_ref: string;
  origin_kind: "accepted-ancestor" | "branch-addition" | "reviewed-recreation";
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
  candidate_validation?: CandidateValidationContract;
  revision_evidence?: Array<{ revision: string; tree_hash: string }>;
  legacy_lineage?: LegacyLineageEvidence;
};
export type MigrationPlan = IdentityPlanBase & {
  action: "graph.migrate.plan";
  parameters: MigrationParameters;
  ancestor: { revision: string; tree_hash: string } | null;
  mappings: LegacyIdentityMapping[];
  continuity_reviews: Array<LegacyContinuity & { review_hash: string; reference_policy: string }>;
};

// Preserve body bytes (including CRLF and immutable quoted receipt material).
// Only the explicitly approved structured header is serialized differently.
export function replaceGraphFrontmatter(content: string, frontmatter: Record<string, FrontmatterValue>): string {
  const { bodyStart, eol } = frontmatterSourceBounds(content, "graph node frontmatter header");
  const body = content.slice(bodyStart);
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
  if (control.head) assertCompleteIdentityHistory(root);
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
  const lineage = ancestor && control.head ? inspectLegacyLineage(root, current, ancestor, control.head) : undefined;
  const lineageHash = lineage ? identityHash(canonicalJson(lineage.evidence)) : null;
  const continuityReviews = (lineage?.continuity ?? []).filter((entry) => entry.reasons.length > 0).map((entry) => {
    const referencePolicy = "approved choice binds all current structured references to this node's selected identity; historical body and external receipt bytes are not rewritten";
    return { ...entry, reference_policy: referencePolicy, review_hash: identityHash(canonicalJson({
      graph_id: graphId, origin, input_tree_hash: current.tree_hash, git_index: control.git_index,
      lineage_hash: lineageHash, continuity: entry, reference_policy: referencePolicy,
    })) };
  });
  const decisions = parameters.decisions === undefined ? {} : parameters.decisions;
  const reviewByQid = new Map(continuityReviews.map((entry) => [entry.qid, entry]));
  const ancestorPaths = new Set(ancestor?.nodes.map((entry) => entry.path) ?? []);
  if (!decisions || typeof decisions !== "object" || Array.isArray(decisions)) throw new UsageError("migration decisions must be an object keyed by legacy QID");
  for (const [qid, decision] of Object.entries(decisions)) {
    const review = reviewByQid.get(qid);
    if (!review) throw new UsageError(`unused or unknown migration provenance decision: ${qid}`);
    if (!decision || typeof decision !== "object" || Array.isArray(decision) ||
      Object.keys(decision).sort().join(",") !== "reason,review_hash,take" ||
      !["restore-ancestor", "new-identity"].includes(decision.take) || typeof decision.reason !== "string" || !decision.reason.trim() ||
      decision.review_hash !== review.review_hash) throw new UsageError(`invalid or stale migration provenance decision: ${qid}; review exact evidence again`);
  }
  const mappings: LegacyIdentityMapping[] = current.nodes.map((entry) => {
    const previous = ancestorQids.get(entry.qid);
    const review = reviewByQid.get(entry.qid);
    const decision = Object.prototype.hasOwnProperty.call(decisions, entry.qid) ? decisions[entry.qid] : undefined;
    if (review && !decision) {
      blocking.push(`${entry.path}: continuity requires explicit reviewed rename/recreation provenance; use the exact continuity review hash`);
    }
    // A changed alias at an old path is not an independently proven addition.
    // No automatic cross-alias pairing: preserve it for explicit normalization.
    if (!previous && ancestorPaths.has(entry.path)) {
      blocking.push(`${entry.path}: changed ancestor alias requires explicit alias provenance before migration`);
    }
    const kind = decision?.take === "new-identity" ? "reviewed-recreation" : previous ? "accepted-ancestor" : "branch-addition";
    const nodeId = kind === "reviewed-recreation"
      ? deriveIdentityUuid(graphId, kind, [origin, ancestor!.revision!, entry.qid, entry.path])
      : previous
      ? deriveIdentityUuid(graphId, kind, [ancestor!.revision!, previous.qid, previous.path])
      : deriveIdentityUuid(graphId, kind, [origin, entry.qid, entry.path]);
    const identity = { graph_id: graphId, node_id: nodeId };
    return { qid: entry.qid, path: entry.path, identity, stable_ref: identityRef(identity), origin_kind: kind,
      ancestor_path: previous?.path ?? null, before_hash: entry.hash };
  });
  const mappingByQid = new Map(mappings.map((entry) => [entry.qid, entry]));
  const configBefore = readContainedFile({ root, relativePath: ".mdkg/config.json" });
  const configAfter = `${JSON.stringify(identityWriterConfig(JSON.parse(configBefore)), null, 2)}\n`;
  const candidateConfig = validateConfigSchema(JSON.parse(configAfter));
  // First forward / last rollback operation: block ordinary old clients before
  // any identity bytes change. Old init binaries remain outside our control.
  const writes: GraphFileChange[] = [{ path: ".mdkg/config.json", before: configBefore, after: configAfter }];
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
      // Read-only imported aliases are not assigned this graph's identities.
      // The complete candidate validator must prove their actual target exists.
      if (Object.prototype.hasOwnProperty.call(current.config.subgraphs, qid.split(":")[0])) return ref;
      blocking.push(`${entry.path}: ${field} reference ${ref} lacks a proven identity binding`);
      return ref;
    });
    frontmatter.graph_id = graphId;
    frontmatter.node_id = mapping.identity.node_id;
    const after = replaceGraphFrontmatter(entry.content, frontmatter);
    const node = parseNode(after, path.resolve(root, entry.path), {
      archiveRoot: root,
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
    lineage: lineage?.evidence ?? null, continuity_reviews: continuityReviews, decisions,
  }));
  const receiptPath = `.mdkg/identity/migrations/${intentHash.slice(7)}.json`;
  const format = { ...createGraphFormat(graphId), migration_receipt: receiptPath };
  const manifestContent = `${JSON.stringify(format, null, 2)}\n`;
  writes.push({ path: GRAPH_FORMAT_PATH, before: null, after: manifestContent });
  const candidate: AuthoredSnapshot = { ...current, config: candidateConfig, format, nodes: candidateNodes };
  const receipt = {
    schema_version: 1, kind: "graph-identity-migration", intent_hash: intentHash,
    graph_id: graphId, origin, ancestor: ancestor ? { revision: ancestor.revision, tree_hash: ancestor.tree_hash } : null,
    input_tree_hash: current.tree_hash, mappings, lineage: lineage?.evidence ?? null,
    continuity_reviews: continuityReviews, decisions,
    provenance_limit: "Git commits and stage-0 index prove observable continuity only; unrecorded unlink/recreate with no surviving Git trace is indistinguishable from editing",
    manifest_hash: identityHash(manifestContent), body_policy: "preserve exact historical body bytes",
    writer_fence: { path: ".mdkg/config.json", before_hash: identityHash(configBefore), after_hash: identityHash(configAfter),
      policy: "all writers must support adopted graph capabilities; old init/force-init cannot be controlled retroactively" },
    execution_state_policy: "selection, claims, runtime DB and Git staging are not migrated",
    validation_contract: "authored-candidate-v1: graph, skills, templates, imports, visibility, archives, events and resulting discovery limits; derived caches and opt-in profiles excluded",
  };
  const receiptContent = `${JSON.stringify(receipt, null, 2)}\n`;
  const evidenceContents = [...Object.values(current.identity_evidence ?? {}).map((entry) => entry.content), receiptContent];
  const limits = current.config.index.limits;
  if (evidenceContents.some((content) => Buffer.byteLength(content) > limits.max_file_bytes) ||
    candidateNodes.length + evidenceContents.length > limits.max_files ||
    candidateNodes.reduce((sum, entry) => sum + Buffer.byteLength(entry.content), 0) +
      evidenceContents.reduce((sum, content) => sum + Buffer.byteLength(content), 0) > limits.max_total_bytes) {
    blocking.push("generated migration evidence exceeds configured discovery limits; review the exact receipt and graph budget before application");
  }
  writes.push({ path: receiptPath, before: null, after: receiptContent });
  candidate.identity_evidence = { ...current.identity_evidence, [receiptPath]: { content: receiptContent, hash: identityHash(receiptContent) } };
  const validated = validateIdentityCandidate(root, candidate);
  blocking.push(...validated.blocking);
  blocking.push(...candidateDependencyWriteConflicts(writes, validated.dependencies, validated.contract));
  for (const change of writes) {
    if (path.isAbsolute(change.path) || change.path.split("/").includes("..")) throw new UsageError("migration produced an unsafe path");
  }
  const body: Omit<MigrationPlan, "plan_hash"> = {
    schema_version: 1, action: "graph.migrate.plan",
    parameters: { graphId, origin, ...(ancestor ? { ancestor: ancestor.revision! } : {}), decisions },
    input_tree_hash: current.tree_hash, input_files: current.files, control,
    dependency_files: validated.dependencies, skill_dependency_paths: validated.skillPaths, candidate_validation: validated.contract,
    ancestor: ancestor ? { revision: ancestor.revision!, tree_hash: ancestor.tree_hash } : null,
    mappings, continuity_reviews: continuityReviews, ...(lineage ? { legacy_lineage: lineage.evidence } : {}),
    writes, receipt_path: receiptPath, blocking: [...new Set(blocking)].sort(),
    generated_exclusions: [".mdkg/index/", ".mdkg/bundles/", ".mdkg/pack/", ".mdkg/state/", ".mdkg/db/", ".mdkg/events/", ".git/"],
  };
  if (canonicalJson(graphControlSnapshot(root)) !== canonicalJson(control) || readAuthoredSnapshot(root).tree_hash !== current.tree_hash) {
    throw new UsageError("migration baseline moved while planning; preserve state and re-inventory");
  }
  if (!blocking.length) assertCandidateDependencies(root, current.config, validated.dependencies, validated.contract);
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
