---
id: epic-227
type: epic
title: Harden loop provenance stale fork and descriptor contracts
status: todo
priority: 1
tags: [loop, provenance, descriptor, compatibility]
owners: []
links: []
artifacts: []
relates: [goal-61]
blocked_by: []
blocks: []
refs: [task-706, task-707, test-379, test-380]
context_refs: [goal-61, edd-70, dec-67, prop-4]
evidence_refs: []
aliases: [loop-provenance-and-descriptor-hardening]
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Goal

Expose trustworthy fork lineage and command contracts without mutating scoped
forks or understating command side effects.

# Scope

- Template identity/hash capture and stale detection.
- Typed lineage/ref validation.
- Additive stale warnings in list/show/plan.
- Descriptor, flag, help, JSON, and generated-contract parity.

# Milestones

- `task-706` / `test-379`: provenance and stale behavior.
- `task-707` / `test-380`: descriptor truth.

# Out of Scope

Automatic template upgrades and broad descriptor rollout from `goal-60`.

# Risks

- Template location changes can create false stale reports.
- Descriptor drift can mislead autonomous operators about safety.

# Links / Artifacts

- `edd-70`
- `dec-67`
- external links
