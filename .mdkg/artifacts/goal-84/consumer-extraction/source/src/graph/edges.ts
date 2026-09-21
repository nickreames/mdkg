import { FrontmatterValue } from "./frontmatter";
import { isCanonicalIdRef, isPortableIdRef } from "../util/id";
import { validatePortableOrUriRef } from "../util/refs";

export type EdgeMap = {
  epic?: string;
  parent?: string;
  prev?: string;
  next?: string;
  relates: string[];
  blocked_by: string[];
  blocks: string[];
  context_refs: string[];
  evidence_refs: string[];
};

function formatError(filePath: string, key: string, message: string): Error {
  return new Error(`${filePath}: ${key} ${message}`);
}

export type ExtractEdgesOptions = {
  allowPortableRefs?: boolean;
  includeSemanticRefs?: boolean;
};

function normalizeIdRef(
  value: string,
  filePath: string,
  key: string,
  options: ExtractEdgesOptions
): string {
  const normalized = value.toLowerCase();
  if (normalized !== value) {
    throw formatError(filePath, key, "must be lowercase");
  }
  const valid = options.allowPortableRefs
    ? isPortableIdRef(normalized)
    : isCanonicalIdRef(normalized);
  if (!valid) {
    throw formatError(filePath, key, `invalid id reference: ${value}`);
  }
  return normalized;
}

function normalizeSemanticRef(value: string, filePath: string, key: string): string {
  if (!validatePortableOrUriRef(value)) {
    throw formatError(filePath, key, `invalid semantic reference: ${value}`);
  }
  return value.includes("://") ? value : value.toLowerCase();
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
  filePath: string,
  options: ExtractEdgesOptions = {}
): EdgeMap {
  const epic = readString(frontmatter, "epic");
  const parent = readString(frontmatter, "parent");
  const prev = readString(frontmatter, "prev");
  const next = readString(frontmatter, "next");

  const relates = readStringList(frontmatter, "relates") ?? [];
  const blocked_by = readStringList(frontmatter, "blocked_by") ?? [];
  const blocks = readStringList(frontmatter, "blocks") ?? [];
  const context_refs = options.includeSemanticRefs
    ? readStringList(frontmatter, "context_refs") ?? []
    : [];
  const evidence_refs = options.includeSemanticRefs
    ? readStringList(frontmatter, "evidence_refs") ?? []
    : [];

  const edges: EdgeMap = {
    relates: relates.map((value) => normalizeIdRef(value, filePath, "relates", options)),
    blocked_by: blocked_by.map((value) =>
      normalizeIdRef(value, filePath, "blocked_by", options)
    ),
    blocks: blocks.map((value) => normalizeIdRef(value, filePath, "blocks", options)),
    context_refs: context_refs.map((value) => normalizeSemanticRef(value, filePath, "context_refs")),
    evidence_refs: evidence_refs.map((value) => normalizeSemanticRef(value, filePath, "evidence_refs")),
  };

  if (epic) {
    edges.epic = normalizeIdRef(epic, filePath, "epic", options);
  }
  if (parent) {
    edges.parent = normalizeIdRef(parent, filePath, "parent", options);
  }
  if (prev) {
    edges.prev = normalizeIdRef(prev, filePath, "prev", options);
  }
  if (next) {
    edges.next = normalizeIdRef(next, filePath, "next", options);
  }

  return edges;
}
