import zlib from "zlib";

const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i += 1) {
  let value = i;
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  CRC_TABLE[i] = value >>> 0;
}

function crc32(data: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDate1980(): { time: number; date: number } {
  return {
    time: 0,
    date: (0 << 9) | (1 << 5) | 1,
  };
}

function headerBuffer(size: number): Buffer {
  return Buffer.alloc(size);
}

export function createDeterministicZip(entryName: string, data: Buffer): Buffer {
  return createDeterministicZipFromEntries([{ name: entryName, data }]);
}

export type ZipEntry = {
  name: string;
  data: Buffer;
};

export type ZipReadLimits = {
  maxArchiveBytes: number;
  maxEntries: number;
  maxEntryNameBytes: number;
  maxEntryUncompressedBytes: number;
  maxTotalUncompressedBytes: number;
  maxExpansionRatio: number;
};

export const DEFAULT_ZIP_READ_LIMITS: ZipReadLimits = {
  maxArchiveBytes: 128 * 1024 * 1024,
  maxEntries: 10_000,
  maxEntryNameBytes: 4 * 1024,
  maxEntryUncompressedBytes: 64 * 1024 * 1024,
  maxTotalUncompressedBytes: 256 * 1024 * 1024,
  maxExpansionRatio: 1_000,
};

function normalizeEntryName(entryName: string): string {
  const normalizedName = entryName.split(/[\\/]/).filter(Boolean).join("/");
  if (!normalizedName || normalizedName.includes("..")) {
    throw new Error("zip entry name must be a relative file name");
  }
  return normalizedName;
}

export function createDeterministicZipFromEntries(entries: ZipEntry[]): Buffer {
  if (entries.length === 0) {
    throw new Error("zip must contain at least one entry");
  }
  const normalizedEntries = entries
    .map((entry) => ({ name: normalizeEntryName(entry.name), data: entry.data }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const seen = new Set<string>();
  for (const entry of normalizedEntries) {
    if (seen.has(entry.name)) {
      throw new Error(`duplicate zip entry: ${entry.name}`);
    }
    seen.add(entry.name);
  }

  const localRecords: Buffer[] = [];
  const centralRecords: Buffer[] = [];
  let localOffset = 0;
  const timestamp = dosDate1980();

  for (const entry of normalizedEntries) {
    const nameBuffer = Buffer.from(entry.name, "utf8");
    const compressed = zlib.deflateRawSync(entry.data, { level: 9 });
    const crc = crc32(entry.data);

    const local = headerBuffer(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(8, 8);
    local.writeUInt16LE(timestamp.time, 10);
    local.writeUInt16LE(timestamp.date, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(entry.data.length, 22);
    local.writeUInt16LE(nameBuffer.length, 26);
    local.writeUInt16LE(0, 28);

    const central = headerBuffer(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt16LE(timestamp.time, 12);
    central.writeUInt16LE(timestamp.date, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(compressed.length, 20);
    central.writeUInt32LE(entry.data.length, 24);
    central.writeUInt16LE(nameBuffer.length, 28);
    central.writeUInt16LE(0, 30);
    central.writeUInt16LE(0, 32);
    central.writeUInt16LE(0, 34);
    central.writeUInt16LE(0, 36);
    central.writeUInt32LE(0, 38);
    central.writeUInt32LE(localOffset, 42);

    const localRecord = Buffer.concat([local, nameBuffer, compressed]);
    localRecords.push(localRecord);
    centralRecords.push(Buffer.concat([central, nameBuffer]));
    localOffset += localRecord.length;
  }

  const localPayload = Buffer.concat(localRecords);
  const centralPayload = Buffer.concat(centralRecords);
  const end = headerBuffer(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(normalizedEntries.length, 8);
  end.writeUInt16LE(normalizedEntries.length, 10);
  end.writeUInt32LE(centralPayload.length, 12);
  end.writeUInt32LE(localPayload.length, 16);
  end.writeUInt16LE(0, 20);

  return Buffer.concat([localPayload, centralPayload, end]);
}

function resolveZipReadLimits(overrides: Partial<ZipReadLimits>): ZipReadLimits {
  const limits = { ...DEFAULT_ZIP_READ_LIMITS, ...overrides };
  for (const [key, value] of Object.entries(limits)) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error(`zip read limit must be positive: ${key}`);
    }
  }
  if (limits.maxExpansionRatio < 1) {
    throw new Error("zip read limit maxExpansionRatio must be at least 1");
  }
  return limits;
}

function readCentralDirectoryBounds(
  zip: Buffer,
  limits: ZipReadLimits
): { offset: number; entryCount: number } {
  if (zip.length < 22) {
    throw new Error("zip end of central directory missing or truncated");
  }
  const minimumOffset = Math.max(0, zip.length - (22 + 0xffff));
  for (let offset = zip.length - 22; offset >= minimumOffset; offset -= 1) {
    if (zip.readUInt32LE(offset) !== 0x06054b50) {
      continue;
    }
    const commentLength = zip.readUInt16LE(offset + 20);
    if (offset + 22 + commentLength !== zip.length) {
      continue;
    }
    const diskNumber = zip.readUInt16LE(offset + 4);
    const centralDisk = zip.readUInt16LE(offset + 6);
    const diskEntries = zip.readUInt16LE(offset + 8);
    const entryCount = zip.readUInt16LE(offset + 10);
    const centralSize = zip.readUInt32LE(offset + 12);
    const centralOffset = zip.readUInt32LE(offset + 16);
    if (
      diskNumber !== 0 ||
      centralDisk !== 0 ||
      diskEntries !== entryCount ||
      entryCount === 0xffff ||
      centralSize === 0xffffffff ||
      centralOffset === 0xffffffff
    ) {
      throw new Error("multi-disk and ZIP64 archives are not supported");
    }
    if (entryCount > limits.maxEntries) {
      throw new Error(`zip entry count exceeds configured limit: ${limits.maxEntries}`);
    }
    if (centralOffset + centralSize > offset || centralOffset > zip.length) {
      throw new Error("zip central directory bounds are invalid");
    }
    return { offset: centralOffset, entryCount };
  }
  throw new Error("zip end of central directory missing or truncated");
}

function exceedsExpansionRatio(uncompressedSize: number, compressedSize: number, limit: number): boolean {
  if (uncompressedSize === 0) {
    return false;
  }
  return compressedSize === 0 || uncompressedSize / compressedSize > limit;
}

export function readZipEntries(zip: Buffer, overrides: Partial<ZipReadLimits> = {}): ZipEntry[] {
  const limits = resolveZipReadLimits(overrides);
  if (zip.length > limits.maxArchiveBytes) {
    throw new Error(`zip archive exceeds configured byte limit: ${limits.maxArchiveBytes}`);
  }
  const centralDirectory = readCentralDirectoryBounds(zip, limits);
  const entries: ZipEntry[] = [];
  const seenNames = new Set<string>();
  let totalUncompressedBytes = 0;
  let offset = 0;
  while (offset < centralDirectory.offset) {
    if (offset + 30 > centralDirectory.offset) {
      throw new Error("zip local header is truncated");
    }
    const signature = zip.readUInt32LE(offset);
    if (signature !== 0x04034b50) {
      throw new Error("zip local header missing");
    }
    const flags = zip.readUInt16LE(offset + 6);
    const method = zip.readUInt16LE(offset + 8);
    const compressedSize = zip.readUInt32LE(offset + 18);
    const uncompressedSize = zip.readUInt32LE(offset + 22);
    const nameLength = zip.readUInt16LE(offset + 26);
    const extraLength = zip.readUInt16LE(offset + 28);
    if ((flags & ~0x0806) !== 0) {
      throw new Error(`unsupported zip general-purpose flags: ${flags}`);
    }
    if (method !== 0 && method !== 8) {
      throw new Error(`unsupported zip compression method: ${method}`);
    }
    if (nameLength === 0 || nameLength > limits.maxEntryNameBytes) {
      throw new Error(`zip entry name exceeds configured limit: ${limits.maxEntryNameBytes}`);
    }
    const nameStart = offset + 30;
    const dataOffset = nameStart + nameLength + extraLength;
    const dataEnd = dataOffset + compressedSize;
    if (dataOffset > centralDirectory.offset || dataEnd > centralDirectory.offset) {
      throw new Error("zip entry data is truncated");
    }
    const entryName = zip.slice(nameStart, nameStart + nameLength).toString("utf8");
    if (seenNames.has(entryName)) {
      throw new Error(`duplicate zip entry: ${entryName}`);
    }
    if (uncompressedSize > limits.maxEntryUncompressedBytes) {
      throw new Error(
        `zip entry exceeds configured uncompressed byte limit: ${entryName} (${limits.maxEntryUncompressedBytes})`
      );
    }
    if (totalUncompressedBytes + uncompressedSize > limits.maxTotalUncompressedBytes) {
      throw new Error(
        `zip total uncompressed bytes exceed configured limit: ${limits.maxTotalUncompressedBytes}`
      );
    }
    if (exceedsExpansionRatio(uncompressedSize, compressedSize, limits.maxExpansionRatio)) {
      throw new Error(`zip entry exceeds configured expansion ratio: ${entryName}`);
    }
    const compressed = zip.slice(dataOffset, dataOffset + compressedSize);
    let data: Buffer;
    if (method === 0) {
      data = compressed;
    } else {
      const remainingTotal = limits.maxTotalUncompressedBytes - totalUncompressedBytes;
      const maxOutputLength = Math.max(1, Math.min(limits.maxEntryUncompressedBytes, remainingTotal));
      try {
        data = zlib.inflateRawSync(compressed, { maxOutputLength });
      } catch (err) {
        const code = (err as NodeJS.ErrnoException).code;
        const message = err instanceof Error ? err.message : String(err);
        if (code === "ERR_BUFFER_TOO_LARGE" || /maxOutputLength|larger than/i.test(message)) {
          throw new Error(`zip entry output exceeds configured limit: ${entryName}`);
        }
        throw new Error(`zip entry inflation failed for ${entryName}: ${message}`);
      }
    }
    if (data.length !== uncompressedSize) {
      throw new Error("zip uncompressed size mismatch");
    }
    if (data.length > limits.maxEntryUncompressedBytes) {
      throw new Error(`zip entry output exceeds configured limit: ${entryName}`);
    }
    if (totalUncompressedBytes + data.length > limits.maxTotalUncompressedBytes) {
      throw new Error(
        `zip total uncompressed bytes exceed configured limit: ${limits.maxTotalUncompressedBytes}`
      );
    }
    if (exceedsExpansionRatio(data.length, compressedSize, limits.maxExpansionRatio)) {
      throw new Error(`zip entry exceeds configured expansion ratio: ${entryName}`);
    }
    seenNames.add(entryName);
    totalUncompressedBytes += data.length;
    entries.push({ name: entryName, data });
    offset = dataEnd;
  }
  if (offset !== centralDirectory.offset || entries.length !== centralDirectory.entryCount) {
    throw new Error("zip local and central directory entry counts do not match");
  }
  return entries;
}

export function readSingleFileZip(zip: Buffer): { entryName: string; data: Buffer } {
  const entries = readZipEntries(zip);
  if (entries.length !== 1) {
    throw new Error("zip must contain exactly one file");
  }
  return { entryName: entries[0].name, data: entries[0].data };
}
