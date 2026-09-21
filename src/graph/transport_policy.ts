import path from "path";
import { Config } from "../core/config";
import { normalizeContainedWorkspacePath, workspaceDocumentRelativePath } from "../core/workspace_path";
import { ValidationError } from "../util/errors";
import { configuredBundleTransportState, graphTransportState } from "./transport_state";
import { assertTransportInventory, assertTransportPath } from "./transport_paths";

type TransportRole = "graph" | "private-db" | "projection";
export type PortableTransportPolicy = {
  version: 1;
  profile: "public" | "private";
  bundle_hash: string;
  workspaces: Array<{ alias: string; root: string }>;
  files: Array<{ path: string; role: TransportRole }>;
};
type TransportManifest = {
  profile: "public" | "private";
  bundle_hash: string;
  selected_workspaces: string[];
  files: Array<{ path: string; kind: string; workspace?: string; visibility?: string }>;
  transport_policy?: PortableTransportPolicy;
};
const projections = [".mdkg/index/global.json", ".mdkg/index/skills.json", ".mdkg/index/capabilities.json"];
const within = (file: string, root: string) => file === root || file.startsWith(`${root}/`);
const key = (file: string) => file.normalize("NFC").toLowerCase();
const record = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
function fail(message: string): never { throw new ValidationError(`portable transport policy invalid: ${message}`); }

function safePath(value: unknown): string {
  if (typeof value !== "string" || !value || value.includes("\\") || value.includes("\0") ||
    path.posix.isAbsolute(value) || /^[a-z]:/i.test(value) || value.split("/").some((part) => !part || part === "." || part === "..")) {
    fail("expected an exact portable relative path");
  }
  return value as string;
}

function exactKeys(value: Record<string, unknown>, keys: string[]): void {
  if (Object.keys(value).some((field) => !keys.includes(field)) || keys.some((field) => !(field in value))) fail("unknown or missing contract field");
}

function pathOwner(file: string, workspaces: PortableTransportPolicy["workspaces"]) {
  return workspaces.filter((workspace) => within(file, workspace.root)).sort((a, b) => b.root.length - a.root.length)[0];
}

// This is a structural export declaration, never an attestation or permission to
// execute code or restore a writer. Only already-included filenames are recorded;
// excluded DB paths, hashes, payloads and configuration never enter the contract.
export function createPortableTransportPolicy(config: Config, manifest: TransportManifest,
  state: ReturnType<typeof graphTransportState>): PortableTransportPolicy {
  const policy: PortableTransportPolicy = {
    version: 1, profile: manifest.profile, bundle_hash: manifest.bundle_hash,
    workspaces: manifest.selected_workspaces.map((alias) => ({ alias,
      root: workspaceDocumentRelativePath(config.workspaces[alias].path, config.workspaces[alias].mdkg_dir) })),
    files: manifest.files.map((file) => ({ path: file.path,
      role: file.kind === "generated_index" ? "projection" : state.isPrivatePayload(file.path) ? "private-db" : "graph" })),
  };
  return validatePortableTransportPolicy(policy, manifest)!;
}

export function validatePortableTransportPolicy(value: unknown, manifest: TransportManifest): PortableTransportPolicy | undefined {
  if (value === undefined) return undefined; // Historical inspection is not transport admission.
  if (!record(value)) fail("contract must be an object");
  exactKeys(value, ["version", "profile", "bundle_hash", "workspaces", "files"]);
  if (value.version !== 1 || value.profile !== manifest.profile || value.bundle_hash !== manifest.bundle_hash) fail("version, profile or payload hash mismatch");
  if (!Array.isArray(value.workspaces) || !Array.isArray(value.files)) fail("workspace and file inventories required");
  const roots = new Set<string>(), aliases = new Set<string>();
  const workspaces = value.workspaces.map((item) => {
    if (!record(item)) fail("invalid workspace");
    exactKeys(item, ["alias", "root"]);
    if (typeof item.alias !== "string" || !manifest.selected_workspaces.includes(item.alias) || aliases.has(item.alias)) fail("workspace selection mismatch");
    const root = safePath(item.root);
    assertTransportPath(root);
    if (item.alias === "root" && root !== ".mdkg") fail("root workspace must own .mdkg");
    if (roots.has(key(root))) fail("ambiguous workspace root");
    roots.add(key(root)); aliases.add(item.alias);
    return { alias: item.alias, root };
  });
  if (aliases.size !== manifest.selected_workspaces.length) fail("workspace inventory is incomplete");
  const rows = new Map(manifest.files.map((file) => [file.path, file]));
  const seen = new Set<string>();
  const files = value.files.map((item): PortableTransportPolicy["files"][number] => {
    if (!record(item)) fail("invalid file role");
    exactKeys(item, ["path", "role"]);
    const file = safePath(item.path), row = rows.get(file);
    assertTransportPath(file);
    if (!row || seen.has(key(file))) fail("duplicate, aliased or unmanifested file");
    seen.add(key(file));
    const role = item.role;
    if (role !== "graph" && role !== "private-db" && role !== "projection") fail("unknown file role");
    if (role === "projection") {
      if (!projections.includes(file) || row.kind !== "generated_index" || row.workspace !== undefined) fail("invalid projection role");
    } else {
      const owner = pathOwner(file, workspaces);
      if (!owner || owner.alias !== row.workspace || row.kind === "generated_index") fail("file ownership mismatch");
      if (manifest.profile === "public" && (role !== "graph" || row.visibility !== "public")) fail("non-public file role");
      if (role === "private-db" && /^(core|design|work|archive|skills|templates|identity)(\/|$)/i.test(file.slice(owner.root.length + 1))) fail("DB payload overlaps graph discovery");
      // Check every conventional nested graph boundary as well as custom roots.
      // Literal aliases are rejected, not normalized into new authority.
      const boundaries = [owner.root, ...file.split("/").flatMap((part, index, parts) => key(part) === ".mdkg" ? [parts.slice(0, index + 1).join("/")] : [])];
      for (const root of boundaries) {
        const local = key(file.slice(root.length + 1));
        if (/^(state|index|pack|bundles|subgraphs)(\/|$)/.test(local) || (local.startsWith("archive/") && local.split("/").includes("source"))) fail("checkout state cannot be portable");
        if (local.startsWith("db/") && /(-wal|-shm|-journal|\.lock|\.tmp)$/.test(local)) fail("DB sidecar cannot be portable");
        if (/^db\/(runtime|state|receipts)(\/|$)/.test(local) && role !== "private-db") fail("DB payload requires an explicit private role");
        if (manifest.profile === "public" && local === "config.json") fail("public owning configuration is not portable");
      }
    }
    return { path: file, role };
  });
  if (files.length !== manifest.files.length) fail("file inventory is incomplete");
  return { version: 1, profile: manifest.profile, bundle_hash: manifest.bundle_hash, workspaces, files };
}

export function portableTransportPayloadErrors(entries: Map<string, Buffer>, manifest: TransportManifest): string[] {
  if (!manifest.transport_policy) return [];
  try {
    assertTransportInventory(entries.keys());
    const policy = validatePortableTransportPolicy(manifest.transport_policy, manifest)!;
    const roles = new Map(policy.files.map((file) => [file.path, file.role]));
    const rows = new Map(manifest.files.map((file) => [file.path, file]));
    const check = (value: unknown, wsField: string) => {
      if (!record(value) || typeof value.path !== "string") fail("invalid projected record");
      const row = rows.get(value.path);
      if (roles.get(value.path) !== "graph" || !row || row.workspace !== value[wsField]) fail("projection is not bound to an included graph file and owner");
    };
    const json = (file: string) => JSON.parse(entries.get(file)?.toString("utf8") ?? "null") as unknown;
    const global = json(projections[0]), skills = json(projections[1]), capabilities = json(projections[2]);
    if (!record(global) || !record(global.nodes) || !record(global.workspaces) || !record(skills) || !record(skills.skills) ||
      !record(capabilities) || !Array.isArray(capabilities.records)) fail("invalid generated projection shape");
    if (Object.keys(global.workspaces).some((alias) => !manifest.selected_workspaces.includes(alias))) fail("unselected projected workspace");
    const scopedWorkspaces: Config["workspaces"] = {};
    for (const workspace of policy.workspaces) {
      const projected = global.workspaces[workspace.alias];
      if (!record(projected) || typeof projected.path !== "string") fail("missing workspace source path");
      const base = workspaceDocumentRelativePath(normalizeContainedWorkspacePath(projected.path, "transport workspace path"), ".");
      if (base && !workspace.root.startsWith(`${base}/`)) fail("workspace root does not match its projected source path");
      scopedWorkspaces[workspace.alias] = { path: base || ".", mdkg_dir: base ? workspace.root.slice(base.length + 1) : workspace.root,
        enabled: true, visibility: manifest.profile };
    }
    const state = configuredBundleTransportState(entries, manifest.profile, scopedWorkspaces);
    if (state) for (const file of policy.files) {
      if (file.role === "projection") continue;
      const row = rows.get(file.path)!;
      state.assertOwnedPath(file.path, manifest.selected_workspaces, row.workspace);
      if (state(file.path) || state.isPrivatePayload(file.path) !== (file.role === "private-db")) fail(`owning configuration contradicts role for ${file.path}`);
    }
    for (const node of Object.values(global.nodes)) check(node, "ws");
    for (const skill of Object.values(skills.skills)) check(skill, "ws");
    for (const capability of capabilities.records) check(capability, "workspace");
    return [];
  } catch (error) { return [error instanceof Error ? error.message : String(error)]; }
}

// Only a complete fresh contract or an actual owning configuration can admit
// transport. Contracted projections remain in the bundle for inspection, never
// installed as checkout caches. Cloning still separately requires owning config.
export function bundleTransportState(entries: Map<string, Buffer>, manifest: TransportManifest) {
  assertTransportInventory(entries.keys());
  if (!manifest.transport_policy) {
    const state = configuredBundleTransportState(entries, manifest.profile);
    if (!state) return undefined;
    // Historical integrity is not ownership. Projections are a fixed inspection
    // surface; every other file needs the deepest enabled, selected owner from
    // the actual configuration, not a self-declared row label.
    for (const row of manifest.files) {
      if (row.kind === "generated_index") {
        if (!projections.includes(row.path) || row.workspace !== undefined) fail("invalid historical projection ownership");
      } else {
        // Older manifests made row labels optional. The actual config still
        // proves ownership; a present label must agree, never grant authority.
        state.assertOwnedPath(row.path, manifest.selected_workspaces, row.workspace);
      }
    }
    // Exercise every classification before extraction, including paths excluded
    // from restored state. Never discover ambiguous ownership mid-write.
    for (const file of entries.keys()) if (file !== "manifest.json") state(file);
    return state;
  }
  const errors = portableTransportPayloadErrors(entries, manifest);
  if (errors.length) fail(errors.join("; "));
  const roles = new Map(manifest.transport_policy.files.map((file) => [file.path, file.role]));
  return (file: string) => file !== "manifest.json" && (!roles.has(file) || roles.get(file) === "projection") ? "checkout-state" as const : undefined;
}
