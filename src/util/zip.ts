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
  const normalizedName = entryName.split(/[\\/]/).filter(Boolean).join("/");
  if (!normalizedName || normalizedName.includes("..")) {
    throw new Error("zip entry name must be a relative file name");
  }
  const nameBuffer = Buffer.from(normalizedName, "utf8");
  const compressed = zlib.deflateRawSync(data, { level: 9 });
  const crc = crc32(data);
  const timestamp = dosDate1980();

  const local = headerBuffer(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4);
  local.writeUInt16LE(0, 6);
  local.writeUInt16LE(8, 8);
  local.writeUInt16LE(timestamp.time, 10);
  local.writeUInt16LE(timestamp.date, 12);
  local.writeUInt32LE(crc, 14);
  local.writeUInt32LE(compressed.length, 18);
  local.writeUInt32LE(data.length, 22);
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
  central.writeUInt32LE(data.length, 24);
  central.writeUInt16LE(nameBuffer.length, 28);
  central.writeUInt16LE(0, 30);
  central.writeUInt16LE(0, 32);
  central.writeUInt16LE(0, 34);
  central.writeUInt16LE(0, 36);
  central.writeUInt32LE(0, 38);
  central.writeUInt32LE(0, 42);

  const localRecord = Buffer.concat([local, nameBuffer, compressed]);
  const centralRecord = Buffer.concat([central, nameBuffer]);
  const end = headerBuffer(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(1, 8);
  end.writeUInt16LE(1, 10);
  end.writeUInt32LE(centralRecord.length, 12);
  end.writeUInt32LE(localRecord.length, 16);
  end.writeUInt16LE(0, 20);

  return Buffer.concat([localRecord, centralRecord, end]);
}

export function readSingleFileZip(zip: Buffer): { entryName: string; data: Buffer } {
  if (zip.readUInt32LE(0) !== 0x04034b50) {
    throw new Error("zip local header missing");
  }
  const method = zip.readUInt16LE(8);
  const compressedSize = zip.readUInt32LE(18);
  const uncompressedSize = zip.readUInt32LE(22);
  const nameLength = zip.readUInt16LE(26);
  const extraLength = zip.readUInt16LE(28);
  const dataOffset = 30 + nameLength + extraLength;
  const entryName = zip.slice(30, 30 + nameLength).toString("utf8");
  const compressed = zip.slice(dataOffset, dataOffset + compressedSize);
  const data =
    method === 8 ? zlib.inflateRawSync(compressed) : method === 0 ? compressed : undefined;
  if (!data) {
    throw new Error(`unsupported zip compression method: ${method}`);
  }
  if (data.length !== uncompressedSize) {
    throw new Error("zip uncompressed size mismatch");
  }
  return { entryName, data };
}
