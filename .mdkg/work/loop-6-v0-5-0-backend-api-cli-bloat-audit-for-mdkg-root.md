---
id: loop-6
type: loop
title: v0.5.0 backend API CLI bloat audit for mdkg root
status: done
priority: 1
scope_refs: [root:goal-61]
loop_mode: readonly
loop_role: scoped
scope_description: mdkg root repository v0.5.0 CLI backend package and descriptor surfaces
template_refs: [template://loops/backend-api-cli-bloat-audit]
materialization_mode: default_children
child_refs: [spike-31, task-725, test-396]
pre_run_questions: [scope_surface, local_cache_writes_approved, external_compatibility_checks_approved, optimization_priority]
question_answer_refs: [scope_surface=dec-72, local_cache_writes_approved=dec-72, external_compatibility_checks_approved=dec-72, optimization_priority=dec-72]
pre_approved_actions: [read_source, inspect_help_and_contracts, run_local_inventory, create_mdkg_evidence]
approval_gated_actions: [external_compatibility_checks, downstream_repo_checks]
required_actions: [read_source, inspect_help_and_contracts, run_local_inventory, create_mdkg_evidence]
requested_actions: [read_source, inspect_help_and_contracts, run_local_inventory, create_mdkg_evidence]
prohibited_actions: [functional_changes, push_publish_deploy]
action_approval_refs: []
evidence_lanes: [public_command_api_inventory, flag_option_sprawl, ownership_boundaries, duplicated_command_logic, compatibility_risk, simplification_proposals]
evidence_lane_refs: [public_command_api_inventory=chk-422, flag_option_sprawl=chk-422, ownership_boundaries=chk-422, duplicated_command_logic=chk-422, compatibility_risk=chk-422, simplification_proposals=chk-422]
lane_waiver_refs: []
lane_waiver_decision_refs: []
lane_waiver_approval_refs: []
run_refs: [chk-422]
decision_refs: [dec-72]
output_refs: [spike-31, prop-5, task-728, test-399, chk-423]
approval_refs: []
evaluation_refs: [test-396]
definition_of_done: Backend API or CLI complexity lanes are reviewed or explicitly waived, and simplification recommendations are source-grounded.
blocker_policy: spike_proposal_recommendation_continue
tags: [loop-template, audit, backend, api, cli, loop-fork, release-candidate, corrected-dogfood]
owners: []
links: []
artifacts: [template_path=.mdkg/templates/loops/backend-api-cli-bloat-audit.loop.md, template_hash=sha256:e61083901ae2dcd315eba81ebf9aa90b9cbe7fb3ba923dd6834feb5502fd03b3]
relates: [root:goal-61]
blocked_by: []
blocks: []
refs: [template://loops/backend-api-cli-bloat-audit, dec-72, spike-31, task-725, test-396, prop-5, task-728, test-399, chk-422, chk-423, goal-60, goal-64]
context_refs: [root:goal-61]
evidence_refs: [dec-72, spike-31, prop-5, chk-422, chk-423]
aliases: []
skills: [pursue-mdkg-loop]
created: 2026-07-10
updated: 2026-07-10
---
# Fork Context

- Source template: template://loops/backend-api-cli-bloat-audit
- Source path: .mdkg/templates/loops/backend-api-cli-bloat-audit.loop.md
- Source hash: sha256:e61083901ae2dcd315eba81ebf9aa90b9cbe7fb3ba923dd6834feb5502fd03b3
- Scope: goal-61
- Materialization mode: default_children
- Materialized child refs: spike-31, task-725, test-396

# Template Operating Model

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
| public command/API inventory | yes | command/API list and source refs | done | none | none | chk-422 |
| flag and option sprawl | yes | flagged commands/options with rationale | done | none | none | chk-422 |
| ownership boundaries | yes | module/command boundary notes | done | none | none | chk-422 |
| duplicated command logic | yes | repeated handlers or helpers | done | none | none | chk-422 |
| compatibility risk | yes | behavior-preserving recommendations | done | external checks optional and not requested | prop-5 | chk-422 |
| simplification proposals | yes | at least three paths for major changes | done | none | none | prop-5 and chk-422 |

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

# Run Evidence

- `dec-72` fixed the local read-only scope and compatibility-first priority.
- `spike-31` records the command inventory, flag concentration, ownership
  hotspots, duplicated parser logic, and compatibility baseline.
- `prop-5` evaluates three paths and recommends incremental loop-owned
  decomposition. `task-728` and `test-399` preserve that residual work for the
  intentionally paused `goal-60`.
- `chk-422` binds all six audit lanes; `chk-423` verifies the loop contract and
  confirms no v0.5.0 implementation claim was made for the future refactor.

# Closeout

Completed after `loop plan loop-6 --json` reported `closeout.ready: true`, no
invalid bindings, three completed child lanes, and all six evidence lanes bound
to the audit receipt.


# Blocker Continuation Guidance

Policy: spike_proposal_recommendation_continue

- Record blocker evidence on affected goals, subgoals, tasks, or loop branches.
- Create or request a source-grounded spike when uncertainty is material.
- Ask the executing agent or harness to use web grounding when current external facts are required.
- Create or request a proposal for non-trivial blockers with at least three viable paths.
- Record one recommended path and the rationale for choosing it.
- Continue other useful scoped work when safety and ownership rules allow.
- Reserve whole-loop blocked state for repeated or global blockers that prevent meaningful progress across the remaining scope.
