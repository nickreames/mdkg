import {
  CapabilityListOptions,
  filterCapabilityRecords,
  loadCapabilityRecords,
} from "./capability";
import { CapabilityRecord } from "../graph/capabilities_indexer";
import { runValidateCommand } from "./validate";
import { NotFoundError, UsageError } from "../util/errors";

type SpecCommandOptions = {
  root: string;
  json?: boolean;
  noCache?: boolean;
  noReindex?: boolean;
};

type SpecShowOptions = SpecCommandOptions & {
  id: string;
};

type SpecValidateOptions = SpecCommandOptions & {
  id?: string;
};

function sortSpecRecords(records: CapabilityRecord[]): CapabilityRecord[] {
  return [...records].sort((a, b) => {
    const qidDelta = a.qid.localeCompare(b.qid);
    if (qidDelta !== 0) {
      return qidDelta;
    }
    return a.path.localeCompare(b.path);
  });
}

function loadSpecRecords(options: SpecCommandOptions): CapabilityRecord[] {
  const listOptions: CapabilityListOptions = {
    root: options.root,
    kind: "spec",
    noCache: options.noCache,
    noReindex: options.noReindex,
  };
  return sortSpecRecords(filterCapabilityRecords(loadCapabilityRecords(listOptions), listOptions));
}

function matchesSpecRef(record: CapabilityRecord, id: string): boolean {
  const normalized = id.toLowerCase();
  return (
    record.id === id ||
    record.qid === id ||
    record.path === id ||
    record.id.toLowerCase() === normalized ||
    record.qid.toLowerCase() === normalized ||
    record.path.toLowerCase() === normalized ||
    record.aliases.some((alias) => alias.toLowerCase() === normalized)
  );
}

function resolveSpecRecord(records: CapabilityRecord[], id: string): CapabilityRecord {
  const matches = records.filter((record) => matchesSpecRef(record, id));
  if (matches.length === 1) {
    return matches[0];
  }
  if (matches.length > 1) {
    throw new UsageError(`SPEC reference is ambiguous: ${id}`);
  }
  throw new NotFoundError(`SPEC not found: ${id}`);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function stringArrayValue(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function printSpecList(records: CapabilityRecord[], json?: boolean): void {
  if (json) {
    console.log(
      JSON.stringify(
        {
          kind: "spec",
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
    console.log("no SPEC.md capabilities found");
    return;
  }
  console.log(`SPEC.md capabilities: ${records.length}`);
  for (const record of records) {
    const kind = stringValue(record.spec?.spec_kind);
    const kindLabel = kind ? ` | ${kind}` : "";
    console.log(`${record.qid} | ${record.visibility}${kindLabel} | ${record.title}`);
  }
}

function printSpec(record: CapabilityRecord, json?: boolean): void {
  if (json) {
    console.log(JSON.stringify({ kind: "spec", item: record }, null, 2));
    return;
  }

  console.log(`${record.qid} | ${record.visibility}`);
  console.log(`title: ${record.title}`);
  const specKind = stringValue(record.spec?.spec_kind);
  if (specKind) {
    console.log(`spec_kind: ${specKind}`);
  }
  console.log(`path: ${record.path}`);
  const requestedCapabilities = stringArrayValue(record.spec?.requested_capabilities);
  if (requestedCapabilities.length > 0) {
    console.log(`requested_capabilities: ${requestedCapabilities.join(", ")}`);
  }
}

export function runSpecListCommand(options: SpecCommandOptions): void {
  printSpecList(loadSpecRecords(options), options.json);
}

export function runSpecShowCommand(options: SpecShowOptions): void {
  printSpec(resolveSpecRecord(loadSpecRecords(options), options.id), options.json);
}

export function runSpecValidateCommand(options: SpecValidateOptions): void {
  if (options.id) {
    resolveSpecRecord(loadSpecRecords(options), options.id);
  }
  runValidateCommand({ root: options.root, json: options.json });
}
