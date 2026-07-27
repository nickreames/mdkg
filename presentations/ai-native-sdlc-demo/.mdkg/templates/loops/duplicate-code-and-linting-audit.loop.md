---
id: loop-5
type: loop
title: Duplicate Code And Linting Audit
status: todo
priority: 1
loop_mode: readonly
loop_role: template
scope_refs: []
scope_description: Repository package or folder selected for duplication lint and static-quality review.
template_refs: []
materialization_mode: default_children
child_refs: []
pre_run_questions: [target_scope, local_lint_checks_approved, generated_output_policy]
question_answer_refs: []
pre_approved_actions: [read_source, run_local_lint_inventory, inspect_duplicates, create_mdkg_evidence]
approval_gated_actions: []
required_actions: [read_source, run_local_lint_inventory, inspect_duplicates, create_mdkg_evidence]
requested_actions: [read_source, run_local_lint_inventory, inspect_duplicates, create_mdkg_evidence]
prohibited_actions: [automatic_refactors, formatter_rewrites, dependency_changes, push_publish_deploy]
action_approval_refs: []
evidence_lanes: [duplicate_code_inventory, linting_baseline, refactor_candidates, false_positive_triage, recommendations]
evidence_lane_refs: []
lane_waiver_refs: []
lane_waiver_decision_refs: []
lane_waiver_approval_refs: []
run_refs: []
decision_refs: []
output_refs: []
approval_refs: []
evaluation_refs: []
definition_of_done: Duplicate logic and static-quality lanes are reviewed or explicitly waived with practical follow-up recommendations.
blocker_policy: spike_proposal_recommendation_continue
tags: [loop-template, audit, duplicate-code, linting]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: [duplicate-lint-audit-loop]
skills: [pursue-mdkg-loop]
created: 2026-07-06
updated: 2026-07-06
---

# Operating Model

Run a read-only duplication and linting audit. Use static analysis, existing linters, search, and source review to find repeated logic, inconsistent patterns, and preventable quality drift.

# Default Child Nodes

- Spike for duplicated pattern inventory.
- Test nodes for lint or static-analysis coverage.
- Task nodes for low-risk consolidation opportunities.

# Definition Of Done

- Duplicate or near-duplicate logic is identified with source evidence.
- Linting and formatting gaps are reviewed.
- Existing static-quality tools, repeated utility patterns, and avoidable
  divergence are reviewed or explicitly waived.
- Recommendations avoid broad refactors without measurable payoff.
- Follow-up work is classified as definition-blocking or residual.

# Required Evidence Lanes

| Lane | Required | Evidence Needed | Status | Blocker | Recovery Node | Decision Or Waiver |
| --- | --- | --- | --- | --- | --- | --- |
| duplicate logic search | yes | repeated functions/modules/source refs | todo | none | none | none |
| lint/format config review | yes | tool configs and current command behavior | todo | local tools may fail | spike/proposal | none |
| repeated utility patterns | yes | consolidation candidates and tradeoffs | todo | none | none | none |
| generated/vendor exclusions | yes | exclusion rationale | todo | none | none | none |
| recommendations | yes | scoped payoff/risk notes | todo | none | none | none |

# Pre-Run Questions

- Which folders or packages are in scope?
- Are local lint/test/build commands approved when they write caches or generated
  outputs?
- Which generated, vendor, fixture, or snapshot folders should be excluded?

# Pre-Approved Read-Only Actions

- Inspect source, tests, configs, scripts, generated references, and mdkg graph.
- Run local search, lint, format check, tests/builds, and static analysis tools
  that do not call external services.
- Create mdkg evidence, consolidation proposals, tasks, tests, and open
  questions.

# Approval-Gated Actions

- Functional refactors, formatting rewrites, generated updates, or dependency
  changes.
- External tools or service calls.

# Blocker Continuation

If tools cannot run locally, create a spike, propose at least three options for
proof, recommend one path, mark blocker evidence, and continue search-based
source review and config inspection.

Do not mark the whole loop blocked while another duplicate/lint lane remains
actionable. Do not close the loop until required lanes are complete or linked to
accepted `decision_refs` or `approval_refs`.

# Closeout Matrix

Classify follow-up work as definition-blocking tool evidence, residual
consolidation, accepted waiver, or false positive before marking the loop done
or blocked.
