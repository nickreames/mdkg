import { FrontmatterValue, parseFrontmatter } from "./frontmatter";
import { EdgeMap, extractEdges } from "./edges";
import { TemplateSchema, TemplateSchemaMap } from "./template_schema";

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
const DEC_ID_RE = /^dec-[0-9]+$/;

export const WORK_TYPES = new Set(["epic", "feat", "task", "bug", "checkpoint"]);
export const DEC_TYPES = new Set(["dec"]);
export const ALLOWED_TYPES = new Set([
  "rule",
  "prd",
  "edd",
  "dec",
  "prop",
  "epic",
  "feat",
  "task",
  "bug",
  "checkpoint",
]);

const DEC_STATUS = new Set(["proposed", "accepted", "rejected", "superseded"]);

export type NodeParseOptions = {
  workStatusEnum: string[];
  priorityMin: number;
  priorityMax: number;
  templateSchemas: TemplateSchemaMap;
};

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

function requireLowercaseList(values: string[], key: string, filePath: string): string[] {
  return values.map((value, index) => {
    if (value !== value.toLowerCase()) {
      throw formatError(filePath, `${key}[${index}] must be lowercase`);
    }
    return value;
  });
}

function isValidId(value: string): boolean {
  return ID_RE.test(value) || value === "rule-guide";
}

function requireIdFormat(value: string, key: string, filePath: string): string {
  if (!isValidId(value)) {
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

function parsePriority(value: string, filePath: string, min: number, max: number): number {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed)) {
    throw formatError(filePath, "priority must be an integer");
  }
  if (parsed < min || parsed > max) {
    throw formatError(filePath, `priority must be between ${min} and ${max}`);
  }
  return parsed;
}

function normalizeIdList(values: string[], key: string, filePath: string): string[] {
  return values.map((value) => {
    if (value !== value.toLowerCase()) {
      throw formatError(filePath, `${key} entries must be lowercase`);
    }
    if (!isValidId(value)) {
      throw formatError(filePath, `${key} entries must match <prefix>-<number>`);
    }
    return value;
  });
}

function requireTemplateSchema(
  type: string,
  templateSchemas: TemplateSchemaMap,
  filePath: string
): TemplateSchema {
  const schema = templateSchemas[type];
  if (!schema) {
    throw formatError(filePath, `template schema missing for type ${type}`);
  }
  return schema;
}

function validateTemplateKeys(
  frontmatter: Record<string, FrontmatterValue>,
  schema: TemplateSchema,
  filePath: string
): void {
  for (const key of Object.keys(frontmatter)) {
    if (!schema.allowedKeys.has(key)) {
      throw formatError(filePath, `unknown key: ${key}`);
    }
  }

  for (const [key, value] of Object.entries(frontmatter)) {
    const expected = schema.keyKinds[key];
    if (!expected) {
      continue;
    }
    const isList = Array.isArray(value);
    const isBoolean = typeof value === "boolean";
    if (expected === "list" && !isList) {
      throw formatError(filePath, `${key} must be a list`);
    }
    if (expected === "boolean" && !isBoolean) {
      throw formatError(filePath, `${key} must be a boolean`);
    }
    if (expected === "scalar" && (isList || isBoolean)) {
      throw formatError(filePath, `${key} must be a string`);
    }
  }
}

export function parseNode(content: string, filePath: string, options: NodeParseOptions): Node {
  const { frontmatter, body } = parseFrontmatter(content, filePath);

  const type = requireLowercase(expectString(frontmatter, "type", filePath), "type", filePath);
  if (!ALLOWED_TYPES.has(type)) {
    throw formatError(filePath, `type must be one of ${Array.from(ALLOWED_TYPES).join(", ")}`);
  }
  const schema = requireTemplateSchema(type, options.templateSchemas, filePath);
  validateTemplateKeys(frontmatter, schema, filePath);

  const id = requireIdFormat(
    requireLowercase(expectString(frontmatter, "id", filePath), "id", filePath),
    "id",
    filePath
  );

  const title = expectString(frontmatter, "title", filePath);
  const created = requireDate(expectString(frontmatter, "created", filePath), "created", filePath);
  const updated = requireDate(expectString(frontmatter, "updated", filePath), "updated", filePath);

  const statusValue = optionalString(frontmatter, "status", filePath);
  let status: string | undefined = undefined;
  const workStatus = new Set(options.workStatusEnum.map((value) => value.toLowerCase()));
  if (WORK_TYPES.has(type)) {
    if (!statusValue) {
      throw formatError(filePath, "status is required for work items");
    }
    const normalized = requireLowercase(statusValue, "status", filePath);
    if (!workStatus.has(normalized)) {
      throw formatError(filePath, `status must be one of ${Array.from(workStatus).join(", ")}`);
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
    priority = parsePriority(
      priorityValue,
      filePath,
      options.priorityMin,
      options.priorityMax
    );
  }

  const tags = requireLowercaseList(optionalList(frontmatter, "tags", filePath), "tags", filePath);
  const owners = requireLowercaseList(
    optionalList(frontmatter, "owners", filePath),
    "owners",
    filePath
  );
  const links = optionalList(frontmatter, "links", filePath);
  const artifacts = optionalList(frontmatter, "artifacts", filePath);
  const refs = normalizeIdList(optionalList(frontmatter, "refs", filePath), "refs", filePath);
  const aliases = requireLowercaseList(
    optionalList(frontmatter, "aliases", filePath),
    "aliases",
    filePath
  );
  normalizeIdList(optionalList(frontmatter, "scope", filePath), "scope", filePath);
  const supersedesValue = optionalString(frontmatter, "supersedes", filePath);
  if (supersedesValue !== undefined) {
    if (!DEC_TYPES.has(type)) {
      throw formatError(filePath, "supersedes is only allowed for decision records");
    }
    const normalized = requireLowercase(supersedesValue, "supersedes", filePath);
    if (!DEC_ID_RE.test(normalized)) {
      throw formatError(filePath, "supersedes must be a dec-# id");
    }
  }

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
