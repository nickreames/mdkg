#!/usr/bin/env node

const fs = require("node:fs");
const crypto = require("node:crypto");
const path = require("node:path");
const assert = require("node:assert/strict");
const { runInstalledSmoke } = require("./qualification-smoke");
const { withVerifiedArtifact } = require("./qualification-artifact");

function assertExists(filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`expected file not found: ${filePath}`);
}

function extractVersion(output) {
  return output.split(/\r?\n/).map(line => line.trim())
    .find(line => /^\d+\.\d+\.\d+([-.].+)?$/.test(line));
}

function runSmoke(env = process.env) {
  const repoRoot = path.resolve(__dirname, "..");
  let commands;
  return runInstalledSmoke({
    prefix: "mdkg-consumer-",
    env,
    prepare(tempRoot, ownedCommands) {
      commands = ownedCommands;
      const packDir = path.join(tempRoot, "pack");
      fs.mkdirSync(packDir);
      const packOutput = commands.npm(
        ["pack", repoRoot, "--silent", "--dry-run=false", "--pack-destination", packDir],
        { cwd: tempRoot },
      ).stdout;
      const tarballName = packOutput.split(/\r?\n/).map(line => line.trim()).filter(Boolean).pop();
      if (!tarballName) throw new Error("unable to determine npm pack output tarball");
      const tarballPath = path.join(packDir, path.basename(tarballName));
      assertExists(tarballPath);
      // npm exec installs lazily. No consumer may run until artifact admission.
      return { tarballPath, install() { return { tarballPath }; } };
    },
    exercise(tempRoot, { tarballPath }) {
      // Native npm exec is npx's package-execution workflow, not a global install.
      // All cache/configuration writes and every lazy install are fixture-owned.
      const expectedHash = crypto.createHash("sha256").update(fs.readFileSync(tarballPath)).digest("hex");
      const consumptions = [];
      const runtimeLog = path.join(tempRoot, "exec-runtimes.jsonl");
      const runtimeProbe = path.join(tempRoot, "exec-runtime.cjs");
      fs.writeFileSync(runtimeProbe, 'const fs=require("node:fs"),path=require("node:path");' +
        'const file=process.argv[1]&&fs.realpathSync(process.argv[1]);' +
        'if(file&&file.endsWith(path.join("mdkg","dist","cli.js")))fs.appendFileSync(' +
        JSON.stringify(runtimeLog) + ',JSON.stringify({node:process.execPath,version:process.version})+"\\n");');
      const mdkg = (args, cwd) => {
        const consumed = withVerifiedArtifact(tarballPath, expectedHash, () => commands.npm(
          ["exec", "--yes", "--offline", "--package", tarballPath, "--", "mdkg", ...args],
          { cwd, env: {
            PATH: path.dirname(process.execPath) + path.delimiter + (commands.environment.PATH || ""),
            NODE_OPTIONS: "--require=" + JSON.stringify(runtimeProbe),
          } },
        ));
        const runtimes = fs.readFileSync(runtimeLog, "utf8").trim().split("\n").map(line => JSON.parse(line));
        assert.equal(runtimes.length, consumptions.length + 1, "one installed mdkg process must run per execution");
        const runtime = runtimes.at(-1);
        assert.equal(fs.realpathSync(runtime.node), fs.realpathSync(process.execPath));
        assert.equal(runtime.version, process.version);
        consumptions.push({ command: args, ...consumed.verification, exit: consumed.result.status, runtime });
        return consumed.result.stdout.trim();
      };
      const repoDir = path.join(tempRoot, "demo-repo");
      fs.mkdirSync(repoDir);
      commands.git(["init", "-q"], repoDir);

      const version = mdkg(["--version"], tempRoot);
      const parsedVersion = extractVersion(version);
      if (!parsedVersion) throw new Error(`unexpected version output: ${version}`);
      const profiles = mdkg(["pack", "--list-profiles"], tempRoot);
      if (!profiles.includes("standard") || !profiles.includes("concise") || !profiles.includes("headers")) {
        throw new Error("pack --list-profiles output missing expected profiles");
      }

      mdkg(["init", "--agent", "--update-gitignore", "--update-npmignore"], repoDir);
      assertExists(path.join(repoDir, ".mdkg", "config.json"));
      assertExists(path.join(repoDir, ".mdkg", "README.md"));
      assertExists(path.join(repoDir, "AGENTS.md"));
      if (fs.existsSync(path.join(repoDir, "CLAUDE.md"))) throw new Error("fresh init generated legacy CLAUDE.md");
      assertExists(path.join(repoDir, ".mdkg", "skills", "select-work-and-ground-context", "SKILL.md"));
      assertExists(path.join(repoDir, ".agents", "skills", "select-work-and-ground-context", "SKILL.md"));
      assertExists(path.join(repoDir, ".claude", "skills", "select-work-and-ground-context", "SKILL.md"));
      if (!fs.readFileSync(path.join(repoDir, ".gitignore"), "utf8").includes(".mdkg/archive/**/source/")) {
        throw new Error(".gitignore missing archive raw source ignore entry");
      }

      mdkg(["index"], repoDir);
      const doctor = JSON.parse(mdkg(["doctor", "--json"], repoDir));
      if (!doctor.ok) throw new Error("doctor --json reported failure");
      return { ok: true, smoke: "consumer", version: parsedVersion,
        execution: "native-npm-exec", offline: true, profiles: ["standard", "concise", "headers"],
        compact_agent_init: true, native_skill_projection: true, doctor: true, consumptions };
    },
  });
}

if (require.main === module) {
  try { console.log(JSON.stringify(runSmoke())); }
  catch (error) { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; }
}

module.exports = { runSmoke, extractVersion };
