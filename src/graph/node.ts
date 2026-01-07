import { FrontmatterValue, parseFrontmatter } from "./frontmatter";
import { EdgeMap, extractEdges } from "./edges";

export type Node = {
  id: string;
  type: string;
  title: string;
  created: string;
  updated: string;
  status?: string;
  priority?: number;
  tags: string[];
  owners: string[];
  links: string[];
  artifacts: string[];
  refs: string[];
  aliases: string[];
  edges: EdgeMap;
  body: string;
  frontmatter: Record<string, FrontmatterValue>;
};

const ID_RE = /^[a-z]+-[0-9]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const WORK_TYPES = new Set(["epic", "feat", "task", "bug", "chk"]);
const DEC_TYPES = new Set(["dec"]);
const ALLOWED_TYPES = new Set([
  "rule",
  "prd",
  "edd",
  "dec",
  "prop",
  "epic",
  "feat",
  "task",
  "bug",
  "chk",
]);

const WORK_STATUS = new Set(["backlog", "blocked", "todo", "progress", "review", "done"]);
const DEC_STATUS = new Set(["proposed", "accepted", "rejected", "superseded"]);

function formatError(filePath: string, message: string): Error {
  return new Error(`${filePath}: ${message}`);
}

function expectString(
  frontmatter: Record<string, FrontmatterValue>,
  key: string,
  filePath: string
): string {
  const value = frontmatter[key];
  if (typeof value !== "string") {
    throw formatError(filePath, `${key} must be a string`);
  }
  if (value.trim().length === 0) {
    throw formatError(filePath, `${key} must not be empty`);
  }
  return value;
}

function optionalString(
  frontmatter: Record<string, FrontmatterValue>,
  key: string,
  filePath: string
): string | undefined {
  const value = frontmatter[key];
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "string") {
    throw formatError(filePath, `${key} must be a string`);
  }
  if (value.trim().length === 0) {
    throw formatError(filePath, `${key} must not be empty`);
  }
  return value;
}

function optionalList(
  frontmatter: Record<string, FrontmatterValue>,
  key: string,
  filePath: string
): string[] {
  const value = frontmatter[key];
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value)) {
    throw formatError(filePath, `${key} must be a list`);
  }
  return value as string[];
}

function requireLowercase(value: string, key: string, filePath: string): string {
  if (value !== value.toLowerCase()) {
    throw formatError(filePath, `${key} must be lowercase`);
  }
  return value;
}

function requireIdFormat(value: string, key: string, filePath: string): string {
  if (!ID_RE.test(value)) {
    throw formatError(filePath, `${key} must match <prefix>-<number>`);
  }
  return value;
}

function requireDate(value: string, key: string, filePath: string): string {
  if (!DATE_RE.test(value)) {
    throw formatError(filePath, `${key} must be YYYY-MM-DD`);
  }
  return value;
}

function parsePriority(value: string, filePath: string): number {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed)) {
    throw formatError(filePath, "priority must be an integer");
  }
  if (parsed < 0 || parsed > 9) {
    throw formatError(filePath, "priority must be between 0 and 9");
  }
  return parsed;
}

function normalizeIdList(values: string[], key: string, filePath: string): string[] {
  return values.map((value) => {
    if (value !== value.toLowerCase()) {
      throw formatError(filePath, `${key} entries must be lowercase`);
    }
    if (!ID_RE.test(value)) {
      throw formatError(filePath, `${key} entries must match <prefix>-<number>`);
    }
    return value;
  });
}

export function parseNode(content: string, filePath: string): Node {
  const { frontmatter, body } = parseFrontmatter(content, filePath);

  const id = requireIdFormat(
    requireLowercase(expectString(frontmatter, "id", filePath), "id", filePath),
    "id",
    filePath
  );
  const type = requireLowercase(expectString(frontmatter, "type", filePath), "type", filePath);
  if (!ALLOWED_TYPES.has(type)) {
    throw formatError(filePath, `type must be one of ${Array.from(ALLOWED_TYPES).join(", ")}`);
  }

  const title = expectString(frontmatter, "title", filePath);
  const created = requireDate(expectString(frontmatter, "created", filePath), "created", filePath);
  const updated = requireDate(expectString(frontmatter, "updated", filePath), "updated", filePath);

  const statusValue = optionalString(frontmatter, "status", filePath);
  let status: string | undefined = undefined;
  if (WORK_TYPES.has(type)) {
    if (!statusValue) {
      throw formatError(filePath, "status is required for work items");
    }
    const normalized = requireLowercase(statusValue, "status", filePath);
    if (!WORK_STATUS.has(normalized)) {
      throw formatError(filePath, `status must be one of ${Array.from(WORK_STATUS).join(", ")}`);
    }
    status = normalized;
  } else if (DEC_TYPES.has(type)) {
    if (!statusValue) {
      throw formatError(filePath, "status is required for decision records");
    }
    const normalized = requireLowercase(statusValue, "status", filePath);
    if (!DEC_STATUS.has(normalized)) {
      throw formatError(filePath, `status must be one of ${Array.from(DEC_STATUS).join(", ")}`);
    }
    status = normalized;
  } else if (statusValue) {
    throw formatError(filePath, "status is not allowed for this type");
  }

  const priorityValue = optionalString(frontmatter, "priority", filePath);
  let priority: number | undefined = undefined;
  if (priorityValue !== undefined) {
    if (!WORK_TYPES.has(type)) {
      throw formatError(filePath, "priority is only allowed for work items");
    }
    priority = parsePriority(priorityValue, filePath);
  }

  const tags = optionalList(frontmatter, "tags", filePath);
  const owners = optionalList(frontmatter, "owners", filePath);
  const links = optionalList(frontmatter, "links", filePath);
  const artifacts = optionalList(frontmatter, "artifacts", filePath);
  const refs = normalizeIdList(optionalList(frontmatter, "refs", filePath), "refs", filePath);
  const aliases = optionalList(frontmatter, "aliases", filePath);

  const edges = extractEdges(frontmatter, filePath);

  return {
    id,
    type,
    title,
    created,
    updated,
    status,
    priority,
    tags,
    owners,
    links,
    artifacts,
    refs,
    aliases,
    edges,
    body,
    frontmatter,
  };
}
