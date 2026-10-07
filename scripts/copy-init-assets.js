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

function writeInitManifest(seedRoot, packageVersion) {
  const { createInitManifest } = require(path.join(root, "dist", "commands", "init_manifest.js"));
  const manifest = createInitManifest(seedRoot, packageVersion);
  copyFileContent(JSON.stringify(manifest, null, 2) + "\n", path.join(seedRoot, "init-manifest.json"));
}

function copyFileContent(content, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content, "utf8");
}

const root = path.resolve(__dirname, "..");
const distRoot = path.join(root, "dist", "init");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const { assertPublicCoreSeed } = require("./public-core-seed.js");
const publicCoreRoot = path.join(root, "assets", "init", "core");
assertPublicCoreSeed({ publicRoot: publicCoreRoot });
require("./repository-skill-policy.js").assertRepositoryPublicSkills(
  path.join(root, "assets", "init", "skills", "default")
);

fs.rmSync(distRoot, { recursive: true, force: true });

copyFile(path.join(root, "assets", "init", "config.json"), path.join(distRoot, "config.json"));
copyDir(publicCoreRoot, path.join(distRoot, "core"));
copyDir(path.join(root, ".mdkg", "templates"), path.join(distRoot, "templates"));
copyFile(path.join(root, "assets", "init", "README.md"), path.join(distRoot, "README.md"));
copyFile(path.join(root, "assets", "init", "AGENTS.md"), path.join(distRoot, "AGENTS.md"));
copyFile(path.join(root, "assets", "init", "llms.txt"), path.join(distRoot, "llms.txt"));
copyFile(path.join(root, "assets", "init", "AGENT_START.md"), path.join(distRoot, "AGENT_START.md"));
copyFile(
  path.join(root, "assets", "init", "CLI_COMMAND_MATRIX.md"),
  path.join(distRoot, "CLI_COMMAND_MATRIX.md")
);
copyDir(path.join(root, "assets", "skills"), path.join(distRoot, "skills"));
copyFile(
  path.join(root, "assets", "init", "skills", "public-seed-policy.json"),
  path.join(distRoot, "skills", "public-seed-policy.json")
);
copyDir(
  path.join(root, "assets", "init", "skills", "default"),
  path.join(distRoot, "skills", "default")
);
copyDir(path.join(root, "assets", "init", "legacy"), path.join(distRoot, "legacy"));
const { assertPublicSkillProjection } = require(path.join(root, "dist", "core", "public_skill_projection.js"));
assertPublicSkillProjection({
  policyPath: path.join(root, "assets", "init", "skills", "public-seed-policy.json"),
  canonicalRoot: path.join(root, ".mdkg", "skills"),
  mirrorRoots: [
    path.join(root, ".agents", "skills"),
    path.join(root, ".claude", "skills"),
  ],
  publicRoot: path.join(root, "assets", "init", "skills", "default"),
  builtRoot: path.join(distRoot, "skills", "default"),
});
assertPublicCoreSeed({ publicRoot: publicCoreRoot, builtRoot: path.join(distRoot, "core") });
writeInitManifest(distRoot, pkg.version);
