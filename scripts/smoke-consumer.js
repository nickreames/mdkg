#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const NPM_CMD = process.platform === "win32" ? "npm.cmd" : "npm";
const NPX_CMD = process.platform === "win32" ? "npx.cmd" : "npx";
const GIT_CMD = process.platform === "win32" ? "git.exe" : "git";
const TEMP_BASE = fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir();
const DEFAULT_NPM_CACHE = process.env.NPM_CONFIG_CACHE || path.join(TEMP_BASE, "mdkg-npm-cache");

function run(command, args, options = {}) {
  fs.mkdirSync(DEFAULT_NPM_CACHE, { recursive: true });
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      NPM_CONFIG_CACHE: DEFAULT_NPM_CACHE,
      npm_config_cache: DEFAULT_NPM_CACHE,
      NPM_CONFIG_DRY_RUN: "false",
      npm_config_dry_run: "false",
    },
    stdio: "pipe",
  });
  if (result.status !== 0) {
    throw new Error(
      [
        `command failed: ${command} ${args.join(" ")}`,
        `exit: ${result.status}`,
        `stdout:\n${result.stdout}`,
        `stderr:\n${result.stderr}`,
      ].join("\n")
    );
  }
  return result.stdout.trim();
}

function assertExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`expected file not found: ${filePath}`);
  }
}

function removePath(targetPath) {
  if (!targetPath || !fs.existsSync(targetPath)) {
    return;
  }
  fs.rmSync(targetPath, { recursive: true, force: true });
}

function runSmoke() {
  const repoRoot = path.resolve(__dirname, "..");
  let tarballPath;
  let tempRoot;

  try {
    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-consumer-"));
    const packDir = path.join(tempRoot, "pack");
    fs.mkdirSync(packDir, { recursive: true });
    const packOutput = run(
      NPM_CMD,
      ["pack", "--silent", "--dry-run=false", "--pack-destination", packDir],
      { cwd: repoRoot }
    );
    const tarballName = packOutput
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .pop();
    if (!tarballName) {
      throw new Error("unable to determine npm pack output tarball");
    }

    tarballPath = path.resolve(packDir, path.basename(tarballName));
    assertExists(tarballPath);

    const repoDir = path.join(tempRoot, "demo-repo");
    fs.mkdirSync(repoDir, { recursive: true });
    run(GIT_CMD, ["init", "-q"], { cwd: repoDir });

    const version = run(
      NPX_CMD,
      ["--yes", "--package", tarballPath, "mdkg", "--version"],
      { cwd: tempRoot }
    );
    if (!/^\d+\.\d+\.\d+([-.].+)?$/.test(version)) {
      throw new Error(`unexpected version output: ${version}`);
    }

    const profiles = run(
      NPX_CMD,
      ["--yes", "--package", tarballPath, "mdkg", "pack", "--list-profiles"],
      { cwd: tempRoot }
    );
    if (!profiles.includes("standard") || !profiles.includes("concise") || !profiles.includes("headers")) {
      throw new Error("pack --list-profiles output missing expected profiles");
    }

    run(
      NPX_CMD,
      [
        "--yes",
        "--package",
        tarballPath,
        "mdkg",
        "init",
        "--agent",
        "--update-gitignore",
        "--update-npmignore",
      ],
      { cwd: repoDir }
    );

    assertExists(path.join(repoDir, ".mdkg", "config.json"));
    assertExists(path.join(repoDir, ".mdkg", "README.md"));
    assertExists(path.join(repoDir, "AGENTS.md"));
    assertExists(path.join(repoDir, "CLAUDE.md"));
    assertExists(path.join(repoDir, ".mdkg", "skills", "select-work-and-ground-context", "SKILL.md"));
    assertExists(path.join(repoDir, ".agents", "skills", "select-work-and-ground-context", "SKILL.md"));
    if (!fs.readFileSync(path.join(repoDir, ".gitignore"), "utf8").includes(".mdkg/archive/**/source/")) {
      throw new Error(".gitignore missing archive raw source ignore entry");
    }

    run(NPX_CMD, ["--yes", "--package", tarballPath, "mdkg", "index"], { cwd: repoDir });
    const doctorJson = run(
      NPX_CMD,
      ["--yes", "--package", tarballPath, "mdkg", "doctor", "--json"],
      { cwd: repoDir }
    );
    const doctor = JSON.parse(doctorJson);
    if (!doctor.ok) {
      throw new Error("doctor --json reported failure");
    }

    console.log("consumer smoke passed");
    console.log(`version=${version}`);
    console.log(`tarball=${path.basename(tarballPath)}`);
  } finally {
    removePath(tempRoot);
    if (tarballPath && fs.existsSync(tarballPath)) {
      fs.unlinkSync(tarballPath);
    }
  }
}

try {
  runSmoke();
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
}
