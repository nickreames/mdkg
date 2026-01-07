export const LATEST_SCHEMA_VERSION = 1;

export type MigrationResult = {
  config: unknown;
  from: number;
  to: number;
};

type Migrator = (input: unknown) => unknown;

const MIGRATIONS: Record<number, Migrator> = {};

export function migrateConfig(raw: unknown): MigrationResult {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("config must be a JSON object");
  }

  const version = (raw as { schema_version?: unknown }).schema_version;
  if (typeof version !== "number" || !Number.isInteger(version)) {
    throw new Error("config schema_version must be an integer");
  }

  if (version > LATEST_SCHEMA_VERSION) {
    throw new Error(
      `config schema_version ${version} is newer than supported ${LATEST_SCHEMA_VERSION}`
    );
  }

  if (version === LATEST_SCHEMA_VERSION) {
    return { config: raw, from: version, to: version };
  }

  let current: unknown = raw;
  for (let v = version; v < LATEST_SCHEMA_VERSION; v += 1) {
    const migrator = MIGRATIONS[v];
    if (!migrator) {
      throw new Error(`no migration available for schema_version ${v} -> ${v + 1}`);
    }
    current = migrator(current);
  }

  return { config: current, from: version, to: LATEST_SCHEMA_VERSION };
}
