export const PACK_WARN_BYTES = 200000;

export function shouldWarnLargeOutput(bytes: number, isTTY: boolean): boolean {
  return isTTY && bytes >= PACK_WARN_BYTES;
}

export function formatLargeOutputWarning(bytes: number): string {
  return `warning: pack output is large (${bytes} bytes); consider --out <path> to write to a file`;
}
