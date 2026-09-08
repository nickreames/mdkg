import fs from "fs";
import path from "path";
import { containedPathExists, readContainedFile, withContainedPathSink } from "../core/filesystem_authority";
import { normalizeContainedWorkspacePath } from "../core/workspace_path";
import { NotFoundError } from "../util/errors";
import { DEFAULT_ZIP_READ_LIMITS, readZipEntries } from "../util/zip";

// Configured imports and projected node metadata are repository-owned paths,
// unlike an explicit operator-selected external bundle. Validate before native
// resolution so traversal cannot disappear and POSIX filename bytes stay intact.
export function assertSubgraphBundleFile(root: string, bundlePath: string): string {
  const safePath = normalizeContainedWorkspacePath(bundlePath, "subgraph bundle path");
  const absolutePath = path.resolve(root, safePath);
  const authority = { root, relativePath: path.relative(root, absolutePath), pathSyntax: "native" as const };
  if (!containedPathExists(authority)) throw new NotFoundError(`bundle not found: ${bundlePath}`);
  withContainedPathSink({ ...authority, operation: "read" }, ({ absolutePath: file }) => {
    const stat = fs.lstatSync(file);
    if (!stat.isFile()) throw new Error(`subgraph bundle must be a regular file: ${bundlePath}`);
    if (stat.size > DEFAULT_ZIP_READ_LIMITS.maxArchiveBytes) throw new Error(`subgraph bundle exceeds byte limit: ${DEFAULT_ZIP_READ_LIMITS.maxArchiveBytes}`);
  });
  return absolutePath;
}

export function readSubgraphBundleEntries(root: string, bundlePath: string): Map<string, Buffer> {
  const absolutePath = assertSubgraphBundleFile(root, bundlePath);
  const bytes = readContainedFile({ root, relativePath: path.relative(root, absolutePath), pathSyntax: "native", maxBytes: DEFAULT_ZIP_READ_LIMITS.maxArchiveBytes }, null);
  return new Map(readZipEntries(bytes).map((entry) => [entry.name, entry.data]));
}
