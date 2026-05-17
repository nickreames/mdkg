import fs from "fs";
import path from "path";
import { loadConfig } from "../core/config";
import { loadIndex } from "../graph/index_cache";
import { loadCapabilitiesIndex } from "../graph/capabilities_index_cache";
import { ALLOWED_TYPES } from "../graph/node";
import { loadTemplateSchemasWithInfo } from "../graph/template_schema";
import { ValidationError } from "../util/errors";

export type DoctorCommandOptions = {
  root: string;
  noCache?: boolean;
  noReindex?: boolean;
  json?: boolean;
};

type CheckResult = {
  name: string;
  ok: boolean;
  level?: "ok" | "warn" | "fail";
  detail: string;
};

const REQUIRED_NODE_MAJOR = 18;
const ARCHIVE_RAW_ALLOWED_DIRS = new Set(["source"]);

function parseNodeMajor(version: string): number | null {
  const major = Number.parseInt(version.split(".")[0] ?? "", 10);
  if (!Number.isInteger(major)) {
    return null;
  }
  return major;
}

function runNodeVersionCheck(): CheckResult {
  const nodeVersion = process.versions.node;
  const major = parseNodeMajor(nodeVersion);
  if (major === null) {
    return {
      name: "node-version",
      ok: false,
      detail: `unable to parse Node.js version: ${nodeVersion}`,
    };
  }
  if (major < REQUIRED_NODE_MAJOR) {
    return {
      name: "node-version",
      ok: false,
      detail: `Node.js ${nodeVersion} is unsupported (requires >=${REQUIRED_NODE_MAJOR})`,
    };
  }
  return {
    name: "node-version",
    ok: true,
    detail: `Node.js ${nodeVersion} (ok)`,
  };
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
    return {
      name: "archive-storage",
      ok: true,
      detail: ".mdkg/archive has no stray raw files outside managed source directories",
    };
  }
  return {
    name: "archive-storage",
    ok: true,
    level: "warn",
    detail: `stray uncompressed archive file(s) found without managed sidecars: ${strayRaw.join(", ")}; run \`mdkg archive add <file>\` or move raw files under a managed archive source directory`,
  };
}

export function runDoctorCommand(options: DoctorCommandOptions): void {
  const results: CheckResult[] = [];

  results.push(runNodeVersionCheck());

  const configPath = path.resolve(options.root, ".mdkg", "config.json");
  if (!fs.existsSync(configPath)) {
    results.push({
      name: "config",
      ok: false,
      detail: `missing config at ${configPath}`,
    });
  } else {
    results.push({
      name: "config",
      ok: true,
      detail: `found ${configPath}`,
    });
  }

  let config: ReturnType<typeof loadConfig> | undefined;
  try {
    config = loadConfig(options.root);
    results.push({
      name: "config-schema",
      ok: true,
      detail: "config schema valid",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    results.push({
      name: "config-schema",
      ok: false,
      detail: message,
    });
  }

  if (config) {
    results.push(runArchiveStorageCheck(options.root));

    try {
      const templateSchemaInfo = loadTemplateSchemasWithInfo(options.root, config, ALLOWED_TYPES);
      results.push({
        name: "templates",
        ok: true,
        detail: "template schema set loaded",
      });
      if (templateSchemaInfo.fallbackTypes.length > 0) {
        results.push({
          name: "local-templates",
          ok: true,
          level: "warn",
          detail: `missing local template schema(s) covered by bundled fallback: ${templateSchemaInfo.fallbackTypes.join(", ")}; run \`mdkg upgrade --apply\` to vendor them`,
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      results.push({
        name: "templates",
        ok: false,
        detail: message,
      });
    }

    try {
      const { rebuilt, stale } = loadIndex({
        root: options.root,
        config,
        useCache: !options.noCache,
        allowReindex: !options.noReindex,
      });
      if (rebuilt) {
        results.push({
          name: "index",
          ok: true,
          detail: "index cache rebuilt and loaded",
        });
      } else if (stale) {
        results.push({
          name: "index",
          ok: true,
          detail: "index cache is stale (run mdkg index to refresh)",
        });
      } else {
        results.push({
          name: "index",
          ok: true,
          detail: "index cache loaded",
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      results.push({
        name: "index",
        ok: false,
        detail: message,
      });
    }

    try {
      const { rebuilt, stale } = loadCapabilitiesIndex({
        root: options.root,
        config,
        useCache: !options.noCache,
        allowReindex: !options.noReindex,
      });
      if (rebuilt) {
        results.push({
          name: "capabilities-index",
          ok: true,
          detail: "capabilities cache rebuilt and loaded",
        });
      } else if (stale) {
        results.push({
          name: "capabilities-index",
          ok: true,
          detail: "capabilities cache is stale (run mdkg index to refresh)",
        });
      } else {
        results.push({
          name: "capabilities-index",
          ok: true,
          detail: "capabilities cache loaded",
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      results.push({
        name: "capabilities-index",
        ok: false,
        detail: message,
      });
    }
  }

  const failures = results.filter((result) => !result.ok);
  if (options.json) {
    const payload = {
      ok: failures.length === 0,
      checks: results,
      failure_count: failures.length,
    };
    console.log(JSON.stringify(payload, null, 2));
  } else {
    for (const result of results) {
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
