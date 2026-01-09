#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { parseArgs } from "./util/argparse";
import { runIndexCommand } from "./commands/index";

function printUsage(): void {
  console.log("mdkg - Markdown Knowledge Graph");
  console.log("\nUsage:");
  console.log("  mdkg <command> [options]");
  console.log("\nGlobal options:");
  console.log("  --root <path>  Run against a specific repo root");
  console.log("  --help, -h     Show help");
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
        const message = err instanceof Error ? err.message : String(err);
        console.error(message);
        process.exit(4);
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
