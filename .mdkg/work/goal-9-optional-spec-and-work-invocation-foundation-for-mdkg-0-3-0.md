---
id: goal-9
type: goal
title: optional SPEC and work invocation foundation for mdkg 0.3.0
status: done
priority: 1
goal_state: achieved
goal_condition: The goal is complete when mdkg ships optional SPEC validation and capability indexing, a dogfood CLI SPEC and WORK contract, deterministic work trigger/order/receipt verification helpers, optional project DB queue delivery proof, docs/templates/init/upgrade updates, package metadata bumped to 0.3.0, full prepublish gates, npm pack dry-run, and npm publish dry-run evidence without actually publishing.
scope_refs: [epic-53, epic-54, epic-55, epic-56, epic-57, epic-58, epic-59, epic-60, epic-61, epic-62, task-280, task-281, task-282, task-283, task-284, task-285, task-286, task-287, task-288, task-289, task-290, task-291, task-292, task-293, task-294, task-295, task-296, task-297, task-298, task-299, task-300, task-301, task-302, task-303, task-304, test-106, test-107, test-108, test-109, test-110, test-111, test-112, test-113, test-114, test-115, test-116, test-117, test-118]
last_active_node: task-304
required_skills: [pursue-mdkg-goal, select-work-and-ground-context, author-mdkg-skill, verify-close-and-checkpoint]
required_checks: [node dist/cli.js index, node dist/cli.js validate, node dist/cli.js goal show goal-9 --json, node dist/cli.js goal next goal-9 --json, node dist/cli.js capability list --kind spec --json, node dist/cli.js capability search "mdkg cli tool spec" --json, node dist/cli.js spec list --json, node dist/cli.js spec show <dogfood-spec-ref> --json, node dist/cli.js spec validate <dogfood-spec-ref> --json, node dist/cli.js work trigger <dogfood-work-or-capability-ref> --json, node dist/cli.js work order status <created-order> --json, node dist/cli.js work receipt verify <created-receipt> --json, npm run test, npm run cli:check, npm run smoke:capabilities, npm run smoke:archive-work, npm run smoke:db-queue-cli, npm run smoke:work-invocation, npm run prepublishOnly, npm pack --dry-run --json, npm publish --dry-run, git diff --check]
max_iterations: 36
blocked_after_attempts: 3
tags: [goal, spec, work, work-order, receipt, invocation, npm, release, prepublish]
owners: []
links: []
artifacts: [package.json, CHANGELOG.md, README.md, CLI_COMMAND_MATRIX.md, .mdkg/templates/default/spec.md, .mdkg/templates/default/work.md, .mdkg/templates/default/work_order.md, .mdkg/templates/default/receipt.md, artifact://tmp/mdkg-prepublish-0.3.0.log, artifact://tmp/mdkg-pack-dry-run-0.3.0.log, artifact://tmp/mdkg-publish-dry-run-0.3.0.log]
relates: [epic-53, epic-54, epic-55, epic-56, epic-57, epic-58, epic-59, epic-60, epic-61, epic-62]
blocked_by: []
blocks: [task-280, task-281, task-282, task-283, task-284, task-285, task-286, task-287, task-288, task-289, task-290, task-291, task-292, task-293, task-294, task-295, task-296, task-297, task-298, task-299, task-300, task-301, task-302, task-303, task-304, test-106, test-107, test-108, test-109, test-110, test-111, test-112, test-113, test-114, test-115, test-116, test-117, test-118]
refs: [epic-25, epic-26]
aliases: [mdkg-0-3-0-spec-work-invocation, optional-spec-work-invocation, spec-work-order-receipt-release, prepublish-spec-work-foundation]
skills: [pursue-mdkg-goal, select-work-and-ground-context, author-mdkg-skill, verify-close-and-checkpoint]
created: 2026-06-06
updated: 2026-06-06
---
# Objective

Turn the completed generic SPEC design foundation into a concrete 0.3.0
package-ready implementation lane. The release should make `SPEC.md` optional
but indexable, prevent documentation-only SPEC misuse, and connect reusable
capability specs to work contracts, work orders, and final receipts.

# End Condition

- Optional SPEC validation and capability indexing are implemented.
- Documentation-only SPEC misuse has actionable diagnostics.
- At least one mdkg CLI `SPEC.md` dogfood node is indexed as `kind: spec`.
- A matching `WORK.md` contract exists for at least one mdkg CLI capability.
- `mdkg work trigger <work-or-capability-ref>` creates a deterministic
  `WORK_ORDER.md`.
- `mdkg work order status` and `mdkg work receipt verify` expose deterministic
  JSON receipts.
- Optional project DB queue enqueue bridge is proven without executing work.
- Capability discovery connects SPEC, WORK, WORK_ORDER, and RECEIPT surfaces.
- Docs, templates, init assets, upgrade assets, help snapshots, and changelog
  describe the 0.3.0 behavior.
- Package metadata is bumped to `0.3.0`.
- Full local prepublish, `npm pack --dry-run --json`, and
  `npm publish --dry-run` pass.

# Non-Goals

- No actual npm publish.
- No LLM or runtime execution inside mdkg.
- No payment, ledger, marketplace, or production state mutation.
- No public product-specific naming in mdkg canonical docs.
- No exporter implementation beyond required command/help/template updates.

# Recursive Algorithm

```bash
node dist/cli.js goal show goal-9 --json
node dist/cli.js goal next goal-9 --json
node dist/cli.js goal claim goal-9 <work-id> --json
node dist/cli.js pack <work-id>
```

Work only the surfaced node, record evidence in that node, run the relevant
checks, evaluate the goal, and continue until the end condition is achieved or
a real blocker is recorded.

# Required Checks

- `node dist/cli.js index`
- `node dist/cli.js validate`
- `node dist/cli.js goal show goal-9 --json`
- `node dist/cli.js goal next goal-9 --json`
- `node dist/cli.js capability list --kind spec --json`
- `node dist/cli.js capability search "mdkg cli tool spec" --json`
- `node dist/cli.js work trigger <dogfood-work-ref> --json`
- `node dist/cli.js work order status <created-order> --json`
- `node dist/cli.js work receipt verify <created-receipt> --json`
- `npm run test`
- `npm run cli:check`
- `npm run smoke:capabilities`
- `npm run smoke:archive-work`
- `npm run smoke:db-queue-cli`
- `npm run prepublishOnly`
- `npm pack --dry-run --json`
- `npm publish --dry-run`
- `git diff --check`

# Current State

`goal-8` is achieved and documents the generic SPEC design foundation. Current
`capability list --kind spec` returns zero records because the live repo has
templates and design anchors but no concrete indexed SPEC nodes. Work lifecycle
helpers exist, but there is no high-level trigger/status/receipt verification
loop tied to SPEC capability discovery.

Design anchors for this goal are `edd-15`, `dec-26`, `dec-27`, and `dec-28`.

`task-280` completed the pre-mutation audit and confirmed the repo is still on
`0.2.0`, graph validation passes after index refresh, current public queue
commands exist, and the SPEC/WORK capability records and high-level invocation
commands are still open 0.3.0 work.

`task-281` defines the release boundary: 0.3.0 is justified by the new optional
SPEC capability track plus deterministic work invocation helpers, while actual
npm publish, tagging, pushing, and runtime execution stay out of scope for this
goal.

# Completion Evidence

- Optional SPEC validation and capability indexing are implemented:
  `capability list --kind spec --json` and `spec list --json` return
  `root:spec.mdkg-cli`, and `spec validate root:spec.mdkg-cli --json` passes.
- Documentation-only SPEC misuse diagnostics and no-SPEC compatibility are
  covered by `task-282`, `task-283`, `test-107`, and `test-108`.
- The dogfood mdkg CLI `SPEC.md` and matching WORK contract are indexed and
  linked by capability discovery; `capability search "mdkg cli tool spec"
  --json` returns the SPEC and linked WORK context.
- Deterministic work invocation is proven by `task-291` and `chk-69`; current
  closeout verified the generated dogfood order with
  `work order status root:order.goal-9-dogfood-trigger-task-291 --json`.
- Receipt verification is proven by `task-293`; current closeout verified
  `root:receipt.goal-9-dogfood-trigger-task-293` with `ok: true`.
- Optional project DB queue bridge proof is recorded on `task-294` and
  `test-114`.
- Docs, templates, init assets, upgrade assets, help snapshots, and changelog
  updates are recorded on `task-287`, `task-298`, `task-299`, `test-116`, and
  `task-301`.
- Package metadata reports `0.3.0` from `node dist/cli.js --version`, and
  `task-301` records package/changelog evidence.
- Full prepublish proof is recorded in
  `/private/tmp/mdkg-prepublish-0.3.0.log`, including `smoke:goal ok` and
  `publish readiness ok`.
- `npm pack --dry-run --json` proof is recorded in
  `/private/tmp/mdkg-pack-dry-run-0.3.0.log` for `mdkg@0.3.0`,
  `mdkg-0.3.0.tgz`, with 154 entries.
- `npm publish --dry-run` proof is recorded in
  `/private/tmp/mdkg-publish-dry-run-0.3.0.log`; npm reported registry
  publication only as `(dry-run)` and ended with `+ mdkg@0.3.0`.
- Current closeout checks passed: `node dist/cli.js index`,
  `node scripts/assert-publish-ready.js`, `node dist/cli.js validate --json`,
  `node dist/cli.js goal show goal-9 --json`,
  `node dist/cli.js goal next goal-9 --json`, capability/spec/order/receipt
  checks, and `git diff --check`.
- No real `npm publish`, tag, or push was run. The package is publish-ready,
  not published.
