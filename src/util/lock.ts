import fs from "fs";
import path from "path";
import {
  ensureContainedDirectory,
  removeContainedPath,
  writeContainedFileExclusive,
  withContainedPathSink,
} from "../core/filesystem_authority";

const HELD_LOCKS = new Set<string>();

function sleepSync(ms: number): void {
  const shared = new SharedArrayBuffer(4);
  const view = new Int32Array(shared);
  Atomics.wait(view, 0, 0, ms);
}

function lockDir(root: string): string {
  return path.resolve(root, ".mdkg", "index", "write.lock");
}

function lockOwner(): string {
  return JSON.stringify(
    {
      pid: process.pid,
      node: process.version,
      created_at: new Date().toISOString(),
    },
    null,
    2
  );
}

export function withMutationLock<T>(
  root: string,
  timeoutMs: number,
  fn: () => T
): T {
  const dir = lockDir(root);
  if (HELD_LOCKS.has(dir)) {
    return fn();
  }

  ensureContainedDirectory({ root, relativePath: ".mdkg/index" });
  const started = Date.now();
  let lastError: unknown;
  while (Date.now() - started <= timeoutMs) {
    try {
      withContainedPathSink(
        { root, relativePath: ".mdkg/index/write.lock", operation: "create" },
        ({ absolutePath }) => fs.mkdirSync(absolutePath)
      );
      let acquired = false;
      try {
        writeContainedFileExclusive({ root, relativePath: ".mdkg/index/write.lock/owner.json" }, lockOwner());
        HELD_LOCKS.add(dir);
        acquired = true;
        try {
          return fn();
        } finally {
          HELD_LOCKS.delete(dir);
          removeContainedPath({ root, relativePath: ".mdkg/index/write.lock", recursive: true, force: true });
        }
      } catch (err) {
        if (!acquired) {
          removeContainedPath({ root, relativePath: ".mdkg/index/write.lock", recursive: true, force: true });
        }
        throw err;
      }
    } catch (err) {
      const code = typeof err === "object" && err !== null && "code" in err ? String((err as { code?: unknown }).code) : "";
      // A competing writer can release the lock between authority inspection
      // and realpath resolution. Treat that transient ENOENT like contention.
      if (code !== "EEXIST" && code !== "ENOENT") {
        throw err;
      }
      lastError = err;
      sleepSync(25);
    }
  }
  throw new Error(`timed out waiting for mdkg mutation lock at ${path.relative(root, dir)}; owner details withheld`);
}

export function lockTimeoutFromConfig(config: { index: { lock_timeout_ms: number } }): number {
  return config.index.lock_timeout_ms;
}
