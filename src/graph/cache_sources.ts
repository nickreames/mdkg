import fs from "fs";
import path from "path";
import { Config } from "../core/config";
import { containedPathExists, forEachContainedDirectoryEntry, withContainedPathSink } from "../core/filesystem_authority";
import { UsageError } from "../util/errors";

/** Bounded legacy freshness inventory. Never promote a configured directory
 * into a new filesystem authority, including when that directory is a link.
 */
export function cacheSourceStats(root: string, directory: string, limits: Config["index"]["limits"],
  owns: (file: string) => boolean = () => true): Array<{ path: string; mtimeMs: number }> {
  if (!owns(directory)) return [];
  const start = path.relative(root, directory) || ".";
  if (start !== "." && !containedPathExists({ root, relativePath: start, pathSyntax: "native" })) return [];
  const pending = [{ relativePath: start, depth: 0 }], result: Array<{ path: string; mtimeMs: number }> = [];
  let entries = 0;
  while (pending.length) {
    const dir = pending.pop()!;
    if (dir.depth > limits.max_depth) throw new UsageError("cache source inventory exceeds depth limit");
    // Directory timestamps preserve the existing additions/removals freshness
    // signal, while bounded iteration avoids an eager recursive readdir array.
    const admit = (relativePath: string) => withContainedPathSink(
      { root, relativePath, pathSyntax: "native", operation: "read" }, ({ absolutePath }) => {
        const stat = fs.lstatSync(absolutePath);
        if (!stat.isDirectory() && !stat.isFile()) throw new UsageError(`unsupported cache source entry: ${relativePath}`);
        result.push({ path: absolutePath, mtimeMs: stat.mtimeMs }); return stat;
      });
    if (dir.relativePath !== ".") admit(dir.relativePath);
    forEachContainedDirectoryEntry({ root, relativePath: dir.relativePath, pathSyntax: "native" }, entry => {
      if (++entries > limits.max_files) throw new UsageError("cache source inventory exceeds entry limit");
      const relativePath = path.join(dir.relativePath, entry.name);
      if (!owns(path.resolve(root, relativePath))) return;
      const stat = admit(relativePath);
      if (stat.isDirectory()) pending.push({ relativePath, depth: dir.depth + 1 });
    });
  }
  return result;
}
