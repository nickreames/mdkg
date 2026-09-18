import path from "path";
import type { Config } from "../core/config";
import { containedPathExists, readContainedDirectory } from "../core/filesystem_authority";
import { parseFrontmatter } from "../graph/frontmatter";
import { assertNodeFormat, assertNoGraphConflictMarkers, GraphFormat, identityRef, readNodeIdentity } from "../graph/identity";
import { getWorkspaceDocRoots, listWorkspaceDocFilesByAlias } from "../graph/workspace_files";
import { workspaceDocumentOwner } from "../graph/workspace_ownership";
import { UsageError } from "../util/errors";
import type { UpgradePlan } from "./upgrade_transaction";

type Read = (relative: string) => Buffer | null;

/** Bind empty directories too: a new valid node must not silently join a
 * previously reviewed migration/recovery just because it has no conflicts. */
export function bindUpgradeGraphDirectories(plan: UpgradePlan, config: Config): void {
  const owner = workspaceDocumentOwner(config);
  for (const workspace of getWorkspaceDocRoots(plan.root, config)) {
    const prefix = path.relative(plan.root, workspace.root).split(path.sep).join("/");
    const visit = (relative: string, archive: boolean, depth: number): void => {
      if (owner(relative) !== workspace.alias) return;
      if (depth > config.index.limits.max_depth) {
        throw new UsageError("upgrade graph directory inventory exceeds index.limits.max_depth");
      }
      plan.list(relative);
      if (!containedPathExists({ root: plan.root, relativePath: relative })) return;
      for (const entry of readContainedDirectory({ root: plan.root, relativePath: relative })) {
        if (entry.isDirectory() && !(archive && entry.name === "source")) visit(`${relative}/${entry.name}`, archive, depth + 1);
      }
    };
    for (const folder of ["core", "design", "work", "archive"]) visit(`${prefix}/${folder}`, folder === "archive", 0);
  }
}

/** Check identities, not full graph validity (which is a separate validation gate).
 * Scaffold ownership is not authority to create, replace, or remap identities.
 * Use overlays so missing/new documents and the final --only subset are checked.
 */
export function assertUpgradeIdentities(root: string, config: Config, format: GraphFormat,
  additionalPaths: Iterable<string>, before: Read, after: Read): void {
  const owner = workspaceDocumentOwner(config);
  const roots = new Map(getWorkspaceDocRoots(root, config).map(item =>
    [item.alias, path.relative(root, item.root).split(path.sep).join("/")]));
  const paths = new Set(Object.values(listWorkspaceDocFilesByAlias(root, config)).flat()
    .map(file => path.relative(root, file).split(path.sep).join("/")));
  for (const file of additionalPaths) paths.add(file);
  const nodePaths = [...paths].filter(file => {
    const alias = owner(file), prefix = alias === undefined ? undefined : roots.get(alias);
    if (prefix === undefined || !file.endsWith(".md")) return false;
    const local = path.posix.relative(prefix, file);
    return local !== "core/core.md" && (/^(core|design|work)\//.test(local) ||
      (local.startsWith("archive/") && !local.split("/").includes("source")));
  }).sort();
  function identities(read: Read): Map<string, string> {
    const result = new Map<string, string>();
    for (const file of nodePaths) {
      const raw = read(file);
      if (raw === null) continue;
      assertNoGraphConflictMarkers(raw.toString("utf8"), file);
      let parsed: ReturnType<typeof parseFrontmatter>;
      try { parsed = parseFrontmatter(raw.toString("utf8"), file); }
      catch (error) {
        // Legacy scaffold upgrades historically permit unrelated plain Markdown.
        if (format.format_version === 1) continue;
        throw error;
      }
      const identity = readNodeIdentity(parsed.frontmatter, file);
      assertNodeFormat(format, identity, file);
      if (!identity) continue;
      const key = identityRef(identity);
      if (result.has(key)) throw new UsageError(`${file}: duplicate node identity in upgrade candidate`);
      const alias = parsed.frontmatter.id;
      if (typeof alias !== "string" || !alias) throw new UsageError(`${file}: identity requires a node alias`);
      result.set(key, `${owner(file)}:${alias}`);
    }
    return result;
  }
  const original = identities(before), candidate = identities(after);
  for (const [identity, alias] of original) {
    if (candidate.get(identity) !== alias) throw new UsageError(`upgrade would remove or remap identity ${identity}; use reviewed graph reconciliation`);
  }
  for (const identity of candidate.keys()) {
    if (!original.has(identity)) throw new UsageError(`upgrade would introduce identity ${identity}; use reviewed graph creation or reintroduction`);
  }
}
