const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");

// Installed-package fixture helpers only; no graph implementation imports.
function command(root, executable, args) {
  const result = spawnSync(executable, args, { cwd: root, env: process.env, encoding: "utf8", timeout: 60000, maxBuffer: 8 * 1024 * 1024 });
  assert.equal(result.status, 0, `${executable} ${args.join(" ")}\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}

function prepareWorkIdentity(bin, root, backend) {
  if (!backend) return;
  const file = path.join(root, ".mdkg/config.json");
  const config = JSON.parse(fs.readFileSync(file, "utf8"));
  config.index.backend = backend;
  fs.writeFileSync(file, JSON.stringify(config, null, 2) + "\n");
  const args = ["graph", "migrate", "--graph-id", crypto.randomUUID(), "--origin", crypto.randomUUID()];
  const plan = JSON.parse(command(root, bin, [...args, "--json"]));
  assert.deepEqual(plan.blocking, []);
  command(root, bin, [...args, "--apply", "--plan-hash", plan.plan_hash, "--json"]);
}

function snapshot(root) {
  const files = {};
  const visit = directory => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const absolute = path.join(directory, entry.name), relative = path.relative(root, absolute);
      if (entry.isDirectory()) { files[relative] = "directory"; visit(absolute); }
      else if (entry.isFile()) files[relative] = crypto.createHash("sha256").update(fs.readFileSync(absolute)).digest("hex");
      else throw new Error(`unexpected special fixture file: ${absolute}`);
    }
  };
  visit(root); return files;
}

function verifyWorkIdentity(bin, root, { backend, ids, links, orders, receipts }) {
  const cli = args => JSON.parse(command(root, bin, [...args, "--json"]));
  const nodes = Object.fromEntries(ids.map(id => [id, cli(["show", id]).item]));
  assert.equal(new Set(Object.values(nodes).map(node => node.stable_ref)).size, ids.length);
  for (const node of Object.values(nodes)) {
    assert.ok(node.identity?.graph_id && node.identity?.node_id && node.stable_ref, `missing identity: ${node.id}`);
    assert.equal(cli(["show", node.stable_ref]).item.id, node.id);
  }
  for (const [from, field, to] of links) {
    const body = fs.readFileSync(path.join(root, nodes[from].path), "utf8");
    const line = body.split("\n").find(line => line.startsWith(`${field}:`));
    assert.ok(line?.includes(nodes[to].stable_ref), `${from}.${field} must persist ${to}'s stable reference`);
  }
  // A normal mirror update must retain identity and leave the user's Git index
  // alone. Evidence sidecars and unknown input bytes must also survive.
  command(root, process.env.GIT || "git", ["add", "--", ...Object.values(nodes).map(node => node.path)]);
  const beforeMutation = snapshot(root), index = fs.readFileSync(path.join(root, ".git/index"));
  for (const id of orders) {
    cli(["work", "order", "update", nodes[id].stable_ref, "--status", "completed"]);
    assert.equal(cli(["show", id]).item.stable_ref, nodes[id].stable_ref);
  }
  assert.deepEqual(fs.readFileSync(path.join(root, ".git/index")), index);
  const afterMutation = snapshot(root);
  for (const [file, hash] of Object.entries(beforeMutation)) {
    if (file.startsWith(".mdkg/archive/") || file.startsWith("inputs/")) assert.equal(afterMutation[file], hash, file);
  }
  const results = [];
  for (const state of ["warm", "cold"]) {
    if (state === "cold") fs.rmSync(path.join(root, ".mdkg/index"), { recursive: true });
    const before = snapshot(root);
    for (const id of orders) {
      const status = cli(["work", "order", "status", nodes[id].stable_ref]);
      assert.equal(status.order.stable_ref, nodes[id].stable_ref);
      const workLink = links.find(link => link[0] === id && link[1] === "work_id");
      assert.equal(status.order.work_qid, `root:${workLink[2]}`);
      const expected = receipts.filter(receipt => links.some(link => link[0] === receipt && link[1] === "work_order_id" && link[2] === id));
      assert.equal(status.receipt_count, expected.length);
      assert.deepEqual(status.receipts.map(receipt => receipt.stable_ref).sort(), expected.map(id => nodes[id].stable_ref).sort());
    }
    for (const id of receipts) {
      const receipt = cli(["work", "receipt", "verify", nodes[id].stable_ref]);
      assert.equal(receipt.ok, true);
      assert.equal(receipt.receipt.stable_ref, nodes[id].stable_ref);
      const orderLink = links.find(link => link[0] === id && link[1] === "work_order_id");
      assert.equal(receipt.work_order.stable_ref, nodes[orderLink[2]].stable_ref);
    }
    assert.equal(cli(["work", "validate"]).ok, true);
    assert.equal(cli(["validate"]).ok, true);
    assert.deepEqual(snapshot(root), before, `${backend}/${state} read mutated fixture`);
    results.push({ backend, state, node_count: ids.length, order_count: orders.length, receipt_count: receipts.length, stable_links: links.length, git_index_preserved: true, evidence_bytes_preserved: true });
  }
  return results;
}

module.exports = { prepareWorkIdentity, verifyWorkIdentity };
