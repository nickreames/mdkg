// Trusted installed-package smoke commands. Native Git is fixture-bound; npm
// uses private configuration/cache. This is not an OS or credential sandbox.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { acceptOwnedGitFixture } = require("./qualification-git");
const { createOwnedFixture, finalizeFixture, isolatedFixtureEnvironment } = require("./qualification-fixture");
const { runFixtureProcess, runFixtureNode } = require("./qualification-process");
const { withVerifiedArtifact } = require("./qualification-artifact");

function createSmokeCommands(fixture, suppliedEnv = process.env) {
  fixture.assertOwned();
  const user = fixture.resolve("user.npmrc"), global = fixture.resolve("global.npmrc");
  for (const file of [user, global]) fs.writeFileSync(file, "audit=false\nfund=false\n", { flag: "wx", mode: 0o600 });
  const inherited = Object.fromEntries(Object.entries(suppliedEnv).filter(([key]) => !/^npm_config_/i.test(key)));
  const fixed = {
    npm_config_userconfig: user, NPM_CONFIG_USERCONFIG: user,
    npm_config_globalconfig: global, NPM_CONFIG_GLOBALCONFIG: global,
    npm_config_cache: fixture.resolve("npm-cache"), NPM_CONFIG_CACHE: fixture.resolve("npm-cache"),
    npm_config_dry_run: "false", NPM_CONFIG_DRY_RUN: "false",
    npm_config_audit: "false", npm_config_fund: "false", npm_config_update_notifier: "false",
  };
  const environment = Object.freeze(isolatedFixtureEnvironment({ ...inherited, ...fixed }));
  const fixtureGit = acceptOwnedGitFixture(fixture.root, environment);
  const npmCommand = suppliedEnv.npm_execpath || "npm";
  function checked(result, label, allowFailure) {
    if (result.status !== 0 && !allowFailure) throw new Error(`${label} failed with ${result.status}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
    return result;
  }
  function run(command, args, { cwd = fixture.root, env = {}, allowFailure = false, timeout = 120000 } = {}) {
    fixture.assertOwned();
    return checked(runFixtureProcess(fixture.root, command, args, {
      cwd, env: isolatedFixtureEnvironment({ ...environment, ...env, ...fixed }), timeout, maxBuffer: 16 * 1024 * 1024,
    }), `${command} ${args.join(" ")}`, allowFailure);
  }
  function npm(args, options) {
    // npm_execpath may name npm-cli.js or the release ladder's explicit proxy.
    // An operator-supplied executable is trusted tooling, not untrusted input.
    return /\.[cm]?js$/.test(npmCommand) ? run(process.execPath, [npmCommand, ...args], options) : run(npmCommand, args, options);
  }
  function node(bin, args, cwd, options = {}) {
    fixture.assertOwned();
    return checked(runFixtureNode(fixture.root, bin, args, { cwd,
      env: isolatedFixtureEnvironment({ ...environment, ...options.env, ...fixed }),
      nodeArgs: options.nodeArgs ?? [],
      timeout: options.timeout ?? 120000, maxBuffer: 16 * 1024 * 1024,
    }), `${bin} ${args.join(" ")}`, options.allowFailure);
  }
  function git(args, cwd, options = {}) {
    fixture.assertOwned();
    return checked(fixtureGit.run(cwd, args, options), `fixture Git ${args.join(" ")}`, options.allowFailure);
  }
  return Object.freeze({ environment, fixtureRoot: fixture.root, assertOwned: fixture.assertOwned, npm, node, git });
}

// The callbacks are trusted fixture code. Final success is returned only after
// artifact verification and owned cleanup, including on an ordinary test failure.
function runInstalledSmoke({ prefix, prepare, exercise, env = process.env }) {
  const fixture = createOwnedFixture({ base: env.MDKG_SMOKE_TMPDIR || undefined, prefix });
  let error, receipt, tarballHash;
  try {
    const commands = createSmokeCommands(fixture, env);
    // Preparation packs/delivers bytes but must not install them. Admission must
    // precede every consumer, including postinstall and a failed installation.
    const prepared = prepare(fixture.root, commands);
    const tarball = fixture.resolve(path.relative(fixture.root, prepared.tarballPath));
    const stat = fs.lstatSync(tarball);
    if (!stat.isFile() || stat.nlink !== 1) throw new Error("smoke tarball must be an independent regular file");
    tarballHash = crypto.createHash("sha256").update(fs.readFileSync(tarball)).digest("hex");
    receipt = withVerifiedArtifact(tarball, tarballHash, () => {
      const installed = prepared.install();
      return exercise(fixture.root, installed);
    }).result;
  } catch (failure) { error = failure; }
  const cleanup = finalizeFixture(fixture, { error });
  return { ...receipt, tarball_sha256: tarballHash, cleanup };
}

module.exports = { createSmokeCommands, runInstalledSmoke };
