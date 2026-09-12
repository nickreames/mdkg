import { Index } from "../graph/indexer";
import { parseIdentityRef } from "../graph/identity";
import { identityMatches } from "../graph/identity_refs";

export type ResolveResult =
  | { status: "ok"; qid: string }
  | { status: "missing"; candidates: string[] }
  | { status: "ambiguous"; candidates: string[] };

export function formatResolveError(
  label: string,
  value: string,
  result: ResolveResult,
  wsHint?: string
): string {
  switch (result.status) {
    case "missing": {
      if (wsHint) {
        if (result.candidates.length > 0) {
          return `${label} not found in workspace ${wsHint}: ${value} (did you mean ${result.candidates.join(
            ", "
          )}?)`;
        }
        return `${label} not found in workspace ${wsHint}: ${value}`;
      }
      return `${label} not found: ${value}`;
    }
    case "ambiguous": {
      const candidates = result.candidates.join(", ");
      return `ambiguous ${label}: ${value} (use ${candidates})`;
    }
    case "ok": {
      return `${label} resolved: ${result.qid}`;
    }
  }
}

export function resolveQid(index: Index, idOrQid: string, wsHint?: string): ResolveResult {
  if (parseIdentityRef(idOrQid)) {
    const matches = identityMatches(index.nodes, idOrQid, wsHint).map((node) => node.qid).sort();
    if (matches.length === 1) return { status: "ok", qid: matches[0] };
    return { status: matches.length === 0 ? "missing" : "ambiguous", candidates: matches };
  }
  if (/^mdkg:/i.test(idOrQid)) return { status: "missing", candidates: [] };
  const normalized = idOrQid.toLowerCase();
  if (normalized.includes(":")) {
    if (index.nodes[normalized]) {
      return { status: "ok", qid: normalized };
    }
    const variants = Object.values(index.nodes).filter((node) => node.alias_qid === normalized).map((node) => node.qid).sort();
    if (variants.length === 1) return { status: "ok", qid: variants[0] };
    if (variants.length > 1) return { status: "ambiguous", candidates: variants };
    return { status: "missing", candidates: [] };
  }

  const matches = Object.values(index.nodes)
    .filter((node) => node.id === normalized)
    .map((node) => node.qid)
    .sort();

  if (wsHint) {
    const wsMatches = matches.filter((qid) => index.nodes[qid].ws === wsHint);
    if (wsMatches.length === 1) {
      return { status: "ok", qid: wsMatches[0] };
    }
    if (wsMatches.length > 1) {
      return { status: "ambiguous", candidates: wsMatches };
    }
    return { status: "missing", candidates: matches };
  }

  if (matches.length === 1) {
    return { status: "ok", qid: matches[0] };
  }
  if (matches.length === 0) {
    return { status: "missing", candidates: [] };
  }
  return { status: "ambiguous", candidates: matches };
}
