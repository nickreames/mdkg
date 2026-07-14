import fs from "fs";
import path from "path";
import { buildBundle, BundleManifest, parseBundle, sha256Buffer } from "./bundle";
import { rebuildDerivedIndexCaches } from "./index";
import { collectValidateReceipt, ValidateReceipt } from "./validate";
import { loadConfig } from "../core/config";
import { withContainedPathSink, writeContainedFileExclusive } from "../core/filesystem_authority";
import { normalizeContainedWorkspacePath } from "../core/workspace_path";
import { buildIndex, Index, IndexNode } from "../graph/indexer";
import { loadIndex } from "../graph/index_cache";
import {
  DEFAULT_FRONTMATTER_KEY_ORDER,
  formatFrontmatter,
  FrontmatterValue,
  parseFrontmatter,
} from "../graph/frontmatter";
import { NotFoundError, UsageError, ValidationError } from "../util/errors";
import { formatResolveError, resolveQid } from "../util/qid";
import { atomicWriteFile } from "../util/atomic";
import { readZipEntries } from "../util/zip";
import { withMutationLock } from "../util/lock";
import { formatDate } from "../util/date";
import { isUriRef } from "../util/refs";
import { isCanonicalId, isPortableId } from "../util/id";

export type GraphCloneCommandOptions = {
  root: string;
  source: string;
  target: string;
  json?: boolean;
};

export type GraphForkCommandOptions = GraphCloneCommandOptions & {
  startGoal?: string;
};

export type GraphImportTemplateCommandOptions = {
  root: string;
  source: string;
  startGoal?: string;
  selectGoal?: boolean;
  idPrefix?: string;
  dryRun?: boolean;
  apply?: boolean;
  json?: boolean;
};

export type GraphRefsCommandOptions = {
  root: string;
  id: string;
  ws?: string;
  json?: boolean;
};

type LoadedGraphSource = {
  kind: "bundle" | "directory";
  sourcePath: string;
  sourceRoot?: string;
  entries: Map<string, Buffer>;
  manifest: BundleManifest;
  zipSha256: string;
};

type GraphTransportMode = "clone" | "fork";

type GraphTransportReceipt = {
  action: "graph.clone" | "graph.fork";
  ok: boolean;
  mode: GraphTransportMode;
  source: {
    kind: LoadedGraphSource["kind"];
    path: string;
    source_root?: string;
    profile: string;
    selected_workspaces: string[];
  };
  target: string;
  source_hash: {
    source_tree_hash: string;
    bundle_hash: string;
    zip_sha256: string;
  };
  preserved_ids: boolean;
  files_written: string[];
  skipped_paths: string[];
  start_goal?: {
    requested: string;
    qid: string;
    path: string;
  };
  selected_goal?: {
    qid: string;
    path: string;
  };
  index: {
    rebuilt: boolean;
    paths: Record<string, string | null>;
  };
  validation: ValidateReceipt;
  warnings: string[];
};

type ImportNodePlan = {
  source_path: string;
  target_path: string;
  from_id: string;
  to_id: string;
  type: string;
  status?: string;
  goal_state?: string;
  title?: string;
  content: string;
};

type RewriteReceipt = {
  path: string;
  field: string;
  from: string;
  to: string;
  count: number;
};

type GraphImportTemplateReceipt = {
  action: "graph.import_template";
  ok: boolean;
  mode: "import_template_dry_run" | "import_template_applied";
  source: {
    kind: LoadedGraphSource["kind"];
    path: string;
    source_root?: string;
    profile: string;
    selected_workspaces: string[];
  };
  source_hash: {
    source_tree_hash: string;
    bundle_hash: string;
    zip_sha256: string;
  };
  preserved_ids: false;
  rewritten_ids: Array<{
    from_id: string;
    to_id: string;
    from_path: string;
    to_path: string;
    reason: string;
  }>;
  rewritten_refs: RewriteReceipt[];
  planned_paths: string[];
  files_written: string[];
  skipped_paths: string[];
  start_goal?: {
    requested: string;
    from_qid: string;
    to_qid: string;
  };
  selected_goal?: {
    qid: string;
    path: string;
    planned: boolean;
  };
  activated_goal?: GoalLifecycleReceipt;
  paused_goals: GoalLifecycleReceipt[];
  index?: {
    rebuilt: boolean;
    paths: Record<string, string | null>;
  };
  validation?: ValidateReceipt;
  warnings: string[];
};

type GoalLifecycleReceipt = {
  workspace: string;
  id: string;
  qid: string;
  path: string;
  previous_status: string;
  previous_goal_state: string;
  status: string;
  goal_state: string;
  source: "local" | "imported";
  planned: boolean;
};

type RefNodeSummary = {
  qid: string;
  id: string;
  workspace: string;
  type: string;
  title: string;
  status?: string;
  path: string;
  read_only: boolean;
  source?: IndexNode["source"];
};

type RefSummary = {
  ref: string;
  kind: "node" | "uri" | "missing";
  exists: boolean;
  qid?: string;
  node?: RefNodeSummary;
};

type GraphRefsReceipt = {
  action: "graph.refs";
  ok: true;
  target: RefNodeSummary;
  outgoing: Record<string, RefSummary[]>;
  incoming: Record<string, RefSummary[]>;
  warnings: string[];
};

function writeJson(value: unknown): void {
  console.log(JSON.stringify(value, null, 2));
}

function toStringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
}

function summarizeNode(node: IndexNode): RefNodeSummary {
  return {
    qid: node.qid,
    id: node.id,
    workspace: node.ws,
    type: node.type,
    title: node.title,
    status: node.status,
    path: node.path,
    read_only: Boolean(node.source?.read_only ?? node.source?.imported),
    source: node.source,
  };
}

function summarizeRef(index: Index, value: string, ws: string): RefSummary {
  if (isUriRef(value)) {
    return {
      ref: value,
      kind: "uri",
      exists: true,
    };
  }
  const resolved = resolveQid(index, value, ws);
  if (resolved.status !== "ok") {
    return {
      ref: value,
      kind: "missing",
      exists: false,
    };
  }
  const node = index.nodes[resolved.qid];
  if (!node) {
    return {
      ref: value,
      kind: "missing",
      exists: false,
      qid: resolved.qid,
    };
  }
  return {
    ref: value,
    kind: "node",
    exists: true,
    qid: node.qid,
    node: summarizeNode(node),
  };
}

function summarizeRefs(index: Index, values: string[], ws: string): RefSummary[] {
  return [...new Set(values)].sort().map((value) => summarizeRef(index, value, ws));
}

function compactOutgoing(node: IndexNode): Record<string, string[]> {
  return {
    scope_refs: toStringList(node.attributes.scope_refs),
    epic: node.edges.epic ? [node.edges.epic] : [],
    parent: node.edges.parent ? [node.edges.parent] : [],
    prev: node.edges.prev ? [node.edges.prev] : [],
    next: node.edges.next ? [node.edges.next] : [],
    relates: node.edges.relates,
    blocked_by: node.edges.blocked_by,
    blocks: node.edges.blocks,
    context_refs: node.edges.context_refs ?? [],
    evidence_refs: node.edges.evidence_refs ?? [],
  };
}

function incomingScopeRefs(index: Index, targetQid: string): string[] {
  const sources: string[] = [];
  for (const node of Object.values(index.nodes)) {
    for (const ref of toStringList(node.attributes.scope_refs)) {
      const resolved = resolveQid(index, ref, node.ws);
      if (resolved.status === "ok" && resolved.qid === targetQid) {
        sources.push(node.qid);
      }
    }
  }
  return sources.sort();
}

function buildGraphRefsReceipt(index: Index, node: IndexNode, warnings: string[]): GraphRefsReceipt {
  const outgoingRaw = compactOutgoing(node);
  const incomingRaw: Record<string, string[]> = {
    scope_refs: incomingScopeRefs(index, node.qid),
    epic: index.reverse_edges.epic?.[node.qid] ?? [],
    parent: index.reverse_edges.parent?.[node.qid] ?? [],
    prev: index.reverse_edges.prev?.[node.qid] ?? [],
    next: index.reverse_edges.next?.[node.qid] ?? [],
    relates: index.reverse_edges.relates?.[node.qid] ?? [],
    blocked_by: index.reverse_edges.blocked_by?.[node.qid] ?? [],
    blocks: index.reverse_edges.blocks?.[node.qid] ?? [],
    context_refs: index.reverse_edges.context_refs?.[node.qid] ?? [],
    evidence_refs: index.reverse_edges.evidence_refs?.[node.qid] ?? [],
  };
  const outgoing = Object.fromEntries(
    Object.entries(outgoingRaw).map(([key, values]) => [key, summarizeRefs(index, values, node.ws)])
  );
  const incoming = Object.fromEntries(
    Object.entries(incomingRaw).map(([key, values]) => [key, summarizeRefs(index, values, node.ws)])
  );
  return {
    action: "graph.refs",
    ok: true,
    target: summarizeNode(node),
    outgoing,
    incoming,
    warnings,
  };
}

function toPosixPath(value: string): string {
  return value.split(path.sep).join("/");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function rel(root: string, target: string): string {
  return toPosixPath(path.relative(root, target)) || ".";
}

function isInside(parent: string, child: string): boolean {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function lstatIfPresent(target: string): fs.Stats | undefined {
  try {
    return fs.lstatSync(target);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return undefined;
    }
    throw err;
  }
}

function assertTargetPathContainment(root: string, targetRoot: string): void {
  // Preflight existing components before writes. Node does not expose an
  // openat-style atomic directory walk, so concurrent path replacement remains
  // an operating-system race rather than a guarantee this check can eliminate.
  const absoluteRoot = path.resolve(root);
  const relativeTarget = path.relative(absoluteRoot, targetRoot);
  const canonicalRoot = fs.realpathSync(absoluteRoot);
  let nearestExisting = absoluteRoot;
  let current = absoluteRoot;

  for (const segment of relativeTarget.split(path.sep).filter(Boolean)) {
    current = path.join(current, segment);
    const stat = lstatIfPresent(current);
    if (!stat) {
      break;
    }
    if (stat.isSymbolicLink()) {
      throw new UsageError(`--target must not contain symbolic links: ${rel(absoluteRoot, current)}`);
    }
    if (current !== targetRoot && !stat.isDirectory()) {
      throw new UsageError(`--target ancestor must be a directory: ${rel(absoluteRoot, current)}`);
    }
    nearestExisting = current;
  }

  const canonicalExisting = fs.realpathSync(nearestExisting);
  if (!isInside(canonicalRoot, canonicalExisting)) {
    throw new UsageError("--target must resolve inside the current mdkg root");
  }
}

function resolveSourcePath(root: string, source: string): string {
  if (source.includes("\0")) {
    throw new UsageError("source cannot contain NUL bytes");
  }
  return path.isAbsolute(source) ? source : path.resolve(root, source);
}

function safeZipEntryPath(entryName: string): string {
  const normalized = entryName.replace(/\\/g, "/");
  const parts = normalized.split("/");
  if (
    path.isAbsolute(normalized) ||
    parts.some((part) => part === "..") ||
    parts.some((part) => part.length === 0)
  ) {
    throw new ValidationError(`unsafe graph source entry path: ${entryName}`);
  }
  return normalized;
}

function resolveSourceDirectory(sourcePath: string): string | undefined {
  if (!fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isDirectory()) {
    return undefined;
  }
  const directConfig = path.join(sourcePath, ".mdkg", "config.json");
  if (fs.existsSync(directConfig)) {
    return sourcePath;
  }
  if (path.basename(sourcePath) === ".mdkg" && fs.existsSync(path.join(sourcePath, "config.json"))) {
    return path.dirname(sourcePath);
  }
  throw new UsageError("directory source must contain .mdkg/config.json or be an .mdkg directory");
}

function loadGraphSource(root: string, source: string): LoadedGraphSource {
  const sourcePath = resolveSourcePath(root, source);
  const sourceRoot = resolveSourceDirectory(sourcePath);
  if (sourceRoot) {
    const bundle = buildBundle({ root: sourceRoot, profile: "private" });
    return {
      kind: "directory",
      sourcePath,
      sourceRoot,
      entries: new Map(readZipEntries(bundle.zip).map((entry) => [entry.name, entry.data])),
      manifest: bundle.manifest,
      zipSha256: bundle.zipSha256,
    };
  }
  if (!fs.existsSync(sourcePath)) {
    throw new NotFoundError(`graph source not found: ${source}`);
  }
  if (!fs.statSync(sourcePath).isFile()) {
    throw new UsageError("source must be a bundle file or directory containing .mdkg");
  }
  const parsed = parseBundle(sourcePath);
  return {
    kind: "bundle",
    sourcePath,
    entries: parsed.entries,
    manifest: parsed.manifest,
    zipSha256: sha256Buffer(fs.readFileSync(sourcePath)),
  };
}

function resolveTargetRoot(root: string, target: string): string {
  let contained: string;
  try {
    contained = normalizeContainedWorkspacePath(target, "--target");
  } catch (err) {
    throw new UsageError(err instanceof Error ? err.message : String(err));
  }
  const targetRoot = path.resolve(root, contained);
  if (!isInside(root, targetRoot)) {
    throw new UsageError("--target must stay inside the current mdkg root");
  }
  assertTargetPathContainment(root, targetRoot);
  const targetStat = lstatIfPresent(targetRoot);
  if (targetStat) {
    if (!targetStat.isDirectory()) {
      throw new UsageError(`target must be an empty directory or absent: ${rel(root, targetRoot)}`);
    }
    const entries = fs.readdirSync(targetRoot);
    if (entries.length > 0) {
      throw new UsageError(`target must be empty or absent: ${rel(root, targetRoot)}`);
    }
  }
  return targetRoot;
}

function assertSourceNotMutatedByTarget(source: LoadedGraphSource, targetRoot: string): void {
  if (source.kind !== "directory" || !source.sourceRoot) {
    return;
  }
  const sourceRoot = path.resolve(source.sourceRoot);
  if (isInside(sourceRoot, targetRoot)) {
    throw new UsageError("target must not be inside the live directory source");
  }
}

function writeGraphFiles(targetRoot: string, source: LoadedGraphSource): { filesWritten: string[]; skippedPaths: string[] } {
  const filesWritten: string[] = [];
  const skippedPaths: string[] = [];
  for (const file of source.manifest.files) {
    const safeName = safeZipEntryPath(file.path);
    if (file.kind === "generated_index") {
      skippedPaths.push(safeName);
      continue;
    }
    const data = source.entries.get(file.path);
    if (!data) {
      throw new ValidationError(`graph source missing bundled file: ${file.path}`);
    }
    const output = path.join(targetRoot, safeName);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, data);
    filesWritten.push(safeName);
  }
  return { filesWritten: filesWritten.sort(), skippedPaths: skippedPaths.sort() };
}

function indexPathsReceipt(root: string, result: ReturnType<typeof rebuildDerivedIndexCaches>) {
  return {
    nodes: rel(root, result.paths.nodes),
    skills: rel(root, result.paths.skills),
    capabilities: rel(root, result.paths.capabilities),
    subgraphs: rel(root, result.paths.subgraphs),
    sqlite: result.paths.sqlite ? rel(root, result.paths.sqlite) : null,
  };
}

function resolveStartGoal(targetRoot: string, requested: string) {
  const config = loadConfig(targetRoot);
  const index = buildIndex(targetRoot, config);
  const resolved = resolveQid(index, requested, undefined);
  if (resolved.status !== "ok") {
    throw new NotFoundError(formatResolveError("goal", requested, resolved, undefined));
  }
  const node = index.nodes[resolved.qid];
  if (!node || node.type !== "goal") {
    throw new UsageError(`start goal must resolve to a goal: ${requested}`);
  }
  return node;
}

function writeSelectedGoal(targetRoot: string, qid: string, id: string, ws: string): string {
  const statePath = path.join(targetRoot, ".mdkg", "state", "selected-goal.json");
  const state = {
    qid,
    id,
    ws,
    selected_at: new Date().toISOString(),
  };
  atomicWriteFile(statePath, `${JSON.stringify(state, null, 2)}\n`);
  return rel(targetRoot, statePath);
}

function qidForRoot(id: string): string {
  return `root:${id}`;
}

function idFromRootQid(qid: string): string {
  const [workspace, id] = qid.split(":");
  if (workspace !== "root" || !id) {
    throw new UsageError(`invalid root qid: ${qid}`);
  }
  return id;
}

function ensureStatusAllowed(config: ReturnType<typeof loadConfig>, status: string): string {
  const normalized = status.toLowerCase();
  const allowed = new Set(config.work.status_enum.map((value) => value.toLowerCase()));
  if (!allowed.has(normalized)) {
    throw new UsageError(`goal status ${normalized} is not allowed by work.status_enum`);
  }
  return normalized;
}

function isActiveGoalStatus(status?: string, goalState?: string): boolean {
  return status === "progress" && goalState === "active";
}

function isClosedGoalStatus(status?: string, goalState?: string): boolean {
  return status === "done" || status === "archived" || goalState === "achieved" || goalState === "archived";
}

function activeLocalRootGoals(root: string): IndexNode[] {
  const config = loadConfig(root);
  const index = buildIndex(root, config);
  return Object.values(index.nodes)
    .filter((node) => !node.source?.imported)
    .filter((node) => node.ws === "root" && node.type === "goal")
    .filter((node) => isActiveGoalStatus(node.status, String(node.attributes.goal_state ?? "")))
    .sort((a, b) => a.qid.localeCompare(b.qid));
}

function localGoalLifecycleReceipt(
  node: IndexNode,
  status: string,
  goalState: string,
  planned: boolean
): GoalLifecycleReceipt {
  return {
    workspace: node.ws,
    id: node.id,
    qid: node.qid,
    path: node.path,
    previous_status: node.status ?? "",
    previous_goal_state: String(node.attributes.goal_state ?? ""),
    status,
    goal_state: goalState,
    source: "local",
    planned,
  };
}

function importedGoalLifecycleReceipt(
  plan: ImportNodePlan,
  status: string,
  goalState: string,
  planned: boolean
): GoalLifecycleReceipt {
  return {
    workspace: "root",
    id: plan.to_id,
    qid: qidForRoot(plan.to_id),
    path: plan.target_path,
    previous_status: plan.status ?? "",
    previous_goal_state: plan.goal_state ?? "",
    status,
    goal_state: goalState,
    source: "imported",
    planned,
  };
}

function readNodeFile(root: string, nodePath: string): { filePath: string; frontmatter: Record<string, FrontmatterValue>; body: string } {
  const filePath = path.join(root, nodePath);
  const parsed = parseFrontmatter(fs.readFileSync(filePath, "utf8"), nodePath);
  return { filePath, frontmatter: { ...parsed.frontmatter }, body: parsed.body };
}

function writeRenderedNodeFile(filePath: string, frontmatter: Record<string, FrontmatterValue>, body: string): void {
  atomicWriteFile(filePath, renderNode(frontmatter, body));
}

function pauseLocalGoals(root: string, goals: GoalLifecycleReceipt[], config: ReturnType<typeof loadConfig>): void {
  const today = formatDate(new Date());
  for (const goal of goals.filter((item) => item.source === "local")) {
    const loaded = readNodeFile(root, goal.path);
    loaded.frontmatter.status = ensureStatusAllowed(config, "blocked");
    loaded.frontmatter.goal_state = "paused";
    loaded.frontmatter.updated = today;
    writeRenderedNodeFile(loaded.filePath, loaded.frontmatter, loaded.body);
  }
}

function isWorkMarkdownPath(value: string): boolean {
  const normalized = value.replace(/\\/g, "/");
  return normalized.startsWith(".mdkg/work/") && normalized.endsWith(".md");
}

function numericIdPrefix(value: string): string | undefined {
  const match = /^([a-z]+)-([0-9]+)$/.exec(value);
  return match?.[1];
}

function normalizeIdPrefix(value: string): string {
  const normalized = value.trim().toLowerCase();
  if (!/^[a-z][a-z0-9_-]*$/.test(normalized)) {
    throw new UsageError("--id-prefix must start with a letter and use lowercase letters, numbers, underscore, or dash");
  }
  return normalized;
}

function nextNumericId(fromId: string, usedIds: Set<string>): string {
  const prefix = numericIdPrefix(fromId);
  if (!prefix) {
    throw new UsageError(`cannot rewrite non-numeric template id without --id-prefix: ${fromId}`);
  }
  let next = 1;
  while (usedIds.has(`${prefix}-${next}`)) {
    next += 1;
  }
  return `${prefix}-${next}`;
}

function prefixedId(prefix: string, fromId: string, usedIds: Set<string>): string {
  let candidate = `${prefix}-${fromId}`.replace(/[^a-z0-9._-]+/g, "-");
  let suffix = 2;
  while (usedIds.has(candidate)) {
    candidate = `${prefix}-${fromId}-${suffix}`.replace(/[^a-z0-9._-]+/g, "-");
    suffix += 1;
  }
  return candidate;
}

function rewriteStringValue(
  value: string,
  idMap: Map<string, string>,
  pathLabel: string,
  field: string,
  rewrites: RewriteReceipt[]
): string {
  let output = value;
  for (const [fromId, toId] of Array.from(idMap.entries()).sort((a, b) => b[0].length - a[0].length)) {
    const replacements: Array<[RegExp, string, string]> = [
      [new RegExp(`\\broot:${escapeRegExp(fromId)}\\b`, "g"), `root:${toId}`, `root:${fromId}`],
      [
        new RegExp(`(^|[^a-zA-Z0-9._:-])${escapeRegExp(fromId)}(?=$|[^a-zA-Z0-9._:-])`, "g"),
        `$1${toId}`,
        fromId,
      ],
    ];
    for (const [pattern, replacement, loggedFrom] of replacements) {
      let count = 0;
      output = output.replace(pattern, (...args: unknown[]) => {
        count += 1;
        return typeof replacement === "string" ? replacement.replace("$1", String(args[1] ?? "")) : replacement;
      });
      if (count > 0) {
        rewrites.push({
          path: pathLabel,
          field,
          from: loggedFrom,
          to: loggedFrom.startsWith("root:") ? `root:${toId}` : toId,
          count,
        });
      }
    }
  }
  return output;
}

function rewriteFrontmatterValue(
  value: FrontmatterValue,
  idMap: Map<string, string>,
  pathLabel: string,
  field: string,
  rewrites: RewriteReceipt[]
): FrontmatterValue {
  if (Array.isArray(value)) {
    return value.map((item) => rewriteStringValue(item, idMap, pathLabel, field, rewrites));
  }
  if (typeof value === "string") {
    return rewriteStringValue(value, idMap, pathLabel, field, rewrites);
  }
  return value;
}

function targetPathForImport(sourcePath: string, fromId: string, toId: string, usedPaths: Set<string>): string {
  const basename = path.posix.basename(sourcePath);
  const suffix = basename.startsWith(fromId) ? basename.slice(fromId.length) : ".md";
  let candidate = `.mdkg/work/${toId}${suffix}`;
  let count = 2;
  while (usedPaths.has(candidate)) {
    candidate = `.mdkg/work/${toId}-${count}.md`;
    count += 1;
  }
  usedPaths.add(candidate);
  return candidate;
}

function renderNode(frontmatter: Record<string, FrontmatterValue>, body: string): string {
  return ["---", ...formatFrontmatter(frontmatter, DEFAULT_FRONTMATTER_KEY_ORDER), "---", body].join("\n");
}

function requireImportedIdentity(
  sourcePath: string,
  frontmatter: Record<string, FrontmatterValue>
): { id: string; type: string } {
  const id = typeof frontmatter.id === "string" ? frontmatter.id : undefined;
  const type = typeof frontmatter.type === "string" ? frontmatter.type : undefined;
  if (!id || !type) {
    throw new ValidationError(`${sourcePath}: imported node requires string id and type`);
  }
  if (!isCanonicalId(id) && !isPortableId(id)) {
    throw new ValidationError(`${sourcePath}: imported node id is invalid: ${id}`);
  }
  return { id, type };
}

function localIdsAndPaths(root: string): { ids: Set<string>; paths: Set<string> } {
  const config = loadConfig(root);
  const index = buildIndex(root, config);
  return {
    ids: new Set(Object.values(index.nodes).filter((node) => !node.source?.imported).map((node) => node.id)),
    paths: new Set(Object.values(index.nodes).filter((node) => !node.source?.imported).map((node) => node.path)),
  };
}

function planImportTemplate(options: GraphImportTemplateCommandOptions): GraphImportTemplateReceipt {
  if (options.dryRun && options.apply) {
    throw new UsageError("choose either --dry-run or --apply, not both");
  }
  if (options.selectGoal && !options.startGoal) {
    throw new UsageError("--select-goal requires --start-goal <goal-id>");
  }
  const source = loadGraphSource(options.root, options.source);
  const idPrefix = options.idPrefix ? normalizeIdPrefix(options.idPrefix) : undefined;
  const { ids: usedIds, paths: usedPaths } = localIdsAndPaths(options.root);
  const workFiles = source.manifest.files
    .map((file) => safeZipEntryPath(file.path))
    .filter(isWorkMarkdownPath)
    .sort();
  const skippedPaths = source.manifest.files
    .map((file) => safeZipEntryPath(file.path))
    .filter((filePath) => !isWorkMarkdownPath(filePath))
    .sort();
  const imported = workFiles.map((sourcePath) => {
    const data = source.entries.get(sourcePath);
    if (!data) {
      throw new ValidationError(`graph source missing bundled file: ${sourcePath}`);
    }
    const parsed = parseFrontmatter(data.toString("utf8"), sourcePath);
    const { id, type } = requireImportedIdentity(sourcePath, parsed.frontmatter);
    return { sourcePath, parsed, id, type };
  });

  const idMap = new Map<string, string>();
  for (const node of imported) {
    const mustRewrite = usedIds.has(node.id) || Boolean(numericIdPrefix(node.id));
    if (mustRewrite && !numericIdPrefix(node.id) && !idPrefix) {
      throw new UsageError(`cannot rewrite non-numeric template id without --id-prefix: ${node.id}`);
    }
    const toId = mustRewrite
      ? numericIdPrefix(node.id)
        ? nextNumericId(node.id, usedIds)
        : prefixedId(idPrefix!, node.id, usedIds)
      : node.id;
    usedIds.add(toId);
    idMap.set(node.id, toId);
  }

  const rewrittenRefs: RewriteReceipt[] = [];
  const plans: ImportNodePlan[] = imported.map((node) => {
    const toId = idMap.get(node.id) ?? node.id;
    const frontmatter: Record<string, FrontmatterValue> = { ...node.parsed.frontmatter, id: toId };
    for (const [field, value] of Object.entries(frontmatter)) {
      if (field === "id") {
        continue;
      }
      frontmatter[field] = rewriteFrontmatterValue(value, idMap, node.sourcePath, field, rewrittenRefs);
    }
    const body = rewriteStringValue(node.parsed.body, idMap, node.sourcePath, "body", rewrittenRefs);
    const targetPath = targetPathForImport(node.sourcePath, node.id, toId, usedPaths);
    const targetAbs = path.resolve(options.root, targetPath);
    if (fs.existsSync(targetAbs)) {
      throw new UsageError(`import target already exists after rewrite: ${targetPath}`);
    }
    return {
      source_path: node.sourcePath,
      target_path: targetPath,
      from_id: node.id,
      to_id: toId,
      type: node.type,
      status: typeof frontmatter.status === "string" ? frontmatter.status : undefined,
      goal_state: typeof frontmatter.goal_state === "string" ? frontmatter.goal_state : undefined,
      title: typeof frontmatter.title === "string" ? frontmatter.title : undefined,
      content: renderNode(frontmatter, body),
    };
  });

  const startGoalToId = options.startGoal ? (idMap.get(options.startGoal) ?? options.startGoal) : undefined;
  const startGoalPlan = startGoalToId
    ? plans.find((plan) => plan.to_id === startGoalToId && plan.type === "goal")
    : undefined;
  if (options.startGoal && !startGoalPlan) {
    throw new NotFoundError(`start goal not found in imported template graph: ${options.startGoal}`);
  }
  if (options.selectGoal && startGoalPlan && isClosedGoalStatus(startGoalPlan.status, startGoalPlan.goal_state)) {
    throw new UsageError(`cannot select achieved or archived imported start goal: ${options.startGoal}`);
  }

  const localActiveGoals = activeLocalRootGoals(options.root);
  const importedActiveGoals = plans
    .filter((plan) => plan.type === "goal")
    .filter((plan) => isActiveGoalStatus(plan.status, plan.goal_state));
  if (!options.selectGoal && localActiveGoals.length + importedActiveGoals.length > 1) {
    throw new UsageError(
      "import-template would create multiple active root goals; use --select-goal --start-goal <goal-id> or pause active goals before importing"
    );
  }

  const activatedGoal =
    options.selectGoal && startGoalPlan
      ? importedGoalLifecycleReceipt(startGoalPlan, "progress", "active", !options.apply)
      : undefined;
  const pausedGoals =
    options.selectGoal && startGoalPlan
      ? [
          ...localActiveGoals.map((node) => localGoalLifecycleReceipt(node, "blocked", "paused", !options.apply)),
          ...importedActiveGoals
            .filter((plan) => plan.to_id !== startGoalPlan.to_id)
            .map((plan) => importedGoalLifecycleReceipt(plan, "blocked", "paused", !options.apply)),
        ]
      : [];
  const warnings = pausedGoals.length > 0 ? [`paused ${pausedGoals.length} competing active goal(s)`] : [];

  const mode = options.apply ? "import_template_applied" : "import_template_dry_run";
  return {
    action: "graph.import_template",
    ok: true,
    mode,
    source: {
      kind: source.kind,
      path: rel(options.root, source.sourcePath),
      ...(source.sourceRoot ? { source_root: rel(options.root, source.sourceRoot) } : {}),
      profile: source.manifest.profile,
      selected_workspaces: source.manifest.selected_workspaces,
    },
    source_hash: {
      source_tree_hash: source.manifest.source_tree_hash,
      bundle_hash: source.manifest.bundle_hash,
      zip_sha256: source.zipSha256,
    },
    preserved_ids: false,
    rewritten_ids: plans.map((plan) => ({
      from_id: plan.from_id,
      to_id: plan.to_id,
      from_path: plan.source_path,
      to_path: plan.target_path,
      reason: plan.from_id === plan.to_id ? "preserved_non_colliding_id" : "same_repo_import_rewrite",
    })),
    rewritten_refs: rewrittenRefs.sort((a, b) => `${a.path}:${a.field}:${a.from}`.localeCompare(`${b.path}:${b.field}:${b.from}`)),
    planned_paths: plans.map((plan) => plan.target_path).sort(),
    files_written: [],
    skipped_paths: skippedPaths,
    ...(options.startGoal && startGoalToId
      ? { start_goal: { requested: options.startGoal, from_qid: `root:${options.startGoal}`, to_qid: `root:${startGoalToId}` } }
      : {}),
    ...(options.selectGoal && startGoalToId
      ? { selected_goal: { qid: `root:${startGoalToId}`, path: ".mdkg/state/selected-goal.json", planned: !options.apply } }
      : {}),
    ...(activatedGoal ? { activated_goal: activatedGoal } : {}),
    paused_goals: pausedGoals,
    warnings,
  };
}

function applyImportTemplate(
  options: GraphImportTemplateCommandOptions,
  receipt: GraphImportTemplateReceipt
): GraphImportTemplateReceipt {
  const config = loadConfig(options.root);
  return withMutationLock(options.root, config.index.lock_timeout_ms, () => {
    for (const plan of receipt.rewritten_ids) {
      const source = receipt.planned_paths.find((targetPath) => targetPath === plan.to_path);
      if (!source) {
        throw new UsageError(`import plan missing target path for ${plan.from_id}`);
      }
    }
    const source = loadGraphSource(options.root, options.source);
    const idPrefix = options.idPrefix ? normalizeIdPrefix(options.idPrefix) : undefined;
    const applyPlan = planImportTemplate({ ...options, apply: true, dryRun: false, idPrefix });
    const files = applyPlan.planned_paths;
    const workFiles = source.manifest.files
      .map((file) => safeZipEntryPath(file.path))
      .filter(isWorkMarkdownPath)
      .sort();
    const contentByTarget = new Map<string, string>();
    const { ids: usedIds, paths: usedPaths } = localIdsAndPaths(options.root);
    const imported = workFiles.map((sourcePath) => {
      const data = source.entries.get(sourcePath);
      if (!data) {
        throw new ValidationError(`graph source missing bundled file: ${sourcePath}`);
      }
      const parsed = parseFrontmatter(data.toString("utf8"), sourcePath);
      const { id } = requireImportedIdentity(sourcePath, parsed.frontmatter);
      return { sourcePath, parsed, id };
    });
    const idMap = new Map<string, string>();
    for (const node of imported) {
      const mustRewrite = usedIds.has(node.id) || Boolean(numericIdPrefix(node.id));
      if (mustRewrite && !numericIdPrefix(node.id) && !idPrefix) {
        throw new UsageError(`cannot rewrite non-numeric template id without --id-prefix: ${node.id}`);
      }
      const toId = mustRewrite
        ? numericIdPrefix(node.id)
          ? nextNumericId(node.id, usedIds)
          : prefixedId(idPrefix!, node.id, usedIds)
        : node.id;
      usedIds.add(toId);
      idMap.set(node.id, toId);
    }
    const ignoredRewrites: RewriteReceipt[] = [];
    for (const node of imported) {
      const toId = idMap.get(node.id) ?? node.id;
      const frontmatter: Record<string, FrontmatterValue> = { ...node.parsed.frontmatter, id: toId };
      for (const [field, value] of Object.entries(frontmatter)) {
        if (field === "id") {
          continue;
        }
        frontmatter[field] = rewriteFrontmatterValue(value, idMap, node.sourcePath, field, ignoredRewrites);
      }
      const body = rewriteStringValue(node.parsed.body, idMap, node.sourcePath, "body", ignoredRewrites);
      if (frontmatter.type === "goal" && options.selectGoal) {
        if (qidForRoot(toId) === applyPlan.activated_goal?.qid) {
          frontmatter.status = ensureStatusAllowed(config, "progress");
          frontmatter.goal_state = "active";
        } else if (isActiveGoalStatus(String(frontmatter.status ?? ""), String(frontmatter.goal_state ?? ""))) {
          frontmatter.status = ensureStatusAllowed(config, "blocked");
          frontmatter.goal_state = "paused";
        }
        frontmatter.updated = formatDate(new Date());
      }
      const targetPath = targetPathForImport(node.sourcePath, node.id, toId, usedPaths);
      contentByTarget.set(targetPath, renderNode(frontmatter, body));
    }
    for (const targetPath of files) {
      withContainedPathSink(
        { root: options.root, relativePath: targetPath, operation: "create", createParents: true },
        () => undefined
      );
    }
    for (const targetPath of files) {
      const content = contentByTarget.get(targetPath);
      if (!content) {
        throw new UsageError(`import plan content missing for ${targetPath}`);
      }
      writeContainedFileExclusive({ root: options.root, relativePath: targetPath }, content);
    }
    pauseLocalGoals(options.root, applyPlan.paused_goals, config);
    const indexReceipt = rebuildDerivedIndexCaches({ root: options.root });
    const validation = collectValidateReceipt({ root: options.root, quiet: true });
    if (validation.error_count > 0) {
      throw new ValidationError(`imported graph validation failed with ${validation.error_count} error(s)`);
    }
    if (options.selectGoal && options.startGoal) {
      const selected = applyPlan.selected_goal?.qid;
      if (!selected) {
        throw new UsageError("--select-goal could not resolve imported start goal");
      }
      const id = idFromRootQid(selected);
      writeSelectedGoal(options.root, selected, id, "root");
      applyPlan.selected_goal = { qid: selected, path: ".mdkg/state/selected-goal.json", planned: false };
      if (applyPlan.activated_goal) {
        applyPlan.activated_goal.planned = false;
      }
      applyPlan.paused_goals = applyPlan.paused_goals.map((goal) => ({ ...goal, planned: false }));
    }
    return {
      ...applyPlan,
      files_written: files,
      index: {
        rebuilt: true,
        paths: indexPathsReceipt(options.root, indexReceipt),
      },
      validation,
    };
  });
}

function runGraphTransport(options: GraphForkCommandOptions, mode: GraphTransportMode): GraphTransportReceipt {
  const source = loadGraphSource(options.root, options.source);
  const targetRoot = resolveTargetRoot(options.root, options.target);
  assertSourceNotMutatedByTarget(source, targetRoot);
  const warnings: string[] = [];

  fs.mkdirSync(targetRoot, { recursive: true });
  const { filesWritten, skippedPaths } = writeGraphFiles(targetRoot, source);
  const indexReceipt = rebuildDerivedIndexCaches({ root: targetRoot });
  let validation = collectValidateReceipt({ root: targetRoot, quiet: true });
  if (validation.error_count > 0) {
    throw new ValidationError(`cloned graph validation failed with ${validation.error_count} error(s)`);
  }

  let startGoal: GraphTransportReceipt["start_goal"];
  let selectedGoal: GraphTransportReceipt["selected_goal"];
  if (mode === "fork" && options.startGoal) {
    const node = resolveStartGoal(targetRoot, options.startGoal);
    const statePath = writeSelectedGoal(targetRoot, node.qid, node.id, node.ws);
    startGoal = {
      requested: options.startGoal,
      qid: node.qid,
      path: node.path,
    };
    selectedGoal = {
      qid: node.qid,
      path: statePath,
    };
    validation = collectValidateReceipt({ root: targetRoot, quiet: true });
    if (validation.error_count > 0) {
      throw new ValidationError(`forked graph validation failed with ${validation.error_count} error(s)`);
    }
  } else if (mode === "clone" && options.startGoal) {
    warnings.push("--start-goal is ignored by graph clone; use graph fork for start-goal selection");
  }

  return {
    action: mode === "clone" ? "graph.clone" : "graph.fork",
    ok: true,
    mode,
    source: {
      kind: source.kind,
      path: rel(options.root, source.sourcePath),
      ...(source.sourceRoot ? { source_root: rel(options.root, source.sourceRoot) } : {}),
      profile: source.manifest.profile,
      selected_workspaces: source.manifest.selected_workspaces,
    },
    target: rel(options.root, targetRoot),
    source_hash: {
      source_tree_hash: source.manifest.source_tree_hash,
      bundle_hash: source.manifest.bundle_hash,
      zip_sha256: source.zipSha256,
    },
    preserved_ids: true,
    files_written: filesWritten,
    skipped_paths: skippedPaths,
    ...(startGoal ? { start_goal: startGoal } : {}),
    ...(selectedGoal ? { selected_goal: selectedGoal } : {}),
    index: {
      rebuilt: true,
      paths: indexPathsReceipt(targetRoot, indexReceipt),
    },
    validation,
    warnings,
  };
}

function printReceipt(receipt: GraphTransportReceipt, json?: boolean): void {
  if (json) {
    writeJson(receipt);
    return;
  }
  console.log(`${receipt.action}: ${receipt.target}`);
  console.log(`source: ${receipt.source.path}`);
  console.log(`files: ${receipt.files_written.length}`);
  console.log(`preserved_ids: ${receipt.preserved_ids}`);
  if (receipt.start_goal) {
    console.log(`start_goal: ${receipt.start_goal.qid}`);
  }
  if (receipt.warnings.length > 0) {
    console.log(`warnings: ${receipt.warnings.length}`);
  }
}

export function runGraphCloneCommand(options: GraphCloneCommandOptions): void {
  printReceipt(runGraphTransport(options, "clone"), options.json);
}

export function runGraphForkCommand(options: GraphForkCommandOptions): void {
  printReceipt(runGraphTransport(options, "fork"), options.json);
}

export function runGraphImportTemplateCommand(options: GraphImportTemplateCommandOptions): void {
  const plan = planImportTemplate(options);
  const receipt = options.apply ? applyImportTemplate(options, plan) : plan;
  if (options.json) {
    writeJson(receipt);
    return;
  }
  console.log(`${receipt.action}: ${receipt.mode}`);
  console.log(`source: ${receipt.source.path}`);
  console.log(`planned_paths: ${receipt.planned_paths.length}`);
  console.log(`rewritten_ids: ${receipt.rewritten_ids.filter((item) => item.from_id !== item.to_id).length}`);
  if (receipt.selected_goal) {
    console.log(`selected_goal: ${receipt.selected_goal.qid}${receipt.selected_goal.planned ? " (planned)" : ""}`);
  }
}

export function runGraphRefsCommand(options: GraphRefsCommandOptions): void {
  const config = loadConfig(options.root);
  const { index, warnings } = loadIndex({ root: options.root, config });
  const resolved = resolveQid(index, options.id, options.ws);
  if (resolved.status !== "ok") {
    throw new NotFoundError(formatResolveError("node", options.id, resolved, options.ws));
  }
  const node = index.nodes[resolved.qid];
  if (!node) {
    throw new NotFoundError(`node not found: ${options.id}`);
  }
  const receipt = buildGraphRefsReceipt(index, node, warnings);
  if (options.json) {
    writeJson(receipt);
    return;
  }
  console.log(`graph refs: ${node.qid}`);
  if (node.source?.imported) {
    console.log(`source: subgraph:${node.source.subgraph_alias} read-only`);
  }
  for (const [direction, lanes] of Object.entries({ outgoing: receipt.outgoing, incoming: receipt.incoming })) {
    console.log(`${direction}:`);
    for (const [lane, refs] of Object.entries(lanes)) {
      if (refs.length === 0) {
        continue;
      }
      console.log(`  ${lane}:`);
      for (const ref of refs) {
        const target = ref.node
          ? `${ref.node.qid}${ref.node.read_only ? " (read-only)" : ""}`
          : ref.ref;
        console.log(`    - ${target}`);
      }
    }
  }
  for (const warning of warnings) {
    console.error(`warning: ${warning}`);
  }
}
