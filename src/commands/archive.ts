import fs from "fs";
import path from "path";
import { loadConfig } from "../core/config";
import {
  atomicReplaceContainedFile,
  containedPathExists,
  readContainedFile,
  withContainedPathSink,
  writeContainedFileExclusive,
} from "../core/filesystem_authority";
import { workspaceDocumentRelativePath } from "../core/workspace_path";
import { FrontmatterValue, formatFrontmatter, parseFrontmatter } from "../graph/frontmatter";
import {
  checkArchiveIntegrity,
  hashArchiveBuffer,
} from "../graph/archive_integrity";
import { buildIndex, IndexNode } from "../graph/indexer";
import { loadIndex } from "../graph/index_cache";
import { writeDerivedIndexes } from "../graph/reindex";
import { normalizeVisibility, Visibility } from "../graph/visibility";
import { formatDate } from "../util/date";
import { NotFoundError, UsageError, ValidationError } from "../util/errors";
import { isPortableId } from "../util/id";
import { archiveIdFromUri } from "../util/refs";
import { withMutationLock } from "../util/lock";
import { createDeterministicZip } from "../util/zip";
import { appendAutomaticEvent } from "./event_support";

export type ArchiveAddCommandOptions = {
  root: string;
  file: string;
  id?: string;
  ws?: string;
  kind?: string;
  title?: string;
  refs?: string;
  relates?: string;
  visibility?: string;
  json?: boolean;
  now?: Date;
};

export type ArchiveListCommandOptions = {
  root: string;
  ws?: string;
  kind?: string;
  visibility?: string;
  json?: boolean;
};

export type ArchiveShowCommandOptions = {
  root: string;
  id: string;
  ws?: string;
  json?: boolean;
};

export type ArchiveVerifyCommandOptions = {
  root: string;
  id?: string;
  ws?: string;
  json?: boolean;
};

export type ArchiveCompressCommandOptions = {
  root: string;
  id?: string;
  all?: boolean;
  ws?: string;
  json?: boolean;
  now?: Date;
};

type ArchiveReceipt = {
  workspace: string;
  id: string;
  qid: string;
  path: string;
  archive_uri: string;
  stored_path: string;
  compressed_path: string;
  sha256: string;
  compressed_sha256: string;
  visibility: Visibility;
};

type ArchiveVerifyResult = {
  qid: string;
  id: string;
  path: string;
  ok: boolean;
  raw_present: boolean;
  compressed_present: boolean;
  errors: string[];
};

const ARCHIVE_KINDS = new Set(["source", "artifact"]);
const MIME_BY_EXT: Record<string, string> = {
  ".csv": "text/csv",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".json": "application/json",
  ".md": "text/markdown",
  ".pdf": "application/pdf",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".txt": "text/plain",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".zip": "application/zip",
};

function parseCsvList(raw?: string): string[] {
  if (!raw) {
    return [];
  }
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function toPosixPath(value: string): string {
  return value.split(path.sep).join("/");
}

function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
  return slug || "archive";
}

function normalizeWorkspace(value?: string): string {
  if (!value) {
    return "root";
  }
  const normalized = value.toLowerCase();
  if (normalized === "all") {
    throw new UsageError("--ws all is not valid for archive commands");
  }
  return normalized;
}

function normalizeArchiveKind(value?: string): "source" | "artifact" {
  const normalized = (value ?? "source").toLowerCase();
  if (!ARCHIVE_KINDS.has(normalized)) {
    throw new UsageError("--kind must be one of source, artifact");
  }
  return normalized as "source" | "artifact";
}

function normalizeArchiveId(raw: string): string {
  const normalized = raw.toLowerCase();
  if (!normalized.startsWith("archive.") || !isPortableId(normalized)) {
    throw new UsageError("--id must be a lowercase portable archive id like archive.example");
  }
  return normalized;
}

function archiveIdFromInput(value: string): string {
  return normalizeArchiveId(archiveIdFromUri(value) ?? value);
}

function inferMime(filePath: string): string {
  return MIME_BY_EXT[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
}

function sourcePathLabel(root: string, sourcePath: string): string {
  const relative = path.relative(root, sourcePath);
  if (!relative.startsWith("..") && !path.isAbsolute(relative)) {
    return toPosixPath(relative);
  }
  return `external:${path.basename(sourcePath)}`;
}

function nextArchiveId(root: string, ws: string, basename: string, existingIds: Set<string>): string {
  const base = `archive.${slugify(basename.replace(/\.[^.]+$/, ""))}`;
  if (!existingIds.has(`${ws}:${base}`)) {
    return base;
  }
  for (let index = 2; index < 1000; index += 1) {
    const candidate = `${base}-${index}`;
    if (!existingIds.has(`${ws}:${candidate}`)) {
      return candidate;
    }
  }
  throw new UsageError(`unable to choose archive id for ${basename} in ${root}`);
}

function archiveNodeReceipt(root: string, node: IndexNode): ArchiveReceipt {
  return {
    workspace: node.ws,
    id: node.id,
    qid: node.qid,
    path: node.path,
    archive_uri: `archive://${node.id}`,
    stored_path: String(node.attributes.stored_path ?? ""),
    compressed_path: String(node.attributes.compressed_path ?? ""),
    sha256: String(node.attributes.sha256 ?? ""),
    compressed_sha256: String(node.attributes.compressed_sha256 ?? ""),
    visibility: normalizeVisibility(
      typeof node.attributes.visibility === "string" ? node.attributes.visibility : undefined,
      "archive visibility"
    ),
  };
}

function maybeReindex(root: string): void {
  const config = loadConfig(root);
  if (!config.index.auto_reindex) {
    return;
  }
  writeDerivedIndexes(root, config, buildIndex(root, config, { tolerant: config.index.tolerant }));
}

function resolveArchiveNode(root: string, id: string, ws?: string): IndexNode {
  const config = loadConfig(root);
  const { index } = loadIndex({ root, config });
  const archiveId = archiveIdFromInput(id);
  const wsHint = normalizeWorkspace(ws);
  const qid = archiveId.includes(":") ? archiveId : `${wsHint}:${archiveId}`;
  const node = index.nodes[qid];
  if (!node || node.type !== "archive") {
    throw new NotFoundError(`archive not found: ${id}`);
  }
  return node;
}

function archiveNodePaths(root: string, node: IndexNode): {
  sidecarPath: string;
  rawPath: string;
  zipPath: string;
} {
  const sidecarPath = path.resolve(root, node.path);
  const sidecarDir = path.dirname(sidecarPath);
  return {
    sidecarPath,
    rawPath: path.resolve(sidecarDir, String(node.attributes.stored_path ?? "")),
    zipPath: path.resolve(sidecarDir, String(node.attributes.compressed_path ?? "")),
  };
}

function walkArchiveSidecars(root: string): string[] {
  if (!fs.existsSync(root)) {
    return [];
  }
  const entries = fs.readdirSync(root, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (entry.name === "source") {
      continue;
    }
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkArchiveSidecars(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files.sort();
}

function stringAttribute(value: FrontmatterValue | undefined): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function writeArchiveSidecar(
  root: string,
  sidecarPath: string,
  frontmatter: Record<string, FrontmatterValue>,
  body: string
): void {
  const lines = formatFrontmatter(frontmatter);
  const content = ["---", ...lines, "---", body.trimStart()].join("\n");
  atomicReplaceContainedFile(
    { root, relativePath: toPosixPath(path.relative(root, sidecarPath)) },
    content.endsWith("\n") ? content : `${content}\n`
  );
}

function verifyArchiveSidecar(root: string, ws: string, sidecarPath: string): ArchiveVerifyResult | undefined {
  const relativePath = toPosixPath(path.relative(root, sidecarPath));
  let frontmatter: Record<string, FrontmatterValue>;
  try {
    frontmatter = parseFrontmatter(fs.readFileSync(sidecarPath, "utf8"), sidecarPath).frontmatter;
  } catch (err) {
    return {
      qid: `${ws}:${relativePath}`,
      id: relativePath,
      path: relativePath,
      ok: false,
      raw_present: false,
      compressed_present: false,
      errors: [err instanceof Error ? err.message : String(err)],
    };
  }
  if (frontmatter.type !== "archive") {
    return undefined;
  }
  const id = stringAttribute(frontmatter.id) ?? relativePath;
  const result: ArchiveVerifyResult = {
    qid: `${ws}:${id}`,
    id,
    path: relativePath,
    ok: true,
    raw_present: false,
    compressed_present: false,
    errors: [],
  };

  const sidecarDir = path.dirname(sidecarPath);
  const sourcePath = stringAttribute(frontmatter.source_path);
  const storedPath = stringAttribute(frontmatter.stored_path);
  const compressedPath = stringAttribute(frontmatter.compressed_path);
  const expectedRawHash = stringAttribute(frontmatter.sha256);
  const expectedCompressedHash = stringAttribute(frontmatter.compressed_sha256);
  const expectedByteSize = stringAttribute(frontmatter.byte_size);
  for (const [key, value] of [
    ["source_path", sourcePath],
    ["stored_path", storedPath],
    ["compressed_path", compressedPath],
    ["sha256", expectedRawHash],
    ["compressed_sha256", expectedCompressedHash],
    ["byte_size", expectedByteSize],
  ] as const) {
    if (!value) {
      result.errors.push(`${key} is required`);
    }
  }
  if (result.errors.length > 0) {
    result.ok = false;
    return result;
  }

  const checked = checkArchiveIntegrity({
    root,
    rawPath: path.resolve(sidecarDir, storedPath as string),
    zipPath: path.resolve(sidecarDir, compressedPath as string),
    expectedRawHash: expectedRawHash as string,
    expectedCompressedHash: expectedCompressedHash as string,
    expectedByteSize: expectedByteSize as string,
  });
  result.raw_present = checked.raw_present;
  result.compressed_present = checked.compressed_present;
  result.errors = checked.errors;
  result.ok = checked.ok;
  return result;
}

function loadArchiveVerifyResults(options: ArchiveVerifyCommandOptions): ArchiveVerifyResult[] {
  const config = loadConfig(options.root);
  const wsFilter = options.ws ? normalizeWorkspace(options.ws) : undefined;
  if (wsFilter && !config.workspaces[wsFilter]) {
    throw new NotFoundError(`workspace not found: ${wsFilter}`);
  }
  const idFilter = options.id ? archiveIdFromInput(options.id) : undefined;
  const results: ArchiveVerifyResult[] = [];
  for (const alias of Object.keys(config.workspaces).sort()) {
    if (wsFilter && alias !== wsFilter) {
      continue;
    }
    const workspace = config.workspaces[alias];
    if (!workspace.enabled) {
      continue;
    }
    const archiveRoot = path.resolve(options.root, workspace.path, workspace.mdkg_dir, "archive");
    for (const sidecarPath of walkArchiveSidecars(archiveRoot)) {
      const result = verifyArchiveSidecar(options.root, alias, sidecarPath);
      if (!result) {
        continue;
      }
      if (idFilter && result.id !== idFilter) {
        continue;
      }
      results.push(result);
    }
  }
  if (idFilter && results.length === 0) {
    throw new NotFoundError(`archive not found: ${options.id}`);
  }
  return results;
}

function runArchiveAddCommandLocked(options: ArchiveAddCommandOptions): void {
  const config = loadConfig(options.root);
  const ws = normalizeWorkspace(options.ws);
  const workspace = config.workspaces[ws];
  if (!workspace) {
    throw new NotFoundError(`workspace not found: ${ws}`);
  }
  const sourcePath = path.resolve(options.root, options.file);
  if (!fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isFile()) {
    throw new NotFoundError(`archive source file not found: ${options.file}`);
  }
  const { index } = loadIndex({ root: options.root, config });
  const basename = path.basename(sourcePath);
  const id = options.id
    ? normalizeArchiveId(options.id)
    : nextArchiveId(options.root, ws, basename, new Set(Object.keys(index.nodes)));
  const qid = `${ws}:${id}`;
  if (index.nodes[qid]) {
    throw new UsageError(`archive already exists: ${qid}`);
  }

  const archiveKind = normalizeArchiveKind(options.kind);
  const visibility = normalizeVisibility(options.visibility);
  const today = formatDate(options.now ?? new Date());
  const archiveDir = path.resolve(options.root, workspace.path, workspace.mdkg_dir, "archive", id);
  const archiveRelativeDir = workspaceDocumentRelativePath(workspace.path, workspace.mdkg_dir, "archive", id);
  const rawDir = path.join(archiveDir, "source");
  const rawPath = path.join(rawDir, basename);
  const zipPath = path.join(archiveDir, `${basename}.zip`);
  const sidecarPath = path.join(archiveDir, `${basename}.md`);
  const sidecarRelativePath = `${archiveRelativeDir}/${basename}.md`;
  const rawRelativePath = `${archiveRelativeDir}/source/${basename}`;
  const zipRelativePath = `${archiveRelativeDir}/${basename}.zip`;
  if (containedPathExists({ root: options.root, relativePath: sidecarRelativePath })) {
    throw new UsageError(`archive sidecar already exists: ${path.relative(options.root, sidecarPath)}`);
  }
  for (const [relativePath, operation] of [
    [rawRelativePath, "create"],
    [zipRelativePath, "replace"],
    [sidecarRelativePath, "create"],
  ] as const) {
    withContainedPathSink(
      { root: options.root, relativePath, operation, createParents: true },
      () => undefined
    );
  }
  const rawData = fs.readFileSync(sourcePath);
  writeContainedFileExclusive({ root: options.root, relativePath: rawRelativePath }, rawData);
  const zipData = createDeterministicZip(basename, rawData);
  atomicReplaceContainedFile({ root: options.root, relativePath: zipRelativePath }, zipData);

  const frontmatter: Record<string, FrontmatterValue> = {
    id,
    type: "archive",
    title: options.title ?? basename,
    archive_kind: archiveKind,
    source_path: sourcePathLabel(options.root, sourcePath),
    stored_path: toPosixPath(path.relative(archiveDir, rawPath)),
    compressed_path: toPosixPath(path.relative(archiveDir, zipPath)),
    mime_type: inferMime(sourcePath),
    byte_size: String(rawData.length),
    sha256: hashArchiveBuffer(rawData),
    compressed_sha256: hashArchiveBuffer(zipData),
    visibility,
    provenance: "local-copy",
    ingest_status: "compressed",
    tags: [],
    owners: [],
    links: [],
    artifacts: [],
    relates: parseCsvList(options.relates),
    refs: parseCsvList(options.refs),
    aliases: [],
    created: today,
    updated: today,
  };
  writeArchiveSidecar(
    options.root,
    sidecarPath,
    frontmatter,
    ["# Archive Entry", "", `Archived ${archiveKind}: ${basename}`, "", "# Provenance", "", "Copied from local workspace input."].join("\n")
  );

  maybeReindex(options.root);
  appendAutomaticEvent({
    root: options.root,
    ws,
    kind: "ARCHIVE_ADDED",
    status: "ok",
    refs: [id],
    artifacts: [`archive://${id}`],
    notes: "archive sidecar created via mdkg archive add",
    now: options.now,
  });

  const receipt: ArchiveReceipt = {
    workspace: ws,
    id,
    qid,
    path: toPosixPath(path.relative(options.root, sidecarPath)),
    archive_uri: `archive://${id}`,
    stored_path: toPosixPath(path.relative(options.root, rawPath)),
    compressed_path: toPosixPath(path.relative(options.root, zipPath)),
    sha256: String(frontmatter.sha256),
    compressed_sha256: String(frontmatter.compressed_sha256),
    visibility,
  };
  if (options.json) {
    console.log(JSON.stringify({ action: "created", archive: receipt }, null, 2));
    return;
  }
  console.log(`archive created: ${receipt.qid} (${receipt.path})`);
}

export function runArchiveListCommand(options: ArchiveListCommandOptions): void {
  const config = loadConfig(options.root);
  const { index } = loadIndex({ root: options.root, config });
  const ws = options.ws ? normalizeWorkspace(options.ws) : undefined;
  const kind = options.kind ? normalizeArchiveKind(options.kind) : undefined;
  const visibility = options.visibility
    ? normalizeVisibility(options.visibility)
    : undefined;
  const items = Object.values(index.nodes)
    .filter((node) => node.type === "archive")
    .filter((node) => !ws || node.ws === ws)
    .filter((node) => !kind || node.attributes.archive_kind === kind)
    .filter((node) => !visibility || node.attributes.visibility === visibility)
    .sort((a, b) => a.qid.localeCompare(b.qid))
    .map((node) => archiveNodeReceipt(options.root, node));
  if (options.json) {
    console.log(JSON.stringify({ kind: "archive", count: items.length, items }, null, 2));
    return;
  }
  for (const item of items) {
    console.log(`${item.qid} | ${item.archive_uri} | ${item.path}`);
  }
  console.error(`count: ${items.length}`);
}

export function runArchiveShowCommand(options: ArchiveShowCommandOptions): void {
  const node = resolveArchiveNode(options.root, options.id, options.ws);
  const receipt = archiveNodeReceipt(options.root, node);
  if (options.json) {
    console.log(JSON.stringify({ kind: "archive", item: receipt, attributes: node.attributes }, null, 2));
    return;
  }
  console.log(`${node.qid} | archive | ${node.title}`);
  console.log(`path: ${node.path}`);
  console.log(`archive_uri: archive://${node.id}`);
  for (const [key, value] of Object.entries(node.attributes)) {
    console.log(`${key}: ${Array.isArray(value) ? value.join(", ") : value}`);
  }
}

export function runArchiveVerifyCommand(options: ArchiveVerifyCommandOptions): void {
  const results = loadArchiveVerifyResults(options);
  const ok = results.every((result) => result.ok);
  if (options.json) {
    console.log(JSON.stringify({ ok, count: results.length, results }, null, 2));
  } else {
    for (const result of results) {
      console.log(`${result.ok ? "ok" : "failed"}: ${result.qid}`);
      for (const error of result.errors) {
        console.log(`  - ${error}`);
      }
    }
  }
  if (!ok) {
    throw new ValidationError("archive verification failed");
  }
}

function runArchiveCompressCommandLocked(options: ArchiveCompressCommandOptions): void {
  if (!options.all && !options.id) {
    throw new UsageError("archive compress requires <id-or-archive-uri> or --all");
  }
  const config = loadConfig(options.root);
  const { index } = loadIndex({ root: options.root, config });
  const nodes = options.all
    ? Object.values(index.nodes).filter((node) => node.type === "archive")
    : [resolveArchiveNode(options.root, String(options.id), options.ws)];
  const updated: ArchiveReceipt[] = [];
  const today = formatDate(options.now ?? new Date());

  for (const node of nodes) {
    const { sidecarPath, rawPath, zipPath } = archiveNodePaths(options.root, node);
    const rawRelativePath = toPosixPath(path.relative(options.root, rawPath));
    const zipRelativePath = toPosixPath(path.relative(options.root, zipPath));
    const sidecarRelativePath = toPosixPath(path.relative(options.root, sidecarPath));
    for (const relativePath of [rawRelativePath, zipRelativePath, sidecarRelativePath]) {
      withContainedPathSink(
        { root: options.root, relativePath, operation: relativePath === rawRelativePath ? "read" : "replace" },
        () => undefined
      );
    }
    if (!containedPathExists({ root: options.root, relativePath: rawRelativePath })) {
      throw new NotFoundError(`raw archive file missing for ${node.qid}: ${path.relative(options.root, rawPath)}`);
    }
    const rawData = readContainedFile({ root: options.root, relativePath: rawRelativePath }, null);
    const zipData = createDeterministicZip(path.basename(rawPath), rawData);
    atomicReplaceContainedFile({ root: options.root, relativePath: zipRelativePath }, zipData);
    const parsed = parseFrontmatter(
      readContainedFile({ root: options.root, relativePath: sidecarRelativePath }),
      sidecarPath
    );
    const nextFrontmatter: Record<string, FrontmatterValue> = {
      ...parsed.frontmatter,
      byte_size: String(rawData.length),
      sha256: hashArchiveBuffer(rawData),
      compressed_sha256: hashArchiveBuffer(zipData),
      ingest_status: "compressed",
      updated: today,
    };
    writeArchiveSidecar(options.root, sidecarPath, nextFrontmatter, parsed.body);
    updated.push({
      workspace: node.ws,
      id: node.id,
      qid: node.qid,
      path: node.path,
      archive_uri: `archive://${node.id}`,
      stored_path: String(nextFrontmatter.stored_path ?? ""),
      compressed_path: String(nextFrontmatter.compressed_path ?? ""),
      sha256: String(nextFrontmatter.sha256),
      compressed_sha256: String(nextFrontmatter.compressed_sha256),
      visibility: normalizeVisibility(
        typeof nextFrontmatter.visibility === "string" ? nextFrontmatter.visibility : undefined,
        "archive visibility"
      ),
    });
  }
  maybeReindex(options.root);
  if (options.json) {
    console.log(JSON.stringify({ action: "compressed", count: updated.length, archives: updated }, null, 2));
    return;
  }
  console.log(`archive compressed: ${updated.length}`);
}

function withArchiveLock<T>(root: string, fn: () => T): T {
  const config = loadConfig(root);
  return withMutationLock(root, config.index.lock_timeout_ms, fn);
}

export function runArchiveAddCommand(options: ArchiveAddCommandOptions): void {
  return withArchiveLock(options.root, () => runArchiveAddCommandLocked(options));
}

export function runArchiveCompressCommand(options: ArchiveCompressCommandOptions): void {
  return withArchiveLock(options.root, () => runArchiveCompressCommandLocked(options));
}
