import fs from "fs";
import path from "path";
import { loadConfig } from "../core/config";
import { loadIndex } from "../graph/index_cache";
import { Index } from "../graph/indexer";
import { loadTemplate, renderTemplate } from "../templates/loader";
import { formatDate } from "../util/date";
import { NotFoundError, UsageError } from "../util/errors";

export type CheckpointNewCommandOptions = {
  root: string;
  title: string;
  ws?: string;
  relates?: string;
  scope?: string;
  status?: string;
  priority?: number;
  template?: string;
};

const ID_RE = /^[a-z]+-[0-9]+$/;
const ID_REF_RE = /^([a-z][a-z0-9_]*:)?[a-z]+-[0-9]+$/;

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

function nextCheckpointId(index: Index, ws: string): string {
  let max = 0;
  for (const node of Object.values(index.nodes)) {
    if (node.ws !== ws) {
      continue;
    }
    const match = /^chk-(\d+)$/.exec(node.id);
    if (!match) {
      continue;
    }
    const parsed = Number.parseInt(match[1] ?? "", 10);
    if (Number.isInteger(parsed) && parsed > max) {
      max = parsed;
    }
  }
  return `chk-${max + 1}`;
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

export function runCheckpointNewCommand(options: CheckpointNewCommandOptions): void {
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

  const { index } = loadIndex({ root: options.root, config });
  const id = nextCheckpointId(index, ws);
  const slug = slugifyTitle(title);
  const fileName = `${id}-${slug}.md`;

  const wsEntry = config.workspaces[ws];
  const workDir = path.resolve(options.root, wsEntry.path, wsEntry.mdkg_dir, "work");
  const filePath = path.join(workDir, fileName);

  if (fs.existsSync(filePath)) {
    throw new UsageError(`checkpoint file already exists: ${path.relative(options.root, filePath)}`);
  }

  const relates = parseCsvList(options.relates).map((value) => normalizeIdRef(value, "--relates"));
  for (const target of relates) {
    const qid = target.includes(":") ? target : `${ws}:${target}`;
    if (!index.nodes[qid]) {
      throw new NotFoundError(`related node not found: ${target}`);
    }
  }
  const scope = parseCsvList(options.scope).map((value) => normalizeId(value, "--scope"));

  const today = formatDate(new Date());
  const template = loadTemplate(options.root, config, "checkpoint", options.template);
  const content = renderTemplate(template, {
    id,
    title,
    status,
    priority,
    created: today,
    updated: today,
    relates,
    scope,
  });

  fs.mkdirSync(workDir, { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");

  console.log(
    `checkpoint created: ${ws}:${id} (${path.relative(options.root, filePath)})`
  );
}
