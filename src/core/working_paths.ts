import path from "path";
import { containedPathExists, readContainedFileIfPresent } from "./filesystem_authority";
export function workingPath(file: string): boolean {
  const parts = path.posix.normalize(file.replace(/\\/g, "/")).normalize("NFC").toLowerCase().split("/");
  return parts.some((part, i) => part === ".mdkg" && parts[i + 1] === "working");
}
export function workingStorePresent(root: string): boolean {
  try {
    const marker = readContainedFileIfPresent({ root, relativePath: ".mdkg/working-host.json", maxBytes: 4096 });
    if (marker !== null && JSON.parse(marker)?.format === "mdkg-working-host") return true;
    const content = readContainedFileIfPresent({ root, relativePath: ".mdkg/working/manifest.json", maxBytes: 1024 * 1024 });
    return content !== null && JSON.parse(content)?.format === "mdkg-working";
  } catch {
    // An interrupted owned store still reserves its private boundary. Legacy
    // arbitrary scratch is not automatically converted into canonical metadata.
    return containedPathExists({ root, relativePath: ".mdkg/working/operations" });
  }
}
