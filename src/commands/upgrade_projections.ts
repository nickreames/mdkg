import fs from "fs";
import path from "path";
import { Config } from "../core/config";
import { parseFrontmatter } from "../graph/frontmatter";
import { resolveSkillsRoot, SKILL_SLUG_RE } from "../graph/skills_indexer";
import { admitSkillMirrorTargets } from "./skill_mirror";
import { registryTemplate, renderSkillRegistryContent } from "./skill_support";
import { UpgradePlan, digest } from "./upgrade_transaction";
import type { UpgradeChange } from "./upgrade";

/** No blind mirror synchronization: enumerate exact writes, preserve unknown payloads. */
export function planUpgradeProjections(plan: UpgradePlan, config: Config, known: Map<string, Set<string>>): UpgradeChange[] {
  const changes: UpgradeChange[] = [];
  const root = plan.root;
  const mirrorTargets = admitSkillMirrorTargets(root, config);
  const canonical = path.relative(root, resolveSkillsRoot(root, config)).split(path.sep).join("/");
  const files = new Set<string>();
  function walk(dir: string): void {
    for (const name of plan.list(dir)) {
      const relative = `${dir}/${name}`;
      const stat = fs.lstatSync(path.join(root, relative));
      if (stat.isDirectory()) walk(relative);
      else { plan.read(relative); files.add(relative); } // Reject links, never follow them.
    }
  }
  walk(canonical);
  for (const relative of plan.operations.keys()) if (relative.startsWith(`${canonical}/`)) files.add(relative);
  const docs = [...files].filter(file => new RegExp(`^${canonical.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/[^/]+/SKILLS?\\.md$`).test(file) && plan.value(file));
  const skills = docs.map(file => {
    const parts = file.split("/");
    const slug = parts[parts.length - 2];
    if (!SKILL_SLUG_RE.test(slug)) throw new Error(`invalid skill slug: ${slug}`);
    const { frontmatter } = parseFrontmatter(plan.value(file)!.toString("utf8"), file);
    if (typeof frontmatter.name !== "string" || typeof frontmatter.description !== "string") throw new Error(`invalid skill metadata: ${file}`);
    return { slug, name: frontmatter.name, description: frontmatter.description,
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [], file };
  });
  if (new Set(skills.map(skill => skill.slug)).size !== skills.length) throw new Error("ambiguous canonical skill filenames");
  function write(relative: string, content: string | Buffer, category: string): void {
    plan.write(relative, content);
    if (plan.operations.has(relative)) changes.push({ path: relative, category, action: "sync", reason: "exact derived projection; no unknown files removed" });
  }
  const registry = `${canonical}/registry.md`;
  write(registry, renderSkillRegistryContent(plan.read(registry)?.toString("utf8") ?? registryTemplate(), skills), "skill_registry");
  for (const target of mirrorTargets) {
    const manifestPath = `${target}/.mdkg-managed.json`;
    const raw = plan.read(manifestPath);
    const parsed = raw ? JSON.parse(raw.toString("utf8")) : { managed_slugs: [] };
    if (!Array.isArray(parsed.managed_slugs) || parsed.managed_slugs.some((slug: unknown) => typeof slug !== "string" || !SKILL_SLUG_RE.test(slug))) {
      throw new Error(`invalid mirror ownership manifest: ${manifestPath}`);
    }
    const managed = new Set<string>(parsed.managed_slugs);
    plan.list(target);
    for (const skill of skills) {
      const directory = `${target}/${skill.slug}`;
      const exists = fs.existsSync(path.join(root, directory));
      plan.list(directory);
      if (exists && !managed.has(skill.slug)) {
        changes.push({ path: directory, category: "skill_mirror", action: "conflict", reason: "unowned native skill directory preserved" });
        continue;
      }
      const prefix = `${canonical}/${skill.slug}/`;
      for (const source of [...files].filter(file => file.startsWith(prefix)).sort()) {
        const suffix = source.slice(prefix.length);
        if (!["SKILL.md", "SKILLS.md"].includes(suffix) && !/^(references|assets|scripts)\//.test(suffix)) continue;
        const next = plan.value(source);
        if (!next) continue;
        const dest = `${directory}/${suffix === "SKILLS.md" ? "SKILL.md" : suffix}`;
        const before = plan.read(dest);
        const canonicalBefore = plan.read(source);
        if (before && !before.equals(next) && !(canonicalBefore && before.equals(canonicalBefore)) && !known.get(source)?.has(digest(before))) {
          changes.push({ path: dest, category: "skill_mirror", action: "conflict", reason: "modified native projection preserved; canonical/seed provenance does not match" });
          continue;
        }
        write(dest, next, "skill_mirror");
      }
      managed.add(skill.slug);
    }
    // Preserve stale ownership entries and extra files. Pruning is a distinct,
    // explicitly reviewed operation, not a bootstrap upgrade side effect.
    write(manifestPath, JSON.stringify({ managed_slugs: [...managed].sort() }, null, 2) + "\n", "skill_mirror");
  }
  return changes;
}
