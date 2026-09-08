import fs from "fs";
import path from "path";
import { UsageError } from "../util/errors";
import { canonicalJson, GRAPH_FORMAT_PATH, identityHash, identityRef, parseGraphFormat, parseIdentityRef } from "./identity";
import { AuthoredSnapshot, readAuthoredSnapshot, readGraphGit, readIdentityEvidence, readRevisionFile } from "./identity_snapshot";
import { getWorkspaceDocRoots } from "./workspace_files";
import { matchesReconciliationAcceptance, reconciliationAcceptancePath } from "./identity_acceptance";
import { readAppliedReconciliationReceipts } from "./identity_transaction";

export type ReconciliationAcceptance = {
  path: string;
  hash: string;
  observed_at: string | null;
  incoming: { revision: string; tree_hash: string };
  target: { revision: string; tree_hash: string };
  output_authored_hash: string;
  intent_hash: string;
};
export type IdentityHistory = {
  previously_present: string[];
  acceptances: ReconciliationAcceptance[];
  inspected_revisions: string[];
};

// Missing ancestry is not permission to treat an old identity as a new node.
// Never fetch history or reinterpret replacement/graft objects to fill a gap.
export function assertCompleteIdentityHistory(root: string): void {
  if (readGraphGit(root, ["rev-parse", "--is-shallow-repository"])?.trim() !== "false") {
    throw new UsageError("identity reconciliation requires complete local history; no fetch attempted");
  }
  const grafts = readGraphGit(root, ["rev-parse", "--git-path", "info/grafts"])!.trim();
  if (fs.existsSync(path.resolve(root, grafts))) {
    throw new UsageError("Git graft metadata makes identity ancestry ambiguous; preserve it and resolve explicitly");
  }
}

// Parse a claim, not an authorization. A self-hash proves byte consistency only;
// readIdentityHistory requires a separate target acceptance witness below.
export function readReconciliationAcceptance(file: string, content: string, graphId: string, observedAt: string | null): ReconciliationAcceptance | undefined {
  if (!file.startsWith(".mdkg/identity/reconciliations/")) return undefined;
  const parsed = JSON.parse(content);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new UsageError(`invalid reconciliation provenance: ${file}`);
  const { intent_hash: intent, ...payload } = parsed;
  // Independent forks retain original receipts as inert historical evidence.
  if (typeof payload.graph_id === "string" && payload.graph_id !== graphId) return undefined;
  const revisionEvidence = (value: any) => /^[0-9a-f]{40,64}$/.test(value?.revision ?? "") &&
    /^sha256:[0-9a-f]{64}$/.test(value?.tree_hash ?? "");
  if (payload.schema_version !== 1 || payload.kind !== "graph-identity-reconciliation" ||
    payload.graph_id !== graphId || !/^sha256:[0-9a-f]{64}$/.test(intent ?? "") ||
    identityHash(canonicalJson(payload)) !== intent || file !== `.mdkg/identity/reconciliations/${intent.slice(7)}.json` ||
    !revisionEvidence(payload.incoming) || !revisionEvidence(payload.target) || !revisionEvidence(payload.ancestor) ||
    !revisionEvidence(payload.semantic_base) || !/^sha256:[0-9a-f]{64}$/.test(payload.output_authored_hash ?? "") ||
    !payload.decisions || typeof payload.decisions !== "object" || Array.isArray(payload.decisions) ||
    !payload.validation || typeof payload.validation !== "object" ||
    ![payload.validation.authored, payload.validation.dependencies, payload.validation.external_evidence,
      payload.body_policy, payload.execution_state_policy].every((value) => typeof value === "string") ||
    !Array.isArray(payload.mappings) || !Array.isArray(payload.classifications)) {
    throw new UsageError(`unverified reconciliation provenance: ${file}`);
  }
  for (const mapping of payload.mappings) {
    const identity = parseIdentityRef(mapping?.stable_ref ?? "");
    if (!identity || identity.graph_id !== graphId) throw new UsageError(`foreign or malformed receipt mapping: ${file}`);
    for (const side of [mapping.target, mapping.incoming, mapping.output]) {
      if (side !== null && (!side || typeof side.alias !== "string" || typeof side.path !== "string" ||
        !/^sha256:[0-9a-f]{64}$/.test(side.hash ?? ""))) throw new UsageError(`malformed receipt mapping side: ${file}`);
    }
  }
  for (const entry of payload.classifications) {
    if (parseIdentityRef(entry?.stable_ref ?? "")?.graph_id !== graphId || typeof entry.outcome !== "string" ||
      !Array.isArray(entry.conflicts) || !entry.conflicts.every((value: unknown) => typeof value === "string") ||
      ![entry.ancestor_hash, entry.target_hash, entry.incoming_hash].every((value) => value === null || /^sha256:[0-9a-f]{64}$/.test(value ?? ""))) {
      throw new UsageError(`malformed receipt classification: ${file}`);
    }
  }
  for (const [ref, decision] of Object.entries(payload.decisions) as Array<[string, any]>) {
    if (parseIdentityRef(ref)?.graph_id !== graphId || !["target", "incoming", "delete"].includes(decision?.take) ||
      typeof decision.reason !== "string" || !decision.reason.trim()) throw new UsageError(`malformed receipt decision: ${file}`);
  }
  return { path: file, hash: identityHash(content), observed_at: observedAt,
    incoming: payload.incoming, target: payload.target, output_authored_hash: payload.output_authored_hash, intent_hash: intent };
}

/** Bounded, read-only history search. Git's pickaxe only narrows candidates;
 * parsed immutable headers in each commit/parent establish actual identity.
 * Inspecting parents also covers deletion commits and cherry-pick/revert pairs.
 */
export function readIdentityHistory(root: string, target: AuthoredSnapshot, head: string, sought: ReadonlySet<string>): IdentityHistory {
  assertCompleteIdentityHistory(root);
  if (target.format.format_version !== 2) throw new UsageError("identity history requires format v2");
  const graphId = target.format.graph_id;
  const maxCommits = 2048;
  const revisions = new Set<string>();
  const search = (args: string[], paths: string[]) => {
    const commits = readGraphGit(root, ["log", "-m", "--full-history", "--format=%H", `--max-count=${maxCommits + 1}`,
      "--no-ext-diff", "--no-textconv", ...args, head, "--", ...paths])!.trim().split("\n").filter(Boolean);
    if (commits.length > maxCommits) throw new UsageError("identity history exceeds the bounded review limit; explicit history audit required");
    for (const commit of commits) {
      const lineage = readGraphGit(root, ["rev-list", "--parents", "-n", "1", commit])!.trim().split(" ");
      for (const revision of lineage) revisions.add(revision);
      if (revisions.size > maxCommits * 2) throw new UsageError("identity history parent inventory exceeds the bounded review limit");
    }
  };
  search([], [".mdkg/identity/reconciliations", ".mdkg/identity/acceptances"]);
  const ids = [...sought].map((ref) => {
    const identity = parseIdentityRef(ref);
    if (!identity || identity.graph_id !== graphId) throw new UsageError("identity history query crosses graph ownership");
    return identity.node_id;
  }).sort();
  const roots = getWorkspaceDocRoots(root, target.config).flatMap((entry) =>
    ["core", "design", "work", "archive"].map((folder) => `${path.relative(root, entry.root).split(path.sep).join("/")}/${folder}`));
  for (let offset = 0; offset < ids.length; offset += 64) {
    search(["-G", `node_id:.*(${ids.slice(offset, offset + 64).join("|")})`], roots);
  }
  const present = new Set<string>();
  const acceptances = new Map<string, ReconciliationAcceptance>();
  const applied = readAppliedReconciliationReceipts(root);
  const snapshots = new Map<string, AuthoredSnapshot>();
  const snapshotAt = (revision: string | null) => {
    if (revision === null) return target;
    if (!snapshots.has(revision)) snapshots.set(revision, readAuthoredSnapshot(root, revision));
    return snapshots.get(revision)!;
  };
  const inspectEvidence = (evidence: AuthoredSnapshot["identity_evidence"], revision: string | null) => {
    for (const [file, item] of Object.entries(evidence ?? {})) {
      const acceptance = readReconciliationAcceptance(file, item.content, graphId, revision);
      if (!acceptance || acceptances.has(acceptance.hash)) continue;
      if (readGraphGit(root, ["merge-base", "--is-ancestor", acceptance.target.revision, revision ?? head], true) === undefined) continue;
      const binding = evidence?.[reconciliationAcceptancePath(file)];
      if (binding && !matchesReconciliationAcceptance(binding.content, file, item.content)) {
        throw new UsageError(`target acceptance does not bind its exact receipt: ${file}`);
      }
      // A copied receipt in a genuine journal's writes is not that journal's
      // generated receipt. The separate target-owned binding records acceptance,
      // not a requirement to retain the output unchanged until a Git commit.
      // Incoming bindings are quarantined by the planner, never installed here.
      // Otherwise ordinary pre-commit edits or a clone would silently forget an
      // accepted choice and replay changes that the target already rejected.
      const locallyApplied = applied.get(file) === item.hash;
      if (locallyApplied || binding) acceptances.set(acceptance.hash, acceptance);
    }
  };
  inspectEvidence(target.identity_evidence, null);
  for (const revision of [...revisions].sort()) {
    const manifest = readRevisionFile(root, revision, GRAPH_FORMAT_PATH);
    if (manifest === undefined) continue; // Explicitly legacy history, not an identity source.
    const format = parseGraphFormat(manifest);
    if (format.format_version !== 2 || format.graph_id !== graphId) {
      throw new UsageError("historical graph ownership changed; explicit lineage audit required");
    }
    inspectEvidence(readIdentityEvidence(root, revision), revision);
    if (ids.length > 0) {
      const snapshot = snapshotAt(revision);
      for (const entry of snapshot.nodes) {
        const ref = identityRef(entry.node.identity!);
        if (sought.has(ref)) present.add(ref);
      }
    }
  }
  return { previously_present: [...present].sort(), acceptances: [...acceptances.values()].sort((a, b) => a.path.localeCompare(b.path)),
    inspected_revisions: [...revisions].sort() };
}

export function acceptedSemanticBase(root: string, history: IdentityHistory, incoming: AuthoredSnapshot): ReconciliationAcceptance | undefined {
  const candidates = history.acceptances.filter((entry) =>
    readGraphGit(root, ["merge-base", "--is-ancestor", entry.incoming.revision, incoming.revision!], true) !== undefined);
  // Missing receipt source objects cannot be ignored as if no earlier merge existed.
  for (const entry of history.acceptances) {
    const snapshot = readAuthoredSnapshot(root, entry.incoming.revision);
    if (snapshot.tree_hash !== entry.incoming.tree_hash) throw new UsageError(`receipt source evidence is unavailable or changed: ${entry.path}`);
  }
  const maximal = candidates.filter((candidate) => !candidates.some((other) =>
    other.incoming.revision !== candidate.incoming.revision &&
    readGraphGit(root, ["merge-base", "--is-ancestor", candidate.incoming.revision, other.incoming.revision], true) !== undefined));
  if (new Set(maximal.map((entry) => entry.incoming.revision)).size > 1) {
    throw new UsageError("multiple incomparable accepted semantic bases require an explicit reconciliation decision");
  }
  return maximal[0];
}
