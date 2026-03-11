import { IndexNode } from "../graph/indexer";
import { SkillIndexEntry } from "../graph/skills_indexer";

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

export function writeCount(count: number, note?: string): void {
  console.error(`count: ${count}`);
  if (note) {
    console.error(`note: ${note}`);
  }
}
