---
id: loop-1
type: loop
title: Security audit loop for mdkg root
status: done
priority: 1
scope_refs: []
loop_mode: readonly
loop_role: scoped
scope_description: mdkg root repository
template_refs: [template://loops/security-audit]
materialization_mode: default_children
child_refs: [spike-25, task-686, test-362]
run_refs: []
decision_refs: []
output_refs: [task-688, spike-27]
approval_refs: []
evaluation_refs: [test-362]
definition_of_done: Security-relevant risks are reviewed with source-grounded evidence and prioritized follow-up nodes.
blocker_policy: spike_proposal_recommendation_continue
tags: [loop-template, audit, security, loop-fork, failed-dogfood, superseded]
owners: []
links: []
artifacts: [template_path=.mdkg/templates/loops/security-audit.loop.md, template_hash=sha256:52af31dc4c32d096d512ac2d63f089611eb48b7cf97711d9e01e0a5857175957]
relates: [loop-3]
blocked_by: []
blocks: []
refs: [template://loops/security-audit, loop-3]
context_refs: []
evidence_refs: [spike-25, task-686, test-362]
aliases: []
skills: []
created: 2026-07-06
updated: 2026-07-06
---
# Fork Context

- Source template: template://loops/security-audit
- Source path: .mdkg/templates/loops/security-audit.loop.md
- Source hash: sha256:52af31dc4c32d096d512ac2d63f089611eb48b7cf97711d9e01e0a5857175957
- Scope: mdkg root repository
- Materialization mode: default_children
- Materialized child refs: spike-25, task-686, test-362

# Template Operating Model

# Operating Model

Run a read-only security review over the selected scope. Ground findings in source, configuration, dependency metadata, generated artifacts, and existing mdkg context. Do not make code changes from this loop.

# Default Child Nodes

- Spike for threat model and attack surface discovery.
- Task or test nodes for validated remediation work.
- Checkpoint for scan evidence and residual risk.

# Definition Of Done

- Source-grounded candidate risks are triaged.
- Valid findings include affected files, impact, evidence, and remediation direction.
- False positives and residual uncertainty are recorded.
- Follow-up work is represented as mdkg nodes.

# Blocker Continuation

If blocked by missing credentials, private systems, or unavailable runtime state, write a spike with evidence, propose at least three paths, recommend one path, mark affected goals with blocker evidence, and continue static or locally provable review work.


# Blocker Continuation Guidance

Policy: spike_proposal_recommendation_continue

- Record blocker evidence on affected goals, subgoals, tasks, or loop branches.
- Create or request a source-grounded spike when uncertainty is material.
- Ask the executing agent or harness to use web grounding when current external facts are required.
- Create or request a proposal for non-trivial blockers with at least three viable paths.
- Record one recommended path and the rationale for choosing it.
- Continue other useful scoped work when safety and ownership rules allow.
- Reserve whole-loop blocked state for repeated or global blockers that prevent meaningful progress across the remaining scope.

# Run Summary

Read-only mdkg root security audit pass completed on 2026-07-06. The loop did not make source, docs, template, generated, CLI, runtime, or seed implementation changes.

Outcome:

- No high-confidence critical security finding was identified in the parent-agent static pass.
- Local credential-shaped scan returned no matches.
- Root production dependency advisory check returned zero vulnerabilities.
- Docs and mdkg-dev advisory checks require explicit external registry approval and were routed to `task-688`.
- Bundle/subgraph ZIP resource-limit hardening was routed to `spike-27`.

# Failed Dogfood Evidence

This loop is preserved as failed loop-run evidence, not as the corrected execution model.

It closed too early after creating follow-up work instead of exhausting all authorized required evidence lanes. The corrected loop behavior is represented by `loop-3`, which requires the runner to continue across every actionable lane, classify definition-blocking versus residual follow-up work, and close only after required lanes are complete or explicitly waived.

The spawned nodes `task-688` and `spike-27` are superseded by the corrected security loop fork and should not be treated as the active security-audit execution path.
