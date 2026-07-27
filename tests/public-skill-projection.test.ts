import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const repoRoot = path.resolve(process.cwd());
const projection = require("../core/public_skill_projection") as {
  parsePublicSkillProjectionPolicy(policyPath: string): {
    schema_version: number;
    decision_ref: string;
    projections: Array<{ slug: string; mode: string }>;
  };
  validatePublicSkillProjection(options: {
    policyPath: string;
    canonicalRoot?: string;
    mirrorRoots?: string[];
    publicRoot: string;
    builtRoot?: string;
    freshInitRoot?: string;
  }): {
    ok: boolean;
    exact_slugs: string[];
    excluded_slugs: string[];
    errors: string[];
  };
};
const { runInitCommand } = require("../commands/init") as {
  runInitCommand(options: {
    root: string;
    seedRoot: string;
    agent: boolean;
    noUpdateIgnores?: boolean;
  }): void;
};

function write(filePath: string, content: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function skillBody(slug: string): string {
  return `---\nname: ${slug}\ndescription: Portable ${slug} fixture.\n---\n\n# Goal\n\nValidate local evidence.\n`;
}

function fixture(): {
  root: string;
  policyPath: string;
  canonicalRoot: string;
  mirrors: string[];
  publicRoot: string;
  builtRoot: string;
  freshRoot: string;
} {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-public-skill-policy-"));
  const policyPath = path.join(root, "public-seed-policy.json");
  const canonicalRoot = path.join(root, "canonical");
  const mirrors = [path.join(root, "agents"), path.join(root, "claude")];
  const publicRoot = path.join(root, "public");
  const builtRoot = path.join(root, "built");
  const freshRoot = path.join(root, "fresh");
  write(policyPath, `${JSON.stringify({
    schema_version: 1,
    decision_ref: "root:dec-89",
    projections: [
      { slug: "portable-skill", mode: "exact" },
      { slug: "private-skill", mode: "excluded", reason: "Repository-only fixture." },
    ],
  }, null, 2)}\n`);
  for (const slug of ["portable-skill", "private-skill"]) {
    const body = skillBody(slug);
    write(path.join(canonicalRoot, slug, "SKILL.md"), body);
    for (const mirror of mirrors) {
      write(path.join(mirror, slug, "SKILL.md"), body);
    }
    if (slug === "portable-skill") {
      for (const publicSurface of [publicRoot, builtRoot, freshRoot]) {
        write(path.join(publicSurface, slug, "SKILL.md"), body);
      }
    }
  }
  return { root, policyPath, canonicalRoot, mirrors, publicRoot, builtRoot, freshRoot };
}

function validateFixture(value: ReturnType<typeof fixture>) {
  return projection.validatePublicSkillProjection({
    policyPath: value.policyPath,
    canonicalRoot: value.canonicalRoot,
    mirrorRoots: value.mirrors,
    publicRoot: value.publicRoot,
    builtRoot: value.builtRoot,
    freshInitRoot: value.freshRoot,
  });
}

function captureConsole(fn: () => void): void {
  const log = console.log;
  const error = console.error;
  try {
    console.log = () => undefined;
    console.error = () => undefined;
    fn();
  } finally {
    console.log = log;
    console.error = error;
  }
}

test("policy schema supports only exact and excluded projections", () => {
  const value = fixture();
  const parsed = projection.parsePublicSkillProjectionPolicy(value.policyPath);
  assert.equal(parsed.schema_version, 1);
  assert.deepEqual(parsed.projections.map((entry) => [entry.slug, entry.mode]), [
    ["portable-skill", "exact"],
    ["private-skill", "excluded"],
  ]);

  const invalid = JSON.parse(fs.readFileSync(value.policyPath, "utf8"));
  invalid.projections[0].mode = "reviewed_snapshot";
  write(value.policyPath, `${JSON.stringify(invalid, null, 2)}\n`);
  assert.throws(
    () => projection.parsePublicSkillProjectionPolicy(value.policyPath),
    /unsupported mode: reviewed_snapshot/,
  );
});

test("one validator proves exact hashes and excluded membership across every surface", () => {
  const value = fixture();
  const receipt = validateFixture(value);
  assert.equal(receipt.ok, true, receipt.errors.join("\n"));
  assert.deepEqual(receipt.exact_slugs, ["portable-skill"]);
  assert.deepEqual(receipt.excluded_slugs, ["private-skill"]);
});

test("projection validation identifies missing extra drift excluded and embedded release behavior", () => {
  {
    const value = fixture();
    fs.rmSync(path.join(value.publicRoot, "portable-skill"), { recursive: true });
    assert.match(validateFixture(value).errors.join("\n"), /public_source: membership mismatch/);
  }
  {
    const value = fixture();
    write(path.join(value.publicRoot, "extra-skill", "SKILL.md"), skillBody("extra-skill"));
    assert.match(validateFixture(value).errors.join("\n"), /got \[extra-skill, portable-skill\]/);
  }
  {
    const value = fixture();
    fs.appendFileSync(path.join(value.builtRoot, "portable-skill", "SKILL.md"), "\nDrift.\n");
    assert.match(validateFixture(value).errors.join("\n"), /built_seed:portable-skill: hash drift/);
  }
  {
    const value = fixture();
    write(path.join(value.freshRoot, "private-skill", "SKILL.md"), skillBody("private-skill"));
    assert.match(validateFixture(value).errors.join("\n"), /fresh_init:private-skill: excluded skill must be absent/);
  }
  {
    const value = fixture();
    fs.appendFileSync(
      path.join(value.canonicalRoot, "portable-skill", "SKILL.md"),
      "\nnpm publish --registry=https://registry.npmjs.org/\n",
    );
    assert.match(validateFixture(value).errors.join("\n"), /portable-skill: package publication command/);
  }
});

test("fresh agent init produces the exact six-member public catalog", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-public-skill-fresh-init-"));
  const seedRoot = path.join(repoRoot, "dist", "init");
  captureConsole(() => runInitCommand({
    root,
    seedRoot,
    agent: true,
    noUpdateIgnores: true,
  }));
  const receipt = projection.validatePublicSkillProjection({
    policyPath: path.join(seedRoot, "skills", "public-seed-policy.json"),
    publicRoot: path.join(seedRoot, "skills", "default"),
    freshInitRoot: path.join(root, ".mdkg", "skills"),
  });
  assert.equal(receipt.ok, true, receipt.errors.join("\n"));
  assert.equal(receipt.exact_slugs.length, 6);
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "skills", "release-mdkg-package")), false);
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "skills", "service-boundary-ownership-check")), false);
});

test("agent init preserves a customized existing skill instead of forcing public equality", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-public-skill-customized-init-"));
  const customPath = path.join(root, ".mdkg", "skills", "verify-close-and-checkpoint", "SKILL.md");
  const customBody = "---\nname: verify-close-and-checkpoint\ndescription: Customized consumer body.\n---\n";
  write(customPath, customBody);
  captureConsole(() => runInitCommand({
    root,
    seedRoot: path.join(repoRoot, "dist", "init"),
    agent: true,
    noUpdateIgnores: true,
  }));
  assert.equal(fs.readFileSync(customPath, "utf8"), customBody);
  assert.equal(
    fs.readFileSync(path.join(root, ".agents", "skills", "verify-close-and-checkpoint", "SKILL.md"), "utf8"),
    customBody,
  );
  assert.equal(
    fs.readFileSync(path.join(root, ".claude", "skills", "verify-close-and-checkpoint", "SKILL.md"), "utf8"),
    customBody,
  );
});
