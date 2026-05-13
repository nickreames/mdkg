import { appendEvent, ensureEventsEnabled, EventStatus, normalizeEventRefList, normalizeEventStringList } from "./event_support";
import { UsageError } from "../util/errors";

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
  const kind = options.kind.trim();
  if (!kind) {
    throw new UsageError("--kind is required");
  }
  const refs = normalizeEventRefList(options.refs);
  if (refs.length === 0) {
    throw new UsageError("--refs requires at least one id or qid");
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
