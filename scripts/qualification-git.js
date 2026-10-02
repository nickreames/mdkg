// Native Git for explicitly accepted disposable fixtures, not a public workflow
// wrapper or a sandbox. Runtime Git observations remain a separate source API.
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { assertDirectoryChain, within } = require("./qualification-output");
const { isolatedFixtureEnvironment } = require("./qualification-fixture");
const { runFixtureProcess, assertFixtureProcessesQuiescent } = require("./qualification-process");

const ordinary = new Set(["add", "commit", "checkout", "switch", "branch", "merge", "cherry-pick", "revert", "rm", "update-index", "rev-parse", "show", "diff", "status", "ls-files", "ls-tree", "merge-base", "log", "rev-list", "diff-tree", "symbolic-ref"]);
const fixedConfig = [
  "core.fsmonitor=false", `core.hooksPath=${os.devNull}`, "core.pager=false",
  // Disabling global config alone leaves Git's HOME/XDG ignore defaults active.
  // Keep .gitignore and info/exclude, but never inherit an external ignore file.
  `core.excludesFile=${os.devNull}`,
  "commit.gpgSign=false", "tag.gpgSign=false", "log.showSignature=false",
  "credential.helper=", "maintenance.auto=false", "gc.auto=0",
  "init.templateDir=", "protocol.allow=never", "protocol.file.allow=always",
  "submodule.recurse=false", "fetch.recurseSubmodules=false",
];

// This is a fixture admission contract, not a replacement Git CLI. Add a needed
// native scenario explicitly, with its custody/positive controls, before use.
const optionSpec = {
  add: ["-A --all -f --force -N --intent-to-add --renormalize", ""],
  commit: ["-a --all --allow-empty --allow-empty-message --amend --no-edit --no-verify --only -o --include -i --no-gpg-sign --signoff -s --reset-author", "-m --message -F --file -C --reuse-message --author --date"],
  checkout: ["-f --force --detach --ours --theirs --no-recurse-submodules", "-b -B --orphan --conflict"],
  switch: ["-f --force --discard-changes -d --detach --no-recurse-submodules", "-c --create -C --force-create"],
  branch: ["-d -D -m -M -f --force --list --show-current", ""],
  merge: ["--no-ff --ff-only --ff --no-edit --no-commit --abort --continue --squash --no-verify --no-gpg-sign --no-verify-signatures", "-m --message -s --strategy -X --strategy-option"],
  "cherry-pick": ["--no-edit --no-commit -n --abort --continue --quit --skip -x -s --signoff --no-gpg-sign", "-m --mainline --strategy -X --strategy-option"],
  revert: ["--no-edit --no-commit -n --abort --continue --quit --skip --no-gpg-sign", "-m --mainline --strategy -X --strategy-option"],
  rm: ["--cached -f --force -r --ignore-unmatch", ""],
  "update-index": ["--add --remove --force-remove --assume-unchanged --no-assume-unchanged --index-info --stdin", "--cacheinfo"],
  "rev-parse": ["--verify --short --abbrev-ref --show-toplevel --git-dir --absolute-git-dir --git-common-dir --is-inside-work-tree --is-bare-repository --show-prefix", "--git-path"],
  "merge-base": ["--is-ancestor --all --octopus --independent --fork-point", ""],
  "ls-files": ["--stage -s --others -o --cached -c --deleted -d --modified -m --exclude-standard --error-unmatch --unmerged -u -z", ""],
  "ls-tree": ["-r -z --name-only --full-tree", ""],
  "symbolic-ref": ["--short --delete -d", "-m"],
};
const displayFlags = "--cached --staged --name-only --name-status --stat --numstat --check --binary --raw --exit-code --full-index --no-color --no-ext-diff --no-textconv --oneline --all --decorate --no-decorate --no-walk --no-show-signature --parents --count --reverse --topo-order --left-right -r -z";
for (const command of ["show", "diff", "log", "rev-list", "diff-tree"]) optionSpec[command] = [displayFlags, "--format --pretty --max-count -n --unified -U"];
optionSpec.status = ["--short -s --porcelain --branch -b --ignored", "--untracked-files"];

function admitOrdinaryArguments(command, args, admitFile) {
  const [flags, values] = optionSpec[command];
  const simple = new Set(("-q --quiet -v --verbose " + flags).split(" "));
  const valued = new Set(values.split(" ").filter(Boolean));
  let message = false, noEdit = false;
  function accept(flag, value) {
    if (["-m", "--message", "-F", "--file", "-C", "--reuse-message"].includes(flag) && command === "commit") message = true;
    if (flag === "--no-edit") noEdit = true;
    if (command === "commit" && ["-F", "--file"].includes(flag) && value !== "-") admitFile(value);
    if (["--strategy", ...(command === "merge" ? ["-s"] : [])].includes(flag) && !["ort", "recursive", "resolve", "octopus", "ours", "subtree"].includes(value)) throw new Error("unsupported Git fixture strategy helper");
  }
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--") break;
    if (!arg.startsWith("-") || arg === "-") continue;
    if (["log", "rev-list", "show"].includes(command) && /^-\d+$/.test(arg)) continue;
    if (command === "status" && ["--porcelain=v1", "--porcelain=v2", "-uno", "-unormal", "-uall"].includes(arg)) continue;
    if (arg.startsWith("--")) {
      const equals = arg.indexOf("="), flag = equals < 0 ? arg : arg.slice(0, equals);
      if (simple.has(flag) && equals < 0) { accept(flag); continue; }
      if (!valued.has(flag)) throw new Error(`unsupported Git fixture option: ${arg}`);
      const value = equals < 0 ? args[++i] : arg.slice(equals + 1);
      if (value === undefined) throw new Error("Git fixture option requires a value");
      accept(flag, value); continue;
    }
    for (let j = 1; j < arg.length; j++) {
      const flag = "-" + arg[j];
      if (simple.has(flag)) { accept(flag); continue; }
      if (!valued.has(flag)) throw new Error(`unsupported Git fixture option: ${flag}`);
      const value = arg.slice(j + 1) || args[++i];
      if (value === undefined) throw new Error("Git fixture option requires a value");
      accept(flag, value); break;
    }
  }
  if (command === "commit" && !message && !noEdit) throw new Error("Git fixture commit must be noninteractive with an explicit message or --no-edit");
}

function acceptOwnedGitFixture(directory, suppliedEnv = process.env) {
  const namedRoot = path.resolve(directory), root = fs.realpathSync(namedRoot);
  const tempRoots = [...new Set([fs.realpathSync(os.tmpdir()), ...(fs.existsSync("/private/tmp") ? ["/private/tmp"] : [])])];
  if (!tempRoots.some(base => root !== base && within(base, root))) throw new Error("Git fixture ownership requires an exact disposable temporary directory");
  assertDirectoryChain(root);
  const anchors = [];
  for (let p = root; ; p = path.dirname(p)) {
    const s = fs.lstatSync(p); anchors.push({ path: p, dev: s.dev, ino: s.ino });
    if (p === path.dirname(p)) break;
  }
  const bindings = new Map();
  const env = Object.freeze({
    ...isolatedFixtureEnvironment(suppliedEnv),
    GIT_ALLOW_PROTOCOL: "file", GIT_NO_LAZY_FETCH: "1", GIT_PAGER: "cat",
    GIT_CONFIG_SYSTEM: os.devNull, GIT_CEILING_DIRECTORIES: root,
    GIT_ATTR_NOSYSTEM: "1", LC_ALL: "C",
    GIT_EDITOR: ":", GIT_SEQUENCE_EDITOR: ":", GIT_MERGE_AUTOEDIT: "no",
  });
  function assertOwned() {
    for (const a of anchors) {
      const s = fs.lstatSync(a.path);
      if (!s.isDirectory() || s.dev !== a.dev || s.ino !== a.ino) throw new Error("Git fixture ownership changed; preserve uncertain paths");
    }
  }
  function contained(value, base = root, missing = false) {
    assertOwned();
    let p = path.resolve(base, value);
    if (namedRoot !== root && within(namedRoot, p)) p = path.join(root, path.relative(namedRoot, p));
    if (!within(root, p)) throw new Error("Git fixture path escapes its accepted ownership root");
    let existing = p;
    while (missing && !fs.existsSync(existing)) existing = path.dirname(existing);
    assertDirectoryChain(fs.existsSync(existing) && fs.lstatSync(existing).isDirectory() ? existing : path.dirname(existing));
    if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) throw new Error("Git fixture path is a symlink");
    return p;
  }
  function readControl(file) {
    const p = contained(file), s = fs.lstatSync(p);
    if (!s.isFile() || s.nlink !== 1 || s.size > 1024 * 1024) throw new Error("Git fixture control must be a bounded independent regular file");
    return fs.readFileSync(p, "utf8");
  }
  function raw(cwd, args, options = {}) {
    assertOwned();
    const identity = options.identity || ["user.name=mdkg fixture", "user.email=fixture@example.invalid"];
    return runFixtureProcess(root, "git", ["--no-optional-locks", "--no-pager", ...[...fixedConfig, ...identity].flatMap(c => ["-c", c]), ...args], {
      cwd, env, timeout: options.timeout ?? 60000, maxBuffer: 16 * 1024 * 1024, input: options.input,
    });
  }
  function requireSuccess(result, label) {
    if (result.error || result.signal || result.status !== 0) throw new Error(`Git fixture ${label} failed: ${result.error?.message || result.stderr || result.stdout}`);
    return result.stdout;
  }
  function configRows(file) {
    if (!fs.existsSync(file)) return [];
    readControl(file);
    const output = requireSuccess(raw(root, ["config", "--no-includes", "--null", "--file", file, "--list"]), "config admission");
    return output.split("\0").filter(Boolean).map(row => {
      const split = row.indexOf("\n");
      return split < 0 ? [row.toLowerCase(), ""] : [row.slice(0, split).toLowerCase(), row.slice(split + 1)];
    });
  }
  function metadataTree(directory, metadataRoot = directory) {
    // Symlinked object/refs/log directories can redirect native Git writes even
    // when --git-dir itself is contained. Hard-linked immutable objects are OK.
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const p = path.join(directory, entry.name);
      if (entry.isDirectory()) metadataTree(p, metadataRoot);
      else if (!entry.isFile()) throw new Error("Git fixture metadata contains a linked or special entry");
      else {
        const relative = path.relative(metadataRoot, p).split(path.sep).join("/");
        const immutableObject = /^objects\/(?:[a-f0-9]{2}\/(?:[a-f0-9]{38}|[a-f0-9]{62})|pack\/pack-(?:[a-f0-9]{40}|[a-f0-9]{64})\.(?:pack|idx))$/.test(relative);
        if (fs.lstatSync(p).nlink !== 1 && !immutableObject) throw new Error("Git fixture mutable metadata must not be hard-linked");
      }
      if (entry.isFile() && entry.name === "alternates" && path.basename(directory) === "info") {
        for (const line of readControl(p).split(/\r?\n/).filter(Boolean)) contained(line, path.dirname(directory));
      } else if (entry.name === "gitdir" && p.includes(`${path.sep}worktrees${path.sep}`)) {
        contained(readControl(p).trim(), directory);
      }
    }
  }
  function describe(value) {
    const top = contained(value);
    let gitDir = path.join(top, ".git"), bare = false, pointer = null;
    if (fs.existsSync(gitDir)) {
      const marker = fs.lstatSync(gitDir);
      if (marker.isFile()) {
        pointer = readControl(gitDir);
        const match = /^gitdir: ([^\r\n]+)\r?\n?$/.exec(pointer);
        if (!match) throw new Error("invalid Git fixture gitdir pointer");
        gitDir = contained(match[1], top);
      } else if (!marker.isDirectory()) throw new Error("Git fixture .git is linked or special");
    } else if (fs.existsSync(path.join(top, "HEAD")) && fs.existsSync(path.join(top, "objects"))) {
      gitDir = top; bare = true;
    } else throw new Error("Git fixture root has no explicit repository; ancestor discovery is forbidden");
    gitDir = contained(gitDir);
    let common = gitDir;
    if (fs.existsSync(path.join(gitDir, "commondir"))) common = contained(readControl(path.join(gitDir, "commondir")).trim(), gitDir);
    for (const d of new Set([gitDir, common])) { assertDirectoryChain(d); metadataTree(d); }
    const commonRows = configRows(path.join(common, "config"));
    const worktreeRows = configRows(path.join(gitDir, "config.worktree"));
    const rows = [...commonRows, ...worktreeRows];
    for (const [key, value] of rows) {
      if (/^include(?:if\..*)?\.path$/.test(key) || /^url\..*\.(?:insteadof|pushinsteadof)$/.test(key) ||
          /^filter\..*\.(?:clean|smudge|process)$/.test(key) && value || /^diff\.(?:external|.*\.(?:command|textconv))$/.test(key) && value ||
          /^merge\..*\.driver$/.test(key) && value || /^remote\..*\.(?:vcs|uploadpack|receivepack)$/.test(key) && value ||
          /^(?:core\.editor|sequence\.editor|commit\.template|gpg\.program|gpg\..*\.(?:program|defaultkeycommand))$/.test(key) && value) {
        throw new Error(`Git fixture executable/include/URL policy is unsupported: ${key}`);
      }
      if (key === "core.worktree" && contained(value, gitDir) !== top) throw new Error("Git fixture core.worktree does not match its expected root");
    }
    const directoryIdentity = [top, gitDir, common].map(p => { const s = fs.lstatSync(p); return [p, s.dev, s.ino]; });
    const binding = JSON.stringify({ identity: directoryIdentity, pointer, bare });
    if (bindings.has(top) && bindings.get(top) !== binding) throw new Error("Git fixture repository identity changed");
    const prefix = [`--git-dir=${gitDir}`, ...(bare ? [] : [`--work-tree=${top}`])];
    const observed = requireSuccess(raw(top, [...prefix, "rev-parse", "--absolute-git-dir", "--git-common-dir", "--git-path", "index"]), "root admission").trim().split(/\r?\n/);
    if (observed.length !== 3 || path.resolve(top, observed[0]) !== gitDir || path.resolve(top, observed[1]) !== common || path.resolve(top, observed[2]) !== path.join(gitDir, "index")) {
      throw new Error("Git fixture resolved metadata does not match admitted paths");
    }
    bindings.set(top, binding);
    const commonConfig = Object.fromEntries(commonRows);
    // Ask native Git for its typed value: a valueless key and nonzero integers
    // are true too. Do not silently invent another config-boolean language.
    const worktreeEnabled = Object.hasOwn(commonConfig, "extensions.worktreeconfig") && requireSuccess(raw(root,
      ["config", "--no-includes", "--type=bool", "--file", path.join(common, "config"), "--get", "extensions.worktreeConfig"]), "worktree config boolean").trim() === "true";
    const localConfig = Object.fromEntries([...commonRows, ...(worktreeEnabled ? worktreeRows : [])]);
    const identity = [`user.name=${localConfig["user.name"] || "mdkg fixture"}`, `user.email=${localConfig["user.email"] || "fixture@example.invalid"}`];
    return { top, gitDir, common, bare, prefix, identity };
  }
  function newDestination(value, cwd) {
    const destination = contained(value, cwd, true);
    if (destination === root || fs.existsSync(destination) && (!fs.lstatSync(destination).isDirectory() || fs.readdirSync(destination).length)) {
      throw new Error("Git fixture destination must be a fresh owned directory");
    }
    return destination;
  }
  // A deliberately mutating native-status positive control, never the default
  // observation path. It only refreshes an explicitly admitted checkout index.
  function refreshIndexForControl(cwdValue) {
    const cwd = contained(cwdValue), repo = describe(cwd);
    if (repo.bare) throw new Error("index-refresh control requires a working checkout");
    return runFixtureProcess(root, "git", ["--no-pager", ...fixedConfig.flatMap(c => ["-c", c]),
      ...repo.prefix, "status", "--porcelain=v1"], {
      cwd, env: { ...env, GIT_OPTIONAL_LOCKS: "1" }, timeout: 60000, maxBuffer: 16 * 1024 * 1024,
    });
  }
  function run(cwdValue, args, options = {}) {
    const cwd = contained(cwdValue);
    if (!Array.isArray(args) || !args.length || args.some(v => typeof v !== "string" || v.includes("\0"))) throw new Error("invalid Git fixture arguments");
    const [command, ...rest] = args;
    if (args.some(v => /^(?:--git-dir|--work-tree|--config-env|--exec-path|--namespace|--upload-pack|--receive-pack|--output|--pathspec-from-file)(?:=|$)/.test(v)) || command.startsWith("-")) throw new Error("Git fixture authority override is forbidden");
    if (command === "init") {
      if (fs.existsSync(path.join(cwd, ".git")) || bindings.has(cwd)) throw new Error("Git fixture init requires an uninitialized root");
      let separate;
      for (let i = 0; i < rest.length; i++) {
        if (["-q", "--quiet", "--bare"].includes(rest[i])) continue;
        if (["-b", "--initial-branch"].includes(rest[i]) && rest[i + 1]) { i++; continue; }
        if (rest[i] === "--separate-git-dir" && rest[i + 1]) { separate = newDestination(rest[++i], cwd); continue; }
        throw new Error("unsupported Git fixture init argument");
      }
      const result = raw(cwd, args, options);
      if (result.status === 0) { const repo = describe(cwd); if (separate && repo.gitDir !== separate) throw new Error("Git fixture init gitdir mismatch"); }
      return result;
    }
    if (command === "clone") {
      if (rest.length < 2 || rest.slice(0, -2).some(flag => !["--no-local", "--no-hardlinks", "--no-checkout", "--bare", "--quiet", "-q"].includes(flag))) throw new Error("unsupported Git fixture clone arguments");
      const source = describe(contained(rest.at(-2), cwd)).top, destination = newDestination(rest.at(-1), cwd);
      const result = raw(cwd, ["clone", ...rest.slice(0, -2), "--", source, destination], options);
      if (result.status === 0) describe(destination);
      return result;
    }
    const repo = describe(cwd);
    const execute = args => raw(cwd, [...repo.prefix, ...args], { ...options, identity: repo.identity });
    if (command === "fetch") {
      if (!rest.length || rest.some(v => v.startsWith("-"))) throw new Error("Git fixture fetch requires an explicit local source and refspecs");
      const source = describe(contained(rest[0], cwd)).top;
      return execute(["fetch", "--", source, ...rest.slice(1)]);
    }
    if (command === "worktree") {
      if (rest[0] !== "add") throw new Error("unsupported Git fixture worktree operation");
      let i = 1;
      while (i < rest.length && rest[i].startsWith("-")) {
        if (["-b", "-B"].includes(rest[i]) && rest[i + 1]) i += 2;
        else if (["--detach", "--force", "-q", "--quiet"].includes(rest[i])) i++;
        else throw new Error("unsupported Git fixture worktree add option");
      }
      if (rest.length - i < 1 || rest.length - i > 2) throw new Error("invalid Git fixture worktree destination");
      const destination = newDestination(rest[i], cwd);
      const result = execute(["worktree", ...rest.slice(0, i), destination, ...rest.slice(i + 1)]);
      if (result.status === 0) describe(destination);
      return result;
    }
    if (command === "submodule") {
      if (rest.length !== 4 || rest[0] !== "add" || rest[1] !== "--force") {
        throw new Error("Git fixture submodule requires add --force and exact local source/destination");
      }
      if (!path.isAbsolute(rest[2])) throw new Error("Git fixture submodule source must be an absolute owned path");
      const source = describe(contained(rest[2], cwd)).top;
      const destination = newDestination(rest[3], cwd);
      if (!within(repo.top, destination)) throw new Error("Git fixture submodule destination leaves its checkout");
      // File transport avoids native local-clone hardlinks in nested metadata;
      // do not weaken the independent mutable-metadata admission rule.
      const result = execute(["submodule", "add", "--force", "--", pathToFileURL(source).href, path.relative(repo.top, destination)]);
      if (result.status === 0) describe(destination);
      return result;
    }
    if (command === "mv") {
      if (rest.length !== 2 || rest.some(value => !value || value.startsWith("-"))) throw new Error("Git fixture mv requires two explicit paths");
      const source = contained(rest[0], cwd);
      const destination = contained(rest[1], cwd, true);
      if (!within(repo.top, source) || !within(repo.top, destination)) throw new Error("Git fixture mv leaves its checkout");
      // Moving a directory can rewrite nested submodule gitdir metadata that
      // was never admitted by the parent checkout. This fixture needs only a
      // regular-file rename, with no overwrite or shared inode.
      const sourceStat = fs.lstatSync(source);
      if (!sourceStat.isFile() || sourceStat.nlink !== 1) throw new Error("Git fixture mv requires an independent regular file");
      if (fs.lstatSync(destination, { throwIfNoEntry: false })) throw new Error("Git fixture mv destination must be absent");
      return execute(["mv", "--", ...rest]);
    }
    if (command === "config") {
      if (rest.length !== 2 || !["user.name", "user.email", "core.filemode", "core.autocrlf"].includes(rest[0])) throw new Error("Git fixture config is limited to explicit non-executable local settings");
      return execute(["config", "--local", ...rest]);
    }
    if (command === "check-ignore") {
      // Only explicit paths in this checkout, not stdin, external files or
      // option-based discovery. Exit 1 means unignored; other failures are not
      // evidence that a graph artifact is eligible for a commit.
      if (!rest.length || rest.some(value => !value || value.startsWith("-"))) throw new Error("Git fixture check-ignore requires explicit paths without options");
      for (const value of rest) {
        if (!within(repo.top, contained(value, cwd, true))) throw new Error("Git fixture check-ignore path leaves its checkout");
      }
      return execute(["check-ignore", "--", ...rest]);
    }
    if (!ordinary.has(command)) throw new Error(`unsupported Git fixture command: ${command}`);
    admitOrdinaryArguments(command, rest, value => readControl(contained(value, cwd)));
    const guardFlags = ["diff", "show", "log"].includes(command) ? ["--no-ext-diff", "--no-textconv"] : [];
    return execute([command, ...guardFlags, ...rest]);
  }
  return Object.freeze({ root, environment: env, run, describe, refreshIndexForControl, assertOwned, assertQuiescent: () => assertFixtureProcessesQuiescent(root) });
}

module.exports = { acceptOwnedGitFixture };
