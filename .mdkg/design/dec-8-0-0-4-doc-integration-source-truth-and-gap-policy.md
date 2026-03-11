---
id: dec-8
type: dec
title: 0.0.4 doc integration source truth and gap policy
status: accepted
tags: [v0_4, docs, governance]
owners: []
links: []
artifacts: []
relates: [prd-1, prd-2, epic-4, epic-5, edd-2, edd-3, edd-4, edd-5, edd-6, edd-7, edd-8, dec-9, dec-10]
refs: []
aliases: [source-truth, gap-policy]
created: 2026-02-27
updated: 2026-03-06
---

# Context

We are integrating forward-looking 0.0.4 architecture and product docs into the mdkg graph while current source implementation remains v0.0.3-era behavior. We need a stable policy for documenting planned behavior without misrepresenting implemented behavior.

# Decision

- Source code is the truth source for current behavior.
- 0.0.4 content is documented as planned target state with explicit gap notes.
- `SOUL.md` and `HUMAN.md` are planned as strict mdkg nodes under `.mdkg/core/`.
- `init --omni` is planned, with `--llm` retained for compatibility.
- Event log format is locked to `.mdkg/work/events/*.jsonl` for 0.0.4 planning.
- Event docs avoid markdown files under `.mdkg/work/events/` to prevent strict-node parse failures.
- Skills are planned as deterministic local metadata indexed by mdkg and optionally included in packs.
- Skills capabilities are planned under existing mdkg command families (no new `mdkg skills` namespace in 0.0.4 docs).
- Optional skill routing metadata in 0.0.4 docs is flattened (`ochatr_*`) and non-breaking.
- mdkg indexes and discovers skills but does not execute skill scripts in 0.0.4; script execution remains runtime/orchestrator policy.
- Skill discovery is planned to support hybrid stage gating: query-time tag filters plus policy-time orchestrator gating.
- Skill inclusion behavior in packs remains policy-driven.
- Single-writer and commit-cadence rules are guidance for external orchestrators, not mdkg runtime enforcement in 0.0.4.
- Last-checkpoint inclusion in packs is a 0.0.4 default requirement when a checkpoint exists.
- Latest checkpoint strategy is planned as hybrid: pack-time authoritative selection plus optional `latest_checkpoint_qid` index hint.
- Redaction guidance is policy-defined in docs (`safe` and `strict`) with runtime implementation deferred.
- External orchestrator interoperability in 0.0.4 docs uses a minimal structured run/event/artifact contract.
- Existing doc drift against source should be corrected during this integration.
- Scope includes both internal `.mdkg` docs and root `README.md`.
- New skills/events command names are deferred to later architecture work.
- Manual docs alignment audits are the 0.0.4 governance path in this phase (no scripted parity checks).
- No physical scaffolding changes are made in this pass for planned 0.0.4 paths.
- Episodic logging behavior is documented now and implemented later in runtime work.
- 0.0.4 decision log updates are amended in place under this decision record.
- Doc 4 decision-log content is captured in `dec-9`.
- Doc 5 website/docs planning content is captured in `prd-2`.
- Doc 6 init omni specification content is captured in `edd-4`.
- Doc 7 skills integration guide content is captured in `edd-5`.
- Doc 8 event logs + checkpoints guide content is captured in `edd-6`.
- Doc 9 Agent Skills standards alignment snapshot is captured in `edd-7`.
- Doc 10 external orchestrator minimal contract is captured in `edd-8`.
- Gap-closure contract freeze stream is tracked in `epic-5`.

# Alternatives considered

- Spec-first docs without gap notes (rejected): risks claiming unimplemented behavior as current.
- Current-state-only docs (rejected): loses 0.0.4 planning clarity and roadmap utility.
- Freeform `SOUL.md`/`HUMAN.md` outside strict schema (rejected): conflicts with deterministic indexing model.

# Consequences

- mdkg docs can evolve toward 0.0.4 without violating source-truth discipline.
- Contributors can use a shared discrepancy model when planning implementation.
- Future implementation work must keep PRD/EDD gap matrices and source behavior aligned.

# Links / references

- `prd-1`
- `prd-2`
- `edd-2`
- `edd-3`
- `edd-4`
- `edd-5`
- `edd-6`
- `edd-7`
- `edd-8`
- `dec-9`
- `dec-10`
- `epic-4`
- `rule-3`
- `rule-6`
