const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { assertDirectoryChain, readRegularJsonFile } = require("./qualification-output");

const exampleRoots = [
  "examples/demo-agentic-coding",
  "examples/template-mdkg-dev",
  "examples/website-demo-template",
  "examples/demo-runs/demo-001",
];
const platformRoot = "presentations/ai-native-sdlc-demo/artifacts/demo-platform";
const inputs = [
  "package.json",
  "dist",
  "scripts/bootstrap-website-demo-run.js",
  `${platformRoot}/operator-materialization-manifest.json`,
  `${platformRoot}/source-release-manifest.json`,
  `${platformRoot}/run-binding.schema.json`,
  `${platformRoot}/timed-run-contract.json`,
  ...exampleRoots.flatMap((root) => root === "examples/website-demo-template"
    ? [`${root}/.mdkg`]
    : [".mdkg", ".agents/skills", ".claude/skills"].map((part) => `${root}/${part}`)),
];

function inputInventory(sourceRoot) {
  const rows = [];
  const expectedHashes = new Map();
  const visit = (relative) => {
    // Runtime build only, not compiled tests, application payloads or installed
    // dependency trees. Graph-only examples need no app/site directory copy.
    if (relative === "dist/tests") return;
    const absolute = path.join(sourceRoot, relative), stat = fs.lstatSync(absolute);
    if (stat.isSymbolicLink() || (!stat.isDirectory() && !stat.isFile())) throw new Error(`unsupported demo fixture input: ${relative}`);
    if (stat.isDirectory()) {
      for (const name of fs.readdirSync(absolute).sort()) visit(`${relative}/${name}`);
    } else {
      if (stat.nlink !== 1) throw new Error(`demo fixture input must be independent: ${relative}`);
      const sha256 = crypto.createHash("sha256").update(fs.readFileSync(absolute)).digest("hex");
      if (expectedHashes.has(relative) && sha256 !== expectedHashes.get(relative)) throw new Error(`demo operator input hash mismatch: ${relative}`);
      rows.push({ path: relative, bytes: stat.size, mode: stat.mode & 0o777, sha256 });
    }
  };
  assertDirectoryChain(sourceRoot);
  const template = "examples/website-demo-template";
  const manifest = readRegularJsonFile(path.join(sourceRoot, platformRoot, "operator-materialization-manifest.json"));
  if (manifest.schema_version !== "1.0" || manifest.kind !== "website-demo-operator-materialization-manifest" ||
      manifest.source_root !== template || !Array.isArray(manifest.entries) || !manifest.entries.length || manifest.entries.length > 1000) {
    throw new Error("invalid demo operator input manifest");
  }
  for (const entry of manifest.entries) {
    const relative = entry.source_path;
    if (typeof relative !== "string" || relative.includes("\\") || relative.includes(":") ||
        relative.split("/").some((part) => !part || [".", "..", ".git", ".mdkg", "node_modules"].includes(part.toLowerCase()) || /^\.env(?:\.|$)/i.test(part)) ||
        !/^[a-f0-9]{64}$/.test(entry.sha256) || entry.required !== true) {
      throw new Error("invalid demo operator source path or identity");
    }
    const input = `${template}/${relative}`;
    if (expectedHashes.has(input)) throw new Error(`duplicate demo operator input: ${relative}`);
    expectedHashes.set(input, entry.sha256);
  }
  for (const input of [...inputs, ...expectedHashes.keys()]) {
    assertDirectoryChain(path.dirname(path.join(sourceRoot, input)));
    if (expectedHashes.has(input) && !fs.lstatSync(path.join(sourceRoot, input)).isFile()) throw new Error(`demo operator input must be a regular file: ${input}`);
    visit(input);
  }
  return rows;
}

function prepareDemoFixture(fixture, sourceRoot) {
  fixture.assertOwned();
  const rows = inputInventory(sourceRoot), repoRoot = fixture.resolve("repository");
  fs.mkdirSync(repoRoot);
  for (const row of rows) {
    fixture.assertOwned();
    const target = path.join(repoRoot, row.path);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(sourceRoot, row.path), target, fs.constants.COPYFILE_EXCL);
    fs.chmodSync(target, row.mode);
    if (crypto.createHash("sha256").update(fs.readFileSync(target)).digest("hex") !== row.sha256) throw new Error(`demo fixture copy changed: ${row.path}`);
  }
  // The CLI requires a root config even for path-qualified graph fork. Reuse
  // the released, DB-disabled template config; never copy the private root graph.
  const rootConfig = path.join(repoRoot, ".mdkg/config.json");
  fs.mkdirSync(path.dirname(rootConfig));
  fs.copyFileSync(path.join(repoRoot, "examples/website-demo-template/.mdkg/config.json"), rootConfig, fs.constants.COPYFILE_EXCL);
  const assertSourceUnchanged = () => {
    if (JSON.stringify(inputInventory(sourceRoot)) !== JSON.stringify(rows)) throw new Error("demo fixture source inventory changed during qualification");
  };
  assertSourceUnchanged();
  return {
    repoRoot,
    copiedRoots: Object.fromEntries(exampleRoots.map((root) => [root, path.join(repoRoot, root)])),
    inputIdentity: {
      sha256: crypto.createHash("sha256").update(JSON.stringify(rows)).digest("hex"),
      file_count: rows.length,
      bytes: rows.reduce((total, row) => total + row.bytes, 0),
    },
    assertSourceUnchanged,
  };
}

module.exports = { exampleRoots, inputInventory, prepareDemoFixture };
