import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import test from "node:test";

const require = createRequire(import.meta.url);
const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const { COMMAND_OPTIONS } = require("../dist/commands/option_contract.js");
const packageJson = JSON.parse(read("package.json"));

test("active homepage advertises observational Git, not retired mutation wrappers or unqualified OS support", () => {
  const home = read("mdkg-dev/src/pages/index.astro");
  assert.match(home, /command="mdkg git inspect --json"/);
  assert.doesNotMatch(home, /command="mdkg git (?:clone|fetch|push|materialize|closeout|push-ready)\b/);
  assert.doesNotMatch(home, /operatingSystem:\s*["']macOS, Linux, Windows["']/);
});

test("both agent guides reject consumer validation profiles and distinguish receipt evidence", () => {
  for (const path of ["docs/guides/agent-workflow.md", "docs/src/content/docs/guides/agent-workflow.md"]) {
    const text = read(path);
    assert.doesNotMatch(text, /mdkg (?:work )?validate --profile\b/, path);
    assert.match(text, /Consumer validation\s+profiles are not executed by mdkg/, path);
    assert.match(text, /structural\/local-evidence consistency/, path);
    assert.match(text, /not external execution, payment/, path);
  }
});

test("cache instructions distinguish observational projections from explicit persistent rebuilds", () => {
  const text = read("README.md");
  assert.doesNotMatch(text, /recoverable with `mdkg index` or by running a capability command/);
  assert.match(text, /capability reads do not\s+persist/i);
  assert.match(text, /`mdkg index`.*persist/s);
  assert.match(read("src/commands/capability.ts"), /persistReindex: false/);
  const matrix = read("CLI_COMMAND_MATRIX.md");
  assert.doesNotMatch(matrix, /rebuilt by `mdkg index` and by capability commands/);
  assert.match(matrix, /capability reads derive\s+current projections in memory and do not persist/);
});

test("structured output guidance matches the concrete command admission boundary", () => {
  const exporters = Object.entries(COMMAND_OPTIONS)
    .filter(([, options]) => options.includes("--xml"))
    .map(([command]) => command).sort();
  const expected = ["list", "search", "show", "skill list", "skill search", "skill show"];
  assert.deepEqual(exporters, expected);
  for (const path of ["CLI_COMMAND_MATRIX.md", "assets/init/CLI_COMMAND_MATRIX.md"]) {
    const text = read(path);
    assert.match(text, /not global output flags/, path);
    assert.match(text, /capability.*JSON-only/s, path);
    assert.match(text, /pack.*--format/s, path);
  }
  assert.match(read("CLI_COMMAND_MATRIX.md"), /kind: "capability\.resolve"/);
  assert.doesNotMatch(read("CLI_COMMAND_MATRIX.md"), /kind: "capability_resolve"/);
  const deferred = read("CLI_COMMAND_MATRIX.md").split("## Deferred follow-up work")[1];
  assert.doesNotMatch(deferred, /- (?:XML|TOON|Markdown) discovery\/show output/);
});

test("active event guidance does not imply removed Git materialization validates a graph", () => {
  const text = read("README.md");
  assert.doesNotMatch(text, /MCP and Git materialization/);
  assert.match(text, /Git inspection does not validate the graph/);
});

test("command example checks reject wrong-command options without executing commands", () => {
  const { matchMdkgCommand, contractIndex } = require("../scripts/check-doc-command-examples.js");
  const commands = contractIndex();
  for (const command of ["mdkg capability list --xml", "mdkg validate --profile omni-room", "mdkg index --json", "mdkg --help --unsupported", "mdkg show task-1 --root", "mdkg pack task-1 --format"]) {
    assert.equal(matchMdkgCommand(command, commands).ok, false, command);
  }
  for (const command of ["mdkg capability list --json", "mdkg show task-1 --xml", "mdkg pack task-1 --format json", 'mdkg task done task-1 --checkpoint "closed unit"']) {
    assert.equal(matchMdkgCommand(command, commands).ok, true, command);
  }
});

test("historical command exemption is explicit and confined to the changelog section", () => {
  const { historicalBoundaryLine } = require("../scripts/check-doc-command-examples.js");
  const source = "# Changelog\n\nCurrent candidate instructions\n\n## Historical version notes\n\nOlder release instructions\n";
  const path = fileURLToPath(new URL("docs/src/content/docs/project/changelog.md", root));
  assert.equal(historicalBoundaryLine(source, path), 5);
  assert.equal(historicalBoundaryLine(source, fileURLToPath(new URL("README.md", root))), undefined);
  assert.equal(historicalBoundaryLine("# Changelog\nCurrent instructions", path), undefined);
});

test("public safety guidance calls the filesystem findings deferred and unresolved, not fixed", () => {
  for (const path of ["README.md", "docs/start-here/safety-boundaries.md", "docs/src/content/docs/start-here/safety-boundaries.md", "mdkg-dev/src/pages/trust.astro"]) {
    const text = read(path);
    assert.match(text, /deferred and unresolved/i, path);
    assert.match(text, /ACL/, path);
    assert.match(text, /ancestor-directory/, path);
    assert.match(text, /one writer per checkout/i, path);
  }
  assert.doesNotMatch(read("mdkg-dev/src/pages/trust.astro"), /runtime SQLite files are rebuildable/);
});

test("both install guides show compact default init and a reviewed upgrade hash", () => {
  for (const path of ["docs/start-here/install.md", "docs/src/content/docs/start-here/install.md"]) {
    const text = read(path);
    assert.ok(text.includes(packageJson.engines.node), path);
    assert.match(text, /mdkg init\n/, path);
    assert.match(text, /mdkg init --graph-only/, path);
    assert.match(text, /mdkg init --agent/, path);
    assert.match(text, /mdkg upgrade --apply --plan-hash/, path);
    assert.ok(text.includes(`unpublished ${packageJson.version} candidate`), path);
  }
});

test("published changelog chronology is retained with an explicit candidate boundary", () => {
  const text = read("docs/src/content/docs/project/changelog.md");
  assert.ok(text.includes(`## \`${packageJson.version}\` candidate`));
  assert.match(text, /Draft, unpublished and awaiting complete qualification/);
  assert.match(text, /Historical version notes/);
  assert.match(text, /## 0\.5\.2 details/);
  assert.match(text, /mdkg git materialize --request/);
  assert.match(read("CHANGELOG.md"), /## 0\.5\.2 - 2026-07-15/);
});

test("recovery guidance retains exact evidence and explicit operator confirmation", () => {
  for (const path of ["README.md", "CLI_COMMAND_MATRIX.md", "docs/advanced-alpha/graph-movement.md", "docs/src/content/docs/advanced-alpha/graph-movement.md"]) {
    const text = read(path);
    assert.match(text, /--confirm-quiescent/, path);
    assert.match(text, /--lock-evidence/, path);
    assert.match(text, /read.only/, path);
  }
});
