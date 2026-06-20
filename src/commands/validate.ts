import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { loadConfig } from "../core/config";
import { loadTemplateSchemasWithInfo } from "../graph/template_schema";
import { ALLOWED_TYPES, parseNode } from "../graph/node";
import { Index, IndexNode } from "../graph/indexer";
import { isAgentFileType } from "../graph/agent_file_types";
import { buildSkillsIndex, resolveSkillsRoot } from "../graph/skills_indexer";
import { listWorkspaceDocFilesByAlias } from "../graph/workspace_files";
import { collectGraphErrors } from "../graph/validate_graph";
import { buildSubgraphsIndex, mergeSubgraphsIntoIndex } from "../graph/subgraphs";
import { collectVisibilityViolations, visibilityViolationMessages } from "../graph/visibility";
import { isSqliteBackend, sqliteHealth } from "../graph/sqlite_index";
import { ValidationError } from "../util/errors";
import { auditSkillMirrors } from "./skill_mirror";

export type ValidateCommandOptions = {
  root: string;
  out?: string;
  quiet?: boolean;
  json?: boolean;
  changedOnly?: boolean;
};

export type ValidateWarningDiagnostic = {
  id: string;
  category: string;
  severity: "warning";
  message: string;
  qid?: string;
  path?: string;
  ref?: string;
  remediation: string;
};

export type ValidateReceipt = {
  action: "validated";
  ok: boolean;
  warning_count: number;
  error_count: number;
  warnings: string[];
  warning_diagnostics: ValidateWarningDiagnostic[];
  errors: string[];
  report_path?: string;
  warning_filter?: {
    mode: "changed-only";
    changed_paths: string[];
  };
};

type HeadingMap = Record<string, string[]>;

export const RECOMMENDED_HEADINGS: HeadingMap = {
  task: [
    "Overview",
    "Acceptance Criteria",
    "Files Affected",
    "Implementation Notes",
    "Test Plan",
    "Links / Artifacts",
  ],
  bug: [
    "Overview",
    "Reproduction Steps",
    "Expected vs Actual",
    "Suspected Cause",
    "Fix Plan",
    "Test Plan",
    "Links / Artifacts",
  ],
  feat: ["Overview", "Acceptance Criteria", "Notes"],
  spike: [
    "Research Question",
    "Context And Constraints",
    "Search Plan",
    "Findings",
    "Options And Tradeoffs",
    "Recommendation",
    "Follow-Up Nodes To Create",
    "Skill Candidates",
    "Evidence And Sources",
  ],
  epic: ["Goal", "Scope", "Milestones", "Out of Scope", "Risks", "Links / Artifacts"],
  checkpoint: [
    "Summary",
    "Scope Covered",
    "Decisions Captured",
    "Implementation Summary",
    "Verification / Testing",
    "Known Issues / Follow-ups",
    "Links / Artifacts",
  ],
  prd: [
    "Problem",
    "Goals",
    "Non-goals",
    "Requirements",
    "Acceptance Criteria",
    "Metrics / Success",
    "Risks",
    "Open Questions",
  ],
  edd: [
    "Overview",
    "Architecture",
    "Data model",
    "APIs / interfaces",
    "Failure modes",
    "Observability",
    "Security / privacy",
    "Testing strategy",
    "Rollout plan",
  ],
  dec: ["Context", "Decision", "Alternatives considered", "Consequences", "Links / references"],
  spec: ["Purpose", "Runtime", "Work Contracts", "Capabilities"],
  work: ["Capability", "Inputs", "Outputs", "Receipt"],
  work_order: ["Request", "Inputs", "Constraints"],
  receipt: ["Outcome", "Artifacts", "Notes"],
  feedback: ["Feedback", "Evidence"],
  dispute: ["Dispute", "Evidence", "Resolution"],
  proposal: ["Summary", "Evidence", "Proposed Change", "Review"],
};

function normalizeHeading(value: string): string {
  return value.trim().toLowerCase();
}

function extractHeadings(body: string): Set<string> {
  const headings = new Set<string>();
  const lines = body.split(/\r?\n/);
  for (const line of lines) {
    const match = /^#+\s+(.*)$/.exec(line);
    if (!match) {
      continue;
    }
    headings.add(normalizeHeading(match[1] ?? ""));
  }
  return headings;
}

const RAW_CONTENT_MARKERS: Array<{ id: string; pattern: RegExp; description: string }> = [
  { id: "raw_prompt", pattern: /\bRAW_PROMPT_MARKER\b/i, description: "raw prompt marker" },
  { id: "raw_payload", pattern: /\bRAW_PAYLOAD_MARKER\b/i, description: "raw payload marker" },
  { id: "raw_secret", pattern: /\bRAW_SECRET_MARKER\b|BEGIN [A-Z ]*PRIVATE KEY|secret\s*=/i, description: "raw secret marker" },
];

function shouldCheckRawContentWarnings(node: ReturnType<typeof parseNode>): boolean {
  if (isAgentFileType(node.type)) {
    return true;
  }
  return node.type === "checkpoint" && typeof node.frontmatter.checkpoint_kind === "string";
}

function collectRawContentWarnings(qid: string, node: ReturnType<typeof parseNode>): string[] {
  if (!shouldCheckRawContentWarnings(node)) {
    return [];
  }
  const warnings: string[] = [];
  for (const marker of RAW_CONTENT_MARKERS) {
    if (marker.pattern.test(node.body)) {
      warnings.push(
        `${qid}: raw-content.${marker.id} warning: ${marker.description} detected; use refs, hashes, summaries, or artifact links instead of raw secrets/prompts/payloads`
      );
    }
  }
  return warnings;
}

function collectChangedPaths(root: string): Set<string> {
  const result = spawnSync("git", ["-C", root, "status", "--porcelain", "--", ".mdkg"], {
    encoding: "utf8",
  });
  if (result.status !== 0) {
    return new Set();
  }
  const changed = new Set<string>();
  for (const line of result.stdout.split(/\r?\n/)) {
    if (!line.trim()) {
      continue;
    }
    const rawPath = line.slice(3).trim();
    const filePath = rawPath.includes(" -> ") ? rawPath.split(" -> ").pop() ?? rawPath : rawPath;
    changed.add(filePath.replace(/\\/g, "/"));
  }
  return changed;
}

function qidFromWarning(message: string): string | undefined {
  const match = /^([a-z0-9_-]+:[^\s:]+):/.exec(message);
  return match?.[1];
}

function warningPath(message: string, nodes: Record<string, IndexNode>): string | undefined {
  const qid = qidFromWarning(message);
  if (qid && nodes[qid]) {
    return nodes[qid].path;
  }
  for (const node of Object.values(nodes)) {
    if (message.includes(node.path)) {
      return node.path;
    }
  }
  const match = /([.]mdkg\/[^\s:]+\.md|[.]mdkg\/[^\s:]+\/SKILLS?\.md)/.exec(message);
  return match?.[1];
}

function warningDiagnostic(message: string, nodes: Record<string, IndexNode>): ValidateWarningDiagnostic {
  const qid = qidFromWarning(message);
  const pathValue = warningPath(message, nodes);
  const rawMatch = /raw-content\.([a-z_]+)/.exec(message);
  if (rawMatch) {
    return {
      id: `raw-content.${rawMatch[1]}`,
      category: "raw-content",
      severity: "warning",
      message,
      qid,
      path: pathValue,
      ref: qid,
      remediation: "Replace raw secrets, prompts, tokens, or payloads with refs, hashes, redacted summaries, or archive/artifact links.",
    };
  }
  if (message.includes("missing recommended heading")) {
    return {
      id: "heading.missing",
      category: "headings",
      severity: "warning",
      message,
      qid,
      path: pathValue,
      ref: qid,
      remediation: "Run mdkg format --headings --dry-run to review missing heading additions, then --apply if acceptable.",
    };
  }
  if (message.includes("bundled template schema fallback")) {
    return {
      id: "template_schema.fallback",
      category: "templates",
      severity: "warning",
      message,
      path: pathValue,
      remediation: "Run mdkg upgrade --apply to vendor missing built-in template schemas when the managed asset update is safe.",
    };
  }
  if (message.includes("sqlite") || message.includes("index")) {
    return {
      id: "cache.index",
      category: "cache",
      severity: "warning",
      message,
      path: pathValue,
      remediation: "Run mdkg index or mdkg db index rebuild when generated cache state should be refreshed.",
    };
  }
  if (message.includes("skill") || message.includes("mirror")) {
    return {
      id: "skill_mirror.warning",
      category: "skills",
      severity: "warning",
      message,
      path: pathValue,
      remediation: "Run mdkg skill sync after reviewing managed skill mirror drift.",
    };
  }
  if (message.includes("subgraph")) {
    return {
      id: "subgraph.warning",
      category: "subgraph",
      severity: "warning",
      message,
      path: pathValue,
      remediation: "Run mdkg subgraph verify or refresh the source bundle after reviewing child graph freshness.",
    };
  }
  return {
    id: "warning.generic",
    category: "general",
    severity: "warning",
    message,
    qid,
    path: pathValue,
    ref: qid,
    remediation: "Review the warning and apply the focused mdkg command suggested by the message when appropriate.",
  };
}

function isCoreListFile(filePath: string): boolean {
  return path.basename(filePath) === "core.md" && path.basename(path.dirname(filePath)) === "core";
}

function normalizeEdgeTarget(value: string, ws: string): string {
  if (value.includes(":")) {
    return value;
  }
  return `${ws}:${value}`;
}

function normalizeEdges(edges: IndexNode["edges"], ws: string): IndexNode["edges"] {
  return {
    epic: edges.epic ? normalizeEdgeTarget(edges.epic, ws) : undefined,
    parent: edges.parent ? normalizeEdgeTarget(edges.parent, ws) : undefined,
    prev: edges.prev ? normalizeEdgeTarget(edges.prev, ws) : undefined,
    next: edges.next ? normalizeEdgeTarget(edges.next, ws) : undefined,
    relates: edges.relates.map((value) => normalizeEdgeTarget(value, ws)),
    blocked_by: edges.blocked_by.map((value) => normalizeEdgeTarget(value, ws)),
    blocks: edges.blocks.map((value) => normalizeEdgeTarget(value, ws)),
    context_refs: (edges.context_refs ?? []).map((value) => normalizeEdgeTarget(value, ws)),
    evidence_refs: (edges.evidence_refs ?? []).map((value) => normalizeEdgeTarget(value, ws)),
  };
}

function buildIndexNode(
  root: string,
  ws: string,
  filePath: string,
  node: ReturnType<typeof parseNode>
): IndexNode {
  return {
    id: node.id,
    qid: `${ws}:${node.id}`,
    ws,
    type: node.type,
    title: node.title,
    status: node.status,
    priority: node.priority,
    created: node.created,
    updated: node.updated,
    tags: node.tags,
    owners: node.owners,
    links: node.links,
    artifacts: node.artifacts,
    refs: node.refs,
    aliases: node.aliases,
    skills: node.skills,
    attributes: node.attributes,
    path: path.relative(root, filePath),
    edges: normalizeEdges(node.edges, ws),
  };
}

function buildWorkspaceMap(config: ReturnType<typeof loadConfig>): Record<string, { path: string; enabled: boolean }> {
  const workspaces: Record<string, { path: string; enabled: boolean }> = {};
  for (const alias of Object.keys(config.workspaces).sort()) {
    const entry = config.workspaces[alias];
    workspaces[alias] = { path: entry.path, enabled: entry.enabled };
  }
  return workspaces;
}

function addReverseEdge(
  reverse: Index["reverse_edges"],
  edgeKey: string,
  target: string | undefined,
  source: string
): void {
  if (!target) {
    return;
  }
  reverse[edgeKey] = reverse[edgeKey] ?? {};
  reverse[edgeKey][target] = reverse[edgeKey][target] ?? [];
  reverse[edgeKey][target].push(source);
}

function buildReverseEdges(nodes: Record<string, IndexNode>): Index["reverse_edges"] {
  const reverse: Index["reverse_edges"] = {};
  for (const [qid, node] of Object.entries(nodes)) {
    addReverseEdge(reverse, "epic", node.edges.epic, qid);
    addReverseEdge(reverse, "parent", node.edges.parent, qid);
    addReverseEdge(reverse, "prev", node.edges.prev, qid);
    addReverseEdge(reverse, "next", node.edges.next, qid);
    for (const target of node.edges.relates) {
      addReverseEdge(reverse, "relates", target, qid);
    }
    for (const target of node.edges.blocked_by) {
      addReverseEdge(reverse, "blocked_by", target, qid);
    }
    for (const target of node.edges.blocks) {
      addReverseEdge(reverse, "blocks", target, qid);
    }
    for (const target of node.edges.context_refs ?? []) {
      addReverseEdge(reverse, "context_refs", target, qid);
    }
    for (const target of node.edges.evidence_refs ?? []) {
      addReverseEdge(reverse, "evidence_refs", target, qid);
    }
  }
  for (const targets of Object.values(reverse)) {
    for (const sources of Object.values(targets)) {
      sources.sort();
    }
  }
  return reverse;
}

function listDirectories(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(dirPath, entry.name))
    .sort();
}

function validateEventsJsonl(
  root: string,
  config: ReturnType<typeof loadConfig>,
  errors: string[]
): void {
  for (const [alias, workspace] of Object.entries(config.workspaces)) {
    if (!workspace.enabled) {
      continue;
    }
    const eventsPath = path.resolve(root, workspace.path, workspace.mdkg_dir, "work", "events", "events.jsonl");
    if (!fs.existsSync(eventsPath)) {
      continue;
    }

    const lines = fs.readFileSync(eventsPath, "utf8").split(/\r?\n/);
    for (let i = 0; i < lines.length; i += 1) {
      const raw = lines[i].trim();
      if (!raw) {
        continue;
      }
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        errors.push(`${eventsPath}:${i + 1}: invalid JSON`);
        continue;
      }

      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        errors.push(`${eventsPath}:${i + 1}: event must be a JSON object`);
        continue;
      }

      const event = parsed as Record<string, unknown>;
      for (const key of ["ts", "run_id", "workspace", "agent", "kind", "status"]) {
        const value = event[key];
        if (typeof value !== "string" || value.trim().length === 0) {
          errors.push(`${eventsPath}:${i + 1}: ${key} is required and must be a non-empty string`);
        }
      }
      if (!Array.isArray(event.refs)) {
        errors.push(`${eventsPath}:${i + 1}: refs is required and must be a list`);
      }
      if (!Array.isArray(event.artifacts)) {
        errors.push(`${eventsPath}:${i + 1}: artifacts is required and must be a list`);
      }
      if (typeof event.notes !== "string") {
        errors.push(`${eventsPath}:${i + 1}: notes is required and must be a string`);
      }
      if (typeof event.workspace === "string" && event.workspace !== alias) {
        errors.push(`${eventsPath}:${i + 1}: workspace must match ${alias}`);
      }
    }
  }
}

export function collectValidateReceipt(options: ValidateCommandOptions): ValidateReceipt {
  const config = loadConfig(options.root);
  const templateSchemaInfo = loadTemplateSchemasWithInfo(options.root, config, ALLOWED_TYPES);
  const templateSchemas = templateSchemaInfo.schemas;
  const filesByAlias = listWorkspaceDocFilesByAlias(options.root, config);

  const errors: string[] = [];
  const warnings: string[] = [];
  if (isSqliteBackend(config)) {
    const health = sqliteHealth(options.root, config);
    warnings.push(...health.warnings);
    errors.push(...health.errors);
  }
  if (templateSchemaInfo.fallbackTypes.length > 0) {
    warnings.push(
      `using bundled template schema fallback for missing local type(s): ${templateSchemaInfo.fallbackTypes.join(", ")}; run \`mdkg upgrade --apply\` to vendor built-in templates`
    );
  }
  const nodes: Record<string, IndexNode> = {};
  const idsByWorkspace: Record<string, Map<string, string>> = {};

  for (const [alias, files] of Object.entries(filesByAlias)) {
    idsByWorkspace[alias] = new Map();
    for (const filePath of files) {
      if (isCoreListFile(filePath)) {
        continue;
      }
      let content = "";
      try {
        content = fs.readFileSync(filePath, "utf8");
      } catch (err) {
        const message = err instanceof Error ? err.message : "unknown error";
        errors.push(`${filePath}: failed to read file: ${message}`);
        continue;
      }
      try {
        const node = parseNode(content, filePath, {
          workStatusEnum: config.work.status_enum,
          priorityMin: config.work.priority_min,
          priorityMax: config.work.priority_max,
          templateSchemas,
        });

        if (idsByWorkspace[alias].has(node.id)) {
          const firstPath = idsByWorkspace[alias].get(node.id);
          errors.push(
            `${path.relative(options.root, filePath).split(path.sep).join("/")}: duplicate id ${node.id} in workspace ${alias} (also in ${firstPath ? path.relative(options.root, firstPath).split(path.sep).join("/") : "unknown"})`
          );
          continue;
        }
        idsByWorkspace[alias].set(node.id, filePath);

        const qid = `${alias}:${node.id}`;
        nodes[qid] = buildIndexNode(options.root, alias, filePath, node);

        const recommended = RECOMMENDED_HEADINGS[node.type];
        if (recommended) {
          const headings = extractHeadings(node.body);
          for (const heading of recommended) {
            if (!headings.has(normalizeHeading(heading))) {
              warnings.push(`${qid}: missing recommended heading "${heading}"`);
            }
          }
        }
        warnings.push(...collectRawContentWarnings(qid, node));
      } catch (err) {
        const message = err instanceof Error ? err.message : "unknown error";
        errors.push(message);
      }
    }
  }

  const index: Index = {
    meta: {
      tool: config.tool,
      schema_version: config.schema_version,
      generated_at: new Date().toISOString(),
      root: options.root,
      workspaces: Object.keys(filesByAlias).sort(),
    },
    workspaces: buildWorkspaceMap(config),
    nodes,
    reverse_edges: buildReverseEdges(nodes),
  };

  const subgraphProjection = buildSubgraphsIndex(options.root, config);
  for (const item of subgraphProjection.index.subgraphs) {
    for (const warning of item.warnings) {
      warnings.push(`subgraph ${item.alias}: ${warning}`);
    }
    for (const error of item.errors) {
      errors.push(`subgraph ${item.alias}: ${error}`);
    }
  }
  const validationIndex = mergeSubgraphsIntoIndex(index, subgraphProjection);

  let knownSkills = new Set<string>();
  try {
    const skillsIndex = buildSkillsIndex(options.root, config);
    knownSkills = new Set(Object.keys(skillsIndex.skills));
    for (const node of Object.values(nodes)) {
      for (const slug of node.skills) {
        if (!knownSkills.has(slug)) {
          errors.push(`${node.qid}: skills reference missing slug: ${slug}`);
        }
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown skill validation error";
    errors.push(message);
  }

  const graphErrors = collectGraphErrors(validationIndex, {
    allowMissing: false,
    knownSkillSlugs: knownSkills,
  });
  errors.push(...graphErrors);
  errors.push(
    ...visibilityViolationMessages(collectVisibilityViolations(validationIndex, config)).map(
      (message) => `visibility: ${message}`
    )
  );

  const skillsRoot = resolveSkillsRoot(options.root, config);
  for (const dirPath of listDirectories(skillsRoot)) {
    const canonicalPath = path.join(dirPath, "SKILL.md");
    const compatPath = path.join(dirPath, "SKILLS.md");
    const hasCanonical = fs.existsSync(canonicalPath);
    const hasCompat = fs.existsSync(compatPath);
    if (hasCanonical && hasCompat) {
      errors.push(`${dirPath}: both SKILL.md and SKILLS.md exist`);
      continue;
    }
    if (!hasCanonical && !hasCompat) {
      errors.push(`${dirPath}: missing SKILL.md or SKILLS.md`);
      continue;
    }
    if (hasCompat) {
      warnings.push(`${path.relative(options.root, compatPath)}: using legacy SKILLS.md compatibility file`);
    }
  }

  warnings.push(...auditSkillMirrors(options.root, config));

  validateEventsJsonl(options.root, config, errors);

  const allUniqueWarnings = Array.from(new Set(warnings));
  const allWarningDiagnostics = allUniqueWarnings.map((warning) => warningDiagnostic(warning, nodes));
  const changedPaths = options.changedOnly ? collectChangedPaths(options.root) : new Set<string>();
  const filteredWarningDiagnostics = options.changedOnly
    ? allWarningDiagnostics.filter((warning) => warning.path !== undefined && changedPaths.has(warning.path))
    : allWarningDiagnostics;
  const uniqueWarnings = filteredWarningDiagnostics.map((warning) => warning.message);
  const uniqueErrors = Array.from(new Set(errors));

  const reportLines = [
    ...uniqueWarnings.map((warning) => `warning: ${warning}`),
    ...uniqueErrors,
  ];

  let outPath: string | undefined = undefined;
  if (options.out) {
    outPath = path.resolve(options.root, options.out);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, reportLines.join("\n"), "utf8");
  }

  const receipt: ValidateReceipt = {
    action: "validated",
    ok: uniqueErrors.length === 0,
    warning_count: uniqueWarnings.length,
    error_count: uniqueErrors.length,
    warnings: uniqueWarnings,
    warning_diagnostics: filteredWarningDiagnostics,
    errors: uniqueErrors,
    ...(outPath ? { report_path: outPath } : {}),
    ...(options.changedOnly
      ? { warning_filter: { mode: "changed-only" as const, changed_paths: Array.from(changedPaths).sort() } }
      : {}),
  };

  return receipt;
}

export function runValidateCommand(options: ValidateCommandOptions): void {
  const receipt = collectValidateReceipt(options);

  if (options.json) {
    console.log(JSON.stringify(receipt, null, 2));
    if (receipt.error_count > 0) {
      throw new ValidationError(`validation failed with ${receipt.error_count} error(s)`);
    }
    return;
  }

  if (!options.quiet) {
    for (const warning of receipt.warnings) {
      console.error(`warning: ${warning}`);
    }
  }

  if (receipt.error_count > 0) {
    if (receipt.report_path) {
      console.error(`validation failed: ${receipt.error_count} error(s). details written to ${receipt.report_path}`);
    } else {
      for (const error of receipt.errors) {
        console.error(error);
      }
    }
    throw new ValidationError(`validation failed with ${receipt.error_count} error(s)`);
  }

  if (receipt.report_path) {
    console.log(`validation report written: ${receipt.report_path}`);
  }
  console.log("validation ok");
}
