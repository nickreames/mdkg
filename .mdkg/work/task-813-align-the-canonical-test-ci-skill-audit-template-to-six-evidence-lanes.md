---
id: task-813
type: task
title: Align the canonical test CI skill audit template to six evidence lanes
status: done
priority: 4
parent: goal-78
next: test-472
tags: [loops, templates, tests, ci]
owners: []
links: []
artifacts: [.mdkg/artifacts/goal-78/test-ci-audit-template-verification.json]
relates: [loop-7]
blocked_by: [test-464]
blocks: [test-472]
refs: [goal-78, loop-7, dec-86, chk-544, chk-558]
context_refs: [goal-78, loop-7, dec-86, chk-544]
evidence_refs: [chk-558]
aliases: []
skills: [build-pack-and-execute-task, pursue-mdkg-loop]
created: 2026-07-25
updated: 2026-07-26
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
- Declare exactly five pre-run question identities:
  `scope_and_exclusions`, `ci_evidence_source_policy`,
  `local_execution_budget`, `authoritative_skill_projection_contract`, and
  `generated_output_policy`.
- Preserve the dogfooded action vocabulary. Required, requested, and
  pre-approved actions are exactly:
  `inspect_tests_and_build_configuration`, `inspect_ci_configuration`,
  `inspect_automation_scripts`, `inspect_skill_registry_and_projections`,
  `inspect_harness_guidance`, `run_local_node24_verification`, and
  `create_mdkg_evidence_and_followups`.
- Keep `external_ci_provider_calls` and
  `external_network_or_registry_calls` approval-gated and unrequested. Keep
  prohibited actions generic and template-safe: functional implementation,
  dependency replacement, tracked generated-output mutation, existing
  consumer mutation, unrelated graph/selection mutation, and
  publication/deployment are never implied by the read-only template.
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
- Do not run the repository release ladder for this focused template proof; it
  shares the one Goal 78 closeout execution.

# Links / Artifacts

- `root:goal-78`
- `root:test-472`
- `root:loop-7`
- `root:dec-86`
- `root:chk-544`
- `.mdkg/templates/loops/test-ci-skill-infrastructure-audit.loop.md`
