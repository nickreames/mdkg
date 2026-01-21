import fs from "fs";
import path from "path";
import { Config } from "../core/config";
import { FrontmatterValue, formatFrontmatter, parseFrontmatter } from "../graph/frontmatter";
import { NotFoundError } from "../util/errors";

export type LoadedTemplate = {
  templatePath: string;
  frontmatter: Record<string, FrontmatterValue>;
  body: string;
};

export type TemplateRenderValue = string | number | boolean | string[] | undefined;
export type TemplateRenderContext = Record<string, TemplateRenderValue>;

function templateNameForType(type: string): string {
  const normalized = type.toLowerCase();
  if (normalized === "checkpoint") {
    return "chk";
  }
  return normalized;
}

export function loadTemplate(
  root: string,
  config: Config,
  type: string,
  templateSet?: string
): LoadedTemplate {
  const setName = (templateSet ?? config.templates.default_set).toLowerCase();
  const templateName = templateNameForType(type);
  const templatePath = path.resolve(
    root,
    config.templates.root_path,
    setName,
    `${templateName}.md`
  );

  if (!fs.existsSync(templatePath)) {
    throw new NotFoundError(`template not found: ${setName}/${templateName}.md`);
  }

  const content = fs.readFileSync(templatePath, "utf8");
  const { frontmatter, body } = parseFrontmatter(content, templatePath);
  return { templatePath, frontmatter, body };
}

function isTokenPlaceholder(value: FrontmatterValue): value is string {
  return typeof value === "string" && /^\{\{[a-z0-9_]+\}\}$/.test(value);
}

function tokenKey(value: string): string {
  return value.slice(2, -2);
}

function renderTokenValue(value: TemplateRenderValue): FrontmatterValue | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    return String(value);
  }
  return value;
}

export function renderTemplate(template: LoadedTemplate, context: TemplateRenderContext): string {
  const allowedKeys = new Set(Object.keys(template.frontmatter));
  const rendered: Record<string, FrontmatterValue> = {};

  for (const [key, value] of Object.entries(template.frontmatter)) {
    if (isTokenPlaceholder(value)) {
      const replacement = renderTokenValue(context[tokenKey(value)]);
      if (replacement !== undefined) {
        rendered[key] = replacement;
      }
      continue;
    }
    rendered[key] = value;
  }

  for (const [key, value] of Object.entries(context)) {
    if (!allowedKeys.has(key)) {
      continue;
    }
    const replacement = renderTokenValue(value);
    if (replacement !== undefined) {
      rendered[key] = replacement;
    }
  }

  const lines: string[] = [];
  lines.push("---");
  lines.push(...formatFrontmatter(rendered));
  lines.push("---");
  lines.push(template.body.trimStart());
  if (!lines[lines.length - 1]?.endsWith("\n")) {
    lines.push("");
  }
  return lines.join("\n");
}

