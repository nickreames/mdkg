import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { spawnSync } from "node:child_process";
import { makeTempDir } from "../helpers/fs";

const cliPath = path.resolve(__dirname, "..", "..", "cli.js");

function run(args: string[], cwd: string): { stdout: string; stderr: string } {
  const result = spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, `${args.join(" ")}\n${result.stderr}\n${result.stdout}`);
  return { stdout: result.stdout.trim(), stderr: result.stderr.trim() };
}

function updateFrontmatter(filePath: string, replacements: Record<string, string>): void {
  const content = fs.readFileSync(filePath, "utf8");
  const next = content.replace(/^---\n([\s\S]*?)\n---/, (_match, rawFrontmatter) => {
    const lines = rawFrontmatter.split(/\r?\n/).map((line: string) => {
      for (const [key, value] of Object.entries(replacements)) {
        if (line.startsWith(`${key}:`)) {
          return `${key}: ${value}`;
        }
      }
      return line;
    });
    return `---\n${lines.join("\n")}\n---`;
  });
  fs.writeFileSync(filePath, next, "utf8");
}

test("capability command lists searches and shows cached capability records", () => {
  const root = makeTempDir("mdkg-capability-cli-");
  run(["init", "--agent"], root);
  run(
    [
      "skill",
      "new",
      "capability-routing",
      "Capability Routing",
      "--description",
      "use when routing capability work",
      "--tags",
      "stage:execute,capability",
      "--json",
    ],
    root
  );
  const spec = JSON.parse(
    run(["new", "spec", "Capability Worker", "--id", "agent.capability-worker", "--json"], root)
      .stdout
  ).node;
  const work = JSON.parse(
    run(["new", "work", "Capability Route", "--id", "work.capability-route", "--json"], root)
      .stdout
  ).node;
  updateFrontmatter(path.join(root, work.path), {
    agent_id: "agent.capability-worker",
    required_capabilities: "[capability.routing]",
    skill_refs: "[capability-routing]",
  });
  updateFrontmatter(path.join(root, spec.path), {
    work_contracts: `[${path.basename(path.dirname(work.path))}/WORK.md]`,
    requested_capabilities: "[capability.routing]",
    skill_refs: "[capability-routing]",
    relates: "[work.capability-route]",
  });
  const order = JSON.parse(
    run([
      "work",
      "order",
      "new",
      "Capability Route Order",
      "--id",
      "order.capability-route",
      "--work-id",
      "work.capability-route",
      "--requester",
      "user://CapabilityRequester",
      "--queue-refs",
      "queue://project-db/capability/order.capability-route",
      "--json",
    ], root).stdout
  ).node;
  run([
    "work",
    "receipt",
    "new",
    "Capability Route Receipt",
    "--id",
    "receipt.capability-route",
    "--work-order-id",
    order.id,
    "--outcome",
    "success",
    "--proof-refs",
    "proof://capability",
    "--evidence-hashes",
    "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "--json",
  ], root);

  const indexOutput = run(["index"], root).stdout;
  assert.match(indexOutput, /capabilities index written/);

  const list = JSON.parse(run(["capability", "list", "--kind", "skill", "--json"], root).stdout);
  assert.equal(list.kind, "capability");
  assert.ok(list.items.some((item: { slug?: string }) => item.slug === "capability-routing"));

  const search = JSON.parse(
    run(["capability", "search", "capability routing", "--kind", "work", "--json"], root)
      .stdout
  );
  assert.ok(search.items.some((item: { id: string }) => item.id === "work.capability-route"));

  const chainSearch = JSON.parse(
    run(["capability", "search", "SPEC WORK_ORDER RECEIPT", "--kind", "work", "--json"], root)
      .stdout
  );
  const chainedWork = chainSearch.items.find((item: { id: string }) => item.id === "work.capability-route");
  assert.ok(chainedWork);
  assert.deepEqual(chainedWork.linkage.spec_qids, ["root:agent.capability-worker"]);
  assert.deepEqual(chainedWork.linkage.work_order_qids, ["root:order.capability-route"]);
  assert.deepEqual(chainedWork.linkage.receipt_qids, ["root:receipt.capability-route"]);

  const shown = JSON.parse(run(["capability", "show", "capability-routing", "--json"], root).stdout);
  assert.equal(shown.item.slug, "capability-routing");
});

test("capability command auto-restores a missing capability cache", () => {
  const root = makeTempDir("mdkg-capability-cli-missing-cache-");
  run(["init", "--agent"], root);
  run(["index"], root);
  fs.rmSync(path.join(root, ".mdkg", "index", "capabilities.json"), { force: true });

  const list = JSON.parse(run(["capability", "list", "--kind", "core", "--json"], root).stdout);
  assert.ok(list.count > 0);
  assert.equal(fs.existsSync(path.join(root, ".mdkg", "index", "capabilities.json")), true);
});
