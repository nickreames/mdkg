#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { parseArgs } from "./util/argparse";
import { runIndexCommand } from "./commands/index";
import { runListCommand } from "./commands/list";
import { runSearchCommand } from "./commands/search";
import { runShowCommand } from "./commands/show";
import { runPackCommand } from "./commands/pack";
import { runValidateCommand } from "./commands/validate";
import { runFormatCommand } from "./commands/format";
import { NotFoundError, UsageError, ValidationError } from "./util/errors";

function printUsage(): void {
  console.log("mdkg - Markdown Knowledge Graph");
  console.log("\nUsage:");
  console.log("  mdkg <command> [options]");
  console.log("\nCommands:");
  console.log("  mdkg index [--tolerant]");
  console.log("  mdkg show <id-or-qid> [--ws <alias>] [--body]");
  console.log("  mdkg list [--type <type>] [--status <status>] [--ws <alias>] [--epic <id>]");
  console.log("           [--priority <n>] [--blocked]");
  console.log("  mdkg search <query> [--type <type>] [--status <status>] [--ws <alias>]");
  console.log("  mdkg pack <id-or-qid> [-d <n>] [-e <keys>] [-v]");
  console.log("           [-f md|json|toon|xml] [-o <path>] [-w <alias>]");
  console.log("  mdkg validate [--out <path>] [--quiet]");
  console.log("  mdkg format");
  console.log("\nGlobal options:");
  console.log("  --root, -r <path>  Run against a specific repo root");
  console.log("  --help, -h     Show help");
  console.log("  --no-cache     Bypass reading the index cache");
  console.log("  --no-reindex   Do not auto rebuild when cache is stale");
}

function printRootError(root: string): void {
  console.error("mdkg must be run from a repo root with .mdkg/config.json");
  console.error(`root checked: ${root}`);
  console.error("hint: run from the repo root or pass --root <path>");
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
    printUsage();
    process.exit(0);
  }

  const root = parsed.root ? path.resolve(parsed.root) : process.cwd();
  if (!hasConfig(root)) {
    printRootError(root);
    process.exit(1);
  }

  const command = parsed.positionals[0] ?? "";
  if (!command) {
    printUsage();
    process.exit(0);
  }

  switch (command) {
    case "index": {
      const tolerant = Boolean(parsed.flags["--tolerant"]);
      try {
        runIndexCommand({ root, tolerant });
      } catch (err) {
        handleCommandError(err);
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
