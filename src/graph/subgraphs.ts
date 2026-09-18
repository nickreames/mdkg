import crypto from "crypto";
import fs from "fs";
import path from "path";
import { insideGitWorkTree, readGitHead, readGitStatus } from "../util/git_observation";
import { Config, SubgraphConfig, SubgraphSourceConfig } from "../core/config";
import { configPath } from "../core/paths";
import { FrontmatterValue, parseFrontmatter } from "./frontmatter";
import { assertNodeFormat, canonicalJson, GRAPH_FORMAT_PATH, parseGraphFormat, readNodeIdentity } from "./identity";
import { Index, IndexNode } from "./indexer";
import { writeCacheFile } from "./cache_output";
import { readSubgraphBundleEntries } from "./subgraph_bundle";
import { normalizeIndexIdentityReferences } from "./identity_refs";
import { PortableTransportPolicy, portableTransportPayloadErrors, validatePortableTransportPolicy } from "./transport_policy";

export type SubgraphSourceHealth = {
  label?: string;
  path: string;
  enabled: boolean;
  expected_profile: "private" | "public";
  profile?: string;
  bundle_hash?: string;
  source_git_head?: string | null;
  stale: boolean;
  warning_count: number;
  error_count: number;
  warnings: string[];
  errors: string[];
};

export type SubgraphHealth = {
  alias: string;
  enabled: boolean;
  visibility: "private" | "internal" | "public";
  permissions: string[];
  source_path?: string;
  source_repo?: string;
  stale: boolean;
  warning_count: number;
  error_count: number;
  warnings: string[];
  errors: string[];
  sources: SubgraphSourceHealth[];
};

export type SubgraphsIndex = {
  meta: {
    tool: string;
    schema_version: number;
    cache_version: number;
    generated_at: string;
    root: string;
    subgraph_count: number;
    node_count: number;
  };
  subgraphs: SubgraphHealth[];
  nodes: Record<string, IndexNode>;
  reverse_edges: Index["reverse_edges"];
};

export type SubgraphProjection = {
  index: SubgraphsIndex;
  workspaces: Index["workspaces"];
};

type BundleManifest = {
  manifest_version: 1;
  tool: "mdkg";
  mdkg_version: string;
  profile: "private" | "public";
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
  files: Array<{
    path: string;
    sha256: string;
    size: number;
    kind: "authored" | "archive_cache" | "generated_index";
    workspace?: string;
    visibility?: string;
  }>;
  transport_policy?: PortableTransportPolicy;
};

type LoadedSource = {
  source: SubgraphSourceConfig;
  sourceHealth: SubgraphSourceHealth;
  relativeBundlePath: string;
  manifest?: BundleManifest;
  index?: Index;
  entries?: Map<string, Buffer>;
};

const SUBGRAPHS_CACHE_VERSION = 1;
const MANIFEST_ENTRY = "manifest.json";
const GLOBAL_INDEX_ENTRY = ".mdkg/index/global.json";
const SKILLS_INDEX_ENTRY = ".mdkg/index/skills.json";
const CAPABILITIES_INDEX_ENTRY = ".mdkg/index/capabilities.json";
const REQUIRED_INDEX_ENTRIES = [GLOBAL_INDEX_ENTRY, SKILLS_INDEX_ENTRY, CAPABILITIES_INDEX_ENTRY];
const SHA256_PATTERN = /^sha256:[a-f0-9]{64}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.length === 0) throw new Error(`bundle manifest invalid: ${field} must be a non-empty string`);
  return value;
}

function requireHash(value: unknown, field: string): string {
  const result = requireString(value, field);
  if (!SHA256_PATTERN.test(result)) throw new Error(`bundle manifest invalid: ${field} must be a sha256 digest`);
  return result;
}

function requireSafePath(value: unknown, field: string): string {
  const result = requireString(value, field).replace(/\\/g, "/");
  if (path.posix.isAbsolute(result) || result.split("/").some((part) => part === "" || part === "." || part === "..")) {
    throw new Error(`bundle manifest invalid: ${field} must be a safe relative path`);
  }
  return result;
}

function manifestFilesHash(files: BundleManifest["files"]): string {
  const data = `${JSON.stringify(files.map((file) => ({
    path: file.path,
    kind: file.kind,
    workspace: file.workspace,
    visibility: file.visibility,
    size: file.size,
    sha256: file.sha256,
  })), null, 2)}\n`;
  return sha256Buffer(Buffer.from(data, "utf8"));
}

function validateForeignManifest(value: unknown): BundleManifest {
  if (!isRecord(value)) throw new Error("bundle manifest invalid: root must be an object");
  if (value.manifest_version !== 1 || value.tool !== "mdkg") throw new Error("bundle manifest invalid: unsupported version or tool");
  const mdkgVersion = requireString(value.mdkg_version, "mdkg_version");
  if (value.profile !== "private" && value.profile !== "public") throw new Error("bundle manifest invalid: profile must be private or public");
  if (!Array.isArray(value.selected_workspaces) || value.selected_workspaces.length === 0) {
    throw new Error("bundle manifest invalid: selected_workspaces must be a non-empty array");
  }
  const selectedWorkspaces = value.selected_workspaces.map((item, index) => requireString(item, `selected_workspaces[${index}]`));
  if (new Set(selectedWorkspaces).size !== selectedWorkspaces.length) throw new Error("bundle manifest invalid: duplicate selected workspace");
  if (!isRecord(value.source)) throw new Error("bundle manifest invalid: source must be an object");
  const repo = requireString(value.source.repo, "source.repo");
  const gitHead = value.source.git_head;
  if (gitHead !== null && (typeof gitHead !== "string" || !/^[a-f0-9]{40}$/.test(gitHead))) {
    throw new Error("bundle manifest invalid: source.git_head must be null or a Git SHA");
  }
  if (typeof value.source.dirty !== "boolean") throw new Error("bundle manifest invalid: source.dirty must be boolean");
  if (!Number.isSafeInteger(value.file_count) || Number(value.file_count) < 0) throw new Error("bundle manifest invalid: file_count");
  if (!isRecord(value.index_hashes) || !Array.isArray(value.files)) throw new Error("bundle manifest invalid: indexes and files are required");
  const indexHashes: Record<string, string> = {};
  for (const [entryPath, hash] of Object.entries(value.index_hashes)) indexHashes[requireSafePath(entryPath, "index hash path")] = requireHash(hash, `index_hashes.${entryPath}`);
  const seen = new Set<string>();
  const files = value.files.map((item, index): BundleManifest["files"][number] => {
    if (!isRecord(item)) throw new Error(`bundle manifest invalid: files[${index}] must be an object`);
    const filePath = requireSafePath(item.path, `files[${index}].path`);
    if (seen.has(filePath)) throw new Error(`bundle manifest invalid: duplicate file ${filePath}`);
    seen.add(filePath);
    if (item.kind !== "authored" && item.kind !== "archive_cache" && item.kind !== "generated_index") throw new Error(`bundle manifest invalid: files[${index}].kind`);
    if (!Number.isSafeInteger(item.size) || Number(item.size) < 0) throw new Error(`bundle manifest invalid: files[${index}].size`);
    const workspace = item.workspace === undefined ? undefined : requireString(item.workspace, `files[${index}].workspace`);
    if (item.visibility !== undefined && item.visibility !== "private" && item.visibility !== "internal" && item.visibility !== "public") throw new Error(`bundle manifest invalid: files[${index}].visibility`);
    return { path: filePath, kind: item.kind, size: Number(item.size), sha256: requireHash(item.sha256, `files[${index}].sha256`), ...(workspace ? { workspace } : {}), ...(item.visibility ? { visibility: item.visibility } : {}) };
  });
  if (Number(value.file_count) !== files.length) throw new Error("bundle manifest invalid: file_count mismatch");
  for (const required of REQUIRED_INDEX_ENTRIES) {
    const row = files.find((file) => file.path === required);
    if (!row || row.kind !== "generated_index" || row.sha256 !== indexHashes[required]) throw new Error(`bundle manifest invalid: required index contract mismatch for ${required}`);
  }
  const manifest: BundleManifest = {
    manifest_version: 1,
    tool: "mdkg",
    mdkg_version: mdkgVersion,
    profile: value.profile,
    selected_workspaces: selectedWorkspaces,
    source: { repo, git_head: gitHead, dirty: value.source.dirty },
    source_tree_hash: requireHash(value.source_tree_hash, "source_tree_hash"),
    bundle_hash: requireHash(value.bundle_hash, "bundle_hash"),
    file_count: files.length,
    index_hashes: indexHashes,
    files,
  };
  const policy = validatePortableTransportPolicy(value.transport_policy, manifest);
  if (policy) manifest.transport_policy = policy;
  return manifest;
}

function validateIndexShape(value: unknown): Index {
  if (!isRecord(value) || !isRecord(value.meta) || !isRecord(value.nodes) || !isRecord(value.reverse_edges) || !isRecord(value.workspaces)) {
    throw new Error("generated global index has an invalid shape");
  }
  return value as unknown as Index;
}

function publicProjectionErrors(index: Index, manifest: BundleManifest): string[] {
  if (manifest.profile !== "public") return [];
  const selected = new Set(manifest.selected_workspaces);
  const rows = new Map(manifest.files.map((file) => [file.path, file]));
  const errors: string[] = [];
  for (const alias of Object.keys(index.workspaces)) {
    if (!selected.has(alias)) errors.push(`public bundle contains unselected workspace ${alias}`);
  }
  for (const node of Object.values(index.nodes)) {
    const row = rows.get(toPosixPath(node.path));
    if (!selected.has(node.ws) || !row || row.visibility !== "public") errors.push(`public bundle contains non-public node ${node.qid}`);
  }
  return errors;
}

function toPosixPath(value: string): string {
  return value.split(path.sep).join("/");
}

function sha256Buffer(buffer: Buffer): string {
  return `sha256:${crypto.createHash("sha256").update(buffer).digest("hex")}`;
}

function readJsonEntry<T>(entries: Map<string, Buffer>, entryPath: string): T {
  const data = entries.get(entryPath);
  if (!data) {
    throw new Error(`missing bundle entry: ${entryPath}`);
  }
  return JSON.parse(data.toString("utf8")) as T;
}

function resolveBundlePath(root: string, source: SubgraphSourceConfig): string {
  return path.resolve(root, source.path);
}

function sourcePathState(
  root: string,
  subgraph: SubgraphConfig,
  manifest: BundleManifest,
  warnings: string[],
  errors: string[]
): boolean {
  if (!subgraph.source_path) {
    return false;
  }
  const sourceRoot = path.resolve(root, subgraph.source_path);
  if (!fs.existsSync(sourceRoot)) {
    errors.push(`source_path does not exist: ${subgraph.source_path}`);
    return false;
  }
  let currentHead: string | null;
  let currentStatus;
  try {
    const inside = insideGitWorkTree(sourceRoot);
    currentHead = inside ? readGitHead(sourceRoot) : null;
    currentStatus = inside ? readGitStatus(sourceRoot) : [];
  } catch (err) {
    // The verified bundle remains useful historical context, never fresh proof
    // of a source checkout whose Git state cannot be observed safely.
    warnings.push(`source_path Git freshness is unknown: ${subgraph.source_path}; ${err instanceof Error ? err.message : "observation failed"}`);
    return true;
  }
  let stale = false;
  if (manifest.source?.git_head && manifest.source.git_head !== currentHead) {
    warnings.push(`source HEAD changed: ${manifest.source.git_head} -> ${currentHead ?? "unavailable"}`);
    stale = true;
  }
  if (currentStatus.length) {
    warnings.push(`source_path has uncommitted changes: ${subgraph.source_path}`);
    stale = true;
  }
  return stale;
}

function ageState(bundlePath: string, maxStaleSeconds: number, warnings: string[]): boolean {
  const ageSeconds = Math.floor((Date.now() - fs.statSync(bundlePath).mtimeMs) / 1000);
  if (ageSeconds <= maxStaleSeconds) {
    return false;
  }
  warnings.push(`bundle age ${ageSeconds}s exceeds max_stale_seconds ${maxStaleSeconds}`);
  return true;
}

function remapTarget(target: string | undefined, qidMap: Map<string, string>): string | undefined {
  if (!target) {
    return undefined;
  }
  return qidMap.get(target) ?? target;
}

function remapTargets(targets: string[], qidMap: Map<string, string>): string[] {
  return targets.map((target) => qidMap.get(target) ?? target);
}

function addReverseEdge(
  reverse: Index["reverse_edges"],
  edgeKey: string,
  target: string | undefined,
  source: string
): void {
  if (!target) {
    return;
  }
  reverse[edgeKey] = reverse[edgeKey] ?? {};
  reverse[edgeKey][target] = reverse[edgeKey][target] ?? [];
  reverse[edgeKey][target].push(source);
}

function addReverseEdges(reverse: Index["reverse_edges"], node: IndexNode): void {
  addReverseEdge(reverse, "epic", node.edges.epic, node.qid);
  addReverseEdge(reverse, "parent", node.edges.parent, node.qid);
  addReverseEdge(reverse, "prev", node.edges.prev, node.qid);
  addReverseEdge(reverse, "next", node.edges.next, node.qid);
  for (const target of node.edges.relates) {
    addReverseEdge(reverse, "relates", target, node.qid);
  }
  for (const target of node.edges.blocked_by) {
    addReverseEdge(reverse, "blocked_by", target, node.qid);
  }
  for (const target of node.edges.blocks) {
    addReverseEdge(reverse, "blocks", target, node.qid);
  }
}

function entryHashErrors(entries: Map<string, Buffer>, manifest: BundleManifest): string[] {
  const errors: string[] = [];
  for (const file of manifest.files ?? []) {
    const data = entries.get(file.path);
    if (!data) {
      errors.push(`missing bundle entry: ${file.path}`);
      continue;
    }
    if (sha256Buffer(data) !== file.sha256) {
      errors.push(`hash mismatch for ${file.path}`);
    }
    if (data.length !== file.size) {
      errors.push(`size mismatch for ${file.path}`);
    }
  }
  for (const required of REQUIRED_INDEX_ENTRIES) {
    const data = entries.get(required);
    if (data && sha256Buffer(data) !== manifest.index_hashes[required]) errors.push(`generated index hash mismatch: ${required}`);
  }
  if (manifestFilesHash(manifest.files.filter((file) => file.kind !== "generated_index")) !== manifest.source_tree_hash) errors.push("source_tree_hash mismatch");
  if (manifestFilesHash(manifest.files) !== manifest.bundle_hash) errors.push("bundle_hash mismatch");
  return errors;
}

export function validateSubgraphBundleEntries(entries: Map<string, Buffer>) {
  const manifest = validateForeignManifest(readJsonEntry<unknown>(entries, MANIFEST_ENTRY));
  const index = validateIndexShape(readJsonEntry<unknown>(entries, GLOBAL_INDEX_ENTRY));
  const skills = readJsonEntry<unknown>(entries, SKILLS_INDEX_ENTRY);
  const capabilities = readJsonEntry<unknown>(entries, CAPABILITIES_INDEX_ENTRY);
  if (!isRecord(skills) || !isRecord(capabilities)) throw new Error("generated discovery index has an invalid shape");
  const errors = entryHashErrors(entries, manifest);
  if (errors.length === 0) errors.push(...portableTransportPayloadErrors(entries, manifest));
  if (errors.length) throw new Error(`subgraph integrity failed: ${errors.join("; ")}`);
  const rows = new Map(manifest.files.map((row) => [row.path, row]));
  const checkRecord = (record: unknown, workspaceField: string) => {
    if (!isRecord(record) || typeof record.path !== "string") throw new Error("invalid projected discovery record");
    const row = rows.get(record.path);
    if (!row || row.kind !== "authored" || row.workspace !== record[workspaceField] ||
      !manifest.selected_workspaces.includes(String(record[workspaceField])) ||
      (manifest.profile === "public" && row.visibility !== "public")) throw new Error("discovery record has no selected authored file binding");
  };
  if (capabilities.records !== undefined && !Array.isArray(capabilities.records)) throw new Error("invalid capability record list");
  if (skills.skills !== undefined && !isRecord(skills.skills)) throw new Error("invalid skills record map");
  for (const capability of (capabilities.records ?? []) as unknown[]) checkRecord(capability, "workspace");
  for (const skill of Object.values((skills.skills ?? {}) as Record<string, unknown>)) checkRecord(skill, "ws");
  const formatBytes = entries.get(GRAPH_FORMAT_PATH);
  const format = formatBytes ? parseGraphFormat(formatBytes.toString("utf8")) : { format_version: 1 as const };
  if (format.format_version === 2) {
    if (canonicalJson(index.meta.graph_format) !== canonicalJson(format)) throw new Error("subgraph index format disagrees with authored manifest");
    for (const node of Object.values(index.nodes)) {
      const authored = entries.get(node.path);
      if (!authored) throw new Error(`subgraph identity has no authored node: ${node.path}`);
      const identity = readNodeIdentity(parseFrontmatter(authored.toString("utf8"), node.path).frontmatter, node.path);
      assertNodeFormat(format, identity, node.path);
      if (canonicalJson(identity) !== canonicalJson(node.identity)) throw new Error(`subgraph index identity disagrees with authored node: ${node.path}`);
    }
  } else if (Object.values(index.nodes).some((node) => node.identity)) {
    throw new Error("subgraph identity requires an authored format manifest");
  }
  const publicErrors = publicProjectionErrors(index, manifest);
  if (publicErrors.length) throw new Error(publicErrors.join("; "));
  return { entries, manifest, index, rows, capabilities };
}

export function importedSnapshotEntry(snapshot: ReturnType<typeof validateSubgraphBundleEntries>, node: IndexNode, maxBytes: number): Buffer {
  const source = node.source;
  const original = source && snapshot.index.nodes[source.original_qid];
  const row = source && snapshot.rows.get(source.original_path);
  if (!source || !source.bundle_hash || source.bundle_hash !== snapshot.manifest.bundle_hash ||
    source.profile !== snapshot.manifest.profile || !original || !row || row.kind !== "authored" ||
    original.path !== source.original_path || original.ws !== source.original_ws || original.id !== node.id || original.type !== node.type) {
    throw new Error(`imported node snapshot mismatch for ${node.qid}; re-index the source before reading changed bytes`);
  }
  const data = snapshot.entries.get(source.original_path)!;
  if (data.length > maxBytes) throw new Error(`node body source exceeds byte limit for ${node.qid}: ${maxBytes}`);
  const parsed = parseFrontmatter(data.toString("utf8"), source.original_path);
  if (parsed.frontmatter.id !== node.id || parsed.frontmatter.type !== node.type) throw new Error(`imported node body identity mismatch for ${node.qid}`);
  return data;
}

function projectOneSource(
  root: string,
  subgraph: SubgraphConfig,
  source: SubgraphSourceConfig
): LoadedSource {
  const bundlePath = resolveBundlePath(root, source);
  const relativeBundlePath = toPosixPath(path.relative(root, bundlePath));
  const warnings: string[] = [];
  const errors: string[] = [];
  let manifest: BundleManifest | undefined;
  let index: Index | undefined;
  let entries: Map<string, Buffer> | undefined;
  let stale = false;

  if (!source.enabled) {
    return {
      source,
      relativeBundlePath,
      sourceHealth: {
        label: source.label,
        path: source.path,
        enabled: false,
        expected_profile: source.expected_profile,
        stale: false,
        warning_count: 0,
        error_count: 0,
        warnings: [],
        errors: [],
      },
    };
  }

  try {
    entries = readSubgraphBundleEntries(root, source.path);
    ({ manifest, index } = validateSubgraphBundleEntries(entries));
    if (manifest.profile !== source.expected_profile) {
      errors.push(`expected ${source.expected_profile} bundle but found ${manifest.profile}`);
    }
    stale = sourcePathState(root, subgraph, manifest, warnings, errors) || stale;
    stale = ageState(bundlePath, subgraph.max_stale_seconds, warnings) || stale;
  } catch (err) {
    errors.push(err instanceof Error ? err.message : String(err));
  }

  return {
    source,
    relativeBundlePath,
    manifest,
    index,
    entries,
    sourceHealth: {
      label: source.label,
      path: source.path,
      enabled: source.enabled,
      expected_profile: source.expected_profile,
      profile: manifest?.profile,
      bundle_hash: manifest?.bundle_hash,
      source_git_head: manifest?.source?.git_head ?? null,
      stale,
      warning_count: warnings.length,
      error_count: errors.length,
      warnings,
      errors,
    },
  };
}

function projectOneSubgraph(
  root: string,
  alias: string,
  subgraph: SubgraphConfig
): { health: SubgraphHealth; nodes: Record<string, IndexNode>; reverse_edges: Index["reverse_edges"]; loadedSources: LoadedSource[] } {
  const nodes: Record<string, IndexNode> = {};
  const reverse_edges: Index["reverse_edges"] = {};
  if (!subgraph.enabled) {
    return {
      health: {
        alias,
        enabled: false,
        visibility: subgraph.visibility,
        permissions: subgraph.permissions,
        source_path: subgraph.source_path,
        source_repo: subgraph.source_repo,
        stale: false,
        warning_count: 0,
        error_count: 0,
        warnings: [],
        errors: [],
        sources: subgraph.sources.map((source) => ({
          label: source.label,
          path: source.path,
          enabled: source.enabled,
          expected_profile: source.expected_profile,
          stale: false,
          warning_count: 0,
          error_count: 0,
          warnings: [],
          errors: [],
        })),
      },
      nodes,
      reverse_edges,
      loadedSources: [],
    };
  }

  const loadedSources = subgraph.sources.map((source) => projectOneSource(root, subgraph, source));
  const warnings = loadedSources.flatMap((item) => item.sourceHealth.warnings);
  const errors = loadedSources.flatMap((item) => item.sourceHealth.errors);
  const stale = loadedSources.some((item) => item.sourceHealth.stale);

  const idOwners = new Map<string, string[]>();
  for (const loaded of loadedSources) {
    if (!loaded.source.enabled || loaded.sourceHealth.error_count > 0 || !loaded.index) {
      continue;
    }
    for (const node of Object.values(loaded.index.nodes)) {
      const owners = idOwners.get(node.id) ?? [];
      owners.push(`${loaded.source.label ?? loaded.source.path}:${node.qid}`);
      idOwners.set(node.id, owners);
    }
  }
  for (const [id, owners] of idOwners.entries()) {
    if (owners.length > 1) {
      errors.push(
        `duplicate projected id ${id} from ${owners.join(", ")}; split sources into separate subgraphs or use portable unique ids`
      );
    }
  }

  if (errors.length === 0) {
    const qidMap = new Map<string, string>();
    for (const loaded of loadedSources) {
      if (!loaded.source.enabled || !loaded.index) {
        continue;
      }
      for (const node of Object.values(loaded.index.nodes)) {
        qidMap.set(node.qid, `${alias}:${node.id}`);
      }
    }
    for (const loaded of loadedSources) {
      if (!loaded.source.enabled || !loaded.index) {
        continue;
      }
      for (const node of Object.values(loaded.index.nodes)) {
        const projectedQid = qidMap.get(node.qid) as string;
        const projected: IndexNode = {
          ...node,
          ws: alias,
          qid: projectedQid,
          path: `${loaded.relativeBundlePath}#${toPosixPath(node.path)}`,
          attributes: { ...(node.attributes ?? {}) } as Record<string, FrontmatterValue>,
          edges: {
            epic: remapTarget(node.edges.epic, qidMap),
            parent: remapTarget(node.edges.parent, qidMap),
            prev: remapTarget(node.edges.prev, qidMap),
            next: remapTarget(node.edges.next, qidMap),
            relates: remapTargets(node.edges.relates, qidMap),
            blocked_by: remapTargets(node.edges.blocked_by, qidMap),
            blocks: remapTargets(node.edges.blocks, qidMap),
            context_refs: remapTargets(node.edges.context_refs ?? [], qidMap),
            evidence_refs: remapTargets(node.edges.evidence_refs ?? [], qidMap),
          },
          source: {
            imported: true,
            read_only: true,
            subgraph_alias: alias,
            original_qid: node.qid,
            original_ws: node.ws,
            original_path: toPosixPath(node.path),
            bundle_path: loaded.relativeBundlePath,
            bundle_hash: loaded.manifest?.bundle_hash,
            profile: loaded.manifest?.profile,
            visibility: subgraph.visibility,
            permissions: subgraph.permissions,
            stale,
            warnings: [...warnings],
            source_repo: subgraph.source_repo ?? loaded.manifest?.source?.repo,
            source_git_head: loaded.manifest?.source?.git_head ?? null,
          },
        };
        nodes[projected.qid] = projected;
        addReverseEdges(reverse_edges, projected);
      }
    }
  }

  return {
    health: {
      alias,
      enabled: subgraph.enabled,
      visibility: subgraph.visibility,
      permissions: subgraph.permissions,
      source_path: subgraph.source_path,
      source_repo: subgraph.source_repo,
      stale,
      warning_count: warnings.length,
      error_count: errors.length,
      warnings,
      errors,
      sources: loadedSources.map((item) => item.sourceHealth),
    },
    nodes,
    reverse_edges,
    loadedSources,
  };
}

export function resolveSubgraphsIndexPath(root: string): string {
  return path.resolve(root, ".mdkg", "index", "subgraphs.json");
}

export function buildSubgraphsIndex(root: string, config: Config): SubgraphProjection {
  const subgraphs: SubgraphHealth[] = [];
  const nodes: Record<string, IndexNode> = {};
  const reverse_edges: Index["reverse_edges"] = {};
  const workspaces: Index["workspaces"] = {};

  for (const alias of Object.keys(config.subgraphs).sort()) {
    const subgraph = config.subgraphs[alias];
    const projected = projectOneSubgraph(root, alias, subgraph);
    subgraphs.push(projected.health);
    if (!subgraph.enabled || projected.health.error_count > 0) {
      continue;
    }
    workspaces[alias] = { path: `subgraph:${alias}`, enabled: true };
    Object.assign(nodes, projected.nodes);
    for (const [edgeKey, targets] of Object.entries(projected.reverse_edges)) {
      reverse_edges[edgeKey] = reverse_edges[edgeKey] ?? {};
      for (const [target, sources] of Object.entries(targets)) {
        reverse_edges[edgeKey][target] = [
          ...(reverse_edges[edgeKey][target] ?? []),
          ...sources,
        ].sort();
      }
    }
  }

  return {
    index: {
      meta: {
        tool: config.tool,
        schema_version: config.schema_version,
        cache_version: SUBGRAPHS_CACHE_VERSION,
        generated_at: new Date().toISOString(),
        root,
        subgraph_count: subgraphs.length,
        node_count: Object.keys(nodes).length,
      },
      subgraphs,
      nodes,
      reverse_edges,
    },
    workspaces,
  };
}

export function writeSubgraphsIndex(root: string, indexPath: string, index: SubgraphsIndex): void {
  writeCacheFile(root, indexPath, JSON.stringify(index, null, 2));
}

export function isSubgraphsIndexStale(root: string, config: Config): boolean {
  const indexPath = resolveSubgraphsIndexPath(root);
  if (!fs.existsSync(indexPath)) {
    return Object.keys(config.subgraphs).length > 0;
  }
  const indexMtime = fs.statSync(indexPath).mtimeMs;
  const cfgPath = configPath(root);
  if (fs.existsSync(cfgPath) && fs.statSync(cfgPath).mtimeMs > indexMtime) {
    return true;
  }
  for (const subgraph of Object.values(config.subgraphs)) {
    for (const source of subgraph.sources) {
      const bundlePath = path.resolve(root, source.path);
      if (!fs.existsSync(bundlePath)) {
        return true;
      }
      if (fs.statSync(bundlePath).mtimeMs > indexMtime) {
        return true;
      }
    }
  }
  return false;
}

export function mergeSubgraphsIntoIndex(base: Index, projection: SubgraphProjection): Index {
  // The combined inspection view may bind local stable references to mounted
  // identities. Never mutate either persisted local or imported source indexes.
  const nodes = Object.fromEntries(Object.entries({ ...base.nodes, ...projection.index.nodes }).map(([qid, node]) =>
    [qid, { ...node, refs: [...node.refs], attributes: { ...node.attributes }, edges: { ...node.edges } }]));
  normalizeIndexIdentityReferences({ nodes });
  const reverse_edges: Index["reverse_edges"] = {};
  for (const node of Object.values(nodes)) {
    for (const [edgeKey, value] of Object.entries(node.edges)) {
      for (const target of typeof value === "string" ? [value] : value ?? []) {
        reverse_edges[edgeKey] ??= {};
        reverse_edges[edgeKey][target] ??= [];
        reverse_edges[edgeKey][target].push(node.qid);
      }
    }
  }
  for (const targets of Object.values(reverse_edges)) for (const sources of Object.values(targets)) sources.sort();
  return {
    ...base,
    meta: {
      ...base.meta,
      workspaces: Array.from(new Set([...base.meta.workspaces, ...Object.keys(projection.workspaces)])).sort(),
    },
    workspaces: {
      ...base.workspaces,
      ...projection.workspaces,
    },
    nodes,
    reverse_edges,
  };
}

export function subgraphWarnings(projection: SubgraphProjection): string[] {
  const warnings: string[] = [];
  for (const item of projection.index.subgraphs) {
    for (const warning of item.warnings) {
      warnings.push(`subgraph ${item.alias}: ${warning}`);
    }
    for (const error of item.errors) {
      warnings.push(`subgraph ${item.alias}: ${error}`);
    }
  }
  return warnings;
}

export function buildSubgraphCapabilityRecords(root: string, config: Config): {
  records: Array<Record<string, unknown>>;
  warnings: string[];
} {
  const records: Array<Record<string, unknown>> = [];
  const warnings: string[] = [];
  for (const alias of Object.keys(config.subgraphs).sort()) {
    const subgraph = config.subgraphs[alias];
    if (!subgraph.enabled) {
      continue;
    }
    const projection = projectOneSubgraph(root, alias, subgraph);
    for (const warning of projection.health.warnings) {
      warnings.push(`subgraph ${alias}: ${warning}`);
    }
    for (const error of projection.health.errors) {
      warnings.push(`subgraph ${alias}: ${error}`);
    }
    if (projection.health.error_count > 0) {
      continue;
    }
    for (const loaded of projection.loadedSources) {
      if (!loaded.source.enabled || !loaded.entries) {
        continue;
      }
      try {
        const relativeBundlePath = loaded.relativeBundlePath;
        const entries = loaded.entries;
        const capabilities = readJsonEntry<{ records?: Array<Record<string, unknown>> }>(
          entries,
          CAPABILITIES_INDEX_ENTRY
        );
        for (const record of capabilities.records ?? []) {
          const id = String(record.id ?? "");
          const originalQid = String(record.qid ?? id);
          const originalWorkspace = String(record.workspace ?? "");
          const originalPath = String(record.path ?? "");
          records.push({
            ...record,
            workspace: alias,
            visibility: subgraph.visibility,
            qid: `${alias}:${id}`,
            path: `${relativeBundlePath}#${originalPath}`,
            source: {
              imported: true,
              read_only: true,
              subgraph_alias: alias,
              original_qid: originalQid,
              original_workspace: originalWorkspace,
              original_path: originalPath,
              bundle_path: relativeBundlePath,
              bundle_hash: loaded.manifest?.bundle_hash,
              profile: loaded.manifest?.profile,
              stale: projection.health.stale,
              permissions: subgraph.permissions,
              warnings: [...projection.health.warnings],
            },
          });
        }
      } catch (err) {
        warnings.push(`subgraph ${alias}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }
  return { records, warnings };
}
