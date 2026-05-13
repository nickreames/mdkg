import fs from "fs";
import path from "path";
import { Config } from "../core/config";

export const BUILTIN_TEMPLATE_SET = "default";

export function templateNameForType(type: string): string {
  const normalized = type.toLowerCase();
  if (normalized === "checkpoint") {
    return "chk";
  }
  return normalized;
}

export function resolveLocalTemplatePath(
  root: string,
  config: Config,
  type: string,
  templateSet?: string
): string {
  const setName = (templateSet ?? config.templates.default_set).toLowerCase();
  return path.resolve(
    root,
    config.templates.root_path,
    setName,
    `${templateNameForType(type)}.md`
  );
}

export function resolveBundledTemplateRoot(): string {
  return path.resolve(__dirname, "..", "init", "templates", BUILTIN_TEMPLATE_SET);
}

export function resolveBundledTemplatePath(type: string): string {
  return path.join(resolveBundledTemplateRoot(), `${templateNameForType(type)}.md`);
}

export function requireBundledTemplatePath(type: string): string {
  const templatePath = resolveBundledTemplatePath(type);
  if (!fs.existsSync(templatePath)) {
    throw new Error(
      `bundled template fallback missing for type ${type}: ${templatePath} (try reinstalling mdkg)`
    );
  }
  return templatePath;
}
