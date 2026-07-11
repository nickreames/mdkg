export type LoopCommandFlagDescriptor = {
  name: string;
  value?: string | null;
  required?: boolean;
  description: string;
};

export type LoopCommandArgDescriptor = {
  name: string;
  required: boolean;
  source: string;
  description: string;
};

export type LoopCommandSafetyDescriptor = {
  json_schema_ref?: string | null;
  side_effects: string[];
  read_paths: string[];
  write_paths: string[];
  dry_run: Record<string, unknown>;
  lock_policy: string;
  atomic_write_policy: string;
  receipts: string[];
  danger_level: string;
};

export type LoopCommandDescriptor = {
  key: string;
  path: string[];
  summary: string;
  usage: string[];
  args: LoopCommandArgDescriptor[];
  flags: LoopCommandFlagDescriptor[];
  output_formats: string[];
  notes: string[];
  safety: LoopCommandSafetyDescriptor;
  handler: string;
};

const READ_ONLY_LOOP_SAFETY: LoopCommandSafetyDescriptor = {
  json_schema_ref: "mdkg.command_output.v1",
  side_effects: ["none"],
  read_paths: [".mdkg/**"],
  write_paths: [],
  dry_run: { supported: false },
  lock_policy: "none-read-only",
  atomic_write_policy: "none-read-only",
  receipts: ["loop-read-receipt"],
  danger_level: "read-only",
};

const LOOP_GRAPH_WRITE_SAFETY: LoopCommandSafetyDescriptor = {
  json_schema_ref: "mdkg.command_output.v1",
  side_effects: [
    "create-scoped-loop-and-optional-child-nodes",
    "reserve-sqlite-node-ids-when-configured",
    "rebuild-derived-indexes-when-auto-reindex-is-enabled",
    "append-loop-fork-event-when-event-logging-is-enabled",
  ],
  read_paths: [".mdkg/**"],
  write_paths: [".mdkg/**/*.md", ".mdkg/index/**", ".mdkg/events/*.jsonl"],
  dry_run: {
    supported: true,
    flag: "--dry-run",
    side_effects: ["none"],
    write_paths: [],
    reserves_ids: false,
  },
  lock_policy: "mutation-lock-required",
  atomic_write_policy: "exclusive-create-and-atomic-file-writes",
  receipts: ["loop-fork-receipt"],
  danger_level: "moderate",
};

const JSON_FLAG: LoopCommandFlagDescriptor = {
  name: "--json",
  value: null,
  required: false,
  description: "Emit deterministic JSON instead of text.",
};

const WS_FLAG: LoopCommandFlagDescriptor = {
  name: "--ws",
  value: "<alias>",
  required: false,
  description: "Resolve the command against one workspace alias.",
};

const ROOT_FLAG: LoopCommandFlagDescriptor = {
  name: "--root",
  value: "<path>",
  required: false,
  description: "Run against a specific repository root; -r is the short alias.",
};

const NO_CACHE_FLAG: LoopCommandFlagDescriptor = {
  name: "--no-cache",
  value: null,
  required: false,
  description: "Build a non-persisting in-memory index projection instead of reading the cache.",
};

const NO_REINDEX_FLAG: LoopCommandFlagDescriptor = {
  name: "--no-reindex",
  value: null,
  required: false,
  description: "Do not rebuild a stale or missing index projection.",
};

const RUN_ID_FLAG: LoopCommandFlagDescriptor = {
  name: "--run-id",
  value: "<id>",
  required: false,
  description: "Attach an optional run id to the fork event when event logging is enabled.",
};

const READ_FLAGS = [ROOT_FLAG, WS_FLAG, JSON_FLAG, NO_CACHE_FLAG, NO_REINDEX_FLAG];

export const LOOP_COMMAND_DESCRIPTORS: LoopCommandDescriptor[] = [
  {
    key: "loop",
    path: ["loop"],
    summary: "mdkg loop command",
    usage: [
      "mdkg loop list [--ws <alias>] [--json]",
      "mdkg loop show <loop-or-template> [--meta] [--ws <alias>] [--json]",
      "mdkg loop fork <template> --scope <scope> [--title <title>] [--materialization default_children|planning_only|manual] [--planning-only] [--no-children] [--dry-run] [--run-id <id>] [--ws <alias>] [--json]",
      "mdkg loop plan <loop> [--ws <alias>] [--json]",
      "mdkg loop next <loop> [--ws <alias>] [--json]",
      "mdkg loop runs <loop> [--ws <alias>] [--json]",
    ],
    args: [],
    flags: [ROOT_FLAG, WS_FLAG, JSON_FLAG, NO_CACHE_FLAG, NO_REINDEX_FLAG, RUN_ID_FLAG],
    output_formats: ["text", "json"],
    notes: [
      "loop is one first-class node type. Templates, scoped forks, and run-bearing loops are represented through metadata and links.",
      "mdkg defines reusable process state and graph context; runtimes execute agents, tools, sandboxes, traces, and model routing.",
    ],
    safety: {
      ...READ_ONLY_LOOP_SAFETY,
      side_effects: ["read-or-write-loop-graph-state"],
      write_paths: [".mdkg/**/*.md", ".mdkg/index/**", ".mdkg/events/*.jsonl"],
      dry_run: { supported: true, commands: ["fork"] },
      lock_policy: "mutation-lock-required-for-fork",
      atomic_write_policy: "exclusive-create-and-atomic-file-writes",
      receipts: ["loop-receipt"],
      danger_level: "mixed",
    },
    handler: "runLoopSubcommand",
  },
  {
    key: "loop list",
    path: ["loop", "list"],
    summary: "mdkg loop list command",
    usage: ["mdkg loop list [--ws <alias>] [--no-cache] [--no-reindex] [--json]"],
    args: [],
    flags: READ_FLAGS,
    output_formats: ["text", "json"],
    notes: ["Lists indexed loop nodes and reusable seed loop templates."],
    safety: { ...READ_ONLY_LOOP_SAFETY, receipts: ["loop-list-receipt"] },
    handler: "runLoopListCommand",
  },
  {
    key: "loop show",
    path: ["loop", "show"],
    summary: "mdkg loop show command",
    usage: ["mdkg loop show <loop-or-template> [--meta] [--ws <alias>] [--no-cache] [--no-reindex] [--json]"],
    args: [
      {
        name: "loop-or-template",
        required: true,
        source: "<loop-or-template>",
        description: "Loop node id/qid or seed template name/ref.",
      },
    ],
    flags: [
      { name: "--meta", value: null, required: false, description: "Show metadata without the full body." },
      ...READ_FLAGS,
    ],
    output_formats: ["text", "json"],
    notes: ["Shows an indexed loop node or a seed loop template."],
    safety: { ...READ_ONLY_LOOP_SAFETY, receipts: ["loop-show-receipt"] },
    handler: "runLoopShowCommand",
  },
  {
    key: "loop fork",
    path: ["loop", "fork"],
    summary: "mdkg loop fork command",
    usage: [
      "mdkg loop fork <template> --scope <scope> [--title <title>] [--materialization <mode>] [--planning-only] [--no-children] [--dry-run] [--run-id <id>] [--ws <alias>] [--no-cache] [--no-reindex] [--json]",
    ],
    args: [
      { name: "template", required: true, source: "<template>", description: "Loop template node id/qid or seed template name/ref." },
    ],
    flags: [
      { name: "--scope", value: "<scope>", required: true, description: "Scope ref, qid, URI, path, or description for the scoped loop." },
      { name: "--title", value: "<title>", required: false, description: "Override the generated scoped loop title." },
      { name: "--materialization", value: "<mode>", required: false, description: "Child materialization mode: default_children, planning_only, or manual." },
      { name: "--planning-only", value: null, required: false, description: "Create only the scoped loop shell." },
      { name: "--no-children", value: null, required: false, description: "Alias for planning-only materialization." },
      { name: "--dry-run", value: null, required: false, description: "Plan the fork without writing loop or child nodes." },
      RUN_ID_FLAG,
      ROOT_FLAG,
      WS_FLAG,
      JSON_FLAG,
      NO_CACHE_FLAG,
      NO_REINDEX_FLAG,
    ],
    output_formats: ["text", "json"],
    notes: [
      "Seed templates resolve from .mdkg/templates/loops/<name>.loop.md.",
      "Default forks create a scoped loop plus linked spike/task/test child nodes.",
    ],
    safety: LOOP_GRAPH_WRITE_SAFETY,
    handler: "runLoopForkCommand",
  },
  {
    key: "loop plan",
    path: ["loop", "plan"],
    summary: "mdkg loop plan command",
    usage: ["mdkg loop plan <loop> [--ws <alias>] [--no-cache] [--no-reindex] [--json]"],
    args: [
      { name: "loop", required: true, source: "<loop>", description: "Loop node id or qid." },
    ],
    flags: READ_FLAGS,
    output_formats: ["text", "json"],
    notes: ["Read-only readiness cockpit for loop execution planning."],
    safety: { ...READ_ONLY_LOOP_SAFETY, receipts: ["loop-plan-receipt"] },
    handler: "runLoopPlanCommand",
  },
  {
    key: "loop next",
    path: ["loop", "next"],
    summary: "mdkg loop next command",
    usage: ["mdkg loop next <loop> [--ws <alias>] [--no-cache] [--no-reindex] [--json]"],
    args: [
      { name: "loop", required: true, source: "<loop>", description: "Loop node id or qid." },
    ],
    flags: READ_FLAGS,
    output_formats: ["text", "json"],
    notes: ["Read-only routing for the next actionable child, readiness lane, or blocker recovery step."],
    safety: { ...READ_ONLY_LOOP_SAFETY, receipts: ["loop-next-receipt"] },
    handler: "runLoopNextCommand",
  },
  {
    key: "loop runs",
    path: ["loop", "runs"],
    summary: "mdkg loop runs command",
    usage: ["mdkg loop runs <loop> [--ws <alias>] [--no-cache] [--no-reindex] [--json]"],
    args: [
      { name: "loop", required: true, source: "<loop>", description: "Loop node id or qid." },
    ],
    flags: READ_FLAGS,
    output_formats: ["text", "json"],
    notes: ["Lists run refs and evidence refs without executing runtime jobs."],
    safety: { ...READ_ONLY_LOOP_SAFETY, receipts: ["loop-runs-receipt"] },
    handler: "runLoopRunsCommand",
  },
];

export function loopDescriptorForSubcommand(subcommand?: string): LoopCommandDescriptor {
  const key = subcommand ? `loop ${subcommand.toLowerCase()}` : "loop";
  return LOOP_COMMAND_DESCRIPTORS.find((descriptor) => descriptor.key === key) ?? LOOP_COMMAND_DESCRIPTORS[0]!;
}
