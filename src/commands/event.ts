import { appendEvent, ensureEventsEnabled, EventStatus, normalizeEventRefList, normalizeEventStringList, normalizeWorkspaceForEvents } from "./event_support";
import { UsageError } from "../util/errors";
import { loadConfig } from "../core/config";
import { readGraphFormat } from "../graph/identity";
import { loadIndex } from "../graph/index_cache";
import { bindAuthoredIdentityReferences } from "../graph/identity_authoring";
import { withMutationLock } from "../util/lock";

export type EventEnableCommandOptions = {
  root: string;
  ws?: string;
  json?: boolean;
};

export type EventAppendCommandOptions = {
  root: string;
  ws?: string;
  kind: string;
  status: string;
  refs: string;
  artifacts?: string;
  notes?: string;
  runId?: string;
  agent?: string;
  skill?: string;
  tool?: string;
  json?: boolean;
};

export function runEventEnableCommand(options: EventEnableCommandOptions): void {
  const result = ensureEventsEnabled(options);
  if (options.json) {
    console.log(
      JSON.stringify(
        {
          action: "enabled",
          workspace: result.ws,
          created: result.created,
        },
        null,
        2
      )
    );
    return;
  }

  const createdLabel = result.created ? "created" : "already present";
  console.log(`event logging enabled: ${result.ws} (${createdLabel})`);
}

function normalizeEventStatus(value: string): EventStatus {
  const normalized = value.trim().toLowerCase();
  if (
    normalized === "ok" ||
    normalized === "error" ||
    normalized === "retry" ||
    normalized === "skipped"
  ) {
    return normalized;
  }
  throw new UsageError("--status must be one of ok, error, retry, skipped");
}

export function runEventAppendCommand(options: EventAppendCommandOptions): void {
  const config = loadConfig(options.root);
  if (readGraphFormat(options.root).format_version === 2) {
    return withMutationLock(options.root, config.index.lock_timeout_ms, () => runEventAppendCommandLocked(options));
  }
  return runEventAppendCommandLocked(options);
}

function runEventAppendCommandLocked(options: EventAppendCommandOptions): void {
  const kind = options.kind.trim();
  if (!kind) {
    throw new UsageError("--kind is required");
  }
  let refs = normalizeEventRefList(options.refs);
  if (refs.length === 0) {
    throw new UsageError("--refs requires at least one id or qid");
  }

  if (readGraphFormat(options.root).format_version === 2) {
    const config = loadConfig(options.root);
    const ws = normalizeWorkspaceForEvents(config, options.ws);
    const { index } = loadIndex({ root: options.root, config, persistReindex: false });
    refs = bindAuthoredIdentityReferences(index, ws, { refs }).refs as string[];
  }

  const record = appendEvent({
    root: options.root,
    ws: options.ws,
    kind,
    status: normalizeEventStatus(options.status),
    refs,
    artifacts: normalizeEventStringList(options.artifacts),
    notes: options.notes,
    runId: options.runId,
    agent: options.agent,
    skill: options.skill,
    tool: options.tool,
  });

  if (options.json) {
    console.log(JSON.stringify({ action: "appended", event: record }, null, 2));
    return;
  }

  console.log(`event appended: ${record.workspace}:${record.kind} (${record.run_id})`);
}
