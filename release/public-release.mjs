import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
const EXPECTED_KEYS = [
  "qualifier",
  "release_id",
  "schema_version",
  "state",
  "target_version",
];
const SEMVER_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

function fail(message) {
  throw new Error(`Invalid public release configuration: ${message}`);
}

function readJson(filePath, label) {
  let source;
  try {
    source = readFileSync(filePath, "utf8");
  } catch (error) {
    fail(`${label} could not be read at ${filePath}: ${error.message}`);
  }

  try {
    return JSON.parse(source);
  } catch (error) {
    fail(`${label} is not valid JSON at ${filePath}: ${error.message}`);
  }
}

function parseBinaryFlag(env, name) {
  const value = String(env[name] ?? "").trim();
  if (value === "" || value === "0") {
    return false;
  }
  if (value === "1") {
    return true;
  }
  fail(`${name} must be unset, 0, or 1; received ${JSON.stringify(value)}`);
}

function parseExistingNoindexFlag(env) {
  const value = String(env.PUBLIC_MDKG_PREVIEW_NOINDEX ?? "").trim().toLowerCase();
  return value === "1" || value === "true";
}

export function resolvePublicReleasePaths(cwd = process.cwd()) {
  let current = resolve(cwd);
  while (true) {
    const manifest = join(current, "release", "public-release.json");
    const packagePath = join(current, "package.json");
    if (existsSync(manifest) && existsSync(packagePath)) {
      return Object.freeze({ manifest, package: packagePath });
    }
    const parent = dirname(current);
    if (parent === current) {
      fail(`could not find release/public-release.json above ${resolve(cwd)}`);
    }
    current = parent;
  }
}

export function validatePublicReleaseManifest(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    fail("manifest must be a JSON object");
  }

  const keys = Object.keys(value).sort();
  if (keys.length !== EXPECTED_KEYS.length || keys.some((key, index) => key !== EXPECTED_KEYS[index])) {
    fail(`manifest keys must be exactly ${EXPECTED_KEYS.join(", ")}; received ${keys.join(", ") || "none"}`);
  }
  if (value.schema_version !== 1) {
    fail(`schema_version must be 1; received ${JSON.stringify(value.schema_version)}`);
  }
  if (typeof value.release_id !== "string" || !/^[a-z0-9][a-z0-9.-]*$/.test(value.release_id)) {
    fail("release_id must be a lowercase portable identifier");
  }
  if (typeof value.target_version !== "string" || !SEMVER_PATTERN.test(value.target_version)) {
    fail("target_version must be a valid semantic version");
  }
  if (value.state !== "draft" && value.state !== "published") {
    fail(`state must be draft or published; received ${JSON.stringify(value.state)}`);
  }
  if (typeof value.qualifier !== "string" || value.qualifier.trim() === "") {
    fail("qualifier must be a non-empty string");
  }

  return Object.freeze({ ...value });
}

export function projectPublicRelease({ manifest, packageVersion, env = process.env }) {
  const validatedManifest = validatePublicReleaseManifest(manifest);
  if (typeof packageVersion !== "string" || !SEMVER_PATTERN.test(packageVersion)) {
    fail("package version must be a valid semantic version");
  }

  const releasePreviewRequested = parseBinaryFlag(env, "PUBLIC_MDKG_RELEASE_PREVIEW");
  const production = env.VERCEL_ENV === "production";
  const deploymentPreview =
    env.VERCEL_ENV === "preview" || parseExistingNoindexFlag(env);
  const published = validatedManifest.state === "published";

  if (!published && production && releasePreviewRequested) {
    fail("PUBLIC_MDKG_RELEASE_PREVIEW cannot expose a draft release in Vercel production");
  }
  if (published && packageVersion !== validatedManifest.target_version) {
    fail(
      `published release ${validatedManifest.release_id} targets ${validatedManifest.target_version}, ` +
      `but package.json is ${packageVersion}`,
    );
  }

  const previewVisible = !published && releasePreviewRequested && !production;
  return Object.freeze({
    manifest: validatedManifest,
    package_version: packageVersion,
    production,
    deployment_preview: deploymentPreview,
    release_preview_requested: releasePreviewRequested,
    published,
    preview_visible: previewVisible,
    visible: published || previewVisible,
    indexable: published,
    site_noindex: deploymentPreview || previewVisible,
  });
}

export function loadPublicReleaseProjection({
  manifestPath,
  packagePath,
  cwd = process.cwd(),
  env = process.env,
} = {}) {
  const defaults = manifestPath && packagePath ? null : resolvePublicReleasePaths(cwd);
  const resolvedManifestPath = manifestPath ?? defaults.manifest;
  const resolvedPackagePath = packagePath ?? defaults.package;
  const manifest = readJson(resolvedManifestPath, "release manifest");
  const packageJson = readJson(resolvedPackagePath, "package manifest");
  return projectPublicRelease({ manifest, packageVersion: packageJson.version, env });
}

export const publicReleasePaths = resolvePublicReleasePaths();
