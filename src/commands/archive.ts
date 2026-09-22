import fs from "fs";
import path from "path";
import { authorNewIdentityNode } from "../graph/identity_authoring";
import { identityRef, NodeIdentity, parseIdentityRef, readGraphFormat } from "../graph/identity";
import { Config, DEFAULT_INDEX_LIMITS, loadConfig } from "../core/config";
import {
  atomicReplaceContainedFile,
  containedPathExists,
  forEachContainedDirectoryEntry,
  readContainedFile,
  withContainedPathSink,
  writeContainedFileExclusive,
} from "../core/filesystem_authority";
import { workspaceDocumentRelativePath } from "../core/workspace_path";
import { normalizeTemplatePath } from "../core/template_path";
import { FrontmatterValue, formatFrontmatter, parseFrontmatter } from "../graph/frontmatter";
import { validateArchiveFrontmatter } from "../graph/archive_file";
import {
  checkArchiveIntegrity,
  hashArchiveBuffer,
} from "../graph/archive_integrity";
import { buildIndex, Index, IndexNode } from "../graph/indexer";
import { loadIndex } from "../graph/index_cache";
import { buildSubgraphsIndex, mergeSubgraphsIntoIndex } from "../graph/subgraphs";
import { writeDerivedIndexes } from "../graph/reindex";
import { normalizeVisibility, Visibility } from "../graph/visibility";
import { formatDate } from "../util/date";
import { NotFoundError, UsageError, ValidationError } from "../util/errors";
import { isPortableId } from "../util/id";
import { archiveIdFromUri } from "../util/refs";
import { withMutationLock } from "../util/lock";
import { formatResolveError, resolveQid } from "../util/qid";
import { createDeterministicZip } from "../util/zip";
import { appendAutomaticEvent } from "./event_support";
import { absoluteWorkspaceDocumentOwner } from "../graph/workspace_ownership";

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
  alias_qid?: string;
  workspace: string;
  id: string;
  qid: string;
  identity?: NodeIdentity;
  stable_ref?: string;
  path: string;
  archive_uri: string;
  stored_path: string;
  compressed_path: string;
  sha256: string;
  compressed_sha256: string;
  visibility: Visibility;
};

type ArchiveVerifyResult = {
  identity?: NodeIdentity;
  stable_ref?: string;
  alias_qid?: string;
  qid: string;
  id: string;
  path: string;
  ok: boolean;
  raw_present: boolean;
  compressed_present: boolean;
  errors: string[];
};

type ArchiveCompressionExclusion = {
  workspace: string;
  qid: string;
  reason: "read_only_imported_subgraph";
};

type ArchiveCompressionSelection = {
  requested_workspace: string | null;
  selected_workspaces: string[];
  excluded_read_only: ArchiveCompressionExclusion[];
};

type ArchiveCompressionPlan = {
  zipRelativePath: string;
  sidecarRelativePath: string;
  zipData: Buffer;
  sidecarContent: string;
  receipt: ArchiveReceipt;
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

function archiveTargetFromInput(value: string, ws?: string): { id: string; workspace: string } {
  const uriId = archiveIdFromUri(value);
  if (uriId) {
    return { id: normalizeArchiveId(uriId), workspace: normalizeWorkspace(ws) };
  }
  const separator = value.indexOf(":");
  if (separator > 0) {
    const workspace = normalizeWorkspace(value.slice(0, separator));
    const id = normalizeArchiveId(value.slice(separator + 1));
    if (ws && normalizeWorkspace(ws) !== workspace) {
      throw new UsageError(`archive qid ${value} conflicts with --ws ${normalizeWorkspace(ws)}`);
    }
    return { id, workspace };
  }
  return { id: normalizeArchiveId(value), workspace: normalizeWorkspace(ws) };
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
    ...(node.identity ? { identity: node.identity, stable_ref: identityRef(node.identity) } : {}),
    ...(node.alias_qid ? { alias_qid: node.alias_qid } : {}),
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
  const { index } = loadIndex({ root, config, inspection: true, persistReindex: false });
  return resolveArchiveNodeFromIndex(index, id, ws);
}

function archiveNodePaths(root: string, node: IndexNode): {
  sidecarPath: string;
  rawPath: string;
  zipPath: string;
} {
  // Imported projections carry explicit source markers. A literal # is also a
  // valid local filename and is not, by itself, evidence of a projection.
  if (node.source?.imported || node.source?.read_only) {
    throw new ValidationError(`refusing to derive filesystem paths for read-only archive projection ${node.qid}`);
  }
  const sidecarPath = path.resolve(root, node.path);
  const sidecarDir = path.dirname(sidecarPath);
  return {
    sidecarPath,
    rawPath: path.resolve(sidecarDir, String(node.attributes.stored_path ?? "")),
    zipPath: path.resolve(sidecarDir, String(node.attributes.compressed_path ?? "")),
  };
}

type ArchiveVerificationBudget = {
  limits: Config["index"]["limits"];
  entries: number;
  files: number;
  bytes: number;
};

function walkArchiveSidecars(root: string, relativeRoot: string, budget: ArchiveVerificationBudget): string[] {
  if (!containedPathExists({ root, relativePath: relativeRoot })) return [];
  const files: string[] = [];
  const visit = (relativePath: string, depth: number) => {
    if (depth > budget.limits.max_depth) throw new ValidationError("archive discovery exceeds index.limits.max_depth");
    forEachContainedDirectoryEntry({ root, relativePath, pathSyntax: "native" }, (entry) => {
      if (++budget.entries > budget.limits.max_files * 10) throw new ValidationError("archive discovery entry budget exceeded");
      if (entry.name === "source") return;
      const child = path.join(relativePath, entry.name);
      if (entry.isDirectory()) visit(child, depth + 1);
      else if (entry.isFile() && entry.name.endsWith(".md")) {
        if (++budget.files > budget.limits.max_files) throw new ValidationError("archive discovery exceeds index.limits.max_files");
        files.push(path.resolve(root, child));
      }
      // Descendant links/special entries remain excluded, never followed.
    });
  };
  visit(relativeRoot, 0);
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
  atomicReplaceContainedFile(
    { root, relativePath: toPosixPath(path.relative(root, sidecarPath)) },
    formatArchiveSidecar(frontmatter, body)
  );
}

function formatArchiveSidecar(
  frontmatter: Record<string, FrontmatterValue>,
  body: string
): string {
  const lines = formatFrontmatter(frontmatter);
  const content = ["---", ...lines, "---", body.trimStart()].join("\n");
  return content.endsWith("\n") ? content : `${content}\n`;
}

function verifyArchiveSidecar(root: string, ws: string, sidecarPath: string, budget: ArchiveVerificationBudget, idFilter?: string): ArchiveVerifyResult | undefined {
  const relativePath = toPosixPath(path.relative(root, sidecarPath));
  let frontmatter: Record<string, FrontmatterValue>;
  try {
    const bytes = readContainedFile({ root, relativePath: path.relative(root, sidecarPath), pathSyntax: "native", maxBytes: Math.min(budget.limits.max_file_bytes, budget.limits.max_total_bytes - budget.bytes) }, null);
    budget.bytes += bytes.length;
    frontmatter = parseFrontmatter(bytes.toString("utf8"), sidecarPath).frontmatter;
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
  if (idFilter && id !== idFilter) return undefined;
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
  const storedPath = stringAttribute(frontmatter.stored_path);
  const compressedPath = stringAttribute(frontmatter.compressed_path);
  const expectedRawHash = stringAttribute(frontmatter.sha256);
  const expectedCompressedHash = stringAttribute(frontmatter.compressed_sha256);
  const expectedByteSize = stringAttribute(frontmatter.byte_size);
  // Schema validation precedes resolution: do not launder traversal into a
  // normal-looking absolute path. Payload integrity then uses repository root,
  // never the attacker-controlled sidecar directory as the authority root.
  try { validateArchiveFrontmatter("archive", frontmatter, sidecarPath, true); }
  catch (err) { result.errors.push(err instanceof Error ? err.message : String(err)); }
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
  const limits: Config["index"]["limits"] = { ...DEFAULT_INDEX_LIMITS };
  for (const key of Object.keys(limits) as Array<keyof typeof limits>) limits[key] = Math.min(limits[key], config.index.limits[key]);
  const budget: ArchiveVerificationBudget = { limits, entries: 0, files: 0, bytes: 0 };
  if (options.id && (parseIdentityRef(options.id) || readGraphFormat(options.root).format_version === 2)) {
    const node = resolveArchiveNode(options.root, options.id, options.ws);
    const { sidecarPath } = archiveNodePaths(options.root, node);
    const result = verifyArchiveSidecar(options.root, node.ws, sidecarPath, budget);
    if (!result) throw new NotFoundError(`archive not found: ${options.id}`);
    return [{ ...result, qid: node.qid, ...(node.alias_qid ? { alias_qid: node.alias_qid } : {}),
      ...(node.identity ? { identity: node.identity, stable_ref: identityRef(node.identity) } : {}) }];
  }
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
    const archiveRoot = workspaceDocumentRelativePath(workspace.path, workspace.mdkg_dir, "archive");
    for (const sidecarPath of walkArchiveSidecars(options.root, archiveRoot, budget)) {
      const result = verifyArchiveSidecar(options.root, alias, sidecarPath, budget, idFilter);
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
      { root: options.root, relativePath, operation, createParents: false },
      () => undefined
    );
  }
  const rawData = fs.readFileSync(sourcePath);
  const zipData = createDeterministicZip(basename, rawData);

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
  const authored = authorNewIdentityNode(options.root, index, ws, formatArchiveSidecar(frontmatter,
    ["# Archive Entry", "", `Archived ${archiveKind}: ${basename}`, "", "# Provenance", "", "Copied from local workspace input."].join("\n")), sidecarRelativePath);
  writeContainedFileExclusive({ root: options.root, relativePath: rawRelativePath }, rawData);
  atomicReplaceContainedFile({ root: options.root, relativePath: zipRelativePath }, zipData);
  writeContainedFileExclusive({ root: options.root, relativePath: sidecarRelativePath }, authored.content);

  maybeReindex(options.root);
  appendAutomaticEvent({
    root: options.root,
    ws,
    kind: "ARCHIVE_ADDED",
    status: "ok",
    refs: [authored.stable_ref ?? id],
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
    ...(authored.identity ? { identity: authored.identity, stable_ref: authored.stable_ref } : {}),
  };
  if (options.json) {
    console.log(JSON.stringify({ action: "created", archive: receipt }, null, 2));
    return;
  }
  console.log(`archive created: ${receipt.qid} (${receipt.path})`);
}

export function runArchiveListCommand(options: ArchiveListCommandOptions): void {
  const config = loadConfig(options.root);
  const { index } = loadIndex({ root: options.root, config, inspection: true, persistReindex: false });
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

function isReadOnlyArchiveProjection(config: Config, node: IndexNode): boolean {
  return Boolean(
    node.source?.imported ||
    node.source?.read_only ||
    config.subgraphs[node.source?.subgraph_alias ?? node.ws]
  );
}

function readOnlyArchiveError(node: IndexNode): ValidationError {
  const alias = node.source?.subgraph_alias ?? node.ws;
  return new ValidationError(
    `cannot compress read-only archive ${node.qid} from imported workspace ${alias}; ` +
      "run compression in the source workspace and refresh the subgraph bundle"
  );
}

function readOnlyWorkspaceError(alias: string): ValidationError {
  return new ValidationError(
    `cannot compress archives in read-only imported workspace ${alias}; ` +
      "run compression in the source workspace and refresh the subgraph bundle"
  );
}

function assertWritableArchiveOwner(config: Config, node: IndexNode): void {
  if (isReadOnlyArchiveProjection(config, node)) {
    throw readOnlyArchiveError(node);
  }
  const workspace = config.workspaces[node.ws];
  if (!workspace) {
    throw new ValidationError(`archive ${node.qid} has no configured local workspace owner`);
  }
  if (!workspace.enabled) {
    throw new ValidationError(`archive workspace ${node.ws} is disabled and not writable`);
  }
  const archiveRoot = workspaceDocumentRelativePath(workspace.path, workspace.mdkg_dir, "archive");
  const nodePath = toPosixPath(node.path);
  if (!nodePath.startsWith(`${archiveRoot}/`)) {
    throw new ValidationError(
      `archive ${node.qid} path is outside its configured local archive root: ${archiveRoot}`
    );
  }
}

function resolveArchiveNodeFromIndex(index: Index, id: string, ws?: string): IndexNode {
  const target = parseIdentityRef(id) ? undefined : archiveTargetFromInput(id, ws);
  const resolved = resolveQid(index, target ? `${target.workspace}:${target.id}` : id, ws);
  if (resolved.status !== "ok") throw new NotFoundError(formatResolveError("archive", id, resolved, ws));
  const node = index.nodes[resolved.qid];
  if (!node || node.type !== "archive") {
    throw new NotFoundError(`archive not found: ${id}`);
  }
  return node;
}

function selectArchiveCompressionNodes(
  options: ArchiveCompressCommandOptions,
  config: Config,
  index: Index
): { nodes: IndexNode[]; selection: ArchiveCompressionSelection } {
  if (options.all && options.id) {
    throw new UsageError("archive compress accepts either <id-or-archive-uri-or-qid> or --all, not both");
  }
  const requestedWorkspace = options.ws ? normalizeWorkspace(options.ws) : null;
  const excluded: ArchiveCompressionExclusion[] = [];
  let nodes: IndexNode[];

  if (options.all) {
    if (requestedWorkspace && config.subgraphs[requestedWorkspace]) {
      throw readOnlyWorkspaceError(requestedWorkspace);
    }
    if (requestedWorkspace) {
      const workspace = config.workspaces[requestedWorkspace];
      if (!workspace) {
        throw new NotFoundError(`workspace not found: ${requestedWorkspace}`);
      }
      if (!workspace.enabled) {
        throw new ValidationError(`archive workspace ${requestedWorkspace} is disabled and not writable`);
      }
    }
    nodes = Object.values(index.nodes)
      .filter((node) => node.type === "archive")
      .sort((a, b) => a.qid.localeCompare(b.qid))
      .filter((node) => {
        if (requestedWorkspace && node.ws !== requestedWorkspace) {
          return false;
        }
        if (isReadOnlyArchiveProjection(config, node)) {
          if (!requestedWorkspace) {
            excluded.push({
              workspace: node.ws,
              qid: node.qid,
              reason: "read_only_imported_subgraph",
            });
          }
          return false;
        }
        assertWritableArchiveOwner(config, node);
        return true;
      });
  } else {
    const node = resolveArchiveNodeFromIndex(index, String(options.id), options.ws);
    assertWritableArchiveOwner(config, node);
    nodes = [node];
  }

  return {
    nodes,
    selection: {
      requested_workspace: requestedWorkspace,
      selected_workspaces: Array.from(new Set(nodes.map((node) => node.ws))).sort(),
      excluded_read_only: excluded.sort((a, b) => a.qid.localeCompare(b.qid)),
    },
  };
}

function preflightArchiveCompression(
  root: string,
  node: IndexNode,
  today: string
): ArchiveCompressionPlan {
  for (const attribute of ["stored_path", "compressed_path"] as const) {
    if (typeof node.attributes[attribute] !== "string" || !String(node.attributes[attribute]).trim()) {
      throw new ValidationError(`${node.qid}: ${attribute} is required before archive compression`);
    }
  }
  const { sidecarPath, rawPath, zipPath } = archiveNodePaths(root, node);
  const rawRelativePath = toPosixPath(path.relative(root, rawPath));
  const zipRelativePath = toPosixPath(path.relative(root, zipPath));
  const sidecarRelativePath = toPosixPath(path.relative(root, sidecarPath));
  for (const relativePath of [rawRelativePath, zipRelativePath, sidecarRelativePath]) {
    withContainedPathSink(
      { root, relativePath, pathSyntax: "native", operation: relativePath === rawRelativePath ? "read" : "replace" },
      () => undefined
    );
  }
  if (!containedPathExists({ root, relativePath: rawRelativePath, pathSyntax: "native" })) {
    throw new NotFoundError(`raw archive file missing for ${node.qid}: ${path.relative(root, rawPath)}`);
  }
  const parsed = parseFrontmatter(
    readContainedFile({ root, relativePath: sidecarRelativePath, pathSyntax: "native" }),
    sidecarPath
  );
  if (parsed.frontmatter.type !== "archive" || parsed.frontmatter.id !== node.id) {
    throw new ValidationError(`${node.qid}: archive sidecar identity changed before compression`);
  }
  for (const field of ["stored_path", "compressed_path", "visibility"] as const) {
    if (parsed.frontmatter[field] !== node.attributes[field]) throw new ValidationError(`${node.qid}: archive resource authority changed before compression`);
  }
  const rawData = readContainedFile({ root, relativePath: rawRelativePath, pathSyntax: "native" }, null);
  const zipData = createDeterministicZip(path.basename(rawPath), rawData);
  const nextFrontmatter: Record<string, FrontmatterValue> = {
    ...parsed.frontmatter,
    byte_size: String(rawData.length),
    sha256: hashArchiveBuffer(rawData),
    compressed_sha256: hashArchiveBuffer(zipData),
    ingest_status: "compressed",
    updated: today,
  };
  return {
    zipRelativePath,
    sidecarRelativePath,
    zipData,
    sidecarContent: formatArchiveSidecar(nextFrontmatter, parsed.body),
    receipt: {
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
    },
  };
}

// Compression authority comes from the selected local archive, not merely from
// repository containment. Complete this metadata-only phase before any payload
// is read, including when a later selected archive is the invalid one.
function assertArchiveCompressionResources(root: string, config: Config, index: Index, nodes: IndexNode[]): void {
  const owner = absoluteWorkspaceDocumentOwner(root, config);
  type Claim = { qid: string; role: string; file: string };
  const claims = new Map<string, Claim[]>();
  // Fail closed on portable aliases even when a particular host can distinguish
  // them. Otherwise two missing destinations can alias only at write time.
  const key = (file: string) => toPosixPath(file).normalize("NFC").toLowerCase();
  const add = (claim: Claim) => {
    const k = key(claim.file), existing = claims.get(k);
    if (existing) existing.push(claim); else claims.set(k, [claim]);
  };
  const resources = (node: IndexNode): Claim[] => {
    const p = archiveNodePaths(root, node);
    return [{ qid: node.qid, role: "sidecar", file: p.sidecarPath }, { qid: node.qid, role: "raw", file: p.rawPath }, { qid: node.qid, role: "cache", file: p.zipPath }];
  };
  for (const node of Object.values(index.nodes)) {
    if (node.source?.imported || node.source?.read_only) continue;
    if (node.type === "archive") resources(node).forEach(add);
    else add({ qid: node.qid, role: "document", file: path.resolve(root, node.path) });
  }
  const keys = [...claims.keys()].sort();
  const collision = (claim: Claim) => {
    const k = key(claim.file);
    for (let parent = k; ; parent = path.posix.dirname(parent)) {
      const conflict = claims.get(parent)?.find(c => c.qid !== claim.qid || c.role !== claim.role);
      if (conflict) return conflict;
      if (path.posix.dirname(parent) === parent) break;
    }
    const prefix = `${k}/`; let lo = 0, hi = keys.length;
    while (lo < hi) { const mid = (lo + hi) >>> 1; if (keys[mid] < prefix) lo = mid + 1; else hi = mid; }
    return keys[lo]?.startsWith(prefix) ? claims.get(keys[lo])![0] : undefined;
  };
  const protectedPaths = [config.db.root_path, config.db.runtime_path, config.db.state_path,
    config.db.receipts_path, config.index.global_index_path, config.index.sqlite_path,
    config.capabilities.cache_path, config.bundles.output_dir, normalizeTemplatePath(config.templates.root_path, "templates.root_path"),
    ...Object.values(config.workspaces).flatMap(w => ["config.json", "core", "design", "work", "skills", "templates", "state", "index", "db", "bundles", "pack", "subgraphs"].map(p => workspaceDocumentRelativePath(w.path, w.mdkg_dir, p)))
  ].map(p => key(path.resolve(root, p)));
  const overlaps = (a: string, b: string) => a === b || a.startsWith(`${b}/`) || b.startsWith(`${a}/`);
  const directories = new Map<string, Set<string>>();
  let directoryEntries = 0;
  const assertSpelling = (file: string) => {
    let parent = path.resolve(root);
    for (const part of path.relative(root, file).split(path.sep)) {
      let names = directories.get(parent);
      if (!names) {
        names = new Set();
        forEachContainedDirectoryEntry({ root, relativePath: path.relative(root, parent) || ".", pathSyntax: "native" }, e => {
          if (++directoryEntries > config.index.limits.max_files * 10) throw new ValidationError("archive resource spelling inspection exceeds directory-entry budget");
          names!.add(e.name);
        });
        directories.set(parent, names);
      }
      const next = path.join(parent, part);
      if (!names.has(part)) {
        try { fs.lstatSync(next); } catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return; throw error; }
        throw new ValidationError(`archive resource path spelling differs from the filesystem: ${path.relative(root, next)}`);
      }
      parent = next;
    }
  };
  for (const node of nodes) {
    const selected = resources(node), sidecarDir = path.dirname(selected[0].file);
    for (const claim of selected) {
      if (owner(claim.file) !== node.ws) throw new ValidationError(`${node.qid}: archive ${claim.role} resource belongs to another workspace owner`);
      const relative = path.relative(sidecarDir, claim.file), parts = relative.split(path.sep);
      if ((claim.role === "raw" && (parts[0] !== "source" || parts.length < 2)) ||
          (claim.role === "cache" && (parts.includes("source") || !relative.endsWith(".zip"))) ||
          parts.slice(0, -1).some(p => [".mdkg", ".git"].includes(p.normalize("NFC").toLowerCase()))) {
        throw new ValidationError(`${node.qid}: archive ${claim.role} resource is outside its admitted archive layout`);
      }
      if (protectedPaths.some(p => overlaps(key(claim.file), p))) throw new ValidationError(`${node.qid}: archive resource overlaps protected metadata`);
      const other = collision(claim);
      if (other) throw new ValidationError(`${node.qid}: archive ${claim.role} resource overlaps ${other.qid} ${other.role}`);
      const relativePath = path.relative(root, claim.file);
      withContainedPathSink({ root, relativePath, pathSyntax: "native", operation: claim.role === "raw" ? "read" : "replace" }, () => undefined);
      assertSpelling(claim.file);
      if (containedPathExists({ root, relativePath, pathSyntax: "native" }) && !fs.lstatSync(claim.file).isFile()) {
        throw new ValidationError(`${node.qid}: archive resource must be a regular file`);
      }
    }
  }
}

function runArchiveCompressCommandLocked(options: ArchiveCompressCommandOptions): void {
  if (!options.all && !options.id) {
    throw new UsageError("archive compress requires <id-or-archive-uri-or-qid> or --all");
  }
  const config = loadConfig(options.root);
  // Explicit compression regenerates payloads from currently authored sidecars
  // and raw files. A missing/corrupt ZIP must not require a stale metadata cache
  // to select that repair. This unbound selection index is never persisted;
  // schema, identity, owner and every write target still pass normal preflight.
  const index = mergeSubgraphsIntoIndex(
    buildIndex(options.root, config, { deferArchiveIntegrity: true }),
    buildSubgraphsIndex(options.root, config)
  );
  const { nodes, selection } = selectArchiveCompressionNodes(options, config, index);
  assertArchiveCompressionResources(options.root, config, index, nodes);
  const today = formatDate(options.now ?? new Date());
  const plans = nodes.map((node) => preflightArchiveCompression(options.root, node, today));
  const updated: ArchiveReceipt[] = [];
  for (const plan of plans) {
    atomicReplaceContainedFile(
      { root: options.root, relativePath: plan.zipRelativePath, pathSyntax: "native" },
      plan.zipData
    );
    atomicReplaceContainedFile(
      { root: options.root, relativePath: plan.sidecarRelativePath, pathSyntax: "native" },
      plan.sidecarContent
    );
    updated.push(plan.receipt);
  }
  maybeReindex(options.root);
  if (options.json) {
    console.log(
      JSON.stringify({ action: "compressed", count: updated.length, archives: updated, selection }, null, 2)
    );
    return;
  }
  console.log(`archive compressed: ${updated.length}`);
  console.log(`selected workspaces: ${selection.selected_workspaces.join(", ") || "none"}`);
  console.log(`excluded read-only projections: ${selection.excluded_read_only.length}`);
  for (const excluded of selection.excluded_read_only) {
    console.log(`  - ${excluded.qid} (${excluded.reason})`);
  }
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
