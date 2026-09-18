import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { TextDecoder } from "util";
import { ValidationError } from "./errors";

export type GitStatusEntry = {
  index: string;
  worktree: string;
  path: string;
  original_path?: string;
};

type GitReadOptions = {
  allowedFailures?: number[];
  config?: string[];
  input?: string;
  maxBuffer?: number;
  env?: NodeJS.ProcessEnv;
};

function literalObservationEnvironment(env = process.env): NodeJS.ProcessEnv {
  return { ...env, GIT_LITERAL_PATHSPECS: "0", GIT_GLOB_PATHSPECS: "0",
    GIT_NOGLOB_PATHSPECS: "0", GIT_ICASE_PATHSPECS: "0" };
}

function observationError(command: string): ValidationError {
  return new ValidationError(`Git ${command} observation failed; no successful observation emitted`);
}

// Internal observations only. No public Git workflow, authentication or mutation.
export function observeGit(cwd: string, args: string[], options: GitReadOptions = {}) {
  const env: NodeJS.ProcessEnv = { ...(options.env ?? process.env), GIT_OPTIONAL_LOCKS: "0", GIT_NO_LAZY_FETCH: "1", LC_ALL: "C" };
  // GIT_CONFIG redirects only `git config`, not status or other Git commands.
  // Observe the same effective repository configuration as the guarded command.
  delete env.GIT_CONFIG;
  const result = spawnSync("git", ["-c", "core.fsmonitor=false",
    ...(options.config ?? []).flatMap(value => ["-c", value]), ...args], {
    cwd, input: options.input, stdio: "pipe",
    ...(options.maxBuffer === undefined ? {} : { maxBuffer: options.maxBuffer }),
    env,
  });
  if (result.error || result.signal || result.status === null ||
      (result.status !== 0 && !options.allowedFailures?.includes(result.status))) throw observationError(args[0]);
  try {
    const decoder = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
    return { status: result.status, stdout: decoder.decode(result.stdout), stderr: decoder.decode(result.stderr) };
  } catch {
    throw observationError(args[0]);
  }
}

export function parseGitStatus(raw: string): GitStatusEntry[] {
  if (!raw) return [];
  if (!raw.endsWith("\0")) throw observationError("status");
  const records = raw.slice(0, -1).split("\0");
  const entries: GitStatusEntry[] = [];
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const code = record.slice(0, 2);
    if (record.length < 4 || record[2] !== " " || !/^[ MADRCUT?!]{2}$/.test(code) || code === "  " ||
        (/[?!]/.test(code) && code !== "??" && code !== "!!")) throw observationError("status");
    const entry: GitStatusEntry = { index: code[0], worktree: code[1], path: record.slice(3) };
    // Porcelain v1 -z emits destination first, then a separate source record.
    if (/[RC]/.test(code)) {
      if (!records[i + 1]) throw observationError("status");
      entry.original_path = records[++i];
    }
    entries.push(entry);
  }
  return entries;
}

export function readGitHead(root: string): string | null {
  const result = observeGit(root, ["rev-parse", "--verify", "--quiet", "HEAD"], { allowedFailures: [1] });
  if (result.status === 1) return null;
  return objectId(result.stdout);
}

function objectId(raw: string): string {
  const value = raw.replace(/\r?\n$/, "");
  if (!/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(value)) throw observationError("rev-parse");
  return value;
}

export function insideGitWorkTree(root: string): boolean {
  const result = observeGit(root, ["rev-parse", "--is-inside-work-tree"], { allowedFailures: [128] });
  if (result.status === 128 && /^fatal: not a git repository \((?:or any of the parent directories|or any parent up to mount point [^\n]+)\)/m.test(result.stderr)) return false;
  if (result.status !== 0 || !/^(true|false)\r?\n$/.test(result.stdout)) throw observationError("rev-parse");
  return result.stdout.startsWith("true");
}

/** Git-root-relative cwd prefix. Git always uses /; backslashes are literal. */
export function readGitPrefix(root: string, options: GitReadOptions = {}): string {
  const raw = observeGit(root, ["rev-parse", "--show-prefix"], options).stdout;
  if (!raw.endsWith("\n")) throw observationError("rev-parse");
  const prefix = raw.replace(/\r?\n$/, "");
  if (prefix.includes("\0") || (prefix && (!prefix.endsWith("/") || path.posix.isAbsolute(prefix) ||
      prefix.slice(0, -1).split("/").some(part => !part || part === ".." || part === ".")))) {
    throw observationError("rev-parse");
  }
  return prefix;
}

function nulRecords(raw: string, command: string): string[] {
  if (!raw) return [];
  if (!raw.endsWith("\0")) throw observationError(command);
  return raw.slice(0, -1).split("\0");
}

function assertNoContentFilterExecution(
  root: string, paths: string[] | undefined, options: GitReadOptions, visited = new Set<string>()
): void {
  const git = (args: string[], allowedFailures: number[] = [], input?: string) =>
    observeGit(root, args, { ...options, allowedFailures, input });
  const top = git(["rev-parse", "--show-toplevel"]).stdout.replace(/\r?\n$/, "");
  if (!path.isAbsolute(top)) throw observationError("rev-parse");
  const realRoot = fs.realpathSync(top);
  if (visited.has(realRoot)) throw observationError("status");
  visited.add(realRoot);
  const prefix = readGitPrefix(root, options);
  const configured = git(["config", "--null", "--get-regexp", "^filter\\..*\\.(clean|process)$"], [1]);
  const settings = new Map<string, string>();
  for (const record of nulRecords(configured.stdout, "config")) {
    const separator = record.indexOf("\n");
    if (separator < 0) throw observationError("config");
    settings.set(record.slice(0, separator), record.slice(separator + 1));
  }
  const drivers = new Set<string>();
  for (const [key, value] of settings) {
    const match = /^filter\.(.*)\.(clean|process)$/.exec(key);
    if (!match) throw observationError("config");
    if (value) drivers.add(match[1]);
  }
  const tracked = new Set<string>(), submodules = new Set<string>();
  // Status without a pathspec covers the entire worktree even when cwd is nested.
  // Force our own pathspec interpretation; caller Git wildcard settings must not
  // turn the top-level selector into a literal, silently empty inventory.
  const inventory = observeGit(root, ["ls-files", "--stage", "--full-name", "-z", "--", ...(paths ?? [":/"])], {
    ...options, env: literalObservationEnvironment(options.env),
  });
  for (const record of nulRecords(inventory.stdout, "ls-files")) {
    const match = /^([0-7]{6}) (?:[0-9a-f]{40}|[0-9a-f]{64}) [0-3]\t([\s\S]+)$/.exec(record);
    if (!match) throw observationError("ls-files");
    if (match[1] === "160000") submodules.add(match[2]);
    else tracked.add(path.posix.relative(prefix || ".", match[2]));
  }
  if (drivers.size && tracked.size) {
    // --all omits unspecified attributes. Asking for `filter` explicitly would
    // confuse an absent attribute with a literal driver named "unspecified".
    const attrs = nulRecords(git(["check-attr", "--all", "-z", "--stdin"], [], [...tracked].join("\0") + "\0").stdout, "check-attr");
    if (attrs.length % 3 !== 0) throw observationError("check-attr");
    const seen = new Set<string>();
    for (let i = 0; i < attrs.length; i += 3) {
      const key = JSON.stringify([attrs[i], attrs[i + 1]]);
      if (!tracked.has(attrs[i]) || !attrs[i + 1] || seen.has(key)) throw observationError("check-attr");
      seen.add(key);
      if (attrs[i + 1] === "filter" && drivers.has(attrs[i + 2])) {
        // Git serializes boolean attribute states exactly like literal "set"
        // and "unset" strings. Ask Git itself whether conversion selects a
        // driver, with every executable driver disabled and made required.
        // hash-object without -w only reads; never use its content result as
        // provenance or disable filters on the actual status observation.
        if (attrs[i + 2] === "set" || attrs[i + 2] === "unset") {
          const probe = observeGit(root, ["hash-object", `--path=${attrs[i]}`, "--stdin"], {
            ...options, input: "", allowedFailures: [128],
            config: [...drivers].flatMap(driver => [
              `filter.${driver}.clean=`, `filter.${driver}.process=`, `filter.${driver}.required=true`,
            ]),
          });
          if (probe.status === 0) { objectId(probe.stdout); continue; }
        }
        throw new ValidationError("Git status observation requires a configured content filter; observation refuses helper execution. Use native Git only after reviewing that filter.");
      }
    }
  }
  for (const relative of submodules) {
    const child = path.resolve(realRoot, relative), contained = path.relative(realRoot, child);
    if (!contained || contained.startsWith(".." + path.sep) || contained === ".." || path.isAbsolute(contained)) throw observationError("ls-files");
    if (!fs.existsSync(path.join(child, ".git"))) continue;
    if (fs.realpathSync(child) !== child) throw observationError("status");
    // Native Git enters a submodule's own repository, rather than reusing a
    // caller's parent GIT_DIR/WORK_TREE/INDEX_FILE. Retain command-scope config.
    const childEnv = { ...(options.env ?? process.env) };
    for (const name of git(["rev-parse", "--local-env-vars"]).stdout.trim().split(/\r?\n/)) {
      if (!/^[A-Z_][A-Z0-9_]*$/.test(name)) throw observationError("rev-parse");
      if (name !== "GIT_CONFIG_PARAMETERS" && name !== "GIT_CONFIG_COUNT") delete childEnv[name];
    }
    assertNoContentFilterExecution(child, undefined, { ...options, env: childEnv }, visited);
  }
}

export function readGitStatus(
  root: string, options: { untracked?: "all" | "normal" | "no"; paths?: string[]; maxBuffer?: number } = {}
): GitStatusEntry[] {
  assertNoContentFilterExecution(root, options.paths, options);
  return parseGitStatus(observeGit(root, [
    "status", "--porcelain=v1", "-z", `--untracked-files=${options.untracked ?? "normal"}`,
    ...(options.paths ? ["--", ...options.paths] : []),
  ], { ...options, env: literalObservationEnvironment() }).stdout);
}
