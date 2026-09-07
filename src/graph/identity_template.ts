import { UsageError } from "../util/errors";
import { archiveIdFromUri, isUriRef } from "../util/refs";
import { FrontmatterValue } from "./frontmatter";
import { mapGraphReferenceFields, matchesWorkContractPath } from "./identity_refs";
import {
  assertNodeFormat, canonicalJson, deriveIdentityUuid, identityHash, identityRef,
  parseGraphFormat, readGraphFormat, readNodeIdentity,
} from "./identity";

export function templateIdentityMapper(root: string, sourceManifest: Buffer | undefined, sourceHash: string,
  imported: Array<{ sourcePath: string; id: string; parsed: { frontmatter: Record<string, FrontmatterValue> } }>,
  idMap: Map<string, string>) {
  const target = readGraphFormat(root);
  const source = sourceManifest ? parseGraphFormat(sourceManifest.toString("utf8")) : { format_version: 1 as const };
  if (target.format_version === 1) {
    if (source.format_version === 2) throw new UsageError("identity template cannot be imported into legacy graph; explicitly migrate the target first");
    return undefined;
  }
  const bindings = new Map<string, string>();
  const identities = new Set<string>();
  const mappings = imported.map((entry) => {
    const previous = readNodeIdentity(entry.parsed.frontmatter, entry.sourcePath);
    assertNodeFormat(source, previous, entry.sourcePath);
    const sourceRef = previous ? identityRef(previous) : `root:${entry.id}`;
    if (identities.has(sourceRef) || bindings.has(`root:${entry.id}`)) throw new UsageError("ambiguous template identity or alias");
    identities.add(sourceRef);
    const toId = idMap.get(entry.id)!;
    const identity = { graph_id: target.graph_id, node_id: deriveIdentityUuid(target.graph_id,
      "template-import", [sourceHash, sourceRef, entry.sourcePath, toId]) };
    const to = identityRef(identity);
    bindings.set(sourceRef, to);
    bindings.set(`root:${entry.id}`, to);
    return { source_path: entry.sourcePath, from_alias: entry.id, to_alias: toId, from: sourceRef, to, identity };
  });
  const receipt = { schema_version: 1, kind: "template-identity-import", source_hash: sourceHash,
    target_graph_id: target.graph_id, mappings, body_policy: "exact historical body bytes preserved" };
  const receiptPath = `.mdkg/identity/templates/${identityHash(canonicalJson(receipt)).slice(7)}.json`;
  return {
    receipt, receiptPath,
    transform(entry: typeof imported[number]) {
      const mapping = mappings.find((item) => item.source_path === entry.sourcePath)!;
      const fm = mapGraphReferenceFields(entry.parsed.frontmatter, (ref, field) => {
        ref = archiveIdFromUri(ref) ?? ref;
        const bound = bindings.get(ref.includes(":") ? ref : `root:${ref}`);
        if (bound) return bound;
        if (field === "work_contracts") {
          const targets = imported.filter((candidate) => candidate.parsed.frontmatter.type === "work" && matchesWorkContractPath(candidate.sourcePath, ref));
          if (targets.length === 1) return mappings.find((candidate) => candidate.source_path === targets[0].sourcePath)!.to;
          throw new UsageError(`template work_contracts path ${ref} does not have one proven imported binding`);
        }
        if ((isUriRef(ref) && !ref.startsWith("mdkg:")) || ref.startsWith("skill.")) return ref;
        throw new UsageError(`template reference ${ref} lacks an imported identity binding; explicit external ownership evidence is required`);
      });
      return { ...fm, id: mapping.to_alias, ...mapping.identity };
    },
  };
}
