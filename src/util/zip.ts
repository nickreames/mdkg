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

export function readZipEntries(zip: Buffer): ZipEntry[] {
  const entries: ZipEntry[] = [];
  let offset = 0;
  while (offset + 4 <= zip.length) {
    const signature = zip.readUInt32LE(offset);
    if (signature === 0x02014b50 || signature === 0x06054b50) {
      break;
    }
    if (signature !== 0x04034b50) {
      throw new Error("zip local header missing");
    }
    const method = zip.readUInt16LE(offset + 8);
    const compressedSize = zip.readUInt32LE(offset + 18);
    const uncompressedSize = zip.readUInt32LE(offset + 22);
    const nameLength = zip.readUInt16LE(offset + 26);
    const extraLength = zip.readUInt16LE(offset + 28);
    const nameStart = offset + 30;
    const dataOffset = nameStart + nameLength + extraLength;
    const entryName = zip.slice(nameStart, nameStart + nameLength).toString("utf8");
    const compressed = zip.slice(dataOffset, dataOffset + compressedSize);
    const data =
      method === 8 ? zlib.inflateRawSync(compressed) : method === 0 ? compressed : undefined;
    if (!data) {
      throw new Error(`unsupported zip compression method: ${method}`);
    }
    if (data.length !== uncompressedSize) {
      throw new Error("zip uncompressed size mismatch");
    }
    entries.push({ name: entryName, data });
    offset = dataOffset + compressedSize;
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
