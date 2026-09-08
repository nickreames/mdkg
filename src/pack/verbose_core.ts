import path from "path";
import { containedPathExists, readContainedFile } from "../core/filesystem_authority";

export const DEFAULT_CORE_LIST_MAX_BYTES = 8 * 1024 * 1024;

export function readVerboseCoreList(root: string, listPath: string, maxBytes = DEFAULT_CORE_LIST_MAX_BYTES): string[] {
  const input = { root, relativePath: path.relative(root, path.resolve(root, listPath)), pathSyntax: "native" as const, maxBytes };
  if (!containedPathExists(input)) {
    throw new Error(`verbose core list not found: ${listPath}`);
  }

  const raw = readContainedFile(input, "utf8");
  const lines = raw.split(/\r?\n/);
  const ids: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    ids.push(trimmed.toLowerCase());
  }
  return ids;
}
