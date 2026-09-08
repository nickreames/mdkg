import crypto from "crypto";
import path from "path";
import { containedPathExists, forEachContainedFileChunk, readContainedFile } from "../core/filesystem_authority";
import { DEFAULT_ZIP_READ_LIMITS, readSingleFileZip } from "../util/zip";

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

  const zipInput = { root: options.root, relativePath: path.relative(options.root, options.zipPath), pathSyntax: "native" as const };
  const rawInput = { root: options.root, relativePath: path.relative(options.root, options.rawPath), pathSyntax: "native" as const };
  try {
    if (!containedPathExists(zipInput)) {
      result.errors.push(`compressed cache missing: ${relativeLabel(options.root, options.zipPath)}`);
    } else {
      result.compressed_present = true;
      // Hash and parse the same bounded descriptor read, never an unchecked
      // preliminary whole-file read followed by a separately observed ZIP.
      const bytes = readContainedFile({ ...zipInput, maxBytes: DEFAULT_ZIP_READ_LIMITS.maxArchiveBytes }, null);
      const actualCompressedHash = hashArchiveBuffer(bytes);
      if (actualCompressedHash !== options.expectedCompressedHash) {
        result.errors.push(`compressed_sha256 mismatch: ${actualCompressedHash}`);
      }
      const unzipped = readSingleFileZip(bytes);
      const unzippedHash = hashArchiveBuffer(unzipped.data);
      if (unzippedHash !== options.expectedRawHash) {
        result.errors.push(`zip payload sha256 mismatch: ${unzippedHash}`);
      }
      if (String(unzipped.data.length) !== options.expectedByteSize) {
        result.errors.push(`zip payload byte_size mismatch: ${unzipped.data.length}`);
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    result.errors.push(`zip read failed: ${message}`);
  }

  try {
    if (containedPathExists(rawInput)) {
      result.raw_present = true;
      const hash = crypto.createHash("sha256");
      const actualByteSize = String(forEachContainedFileChunk(
        { ...rawInput, maxBytes: DEFAULT_ZIP_READ_LIMITS.maxEntryUncompressedBytes },
        (chunk) => { hash.update(chunk); }
      ));
      const actualRawHash = `sha256:${hash.digest("hex")}`;
      if (actualRawHash !== options.expectedRawHash) {
        result.errors.push(`raw sha256 mismatch: ${actualRawHash}`);
      }
      if (actualByteSize !== options.expectedByteSize) {
        result.errors.push(`raw byte_size mismatch: ${actualByteSize}`);
      }
    }
  } catch (err) { result.errors.push(`raw read failed: ${err instanceof Error ? err.message : String(err)}`); }

  result.ok = result.errors.length === 0;
  return result;
}
