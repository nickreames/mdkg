import path from "path";
import { Config, DEFAULT_INDEX_LIMITS } from "../core/config";
import { ContainedPathError, readContainedFile, readContainedFileIfPresent } from "../core/filesystem_authority";
import { canonicalJson, identityHash } from "./identity";

/** Derived-cache admission, not graph identity or an authenticity signature. */
export function jsonCacheFingerprint(kind: string, config: Config, inputs: unknown): string {
  return identityHash(canonicalJson({ cache_fingerprint_version: 1, kind, config, inputs }));
}

export function nodeCacheFingerprint(config: Config, documents: Record<string, string>,
  templates: { local: Record<string, string>; bundled: Record<string, string> }, tolerant = config.index.tolerant,
  archiveIntegrity: Record<string, boolean> = {}): string {
  // Sidecars already bind expected payload hashes. Their live integrity result
  // determines whether parsing admits a node; raw/cache timestamps do not.
  return jsonCacheFingerprint("nodes", { ...config, index: { ...config.index, tolerant } }, { documents, templates, archiveIntegrity });
}

export type SkillCacheSource = {
  workspace: string;
  slug: string;
  path: string;
  hash: string;
  has_scripts: boolean;
  has_references: boolean;
};

export function skillCacheFingerprint(config: Config, sources: SkillCacheSource[]): string {
  return jsonCacheFingerprint("skills", config, [...sources].sort((a, b) =>
    a.workspace.localeCompare(b.workspace) || a.path.localeCompare(b.path)));
}

export function capabilityCacheFingerprint(config: Config, nodes: string | undefined,
  skills: SkillCacheSource[]): string | undefined {
  // A caller-supplied projection without source evidence cannot create a
  // supposedly fresh capability cache merely by being written more recently.
  if (!nodes) return undefined;
  return jsonCacheFingerprint("capabilities", config, { nodes, skills: skillCacheFingerprint(config, skills) });
}

export function readJsonCacheFingerprint(root: string, cachePath: string,
  kind: "nodes" | "skills" | "capabilities" = "nodes"): string | undefined {
  const label = kind === "nodes" ? "index" : `${kind} index`;
  try {
    const value = JSON.parse(readJsonCacheText(root, cachePath));
    const record = (item: unknown) => item !== null && typeof item === "object" && !Array.isArray(item);
    const valid = record(value) && record(value.meta) && (kind === "nodes"
      ? record(value.workspaces) && record(value.nodes) && record(value.reverse_edges)
      : kind === "skills" ? record(value.skills) : Array.isArray(value.records));
    if (!valid) throw new Error(`${label} cache has an invalid shape`);
    const fingerprint = value?.meta?.source_fingerprint;
    return typeof fingerprint === "string" && /^sha256:[a-f0-9]{64}$/.test(fingerprint) ? fingerprint : undefined;
  } catch (error) {
    // Old unbound projections are stale, but preserve explicit corruption
    // diagnostics. Never turn refusal into permission to repair an unsafe sink.
    if (error instanceof ContainedPathError) throw error;
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw new Error(`failed to read ${label}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Derived JSON can exceed a single authored document. Use the existing graph
// aggregate budget, not the Markdown per-file limit, and inspect every read.
export function readJsonCacheText(root: string, cachePath: string): string;
export function readJsonCacheText(root: string, cachePath: string, allowMissing: true): string | null;
export function readJsonCacheText(root: string, cachePath: string, allowMissing = false): string | null {
  const input = { root, relativePath: path.relative(root, cachePath), pathSyntax: "native" as const,
    maxBytes: DEFAULT_INDEX_LIMITS.max_total_bytes };
  return allowMissing ? readContainedFileIfPresent(input) : readContainedFile(input);
}
