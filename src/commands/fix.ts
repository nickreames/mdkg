import crypto from "crypto";
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { loadConfig } from "../core/config";
import { resolveCapabilitiesIndexPath } from "../graph/capabilities_indexer";
import { isCapabilitiesIndexStale } from "../graph/capabilities_index_cache";
import { isIndexStale } from "../graph/staleness";
import { isSkillsIndexStale } from "../graph/skills_index_cache";
import { resolveSkillsIndexPath } from "../graph/skills_indexer";
import { isSqliteBackend } from "../graph/sqlite_index";
import { resolveSubgraphsIndexPath, isSubgraphsIndexStale } from "../graph/subgraphs";
import { buildIndex, Index } from "../graph/indexer";
import { ALLOWED_TYPES, parseNode } from "../graph/node";
import { loadTemplateSchemas } from "../graph/template_schema";
import { listWorkspaceDocFilesByAlias } from "../graph/workspace_files";
import { UsageError } from "../util/errors";
import { archiveIdFromUri } from "../util/refs";
import { atomicWriteFile } from "../util/atomic";
import { withMutationLock } from "../util/lock";
import { rebuildDerivedIndexCaches } from "./index";

export type FixFamily = "index" | "refs" | "ids" | "all";

export type FixPlanCommandOptions = {
  root: string;
  family?: string;
  target?: string;
  baseRef?: string;
  json?: boolean;
};

export type FixApplyCommandOptions = FixPlanCommandOptions;

type FixRisk = "low" | "medium" | "high" | "blocked";

type FixPlanChange = {
  id: string;
  family: Exclude<FixFamily, "all">;
  risk: FixRisk;
  status: "planned" | "manual_review" | "blocked";
  reason: string;
  paths: string[];
  refs: string[];
  evidence?: unknown;
  before?: unknown;
  after?: unknown;
  command_hint?: string;
  apply_supported: boolean;
  apply_kind?: "duplicate_id_rewrite" | "git_stage_duplicate_id_rewrite";
};

type FixFamilySummary = {
  family: Exclude<FixFamily, "all">;
  selected: boolean;
  proposed_count: number;
  blocked_count: number;
};

type FixPlannerResult = {
  proposed: FixPlanChange[];
  blocked: FixPlanChange[];
};

type FixApplyChange = {
  id: string;
  family: "ids";
  reason: string;
  apply_kind: "duplicate_id_rewrite" | "git_stage_duplicate_id_rewrite";
  path: string;
  touched_paths: string[];
  before: unknown;
  after: unknown;
  refs: string[];
};

type RefPlanEntry = {
  qid: string;
  path: string;
  field: string;
  value: string;
  target?: string;
  refKind: "graph" | "archive";
  locationKind: "frontmatter" | "graph_edge";
};

const FAMILY_VALUES = new Set<FixFamily>(["index", "refs", "ids", "all"]);
const CONCRETE_FAMILIES: Array<Exclude<FixFamily, "all">> = ["index", "refs", "ids"];

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(stableValue);
  }
  if (value && typeof value === "object") {
    const input = value as Record<string, unknown>;
    const output: Record<string, unknown> = {};
    for (const key of Object.keys(input).sort()) {
      output[key] = stableValue(input[key]);
    }
    return output;
  }
  return value;
}

function stableJson(value: unknown): string {
  return JSON.stringify(stableValue(value));
}

function sha256(value: unknown): string {
  return `sha256:${crypto.createHash("sha256").update(stableJson(value)).digest("hex")}`;
}

function normalizeFamily(value: string | undefined): FixFamily {
  const normalized = (value ?? "all").toLowerCase();
  if (!FAMILY_VALUES.has(normalized as FixFamily)) {
    throw new UsageError("--family must be one of index, refs, ids, all");
  }
  return normalized as FixFamily;
}

function selectedFamilies(family: FixFamily): Array<Exclude<FixFamily, "all">> {
  return family === "all" ? [...CONCRETE_FAMILIES] : [family];
}

function relativeRoot(root: string): string {
  try {
    return fs.realpathSync(root);
  } catch {
    return path.resolve(root);
  }
}

function rel(root: string, target: string): string {
  return path.relative(root, target).split(path.sep).join("/") || ".";
}

function runGit(root: string, args: string[]): string | undefined {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
  if (result.status !== 0) {
    return undefined;
  }
  return result.stdout.trim();
}

function collectDirtyState(root: string) {
  const inside = runGit(root, ["rev-parse", "--is-inside-work-tree"]) === "true";
  if (!inside) {
    return {
      inside: false,
      dirty: false,
      dirty_count: 0,
      untracked_count: 0,
    };
  }
  const porcelain = runGit(root, ["status", "--porcelain"]) ?? "";
  const lines = porcelain.split(/\r?\n/).filter(Boolean);
  return {
    inside: true,
    dirty: lines.length > 0,
    dirty_count: lines.length,
    untracked_count: lines.filter((line) => line.startsWith("??")).length,
  };
}

function emptyFamilySummaries(selected: Array<Exclude<FixFamily, "all">>): FixFamilySummary[] {
  return CONCRETE_FAMILIES.map((family) => ({
    family,
    selected: selected.includes(family),
    proposed_count: 0,
    blocked_count: 0,
  }));
}

function readJsonProblem(filePath: string): string | undefined {
  if (!fs.existsSync(filePath)) {
    return undefined;
  }
  try {
    JSON.parse(fs.readFileSync(filePath, "utf8"));
    return undefined;
  } catch (err) {
    return err instanceof Error ? err.message : "unreadable json";
  }
}

function planIndexRepairs(root: string): FixPlannerResult {
  const config = loadConfig(root);
  const entries: Array<{
    name: string;
    path: string;
    required: boolean;
    stale: () => boolean;
    json: boolean;
  }> = [
    {
      name: "global-index",
      path: path.resolve(root, config.index.global_index_path),
      required: true,
      stale: () => isIndexStale(root, config),
      json: true,
    },
    {
      name: "skills-index",
      path: resolveSkillsIndexPath(root),
      required: true,
      stale: () => isSkillsIndexStale(root, config),
      json: true,
    },
    {
      name: "capabilities-index",
      path: resolveCapabilitiesIndexPath(root, config),
      required: true,
      stale: () => isCapabilitiesIndexStale(root, config),
      json: true,
    },
    {
      name: "subgraphs-index",
      path: resolveSubgraphsIndexPath(root),
      required: Object.keys(config.subgraphs).length > 0,
      stale: () => isSubgraphsIndexStale(root, config),
      json: true,
    },
  ];

  if (isSqliteBackend(config)) {
    entries.push({
      name: "sqlite-index",
      path: path.resolve(root, ".mdkg", "index", "mdkg.sqlite"),
      required: true,
      stale: () => isIndexStale(root, config),
      json: false,
    });
  }

  const changes: FixPlanChange[] = [];
  for (const entry of entries) {
    if (!entry.required) {
      continue;
    }
    const relativePath = rel(root, entry.path);
    let reason: string | undefined;
    let detail: Record<string, unknown> | undefined;
    if (!fs.existsSync(entry.path)) {
      reason = "generated_cache_missing";
      detail = { cache: entry.name };
    } else if (entry.json) {
      const readProblem = readJsonProblem(entry.path);
      if (readProblem) {
        reason = "generated_cache_unreadable";
        detail = { cache: entry.name, error: readProblem };
      }
    }
    if (!reason) {
      try {
        if (entry.stale()) {
          reason = "generated_cache_stale";
          detail = { cache: entry.name };
        }
      } catch (err) {
        reason = "generated_cache_staleness_unknown";
        detail = {
          cache: entry.name,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    }
    if (!reason) {
      continue;
    }
    changes.push({
      id: `index.${String(changes.length + 1).padStart(3, "0")}`,
      family: "index",
      risk: "low",
      status: "planned",
      reason,
      paths: [relativePath],
      refs: [],
      before: detail,
      after: { command: "mdkg index" },
      command_hint: "mdkg index",
      apply_supported: false,
    });
  }
  return { proposed: changes, blocked: [] };
}

function edgeEntries(index: Index): Array<{ qid: string; path: string; field: string; target: string }> {
  const entries: Array<{ qid: string; path: string; field: string; target: string }> = [];
  for (const node of Object.values(index.nodes).sort((a, b) => a.qid.localeCompare(b.qid))) {
    const edgeMap: Array<[string, string | undefined]> = [
      ["epic", node.edges.epic],
      ["parent", node.edges.parent],
      ["prev", node.edges.prev],
      ["next", node.edges.next],
    ];
    for (const [field, target] of edgeMap) {
      if (target) {
        entries.push({ qid: node.qid, path: node.path, field, target });
      }
    }
    for (const [field, targets] of [
      ["relates", node.edges.relates],
      ["blocked_by", node.edges.blocked_by],
      ["blocks", node.edges.blocks],
    ] as Array<[string, string[]]>) {
      for (const target of targets) {
        entries.push({ qid: node.qid, path: node.path, field, target });
      }
    }
  }
  return entries;
}

const LOCAL_SCALAR_REF_FIELDS = new Set([
  "epic",
  "parent",
  "prev",
  "next",
  "active_node",
  "work_id",
  "work_order_id",
  "receipt_id",
  "target_id",
]);

const LOCAL_LIST_REF_FIELDS = new Set([
  "relates",
  "blocked_by",
  "blocks",
  "scope_refs",
  "work_contracts",
  "subagent_refs",
  "evidence_refs",
  "refs",
  "scope",
]);

const ARCHIVE_REF_LIST_FIELDS = new Set([
  "artifacts",
  "refs",
  "links",
  "input_refs",
  "constraint_refs",
  "proof_refs",
  "attestation_refs",
  "evidence_refs",
]);

const PORTABLE_ID_RE = /^[a-z0-9][a-z0-9._-]*$/;

function normalizeGraphRef(
  value: string,
  sourceWorkspace: string,
  knownWorkspaces: Set<string>,
  externalWorkspaces: Set<string>
): string | undefined {
  const normalized = value.toLowerCase();
  if (normalized.includes("://") || normalized.startsWith("sha256:")) {
    return undefined;
  }
  if (normalized.includes(":")) {
    const [workspace, id] = normalized.split(":", 2);
    if (!workspace || !id || !PORTABLE_ID_RE.test(id)) {
      return undefined;
    }
    if (!knownWorkspaces.has(workspace) && !externalWorkspaces.has(workspace)) {
      return undefined;
    }
    return `${workspace}:${id}`;
  }
  if (!PORTABLE_ID_RE.test(normalized)) {
    return undefined;
  }
  return `${sourceWorkspace}:${normalized}`;
}

function frontmatterRefEntries(
  index: Index,
  externalWorkspaces: Set<string>
): RefPlanEntry[] {
  const knownWorkspaces = new Set(index.meta.workspaces);
  const entries: RefPlanEntry[] = [];
  const pushListEntries = (node: Index["nodes"][string], field: string, raw: string[]): void => {
    for (const [indexValue, value] of raw.entries()) {
      const indexedField = `${field}[${indexValue}]`;
      if (LOCAL_LIST_REF_FIELDS.has(field)) {
        const target = normalizeGraphRef(value, node.ws, knownWorkspaces, externalWorkspaces);
        if (target) {
          entries.push({
            qid: node.qid,
            path: node.path,
            field: indexedField,
            value,
            target,
            refKind: "graph",
            locationKind: "frontmatter",
          });
        }
      }
      if (value.startsWith("archive://") && ARCHIVE_REF_LIST_FIELDS.has(field)) {
        entries.push({
          qid: node.qid,
          path: node.path,
          field: indexedField,
          value,
          refKind: "archive",
          locationKind: "frontmatter",
        });
      }
    }
  };
  for (const node of Object.values(index.nodes).sort((a, b) => a.qid.localeCompare(b.qid))) {
    for (const [field, raw] of [
      ["links", node.links],
      ["artifacts", node.artifacts],
      ["refs", node.refs],
    ] as Array<[string, string[]]>) {
      pushListEntries(node, field, raw);
    }
    for (const [field, raw] of Object.entries(node.attributes).sort(([a], [b]) => a.localeCompare(b))) {
      if (typeof raw === "string") {
        if (LOCAL_SCALAR_REF_FIELDS.has(field)) {
          const target = normalizeGraphRef(raw, node.ws, knownWorkspaces, externalWorkspaces);
          if (target) {
            entries.push({
              qid: node.qid,
              path: node.path,
              field,
              value: raw,
              target,
              refKind: "graph",
              locationKind: "frontmatter",
            });
          }
        }
        if (raw.startsWith("archive://") && ARCHIVE_REF_LIST_FIELDS.has(field)) {
          entries.push({
            qid: node.qid,
            path: node.path,
            field,
            value: raw,
            refKind: "archive",
            locationKind: "frontmatter",
          });
        }
        continue;
      }
      if (!Array.isArray(raw)) {
        continue;
      }
      pushListEntries(node, field, raw);
    }
  }
  return entries;
}

function archiveIdsByWorkspace(index: Index): Record<string, Set<string>> {
  const archives: Record<string, Set<string>> = {};
  for (const node of Object.values(index.nodes)) {
    if (node.type !== "archive") {
      continue;
    }
    if (!archives[node.ws]) {
      archives[node.ws] = new Set();
    }
    archives[node.ws].add(node.id);
  }
  return archives;
}

function resolveTargetFilter(index: Index, target: string | undefined): { qids?: Set<string>; blocked?: FixPlanChange } {
  if (!target) {
    return {};
  }
  const normalized = target.toLowerCase();
  if (normalized.includes(":")) {
    if (index.nodes[normalized]) {
      return { qids: new Set([normalized]) };
    }
    return {
      blocked: {
        id: "refs.target.001",
        family: "refs",
        risk: "blocked",
        status: "blocked",
        reason: "target_not_found",
        paths: [],
        refs: [normalized],
        before: { target: normalized },
        apply_supported: false,
      },
    };
  }
  const matches = Object.values(index.nodes)
    .filter((node) => node.id === normalized)
    .map((node) => node.qid)
    .sort();
  if (matches.length === 1) {
    return { qids: new Set(matches) };
  }
  return {
    blocked: {
      id: "refs.target.001",
      family: "refs",
      risk: "blocked",
      status: "blocked",
      reason: matches.length === 0 ? "target_not_found" : "target_ambiguous",
      paths: [],
      refs: matches.length === 0 ? [normalized] : matches,
      before: { target: normalized, matches },
      apply_supported: false,
    },
  };
}

function readSelectedGoalState(root: string): { qid: string; id: string; ws: string; selected_at: string } | undefined | "malformed" {
  const filePath = path.join(root, ".mdkg", "state", "selected-goal.json");
  if (!fs.existsSync(filePath)) {
    return undefined;
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")) as Record<string, unknown>;
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
    return "malformed";
  } catch {
    return "malformed";
  }
}

function planSelectedGoalState(root: string, index: Index): FixPlanChange[] {
  const selected = readSelectedGoalState(root);
  if (!selected) {
    return [];
  }
  const statePath = ".mdkg/state/selected-goal.json";
  if (selected === "malformed") {
    return [
      {
        id: "refs.selected-goal.001",
        family: "refs",
        risk: "medium",
        status: "manual_review",
        reason: "selected_goal_state_malformed",
        paths: [statePath],
        refs: [],
        evidence: {
          location_kind: "selected_goal_state",
          state_path: statePath,
          confidence: "structured",
        },
        before: { state_path: statePath },
        after: { command_options: ["mdkg goal select <active-goal>", "mdkg goal clear"] },
        command_hint: "mdkg goal select <active-goal> or mdkg goal clear",
        apply_supported: false,
      },
    ];
  }
  const node = index.nodes[selected.qid];
  if (!node) {
    return [
      {
        id: "refs.selected-goal.001",
        family: "refs",
        risk: "medium",
        status: "manual_review",
        reason: "selected_goal_missing",
        paths: [statePath],
        refs: [selected.qid],
        evidence: {
          location_kind: "selected_goal_state",
          state_path: statePath,
          selected_goal: selected,
          confidence: "structured",
        },
        before: { selected_goal: selected },
        after: { command_options: ["mdkg goal select <active-goal>", "mdkg goal clear"] },
        command_hint: "mdkg goal select <active-goal> or mdkg goal clear",
        apply_supported: false,
      },
    ];
  }
  if (node.status === "done" || node.attributes.goal_state === "achieved") {
    return [
      {
        id: "refs.selected-goal.001",
        family: "refs",
        risk: "medium",
        status: "manual_review",
        reason: "selected_goal_achieved",
        paths: [statePath],
        refs: [selected.qid],
        evidence: {
          location_kind: "selected_goal_state",
          state_path: statePath,
          selected_goal: selected,
          goal_status: node.status ?? null,
          goal_state: node.attributes.goal_state ?? null,
          confidence: "structured",
        },
        before: { selected_goal: selected, goal_status: node.status ?? null, goal_state: node.attributes.goal_state ?? null },
        after: { command_options: ["mdkg goal select <active-goal>", "mdkg goal clear"] },
        command_hint: "mdkg goal select <active-goal> or mdkg goal clear",
        apply_supported: false,
      },
    ];
  }
  return [];
}

function planRefRepairs(root: string, target: string | undefined): FixPlannerResult {
  const config = loadConfig(root);
  const index = buildIndex(root, { ...config, index: { ...config.index, tolerant: true } }, { tolerant: true });
  const targetFilter = resolveTargetFilter(index, target);
  if (targetFilter.blocked) {
    return { proposed: [], blocked: [targetFilter.blocked] };
  }
  const externalWorkspaces = new Set(Object.keys(config.subgraphs ?? {}));
  const archiveIds = archiveIdsByWorkspace(index);
  const changes: FixPlanChange[] = [];
  const seen = new Set<string>();
  const pushChange = (change: FixPlanChange): void => {
    const key = `${change.reason}|${change.paths.join(",")}|${change.refs.join(",")}|${stableJson(change.before)}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    changes.push(change);
  };
  for (const entry of edgeEntries(index)) {
    if (targetFilter.qids && !targetFilter.qids.has(entry.qid)) {
      continue;
    }
    const targetNode = index.nodes[entry.target];
    const [targetWorkspace] = entry.target.split(":");
    if (!targetNode && targetWorkspace && externalWorkspaces.has(targetWorkspace)) {
      continue;
    }
    if (!targetNode) {
      pushChange({
        id: `refs.${String(changes.length + 1).padStart(3, "0")}`,
        family: "refs",
        risk: "medium",
        status: "manual_review",
        reason: "graph_ref_missing",
        paths: [entry.path],
        refs: [entry.qid, entry.target],
        evidence: {
          location_kind: "graph_edge",
          field: entry.field,
          source_qid: entry.qid,
          target: entry.target,
          confidence: "structured",
        },
        before: { field: entry.field, target: entry.target, location_kind: "graph_edge" },
        command_hint: `mdkg show ${entry.qid}`,
        apply_supported: false,
      });
      continue;
    }
    if (
      ["epic", "parent", "prev", "next"].includes(entry.field) &&
      !index.nodes[entry.qid]?.source?.imported &&
      targetNode.source?.imported
    ) {
      pushChange({
        id: `refs.${String(changes.length + 1).padStart(3, "0")}`,
        family: "refs",
        risk: "medium",
        status: "manual_review",
        reason: "graph_ref_read_only_subgraph_target",
        paths: [entry.path],
        refs: [entry.qid, entry.target],
        evidence: {
          location_kind: "graph_edge",
          field: entry.field,
          source_qid: entry.qid,
          target: entry.target,
          confidence: "structured",
        },
        before: { field: entry.field, target: entry.target, location_kind: "graph_edge" },
        command_hint: `mdkg show ${entry.qid}`,
        apply_supported: false,
      });
    }
  }
  for (const entry of frontmatterRefEntries(index, externalWorkspaces)) {
    if (targetFilter.qids && !targetFilter.qids.has(entry.qid)) {
      continue;
    }
    if (entry.refKind === "graph") {
      const target = entry.target;
      if (!target) {
        continue;
      }
      const [targetWorkspace] = target.split(":");
      if (targetWorkspace && externalWorkspaces.has(targetWorkspace)) {
        continue;
      }
      if (!index.nodes[target]) {
        pushChange({
          id: `refs.${String(changes.length + 1).padStart(3, "0")}`,
          family: "refs",
          risk: "medium",
          status: "manual_review",
          reason: "graph_ref_missing",
          paths: [entry.path],
          refs: [entry.qid, target],
          evidence: {
            location_kind: entry.locationKind,
            field: entry.field,
            value: entry.value,
            source_qid: entry.qid,
            target,
            confidence: "structured",
          },
          before: { field: entry.field, value: entry.value, target, location_kind: entry.locationKind },
          command_hint: `mdkg show ${entry.qid}`,
          apply_supported: false,
        });
      }
      continue;
    }
    const archiveId = archiveIdFromUri(entry.value);
    if (!archiveId || archiveIds[entry.qid.split(":", 1)[0]]?.has(archiveId)) {
      continue;
    }
    pushChange({
      id: `refs.${String(changes.length + 1).padStart(3, "0")}`,
      family: "refs",
      risk: "medium",
      status: "manual_review",
      reason: "archive_ref_missing",
      paths: [entry.path],
      refs: [entry.qid, entry.value],
      evidence: {
        location_kind: entry.locationKind,
        field: entry.field,
        value: entry.value,
        source_qid: entry.qid,
        archive_id: archiveId,
        confidence: "structured",
      },
      before: { field: entry.field, value: entry.value, archive_id: archiveId, location_kind: entry.locationKind },
      command_hint: `mdkg archive show ${entry.value}`,
      apply_supported: false,
    });
  }
  if (!target) {
    for (const selectedGoalChange of planSelectedGoalState(root, index)) {
      pushChange({
        ...selectedGoalChange,
        id: `refs.${String(changes.length + 1).padStart(3, "0")}`,
      });
    }
  }
  return { proposed: changes, blocked: [] };
}

function candidateDuplicateId(baseId: string, used: Set<string>): string {
  const match = /^([a-z]+)-([0-9]+)$/.exec(baseId);
  if (!match) {
    throw new UsageError(`duplicate id ${baseId} cannot be repaired automatically because it is not a canonical numeric id`);
  }
  const prefix = match[1];
  const start = Number.parseInt(match[2], 10) + 1;
  for (let index = start; ; index += 1) {
    const candidate = `${prefix}-${index}`;
    if (!used.has(candidate)) {
      used.add(candidate);
      return candidate;
    }
  }
}

function gitShow(root: string, refPath: string): string | undefined {
  const result = spawnSync("git", ["show", refPath], { cwd: root, encoding: "utf8" });
  if (result.status !== 0) {
    return undefined;
  }
  return result.stdout;
}

function runGitStrict(root: string, args: string[]): void {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
  if (result.status !== 0) {
    throw new UsageError(`git ${args.join(" ")} failed: ${(result.stderr || result.stdout).trim() || "unknown error"}`);
  }
}

function baseRefIdPaths(root: string, baseRef: string | undefined, files: string[], config: ReturnType<typeof loadConfig>) {
  const pathsById = new Map<string, Set<string>>();
  if (!baseRef) {
    return pathsById;
  }
  const templateSchemas = loadTemplateSchemas(root, config, ALLOWED_TYPES);
  for (const absPath of files) {
    const relativePath = rel(root, absPath);
    const content = gitShow(root, `${baseRef}:${relativePath}`);
    if (content === undefined) {
      continue;
    }
    try {
      const node = parseNode(content, absPath, {
        workStatusEnum: config.work.status_enum,
        priorityMin: config.work.priority_min,
        priorityMax: config.work.priority_max,
        templateSchemas,
      });
      if (!pathsById.has(node.id)) {
        pathsById.set(node.id, new Set());
      }
      pathsById.get(node.id)?.add(relativePath);
    } catch {
      continue;
    }
  }
  return pathsById;
}

function rewriteIdInNodeContent(content: string, fromId: string, toId: string): string {
  const lines = content.split(/\n/);
  let inFrontmatter = false;
  let frontmatterClosed = false;
  let idRewritten = false;
  const rewritten = lines.map((line, index) => {
    if (index === 0 && line.trim() === "---") {
      inFrontmatter = true;
      return line;
    }
    if (inFrontmatter && !frontmatterClosed && line.trim() === "---") {
      frontmatterClosed = true;
      inFrontmatter = false;
      return line;
    }
    if (inFrontmatter && !idRewritten && line === `id: ${fromId}`) {
      idRewritten = true;
      return `id: ${toId}`;
    }
    return line.split(fromId).join(toId);
  });
  if (!idRewritten) {
    throw new UsageError(`unable to rewrite id ${fromId}; frontmatter id line not found`);
  }
  return rewritten.join("\n");
}

function isInsideRoot(root: string, filePath: string): boolean {
  const realRoot = `${relativeRoot(root)}${path.sep}`;
  return path.resolve(filePath).startsWith(realRoot);
}

function replaceIdInRelativePath(relativePath: string, fromId: string, toId: string, usedPaths: Set<string>): string {
  const parsed = path.posix.parse(relativePath);
  const baseName = parsed.base.includes(fromId)
    ? parsed.base.replace(fromId, toId)
    : `${toId}-${parsed.base}`;
  let candidate = path.posix.join(parsed.dir, baseName);
  if (!usedPaths.has(candidate)) {
    usedPaths.add(candidate);
    return candidate;
  }
  for (let index = 2; ; index += 1) {
    const suffixed = path.posix.join(parsed.dir, `${parsed.name}-${toId}-${index}${parsed.ext}`);
    if (!usedPaths.has(suffixed)) {
      usedPaths.add(suffixed);
      return suffixed;
    }
  }
}

type GitStageEntry = {
  mode: string;
  object: string;
  stage: 1 | 2 | 3;
  path: string;
};

function gitConflictStages(root: string): Map<string, GitStageEntry[]> {
  const output = runGit(root, ["ls-files", "-u", "--", ".mdkg"]) ?? "";
  const groups = new Map<string, GitStageEntry[]>();
  for (const line of output.split(/\r?\n/).filter(Boolean)) {
    const match = /^([0-7]+) ([0-9a-f]+) ([123])\t(.+)$/.exec(line);
    if (!match || !match[4].endsWith(".md")) {
      continue;
    }
    const entry: GitStageEntry = {
      mode: match[1],
      object: match[2],
      stage: Number.parseInt(match[3], 10) as 1 | 2 | 3,
      path: match[4],
    };
    groups.set(entry.path, [...(groups.get(entry.path) ?? []), entry]);
  }
  return groups;
}

function workspaceAliasForPath(root: string, config: ReturnType<typeof loadConfig>, relativePath: string): string | undefined {
  const absPath = path.resolve(root, relativePath);
  for (const alias of Object.keys(config.workspaces).sort()) {
    const entry = config.workspaces[alias];
    if (!entry.enabled) {
      continue;
    }
    const wsRoot = path.resolve(root, entry.path, entry.mdkg_dir);
    if (absPath === wsRoot || absPath.startsWith(`${wsRoot}${path.sep}`)) {
      return alias;
    }
  }
  return undefined;
}

function filesContaining(root: string, files: string[], needle: string): string[] {
  return files
    .filter((filePath) => {
      try {
        return fs.readFileSync(filePath, "utf8").includes(needle);
      } catch {
        return false;
      }
    })
    .map((filePath) => rel(root, filePath))
    .sort();
}

function countOccurrences(value: string, needle: string): number {
  if (needle.length === 0) {
    return 0;
  }
  let count = 0;
  let offset = 0;
  for (;;) {
    const index = value.indexOf(needle, offset);
    if (index === -1) {
      return count;
    }
    count += 1;
    offset = index + needle.length;
  }
}

function referenceRewriteItems(root: string, files: string[], from: string, to: string) {
  return files
    .map((filePath) => {
      try {
        const replacementCount = countOccurrences(fs.readFileSync(filePath, "utf8"), from);
        if (replacementCount === 0) {
          return undefined;
        }
        return {
          from,
          to,
          path: rel(root, filePath),
          location_kind: "markdown_or_frontmatter_text",
          confidence: "manual_review",
          replacement_count: replacementCount,
        };
      } catch {
        return undefined;
      }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .sort((a, b) => a.path.localeCompare(b.path));
}

function planGitStageDuplicateIdRepairs(
  root: string,
  target: string | undefined,
  config: ReturnType<typeof loadConfig>,
  usedIdsByAlias: Map<string, Set<string>>,
  usedPaths: Set<string>,
  startIndex: number
): { proposed: FixPlanChange[]; matchedTarget: boolean } {
  const templateSchemas = loadTemplateSchemas(root, config, ALLOWED_TYPES);
  const proposed: FixPlanChange[] = [];
  let matchedTarget = false;
  for (const [relativePath, stages] of [...gitConflictStages(root).entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const ours = stages.find((entry) => entry.stage === 2);
    const theirs = stages.find((entry) => entry.stage === 3);
    if (!ours || !theirs) {
      continue;
    }
    const alias = workspaceAliasForPath(root, config, relativePath);
    if (!alias) {
      continue;
    }
    const oursContent = gitShow(root, `:2:${relativePath}`);
    const theirsContent = gitShow(root, `:3:${relativePath}`);
    if (oursContent === undefined || theirsContent === undefined) {
      continue;
    }
    try {
      const absPath = path.resolve(root, relativePath);
      const oursNode = parseNode(oursContent, absPath, {
        workStatusEnum: config.work.status_enum,
        priorityMin: config.work.priority_min,
        priorityMax: config.work.priority_max,
        templateSchemas,
      });
      const theirsNode = parseNode(theirsContent, absPath, {
        workStatusEnum: config.work.status_enum,
        priorityMin: config.work.priority_min,
        priorityMax: config.work.priority_max,
        templateSchemas,
      });
      if (oursNode.id !== theirsNode.id) {
        continue;
      }
      const duplicateId = oursNode.id;
      const qid = `${alias}:${duplicateId}`;
      const targetMatches = !target || target.toLowerCase() === duplicateId || target.toLowerCase() === qid || target === relativePath;
      if (!targetMatches) {
        continue;
      }
      matchedTarget = true;
      const usedIds = usedIdsByAlias.get(alias) ?? new Set<string>();
      usedIds.add(oursNode.id);
      usedIds.add(theirsNode.id);
      usedIdsByAlias.set(alias, usedIds);
      const candidate = candidateDuplicateId(duplicateId, usedIds);
      const candidatePath = replaceIdInRelativePath(relativePath, duplicateId, candidate, usedPaths);
      proposed.push({
        id: `ids.${String(startIndex + proposed.length + 1).padStart(3, "0")}`,
        family: "ids",
        risk: "high",
        status: "planned",
        reason: "git_stage_duplicate_id",
        paths: [relativePath, candidatePath],
        refs: [qid, `${alias}:${candidate}`].sort(),
        evidence: {
          conflict_kind: "git_index_unresolved_duplicate_id",
          workspace: alias,
          duplicate_id: duplicateId,
          conflict_path: relativePath,
          canonical_stage: 2,
          duplicate_stage: 3,
          current_blob: ours.object,
          incoming_blob: theirs.object,
          deterministic_rule:
            "keep stage 2 at the conflicted path, rewrite stage 3 to the next unused canonical numeric id and path, then git add both files",
        },
        before: {
          duplicate_id: duplicateId,
          workspace: alias,
          conflict_path: relativePath,
          canonical_stage: 2,
          duplicate_stage: 3,
          current_blob: ours.object,
          incoming_blob: theirs.object,
        },
        after: {
          candidate_id: candidate,
          candidate_qid: `${alias}:${candidate}`,
          candidate_path: candidatePath,
          canonical_path: relativePath,
          collision_free: true,
          deterministic_rule:
            "keep stage 2 at the conflicted path, rewrite stage 3 to the next unused canonical numeric id and path, then git add both files",
        },
        command_hint: `mdkg fix ids --target ${duplicateId} --apply --json`,
        apply_supported: true,
        apply_kind: "git_stage_duplicate_id_rewrite",
      });
    } catch {
      continue;
    }
  }
  return { proposed, matchedTarget };
}

function planDuplicateIdRepairs(root: string, target: string | undefined, baseRef: string | undefined): FixPlannerResult {
  const config = loadConfig(root);
  const templateSchemas = loadTemplateSchemas(root, config, ALLOWED_TYPES);
  const docsByAlias = listWorkspaceDocFilesByAlias(root, config);
  const proposed: FixPlanChange[] = [];
  const blocked: FixPlanChange[] = [];
  const usedIdsByAlias = new Map<string, Set<string>>();
  const usedPaths = new Set<string>();
  let matchedTarget = !target;

  for (const alias of Object.keys(docsByAlias).sort()) {
    const records: Array<{ id: string; qid: string; path: string; absPath: string }> = [];
    const usedIds = new Set<string>();
    const files = docsByAlias[alias].sort();
    const basePathsById = baseRefIdPaths(root, baseRef, files, config);
    for (const filePath of files) {
      usedPaths.add(rel(root, filePath));
      if (path.basename(filePath) === "core.md" && path.basename(path.dirname(filePath)) === "core") {
        continue;
      }
      try {
        const node = parseNode(fs.readFileSync(filePath, "utf8"), filePath, {
          workStatusEnum: config.work.status_enum,
          priorityMin: config.work.priority_min,
          priorityMax: config.work.priority_max,
          templateSchemas,
        });
        records.push({
          id: node.id,
          qid: `${alias}:${node.id}`,
          path: rel(root, filePath),
          absPath: filePath,
        });
        usedIds.add(node.id);
      } catch {
        continue;
      }
    }
    usedIdsByAlias.set(alias, usedIds);
    const groups = new Map<string, Array<{ id: string; qid: string; path: string; absPath: string }>>();
    for (const record of records) {
      groups.set(record.id, [...(groups.get(record.id) ?? []), record]);
    }
    for (const [id, groupRaw] of [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))) {
      const group = groupRaw.sort((a, b) => a.path.localeCompare(b.path));
      if (group.length < 2) {
        continue;
      }
      const targetMatches =
        !target ||
        target.toLowerCase() === id ||
        group.some((record) => record.qid === target.toLowerCase() || record.path === target);
      if (!targetMatches) {
        continue;
      }
      matchedTarget = true;
      const basePaths = basePathsById.get(id);
      const baseCanonical = basePaths ? group.find((record) => basePaths.has(record.path)) : undefined;
      const canonical = baseCanonical ?? group[0];
      const referencePaths = filesContaining(root, files, id);
      const duplicateRecords = group.filter((record) => record.path !== canonical.path);
      const groupPaths = group.map((record) => record.path).sort();
      const deterministicRule = baseCanonical
        ? "keep the path that already existed at --base-ref unchanged; propose the next unused canonical numeric id for each other path"
        : "keep the lexicographically first path unchanged; propose the next unused canonical numeric id for each later path";
      for (const duplicate of duplicateRecords) {
        const candidate = candidateDuplicateId(id, usedIds);
        const selfReferenceRewrites = referenceRewriteItems(root, [duplicate.absPath], id, candidate);
        const externalReferenceRewrites = referenceRewriteItems(
          root,
          files.filter((filePath) => filePath !== duplicate.absPath),
          id,
          candidate
        );
        const safeReferenceRewrites = baseRef
          ? externalReferenceRewrites.filter((item) => gitShow(root, `${baseRef}:${item.path}`) === undefined)
          : [];
        const safeReferencePaths = new Set(safeReferenceRewrites.map((item) => item.path));
        const ambiguousReferenceRewrites = externalReferenceRewrites.filter((item) => !safeReferencePaths.has(item.path));
        proposed.push({
          id: `ids.${String(proposed.length + 1).padStart(3, "0")}`,
          family: "ids",
          risk: "high",
          status: "planned",
          reason: "duplicate_id",
          paths: [duplicate.path],
          refs: Array.from(new Set([canonical.qid, duplicate.qid])).sort(),
          evidence: {
            conflict_kind: "duplicate_local_id",
            branch_merge_suspected: true,
            workspace: alias,
            base_ref: baseRef ?? null,
            base_ref_canonical: Boolean(baseCanonical),
            duplicate_id: id,
            group_size: group.length,
            group_paths: groupPaths,
            canonical: {
              qid: canonical.qid,
              path: canonical.path,
            },
            duplicate: {
              qid: duplicate.qid,
              path: duplicate.path,
            },
            deterministic_rule: deterministicRule,
          },
          before: {
            duplicate_id: id,
            workspace: alias,
            base_ref: baseRef ?? null,
            canonical_path: canonical.path,
            duplicate_path: duplicate.path,
            duplicate_group: {
              canonical_path: canonical.path,
              duplicate_paths: duplicateRecords.map((record) => record.path).sort(),
              all_paths: groupPaths,
            },
          },
          after: {
            candidate_id: candidate,
            candidate_qid: `${alias}:${candidate}`,
            collision_free: true,
            deterministic_rule: deterministicRule,
            reference_paths: referencePaths,
            self_reference_rewrites: selfReferenceRewrites,
            safe_reference_rewrites: safeReferenceRewrites,
            ambiguous_reference_rewrites: ambiguousReferenceRewrites,
            reference_rewrite_plan: [...selfReferenceRewrites, ...safeReferenceRewrites, ...ambiguousReferenceRewrites].sort((a, b) =>
              a.path.localeCompare(b.path)
            ),
          },
          command_hint: `mdkg fix apply --family ids --target ${id}${baseRef ? ` --base-ref ${baseRef}` : ""} --json`,
          apply_supported: true,
          apply_kind: "duplicate_id_rewrite",
        });
      }
    }
  }

  const stageRepairs = planGitStageDuplicateIdRepairs(
    root,
    target,
    config,
    usedIdsByAlias,
    usedPaths,
    proposed.length
  );
  proposed.push(...stageRepairs.proposed);
  if (stageRepairs.matchedTarget) {
    matchedTarget = true;
  }

  if (!matchedTarget && target) {
    blocked.push({
      id: "ids.target.001",
      family: "ids",
      risk: "blocked",
      status: "blocked",
      reason: "target_not_found",
      paths: [],
      refs: [target.toLowerCase()],
      before: { target: target.toLowerCase() },
      apply_supported: false,
    });
  }

  return { proposed, blocked };
}

function sortChanges(changes: FixPlanChange[]): FixPlanChange[] {
  return [...changes].sort((a, b) => {
    const family = a.family.localeCompare(b.family);
    if (family !== 0) {
      return family;
    }
    const pathCompare = (a.paths[0] ?? "").localeCompare(b.paths[0] ?? "");
    if (pathCompare !== 0) {
      return pathCompare;
    }
    const id = a.id.localeCompare(b.id);
    if (id !== 0) {
      return id;
    }
    return a.reason.localeCompare(b.reason);
  });
}

function riskCounts(changes: FixPlanChange[]): Record<FixRisk, number> {
  return {
    low: changes.filter((change) => change.risk === "low").length,
    medium: changes.filter((change) => change.risk === "medium").length,
    high: changes.filter((change) => change.risk === "high").length,
    blocked: changes.filter((change) => change.risk === "blocked").length,
  };
}

export function collectFixPlan(options: FixPlanCommandOptions) {
  const family = normalizeFamily(options.family);
  const selected = selectedFamilies(family);
  const root = relativeRoot(options.root);
  const indexRepairs = selected.includes("index") ? planIndexRepairs(root) : { proposed: [], blocked: [] };
  const refRepairs = selected.includes("refs") ? planRefRepairs(root, options.target) : { proposed: [], blocked: [] };
  const idRepairs = selected.includes("ids")
    ? planDuplicateIdRepairs(root, options.target, options.baseRef)
    : { proposed: [], blocked: [] };
  const proposedChanges = sortChanges([...indexRepairs.proposed, ...refRepairs.proposed, ...idRepairs.proposed]);
  const blockedChanges = sortChanges([...indexRepairs.blocked, ...refRepairs.blocked, ...idRepairs.blocked]);
  const supportedApplyCount = proposedChanges.filter((change) => change.apply_supported).length;
  const unsupportedApplyCount = proposedChanges.filter((change) => !change.apply_supported).length;
  const body = {
    action: "fix.plan",
    schema_version: 1,
    root,
    family,
    target: options.target ?? null,
    base_ref: options.baseRef ?? null,
    dirty: collectDirtyState(root),
    families: emptyFamilySummaries(selected).map((entry) => ({
      ...entry,
      proposed_count: proposedChanges.filter((change) => change.family === entry.family).length,
      blocked_count: blockedChanges.filter((change) => change.family === entry.family).length,
    })),
    risk_counts: riskCounts([...proposedChanges, ...blockedChanges]),
    proposed_changes: proposedChanges,
    blocked_changes: blockedChanges,
    summary: {
      selected_families: selected,
      proposed_count: proposedChanges.length,
      blocked_count: blockedChanges.length,
      apply_supported: supportedApplyCount > 0,
      apply_deferred: unsupportedApplyCount > 0 || blockedChanges.length > 0,
      supported_apply_count: supportedApplyCount,
      unsupported_apply_count: unsupportedApplyCount,
      message:
        supportedApplyCount > 0
          ? "ids-family duplicate-id repairs can be applied with mdkg fix apply --family ids or mdkg fix ids --apply"
          : "this command is review-only for the selected findings and writes no files",
    },
  };
  const planHash = sha256(body);
  return {
    ...body,
    ok: true,
    generated_at: new Date().toISOString(),
    plan_hash: planHash,
    plan_id: `fix-plan-${planHash.slice("sha256:".length, "sha256:".length + 16)}`,
  };
}

function normalizeApplyFamily(value: string | undefined): "ids" {
  const family = normalizeFamily(value ?? "ids");
  if (family !== "ids") {
    throw new UsageError("fix apply currently supports only --family ids");
  }
  return "ids";
}

function applyDuplicateIdChange(root: string, change: FixPlanChange): FixApplyChange {
  if (change.family !== "ids" || change.reason !== "duplicate_id" || change.apply_kind !== "duplicate_id_rewrite") {
    throw new UsageError(`unsupported fix apply change ${change.id}`);
  }
  const relativePath = change.paths[0];
  if (!relativePath) {
    throw new UsageError(`fix apply change ${change.id} is missing a path`);
  }
  const absPath = path.resolve(root, relativePath);
  if (!isInsideRoot(root, absPath)) {
    throw new UsageError(`fix apply refused path outside repo: ${relativePath}`);
  }
  const before = change.before as { duplicate_id?: unknown };
  const after = change.after as { candidate_id?: unknown };
  const fromId = typeof before.duplicate_id === "string" ? before.duplicate_id : undefined;
  const toId = typeof after.candidate_id === "string" ? after.candidate_id : undefined;
  if (!fromId || !toId) {
    throw new UsageError(`fix apply change ${change.id} is missing duplicate id rewrite details`);
  }
  const current = fs.readFileSync(absPath, "utf8");
  const rewritten = rewriteIdInNodeContent(current, fromId, toId);
  if (rewritten === current) {
    throw new UsageError(`fix apply change ${change.id} produced no file changes`);
  }
  atomicWriteFile(absPath, rewritten);
  const afterDetails = change.after as { safe_reference_rewrites?: unknown };
  const safeReferenceRewrites = Array.isArray(afterDetails.safe_reference_rewrites)
    ? (afterDetails.safe_reference_rewrites as Array<{ path?: unknown; from?: unknown; to?: unknown }>)
    : [];
  const touchedPaths = new Set<string>([relativePath]);
  for (const rewrite of safeReferenceRewrites) {
    if (typeof rewrite.path !== "string" || typeof rewrite.from !== "string" || typeof rewrite.to !== "string") {
      continue;
    }
    const rewriteAbs = path.resolve(root, rewrite.path);
    if (!isInsideRoot(root, rewriteAbs) || !fs.existsSync(rewriteAbs)) {
      continue;
    }
    const rewriteCurrent = fs.readFileSync(rewriteAbs, "utf8");
    const rewriteNext = rewriteCurrent.split(rewrite.from).join(rewrite.to);
    if (rewriteNext !== rewriteCurrent) {
      atomicWriteFile(rewriteAbs, rewriteNext);
      touchedPaths.add(rewrite.path);
    }
  }
  return {
    id: change.id,
    family: "ids",
    reason: change.reason,
    apply_kind: "duplicate_id_rewrite",
    path: relativePath,
    touched_paths: Array.from(touchedPaths).sort(),
    refs: change.refs,
    before: change.before,
    after: change.after,
  };
}

function applyGitStageDuplicateIdChange(root: string, change: FixPlanChange): FixApplyChange {
  if (change.family !== "ids" || change.reason !== "git_stage_duplicate_id" || change.apply_kind !== "git_stage_duplicate_id_rewrite") {
    throw new UsageError(`unsupported git-stage fix apply change ${change.id}`);
  }
  const before = change.before as {
    duplicate_id?: unknown;
    conflict_path?: unknown;
    canonical_stage?: unknown;
    duplicate_stage?: unknown;
  };
  const after = change.after as { candidate_id?: unknown; candidate_path?: unknown; canonical_path?: unknown };
  const fromId = typeof before.duplicate_id === "string" ? before.duplicate_id : undefined;
  const conflictPath = typeof before.conflict_path === "string" ? before.conflict_path : undefined;
  const candidateId = typeof after.candidate_id === "string" ? after.candidate_id : undefined;
  const candidatePath = typeof after.candidate_path === "string" ? after.candidate_path : undefined;
  if (!fromId || !conflictPath || !candidateId || !candidatePath) {
    throw new UsageError(`fix apply change ${change.id} is missing git-stage rewrite details`);
  }
  const canonicalContent = gitShow(root, `:2:${conflictPath}`);
  const duplicateContent = gitShow(root, `:3:${conflictPath}`);
  if (canonicalContent === undefined || duplicateContent === undefined) {
    throw new UsageError(`fix apply change ${change.id} could not read Git conflict stages for ${conflictPath}`);
  }
  const canonicalAbs = path.resolve(root, conflictPath);
  const candidateAbs = path.resolve(root, candidatePath);
  if (!isInsideRoot(root, canonicalAbs) || !isInsideRoot(root, candidateAbs)) {
    throw new UsageError(`fix apply refused path outside repo while resolving ${conflictPath}`);
  }
  const rewrittenDuplicate = rewriteIdInNodeContent(duplicateContent, fromId, candidateId);
  atomicWriteFile(canonicalAbs, canonicalContent);
  atomicWriteFile(candidateAbs, rewrittenDuplicate);
  runGitStrict(root, ["add", "--", conflictPath, candidatePath]);
  return {
    id: change.id,
    family: "ids",
    reason: change.reason,
    apply_kind: "git_stage_duplicate_id_rewrite",
    path: conflictPath,
    touched_paths: [conflictPath, candidatePath],
    refs: change.refs,
    before: change.before,
    after: change.after,
  };
}

export function collectFixApply(options: FixApplyCommandOptions) {
  const family = normalizeApplyFamily(options.family);
  const root = relativeRoot(options.root);
  const config = loadConfig(root);
  return withMutationLock(root, config.index.lock_timeout_ms, () => {
    const plan = collectFixPlan({ ...options, root, family });
    const applicable = plan.proposed_changes.filter((change) => change.apply_supported);
    const unsupported = plan.proposed_changes.filter((change) => !change.apply_supported);
    if (plan.blocked_changes.length > 0) {
      throw new UsageError("fix apply refused because the plan contains blocked changes");
    }
    if (applicable.length === 0) {
      throw new UsageError("fix apply found no supported ids-family changes to apply");
    }
    const appliedChanges = applicable.map((change) =>
      change.apply_kind === "git_stage_duplicate_id_rewrite"
        ? applyGitStageDuplicateIdChange(root, change)
        : applyDuplicateIdChange(root, change)
    );
    const indexReceipt = rebuildDerivedIndexCaches({ root, tolerant: true });
    const body = {
      action: "fix.apply",
      ok: true,
      schema_version: 1,
      root,
      family,
      target: options.target ?? null,
      base_ref: options.baseRef ?? null,
      plan_id: plan.plan_id,
      plan_hash: plan.plan_hash,
      applied_changes: appliedChanges,
      blocked_changes: plan.blocked_changes,
      unsupported_changes: unsupported,
      touched_paths: Array.from(new Set(appliedChanges.flatMap((change) => change.touched_paths))).sort(),
      ambiguous_reference_rewrites: applicable.flatMap((change) => {
        const after = change.after as { ambiguous_reference_rewrites?: unknown };
        return Array.isArray(after.ambiguous_reference_rewrites) ? after.ambiguous_reference_rewrites : [];
      }),
      index: {
        rebuilt: true,
        paths: {
          nodes: rel(root, indexReceipt.paths.nodes),
          skills: rel(root, indexReceipt.paths.skills),
          capabilities: rel(root, indexReceipt.paths.capabilities),
          subgraphs: rel(root, indexReceipt.paths.subgraphs),
          sqlite: indexReceipt.paths.sqlite ? rel(root, indexReceipt.paths.sqlite) : null,
        },
      },
      summary: {
        applied_count: appliedChanges.length,
        unsupported_count: unsupported.length,
        blocked_count: plan.blocked_changes.length,
        message:
          unsupported.length > 0
            ? "applied supported ids-family changes; unsupported findings remain review-only"
            : "applied supported ids-family duplicate-id repairs",
      },
    };
    return {
      ...body,
      generated_at: new Date().toISOString(),
      receipt_hash: sha256(body),
    };
  });
}

export function runFixPlanCommand(options: FixPlanCommandOptions): void {
  const payload = collectFixPlan(options);
  if (options.json) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }
  console.log("fix plan");
  console.log(`plan_id: ${payload.plan_id}`);
  console.log(`plan_hash: ${payload.plan_hash}`);
  console.log(`family: ${payload.family}`);
  console.log(`proposed_changes: ${payload.proposed_changes.length}`);
  console.log(`blocked_changes: ${payload.blocked_changes.length}`);
  console.log(`apply_supported: ${payload.summary.apply_supported}`);
  console.log("note: use --json for the machine-readable receipt");
}

export function runFixApplyCommand(options: FixApplyCommandOptions): void {
  const payload = collectFixApply(options);
  if (options.json) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }
  console.log("fix apply");
  console.log(`receipt_hash: ${payload.receipt_hash}`);
  console.log(`family: ${payload.family}`);
  console.log(`applied_changes: ${payload.applied_changes.length}`);
  console.log(`touched_paths: ${payload.touched_paths.join(", ")}`);
}

export function runFixIdsCommand(options: FixApplyCommandOptions & { apply?: boolean }): void {
  if (options.apply) {
    runFixApplyCommand({ ...options, family: "ids" });
    return;
  }
  runFixPlanCommand({ ...options, family: "ids" });
}
