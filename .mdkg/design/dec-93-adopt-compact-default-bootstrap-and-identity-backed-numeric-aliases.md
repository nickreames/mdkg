---
id: dec-93
type: dec
title: Adopt compact default bootstrap and identity-backed numeric aliases
status: accepted
tags: [alignment-002, planning-only]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: [goal-81, goal-82, edd-80, edd-81, task-363]
refs: [dec-17, dec-18, dec-19, edd-56]
aliases: []
created: 2026-09-05
updated: 2026-09-05
---

# Context

MDKG-INTERACTIVE-ALIGNMENT-002 approved a project-local planning pass following
read-only alignment. The user chose compact init by default, numeric aliases
with stable identity, and a complete collaboration slice rather than detector-
only delivery. This is acceptance of direction and planning, not source behavior.

# Decision

- AGENTS.md and CLAUDE.md become thin root adapters to detailed .mdkg guidance.
- Default init includes compact agent setup; explicit graph-only remains possible
  and --agent stays compatible.
- Preserve user instructions, project documentation and public discovery assets.
- Keep canonical skills and native mirrors per dec-18; load skill bodies on demand.
- Keep human numeric aliases, add immutable graph/node identity and versioned
  format/migration contracts, and preserve ordinary unmerged-node command use.
- Integrate through ancestor-aware reviewed mappings and explicit conflict
  decisions. Index rebuild is not identity authority; remapping is not rebase.
- Single-writer main remains supported alongside separate developer branches.

This is a scoped future successor to the root-path/mandatory-read requirements
of dec-17 and the opt-in bootstrap portion of dec-19, conditional on tested
implementation and explicit adoption. Do not mark those historical decisions
superseded globally before that gate. dec-18 canonical skill ownership remains.

# Alternatives considered

Numeric offsets/repair alone do not identify same-node edits across branches.
A separate draft-only node model undermines ordinary command parity.
A mandatory universal handbook and fleet-wide prerequisite migration are rejected.
Full federation, remote skills and automated policy promotion are deferred.

# Consequences

edd-80 and edd-81 define the planning contracts. Goal 81 and Goal 82 remain
paused with unclaimed implementation tasks. Exact future CLI/schema wire choices
are task-820 design deliverables, not claims about currently available commands.
No source, instructions, skills, Git, release, provider or deployment authority
is conferred by this decision.

# Links / references

- goal-81, goal-82, task-363, edd-80, edd-81.
- Prior source evidence: src/commands/init_manifest.ts, src/commands/upgrade.ts,
  src/commands/fix.ts, src/commands/new.ts, src/commands/goal.ts.
