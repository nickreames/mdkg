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

function commandDisplay(command) {
  return `mdkg ${command.key}`;
}

function classifyMode(command) {
  const sideEffects = Array.isArray(command.side_effects) ? command.side_effects : [];
  const writePaths = Array.isArray(command.write_paths) ? command.write_paths : [];
  if (command.danger_level === "read-only" || (sideEffects.includes("none") && writePaths.length === 0)) {
    return "Read-only command";
  }
  if (writePaths.every((entry) => entry.includes(".mdkg/pack") || entry.includes(".mdkg/handoffs"))) {
    return "Generated artifact command";
  }
  return "Mutating command";
}

function categoryGuidance(command) {
  const category = command.category || "uncategorized";
  const guidance = {
    archive: "Use for source evidence bundles and archive receipts.",
    bundle: "Use for portable graph bundle creation, verification, and import.",
    db: "Use for local project DB, queue, snapshot, and verification workflows.",
    fix: "Use for dry-run repair planning and selected graph repairs.",
    goal: "Use for long-running objectives, active-node routing, and goal lifecycle.",
    graph: "Use for graph references, clone/fork/import, and graph movement workflows.",
    handoff: "Use for sanitized transfer prompts between humans and agents.",
    index: "Use to rebuild generated search, skill, capability, and subgraph indexes.",
    mcp: "Use for the local read-only MCP server surface.",
    new: "Use to create graph nodes and workflow records.",
    pack: "Use to assemble deterministic context for one bounded work item.",
    search: "Use to discover graph records by text, kind, or capability.",
    show: "Use to inspect a specific graph node or record.",
    skill: "Use to manage repo-local skills and generated tool mirrors.",
    status: "Use for operator-readable repo, graph, cache, DB, and selected-goal health.",
    subgraph: "Use to inspect and refresh child graph bundles from a parent repo.",
    task: "Use to start, update, and close task-like work nodes with evidence.",
    validate: "Use before closeout to check graph integrity and warning categories.",
    work: "Use for SPEC, WORK, WORK_ORDER, and RECEIPT workflow surfaces.",
  };
  return guidance[category] || "Use this command when the matching command family is the current workflow surface.";
}

function beginnerSafety(command) {
  const mode = classifyMode(command);
  if (mode === "Read-only command") {
    return "Safe for initial grounding. It should not change repository files.";
  }
  if (command.dry_run && command.dry_run.supported) {
    return "Prefer the dry-run or plan mode before applying changes.";
  }
  if (mode === "Generated artifact command") {
    return "Review generated output before sharing it outside the repository.";
  }
  return "Run read-only grounding commands first, then use this only when you intend to update mdkg state.";
}

function renderRelated(command, commands) {
  const related = commands
    .filter((candidate) => candidate.key !== command.key && (candidate.category || "uncategorized") === (command.category || "uncategorized"))
    .slice(0, 5)
    .map((candidate) => `\`${commandDisplay(candidate)}\``);
  return related.length > 0 ? related.join(", ") : "none";
}

function renderCommand(command, commands) {
  const usage = Array.isArray(command.usage) ? command.usage.map((line) => line.trim()).filter(Boolean) : [];
  const outputFormats = Array.isArray(command.output_formats) ? command.output_formats : [];
  const flags = Array.isArray(command.flags) ? command.flags : [];
  const examples = Array.isArray(command.examples) ? command.examples.map((line) => line.trim()).filter(Boolean) : [];
  const mode = classifyMode(command);
  const lines = [
    `## ${command.key}`,
    "",
    command.summary || `Command family for \`${commandDisplay(command)}\`.`,
    "",
    `- Command: \`${commandDisplay(command)}\``,
    `- Mode: ${mode}`,
    `- Public status: ${command.status || "unknown"} / ${command.visibility || "unknown"}`,
    `- Danger level: ${command.danger_level || "unknown"}`,
    "",
    "### When to use",
    "",
    categoryGuidance(command),
    "",
    `Beginner safety: ${beginnerSafety(command)}`,
    ""
  ];

  if (usage.length > 0) {
    lines.push("### Usage", "", "```text", ...usage, "```", "");
  }

  if (examples.length > 0) {
    lines.push("### Examples", "", "```bash", ...examples, "```", "");
  }

  if (flags.length > 0) {
    lines.push("### Common flags", "");
    for (const flag of flags.slice(0, 12)) {
      lines.push(`- \`${flag.name}${flag.value ? ` ${flag.value}` : ""}\`: ${flag.description || "flag"}`);
    }
    if (flags.length > 12) {
      lines.push(`- ${flags.length - 12} additional flags omitted from this generated summary.`);
    }
    lines.push("");
  }

  lines.push(
    "### Output and safety",
    "",
    `- Output formats: ${formatList(outputFormats)}`,
    `- Dry run: ${JSON.stringify(command.dry_run || { supported: false })}`,
    `- Side effects: ${formatList(command.side_effects)}`,
    `- Read paths: ${formatList(command.read_paths)}`,
    `- Write paths: ${formatList(command.write_paths)}`,
    `- Lock policy: ${command.lock_policy || "unspecified"}`,
    `- Atomic write policy: ${command.atomic_write_policy || "unspecified"}`,
    `- Receipts: ${formatList(command.receipts)}`,
    "",
    "### Related commands",
    "",
    renderRelated(command, commands),
    ""
  );

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
    "This generated page is the broad user-facing command reference. Start with the common command groups in the reference home, then use this page when you need the complete command list.",
    "",
    "The page is generated from current command metadata in `dist/command-contract.json`, which keeps usage, flags, output formats, and safety notes aligned with the CLI.",
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
    lines.push(renderCommand(command, commands));
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
