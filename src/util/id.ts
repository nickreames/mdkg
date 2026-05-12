const NUMERIC_ID_RE = /^[a-z]+-[0-9]+$/;
const WORKSPACE_RE = /^[a-z][a-z0-9_]*$/;
const PORTABLE_ID_RE = /^[a-z][a-z0-9_]*(?:[._-][a-z0-9_]+)*$/;
const SPECIAL_IDS = new Set(["rule-guide", "rule-soul", "rule-human"]);

export function isCanonicalId(value: string): boolean {
  return NUMERIC_ID_RE.test(value) || SPECIAL_IDS.has(value);
}

export function isPortableId(value: string): boolean {
  return isCanonicalId(value) || PORTABLE_ID_RE.test(value);
}

export function isCanonicalIdRef(value: string): boolean {
  const normalized = value.toLowerCase();
  const parts = normalized.split(":");
  if (parts.length === 1) {
    return isCanonicalId(parts[0] ?? "");
  }
  if (parts.length !== 2) {
    return false;
  }
  const workspace = parts[0] ?? "";
  const id = parts[1] ?? "";
  return WORKSPACE_RE.test(workspace) && isCanonicalId(id);
}

export function isPortableIdRef(value: string): boolean {
  const normalized = value.toLowerCase();
  const parts = normalized.split(":");
  if (parts.length === 1) {
    return isPortableId(parts[0] ?? "");
  }
  if (parts.length !== 2) {
    return false;
  }
  const workspace = parts[0] ?? "";
  const id = parts[1] ?? "";
  return WORKSPACE_RE.test(workspace) && isPortableId(id);
}
