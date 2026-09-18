import fs from "fs";
import path from "path";
import { parseFrontmatter } from "./frontmatter";
import { IndexNode } from "./indexer";
import { assertSubgraphBundleFile, readSubgraphBundleEntries } from "./subgraph_bundle";
import { NotFoundError } from "../util/errors";
import { readContainedFile } from "../core/filesystem_authority";
import { importedSnapshotEntry, validateSubgraphBundleEntries } from "./subgraphs";

export const DEFAULT_NODE_BODY_MAX_BYTES = 8 * 1024 * 1024;

export function createNodeBodyReader(root: string, maxBytes = DEFAULT_NODE_BODY_MAX_BYTES): (node: IndexNode) => string {
  const bundleEntries = new Map<string, ReturnType<typeof validateSubgraphBundleEntries>>();
  return (node: IndexNode): string => {
    if (!node.source?.imported) {
      const filePath = path.resolve(root, node.path);
      if (!fs.existsSync(filePath)) {
        throw new NotFoundError(`file not found for ${node.qid}: ${node.path}`);
      }
      const content = readContainedFile({ root, relativePath: node.path, maxBytes }, "utf8");
      const parsed = parseFrontmatter(content, filePath);
      if (parsed.frontmatter.id !== node.id || parsed.frontmatter.type !== node.type) {
        throw new Error(`cached node identity mismatch for ${node.qid}`);
      }
      return parsed.body.trimEnd();
    }

    const source = node.source;
    const bundlePath = path.resolve(root, source.bundle_path);
    let entries = bundleEntries.get(bundlePath);
    if (entries) {
      // Preserve the existing snapshot-cache behavior after genuine deletion,
      // but never treat a linked/nonregular replacement or malformed path as
      // absence. This branch returns only previously loaded bytes, not new IO.
      try { assertSubgraphBundleFile(root, source.bundle_path); }
      catch (error) { if (!(error instanceof NotFoundError)) throw error; }
    } else {
      entries = validateSubgraphBundleEntries(readSubgraphBundleEntries(root, source.bundle_path));
      bundleEntries.set(bundlePath, entries);
    }
    const entry = importedSnapshotEntry(entries, node, maxBytes);
    if (entry.length > maxBytes) {
      throw new Error(`node body source exceeds byte limit for ${node.qid}: ${maxBytes}`);
    }
    return parseFrontmatter(entry.toString("utf8"), source.original_path).body.trimEnd();
  };
}

function readImportedBody(root: string, node: IndexNode, maxBytes: number): string {
  const source = node.source;
  if (!source?.imported) {
    throw new Error("node is not imported");
  }
  const entry = importedSnapshotEntry(validateSubgraphBundleEntries(readSubgraphBundleEntries(root, source.bundle_path)), node, maxBytes);
  if (entry.length > maxBytes) {
    throw new Error(`node body source exceeds byte limit for ${node.qid}: ${maxBytes}`);
  }
  return parseFrontmatter(entry.toString("utf8"), source.original_path).body.trimEnd();
}

export function readNodeBody(root: string, node: IndexNode, maxBytes = DEFAULT_NODE_BODY_MAX_BYTES): string {
  if (node.source?.imported) {
    return readImportedBody(root, node, maxBytes);
  }
  const filePath = path.resolve(root, node.path);
  if (!fs.existsSync(filePath)) {
    throw new NotFoundError(`file not found for ${node.qid}: ${node.path}`);
  }
  const content = readContainedFile({ root, relativePath: node.path, maxBytes }, "utf8");
  const parsed = parseFrontmatter(content, filePath);
  if (parsed.frontmatter.id !== node.id || parsed.frontmatter.type !== node.type) {
    throw new Error(`cached node identity mismatch for ${node.qid}`);
  }
  return parsed.body.trimEnd();
}
