import path from "path";
import fs from "fs";
import { createHash } from "crypto";
import { Config } from "../core/config";
import { containedPathExists, forEachContainedDirectoryEntry, forEachContainedFileChunk, readContainedFile, withContainedPathSink } from "../core/filesystem_authority";
import { UsageError } from "../util/errors";
import { assertNoGraphConflictMarkers, canonicalJson, identityHash } from "./identity";
import { AuthoredSnapshot, indexAuthoredSnapshot } from "./identity_snapshot";
import { ALLOWED_TYPES, parseNode } from "./node";
import { loadTemplateSchemasWithInfo, TemplateSchemaLoadResult } from "./template_schema";
import { buildSubgraphsIndex } from "./subgraphs";
import { buildSkillIndexEntryForWorkspace, buildSkillsIndex, listSkillMarkdownFiles, resolveSkillsRoot } from "./skills_indexer";
import { collectGraphErrors } from "./validate_graph";
import { collectVisibilityViolations, visibilityViolationMessages } from "./visibility";
import { collectManifestSiblingConflicts } from "./agent_file_types";
import { validateEventsJsonl } from "./events_validation";
import { DEFAULT_ZIP_READ_LIMITS } from "../util/zip";
import { localTemplateLimits } from "../templates/limits";
import { normalizeEventConfig } from "../core/event_limits";
import { absoluteWorkspaceDocumentOwner } from "./workspace_ownership";
import { workspaceDocumentRelativePath } from "../core/workspace_path";
import { derivedIndexPaths } from "./reindex";
import { preflightCacheOutputs } from "./cache_output";
import { templateSetRelativePath } from "../core/template_path";

/** Version the validation coverage independently from the persisted graph format.
 * Old plans are inspectable/rollbackable, but cannot silently gain new approval.
 */
export type CandidateValidationContract = {
  version: 1;
  template_inputs: TemplateSchemaLoadResult["sourceInputs"];
  skill_directories: string[];
  template_root: string;
  skills_root: string;
  workspace_skill_roots: Record<string, string>;
  dependency_limits: Record<string, number>;
};
const message = (error: unknown) => error instanceof Error ? error.message : String(error);
const relative = (root: string, file: string) => path.relative(root, path.resolve(root, file)).split(path.sep).join("/") || ".";

function assertExactPathSpelling(root: string, file: string, label: string): void {
  // Do not case-fold Linux paths or follow links. On a case-insensitive host,
  // require the observed spelling so lexical ownership cannot be bypassed.
  withContainedPathSink({ root, relativePath: file, pathSyntax: "native", operation: "read" }, () => {
    const canonicalRoot = fs.realpathSync.native(root);
    let current = root, expected = canonicalRoot;
    for (const component of file.split("/")) {
      current = path.join(current, component); expected = path.join(expected, component);
      try { fs.lstatSync(current); }
      catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") break; throw error; }
      if (fs.realpathSync.native(current) !== expected) throw new UsageError(`${label} ownership path spelling aliases existing filesystem input: ${file}`);
    }
  });
}

// Preserve category-specific bounds before opening oversized dependencies.
// Old journal callers use the existing ZIP envelope rather than an unbounded read.
export function graphDependencyHash(root: string, file: string, maxBytes = DEFAULT_ZIP_READ_LIMITS.maxArchiveBytes): string | null {
  assertExactPathSpelling(root, file, "graph dependency");
  if (!containedPathExists({ root, relativePath: file, pathSyntax: "native" })) return null;
  const hash = createHash("sha256");
  forEachContainedFileChunk({ root, relativePath: file, pathSyntax: "native", maxBytes }, (chunk) => { hash.update(chunk); });
  return `sha256:${hash.digest("hex")}`;
}

function skillDirectories(root: string, config: Config): string[] {
  const result: string[] = [];
  const directories = new Set([relative(root, resolveSkillsRoot(root, config)), ...Object.values(workspaceSkillRoots(config))]);
  let entries = 0;
  for (const directory of directories) {
    if (!containedPathExists({ root, relativePath: directory })) continue;
    forEachContainedDirectoryEntry({ root, relativePath: directory }, (entry) => {
      if (++entries > config.index.limits.max_files * 10) throw new UsageError("skill dependency inventory exceeds discovery limit");
      if (entry.isDirectory()) result.push(`${directory}/${entry.name}`);
    });
  }
  return result.sort();
}

function workspaceSkillRoots(config: Config): Record<string, string> {
  return Object.fromEntries(Object.entries(config.workspaces).filter(([, ws]) => ws.enabled)
    .map(([alias, ws]) => [alias, workspaceDocumentRelativePath(ws.path, ws.mdkg_dir, "skills")]));
}

export function assertCandidateDependencies(root: string, config: Config,
  dependencies: Record<string, string | null>, contract: CandidateValidationContract): void {
  if (contract.version !== 1) throw new UsageError("unsupported candidate validation dependency contract");
  const inputs = loadTemplateSchemasWithInfo(root, config, ALLOWED_TYPES).sourceInputs;
  if (canonicalJson(inputs) !== canonicalJson(contract.template_inputs)) throw new UsageError("graph template dependency inventory/content moved; re-plan");
  if (canonicalJson(skillDirectories(root, config)) !== canonicalJson(contract.skill_directories)) throw new UsageError("graph skill dependency inventory moved; re-plan");
  for (const [file, expected] of Object.entries(dependencies)) {
    const limit = contract.dependency_limits[file];
    if (!Number.isSafeInteger(limit) || limit < 0) throw new UsageError(`graph dependency lacks bounded read contract: ${file}`);
    if (graphDependencyHash(root, file, limit) !== expected) throw new UsageError(`graph dependency baseline moved: ${file}`);
  }
}

export function candidateDependencyWriteConflicts(writes: Array<{ path: string; before: string | null; after: string | null }>,
  dependencies: Record<string, string | null>, contract: CandidateValidationContract): string[] {
  const within = (file: string, directory: string) => directory === "." || file === directory || file.startsWith(`${directory}/`);
  return writes.filter((change) => change.before !== change.after && (
    Object.prototype.hasOwnProperty.call(dependencies, change.path) ||
    (change.path.endsWith(".md") && within(change.path, contract.template_root)) ||
    [contract.skills_root, ...Object.values(contract.workspace_skill_roots)].some((directory) => within(change.path, directory))
  )).map((change) => `validation dependency overlaps authored write: ${change.path}; separate dependency ownership before planning`);
}

// Deliberately separate from candidate validity: exact rollback must preflight
// its cache side effects without requiring approval of a legacy invalid graph.
export function identityDerivedOutputConflicts(root: string, config: Config,
  authoredPaths: string[], dependencyPaths: string[]): string[] {
  const destinations = derivedIndexPaths(root, config);
  const paths = Object.values(destinations).map((file) => relative(root, file));
  try {
    preflightCacheOutputs(root, Object.values(destinations));
    for (const file of paths) assertExactPathSpelling(root, file, "derived cache");
  } catch (error) { return [`derived cache output ownership preflight: ${message(error)}`]; }
  const caseModes = new Map<string, boolean>();
  const insensitive = (parent: string): boolean => {
    // Future directories inherit their nearest existing parent's filesystem.
    // Observe existing names only; preview must not create a probe file.
    while (parent !== "." && !containedPathExists({ root, relativePath: parent, pathSyntax: "native" })) parent = path.posix.dirname(parent);
    const cached = caseModes.get(parent); if (cached !== undefined) return cached;
    let observed: boolean | undefined, entries = 0;
    const found = {};
    try {
      forEachContainedDirectoryEntry({ root, relativePath: parent, pathSyntax: "native" }, (entry) => {
        if (++entries > config.index.limits.max_files * 10) throw new UsageError("cache ownership case inspection exceeds discovery budget");
        if (entry.isSymbolicLink()) return;
        const alternate = entry.name.replace(/[a-zA-Z]/, (letter) => letter === letter.toLowerCase() ? letter.toUpperCase() : letter.toLowerCase());
        if (alternate === entry.name) return;
        const original = fs.lstatSync(path.resolve(root, parent, entry.name));
        try {
          const other = fs.lstatSync(path.resolve(root, parent, alternate));
          observed = original.dev === other.dev && original.ino === other.ino;
        } catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; observed = false; }
        throw found; // The contained iterator closes its descriptor in finally.
      });
    } catch (error) { if (error !== found) throw error; }
    if (observed === undefined) throw new UsageError(`cannot prove distinct case-dependent cache ownership under ${parent}; choose unambiguous destinations`);
    caseModes.set(parent, observed); return observed;
  };
  const overlaps = (a: string, b: string) => {
    if (a === "." || b === "." || a === b || a.startsWith(`${b}/`) || b.startsWith(`${a}/`)) return true;
    const left = a.split("/"), right = b.split("/");
    const length = Math.min(left.length, right.length);
    for (let i = 0; i < length; i++) {
      if (left[i] === right[i]) continue;
      if (left[i].toLowerCase() !== right[i].toLowerCase()) return false;
      if (!insensitive(left.slice(0, i).join("/") || ".")) return false;
    }
    return true;
  };
  const protectedPaths = new Set([".git", ".mdkg/config.json", ".mdkg/graph.json", ".mdkg/state", ".mdkg/identity", ".mdkg/index/write.lock",
    config.db.root_path, config.db.runtime_path, ...["-wal", "-shm", "-journal"].map((suffix) => config.db.runtime_path + suffix),
    ...authoredPaths, ...dependencyPaths, templateSetRelativePath(config.templates.root_path, config.templates.default_set), relative(root, resolveSkillsRoot(root, config))]);
  // New files must not become authored nodes or capabilities on the next read.
  // Disabled owners remain owners; do not inspect or borrow their contents.
  for (const ws of Object.values(config.workspaces)) {
    for (const folder of ["core", "design", "work", "archive", "skills"]) protectedPaths.add(workspaceDocumentRelativePath(ws.path, ws.mdkg_dir, folder));
  }
  for (const subgraph of Object.values(config.subgraphs)) if (subgraph.source_path) protectedPaths.add(subgraph.source_path);
  const errors: string[] = [];
  for (const [i, file] of paths.entries()) {
    const target = [...protectedPaths].find((protectedPath) => overlaps(file, relative(root, protectedPath)));
    if (target) errors.push(`derived cache ownership overlap: ${file} with ${target}`);
    for (const other of paths.slice(i + 1)) if (overlaps(file, other)) errors.push(`derived cache output collision: ${file} with ${other}`);
  }
  if (destinations.sqlite) for (const suffix of ["-wal", "-shm", "-journal"]) {
    const file = relative(root, destinations.sqlite + suffix);
    for (const output of paths) if (overlaps(output, file)) errors.push(`derived cache output collision with SQLite sidecar: ${output} with ${file}`);
    if (containedPathExists({ root, relativePath: file })) errors.push(`derived SQLite cache has unowned live sidecar: ${file}; preserve and resolve separately`);
  }
  return errors;
}

/** Pure authored validity plus live read-only dependency validation. Derived
 * SQLite health, native mirror warnings and opt-in contract profiles are not
 * authored validity and are separately qualified by their normal commands.
 */
export function validateIdentityCandidate(root: string, candidate: AuthoredSnapshot) {
  const dependencies: Record<string, string | null> = {};
  const blocking: string[] = [];
  const templates = loadTemplateSchemasWithInfo(root, candidate.config, ALLOWED_TYPES);
  Object.assign(dependencies, templates.sourceInputs.local);
  const contract: CandidateValidationContract = { version: 1, template_inputs: templates.sourceInputs,
    skill_directories: skillDirectories(root, candidate.config), template_root: relative(root, templates.templateRoot),
    skills_root: relative(root, resolveSkillsRoot(root, candidate.config)), workspace_skill_roots: workspaceSkillRoots(candidate.config), dependency_limits: {} };
  for (const file of Object.keys(templates.sourceInputs.local)) contract.dependency_limits[file] = localTemplateLimits(candidate.config).max_file_bytes;
  const capture = (file: string, maxBytes: number) => {
    const key = relative(root, file);
    contract.dependency_limits[key] = Math.min(contract.dependency_limits[key] ?? maxBytes, maxBytes);
    dependencies[key] = graphDependencyHash(root, key, contract.dependency_limits[key]);
  };
  for (const directory of contract.skill_directories) {
    const canonical = `${directory}/SKILL.md`, compat = `${directory}/SKILLS.md`;
    capture(canonical, candidate.config.index.limits.max_file_bytes); capture(compat, candidate.config.index.limits.max_file_bytes);
    if (dependencies[canonical] !== null && dependencies[compat] !== null) blocking.push(`${directory}: both SKILL.md and SKILLS.md exist`);
    if (path.posix.dirname(directory) === contract.skills_root && dependencies[canonical] === null && dependencies[compat] === null) blocking.push(`${directory}: missing SKILL.md or SKILLS.md`);
  }
  let skills: ReturnType<typeof buildSkillsIndex>["skills"] = {};
  try {
    let total = 0;
    skills = buildSkillsIndex(root, candidate.config, { maxEntries: candidate.config.index.limits.max_files * 10,
      readDocument: (file) => {
        const key = relative(root, file);
        const content = readContainedFile({ root, relativePath: key,
          maxBytes: Math.min(candidate.config.index.limits.max_file_bytes, candidate.config.index.limits.max_total_bytes - total) });
        total += Buffer.byteLength(content);
        if (dependencies[key] !== undefined && dependencies[key] !== identityHash(content)) throw new UsageError(`skill dependency moved during validation: ${key}`);
        dependencies[key] = identityHash(content); return content;
      } }).skills;
  } catch (error) { blocking.push(message(error)); }
  // Capability cache generation also consumes non-root local workspace skills.
  // Validate those inputs without making them satisfy root skill references.
  const owner = absoluteWorkspaceDocumentOwner(root, candidate.config);
  for (const [alias, directory] of Object.entries(contract.workspace_skill_roots)) {
    if (alias === "root") continue;
    try {
      let total = 0;
      for (const item of listSkillMarkdownFiles(path.resolve(root, directory), (file) => owner(file) === alias, candidate.config.index.limits.max_files * 10)) {
        buildSkillIndexEntryForWorkspace(root, alias, item.slug, item.filePath, (file) => {
          const key = relative(root, file), content = readContainedFile({ root, relativePath: key,
            maxBytes: Math.min(candidate.config.index.limits.max_file_bytes, candidate.config.index.limits.max_total_bytes - total) });
          total += Buffer.byteLength(content);
          if (dependencies[key] !== identityHash(content)) throw new UsageError(`workspace skill dependency moved: ${key}`);
          return content;
        });
      }
    } catch (error) { blocking.push(message(error)); }
  }
  for (const subgraph of Object.values(candidate.config.subgraphs)) {
    if (subgraph.enabled) for (const source of subgraph.sources) if (source.enabled) capture(source.path, DEFAULT_ZIP_READ_LIMITS.maxArchiveBytes);
  }
  const imported = buildSubgraphsIndex(root, candidate.config);
  for (const item of imported.index.subgraphs) blocking.push(...item.errors.map((error) => `subgraph ${item.alias}: ${error}`));
  const limits = candidate.config.index.limits;
  let graphBytes = 0;
  const nodes = candidate.nodes.map((entry) => {
    graphBytes += Buffer.byteLength(entry.content);
    if (Buffer.byteLength(entry.content) > limits.max_file_bytes) blocking.push(`${entry.path}: resulting node exceeds index.limits.max_file_bytes`);
    try {
      assertNoGraphConflictMarkers(entry.content, entry.path);
      const node = parseNode(entry.content, path.resolve(root, entry.path), {
        workStatusEnum: candidate.config.work.status_enum, priorityMin: candidate.config.work.priority_min,
        priorityMax: candidate.config.work.priority_max, templateSchemas: templates.schemas, deferArchiveIntegrity: true,
      });
      if (node.type === "archive") {
        capture(path.posix.join(path.posix.dirname(entry.path), String(node.attributes.stored_path)), DEFAULT_ZIP_READ_LIMITS.maxEntryUncompressedBytes);
        capture(path.posix.join(path.posix.dirname(entry.path), String(node.attributes.compressed_path)), DEFAULT_ZIP_READ_LIMITS.maxArchiveBytes);
        parseNode(entry.content, path.resolve(root, entry.path), { archiveRoot: root,
          workStatusEnum: candidate.config.work.status_enum, priorityMin: candidate.config.work.priority_min,
          priorityMax: candidate.config.work.priority_max, templateSchemas: templates.schemas });
      }
      for (const slug of node.skills) if (!skills[slug]) blocking.push(`${entry.qid}: skills reference missing slug: ${slug}`);
      return { ...entry, node, qid: `${entry.ws}:${node.id}`, hash: identityHash(entry.content) };
    } catch (error) { blocking.push(`${entry.path}: ${entry.node.type === "archive" ? "archive dependency requires separate exact transfer: " : ""}${message(error)}`); return entry; }
  });
  const evidence = Object.values(candidate.identity_evidence ?? {});
  for (const item of evidence) {
    if (Buffer.byteLength(item.content) > limits.max_file_bytes) blocking.push("resulting identity evidence exceeds index.limits.max_file_bytes");
    try { JSON.parse(item.content); } catch { blocking.push("resulting identity evidence is malformed JSON"); }
  }
  const evidenceBytes = evidence.reduce((sum, item) => sum + Buffer.byteLength(item.content), 0);
  if (nodes.length + evidence.length > limits.max_files || graphBytes + evidenceBytes > limits.max_total_bytes) blocking.push("resulting graph and identity evidence exceed configured discovery limits");
  blocking.push(...collectManifestSiblingConflicts(nodes.map((entry) => entry.path), (directory) => directory));
  try {
    const index = indexAuthoredSnapshot({ ...candidate, nodes }, imported.index.nodes);
    // Only actual imported nodes prove a reference. A configured alias, including
    // a disabled one, is not evidence that an arbitrary target exists.
    blocking.push(...collectGraphErrors(index, { allowMissing: false, knownSkillSlugs: new Set(Object.keys(skills)) }));
    blocking.push(...visibilityViolationMessages(collectVisibilityViolations(index, candidate.config)));
  } catch (error) { blocking.push(`strict candidate validation: ${message(error)}`); }
  const eventErrors: string[] = [];
  const eventDependencies: Record<string, string | null> = {};
  validateEventsJsonl(root, candidate.config, eventErrors, graphBytes + evidenceBytes, eventDependencies);
  for (const [file, hash] of Object.entries(eventDependencies)) {
    dependencies[file] = hash;
    contract.dependency_limits[file] = Math.min(contract.dependency_limits[file] ?? Number.MAX_SAFE_INTEGER,
      normalizeEventConfig(candidate.config.events).validation.max_file_bytes, candidate.config.index.limits.max_total_bytes);
  }
  blocking.push(...eventErrors);
  blocking.push(...identityDerivedOutputConflicts(root, candidate.config,
    [...Object.keys(candidate.files), ...candidate.nodes.map((entry) => entry.path), ...Object.keys(candidate.identity_evidence ?? {})], Object.keys(dependencies)));
  // Invalid reads do not yield a complete fingerprint. Such plans already block;
  // otherwise require every dependency to remain exact through the preview.
  if (!eventErrors.length) assertCandidateDependencies(root, candidate.config, dependencies, contract);
  return { dependencies, contract, skillPaths: Object.values(skills).map((skill) => skill.path).sort(), blocking: [...new Set(blocking)].sort() };
}
