#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const contractPath = path.join(repoRoot, "dist", "command-contract.json");
const rootPackage = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
const docsPackage = JSON.parse(fs.readFileSync(path.join(repoRoot, "docs", "package.json"), "utf8"));
const sitePackage = JSON.parse(fs.readFileSync(path.join(repoRoot, "mdkg-dev", "package.json"), "utf8"));

const PUBLIC_ROOTS = [
  "README.md",
  "docs/README.md",
  "docs/SUMMARY.md",
  "docs/src/content/docs",
  "mdkg-dev/src/pages",
  "mdkg-dev/src/components",
];

const SHELL_FENCE_LANGS = new Set(["bash", "sh", "shell", "console", "zsh"]);
const COMMAND_START = /^(mdkg|npm|node|git)\b/;
const INLINE_COMMAND = /`((?:mdkg|npm|node|git)\s+[^`]+)`/g;
const PROMPT_PREFIX = /^([$>#])\s+\S/;
const PLACEHOLDER_TOKEN = /\b(?:WORK|GOAL|TASK|SPIKE|CHILD)_ID\b|\bCHILD_ALIAS\b/;
const PLACEHOLDER_CONTEXT =
  /\b(replace|placeholder|concrete id|concrete ids|returned id|from your repo|use the .* id|uppercase placeholders)\b/i;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function walkFiles(item) {
  const fullPath = path.join(repoRoot, item);
  if (!fs.existsSync(fullPath)) {
    return [];
  }
  const stat = fs.statSync(fullPath);
  if (stat.isFile()) {
    return [fullPath];
  }
  const out = [];
  for (const entry of fs.readdirSync(fullPath, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "dist" || entry.name === "_generated") {
      continue;
    }
    const child = path.join(fullPath, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkFiles(path.relative(repoRoot, child)));
    } else if (entry.isFile() && /\.(md|mdx|astro|ts)$/.test(entry.name)) {
      out.push(child);
    }
  }
  return out;
}

function shellWords(command) {
  return (command.match(/"[^"]*"|'[^']*'|\S+/g) || []).map((token) => token.replace(/^['"]|['"]$/g, ""));
}

function normalizeCommandLine(line) {
  return line.trim().replace(/\s+/g, " ");
}

function hasPlaceholderContext(example) {
  return PLACEHOLDER_CONTEXT.test(example.contextBefore || "") || Boolean(example.documentPlaceholderContext);
}

function extractFencedCommands(source, filePath) {
  const examples = [];
  const fencePattern = /```([A-Za-z0-9_-]*)\n([\s\S]*?)```/g;
  let match;
  const documentPlaceholderContext = PLACEHOLDER_CONTEXT.test(source);
  while ((match = fencePattern.exec(source)) !== null) {
    const lang = match[1] || "";
    if (!SHELL_FENCE_LANGS.has(lang)) {
      continue;
    }
    const before = source.slice(0, match.index);
    const blockStartLine = before.split("\n").length;
    const lines = match[2].split("\n");
    let pending = "";
    for (let i = 0; i < lines.length; i += 1) {
      const raw = lines[i];
      const trimmed = raw.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }
      if (PROMPT_PREFIX.test(trimmed)) {
        examples.push({
          source: "fence",
          filePath,
          line: blockStartLine + i + 1,
          command: trimmed,
          promptPrefixed: true,
          contextBefore: before.split("\n").slice(-5).join("\n"),
          documentPlaceholderContext,
        });
        continue;
      }
      const continued = trimmed.endsWith("\\");
      pending += `${trimmed.replace(/\\$/, "").trim()} `;
      if (continued) {
        continue;
      }
      const command = normalizeCommandLine(pending);
      pending = "";
      if (COMMAND_START.test(command)) {
        examples.push({
          source: "fence",
          filePath,
          line: blockStartLine + i + 1,
          command,
          contextBefore: before.split("\n").slice(-5).join("\n"),
          documentPlaceholderContext,
        });
      }
    }
  }
  return examples;
}

function extractInlineCommands(source, filePath) {
  const examples = [];
  let match;
  while ((match = INLINE_COMMAND.exec(source)) !== null) {
    const command = normalizeCommandLine(match[1]);
    const line = source.slice(0, match.index).split("\n").length;
    const contextBefore = source.slice(Math.max(0, match.index - 120), match.index);
    examples.push({ source: "inline", filePath, line, command, contextBefore });
  }
  return examples;
}

function contractIndex() {
  const contract = readJson(contractPath);
  const commands = new Map();
  for (const command of contract.commands) {
    commands.set(command.key, command);
  }
  return commands;
}

function matchMdkgCommand(command, commands) {
  const words = shellWords(command);
  if (words[0] !== "mdkg") {
    return { ok: false, reason: "not an mdkg command" };
  }
  if (words[1] === "--version" || words[1] === "-V" || words[1] === "--help" || words[1] === "-h") {
    return { ok: true, key: "<global>" };
  }

  const commandWords = [];
  for (const word of words.slice(1)) {
    if (word.startsWith("-")) {
      break;
    }
    commandWords.push(word);
  }
  for (let size = commandWords.length; size >= 1; size -= 1) {
    const key = commandWords.slice(0, size).join(" ");
    const contractCommand = commands.get(key);
    if (!contractCommand) {
      continue;
    }
    if (size === commandWords.length) {
      return { ok: true, key };
    }
    const nextWord = commandWords[size];
    const commandPrefix = `mdkg ${commandWords.slice(0, size + 1).join(" ")}`;
    const usage = contractCommand.usage.join("\n");
    if (usage.includes(commandPrefix)) {
      return { ok: true, key, parentMatched: true };
    }
    if (usage.includes(`mdkg ${key} <`) || usage.includes(`mdkg ${key} "<`)) {
      return { ok: true, key, argumentMatched: nextWord };
    }
  }
  return {
    ok: false,
    reason: `unknown mdkg command path: ${commandWords.join(" ") || command}`,
  };
}

function validateNpmCommand(command, filePath) {
  const words = shellWords(command);
  if (words[0] !== "npm") {
    return { ok: false, reason: "not an npm command" };
  }
  if (words[1] === "--version" || words[1] === "install" || words[1] === "ci") {
    return { ok: true };
  }
  let packageScripts = rootPackage.scripts || {};
  let runIndex = words.indexOf("run");
  const prefixIndex = words.indexOf("--prefix");
  if (prefixIndex !== -1) {
    const prefix = words[prefixIndex + 1];
    if (prefix === "docs") {
      packageScripts = docsPackage.scripts || {};
    } else if (prefix === "mdkg-dev") {
      packageScripts = sitePackage.scripts || {};
    }
    runIndex = words.indexOf("run", prefixIndex);
  }
  if (runIndex !== -1) {
    const script = words[runIndex + 1];
    if (!script) {
      return { ok: false, reason: "npm run missing script name" };
    }
    if (!packageScripts[script]) {
      return { ok: false, reason: `unknown npm script: ${script}` };
    }
    return { ok: true };
  }
  return { ok: false, reason: `unsupported npm command example: ${command}` };
}

function validateCommand(example, commands) {
  if (example.promptPrefixed) {
    return { ok: false, reason: "copyable command examples must omit shell prompts" };
  }
  if (
    example.source === "fence" &&
    PLACEHOLDER_TOKEN.test(example.command) &&
    !hasPlaceholderContext(example)
  ) {
    return {
      ok: false,
      reason:
        "copyable command examples with WORK_ID/GOAL_ID/TASK_ID/SPIKE_ID/CHILD_ALIAS placeholders must explain replacement context",
    };
  }
  if (
    example.source === "inline" &&
    /(no\s+public|not\s+public|not\s+exposed|not\s+yet|no\s+.*\s+cli|without\s+adding\s+public)/i.test(example.contextBefore || "")
  ) {
    return { ok: true, illustrative: true };
  }
  if (example.source === "inline" && /(\||\/|\.\.\.|<[^>]+>|\[[^\]]+\])/.test(example.command)) {
    return { ok: true, illustrative: true };
  }
  const words = shellWords(example.command);
  if (words.length === 0) {
    return { ok: true };
  }
  if (words[0] === "mdkg") {
    return matchMdkgCommand(example.command, commands);
  }
  if (words[0] === "npm") {
    return validateNpmCommand(example.command, example.filePath);
  }
  if (words[0] === "node") {
    return { ok: words[1] === "--version", reason: `unsupported node command example: ${example.command}` };
  }
  if (words[0] === "git") {
    return { ok: words[1] === "status", reason: `unsupported git command example: ${example.command}` };
  }
  return { ok: true };
}

function main() {
  if (!fs.existsSync(contractPath)) {
    throw new Error(`missing command contract: ${contractPath}`);
  }
  const commands = contractIndex();
  const files = PUBLIC_ROOTS.flatMap(walkFiles).sort();
  const examples = [];
  for (const filePath of files) {
    const source = fs.readFileSync(filePath, "utf8");
    examples.push(...extractFencedCommands(source, filePath));
    examples.push(...extractInlineCommands(source, filePath));
  }

  const failures = [];
  const checked = [];
  const skippedIllustrative = [];
  for (const example of examples) {
    const result = validateCommand(example, commands);
    if (result.illustrative) {
      skippedIllustrative.push(example);
    } else if (result.ok) {
      checked.push({ ...example, contract_key: result.key || null, parent_matched: Boolean(result.parentMatched) });
    } else {
      failures.push({ ...example, reason: result.reason });
    }
  }

  const placeholderFenceExamples = examples.filter(
    (example) => example.source === "fence" && PLACEHOLDER_TOKEN.test(example.command)
  );
  const receipt = {
    ok: failures.length === 0,
    scanned_files: files.length,
    checked_examples: checked.length,
    placeholder_examples: examples.filter((example) => PLACEHOLDER_TOKEN.test(example.command)).length,
    placeholder_context_examples: examples.filter(
      (example) => PLACEHOLDER_TOKEN.test(example.command) && hasPlaceholderContext(example)
    ).length,
    placeholder_fence_examples: placeholderFenceExamples.length,
    placeholder_fence_context_examples: placeholderFenceExamples.filter(hasPlaceholderContext).length,
    skipped_illustrative_examples: skippedIllustrative.length,
    failed_examples: failures.length,
    by_source: {
      fence: examples.filter((example) => example.source === "fence").length,
      inline: examples.filter((example) => example.source === "inline").length,
    },
    failures: failures.map((failure) => ({
      path: path.relative(repoRoot, failure.filePath),
      line: failure.line,
      command: failure.command,
      reason: failure.reason,
    })),
  };

  if (!receipt.ok) {
    console.error(JSON.stringify(receipt, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify(receipt, null, 2));
}

main();
