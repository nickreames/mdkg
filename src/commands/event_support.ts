import fs from "fs";
import path from "path";
import { loadConfig, Config as MdkgConfig } from "../core/config";
import { UsageError, NotFoundError } from "../util/errors";

export type EventStatus = "ok" | "error" | "retry" | "skipped";

export type EventRecord = {
  ts: string;
  run_id: string;
  workspace: string;
  agent: string;
  kind: string;
  status: EventStatus;
  refs: string[];
  artifacts: string[];
  notes: string;
  skill?: string;
  tool?: string;
};

export type AppendEventOptions = {
  root: string;
  ws?: string;
  kind: string;
  status: EventStatus;
  refs: string[];
  artifacts?: string[];
  notes?: string;
  runId?: string;
  agent?: string;
  skill?: string;
  tool?: string;
  now?: Date;
};

export type EnsureEventsEnabledOptions = {
  root: string;
  ws?: string;
  updateGitignore?: boolean;
};

function appendIgnoreEntries(filePath: string, entries: string[]): boolean {
  const normalizedEntries = entries.map((entry) => entry.trim()).filter(Boolean);
  if (normalizedEntries.length === 0) {
    return false;
  }

  let existing = "";
  if (fs.existsSync(filePath)) {
    existing = fs.readFileSync(filePath, "utf8");
  }
  const existingLines = new Set(
    existing
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
  );

  const additions = normalizedEntries.filter((entry) => !existingLines.has(entry));
  if (additions.length === 0) {
    return false;
  }

  const next = existing.length === 0 ? `${additions.join("\n")}\n` : `${existing.replace(/\s*$/, "\n")}${additions.join("\n")}\n`;
  fs.writeFileSync(filePath, next, "utf8");
  return true;
}

export function normalizeWorkspaceForEvents(config: MdkgConfig, raw?: string): string {
  const normalized = (raw ?? "root").toLowerCase();
  if (normalized === "all") {
    throw new UsageError("--ws all is not valid here");
  }
  if (!config.workspaces[normalized]) {
    throw new NotFoundError(`workspace not found: ${normalized}`);
  }
  return normalized;
}

export function resolveEventsPath(root: string, config: MdkgConfig, ws = "root"): string {
  const entry = config.workspaces[ws];
  if (!entry) {
    throw new NotFoundError(`workspace not found: ${ws}`);
  }
  return path.resolve(root, entry.path, entry.mdkg_dir, "work", "events", "events.jsonl");
}

function formatRunIdTimestamp(now: Date): string {
  const iso = now.toISOString().replace(/[-:]/g, "").replace(/\./g, "").replace("Z", "Z");
  return iso;
}

export function createLocalRunId(kind: string, now = new Date()): string {
  const normalizedKind = kind.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return `run_mdkg_cli_${normalizedKind}_${formatRunIdTimestamp(now)}`;
}

export function isEventLoggingEnabled(root: string, config: MdkgConfig, ws?: string): boolean {
  const normalizedWs = normalizeWorkspaceForEvents(config, ws);
  return fs.existsSync(resolveEventsPath(root, config, normalizedWs));
}

export function ensureEventsEnabled(options: EnsureEventsEnabledOptions): {
  ws: string;
  eventsPath: string;
  created: boolean;
  gitignoreUpdated: boolean;
} {
  const config = loadConfig(options.root);
  const ws = normalizeWorkspaceForEvents(config, options.ws);
  const eventsPath = resolveEventsPath(options.root, config, ws);
  const updateGitignore = options.updateGitignore !== false;

  let created = false;
  if (!fs.existsSync(eventsPath)) {
    fs.mkdirSync(path.dirname(eventsPath), { recursive: true });
    fs.writeFileSync(eventsPath, "", "utf8");
    created = true;
  }

  let gitignoreUpdated = false;
  if (updateGitignore) {
    gitignoreUpdated = appendIgnoreEntries(path.join(options.root, ".gitignore"), [
      ".mdkg/work/events/*.jsonl",
    ]);
  }

  return { ws, eventsPath, created, gitignoreUpdated };
}

function normalizeIdOrIdRef(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizeEventRefList(raw?: string): string[] {
  if (!raw) {
    return [];
  }
  return raw
    .split(",")
    .map((value) => normalizeIdOrIdRef(value))
    .filter(Boolean);
}

export function normalizeEventStringList(raw?: string): string[] {
  if (!raw) {
    return [];
  }
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function buildEventRecord(config: MdkgConfig, options: AppendEventOptions): EventRecord {
  const now = options.now ?? new Date();
  const ws = normalizeWorkspaceForEvents(config, options.ws);
  return {
    ts: now.toISOString(),
    run_id: options.runId?.trim() || createLocalRunId(options.kind, now),
    workspace: ws,
    agent: options.agent?.trim() || "mdkg-cli",
    kind: options.kind,
    status: options.status,
    refs: options.refs.map(normalizeIdOrIdRef).filter(Boolean),
    artifacts: (options.artifacts ?? []).map((value) => value.trim()).filter(Boolean),
    notes: options.notes?.trim() ?? "",
    ...(options.skill ? { skill: options.skill.trim().toLowerCase() } : {}),
    ...(options.tool ? { tool: options.tool.trim() } : {}),
  };
}

export function appendEvent(options: AppendEventOptions): EventRecord {
  const config = loadConfig(options.root);
  const record = buildEventRecord(config, options);
  if (record.refs.length === 0) {
    throw new UsageError("--refs requires at least one id or qid");
  }
  const eventsPath = resolveEventsPath(options.root, config, record.workspace);
  if (!fs.existsSync(eventsPath)) {
    throw new NotFoundError(`event logging is not enabled for workspace ${record.workspace}; run \`mdkg event enable --ws ${record.workspace}\``);
  }
  fs.appendFileSync(eventsPath, `${JSON.stringify(record)}\n`, "utf8");
  return record;
}

export function appendAutomaticEvent(
  options: AppendEventOptions
): EventRecord | undefined {
  const config = loadConfig(options.root);
  const ws = normalizeWorkspaceForEvents(config, options.ws);
  if (!isEventLoggingEnabled(options.root, config, ws)) {
    return undefined;
  }
  return appendEvent({ ...options, ws });
}
