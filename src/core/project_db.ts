import fs from "fs";
import path from "path";

export const PROJECT_DB_RELATIVE_DIR = ".mdkg/db";
export const PROJECT_DB_SCHEMA_DIR = ".mdkg/db/schema";
export const PROJECT_DB_MIGRATIONS_DIR = ".mdkg/db/schema/migrations";
export const PROJECT_DB_RUNTIME_DIR = ".mdkg/db/runtime";
export const PROJECT_DB_STATE_DIR = ".mdkg/db/state";
export const PROJECT_DB_RECEIPTS_DIR = ".mdkg/db/receipts";
export const PROJECT_DB_RUNTIME_FILE = ".mdkg/db/runtime/project.sqlite";
export const PROJECT_DB_STATE_FILE = ".mdkg/db/state/project.sqlite";
export const PROJECT_DB_STATE_MANIFEST_FILE = ".mdkg/db/state/project.manifest.json";
export const PROJECT_DB_MANIFEST_FILE = ".mdkg/db/project-db.json";
export const PROJECT_DB_CONFIG_SCHEMA_VERSION = 1;
export const PROJECT_DB_MIGRATION_TABLE = "mdkg_schema_migration";

export const PROJECT_DB_SUBDIRS = [
  PROJECT_DB_SCHEMA_DIR,
  PROJECT_DB_MIGRATIONS_DIR,
  PROJECT_DB_RUNTIME_DIR,
  PROJECT_DB_STATE_DIR,
  PROJECT_DB_RECEIPTS_DIR,
] as const;

export const PROJECT_DB_GITIGNORE_ENTRIES = [
  ".mdkg/db/runtime/",
  ".mdkg/db/**/*.sqlite-wal",
  ".mdkg/db/**/*.sqlite-shm",
  ".mdkg/db/**/*.sqlite-journal",
  ".mdkg/db/**/*.lock",
  ".mdkg/db/**/*.tmp",
] as const;

const TRANSIENT_SUFFIXES = [
  "-wal",
  "-shm",
  "-journal",
  ".lock",
  ".tmp",
] as const;

export type ProjectDbLayout = {
  root: string;
  db: string;
  schema: string;
  migrations: string;
  runtime: string;
  state: string;
  receipts: string;
};

export type ProjectDbConfigShape = {
  root_path: string;
  schema_path: string;
  migrations_path: string;
  runtime_path: string;
  state_path: string;
  receipts_path: string;
};

export type ConfiguredProjectDbLayout = {
  root: string;
  db: string;
  schema: string;
  migrations: string;
  runtimeFile: string;
  runtimeDir: string;
  stateFile: string;
  stateManifest: string;
  stateDir: string;
  receipts: string;
  manifest: string;
};

function toPosix(relativePath: string): string {
  return relativePath.split(path.sep).join("/");
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

export function resolveProjectDbLayout(root: string): ProjectDbLayout {
  return {
    root,
    db: path.resolve(root, PROJECT_DB_RELATIVE_DIR),
    schema: path.resolve(root, PROJECT_DB_SCHEMA_DIR),
    migrations: path.resolve(root, PROJECT_DB_MIGRATIONS_DIR),
    runtime: path.resolve(root, PROJECT_DB_RUNTIME_DIR),
    state: path.resolve(root, PROJECT_DB_STATE_DIR),
    receipts: path.resolve(root, PROJECT_DB_RECEIPTS_DIR),
  };
}

export function resolveConfiguredProjectDbLayout(
  root: string,
  config: ProjectDbConfigShape
): ConfiguredProjectDbLayout {
  const runtimeFile = path.resolve(root, config.runtime_path);
  const stateFile = path.resolve(root, config.state_path);
  const stateManifest = path.join(
    path.dirname(stateFile),
    `${path.basename(stateFile, path.extname(stateFile))}.manifest.json`
  );
  return {
    root,
    db: path.resolve(root, config.root_path),
    schema: path.resolve(root, config.schema_path),
    migrations: path.resolve(root, config.migrations_path),
    runtimeFile,
    runtimeDir: path.dirname(runtimeFile),
    stateFile,
    stateManifest,
    stateDir: path.dirname(stateFile),
    receipts: path.resolve(root, config.receipts_path),
    manifest: path.resolve(root, config.root_path, "project-db.json"),
  };
}

export function listProjectDbRuntimePolicyFiles(root: string): string[] {
  const layout = resolveProjectDbLayout(root);
  const dbFiles = walkFiles(layout.db);
  return dbFiles
    .filter((filePath) => {
      if (filePath.startsWith(`${layout.runtime}${path.sep}`)) {
        return true;
      }
      const basename = path.basename(filePath);
      return TRANSIENT_SUFFIXES.some((suffix) => basename.endsWith(suffix));
    })
    .map((filePath) => toPosix(path.relative(root, filePath)))
    .sort();
}
