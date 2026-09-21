import fs from "fs";
import path from "path";
import { Config } from "../core/config";
import { configPath } from "../core/paths";
import { listWorkspaceDocFiles, readWorkspaceDocument } from "./workspace_files";
import { loadTemplateSchemasWithInfo } from "./template_schema";
import { ALLOWED_TYPES, parseNode } from "./node";
import { parseFrontmatter } from "./frontmatter";
import { ContainedPathError } from "../core/filesystem_authority";
import { UsageError } from "../util/errors";
import { identityHash } from "./identity";
import { nodeCacheFingerprint, readJsonCacheFingerprint } from "./json_cache_fingerprint";

function mtimeMs(filePath: string): number {
  return fs.statSync(filePath).mtimeMs;
}

export function currentNodeCacheFingerprint(root: string, config: Config, docs = listWorkspaceDocFiles(root, config),
  tolerant = config.index.tolerant): string {
  const documents: Record<string, string> = {};
  const archiveIntegrity: Record<string, boolean> = {};
  const templates = loadTemplateSchemasWithInfo(root, config, ALLOWED_TYPES);
  for (const file of docs) {
    const relative = path.relative(root, file).split(path.sep).join("/");
    const content = readWorkspaceDocument(root, file, config.index.limits.max_file_bytes);
    documents[relative] = identityHash(content);
    if (path.basename(file) === "core.md" && path.basename(path.dirname(file)) === "core") continue;
    try {
      if (parseFrontmatter(content, file).frontmatter.type === "archive") {
        parseNode(content, file, { archiveRoot: root,
          onArchiveIntegrity: valid => { archiveIntegrity[relative] = valid; },
          workStatusEnum: config.work.status_enum, priorityMin: config.work.priority_min,
          priorityMax: config.work.priority_max, templateSchemas: templates.schemas });
      }
    } catch (error) {
      // Capture failed archive admission too. Content changes still invalidate
      // the fingerprint, and normal rebuilding enforces strict parse errors.
      // This preserves explicit no-reindex stale-cache reads without downgrading
      // filesystem authority failures or validating corrupted source as current.
      if (error instanceof ContainedPathError || error instanceof UsageError) throw error;
    }
  }
  return nodeCacheFingerprint(config, documents, templates.sourceInputs, tolerant, archiveIntegrity);
}

export function isIndexStale(root: string, config: Config, tolerant = config.index.tolerant): boolean {
  const indexPath = path.resolve(root, config.index.global_index_path);
  if (!fs.existsSync(indexPath)) {
    return true;
  }

  const indexMtime = mtimeMs(indexPath);
  const cfgPath = configPath(root);
  if (fs.existsSync(cfgPath) && mtimeMs(cfgPath) > indexMtime) {
    return true;
  }

  const docs = listWorkspaceDocFiles(root, config);
  for (const filePath of docs) {
    if (mtimeMs(filePath) > indexMtime) {
      return true;
    }
  }

  const fingerprint = readJsonCacheFingerprint(root, indexPath);
  return !fingerprint || fingerprint !== currentNodeCacheFingerprint(root, config, docs, tolerant);
}
