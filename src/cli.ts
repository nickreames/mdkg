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
import { runNextCommand } from "./commands/next";
import { runValidateCommand } from "./commands/validate";
import { runFormatCommand } from "./commands/format";
import { runDoctorCommand } from "./commands/doctor";
import {
  runDbIndexRebuildCommand,
  runDbIndexStatusCommand,
  runDbIndexVerifyCommand,
} from "./commands/db";
import {
  runCapabilityListCommand,
  runCapabilityResolveCommand,
  runCapabilitySearchCommand,
  runCapabilityShowCommand,
} from "./commands/capability";
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
  runSubgraphAddCommand,
  runSubgraphDisableCommand,
  runSubgraphEnableCommand,
  runSubgraphListCommand,
  runSubgraphMaterializeCommand,
  runSubgraphRefreshCommand,
  runSubgraphRemoveCommand,
  runSubgraphShowCommand,
  runSubgraphSyncCommand,
  runSubgraphVerifyCommand,
} from "./commands/subgraph";
import { runCheckpointNewCommand } from "./commands/checkpoint";
import { runInitCommand } from "./commands/init";
import { runNewCommand } from "./commands/new";
import { runGuideCommand } from "./commands/guide";
import { runUpgradeCommand } from "./commands/upgrade";
import {
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
  runWorkOrderUpdateCommand,
  runWorkReceiptNewCommand,
  runWorkReceiptUpdateCommand,
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
  log("  skill       Create, list, show, search, and validate skills");
  log("  capability  List, search, show, and resolve cached capability surfaces");
  log("  archive     Add, list, show, verify, and compress archive sidecars");
  log("  bundle      Create, list, show, and verify full graph snapshot bundles");
  log("  subgraph    Register, sync, materialize, and verify read-only child graph snapshots");
  log("  work        Create and update work contracts, orders, receipts, and artifacts");
  log("  goal        Inspect and advance recursive goal nodes");
  log("  task        Start, update, and complete task-like nodes");
  log("  next        Suggest the next work item");
  log("  validate    Validate frontmatter + graph");
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
  log("  rule prd edd dec prop goal epic feat task bug checkpoint test");
  log("\nAgent workflow file types:");
  log("  spec work work_order receipt feedback dispute proposal");
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
  log("\nAdvanced metadata flags:");
  log("  --parent --prev --next --relates --blocked-by --blocks");
  log("  --links --artifacts --refs --aliases --owners --cases --supersedes");
  log("  --owners <owner,owner,...> Owners");
  log("\nNotes:");
  log("  spec/work scaffold as validation-clean docs; relational workflow docs need real refs.");
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
    default:
      log("Usage:");
      log("  mdkg db index rebuild [--tolerant] [--json]");
      log("  mdkg db index status [--json]");
      log("  mdkg db index verify [--json]");
      log("  mdkg db init [--json]");
      log("  mdkg db migrate [--json]");
      log("  mdkg db verify [--json]");
      log("  mdkg db stats [--json]");
      log("\nBoundaries:");
      log("  - `.mdkg/index` is the rebuildable graph cache");
      log("  - `.mdkg/db` is future project application state");
      log("  - active `.mdkg/db/runtime` and transient DB files are ignored by default");
      log("  - no raw SQL, hosted queue, profile, or publish behavior is exposed here");
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
  log("               [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]");
  log("\nWhen to use:");
  log("  Search mdkg nodes by metadata. Use `mdkg skill search` for skills.");
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
  log("  --truncation-report --stats-out");
  log("\nExamples:");
  log("  mdkg pack --list-profiles");
  log("  mdkg pack task-1");
  log("  mdkg pack task-1 --profile concise --dry-run --stats");
  log("  mdkg pack task-1 --visibility public --dry-run");
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
      log("  Rebuild .agents/skills and .claude/skills from canonical .mdkg/skills.");
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
      log("  mdkg subgraph add/list/show/rm/enable/disable/verify/refresh/sync/materialize ...");
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
      log("  mdkg subgraph sync [alias|--all] [--dry-run] [--allow-dirty] [--json]");
      log("  mdkg subgraph materialize [alias|--all] --target <path> [--clean] [--gitignore] [--json]");
      log("\nNotes:");
      log("  - subgraphs are read-only graph views backed by explicit bundle snapshots");
      log("  - default permissions are read-only and default freshness is 3600 seconds");
      log("  - refresh reloads configured bundle sources only; it does not build child bundles");
      log("  - sync builds root-owned bundles from clean configured child source_path repos");
      log("  - materialize extracts bundle contents into generated inspection trees");
  }
  printGlobalOptions(log);
}

function printWorkHelp(log: LogFn, subcommand?: string): void {
  switch ((subcommand ?? "").toLowerCase()) {
    case "contract":
      log("Usage:");
      log('  mdkg work contract new "<title>" --id <work.id> --agent-id <agent.id> --kind <kind> --inputs <...> --outputs <...> [--required-capabilities <...>] [--pricing-model <...>] [--json]');
      break;
    case "order":
      log("Usage:");
      log('  mdkg work order new "<title>" --id <order.id> --work-id <work.id> --requester <ref> [--request-ref <ref>] [--input-refs <...>] [--requested-outputs <...>] [--json]');
      log("  mdkg work order update <id-or-qid> [--status <status>] [--add-input-refs <...>] [--add-artifacts <...>] [--json]");
      break;
    case "receipt":
      log("Usage:");
      log('  mdkg work receipt new "<title>" --id <receipt.id> --work-order-id <order.id> --outcome success|partial|failure [--receipt-status recorded|verified|rejected|superseded] [--json]');
      log("  mdkg work receipt update <id-or-qid> [--receipt-status <status>] [--add-artifacts <...>] [--add-proof-refs <...>] [--add-attestation-refs <...>] [--json]");
      break;
    case "artifact":
      log("Usage:");
      log("  mdkg work artifact add <order-or-receipt-id-or-qid> <file> [--id <archive.id>] [--kind source|artifact] [--json]");
      break;
    default:
      log("Usage:");
      log("  mdkg work contract new ...");
      log("  mdkg work order new|update ...");
      log("  mdkg work receipt new|update ...");
      log("  mdkg work artifact add ...");
      log("\nNotes:");
      log("  - work commands mutate semantic mirror files only");
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
      log("  Move a task, bug, or test into progress as a structured state change.");
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
      log('                 [--add-refs <id,...>] [--checkpoint "<title>"] [--run-id <id>] [--note "<text>"] [--json]');
      log("\nWhen to use:");
      log("  Mark a task-like node done, optionally create a checkpoint, and emit a completion event when enabled.");
      log("  Use `--checkpoint` for milestone compression, not every routine task completion.");
      printGlobalOptions(log);
      return;
    default:
      log("Usage:");
      log('  mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"] [--json]');
      log("  mdkg task update <id-or-qid> [options] [--json]");
      log('  mdkg task done <id-or-qid> [--checkpoint "<title>"] [options] [--json]');
      log("\nNotes:");
      log("  `mdkg task ...` only supports feat, task, bug, and test nodes.");
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
      log("  Inspect a goal condition, current goal state, active node, required skills, and required checks.");
      printGlobalOptions(log);
      return;
    case "next":
      log("Usage:");
      log("  mdkg goal next [goal-id-or-qid] [--ws <alias>] [--json]");
      log("\nWhen to use:");
      log("  Select the next local feature, task, bug, or test inside a recursive goal without mutating active_node.");
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
      printGlobalOptions(log);
      return;
    default:
      log("Usage:");
      log("  mdkg goal show <goal-id-or-qid> [--json]");
      log("  mdkg goal select <goal-id-or-qid> [--json]");
      log("  mdkg goal current [--json]");
      log("  mdkg goal next [goal-id-or-qid] [--json]");
      log("  mdkg goal claim [goal-id-or-qid] <work-id-or-qid> [--json]");
      log("  mdkg goal evaluate <goal-id-or-qid> [--json]");
      log("  mdkg goal clear [--json]");
      log("  mdkg goal pause|resume|done <goal-id-or-qid> [--json]");
      log("\nNotes:");
      log("  - goals orchestrate recursive progress; features, tasks, bugs, and tests are iterable work units");
      log("  - `mdkg goal next` is read-only; use `mdkg goal claim` to update active_node");
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
  log("  mdkg checkpoint new <title> [--ws <alias>] [--json]");
  log('        [--relates <id,id,...>] [--scope <id,id,...>] [--run-id <id>] [--note "<text>"]');
  printGlobalOptions(log);
}

function printValidateHelp(log: LogFn): void {
  log("Usage:");
  log("  mdkg validate [--out <path>] [--quiet] [--json]");
  printGlobalOptions(log);
}

function printFormatHelp(log: LogFn): void {
  log("Usage:");
  log("  mdkg format");
  printGlobalOptions(log);
}

function printDoctorHelp(log: LogFn): void {
  log("Usage:");
  log("  mdkg doctor [--json]");
  log("\nChecks:");
  log("  - Node.js version compatibility");
  log("  - mdkg repo root + .mdkg/config.json");
  log("  - Template schema availability");
  log("  - Archive sidecar storage hygiene");
  log("  - Bundle snapshot storage guidance");
  log("  - Bundle import health and staleness");
  log("  - Index load/rebuild health");
  log("  - Capability cache load/rebuild health");
  log("  - SQLite cache health when enabled");
  log("\nOptions:");
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
    case "skill":
      printSkillHelp(log, subcommand);
      return;
    case "capability":
      printCapabilityHelp(log, subcommand);
      return;
    case "archive":
      printArchiveHelp(log, subcommand);
      return;
    case "bundle":
      printBundleHelp(log, subcommand);
      return;
    case "subgraph":
      printSubgraphHelp(log, subcommand);
      return;
    case "work":
      printWorkHelp(log, subcommand);
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
    case "init":
    case "migrate":
    case "verify":
    case "stats": {
      if (parsed.positionals.length > 2) {
        throw new UsageError(`mdkg db ${subcommand} does not accept positional arguments`);
      }
      throw new UsageError(`mdkg db ${subcommand} is planned; implementation is scoped to task-${subcommand === "init" ? "227" : subcommand === "migrate" ? "228" : "229"}`);
    }
    default:
      throw new UsageError("mdkg db requires index/init/migrate/verify/stats");
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
      throw new UsageError("subgraph requires add/list/show/rm/enable/disable/verify/refresh/sync/materialize");
  }
}

function runWorkSubcommand(parsed: ParsedArgs, root: string): ExitCode {
  const domain = (parsed.positionals[1] ?? "").toLowerCase();
  const action = (parsed.positionals[2] ?? "").toLowerCase();
  const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
  const json = parseBooleanFlag("--json", parsed.flags["--json"]);

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
    const inputRefs = requireFlagValue("--input-refs", parsed.flags["--input-refs"]);
    const requestedOutputs = requireFlagValue("--requested-outputs", parsed.flags["--requested-outputs"]);
    const constraintRefs = requireFlagValue("--constraint-refs", parsed.flags["--constraint-refs"]);
    runWorkOrderNewCommand({
      root,
      ws,
      title,
      id,
      workId,
      requester,
      requestRef,
      inputRefs,
      requestedOutputs,
      constraintRefs,
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
    const addArtifacts = requireFlagValue("--add-artifacts", parsed.flags["--add-artifacts"]);
    runWorkOrderUpdateCommand({ root, ws, id, status, addInputRefs, addArtifacts, json });
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
    const artifacts = requireFlagValue("--artifacts", parsed.flags["--artifacts"]);
    const proofRefs = requireFlagValue("--proof-refs", parsed.flags["--proof-refs"]);
    const attestationRefs = requireFlagValue("--attestation-refs", parsed.flags["--attestation-refs"]);
    const inputHashes = requireFlagValue("--input-hashes", parsed.flags["--input-hashes"]);
    const outputHashes = requireFlagValue("--output-hashes", parsed.flags["--output-hashes"]);
    runWorkReceiptNewCommand({
      root,
      ws,
      title,
      id,
      workOrderId,
      outcome,
      receiptStatus,
      costRef,
      artifacts,
      proofRefs,
      attestationRefs,
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
    runWorkReceiptUpdateCommand({
      root,
      ws,
      id,
      receiptStatus,
      addArtifacts,
      addProofRefs,
      addAttestationRefs,
      json,
    });
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

  throw new UsageError("work requires contract new, order new/update, receipt new/update, or artifact add");
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
    default:
      throw new UsageError("goal requires show/select/current/clear/next/claim/evaluate/pause/resume/done");
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
    case "archive":
      return runArchiveSubcommand(parsed, root);
    case "bundle":
      return runBundleSubcommand(parsed, root);
    case "subgraph":
      return runSubgraphSubcommand(parsed, root);
    case "work":
      return runWorkSubcommand(parsed, root);
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
      const quiet = parseBooleanFlag("--quiet", parsed.flags["--quiet"]);
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runValidateCommand({ root, out, quiet, json });
      return 0;
    }
    case "format":
      if (parsed.positionals.length > 1) {
        throw new UsageError("format does not accept positional arguments");
      }
      runFormatCommand({ root });
      return 0;
    case "doctor": {
      if (parsed.positionals.length > 1) {
        throw new UsageError("doctor does not accept positional arguments");
      }
      const noCache = parseBooleanFlag("--no-cache", parsed.flags["--no-cache"]);
      const noReindex = parseBooleanFlag("--no-reindex", parsed.flags["--no-reindex"]);
      const json = parseBooleanFlag("--json", parsed.flags["--json"]);
      runDoctorCommand({ root, noCache, noReindex, json });
      return 0;
    }
    default:
      runtime.error(`Unknown command: ${command}`);
      printUsage(runtime.log);
      return 1;
  }
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

export function main(argv: string[] = process.argv.slice(2)): void {
  process.exit(runCli(argv, { cwd: () => process.cwd() }));
}

if (require.main === module) {
  main();
}
