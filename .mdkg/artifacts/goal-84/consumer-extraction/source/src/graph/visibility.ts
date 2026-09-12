import { Config } from "../core/config";
import { UsageError } from "../util/errors";
import { archiveIdFromUri, isUriRef } from "../util/refs";
import { Index, IndexNode } from "./indexer";

export const VISIBILITY_VALUES = ["public", "internal", "private"] as const;
export type Visibility = (typeof VISIBILITY_VALUES)[number];

export type VisibilityReference = {
  field: string;
  value: string;
  targetQid: string;
  targetVisibility: Visibility;
};

export type VisibilityViolation = {
  qid: string;
  visibility: Visibility;
  field: string;
  value: string;
  target_qid: string;
  target_visibility: Visibility;
  message: string;
};

const VISIBILITY_RANK: Record<Visibility, number> = {
  public: 0,
  internal: 1,
  private: 2,
};

export function isVisibility(value: unknown): value is Visibility {
  return typeof value === "string" && (VISIBILITY_VALUES as readonly string[]).includes(value);
}

export function normalizeVisibility(
  value: string | undefined,
  label = "--visibility",
  fallback: Visibility = "private"
): Visibility {
  const normalized = (value ?? fallback).toLowerCase();
  if (isVisibility(normalized)) {
    return normalized;
  }
  throw new UsageError(`${label} must be public, internal, or private`);
}

export function isVisibleAt(recordVisibility: Visibility, scope: Visibility): boolean {
  return VISIBILITY_RANK[recordVisibility] <= VISIBILITY_RANK[scope];
}

export function isLessVisibleThan(targetVisibility: Visibility, sourceVisibility: Visibility): boolean {
  return VISIBILITY_RANK[targetVisibility] > VISIBILITY_RANK[sourceVisibility];
}

export function effectiveNodeVisibility(node: IndexNode, config: Config): Visibility {
  if (node.source?.imported && isVisibility(node.source.visibility)) {
    return node.source.visibility;
  }
  const archiveVisibility = node.attributes.visibility;
  if (node.type === "archive" && isVisibility(archiveVisibility)) {
    return archiveVisibility;
  }
  const workspaceVisibility = config.workspaces[node.ws]?.visibility;
  if (isVisibility(workspaceVisibility)) {
    return workspaceVisibility;
  }
  const subgraphVisibility = config.subgraphs[node.ws]?.visibility;
  if (isVisibility(subgraphVisibility)) {
    return subgraphVisibility;
  }
  return "private";
}

function collectStringValues(value: unknown, prefix: string, out: Array<{ field: string; value: string }>): void {
  if (typeof value === "string") {
    out.push({ field: prefix, value });
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectStringValues(item, `${prefix}[${index}]`, out));
    return;
  }
  if (typeof value === "object" && value !== null) {
    for (const [key, child] of Object.entries(value)) {
      collectStringValues(child, prefix ? `${prefix}.${key}` : key, out);
    }
  }
}

function collectNodeStringReferences(node: IndexNode): Array<{ field: string; value: string }> {
  const values: Array<{ field: string; value: string }> = [];
  const edgeFields: Array<[string, string | undefined]> = [
    ["epic", node.edges.epic],
    ["parent", node.edges.parent],
    ["prev", node.edges.prev],
    ["next", node.edges.next],
  ];
  for (const [field, value] of edgeFields) {
    if (value) {
      values.push({ field, value });
    }
  }
  for (const [index, value] of node.edges.relates.entries()) {
    values.push({ field: `relates[${index}]`, value });
  }
  for (const [index, value] of node.edges.blocked_by.entries()) {
    values.push({ field: `blocked_by[${index}]`, value });
  }
  for (const [index, value] of node.edges.blocks.entries()) {
    values.push({ field: `blocks[${index}]`, value });
  }
  for (const [index, value] of (node.edges.context_refs ?? []).entries()) {
    values.push({ field: `context_refs[${index}]`, value });
  }
  for (const [index, value] of (node.edges.evidence_refs ?? []).entries()) {
    values.push({ field: `evidence_refs[${index}]`, value });
  }
  for (const [index, value] of node.links.entries()) {
    values.push({ field: `links[${index}]`, value });
  }
  for (const [index, value] of node.artifacts.entries()) {
    values.push({ field: `artifacts[${index}]`, value });
  }
  for (const [index, value] of node.refs.entries()) {
    values.push({ field: `refs[${index}]`, value });
  }
  collectStringValues(node.attributes, "attributes", values);
  return values;
}

function archiveNodeById(index: Index, workspace: string, archiveId: string): IndexNode | undefined {
  const sameWorkspace = index.nodes[`${workspace}:${archiveId}`];
  if (sameWorkspace?.type === "archive") {
    return sameWorkspace;
  }
  const matches = Object.values(index.nodes).filter(
    (candidate) => candidate.type === "archive" && candidate.id === archiveId
  );
  return matches.length === 1 ? matches[0] : undefined;
}

function resolveReferenceTarget(index: Index, source: IndexNode, value: string): IndexNode | undefined {
  const archiveId = archiveIdFromUri(value);
  if (archiveId) {
    return archiveNodeById(index, source.ws, archiveId);
  }
  if (isUriRef(value)) {
    return undefined;
  }
  const exact = index.nodes[value];
  if (exact) {
    return exact;
  }
  if (!value.includes(":")) {
    return index.nodes[`${source.ws}:${value}`];
  }
  return undefined;
}

export function collectNodeVisibilityReferences(
  index: Index,
  config: Config,
  node: IndexNode
): VisibilityReference[] {
  const references: VisibilityReference[] = [];
  const seen = new Set<string>();
  for (const ref of collectNodeStringReferences(node)) {
    const target = resolveReferenceTarget(index, node, ref.value);
    if (!target || target.qid === node.qid) {
      continue;
    }
    const key = `${ref.field}\0${ref.value}\0${target.qid}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    references.push({
      field: ref.field,
      value: ref.value,
      targetQid: target.qid,
      targetVisibility: effectiveNodeVisibility(target, config),
    });
  }
  return references;
}

export function collectVisibilityViolations(
  index: Index,
  config: Config,
  options: {
    includedQids?: Set<string>;
    scope?: Visibility;
  } = {}
): VisibilityViolation[] {
  const violations: VisibilityViolation[] = [];
  const qids = options.includedQids
    ? Object.keys(index.nodes).filter((qid) => options.includedQids?.has(qid))
    : Object.keys(index.nodes);

  for (const qid of qids.sort()) {
    const node = index.nodes[qid];
    if (!node) {
      continue;
    }
    const sourceVisibility = effectiveNodeVisibility(node, config);
    if (options.scope && !isVisibleAt(sourceVisibility, options.scope)) {
      continue;
    }
    for (const ref of collectNodeVisibilityReferences(index, config, node)) {
      if (options.includedQids && !options.includedQids.has(ref.targetQid)) {
        const target = index.nodes[ref.targetQid];
        if (!target) {
          continue;
        }
        const targetVisibility = effectiveNodeVisibility(target, config);
        if (options.scope && isVisibleAt(targetVisibility, options.scope)) {
          continue;
        }
        violations.push({
          qid: node.qid,
          visibility: sourceVisibility,
          field: ref.field,
          value: ref.value,
          target_qid: ref.targetQid,
          target_visibility: targetVisibility,
          message: `${node.qid} references ${targetVisibility} ${ref.targetQid} through ${ref.field}`,
        });
        continue;
      }
      if (isLessVisibleThan(ref.targetVisibility, sourceVisibility)) {
        violations.push({
          qid: node.qid,
          visibility: sourceVisibility,
          field: ref.field,
          value: ref.value,
          target_qid: ref.targetQid,
          target_visibility: ref.targetVisibility,
          message: `${node.qid} (${sourceVisibility}) references ${ref.targetVisibility} ${ref.targetQid} through ${ref.field}`,
        });
        continue;
      }
      if (options.scope && !isVisibleAt(ref.targetVisibility, options.scope)) {
        violations.push({
          qid: node.qid,
          visibility: sourceVisibility,
          field: ref.field,
          value: ref.value,
          target_qid: ref.targetQid,
          target_visibility: ref.targetVisibility,
          message: `${node.qid} references ${ref.targetVisibility} ${ref.targetQid} through ${ref.field}, which is excluded by ${options.scope} visibility`,
        });
      }
    }
  }

  return violations;
}

export function visibilityViolationMessages(violations: VisibilityViolation[]): string[] {
  return Array.from(new Set(violations.map((violation) => violation.message))).sort();
}
