import { Config } from "../core/config";
import { loadTemplate } from "./loader";

function normalizeHeading(value: string): string {
  return value.trim().toLowerCase();
}

export function extractMarkdownHeadings(body: string): string[] {
  const lines = body.split(/\r?\n/);
  const headings: string[] = [];
  const seen = new Set<string>();
  for (const line of lines) {
    const match = /^#+\s+(.*)$/.exec(line);
    if (!match) {
      continue;
    }
    const heading = normalizeHeading(match[1] ?? "");
    if (!heading || seen.has(heading)) {
      continue;
    }
    headings.push(heading);
    seen.add(heading);
  }
  return headings;
}

export function loadTemplateHeadingMap(
  root: string,
  config: Config,
  types: string[]
): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const type of types) {
    const template = loadTemplate(root, config, type);
    map[type] = extractMarkdownHeadings(template.body);
  }
  return map;
}
