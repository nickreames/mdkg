#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const contractPath = path.join(root, "dist", "command-contract.json");
const referencePath = path.join(root, "docs", "_generated", "cli-reference.md");
const summaryPath = path.join(root, "docs", "_generated", "command-contract-summary.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function formatList(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return "none";
  }
  return values.join(", ");
}

function renderCommand(command) {
  const usage = Array.isArray(command.usage) ? command.usage.map((line) => line.trim()).filter(Boolean) : [];
  const outputFormats = Array.isArray(command.output_formats) ? command.output_formats : [];
  const flags = Array.isArray(command.flags) ? command.flags : [];
  const lines = [
    `## ${command.key}`,
    "",
    command.summary || "No summary available.",
    "",
    `- Category: ${command.category || "uncategorized"}`,
    `- Status: ${command.status || "unknown"}`,
    `- Visibility: ${command.visibility || "unknown"}`,
    `- Danger level: ${command.danger_level || "unknown"}`,
    `- Output formats: ${formatList(outputFormats)}`,
    `- Dry run: ${JSON.stringify(command.dry_run || { supported: false })}`,
    `- Side effects: ${formatList(command.side_effects)}`,
    `- Read paths: ${formatList(command.read_paths)}`,
    `- Write paths: ${formatList(command.write_paths)}`,
    `- Lock policy: ${command.lock_policy || "unspecified"}`,
    `- Atomic write policy: ${command.atomic_write_policy || "unspecified"}`,
    `- Receipts: ${formatList(command.receipts)}`,
    ""
  ];

  if (usage.length > 0) {
    lines.push("Usage:", "", "```text", ...usage, "```", "");
  }

  if (flags.length > 0) {
    lines.push("Common flags:", "");
    for (const flag of flags.slice(0, 12)) {
      lines.push(`- \`${flag.name}${flag.value ? ` ${flag.value}` : ""}\`: ${flag.description || "flag"}`);
    }
    if (flags.length > 12) {
      lines.push(`- ${flags.length - 12} additional flags omitted from this generated summary.`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

function renderReference(contract) {
  const commands = [...contract.commands].sort((a, b) => a.key.localeCompare(b.key));
  const categories = [...new Set(commands.map((command) => command.category || "uncategorized"))].sort();
  const lines = [
    "# Generated CLI Reference",
    "",
    "<!-- generated-from: dist/command-contract.json -->",
    `<!-- contract-hash: ${contract.contract_hash} -->`,
    "",
    "This file is generated. Do not hand-edit command metadata here; update the command contract source and rerun `npm run docs:generate`.",
    "",
    `- Tool: ${contract.tool}`,
    `- Package version: ${contract.package_version}`,
    `- Schema version: ${contract.schema_version}`,
    `- Command count: ${commands.length}`,
    `- Categories: ${categories.join(", ")}`,
    "",
    "## Categories",
    ""
  ];

  for (const category of categories) {
    const count = commands.filter((command) => (command.category || "uncategorized") === category).length;
    lines.push(`- ${category}: ${count}`);
  }
  lines.push("");

  for (const command of commands) {
    lines.push(renderCommand(command));
  }

  return `${lines.join("\n")}\n`;
}

function buildSummary(contract) {
  const commands = [...contract.commands].sort((a, b) => a.key.localeCompare(b.key));
  const categories = {};
  for (const command of commands) {
    const category = command.category || "uncategorized";
    categories[category] = (categories[category] || 0) + 1;
  }
  return {
    generated_from: "dist/command-contract.json",
    contract_hash: contract.contract_hash,
    package_version: contract.package_version,
    command_count: commands.length,
    categories,
    commands: commands.map((command) => ({
      key: command.key,
      category: command.category,
      visibility: command.visibility,
      danger_level: command.danger_level,
      output_formats: command.output_formats || [],
      dry_run: command.dry_run || { supported: false }
    }))
  };
}

function main() {
  const mode = process.argv.includes("--check") ? "check" : "write";
  const contract = readJson(contractPath);
  const reference = renderReference(contract);
  const summary = `${JSON.stringify(buildSummary(contract), null, 2)}\n`;

  if (mode === "check") {
    const currentReference = fs.existsSync(referencePath) ? fs.readFileSync(referencePath, "utf8") : "";
    const currentSummary = fs.existsSync(summaryPath) ? fs.readFileSync(summaryPath, "utf8") : "";
    if (currentReference !== reference || currentSummary !== summary) {
      console.error("generated docs are stale; run npm run docs:generate");
      process.exit(1);
    }
    console.log(JSON.stringify({ ok: true, action: "docs-check", outputs: [referencePath, summaryPath] }, null, 2));
    return;
  }

  ensureDir(referencePath);
  fs.writeFileSync(referencePath, reference, "utf8");
  fs.writeFileSync(summaryPath, summary, "utf8");
  console.log(JSON.stringify({ ok: true, action: "docs-generate", outputs: [referencePath, summaryPath] }, null, 2));
}

main();
