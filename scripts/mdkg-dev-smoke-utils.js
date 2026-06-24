const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const tempBase = fs.existsSync("/private/tmp") ? "/private/tmp" : require("node:os").tmpdir();
const NPM_CMD = process.env.npm_execpath || (process.platform === "win32" ? "npm.cmd" : "npm");
const NODE_CMD = process.execPath;

function commandEnv(extra = {}) {
  const npmCache = process.env.NPM_CONFIG_CACHE || path.join(tempBase, "mdkg-npm-cache");
  fs.mkdirSync(npmCache, { recursive: true });
  return {
    ...process.env,
    NPM_CONFIG_CACHE: npmCache,
    npm_config_cache: npmCache,
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
      [
        `command failed: ${command} ${args.join(" ")}`,
        `cwd: ${options.cwd || repoRoot}`,
        `exit: ${result.status}`,
        `stdout:\n${result.stdout}`,
        `stderr:\n${result.stderr}`,
      ].join("\n")
    );
  }
  return {
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
  };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertExists(filePath) {
  assert(fs.existsSync(filePath), `expected path to exist: ${filePath}`);
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function parseJson(output) {
  return JSON.parse(output);
}

function ensureSiteDeps() {
  const astroPackage = path.join(repoRoot, "mdkg-dev", "node_modules", "astro", "package.json");
  if (fs.existsSync(astroPackage)) {
    return;
  }
  run(NPM_CMD, ["ci", "--prefix", "mdkg-dev", "--ignore-scripts"]);
}

function buildSite() {
  ensureSiteDeps();
  run(NPM_CMD, ["--prefix", "mdkg-dev", "run", "build"]);
}

function walkFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    const normalized = fullPath.split(path.sep).join("/");
    if (normalized.includes("/.mdkg/index/") || normalized.includes("/.mdkg/pack/")) {
      continue;
    }
    if (entry.isDirectory()) {
      out.push(...walkFiles(fullPath));
    } else if (entry.isFile()) {
      out.push(fullPath);
    }
  }
  return out;
}

function assertNoHighRiskMarkers(paths) {
  const patterns = [
    { label: "local user path", pattern: /\/Users\/nick\// },
    { label: "private key", pattern: /-----BEGIN (RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/ },
    { label: "aws access key", pattern: /\bAKIA[0-9A-Z]{16}\b/ },
    { label: "npm token", pattern: /\bnpm_[A-Za-z0-9]{20,}\b/ },
    { label: "openai-like secret key", pattern: /\bsk-[A-Za-z0-9_-]{24,}\b/ },
    { label: "raw prompt marker", pattern: /\bRAW_PROMPT\s*[:=]/i },
    { label: "raw provider payload marker", pattern: /\bRAW_(MODEL|PROVIDER)_PAYLOAD\s*[:=]/i },
  ];
  for (const filePath of paths.flatMap((item) => (fs.statSync(item).isDirectory() ? walkFiles(item) : [item]))) {
    const stat = fs.statSync(filePath);
    if (stat.size > 2_000_000) {
      continue;
    }
    let content;
    try {
      content = readText(filePath);
    } catch {
      continue;
    }
    for (const { label, pattern } of patterns) {
      assert(!pattern.test(content), `${label} marker found in ${path.relative(repoRoot, filePath)}`);
    }
  }
}

function localMarkdownLinks(markdown) {
  const links = [];
  const linkPattern = /\[[^\]]+\]\(([^)]+)\)/g;
  let match;
  while ((match = linkPattern.exec(markdown)) !== null) {
    const target = match[1].trim();
    if (
      !target ||
      target.startsWith("#") ||
      target.startsWith("http://") ||
      target.startsWith("https://") ||
      target.startsWith("/") ||
      target.startsWith("mailto:") ||
      target.startsWith("archive://") ||
      target.startsWith("file:")
    ) {
      continue;
    }
    links.push(target.split("#")[0]);
  }
  return links;
}

function assertMarkdownLinks(rootDir) {
  for (const filePath of walkFiles(rootDir).filter((file) => file.endsWith(".md"))) {
    const dir = path.dirname(filePath);
    for (const link of localMarkdownLinks(readText(filePath))) {
      assertExists(path.resolve(dir, link));
    }
  }
}

function mdkg(args, cwd = repoRoot) {
  return run(NODE_CMD, [path.join(repoRoot, "dist", "cli.js"), ...args], { cwd });
}

module.exports = {
  NPM_CMD,
  NODE_CMD,
  assert,
  assertExists,
  assertMarkdownLinks,
  assertNoHighRiskMarkers,
  buildSite,
  mdkg,
  parseJson,
  readText,
  repoRoot,
  run,
  walkFiles,
};
