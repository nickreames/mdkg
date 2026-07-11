import crypto from "crypto";
import fs from "fs";
import path from "path";
import { loadConfig, Config } from "../core/config";
import { formatFrontmatter, FrontmatterValue, parseFrontmatter } from "../graph/frontmatter";
import { buildIndex, Index, IndexNode } from "../graph/indexer";
import { loadIndex } from "../graph/index_cache";
import { groupLoopRefBindings, parseLoopRefBindings } from "../graph/loop_bindings";
import { readNodeBody } from "../graph/node_body";
import { writeDerivedIndexes } from "../graph/reindex";
import { isSqliteBackend, reserveSqliteNumericId } from "../graph/sqlite_index";
import { formatDate } from "../util/date";
import { validatePortableOrUriRef } from "../util/refs";
import { formatResolveError, resolveQid } from "../util/qid";
import { writeFileExclusive } from "../util/atomic";
import { withMutationLock } from "../util/lock";
import { NotFoundError, UsageError } from "../util/errors";
import { formatNodeCard } from "./node_card";
import { toNodeDetailJson, toNodeSummaryJson, writeJson } from "./query_output";
import { appendAutomaticEvent } from "./event_support";

type MaterializationMode = "default_children" | "planning_only" | "manual";

type LoopCommandBaseOptions = {
  root: string;
  ws?: string;
  json?: boolean;
  noCache?: boolean;
  noReindex?: boolean;
};

export type LoopListCommandOptions = LoopCommandBaseOptions & {
  templates?: boolean;
};

export type LoopShowCommandOptions = LoopCommandBaseOptions & {
  id: string;
  metaOnly?: boolean;
};

export type LoopForkCommandOptions = LoopCommandBaseOptions & {
  template: string;
  scope: string;
  title?: string;
  materializationMode?: MaterializationMode;
  planningOnly?: boolean;
  noChildren?: boolean;
  dryRun?: boolean;
  runId?: string;
  now?: Date;
};

export type LoopPlanCommandOptions = LoopCommandBaseOptions & {
  id: string;
};

export type LoopNextCommandOptions = LoopCommandBaseOptions & {
  id: string;
};

export type LoopRunsCommandOptions = LoopCommandBaseOptions & {
  id: string;
};

type LoopTemplate = {
  kind: "node" | "seed";
  ref: string;
  title: string;
  path: string;
  hash: string;
  frontmatter: Record<string, FrontmatterValue>;
  body: string;
  id?: string;
  qid?: string;
  slug?: string;
};

type CreatedNodeReceipt = {
  workspace: string;
  id: string;
  qid: string;
  path: string;
  type: string;
  title: string;
  status: string;
  priority: number;
};

type PlannedNode = CreatedNodeReceipt & {
  frontmatter: Record<string, FrontmatterValue>;
  body: string;
  absolutePath: string;
};

type ScopeResolution = {
  input: string;
  refs: string[];
  context_refs: string[];
  relates: string[];
  warnings: string[];
};

type LoopLaneState = "completed" | "blocked" | "waiting" | "waived" | "actionable" | "missing";

type LoopTemplateProvenance = {
  state: "current" | "stale" | "missing_template" | "unknown";
  template_ref?: string;
  stored_path?: string;
  stored_hash?: string;
  current_path?: string;
  current_hash?: string;
  path_changed: boolean;
  warning?: string;
};

type LoopReadinessProjection = {
  identity: {
    id: string;
    qid: string;
    title: string;
    status?: string;
    mode?: string;
    role?: string;
  };
  scope: {
    refs: string[];
    description?: string;
  };
  template_lineage: {
    template_refs: string[];
    materialization_mode?: string;
    provenance: LoopTemplateProvenance;
  };
  questions: {
    pre_run_questions: string[];
    unanswered_pre_run_questions: string[];
    items: Array<{
      id: string;
      state: "answered" | "unanswered";
      decision_refs: string[];
      binding_source: "explicit" | "legacy_unambiguous" | "none";
    }>;
  };
  approvals: {
    pre_approved_actions: string[];
    approval_gated_actions: string[];
    required_actions: string[];
    requested_actions: string[];
    optional_actions: string[];
    prohibited_actions: string[];
    pending_approval_actions: string[];
    decision_refs: string[];
    approval_refs: string[];
    items: Array<{
      id: string;
      required: boolean;
      requested: boolean;
      state: "approved" | "pending" | "optional";
      approval_refs: string[];
      binding_source: "explicit" | "legacy_unambiguous" | "none";
    }>;
  };
  references: {
    child_refs: string[];
    run_refs: string[];
    output_refs: string[];
    evidence_refs: string[];
    evaluation_refs: string[];
    lane_waiver_refs: string[];
    question_answer_refs: string[];
    action_approval_refs: string[];
    evidence_lane_refs: string[];
    lane_waiver_decision_refs: string[];
    lane_waiver_approval_refs: string[];
  };
  lanes: {
    children: Array<{
      ref: string;
      qid?: string;
      type?: string;
      title?: string;
      status?: string;
      state: LoopLaneState;
      blocked_by: string[];
    }>;
    evidence: Array<{
      name: string;
      state: LoopLaneState;
      evidence_refs: string[];
      waiver_refs: string[];
      waiver_decision_refs: string[];
      waiver_approval_refs: string[];
      binding_source: "explicit" | "legacy_unambiguous" | "none";
    }>;
  };
  blockers: {
    loop_blocked_by: string[];
    blocked_children: string[];
    waiting_children: string[];
  };
  pending_materialization: string[];
  invalid_bindings: string[];
  next_actions: string[];
  closeout: {
    ready: boolean;
    state: "ready" | "not_ready";
    missing: string[];
    counts: Record<LoopLaneState, number>;
  };
};

type LoopNextSelection = {
  kind: "child" | "lane" | "recovery" | "closeout";
  ref?: string;
  qid?: string;
  title?: string;
  state?: LoopLaneState;
  reason: string;
};

const LOOP_MATERIALIZATION_MODES = new Set(["default_children", "planning_only", "manual"]);
const CHILD_NODE_SPECS = [
  { type: "spike", prefix: "spike", titleSuffix: "grounding spike" },
  { type: "task", prefix: "task", titleSuffix: "execution plan" },
  { type: "test", prefix: "test", titleSuffix: "validation contract" },
] as const;

function blockerContinuationGuidance(policyValue?: FrontmatterValue): Record<string, unknown> {
  const policy = typeof policyValue === "string" && policyValue.trim().length > 0
    ? policyValue
    : "spike_proposal_recommendation_continue";
  return {
    policy,
    branch_blocker_steps: [
      "identify the blocked branch and affected goals/subgoals",
      "record blocker evidence on affected nodes",
      "create or request a source-grounded spike when uncertainty is material",
      "request web grounding in the spike when current external facts are required",
      "create or request a proposal for non-trivial blockers",
      "require at least three viable proposal options",
      "record one recommended path and rationale",
      "mark whether the blocked branch is deferred, waiting on approval, waiting on external state, or ready for the recommendation",
      "continue other useful scoped work when safety and ownership rules allow",
    ],
    spike: {
      required_when: "material uncertainty needs source-grounded or web-grounded investigation",
      grounding: ["source", "web_when_current_external_facts_are_required"],
    },
    proposal: {
      required_when: "the blocker is non-trivial or has multiple plausible paths",
      minimum_viable_options: 3,
      requires_recommended_path: true,
    },
    blocker_evidence: {
      required_on_affected_nodes: true,
      target_nodes: ["goal", "subgoal", "task", "loop branch"],
    },
    continue_strategy: "scan remaining loop scope for useful work that advances the definition of done",
    whole_loop_blocked_threshold: "repeated or global blockers that prevent meaningful progress across remaining scope",
  };
}

function blockerContinuationMarkdown(policyValue?: FrontmatterValue): string {
  const guidance = blockerContinuationGuidance(policyValue);
  return [
    "# Blocker Continuation Guidance",
    "",
    `Policy: ${String(guidance.policy)}`,
    "",
    "- Record blocker evidence on affected goals, subgoals, tasks, or loop branches.",
    "- Create or request a source-grounded spike when uncertainty is material.",
    "- Ask the executing agent or harness to use web grounding when current external facts are required.",
    "- Create or request a proposal for non-trivial blockers with at least three viable paths.",
    "- Record one recommended path and the rationale for choosing it.",
    "- Continue other useful scoped work when safety and ownership rules allow.",
    "- Reserve whole-loop blocked state for repeated or global blockers that prevent meaningful progress across the remaining scope.",
  ].join("\n");
}

function normalizeWorkspace(config: Config, value?: string): string {
  const ws = (value ?? "root").toLowerCase();
  if (ws === "all") {
    throw new UsageError("--ws all is not valid for loop mutation commands");
  }
  if (!config.workspaces[ws]) {
    throw new NotFoundError(`workspace not found: ${ws}`);
  }
  return ws;
}

function toPosix(value: string): string {
  return value.split(path.sep).join("/");
}

function slugifyTitle(title: string): string {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
  if (!slug) {
    return "loop";
  }
  const maxLen = 80;
  return slug.length > maxLen ? slug.slice(0, maxLen).replace(/-+$/g, "") : slug;
}

function maxIdForPrefix(index: Record<string, { ws: string; id: string }>, ws: string, prefix: string): number {
  let max = 0;
  const pattern = new RegExp(`^${prefix}-(\\d+)$`);
  for (const node of Object.values(index)) {
    if (node.ws !== ws) {
      continue;
    }
    const match = pattern.exec(node.id);
    if (!match) {
      continue;
    }
    const parsed = Number.parseInt(match[1] ?? "", 10);
    if (Number.isInteger(parsed) && parsed > max) {
      max = parsed;
    }
  }
  return max;
}

function idNumber(id: string): number {
  const match = /-(\d+)$/.exec(id);
  return match ? Number.parseInt(match[1] ?? "0", 10) : 0;
}

function createIdAllocator(
  root: string,
  config: Config,
  index: Index,
  ws: string,
  reserve: boolean
): (prefix: string) => string {
  const maxByPrefix = new Map<string, number>();
  return (prefix: string): string => {
    const currentMax = maxByPrefix.get(prefix) ?? maxIdForPrefix(index.nodes, ws, prefix);
    const reserved = reserve && isSqliteBackend(config)
      ? reserveSqliteNumericId({ root, config, ws, prefix, currentMax })
      : undefined;
    const id = reserved ?? `${prefix}-${currentMax + 1}`;
    maxByPrefix.set(prefix, Math.max(currentMax, idNumber(id)));
    return id;
  };
}

function frontmatterString(
  frontmatter: Record<string, FrontmatterValue>,
  key: string,
  fallback: string
): string {
  const value = frontmatter[key];
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function frontmatterList(frontmatter: Record<string, FrontmatterValue>, key: string): string[] {
  const value = frontmatter[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function attributeString(node: IndexNode, key: string): string | undefined {
  const value = node.attributes[key];
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function attributeStringList(node: IndexNode, key: string): string[] {
  return frontmatterList(node.attributes, key);
}

function uniqueLowercase(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim().toLowerCase()).filter(Boolean))];
}

function relativeNodePath(root: string, absolutePath: string): string {
  return toPosix(path.relative(root, absolutePath));
}

function renderNodeFile(frontmatter: Record<string, FrontmatterValue>, body: string): string {
  const normalizedBody = body.trimStart();
  const content = ["---", ...formatFrontmatter(frontmatter), "---", normalizedBody].join("\n");
  return content.endsWith("\n") ? content : `${content}\n`;
}

function sha256Content(content: string): string {
  return `sha256:${crypto.createHash("sha256").update(content).digest("hex")}`;
}

function seedSlugFromInput(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\\/g, "/")
    .split("/")
    .pop()!
    .replace(/\.loop\.md$/, "")
    .replace(/\.md$/, "");
}

function seedTemplatePath(root: string, config: Config, slug: string): string {
  return path.resolve(root, config.templates.root_path, "loops", `${slug}.loop.md`);
}

function loadSeedTemplates(root: string, config: Config): LoopTemplate[] {
  const dir = path.resolve(root, config.templates.root_path, "loops");
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs
    .readdirSync(dir)
    .filter((entry) => entry.endsWith(".loop.md"))
    .sort()
    .map((entry) => {
      const filePath = path.join(dir, entry);
      const content = fs.readFileSync(filePath, "utf8");
      const { frontmatter, body } = parseFrontmatter(content, filePath);
      if (frontmatter.type !== "loop") {
        throw new UsageError(`seed loop template must use type: loop: ${path.relative(root, filePath)}`);
      }
      const slug = entry.replace(/\.loop\.md$/, "");
      return {
        kind: "seed" as const,
        ref: `template://loops/${slug}`,
        title: frontmatterString(frontmatter, "title", slug),
        path: relativeNodePath(root, filePath),
        hash: sha256Content(content),
        frontmatter,
        body,
        id: typeof frontmatter.id === "string" ? frontmatter.id : undefined,
        slug,
      };
    });
}

function resolveLoopTemplate(root: string, config: Config, index: Index, raw: string, ws?: string): LoopTemplate {
  const resolved = resolveQid(index, raw, ws);
  if (resolved.status === "ok") {
    const node = index.nodes[resolved.qid];
    if (!node) {
      throw new NotFoundError(`loop template not found: ${raw}`);
    }
    if (node.type !== "loop") {
      throw new UsageError(`template must resolve to a loop node, got ${node.type}: ${node.qid}`);
    }
    const filePath = path.resolve(root, node.path);
    const content = fs.readFileSync(filePath, "utf8");
    const { frontmatter, body } = parseFrontmatter(content, filePath);
    return {
      kind: "node",
      ref: node.qid,
      title: node.title,
      path: node.path,
      hash: sha256Content(content),
      frontmatter,
      body,
      id: node.id,
      qid: node.qid,
    };
  }

  const slug = seedSlugFromInput(raw);
  const filePath = seedTemplatePath(root, config, slug);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf8");
    const { frontmatter, body } = parseFrontmatter(content, filePath);
    if (frontmatter.type !== "loop") {
      throw new UsageError(`seed loop template must use type: loop: ${path.relative(root, filePath)}`);
    }
    return {
      kind: "seed",
      ref: `template://loops/${slug}`,
      title: frontmatterString(frontmatter, "title", slug),
      path: relativeNodePath(root, filePath),
      hash: sha256Content(content),
      frontmatter,
      body,
      id: typeof frontmatter.id === "string" ? frontmatter.id : undefined,
      slug,
    };
  }

  const available = loadSeedTemplates(root, config).map((template) => template.slug).filter(Boolean);
  if (available.length > 0) {
    throw new NotFoundError(
      `${formatResolveError("loop template", raw, resolved, ws)}; seed templates: ${available.join(", ")}`
    );
  }
  throw new NotFoundError(formatResolveError("loop template", raw, resolved, ws));
}

function artifactValue(node: IndexNode, key: string): string | undefined {
  const prefix = `${key}=`;
  return node.artifacts.find((artifact) => artifact.startsWith(prefix))?.slice(prefix.length);
}

function resolveTemplateForProvenance(
  root: string,
  config: Config,
  index: Index,
  templateRef: string,
  ws: string
): LoopTemplate | undefined {
  if (templateRef.startsWith("template://loops/")) {
    return loadSeedTemplates(root, config).find((template) => template.ref === templateRef);
  }
  if (templateRef.includes("://")) {
    return undefined;
  }
  const resolved = resolveQid(index, templateRef, ws);
  if (resolved.status !== "ok") {
    return undefined;
  }
  const node = index.nodes[resolved.qid];
  if (!node || node.type !== "loop") {
    return undefined;
  }
  const filePath = path.resolve(root, node.path);
  if (!fs.existsSync(filePath)) {
    return undefined;
  }
  const content = fs.readFileSync(filePath, "utf8");
  const { frontmatter, body } = parseFrontmatter(content, filePath);
  return {
    kind: "node",
    ref: node.qid,
    title: node.title,
    path: node.path,
    hash: sha256Content(content),
    frontmatter,
    body,
    id: node.id,
    qid: node.qid,
  };
}

function loopTemplateProvenance(
  root: string,
  config: Config,
  index: Index,
  node: IndexNode
): LoopTemplateProvenance {
  const templateRefs = attributeStringList(node, "template_refs");
  const templateRef = templateRefs.length === 1 ? templateRefs[0] : undefined;
  const storedPath = artifactValue(node, "template_path");
  const storedHash = artifactValue(node, "template_hash");
  const base = {
    template_ref: templateRef,
    stored_path: storedPath,
    stored_hash: storedHash,
    path_changed: false,
  };

  if (!templateRef || !storedHash || templateRefs.length !== 1) {
    return {
      ...base,
      state: "unknown",
      warning: templateRefs.length > 1
        ? "template provenance is unknown because the loop declares multiple template refs"
        : "template provenance is unknown because the fork lacks one template ref and stored content hash",
    };
  }

  const current = resolveTemplateForProvenance(root, config, index, templateRef, node.ws);
  if (!current) {
    if (templateRef.includes("://") && !templateRef.startsWith("template://loops/")) {
      return {
        ...base,
        state: "unknown",
        warning: `template provenance cannot be checked for unsupported template ref ${templateRef}`,
      };
    }
    return {
      ...base,
      state: "missing_template",
      warning: `template ${templateRef} is missing; the fork was not changed`,
    };
  }

  const pathChanged = Boolean(storedPath && storedPath !== current.path);
  if (storedHash !== current.hash) {
    return {
      ...base,
      state: "stale",
      current_path: current.path,
      current_hash: current.hash,
      path_changed: pathChanged,
      warning: `template ${templateRef} content changed since this fork; re-fork or promote explicitly`,
    };
  }
  return {
    ...base,
    state: "current",
    current_path: current.path,
    current_hash: current.hash,
    path_changed: pathChanged,
  };
}

function resolveScope(index: Index, scope: string, ws: string): ScopeResolution {
  const input = scope.trim();
  if (!input) {
    throw new UsageError("--scope cannot be empty");
  }
  const resolved = resolveQid(index, input, ws);
  if (resolved.status === "ok") {
    return {
      input,
      refs: [resolved.qid],
      context_refs: [resolved.qid],
      relates: [resolved.qid],
      warnings: [],
    };
  }
  const normalized = input.includes("://") ? input : input.toLowerCase();
  if (validatePortableOrUriRef(normalized)) {
    const contextRefs = normalized.includes("://") ? [normalized] : [];
    return {
      input,
      refs: [normalized],
      context_refs: contextRefs,
      relates: [],
      warnings: [`scope ref ${normalized} was recorded but not linked because it is not resolved in the current graph`],
    };
  }
  return {
    input,
    refs: [],
    context_refs: [],
    relates: [],
    warnings: ["scope was recorded as description only because it is not a portable id, qid, or URI ref"],
  };
}

function statusDefault(config: Config): string {
  if (config.work.status_enum.includes("todo")) {
    return "todo";
  }
  return config.work.status_enum[0] ?? "todo";
}

function priorityDefault(config: Config, template: LoopTemplate): number {
  const raw = frontmatterString(template.frontmatter, "priority", String(config.work.priority_max));
  const parsed = Number.parseInt(raw, 10);
  if (Number.isInteger(parsed) && parsed >= config.work.priority_min && parsed <= config.work.priority_max) {
    return parsed;
  }
  return config.work.priority_max;
}

function normalizeMaterializationMode(options: LoopForkCommandOptions, template: LoopTemplate): MaterializationMode {
  if (options.planningOnly || options.noChildren) {
    return "planning_only";
  }
  const raw = (options.materializationMode ?? frontmatterString(
    template.frontmatter,
    "materialization_mode",
    "default_children"
  )).toLowerCase();
  if (!LOOP_MATERIALIZATION_MODES.has(raw)) {
    throw new UsageError("--materialization must be one of default_children, planning_only, manual");
  }
  return raw as MaterializationMode;
}

function buildLoopBody(template: LoopTemplate, options: {
  scope: ScopeResolution;
  materializationMode: MaterializationMode;
  childIds: string[];
}): string {
  const childSummary = options.childIds.length > 0 ? options.childIds.join(", ") : "none yet";
  const templateBody = template.body.trimStart();
  return [
    "# Fork Context",
    "",
    `- Source template: ${template.ref}`,
    `- Source path: ${template.path}`,
    `- Source hash: ${template.hash}`,
    `- Scope: ${options.scope.input}`,
    `- Materialization mode: ${options.materializationMode}`,
    `- Materialized child refs: ${childSummary}`,
    "",
    "# Template Operating Model",
    "",
    templateBody.length > 0 ? templateBody : "No template body was provided.",
    "",
    blockerContinuationMarkdown(template.frontmatter.blocker_policy),
  ].join("\n");
}

function workFilePath(root: string, config: Config, ws: string, id: string, title: string): string {
  const wsEntry = config.workspaces[ws];
  if (!wsEntry) {
    throw new NotFoundError(`workspace not found: ${ws}`);
  }
  return path.resolve(root, wsEntry.path, wsEntry.mdkg_dir, "work", `${id}-${slugifyTitle(title)}.md`);
}

function planLoopFork(options: LoopForkCommandOptions): {
  config: Config;
  index: Index;
  ws: string;
  template: LoopTemplate;
  scope: ScopeResolution;
  loop: PlannedNode;
  children: PlannedNode[];
  materializationMode: MaterializationMode;
  warnings: string[];
} {
  const config = loadConfig(options.root);
  const ws = normalizeWorkspace(config, options.ws);
  const { index, stale, rebuilt, warnings: indexWarnings } = loadIndex({
    root: options.root,
    config,
    useCache: !options.noCache,
    allowReindex: !options.noReindex,
    persistReindex: !options.dryRun,
  });
  const warnings = [...indexWarnings];
  if (stale && !rebuilt && !options.noCache) {
    warnings.push("index is stale; run mdkg index to refresh");
  }

  const template = resolveLoopTemplate(options.root, config, index, options.template, ws);
  const scope = resolveScope(index, options.scope, ws);
  warnings.push(...scope.warnings);

  const materializationMode = normalizeMaterializationMode(options, template);
  const allocateId = createIdAllocator(options.root, config, index, ws, !options.dryRun);
  const loopId = allocateId("loop");
  const priority = priorityDefault(config, template);
  const status = statusDefault(config);
  const title = options.title?.trim() || `${template.title} for ${scope.input}`;
  const tags = uniqueLowercase([...frontmatterList(template.frontmatter, "tags"), "loop-fork"]);
  const skills = uniqueLowercase(frontmatterList(template.frontmatter, "skills"));
  const today = formatDate(options.now ?? new Date());

  const childSpecs = materializationMode === "default_children" ? CHILD_NODE_SPECS : [];
  const children = childSpecs.map((spec) => {
    const childId = allocateId(spec.prefix);
    const childTitle = `${title} ${spec.titleSuffix}`;
    const childPath = workFilePath(options.root, config, ws, childId, childTitle);
    const childFrontmatter: Record<string, FrontmatterValue> = {
      id: childId,
      type: spec.type,
      title: childTitle,
      status,
      priority: String(priority),
      parent: loopId,
      tags: uniqueLowercase([...tags, "loop-child", spec.type]),
      owners: [],
      links: [],
      artifacts: [],
      relates: [loopId],
      blocked_by: [],
      blocks: [],
      refs: [loopId, template.ref],
      context_refs: scope.context_refs,
      evidence_refs: [],
      aliases: [],
      skills,
      created: today,
      updated: today,
    };
    if (spec.type === "test") {
      childFrontmatter.cases = [];
    }
    const body = childBody(spec.type, title, scope.input, template.ref);
    return nodePlan(ws, childId, spec.type, childTitle, status, priority, childPath, childFrontmatter, body, options.root);
  });

  const childRefs = children.map((child) => child.id);
  const loopPath = workFilePath(options.root, config, ws, loopId, title);
  const loopFrontmatter: Record<string, FrontmatterValue> = {
    id: loopId,
    type: "loop",
    title,
    status,
    priority: String(priority),
    loop_mode: frontmatterString(template.frontmatter, "loop_mode", "planning"),
    loop_role: "scoped",
    scope_refs: scope.refs,
    scope_description: scope.input,
    template_refs: [template.ref],
    materialization_mode: materializationMode,
    child_refs: childRefs,
    pre_run_questions: frontmatterList(template.frontmatter, "pre_run_questions"),
    question_answer_refs: [],
    pre_approved_actions: frontmatterList(template.frontmatter, "pre_approved_actions"),
    approval_gated_actions: frontmatterList(template.frontmatter, "approval_gated_actions"),
    required_actions: frontmatterList(template.frontmatter, "required_actions"),
    requested_actions: frontmatterList(template.frontmatter, "requested_actions"),
    prohibited_actions: frontmatterList(template.frontmatter, "prohibited_actions"),
    action_approval_refs: [],
    evidence_lanes: frontmatterList(template.frontmatter, "evidence_lanes"),
    evidence_lane_refs: [],
    lane_waiver_refs: [],
    lane_waiver_decision_refs: [],
    lane_waiver_approval_refs: [],
    run_refs: [],
    decision_refs: [],
    output_refs: [],
    approval_refs: [],
    evaluation_refs: children.filter((child) => child.type === "test").map((child) => child.id),
    definition_of_done: frontmatterString(
      template.frontmatter,
      "definition_of_done",
      "Loop reaches its definition of done with source-grounded evidence and linked follow-up nodes."
    ),
    blocker_policy: frontmatterString(
      template.frontmatter,
      "blocker_policy",
      "spike_proposal_recommendation_continue"
    ),
    tags,
    owners: uniqueLowercase(frontmatterList(template.frontmatter, "owners")),
    links: frontmatterList(template.frontmatter, "links"),
    artifacts: [`template_path=${template.path}`, `template_hash=${template.hash}`],
    relates: scope.relates,
    blocked_by: [],
    blocks: [],
    refs: [template.ref],
    context_refs: scope.context_refs,
    evidence_refs: [],
    aliases: [],
    skills,
    created: today,
    updated: today,
  };

  const loopBody = buildLoopBody(template, {
    scope,
    materializationMode,
    childIds: childRefs,
  });
  const loop = nodePlan(ws, loopId, "loop", title, status, priority, loopPath, loopFrontmatter, loopBody, options.root);

  return {
    config,
    index,
    ws,
    template,
    scope,
    loop,
    children,
    materializationMode,
    warnings,
  };
}

function childBody(type: string, loopTitle: string, scope: string, templateRef: string): string {
  if (type === "spike") {
    return [
      "# Research Question",
      "",
      `What source-grounded context, constraints, risks, and viable options should ${loopTitle} use for ${scope}?`,
      "",
      "# Search Plan",
      "",
      "- Inspect mdkg context before broad source exploration.",
      "- Use source and web grounding when the loop hits a blocker.",
      "",
      "# Findings",
      "",
      "# Recommendation",
      "",
      "# Follow-Up Nodes To Create",
      "",
      "# Skill Candidates",
      "",
      "# Evidence And Sources",
      "",
      `Template: ${templateRef}`,
    ].join("\n");
  }
  if (type === "test") {
    return [
      "# Test Contract",
      "",
      `Validate that ${loopTitle} reaches its definition of done for ${scope}.`,
      "",
      "# Cases",
      "",
      "- Loop and linked child nodes are discoverable.",
      "- Evidence and follow-up work are linked back to the scoped loop.",
      "- Blockers route to spike/proposal/recommendation guidance instead of early hard-stop.",
      "",
      "# Evidence",
      "",
      `Template: ${templateRef}`,
    ].join("\n");
  }
  return [
    "# Overview",
    "",
    `Plan and coordinate execution work for ${loopTitle} over ${scope}.`,
    "",
    "# Acceptance Criteria",
    "",
    "- Work remains scoped to the loop definition of done.",
    "- Outputs, evidence, and follow-up nodes are linked to the loop.",
    "- If blocked, the loop records blocker evidence and continues useful scoped work where possible.",
    "",
    "# Test Plan",
    "",
    `Template: ${templateRef}`,
  ].join("\n");
}

function nodePlan(
  ws: string,
  id: string,
  type: string,
  title: string,
  status: string,
  priority: number,
  absolutePath: string,
  frontmatter: Record<string, FrontmatterValue>,
  body: string,
  root: string
): PlannedNode {
  return {
    workspace: ws,
    id,
    qid: `${ws}:${id}`,
    path: relativeNodePath(root, absolutePath),
    type,
    title,
    status,
    priority,
    absolutePath,
    frontmatter,
    body,
  };
}

function writePlannedNode(node: PlannedNode): void {
  try {
    writeFileExclusive(node.absolutePath, renderNodeFile(node.frontmatter, node.body));
  } catch (err) {
    const code = typeof err === "object" && err !== null && "code" in err ? String((err as { code?: unknown }).code) : "";
    if (code === "EEXIST") {
      throw new UsageError(`node already exists: ${node.path}`);
    }
    throw err;
  }
}

function receiptNode(node: PlannedNode): CreatedNodeReceipt {
  return {
    workspace: node.workspace,
    id: node.id,
    qid: node.qid,
    path: node.path,
    type: node.type,
    title: node.title,
    status: node.status,
    priority: node.priority,
  };
}

function forkReadinessRequirements(
  frontmatter: Record<string, FrontmatterValue>,
  loopId: string
): Record<string, unknown> {
  const questions = frontmatterList(frontmatter, "pre_run_questions");
  const preApprovedActions = frontmatterList(frontmatter, "pre_approved_actions");
  const approvalGatedActions = frontmatterList(frontmatter, "approval_gated_actions");
  const requiredActions = frontmatterList(frontmatter, "required_actions");
  const requestedActions = frontmatterList(frontmatter, "requested_actions");
  const prohibitedActions = frontmatterList(frontmatter, "prohibited_actions");
  const requiredActionSet = new Set(requiredActions);
  const requestedActionSet = new Set(requestedActions);
  const evidenceLanes = frontmatterList(frontmatter, "evidence_lanes");
  const nextActions: string[] = [];
  if (questions.length > 0) {
    nextActions.push("answer each pre-run question with an accepted decision and bind it by identity in question_answer_refs");
  }
  if (approvalGatedActions.some((action) => requiredActionSet.has(action) || requestedActionSet.has(action))) {
    nextActions.push("record verified action_approval_refs for required or requested approval-gated actions");
  }
  nextActions.push(`inspect the scoped readiness projection with mdkg loop plan ${loopId} --json`);

  return {
    pre_run_questions: questions,
    required_decisions: questions.map((identity) => ({
      identity,
      binding_field: "question_answer_refs",
      required_evidence: "accepted decision ref",
    })),
    actions: {
      pre_approved: preApprovedActions,
      approval_gated: approvalGatedActions.map((identity) => ({
        identity,
        required: requiredActionSet.has(identity),
        requested: requestedActionSet.has(identity),
        binding_field: "action_approval_refs",
      })),
      required: requiredActions,
      requested: requestedActions,
      prohibited: prohibitedActions,
    },
    evidence_lanes: evidenceLanes.map((identity) => ({
      identity,
      evidence_binding_field: "evidence_lane_refs",
      waiver_decision_binding_field: "lane_waiver_decision_refs",
      waiver_approval_binding_field: "lane_waiver_approval_refs",
    })),
    next_actions: nextActions,
  };
}

function forkReceipt(plan: ReturnType<typeof planLoopFork>, dryRun: boolean): Record<string, unknown> {
  const pending = plan.materializationMode === "default_children"
    ? []
    : [
        "child materialization is pending; rerun loop fork with --materialization default_children or create linked child nodes explicitly",
      ];
  return {
    action: dryRun ? "planned" : "forked",
    dry_run: dryRun,
    template: {
      kind: plan.template.kind,
      ref: plan.template.ref,
      id: plan.template.id,
      qid: plan.template.qid,
      path: plan.template.path,
      hash: plan.template.hash,
    },
    scope: plan.scope,
    loop: receiptNode(plan.loop),
    materialization_mode: plan.materializationMode,
    materialized_children: plan.children.map(receiptNode),
    pending_materialization: pending,
    readiness_requirements: forkReadinessRequirements(plan.loop.frontmatter, plan.loop.id),
    blocker_continuation: blockerContinuationGuidance(plan.loop.frontmatter.blocker_policy),
    warnings: plan.warnings,
  };
}

function emitForkReceipt(plan: ReturnType<typeof planLoopFork>, dryRun: boolean, json?: boolean): void {
  const receipt = forkReceipt(plan, dryRun);
  if (json) {
    writeJson(receipt);
    return;
  }
  const action = dryRun ? "planned loop fork" : "loop forked";
  console.log(`${action}: ${plan.loop.qid} (${plan.loop.path})`);
  console.log(`template: ${plan.template.ref}`);
  console.log(`scope: ${plan.scope.input}`);
  console.log(`materialization: ${plan.materializationMode}`);
  if (plan.children.length > 0) {
    console.log(`children: ${plan.children.map((child) => child.qid).join(", ")}`);
  } else {
    console.log("children: none");
  }
  const questions = frontmatterList(plan.loop.frontmatter, "pre_run_questions");
  console.log(`pre-run questions: ${questions.length > 0 ? questions.join(", ") : "none"}`);
  console.log(`next: mdkg loop plan ${plan.loop.id} --json`);
  for (const warning of plan.warnings) {
    console.error(`warning: ${warning}`);
  }
}

export function runLoopForkCommand(options: LoopForkCommandOptions): void {
  if (!options.template.trim()) {
    throw new UsageError("loop fork requires a template");
  }
  if (!options.scope.trim()) {
    throw new UsageError("loop fork requires --scope");
  }

  const execute = (): void => {
    const plan = planLoopFork(options);
    if (options.dryRun) {
      emitForkReceipt(plan, true, options.json);
      return;
    }

    writePlannedNode(plan.loop);
    for (const child of plan.children) {
      writePlannedNode(child);
    }

    if (plan.config.index.auto_reindex && !options.noReindex) {
      const updatedIndex = buildIndex(options.root, plan.config, { tolerant: plan.config.index.tolerant });
      writeDerivedIndexes(options.root, plan.config, updatedIndex);
    }

    const refs = [plan.loop.id, ...plan.children.map((child) => child.id)];
    appendAutomaticEvent({
      root: options.root,
      ws: plan.ws,
      kind: "LOOP_FORKED",
      status: "ok",
      refs,
      artifacts: [plan.template.ref, plan.template.hash],
      notes: `loop forked from ${plan.template.ref}`,
      runId: options.runId,
      now: options.now,
    });

    emitForkReceipt(plan, false, options.json);
  };

  if (options.dryRun) {
    execute();
    return;
  }
  const config = loadConfig(options.root);
  withMutationLock(options.root, config.index.lock_timeout_ms, execute);
}

function loadLoopIndex(options: LoopCommandBaseOptions): { config: Config; index: Index; ws?: string; warnings: string[] } {
  const config = loadConfig(options.root);
  const ws = options.ws && options.ws !== "all" ? options.ws.toLowerCase() : undefined;
  if (ws && !config.workspaces[ws] && !config.subgraphs[ws]) {
    throw new NotFoundError(`workspace not found: ${ws}`);
  }
  const { index, rebuilt, stale, warnings } = loadIndex({
    root: options.root,
    config,
    useCache: !options.noCache,
    allowReindex: !options.noReindex,
    persistReindex: false,
  });
  const outputWarnings = [...warnings];
  if (stale && !rebuilt && !options.noCache) {
    outputWarnings.push("index is stale; run mdkg index to refresh");
  }
  return { config, index, ws, warnings: outputWarnings };
}

function resolveLoopNode(index: Index, id: string, ws?: string): IndexNode {
  const resolved = resolveQid(index, id, ws);
  if (resolved.status !== "ok") {
    throw new NotFoundError(formatResolveError("loop", id, resolved, ws));
  }
  const node = index.nodes[resolved.qid];
  if (!node) {
    throw new NotFoundError(`loop not found: ${id}`);
  }
  if (node.type !== "loop") {
    throw new UsageError(`expected loop node, got ${node.type}: ${node.qid}`);
  }
  return node;
}

function visibleLoopNodes(index: Index, ws?: string): IndexNode[] {
  return Object.values(index.nodes)
    .filter((node) => node.type === "loop" && (!ws || node.ws === ws))
    .sort((a, b) => a.qid.localeCompare(b.qid));
}

function qidForLoopRef(loop: IndexNode, ref: string): string | undefined {
  if (ref.includes("://")) {
    return undefined;
  }
  return ref.includes(":") ? ref : `${loop.ws}:${ref}`;
}

function resolveLoopRefNode(index: Index, loop: IndexNode, ref: string): IndexNode | undefined {
  const qid = qidForLoopRef(loop, ref);
  return qid ? index.nodes[qid] : undefined;
}

function isAcceptedDecisionRef(index: Index, loop: IndexNode, ref: string): boolean {
  const target = resolveLoopRefNode(index, loop, ref);
  return target?.type === "dec" && target.status === "accepted";
}

function isVerifiedApprovalRef(index: Index, loop: IndexNode, ref: string): boolean {
  if (ref.includes("://")) {
    return true;
  }
  const target = resolveLoopRefNode(index, loop, ref);
  if (!target) {
    return false;
  }
  if (target.type === "dec") {
    return target.status === "accepted";
  }
  if (target.type === "checkpoint") {
    return target.status === "done";
  }
  return target.type === "receipt" && target.attributes.receipt_status === "verified";
}

function isExistingEvidenceRef(index: Index, loop: IndexNode, ref: string): boolean {
  return ref.includes("://") || resolveLoopRefNode(index, loop, ref) !== undefined;
}

function explicitBindingMap(node: IndexNode, key: string): Map<string, string[]> {
  return groupLoopRefBindings(parseLoopRefBindings(attributeStringList(node, key)));
}

function requirementRefs(
  identity: string,
  identities: string[],
  explicit: Map<string, string[]>,
  legacyRefs: string[],
  isValid: (ref: string) => boolean
): { refs: string[]; source: "explicit" | "legacy_unambiguous" | "none" } {
  if (explicit.size > 0) {
    const refs = (explicit.get(identity) ?? []).filter(isValid);
    return { refs, source: refs.length > 0 ? "explicit" : "none" };
  }
  if (identities.length === 1) {
    const refs = legacyRefs.filter(isValid);
    return { refs, source: refs.length > 0 ? "legacy_unambiguous" : "none" };
  }
  return { refs: [], source: "none" };
}

function invalidBindingDiagnostics(
  node: IndexNode,
  key: string,
  isValid: (ref: string) => boolean
): string[] {
  return parseLoopRefBindings(attributeStringList(node, key))
    .filter((binding) => !isValid(binding.ref))
    .map((binding) => `${key} ${binding.identity} references missing, wrong-kind, or incomplete evidence ${binding.ref}`);
}

function childLaneState(child: IndexNode | undefined): LoopLaneState {
  if (!child) {
    return "missing";
  }
  if (child.status === "done" || child.attributes.goal_state === "achieved") {
    return "completed";
  }
  if (child.status === "blocked" || child.edges.blocked_by.length > 0) {
    return "blocked";
  }
  if (child.status === "review" || child.status === "waiting") {
    return "waiting";
  }
  return "actionable";
}

function incrementLaneCount(counts: Record<LoopLaneState, number>, state: LoopLaneState): void {
  counts[state] += 1;
}

function buildLoopReadinessProjection(
  root: string,
  config: Config,
  index: Index,
  node: IndexNode
): LoopReadinessProjection {
  const childRefs = attributeStringList(node, "child_refs");
  const runRefs = attributeStringList(node, "run_refs");
  const outputRefs = attributeStringList(node, "output_refs");
  const evaluationRefs = attributeStringList(node, "evaluation_refs");
  const laneWaiverRefs = attributeStringList(node, "lane_waiver_refs");
  const decisionRefs = attributeStringList(node, "decision_refs");
  const approvalRefs = attributeStringList(node, "approval_refs");
  const preRunQuestions = attributeStringList(node, "pre_run_questions");
  const preApprovedActions = attributeStringList(node, "pre_approved_actions");
  const approvalGatedActions = attributeStringList(node, "approval_gated_actions");
  const declaredRequiredActions = attributeStringList(node, "required_actions");
  const declaredRequestedActions = attributeStringList(node, "requested_actions");
  const requiredActions = Array.isArray(node.attributes.required_actions)
    ? declaredRequiredActions
    : [...preApprovedActions];
  const requestedActions = Array.isArray(node.attributes.requested_actions)
    ? declaredRequestedActions
    : [...requiredActions];
  const prohibitedActions = attributeStringList(node, "prohibited_actions");
  const evidenceLaneNames = attributeStringList(node, "evidence_lanes");
  const evidenceRefs = node.edges.evidence_refs ?? [];
  const materializationMode = attributeString(node, "materialization_mode");
  const pendingMaterialization = childRefs.length === 0
    ? ["no child refs are materialized yet; fork with default_children or create linked child nodes explicitly"]
    : [];

  const questionAnswerBindings = explicitBindingMap(node, "question_answer_refs");
  const actionApprovalBindings = explicitBindingMap(node, "action_approval_refs");
  const evidenceLaneBindings = explicitBindingMap(node, "evidence_lane_refs");
  const waiverDecisionBindings = explicitBindingMap(node, "lane_waiver_decision_refs");
  const waiverApprovalBindings = explicitBindingMap(node, "lane_waiver_approval_refs");
  const validDecision = (ref: string): boolean => isAcceptedDecisionRef(index, node, ref);
  const validApproval = (ref: string): boolean => isVerifiedApprovalRef(index, node, ref);
  const validEvidence = (ref: string): boolean => isExistingEvidenceRef(index, node, ref);

  const questionItems = preRunQuestions.map((id) => {
    const match = requirementRefs(id, preRunQuestions, questionAnswerBindings, decisionRefs, validDecision);
    return {
      id,
      state: match.refs.length > 0 ? "answered" as const : "unanswered" as const,
      decision_refs: match.refs,
      binding_source: match.source,
    };
  });
  const unansweredPreRunQuestions = questionItems
    .filter((item) => item.state === "unanswered")
    .map((item) => item.id);

  const requiredActionSet = new Set(requiredActions);
  const requestedActionSet = new Set(requestedActions);
  const actionItems = approvalGatedActions.map((id) => {
    const match = requirementRefs(id, approvalGatedActions, actionApprovalBindings, approvalRefs, validApproval);
    const required = requiredActionSet.has(id);
    const requested = requestedActionSet.has(id);
    return {
      id,
      required,
      requested,
      state: match.refs.length > 0
        ? "approved" as const
        : required || requested
          ? "pending" as const
          : "optional" as const,
      approval_refs: match.refs,
      binding_source: match.source,
    };
  });
  const pendingApprovalActions = actionItems
    .filter((item) => item.state === "pending")
    .map((item) => item.id);
  const allAvailableActions = [...new Set([...preApprovedActions, ...approvalGatedActions])];
  const optionalActions = allAvailableActions.filter(
    (action) => !requiredActionSet.has(action) && !requestedActionSet.has(action)
  );

  const children = childRefs.map((ref) => {
    const child = resolveLoopRefNode(index, node, ref);
    const state = childLaneState(child);
    return {
      ref,
      qid: child?.qid ?? qidForLoopRef(node, ref),
      type: child?.type,
      title: child?.title,
      status: child?.status,
      state,
      blocked_by: child ? [...child.edges.blocked_by] : [],
    };
  });

  const evidenceCandidates = [...new Set([...runRefs, ...outputRefs, ...evaluationRefs, ...evidenceRefs])];
  const hasExplicitWaiverBindings = waiverDecisionBindings.size > 0 || waiverApprovalBindings.size > 0;
  const evidence = evidenceLaneNames.map((name) => {
    const evidenceMatch = requirementRefs(name, evidenceLaneNames, evidenceLaneBindings, evidenceCandidates, validEvidence);
    const waiverDecisionMatch = requirementRefs(
      name,
      evidenceLaneNames,
      waiverDecisionBindings,
      laneWaiverRefs.filter((ref) => decisionRefs.includes(ref)),
      validDecision
    );
    const waiverApprovalMatch = requirementRefs(
      name,
      evidenceLaneNames,
      waiverApprovalBindings,
      hasExplicitWaiverBindings || laneWaiverRefs.length === 0 ? [] : approvalRefs,
      validApproval
    );
    const waived = waiverDecisionMatch.refs.length > 0 && waiverApprovalMatch.refs.length > 0;
    return {
      name,
      state: waived
        ? "waived" as const
        : evidenceMatch.refs.length > 0
          ? "completed" as const
          : "waiting" as const,
      evidence_refs: evidenceMatch.refs,
      waiver_refs: [...new Set([...waiverDecisionMatch.refs, ...waiverApprovalMatch.refs])],
      waiver_decision_refs: waiverDecisionMatch.refs,
      waiver_approval_refs: waiverApprovalMatch.refs,
      binding_source: waived
        ? waiverDecisionMatch.source === "explicit" || waiverApprovalMatch.source === "explicit"
          ? "explicit" as const
          : "legacy_unambiguous" as const
        : evidenceMatch.source,
    };
  });

  const invalidBindings = [
    ...invalidBindingDiagnostics(node, "question_answer_refs", validDecision),
    ...invalidBindingDiagnostics(node, "action_approval_refs", validApproval),
    ...invalidBindingDiagnostics(node, "evidence_lane_refs", validEvidence),
    ...invalidBindingDiagnostics(node, "lane_waiver_decision_refs", validDecision),
    ...invalidBindingDiagnostics(node, "lane_waiver_approval_refs", validApproval),
  ];
  for (const lane of evidence) {
    const hasWaiverDecision = waiverDecisionBindings.has(lane.name);
    const hasWaiverApproval = waiverApprovalBindings.has(lane.name);
    if (hasWaiverDecision !== hasWaiverApproval) {
      invalidBindings.push(`lane ${lane.name} waiver requires both decision and approval bindings`);
    }
  }
  if (evidenceLaneNames.length > 1 && laneWaiverRefs.length > 0 && !hasExplicitWaiverBindings) {
    invalidBindings.push("legacy lane_waiver_refs are ambiguous across multiple evidence lanes; add typed waiver bindings");
  }

  const counts: Record<LoopLaneState, number> = {
    completed: 0,
    blocked: 0,
    waiting: 0,
    waived: 0,
    actionable: 0,
    missing: 0,
  };
  for (const child of children) {
    incrementLaneCount(counts, child.state);
  }
  for (const lane of evidence) {
    incrementLaneCount(counts, lane.state);
  }

  const blockedChildren = children.filter((child) => child.state === "blocked").map((child) => child.qid ?? child.ref);
  const waitingChildren = children.filter((child) => child.state === "waiting").map((child) => child.qid ?? child.ref);
  const actionableChildren = children.filter((child) => child.state === "actionable").map((child) => child.qid ?? child.ref);
  const missingChildren = children.filter((child) => child.state === "missing").map((child) => child.ref);
  const waitingEvidenceLanes = evidence.filter((lane) => lane.state === "waiting").map((lane) => lane.name);

  const missing: string[] = [];
  if (invalidBindings.length > 0) {
    missing.push("repair invalid or incomplete readiness bindings");
  }
  if (pendingMaterialization.length > 0 && materializationMode !== "planning_only") {
    missing.push("materialize child lanes or intentionally use planning-only materialization");
  }
  if (unansweredPreRunQuestions.length > 0) {
    missing.push("answer pre-run questions through typed question decision refs");
  }
  if (pendingApprovalActions.length > 0) {
    missing.push("record typed approval refs for required or requested approval-gated actions");
  }
  if (node.edges.blocked_by.length > 0) {
    missing.push("resolve loop blockers");
  }
  if (blockedChildren.length > 0) {
    missing.push("resolve or waive blocked child lanes");
  }
  if (waitingChildren.length > 0) {
    missing.push("resolve waiting child lanes");
  }
  if (actionableChildren.length > 0) {
    missing.push("complete actionable child lanes");
  }
  if (missingChildren.length > 0) {
    missing.push("repair missing child refs");
  }
  if (waitingEvidenceLanes.length > 0) {
    missing.push("record evidence, run, output, or lane waiver refs for evidence lanes");
  }

  const nextActions: string[] = [];
  if (pendingMaterialization.length > 0 && materializationMode !== "planning_only") {
    nextActions.push("materialize default child lanes or switch the loop to planning-only/no-child materialization");
  }
  if (actionableChildren.length > 0) {
    nextActions.push(`work next actionable child lane ${actionableChildren[0]}`);
  }
  if (blockedChildren.length > 0) {
    nextActions.push("work blocker recovery through spike, proposal, recommended path, and continued unblocked lanes");
  }
  if (unansweredPreRunQuestions.length > 0) {
    nextActions.push("answer remaining pre-run questions before taking the actions they govern");
  }
  if (pendingApprovalActions.length > 0) {
    nextActions.push("record typed approval refs for required or requested approval-gated actions before taking them");
  }
  if (waitingChildren.length > 0) {
    nextActions.push(`review waiting child lane ${waitingChildren[0]}`);
  }
  if (waitingEvidenceLanes.length > 0) {
    nextActions.push(`record evidence for lane ${waitingEvidenceLanes[0]}`);
  }
  if (nextActions.length === 0) {
    nextActions.push("close the loop when final validation and closeout evidence are recorded");
  }

  const ready = missing.length === 0;
  return {
    identity: {
      id: node.id,
      qid: node.qid,
      title: node.title,
      status: node.status,
      mode: attributeString(node, "loop_mode"),
      role: attributeString(node, "loop_role"),
    },
    scope: {
      refs: attributeStringList(node, "scope_refs"),
      description: attributeString(node, "scope_description"),
    },
    template_lineage: {
      template_refs: attributeStringList(node, "template_refs"),
      materialization_mode: materializationMode,
      provenance: loopTemplateProvenance(root, config, index, node),
    },
    questions: {
      pre_run_questions: preRunQuestions,
      unanswered_pre_run_questions: unansweredPreRunQuestions,
      items: questionItems,
    },
    approvals: {
      pre_approved_actions: preApprovedActions,
      approval_gated_actions: approvalGatedActions,
      required_actions: requiredActions,
      requested_actions: requestedActions,
      optional_actions: optionalActions,
      prohibited_actions: prohibitedActions,
      pending_approval_actions: pendingApprovalActions,
      decision_refs: decisionRefs,
      approval_refs: approvalRefs,
      items: actionItems,
    },
    references: {
      child_refs: childRefs,
      run_refs: runRefs,
      output_refs: outputRefs,
      evidence_refs: evidenceRefs,
      evaluation_refs: evaluationRefs,
      lane_waiver_refs: laneWaiverRefs,
      question_answer_refs: attributeStringList(node, "question_answer_refs"),
      action_approval_refs: attributeStringList(node, "action_approval_refs"),
      evidence_lane_refs: attributeStringList(node, "evidence_lane_refs"),
      lane_waiver_decision_refs: attributeStringList(node, "lane_waiver_decision_refs"),
      lane_waiver_approval_refs: attributeStringList(node, "lane_waiver_approval_refs"),
    },
    lanes: {
      children,
      evidence,
    },
    blockers: {
      loop_blocked_by: [...node.edges.blocked_by],
      blocked_children: blockedChildren,
      waiting_children: waitingChildren,
    },
    pending_materialization: pendingMaterialization,
    invalid_bindings: invalidBindings,
    next_actions: nextActions,
    closeout: {
      ready,
      state: ready ? "ready" : "not_ready",
      missing,
      counts,
    },
  };
}

function buildLoopNextSelection(readiness: LoopReadinessProjection): {
  selected: LoopNextSelection | null;
  skipped: Array<{ ref: string; state: LoopLaneState | "approval_pending"; reason: string }>;
  rationale: string;
} {
  const skipped: Array<{ ref: string; state: LoopLaneState | "approval_pending"; reason: string }> = [];
  for (const child of readiness.lanes.children) {
    if (child.state === "completed" || child.state === "waived") {
      skipped.push({
        ref: child.qid ?? child.ref,
        state: child.state,
        reason: `lane is ${child.state}`,
      });
    }
  }

  if (readiness.closeout.ready) {
    return {
      selected: null,
      skipped,
      rationale: "loop closeout is ready; no actionable lane remains",
    };
  }

  const actionableChild = readiness.lanes.children.find((child) => child.state === "actionable");
  if (actionableChild) {
    for (const question of readiness.questions.unanswered_pre_run_questions) {
      skipped.push({
        ref: question,
        state: "waiting",
        reason: "question remains open, but it does not gate this pre-approved child lane",
      });
    }
    for (const action of readiness.approvals.pending_approval_actions) {
      skipped.push({
        ref: action,
        state: "approval_pending",
        reason: "approval-gated action is pending, but another child lane is actionable",
      });
    }
    for (const child of readiness.lanes.children) {
      if (child.state === "blocked" || child.state === "waiting" || child.state === "missing") {
        skipped.push({
          ref: child.qid ?? child.ref,
          state: child.state,
          reason: `lane is ${child.state}, but another child lane is actionable`,
        });
      }
    }
    return {
      selected: {
        kind: "child",
        ref: actionableChild.ref,
        qid: actionableChild.qid,
        title: actionableChild.title,
        state: actionableChild.state,
        reason: "first unblocked actionable child lane in loop order",
      },
      skipped,
      rationale: "selected an unblocked actionable child lane before blocker or approval recovery",
    };
  }

  const blockedChild = readiness.lanes.children.find((child) => child.state === "blocked");
  if (blockedChild) {
    for (const question of readiness.questions.unanswered_pre_run_questions) {
      skipped.push({
        ref: question,
        state: "waiting",
        reason: "question remains open, but blocker recovery is still authorized",
      });
    }
    return {
      selected: {
        kind: "recovery",
        ref: blockedChild.ref,
        qid: blockedChild.qid,
        title: blockedChild.title,
        state: blockedChild.state,
        reason: "blocked child lane needs spike/proposal/recommendation recovery before the loop blocks",
      },
      skipped,
      rationale: "no unblocked child lane remains, so route to blocker recovery",
    };
  }

  if (readiness.questions.unanswered_pre_run_questions.length > 0) {
    return {
      selected: {
        kind: "lane",
        ref: readiness.questions.unanswered_pre_run_questions[0],
        state: "waiting",
        reason: "no authorized child or recovery lane remains before this question must be resolved",
      },
      skipped,
      rationale: "the loop exhausted currently authorized work and now requires a pre-run decision",
    };
  }

  const waitingChild = readiness.lanes.children.find((child) => child.state === "waiting");
  if (waitingChild) {
    return {
      selected: {
        kind: "lane",
        ref: waitingChild.ref,
        qid: waitingChild.qid,
        title: waitingChild.title,
        state: waitingChild.state,
        reason: "waiting child lane needs review, approval, or external state resolution",
      },
      skipped,
      rationale: "no actionable child lane remains, so route to waiting lane resolution",
    };
  }

  const pendingApproval = readiness.approvals.pending_approval_actions[0];
  if (pendingApproval) {
    return {
      selected: {
        kind: "lane",
        ref: pendingApproval,
        state: "waiting",
        reason: "approval-gated action needs an approval_ref before execution",
      },
      skipped,
      rationale: "approval-gated actions are the next unresolved readiness lane",
    };
  }

  const waitingEvidence = readiness.lanes.evidence.find((lane) => lane.state === "waiting");
  if (waitingEvidence) {
    return {
      selected: {
        kind: "lane",
        ref: waitingEvidence.name,
        state: waitingEvidence.state,
        reason: "evidence lane needs run, output, evidence, or waiver refs",
      },
      skipped,
      rationale: "evidence is the next unresolved readiness lane",
    };
  }

  const missingChild = readiness.lanes.children.find((child) => child.state === "missing");
  if (missingChild) {
    return {
      selected: {
        kind: "lane",
        ref: missingChild.ref,
        qid: missingChild.qid,
        state: missingChild.state,
        reason: "child ref is missing from the graph and needs repair or waiver",
      },
      skipped,
      rationale: "missing child refs are the next unresolved lane",
    };
  }

  return {
    selected: {
      kind: "closeout",
      state: "waiting",
      reason: readiness.closeout.missing[0] ?? "loop has unresolved closeout requirements",
    },
    skipped,
    rationale: "no child lane was actionable, so route to closeout readiness cleanup",
  };
}

function truncateSummary(value: string | undefined, max = 120): string | undefined {
  const normalized = value?.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return undefined;
  }
  return normalized.length > max ? `${normalized.slice(0, max - 1).trimEnd()}…` : normalized;
}

function firstPurposeLine(body: string): string | undefined {
  return body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.length > 0 && !line.startsWith("#") && !line.startsWith("- "));
}

function templateComparison(template: LoopTemplate): Record<string, unknown> {
  const definition = frontmatterString(template.frontmatter, "definition_of_done", "");
  const scope = frontmatterString(template.frontmatter, "scope_description", "");
  const purpose = truncateSummary(
    firstPurposeLine(template.body) || definition || scope
  );
  return {
    kind: template.kind,
    ref: template.ref,
    id: template.id,
    qid: template.qid,
    title: template.title,
    path: template.path,
    hash: template.hash,
    mode: frontmatterString(template.frontmatter, "loop_mode", "planning"),
    role: frontmatterString(template.frontmatter, "loop_role", "template"),
    tags: frontmatterList(template.frontmatter, "tags"),
    default_materialization: frontmatterString(template.frontmatter, "materialization_mode", "default_children"),
    purpose,
  };
}

function loopComparison(
  root: string,
  config: Config,
  index: Index,
  node: IndexNode
): Record<string, unknown> {
  return {
    kind: "node",
    id: node.id,
    qid: node.qid,
    title: node.title,
    status: node.status,
    path: node.path,
    mode: attributeString(node, "loop_mode"),
    role: attributeString(node, "loop_role"),
    tags: [...node.tags],
    materialization_mode: attributeString(node, "materialization_mode"),
    scope_description: truncateSummary(attributeString(node, "scope_description")),
    template_lineage: loopTemplateProvenance(root, config, index, node),
  };
}

function formatComparisonDetails(entry: Record<string, unknown>): string {
  const tags = Array.isArray(entry.tags) && entry.tags.length > 0 ? ` tags=${entry.tags.join(",")}` : "";
  const materialization = typeof entry.default_materialization === "string"
    ? entry.default_materialization
    : typeof entry.materialization_mode === "string"
      ? entry.materialization_mode
      : "unknown";
  const scopeOrPurpose = typeof entry.purpose === "string"
    ? ` purpose=${entry.purpose}`
    : typeof entry.scope_description === "string"
      ? ` scope=${entry.scope_description}`
      : "";
  const lineage = entry.template_lineage as LoopTemplateProvenance | undefined;
  const provenance = lineage ? ` provenance=${lineage.state}` : "";
  return [
    `mode=${String(entry.mode ?? "unknown")}`,
    `role=${String(entry.role ?? "unknown")}`,
    `materialization=${materialization}`,
  ].join(" ") + tags + scopeOrPurpose + provenance;
}

export function runLoopListCommand(options: LoopListCommandOptions): void {
  const { config, index, ws, warnings } = loadLoopIndex(options);
  const nodes = visibleLoopNodes(index, ws);
  const templates = options.templates === false ? [] : loadSeedTemplates(options.root, config);
  const loopCatalog = nodes.map((node) => loopComparison(options.root, config, index, node));
  const templateCatalog = templates.map(templateComparison);
  const provenanceWarnings = loopCatalog.flatMap((entry) => {
    const lineage = entry.template_lineage as LoopTemplateProvenance | undefined;
    return lineage?.warning ? [`${String(entry.qid)}: ${lineage.warning}`] : [];
  });
  const outputWarnings = [...warnings, ...provenanceWarnings];
  if (options.json) {
    writeJson({
      action: "listed",
      loops: nodes.map(toNodeSummaryJson),
      templates: templateCatalog,
      catalog: {
        loops: loopCatalog,
        templates: templateCatalog,
      },
      warnings: outputWarnings,
    });
    return;
  }
  console.log(`${nodes.length} indexed loop${nodes.length === 1 ? "" : "s"} matched`);
  for (const [index, node] of nodes.entries()) {
    console.log(formatNodeCard(node));
    console.log(`  ${formatComparisonDetails(loopCatalog[index] ?? {})}`);
  }
  if (templates.length > 0) {
    console.log(`${templates.length} seed loop template${templates.length === 1 ? "" : "s"} available`);
    for (const [index, template] of templates.entries()) {
      const entry = templateCatalog[index] ?? {};
      console.log(`${template.ref} ${template.title} (${template.path})`);
      console.log(`  ${formatComparisonDetails(entry)}`);
    }
  }
  for (const warning of outputWarnings) {
    console.error(`warning: ${warning}`);
  }
}

export function runLoopShowCommand(options: LoopShowCommandOptions): void {
  const { config, index, ws, warnings } = loadLoopIndex(options);
  const resolved = resolveQid(index, options.id, ws);
  if (resolved.status === "ok") {
    const node = resolveLoopNode(index, options.id, ws);
    const body = options.metaOnly ? undefined : readNodeBody(options.root, node);
    const templateLineage = loopTemplateProvenance(options.root, config, index, node);
    const outputWarnings = templateLineage.warning
      ? [...warnings, `${node.qid}: ${templateLineage.warning}`]
      : warnings;
    if (options.json) {
      writeJson({
        action: "showed",
        loop: toNodeDetailJson(node, body),
        template_lineage: templateLineage,
        warnings: outputWarnings,
      });
      return;
    }
    console.log(formatNodeCard(node));
    console.log(`template provenance: ${templateLineage.state}`);
    if (body) {
      console.log("");
      console.log(body);
    }
    for (const warning of outputWarnings) {
      console.error(`warning: ${warning}`);
    }
    return;
  }

  const template = resolveLoopTemplate(options.root, config, index, options.id, ws);
  if (options.json) {
    writeJson({
      action: "showed",
      template: {
        kind: template.kind,
        ref: template.ref,
        id: template.id,
        qid: template.qid,
        title: template.title,
        path: template.path,
        hash: template.hash,
        frontmatter: template.frontmatter,
        body: options.metaOnly ? undefined : template.body,
      },
      warnings,
    });
    return;
  }
  console.log(`${template.ref} ${template.title} (${template.path})`);
  if (!options.metaOnly && template.body.trim().length > 0) {
    console.log("");
    console.log(template.body.trimStart());
  }
  for (const warning of warnings) {
    console.error(`warning: ${warning}`);
  }
}

export function runLoopPlanCommand(options: LoopPlanCommandOptions): void {
  const { config, index, ws, warnings } = loadLoopIndex(options);
  const node = resolveLoopNode(index, options.id, ws);
  const readiness = buildLoopReadinessProjection(options.root, config, index, node);
  const provenanceWarning = readiness.template_lineage.provenance.warning;
  const outputWarnings = provenanceWarning
    ? [...warnings, `${node.qid}: ${provenanceWarning}`]
    : warnings;
  const materializationMode = readiness.template_lineage.materialization_mode;
  const childRefs = readiness.references.child_refs;
  const payload = {
    action: "planned",
    loop: toNodeSummaryJson(node),
    materialization_mode: materializationMode,
    child_refs: childRefs,
    pending_materialization: readiness.pending_materialization,
    readiness,
    blocker_continuation: blockerContinuationGuidance(node.attributes.blocker_policy),
    warnings: outputWarnings,
  };
  if (options.json) {
    writeJson(payload);
    return;
  }
  console.log(`loop plan: ${node.qid}`);
  console.log(`materialization: ${String(materializationMode ?? "unknown")}`);
  console.log(`template provenance: ${readiness.template_lineage.provenance.state}`);
  console.log(`children: ${childRefs.length > 0 ? childRefs.join(", ") : "none"}`);
  console.log(`readiness: ${readiness.closeout.state}`);
  console.log(`closeout_ready: ${readiness.closeout.ready ? "yes" : "no"}`);
  console.log(`safe_to_run: ${readiness.approvals.pre_approved_actions.length > 0 ? readiness.approvals.pre_approved_actions.join(", ") : "none"}`);
  console.log(`approval_gated: ${readiness.approvals.approval_gated_actions.length > 0 ? readiness.approvals.approval_gated_actions.join(", ") : "none"}`);
  console.log(`required_actions: ${readiness.approvals.required_actions.length > 0 ? readiness.approvals.required_actions.join(", ") : "none"}`);
  console.log(`requested_actions: ${readiness.approvals.requested_actions.length > 0 ? readiness.approvals.requested_actions.join(", ") : "none"}`);
  console.log(`optional_actions: ${readiness.approvals.optional_actions.length > 0 ? readiness.approvals.optional_actions.join(", ") : "none"}`);
  console.log(`prohibited_actions: ${readiness.approvals.prohibited_actions.length > 0 ? readiness.approvals.prohibited_actions.join(", ") : "none"}`);
  if (readiness.questions.unanswered_pre_run_questions.length > 0) {
    console.log(`pre_run_questions: ${readiness.questions.unanswered_pre_run_questions.join(", ")}`);
  }
  if (readiness.approvals.pending_approval_actions.length > 0) {
    console.log(`pending_approvals: ${readiness.approvals.pending_approval_actions.join(", ")}`);
  }
  console.log(`evidence_lanes: ${readiness.lanes.evidence.length > 0
    ? readiness.lanes.evidence.map((lane) => `${lane.name}:${lane.state}`).join(", ")
    : "none"}`);
  console.log(`run_refs: ${readiness.references.run_refs.length > 0 ? readiness.references.run_refs.join(", ") : "none"}`);
  console.log(`output_refs: ${readiness.references.output_refs.length > 0 ? readiness.references.output_refs.join(", ") : "none"}`);
  console.log(`lane_waivers: ${readiness.references.lane_waiver_refs.length > 0 ? readiness.references.lane_waiver_refs.join(", ") : "none"}`);
  console.log(`blockers: ${readiness.blockers.loop_blocked_by.length + readiness.blockers.blocked_children.length > 0
    ? [...readiness.blockers.loop_blocked_by, ...readiness.blockers.blocked_children].join(", ")
    : "none"}`);
  console.log(`missing: ${readiness.closeout.missing.length > 0 ? readiness.closeout.missing.join("; ") : "none"}`);
  if (readiness.invalid_bindings.length > 0) {
    console.log(`invalid_bindings: ${readiness.invalid_bindings.join("; ")}`);
  }
  if (readiness.next_actions.length > 0) {
    console.log(`next_action: ${readiness.next_actions[0]}`);
  }
  for (const warning of outputWarnings) {
    console.error(`warning: ${warning}`);
  }
}

export function runLoopNextCommand(options: LoopNextCommandOptions): void {
  const { config, index, ws, warnings } = loadLoopIndex(options);
  const node = resolveLoopNode(index, options.id, ws);
  const readiness = buildLoopReadinessProjection(options.root, config, index, node);
  const selection = buildLoopNextSelection(readiness);
  const remainingPath = selection.selected !== null && selection.selected.kind !== "closeout";
  const exhaustion = {
    authorized_work_remaining: selection.selected?.kind === "child" || selection.selected?.kind === "recovery",
    decision_or_evidence_path_remaining: selection.selected?.kind === "lane",
    whole_loop_blocked: !readiness.closeout.ready && !remainingPath,
  };
  const payload = {
    action: "selected",
    loop: toNodeSummaryJson(node),
    selected: selection.selected,
    rationale: selection.rationale,
    skipped: selection.skipped,
    exhaustion,
    readiness: {
      closeout: readiness.closeout,
      next_actions: readiness.next_actions,
      blockers: readiness.blockers,
      pending_approval_actions: readiness.approvals.pending_approval_actions,
      unanswered_pre_run_questions: readiness.questions.unanswered_pre_run_questions,
    },
    warnings,
  };
  if (options.json) {
    writeJson(payload);
    return;
  }

  console.log(`loop next: ${node.qid}`);
  if (selection.selected) {
    const selectedRef = selection.selected.qid ?? selection.selected.ref ?? selection.selected.kind;
    console.log(`selected: ${selection.selected.kind} ${selectedRef}`);
    console.log(`reason: ${selection.selected.reason}`);
  } else {
    console.log("selected: none");
    console.log(`reason: ${selection.rationale}`);
  }
  if (selection.skipped.length > 0) {
    console.log(`skipped: ${selection.skipped.map((entry) => `${entry.ref}:${entry.reason}`).join("; ")}`);
  }
  console.log(`whole_loop_blocked: ${exhaustion.whole_loop_blocked ? "yes" : "no"}`);
  for (const warning of warnings) {
    console.error(`warning: ${warning}`);
  }
}

export function runLoopRunsCommand(options: LoopRunsCommandOptions): void {
  const { index, ws, warnings } = loadLoopIndex(options);
  const node = resolveLoopNode(index, options.id, ws);
  const runRefs = Array.isArray(node.attributes.run_refs) ? node.attributes.run_refs : [];
  const evidenceRefs = node.edges.evidence_refs ?? [];
  const payload = {
    action: "listed",
    loop: toNodeSummaryJson(node),
    run_refs: runRefs,
    evidence_refs: evidenceRefs,
    warnings,
  };
  if (options.json) {
    writeJson(payload);
    return;
  }
  console.log(`loop runs: ${node.qid}`);
  console.log(`run_refs: ${runRefs.length > 0 ? runRefs.join(", ") : "none"}`);
  console.log(`evidence_refs: ${evidenceRefs.length > 0 ? evidenceRefs.join(", ") : "none"}`);
  for (const warning of warnings) {
    console.error(`warning: ${warning}`);
  }
}
