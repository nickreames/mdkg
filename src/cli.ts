#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { parseArgs } from "./util/argparse";
import { runIndexCommand } from "./commands/index";
import { runListCommand } from "./commands/list";
import { runSearchCommand } from "./commands/search";
import { runShowCommand } from "./commands/show";
import { runPackCommand } from "./commands/pack";
import { runNextCommand } from "./commands/next";
import { runValidateCommand } from "./commands/validate";
import { runFormatCommand } from "./commands/format";
import { runCheckpointNewCommand } from "./commands/checkpoint";
import { runInitCommand } from "./commands/init";
import { runNewCommand } from "./commands/new";
import { runGuideCommand } from "./commands/guide";
import {
  runWorkspaceAddCommand,
  runWorkspaceListCommand,
  runWorkspaceRemoveCommand,
} from "./commands/workspace";
import { NotFoundError, UsageError, ValidationError } from "./util/errors";

function printGlobalOptions(): void {
  console.log("\nGlobal options:");
  console.log("  --root, -r <path>   Run against a specific repo root");
  console.log("  --help, -h          Show help");
  console.log("  --no-cache          Bypass reading the index cache");
  console.log("  --no-reindex        Do not auto rebuild when cache is stale");
}

function printUsage(): void {
  console.log("mdkg - Markdown Knowledge Graph");
  console.log("\nUsage:");
  console.log("  mdkg <command> [options]");
  console.log("\nCommands:");
  console.log("  init        Initialize .mdkg scaffolding");
  console.log("  guide       Show the mdkg guide");
  console.log("  new         Create a node from templates");
  console.log("  workspace   Manage workspaces (ls/add/rm)");
  console.log("  index       Build the global index");
  console.log("  show        Show a node by id or qid");
  console.log("  list        List nodes with filters");
  console.log("  search      Search nodes by query");
  console.log("  pack        Generate a context pack");
  console.log("  next        Suggest the next work item");
  console.log("  checkpoint  Create a checkpoint node");
  console.log("  validate    Validate frontmatter + graph");
  console.log("  format      Normalize frontmatter");
  console.log("\nQuickstart:");
  console.log("  mdkg init --llm");
  console.log("  mdkg index");
  console.log('  mdkg new task "..." --status todo --priority 1');
  console.log("  mdkg list --status todo");
  console.log("  mdkg pack <id> --verbose");
  console.log("  mdkg validate");
  console.log("\nRun `mdkg help <command>` or `mdkg <command> --help` for details.");
  printGlobalOptions();
}

function printInitHelp(): void {
  console.log("Usage:");
  console.log("  mdkg init [options]");
  console.log("\nOptions:");
  console.log("  --force               Overwrite existing mdkg files");
  console.log("  --agents              Create AGENTS.md");
  console.log("  --claude              Create CLAUDE.md");
  console.log("  --llm                 Create AGENTS.md and CLAUDE.md");
  console.log("  --update-gitignore    Append mdkg ignore entries");
  console.log("  --update-npmignore    Append mdkg ignore entries");
  console.log("  --update-dockerignore Append mdkg ignore entries");
  printGlobalOptions();
}

function printNewHelp(): void {
  console.log("Usage:");
  console.log('  mdkg new <type> "<title>" [options]');
  console.log("\nTypes:");
  console.log("  rule prd edd dec prop epic feat task bug checkpoint test");
  console.log("\nOptions:");
  console.log("  --ws <alias>               Workspace alias (default root)");
  console.log("  --status <status>          Work item or decision status");
  console.log("  --priority <0..9>          Work item priority");
  console.log("  --epic <id>                Epic id");
  console.log("  --parent <id>              Parent id");
  console.log("  --prev <id>                Previous id");
  console.log("  --next <id>                Next id");
  console.log("  --relates <id,id,...>      Related ids");
  console.log("  --blocked-by <id,id,...>   Blockers");
  console.log("  --blocks <id,id,...>       Blocked items");
  console.log("  --links <ref,ref,...>      Link refs");
  console.log("  --artifacts <ref,ref,...>  Artifact refs");
  console.log("  --refs <id,id,...>         Non-edge refs");
  console.log("  --aliases <text,text,...>  Search aliases");
  console.log("  --cases <id,id,...>        Test case ids");
  console.log("  --tags <tag,tag,...>       Tags");
  console.log("  --owners <owner,owner,...> Owners");
  console.log("  --supersedes <dec-id>      Decision supersedes");
  console.log("  --template <set>           Template set");
  printGlobalOptions();
}

function printGuideHelp(): void {
  console.log("Usage:");
  console.log("  mdkg guide");
  printGlobalOptions();
}

function printWorkspaceHelp(): void {
  console.log("Usage:");
  console.log("  mdkg workspace ls");
  console.log("  mdkg workspace add <alias> <path> [--mdkg-dir <dir>]");
  console.log("  mdkg workspace rm <alias>");
  printGlobalOptions();
}

function printIndexHelp(): void {
  console.log("Usage:");
  console.log("  mdkg index [--tolerant]");
  printGlobalOptions();
}

function printShowHelp(): void {
  console.log("Usage:");
  console.log("  mdkg show <id-or-qid> [--ws <alias>] [--body]");
  printGlobalOptions();
}

function printListHelp(): void {
  console.log("Usage:");
  console.log("  mdkg list [--type <type>] [--status <status>] [--ws <alias>] [--epic <id>]");
  console.log("           [--priority <n>] [--blocked]");
  printGlobalOptions();
}

function printSearchHelp(): void {
  console.log("Usage:");
  console.log('  mdkg search "<query>" [--type <type>] [--status <status>] [--ws <alias>]');
  printGlobalOptions();
}

function printPackHelp(): void {
  console.log("Usage:");
  console.log("  mdkg pack <id-or-qid> [-d <n>] [-e <keys>] [-v]");
  console.log("           [-f md|json|toon|xml] [-o <path>] [-w <alias>]");
  printGlobalOptions();
}

function printNextHelp(): void {
  console.log("Usage:");
  console.log("  mdkg next [<id-or-qid>] [--ws <alias>]");
  printGlobalOptions();
}

function printCheckpointHelp(): void {
  console.log("Usage:");
  console.log("  mdkg checkpoint new <title> [--ws <alias>]");
  console.log("        [--relates <id,id,...>] [--scope <id,id,...>]");
  printGlobalOptions();
}

function printValidateHelp(): void {
  console.log("Usage:");
  console.log("  mdkg validate [--out <path>] [--quiet]");
  printGlobalOptions();
}

function printFormatHelp(): void {
  console.log("Usage:");
  console.log("  mdkg format");
  printGlobalOptions();
}

function printCommandHelp(command?: string): void {
  switch ((command ?? "").toLowerCase()) {
    case "":
    case "help":
      printUsage();
      return;
    case "init":
      printInitHelp();
      return;
    case "guide":
      printGuideHelp();
      return;
    case "new":
      printNewHelp();
      return;
    case "workspace":
      printWorkspaceHelp();
      return;
    case "index":
      printIndexHelp();
      return;
    case "show":
      printShowHelp();
      return;
    case "list":
      printListHelp();
      return;
    case "search":
      printSearchHelp();
      return;
    case "pack":
      printPackHelp();
      return;
    case "next":
      printNextHelp();
      return;
    case "checkpoint":
      printCheckpointHelp();
      return;
    case "validate":
      printValidateHelp();
      return;
    case "format":
      printFormatHelp();
      return;
    default:
      printUsage();
  }
}

function printRootError(root: string): void {
  console.error("mdkg must be run from a repo root with .mdkg/config.json");
  console.error(`root checked: ${root}`);
  console.error("hint: run from the repo root, pass --root <path>, or run `mdkg init`");
}

function hasConfig(root: string): boolean {
  const configPath = path.join(root, ".mdkg", "config.json");
  return fs.existsSync(configPath);
}

function requireFlagValue(
  flag: string,
  value: string | boolean | undefined
): string | undefined {
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

function parseNumberFlag(
  flag: string,
  value: string | boolean | undefined
): number | undefined {
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

function handleCommandError(err: unknown): never {
  const message = err instanceof Error ? err.message : String(err);
  if (err instanceof UsageError) {
    console.error(message);
    printUsage();
    process.exit(1);
  }
  if (err instanceof ValidationError) {
    console.error(message);
    process.exit(2);
  }
  if (err instanceof NotFoundError) {
    console.error(message);
    process.exit(3);
  }
  console.error(message);
  process.exit(4);
}

function main(): void {
  const parsed = parseArgs(process.argv.slice(2));
  if (parsed.error) {
    console.error(parsed.error);
    printUsage();
    process.exit(1);
  }

  if (parsed.help) {
    printCommandHelp(parsed.positionals[0]);
    process.exit(0);
  }

  const command = (parsed.positionals[0] ?? "").toLowerCase();
  if (!command) {
    printUsage();
    process.exit(0);
  }

  if (command === "help") {
    printCommandHelp(parsed.positionals[1]);
    process.exit(0);
  }

  const root = parsed.root ? path.resolve(parsed.root) : process.cwd();
  if (command !== "init" && command !== "help") {
    if (!hasConfig(root)) {
      printRootError(root);
      process.exit(1);
    }
  }

  switch (command) {
    case "init": {
      const force = parseBooleanFlag("--force", parsed.flags["--force"]);
      const createAgents = parseBooleanFlag("--agents", parsed.flags["--agents"]);
      const createClaude = parseBooleanFlag("--claude", parsed.flags["--claude"]);
      const createLlm = parseBooleanFlag("--llm", parsed.flags["--llm"]);
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
      try {
        runInitCommand({
          root,
          force,
          updateGitignore,
          updateNpmignore,
          updateDockerignore,
          createAgents,
          createClaude,
          createLlm,
        });
      } catch (err) {
        handleCommandError(err);
      }
      process.exit(0);
    }
    case "guide": {
      try {
        runGuideCommand({ root });
      } catch (err) {
        handleCommandError(err);
      }
      process.exit(0);
    }
    case "index": {
      const tolerant = Boolean(parsed.flags["--tolerant"]);
      try {
        runIndexCommand({ root, tolerant });
      } catch (err) {
        handleCommandError(err);
      }
      process.exit(0);
    }
    case "new": {
      const type = parsed.positionals[1];
      const title = parsed.positionals.slice(2).join(" ");
      if (!type || !title) {
        handleCommandError(new UsageError("new requires a type and title"));
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
      const cases = requireFlagValue("--cases", parsed.flags["--cases"]);
      const tags = requireFlagValue("--tags", parsed.flags["--tags"]);
      const owners = requireFlagValue("--owners", parsed.flags["--owners"]);
      const supersedes = requireFlagValue("--supersedes", parsed.flags["--supersedes"]);
      const template = requireFlagValue("--template", parsed.flags["--template"]);
      const noCache = parseBooleanFlag("--no-cache", parsed.flags["--no-cache"]);
      const noReindex = parseBooleanFlag("--no-reindex", parsed.flags["--no-reindex"]);
      try {
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
          cases,
          tags,
          owners,
          supersedes,
          template,
          noCache,
          noReindex,
        });
      } catch (err) {
        handleCommandError(err);
      }
      process.exit(0);
    }
    case "workspace": {
      const subcommand = (parsed.positionals[1] ?? "").toLowerCase();
      switch (subcommand) {
        case "ls": {
          if (parsed.positionals.length > 2) {
            handleCommandError(new UsageError("workspace ls takes no arguments"));
          }
          try {
            runWorkspaceListCommand({ root });
          } catch (err) {
            handleCommandError(err);
          }
          process.exit(0);
        }
        case "add": {
          const alias = parsed.positionals[2];
          const workspacePath = parsed.positionals[3];
          if (!alias || !workspacePath) {
            handleCommandError(new UsageError("workspace add requires <alias> <path>"));
          }
          const mdkgDir = requireFlagValue("--mdkg-dir", parsed.flags["--mdkg-dir"]);
          try {
            runWorkspaceAddCommand({ root, alias, workspacePath, mdkgDir });
          } catch (err) {
            handleCommandError(err);
          }
          process.exit(0);
        }
        case "rm": {
          const alias = parsed.positionals[2];
          if (!alias || parsed.positionals.length > 3) {
            handleCommandError(new UsageError("workspace rm requires <alias>"));
          }
          try {
            runWorkspaceRemoveCommand({ root, alias });
          } catch (err) {
            handleCommandError(err);
          }
          process.exit(0);
        }
        default: {
          handleCommandError(new UsageError("workspace requires ls/add/rm"));
        }
      }
      process.exit(0);
    }
    case "show": {
      const id = parsed.positionals[1];
      if (!id || parsed.positionals.length > 2) {
        handleCommandError(new UsageError("show requires a single id"));
      }
      const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
      const includeBody = parseBooleanFlag("--body", parsed.flags["--body"]);
      const noCache = parseBooleanFlag("--no-cache", parsed.flags["--no-cache"]);
      const noReindex = parseBooleanFlag("--no-reindex", parsed.flags["--no-reindex"]);
      try {
        runShowCommand({
          root,
          id,
          ws,
          includeBody,
          noCache,
          noReindex,
        });
      } catch (err) {
        handleCommandError(err);
      }
      process.exit(0);
    }
    case "list": {
      if (parsed.positionals.length > 1) {
        handleCommandError(new UsageError("list does not accept positional arguments"));
      }
      const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
      const type = requireFlagValue("--type", parsed.flags["--type"]);
      const status = requireFlagValue("--status", parsed.flags["--status"]);
      const epic = requireFlagValue("--epic", parsed.flags["--epic"]);
      const priority = parseNumberFlag("--priority", parsed.flags["--priority"]);
      const blocked = parseBooleanFlag("--blocked", parsed.flags["--blocked"]);
      const noCache = parseBooleanFlag("--no-cache", parsed.flags["--no-cache"]);
      const noReindex = parseBooleanFlag("--no-reindex", parsed.flags["--no-reindex"]);
      try {
        runListCommand({
          root,
          ws,
          type,
          status,
          epic,
          priority,
          blocked,
          noCache,
          noReindex,
        });
      } catch (err) {
        handleCommandError(err);
      }
      process.exit(0);
    }
    case "search": {
      if (parsed.positionals.length < 2) {
        handleCommandError(new UsageError("search requires a query"));
      }
      const query = parsed.positionals.slice(1).join(" ");
      const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
      const type = requireFlagValue("--type", parsed.flags["--type"]);
      const status = requireFlagValue("--status", parsed.flags["--status"]);
      const noCache = parseBooleanFlag("--no-cache", parsed.flags["--no-cache"]);
      const noReindex = parseBooleanFlag("--no-reindex", parsed.flags["--no-reindex"]);
      try {
        runSearchCommand({
          root,
          query,
          ws,
          type,
          status,
          noCache,
          noReindex,
        });
      } catch (err) {
        handleCommandError(err);
      }
      process.exit(0);
    }
    case "pack": {
      const id = parsed.positionals[1];
      if (!id || parsed.positionals.length > 2) {
        handleCommandError(new UsageError("pack requires a single id"));
      }
      const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
      const depth = parseNumberFlag("--depth", parsed.flags["--depth"]);
      const edges = parseEdgesFlag(parsed.flags["--edges"]);
      const verbose = parseBooleanFlag("--verbose", parsed.flags["--verbose"]);
      const format = requireFlagValue("--format", parsed.flags["--format"]);
      const out = requireFlagValue("--out", parsed.flags["--out"]);
      const noCache = parseBooleanFlag("--no-cache", parsed.flags["--no-cache"]);
      const noReindex = parseBooleanFlag("--no-reindex", parsed.flags["--no-reindex"]);
      try {
        runPackCommand({
          root,
          id,
          ws,
          depth,
          edges,
          verbose,
          format,
          out,
          noCache,
          noReindex,
        });
      } catch (err) {
        handleCommandError(err);
      }
      process.exit(0);
    }
    case "next": {
      if (parsed.positionals.length > 2) {
        handleCommandError(new UsageError("next accepts at most one id"));
      }
      const id = parsed.positionals[1];
      const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
      const noCache = parseBooleanFlag("--no-cache", parsed.flags["--no-cache"]);
      const noReindex = parseBooleanFlag("--no-reindex", parsed.flags["--no-reindex"]);
      try {
        runNextCommand({
          root,
          id,
          ws,
          noCache,
          noReindex,
        });
      } catch (err) {
        handleCommandError(err);
      }
      process.exit(0);
    }
    case "checkpoint": {
      const sub = (parsed.positionals[1] ?? "").toLowerCase();
      if (!sub) {
        handleCommandError(new UsageError("checkpoint requires a subcommand"));
      }
      if (sub !== "new") {
        handleCommandError(new UsageError(`unknown checkpoint subcommand: ${sub}`));
      }
      const title = parsed.positionals.slice(2).join(" ");
      const ws = requireFlagValue("--ws", parsed.flags["--ws"]);
      const relates = requireFlagValue("--relates", parsed.flags["--relates"]);
      const scope = requireFlagValue("--scope", parsed.flags["--scope"]);
      const status = requireFlagValue("--status", parsed.flags["--status"]);
      const priority = parseNumberFlag("--priority", parsed.flags["--priority"]);
      const template = requireFlagValue("--template", parsed.flags["--template"]);
      try {
        runCheckpointNewCommand({
          root,
          title,
          ws,
          relates,
          scope,
          status,
          priority,
          template,
        });
      } catch (err) {
        handleCommandError(err);
      }
      process.exit(0);
    }
    case "validate": {
      if (parsed.positionals.length > 1) {
        handleCommandError(new UsageError("validate does not accept positional arguments"));
      }
      const out = requireFlagValue("--out", parsed.flags["--out"]);
      const quiet = parseBooleanFlag("--quiet", parsed.flags["--quiet"]);
      try {
        runValidateCommand({ root, out, quiet });
      } catch (err) {
        handleCommandError(err);
      }
      process.exit(0);
    }
    case "format": {
      if (parsed.positionals.length > 1) {
        handleCommandError(new UsageError("format does not accept positional arguments"));
      }
      try {
        runFormatCommand({ root });
      } catch (err) {
        handleCommandError(err);
      }
      process.exit(0);
    }
    default:
      console.error(`Unknown command: ${command}`);
      printUsage();
      process.exit(1);
  }
}

main();
