import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import test from "node:test";
import { makeTempDir, writeFile } from "../helpers/fs";
import { writeRootConfig } from "../helpers/config";
import { writeDefaultTemplates } from "../helpers/templates";
const { runCli, runCliAsync } = require("../../cli");
const { loadConfig } = require("../../core/config");
const { buildSkillsIndex } = require("../../graph/skills_indexer");
const { buildCapabilitiesIndex } = require("../../graph/capabilities_indexer");
const { runCapabilityListCommand, runCapabilitySearchCommand } = require("../../commands/capability");
const { runSkillSearchCommand, runSkillShowCommand } = require("../../commands/skill");
const { parseFrontmatter } = require("../../graph/frontmatter");
const { validateAgentFrontmatter } = require("../../graph/agent_file_types");
const { runWorkContractNewCommand } = require("../../commands/work");

function fixture(t: { after(fn: () => void): void }): string {
  const root = makeTempDir("mdkg-generic-boundary-");
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  writeRootConfig(root);
  writeDefaultTemplates(root);
  return root;
}

function inventory(root: string): unknown[] {
  const entries: unknown[] = [];
  function visit(dir: string): void {
    for (const name of fs.readdirSync(dir).sort()) {
      const file = path.join(dir, name), stat = fs.lstatSync(file);
      entries.push([path.relative(root, file), stat.mode,
        stat.isSymbolicLink() ? fs.readlinkSync(file) : stat.isFile()
          ? crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex") : "directory"]);
      if (stat.isDirectory()) visit(file);
    }
  }
  visit(root);
  return entries;
}

test("retired validation and pricing flags fail before output, cache or authored writes", async (t) => {
  const root = fixture(t), before = inventory(root);
  const cases = [
    ["validate", "--profile", "omni-room", "--out", "forbidden.txt"],
    ["validate", "--pack-profile=generic", "--json-out", "forbidden.json"],
    ["work", "validate", "--profile", "omni-room"],
    ["work", "validate", "--pack-profile=generic"],
    ["work", "contract", "new", "Sample", "--id", "work.sample", "--agent-id", "agent.sample",
      "--kind", "sample", "--inputs", "request:text:required", "--outputs", "result:text:required",
      "--pricing-model", "free"],
    ["new", "work", "Sample", "--pricing-model=quoted"],
    ["validate", "--out", "--pricing-model=free"],
    ["validate", "--json-out", "--pricing-model", "free"],
    ["work", "validate", "--type", "--pricing-model=free"],
  ];
  for (const execute of [runCli, runCliAsync]) {
    for (const args of cases) {
      const errors: string[] = [];
      const code = await execute([...args, "--root", root], {
        cwd: () => root, log: () => {}, error: (line: string) => errors.push(line),
      });
      assert.equal(code, 1, args.join(" "));
      assert.match(errors.join("\n"), /not supported/, args.join(" "));
      assert.deepEqual(inventory(root), before, args.join(" "));
    }
  }
});

test("ordinary noncommercial work contracts do not generate pricing fields", (t) => {
  const root = fixture(t);
  t.mock.method(console, "log", () => {});
  runWorkContractNewCommand({ root, title: "Sample", id: "work.sample", agentId: "agent.sample",
    kind: "sample", inputs: "request:text:required", outputs: "result:text:required", json: true });
  const workRoot = path.join(root, ".mdkg/work");
  const files = fs.readdirSync(workRoot, { recursive: true }).map(String).filter((file) => file.endsWith("WORK.md"));
  assert.equal(files.length, 1);
  assert.doesNotMatch(fs.readFileSync(path.join(workRoot, files[0]), "utf8"), /pricing_model/);
});

test("unknown skill fields are preserved without privileged namespace projection", (t) => {
  const root = fixture(t), file = path.join(root, ".mdkg/skills/example/SKILL.md");
  const body = "---\nname: example\ndescription: Generic guidance\nochatr_policy: unique-consumer-term\ncustom_policy: another-consumer-term\n---\n# Steps\nRead evidence.\n";
  writeFile(file, body);
  const before = inventory(root);
  const entry = buildSkillsIndex(root, loadConfig(root)).skills.example;
  assert.equal(Object.prototype.hasOwnProperty.call(entry, "ochatr"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(entry, "extensions"), false);
  assert.deepEqual(inventory(root), before);
});

test("orchestrated is generic and the removed runtime token has no alias", () => {
  const file = path.resolve("tests/fixtures/agent/valid/runtime-agent/MANIFEST.md");
  const body = fs.readFileSync(file, "utf8").replace(/runtime_mode: \S+/, "runtime_mode: orchestrated");
  const validate = (source: string) => validateAgentFrontmatter("manifest", parseFrontmatter(source, file).frontmatter, file);
  assert.doesNotThrow(() => validate(body));
  assert.throws(() => validate(body.replace("runtime_mode: orchestrated", "runtime_mode: room_orchestrated")), /runtime_mode/);
});

test("cached capability and skill discovery cannot revive removed namespace projections", (t) => {
  const root = fixture(t), config = loadConfig(root);
  const file = path.join(root, ".mdkg/skills/example/SKILL.md");
  writeFile(file, "---\nname: example\ndescription: Generic guidance\nochatr_policy: unique-consumer-term\ncustom_policy: another-consumer-term\n---\n# Steps\nRead evidence.\n");
  const capabilities = buildCapabilitiesIndex(root, config);
  const skill = capabilities.records.find((record: { kind: string }) => record.kind === "skill");
  skill.skill.extensions = { ochatr: { policy: "unique-consumer-term" }, other: { policy: "another-consumer-term" } };
  writeFile(path.join(root, ".mdkg/index/capabilities.json"), JSON.stringify(capabilities));
  const cachedSkills = buildSkillsIndex(root, config);
  cachedSkills.skills.example.extensions = skill.skill.extensions;
  cachedSkills.skills.example.ochatr = { ochatr_policy: "unique-consumer-term" };
  writeFile(path.join(root, ".mdkg/index/skills.json"), JSON.stringify(cachedSkills));
  const before = inventory(root);
  const lines: string[] = [];
  t.mock.method(console, "log", (line: string) => lines.push(line));
  const capture = (run: () => void) => { lines.length = 0; run(); return lines.join("\n"); };
  const listing = capture(() => runCapabilityListCommand({ root, kind: "skill", json: true, noReindex: true }));
  assert.doesNotMatch(listing, /extensions|unique-consumer-term|another-consumer-term/);
  for (const query of ["unique-consumer-term", "another-consumer-term"]) {
    const skills = JSON.parse(capture(() => runSkillSearchCommand({ root, query, json: true, noReindex: true })));
    assert.equal(skills.count, 0);
    const capabilities = JSON.parse(capture(() => runCapabilitySearchCommand({ root, query, json: true, noReindex: true })));
    assert.equal(capabilities.count, 0);
  }
  assert.doesNotMatch(capture(() => runSkillShowCommand({ root, slug: "example", metaOnly: true })), /ochatr|custom_policy|extensions/);
  assert.match(capture(() => runSkillShowCommand({ root, slug: "example" })), /ochatr_policy: unique-consumer-term/);
  assert.deepEqual(inventory(root), before);
});
