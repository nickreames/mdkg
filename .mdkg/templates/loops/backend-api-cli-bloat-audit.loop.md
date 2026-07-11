---
id: loop-3
type: loop
title: Backend API CLI Bloat Audit
status: todo
priority: 1
loop_mode: readonly
loop_role: template
scope_refs: []
scope_description: Backend service API or CLI surface selected for modularity and bloat review.
template_refs: []
materialization_mode: default_children
child_refs: []
pre_run_questions: [scope_surface, local_cache_writes_approved, external_compatibility_checks_approved, optimization_priority]
question_answer_refs: []
pre_approved_actions: [read_source, inspect_help_and_contracts, run_local_inventory, create_mdkg_evidence]
approval_gated_actions: [external_compatibility_checks, downstream_repo_checks]
required_actions: [read_source, inspect_help_and_contracts, run_local_inventory, create_mdkg_evidence]
requested_actions: [read_source, inspect_help_and_contracts, run_local_inventory, create_mdkg_evidence]
prohibited_actions: [functional_changes, push_publish_deploy]
action_approval_refs: []
evidence_lanes: [public_command_api_inventory, flag_option_sprawl, ownership_boundaries, duplicated_command_logic, compatibility_risk, simplification_proposals]
evidence_lane_refs: []
lane_waiver_refs: []
lane_waiver_decision_refs: []
lane_waiver_approval_refs: []
run_refs: []
decision_refs: []
output_refs: []
approval_refs: []
evaluation_refs: []
definition_of_done: Backend API or CLI complexity lanes are reviewed or explicitly waived, and simplification recommendations are source-grounded.
blocker_policy: spike_proposal_recommendation_continue
tags: [loop-template, audit, backend, api, cli]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: [backend-cli-bloat-audit-loop]
skills: [pursue-mdkg-loop]
created: 2026-07-06
updated: 2026-07-06
---

# Operating Model

Run a read-only audit for backend, API, and CLI design bloat. Look for sprawling flags, mixed ownership, duplicated command logic, weak module boundaries, and overly broad abstractions.

# Default Child Nodes

- Spike for command/API inventory.
- Proposal node for simplification paths.
- Task nodes for focused refactors that preserve behavior.

# Definition Of Done

- Public surfaces and core ownership boundaries are inventoried.
- Bloat or coupling risks are tied to concrete source locations.
- Command/API flag sprawl, mixed ownership, duplicate handlers, module
  cohesion, and output/help consistency are reviewed or explicitly waived.
- Recommendations preserve compatibility unless explicitly accepted otherwise.
- Follow-up work is classified as definition-blocking or residual.

# Required Evidence Lanes

| Lane | Required | Evidence Needed | Status | Blocker | Recovery Node | Decision Or Waiver |
| --- | --- | --- | --- | --- | --- | --- |
| public command/API inventory | yes | command/API list and source refs | todo | none | none | none |
| flag and option sprawl | yes | flagged commands/options with rationale | todo | none | none | none |
| ownership boundaries | yes | module/command boundary notes | todo | none | none | none |
| duplicated command logic | yes | repeated handlers or helpers | todo | none | none | none |
| compatibility risk | yes | behavior-preserving recommendations | todo | external behavior may need proof | spike/proposal | none |
| simplification proposals | yes | at least three paths for major changes | todo | none | none | none |

# Pre-Run Questions

- Which command, API, package, or backend surface is in scope?
- Are local tests/builds approved when they write caches or generated outputs?
- Are external compatibility checks, service calls, or downstream repo checks
  approved?
- Should recommendations optimize for compatibility, simplicity, performance, or
  public CLI ergonomics first?

# Pre-Approved Read-Only Actions

- Inspect source, command registration, help text, tests, docs, generated command
  references, and package metadata.
- Run local CLI help, local tests/builds, `rg`, `mdkg show/search/pack/validate`,
  and static command/API inventory scripts.
- Create mdkg spikes, proposals, tasks, tests, checkpoints, and open questions.

# Approval-Gated Actions

- Functional code, docs, template, generated command, or public CLI behavior
  changes.
- External service calls or downstream compatibility checks.
- Push, publish, tag, deploy, or provider-side actions.

# Blocker Continuation

If external service behavior or compatibility impact cannot be proven, create a
spike, propose at least three viable paths, recommend one path, record blocker
evidence, and continue local source, docs, help, and test analysis.

Do not mark the whole loop blocked while another command/API lane remains
actionable. Do not close the loop until required lanes are complete or linked to
accepted `decision_refs` or `approval_refs`.

# Closeout Matrix

Classify follow-up work as compatibility-blocking, simplification residual,
accepted waiver, or false positive before marking the loop done or blocked.
