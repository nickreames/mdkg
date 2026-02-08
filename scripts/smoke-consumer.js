#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const NPM_CMD = process.platform === "win32" ? "npm.cmd" : "npm";
const NPX_CMD = process.platform === "win32" ? "npx.cmd" : "npx";
const GIT_CMD = process.platform === "win32" ? "git.exe" : "git";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: "utf8",
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
    const packOutput = run(NPM_CMD, ["pack", "--silent"], { cwd: repoRoot });
    const tarballName = packOutput
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .pop();
    if (!tarballName) {
      throw new Error("unable to determine npm pack output tarball");
    }

    tarballPath = path.resolve(repoRoot, tarballName);
    assertExists(tarballPath);

    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-consumer-"));
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
        "--llm",
        "--update-gitignore",
        "--update-npmignore",
      ],
      { cwd: repoDir }
    );

    assertExists(path.join(repoDir, ".mdkg", "config.json"));
    assertExists(path.join(repoDir, ".mdkg", "README.md"));
    assertExists(path.join(repoDir, "AGENTS.md"));
    assertExists(path.join(repoDir, "CLAUDE.md"));

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
