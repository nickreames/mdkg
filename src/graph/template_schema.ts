import fs from "fs";
import path from "path";
import { Config } from "../core/config";
import { FrontmatterValue, parseFrontmatter } from "./frontmatter";

export type TemplateKeyKind = "scalar" | "list" | "boolean";

export type TemplateSchema = {
  type: string;
  allowedKeys: Set<string>;
  keyKinds: Record<string, TemplateKeyKind>;
  listKeys: Set<string>;
};

export type TemplateSchemaMap = Record<string, TemplateSchema>;

function listMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

function getValueKind(value: FrontmatterValue): TemplateKeyKind {
  if (Array.isArray(value)) {
    return "list";
  }
  if (typeof value === "boolean") {
    return "boolean";
  }
  return "scalar";
}

function addKeyToSchema(schema: TemplateSchema, key: string, kind: TemplateKeyKind, filePath: string): void {
  const existing = schema.keyKinds[key];
  if (existing && existing !== kind) {
    throw new Error(
      `template schema mismatch for ${schema.type}.${key}: ${existing} vs ${kind} (${filePath})`
    );
  }
  schema.keyKinds[key] = kind;
  schema.allowedKeys.add(key);
  if (kind === "list") {
    schema.listKeys.add(key);
  }
}

export function loadTemplateSchemas(
  root: string,
  config: Config,
  requiredTypes?: Iterable<string>
): TemplateSchemaMap {
  const templateRoot = path.resolve(
    root,
    config.templates.root_path,
    config.templates.default_set
  );
  const files = listMarkdownFiles(templateRoot);
  if (files.length === 0) {
    throw new Error(`no templates found at ${templateRoot}`);
  }

  const schemas: TemplateSchemaMap = {};
  for (const filePath of files) {
    const content = fs.readFileSync(filePath, "utf8");
    const { frontmatter } = parseFrontmatter(content, filePath);
    const typeValue = frontmatter.type;
    if (typeof typeValue !== "string") {
      throw new Error(`template missing type in ${filePath}`);
    }
    const normalizedType = typeValue.toLowerCase();
    if (normalizedType !== typeValue) {
      throw new Error(`template type must be lowercase in ${filePath}`);
    }

    const schema =
      schemas[normalizedType] ??
      ({
        type: normalizedType,
        allowedKeys: new Set(),
        keyKinds: {},
        listKeys: new Set(),
      } as TemplateSchema);
    schemas[normalizedType] = schema;

    for (const [key, value] of Object.entries(frontmatter)) {
      const kind = getValueKind(value);
      addKeyToSchema(schema, key, kind, filePath);
    }
  }

  if (requiredTypes) {
    const required = Array.from(requiredTypes, (value) => value.toLowerCase());
    const missing = required.filter((value) => !schemas[value]);
    if (missing.length > 0) {
      throw new Error(`template schema missing for type(s): ${missing.join(", ")}`);
    }
  }

  return schemas;
}
