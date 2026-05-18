import crypto from "crypto";
import fs from "fs";
import path from "path";
import { readSingleFileZip } from "../util/zip";

export type ArchiveIntegrityOptions = {
  root: string;
  rawPath: string;
  zipPath: string;
  expectedRawHash: string;
  expectedCompressedHash: string;
  expectedByteSize: string;
};

export type ArchiveIntegrityResult = {
  ok: boolean;
  raw_present: boolean;
  compressed_present: boolean;
  errors: string[];
};

export function hashArchiveBuffer(buffer: Buffer): string {
  return `sha256:${crypto.createHash("sha256").update(buffer).digest("hex")}`;
}

export function hashArchiveFile(filePath: string): string {
  return hashArchiveBuffer(fs.readFileSync(filePath));
}

function relativeLabel(root: string, filePath: string): string {
  return path.relative(root, filePath).split(path.sep).join("/");
}

export function checkArchiveIntegrity(options: ArchiveIntegrityOptions): ArchiveIntegrityResult {
  const result: ArchiveIntegrityResult = {
    ok: true,
    raw_present: false,
    compressed_present: false,
    errors: [],
  };

  if (!fs.existsSync(options.zipPath)) {
    result.errors.push(`compressed cache missing: ${relativeLabel(options.root, options.zipPath)}`);
  } else {
    result.compressed_present = true;
    const actualCompressedHash = hashArchiveFile(options.zipPath);
    if (actualCompressedHash !== options.expectedCompressedHash) {
      result.errors.push(`compressed_sha256 mismatch: ${actualCompressedHash}`);
    }
    try {
      const unzipped = readSingleFileZip(fs.readFileSync(options.zipPath));
      const unzippedHash = hashArchiveBuffer(unzipped.data);
      if (unzippedHash !== options.expectedRawHash) {
        result.errors.push(`zip payload sha256 mismatch: ${unzippedHash}`);
      }
      if (String(unzipped.data.length) !== options.expectedByteSize) {
        result.errors.push(`zip payload byte_size mismatch: ${unzipped.data.length}`);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      result.errors.push(`zip read failed: ${message}`);
    }
  }

  if (fs.existsSync(options.rawPath)) {
    result.raw_present = true;
    const actualRawHash = hashArchiveFile(options.rawPath);
    if (actualRawHash !== options.expectedRawHash) {
      result.errors.push(`raw sha256 mismatch: ${actualRawHash}`);
    }
    const actualByteSize = String(fs.statSync(options.rawPath).size);
    if (actualByteSize !== options.expectedByteSize) {
      result.errors.push(`raw byte_size mismatch: ${actualByteSize}`);
    }
  }

  result.ok = result.errors.length === 0;
  return result;
}
