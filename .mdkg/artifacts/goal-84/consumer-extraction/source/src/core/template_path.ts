import path from "path";
import { normalizeContainedWorkspacePath } from "./workspace_path";

// Validate each raw component before joining: path.resolve must not erase an
// absolute selector or traversal and thereby change the template authority.
export function normalizeTemplatePath(value: string, label: string): string {
  const safe = normalizeContainedWorkspacePath(value, label);
  if (path.win32.parse(safe).root) throw new Error(`${label} must be relative`);
  return safe.split(/[\\/]+/).filter((part) => part && part !== ".").join("/") || ".";
}

export function templateSetRelativePath(rootPath: string, set: string): string {
  return [normalizeTemplatePath(rootPath, "templates.root_path"), normalizeTemplatePath(set, "templates.default_set")]
    .filter((part) => part !== ".").join("/") || ".";
}
