import path from "path";
import { loadConfig, validateConfigSchema } from "../core/config";
import { identityWriterConfig, migrateConfig } from "../core/migrate";
import {
  atomicReplaceContainedFile, containedPathExists, readContainedDirectory, readContainedFile,
  removeContainedPath, withContainedPathSink, writeContainedFileExclusive,
} from "../core/filesystem_authority";
import { UsageError } from "../util/errors";
import { heldMutationLock, withMutationLock, withRecoveredMutationLock } from "../util/lock";
import { assertOrphanLock, MutationLockRecord, readMutationLock, lockRecordHash } from "../util/lock_evidence";
import { canonicalJson, GRAPH_FORMAT_PATH, identityHash, parseGraphFormat } from "./identity";
import { GraphFileChange, IdentityPlanBase, publicMigrationPlan } from "./identity_migration";
import { AuthoredSnapshot, graphControlSnapshot, indexAuthoredSnapshot, readAuthoredSnapshot, readIdentityEvidence } from "./identity_snapshot";
import { getWorkspaceDocRoots, listWorkspaceDocFilesByAlias } from "./workspace_files";
import { writeDerivedIndexes } from "./reindex";
import { buildIndex } from "./indexer";
import { assertCompleteIdentityHistory } from "./identity_history";
import { verifyLegacyLineage } from "./identity_legacy_lineage";
import { assertCandidateDependencies, candidateDependencyWriteConflicts, graphDependencyHash, identityDerivedOutputConflicts, validateIdentityCandidate } from "./identity_validation";
import { buildSkillsIndex } from "./skills_indexer";
import { ALLOWED_TYPES, parseNode } from "./node";
import { loadTemplateSchemas } from "./template_schema";
import { workspaceDocumentOwner } from "./workspace_ownership";
import { ACCEPTANCE_DIRECTORY, matchesReconciliationAcceptance, reconciliationAcceptancePath } from "./identity_acceptance";

const JOURNAL_DIR = ".mdkg/state/identity-transactions";
type TransactionState = "applying" | "applied" | "rolling-back" | "rolled-back";
type GraphJournal = { schema_version: 1; state: TransactionState; plan: IdentityPlanBase; lock_epochs?: MutationLockRecord[] };
export type GraphTransactionHooks = {
  /** Test-only in-process hook; never exposed as a CLI flag or environment variable. */
  afterWrite?: (path: string, index: number) => void;
  /** Complete claim publication, before journal mirroring. Test-only. */
  afterClaim?: () => void;
  /** Complete journal publication, including terminal state. Test-only. */
  afterJournal?: (state: TransactionState) => void;
};

function journalPath(hash: string): string {
  if (!/^sha256:[0-9a-f]{64}$/.test(hash)) throw new UsageError("graph transaction requires the exact sha256 plan hash");
  return `${JOURNAL_DIR}/${hash.slice(7)}.json`;
}

function value(root: string, relativePath: string): string | null {
  if (!containedPathExists({ root, relativePath })) return null;
  const bytes = readContainedFile({ root, relativePath }, null), text = bytes.toString("utf8");
  if (!Buffer.from(text).equals(bytes)) throw new UsageError(`graph transaction input is not exact UTF-8: ${relativePath}; bytes preserved`);
  return text;
}

function put(root: string, change: GraphFileChange, desired: string | null): void {
  const current = value(root, change.path);
  if (current !== change.before && current !== change.after) throw new UsageError(`graph transaction custody collision: ${change.path}`);
  if (current === desired) return;
  if (desired === null) removeContainedPath({ root, relativePath: change.path });
  else if (current === null) writeContainedFileExclusive({ root, relativePath: change.path }, desired);
  else atomicReplaceContainedFile({ root, relativePath: change.path }, desired);
}

type JournalGuard = { check(): void; save(journal: GraphJournal): void };
function journalInventory(root: string, except?: string): Record<string, string> {
  if (!containedPathExists({ root, relativePath: JOURNAL_DIR })) return {};
  return Object.fromEntries(readContainedDirectory({ root, relativePath: JOURNAL_DIR }).filter(entry => entry.name !== except).map(entry => {
    if (!entry.isFile() || !/^[0-9a-f]{64}\.json$/.test(entry.name)) throw new UsageError("unclassifiable graph journal evidence; preserve state");
    return [entry.name, identityHash(value(root, `${JOURNAL_DIR}/${entry.name}`)!)];
  }));
}
function journalGuard(root: string, hash: string, expected: string | null, hooks: GraphTransactionHooks): JournalGuard {
  const name = `${hash.slice(7)}.json`, others = canonicalJson(journalInventory(root, name));
  checkOtherTransactions(root, hash);
  const check = () => {
    heldMutationLock(root);
    if (value(root, journalPath(hash)) !== expected) throw new UsageError("graph journal byte custody changed; preserve evidence and inspect again");
    if (canonicalJson(journalInventory(root, name)) !== others) throw new UsageError("graph journal inventory/byte custody changed; preserve evidence and inspect again");
  };
  return { check, save(journal) {
    check();
    const next = `${JSON.stringify(journal, null, 2)}\n`;
    atomicReplaceContainedFile({ root, relativePath: journalPath(hash), mode: 0o600 }, next);
    expected = next; check(); hooks.afterJournal?.(journal.state); check();
  } };
}

function bindCurrentLock(root: string, journal: GraphJournal): void {
  const record = heldMutationLock(root), epochs = journal.lock_epochs ?? [];
  if (!Array.isArray(epochs) || epochs.length >= 128) throw new UsageError("graph journal lock history is invalid or full; preserve for investigation");
  const previous = epochs[epochs.length - 1];
  // Mirroring a recovery claim extends its existing epoch; a normal retry after
  // caught-error release starts a new epoch without discarding original proof.
  if (previous && canonicalJson(previous.directory) === canonicalJson(record.directory) &&
    previous.files?.find(file => file.name === "owner.json")?.content === record.files.find(file => file.name === "owner.json")?.content) {
    journal.lock_epochs = [...epochs.slice(0, -1), record];
  } else journal.lock_epochs = [...epochs, record];
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
    const configFence = change.path === ".mdkg/config.json";
    if (configFence && (plan.action !== "graph.migrate.plan" || change.before === null || change.after === null ||
      identityHash(change.before) !== plan.input_files[change.path] ||
      change.after !== `${JSON.stringify(identityWriterConfig(JSON.parse(change.before)), null, 2)}\n` || plan.writes[0] !== change)) {
      throw new UsageError("migration may own only its exact first-operation compatible-writer config fence");
    }
    if (!nodePath && change.path !== GRAPH_FORMAT_PATH && !identityReceipt && !configFence) {
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
  if (!plan.candidate_validation) for (const [file, expectedHash] of Object.entries(plan.dependency_files ?? {})) {
    const actualHash = graphDependencyHash(root, file);
    if (actualHash !== expectedHash) throw new UsageError(`graph dependency baseline moved: ${file}`);
  }
  if (plan.candidate_validation) assertCandidateDependencies(root, loadConfig(root), plan.dependency_files ?? {}, plan.candidate_validation);
  if (!plan.candidate_validation && plan.skill_dependency_paths) {
    const paths = Object.values(buildSkillsIndex(root, loadConfig(root)).skills).map((skill) => skill.path).sort();
    if (canonicalJson(paths) !== canonicalJson(plan.skill_dependency_paths)) throw new UsageError("graph skill dependency inventory moved; preserve state and re-plan");
  }
}

/** Reconstruct the terminal graph from reviewed operations and untouched inputs,
 * never from parsing a partially migrated working tree. No temporary checkout,
 * identity invention, dependency refresh, journal or cache write is involved.
 */
function checkCandidate(root: string, plan: IdentityPlanBase): void {
  if (!plan.candidate_validation || !plan.dependency_files) {
    throw new UsageError("graph plan lacks complete candidate validation dependencies; preserve journal for inspection/rollback and re-plan before application");
  }
  const changes = new Map(plan.writes.map((change) => [change.path, change]));
  if (plan.action === "graph.migrate.plan" && !changes.has(".mdkg/config.json")) {
    throw new UsageError("legacy migration plan lacks reviewed writer compatibility fence; preserve journal for inspection/rollback and re-plan before application");
  }
  const contents = new Map<string, string>();
  for (const file of new Set([...Object.keys(plan.input_files), ...changes.keys()])) {
    const content = changes.has(file) ? changes.get(file)!.after : value(root, file);
    if (content !== null) contents.set(file, content);
  }
  const config = validateConfigSchema(migrateConfig(JSON.parse(contents.get(".mdkg/config.json")!)).config);
  const owner = workspaceDocumentOwner(config), templates = loadTemplateSchemas(root, config, ALLOWED_TYPES);
  const formatContent = contents.get(GRAPH_FORMAT_PATH);
  const candidate: AuthoredSnapshot = { revision: null, tree_hash: "", config,
    format: formatContent === undefined ? { format_version: 1 } : parseGraphFormat(formatContent),
    files: {}, nodes: [], identity_evidence: {} };
  for (const [file, content] of contents) {
    candidate.files[file] = identityHash(content);
    if (file.startsWith(".mdkg/identity/")) candidate.identity_evidence![file] = { content, hash: identityHash(content) };
    else if (file.endsWith(".md")) {
      const ws = owner(file);
      if (!ws || !config.workspaces[ws].enabled) throw new UsageError(`candidate node lacks enabled authored ownership: ${file}`);
      const node = parseNode(content, path.resolve(root, file), {
        workStatusEnum: config.work.status_enum, priorityMin: config.work.priority_min,
        priorityMax: config.work.priority_max, templateSchemas: templates, deferArchiveIntegrity: true,
      });
      candidate.nodes.push({ path: file, ws, qid: `${ws}:${node.id}`, content, node, hash: identityHash(content) });
    }
  }
  candidate.tree_hash = identityHash(canonicalJson(candidate.files));
  const validated = validateIdentityCandidate(root, candidate);
  validated.blocking.push(...candidateDependencyWriteConflicts(plan.writes, validated.dependencies, validated.contract));
  if (validated.blocking.length) throw new UsageError(`strict candidate validation failed: ${validated.blocking.join("; ")}`);
  if (canonicalJson(validated.dependencies) !== canonicalJson(plan.dependency_files) ||
    canonicalJson(validated.contract) !== canonicalJson(plan.candidate_validation)) {
    throw new UsageError("graph candidate dependency manifest is incomplete or changed; re-plan before application");
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

function checkDerivedOwnership(root: string, plan: IdentityPlanBase): void {
  const errors = identityDerivedOutputConflicts(root, loadConfig(root),
    [...Object.keys(plan.input_files), ...plan.writes.map((change) => change.path)], Object.keys(plan.dependency_files ?? {}));
  if (errors.length) throw new UsageError(errors.join("; "));
}

function finish(root: string, journal: GraphJournal, rollback: boolean, guard: JournalGuard): void {
  guard.check();
  checkTerminal(root, journal, rollback);
  // Exact rollback restores owned before-bytes; it does not approve the old
  // identity mapping. Preserve recovery for pre-lineage migration journals.
  if (!rollback || journal.plan.action !== "graph.migrate.plan") checkRevisions(root, journal.plan);
  const snapshot = readAuthoredSnapshot(root);
  if (!rollback) {
    checkCandidate(root, journal.plan);
    const candidate = validateIdentityCandidate(root, snapshot);
    if (candidate.blocking.length) throw new UsageError(`strict candidate validation failed: ${candidate.blocking.join("; ")}`);
  } else indexAuthoredSnapshot(snapshot);
  const config = loadConfig(root);
  checkDerivedOwnership(root, journal.plan);
  guard.check();
  // Only local derived caches are regenerated; no bundles, subgraph refresh,
  // provider interaction, Git staging, selected state, queue or claim writes.
  writeDerivedIndexes(root, config, buildIndex(root, config, { tolerant: false }), { tolerant: false });
  // A successful cache rebuild is not proof that authored/control custody held.
  // Recheck bookends before giving the journal its terminal success state.
  checkTerminal(root, journal, rollback);
  guard.check();
  if (!rollback) checkCandidate(root, journal.plan);
  journal.state = rollback ? "rolled-back" : "applied";
  guard.save(journal);
}

function receipt(journal: GraphJournal) {
  return {
    action: "graph.transaction", ok: true, state: journal.state,
    plan_hash: journal.plan.plan_hash, journal_path: journalPath(journal.plan.plan_hash),
    receipt_path: journal.state === "rolled-back" ? null : journal.plan.receipt_path,
    authored_paths: journal.plan.writes.map((change) => change.path),
    derived_state: "local indexes rebuilt after strict authored validation",
    candidate_validation: journal.state === "rolled-back" ? "exact before-byte restoration; not candidate approval" : journal.plan.candidate_validation?.version ?? "legacy-unbound",
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
    checkCandidate(root, plan);
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
    const guard = journalGuard(root, plan.plan_hash, null, hooks);
    bindCurrentLock(root, journal);
    guard.save(journal);
    for (const [index, change] of plan.writes.entries()) {
      checkRecoveryCustody(root, plan);
      guard.check();
      put(root, change, change.after);
      hooks.afterWrite?.(change.path, index);
    }
    finish(root, journal, false, guard);
    return receipt(journal);
  }, { plan_hash: plan.plan_hash, mode: "apply" });
}

function checkRecoveryRequest(root: string, journal: GraphJournal, mode: "resume" | "rollback"): void {
  const hash = journal.plan.plan_hash;
  if (mode !== "rollback" || journal.plan.action !== "graph.migrate.plan") checkRevisions(root, journal.plan);
  checkOtherTransactions(root, hash);
  checkDerivedOwnership(root, journal.plan);
  if (mode === "resume" && ["rolling-back", "rolled-back"].includes(journal.state)) throw new UsageError("rollback was requested; it cannot be resumed as application");
  checkRecoveryCustody(root, journal.plan);
  if (mode === "resume") {
    checkCandidate(root, journal.plan);
  }
}

function recoveryBytes(root: string, journal: GraphJournal): string {
  const files = Object.fromEntries([...new Set([...Object.keys(journal.plan.input_files), ...journal.plan.writes.map(op => op.path)])].sort().map(file => {
    const content = value(root, file); return [file, content === null ? null : identityHash(content)];
  }));
  const dependencies = Object.fromEntries(Object.keys(journal.plan.dependency_files ?? {}).sort().map(file => [file, graphDependencyHash(root, file)]));
  const journals = journalInventory(root);
  return identityHash(canonicalJson({ files, dependencies, journals, control: graphControlSnapshot(root) }));
}

function recoveryReview(root: string, journal: GraphJournal, mode: "resume" | "rollback", expectedJournal: string) {
  checkRecoveryRequest(root, journal, mode);
  if ((mode === "resume" && journal.state === "applied") || (mode === "rollback" && journal.state === "rolled-back")) checkTerminal(root, journal, mode === "rollback");
  if (value(root, journalPath(journal.plan.plan_hash)) !== expectedJournal || canonicalJson(JSON.parse(expectedJournal)) !== canonicalJson(journal)) throw new UsageError("graph journal byte custody changed; inspect again");
  const record = readMutationLock(root), journalHash = identityHash(expectedJournal);
  const journalRecord = journal.lock_epochs?.[journal.lock_epochs.length - 1];
  if (record) assertOrphanLock(root, record, journalRecord, journal.plan.plan_hash, journalHash, mode);
  const bytes = recoveryBytes(root, journal);
  const approval = record ? identityHash(canonicalJson({ schema_version: 1, action: "graph.recover.lock", mode,
    plan_hash: journal.plan.plan_hash, journal_hash: journalHash, lock_hash: lockRecordHash(record), input_hash: bytes })) : null;
  return { record, journal_record: journalRecord, journal_hash: journalHash, bytes, approval };
}

export function continueGraphTransaction(root: string, hash: string, mode: "resume" | "rollback", hooks: GraphTransactionHooks = {}, lockEvidence?: string) {
  const journal = readJournal(root, hash), raw = value(root, journalPath(hash))!;
  const review = recoveryReview(root, journal, mode, raw);
  if (review.record && (!lockEvidence || lockEvidence !== review.approval)) throw new UsageError("orphan lock requires the exact fresh --lock-evidence from read-only graph recover inspection");
  if (!review.record && lockEvidence) throw new UsageError("reviewed orphan lock is no longer present; no recovery attempted");
  if ((mode === "resume" && journal.state === "applied") || (mode === "rollback" && journal.state === "rolled-back")) {
    checkTerminal(root, journal, mode === "rollback");
    if (!review.record) return receipt(journal); // Preserve observational terminal repeat.
  }
  const execute = () => {
    if (review.record) hooks.afterClaim?.();
    const guard = journalGuard(root, hash, raw, hooks);
    guard.check();
    checkRecoveryRequest(root, journal, mode);
    if (recoveryBytes(root, journal) !== review.bytes) throw new UsageError("graph recovery evidence changed after approval; preserve state and inspect again");
    bindCurrentLock(root, journal);
    journal.state = mode === "rollback" ? "rolling-back" : "applying";
    guard.save(journal);
    const changes = mode === "rollback" ? [...journal.plan.writes].reverse() : journal.plan.writes;
    for (const [index, change] of changes.entries()) {
      checkRecoveryCustody(root, journal.plan);
      guard.check();
      put(root, change, mode === "rollback" ? change.before : change.after);
      hooks.afterWrite?.(change.path, index);
    }
    finish(root, journal, mode === "rollback", guard);
    return receipt(journal);
  };
  return review.record ? withRecoveredMutationLock(root, { ...review, record: review.record,
    approval_hash: review.approval!, plan_hash: hash, mode }, execute)
    : withMutationLock(root, loadConfig(root).index.lock_timeout_ms, execute, { plan_hash: hash, mode });
}

export function inspectGraphTransaction(root: string, hash: string) {
  const journal = readJournal(root, hash);
  const raw = value(root, journalPath(hash))!;
  const paths = journal.plan.writes.map((change) => {
    const current = value(root, change.path);
    return { path: change.path, observed_hash: current === null ? null : identityHash(current),
      state: current === change.after ? "after" : current === change.before ? "before" : "custody-collision" };
  });
  const recovery = Object.fromEntries((["resume", "rollback"] as const).map(mode => {
    try {
      const review = recoveryReview(root, journal, mode, raw);
      return [mode, { ready: true, lock_evidence: review.approval, lock_state: review.record ? "proven-orphan" : "absent" }];
    } catch (error) {
      return [mode, { ready: false, lock_evidence: null, reason: error instanceof Error ? error.message : "ownership evidence unavailable" }];
    }
  }));
  return { action: "graph.transaction.inspect", state: journal.state, recovery,
    journal_path: journalPath(hash), paths, completed_write_paths: paths.filter((entry) => entry.state === "after").map((entry) => entry.path),
    collision_paths: paths.filter((entry) => entry.state === "custody-collision").map((entry) => entry.path),
    plan: publicMigrationPlan(journal.plan), side_effects: "none" };
}
