import { Index } from "../graph/indexer";

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
  const normalized = idOrQid.toLowerCase();
  if (normalized.includes(":")) {
    if (index.nodes[normalized]) {
      return { status: "ok", qid: normalized };
    }
    return { status: "missing", candidates: [] };
  }

  const matches = Object.values(index.nodes)
    .filter((node) => node.id === normalized)
    .map((node) => node.qid)
    .sort();

  if (wsHint) {
    const wsMatches = matches.filter((qid) => qid.startsWith(`${wsHint}:`));
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
