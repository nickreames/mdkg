import fs from "fs";
import path from "path";
import { parseFrontmatter } from "./frontmatter";
import { IndexNode } from "./indexer";
import { readZipFileEntries } from "../util/zip";
import { NotFoundError } from "../util/errors";
import { readContainedFile } from "../core/filesystem_authority";

export const DEFAULT_NODE_BODY_MAX_BYTES = 8 * 1024 * 1024;

export function createNodeBodyReader(root: string, maxBytes = DEFAULT_NODE_BODY_MAX_BYTES): (node: IndexNode) => string {
  const bundleEntries = new Map<string, Map<string, Buffer>>();
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
    if (!entries) {
      if (!fs.existsSync(bundlePath)) {
        throw new NotFoundError(`bundle not found for ${node.qid}: ${source.bundle_path}`);
      }
      entries = new Map(readZipFileEntries(bundlePath).map((entry) => [entry.name, entry.data]));
      bundleEntries.set(bundlePath, entries);
    }
    const entry = entries.get(source.original_path);
    if (!entry) {
      throw new NotFoundError(`bundle entry not found for ${node.qid}: ${source.original_path}`);
    }
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
  const bundlePath = path.resolve(root, source.bundle_path);
  if (!fs.existsSync(bundlePath)) {
    throw new NotFoundError(`bundle not found for ${node.qid}: ${source.bundle_path}`);
  }
  const entry = readZipFileEntries(bundlePath).find(
    (candidate) => candidate.name === source.original_path
  );
  if (!entry) {
    throw new NotFoundError(`bundle entry not found for ${node.qid}: ${source.original_path}`);
  }
  if (entry.data.length > maxBytes) {
    throw new Error(`node body source exceeds byte limit for ${node.qid}: ${maxBytes}`);
  }
  return parseFrontmatter(entry.data.toString("utf8"), source.original_path).body.trimEnd();
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
