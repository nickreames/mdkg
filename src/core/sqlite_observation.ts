import fs from "fs";
import path from "path";
import { constants as bufferConstants } from "node:buffer";
import { withContainedPathSink } from "./filesystem_authority";
import { ValidationError } from "../util/errors";
import { assertNodeRuntime } from "./node_runtime";

/** Admission is separate from native open: readOnly alone can write WAL/SHM.
 * Native pathname substitution remains the independent filesystem-race boundary.
 */
export function admitSqliteDatabase(root: string, relativePath: string, observation = true): void {
  const input = { root, relativePath, pathSyntax: "native" as const };
  const sidecars: string[] = [];
  for (const suffix of ["-wal", "-shm", "-journal"]) {
    withContainedPathSink({ ...input, relativePath: relativePath + suffix, operation: "read" }, ({ absolutePath }) => {
      let stat: fs.Stats;
      try { stat = fs.lstatSync(absolutePath); }
      catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return; throw error; }
      if (!stat.isFile()) throw new ValidationError("SQLite sidecar must be a regular file");
      sidecars.push(suffix);
    });
  }
  withContainedPathSink({ ...input, operation: "read" }, ({ absolutePath }) => {
    const initial = fs.lstatSync(absolutePath);
    if (!initial.isFile()) throw new ValidationError("SQLite database must be an existing regular file");
    const fd = fs.openSync(absolutePath, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW ?? 0) | (fs.constants.O_NONBLOCK ?? 0));
    try {
      const opened = fs.fstatSync(fd);
      if (!opened.isFile() || opened.dev !== initial.dev || opened.ino !== initial.ino) throw new ValidationError("SQLite database custody changed before observation");
      const header = Buffer.alloc(100); let count = 0;
      while (count < header.length) {
        const n = fs.readSync(fd, header, count, header.length - count, count); if (!n) break; count += n;
      }
      if (count < 100 || !header.subarray(0, 16).equals(Buffer.from("SQLite format 3\0"))) throw new ValidationError("invalid SQLite database header");
      if (observation && (sidecars.length || header[18] !== 1 || header[19] !== 1)) {
        throw new ValidationError("SQLite observation refuses WAL or transient/recovery state; use an explicitly authorized writer to checkpoint/recover it, or inspect a sealed rollback-journal snapshot");
      }
      const current = fs.lstatSync(absolutePath);
      if (current.dev !== opened.dev || current.ino !== opened.ino || !current.isFile()) throw new ValidationError("SQLite database custody changed during observation");
    } finally { fs.closeSync(fd); }
  });
}

/** Low-level APIs accept an operator-selected absolute database path. */
export function admitSelectedSqliteObservation(file: string): void {
  const absolute = path.resolve(file);
  admitSqliteDatabase(path.dirname(absolute), path.basename(absolute));
}

export type ObservedSqliteDatabase = {
  exec(sql: string): void;
  prepare(sql: string): {
    run(...values: unknown[]): { changes?: number; lastInsertRowid?: number | bigint };
    get(...values: unknown[]): Record<string, unknown> | undefined;
    all(...values: unknown[]): Array<Record<string, unknown>>;
  };
  close(): void;
};

type MemoryDatabase = ObservedSqliteDatabase & {
  deserialize(image: Uint8Array): void;
  enableDefensive(active: boolean): void;
  setAuthorizer(callback: (action: number, first: string | null, second: string | null) => number): void;
};
type ObservationSqlite = {
  DatabaseSync: { new (file: string, options: { allowExtension: boolean }): MemoryDatabase; prototype: MemoryDatabase };
  constants: Record<string, number>;
};

function observationSqlite(): ObservationSqlite {
  assertNodeRuntime();
  return require("node:sqlite") as ObservationSqlite;
}

function requireImageMemory(bytes: bigint, copies: number): void {
  // An image plus SQLite's deserialized copy consumes linear memory. This is a
  // current-resource admission check, not a fixed compatibility size ceiling
  // or a promise against concurrent process/system memory exhaustion.
  const available = process.availableMemory();
  const required = bytes * BigInt(copies);
  if (!Number.isSafeInteger(available) || available <= 0 || required > BigInt(available)) {
    throw new ValidationError(`SQLite observation needs ${required} bytes of available image memory; Node reports ${available}. Free memory or inspect a smaller explicitly prepared snapshot; no temporary-file fallback is used`);
  }
}

function restrictObservation(db: MemoryDatabase, sql: Record<string, number>): void {
  db.enableDefensive(true);
  db.exec("PRAGMA temp_store=MEMORY; PRAGMA trusted_schema=OFF; PRAGMA foreign_keys=ON; PRAGMA query_only=ON;");
  const reads = new Set([sql.SQLITE_SELECT, sql.SQLITE_READ, sql.SQLITE_RECURSIVE]);
  const valuePragmas = new Set(["integrity_check", "quick_check", "foreign_key_check", "database_list", "page_count", "page_size", "query_only", "temp_store", "trusted_schema", "foreign_keys", "schema_version", "user_version"]);
  const schemaPragmas = new Set(["table_info", "table_xinfo", "index_list", "index_info", "index_xinfo"]);
  // Callbacks are trusted synchronous package code, not arbitrary JS. The
  // authorizer also prevents SQL in a supplied schema from enabling writes,
  // attaching files, loading extensions or changing the connection's guards.
  db.setAuthorizer((action, first, second) => {
    if (reads.has(action)) return sql.SQLITE_OK;
    // Keep ordinary built-in expressions (including authored generated columns)
    // usable. No JS functions are registered and native extension loading is
    // disabled; a narrow list of just today's query functions would regress
    // otherwise valid project databases.
    if (action === sql.SQLITE_FUNCTION && String(second).toLowerCase() !== "load_extension") return sql.SQLITE_OK;
    if (action === sql.SQLITE_PRAGMA && first &&
      (schemaPragmas.has(first.toLowerCase()) || (valuePragmas.has(first.toLowerCase()) && second === null))) return sql.SQLITE_OK;
    return sql.SQLITE_DENY;
  });
}

/** Read a held ordinary file into a Node-owned image, then query SQLite only in
 * memory. SQLite never receives the canonical filename or a descriptor path,
 * so a journal-mode transition cannot create sidecars next to the source.
 * Source custody and rollback-journal state are checked before accepting a
 * result. This does not resolve the separate adversarial ancestor-swap/ACL bugs.
 */
export function withObservedSqliteDatabase<T>(root: string, relativePath: string, read: (database: ObservedSqliteDatabase) => T): T {
  const sqlite = observationSqlite(); // Missing capabilities refuse before filesystem admission.
  admitSqliteDatabase(root, relativePath);
  return withContainedPathSink({ root, relativePath, pathSyntax: "native", operation: "read" }, ({ absolutePath }) => {
    const initial = fs.lstatSync(absolutePath, { bigint: true });
    if (!initial.isFile()) throw new ValidationError("SQLite database must be an existing regular file");
    const fd = fs.openSync(absolutePath, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW ?? 0) | (fs.constants.O_NONBLOCK ?? 0));
    try {
      const opened = fs.fstatSync(fd, { bigint: true });
      if (!opened.isFile() || opened.dev !== initial.dev || opened.ino !== initial.ino) {
        throw new ValidationError("SQLite database custody changed before observation");
      }
      const header = Buffer.alloc(100); let count = 0;
      while (count < header.length) {
        const n = fs.readSync(fd, header, count, header.length - count, count); if (!n) break; count += n;
      }
      if (count < 100 || !header.subarray(0, 16).equals(Buffer.from("SQLite format 3\0"))) {
        throw new ValidationError("invalid SQLite database header");
      }
      if (header[18] !== 1 || header[19] !== 1) {
        throw new ValidationError("SQLite observation refuses WAL or transient/recovery state");
      }
      if (opened.size < 100n || opened.size > BigInt(bufferConstants.MAX_LENGTH)) {
        throw new ValidationError("SQLite observation image is not representable in a Node buffer");
      }
      requireImageMemory(opened.size, 2);
      let image: Buffer;
      try { image = Buffer.alloc(Number(opened.size)); }
      catch (error) { throw new ValidationError(`SQLite observation could not allocate its image: ${String(error)}`); }
      let offset = 0;
      while (offset < image.length) {
        const n = fs.readSync(fd, image, offset, Math.min(image.length - offset, 64 * 1024), offset);
        if (!n) throw new ValidationError("SQLite database was truncated during image capture");
        offset += n;
      }
      const captured = fs.fstatSync(fd, { bigint: true });
      if (captured.size !== opened.size || captured.mtimeNs !== opened.mtimeNs || captured.ctimeNs !== opened.ctimeNs) {
        throw new ValidationError("SQLite database changed during image capture");
      }
      if (!image.subarray(0, 100).equals(header)) {
        throw new ValidationError("SQLite database header changed during image capture");
      }
      let result!: T; let readError: unknown; let readFailed = false;
      try {
        requireImageMemory(opened.size, 1);
        const db = new sqlite.DatabaseSync(":memory:", { allowExtension: false });
        try {
          db.deserialize(image);
          restrictObservation(db, sqlite.constants);
          result = read(db);
        } finally { db.close(); }
      } catch (error) { readError = error; readFailed = true; }
      let custodyError: unknown;
      try {
        admitSqliteDatabase(root, relativePath);
        const after = fs.fstatSync(fd, { bigint: true });
        const current = fs.lstatSync(absolutePath, { bigint: true });
        if (!current.isFile() || current.dev !== opened.dev || current.ino !== opened.ino) {
          throw new ValidationError("SQLite database path was replaced during observation");
        }
        if (after.dev !== opened.dev || after.ino !== opened.ino || after.size !== opened.size ||
          after.mtimeNs !== opened.mtimeNs || after.ctimeNs !== opened.ctimeNs) {
          throw new ValidationError("SQLite database changed during observation");
        }
      } catch (error) { custodyError = error; }
      if (readFailed && custodyError) {
        throw new ValidationError(`SQLite observation and custody checks both failed: ${String(readError)}; ${String(custodyError)}`);
      }
      if (readFailed) throw readError;
      if (custodyError) throw custodyError;
      return result;
    } finally { fs.closeSync(fd); }
  });
}

export function withSelectedSqliteObservation<T>(file: string, read: (database: ObservedSqliteDatabase) => T): T {
  const absolute = path.resolve(file);
  return withObservedSqliteDatabase(path.dirname(absolute), path.basename(absolute), read);
}
