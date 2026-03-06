import fs from "fs";
import path from "path";
import { loadConfig } from "../core/config";
import { loadTemplateSchemas } from "../graph/template_schema";
import { ALLOWED_TYPES, parseNode } from "../graph/node";
import { Index, IndexNode } from "../graph/indexer";
import { buildSkillsIndex, resolveSkillsRoot } from "../graph/skills_indexer";
import { listWorkspaceDocFilesByAlias } from "../graph/workspace_files";
import { collectGraphErrors } from "../graph/validate_graph";
import { ValidationError } from "../util/errors";

export type ValidateCommandOptions = {
  root: string;
  out?: string;
  quiet?: boolean;
};

type HeadingMap = Record<string, string[]>;

const RECOMMENDED_HEADINGS: HeadingMap = {
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
  const rootWorkspace = config.workspaces.root;
  if (!rootWorkspace || !rootWorkspace.enabled) {
    return;
  }

  const eventsPath = path.resolve(
    root,
    rootWorkspace.path,
    rootWorkspace.mdkg_dir,
    "work",
    "events",
    "events.jsonl"
  );
  if (!fs.existsSync(eventsPath)) {
    return;
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
  }
}

export function runValidateCommand(options: ValidateCommandOptions): void {
  const config = loadConfig(options.root);
  const templateSchemas = loadTemplateSchemas(options.root, config, ALLOWED_TYPES);
  const filesByAlias = listWorkspaceDocFilesByAlias(options.root, config);

  const errors: string[] = [];
  const warnings: string[] = [];
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
            `${filePath}: duplicate id ${node.id} in workspace ${alias} (also in ${firstPath})`
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
    reverse_edges: {},
  };

  const graphErrors = collectGraphErrors(index, { allowMissing: false });
  errors.push(...graphErrors);

  try {
    const skillsIndex = buildSkillsIndex(options.root, config);
    const knownSkills = new Set(Object.keys(skillsIndex.skills));
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

  const skillsRoot = resolveSkillsRoot(options.root, config);
  for (const dirPath of listDirectories(skillsRoot)) {
    const skillPath = path.join(dirPath, "SKILL.md");
    if (!fs.existsSync(skillPath)) {
      errors.push(`${dirPath}: missing SKILL.md`);
    }
  }

  validateEventsJsonl(options.root, config, errors);

  const reportLines = [
    ...warnings.map((warning) => `warning: ${warning}`),
    ...errors,
  ];

  let outPath: string | undefined = undefined;
  if (options.out) {
    outPath = path.resolve(options.root, options.out);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, reportLines.join("\n"), "utf8");
  }

  if (!options.quiet) {
    for (const warning of warnings) {
      console.error(`warning: ${warning}`);
    }
  }

  if (errors.length > 0) {
    if (outPath) {
      console.error(`validation failed: ${errors.length} error(s). details written to ${outPath}`);
    } else {
      for (const error of errors) {
        console.error(error);
      }
    }
    throw new ValidationError(`validation failed with ${errors.length} error(s)`);
  }

  if (outPath) {
    console.log(`validation report written: ${outPath}`);
  }
  console.log("validation ok");
}
