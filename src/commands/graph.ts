import fs from "fs";
import path from "path";
import { buildBundle, BundleManifest, parseBundle, sha256Buffer } from "./bundle";
import { rebuildDerivedIndexCaches } from "./index";
import { collectValidateReceipt, ValidateReceipt } from "./validate";
import { loadConfig } from "../core/config";
import { normalizeContainedWorkspacePath } from "../core/workspace_path";
import { buildIndex } from "../graph/indexer";
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
  index?: {
    rebuilt: boolean;
    paths: Record<string, string | null>;
  };
  validation?: ValidateReceipt;
  warnings: string[];
};

function writeJson(value: unknown): void {
  console.log(JSON.stringify(value, null, 2));
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
  if (fs.existsSync(targetRoot)) {
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
    const id = typeof parsed.frontmatter.id === "string" ? parsed.frontmatter.id : undefined;
    const type = typeof parsed.frontmatter.type === "string" ? parsed.frontmatter.type : undefined;
    if (!id || !type) {
      throw new ValidationError(`${sourcePath}: imported node requires string id and type`);
    }
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
      title: typeof frontmatter.title === "string" ? frontmatter.title : undefined,
      content: renderNode(frontmatter, body),
    };
  });

  const startGoalToId = options.startGoal ? (idMap.get(options.startGoal) ?? options.startGoal) : undefined;
  if (options.startGoal && !plans.some((plan) => plan.to_id === startGoalToId && plan.type === "goal")) {
    throw new NotFoundError(`start goal not found in imported template graph: ${options.startGoal}`);
  }

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
    warnings: [],
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
      const id = String(parsed.frontmatter.id);
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
      const targetPath = targetPathForImport(node.sourcePath, node.id, toId, usedPaths);
      contentByTarget.set(targetPath, renderNode(frontmatter, body));
    }
    for (const targetPath of files) {
      const content = contentByTarget.get(targetPath);
      if (!content) {
        throw new UsageError(`import plan content missing for ${targetPath}`);
      }
      const targetAbs = path.resolve(options.root, targetPath);
      fs.mkdirSync(path.dirname(targetAbs), { recursive: true });
      atomicWriteFile(targetAbs, content);
    }
    const indexReceipt = rebuildDerivedIndexCaches({ root: options.root });
    if (options.selectGoal && options.startGoal) {
      const selected = applyPlan.selected_goal?.qid;
      if (!selected) {
        throw new UsageError("--select-goal could not resolve imported start goal");
      }
      const [, id] = selected.split(":");
      if (!id) {
        throw new UsageError(`invalid selected goal qid: ${selected}`);
      }
      writeSelectedGoal(options.root, selected, id, "root");
      applyPlan.selected_goal = { qid: selected, path: ".mdkg/state/selected-goal.json", planned: false };
    }
    const validation = collectValidateReceipt({ root: options.root, quiet: true });
    if (validation.error_count > 0) {
      throw new ValidationError(`imported graph validation failed with ${validation.error_count} error(s)`);
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
