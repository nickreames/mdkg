import crypto from "crypto";
import fs from "fs";
import path from "path";

export type PublicSkillProjectionMode = "exact" | "excluded";

export type PublicSkillProjectionPolicy = {
  schema_version: 1;
  decision_ref: string;
  projections: Array<{
    slug: string;
    mode: PublicSkillProjectionMode;
    reason?: string;
  }>;
};

export type PublicSkillProjectionOptions = {
  policyPath: string;
  publicRoot: string;
  canonicalRoot?: string;
  mirrorRoots?: string[];
  builtRoot?: string;
  freshInitRoot?: string;
};

export type PublicSkillProjectionReceipt = {
  ok: boolean;
  decision_ref: string;
  exact_slugs: string[];
  excluded_slugs: string[];
  checked_surfaces: string[];
  hashes: Record<string, Record<string, string>>;
  errors: string[];
};

const SKILL_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const POLICY_KEYS = ["decision_ref", "projections", "schema_version"];
const PROJECTION_KEYS = ["mode", "reason", "slug"];

function sha256(filePath: string): string {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function listSkillSlugs(root: string): string[] {
  if (!fs.existsSync(root)) {
    return [];
  }
  return fs.readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(root, entry.name, "SKILL.md")))
    .map((entry) => entry.name)
    .sort();
}

function skillPath(root: string, slug: string): string {
  return path.join(root, slug, "SKILL.md");
}

function sameKeys(value: Record<string, unknown>, allowed: string[]): boolean {
  return JSON.stringify(Object.keys(value).sort()) === JSON.stringify(allowed);
}

export function parsePublicSkillProjectionPolicy(policyPath: string): PublicSkillProjectionPolicy {
  if (!fs.existsSync(policyPath)) {
    throw new Error(`public skill projection policy is missing: ${policyPath}`);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(policyPath, "utf8"));
  } catch (error) {
    throw new Error(
      `public skill projection policy is not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("public skill projection policy must be an object");
  }
  const policy = parsed as Record<string, unknown>;
  if (!sameKeys(policy, POLICY_KEYS)) {
    throw new Error(`public skill projection policy keys must be exactly: ${POLICY_KEYS.join(", ")}`);
  }
  if (
    policy.schema_version !== 1 ||
    typeof policy.decision_ref !== "string" ||
    !/^root:dec-\d+$/.test(policy.decision_ref) ||
    !Array.isArray(policy.projections) ||
    policy.projections.length === 0
  ) {
    throw new Error("public skill projection policy has invalid schema_version, decision_ref, or projections");
  }
  const seen = new Set<string>();
  const projections = policy.projections.map((raw, index) => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      throw new Error(`public skill projection ${index} must be an object`);
    }
    const projection = raw as Record<string, unknown>;
    const allowedKeys = projection.mode === "excluded"
      ? PROJECTION_KEYS
      : PROJECTION_KEYS.filter((key) => key !== "reason");
    if (!sameKeys(projection, allowedKeys)) {
      throw new Error(`public skill projection ${index} has unsupported or missing keys`);
    }
    const slug = typeof projection.slug === "string" ? projection.slug : "";
    if (!SKILL_SLUG_RE.test(slug) || seen.has(slug)) {
      throw new Error(`public skill projection has invalid or duplicate slug: ${slug || index}`);
    }
    seen.add(slug);
    if (projection.mode !== "exact" && projection.mode !== "excluded") {
      throw new Error(`public skill projection ${slug} uses unsupported mode: ${String(projection.mode)}`);
    }
    const mode = projection.mode as PublicSkillProjectionMode;
    if (
      mode === "excluded" &&
      (typeof projection.reason !== "string" || projection.reason.trim().length === 0)
    ) {
      throw new Error(`excluded public skill projection ${slug} requires a reason`);
    }
    return {
      slug,
      mode,
      ...(mode === "excluded" ? { reason: String(projection.reason).trim() } : {}),
    };
  });
  return {
    schema_version: 1,
    decision_ref: policy.decision_ref,
    projections,
  };
}

export function portableSkillBodyDiagnostics(source: string): string[] {
  const diagnostics: string[] = [];
  const checks: Array<[string, RegExp]> = [
    ["root-qualified internal QID", /\broot:[a-z][a-z0-9_-]*-\d+\b/i],
    ["repository-local design or work link", /\.mdkg\/(?:design|work)\/(?![<{])[^`\s,\]]+\.md\b/i],
    ["package publication command", /(?:^|\n)\s*(?:NPM_CONFIG_[^\n]*\s+)?npm\s+publish\b/i],
    ["registry inspection or authentication command", /(?:^|\n)\s*npm\s+(?:view|login|whoami)\b/i],
    ["registry credential procedure", /\b(?:NPM_TOKEN|_authToken|registry\.npmjs\.org)\b/i],
    ["push or tag command", /(?:^|\n)\s*git\s+(?:push|tag)\b/i],
    ["deployment command", /(?:^|\n)\s*(?:vercel|npm\s+run\s+deploy)\b/i],
    ["provider release command", /(?:^|\n)\s*gh\s+release\b/i],
  ];
  for (const [identity, pattern] of checks) {
    if (pattern.test(source)) {
      diagnostics.push(identity);
    }
  }
  return diagnostics;
}

export function validatePublicSkillProjection(
  options: PublicSkillProjectionOptions,
): PublicSkillProjectionReceipt {
  const policy = parsePublicSkillProjectionPolicy(options.policyPath);
  const exactSlugs = policy.projections
    .filter((projection) => projection.mode === "exact")
    .map((projection) => projection.slug)
    .sort();
  const excludedSlugs = policy.projections
    .filter((projection) => projection.mode === "excluded")
    .map((projection) => projection.slug)
    .sort();
  const allSlugs = [...exactSlugs, ...excludedSlugs].sort();
  const errors: string[] = [];
  const hashes: Record<string, Record<string, string>> = {};
  const surfaces: Array<{ id: string; root: string; publicOnly: boolean }> = [
    { id: "public_source", root: options.publicRoot, publicOnly: true },
  ];
  if (options.canonicalRoot) {
    surfaces.unshift({ id: "canonical", root: options.canonicalRoot, publicOnly: false });
  }
  for (const [index, mirrorRoot] of (options.mirrorRoots ?? []).entries()) {
    surfaces.push({ id: `configured_mirror_${index + 1}`, root: mirrorRoot, publicOnly: false });
  }
  if (options.builtRoot) {
    surfaces.push({ id: "built_seed", root: options.builtRoot, publicOnly: true });
  }
  if (options.freshInitRoot) {
    surfaces.push({ id: "fresh_init", root: options.freshInitRoot, publicOnly: true });
  }

  const expectedBySurface = (publicOnly: boolean) => publicOnly ? exactSlugs : allSlugs;
  for (const surface of surfaces) {
    const expected = expectedBySurface(surface.publicOnly);
    const actual = listSkillSlugs(surface.root);
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      errors.push(
        `${surface.id}: membership mismatch; expected [${expected.join(", ")}], got [${actual.join(", ")}]`,
      );
    }
  }

  for (const slug of allSlugs) {
    hashes[slug] = {};
    const canonicalPath = options.canonicalRoot ? skillPath(options.canonicalRoot, slug) : undefined;
    const publicPath = skillPath(options.publicRoot, slug);
    const canonicalHash = canonicalPath && fs.existsSync(canonicalPath)
      ? sha256(canonicalPath)
      : exactSlugs.includes(slug) && fs.existsSync(publicPath)
        ? sha256(publicPath)
        : undefined;
    if (options.canonicalRoot && !canonicalHash) {
      errors.push(`canonical:${slug}: missing SKILL.md`);
    }
    for (const surface of surfaces) {
      const filePath = skillPath(surface.root, slug);
      const shouldExist = !surface.publicOnly || exactSlugs.includes(slug);
      if (!shouldExist) {
        if (fs.existsSync(filePath)) {
          errors.push(`${surface.id}:${slug}: excluded skill must be absent`);
        }
        continue;
      }
      if (!fs.existsSync(filePath)) {
        errors.push(`${surface.id}:${slug}: missing SKILL.md`);
        continue;
      }
      const hash = sha256(filePath);
      hashes[slug][surface.id] = hash;
      if (canonicalHash && hash !== canonicalHash) {
        errors.push(`${surface.id}:${slug}: hash drift from canonical`);
      }
    }
    if (exactSlugs.includes(slug)) {
      const portablePath = canonicalPath && fs.existsSync(canonicalPath)
        ? canonicalPath
        : skillPath(options.publicRoot, slug);
      if (fs.existsSync(portablePath)) {
        for (const diagnostic of portableSkillBodyDiagnostics(fs.readFileSync(portablePath, "utf8"))) {
          errors.push(`${slug}: ${diagnostic}`);
        }
      }
    }
  }

  return {
    ok: errors.length === 0,
    decision_ref: policy.decision_ref,
    exact_slugs: exactSlugs,
    excluded_slugs: excludedSlugs,
    checked_surfaces: surfaces.map((surface) => surface.id),
    hashes,
    errors,
  };
}

export function assertPublicSkillProjection(options: PublicSkillProjectionOptions): PublicSkillProjectionReceipt {
  const receipt = validatePublicSkillProjection(options);
  if (!receipt.ok) {
    throw new Error(`public skill projection invalid:\n${receipt.errors.join("\n")}`);
  }
  return receipt;
}
