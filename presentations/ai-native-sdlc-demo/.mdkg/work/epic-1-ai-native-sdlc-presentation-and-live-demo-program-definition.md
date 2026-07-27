---
id: epic-1
type: epic
title: AI-native SDLC presentation and live-demo program definition
status: done
priority: 1
tags: [ai-native-sdlc, presentation-demo, phase-1]
owners: [program-orchestrator]
links: []
artifacts: [artifact://ai-native-sdlc-demo/root-registration-receipt, artifact://ai-native-sdlc-demo/private-bundle]
relates: []
blocked_by: []
blocks: []
refs: [goal-1, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6]
context_refs: [goal-1, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6]
evidence_refs: [chk-1, test-1, test-2, test-3]
aliases: [phase-1-epic]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Goal

Create and validate the complete mdkg-only program contract and root handoff without functional work.

# Scope

Owned actionable chain:

- spike-1
- task-1
- task-2
- task-3
- task-4
- test-1
- test-2
- test-3

All listed nodes use epic-1, parent goal-1, and symmetric prev/next links. The goal scopes this epic recursively.

# Milestones

- Activation conditions and writer authority accepted.
- Every actionable node completed in deterministic order.
- Required checks and public-safe evidence recorded.
- One accepted phase checkpoint records the outcome and next activation.

# Out of Scope

- Work owned by any other phase goal.
- Side effects not explicitly authorized by goal-1.
- Raw prompts, credentials, provider payloads, or unrelated private context.

# Risks

- Prerequisite or writer-lease drift.
- Hidden scope expansion across product, Git, or provider boundaries.
- Evidence that does not prove the goal condition.
- Stale bundle, source, route, claim, or deployment state.

# Links / Artifacts

- goal-1
- prd-1
- edd-1
- chk-1

# Completion Evidence

All eight actionable children are done. chk-1 accepts the mdkg-only scope with nested validation, routing, pack, bundle, root projection, and Remotion-placeholder evidence at base SHA `2fdc15af544ac1931c106bd1b63536d537aafcf8`.
