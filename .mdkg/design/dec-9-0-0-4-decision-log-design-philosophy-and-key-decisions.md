---
id: dec-9
type: dec
title: 0.0.4 decision log design philosophy and key decisions
status: accepted
tags: [v0_4, decisions, philosophy, architecture]
owners: []
links: []
artifacts: []
relates: [dec-8, dec-10, prd-1, prd-2, edd-2, edd-3, edd-4, edd-5, edd-6, edd-7, edd-8, epic-4, epic-5]
refs: []
aliases: [doc-4, decision-log, design-philosophy]
created: 2026-03-04
updated: 2026-03-06
---

# Context

This decision record is the 0.0.4 rollup of mdkg design philosophy and high-impact architecture decisions. It preserves the "why" so implementation work remains aligned with deterministic, local-first constraints.

The rollout baseline is still v0.0.3 source behavior. Any 0.0.4 target-state decisions that differ from current runtime are explicitly marked as planned.

# Decision

## DEC-01 Local-first and repo-native

Context: central hosted memory increases complexity and weakens portability.

Decision: mdkg keeps durable knowledge in repo under `.mdkg/` with no hosted service requirement.

Consequences:
- enabled: portable/offline memory, git-native review and history
- constrained: no built-in cross-repo global search

## DEC-02 Strict frontmatter is mandatory

Context: loose markdown conventions create drift and low-confidence retrieval.

Decision: strict frontmatter schema and explicit graph edges remain non-negotiable.

Consequences:
- enabled: deterministic indexing/validation/pack generation
- constrained: schema changes require tooling updates

## DEC-03 Packs are the primary interoperability layer

Context: agents need deterministic bounded context, not full-repo reads.

Decision: packs remain first-class deterministic exports with depth/edge/profile controls and core constraints.

Current-gap note:
- v0.0.3 currently includes pinned core docs through `pack --verbose`; 0.0.4 target-state treats constrained core context inclusion as a design default policy.

Consequences:
- enabled: reproducible agent context and easier debugging of "what the agent saw"
- constrained: pack ordering/truncation policy must stay stable

## DEC-04 No vector DB in 0.0.4 core

Context: vector retrieval adds probabilistic behavior and operational overhead.

Decision: 0.0.4 retrieval remains path/ID/graph/metadata driven.

Consequences:
- enabled: deterministic, local, cheap, debuggable operation
- constrained: limited fuzzy recall over large unstructured corpora

## DEC-05 Agent Skills as procedural memory standard

Context: proprietary skills format would reduce interoperability.

Decision: mdkg adopts SKILL.md package conventions, metadata indexing, and optional pack inclusion.

Locked metadata policy:
- optional routing metadata is flattened as `ochatr_*` keys (no nested map contract in 0.0.4).
- mdkg indexes and discovers skills but does not execute skill scripts.

Consequences:
- enabled: portable procedural memory and ecosystem interoperability
- constrained: skill/script security controls and pack-size discipline are required

## DEC-06 Progressive disclosure for skills

Context: always-loading full skill bodies causes context bloat.

Decision:
- index metadata only by default
- include full skill bodies when referenced or explicitly requested

Consequences:
- enabled: smaller baseline context and scalable skill libraries
- constrained: workflows need explicit skill-selection steps

## DEC-07 Node `skills: []` links work to procedure

Context: agents need deterministic procedure routing hints at work-item level.

Decision: work nodes may declare `skills: [slug, ...]`; validation should verify slug existence.

Consequences:
- enabled: deterministic skill routing and auto-inclusion paths for packs
- constrained: schema/validation surface area increases

## DEC-08 `init --agent` bootstraps agent-ready repos

Context: agents and humans need a shared minimal starting contract.

Decision: 0.0.4 plans `init --agent` scaffolding with SOUL/HUMAN, skills scaffold, and core pin updates.

Consequences:
- enabled: consistent onboarding and reduced setup ambiguity
- constrained: default scaffold must remain minimal/editable

## DEC-09 HUMAN digital twin is a single strict core node

Context: multi-file profile sprawl is high-friction and drift-prone at 0.0.4 scope.

Decision:
- canonical HUMAN path is `.mdkg/core/HUMAN.md`
- HUMAN is a strict mdkg node (not a twin directory contract in 0.0.4)

Consequences:
- enabled: simple predictable loading/editing behavior
- constrained: one file may grow and need later decomposition

## DEC-10 Episodic memory = event logs + checkpoints

Context: storing raw event streams as semantic nodes would bloat graph context.

Decision:
- use append-only JSONL at `.mdkg/work/events/events.jsonl` (typically gitignored)
- use checkpoint nodes as durable episodic compression
- include latest checkpoint by default in memory-context guidance when available
- avoid markdown files under `.mdkg/work/events/` in 0.0.4 docs because they are parsed as strict nodes

Consequences:
- enabled: provenance with bounded graph growth
- constrained: raw logs may remain local when gitignored

## DEC-11 Commit cadence is event-driven

Context: per-tool-call commits create noise and instability.

Decision:
- commit on end-of-run, checkpoint-worthy transitions, or timer flush for long-running orchestrators
- never commit on every tool call
- this is external-orchestrator guidance in 0.0.4 docs, not mdkg runtime enforcement
- the orchestrator is the durable writer for batched task status updates, artifact refs, optional checkpoints, and commit boundaries

Consequences:
- enabled: cleaner history and more stable orchestration behavior
- constrained: some micro-updates remain uncommitted until batch boundaries

## DEC-12 Safety stance: mdkg is not a secret store

Context: local artifacts can leak through commits, packs, or outputs.

Decision:
- keep cache/pack outputs ignored by default
- enforce strict publish allowlists
- document no-secrets guidance clearly

Consequences:
- enabled: lower leakage risk and cleaner distribution boundaries
- constrained: users must still follow operational hygiene

## DEC-13 Boring portability is a permanent constraint

Context: adding daemons/sqlite to core increases operational coupling and trust cost.

Decision: mdkg core remains Node.js CLI + file-backed state + simple caches + conservative transforms.

Consequences:
- enabled: high trust, straightforward adoption, broad portability
- constrained: advanced features may require optional tooling or separate packages

## DEC-14 Command freeze + hybrid gating and checkpoint selection

Context: 0.0.4 planning had unresolved interface and policy questions around skills command shape, stage access control, and latest-checkpoint selection.

Decision:
- keep skills capabilities in existing mdkg command families (no new `mdkg skills` namespace in 0.0.4 docs)
- use hybrid stage gating (query-time tag filtering + policy-time orchestrator gating)
- keep `chk-*` checkpoint IDs
- use hybrid latest checkpoint strategy with pack-time authority and optional `latest_checkpoint_qid` index hint
- keep redaction model as docs-level policy (`safe`/`strict`) with runtime implementation deferred
- use a minimal structured external orchestrator contract in docs (run/event/artifact)

Consequences:
- enabled: decision-complete implementation planning with deterministic boundaries
- constrained: runtime behavior remains unchanged until implementation phase

# Alternatives considered

- Keep decision rationale spread across many docs only (rejected): high drift risk and low discoverability for contributors/agents.
- Treat 0.0.4 as implementation-only with no philosophy rollup (rejected): future changes lose rationale and regress toward non-deterministic patterns.
- Adopt vector-first retrieval now (rejected): violates determinism-first 0.0.4 scope.

# Consequences

- 0.0.4 implementation planning now has a concise decision baseline to validate against.
- Contributors and agents can reason about design intent without reconstructing prior discussions.
- Future docs and runtime changes should cross-check against this rollup plus `dec-8` source-truth policy.

# Links / references

- `dec-8`
- `prd-1`
- `prd-2`
- `edd-2`
- `edd-3`
- `edd-4`
- `edd-5`
- `edd-6`
- `edd-7`
- `edd-8`
- `dec-10`
- `epic-4`
- `epic-5`
- `rule-2`
- `rule-3`
- `rule-4`
