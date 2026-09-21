import fs from "fs";
import path from "path";
import { Config } from "../core/config";
import {
  buildSkillsIndex,
  buildSkillIndexEntryForWorkspace,
  resolveSkillsRoot,
  SkillIndexEntry,
} from "../graph/skills_indexer";
import { atomicReplaceContainedFile, readContainedFile, readContainedFileIfPresent } from "../core/filesystem_authority";

export const SKILL_REGISTRY_START = "<!-- mdkg:skill-registry:start -->";
export const SKILL_REGISTRY_END = "<!-- mdkg:skill-registry:end -->";

type SkillTemplateData = {
  name: string;
  description: string;
  tags: string[];
  authors: string[];
  links: string[];
};

function renderYamlList(values: string[]): string {
  return `[${values.join(", ")}]`;
}

function renderOptionalLine(key: string, values: string[]): string {
  if (values.length === 0) {
    return "";
  }
  return `${key}: ${renderYamlList(values)}\n`;
}

export function resolveSkillTemplatePath(): string {
  return path.resolve(__dirname, "..", "init", "skills", "SKILL.md.example");
}

export function loadSkillTemplate(): string {
  const templatePath = resolveSkillTemplatePath();
  if (!fs.existsSync(templatePath)) {
    throw new Error(`missing skill template artifact: ${templatePath}`);
  }
  return fs.readFileSync(templatePath, "utf8");
}

export function renderSkillTemplate(data: SkillTemplateData): string {
  const template = loadSkillTemplate();
  return template
    .replace("{{name}}", data.name)
    .replace("{{description}}", data.description)
    .replace("{{tags_block}}", renderOptionalLine("tags", data.tags))
    .replace("{{authors_block}}", renderOptionalLine("authors", data.authors))
    .replace("{{links_block}}", renderOptionalLine("links", data.links));
}

export function registryTemplate(): string {
  return [
    "# Skills Registry",
    "",
    "This directory stores Agent Skills packages used by mdkg tooling and orchestrators.",
    "",
    "Use `mdkg skill new <slug> \"<name>\" --description \"...\"` to scaffold a new skill from the built-in Anthropic-aligned template.",
    "Use `mdkg skill sync` to mirror canonical skills into configured `.mdkg/config.json` targets; defaults are `.agents/skills/` and `.claude/skills/`.",
    "Use `mdkg help <command>` for focused command discovery; compact guidance lives under `.mdkg`, with legacy root entrypoints preserved when applicable.",
    "",
    "## Conventions",
    "",
    "- One folder per skill slug.",
    "- Use `SKILL.md` as the canonical skill entrypoint.",
    "- Keep procedures deterministic and avoid embedding secrets.",
    "- Create `scripts/` only when deterministic execution cannot be expressed safely as instructions.",
    "",
    "## Registered Skills",
    "",
    `${SKILL_REGISTRY_START}`,
    "_No skills registered yet. Run `mdkg skill new` to add one._",
    `${SKILL_REGISTRY_END}`,
    "",
  ].join("\n");
}

function renderRegistryLines(entries: Array<Pick<SkillIndexEntry, "slug" | "name" | "description" | "tags">>): string[] {
  const skills = [...entries].sort((a, b) => a.slug.localeCompare(b.slug));
  if (skills.length === 0) {
    return ["_No skills registered yet. Run `mdkg skill new` to add one._"];
  }
  const lines: string[] = [];
  for (const skill of skills) {
    lines.push(`- \`${skill.slug}\``);
    lines.push(`  - name: \`${skill.name}\``);
    const stageTag = skill.tags.find((tag) => tag.startsWith("stage:"));
    if (stageTag) {
      lines.push(`  - stage: \`${stageTag}\``);
    }
    const writerTag = skill.tags.find((tag) => tag.startsWith("writer:"));
    if (writerTag) {
      lines.push(`  - writer role: \`${writerTag}\``);
    }
    lines.push(`  - description: ${skill.description}`);
  }
  return lines;
}

function replaceManagedSection(raw: string, lines: string[]): string {
  const managed = `${SKILL_REGISTRY_START}\n${lines.join("\n")}\n${SKILL_REGISTRY_END}`;
  if (raw.includes(SKILL_REGISTRY_START) && raw.includes(SKILL_REGISTRY_END)) {
    const pattern = new RegExp(
      `${SKILL_REGISTRY_START}[\\s\\S]*?${SKILL_REGISTRY_END}`,
      "m"
    );
    const replaced = raw.replace(pattern, managed);
    return replaced.endsWith("\n") ? replaced : `${replaced}\n`;
  }

  const trimmed = raw.trimEnd();
  const prefix = trimmed.length > 0 ? `${trimmed}\n\n## Registered Skills\n\n` : "## Registered Skills\n\n";
  return `${prefix}${managed}\n`;
}

function registryInput(root: string, config: Config) {
  return { root, relativePath: path.relative(root, path.join(resolveSkillsRoot(root, config), "registry.md")),
    pathSyntax: "native" as const, maxBytes: config.index.limits.max_file_bytes };
}

// Observation only: missing is allowed, but linked/special/oversized registries
// must be refused before their preserving renderer can copy untrusted bytes.
export function readSkillsRegistry(root: string, config: Config): string | null {
  return readContainedFileIfPresent(registryInput(root, config));
}

export function ensureSkillsRegistry(root: string, config: Config): string {
  const input = registryInput(root, config);
  if (readSkillsRegistry(root, config) === null) {
    const content = registryTemplate();
    assertRegistryOutputBudget(config, content);
    atomicReplaceContainedFile(input, content);
  }
  return path.resolve(root, input.relativePath);
}

function assertRegistryOutputBudget(config: Config, content: string): void {
  if (Buffer.byteLength(content, "utf8") > config.index.limits.max_file_bytes) {
    throw new Error(`skill registry output exceeds byte limit: ${config.index.limits.max_file_bytes}`);
  }
}

// Predict the actual parsed projection, including force replacement, without
// publishing a skill or registry. The same renderer/budget is used at refresh.
export function prepareSkillsRegistry(root: string, config: Config,
  pending?: { slug: string; filePath: string; content: string }): string {
  const raw = readSkillsRegistry(root, config) ?? registryTemplate();
  const index = buildSkillsIndex(root, config, pending ? {
    readDocument: filePath => filePath === pending.filePath ? pending.content
      : readContainedFile({ root, relativePath: path.relative(root, filePath), pathSyntax: "native" }),
  } : {});
  if (pending) {
    index.skills[pending.slug] = buildSkillIndexEntryForWorkspace(root, "root", pending.slug,
      pending.filePath, () => pending.content);
  }
  const updated = renderSkillRegistryContent(raw, Object.values(index.skills));
  assertRegistryOutputBudget(config, updated);
  return updated;
}

export function refreshSkillsRegistry(root: string, config: Config): void {
  // Re-admit at use even when the calling command already preflighted it.
  const updated = prepareSkillsRegistry(root, config);
  atomicReplaceContainedFile(registryInput(root, config), updated);
}

export function renderSkillRegistryContent(raw: string, skills: Array<Pick<SkillIndexEntry, "slug" | "name" | "description" | "tags">>): string {
  return replaceManagedSection(raw, renderRegistryLines(skills));
}

export function formatSkillCard(skill: SkillIndexEntry): string {
  return [skill.qid, "skill", "-/-", skill.name, skill.path].join(" | ");
}
