import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import os from "os";
import path from "path";
import { spawnSync } from "child_process";

const authorityPath = process.env.MDKG_TEST_PACKAGE
  ? path.join(process.env.MDKG_TEST_PACKAGE, "dist/core/filesystem_authority.js")
  : path.resolve(__dirname, "../../core/filesystem_authority.js");
const authority = require(authorityPath) as {
  readContainedFileIfPresent(input: { root: string; relativePath: string; maxBytes?: number }): string | null;
};

function fixture() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-nullable-read-"));
  const root = path.join(base, "repo"), outside = path.join(base, "outside");
  fs.mkdirSync(root); fs.mkdirSync(outside);
  return { base, root, outside };
}

test("nullable contained reads distinguish initial absence from invalid authority", () => {
  const { base, root } = fixture();
  try {
    assert.equal(authority.readContainedFileIfPresent({ root, relativePath: "missing" }), null);
    assert.equal(authority.readContainedFileIfPresent({ root, relativePath: "absent/child" }), null);
    fs.mkdirSync(path.join(root, "directory"));
    fs.writeFileSync(path.join(root, "plain"), "content");
    for (const relativePath of ["directory", "plain/child", "../outside/file", "", "/absolute"]) {
      assert.throws(() => authority.readContainedFileIfPresent({ root, relativePath }), /contained/);
    }
    assert.throws(() => authority.readContainedFileIfPresent({ root: path.join(base, "absent"), relativePath: "file" }), /root/);
  } finally { fs.rmSync(base, { recursive: true }); }
});

test("nullable reads use one fresh containment inspection and never cache contents", () => {
  const { base, root } = fixture(), file = path.join(root, "text");
  const original = fs.realpathSync.native; let rootChecks = 0;
  try {
    fs.writeFileSync(file, "first");
    const stat = fs.statSync(file);
    fs.realpathSync.native = ((...args: any[]) => {
      if (String(args[0]) === root) rootChecks++;
      return original(args[0], args[1]);
    }) as typeof original;
    assert.equal(authority.readContainedFileIfPresent({ root, relativePath: "text" }), "first");
    assert.equal(rootChecks, 1, "no preceding existence-check traversal");
    fs.writeFileSync(file, "other"); fs.utimesSync(file, stat.atime, stat.mtime);
    assert.equal(authority.readContainedFileIfPresent({ root, relativePath: "text" }), "other");
    assert.equal(rootChecks, 2, "each call revalidates authority and bytes");
  } finally { fs.realpathSync.native = original; fs.rmSync(base, { recursive: true }); }
});

test("nullable reads preserve exact byte bounds and reject invalid budgets even for absence", () => {
  const { base, root } = fixture();
  try {
    fs.writeFileSync(path.join(root, "text"), "café"); fs.writeFileSync(path.join(root, "empty"), "");
    assert.equal(authority.readContainedFileIfPresent({ root, relativePath: "text", maxBytes: 5 }), "café");
    assert.equal(authority.readContainedFileIfPresent({ root, relativePath: "empty", maxBytes: 0 }), "");
    assert.throws(() => authority.readContainedFileIfPresent({ root, relativePath: "text", maxBytes: 4 }), /byte limit/);
    for (const maxBytes of [-1, NaN, Infinity, 1.5]) {
      assert.throws(() => authority.readContainedFileIfPresent({ root, relativePath: "missing", maxBytes }), /nonnegative safe integer/);
    }
  } finally { fs.rmSync(base, { recursive: true }); }
});

test("nullable reads reject post-stat growth using actual bytes", () => {
  const { base, root } = fixture(), original = fs.fstatSync;
  try {
    fs.writeFileSync(path.join(root, "text"), "more than four bytes");
    fs.fstatSync = ((...args: any[]) => ({ ...original(args[0]), size: 0, isFile: () => true })) as typeof original;
    assert.throws(() => authority.readContainedFileIfPresent({ root, relativePath: "text", maxBytes: 4 }), /byte limit/);
  } finally { fs.fstatSync = original; fs.rmSync(base, { recursive: true }); }
});

test("nullable reads propagate disappearance after initial presence and other open errors", () => {
  const { base, root } = fixture(), file = path.join(root, "text"), original = fs.openSync;
  try {
    fs.writeFileSync(file, "present");
    for (const code of ["ENOENT", "EACCES", "EIO"]) {
      fs.openSync = original;
      fs.writeFileSync(file, "present");
      fs.openSync = ((...args: any[]) => {
        if (String(args[0]) === file) {
          if (code === "ENOENT") fs.unlinkSync(file);
          else throw Object.assign(new Error("synthetic open failure"), { code });
        }
        return original(args[0], args[1], args[2]);
      }) as typeof original;
      assert.throws(() => authority.readContainedFileIfPresent({ root, relativePath: "text" }), (e: any) => e.code === code);
    }
  } finally { fs.openSync = original; fs.rmSync(base, { recursive: true }); }
});

test("nullable reads retain no-follow nonblocking opens and descriptor validation", () => {
  const { base, root } = fixture(), file = path.join(root, "text");
  const open = fs.openSync, stat = fs.fstatSync, close = fs.closeSync;
  let handle: number | undefined, closed = false;
  try {
    fs.writeFileSync(file, "present");
    fs.openSync = ((...args: any[]) => {
      const fd = open(args[0], args[1], args[2]);
      if (String(args[0]) === file) {
        handle = fd;
        for (const flag of [fs.constants.O_NOFOLLOW, fs.constants.O_NONBLOCK]) {
          if (typeof flag === "number") assert.equal(args[1] & flag, flag);
        }
      }
      return fd;
    }) as typeof open;
    fs.fstatSync = ((...args: any[]) => args[0] === handle ? { ...stat(args[0]), isFile: () => false } : stat(args[0])) as typeof stat;
    fs.closeSync = ((fd: number) => { if (fd === handle) closed = true; return close(fd); }) as typeof close;
    assert.throws(() => authority.readContainedFileIfPresent({ root, relativePath: "text" }), /must be a file/);
    assert.equal(closed, true);
  } finally { fs.openSync = open; fs.fstatSync = stat; fs.closeSync = close; fs.rmSync(base, { recursive: true }); }
});

test("nullable reads reject linked roots ancestors and leaves without consuming sentinels", (t) => {
  const { base, root, outside } = fixture();
  try {
    fs.writeFileSync(path.join(outside, "sentinel"), "private fixture");
    try {
      fs.symlinkSync(outside, path.join(base, "linked-root"), "dir");
      fs.symlinkSync(outside, path.join(root, "linked-parent"), "dir");
      fs.symlinkSync(path.join(outside, "sentinel"), path.join(root, "linked-leaf"), "file");
      fs.symlinkSync(path.join(outside, "missing"), path.join(root, "dangling"), "file");
    } catch (e) { if ((e as NodeJS.ErrnoException).code === "EPERM") { t.skip("symlinks unavailable"); return; } throw e; }
    assert.throws(() => authority.readContainedFileIfPresent({ root: path.join(base, "linked-root"), relativePath: "sentinel" }), /root/);
    for (const relativePath of ["linked-parent/sentinel", "linked-leaf", "dangling"]) {
      assert.throws(() => authority.readContainedFileIfPresent({ root, relativePath }), /linked|symbolic/);
    }
    assert.equal(fs.readFileSync(path.join(outside, "sentinel"), "utf8"), "private fixture");
  } finally { fs.rmSync(base, { recursive: true }); }
});

test("nullable reads reject FIFO targets without hanging", (t) => {
  if (process.platform === "win32") { t.skip("POSIX fixture"); return; }
  const { base, root } = fixture();
  try {
    const created = spawnSync("mkfifo", [path.join(root, "fifo")], { encoding: "utf8" });
    assert.equal(created.status, 0, created.stderr);
    const script = 'const a=require(process.argv[1]);try{a.readContainedFileIfPresent({root:process.argv[2],relativePath:"fifo"});process.exit(2)}catch(e){if(e.code==="ERR_CONTAINED_PATH_TYPE")process.exit(0);throw e}';
    const result = spawnSync(process.execPath, ["-e", script, authorityPath, root], { encoding: "utf8", timeout: 2000 });
    assert.equal(result.status, 0, result.error?.message || result.stderr);
  } finally { fs.rmSync(base, { recursive: true }); }
});
