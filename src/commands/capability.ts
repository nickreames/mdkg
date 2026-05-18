import { loadConfig } from "../core/config";
import {
  CAPABILITY_KINDS,
  CAPABILITY_VISIBILITIES,
  CapabilityKind,
  CapabilityRecord,
  CapabilityVisibility,
} from "../graph/capabilities_indexer";
import { loadCapabilitiesIndex } from "../graph/capabilities_index_cache";
import { buildImportedCapabilityRecords } from "../graph/bundle_imports";
import { NotFoundError, UsageError } from "../util/errors";

type CapabilityListOptions = {
  root: string;
  kind?: string;
  visibility?: string;
  json?: boolean;
  noCache?: boolean;
  noReindex?: boolean;
};

type CapabilitySearchOptions = CapabilityListOptions & {
  query: string;
};

type CapabilityShowOptions = {
  root: string;
  id: string;
  json?: boolean;
  noCache?: boolean;
  noReindex?: boolean;
};

function normalizeKind(value: string | undefined): CapabilityKind | undefined {
  if (value === undefined) {
    return undefined;
  }
  const normalized = value.toLowerCase();
  if ((CAPABILITY_KINDS as readonly string[]).includes(normalized)) {
    return normalized as CapabilityKind;
  }
  throw new UsageError(`--kind must be one of ${CAPABILITY_KINDS.join(", ")}`);
}

function normalizeVisibility(value: string | undefined): CapabilityVisibility | undefined {
  if (value === undefined) {
    return undefined;
  }
  const normalized = value.toLowerCase();
  if ((CAPABILITY_VISIBILITIES as readonly string[]).includes(normalized)) {
    return normalized as CapabilityVisibility;
  }
  throw new UsageError(`--visibility must be one of ${CAPABILITY_VISIBILITIES.join(", ")}`);
}

function loadRecords(options: CapabilityListOptions): CapabilityRecord[] {
  const config = loadConfig(options.root);
  const { index, stale, rebuilt } = loadCapabilitiesIndex({
    root: options.root,
    config,
    useCache: !options.noCache,
    allowReindex: !options.noReindex,
  });
  if (stale && !rebuilt && !options.noCache) {
    console.error("warning: capabilities index is stale; run mdkg index to refresh");
  }
  const imported = buildImportedCapabilityRecords(options.root, config);
  for (const warning of imported.warnings) {
    console.error(`warning: ${warning}`);
  }
  return [...index.records, ...(imported.records as CapabilityRecord[])];
}

function applyFilters(records: CapabilityRecord[], options: CapabilityListOptions): CapabilityRecord[] {
  const kind = normalizeKind(options.kind);
  const visibility = normalizeVisibility(options.visibility);
  return records.filter((record) => {
    if (kind && record.kind !== kind) {
      return false;
    }
    if (visibility && record.visibility !== visibility) {
      return false;
    }
    return true;
  });
}

function capabilitySearchText(record: CapabilityRecord): string {
  return [
    record.kind,
    record.workspace,
    record.visibility,
    record.id,
    record.qid,
    record.slug,
    record.name,
    record.title,
    record.description,
    record.path,
    ...record.tags,
    ...record.refs,
    ...record.aliases,
    ...record.links,
    ...record.headings.map((heading) => heading.text),
    JSON.stringify(record.spec ?? {}),
    JSON.stringify(record.work ?? {}),
    JSON.stringify(record.skill ?? {}),
  ]
    .filter((value): value is string => typeof value === "string" && value.length > 0)
    .join(" ")
    .toLowerCase();
}

function matchesQuery(record: CapabilityRecord, query: string): boolean {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);
  if (terms.length === 0) {
    return true;
  }
  const text = capabilitySearchText(record);
  return terms.every((term) => text.includes(term));
}

function printCapabilityList(records: CapabilityRecord[], json?: boolean, query?: string): void {
  if (json) {
    console.log(
      JSON.stringify(
        {
          kind: "capability",
          query,
          count: records.length,
          items: records,
        },
        null,
        2
      )
    );
    return;
  }

  if (records.length === 0) {
    console.log(query ? `no capabilities matched query "${query}"` : "no capabilities matched current filters");
    return;
  }
  console.log(`capabilities: ${records.length}`);
  for (const record of records) {
    const label = record.slug ?? record.id;
    console.log(`${record.qid} | ${record.kind} | ${record.visibility} | ${label} | ${record.title}`);
  }
}

function resolveCapability(records: CapabilityRecord[], id: string): CapabilityRecord {
  const normalized = id.toLowerCase();
  const exact = records.find((record) => record.qid === id || record.id === id);
  if (exact) {
    return exact;
  }
  const matches = records.filter(
    (record) =>
      record.slug === normalized ||
      record.id === normalized ||
      record.qid.toLowerCase() === normalized ||
      `skill:${record.slug}` === normalized
  );
  if (matches.length === 1) {
    return matches[0];
  }
  if (matches.length > 1) {
    throw new UsageError(`capability reference is ambiguous: ${id}`);
  }
  throw new NotFoundError(`capability not found: ${id}`);
}

function printCapability(record: CapabilityRecord, json?: boolean): void {
  if (json) {
    console.log(JSON.stringify({ kind: "capability", item: record }, null, 2));
    return;
  }

  console.log(`${record.qid} | ${record.kind} | ${record.visibility}`);
  console.log(`title: ${record.title}`);
  if (record.description) {
    console.log(`description: ${record.description}`);
  }
  if (record.tags.length > 0) {
    console.log(`tags: ${record.tags.join(", ")}`);
  }
  console.log(`path: ${record.path}`);
}

export function runCapabilityListCommand(options: CapabilityListOptions): void {
  const records = applyFilters(loadRecords(options), options);
  printCapabilityList(records, options.json);
}

export function runCapabilitySearchCommand(options: CapabilitySearchOptions): void {
  const records = applyFilters(loadRecords(options), options).filter((record) =>
    matchesQuery(record, options.query)
  );
  printCapabilityList(records, options.json, options.query);
}

export function runCapabilityShowCommand(options: CapabilityShowOptions): void {
  const records = loadRecords(options);
  printCapability(resolveCapability(records, options.id), options.json);
}
