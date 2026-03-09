import fs from "fs";
import path from "path";
import { Config } from "../core/config";
import {
  buildSkillsIndex,
  resolveSkillsRoot,
  SkillIndexEntry,
  SkillsIndex,
} from "../graph/skills_indexer";

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

function renderRegistryLines(skillsIndex: SkillsIndex): string[] {
  const skills = Object.values(skillsIndex.skills).sort((a, b) => a.slug.localeCompare(b.slug));
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

export function ensureSkillsRegistry(root: string, config: Config): string {
  const skillsRoot = resolveSkillsRoot(root, config);
  const registryPath = path.join(skillsRoot, "registry.md");
  if (!fs.existsSync(registryPath)) {
    fs.mkdirSync(path.dirname(registryPath), { recursive: true });
    fs.writeFileSync(registryPath, registryTemplate(), "utf8");
  }
  return registryPath;
}

export function refreshSkillsRegistry(root: string, config: Config): void {
  const registryPath = ensureSkillsRegistry(root, config);
  const raw = fs.readFileSync(registryPath, "utf8");
  const index = buildSkillsIndex(root, config);
  const updated = replaceManagedSection(raw, renderRegistryLines(index));
  fs.writeFileSync(registryPath, updated, "utf8");
}

export function formatSkillCard(skill: SkillIndexEntry): string {
  return [skill.qid, "skill", "-/-", skill.name, skill.path].join(" | ");
}
