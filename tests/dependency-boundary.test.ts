import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const repoRoot = path.resolve(process.cwd());
const boundary = require(path.join(repoRoot, "scripts", "dependency-boundary.js")) as {
  BOOTSTRAP_COMMAND: string;
  inspectDependencyTrees(root: string): {
    ok: boolean;
    network_access: boolean;
    mutation: boolean;
    bootstrap_command: string;
    domain_count: number;
    issue_count: number;
    domains: Array<{ id: string; ok: boolean; issues: Array<{ kind: string; path?: string }> }>;
  };
  runBootstrap(root: string, options: { dryRun: boolean; json: boolean }): {
    ok: boolean;
    executed: boolean;
    dry_run: boolean;
    network_capable: boolean;
    domain_count: number;
    commands: Array<{ domain: string; command: string }>;
  };
  helpText(): string;
};

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function seedDomain(root: string, directory: string, dependency: string) {
  const ownerRoot = path.join(root, directory);
  const prefix = directory === "." ? "" : `${directory}/`;
  writeJson(path.join(ownerRoot, "package.json"), {
    name: `fixture-${dependency}`,
    version: "1.0.0",
    private: true,
    devDependencies: { [dependency]: "1.0.0" },
  });
  writeJson(path.join(ownerRoot, "package-lock.json"), {
    name: `fixture-${dependency}`,
    version: "1.0.0",
    lockfileVersion: 3,
    packages: {
      "": {
        name: `fixture-${dependency}`,
        version: "1.0.0",
        devDependencies: { [dependency]: "1.0.0" },
      },
      [`node_modules/${dependency}`]: {
        version: "1.0.0",
        dev: true,
      },
    },
  });
  writeJson(path.join(ownerRoot, "node_modules", dependency, "package.json"), {
    name: dependency,
    version: "1.0.0",
  });
  return prefix;
}

function makeFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-dependency-boundary-"));
  seedDomain(root, ".", "root-dep");
  seedDomain(root, "docs", "docs-dep");
  seedDomain(root, "mdkg-dev", "site-dep");
  return root;
}

test("dependency preflight validates all three independent lockfile owners without mutation", () => {
  const root = makeFixture();
  const before = fs.readFileSync(path.join(root, "docs", "package-lock.json"), "utf8");
  const receipt = boundary.inspectDependencyTrees(root);
  const after = fs.readFileSync(path.join(root, "docs", "package-lock.json"), "utf8");

  assert.equal(receipt.ok, true);
  assert.equal(receipt.domain_count, 3);
  assert.equal(receipt.issue_count, 0);
  assert.equal(receipt.network_access, false);
  assert.equal(receipt.mutation, false);
  assert.equal(after, before);
  assert.deepEqual(receipt.domains.map((domain) => domain.id), ["root", "docs", "mdkg-dev"]);
});

for (const [domainId, directory] of [
  ["root", "."],
  ["docs", "docs"],
  ["mdkg-dev", "mdkg-dev"],
] as const) {
  test(`missing ${domainId} dependency tree fails closed with the exact bootstrap command`, () => {
    const root = makeFixture();
    fs.rmSync(path.join(root, directory, "node_modules"), { recursive: true });
    const receipt = boundary.inspectDependencyTrees(root);
    const domain = receipt.domains.find((item) => item.id === domainId);

    assert.equal(receipt.ok, false);
    assert.equal(receipt.bootstrap_command, boundary.BOOTSTRAP_COMMAND);
    assert.equal(domain?.ok, false);
    assert.ok(domain?.issues.some((issue) => issue.kind === "missing_dependency_tree"));
    assert.ok(domain?.issues.some((issue) => issue.kind === "missing_dependency"));
    assert.equal(receipt.domains.filter((item) => item.id !== domainId).every((item) => item.ok), true);
  });
}

test("extraneous dependencies are attributed to their lockfile owner", () => {
  const root = makeFixture();
  writeJson(path.join(root, "mdkg-dev", "node_modules", "unexpected", "package.json"), {
    name: "unexpected",
    version: "9.9.9",
  });
  const receipt = boundary.inspectDependencyTrees(root);
  const site = receipt.domains.find((domain) => domain.id === "mdkg-dev");

  assert.equal(receipt.ok, false);
  assert.ok(
    site?.issues.some(
      (issue) => issue.kind === "extraneous_dependency" && issue.path === "mdkg-dev/node_modules/unexpected",
    ),
  );
  assert.equal(receipt.domains.find((domain) => domain.id === "root")?.ok, true);
  assert.equal(receipt.domains.find((domain) => domain.id === "docs")?.ok, true);
});

test("bootstrap dry-run is bounded, explicit, and does not execute registry-capable commands", () => {
  const root = makeFixture();
  const receipt = boundary.runBootstrap(root, { dryRun: true, json: true });

  assert.equal(receipt.ok, true);
  assert.equal(receipt.executed, false);
  assert.equal(receipt.dry_run, true);
  assert.equal(receipt.network_capable, true);
  assert.equal(receipt.domain_count, 3);
  assert.deepEqual(
    receipt.commands.map((command) => [command.domain, command.command]),
    [
      ["root", "npm ci"],
      ["docs", "npm ci --prefix docs"],
      ["mdkg-dev", "npm ci --prefix mdkg-dev"],
    ],
  );
});

test("smoke utility preflights dependency owners and contains no hidden install", () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
  const source = fs.readFileSync(path.join(repoRoot, "scripts", "mdkg-dev-smoke-utils.js"), "utf8");
  const preflightIndex = source.indexOf("assertDependencyTreesReady(repoRoot)");
  const buildIndex = source.indexOf('["--prefix", "mdkg-dev", "run", "build"]');

  assert.ok(packageJson.scripts.build.startsWith("npm run deps:preflight && "));
  for (const [name, script] of Object.entries(packageJson.scripts).filter(([name]) => name.startsWith("smoke:"))) {
    assert.ok(
      (typeof script === "string" && script.startsWith("npm run build && ")) ||
        (name === "smoke:bundle-import" && script === "npm run smoke:subgraph"),
      `${name} must route through the preflighted build or its canonical delegated smoke`,
    );
  }
  assert.ok(preflightIndex >= 0);
  assert.ok(buildIndex > preflightIndex);
  assert.equal(source.includes('["ci", "--prefix", "mdkg-dev"'), false);
  assert.equal(source.includes("ensureSiteDeps"), false);
});

test("help separates local preflight from registry-capable bootstrap", () => {
  const help = boundary.helpText();
  assert.match(help, /preflight[\s\S]*local-only and never installs packages/);
  assert.match(help, /bootstrap[\s\S]*may[\s\S]*access the configured registry/);
  assert.match(help, /NPM_CONFIG_OFFLINE=true/);
  assert.match(help, new RegExp(boundary.BOOTSTRAP_COMMAND.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});
