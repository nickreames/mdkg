import fs from "fs";
import path from "path";
import { parseFrontmatter } from "./frontmatter";
import { IndexNode } from "./indexer";
import { readZipEntries } from "../util/zip";
import { NotFoundError } from "../util/errors";

function readImportedBody(root: string, node: IndexNode): string {
  const source = node.source;
  if (!source?.imported) {
    throw new Error("node is not imported");
  }
  const bundlePath = path.resolve(root, source.bundle_path);
  if (!fs.existsSync(bundlePath)) {
    throw new NotFoundError(`bundle not found for ${node.qid}: ${source.bundle_path}`);
  }
  const entry = readZipEntries(fs.readFileSync(bundlePath)).find(
    (candidate) => candidate.name === source.original_path
  );
  if (!entry) {
    throw new NotFoundError(`bundle entry not found for ${node.qid}: ${source.original_path}`);
  }
  return parseFrontmatter(entry.data.toString("utf8"), source.original_path).body.trimEnd();
}

export function readNodeBody(root: string, node: IndexNode): string {
  if (node.source?.imported) {
    return readImportedBody(root, node);
  }
  const filePath = path.resolve(root, node.path);
  if (!fs.existsSync(filePath)) {
    throw new NotFoundError(`file not found for ${node.qid}: ${node.path}`);
  }
  const content = fs.readFileSync(filePath, "utf8");
  return parseFrontmatter(content, filePath).body.trimEnd();
}
