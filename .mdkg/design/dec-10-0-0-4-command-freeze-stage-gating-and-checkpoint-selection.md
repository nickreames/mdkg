---
id: dec-10
type: dec
title: 0.0.4 command freeze stage gating and checkpoint selection
status: accepted
tags: [v0_4, cli, skills, checkpoints, governance]
owners: []
links: []
artifacts: []
relates: [dec-8, dec-9, prd-1, edd-2, edd-3, edd-5, edd-6, edd-7, edd-8, epic-4, epic-5]
refs: []
aliases: [command-freeze, stage-gating, latest_checkpoint_qid]
created: 2026-03-04
updated: 2026-03-04
---

# Context

0.0.4 gap analysis identified unresolved contract decisions that were blocking implementation-quality planning: command surface shape for skills, stage-gated skill discovery behavior, checkpoint selection semantics, redaction policy framing, and orchestrator interoperability boundaries.

# Decision

- Skills capabilities in 0.0.4 are documented as extensions to existing command families (`list`, `show`, `search`, `pack`, `validate`, `init`), not a new `mdkg skills` namespace.
- Skill gating uses a hybrid model:
  - query-time tag filtering for discovery (`--tags`, `--tags-mode` planned)
  - policy-time gating for orchestrator access control by stage/tag convention.
- Checkpoint IDs remain `chk-*` while type remains `checkpoint`.
- Latest checkpoint strategy is hybrid:
  - authoritative selection at pack-time
  - optional index hint (`latest_checkpoint_qid`) for optimization only.
- Redaction remains a 0.0.4 documentation policy contract (implementation deferred), with policy-level `safe` and `strict` framing.
- External orchestrator integration adopts a minimal structured contract for run/event/artifact exchange.
- Documentation alignment governance for 0.0.4 uses manual audits, not scripted parity enforcement.

# Alternatives considered

- Introduce `mdkg skills` top-level namespace now (rejected): larger surface and higher drift risk in docs-first phase.
- Use query-only stage filtering without policy gating (rejected): insufficient control for orchestrator safety boundaries.
- Use index-only latest checkpoint pointer (rejected): stale hint risk without pack-time authoritative selection.
- Define full runtime protocol spec now (rejected): over-scoped for 0.0.4 docs-only pass.

# Consequences

- 0.0.4 planning is decision-complete for command and orchestration direction without runtime mutation in this pass.
- Future implementation tasks can proceed with deterministic acceptance criteria and fewer latent design decisions.
- Docs explicitly distinguish policy contracts from current runtime behavior.

# Links / references

- `dec-8`
- `dec-9`
- `prd-1`
- `edd-2`
- `edd-3`
- `edd-5`
- `edd-6`
- `edd-7`
- `edd-8`
- `epic-5`
