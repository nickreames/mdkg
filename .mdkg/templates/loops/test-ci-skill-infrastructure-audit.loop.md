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
pre_run_questions: [scope_and_exclusions, ci_evidence_source_policy, local_execution_budget, authoritative_skill_projection_contract, generated_output_policy]
question_answer_refs: []
pre_approved_actions: [inspect_tests_and_build_configuration, inspect_ci_configuration, inspect_automation_scripts, inspect_skill_registry_and_projections, inspect_harness_guidance, run_local_node24_verification, create_mdkg_evidence_and_followups]
approval_gated_actions: [external_ci_provider_calls, external_network_or_registry_calls]
required_actions: [inspect_tests_and_build_configuration, inspect_ci_configuration, inspect_automation_scripts, inspect_skill_registry_and_projections, inspect_harness_guidance, run_local_node24_verification, create_mdkg_evidence_and_followups]
requested_actions: [inspect_tests_and_build_configuration, inspect_ci_configuration, inspect_automation_scripts, inspect_skill_registry_and_projections, inspect_harness_guidance, run_local_node24_verification, create_mdkg_evidence_and_followups]
prohibited_actions: [functional_implementation, dependency_replacement, tracked_generated_output_mutation, existing_consumer_mutation, unrelated_graph_or_selection_mutation, publication_or_deployment]
action_approval_refs: []
evidence_lanes: [local_test_build_inventory, ci_gate_inventory, smoke_coverage, skill_registry_mirror_integrity, harness_guidance_gaps, prioritized_improvements]
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

| Identity | Lane | Required | Evidence Needed | Status | Blocker | Recovery Node | Decision Or Waiver |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `local_test_build_inventory` | local test/build inventory | yes | package scripts and command receipts | todo | tool failure may occur | spike/proposal | none |
| `ci_gate_inventory` | CI gate inventory | yes | workflow/config/provider evidence | todo | provider access may need approval | spike/proposal | none |
| `smoke_coverage` | smoke coverage | yes | smoke scripts and gaps | todo | none | none | none |
| `skill_registry_mirror_integrity` | SKILL.md registry and mirrors | yes | canonical and mirrored skill review | todo | none | none | none |
| `harness_guidance_gaps` | harness guidance gaps | yes | missing/duplicated instructions | todo | none | none | none |
| `prioritized_improvements` | prioritized improvements | yes | risk/payoff ordering | todo | none | none | none |

# Pre-Run Questions

- What repository surfaces and exclusions define the audit scope?
- Which checked-in, local, provider, or registry sources may supply evidence?
- What local execution budget and runtime constraints are approved?
- Which skill registry is canonical, and which mirrors or public seeds are
  authoritative managed projections?
- Which ignored or tracked generated outputs may local verification create?

# Pre-Approved Read-Only Actions

- Inspect tests and build configuration, CI configuration, automation scripts,
  skill registries and projections, and harness guidance.
- Run explicitly budgeted local Node 24 verification without external provider,
  registry, or network calls.
- Create bounded mdkg evidence and source-backed follow-up tasks or tests.

# Approval-Gated Actions

- External CI provider calls.
- External network or registry calls.

# Prohibited Actions

- Functional implementation or mutation of existing consumers.
- Dependency replacement or tracked generated-output mutation.
- Unrelated graph or selected-goal mutation.
- Publication or deployment.

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
