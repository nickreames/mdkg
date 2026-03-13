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
import { runCheckpointNewCommand } from "./commands/checkpoint";
import { runInitCommand } from "./commands/init";
import { runNewCommand } from "./commands/new";
import { runGuideCommand } from "./commands/guide";
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
  runWorkspaceAddCommand,
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
  log("  new         Create a node from templates");
  log("  show        Show a node by id or qid");
  log("  list        List nodes with filters");
  log("  search      Search nodes by query");
  log("  pack        Generate a context pack");
  log("  skill       Create, list, show, search, and validate skills");
  log("  task        Start, update, and complete task-like nodes");
  log("  next        Suggest the next work item");
  log("  validate    Validate frontmatter + graph");
  log("\nAdvanced / maintenance commands:");
  log("  event       Enable or append episodic event logs");
  log("  checkpoint  Create a checkpoint node");
  log("  index       Build the global index");
  log("  guide       Show the mdkg guide");
  log("  format      Normalize frontmatter");
  log("  doctor      Run install and workspace diagnostics");
  log("  workspace   Manage workspaces (ls/add/rm)");
  log("\nQuickstart:");
  log("  mdkg init --llm");
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
  log("\nOptional agent-ready bootstrap:");
  log("  mdkg init --agent");
  log("\nRun `mdkg help <command>` or `mdkg <command> --help` for details.");
  printGlobalOptions(log);
}

function printInitHelp(log: LogFn): void {
  log("Usage:");
  log("  mdkg init [options]");
  log("\nOptions:");
  log("  --force               Overwrite existing mdkg files");
  log("  --llm                 Create AGENTS.md, CLAUDE.md, llms.txt, and AGENT_START.md");
  log("  --agent               Add SOUL/HUMAN/skills/events scaffolding and skill mirrors");
  log("  --no-update-ignores   Skip default .gitignore/.npmignore updates");
  log("  --update-gitignore    Append mdkg ignore entries");
  log("  --update-npmignore    Append mdkg ignore entries");
  log("  --update-dockerignore Append mdkg ignore entries");
  log("\nCompatibility flags still supported but not shown in the primary onboarding story.");
  printGlobalOptions(log);
}

function printNewHelp(log: LogFn): void {
  log("Usage:");
  log('  mdkg new <type> "<title>" [options]');
  log("\nTypes:");
  log("  rule prd edd dec prop epic feat task bug checkpoint test");
  log("\nOptions:");
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
  printGlobalOptions(log);
}

function printGuideHelp(log: LogFn): void {
  log("Usage:");
  log("  mdkg guide");
  printGlobalOptions(log);
}

function printWorkspaceHelp(log: LogFn): void {
  log("Usage:");
  log("  mdkg workspace ls");
  log("  mdkg workspace add <alias> <path> [--mdkg-dir <dir>]");
  log("  mdkg workspace rm <alias>");
  printGlobalOptions(log);
}

function printIndexHelp(log: LogFn): void {
  log("Usage:");
  log("  mdkg index [--tolerant]");
  printGlobalOptions(log);
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
      log('  mdkg skill new <slug> "<name>" --description "<description>" [options]');
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
      log("  mdkg skill validate [<slug>]");
      printGlobalOptions(log);
      return;
    case "sync":
      log("Usage:");
      log("  mdkg skill sync [--force]");
      log("\nWhen to use:");
      log("  Rebuild .agents/skills and .claude/skills from canonical .mdkg/skills.");
      printGlobalOptions(log);
      return;
    default:
      log("Usage:");
      log('  mdkg skill new <slug> "<name>" --description "<description>" [options]');
      log("  mdkg skill list [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]");
      log("  mdkg skill show <slug> [--meta] [--json|--xml|--toon|--md]");
      log('  mdkg skill search "<query>" [--tags <tag,tag,...>] [--tags-mode any|all] [--json|--xml|--toon|--md]');
      log("  mdkg skill validate [<slug>]");
      log("  mdkg skill sync [--force]");
      log("\nNotes:");
      log("  Skills are first-class under `mdkg skill ...`.");
      log("  Use stage tags like `stage:plan`, `stage:execute`, and `stage:review` with --tags.");
      printGlobalOptions(log);
  }
}

function printTaskHelp(log: LogFn, subcommand?: string): void {
  switch ((subcommand ?? "").toLowerCase()) {
    case "start":
      log("Usage:");
      log('  mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"]');
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
      log('                   [--clear-blocked-by] [--run-id <id>] [--note "<text>"]');
      log("\nWhen to use:");
      log("  Update structured task metadata and evidence while keeping body and narrative edits in markdown.");
      printGlobalOptions(log);
      return;
    case "done":
      log("Usage:");
      log('  mdkg task done <id-or-qid> [--ws <alias>] [--add-artifacts <a,...>] [--add-links <l,...>]');
      log('                 [--add-refs <id,...>] [--checkpoint "<title>"] [--run-id <id>] [--note "<text>"]');
      log("\nWhen to use:");
      log("  Mark a task-like node done, optionally create a checkpoint, and emit a completion event when enabled.");
      log("  Use `--checkpoint` for milestone compression, not every routine task completion.");
      printGlobalOptions(log);
      return;
    default:
      log("Usage:");
      log('  mdkg task start <id-or-qid> [--ws <alias>] [--run-id <id>] [--note "<text>"]');
      log("  mdkg task update <id-or-qid> [options]");
      log('  mdkg task done <id-or-qid> [--checkpoint "<title>"] [options]');
      log("\nNotes:");
      log("  `mdkg task ...` only supports task, bug, and test nodes in this wave.");
      log("  Feat and epic closeout remain checkpoint-first guidance plus manual parent updates.");
      printGlobalOptions(log);
  }
}

function printEventHelp(log: LogFn, subcommand?: string): void {
  switch ((subcommand ?? "").toLowerCase()) {
    case "enable":
      log("Usage:");
      log("  mdkg event enable [--ws <alias>]");
      log("\nWhen to use:");
      log("  Create or ensure the append-only JSONL event log for a workspace.");
      printGlobalOptions(log);
      return;
    case "append":
      log("Usage:");
      log("  mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...>");
      log('                    [--ws <alias>] [--artifacts <a,...>] [--notes "<text>"] [--run-id <id>]');
      log("                    [--agent <name>] [--skill <slug>] [--tool <id>]");
      log("\nWhen to use:");
      log("  Append explicit provenance events from an orchestrator or manual workflow.");
      printGlobalOptions(log);
      return;
    default:
      log("Usage:");
      log("  mdkg event enable [--ws <alias>]");
      log("  mdkg event append --kind <kind> --status <ok|error|retry|skipped> --refs <id,...> [options]");
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
  log("  mdkg checkpoint new <title> [--ws <alias>]");
  log('        [--relates <id,id,...>] [--scope <id,id,...>] [--run-id <id>] [--note "<text>"]');
  printGlobalOptions(log);
}

function printValidateHelp(log: LogFn): void {
  log("Usage:");
  log("  mdkg validate [--out <path>] [--quiet]");
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
  log("  - Index load/rebuild health");
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
    case "task":
      printTaskHelp(log, subcommand);
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
      runWorkspaceListCommand({ root });
      return 0;
    }
    case "add": {
      const alias = parsed.positionals[2];
      const workspacePath = parsed.positionals[3];
      if (!alias || !workspacePath) {
        throw new UsageError("workspace add requires <alias> <path>");
      }
      const mdkgDir = requireFlagValue("--mdkg-dir", parsed.flags["--mdkg-dir"]);
      runWorkspaceAddCommand({ root, alias, workspacePath, mdkgDir });
      return 0;
    }
    case "rm": {
      const alias = parsed.positionals[2];
      if (!alias || parsed.positionals.length > 3) {
        throw new UsageError("workspace rm requires <alias>");
      }
      runWorkspaceRemoveCommand({ root, alias });
      return 0;
    }
    default:
      throw new UsageError("workspace requires ls/add/rm");
  }
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
      runSkillValidateCommand({ root, slug });
      return 0;
    }
    case "sync": {
      if (parsed.positionals.length > 2) {
        throw new UsageError("skill sync does not accept positional arguments");
      }
      const force = parseBooleanFlag("--force", parsed.flags["--force"]);
      runSkillSyncCommand({ root, force });
      return 0;
    }
    default:
      throw new UsageError("skill requires new/list/show/search/validate/sync");
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
      runTaskStartCommand({ root, id, ws, runId, note });
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
      runEventEnableCommand({ root, ws });
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
      const createAgents = parseBooleanFlag("--agents", parsed.flags["--agents"]);
      const createClaude = parseBooleanFlag("--claude", parsed.flags["--claude"]);
      const createLlm = parseBooleanFlag("--llm", parsed.flags["--llm"]);
      if (parsed.flags["--omni"]) {
        throw new UsageError("`mdkg init --omni` was removed; use `mdkg init --agent`");
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
        createAgents,
        createClaude,
        createLlm,
        agent,
      });
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
      runNewCommand({
        root,
        type,
        title,
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
      });
      return 0;
    }
    case "workspace":
      return runWorkspaceSubcommand(parsed, root);
    case "skill":
      return runSkillSubcommand(parsed, root);
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
      });
      return 0;
    }
    case "validate": {
      if (parsed.positionals.length > 1) {
        throw new UsageError("validate does not accept positional arguments");
      }
      const out = requireFlagValue("--out", parsed.flags["--out"]);
      const quiet = parseBooleanFlag("--quiet", parsed.flags["--quiet"]);
      runValidateCommand({ root, out, quiet });
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
