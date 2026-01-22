import fs from "fs";
import path from "path";
import { NotFoundError } from "../util/errors";

export type InitCommandOptions = {
  root: string;
  force?: boolean;
  updateGitignore?: boolean;
  updateNpmignore?: boolean;
  updateDockerignore?: boolean;
  createAgents?: boolean;
  createClaude?: boolean;
  createLlm?: boolean;
  seedRoot?: string;
};

type CopyStats = {
  created: number;
  skipped: number;
};

const DEFAULT_SEED_SUBDIR = path.resolve(__dirname, "..", "init");

function listFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
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

function copySeedFile(src: string, dest: string, force: boolean, stats: CopyStats): void {
  if (fs.existsSync(dest) && !force) {
    stats.skipped += 1;
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  stats.created += 1;
}

function copySeedDir(srcDir: string, destDir: string, force: boolean, stats: CopyStats): void {
  if (!fs.existsSync(srcDir)) {
    return;
  }
  const files = listFiles(srcDir);
  for (const filePath of files) {
    const relPath = path.relative(srcDir, filePath);
    const destPath = path.join(destDir, relPath);
    copySeedFile(filePath, destPath, force, stats);
  }
}

function appendIgnoreEntries(filePath: string, entries: string[]): boolean {
  const raw = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
  const lines = raw.split(/\r?\n/);
  const existing = new Set(lines.map((line) => line.trim()).filter(Boolean));
  const additions = entries.filter((entry) => !existing.has(entry));
  if (additions.length === 0) {
    return false;
  }
  const suffix = raw.length === 0 || raw.endsWith("\n") ? "" : "\n";
  const updated = `${raw}${suffix}${additions.join("\n")}\n`;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, updated, "utf8");
  return true;
}

export function runInitCommand(options: InitCommandOptions): void {
  const root = path.resolve(options.root);
  const seedRoot = options.seedRoot ? path.resolve(options.seedRoot) : DEFAULT_SEED_SUBDIR;
  const createAgents = Boolean(options.createAgents || options.createLlm);
  const createClaude = Boolean(options.createClaude || options.createLlm);

  const seedConfig = path.join(seedRoot, "config.json");
  const seedCore = path.join(seedRoot, "core");
  const seedTemplates = path.join(seedRoot, "templates");
  const seedAgents = path.join(seedRoot, "AGENTS.md");
  const seedClaude = path.join(seedRoot, "CLAUDE.md");

  if (!fs.existsSync(seedConfig) || !fs.existsSync(seedCore) || !fs.existsSync(seedTemplates)) {
    throw new NotFoundError(
      `init assets not found at ${seedRoot} (try reinstalling mdkg)`
    );
  }
  if (createAgents && !fs.existsSync(seedAgents)) {
    throw new NotFoundError(`init assets missing AGENTS.md at ${seedRoot}`);
  }
  if (createClaude && !fs.existsSync(seedClaude)) {
    throw new NotFoundError(`init assets missing CLAUDE.md at ${seedRoot}`);
  }

  const mdkgDir = path.join(root, ".mdkg");
  fs.mkdirSync(mdkgDir, { recursive: true });
  fs.mkdirSync(path.join(mdkgDir, "work"), { recursive: true });
  fs.mkdirSync(path.join(mdkgDir, "design"), { recursive: true });

  const stats: CopyStats = { created: 0, skipped: 0 };
  copySeedFile(seedConfig, path.join(mdkgDir, "config.json"), Boolean(options.force), stats);
  copySeedDir(seedCore, path.join(mdkgDir, "core"), Boolean(options.force), stats);
  copySeedDir(seedTemplates, path.join(mdkgDir, "templates"), Boolean(options.force), stats);
  if (createAgents) {
    copySeedFile(seedAgents, path.join(root, "AGENTS.md"), Boolean(options.force), stats);
  }
  if (createClaude) {
    copySeedFile(seedClaude, path.join(root, "CLAUDE.md"), Boolean(options.force), stats);
  }

  if (options.updateGitignore) {
    appendIgnoreEntries(path.join(root, ".gitignore"), [".mdkg/index/", ".mdkg/pack/"]);
  }
  if (options.updateNpmignore) {
    appendIgnoreEntries(path.join(root, ".npmignore"), [".mdkg/", ".mdkg/index/", ".mdkg/pack/"]);
  }
  if (options.updateDockerignore) {
    appendIgnoreEntries(path.join(root, ".dockerignore"), [".mdkg/"]);
  }

  console.log(
    `mdkg init complete: ${stats.created} file(s) created, ${stats.skipped} skipped`
  );
  console.log("next:");
  console.log("  mdkg index");
  console.log('  mdkg new task "..." --status todo --priority 1');
  console.log("  mdkg list --status todo");
  console.log("  mdkg pack <id> --verbose");
  console.log("  mdkg validate");
}
