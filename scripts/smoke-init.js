#!/usr/bin/env node

const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const assert = require("node:assert/strict");

const repoRoot = path.resolve(__dirname, "..");
const packageVersion = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")).version;
const tempBase = fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir();
const NPM_CMD = process.env.npm_execpath || "npm";
const GIT_CMD = process.env.GIT || "git";

function commandEnv(extra = {}) {
  const npmCache = process.env.NPM_CONFIG_CACHE || path.join(tempBase, "mdkg-npm-cache");
  fs.mkdirSync(npmCache, { recursive: true });
  return {
    ...process.env,
    NPM_CONFIG_CACHE: npmCache,
    npm_config_cache: npmCache,
    NPM_CONFIG_DRY_RUN: "false",
    npm_config_dry_run: "false",
    ...extra,
  };
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || repoRoot,
    env: commandEnv(options.env || {}),
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} failed with ${result.status}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`
    );
  }
  return {
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
    combined: `${result.stdout}${result.stderr}`,
  };
}

function runExpectFailure(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || repoRoot,
    env: commandEnv(options.env || {}),
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status === 0) {
    throw new Error(`${command} ${args.join(" ")} unexpectedly succeeded`);
  }
  return {
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
    combined: `${result.stdout}${result.stderr}`,
  };
}

function assertExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`expected path to exist: ${filePath}`);
  }
}

function assertNotExists(filePath) {
  if (fs.existsSync(filePath)) {
    throw new Error(`unexpected path exists: ${filePath}`);
  }
}

function assertIncludes(value, expected, label) {
  if (!value.includes(expected)) {
    throw new Error(`${label} missing ${expected}`);
  }
}

function assertNotIncludes(value, expected, label) {
  if (value.includes(expected)) {
    throw new Error(`${label} unexpectedly included ${expected}`);
  }
}

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function fileInventory(root) {
  const files = {};
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (entry.isFile()) files[path.relative(root, file).split(path.sep).join("/")] = sha256(file);
      else throw new Error(`unexpected fixture file type: ${file}`);
    }
  }
  visit(root);
  return files;
}

// Assert public installed discovery surfaces; never import graph implementation.
function canonicalSkillInventories(root) {
  const result = {}, base = path.join(root, ".mdkg/skills");
  for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
    if (entry.isDirectory() && fs.existsSync(path.join(base, entry.name, "SKILL.md"))) {
      result[entry.name] = fileInventory(path.join(base, entry.name));
    }
  }
  return result;
}

function assertFocusedDiscovery(root, skills, expectedCanonical) {
  assert.ok(skills.length > 0, "installed skills must be discoverable");
  const canonicalSkills = canonicalSkillInventories(root);
  assert.deepEqual(skills.map(skill => skill.slug).sort(), Object.keys(canonicalSkills).sort(),
    "discovery must include every canonical skill exactly once");
  if (expectedCanonical) assert.deepEqual(canonicalSkills, expectedCanonical, "sync must preserve canonical resource bytes");
  let localLinks = 0;
  const containedTarget = (from, target) => {
    const file = path.resolve(from, target), relative = path.relative(root, file);
    assert.ok(relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative), "discovery link escapes fixture");
    assert.ok(fs.existsSync(file), `broken discovery link: ${target}`);
    localLinks++;
  };
  for (const relative of ["AGENTS.md", "CLAUDE.md", ".mdkg/AGENT_START.md", ".mdkg/llms.txt", ".mdkg/README.md"]) {
    const content = fs.readFileSync(path.join(root, relative), "utf8");
    // Seeded inline Markdown links only; this is not a general Markdown parser.
    for (const match of content.matchAll(/\]\(([^)#]+)(?:#[^)]*)?\)/g)) {
      if (/^[a-z][a-z\d+.-]*:/i.test(match[1])) continue;
      containedTarget(path.dirname(path.join(root, relative)), match[1]);
    }
  }
  for (const skill of skills) {
    assert.match(skill.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    for (const link of skill.links || []) {
      if (!/^[a-z][a-z\d+.-]*:/i.test(link)) containedTarget(root, link);
    }
    const canonical = canonicalSkills[skill.slug];
    assert.ok(canonical["SKILL.md"], "canonical SKILL.md required");
    for (const adapter of [".agents", ".claude"]) {
      assert.deepEqual(fileInventory(path.join(root, adapter, "skills", skill.slug)), canonical,
        `native resource inventory differs: ${adapter}/${skill.slug}`);
    }
  }
  return { skills: skills.length, local_links: localLinks, native_targets: 2 };
}

function exerciseCustomizedDiscovery(binPath, tempRoot) {
  const root = path.join(tempRoot, "customized-discovery"); initGit(root);
  const user = "# User instructions\r\nPreserve my constraints.\r\n";
  const projectFiles = ["README.md", "LICENSE", "llms.txt", "docs/project.md"];
  for (const file of [...projectFiles, "AGENTS.md", "CLAUDE.md"]) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), user + file + "\r\n");
  }
  run(GIT_CMD, ["add", "--", ...projectFiles, "AGENTS.md", "CLAUDE.md"], { cwd: root });
  const before = fileInventory(root);
  mdkg(binPath, ["init"], root);
  for (const file of projectFiles) assert.equal(sha256(path.join(root, file)), before[file]);
  assert.equal(sha256(path.join(root, ".git/index")), before[".git/index"]);
  for (const file of ["AGENTS.md", "CLAUDE.md"]) {
    const text = fs.readFileSync(path.join(root, file), "utf8");
    assert.ok(text.startsWith(user + file + "\r\n"));
    assert.equal(text.split("<!-- mdkg:instructions:start -->").length, 2);
    assert.equal(text.split("<!-- mdkg:instructions:end -->").length, 2);
    assert.equal(text.replaceAll("\r\n", "").includes("\n"), false, "root CRLF convention preserved");
    fs.appendFileSync(path.join(root, file), "\r\n# User suffix\r\nNever discard this.\r\n");
  }
  const repeatBefore = fileInventory(root);
  mdkg(binPath, ["init", "--agent"], root);
  for (const file of [...projectFiles, "AGENTS.md", "CLAUDE.md", ".git/index"]) {
    assert.equal(sha256(path.join(root, file)), repeatBefore[file], `repeat changed user file: ${file}`);
  }
  const discoveryBefore = fileInventory(root);
  const skills = parseJson(mdkg(binPath, ["skill", "list", "--json"], root).stdout).items;
  for (const skill of skills) {
    const shown = parseJson(mdkg(binPath, ["skill", "show", skill.slug, "--json"], root).stdout).item;
    assert.equal(shown.slug, skill.slug);
    assert.ok(parseJson(mdkg(binPath, ["skill", "search", skill.slug, "--json"], root).stdout).items.some(item => item.slug === skill.slug));
  }
  assert.deepEqual(fileInventory(root), discoveryBefore, "skill discovery must be observational");
  const initial = assertFocusedDiscovery(root, skills);
  // Add synthetic non-executing resources only inside this disposable skill.
  const slug = skills[0].slug;
  for (const file of ["references/example.md", "assets/example.txt", "scripts/example.txt"]) {
    const target = path.join(root, ".mdkg/skills", slug, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, `Synthetic resource: ${file}\n`);
  }
  for (const adapter of [".agents", ".claude"]) {
    const sentinel = path.join(root, adapter, "skills/unrelated-user-notes/note.txt");
    fs.mkdirSync(path.dirname(sentinel), { recursive: true }); fs.writeFileSync(sentinel, user);
  }
  const canonicalBefore = canonicalSkillInventories(root);
  mdkg(binPath, ["skill", "sync", "--json"], root);
  const resources = assertFocusedDiscovery(root, skills, canonicalBefore);
  for (const adapter of [".agents", ".claude"]) assert.equal(fs.readFileSync(path.join(root, adapter, "skills/unrelated-user-notes/note.txt"), "utf8"), user);
  for (const file of [...projectFiles, "AGENTS.md", "CLAUDE.md", ".git/index"]) assert.equal(sha256(path.join(root, file)), repeatBefore[file]);
  mdkg(binPath, ["validate", "--json"], root);
  return { runtime: process.version, initial, resources, synthetic_resource_files: 3,
    customized_entrypoints: 2, project_files_preserved: projectFiles.length,
    git_index_preserved: true, discovery_observational: true, resources_executed: false };
}

function initGit(root) {
  fs.mkdirSync(root, { recursive: true });
  run(GIT_CMD, ["init", "-q"], { cwd: root });
}

function mdkg(binPath, args, cwd) {
  return run(binPath, args, { cwd });
}

function parseJson(output) {
  return JSON.parse(output);
}

function assertSpecCount(binPath, root, expected, label) {
  const specs = parseJson(mdkg(binPath, ["spec", "list", "--json"], root).stdout);
  if (specs.count !== expected) {
    throw new Error(`${label} expected ${expected} SPEC records, got ${JSON.stringify(specs, null, 2)}`);
  }
}

function packAndInstall(tempRoot) {
  const packDir = path.join(tempRoot, "pack");
  const prefix = path.join(tempRoot, "npm-prefix");
  fs.mkdirSync(packDir, { recursive: true });
  fs.mkdirSync(prefix, { recursive: true });

  const packOutput = run(NPM_CMD, ["pack", "--silent", "--dry-run=false", "--pack-destination", packDir], {
    cwd: repoRoot,
  }).stdout;
  const tarballName = packOutput
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .pop();
  if (!tarballName) {
    throw new Error("unable to determine npm pack output tarball");
  }
  const tarballPath = path.join(packDir, path.basename(tarballName));
  assertExists(tarballPath);

  const install = run(NPM_CMD, ["install", "-g", tarballPath, "--prefix", prefix, "--foreground-scripts"], {
    cwd: tempRoot,
    env: { npm_config_prefix: prefix },
  });
  assertIncludes(install.combined, `mdkg ${packageVersion} installed.`, "postinstall");

  const binPath = process.platform === "win32" ? path.join(prefix, "mdkg.cmd") : path.join(prefix, "bin", "mdkg");
  assertExists(binPath);
  return binPath;
}

function assertManifestMatches(root) {
  const manifestPath = path.join(root, ".mdkg", "init-manifest.json");
  assertExists(manifestPath);
  const manifest = parseJson(fs.readFileSync(manifestPath, "utf8"));
  for (const file of manifest.files) {
    const absolute = path.join(root, file.path);
    assertExists(absolute);
    if (sha256(absolute) !== file.sha256) {
      throw new Error(`manifest hash mismatch for ${file.path}`);
    }
  }
  return manifest;
}

function assertNoImmediateUpgrade(binPath, root) {
  const receipt = parseJson(mdkg(binPath, ["upgrade", "--dry-run", "--json"], root).stdout);
  if (receipt.changes.length !== 0) {
    throw new Error(`fresh workspace should not need immediate upgrade: ${JSON.stringify(receipt, null, 2)}`);
  }
}

function assertNoRemovedInitGuidance(root) {
  for (const relativePath of [
    ".mdkg/AGENT_START.md",
    "AGENTS.md",
    "CLAUDE.md",
    ".mdkg/CLI_COMMAND_MATRIX.md",
    ".mdkg/README.md",
  ]) {
    const absolute = path.join(root, relativePath);
    if (!fs.existsSync(absolute)) {
      continue;
    }
    const content = fs.readFileSync(absolute, "utf8");
    assertNotIncludes(content, "mdkg init --llm", relativePath);
    assertNotIncludes(content, "--llm --agent", relativePath);
  }
}

function assertSpikeTemplate(root, label) {
  const templatePath = path.join(root, ".mdkg", "templates", "default", "spike.md");
  assertExists(templatePath);
  const content = fs.readFileSync(templatePath, "utf8");
  for (const expected of [
    "type: spike",
    "# Research Question",
    "# Search Plan",
    "# Follow-Up Nodes To Create",
    "# Skill Candidates",
    "# Evidence And Sources",
  ]) {
    assertIncludes(content, expected, `${label} spike template`);
  }
}

function assertManifestTemplate(root, label) {
  const templatePath = path.join(root, ".mdkg", "templates", "default", "manifest.md");
  assertExists(templatePath);
  const content = fs.readFileSync(templatePath, "utf8");
  for (const expected of [
    "type: manifest",
    "spec_kind: capability",
    "# Work Contracts",
  ]) {
    assertIncludes(content, expected, `${label} manifest template`);
  }
}

function exerciseRemovedFlags(binPath, tempRoot) {
  for (const removedFlag of ["--llm", "--agents", "--claude", "--omni"]) {
    const root = path.join(tempRoot, `removed-${removedFlag.slice(2)}`);
    initGit(root);
    const result = runExpectFailure(binPath, ["init", removedFlag], { cwd: root });
    assertIncludes(result.stderr, `\`mdkg init ${removedFlag}\` was removed`, `init ${removedFlag}`);
    assertIncludes(result.stderr, "use `mdkg init` for compact agent setup (default)", `init ${removedFlag}`);
    assertIncludes(result.stderr, "`mdkg init --graph-only` without agent setup", `init ${removedFlag}`);
    assertNotExists(path.join(root, ".mdkg"));
    assertNotExists(path.join(root, "AGENT_START.md"));
  }
}

function exerciseMirrorCollision(binPath, tempRoot) {
  const root = path.join(tempRoot, "mirror-collision");
  initGit(root);
  const collisionDir = path.join(root, ".agents", "skills", "select-work-and-ground-context");
  fs.mkdirSync(collisionDir, { recursive: true });
  fs.writeFileSync(path.join(collisionDir, "SKILL.md"), "# unmanaged\n", "utf8");

  const result = runExpectFailure(binPath, ["init", "--agent"], { cwd: root });
  assertIncludes(result.stderr, "already exists and is not mdkg-managed", "mirror collision");
  assertNotExists(path.join(root, ".mdkg"));
  assertNotExists(path.join(root, "AGENT_START.md"));
}

function exerciseBaseInit(binPath, tempRoot) {
  const root = path.join(tempRoot, "base-init");
  initGit(root);
  const init = mdkg(binPath, ["init", "--graph-only"], root);
  assertIncludes(init.stdout, "managed manifest:", "base init output");
  assertExists(path.join(root, ".mdkg", "config.json"));
  assertExists(path.join(root, ".mdkg", "README.md"));
  assertNotExists(path.join(root, "AGENT_START.md"));
  assertNotExists(path.join(root, "AGENTS.md"));
  for (const relative of ["CLAUDE.md", ".mdkg/AGENT_START.md", ".mdkg/CLI_COMMAND_MATRIX.md", ".mdkg/llms.txt", ".agents/skills", ".claude/skills", ".mdkg/work/events/events.jsonl"]) assertNotExists(path.join(root, relative));
  assertNotExists(path.join(root, ".mdkg", "skills"));
  assertSpikeTemplate(root, "base init");
  assertManifestTemplate(root, "base init");
  assertExists(path.join(root, ".mdkg", "templates", "default", "loop.md"));
  assertExists(path.join(root, ".mdkg", "templates", "loops", "security-audit.loop.md"));

  const manifest = assertManifestMatches(root);
  if (!manifest.files.some((file) => file.path === ".mdkg/templates/default/spike.md")) {
    throw new Error("base init manifest missing spike template");
  }
  if (!manifest.files.some((file) => file.path === ".mdkg/templates/default/manifest.md")) {
    throw new Error("base init manifest missing manifest template");
  }
  if (!manifest.files.some((file) => file.path === ".mdkg/templates/default/loop.md")) {
    throw new Error("base init manifest missing loop template");
  }
  if (!manifest.files.some((file) => file.path === ".mdkg/templates/loops/security-audit.loop.md")) {
    throw new Error("base init manifest missing seeded security audit loop");
  }
  if (manifest.files.some((file) => ["agent_doc", "startup_doc", "default_skill"].includes(file.category))) {
    throw new Error("base init manifest should not claim agent docs, startup docs, or default skills");
  }
  mdkg(binPath, ["doctor"], root);
  mdkg(binPath, ["validate"], root);
  assertSpecCount(binPath, root, 0, "base init");
  assertNoImmediateUpgrade(binPath, root);

  const task = parseJson(mdkg(binPath, ["new", "task", "Base Init Task", "--status", "todo", "--priority", "1", "--json"], root).stdout).node;
  mdkg(binPath, ["pack", task.id, "--dry-run"], root);
}

function exerciseOptionalSpecWorkTemplates(binPath, tempRoot) {
  const root = path.join(tempRoot, "optional-spec-work-templates");
  initGit(root);
  mdkg(binPath, ["init"], root);
  assertSpikeTemplate(root, "optional spec/work template init");
  assertManifestTemplate(root, "optional spec/work template init");
  assertSpecCount(binPath, root, 0, "optional template init before SPEC creation");

  const spec = parseJson(
    mdkg(binPath, ["new", "spec", "Optional Template Spec", "--id", "spec.optional-template", "--json"], root).stdout
  ).node;
  mdkg(binPath, ["spec", "show", spec.id, "--json"], root);
  mdkg(binPath, ["spec", "validate", spec.id, "--json"], root);

  mdkg(binPath, ["new", "work", "Optional Template Work", "--id", "work.optional-template", "--json"], root);
  mdkg(binPath, ["capability", "list", "--kind", "spec", "--json"], root);
  mdkg(binPath, ["capability", "list", "--kind", "work", "--json"], root);
  mdkg(binPath, ["validate"], root);
  assertNoImmediateUpgrade(binPath, root);
}

function exerciseDbInit(binPath, tempRoot) {
  const root = path.join(tempRoot, "db-init");
  initGit(root);
  mdkg(binPath, ["init", "--agent"], root);

  const first = parseJson(mdkg(binPath, ["db", "init", "--json"], root).stdout);
  if (first.action !== "db-init" || first.ok !== true) {
    throw new Error(`unexpected db init receipt: ${JSON.stringify(first, null, 2)}`);
  }
  if (first.enabled_before !== false || first.enabled_after !== true) {
    throw new Error(`db init should explicitly enable disabled project db config: ${JSON.stringify(first, null, 2)}`);
  }
  for (const relativePath of [
    ".mdkg/db/schema",
    ".mdkg/db/schema/migrations",
    ".mdkg/db/runtime",
    ".mdkg/db/state",
    ".mdkg/db/receipts",
    ".mdkg/db/project-db.json",
  ]) {
    assertExists(path.join(root, relativePath));
  }
  assertNotExists(path.join(root, ".mdkg", "db", "runtime", "project.sqlite"));
  const config = parseJson(fs.readFileSync(path.join(root, ".mdkg", "config.json"), "utf8"));
  if (config.db.enabled !== true) {
    throw new Error("db init should set config.db.enabled to true");
  }

  const second = parseJson(mdkg(binPath, ["db", "init", "--json"], root).stdout);
  if (second.created.length !== 0 || second.updated.length !== 0 || second.config_updated !== false) {
    throw new Error(`repeat db init should be idempotent: ${JSON.stringify(second, null, 2)}`);
  }
  const migrate = parseJson(mdkg(binPath, ["db", "migrate", "--json"], root).stdout);
  if (migrate.action !== "db-migrate" || migrate.ok !== true || migrate.applied_count !== 5) {
    throw new Error(`unexpected db migrate receipt: ${JSON.stringify(migrate, null, 2)}`);
  }
  assertExists(path.join(root, ".mdkg", "db", "runtime", "project.sqlite"));
  assertExists(path.join(root, ".mdkg", "db", "schema", "migrations", "001_mdkg_project_db_foundation.sql"));
  assertExists(path.join(root, ".mdkg", "db", "schema", "migrations", "002_mdkg_project_db_queue.sql"));
  assertExists(path.join(root, ".mdkg", "db", "schema", "migrations", "003_mdkg_project_db_events_receipts.sql"));
  assertExists(path.join(root, ".mdkg", "db", "schema", "migrations", "004_mdkg_project_db_writer_leases.sql"));
  assertExists(path.join(root, ".mdkg", "db", "schema", "migrations", "005_mdkg_project_db_queue_control.sql"));
  const repeatMigrate = parseJson(mdkg(binPath, ["db", "migrate", "--json"], root).stdout);
  if (repeatMigrate.applied_count !== 0 || repeatMigrate.skipped_count !== 5) {
    throw new Error(`repeat db migrate should be idempotent: ${JSON.stringify(repeatMigrate, null, 2)}`);
  }
  const verify = parseJson(mdkg(binPath, ["db", "verify", "--json"], root).stdout);
  if (verify.action !== "db-verify" || verify.ok !== true || verify.failure_count !== 0) {
    throw new Error(`unexpected db verify receipt: ${JSON.stringify(verify, null, 2)}`);
  }
  const stats = parseJson(mdkg(binPath, ["db", "stats", "--json"], root).stdout);
  if (stats.action !== "db-stats" || stats.ok !== true || stats.migration_count !== 5) {
    throw new Error(`unexpected db stats receipt: ${JSON.stringify(stats, null, 2)}`);
  }
  mdkg(binPath, ["validate"], root);
}

function exerciseAgentInit(binPath, tempRoot, explicitAgent = false) {
  const root = path.join(tempRoot, explicitAgent ? "explicit-agent-init" : "agent-init");
  initGit(root);
  const init = mdkg(binPath, explicitAgent ? ["init", "--agent"] : ["init"], root);
  assertIncludes(init.stdout, "agent bootstrap:", "agent init output");
  assertIncludes(init.stdout, "skill mirrors:", "agent init output");
  assertSpikeTemplate(root, "agent init");
  assertManifestTemplate(root, "agent init");
  for (const relativePath of [
    ".mdkg/AGENT_START.md",
    "AGENTS.md",
    "CLAUDE.md",
    ".mdkg/llms.txt",
    ".mdkg/CLI_COMMAND_MATRIX.md",
    ".mdkg/skills/author-mdkg-skill/SKILL.md",
    ".mdkg/skills/select-work-and-ground-context/SKILL.md",
    ".mdkg/skills/build-pack-and-execute-task/SKILL.md",
    ".mdkg/skills/verify-close-and-checkpoint/SKILL.md",
    ".agents/skills/author-mdkg-skill/SKILL.md",
    ".agents/skills/select-work-and-ground-context/SKILL.md",
    ".claude/skills/author-mdkg-skill/SKILL.md",
    ".claude/skills/select-work-and-ground-context/SKILL.md",
    ".mdkg/work/events/events.jsonl",
  ]) {
    assertExists(path.join(root, relativePath));
  }
  assertNoRemovedInitGuidance(root);
  for (const file of ["AGENT_START.md", "CLI_COMMAND_MATRIX.md", "README.md", "LICENSE", "llms.txt"]) assertNotExists(path.join(root, file));
  assertFocusedDiscovery(root, parseJson(mdkg(binPath, ["skill", "list", "--json"], root).stdout).items);
  const gitignore = fs.readFileSync(path.join(root, ".gitignore"), "utf8");
  assertIncludes(gitignore, ".mdkg/archive/**/source/", ".gitignore");
  assertIncludes(gitignore, ".mdkg/db/runtime/", ".gitignore");
  assertIncludes(
    fs.readFileSync(path.join(root, ".mdkg/skills/author-mdkg-skill/SKILL.md"), "utf8"),
    "customization.skill_mirrors.targets",
    "seeded author-mdkg-skill skill"
  );
  assertIncludes(
    fs.readFileSync(path.join(root, ".mdkg/skills/verify-close-and-checkpoint/SKILL.md"), "utf8"),
    "mdkg archive compress --all",
    "seeded verify-close-and-checkpoint skill"
  );
  assertIncludes(
    fs.readFileSync(path.join(root, ".agents/skills/verify-close-and-checkpoint/SKILL.md"), "utf8"),
    "mdkg bundle create --profile private",
    "mirrored verify-close-and-checkpoint skill"
  );
  assertIncludes(
    fs.readFileSync(path.join(root, ".mdkg", "AGENT_START.md"), "utf8"),
    "mdkg skill search",
    "seeded router focused discovery"
  );
  assertIncludes(
    fs.readFileSync(path.join(root, ".mdkg", "AGENT_START.md"), "utf8"),
    "mdkg help",
    "seeded router command discovery"
  );
  assertIncludes(
    fs.readFileSync(path.join(root, ".mdkg", "AGENT_START.md"), "utf8"),
    "Existing user instructions",
    "seeded router authority"
  );
  assertIncludes(
    fs.readFileSync(path.join(root, ".mdkg", "README.md"), "utf8"),
    "mdkg subgraph add",
    "seeded .mdkg README subgraph guidance"
  );
  assertIncludes(
    fs.readFileSync(path.join(root, ".mdkg", "README.md"), "utf8"),
    "mdkg manifest list --json",
    "seeded .mdkg README manifest guidance"
  );
  assertIncludes(
    fs.readFileSync(path.join(root, ".mdkg", "README.md"), "utf8"),
    "mdkg work trigger",
    "seeded .mdkg README work trigger guidance"
  );
  assertIncludes(
    fs.readFileSync(path.join(root, ".mdkg", "CLI_COMMAND_MATRIX.md"), "utf8"),
    "mdkg new manifest",
    "seeded CLI matrix manifest guidance"
  );
  assertIncludes(
    fs.readFileSync(path.join(root, ".mdkg", "CLI_COMMAND_MATRIX.md"), "utf8"),
    "work trigger --enqueue",
    "seeded CLI matrix queue bridge guidance"
  );
  assertIncludes(
    fs.readFileSync(path.join(root, ".mdkg", "CLI_COMMAND_MATRIX.md"), "utf8"),
    "linkage",
    "seeded CLI matrix linkage guidance"
  );

  const manifest = assertManifestMatches(root);
  if (!manifest.files.some((file) => file.path === ".mdkg/templates/default/spike.md")) {
    throw new Error("agent init manifest missing spike template");
  }
  if (!manifest.files.some((file) => file.path === ".mdkg/templates/default/manifest.md")) {
    throw new Error("agent init manifest missing manifest template");
  }
  if (!manifest.files.some((file) => file.path === ".mdkg/templates/default/loop.md")) {
    throw new Error("agent init manifest missing loop template");
  }
  if (!manifest.files.some((file) => file.path === ".mdkg/templates/loops/security-audit.loop.md")) {
    throw new Error("agent init manifest missing seeded security audit loop");
  }
  for (const category of ["agent_doc", "startup_doc", "default_skill"]) {
    if (!manifest.files.some((file) => file.category === category)) {
      throw new Error(`agent init manifest missing ${category}`);
    }
  }
  mdkg(binPath, ["doctor"], root);
  mdkg(binPath, ["validate"], root);
  assertNoImmediateUpgrade(binPath, root);

  const repeat = mdkg(binPath, ["init", "--agent"], root);
  assertIncludes(repeat.stdout, "skipped", "repeat init output");
  assertNoImmediateUpgrade(binPath, root);

  const task = parseJson(mdkg(binPath, ["new", "task", "Agent Init Task", "--status", "todo", "--priority", "1", "--json"], root).stdout).node;
  mdkg(binPath, ["pack", task.id], root);
}

function runSmoke() {
  let tempRoot;
  try {
    tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-init-smoke-"));
    const binPath = packAndInstall(tempRoot);
    const version = mdkg(binPath, ["--version"], tempRoot).stdout;
    if (version !== packageVersion) {
      throw new Error(`expected mdkg version ${packageVersion}, got ${version}`);
    }
    exerciseRemovedFlags(binPath, tempRoot);
    exerciseMirrorCollision(binPath, tempRoot);
    exerciseBaseInit(binPath, tempRoot);
    exerciseOptionalSpecWorkTemplates(binPath, tempRoot);
    exerciseDbInit(binPath, tempRoot);
    exerciseAgentInit(binPath, tempRoot);
    exerciseAgentInit(binPath, tempRoot, true);
    console.log(JSON.stringify({ action: "installed-customized-discovery-qualified", ...exerciseCustomizedDiscovery(binPath, tempRoot) }));
    console.log("init smoke passed");
    console.log(`version=${version}`);
  } finally {
    if (tempRoot && process.env.MDKG_KEEP_SMOKE_TMP !== "1") {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  }
}

if (require.main === module) runSmoke();
module.exports = { fileInventory, canonicalSkillInventories, assertFocusedDiscovery, exerciseCustomizedDiscovery,
  exerciseRemovedFlags, exerciseMirrorCollision, exerciseBaseInit,
  exerciseOptionalSpecWorkTemplates, exerciseDbInit, exerciseAgentInit };
