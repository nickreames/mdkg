import { UsageError } from "../util/errors";
import path from "path";
import { formatResolveError, resolveQid } from "../util/qid";
import { archiveIdFromUri, isUriRef } from "../util/refs";
import { FrontmatterValue, parseFrontmatter } from "./frontmatter";
import { Index } from "./indexer";
import { assertNodeFormat, identityRef, newIdentityUuid, readGraphFormat, readNodeIdentity } from "./identity";
import { identityMatches, mapGraphReferenceFields, matchesWorkContractPath } from "./identity_refs";
import { replaceGraphFrontmatter } from "./identity_migration";

export function bindAuthoredIdentityReferences(index: Index, ws: string, fm: Record<string, FrontmatterValue>, plannedBindings?: ReadonlyMap<string, string>) {
  const ownIdentity = readNodeIdentity(fm, String(fm.id));
  return mapGraphReferenceFields(fm, (ref, field) => {
    ref = archiveIdFromUri(ref) ?? ref;
    if (ref.startsWith("skill.") || (isUriRef(ref) && !ref.startsWith("mdkg:"))) return ref;
    const planned = plannedBindings?.get(ref.includes(":") ? ref : `${ws}:${ref}`);
    if (planned) return planned;
    if (field === "work_contracts" && !ref.startsWith("mdkg:")) {
      const contracts = Object.values(index.nodes).filter((node) => node.ws === ws && node.type === "work" && !node.source?.imported && matchesWorkContractPath(node.path, ref));
      if (contracts.length > 1) throw new UsageError(`ambiguous work_contracts path binding: ${ref}`);
      if (contracts.length === 1 && contracts[0].identity) return identityRef(contracts[0].identity);
    }
    if (ownIdentity && [String(fm.id), `${ws}:${fm.id}`, identityRef(ownIdentity)].includes(ref)) return identityRef(ownIdentity);
    const resolved = resolveQid(index, ref, ref.includes(":") ? undefined : ws);
    if (resolved.status !== "ok") throw new UsageError(formatResolveError(`${field} identity binding`, ref, resolved));
    const target = index.nodes[resolved.qid];
    if (!target.identity) throw new UsageError(`${field} reference ${ref} has no persisted identity; legacy external bindings require reviewed provenance`);
    const stable = identityRef(target.identity);
    if (identityMatches(index.nodes, stable).length !== 1) throw new UsageError(`ambiguous identity binding for ${ref}; choose a non-conflicting source projection`);
    return stable;
  });
}

// A materialized group needs all fresh identities before any cross-link can be
// bound. These are creation identities, never derived from branch-local aliases.
export function bindNewIdentityGroup(root: string, index: Index, ws: string, nodes: Array<{ frontmatter: Record<string, FrontmatterValue>; path: string }>): void {
  const format = readGraphFormat(root);
  if (format.format_version === 1) return;
  const bindings = new Map<string, string>();
  for (const node of nodes) {
    const qid = `${ws}:${node.frontmatter.id}`;
    if (bindings.has(qid) || index.nodes[qid]) throw new UsageError(`new identity group alias is already in use: ${qid}`);
    const identity = { graph_id: format.graph_id, node_id: newIdentityUuid() };
    const stable = identityRef(identity);
    node.frontmatter = { ...node.frontmatter, ...identity };
    bindings.set(qid, stable);
    bindings.set(stable, stable);
  }
  for (const node of nodes) node.frontmatter = bindAuthoredIdentityReferences(index, ws, node.frontmatter, bindings);
}

// Shared creation boundary for every node-producing command. It binds only
// structured references and preserves the authored body verbatim.
export function authorNewIdentityNode(root: string, index: Index, ws: string, content: string, file: string) {
  const format = readGraphFormat(root);
  if (format.format_version === 1) return { content, identity: undefined, stable_ref: undefined };
  const original = parseFrontmatter(content, file).frontmatter;
  const identity = readNodeIdentity(original, file) ?? { graph_id: format.graph_id, node_id: newIdentityUuid() };
  assertNodeFormat(format, identity, file);
  if (identityMatches(index.nodes, identityRef(identity)).length > 0) throw new UsageError("new node cannot reuse an existing immutable identity");
  const fm = bindAuthoredIdentityReferences(index, ws, { ...original, ...identity });
  return { content: replaceGraphFrontmatter(content, fm), identity, stable_ref: identityRef(identity) };
}

export function bindExistingIdentityNode(root: string, index: Index, file: string, fm: Record<string, FrontmatterValue>) {
  const format = readGraphFormat(root);
  if (format.format_version === 1) return fm;
  const relative = path.relative(root, file).split(path.sep).join("/");
  const matches = Object.values(index.nodes).filter((node) => node.path === relative && !node.source?.imported);
  if (matches.length !== 1) throw new UsageError(`existing identity mutation requires one owned source node: ${relative}`);
  const node = matches[0];
  const identity = readNodeIdentity(fm, relative);
  assertNodeFormat(format, identity, relative);
  if (!identity || !node.identity || identityRef(identity) !== identityRef(node.identity)) {
    throw new UsageError(`ordinary mutation cannot replace immutable identity: ${relative}`);
  }
  if (fm.id !== node.id) throw new UsageError("alias changes require reviewed identity reconciliation");
  return bindAuthoredIdentityReferences(index, node.ws, fm);
}
