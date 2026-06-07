import { loadConfig } from "../core/config";
import {
  CAPABILITY_KINDS,
  CAPABILITY_VISIBILITIES,
  CapabilityKind,
  CapabilityRecord,
  CapabilityVisibility,
} from "../graph/capabilities_indexer";
import { loadCapabilitiesIndex } from "../graph/capabilities_index_cache";
import { buildSubgraphCapabilityRecords } from "../graph/subgraphs";
import { NotFoundError, UsageError } from "../util/errors";

export type CapabilityListOptions = {
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

type CapabilityResolveOptions = CapabilityListOptions & {
  query?: string;
  requires?: string;
  freshOnly?: boolean;
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

export function loadCapabilityRecords(options: CapabilityListOptions): CapabilityRecord[] {
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
  const subgraph = buildSubgraphCapabilityRecords(options.root, config);
  for (const warning of subgraph.warnings) {
    console.error(`warning: ${warning}`);
  }
  return [...index.records, ...(subgraph.records as CapabilityRecord[])];
}

export function filterCapabilityRecords(records: CapabilityRecord[], options: CapabilityListOptions): CapabilityRecord[] {
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
    JSON.stringify(record.linkage ?? {}),
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

function recordSource(record: CapabilityRecord): Record<string, unknown> {
  const source = (record as unknown as { source?: Record<string, unknown> }).source;
  return source ?? {};
}

function isStale(record: CapabilityRecord): boolean {
  return recordSource(record).stale === true;
}

function hasReadPermission(record: CapabilityRecord): boolean {
  const permissions = recordSource(record).permissions;
  return !Array.isArray(permissions) || permissions.includes("read");
}

function requirementMatch(record: CapabilityRecord, required: string | undefined): number {
  if (!required) {
    return 0;
  }
  const normalized = required.toLowerCase();
  const haystack = [
    ...record.refs,
    ...record.tags,
    JSON.stringify(record.spec ?? {}),
    JSON.stringify(record.work ?? {}),
    JSON.stringify(record.linkage ?? {}),
    JSON.stringify(record.skill ?? {}),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(normalized) ? 1 : 0;
}

function linkageScore(record: CapabilityRecord): number {
  let score = 0;
  if (record.kind === "work") {
    score += 2;
  }
  if (record.kind === "spec") {
    score += 1;
  }
  if (record.work || record.spec) {
    score += 1;
  }
  return score;
}

function resolveScore(record: CapabilityRecord, options: CapabilityResolveOptions): number {
  let score = 0;
  if (record.workspace === "root") {
    score += 1000;
  }
  if (!isStale(record)) {
    score += 500;
  }
  if (hasReadPermission(record)) {
    score += 100;
  }
  if (options.query && matchesQuery(record, options.query)) {
    score += 50;
  }
  score += requirementMatch(record, options.requires) * 25;
  score += linkageScore(record);
  return score;
}

function resolveCapabilities(records: CapabilityRecord[], options: CapabilityResolveOptions): CapabilityRecord[] {
  const filtered = records.filter((record) => {
    if (options.freshOnly && isStale(record)) {
      return false;
    }
    if (options.query && !matchesQuery(record, options.query)) {
      return false;
    }
    if (options.requires && requirementMatch(record, options.requires) === 0) {
      return false;
    }
    return true;
  });
  return filtered.sort((a, b) => {
    const scoreDelta = resolveScore(b, options) - resolveScore(a, options);
    if (scoreDelta !== 0) {
      return scoreDelta;
    }
    const qidDelta = a.qid.localeCompare(b.qid);
    if (qidDelta !== 0) {
      return qidDelta;
    }
    return a.path.localeCompare(b.path);
  });
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

export function resolveCapabilityRecord(records: CapabilityRecord[], id: string): CapabilityRecord {
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
  const records = filterCapabilityRecords(loadCapabilityRecords(options), options);
  printCapabilityList(records, options.json);
}

export function runCapabilitySearchCommand(options: CapabilitySearchOptions): void {
  const records = filterCapabilityRecords(loadCapabilityRecords(options), options).filter((record) =>
    matchesQuery(record, options.query)
  );
  printCapabilityList(records, options.json, options.query);
}

export function runCapabilityShowCommand(options: CapabilityShowOptions): void {
  const records = loadCapabilityRecords(options);
  printCapability(resolveCapabilityRecord(records, options.id), options.json);
}

export function runCapabilityResolveCommand(options: CapabilityResolveOptions): void {
  const records = filterCapabilityRecords(loadCapabilityRecords(options), options);
  const items = resolveCapabilities(records, options).map((record, rank) => ({
    rank: rank + 1,
    score: resolveScore(record, options),
    stale: isStale(record),
    item: record,
  }));
  if (options.json) {
    console.log(
      JSON.stringify(
        {
          kind: "capability.resolve",
          query: options.query,
          requires: options.requires,
          fresh_only: options.freshOnly === true,
          count: items.length,
          items,
        },
        null,
        2
      )
    );
    return;
  }
  if (items.length === 0) {
    console.log("no capabilities resolved");
    return;
  }
  console.log(`resolved capabilities: ${items.length}`);
  for (const result of items) {
    const record = result.item;
    const stale = result.stale ? " stale" : "";
    console.log(`${result.rank}. ${record.qid} | score ${result.score}${stale} | ${record.kind} | ${record.title}`);
  }
}
