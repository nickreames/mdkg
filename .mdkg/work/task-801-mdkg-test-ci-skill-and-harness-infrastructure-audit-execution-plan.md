---
id: task-801
type: task
title: mdkg test CI skill and harness infrastructure audit execution plan
status: done
priority: 1
parent: loop-7
tags: [loop-template, audit, tests, ci, skills, loop-fork, loop-child, task]
owners: []
links: []
artifacts: [.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/prioritized-recommendations.md]
relates: [loop-7]
blocked_by: []
blocks: []
refs: [loop-7, spike-32, test-461, dec-86, template://loops/test-ci-skill-infrastructure-audit]
context_refs: [root:dec-86, root:chk-426, root:chk-512, root:chk-531, root:chk-540, root:dec-85]
evidence_refs: [chk-541, chk-542]
aliases: []
skills: [pursue-mdkg-loop]
created: 2026-07-17
updated: 2026-07-17
---
# Overview

Synthesize the completed static inventory and current local verification
receipts into one deduplicated, risk-ordered improvement plan. This child
creates bounded mdkg recommendations and justified follow-up tasks/tests; it
does not implement them.

# Inputs

- Completed inventory and artifacts from `spike-32`.
- Completed command receipts and audit checkpoint from `test-461`.
- Accepted authority and exclusions in `dec-86`.
- Historical context refs on `root:loop-7`, used only to explain ownership and
  intentional divergence.

# Files Affected

- `.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/prioritized-recommendations.md`
- New mdkg task/test/proposal nodes only when justified by completed evidence.
- `root:loop-7` output/evidence refs during final closeout preparation.

# Implementation Notes

This is evidence synthesis, not functional implementation. Preserve the
single-writer boundary, keep raw logs in the dedicated temporary root, and use
root-qualified refs when linking evidence or follow-up nodes.

# Prioritization Contract

Classify every validated finding as one of:

- P0 definition/release correctness blocker;
- P1 material maintainability, coverage, projection, or harness risk;
- P2 efficiency or clarity improvement;
- accepted intentional divergence;
- false positive; or
- evidence limitation requiring a recovery node.

For each actionable item record source evidence, user/maintenance risk, owning
surface, proposed task or test, acceptance criteria, local validation command,
dependencies, and whether it blocks audit closure. Deduplicate symptoms that
share one root cause.

# Follow-Up Node Policy

- Create only source-backed task/test nodes with decision-complete acceptance
  criteria and evidence refs.
- Prefer a test node when the gap is missing verification and a task when the
  gap is infrastructure or guidance work.
- Use a proposal only when a non-trivial choice remains; record at least three
  viable paths and one recommendation.
- Add residual follow-ups to the loop's future `output_refs`, not
  `child_refs`, unless they are required to complete an evidence lane.
- Do not edit source, tests, CI, skills, mirrors, seeds, dependencies, or
  generated outputs.

# Acceptance Criteria

- Every inventory and validation finding is classified and deduplicated.
- Ordering is explicit by risk, payoff, effort, and owning surface.
- Every created task/test has acceptance criteria, validation commands, and
  refs back to `root:loop-7` plus its source evidence.
- Definition-blocking evidence gaps are separated from residual implementation
  work.
- `.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/prioritized-recommendations.md`
  contains the final ordering.
- No functional tracked path changes.

# Findings And Classification

- P0 release correctness: a stale literal-heading assertion makes both current
  release ladders fail during local `npm pack`; remediation is
  `root:task-802` with proof `root:test-462`.
- P1 release determinism/performance: nested dependency state, one conditional
  child install, 34 pack sites, and estimated 87/12/17 root/docs/mdkg-dev
  builds share one root cause; remediation is `root:task-803` with proof
  `root:test-463`.
- P1 coverage: 658 compiled tests pass at 89.67/77.27/96.24, but 18 MJS tests,
  thresholds, durable output, and release gating are absent; remediation is
  `root:task-804` with proof `root:test-464`.
- P1 skill projection: configured mirrors pass, while three public seeds lack
  an explicit currentness policy; remediation is `root:task-805` with proof
  `root:test-465`.
- P1 CI topology: smoke breadth, alias expansion, timeouts, tracked-drift
  checks, and structural workflow validation require a non-trivial choice;
  three paths and the staged risk-tier recommendation are in `root:prop-9`.
- P2 harness guidance: active-loop routing, tracked-index language, and command
  test guidance are corrected together by `root:task-806` and
  `root:test-466`.
- Accepted intentional divergence: public absence of `release-mdkg-package`
  under `root:dec-85`; no finding.
- Passes/false positives: managed mirrors are exact, skill validation is clean,
  `--pack-profile concise` works, and fixture URL literals are not network
  calls.
- Evidence limitations: no provider/registry calls, exact Ubuntu/Node 24.15
  execution, clean `npm ci`, or post-first-smoke prepublish execution. These are
  bounded by the accepted local evidence policy and have explicit residual
  proof nodes; no waiver is needed.

# Follow-Up Graph

- `root:task-802` -> `root:test-462`
- `root:task-803` -> `root:test-463`
- `root:task-804` -> `root:test-464`
- `root:task-805` -> `root:test-465`
- `root:task-806` -> `root:test-466`
- `root:prop-9` after the build/coverage prerequisites

All follow-ups relate to `root:loop-7`, retain decision-complete acceptance or
proposal options, and remain residual outputs rather than `child_refs`.

# Closeout Handoff

After this task is done, create a final audit checkpoint that references all
three child receipts and seven compact artifacts. Bind that checkpoint to all
six loop evidence identities. Put the validation execution checkpoint in
`run_refs`, keep `test-461` in `evaluation_refs`, and link recommendation and
follow-up nodes through `output_refs`.

# Test Plan

- Reconcile every recommendation against the spike and test receipts.
- Verify all follow-up refs resolve and are not promoted into loop children by
  default.
- Re-run `mdkg loop plan root:loop-7 --json`, changed-only/full graph
  validation, `git diff --check`, and the tracked-path boundary review.
- Do not close `root:loop-7` until all evidence identities are completed or
  validly waived and `closeout.ready` is true.

# Links / Artifacts

- `root:loop-7`
- `root:spike-32`
- `root:test-461`
- `root:dec-86`
- `.mdkg/artifacts/loop-7/test-ci-skill-infrastructure/prioritized-recommendations.md`
- Template: `template://loops/test-ci-skill-infrastructure-audit`
- `root:task-802`, `root:test-462`
- `root:task-803`, `root:test-463`
- `root:task-804`, `root:test-464`
- `root:task-805`, `root:test-465`
- `root:task-806`, `root:test-466`
- `root:prop-9`
