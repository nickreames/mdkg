import fs from "fs";
import path from "path";
import { observeGit } from "./git_observation";
import { UsageError } from "./errors";
import { forEachContainedDirectoryEntry, readContainedFile } from "../core/filesystem_authority";

const REDIRECTS = ["GIT_DIR", "GIT_COMMON_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE", "GIT_OBJECT_DIRECTORY",
  "GIT_ALTERNATE_OBJECT_DIRECTORIES", "GIT_CEILING_DIRECTORIES", "GIT_DISCOVERY_ACROSS_FILESYSTEM"];

function exists(file: string): boolean {
  try { fs.lstatSync(file); return true; } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw error;
  }
}

// Resolve existing ancestors as well as missing leaves. Keep traversal identity
// exact; distinct stores on case-sensitive filesystems must both be inspected.
function physical(file: string): string {
  let parent = path.resolve(file);
  const tail: string[] = [];
  while (!exists(parent)) { tail.unshift(path.basename(parent)); parent = path.dirname(parent); }
  return path.join(fs.realpathSync(parent), ...tail);
}
function overlaps(a: string, b: string): boolean {
  a = a.normalize("NFC").toLowerCase(); b = b.normalize("NFC").toLowerCase();
  return a === b || a.startsWith(b + path.sep) || b.startsWith(a + path.sep);
}

function naturalGitContext(root: string): boolean {
  for (let dir = path.resolve(root); ; dir = path.dirname(dir)) {
    if (exists(path.join(dir, ".git")) ||
        ["HEAD", "objects", "config"].every(name => exists(path.join(dir, name)))) return true;
    if (path.dirname(dir) === dir) return false;
  }
}

// Git accepts C-quoted alternate names. Decode supported byte escapes rather
// than splitting a quoted path at its colon delimiter. Reject ambiguous input.
function alternateNames(raw: string, delimiter: string): string[] {
  if (Buffer.byteLength(raw) > 65536) throw new UsageError("Git alternate object directory inventory exceeds limit");
  const result: string[] = [];
  let start = 0, quoted = false, escaped = false;
  for (let i = 0; i <= raw.length; i++) {
    const c = raw[i];
    if (i === raw.length || (c === delimiter && !quoted)) {
      const token = raw.slice(start, i); start = i + 1;
      if (!token) continue;
      if (quoted || escaped) throw new UsageError("ambiguous Git alternate object directory");
      if (!token.startsWith('"')) { result.push(token); continue; }
      if (!token.endsWith('"')) throw new UsageError("ambiguous Git alternate object directory");
      const bytes: number[] = [];
      for (let j = 1; j < token.length - 1; j++) {
        if (token[j] !== "\\") {
          const point = String.fromCodePoint(token.codePointAt(j)!); bytes.push(...Buffer.from(point)); j += point.length - 1; continue;
        }
        const rest = token.slice(j + 1, -1), octal = /^[0-7]{3}/.exec(rest);
        if (octal) {
          const value = parseInt(octal[0], 8);
          if (value > 255) throw new UsageError("ambiguous Git alternate object directory");
          bytes.push(value); j += 3; continue;
        }
        const escapes: Record<string, number> = { a: 7, b: 8, t: 9, n: 10, v: 11, f: 12, r: 13, "\\": 92, '"': 34 };
        const value = escapes[token[++j]];
        if (value === undefined) throw new UsageError("ambiguous Git alternate object directory");
        bytes.push(value);
      }
      result.push(new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(Buffer.from(bytes)));
    } else if (escaped) escaped = false;
    else if (c === "\\" && quoted) escaped = true;
    else if (c === '"') quoted = !quoted;
  }
  return result;
}

/** Refuse infrastructure, never invoke Git workflow/authentication helpers. */
export function assertNoGitMetadataDestinations(root: string, paths: string[],
  options: { pathSyntax?: "native"; recursiveMaxEntries?: number } = {}): void {
  if (!paths.length) return;
  const components = (value: string) => options.pathSyntax === "native" ? value.split(path.sep) : value.split(/[\\/]/);
  for (const relative of paths) {
    if (components(relative).some(part => part.toLowerCase() === ".git")) {
      throw new UsageError(`destination overlaps native Git metadata: ${relative}`);
    }
  }
  // Recursive replacement also owns every descendant it removes. Observe only
  // the affected trees, bound entries by the caller's existing graph limit, and
  // never follow a link while looking for nested repositories or bare stores.
  if (options.recursiveMaxEntries !== undefined) {
    let entries = 0;
    const pending = paths.map(relative => path.resolve(root, components(relative).join(path.sep)));
    const seen = new Set<string>();
    while (pending.length) {
      const directory = pending.pop()!;
      if (seen.has(directory) || !exists(directory) || !fs.lstatSync(directory).isDirectory()) continue;
      seen.add(directory);
      if (exists(path.join(directory, ".git")) || ["HEAD", "objects", "config"].every(name => exists(path.join(directory, name)))) {
        throw new UsageError(`destination overlaps native Git metadata: ${path.relative(root, directory)}`);
      }
      forEachContainedDirectoryEntry({ root, relativePath: path.relative(root, directory) || ".", pathSyntax: "native" }, entry => {
        if (++entries > options.recursiveMaxEntries!) throw new UsageError("Git destination tree inventory exceeds entry limit");
        if (entry.isDirectory()) pending.push(path.join(directory, entry.name));
      });
    }
  }
  const observations: Array<{ cwd: string; env: NodeJS.ProcessEnv }> = [];
  const natural = naturalGitContext(root);
  const naturalRoots = new Set<string>(natural ? [root] : []);
  // A configured destination may belong to a nested checkout or bare store.
  // Inspect its ancestors, not only the command root and not an unbounded
  // repository-wide search. Each observation retains natural Git discovery.
  for (const relative of paths) {
    const destination = path.resolve(root, components(relative).join(path.sep));
    const start = exists(destination) && fs.lstatSync(destination).isDirectory() ? destination : path.dirname(destination);
    for (let current = start; ; current = path.dirname(current)) {
      const within = path.relative(path.resolve(root), current);
      if (within === ".." || within.startsWith(`..${path.sep}`) || path.isAbsolute(within)) break;
      if (exists(path.join(current, ".git")) || ["HEAD", "objects", "config"].every(name => exists(path.join(current, name)))) naturalRoots.add(current);
      if (current === path.resolve(root) || path.dirname(current) === current) break;
    }
  }
  const env = { ...process.env };
  for (const key of REDIRECTS) delete env[key];
  for (const cwd of naturalRoots) observations.push({ cwd, env });
  if (process.env.GIT_DIR || (natural && REDIRECTS.some(key => process.env[key] !== undefined))) observations.push({ cwd: root, env: process.env });
  // Non-Git bootstrap must not require an installed Git executable.
  if (!observations.length) return;
  const protectedPaths = new Set<string>();
  const objectStores = new Set<string>();
  for (const { cwd, env } of observations) {
    for (const args of [["--absolute-git-dir"], ["--git-common-dir"], ["--git-path", "index"],
      ["--git-path", "objects"], ["--git-path", "hooks"]]) {
      const raw = observeGit(cwd, ["rev-parse", "--path-format=absolute", ...args], { env }).stdout;
      const value = raw.replace(/\r?\n$/, "");
      if (!raw.endsWith("\n") || !path.isAbsolute(value) || /[\r\n\0]/.test(value)) {
        throw new UsageError("native Git metadata observation is ambiguous; destination refused");
      }
      protectedPaths.add(physical(value));
      if (args[1] === "objects") objectStores.add(value);
    }
  }
  for (const value of alternateNames(process.env.GIT_ALTERNATE_OBJECT_DIRECTORIES ?? "", path.delimiter)) {
    objectStores.add(path.resolve(root, value));
  }
  // Follow bounded alternate-store declarations, not object contents. Cycles
  // are harmless; malformed or inaccessible declarations fail closed.
  const seen = new Set<string>();
  for (const store of objectStores) {
    const real = physical(store); protectedPaths.add(real);
    if (seen.has(real)) continue;
    seen.add(real);
    if (seen.size > 128) throw new UsageError("Git alternate object directory inventory exceeds limit");
    if (!exists(path.join(store, "info/alternates"))) continue;
    const bytes = readContainedFile({ root: store, relativePath: "info/alternates", maxBytes: 65536 }, null);
    let raw: string;
    try { raw = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(bytes); }
    catch { throw new UsageError("Git alternate object directory encoding is unsupported; destination refused"); }
    for (const value of alternateNames(raw, "\n")) {
      if (value.includes("\0")) throw new UsageError("ambiguous Git alternate object directory");
      objectStores.add(path.resolve(store, value));
    }
  }
  for (const relative of paths) {
    const candidate = physical(path.resolve(root, components(relative).join(path.sep)));
    if ([...protectedPaths].some(metadata => overlaps(candidate, metadata))) {
      throw new UsageError(`destination overlaps native Git metadata: ${relative}`);
    }
  }
}
