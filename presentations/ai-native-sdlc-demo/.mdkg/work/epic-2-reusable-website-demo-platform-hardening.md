---
id: epic-2
type: epic
title: Reusable website-demo platform hardening
status: done
priority: 1
tags: [ai-native-sdlc, presentation-demo, phase-2]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-platform/activation-contract.json, artifacts/demo-platform/drift-audit.md, artifacts/demo-platform/proposed-source-allowlist.json, artifacts/demo-platform/goal-2-activation-receipt.json, artifacts/demo-platform/interface-contract.json, artifacts/demo-platform/validation-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-2, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6]
context_refs: [goal-2, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6]
evidence_refs: [chk-3, test-4, test-5, test-6, chk-4]
aliases: [phase-2-epic]
skills: [select-work-and-ground-context, pursue-mdkg-goal, build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Goal

Locally harden the reusable demo integration and fork startup contract without publication.

# Scope

Owned actionable chain:

- spike-2
- task-5
- task-6
- task-7
- task-8
- task-9
- task-10
- test-4
- test-5
- test-6

All listed nodes use epic-2, parent goal-2, and symmetric prev/next links. The goal scopes this epic recursively.

# Milestones

- Read-only discovery gate accepted and spike-2 completed without shared-source mutation.
- Mutation receipt accepted with exact owners, base commit, path/operation allowlist, dirty/staged inventory, quiet window, invalidation rules, and release condition.
- Every actionable node completed in deterministic order.
- Required checks and public-safe evidence recorded.
- One accepted phase checkpoint records the outcome and next activation.

# Out of Scope

- Work owned by any other phase goal.
- Side effects not explicitly authorized by goal-2.
- Mutation of `examples/demo-runs/demo-001/**`; it is historical read-only evidence.
- Root bundle refresh, staging, commit, push, deployment, or provider mutation during ordinary Goal 2 execution.
- Raw prompts, credentials, provider payloads, or unrelated private context.

# Risks

- Prerequisite or writer-lease drift.
- Hidden scope expansion across product, Git, or provider boundaries.
- Evidence that does not prove the goal condition.
- Stale bundle, source, route, claim, or deployment state.

# Links / Artifacts

- goal-2
- prd-1
- edd-1
- chk-4
