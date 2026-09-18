import crypto from "node:crypto";
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { containedPathExists, readContainedDirectory, readContainedFile, withContainedPathSink } from "../core/filesystem_authority";
import { canonicalJson, identityHash } from "../graph/identity";
import { UsageError } from "./errors";

export const MUTATION_LOCK_PATH = ".mdkg/index/write.lock";
const HASH = /^sha256:[0-9a-f]{64}$/;
const MAX_CLAIMS = 64;
export type LockTransaction = { plan_hash: string; mode: "apply" | "resume" | "rollback" };
export type LockFileIdentity = { device: string; inode: string; uid: number; mode: number; links: number };
type CheckoutIdentity = { path_hash: string; device: string; inode: string };
export type LockEnvironment = { platform: "darwin" | "linux"; uid: number; euid: number; boot_hash: string; namespace_hash: string | null };
export type LockOwner = {
  schema_version: 1; nonce: string; pid: number; node: string; created_at: string;
  checkout: CheckoutIdentity; environment: LockEnvironment | null; transaction: LockTransaction | null;
};
export type LockClaim = { schema_version: 1; previous_hash: string; approval_hash: string; journal_hash: string; owner: LockOwner };
export type MutationLockRecord = {
  schema_version: 1; directory: LockFileIdentity;
  files: Array<{ name: string; identity: LockFileIdentity; content: string }>;
};

export function lockCustodyError(detail = "metadata or directory changed"): UsageError {
  return new UsageError(`mutation lock custody lost: ${detail}; preserve all lock evidence`);
}
export function lockFileIdentity(stat: fs.Stats): LockFileIdentity {
  // Some filesystems count directory entries as links; additions/removals are
  // expected within this same directory epoch. File hard links remain bound.
  return { device: String(stat.dev), inode: String(stat.ino), uid: stat.uid, mode: stat.mode, links: stat.isDirectory() ? 0 : stat.nlink };
}
function checkoutIdentity(root: string): CheckoutIdentity {
  return withContainedPathSink({ root, relativePath: MUTATION_LOCK_PATH, operation: "read" }, () => {
    const canonical = fs.realpathSync.native(root), stat = fs.statSync(canonical);
    return { path_hash: identityHash(canonical), device: String(stat.dev), inode: String(stat.ino) };
  });
}

/** No configuration, network, shell or clock-age heuristic asserts abandonment.
 * Restricted OS proof permits ordinary writes, but never orphan takeover.
 */
export function localLockEnvironment(): LockEnvironment | null {
  if (!process.getuid || !process.geteuid) return null;
  try {
    let boot: string, namespace: string | null = null;
    if (process.platform === "darwin") {
      const result = spawnSync("/usr/sbin/sysctl", ["-n", "kern.bootsessionuuid"], {
        encoding: "utf8", env: { PATH: "/usr/bin:/bin:/usr/sbin:/sbin", LC_ALL: "C" },
        timeout: 1000, maxBuffer: 1024, stdio: ["ignore", "pipe", "pipe"],
      });
      if (result.error || result.status !== 0) return null;
      boot = result.stdout.trim();
    } else if (process.platform === "linux") {
      // A procfs mounted for another PID namespace does not establish which
      // PID the caller's kill(0) observes. Refuse rather than infer equivalence.
      if (fs.readlinkSync("/proc/self") !== String(process.pid)) return null;
      boot = fs.readFileSync("/proc/sys/kernel/random/boot_id", "utf8").trim();
      const names = ["pid", "user", "mnt"].map(kind => {
        const value = fs.readlinkSync(`/proc/self/ns/${kind}`);
        if (!new RegExp(`^${kind}:\\[[0-9]+\\]$`).test(value)) throw Error("unavailable namespace identity");
        return value;
      });
      namespace = identityHash(canonicalJson(names));
    } else return null;
    if (!/^[0-9a-f-]{36}$/i.test(boot)) return null;
    return { platform: process.platform, uid: process.getuid(), euid: process.geteuid(),
      boot_hash: identityHash(boot.toLowerCase()), namespace_hash: namespace };
  } catch { return null; }
}
export function newLockOwner(root: string, transaction?: LockTransaction): LockOwner {
  return { schema_version: 1, nonce: crypto.randomUUID(), pid: process.pid, node: process.version,
    created_at: new Date().toISOString(), checkout: checkoutIdentity(root),
    environment: transaction ? localLockEnvironment() : null, transaction: transaction ?? null };
}
export function lockJson(value: unknown): string { return `${JSON.stringify(value, null, 2)}\n`; }
export function lockRecordHash(record: MutationLockRecord): string { return identityHash(canonicalJson(record)); }

/** Unknown entries are not read or removed. UTF-8 roundtrip is required so
 * text retained in private journals is also an exact raw-byte binding.
 */
export function readMutationLock(root: string): MutationLockRecord | null {
  if (!containedPathExists({ root, relativePath: MUTATION_LOCK_PATH })) return null;
  return withContainedPathSink({ root, relativePath: MUTATION_LOCK_PATH, operation: "read" }, ({ absolutePath }) => {
    const initial = fs.lstatSync(absolutePath);
    if (!initial.isDirectory()) throw lockCustodyError("lock is not a directory");
    const directory = lockFileIdentity(initial);
    const entries = readContainedDirectory({ root, relativePath: MUTATION_LOCK_PATH });
    if (entries.length > MAX_CLAIMS + 1 || entries.some(entry => !entry.isFile() ||
      (entry.name !== "owner.json" && !/^claim-[0-9a-f]{64}\.json$/.test(entry.name)))) throw lockCustodyError("unknown or incomplete lock entries");
    const files = entries.sort((a, b) => a.name.localeCompare(b.name)).map(entry => {
      const relativePath = `${MUTATION_LOCK_PATH}/${entry.name}`;
      return withContainedPathSink({ root, relativePath, operation: "read" }, ({ absolutePath: file }) => {
        const identity = lockFileIdentity(fs.lstatSync(file));
        const bytes = readContainedFile({ root, relativePath, maxBytes: 32 * 1024 }, null), content = bytes.toString("utf8");
        if (!Buffer.from(content).equals(bytes) || canonicalJson(lockFileIdentity(fs.lstatSync(file))) !== canonicalJson(identity)) throw lockCustodyError();
        return { name: entry.name, identity, content };
      });
    });
    if (canonicalJson(lockFileIdentity(fs.lstatSync(absolutePath))) !== canonicalJson(directory) ||
      canonicalJson(readContainedDirectory({ root, relativePath: MUTATION_LOCK_PATH }).map(e => e.name).sort()) !==
      canonicalJson(files.map(e => e.name).sort())) throw lockCustodyError();
    return { schema_version: 1, directory, files };
  });
}
export function assertMutationLockRecord(root: string, expected: MutationLockRecord): void {
  try {
    if (canonicalJson(readMutationLock(root)) !== canonicalJson(expected)) throw lockCustodyError();
  } catch (error) {
    if (error instanceof UsageError) throw error;
    throw lockCustodyError("lock evidence became unreadable");
  }
}
function parseOwner(value: unknown, planHash: string): LockOwner {
  const owner = value as LockOwner | null;
  if (!owner || owner.schema_version !== 1 || typeof owner.nonce !== "string" ||
    !/^[0-9a-f-]{36}$/.test(owner.nonce) || !Number.isSafeInteger(owner.pid) || owner.pid <= 0 ||
    typeof owner.node !== "string" || typeof owner.created_at !== "string" ||
    !owner.checkout || !HASH.test(owner.checkout.path_hash) || !/^[0-9]+$/.test(owner.checkout.device) ||
    !/^[0-9]+$/.test(owner.checkout.inode) || !owner.transaction || owner.transaction.plan_hash !== planHash ||
    !["apply", "resume", "rollback"].includes(owner.transaction.mode)) {
    throw new UsageError("lock owner lacks complete transaction-bound provenance; no recovery authority inferred");
  }
  return owner;
}
export function mutationLockChain(record: MutationLockRecord, planHash: string): { owners: LockOwner[]; tip_hash: string; claims: LockClaim[] } {
  const base = record.files.find(file => file.name === "owner.json");
  if (!base) throw new UsageError("lock owner metadata is incomplete; no recovery attempted");
  try {
    const owners = [parseOwner(JSON.parse(base.content), planHash)], claims: LockClaim[] = [];
    let tip = identityHash(base.content);
    const remaining = new Map(record.files.filter(file => file !== base).map(file => [file.name, file]));
    while (remaining.size) {
      const name = `claim-${tip.slice(7)}.json`, file = remaining.get(name);
      if (!file) throw new UsageError("lock recovery chain is ambiguous or incomplete");
      const claim = JSON.parse(file.content) as LockClaim;
      if (claim.schema_version !== 1 || claim.previous_hash !== tip || !HASH.test(claim.approval_hash) || !HASH.test(claim.journal_hash)) throw new UsageError("lock recovery claim lacks complete evidence binding");
      const owner = parseOwner(claim.owner, planHash);
      if (owner.transaction!.mode === "apply") throw new UsageError("invalid lock recovery mode");
      owners.push(owner); claims.push(claim); remaining.delete(name); tip = identityHash(file.content);
    }
    return { owners, tip_hash: tip, claims };
  } catch (error) {
    if (error instanceof UsageError) throw error;
    throw new UsageError("lock evidence is incomplete or malformed; preserve it for investigation");
  }
}

/** Only same-checkout/boot/namespace/user proof plus journal binding AND absent
 * processes allows explicit takeover. A reused PID is treated as live.
 */
export function assertOrphanLock(root: string, record: MutationLockRecord, journalRecord: MutationLockRecord | undefined,
  planHash: string, journalHash: string, mode: "resume" | "rollback"): void {
  const chain = mutationLockChain(record, planHash);
  if (!journalRecord || journalRecord.schema_version !== 1 || !Array.isArray(journalRecord.files) ||
    canonicalJson(journalRecord.directory) !== canonicalJson(record.directory) || !journalRecord.files.some(file => file.name === "owner.json")) {
    throw new UsageError("journal does not bind this lock epoch; no recovery authority inferred");
  }
  mutationLockChain(journalRecord, planHash);
  for (const file of journalRecord.files) {
    if (canonicalJson(record.files.find(actual => actual.name === file.name)) !== canonicalJson(file)) throw new UsageError("journal lock binding changed; preserve ownership evidence");
  }
  for (const file of record.files.filter(file => !journalRecord.files.some(old => old.name === file.name))) {
    if ((JSON.parse(file.content) as LockClaim).journal_hash !== journalHash) throw new UsageError("unmirrored recovery claim does not bind the current journal");
  }
  if (mode === "resume" && chain.owners.some(owner => owner.transaction!.mode === "rollback")) throw new UsageError("rollback was requested in lock evidence; it cannot be resumed as application");
  if (record.files.length >= MAX_CLAIMS + 1) throw new UsageError("lock recovery history limit reached; preserve evidence for investigation");
  const environment = localLockEnvironment(), checkout = checkoutIdentity(root);
  if (!environment) throw new UsageError("local OS ownership evidence is unavailable; no orphan recovery attempted");
  for (const entry of [record.directory, ...record.files.map(file => file.identity)]) {
    if (entry.uid !== environment.euid || (entry.mode & 0o077) !== 0 || (entry !== record.directory && entry.links !== 1)) throw new UsageError("lock evidence is not exclusively owned by this local user");
  }
  for (const owner of chain.owners) {
    if (canonicalJson(owner.checkout) !== canonicalJson(checkout) || !owner.environment || canonicalJson(owner.environment) !== canonicalJson(environment)) throw new UsageError("lock owner belongs to an unproven checkout, boot, user or namespace; no recovery attempted");
    try { process.kill(owner.pid, 0); }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ESRCH") continue;
      throw new UsageError("lock owner liveness is ambiguous or inaccessible; no recovery attempted");
    }
    throw new UsageError("lock owner PID is live, suspended or reused; no recovery attempted");
  }
  assertMutationLockRecord(root, record);
}
