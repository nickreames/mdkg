import path from "path";

function isAbsoluteOnSupportedPlatform(value: string): boolean {
  return path.isAbsolute(value) || path.posix.isAbsolute(value) || path.win32.isAbsolute(value);
}

export function normalizeContainedWorkspacePath(value: string, label: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${label} cannot be empty`);
  }
  if (normalized.includes("\0")) {
    throw new Error(`${label} cannot contain NUL bytes`);
  }
  if (isAbsoluteOnSupportedPlatform(normalized)) {
    throw new Error(`${label} must be relative`);
  }
  if (normalized.split(/[\\/]+/).some((part) => part === "..")) {
    throw new Error(`${label} cannot contain parent-directory components`);
  }
  return normalized;
}

export function isRootWorkspacePath(value: string): boolean {
  const parts = value
    .trim()
    .split(/[\\/]+/)
    .filter(Boolean);
  return parts.length > 0 && parts.every((part) => part === ".");
}

export function workspaceDocumentRootKey(workspacePath: string, mdkgDir: string): string {
  return [workspacePath, mdkgDir]
    .flatMap((value) => value.trim().split(/[\\/]+/))
    .filter((part) => part && part !== ".")
    .join("/");
}

export function workspaceDocumentRelativePath(
  workspacePath: string,
  mdkgDir: string,
  ...suffix: string[]
): string {
  return [workspacePath, mdkgDir, ...suffix]
    .flatMap((value) => value.trim().split(/[\\/]+/))
    .filter((part) => part && part !== ".")
    .join("/");
}
