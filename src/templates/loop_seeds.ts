import path from "path";
import { Config } from "../core/config";
import { containedPathExists, forEachContainedDirectoryEntry, readContainedFileIfPresent } from "../core/filesystem_authority";
import { localTemplateLimits } from "./limits";

export type LoopSeedSource = { slug: string; path: string; content: string };

function seedDirectory(root: string, config: Config): string {
  return path.relative(root, path.resolve(root, config.templates.root_path, "loops"));
}

// Callers own semantic parsing: optional new-loop suggestions historically
// accept title-only frontmatter, whereas executable loop templates require type.
function readSeed(root: string, relativePath: string, maxBytes: number): LoopSeedSource | undefined {
  const content = readContainedFileIfPresent({ root, relativePath, pathSyntax: "native", maxBytes });
  if (content === null) return undefined;
  return {
    slug: path.basename(relativePath).replace(/\.loop\.md$/, ""),
    path: relativePath.split(path.sep).join("/"),
    content,
  };
}

export function loadLoopSeed(root: string, config: Config, slug: string): LoopSeedSource | undefined {
  const limits = localTemplateLimits(config);
  return readSeed(root, path.join(seedDirectory(root, config), `${slug}.loop.md`), Math.min(limits.max_file_bytes, limits.max_total_bytes));
}

export function loadLoopSeedCatalog(root: string, config: Config): LoopSeedSource[] {
  const dir = seedDirectory(root, config), limits = localTemplateLimits(config);
  if (!containedPathExists({ root, relativePath: dir, pathSyntax: "native" })) return [];
  let entries = 0;
  const paths: string[] = [];
  // Preserve the catalog's linked-tree refusal, but stream the inspection under
  // finite discovery/depth budgets. Only direct .loop.md children are seeds.
  const visit = (relativePath: string, depth: number) => {
    if (depth > limits.max_depth) throw new Error("loop template directory depth exceeds index.limits.max_depth");
    forEachContainedDirectoryEntry({ root, relativePath, pathSyntax: "native" }, (entry) => {
      if (++entries > limits.max_files * 10) throw new Error("loop template discovery entry budget exceeded (10 * index.limits.max_files)");
      const child = path.join(relativePath, entry.name);
      if (entry.isSymbolicLink()) containedPathExists({ root, relativePath: child, pathSyntax: "native" });
      if (depth === 0 && entry.name.endsWith(".loop.md")) {
        if (paths.length >= limits.max_files) throw new Error("loop template count exceeds index.limits.max_files");
        paths.push(child);
      } else if (entry.isDirectory()) visit(child, depth + 1);
    });
  };
  visit(dir, 0);
  let totalBytes = 0;
  return paths.sort().map((relativePath) => {
    const source = readSeed(root, relativePath, Math.min(limits.max_file_bytes, limits.max_total_bytes - totalBytes));
    if (!source) throw new Error(`loop template disappeared during discovery: ${relativePath}`);
    totalBytes += Buffer.byteLength(source.content, "utf8");
    return source;
  });
}
