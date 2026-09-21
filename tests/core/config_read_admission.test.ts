import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { makeTempDir } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
const { loadConfig, MAX_CONFIG_BYTES } = require("../../core/config");

function fixture(t: { after(fn: () => void): void }) {
  const root = makeTempDir("mdkg-config-read-");
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  writeRootConfig(root);
  return { root, file: path.join(root, ".mdkg/config.json") };
}

test("bootstrap config ceiling counts bytes and cannot be increased by its own config", t => {
  const { root, file } = fixture(t), config = JSON.parse(fs.readFileSync(file, "utf8"));
  assert.equal(MAX_CONFIG_BYTES, 8 * 1024 * 1024);
  config.index.limits = { max_files: 100000, max_file_bytes: MAX_CONFIG_BYTES * 8,
    max_total_bytes: MAX_CONFIG_BYTES * 16, max_depth: 64 };
  config.padding = "é".repeat(MAX_CONFIG_BYTES / 2);
  const content = JSON.stringify(config);
  assert(content.length < MAX_CONFIG_BYTES); assert(Buffer.byteLength(content) > MAX_CONFIG_BYTES);
  fs.writeFileSync(file, content);
  assert.throws(() => loadConfig(root), /failed to read config:.*byte limit/);
});

test("config actual-byte enforcement survives a stale fstat and closes its descriptor", t => {
  const { root, file } = fixture(t), bytes = fs.readFileSync(file);
  fs.writeFileSync(file, Buffer.concat([bytes, Buffer.alloc(MAX_CONFIG_BYTES + 1 - bytes.length, 32)]));
  const open = fs.openSync, stat = fs.fstatSync, read = fs.readSync, close = fs.closeSync;
  let descriptor: number | undefined, consumed = 0, closed = false;
  t.mock.method(fs, "openSync", (...args: any[]) => {
    const fd = (open as any)(...args);
    if (String(args[0]) === file) descriptor = fd;
    return fd;
  });
  t.mock.method(fs, "fstatSync", (...args: any[]) => {
    const value = (stat as any)(...args);
    return args[0] === descriptor ? Object.assign(value, { size: 0 }) : value;
  });
  t.mock.method(fs, "readSync", (...args: any[]) => {
    if (args[0] === descriptor) assert(args[3] <= 65536);
    const count = (read as any)(...args); if (args[0] === descriptor) consumed += count; return count;
  });
  t.mock.method(fs, "closeSync", (fd: number) => { if (fd === descriptor) closed = true; return close(fd); });
  assert.throws(() => loadConfig(root), /byte limit/);
  assert.equal(consumed, MAX_CONFIG_BYTES + 1); assert.equal(closed, true);
});

test("config retains missing, disappearance, JSON and legacy migration distinctions", t => {
  const { root, file } = fixture(t), bytes = fs.readFileSync(file), open = fs.openSync;
  fs.unlinkSync(file); assert.throws(() => loadConfig(root), /config not found/);
  fs.writeFileSync(file, "{"); assert.throws(() => loadConfig(root), /failed to read config/);
  const legacy = JSON.parse(bytes.toString()); delete legacy.schema_version;
  fs.writeFileSync(file, JSON.stringify(legacy)); assert.equal(loadConfig(root).schema_version, 1);
  t.mock.method(fs, "openSync", (...args: any[]) => {
    if (String(args[0]) === file) fs.unlinkSync(file);
    return (open as any)(...args);
  });
  assert.throws(() => loadConfig(root), /failed to read config:.*ENOENT/);
});
