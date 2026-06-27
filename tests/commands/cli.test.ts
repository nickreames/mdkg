import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import os from "os";
import { spawnSync } from "node:child_process";

const cliPath = path.resolve(__dirname, "..", "..", "cli.js");
const packageJsonPath = path.resolve(__dirname, "..", "..", "..", "package.json");
const repoRoot = path.resolve(__dirname, "..", "..", "..");

test("cli --version prints package version", () => {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8")) as { version: string };
  const result = spawnSync(process.execPath, [cliPath, "--version"], { encoding: "utf8" });
  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), pkg.version);
});

test("cli help pack centers the simplified profile and stats flags", () => {
  const result = spawnSync(process.execPath, [cliPath, "help", "pack"], { encoding: "utf8" });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /--profile <name>/);
  assert.match(result.stdout, /--list-profiles/);
  assert.match(result.stdout, /--stats/);
  assert.match(result.stdout, /--dry-run/);
  assert.match(result.stdout, /--skills <mode>/);
  assert.match(result.stdout, /--skills-depth <mode>/);
  assert.match(result.stdout, /Advanced shaping \/ debug flags:/);
});

test("cli pack --list-profiles works outside an initialized repo", () => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "mdkg-list-profiles-"));
  const result = spawnSync(process.execPath, [cliPath, "pack", "--list-profiles"], {
    encoding: "utf8",
    cwd,
  });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Built-in pack profiles:/);
  assert.match(result.stdout, /standard/);
  assert.match(result.stdout, /concise/);
  assert.match(result.stdout, /headers/);
});

test("cli usage errors show command-specific help", () => {
  const result = spawnSync(process.execPath, [cliPath, "pack", "task-1", "--max-tokens", "abc"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /--max-tokens must be an integer/);
  assert.match(result.stdout, /Usage:\n  mdkg pack <id-or-qid> \[options\]/);
});

test("cli help list/search/show/skill include json and namespace-only skill guidance", () => {
  const listHelp = spawnSync(process.execPath, [cliPath, "help", "list"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(listHelp.status, 0);
  assert.match(listHelp.stdout, /--tags <tag,tag,\.\.\.>/);
  assert.match(listHelp.stdout, /--tags-mode any\|all/);
  assert.match(listHelp.stdout, /--json\|--xml\|--toon\|--md/);
  assert.doesNotMatch(listHelp.stdout, /--type skill/);

  const searchHelp = spawnSync(process.execPath, [cliPath, "help", "search"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(searchHelp.status, 0);
  assert.match(searchHelp.stdout, /--tags <tag,tag,\.\.\.>/);
  assert.match(searchHelp.stdout, /--tags-mode any\|all/);
  assert.match(searchHelp.stdout, /--json\|--xml\|--toon\|--md/);

  const showHelp = spawnSync(process.execPath, [cliPath, "help", "show"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(showHelp.status, 0);
  assert.match(showHelp.stdout, /Use `mdkg skill show <slug>` for skills/);
  assert.match(showHelp.stdout, /--meta/);
  assert.match(showHelp.stdout, /--json\|--xml\|--toon\|--md/);
  assert.doesNotMatch(showHelp.stdout, /--body/);
  assert.match(showHelp.stdout, /Shows full body content/);

  const skillHelp = spawnSync(process.execPath, [cliPath, "help", "skill"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(skillHelp.status, 0);
  assert.match(skillHelp.stdout, /mdkg skill search "<query>".*--json\|--xml\|--toon\|--md/s);
  assert.match(skillHelp.stdout, /Skills are first-class under `mdkg skill \.\.\.`\./);

  const newHelp = spawnSync(process.execPath, [cliPath, "help", "new"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(newHelp.status, 0);
  assert.match(newHelp.stdout, /--skills <slug,slug,\.\.\.>/);
  assert.match(newHelp.stdout, /--id <portable-id>/);
  assert.match(newHelp.stdout, /Agent workflow file types/);
});

test("cli help capability documents read-only capability discovery", () => {
  const capabilityHelp = spawnSync(process.execPath, [cliPath, "help", "capability"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(capabilityHelp.status, 0);
  assert.match(capabilityHelp.stdout, /mdkg capability list/);
  assert.match(capabilityHelp.stdout, /mdkg capability search/);
  assert.match(capabilityHelp.stdout, /mdkg capability show/);
  assert.match(capabilityHelp.stdout, /skill, spec, work, core, design/);

  const workspaceHelp = spawnSync(process.execPath, [cliPath, "help", "workspace"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(workspaceHelp.status, 0);
  assert.match(workspaceHelp.stdout, /--visibility <level>/);
});

test("cli help spec documents optional reusable capability records", () => {
  const specHelp = spawnSync(process.execPath, [cliPath, "help", "spec"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(specHelp.status, 0);
  assert.match(specHelp.stdout, /mdkg spec list \[--json\]/);
  assert.match(specHelp.stdout, /mdkg spec show <id-or-qid-or-alias> \[--json\]/);
  assert.match(specHelp.stdout, /mdkg spec validate \[<id-or-qid-or-alias>\] \[--json\]/);
  assert.match(specHelp.stdout, /MANIFEST\.md is canonical and reusable-capability oriented; SPEC\.md remains a legacy alias/);

  const specValidateHelp = spawnSync(process.execPath, [cliPath, "help", "spec", "validate"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(specValidateHelp.status, 0);
  assert.match(specValidateHelp.stdout, /With no reference, validates the graph and all MANIFEST\.md\/SPEC\.md capability records/);
  assert.match(specValidateHelp.stdout, /With a reference, also ensures that the specific manifest capability exists/);
});

test("cli help work documents trigger status verify polish", () => {
  const workHelp = spawnSync(process.execPath, [cliPath, "help", "work"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(workHelp.status, 0);
  assert.match(workHelp.stdout, /mdkg work order new\|status\|update/);
  assert.match(workHelp.stdout, /mdkg work receipt new\|verify\|update/);
  assert.match(workHelp.stdout, /mdkg work validate \[<id-or-qid>\] \[--type <workflow-type>\] \[--json\]/);
  assert.match(workHelp.stdout, /work validate is read-only and reports typed workflow diagnostics/);

  const triggerHelp = spawnSync(process.execPath, [cliPath, "help", "work", "trigger"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(triggerHelp.status, 0);
  assert.match(triggerHelp.stdout, /mdkg work trigger work\.example --id order\.example-1 --requester user:\/\/example --json/);
  assert.match(triggerHelp.stdout, /Accepted targets: direct WORK\.md ref, or MANIFEST\.md\/SPEC\.md ref with exactly one resolvable work contract/);

  const orderHelp = spawnSync(process.execPath, [cliPath, "help", "work", "order"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(orderHelp.status, 0);
  assert.match(orderHelp.stdout, /work order status is read-only and reports deterministic JSON order state plus linked receipts/);

  const receiptHelp = spawnSync(process.execPath, [cliPath, "help", "work", "receipt"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(receiptHelp.status, 0);
  assert.match(receiptHelp.stdout, /work receipt verify is read-only and reports deterministic JSON linkage/);

  const validateHelp = spawnSync(process.execPath, [cliPath, "help", "work", "validate"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(validateHelp.status, 0);
  assert.match(validateHelp.stdout, /mdkg work validate \[<id-or-qid>\] \[--type manifest\|spec\|work\|work_order\|receipt\|feedback\|dispute\|proposal\] \[--json\]/);
  assert.match(validateHelp.stdout, /Read-only focused validation for agent workflow mirrors/);
});

test("cli help db documents project database boundaries", () => {
  const dbHelp = spawnSync(process.execPath, [cliPath, "help", "db"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(dbHelp.status, 0);
  assert.match(dbHelp.stdout, /mdkg db index rebuild \[--tolerant\] \[--json\]/);
  assert.match(dbHelp.stdout, /mdkg db init \[--json\]/);
  assert.match(dbHelp.stdout, /\.mdkg\/index` is the rebuildable graph cache/);
  assert.match(dbHelp.stdout, /\.mdkg\/db` is project application state/);
  assert.match(dbHelp.stdout, /db init` creates the generic layout and enables db config/);
  assert.match(dbHelp.stdout, /db init` does not create an active runtime SQLite database/);
  assert.match(dbHelp.stdout, /db migrate` creates\/updates the active runtime SQLite database/);
  assert.match(
    dbHelp.stdout,
    /db migrate` applies mdkg-owned foundation plus internal queue, event, receipt, reducer, and lease migrations/,
  );
  assert.match(dbHelp.stdout, /mdkg db queue create <queue> \[--paused\] \[--reason <text>\] \[--json\]/);
  assert.match(dbHelp.stdout, /mdkg db queue contract \[--json\]/);
  assert.match(dbHelp.stdout, /`mdkg db queue \.\.\.` exposes local durable queue delivery operations/);
  assert.match(dbHelp.stdout, /paused queues reject enqueue\/claim and can be sealed with explicit paused snapshot policy/);
  assert.match(
    dbHelp.stdout,
    /event rows are durable local history; receipts, reducers, and writer leases remain internal helper surfaces/,
  );
  assert.match(dbHelp.stdout, /no public `mdkg db event`, `mdkg db reducer`, or `mdkg db lease` CLI is exposed/);
  assert.match(dbHelp.stdout, /db verify` checks config, layout, SQLite integrity, migrations, and transient files/);
  assert.match(dbHelp.stdout, /db stats` reports table counts, migration state, DB size, and receipt counts/);
  assert.match(dbHelp.stdout, /mdkg db snapshot seal \[--queue-policy drain\|paused\] \[--json\]/);
  assert.match(dbHelp.stdout, /mdkg db snapshot dump \[--snapshot <path>\] \[--output <path>\] \[--json\]/);
  assert.match(dbHelp.stdout, /db snapshot \.\.\.` manages opt-in sealed checkpoints and review dumps/);
  assert.match(
    dbHelp.stdout,
    /no raw SQL, hosted queue\/event store, profile, public event\/reducer\/lease command, or publish behavior is exposed here/,
  );
  assert.match(dbHelp.stdout, /active `\.mdkg\/db\/runtime` and transient DB files are ignored by default/);

  const dbIndexHelp = spawnSync(process.execPath, [cliPath, "help", "db", "index"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(dbIndexHelp.status, 0);
  assert.match(dbIndexHelp.stdout, /mdkg db index verify \[--json\]/);
  assert.match(dbIndexHelp.stdout, /mdkg index` remains the compatibility shortcut/);

  const dbSnapshotHelp = spawnSync(process.execPath, [cliPath, "help", "db", "snapshot"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(dbSnapshotHelp.status, 0);
  assert.match(dbSnapshotHelp.stdout, /mdkg db snapshot verify \[--json\]/);
  assert.match(dbSnapshotHelp.stdout, /mdkg db snapshot diff <left-snapshot> <right-snapshot> \[--json\]/);
  assert.match(dbSnapshotHelp.stdout, /default queue policy is drain/);
  assert.match(dbSnapshotHelp.stdout, /snapshot dump\/diff are deterministic review aids/);

  const dbQueueHelp = spawnSync(process.execPath, [cliPath, "help", "db", "queue"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(dbQueueHelp.status, 0);
  assert.match(dbQueueHelp.stdout, /mdkg db queue enqueue <queue> <message-id> --payload-json <json>\|--payload-file <path>/);
  assert.match(dbQueueHelp.stdout, /mdkg db queue contract \[--json\]/);
  assert.match(dbQueueHelp.stdout, /mdkg db queue pause <queue>/);
  assert.match(dbQueueHelp.stdout, /contract is read-only adapter metadata/);
  assert.match(dbQueueHelp.stdout, /paused queues reject enqueue and claim/);
});

test("cli help init includes agent bootstrap and ignore-default controls", () => {
  const initHelp = spawnSync(process.execPath, [cliPath, "help", "init"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(initHelp.status, 0);
  assert.match(initHelp.stdout, /--agent/);
  assert.doesNotMatch(initHelp.stdout, /--omni/);
  assert.doesNotMatch(initHelp.stdout, /--llm/);
  assert.match(initHelp.stdout, /--no-update-ignores/);
  assert.doesNotMatch(initHelp.stdout, /--agents/);
  assert.doesNotMatch(initHelp.stdout, /--claude/);
});

test("cli help upgrade documents conservative dry-run/apply behavior", () => {
  const upgradeHelp = spawnSync(process.execPath, [cliPath, "help", "upgrade"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(upgradeHelp.status, 0);
  assert.match(upgradeHelp.stdout, /mdkg upgrade \[--dry-run\] \[--apply\] \[--json\]/);
  assert.match(upgradeHelp.stdout, /Preview upgrade changes/);
  assert.match(upgradeHelp.stdout, /--apply/);
});

test("cli upgrade rejects dry-run and apply together", () => {
  const result = spawnSync(process.execPath, [cliPath, "upgrade", "--dry-run", "--apply"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /choose either --dry-run or --apply/);
  assert.match(result.stdout, /mdkg upgrade \[--dry-run\] \[--apply\] \[--json\]/);
});

test("cli removed init flags fail with migration guidance", () => {
  for (const flag of ["--llm", "--agents", "--claude", "--omni"]) {
    const result = spawnSync(process.execPath, [cliPath, "init", flag], {
      encoding: "utf8",
      cwd: repoRoot,
    });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /removed; use `mdkg init --agent`/);
  }
});

test("cli help skill includes sync subcommand", () => {
  const skillHelp = spawnSync(process.execPath, [cliPath, "help", "skill"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(skillHelp.status, 0);
  assert.match(skillHelp.stdout, /mdkg skill sync \[--force\]/);
});

test("cli rejects multiple structured output flags on discovery commands", () => {
  const result = spawnSync(process.execPath, [cliPath, "list", "--json", "--xml"], {
    encoding: "utf8",
    cwd: repoRoot,
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /choose at most one output flag: --json, --xml, --toon, or --md/);
});
