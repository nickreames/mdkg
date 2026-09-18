import type { FrontmatterValue } from "./frontmatter";
import type { Index, IndexNode } from "./indexer";
import { identityRef, parseIdentityRef } from "./identity";

export function matchesWorkContractPath(nodePath: string, ref: string): boolean {
  const normalize = (value: string) => value.replace(/\\/g, "/").replace(/^\.\//, "");
  const target = normalize(ref);
  if (!target || target.startsWith("/") || target.split("/").includes("..") || target.split("/").pop() !== "WORK.md") return false;
  return normalize(nodePath) === target || normalize(nodePath).endsWith(`/${target}`);
}

const GRAPH_REF_FIELDS = new Set([
  "epic", "parent", "prev", "next", "relates", "blocked_by", "blocks", "refs",
  "scope", "active_node", "last_active_node", "supersedes", "agent_id", "work_id",
  "work_order_id", "target_id", "receipt_id", "work_contracts", "artifacts",
]);

// These schema fields are opaque semantic/provider policy references, not
// graph foreign keys. A dotted label here must not acquire node identity by
// coincidentally matching a local alias. Graph links use explicit graph fields.
const OPAQUE_REF_FIELDS = new Set([
  "request_ref", "trigger_ref", "cost_ref", "source_ref",
  "validation_policy_ref", "evidence_policy_ref",
]);

// Capability dependencies may name a runtime/skill registry entry without a
// graph node. Only explicit immutable references opt into graph identity here;
// coincidental local aliases must not change a portable dependency's meaning.
// subagent_refs is intentionally absent: it is a validated graph foreign key.
const PORTABLE_DEPENDENCY_FIELDS = new Set([
  "skill_refs", "tool_refs", "model_refs", "wasm_component_refs", "runtime_image_refs",
]);

export function isGraphReferenceField(key: string): boolean {
  return !OPAQUE_REF_FIELDS.has(key) && (GRAPH_REF_FIELDS.has(key) || key.endsWith("_ref") || key.endsWith("_refs"));
}

// Only structured reference slots are transformed. Titles, prose, aliases,
// commands, artifact bodies, URLs and evidence hashes are never substring-edited.
export function mapGraphReferenceFields(
  frontmatter: Record<string, FrontmatterValue>,
  resolve: (ref: string, field: string) => string
): Record<string, FrontmatterValue> {
  const result = { ...frontmatter };
  for (const [field, value] of Object.entries(frontmatter)) {
    if (!isGraphReferenceField(field)) continue;
    const resolveValue = (ref: string): string => {
      if (PORTABLE_DEPENDENCY_FIELDS.has(field) && !/^mdkg:/i.test(ref)) return ref;
      return resolve(ref, field);
    };
    const transform = (ref: string): string => {
      // Artifact lists also contain opaque filesystem/runtime locators. Only
      // explicit internal graph/archive URIs in this field bind identities.
      if (field === "artifacts" && !ref.startsWith("mdkg:") && !ref.startsWith("archive://")) return ref;
      const binding = /^([a-z0-9][a-z0-9._-]*)=(.+)$/.exec(ref);
      return binding ? `${binding[1]}=${resolveValue(binding[2])}` : resolveValue(ref);
    };
    if (typeof value === "string") result[field] = transform(value);
    else if (Array.isArray(value)) result[field] = value.map(transform);
  }
  return result;
}

export function identityMatches(nodes: Record<string, IndexNode>, ref: string, wsHint?: string): IndexNode[] {
  if (!parseIdentityRef(ref)) return [];
  return Object.values(nodes).filter((node) => node.identity && identityRef(node.identity) === ref && (!wsHint || node.ws === wsHint));
}

export function normalizeIndexIdentityReferences(index: Pick<Index, "nodes">): void {
  const bindings = new Map<string, string[]>();
  for (const node of Object.values(index.nodes)) {
    if (node.identity) {
      const ref = identityRef(node.identity);
      bindings.set(ref, [...(bindings.get(ref) ?? []), node.qid]);
    }
  }
  const resolve = (value: string): string => {
    const matches = bindings.get(value);
    return matches?.length === 1 ? matches[0] : value;
  };
  for (const node of Object.values(index.nodes)) {
    node.refs = node.refs.map(resolve);
    node.attributes = mapGraphReferenceFields(node.attributes, resolve);
    for (const [key, value] of Object.entries(node.edges)) {
      (node.edges as unknown as Record<string, string | string[] | undefined>)[key] =
        typeof value === "string" ? resolve(value) : Array.isArray(value) ? value.map(resolve) : value;
    }
  }
}
