import fs from "fs";
import path from "path";
import { assertCompatibleWriter } from "./writer_admission";
import { ensureContainedDirectory, withContainedPathSink, writeContainedFileExclusive } from "../core/filesystem_authority";
import { canonicalJson, identityHash } from "../graph/identity";
import {
  assertMutationLockRecord, assertOrphanLock, LockClaim, lockCustodyError, lockFileIdentity, lockJson,
  LockTransaction, MUTATION_LOCK_PATH, MutationLockRecord, mutationLockChain, newLockOwner, readMutationLock,
} from "./lock_evidence";

const HELD_LOCKS = new Map<string, MutationLockRecord>();
const lockKey = (root: string) => path.resolve(root, MUTATION_LOCK_PATH);

function sleepSync(ms: number): void { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms); }

export function heldMutationLock(root: string): MutationLockRecord {
  const record = HELD_LOCKS.get(lockKey(root));
  if (!record) throw lockCustodyError("no lock held by this writer");
  assertMutationLockRecord(root, record);
  return JSON.parse(JSON.stringify(record)) as MutationLockRecord;
}

/** No recursive deletion: changed owners and unknown entries preserve evidence.
 * Nonrecursive rmdir refuses entries appearing during release. Partial cleanup
 * is deliberately insufficient evidence for subsequent automatic takeover.
 */
function release(root: string, record: MutationLockRecord): void {
  assertMutationLockRecord(root, record);
  let remaining = record;
  for (const file of record.files.filter(file => file.name !== "owner.json").concat(record.files.filter(file => file.name === "owner.json"))) {
    assertMutationLockRecord(root, remaining);
    withContainedPathSink({ root, relativePath: `${MUTATION_LOCK_PATH}/${file.name}`, operation: "delete" }, ({ absolutePath }) => fs.unlinkSync(absolutePath));
    remaining = { ...remaining, files: remaining.files.filter(entry => entry.name !== file.name) };
  }
  assertMutationLockRecord(root, remaining);
  withContainedPathSink({ root, relativePath: MUTATION_LOCK_PATH, operation: "delete" }, ({ absolutePath }) => fs.rmdirSync(absolutePath));
}

function runHeld<T>(root: string, record: MutationLockRecord, fn: () => T, releaseOnError: boolean): T {
  const key = lockKey(root);
  HELD_LOCKS.set(key, record);
  let succeeded = false;
  try { const result = fn(); succeeded = true; return result; }
  finally {
    HELD_LOCKS.delete(key);
    // Failed takeover keeps original ownership and irreversible rollback intent.
    // The next explicit inspection must wait for this process to actually exit.
    if (succeeded || releaseOnError) release(root, record);
  }
}

export function withMutationLock<T>(root: string, timeoutMs: number, fn: () => T, transaction?: LockTransaction): T {
  assertCompatibleWriter(root);
  const held = HELD_LOCKS.get(lockKey(root));
  if (held) {
    assertMutationLockRecord(root, held);
    if (transaction) throw lockCustodyError("graph transactions cannot borrow an unrelated nested lock");
    return fn();
  }
  ensureContainedDirectory({ root, relativePath: ".mdkg/index" });
  const started = Date.now();
  while (Date.now() - started <= timeoutMs) {
    let directory: MutationLockRecord["directory"];
    try {
      directory = withContainedPathSink({ root, relativePath: MUTATION_LOCK_PATH, operation: "create" }, ({ absolutePath }) => {
        fs.mkdirSync(absolutePath, { mode: 0o700 });
        return lockFileIdentity(fs.lstatSync(absolutePath));
      });
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code !== "EEXIST" && code !== "ENOENT") throw error;
      sleepSync(25); continue;
    }
    // Never retry callback failures as contention or erase incomplete metadata.
    const owner = lockJson(newLockOwner(root, transaction));
    writeContainedFileExclusive({ root, relativePath: `${MUTATION_LOCK_PATH}/owner.json`, mode: 0o600 }, owner);
    const record = readMutationLock(root);
    if (!record || canonicalJson(record.directory) !== canonicalJson(directory) || record.files.length !== 1 || record.files[0].content !== owner) throw lockCustodyError();
    return runHeld(root, record, fn, true);
  }
  throw new Error(`timed out waiting for mdkg mutation lock at ${MUTATION_LOCK_PATH}; owner details withheld`);
}

/** Keep the original directory present. Opposite modes contend on the SAME
 * O_EXCL filename keyed by prior tip, not by mode or approval. Partial claim
 * publication is diagnostic refusal evidence, never inferred ownership.
 */
export function withRecoveredMutationLock<T>(root: string, input: {
  record: MutationLockRecord; journal_record: MutationLockRecord | undefined; journal_hash: string;
  approval_hash: string; plan_hash: string; mode: "resume" | "rollback";
}, fn: () => T): T {
  assertCompatibleWriter(root);
  if (HELD_LOCKS.has(lockKey(root))) throw lockCustodyError("recovery cannot borrow a held lock");
  assertOrphanLock(root, input.record, input.journal_record, input.plan_hash, input.journal_hash, input.mode);
  const chain = mutationLockChain(input.record, input.plan_hash);
  const owner = newLockOwner(root, { plan_hash: input.plan_hash, mode: input.mode });
  if (!owner.environment || canonicalJson(owner.environment) !== canonicalJson(chain.owners[0].environment) ||
    canonicalJson(owner.checkout) !== canonicalJson(chain.owners[0].checkout)) throw lockCustodyError("local OS or checkout evidence changed");
  const claim: LockClaim = { schema_version: 1, previous_hash: chain.tip_hash,
    approval_hash: input.approval_hash, journal_hash: input.journal_hash, owner };
  const name = `claim-${chain.tip_hash.slice(7)}.json`, content = lockJson(claim);
  assertMutationLockRecord(root, input.record);
  writeContainedFileExclusive({ root, relativePath: `${MUTATION_LOCK_PATH}/${name}`, mode: 0o600 }, content);
  const record = readMutationLock(root), newFile = record?.files.find(file => file.name === name);
  if (!record || !newFile || identityHash(newFile.content) !== identityHash(content) ||
    canonicalJson({ ...record, files: record.files.filter(file => file.name !== name) }) !== canonicalJson(input.record)) throw lockCustodyError("evidence moved during recovery claim publication");
  return runHeld(root, record, fn, false);
}

export function lockTimeoutFromConfig(config: { index: { lock_timeout_ms: number } }): number {
  return config.index.lock_timeout_ms;
}
