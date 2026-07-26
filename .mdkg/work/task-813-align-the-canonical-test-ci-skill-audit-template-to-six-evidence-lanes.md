---
id: task-813
type: task
title: Align the canonical test CI skill audit template to six evidence lanes
status: backlog
priority: 1
parent: goal-78
next: test-472
tags: [loops, templates, tests, ci]
owners: []
links: []
artifacts: []
relates: [loop-7]
blocked_by: [test-464]
blocks: [test-472]
refs: [goal-78, loop-7, dec-86, chk-544]
context_refs: [goal-78, loop-7, dec-86, chk-544]
evidence_refs: []
aliases: []
skills: [build-pack-and-execute-task, pursue-mdkg-loop]
created: 2026-07-25
updated: 2026-07-25
---
# Overview

Align the reusable `test-ci-skill-infrastructure-audit` template with the
six-lane contract successfully dogfooded by `root:loop-7`. The current template
frontmatter declares five evidence identities while its body requires six rows.

# Acceptance Criteria

- Replace the template frontmatter lane list with:
  `local_test_build_inventory`, `ci_gate_inventory`, `smoke_coverage`,
  `skill_registry_mirror_integrity`, `harness_guidance_gaps`, and
  `prioritized_improvements`.
- Use the same six stable identities in the body evidence matrix.
- Preserve readonly mode, default child materialization, action boundaries,
  blocker continuation, and template purpose.
- Add a focused one-to-one validator so a missing, duplicate, renamed, or extra
  body/frontmatter lane fails with its identity.
- Update pre-run question identities only where needed to match the proven
  local-only fork contract; do not force provider or skill-edit authority.
- Do not mutate completed `root:loop-7`; its stored lineage remains historical.
- No source outside the canonical template and focused template/loop tests.

# Files Affected

- `.mdkg/templates/loops/test-ci-skill-infrastructure-audit.loop.md`
- focused loop-template identity/fork-readiness tests
- generated template index/cache only when normally produced and reviewed

# Implementation Notes

- Use `root:loop-7` and `root:dec-86` as dogfood evidence, not as mutable
  template state.
- The template remains a reusable audit and must not inherit repository-specific
  Node versions, file paths, historical checkpoints, or accepted decisions.
- A fork binds its own scope, questions, approvals, and evidence; the template
  supplies stable identities.

# Test Plan

- Run focused positive and per-lane negative identity tests.
- Dry-run a disposable fork and prove no writes/reservations.
- Create a disposable real fork in an isolated fixture, bind six lanes, and
  verify loop show/plan/next plus concise-pack readiness.
- Run full template/loop tests, graph validation, and Git hygiene checks.

# Links / Artifacts

- `root:goal-78`
- `root:test-472`
- `root:loop-7`
- `root:dec-86`
- `root:chk-544`
- `.mdkg/templates/loops/test-ci-skill-infrastructure-audit.loop.md`
