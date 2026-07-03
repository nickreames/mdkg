---
id: chk-342
type: checkpoint
title: seeded contract template schema release planning goal
checkpoint_kind: handoff
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [goal-48]
blocked_by: []
blocks: []
refs: []
context_refs: [goal-48, task-631, task-632, task-633, task-634, task-635, task-636, test-330, test-331, test-332]
evidence_refs: []
aliases: []
skills: []
scope: [goal-48, task-631, task-632, task-633, task-634, task-635, task-636, test-330, test-331, test-332]
created: 2026-07-02
updated: 2026-07-02
---
# Summary

Seeded a child-owned mdkg planning goal for generic MANIFEST/WORK/WORK_ORDER
and RECEIPT contract template/schema release support needed by Omni Room
consumers.

The seeded goal is `goal-48`, status `todo`, goal_state `paused`. It is not
done or achieved. The scoped tasks/tests remain todo and define future planning
and validation work only.

# Scope Covered

- `goal-48`
- `task-633`: release-candidate inventory and current mdkg surface audit
- `task-631`: generic workflow-file release-surface classification
- `task-632`: profile-aware validation and candidate field planning
- `task-634`: scaffold, upgrade, and docs behavior planning
- `task-635`: runtime consumer dependency-boundary planning
- `task-636`: warning, strict-doctor, release-validation, and closeout planning
- `test-330`: profile field and warning validation plan
- `test-331`: scaffold/upgrade/default-asset gating validation plan
- `test-332`: package/release and consumer handoff validation plan

## Changed Surfaces

- New mdkg work/checkpoint planning nodes under `.mdkg/work/**`.
- mdkg command events may update `.mdkg/work/events/events.jsonl`.
- No functional source, package, README, CLI docs, generated docs, templates,
  skills, init assets, seed/default assets, root graph files, npm state, push,
  merge, or deploy changed in this pass.

Exact intended changed mdkg files for the seed commit:

- `.mdkg/work/goal-48-plan-generic-mdkg-contract-template-schema-release-for-omni-room-support.md`
- `.mdkg/work/task-633-inventory-omni-room-contract-release-candidates-and-current-mdkg-surfaces.md`
- `.mdkg/work/task-631-classify-generic-manifest-work-work-order-receipt-release-surfaces.md`
- `.mdkg/work/task-632-plan-profile-aware-validation-and-contract-field-candidates.md`
- `.mdkg/work/task-634-plan-scaffold-upgrade-and-documentation-behavior-for-contract-profiles.md`
- `.mdkg/work/task-635-define-consumer-runtime-dependency-boundaries-for-unreleased-contract-support.md`
- `.mdkg/work/task-636-plan-warning-output-strict-doctor-and-release-validation-gates.md`
- `.mdkg/work/test-330-validate-contract-profile-fields-and-redaction-warnings-before-release.md`
- `.mdkg/work/test-331-validate-scaffold-upgrade-behavior-keeps-default-assets-gated.md`
- `.mdkg/work/test-332-validate-package-release-gates-and-consumer-dependency-handoff.md`
- `.mdkg/work/chk-342-seeded-contract-template-schema-release-planning-goal.md`

Generated index cleanup:

- `mdkg index` rewrote `.mdkg/index/mdkg.sqlite`.
- Restored only `.mdkg/index/mdkg.sqlite` to the pre-run tracked state before
  staging.
- Checked for `.mdkg/index/*.tmp-journal`; no tmp-journal file existed at
  cleanup time.
- No `.mdkg/index/**` file is intended for staging or commit.

## Boundaries

- in scope: child repo mdkg planning nodes and command event-log provenance.
- out of scope: source implementation, package metadata, public docs,
  templates, skills, assets/init, seed/default assets, root subgraph state,
  npm publish/version bump, push, merge, deploy, and downstream repo mutation.
- raw secrets, raw prompts, raw payloads, provider dumps, runtime state roots,
  and bulky execution traces excluded: yes.

# Decisions Captured

- This checkpoint captures only seeding evidence. It does not accept
  `contract_profile`, `receipt_kind`, or `redaction_class` as final schema
  names.
- `goal-48` remains paused/todo so later implementation does not start
  accidentally.
- Seed/default asset changes remain explicitly gated for a later mdkg-owned
  execution goal.
- The root handoff named `mdkg-goal-completion-hygiene`, but the current child
  repo skill registry contains only local slugs for `select-work-and-ground-context`,
  `verify-close-and-checkpoint`, `pursue-mdkg-goal`, `build-pack-and-execute-task`,
  and `author-mdkg-skill`; the structured skill refs use only registered local
  slugs.

# Implementation Summary

Created one paused/todo child goal and scoped todo tasks/tests that preserve the
root handoff boundary: mdkg owns generic contract template/schema release
planning before runtime consumes stable behavior.

# Handoff Summary

- Recipient/context: future mdkg-internal agent resuming `goal-48`.
- Starting node or command: inspect `goal-48`, then start `task-633` only after
  explicit authorization to resume the paused goal.
- Explicit boundaries: planning-only until resumed; no hardcoded future mdkg
  version; no source/template/default asset/downstream mutation from this seed.

# Verification / Testing

## Command Evidence

- `git status --short --branch`: branch `main...origin/main [ahead 12]` with
  only the 11 intended new `.mdkg/work/**` files dirty before staging.
- `mdkg status --json`: `ok: true`, `level: warn`; warnings were expected for
  dirty worktree, stale generated index/cache, and the pre-existing selected
  achieved `goal-44`.
- `mdkg index`: completed and wrote `global.json`, `skills.json`,
  `capabilities.json`, `subgraphs.json`, and `mdkg.sqlite`; generated sqlite
  output was then restored because `.mdkg/index/**` is outside this goal's
  approved commit scope.
- `mdkg validate --changed-only --json`: `ok: true`, `warning_count: 0`,
  `error_count: 0`.
- `mdkg validate --summary --limit 20 --json`: `ok: true`, `warning_count: 2`,
  `error_count: 0`; warnings were generated cache staleness after restoring
  `.mdkg/index/mdkg.sqlite` and the existing `.mdkg/work/mdkg-cli/SPEC.md`
  legacy MANIFEST compatibility warning.
- `git diff --check`: passed with no output.
- `git diff --cached --name-status`: listed only the 11 intended
  `.mdkg/work/**` additions; no `.mdkg/index/**`, source, package, docs,
  template, skill, init asset, seed/default, root graph, generated docs, or
  downstream repo path was staged.

## Pass / Fail Status

- Seed validation passed with known warnings only before local commit.

## Known Warnings

- `mdkg status --json` before seeding warned that the previously selected
  local goal was already achieved. This seed did not change selected-goal
  state.
- `.mdkg/index/mdkg.sqlite` is tracked in this child repo; the required
  `mdkg index` may dirty it. It is outside the allowed commit scope and should
  not be staged for this seed commit.
- `mdkg-goal-completion-hygiene` was named in the root handoff but is not a
  registered local child skill slug; structured skill refs use only local valid
  slugs.

# Known Issues / Follow-ups

- Resume `goal-48` only when mdkg-internal planning execution is explicitly
  authorized.
- The first resumed node should be `task-633`.

## Follow-up Refs

- `goal-48`
- `task-633`
- `task-631`
- `task-632`
- `task-634`
- `task-635`
- `task-636`
- `test-330`
- `test-331`
- `test-332`

# Local Commit And No-Push Status

- Stage only the 11 intended `.mdkg/work/**` files listed above.
- Confirmed `git diff --cached --name-status` contained no `.mdkg/index/**`,
  source, package, docs, template, skill, init asset, seed/default, root graph,
  generated docs, or downstream repo path.
- Commit locally with message `mdkg: seed contract release planning goal`.
- No push performed. The final agent closeout reports the local commit SHA
  instead of embedding a self-referential commit hash in this checkpoint.

# Links / Artifacts

- Root handoff reviewed:
  `/Users/nick/omni-chat-rooms/.mdkg/pack/handoff_root_goal_41_mdkg_release.md`
- Root boundary handoff reviewed:
  `/Users/nick/omni-chat-rooms/.mdkg/pack/handoff_root_task_398_boundary.md`
- Root source node reviewed:
  `/Users/nick/omni-chat-rooms/.mdkg/work/goal-41-plan-mdkg-cli-template-schema-release-for-omni-room-contract-support.md`
- Root source node reviewed:
  `/Users/nick/omni-chat-rooms/.mdkg/work/task-398-create-backend-mdkg-and-root-follow-up-boundary-handoff.md`

# Raw Content Safety

- Evidence is summarized with refs and paths. No raw secrets, raw prompts, raw
  payloads, provider dumps, or bulky runtime traces are stored here.
