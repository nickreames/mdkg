import crypto from "crypto";
import fs from "fs";
import path from "path";

type WritableData = string | Buffer;

function randomSuffix(): string {
  return `${process.pid}-${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
}

function writeAndSync(filePath: string, data: WritableData, flags: string, mode?: number): void {
  const handle = fs.openSync(filePath, flags, mode);
  try {
    if (typeof data === "string") {
      fs.writeFileSync(handle, data, "utf8");
    } else {
      fs.writeFileSync(handle, data);
    }
    fs.fsyncSync(handle);
  } finally {
    fs.closeSync(handle);
  }
}

export function atomicWriteFile(filePath: string, data: WritableData, mode?: number): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const tempPath = path.join(path.dirname(filePath), `.${path.basename(filePath)}.${randomSuffix()}.tmp`);
  try {
    writeAndSync(tempPath, data, "wx", mode);
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    fs.rmSync(tempPath, { force: true });
    throw err;
  }
}

export function writeFileExclusive(filePath: string, data: WritableData): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  writeAndSync(filePath, data, "wx");
}
