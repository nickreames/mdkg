import { measurePack } from "./metrics";
import { PackResult, PackTruncationReport } from "./types";

export type PackBudgetLimits = {
  maxChars?: number;
  maxLines?: number;
  maxTokens?: number;
};

export type ApplyBudgetResult = {
  pack: PackResult;
  report: PackTruncationReport;
};

type NormalizedPackBudgetLimits = {
  maxChars?: number;
  maxLines?: number;
  maxTokens?: number;
};

function normalizeLimit(value: number | undefined, label: string): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${label} must be a non-negative integer`);
  }
  if (value === 0) {
    return undefined;
  }
  return value;
}

function exceeds(limits: NormalizedPackBudgetLimits, totals: ReturnType<typeof measurePack>["totals"]): boolean {
  if (limits.maxChars !== undefined && totals.chars > limits.maxChars) {
    return true;
  }
  if (limits.maxLines !== undefined && totals.lines > limits.maxLines) {
    return true;
  }
  if (limits.maxTokens !== undefined && totals.tokens_estimate > limits.maxTokens) {
    return true;
  }
  return false;
}

function exceededKinds(
  limits: NormalizedPackBudgetLimits,
  totals: ReturnType<typeof measurePack>["totals"]
): Array<"chars" | "lines" | "tokens"> {
  const kinds: Array<"chars" | "lines" | "tokens"> = [];
  if (limits.maxChars !== undefined && totals.chars > limits.maxChars) {
    kinds.push("chars");
  }
  if (limits.maxLines !== undefined && totals.lines > limits.maxLines) {
    kinds.push("lines");
  }
  if (limits.maxTokens !== undefined && totals.tokens_estimate > limits.maxTokens) {
    kinds.push("tokens");
  }
  return kinds;
}

function truncateBodyToFit(pack: PackResult, limits: NormalizedPackBudgetLimits): PackResult {
  if (pack.nodes.length === 0) {
    return pack;
  }
  const root = pack.nodes[0];
  const sourceLines = root.body.split(/\r?\n/);
  if (sourceLines.length === 0) {
    return pack;
  }

  let low = 0;
  let high = sourceLines.length;
  let best = 0;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const candidateBody = sourceLines.slice(0, mid).join("\n").trimEnd();
    const candidatePack: PackResult = {
      ...pack,
      nodes: [{ ...root, body: candidateBody }],
    };
    const stats = measurePack(candidatePack);
    if (!exceeds(limits, stats.totals)) {
      best = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  const trimmedBody = sourceLines.slice(0, best).join("\n").trimEnd();
  return {
    ...pack,
    nodes: [{ ...root, body: trimmedBody }],
  };
}

export function applyPackBudgets(
  pack: PackResult,
  limitsInput: PackBudgetLimits,
  profile: PackTruncationReport["profile"]
): ApplyBudgetResult {
  const limits: NormalizedPackBudgetLimits = {
    maxChars: normalizeLimit(limitsInput.maxChars, "--max-chars"),
    maxLines: normalizeLimit(limitsInput.maxLines, "--max-lines"),
    maxTokens: normalizeLimit(limitsInput.maxTokens, "--max-tokens"),
  };

  const beforeStats = measurePack(pack);
  let working: PackResult = {
    meta: {
      ...pack.meta,
      truncated: {
        ...pack.meta.truncated,
        max_chars: pack.meta.truncated.max_chars ?? false,
        max_lines: pack.meta.truncated.max_lines ?? false,
        max_tokens: pack.meta.truncated.max_tokens ?? false,
        body_truncated: pack.meta.truncated.body_truncated
          ? [...pack.meta.truncated.body_truncated]
          : [],
      },
    },
    nodes: [...pack.nodes],
  };

  const droppedNodes: string[] = [];
  const bodyTruncatedNodes: string[] = [];

  let stats = measurePack(working);
  while (working.nodes.length > 1 && exceeds(limits, stats.totals)) {
    const kinds = exceededKinds(limits, stats.totals);
    for (const kind of kinds) {
      if (kind === "chars") {
        working.meta.truncated.max_chars = true;
      } else if (kind === "lines") {
        working.meta.truncated.max_lines = true;
      } else if (kind === "tokens") {
        working.meta.truncated.max_tokens = true;
      }
    }
    const dropped = working.nodes[working.nodes.length - 1];
    working = {
      ...working,
      nodes: working.nodes.slice(0, -1),
    };
    if (dropped) {
      droppedNodes.push(dropped.qid);
    }
    stats = measurePack(working);
  }

  if (exceeds(limits, stats.totals) && working.nodes.length > 0) {
    const beforeBody = working.nodes[0]?.body ?? "";
    const truncated = truncateBodyToFit(working, limits);
    const afterBody = truncated.nodes[0]?.body ?? "";
    if (afterBody !== beforeBody) {
      bodyTruncatedNodes.push(truncated.nodes[0].qid);
      truncated.meta.truncated.body_truncated = [
        ...(truncated.meta.truncated.body_truncated ?? []),
        truncated.nodes[0].qid,
      ];
    }
    const kinds = exceededKinds(limits, stats.totals);
    for (const kind of kinds) {
      if (kind === "chars") {
        truncated.meta.truncated.max_chars = true;
      } else if (kind === "lines") {
        truncated.meta.truncated.max_lines = true;
      } else if (kind === "tokens") {
        truncated.meta.truncated.max_tokens = true;
      }
    }
    working = truncated;
    stats = measurePack(working);
  }

  if (droppedNodes.length > 0) {
    working.meta.truncated.dropped.push(...droppedNodes);
  }
  if (bodyTruncatedNodes.length > 0) {
    working.meta.truncated.body_truncated = [
      ...(working.meta.truncated.body_truncated ?? []),
      ...bodyTruncatedNodes,
    ];
  }

  working.meta.node_count = working.nodes.length;

  const report: PackTruncationReport = {
    root: pack.meta.root,
    profile: pack.meta.profile ?? profile,
    limits: {
      max_chars: limits.maxChars,
      max_lines: limits.maxLines,
      max_tokens: limits.maxTokens,
    },
    before: {
      node_count: pack.nodes.length,
      chars: beforeStats.totals.chars,
      lines: beforeStats.totals.lines,
      bytes: beforeStats.totals.bytes,
      tokens_estimate: beforeStats.totals.tokens_estimate,
    },
    after: {
      node_count: working.nodes.length,
      chars: stats.totals.chars,
      lines: stats.totals.lines,
      bytes: stats.totals.bytes,
      tokens_estimate: stats.totals.tokens_estimate,
    },
    dropped_nodes: droppedNodes,
    body_truncated_nodes: bodyTruncatedNodes,
  };

  return { pack: working, report };
}
