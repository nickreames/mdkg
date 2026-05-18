import crypto from "crypto";
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { Config, BundleImportConfig } from "../core/config";
import { configPath } from "../core/paths";
import { FrontmatterValue } from "./frontmatter";
import { Index, IndexNode } from "./indexer";
import { readZipEntries } from "../util/zip";

export type BundleImportHealth = {
  alias: string;
  path: string;
  enabled: boolean;
  visibility: "private" | "internal" | "public";
  expected_profile: "private" | "public";
  profile?: string;
  bundle_hash?: string;
  source_git_head?: string | null;
  source_repo?: string;
  stale: boolean;
  warning_count: number;
  error_count: number;
  warnings: string[];
  errors: string[];
};

export type BundleImportsIndex = {
  meta: {
    tool: string;
    schema_version: number;
    cache_version: number;
    generated_at: string;
    root: string;
    import_count: number;
    node_count: number;
  };
  imports: BundleImportHealth[];
  nodes: Record<string, IndexNode>;
  reverse_edges: Index["reverse_edges"];
};

export type BundleImportProjection = {
  index: BundleImportsIndex;
  workspaces: Index["workspaces"];
};

type BundleManifest = {
  manifest_version: number;
  profile: "private" | "public";
  source?: {
    repo?: string;
    git_head?: string | null;
    dirty?: boolean;
  };
  bundle_hash?: string;
  files?: Array<{ path: string; sha256: string; size: number; kind?: string }>;
};

const IMPORTS_CACHE_VERSION = 1;
const MANIFEST_ENTRY = "manifest.json";
const GLOBAL_INDEX_ENTRY = ".mdkg/index/global.json";
const SKILLS_INDEX_ENTRY = ".mdkg/index/skills.json";
const CAPABILITIES_INDEX_ENTRY = ".mdkg/index/capabilities.json";

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

function readBundleEntries(bundlePath: string): Map<string, Buffer> {
  return new Map(readZipEntries(fs.readFileSync(bundlePath)).map((entry) => [entry.name, entry.data]));
}

function resolveBundlePath(root: string, entry: BundleImportConfig): string {
  return path.resolve(root, entry.path);
}

function gitOutput(cwd: string, args: string[]): string | null {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", stdio: "pipe" });
  if (result.status !== 0) {
    return null;
  }
  const output = result.stdout.trim();
  return output.length > 0 ? output : null;
}

function sourcePathState(
  root: string,
  entry: BundleImportConfig,
  manifest: BundleManifest,
  warnings: string[],
  errors: string[]
): boolean {
  if (!entry.source_path) {
    return false;
  }
  const sourceRoot = path.resolve(root, entry.source_path);
  if (!fs.existsSync(sourceRoot)) {
    errors.push(`source_path does not exist: ${entry.source_path}`);
    return false;
  }
  const currentHead = gitOutput(sourceRoot, ["rev-parse", "HEAD"]);
  const currentStatus = gitOutput(sourceRoot, ["status", "--porcelain"]);
  let stale = false;
  if (manifest.source?.git_head && currentHead && manifest.source.git_head !== currentHead) {
    warnings.push(`source HEAD changed: ${manifest.source.git_head} -> ${currentHead}`);
    stale = true;
  }
  if (currentStatus) {
    warnings.push(`source_path has uncommitted changes: ${entry.source_path}`);
    stale = true;
  }
  return stale;
}

function ageState(bundlePath: string, entry: BundleImportConfig, warnings: string[]): boolean {
  if (entry.max_stale_seconds === undefined) {
    return false;
  }
  const ageSeconds = Math.floor((Date.now() - fs.statSync(bundlePath).mtimeMs) / 1000);
  if (ageSeconds <= entry.max_stale_seconds) {
    return false;
  }
  warnings.push(`bundle age ${ageSeconds}s exceeds max_stale_seconds ${entry.max_stale_seconds}`);
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
  return errors;
}

function projectOneImport(
  root: string,
  alias: string,
  entry: BundleImportConfig
): { health: BundleImportHealth; nodes: Record<string, IndexNode>; reverse_edges: Index["reverse_edges"] } {
  const bundlePath = resolveBundlePath(root, entry);
  const relativeBundlePath = toPosixPath(path.relative(root, bundlePath));
  const warnings: string[] = [];
  const errors: string[] = [];
  const nodes: Record<string, IndexNode> = {};
  const reverse_edges: Index["reverse_edges"] = {};
  let manifest: BundleManifest | undefined;
  let sourceIndex: Index | undefined;
  let stale = false;

  if (!entry.enabled) {
    return {
      health: {
        alias,
        path: entry.path,
        enabled: false,
        visibility: entry.visibility,
        expected_profile: entry.expected_profile,
        stale: false,
        warning_count: 0,
        error_count: 0,
        warnings: [],
        errors: [],
      },
      nodes,
      reverse_edges,
    };
  }

  try {
    if (!fs.existsSync(bundlePath)) {
      throw new Error(`bundle not found: ${entry.path}`);
    }
    const entries = readBundleEntries(bundlePath);
    manifest = readJsonEntry<BundleManifest>(entries, MANIFEST_ENTRY);
    sourceIndex = readJsonEntry<Index>(entries, GLOBAL_INDEX_ENTRY);
    readJsonEntry<Record<string, unknown>>(entries, SKILLS_INDEX_ENTRY);
    readJsonEntry<Record<string, unknown>>(entries, CAPABILITIES_INDEX_ENTRY);
    errors.push(...entryHashErrors(entries, manifest));
    if (manifest.profile !== entry.expected_profile) {
      errors.push(`expected ${entry.expected_profile} bundle but found ${manifest.profile}`);
    }
    stale = sourcePathState(root, entry, manifest, warnings, errors) || stale;
    stale = ageState(bundlePath, entry, warnings) || stale;

    const idOwners = new Map<string, string[]>();
    for (const node of Object.values(sourceIndex.nodes)) {
      const owners = idOwners.get(node.id) ?? [];
      owners.push(node.qid);
      idOwners.set(node.id, owners);
    }
    for (const [id, owners] of idOwners.entries()) {
      if (owners.length > 1) {
        errors.push(
          `duplicate projected id ${id} from ${owners.join(", ")}; create per-workspace bundles or use portable unique ids`
        );
      }
    }

    if (errors.length === 0) {
      const qidMap = new Map<string, string>();
      for (const node of Object.values(sourceIndex.nodes)) {
        qidMap.set(node.qid, `${alias}:${node.id}`);
      }
      for (const node of Object.values(sourceIndex.nodes)) {
        const projectedQid = qidMap.get(node.qid) as string;
        const projected: IndexNode = {
          ...node,
          ws: alias,
          qid: projectedQid,
          path: `${relativeBundlePath}#${toPosixPath(node.path)}`,
          attributes: { ...(node.attributes ?? {}) } as Record<string, FrontmatterValue>,
          edges: {
            epic: remapTarget(node.edges.epic, qidMap),
            parent: remapTarget(node.edges.parent, qidMap),
            prev: remapTarget(node.edges.prev, qidMap),
            next: remapTarget(node.edges.next, qidMap),
            relates: remapTargets(node.edges.relates, qidMap),
            blocked_by: remapTargets(node.edges.blocked_by, qidMap),
            blocks: remapTargets(node.edges.blocks, qidMap),
          },
          source: {
            imported: true,
            read_only: true,
            import_alias: alias,
            original_qid: node.qid,
            original_ws: node.ws,
            original_path: toPosixPath(node.path),
            bundle_path: relativeBundlePath,
            bundle_hash: manifest.bundle_hash,
            profile: manifest.profile,
            visibility: entry.visibility,
            stale,
            warnings: [...warnings],
            source_repo: entry.source_repo ?? manifest.source?.repo,
            source_git_head: manifest.source?.git_head ?? null,
          },
        };
        nodes[projected.qid] = projected;
        addReverseEdges(reverse_edges, projected);
      }
    }
  } catch (err) {
    errors.push(err instanceof Error ? err.message : String(err));
  }

  return {
    health: {
      alias,
      path: entry.path,
      enabled: entry.enabled,
      visibility: entry.visibility,
      expected_profile: entry.expected_profile,
      profile: manifest?.profile,
      bundle_hash: manifest?.bundle_hash,
      source_git_head: manifest?.source?.git_head ?? null,
      source_repo: entry.source_repo ?? manifest?.source?.repo,
      stale,
      warning_count: warnings.length,
      error_count: errors.length,
      warnings,
      errors,
    },
    nodes,
    reverse_edges,
  };
}

export function resolveBundleImportsIndexPath(root: string): string {
  return path.resolve(root, ".mdkg", "index", "imports.json");
}

export function buildBundleImportsIndex(root: string, config: Config): BundleImportProjection {
  const imports: BundleImportHealth[] = [];
  const nodes: Record<string, IndexNode> = {};
  const reverse_edges: Index["reverse_edges"] = {};
  const workspaces: Index["workspaces"] = {};

  for (const alias of Object.keys(config.bundle_imports).sort()) {
    const entry = config.bundle_imports[alias];
    const projected = projectOneImport(root, alias, entry);
    imports.push(projected.health);
    if (!entry.enabled || projected.health.error_count > 0) {
      continue;
    }
    workspaces[alias] = { path: `bundle:${entry.path}`, enabled: true };
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
        cache_version: IMPORTS_CACHE_VERSION,
        generated_at: new Date().toISOString(),
        root,
        import_count: imports.length,
        node_count: Object.keys(nodes).length,
      },
      imports,
      nodes,
      reverse_edges,
    },
    workspaces,
  };
}

export function writeBundleImportsIndex(indexPath: string, index: BundleImportsIndex): void {
  fs.mkdirSync(path.dirname(indexPath), { recursive: true });
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), "utf8");
}

export function isBundleImportsIndexStale(root: string, config: Config): boolean {
  const indexPath = resolveBundleImportsIndexPath(root);
  if (!fs.existsSync(indexPath)) {
    return Object.keys(config.bundle_imports).length > 0;
  }
  const indexMtime = fs.statSync(indexPath).mtimeMs;
  const cfgPath = configPath(root);
  if (fs.existsSync(cfgPath) && fs.statSync(cfgPath).mtimeMs > indexMtime) {
    return true;
  }
  for (const entry of Object.values(config.bundle_imports)) {
    const bundlePath = path.resolve(root, entry.path);
    if (!fs.existsSync(bundlePath)) {
      return true;
    }
    if (fs.statSync(bundlePath).mtimeMs > indexMtime) {
      return true;
    }
  }
  return false;
}

export function mergeBundleImportsIntoIndex(base: Index, projection: BundleImportProjection): Index {
  const nodes = { ...base.nodes, ...projection.index.nodes };
  const reverse_edges: Index["reverse_edges"] = JSON.parse(JSON.stringify(base.reverse_edges));
  for (const [edgeKey, targets] of Object.entries(projection.index.reverse_edges)) {
    reverse_edges[edgeKey] = reverse_edges[edgeKey] ?? {};
    for (const [target, sources] of Object.entries(targets)) {
      reverse_edges[edgeKey][target] = [
        ...(reverse_edges[edgeKey][target] ?? []),
        ...sources,
      ].sort();
    }
  }
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

export function importWarnings(projection: BundleImportProjection): string[] {
  const warnings: string[] = [];
  for (const item of projection.index.imports) {
    for (const warning of item.warnings) {
      warnings.push(`bundle import ${item.alias}: ${warning}`);
    }
    for (const error of item.errors) {
      warnings.push(`bundle import ${item.alias}: ${error}`);
    }
  }
  return warnings;
}

export function buildImportedCapabilityRecords(root: string, config: Config): {
  records: Array<Record<string, unknown>>;
  warnings: string[];
} {
  const records: Array<Record<string, unknown>> = [];
  const warnings: string[] = [];
  for (const alias of Object.keys(config.bundle_imports).sort()) {
    const entry = config.bundle_imports[alias];
    if (!entry.enabled) {
      continue;
    }
    const projection = projectOneImport(root, alias, entry);
    for (const warning of projection.health.warnings) {
      warnings.push(`bundle import ${alias}: ${warning}`);
    }
    for (const error of projection.health.errors) {
      warnings.push(`bundle import ${alias}: ${error}`);
    }
    if (projection.health.error_count > 0) {
      continue;
    }
    try {
      const bundlePath = resolveBundlePath(root, entry);
      const relativeBundlePath = toPosixPath(path.relative(root, bundlePath));
      const entries = readBundleEntries(bundlePath);
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
          visibility: entry.visibility,
          qid: `${alias}:${id}`,
          path: `${relativeBundlePath}#${originalPath}`,
          source: {
            imported: true,
            read_only: true,
            import_alias: alias,
            original_qid: originalQid,
            original_workspace: originalWorkspace,
            original_path: originalPath,
            bundle_path: relativeBundlePath,
            bundle_hash: projection.health.bundle_hash,
            profile: projection.health.profile,
            stale: projection.health.stale,
            warnings: [...projection.health.warnings],
          },
        });
      }
    } catch (err) {
      warnings.push(`bundle import ${alias}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  return { records, warnings };
}
