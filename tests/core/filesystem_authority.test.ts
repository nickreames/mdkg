import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import os from "os";
import path from "path";

const authority = require("../../core/filesystem_authority") as {
  ContainedPathError: new (...args: never[]) => Error & { code: string };
  containedPathExists(input: { root: string; relativePath: string }): boolean;
  ensureContainedDirectory(input: { root: string; relativePath: string }): { relativePath: string };
  readContainedDirectory(input: { root: string; relativePath: string }): fs.Dirent[];
  readContainedFile(input: { root: string; relativePath: string }, encoding?: BufferEncoding | null): string | Buffer;
  withContainedTreeSink<T>(input: { root: string; operation: "replace"; relativePath: string }, sink: (descriptor: { absolutePath: string }) => T): T;
  writeContainedFileExclusive(input: { root: string; relativePath: string }, data: string | Buffer): { relativePath: string };
  atomicReplaceContainedFile(input: { root: string; relativePath: string }, data: string | Buffer): { relativePath: string };
  removeContainedPath(input: { root: string; relativePath: string; recursive?: boolean; force?: boolean }): { relativePath: string };
  authorizeOperatorSelectedExternalPath(input: { operation: "replace"; path: string; operatorSelected: true }): { operation: string; absolutePath: string; operatorSelected: true };
};

function fixture(): { base: string; root: string; outside: string } {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-authority-"));
  const root = path.join(base, "repo");
  const outside = path.join(base, "outside");
  fs.mkdirSync(root);
  fs.mkdirSync(outside);
  return { base, root, outside };
}

test("authority rejects unsafe lexical identities with stable codes", () => {
  const { base, root } = fixture();
  try {
    const cases = [
      ["", "ERR_CONTAINED_PATH_EMPTY"],
      ["/tmp/file", "ERR_CONTAINED_PATH_ABSOLUTE"],
      ["C:\\temp\\file", "ERR_CONTAINED_PATH_ABSOLUTE"],
      ["C:temp\\file", "ERR_CONTAINED_PATH_ABSOLUTE"],
      ["../file", "ERR_CONTAINED_PATH_COMPONENT"],
      ["dir\\..\\file", "ERR_CONTAINED_PATH_COMPONENT"],
      ["dir//file", "ERR_CONTAINED_PATH_COMPONENT"],
      ["./file", "ERR_CONTAINED_PATH_COMPONENT"],
      ["dir/", "ERR_CONTAINED_PATH_COMPONENT"],
      ["bad\0file", "ERR_CONTAINED_PATH_NUL"],
    ];
    for (const [relativePath, code] of cases) {
      assert.throws(
        () => authority.readContainedFile({ root, relativePath }),
        (error: unknown) => error instanceof authority.ContainedPathError && error.code === code
      );
    }
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
});

test("valid contained directory and file operations support missing targets", () => {
  const { base, root } = fixture();
  try {
    authority.ensureContainedDirectory({ root, relativePath: "nested/child" });
    assert.deepEqual(authority.readContainedDirectory({ root, relativePath: "nested" }).map((entry) => entry.name), ["child"]);
    assert.equal(authority.containedPathExists({ root, relativePath: "nested/data.txt" }), false);
    authority.writeContainedFileExclusive({ root, relativePath: "nested/data.txt" }, "one\n");
    assert.equal(authority.readContainedFile({ root, relativePath: "nested/data.txt" }), "one\n");
    authority.atomicReplaceContainedFile({ root, relativePath: "nested/data.txt" }, "two\n");
    authority.atomicReplaceContainedFile({ root, relativePath: "nested/new.txt" }, "new\n");
    assert.equal(authority.readContainedFile({ root, relativePath: "nested/data.txt" }), "two\n");
    authority.removeContainedPath({ root, relativePath: "nested", recursive: true });
    authority.removeContainedPath({ root, relativePath: "missing", recursive: true, force: true });
    assert.equal(fs.existsSync(path.join(root, "nested")), false);
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
});

test("all contained sinks reject linked ancestors and final targets", (t) => {
  const { base, root, outside } = fixture();
  try {
    fs.writeFileSync(path.join(outside, "sentinel.txt"), "outside\n");
    try {
      fs.symlinkSync(outside, path.join(root, "linked-dir"), "dir");
      fs.symlinkSync(path.join(outside, "sentinel.txt"), path.join(root, "linked-file"), "file");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "EPERM") {
        t.skip("symbolic links unavailable");
        return;
      }
      throw error;
    }
    const operations = [
      () => authority.readContainedFile({ root, relativePath: "linked-dir/sentinel.txt" }),
      () => authority.writeContainedFileExclusive({ root, relativePath: "linked-dir/new.txt" }, "new"),
      () => authority.atomicReplaceContainedFile({ root, relativePath: "linked-dir/sentinel.txt" }, "changed"),
      () => authority.removeContainedPath({ root, relativePath: "linked-dir", recursive: true }),
      () => authority.readContainedFile({ root, relativePath: "linked-file" }),
      () => authority.atomicReplaceContainedFile({ root, relativePath: "linked-file" }, "changed"),
      () => authority.removeContainedPath({ root, relativePath: "linked-file" }),
    ];
    for (const operation of operations) {
      assert.throws(operation, (error: unknown) =>
        error instanceof authority.ContainedPathError && error.code === "ERR_CONTAINED_PATH_LINK"
      );
    }
    assert.equal(fs.readFileSync(path.join(outside, "sentinel.txt"), "utf8"), "outside\n");
    assert.equal(fs.existsSync(path.join(outside, "new.txt")), false);
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
});

test("managed tree sink rejects links at arbitrary descendant depth", (t) => {
  const { base, root, outside } = fixture();
  try {
    fs.mkdirSync(path.join(root, "managed", "nested"), { recursive: true });
    fs.writeFileSync(path.join(outside, "sentinel.txt"), "outside\n");
    try {
      fs.symlinkSync(outside, path.join(root, "managed", "nested", "redirect"), "dir");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "EPERM") {
        t.skip("symbolic links unavailable");
        return;
      }
      throw error;
    }
    assert.throws(
      () => authority.withContainedTreeSink(
        { root, relativePath: "managed", operation: "replace" },
        () => assert.fail("tree sink must not run")
      ),
      (error: unknown) => error instanceof authority.ContainedPathError && error.code === "ERR_CONTAINED_PATH_LINK"
    );
    assert.equal(fs.readFileSync(path.join(outside, "sentinel.txt"), "utf8"), "outside\n");
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
});

test("final-component replacement race cannot overwrite the linked target", (t) => {
  const { base, root, outside } = fixture();
  const target = path.join(root, "target.txt");
  const sentinel = path.join(outside, "sentinel.txt");
  fs.writeFileSync(target, "old\n");
  fs.writeFileSync(sentinel, "outside\n");
  const originalRename = fs.renameSync;
  try {
    try {
      fs.symlinkSync(sentinel, path.join(root, "link-probe"), "file");
      fs.unlinkSync(path.join(root, "link-probe"));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "EPERM") {
        t.skip("symbolic links unavailable");
        return;
      }
      throw error;
    }
    (fs as unknown as { renameSync: typeof fs.renameSync }).renameSync = (source, destination) => {
      fs.unlinkSync(target);
      fs.symlinkSync(sentinel, target, "file");
      originalRename(source, destination);
    };
    authority.atomicReplaceContainedFile({ root, relativePath: "target.txt" }, "replacement\n");
    assert.equal(fs.readFileSync(target, "utf8"), "replacement\n");
    assert.equal(fs.readFileSync(sentinel, "utf8"), "outside\n");
  } finally {
    (fs as unknown as { renameSync: typeof fs.renameSync }).renameSync = originalRename;
    fs.rmSync(base, { recursive: true, force: true });
  }
});

test("final-component delete race removes only the substituted link", (t) => {
  const { base, root, outside } = fixture();
  const target = path.join(root, "victim");
  const sinkTarget = path.resolve(target);
  const movedTarget = path.join(root, "victim-before-race");
  const sentinel = path.join(outside, "sentinel.txt");
  fs.mkdirSync(target);
  fs.writeFileSync(path.join(target, "local.txt"), "local\n");
  fs.writeFileSync(sentinel, "outside\n");
  const originalRm = fs.rmSync;
  let swapped = false;
  try {
    try {
      fs.symlinkSync(outside, path.join(root, "link-probe"), "dir");
      fs.unlinkSync(path.join(root, "link-probe"));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "EPERM") {
        t.skip("symbolic links unavailable");
        return;
      }
      throw error;
    }
    (fs as unknown as { rmSync: typeof fs.rmSync }).rmSync = (targetPath, options) => {
      if (!swapped && path.resolve(String(targetPath)) === sinkTarget) {
        swapped = true;
        fs.renameSync(target, movedTarget);
        fs.symlinkSync(outside, target, "dir");
      }
      originalRm(targetPath, options);
    };
    authority.removeContainedPath({ root, relativePath: "victim", recursive: true });
    assert.equal(fs.existsSync(target), false);
    assert.equal(fs.readFileSync(sentinel, "utf8"), "outside\n");
    assert.equal(fs.readFileSync(path.join(movedTarget, "local.txt"), "utf8"), "local\n");
  } finally {
    (fs as unknown as { rmSync: typeof fs.rmSync }).rmSync = originalRm;
    fs.rmSync(base, { recursive: true, force: true });
  }
});

test("linked roots and non-directory ancestors fail closed", (t) => {
  const { base, root, outside } = fixture();
  try {
    fs.writeFileSync(path.join(root, "plain"), "data");
    assert.throws(
      () => authority.readContainedFile({ root, relativePath: "plain/child" }),
      (error: unknown) => error instanceof authority.ContainedPathError && error.code === "ERR_CONTAINED_PATH_NOT_DIRECTORY"
    );
    const linkedRoot = path.join(base, "linked-root");
    try {
      fs.symlinkSync(outside, linkedRoot, "dir");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "EPERM") {
        t.skip("symbolic links unavailable");
        return;
      }
      throw error;
    }
    assert.throws(
      () => authority.readContainedFile({ root: linkedRoot, relativePath: "file" }),
      (error: unknown) => error instanceof authority.ContainedPathError && error.code === "ERR_CONTAINED_PATH_ROOT"
    );
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
});

test("external paths require explicit operator-selected authorization", () => {
  const external = authority.authorizeOperatorSelectedExternalPath({
    operation: "replace",
    path: "relative-output.json",
    operatorSelected: true,
  });
  assert.equal(external.operatorSelected, true);
  assert.equal(external.absolutePath, path.resolve("relative-output.json"));
  assert.throws(
    () => authority.authorizeOperatorSelectedExternalPath({ operation: "replace", path: "bad\0path", operatorSelected: true }),
    /non-empty and cannot contain NUL/
  );
});
