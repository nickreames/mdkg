import { createHash } from "node:crypto";

export const SNAPSHOT_DIAGNOSTIC_LIMIT = 4096;
const MAX_CHANGES = 8;
const MAX_PATH_BYTES = 160;

function fixturePath(value: string): boolean {
  return Buffer.byteLength(value) <= MAX_PATH_BYTES &&
    /^(?:\.git|\.mdkg)\/[A-Za-z0-9._/-]+$/.test(value) &&
    !value.split("/").some((part) => part === "" || part === "." || part === "..");
}

function identity(values: Map<string, string>, key: string) {
  if (!values.has(key)) return null;
  const value = values.get(key)!;
  return {
    utf8_bytes: Buffer.byteLength(value, "utf8"),
    sha256: createHash("sha256").update(value, "utf8").digest("hex"),
  };
}

// Describe the strings actually compared by the existing snapshot assertion.
// Never include compared contents, absolute paths, error messages or stacks.
export function snapshotMismatchDiagnostic(
  before: Map<string, string>, after: Map<string, string>, gitVersion: string | null,
): string {
  const changes: Array<{ path: string; before: ReturnType<typeof identity>; after: ReturnType<typeof identity> }> = [];
  let changed = 0;
  let redacted = 0;
  const keys = [...new Set([...before.keys(), ...after.keys()])].sort();
  for (const key of keys) {
    if (before.has(key) === after.has(key) && before.get(key) === after.get(key)) continue;
    changed++;
    if (!fixturePath(key)) {
      redacted++;
      continue;
    }
    if (changes.length < MAX_CHANGES) changes.push({ path: key, before: identity(before, key), after: identity(after, key) });
  }
  const report = {
    schema_version: 1,
    policy: "fixture-snapshot-metadata-v1",
    encoding: "snapshot-utf8-values",
    runtime: {
      node: process.version, platform: process.platform, arch: process.arch,
      git: gitVersion !== null && /^\d+\.\d+\.\d+$/.test(gitVersion) && gitVersion.length <= 32 ? gitVersion : null,
    },
    before_files: before.size, after_files: after.size, changed_files: changed,
    redacted_paths: redacted, truncated: changed - redacted > changes.length, changes,
  };
  const encode = () => `SNAPSHOT_MISMATCH ${JSON.stringify(report)}\n`;
  let output = encode();
  while (Buffer.byteLength(output) > SNAPSHOT_DIAGNOSTIC_LIMIT && changes.length > 0) {
    changes.pop();
    report.truncated = true;
    output = encode();
  }
  return output;
}
