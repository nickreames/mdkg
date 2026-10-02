---
id: task-848
type: task
title: Lock persistent working storage contracts and migration decisions
status: review
priority: 1
parent: goal-89
tags: [cloud-planning, design-only]
owners: [mdkg-project-agent]
links: []
artifacts: [docs/cloud-goal89-design.md, docs/cloud-goal89-validation-plan.md, docs/cloud-goal89-interventions.md, docs/cloud-goal89-morning-decision.md, .mdkg/artifacts/goal-89/design-audit/checks.json, .mdkg/artifacts/goal-89/design-audit/goal88-hosted-terminal.json]
relates: []
blocked_by: [chk-674]
blocks: []
refs: [test-495]
context_refs: [edd-83]
evidence_refs: []
aliases: []
skills: []
created: 2026-10-02
updated: 2026-10-02
---

# Overview

Audit archive/artifacts/pack/state/DB storage and existing ad hoc .mdkg/working
before choosing names. Lock working directory/CLI, legacy graph namespace,
entry schema, active ownership/pins, promotion, indexing exclusion and opt-in
search. Lock ignore/tracking/artifact persistence and cloud lifecycle boundaries;
prove existing custom contents are never adopted by name. Choose quarantine,
retention, purge/recovery and stale-owner policy with Nick; no default cleanup.
Document export/restore obligations and unresolved portable filesystem limits.

# Implementation Notes

Owned by goal-89; follow edd-83. Depends on chk-674.
This record is a future task, not execution authorization in this PR. Resolve
the design decisions at the named design checkpoint before changing behavior.

Current run authority: the parent explicitly authorized Goal89 after corrected
independent PR11 prerequisite GO at
1a3cf4f45621cd67b51aba482966927aeea17419. This replaces the historical planning
merge prerequisite for this cloud stack, while release remains NOT_READY.
Chk674 is not falsely marked complete; the prerequisite safety GO is a separate
explicit owner decision. Chk675's working names/schema/ownership/retention design
review remains pending and does not require reauthorizing implementation.

# Acceptance Criteria

Attach reviewed paths/contracts and applicable automated fixture results to
test-495.
Maintain explicit failures/gaps; unknown custody, stale inputs or missing required
platform proof blocks completion. Later Run scope and original implementation
gates apply. No unrelated project/graph writes or publication authority.

# Current State

Review, owned by mdkg-project-agent in cloud-goal89-20261002. Audit and concrete
design are in docs/cloud-goal89-design.md; source/validation obligations are in
docs/cloud-goal89-validation-plan.md. A review request is pending for the exact
names/schema/legacy namespace, ownership/release, promotion and retention policy.
No approval is inferred. Task849/850 feature implementation and Test495 acceptance
remain NOT_RUN. No 0.6.2 package/version claim or draft implementation PR exists.
The parent subsequently authorized a clearly labelled design-only stacked draft
PR on this branch after docs/graph checks; it does not resolve the decision gate.
docs/cloud-goal89-morning-decision.md is the single concise request for Nick.

# Files Affected

A new selected working-storage command/helper family under src, its local manifest/ignore policy, docs/contracts and synthetic tests. Directory/CLI names are locked at the design checkpoint; existing scratch is preserved.

# Test Plan

Behavior cases are defined by test-495; prepublication evidence by chk-677. All are NOT_RUN.

# Links / Artifacts

edd-83 contains the reviewed proposal; future evidence must be attached explicitly.

Current artifacts listed in frontmatter are a concrete proposal, source audit and
intervention log, not a passing implementation receipt. Initial build/test
compilation, sequential CLI/docs baseline (499 examples, zero failures), graph
validation and eight-skill validation passed on native Linux x86_64 Node24.19.0.
Full candidate/installed/release/platform checks are NOT_RUN for Goal89; Goal88
evidence and inherited limitations remain separately retained.
