import crypto from "crypto";
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { Config, SubgraphConfig, SubgraphSourceConfig } from "../core/config";
import { configPath } from "../core/paths";
import { FrontmatterValue } from "./frontmatter";
import { Index, IndexNode } from "./indexer";
import { atomicWriteFile } from "../util/atomic";
import { readZipEntries } from "../util/zip";

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

function resolveBundlePath(root: string, source: SubgraphSourceConfig): string {
  return path.resolve(root, source.path);
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
  const currentHead = gitOutput(sourceRoot, ["rev-parse", "HEAD"]);
  const currentStatus = gitOutput(sourceRoot, ["status", "--porcelain"]);
  let stale = false;
  if (manifest.source?.git_head && currentHead && manifest.source.git_head !== currentHead) {
    warnings.push(`source HEAD changed: ${manifest.source.git_head} -> ${currentHead}`);
    stale = true;
  }
  if (currentStatus) {
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
  return errors;
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
    if (!fs.existsSync(bundlePath)) {
      throw new Error(`bundle not found: ${source.path}`);
    }
    entries = readBundleEntries(bundlePath);
    manifest = readJsonEntry<BundleManifest>(entries, MANIFEST_ENTRY);
    index = readJsonEntry<Index>(entries, GLOBAL_INDEX_ENTRY);
    readJsonEntry<Record<string, unknown>>(entries, SKILLS_INDEX_ENTRY);
    readJsonEntry<Record<string, unknown>>(entries, CAPABILITIES_INDEX_ENTRY);
    errors.push(...entryHashErrors(entries, manifest));
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
): { health: SubgraphHealth; nodes: Record<string, IndexNode>; reverse_edges: Index["reverse_edges"] } {
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

export function writeSubgraphsIndex(indexPath: string, index: SubgraphsIndex): void {
  atomicWriteFile(indexPath, JSON.stringify(index, null, 2));
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
    for (const source of subgraph.sources) {
      if (!source.enabled) {
        continue;
      }
      try {
        const bundlePath = resolveBundlePath(root, source);
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
