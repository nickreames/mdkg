---
id: spike-28
type: spike
title: Corrected security audit loop for mdkg root grounding spike
status: todo
priority: 1
parent: loop-3
tags: [loop-template, audit, security, loop-fork, loop-child, spike]
owners: []
links: []
artifacts: []
relates: [loop-3]
blocked_by: []
blocks: []
refs: [loop-3, template://loops/security-audit]
context_refs: []
evidence_refs: []
aliases: []
skills: [pursue-mdkg-loop]
created: 2026-07-06
updated: 2026-07-06
---
# Research Question

What source-grounded context, constraints, risks, and viable options should Corrected security audit loop for mdkg root use for mdkg root repository?

# Context And Constraints

- This spike prepares `loop-3`; it does not replace the security audit loop.
- The loop is read-only by default and may create mdkg evidence, proposals, decisions, tasks, tests, checkpoints, and open questions.
- External registry, advisory, or security-provider calls require explicit approval or accepted waiver before use.
- Local read-only scans, local tests, local builds, and mdkg validation are pre-approved for this loop when they do not mutate functional source or provider state.
- `loop-1`, `task-688`, and `spike-27` are preserved as failed dogfood/superseded evidence.

# Search Plan

- Inspect mdkg context before broad source exploration.
- Read `loop-3`, `task-689`, `test-364`, and `pursue-mdkg-loop` before deciding whether the loop is runnable.
- Resolve pre-run questions about external advisory/security-provider calls, local test/build permissions, and publication scope.
- Inventory security-sensitive surfaces: CLI command handling, file/archive parsing, pack/bundle/subgraph import/export, template/init/upgrade paths, docs/public demo output, package metadata, scripts, and dependency manifests.
- Build the required evidence lane table before execution so blocked lanes can be separated from actionable lanes.
- Use source and web grounding when the loop hits a blocker or when external/current facts are required.

# Findings

# Options And Tradeoffs

- Option 1: run every local/static/read-only lane first, then request approval for external advisory/security-provider lanes. This maximizes immediate progress and keeps external disclosure explicit.
- Option 2: request all external/security-provider approvals before any audit execution. This improves planning clarity but risks blocking useful local work unnecessarily.
- Option 3: waive external lanes up front through accepted decisions. This is fastest, but should only be used when the publication or release bar does not require fresh external advisory evidence.

# Recommendation

Do not treat this spike as a substitute for the loop execution. It should prepare the corrected loop to run by identifying applicable evidence lanes, open approvals, and scope boundaries. The runner should continue every authorized lane before recommending done, blocked, or waiver decisions.

# Follow-Up Nodes To Create

- Proposal node if any external advisory/security-provider lane needs human approval or waiver.
- Fresh task/test nodes only after `loop-3` classifies follow-up work as definition-blocking or residual hardening.

# Skill Candidates

# Evidence And Sources

Template: template://loops/security-audit
