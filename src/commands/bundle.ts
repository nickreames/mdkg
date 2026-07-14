import crypto from "crypto";
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { loadConfig, Config, WorkspaceConfig } from "../core/config";
import {
  atomicReplaceContainedFile,
  authorizeOperatorSelectedExternalPath,
} from "../core/filesystem_authority";
import { atomicWriteFile } from "../util/atomic";
import { buildCapabilitiesIndex } from "../graph/capabilities_indexer";
import { buildSubgraphsIndex, mergeSubgraphsIntoIndex } from "../graph/subgraphs";
import { buildIndex, Index, IndexNode } from "../graph/indexer";
import {
  buildSkillIndexEntryForWorkspace,
  listSkillMarkdownFiles,
  SkillsIndex,
} from "../graph/skills_indexer";
import { FrontmatterValue } from "../graph/frontmatter";
import { createDeterministicZipFromEntries, readZipFileEntries, ZipEntry } from "../util/zip";
import { UsageError, ValidationError, NotFoundError } from "../util/errors";
import { archiveIdFromUri } from "../util/refs";
import {
  collectVisibilityViolations,
  effectiveNodeVisibility,
  isVisibleAt,
  visibilityViolationMessages,
} from "../graph/visibility";

export type BundleProfile = "private" | "public";

export type BundleCreateCommandOptions = {
  root: string;
  profile?: string;
  ws?: string;
  output?: string;
  json?: boolean;
};

export type BundleVerifyCommandOptions = {
  root: string;
  bundlePath?: string;
  json?: boolean;
};

export type BundleShowCommandOptions = {
  root: string;
  bundlePath: string;
  json?: boolean;
};

export type BundleListCommandOptions = {
  root: string;
  json?: boolean;
};

type BundleFileKind = "authored" | "archive_cache" | "generated_index";

export type BundleManifestFile = {
  path: string;
  kind: BundleFileKind;
  workspace?: string;
  visibility?: string;
  size: number;
  sha256: string;
};

export type BundleManifest = {
  manifest_version: 1;
  tool: "mdkg";
  mdkg_version: string;
  profile: BundleProfile;
  selected_workspaces: string[];
  source: {
    repo: string;
    git_head: string | null;
    dirty: boolean;
  };
  source_tree_hash: string;
  bundle_hash: string;
  file_count: number;
  index_hashes: Record<string, string>;
  files: BundleManifestFile[];
};

export type BundleBuildResult = {
  manifest: BundleManifest;
  zip: Buffer;
  outputPath: string;
  zipSha256: string;
};

export type VerifyResult = {
  action: "verified";
  ok: boolean;
  path: string;
  profile?: BundleProfile;
  selected_workspaces: string[];
  file_count: number;
  stale: boolean;
  errors: string[];
  stale_paths: string[];
  bundle_hash?: string;
  zip_sha256?: string;
};

const MANIFEST_ENTRY = "manifest.json";
const GENERATED_AT = "1970-01-01T00:00:00.000Z";
const INDEX_ENTRY_PATHS = {
  global: ".mdkg/index/global.json",
  skills: ".mdkg/index/skills.json",
  capabilities: ".mdkg/index/capabilities.json",
};
const REQUIRED_INDEX_PATHS = Object.values(INDEX_ENTRY_PATHS);
const SHA256_PATTERN = /^sha256:[a-f0-9]{64}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function manifestError(message: string): never {
  throw new ValidationError(`bundle manifest invalid: ${message}`);
}

function manifestString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.length === 0) {
    manifestError(`${field} must be a non-empty string`);
  }
  return value;
}

function manifestHash(value: unknown, field: string): string {
  const hash = manifestString(value, field);
  if (!SHA256_PATTERN.test(hash)) {
    manifestError(`${field} must be a sha256 digest`);
  }
  return hash;
}

function safeManifestPath(value: unknown, field: string): string {
  const candidate = manifestString(value, field).replace(/\\/g, "/");
  const parts = candidate.split("/");
  if (path.posix.isAbsolute(candidate) || parts.some((part) => part === "" || part === "." || part === "..")) {
    manifestError(`${field} must be a safe relative path`);
  }
  return candidate;
}

export function validateBundleManifest(value: unknown): BundleManifest {
  if (!isRecord(value)) manifestError("root must be an object");
  if (value.manifest_version !== 1) manifestError("manifest_version must be 1");
  if (value.tool !== "mdkg") manifestError("tool must be mdkg");
  const mdkgVersion = manifestString(value.mdkg_version, "mdkg_version");
  if (value.profile !== "private" && value.profile !== "public") {
    manifestError("profile must be private or public");
  }
  if (!Array.isArray(value.selected_workspaces) || value.selected_workspaces.length === 0) {
    manifestError("selected_workspaces must be a non-empty string array");
  }
  const selectedWorkspaces = value.selected_workspaces.map((item, index) =>
    manifestString(item, `selected_workspaces[${index}]`)
  );
  if (new Set(selectedWorkspaces).size !== selectedWorkspaces.length) {
    manifestError("selected_workspaces must not contain duplicates");
  }
  if (!isRecord(value.source)) manifestError("source must be an object");
  const repo = manifestString(value.source.repo, "source.repo");
  const gitHead = value.source.git_head;
  if (gitHead !== null && (typeof gitHead !== "string" || !/^[a-f0-9]{40}$/.test(gitHead))) {
    manifestError("source.git_head must be null or a 40-character lowercase Git SHA");
  }
  if (typeof value.source.dirty !== "boolean") manifestError("source.dirty must be boolean");
  const sourceTreeHash = manifestHash(value.source_tree_hash, "source_tree_hash");
  const bundleHash = manifestHash(value.bundle_hash, "bundle_hash");
  if (!Number.isSafeInteger(value.file_count) || Number(value.file_count) < 0) {
    manifestError("file_count must be a non-negative safe integer");
  }
  if (!isRecord(value.index_hashes)) manifestError("index_hashes must be an object");
  const indexHashes: Record<string, string> = {};
  for (const [rawPath, rawHash] of Object.entries(value.index_hashes)) {
    const indexPath = safeManifestPath(rawPath, "index_hashes key");
    indexHashes[indexPath] = manifestHash(rawHash, `index_hashes.${indexPath}`);
  }
  for (const requiredPath of REQUIRED_INDEX_PATHS) {
    if (!indexHashes[requiredPath]) manifestError(`index_hashes missing required index ${requiredPath}`);
  }
  if (!Array.isArray(value.files)) manifestError("files must be an array");
  const seenPaths = new Set<string>();
  const files = value.files.map((rawFile, index): BundleManifestFile => {
    if (!isRecord(rawFile)) manifestError(`files[${index}] must be an object`);
    const filePath = safeManifestPath(rawFile.path, `files[${index}].path`);
    if (seenPaths.has(filePath)) manifestError(`duplicate file path: ${filePath}`);
    seenPaths.add(filePath);
    if (rawFile.kind !== "authored" && rawFile.kind !== "archive_cache" && rawFile.kind !== "generated_index") {
      manifestError(`files[${index}].kind is invalid`);
    }
    if (!Number.isSafeInteger(rawFile.size) || Number(rawFile.size) < 0) {
      manifestError(`files[${index}].size must be a non-negative safe integer`);
    }
    const workspace = rawFile.workspace === undefined
      ? undefined
      : manifestString(rawFile.workspace, `files[${index}].workspace`);
    const visibility = rawFile.visibility;
    if (visibility !== undefined && visibility !== "private" && visibility !== "internal" && visibility !== "public") {
      manifestError(`files[${index}].visibility is invalid`);
    }
    return {
      path: filePath,
      kind: rawFile.kind,
      ...(workspace ? { workspace } : {}),
      ...(visibility ? { visibility } : {}),
      size: Number(rawFile.size),
      sha256: manifestHash(rawFile.sha256, `files[${index}].sha256`),
    };
  });
  if (Number(value.file_count) !== files.length) manifestError("file_count does not match files length");
  for (const requiredPath of REQUIRED_INDEX_PATHS) {
    const row = files.find((file) => file.path === requiredPath);
    if (!row || row.kind !== "generated_index") {
      manifestError(`files missing required generated index ${requiredPath}`);
    }
    if (row.sha256 !== indexHashes[requiredPath]) {
      manifestError(`index hash does not match file row for ${requiredPath}`);
    }
  }
  return {
    manifest_version: 1,
    tool: "mdkg",
    mdkg_version: mdkgVersion,
    profile: value.profile,
    selected_workspaces: selectedWorkspaces,
    source: { repo, git_head: gitHead, dirty: value.source.dirty },
    source_tree_hash: sourceTreeHash,
    bundle_hash: bundleHash,
    file_count: files.length,
    index_hashes: indexHashes,
    files,
  };
}

export function bundlePayloadErrors(entries: Map<string, Buffer>, manifest: BundleManifest): string[] {
  const errors: string[] = [];
  const manifestPaths = new Set(manifest.files.map((file) => file.path));
  for (const entryPath of entries.keys()) {
    if (entryPath !== MANIFEST_ENTRY && !manifestPaths.has(entryPath)) errors.push(`unexpected bundle entry: ${entryPath}`);
  }
  for (const file of manifest.files) {
    const data = entries.get(file.path);
    if (!data) {
      errors.push(`missing bundle entry: ${file.path}`);
      continue;
    }
    if (sha256Buffer(data) !== file.sha256) errors.push(`hash mismatch for ${file.path}`);
    if (data.length !== file.size) errors.push(`size mismatch for ${file.path}`);
  }
  for (const requiredPath of REQUIRED_INDEX_PATHS) {
    const data = entries.get(requiredPath);
    if (!data) continue;
    if (sha256Buffer(data) !== manifest.index_hashes[requiredPath]) {
      errors.push(`generated index hash mismatch: ${requiredPath}`);
    }
  }
  if (hashManifestFiles(manifest.files.filter((file) => file.kind !== "generated_index")) !== manifest.source_tree_hash) {
    errors.push("source_tree_hash mismatch");
  }
  if (hashManifestFiles(manifest.files) !== manifest.bundle_hash) errors.push("bundle_hash mismatch");
  return Array.from(new Set(errors));
}

function toPosixPath(value: string): string {
  return value.split(path.sep).join("/");
}

export function sha256Buffer(buffer: Buffer): string {
  return `sha256:${crypto.createHash("sha256").update(buffer).digest("hex")}`;
}

function sha256Hex(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function stableJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function readPackageVersion(): string {
  const packagePath = path.resolve(__dirname, "..", "..", "package.json");
  try {
    const raw = JSON.parse(fs.readFileSync(packagePath, "utf8")) as { version?: unknown };
    return typeof raw.version === "string" ? raw.version : "unknown";
  } catch {
    return "unknown";
  }
}

function normalizeProfile(value?: string, fallback: BundleProfile = "private"): BundleProfile {
  const normalized = (value ?? fallback).toLowerCase();
  if (normalized === "private" || normalized === "public") {
    return normalized;
  }
  throw new UsageError("--profile must be one of private, public");
}

function gitOutput(root: string, args: string[]): string | null {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8", stdio: "pipe" });
  if (result.status !== 0) {
    return null;
  }
  const output = result.stdout.trim();
  return output.length > 0 ? output : null;
}

function sourceInfo(root: string): BundleManifest["source"] {
  const remote = gitOutput(root, ["config", "--get", "remote.origin.url"]);
  const head = gitOutput(root, ["rev-parse", "HEAD"]);
  const status = gitOutput(root, ["status", "--porcelain"]);
  const dirtyPaths = status
    ? status
        .split(/\r?\n/)
        .map((line) => line.slice(3).replace(/^"|"$/g, ""))
        .filter(Boolean)
        .filter((filePath) => {
          const normalized = filePath.replace(/\\/g, "/");
          return (
            normalized !== ".mdkg/bundles" &&
            !normalized.startsWith(".mdkg/bundles/") &&
            !normalized.includes("/.mdkg/bundles/")
          );
        })
    : [];
  return {
    repo: remote ?? path.basename(root),
    git_head: head,
    dirty: status === null ? false : dirtyPaths.length > 0,
  };
}

function workspaceMdkgRoot(root: string, entry: WorkspaceConfig): string {
  return path.resolve(root, entry.path, entry.mdkg_dir);
}

function workspacePrefix(entry: WorkspaceConfig): string {
  const wsPath = entry.path === "." ? "" : `${toPosixPath(entry.path).replace(/\/+$/, "")}/`;
  return `${wsPath}${toPosixPath(entry.mdkg_dir).replace(/^\/+|\/+$/g, "")}/`;
}

function listFilesRecursive(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFilesRecursive(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

function relativePath(root: string, absolutePath: string): string {
  return toPosixPath(path.relative(root, absolutePath));
}

function isExcludedRelativePath(relative: string): boolean {
  const normalized = relative.replace(/\\/g, "/");
  return (
    normalized.includes("/.mdkg/pack/") ||
    normalized.startsWith(".mdkg/pack/") ||
    normalized.includes("/.mdkg/bundles/") ||
    normalized.startsWith(".mdkg/bundles/") ||
    normalized.includes("/.mdkg/subgraphs/") ||
    normalized.startsWith(".mdkg/subgraphs/") ||
    normalized.includes("/.mdkg/index/") ||
    normalized.startsWith(".mdkg/index/") ||
    ((normalized.includes("/.mdkg/archive/") || normalized.startsWith(".mdkg/archive/")) &&
      normalized.includes("/source/"))
  );
}

function archiveVisibilityByPath(index: Index): Map<string, string> {
  const visibility = new Map<string, string>();
  for (const node of Object.values(index.nodes)) {
    if (node.type !== "archive") {
      continue;
    }
    visibility.set(node.path, String(node.attributes.visibility ?? "private"));
    visibility.set(`${toPosixPath(path.dirname(node.path))}/`, String(node.attributes.visibility ?? "private"));
  }
  return visibility;
}

function archivePathVisibility(visibilityByPath: Map<string, string>, relative: string): string | undefined {
  const exact = visibilityByPath.get(relative);
  if (exact) {
    return exact;
  }
  const normalized = relative.replace(/\\/g, "/");
  for (const [key, value] of visibilityByPath.entries()) {
    if (key.endsWith("/") && normalized.startsWith(key)) {
      return value;
    }
  }
  return undefined;
}

function entryForFile(
  root: string,
  filePath: string,
  kind: BundleFileKind,
  workspace?: string,
  visibility?: string
): { entry: ZipEntry; manifestFile: BundleManifestFile } {
  const data = fs.readFileSync(filePath);
  const rel = relativePath(root, filePath);
  return {
    entry: { name: rel, data },
    manifestFile: {
      path: rel,
      kind,
      workspace,
      visibility,
      size: data.length,
      sha256: sha256Buffer(data),
    },
  };
}

function selectedWorkspaceAliases(config: Config, ws?: string): string[] {
  const requested = (ws ?? "all").toLowerCase();
  if (requested === "all") {
    return Object.keys(config.workspaces)
      .filter((alias) => config.workspaces[alias].enabled)
      .sort();
  }
  const workspace = config.workspaces[requested];
  if (!workspace || !workspace.enabled) {
    throw new NotFoundError(`workspace not found or disabled: ${requested}`);
  }
  return [requested];
}

function filterAliasesForProfile(
  config: Config,
  aliases: string[],
  profile: BundleProfile
): string[] {
  if (profile === "private") {
    return aliases;
  }
  return aliases.filter((alias) => config.workspaces[alias].visibility === "public");
}

function normalizeIndexForBundle<T extends { meta: Record<string, unknown> }>(index: T): T {
  const normalized = JSON.parse(JSON.stringify(index)) as T;
  normalized.meta.generated_at = GENERATED_AT;
  normalized.meta.root = ".";
  return normalized;
}

function filterIndex(index: Index, config: Config, selectedAliases: Set<string>, profile: BundleProfile): Index {
  const nodes: Record<string, IndexNode> = {};
  for (const [qid, node] of Object.entries(index.nodes)) {
    if (!selectedAliases.has(node.ws)) {
      continue;
    }
    if (profile === "public" && !isVisibleAt(effectiveNodeVisibility(node, config), "public")) {
      continue;
    }
    {
      nodes[qid] = node;
    }
  }
  const reverse_edges: Index["reverse_edges"] = {};
  for (const [edgeKey, targets] of Object.entries(index.reverse_edges)) {
    for (const [target, sources] of Object.entries(targets)) {
      const keptSources = sources.filter((source) => nodes[source]);
      if (keptSources.length === 0) {
        continue;
      }
      reverse_edges[edgeKey] = reverse_edges[edgeKey] ?? {};
      reverse_edges[edgeKey][target] = keptSources;
    }
  }
  const workspaces: Index["workspaces"] = {};
  for (const [alias, workspace] of Object.entries(index.workspaces)) {
    if (selectedAliases.has(alias)) {
      workspaces[alias] = workspace;
    }
  }
  const filtered: Index = {
    meta: {
      ...index.meta,
      generated_at: GENERATED_AT,
      root: ".",
      workspaces: Array.from(selectedAliases).sort(),
    },
    workspaces,
    nodes,
    reverse_edges,
  };
  if (index.meta.latest_checkpoint_qid) {
    const latest: Record<string, string> = {};
    for (const [alias, qid] of Object.entries(index.meta.latest_checkpoint_qid)) {
      if (selectedAliases.has(alias) && nodes[qid]) {
        latest[alias] = qid;
      }
    }
    if (Object.keys(latest).length > 0) {
      filtered.meta.latest_checkpoint_qid = latest;
    }
  }
  return filtered;
}

function buildBundleSkillsIndex(root: string, config: Config, selectedAliases: Set<string>): SkillsIndex {
  const skills: SkillsIndex["skills"] = {};
  for (const alias of Array.from(selectedAliases).sort()) {
    const workspace = config.workspaces[alias];
    const skillsRoot = path.join(workspaceMdkgRoot(root, workspace), "skills");
    for (const file of listSkillMarkdownFiles(skillsRoot)) {
      const entry = buildSkillIndexEntryForWorkspace(root, alias, file.slug, file.filePath);
      const key = alias === "root" ? file.slug : `${alias}:${file.slug}`;
      skills[key] = entry;
    }
  }
  return {
    meta: {
      tool: config.tool,
      schema_version: config.schema_version,
      generated_at: GENERATED_AT,
      root: ".",
      skills_root: ".mdkg/skills",
      skill_count: Object.keys(skills).length,
    },
    skills,
  };
}

function normalizeCapabilitiesForBundle(
  root: string,
  config: Config,
  index: Index,
  selectedAliases: Set<string>
) {
  const capabilities = normalizeIndexForBundle(buildCapabilitiesIndex(root, config, index));
  capabilities.records = capabilities.records
    .filter((record) => selectedAliases.has(record.workspace))
    .map((record) => ({ ...record, indexed_at: GENERATED_AT }));
  capabilities.meta.generated_at = GENERATED_AT;
  capabilities.meta.root = ".";
  capabilities.meta.workspaces = Array.from(selectedAliases).sort();
  capabilities.meta.record_count = capabilities.records.length;
  return capabilities;
}

function addGeneratedIndex(
  entries: ZipEntry[],
  files: BundleManifestFile[],
  indexHashes: Record<string, string>,
  key: keyof typeof INDEX_ENTRY_PATHS,
  value: unknown
): void {
  const data = Buffer.from(stableJson(value), "utf8");
  const entryPath = INDEX_ENTRY_PATHS[key];
  entries.push({ name: entryPath, data });
  const hash = sha256Buffer(data);
  indexHashes[entryPath] = hash;
  files.push({
    path: entryPath,
    kind: "generated_index",
    size: data.length,
    sha256: hash,
  });
}

function hashManifestFiles(files: BundleManifestFile[]): string {
  return sha256Buffer(
    Buffer.from(
      stableJson(
        files.map((file) => ({
          path: file.path,
          kind: file.kind,
          workspace: file.workspace,
          visibility: file.visibility,
          size: file.size,
          sha256: file.sha256,
        }))
      ),
      "utf8"
    )
  );
}

function collectArchiveUris(value: FrontmatterValue | Record<string, FrontmatterValue>): string[] {
  const found: string[] = [];
  const visit = (item: unknown): void => {
    if (typeof item === "string") {
      if (item.startsWith("archive://")) {
        found.push(item);
      }
      return;
    }
    if (Array.isArray(item)) {
      for (const child of item) {
        visit(child);
      }
      return;
    }
    if (typeof item === "object" && item !== null) {
      for (const child of Object.values(item)) {
        visit(child);
      }
    }
  };
  visit(value);
  return found;
}

function publicFilteringErrors(index: Index, includedQids: Set<string>): string[] {
  const errors: string[] = [];
  const archiveNodesById = new Map<string, IndexNode>();
  for (const node of Object.values(index.nodes)) {
    if (node.type === "archive") {
      archiveNodesById.set(node.id, node);
    }
  }

  for (const node of Object.values(index.nodes)) {
    if (!includedQids.has(node.qid)) {
      continue;
    }
    for (const targets of [
      [node.edges.epic].filter(Boolean) as string[],
      [node.edges.parent].filter(Boolean) as string[],
      [node.edges.prev].filter(Boolean) as string[],
      [node.edges.next].filter(Boolean) as string[],
      node.edges.relates,
      node.edges.blocked_by,
      node.edges.blocks,
      node.edges.context_refs ?? [],
      node.edges.evidence_refs ?? [],
    ]) {
      for (const target of targets) {
        if (index.nodes[target] && !includedQids.has(target)) {
          errors.push(`${node.qid} references non-public graph node ${target}`);
        }
      }
    }
    const archiveRefs = [
      ...collectArchiveUris(node.attributes),
      ...node.artifacts.filter((value) => value.startsWith("archive://")),
      ...node.refs.filter((value) => value.startsWith("archive://")),
      ...node.links.filter((value) => value.startsWith("archive://")),
    ];
    for (const archiveUri of archiveRefs) {
      const archiveId = archiveIdFromUri(archiveUri);
      const archiveNode = archiveId ? archiveNodesById.get(archiveId) : undefined;
      if (!archiveNode) {
        continue;
      }
      if (!includedQids.has(archiveNode.qid) || archiveNode.attributes.visibility !== "public") {
        errors.push(`${node.qid} references non-public archive ${archiveUri}`);
      }
    }
  }

  return errors;
}

function collectStringValues(value: unknown, out: string[]): void {
  if (typeof value === "string") {
    out.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const child of value) {
      collectStringValues(child, out);
    }
    return;
  }
  if (typeof value === "object" && value !== null) {
    for (const child of Object.values(value)) {
      collectStringValues(child, out);
    }
  }
}

function publicSubgraphReferenceErrors(config: Config, index: Index, includedQids: Set<string>): string[] {
  const privateSubgraphAliases = new Set(
    Object.entries(config.subgraphs)
      .filter(([, entry]) => entry.enabled && entry.visibility !== "public")
      .map(([alias]) => alias)
  );
  if (privateSubgraphAliases.size === 0) {
    return [];
  }
  const errors: string[] = [];
  for (const node of Object.values(index.nodes)) {
    if (!includedQids.has(node.qid)) {
      continue;
    }
    const values: string[] = [];
    collectStringValues(node.edges, values);
    collectStringValues(node.attributes, values);
    values.push(...node.links, ...node.artifacts, ...node.refs, ...node.aliases);
    for (const value of values) {
      const [alias] = value.split(":");
      if (alias && privateSubgraphAliases.has(alias)) {
        errors.push(`${node.qid} references private subgraph ${value}`);
      }
    }
  }
  return errors;
}

function defaultOutputPath(
  root: string,
  config: Config,
  profile: BundleProfile,
  ws: string | undefined
): string {
  const outputDir = config.bundles.output_dir;
  const workspaceName = (ws ?? "all").toLowerCase();
  return path.resolve(root, outputDir, profile, `${workspaceName}.mdkg.zip`);
}

function resolveBundlePath(root: string, value: string): string {
  return path.isAbsolute(value) ? value : path.resolve(root, value);
}

export function buildBundle(options: BundleCreateCommandOptions): BundleBuildResult {
  const config = loadConfig(options.root);
  const profile = normalizeProfile(options.profile, config.bundles.default_profile);
  const requestedAliases = selectedWorkspaceAliases(config, options.ws);
  const selectedAliases = filterAliasesForProfile(config, requestedAliases, profile);
  if (selectedAliases.length === 0) {
    const hint =
      profile === "public"
        ? "mark a selected workspace visibility public or use --profile private"
        : "enable at least one selected workspace";
    throw new UsageError(`no workspaces selected for ${profile} bundle; ${hint}`);
  }
  const selectedSet = new Set(selectedAliases);
  const index = buildIndex(options.root, config);
  const archiveVisibility = archiveVisibilityByPath(index);

  const entries: ZipEntry[] = [];
  const files: BundleManifestFile[] = [];

  for (const alias of selectedAliases) {
    const workspace = config.workspaces[alias];
    const wsRoot = workspaceMdkgRoot(options.root, workspace);
    const wsPrefix = workspacePrefix(workspace);
    for (const filePath of listFilesRecursive(wsRoot)) {
      const rel = relativePath(options.root, filePath);
      if (isExcludedRelativePath(rel)) {
        continue;
      }
      if (profile === "public" && rel.endsWith(".mdkg/config.json")) {
        continue;
      }
      const visibility = archivePathVisibility(archiveVisibility, rel) ?? workspace.visibility;
      if (profile === "public") {
        if (!rel.startsWith(wsPrefix)) {
          continue;
        }
        if (rel.includes("/archive/") && visibility !== "public") {
          continue;
        }
      }
      const kind: BundleFileKind =
        rel.includes("/archive/") && rel.endsWith(".zip") ? "archive_cache" : "authored";
      const { entry, manifestFile } = entryForFile(
        options.root,
        filePath,
        kind,
        alias,
        visibility
      );
      entries.push(entry);
      files.push(manifestFile);
    }
  }

  const filteredIndex = filterIndex(index, config, selectedSet, profile);
  if (profile === "public") {
    const includedQids = new Set(Object.keys(filteredIndex.nodes));
    const mergedIndex = mergeSubgraphsIntoIndex(
      index,
      buildSubgraphsIndex(options.root, config)
    );
    const errors = visibilityViolationMessages(
      collectVisibilityViolations(mergedIndex, config, {
        includedQids,
        scope: "public",
      })
    );
    if (errors.length > 0) {
      throw new ValidationError(`public bundle contains private references:\n${errors.join("\n")}`);
    }
  }

  const indexHashes: Record<string, string> = {};
  addGeneratedIndex(entries, files, indexHashes, "global", normalizeIndexForBundle(filteredIndex));
  addGeneratedIndex(entries, files, indexHashes, "skills", buildBundleSkillsIndex(options.root, config, selectedSet));
  addGeneratedIndex(
    entries,
    files,
    indexHashes,
    "capabilities",
    normalizeCapabilitiesForBundle(options.root, config, filteredIndex, selectedSet)
  );

  files.sort((a, b) => a.path.localeCompare(b.path));
  const sourceFiles = files.filter((file) => file.kind !== "generated_index");
  const sourceTreeHash = hashManifestFiles(sourceFiles);
  const bundleHash = hashManifestFiles(files);
  const manifest: BundleManifest = {
    manifest_version: 1,
    tool: "mdkg",
    mdkg_version: readPackageVersion(),
    profile,
    selected_workspaces: selectedAliases,
    source: sourceInfo(options.root),
    source_tree_hash: sourceTreeHash,
    bundle_hash: bundleHash,
    file_count: files.length,
    index_hashes: indexHashes,
    files,
  };

  const manifestData = Buffer.from(stableJson(manifest), "utf8");
  const zip = createDeterministicZipFromEntries([
    ...entries,
    { name: MANIFEST_ENTRY, data: manifestData },
  ]);
  const outputPath = options.output
    ? resolveBundlePath(options.root, options.output)
    : defaultOutputPath(options.root, config, profile, options.ws);

  return {
    manifest,
    zip,
    outputPath,
    zipSha256: sha256Buffer(zip),
  };
}

export function parseBundle(bundlePath: string): { entries: Map<string, Buffer>; manifest: BundleManifest } {
  const entries = new Map<string, Buffer>();
  for (const entry of readZipFileEntries(bundlePath)) {
    entries.set(entry.name, entry.data);
  }
  const manifestData = entries.get(MANIFEST_ENTRY);
  if (!manifestData) {
    throw new ValidationError("bundle manifest missing");
  }
  try {
    return { entries, manifest: validateBundleManifest(JSON.parse(manifestData.toString("utf8")) as unknown) };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new ValidationError(`bundle manifest is invalid JSON: ${message}`);
  }
}

export function verifyBundle(root: string, bundlePath: string): VerifyResult {
  const errors: string[] = [];
  const stalePaths: string[] = [];
  let manifest: BundleManifest | undefined;
  let entries: Map<string, Buffer> = new Map();

  try {
    const parsed = parseBundle(bundlePath);
    manifest = parsed.manifest;
    entries = parsed.entries;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      action: "verified",
      ok: false,
      path: bundlePath,
      selected_workspaces: [],
      file_count: 0,
      stale: false,
      errors: [message],
      stale_paths: [],
    };
  }

  errors.push(...bundlePayloadErrors(entries, manifest));
  for (const file of manifest.files) {
    if (file.kind !== "generated_index") {
      const sourcePath = path.resolve(root, file.path);
      if (!fs.existsSync(sourcePath)) {
        stalePaths.push(file.path);
        continue;
      }
      if (sha256Buffer(fs.readFileSync(sourcePath)) !== file.sha256) {
        stalePaths.push(file.path);
      }
    }
  }
  const currentHead = gitOutput(root, ["rev-parse", "HEAD"]);
  if (manifest.source.git_head && currentHead && manifest.source.git_head !== currentHead) {
    stalePaths.push("git:HEAD");
  }

  return {
    action: "verified",
    ok: errors.length === 0 && stalePaths.length === 0,
    path: bundlePath,
    profile: manifest.profile,
    selected_workspaces: manifest.selected_workspaces,
    file_count: manifest.file_count,
    stale: stalePaths.length > 0,
    errors,
    stale_paths: Array.from(new Set(stalePaths)).sort(),
    bundle_hash: manifest.bundle_hash,
    zip_sha256: sha256Buffer(fs.readFileSync(bundlePath)),
  };
}

function writeJson(value: unknown): void {
  console.log(JSON.stringify(value, null, 2));
}

function bundleSummary(manifest: BundleManifest, bundlePath: string, zipSha256?: string) {
  return {
    path: bundlePath,
    profile: manifest.profile,
    selected_workspaces: manifest.selected_workspaces,
    file_count: manifest.file_count,
    source_tree_hash: manifest.source_tree_hash,
    bundle_hash: manifest.bundle_hash,
    zip_sha256: zipSha256,
    source: manifest.source,
  };
}

export function runBundleCreateCommand(options: BundleCreateCommandOptions): void {
  const result = buildBundle(options);
  if (options.output && path.isAbsolute(options.output)) {
    const external = authorizeOperatorSelectedExternalPath({
      operation: "replace",
      path: options.output,
      operatorSelected: true,
    });
    atomicWriteFile(external.absolutePath, result.zip);
  } else {
    atomicReplaceContainedFile(
      { root: options.root, relativePath: path.relative(options.root, result.outputPath).split(path.sep).join("/") },
      result.zip
    );
  }
  const receipt = {
    action: "created",
    ...bundleSummary(result.manifest, path.relative(options.root, result.outputPath), result.zipSha256),
  };
  if (options.json) {
    writeJson(receipt);
    return;
  }
  console.log(`bundle written: ${receipt.path}`);
  console.log(`profile: ${receipt.profile}`);
  console.log(`workspaces: ${receipt.selected_workspaces.join(", ") || "(none)"}`);
  console.log(`files: ${receipt.file_count}`);
  console.log(`bundle_hash: ${receipt.bundle_hash}`);
}

export function runBundleVerifyCommand(options: BundleVerifyCommandOptions): void {
  const config = loadConfig(options.root);
  const bundlePath = options.bundlePath
    ? resolveBundlePath(options.root, options.bundlePath)
    : defaultOutputPath(options.root, config, config.bundles.default_profile, "all");
  const result = verifyBundle(options.root, bundlePath);
  const output = { ...result, path: path.relative(options.root, bundlePath) || bundlePath };
  if (options.json) {
    writeJson(output);
  } else if (result.ok) {
    console.log(`bundle verified: ${output.path}`);
    console.log(`profile: ${result.profile}`);
    console.log(`files: ${result.file_count}`);
  } else {
    console.log(`bundle verify failed: ${output.path}`);
    for (const error of result.errors) {
      console.log(`error: ${error}`);
    }
    for (const stalePath of result.stale_paths) {
      console.log(`stale: ${stalePath}`);
    }
  }
  if (!result.ok) {
    throw new ValidationError("bundle verify failed");
  }
}

export function runBundleShowCommand(options: BundleShowCommandOptions): void {
  const bundlePath = resolveBundlePath(options.root, options.bundlePath);
  if (!fs.existsSync(bundlePath)) {
    throw new NotFoundError(`bundle not found: ${options.bundlePath}`);
  }
  const { manifest } = parseBundle(bundlePath);
  const summary = bundleSummary(
    manifest,
    path.relative(options.root, bundlePath) || bundlePath,
    sha256Buffer(fs.readFileSync(bundlePath))
  );
  if (options.json) {
    writeJson({ action: "show", bundle: summary, manifest });
    return;
  }
  console.log(`${summary.path} | ${summary.profile} | ${summary.file_count} file(s)`);
  console.log(`workspaces: ${summary.selected_workspaces.join(", ") || "(none)"}`);
  console.log(`source: ${summary.source.git_head ?? "unknown"}${summary.source.dirty ? " dirty" : ""}`);
  console.log(`bundle_hash: ${summary.bundle_hash}`);
}

export function runBundleListCommand(options: BundleListCommandOptions): void {
  const config = loadConfig(options.root);
  const rootDir = path.resolve(options.root, config.bundles.output_dir);
  const files = listFilesRecursive(rootDir)
    .filter((filePath) => filePath.endsWith(".mdkg.zip"))
    .sort();
  const items = files.map((filePath) => {
    try {
      const { manifest } = parseBundle(filePath);
      return {
        path: relativePath(options.root, filePath),
        ok: true,
        profile: manifest.profile,
        selected_workspaces: manifest.selected_workspaces,
        file_count: manifest.file_count,
        bundle_hash: manifest.bundle_hash,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        path: relativePath(options.root, filePath),
        ok: false,
        error: message,
      };
    }
  });
  if (options.json) {
    writeJson({ action: "list", count: items.length, items });
    return;
  }
  if (items.length === 0) {
    console.log("no bundles found");
    return;
  }
  for (const item of items) {
    if (item.ok) {
      console.log(`${item.path} | ${item.profile} | ${item.file_count} file(s)`);
    } else {
      console.log(`${item.path} | invalid | ${item.error}`);
    }
  }
}
