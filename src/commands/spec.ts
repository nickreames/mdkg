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
  surface?: "manifest" | "spec";
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

function commandSurface(options: SpecCommandOptions): "manifest" | "spec" {
  return options.surface ?? "spec";
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

function resolveSpecRecord(records: CapabilityRecord[], id: string, surface: "manifest" | "spec"): CapabilityRecord {
  const matches = records.filter((record) => matchesSpecRef(record, id));
  if (matches.length === 1) {
    return matches[0];
  }
  if (matches.length > 1) {
    throw new UsageError(`${surface === "manifest" ? "manifest capability" : "SPEC"} reference is ambiguous: ${id}`);
  }
  throw new NotFoundError(`${surface === "manifest" ? "manifest capability" : "SPEC"} not found: ${id}`);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function stringArrayValue(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function compatibilityLabel(record: CapabilityRecord): string {
  const mode = record.manifest?.compatibility_mode;
  if (mode === "legacy") {
    return "legacy SPEC.md";
  }
  if (mode === "transitional") {
    return "transitional MANIFEST.md type: spec";
  }
  return "MANIFEST.md";
}

function legacySpecDeprecation(): string {
  return "mdkg spec is a legacy alias for mdkg manifest during the one-compatibility-release bridge.";
}

function printSpecList(records: CapabilityRecord[], json?: boolean, surface: "manifest" | "spec" = "spec"): void {
  if (json) {
    const receipt =
      surface === "manifest"
        ? {
            kind: "manifest",
            compatibility_kind: "spec",
            count: records.length,
            items: records,
          }
        : {
            kind: "spec",
            canonical_kind: "manifest",
            legacy_alias: true,
            deprecation: legacySpecDeprecation(),
            count: records.length,
            items: records,
          };
    console.log(
      JSON.stringify(
        receipt,
        null,
        2
      )
    );
    return;
  }

  if (surface === "spec") {
    console.log(legacySpecDeprecation());
  }
  if (records.length === 0) {
    console.log("no MANIFEST.md/SPEC.md capabilities found");
    return;
  }
  console.log(`${surface === "manifest" ? "MANIFEST.md" : "MANIFEST.md/SPEC.md"} capabilities: ${records.length}`);
  for (const record of records) {
    const kind = stringValue(record.spec?.spec_kind);
    const kindLabel = kind ? ` | ${kind}` : "";
    console.log(`${record.qid} | ${record.visibility}${kindLabel} | ${compatibilityLabel(record)} | ${record.title}`);
  }
}

function printSpec(record: CapabilityRecord, json?: boolean, surface: "manifest" | "spec" = "spec"): void {
  if (json) {
    const receipt =
      surface === "manifest"
        ? { kind: "manifest", compatibility_kind: "spec", item: record }
        : {
            kind: "spec",
            canonical_kind: "manifest",
            legacy_alias: true,
            deprecation: legacySpecDeprecation(),
            item: record,
          };
    console.log(JSON.stringify(receipt, null, 2));
    return;
  }

  if (surface === "spec") {
    console.log(legacySpecDeprecation());
  }
  console.log(`${record.qid} | ${record.visibility}`);
  console.log(`title: ${record.title}`);
  console.log(`semantic_kind: ${record.manifest?.semantic_kind ?? "manifest"}`);
  console.log(`compatibility: ${compatibilityLabel(record)}`);
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
  const surface = commandSurface(options);
  printSpecList(loadSpecRecords(options), options.json, surface);
}

export function runSpecShowCommand(options: SpecShowOptions): void {
  const surface = commandSurface(options);
  printSpec(resolveSpecRecord(loadSpecRecords(options), options.id, surface), options.json, surface);
}

export function runSpecValidateCommand(options: SpecValidateOptions): void {
  const surface = commandSurface(options);
  if (options.id) {
    resolveSpecRecord(loadSpecRecords(options), options.id, surface);
  }
  runValidateCommand({ root: options.root, json: options.json });
}

export function runManifestListCommand(options: SpecCommandOptions): void {
  runSpecListCommand({ ...options, surface: "manifest" });
}

export function runManifestShowCommand(options: SpecShowOptions): void {
  runSpecShowCommand({ ...options, surface: "manifest" });
}

export function runManifestValidateCommand(options: SpecValidateOptions): void {
  runSpecValidateCommand({ ...options, surface: "manifest" });
}
