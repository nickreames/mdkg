import { FrontmatterValue } from "./frontmatter";
import { isCanonicalIdRef } from "../util/id";

export type EdgeMap = {
  epic?: string;
  parent?: string;
  prev?: string;
  next?: string;
  relates: string[];
  blocked_by: string[];
  blocks: string[];
};

function formatError(filePath: string, key: string, message: string): Error {
  return new Error(`${filePath}: ${key} ${message}`);
}

function normalizeIdRef(value: string, filePath: string, key: string): string {
  const normalized = value.toLowerCase();
  if (normalized !== value) {
    throw formatError(filePath, key, "must be lowercase");
  }
  if (!isCanonicalIdRef(normalized)) {
    throw formatError(filePath, key, `invalid id reference: ${value}`);
  }
  return normalized;
}

function readString(fm: Record<string, FrontmatterValue>, key: string): string | undefined {
  const value = fm[key];
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "string") {
    throw new Error(`${key} must be a string`);
  }
  return value;
}

function readStringList(fm: Record<string, FrontmatterValue>, key: string): string[] | undefined {
  const value = fm[key];
  if (value === undefined) {
    return undefined;
  }
  if (!Array.isArray(value)) {
    throw new Error(`${key} must be a list`);
  }
  return value as string[];
}

export function extractEdges(
  frontmatter: Record<string, FrontmatterValue>,
  filePath: string
): EdgeMap {
  const epic = readString(frontmatter, "epic");
  const parent = readString(frontmatter, "parent");
  const prev = readString(frontmatter, "prev");
  const next = readString(frontmatter, "next");

  const relates = readStringList(frontmatter, "relates") ?? [];
  const blocked_by = readStringList(frontmatter, "blocked_by") ?? [];
  const blocks = readStringList(frontmatter, "blocks") ?? [];

  const edges: EdgeMap = {
    relates: relates.map((value) => normalizeIdRef(value, filePath, "relates")),
    blocked_by: blocked_by.map((value) => normalizeIdRef(value, filePath, "blocked_by")),
    blocks: blocks.map((value) => normalizeIdRef(value, filePath, "blocks")),
  };

  if (epic) {
    edges.epic = normalizeIdRef(epic, filePath, "epic");
  }
  if (parent) {
    edges.parent = normalizeIdRef(parent, filePath, "parent");
  }
  if (prev) {
    edges.prev = normalizeIdRef(prev, filePath, "prev");
  }
  if (next) {
    edges.next = normalizeIdRef(next, filePath, "next");
  }

  return edges;
}
