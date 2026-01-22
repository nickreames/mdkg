import fs from "fs";
import path from "path";
import { loadConfig } from "../core/config";
import { loadIndex, writeIndex } from "../graph/index_cache";
import { ALLOWED_TYPES, WORK_TYPES } from "../graph/node";
import { buildIndex, Index } from "../graph/indexer";
import { loadTemplate, renderTemplate } from "../templates/loader";
import { formatDate } from "../util/date";
import { NotFoundError, UsageError } from "../util/errors";
import { formatResolveError, resolveQid } from "../util/qid";

export type NewCommandOptions = {
  root: string;
  type: string;
  title: string;
  ws?: string;
  status?: string;
  priority?: number;
  epic?: string;
  parent?: string;
  prev?: string;
  next?: string;
  relates?: string;
  blockedBy?: string;
  blocks?: string;
  links?: string;
  artifacts?: string;
  refs?: string;
  aliases?: string;
  tags?: string;
  owners?: string;
  cases?: string;
  supersedes?: string;
  template?: string;
  noCache?: boolean;
  noReindex?: boolean;
  now?: Date;
};

const ID_RE = /^[a-z]+-[0-9]+$/;
const ID_REF_RE = /^([a-z][a-z0-9_]*:)?[a-z]+-[0-9]+$/;
const DEC_ID_RE = /^dec-[0-9]+$/;
const DEC_STATUS = new Set(["proposed", "accepted", "rejected", "superseded"]);
const CORE_TYPES = new Set(["rule"]);
const DESIGN_TYPES = new Set(["prd", "edd", "dec", "prop"]);

function parseCsvList(raw?: string): string[] {
  if (!raw) {
    return [];
  }
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function normalizeId(value: string, key: string): string {
  const normalized = value.toLowerCase();
  if (!ID_RE.test(normalized) && normalized !== "rule-guide") {
    throw new UsageError(`${key} entries must match <prefix>-<number>: ${value}`);
  }
  return normalized;
}

function normalizeIdRef(value: string, key: string): string {
  const normalized = value.toLowerCase();
  if (!ID_REF_RE.test(normalized)) {
    throw new UsageError(`${key} entries must match <id> or <ws>:<id>: ${value}`);
  }
  return normalized;
}

function normalizeList(raw: string | undefined): string[] {
  return parseCsvList(raw);
}

function normalizeLowercaseList(raw: string | undefined): string[] {
  return parseCsvList(raw).map((value) => value.toLowerCase());
}

function normalizeIdList(raw: string | undefined, key: string): string[] {
  return parseCsvList(raw).map((value) => normalizeId(value, key));
}

function normalizeIdRefList(raw: string | undefined, key: string): string[] {
  return parseCsvList(raw).map((value) => normalizeIdRef(value, key));
}

function normalizeWorkspace(value?: string): string {
  if (!value) {
    return "root";
  }
  const normalized = value.toLowerCase();
  if (normalized === "all") {
    throw new UsageError("--ws all is not valid for creation");
  }
  return normalized;
}

function slugifyTitle(title: string): string {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");

  if (!slug) {
    return "node";
  }

  const maxLen = 80;
  return slug.length > maxLen ? slug.slice(0, maxLen).replace(/-+$/g, "") : slug;
}

function nextIdForPrefix(index: Record<string, { ws: string; id: string }>, ws: string, prefix: string): string {
  let max = 0;
  const pattern = new RegExp(`^${prefix}-(\\d+)$`);
  for (const node of Object.values(index)) {
    if (node.ws !== ws) {
      continue;
    }
    const match = pattern.exec(node.id);
    if (!match) {
      continue;
    }
    const parsed = Number.parseInt(match[1] ?? "", 10);
    if (Number.isInteger(parsed) && parsed > max) {
      max = parsed;
    }
  }
  return `${prefix}-${max + 1}`;
}

function idPrefixForType(type: string): string {
  if (type === "checkpoint") {
    return "chk";
  }
  return type;
}

function folderForType(type: string): string {
  if (CORE_TYPES.has(type)) {
    return "core";
  }
  if (DESIGN_TYPES.has(type)) {
    return "design";
  }
  if (WORK_TYPES.has(type)) {
    return "work";
  }
  throw new UsageError(`unsupported type: ${type}`);
}

function ensureExists(index: Index, value: string, ws: string, label: string): void {
  const resolved = resolveQid(index, value, ws);
  if (resolved.status !== "ok") {
    throw new NotFoundError(formatResolveError(label, value, resolved, ws));
  }
}

export function runNewCommand(options: NewCommandOptions): void {
  const title = options.title.trim();
  if (!title) {
    throw new UsageError("title cannot be empty");
  }

  const type = options.type.toLowerCase();
  if (!ALLOWED_TYPES.has(type)) {
    throw new UsageError(`type must be one of ${Array.from(ALLOWED_TYPES).join(", ")}`);
  }

  const config = loadConfig(options.root);
  const ws = normalizeWorkspace(options.ws);
  if (!config.workspaces[ws]) {
    throw new NotFoundError(`workspace not found: ${ws}`);
  }

  const noCache = Boolean(options.noCache);
  const noReindex = Boolean(options.noReindex);
  const { index } = loadIndex({
    root: options.root,
    config,
    useCache: !noCache,
    allowReindex: !noReindex,
  });

  const prefix = idPrefixForType(type);
  const id = nextIdForPrefix(index.nodes, ws, prefix);
  const slug = slugifyTitle(title);
  const fileName = `${id}-${slug}.md`;

  const wsEntry = config.workspaces[ws];
  const folder = folderForType(type);
  const targetDir = path.resolve(options.root, wsEntry.path, wsEntry.mdkg_dir, folder);
  const filePath = path.join(targetDir, fileName);
  if (fs.existsSync(filePath)) {
    throw new UsageError(`node already exists: ${path.relative(options.root, filePath)}`);
  }

  const statusInput = options.status?.toLowerCase();
  let status: string | undefined;
  if (WORK_TYPES.has(type)) {
    const allowed = new Set(config.work.status_enum.map((value) => value.toLowerCase()));
    status = statusInput ?? config.work.status_enum[0]?.toLowerCase();
    if (!status || !allowed.has(status)) {
      throw new UsageError(`--status must be one of ${Array.from(allowed).join(", ")}`);
    }
  } else if (type === "dec") {
    status = statusInput ?? "proposed";
    if (!DEC_STATUS.has(status)) {
      throw new UsageError(`--status must be one of ${Array.from(DEC_STATUS).join(", ")}`);
    }
  } else if (statusInput) {
    throw new UsageError("--status is only valid for work items and decisions");
  }

  let priority: number | undefined;
  if (WORK_TYPES.has(type)) {
    if (options.priority !== undefined) {
      priority = options.priority;
    } else {
      priority = config.work.priority_max;
    }
    if (!Number.isInteger(priority) || priority < config.work.priority_min || priority > config.work.priority_max) {
      throw new UsageError(
        `--priority must be between ${config.work.priority_min} and ${config.work.priority_max}`
      );
    }
  } else if (options.priority !== undefined) {
    throw new UsageError("--priority is only valid for work items");
  }

  if (!WORK_TYPES.has(type)) {
    if (options.epic || options.parent || options.prev || options.next || options.blockedBy || options.blocks) {
      throw new UsageError("epic/parent/prev/next/blocked-by/blocks are only valid for work items");
    }
  }
  if (options.cases && type !== "test") {
    throw new UsageError("--cases is only valid for test nodes");
  }

  const epic = options.epic ? normalizeIdRef(options.epic, "--epic") : undefined;
  const parent = options.parent ? normalizeIdRef(options.parent, "--parent") : undefined;
  const prev = options.prev ? normalizeIdRef(options.prev, "--prev") : undefined;
  const next = options.next ? normalizeIdRef(options.next, "--next") : undefined;

  const relates = normalizeIdRefList(options.relates, "--relates");
  const blockedBy = normalizeIdRefList(options.blockedBy, "--blocked-by");
  const blocks = normalizeIdRefList(options.blocks, "--blocks");
  const refs = normalizeIdList(options.refs, "--refs");
  const aliases = normalizeLowercaseList(options.aliases);
  const tags = normalizeLowercaseList(options.tags);
  const owners = normalizeLowercaseList(options.owners);
  const cases = normalizeLowercaseList(options.cases);
  const links = normalizeList(options.links);
  const artifacts = normalizeList(options.artifacts);

  if (type === "dec" && options.supersedes) {
    const supersedes = options.supersedes.toLowerCase();
    if (!DEC_ID_RE.test(supersedes)) {
      throw new UsageError("--supersedes must be a dec-# id");
    }
  } else if (options.supersedes && type !== "dec") {
    throw new UsageError("--supersedes is only valid for dec records");
  }

  const idRefsToCheck: Array<[string, string]> = [];
  if (epic) {
    idRefsToCheck.push(["epic", epic]);
  }
  if (parent) {
    idRefsToCheck.push(["parent", parent]);
  }
  if (prev) {
    idRefsToCheck.push(["prev", prev]);
  }
  if (next) {
    idRefsToCheck.push(["next", next]);
  }
  for (const value of relates) {
    idRefsToCheck.push(["relates", value]);
  }
  for (const value of blockedBy) {
    idRefsToCheck.push(["blocked_by", value]);
  }
  for (const value of blocks) {
    idRefsToCheck.push(["blocks", value]);
  }

  for (const [label, value] of idRefsToCheck) {
    ensureExists(index, value, ws, label);
  }

  const today = formatDate(options.now ?? new Date());
  const template = loadTemplate(options.root, config, type, options.template);
  const content = renderTemplate(template, {
    id,
    type,
    title,
    status,
    priority,
    epic,
    parent,
    prev,
    next,
    relates: relates.length > 0 ? relates : undefined,
    blocked_by: blockedBy.length > 0 ? blockedBy : undefined,
    blocks: blocks.length > 0 ? blocks : undefined,
    tags: tags.length > 0 ? tags : undefined,
    owners: owners.length > 0 ? owners : undefined,
    links: links.length > 0 ? links : undefined,
    artifacts: artifacts.length > 0 ? artifacts : undefined,
    refs: refs.length > 0 ? refs : undefined,
    aliases: aliases.length > 0 ? aliases : undefined,
    cases: cases.length > 0 ? cases : undefined,
    supersedes: options.supersedes ? options.supersedes.toLowerCase() : undefined,
    created: today,
    updated: today,
  });

  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");

  if (config.index.auto_reindex && !noReindex) {
    const updatedIndex = buildIndex(options.root, config, { tolerant: config.index.tolerant });
    const outputPath = path.resolve(options.root, config.index.global_index_path);
    writeIndex(outputPath, updatedIndex);
  }

  console.log(`node created: ${ws}:${id} (${path.relative(options.root, filePath)})`);
}
