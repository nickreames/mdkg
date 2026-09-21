import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
const { assertFocusedDiscovery, fileInventory, canonicalSkillInventories } = createRequire(import.meta.url)("../scripts/smoke-init.js");

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-init-discovery-proof-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: false }));
  function write(relative, content) {
    const file = path.join(root, relative); fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
  }
  for (const relative of ["AGENTS.md", "CLAUDE.md"]) write(relative, "[Router](.mdkg/AGENT_START.md)\n");
  write(".mdkg/AGENT_START.md", "[Layout](README.md) [External](https://example.invalid/)\n");
  write(".mdkg/README.md", "Synthetic layout.\n");
  write(".mdkg/llms.txt", "[Router](AGENT_START.md)\n");
  for (const base of [".mdkg", ".agents", ".claude"]) {
    write(`${base}/skills/example/SKILL.md`, "Synthetic skill.\n");
    write(`${base}/skills/example/references/example.md`, "Synthetic resource.\n");
  }
  return { root, write, skills: [{ slug: "example", links: [".mdkg/README.md"] }] };
}

test("installed discovery verifier binds local links and complete resource inventories observationally", t => {
  const { root, skills } = fixture(t), before = fileInventory(root);
  assert.deepEqual(assertFocusedDiscovery(root, skills), { skills: 1, local_links: 5, native_targets: 2 });
  assert.deepEqual(fileInventory(root), before);
});

for (const [label, corrupt, diagnostic] of [
  ["broken router link", f => f.write(".mdkg/AGENT_START.md", "[Missing](missing.md)"), /broken discovery link/],
  ["escaping router link", f => f.write("AGENTS.md", "[Outside](../outside.md)"), /escapes fixture/],
  ["missing skill link", f => { f.skills[0].links = ["missing.md"]; }, /broken discovery link/],
  ["missing native resource", f => fs.unlinkSync(path.join(f.root, ".agents/skills/example/references/example.md")), /native resource inventory differs/],
  ["changed native resource", f => f.write(".claude/skills/example/references/example.md", "Changed"), /native resource inventory differs/],
  ["extra native resource", f => f.write(".claude/skills/example/extra.md", "Extra"), /native resource inventory differs/],
  ["empty discovery", f => { f.skills = []; }, /must be discoverable/],
  ["escaping slug", f => { f.skills[0].slug = "../outside"; }, /every canonical skill exactly once/],
  ["duplicate discovery", f => { f.skills.push(f.skills[0]); }, /every canonical skill exactly once/],
]) {
  test(`installed discovery verifier rejects ${label}`, t => {
    const f = fixture(t); corrupt(f);
    assert.throws(() => assertFocusedDiscovery(f.root, f.skills), diagnostic);
  });
}

for (const mode of ["delete", "change"]) {
  test(`installed discovery verifier detects synchronized canonical and mirror resource ${mode}`, t => {
    const f = fixture(t), before = canonicalSkillInventories(f.root);
    for (const base of [".mdkg", ".agents", ".claude"]) {
      const relative = `${base}/skills/example/references/example.md`;
      if (mode === "delete") fs.unlinkSync(path.join(f.root, relative));
      else f.write(relative, "Incorrectly synchronized mutation");
    }
    assert.throws(() => assertFocusedDiscovery(f.root, f.skills, before), /preserve canonical resource bytes/);
  });
}
