import fs from "fs";
import path from "path";
import { withContainedPathSink } from "./filesystem_authority";
import { ValidationError } from "../util/errors";

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

/** Keep the admitted file descriptor alive for the entire native read. SQLite
 * derives WAL/journal names from the path it opens; using the descriptor path
 * makes a journal-mode transition fail instead of creating sidecars next to
 * the canonical database. This is supported only where a process-local fd
 * namespace exists. It is not a substitute for Bug47's directory-race fix.
 */
export function withObservedSqlitePath<T>(root: string, relativePath: string, read: (descriptorPath: string) => T): T {
  admitSqliteDatabase(root, relativePath);
  const descriptorRoot = process.platform === "darwin" ? "/dev/fd" :
    process.platform === "linux" ? "/proc/self/fd" : null;
  if (!descriptorRoot) throw new ValidationError("descriptor-backed SQLite observation is unsupported on this platform");
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
      const descriptorPath = `${descriptorRoot}/${fd}`;
      if (!fs.existsSync(descriptorPath)) throw new ValidationError("descriptor-backed SQLite observation is unavailable");
      let result!: T; let readError: unknown;
      try { result = read(descriptorPath); } catch (error) { readError = error; }
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
      if (readError && custodyError) {
        throw new ValidationError(`SQLite observation and custody checks both failed: ${String(readError)}; ${String(custodyError)}`);
      }
      if (readError) throw readError;
      if (custodyError) throw custodyError;
      return result;
    } finally { fs.closeSync(fd); }
  });
}

export function withSelectedSqliteObservation<T>(file: string, read: (descriptorPath: string) => T): T {
  const absolute = path.resolve(file);
  return withObservedSqlitePath(path.dirname(absolute), path.basename(absolute), read);
}
