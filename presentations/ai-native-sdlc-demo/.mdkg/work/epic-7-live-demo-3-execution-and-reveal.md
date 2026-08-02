---
id: epic-7
type: epic
title: Timed Demo 3 dress-rehearsal execution and evidence
status: done
priority: 1
tags: [ai-native-sdlc, presentation-demo, phase-7]
owners: [program-orchestrator, root-integration-owner]
links: []
artifacts: [artifacts/demo-003/rehearsal-outcome-receipt.json, artifacts/demo-003/program-bundle-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, chk-25]
context_refs: [goal-7, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, chk-25]
evidence_refs: [chk-25, chk-28, test-18, test-19, test-20, test-21, receipt.demo3-local-durability-closeout-001]
aliases: [phase-7-epic]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-08-02
---

# Goal

Execute and measure Demo 3 through a T+29:30 exact-SHA reveal gate or select
the sealed fallback truthfully by T+30.

# Scope

Owned actionable chain:

- task-58
- task-34
- task-35
- test-18
- task-36
- task-37
- task-38
- task-39
- test-19
- test-20
- test-21
- task-40

All listed nodes use epic-7, parent goal-7, and symmetric prev/next links. The goal scopes this epic recursively.

# Milestones

- Root-integration-owned task-58 verifies or, only if still necessary,
  publishes the preparation baseline from a dedicated clean publication
  worktree, activates authority, and releases its lease before `P0` or `T0`.
- The private control checkout owns local Goal 6/7 evidence and may not stage,
  commit, or push. Complete-range equality and an empty intersection with all
  exact and pattern-based exclusions are required before any publication.
- Live critical milestone `task-34 -> task-35 -> test-18` completes by
  T+29:30 or selects Demo 2 by T+30.
- Post-reveal tasks 36–40 and tests 19–21 harden evidence without changing the
  reveal outcome.
- Required checks and public-safe evidence recorded.
- One accepted phase checkpoint records the outcome and next activation.

# Out of Scope

- Work owned by any other phase goal.
- Side effects not explicitly authorized by goal-7.
- Raw prompts, credentials, provider payloads, or unrelated private context.
- Multi-harness or eight-hour/endurance demonstration.
- Final presentation or source-template polish owned by Goal 9.

# Risks

- Prerequisite or writer-lease drift.
- Confusing the intentionally divergent private control checkout with the
  clean publication worktree, or inspecting only staged paths instead of the
  complete push range.
- Hidden scope expansion across product, Git, or provider boundaries.
- Evidence that does not prove the goal condition.
- Stale bundle, source, route, claim, or deployment state.

# Links / Artifacts

- goal-7
- prd-1
- edd-1
