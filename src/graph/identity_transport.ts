import path from "path";
import { validateConfigSchema } from "../core/config";
import { workspaceDocumentRelativePath } from "../core/workspace_path";
import { workspaceDocumentOwner } from "./workspace_ownership";
import { UsageError } from "../util/errors";
import { archiveIdFromUri } from "../util/refs";
import { parseFrontmatter } from "./frontmatter";
import { mapGraphReferenceFields, matchesWorkContractPath } from "./identity_refs";
import { replaceGraphFrontmatter } from "./identity_migration";
import { configuredBundleTransportState } from "./transport_state";
import { assertTransportInventory } from "./transport_paths";
import {
  assertNodeFormat, canonicalJson, createGraphFormat, GRAPH_FORMAT_PATH,
  identityHash, identityRef, newIdentityUuid, parseGraphFormat, parseIdentityRef, readNodeIdentity,
} from "./identity";

export function planTransportIdentity(entries: Map<string, Buffer>, mode: "clone" | "fork", sourceHash: string, profile: "public" | "private" = "private") {
  const replacements = new Map<string, Buffer>();
  const additions = new Map<string, Buffer>();
  const skipped = new Set<string>();
  const transportState = configuredBundleTransportState(entries, profile);
  if (!transportState) throw new UsageError("graph transport requires the owning graph config; a public inspection bundle is not a restorable checkout");
  assertTransportInventory(entries.keys());
  for (const file of entries.keys()) {
    if (file === "manifest.json") continue;
    transportState.assertOwnedPath(file);
    if (transportState(file)) skipped.add(file);
  }
  const manifest = entries.get(GRAPH_FORMAT_PATH);
  if (!manifest) return { replacements, additions, skipped, identity: undefined };
  const format = parseGraphFormat(manifest.toString("utf8"));
  const configBytes = entries.get(".mdkg/config.json");
  if (!configBytes) throw new UsageError("identity transport requires the owning graph config");
  const config = validateConfigSchema(JSON.parse(configBytes.toString("utf8")));
  const owner = workspaceDocumentOwner(config);
  if (mode === "clone") return { replacements, additions, skipped,
    identity: { policy: "same-project-clone", source_graph_id: format.graph_id, target_graph_id: format.graph_id, preserved_node_identities: true } };

  const nextFormat = { ...createGraphFormat(), lineage: { kind: "fork" as const,
    source_graph_id: format.graph_id, source_hash: sourceHash } };
  const nodes: Array<{ path: string; ws: string; qid: string; content: string; fm: ReturnType<typeof parseFrontmatter>["frontmatter"]; from: string; to: string; nodeId: string }> = [];
  const identities = new Set<string>();
  const aliases = new Set<string>();
  for (const [ws, workspace] of Object.entries(config.workspaces)) {
    if (!workspace.enabled) continue;
    const prefix = workspaceDocumentRelativePath(workspace.path, workspace.mdkg_dir);
    for (const [file, data] of entries) {
      if (skipped.has(file)) continue;
      if (owner(file) !== ws) continue;
      const local = path.posix.relative(prefix, file);
      if (!/^(core|design|work|archive)\/.+\.md$/.test(local) || local === "core/core.md" || local.split("/").includes("source")) continue;
      const content = data.toString("utf8");
      const fm = parseFrontmatter(content, file).frontmatter;
      const previous = readNodeIdentity(fm, file);
      assertNodeFormat(format, previous, file);
      const from = identityRef(previous!);
      const qid = `${ws}:${fm.id}`;
      if (identities.has(from) || aliases.has(qid)) throw new UsageError("ambiguous source identity or alias; reconcile before independent fork");
      identities.add(from); aliases.add(qid);
      const nodeId = newIdentityUuid();
      nodes.push({ path: file, ws, qid, content, fm, from, nodeId,
        to: identityRef({ graph_id: nextFormat.graph_id, node_id: nodeId }) });
    }
  }
  const byIdentity = new Map(nodes.map((node) => [node.from, node.to]));
  const byAlias = new Map(nodes.map((node) => [node.qid, node.to]));
  for (const node of nodes) {
    const fm = mapGraphReferenceFields(node.fm, (ref, field) => {
      ref = archiveIdFromUri(ref) ?? ref;
      if (byIdentity.has(ref)) return byIdentity.get(ref)!;
      if (field === "work_contracts" && !parseIdentityRef(ref)) {
        const targets = nodes.filter((candidate) => candidate.ws === node.ws && candidate.fm.type === "work" && matchesWorkContractPath(candidate.path, ref));
        if (targets.length === 1) return targets[0].to;
        throw new UsageError(`fork work_contracts path ${ref} does not have one proven owned binding`);
      }
      if (parseIdentityRef(ref)?.graph_id === format.graph_id) throw new UsageError(`fork reference has no source identity: ${ref}`);
      return byAlias.get(ref.includes(":") ? ref : `${node.ws}:${ref}`) ?? ref;
    });
    fm.graph_id = nextFormat.graph_id;
    fm.node_id = node.nodeId;
    replacements.set(node.path, Buffer.from(replaceGraphFrontmatter(node.content, fm)));
  }
  replacements.set(GRAPH_FORMAT_PATH, Buffer.from(`${JSON.stringify(nextFormat, null, 2)}\n`));
  const receipt = { schema_version: 1, kind: "independent-graph-fork", source_hash: sourceHash,
    source_graph_id: format.graph_id, target_graph_id: nextFormat.graph_id,
    mappings: nodes.map((node) => ({ path: node.path, alias: node.qid, from: node.from, to: node.to,
      before_hash: identityHash(node.content), after_hash: identityHash(replacements.get(node.path)!) })),
    body_policy: "historical bodies and existing receipts unchanged; mappings establish new ownership",
    execution_state_policy: "checkout state excluded", skipped_paths: [...skipped].sort() };
  const receiptPath = `.mdkg/identity/forks/${identityHash(canonicalJson(receipt)).slice(7)}.json`;
  additions.set(receiptPath, Buffer.from(`${JSON.stringify(receipt, null, 2)}\n`));
  return { replacements, additions, skipped,
    identity: { policy: "independent-project-fork", source_graph_id: format.graph_id,
      target_graph_id: nextFormat.graph_id, preserved_node_identities: false, receipt_path: receiptPath } };
}
