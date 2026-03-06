---
id: epic-5
type: epic
title: v0.4 gap closure and contract freeze
status: done
priority: 1
tags: [v0_4, roadmap, gap-closure, contracts]
owners: []
links: []
artifacts: []
relates: [dec-8, dec-9, dec-10, prd-1, edd-2, edd-3, edd-5, edd-6, edd-7, edd-8, epic-4]
blocked_by: []
blocks: [implement-1, implement-2, implement-3, implement-4, implement-5, test-20, test-21, test-22, test-23, test-24, test-25]
refs: []
aliases: [v0.4-gap-closure]
created: 2026-03-04
updated: 2026-03-05
---

# Goal

Close remaining v0.4 planning and implementation gaps by freezing command/policy contracts and executing deterministic delivery streams.

# Scope

- freeze skills command-surface direction under existing mdkg command families
- define hybrid stage-gating model for skill discovery and policy enforcement
- define hybrid latest-checkpoint selection contract (`latest_checkpoint_qid` hint + pack-time authority)
- define documentation-level redaction policy levels (`safe` and `strict`)
- define minimal external orchestrator run/event/artifact contract
- implement expanded determinism/unit-test matrix coverage
- execute manual docs alignment audit loop for v0.4.x

# Milestones

- M1: decision capture in `dec-10` and linkage across v0.4 docs
- M2: external standards alignment snapshot in `edd-7`
- M3: orchestrator minimal contract in `edd-8`
- M4: implementation stream tasks (`implement-1` through `implement-5`) integrated under this epic
- M5: validation and query checks pass for planning + implementation graph nodes

# Out of Scope

- runtime CLI or pack/index implementation changes
- scripted docs drift tooling
- hosted orchestrator runtime protocol implementation

# Risks

- documentation contracts may drift from implementation if manual audits are skipped
- unresolved tie-break semantics could reintroduce ambiguity during implementation

# Links / Artifacts

- `dec-10`
- `edd-7`
- `edd-8`
- `epic-4`
