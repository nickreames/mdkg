import crypto from "crypto";
import fs from "fs";
import {
  containedPathExists,
  readContainedFile,
  withContainedPathSink,
} from "../core/filesystem_authority";
import { UsageError } from "../util/errors";

export const GRAPH_FORMAT_PATH = ".mdkg/graph.json";
export const GRAPH_FORMAT_VERSION = 2;
export const GRAPH_REQUIRED_FEATURES = ["node-identity", "stable-references"] as const;
const UUID_PATTERN = "[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}";
const UUID_RE = new RegExp(`^${UUID_PATTERN}$`);
const IDENTITY_REF_RE = new RegExp(`^mdkg://(${UUID_PATTERN})/(${UUID_PATTERN})$`);
const HASH_RE = /^sha256:[0-9a-f]{64}$/;

export type NodeIdentity = { graph_id: string; node_id: string };
export type GraphFormatV2 = {
  format: "mdkg-graph";
  format_version: 2;
  graph_id: string;
  reader_min: 2;
  writer_min: 2;
  required_features: string[];
  migration_receipt?: string;
  lineage?: { kind: "fork"; source_graph_id: string; source_hash: string };
};
export type GraphFormat = { format_version: 1 } | GraphFormatV2;

export function canonicalValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalValue);
  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(value).sort()) {
      result[key] = canonicalValue((value as Record<string, unknown>)[key]);
    }
    return result;
  }
  return value;
}

export function canonicalJson(value: unknown): string {
  return JSON.stringify(canonicalValue(value));
}

export function identityHash(value: string | Buffer): string {
  return `sha256:${crypto.createHash("sha256").update(value).digest("hex")}`;
}

export function isIdentityUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

export function requireIdentityUuid(value: unknown, label: string): string {
  if (!isIdentityUuid(value)) throw new UsageError(`${label} must be a lowercase UUID`);
  return value;
}

export function newIdentityUuid(): string {
  return crypto.randomUUID();
}

// UUIDv8 is an opaque namespace-derived identifier, not a content checksum,
// authorization token, or timestamp. Callers must supply accepted origin data.
export function deriveIdentityUuid(namespace: string, domain: string, originParts: string[]): string {
  requireIdentityUuid(namespace, "identity namespace");
  if (!domain || originParts.length === 0 || originParts.some((part) => typeof part !== "string" || !part)) {
    throw new UsageError("deterministic identity requires a domain and nonempty origin inputs");
  }
  const bytes = crypto.createHash("sha256").update(canonicalJson(["mdkg-identity-v2", namespace, domain, originParts])).digest().subarray(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x80;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function readNodeIdentity(value: Record<string, unknown>, label: string): NodeIdentity | undefined {
  if (value.graph_id === undefined && value.node_id === undefined) return undefined;
  return {
    graph_id: requireIdentityUuid(value.graph_id, `${label}: graph_id`),
    node_id: requireIdentityUuid(value.node_id, `${label}: node_id`),
  };
}

export function identityRef(identity: NodeIdentity): string {
  requireIdentityUuid(identity.graph_id, "graph_id");
  requireIdentityUuid(identity.node_id, "node_id");
  return `mdkg://${identity.graph_id}/${identity.node_id}`;
}

export function parseIdentityRef(value: string): NodeIdentity | undefined {
  const match = IDENTITY_REF_RE.exec(value);
  return match ? { graph_id: match[1], node_id: match[2] } : undefined;
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new UsageError(`${label} must be an object`);
  return value as Record<string, unknown>;
}

function knownKeys(value: Record<string, unknown>, keys: string[], label: string): void {
  for (const key of Object.keys(value)) {
    if (!keys.includes(key)) throw new UsageError(`${label}: unsupported field ${key}`);
  }
}

export function parseGraphFormat(content: string, label = GRAPH_FORMAT_PATH): GraphFormatV2 {
  if (Buffer.byteLength(content) > 64 * 1024) throw new UsageError(`${label} exceeds 64 KiB`);
  let parsed: unknown;
  try { parsed = JSON.parse(content); }
  catch { throw new UsageError(`${label}: invalid graph format JSON`); }
  const value = record(parsed, label);
  knownKeys(value, ["format", "format_version", "graph_id", "reader_min", "writer_min", "required_features", "migration_receipt", "lineage"], label);
  if (value.format !== "mdkg-graph" || value.format_version !== 2) {
    throw new UsageError(`${label}: unsupported graph format/version; supported manifest version is 2 (absent manifest is legacy v1)`);
  }
  if (value.reader_min !== 2 || value.writer_min !== 2) {
    throw new UsageError(`${label}: unsupported reader/writer capability; this implementation supports level 2`);
  }
  const graphId = requireIdentityUuid(value.graph_id, `${label}: graph_id`);
  const features = value.required_features;
  if (!Array.isArray(features) || features.length !== GRAPH_REQUIRED_FEATURES.length ||
    new Set(features).size !== features.length || features.some((feature) => !GRAPH_REQUIRED_FEATURES.includes(feature))) {
    throw new UsageError(`${label}: unsupported or missing required graph features`);
  }
  const result: GraphFormatV2 = {
    format: "mdkg-graph", format_version: 2, graph_id: graphId,
    reader_min: 2, writer_min: 2, required_features: [...features].sort(),
  };
  if (value.migration_receipt !== undefined) {
    if (typeof value.migration_receipt !== "string" ||
      !/^\.mdkg\/identity\/migrations\/[0-9a-f]{64}\.json$/.test(value.migration_receipt)) {
      throw new UsageError(`${label}: migration_receipt must name a contained hash-addressed migration receipt`);
    }
    result.migration_receipt = value.migration_receipt;
  }
  if (value.lineage !== undefined) {
    const lineage = record(value.lineage, `${label}: lineage`);
    knownKeys(lineage, ["kind", "source_graph_id", "source_hash"], `${label}: lineage`);
    if (lineage.kind !== "fork" || typeof lineage.source_hash !== "string" || !HASH_RE.test(lineage.source_hash)) {
      throw new UsageError(`${label}: invalid fork lineage`);
    }
    const source = requireIdentityUuid(lineage.source_graph_id, `${label}: lineage source_graph_id`);
    if (source === graphId) throw new UsageError(`${label}: independent fork must have a different graph identity`);
    result.lineage = { kind: "fork", source_graph_id: source, source_hash: lineage.source_hash };
  }
  return result;
}

export function createGraphFormat(graphId = newIdentityUuid()): GraphFormatV2 {
  return parseGraphFormat(JSON.stringify({
    format: "mdkg-graph", format_version: 2, graph_id: graphId,
    reader_min: 2, writer_min: 2, required_features: [...GRAPH_REQUIRED_FEATURES],
  }));
}

export function readGraphFormat(root: string): GraphFormat {
  if (!containedPathExists({ root, relativePath: GRAPH_FORMAT_PATH })) return { format_version: 1 };
  withContainedPathSink({ root, relativePath: GRAPH_FORMAT_PATH, operation: "read" }, ({ absolutePath }) => {
    if (fs.statSync(absolutePath).size > 64 * 1024) throw new UsageError(`${GRAPH_FORMAT_PATH} exceeds 64 KiB`);
  });
  return parseGraphFormat(readContainedFile({ root, relativePath: GRAPH_FORMAT_PATH }));
}

export function assertNodeFormat(format: GraphFormat, identity: NodeIdentity | undefined, label: string): void {
  if (format.format_version === 1) {
    if (identity) throw new UsageError(`${label}: identity-bearing node requires an explicit v2 graph manifest; no implicit migration`);
  } else if (!identity) {
    throw new UsageError(`${label}: v2 node is missing graph_id/node_id; complete the reviewed migration`);
  } else if (identity.graph_id !== format.graph_id) {
    throw new UsageError(`${label}: foreign graph identity; use an explicit project fork/import mapping, not alias repair`);
  }
}

export function assertNoGraphConflictMarkers(content: string, label: string): void {
  if (/^<{7,}(?: |$)/m.test(content) && /^={7,}$/m.test(content) && /^>{7,}(?: |$)/m.test(content)) {
    throw new UsageError(`${label}: unresolved Git conflict markers; inspect variants and reconcile before graph mutation or strict validation`);
  }
}
