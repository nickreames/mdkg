---
id: loop-4
type: loop
title: Tech Stack Best Practices Audit
status: todo
priority: 1
loop_mode: readonly
loop_role: template
scope_refs: []
scope_description: Repository package or subsystem selected for stack-specific best-practices review.
template_refs: []
materialization_mode: default_children
child_refs: []
pre_run_questions: [target_stack, external_docs_allowed, local_tests_approved, compatibility_priority]
question_answer_refs: []
pre_approved_actions: [read_source, inspect_dependencies, run_local_checks, create_mdkg_evidence]
approval_gated_actions: [external_docs_search]
required_actions: [read_source, inspect_dependencies, run_local_checks, create_mdkg_evidence]
requested_actions: [read_source, inspect_dependencies, run_local_checks, create_mdkg_evidence]
prohibited_actions: [dependency_upgrades, architecture_changes, push_publish_deploy]
action_approval_refs: []
evidence_lanes: [stack_inventory, best_practice_gap_review, dependency_posture, compatibility_risk, recommendations]
evidence_lane_refs: []
lane_waiver_refs: []
lane_waiver_decision_refs: []
lane_waiver_approval_refs: []
run_refs: []
decision_refs: []
output_refs: []
approval_refs: []
evaluation_refs: []
definition_of_done: Stack-specific risks and improvement lanes are reviewed or explicitly waived against current project conventions.
blocker_policy: spike_proposal_recommendation_continue
tags: [loop-template, audit, best-practices, stack]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: [tech-stack-audit-loop]
skills: [pursue-mdkg-loop]
created: 2026-07-06
updated: 2026-07-06
---

# Operating Model

Run a read-only audit against the technology stack in the selected scope. Prefer official docs, local conventions, package metadata, and existing tests over generic advice.

# Default Child Nodes

- Spike for stack inventory and version-sensitive guidance.
- Test nodes for verification gaps.
- Proposal node for prioritized modernization or hardening paths.

# Definition Of Done

- Stack versions, frameworks, and local conventions are identified.
- Findings distinguish best-practice drift from acceptable project choices.
- Package metadata, config, official guidance availability, local tests, and
  upgrade/deprecation risks are reviewed or explicitly waived.
- Recommendations are scoped and evidence-backed.
- Follow-up work is classified as definition-blocking or residual.

# Required Evidence Lanes

| Lane | Required | Evidence Needed | Status | Blocker | Recovery Node | Decision Or Waiver |
| --- | --- | --- | --- | --- | --- | --- |
| stack inventory | yes | package/config/framework versions | todo | none | none | none |
| local convention review | yes | source/docs/test convention evidence | todo | none | none | none |
| official guidance check | scope-dependent | current official docs or waived external lookup | todo | network may need approval | spike/proposal | none |
| package/deprecation risk | yes | local metadata and advisory/guidance notes | todo | external lookup may need approval | spike/proposal | none |
| test/build fit | yes | local command receipts or rationale | todo | tool failure may occur | spike/proposal | none |
| recommendations | yes | scoped risk/payoff notes | todo | none | none | none |

# Pre-Run Questions

- Which stack surfaces are in scope?
- Are official documentation lookups or external advisory calls approved?
- Are local tests/builds approved when they write caches or generated outputs?
- Should recommendations optimize for stability, modernization, performance, or
  maintenance cost?

# Pre-Approved Read-Only Actions

- Inspect source, package metadata, lockfiles, configs, tests, docs, and mdkg
  graph.
- Run local tests/builds, static discovery, version commands, and mdkg commands
  that do not call external services.
- Create mdkg findings, proposals, tasks, tests, and open questions.

# Approval-Gated Actions

- External official-doc/advisory calls when they disclose project metadata.
- Dependency upgrades, config changes, generated updates, or functional source
  edits.

# Blocker Continuation

If current external guidance or environment access is unavailable, create a
spike with source-grounded assumptions, propose at least three options,
recommend one path, and continue package/config/source/test review.

Do not mark the whole loop blocked while another stack lane remains actionable.
Do not close the loop until required lanes are complete or linked to accepted
`decision_refs` or `approval_refs`.

# Closeout Matrix

Classify follow-up work as definition-blocking evidence, residual stack
improvement, accepted waiver, or false positive before marking the loop done or
blocked.
