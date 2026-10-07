import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";

const read = (relative: string) => fs.readFileSync(path.resolve(relative), "utf8");
test("maintained bootstrap docs distinguish compact default and explicit graph-only setup", () => {
  for (const file of ["README.md", "docs/src/content/docs/start-here/install.md", "docs/src/content/docs/start-here/quickstart.md"]) {
    const body = read(file);
    assert.match(body, /mdkg init\n/, file);
    assert.match(body, /mdkg init --graph-only/, file);
    assert.match(body, /\.mdkg\/AGENT_START\.md/, file);
    assert.match(body, /--agent/, file);
    assert.doesNotMatch(body, /For a non-agent markdown graph only, run `mdkg init`/, file);
  }
});

test("maintained upgrade instructions require a reviewed plan hash", () => {
  for (const file of ["README.md", "docs/src/content/docs/start-here/install.md"]) {
    const body = read(file);
    assert.match(body, /mdkg upgrade --apply --plan-hash/, file);
    assert.doesNotMatch(body, /^mdkg upgrade --apply\s*$/m, file);
  }
});

test("focused agent discovery uses compact router and documents the concise profile alias", () => {
  const quickstart = read("docs/src/content/docs/start-here/quickstart.md");
  assert.match(quickstart, /mdkg pack WORK_ID --profile concise/);
  assert.match(quickstart, /--pack-profile` is an equivalent alias/);
  assert.match(quickstart, /neither\s+option changes traversal depth or node\/byte limits by itself/);
  const workflow = read("docs/src/content/docs/guides/agent-workflow.md");
  assert.match(workflow, /\.mdkg\/AGENT_START\.md/);
  assert.match(workflow, /mdkg skill search/);
  assert.match(workflow, /selected goal is a hint/i);
});
