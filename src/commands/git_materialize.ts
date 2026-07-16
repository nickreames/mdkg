import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { ChildProcess, spawn } from "node:child_process";
import { collectValidateReceipt } from "./validate";
import {
  ensureContainedDirectory,
  withContainedPathSink,
} from "../core/filesystem_authority";

export const GIT_MATERIALIZE_REQUEST_SCHEMA = "mdkg.git.materialize.request.v1" as const;
export const GIT_MATERIALIZE_RECEIPT_SCHEMA = "mdkg.git.materialize.receipt.v1" as const;

const MAX_REQUEST_BYTES = 64 * 1024;
const MAX_REF_LENGTH = 512;
const MAX_REPOSITORY_REF_LENGTH = 2048;
const MAX_EVIDENCE_REFS = 32;
const MAX_CAPTURE_BYTES = 16 * 1024;
const MAX_JSON_DEPTH = 16;
const MATERIALIZE_VALIDATION_LIMITS = {
  max_files: 100_000,
  max_file_bytes: 8 * 1024 * 1024,
  max_total_bytes: 512 * 1024 * 1024,
  max_depth: 64,
} as const;

export type GitMaterializeAuthCapability =
  | "unauthenticated"
  | "gh"
  | "ssh-agent"
  | "credential-helper"
  | "git-environment";

export type GitMaterializeSubmodulePolicy = "deny" | "ignore";
export type GitMaterializeProjectMemoryPolicy = "required" | "optional" | "forbidden";
export type GitMaterializeDepth = "full" | number;

export type GitMaterializeRequest = {
  schema: typeof GIT_MATERIALIZE_REQUEST_SCHEMA;
  source_ref: string;
  repository_ref: string;
  access_ref: string;
  auth_capability: GitMaterializeAuthCapability;
  target_ref: string;
  expected_commit: string;
  expected_tree?: string;
  destination: string;
  depth: GitMaterializeDepth;
  submodule_policy: GitMaterializeSubmodulePolicy;
  project_memory_policy: GitMaterializeProjectMemoryPolicy;
  correlation_ref?: string;
  evidence_refs?: string[];
};

export type GitMaterializeReasonCode =
  | "accepted"
  | "invalid_request"
  | "auth_unavailable"
  | "destination_exists"
  | "git_unavailable"
  | "remote_unavailable"
  | "target_ref_missing"
  | "commit_mismatch"
  | "tree_mismatch"
  | "object_format_mismatch"
  | "submodules_denied"
  | "project_memory_required"
  | "project_memory_forbidden"
  | "project_memory_invalid"
  | "cancelled"
  | "git_failed"
  | "output_limit_exceeded"
  | "cleanup_failed"
  | "atomic_publish_failed"
  | "internal_error";

type RevisionEvidence = {
  commit: string | null;
  tree: string | null;
  object_format: "sha1" | "sha256" | null;
};

type ProjectMemoryEvidence = {
  policy: GitMaterializeProjectMemoryPolicy | null;
  present: boolean;
  valid: boolean | null;
  error_count: number;
};

type SubmoduleEvidence = {
  policy: GitMaterializeSubmodulePolicy | null;
  gitmodules_present: boolean;
  gitlink_count: number;
  gitlink_hash: string | null;
  initialized: false;
};

export type GitMaterializeReceipt = {
  schema: typeof GIT_MATERIALIZE_RECEIPT_SCHEMA;
  action: "git.materialize";
  ok: boolean;
  reason_code: GitMaterializeReasonCode;
  request_hash: string | null;
  repository: {
    transport: "https" | "ssh" | "git" | "file" | "local" | null;
    label: string | null;
    ref_hash: string | null;
  };
  source_ref: string | null;
  access_ref: string | null;
  correlation_ref: string | null;
  evidence_refs: string[];
  target_ref: string | null;
  expected_revision: {
    commit: string | null;
    tree: string | null;
  };
  observed_revision: RevisionEvidence;
  policies: {
    auth: {
      capability: GitMaterializeAuthCapability | null;
      available: boolean;
      status: "available" | "unavailable" | "not-evaluated";
      reason_code: string;
    };
    depth: GitMaterializeDepth | null;
    submodules: SubmoduleEvidence;
    project_memory: ProjectMemoryEvidence;
  };
  destination: {
    path: string | null;
    state: "absent" | "accepted";
    published: boolean;
  };
  cleanup: {
    state: "not-required" | "complete" | "failed";
    temporary_paths_remaining: number;
  };
  warnings: string[];
};

export type GitMaterializeCommandOptions = {
  root: string;
  request: string;
};

type ProcessResult = {
  status: number | null;
  stdout: string;
  signal: NodeJS.Signals | null;
};

class StrictJsonParser {
  private offset = 0;

  constructor(private readonly input: string) {}

  parse(): unknown {
    const value = this.parseValue(0);
    this.skipWhitespace();
    if (this.offset !== this.input.length) {
      throw new Error("request must contain exactly one JSON value");
    }
    return value;
  }

  private parseValue(depth: number): unknown {
    if (depth > MAX_JSON_DEPTH) {
      throw new Error(`request JSON exceeds maximum depth ${MAX_JSON_DEPTH}`);
    }
    this.skipWhitespace();
    const token = this.input[this.offset];
    if (token === "{") return this.parseObject(depth + 1);
    if (token === "[") return this.parseArray(depth + 1);
    if (token === '"') return this.parseString();
    if (token === "t") return this.parseLiteral("true", true);
    if (token === "f") return this.parseLiteral("false", false);
    if (token === "n") return this.parseLiteral("null", null);
    if (token === "-" || (token !== undefined && /[0-9]/.test(token))) return this.parseNumber();
    throw new Error("request is not valid JSON");
  }

  private parseObject(depth: number): Record<string, unknown> {
    this.offset += 1;
    const result: Record<string, unknown> = Object.create(null) as Record<string, unknown>;
    const keys = new Set<string>();
    this.skipWhitespace();
    if (this.input[this.offset] === "}") {
      this.offset += 1;
      return result;
    }
    while (this.offset < this.input.length) {
      this.skipWhitespace();
      if (this.input[this.offset] !== '"') throw new Error("request object keys must be JSON strings");
      const key = this.parseString();
      if (keys.has(key)) throw new Error(`request contains duplicate field: ${key}`);
      keys.add(key);
      this.skipWhitespace();
      if (this.input[this.offset] !== ":") throw new Error("request object field is missing ':'");
      this.offset += 1;
      result[key] = this.parseValue(depth);
      this.skipWhitespace();
      const delimiter = this.input[this.offset];
      if (delimiter === "}") {
        this.offset += 1;
        return result;
      }
      if (delimiter !== ",") throw new Error("request object fields must be comma separated");
      this.offset += 1;
    }
    throw new Error("request JSON object is not closed");
  }

  private parseArray(depth: number): unknown[] {
    this.offset += 1;
    const result: unknown[] = [];
    this.skipWhitespace();
    if (this.input[this.offset] === "]") {
      this.offset += 1;
      return result;
    }
    while (this.offset < this.input.length) {
      result.push(this.parseValue(depth));
      this.skipWhitespace();
      const delimiter = this.input[this.offset];
      if (delimiter === "]") {
        this.offset += 1;
        return result;
      }
      if (delimiter !== ",") throw new Error("request array values must be comma separated");
      this.offset += 1;
    }
    throw new Error("request JSON array is not closed");
  }

  private parseString(): string {
    const start = this.offset;
    this.offset += 1;
    let escaped = false;
    while (this.offset < this.input.length) {
      const character = this.input[this.offset];
      if (!escaped && character === '"') {
        this.offset += 1;
        return JSON.parse(this.input.slice(start, this.offset)) as string;
      }
      if (!escaped && character === "\\") {
        escaped = true;
      } else {
        escaped = false;
      }
      this.offset += 1;
    }
    throw new Error("request JSON string is not closed");
  }

  private parseNumber(): number {
    const rest = this.input.slice(this.offset);
    const match = /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?/.exec(rest);
    if (!match) throw new Error("request contains an invalid JSON number");
    this.offset += match[0].length;
    const value = Number(match[0]);
    if (!Number.isFinite(value)) throw new Error("request number must be finite");
    return value;
  }

  private parseLiteral<T>(literal: string, value: T): T {
    if (this.input.slice(this.offset, this.offset + literal.length) !== literal) {
      throw new Error("request contains an invalid JSON literal");
    }
    this.offset += literal.length;
    return value;
  }

  private skipWhitespace(): void {
    while (this.offset < this.input.length && /[\t\n\r ]/.test(this.input[this.offset])) {
      this.offset += 1;
    }
  }
}

class MaterializeAbort extends Error {
  constructor(readonly reasonCode: GitMaterializeReasonCode) {
    super(reasonCode);
    this.name = "MaterializeAbort";
  }
}

export class GitMaterializeError extends Error {
  constructor(readonly receipt: GitMaterializeReceipt) {
    super(`git materialize failed: ${receipt.reason_code}`);
    this.name = "GitMaterializeError";
  }
}

class CancellationScope {
  private child: ChildProcess | null = null;
  private cancelled = false;
  private readonly onSignal = (): void => {
    this.cancelled = true;
    this.terminate("SIGTERM");
  };

  start(): void {
    process.on("SIGINT", this.onSignal);
    process.on("SIGTERM", this.onSignal);
  }

  stop(): void {
    process.removeListener("SIGINT", this.onSignal);
    process.removeListener("SIGTERM", this.onSignal);
    this.child = null;
  }

  attach(child: ChildProcess): void {
    this.child = child;
    if (this.cancelled) this.terminate("SIGTERM");
  }

  detach(child: ChildProcess): void {
    if (this.child === child) this.child = null;
  }

  throwIfCancelled(): void {
    if (this.cancelled) throw new MaterializeAbort("cancelled");
  }

  private terminate(signal: NodeJS.Signals): void {
    const child = this.child;
    if (!child) return;
    terminateChild(child, signal);
    const timer = setTimeout(() => {
      if (child.exitCode !== null || child.pid === undefined) return;
      terminateChild(child, "SIGKILL");
    }, 500);
    timer.unref();
  }
}

function terminateChild(child: ChildProcess, signal: NodeJS.Signals): void {
  if (child.pid === undefined) return;
  try {
    if (process.platform === "win32") child.kill(signal);
    else process.kill(-child.pid, signal);
  } catch {
    try {
      child.kill(signal);
    } catch {
      // The process may already have exited.
    }
  }
}

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((item) => stableValue(item));
  if (value !== null && typeof value === "object") {
    const input = value as Record<string, unknown>;
    const output: Record<string, unknown> = {};
    for (const key of Object.keys(input).sort()) output[key] = stableValue(input[key]);
    return output;
  }
  return value;
}

function hashRequestValue(value: unknown): string {
  return `sha256:${crypto.createHash("sha256").update(JSON.stringify(stableValue(value))).digest("hex")}`;
}

function hashRawRequest(value: string): string {
  return `sha256:${crypto.createHash("sha256").update(value).digest("hex")}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireStringField(
  value: Record<string, unknown>,
  key: string,
  maxLength = MAX_REF_LENGTH
): string {
  const field = value[key];
  if (typeof field !== "string" || field.length === 0 || field !== field.trim()) {
    throw new Error(`${key} must be a non-empty string without surrounding whitespace`);
  }
  if (field.length > maxLength) throw new Error(`${key} exceeds maximum length ${maxLength}`);
  if (/[\0-\x1f\x7f]/.test(field)) throw new Error(`${key} must not contain control characters`);
  return field;
}

function optionalStringField(value: Record<string, unknown>, key: string): string | undefined {
  if (value[key] === undefined) return undefined;
  return requireStringField(value, key);
}

function hasUrlCredentials(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.username.length > 0 || parsed.password.length > 0;
  } catch {
    return false;
  }
}

function hasSensitiveUrlParameters(value: string): boolean {
  try {
    const parsed = new URL(value);
    for (const key of parsed.searchParams.keys()) {
      if (/(?:token|secret|password|passwd|credential|signature|api[_-]?key|private[_-]?key)/i.test(key)) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

function assertBoundedRef(label: string, value: string): void {
  if (/\s/.test(value)) throw new Error(`${label} must not contain whitespace`);
  if (value.startsWith("-")) throw new Error(`${label} must not be option-shaped`);
  if (hasUrlCredentials(value)) throw new Error(`${label} must not contain embedded credentials`);
  if (hasSensitiveUrlParameters(value)) throw new Error(`${label} must not contain credential-like URL parameters`);
}

const CREDENTIAL_SHAPED_REF_PATTERNS = [
  /^(?:bearer|basic)(?:\s|:)/i,
  /^(?:token|secret|password|passwd|credential|authorization|api[_-]?key|private[_-]?key)(?:$|[:/_-])/i,
  /^(?:gh[pousr]_|github_pat_|xox[baprs]-|sk-(?:proj-)?|sk_(?:live|test)_|rk_(?:live|test)_)/i,
  /^(?:AKIA|ASIA)[A-Z0-9]{16}$/,
  /^eyJ[A-Za-z0-9_-]{6,}\.eyJ[A-Za-z0-9_-]{6,}\.[A-Za-z0-9_-]{6,}$/,
];

function assertOpaqueNonSecretRef(label: string, value: string): void {
  assertBoundedRef(label, value);
  if (value.includes("=")) throw new Error(`${label} must not be assignment-shaped`);
  if (CREDENTIAL_SHAPED_REF_PATTERNS.some((pattern) => pattern.test(value))) {
    throw new Error(`${label} must be an opaque non-secret identifier`);
  }
}

function assertRepositoryRef(value: string): void {
  assertBoundedRef("repository_ref", value);
  if (value.includes("::")) throw new Error("repository_ref must not use Git remote helpers");
  const localAbsolute = path.isAbsolute(value) || path.win32.isAbsolute(value);
  const scheme = localAbsolute ? undefined : /^([a-z][a-z0-9+.-]*):/i.exec(value)?.[1]?.toLowerCase();
  if (scheme && !["https", "ssh", "git", "file"].includes(scheme)) {
    throw new Error("repository_ref protocol is not supported; use https, ssh, git, file, SCP-like SSH, or a local path");
  }
  if (scheme) {
    const parsed = new URL(value);
    if (parsed.search.length > 0 || parsed.hash.length > 0) {
      throw new Error("repository_ref URLs must not contain query parameters or fragments");
    }
  }
}

function repositoryEvidence(repositoryRef: string): GitMaterializeReceipt["repository"] {
  const refHash = `sha256:${crypto.createHash("sha256").update(repositoryRef).digest("hex")}`;
  const safeLabel = (prefix: string, value: string): string => {
    const normalized = value.replace(/[^A-Za-z0-9._@-]+/g, "-").replace(/^-+|-+$/g, "");
    return `${prefix}:${(normalized || "repository").slice(0, 120)}`;
  };
  if (path.isAbsolute(repositoryRef) || path.win32.isAbsolute(repositoryRef)) {
    return { transport: "local", label: safeLabel("local", path.basename(repositoryRef)), ref_hash: refHash };
  }
  try {
    const parsed = new URL(repositoryRef);
    const transport = parsed.protocol.slice(0, -1) as "https" | "ssh" | "git" | "file";
    if (transport === "file") {
      const basename = path.posix.basename(parsed.pathname) || "repository";
      return { transport, label: safeLabel("file", basename), ref_hash: refHash };
    }
    const basename = path.posix.basename(parsed.pathname) || "repository";
    return {
      transport,
      label: safeLabel(transport, `${parsed.hostname}-${basename}`),
      ref_hash: refHash,
    };
  } catch {
    const scp = /^(?:[^@/:]+@)?([^:]+):(.+)$/.exec(repositoryRef);
    if (scp) {
      return {
        transport: "ssh",
        label: safeLabel("ssh", `${scp[1]}-${path.posix.basename(scp[2])}`),
        ref_hash: refHash,
      };
    }
    return {
      transport: "local",
      label: safeLabel("local", path.basename(repositoryRef)),
      ref_hash: refHash,
    };
  }
}

function assertTargetRef(value: string): void {
  if (!value.startsWith("refs/heads/") && !value.startsWith("refs/tags/")) {
    throw new Error("target_ref must be a full refs/heads/* or refs/tags/* ref");
  }
  if (
    value.length > 1024 ||
    /[\0-\x20\x7f~^:?*\[\\]/.test(value) ||
    value.includes("..") ||
    value.includes("@{") ||
    value.includes("//") ||
    value.endsWith("/") ||
    value.endsWith(".")
  ) {
    throw new Error("target_ref is not a valid full Git ref");
  }
  const components = value.split("/");
  if (components.some((component) => component.startsWith(".") || component.endsWith(".lock"))) {
    throw new Error("target_ref is not a valid full Git ref");
  }
}

function assertObjectId(label: string, value: string): void {
  if (!/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(value)) {
    throw new Error(`${label} must be a full lowercase SHA-1 or SHA-256 object id`);
  }
}

function assertDestination(value: string): void {
  if (value.startsWith("-") || value.includes("\\")) {
    throw new Error("destination must be a portable non-option relative path using '/' separators");
  }
  if (path.isAbsolute(value) || path.posix.isAbsolute(value) || path.win32.isAbsolute(value)) {
    throw new Error("destination must be relative");
  }
  const components = value.split("/");
  if (components.some((component) => component === "" || component === "." || component === "..")) {
    throw new Error("destination must not contain empty, current-directory, or parent-directory components");
  }
}

function validateRequest(value: unknown): GitMaterializeRequest {
  if (!isRecord(value)) throw new Error("request must be a JSON object");
  const allowed = new Set([
    "schema",
    "source_ref",
    "repository_ref",
    "access_ref",
    "auth_capability",
    "target_ref",
    "expected_commit",
    "expected_tree",
    "destination",
    "depth",
    "submodule_policy",
    "project_memory_policy",
    "correlation_ref",
    "evidence_refs",
  ]);
  const unknown = Object.keys(value).filter((key) => !allowed.has(key)).sort();
  if (unknown.length > 0) throw new Error(`request contains unknown field(s): ${unknown.join(", ")}`);

  const schema = requireStringField(value, "schema");
  if (schema !== GIT_MATERIALIZE_REQUEST_SCHEMA) {
    throw new Error(`schema must equal ${GIT_MATERIALIZE_REQUEST_SCHEMA}`);
  }
  const sourceRef = requireStringField(value, "source_ref");
  const repositoryRef = requireStringField(value, "repository_ref", MAX_REPOSITORY_REF_LENGTH);
  const accessRef = requireStringField(value, "access_ref");
  const authCapability = requireStringField(value, "auth_capability") as GitMaterializeAuthCapability;
  const targetRef = requireStringField(value, "target_ref", 1024);
  const expectedCommit = requireStringField(value, "expected_commit", 64);
  const expectedTree = optionalStringField(value, "expected_tree");
  const destination = requireStringField(value, "destination", 1024);
  const submodulePolicy = requireStringField(value, "submodule_policy") as GitMaterializeSubmodulePolicy;
  const projectMemoryPolicy = requireStringField(value, "project_memory_policy") as GitMaterializeProjectMemoryPolicy;
  const correlationRef = optionalStringField(value, "correlation_ref");

  const authValues: GitMaterializeAuthCapability[] = [
    "unauthenticated",
    "gh",
    "ssh-agent",
    "credential-helper",
    "git-environment",
  ];
  if (!authValues.includes(authCapability)) {
    throw new Error(`auth_capability must be one of ${authValues.join(", ")}`);
  }
  if (!(["deny", "ignore"] as string[]).includes(submodulePolicy)) {
    throw new Error("submodule_policy must be deny or ignore");
  }
  if (!(["required", "optional", "forbidden"] as string[]).includes(projectMemoryPolicy)) {
    throw new Error("project_memory_policy must be required, optional, or forbidden");
  }

  const depthRaw = value.depth;
  let depth: GitMaterializeDepth;
  if (depthRaw === "full") depth = "full";
  else if (typeof depthRaw === "number" && Number.isSafeInteger(depthRaw) && depthRaw > 0 && depthRaw <= 2_147_483_647) {
    depth = depthRaw;
  } else {
    throw new Error('depth must be "full" or a positive integer');
  }

  let evidenceRefs: string[] | undefined;
  if (value.evidence_refs !== undefined) {
    if (!Array.isArray(value.evidence_refs) || value.evidence_refs.length > MAX_EVIDENCE_REFS) {
      throw new Error(`evidence_refs must be an array with at most ${MAX_EVIDENCE_REFS} values`);
    }
    evidenceRefs = value.evidence_refs.map((item, index) => {
      if (typeof item !== "string") throw new Error(`evidence_refs[${index}] must be a string`);
      const wrapped = { value: item };
      const normalized = requireStringField(wrapped, "value");
      assertOpaqueNonSecretRef(`evidence_refs[${index}]`, normalized);
      return normalized;
    });
    if (new Set(evidenceRefs).size !== evidenceRefs.length) throw new Error("evidence_refs must be unique");
  }

  assertOpaqueNonSecretRef("source_ref", sourceRef);
  assertRepositoryRef(repositoryRef);
  assertOpaqueNonSecretRef("access_ref", accessRef);
  assertTargetRef(targetRef);
  assertObjectId("expected_commit", expectedCommit);
  if (expectedTree !== undefined) assertObjectId("expected_tree", expectedTree);
  if (expectedTree !== undefined && expectedTree.length !== expectedCommit.length) {
    throw new Error("expected_tree and expected_commit must use the same object format");
  }
  assertDestination(destination);
  if (correlationRef !== undefined) assertOpaqueNonSecretRef("correlation_ref", correlationRef);

  return {
    schema: GIT_MATERIALIZE_REQUEST_SCHEMA,
    source_ref: sourceRef,
    repository_ref: repositoryRef,
    access_ref: accessRef,
    auth_capability: authCapability,
    target_ref: targetRef,
    expected_commit: expectedCommit,
    ...(expectedTree !== undefined ? { expected_tree: expectedTree } : {}),
    destination,
    depth,
    submodule_policy: submodulePolicy,
    project_memory_policy: projectMemoryPolicy,
    ...(correlationRef !== undefined ? { correlation_ref: correlationRef } : {}),
    ...(evidenceRefs !== undefined ? { evidence_refs: evidenceRefs } : {}),
  };
}

function readBoundedStdin(): Promise<Buffer> {
  const chunks: Buffer[] = [];
  let total = 0;

  return new Promise((resolve, reject) => {
    const readNext = (): void => {
      const remaining = MAX_REQUEST_BYTES - total;
      const buffer = Buffer.allocUnsafe(Math.min(8 * 1024, remaining + 1));
      fs.read(0, buffer, 0, buffer.length, null, (error, bytesRead) => {
        if (error) {
          reject(error);
          return;
        }
        if (bytesRead === 0) {
          resolve(Buffer.concat(chunks, total));
          return;
        }
        if (bytesRead > remaining) {
          reject(new Error(`request exceeds maximum size ${MAX_REQUEST_BYTES}`));
          return;
        }
        chunks.push(buffer.subarray(0, bytesRead));
        total += bytesRead;
        readNext();
      });
    };

    readNext();
  });
}

async function readRequest(requestPath: string): Promise<{ raw: string; parsed: unknown }> {
  let buffer: Buffer;
  if (requestPath === "-") {
    buffer = await readBoundedStdin();
  } else {
    const stat = fs.lstatSync(requestPath);
    if (!stat.isFile() || stat.isSymbolicLink()) throw new Error("--request must name a regular non-linked file or -");
    if (stat.size > MAX_REQUEST_BYTES) throw new Error(`request exceeds maximum size ${MAX_REQUEST_BYTES}`);
    buffer = fs.readFileSync(requestPath);
  }
  if (buffer.length > MAX_REQUEST_BYTES) throw new Error(`request exceeds maximum size ${MAX_REQUEST_BYTES}`);
  const raw = buffer.toString("utf8");
  return { raw, parsed: new StrictJsonParser(raw).parse() };
}

function emptyReceipt(rawHash: string | null = null): GitMaterializeReceipt {
  return {
    schema: GIT_MATERIALIZE_RECEIPT_SCHEMA,
    action: "git.materialize",
    ok: false,
    reason_code: "invalid_request",
    request_hash: rawHash,
    repository: { transport: null, label: null, ref_hash: null },
    source_ref: null,
    access_ref: null,
    correlation_ref: null,
    evidence_refs: [],
    target_ref: null,
    expected_revision: { commit: null, tree: null },
    observed_revision: { commit: null, tree: null, object_format: null },
    policies: {
      auth: {
        capability: null,
        available: false,
        status: "not-evaluated",
        reason_code: "not_evaluated",
      },
      depth: null,
      submodules: {
        policy: null,
        gitmodules_present: false,
        gitlink_count: 0,
        gitlink_hash: null,
        initialized: false,
      },
      project_memory: { policy: null, present: false, valid: null, error_count: 0 },
    },
    destination: { path: null, state: "absent", published: false },
    cleanup: { state: "not-required", temporary_paths_remaining: 0 },
    warnings: [],
  };
}

function receiptForRequest(request: GitMaterializeRequest): GitMaterializeReceipt {
  return {
    ...emptyReceipt(hashRequestValue(request)),
    repository: repositoryEvidence(request.repository_ref),
    source_ref: request.source_ref,
    access_ref: request.access_ref,
    correlation_ref: request.correlation_ref ?? null,
    evidence_refs: request.evidence_refs ?? [],
    target_ref: request.target_ref,
    expected_revision: {
      commit: request.expected_commit,
      tree: request.expected_tree ?? null,
    },
    policies: {
      auth: {
        capability: request.auth_capability,
        available: false,
        status: "not-evaluated",
        reason_code: "not_evaluated",
      },
      depth: request.depth,
      submodules: {
        policy: request.submodule_policy,
        gitmodules_present: false,
        gitlink_count: 0,
        gitlink_hash: null,
        initialized: false,
      },
      project_memory: {
        policy: request.project_memory_policy,
        present: false,
        valid: null,
        error_count: 0,
      },
    },
    destination: { path: request.destination, state: "absent", published: false },
  };
}

function baseGitArgs(hooksPath: string): string[] {
  return [
    "-c",
    `core.hooksPath=${hooksPath}`,
    "-c",
    "protocol.ext.allow=never",
    "-c",
    "submodule.recurse=false",
    "-c",
    "fetch.recurseSubmodules=false",
    "-c",
    "credential.interactive=never",
  ];
}

function gitEnvironment(sanitizedCheckout = false): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    GIT_TERMINAL_PROMPT: "0",
    GCM_INTERACTIVE: "Never",
  };
  if (sanitizedCheckout) {
    env.GIT_CONFIG_GLOBAL = process.platform === "win32" ? "NUL" : "/dev/null";
    env.GIT_CONFIG_SYSTEM = process.platform === "win32" ? "NUL" : "/dev/null";
    env.GIT_ATTR_NOSYSTEM = "1";
  }
  return env;
}

async function runProcess(
  command: string,
  args: string[],
  options: {
    cwd: string;
    env?: NodeJS.ProcessEnv;
    capture?: boolean;
    cancellation: CancellationScope;
    onStdoutChunk?: (chunk: string) => void;
  }
): Promise<ProcessResult> {
  return await new Promise<ProcessResult>((resolve, reject) => {
    let settled = false;
    let outputLimitExceeded = false;
    let stdout = "";
    let capturedBytes = 0;
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env ?? process.env,
      detached: process.platform !== "win32",
      stdio: ["ignore", "pipe", "pipe"],
    });
    options.cancellation.attach(child);

    const fail = (error: Error): void => {
      if (settled) return;
      settled = true;
      options.cancellation.detach(child);
      reject(error);
    };

    child.on("error", (error) => fail(error));
    child.stdout?.setEncoding("utf8");
    child.stderr?.setEncoding("utf8");
    child.stdout?.on("data", (chunk: string) => {
      if (options.onStdoutChunk) {
        options.onStdoutChunk(chunk);
        return;
      }
      if (!options.capture) return;
      capturedBytes += Buffer.byteLength(chunk);
      if (capturedBytes > MAX_CAPTURE_BYTES) {
        outputLimitExceeded = true;
        terminateChild(child, "SIGTERM");
        return;
      }
      stdout += chunk;
    });
    child.stderr?.on("data", () => {
      // Git and helper output is intentionally discarded and never enters receipts.
    });
    child.on("close", (status, signal) => {
      if (settled) return;
      settled = true;
      options.cancellation.detach(child);
      if (outputLimitExceeded) {
        reject(new MaterializeAbort("output_limit_exceeded"));
        return;
      }
      resolve({ status, stdout, signal });
    });
  });
}

async function runGit(
  cwd: string,
  args: string[],
  hooksPath: string,
  cancellation: CancellationScope,
  failureCode: GitMaterializeReasonCode,
  options: { capture?: boolean; sanitizedCheckout?: boolean; onStdoutChunk?: (chunk: string) => void } = {}
): Promise<ProcessResult> {
  cancellation.throwIfCancelled();
  let result: ProcessResult;
  try {
    result = await runProcess("git", [...baseGitArgs(hooksPath), ...args], {
      cwd,
      env: gitEnvironment(options.sanitizedCheckout),
      capture: options.capture,
      cancellation,
      onStdoutChunk: options.onStdoutChunk,
    });
  } catch (error) {
    if (error instanceof MaterializeAbort) throw error;
    if ((error as NodeJS.ErrnoException).code === "ENOENT") throw new MaterializeAbort("git_unavailable");
    throw new MaterializeAbort(failureCode);
  }
  cancellation.throwIfCancelled();
  if (result.status !== 0) throw new MaterializeAbort(failureCode);
  return result;
}

async function authAvailable(
  request: GitMaterializeRequest,
  root: string,
  hooksPath: string,
  cancellation: CancellationScope
): Promise<GitMaterializeReceipt["policies"]["auth"]> {
  const available = (reasonCode: string): GitMaterializeReceipt["policies"]["auth"] => ({
    capability: request.auth_capability,
    available: true,
    status: "available",
    reason_code: reasonCode,
  });
  const unavailable = (reasonCode: string): GitMaterializeReceipt["policies"]["auth"] => ({
    capability: request.auth_capability,
    available: false,
    status: "unavailable",
    reason_code: reasonCode,
  });
  switch (request.auth_capability) {
    case "unauthenticated":
      return available("not_required");
    case "ssh-agent":
      return typeof process.env.SSH_AUTH_SOCK === "string" && process.env.SSH_AUTH_SOCK.length > 0
        ? available("ssh_agent_available")
        : unavailable("ssh_agent_unavailable");
    case "git-environment":
      return ["GIT_ASKPASS", "SSH_ASKPASS", "GIT_SSH", "GIT_SSH_COMMAND"].some(
        (name) => typeof process.env[name] === "string" && process.env[name]!.length > 0
      )
        ? available("git_environment_available")
        : unavailable("git_environment_unavailable");
    case "credential-helper": {
      const result = await runProcess(
        "git",
        [...baseGitArgs(hooksPath), "config", "--get-all", "credential.helper"],
        { cwd: root, env: gitEnvironment(), cancellation }
      );
      return result.status === 0
        ? available("credential_helper_configured")
        : unavailable("credential_helper_unavailable");
    }
    case "gh": {
      try {
        const result = await runProcess("gh", ["auth", "status"], {
          cwd: root,
          env: process.env,
          cancellation,
        });
        return result.status === 0 ? available("gh_authenticated") : unavailable("gh_unavailable");
      } catch (error) {
        if (error instanceof MaterializeAbort) throw error;
        return unavailable("gh_unavailable");
      }
    }
  }
}

function relativePath(root: string, absolutePath: string): string {
  return path.relative(root, absolutePath).split(path.sep).join("/");
}

function cleanup(
  root: string,
  temporaryPaths: string[],
  createdParents: string[]
): { state: "complete" | "failed"; remaining: number } {
  let failed = false;
  for (const absolutePath of temporaryPaths) {
    try {
      fs.rmSync(absolutePath, { recursive: true, force: true });
    } catch {
      failed = true;
    }
  }
  for (const parent of [...createdParents].reverse()) {
    try {
      withContainedPathSink(
        { root, relativePath: relativePath(root, parent), operation: "delete" },
        ({ absolutePath }) => fs.rmdirSync(absolutePath)
      );
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOTEMPTY" && (error as NodeJS.ErrnoException).code !== "ENOENT") {
        failed = true;
      }
    }
  }
  const remaining = temporaryPaths.filter((item) => fs.existsSync(item)).length;
  return { state: failed || remaining > 0 ? "failed" : "complete", remaining };
}

function prepareDestination(root: string, destination: string): {
  destinationPath: string;
  temporaryPath: string;
  hooksPath: string;
  createdParents: string[];
} {
  const descriptor = withContainedPathSink(
    { root, relativePath: destination, operation: "create" },
    (item) => item
  );
  if (fs.existsSync(descriptor.absolutePath)) throw new MaterializeAbort("destination_exists");

  const parentPath = path.dirname(descriptor.absolutePath);
  const parentRelative = relativePath(root, parentPath);
  const createdParents: string[] = [];
  if (parentRelative && parentRelative !== ".") {
    const components = parentRelative.split("/");
    for (let index = 1; index <= components.length; index += 1) {
      const candidateRelative = components.slice(0, index).join("/");
      const candidate = withContainedPathSink(
        { root, relativePath: candidateRelative, operation: "create" },
        (item) => item.absolutePath
      );
      if (!fs.existsSync(candidate)) createdParents.push(candidate);
    }
    ensureContainedDirectory({ root, relativePath: parentRelative });
  }

  const suffix = crypto.randomBytes(10).toString("hex");
  const base = path.basename(descriptor.absolutePath);
  const temporaryPath = path.join(parentPath, `.${base}.mdkg-materialize-${suffix}`);
  const hooksPath = path.join(parentPath, `.${base}.mdkg-hooks-${suffix}`);
  for (const candidate of [temporaryPath, hooksPath]) {
    withContainedPathSink(
      { root, relativePath: relativePath(root, candidate), operation: "create" },
      ({ absolutePath }) => {
        if (fs.existsSync(absolutePath)) throw new MaterializeAbort("destination_exists");
      }
    );
  }
  fs.mkdirSync(hooksPath, { mode: 0o700 });
  return { destinationPath: descriptor.absolutePath, temporaryPath, hooksPath, createdParents };
}

function strictIdentity(value: string, expectedLength: number, reason: GitMaterializeReasonCode): string {
  const normalized = value.trim();
  const pattern = expectedLength === 40 ? /^[0-9a-f]{40}$/ : /^[0-9a-f]{64}$/;
  if (!pattern.test(normalized)) throw new MaterializeAbort(reason);
  return normalized;
}

async function inspectSubmodules(
  repositoryRoot: string,
  commit: string,
  hooksPath: string,
  cancellation: CancellationScope
): Promise<{ gitmodulesPresent: boolean; gitlinkCount: number; gitlinkHash: string | null }> {
  const gitmodulesResult = await runProcess(
    "git",
    [...baseGitArgs(hooksPath), "cat-file", "-e", `${commit}:.gitmodules`],
    { cwd: repositoryRoot, env: gitEnvironment(true), cancellation }
  );
  cancellation.throwIfCancelled();
  let gitlinkCount = 0;
  const gitlinkHasher = crypto.createHash("sha256");
  let remainder = "";
  await runGit(
    repositoryRoot,
    ["ls-tree", "-r", "--full-tree", "--format=%(objectmode) %(objectname)", commit],
    hooksPath,
    cancellation,
    "git_failed",
    {
      sanitizedCheckout: true,
      onStdoutChunk: (chunk) => {
        const values = `${remainder}${chunk}`.split("\n");
        remainder = values.pop() ?? "";
        for (const entry of values) {
          if (!entry.startsWith("160000 ")) continue;
          gitlinkCount += 1;
          gitlinkHasher.update(entry);
          gitlinkHasher.update("\n");
        }
      },
    }
  );
  if (remainder.startsWith("160000 ")) {
    gitlinkCount += 1;
    gitlinkHasher.update(remainder);
    gitlinkHasher.update("\n");
  }
  return {
    gitmodulesPresent: gitmodulesResult.status === 0,
    gitlinkCount,
    gitlinkHash: gitlinkCount > 0 ? `sha256:${gitlinkHasher.digest("hex")}` : null,
  };
}

function assertMaterializationValidationLimits(configPath: string): void {
  const stat = fs.lstatSync(configPath);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 256 * 1024) {
    throw new MaterializeAbort("project_memory_invalid");
  }
  let config: unknown;
  try {
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch {
    throw new MaterializeAbort("project_memory_invalid");
  }
  if (!isRecord(config)) throw new MaterializeAbort("project_memory_invalid");
  const index = isRecord(config.index) ? config.index : null;
  const limits = index && isRecord(index.limits) ? index.limits : null;
  if (!limits) return;
  for (const [key, maximum] of Object.entries(MATERIALIZE_VALIDATION_LIMITS)) {
    const value = limits[key];
    if (typeof value === "number" && value > maximum) throw new MaterializeAbort("project_memory_invalid");
  }
}

function validateProjectMemory(
  repositoryRoot: string,
  policy: GitMaterializeProjectMemoryPolicy
): { evidence: ProjectMemoryEvidence; failure?: GitMaterializeReasonCode } {
  const mdkgPath = path.join(repositoryRoot, ".mdkg");
  let stat: fs.Stats | undefined;
  try {
    stat = fs.lstatSync(mdkgPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const present = stat !== undefined;
  if (policy === "forbidden") {
    return present
      ? {
          evidence: { policy, present: true, valid: false, error_count: 1 },
          failure: "project_memory_forbidden",
        }
      : { evidence: { policy, present: false, valid: null, error_count: 0 } };
  }
  if (!present) {
    return policy === "required"
      ? {
          evidence: { policy, present: false, valid: false, error_count: 1 },
          failure: "project_memory_required",
        }
      : { evidence: { policy, present: false, valid: null, error_count: 0 } };
  }
  if (!stat!.isDirectory() || stat!.isSymbolicLink()) {
    return {
      evidence: { policy, present: true, valid: false, error_count: 1 },
      failure: "project_memory_invalid",
    };
  }
  let validation;
  try {
    assertMaterializationValidationLimits(path.join(mdkgPath, "config.json"));
    validation = collectValidateReceipt({ root: repositoryRoot, json: true });
  } catch {
    return {
      evidence: { policy, present: true, valid: false, error_count: 1 },
      failure: "project_memory_invalid",
    };
  }
  if (!validation.ok) {
    return {
      evidence: {
        policy,
        present: true,
        valid: false,
        error_count: Math.max(1, validation.error_count),
      },
      failure: "project_memory_invalid",
    };
  }
  return { evidence: { policy, present: true, valid: true, error_count: 0 } };
}

export async function collectGitMaterializeReceipt(
  options: GitMaterializeCommandOptions
): Promise<GitMaterializeReceipt> {
  let raw: string | null = null;
  let request: GitMaterializeRequest;
  try {
    const loaded = await readRequest(options.request);
    raw = loaded.raw;
    request = validateRequest(loaded.parsed);
  } catch {
    throw new GitMaterializeError(emptyReceipt(raw === null ? null : hashRawRequest(raw)));
  }

  const receipt = receiptForRequest(request);
  const cancellation = new CancellationScope();
  const temporaryPaths: string[] = [];
  let createdParents: string[] = [];
  let destinationPath: string | null = null;
  let accepted = false;
  cancellation.start();

  try {
    let prepared;
    try {
      prepared = prepareDestination(options.root, request.destination);
    } catch (error) {
      if (error instanceof MaterializeAbort) throw error;
      throw new MaterializeAbort("invalid_request");
    }
    destinationPath = prepared.destinationPath;
    createdParents = prepared.createdParents;
    temporaryPaths.push(prepared.temporaryPath, prepared.hooksPath);

    receipt.policies.auth = await authAvailable(request, options.root, prepared.hooksPath, cancellation);
    if (!receipt.policies.auth.available) throw new MaterializeAbort("auth_unavailable");

    const cloneArgs = [
      "clone",
      "--no-checkout",
      "--no-recurse-submodules",
      "--origin",
      "origin",
    ];
    if (request.depth !== "full") cloneArgs.push(`--depth=${request.depth}`);
    cloneArgs.push("--", request.repository_ref, prepared.temporaryPath);
    await runGit(
      options.root,
      cloneArgs,
      prepared.hooksPath,
      cancellation,
      "remote_unavailable"
    );

    const fetchArgs = ["fetch", "--no-recurse-submodules", "--no-tags"];
    if (request.depth !== "full") fetchArgs.push(`--depth=${request.depth}`);
    fetchArgs.push("origin", request.target_ref);
    await runGit(
      prepared.temporaryPath,
      fetchArgs,
      prepared.hooksPath,
      cancellation,
      "target_ref_missing"
    );

    const commitResult = await runGit(
      prepared.temporaryPath,
      ["rev-parse", "--verify", "FETCH_HEAD^{commit}"],
      prepared.hooksPath,
      cancellation,
      "target_ref_missing",
      { capture: true, sanitizedCheckout: true }
    );
    const observedCommit = strictIdentity(
      commitResult.stdout,
      request.expected_commit.length,
      "object_format_mismatch"
    );
    receipt.observed_revision.commit = observedCommit;
    if (observedCommit !== request.expected_commit) throw new MaterializeAbort("commit_mismatch");

    const objectFormatResult = await runGit(
      prepared.temporaryPath,
      ["rev-parse", "--show-object-format"],
      prepared.hooksPath,
      cancellation,
      "object_format_mismatch",
      { capture: true, sanitizedCheckout: true }
    );
    const objectFormat = objectFormatResult.stdout.trim();
    if (objectFormat !== "sha1" && objectFormat !== "sha256") {
      throw new MaterializeAbort("object_format_mismatch");
    }
    if ((objectFormat === "sha1" ? 40 : 64) !== request.expected_commit.length) {
      throw new MaterializeAbort("object_format_mismatch");
    }
    receipt.observed_revision.object_format = objectFormat;

    const treeResult = await runGit(
      prepared.temporaryPath,
      ["rev-parse", "--verify", `${observedCommit}^{tree}`],
      prepared.hooksPath,
      cancellation,
      "git_failed",
      { capture: true, sanitizedCheckout: true }
    );
    const observedTree = strictIdentity(treeResult.stdout, observedCommit.length, "object_format_mismatch");
    receipt.observed_revision.tree = observedTree;
    if (request.expected_tree !== undefined && observedTree !== request.expected_tree) {
      throw new MaterializeAbort("tree_mismatch");
    }

    await runGit(
      prepared.temporaryPath,
      ["checkout", "--detach", "--force", "--no-recurse-submodules", observedCommit, "--"],
      prepared.hooksPath,
      cancellation,
      "git_failed",
      { sanitizedCheckout: true }
    );

    const submodules = await inspectSubmodules(
      prepared.temporaryPath,
      observedCommit,
      prepared.hooksPath,
      cancellation
    );
    receipt.policies.submodules.gitmodules_present = submodules.gitmodulesPresent;
    receipt.policies.submodules.gitlink_count = submodules.gitlinkCount;
    receipt.policies.submodules.gitlink_hash = submodules.gitlinkHash;
    if (
      request.submodule_policy === "deny" &&
      (submodules.gitmodulesPresent || submodules.gitlinkCount > 0)
    ) {
      throw new MaterializeAbort("submodules_denied");
    }
    if (request.submodule_policy === "ignore" && submodules.gitlinkCount > 0) {
      receipt.warnings.push("submodule gitlinks were left uninitialized by policy");
    }

    const projectMemory = validateProjectMemory(
      prepared.temporaryPath,
      request.project_memory_policy
    );
    receipt.policies.project_memory = projectMemory.evidence;
    if (projectMemory.failure) throw new MaterializeAbort(projectMemory.failure);
    cancellation.throwIfCancelled();

    fs.rmSync(prepared.hooksPath, { recursive: true, force: true });
    if (fs.existsSync(destinationPath)) throw new MaterializeAbort("destination_exists");
    withContainedPathSink(
      { root: options.root, relativePath: request.destination, operation: "create" },
      ({ absolutePath }) => {
        if (fs.existsSync(absolutePath)) throw new MaterializeAbort("destination_exists");
        try {
          fs.renameSync(prepared.temporaryPath, absolutePath);
        } catch {
          throw new MaterializeAbort("atomic_publish_failed");
        }
      }
    );
    accepted = true;
    receipt.ok = true;
    receipt.reason_code = "accepted";
    receipt.destination = { path: request.destination, state: "accepted", published: true };
    receipt.cleanup = { state: "complete", temporary_paths_remaining: 0 };
    return receipt;
  } catch (error) {
    const reason = error instanceof MaterializeAbort ? error.reasonCode : "internal_error";
    const cleaned = cleanup(options.root, temporaryPaths, createdParents);
    receipt.cleanup = {
      state: temporaryPaths.length === 0 ? "not-required" : cleaned.state,
      temporary_paths_remaining: cleaned.remaining,
    };
    receipt.reason_code = cleaned.state === "failed" ? "cleanup_failed" : reason;
    receipt.destination = {
      path: request.destination,
      state: accepted ? "accepted" : "absent",
      published: accepted,
    };
    if (destinationPath !== null && !accepted && fs.existsSync(destinationPath)) {
      receipt.reason_code = "atomic_publish_failed";
    }
    throw new GitMaterializeError(receipt);
  } finally {
    cancellation.stop();
  }
}
