#!/usr/bin/env node

const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const packageVersion = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8")).version;
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
    combined: `${result.stdout}${result.stderr}`.trim(),
  };
}

function assertExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`expected path to exist: ${filePath}`);
  }
}

function assertIncludes(value, expected, label) {
  if (!value.includes(expected)) {
    throw new Error(`${label} missing expected text: ${expected}`);
  }
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function parseJson(output) {
  return JSON.parse(output);
}

function mdkg(binPath, args, cwd) {
  return run(binPath, args, { cwd });
}

function initGit(root) {
  fs.mkdirSync(root, { recursive: true });
  run(GIT_CMD, ["init", "-q"], { cwd: root });
}

function updateFrontmatter(filePath, replacements) {
  const content = fs.readFileSync(filePath, "utf8");
  const next = content.replace(/^---\n([\s\S]*?)\n---/, (_match, rawFrontmatter) => {
    const seen = new Set();
    const lines = rawFrontmatter.split(/\r?\n/).map((line) => {
      for (const [key, value] of Object.entries(replacements)) {
        if (line.startsWith(`${key}:`)) {
          seen.add(key);
          return `${key}: ${value}`;
        }
      }
      return line;
    });
    for (const [key, value] of Object.entries(replacements)) {
      if (!seen.has(key)) {
        lines.push(`${key}: ${value}`);
      }
    }
    return `---\n${lines.join("\n")}\n---`;
  });
  fs.writeFileSync(filePath, next, "utf8");
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
  return { binPath, tarballPath };
}

function exerciseArchiveAndWork(binPath, tempRoot) {
  const root = path.join(tempRoot, "archive-work-repo");
  initGit(root);
  mdkg(binPath, ["init", "--agent"], root);

  const gitignore = fs.readFileSync(path.join(root, ".gitignore"), "utf8");
  assertIncludes(gitignore, ".mdkg/archive/**/source/", ".gitignore");

  const inputsDir = path.join(root, "inputs");
  fs.mkdirSync(inputsDir, { recursive: true });
  const inputPath = path.join(inputsDir, "key_input_doc.txt");
  fs.writeFileSync(inputPath, "prompt: generate an image of a clean workbench\n", "utf8");

  const archiveAdd = parseJson(
    mdkg(
      binPath,
      [
        "archive",
        "add",
        "inputs/key_input_doc.txt",
        "--id",
        "archive.key-input-doc",
        "--kind",
        "source",
        "--title",
        "Key Input Doc",
        "--refs",
        "https://example.invalid/source",
        "--json",
      ],
      root
    ).stdout
  );
  assertIncludes(archiveAdd.archive.archive_uri, "archive://archive.key-input-doc", "archive add");
  assertExists(path.join(root, ".mdkg", "archive", "archive.key-input-doc", "key_input_doc.txt.md"));
  assertExists(path.join(root, ".mdkg", "archive", "archive.key-input-doc", "key_input_doc.txt.zip"));
  assertExists(path.join(root, ".mdkg", "archive", "archive.key-input-doc", "source", "key_input_doc.txt"));
  const firstVerify = parseJson(mdkg(binPath, ["archive", "verify", "archive://archive.key-input-doc", "--json"], root).stdout);
  if (!firstVerify.ok || firstVerify.results[0].raw_present !== true) {
    throw new Error(`archive verify with raw file failed: ${JSON.stringify(firstVerify, null, 2)}`);
  }

  mdkg(binPath, ["archive", "compress", "archive.key-input-doc", "--json"], root);
  fs.rmSync(path.join(root, ".mdkg", "archive", "archive.key-input-doc", "source", "key_input_doc.txt"));
  const secondVerify = parseJson(mdkg(binPath, ["archive", "verify", "archive://archive.key-input-doc", "--json"], root).stdout);
  if (!secondVerify.ok || secondVerify.results[0].raw_present !== false) {
    throw new Error(`archive verify without raw file failed: ${JSON.stringify(secondVerify, null, 2)}`);
  }

  const spec = parseJson(mdkg(binPath, ["new", "spec", "Image Worker", "--id", "agent.image-worker", "--json"], root).stdout).node;
  const work = parseJson(
    mdkg(
      binPath,
      [
        "work",
        "contract",
        "new",
        "Generate Image",
        "--id",
        "work.generate-image",
        "--agent-id",
        "agent.image-worker",
        "--kind",
        "image_generation",
        "--inputs",
        "prompt:text:required",
        "--outputs",
        "image_url:url:required",
        "--required-capabilities",
        "model.image.generate",
        "--pricing-model",
        "included",
        "--json",
      ],
      root
    ).stdout
  ).node;
  const workContractRef = `${path.basename(path.dirname(work.path))}/WORK.md`;
  updateFrontmatter(path.join(root, spec.path), {
    work_contracts: `[${workContractRef}]`,
    relates: "[work.generate-image]",
  });

  const order = parseJson(
    mdkg(
      binPath,
      [
        "work",
        "order",
        "new",
        "Generate Image Order",
        "--id",
        "order.generate-image-1",
        "--work-id",
        "work.generate-image",
        "--requester",
        "user://example",
        "--request-ref",
        "request://generate-image-1",
        "--input-refs",
        "archive://archive.key-input-doc",
        "--requested-outputs",
        "image_url:url:required",
        "--constraint-refs",
        "https://example.invalid/constraints",
        "--json",
      ],
      root
    ).stdout
  ).node;

  const supplementalPath = path.join(inputsDir, "supplemental_prompt.txt");
  fs.writeFileSync(supplementalPath, "style: product photography\n", "utf8");
  const artifactOrder = parseJson(
    mdkg(
      binPath,
      [
        "work",
        "artifact",
        "add",
        `root:${order.id}`,
        "inputs/supplemental_prompt.txt",
        "--id",
        "archive.supplemental-prompt",
        "--kind",
        "source",
        "--json",
      ],
      root
    ).stdout
  );
  if (artifactOrder.archive.archive_uri !== "archive://archive.supplemental-prompt") {
    throw new Error("work artifact add did not return the supplemental archive");
  }
  const orderUpdate = parseJson(
    mdkg(binPath, ["work", "order", "update", `root:${order.id}`, "--status", "completed", "--json"], root).stdout
  );
  if (orderUpdate.node.qid !== `root:${order.id}`) {
    throw new Error(`work order update returned unexpected qid: ${orderUpdate.node.qid}`);
  }

  const outputPath = path.join(inputsDir, "image_output.txt");
  fs.writeFileSync(outputPath, "artifact://image-output-placeholder\n", "utf8");
  const outputHash = `sha256:${sha256File(outputPath)}`;
  const receipt = parseJson(
    mdkg(
      binPath,
      [
        "work",
        "receipt",
        "new",
        "Generate Image Receipt",
        "--id",
        "receipt.generate-image-1",
        "--work-order-id",
        order.id,
        "--outcome",
        "success",
        "--receipt-status",
        "recorded",
        "--cost-ref",
        "cost://redacted/generate-image-1",
        "--artifacts",
        "artifact://image-output-placeholder",
        "--proof-refs",
        "https://example.invalid/proof",
        "--attestation-refs",
        "attestation://example",
        "--input-hashes",
        outputHash,
        "--output-hashes",
        outputHash,
        "--json",
      ],
      root
    ).stdout
  ).node;

  mdkg(
    binPath,
    [
      "work",
      "artifact",
      "add",
      `root:${receipt.id}`,
      "inputs/image_output.txt",
      "--id",
      "archive.image-output",
      "--kind",
      "artifact",
      "--json",
    ],
    root
  );
  mdkg(binPath, ["work", "receipt", "update", `root:${receipt.id}`, "--receipt-status", "verified", "--json"], root);
  mdkg(binPath, ["work", "receipt", "update", `root:${receipt.id}`, "--receipt-status", "superseded", "--json"], root);

  const archives = parseJson(mdkg(binPath, ["archive", "list", "--json"], root).stdout);
  if (archives.count !== 3) {
    throw new Error(`expected 3 archive sidecars, got ${archives.count}`);
  }
  parseJson(mdkg(binPath, ["archive", "show", "archive://archive.image-output", "--json"], root).stdout);

  mdkg(binPath, ["validate"], root);
  mdkg(binPath, ["index"], root);
  const archiveSearch = parseJson(mdkg(binPath, ["search", "Key Input", "--type", "archive", "--json"], root).stdout);
  if (!archiveSearch.items.some((item) => item.id === "archive.key-input-doc")) {
    throw new Error("archive search did not include archive.key-input-doc");
  }
  const shownReceipt = parseJson(mdkg(binPath, ["show", receipt.id, "--json"], root).stdout);
  if (shownReceipt.item.attributes.receipt_status !== "superseded") {
    throw new Error(`expected superseded receipt status, got ${shownReceipt.item.attributes.receipt_status}`);
  }
  const shownOrder = parseJson(mdkg(binPath, ["show", order.id, "--json"], root).stdout);
  if (shownOrder.item.attributes.order_status !== "completed") {
    throw new Error(`expected completed order status, got ${shownOrder.item.attributes.order_status}`);
  }
  const packDryRun = mdkg(binPath, ["pack", receipt.id, "--dry-run", "--stats"], root).stdout;
  assertIncludes(packDryRun, "archive.image-output", "receipt pack dry-run");
  const verifyAll = parseJson(mdkg(binPath, ["archive", "verify", "--json"], root).stdout);
  if (!verifyAll.ok || verifyAll.count !== 3) {
    throw new Error(`archive verify all failed: ${JSON.stringify(verifyAll, null, 2)}`);
  }
  const doctor = parseJson(mdkg(binPath, ["doctor", "--json"], root).stdout);
  if (!doctor.ok) {
    throw new Error(`doctor failed: ${JSON.stringify(doctor, null, 2)}`);
  }
}

function runSmoke() {
  let tempRoot;
  try {
    tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-archive-work-"));
    const { binPath, tarballPath } = packAndInstall(tempRoot);
    const version = mdkg(binPath, ["--version"], tempRoot).stdout;
    if (version !== packageVersion) {
      throw new Error(`expected mdkg version ${packageVersion}, got ${version}`);
    }
    exerciseArchiveAndWork(binPath, tempRoot);
    console.log("archive/work smoke passed");
    console.log(`version=${version}`);
    console.log(`tarball=${path.basename(tarballPath)}`);
  } finally {
    if (tempRoot && process.env.MDKG_KEEP_SMOKE_TMP !== "1") {
      fs.rmSync(tempRoot, { recursive: true, force: true });
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
