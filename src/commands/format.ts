import fs from "fs";
import path from "path";
import { loadConfig } from "../core/config";
import {
  DEFAULT_FRONTMATTER_KEY_ORDER,
  FrontmatterValue,
  formatFrontmatter,
  parseFrontmatter,
} from "../graph/frontmatter";
import { loadTemplateSchemas, TemplateSchema } from "../graph/template_schema";
import { ALLOWED_TYPES, DEC_TYPES, WORK_TYPES } from "../graph/node";
import { listWorkspaceDocFilesByAlias } from "../graph/workspace_files";
import { ValidationError } from "../util/errors";
import { formatDate } from "../util/date";

export type FormatCommandOptions = {
  root: string;
  now?: Date;
};

const ID_RE = /^[a-z]+-[0-9]+$/;
const ID_REF_RE = /^([a-z][a-z0-9_]*:)?[a-z]+-[0-9]+$/;
const DEC_ID_RE = /^dec-[0-9]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const ID_LIST_KEYS = new Set(["refs", "scope"]);
const ID_REF_LIST_KEYS = new Set(["relates", "blocked_by", "blocks"]);
const ID_REF_SCALAR_KEYS = new Set(["epic", "parent", "prev", "next"]);
const PRESERVE_CASE_LIST_KEYS = new Set(["links", "artifacts"]);

function isValidId(value: string): boolean {
  return ID_RE.test(value) || value === "rule-guide";
}

function isCoreListFile(filePath: string): boolean {
  return path.basename(filePath) === "core.md" && path.basename(path.dirname(filePath)) === "core";
}

function normalizeScalar(value: string): string {
  return value.trim();
}

function sortList(values: string[]): string[] {
  return values.slice().sort((a, b) => {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    if (aLower < bLower) {
      return -1;
    }
    if (aLower > bLower) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  });
}

function normalizeList(
  values: string[],
  key: string,
  errors: string[],
  filePath: string
): string[] {
  const trimmed = values.map((value) => normalizeScalar(value));
  const shouldLowercase = !PRESERVE_CASE_LIST_KEYS.has(key);
  const normalized = shouldLowercase ? trimmed.map((value) => value.toLowerCase()) : trimmed;
  for (const entry of normalized) {
    if (!entry) {
      errors.push(`${filePath}: ${key} entries must be non-empty`);
      continue;
    }
    if (ID_LIST_KEYS.has(key) && !isValidId(entry)) {
      errors.push(`${filePath}: ${key} entries must match <prefix>-<number>`);
    }
    if (ID_REF_LIST_KEYS.has(key) && !ID_REF_RE.test(entry)) {
      errors.push(`${filePath}: ${key} entries must be valid id references`);
    }
  }
  return sortList(normalized);
}

function normalizeIdRef(
  value: string,
  key: string,
  errors: string[],
  filePath: string
): string {
  const normalized = normalizeScalar(value).toLowerCase();
  if (!ID_REF_RE.test(normalized)) {
    errors.push(`${filePath}: ${key} must be a valid id reference`);
  }
  return normalized;
}

function normalizeFrontmatterValue(
  key: string,
  value: FrontmatterValue,
  schema: TemplateSchema,
  errors: string[],
  filePath: string
): FrontmatterValue | undefined {
  const expected = schema.keyKinds[key];
  if (expected === "list") {
    if (!Array.isArray(value)) {
      errors.push(`${filePath}: ${key} must be a list`);
      return [];
    }
    return normalizeList(value as string[], key, errors, filePath);
  }
  if (expected === "boolean") {
    if (typeof value !== "boolean") {
      errors.push(`${filePath}: ${key} must be a boolean`);
      return value;
    }
    return value;
  }
  if (Array.isArray(value) || typeof value === "boolean") {
    errors.push(`${filePath}: ${key} must be a string`);
    return value;
  }
  return normalizeScalar(value as string);
}

function normalizeFrontmatter(
  frontmatter: Record<string, FrontmatterValue>,
  schema: TemplateSchema,
  type: string,
  workStatusEnum: string[],
  priorityMin: number,
  priorityMax: number,
  filePath: string
): { normalized: Record<string, FrontmatterValue>; errors: string[] } {
  const errors: string[] = [];
  const normalized: Record<string, FrontmatterValue> = {};

  for (const key of Object.keys(frontmatter)) {
    if (!schema.allowedKeys.has(key)) {
      errors.push(`${filePath}: unknown key: ${key}`);
    }
  }

  for (const key of schema.allowedKeys) {
    const value = frontmatter[key];
    if (value === undefined) {
      if (schema.listKeys.has(key)) {
        normalized[key] = [];
      }
      continue;
    }
    const normalizedValue = normalizeFrontmatterValue(key, value, schema, errors, filePath);
    if (normalizedValue !== undefined) {
      normalized[key] = normalizedValue;
    }
  }

  const idValue = normalized.id;
  if (typeof idValue !== "string") {
    errors.push(`${filePath}: id is required`);
  } else {
    const normalizedId = idValue.toLowerCase();
    if (!isValidId(normalizedId)) {
      errors.push(`${filePath}: id must match <prefix>-<number>`);
    }
    normalized.id = normalizedId;
  }

  normalized.type = type;

  if (typeof normalized.title !== "string" || normalized.title.trim().length === 0) {
    errors.push(`${filePath}: title is required`);
  }

  const createdValue = normalized.created;
  if (typeof createdValue !== "string") {
    errors.push(`${filePath}: created is required`);
  } else if (!DATE_RE.test(createdValue)) {
    errors.push(`${filePath}: created must be YYYY-MM-DD`);
  }

  const updatedValue = normalized.updated;
  if (typeof updatedValue !== "string") {
    errors.push(`${filePath}: updated is required`);
  } else if (!DATE_RE.test(updatedValue)) {
    errors.push(`${filePath}: updated must be YYYY-MM-DD`);
  }

  if (WORK_TYPES.has(type)) {
    const statusValue = normalized.status;
    if (typeof statusValue !== "string") {
      errors.push(`${filePath}: status is required for work items`);
    } else {
      const normalizedStatus = statusValue.toLowerCase();
      const allowed = new Set(workStatusEnum.map((value) => value.toLowerCase()));
      if (!allowed.has(normalizedStatus)) {
        errors.push(`${filePath}: status must be one of ${Array.from(allowed).join(", ")}`);
      }
      normalized.status = normalizedStatus;
    }
  } else if (DEC_TYPES.has(type)) {
    const statusValue = normalized.status;
    if (typeof statusValue !== "string") {
      errors.push(`${filePath}: status is required for decision records`);
    } else {
      const normalizedStatus = statusValue.toLowerCase();
      if (!["proposed", "accepted", "rejected", "superseded"].includes(normalizedStatus)) {
        errors.push(`${filePath}: status must be one of proposed, accepted, rejected, superseded`);
      }
      normalized.status = normalizedStatus;
    }
  }

  if (normalized.priority !== undefined) {
    const priorityValue = normalized.priority;
    if (typeof priorityValue !== "string") {
      errors.push(`${filePath}: priority must be an integer`);
    } else {
      const parsed = Number.parseInt(priorityValue, 10);
      if (!Number.isInteger(parsed)) {
        errors.push(`${filePath}: priority must be an integer`);
      } else if (parsed < priorityMin || parsed > priorityMax) {
        errors.push(`${filePath}: priority must be between ${priorityMin} and ${priorityMax}`);
      } else {
        normalized.priority = String(parsed);
      }
    }
  }
  if (normalized.priority !== undefined && !WORK_TYPES.has(type)) {
    errors.push(`${filePath}: priority is only allowed for work items`);
  }

  for (const key of ID_REF_SCALAR_KEYS) {
    const value = normalized[key];
    if (typeof value === "string") {
      normalized[key] = normalizeIdRef(value, key, errors, filePath);
    }
  }

  if (typeof normalized.supersedes === "string") {
    const normalizedValue = normalizeScalar(normalized.supersedes).toLowerCase();
    if (!DEC_ID_RE.test(normalizedValue)) {
      errors.push(`${filePath}: supersedes must be a dec-# id`);
    }
    normalized.supersedes = normalizedValue;
  }
  if (normalized.supersedes !== undefined && !DEC_TYPES.has(type)) {
    errors.push(`${filePath}: supersedes is only allowed for decision records`);
  }

  if (!WORK_TYPES.has(type) && !DEC_TYPES.has(type) && normalized.status !== undefined) {
    errors.push(`${filePath}: status is not allowed for this type`);
  }

  return { normalized, errors };
}

export function runFormatCommand(options: FormatCommandOptions): void {
  const config = loadConfig(options.root);
  const templateSchemas = loadTemplateSchemas(options.root, config, ALLOWED_TYPES);
  const filesByAlias = listWorkspaceDocFilesByAlias(options.root, config);
  const today = formatDate(options.now ?? new Date());

  const errors: string[] = [];
  const updates: Array<{ filePath: string; content: string }> = [];

  for (const files of Object.values(filesByAlias)) {
    for (const filePath of files) {
      if (isCoreListFile(filePath)) {
        continue;
      }
      let content = "";
      try {
        content = fs.readFileSync(filePath, "utf8");
      } catch (err) {
        const message = err instanceof Error ? err.message : "unknown error";
        errors.push(`${filePath}: failed to read file: ${message}`);
        continue;
      }
      let parsed;
      try {
        parsed = parseFrontmatter(content, filePath);
      } catch (err) {
        const message = err instanceof Error ? err.message : "unknown error";
        errors.push(message);
        continue;
      }

      const typeValue = parsed.frontmatter.type;
      if (typeof typeValue !== "string") {
        errors.push(`${filePath}: type is required`);
        continue;
      }
      const type = typeValue.toLowerCase();
      if (!ALLOWED_TYPES.has(type)) {
        errors.push(`${filePath}: type must be one of ${Array.from(ALLOWED_TYPES).join(", ")}`);
        continue;
      }
      const schema = templateSchemas[type];
      if (!schema) {
        errors.push(`${filePath}: template schema missing for type ${type}`);
        continue;
      }

  const { normalized, errors: fmErrors } = normalizeFrontmatter(
    parsed.frontmatter,
    schema,
    type,
    config.work.status_enum,
    config.work.priority_min,
    config.work.priority_max,
    filePath
  );
      if (fmErrors.length > 0) {
        errors.push(...fmErrors);
        continue;
      }

      const keepTrailingNewline = content.endsWith("\n");
      const frontmatterLines = formatFrontmatter(normalized, DEFAULT_FRONTMATTER_KEY_ORDER);
      const frontmatterBlock = ["---", ...frontmatterLines, "---"].join("\n");
      let formattedContent =
        parsed.body.length > 0 ? `${frontmatterBlock}\n${parsed.body}` : frontmatterBlock;
      if (keepTrailingNewline && !formattedContent.endsWith("\n")) {
        formattedContent = `${formattedContent}\n`;
      }

      if (formattedContent !== content) {
        normalized.updated = today;
        const updatedLines = formatFrontmatter(normalized, DEFAULT_FRONTMATTER_KEY_ORDER);
        const updatedBlock = ["---", ...updatedLines, "---"].join("\n");
        let updatedContent =
          parsed.body.length > 0 ? `${updatedBlock}\n${parsed.body}` : updatedBlock;
        if (keepTrailingNewline && !updatedContent.endsWith("\n")) {
          updatedContent = `${updatedContent}\n`;
        }
        updates.push({ filePath, content: updatedContent });
      }
    }
  }

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(error);
    }
    throw new ValidationError(`format failed with ${errors.length} error(s)`);
  }

  for (const update of updates) {
    fs.writeFileSync(update.filePath, update.content, "utf8");
  }

  console.log(`format updated ${updates.length} file(s)`);
}
