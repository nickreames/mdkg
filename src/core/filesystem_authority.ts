import crypto from "crypto";
import fs from "fs";
import path from "path";

export type ContainedPathOperation = "read" | "create" | "replace" | "delete";

export type ContainedPathErrorCode =
  | "ERR_CONTAINED_PATH_ROOT"
  | "ERR_CONTAINED_PATH_EMPTY"
  | "ERR_CONTAINED_PATH_NUL"
  | "ERR_CONTAINED_PATH_ABSOLUTE"
  | "ERR_CONTAINED_PATH_COMPONENT"
  | "ERR_CONTAINED_PATH_ESCAPE"
  | "ERR_CONTAINED_PATH_LINK"
  | "ERR_CONTAINED_PATH_NOT_DIRECTORY"
  | "ERR_CONTAINED_PATH_TYPE";

export class ContainedPathError extends Error {
  readonly code: ContainedPathErrorCode;
  readonly operation: ContainedPathOperation;
  readonly relativePath: string;

  constructor(
    code: ContainedPathErrorCode,
    operation: ContainedPathOperation,
    relativePath: string,
    message: string
  ) {
    super(message);
    this.name = "ContainedPathError";
    this.code = code;
    this.operation = operation;
    this.relativePath = relativePath;
  }
}

type WritableData = string | Buffer;

export type ContainedPathDescriptor = Readonly<{
  root: string;
  operation: ContainedPathOperation;
  relativePath: string;
  absolutePath: string;
}>;

export type OperatorSelectedExternalPath = Readonly<{
  operation: ContainedPathOperation;
  absolutePath: string;
  operatorSelected: true;
}>;

function fail(
  code: ContainedPathErrorCode,
  operation: ContainedPathOperation,
  relativePath: string,
  message: string
): never {
  throw new ContainedPathError(code, operation, relativePath, message);
}

function isAbsoluteOnSupportedPlatform(value: string): boolean {
  return (
    path.isAbsolute(value) ||
    path.posix.isAbsolute(value) ||
    path.win32.isAbsolute(value) ||
    path.win32.parse(value).root.length > 0
  );
}

function normalizeRelativePath(value: string, operation: ContainedPathOperation): string {
  if (!value) {
    fail("ERR_CONTAINED_PATH_EMPTY", operation, value, "contained path cannot be empty");
  }
  if (value.includes("\0")) {
    fail("ERR_CONTAINED_PATH_NUL", operation, value, "contained path cannot contain NUL bytes");
  }
  if (isAbsoluteOnSupportedPlatform(value)) {
    fail("ERR_CONTAINED_PATH_ABSOLUTE", operation, value, "contained path must be relative");
  }
  const components = value.split(/[\\/]/);
  if (components.some((component) => component === "" || component === "." || component === "..")) {
    fail(
      "ERR_CONTAINED_PATH_COMPONENT",
      operation,
      value,
      "contained path cannot contain empty, current-directory, or parent-directory components"
    );
  }
  return components.join(path.sep);
}

function isInside(root: string, target: string): boolean {
  const relative = path.relative(root, target);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function lstatIfPresent(target: string): fs.Stats | undefined {
  try {
    return fs.lstatSync(target);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return undefined;
    }
    throw error;
  }
}

function validatedRoot(
  root: string,
  operation: ContainedPathOperation,
  relativePath: string
): { absoluteRoot: string; canonicalRoot: string } {
  const absoluteRoot = path.resolve(root);
  const stat = lstatIfPresent(absoluteRoot);
  if (!stat || !stat.isDirectory() || stat.isSymbolicLink()) {
    fail(
      "ERR_CONTAINED_PATH_ROOT",
      operation,
      relativePath,
      "contained path root must be an existing non-linked directory"
    );
  }
  return {
    absoluteRoot,
    canonicalRoot: fs.realpathSync.native(absoluteRoot),
  };
}

function inspectPath(
  root: string,
  relativePath: string,
  operation: ContainedPathOperation,
  createParents: boolean
): ContainedPathDescriptor {
  // Node has no portable openat-style API. Keep validation and the sink in one
  // authority, reject every visible link, and use O_NOFOLLOW for file opens.
  const normalized = normalizeRelativePath(relativePath, operation);
  const { absoluteRoot, canonicalRoot } = validatedRoot(root, operation, relativePath);
  const components = normalized.split(path.sep);
  let current = absoluteRoot;
  let nearestExisting = absoluteRoot;

  for (let index = 0; index < components.length; index += 1) {
    current = path.join(current, components[index]);
    const final = index === components.length - 1;
    let stat = lstatIfPresent(current);
    if (!stat && !final && createParents) {
      try {
        fs.mkdirSync(current);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
          throw error;
        }
      }
      stat = fs.lstatSync(current);
    }
    if (!stat) {
      continue;
    }
    if (stat.isSymbolicLink()) {
      fail(
        "ERR_CONTAINED_PATH_LINK",
        operation,
        relativePath,
        final ? "contained path target cannot be a symbolic link" : "contained path has a linked ancestor"
      );
    }
    if (!final && !stat.isDirectory()) {
      fail(
        "ERR_CONTAINED_PATH_NOT_DIRECTORY",
        operation,
        relativePath,
        "contained path ancestor is not a directory"
      );
    }
    nearestExisting = current;
  }

  const absolutePath = path.resolve(absoluteRoot, normalized);
  if (!isInside(absoluteRoot, absolutePath)) {
    fail("ERR_CONTAINED_PATH_ESCAPE", operation, relativePath, "contained path resolves outside its root");
  }
  const canonicalExisting = fs.realpathSync.native(nearestExisting);
  if (!isInside(canonicalRoot, canonicalExisting)) {
    fail("ERR_CONTAINED_PATH_ESCAPE", operation, relativePath, "contained path resolves outside its canonical root");
  }
  return Object.freeze({
    root: absoluteRoot,
    operation,
    relativePath: components.join("/"),
    absolutePath,
  });
}

function noFollowFlag(): number {
  return typeof fs.constants.O_NOFOLLOW === "number" ? fs.constants.O_NOFOLLOW : 0;
}

function writeAndSync(filePath: string, data: WritableData, flags: number): void {
  const handle = fs.openSync(filePath, flags, 0o666);
  try {
    fs.writeFileSync(handle, data, typeof data === "string" ? "utf8" : undefined);
    fs.fsyncSync(handle);
  } finally {
    fs.closeSync(handle);
  }
}

function randomSuffix(): string {
  return `${process.pid}-${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
}

export function withContainedPathSink<T>(
  input: {
    root: string;
    operation: ContainedPathOperation;
    relativePath: string;
    createParents?: boolean;
  },
  sink: (pathDescriptor: ContainedPathDescriptor) => T
): T {
  const descriptor = inspectPath(
    input.root,
    input.relativePath,
    input.operation,
    input.createParents ?? false
  );
  return sink(descriptor);
}

function rejectLinkedTree(
  descriptor: ContainedPathDescriptor,
  currentPath: string
): void {
  const entries = fs.readdirSync(currentPath, { withFileTypes: true });
  for (const entry of entries) {
    const child = path.join(currentPath, entry.name);
    if (entry.isSymbolicLink()) {
      fail(
        "ERR_CONTAINED_PATH_LINK",
        descriptor.operation,
        descriptor.relativePath,
        "contained managed tree cannot contain symbolic links"
      );
    }
    if (entry.isDirectory()) {
      rejectLinkedTree(descriptor, child);
    }
  }
}

export function withContainedTreeSink<T>(
  input: {
    root: string;
    operation: ContainedPathOperation;
    relativePath: string;
    createParents?: boolean;
  },
  sink: (pathDescriptor: ContainedPathDescriptor) => T
): T {
  return withContainedPathSink(input, (descriptor) => {
    const stat = lstatIfPresent(descriptor.absolutePath);
    if (stat) {
      if (!stat.isDirectory()) {
        fail(
          "ERR_CONTAINED_PATH_TYPE",
          descriptor.operation,
          descriptor.relativePath,
          "contained managed tree target must be a directory"
        );
      }
      rejectLinkedTree(descriptor, descriptor.absolutePath);
    }
    return sink(descriptor);
  });
}

export function containedPathExists(input: { root: string; relativePath: string }): boolean {
  return withContainedPathSink({ ...input, operation: "read" }, ({ absolutePath }) =>
    lstatIfPresent(absolutePath) !== undefined
  );
}

export function ensureContainedDirectory(input: {
  root: string;
  relativePath: string;
}): ContainedPathDescriptor {
  let descriptor = inspectPath(input.root, input.relativePath, "create", true);
  try {
    fs.mkdirSync(descriptor.absolutePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
      throw error;
    }
  }
  descriptor = inspectPath(input.root, input.relativePath, "create", false);
  if (!fs.lstatSync(descriptor.absolutePath).isDirectory()) {
    fail("ERR_CONTAINED_PATH_TYPE", "create", input.relativePath, "contained directory target is not a directory");
  }
  return descriptor;
}

export function readContainedDirectory(input: {
  root: string;
  relativePath: string;
}): fs.Dirent[] {
  return withContainedPathSink({ ...input, operation: "read" }, ({ absolutePath }) => {
    if (!fs.lstatSync(absolutePath).isDirectory()) {
      fail("ERR_CONTAINED_PATH_TYPE", "read", input.relativePath, "contained read target must be a directory");
    }
    return fs.readdirSync(absolutePath, { withFileTypes: true });
  });
}

export function readContainedFile(input: { root: string; relativePath: string; maxBytes?: number }): string;
export function readContainedFile(input: { root: string; relativePath: string; maxBytes?: number }, encoding: null): Buffer;
export function readContainedFile(
  input: { root: string; relativePath: string; maxBytes?: number },
  encoding: BufferEncoding
): string;
export function readContainedFile(
  input: { root: string; relativePath: string; maxBytes?: number },
  encoding: BufferEncoding | null = "utf8"
): string | Buffer {
  return withContainedPathSink({ ...input, operation: "read" }, ({ absolutePath }) => {
    const handle = fs.openSync(absolutePath, fs.constants.O_RDONLY | noFollowFlag());
    try {
      const stat = fs.fstatSync(handle);
      if (!stat.isFile()) {
        fail("ERR_CONTAINED_PATH_TYPE", "read", input.relativePath, "contained read target must be a file");
      }
      if (input.maxBytes !== undefined && stat.size > input.maxBytes) {
        fail("ERR_CONTAINED_PATH_TYPE", "read", input.relativePath, `contained read exceeds byte limit: ${input.maxBytes}`);
      }
      return encoding === null ? fs.readFileSync(handle) : fs.readFileSync(handle, encoding);
    } finally {
      fs.closeSync(handle);
    }
  });
}

export function writeContainedFileExclusive(
  input: { root: string; relativePath: string },
  data: WritableData
): ContainedPathDescriptor {
  const descriptor = inspectPath(input.root, input.relativePath, "create", true);
  writeAndSync(
    descriptor.absolutePath,
    data,
    fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | noFollowFlag()
  );
  return descriptor;
}

export function appendContainedFile(
  input: { root: string; relativePath: string },
  data: WritableData
): ContainedPathDescriptor {
  const descriptor = inspectPath(input.root, input.relativePath, "replace", false);
  const handle = fs.openSync(
    descriptor.absolutePath,
    fs.constants.O_WRONLY | fs.constants.O_APPEND | noFollowFlag()
  );
  try {
    if (!fs.fstatSync(handle).isFile()) {
      fail("ERR_CONTAINED_PATH_TYPE", "replace", input.relativePath, "contained append target must be a file");
    }
    fs.writeFileSync(handle, data, typeof data === "string" ? "utf8" : undefined);
    fs.fsyncSync(handle);
  } finally {
    fs.closeSync(handle);
  }
  return descriptor;
}

export function atomicReplaceContainedFile(
  input: { root: string; relativePath: string },
  data: WritableData
): ContainedPathDescriptor {
  let descriptor = inspectPath(input.root, input.relativePath, "replace", true);
  const tempRelative = `${descriptor.relativePath}.${randomSuffix()}.tmp`;
  const temp = inspectPath(input.root, tempRelative, "create", false);
  try {
    writeAndSync(
      temp.absolutePath,
      data,
      fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | noFollowFlag()
    );
    descriptor = inspectPath(input.root, input.relativePath, "replace", false);
    inspectPath(input.root, tempRelative, "create", false);
    fs.renameSync(temp.absolutePath, descriptor.absolutePath);
    return descriptor;
  } catch (error) {
    try {
      const stat = lstatIfPresent(temp.absolutePath);
      if (stat && !stat.isSymbolicLink()) {
        fs.rmSync(temp.absolutePath, { force: true });
      }
    } catch {
      // Preserve the primary failure; any temp residue remains in the allowed root.
    }
    throw error;
  }
}

export function removeContainedPath(input: {
  root: string;
  relativePath: string;
  recursive?: boolean;
  force?: boolean;
}): ContainedPathDescriptor {
  const descriptor = inspectPath(input.root, input.relativePath, "delete", false);
  fs.rmSync(descriptor.absolutePath, {
    recursive: input.recursive ?? false,
    force: input.force ?? false,
  });
  return descriptor;
}

export function authorizeOperatorSelectedExternalPath(input: {
  operation: ContainedPathOperation;
  path: string;
  operatorSelected: true;
}): OperatorSelectedExternalPath {
  if (!input.path || input.path.includes("\0")) {
    throw new Error("operator-selected external path must be non-empty and cannot contain NUL bytes");
  }
  return Object.freeze({
    operation: input.operation,
    absolutePath: path.resolve(input.path),
    operatorSelected: true,
  });
}
