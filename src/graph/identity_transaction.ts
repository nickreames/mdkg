import path from "path";
import { loadConfig } from "../core/config";
import {
  atomicReplaceContainedFile, containedPathExists, readContainedDirectory, readContainedFile,
  removeContainedPath, withContainedPathSink, writeContainedFileExclusive,
} from "../core/filesystem_authority";
import { UsageError } from "../util/errors";
import { withMutationLock } from "../util/lock";
import { canonicalJson, GRAPH_FORMAT_PATH, identityHash } from "./identity";
import { GraphFileChange, IdentityPlanBase, publicMigrationPlan } from "./identity_migration";
import { graphControlSnapshot, indexAuthoredSnapshot, readAuthoredSnapshot, readIdentityEvidence } from "./identity_snapshot";
import { getWorkspaceDocRoots, listWorkspaceDocFilesByAlias } from "./workspace_files";
import { writeDerivedIndexes } from "./reindex";
import { buildIndex } from "./indexer";
import { assertCompleteIdentityHistory } from "./identity_history";
import { verifyLegacyLineage } from "./identity_legacy_lineage";
import { validateReconciliationCandidate } from "./identity_reconciliation_plan";
import { buildSkillsIndex } from "./skills_indexer";
import { ACCEPTANCE_DIRECTORY, matchesReconciliationAcceptance, reconciliationAcceptancePath } from "./identity_acceptance";

const JOURNAL_DIR = ".mdkg/state/identity-transactions";
type TransactionState = "applying" | "applied" | "rolling-back" | "rolled-back";
type GraphJournal = { schema_version: 1; state: TransactionState; plan: IdentityPlanBase };
export type GraphTransactionHooks = {
  /** Test-only in-process hook; never exposed as a CLI flag or environment variable. */
  afterWrite?: (path: string, index: number) => void;
};

function journalPath(hash: string): string {
  if (!/^sha256:[0-9a-f]{64}$/.test(hash)) throw new UsageError("graph transaction requires the exact sha256 plan hash");
  return `${JOURNAL_DIR}/${hash.slice(7)}.json`;
}

function value(root: string, relativePath: string): string | null {
  return containedPathExists({ root, relativePath }) ? readContainedFile({ root, relativePath }) : null;
}

function put(root: string, change: GraphFileChange, desired: string | null): void {
  const current = value(root, change.path);
  if (current !== change.before && current !== change.after) throw new UsageError(`graph transaction custody collision: ${change.path}`);
  if (current === desired) return;
  if (desired === null) removeContainedPath({ root, relativePath: change.path });
  else if (current === null) writeContainedFileExclusive({ root, relativePath: change.path }, desired);
  else atomicReplaceContainedFile({ root, relativePath: change.path }, desired);
}

function saveJournal(root: string, journal: GraphJournal): void {
  atomicReplaceContainedFile({ root, relativePath: journalPath(journal.plan.plan_hash), mode: 0o600 }, `${JSON.stringify(journal, null, 2)}\n`);
}

function checkPlan(root: string, plan: IdentityPlanBase, expectedHash: string): void {
  const { plan_hash: hash, ...body } = plan;
  if (!expectedHash || expectedHash !== hash || identityHash(canonicalJson(body)) !== hash) {
    throw new UsageError("graph apply requires the exact unchanged reviewed plan hash");
  }
  if (plan.schema_version !== 1 || !["graph.migrate.plan", "graph.reconcile.plan"].includes(plan.action) || !Array.isArray(plan.writes) || plan.blocking.length > 0) {
    throw new UsageError("unsupported or blocked graph transaction plan");
  }
  const config = loadConfig(root);
  const roots = getWorkspaceDocRoots(root, config).map((entry) => path.relative(root, entry.root).split(path.sep).join("/"));
  const seen = new Set<string>();
  for (const change of plan.writes) {
    if (typeof change.path !== "string" || seen.has(change.path) ||
      ![change.before, change.after].every((item) => item === null || typeof item === "string")) {
      throw new UsageError("invalid graph transaction operation");
    }
    const nodePath = roots.some((wsRoot) => {
      const local = path.posix.relative(wsRoot, change.path);
      return /^(core|design|work|archive)\/.+\.md$/.test(local) && local !== "core/core.md" &&
        !local.split("/").includes("source");
    });
    const identityReceipt = /^\.mdkg\/identity\/(migrations|reconciliations|templates|forks|acceptances|transported)\/[0-9a-f]{64}\.json$/.test(change.path);
    if (!nodePath && change.path !== GRAPH_FORMAT_PATH && !identityReceipt) {
      throw new UsageError(`graph transaction cannot own path ${change.path}`);
    }
    if (plan.action === "graph.reconcile.plan" && (change.path === GRAPH_FORMAT_PATH || (identityReceipt && change.before !== null))) {
      throw new UsageError("reconciliation cannot replace the owning format or immutable identity evidence");
    }
    if (change.path.startsWith(ACCEPTANCE_DIRECTORY)) {
      const ownReceipt = plan.writes.find((entry) => entry.path === plan.receipt_path);
      if (plan.action !== "graph.reconcile.plan" || change.path !== reconciliationAcceptancePath(plan.receipt_path) ||
        !change.after || !ownReceipt?.after || !matchesReconciliationAcceptance(change.after, plan.receipt_path, ownReceipt.after)) {
        throw new UsageError("graph transaction can accept only its own exact generated reconciliation receipt");
      }
    }
    withContainedPathSink({ root, relativePath: change.path, operation: "read" }, () => undefined);
    seen.add(change.path);
  }
  if (!seen.has(plan.receipt_path) && !(plan.action === "graph.reconcile.plan" && plan.writes.length === 0)) throw new UsageError("graph transaction is missing its durable identity receipt");
  withContainedPathSink({ root, relativePath: journalPath(hash), operation: "read" }, () => undefined);
}

function checkControl(root: string, plan: IdentityPlanBase, recovering = false): void {
  const actual = graphControlSnapshot(root);
  // Older journals omitted these optional controls. They remain recoverable
  // only while no WAL/journal is present; never infer absent database writes.
  const expected = { runtime_wal: null, runtime_journal: null, ...plan.control };
  // The manifest is an owned operation during partial application/recovery.
  // Its exact bytes are checked below; every other control must remain frozen.
  const stripFormat = (input: typeof actual) => { const { format: _format, ...rest } = input; return rest; };
  if (canonicalJson(recovering ? stripFormat(actual) : actual) !== canonicalJson(recovering ? stripFormat(expected) : expected)) {
    throw new UsageError("graph control baseline moved (HEAD, branch, Git index, selection, runtime DB or validation contract); preserve state and re-plan");
  }
  for (const [file, expectedHash] of Object.entries(plan.dependency_files ?? {})) {
    const actualHash = containedPathExists({ root, relativePath: file }) ? identityHash(readContainedFile({ root, relativePath: file }, null)) : null;
    if (actualHash !== expectedHash) throw new UsageError(`graph dependency baseline moved: ${file}`);
  }
  if (plan.skill_dependency_paths) {
    const paths = Object.values(buildSkillsIndex(root, loadConfig(root)).skills).map((skill) => skill.path).sort();
    if (canonicalJson(paths) !== canonicalJson(plan.skill_dependency_paths)) throw new UsageError("graph skill dependency inventory moved; preserve state and re-plan");
  }
}

function checkRevisions(root: string, plan: IdentityPlanBase): void {
  if (plan.action === "graph.reconcile.plan") assertCompleteIdentityHistory(root);
  if (plan.action === "graph.migrate.plan" && plan.control.head) {
    if (!plan.legacy_lineage) throw new UsageError("legacy migration plan lacks reviewed continuity evidence; preserve journal and re-plan before application");
    verifyLegacyLineage(root, plan.legacy_lineage);
  }
  for (const evidence of plan.revision_evidence ?? []) {
    if (readAuthoredSnapshot(root, evidence.revision).tree_hash !== evidence.tree_hash) throw new UsageError(`reviewed revision evidence changed: ${evidence.revision}`);
  }
}

function checkRecoveryCustody(root: string, plan: IdentityPlanBase): void {
  checkControl(root, plan, true);
  const config = loadConfig(root);
  const actualPaths = new Set<string>([".mdkg/config.json"]);
  for (const files of Object.values(listWorkspaceDocFilesByAlias(root, config))) {
    for (const file of files) {
      if (path.basename(file) === "core.md" && path.basename(path.dirname(file)) === "core") continue;
      actualPaths.add(path.relative(root, file).split(path.sep).join("/"));
    }
  }
  if (containedPathExists({ root, relativePath: GRAPH_FORMAT_PATH })) actualPaths.add(GRAPH_FORMAT_PATH);
  for (const file of Object.keys(readIdentityEvidence(root))) actualPaths.add(file);
  const changes = new Map(plan.writes.map((change) => [change.path, change]));
  const allowedPaths = new Set([...Object.keys(plan.input_files), ...changes.keys()]);
  for (const file of actualPaths) {
    if (!allowedPaths.has(file)) throw new UsageError(`graph recovery found new unowned input: ${file}`);
  }
  for (const [file, hash] of Object.entries(plan.input_files)) {
    if (changes.has(file)) continue;
    const current = value(root, file);
    if (current === null || identityHash(current) !== hash) throw new UsageError(`graph recovery input moved: ${file}`);
  }
  for (const change of plan.writes) {
    const current = value(root, change.path);
    if (current !== change.before && current !== change.after) throw new UsageError(`graph recovery custody collision: ${change.path}; user bytes preserved`);
  }
}

function readJournal(root: string, hash: string): GraphJournal {
  const raw = value(root, journalPath(hash));
  if (raw === null) throw new UsageError("graph transaction journal is missing; no recovery attempted");
  const journal = JSON.parse(raw) as GraphJournal;
  if (journal.schema_version !== 1 || !["applying", "applied", "rolling-back", "rolled-back"].includes(journal.state) || !journal.plan) {
    throw new UsageError("invalid graph transaction journal; preserve for investigation");
  }
  checkPlan(root, journal.plan, hash);
  return journal;
}

function checkOtherTransactions(root: string, hash: string): void {
  if (!containedPathExists({ root, relativePath: JOURNAL_DIR })) return;
  for (const entry of readContainedDirectory({ root, relativePath: JOURNAL_DIR })) {
    if (!/^[0-9a-f]{64}\.json$/.test(entry.name) || !entry.isFile()) {
      throw new UsageError("unclassifiable graph transaction journal; preserve state and inspect ownership");
    }
    const otherHash = `sha256:${entry.name.slice(0, -5)}`;
    if (otherHash === hash) continue;
    const other = readJournal(root, otherHash);
    if (other.state === "applying" || other.state === "rolling-back") {
      throw new UsageError(`another graph transaction is unfinished: ${otherHash}`);
    }
  }
}

export function assertNoPendingIdentityTransaction(root: string): void {
  checkOtherTransactions(root, "");
}

// Ignored checkout-local journals are not imported graph evidence. This also
// supports pre-binding v2 receipts while their genuine applied journal survives.
export function readAppliedReconciliationReceipts(root: string): Map<string, string> {
  const receipts = new Map<string, string>();
  if (!containedPathExists({ root, relativePath: JOURNAL_DIR })) return receipts;
  const control = graphControlSnapshot(root);
  for (const entry of readContainedDirectory({ root, relativePath: JOURNAL_DIR })) {
    if (!entry.isFile() || !/^[0-9a-f]{64}\.json$/.test(entry.name)) throw new UsageError("unclassifiable graph transaction journal");
    const journal = readJournal(root, `sha256:${entry.name.slice(0, -5)}`);
    if (journal.state !== "applied" || journal.plan.action !== "graph.reconcile.plan") continue;
    if (journal.plan.control.branch !== control.branch || (!control.branch && journal.plan.control.head !== control.head)) continue;
    const own = journal.plan.writes.find((change) => change.path === journal.plan.receipt_path);
    if (own?.before === null && own.after !== null) receipts.set(own.path, identityHash(own.after));
  }
  return receipts;
}

function checkTerminal(root: string, journal: GraphJournal, rollback: boolean): void {
  checkRecoveryCustody(root, journal.plan);
  for (const change of journal.plan.writes) {
    if (value(root, change.path) !== (rollback ? change.before : change.after)) {
      throw new UsageError(`completed graph transaction no longer matches its terminal bytes: ${change.path}`);
    }
  }
}

function finish(root: string, journal: GraphJournal, rollback: boolean): void {
  checkTerminal(root, journal, rollback);
  // Exact rollback restores owned before-bytes; it does not approve the old
  // identity mapping. Preserve recovery for pre-lineage migration journals.
  if (!rollback || journal.plan.action !== "graph.migrate.plan") checkRevisions(root, journal.plan);
  const snapshot = readAuthoredSnapshot(root);
  if (journal.plan.action === "graph.reconcile.plan") {
    const candidate = validateReconciliationCandidate(root, snapshot);
    if (candidate.blocking.length) throw new UsageError(`strict reconciliation validation failed: ${candidate.blocking.join("; ")}`);
  } else indexAuthoredSnapshot(snapshot);
  const config = loadConfig(root);
  // Only local derived caches are regenerated; no bundles, subgraph refresh,
  // provider interaction, Git staging, selected state, queue or claim writes.
  writeDerivedIndexes(root, config, buildIndex(root, config, { tolerant: false }), { tolerant: false });
  journal.state = rollback ? "rolled-back" : "applied";
  saveJournal(root, journal);
}

function receipt(journal: GraphJournal) {
  return {
    action: "graph.transaction", ok: true, state: journal.state,
    plan_hash: journal.plan.plan_hash, journal_path: journalPath(journal.plan.plan_hash),
    receipt_path: journal.state === "rolled-back" ? null : journal.plan.receipt_path,
    authored_paths: journal.plan.writes.map((change) => change.path),
    derived_state: "local indexes rebuilt after strict authored validation",
    git_staging: "unchanged", execution_state: "unchanged",
  };
}

export function applyGraphMigrationPlan(root: string, plan: IdentityPlanBase, expectedHash: string, hooks: GraphTransactionHooks = {}) {
  checkPlan(root, plan, expectedHash);
  const existingJournal = value(root, journalPath(plan.plan_hash));
  if (existingJournal !== null) throw new UsageError("graph transaction already exists; inspect it and explicitly resume or roll back");
  const check = () => {
    checkOtherTransactions(root, plan.plan_hash);
    checkControl(root, plan);
    checkRevisions(root, plan);
    const current = readAuthoredSnapshot(root);
    if (current.tree_hash !== plan.input_tree_hash || canonicalJson(current.files) !== canonicalJson(plan.input_files)) {
      throw new UsageError("stale graph plan: authored input inventory changed");
    }
    for (const change of plan.writes) {
      if (value(root, change.path) !== change.before) throw new UsageError(`stale graph operation: ${change.path}`);
    }
  };
  check(); // Refuse stale inputs without creating a lock, directory or journal.
  if (plan.action === "graph.reconcile.plan" && plan.writes.length === 0) return {
    action: "graph.reconcile.noop", ok: true, plan_hash: plan.plan_hash,
    historical_receipt_path: plan.receipt_path, authored_paths: [], git_staging: "unchanged", side_effects: "none",
  };
  return withMutationLock(root, loadConfig(root).index.lock_timeout_ms, () => {
    check();
    if (value(root, journalPath(plan.plan_hash)) !== null) throw new UsageError("graph journal appeared during preflight");
    const journal: GraphJournal = { schema_version: 1, state: "applying", plan };
    saveJournal(root, journal);
    for (const [index, change] of plan.writes.entries()) {
      checkRecoveryCustody(root, plan);
      put(root, change, change.after);
      hooks.afterWrite?.(change.path, index);
    }
    finish(root, journal, false);
    return receipt(journal);
  });
}

export function continueGraphTransaction(root: string, hash: string, mode: "resume" | "rollback", hooks: GraphTransactionHooks = {}) {
  const journal = readJournal(root, hash);
  if (mode !== "rollback" || journal.plan.action !== "graph.migrate.plan") checkRevisions(root, journal.plan);
  checkOtherTransactions(root, hash);
  if ((mode === "resume" && journal.state === "applied") || (mode === "rollback" && journal.state === "rolled-back")) {
    checkTerminal(root, journal, mode === "rollback");
    return receipt(journal);
  }
  if (mode === "resume" && ["rolling-back", "rolled-back"].includes(journal.state)) throw new UsageError("rollback was requested; it cannot be resumed as application");
  checkRecoveryCustody(root, journal.plan);
  return withMutationLock(root, loadConfig(root).index.lock_timeout_ms, () => {
    checkOtherTransactions(root, hash);
    if (canonicalJson(readJournal(root, hash)) !== canonicalJson(journal)) throw new UsageError("graph journal changed during recovery preflight");
    checkRecoveryCustody(root, journal.plan);
    journal.state = mode === "rollback" ? "rolling-back" : "applying";
    saveJournal(root, journal);
    const changes = mode === "rollback" ? [...journal.plan.writes].reverse() : journal.plan.writes;
    for (const [index, change] of changes.entries()) {
      checkRecoveryCustody(root, journal.plan);
      put(root, change, mode === "rollback" ? change.before : change.after);
      hooks.afterWrite?.(change.path, index);
    }
    finish(root, journal, mode === "rollback");
    return receipt(journal);
  });
}

export function inspectGraphTransaction(root: string, hash: string) {
  const journal = readJournal(root, hash);
  const paths = journal.plan.writes.map((change) => {
    const current = value(root, change.path);
    return { path: change.path, observed_hash: current === null ? null : identityHash(current),
      state: current === change.after ? "after" : current === change.before ? "before" : "custody-collision" };
  });
  return { action: "graph.transaction.inspect", state: journal.state,
    journal_path: journalPath(hash), paths, completed_write_paths: paths.filter((entry) => entry.state === "after").map((entry) => entry.path),
    collision_paths: paths.filter((entry) => entry.state === "custody-collision").map((entry) => entry.path),
    plan: publicMigrationPlan(journal.plan), side_effects: "none" };
}
