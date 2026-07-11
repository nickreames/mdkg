import { test } from "node:test";
import assert from "node:assert/strict";
const {
  createDeterministicZipFromEntries,
  readZipEntries,
} = require("../../util/zip") as {
  createDeterministicZipFromEntries: (entries: Array<{ name: string; data: Buffer }>) => Buffer;
  readZipEntries: (
    zip: Buffer,
    limits?: Partial<{
      maxArchiveBytes: number;
      maxEntries: number;
      maxEntryNameBytes: number;
      maxEntryUncompressedBytes: number;
      maxTotalUncompressedBytes: number;
      maxExpansionRatio: number;
    }>
  ) => Array<{ name: string; data: Buffer }>;
};

function createStoredZip(name: string, data: Buffer): Buffer {
  const nameBuffer = Buffer.from(name, "utf8");
  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4);
  local.writeUInt16LE(0, 6);
  local.writeUInt16LE(0, 8);
  local.writeUInt32LE(0, 14);
  local.writeUInt32LE(data.length, 18);
  local.writeUInt32LE(data.length, 22);
  local.writeUInt16LE(nameBuffer.length, 26);

  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0);
  central.writeUInt16LE(20, 4);
  central.writeUInt16LE(20, 6);
  central.writeUInt16LE(0, 8);
  central.writeUInt16LE(0, 10);
  central.writeUInt32LE(0, 16);
  central.writeUInt32LE(data.length, 20);
  central.writeUInt32LE(data.length, 24);
  central.writeUInt16LE(nameBuffer.length, 28);

  const localPayload = Buffer.concat([local, nameBuffer, data]);
  const centralPayload = Buffer.concat([central, nameBuffer]);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(1, 8);
  end.writeUInt16LE(1, 10);
  end.writeUInt32LE(centralPayload.length, 12);
  end.writeUInt32LE(localPayload.length, 16);
  return Buffer.concat([localPayload, centralPayload, end]);
}

function secondLocalHeaderOffset(zip: Buffer): number {
  const compressedSize = zip.readUInt32LE(18);
  const nameLength = zip.readUInt16LE(26);
  const extraLength = zip.readUInt16LE(28);
  return 30 + nameLength + extraLength + compressedSize;
}

test("zip reader round trips bounded deflated and stored entries", () => {
  const deflated = createDeterministicZipFromEntries([
    { name: "a.txt", data: Buffer.from("alpha\n") },
    { name: "b.txt", data: Buffer.from("beta\n") },
  ]);
  assert.deepEqual(
    readZipEntries(deflated).map((entry) => [entry.name, entry.data.toString("utf8")]),
    [
      ["a.txt", "alpha\n"],
      ["b.txt", "beta\n"],
    ]
  );

  const stored = createStoredZip("stored.txt", Buffer.from("stored payload\n"));
  assert.deepEqual(
    readZipEntries(stored).map((entry) => [entry.name, entry.data.toString("utf8")]),
    [["stored.txt", "stored payload\n"]]
  );
});

test("zip reader enforces independent archive and output limits", () => {
  const twoEntries = createDeterministicZipFromEntries([
    { name: "first-long-name.txt", data: Buffer.alloc(32, 0x61) },
    { name: "second.txt", data: Buffer.alloc(32, 0x62) },
  ]);

  assert.throws(
    () => readZipEntries(twoEntries, { maxArchiveBytes: twoEntries.length - 1 }),
    /archive exceeds configured byte limit/
  );
  assert.throws(() => readZipEntries(twoEntries, { maxEntries: 1 }), /entry count exceeds/);
  assert.throws(() => readZipEntries(twoEntries, { maxEntryNameBytes: 8 }), /entry name exceeds/);
  assert.throws(
    () => readZipEntries(twoEntries, { maxEntryUncompressedBytes: 16 }),
    /entry exceeds configured uncompressed byte limit/
  );
  assert.throws(
    () => readZipEntries(twoEntries, { maxTotalUncompressedBytes: 48 }),
    /total uncompressed bytes exceed/
  );

  const highExpansion = createDeterministicZipFromEntries([
    { name: "repeated.txt", data: Buffer.alloc(8 * 1024, 0x61) },
  ]);
  assert.throws(
    () => readZipEntries(highExpansion, { maxExpansionRatio: 2 }),
    /entry exceeds configured expansion ratio/
  );
});

test("zip reader bounds forged output before trusting declared size", () => {
  const forged = Buffer.from(
    createDeterministicZipFromEntries([
      { name: "forged.txt", data: Buffer.alloc(8 * 1024, 0x61) },
    ])
  );
  forged.writeUInt32LE(1, 22);

  assert.throws(
    () =>
      readZipEntries(forged, {
        maxEntryUncompressedBytes: 128,
        maxTotalUncompressedBytes: 128,
      }),
    /entry output exceeds configured limit/
  );
});

test("zip reader rejects malformed and ambiguous local entries", () => {
  const base = createDeterministicZipFromEntries([
    { name: "a.txt", data: Buffer.from("alpha") },
    { name: "b.txt", data: Buffer.from("beta") },
  ]);

  assert.throws(() => readZipEntries(base.subarray(0, base.length - 1)), /central directory missing or truncated/);

  const truncatedEntry = Buffer.from(base);
  truncatedEntry.writeUInt32LE(base.length, 18);
  assert.throws(() => readZipEntries(truncatedEntry), /entry data is truncated/);

  const duplicate = Buffer.from(base);
  const secondOffset = secondLocalHeaderOffset(duplicate);
  duplicate.write("a.txt", secondOffset + 30, "utf8");
  assert.throws(() => readZipEntries(duplicate), /duplicate zip entry/);

  const unsupported = Buffer.from(base);
  unsupported.writeUInt16LE(99, 8);
  assert.throws(() => readZipEntries(unsupported), /unsupported zip compression method/);

  const sizeMismatch = Buffer.from(base);
  sizeMismatch.writeUInt32LE(sizeMismatch.readUInt32LE(22) + 1, 22);
  assert.throws(() => readZipEntries(sizeMismatch), /uncompressed size mismatch/);
});
