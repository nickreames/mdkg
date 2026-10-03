import fs from "fs";
import path from "path";
import { containedPathExists, readContainedFile, withContainedPathSink, writeContainedFileExclusive } from "./filesystem_authority";
import { canonicalJson, isIdentityUuid, newIdentityUuid, readGraphFormat } from "../graph/identity";
import { UsageError } from "../util/errors";
import { assertNoGitMetadataDestinations } from "../util/git_metadata";
export { workingPath } from "./working_paths";

export const WORKING_HOST_PATH = ".mdkg/working-host.json";
export const WORKING_ROOT = ".mdkg/working";
export type WorkingHost = { kind: "canonical-v2" | "working-host-v1"; id: string };

/** Exact portable names, regular single-link files and existing contained sinks.
 * Capturing ancestry additionally binds separate calls, not an openat guarantee. */
export function admitWorkingPath(root: string, file: string, operation: "read" | "create" | "replace" | "delete" = "read"): void {
  if (!file || file.startsWith("/") || file.includes("\\") || file !== path.posix.normalize(file) ||
      file.split("/").some(p => !p || p === "." || p === ".." || p !== p.normalize("NFC")))
    throw new UsageError("working path must be an exact contained relative path");
  let parent = root;
  for (const part of file.split("/")) {
    if (fs.existsSync(parent)) {
      const aliases = fs.readdirSync(parent).filter(n => n.normalize("NFC").toLowerCase() === part.toLowerCase());
      if (aliases.some(n => n !== part)) throw new UsageError("working path has a case/Unicode alias");
    }
    parent = path.join(parent, part);
    if (fs.existsSync(parent)) {
      const stat = fs.lstatSync(parent);
      if (stat.isSymbolicLink() || (!stat.isDirectory() && (!stat.isFile() || stat.nlink !== 1)))
        throw new UsageError("working paths refuse symlinks, hardlinks and special files");
      if (stat.isDirectory() && parent !== root && (fs.existsSync(path.join(parent, ".git")) ||
          ["HEAD", "objects", "config"].every(n => fs.existsSync(path.join(parent, n)))))
        throw new UsageError("working paths refuse nested Git repositories and bare stores");
    }
  }
  assertNoGitMetadataDestinations(root, [file]);
  withContainedPathSink({ root, relativePath: file, operation }, () => undefined);
}

export function readWorkingMarker(root: string): string | undefined {
  admitWorkingPath(root, WORKING_HOST_PATH);
  if (!containedPathExists({ root, relativePath: WORKING_HOST_PATH })) return undefined;
  let x: unknown;
  try { x = JSON.parse(readContainedFile({ root, relativePath: WORKING_HOST_PATH, maxBytes: 4096 })); }
  catch { throw new UsageError("invalid working host marker; preserve it and review adoption"); }
  const v = x as Record<string, unknown>;
  if (!v || typeof v !== "object" || Array.isArray(v) || Object.keys(v).sort().join(",") !== "format,host_id,version" ||
      v.format !== "mdkg-working-host" || v.version !== 1 || !isIdentityUuid(v.host_id))
    throw new UsageError("unsupported working host marker; preserve it and review adoption");
  return v.host_id;
}

export function readWorkingHost(root: string): WorkingHost | undefined {
  const format = readGraphFormat(root);
  if (format.format_version === 2) return { kind: "canonical-v2", id: format.graph_id };
  const id = readWorkingMarker(root);
  return id ? { kind: "working-host-v1", id } : undefined;
}

export function workingMarkerBytes(id: string): string {
  if (!isIdentityUuid(id)) throw new UsageError("working host ID must be a UUID");
  return canonicalJson({ format: "mdkg-working-host", version: 1, host_id: id }) + "\n";
}

export function bootstrapWorkingHost(root: string): boolean {
  if (readWorkingHost(root)) return false;
  admitWorkingPath(root, WORKING_HOST_PATH, "create");
  writeContainedFileExclusive({ root, relativePath: WORKING_HOST_PATH, mode: 0o600 }, workingMarkerBytes(newIdentityUuid()));
  return true;
}
