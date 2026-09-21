import path from "path";
import { atomicReplaceContainedFile, withContainedPathSink } from "../core/filesystem_authority";
import { assertCompatibleWriter } from "../util/writer_admission";

function cachePath(root: string, outputPath: string) {
  // Cache resolvers already use native path.resolve. Preserve that contract,
  // including literal POSIX backslashes, without deriving authority from the
  // destination directory or attacker-controlled cached metadata.
  return { root, relativePath: path.relative(root, path.resolve(root, outputPath)), pathSyntax: "native" as const };
}

export function preflightCacheOutputs(root: string, outputPaths: string[]): void {
  for (const outputPath of outputPaths) {
    withContainedPathSink({ ...cachePath(root, outputPath), operation: "replace", createParents: false }, () => undefined);
  }
}

export function writeCacheFile(root: string, outputPath: string, content: string): void {
  assertCompatibleWriter(root);
  atomicReplaceContainedFile(cachePath(root, outputPath), content);
}
