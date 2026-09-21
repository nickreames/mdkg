const NUMERIC_ID_RE = /^[a-z]+-[0-9]+$/;
const WORKSPACE_RE = /^[a-z][a-z0-9_]*$/;
const PORTABLE_ID_RE = /^[a-z][a-z0-9_]*(?:[._-][a-z0-9_]+)*$/;
const SPECIAL_IDS = new Set(["rule-guide", "rule-soul", "rule-human"]);

// Syntax remains readable for historical graphs. Allocation and new authoring
// require exact arithmetic; never round, skip, or exponent-format an alias.
export function numericAlias(value: string): { prefix: string; number: number } | undefined {
  const match = /^([a-z]+)-([0-9]+)$/.exec(value);
  if (!match) return undefined;
  const number = Number(match[2]);
  if (!Number.isSafeInteger(number)) throw new UsageError("numeric alias exceeds the safe integer range; explicit reviewed graph repair is required");
  return { prefix: match[1], number };
}

export function numericSuccessor(value: number): number {
  if (!Number.isSafeInteger(value) || value < 0 || value >= Number.MAX_SAFE_INTEGER) {
    throw new UsageError("numeric alias allocation is unsafe or exhausted");
  }
  return value + 1;
}

export function maxNumericAlias(nodes: Record<string, { ws: string; id: string }>, ws: string, prefix: string): number {
  let max = 0;
  for (const node of Object.values(nodes)) {
    if (node.ws !== ws || !node.id.startsWith(`${prefix}-`)) continue;
    const parsed = numericAlias(node.id);
    if (parsed?.prefix === prefix) max = Math.max(max, parsed.number);
  }
  return max;
}

export function nextUnusedNumericAlias(baseId: string, used: Set<string>): string {
  const parsed = numericAlias(baseId);
  if (!parsed) throw new UsageError("duplicate id cannot be repaired automatically because it is not a canonical numeric id");
  let number = parsed.number;
  while (true) {
    number = numericSuccessor(number);
    const candidate = `${parsed.prefix}-${number}`;
    if (!used.has(candidate)) { used.add(candidate); return candidate; }
  }
}

export function isCanonicalId(value: string): boolean {
  return NUMERIC_ID_RE.test(value) || SPECIAL_IDS.has(value);
}

export function isPortableId(value: string): boolean {
  return isCanonicalId(value) || PORTABLE_ID_RE.test(value);
}

export function isCanonicalIdRef(value: string): boolean {
  if (parseIdentityRef(value)) return true;
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
  if (parseIdentityRef(value)) return true;
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
import { parseIdentityRef } from "../graph/identity";
import { UsageError } from "./errors";
