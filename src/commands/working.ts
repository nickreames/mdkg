import fs from "fs";
import path from "path";
import { assertWorkingConfigPaths, loadConfig } from "../core/config";
import { admitWorkingPath, readWorkingHost, readWorkingMarker, WORKING_HOST_PATH, WORKING_ROOT, workingMarkerBytes, WorkingHost, workingPath } from "../core/working_host";
import { atomicReplaceContainedFile, containedPathExists, ensureContainedDirectory, readContainedFile, removeContainedPath, withContainedPathSink, writeContainedFileExclusive } from "../core/filesystem_authority";
import { canonicalJson, deriveIdentityUuid, identityHash, isIdentityUuid, newIdentityUuid, readGraphFormat, identityRef } from "../graph/identity";
import { buildIndex, Index } from "../graph/indexer";
import { readLocalGoalSelection, resolveLocalGoalSelection } from "../graph/selected_goal";
import { authorNewIdentityNode } from "../graph/identity_authoring";
import { formatFrontmatter } from "../graph/frontmatter";
import { createDeterministicZip } from "../util/zip";
import { isPortableId } from "../util/id";
import { UsageError } from "../util/errors";
import { heldMutationLock, withMutationLock, withRecoveredMutationLock } from "../util/lock";
import { assertRecoveryLockEvidence, MutationLockRecord, mutationLockChain, readMutationLock } from "../util/lock_evidence";

const MANIFEST = `${WORKING_ROOT}/manifest.json`;
const LIMIT = 1024 * 1024;
const MAX_ENTRIES = 1024;
type Action = "init" | "add" | "adopt" | "retain" | "release" | "pin" | "unpin" | "promote" | "gc" | "recover" | "purge";
export type WorkingRequest = { action: Action; ids: string[]; owner?: string; file?: string; work_ref?: string; summary?: string; archive_id?: string; confirm_stopped?: boolean; confirm_loss?: boolean };
type Entry = { id: string; sha256: string; bytes: number; source: string; owner: string; active: boolean; pinned: boolean; work_ref: string | null; state: "live" | "quarantine" | "purged"; quarantine: string | null; promoted: string | null };
type Manifest = { format: "mdkg-working"; version: 1; host: WorkingHost; store_id: string; entries: Entry[] };
type Effect = { kind: "write" | "move" | "delete"; path: string; hash: string; before: string | null; from?: string };
type PreparedEffect = Effect & { data?: Buffer; source?: string };
export type WorkingPlan = { format: "mdkg-working-plan"; version: 1; operation_id: string; created_at: string; host: WorkingHost; store_id: string; request: WorkingRequest; snapshot_hash: string; context_hash: string; manifest_after: Manifest; effects: Effect[]; plan_hash: string };
type Journal = { format: "mdkg-working-journal"; version: 1; state: "pending" | "completed"; plan: WorkingPlan; manifest_before: Manifest | null; ignore_before: string | null; lock_record: MutationLockRecord; effects: Array<Effect & { data64?: string; source?: string }>; };
const hash = (bytes: string | Buffer) => identityHash(bytes);
const json = (value: unknown) => canonicalJson(value) + "\n";
const exists = (root: string, file: string) => containedPathExists({ root, relativePath: file });
const dataPath = (entry: Entry) => entry.state === "quarantine" ? `${WORKING_ROOT}/quarantine/${entry.quarantine}/${entry.id}.bin` : `${WORKING_ROOT}/entries/${entry.id}.bin`;
const journalPath = (id: string) => `${WORKING_ROOT}/operations/${id}.json`;
function fail(message: string): never { throw new UsageError(message); }

function keys(v: unknown, allowed: string[], label: string): Record<string, any> {
  if (!v || typeof v !== "object" || Array.isArray(v)) fail(`${label} must be an object`);
  const x = v as Record<string, any>;
  if (Object.keys(x).some(k => !allowed.includes(k))) fail(`${label} contains unsupported fields`);
  return x;
}
function host(v: unknown): WorkingHost {
  const x = keys(v, ["kind", "id"], "working host");
  if (!["canonical-v2", "working-host-v1"].includes(x.kind) || !isIdentityUuid(x.id)) fail("invalid working host");
  return x as WorkingHost;
}
function digest(v: unknown): asserts v is string {
  if (typeof v !== "string" || !/^sha256:[0-9a-f]{64}$/.test(v)) fail("invalid working digest");
}
function parseManifest(v: unknown): Manifest {
  const x = keys(v, ["format", "version", "host", "store_id", "entries"], "working manifest");
  if (x.format !== "mdkg-working" || x.version !== 1 || !isIdentityUuid(x.store_id) || !Array.isArray(x.entries) || x.entries.length > MAX_ENTRIES) fail("unsupported working manifest");
  host(x.host);
  const seen = new Set<string>();
  for (const value of x.entries) {
    const e = keys(value, ["id", "sha256", "bytes", "source", "owner", "active", "pinned", "work_ref", "state", "quarantine", "promoted"], "working entry");
    if (!isIdentityUuid(e.id) || seen.has(e.id) || !Number.isSafeInteger(e.bytes) || e.bytes < 0 || e.bytes > LIMIT ||
        typeof e.source !== "string" || typeof e.owner !== "string" || !e.owner || e.owner.length > 200 ||
        typeof e.active !== "boolean" || typeof e.pinned !== "boolean" || (e.work_ref !== null && typeof e.work_ref !== "string") ||
        !["live", "quarantine", "purged"].includes(e.state) ||
        (e.state === "live" ? e.quarantine !== null : !isIdentityUuid(e.quarantine)) ||
        (e.promoted !== null && (typeof e.promoted !== "string" || !e.promoted.startsWith("archive://")))) fail("invalid working entry");
    digest(e.sha256); seen.add(e.id);
  }
  return x as Manifest;
}
function readFile(root: string, file: string, maxBytes = LIMIT): Buffer {
  admitWorkingPath(root, file);
  return readContainedFile({ root, relativePath: file, maxBytes }, null);
}
function fileHash(root: string, file: string): string | null {
  admitWorkingPath(root, file);
  return exists(root, file) ? hash(readFile(root, file, 8 * LIMIT)) : null;
}
function verifyHost(root: string, expected: WorkingHost): void {
  const actual = readWorkingHost(root);
  if (!actual || canonicalJson(actual) !== canonicalJson(expected)) fail("foreign, missing or changed working host; preserve store and use explicit data-only adoption");
}
function directories(root: string): string[] {
  if (!exists(root, WORKING_ROOT)) return [];
  const pending = [WORKING_ROOT], files: string[] = []; let count = 0;
  while (pending.length) {
    const dir = pending.pop()!; admitWorkingPath(root, dir);
    for (const name of fs.readdirSync(path.join(root, dir)).sort()) {
      if (++count > 4096) fail("working inventory exceeds its bound");
      const file = `${dir}/${name}`; admitWorkingPath(root, file);
      const stat = fs.lstatSync(path.join(root, file));
      if (stat.isDirectory()) {
        if (file.split("/").length > 6) fail("working inventory exceeds depth bound");
        pending.push(file);
      } else files.push(file);
    }
  }
  return files;
}
function readJournal(root: string, id: string): Journal {
  if (!isIdentityUuid(id)) fail("operation ID must be a UUID");
  const x = keys(JSON.parse(readFile(root, journalPath(id), 8 * LIMIT).toString("utf8")), ["format", "version", "state", "plan", "manifest_before", "ignore_before", "lock_record", "effects"], "working journal");
  if (x.format !== "mdkg-working-journal" || x.version !== 1 || !["pending", "completed"].includes(x.state) || !Array.isArray(x.effects)) fail("unsupported working journal");
  validatePlan(x.plan);
  mutationLockChain(x.lock_record, x.plan.plan_hash);
  if (x.plan.operation_id !== id || x.effects.length !== x.plan.effects.length) fail("working journal plan mismatch");
  if (x.manifest_before !== null) parseManifest(x.manifest_before);
  if (hash(json(x.manifest_before)) !== x.plan.snapshot_hash || (x.ignore_before !== null && typeof x.ignore_before !== "string")) fail("journal before image mismatch");
  for (let i = 0; i < x.effects.length; i++) {
    const e = keys(x.effects[i], ["kind", "path", "hash", "before", "from", "data64", "source"], "journal effect");
    const { data64, source, ...publicEffect } = e;
    if (canonicalJson(publicEffect) !== canonicalJson(x.plan.effects[i])) fail("journal effect differs from approved plan");
    if (data64 !== undefined && (typeof data64 !== "string" || Buffer.from(data64, "base64").toString("base64") !== data64 || hash(Buffer.from(data64, "base64")) !== e.hash)) fail("journal data digest mismatch");
    if (source !== undefined && typeof source !== "string") fail("invalid journal source");
    if (e.kind === "write" && (data64 === undefined) === (source === undefined)) fail("journal write needs exactly one data source");
    if (e.kind !== "write" && (data64 !== undefined || source !== undefined)) fail("non-write journal effect has unexpected data");
  }
  return x as Journal;
}
function readStore(root: string, allowPending = false): Manifest {
  const current = readWorkingHost(root); // independent host first; no incoming bootstrap
  if (!current) fail("working host absent; preview explicit mdkg working init");
  const m = parseManifest(JSON.parse(readFile(root, MANIFEST).toString("utf8")));
  verifyHost(root, m.host);
  const known = new Set([MANIFEST]);
  for (const entry of m.entries) {
    if (entry.state !== "purged") {
      const file = dataPath(entry); known.add(file);
      const bytes = readFile(root, file);
      if (hash(bytes) !== entry.sha256 || bytes.length !== entry.bytes) fail("working payload digest mismatch");
    }
  }
  for (const file of directories(root)) {
    if (known.has(file)) continue;
    const match = /^\.mdkg\/working\/operations\/([0-9a-f-]+)\.json$/.exec(file);
    if (!match) fail("unmanaged content in reserved working store; preserve it for explicit adoption");
    const j = readJournal(root, match[1]); verifyHost(root, j.plan.host);
    if (j.state !== "completed" && !allowPending) fail("unfinished working operation; inspect and explicitly resume its original plan");
  }
  return m;
}

function context(root: string, omitted = new Set<string>()): { index: Index; hash: string; protectedRefs: Set<string> } {
  const config = loadConfig(root);
  assertWorkingConfigPaths(config);
  if (Object.values(config.workspaces).some(w => workingPath(`${w.path}/${w.mdkg_dir}`))) fail("workspace overlaps private working storage");
  const index = buildIndex(root, config); // no generated cache write
  for (const [key, node] of Object.entries(index.nodes)) if (omitted.has(node.path)) delete index.nodes[key];
  const selection = readLocalGoalSelection(root), protectedRefs = new Set<string>();
  if (selection.warning) fail(selection.warning);
  if (selection.state) {
    const selected = resolveLocalGoalSelection(index, selection.state);
    if (selected.warning || !selected.node) fail(selected.warning ?? "ambiguous selected goal");
    for (const value of [selected.node.qid, selected.node.id, selected.node.attributes.active_node, selected.node.attributes.last_active_node]) {
      if (typeof value !== "string" || !value) continue;
      protectedRefs.add(value);
      const matches = Object.values(index.nodes).filter(n => n.qid === value || n.id === value || (n.identity && identityRef(n.identity) === value));
      if (matches.length !== 1) fail("selected work reference is missing or ambiguous");
      protectedRefs.add(matches[0].id); protectedRefs.add(matches[0].qid);
      if (matches[0].identity) protectedRefs.add(identityRef(matches[0].identity));
    }
    if (selected.node.identity) protectedRefs.add(identityRef(selected.node.identity));
  }
  const nodes = Object.values(index.nodes).filter(n => !n.source?.imported).map(n => ({ qid: n.qid, identity: n.identity ?? null, status: n.status ?? null, attrs: n.attributes,
    source_hash: hash(readContainedFile({ root, relativePath: n.path, maxBytes: config.index.limits.max_file_bytes }, null)) }));
  return { index, protectedRefs, hash: hash(canonicalJson({ config, selection, nodes })) };
}
function protectedEntry(e: Entry, c: ReturnType<typeof context>): boolean {
  if (e.active || e.pinned) return true;
  if (!e.work_ref) return false;
  if (c.protectedRefs.has(e.work_ref)) return true;
  const matches = Object.values(c.index.nodes).filter(n => e.work_ref === n.qid || e.work_ref === n.id || (n.identity && e.work_ref === identityRef(n.identity)));
  if (matches.length !== 1 || matches[0].source?.imported) fail("working reference is missing or ambiguous; review before cleanup");
  return !["done", "cancelled", "superseded"].includes(matches[0].status ?? "");
}
function ancestry(root: string, paths: string[] = []): Map<string, string> {
  const map = new Map<string, string>();
  for (const file of [".", ".mdkg", ...[...directories(root), ...paths].flatMap(f => {
    const parts = f.split("/"); return parts.slice(0, -1).map((_, i) => parts.slice(0, i + 1).join("/"));
  })]) {
    if (!map.has(file) && fs.existsSync(path.join(root, file))) {
      const stat = fs.lstatSync(path.join(root, file));
      map.set(file, `${stat.dev}:${stat.ino}`);
    }
  }
  return map;
}
function checkAncestry(root: string, bound: Map<string, string>): void {
  for (const [file, value] of bound) {
    const stat = fs.lstatSync(path.join(root, file));
    if (stat.isSymbolicLink() || `${stat.dev}:${stat.ino}` !== value) fail("working parent changed since admission");
  }
}
function request(v: unknown): WorkingRequest {
  const r = keys(v, ["action", "ids", "owner", "file", "work_ref", "summary", "archive_id", "confirm_stopped", "confirm_loss"], "working request");
  if (!["init", "add", "adopt", "retain", "release", "pin", "unpin", "promote", "gc", "recover", "purge"].includes(r.action) ||
      !Array.isArray(r.ids) || r.ids.length > 128 || new Set(r.ids).size !== r.ids.length || r.ids.some((id: unknown) => !isIdentityUuid(id))) fail("invalid working request/selection");
  for (const key of ["owner", "file", "work_ref", "summary", "archive_id"]) if (r[key] !== undefined && (typeof r[key] !== "string" || !r[key] || r[key].length > 500)) fail("invalid working request value");
  for (const key of ["confirm_stopped", "confirm_loss"]) if (r[key] !== undefined && typeof r[key] !== "boolean") fail("invalid working confirmation");
  return r as WorkingRequest;
}
function validatePlan(v: unknown): asserts v is WorkingPlan {
  const p = keys(v, ["format", "version", "operation_id", "created_at", "host", "store_id", "request", "snapshot_hash", "context_hash", "manifest_after", "effects", "plan_hash"], "working plan");
  if (p.format !== "mdkg-working-plan" || p.version !== 1 || !isIdentityUuid(p.operation_id) || !isIdentityUuid(p.store_id) ||
      typeof p.created_at !== "string" || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(p.created_at) || !Array.isArray(p.effects) || p.effects.length > 260) fail("unsupported working plan");
  host(p.host); request(p.request); parseManifest(p.manifest_after); digest(p.snapshot_hash); digest(p.context_hash); digest(p.plan_hash);
  if (canonicalJson(p.manifest_after.host) !== canonicalJson(p.host) || p.manifest_after.store_id !== p.store_id) fail("plan host/store mismatch");
  for (const value of p.effects) {
    const e = keys(value, ["kind", "path", "hash", "before", "from"], "working effect");
    if (!["write", "move", "delete"].includes(e.kind) || typeof e.path !== "string" || (e.before !== null && typeof e.before !== "string")) fail("invalid working effect");
    digest(e.hash); if (e.before !== null) digest(e.before);
    if (e.kind === "move" ? typeof e.from !== "string" : e.from !== undefined) fail("invalid working move");
  }
  const { plan_hash, ...rest } = p;
  if (hash(canonicalJson(rest)) !== plan_hash) fail("working plan hash mismatch");
}

function prepare(root: string, input: WorkingRequest, identity?: { id: string; date: string }, override?: { before: Manifest | null; marker: boolean; ignore: string | null; omitted: Set<string> }): { plan: WorkingPlan; effects: PreparedEffect[]; before: Manifest | null } {
  const r = request(input), op = identity?.id ?? newIdentityUuid(), date = identity?.date ?? new Date().toISOString();
  const c = context(root, override?.omitted), currentHost = readWorkingHost(root);
  const before = override ? override.before : (exists(root, MANIFEST) ? readStore(root) : null);
  let binding = currentHost;
  const effects: PreparedEffect[] = [];
  const write = (file: string, data: Buffer | string, old: string | null = null, source?: string) => {
    const bytes = Buffer.isBuffer(data) ? data : Buffer.from(data);
    effects.push({ kind: "write", path: file, hash: hash(bytes), before: old, ...(source ? { source } : { data: bytes }) });
  };
  if (r.action === "init") {
    if (r.ids.length || r.owner || r.file || r.work_ref || r.summary || r.archive_id || r.confirm_loss || r.confirm_stopped) fail("working init takes no entry options");
    if (before) fail("working store already initialized; use working verify");
    if (!override && directories(root).length) fail("custom/nonempty working store; preserve it before explicit adoption");
    binding ??= { kind: "working-host-v1", id: deriveIdentityUuid(op, "working-host", [c.hash]) };
    if (readWorkingMarker(root) === undefined || override?.marker) write(WORKING_HOST_PATH, workingMarkerBytes(binding.id));
    const ignore = override ? (override.ignore ?? "") : (exists(root, ".gitignore") ? readFile(root, ".gitignore").toString("utf8") : "");
    if (!ignore.split(/\r?\n/).includes(".mdkg/working/")) write(".gitignore", ignore + (ignore && !ignore.endsWith("\n") ? "\n" : "") + ".mdkg/working/\n", ignore ? hash(ignore) : null);
  } else if (!before || !binding) fail("working store is not initialized; preview mdkg working init");
  const m: Manifest = before ? structuredClone(before) : { format: "mdkg-working", version: 1, host: binding!, store_id: deriveIdentityUuid(op, "working-store", [binding!.id]), entries: [] };
  if (before) verifyHost(root, before.host);
  const selected = r.ids.map(id => m.entries.find(e => e.id === id) ?? fail("working entry not found"));
  const own = (e: Entry) => { if (!r.owner || r.owner !== e.owner) fail("exact recorded working owner required; ownership is not inferred from age/PID"); };
  if (["add", "adopt"].includes(r.action)) {
    if (r.ids.length || !r.file || !r.owner || r.owner.length > 200 || r.summary || r.archive_id || r.confirm_loss || r.confirm_stopped) fail("working add/adopt requires --file and --owner only, with optional --work-ref");
    if (workingPath(r.file)) fail("reserved store input requires separate preserved external data-only selection");
    const bytes = readFile(root, r.file);
    if (r.work_ref) {
      const matches = Object.values(c.index.nodes).filter(n => n.qid === r.work_ref || n.id === r.work_ref || (n.identity && identityRef(n.identity) === r.work_ref));
      if (matches.length !== 1 || matches[0].source?.imported) fail("work reference must identify one local node");
      if (c.index.meta.graph_format?.format_version === 2 && r.work_ref !== identityRef(matches[0].identity!)) fail("v2 work references require stable mdkg identity");
    }
    const e: Entry = { id: deriveIdentityUuid(op, "working-entry", [m.store_id]), sha256: hash(bytes), bytes: bytes.length,
      source: r.file, owner: r.owner, active: true, pinned: false, work_ref: r.work_ref ?? null, state: "live", quarantine: null, promoted: null };
    m.entries.push(e); write(dataPath(e), bytes, null, r.file);
  } else if (["retain", "release", "pin", "unpin", "promote"].includes(r.action)) {
    if (selected.length !== 1 || r.file || r.work_ref || r.confirm_loss) fail("working operation requires exactly one entry");
    const e = selected[0]; own(e);
    if (e.state !== "live") fail("working operation requires a live entry");
    if (r.action === "release") {
      if (!r.confirm_stopped) fail("release requires --confirm-stopped; missing PID never releases custody");
      e.active = false;
    } else if (r.action === "retain") e.active = true;
    else if (r.action === "pin") e.pinned = true;
    else if (r.action === "unpin") e.pinned = false;
    else {
      if (!r.summary || !r.archive_id || !isPortableId(r.archive_id) || e.promoted) fail("promotion needs a new explicit --archive-id and sanitized --summary-file");
      if (workingPath(r.summary)) fail("promotion summary must be explicitly sanitized outside working");
      const raw = readFile(root, r.summary), name = "summary.md", base = `.mdkg/archive/${r.archive_id}`;
      const zip = createDeterministicZip(name, raw);
      const fm: Record<string, any> = { id: r.archive_id, type: "archive", title: `Working evidence ${e.id}`, archive_kind: "artifact", source_path: r.summary,
        stored_path: "source/summary.md", compressed_path: "summary.md.zip", mime_type: "text/markdown", byte_size: String(raw.length),
        sha256: hash(raw), compressed_sha256: hash(zip), visibility: "private", provenance: "local-copy", ingest_status: "compressed",
        tags: [], owners: [], links: [], artifacts: [], relates: [], refs: e.work_ref ? [e.work_ref] : [], aliases: [], created: date.slice(0, 10), updated: date.slice(0, 10) };
      if (m.host.kind === "canonical-v2") Object.assign(fm, { graph_id: m.host.id, node_id: deriveIdentityUuid(op, "working-promotion", [r.archive_id]) });
      const file = `${base}/summary.md.md`;
      const authored = authorNewIdentityNode(root, c.index, "root", ["---", ...formatFrontmatter(fm), "---", "# Archive Entry", "", "# Provenance", "",
        `Explicit sanitized promotion from working entry ${e.id}; source digest ${e.sha256}. Mutable original retained.`, ""].join("\n"), file);
      write(`${base}/source/summary.md`, raw, null, r.summary); write(`${base}/summary.md.zip`, zip); write(file, authored.content);
      e.promoted = `archive://${r.archive_id}`;
    }
    if (r.action !== "promote" && (r.summary || r.archive_id)) fail("summary/archive options apply only to promote");
    if (r.action !== "release" && r.confirm_stopped) fail("stopped confirmation applies only to release");
  } else if (["gc", "recover", "purge"].includes(r.action)) {
    if (!selected.length || r.file || r.work_ref || r.summary || r.archive_id || r.confirm_stopped) fail("cleanup requires explicit entry IDs and exact owner");
    if (r.action === "purge" && !r.confirm_loss) fail("purge requires --confirm-loss; selected bytes become unrecoverable through mdkg");
    if (r.action !== "purge" && r.confirm_loss) fail("loss confirmation applies only to purge");
    for (const e of selected) {
      own(e); if (protectedEntry(e, c)) fail("active, pinned or current work entry is protected");
      const from = dataPath(e);
      if (r.action === "gc") {
        if (e.state !== "live") fail("GC accepts only live entries");
        e.state = "quarantine"; e.quarantine = op;
        effects.push({ kind: "move", from, path: dataPath(e), hash: e.sha256, before: null });
      } else if (r.action === "recover") {
        if (e.state !== "quarantine") fail("recover requires retained quarantine bytes");
        e.state = "live"; e.quarantine = null;
        effects.push({ kind: "move", from, path: dataPath(e), hash: e.sha256, before: null });
      } else {
        if (e.state !== "quarantine") fail("purge accepts only explicitly selected quarantined entries");
        effects.push({ kind: "delete", path: from, hash: e.sha256, before: e.sha256 });
        e.state = "purged";
      }
    }
  }
  parseManifest(m);
  write(MANIFEST, json(m), before ? hash(json(before)) : null);
  for (const e of effects) {
    admitWorkingPath(root, e.path, e.kind === "delete" ? "delete" : e.before ? "replace" : "create");
    if (!override && fileHash(root, e.path) !== e.before) fail("working destination collision or changed input");
    if (e.from) { admitWorkingPath(root, e.from); if (!override && fileHash(root, e.from) !== e.hash) fail("working source changed"); }
  }
  const publicEffects = effects.map(({ data, source, ...e }) => e);
  const p = { format: "mdkg-working-plan" as const, version: 1 as const, operation_id: op, created_at: date, host: m.host, store_id: m.store_id, request: r,
    snapshot_hash: hash(json(before)), context_hash: c.hash, manifest_after: m, effects: publicEffects };
  return { plan: { ...p, plan_hash: hash(canonicalJson(p)) }, effects, before };
}

/** Preview contains metadata and hashes only. Persist it explicitly outside the
 * store; applying always compares fresh independently admitted inputs. */
export function previewWorking(root: string, r: WorkingRequest): WorkingPlan { return prepare(root, r).plan; }

function execute(root: string, journal: Journal, hook?: (step: string) => void): void {
  const p = journal.plan; verifyHost(root, p.host);
  const currentLock = heldMutationLock(root);
  const omitted = new Set(p.request.action === "promote" ? [`.mdkg/archive/${p.request.archive_id}/summary.md.md`] : []);
  const reproduced = prepare(root, p.request, { id: p.operation_id, date: p.created_at }, { before: journal.manifest_before, marker: p.effects.some(e => e.path === WORKING_HOST_PATH), ignore: journal.ignore_before, omitted });
  if (canonicalJson(reproduced.plan) !== canonicalJson(p)) fail("journal no longer reproduces the approved operation");
  const bound = ancestry(root, journal.effects.flatMap(e => [e.path, ...(e.from ? [e.from] : []), ...(e.source ? [e.source] : [])]));
  const fresh = context(root, omitted); if (fresh.hash !== p.context_hash) fail("working context/protections changed; preserve journal for review");
  for (const e of journal.effects) {
    if (!e.path.startsWith(`${WORKING_ROOT}/`) && !(p.request.action === "init" && [WORKING_HOST_PATH, ".gitignore"].includes(e.path)) &&
        !(p.request.action === "promote" && e.path.startsWith(`.mdkg/archive/${p.request.archive_id}/`))) fail("journal effect outside operation authority");
    if (e.from && !e.from.startsWith(`${WORKING_ROOT}/`)) fail("journal move outside working authority");
    admitWorkingPath(root, e.path, e.kind === "delete" ? "delete" : "replace");
    if (e.from) admitWorkingPath(root, e.from);
    const actual = fileHash(root, e.path);
    if (e.kind === "move") {
      const source = fileHash(root, e.from!);
      if (!((source === e.hash && actual === null) || (source === null && actual === e.hash))) fail("ambiguous working move; preserve both locations");
    } else if (e.kind === "delete") {
      if (actual !== null && actual !== e.hash) fail("purge bytes changed; preserve them");
    } else if (actual !== e.hash && actual !== e.before) fail("working write destination changed; preserve it");
  }
  const admitted = new Set([MANIFEST, ...journal.effects.flatMap(e => [e.path, ...(e.from ? [e.from] : [])]),
    ...(journal.manifest_before?.entries ?? []).filter(e => e.state !== "purged").map(dataPath), ...p.manifest_after.entries.filter(e => e.state !== "purged").map(dataPath)]);
  for (const file of directories(root)) {
    if (admitted.has(file)) continue;
    const match = /^\.mdkg\/working\/operations\/([0-9a-f-]+)\.json$/.exec(file);
    if (!match) fail("unknown working contents during resume; preserve all bytes");
    const prior = readJournal(root, match[1]); verifyHost(root, prior.plan.host);
    if (prior.state === "pending" && prior.plan.operation_id !== p.operation_id) fail("another working operation is pending");
  }
  if (canonicalJson(journal.lock_record) !== canonicalJson(currentLock)) {
    journal.lock_record = currentLock;
    atomicReplaceContainedFile({ root, relativePath: journalPath(p.operation_id), mode: 0o600 }, json(journal));
  }
  for (let i = 0; i < journal.effects.length; i++) {
    const e = journal.effects[i]; heldMutationLock(root); checkAncestry(root, bound); verifyHost(root, p.host);
    const after = fileHash(root, e.path);
    if (e.kind === "move") {
      const source = fileHash(root, e.from!);
      if (source === null && after === e.hash) continue;
      if (source !== e.hash || after !== null) fail("ambiguous working move; preserve both locations");
      ensureContainedDirectory({ root, relativePath: path.posix.dirname(e.path) });
      for (const [file, epoch] of ancestry(root, [e.path])) if (!bound.has(file)) bound.set(file, epoch);
      checkAncestry(root, bound);
      withContainedPathSink({ root, relativePath: e.from!, operation: "delete" }, sourcePath =>
        withContainedPathSink({ root, relativePath: e.path, operation: "create" }, destination => fs.renameSync(sourcePath.absolutePath, destination.absolutePath)));
    } else if (e.kind === "delete") {
      if (after === null) continue;
      if (after !== e.hash) fail("purge bytes changed; preserve them");
      removeContainedPath({ root, relativePath: e.path });
    } else {
      if (after === e.hash) continue;
      if (after !== e.before) fail("working write destination changed; preserve it");
      const bytes = e.data64 !== undefined ? Buffer.from(e.data64, "base64") : readFile(root, e.source!);
      if (hash(bytes) !== e.hash) fail("working input changed; preserve journal and source");
      const directory = path.posix.dirname(e.path);
      if (directory !== ".") ensureContainedDirectory({ root, relativePath: directory });
      checkAncestry(root, bound);
      for (const [file, epoch] of ancestry(root, [e.path])) if (!bound.has(file)) bound.set(file, epoch);
      if (e.before === null) writeContainedFileExclusive({ root, relativePath: e.path, mode: 0o600 }, bytes);
      else atomicReplaceContainedFile({ root, relativePath: e.path, mode: 0o600 }, bytes);
    }
    hook?.(`effect:${i}`);
  }
  journal.state = "completed";
  checkAncestry(root, bound);
  atomicReplaceContainedFile({ root, relativePath: journalPath(p.operation_id), mode: 0o600 }, json(journal));
  hook?.("completed");
}

export function applyWorking(root: string, candidate: unknown, planHash: string, hook?: (step: string) => void): WorkingPlan {
  validatePlan(candidate); const p = candidate;
  if (p.plan_hash !== planHash) fail("explicit working plan hash required");
  if (exists(root, journalPath(p.operation_id))) {
    const prior = readJournal(root, p.operation_id); verifyHost(root, p.host);
    if (canonicalJson(prior.plan) !== canonicalJson(p)) fail("operation ID already belongs to another plan");
    if (prior.state === "completed") return prior.plan;
    fail("unfinished working operation; explicitly resume the original plan");
  }
  const config = loadConfig(root);
  // All freshness/path/conflict checks run before lock creation and again under it.
  let result = prepare(root, p.request, { id: p.operation_id, date: p.created_at });
  if (canonicalJson(result.plan) !== canonicalJson(p)) fail("stale working plan; preview again");
  return withMutationLock(root, config.index.lock_timeout_ms, () => {
    result = prepare(root, p.request, { id: p.operation_id, date: p.created_at });
    if (canonicalJson(result.plan) !== canonicalJson(p)) fail("stale working plan; preview again");
    if (p.request.action === "init" && !exists(root, WORKING_HOST_PATH)) {
      const marker = result.effects.find(e => e.path === WORKING_HOST_PATH)!;
      if (marker.path !== WORKING_HOST_PATH || !marker.data) fail("invalid explicit host adoption");
      writeContainedFileExclusive({ root, relativePath: WORKING_HOST_PATH, mode: 0o600 }, marker.data);
    }
    verifyHost(root, p.host);
    const j: Journal = { format: "mdkg-working-journal", version: 1, state: "pending", plan: p, manifest_before: result.before,
      lock_record: heldMutationLock(root),
      ignore_before: exists(root, ".gitignore") ? readFile(root, ".gitignore").toString("utf8") : null,
      effects: result.effects.map(({ data, source, ...effect }) => ({ ...effect,
        ...(effect.kind === "write" ? (source ? { source } : { data64: data!.toString("base64") }) : {}) })) };
    ensureContainedDirectory({ root, relativePath: `${WORKING_ROOT}/operations` });
    writeContainedFileExclusive({ root, relativePath: journalPath(p.operation_id), mode: 0o600 }, json(j));
    hook?.("journal"); execute(root, j, hook); return p;
  }, { plan_hash: p.plan_hash, mode: "apply" });
}

export function inspectWorkingRecovery(root: string, id: string, planHash: string): { state: string; lock_evidence: string | null; requires_quiescence: boolean } {
  const j = readJournal(root, id); verifyHost(root, j.plan.host);
  if (j.plan.plan_hash !== planHash) fail("original working plan hash required for recovery inspection");
  const record = readMutationLock(root);
  return { state: j.state, lock_evidence: record ? hash(canonicalJson({ journal_hash: fileHash(root, journalPath(id)), record, host: j.plan.host, context: context(root, new Set(j.plan.request.action === "promote" ? [`.mdkg/archive/${j.plan.request.archive_id}/summary.md.md`] : [])).hash })) : null,
    requires_quiescence: record !== null };
}
export function resumeWorking(root: string, id: string, planHash: string, owner?: string, confirmStopped = false, hook?: (step: string) => void, authorization?: { lockEvidence?: string; confirmQuiescent?: boolean }): WorkingPlan {
  const j = readJournal(root, id); verifyHost(root, j.plan.host);
  if (j.plan.plan_hash !== planHash) fail("original working plan hash required for resume");
  if (j.state === "completed") return j.plan;
  if (j.plan.request.owner && (owner !== j.plan.request.owner || !confirmStopped)) fail("resume needs exact original owner and --confirm-stopped");
  const executeFresh = () => {
    const fresh = readJournal(root, id); verifyHost(root, fresh.plan.host);
    execute(root, fresh, hook); return fresh.plan;
  };
  const record = readMutationLock(root);
  if (!record) return withMutationLock(root, loadConfig(root).index.lock_timeout_ms, executeFresh, { plan_hash: planHash, mode: "resume" });
  const review = inspectWorkingRecovery(root, id, planHash);
  if (!authorization?.lockEvidence || authorization.lockEvidence !== review.lock_evidence || authorization.confirmQuiescent !== true)
    fail("retained writer lock requires fresh recovery inspection, exact --lock-evidence and --confirm-quiescent; PID absence is not approval");
  const journalHash = fileHash(root, journalPath(id))!;
  assertRecoveryLockEvidence(root, record, j.lock_record, planHash, journalHash, "resume");
  return withRecoveredMutationLock(root, { record, journal_record: j.lock_record, journal_hash: journalHash,
    approval_hash: authorization.lockEvidence, plan_hash: planHash, mode: "resume", confirm_quiescent: true }, executeFresh);
}

export function inspectWorking(root: string, action: "list" | "show" | "search" | "verify", value?: string): unknown {
  const m = readStore(root);
  if (action === "verify") return { ok: true, host: m.host, store_id: m.store_id, entries: m.entries.length, durability: "local files; ignored payload is not backup" };
  if (action === "list") return { host: m.host, store_id: m.store_id, entries: m.entries };
  if (action === "show") {
    const e = m.entries.find(e => e.id === value) ?? fail("working entry not found");
    return { entry: e, text: e.state === "purged" ? null : readFile(root, dataPath(e)).toString("utf8") };
  }
  if (!value) fail("working search requires a query");
  return { entries: m.entries.filter(e => e.state !== "purged" && readFile(root, dataPath(e)).toString("utf8").includes(value)) };
}

export function runWorkingCommand(options: { root: string; action: string; ids: string[]; owner?: string; file?: string; workRef?: string; summary?: string; archiveId?: string; apply?: boolean; plan?: string; planHash?: string; confirmStopped?: boolean; confirmLoss?: boolean; lockEvidence?: string; confirmQuiescent?: boolean; json?: boolean }): void {
  const { root, action } = options;
  if (["list", "show", "search", "verify"].includes(action)) {
    const count = ["show", "search"].includes(action) ? 1 : 0;
    if (options.ids.length !== count) fail(`working ${action} requires ${count} selection(s)`);
    console.log(JSON.stringify(inspectWorking(root, action as any, options.ids[0]), null, 2)); return;
  }
  if (action === "resume") {
    if (options.ids.length !== 1 || !options.planHash) fail("resume requires operation ID and original --plan-hash");
    if (!options.apply) {
      if (options.lockEvidence || options.confirmQuiescent || options.owner || options.confirmStopped) fail("recovery inspection makes no operator confirmation");
      console.log(JSON.stringify(inspectWorkingRecovery(root, options.ids[0], options.planHash), null, 2)); return;
    }
    console.log(JSON.stringify({ ok: true, plan: resumeWorking(root, options.ids[0], options.planHash, options.owner, options.confirmStopped, undefined,
      { lockEvidence: options.lockEvidence, confirmQuiescent: options.confirmQuiescent }) }, null, 2)); return;
  }
  if (options.apply) {
    if (!options.plan || !options.planHash || options.ids.length || options.file || options.owner || options.workRef || options.summary || options.archiveId || options.confirmStopped || options.confirmLoss) fail("apply accepts only --plan and --plan-hash; selection/confirmations are bound in that plan");
    if (workingPath(options.plan)) fail("saved plan must be outside working");
    const p: unknown = JSON.parse(readFile(root, options.plan, 8 * LIMIT).toString("utf8")); validatePlan(p);
    if (p.request.action !== action) fail("saved plan command mismatch");
    console.log(JSON.stringify({ ok: true, operation_id: p.operation_id, plan_hash: p.plan_hash, entries: applyWorking(root, p, options.planHash).manifest_after.entries }, null, 2)); return;
  }
  if (options.plan || options.planHash) fail("preview emits JSON; save it explicitly outside working, then apply its exact hash");
  const r: WorkingRequest = { action: action as Action, ids: options.ids,
    ...(options.owner ? { owner: options.owner } : {}), ...(options.file ? { file: options.file } : {}), ...(options.workRef ? { work_ref: options.workRef } : {}),
    ...(options.summary ? { summary: options.summary } : {}), ...(options.archiveId ? { archive_id: options.archiveId } : {}),
    ...(options.confirmStopped ? { confirm_stopped: true } : {}), ...(options.confirmLoss ? { confirm_loss: true } : {}) };
  console.log(JSON.stringify(previewWorking(root, r), null, 2));
}
