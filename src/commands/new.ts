import fs from "fs";
import path from "path";
import { loadConfig, Config } from "../core/config";
import { loadIndex } from "../graph/index_cache";
import { ALLOWED_TYPES, WORK_TYPES } from "../graph/node";
import { isAgentFileType, AGENT_FILE_BASENAMES } from "../graph/agent_file_types";
import { buildIndex, Index } from "../graph/indexer";
import { loadTemplate, renderTemplate } from "../templates/loader";
import { formatFrontmatter, FrontmatterValue, parseFrontmatter } from "../graph/frontmatter";
import { formatDate } from "../util/date";
import { NotFoundError, UsageError } from "../util/errors";
import { formatResolveError, resolveQid } from "../util/qid";
import { isCanonicalId, isPortableId, isPortableIdRef } from "../util/id";
import { validatePortableOrUriRef } from "../util/refs";
import { containedPathExists, writeContainedFileExclusive } from "../core/filesystem_authority";
import { workspaceDocumentRelativePath } from "../core/workspace_path";
import { withMutationLock } from "../util/lock";
import { isSqliteBackend, reserveSqliteNumericId } from "../graph/sqlite_index";
import { writeDerivedIndexes } from "../graph/reindex";
import { appendAutomaticEvent } from "./event_support";

export type NewCommandOptions = {
  root: string;
  type: string;
  title: string;
  id?: string;
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
  skills?: string;
  supersedes?: string;
  template?: string;
  contractProfile?: string;
  validationPolicyRef?: string;
  evidencePolicyRef?: string;
  receiptKind?: string;
  redactionClass?: string;
  noCache?: boolean;
  noReindex?: boolean;
  runId?: string;
  json?: boolean;
  now?: Date;
};

type NewNodeReceipt = {
  workspace: string;
  id: string;
  qid: string;
  path: string;
  type: string;
  title: string;
  status?: string;
  priority?: number;
};

type LoopTemplateSuggestion = {
  ref: string;
  title: string;
  path: string;
};

const DEC_ID_RE = /^dec-[0-9]+$/;
const DEC_STATUS = new Set(["proposed", "accepted", "rejected", "superseded"]);
const SKILL_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CONTRACT_METADATA_RE = /^[a-z][a-z0-9_]*(?:-[a-z0-9_]+)*$/;
const CORE_TYPES = new Set(["rule"]);
const DESIGN_TYPES = new Set(["prd", "edd", "dec", "prop"]);
const LEGACY_NEW_SPEC_WARNING =
  "warning: mdkg new spec is legacy; use mdkg new manifest. This alias creates MANIFEST.md with type: manifest during the compatibility release.";

const NEW_LOOP_NEXT_ACTIONS = [
  "Review reusable loop templates with mdkg loop list",
  "Fork a reusable template with mdkg loop fork <template> --scope <scope>",
  "Inspect raw loop readiness with mdkg loop plan <loop-id>",
];

function toPosix(value: string): string {
  return value.split(path.sep).join("/");
}

function loopTemplateSuggestions(root: string, config: Config): LoopTemplateSuggestion[] {
  const dir = path.resolve(root, config.templates.root_path, "loops");
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs
    .readdirSync(dir)
    .filter((entry) => entry.endsWith(".loop.md"))
    .sort()
    .map((entry) => {
      const filePath = path.join(dir, entry);
      const content = fs.readFileSync(filePath, "utf8");
      const { frontmatter } = parseFrontmatter(content, filePath);
      const slug = entry.replace(/\.loop\.md$/, "");
      const title = typeof frontmatter.title === "string" && frontmatter.title.trim().length > 0
        ? frontmatter.title
        : slug;
      return {
        ref: `template://loops/${slug}`,
        title,
        path: toPosix(path.relative(root, filePath)),
      };
    });
}

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
  if (!isCanonicalId(normalized)) {
    throw new UsageError(`${key} entries must match <prefix>-<number> or reserved id: ${value}`);
  }
  return normalized;
}

function normalizeIdRef(value: string, key: string): string {
  const normalized = value.toLowerCase();
  if (!isPortableIdRef(normalized)) {
    throw new UsageError(`${key} entries must match <id> or <ws>:<id>: ${value}`);
  }
  return normalized;
}

function normalizeAgentFileId(value: string): string {
  const normalized = value.toLowerCase();
  if (!isPortableId(normalized)) {
    throw new UsageError("--id must be a lowercase portable id for agent workflow file types");
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

function normalizeRef(value: string, key: string): string {
  const normalized = value.includes("://") ? value : value.toLowerCase();
  if (!validatePortableOrUriRef(normalized)) {
    throw new UsageError(`${key} entries must be portable ids, qids, or URI refs: ${value}`);
  }
  return normalized;
}

function normalizeRefList(raw: string | undefined, key: string): string[] {
  return parseCsvList(raw).map((value) => normalizeRef(value, key));
}

function normalizeContractMetadataToken(raw: string | undefined, key: string): string | undefined {
  if (raw === undefined) {
    return undefined;
  }
  const normalized = raw.toLowerCase();
  if (!CONTRACT_METADATA_RE.test(normalized)) {
    throw new UsageError(`${key} must be lowercase snake/kebab style`);
  }
  return normalized;
}

function normalizeIdRefList(raw: string | undefined, key: string): string[] {
  return parseCsvList(raw).map((value) => normalizeIdRef(value, key));
}

function normalizeSkillList(raw: string | undefined): string[] {
  return parseCsvList(raw).map((value) => {
    const normalized = value.toLowerCase();
    if (!SKILL_SLUG_RE.test(normalized)) {
      throw new UsageError(`--skills entries must be kebab-case: ${value}`);
    }
    return normalized;
  });
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
  return `${prefix}-${maxIdForPrefix(index, ws, prefix) + 1}`;
}

function maxIdForPrefix(index: Record<string, { ws: string; id: string }>, ws: string, prefix: string): number {
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
  return max;
}

function idPrefixForType(type: string): string {
  if (type === "checkpoint") {
    return "chk";
  }
  if (type === "work_order") {
    return "order";
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
  if (isAgentFileType(type)) {
    return "work";
  }
  throw new UsageError(`unsupported type: ${type}`);
}

function fileNameForType(type: string, id: string, slug: string): string {
  if (isAgentFileType(type)) {
    return path.join(`${id}-${slug}`, AGENT_FILE_BASENAMES[type]);
  }
  return `${id}-${slug}.md`;
}

function canonicalCreationType(requestedType: string): string {
  return requestedType === "spec" ? "manifest" : requestedType;
}

function ensureExists(index: Index, value: string, ws: string, label: string): void {
  const resolved = resolveQid(index, value, ws);
  if (resolved.status !== "ok") {
    throw new NotFoundError(formatResolveError(label, value, resolved, ws));
  }
  const node = index.nodes[resolved.qid];
  if (["epic", "parent", "prev", "next"].includes(label) && node?.source?.imported) {
    throw new UsageError(`${label} cannot target read-only subgraph node ${node.qid}`);
  }
}

function mergeRenderedFrontmatter(
  content: string,
  filePath: string,
  additions: Record<string, FrontmatterValue | undefined>
): string {
  const entries = Object.entries(additions).filter((entry): entry is [string, FrontmatterValue] => entry[1] !== undefined);
  if (entries.length === 0) {
    return content;
  }
  const { frontmatter, body } = parseFrontmatter(content, filePath);
  for (const [key, value] of entries) {
    frontmatter[key] = value;
  }
  const lines = ["---", ...formatFrontmatter(frontmatter), "---", body.trimStart()];
  return lines.join("\n").endsWith("\n") ? lines.join("\n") : `${lines.join("\n")}\n`;
}

function runNewCommandLocked(options: NewCommandOptions): void {
  const title = options.title.trim();
  if (!title) {
    throw new UsageError("title cannot be empty");
  }

  const requestedType = options.type.toLowerCase();
  if (requestedType === "archive") {
    throw new UsageError("use `mdkg archive add <file>` to create archive sidecars");
  }
  if (!ALLOWED_TYPES.has(requestedType)) {
    throw new UsageError(`type must be one of ${Array.from(ALLOWED_TYPES).join(", ")}`);
  }
  const type = canonicalCreationType(requestedType);
  const legacySpecAlias = requestedType === "spec";

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

  if (options.id !== undefined && !isAgentFileType(type)) {
    throw new UsageError("--id is only valid for agent workflow file types");
  }

  const prefix = idPrefixForType(type);
  const id = options.id !== undefined
    ? normalizeAgentFileId(options.id)
    : isSqliteBackend(config)
      ? reserveSqliteNumericId({
          root: options.root,
          config,
          ws,
          prefix,
          currentMax: maxIdForPrefix(index.nodes, ws, prefix),
        }) ?? nextIdForPrefix(index.nodes, ws, prefix)
      : nextIdForPrefix(index.nodes, ws, prefix);
  if (index.nodes[`${ws}:${id}`]) {
    throw new UsageError(`node already exists: ${ws}:${id}`);
  }
  const slug = slugifyTitle(title);
  const fileName = fileNameForType(type, id, slug);

  const wsEntry = config.workspaces[ws];
  const folder = folderForType(type);
  const relativeFilePath = workspaceDocumentRelativePath(wsEntry.path, wsEntry.mdkg_dir, folder, fileName);
  const targetDir = path.resolve(options.root, wsEntry.path, wsEntry.mdkg_dir, folder);
  const filePath = path.join(targetDir, fileName);
  if (containedPathExists({ root: options.root, relativePath: relativeFilePath })) {
    throw new UsageError(`node already exists: ${path.relative(options.root, filePath)}`);
  }

  const statusInput = options.status?.toLowerCase();
  let status: string | undefined;
  if (WORK_TYPES.has(type)) {
    const allowed = new Set(config.work.status_enum.map((value) => value.toLowerCase()));
    const allowedForType = type === "goal" ? new Set([...allowed, "archived"]) : allowed;
    status = statusInput ?? (type === "goal" && allowed.has("progress")
      ? "progress"
      : config.work.status_enum[0]?.toLowerCase());
    if (!status || !allowedForType.has(status)) {
      throw new UsageError(`--status must be one of ${Array.from(allowedForType).join(", ")}`);
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
  const contractProfile = normalizeContractMetadataToken(options.contractProfile, "--contract-profile");
  const validationPolicyRef = options.validationPolicyRef
    ? normalizeRef(options.validationPolicyRef, "--validation-policy-ref")
    : undefined;
  const evidencePolicyRef = options.evidencePolicyRef
    ? normalizeRef(options.evidencePolicyRef, "--evidence-policy-ref")
    : undefined;
  const receiptKind = normalizeContractMetadataToken(options.receiptKind, "--receipt-kind");
  const redactionClass = normalizeContractMetadataToken(options.redactionClass, "--redaction-class");
  if (contractProfile && !["manifest", "work", "work_order", "receipt"].includes(type)) {
    throw new UsageError("--contract-profile is only valid for manifest, work, work_order, and receipt");
  }
  if ((validationPolicyRef || evidencePolicyRef) && !["manifest", "work_order", "receipt"].includes(type)) {
    throw new UsageError("--validation-policy-ref and --evidence-policy-ref are only valid for manifest, work_order, and receipt");
  }
  if ((receiptKind || redactionClass) && type !== "receipt") {
    throw new UsageError("--receipt-kind and --redaction-class are only valid for receipt");
  }

  const epic = options.epic ? normalizeIdRef(options.epic, "--epic") : undefined;
  const parent = options.parent ? normalizeIdRef(options.parent, "--parent") : undefined;
  const prev = options.prev ? normalizeIdRef(options.prev, "--prev") : undefined;
  const next = options.next ? normalizeIdRef(options.next, "--next") : undefined;

  const relates = normalizeIdRefList(options.relates, "--relates");
  const blockedBy = normalizeIdRefList(options.blockedBy, "--blocked-by");
  const blocks = normalizeIdRefList(options.blocks, "--blocks");
  const refs = normalizeRefList(options.refs, "--refs");
  const aliases = normalizeLowercaseList(options.aliases);
  const tags = normalizeLowercaseList(options.tags);
  const owners = normalizeLowercaseList(options.owners);
  const cases = normalizeLowercaseList(options.cases);
  const skills = normalizeSkillList(options.skills);
  const links = normalizeList(options.links);
  const artifacts = normalizeList(options.artifacts);
  if (skills.length > 0 && !WORK_TYPES.has(type)) {
    throw new UsageError("--skills is only valid for work items");
  }

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
  if (template.source === "bundled") {
    console.error(
      `warning: using bundled template fallback for ${type}; run \`mdkg upgrade --apply\` to vendor missing local templates`
    );
  }
  const renderedContent = renderTemplate(template, {
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
    skills: skills.length > 0 ? skills : undefined,
    cases: cases.length > 0 ? cases : undefined,
    supersedes: options.supersedes ? options.supersedes.toLowerCase() : undefined,
    goal_state: type === "goal" ? (status === "done" ? "achieved" : status === "blocked" ? "blocked" : status === "archived" ? "archived" : "active") : undefined,
    goal_condition: type === "goal" ? title : undefined,
    max_iterations: type === "goal" ? 25 : undefined,
    blocked_after_attempts: type === "goal" ? 3 : undefined,
    created: today,
    updated: today,
  });
  const content = mergeRenderedFrontmatter(renderedContent, filePath, {
    contract_profile: contractProfile,
    validation_policy_ref: validationPolicyRef,
    evidence_policy_ref: evidencePolicyRef,
    receipt_kind: receiptKind,
    redaction_class: redactionClass,
  });

  try {
    writeContainedFileExclusive({ root: options.root, relativePath: relativeFilePath }, content);
  } catch (err) {
    const code = typeof err === "object" && err !== null && "code" in err ? String((err as { code?: unknown }).code) : "";
    if (code === "EEXIST") {
      throw new UsageError(`node already exists: ${path.relative(options.root, filePath)}`);
    }
    throw err;
  }

  if (config.index.auto_reindex && !noReindex) {
    const updatedIndex = buildIndex(options.root, config, { tolerant: config.index.tolerant });
    writeDerivedIndexes(options.root, config, updatedIndex);
  }

  appendAutomaticEvent({
    root: options.root,
    ws,
    kind: "NODE_CREATED",
    status: "ok",
    refs: [id],
    notes: `node created via mdkg new`,
    runId: options.runId,
    now: options.now,
  });

  const relativePath = path.relative(options.root, filePath);
  const receipt: NewNodeReceipt = {
    workspace: ws,
    id,
    qid: `${ws}:${id}`,
    path: relativePath,
    type,
    title,
    ...(status ? { status } : {}),
    ...(priority !== undefined ? { priority } : {}),
  };

  if (legacySpecAlias) {
    console.error(LEGACY_NEW_SPEC_WARNING);
  }

  const loopGuidance = type === "loop"
    ? {
        next_actions: NEW_LOOP_NEXT_ACTIONS,
        suggested_templates: loopTemplateSuggestions(options.root, config),
      }
    : undefined;

  if (options.json) {
    console.log(
      JSON.stringify(
        {
          action: "created",
          node: receipt,
          ...(loopGuidance ? loopGuidance : {}),
        },
        null,
        2
      )
    );
    return;
  }

  console.log(`node created: ${receipt.qid} (${receipt.path})`);
  if (loopGuidance) {
    console.log("next: review reusable loop templates with `mdkg loop list`");
    console.log("next: fork a reusable template with `mdkg loop fork <template> --scope <scope>`");
    console.log(`next: inspect raw loop readiness with \`mdkg loop plan ${receipt.id}\``);
  }
}

export function runNewCommand(options: NewCommandOptions): void {
  const config = loadConfig(options.root);
  return withMutationLock(options.root, config.index.lock_timeout_ms, () => runNewCommandLocked(options));
}
