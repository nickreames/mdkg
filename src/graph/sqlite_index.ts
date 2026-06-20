import crypto from "crypto";
import fs from "fs";
import path from "path";
import { Config } from "../core/config";
import { CapabilitiesIndex } from "./capabilities_indexer";
import { Index } from "./indexer";
import { SkillsIndex } from "./skills_indexer";
import { SubgraphsIndex } from "./subgraphs";
import { isIndexStale } from "./staleness";

type DatabaseSyncType = {
  exec(sql: string): void;
  prepare(sql: string): {
    run(...values: unknown[]): unknown;
    get(...values: unknown[]): Record<string, unknown> | undefined;
    all(...values: unknown[]): Array<Record<string, unknown>>;
  };
  close(): void;
};

type DatabaseCtor = new (filename: string) => DatabaseSyncType;

export const SQLITE_SCHEMA_VERSION = 2;

function loadDatabaseCtor(): DatabaseCtor {
  try {
    const loaded = require("node:sqlite") as { DatabaseSync?: DatabaseCtor };
    if (!loaded.DatabaseSync) {
      throw new Error("node:sqlite DatabaseSync is unavailable");
    }
    return loaded.DatabaseSync;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`node:sqlite is required for mdkg SQLite index support: ${message}`);
  }
}

function toPosixPath(value: string): string {
  return value.split(path.sep).join("/");
}

function sha256File(filePath: string): string {
  return `sha256:${crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex")}`;
}

function stripVolatileCacheFields(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => stripVolatileCacheFields(item));
  }
  if (value && typeof value === "object") {
    const input = value as Record<string, unknown>;
    const output: Record<string, unknown> = {};
    for (const key of Object.keys(input).sort()) {
      if (key === "generated_at" || key === "indexed_at") {
        continue;
      }
      output[key] = stripVolatileCacheFields(input[key]);
    }
    return output;
  }
  return value;
}

function stableCacheJson(value: unknown): string {
  return JSON.stringify(stripVolatileCacheFields(value));
}

export function isSqliteBackend(config: Config): boolean {
  return config.index.backend === "sqlite";
}

export function resolveSqlitePath(root: string, config: Config): string {
  return path.resolve(root, config.index.sqlite_path);
}

function sqliteTempPath(sqlitePath: string): string {
  return path.join(
    path.dirname(sqlitePath),
    `.${path.basename(sqlitePath)}.${process.pid}.${Date.now()}.tmp`
  );
}

function createSchema(db: DatabaseSyncType): void {
  db.exec(`
    PRAGMA journal_mode = DELETE;
    PRAGMA synchronous = FULL;
    CREATE TABLE meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    CREATE TABLE nodes (
      qid TEXT PRIMARY KEY,
      id TEXT NOT NULL,
      ws TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      path TEXT NOT NULL,
      status TEXT,
      priority INTEGER,
      updated TEXT,
      source_hash TEXT,
      json TEXT NOT NULL
    );
    CREATE TABLE edges (
      source_qid TEXT NOT NULL,
      kind TEXT NOT NULL,
      target_qid TEXT NOT NULL,
      PRIMARY KEY (source_qid, kind, target_qid)
    );
    CREATE TABLE skills (
      qid TEXT PRIMARY KEY,
      slug TEXT NOT NULL,
      ws TEXT NOT NULL,
      name TEXT NOT NULL,
      path TEXT NOT NULL,
      json TEXT NOT NULL
    );
    CREATE TABLE capabilities (
      qid TEXT NOT NULL,
      kind TEXT NOT NULL,
      workspace TEXT NOT NULL,
      visibility TEXT NOT NULL,
      id TEXT NOT NULL,
      path TEXT NOT NULL,
      source_hash TEXT NOT NULL,
      json TEXT NOT NULL,
      PRIMARY KEY (qid, kind, path)
    );
    CREATE TABLE archives (
      qid TEXT PRIMARY KEY,
      visibility TEXT NOT NULL,
      compressed_path TEXT,
      compressed_sha256 TEXT,
      json TEXT NOT NULL
    );
    CREATE TABLE subgraphs (
      alias TEXT PRIMARY KEY,
      enabled INTEGER NOT NULL,
      stale INTEGER NOT NULL,
      error_count INTEGER NOT NULL,
      warning_count INTEGER NOT NULL,
      json TEXT NOT NULL
    );
    CREATE TABLE id_allocations (
      ws TEXT NOT NULL,
      prefix TEXT NOT NULL,
      next_value INTEGER NOT NULL,
      PRIMARY KEY (ws, prefix)
    );
  `);
}

function insertMeta(db: DatabaseSyncType, key: string, value: string): void {
  db.prepare("INSERT INTO meta (key, value) VALUES (?, ?)").run(key, value);
}

function nodeSourceHash(root: string, nodePath: string): string | undefined {
  const fullPath = path.resolve(root, nodePath);
  if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
    return undefined;
  }
  return sha256File(fullPath);
}

function buildSourceFingerprint(options: {
  nodeIndex: Index;
  skillsIndex: SkillsIndex;
  capabilitiesIndex: CapabilitiesIndex;
  subgraphsIndex: SubgraphsIndex;
  nodeHashes: Map<string, string | undefined>;
}): string {
  const payload = {
    nodes: Object.values(options.nodeIndex.nodes)
      .sort((a, b) => a.qid.localeCompare(b.qid))
      .map((node) => ({
        qid: node.qid,
        path: node.path,
        hash: options.nodeHashes.get(node.qid) ?? "",
      })),
    skills: Object.values(options.skillsIndex.skills).sort((a, b) => a.qid.localeCompare(b.qid)),
    capabilities: options.capabilitiesIndex.records,
    subgraphs: options.subgraphsIndex.subgraphs,
  };
  return `sha256:${crypto.createHash("sha256").update(stableCacheJson(payload)).digest("hex")}`;
}

export function sqliteSourceFingerprint(options: {
  root: string;
  nodeIndex: Index;
  skillsIndex: SkillsIndex;
  capabilitiesIndex: CapabilitiesIndex;
  subgraphsIndex: SubgraphsIndex;
}): string {
  const nodeHashes = new Map<string, string | undefined>();
  for (const node of Object.values(options.nodeIndex.nodes)) {
    nodeHashes.set(node.qid, nodeSourceHash(options.root, node.path));
  }
  return buildSourceFingerprint({ ...options, nodeHashes });
}

export function readSqliteIndexMeta(root: string, config: Config): Record<string, string> {
  const sqlitePath = resolveSqlitePath(root, config);
  const DatabaseSync = loadDatabaseCtor();
  const db = new DatabaseSync(sqlitePath);
  try {
    const rows = db.prepare("SELECT key, value FROM meta").all();
    const meta: Record<string, string> = {};
    for (const row of rows) {
      meta[String(row.key)] = String(row.value);
    }
    return meta;
  } finally {
    db.close();
  }
}

export function writeSqliteIndex(options: {
  root: string;
  config: Config;
  nodeIndex: Index;
  skillsIndex: SkillsIndex;
  capabilitiesIndex: CapabilitiesIndex;
  subgraphsIndex: SubgraphsIndex;
}): string {
  const sqlitePath = resolveSqlitePath(options.root, options.config);
  fs.mkdirSync(path.dirname(sqlitePath), { recursive: true });
  const tempPath = sqliteTempPath(sqlitePath);
  fs.rmSync(tempPath, { force: true });
  const DatabaseSync = loadDatabaseCtor();
  const db = new DatabaseSync(tempPath);
  try {
    const nodeHashes = new Map<string, string | undefined>();
    for (const node of Object.values(options.nodeIndex.nodes)) {
      nodeHashes.set(node.qid, nodeSourceHash(options.root, node.path));
    }
    createSchema(db);
    insertMeta(db, "tool", "mdkg");
    insertMeta(db, "schema_version", String(SQLITE_SCHEMA_VERSION));
    insertMeta(db, "package_schema_version", String(options.config.schema_version));
    insertMeta(db, "backend", options.config.index.backend);
    insertMeta(db, "source_fingerprint", buildSourceFingerprint({ ...options, nodeHashes }));
    insertMeta(db, "root", ".");

    const insertNode = db.prepare(
      "INSERT INTO nodes (qid, id, ws, type, title, path, status, priority, updated, source_hash, json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    const insertEdge = db.prepare(
      "INSERT OR IGNORE INTO edges (source_qid, kind, target_qid) VALUES (?, ?, ?)"
    );
    for (const node of Object.values(options.nodeIndex.nodes).sort((a, b) => a.qid.localeCompare(b.qid))) {
      insertNode.run(
        node.qid,
        node.id,
        node.ws,
        node.type,
        node.title,
        toPosixPath(node.path),
        node.status ?? null,
        node.priority ?? null,
        node.updated ?? null,
        nodeHashes.get(node.qid) ?? null,
        stableCacheJson(node)
      );
      for (const [kind, values] of [
        ["relates", node.edges.relates],
        ["blocked_by", node.edges.blocked_by],
        ["blocks", node.edges.blocks],
        ["context_refs", node.edges.context_refs ?? []],
        ["evidence_refs", node.edges.evidence_refs ?? []],
      ] as const) {
        for (const target of values) {
          insertEdge.run(node.qid, kind, target);
        }
      }
      for (const [kind, target] of [
        ["epic", node.edges.epic],
        ["parent", node.edges.parent],
        ["prev", node.edges.prev],
        ["next", node.edges.next],
      ] as const) {
        if (target) {
          insertEdge.run(node.qid, kind, target);
        }
      }
    }

    const insertSkill = db.prepare(
      "INSERT INTO skills (qid, slug, ws, name, path, json) VALUES (?, ?, ?, ?, ?, ?)"
    );
    for (const skill of Object.values(options.skillsIndex.skills).sort((a, b) => a.qid.localeCompare(b.qid))) {
      insertSkill.run(skill.qid, skill.slug, skill.ws, skill.name, skill.path, stableCacheJson(skill));
    }

    const insertCapability = db.prepare(
      "INSERT INTO capabilities (qid, kind, workspace, visibility, id, path, source_hash, json) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    for (const record of options.capabilitiesIndex.records) {
      insertCapability.run(
        record.qid,
        record.kind,
        record.workspace,
        record.visibility,
        record.id,
        record.path,
        record.source_hash,
        stableCacheJson(record)
      );
    }

    const insertArchive = db.prepare(
      "INSERT INTO archives (qid, visibility, compressed_path, compressed_sha256, json) VALUES (?, ?, ?, ?, ?)"
    );
    for (const node of Object.values(options.nodeIndex.nodes).filter((item) => item.type === "archive")) {
      insertArchive.run(
        node.qid,
        String(node.attributes.visibility ?? "private"),
        String(node.attributes.compressed_path ?? ""),
        String(node.attributes.compressed_sha256 ?? ""),
        stableCacheJson(node)
      );
    }

    const insertSubgraph = db.prepare(
      "INSERT INTO subgraphs (alias, enabled, stale, error_count, warning_count, json) VALUES (?, ?, ?, ?, ?, ?)"
    );
    for (const item of options.subgraphsIndex.subgraphs) {
      insertSubgraph.run(
        item.alias,
        item.enabled ? 1 : 0,
        item.stale ? 1 : 0,
        item.error_count,
        item.warning_count,
        stableCacheJson(item)
      );
    }
  } finally {
    db.close();
  }
  fs.renameSync(tempPath, sqlitePath);
  return sqlitePath;
}

export function reserveSqliteNumericId(options: {
  root: string;
  config: Config;
  ws: string;
  prefix: string;
  currentMax: number;
}): string | undefined {
  if (!isSqliteBackend(options.config)) {
    return undefined;
  }
  const sqlitePath = resolveSqlitePath(options.root, options.config);
  fs.mkdirSync(path.dirname(sqlitePath), { recursive: true });
  const DatabaseSync = loadDatabaseCtor();
  const db = new DatabaseSync(sqlitePath);
  try {
    db.exec("CREATE TABLE IF NOT EXISTS id_allocations (ws TEXT NOT NULL, prefix TEXT NOT NULL, next_value INTEGER NOT NULL, PRIMARY KEY (ws, prefix));");
    db.exec("BEGIN IMMEDIATE");
    const row = db
      .prepare("SELECT next_value FROM id_allocations WHERE ws = ? AND prefix = ?")
      .get(options.ws, options.prefix);
    const existing = typeof row?.next_value === "number" ? row.next_value : undefined;
    const nextValue = Math.max(existing ?? 1, options.currentMax + 1);
    db.prepare(
      "INSERT INTO id_allocations (ws, prefix, next_value) VALUES (?, ?, ?) ON CONFLICT(ws, prefix) DO UPDATE SET next_value = excluded.next_value"
    ).run(options.ws, options.prefix, nextValue + 1);
    db.exec("COMMIT");
    return `${options.prefix}-${nextValue}`;
  } catch (err) {
    try {
      db.exec("ROLLBACK");
    } catch {
      // ignore rollback failures when no transaction is active
    }
    throw err;
  } finally {
    db.close();
  }
}

export function sqliteHealth(root: string, config: Config): {
  path: string;
  exists: boolean;
  size: number;
  warnings: string[];
  errors: string[];
} {
  const sqlitePath = resolveSqlitePath(root, config);
  const warnings: string[] = [];
  const errors: string[] = [];
  if (!fs.existsSync(sqlitePath)) {
    warnings.push(`SQLite cache missing at ${toPosixPath(path.relative(root, sqlitePath))}; run mdkg index`);
    return { path: sqlitePath, exists: false, size: 0, warnings, errors };
  }
  const size = fs.statSync(sqlitePath).size;
  if (config.index.sqlite_commit_warning_bytes > 0 && size > config.index.sqlite_commit_warning_bytes) {
    warnings.push(
      `SQLite cache exceeds ${config.index.sqlite_commit_warning_bytes} bytes: ${toPosixPath(path.relative(root, sqlitePath))} (${size} bytes)`
    );
  }
  for (const suffix of ["-wal", "-shm", "-journal"]) {
    const transient = `${sqlitePath}${suffix}`;
    if (fs.existsSync(transient)) {
      warnings.push(`transient SQLite file present: ${toPosixPath(path.relative(root, transient))}`);
    }
  }
  try {
    const DatabaseSync = loadDatabaseCtor();
    const db = new DatabaseSync(sqlitePath);
    try {
      const row = db.prepare("SELECT value FROM meta WHERE key = 'schema_version'").get();
      if (String(row?.value ?? "") !== String(SQLITE_SCHEMA_VERSION)) {
        errors.push(`SQLite schema mismatch; run mdkg index`);
      }
    } finally {
      db.close();
    }
  } catch (err) {
    errors.push(`failed to read SQLite cache: ${err instanceof Error ? err.message : String(err)}`);
  }
  if (isIndexStale(root, config)) {
    warnings.push("SQLite cache may be stale because source graph files or config changed; run mdkg index");
  }
  return { path: sqlitePath, exists: true, size, warnings, errors };
}
