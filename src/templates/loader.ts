import fs from "fs";
import path from "path";
import { Config } from "../core/config";
import { containedPathExists, readContainedFile } from "../core/filesystem_authority";
import { FrontmatterValue, formatFrontmatter, parseFrontmatter } from "../graph/frontmatter";
import { NotFoundError } from "../util/errors";
import { resolveLocalTemplatePath, requireBundledTemplatePath, templateNameForType } from "./builtin";

export type LoadedTemplate = {
  templatePath: string;
  source: "local" | "bundled";
  frontmatter: Record<string, FrontmatterValue>;
  body: string;
};

export type TemplateRenderValue = string | number | boolean | string[] | undefined;
export type TemplateRenderContext = Record<string, TemplateRenderValue>;

export function loadTemplate(
  root: string,
  config: Config,
  type: string,
  templateSet?: string
): LoadedTemplate {
  const templatePath = resolveLocalTemplatePath(root, config, type, templateSet);
  const templateRelativePath = path.relative(root, templatePath).split(path.sep).join("/");
  const localExists = containedPathExists({ root, relativePath: templateRelativePath });
  if (!localExists && templateSet !== undefined) {
    throw new NotFoundError(`template not found: ${templateSet.toLowerCase()}/${templateNameForType(type)}.md`);
  }
  const source = localExists ? "local" : "bundled";
  const resolvedPath = source === "local" ? templatePath : requireBundledTemplatePath(type);

  const content = source === "local"
    ? readContainedFile({ root, relativePath: templateRelativePath })
    : fs.readFileSync(resolvedPath, "utf8");
  const { frontmatter, body } = parseFrontmatter(content, resolvedPath);
  return { templatePath: resolvedPath, source, frontmatter, body };
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
