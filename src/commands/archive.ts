import crypto from "crypto";
import fs from "fs";
import path from "path";
import { loadConfig } from "../core/config";
import { FrontmatterValue, formatFrontmatter, parseFrontmatter } from "../graph/frontmatter";
import { buildIndex, IndexNode } from "../graph/indexer";
import { loadIndex, writeIndex } from "../graph/index_cache";
import { normalizeVisibility, Visibility } from "../graph/visibility";
import { formatDate } from "../util/date";
import { NotFoundError, UsageError, ValidationError } from "../util/errors";
import { isPortableId } from "../util/id";
import { archiveIdFromUri } from "../util/refs";
import { createDeterministicZip, readSingleFileZip } from "../util/zip";
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

function hashBuffer(buffer: Buffer): string {
  return `sha256:${crypto.createHash("sha256").update(buffer).digest("hex")}`;
}

function hashFile(filePath: string): string {
  return hashBuffer(fs.readFileSync(filePath));
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
  return sourcePath;
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
  const outputPath = path.resolve(root, config.index.global_index_path);
  writeIndex(outputPath, buildIndex(root, config, { tolerant: config.index.tolerant }));
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

function writeArchiveSidecar(
  sidecarPath: string,
  frontmatter: Record<string, FrontmatterValue>,
  body: string
): void {
  const lines = formatFrontmatter(frontmatter);
  const content = ["---", ...lines, "---", body.trimStart()].join("\n");
  fs.writeFileSync(sidecarPath, content.endsWith("\n") ? content : `${content}\n`, "utf8");
}

function verifyArchiveNode(root: string, node: IndexNode): ArchiveVerifyResult {
  const result: ArchiveVerifyResult = {
    qid: node.qid,
    id: node.id,
    path: node.path,
    ok: true,
    raw_present: false,
    compressed_present: false,
    errors: [],
  };
  const { rawPath, zipPath } = archiveNodePaths(root, node);
  const expectedRawHash = String(node.attributes.sha256 ?? "");
  const expectedCompressedHash = String(node.attributes.compressed_sha256 ?? "");
  const expectedByteSize = String(node.attributes.byte_size ?? "");

  if (!fs.existsSync(zipPath)) {
    result.errors.push(`compressed cache missing: ${path.relative(root, zipPath)}`);
  } else {
    result.compressed_present = true;
    const actualCompressedHash = hashFile(zipPath);
    if (actualCompressedHash !== expectedCompressedHash) {
      result.errors.push(`compressed_sha256 mismatch: ${actualCompressedHash}`);
    }
    try {
      const unzipped = readSingleFileZip(fs.readFileSync(zipPath));
      const unzippedHash = hashBuffer(unzipped.data);
      if (unzippedHash !== expectedRawHash) {
        result.errors.push(`zip payload sha256 mismatch: ${unzippedHash}`);
      }
      if (String(unzipped.data.length) !== expectedByteSize) {
        result.errors.push(`zip payload byte_size mismatch: ${unzipped.data.length}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      result.errors.push(`zip read failed: ${message}`);
    }
  }

  if (fs.existsSync(rawPath)) {
    result.raw_present = true;
    const actualRawHash = hashFile(rawPath);
    if (actualRawHash !== expectedRawHash) {
      result.errors.push(`raw sha256 mismatch: ${actualRawHash}`);
    }
    const actualByteSize = String(fs.statSync(rawPath).size);
    if (actualByteSize !== expectedByteSize) {
      result.errors.push(`raw byte_size mismatch: ${actualByteSize}`);
    }
  }
  result.ok = result.errors.length === 0;
  return result;
}

export function runArchiveAddCommand(options: ArchiveAddCommandOptions): void {
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
  const rawDir = path.join(archiveDir, "source");
  const rawPath = path.join(rawDir, basename);
  const zipPath = path.join(archiveDir, `${basename}.zip`);
  const sidecarPath = path.join(archiveDir, `${basename}.md`);
  if (fs.existsSync(sidecarPath)) {
    throw new UsageError(`archive sidecar already exists: ${path.relative(options.root, sidecarPath)}`);
  }
  fs.mkdirSync(rawDir, { recursive: true });
  fs.copyFileSync(sourcePath, rawPath);
  const rawData = fs.readFileSync(rawPath);
  const zipData = createDeterministicZip(basename, rawData);
  fs.writeFileSync(zipPath, zipData);

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
    sha256: hashBuffer(rawData),
    compressed_sha256: hashBuffer(zipData),
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
  const config = loadConfig(options.root);
  const { index } = loadIndex({ root: options.root, config });
  const nodes = options.id
    ? [resolveArchiveNode(options.root, options.id, options.ws)]
    : Object.values(index.nodes).filter((node) => node.type === "archive");
  const results = nodes.map((node) => verifyArchiveNode(options.root, node));
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

export function runArchiveCompressCommand(options: ArchiveCompressCommandOptions): void {
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
    if (!fs.existsSync(rawPath)) {
      throw new NotFoundError(`raw archive file missing for ${node.qid}: ${path.relative(options.root, rawPath)}`);
    }
    const rawData = fs.readFileSync(rawPath);
    const zipData = createDeterministicZip(path.basename(rawPath), rawData);
    fs.writeFileSync(zipPath, zipData);
    const parsed = parseFrontmatter(fs.readFileSync(sidecarPath, "utf8"), sidecarPath);
    const nextFrontmatter: Record<string, FrontmatterValue> = {
      ...parsed.frontmatter,
      byte_size: String(rawData.length),
      sha256: hashBuffer(rawData),
      compressed_sha256: hashBuffer(zipData),
      ingest_status: "compressed",
      updated: today,
    };
    writeArchiveSidecar(sidecarPath, nextFrontmatter, parsed.body);
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
