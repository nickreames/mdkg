#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

function readPackageVersion() {
  try {
    const pkgPath = path.resolve(__dirname, "..", "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    return typeof pkg.version === "string" ? pkg.version : "unknown";
  } catch {
    return "unknown";
  }
}

function npmCommand(platform = process.platform) {
  return platform === "win32" ? "npm.cmd" : "npm";
}

function npmPrefixGlobal(env = process.env, platform = process.platform, spawn = spawnSync) {
  if (env.npm_config_prefix) {
    return env.npm_config_prefix;
  }
  const result = spawn(npmCommand(platform), ["prefix", "-g"], {
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status !== 0) {
    return undefined;
  }
  const prefix = String(result.stdout || "").trim();
  return prefix || undefined;
}

function globalBinFromPrefix(prefix, platform = process.platform) {
  if (!prefix) {
    return undefined;
  }
  return platform === "win32" ? prefix : path.join(prefix, "bin");
}

function pathIncludesDir(dir, env = process.env, platform = process.platform) {
  if (!dir) {
    return false;
  }
  const currentPath = env.PATH || "";
  return currentPath
    .split(path.delimiter)
    .filter(Boolean)
    .some((entry) => path.resolve(entry) === path.resolve(dir));
}

function buildPostinstallMessage(env = process.env, platform = process.platform, spawn = spawnSync) {
  const version = readPackageVersion();
  const lines = [
    `mdkg ${version} installed.`,
    "",
    "Start here:",
    "  mdkg --help",
  ];

  const prefix = npmPrefixGlobal(env, platform, spawn);
  const globalBin = globalBinFromPrefix(prefix, platform);
  if (platform !== "win32" && globalBin && !pathIncludesDir(globalBin, env, platform)) {
    lines.push(
      "",
      "If your shell cannot find mdkg, add npm's global bin directory to PATH:",
      "",
      "# zsh",
      `echo 'export PATH="${globalBin}:$PATH"' >> ~/.zshrc`,
      "",
      "# bash",
      `echo 'export PATH="${globalBin}:$PATH"' >> ~/.bashrc`
    );
  }

  return lines.join("\n");
}

if (require.main === module) {
  console.log(buildPostinstallMessage());
}

module.exports = {
  buildPostinstallMessage,
  globalBinFromPrefix,
  pathIncludesDir,
};
