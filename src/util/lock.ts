import fs from "fs";
import path from "path";

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

  fs.mkdirSync(path.dirname(dir), { recursive: true });
  const started = Date.now();
  let lastError: unknown;
  while (Date.now() - started <= timeoutMs) {
    try {
      fs.mkdirSync(dir);
      let acquired = false;
      try {
        fs.writeFileSync(path.join(dir, "owner.json"), lockOwner(), "utf8");
        HELD_LOCKS.add(dir);
        acquired = true;
        try {
          return fn();
        } finally {
          HELD_LOCKS.delete(dir);
          fs.rmSync(dir, { recursive: true, force: true });
        }
      } catch (err) {
        if (!acquired) {
          fs.rmSync(dir, { recursive: true, force: true });
        }
        throw err;
      }
    } catch (err) {
      const code = typeof err === "object" && err !== null && "code" in err ? String((err as { code?: unknown }).code) : "";
      if (code !== "EEXIST") {
        throw err;
      }
      lastError = err;
      sleepSync(25);
    }
  }
  const detailPath = path.join(dir, "owner.json");
  const owner = fs.existsSync(detailPath) ? fs.readFileSync(detailPath, "utf8").trim() : "unknown owner";
  throw new Error(`timed out waiting for mdkg mutation lock at ${path.relative(root, dir)}; owner: ${owner || "unknown"}`);
}

export function lockTimeoutFromConfig(config: { index: { lock_timeout_ms: number } }): number {
  return config.index.lock_timeout_ms;
}
