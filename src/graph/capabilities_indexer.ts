import crypto from "crypto";
import fs from "fs";
import path from "path";
import { Config, WorkspaceConfig } from "../core/config";
import { workspaceDocumentRelativePath } from "../core/workspace_path";
import { absoluteWorkspaceDocumentOwner } from "./workspace_ownership";
import { FrontmatterValue } from "./frontmatter";
import { identityRef, NodeIdentity } from "./identity";
import { resolveQid } from "../util/qid";
import { matchesWorkContractPath } from "./identity_refs";
import { Index, IndexNode, buildIndex } from "./indexer";
import {
  CANONICAL_MANIFEST_BASENAME,
  LEGACY_SPEC_BASENAME,
  isManifestSemanticType,
} from "./agent_file_types";
import {
  buildSkillIndexEntryForWorkspace,
  listSkillMarkdownFiles,
  SkillIndexEntry,
} from "./skills_indexer";

export const CAPABILITIES_INDEX_RELATIVE_PATH = ".mdkg/index/capabilities.json";
export const CAPABILITY_KINDS = ["skill", "spec", "work", "core", "design"] as const;
export const CAPABILITY_VISIBILITIES = ["private", "internal", "public"] as const;

export type CapabilityKind = (typeof CAPABILITY_KINDS)[number];
export type CapabilityVisibility = (typeof CAPABILITY_VISIBILITIES)[number];

export type CapabilityHeading = {
  level: number;
  text: string;
};

export type CapabilityRecord = {
  identity?: NodeIdentity;
  stable_ref?: string;
  alias_qid?: string;
  kind: CapabilityKind;
  workspace: string;
  visibility: CapabilityVisibility;
  id: string;
  qid: string;
  path: string;
  title: string;
  tags: string[];
  refs: string[];
  aliases: string[];
  links: string[];
  artifacts: string[];
  updated?: string;
  indexed_at: string;
  source_hash: string;
  headings: CapabilityHeading[];
  node_type?: string;
  slug?: string;
  name?: string;
  description?: string;
  skill?: {
    version?: string;
    authors: string[];
    has_scripts: boolean;
    has_references: boolean;
  };
  spec?: Record<string, FrontmatterValue>;
  manifest?: {
    semantic_kind: "manifest";
    source_basename: string;
    source_type: string;
    canonical_basename: typeof CANONICAL_MANIFEST_BASENAME;
    legacy_basename: typeof LEGACY_SPEC_BASENAME;
    compatibility_mode: "canonical" | "legacy" | "transitional";
    legacy: boolean;
    deprecated: boolean;
    command_family: "manifest";
    legacy_command_family: "spec";
  };
  work?: Record<string, FrontmatterValue>;
  linkage?: {
    spec_qids: string[];
    work_contract_qids: string[];
    work_order_qids: string[];
    receipt_qids: string[];
  };
  source?: {
    imported: boolean;
    read_only: boolean;
    subgraph_alias: string;
    original_qid: string;
    original_workspace: string;
    original_path: string;
    bundle_path: string;
    bundle_hash?: string;
    profile?: string;
    permissions?: string[];
    stale: boolean;
    warnings: string[];
  };
};

export type CapabilitiesIndex = {
  meta: {
    tool: string;
    schema_version: number;
    cache_version: number;
    generated_at: string;
    root: string;
    workspaces: string[];
    record_count: number;
    inspection_errors?: string[];
  };
  records: CapabilityRecord[];
};

const CAPABILITY_CACHE_VERSION = 1;

const WORK_CAPABILITY_ATTRIBUTES = [
  "version", "agent_id", "kind", "required_capabilities", "skill_refs", "tool_refs",
  "model_refs", "wasm_component_refs", "runtime_image_refs", "subagent_refs",
  "inputs", "outputs", "receipt_required",
];

// Apply the current discovery contract to cached/imported records as well as
// freshly indexed source. Preserve source provenance and never rewrite inputs.
export function projectCapabilityRecord(record: CapabilityRecord): CapabilityRecord {
  return {
    ...record,
    ...(record.skill ? { skill: {
      version: record.skill.version,
      authors: record.skill.authors,
      has_scripts: record.skill.has_scripts,
      has_references: record.skill.has_references,
    } } : {}),
    ...(record.work ? { work: pickAttributes(record.work, WORK_CAPABILITY_ATTRIBUTES) } : {}),
  };
}

function toPosixPath(value: string): string {
  return value.split(path.sep).join("/");
}

function sourceHash(content: string): string {
  return `sha256:${crypto.createHash("sha256").update(content).digest("hex")}`;
}

function extractHeadings(content: string): CapabilityHeading[] {
  const headings: CapabilityHeading[] = [];
  for (const line of content.split(/\r?\n/)) {
    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) {
      continue;
    }
    headings.push({ level: match[1].length, text: match[2].trim() });
  }
  return headings;
}

function workspaceVisibility(config: Config, alias: string): CapabilityVisibility {
  return config.workspaces[alias]?.visibility ?? "private";
}

function workspaceMdkgPrefix(entry: WorkspaceConfig): string {
  const wsPath = entry.path === "." ? "" : `${toPosixPath(entry.path).replace(/\/+$/, "")}/`;
  const mdkgDir = toPosixPath(entry.mdkg_dir).replace(/^\/+|\/+$/g, "");
  return `${wsPath}${mdkgDir}/`;
}

function classifyNodeCapability(node: IndexNode, config: Config): CapabilityKind | undefined {
  if (isManifestSemanticType(node.type)) {
    return "spec";
  }
  if (node.type === "work") {
    return "work";
  }

  const workspace = config.workspaces[node.ws];
  if (!workspace) {
    return undefined;
  }
  const nodePath = toPosixPath(node.path);
  const prefix = workspaceMdkgPrefix(workspace);
  if (!nodePath.startsWith(prefix)) {
    return undefined;
  }
  const relativeToMdkg = nodePath.slice(prefix.length);
  if (relativeToMdkg.startsWith("core/")) {
    return "core";
  }
  if (relativeToMdkg.startsWith("design/")) {
    return "design";
  }
  return undefined;
}

function pickAttributes(
  attributes: Record<string, FrontmatterValue>,
  keys: string[]
): Record<string, FrontmatterValue> {
  const picked: Record<string, FrontmatterValue> = {};
  for (const key of keys) {
    if (attributes[key] !== undefined) {
      picked[key] = attributes[key];
    }
  }
  return picked;
}

function toStringList(value: FrontmatterValue | undefined): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
}

function nodeRefSet(node: IndexNode): Set<string> {
  return new Set([node.id, node.qid, `${node.ws}:${node.id}`]);
}

function sortedNodes(nodes: Iterable<IndexNode>): IndexNode[] {
  return [...nodes].sort((a, b) => a.qid.localeCompare(b.qid));
}

function resolveSpecWorkContracts(index: Index, specNode: IndexNode): IndexNode[] {
  const candidates = new Map<string, IndexNode>();
  const specDir = path.posix.dirname(specNode.path);
  for (const contractPath of toStringList(specNode.attributes.work_contracts)) {
    const resolved = specNode.identity ? resolveQid(index, contractPath, specNode.ws) : undefined;
    if (resolved?.status === "ok") {
      const target = index.nodes[resolved.qid];
      if (target.type === "work" && target.ws === specNode.ws) candidates.set(target.qid, target);
      continue;
    }
    const normalizedPath = path.posix.normalize(path.posix.join(specDir, contractPath));
    for (const node of Object.values(index.nodes)) {
      if (node.type === "work" && node.ws === specNode.ws && (node.path === normalizedPath || matchesWorkContractPath(node.path, contractPath))) {
        candidates.set(node.qid, node);
      }
    }
  }
  for (const qid of specNode.edges.relates) {
    const node = index.nodes[qid];
    if (node?.type === "work") {
      candidates.set(node.qid, node);
    }
  }
  for (const qid of index.reverse_edges.relates?.[specNode.qid] ?? []) {
    const node = index.nodes[qid];
    if (node?.type === "work") {
      candidates.set(node.qid, node);
    }
  }
  return sortedNodes(candidates.values());
}

function resolveWorkSpecs(index: Index, workNode: IndexNode): IndexNode[] {
  const candidates = new Map<string, IndexNode>();
  const workRefs = nodeRefSet(workNode);
  for (const node of Object.values(index.nodes)) {
    if (!isManifestSemanticType(node.type) || node.ws !== workNode.ws) {
      continue;
    }
    const agentId = typeof workNode.attributes.agent_id === "string" ? workNode.attributes.agent_id : undefined;
    if (agentId && nodeRefSet(node).has(agentId)) {
      candidates.set(node.qid, node);
    }
    if (resolveSpecWorkContracts(index, node).some((contract) => contract.qid === workNode.qid)) {
      candidates.set(node.qid, node);
    }
    if (node.edges.relates.some((qid) => workRefs.has(qid))) {
      candidates.set(node.qid, node);
    }
  }
  return sortedNodes(candidates.values());
}

function resolveWorkOrders(index: Index, workNode: IndexNode): IndexNode[] {
  const workRefs = nodeRefSet(workNode);
  return sortedNodes(
    Object.values(index.nodes).filter(
      (node) => node.type === "work_order" && workRefs.has(String(node.attributes.work_id ?? ""))
    )
  );
}

function resolveReceiptsForOrders(index: Index, orderNodes: IndexNode[]): IndexNode[] {
  const orderRefs = new Set<string>();
  for (const order of orderNodes) {
    for (const ref of nodeRefSet(order)) {
      orderRefs.add(ref);
    }
  }
  return sortedNodes(
    Object.values(index.nodes).filter(
      (node) => node.type === "receipt" && orderRefs.has(String(node.attributes.work_order_id ?? ""))
    )
  );
}

function buildCapabilityLinkage(index: Index, node: IndexNode, kind: CapabilityKind): CapabilityRecord["linkage"] | undefined {
  if (kind !== "spec" && kind !== "work") {
    return undefined;
  }
  const workContracts = kind === "spec" ? resolveSpecWorkContracts(index, node) : [node];
  const specNodes = kind === "work" ? resolveWorkSpecs(index, node) : [];
  const workOrders = workContracts.flatMap((workNode) => resolveWorkOrders(index, workNode));
  const receipts = resolveReceiptsForOrders(index, workOrders);
  return {
    spec_qids: specNodes.map((specNode) => specNode.qid),
    work_contract_qids: workContracts.map((workNode) => workNode.qid),
    work_order_qids: workOrders.map((orderNode) => orderNode.qid),
    receipt_qids: receipts.map((receiptNode) => receiptNode.qid),
  };
}

function manifestCapabilityMetadata(node: IndexNode): CapabilityRecord["manifest"] | undefined {
  if (!isManifestSemanticType(node.type)) {
    return undefined;
  }
  const sourceBasename = path.posix.basename(node.path);
  const compatibilityMode =
    sourceBasename === LEGACY_SPEC_BASENAME
      ? "legacy"
      : node.type === "spec"
        ? "transitional"
        : "canonical";
  return {
    semantic_kind: "manifest",
    source_basename: sourceBasename,
    source_type: node.type,
    canonical_basename: CANONICAL_MANIFEST_BASENAME,
    legacy_basename: LEGACY_SPEC_BASENAME,
    compatibility_mode: compatibilityMode,
    legacy: compatibilityMode !== "canonical",
    deprecated: compatibilityMode !== "canonical",
    command_family: "manifest",
    legacy_command_family: "spec",
  };
}

function manifestSearchAliases(metadata: CapabilityRecord["manifest"]): string[] {
  if (!metadata) {
    return [];
  }
  return [
    "manifest",
    "manifest.md",
    "MANIFEST.md",
    "manifest capability",
    "MANIFEST.md legacy SPEC.md",
    "spec.md compatibility alias",
    "legacy spec.md",
    metadata.compatibility_mode,
    metadata.source_basename,
  ];
}

function nodeCapabilityRecord(
  root: string,
  config: Config,
  index: Index,
  node: IndexNode,
  kind: CapabilityKind,
  indexedAt: string
): CapabilityRecord {
  const absolutePath = path.resolve(root, node.path);
  const content = fs.readFileSync(absolutePath, "utf8");
  const manifest = kind === "spec" ? manifestCapabilityMetadata(node) : undefined;
  const record: CapabilityRecord = {
    ...(node.identity ? { identity: node.identity, stable_ref: identityRef(node.identity) } : {}),
    ...(node.alias_qid ? { alias_qid: node.alias_qid } : {}),
    kind,
    workspace: node.ws,
    visibility: workspaceVisibility(config, node.ws),
    id: node.id,
    qid: node.qid,
    path: toPosixPath(node.path),
    title: node.title,
    tags: [...node.tags],
    refs: [...node.refs],
    aliases: Array.from(new Set([...node.aliases, ...manifestSearchAliases(manifest)])),
    links: [...node.links],
    artifacts: [...node.artifacts],
    updated: node.updated,
    indexed_at: indexedAt,
    source_hash: sourceHash(content),
    headings: extractHeadings(content),
    node_type: node.type,
  };

  if (kind === "spec") {
    record.manifest = manifest;
    record.spec = pickAttributes(node.attributes, [
      "version",
      "spec_kind",
      "role",
      "runtime_mode",
      "work_contracts",
      "requested_capabilities",
      "skill_refs",
      "tool_refs",
      "model_refs",
      "wasm_component_refs",
      "runtime_image_refs",
      "subagent_refs",
      "resource_profile",
      "update_policy",
    ]);
  }
  if (kind === "work") {
    record.work = pickAttributes(node.attributes, WORK_CAPABILITY_ATTRIBUTES);
  }
  record.linkage = buildCapabilityLinkage(index, node, kind);

  return record;
}

function skillCapabilityRecord(
  root: string,
  config: Config,
  skill: SkillIndexEntry,
  indexedAt: string
): CapabilityRecord {
  const absolutePath = path.resolve(root, skill.path);
  const content = fs.readFileSync(absolutePath, "utf8");
  return {
    kind: "skill",
    workspace: skill.ws,
    visibility: workspaceVisibility(config, skill.ws),
    id: skill.id,
    qid: skill.qid,
    path: toPosixPath(skill.path),
    title: skill.name,
    name: skill.name,
    description: skill.description,
    slug: skill.slug,
    tags: [...skill.tags],
    refs: [],
    aliases: [skill.slug, ...skill.tags],
    links: [...skill.links],
    artifacts: [],
    indexed_at: indexedAt,
    source_hash: sourceHash(content),
    headings: extractHeadings(content),
    skill: {
      version: skill.version,
      authors: [...skill.authors],
      has_scripts: skill.has_scripts,
      has_references: skill.has_references,
    },
  };
}

function workspaceSkillsRoot(root: string, entry: WorkspaceConfig): string {
  return path.resolve(root, workspaceDocumentRelativePath(entry.path, entry.mdkg_dir, "skills"));
}

function buildWorkspaceSkillCapabilities(
  root: string,
  config: Config,
  indexedAt: string
): CapabilityRecord[] {
  const records: CapabilityRecord[] = [];
  const owner = absoluteWorkspaceDocumentOwner(root, config);
  for (const alias of Object.keys(config.workspaces).sort()) {
    const workspace = config.workspaces[alias];
    if (!workspace.enabled) {
      continue;
    }
    const skillsRoot = workspaceSkillsRoot(root, workspace);
    for (const candidate of listSkillMarkdownFiles(skillsRoot, (file) => owner(file) === alias)) {
      const skill = buildSkillIndexEntryForWorkspace(
        root,
        alias,
        candidate.slug,
        candidate.filePath
      );
      records.push(skillCapabilityRecord(root, config, skill, indexedAt));
    }
  }
  return records;
}

function sortRecords(records: CapabilityRecord[]): CapabilityRecord[] {
  return [...records].sort((a, b) => {
    for (const [left, right] of [
      [a.workspace, b.workspace],
      [a.kind, b.kind],
      [a.id, b.id],
      [a.path, b.path],
    ]) {
      const compared = left.localeCompare(right);
      if (compared !== 0) {
        return compared;
      }
    }
    return 0;
  });
}

export function resolveCapabilitiesIndexPath(root: string, config: Config): string {
  return path.resolve(root, config.capabilities.cache_path);
}

export function buildCapabilitiesIndex(
  root: string,
  config: Config,
  nodeIndex?: Index
): CapabilitiesIndex {
  const index = nodeIndex ?? buildIndex(root, config);
  const records: CapabilityRecord[] = [];
  const generatedAt = new Date().toISOString();

  for (const node of Object.values(index.nodes)) {
    const kind = classifyNodeCapability(node, config);
    if (!kind) {
      continue;
    }
    records.push(nodeCapabilityRecord(root, config, index, node, kind, generatedAt));
  }

  records.push(...buildWorkspaceSkillCapabilities(root, config, generatedAt));
  const sortedRecords = sortRecords(records);

  return {
    meta: {
      tool: config.tool,
      schema_version: config.schema_version,
      cache_version: CAPABILITY_CACHE_VERSION,
      generated_at: generatedAt,
      root,
      workspaces: Object.keys(config.workspaces)
        .filter((alias) => config.workspaces[alias].enabled)
        .sort(),
      record_count: sortedRecords.length,
      ...(index.meta.inspection_errors?.length ? { inspection_errors: index.meta.inspection_errors } : {}),
    },
    records: sortedRecords,
  };
}
