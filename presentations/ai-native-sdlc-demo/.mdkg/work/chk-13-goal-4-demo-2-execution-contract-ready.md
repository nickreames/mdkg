---
id: chk-13
type: checkpoint
title: Goal 4 Demo 2 execution contract ready
checkpoint_kind: handoff
status: done
priority: 9
tags: []
owners: []
links: []
artifacts: [artifacts/demo-platform/rehearsal-specialization-contract.md, artifacts/demo-platform/event-specialization-contract.md]
relates: []
blocked_by: []
blocks: []
refs: [goal-4, epic-4, spike-4, task-15, task-16, task-17, task-18, task-19, task-20, test-10, test-11, goal-5, task-21, task-22, task-23, task-24, task-25, goal-6, task-27, spike-6, task-47, test-25, task-28, task-29, task-30, task-31, task-32, task-33, test-15, test-16, test-17, goal-7, task-34, task-37, test-18, test-20, task-40, prd-1, edd-1, dec-5, goal-2, chk-4, goal-3, chk-12]
context_refs: [goal-4, goal-5, goal-6, goal-7, prd-1, edd-1, dec-5, goal-2, chk-4, goal-3, chk-12]
evidence_refs: [chk-4, chk-12]
aliases: []
skills: []
scope: []
created: 2026-07-27
updated: 2026-07-27
---
# Summary

Goal 4 and its downstream handoffs are hardened for a deterministic Demo 2
rehearsal and a pre-authorized Demo 3 event. Goal 4 now stops at a truthful
child publication gate; Goal 5 requires a separate human Demo 2 publication
approval; Goal 6 consumes real Demo 2 evidence before applying accepted
source/prompt refinements and seals a separate event authority; Goal 7 consumes
that authority without an approval pause inside the frozen live scope.

# Scope Covered

Keep `scope` frontmatter updated when possible.

## Changed Surfaces

- Program PRD, EDD, and exact-SHA authority decision.
- Goal 4, its epic, nine-node chain, and rehearsal specialization contract.
- Goal 5 publication preflight, child resume/achievement, evidence, and
  push-range contract.
- Goal 6 final-polish, source/prompt evaluation/refinement/proof, event
  pre-authorization, and 13-node readiness chain.
- Goal 7 dispatch, push-range review, complete child evidence, and explicit
  bundle rebuild contract.

## Boundaries

- in scope: nested mdkg/operator planning state and accepted contract metadata
- out of scope: deck edits, source-template implementation, canonical website,
  run creation, goal activation, staging, commit/push, deployment, and provider
  action
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded:
  yes

# Decisions Captured

- `dec-5`: Demo 2 publication has a separate human gate; Demo 3 uses a
  separate pre-authorized live authority.
- `prd-1` and `edd-1`: Demo 2 evidence now gates source/prompt refinement and
  Demo 3 creation.

# Implementation Summary

- Demo 2 child `goal-1` spans local-to-production work. Goal 4 pauses it with
  publish next; Goal 5 resumes and achieves it after exact-SHA/live proof.
- Goal 4 produces both raw desktop/mobile captures and a composed 16:9
  source-versus-specialized reveal image.
- Goal 6 adds `spike-6 -> task-47 -> test-25` before Demo 3 creation.
- The live sendoff and exact allowlist are distinct from
  `event-authority.json`; the latter is the human pre-approval for the frozen
  live actions.

# Handoff Summary

- Recipient/context: future Goal 4 Demo 2 local-run operator
- Starting node or command:
  `mdkg --root presentations/ai-native-sdlc-demo goal activate goal-4 --json`
- Explicit boundaries: activation remains a separate user decision; Goal 4 is
  local-only; Goal 5 publication and Goal 7 live authority remain separately
  gated.

# Verification / Testing

## Command Evidence

- `mdkg --root presentations/ai-native-sdlc-demo validate --json`: pass with
  zero warnings and zero errors
- `mdkg --root presentations/ai-native-sdlc-demo doctor --json`: pass with zero
  warnings and zero errors
- `goal next goal-4`: `spike-4`, with zero routing warnings
- Goal 4 concise/full-skill pack: 23 nodes; includes goal-2, chk-4, goal-3,
  chk-12, task-10, chk-13, PRD, EDD, all six decisions, and required skills
- Goal 6 chain: 13 symmetric steps from task-27 through test-17
- task-31 standard/full-skill pack: 20 full-body nodes including task-10,
  spike-6, task-47, test-25, and task-30
- canonical source graph hash:
  `sha256:729b2196df234787c388cf968874cb0008d0a8d32a186b0a61297e47242459b3`
- operator manifest: 21 entries, zero source mismatches
- Demo 2 and Demo 3 run roots: absent
- program work/design loop nodes: zero
- root `validate --changed-only`: pass
- `git diff --check`: pass

## Pass / Fail Status

- status: PASS

## Known Warnings

- warning: Goal 3 artifacts and this checkpoint require the planned local Git
  integration and root private-bundle refresh before Goal 4 activation.

# Known Issues / Follow-ups

- Demo 2 does not exist and no publication approval has been granted.
- Demo 3 does not exist; its event authority can be accepted only after Goal 6
  preflight and dry rehearsal.

## Follow-up Refs

- goal-4
- goal-5
- goal-6
- goal-7

# Links / Artifacts

- artifacts/demo-platform/rehearsal-specialization-contract.md
- artifacts/demo-platform/event-specialization-contract.md
- no PR, push, deployment, or public URL

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
