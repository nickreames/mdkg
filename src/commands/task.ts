import fs from "fs";
import path from "path";
import { loadConfig } from "../core/config";
import { buildIndex, Index } from "../graph/indexer";
import { loadIndex, writeIndex } from "../graph/index_cache";
import {
  DEFAULT_FRONTMATTER_KEY_ORDER,
  formatFrontmatter,
  FrontmatterValue,
  parseFrontmatter,
} from "../graph/frontmatter";
import { buildSkillsIndex } from "../graph/skills_indexer";
import { formatDate } from "../util/date";
import { NotFoundError, UsageError } from "../util/errors";
import { formatResolveError, resolveQid } from "../util/qid";
import { isCanonicalId, isCanonicalIdRef } from "../util/id";
import { appendAutomaticEvent } from "./event_support";
import { runCheckpointNewCommand } from "./checkpoint";

const MUTABLE_TASK_TYPES = new Set(["task", "bug", "test"]);
const SKILL_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type TaskStartCommandOptions = {
  root: string;
  id: string;
  ws?: string;
  runId?: string;
  note?: string;
  now?: Date;
};

export type TaskUpdateCommandOptions = {
  root: string;
  id: string;
  ws?: string;
  status?: string;
  priority?: number;
  addArtifacts?: string;
  addLinks?: string;
  addRefs?: string;
  addSkills?: string;
  addTags?: string;
  addBlockedBy?: string;
  clearBlockedBy?: boolean;
  runId?: string;
  note?: string;
  now?: Date;
};

export type TaskDoneCommandOptions = {
  root: string;
  id: string;
  ws?: string;
  addArtifacts?: string;
  addLinks?: string;
  addRefs?: string;
  checkpoint?: string;
  runId?: string;
  note?: string;
  now?: Date;
};

type LoadedTaskNode = {
  config: ReturnType<typeof loadConfig>;
  index: Index;
  qid: string;
  ws: string;
  id: string;
  type: string;
  filePath: string;
  frontmatter: Record<string, FrontmatterValue>;
  body: string;
};

function parseCsvList(raw?: string): string[] {
  if (!raw) {
    return [];
  }
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function normalizeWorkspace(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }
  const normalized = value.toLowerCase();
  if (normalized === "all") {
    throw new UsageError("--ws all is not valid here");
  }
  return normalized;
}

function normalizeId(value: string, flag: string): string {
  const normalized = value.trim().toLowerCase();
  if (!isCanonicalId(normalized)) {
    throw new UsageError(`${flag} entries must match <prefix>-<number> or reserved id: ${value}`);
  }
  return normalized;
}

function normalizeIdRef(value: string, flag: string): string {
  const normalized = value.trim().toLowerCase();
  if (!isCanonicalIdRef(normalized)) {
    throw new UsageError(`${flag} entries must match <id> or <ws>:<id>: ${value}`);
  }
  return normalized;
}

function normalizeLowercaseList(raw?: string): string[] {
  return parseCsvList(raw).map((value) => value.toLowerCase());
}

function normalizeIdList(raw: string | undefined, flag: string): string[] {
  return parseCsvList(raw).map((value) => normalizeId(value, flag));
}

function normalizeIdRefList(raw: string | undefined, flag: string): string[] {
  return parseCsvList(raw).map((value) => normalizeIdRef(value, flag));
}

function normalizeSkillList(raw?: string): string[] {
  return parseCsvList(raw).map((value) => {
    const normalized = value.toLowerCase();
    if (!SKILL_SLUG_RE.test(normalized)) {
      throw new UsageError(`--add-skills entries must be kebab-case: ${value}`);
    }
    return normalized;
  });
}

function appendUnique(existing: string[], additions: string[]): string[] {
  const next = [...existing];
  const seen = new Set(existing);
  for (const value of additions) {
    if (!seen.has(value)) {
      next.push(value);
      seen.add(value);
    }
  }
  return next;
}

function toStringList(value: FrontmatterValue | undefined): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }
  return [];
}

function maybeReindex(root: string, config: ReturnType<typeof loadConfig>): void {
  if (!config.index.auto_reindex) {
    return;
  }
  const outputPath = path.resolve(root, config.index.global_index_path);
  writeIndex(outputPath, buildIndex(root, config, { tolerant: config.index.tolerant }));
}

function loadMutableTaskNode(root: string, idOrQid: string, wsHint?: string): LoadedTaskNode {
  const config = loadConfig(root);
  const { index } = loadIndex({ root, config });
  const resolved = resolveQid(index, idOrQid, normalizeWorkspace(wsHint));
  if (resolved.status !== "ok") {
    throw new NotFoundError(formatResolveError("task", idOrQid, resolved, normalizeWorkspace(wsHint)));
  }
  const node = index.nodes[resolved.qid];
  if (!node) {
    throw new NotFoundError(`task not found: ${idOrQid}`);
  }
  if (!MUTABLE_TASK_TYPES.has(node.type)) {
    throw new UsageError(
      `mdkg task only supports task, bug, and test nodes; use markdown editing for ${node.type}:${node.id}`
    );
  }

  const filePath = path.resolve(root, node.path);
  const content = fs.readFileSync(filePath, "utf8");
  const parsed = parseFrontmatter(content, filePath);
  return {
    config,
    index,
    qid: node.qid,
    ws: node.ws,
    id: node.id,
    type: node.type,
    filePath,
    frontmatter: { ...parsed.frontmatter },
    body: parsed.body,
  };
}

function writeNodeFile(
  root: string,
  filePath: string,
  frontmatter: Record<string, FrontmatterValue>,
  body: string
): void {
  const lines = formatFrontmatter(frontmatter, DEFAULT_FRONTMATTER_KEY_ORDER);
  const frontmatterBlock = ["---", ...lines, "---"].join("\n");
  const content = body.length > 0 ? `${frontmatterBlock}\n${body}` : frontmatterBlock;
  fs.writeFileSync(filePath, content, "utf8");
}

function ensureStatusAllowed(
  config: ReturnType<typeof loadConfig>,
  statusRaw: string,
  flag = "--status"
): string {
  const normalized = statusRaw.trim().toLowerCase();
  const allowed = new Set(config.work.status_enum.map((value) => value.toLowerCase()));
  if (!allowed.has(normalized)) {
    throw new UsageError(`${flag} must be one of ${Array.from(allowed).join(", ")}`);
  }
  return normalized;
}

function ensurePriorityAllowed(config: ReturnType<typeof loadConfig>, priority: number): number {
  if (
    !Number.isInteger(priority) ||
    priority < config.work.priority_min ||
    priority > config.work.priority_max
  ) {
    throw new UsageError(
      `--priority must be between ${config.work.priority_min} and ${config.work.priority_max}`
    );
  }
  return priority;
}

function ensureNodeRefsExist(index: Index, values: string[], ws: string, label: string): void {
  for (const value of values) {
    const resolved = resolveQid(index, value, ws);
    if (resolved.status !== "ok") {
      throw new NotFoundError(formatResolveError(label, value, resolved, ws));
    }
  }
}

function ensureSkillsExist(root: string, node: LoadedTaskNode, slugs: string[]): void {
  if (slugs.length === 0) {
    return;
  }
  const skillsIndex = buildSkillsIndex(root, node.config);
  for (const slug of slugs) {
    if (!skillsIndex.skills[slug]) {
      throw new NotFoundError(`skill not found: ${slug}`);
    }
  }
}

function updateUpdatedDate(
  frontmatter: Record<string, FrontmatterValue>,
  now: Date
): void {
  frontmatter.updated = formatDate(now);
}

export function runTaskStartCommand(options: TaskStartCommandOptions): void {
  const loaded = loadMutableTaskNode(options.root, options.id, options.ws);
  const now = options.now ?? new Date();
  loaded.frontmatter.status = ensureStatusAllowed(loaded.config, "progress");
  updateUpdatedDate(loaded.frontmatter, now);
  writeNodeFile(options.root, loaded.filePath, loaded.frontmatter, loaded.body);
  maybeReindex(options.root, loaded.config);

  appendAutomaticEvent({
    root: options.root,
    ws: loaded.ws,
    kind: "TASK_STARTED",
    status: "ok",
    refs: [loaded.id],
    notes: options.note ?? `status set to progress via mdkg task start`,
    runId: options.runId,
    now,
  });

  console.log(`task started: ${loaded.qid}`);
}

export function runTaskUpdateCommand(options: TaskUpdateCommandOptions): void {
  const loaded = loadMutableTaskNode(options.root, options.id, options.ws);
  const now = options.now ?? new Date();

  if (options.status) {
    loaded.frontmatter.status = ensureStatusAllowed(loaded.config, options.status);
  }
  if (options.priority !== undefined) {
    loaded.frontmatter.priority = String(ensurePriorityAllowed(loaded.config, options.priority));
  }

  const nextLinks = appendUnique(toStringList(loaded.frontmatter.links), parseCsvList(options.addLinks));
  const nextArtifacts = appendUnique(
    toStringList(loaded.frontmatter.artifacts),
    parseCsvList(options.addArtifacts)
  );
  const nextRefs = appendUnique(toStringList(loaded.frontmatter.refs), normalizeIdList(options.addRefs, "--add-refs"));
  const nextTags = appendUnique(toStringList(loaded.frontmatter.tags), normalizeLowercaseList(options.addTags));
  const nextSkills = appendUnique(
    toStringList(loaded.frontmatter.skills),
    normalizeSkillList(options.addSkills)
  );
  const blockedByAdditions = normalizeIdRefList(options.addBlockedBy, "--add-blocked-by");
  ensureNodeRefsExist(loaded.index, blockedByAdditions, loaded.ws, "blocked_by");
  const nextBlockedBy = options.clearBlockedBy
    ? blockedByAdditions
    : appendUnique(toStringList(loaded.frontmatter.blocked_by), blockedByAdditions);

  ensureSkillsExist(options.root, loaded, nextSkills);

  loaded.frontmatter.links = nextLinks;
  loaded.frontmatter.artifacts = nextArtifacts;
  loaded.frontmatter.refs = nextRefs;
  loaded.frontmatter.tags = nextTags;
  loaded.frontmatter.skills = nextSkills;
  loaded.frontmatter.blocked_by = nextBlockedBy;
  updateUpdatedDate(loaded.frontmatter, now);

  writeNodeFile(options.root, loaded.filePath, loaded.frontmatter, loaded.body);
  maybeReindex(options.root, loaded.config);

  appendAutomaticEvent({
    root: options.root,
    ws: loaded.ws,
    kind: "TASK_UPDATED",
    status: "ok",
    refs: [loaded.id],
    artifacts: nextArtifacts,
    notes: options.note ?? `task metadata updated via mdkg task update`,
    runId: options.runId,
    now,
  });

  console.log(`task updated: ${loaded.qid}`);
}

export function runTaskDoneCommand(options: TaskDoneCommandOptions): void {
  const loaded = loadMutableTaskNode(options.root, options.id, options.ws);
  const now = options.now ?? new Date();

  const nextLinks = appendUnique(toStringList(loaded.frontmatter.links), parseCsvList(options.addLinks));
  const nextArtifacts = appendUnique(
    toStringList(loaded.frontmatter.artifacts),
    parseCsvList(options.addArtifacts)
  );
  const nextRefs = appendUnique(toStringList(loaded.frontmatter.refs), normalizeIdList(options.addRefs, "--add-refs"));

  loaded.frontmatter.status = ensureStatusAllowed(loaded.config, "done");
  loaded.frontmatter.links = nextLinks;
  loaded.frontmatter.artifacts = nextArtifacts;
  loaded.frontmatter.refs = nextRefs;
  updateUpdatedDate(loaded.frontmatter, now);

  writeNodeFile(options.root, loaded.filePath, loaded.frontmatter, loaded.body);

  appendAutomaticEvent({
    root: options.root,
    ws: loaded.ws,
    kind: "TASK_DONE",
    status: "ok",
    refs: [loaded.id],
    artifacts: nextArtifacts,
    notes: options.note ?? `status set to done via mdkg task done`,
    runId: options.runId,
    now,
  });

  if (options.checkpoint) {
    runCheckpointNewCommand({
      root: options.root,
      title: options.checkpoint,
      ws: loaded.ws,
      relates: loaded.id,
      scope: loaded.id,
      runId: options.runId,
      note: `checkpoint created from mdkg task done for ${loaded.id}`,
      now,
    });
  }

  maybeReindex(options.root, loaded.config);
  console.log(`task done: ${loaded.qid}`);
}
