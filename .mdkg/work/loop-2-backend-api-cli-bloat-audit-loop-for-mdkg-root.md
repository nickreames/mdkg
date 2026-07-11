---
id: loop-2
type: loop
title: Backend API CLI bloat audit loop for mdkg root
status: done
priority: 1
scope_refs: []
loop_mode: readonly
loop_role: scoped
scope_description: mdkg root repository
template_refs: [template://loops/backend-api-cli-bloat-audit]
materialization_mode: default_children
child_refs: [spike-26, task-687, test-363]
run_refs: []
decision_refs: []
output_refs: []
approval_refs: []
evaluation_refs: [test-363]
definition_of_done: Backend API or CLI complexity is reviewed with concrete simplification recommendations.
blocker_policy: spike_proposal_recommendation_continue
tags: [loop-template, audit, backend, api, cli, loop-fork, stale-fork, superseded]
owners: []
links: []
artifacts: [template_path=.mdkg/templates/loops/backend-api-cli-bloat-audit.loop.md, template_hash=sha256:c0330eb8571203efe0b0a0e077ebbd60014838f458bcc459ab452592c2ccb35d]
relates: [loop-4]
blocked_by: []
blocks: []
refs: [template://loops/backend-api-cli-bloat-audit, loop-4]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-07-06
updated: 2026-07-06
---
# Fork Context

- Source template: template://loops/backend-api-cli-bloat-audit
- Source path: .mdkg/templates/loops/backend-api-cli-bloat-audit.loop.md
- Source hash: sha256:c0330eb8571203efe0b0a0e077ebbd60014838f458bcc459ab452592c2ccb35d
- Scope: mdkg root repository
- Materialization mode: default_children
- Materialized child refs: spike-26, task-687, test-363

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
- Recommendations preserve compatibility unless explicitly accepted otherwise.
- Follow-up work is represented as mdkg nodes.

# Blocker Continuation

If external service behavior or compatibility impact cannot be proven, create a spike, propose at least three viable paths, recommend one path, record blocker evidence, and continue local source analysis.


# Blocker Continuation Guidance

Policy: spike_proposal_recommendation_continue

- Record blocker evidence on affected goals, subgoals, tasks, or loop branches.
- Create or request a source-grounded spike when uncertainty is material.
- Ask the executing agent or harness to use web grounding when current external facts are required.
- Create or request a proposal for non-trivial blockers with at least three viable paths.
- Record one recommended path and the rationale for choosing it.
- Continue other useful scoped work when safety and ownership rules allow.
- Reserve whole-loop blocked state for repeated or global blockers that prevent meaningful progress across the remaining scope.

# Superseded Fork Evidence

This loop was forked before the loop-template hardening pass that added `pursue-mdkg-loop`, required evidence lanes, pre-run questions, approval-gated actions, and stricter closeout rules.

It is preserved as stale fork evidence and superseded by `loop-4`. Use `loop-4` for the runnable backend/API/CLI bloat audit.
