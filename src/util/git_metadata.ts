import fs from "fs";
import path from "path";
import { observeGit } from "./git_observation";
import { UsageError } from "./errors";
import { readContainedFile } from "../core/filesystem_authority";

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
export function assertNoGitMetadataDestinations(root: string, paths: string[]): void {
  if (!paths.length) return;
  for (const relative of paths) {
    if (relative.split(/[\\/]/).some(part => part.toLowerCase() === ".git")) {
      throw new UsageError(`destination overlaps native Git metadata: ${relative}`);
    }
  }
  const environments: NodeJS.ProcessEnv[] = [];
  const natural = naturalGitContext(root);
  if (natural) {
    const env = { ...process.env };
    for (const key of REDIRECTS) delete env[key];
    environments.push(env);
  }
  if (process.env.GIT_DIR || (natural && REDIRECTS.some(key => process.env[key] !== undefined))) environments.push(process.env);
  // Non-Git bootstrap must not require an installed Git executable.
  if (!environments.length) return;
  const protectedPaths = new Set<string>();
  const objectStores = new Set<string>();
  for (const env of environments) {
    for (const args of [["--absolute-git-dir"], ["--git-common-dir"], ["--git-path", "index"],
      ["--git-path", "objects"], ["--git-path", "hooks"]]) {
      const raw = observeGit(root, ["rev-parse", "--path-format=absolute", ...args], { env }).stdout;
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
    const candidate = physical(path.resolve(root, relative.split(/[\\/]/).join(path.sep)));
    if ([...protectedPaths].some(metadata => overlaps(candidate, metadata))) {
      throw new UsageError(`destination overlaps native Git metadata: ${relative}`);
    }
  }
}
