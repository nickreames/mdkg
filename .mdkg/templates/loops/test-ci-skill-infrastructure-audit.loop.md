---
id: loop-6
type: loop
title: Test CI Skill Infrastructure Audit
status: todo
priority: 1
loop_mode: readonly
loop_role: template
scope_refs: []
scope_description: Repository or workspace selected for tests CI automation and SKILL.md infrastructure audit.
template_refs: []
materialization_mode: default_children
child_refs: []
pre_run_questions: [target_scope, local_ci_simulation_approved, skill_sync_allowed, generated_output_policy]
question_answer_refs: []
pre_approved_actions: [read_tests, inspect_ci_config, run_local_smokes, create_mdkg_evidence]
approval_gated_actions: [external_ci_calls]
required_actions: [read_tests, inspect_ci_config, run_local_smokes, create_mdkg_evidence]
requested_actions: [read_tests, inspect_ci_config, run_local_smokes, create_mdkg_evidence]
prohibited_actions: [ci_config_changes, skill_file_edits, push_publish_deploy]
action_approval_refs: []
evidence_lanes: [test_inventory, ci_gate_review, skill_infrastructure_review, gap_prioritization, recommendations]
evidence_lane_refs: []
lane_waiver_refs: []
lane_waiver_decision_refs: []
lane_waiver_approval_refs: []
run_refs: []
decision_refs: []
output_refs: []
approval_refs: []
evaluation_refs: []
definition_of_done: Test, CI, automation, and SKILL.md infrastructure lanes are reviewed or explicitly waived with prioritized improvements.
blocker_policy: spike_proposal_recommendation_continue
tags: [loop-template, audit, tests, ci, skills]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: [test-ci-skill-audit-loop]
skills: [pursue-mdkg-loop]
created: 2026-07-06
updated: 2026-07-06
---

# Operating Model

Run a read-only audit of tests, CI gates, automation scripts, and SKILL.md infrastructure. Look for brittle coverage, slow or missing gates, duplicate skill guidance, and reusable workflow gaps.

# Default Child Nodes

- Spike for test and CI inventory.
- Test nodes for missing coverage or smoke gates.
- Proposal node for skill consolidation and automation improvements.

# Definition Of Done

- Current local and CI verification surfaces are inventoried.
- Missing or weak gates are tied to user-facing or maintenance risk.
- SKILL.md duplication and consolidation opportunities are identified.
- Local smoke/unit/build commands, CI configuration, skill registry/mirrors, and
  harness guidance are reviewed or explicitly waived.
- Follow-up work is classified as definition-blocking or residual.

# Required Evidence Lanes

| Lane | Required | Evidence Needed | Status | Blocker | Recovery Node | Decision Or Waiver |
| --- | --- | --- | --- | --- | --- | --- |
| local test/build inventory | yes | package scripts and command receipts | todo | tool failure may occur | spike/proposal | none |
| CI gate inventory | yes | workflow/config/provider evidence | todo | provider access may need approval | spike/proposal | none |
| smoke coverage | yes | smoke scripts and gaps | todo | none | none | none |
| SKILL.md registry and mirrors | yes | canonical and mirrored skill review | todo | none | none | none |
| harness guidance gaps | yes | missing/duplicated instructions | todo | none | none | none |
| prioritized improvements | yes | risk/payoff ordering | todo | none | none | none |

# Pre-Run Questions

- Is CI provider access approved, or should the audit stay local-only?
- Are local tests/builds approved when they write caches or generated outputs?
- Should skill changes be in scope, or should this audit only create proposals?
- Which runtime/client mirrors must be considered authoritative projections?

# Pre-Approved Read-Only Actions

- Inspect package scripts, tests, CI configs, smoke scripts, skills, mirrors,
  generated docs, and mdkg graph.
- Run local tests/builds/smokes and mdkg validation commands that do not call
  external services.
- Create mdkg evidence, skill-improvement proposals, tasks, tests, and open
  questions.

# Approval-Gated Actions

- CI provider/API calls.
- Skill edits, mirror sync, source/test changes, generated updates, or
  dependency changes unless the loop scope explicitly allows implementation.

# Blocker Continuation

If CI provider access or external logs are unavailable, create a spike, propose
at least three ways to obtain evidence, recommend one path, record blocker
evidence, and continue local test, smoke, script, and skill review.

Do not mark the whole loop blocked while another test/CI/skill lane remains
actionable. Do not close the loop until required lanes are complete or linked to
accepted `decision_refs` or `approval_refs`.

# Closeout Matrix

Classify follow-up work as definition-blocking gate evidence, residual
automation improvement, accepted waiver, or false positive before marking the
loop done or blocked.
