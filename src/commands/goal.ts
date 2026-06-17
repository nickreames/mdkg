import fs from "fs";
import path from "path";
import { loadConfig } from "../core/config";
import { collectGoalScope, GOAL_SCOPE_ACTIONABLE_TYPES } from "../graph/goal_scope";
import { Index, IndexNode } from "../graph/indexer";
import { loadIndex } from "../graph/index_cache";
import {
  DEFAULT_FRONTMATTER_KEY_ORDER,
  formatFrontmatter,
  FrontmatterValue,
  parseFrontmatter,
} from "../graph/frontmatter";
import { buildIndex } from "../graph/indexer";
import { writeDerivedIndexes } from "../graph/reindex";
import { atomicWriteFile } from "../util/atomic";
import { formatDate } from "../util/date";
import { NotFoundError, UsageError } from "../util/errors";
import { withMutationLock } from "../util/lock";
import { formatResolveError, resolveQid } from "../util/qid";
import { sortNodesForNext } from "../util/sort";
import { appendAutomaticEvent } from "./event_support";
import { formatNodeCard } from "./node_card";

const CONCRETE_GOAL_NEXT_TYPES = new Set(["feat", "task", "bug", "test", "spike"]);
const SELECTED_GOAL_STATE_PATH = path.join(".mdkg", "state", "selected-goal.json");
const GOAL_STATE_BY_ACTION: Record<GoalStateMutationAction, string> = {
  pause: "paused",
  resume: "active",
  done: "achieved",
  archive: "archived",
};
const STATUS_BY_ACTION: Record<GoalStateMutationAction, string> = {
  pause: "blocked",
  resume: "progress",
  done: "done",
  archive: "archived",
};

type GoalStateMutationAction = "pause" | "resume" | "done" | "archive";

export type GoalCommandOptions = {
  root: string;
  id?: string;
  ws?: string;
  json?: boolean;
  now?: Date;
};

export type GoalClaimCommandOptions = GoalCommandOptions & {
  workId: string;
};

type LoadedGoal = {
  config: ReturnType<typeof loadConfig>;
  index: Index;
  node: IndexNode;
  filePath: string;
  frontmatter: Record<string, FrontmatterValue>;
  body: string;
  resolutionSource: "explicit" | "selected" | "unique_active";
  warnings: string[];
};

type SelectedGoalState = {
  qid: string;
  id: string;
  ws: string;
  selected_at: string;
};

function normalizeWorkspace(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }
  const normalized = value.toLowerCase();
  if (normalized === "all") {
    throw new UsageError("--ws all is not valid here");
  }
  return normalized;
}

function toStringList(value: FrontmatterValue | undefined): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }
  return [];
}

function selectedGoalPath(root: string): string {
  return path.join(root, SELECTED_GOAL_STATE_PATH);
}

function readSelectedGoalState(root: string, warnings: string[]): SelectedGoalState | undefined {
  const filePath = selectedGoalPath(root);
  if (!fs.existsSync(filePath)) {
    return undefined;
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")) as Partial<SelectedGoalState>;
    if (
      typeof parsed.qid === "string" &&
      typeof parsed.id === "string" &&
      typeof parsed.ws === "string" &&
      typeof parsed.selected_at === "string"
    ) {
      return {
        qid: parsed.qid.toLowerCase(),
        id: parsed.id.toLowerCase(),
        ws: parsed.ws.toLowerCase(),
        selected_at: parsed.selected_at,
      };
    }
    warnings.push("selected goal state is malformed; run `mdkg goal select <goal-id>`");
    return undefined;
  } catch {
    warnings.push("selected goal state is unreadable; run `mdkg goal select <goal-id>`");
    return undefined;
  }
}

function writeSelectedGoalState(root: string, node: IndexNode, now: Date): void {
  const state: SelectedGoalState = {
    qid: node.qid,
    id: node.id,
    ws: node.ws,
    selected_at: now.toISOString(),
  };
  atomicWriteFile(selectedGoalPath(root), `${JSON.stringify(state, null, 2)}\n`);
}

function readNodeFrontmatter(root: string, node: IndexNode): {
  filePath: string;
  frontmatter: Record<string, FrontmatterValue>;
  body: string;
} {
  const filePath = path.resolve(root, node.path);
  const parsed = parseFrontmatter(fs.readFileSync(filePath, "utf8"), filePath);
  return {
    filePath,
    frontmatter: { ...parsed.frontmatter },
    body: parsed.body,
  };
}

function writeNodeFrontmatterFile(
  filePath: string,
  frontmatter: Record<string, FrontmatterValue>,
  body: string,
  now: Date
): void {
  frontmatter.updated = formatDate(now);
  const lines = formatFrontmatter(frontmatter, DEFAULT_FRONTMATTER_KEY_ORDER);
  const frontmatterBlock = ["---", ...lines, "---"].join("\n");
  const content = body.length > 0 ? `${frontmatterBlock}\n${body}` : frontmatterBlock;
  atomicWriteFile(filePath, content);
}

function removeSelectedGoalState(root: string): boolean {
  const filePath = selectedGoalPath(root);
  if (!fs.existsSync(filePath)) {
    return false;
  }
  fs.rmSync(filePath, { force: true });
  return true;
}

function optionalString(value: FrontmatterValue | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function resolveExplicitGoal(index: Index, idOrQid: string, wsHint?: string): IndexNode {
  const resolved = resolveQid(index, idOrQid, wsHint);
  if (resolved.status !== "ok") {
    throw new NotFoundError(formatResolveError("goal", idOrQid, resolved, wsHint));
  }
  const node = index.nodes[resolved.qid];
  if (!node) {
    throw new NotFoundError(`goal not found: ${idOrQid}`);
  }
  return node;
}

function activeGoalCandidates(index: Index, wsHint?: string): IndexNode[] {
  return Object.values(index.nodes)
    .filter((node) => node.type === "goal")
    .filter((node) => !node.source?.imported)
    .filter((node) => (wsHint ? node.ws === wsHint : true))
    .filter((node) => node.status === "progress" && node.attributes.goal_state === "active")
    .sort((a, b) => a.qid.localeCompare(b.qid));
}

function activeGoalConflicts(index: Index, target: IndexNode): IndexNode[] {
  return activeGoalCandidates(index, target.ws).filter((node) => node.qid !== target.qid);
}

function isArchivedGoal(node: IndexNode | undefined): boolean {
  return Boolean(
    node &&
    node.type === "goal" &&
    (node.status === "archived" || node.attributes.goal_state === "archived")
  );
}

function resolveGoalSelection(
  root: string,
  index: Index,
  idOrQid: string | undefined,
  wsHint?: string
): { node: IndexNode; source: LoadedGoal["resolutionSource"]; warnings: string[] } {
  const warnings: string[] = [];
  if (idOrQid) {
    return {
      node: resolveExplicitGoal(index, idOrQid, wsHint),
      source: "explicit",
      warnings,
    };
  }

  const selected = readSelectedGoalState(root, warnings);
  if (selected) {
    const node = index.nodes[selected.qid];
    if (node && node.type === "goal" && !node.source?.imported && !isArchivedGoal(node)) {
      return { node, source: "selected", warnings };
    }
    if (isArchivedGoal(node)) {
      warnings.push(`selected goal ${selected.qid} is archived; run \`mdkg goal activate <goal-id>\` or \`mdkg goal clear\``);
    } else {
      warnings.push(`selected goal ${selected.qid} is not available; run \`mdkg goal select <goal-id>\``);
    }
  }

  const active = activeGoalCandidates(index, wsHint);
  if (active.length === 1) {
    return { node: active[0], source: "unique_active", warnings };
  }
  if (active.length > 1) {
    throw new UsageError(
      `multiple active goals found: ${active.map((node) => node.qid).join(", ")}; run \`mdkg goal activate <goal-id>\``
    );
  }
  throw new NotFoundError("no selected goal or unique active goal found; run `mdkg goal activate <goal-id>`");
}

function loadGoal(root: string, idOrQid: string | undefined, wsHint?: string): LoadedGoal {
  const config = loadConfig(root);
  const { index } = loadIndex({ root, config });
  const ws = normalizeWorkspace(wsHint);
  const selection = resolveGoalSelection(root, index, idOrQid, ws);
  const node = selection.node;
  if (node.source?.imported) {
    throw new UsageError(
      `cannot mutate read-only subgraph node ${node.qid}; update the source workspace for subgraph ${node.source.subgraph_alias}`
    );
  }
  if (node.type !== "goal") {
    throw new UsageError(`mdkg goal requires a goal node; got ${node.type}:${node.id}`);
  }

  const filePath = path.resolve(root, node.path);
  const content = fs.readFileSync(filePath, "utf8");
  const parsed = parseFrontmatter(content, filePath);
  return {
    config,
    index,
    node,
    filePath,
    frontmatter: { ...parsed.frontmatter },
    body: parsed.body,
    resolutionSource: selection.source,
    warnings: selection.warnings,
  };
}

function goalReceipt(root: string, loaded: LoadedGoal): Record<string, unknown> {
  const fm = loaded.frontmatter;
  const rawPriority = fm.priority;
  const priority = rawPriority === undefined ? undefined : Number.parseInt(String(rawPriority), 10);
  return {
    workspace: loaded.node.ws,
    id: loaded.node.id,
    qid: loaded.node.qid,
    path: path.relative(root, loaded.filePath),
    type: loaded.node.type,
    title: loaded.node.title,
    status: String(fm.status ?? ""),
    ...(Number.isInteger(priority) ? { priority } : {}),
    goal_state: String(fm.goal_state ?? ""),
    goal_condition: String(fm.goal_condition ?? ""),
    scope_refs: toStringList(fm.scope_refs),
    active_node: optionalString(fm.active_node),
    required_skills: toStringList(fm.required_skills),
    required_checks: toStringList(fm.required_checks),
    max_iterations: optionalString(fm.max_iterations),
    blocked_after_attempts: optionalString(fm.blocked_after_attempts),
  };
}

function writeGoalFile(loaded: LoadedGoal, now: Date): void {
  writeNodeFrontmatterFile(loaded.filePath, loaded.frontmatter, loaded.body, now);
}

function maybeReindex(root: string, config: ReturnType<typeof loadConfig>): void {
  if (!config.index.auto_reindex) {
    return;
  }
  writeDerivedIndexes(root, config, buildIndex(root, config, { tolerant: config.index.tolerant }));
}

function ensureStatusAllowed(config: ReturnType<typeof loadConfig>, status: string): string {
  const normalized = status.toLowerCase();
  if (normalized === "archived") {
    return normalized;
  }
  const allowed = new Set(config.work.status_enum.map((value) => value.toLowerCase()));
  if (!allowed.has(normalized)) {
    throw new UsageError(`goal status ${normalized} is not allowed by work.status_enum`);
  }
  return normalized;
}

function completionEvidenceBody(body: string): string {
  const match = body.match(/(^|\n)# Completion Evidence\s*\n([\s\S]*?)(?=\n# |\s*$)/i);
  return (match?.[2] ?? "").trim();
}

function hasCompletionEvidence(body: string): boolean {
  const evidence = completionEvidenceBody(body);
  if (!evidence) {
    return false;
  }
  return !/^(?:- )?(?:pending|none yet)\.?$/i.test(evidence.trim());
}

function isConcreteCandidate(node: IndexNode, statusRanks: Set<string>): boolean {
  if (node.source?.imported) {
    return false;
  }
  if (!CONCRETE_GOAL_NEXT_TYPES.has(node.type) || !GOAL_SCOPE_ACTIONABLE_TYPES.has(node.type)) {
    return false;
  }
  if (!node.status || !statusRanks.has(node.status)) {
    return false;
  }
  return node.status !== "done";
}

function resolveCandidate(index: Index, idOrQid: string, ws: string): IndexNode | undefined {
  const resolved = resolveQid(index, idOrQid, ws);
  if (resolved.status !== "ok") {
    return undefined;
  }
  return index.nodes[resolved.qid];
}

export function runGoalShowCommand(options: GoalCommandOptions): void {
  const loaded = loadGoal(options.root, options.id, options.ws);
  const receipt = { action: "showed", goal: goalReceipt(options.root, loaded) };
  if (options.json) {
    console.log(JSON.stringify(receipt, null, 2));
    return;
  }
  console.log(`goal: ${loaded.node.qid}`);
  console.log(`state: ${loaded.frontmatter.goal_state}`);
  console.log(`condition: ${loaded.frontmatter.goal_condition}`);
  if (loaded.frontmatter.active_node) {
    console.log(`active_node: ${loaded.frontmatter.active_node}`);
  }
  const checks = toStringList(loaded.frontmatter.required_checks);
  console.log(`required_checks: ${checks.length === 0 ? "none" : checks.join(", ")}`);
}

export function runGoalEvaluateCommand(options: GoalCommandOptions): void {
  const loaded = loadGoal(options.root, options.id, options.ws);
  const checks = toStringList(loaded.frontmatter.required_checks).map((command) => ({
    command,
    status: "report_only",
  }));
  const receipt = {
    action: "evaluated",
    goal: goalReceipt(options.root, loaded),
    report_only: true,
    runs_scripts: false,
    checks,
    completion_evidence_present: hasCompletionEvidence(loaded.body),
  };
  if (options.json) {
    console.log(JSON.stringify(receipt, null, 2));
    return;
  }
  console.log(`goal evaluated: ${loaded.node.qid}`);
  console.log("report_only: true");
  console.log(`runs_scripts: false`);
  console.log(`completion_evidence_present: ${hasCompletionEvidence(loaded.body) ? "yes" : "no"}`);
  if (checks.length > 0) {
    console.log("required_checks:");
    for (const check of checks) {
      console.log(`- ${check.command} (${check.status})`);
    }
  } else {
    console.log("required_checks: none");
  }
}

export function runGoalNextCommand(options: GoalCommandOptions): void {
  const loaded = loadGoal(options.root, options.id, options.ws);
  if (isArchivedGoal(loaded.node)) {
    const warnings = [...loaded.warnings, `${loaded.node.qid} is archived and has no actionable next work`];
    if (options.json) {
      console.log(
        JSON.stringify(
          {
            action: "selected",
            goal: goalReceipt(options.root, loaded),
            goal_source: loaded.resolutionSource,
            node: null,
            warnings,
          },
          null,
          2
        )
      );
      return;
    }
    for (const warning of warnings) {
      console.error(`warning: ${warning}`);
    }
    console.error("no actionable local work found for goal");
    return;
  }
  const statusPreference = loaded.config.work.next.status_preference.map((status) => status.toLowerCase());
  const statusRanks = new Set(statusPreference);
  const warnings: string[] = [...loaded.warnings];
  const activeNode = optionalString(loaded.frontmatter.active_node);
  const scope = collectGoalScope(loaded.index, loaded.node);
  for (const missing of scope.missingRefs) {
    warnings.push(`scope_refs references missing node: ${missing}`);
  }
  for (const invalid of scope.invalidRefs) {
    warnings.push(`scope contains non-actionable or unsupported node: ${invalid}`);
  }

  if (activeNode) {
    const node = resolveCandidate(loaded.index, activeNode, loaded.node.ws);
    if (node && scope.actionableQids.has(node.qid) && isConcreteCandidate(node, statusRanks)) {
      if (options.json) {
        console.log(
          JSON.stringify(
            {
              action: "selected",
              goal: goalReceipt(options.root, loaded),
              goal_source: loaded.resolutionSource,
              node,
              warnings,
            },
            null,
            2
          )
        );
        return;
      }
      console.log(formatNodeCard(node));
      return;
    }
    warnings.push(`active_node is not an actionable local concrete item: ${activeNode}`);
  }

  const candidates = Array.from(scope.actionableQids)
    .map((qid) => loaded.index.nodes[qid])
    .filter((node): node is IndexNode => Boolean(node))
    .filter((node) => isConcreteCandidate(node, statusRanks));
  const sorted = sortNodesForNext(candidates, {
    statusPreference,
    priorityMax: loaded.config.work.priority_max,
  });
  const selected = sorted[0];

  if (options.json) {
    console.log(
      JSON.stringify(
        {
          action: "selected",
          goal: goalReceipt(options.root, loaded),
          goal_source: loaded.resolutionSource,
          node: selected ?? null,
          warnings,
        },
        null,
        2
      )
    );
    return;
  }

  for (const warning of warnings) {
    console.error(`warning: ${warning}`);
  }
  if (!selected) {
    console.error("no actionable local work found for goal");
    return;
  }
  console.log(formatNodeCard(selected));
}

export function runGoalSelectCommand(options: GoalCommandOptions): void {
  const config = loadConfig(options.root);
  return withMutationLock(options.root, config.index.lock_timeout_ms, () => {
    const loaded = loadGoal(options.root, options.id, options.ws);
    if (isArchivedGoal(loaded.node)) {
      throw new UsageError(`cannot select archived goal ${loaded.node.qid}`);
    }
    const now = options.now ?? new Date();
    writeSelectedGoalState(options.root, loaded.node, now);
    const receipt = {
      action: "selected_goal",
      goal: goalReceipt(options.root, loaded),
      selection: {
        path: SELECTED_GOAL_STATE_PATH,
        selected_at: now.toISOString(),
      },
    };
    if (options.json) {
      console.log(JSON.stringify(receipt, null, 2));
      return;
    }
    console.log(`selected goal: ${loaded.node.qid}`);
  });
}

export function runGoalActivateCommand(options: GoalCommandOptions): void {
  const config = loadConfig(options.root);
  return withMutationLock(options.root, config.index.lock_timeout_ms, () => {
    const loaded = loadGoal(options.root, options.id, options.ws);
    const currentState = String(loaded.frontmatter.goal_state ?? "");
    const currentStatus = String(loaded.frontmatter.status ?? "");
    if (loaded.node.status === "done" || currentStatus === "done" || currentState === "achieved") {
      throw new UsageError(`cannot activate achieved goal ${loaded.node.qid}`);
    }
    if (loaded.node.status === "archived" || currentStatus === "archived" || currentState === "archived") {
      throw new UsageError(`cannot activate archived goal ${loaded.node.qid}`);
    }

    const now = options.now ?? new Date();
    const pausedGoals: Array<Record<string, unknown>> = [];
    const conflicts = activeGoalConflicts(loaded.index, loaded.node);
    for (const conflict of conflicts) {
      const conflictFile = readNodeFrontmatter(options.root, conflict);
      conflictFile.frontmatter.goal_state = "paused";
      conflictFile.frontmatter.status = ensureStatusAllowed(config, "blocked");
      writeNodeFrontmatterFile(conflictFile.filePath, conflictFile.frontmatter, conflictFile.body, now);
      pausedGoals.push({
        workspace: conflict.ws,
        id: conflict.id,
        qid: conflict.qid,
        path: conflict.path,
        previous_status: conflict.status ?? "",
        previous_goal_state: String(conflict.attributes.goal_state ?? ""),
        status: "blocked",
        goal_state: "paused",
      });
    }

    loaded.frontmatter.goal_state = "active";
    loaded.frontmatter.status = ensureStatusAllowed(config, "progress");
    writeGoalFile(loaded, now);
    writeSelectedGoalState(options.root, loaded.node, now);
    maybeReindex(options.root, loaded.config);

    appendAutomaticEvent({
      root: options.root,
      ws: loaded.node.ws,
      kind: "GOAL_ACTIVATE",
      status: "ok",
      refs: [loaded.node.id, ...conflicts.map((node) => node.id)],
      notes: `goal activate via mdkg goal activate`,
      now,
    });

    const receipt = {
      action: "activated",
      goal: goalReceipt(options.root, loaded),
      activated_goal: goalReceipt(options.root, loaded),
      paused_goals: pausedGoals,
      selection: {
        path: SELECTED_GOAL_STATE_PATH,
        selected_at: now.toISOString(),
      },
      warnings: conflicts.length > 0
        ? [`paused ${conflicts.length} competing active goal(s) in workspace ${loaded.node.ws}`]
        : [],
    };
    if (options.json) {
      console.log(JSON.stringify(receipt, null, 2));
      return;
    }
    for (const warning of receipt.warnings) {
      console.error(`warning: ${warning}`);
    }
    console.log(`goal activate: ${loaded.node.qid}`);
  });
}

export function runGoalCurrentCommand(options: GoalCommandOptions): void {
  const config = loadConfig(options.root);
  const { index } = loadIndex({ root: options.root, config });
  const ws = normalizeWorkspace(options.ws);
  const warnings: string[] = [];
  let source: LoadedGoal["resolutionSource"] | "none" | "ambiguous" = "none";
  let node: IndexNode | undefined;

  const selected = readSelectedGoalState(options.root, warnings);
  if (selected) {
    const selectedNode = index.nodes[selected.qid];
    if (selectedNode && selectedNode.type === "goal" && !selectedNode.source?.imported && !isArchivedGoal(selectedNode)) {
      node = selectedNode;
      source = "selected";
    } else {
      if (isArchivedGoal(selectedNode)) {
        warnings.push(`selected goal ${selected.qid} is archived; run \`mdkg goal activate <goal-id>\` or \`mdkg goal clear\``);
      } else {
        warnings.push(`selected goal ${selected.qid} is not available; run \`mdkg goal select <goal-id>\``);
      }
    }
  }

  if (!node) {
    const active = activeGoalCandidates(index, ws);
    if (active.length === 1) {
      node = active[0];
      source = "unique_active";
    } else if (active.length > 1) {
      source = "ambiguous";
      warnings.push(`multiple active goals found: ${active.map((goal) => goal.qid).join(", ")}; run \`mdkg goal activate <goal-id>\``);
    }
  }

  const receipt = {
    action: "current",
    goal: node ? {
      workspace: node.ws,
      id: node.id,
      qid: node.qid,
      path: node.path,
      type: node.type,
      title: node.title,
      status: node.status ?? "",
      ...(node.priority !== undefined ? { priority: node.priority } : {}),
      goal_state: String(node.attributes.goal_state ?? ""),
      goal_condition: String(node.attributes.goal_condition ?? ""),
      scope_refs: toStringList(node.attributes.scope_refs),
      active_node: optionalString(node.attributes.active_node),
      required_skills: toStringList(node.attributes.required_skills),
      required_checks: toStringList(node.attributes.required_checks),
      max_iterations: optionalString(node.attributes.max_iterations),
      blocked_after_attempts: optionalString(node.attributes.blocked_after_attempts),
    } : null,
    source,
    warnings,
  };

  if (options.json) {
    console.log(JSON.stringify(receipt, null, 2));
    return;
  }
  for (const warning of warnings) {
    console.error(`warning: ${warning}`);
  }
  if (!node) {
    console.error("no selected goal");
    return;
  }
  console.log(`current goal: ${node.qid}`);
}

export function runGoalClearCommand(options: GoalCommandOptions): void {
  const config = loadConfig(options.root);
  return withMutationLock(options.root, config.index.lock_timeout_ms, () => {
    const cleared = removeSelectedGoalState(options.root);
    const receipt = {
      action: "cleared_goal",
      path: SELECTED_GOAL_STATE_PATH,
      cleared,
    };
    if (options.json) {
      console.log(JSON.stringify(receipt, null, 2));
      return;
    }
    console.log(cleared ? "selected goal cleared" : "no selected goal to clear");
  });
}

export function runGoalClaimCommand(options: GoalClaimCommandOptions): void {
  const config = loadConfig(options.root);
  return withMutationLock(options.root, config.index.lock_timeout_ms, () => {
    const loaded = loadGoal(options.root, options.id, options.ws);
    if (isArchivedGoal(loaded.node)) {
      throw new UsageError(`cannot claim work for archived goal ${loaded.node.qid}`);
    }
    const resolved = resolveQid(loaded.index, options.workId, loaded.node.ws);
    if (resolved.status !== "ok") {
      throw new NotFoundError(formatResolveError("work", options.workId, resolved, loaded.node.ws));
    }
    const node = loaded.index.nodes[resolved.qid];
    if (!node) {
      throw new NotFoundError(`work not found: ${options.workId}`);
    }
    if (node.source?.imported) {
      throw new UsageError(
        `cannot mutate read-only subgraph node ${node.qid}; update the source workspace for subgraph ${node.source.subgraph_alias}`
      );
    }
    const statusPreference = loaded.config.work.next.status_preference.map((status) => status.toLowerCase());
    const scope = collectGoalScope(loaded.index, loaded.node);
    if (!scope.actionableQids.has(node.qid)) {
      throw new UsageError(`${node.qid} is not inside goal scope for ${loaded.node.qid}`);
    }
    if (!isConcreteCandidate(node, new Set(statusPreference))) {
      throw new UsageError(`${node.qid} is not an actionable goal work item`);
    }
    const now = options.now ?? new Date();
    loaded.frontmatter.active_node = node.ws === loaded.node.ws ? node.id : node.qid;
    writeGoalFile(loaded, now);
    maybeReindex(options.root, loaded.config);
    appendAutomaticEvent({
      root: options.root,
      ws: loaded.node.ws,
      kind: "GOAL_CLAIM",
      status: "ok",
      refs: [loaded.node.id, node.id],
      notes: `goal claim via mdkg goal claim`,
      now,
    });
    const receipt = {
      action: "claimed",
      goal: goalReceipt(options.root, loaded),
      node,
    };
    if (options.json) {
      console.log(JSON.stringify(receipt, null, 2));
      return;
    }
    console.log(`goal claim: ${loaded.node.qid} -> ${node.qid}`);
  });
}

function runGoalStateMutationLocked(
  action: GoalStateMutationAction,
  options: GoalCommandOptions
): void {
  const loaded = loadGoal(options.root, options.id, options.ws);
  if (action !== "archive" && isArchivedGoal(loaded.node)) {
    throw new UsageError(`cannot ${action} archived goal ${loaded.node.qid}`);
  }
  const now = options.now ?? new Date();
  loaded.frontmatter.goal_state = GOAL_STATE_BY_ACTION[action];
  loaded.frontmatter.status = ensureStatusAllowed(loaded.config, STATUS_BY_ACTION[action]);
  writeGoalFile(loaded, now);
  maybeReindex(options.root, loaded.config);

  appendAutomaticEvent({
    root: options.root,
    ws: loaded.node.ws,
    kind: `GOAL_${action.toUpperCase()}`,
    status: "ok",
    refs: [loaded.node.id],
    notes: `goal ${action} via mdkg goal ${action}`,
    now,
  });

  const receipt = {
    action,
    goal: goalReceipt(options.root, loaded),
  };
  if (options.json) {
    console.log(JSON.stringify(receipt, null, 2));
    return;
  }
  console.log(`goal ${action}: ${loaded.node.qid}`);
}

export function runGoalPauseCommand(options: GoalCommandOptions): void {
  const config = loadConfig(options.root);
  return withMutationLock(options.root, config.index.lock_timeout_ms, () =>
    runGoalStateMutationLocked("pause", options)
  );
}

export function runGoalResumeCommand(options: GoalCommandOptions): void {
  const config = loadConfig(options.root);
  return withMutationLock(options.root, config.index.lock_timeout_ms, () =>
    runGoalStateMutationLocked("resume", options)
  );
}

export function runGoalDoneCommand(options: GoalCommandOptions): void {
  const config = loadConfig(options.root);
  return withMutationLock(options.root, config.index.lock_timeout_ms, () =>
    runGoalStateMutationLocked("done", options)
  );
}

export function runGoalArchiveCommand(options: GoalCommandOptions): void {
  const config = loadConfig(options.root);
  return withMutationLock(options.root, config.index.lock_timeout_ms, () =>
    runGoalStateMutationLocked("archive", options)
  );
}
