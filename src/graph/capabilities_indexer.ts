import crypto from "crypto";
import fs from "fs";
import path from "path";
import { Config, WorkspaceConfig } from "../core/config";
import { FrontmatterValue } from "./frontmatter";
import { Index, IndexNode, buildIndex } from "./indexer";
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
    extensions: Record<string, Record<string, FrontmatterValue>>;
  };
  spec?: Record<string, FrontmatterValue>;
  work?: Record<string, FrontmatterValue>;
  source?: {
    imported: boolean;
    read_only: boolean;
    import_alias: string;
    original_qid: string;
    original_workspace: string;
    original_path: string;
    bundle_path: string;
    bundle_hash?: string;
    profile?: string;
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
  };
  records: CapabilityRecord[];
};

const CAPABILITY_CACHE_VERSION = 1;

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
  if (node.type === "spec") {
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

function nodeCapabilityRecord(
  root: string,
  config: Config,
  node: IndexNode,
  kind: CapabilityKind,
  indexedAt: string
): CapabilityRecord {
  const absolutePath = path.resolve(root, node.path);
  const content = fs.readFileSync(absolutePath, "utf8");
  const record: CapabilityRecord = {
    kind,
    workspace: node.ws,
    visibility: workspaceVisibility(config, node.ws),
    id: node.id,
    qid: node.qid,
    path: toPosixPath(node.path),
    title: node.title,
    tags: [...node.tags],
    refs: [...node.refs],
    aliases: [...node.aliases],
    links: [...node.links],
    artifacts: [...node.artifacts],
    updated: node.updated,
    indexed_at: indexedAt,
    source_hash: sourceHash(content),
    headings: extractHeadings(content),
    node_type: node.type,
  };

  if (kind === "spec") {
    record.spec = pickAttributes(node.attributes, [
      "version",
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
    record.work = pickAttributes(node.attributes, [
      "version",
      "agent_id",
      "kind",
      "pricing_model",
      "required_capabilities",
      "skill_refs",
      "tool_refs",
      "model_refs",
      "wasm_component_refs",
      "runtime_image_refs",
      "subagent_refs",
      "inputs",
      "outputs",
      "receipt_required",
    ]);
  }

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
      extensions: skill.extensions,
    },
  };
}

function workspaceSkillsRoot(root: string, entry: WorkspaceConfig): string {
  return path.resolve(root, entry.path, entry.mdkg_dir, "skills");
}

function buildWorkspaceSkillCapabilities(
  root: string,
  config: Config,
  indexedAt: string
): CapabilityRecord[] {
  const records: CapabilityRecord[] = [];
  for (const alias of Object.keys(config.workspaces).sort()) {
    const workspace = config.workspaces[alias];
    if (!workspace.enabled) {
      continue;
    }
    const skillsRoot = workspaceSkillsRoot(root, workspace);
    for (const candidate of listSkillMarkdownFiles(skillsRoot)) {
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
    records.push(nodeCapabilityRecord(root, config, node, kind, generatedAt));
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
    },
    records: sortedRecords,
  };
}
