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

export function formatTimestampForFilename(date: Date, useUtc = false): string {
  const pad = (value: number, size: number) => String(value).padStart(size, "0");
  const year = useUtc ? date.getUTCFullYear() : date.getFullYear();
  const month = useUtc ? date.getUTCMonth() + 1 : date.getMonth() + 1;
  const day = useUtc ? date.getUTCDate() : date.getDate();
  const hours = useUtc ? date.getUTCHours() : date.getHours();
  const minutes = useUtc ? date.getUTCMinutes() : date.getMinutes();
  const seconds = useUtc ? date.getUTCSeconds() : date.getSeconds();
  const millis = useUtc ? date.getUTCMilliseconds() : date.getMilliseconds();
  return [
    year,
    pad(month, 2),
    pad(day, 2),
    "-",
    pad(hours, 2),
    pad(minutes, 2),
    pad(seconds, 2),
    pad(millis, 3),
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
