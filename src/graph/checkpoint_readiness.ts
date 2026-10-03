// Opt-in machine-readable verdicts. A completed assessment that found gaps
// remains a blocker; recording the assessment must not complete its dependency.
export const READINESS_TAGS = ["readiness:not-run", "readiness:not-ready", "readiness:ready-pending-approval"] as const;

type ReadinessNode = { type: string; status?: string; tags: string[] };

export function checkpointReadinessError(node: ReadinessNode): string | undefined {
  if (node.type !== "checkpoint") return undefined;
  const verdicts = node.tags.filter(tag => tag.startsWith("readiness:"));
  if (!verdicts.length) return undefined; // Existing ordinary checkpoints keep their contract.
  if (verdicts.length !== 1 || !READINESS_TAGS.includes(verdicts[0] as typeof READINESS_TAGS[number])) {
    return "checkpoint requires exactly one supported readiness verdict tag";
  }
  if (verdicts[0] === "readiness:not-ready" && node.status !== "blocked" && node.status !== "review") {
    return "NOT_READY checkpoint must stay blocked or review, never done";
  }
  if (node.status === "done" && verdicts[0] !== "readiness:ready-pending-approval") {
    return "only READY_PENDING_APPROVAL may complete a readiness checkpoint dependency";
  }
  return undefined;
}

export function dependencyIsComplete(node: ReadinessNode | undefined): boolean {
  return node?.status === "done" && checkpointReadinessError(node) === undefined;
}
