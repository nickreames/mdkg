import path from "path";

export const PACK_WARN_BYTES = 200000;

export function shouldWarnLargeOutput(bytes: number, isTTY: boolean): boolean {
  return isTTY && bytes >= PACK_WARN_BYTES;
}

export function formatLargeOutputWarning(bytes: number): string {
  return `warning: pack output is large (${bytes} bytes); consider --out <path> to write to a file`;
}

export function sanitizeFilename(value: string): string {
  return value.replace(/[^a-z0-9_-]/gi, "-");
}

export function formatTimestampForFilename(date: Date): string {
  const pad = (value: number, size: number) => String(value).padStart(size, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1, 2),
    pad(date.getDate(), 2),
    "-",
    pad(date.getHours(), 2),
    pad(date.getMinutes(), 2),
    pad(date.getSeconds(), 2),
    pad(date.getMilliseconds(), 3),
  ].join("");
}

export function buildDefaultPackPath(
  root: string,
  rootId: string,
  format: string,
  verbose: boolean,
  now: Date
): string {
  const kind = verbose ? "verbose" : "standard";
  const safeId = sanitizeFilename(rootId.toLowerCase());
  const safeFormat = sanitizeFilename(format.toLowerCase());
  const timestamp = formatTimestampForFilename(now);
  const filename = `pack_${kind}_${safeId}_${timestamp}.${safeFormat}`;
  return path.resolve(root, ".mdkg", "pack", filename);
}
