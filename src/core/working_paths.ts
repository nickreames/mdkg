import path from "path";
import { containedPathExists, readContainedFileIfPresent } from "./filesystem_authority";
export function workingPath(file: string): boolean {
  const parts = path.posix.normalize(file.replace(/\\/g, "/")).normalize("NFC").toLowerCase().split("/");
  return parts.some((part, i) => part === ".mdkg" && parts[i + 1] === "working");
}
export function workingStorePresent(root: string, graphDirectory = ".mdkg"): boolean {
  try {
    const marker = readContainedFileIfPresent({ root, relativePath: `${graphDirectory}/working-host.json`, maxBytes: 4096 });
    if (marker !== null && JSON.parse(marker)?.format === "mdkg-working-host") return true;
    const content = readContainedFileIfPresent({ root, relativePath: `${graphDirectory}/working/manifest.json`, maxBytes: 1024 * 1024 });
    return content !== null && JSON.parse(content)?.format === "mdkg-working";
  } catch {
    // An interrupted owned store still reserves its private boundary. Legacy
    // arbitrary scratch is not automatically converted into canonical metadata.
    return containedPathExists({ root, relativePath: `${graphDirectory}/working/operations` });
  }
}

export function privateWorkingPath(root: string, file: string): boolean {
  if (!workingPath(file)) return false;
  // Retain the root host's existing reservation. An unmanaged parent must also
  // honor each child's own boundary, independently of an untrusted cache alias.
  if (workingStorePresent(root)) return true;
  // Metadata reads retain exact directory-entry spelling, including Unicode.
  const parts = path.posix.normalize(file.replace(/\\/g, "/")).split("/");
  return parts.some((part, i) => part.toLowerCase() === ".mdkg" && parts[i + 1]?.toLowerCase() === "working" &&
    workingStorePresent(root, parts.slice(0, i + 1).join("/")));
}
