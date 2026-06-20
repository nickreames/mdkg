import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { loadConfig } from "../core/config";
import { verifyProjectDb } from "../core/project_db_migrations";
import { readPackageVersion } from "../core/version";
import { resolveCapabilitiesIndexPath } from "../graph/capabilities_indexer";
import { isCapabilitiesIndexStale } from "../graph/capabilities_index_cache";
import { loadIndex } from "../graph/index_cache";
import { Index } from "../graph/indexer";
import { resolveSkillsIndexPath } from "../graph/skills_indexer";
import { isSkillsIndexStale } from "../graph/skills_index_cache";
import { isIndexStale } from "../graph/staleness";
import { resolveSubgraphsIndexPath, isSubgraphsIndexStale } from "../graph/subgraphs";
import { collectGraphErrors } from "../graph/validate_graph";

export type StatusCommandOptions = {
  root: string;
  json?: boolean;
};

type StatusLevel = "ok" | "warn" | "fail";

type CacheStatus = {
  path: string;
  exists: boolean;
  stale: boolean | null;
};

type SelectedGoalState = {
  qid: string;
  id: string;
  ws: string;
  selected_at: string;
};

function rel(root: string, target: string): string {
  return path.relative(root, target).replace(/\\/g, "/") || ".";
}

function runGit(root: string, args: string[]): string | undefined {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
  if (result.status !== 0) {
    return undefined;
  }
  return result.stdout.trim();
}

function gitStatus(root: string) {
  const inside = runGit(root, ["rev-parse", "--is-inside-work-tree"]) === "true";
  if (!inside) {
    return {
      inside: false,
      branch: null,
      dirty: false,
      dirty_count: 0,
      untracked_count: 0,
      ahead: null,
      behind: null,
    };
  }

  const branch = runGit(root, ["rev-parse", "--abbrev-ref", "HEAD"]) ?? null;
  const porcelain = runGit(root, ["status", "--porcelain"]) ?? "";
  const lines = porcelain.split(/\r?\n/).filter(Boolean);
  const untracked = lines.filter((line) => line.startsWith("??")).length;
  const aheadBehindRaw = runGit(root, ["rev-list", "--left-right", "--count", "HEAD...@{upstream}"]);
  const [aheadRaw, behindRaw] = aheadBehindRaw ? aheadBehindRaw.split(/\s+/) : [];

  return {
    inside: true,
    branch,
    dirty: lines.length > 0,
    dirty_count: lines.length,
    untracked_count: untracked,
    ahead: aheadRaw === undefined ? null : Number.parseInt(aheadRaw, 10),
    behind: behindRaw === undefined ? null : Number.parseInt(behindRaw, 10),
  };
}

function cacheStatus(
  root: string,
  filePath: string,
  stale: () => boolean
): CacheStatus {
  let staleValue: boolean | null = null;
  try {
    staleValue = stale();
  } catch {
    staleValue = null;
  }
  return {
    path: rel(root, filePath),
    exists: fs.existsSync(filePath),
    stale: staleValue,
  };
}

function readSelectedGoalState(root: string): { state: SelectedGoalState | null; warning?: string } {
  const filePath = path.join(root, ".mdkg", "state", "selected-goal.json");
  if (!fs.existsSync(filePath)) {
    return { state: null };
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
        state: {
          qid: parsed.qid.toLowerCase(),
          id: parsed.id.toLowerCase(),
          ws: parsed.ws.toLowerCase(),
          selected_at: parsed.selected_at,
        },
      };
    }
    return { state: null, warning: "selected goal state is malformed" };
  } catch {
    return { state: null, warning: "selected goal state is unreadable" };
  }
}

function releaseStatus(root: string) {
  const version = readPackageVersion();
  const changelogPath = path.join(root, "CHANGELOG.md");
  const changelogHasVersion = fs.existsSync(changelogPath)
    ? fs.readFileSync(changelogPath, "utf8").includes(`## ${version}`) ||
      fs.readFileSync(changelogPath, "utf8").includes(`## [${version}]`)
    : false;
  return {
    package_version: version,
    changelog_path: fs.existsSync(changelogPath) ? "CHANGELOG.md" : null,
    changelog_has_version: changelogHasVersion,
  };
}

export function collectStatus(root: string) {
  const warnings: string[] = [];
  const errors: string[] = [];
  const config = loadConfig(root);
  let index: Index | undefined;
  let graphStale = false;
  let graphWarnings: string[] = [];
  let graphErrors: string[] = [];

  try {
    const loaded = loadIndex({
      root,
      config,
      useCache: true,
      allowReindex: false,
      includeImports: true,
    });
    index = loaded.index;
    graphStale = loaded.stale;
    graphWarnings = loaded.warnings;
    graphErrors = collectGraphErrors(loaded.index);
  } catch (err) {
    graphStale = true;
    graphErrors = [err instanceof Error ? err.message : String(err)];
  }

  const selected = readSelectedGoalState(root);
  if (selected.warning) {
    warnings.push(selected.warning);
  }
  const selectedNode = selected.state && index ? index.nodes[selected.state.qid] : undefined;
  const selectedAchieved =
    selectedNode?.status === "done" || String(selectedNode?.attributes.goal_state ?? "") === "achieved";
  const selectedMissing = selected.state !== null && !selectedNode;
  if (selectedMissing) {
    warnings.push("selected goal is missing from the graph index");
  }
  if (selectedAchieved) {
    warnings.push("selected goal is already achieved");
  }

  const git = gitStatus(root);
  if (git.inside && git.dirty) {
    warnings.push(`git worktree is dirty (${git.dirty_count} changed paths)`);
  }

  const generated = {
    index: cacheStatus(root, path.resolve(root, config.index.global_index_path), () => isIndexStale(root, config)),
    skills: cacheStatus(root, resolveSkillsIndexPath(root), () => isSkillsIndexStale(root, config)),
    capabilities: cacheStatus(root, resolveCapabilitiesIndexPath(root, config), () =>
      isCapabilitiesIndexStale(root, config)
    ),
    subgraphs: cacheStatus(root, resolveSubgraphsIndexPath(root), () => isSubgraphsIndexStale(root, config)),
  };

  let db:
    | {
        enabled: boolean;
        ok: boolean | null;
        database: string | null;
        failure_count: number;
        warning_count: number;
      }
    | {
        enabled: false;
        ok: null;
        database: null;
        failure_count: 0;
        warning_count: 0;
      } = {
    enabled: false,
    ok: null,
    database: null,
    failure_count: 0,
    warning_count: 0,
  };
  if (config.db.enabled) {
    const verification = verifyProjectDb(root, config);
    db = {
      enabled: verification.enabled,
      ok: verification.ok,
      database: verification.database,
      failure_count: verification.failure_count,
      warning_count: verification.warning_count,
    };
  }

  if (graphErrors.length > 0) {
    errors.push(...graphErrors.map((error) => `graph: ${error}`));
  }
  if (db.enabled && db.ok === false) {
    errors.push("db: project DB verification failed");
  }
  if (graphStale) {
    warnings.push("graph index cache is stale");
  }
  warnings.push(...graphWarnings.map((warning) => `graph: ${warning}`));
  const cacheEntries: Array<[string, CacheStatus, boolean]> = [
    ["index", generated.index, true],
    ["skills", generated.skills, true],
    ["capabilities", generated.capabilities, true],
    ["subgraphs", generated.subgraphs, Object.keys(config.subgraphs).length > 0],
  ];
  for (const [name, cache, required] of cacheEntries) {
    if (!required) {
      continue;
    }
    if (!cache.exists) {
      warnings.push(`${name} cache is missing`);
    } else if (cache.stale) {
      warnings.push(`${name} cache is stale`);
    }
  }

  const level: StatusLevel = errors.length > 0 ? "fail" : warnings.length > 0 ? "warn" : "ok";

  return {
    action: "status",
    ok: errors.length === 0,
    level,
    root,
    mdkg: {
      version: readPackageVersion(),
      config_schema_version: config.schema_version,
      index_backend: config.index.backend,
    },
    git,
    release: releaseStatus(root),
    graph: {
      ok: graphErrors.length === 0,
      node_count: index ? Object.keys(index.nodes).length : null,
      workspace_count: index ? Object.keys(index.workspaces).length : null,
      stale: graphStale,
      warning_count: graphWarnings.length,
      error_count: graphErrors.length,
    },
    goal: {
      selected: selected.state,
      selected_exists: selected.state === null ? null : !selectedMissing,
      selected_achieved: selected.state === null ? null : selectedAchieved,
      active_node: selectedNode?.attributes.active_node ?? null,
      last_active_node: selectedNode?.attributes.last_active_node ?? null,
      goal_state: selectedNode?.attributes.goal_state ?? null,
      status: selectedNode?.status ?? null,
    },
    db,
    generated,
    summary: {
      level,
      warning_count: warnings.length,
      error_count: errors.length,
      warnings,
      errors,
    },
  };
}

export function runStatusCommand(options: StatusCommandOptions): void {
  const payload = collectStatus(options.root);
  if (options.json) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  console.log(`status ${payload.level}`);
  console.log(`root: ${payload.root}`);
  console.log(`mdkg: ${payload.mdkg.version}`);
  console.log(`git: ${payload.git.inside ? `${payload.git.branch ?? "detached"} dirty=${payload.git.dirty}` : "not a git repo"}`);
  console.log(`graph: ${payload.graph.ok ? "ok" : "fail"} nodes=${payload.graph.node_count ?? "unknown"} stale=${payload.graph.stale}`);
  console.log(`db: ${payload.db.enabled ? (payload.db.ok ? "ok" : "fail") : "disabled"}`);
  if (payload.goal.selected) {
    console.log(
      `goal: ${payload.goal.selected.qid} status=${payload.goal.status ?? "unknown"} state=${payload.goal.goal_state ?? "unknown"}`
    );
  } else {
    console.log("goal: none selected");
  }
  for (const warning of payload.summary.warnings) {
    console.log(`warn: ${warning}`);
  }
  for (const error of payload.summary.errors) {
    console.log(`fail: ${error}`);
  }
}
