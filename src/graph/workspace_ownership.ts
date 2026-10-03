import path from "path";
import fs from "fs";
import { privateWorkingPath } from "../core/working_paths";
import type { Config } from "../core/config";
import { workspaceDocumentRelativePath } from "../core/workspace_path";
import { forEachContainedDirectoryEntry } from "../core/filesystem_authority";

// Git/ZIP names are case-sensitive even on hosts whose filesystem is not.
// Reject a configured spelling that aliases another directory entry rather
// than silently assigning that entry to a different owner. Only inspect parent
// directory metadata: do not descend into a disabled root or follow links.
export function assertWorkspaceDocumentRootSpellings(root: string, config: Config): void {
  if (Object.values(config.workspaces).some(w => privateWorkingPath(root, workspaceDocumentRelativePath(w.path, w.mdkg_dir))))
    throw new Error("workspace overlaps private working storage");
  const parents = new Map<string, fs.Dirent[]>();
  for (const [alias, workspace] of Object.entries(config.workspaces)) {
    const parts = workspaceDocumentRelativePath(workspace.path, workspace.mdkg_dir).split("/");
    let parent = root;
    for (const part of parts) {
      let entries = parents.get(parent);
      if (!entries) {
        entries = [];
        forEachContainedDirectoryEntry(
          { root, relativePath: path.relative(root, parent) || ".", pathSyntax: "native" },
          (entry) => entries!.push(entry)
        );
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
        throw new Error(`workspace ${alias} path spelling differs from the filesystem: ${path.relative(root, next)}; use the exact directory-entry spelling before discovery or export`);
      }
      if (!entry.isDirectory()) break;
      parent = next;
    }
  }
}

// Ownership is lexical and independent of selection, visibility, or enabled
// state. Inactive roots still prevent their files being borrowed by a parent.
// Inputs to this resolver are repository-relative, slash-separated paths (Git
// and ZIP paths); do not reinterpret literal filename backslashes on POSIX.
export function workspaceDocumentOwner(config: Pick<Config, "workspaces">): (relativePath: string) => string | undefined {
  const roots = Object.entries(config.workspaces).map(([alias, workspace]) => ({
    alias, prefix: workspaceDocumentRelativePath(workspace.path, workspace.mdkg_dir),
  })).sort((a, b) => b.prefix.length - a.prefix.length || a.alias.localeCompare(b.alias));

  return (relativePath) => {
    const file = path.posix.normalize(relativePath);
    return roots.find(({ prefix }) => file === prefix || file.startsWith(`${prefix}/`))?.alias;
  };
}

export function absoluteWorkspaceDocumentOwner(root: string, config: Config): (filePath: string) => string | undefined {
  assertWorkspaceDocumentRootSpellings(root, config);
  const owner = workspaceDocumentOwner(config);
  return (filePath) => owner(path.relative(root, filePath).split(path.sep).join("/"));
}
