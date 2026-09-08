import fs from "fs";
import path from "path";
import { Config } from "../core/config";
import { FrontmatterValue, parseFrontmatter } from "./frontmatter";
import { requireBundledTemplatePath, resolveBundledTemplateRoot } from "../templates/builtin";
import { containedPathExists, forEachContainedDirectoryEntry, readContainedFile } from "../core/filesystem_authority";
import { templateSetRelativePath } from "../core/template_path";
import { localTemplateLimits } from "../templates/limits";

export type TemplateKeyKind = "scalar" | "list" | "boolean";

export type TemplateSchema = {
  type: string;
  allowedKeys: Set<string>;
  keyKinds: Record<string, TemplateKeyKind>;
  listKeys: Set<string>;
};

export type TemplateSchemaMap = Record<string, TemplateSchema>;

export type TemplateSchemaLoadResult = {
  schemas: TemplateSchemaMap;
  templateRoot: string;
  bundledTemplateRoot: string;
  fallbackTypes: string[];
};

const TEMPLATE_SCHEMA_ALIASES: Record<string, string> = {
  spec: "manifest",
};

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

function cloneSchema(schema: TemplateSchema, type: string): TemplateSchema {
  return {
    type,
    allowedKeys: new Set(schema.allowedKeys),
    keyKinds: { ...schema.keyKinds },
    listKeys: new Set(schema.listKeys),
  };
}

function loadBundledSchema(type: string): TemplateSchema {
  const bundledPath = requireBundledTemplatePath(type);
  const content = fs.readFileSync(bundledPath, "utf8");
  const { frontmatter } = parseFrontmatter(content, bundledPath);
  const typeValue = frontmatter.type;
  if (typeValue !== type) {
    throw new Error(`bundled template fallback type mismatch for ${type}: ${bundledPath}`);
  }
  const schema = {
    type,
    allowedKeys: new Set<string>(),
    keyKinds: {},
    listKeys: new Set<string>(),
  } as TemplateSchema;
  for (const [key, value] of Object.entries(frontmatter)) {
    const kind = getValueKind(value);
    addKeyToSchema(schema, key, kind, bundledPath);
  }
  return schema;
}

export function loadTemplateSchemas(
  root: string,
  config: Config,
  requiredTypes?: Iterable<string>
): TemplateSchemaMap {
  return loadTemplateSchemasWithInfo(root, config, requiredTypes).schemas;
}

export function loadTemplateSchemasWithInfo(
  root: string,
  config: Config,
  requiredTypes?: Iterable<string>
): TemplateSchemaLoadResult {
  const relativeRoot = templateSetRelativePath(config.templates.root_path, config.templates.default_set);
  const templateRoot = path.resolve(root, relativeRoot);
  const limits = localTemplateLimits(config);
  let fileCount = 0, totalBytes = 0, entries = 0;
  const schemas: TemplateSchemaMap = {};
  const consume = (relativePath: string) => {
    if (++fileCount > limits.max_files) throw new Error("template file count exceeds index.limits.max_files");
    const filePath = path.resolve(root, relativePath);
    const bytes = readContainedFile({ root, relativePath, pathSyntax: "native", maxBytes: Math.min(limits.max_file_bytes, limits.max_total_bytes - totalBytes) }, null);
    totalBytes += bytes.length;
    const content = bytes.toString("utf8");
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
  };
  const visit = (relativePath: string, depth: number) => {
    if (depth > limits.max_depth) throw new Error("template directory depth exceeds index.limits.max_depth");
    forEachContainedDirectoryEntry({ root, relativePath, pathSyntax: "native" }, (entry) => {
      if (++entries > limits.max_files * 10) throw new Error("template discovery entry budget exceeded (10 * index.limits.max_files)");
      const child = path.join(relativePath, entry.name);
      if (entry.isDirectory()) visit(child, depth + 1);
      else if (entry.isFile() && entry.name.endsWith(".md")) consume(child);
      // Preserve existing exclusion of descendant links and non-Markdown files.
    });
  };
  if (relativeRoot === "." || containedPathExists({ root, relativePath: relativeRoot })) visit(relativeRoot, 0);
  if (fileCount === 0 && !requiredTypes) throw new Error(`no templates found at ${templateRoot}`);

  const fallbackTypes: string[] = [];
  if (requiredTypes) {
    const required = Array.from(requiredTypes, (value) => value.toLowerCase());
    for (const missingType of required.filter((value) => !schemas[value])) {
      const aliasType = TEMPLATE_SCHEMA_ALIASES[missingType];
      if (aliasType) {
        const aliasSchema = schemas[aliasType] ?? loadBundledSchema(aliasType);
        schemas[missingType] = cloneSchema(aliasSchema, missingType);
        continue;
      }
      schemas[missingType] = loadBundledSchema(missingType);
      fallbackTypes.push(missingType);
    }
  }

  return {
    schemas,
    templateRoot,
    bundledTemplateRoot: resolveBundledTemplateRoot(),
    fallbackTypes,
  };
}
