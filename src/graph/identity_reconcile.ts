import path from "path";
import { UsageError } from "../util/errors";
import { archiveIdFromUri, isUriRef } from "../util/refs";
import { FrontmatterValue } from "./frontmatter";
import { assertNodeFormat, canonicalJson, identityHash, identityRef, parseIdentityRef } from "./identity";
import { replaceGraphFrontmatter } from "./identity_migration";
import { mapGraphReferenceFields, matchesWorkContractPath } from "./identity_refs";
import { AuthoredNode, AuthoredSnapshot } from "./identity_snapshot";

export type IdentityResolution = { take: "target" | "incoming" | "delete"; reason: string };
export type IdentityDecisions = Record<string, IdentityResolution>;
type Header = Record<string, FrontmatterValue>;
type SemanticNode = { source: AuthoredNode; header: Header; body: string };
export type IdentityClassification = {
  stable_ref: string;
  outcome: string;
  ancestor_hash: string | null;
  target_hash: string | null;
  incoming_hash: string | null;
  conflicts: string[];
  decision?: IdentityResolution;
};
export type IdentityMergeResult = {
  documents: Array<{ path: string; ws: string; stable_ref: string; content: string }>;
  classifications: IdentityClassification[];
  mappings: Array<{
    stable_ref: string;
    target: { alias: string; path: string; hash: string } | null;
    incoming: { alias: string; path: string; hash: string } | null;
    output: { alias: string; path: string; hash: string } | null;
  }>;
  blocking: string[];
};

const LIFECYCLE = new Set(["status", "goal_state", "active_node", "last_active_node", "scope_refs", "goal_condition", "order_status", "receipt_status", "outcome"]);
const EVIDENCE = new Set(["artifacts", "evidence_refs", "proof_refs", "attestation_refs", "evidence_hashes", "input_hashes", "output_hashes", "payload_hash"]);
const equal = (left: unknown, right: unknown) => canonicalJson(left) === canonicalJson(right);

function exactBody(content: string): string {
  const boundary = /\r?\n---(?:\r?\n|$)/.exec(content);
  if (!boundary) throw new UsageError("reconciliation requires a complete authored frontmatter boundary");
  return content.slice(boundary.index + boundary[0].length);
}

function inputNodes(snapshot: AuthoredSnapshot): Map<string, SemanticNode> {
  const aliases = new Map<string, AuthoredNode>();
  const identities = new Map<string, AuthoredNode>();
  for (const node of snapshot.nodes) {
    assertNodeFormat(snapshot.format, node.node.identity, node.path);
    if (!node.node.identity) throw new UsageError("reconciliation requires explicit v2 identities; migrate each branch first");
    if (node.hash !== identityHash(node.content)) throw new UsageError(`reconciliation input hash mismatch: ${node.path}`);
    const ref = identityRef(node.node.identity);
    if (aliases.has(node.qid) || identities.has(ref)) throw new UsageError(`ambiguous identity/alias within one reconciliation input: ${node.qid}`);
    aliases.set(node.qid, node); identities.set(ref, node);
  }
  return new Map([...identities].map(([stable, node]) => {
    const header = mapGraphReferenceFields(node.node.frontmatter, (raw, field) => {
      const ref = archiveIdFromUri(raw) ?? raw;
      if (parseIdentityRef(ref)) {
        // Exact foreign stable references are not reinterpreted. The eventual
        // strict candidate validator must verify mounted-source compatibility.
        if (!identities.has(ref) && parseIdentityRef(ref)!.graph_id === node.node.identity!.graph_id) {
          throw new UsageError(`${node.path}: unresolved ${field} identity ${ref}`);
        }
        return ref;
      }
      if (ref.startsWith("mdkg:")) throw new UsageError(`${node.path}: malformed immutable reference ${ref}`);
      if (isUriRef(ref) || ref.startsWith("skill.")) return ref;
      if (field === "work_contracts") {
        const matches = snapshot.nodes.filter((item) => item.ws === node.ws && item.node.type === "work" && matchesWorkContractPath(item.path, ref));
        if (matches.length === 1) return identityRef(matches[0].node.identity!);
      }
      const target = aliases.get(ref.includes(":") ? ref : `${node.ws}:${ref}`);
      if (!target) throw new UsageError(`${node.path}: ${field} reference ${raw} lacks an input-revision identity binding`);
      return identityRef(target.node.identity!);
    });
    // Aliases and paths are reviewed labels, not semantic identity or a reason
    // to create a second copy of a common node.
    delete header.id;
    return [stable, { source: node, header, body: exactBody(node.content) }];
  }));
}

function same(left: SemanticNode, right: SemanticNode): boolean {
  return equal(left.header, right.header) && left.body === right.body;
}

function mergeFields(base: SemanticNode, target: SemanticNode, incoming: SemanticNode) {
  const header: Header = {};
  const conflicts: string[] = [];
  const keys = [...new Set([...Object.keys(base.header), ...Object.keys(target.header), ...Object.keys(incoming.header)])].sort();
  for (const group of [LIFECYCLE, EVIDENCE]) {
    const fields = keys.filter((key) => group.has(key));
    if (fields.some((key) => !equal(base.header[key], target.header[key])) &&
      fields.some((key) => !equal(base.header[key], incoming.header[key])) &&
      fields.some((key) => !equal(target.header[key], incoming.header[key]))) {
      conflicts.push(group === LIFECYCLE ? "$lifecycle" : "$evidence");
    }
  }
  for (const key of keys) {
    const a = base.header[key], t = target.header[key], i = incoming.header[key];
    const value = equal(t, i) || equal(i, a) ? t : equal(t, a) ? i : undefined;
    if (!equal(t, i) && !equal(i, a) && !equal(t, a)) conflicts.push(key);
    if (value !== undefined) header[key] = value;
  }
  const body = target.body === incoming.body || incoming.body === base.body ? target.body
    : target.body === base.body ? incoming.body : undefined;
  if (body === undefined) conflicts.push("$body");
  return { header, body: body ?? target.body, conflicts };
}

function remappedPath(source: AuthoredNode, alias: string): string {
  if (source.node.id === alias) return source.path;
  const parts = source.path.split("/");
  let index = parts.length - 1;
  while (index >= 0 && !(parts[index] === source.node.id || parts[index] === `${source.node.id}.md` || parts[index].startsWith(`${source.node.id}-`))) index -= 1;
  if (index < 0) throw new UsageError(`alias remap requires a recognized authored filename: ${source.path}`);
  parts[index] = alias + parts[index].slice(source.node.id.length);
  return parts.join("/");
}

// Pure semantic planning kernel. No filesystem/Git/index writes or successful
// application receipt are possible here. Callers must bind revision/control
// fingerprints, validate all output documents and review the complete plan.
export function reconcileIdentitySnapshots(
  ancestor: AuthoredSnapshot, target: AuthoredSnapshot, incoming: AuthoredSnapshot,
  decisions: IdentityDecisions = {}, previouslyIntegrated: ReadonlySet<string> = new Set()
): IdentityMergeResult {
  if (target.format.format_version !== 2 || ancestor.format.format_version !== 2 || incoming.format.format_version !== 2 ||
    target.format.graph_id !== ancestor.format.graph_id || target.format.graph_id !== incoming.format.graph_id) {
    throw new UsageError("reconciliation requires one compatible graph identity; independent projects require ownership-aware import");
  }
  for (const snapshot of [ancestor, incoming]) {
    if (!equal(snapshot.config.workspaces, target.config.workspaces)) throw new UsageError("reconciliation cannot change workspace ownership");
  }
  const aNodes = inputNodes(ancestor), tNodes = inputNodes(target), iNodes = inputNodes(incoming);
  const refs = [...new Set([...aNodes.keys(), ...tNodes.keys(), ...iNodes.keys()])].sort();
  const chosen = new Map<string, SemanticNode>();
  const classifications: IdentityClassification[] = [];
  const blocking: string[] = [];
  for (const ref of Object.keys(decisions)) {
    const decision = decisions[ref];
    if (!refs.includes(ref) || !decision || !["target", "incoming", "delete"].includes(decision.take) ||
      typeof decision.reason !== "string" || !decision.reason.trim() || decision.reason.length > 2000 ||
      Object.keys(decision).some((key) => !["take", "reason"].includes(key))) {
      throw new UsageError(`invalid or unbound explicit identity decision: ${ref}`);
    }
  }
  for (const ref of refs) {
    const a = aNodes.get(ref), t = tNodes.get(ref), i = iNodes.get(ref);
    const variants = [a, t, i].filter((item): item is SemanticNode => Boolean(item));
    if (new Set(variants.map((item) => item.source.ws)).size !== 1 || new Set(variants.map((item) => item.source.node.type)).size !== 1) {
      throw new UsageError(`${ref}: immutable node changes type or workspace; separate migration required`);
    }
    let selected = t;
    let outcome = "target-only";
    let conflicts: string[] = [];
    if (!a) {
      if (t && i) { outcome = same(t, i) ? "already-integrated" : "decision-required"; if (!same(t, i)) conflicts.push("$unproven-common-creation"); }
      else if (i) {
        if (previouslyIntegrated.has(ref)) { outcome = "decision-required"; conflicts.push("$reintroduction"); }
        else { selected = i; outcome = "incoming-add"; }
      }
    } else if (!t && !i) { outcome = "already-deleted"; }
    else if (!t) {
      outcome = "target-delete";
      if (previouslyIntegrated.has(ref) && decisions[ref]) { outcome = "decision-required"; conflicts.push("$reintroduction"); }
      else if (!same(a, i!)) { outcome = "decision-required"; conflicts.push("$delete-modify"); }
    } else if (!i) {
      if (same(a, t)) { selected = undefined; outcome = "incoming-delete"; }
      else { outcome = "decision-required"; conflicts.push("$modify-delete"); }
    } else if (same(t, i)) { outcome = same(a, t) ? "unchanged" : "already-integrated"; }
    else if (same(a, i)) { outcome = "target-only"; }
    else if (same(a, t)) { selected = i; outcome = "incoming-edit"; }
    else {
      const merged = mergeFields(a, t, i);
      conflicts = merged.conflicts;
      if (conflicts.length) outcome = "decision-required";
      else { selected = { source: t.source, header: merged.header, body: merged.body }; outcome = "semantic-merge"; }
    }
    const decision = decisions[ref];
    if (conflicts.length && decision) {
      selected = decision.take === "target" ? t : decision.take === "incoming" ? i : undefined;
      outcome = `explicit-${decision.take}`;
    } else if (conflicts.length) blocking.push(`${ref}: explicit decision required for ${conflicts.join(", ")}`);
    else if (decision) throw new UsageError(`${ref}: decision is stale or unnecessary for this input classification`);
    if (selected) chosen.set(ref, selected);
    classifications.push({ stable_ref: ref, outcome, ancestor_hash: a?.source.hash ?? null,
      target_hash: t?.source.hash ?? null, incoming_hash: i?.source.hash ?? null, conflicts,
      ...(decision ? { decision } : {}) });
  }
  const occupiedAliases = new Set(target.nodes.map((item) => item.qid));
  const occupiedPaths = new Set(target.nodes.map((item) => item.path));
  const maxima = new Map<string, number>();
  for (const entry of [...target.nodes, ...incoming.nodes]) {
    const numeric = /^([a-z]+)-(\d+)$/.exec(entry.node.id);
    if (numeric) {
      if (!Number.isSafeInteger(Number(numeric[2])) || Number(numeric[2]) >= Number.MAX_SAFE_INTEGER) throw new UsageError("numeric alias exceeds safe reconciliation allocation range");
      const key = `${entry.ws}:${numeric[1]}`;
      maxima.set(key, Math.max(maxima.get(key) ?? 0, Number(numeric[2])));
    }
  }
  const documents: IdentityMergeResult["documents"] = [];
  const outputs = new Map<string, { alias: string; path: string; hash: string }>();
  // Reserve every target label first. Incoming order cannot steal another
  // target's alias, and output ordering depends only on immutable identities.
  for (const [ref, selected] of chosen) {
    const t = tNodes.get(ref);
    const source = t?.source ?? selected.source;
    let alias = source.node.id;
    let outputPath = source.path;
    if (!t && (occupiedAliases.has(`${source.ws}:${alias}`) || occupiedPaths.has(outputPath))) {
      const numeric = /^([a-z]+)-(\d+)$/.exec(alias);
      if (numeric) {
        const key = `${source.ws}:${numeric[1]}`;
        do {
          const previous = maxima.get(key) ?? 0;
          if (previous >= Number.MAX_SAFE_INTEGER) throw new UsageError("numeric alias allocation range exhausted");
          maxima.set(key, previous + 1); alias = `${numeric[1]}-${maxima.get(key)}`;
        }
        while (occupiedAliases.has(`${source.ws}:${alias}`) || occupiedPaths.has(remappedPath(source, alias)));
      } else {
        alias = `${alias}-${parseIdentityRef(ref)!.node_id.replace(/-/g, "")}`;
      }
      outputPath = remappedPath(source, alias);
    }
    if (!t && (occupiedAliases.has(`${source.ws}:${alias}`) || occupiedPaths.has(outputPath))) throw new UsageError(`unable to reserve deterministic alias/path for ${ref}`);
    if (path.posix.isAbsolute(outputPath) || outputPath.split("/").includes("..")) throw new UsageError("unsafe reconciliation output path");
    occupiedAliases.add(`${source.ws}:${alias}`); occupiedPaths.add(outputPath);
    const header = { ...selected.header, id: alias };
    const existing = t?.source;
    const serialized = replaceGraphFrontmatter(selected.source.content, header);
    const serializedHeader = serialized.slice(0, serialized.length - exactBody(serialized).length);
    const content = existing && equal(header, existing.node.frontmatter) && selected.body === exactBody(existing.content)
      ? existing.content
      : serializedHeader + selected.body;
    documents.push({ path: outputPath, ws: source.ws, stable_ref: ref, content });
    outputs.set(ref, { alias: `${source.ws}:${alias}`, path: outputPath, hash: identityHash(content) });
  }
  const summarize = (entry?: SemanticNode) => entry ? { alias: entry.source.qid, path: entry.source.path, hash: entry.source.hash } : null;
  return { documents: documents.sort((a, b) => a.path.localeCompare(b.path)), classifications,
    mappings: refs.map((ref) => ({ stable_ref: ref, target: summarize(tNodes.get(ref)), incoming: summarize(iNodes.get(ref)), output: outputs.get(ref) ?? null })),
    blocking: blocking.sort() };
}
