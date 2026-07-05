#!/usr/bin/env node

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { HELP_TARGETS, helpTargetKey } = require("./cli_help_targets");

const root = path.resolve(__dirname, "..");
const cliPath = path.join(root, "dist", "cli.js");
const packagePath = path.join(root, "package.json");
const outputPath = path.join(root, "dist", "command-contract.json");

const READ_WRITE_PATHS = {
  graph: [".mdkg/**/*.md", ".mdkg/index/**"],
  config: [".mdkg/config.json", ".mdkg/index/**"],
  init: [".mdkg/**", "AGENT_START.md", "AGENTS.md", "CLAUDE.md", "CLI_COMMAND_MATRIX.md", "llms.txt"],
  db: [".mdkg/db/**", ".mdkg/index/**"],
  git: [".mdkg/git/**", ".mdkg/db/**", ".mdkg/index/**"],
  archive: [".mdkg/archive/**", ".mdkg/index/**"],
  bundle: [".mdkg/bundles/**", ".mdkg/index/**"],
  subgraph: [".mdkg/config.json", ".mdkg/subgraphs/**", ".mdkg/index/**"],
  skill: [".mdkg/skills/**", ".agents/skills/**", ".claude/skills/**", ".mdkg/index/**"],
  event: [".mdkg/events.jsonl"],
};

const SAFETY_OVERRIDES = {
  init: {
    side_effects: ["initialize-mdkg-scaffold"],
    write_paths: READ_WRITE_PATHS.init,
    lock_policy: "not-required-before-mdkg-config-exists",
    atomic_write_policy: "exclusive-create-and-atomic-file-writes",
    dry_run: { supported: false },
    receipts: ["init-summary"],
    danger_level: "moderate",
  },
  upgrade: {
    side_effects: ["preview-or-apply-managed-scaffold-upgrade"],
    write_paths: READ_WRITE_PATHS.init,
    lock_policy: "mutation-lock-required-for-apply",
    atomic_write_policy: "atomic-file-writes",
    dry_run: { supported: true, default: true, flag: "--apply" },
    receipts: ["upgrade-plan", "upgrade-apply-receipt"],
    danger_level: "moderate",
  },
  new: {
    side_effects: ["create-graph-node"],
    write_paths: READ_WRITE_PATHS.graph,
    lock_policy: "mutation-lock-required",
    atomic_write_policy: "exclusive-create",
    dry_run: { supported: false },
    receipts: ["node-create-receipt"],
    danger_level: "moderate",
  },
  archive: {
    side_effects: ["read-or-write-archive-sidecars"],
    write_paths: READ_WRITE_PATHS.archive,
    lock_policy: "mutation-lock-required-for-add-compress",
    atomic_write_policy: "atomic-file-writes-and-zip-temp-rename",
    dry_run: { supported: false },
    receipts: ["archive-receipt"],
    danger_level: "mixed",
  },
  "archive add": {
    side_effects: ["create-archive-sidecar"],
    write_paths: READ_WRITE_PATHS.archive,
    lock_policy: "mutation-lock-required",
    atomic_write_policy: "atomic-file-writes-and-zip-temp-rename",
    dry_run: { supported: false },
    receipts: ["archive-add-receipt"],
    danger_level: "moderate",
  },
  "archive compress": {
    side_effects: ["refresh-archive-zip-cache"],
    write_paths: READ_WRITE_PATHS.archive,
    lock_policy: "mutation-lock-required",
    atomic_write_policy: "zip-temp-rename",
    dry_run: { supported: false },
    receipts: ["archive-compress-receipt"],
    danger_level: "moderate",
  },
  bundle: {
    side_effects: ["read-or-write-mdkg-bundles"],
    write_paths: READ_WRITE_PATHS.bundle,
    lock_policy: "mutation-lock-required-for-create-import",
    atomic_write_policy: "zip-temp-rename-and-atomic-file-writes",
    dry_run: { supported: false },
    receipts: ["bundle-receipt"],
    danger_level: "mixed",
  },
  "bundle create": {
    side_effects: ["create-bundle-zip"],
    write_paths: READ_WRITE_PATHS.bundle,
    lock_policy: "mutation-lock-required",
    atomic_write_policy: "zip-temp-rename",
    dry_run: { supported: false },
    receipts: ["bundle-create-receipt"],
    danger_level: "moderate",
  },
  "bundle import": {
    side_effects: ["register-imported-subgraph-bundle"],
    write_paths: READ_WRITE_PATHS.subgraph,
    lock_policy: "mutation-lock-required",
    atomic_write_policy: "atomic-config-write",
    dry_run: { supported: false },
    receipts: ["bundle-import-receipt"],
    danger_level: "moderate",
  },
  "graph refs": {
    side_effects: ["none"],
    write_paths: [],
    lock_policy: "none-read-only",
    atomic_write_policy: "none-read-only",
    dry_run: { supported: false },
    receipts: ["graph-refs-receipt"],
    danger_level: "read-only",
  },
  git: {
    side_effects: ["inspect-or-mutate-git-backed-mdkg-project-lifecycle"],
    write_paths: READ_WRITE_PATHS.git,
    lock_policy: "mutation-lock-required-for-closeout-and-stage-all-push",
    atomic_write_policy: "atomic-file-writes-for-closeout-receipts",
    dry_run: { supported: false },
    receipts: ["git-inspect-receipt", "git-closeout-receipt", "git-push-ready-receipt", "git-push-receipt"],
    danger_level: "mixed",
  },
  "git inspect": {
    side_effects: ["none"],
    write_paths: [],
    lock_policy: "none-read-only",
    atomic_write_policy: "none-read-only",
    dry_run: { supported: false },
    receipts: ["git-inspect-receipt"],
    danger_level: "read-only",
  },
  "git clone": {
    side_effects: ["clone-remote-git-repository-into-contained-target"],
    write_paths: ["<target>/**"],
    lock_policy: "not-required-for-contained-target",
    atomic_write_policy: "delegated-to-system-git",
    dry_run: { supported: false },
    receipts: ["git-clone-receipt"],
    danger_level: "moderate",
  },
  "git fetch": {
    side_effects: ["fetch-remote-git-refs"],
    write_paths: [".git/**"],
    lock_policy: "delegated-to-system-git",
    atomic_write_policy: "delegated-to-system-git",
    dry_run: { supported: false },
    receipts: ["git-fetch-receipt"],
    danger_level: "moderate",
  },
  "git closeout": {
    side_effects: ["write-static-git-closeout-receipts-and-optional-db-snapshot"],
    write_paths: READ_WRITE_PATHS.git,
    lock_policy: "mutation-lock-required",
    atomic_write_policy: "atomic-file-writes-and-sqlite-vacuum-into",
    dry_run: { supported: false },
    receipts: ["git-closeout-receipt"],
    danger_level: "moderate",
  },
  "git push-ready": {
    side_effects: ["none"],
    write_paths: [],
    lock_policy: "none-read-only",
    atomic_write_policy: "none-read-only",
    dry_run: { supported: false },
    receipts: ["git-push-ready-receipt"],
    danger_level: "read-only",
  },
  "git push": {
    side_effects: ["optional-closeout-stage-commit-and-real-git-push"],
    write_paths: [".mdkg/git/**", ".mdkg/db/**", ".git/**", "repo-files/**"],
    lock_policy: "mutation-lock-required",
    atomic_write_policy: "atomic-file-writes-plus-system-git",
    dry_run: { supported: false },
    receipts: ["git-push-receipt"],
    danger_level: "high",
  },
  handoff: {
    side_effects: ["create-sanitized-agent-handoff-when-out-is-provided"],
    write_paths: [".mdkg/handoffs/**"],
    lock_policy: "not-required-for-stdout-output",
    atomic_write_policy: "atomic-file-write-when-out-is-provided",
    dry_run: { supported: false },
    receipts: ["handoff-receipt"],
    danger_level: "moderate",
    json_schema_ref: "mdkg.handoff.v1",
  },
  subgraph: {
    side_effects: ["read-or-write-subgraph-config-and-materialized-trees"],
    write_paths: READ_WRITE_PATHS.subgraph,
    lock_policy: "mutation-lock-required-for-add-rm-enable-disable-sync-materialize",
    atomic_write_policy: "atomic-config-writes-and-temp-tree-rename",
    dry_run: { supported: true, commands: ["sync", "materialize", "audit", "upgrade-plan"] },
    receipts: ["subgraph-receipt"],
    danger_level: "mixed",
  },
  "subgraph add": {
    side_effects: ["register-subgraph"],
    write_paths: READ_WRITE_PATHS.subgraph,
    lock_policy: "mutation-lock-required",
    atomic_write_policy: "atomic-config-write",
    dry_run: { supported: false },
    receipts: ["subgraph-add-receipt"],
    danger_level: "moderate",
  },
  "subgraph rm": {
    side_effects: ["remove-subgraph-registration"],
    write_paths: READ_WRITE_PATHS.subgraph,
    lock_policy: "mutation-lock-required",
    atomic_write_policy: "atomic-config-write",
    dry_run: { supported: false },
    receipts: ["subgraph-rm-receipt"],
    danger_level: "moderate",
  },
  "subgraph enable": {
    side_effects: ["enable-subgraph-registration"],
    write_paths: READ_WRITE_PATHS.subgraph,
    lock_policy: "mutation-lock-required",
    atomic_write_policy: "atomic-config-write",
    dry_run: { supported: false },
    receipts: ["subgraph-enable-receipt"],
    danger_level: "moderate",
  },
  "subgraph disable": {
    side_effects: ["disable-subgraph-registration"],
    write_paths: READ_WRITE_PATHS.subgraph,
    lock_policy: "mutation-lock-required",
    atomic_write_policy: "atomic-config-write",
    dry_run: { supported: false },
    receipts: ["subgraph-disable-receipt"],
    danger_level: "moderate",
  },
  "subgraph refresh": {
    side_effects: ["refresh-root-owned-subgraph-bundle"],
    write_paths: READ_WRITE_PATHS.subgraph,
    lock_policy: "mutation-lock-required",
    atomic_write_policy: "bundle-temp-rename",
    dry_run: { supported: false },
    receipts: ["subgraph-refresh-receipt"],
    danger_level: "moderate",
  },
  "subgraph sync": {
    side_effects: ["refresh-root-owned-subgraph-bundles"],
    write_paths: READ_WRITE_PATHS.subgraph,
    lock_policy: "mutation-lock-required-for-apply",
    atomic_write_policy: "bundle-temp-rename-and-atomic-config-write",
    dry_run: { supported: true, default: false, flag: "--dry-run" },
    receipts: ["subgraph-sync-receipt"],
    danger_level: "moderate",
  },
  "subgraph materialize": {
    side_effects: ["write-materialized-read-only-inspection-tree"],
    write_paths: [".mdkg/subgraphs/**"],
    lock_policy: "mutation-lock-required-for-write",
    atomic_write_policy: "temp-tree-rename",
    dry_run: { supported: true, flag: "--dry-run" },
    receipts: ["subgraph-materialize-receipt"],
    danger_level: "moderate",
  },
  work: {
    side_effects: ["read-or-write-work-contract-mirrors"],
    write_paths: READ_WRITE_PATHS.graph,
    lock_policy: "mutation-lock-required-for-contract-trigger-receipt-artifact-writes",
    atomic_write_policy: "exclusive-create-and-atomic-file-writes",
    dry_run: { supported: false },
    receipts: ["work-contract-receipt", "work-order-receipt", "work-receipt-receipt"],
    danger_level: "mixed",
  },
  "work contract": {
    side_effects: ["create-or-update-work-contract"],
    write_paths: READ_WRITE_PATHS.graph,
    lock_policy: "mutation-lock-required",
    atomic_write_policy: "exclusive-create-or-atomic-file-write",
    dry_run: { supported: false },
    receipts: ["work-contract-receipt"],
    danger_level: "moderate",
  },
  "work trigger": {
    side_effects: ["create-submitted-work-order-and-optionally-enqueue-message"],
    write_paths: [".mdkg/work_orders/**", ".mdkg/db/**", ".mdkg/index/**"],
    lock_policy: "mutation-lock-required",
    atomic_write_policy: "exclusive-create-and-sqlite-transaction",
    dry_run: { supported: false },
    receipts: ["work-trigger-receipt"],
    danger_level: "moderate",
  },
  "work receipt": {
    side_effects: ["create-or-update-work-receipt"],
    write_paths: [".mdkg/receipts/**", ".mdkg/index/**"],
    lock_policy: "mutation-lock-required-for-new-update",
    atomic_write_policy: "exclusive-create-or-atomic-file-write",
    dry_run: { supported: false },
    receipts: ["work-receipt-receipt", "work-receipt-verify-receipt"],
    danger_level: "mixed",
  },
  "work artifact": {
    side_effects: ["create-work-artifact-record"],
    write_paths: [".mdkg/artifacts/**", ".mdkg/index/**"],
    lock_policy: "mutation-lock-required",
    atomic_write_policy: "exclusive-create",
    dry_run: { supported: false },
    receipts: ["work-artifact-receipt"],
    danger_level: "moderate",
  },
  "work validate": {
    side_effects: ["none"],
    write_paths: [],
    lock_policy: "none-read-only",
    atomic_write_policy: "none-read-only",
    dry_run: { supported: false },
    receipts: ["work-validate-receipt"],
    danger_level: "read-only",
    json_schema_ref: "mdkg.work_validate.v1",
  },
  goal: {
    side_effects: ["read-or-update-selected-goal-state"],
    write_paths: READ_WRITE_PATHS.graph,
    lock_policy: "mutation-lock-required-for-select-clear-claim-pause-resume-done",
    atomic_write_policy: "atomic-file-writes",
    dry_run: { supported: false },
    receipts: ["goal-receipt"],
    danger_level: "mixed",
  },
  "goal select": goalStateMutation("select-goal"),
  "goal activate": goalStateMutation("activate-goal-and-pause-competing-goals"),
  "goal clear": goalStateMutation("clear-selected-goal"),
  "goal claim": goalStateMutation("claim-goal-active-node"),
  "goal pause": goalStateMutation("pause-goal"),
  "goal resume": goalStateMutation("resume-goal"),
  "goal done": goalStateMutation("complete-goal"),
  "goal archive": goalStateMutation("archive-goal"),
  skill: {
    side_effects: ["read-or-write-skills-and-agent-mirrors"],
    write_paths: READ_WRITE_PATHS.skill,
    lock_policy: "mutation-lock-required-for-new-sync",
    atomic_write_policy: "exclusive-create-and-atomic-file-writes",
    dry_run: { supported: false },
    receipts: ["skill-receipt"],
    danger_level: "mixed",
  },
  "skill new": {
    side_effects: ["create-skill"],
    write_paths: READ_WRITE_PATHS.skill,
    lock_policy: "mutation-lock-required",
    atomic_write_policy: "exclusive-create",
    dry_run: { supported: false },
    receipts: ["skill-new-receipt"],
    danger_level: "moderate",
  },
  "skill sync": {
    side_effects: ["refresh-agent-skill-mirrors"],
    write_paths: READ_WRITE_PATHS.skill,
    lock_policy: "mutation-lock-required",
    atomic_write_policy: "atomic-file-writes",
    dry_run: { supported: false },
    receipts: ["skill-sync-receipt"],
    danger_level: "moderate",
  },
  task: {
    side_effects: ["read-or-update-task-lifecycle"],
    write_paths: READ_WRITE_PATHS.graph,
    lock_policy: "mutation-lock-required-for-start-update-done",
    atomic_write_policy: "atomic-file-writes",
    dry_run: { supported: false },
    receipts: ["task-receipt"],
    danger_level: "mixed",
  },
  "task start": taskMutation("start-task"),
  "task update": taskMutation("update-task"),
  "task done": taskMutation("complete-task"),
  event: {
    side_effects: ["read-or-append-jsonl-event-log"],
    write_paths: READ_WRITE_PATHS.event,
    lock_policy: "mutation-lock-required-for-enable-append",
    atomic_write_policy: "append-or-exclusive-create",
    dry_run: { supported: false },
    receipts: ["event-receipt"],
    danger_level: "mixed",
  },
  "event enable": {
    side_effects: ["create-event-log"],
    write_paths: READ_WRITE_PATHS.event,
    lock_policy: "mutation-lock-required",
    atomic_write_policy: "exclusive-create",
    dry_run: { supported: false },
    receipts: ["event-enable-receipt"],
    danger_level: "moderate",
  },
  "event append": {
    side_effects: ["append-event-log-row"],
    write_paths: READ_WRITE_PATHS.event,
    lock_policy: "mutation-lock-required",
    atomic_write_policy: "append-only-jsonl",
    dry_run: { supported: false },
    receipts: ["event-append-receipt"],
    danger_level: "moderate",
  },
  checkpoint: {
    side_effects: ["create-checkpoint-node"],
    write_paths: READ_WRITE_PATHS.graph,
    lock_policy: "mutation-lock-required",
    atomic_write_policy: "exclusive-create",
    dry_run: { supported: false },
    receipts: ["checkpoint-receipt"],
    danger_level: "moderate",
  },
  status: {
    json_schema_ref: "mdkg.status.v1",
    receipts: ["operator-status-receipt"],
  },
  "fix plan": {
    side_effects: ["none"],
    write_paths: [],
    lock_policy: "none-read-only",
    atomic_write_policy: "none-read-only",
    dry_run: { supported: true, default: true, apply_supported: true, apply_family: "ids" },
    receipts: ["fix-plan-receipt"],
    danger_level: "read-only",
    json_schema_ref: "mdkg.fix_plan.v1",
  },
  "fix apply": {
    side_effects: ["rewrite-duplicate-node-ids", "rebuild-derived-indexes"],
    write_paths: READ_WRITE_PATHS.graph,
    lock_policy: "mutation-lock-required",
    atomic_write_policy: "atomic-file-writes",
    dry_run: { supported: false, apply_supported: true, apply_family: "ids" },
    receipts: ["fix-apply-receipt"],
    danger_level: "high",
    json_schema_ref: "mdkg.fix_apply.v1",
  },
  "fix ids": {
    side_effects: ["plan-or-rewrite-duplicate-node-ids", "rebuild-derived-indexes-when-apply"],
    write_paths: READ_WRITE_PATHS.graph,
    lock_policy: "mutation-lock-required-when-apply",
    atomic_write_policy: "atomic-file-writes-when-apply",
    dry_run: { supported: true, default: true, apply_flag: "--apply", apply_supported: true, apply_family: "ids" },
    receipts: ["fix-plan-receipt", "fix-apply-receipt"],
    danger_level: "high",
    json_schema_ref: "mdkg.fix_ids.v1",
  },
  format: {
    side_effects: ["normalize-graph-markdown"],
    write_paths: READ_WRITE_PATHS.graph,
    lock_policy: "mutation-lock-required",
    atomic_write_policy: "atomic-file-writes",
    dry_run: { supported: true, default: false, flag: "--dry-run" },
    receipts: ["format-receipt"],
    danger_level: "moderate",
  },
  workspace: {
    side_effects: ["read-or-update-workspace-config"],
    write_paths: READ_WRITE_PATHS.config,
    lock_policy: "mutation-lock-required-for-add-rm-enable-disable",
    atomic_write_policy: "atomic-config-write",
    dry_run: { supported: false },
    receipts: ["workspace-receipt"],
    danger_level: "mixed",
  },
  db: {
    side_effects: ["read-or-write-project-db-and-snapshots"],
    write_paths: READ_WRITE_PATHS.db,
    lock_policy: "mutation-lock-required-for-init-migrate-queue-snapshot-seal",
    atomic_write_policy: "atomic-file-writes-and-sqlite-transactions",
    dry_run: { supported: false },
    receipts: ["project-db-receipt", "queue-receipt", "snapshot-receipt"],
    danger_level: "mixed",
  },
  "db index": {
    side_effects: ["read-or-rebuild-sqlite-index"],
    write_paths: [".mdkg/index/**"],
    lock_policy: "mutation-lock-required-for-rebuild",
    atomic_write_policy: "sqlite-transaction-and-temp-files",
    dry_run: { supported: false },
    receipts: ["db-index-receipt"],
    danger_level: "mixed",
  },
  "db queue": {
    side_effects: ["read-or-write-local-project-db-queue-delivery-state", "emit-read-only-adapter-contract"],
    write_paths: [".mdkg/db/runtime/**"],
    lock_policy: "mutation-lock-required-for-create-pause-resume-enqueue-claim-ack-fail-dead-letter-release-expired",
    atomic_write_policy: "sqlite-transactions",
    dry_run: { supported: false },
    receipts: ["queue-receipt", "queue-adapter-contract-receipt"],
    danger_level: "mixed",
    json_schema_ref: "mdkg.project_db.queue.adapter.v1",
  },
  "db snapshot": {
    side_effects: ["read-or-seal-project-db-snapshot"],
    write_paths: [".mdkg/db/state/**"],
    lock_policy: "mutation-lock-required-for-seal",
    atomic_write_policy: "atomic-file-writes",
    dry_run: { supported: false },
    receipts: ["snapshot-receipt"],
    danger_level: "mixed",
  },
  index: {
    side_effects: ["rebuild-generated-index-cache"],
    write_paths: [".mdkg/index/**"],
    lock_policy: "mutation-lock-required",
    atomic_write_policy: "sqlite-transaction-and-atomic-cache-write",
    dry_run: { supported: false },
    receipts: ["index-rebuild-receipt"],
    danger_level: "moderate",
  },
};

function goalStateMutation(action) {
  return {
    side_effects: [action],
    write_paths: READ_WRITE_PATHS.graph,
    lock_policy: "mutation-lock-required",
    atomic_write_policy: "atomic-file-writes",
    dry_run: { supported: false },
    receipts: ["goal-state-receipt"],
    danger_level: "moderate",
  };
}

function taskMutation(action) {
  return {
    side_effects: [action],
    write_paths: READ_WRITE_PATHS.graph,
    lock_policy: "mutation-lock-required",
    atomic_write_policy: "atomic-file-writes",
    dry_run: { supported: false },
    receipts: ["task-receipt"],
    danger_level: "moderate",
  };
}

function runHelp(target) {
  const args = target[0] === "global" ? ["--help"] : ["help", ...target];
  const result = spawnSync(process.execPath, [cliPath, ...args], {
    cwd: root,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(`failed to capture help for ${helpTargetKey(target)}: ${result.stderr || result.stdout}`);
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
    if (trimmed.length === 0 || /^[A-Z][A-Za-z /-]+:$/.test(trimmed)) {
      break;
    }
    if (/^\s*mdkg(\s|$)/.test(rawLine)) {
      usage.push(rawLine.trimEnd());
    }
  }
  return usage;
}

function extractSummary(helpText, key) {
  const lines = helpText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines[0] === "Usage:") {
    return key === "global" ? "mdkg global command overview" : `mdkg ${key} command`;
  }
  const usageIndex = lines.findIndex((line) => line === "Usage:");
  if (usageIndex > 0) {
    return lines[0];
  }
  const boundary = lines.find((line) => /^[A-Z][A-Za-z /-]+:$/.test(line));
  return boundary ? boundary.replace(/:$/, "") : "mdkg command";
}

function extractFlags(helpText) {
  const flags = new Map();
  const flagPattern = /(^|\s)(--[a-z0-9][a-z0-9-]*)(?:[ =](<[^>]+>|\[[^\]]+\]|\S+))?/gi;
  for (const line of helpText.split(/\r?\n/)) {
    for (const match of line.matchAll(flagPattern)) {
      const name = match[2];
      const value = match[3] && !match[3].startsWith("--") ? match[3] : null;
      if (!flags.has(name)) {
        flags.set(name, {
          name,
          value,
          required: line.includes(`${name} <`) && line.includes("|") && line.includes("Usage:") ? true : false,
          description: line.trim(),
        });
      }
    }
  }
  return Array.from(flags.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function extractArgs(usageLines) {
  const args = new Map();
  const argPattern = /(<[^>]+>|\[[a-zA-Z0-9_-]+(?:-or-[a-zA-Z0-9_-]+)*\])/g;
  for (const usage of usageLines) {
    for (const match of usage.matchAll(argPattern)) {
      const before = usage.slice(0, match.index).trimEnd();
      if (/--[a-z0-9][a-z0-9-]*(?:\||\s*)$/i.test(before)) {
        continue;
      }
      const token = match[1];
      if (token.startsWith("<")) {
        const name = token.slice(1, -1);
        if (!args.has(name)) {
          args.set(name, { name, required: true, source: token });
        }
      } else if (!token.includes("--")) {
        const name = token.slice(1, -1);
        if (!args.has(name)) {
          args.set(name, { name, required: false, source: token });
        }
      }
    }
  }
  return Array.from(args.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function outputFormats(helpText) {
  const formats = ["text"];
  for (const format of ["json", "xml", "toon", "md"]) {
    if (helpText.includes(`--${format}`)) {
      formats.push(format);
    }
  }
  return formats;
}

function categoryFor(target) {
  if (target[0] === "global") {
    return "global";
  }
  return target[0];
}

function defaultSafety(helpText) {
  const jsonSchemaRef = helpText.includes("--json") ? "mdkg.command_output.v1" : null;
  return {
    json_schema_ref: jsonSchemaRef,
    side_effects: ["none"],
    read_paths: [".mdkg/**"],
    write_paths: [],
    lock_policy: "none-read-only",
    atomic_write_policy: "none-read-only",
    dry_run: { supported: false },
    receipts: [],
    danger_level: "read-only",
  };
}

function normalizeRecord(record) {
  const normalized = { ...record };
  if (!normalized.json_schema_ref) {
    normalized.json_schema_ref = null;
  }
  for (const field of ["side_effects", "read_paths", "write_paths", "receipts", "examples", "aliases"]) {
    normalized[field] = Array.from(new Set(normalized[field] || [])).sort();
  }
  return normalized;
}

function commandRecord(target) {
  const key = helpTargetKey(target);
  const help = runHelp(target);
  const usage = collectUsageLines(help);
  const base = defaultSafety(help);
  const override = SAFETY_OVERRIDES[key] || {};
  const record = {
    key,
    path: target,
    category: categoryFor(target),
    status: "stable",
    visibility: "public",
    summary: extractSummary(help, key),
    usage,
    args: extractArgs(usage),
    flags: extractFlags(help),
    output_formats: outputFormats(help),
    json_schema_ref: override.json_schema_ref ?? base.json_schema_ref,
    side_effects: override.side_effects ?? base.side_effects,
    read_paths: override.read_paths ?? base.read_paths,
    write_paths: override.write_paths ?? base.write_paths,
    dry_run: override.dry_run ?? base.dry_run,
    lock_policy: override.lock_policy ?? base.lock_policy,
    atomic_write_policy: override.atomic_write_policy ?? base.atomic_write_policy,
    receipts: override.receipts ?? base.receipts,
    danger_level: override.danger_level ?? base.danger_level,
    aliases: [],
    exit_codes: [
      { code: 0, meaning: "success" },
      { code: 1, meaning: "validation-or-runtime-error" },
    ],
    examples: usage.slice(0, 3),
    docs: {
      help_target: target[0] === "global" ? "mdkg --help" : `mdkg help ${key}`,
      command_matrix: "CLI_COMMAND_MATRIX.md",
    },
  };
  return normalizeRecord(record);
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
    .join(",")}}`;
}

function hashContract(contractWithoutHash) {
  return crypto.createHash("sha256").update(stableStringify(contractWithoutHash)).digest("hex");
}

function validateContract(contract) {
  const errors = [];
  const seen = new Set();
  for (const command of contract.commands) {
    if (seen.has(command.key)) {
      errors.push(`duplicate command key ${command.key}`);
    }
    seen.add(command.key);
    for (const field of [
      "key",
      "path",
      "usage",
      "args",
      "flags",
      "output_formats",
      "side_effects",
      "read_paths",
      "write_paths",
      "dry_run",
      "visibility",
      "receipts",
      "lock_policy",
      "atomic_write_policy",
      "danger_level",
    ]) {
      if (!(field in command)) {
        errors.push(`${command.key} missing ${field}`);
      }
    }
    const mutating = command.side_effects.some((effect) => effect !== "none") || command.write_paths.length > 0;
    if (mutating) {
      if (command.danger_level === "read-only") {
        errors.push(`${command.key} mutates but is marked read-only`);
      }
      if (command.lock_policy === "none-read-only") {
        errors.push(`${command.key} mutates but has no lock policy`);
      }
      if (command.atomic_write_policy === "none-read-only") {
        errors.push(`${command.key} mutates but has no atomic write policy`);
      }
      if (command.write_paths.length === 0) {
        errors.push(`${command.key} mutates but has no write paths`);
      }
    }
  }
  const expectedKeys = HELP_TARGETS.map(helpTargetKey).sort();
  const actualKeys = contract.commands.map((command) => command.key).sort();
  if (JSON.stringify(expectedKeys) !== JSON.stringify(actualKeys)) {
    errors.push("command keys do not match help targets");
  }
  if (!/^[a-f0-9]{64}$/.test(contract.contract_hash || "")) {
    errors.push("contract_hash must be a sha256 hex digest");
  }
  if (errors.length > 0) {
    throw new Error(`invalid command contract:\n${errors.join("\n")}`);
  }
}

function buildContract() {
  const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  const commands = HELP_TARGETS.map(commandRecord).sort((a, b) => a.key.localeCompare(b.key));
  const withoutHash = {
    schema_version: 1,
    tool: "mdkg",
    package_version: pkg.version,
    source: {
      help_targets: "scripts/cli_help_targets.js",
      command_matrix: "CLI_COMMAND_MATRIX.md",
    },
    projections: {
      mdkg_native: "dist/command-contract.json",
      opencli: null,
    },
    commands,
  };
  const contract = {
    ...withoutHash,
    contract_hash: hashContract(withoutHash),
  };
  validateContract(contract);
  return contract;
}

function readExisting() {
  if (!fs.existsSync(outputPath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(outputPath, "utf8"));
}

function main() {
  const write = process.argv.includes("--write");
  const check = process.argv.includes("--check");
  const contract = buildContract();

  if (write) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, `${JSON.stringify(contract, null, 2)}\n`, "utf8");
    console.log(`command contract written: ${path.relative(root, outputPath)} ${contract.contract_hash}`);
    return;
  }

  if (check) {
    const existing = readExisting();
    if (!existing) {
      throw new Error(`missing generated command contract at ${path.relative(root, outputPath)}`);
    }
    if (stableStringify(existing) !== stableStringify(contract)) {
      throw new Error(
        `generated command contract is stale; run node scripts/generate-command-contract.js --write`
      );
    }
    console.log(`command contract check: ok ${contract.contract_hash}`);
    return;
  }

  process.stdout.write(`${JSON.stringify(contract, null, 2)}\n`);
}

main();
