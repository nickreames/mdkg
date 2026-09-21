import fs from "fs";
import path from "path";
import crypto from "crypto";
import { atomicReplaceContainedFile, readContainedFile, withContainedPathSink } from "../core/filesystem_authority";
import { UsageError } from "../util/errors";
import { withMutationLock } from "../util/lock";

export const UPGRADE_JOURNAL = ".mdkg/state/upgrade-journal.json";
export type UpgradeOperation = { path: string; before: string | null; after: string | null };
type Dependencies = { files: Array<[string, string | null]>; directories: Array<[string, string[]]> };
type ApprovedPlan = { extra: unknown; dependencies: Dependencies; operations: UpgradeOperation[] };
type Journal = { schema_version: 1 | 2 | 3; plan_hash: string; operations: UpgradeOperation[]; operations_hash: string;
  approved_plan?: ApprovedPlan;
  dependencies?: Dependencies; dependencies_hash?: string;
  state: "applying" | "recovering" | "completed" | "recovered" };
export const digest = (value: string | Buffer): string => crypto.createHash("sha256").update(value).digest("hex");

// Preserve array order and every own JSON key (including __proto__). Approval
// excludes mutable progress, but includes all observations and operation bytes.
function canonicalPlan(value: unknown): string {
  return JSON.stringify(value, (_key, item) => item && typeof item === "object" && !Array.isArray(item)
    ? Object.fromEntries(Object.entries(item).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)) : item);
}
function assertApprovedPlan(journal: Journal, expected: string): void {
  if (journal.schema_version !== 3) throw new UsageError("unbound legacy upgrade journal; preserve it for explicit investigation; automatic resume/recover refused");
  const approved = journal.approved_plan;
  if (!approved || typeof approved !== "object" || !Array.isArray(approved.operations) || !approved.dependencies ||
      !/^[0-9a-f]{64}$/.test(expected) || journal.plan_hash !== expected || digest(canonicalPlan(approved)) !== expected ||
      canonicalPlan(approved.operations) !== canonicalPlan(journal.operations) ||
      canonicalPlan(approved.dependencies) !== canonicalPlan(journal.dependencies)) {
    throw new UsageError("upgrade journal does not match the exact approved plan; preserve it for explicit investigation");
  }
}

function canonicalPath(relativePath: string): void {
  if (typeof relativePath !== "string" || relativePath.includes("\\") || path.posix.isAbsolute(relativePath) ||
      relativePath.split("/").some(part => !part || part === "." || part === ".." || part.toLowerCase() === ".git")) {
    throw new UsageError("upgrade paths must be canonical slash-relative paths outside Git");
  }
}
function assertPathSpelling(root: string, relativePath: string): void {
  canonicalPath(relativePath);
  withContainedPathSink({ root, relativePath, operation: "read" }, () => {
    let parent = root;
    for (const part of relativePath.split("/")) {
      const next = path.join(parent, part);
      if (!fs.existsSync(next)) break;
      if (!fs.readdirSync(parent).includes(part)) throw new UsageError(`upgrade path spelling differs from filesystem: ${relativePath}`);
      parent = next;
    }
  });
}

function bytes(root: string, relativePath: string): Buffer | null {
  canonicalPath(relativePath);
  return withContainedPathSink({ root, relativePath, operation: "read" }, ({ absolutePath }) =>
    fs.existsSync(absolutePath) ? readContainedFile({ root, relativePath }, null) : null);
}
function encoded(root: string, relativePath: string): string | null {
  return bytes(root, relativePath)?.toString("base64") ?? null;
}
function directoryEntries(root: string, relativePath: string): string[] {
  canonicalPath(relativePath);
  return withContainedPathSink({ root, relativePath, operation: "read" }, ({ absolutePath }) => {
    const entries = fs.existsSync(absolutePath) ? fs.readdirSync(absolutePath).sort() : [];
    // Lock/journal directories are checkout-local transaction infrastructure,
    // not inputs to scaffold or graph migration discovery.
    return relativePath === ".mdkg" ? entries.filter(name => name !== "index" && name !== "state") : entries;
  });
}
function put(root: string, relativePath: string, value: string | null): void {
  if (value === null) {
    withContainedPathSink({ root, relativePath, operation: "delete" }, ({ absolutePath }) => fs.unlinkSync(absolutePath));
  } else atomicReplaceContainedFile({ root, relativePath }, Buffer.from(value, "base64"));
}
function saveJournal(root: string, journal: Journal): void {
  atomicReplaceContainedFile({ root, relativePath: UPGRADE_JOURNAL, mode: 0o600 }, JSON.stringify(journal, null, 2) + "\n");
}
export function readUpgradeJournal(root: string, expectedPlanHash?: string): Journal | undefined {
  const raw = bytes(root, UPGRADE_JOURNAL);
  if (!raw) return undefined;
  const journal = JSON.parse(raw.toString("utf8")) as Journal;
  if (!journal || ![1, 2, 3].includes(journal.schema_version) || !Array.isArray(journal.operations) ||
      digest(JSON.stringify(journal.operations)) !== journal.operations_hash ||
      !["applying", "recovering", "completed", "recovered"].includes(journal.state)) {
    throw new UsageError("invalid upgrade journal; preserve it for explicit investigation");
  }
  // Check approval before reading journal-selected paths, acquiring a lock, or
  // considering terminal-state shortcuts. Legacy journals remain inspectable.
  if (expectedPlanHash !== undefined || journal.schema_version === 3) assertApprovedPlan(journal, expectedPlanHash ?? journal.plan_hash);
  const seen = new Set<string>();
  for (const op of journal.operations) {
    if (!op || typeof op.path !== "string" || op.path.split(/[\\/]/).includes(".git") || op.path === UPGRADE_JOURNAL || seen.has(op.path) ||
        ![op.before, op.after].every(value => value === null || (typeof value === "string" && Buffer.from(value, "base64").toString("base64") === value))) {
      throw new UsageError("invalid upgrade journal operation");
    }
    assertPathSpelling(root, op.path);
    bytes(root, op.path); // Recheck containment, links, and file types.
    seen.add(op.path);
  }
  if (journal.schema_version >= 2) {
    const dependencies = journal.dependencies;
    if (!dependencies || !Array.isArray(dependencies.files) || !Array.isArray(dependencies.directories) ||
        digest(JSON.stringify(dependencies)) !== journal.dependencies_hash) throw new UsageError("invalid upgrade journal dependencies");
    for (const [kind, entries] of [["file", dependencies.files], ["directory", dependencies.directories]] as const) {
      const paths = new Set<string>();
      for (const entry of entries) {
        if (!Array.isArray(entry) || entry.length !== 2) throw new UsageError("invalid upgrade dependency entry");
        const [file, value] = entry;
        if (typeof file !== "string" || paths.has(file) || file.split(/[\\/]/).includes(".git")) throw new UsageError("invalid upgrade dependency path");
        canonicalPath(file);
        withContainedPathSink({ root, relativePath: file, operation: "read" }, () => {});
        if (kind === "file" ? !(value === null || typeof value === "string" && /^[0-9a-f]{64}$/.test(value)) :
          !(Array.isArray(value) && value.every(name => typeof name === "string" && name !== "." && name !== ".." && !/[\\/]/.test(name)) && new Set(value).size === value.length)) {
          throw new UsageError("invalid upgrade dependency value");
        }
        paths.add(file);
      }
    }
  }
  return journal;
}

function assertRecoveryDependencies(root: string, journal: Journal): void {
  if (journal.schema_version < 2) return;
  const operations = new Map(journal.operations.map(op => [op.path, op]));
  for (const [file, expected] of journal.dependencies!.files) {
    if (operations.has(file)) continue; // Operation bytes have their own before/after custody check.
    const actual = bytes(root, file);
    if ((actual === null ? null : digest(actual)) !== expected) throw new UsageError(`stale upgrade dependency: ${file}`);
  }
  for (const [directory, expected] of journal.dependencies!.directories) {
    const variable = new Set<string>();
    for (const op of journal.operations) {
      const relative = path.posix.relative(directory, op.path);
      if (relative === ".." || relative.startsWith("../") || relative === "") continue;
      const parts = relative.split("/");
      // Direct file entries may be before or after. New operation-owned parent
      // directories may already exist after a partial write or rollback.
      if (parts.length === 1 || (!expected.includes(parts[0]) && op.after !== null)) variable.add(parts[0]);
    }
    const stable = (entries: string[]) => JSON.stringify(entries.filter(name => !variable.has(name)).sort());
    if (stable(directoryEntries(root, directory)) !== stable(expected)) throw new UsageError(`stale upgrade directory dependency: ${directory}`);
  }
}

function assertTerminalCustody(root: string, journal: Journal, side: "before" | "after"): void {
  for (const operation of journal.operations) {
    if (encoded(root, operation.path) !== operation[side]) {
      throw new UsageError(`upgrade terminal custody changed: ${operation.path}; user bytes preserved`);
    }
  }
  assertRecoveryDependencies(root, journal);
}

/** Pure in-memory intent collection; no directory, index, lock, or journal writes. */
export class UpgradePlan {
  readonly operations = new Map<string, UpgradeOperation>();
  private readonly observed = new Map<string, string | null>();
  private readonly directories = new Map<string, string>();
  private approved?: ApprovedPlan;
  constructor(readonly root: string) {}
  read(relativePath: string): Buffer | null {
    const value = bytes(this.root, relativePath);
    this.observed.set(relativePath, value === null ? null : digest(value));
    return value;
  }
  value(relativePath: string): Buffer | null {
    const operation = this.operations.get(relativePath);
    return operation ? operation.after === null ? null : Buffer.from(operation.after, "base64") : this.read(relativePath);
  }
  list(relativePath: string): string[] {
    const entries = directoryEntries(this.root, relativePath);
    this.directories.set(relativePath, JSON.stringify(entries));
    return entries;
  }
  write(relativePath: string, content: string | Buffer | null): void {
    assertPathSpelling(this.root, relativePath);
    if (relativePath.split(/[\\/]/).includes(".git") || relativePath === UPGRADE_JOURNAL) throw new UsageError("upgrade cannot target Git or its own transaction journal");
    const before = this.read(relativePath)?.toString("base64") ?? null;
    const after = content === null ? null : Buffer.from(content).toString("base64");
    let parent = path.posix.dirname(relativePath);
    while (parent !== ".") { this.list(parent); parent = path.posix.dirname(parent); }
    if (before === after) this.operations.delete(relativePath);
    else this.operations.set(relativePath, { path: relativePath, before, after });
  }
  hash(extra: unknown): string {
    this.approved = JSON.parse(canonicalPlan(this.payload(extra ?? null))) as ApprovedPlan;
    return digest(canonicalPlan(this.approved));
  }
  private payload(extra: unknown): ApprovedPlan {
    return { extra, operations: [...this.operations.values()], dependencies: { files: [...this.observed].sort(),
      directories: [...this.directories].sort().map(([file, entries]) => [file, JSON.parse(entries) as string[]]) } };
  }
  private approvedPayload(planHash: string): ApprovedPlan {
    if (!this.approved || digest(canonicalPlan(this.approved)) !== planHash ||
        canonicalPlan(this.payload(this.approved.extra)) !== canonicalPlan(this.approved)) {
      throw new UsageError("upgrade plan changed or was not approved; review a fresh plan hash");
    }
    return JSON.parse(canonicalPlan(this.approved)) as ApprovedPlan;
  }
  assertFresh(): void {
    for (const operation of this.operations.values()) {
      if (encoded(this.root, operation.path) !== operation.before) throw new UsageError(`stale upgrade operation: ${operation.path}`);
    }
    for (const [relativePath, expected] of this.observed) {
      const actual = bytes(this.root, relativePath);
      if ((actual === null ? null : digest(actual)) !== expected) throw new UsageError(`stale upgrade plan: ${relativePath}`);
    }
    for (const [relativePath, expected] of this.directories) {
      const actual = directoryEntries(this.root, relativePath);
      if (JSON.stringify(actual) !== expected) throw new UsageError(`stale upgrade directory: ${relativePath}`);
    }
  }
  apply(planHash: string, timeout: number, afterWrite?: (path: string, index: number) => void): void {
    this.approvedPayload(planHash);
    if (!this.operations.size) return;
    this.assertFresh();
    withMutationLock(this.root, timeout, () => {
      this.assertFresh();
      const previous = readUpgradeJournal(this.root);
      if (previous && !["completed", "recovered"].includes(previous.state)) throw new UsageError("unfinished upgrade; use explicit --resume or --recover");
      const approved_plan = this.approvedPayload(planHash);
      const { operations, dependencies } = approved_plan;
      const journal: Journal = { schema_version: 3, plan_hash: planHash, approved_plan, operations, dependencies,
        dependencies_hash: digest(JSON.stringify(dependencies)), operations_hash: digest(JSON.stringify(operations)), state: "applying" };
      saveJournal(this.root, journal);
      for (const [index, operation] of operations.entries()) {
        if (encoded(this.root, operation.path) !== operation.before) throw new UsageError(`upgrade baseline moved: ${operation.path}; explicit recovery required`);
        put(this.root, operation.path, operation.after);
        afterWrite?.(operation.path, index);
      }
      assertTerminalCustody(this.root, journal, "after");
      journal.state = "completed";
      saveJournal(this.root, journal);
    });
  }
}

export function continueUpgrade(root: string, mode: "resume" | "recover", planHash: string | undefined, timeout: number,
  validate?: (journal: Journal) => void): Journal {
  if (!planHash) throw new UsageError("resume/recover requires the journal's exact --plan-hash");
  const journal = readUpgradeJournal(root, planHash);
  if (!journal) throw new UsageError("resume/recover requires the journal's exact --plan-hash");
  if (journal.state === "recovered" || journal.state === "completed") {
    assertTerminalCustody(root, journal, journal.state === "recovered" ? "before" : "after");
    validate?.(journal);
    assertApprovedPlan(journal, planHash);
    if (journal.state === "recovered" || mode === "resume") return journal;
  }
  if (mode === "resume" && journal.state === "recovering") throw new UsageError("recovery already started; continue --recover");
  const check = () => {
    assertApprovedPlan(journal, planHash);
    for (const op of journal.operations) {
      const actual = encoded(root, op.path);
      if (actual !== op.before && actual !== op.after) throw new UsageError(`upgrade recovery collision: ${op.path}; user bytes preserved`);
    }
    assertRecoveryDependencies(root, journal);
    validate?.(journal);
    assertApprovedPlan(journal, planHash);
  };
  check(); // Refuse without even acquiring a lock if custody changed.
  return withMutationLock(root, timeout, () => {
    check();
    journal.state = mode === "recover" ? "recovering" : "applying";
    saveJournal(root, journal);
    const operations = mode === "recover" ? [...journal.operations].reverse() : journal.operations;
    for (const op of operations) {
      const actual = encoded(root, op.path);
      const wanted = mode === "recover" ? op.before : op.after;
      if (actual !== op.before && actual !== op.after) throw new UsageError(`upgrade recovery collision: ${op.path}`);
      if (actual !== wanted) put(root, op.path, wanted);
    }
    assertTerminalCustody(root, journal, mode === "recover" ? "before" : "after");
    validate?.(journal);
    assertApprovedPlan(journal, planHash);
    journal.state = mode === "recover" ? "recovered" : "completed";
    saveJournal(root, journal);
    return journal;
  });
}
