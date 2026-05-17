#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const binPath = path.join(repoRoot, "dist", "cli.js");
const tempBase = fs.existsSync("/private/tmp") ? "/private/tmp" : os.tmpdir();

function run(args, cwd) {
  const result = spawnSync(process.execPath, [binPath, ...args], {
    cwd,
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status !== 0) {
    throw new Error(
      [
        `command failed: mdkg ${args.join(" ")}`,
        `cwd: ${cwd}`,
        `exit: ${result.status}`,
        `stdout:\n${result.stdout}`,
        `stderr:\n${result.stderr}`,
      ].join("\n")
    );
  }
  return result.stdout.trim();
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function writeFile(filePath, contents) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents, "utf8");
}

function parseNode(output) {
  return JSON.parse(output).node;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function main() {
  let tempRoot;
  try {
    tempRoot = fs.mkdtempSync(path.join(tempBase, "mdkg-capabilities-"));
    const root = path.join(tempRoot, "root");
    const child = path.join(root, "child-repo");
    fs.mkdirSync(root, { recursive: true });
    fs.mkdirSync(child, { recursive: true });

    run(["init", "--agent"], root);
    run(["init"], child);
    run(["workspace", "add", "child", "child-repo", "--visibility", "public", "--json"], root);

    writeFile(
      path.join(child, ".mdkg", "skills", "child-capability", "SKILL.md"),
      [
        "---",
        "name: child capability",
        "description: use when routing child repo work",
        "tags: [stage:execute, child]",
        "version: 0.1.0",
        "authors: [mdkg]",
        "links: []",
        "---",
        "# Goal",
        "",
        "Route work to the child repo.",
      ].join("\n")
    );

    parseNode(run(["new", "spec", "Child Worker", "--id", "agent.child-worker", "--ws", "child", "--json"], root));
    parseNode(run(["new", "work", "Child Work", "--id", "work.child-process", "--ws", "child", "--json"], root));
    parseNode(run(["new", "edd", "Capability Cache Design", "--json"], root));

    const indexOutput = run(["index"], root);
    assert(indexOutput.includes("capabilities index written"), "index did not report capabilities cache");

    const capabilitiesPath = path.join(root, ".mdkg", "index", "capabilities.json");
    const capabilities = readJson(capabilitiesPath);
    const kinds = new Set(capabilities.records.map((record) => record.kind));
    for (const kind of ["skill", "spec", "work", "core", "design"]) {
      assert(kinds.has(kind), `capabilities cache missing kind ${kind}`);
    }
    assert(
      !capabilities.records.some((record) => record.id.startsWith("task-")),
      "capabilities cache should not include normal task nodes"
    );
    assert(
      capabilities.records.some(
        (record) => record.kind === "skill" && record.slug === "child-capability" && record.visibility === "public"
      ),
      "capabilities cache missing public child skill"
    );

    const publicCapabilities = JSON.parse(run(["capability", "list", "--visibility", "public", "--json"], root));
    assert(
      publicCapabilities.items.some((record) => record.id === "work.child-process"),
      "public capability list missing child WORK.md"
    );

    const search = JSON.parse(run(["capability", "search", "child routing", "--kind", "skill", "--json"], root));
    assert(
      search.items.some((record) => record.slug === "child-capability"),
      "capability search missing child skill"
    );

    fs.rmSync(capabilitiesPath, { force: true });
    JSON.parse(run(["capability", "show", "child-capability", "--json"], root));
    assert(fs.existsSync(capabilitiesPath), "capability show did not restore missing cache");

    run(["doctor", "--json"], root);
    run(["validate"], root);

    console.log("capability cache smoke passed");
  } finally {
    if (tempRoot && fs.existsSync(tempRoot)) {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  }
}

try {
  main();
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(message);
  process.exit(1);
}
