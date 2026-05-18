import fs from "fs";
import path from "path";
import { FrontmatterValue } from "./frontmatter";
import { checkArchiveIntegrity } from "./archive_integrity";
import { isPortableId } from "../util/id";

export const ARCHIVE_ATTRIBUTE_KEY_ORDER = [
  "archive_kind",
  "source_path",
  "stored_path",
  "compressed_path",
  "mime_type",
  "byte_size",
  "sha256",
  "compressed_sha256",
  "visibility",
  "provenance",
  "ingest_status",
];

const ARCHIVE_KIND_VALUES = new Set(["source", "artifact"]);
const VISIBILITY_VALUES = new Set(["private", "internal", "public"]);
const INGEST_STATUS_VALUES = new Set(["pending", "ingested", "compressed", "verified", "failed"]);
const SHA256_RE = /^sha256:[a-f0-9]{64}$/;
const MIME_RE = /^[a-z0-9.+-]+\/[a-z0-9.+-]+$/;

function formatError(filePath: string, message: string): Error {
  return new Error(`${filePath}: ${message}`);
}

function expectString(
  frontmatter: Record<string, FrontmatterValue>,
  key: string,
  filePath: string
): string {
  const value = frontmatter[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw formatError(filePath, `${key} is required and must be a non-empty string`);
  }
  return value;
}

function requireEnum(value: string, key: string, allowed: Set<string>, filePath: string): void {
  if (!allowed.has(value)) {
    throw formatError(filePath, `${key} must be one of ${Array.from(allowed).join(", ")}`);
  }
}

function requireRelativePath(value: string, key: string, filePath: string): void {
  if (path.isAbsolute(value) || value.split(/[\\/]/).includes("..")) {
    throw formatError(filePath, `${key} must be a relative path`);
  }
}

function requireSha256(value: string, key: string, filePath: string): void {
  if (!SHA256_RE.test(value)) {
    throw formatError(filePath, `${key} must be sha256:<64 lowercase hex chars>`);
  }
}

export function isArchiveType(type: string): boolean {
  return type === "archive";
}

export function validateArchiveFrontmatter(
  type: string,
  frontmatter: Record<string, FrontmatterValue>,
  filePath: string
): void {
  if (!isArchiveType(type)) {
    return;
  }

  const id = expectString(frontmatter, "id", filePath);
  if (id !== id.toLowerCase() || !isPortableId(id) || !id.startsWith("archive.")) {
    throw formatError(filePath, "id must be a lowercase portable archive id like archive.example");
  }

  const archiveKind = expectString(frontmatter, "archive_kind", filePath);
  requireEnum(archiveKind, "archive_kind", ARCHIVE_KIND_VALUES, filePath);
  const sourcePath = expectString(frontmatter, "source_path", filePath);
  if (sourcePath.includes("\0")) {
    throw formatError(filePath, "source_path must not contain NUL bytes");
  }
  if (path.isAbsolute(sourcePath) || sourcePath.split(/[\\/]/).includes("..")) {
    throw formatError(filePath, "source_path must be repo-relative or external:<label>");
  }
  const storedPath = expectString(frontmatter, "stored_path", filePath);
  requireRelativePath(storedPath, "stored_path", filePath);
  const compressedPath = expectString(frontmatter, "compressed_path", filePath);
  requireRelativePath(compressedPath, "compressed_path", filePath);
  const mimeType = expectString(frontmatter, "mime_type", filePath);
  if (!MIME_RE.test(mimeType)) {
    throw formatError(filePath, "mime_type must look like type/subtype");
  }
  const byteSize = expectString(frontmatter, "byte_size", filePath);
  if (!/^[0-9]+$/.test(byteSize)) {
    throw formatError(filePath, "byte_size must be a non-negative integer string");
  }
  const sourceHash = expectString(frontmatter, "sha256", filePath);
  requireSha256(sourceHash, "sha256", filePath);
  const compressedHash = expectString(frontmatter, "compressed_sha256", filePath);
  requireSha256(compressedHash, "compressed_sha256", filePath);
  const visibility = expectString(frontmatter, "visibility", filePath);
  requireEnum(visibility, "visibility", VISIBILITY_VALUES, filePath);
  const provenance = expectString(frontmatter, "provenance", filePath);
  if (provenance.trim().length === 0) {
    throw formatError(filePath, "provenance must not be empty");
  }
  const ingestStatus = expectString(frontmatter, "ingest_status", filePath);
  requireEnum(ingestStatus, "ingest_status", INGEST_STATUS_VALUES, filePath);

  const sidecarDir = path.dirname(filePath);
  const checked = checkArchiveIntegrity({
    root: sidecarDir,
    rawPath: path.resolve(sidecarDir, storedPath),
    zipPath: path.resolve(sidecarDir, compressedPath),
    expectedRawHash: sourceHash,
    expectedCompressedHash: compressedHash,
    expectedByteSize: byteSize,
  });
  if (!checked.ok) {
    throw formatError(filePath, checked.errors.join("; "));
  }
}

export function extractArchiveAttributes(
  type: string,
  frontmatter: Record<string, FrontmatterValue>
): Record<string, FrontmatterValue> {
  if (!isArchiveType(type)) {
    return {};
  }
  const attributes: Record<string, FrontmatterValue> = {};
  for (const key of ARCHIVE_ATTRIBUTE_KEY_ORDER) {
    const value = frontmatter[key];
    if (value !== undefined) {
      attributes[key] = value;
    }
  }
  return attributes;
}
