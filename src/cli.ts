#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { parseArgs } from "./util/argparse";
import { ParsedArgs } from "./util/argparse";
import { runIndexCommand } from "./commands/index";
import { runListCommand } from "./commands/list";
import { runSearchCommand } from "./commands/search";
import { runShowCommand } from "./commands/show";
import { runPackCommand } from "./commands/pack";
import { runHandoffCreateCommand } from "./commands/handoff";
import { runNextCommand } from "./commands/next";
import { runValidateCommand } from "./commands/validate";
import { runFormatCommand } from "./commands/format";
import { runDoctorCommand } from "./commands/doctor";
import { runStatusCommand } from "./commands/status";
import { runMcpServeCommand } from "./commands/mcp";
import { runFixApplyCommand, runFixIdsCommand, runFixPlanCommand } from "./commands/fix";
import {
  runDbInitCommand,
  runDbIndexRebuildCommand,
  runDbIndexStatusCommand,
  runDbIndexVerifyCommand,
  runDbMigrateCommand,
  runDbQueueAckCommand,
  runDbQueueClaimCommand,
  runDbQueueContractCommand,
  runDbQueueCreateCommand,
  runDbQueueDeadLetterCommand,
  runDbQueueEnqueueCommand,
  runDbQueueFailCommand,
  runDbQueueListCommand,
  runDbQueuePauseCommand,
  runDbQueueReleaseExpiredCommand,
  runDbQueueResumeCommand,
  runDbQueueShowCommand,
  runDbQueueStatsCommand,
  runDbSnapshotDiffCommand,
  runDbSnapshotDumpCommand,
  runDbSnapshotSealCommand,
  runDbSnapshotStatusCommand,
  runDbSnapshotVerifyCommand,
  runDbStatsCommand,
  runDbVerifyCommand,
} from "./commands/db";
import {
  runCapabilityListCommand,
  runCapabilityResolveCommand,
  runCapabilitySearchCommand,
  runCapabilityShowCommand,
} from "./commands/capability";
import {
  runManifestListCommand,
  runManifestShowCommand,
  runManifestValidateCommand,
  runSpecListCommand,
  runSpecShowCommand,
  runSpecValidateCommand,
} from "./commands/spec";
import {
  runArchiveAddCommand,
  runArchiveCompressCommand,
  runArchiveListCommand,
  runArchiveShowCommand,
  runArchiveVerifyCommand,
} from "./commands/archive";
import {
  runBundleCreateCommand,
  runBundleListCommand,
  runBundleShowCommand,
  runBundleVerifyCommand,
} from "./commands/bundle";
import {
  runGraphCloneCommand,
  runGraphForkCommand,
  runGraphImportTemplateCommand,
  runGraphRefsCommand,
} from "./commands/graph";
import {
  runGitCloneCommand,
  runGitCloseoutCommand,
  runGitFetchCommand,
  runGitInspectCommand,
  runGitPushCommand,
  runGitPushReadyCommand,
} from "./commands/git";
import {
  runSubgraphAddCommand,
  runSubgraphAuditCommand,
  runSubgraphDisableCommand,
  runSubgraphEnableCommand,
  runSubgraphListCommand,
  runSubgraphMaterializeCommand,
  runSubgraphRefreshCommand,
  runSubgraphRemoveCommand,
  runSubgraphShowCommand,
  runSubgraphSyncCommand,
  runSubgraphUpgradePlanCommand,
  runSubgraphVerifyCommand,
} from "./commands/subgraph";
import { runCheckpointNewCommand } from "./commands/checkpoint";
import { runInitCommand } from "./commands/init";
import { runNewCommand } from "./commands/new";
import { runGuideCommand } from "./commands/guide";
import { runUpgradeCommand } from "./commands/upgrade";
import {
  runLoopForkCommand,
  runLoopListCommand,
  runLoopNextCommand,
  runLoopPlanCommand,
  runLoopRunsCommand,
  runLoopShowCommand,
} from "./commands/loop";
import { loopDescriptorForSubcommand } from "./commands/loop_descriptors";
import type { LoopCommandDescriptor } from "./commands/loop_descriptors";
import {
  runGoalActivateCommand,
  runGoalArchiveCommand,
  runGoalClaimCommand,
  runGoalClearCommand,
  runGoalCurrentCommand,
  runGoalDoneCommand,
  runGoalEvaluateCommand,
  runGoalNextCommand,
  runGoalPauseCommand,
  runGoalResumeCommand,
  runGoalSelectCommand,
  runGoalShowCommand,
} from "./commands/goal";
import { runEventAppendCommand, runEventEnableCommand } from "./commands/event";
import {
  runSkillListCommand,
  runSkillNewCommand,
  runSkillSearchCommand,
  runSkillShowCommand,
  runSkillSyncCommand,
  runSkillValidateCommand,
} from "./commands/skill";
import { runTaskDoneCommand, runTaskStartCommand, runTaskUpdateCommand } from "./commands/task";
import {
  runWorkArtifactAddCommand,
  runWorkContractNewCommand,
  runWorkOrderNewCommand,
  runWorkOrderStatusCommand,
  runWorkOrderUpdateCommand,
  runWorkReceiptNewCommand,
  runWorkReceiptUpdateCommand,
  runWorkReceiptVerifyCommand,
  runWorkTriggerCommand,
  runWorkValidateCommand,
} from "./commands/work";
import {
  runWorkspaceAddCommand,
  runWorkspaceDisableCommand,
  runWorkspaceEnableCommand,
  runWorkspaceListCommand,
  runWorkspaceRemoveCommand,
} from "./commands/workspace";
import { listPackProfiles } from "./pack/profile";
import { NotFoundError, UsageError, ValidationError } from "./util/errors";
import { QueryOutputFormat } from "./commands/query_output";

type LogFn = (...args: unknown[]) => void;
type ExitCode = 0 | 1 | 2 | 3 | 4;

export type CliRuntime = {
  log?: LogFn;
  error?: LogFn;
  cwd?: () => string;
};

type ResolvedCliRuntime = {
  log: LogFn;
  error: LogFn;
  cwd: () => string;
};

function resolveRuntime(runtime: CliRuntime = {}): ResolvedCliRuntime {
  return {
    log: runtime.log ?? console.log,
    error: runtime.error ?? console.error,
    cwd: runtime.cwd ?? (() => process.cwd()),
  };
}

function printGlobalOptions(log: LogFn): void {
  log("\nGlobal options:");
  log("  --root, -r <path>   Run against a specific repo root");
  log("  --help, -h          Show help");
  log("  --version, -V       Show version");
}

function printUsage(log: LogFn): void {
  log("mdkg - Markdown Knowledge Graph");
  log("\nUsage:");
  log("  mdkg <command> [options]");
  log("\nPrimary commands:");
  log("  init        Initialize .mdkg scaffolding");
  log("  upgrade     Conservatively upgrade mdkg scaffolding");
  log("  new         Create a node from templates");
  log("  show        Show a node by id or qid");
  log("  list        List nodes with filters");
  log("  search      Search nodes by query");
  log("  pack        Generate a context pack");
  log("  handoff     Create sanitized agent handoff prompts from graph context");
  log("  skill       Create, list, show, search, and validate skills");
  log("  capability  List, search, show, and resolve cached capability surfaces");
  log("  manifest    List, show, and validate MANIFEST.md/SPEC.md capability records");
  log("  spec        Legacy alias for `mdkg manifest` during the compatibility bridge");
  log("  archive     Add, list, show, verify, and compress archive sidecars");
  log("  bundle      Create, list, show, and verify full graph snapshot bundles");
  log("  graph       Clone, fork, import, and inspect mdkg graph references");
  log("  git         Clone, fetch, inspect, close out, and push Git-backed mdkg projects");
  log("  subgraph    Register, audit, plan, sync, materialize, and verify read-only child graph snapshots");
  log("  work        Create and update work contracts, orders, receipts, and artifacts");
  log("  loop        List, show, fork, plan, and inspect first-class loop nodes");
  log("  goal        Inspect and advance recursive goal nodes");
  log("  task        Start, update, and complete task-like nodes");
  log("  next        Suggest the next work item");
  log("  validate    Validate frontmatter + graph");
  log("  status      Show read-only operator health summary");
  log("  mcp         Serve local read-only MCP tools over stdio");
  log("  fix         Plan read-only repairs with receipt-shaped JSON");
  log("\nAdvanced / maintenance commands:");
  log("  db          Project database and index-cache commands");
  log("  event       Enable or append episodic event logs");
  log("  checkpoint  Create a checkpoint node");
  log("  index       Build the global index");
  log("  guide       Show the mdkg guide");
  log("  format      Normalize frontmatter");
  log("  doctor      Run install and workspace diagnostics");
  log("  workspace   Manage workspaces (ls/add/rm/enable/disable)");
  log("\nQuickstart:");
  log("  mdkg init --agent");
  log("  mdkg upgrade");
  log("  mdkg upgrade --apply");
  log('  mdkg new task "..." --status todo --priority 1');
  log('  mdkg search "..."');
  log("  mdkg show <id>");
  log("  mdkg next");
  log("  mdkg pack <id>");
  log("  mdkg pack <id> --profile concise --dry-run --stats");
  log("  mdkg task start <id>");
  log('  mdkg skill new release-readiness "release readiness audit" --description "use when preparing a release"');
  log("  mdkg skill list --tags stage:plan --json");
  log("  mdkg validate");
  log("\nAgent-ready bootstrap:");
  log("  mdkg init --agent");
  log("\nRun `mdkg help <command>` or `mdkg <command> --help` for details.");
  printGlobalOptions(log);
}

function printInitHelp(log: LogFn): void {
  log("Usage:");
  log("  mdkg init [options]");
  log("\nOptions:");
  log("  --force               Overwrite existing mdkg files");
  log("  --agent               Create the complete agent bootstrap, skills, events, and mirrors");
  log("  --no-update-ignores   Skip default .gitignore/.npmignore updates");
  log("  --update-gitignore    Append mdkg ignore entries");
  log("  --update-npmignore    Append mdkg ignore entries");
  log("  --update-dockerignore Append mdkg ignore entries");
  printGlobalOptions(log);
}

function printUpgradeHelp(log: LogFn): void {
  log("Usage:");
  log("  mdkg upgrade [--dry-run] [--apply] [--json]");
  log("\nOptions:");
  log("  --dry-run             Preview upgrade changes without writing files (default)");
  log("  --apply               Apply safe managed init asset upgrades");
  log("  --json                Emit machine-readable upgrade receipt");
  log("\nNotes:");
  log("  - preserves customized docs, templates, skills, and core files");
  log("  - json receipts include safe_to_apply, will_write_paths, and apply_side_effects");
  log("  - upgrades default mdkg skills only when they match managed seed fingerprints");
  log("  - skips ignored event logs; run mdkg event enable if provenance should be restored");
  log("  - run without flags first, then rerun with --apply when the receipt looks right");
  printGlobalOptions(log);
}

function printNewHelp(log: LogFn): void {
  log("Usage:");
  log('  mdkg new <type> "<title>" [options] [--json]');
  log("\nTypes:");
  log("  rule prd edd dec prop loop goal epic feat task bug spike checkpoint test");
  log("\nAgent workflow file types:");
  log("  manifest work work_order receipt feedback dispute proposal");
  log("  spec is a legacy alias for manifest and emits MANIFEST.md during the compatibility bridge.");
  log("  Use --id <portable-id> with these types for semantic ids like agent.image-worker.");
  log("  Use `mdkg archive add` for archive sidecars instead of `mdkg new archive`.");
  log("\nOptions:");
  log("  --id <portable-id>         Explicit id for agent workflow file types");
  log("  --ws <alias>               Workspace alias (default root)");
  log("  --status <status>          Work item or decision status");
  log("  --priority <0..9>          Work item priority");
  log("  --epic <id>                Epic id");
  log("  --tags <tag,tag,...>       Tags");
  log("  --skills <slug,slug,...>   Skill slugs for work items");
  log("  --template <set>           Template set");
  log("  --run-id <id>              Optional event run id when event logging is enabled");
  log("  --contract-profile <name>  Optional MANIFEST/WORK/WORK_ORDER/RECEIPT validation profile metadata");
  log("  --validation-policy-ref <ref> Optional MANIFEST/WORK_ORDER/RECEIPT validation policy ref");
  log("  --evidence-policy-ref <ref> Optional MANIFEST/WORK_ORDER/RECEIPT evidence policy ref");
  log("  --receipt-kind <kind>      Optional RECEIPT kind metadata");
  log("  --redaction-class <class>  Optional RECEIPT redaction class metadata");
  log("\nAdvanced metadata flags:");
  log("  --parent --prev --next --relates --blocked-by --blocks");
  log("  --links --artifacts --refs --aliases --owners --cases --supersedes");
  log("  --owners <owner,owner,...> Owners");
  log("\nNotes:");
  log("  manifest/work scaffold as validation-clean docs; relational workflow docs need real refs.");
  log("  mdkg new spec is deprecated; use mdkg new manifest for new reusable capability manifests.");
  log("  spike creates actionable research/planning work; use `mdkg task ...` for lifecycle.");
  log("  record spike research evidence by editing the Markdown body sections.");
  log("  spikes do not run web search, create follow-up nodes, generate SKILL.md, or expose `mdkg spike ...`.");
  printGlobalOptions(log);
}

function printLoopHelp(log: LogFn, subcommand?: string): void {
  printLoopDescriptorHelp(log, loopDescriptorForSubcommand(subcommand));
}

function printLoopDescriptorHelp(log: LogFn, descriptor: LoopCommandDescriptor): void {
  log("Usage:");
  for (const usage of descriptor.usage) {
    log(`  ${usage}`);
  }
  if (descriptor.key === "loop fork") {
    log("\nMaterialization modes:");
    log("  default_children planning_only manual");
  }
  const commandFlags = descriptor.flags.filter((flag) => flag.name !== "--root");
  if (commandFlags.length > 0) {
    log("\nOptions:");
    for (const flag of commandFlags) {
      const syntax = flag.value ? `${flag.name} ${flag.value}` : flag.name;
      log(`  ${syntax.padEnd(28)} ${flag.description}`);
    }
  }
  if (descriptor.notes.length > 0) {
    log("\nNotes:");
    for (const note of descriptor.notes) {
      log(`  ${note}`);
    }
  }
  printGlobalOptions(log);
}

function printGuideHelp(log: LogFn): void {
  log("Usage:");
  log("  mdkg guide");
  printGlobalOptions(log);
}

function printWorkspaceHelp(log: LogFn): void {
  log("Usage:");
  log("  mdkg workspace ls [--json]");
  log("  mdkg workspace add <alias> <path> [--mdkg-dir <dir>] [--visibility <level>] [--json]");
  log("  mdkg workspace rm <alias> [--json]");
  log("  mdkg workspace enable <alias> [--json]");
  log("  mdkg workspace disable <alias> [--json]");
  log("\nVisibility levels:");
  log("  private internal public");
  printGlobalOptions(log);
}

function printIndexHelp(log: LogFn): void {
  log("Usage:");
  log("  mdkg index [--tolerant]");
  log("\nWrites:");
  log("  - .mdkg/index/global.json");
  log("  - .mdkg/index/skills.json");
  log("  - .mdkg/index/capabilities.json");
  log("  - .mdkg/index/subgraphs.json when subgraphs are configured");
  log("  - .mdkg/index/mdkg.sqlite when index.backend is sqlite");
  printGlobalOptions(log);
}

function printDbHelp(log: LogFn, subcommand?: string): void {
  switch ((subcommand ?? "").toLowerCase()) {
    case "index":
      log("Usage:");
      log("  mdkg db index rebuild [--tolerant] [--json]");
      log("  mdkg db index status [--json]");
      log("  mdkg db index verify [--json]");
      log("\nNotes:");
      log("  - `mdkg index` remains the compatibility shortcut for index rebuilds");
      log("  - `.mdkg/index` is the rebuildable graph cache, not project application state");
      printGlobalOptions(log);
      return;
    case "snapshot":
      log("Usage:");
      log("  mdkg db snapshot seal [--queue-policy drain|paused] [--json]");
      log("  mdkg db snapshot verify [--json]");
      log("  mdkg db snapshot status [--json]");
      log("  mdkg db snapshot dump [--snapshot <path>] [--output <path>] [--json]");
      log("  mdkg db snapshot diff <left-snapshot> <right-snapshot> [--json]");
      log("\nBoundaries:");
      log("  - snapshot seal writes a clean opt-in sealed project DB checkpoint");
      log("  - default queue policy is drain: no ready or leased queue messages");
      log("  - paused queue policy allows ready messages only in paused queues and never leased messages");
      log("  - snapshot verify/status read `.mdkg/db/state/project.sqlite` and its manifest");
      log("  - snapshot dump/diff are deterministic review aids, not source of truth");
      log("  - active runtime/WAL files remain ignored by default");
      printGlobalOptions(log);
      return;
    case "queue":
      log("Usage:");
      log("  mdkg db queue create <queue> [--paused] [--reason <text>] [--json]");
      log("  mdkg db queue pause <queue> [--reason <text>] [--json]");
      log("  mdkg db queue resume <queue> [--json]");
      log("  mdkg db queue enqueue <queue> <message-id> --payload-json <json>|--payload-file <path> [--dedupe-key <key>] [--available-at-ms <ms>] [--max-attempts <n>] [--json]");
      log("  mdkg db queue claim <queue> --lease-owner <owner> --lease-ms <ms> [--json]");
      log("  mdkg db queue ack <queue> <message-id> --lease-owner <owner> [--json]");
      log("  mdkg db queue fail <queue> <message-id> --lease-owner <owner> --error <text> [--retry-after-ms <ms>] [--json]");
      log("  mdkg db queue dead-letter <queue> <message-id> --lease-owner <owner> --error <text> [--json]");
      log("  mdkg db queue release-expired [queue] [--json]");
      log("  mdkg db queue stats [queue] [--json]");
      log("  mdkg db queue list <queue> [--status ready|leased|acked|dead_letter|all] [--limit <n>] [--json]");
      log("  mdkg db queue show <queue> <message-id> [--json]");
      log("  mdkg db queue contract [--json]");
      log("\nSemantics:");
      log("  - queues are durable local delivery state, not canonical event history");
      log("  - contract is read-only adapter metadata and does not require an initialized project DB");
      log("  - paused queues reject enqueue and claim");
      log("  - ack, fail, dead-letter, and release-expired are allowed while paused so leased work can settle");
      log("  - no raw SQL or hosted queue dependency is exposed");
      printGlobalOptions(log);
      return;
    default:
      log("Usage:");
      log("  mdkg db index rebuild [--tolerant] [--json]");
      log("  mdkg db index status [--json]");
      log("  mdkg db index verify [--json]");
      log("  mdkg db init [--json]");
      log("  mdkg db migrate [--json]");
      log("  mdkg db verify [--json]");
      log("  mdkg db stats [--json]");
      log("  mdkg db queue create <queue> [--paused] [--reason <text>] [--json]");
      log("  mdkg db queue enqueue <queue> <message-id> --payload-json <json>|--payload-file <path> [--json]");
      log("  mdkg db queue claim <queue> --lease-owner <owner> --lease-ms <ms> [--json]");
      log("  mdkg db queue ack|fail|dead-letter <queue> <message-id> --lease-owner <owner> [--json]");
      log("  mdkg db queue pause|resume <queue> [--json]");
      log("  mdkg db queue stats|list|show ... [--json]");
      log("  mdkg db queue contract [--json]");
      log("  mdkg db snapshot seal [--queue-policy drain|paused] [--json]");
      log("  mdkg db snapshot verify [--json]");
      log("  mdkg db snapshot status [--json]");
      log("  mdkg db snapshot dump [--snapshot <path>] [--output <path>] [--json]");
      log("  mdkg db snapshot diff <left-snapshot> <right-snapshot> [--json]");
      log("\nBoundaries:");
      log("  - `.mdkg/index` is the rebuildable graph cache");
      log("  - `.mdkg/db` is project application state");
      log("  - `mdkg db init` creates the generic layout and enables db config");
      log("  - `mdkg db init` does not create an active runtime SQLite database");
      log("  - `mdkg db migrate` creates/updates the active runtime SQLite database");
      log("  - `mdkg db migrate` applies mdkg-owned foundation plus internal queue, event, receipt, reducer, and lease migrations");
      log("  - `mdkg db queue ...` exposes local durable queue delivery operations");
      log("  - paused queues reject enqueue/claim and can be sealed with explicit paused snapshot policy");
      log("  - event rows are durable local history; receipts, reducers, and writer leases remain internal helper surfaces");
      log("  - no public `mdkg db event`, `mdkg db reducer`, or `mdkg db lease` CLI is exposed");
      log("  - `mdkg db verify` checks config, layout, SQLite integrity, migrations, and transient files");
      log("  - `mdkg db stats` reports table counts, migration state, DB size, and receipt counts");
      log("  - `mdkg db snapshot ...` manages opt-in sealed checkpoints and review dumps");
      log("  - active `.mdkg/db/runtime` and transient DB files are ignored by default");
      log("  - no raw SQL, hosted queue/event store, profile, public event/reducer/lease command, or publish behavior is exposed here");
      printGlobalOptions(log);
  }
}

function printShowHelp(log: LogFn): void {
  log("Usage:");
  log("  mdkg show <id-or-qid> [--ws <alias>] [--meta] [--json|--xml|--toon|--md]");
  log("\nWhen to use:");
  log("  Inspect one mdkg node exactly. Use `mdkg skill show <slug>` for skills.");
  log("\nDefault behavior:");
  log("  Shows full body content. Use --meta for card + metadata only.");
  printGlobalOptions(log);
}

function printListHelp(log: LogFn): void {
  log("Usage:");
  log("  mdkg list [--type <type>] [--status <status>] [--ws <alias>] [--epic <id>]");
  log("           [--priority <n>] [--blocked] [--tags <tag,tag,...>] [--tags-mode any|all]");
  log("           [--json|--xml|--toon|--md]");
  log("\nWhen to use:");
  log("  List mdkg nodes. Use `mdkg skill list` for skills.");
  printGlobalOptions(log);
}

function printSearchHelp(log: LogFn): void {
  log("Usage:");
  log('  mdkg search "<query>" [--type <type>] [--status <status>] [--ws <alias>]');
  log("               [--tags <tag,tag,...>] [--tags-mode any|all] [--limit <n>] [--json|--xml|--toon|--md]");
  log("\nWhen to use:");
  log("  Search mdkg nodes by metadata. Use `mdkg skill search` for skills.");
  log("  Structured output defaults to a bounded page and reports count, returned_count, limit, and truncated.");
  printGlobalOptions(log);
}

function printPackHelp(log: LogFn): void {
  log("Usage:");
  log("  mdkg pack <id-or-qid> [options]");
  log("  mdkg pack --list-profiles");
  log("\nOptions:");
  log("  -w, --ws <alias>             Workspace hint when resolving ambiguous ids");
  log("  -v, --verbose                Include pinned core docs from .mdkg/core/core.md");
  log("  -f, --format <fmt>           Output format: md|json|toon|xml (default md)");
  log("  -o, --out <path>             Output file path");
  log("      --profile <name>         Body profile: standard|concise|headers (default standard)");
  log("      --visibility <level>     Filter output: public|internal|private");
  log("      --skills <mode>          Skill inclusion: none|auto|<slug,slug,...> (default auto)");
  log("      --skills-depth <mode>    Skill body mode: meta|full (default meta)");
  log("      --dry-run                Preview selection/order/stats without writing files");
  log("      --stats                  Print per-node + total pack stats and write stats sidecar JSON");
  log("      --list-profiles          List built-in pack profiles and exit");
  log("\nAdvanced shaping / debug flags:");
  log("  --depth --edges --strip-code --max-code-lines --max-chars --max-lines --max-tokens");
  log("  --edges accepts parent, epic, relates, blocked_by, blocks, prev, next, context_refs, evidence_refs");
  log("  --truncation-report --stats-out");
  log("\nExamples:");
  log("  mdkg pack --list-profiles");
  log("  mdkg pack task-1");
  log("  mdkg pack task-1 --profile concise --dry-run --stats");
  log("  mdkg pack task-1 --visibility public --dry-run");
  log("  mdkg pack task-1 --edges context_refs,evidence_refs --format json");
  log("  mdkg pack task-1 --skills auto --skills-depth full");
  log("  mdkg pack epic-2 --format json --profile headers");
  printGlobalOptions(log);
}

function printPackProfiles(log: LogFn): void {
  const profiles = listPackProfiles();
  log("Built-in pack profiles:");
  for (const entry of profiles) {
    log(`- ${entry.profile} (body=${entry.bodyMode})`);
    log(`  ${entry.description}`);
    if (entry.defaults.length > 0) {
      log(`  defaults: ${entry.defaults.join(", ")}`);
    }
  }
}

function printHandoffHelp(log: LogFn): void {
  log("Usage:");
  log("  mdkg handoff create <id-or-qid> [--ws <alias>] [--depth <n>] [--out <path>] [--json]");
  log("\nPurpose:");
  log("  - create a sanitized, copy-ready agent handoff from mdkg graph context");
  log("  - summarize goal/work state, included pack nodes, latest checkpoint, boundaries, required checks, and next actions");
  log("  - include raw secret, prompt, token, or payload marker warnings without copying raw node bodies into the handoff");
  log("  - use pack traversal with context_refs and evidence_refs for background and proof nodes");
  log("\nBoundaries:");
  log("  - handoff create does not execute work, mutate graph nodes, or generate detailed node content");
  log("  - --out must stay inside the repo root");
  printGlobalOptions(log);
}

function printSkillHelp(log: LogFn, subcommand?: string): void {
  switch ((subcommand ?? "").toLowerCase()) {
    case "new":
      log("Usage:");
      log('  mdkg skill new <slug> "<name>" --description "<description>" [options] [--json]');
      log("\nOptions:");
      log("  --tags <tag,tag,...>         Optional skill tags");
      log("  --authors <name,name,...>    Optional authors list");
      log("  --links <url,url,...>        Optional links list");
      log("  --run-id <id>                Optional event run id when event logging is enabled");
      log("  --with-scripts               Create scripts/ in the scaffold");
      log("  --force                      Overwrite existing SKILL.md");
      printGlobalOptions(log);
      return;
    case "list":
      log("Usage:");
      log("  mdkg skill list [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]");
      log("\nWhen to use:");
      log("  Discover skills directly, including stage-tagged orchestrator lookups.");
      printGlobalOptions(log);
      return;
    case "show":
      log("Usage:");
      log("  mdkg skill show <slug> [--meta] [--json|--xml|--toon|--md]");
      log("\nWhen to use:");
      log("  Inspect one skill body or metadata after discovery.");
      printGlobalOptions(log);
      return;
    case "search":
      log("Usage:");
      log('  mdkg skill search "<query>" [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]');
      log("\nWhen to use:");
      log("  Search skills by trigger text, tags, and stage conventions like `stage:plan`.");
      printGlobalOptions(log);
      return;
    case "validate":
      log("Usage:");
      log("  mdkg skill validate [<slug>] [--json]");
      printGlobalOptions(log);
      return;
    case "sync":
      log("Usage:");
      log("  mdkg skill sync [--force] [--json]");
      log("\nWhen to use:");
      log("  Rebuild configured skill mirror targets from canonical .mdkg/skills.");
      log("  Defaults are .agents/skills and .claude/skills; add custom targets in .mdkg/config.json.");
      printGlobalOptions(log);
      return;
    default:
      log("Usage:");
      log('  mdkg skill new <slug> "<name>" --description "<description>" [options] [--json]');
      log("  mdkg skill list [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]");
      log("  mdkg skill show <slug> [--meta] [--json|--xml|--toon|--md]");
      log('  mdkg skill search "<query>" [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]');
      log("  mdkg skill validate [<slug>] [--json]");
      log("  mdkg skill sync [--force] [--json]");
      log("\nNotes:");
      log("  Skills are first-class under `mdkg skill ...`.");
      log("  Use stage tags like `stage:plan`, `stage:execute`, and `stage:review` with --tags.");
      printGlobalOptions(log);
  }
}

function printCapabilityHelp(log: LogFn, subcommand?: string): void {
  switch ((subcommand ?? "").toLowerCase()) {
    case "list":
      log("Usage:");
      log("  mdkg capability list [--kind <kind>] [--visibility <level>] [--json]");
      log("\nKinds:");
      log("  skill spec work core design");
      printGlobalOptions(log);
      return;
    case "search":
      log("Usage:");
      log('  mdkg capability search "<query>" [--kind <kind>] [--visibility <level>] [--json]');
      log("\nKinds:");
      log("  skill spec work core design");
      printGlobalOptions(log);
      return;
    case "show":
      log("Usage:");
      log("  mdkg capability show <id-or-qid-or-slug> [--json]");
      printGlobalOptions(log);
      return;
    case "resolve":
      log("Usage:");
      log('  mdkg capability resolve [query] [--requires <capability>] [--fresh-only] [--json]');
      log("\nNotes:");
      log("  Resolves local and subgraph capabilities with deterministic ranking.");
      printGlobalOptions(log);
      return;
    default:
      log("Usage:");
      log("  mdkg capability list [--kind <kind>] [--visibility <level>] [--json]");
      log('  mdkg capability search "<query>" [--kind <kind>] [--visibility <level>] [--json]');
      log("  mdkg capability show <id-or-qid-or-slug> [--json]");
      log('  mdkg capability resolve [query] [--requires <capability>] [--fresh-only] [--json]');
      log("\nNotes:");
      log("  Capability records are deterministic cache projections from Markdown.");
      log("  Cached kinds: skill, spec, work, core, design.");
      log("  Resolve includes read-only subgraph capability records when configured.");
      printGlobalOptions(log);
  }
}

function printSpecHelp(log: LogFn, subcommand?: string, surface: "manifest" | "spec" = "spec"): void {
  const command = surface === "manifest" ? "manifest" : "spec";
  const legacyNote =
    surface === "spec"
      ? "  `mdkg spec` is the legacy alias for `mdkg manifest` during the compatibility bridge."
      : undefined;
  switch ((subcommand ?? "").toLowerCase()) {
    case "list":
      log("Usage:");
      log(`  mdkg ${command} list [--json]`);
      log("\nNotes:");
      log("  MANIFEST.md is canonical; SPEC.md remains a legacy alias for reusable capability surfaces.");
      if (legacyNote) {
        log(legacyNote);
      }
      printGlobalOptions(log);
      return;
    case "show":
      log("Usage:");
      log(`  mdkg ${command} show <id-or-qid-or-alias> [--json]`);
      log("\nNotes:");
      log("  Shows one MANIFEST.md/SPEC.md capability record from the capability index.");
      if (legacyNote) {
        log(legacyNote);
      }
      printGlobalOptions(log);
      return;
    case "validate":
      log("Usage:");
      log(`  mdkg ${command} validate [<id-or-qid-or-alias>] [--json]`);
      log("\nNotes:");
      log("  With no reference, validates the graph and all MANIFEST.md/SPEC.md capability records.");
      log("  With a reference, also ensures that the specific manifest capability exists.");
      if (legacyNote) {
        log(legacyNote);
      }
      printGlobalOptions(log);
      return;
    default:
      log("Usage:");
      log(`  mdkg ${command} list [--json]`);
      log(`  mdkg ${command} show <id-or-qid-or-alias> [--json]`);
      log(`  mdkg ${command} validate [<id-or-qid-or-alias>] [--json]`);
      log("\nNotes:");
      log("  MANIFEST.md is canonical and reusable-capability oriented; SPEC.md remains a legacy alias.");
      if (legacyNote) {
        log(legacyNote);
      }
      log("  Use `mdkg capability ...` for broader skill, MANIFEST.md/SPEC.md, WORK.md, core-doc, and design-doc discovery.");
      printGlobalOptions(log);
  }
}

function printArchiveHelp(log: LogFn, subcommand?: string): void {
  switch ((subcommand ?? "").toLowerCase()) {
    case "add":
      log("Usage:");
      log("  mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--title <title>] [--refs <...>] [--relates <...>] [--json]");
      break;
    case "list":
      log("Usage:");
      log("  mdkg archive list [--kind source|artifact] [--visibility private|internal|public] [--ws <alias>] [--json]");
      break;
    case "show":
      log("Usage:");
      log("  mdkg archive show <id-or-archive-uri> [--ws <alias>] [--json]");
      break;
    case "verify":
      log("Usage:");
      log("  mdkg archive verify [id-or-archive-uri] [--ws <alias>] [--json]");
      break;
    case "compress":
      log("Usage:");
      log("  mdkg archive compress <id-or-archive-uri> [--ws <alias>] [--json]");
      log("  mdkg archive compress --all [--json]");
      break;
    default:
      log("Usage:");
      log("  mdkg archive add <file> [--id <archive.id>] [--kind source|artifact] [--visibility private|internal|public] [--json]");
      log("  mdkg archive list [--kind source|artifact] [--visibility private|internal|public] [--json]");
      log("  mdkg archive show <id-or-archive-uri> [--json]");
      log("  mdkg archive verify [id-or-archive-uri] [--json]");
      log("  mdkg archive compress <id-or-archive-uri|--all> [--json]");
      log("\nNotes:");
      log("  - archive add copies the source, writes a sidecar, and writes a deterministic zip cache");
      log("  - archive visibility defaults to private");
      log("  - archive://<archive.id> refs are validated against local archive sidecars");
      log("  - archive verify checks sidecar and zip payload integrity; missing raw source copies are ok when the zip cache is valid");
  }
  printGlobalOptions(log);
}

function printBundleHelp(log: LogFn, subcommand?: string): void {
  switch ((subcommand ?? "").toLowerCase()) {
    case "import":
      log("Usage:");
      log("  mdkg subgraph add/list/show/rm/enable/disable/verify/refresh/audit/upgrade-plan/sync/materialize ...");
      log("\n`mdkg bundle import` has been replaced by `mdkg subgraph`.");
      break;
    case "create":
      log("Usage:");
      log("  mdkg bundle create [--profile private|public] [--ws <alias|all>] [--output <path>] [--json]");
      break;
    case "verify":
      log("Usage:");
      log("  mdkg bundle verify [bundle-path] [--json]");
      break;
    case "show":
      log("Usage:");
      log("  mdkg bundle show <bundle-path> [--json]");
      break;
    case "list":
      log("Usage:");
      log("  mdkg bundle list [--json]");
      break;
    default:
      log("Usage:");
      log("  mdkg bundle create [--profile private|public] [--ws <alias|all>] [--output <path>] [--json]");
      log("  mdkg bundle verify [bundle-path] [--json]");
      log("  mdkg bundle show <bundle-path> [--json]");
      log("  mdkg bundle list [--json]");
      log("\nNotes:");
      log("  - bundles are explicit full .mdkg graph snapshots, not task context packs");
      log("  - use `mdkg subgraph ...` to register bundle snapshots as read-only planning views");
      log("  - private is the default profile; public bundles fail closed on private refs");
      log("  - .mdkg/bundles/ is commit-eligible when your repo tracks snapshot bundles");
  }
  printGlobalOptions(log);
}

function printGraphHelp(log: LogFn, subcommand?: string): void {
  switch ((subcommand ?? "").toLowerCase()) {
    case "clone":
      log("Usage:");
      log("  mdkg graph clone <source-bundle-or-mdkg-dir> --target <path> [--json]");
      log("\nNotes:");
      log("  - clones a complete graph into an empty contained target directory");
      log("  - preserves IDs because the target is a separate graph namespace");
      log("  - source bundle or source directory is never mutated");
      break;
    case "fork":
      log("Usage:");
      log("  mdkg graph fork <source-bundle-or-mdkg-dir> --target <path> [--start-goal <goal-id>] [--json]");
      log("\nNotes:");
      log("  - forks a complete graph into an empty contained target directory");
      log("  - preserves IDs and can select a start goal in the target graph");
      log("  - source bundle or source directory is never mutated");
      break;
    case "import-template":
      log("Usage:");
      log("  mdkg graph import-template <source-bundle-or-mdkg-dir> [--start-goal <goal-id>] [--select-goal] [--id-prefix <prefix>] [--dry-run] [--apply] [--json]");
      log("\nNotes:");
      log("  - imports authored .mdkg/work template nodes into the current graph");
      log("  - defaults to dry-run unless --apply is supplied");
      log("  - rewrites canonical numeric IDs and structured graph links deterministically");
      log("  - --select-goal requires --start-goal; on apply it activates the imported start goal, pauses competing active root goals, validates, then writes selected-goal state");
      break;
    case "refs":
      log("Usage:");
      log("  mdkg graph refs <id-or-qid> [--ws <alias>] [--json]");
      log("\nNotes:");
      log("  - read-only summary of inbound and outbound graph references");
      log("  - reports scope_refs, context_refs, evidence_refs, blockers, related refs, and structural links");
      log("  - subgraph qids are inspectable but remain read-only");
      break;
    default:
      log("Usage:");
      log("  mdkg graph clone <source-bundle-or-mdkg-dir> --target <path> [--json]");
      log("  mdkg graph fork <source-bundle-or-mdkg-dir> --target <path> [--start-goal <goal-id>] [--json]");
      log("  mdkg graph import-template <source-bundle-or-mdkg-dir> [--start-goal <goal-id>] [--select-goal] [--id-prefix <prefix>] [--dry-run] [--apply] [--json]");
      log("  mdkg graph refs <id-or-qid> [--ws <alias>] [--json]");
      log("\nNotes:");
      log("  - graph clone/fork create authored graph state in separate target directories and preserve IDs");
      log("  - graph import-template imports template work nodes into the current graph with rewritten IDs");
      log("  - graph refs is read-only and explains local plus subgraph graph relationships");
      log("  - subgraphs remain read-only bundle projections for orchestration context");
  }
  printGlobalOptions(log);
}

function printGitHelp(log: LogFn, subcommand?: string): void {
  switch ((subcommand ?? "").toLowerCase()) {
    case "inspect":
      log("Usage:");
      log("  mdkg git inspect [--json]");
      log("\nNotes:");
      log("  - read-only Git worktree, remote, branch, status, descriptor, and accepted-revision receipt");
      log("  - remote URLs are redacted when userinfo is present");
      break;
    case "clone":
      log("Usage:");
      log("  mdkg git clone <repository-ref> --target <path> [--branch <name>] [--json]");
      log("\nNotes:");
      log("  - uses the system Git CLI and external Git auth");
      log("  - --target must be empty or absent and stay inside the current repo");
      log("  - repository refs must not embed credentials");
      break;
    case "fetch":
      log("Usage:");
      log("  mdkg git fetch [--remote <name>] [--branch <name>] [--json]");
      log("\nNotes:");
      log("  - defaults to remote origin");
      log("  - auth stays external through Git credential helpers, SSH, gh, CI env, or shell state");
      break;
    case "closeout":
      log("Usage:");
      log("  mdkg git closeout [--queue-policy drain|paused] [--output <path>] [--json]");
      log("\nNotes:");
      log("  - validates mdkg state before writing closeout receipts");
      log("  - when the project DB participated, seals SQLite state and writes a deterministic dump");
      log("  - writes static JSON and Markdown receipts under .mdkg/git/closeouts by default");
      break;
    case "push-ready":
      log("Usage:");
      log("  mdkg git push-ready --remote <name> --branch <name> [--json]");
      log("\nNotes:");
      log("  - read-only high-bar preflight for explicit Git remote/branch push");
      log("  - requires clean worktree, valid mdkg graph, external auth boundary, and valid DB snapshot when DB state participated");
      break;
    case "push":
      log("Usage:");
      log("  mdkg git push --remote <name> --branch <name> [--json]");
      log("  mdkg git push --remote <name> --branch <name> --stage-all --message <text> [--queue-policy drain|paused] [--json]");
      log("\nNotes:");
      log("  - real Git push via system Git; requires explicit remote and branch");
      log("  - --stage-all writes closeout evidence, stages all changes, commits with --message, then runs push-ready before pushing");
      log("  - no raw credentials, tokens, SSH keys, prompts, payloads, or provider auth are stored in receipts");
      break;
    default:
      log("Usage:");
      log("  mdkg git inspect [--json]");
      log("  mdkg git clone <repository-ref> --target <path> [--branch <name>] [--json]");
      log("  mdkg git fetch [--remote <name>] [--branch <name>] [--json]");
      log("  mdkg git closeout [--queue-policy drain|paused] [--output <path>] [--json]");
      log("  mdkg git push-ready --remote <name> --branch <name> [--json]");
      log("  mdkg git push --remote <name> --branch <name> [--stage-all --message <text>] [--json]");
      log("\nBoundaries:");
      log("  - mdkg git is a low-level Git lifecycle surface, not project-memory semantic search");
      log("  - system Git is the v1 execution backend");
      log("  - authentication stays external; mdkg records only refs, hashes, policy names, and receipts");
      log("  - real push operations require explicit remote and branch and should be approval-gated by the caller");
  }
  printGlobalOptions(log);
}

function printSubgraphHelp(log: LogFn, subcommand?: string): void {
  switch ((subcommand ?? "").toLowerCase()) {
    case "add":
      log("Usage:");
      log("  mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]");
      break;
    case "list":
      log("Usage:");
      log("  mdkg subgraph list [--json]");
      break;
    case "show":
      log("Usage:");
      log("  mdkg subgraph show <alias> [--json]");
      break;
    case "rm":
    case "remove":
      log("Usage:");
      log("  mdkg subgraph rm <alias> [--json]");
      break;
    case "enable":
      log("Usage:");
      log("  mdkg subgraph enable <alias> [--json]");
      break;
    case "disable":
      log("Usage:");
      log("  mdkg subgraph disable <alias> [--json]");
      break;
    case "verify":
      log("Usage:");
      log("  mdkg subgraph verify [alias|--all] [--json]");
      break;
    case "refresh":
      log("Usage:");
      log("  mdkg subgraph refresh [alias|--all] [--json]");
      break;
    case "audit":
      log("Usage:");
      log("  mdkg subgraph audit [alias|--all] [--target <path>] [--json]");
      log("\nNotes:");
      log("  - read-only audit for configured bundle health, source_path Git state, root-owned bundle paths, and optional materialize target safety");
      log("  - exits nonzero only for error-level safety failures; warning-level drift stays in the receipt");
      break;
    case "upgrade-plan":
      log("Usage:");
      log("  mdkg subgraph upgrade-plan [alias|--all] [--json]");
      log("\nNotes:");
      log("  - read-only downstream upgrade planning receipt; apply_supported is false");
      log("  - plans safe sync/verify/materialize next steps without mutating child repos or root bundles");
      break;
    case "sync":
      log("Usage:");
      log("  mdkg subgraph sync [alias|--all] [--dry-run] [--allow-dirty] [--json]");
      break;
    case "materialize":
      log("Usage:");
      log("  mdkg subgraph materialize [alias|--all] --target <path> [--clean] [--gitignore] [--json]");
      break;
    default:
      log("Usage:");
      log("  mdkg subgraph add <alias> <bundle-path> [--visibility private|internal|public] [--profile private|public] [--source-path <path>] [--source-repo <ref>] [--max-stale-seconds <seconds>] [--json]");
      log("  mdkg subgraph list [--json]");
      log("  mdkg subgraph show <alias> [--json]");
      log("  mdkg subgraph rm <alias> [--json]");
      log("  mdkg subgraph enable <alias> [--json]");
      log("  mdkg subgraph disable <alias> [--json]");
      log("  mdkg subgraph verify [alias|--all] [--json]");
      log("  mdkg subgraph refresh [alias|--all] [--json]");
      log("  mdkg subgraph audit [alias|--all] [--target <path>] [--json]");
      log("  mdkg subgraph upgrade-plan [alias|--all] [--json]");
      log("  mdkg subgraph sync [alias|--all] [--dry-run] [--allow-dirty] [--json]");
      log("  mdkg subgraph materialize [alias|--all] --target <path> [--clean] [--gitignore] [--json]");
      log("\nNotes:");
      log("  - subgraphs are read-only graph views backed by explicit bundle snapshots");
      log("  - default permissions are read-only and default freshness is 3600 seconds");
      log("  - refresh reloads configured bundle sources only; it does not build child bundles");
      log("  - audit and upgrade-plan are read-only safety receipts for downstream orchestration");
      log("  - sync builds root-owned bundles from clean configured child source_path repos");
      log("  - materialize extracts bundle contents into generated inspection trees");
  }
  printGlobalOptions(log);
}

function printWorkHelp(log: LogFn, subcommand?: string): void {
  switch ((subcommand ?? "").toLowerCase()) {
    case "contract":
      log("Usage:");
      log('  mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--contract-profile <name>] [--required-capabilities <...>] [--pricing-model <...>] [--json]');
      break;
    case "trigger":
      log("Usage:");
      log('  mdkg work trigger <work-or-capability-ref> [--id <order.id>] [--title "<title>"] [--requester <ref>] [--enqueue <queue>] [--json]');
      log("\nExample:");
      log("  mdkg work trigger work.example --id order.example-1 --requester user://example --json");
      log("\nNotes:");
      log("  Accepted targets: direct WORK.md ref, or MANIFEST.md/SPEC.md ref with exactly one resolvable work contract.");
      log("  Creates a deterministic WORK_ORDER.md semantic mirror and does not execute work.");
      log("  Queue enqueue requires a valid project DB plus an explicitly created active queue and never executes work.");
      break;
    case "order":
      log("Usage:");
      log('  mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--contract-profile <name>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--request-ref <ref>] [--trigger-ref <ref>] [--payload-hash <sha256:...>] [--input-refs <...>] [--queue-refs <...>] [--requested-outputs <...>] [--json]');
      log("  mdkg work order status <id-or-qid> [--json]");
      log("  mdkg work order update <id-or-qid> [--status <status>] [--add-input-refs <...>] [--add-queue-refs <...>] [--add-artifacts <...>] [--json]");
      log("\nNotes:");
      log("  work order status is read-only and reports deterministic JSON order state plus linked receipts.");
      break;
    case "receipt":
      log("Usage:");
      log('  mdkg work receipt new "<title>" --id <receipt.id> --work-order-id <order.id> --outcome success|partial|failure [--receipt-status recorded|verified|rejected|superseded] [--redaction-policy refs_and_hashes_only|redacted_summary|external_private] [--contract-profile <name>] [--receipt-kind <kind>] [--redaction-class <class>] [--validation-policy-ref <ref>] [--evidence-policy-ref <ref>] [--evidence-hashes <sha256:...>] [--json]');
      log("  mdkg work receipt verify <id-or-qid> [--json]");
      log("  mdkg work receipt update <id-or-qid> [--receipt-status <status>] [--add-artifacts <...>] [--add-proof-refs <...>] [--add-attestation-refs <...>] [--add-evidence-hashes <sha256:...>] [--json]");
      log("\nNotes:");
      log("  work receipt verify is read-only and reports deterministic JSON linkage, evidence, hash, outcome, and redaction checks.");
      break;
    case "artifact":
      log("Usage:");
      log("  mdkg work artifact add <order-or-receipt-id-or-qid> <file> [--id <archive.id>] [--kind source|artifact] [--json]");
      break;
    case "validate":
      log("Usage:");
      log("  mdkg work validate [<id-or-qid>] [--type manifest|spec|work|work_order|receipt|feedback|dispute|proposal] [--profile <name>] [--json]");
      log("\nNotes:");
      log("  Read-only focused validation for agent workflow mirrors.");
      log("  Reports typed diagnostics for MANIFEST.md, legacy SPEC.md, WORK.md, WORK_ORDER.md, RECEIPT.md, FEEDBACK.md, DISPUTE.md, and PROPOSAL.md files.");
      log("  --profile omni-room applies explicit contract-profile validation after generic mirror validation; this is separate from mdkg pack --profile.");
      log("  Obvious raw secret, prompt, token, or payload markers are warnings so humans and agents can review boundaries.");
      break;
    default:
      log("Usage:");
      log("  mdkg work contract new ...");
      log("  mdkg work trigger <work-or-capability-ref> ...");
      log("  mdkg work order new|status|update ...");
      log("  mdkg work receipt new|verify|update ...");
      log("  mdkg work artifact add ...");
      log("  mdkg work validate [<id-or-qid>] [--type <workflow-type>] [--profile <name>] [--json]");
      log("\nNotes:");
      log("  - work commands mutate semantic mirror files only");
      log("  - work validate is read-only and reports typed workflow diagnostics");
      log("  - production order, receipt, feedback, dispute, payment, ledger, marketplace inventory, fulfillment, and execution state remains canonical outside mdkg");
      log("  - do not store raw secrets, credentials, live payment state, ledger mutations, or canonical marketplace state in work mirrors");
      log("  - artifact:// refs identify external/runtime-managed artifacts; archive:// refs identify committed mdkg archive sidecars");
      log("  - update and artifact commands accept local ids or local qids; subgraph qids are read-only");
  }
  printGlobalOptions(log);
}

function printTaskHelp(log: LogFn, subcommand?: string): void {
  switch ((subcommand ?? "").toLowerCase()) {
    case "start":
      log("Usage:");
      log('  mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"] [--json]');
      log("\nWhen to use:");
      log("  Move a task-like node (feat, task, bug, test, or spike) into progress as a structured state change.");
      log("  If `events.jsonl` is missing, mdkg prints a short reminder about `mdkg event enable`.");
      printGlobalOptions(log);
      return;
    case "update":
      log("Usage:");
      log("  mdkg task update <id-or-qid> [--ws <alias>] [--status <status>] [--priority <n>]");
      log("                   [--add-artifacts <a,...>] [--add-links <l,...>] [--add-refs <id,...>]");
      log("                   [--add-skills <slug,...>] [--add-tags <tag,...>] [--add-blocked-by <id,...>]");
      log('                   [--clear-blocked-by] [--run-id <id>] [--note "<text>"] [--json]');
      log("\nWhen to use:");
      log("  Update structured task metadata and evidence while keeping body and narrative edits in markdown.");
      printGlobalOptions(log);
      return;
    case "done":
      log("Usage:");
      log('  mdkg task done <id-or-qid> [--ws <alias>] [--add-artifacts <a,...>] [--add-links <l,...>]');
      log('                 [--add-refs <id,...>] [--checkpoint "<title>"] [--checkpoint-kind implementation|test-proof|goal-closeout|audit|handoff] [--run-id <id>] [--note "<text>"] [--json]');
      log("\nWhen to use:");
      log("  Mark a task-like node done, optionally create a checkpoint, and emit a completion event when enabled.");
      log("  Use `--checkpoint` for milestone compression, not every routine task completion.");
      printGlobalOptions(log);
      return;
    default:
      log("Usage:");
      log('  mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"] [--json]');
      log("  mdkg task update <id-or-qid> [options] [--json]");
      log('  mdkg task done <id-or-qid> [--checkpoint "<title>"] [--checkpoint-kind implementation|test-proof|goal-closeout|audit|handoff] [options] [--json]');
      log("\nNotes:");
      log("  `mdkg task ...` only supports feat, task, bug, test, and spike nodes.");
      log("  Spikes use this lifecycle; there is no separate `mdkg spike ...` command family.");
      log("  Feat and epic closeout remain checkpoint-first guidance plus manual parent updates.");
      printGlobalOptions(log);
  }
}

function printGoalHelp(log: LogFn, subcommand?: string): void {
  switch ((subcommand ?? "").toLowerCase()) {
    case "show":
      log("Usage:");
      log("  mdkg goal show <goal-id-or-qid> [--ws <alias>] [--json]");
      log("\nWhen to use:");
      log("  Inspect a goal condition, current goal state, active node, last active node, required skills, and required checks.");
      printGlobalOptions(log);
      return;
    case "next":
      log("Usage:");
      log("  mdkg goal next [goal-id-or-qid] [--ws <alias>] [--json]");
      log("\nWhen to use:");
      log("  Select the next local feature, task, bug, test, or spike inside a recursive goal without mutating active_node.");
      log("  If no goal id is supplied, mdkg uses the selected goal or the unique active goal.");
      printGlobalOptions(log);
      return;
    case "select":
      log("Usage:");
      log("  mdkg goal select <goal-id-or-qid> [--ws <alias>] [--json]");
      log("\nWhen to use:");
      log("  Store a local selected goal so `mdkg goal next` can omit the goal id.");
      printGlobalOptions(log);
      return;
    case "activate":
      log("Usage:");
      log("  mdkg goal activate <goal-id-or-qid> [--ws <alias>] [--json]");
      log("\nWhen to use:");
      log("  Make one local root goal active, pause competing local active goals, and select it for `goal next`.");
      log("  Imported subgraph goals are read-only and are not mutated by activation.");
      printGlobalOptions(log);
      return;
    case "archive":
      log("Usage:");
      log("  mdkg goal archive <goal-id-or-qid> [--ws <alias>] [--json]");
      log("\nWhen to use:");
      log("  Mark a superseded historical goal archived so it remains readable but is excluded from active routing.");
      printGlobalOptions(log);
      return;
    case "current":
      log("Usage:");
      log("  mdkg goal current [--ws <alias>] [--json]");
      log("\nWhen to use:");
      log("  Inspect the selected goal or unique active goal fallback.");
      printGlobalOptions(log);
      return;
    case "clear":
      log("Usage:");
      log("  mdkg goal clear [--json]");
      log("\nWhen to use:");
      log("  Remove local selected-goal state.");
      printGlobalOptions(log);
      return;
    case "claim":
      log("Usage:");
      log("  mdkg goal claim <work-id-or-qid> [--ws <alias>] [--json]");
      log("  mdkg goal claim <goal-id-or-qid> <work-id-or-qid> [--ws <alias>] [--json]");
      log("\nWhen to use:");
      log("  Write active_node explicitly after accepting a goal-scoped next item.");
      printGlobalOptions(log);
      return;
    case "evaluate":
      log("Usage:");
      log("  mdkg goal evaluate <goal-id-or-qid> [--ws <alias>] [--json]");
      log("\nNotes:");
      log("  Evaluation is report-only; mdkg lists required checks but does not execute scripts.");
      printGlobalOptions(log);
      return;
    case "pause":
    case "resume":
    case "done":
      log("Usage:");
      log(`  mdkg goal ${subcommand} <goal-id-or-qid> [--ws <alias>] [--json]`);
      log("\nWhen to use:");
      log("  Update durable goal state after agent or human review.");
      if (subcommand === "done") {
        log("  Done goals preserve the final active_node as last_active_node and stop routing actionable work.");
      }
      printGlobalOptions(log);
      return;
    default:
      log("Usage:");
      log("  mdkg goal show <goal-id-or-qid> [--json]");
      log("  mdkg goal select <goal-id-or-qid> [--json]");
      log("  mdkg goal activate <goal-id-or-qid> [--json]");
      log("  mdkg goal current [--json]");
      log("  mdkg goal next [goal-id-or-qid] [--json]");
      log("  mdkg goal claim [goal-id-or-qid] <work-id-or-qid> [--json]");
      log("  mdkg goal evaluate <goal-id-or-qid> [--json]");
      log("  mdkg goal clear [--json]");
      log("  mdkg goal pause|resume|done|archive <goal-id-or-qid> [--json]");
      log("\nNotes:");
      log("  - goals orchestrate recursive progress; features, tasks, bugs, tests, and spikes are iterable work units");
      log("  - `mdkg goal next` is read-only; use `mdkg goal claim` to update active_node");
      log("  - `mdkg goal done` moves active_node to last_active_node so completed goals keep history without staying actionable");
      log("  - `mdkg goal activate` enforces one active local root goal and pauses competing active goals");
      log("  - goal evaluation is report-only and never executes required_checks");
      log("  - subgraph goal qids are read-only; update the source workspace instead");
      printGlobalOptions(log);
  }
}

function printEventHelp(log: LogFn, subcommand?: string): void {
  switch ((subcommand ?? "").toLowerCase()) {
    case "enable":
      log("Usage:");
      log("  mdkg event enable [--ws <alias>] [--json]");
      log("\nWhen to use:");
      log("  Create or ensure the append-only JSONL event log for a workspace.");
      printGlobalOptions(log);
      return;
    case "append":
      log("Usage:");
      log("  mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...>");
      log('                    [--ws <alias>] [--artifacts <a,...>] [--notes "<text>"] [--run-id <id>] [--json]');
      log("                    [--agent <name>] [--skill <slug>] [--tool <id>]");
      log("\nWhen to use:");
      log("  Append explicit provenance events from an orchestrator or manual workflow.");
      printGlobalOptions(log);
      return;
    default:
      log("Usage:");
      log("  mdkg event enable [--ws <alias>] [--json]");
      log("  mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...> [options] [--json]");
      printGlobalOptions(log);
  }
}

function printNextHelp(log: LogFn): void {
  log("Usage:");
  log("  mdkg next [<id-or-qid>] [--ws <alias>]");
  printGlobalOptions(log);
}

function printCheckpointHelp(log: LogFn): void {
  log("Usage:");
  log("  mdkg checkpoint new <title> [--kind implementation|test-proof|goal-closeout|audit|handoff] [--ws <alias>] [--json]");
  log("  Checkpoint bodies include command evidence, pass/fail status, warnings, changed surfaces, boundaries, and follow-up refs.");
  log('        [--relates <id,id,...>] [--scope <id,id,...>] [--run-id <id>] [--note "<text>"]');
  printGlobalOptions(log);
}

function printValidateHelp(log: LogFn): void {
  log("Usage:");
  log("  mdkg validate [--out <path>] [--json-out <path>] [--quiet] [--changed-only] [--summary] [--limit <n>] [--profile <name>] [--json]");
  log("\nNotes:");
  log("  Validates frontmatter schemas, graph references, visibility, skills, and events.");
  log("  --changed-only filters warning presentation to changed .mdkg files while full graph errors still run.");
  log("  --profile omni-room applies explicit contract-profile validation after generic validation; this is separate from mdkg pack --profile.");
  log("  JSON output includes warning_summary plus warning_diagnostics with warning ids, categories, severity, paths, refs, and remediation text.");
  log("  --summary emits bounded warning samples for agent/CI logs; --limit controls the sample size.");
  log("  --out writes the compatibility text report; --json-out writes a clean full JSON receipt.");
  printGlobalOptions(log);
}

function printStatusHelp(log: LogFn): void {
  log("Usage:");
  log("  mdkg status [--json]");
  log("\nChecks:");
  log("  - release/package and CHANGELOG summary");
  log("  - git branch, dirty state, and upstream ahead/behind counts");
  log("  - graph index load, validation errors, and generated cache freshness");
  log("  - selected goal existence, achieved state, and active node");
  log("  - project DB enabled/verify summary");
  log("\nBoundaries:");
  log("  - read-only operator summary; does not rebuild indexes or repair files");
  log("  - use `mdkg doctor` for diagnostic detail and future strict check IDs");
  log("\nOptions:");
  log("  --json                Emit machine-readable JSON output");
  printGlobalOptions(log);
}

function printMcpHelp(log: LogFn, subcommand?: string): void {
  switch ((subcommand ?? "").toLowerCase()) {
    case "serve":
      log("Usage:");
      log("  mdkg mcp serve --stdio");
      log("\nBoundary:");
      log("  - starts one local Model Context Protocol server bound to the selected --root");
      log("  - stdio is the only transport in this release; no HTTP listener is opened");
      log("  - exposes read-only tools for status, workspace list, search, show, pack, goal current/next, and validate");
      log("  - exposes no task, goal, graph, queue, event, archive, format, SQL, shell, filesystem, or environment mutation tools");
      log("  - stdout is reserved for newline-delimited JSON-RPC MCP messages");
      printGlobalOptions(log);
      return;
    default:
      log("Usage:");
      log("  mdkg mcp serve --stdio");
      log("\nBoundary:");
      log("  - local read-only MCP server for mdkg graph inspection");
      log("  - use --root <path> to select the mdkg graph explicitly");
      log("  - phase one is stdio-only and does not expose mutation tools");
      printGlobalOptions(log);
  }
}

function printFixHelp(log: LogFn, subcommand?: string): void {
  switch ((subcommand ?? "").toLowerCase()) {
    case "plan":
      log("Usage:");
      log("  mdkg fix plan [--family index|refs|ids|all] [--target <id-or-qid>] [--base-ref <ref>] [--json]");
      log("\nBoundaries:");
      log("  - read-only repair planning; writes no files and does not rebuild indexes");
      log("  - emits a deterministic receipt-shaped JSON plan with paths, risks, and reason codes");
      log("  - initial families are index/cache, graph refs, and duplicate ids");
      log("  - ids-family duplicate-id repairs can be applied with `mdkg fix apply --family ids`");
      log("  - index/cache and graph-ref findings remain review-only guidance");
      log("\nOptions:");
      log("  --family <family>     Select index, refs, ids, or all (default all)");
      log("  --target <id-or-qid>  Optional node target for family planners");
      log("  --base-ref <ref>      Prefer IDs that already exist at a Git base ref");
      log("  --json                Emit machine-readable JSON output");
      printGlobalOptions(log);
      return;
    case "apply":
      log("Usage:");
      log("  mdkg fix apply [--family ids] [--target <id-or-qid>] [--base-ref <ref>] [--json]");
      log("\nBoundaries:");
      log("  - applies only supported ids-family duplicate-ID rewrites");
      log("  - refuses index/cache, graph-ref, all-family, blocked, and unsupported repairs");
      log("  - writes graph Markdown atomically and rebuilds derived indexes");
      log("  - emits a receipt with plan hash, touched paths, and manual-review reference notes");
      log("\nOptions:");
      log("  --family ids          Explicit apply family; ids is the only supported apply family");
      log("  --target <id-or-qid>  Optional duplicate ID target");
      log("  --base-ref <ref>      Prefer IDs that already exist at a Git base ref");
      log("  --json                Emit machine-readable JSON output");
      printGlobalOptions(log);
      return;
    case "ids":
      log("Usage:");
      log("  mdkg fix ids [--target <id-or-qid>] [--base-ref <ref>] [--apply] [--json]");
      log("\nBoundaries:");
      log("  - convenience command for duplicate-ID planning and application");
      log("  - without --apply it is equivalent to `mdkg fix plan --family ids`");
      log("  - with --apply it is equivalent to `mdkg fix apply --family ids`");
      log("\nOptions:");
      log("  --target <id-or-qid>  Optional duplicate ID target");
      log("  --base-ref <ref>      Prefer IDs that already exist at a Git base ref");
      log("  --apply               Apply supported duplicate-ID rewrites");
      log("  --json                Emit machine-readable JSON output");
      printGlobalOptions(log);
      return;
    default:
      log("Usage:");
      log("  mdkg fix plan [--family index|refs|ids|all] [--target <id-or-qid>] [--base-ref <ref>] [--json]");
      log("  mdkg fix apply [--family ids] [--target <id-or-qid>] [--base-ref <ref>] [--json]");
      log("  mdkg fix ids [--target <id-or-qid>] [--base-ref <ref>] [--apply] [--json]");
      log("\nNotes:");
      log("  - fix plan is dry-run only and writes nothing");
      log("  - fix apply is limited to duplicate-ID graph repairs with receipt evidence");
      log("  - index/cache and graph-ref repairs remain plan/manual-review only");
      printGlobalOptions(log);
  }
}

function printFormatHelp(log: LogFn): void {
  log("Usage:");
  log("  mdkg format");
  log("  mdkg format --headings [--dry-run|--apply] [--summary] [--limit <n>] [--json]");
  log("\nNotes:");
  log("  Default format normalizes frontmatter in place.");
  log("  --headings adds missing recommended body headings; it defaults to dry-run and requires --apply to write files.");
  log("  --summary emits bounded heading-change samples for agent/CI logs; --limit controls the sample size.");
  printGlobalOptions(log);
}

function printDoctorHelp(log: LogFn): void {
  log("Usage:");
  log("  mdkg doctor [--strict] [--json]");
  log("\nChecks:");
  log("  - Node.js version compatibility");
  log("  - mdkg repo root + .mdkg/config.json");
  log("  - Selected-goal stale or achieved state");
  log("  - Project DB verification when enabled");
  log("  - Template schema availability");
  log("  - Archive sidecar storage hygiene");
  log("  - Bundle snapshot storage guidance");
  log("  - Bundle import health and staleness");
  log("  - Index load/rebuild health");
  log("  - Capability cache load/rebuild health");
  log("  - SQLite cache health when enabled");
  log("\nOptions:");
  log("  --strict              Fail on stale selected-goal, DB, and generated cache health issues");
  log("  --json                Emit machine-readable JSON output");
  printGlobalOptions(log);
}

function printCommandHelp(log: LogFn, command?: string, subcommand?: string): void {
  switch ((command ?? "").toLowerCase()) {
    case "":
    case "help":
      printUsage(log);
      return;
    case "init":
      printInitHelp(log);
      return;
    case "upgrade":
      printUpgradeHelp(log);
      return;
    case "guide":
      printGuideHelp(log);
      return;
    case "new":
      printNewHelp(log);
      return;
    case "workspace":
      printWorkspaceHelp(log);
      return;
    case "index":
      printIndexHelp(log);
      return;
    case "db":
      printDbHelp(log, subcommand);
      return;
    case "show":
      printShowHelp(log);
      return;
    case "list":
      printListHelp(log);
      return;
    case "search":
      printSearchHelp(log);
      return;
    case "pack":
      printPackHelp(log);
      return;
    case "handoff":
      printHandoffHelp(log);
      return;
    case "skill":
      printSkillHelp(log, subcommand);
      return;
    case "capability":
      printCapabilityHelp(log, subcommand);
      return;
    case "manifest":
      printSpecHelp(log, subcommand, "manifest");
      return;
    case "spec":
      printSpecHelp(log, subcommand);
      return;
    case "archive":
      printArchiveHelp(log, subcommand);
      return;
    case "bundle":
      printBundleHelp(log, subcommand);
      return;
    case "graph":
      printGraphHelp(log, subcommand);
      return;
    case "git":
      printGitHelp(log, subcommand);
      return;
    case "subgraph":
      printSubgraphHelp(log, subcommand);
      return;
    case "work":
      printWorkHelp(log, subcommand);
      return;
    case "loop":
      printLoopHelp(log, subcommand);
      return;
    case "task":
      printTaskHelp(log, subcommand);
      return;
    case "goal":
      printGoalHelp(log, subcommand);
      return;
    case "event":
      printEventHelp(log, subcommand);
      return;
    case "next":
      printNextHelp(log);
      return;
    case "checkpoint":
      printCheckpointHelp(log);
      return;
    case "validate":
      printValidateHelp(log);
      return;
    case "status":
      printStatusHelp(log);
      return;
    case "mcp":
      printMcpHelp(log, subcommand);
      return;
    case "fix":
      printFixHelp(log, subcommand);
      return;
    case "format":
      printFormatHelp(log);
      return;
    case "doctor":
      printDoctorHelp(log);
      return;
    default:
      printUsage(log);
  }
}

function printRootError(error: LogFn, root: string): void {
  error("mdkg must be run from a repo root with .mdkg/config.json");
  error(`root checked: ${root}`);
  error("hint: run from the repo root, pass --root <path>, or run `mdkg init`");
}

function readPackageVersion(): string {
  const packagePath = path.resolve(__dirname, "..", "package.json");
  if (!fs.existsSync(packagePath)) {
    return "unknown";
  }
  try {
    const raw = JSON.parse(fs.readFileSync(packagePath, "utf8")) as { version?: unknown };
    if (typeof raw.version === "string" && raw.version.trim().length > 0) {
      return raw.version;
    }
  } catch {
    return "unknown";
  }
  return "unknown";
}

function hasConfig(root: string): boolean {
  const configPath = path.join(root, ".mdkg", "config.json");
  return fs.existsSync(configPath);
}

function shouldRequireConfig(command: string, flags: Record<string, string | boolean>): boolean {
  if (command === "init" || command === "help") {
    return false;
  }
  if (command === "pack" && flags["--list-profiles"]) {
    return false;
  }
  return true;
}

function requireFlagValue(flag: string, value: string | boolean | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (value === true) {
    throw new UsageError(`${flag} requires a value`);
  }
  const normalized = String(value);
  if (normalized.trim().length === 0) {
    throw new UsageError(`${flag} requires a value`);
  }
  return normalized;
}

function parseBooleanFlag(flag: string, value: string | boolean | undefined): boolean {
  if (value === undefined) {
    return false;
  }
  if (value === true) {
    return true;
  }
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  throw new UsageError(`${flag} must be true or false`);
}

function parseNumberFlag(flag: string, value: string | boolean | undefined): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (value === true) {
    throw new UsageError(`${flag} requires a value`);
  }
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isInteger(parsed)) {
    throw new UsageError(`${flag} must be an integer`);
  }
  return parsed;
}

function parseQueuePolicyFlag(value: string | boolean | undefined): "drain" | "paused" | undefined {
  const raw = requireFlagValue("--queue-policy", value);
  if (raw === undefined) {
    return undefined;
  }
  if (raw === "drain" || raw === "paused") {
    return raw;
  }
  throw new UsageError("--queue-policy must be drain or paused");
}

function parseEdgesFlag(value: string | boolean | undefined): string[] | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (value === true) {
    throw new UsageError("--edges requires a value");
  }
  const raw = String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return raw.length > 0 ? raw : undefined;
}

function parseCsvFlag(
  flag: string,
  value: string | boolean | undefined
): string[] | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (value === true) {
    throw new UsageError(`${flag} requires a value`);
  }
  const items = String(value)
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return items.length > 0 ? items : undefined;
}

function parseTagsModeFlag(value: string | boolean | undefined): "any" | "all" | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (value === true) {
    throw new UsageError("--tags-mode requires a value");
  }
  const normalized = String(value).toLowerCase();
  if (normalized === "any" || normalized === "all") {
    return normalized;
  }
  throw new UsageError("--tags-mode must be any or all");
}

function parseQueryOutputFormat(parsed: ParsedArgs): QueryOutputFormat | undefined {
  const enabled: QueryOutputFormat[] = [];
  if (parseBooleanFlag("--json", parsed.flags["--json"])) {
    enabled.push("json");
  }
  if (parseBooleanFlag("--xml", parsed.flags["--xml"])) {
    enabled.push("xml");
  }
  if (parseBooleanFlag("--toon", parsed.flags["--toon"])) {
    enabled.push("toon");
  }
  if (parseBooleanFlag("--md", parsed.flags["--md"])) {
    enabled.push("md");
  }
  if (enabled.length > 1) {
    throw new UsageError("choose at most one output flag: --json, --xml, --toon, or --md");
  }
  return enabled[0];
}

function handleCommandError(
  err: unknown,
  command: string | undefined,
  runtime: ResolvedCliRuntime
): ExitCode {
  const message = err instanceof Error ? err.message : String(err);
  if (err instanceof UsageError) {
    runtime.error(message);
    printCommandHelp(runtime.log, command);
    return 1;
  }
  if (err instanceof ValidationError) {
    runtime.error(message);
    return 2;
  }
  if (err instanceof NotFoundError) {
    runtime.error(message);
    return 3;
  }
  runtime.error(message);
  return 4;
}

function runWorkspaceSubcommand(
  parsed: ParsedArgs,
  root: string
): ExitCode {
  const subcommand = (parsed.positionals[1] ?? "").toLowerCase();
  switch (subcommand) {
    case "ls": {
      if (parsed.positionals.length > 2) {
        throw new UsageError("workspace ls takes no arguments");
      }
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runWorkspaceListCommand({ root, json });
      return 0;
    }
    case "add": {
      const alias = parsed.positionals[2];
      const workspacePath = parsed.positionals[3];
      if (!alias || !workspacePath) {
        throw new UsageError("workspace add requires <alias> <path>");
      }
      const mdkgDir = requireFlagValue("--mdkg-dir", parsed.flags["--mdkg-dir"]);
      const visibility = requireFlagValue("--visibility", parsed.flags["--visibility"]);
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runWorkspaceAddCommand({ root, alias, workspacePath, mdkgDir, visibility, json });
      return 0;
    }
    case "rm": {
      const alias = parsed.positionals[2];
      if (!alias || parsed.positionals.length > 3) {
        throw new UsageError("workspace rm requires <alias>");
      }
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runWorkspaceRemoveCommand({ root, alias, json });
      return 0;
    }
    case "enable": {
      const alias = parsed.positionals[2];
      if (!alias || parsed.positionals.length > 3) {
        throw new UsageError("workspace enable requires <alias>");
      }
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runWorkspaceEnableCommand({ root, alias, json });
      return 0;
    }
    case "disable": {
      const alias = parsed.positionals[2];
      if (!alias || parsed.positionals.length > 3) {
        throw new UsageError("workspace disable requires <alias>");
      }
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runWorkspaceDisableCommand({ root, alias, json });
      return 0;
    }
    default:
      throw new UsageError("workspace requires ls/add/rm/enable/disable");
  }
}

function runDbSubcommand(parsed: ParsedArgs, root: string): ExitCode {
  const subcommand = (parsed.positionals[1] ?? "").toLowerCase();
  switch (subcommand) {
    case "index": {
      const action = (parsed.positionals[2] ?? "").toLowerCase();
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      const tolerant = parseBooleanFlag("--tolerant", parsed.flags["--tolerant"]);
      switch (action) {
        case "rebuild":
          if (parsed.positionals.length > 3) {
            throw new UsageError(`mdkg db index ${action} does not accept positional arguments`);
          }
          runDbIndexRebuildCommand({ root, tolerant, json });
          return 0;
        case "status":
          if (parsed.positionals.length > 3) {
            throw new UsageError(`mdkg db index ${action} does not accept positional arguments`);
          }
          runDbIndexStatusCommand({ root, tolerant, json });
          return 0;
        case "verify":
          if (parsed.positionals.length > 3) {
            throw new UsageError(`mdkg db index ${action} does not accept positional arguments`);
          }
          runDbIndexVerifyCommand({ root, tolerant, json });
          return 0;
        default:
          throw new UsageError("mdkg db index requires rebuild/status/verify");
      }
    }
    case "init": {
      if (parsed.positionals.length > 2) {
        throw new UsageError("mdkg db init does not accept positional arguments");
      }
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runDbInitCommand({ root, json });
      return 0;
    }
    case "migrate":
      if (parsed.positionals.length > 2) {
        throw new UsageError("mdkg db migrate does not accept positional arguments");
      }
      runDbMigrateCommand({ root, json: parseBooleanFlag("--json", parsed.flags["--json"]) });
      return 0;
    case "verify":
      if (parsed.positionals.length > 2) {
        throw new UsageError("mdkg db verify does not accept positional arguments");
      }
      runDbVerifyCommand({ root, json: parseBooleanFlag("--json", parsed.flags["--json"]) });
      return 0;
    case "stats": {
      if (parsed.positionals.length > 2) {
        throw new UsageError("mdkg db stats does not accept positional arguments");
      }
      runDbStatsCommand({ root, json: parseBooleanFlag("--json", parsed.flags["--json"]) });
      return 0;
    }
    case "queue": {
      const action = (parsed.positionals[2] ?? "").toLowerCase();
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      const queueName = parsed.positionals[3];
      const messageId = parsed.positionals[4];
      const common = {
        root,
        json,
        queueName,
        messageId,
        leaseOwner: requireFlagValue("--lease-owner", parsed.flags["--lease-owner"]),
        leaseMs: parseNumberFlag("--lease-ms", parsed.flags["--lease-ms"]),
        payloadJson: requireFlagValue("--payload-json", parsed.flags["--payload-json"]),
        payloadFile: requireFlagValue("--payload-file", parsed.flags["--payload-file"]),
        dedupeKey: requireFlagValue("--dedupe-key", parsed.flags["--dedupe-key"]),
        availableAtMs: parseNumberFlag("--available-at-ms", parsed.flags["--available-at-ms"]),
        maxAttempts: parseNumberFlag("--max-attempts", parsed.flags["--max-attempts"]),
        retryAfterMs: parseNumberFlag("--retry-after-ms", parsed.flags["--retry-after-ms"]),
        error: requireFlagValue("--error", parsed.flags["--error"]),
        paused: parseBooleanFlag("--paused", parsed.flags["--paused"]),
        reason: requireFlagValue("--reason", parsed.flags["--reason"]),
        status: requireFlagValue("--status", parsed.flags["--status"]),
        limit: parseNumberFlag("--limit", parsed.flags["--limit"]),
      };
      switch (action) {
        case "create":
          if (!queueName || parsed.positionals.length > 4) {
            throw new UsageError("mdkg db queue create requires <queue>");
          }
          runDbQueueCreateCommand(common);
          return 0;
        case "contract":
          if (parsed.positionals.length > 3) {
            throw new UsageError("mdkg db queue contract accepts no positional arguments");
          }
          runDbQueueContractCommand(common);
          return 0;
        case "pause":
          if (!queueName || parsed.positionals.length > 4) {
            throw new UsageError("mdkg db queue pause requires <queue>");
          }
          runDbQueuePauseCommand(common);
          return 0;
        case "resume":
          if (!queueName || parsed.positionals.length > 4) {
            throw new UsageError("mdkg db queue resume requires <queue>");
          }
          runDbQueueResumeCommand(common);
          return 0;
        case "enqueue":
          if (!queueName || !messageId || parsed.positionals.length > 5) {
            throw new UsageError("mdkg db queue enqueue requires <queue> <message-id>");
          }
          runDbQueueEnqueueCommand(common);
          return 0;
        case "claim":
          if (!queueName || parsed.positionals.length > 4) {
            throw new UsageError("mdkg db queue claim requires <queue>");
          }
          runDbQueueClaimCommand(common);
          return 0;
        case "ack":
          if (!queueName || !messageId || parsed.positionals.length > 5) {
            throw new UsageError("mdkg db queue ack requires <queue> <message-id>");
          }
          runDbQueueAckCommand(common);
          return 0;
        case "fail":
          if (!queueName || !messageId || parsed.positionals.length > 5) {
            throw new UsageError("mdkg db queue fail requires <queue> <message-id>");
          }
          runDbQueueFailCommand(common);
          return 0;
        case "dead-letter":
          if (!queueName || !messageId || parsed.positionals.length > 5) {
            throw new UsageError("mdkg db queue dead-letter requires <queue> <message-id>");
          }
          runDbQueueDeadLetterCommand(common);
          return 0;
        case "release-expired":
          if (parsed.positionals.length > 4) {
            throw new UsageError("mdkg db queue release-expired accepts at most one queue");
          }
          runDbQueueReleaseExpiredCommand(common);
          return 0;
        case "stats":
          if (parsed.positionals.length > 4) {
            throw new UsageError("mdkg db queue stats accepts at most one queue");
          }
          runDbQueueStatsCommand(common);
          return 0;
        case "list":
          if (!queueName || parsed.positionals.length > 4) {
            throw new UsageError("mdkg db queue list requires <queue>");
          }
          runDbQueueListCommand(common);
          return 0;
        case "show":
          if (!queueName || !messageId || parsed.positionals.length > 5) {
            throw new UsageError("mdkg db queue show requires <queue> <message-id>");
          }
          runDbQueueShowCommand(common);
          return 0;
        default:
          throw new UsageError("mdkg db queue requires create/contract/pause/resume/enqueue/claim/ack/fail/dead-letter/release-expired/stats/list/show");
      }
    }
    case "snapshot": {
      const action = (parsed.positionals[2] ?? "").toLowerCase();
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      switch (action) {
        case "seal":
          if (parsed.positionals.length > 3) {
            throw new UsageError("mdkg db snapshot seal does not accept positional arguments");
          }
          runDbSnapshotSealCommand({ root, json, queuePolicy: parseQueuePolicyFlag(parsed.flags["--queue-policy"]) });
          return 0;
        case "verify":
          if (parsed.positionals.length > 3) {
            throw new UsageError("mdkg db snapshot verify does not accept positional arguments");
          }
          runDbSnapshotVerifyCommand({ root, json });
          return 0;
        case "status":
          if (parsed.positionals.length > 3) {
            throw new UsageError("mdkg db snapshot status does not accept positional arguments");
          }
          runDbSnapshotStatusCommand({ root, json });
          return 0;
        case "dump": {
          if (parsed.positionals.length > 3) {
            throw new UsageError("mdkg db snapshot dump does not accept positional arguments");
          }
          const snapshot = requireFlagValue("--snapshot", parsed.flags["--snapshot"]);
          const output = requireFlagValue("--output", parsed.flags["--out"]);
          runDbSnapshotDumpCommand({ root, snapshot, output, json });
          return 0;
        }
        case "diff": {
          const left = parsed.positionals[3];
          const right = parsed.positionals[4];
          if (!left || !right || parsed.positionals.length > 5) {
            throw new UsageError("mdkg db snapshot diff requires <left-snapshot> <right-snapshot>");
          }
          runDbSnapshotDiffCommand({ root, left, right, json });
          return 0;
        }
        default:
          throw new UsageError("mdkg db snapshot requires seal/verify/status/dump/diff");
      }
    }
    default:
      throw new UsageError("mdkg db requires index/init/migrate/verify/stats/queue/snapshot");
  }
}

function runCapabilitySubcommand(parsed: ParsedArgs, root: string): ExitCode {
  const subcommand = (parsed.positionals[1] ?? "").toLowerCase();
  switch (subcommand) {
    case "list": {
      if (parsed.positionals.length > 2) {
        throw new UsageError("capability list does not accept positional arguments");
      }
      const kind = requireFlagValue("--kind", parsed.flags["--kind"]);
      const visibility = requireFlagValue("--visibility", parsed.flags["--visibility"]);
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      const noCache = parseBooleanFlag("--no-cache", parsed.flags["--no-cache"]);
      const noReindex = parseBooleanFlag("--no-reindex", parsed.flags["--no-reindex"]);
      runCapabilityListCommand({ root, kind, visibility, json, noCache, noReindex });
      return 0;
    }
    case "search": {
      if (parsed.positionals.length < 3) {
        throw new UsageError("capability search requires a query");
      }
      const query = parsed.positionals.slice(2).join(" ");
      const kind = requireFlagValue("--kind", parsed.flags["--kind"]);
      const visibility = requireFlagValue("--visibility", parsed.flags["--visibility"]);
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      const noCache = parseBooleanFlag("--no-cache", parsed.flags["--no-cache"]);
      const noReindex = parseBooleanFlag("--no-reindex", parsed.flags["--no-reindex"]);
      runCapabilitySearchCommand({ root, query, kind, visibility, json, noCache, noReindex });
      return 0;
    }
    case "show": {
      const id = parsed.positionals[2];
      if (!id || parsed.positionals.length > 3) {
        throw new UsageError("capability show requires <id-or-qid-or-slug>");
      }
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      const noCache = parseBooleanFlag("--no-cache", parsed.flags["--no-cache"]);
      const noReindex = parseBooleanFlag("--no-reindex", parsed.flags["--no-reindex"]);
      runCapabilityShowCommand({ root, id, json, noCache, noReindex });
      return 0;
    }
    case "resolve": {
      const query = parsed.positionals.slice(2).join(" ") || undefined;
      const kind = requireFlagValue("--kind", parsed.flags["--kind"]);
      const visibility = requireFlagValue("--visibility", parsed.flags["--visibility"]);
      const requires = requireFlagValue("--requires", parsed.flags["--requires"]);
      const freshOnly = parseBooleanFlag("--fresh-only", parsed.flags["--fresh-only"]);
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      const noCache = parseBooleanFlag("--no-cache", parsed.flags["--no-cache"]);
      const noReindex = parseBooleanFlag("--no-reindex", parsed.flags["--no-reindex"]);
      runCapabilityResolveCommand({ root, query, kind, visibility, requires, freshOnly, json, noCache, noReindex });
      return 0;
    }
    default:
      throw new UsageError("capability requires list/search/show/resolve");
  }
}

function runSpecSubcommand(parsed: ParsedArgs, root: string, surface: "manifest" | "spec" = "spec"): ExitCode {
  const subcommand = (parsed.positionals[1] ?? "").toLowerCase();
  const command = surface === "manifest" ? "manifest" : "spec";
  switch (subcommand) {
    case "list": {
      if (parsed.positionals.length > 2) {
        throw new UsageError(`${command} list does not accept positional arguments`);
      }
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      const noCache = parseBooleanFlag("--no-cache", parsed.flags["--no-cache"]);
      const noReindex = parseBooleanFlag("--no-reindex", parsed.flags["--no-reindex"]);
      const runList = surface === "manifest" ? runManifestListCommand : runSpecListCommand;
      runList({ root, json, noCache, noReindex });
      return 0;
    }
    case "show": {
      const id = parsed.positionals[2];
      if (!id || parsed.positionals.length > 3) {
        throw new UsageError(`${command} show requires <id-or-qid-or-alias>`);
      }
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      const noCache = parseBooleanFlag("--no-cache", parsed.flags["--no-cache"]);
      const noReindex = parseBooleanFlag("--no-reindex", parsed.flags["--no-reindex"]);
      const runShow = surface === "manifest" ? runManifestShowCommand : runSpecShowCommand;
      runShow({ root, id, json, noCache, noReindex });
      return 0;
    }
    case "validate": {
      const id = parsed.positionals[2];
      if (parsed.positionals.length > 3) {
        throw new UsageError(`${command} validate accepts at most one manifest reference`);
      }
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      const noCache = parseBooleanFlag("--no-cache", parsed.flags["--no-cache"]);
      const noReindex = parseBooleanFlag("--no-reindex", parsed.flags["--no-reindex"]);
      const runValidate = surface === "manifest" ? runManifestValidateCommand : runSpecValidateCommand;
      runValidate({ root, id, json, noCache, noReindex });
      return 0;
    }
    default:
      throw new UsageError(`${command} requires list/show/validate`);
  }
}

function runArchiveSubcommand(parsed: ParsedArgs, root: string): ExitCode {
  const subcommand = (parsed.positionals[1] ?? "").toLowerCase();
  switch (subcommand) {
    case "add": {
      const file = parsed.positionals[2];
      if (!file || parsed.positionals.length > 3) {
        throw new UsageError("archive add requires <file>");
      }
      const id = requireFlagValue("--id", parsed.flags["--id"]);
      const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
      const kind = requireFlagValue("--kind", parsed.flags["--kind"]);
      const title = requireFlagValue("--title", parsed.flags["--title"]);
      const refs = requireFlagValue("--refs", parsed.flags["--refs"]);
      const relates = requireFlagValue("--relates", parsed.flags["--relates"]);
      const visibility = requireFlagValue("--visibility", parsed.flags["--visibility"]);
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runArchiveAddCommand({ root, file, id, ws, kind, title, refs, relates, visibility, json });
      return 0;
    }
    case "list": {
      if (parsed.positionals.length > 2) {
        throw new UsageError("archive list does not accept positional arguments");
      }
      const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
      const kind = requireFlagValue("--kind", parsed.flags["--kind"]);
      const visibility = requireFlagValue("--visibility", parsed.flags["--visibility"]);
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runArchiveListCommand({ root, ws, kind, visibility, json });
      return 0;
    }
    case "show": {
      const id = parsed.positionals[2];
      if (!id || parsed.positionals.length > 3) {
        throw new UsageError("archive show requires <id-or-archive-uri>");
      }
      const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runArchiveShowCommand({ root, id, ws, json });
      return 0;
    }
    case "verify": {
      if (parsed.positionals.length > 3) {
        throw new UsageError("archive verify accepts at most one id");
      }
      const id = parsed.positionals[2];
      const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runArchiveVerifyCommand({ root, id, ws, json });
      return 0;
    }
    case "compress": {
      if (parsed.positionals.length > 3) {
        throw new UsageError("archive compress accepts at most one id");
      }
      const id = parsed.positionals[2];
      const all = parseBooleanFlag("--all", parsed.flags["--all"]);
      const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runArchiveCompressCommand({ root, id, all, ws, json });
      return 0;
    }
    default:
      throw new UsageError("archive requires add/list/show/verify/compress");
  }
}

function runBundleSubcommand(parsed: ParsedArgs, root: string): ExitCode {
  const subcommand = (parsed.positionals[1] ?? "").toLowerCase();
  switch (subcommand) {
    case "import": {
      throw new UsageError("mdkg bundle import has been replaced by mdkg subgraph; run `mdkg upgrade --apply` to migrate legacy bundle_imports config");
    }
    case "create": {
      if (parsed.positionals.length > 2) {
        throw new UsageError("bundle create does not accept positional arguments");
      }
      const profile = requireFlagValue("--profile", parsed.flags["--pack-profile"]);
      const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
      const output = requireFlagValue("--output", parsed.flags["--out"]);
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runBundleCreateCommand({ root, profile, ws, output, json });
      return 0;
    }
    case "verify": {
      if (parsed.positionals.length > 3) {
        throw new UsageError("bundle verify accepts at most one bundle path");
      }
      const bundlePath = parsed.positionals[2];
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runBundleVerifyCommand({ root, bundlePath, json });
      return 0;
    }
    case "show": {
      const bundlePath = parsed.positionals[2];
      if (!bundlePath || parsed.positionals.length > 3) {
        throw new UsageError("bundle show requires <bundle-path>");
      }
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runBundleShowCommand({ root, bundlePath, json });
      return 0;
    }
    case "list": {
      if (parsed.positionals.length > 2) {
        throw new UsageError("bundle list does not accept positional arguments");
      }
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runBundleListCommand({ root, json });
      return 0;
    }
    default:
      throw new UsageError("bundle requires create/list/show/verify");
  }
}

function runGraphSubcommand(parsed: ParsedArgs, root: string): ExitCode {
  const subcommand = (parsed.positionals[1] ?? "").toLowerCase();
  const source = parsed.positionals[2];
  const target = requireFlagValue("--target", parsed.flags["--target"]);
  const json = parseBooleanFlag("--json", parsed.flags["--json"]);
  switch (subcommand) {
    case "clone": {
      if (!source || parsed.positionals.length > 3) {
        throw new UsageError("graph clone requires <source-bundle-or-mdkg-dir>");
      }
      if (!target) {
        throw new UsageError("graph clone requires --target <path>");
      }
      runGraphCloneCommand({ root, source, target, json });
      return 0;
    }
    case "fork": {
      if (!source || parsed.positionals.length > 3) {
        throw new UsageError("graph fork requires <source-bundle-or-mdkg-dir>");
      }
      if (!target) {
        throw new UsageError("graph fork requires --target <path>");
      }
      const startGoal = requireFlagValue("--start-goal", parsed.flags["--start-goal"]);
      runGraphForkCommand({ root, source, target, startGoal, json });
      return 0;
    }
    case "import-template": {
      if (!source || parsed.positionals.length > 3) {
        throw new UsageError("graph import-template requires <source-bundle-or-mdkg-dir>");
      }
      const startGoal = requireFlagValue("--start-goal", parsed.flags["--start-goal"]);
      const idPrefix = requireFlagValue("--id-prefix", parsed.flags["--id-prefix"]);
      const dryRun = parseBooleanFlag("--dry-run", parsed.flags["--dry-run"]);
      const apply = parseBooleanFlag("--apply", parsed.flags["--apply"]);
      const selectGoal = parseBooleanFlag("--select-goal", parsed.flags["--select-goal"]);
      runGraphImportTemplateCommand({ root, source, startGoal, idPrefix, dryRun, apply, selectGoal, json });
      return 0;
    }
    case "refs": {
      const id = parsed.positionals[2];
      if (!id || parsed.positionals.length > 3) {
        throw new UsageError("graph refs requires <id-or-qid>");
      }
      const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
      runGraphRefsCommand({ root, id, ws, json });
      return 0;
    }
    default:
      throw new UsageError("graph requires clone/fork/import-template/refs");
  }
}

function runGitSubcommand(parsed: ParsedArgs, root: string): ExitCode {
  const subcommand = (parsed.positionals[1] ?? "").toLowerCase();
  const json = parseBooleanFlag("--json", parsed.flags["--json"]);
  switch (subcommand) {
    case "inspect": {
      if (parsed.positionals.length > 2) {
        throw new UsageError("git inspect does not accept positional arguments");
      }
      runGitInspectCommand({ root, json });
      return 0;
    }
    case "clone": {
      const repository = parsed.positionals[2];
      if (!repository || parsed.positionals.length > 3) {
        throw new UsageError("git clone requires <repository-ref>");
      }
      const target = requireFlagValue("--target", parsed.flags["--target"]);
      if (!target) {
        throw new UsageError("git clone requires --target <path>");
      }
      const branch = requireFlagValue("--branch", parsed.flags["--branch"]);
      runGitCloneCommand({ root, repository, target, branch, json });
      return 0;
    }
    case "fetch": {
      if (parsed.positionals.length > 2) {
        throw new UsageError("git fetch does not accept positional arguments");
      }
      const remote = requireFlagValue("--remote", parsed.flags["--remote"]);
      const branch = requireFlagValue("--branch", parsed.flags["--branch"]);
      runGitFetchCommand({ root, remote, branch, json });
      return 0;
    }
    case "closeout": {
      if (parsed.positionals.length > 2) {
        throw new UsageError("git closeout does not accept positional arguments");
      }
      const queuePolicy = parseQueuePolicyFlag(parsed.flags["--queue-policy"]);
      const output = requireFlagValue("--output", parsed.flags["--out"]);
      runGitCloseoutCommand({ root, queuePolicy, output, json });
      return 0;
    }
    case "push-ready": {
      if (parsed.positionals.length > 2) {
        throw new UsageError("git push-ready does not accept positional arguments");
      }
      const remote = requireFlagValue("--remote", parsed.flags["--remote"]);
      const branch = requireFlagValue("--branch", parsed.flags["--branch"]);
      runGitPushReadyCommand({ root, remote, branch, json });
      return 0;
    }
    case "push": {
      if (parsed.positionals.length > 2) {
        throw new UsageError("git push does not accept positional arguments");
      }
      const remote = requireFlagValue("--remote", parsed.flags["--remote"]);
      const branch = requireFlagValue("--branch", parsed.flags["--branch"]);
      const message = requireFlagValue("--message", parsed.flags["--message"]);
      const stageAll = parseBooleanFlag("--stage-all", parsed.flags["--stage-all"]);
      const queuePolicy = parseQueuePolicyFlag(parsed.flags["--queue-policy"]);
      runGitPushCommand({ root, remote, branch, message, stageAll, queuePolicy, json });
      return 0;
    }
    default:
      throw new UsageError("git requires inspect/clone/fetch/closeout/push-ready/push");
  }
}

function runSubgraphSubcommand(parsed: ParsedArgs, root: string): ExitCode {
  const subcommand = (parsed.positionals[1] ?? "").toLowerCase();
  const json = parseBooleanFlag("--json", parsed.flags["--json"]);
  switch (subcommand) {
    case "add": {
      const alias = parsed.positionals[2];
      const bundlePath = parsed.positionals[3];
      if (!alias || !bundlePath || parsed.positionals.length > 4) {
        throw new UsageError("subgraph add requires <alias> <bundle-path>");
      }
      const visibility = requireFlagValue("--visibility", parsed.flags["--visibility"]);
      const profile = requireFlagValue("--profile", parsed.flags["--pack-profile"]);
      const sourcePath = requireFlagValue("--source-path", parsed.flags["--source-path"]);
      const sourceRepo = requireFlagValue("--source-repo", parsed.flags["--source-repo"]);
      const maxStaleRaw = requireFlagValue("--max-stale-seconds", parsed.flags["--max-stale-seconds"]);
      const maxStaleSeconds = maxStaleRaw === undefined ? undefined : Number.parseInt(maxStaleRaw, 10);
      runSubgraphAddCommand({
        root,
        alias,
        bundlePath,
        visibility,
        profile,
        sourcePath,
        sourceRepo,
        maxStaleSeconds,
        json,
      });
      return 0;
    }
    case "list": {
      if (parsed.positionals.length > 2) {
        throw new UsageError("subgraph list does not accept positional arguments");
      }
      runSubgraphListCommand({ root, json });
      return 0;
    }
    case "show": {
      const alias = parsed.positionals[2];
      if (!alias || parsed.positionals.length > 3) {
        throw new UsageError("subgraph show requires <alias>");
      }
      runSubgraphShowCommand({ root, alias, json });
      return 0;
    }
    case "rm":
    case "remove": {
      const alias = parsed.positionals[2];
      if (!alias || parsed.positionals.length > 3) {
        throw new UsageError("subgraph rm requires <alias>");
      }
      runSubgraphRemoveCommand({ root, alias, json });
      return 0;
    }
    case "enable": {
      const alias = parsed.positionals[2];
      if (!alias || parsed.positionals.length > 3) {
        throw new UsageError("subgraph enable requires <alias>");
      }
      runSubgraphEnableCommand({ root, alias, json });
      return 0;
    }
    case "disable": {
      const alias = parsed.positionals[2];
      if (!alias || parsed.positionals.length > 3) {
        throw new UsageError("subgraph disable requires <alias>");
      }
      runSubgraphDisableCommand({ root, alias, json });
      return 0;
    }
    case "verify": {
      if (parsed.positionals.length > 3) {
        throw new UsageError("subgraph verify accepts at most one alias");
      }
      const alias = parsed.positionals[2];
      const all = parseBooleanFlag("--all", parsed.flags["--all"]);
      runSubgraphVerifyCommand({ root, alias, all, json });
      return 0;
    }
    case "refresh": {
      if (parsed.positionals.length > 3) {
        throw new UsageError("subgraph refresh accepts at most one alias");
      }
      const alias = parsed.positionals[2];
      const all = parseBooleanFlag("--all", parsed.flags["--all"]);
      runSubgraphRefreshCommand({ root, alias, all, json });
      return 0;
    }
    case "audit": {
      if (parsed.positionals.length > 3) {
        throw new UsageError("subgraph audit accepts at most one alias");
      }
      const alias = parsed.positionals[2];
      const all = parseBooleanFlag("--all", parsed.flags["--all"]);
      const target = requireFlagValue("--target", parsed.flags["--target"]);
      runSubgraphAuditCommand({ root, alias, all, target, json });
      return 0;
    }
    case "upgrade-plan": {
      if (parsed.positionals.length > 3) {
        throw new UsageError("subgraph upgrade-plan accepts at most one alias");
      }
      const alias = parsed.positionals[2];
      const all = parseBooleanFlag("--all", parsed.flags["--all"]);
      runSubgraphUpgradePlanCommand({ root, alias, all, json });
      return 0;
    }
    case "sync": {
      if (parsed.positionals.length > 3) {
        throw new UsageError("subgraph sync accepts at most one alias");
      }
      const alias = parsed.positionals[2];
      const all = parseBooleanFlag("--all", parsed.flags["--all"]);
      const dryRun = parseBooleanFlag("--dry-run", parsed.flags["--dry-run"]);
      const allowDirty = parseBooleanFlag("--allow-dirty", parsed.flags["--allow-dirty"]);
      runSubgraphSyncCommand({ root, alias, all, dryRun, allowDirty, json });
      return 0;
    }
    case "materialize": {
      if (parsed.positionals.length > 3) {
        throw new UsageError("subgraph materialize accepts at most one alias");
      }
      const alias = parsed.positionals[2];
      const all = parseBooleanFlag("--all", parsed.flags["--all"]);
      const target = requireFlagValue("--target", parsed.flags["--target"]);
      if (!target) {
        throw new UsageError("subgraph materialize requires --target <path>");
      }
      const clean = parseBooleanFlag("--clean", parsed.flags["--clean"]);
      const gitignore = parseBooleanFlag("--gitignore", parsed.flags["--gitignore"]);
      runSubgraphMaterializeCommand({ root, alias, all, target, clean, gitignore, json });
      return 0;
    }
    default:
      throw new UsageError("subgraph requires add/list/show/rm/enable/disable/verify/refresh/audit/upgrade-plan/sync/materialize");
  }
}

function runWorkSubcommand(parsed: ParsedArgs, root: string): ExitCode {
  const domain = (parsed.positionals[1] ?? "").toLowerCase();
  const action = (parsed.positionals[2] ?? "").toLowerCase();
  const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
  const json = parseBooleanFlag("--json", parsed.flags["--json"]);

  if (domain === "trigger") {
    const targetRef = parsed.positionals[2];
    if (!targetRef || parsed.positionals.length > 3) {
      throw new UsageError("work trigger requires <work-or-capability-ref>");
    }
    const id = requireFlagValue("--id", parsed.flags["--id"]);
    const title = requireFlagValue("--title", parsed.flags["--title"]);
    const requester = requireFlagValue("--requester", parsed.flags["--requester"]);
    const enqueue = requireFlagValue("--enqueue", parsed.flags["--enqueue"]);
    runWorkTriggerCommand({ root, ws, targetRef, id, title, requester, enqueue, json });
    return 0;
  }

  if (domain === "validate") {
    const id = parsed.positionals[2];
    if (parsed.positionals.length > 3) {
      throw new UsageError("work validate accepts at most one workflow reference");
    }
    const type = requireFlagValue("--type", parsed.flags["--type"]);
    const profile = requireFlagValue("--profile", parsed.flags["--pack-profile"]);
    runWorkValidateCommand({ root, ws, id, type, profile, json });
    return 0;
  }

  if (domain === "contract" && action === "new") {
    const title = parsed.positionals.slice(3).join(" ");
    const id = requireFlagValue("--id", parsed.flags["--id"]);
    const agentId = requireFlagValue("--agent-id", parsed.flags["--agent-id"]);
    const kind = requireFlagValue("--kind", parsed.flags["--kind"]);
    const inputs = requireFlagValue("--inputs", parsed.flags["--inputs"]);
    const outputs = requireFlagValue("--outputs", parsed.flags["--outputs"]);
    if (!title || !id || !agentId || !kind || !inputs || !outputs) {
      throw new UsageError("work contract new requires title, --id, --agent-id, --kind, --inputs, and --outputs");
    }
    const requiredCapabilities = requireFlagValue(
      "--required-capabilities",
      parsed.flags["--required-capabilities"]
    );
    const pricingModel = requireFlagValue("--pricing-model", parsed.flags["--pricing-model"]);
    const contractProfile = requireFlagValue("--contract-profile", parsed.flags["--contract-profile"]);
    runWorkContractNewCommand({
      root,
      ws,
      title,
      id,
      agentId,
      kind,
      inputs,
      outputs,
      requiredCapabilities,
      pricingModel,
      contractProfile,
      json,
    });
    return 0;
  }

  if (domain === "order" && action === "new") {
    const title = parsed.positionals.slice(3).join(" ");
    const id = requireFlagValue("--id", parsed.flags["--id"]);
    const workId = requireFlagValue("--work-id", parsed.flags["--work-id"]);
    const requester = requireFlagValue("--requester", parsed.flags["--requester"]);
    if (!title || !id || !workId || !requester) {
      throw new UsageError("work order new requires title, --id, --work-id, and --requester");
    }
    const requestRef = requireFlagValue("--request-ref", parsed.flags["--request-ref"]);
    const triggerRef = requireFlagValue("--trigger-ref", parsed.flags["--trigger-ref"]);
    const payloadHash = requireFlagValue("--payload-hash", parsed.flags["--payload-hash"]);
    const inputRefs = requireFlagValue("--input-refs", parsed.flags["--input-refs"]);
    const queueRefs = requireFlagValue("--queue-refs", parsed.flags["--queue-refs"]);
    const requestedOutputs = requireFlagValue("--requested-outputs", parsed.flags["--requested-outputs"]);
    const constraintRefs = requireFlagValue("--constraint-refs", parsed.flags["--constraint-refs"]);
    const contractProfile = requireFlagValue("--contract-profile", parsed.flags["--contract-profile"]);
    const validationPolicyRef = requireFlagValue("--validation-policy-ref", parsed.flags["--validation-policy-ref"]);
    const evidencePolicyRef = requireFlagValue("--evidence-policy-ref", parsed.flags["--evidence-policy-ref"]);
    runWorkOrderNewCommand({
      root,
      ws,
      title,
      id,
      workId,
      requester,
      requestRef,
      triggerRef,
      payloadHash,
      inputRefs,
      queueRefs,
      requestedOutputs,
      constraintRefs,
      contractProfile,
      validationPolicyRef,
      evidencePolicyRef,
      json,
    });
    return 0;
  }

  if (domain === "order" && action === "update") {
    const id = parsed.positionals[3];
    if (!id || parsed.positionals.length > 4) {
      throw new UsageError("work order update requires <id-or-qid>");
    }
    const status = requireFlagValue("--status", parsed.flags["--status"]);
    const addInputRefs = requireFlagValue("--add-input-refs", parsed.flags["--add-input-refs"]);
    const addQueueRefs = requireFlagValue("--add-queue-refs", parsed.flags["--add-queue-refs"]);
    const addArtifacts = requireFlagValue("--add-artifacts", parsed.flags["--add-artifacts"]);
    runWorkOrderUpdateCommand({ root, ws, id, status, addInputRefs, addQueueRefs, addArtifacts, json });
    return 0;
  }

  if (domain === "order" && action === "status") {
    const id = parsed.positionals[3];
    if (!id || parsed.positionals.length > 4) {
      throw new UsageError("work order status requires <id-or-qid>");
    }
    runWorkOrderStatusCommand({ root, ws, id, json });
    return 0;
  }

  if (domain === "receipt" && action === "new") {
    const title = parsed.positionals.slice(3).join(" ");
    const id = requireFlagValue("--id", parsed.flags["--id"]);
    const workOrderId = requireFlagValue("--work-order-id", parsed.flags["--work-order-id"]);
    const outcome = requireFlagValue("--outcome", parsed.flags["--outcome"]);
    if (!title || !id || !workOrderId || !outcome) {
      throw new UsageError("work receipt new requires title, --id, --work-order-id, and --outcome");
    }
    const receiptStatus = requireFlagValue("--receipt-status", parsed.flags["--receipt-status"]);
    const costRef = requireFlagValue("--cost-ref", parsed.flags["--cost-ref"]);
    const redactionPolicy = requireFlagValue("--redaction-policy", parsed.flags["--redaction-policy"]);
    const artifacts = requireFlagValue("--artifacts", parsed.flags["--artifacts"]);
    const proofRefs = requireFlagValue("--proof-refs", parsed.flags["--proof-refs"]);
    const attestationRefs = requireFlagValue("--attestation-refs", parsed.flags["--attestation-refs"]);
    const evidenceHashes = requireFlagValue("--evidence-hashes", parsed.flags["--evidence-hashes"]);
    const inputHashes = requireFlagValue("--input-hashes", parsed.flags["--input-hashes"]);
    const outputHashes = requireFlagValue("--output-hashes", parsed.flags["--output-hashes"]);
    const contractProfile = requireFlagValue("--contract-profile", parsed.flags["--contract-profile"]);
    const receiptKind = requireFlagValue("--receipt-kind", parsed.flags["--receipt-kind"]);
    const redactionClass = requireFlagValue("--redaction-class", parsed.flags["--redaction-class"]);
    const validationPolicyRef = requireFlagValue("--validation-policy-ref", parsed.flags["--validation-policy-ref"]);
    const evidencePolicyRef = requireFlagValue("--evidence-policy-ref", parsed.flags["--evidence-policy-ref"]);
    runWorkReceiptNewCommand({
      root,
      ws,
      title,
      id,
      workOrderId,
      outcome,
      receiptStatus,
      costRef,
      redactionPolicy,
      contractProfile,
      receiptKind,
      redactionClass,
      validationPolicyRef,
      evidencePolicyRef,
      artifacts,
      proofRefs,
      attestationRefs,
      evidenceHashes,
      inputHashes,
      outputHashes,
      json,
    });
    return 0;
  }

  if (domain === "receipt" && action === "update") {
    const id = parsed.positionals[3];
    if (!id || parsed.positionals.length > 4) {
      throw new UsageError("work receipt update requires <id-or-qid>");
    }
    const receiptStatus = requireFlagValue("--receipt-status", parsed.flags["--receipt-status"]);
    const addArtifacts = requireFlagValue("--add-artifacts", parsed.flags["--add-artifacts"]);
    const addProofRefs = requireFlagValue("--add-proof-refs", parsed.flags["--add-proof-refs"]);
    const addAttestationRefs = requireFlagValue("--add-attestation-refs", parsed.flags["--add-attestation-refs"]);
    const addEvidenceHashes = requireFlagValue("--add-evidence-hashes", parsed.flags["--add-evidence-hashes"]);
    runWorkReceiptUpdateCommand({
      root,
      ws,
      id,
      receiptStatus,
      addArtifacts,
      addProofRefs,
      addAttestationRefs,
      addEvidenceHashes,
      json,
    });
    return 0;
  }

  if (domain === "receipt" && action === "verify") {
    const id = parsed.positionals[3];
    if (!id || parsed.positionals.length > 4) {
      throw new UsageError("work receipt verify requires <id-or-qid>");
    }
    runWorkReceiptVerifyCommand({ root, ws, id, json });
    return 0;
  }

  if (domain === "artifact" && action === "add") {
    const targetId = parsed.positionals[3];
    const file = parsed.positionals[4];
    if (!targetId || !file || parsed.positionals.length > 5) {
      throw new UsageError("work artifact add requires <order-or-receipt-id-or-qid> <file>");
    }
    const id = requireFlagValue("--id", parsed.flags["--id"]);
    const kind = requireFlagValue("--kind", parsed.flags["--kind"]);
    runWorkArtifactAddCommand({ root, ws, targetId, file, id, kind, json });
    return 0;
  }

  throw new UsageError("work requires contract new, trigger, order new/update/status, receipt new/update/verify, artifact add, or validate");
}

function runSkillSubcommand(parsed: ParsedArgs, root: string): ExitCode {
  const subcommand = (parsed.positionals[1] ?? "").toLowerCase();
  switch (subcommand) {
    case "new": {
      const slug = parsed.positionals[2];
      const name = parsed.positionals[3];
      if (!slug || !name) {
        throw new UsageError('skill new requires <slug> "<name>"');
      }
      if (parsed.positionals.length > 4) {
        throw new UsageError('skill new accepts exactly <slug> "<name>"');
      }
      const description = requireFlagValue("--description", parsed.flags["--description"]);
      if (!description) {
        throw new UsageError("skill new requires --description");
      }
      const tags = requireFlagValue("--tags", parsed.flags["--tags"]);
      const authors = requireFlagValue("--authors", parsed.flags["--authors"]);
      const links = requireFlagValue("--links", parsed.flags["--links"]);
      const withScripts = parseBooleanFlag("--with-scripts", parsed.flags["--with-scripts"]);
      const force = parseBooleanFlag("--force", parsed.flags["--force"]);
      const runId = requireFlagValue("--run-id", parsed.flags["--run-id"]);
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runSkillNewCommand({
        root,
        slug,
        name,
        description,
        tags,
        authors,
        links,
        withScripts,
        force,
        runId,
        json,
      });
      return 0;
    }
    case "list": {
      if (parsed.positionals.length > 2) {
        throw new UsageError("skill list does not accept positional arguments");
      }
      const tags = parseCsvFlag("--tags", parsed.flags["--tags"]);
      const tagsMode = parseTagsModeFlag(parsed.flags["--tags-mode"]);
      const noCache = parseBooleanFlag("--no-cache", parsed.flags["--no-cache"]);
      const noReindex = parseBooleanFlag("--no-reindex", parsed.flags["--no-reindex"]);
      const format = parseQueryOutputFormat(parsed);
      runSkillListCommand({
        root,
        tags,
        tagsMode,
        format,
        noCache,
        noReindex,
      });
      return 0;
    }
    case "show": {
      const slug = parsed.positionals[2];
      if (!slug || parsed.positionals.length > 3) {
        throw new UsageError("skill show requires <slug>");
      }
      const metaOnly = parseBooleanFlag("--meta", parsed.flags["--meta"]);
      const format = parseQueryOutputFormat(parsed);
      const noCache = parseBooleanFlag("--no-cache", parsed.flags["--no-cache"]);
      const noReindex = parseBooleanFlag("--no-reindex", parsed.flags["--no-reindex"]);
      runSkillShowCommand({
        root,
        slug,
        metaOnly,
        format,
        noCache,
        noReindex,
      });
      return 0;
    }
    case "search": {
      if (parsed.positionals.length < 3) {
        throw new UsageError("skill search requires a query");
      }
      const query = parsed.positionals.slice(2).join(" ");
      const tags = parseCsvFlag("--tags", parsed.flags["--tags"]);
      const tagsMode = parseTagsModeFlag(parsed.flags["--tags-mode"]);
      const format = parseQueryOutputFormat(parsed);
      const noCache = parseBooleanFlag("--no-cache", parsed.flags["--no-cache"]);
      const noReindex = parseBooleanFlag("--no-reindex", parsed.flags["--no-reindex"]);
      runSkillSearchCommand({
        root,
        query,
        tags,
        tagsMode,
        format,
        noCache,
        noReindex,
      });
      return 0;
    }
    case "validate": {
      if (parsed.positionals.length > 3) {
        throw new UsageError("skill validate accepts at most one slug");
      }
      const slug = parsed.positionals[2];
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runSkillValidateCommand({ root, slug, json });
      return 0;
    }
    case "sync": {
      if (parsed.positionals.length > 2) {
        throw new UsageError("skill sync does not accept positional arguments");
      }
      const force = parseBooleanFlag("--force", parsed.flags["--force"]);
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runSkillSyncCommand({ root, force, json });
      return 0;
    }
    default:
      throw new UsageError("skill requires new/list/show/search/validate/sync");
  }
}

function runLoopSubcommand(parsed: ParsedArgs, root: string): ExitCode {
  const subcommand = (parsed.positionals[1] ?? "").toLowerCase();
  const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
  const json = parseBooleanFlag("--json", parsed.flags["--json"]);
  const noCache = parseBooleanFlag("--no-cache", parsed.flags["--no-cache"]);
  const noReindex = parseBooleanFlag("--no-reindex", parsed.flags["--no-reindex"]);

  switch (subcommand) {
    case "list": {
      if (parsed.positionals.length > 2) {
        throw new UsageError("loop list does not accept positional arguments");
      }
      runLoopListCommand({ root, ws, json, noCache, noReindex });
      return 0;
    }
    case "show": {
      const id = parsed.positionals[2];
      if (!id || parsed.positionals.length > 3) {
        throw new UsageError("loop show requires <loop-or-template>");
      }
      const metaOnly = parseBooleanFlag("--meta", parsed.flags["--meta"]);
      runLoopShowCommand({ root, id, ws, metaOnly, json, noCache, noReindex });
      return 0;
    }
    case "fork": {
      const template = parsed.positionals[2];
      if (!template || parsed.positionals.length > 3) {
        throw new UsageError("loop fork requires <template>");
      }
      const scope = requireFlagValue("--scope", parsed.flags["--scope"]);
      if (!scope) {
        throw new UsageError("loop fork requires --scope");
      }
      const title = requireFlagValue("--title", parsed.flags["--title"]);
      const materializationMode = requireFlagValue("--materialization", parsed.flags["--materialization"]);
      const planningOnly = parseBooleanFlag("--planning-only", parsed.flags["--planning-only"]);
      const noChildren = parseBooleanFlag("--no-children", parsed.flags["--no-children"]);
      const dryRun = parseBooleanFlag("--dry-run", parsed.flags["--dry-run"]);
      const runId = requireFlagValue("--run-id", parsed.flags["--run-id"]);
      runLoopForkCommand({
        root,
        template,
        scope,
        title,
        ws,
        materializationMode: materializationMode as "default_children" | "planning_only" | "manual" | undefined,
        planningOnly,
        noChildren,
        dryRun,
        runId,
        json,
        noCache,
        noReindex,
      });
      return 0;
    }
    case "plan": {
      const id = parsed.positionals[2];
      if (!id || parsed.positionals.length > 3) {
        throw new UsageError("loop plan requires <loop>");
      }
      runLoopPlanCommand({ root, id, ws, json, noCache, noReindex });
      return 0;
    }
    case "next": {
      const id = parsed.positionals[2];
      if (!id || parsed.positionals.length > 3) {
        throw new UsageError("loop next requires <loop>");
      }
      runLoopNextCommand({ root, id, ws, json, noCache, noReindex });
      return 0;
    }
    case "runs": {
      const id = parsed.positionals[2];
      if (!id || parsed.positionals.length > 3) {
        throw new UsageError("loop runs requires <loop>");
      }
      runLoopRunsCommand({ root, id, ws, json, noCache, noReindex });
      return 0;
    }
    default:
      throw new UsageError("loop requires list/show/fork/plan/next/runs");
  }
}

function runGoalSubcommand(parsed: ParsedArgs, root: string): ExitCode {
  const subcommand = (parsed.positionals[1] ?? "").toLowerCase();
  const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
  const json = parseBooleanFlag("--json", parsed.flags["--json"]);
  switch (subcommand) {
    case "show": {
      const id = parsed.positionals[2];
      if (!id || parsed.positionals.length > 3) {
        throw new UsageError("goal show requires <goal-id-or-qid>");
      }
      runGoalShowCommand({ root, id, ws, json });
      return 0;
    }
    case "select": {
      const id = parsed.positionals[2];
      if (!id || parsed.positionals.length > 3) {
        throw new UsageError("goal select requires <goal-id-or-qid>");
      }
      runGoalSelectCommand({ root, id, ws, json });
      return 0;
    }
    case "activate": {
      const id = parsed.positionals[2];
      if (!id || parsed.positionals.length > 3) {
        throw new UsageError("goal activate requires <goal-id-or-qid>");
      }
      runGoalActivateCommand({ root, id, ws, json });
      return 0;
    }
    case "current":
      if (parsed.positionals.length > 2) {
        throw new UsageError("goal current does not accept positional arguments");
      }
      runGoalCurrentCommand({ root, ws, json });
      return 0;
    case "clear":
      if (parsed.positionals.length > 2) {
        throw new UsageError("goal clear does not accept positional arguments");
      }
      runGoalClearCommand({ root, json });
      return 0;
    case "next": {
      const id = parsed.positionals[2];
      if (parsed.positionals.length > 3) {
        throw new UsageError("goal next accepts at most one goal id");
      }
      runGoalNextCommand({ root, id, ws, json });
      return 0;
    }
    case "claim": {
      const first = parsed.positionals[2];
      const second = parsed.positionals[3];
      if (!first || parsed.positionals.length > 4) {
        throw new UsageError("goal claim requires <work-id-or-qid> or <goal-id-or-qid> <work-id-or-qid>");
      }
      runGoalClaimCommand({ root, id: second ? first : undefined, workId: second ?? first, ws, json });
      return 0;
    }
    case "evaluate": {
      const id = parsed.positionals[2];
      if (!id || parsed.positionals.length > 3) {
        throw new UsageError("goal evaluate requires <goal-id-or-qid>");
      }
      runGoalEvaluateCommand({ root, id, ws, json });
      return 0;
    }
    case "pause": {
      const id = parsed.positionals[2];
      if (!id || parsed.positionals.length > 3) {
        throw new UsageError("goal pause requires <goal-id-or-qid>");
      }
      runGoalPauseCommand({ root, id, ws, json });
      return 0;
    }
    case "resume": {
      const id = parsed.positionals[2];
      if (!id || parsed.positionals.length > 3) {
        throw new UsageError("goal resume requires <goal-id-or-qid>");
      }
      runGoalResumeCommand({ root, id, ws, json });
      return 0;
    }
    case "done": {
      const id = parsed.positionals[2];
      if (!id || parsed.positionals.length > 3) {
        throw new UsageError("goal done requires <goal-id-or-qid>");
      }
      runGoalDoneCommand({ root, id, ws, json });
      return 0;
    }
    case "archive": {
      const id = parsed.positionals[2];
      if (!id || parsed.positionals.length > 3) {
        throw new UsageError("goal archive requires <goal-id-or-qid>");
      }
      runGoalArchiveCommand({ root, id, ws, json });
      return 0;
    }
    default:
      throw new UsageError("goal requires show/select/activate/current/clear/next/claim/evaluate/pause/resume/done/archive");
  }
}

function runTaskSubcommand(parsed: ParsedArgs, root: string): ExitCode {
  const subcommand = (parsed.positionals[1] ?? "").toLowerCase();
  switch (subcommand) {
    case "start": {
      const id = parsed.positionals[2];
      if (!id || parsed.positionals.length > 3) {
        throw new UsageError("task start requires <id-or-qid>");
      }
      const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
      const runId = requireFlagValue("--run-id", parsed.flags["--run-id"]);
      const note = requireFlagValue("--note", parsed.flags["--note"]);
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runTaskStartCommand({ root, id, ws, runId, note, json });
      return 0;
    }
    case "update": {
      const id = parsed.positionals[2];
      if (!id || parsed.positionals.length > 3) {
        throw new UsageError("task update requires <id-or-qid>");
      }
      const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
      const status = requireFlagValue("--status", parsed.flags["--status"]);
      const priority = parseNumberFlag("--priority", parsed.flags["--priority"]);
      const addArtifacts = requireFlagValue("--add-artifacts", parsed.flags["--add-artifacts"]);
      const addLinks = requireFlagValue("--add-links", parsed.flags["--add-links"]);
      const addRefs = requireFlagValue("--add-refs", parsed.flags["--add-refs"]);
      const addSkills = requireFlagValue("--add-skills", parsed.flags["--add-skills"]);
      const addTags = requireFlagValue("--add-tags", parsed.flags["--add-tags"]);
      const addBlockedBy = requireFlagValue("--add-blocked-by", parsed.flags["--add-blocked-by"]);
      const clearBlockedBy = parseBooleanFlag("--clear-blocked-by", parsed.flags["--clear-blocked-by"]);
      const runId = requireFlagValue("--run-id", parsed.flags["--run-id"]);
      const note = requireFlagValue("--note", parsed.flags["--note"]);
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runTaskUpdateCommand({
        root,
        id,
        ws,
        status,
        priority,
        addArtifacts,
        addLinks,
        addRefs,
        addSkills,
        addTags,
        addBlockedBy,
        clearBlockedBy,
        runId,
        note,
        json,
      });
      return 0;
    }
    case "done": {
      const id = parsed.positionals[2];
      if (!id || parsed.positionals.length > 3) {
        throw new UsageError("task done requires <id-or-qid>");
      }
      const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
      const addArtifacts = requireFlagValue("--add-artifacts", parsed.flags["--add-artifacts"]);
      const addLinks = requireFlagValue("--add-links", parsed.flags["--add-links"]);
      const addRefs = requireFlagValue("--add-refs", parsed.flags["--add-refs"]);
      const checkpoint = requireFlagValue("--checkpoint", parsed.flags["--checkpoint"]);
      const checkpointKind = requireFlagValue("--checkpoint-kind", parsed.flags["--checkpoint-kind"]);
      const runId = requireFlagValue("--run-id", parsed.flags["--run-id"]);
      const note = requireFlagValue("--note", parsed.flags["--note"]);
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runTaskDoneCommand({
        root,
        id,
        ws,
        addArtifacts,
        addLinks,
        addRefs,
        checkpoint,
        checkpointKind,
        runId,
        note,
        json,
      });
      return 0;
    }
    default:
      throw new UsageError("task requires start/update/done");
  }
}

function runEventSubcommand(parsed: ParsedArgs, root: string): ExitCode {
  const subcommand = (parsed.positionals[1] ?? "").toLowerCase();
  switch (subcommand) {
    case "enable": {
      if (parsed.positionals.length > 2) {
        throw new UsageError("event enable does not accept positional arguments");
      }
      const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runEventEnableCommand({ root, ws, json });
      return 0;
    }
    case "append": {
      if (parsed.positionals.length > 2) {
        throw new UsageError("event append does not accept positional arguments");
      }
      const kind = requireFlagValue("--kind", parsed.flags["--kind"]);
      const status = requireFlagValue("--status", parsed.flags["--status"]);
      const refs = requireFlagValue("--refs", parsed.flags["--refs"]);
      if (!kind || !status || !refs) {
        throw new UsageError("event append requires --kind, --status, and --refs");
      }
      const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
      const artifacts = requireFlagValue("--artifacts", parsed.flags["--artifacts"]);
      const notes = requireFlagValue("--notes", parsed.flags["--notes"]);
      const runId = requireFlagValue("--run-id", parsed.flags["--run-id"]);
      const agent = requireFlagValue("--agent", parsed.flags["--agent"]);
      const skill = requireFlagValue("--skill", parsed.flags["--skill"]);
      const tool = requireFlagValue("--tool", parsed.flags["--tool"]);
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runEventAppendCommand({
        root,
        ws,
        kind,
        status,
        refs,
        artifacts,
        notes,
        runId,
        agent,
        skill,
        tool,
        json,
      });
      return 0;
    }
    default:
      throw new UsageError("event requires enable/append");
  }
}

function runCommand(parsed: ParsedArgs, root: string, runtime: ResolvedCliRuntime): ExitCode {
  const command = (parsed.positionals[0] ?? "").toLowerCase();
  switch (command) {
    case "init": {
      const force = parseBooleanFlag("--force", parsed.flags["--force"]);
      for (const removedFlag of ["--llm", "--agents", "--claude", "--omni"]) {
        if (parsed.flags[removedFlag] !== undefined) {
          throw new UsageError(`\`mdkg init ${removedFlag}\` was removed; use \`mdkg init --agent\``);
        }
      }
      const agent = parseBooleanFlag("--agent", parsed.flags["--agent"]);
      const noUpdateIgnores = parseBooleanFlag(
        "--no-update-ignores",
        parsed.flags["--no-update-ignores"]
      );
      const updateGitignore = parseBooleanFlag(
        "--update-gitignore",
        parsed.flags["--update-gitignore"]
      );
      const updateNpmignore = parseBooleanFlag(
        "--update-npmignore",
        parsed.flags["--update-npmignore"]
      );
      const updateDockerignore = parseBooleanFlag(
        "--update-dockerignore",
        parsed.flags["--update-dockerignore"]
      );
      runInitCommand({
        root,
        force,
        updateGitignore,
        updateNpmignore,
        updateDockerignore,
        noUpdateIgnores,
        agent,
      });
      return 0;
    }
    case "upgrade": {
      if (parsed.positionals.length > 1) {
        throw new UsageError("upgrade does not accept positional arguments");
      }
      const dryRun = parseBooleanFlag("--dry-run", parsed.flags["--dry-run"]);
      const apply = parseBooleanFlag("--apply", parsed.flags["--apply"]);
      if (dryRun && apply) {
        throw new UsageError("choose either --dry-run or --apply, not both");
      }
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runUpgradeCommand({ root, dryRun, apply, json });
      return 0;
    }
    case "guide":
      runGuideCommand({ root });
      return 0;
    case "index": {
      const tolerant = Boolean(parsed.flags["--tolerant"]);
      runIndexCommand({ root, tolerant });
      return 0;
    }
    case "new": {
      const type = parsed.positionals[1];
      const title = parsed.positionals.slice(2).join(" ");
      if (!type || !title) {
        throw new UsageError("new requires a type and title");
      }
      const id = requireFlagValue("--id", parsed.flags["--id"]);
      const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
      const status = requireFlagValue("--status", parsed.flags["--status"]);
      const priority = parseNumberFlag("--priority", parsed.flags["--priority"]);
      const epic = requireFlagValue("--epic", parsed.flags["--epic"]);
      const parent = requireFlagValue("--parent", parsed.flags["--parent"]);
      const prev = requireFlagValue("--prev", parsed.flags["--prev"]);
      const next = requireFlagValue("--next", parsed.flags["--next"]);
      const relates = requireFlagValue("--relates", parsed.flags["--relates"]);
      const blockedBy = requireFlagValue("--blocked-by", parsed.flags["--blocked-by"]);
      const blocks = requireFlagValue("--blocks", parsed.flags["--blocks"]);
      const links = requireFlagValue("--links", parsed.flags["--links"]);
      const artifacts = requireFlagValue("--artifacts", parsed.flags["--artifacts"]);
      const refs = requireFlagValue("--refs", parsed.flags["--refs"]);
      const aliases = requireFlagValue("--aliases", parsed.flags["--aliases"]);
      const skills = requireFlagValue("--skills", parsed.flags["--skills"]);
      const cases = requireFlagValue("--cases", parsed.flags["--cases"]);
      const tags = requireFlagValue("--tags", parsed.flags["--tags"]);
      const owners = requireFlagValue("--owners", parsed.flags["--owners"]);
      const supersedes = requireFlagValue("--supersedes", parsed.flags["--supersedes"]);
      const template = requireFlagValue("--template", parsed.flags["--template"]);
      const contractProfile = requireFlagValue("--contract-profile", parsed.flags["--contract-profile"]);
      const validationPolicyRef = requireFlagValue("--validation-policy-ref", parsed.flags["--validation-policy-ref"]);
      const evidencePolicyRef = requireFlagValue("--evidence-policy-ref", parsed.flags["--evidence-policy-ref"]);
      const receiptKind = requireFlagValue("--receipt-kind", parsed.flags["--receipt-kind"]);
      const redactionClass = requireFlagValue("--redaction-class", parsed.flags["--redaction-class"]);
      const noCache = parseBooleanFlag("--no-cache", parsed.flags["--no-cache"]);
      const noReindex = parseBooleanFlag("--no-reindex", parsed.flags["--no-reindex"]);
      const runId = requireFlagValue("--run-id", parsed.flags["--run-id"]);
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runNewCommand({
        root,
        type,
        title,
        id,
        ws,
        status,
        priority,
        epic,
        parent,
        prev,
        next,
        relates,
        blockedBy,
        blocks,
        links,
        artifacts,
        refs,
        aliases,
        skills,
        cases,
        tags,
        owners,
        supersedes,
        template,
        contractProfile,
        validationPolicyRef,
        evidencePolicyRef,
        receiptKind,
        redactionClass,
        noCache,
        noReindex,
        runId,
        json,
      });
      return 0;
    }
    case "workspace":
      return runWorkspaceSubcommand(parsed, root);
    case "db":
      return runDbSubcommand(parsed, root);
    case "skill":
      return runSkillSubcommand(parsed, root);
    case "capability":
      return runCapabilitySubcommand(parsed, root);
    case "manifest":
      return runSpecSubcommand(parsed, root, "manifest");
    case "spec":
      return runSpecSubcommand(parsed, root);
    case "archive":
      return runArchiveSubcommand(parsed, root);
    case "bundle":
      return runBundleSubcommand(parsed, root);
    case "graph":
      return runGraphSubcommand(parsed, root);
    case "git":
      return runGitSubcommand(parsed, root);
    case "subgraph":
      return runSubgraphSubcommand(parsed, root);
    case "work":
      return runWorkSubcommand(parsed, root);
    case "loop":
      return runLoopSubcommand(parsed, root);
    case "goal":
      return runGoalSubcommand(parsed, root);
    case "task":
      return runTaskSubcommand(parsed, root);
    case "event":
      return runEventSubcommand(parsed, root);
    case "show": {
      const id = parsed.positionals[1];
      if (!id || parsed.positionals.length > 2) {
        throw new UsageError("show requires a single id");
      }
      const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
      const metaOnly = parseBooleanFlag("--meta", parsed.flags["--meta"]);
      const format = parseQueryOutputFormat(parsed);
      const noCache = parseBooleanFlag("--no-cache", parsed.flags["--no-cache"]);
      const noReindex = parseBooleanFlag("--no-reindex", parsed.flags["--no-reindex"]);
      runShowCommand({
        root,
        id,
        ws,
        metaOnly,
        format,
        noCache,
        noReindex,
      });
      return 0;
    }
    case "list": {
      if (parsed.positionals.length > 1) {
        throw new UsageError("list does not accept positional arguments");
      }
      const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
      const type = requireFlagValue("--type", parsed.flags["--type"]);
      const status = requireFlagValue("--status", parsed.flags["--status"]);
      const epic = requireFlagValue("--epic", parsed.flags["--epic"]);
      const priority = parseNumberFlag("--priority", parsed.flags["--priority"]);
      const blocked = parseBooleanFlag("--blocked", parsed.flags["--blocked"]);
      const tags = parseCsvFlag("--tags", parsed.flags["--tags"]);
      const tagsMode = parseTagsModeFlag(parsed.flags["--tags-mode"]);
      const format = parseQueryOutputFormat(parsed);
      const noCache = parseBooleanFlag("--no-cache", parsed.flags["--no-cache"]);
      const noReindex = parseBooleanFlag("--no-reindex", parsed.flags["--no-reindex"]);
      runListCommand({
        root,
        ws,
        type,
        status,
        epic,
        priority,
        blocked,
        tags,
        tagsMode,
        format,
        noCache,
        noReindex,
      });
      return 0;
    }
    case "search": {
      if (parsed.positionals.length < 2) {
        throw new UsageError("search requires a query");
      }
      const query = parsed.positionals.slice(1).join(" ");
      const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
      const type = requireFlagValue("--type", parsed.flags["--type"]);
      const status = requireFlagValue("--status", parsed.flags["--status"]);
      const tags = parseCsvFlag("--tags", parsed.flags["--tags"]);
      const tagsMode = parseTagsModeFlag(parsed.flags["--tags-mode"]);
      const limit = parseNumberFlag("--limit", parsed.flags["--limit"]);
      const format = parseQueryOutputFormat(parsed);
      const noCache = parseBooleanFlag("--no-cache", parsed.flags["--no-cache"]);
      const noReindex = parseBooleanFlag("--no-reindex", parsed.flags["--no-reindex"]);
      runSearchCommand({
        root,
        query,
        ws,
        type,
        status,
        tags,
        tagsMode,
        limit,
        format,
        noCache,
        noReindex,
      });
      return 0;
    }
    case "pack": {
      const listProfiles = parseBooleanFlag("--list-profiles", parsed.flags["--list-profiles"]);
      if (listProfiles) {
        if (parsed.positionals.length > 1) {
          throw new UsageError("pack --list-profiles does not accept positional arguments");
        }
        printPackProfiles(runtime.log);
        return 0;
      }
      const id = parsed.positionals[1];
      if (!id || parsed.positionals.length > 2) {
        throw new UsageError("pack requires a single id");
      }
      const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
      const depth = parseNumberFlag("--depth", parsed.flags["--depth"]);
      const edges = parseEdgesFlag(parsed.flags["--edges"]);
      const verbose = parseBooleanFlag("--verbose", parsed.flags["--verbose"]);
      const concise = parseBooleanFlag("--concise", parsed.flags["--concise"]);
      const stripCode = parseBooleanFlag("--strip-code", parsed.flags["--strip-code"]);
      const format = requireFlagValue("--format", parsed.flags["--format"]);
      const packProfile = requireFlagValue("--pack-profile", parsed.flags["--pack-profile"]);
      const maxCodeLines = parseNumberFlag("--max-code-lines", parsed.flags["--max-code-lines"]);
      const maxChars = parseNumberFlag("--max-chars", parsed.flags["--max-chars"]);
      const maxLines = parseNumberFlag("--max-lines", parsed.flags["--max-lines"]);
      const maxTokens = parseNumberFlag("--max-tokens", parsed.flags["--max-tokens"]);
      const skills = requireFlagValue("--skills", parsed.flags["--skills"]);
      const skillsDepth = requireFlagValue("--skills-depth", parsed.flags["--skills-depth"]);
      const visibility = requireFlagValue("--visibility", parsed.flags["--visibility"]);
      const dryRun = parseBooleanFlag("--dry-run", parsed.flags["--dry-run"]);
      const stats = parseBooleanFlag("--stats", parsed.flags["--stats"]);
      const statsOut = requireFlagValue("--stats-out", parsed.flags["--stats-out"]);
      const truncationReport = requireFlagValue(
        "--truncation-report",
        parsed.flags["--truncation-report"]
      );
      const out = requireFlagValue("--out", parsed.flags["--out"]);
      const noCache = parseBooleanFlag("--no-cache", parsed.flags["--no-cache"]);
      const noReindex = parseBooleanFlag("--no-reindex", parsed.flags["--no-reindex"]);
      runPackCommand({
        root,
        id,
        ws,
        depth,
        edges,
        verbose,
        concise,
        stripCode,
        format,
        packProfile,
        maxCodeLines,
        maxChars,
        maxLines,
        maxTokens,
        skills,
        skillsDepth,
        visibility,
        dryRun,
        stats,
        statsOut,
        truncationReport,
        out,
        noCache,
        noReindex,
      });
      return 0;
    }
    case "handoff": {
      const sub = (parsed.positionals[1] ?? "").toLowerCase();
      if (!sub) {
        throw new UsageError("handoff requires a subcommand");
      }
      if (sub !== "create") {
        throw new UsageError(`unknown handoff subcommand: ${sub}`);
      }
      const id = parsed.positionals[2];
      if (!id || parsed.positionals.length > 3) {
        throw new UsageError("mdkg handoff create requires <id-or-qid>");
      }
      const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
      const out = requireFlagValue("--out", parsed.flags["--out"]);
      const depth = parseNumberFlag("--depth", parsed.flags["--depth"]);
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runHandoffCreateCommand({
        root,
        id,
        ws,
        out,
        depth,
        json,
      });
      return 0;
    }
    case "next": {
      if (parsed.positionals.length > 2) {
        throw new UsageError("next accepts at most one id");
      }
      const id = parsed.positionals[1];
      const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
      const noCache = parseBooleanFlag("--no-cache", parsed.flags["--no-cache"]);
      const noReindex = parseBooleanFlag("--no-reindex", parsed.flags["--no-reindex"]);
      runNextCommand({
        root,
        id,
        ws,
        noCache,
        noReindex,
      });
      return 0;
    }
    case "checkpoint": {
      const sub = (parsed.positionals[1] ?? "").toLowerCase();
      if (!sub) {
        throw new UsageError("checkpoint requires a subcommand");
      }
      if (sub !== "new") {
        throw new UsageError(`unknown checkpoint subcommand: ${sub}`);
      }
      const title = parsed.positionals.slice(2).join(" ");
      const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
      const relates = requireFlagValue("--relates", parsed.flags["--relates"]);
      const scope = requireFlagValue("--scope", parsed.flags["--scope"]);
      const kind = requireFlagValue("--kind", parsed.flags["--kind"]);
      const status = requireFlagValue("--status", parsed.flags["--status"]);
      const priority = parseNumberFlag("--priority", parsed.flags["--priority"]);
      const template = requireFlagValue("--template", parsed.flags["--template"]);
      const runId = requireFlagValue("--run-id", parsed.flags["--run-id"]);
      const note = requireFlagValue("--note", parsed.flags["--note"]);
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runCheckpointNewCommand({
        root,
        title,
        ws,
        relates,
        scope,
        kind,
        status,
        priority,
        template,
        runId,
        note,
        json,
      });
      return 0;
    }
    case "validate": {
      if (parsed.positionals.length > 1) {
        throw new UsageError("validate does not accept positional arguments");
      }
      const out = requireFlagValue("--out", parsed.flags["--out"]);
      const jsonOut = requireFlagValue("--json-out", parsed.flags["--json-out"]);
      const quiet = parseBooleanFlag("--quiet", parsed.flags["--quiet"]);
      const changedOnly = parseBooleanFlag("--changed-only", parsed.flags["--changed-only"]);
      const summary = parseBooleanFlag("--summary", parsed.flags["--summary"]);
      const limit = parseNumberFlag("--limit", parsed.flags["--limit"]);
      const profile = requireFlagValue("--profile", parsed.flags["--pack-profile"]);
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runValidateCommand({ root, out, jsonOut, quiet, json, changedOnly, summary, limit, profile });
      return 0;
    }
    case "status": {
      if (parsed.positionals.length > 1) {
        throw new UsageError("status does not accept positional arguments");
      }
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runStatusCommand({ root, json });
      return 0;
    }
    case "mcp":
      throw new UsageError("mcp serve requires the async CLI entrypoint");
    case "fix": {
      const sub = (parsed.positionals[1] ?? "").toLowerCase();
      if (!sub) {
        throw new UsageError("fix requires a subcommand");
      }
      if (!["plan", "apply", "ids"].includes(sub)) {
        throw new UsageError(`unknown fix subcommand: ${sub}`);
      }
      if (parsed.positionals.length > 2) {
        throw new UsageError(`fix ${sub} does not accept positional arguments`);
      }
      const family = requireFlagValue("--family", parsed.flags["--family"]);
      const target = requireFlagValue("--target", parsed.flags["--target"]);
      const baseRef = requireFlagValue("--base-ref", parsed.flags["--base-ref"]);
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      if (sub === "plan") {
        runFixPlanCommand({ root, family, target, baseRef, json });
        return 0;
      }
      if (sub === "apply") {
        runFixApplyCommand({ root, family, target, baseRef, json });
        return 0;
      }
      const apply = parseBooleanFlag("--apply", parsed.flags["--apply"]);
      runFixIdsCommand({ root, target, baseRef, json, apply });
      return 0;
    }
    case "format":
      if (parsed.positionals.length > 1) {
        throw new UsageError("format does not accept positional arguments");
      }
      const headings = parseBooleanFlag("--headings", parsed.flags["--headings"]);
      const dryRun = parseBooleanFlag("--dry-run", parsed.flags["--dry-run"]);
      const apply = parseBooleanFlag("--apply", parsed.flags["--apply"]);
      const summary = parseBooleanFlag("--summary", parsed.flags["--summary"]);
      const limit = parseNumberFlag("--limit", parsed.flags["--limit"]);
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      if (!headings && (dryRun || apply || json || summary || limit !== undefined)) {
        throw new UsageError("format --dry-run, --apply, --summary, --limit, and --json require --headings");
      }
      if (dryRun && apply) {
        throw new UsageError("format --headings cannot use --dry-run and --apply together");
      }
      runFormatCommand({ root, headings, dryRun, apply, json, summary, limit });
      return 0;
    case "doctor": {
      if (parsed.positionals.length > 1) {
        throw new UsageError("doctor does not accept positional arguments");
      }
      const noCache = parseBooleanFlag("--no-cache", parsed.flags["--no-cache"]);
      const noReindex = parseBooleanFlag("--no-reindex", parsed.flags["--no-reindex"]);
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      const strict = parseBooleanFlag("--strict", parsed.flags["--strict"]);
      runDoctorCommand({ root, noCache, noReindex, json, strict });
      return 0;
    }
    default:
      runtime.error(`Unknown command: ${command}`);
      printUsage(runtime.log);
      return 1;
  }
}

async function runMcpSubcommand(parsed: ParsedArgs, root: string): Promise<ExitCode> {
  const sub = (parsed.positionals[1] ?? "").toLowerCase();
  if (sub !== "serve") {
    throw new UsageError("mcp requires serve --stdio");
  }
  if (parsed.positionals.length > 2) {
    throw new UsageError("mcp serve does not accept positional arguments");
  }
  const stdio = parseBooleanFlag("--stdio", parsed.flags["--stdio"]);
  await runMcpServeCommand({ root, stdio });
  return 0;
}

export function runCli(argv: string[], runtime: CliRuntime = {}): ExitCode {
  const io = resolveRuntime(runtime);
  const parsed = parseArgs(argv);
  if (parsed.error) {
    io.error(parsed.error);
    printUsage(io.log);
    return 1;
  }

  if (parsed.help) {
    printCommandHelp(io.log, parsed.positionals[0], parsed.positionals[1]);
    return 0;
  }
  if (parsed.version) {
    io.log(readPackageVersion());
    return 0;
  }

  const command = (parsed.positionals[0] ?? "").toLowerCase();
  if (!command) {
    printUsage(io.log);
    return 0;
  }

  if (command === "help") {
    printCommandHelp(io.log, parsed.positionals[1], parsed.positionals[2]);
    return 0;
  }

  const root = parsed.root ? path.resolve(parsed.root) : io.cwd();
  if (shouldRequireConfig(command, parsed.flags) && !hasConfig(root)) {
    printRootError(io.error, root);
    return 1;
  }

  try {
    return runCommand(parsed, root, io);
  } catch (err) {
    return handleCommandError(err, command, io);
  }
}

export async function runCliAsync(argv: string[], runtime: CliRuntime = {}): Promise<ExitCode> {
  const io = resolveRuntime(runtime);
  const parsed = parseArgs(argv);
  if (parsed.error) {
    io.error(parsed.error);
    printUsage(io.log);
    return 1;
  }

  if (parsed.help) {
    printCommandHelp(io.log, parsed.positionals[0], parsed.positionals[1]);
    return 0;
  }
  if (parsed.version) {
    io.log(readPackageVersion());
    return 0;
  }

  const command = (parsed.positionals[0] ?? "").toLowerCase();
  if (!command) {
    printUsage(io.log);
    return 0;
  }

  if (command === "help") {
    printCommandHelp(io.log, parsed.positionals[1], parsed.positionals[2]);
    return 0;
  }

  const root = parsed.root ? path.resolve(parsed.root) : io.cwd();
  if (shouldRequireConfig(command, parsed.flags) && !hasConfig(root)) {
    printRootError(io.error, root);
    return 1;
  }

  try {
    if (command === "mcp") {
      return await runMcpSubcommand(parsed, root);
    }
    return runCommand(parsed, root, io);
  } catch (err) {
    return handleCommandError(err, command, io);
  }
}

export function main(argv: string[] = process.argv.slice(2)): void {
  runCliAsync(argv, { cwd: () => process.cwd() })
    .then((code) => process.exit(code))
    .catch((err) => {
      console.error(err instanceof Error ? err.message : String(err));
      process.exit(4);
    });
}

if (require.main === module) {
  main();
}
