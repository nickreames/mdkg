export const DEFAULT_SCHEMA_VERSION = 1;
export const IDENTITY_CONFIG_SCHEMA_VERSION = 2;
export const LATEST_SCHEMA_VERSION = IDENTITY_CONFIG_SCHEMA_VERSION;
const LEGACY_SCHEMA_VERSION = 0;

export type MigrationResult = {
  config: unknown;
  from: number;
  to: number;
};

type JsonObject = Record<string, unknown>;
type Migrator = (input: unknown) => unknown;

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getSchemaVersion(raw: JsonObject): number {
  const version = raw.schema_version;
  if (version === undefined) {
    return LEGACY_SCHEMA_VERSION;
  }
  if (typeof version !== "number" || !Number.isInteger(version)) {
    throw new Error("config schema_version must be an integer");
  }
  if (version < LEGACY_SCHEMA_VERSION) {
    throw new Error("config schema_version must be non-negative");
  }
  return version;
}

function migrateLegacyConfig(input: unknown): unknown {
  if (!isJsonObject(input)) {
    throw new Error("config must be a JSON object");
  }

  return {
    ...input,
    schema_version: 1,
    workspaces:
      input.workspaces === undefined
        ? {
            root: {
              path: ".",
              enabled: true,
              mdkg_dir: ".mdkg",
            },
          }
        : input.workspaces,
  };
}

const MIGRATIONS: Record<number, Migrator> = {
  [LEGACY_SCHEMA_VERSION]: migrateLegacyConfig,
};

export function migrateConfig(raw: unknown): MigrationResult {
  if (!isJsonObject(raw)) {
    throw new Error("config must be a JSON object");
  }

  const version = getSchemaVersion(raw);
  if (version > LATEST_SCHEMA_VERSION) {
    throw new Error(
      `config schema_version ${version} is newer than supported ${LATEST_SCHEMA_VERSION}`
    );
  }

  // Recognizing a newer schema must not implicitly opt legacy graphs into it.
  // Schema 2 is an explicit compatible-writer fence, installed by reviewed
  // identity migration or by reviewed upgrade of an already adopted graph.
  if (version >= DEFAULT_SCHEMA_VERSION) {
    return { config: raw, from: version, to: version };
  }

  let current: unknown = raw;
  for (let v = version; v < DEFAULT_SCHEMA_VERSION; v += 1) {
    const migrator = MIGRATIONS[v];
    if (!migrator) {
      throw new Error(`no migration available for schema_version ${v} -> ${v + 1}`);
    }
    current = migrator(current);
  }

  return { config: current, from: version, to: DEFAULT_SCHEMA_VERSION };
}

/** Preserve authored settings/extensions; only explicit adoption adds this fence. */
export function identityWriterConfig(raw: unknown): JsonObject {
  return { ...(migrateConfig(raw).config as JsonObject), schema_version: IDENTITY_CONFIG_SCHEMA_VERSION };
}
