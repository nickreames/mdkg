import { UsageError } from "../util/errors";
import { canonicalJson, identityHash } from "./identity";
import type { AuthoredSnapshot } from "./identity_snapshot";

export const ACCEPTANCE_DIRECTORY = ".mdkg/identity/acceptances/";
export const TRANSPORTED_IDENTITY_DIRECTORY = ".mdkg/identity/transported/";

export function reconciliationAcceptancePath(receiptPath: string): string {
  const match = /^\.mdkg\/identity\/reconciliations\/([0-9a-f]{64})\.json$/.exec(receiptPath);
  if (!match) throw new UsageError("acceptance requires a hash-addressed reconciliation receipt");
  return `${ACCEPTANCE_DIRECTORY}${match[1]}.json`;
}

export function authoredResultHash(snapshot: Pick<AuthoredSnapshot, "nodes">): string {
  return identityHash(canonicalJson(Object.fromEntries(snapshot.nodes.map((entry) => [entry.path, entry.hash]))));
}

// This binding is target-owned authored state, not a signature. Reconciliation
// NEVER transports an incoming binding into this authority namespace. Ordinary
// Git commits/clone selection remain explicit trust decisions over target data.
export function reconciliationAcceptanceContent(receiptPath: string, receiptContent: string): string {
  reconciliationAcceptancePath(receiptPath);
  const receipt = JSON.parse(receiptContent);
  return `${JSON.stringify({
    schema_version: 1, kind: "target-reconciliation-acceptance",
    graph_id: receipt.graph_id, receipt_path: receiptPath,
    receipt_hash: identityHash(receiptContent), intent_hash: receipt.intent_hash,
    target: receipt.target, incoming: receipt.incoming,
    output_authored_hash: receipt.output_authored_hash,
  }, null, 2)}\n`;
}

export function matchesReconciliationAcceptance(binding: string, receiptPath: string, receiptContent: string): boolean {
  return canonicalJson(JSON.parse(binding)) === canonicalJson(JSON.parse(reconciliationAcceptanceContent(receiptPath, receiptContent)));
}

export function transportedIdentityPath(file: string, hash: string): string {
  // Preserve exact binding bytes as inert evidence, including on repeated hops.
  // They must not grant this target acceptance of an incoming branch's choices.
  if (!file.startsWith(ACCEPTANCE_DIRECTORY)) return file;
  if (!/^sha256:[0-9a-f]{64}$/.test(hash)) throw new UsageError("invalid transported identity evidence hash");
  return `${TRANSPORTED_IDENTITY_DIRECTORY}${hash.slice(7)}.json`;
}
