import fs from "fs";
import os from "os";
import path from "path";

export function makeTempDir(prefix: string): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

export function writeFile(filePath: string, contents: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents, "utf8");
}

export function touch(filePath: string, timeMs: number): void {
  const time = new Date(timeMs / 1000);
  fs.utimesSync(filePath, time, time);
}
