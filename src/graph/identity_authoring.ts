import { UsageError } from "../util/errors";
import path from "path";
import { formatResolveError, resolveQid } from "../util/qid";
import { archiveIdFromUri, isUriRef } from "../util/refs";
import { FrontmatterValue, parseFrontmatter } from "./frontmatter";
import { Index } from "./indexer";
import { assertNodeFormat, identityRef, newIdentityUuid, readGraphFormat, readNodeIdentity } from "./identity";
import { identityMatches, mapGraphReferenceFields, matchesWorkContractPath } from "./identity_refs";
import { replaceGraphFrontmatter } from "./identity_migration";
import { numericAlias, isPortableId } from "../util/id";
import { Config } from "../core/config";
import { containedPathExists } from "../core/filesystem_authority";
import { ALLOWED_TYPES, parseNode } from "./node";
import { loadTemplateSchemas } from "./template_schema";
import { collectGraphErrors } from "./validate_graph";
import { normalizeIndexIdentityReferences } from "./identity_refs";
import { listWorkspaceDocFiles, readWorkspaceDocument } from "./workspace_files";

function admitNewAlias(index: Index, ws: string, id: unknown): asserts id is string {
  if (typeof id !== "string" || !isPortableId(id)) throw new UsageError("new node requires a valid alias");
  numericAlias(id);
  if (Object.values(index.nodes).some(node => node.ws === ws && node.id === id)) throw new UsageError(`new node alias is already in use: ${ws}:${id}`);
}

// Validate the complete virtual authoring group before reservations or writes.
// Archive creation has its own payload admission and does not call this helper.
export function validateProspectiveNodes(root: string, config: Config, index: Index, ws: string,
  entries: Array<{ id: string; path: string; content: string }>, deferLegacyRelationships = false): void {
  const candidate: Index = structuredClone(index);
  const files = listWorkspaceDocFiles(root, config);
  const limits = config.index.limits;
  if (files.length + entries.length > limits.max_files) throw new UsageError("prospective graph exceeds max_files");
  const bytes = files.reduce((sum, file) => sum + Buffer.byteLength(readWorkspaceDocument(root, file, limits.max_file_bytes)), 0);
  if (bytes + entries.reduce((sum, entry) => sum + Buffer.byteLength(entry.content), 0) > limits.max_total_bytes) throw new UsageError("prospective graph exceeds max_total_bytes");
  const schemas = loadTemplateSchemas(root, config, ALLOWED_TYPES);
  const paths = new Set<string>();
  for (const entry of entries) {
    admitNewAlias(candidate, ws, entry.id);
    if (paths.has(entry.path) || containedPathExists({ root, relativePath: entry.path })) throw new UsageError(`node already exists: ${entry.path}`);
    paths.add(entry.path);
    const workspace = config.workspaces[ws];
    const relative = path.relative(path.resolve(root, workspace.path, workspace.mdkg_dir), path.resolve(root, entry.path));
    if (path.dirname(relative).split(path.sep).length - 1 > limits.max_depth) throw new UsageError("prospective graph exceeds max_depth");
    if (Buffer.byteLength(entry.content) > config.index.limits.max_file_bytes) throw new UsageError("prospective node exceeds max_file_bytes");
    const node = parseNode(entry.content, path.resolve(root, entry.path), {
      archiveRoot: root, workStatusEnum: config.work.status_enum,
      priorityMin: config.work.priority_min, priorityMax: config.work.priority_max, templateSchemas: schemas,
    });
    if (node.id !== entry.id) throw new UsageError("rendered node alias differs from planned numeric allocation");
    assertNodeFormat(readGraphFormat(root), node.identity, entry.path);
    if (node.identity && identityMatches(candidate.nodes, identityRef(node.identity)).length) throw new UsageError("new node cannot reuse an existing immutable identity");
    const qid = `${ws}:${node.id}`;
    const qualify = (ref: string) => ref.includes(":") ? ref : `${ws}:${ref}`;
    const edges = Object.fromEntries(Object.entries(node.edges).map(([key, value]) => [key,
      typeof value === "string" ? qualify(value) : Array.isArray(value) ? value.map(qualify) : value])) as typeof node.edges;
    candidate.nodes[qid] = { ...node, qid, ws, path: entry.path, edges };
  }
  normalizeIndexIdentityReferences(candidate);
  // Legacy --no-reindex already permits separately authored reciprocal links.
  // It never skips numeric, identity, node-syntax, path, or discovery admission;
  // v2 relationships remain strict regardless of cache persistence options.
  if (deferLegacyRelationships && !index.meta.graph_format) return;
  const options = { allowMissing: config.index.tolerant, externalWorkspaces: new Set(Object.keys(config.subgraphs)) };
  const previous = new Set(collectGraphErrors(index, options));
  const errors = collectGraphErrors(candidate, options).filter(error => !previous.has(error));
  if (errors.length) throw new UsageError(`prospective graph is invalid: ${errors[0]}`);
}

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
  const aliases = new Set<string>();
  for (const node of nodes) {
    admitNewAlias(index, ws, node.frontmatter.id);
    if (aliases.has(node.frontmatter.id)) throw new UsageError(`new group alias is already in use: ${ws}:${node.frontmatter.id}`);
    aliases.add(node.frontmatter.id);
  }
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
  const original = parseFrontmatter(content, file).frontmatter;
  admitNewAlias(index, ws, original.id);
  if (format.format_version === 1) return { content, identity: undefined, stable_ref: undefined };
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
