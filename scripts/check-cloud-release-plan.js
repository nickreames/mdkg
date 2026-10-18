#!/usr/bin/env node
// Repository planning guard; no release or execution authority is granted.
const fs = require("node:fs");
const path = require("node:path");
const { parseFrontmatter } = require("../dist/graph/frontmatter.js");
const { checkpointReadinessError, READINESS_TAGS } = require("../dist/graph/checkpoint_readiness.js");

function checkPlanNodes(nodes) {
  const errors = [];
  for (const [gateId, nextTask] of [["chk-674", "task-848"], ["chk-677", "task-852"], ["chk-680", null]]) {
    const gate = nodes.get(gateId);
    if (!gate || gate.type !== "checkpoint") { errors.push(`missing readiness checkpoint ${gateId}`); continue; }
    const tags = Array.isArray(gate.tags) ? gate.tags : [];
    if (tags.filter(tag => READINESS_TAGS.includes(tag)).length !== 1) errors.push(`${gateId}: readiness verdict must remain explicit`);
    const error = checkpointReadinessError({ type: gate.type, status: gate.status, tags });
    if (error) errors.push(`${gateId}: ${error}`);
    if (nextTask && !nodes.get(nextTask)?.blocked_by?.includes(gateId)) errors.push(`${nextTask}: must remain blocked_by ${gateId}`);
  }
  return { ok: errors.length === 0, errors };
}

function checkRoot(root) {
  const nodes = new Map();
  for (const filename of fs.readdirSync(path.join(root, ".mdkg/work"))) {
    if (!/^(?:chk-(?:674|677|680)|task-(?:848|852))-.*\.md$/.test(filename)) continue;
    const file = path.join(root, ".mdkg/work", filename);
    const { frontmatter } = parseFrontmatter(fs.readFileSync(file, "utf8"), file);
    if (nodes.has(frontmatter.id)) throw new Error(`duplicate planning ID ${frontmatter.id}`);
    nodes.set(frontmatter.id, frontmatter);
  }
  return checkPlanNodes(nodes);
}

if (require.main === module) {
  const result = checkRoot(path.resolve(__dirname, ".."));
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exitCode = 1;
}
module.exports = { checkPlanNodes, checkRoot };
