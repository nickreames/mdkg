import path from "path";
import fs from "fs";
import { Config, validateConfigSchema } from "../core/config";
import { forEachContainedDirectoryEntry } from "../core/filesystem_authority";
import { migrateConfig } from "../core/migrate";
import { workspaceDocumentRelativePath } from "../core/workspace_path";
import { workspaceDocumentOwner } from "./workspace_ownership";
import { UsageError } from "../util/errors";
import { workingPath } from "../core/working_paths";
import { assertTransportPath } from "./transport_paths";

export type TransportExclusionReason = "checkout-state" | "live-db" | "db-sidecar" | "private-db-payload";
export type TransportExclusion = { reason: TransportExclusionReason; roots: number };
export type TransportDatabase = {
  basePath: string;
  includePrivatePayloads?: boolean;
  db: Config["db"];
  index?: Config["index"];
  capabilities?: Config["capabilities"];
  bundles?: Config["bundles"];
  workspaces?: Config["workspaces"];
};
const sidecars = ["-wal", "-shm", "-journal", ".lock", ".tmp"];
const within = (file: string, root: string) => file === root || file.startsWith(`${root}/`);
const overlaps = (a: string, b: string) => within(a, b) || within(b, a);
const portableKey = (file: string) => file.normalize("NFC").toLowerCase();

// Configuration spelling is not filesystem identity on every supported host.
// Follow the workspace ownership precedent: inspect directory entries, never
// open the excluded payload or silently normalize it into another authority.
function assertPathSpellings(root: string, paths: string[]): void {
  const parents = new Map<string, fs.Dirent[]>();
  for (const file of paths) {
    let parent = root;
    for (const part of file.split("/")) {
      let entries = parents.get(parent);
      if (!entries) {
        entries = [];
        forEachContainedDirectoryEntry({ root, relativePath: path.relative(root, parent) || ".", pathSyntax: "native" }, (entry) => entries!.push(entry));
        parents.set(parent, entries);
      }
      const entry = entries.find((candidate) => candidate.name === part);
      const next = path.join(parent, part);
      if (!entry) {
        try { fs.lstatSync(next); }
        catch (error) {
          if ((error as NodeJS.ErrnoException).code === "ENOENT") break;
          throw error;
        }
        throw new UsageError(`transport path spelling differs from the filesystem: ${file}; use the exact directory-entry spelling`);
      }
      if (!entry.isDirectory()) break;
      parent = next;
    }
  }
}

// Historical private bundles carry the owning config; interpret that policy
// before legacy/v2 transport rather than treating an absent v2 manifest as
// permission to restore checkout state. Config-less public snapshots need a
// separately explicit portable-state contract, not guessed DB path defaults.
export function configuredBundleTransportState(entries: Map<string, Buffer>, profile: "public" | "private", scopedWorkspaces?: Config["workspaces"]) {
  const configBytes = entries.get(".mdkg/config.json");
  const decode = (bytes: Buffer) => validateConfigSchema(migrateConfig(JSON.parse(bytes.toString("utf8"))).config);
  const config = configBytes ? decode(configBytes) : undefined;
  const workspaces = config?.workspaces ?? scopedWorkspaces;
  if (!workspaces) return undefined;
  const owner = workspaceDocumentOwner({ workspaces });
  const databases: TransportDatabase[] = [];
  if (config) databases.push({ basePath: ".", ...config });
  transportStateFromLayouts(workspaces, profile, databases);
  for (const [alias, workspace] of Object.entries(workspaces)) {
    const file = workspaceDocumentRelativePath(workspace.path, workspace.mdkg_dir, "config.json");
    if (file === ".mdkg/config.json" || owner(file) !== alias) continue;
    const bytes = entries.get(file);
    if (bytes) databases.push({ basePath: workspace.path, ...decode(bytes) });
  }
  // A fresh manifest-bound workspace inventory still has conventional state
  // boundaries when no config is included. Do not let a self-declared private
  // role erase them. Historical config-less bundles get no such admission, and
  // only actual owning config can authorize a nonconventional checkpoint layout.
  const state = databases.length || scopedWorkspaces ? transportStateFromLayouts(workspaces, profile, databases) : undefined;
  if (state && config) {
    // A restored root config also supplies the clone/fork cache writers. Entry
    // admission alone cannot authorize their later writes. Use native resolver
    // semantics for these paths, not workspace-path backslash reinterpretation.
    // Child-only inspection snapshots do not restore a root checkout config.
    for (const file of [config.index.global_index_path, config.index.sqlite_path, config.capabilities.cache_path]) {
      state.assertOwnedPath(path.posix.normalize(file));
    }
  }
  return state;
}

// Explicit configured paths and conventional remnants are separate rules. A
// runtime file may share a directory with a deliberately portable checkpoint.
// Never exclude its entire parent as a substitute for classifying these paths.
export function graphTransportState(config: Config, profile: "public" | "private", databases: TransportDatabase[] = []) {
  return transportStateFromLayouts(config.workspaces, profile,
    [{ basePath: ".", db: config.db, index: config.index, capabilities: config.capabilities, bundles: config.bundles }, ...databases]);
}

function transportStateFromLayouts(workspaces: Config["workspaces"], profile: "public" | "private", sources: TransportDatabase[]) {
  const roots = Object.entries(workspaces).map(([alias, workspace]) => ({
    alias, prefix: workspaceDocumentRelativePath(workspace.path, workspace.mdkg_dir),
  }));
  for (const { prefix } of roots) assertTransportPath(prefix);
  const owner = workspaceDocumentOwner({ workspaces });
  const configPaths = new Set(Object.values(workspaces).map((workspace) => workspaceDocumentRelativePath(workspace.path, workspace.mdkg_dir, "config.json")));
  const unregisteredNested = sources.flatMap(({ basePath, workspaces: declared }) => Object.entries(declared ?? {}).flatMap(([alias, workspace]) => {
    if (alias === "root") return [];
    const base = workspaceDocumentRelativePath(basePath, workspace.path);
    return configPaths.has(workspaceDocumentRelativePath(base, workspace.mdkg_dir, "config.json")) ? [] : [{ alias, base }];
  }));
  const layouts = sources.map(({ basePath, db, includePrivatePayloads }) => {
    const relative = (file: string) => workspaceDocumentRelativePath(basePath, file);
    const state = relative(db.state_path);
    return { root: relative(db.root_path), runtime: relative(db.runtime_path), state, includePrivatePayloads: includePrivatePayloads !== false,
      manifest: path.posix.join(path.posix.dirname(state), `${path.posix.basename(state, path.posix.extname(state))}.manifest.json`),
      receipts: relative(db.receipts_path) };
  });
  const checkoutRoots = roots.map(({ prefix }) => `${prefix}/state`);
  const dbRoots = [...new Set([...layouts.map((layout) => layout.root), ...roots.map(({ prefix }) => `${prefix}/db`)])];
  const runtimeRoots = dbRoots.map((root) => `${root}/runtime`);
  const privateRoots = [...dbRoots.flatMap((root) => [`${root}/state`, `${root}/receipts`]), ...layouts.map((layout) => layout.receipts)];
  const portableFiles = layouts.flatMap((layout) => [layout.state, layout.manifest]);
  const portableReceipts = layouts.map((layout) => layout.receipts);
  const derivedRoots = [...roots.flatMap(({ prefix }) => ["index", "pack", "bundles", "subgraphs"].map((dir) => `${prefix}/${dir}`)),
    ...sources.flatMap(({ basePath, bundles }) => bundles ? [workspaceDocumentRelativePath(basePath, bundles.output_dir)] : [])];
  const derivedFiles = sources.flatMap(({ basePath, index, capabilities }) =>
    [index?.global_index_path, index?.sqlite_path, capabilities?.cache_path].filter((file): file is string => Boolean(file))
      .flatMap((file) => [file, ...sidecars.map((suffix) => `${file}${suffix}`)])
      .map((file) => workspaceDocumentRelativePath(basePath, file)));
  const authorityRoots = [...checkoutRoots, ...derivedRoots];
  const undeclaredLocals = (file: string) => {
    const parts = file.split("/");
    return parts.flatMap((part, index) => portableKey(part) === ".mdkg" &&
      !roots.some(({ prefix }) => prefix === parts.slice(0, index + 1).join("/")) ? [parts.slice(index + 1)] : []);
  };
  const conventionalDerived = (file: string) => {
    const parts = file.split("/");
    return parts.some((part, index) => {
      if (part !== ".mdkg" || roots.some(({ prefix }) => prefix === parts.slice(0, index + 1).join("/"))) return false;
      const local = parts.slice(index + 1);
      // Preserve the pre-existing cache/raw-source exclusions even for an
      // undeclared nested .mdkg directory; it does not become an owned graph.
      return ["index", "pack", "bundles", "subgraphs"].includes(local[0]) ||
        (local[0] === "archive" && local.includes("source")) ||
        (local[0] === "state" && local[1] === "identity-transactions");
    });
  };

  // A runtime/checkpoint/receipt configured as an authored graph document can
  // otherwise leak through a generated index even if its raw bytes are omitted.
  // Reject ambiguous ownership before any graph parser runs.
  for (const layout of layouts) {
    if ([...portableFiles, ...portableReceipts].some((file) => overlaps(file, layout.runtime)) || authorityRoots.some((root) =>
      [layout.state, layout.manifest, layout.receipts].some((file) => overlaps(file, root)))) {
      throw new UsageError("transport state has ambiguous live-runtime, checkpoint or checkout-state ownership");
    }
  }
  for (const file of [...authorityRoots, ...derivedFiles, ...runtimeRoots,
    ...layouts.flatMap((layout) => [layout.runtime, layout.state, layout.manifest, layout.receipts])]) {
    for (const { alias, prefix } of roots) {
      for (const directory of ["core", "design", "work", "archive", "skills", "templates", "identity", "config.json", "graph.json", "init-manifest.json"]) {
        const semantic = `${prefix}/${directory}`;
        // Deepest ownership cuts child roots out of the parent's discovery.
        // Check both directions: a configured state path inside this owner's
        // semantic tree, or this owner's tree inside an ancestor state path.
        if ((within(portableKey(file), portableKey(semantic)) && owner(file) === alias) ||
          (within(portableKey(semantic), portableKey(file)) && owner(semantic) === alias)) {
          throw new UsageError(`transport state overlaps authored graph discovery: ${file}; separate DB state from ${semantic}`);
        }
      }
    }
  }
  const policyPaths = [...authorityRoots, ...derivedFiles, ...dbRoots, ...runtimeRoots, ...privateRoots, ...portableFiles, ...unregisteredNested.map(({ base }) => base),
    ...roots.map(({ prefix }) => `${prefix}/archive`),
    ...layouts.flatMap((layout) => [layout.runtime, ...sidecars.map((suffix) => `${layout.runtime}${suffix}`)])];
  // Explicit legacy canonical workspaces remain canonical until separately reconfigured.
  const privateWorking = (file: string) => workingPath(file) && !roots.some(({ prefix }) => workingPath(prefix) && within(file, prefix));
  const classify = (file: string): TransportExclusionReason | undefined => {
    assertTransportPath(file);
    if (privateWorking(file)) {
      const parts = file.split("/");
      if (parts.some((p, i) => p.toLowerCase() === ".mdkg" && parts[i + 1]?.toLowerCase() === "working" && (p !== ".mdkg" || parts[i + 1] !== "working")))
        throw new UsageError("transport path aliases private working storage");
      return "checkout-state";
    }
    // Child configuration constrains both export and restore, but never expands
    // the parent's workspace selection. Unknown descendant DB paths cannot be
    // guessed from a graph role or a self-consistent archive hash.
    for (const nested of unregisteredNested) {
      if (within(portableKey(file), portableKey(nested.base))) {
        throw new UsageError(`nested workspace ${nested.alias} is not registered in the transport configuration; resolve its transport ownership before transport`);
      }
    }
    for (const rule of policyPaths) {
      if (within(portableKey(file), portableKey(rule)) && !within(file, rule)) {
        throw new UsageError(`transport path spelling aliases a state boundary: ${file}; expected ${rule}`);
      }
    }
    if (authorityRoots.some((root) => within(file, root)) || derivedFiles.includes(file) || conventionalDerived(file)) return "checkout-state";
    for (const local of undeclaredLocals(file)) {
      const normalized = local.map(portableKey);
      if (normalized[0] === "state") return "checkout-state";
      if (normalized[0] !== "db") continue;
      if (sidecars.some((suffix) => portableKey(file).endsWith(suffix))) return "db-sidecar";
      if (normalized[1] === "runtime") return "live-db";
      if (profile === "public" && ["state", "receipts"].includes(normalized[1])) return "private-db-payload";
    }
    for (const { prefix } of roots) {
      if (!within(file, `${prefix}/archive`)) continue;
      const parts = path.posix.relative(`${prefix}/archive`, file).split("/");
      if (parts.some((part) => portableKey(part) === "source" && part !== "source")) {
        throw new UsageError(`transport path spelling aliases raw archive source: ${file}`);
      }
      if (parts.includes("source")) return "checkout-state";
    }
    if (layouts.some((layout) => within(file, layout.runtime))) return "live-db";
    if (dbRoots.some((root) => within(file, root)) && sidecars.some((suffix) => portableKey(file).endsWith(suffix))) return "db-sidecar";
    if (profile === "public" && (portableFiles.includes(file) || privateRoots.some((root) => within(file, root)))) return "private-db-payload";
    if (layouts.some((layout) => !layout.includePrivatePayloads &&
      (file === layout.state || file === layout.manifest || within(file, layout.receipts) || within(file, `${layout.root}/state`) || within(file, `${layout.root}/receipts`)))) return "private-db-payload";
    // Traverse known portable ancestors in either profile so public omission
    // receives the private-payload reason, rather than an ancestor's live-DB
    // reason. No payload is opened; public private roots were rejected above.
    if (portableFiles.some((state) => within(state, file)) ||
      portableReceipts.some((receipts) => within(receipts, file) || (profile === "private" && within(file, receipts)))) return undefined;
    if (runtimeRoots.some((root) => within(file, root))) return "live-db";
    return undefined;
  };
  return Object.assign(classify, {
    assertOwnedPath: (file: string, selected?: string[], declaredOwner?: string) => {
      assertTransportPath(file);
      if (privateWorking(file)) throw new UsageError("unpromoted working payload is not graph transport");
      for (const { prefix } of roots) {
        if (within(portableKey(file), portableKey(prefix)) && !within(file, prefix)) {
          throw new UsageError(`transport path spelling aliases workspace ownership: ${file}; expected ${prefix}`);
        }
      }
      const alias = owner(file);
      if (!alias || !workspaces[alias].enabled || (selected && !selected.includes(alias)) ||
        (declaredOwner !== undefined && declaredOwner !== alias) || roots.some(root => root.prefix === file)) {
        throw new UsageError(`transport payload has no selected, enabled graph ownership: ${file}`);
      }
      return alias;
    },
    isPrivatePayload: (file: string) => portableFiles.includes(file) || privateRoots.some((root) => within(file, root)) ||
      undeclaredLocals(file).some((local) => local[0] === "db" && ["state", "receipts"].includes(local[1])),
    assertFilesystemSpellings: (root: string) => assertPathSpellings(root, policyPaths),
    isDerived: (file: string) => derivedRoots.some((root) => within(file, root)) || derivedFiles.includes(file) || conventionalDerived(file) ||
      roots.some(({ prefix }) => within(file, `${prefix}/archive`) && path.posix.relative(`${prefix}/archive`, file).split("/").includes("source")),
  });
}
