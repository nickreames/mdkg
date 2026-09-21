import path from "path";
import { loadConfig } from "../core/config";
import { containedPathExists, writeContainedFileExclusive } from "../core/filesystem_authority";
import { workspaceDocumentRelativePath } from "../core/workspace_path";
import { loadIndex } from "../graph/index_cache";
import { Index } from "../graph/indexer";
import { loadTemplate, renderTemplate } from "../templates/loader";
import { formatDate } from "../util/date";
import { NotFoundError, UsageError } from "../util/errors";
import { isCanonicalId, isPortableIdRef, maxNumericAlias } from "../util/id";
import { withMutationLock } from "../util/lock";
import { planNumericId, reservePlannedNumericIds } from "../graph/sqlite_index";
import { appendAutomaticEvent } from "./event_support";
import { authorNewIdentityNode, validateProspectiveNodes } from "../graph/identity_authoring";
import { NodeIdentity } from "../graph/identity";
import { resolveQid } from "../util/qid";

export type CheckpointNewCommandOptions = {
  root: string;
  title: string;
  ws?: string;
  relates?: string;
  scope?: string;
  kind?: string;
  status?: string;
  priority?: number;
  template?: string;
  runId?: string;
  note?: string;
  body?: string;
  json?: boolean;
  now?: Date;
};

export type CheckpointReceipt = {
  workspace: string;
  id: string;
  qid: string;
  identity?: NodeIdentity;
  stable_ref?: string;
  path: string;
  kind: CheckpointKind;
};

export const CHECKPOINT_KINDS = [
  "implementation",
  "test-proof",
  "goal-closeout",
  "audit",
  "handoff",
] as const;

export type CheckpointKind = (typeof CHECKPOINT_KINDS)[number];

function normalizeCheckpointKind(value?: string): CheckpointKind {
  const normalized = (value ?? "implementation").toLowerCase();
  if ((CHECKPOINT_KINDS as readonly string[]).includes(normalized)) {
    return normalized as CheckpointKind;
  }
  throw new UsageError(`--kind must be one of ${CHECKPOINT_KINDS.join(", ")}`);
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

function slugifyTitle(title: string): string {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");

  if (!slug) {
    return "checkpoint";
  }

  const maxLen = 80;
  return slug.length > maxLen ? slug.slice(0, maxLen).replace(/-+$/g, "") : slug;
}

function normalizeWorkspace(value?: string): string {
  if (!value) {
    return "root";
  }
  const normalized = value.toLowerCase();
  if (normalized === "all") {
    throw new UsageError("--ws all is not valid for checkpoint creation");
  }
  return normalized;
}

function kindSpecificSection(kind: CheckpointKind): string[] {
  switch (kind) {
    case "implementation":
      return [
        "# Implementation Details",
        "",
        "- Code or graph surfaces changed:",
        "- Architecture or data-shape notes:",
        "- Compatibility notes:",
      ];
    case "test-proof":
      return [
        "# Test Proof",
        "",
        "- Test target:",
        "- Fixtures or temp repos:",
        "- Coverage gaps:",
      ];
    case "goal-closeout":
      return [
        "# Goal Closeout",
        "",
        "- Goal condition result:",
        "- Scoped nodes closed:",
        "- Remaining deferred work:",
      ];
    case "audit":
      return [
        "# Audit Findings",
        "",
        "- Reviewed surfaces:",
        "- Findings:",
        "- Residual risk:",
      ];
    case "handoff":
      return [
        "# Handoff Summary",
        "",
        "- Recipient/context:",
        "- Starting node or command:",
        "- Explicit boundaries:",
      ];
  }
}

function checkpointBody(kind: CheckpointKind): string {
  return [
    "# Summary",
    "",
    "What was completed in this phase? What is now true?",
    "",
    "# Scope Covered",
    "",
    "Keep `scope` frontmatter updated when possible.",
    "",
    "## Changed Surfaces",
    "",
    "- files, commands, nodes, docs, or runtime surfaces changed",
    "",
    "## Boundaries",
    "",
    "- in scope:",
    "- out of scope:",
    "- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:",
    "",
    "# Decisions Captured",
    "",
    "Link the most important decision records.",
    "",
    "# Implementation Summary",
    "",
    "What changed? What patterns or architecture emerged?",
    "",
    ...kindSpecificSection(kind),
    "",
    "# Verification / Testing",
    "",
    "## Command Evidence",
    "",
    "- command:",
    "- result:",
    "",
    "## Pass / Fail Status",
    "",
    "- status:",
    "",
    "## Known Warnings",
    "",
    "- warning:",
    "",
    "# Known Issues / Follow-ups",
    "",
    "- issue 1",
    "- issue 2",
    "",
    "## Follow-up Refs",
    "",
    "- task/test/goal refs:",
    "",
    "# Links / Artifacts",
    "",
    "- packs",
    "- PRs/commits",
    "- docs",
    "- dashboards",
    "",
    "# Raw Content Safety",
    "",
    "- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.",
    "",
  ].join("\n");
}

function replaceRenderedBody(content: string, body: string): string {
  const marker = "\n---\n";
  const start = content.indexOf(marker);
  if (!content.startsWith("---\n") || start === -1) {
    return content;
  }
  return `${content.slice(0, start + marker.length)}${body}`;
}

function createCheckpointLocked(options: CheckpointNewCommandOptions, preview = false): CheckpointReceipt {
  const title = options.title.trim();
  if (!title) {
    throw new UsageError("checkpoint title cannot be empty");
  }

  const config = loadConfig(options.root);
  const ws = normalizeWorkspace(options.ws);
  if (!config.workspaces[ws]) {
    throw new NotFoundError(`workspace not found: ${ws}`);
  }

  const status = (options.status ?? "backlog").toLowerCase();
  const allowedStatuses = new Set(config.work.status_enum.map((value) => value.toLowerCase()));
  if (!allowedStatuses.has(status)) {
    throw new UsageError(`--status must be one of ${Array.from(allowedStatuses).join(", ")}`);
  }

  const priorityMin = config.work.priority_min;
  const priorityMax = config.work.priority_max;
  const priority = options.priority ?? priorityMax;
  if (!Number.isInteger(priority) || priority < priorityMin || priority > priorityMax) {
    throw new UsageError(`--priority must be between ${priorityMin} and ${priorityMax}`);
  }

  const { index } = loadIndex({ root: options.root, config, useCache: false, persistReindex: false });
  const allocation = { root: options.root, config, ws, prefix: "chk", currentMax: maxNumericAlias(index.nodes, ws, "chk") };
  const id = planNumericId(allocation);
  const slug = slugifyTitle(title);
  const fileName = `${id}-${slug}.md`;

  const wsEntry = config.workspaces[ws];
  const workDir = path.resolve(options.root, wsEntry.path, wsEntry.mdkg_dir, "work");
  const filePath = path.join(workDir, fileName);
  const relativeFilePath = workspaceDocumentRelativePath(wsEntry.path, wsEntry.mdkg_dir, "work", fileName);

  if (containedPathExists({ root: options.root, relativePath: relativeFilePath })) {
    throw new UsageError(`checkpoint file already exists: ${path.relative(options.root, filePath)}`);
  }

  const relates = parseCsvList(options.relates).map((value) => normalizeIdRef(value, "--relates"));
  for (const target of relates) {
    if (resolveQid(index, target, target.includes(":") ? undefined : ws).status !== "ok") {
      throw new NotFoundError(`related node not found: ${target}`);
    }
  }
  const scope = parseCsvList(options.scope).map((value) => index.meta.graph_format ? normalizeIdRef(value, "--scope") : normalizeId(value, "--scope"));
  const kind = normalizeCheckpointKind(options.kind);

  const now = options.now ?? new Date();
  const today = formatDate(now);
  const template = loadTemplate(options.root, config, "checkpoint", options.template);
  const content = renderTemplate(template, {
    id,
    title,
    checkpoint_kind: kind,
    status,
    priority,
    created: today,
    updated: today,
    relates,
    scope,
  });
  const authored = authorNewIdentityNode(options.root, index, ws,
    replaceRenderedBody(content, options.body ?? checkpointBody(kind)), relativeFilePath);
  const rendered = authored.content;
  validateProspectiveNodes(options.root, config, index, ws, [{ id, path: relativeFilePath, content: rendered }]);
  const receipt: CheckpointReceipt = {
    workspace: ws, id, qid: `${ws}:${id}`,
    ...(authored.identity ? { identity: authored.identity, stable_ref: authored.stable_ref } : {}),
    path: path.relative(options.root, filePath), kind,
  };
  if (preview) return receipt;
  reservePlannedNumericIds({ root: options.root, config, reservations: [{ ...allocation, id }] });

  try {
    writeContainedFileExclusive({ root: options.root, relativePath: relativeFilePath }, rendered);
  } catch (err) {
    const code = typeof err === "object" && err !== null && "code" in err ? String((err as { code?: unknown }).code) : "";
    if (code === "EEXIST") {
      throw new UsageError(`checkpoint file already exists: ${path.relative(options.root, filePath)}`);
    }
    throw err;
  }

  appendAutomaticEvent({
    root: options.root,
    ws,
    kind: "CHECKPOINT_CREATED",
    status: "ok",
    refs: [authored.stable_ref ?? id],
    notes: options.note ?? `checkpoint created via mdkg checkpoint new`,
    runId: options.runId,
    now,
  });

  return receipt;
}

// Composite task completion checks checkpoint admission before TASK_DONE or
// source writes. The held checkout lock protects the later repeated plan.
export function preflightCheckpoint(options: CheckpointNewCommandOptions): void {
  createCheckpointLocked(options, true);
}

export function createCheckpoint(options: CheckpointNewCommandOptions): CheckpointReceipt {
  const config = loadConfig(options.root);
  return withMutationLock(options.root, config.index.lock_timeout_ms, () => createCheckpointLocked(options));
}

export function runCheckpointNewCommand(options: CheckpointNewCommandOptions): void {
  const checkpoint = createCheckpoint(options);
  if (options.json) {
    console.log(
      JSON.stringify(
        {
          action: "created",
          checkpoint,
        },
        null,
        2
      )
    );
    return;
  }

  console.log(`checkpoint created: ${checkpoint.qid} (${checkpoint.path})`);
}
