import fs from "fs";
import path from "path";
import { loadConfig } from "../core/config";
import { loadIndex } from "../graph/index_cache";
import { loadCapabilitiesIndex } from "../graph/capabilities_index_cache";
import { buildSubgraphsIndex } from "../graph/subgraphs";
import { ALLOWED_TYPES } from "../graph/node";
import { loadTemplateSchemasWithInfo } from "../graph/template_schema";
import { collectVisibilityViolations, visibilityViolationMessages } from "../graph/visibility";
import { isSqliteBackend, sqliteHealth } from "../graph/sqlite_index";
import { listProjectDbRuntimePolicyFiles } from "../core/project_db";
import { verifyProjectDb } from "../core/project_db_migrations";
import { ValidationError } from "../util/errors";

export type DoctorCommandOptions = {
  root: string;
  noCache?: boolean;
  noReindex?: boolean;
  json?: boolean;
  strict?: boolean;
};

type CheckResult = {
  id: string;
  name: string;
  ok: boolean;
  level?: "ok" | "warn" | "fail";
  detail: string;
  status: "pass" | "warn" | "fail" | "info";
  severity: "info" | "warning" | "error";
  message: string;
  remediation: string;
  refs?: string[];
  strictFail?: boolean;
};

const REQUIRED_NODE_MAJOR = 24;
const REQUIRED_NODE_MINOR = 15;
const ARCHIVE_RAW_ALLOWED_DIRS = new Set(["source"]);
const SELECTED_GOAL_STATE_PATH = path.join(".mdkg", "state", "selected-goal.json");

type CheckInput = {
  id: string;
  name: string;
  ok: boolean;
  detail: string;
  level?: "ok" | "warn" | "fail";
  message?: string;
  remediation?: string;
  refs?: string[];
  strictFail?: boolean;
};

type SelectedGoalState = {
  qid: string;
  id: string;
  ws: string;
  selected_at: string;
};

function makeCheck(input: CheckInput): CheckResult {
  const level = input.level ?? (input.ok ? undefined : "fail");
  const effectiveLevel = level ?? "ok";
  const status: CheckResult["status"] = !input.ok || effectiveLevel === "fail" ? "fail" : effectiveLevel === "warn" ? "warn" : "pass";
  const severity: CheckResult["severity"] = status === "fail" ? "error" : status === "warn" ? "warning" : "info";
  return {
    id: input.id,
    name: input.name,
    ok: input.ok,
    level,
    detail: input.detail,
    status,
    severity,
    message: input.message ?? input.detail,
    remediation: input.remediation ?? "No action required.",
    refs: input.refs,
    strictFail: input.strictFail,
  };
}

function publicCheck(result: CheckResult): Omit<CheckResult, "strictFail"> {
  const { strictFail: _strictFail, ...publicResult } = result;
  return publicResult;
}

function parseNodeVersion(version: string): { major: number; minor: number; patch: number } | null {
  const [majorRaw, minorRaw, patchRaw] = version.split(".");
  const major = Number.parseInt(majorRaw ?? "", 10);
  const minor = Number.parseInt(minorRaw ?? "", 10);
  const patch = Number.parseInt(patchRaw ?? "", 10);
  if (!Number.isInteger(major) || !Number.isInteger(minor) || !Number.isInteger(patch)) {
    return null;
  }
  return { major, minor, patch };
}

function runNodeVersionCheck(): CheckResult {
  const nodeVersion = process.versions.node;
  const parsed = parseNodeVersion(nodeVersion);
  if (parsed === null) {
    return makeCheck({
      id: "runtime.node_version",
      name: "node-version",
      ok: false,
      detail: `unable to parse Node.js version: ${nodeVersion}`,
      remediation: `Run mdkg with Node.js >=${REQUIRED_NODE_MAJOR}.${REQUIRED_NODE_MINOR}.0.`,
    });
  }
  if (
    parsed.major < REQUIRED_NODE_MAJOR ||
    (parsed.major === REQUIRED_NODE_MAJOR && parsed.minor < REQUIRED_NODE_MINOR)
  ) {
    return makeCheck({
      id: "runtime.node_version",
      name: "node-version",
      ok: false,
      detail: `Node.js ${nodeVersion} is unsupported (requires >=${REQUIRED_NODE_MAJOR}.${REQUIRED_NODE_MINOR}.0)`,
      remediation: `Install Node.js >=${REQUIRED_NODE_MAJOR}.${REQUIRED_NODE_MINOR}.0 and rerun mdkg.`,
    });
  }
  return makeCheck({
    id: "runtime.node_version",
    name: "node-version",
    ok: true,
    detail: `Node.js ${nodeVersion} (ok)`,
  });
}

function runSqliteCheck(root: string, config: ReturnType<typeof loadConfig>): CheckResult {
  if (!isSqliteBackend(config)) {
    return makeCheck({
      id: "graph.sqlite_cache",
      name: "sqlite-cache",
      ok: true,
      detail: "SQLite backend disabled; JSON cache backend active",
    });
  }
  const health = sqliteHealth(root, config);
  if (health.errors.length > 0) {
    return makeCheck({
      id: "graph.sqlite_cache",
      name: "sqlite-cache",
      ok: false,
      detail: health.errors.join("; "),
      remediation: "Run `mdkg index` to rebuild the SQLite graph cache.",
    });
  }
  if (health.warnings.length > 0) {
    return makeCheck({
      id: "graph.sqlite_cache",
      name: "sqlite-cache",
      ok: true,
      level: "warn",
      detail: health.warnings.join("; "),
      remediation: "Run `mdkg index` to refresh the SQLite graph cache.",
      strictFail: true,
    });
  }
  return makeCheck({
    id: "graph.sqlite_cache",
    name: "sqlite-cache",
    ok: true,
    detail: `.mdkg SQLite cache ok (${health.size} bytes)`,
  });
}

function walkFiles(root: string): string[] {
  if (!fs.existsSync(root)) {
    return [];
  }
  const entries = fs.readdirSync(root, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

function runArchiveStorageCheck(root: string): CheckResult {
  const archiveRoot = path.join(root, ".mdkg", "archive");
  const files = walkFiles(archiveRoot);
  const strayRaw = files
    .filter((filePath) => {
      const relative = path.relative(archiveRoot, filePath).split(path.sep);
      const ext = path.extname(filePath).toLowerCase();
      if (ext === ".md" || ext === ".zip") {
        return false;
      }
      return !relative.some((segment) => ARCHIVE_RAW_ALLOWED_DIRS.has(segment));
    })
    .map((filePath) => path.relative(root, filePath).split(path.sep).join("/"))
    .sort();

  if (strayRaw.length === 0) {
    return makeCheck({
      id: "archive.storage",
      name: "archive-storage",
      ok: true,
      detail: ".mdkg/archive has no stray raw files outside managed source directories",
    });
  }
  return makeCheck({
    id: "archive.storage",
    name: "archive-storage",
    ok: true,
    level: "warn",
    detail: `stray uncompressed archive file(s) found without managed sidecars: ${strayRaw.join(", ")}; these are storage hygiene warnings, not source defects`,
    remediation: "Either run `mdkg archive add <file>` to create a managed sidecar, move raw files under an existing managed archive source directory, or remove unintended local files before committing.",
    refs: strayRaw,
  });
}

function runArchiveLargeCacheCheck(root: string, warningBytes: number): CheckResult {
  if (warningBytes === 0) {
    return makeCheck({
      id: "archive.large_cache",
      name: "archive-large-cache",
      ok: true,
      detail: "archive large-cache warning disabled",
    });
  }
  const archiveRoot = path.join(root, ".mdkg", "archive");
  const largeCaches = walkFiles(archiveRoot)
    .filter((filePath) => filePath.endsWith(".zip"))
    .map((filePath) => ({
      path: path.relative(root, filePath).split(path.sep).join("/"),
      size: fs.statSync(filePath).size,
    }))
    .filter((entry) => entry.size > warningBytes)
    .sort((a, b) => a.path.localeCompare(b.path));

  if (largeCaches.length === 0) {
    return makeCheck({
      id: "archive.large_cache",
      name: "archive-large-cache",
      ok: true,
      detail: `no archive ZIP cache exceeds ${warningBytes} bytes`,
    });
  }

  return makeCheck({
    id: "archive.large_cache",
    name: "archive-large-cache",
    ok: true,
    level: "warn",
    detail: `archive ZIP cache(s) exceed ${warningBytes} bytes: ${largeCaches
      .map((entry) => `${entry.path} (${entry.size} bytes)`)
      .join(", ")}; keep large caches private or move bulky originals to repo policy-managed storage`,
    remediation: "Keep large caches private or move bulky originals to repo policy-managed storage.",
    refs: largeCaches.map((entry) => entry.path),
  });
}

function runBundleStorageCheck(root: string, outputDir: string): CheckResult {
  const bundleRoot = path.resolve(root, outputDir);
  if (!fs.existsSync(bundleRoot)) {
    return makeCheck({
      id: "bundle.storage",
      name: "bundle-storage",
      ok: true,
      detail: `no bundle directory found; run \`mdkg bundle create --profile private\` when a snapshot should be tracked`,
      remediation: "Run `mdkg bundle create --profile private` when a snapshot should be tracked.",
    });
  }
  const bundles = walkFiles(bundleRoot)
    .filter((filePath) => filePath.endsWith(".mdkg.zip"))
    .map((filePath) => path.relative(root, filePath).split(path.sep).join("/"))
    .sort();
  if (bundles.length === 0) {
    return makeCheck({
      id: "bundle.storage",
      name: "bundle-storage",
      ok: true,
      detail: `bundle directory has no .mdkg.zip files; run \`mdkg bundle create --profile private\` when a snapshot should be tracked`,
      remediation: "Run `mdkg bundle create --profile private` when a snapshot should be tracked.",
    });
  }
  return makeCheck({
    id: "bundle.storage",
    name: "bundle-storage",
    ok: true,
    detail: `${bundles.length} bundle(s) found; run \`mdkg bundle verify <path>\` to check freshness before handoff`,
    remediation: "Run `mdkg bundle verify <path>` to check freshness before handoff.",
    refs: bundles,
  });
}

function runProjectDbRuntimePolicyCheck(root: string): CheckResult {
  const files = listProjectDbRuntimePolicyFiles(root);
  if (files.length === 0) {
    return makeCheck({
      id: "db.runtime_transient_files",
      name: "project-db-runtime",
      ok: true,
      detail: "no active project DB runtime or transient files found",
    });
  }
  return makeCheck({
    id: "db.runtime_transient_files",
    name: "project-db-runtime",
    ok: true,
    level: "warn",
    detail: `active project DB runtime/transient file(s) are local-only and should not be committed: ${files.join(", ")}; this is expected local state when \`mdkg db verify\` passes`,
    remediation: "Keep runtime DB and transient files ignored, run `mdkg db verify --json` if DB health is in question, and commit sealed state only by explicit repo policy.",
    refs: files,
  });
}

function runSubgraphChecks(root: string, config: ReturnType<typeof loadConfig>): CheckResult[] {
  const projection = buildSubgraphsIndex(root, config);
  if (projection.index.subgraphs.length === 0) {
    return [
      makeCheck({
        id: "subgraph.configured_state",
        name: "subgraphs",
        ok: true,
        detail: "no subgraphs configured",
      }),
    ];
  }
  return projection.index.subgraphs.map((item) => {
    if (!item.enabled) {
      return makeCheck({
        id: "subgraph.configured_state",
        name: `subgraph:${item.alias}`,
        ok: true,
        level: "warn" as const,
        detail: "disabled subgraph",
        remediation: `Run \`mdkg subgraph enable ${item.alias}\` if this subgraph should participate in graph views.`,
        refs: [item.alias],
      });
    }
    if (item.error_count > 0) {
      return makeCheck({
        id: "subgraph.configured_state",
        name: `subgraph:${item.alias}`,
        ok: false,
        detail: item.errors.join("; "),
        remediation: `Run \`mdkg subgraph verify ${item.alias} --json\` and refresh or remove the failing bundle source.`,
        refs: [item.alias],
      });
    }
    if (item.stale || item.warning_count > 0) {
      return makeCheck({
        id: "subgraph.configured_state",
        name: `subgraph:${item.alias}`,
        ok: true,
        level: "warn" as const,
        detail: `subgraph is stale or has warnings; run \`mdkg subgraph verify ${item.alias}\` (${item.warnings.join("; ")})`,
        remediation: `Run \`mdkg subgraph verify ${item.alias}\` and refresh stale sources if needed.`,
        refs: [item.alias],
      });
    }
    return makeCheck({
      id: "subgraph.configured_state",
      name: `subgraph:${item.alias}`,
      ok: true,
      detail: `subgraph loaded from ${item.sources.map((source) => source.path).join(", ")}`,
      refs: [item.alias],
    });
  });
}

function runVisibilityPolicyCheck(
  root: string,
  config: ReturnType<typeof loadConfig>,
  options: Pick<DoctorCommandOptions, "noCache" | "noReindex" | "strict">
): CheckResult {
  try {
    const { index } = loadIndex({
      root,
      config,
      useCache: !options.noCache,
      allowReindex: !options.noReindex && !options.strict,
    });
    const messages = visibilityViolationMessages(collectVisibilityViolations(index, config));
    if (messages.length === 0) {
      return makeCheck({
        id: "visibility.policy",
        name: "visibility-policy",
        ok: true,
        detail: "public/internal records do not reference less-visible mdkg records",
      });
    }
    return makeCheck({
      id: "visibility.policy",
      name: "visibility-policy",
      ok: false,
      detail: `${messages.length} violation(s): ${messages.join("; ")}`,
      remediation: "Adjust visibility metadata or remove references from more-visible records to less-visible records.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return makeCheck({
      id: "visibility.policy",
      name: "visibility-policy",
      ok: false,
      detail: message,
      remediation: "Run `mdkg validate --json` for graph visibility diagnostics.",
    });
  }
}

function readSelectedGoalState(root: string): { state?: SelectedGoalState; warning?: string } {
  const filePath = path.join(root, SELECTED_GOAL_STATE_PATH);
  if (!fs.existsSync(filePath)) {
    return {};
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
    return { warning: "selected goal state is malformed" };
  } catch {
    return { warning: "selected goal state is unreadable" };
  }
}

function runSelectedGoalChecks(
  root: string,
  config: ReturnType<typeof loadConfig>,
  options: Pick<DoctorCommandOptions, "noCache" | "noReindex" | "strict">
): CheckResult[] {
  const selected = readSelectedGoalState(root);
  if (selected.warning) {
    return [
      makeCheck({
        id: "goal.selected_missing",
        name: "selected-goal",
        ok: true,
        level: "warn",
        detail: selected.warning,
        remediation: "Run `mdkg goal clear --json` when no repo-local goal should be selected, or create/select a repo-local active goal only when work is continuing.",
        strictFail: true,
      }),
    ];
  }
  if (!selected.state) {
    return [
      makeCheck({
        id: "goal.selected_missing",
        name: "selected-goal",
        ok: true,
        detail: "no selected goal state found",
        remediation: "Run `mdkg goal select <goal-id>` when pursuing a long-running goal.",
      }),
    ];
  }

  try {
    const { index } = loadIndex({
      root,
      config,
      useCache: !options.noCache,
      allowReindex: !options.noReindex && !options.strict,
    });
    const node = index.nodes[selected.state.qid];
    if (!node) {
      return [
        makeCheck({
          id: "goal.selected_missing",
          name: "selected-goal",
          ok: true,
          level: "warn",
          detail: `selected goal ${selected.state.qid} is missing from the graph`,
          remediation: "Run `mdkg goal clear --json` when no repo-local goal should be selected, or `mdkg goal activate <goal-id> --json` for the next active repo-local goal.",
          refs: [selected.state.qid],
          strictFail: true,
        }),
      ];
    }
    const achieved = node.status === "done" || String(node.attributes.goal_state ?? "") === "achieved";
    if (achieved) {
      return [
        makeCheck({
          id: "goal.selected_achieved",
          name: "selected-goal",
          ok: true,
          level: "warn",
          detail: `selected goal ${selected.state.qid} is achieved but still current`,
          remediation: "Run `mdkg goal clear --json` for an achieved current goal, or `mdkg goal activate <goal-id> --json` only when a new repo-local goal should become active. Root orchestrators should not mutate dirty child repos without approval.",
          refs: [selected.state.qid],
          strictFail: true,
        }),
      ];
    }
    return [
      makeCheck({
        id: "goal.selected_achieved",
        name: "selected-goal",
        ok: true,
        detail: `selected goal ${selected.state.qid} is active`,
        refs: [selected.state.qid],
      }),
    ];
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return [
      makeCheck({
        id: "goal.selected_missing",
        name: "selected-goal",
        ok: true,
        level: "warn",
        detail: `selected goal could not be checked: ${message}`,
        remediation: "Run `mdkg index` and `mdkg goal current --json` to inspect selected-goal state.",
        refs: [selected.state.qid],
        strictFail: true,
      }),
    ];
  }
}

function runProjectDbVerifyCheck(root: string, config: ReturnType<typeof loadConfig>): CheckResult {
  if (!config.db.enabled) {
    return makeCheck({
      id: "db.project_verify",
      name: "project-db-verify",
      ok: true,
      detail: "project DB is disabled",
      remediation: "Run `mdkg db init` only when project DB state is needed.",
    });
  }
  const verification = verifyProjectDb(root, config);
  if (verification.ok) {
    return makeCheck({
      id: "db.project_verify",
      name: "project-db-verify",
      ok: true,
      detail: `project DB verified (${verification.database})`,
      refs: [verification.database],
    });
  }
  return makeCheck({
    id: "db.project_verify",
    name: "project-db-verify",
    ok: true,
    level: "warn",
    detail: verification.errors.join("; "),
    remediation: "Run `mdkg db verify --json`, then `mdkg db init` or `mdkg db migrate` as directed.",
    refs: [verification.database],
    strictFail: true,
  });
}

function applyStrict(results: CheckResult[], strict: boolean | undefined): CheckResult[] {
  if (!strict) {
    return results;
  }
  return results.map((result) => {
    if (!result.strictFail || !result.ok) {
      return result;
    }
    return {
      ...result,
      ok: false,
      level: "fail",
      status: "fail",
      severity: "error",
    };
  });
}

export function runDoctorCommand(options: DoctorCommandOptions): void {
  const results: CheckResult[] = [];
  const strict = options.strict ?? false;

  results.push(runNodeVersionCheck());

  const configPath = path.resolve(options.root, ".mdkg", "config.json");
  if (!fs.existsSync(configPath)) {
    results.push(makeCheck({
      id: "repo.root_config",
      name: "config",
      ok: false,
      detail: `missing config at ${configPath}`,
      remediation: "Run from a repo root, pass `--root <path>`, or run `mdkg init`.",
      refs: [path.relative(options.root, configPath).split(path.sep).join("/")],
    }));
  } else {
    results.push(makeCheck({
      id: "repo.root_config",
      name: "config",
      ok: true,
      detail: `found ${configPath}`,
      refs: [path.relative(options.root, configPath).split(path.sep).join("/")],
    }));
  }

  let config: ReturnType<typeof loadConfig> | undefined;
  try {
    config = loadConfig(options.root);
    results.push(makeCheck({
      id: "repo.root_config",
      name: "config-schema",
      ok: true,
      detail: "config schema valid",
    }));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    results.push(makeCheck({
      id: "repo.root_config",
      name: "config-schema",
      ok: false,
      detail: message,
      remediation: "Fix `.mdkg/config.json` and rerun `mdkg doctor`.",
      refs: [".mdkg/config.json"],
    }));
  }

  if (config) {
    results.push(runArchiveStorageCheck(options.root));
    results.push(runArchiveLargeCacheCheck(options.root, config.archive.large_cache_warning_bytes));
    results.push(runBundleStorageCheck(options.root, config.bundles.output_dir));
    results.push(runProjectDbRuntimePolicyCheck(options.root));
    results.push(runProjectDbVerifyCheck(options.root, config));
    results.push(runSqliteCheck(options.root, config));
    results.push(...runSubgraphChecks(options.root, config));
    results.push(runVisibilityPolicyCheck(options.root, config, options));
    results.push(...runSelectedGoalChecks(options.root, config, options));

    try {
      const templateSchemaInfo = loadTemplateSchemasWithInfo(options.root, config, ALLOWED_TYPES);
      results.push(makeCheck({
        id: "repo.templates",
        name: "templates",
        ok: true,
        detail: "template schema set loaded",
      }));
      if (templateSchemaInfo.fallbackTypes.length > 0) {
        results.push(makeCheck({
          id: "repo.templates",
          name: "local-templates",
          ok: true,
          level: "warn",
          detail: `missing local template schema(s) covered by bundled fallback: ${templateSchemaInfo.fallbackTypes.join(", ")}; run \`mdkg upgrade --apply\` to vendor them`,
          remediation: "Run `mdkg upgrade --apply` to vendor missing managed template schemas.",
          refs: templateSchemaInfo.fallbackTypes,
        }));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      results.push(makeCheck({
        id: "repo.templates",
        name: "templates",
        ok: false,
        detail: message,
        remediation: "Repair `.mdkg/templates` or run `mdkg upgrade --apply` when managed assets should be restored.",
      }));
    }

    try {
      const { rebuilt, stale } = loadIndex({
        root: options.root,
        config,
        useCache: !options.noCache,
        allowReindex: !options.noReindex && !strict,
      });
      if (rebuilt) {
        results.push(makeCheck({
          id: "graph.index_cache",
          name: "index",
          ok: true,
          detail: "index cache rebuilt and loaded",
          remediation: "No action required; non-strict doctor rebuilt the cache.",
        }));
      } else if (stale) {
        results.push(makeCheck({
          id: "graph.index_cache",
          name: "index",
          ok: true,
          level: "warn",
          detail: "index cache is stale (run mdkg index to refresh)",
          remediation: "Run `mdkg index` to refresh generated graph caches.",
          strictFail: true,
        }));
      } else {
        results.push(makeCheck({
          id: "graph.index_cache",
          name: "index",
          ok: true,
          detail: "index cache loaded",
        }));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      results.push(makeCheck({
        id: "graph.validate",
        name: "index",
        ok: false,
        detail: message,
        remediation: "Run `mdkg validate --json` and repair graph errors, then run `mdkg index`.",
      }));
    }

    try {
      const { rebuilt, stale } = loadCapabilitiesIndex({
        root: options.root,
        config,
        useCache: !options.noCache,
        allowReindex: !options.noReindex && !strict,
      });
      if (rebuilt) {
        results.push(makeCheck({
          id: "graph.capability_cache",
          name: "capabilities-index",
          ok: true,
          detail: "capabilities cache rebuilt and loaded",
          remediation: "No action required; non-strict doctor rebuilt the cache.",
        }));
      } else if (stale) {
        results.push(makeCheck({
          id: "graph.capability_cache",
          name: "capabilities-index",
          ok: true,
          level: "warn",
          detail: "capabilities cache is stale (run mdkg index to refresh)",
          remediation: "Run `mdkg index` to refresh generated capability caches.",
          strictFail: true,
        }));
      } else {
        results.push(makeCheck({
          id: "graph.capability_cache",
          name: "capabilities-index",
          ok: true,
          detail: "capabilities cache loaded",
        }));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      results.push(makeCheck({
        id: "graph.capability_cache",
        name: "capabilities-index",
        ok: false,
        detail: message,
        remediation: "Run `mdkg index` to rebuild generated capability caches.",
      }));
    }
  }

  const finalResults = applyStrict(results, strict);
  const publicResults = finalResults.map(publicCheck);
  const summary = {
    ok: finalResults.every((result) => result.ok),
    errors: finalResults.filter((result) => result.severity === "error").length,
    warnings: finalResults.filter((result) => result.severity === "warning").length,
    infos: finalResults.filter((result) => result.severity === "info").length,
  };
  const failures = finalResults.filter((result) => !result.ok);
  if (options.json) {
    const payload = {
      action: "doctor",
      ok: failures.length === 0,
      strict,
      checks: publicResults,
      summary,
      failure_count: failures.length,
    };
    console.log(JSON.stringify(payload, null, 2));
  } else {
    for (const result of finalResults) {
      const prefix = result.ok ? result.level ?? "ok" : "fail";
      console.log(`${prefix}: ${result.name} - ${result.detail}`);
    }
  }

  if (failures.length > 0) {
    throw new ValidationError(`doctor failed with ${failures.length} issue(s)`);
  }
  if (!options.json) {
    console.log("doctor ok");
  }
}
