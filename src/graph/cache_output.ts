import path from "path";
import { atomicReplaceContainedFile, withContainedPathSink } from "../core/filesystem_authority";
import { assertCompatibleWriter } from "../util/writer_admission";
import { assertNoGitMetadataDestinations } from "../util/git_metadata";

function cachePath(root: string, outputPath: string) {
  // Cache resolvers already use native path.resolve. Preserve that contract,
  // including literal POSIX backslashes, without deriving authority from the
  // destination directory or attacker-controlled cached metadata.
  return { root, relativePath: path.relative(root, path.resolve(root, outputPath)), pathSyntax: "native" as const };
}

export function preflightCacheOutputs(root: string, outputPaths: string[]): void {
  assertNoGitMetadataDestinations(root, outputPaths.map(output => cachePath(root, output).relativePath), { pathSyntax: "native" });
  for (const outputPath of outputPaths) {
    withContainedPathSink({ ...cachePath(root, outputPath), operation: "replace", createParents: false }, () => undefined);
  }
}

export function writeCacheFile(root: string, outputPath: string, content: string): void {
  assertCompatibleWriter(root);
  preflightCacheOutputs(root, [outputPath]);
  atomicReplaceContainedFile(cachePath(root, outputPath), content);
}
