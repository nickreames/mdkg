const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const cliPath = path.join(root, "dist", "cli.js");
const matrixPath = path.join(root, "CLI_COMMAND_MATRIX.md");

const HELP_TARGETS = [
  ["global"],
  ["init"],
  ["new"],
  ["show"],
  ["list"],
  ["search"],
  ["pack"],
  ["skill"],
  ["skill", "new"],
  ["skill", "list"],
  ["skill", "show"],
  ["skill", "search"],
  ["skill", "validate"],
  ["skill", "sync"],
  ["task"],
  ["task", "start"],
  ["task", "update"],
  ["task", "done"],
  ["event"],
  ["event", "enable"],
  ["event", "append"],
  ["next"],
  ["checkpoint"],
  ["validate"],
  ["format"],
  ["doctor"],
  ["workspace"],
  ["index"],
  ["guide"],
];

function runHelp(target) {
  const args = target[0] === "global" ? ["--help"] : ["help", ...target];
  const result = spawnSync(process.execPath, [cliPath, ...args], {
    cwd: root,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(`failed to capture help for ${target.join(" ")}: ${result.stderr || result.stdout}`);
  }
  return result.stdout.trimEnd();
}

function collectUsageLines(helpText) {
  const lines = helpText.split(/\r?\n/);
  const usage = [];
  let inUsageBlock = false;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (trimmed === "Usage:") {
      inUsageBlock = true;
      continue;
    }
    if (!inUsageBlock) {
      continue;
    }
    if (trimmed.length === 0) {
      break;
    }
    if (/^[A-Z][A-Za-z /-]+:$/.test(trimmed)) {
      break;
    }
    if (/^\s*mdkg /.test(rawLine)) {
      usage.push(rawLine.trimEnd());
    }
  }

  return usage;
}

function buildSnapshot() {
  const commands = {};
  for (const target of HELP_TARGETS) {
    const key = target.join(" ");
    const help = runHelp(target);
    commands[key] = {
      target,
      help,
      usage: collectUsageLines(help),
    };
  }

  return {
    command: "cli:snapshot",
    version: JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).version,
    commands,
  };
}

function checkMatrix(snapshot) {
  const matrix = fs.readFileSync(matrixPath, "utf8");
  const missing = [];
  for (const entry of Object.values(snapshot.commands)) {
    for (const usageLine of entry.usage) {
      if (!matrix.includes(usageLine.trim())) {
        missing.push(usageLine.trim());
      }
    }
  }
  if (missing.length > 0) {
    throw new Error(`CLI_COMMAND_MATRIX.md is missing usage lines:\n${missing.join("\n")}`);
  }
}

function main() {
  const snapshot = buildSnapshot();
  if (process.argv.includes("--check")) {
    checkMatrix(snapshot);
    console.log("cli command matrix check: ok");
    return;
  }
  process.stdout.write(`${JSON.stringify(snapshot, null, 2)}\n`);
}

main();
