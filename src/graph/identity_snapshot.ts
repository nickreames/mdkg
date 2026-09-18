import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { Config, loadConfig, validateConfigSchema } from "../core/config";
import { containedPathExists, readContainedDirectory, readContainedFile } from "../core/filesystem_authority";
import { UsageError } from "../util/errors";
import { ALLOWED_TYPES, Node, parseNode } from "./node";
import { loadTemplateSchemas } from "./template_schema";
import { getWorkspaceDocRoots, listWorkspaceDocFilesByAlias } from "./workspace_files";
import { workspaceDocumentOwner } from "./workspace_ownership";
import type { Index, IndexNode } from "./indexer";
import { normalizeIndexIdentityReferences } from "./identity_refs";
import { validateGraph } from "./validate_graph";
import {
  assertNoGraphConflictMarkers, assertNodeFormat, canonicalJson, GraphFormat,
  GRAPH_FORMAT_PATH, identityHash, identityRef, parseGraphFormat, readGraphFormat,
} from "./identity";

export type AuthoredNode = { path: string; ws: string; qid: string; hash: string; content: string; node: Node };
export type AuthoredSnapshot = {
  revision: string | null;
  tree_hash: string;
  config: Config;
  format: GraphFormat;
  files: Record<string, string>;
  nodes: AuthoredNode[];
  identity_evidence?: Record<string, { hash: string; content: string }>;
};

export function readGraphGit(root: string, args: string[], optional = false): string | undefined {
  const result = spawnSync("git", args, {
    cwd: root, encoding: "utf8", maxBuffer: 32 * 1024 * 1024,
    env: { ...process.env, GIT_OPTIONAL_LOCKS: "0", GIT_NO_REPLACE_OBJECTS: "1" },
  });
  if (result.status !== 0 || result.error) {
    if (optional) return undefined;
    throw new UsageError(`unable to read local Git graph evidence (${args[0]}); no remote or repair attempted`);
  }
  return result.stdout;
}

export function resolveGraphRevision(root: string, revision: string): string {
  if (!revision || revision.startsWith("-") || /[\r\n\0]/.test(revision)) throw new UsageError("invalid graph revision");
  const resolved = readGraphGit(root, ["rev-parse", "--verify", "--end-of-options", `${revision}^{commit}`])?.trim();
  if (!resolved || !/^[0-9a-f]{40,64}$/.test(resolved)) throw new UsageError("graph revision does not identify one local commit");
  return resolved;
}

export function readRevisionFile(root: string, revision: string, relativePath: string): string | undefined {
  return readGraphGit(root, ["show", `${revision}:${relativePath}`], true);
}

function skipDocument(relativePath: string, workspacePath: string): boolean {
  const local = path.posix.relative(workspacePath, relativePath);
  return local === "core/core.md" || (local.startsWith("archive/") && local.split("/").slice(1).includes("source"));
}

// Durable identity receipts are authored provenance, not rebuildable indexes.
// Inventory their exact bytes even when a particular receipt kind is not an
// input to the current operation. Unknown/non-JSON/linked evidence fails closed.
export function readIdentityEvidence(root: string, revision?: string): Record<string, { hash: string; content: string }> {
  const config = loadConfig(root);
  const paths: string[] = [];
  if (revision) {
    if (!/^[0-9a-f]{40,64}$/.test(revision)) throw new UsageError("identity evidence requires an exact resolved local revision");
    const listing = readGraphGit(root, ["ls-tree", "-r", "-z", revision, "--", ".mdkg/identity"] )!;
    for (const entry of listing.split("\0").filter(Boolean)) {
      const match = /^(\d+) (\w+) ([0-9a-f]+)\t([\s\S]+)$/.exec(entry);
      if (!match || match[2] !== "blob" || !/^100(644|755)$/.test(match[1]) || !match[4].endsWith(".json")) {
        throw new UsageError("unclassifiable identity provenance in revision; preserve and review its owner");
      }
      paths.push(match[4]);
    }
  } else if (containedPathExists({ root, relativePath: ".mdkg/identity" })) {
    const visit = (directory: string, depth: number) => {
      if (depth > 8) throw new UsageError("identity evidence nesting exceeds inspection limit");
      for (const entry of readContainedDirectory({ root, relativePath: directory })) {
        const file = `${directory}/${entry.name}`;
        if (entry.isDirectory()) visit(file, depth + 1);
        else if (entry.isFile() && entry.name.endsWith(".json")) paths.push(file);
        else throw new UsageError(`unclassifiable identity provenance: ${file}`);
        if (paths.length > config.index.limits.max_files) throw new UsageError("identity evidence exceeds configured file limit");
      }
    };
    visit(".mdkg/identity", 0);
  }
  const result: Record<string, { hash: string; content: string }> = {};
  let total = 0;
  for (const file of paths.sort()) {
    const content = revision ? readRevisionFile(root, revision, file) : readContainedFile({ root, relativePath: file, maxBytes: config.index.limits.max_file_bytes });
    if (content === undefined) throw new UsageError(`missing identity evidence: ${file}`);
    total += Buffer.byteLength(content);
    if (Buffer.byteLength(content) > config.index.limits.max_file_bytes || total > config.index.limits.max_total_bytes || paths.length > config.index.limits.max_files) {
      throw new UsageError("identity evidence exceeds configured discovery limits");
    }
    try { JSON.parse(content); } catch { throw new UsageError(`malformed identity evidence: ${file}`); }
    result[file] = { content, hash: identityHash(content) };
  }
  return result;
}

// Read only authored graph documents. Indexes, bundles, queues, selection and
// runtime state are not project-knowledge merge inputs. Git is evidence only.
export function readAuthoredSnapshot(root: string, revision?: string): AuthoredSnapshot {
  const resolved = revision ? resolveGraphRevision(root, revision) : null;
  const configContent = resolved ? readRevisionFile(root, resolved, ".mdkg/config.json")
    : readContainedFile({ root, relativePath: ".mdkg/config.json" });
  if (!configContent) throw new UsageError("graph snapshot is missing its owning config");
  const config = resolved ? validateConfigSchema(JSON.parse(configContent)) : loadConfig(root);
  const currentConfig = loadConfig(root);
  if (resolved && canonicalJson(config.workspaces) !== canonicalJson(currentConfig.workspaces)) {
    throw new UsageError("workspace ownership changed across revisions; an explicit ownership migration is required");
  }
  const formatContent = resolved ? readRevisionFile(root, resolved, GRAPH_FORMAT_PATH)
    : containedPathExists({ root, relativePath: GRAPH_FORMAT_PATH }) ? readContainedFile({ root, relativePath: GRAPH_FORMAT_PATH }) : undefined;
  const format = formatContent === undefined ? { format_version: 1 } as const : parseGraphFormat(formatContent);
  const files: Record<string, string> = { ".mdkg/config.json": identityHash(configContent) };
  if (formatContent !== undefined) files[GRAPH_FORMAT_PATH] = identityHash(formatContent);
  const nodes: AuthoredNode[] = [];
  const templates = loadTemplateSchemas(root, currentConfig, ALLOWED_TYPES);
  const roots = getWorkspaceDocRoots(root, config);
  const owner = workspaceDocumentOwner(config);
  const worktreeFiles = resolved ? undefined : listWorkspaceDocFilesByAlias(root, config);
  let totalBytes = 0;
  for (const workspace of roots) {
    const wsPath = path.relative(root, workspace.root).split(path.sep).join("/");
    const paths: string[] = [];
    if (resolved) {
      const listing = readGraphGit(root, ["ls-tree", "-r", "-z", resolved, "--",
        ...["core", "design", "work", "archive"].map((folder) => `${wsPath}/${folder}`)])!;
      for (const entry of listing.split("\0").filter(Boolean)) {
        const match = /^(\d+) (\w+) ([0-9a-f]+)\t([\s\S]+)$/.exec(entry);
        if (!match) throw new UsageError("unclassifiable Git tree entry");
        if (owner(match[4]) !== workspace.alias || !match[4].endsWith(".md") || skipDocument(match[4], wsPath)) continue;
        if (match[2] !== "blob" || !/^100(644|755)$/.test(match[1])) throw new UsageError(`non-regular graph input: ${match[4]}`);
        paths.push(match[4]);
      }
    } else {
      paths.push(...(worktreeFiles?.[workspace.alias] ?? [])
        .map((filePath) => path.relative(root, filePath).split(path.sep).join("/"))
        .filter((filePath) => !skipDocument(filePath, wsPath)));
    }
    for (const relativePath of paths.sort()) {
      const content = resolved ? readRevisionFile(root, resolved, relativePath) : readContainedFile({ root, relativePath });
      if (content === undefined) throw new UsageError(`missing graph input: ${relativePath}`);
      totalBytes += Buffer.byteLength(content);
      if (Buffer.byteLength(content) > config.index.limits.max_file_bytes || nodes.length >= config.index.limits.max_files || totalBytes > config.index.limits.max_total_bytes) {
        throw new UsageError("graph snapshot exceeds configured discovery limits");
      }
      assertNoGraphConflictMarkers(content, relativePath);
      const node = parseNode(content, path.resolve(root, relativePath), {
        workStatusEnum: config.work.status_enum, priorityMin: config.work.priority_min,
        priorityMax: config.work.priority_max, templateSchemas: templates, deferArchiveIntegrity: true,
      });
      if (!resolved && node.type === "archive") {
        // Prove containment before the archive parser opens payload files.
        // Historical sidecars never borrow current filesystem bytes as proof.
        for (const key of ["stored_path", "compressed_path"]) {
          const payloadPath = path.posix.join(path.posix.dirname(relativePath), String(node.attributes[key]));
          containedPathExists({ root, relativePath: payloadPath });
        }
        parseNode(content, path.resolve(root, relativePath), {
          archiveRoot: root,
          workStatusEnum: config.work.status_enum, priorityMin: config.work.priority_min,
          priorityMax: config.work.priority_max, templateSchemas: templates,
        });
      }
      assertNodeFormat(format, node.identity, relativePath);
      const hash = identityHash(content);
      files[relativePath] = hash;
      nodes.push({ path: relativePath, ws: workspace.alias, qid: `${workspace.alias}:${node.id}`, hash, content, node });
    }
  }
  nodes.sort((a, b) => a.path.localeCompare(b.path));
  const identityEvidence = readIdentityEvidence(root, resolved ?? undefined);
  if (nodes.length + Object.keys(identityEvidence).length > config.index.limits.max_files ||
    totalBytes + Object.values(identityEvidence).reduce((sum, item) => sum + Buffer.byteLength(item.content), 0) > config.index.limits.max_total_bytes) {
    throw new UsageError("authored graph and identity evidence exceed configured discovery limits");
  }
  for (const [file, evidence] of Object.entries(identityEvidence)) files[file] = evidence.hash;
  return { revision: resolved, tree_hash: identityHash(canonicalJson(files)), config, format, files, nodes, identity_evidence: identityEvidence };
}

export type GraphControlSnapshot = {
  head: string | null;
  branch: string | null;
  git_index: string | null;
  selected_goal: string | null;
  runtime_db: string | null;
  runtime_wal?: string | null;
  runtime_journal?: string | null;
  validation_contract_hash: string;
  format: GraphFormat;
};

export function graphControlSnapshot(root: string): GraphControlSnapshot {
  const config = loadConfig(root);
  const schemas = loadTemplateSchemas(root, config, ALLOWED_TYPES);
  const validationContract = Object.fromEntries(Object.entries(schemas).map(([type, schema]) => [type, schema.keyKinds]));
  const fileHash = (relativePath: string): string | null => containedPathExists({ root, relativePath })
    ? identityHash(readContainedFile({ root, relativePath }, null)) : null;
  const indexPath = readGraphGit(root, ["rev-parse", "--git-path", "index"], true)?.trim();
  const absoluteIndex = indexPath ? path.resolve(root, indexPath) : undefined;
  if (absoluteIndex && fs.existsSync(absoluteIndex) && fs.lstatSync(absoluteIndex).isSymbolicLink()) {
    throw new UsageError("linked Git index is not a supported graph transaction input");
  }
  return {
    head: readGraphGit(root, ["rev-parse", "--verify", "HEAD"], true)?.trim() ?? null,
    branch: readGraphGit(root, ["symbolic-ref", "--quiet", "--short", "HEAD"], true)?.trim() ?? null,
    git_index: absoluteIndex && fs.existsSync(absoluteIndex) ? identityHash(fs.readFileSync(absoluteIndex)) : null,
    selected_goal: fileHash(".mdkg/state/selected-goal.json"),
    runtime_db: fileHash(config.db.runtime_path),
    runtime_wal: fileHash(`${config.db.runtime_path}-wal`),
    runtime_journal: fileHash(`${config.db.runtime_path}-journal`),
    validation_contract_hash: identityHash(canonicalJson(validationContract)),
    format: readGraphFormat(root),
  };
}

// Virtual strict validation gives migration/reconciliation previews the same
// graph rules without constructing temporary checkouts or writing cache files.
export function indexAuthoredSnapshot(snapshot: AuthoredSnapshot, externalNodes: Index["nodes"] = {}): Index {
  const nodes: Record<string, IndexNode> = {};
  const identities = new Set<string>();
  for (const entry of snapshot.nodes) {
    if (nodes[entry.qid]) throw new UsageError(`ambiguous alias ${entry.qid}; integrate reviewed identities before mutation`);
    assertNodeFormat(snapshot.format, entry.node.identity, entry.path);
    if (entry.node.identity) {
      const ref = identityRef(entry.node.identity);
      if (identities.has(ref)) throw new UsageError(`duplicate immutable identity ${ref}`);
      identities.add(ref);
    }
    const node = entry.node;
    const edges = { ...node.edges };
    const qualify = (value: string) => value.includes(":") ? value : `${entry.ws}:${value}`;
    for (const [key, value] of Object.entries(edges)) {
      (edges as unknown as Record<string, string | string[] | undefined>)[key] = typeof value === "string"
        ? qualify(value) : Array.isArray(value) ? value.map(qualify) : value;
    }
    nodes[entry.qid] = {
      id: node.id, qid: entry.qid, ws: entry.ws, path: entry.path,
      ...(node.identity ? { identity: node.identity } : {}),
      type: node.type, title: node.title, status: node.status, priority: node.priority,
      created: node.created, updated: node.updated, tags: node.tags, owners: node.owners,
      links: node.links, artifacts: node.artifacts, refs: [...node.refs], aliases: node.aliases,
      skills: node.skills, attributes: { ...node.attributes }, edges,
    };
  }
  for (const node of Object.values(externalNodes)) {
    if (!node.source?.imported || !node.source.read_only || nodes[node.qid]) throw new UsageError("invalid or overlapping read-only source projection");
    nodes[node.qid] = { ...node, refs: [...node.refs], attributes: { ...node.attributes }, edges: { ...node.edges } };
  }
  normalizeIndexIdentityReferences({ nodes });
  const reverseEdges: Index["reverse_edges"] = {};
  for (const node of Object.values(nodes)) {
    for (const [key, value] of Object.entries(node.edges)) {
      for (const target of typeof value === "string" ? [value] : value ?? []) {
        reverseEdges[key] ??= {};
        reverseEdges[key][target] ??= [];
        reverseEdges[key][target].push(node.qid);
      }
    }
  }
  const workspaces: Index["workspaces"] = {};
  for (const [alias, entry] of Object.entries(snapshot.config.workspaces)) {
    workspaces[alias] = { path: entry.path, enabled: entry.enabled };
  }
  const index: Index = {
    meta: { tool: snapshot.config.tool, schema_version: snapshot.config.schema_version,
      generated_at: "1970-01-01T00:00:00.000Z", root: ".", workspaces: Object.keys(workspaces).sort(),
      ...(snapshot.format.format_version === 2 ? { graph_format: snapshot.format } : {}),
    },
    workspaces, nodes, reverse_edges: reverseEdges,
  };
  validateGraph(index, { allowMissing: false, externalWorkspaces: new Set(Object.keys(snapshot.config.subgraphs)) });
  return index;
}
