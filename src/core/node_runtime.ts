import { ValidationError } from "../util/errors";

/** The qualified release line, not an assumption that higher majors contain
 * APIs backported to the supported LTS. Keep package/CI metadata in parity. */
export const SUPPORTED_NODE_RANGE = ">=24.18.0 <25";

export function isSupportedNodeVersion(version: string): boolean {
  const parsed = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  return Boolean(parsed && Number(parsed[1]) === 24 && Number(parsed[2]) >= 18);
}

/** Capability inspection only: no database construction, graph discovery or
 * OS subprocess. Help/version remain available even on unsupported runtimes. */
export function nodeRuntimeIssue(): string | undefined {
  if (!isSupportedNodeVersion(process.versions.node)) {
    return `Node.js ${process.versions.node} is unsupported (requires ${SUPPORTED_NODE_RANGE}). Use the supported Node 24 line; higher majors are not implicitly qualified.`;
  }
  let sqlite: any;
  try { sqlite = require("node:sqlite"); }
  catch { return `Node.js runtime is unsupported: built-in node:sqlite is unavailable (requires ${SUPPORTED_NODE_RANGE}).`; }
  const prototype = sqlite.DatabaseSync?.prototype;
  const missing = ["deserialize", "setAuthorizer", "enableDefensive"].filter(name => typeof prototype?.[name] !== "function");
  if (typeof process.availableMemory !== "function") missing.push("availableMemory");
  if (missing.length) {
    return `Node.js runtime is unsupported: missing ${missing.join(", ")} (requires ${SUPPORTED_NODE_RANGE}). No file-open or OS-specific SQLite observation fallback is used.`;
  }
  return undefined;
}

export function assertNodeRuntime(): void {
  const issue = nodeRuntimeIssue();
  if (issue) throw new ValidationError(issue);
}
