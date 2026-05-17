import crypto from "crypto";
import fs from "fs";
import path from "path";

export const INIT_MANIFEST_FILE = "init-manifest.json";
export const INIT_MANIFEST_SCHEMA_VERSION = 1;

export type InitManifestFileCategory =
  | "config"
  | "mdkg_doc"
  | "core"
  | "template"
  | "agent_doc"
  | "startup_doc"
  | "default_skill";

export type InitManifestFile = {
  path: string;
  category: InitManifestFileCategory;
  sha256: string;
};

export type InitManifest = {
  schema_version: number;
  tool: "mdkg";
  mdkg_version: string;
  files: InitManifestFile[];
};

const STARTUP_DOCS = ["llms.txt", "AGENT_START.md", "CLI_COMMAND_MATRIX.md"];
const AGENT_DOCS = ["AGENTS.md", "CLAUDE.md"];

export type CreateInitManifestOptions = {
  includeAgentDocs?: boolean;
  includeStartupDocs?: boolean;
  includeDefaultSkills?: boolean;
};

function toPosixPath(value: string): string {
  return value.split(path.sep).join("/");
}

function sha256Buffer(value: Buffer): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function sha256File(filePath: string): string {
  return sha256Buffer(fs.readFileSync(filePath));
}

function listFiles(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  const files: string[] = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

function addSeedFile(
  files: InitManifestFile[],
  seedRoot: string,
  seedRelativePath: string,
  targetPath: string,
  category: InitManifestFileCategory
): void {
  const sourcePath = path.join(seedRoot, seedRelativePath);
  if (!fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isFile()) {
    return;
  }
  files.push({
    path: toPosixPath(targetPath),
    category,
    sha256: sha256File(sourcePath),
  });
}

function addSeedDir(
  files: InitManifestFile[],
  seedRoot: string,
  seedRelativeDir: string,
  targetDir: string,
  category: InitManifestFileCategory
): void {
  const sourceDir = path.join(seedRoot, seedRelativeDir);
  for (const sourcePath of listFiles(sourceDir)) {
    const relPath = toPosixPath(path.relative(sourceDir, sourcePath));
    files.push({
      path: path.posix.join(targetDir, relPath),
      category,
      sha256: sha256File(sourcePath),
    });
  }
}

export function seedSourcePath(seedRoot: string, file: InitManifestFile): string {
  if (file.path === ".mdkg/config.json") {
    return path.join(seedRoot, "config.json");
  }
  if (file.path === ".mdkg/README.md") {
    return path.join(seedRoot, "README.md");
  }
  if (file.path.startsWith(".mdkg/core/")) {
    return path.join(seedRoot, "core", file.path.slice(".mdkg/core/".length));
  }
  if (file.path.startsWith(".mdkg/templates/")) {
    return path.join(seedRoot, "templates", file.path.slice(".mdkg/templates/".length));
  }
  if (file.path.startsWith(".mdkg/skills/")) {
    return path.join(seedRoot, "skills", "default", file.path.slice(".mdkg/skills/".length));
  }
  return path.join(seedRoot, file.path);
}

export function createInitManifest(
  seedRoot: string,
  mdkgVersion: string,
  options: CreateInitManifestOptions = {
    includeAgentDocs: true,
    includeStartupDocs: true,
    includeDefaultSkills: true,
  }
): InitManifest {
  const includeAgentDocs = Boolean(options.includeAgentDocs);
  const includeStartupDocs = Boolean(options.includeStartupDocs);
  const includeDefaultSkills = Boolean(options.includeDefaultSkills);
  const files: InitManifestFile[] = [];
  addSeedFile(files, seedRoot, "config.json", ".mdkg/config.json", "config");
  addSeedFile(files, seedRoot, "README.md", ".mdkg/README.md", "mdkg_doc");
  addSeedDir(files, seedRoot, "core", ".mdkg/core", "core");
  addSeedDir(files, seedRoot, "templates", ".mdkg/templates", "template");
  if (includeAgentDocs) {
    for (const doc of AGENT_DOCS) {
      addSeedFile(files, seedRoot, doc, doc, "agent_doc");
    }
  }
  if (includeStartupDocs) {
    for (const doc of STARTUP_DOCS) {
      addSeedFile(files, seedRoot, doc, doc, "startup_doc");
    }
  }
  if (includeDefaultSkills) {
    addSeedDir(files, seedRoot, path.join("skills", "default"), ".mdkg/skills", "default_skill");
  }

  return {
    schema_version: INIT_MANIFEST_SCHEMA_VERSION,
    tool: "mdkg",
    mdkg_version: mdkgVersion,
    files: files.sort((a, b) => a.path.localeCompare(b.path)),
  };
}

export function writeInitManifest(filePath: string, manifest: InitManifest): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

export function readInitManifest(filePath: string): InitManifest | undefined {
  if (!fs.existsSync(filePath)) {
    return undefined;
  }
  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")) as InitManifest;
  if (parsed.schema_version !== INIT_MANIFEST_SCHEMA_VERSION || parsed.tool !== "mdkg" || !Array.isArray(parsed.files)) {
    throw new Error(`${filePath}: invalid mdkg init manifest`);
  }
  return parsed;
}

export function loadLegacyInitManifests(seedRoot: string): InitManifest[] {
  const legacyDir = path.join(seedRoot, "legacy");
  if (!fs.existsSync(legacyDir)) {
    return [];
  }
  return fs
    .readdirSync(legacyDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((entry) => readInitManifest(path.join(legacyDir, entry.name)))
    .filter((manifest): manifest is InitManifest => manifest !== undefined);
}
