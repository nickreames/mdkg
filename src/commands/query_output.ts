import { IndexNode } from "../graph/indexer";
import { SkillIndexEntry } from "../graph/skills_indexer";

export type QueryOutputFormat = "json" | "xml" | "toon" | "md";

export type NodeSummaryJson = {
  id: string;
  qid: string;
  ws: string;
  type: string;
  title: string;
  status?: string;
  priority?: number;
  created: string;
  updated: string;
  tags: string[];
  owners: string[];
  links: string[];
  artifacts: string[];
  refs: string[];
  aliases: string[];
  skills: string[];
  path: string;
  edges: IndexNode["edges"];
};

export type SkillSummaryJson = {
  slug: string;
  id: string;
  qid: string;
  ws: string;
  type: "skill";
  name: string;
  description: string;
  tags: string[];
  version?: string;
  authors: string[];
  links: string[];
  path: string;
  has_scripts: boolean;
  has_references: boolean;
  ochatr: SkillIndexEntry["ochatr"];
};

export type NodeDetailJson = NodeSummaryJson & {
  body?: string;
};

export type SkillDetailJson = SkillSummaryJson & {
  body?: string;
};

export function toNodeSummaryJson(node: IndexNode): NodeSummaryJson {
  return {
    id: node.id,
    qid: node.qid,
    ws: node.ws,
    type: node.type,
    title: node.title,
    status: node.status,
    priority: node.priority,
    created: node.created,
    updated: node.updated,
    tags: [...node.tags],
    owners: [...node.owners],
    links: [...node.links],
    artifacts: [...node.artifacts],
    refs: [...node.refs],
    aliases: [...node.aliases],
    skills: [...node.skills],
    path: node.path,
    edges: {
      epic: node.edges.epic,
      parent: node.edges.parent,
      prev: node.edges.prev,
      next: node.edges.next,
      relates: [...node.edges.relates],
      blocked_by: [...node.edges.blocked_by],
      blocks: [...node.edges.blocks],
    },
  };
}

export function toNodeDetailJson(node: IndexNode, body?: string): NodeDetailJson {
  const item: NodeDetailJson = {
    ...toNodeSummaryJson(node),
  };
  if (body !== undefined) {
    item.body = body;
  }
  return item;
}

export function toSkillSummaryJson(skill: SkillIndexEntry): SkillSummaryJson {
  return {
    slug: skill.slug,
    id: skill.id,
    qid: skill.qid,
    ws: skill.ws,
    type: skill.type,
    name: skill.name,
    description: skill.description,
    tags: [...skill.tags],
    version: skill.version,
    authors: [...skill.authors],
    links: [...skill.links],
    path: skill.path,
    has_scripts: skill.has_scripts,
    has_references: skill.has_references,
    ochatr: { ...skill.ochatr },
  };
}

export function toSkillDetailJson(skill: SkillIndexEntry, body?: string): SkillDetailJson {
  const item: SkillDetailJson = {
    ...toSkillSummaryJson(skill),
  };
  if (body !== undefined) {
    item.body = body;
  }
  return item;
}

export function writeJson(payload: unknown): void {
  console.log(JSON.stringify(payload, null, 2));
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function isPrimitive(value: unknown): value is string | number | boolean | null {
  return (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

function objectToXml(tag: string, value: unknown, indent = ""): string[] {
  if (value === undefined) {
    return [];
  }
  if (Array.isArray(value)) {
    const lines = [`${indent}<${tag}>`];
    for (const item of value) {
      lines.push(...objectToXml("item", item, `${indent}  `));
    }
    lines.push(`${indent}</${tag}>`);
    return lines;
  }
  if (isPrimitive(value)) {
    return [`${indent}<${tag}>${escapeXml(value === null ? "" : String(value))}</${tag}>`];
  }
  const lines = [`${indent}<${tag}>`];
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    lines.push(...objectToXml(key, child, `${indent}  `));
  }
  lines.push(`${indent}</${tag}>`);
  return lines;
}

function formatMarkdownScalar(value: string | number | boolean | null): string {
  return value === null ? "null" : String(value);
}

function objectToMarkdown(
  value: unknown,
  lines: string[],
  indent = "",
  key?: string
): void {
  if (value === undefined) {
    return;
  }
  if (Array.isArray(value)) {
    if (key) {
      lines.push(`${indent}- ${key}:`);
    }
    const childIndent = key ? `${indent}  ` : indent;
    if (value.length === 0) {
      lines.push(`${childIndent}- []`);
      return;
    }
    for (const item of value) {
      if (isPrimitive(item)) {
        lines.push(`${childIndent}- ${formatMarkdownScalar(item)}`);
        continue;
      }
      lines.push(`${childIndent}-`);
      objectToMarkdown(item, lines, `${childIndent}  `);
    }
    return;
  }
  if (isPrimitive(value)) {
    if (!key) {
      lines.push(`${indent}- ${formatMarkdownScalar(value)}`);
      return;
    }
    lines.push(`${indent}- ${key}: ${formatMarkdownScalar(value)}`);
    return;
  }
  if (key) {
    lines.push(`${indent}- ${key}:`);
  }
  const childIndent = key ? `${indent}  ` : indent;
  for (const [childKey, childValue] of Object.entries(value as Record<string, unknown>)) {
    objectToMarkdown(childValue, lines, childIndent, childKey);
  }
}

function writeXml(payload: unknown): void {
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>'];
  lines.push(...objectToXml("response", payload));
  console.log(lines.join("\n"));
}

function writeToon(payload: unknown): void {
  console.log(JSON.stringify(payload, null, 2));
}

function writeMarkdown(payload: unknown): void {
  const lines = ["# mdkg response"];
  objectToMarkdown(payload, lines);
  console.log(lines.join("\n"));
}

export function writeStructuredOutput(payload: unknown, format: QueryOutputFormat): void {
  switch (format) {
    case "json":
      writeJson(payload);
      return;
    case "xml":
      writeXml(payload);
      return;
    case "toon":
      writeToon(payload);
      return;
    case "md":
      writeMarkdown(payload);
      return;
  }
}

export function writeCount(count: number, note?: string): void {
  console.error(`count: ${count}`);
  if (note) {
    console.error(`note: ${note}`);
  }
}
