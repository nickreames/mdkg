#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const tempBase = fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir();
const NPM_CMD = process.env.npm_execpath || (process.platform === "win32" ? "npm.cmd" : "npm");
const GIT_CMD = process.env.GIT || (process.platform === "win32" ? "git.exe" : "git");

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

function parseJson(output) {
  return JSON.parse(output);
}

function mdkg(binPath, args, cwd) {
  return run(binPath, args, { cwd }).stdout;
}

function packAndInstall(tempRoot) {
  const packDir = path.join(tempRoot, "pack");
  const prefix = path.join(tempRoot, "prefix");
  fs.mkdirSync(packDir, { recursive: true });
  fs.mkdirSync(prefix, { recursive: true });

  const packOutput = run(NPM_CMD, ["pack", "--silent", "--dry-run=false", "--pack-destination", packDir]).stdout;
  const tarball = packOutput
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .pop();
  assert(tarball, "npm pack did not return a tarball");
  const tarballPath = path.join(packDir, path.basename(tarball));
  assertExists(tarballPath);

  run(NPM_CMD, ["install", "-g", tarballPath, "--prefix", prefix, "--foreground-scripts"], {
    cwd: tempRoot,
    env: { npm_config_prefix: prefix },
  });
  const binPath = process.platform === "win32" ? path.join(prefix, "mdkg.cmd") : path.join(prefix, "bin", "mdkg");
  const packageRoot = path.join(prefix, "lib", "node_modules", "mdkg");
  assertExists(binPath);
  assertExists(path.join(packageRoot, "dist", "command-contract.json"));
  return { binPath, packageRoot, tarballPath };
}

function contractCommand(contract, key) {
  const command = contract.commands.find((item) => item.key === key);
  assert(command, `missing contract command ${key}`);
  return command;
}

function renderCommandReference(contract) {
  const publicCommands = contract.commands.filter((command) => command.visibility === "public");
  const lines = [
    "# mdkg Generated Command Reference",
    "",
    "<!-- generated-from: dist/command-contract.json -->",
    `<!-- contract-hash: ${contract.contract_hash} -->`,
    "",
    `Schema version: ${contract.schema_version}`,
    `Package version: ${contract.package_version}`,
    `Command count: ${publicCommands.length}`,
    "",
    "This file is generated from the mdkg-native command contract. Do not hand-maintain command metadata here.",
    "",
  ];

  for (const command of publicCommands) {
    lines.push(`## ${command.key}`);
    lines.push("");
    lines.push(command.summary);
    lines.push("");
    lines.push(`- Category: ${command.category}`);
    lines.push(`- Visibility: ${command.visibility}`);
    lines.push(`- Danger level: ${command.danger_level}`);
    lines.push(`- Dry run: ${JSON.stringify(command.dry_run)}`);
    lines.push(`- Side effects: ${command.side_effects.join(", ")}`);
    lines.push(`- Read paths: ${command.read_paths.join(", ") || "none"}`);
    lines.push(`- Write paths: ${command.write_paths.join(", ") || "none"}`);
    lines.push(`- Lock policy: ${command.lock_policy}`);
    lines.push(`- Atomic write policy: ${command.atomic_write_policy}`);
    lines.push(`- Receipts: ${command.receipts.join(", ") || "none"}`);
    lines.push("");
    lines.push("Usage:");
    lines.push("");
    lines.push("```text");
    for (const usage of command.usage) {
      lines.push(usage.trim());
    }
    lines.push("```");
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
}

function writeGeneratedReference(root, contract) {
  const outputPath = path.join(root, ".mdkg", "generated", "command-reference.md");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const content = renderCommandReference(contract);
  fs.writeFileSync(outputPath, content, "utf8");
  return { outputPath, content };
}

function assertGeneratedReference(content, contract) {
  assert(content.includes("generated-from: dist/command-contract.json"), "generated reference is missing contract source marker");
  assert(content.includes(`contract-hash: ${contract.contract_hash}`), "generated reference is missing contract hash");
  assert(content.includes("Do not hand-maintain command metadata here."), "generated reference is missing no-hand-maintain warning");
  for (const key of ["status", "doctor", "fix plan", "fix apply", "fix ids", "db", "subgraph sync", "workspace", "skill new"]) {
    assert(content.includes(`## ${key}`), `generated reference missing ${key}`);
  }
  assert(!content.includes(repoRoot), "generated reference leaked repo root path");
  assert(!content.includes(process.env.NPM_TOKEN || "never-match-token"), "generated reference leaked npm token");
}

function assertContractReady(contract) {
  assert(contract.schema_version === 1, "unexpected command contract schema");
  assert(contract.tool === "mdkg", "unexpected command contract tool");
  assert(/^[a-f0-9]{64}$/.test(contract.contract_hash), "invalid command contract hash");
  assert(contract.commands.length >= 80, "command contract is missing public commands");
  for (const key of ["global", "status", "doctor", "fix plan", "fix apply", "fix ids", "db", "subgraph sync", "work trigger"]) {
    contractCommand(contract, key);
  }
  for (const key of ["db", "subgraph sync", "workspace", "skill new"]) {
    const command = contractCommand(contract, key);
    assert(command.danger_level !== "read-only", `${key} must not be read-only`);
    assert(command.write_paths.length > 0, `${key} must document write paths`);
    assert(command.lock_policy !== "none-read-only", `${key} must document lock policy`);
  }
}

function executeDocumentedExamples(binPath, root) {
  const examples = [
    {
      label: "status json",
      args: ["status", "--json"],
      assertOutput: (stdout) => {
        const parsed = parseJson(stdout);
        assert(parsed.action === "status", "status json action mismatch");
      },
    },
    {
      label: "doctor strict json",
      args: ["doctor", "--strict", "--json"],
      assertOutput: (stdout) => {
        const parsed = parseJson(stdout);
        assert(parsed.action === "doctor", "doctor json action mismatch");
      },
    },
    {
      label: "fix plan json",
      args: ["fix", "plan", "--family", "all", "--json"],
      assertOutput: (stdout) => {
        const parsed = parseJson(stdout);
        assert(parsed.action === "fix.plan", "fix plan action mismatch");
        assert(parsed.summary.apply_supported === false, "fix plan apply boundary mismatch");
      },
    },
    {
      label: "spec list json",
      args: ["spec", "list", "--json"],
      assertOutput: (stdout) => {
        const parsed = parseJson(stdout);
        assert(parsed.count === 0, "fresh repo should have no SPEC records");
      },
    },
    {
      label: "db stats json",
      setup: () => {
        mdkg(binPath, ["db", "init", "--json"], root);
        mdkg(binPath, ["db", "migrate", "--json"], root);
        mdkg(binPath, ["db", "verify", "--json"], root);
      },
      args: ["db", "stats", "--json"],
      assertOutput: (stdout) => {
        const parsed = parseJson(stdout);
        assert(parsed.ok === true || parsed.command === "db.stats", "db stats json shape mismatch");
      },
    },
    {
      label: "queue stats json",
      setup: () => {
        mdkg(binPath, ["db", "queue", "create", "docs", "--json"], root);
      },
      args: ["db", "queue", "stats", "docs", "--json"],
      assertOutput: (stdout) => {
        const parsed = parseJson(stdout);
        assert(parsed.queue_name === "docs" || parsed.queue?.queue_name === "docs", "queue stats did not reference docs queue");
      },
    },
  ];

  for (const example of examples) {
    if (example.setup) {
      example.setup();
    }
    const stdout = mdkg(binPath, example.args, root);
    example.assertOutput(stdout);
  }
}

function main() {
  const tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-command-docs."));
  const { binPath, packageRoot, tarballPath } = packAndInstall(tempRoot);
  const root = path.join(tempRoot, "repo");
  fs.mkdirSync(root, { recursive: true });
  run(GIT_CMD, ["init", "-q"], { cwd: root });
  mdkg(binPath, ["init", "--agent"], root);
  mdkg(binPath, ["index"], root);

  const contractPath = path.join(packageRoot, "dist", "command-contract.json");
  const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"));
  assertContractReady(contract);
  const { outputPath, content } = writeGeneratedReference(root, contract);
  assertGeneratedReference(content, contract);
  assertExists(outputPath);
  executeDocumentedExamples(binPath, root);
  mdkg(binPath, ["index"], root);
  const validate = parseJson(mdkg(binPath, ["validate", "--json"], root));
  assert(validate.ok === true, "final validate was not ok");

  console.log(
    JSON.stringify(
      {
        ok: true,
        smoke: "command-docs",
        temp_root: tempRoot,
        tarball: tarballPath,
        generated_reference: outputPath,
        contract_hash: contract.contract_hash,
        command_count: contract.commands.length,
      },
      null,
      2
    )
  );
}

main();
