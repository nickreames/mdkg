const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    return;
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      copyFile(srcPath, destPath);
    }
  }
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function addManifestFile(files, seedRoot, seedRelPath, targetPath, category) {
  const sourcePath = path.join(seedRoot, seedRelPath);
  if (fs.existsSync(sourcePath) && fs.statSync(sourcePath).isFile()) {
    files.push({ path: targetPath, category, sha256: sha256(sourcePath) });
  }
}

function addManifestDir(files, seedRoot, seedRelDir, targetDir, category) {
  const sourceDir = path.join(seedRoot, seedRelDir);
  for (const sourcePath of listFiles(sourceDir)) {
    const relPath = path.relative(sourceDir, sourcePath).split(path.sep).join("/");
    files.push({ path: path.posix.join(targetDir, relPath), category, sha256: sha256(sourcePath) });
  }
}

function writeInitManifest(seedRoot, packageVersion) {
  const files = [];
  addManifestFile(files, seedRoot, "config.json", ".mdkg/config.json", "config");
  addManifestFile(files, seedRoot, "README.md", ".mdkg/README.md", "mdkg_doc");
  addManifestDir(files, seedRoot, "core", ".mdkg/core", "core");
  addManifestDir(files, seedRoot, "templates", ".mdkg/templates", "template");
  addManifestFile(files, seedRoot, "AGENTS.md", "AGENTS.md", "agent_doc");
  addManifestFile(files, seedRoot, "CLAUDE.md", "CLAUDE.md", "agent_doc");
  addManifestFile(files, seedRoot, "llms.txt", "llms.txt", "startup_doc");
  addManifestFile(files, seedRoot, "AGENT_START.md", "AGENT_START.md", "startup_doc");
  addManifestFile(files, seedRoot, "CLI_COMMAND_MATRIX.md", "CLI_COMMAND_MATRIX.md", "startup_doc");
  addManifestDir(files, seedRoot, path.join("skills", "default"), ".mdkg/skills", "default_skill");
  const manifest = {
    schema_version: 1,
    tool: "mdkg",
    mdkg_version: packageVersion,
    files: files.sort((a, b) => a.path.localeCompare(b.path)),
  };
  copyFileContent(JSON.stringify(manifest, null, 2) + "\n", path.join(seedRoot, "init-manifest.json"));
}

function copyFileContent(content, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content, "utf8");
}

const root = path.resolve(__dirname, "..");
const distRoot = path.join(root, "dist", "init");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

fs.rmSync(distRoot, { recursive: true, force: true });

copyFile(path.join(root, "assets", "init", "config.json"), path.join(distRoot, "config.json"));
copyDir(path.join(root, ".mdkg", "core"), path.join(distRoot, "core"));
copyDir(path.join(root, ".mdkg", "templates"), path.join(distRoot, "templates"));
copyFile(path.join(root, "assets", "init", "README.md"), path.join(distRoot, "README.md"));
copyFile(path.join(root, "assets", "init", "AGENTS.md"), path.join(distRoot, "AGENTS.md"));
copyFile(path.join(root, "assets", "init", "CLAUDE.md"), path.join(distRoot, "CLAUDE.md"));
copyFile(path.join(root, "assets", "init", "llms.txt"), path.join(distRoot, "llms.txt"));
copyFile(path.join(root, "assets", "init", "AGENT_START.md"), path.join(distRoot, "AGENT_START.md"));
copyFile(
  path.join(root, "assets", "init", "CLI_COMMAND_MATRIX.md"),
  path.join(distRoot, "CLI_COMMAND_MATRIX.md")
);
copyDir(path.join(root, "assets", "skills"), path.join(distRoot, "skills"));
copyDir(
  path.join(root, "assets", "init", "skills", "default"),
  path.join(distRoot, "skills", "default")
);
copyDir(path.join(root, "assets", "init", "legacy"), path.join(distRoot, "legacy"));
writeInitManifest(distRoot, pkg.version);
