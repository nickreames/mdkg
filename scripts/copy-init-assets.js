const fs = require("fs");
const path = require("path");

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

const root = path.resolve(__dirname, "..");
const distRoot = path.join(root, "dist", "init");

copyFile(path.join(root, ".mdkg", "config.json"), path.join(distRoot, "config.json"));
copyDir(path.join(root, ".mdkg", "core"), path.join(distRoot, "core"));
copyDir(path.join(root, ".mdkg", "templates"), path.join(distRoot, "templates"));
copyFile(path.join(root, "assets", "init", "AGENTS.md"), path.join(distRoot, "AGENTS.md"));
copyFile(path.join(root, "assets", "init", "CLAUDE.md"), path.join(distRoot, "CLAUDE.md"));
