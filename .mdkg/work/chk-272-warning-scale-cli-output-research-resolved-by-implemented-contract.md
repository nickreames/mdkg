---
id: chk-272
type: checkpoint
title: warning-scale CLI output research resolved by implemented contract
checkpoint_kind: audit
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [spike-12]
blocked_by: []
blocks: []
refs: [goal-23, spike-12, task-429, task-430, task-431, task-432, task-433, task-434, task-435, test-191, test-192, test-193, test-194, test-195]
context_refs: []
evidence_refs: [task-429, task-430, task-431, task-432, task-433, task-434, task-435, test-191, test-192, test-193, test-194, test-195]
aliases: []
skills: []
scope: [spike-12]
created: 2026-06-25
updated: 2026-06-25
---
# Summary

Resolved the stale `spike-12` research node for `goal-23`. The spike recommendation is no longer pending: the downstream `goal-23` implementation and test nodes already selected and proved the additive warning-scale output contract.

# Scope Covered

- `spike-12`
- `task-429` through `task-435`
- `test-191` through `test-195`

## Changed Surfaces

- mdkg graph state only.
- No source, scripts, docs, package metadata, changelog, generated docs, website files, tags, publishes, pushes, or global installs were changed in this readiness pass.

## Boundaries

- in scope: resolve stale spike state, record research findings, reactivate `goal-23`.
- out of scope: full `0.3.8` prepublish gate, version bump, release notes dating, real publish, push, tag, or source implementation.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded: yes.

# Decisions Captured

- The selected contract remains additive and compatibility-preserving.
- `mdkg validate --json` keeps full diagnostics by default and includes `warning_summary`.
- `--summary` plus `--limit <n>` provides bounded agent/CI output.
- `--json-out <path>` provides clean full JSON receipts while `--out <path>` remains the compatibility text report path.
- `mdkg format --headings --dry-run --summary --json --limit <n>` follows the same summary-first pattern.

# Implementation Summary

No new implementation was required. Existing completed work already implemented and tested the spike recommendation:

- `task-429`: warning summary and clean JSON receipt contract.
- `task-430`: validate warning summaries and `--json-out`.
- `task-431`: heading formatter summary mode.
- `task-432`: strict doctor, subgraph, and handoff remediation wording.
- `task-433`: multi-repo skill guidance.
- `task-434`: high-volume warning smoke.
- `task-435`: docs, command matrix, help, changelog, and publish-readiness alignment.

# Audit Findings

- Reviewed surfaces: `spike-12`, `goal-23`, tasks `429-435`, tests `191-195`, package smoke wiring, command docs/readiness references.
- Findings: the spike was stale in frontmatter/body only; its recommendations had already been implemented and tested.
- Residual risk: `goal-23` still requires `task-436` to run the full dry-run prepublish gate before closeout.

# Verification / Testing

## Command Evidence

- command: `node dist/cli.js task done spike-12 --checkpoint "warning-scale CLI output research resolved by implemented contract" --checkpoint-kind audit --json`
- result: created `chk-272` and set `spike-12` to `done`.
- command: `node dist/cli.js goal activate goal-23 --json`
- result: `goal-23` is active and `active_node` remains `task-436`.

## Pass / Fail Status

- status: pass

## Known Warnings

- `mdkg doctor --strict --json` may report the expected local-only `.mdkg/db/runtime/project.sqlite` warning when the runtime DB exists.

# Known Issues / Follow-ups

- `task-436` remains the next required node for full `0.3.8` dry-run prepublish evidence and goal closeout.

## Follow-up Refs

- `task-436`

# Links / Artifacts

- none

# Raw Content Safety

- This checkpoint summarizes graph/readiness evidence only and contains no raw secrets, raw prompts, raw payloads, provider data, or bulky runtime traces.
