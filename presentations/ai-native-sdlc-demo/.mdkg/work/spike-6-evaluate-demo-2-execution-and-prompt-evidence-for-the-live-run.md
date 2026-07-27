---
id: spike-6
type: spike
title: Evaluate Demo 2 execution and prompt evidence for the live run
status: backlog
priority: 1
epic: epic-6
parent: goal-6
prev: task-27
next: task-47
tags: [ai-native-sdlc, presentation-demo, phase-6, step-2, source-prompt-refinement]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-003/source-prompt-evaluation.md]
relates: []
blocked_by: []
blocks: []
refs: [goal-6, epic-6, prd-1, edd-1, dec-3, dec-5, goal-2, goal-4, goal-5, task-27]
context_refs: [goal-6, epic-6, prd-1, edd-1, dec-3, dec-5, goal-2, goal-4, goal-5, task-27]
evidence_refs: [chk-12]
aliases: [phase-6-source-prompt-evaluation]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-27
updated: 2026-07-27
---
# Research Question

What did Demo 2 prove or expose about deterministic forking, fresh-agent
context, positioning latitude, the source template, the sendoff prompt,
authority handoffs, failure recovery, and audience-facing evidence, and which
changes should be accepted before the live Demo 3 fork?

# Context And Constraints

- Consume only accepted Demo 2 child, candidate, publication, deployment,
  route, rehearsal, fallback, and prompt observations.
- Separate source-template defects, sendoff/prompt defects, operator or pack
  defects, site-adapter defects, execution variance, and presentation-only
  findings.
- Keep mdkg CLI/package APIs, canonical-site adoption, docs, and deployment
  configuration out of this refinement lane.
- A no-change recommendation is valid when the accepted evidence supports it.
- task-47 cannot begin until the user explicitly accepts the recommendation
  and exact future mutation allowlist.

# Search Plan

- Compare the canonical source `goal-1`, Demo 2 specialized/executed `goal-1`,
  bootstrap receipts, pack inventories, child node timing, all fix-forward or
  blocker evidence, and Goal 5 rehearsal notes.
- Inspect the current source template, operator manifest, specialization
  contract, and normative live sendoff at their recorded hashes.
- Test the proposed prompt against the hard requirement to continue through
  push, exact-SHA READY deployments, and live URLs without mid-run approval.

# Findings

Pending Goal 5. Record evidence-backed strengths, defects, confusing
instructions, unnecessary constraints, missing context, and sources of
nondeterminism.

# Options And Tradeoffs

- retain unchanged: safest when Demo 2 evidence shows the contract is
  deterministic and clear.
- bounded refinement: improve only evidenced template/prompt defects while
  preserving source lineage and fixed guardrails.
- broader redesign: reject and route to a later goal if evidence implies CLI,
  package, canonical-site, or external schema changes.

# Recommendation

Write `artifacts/demo-003/source-prompt-evaluation.md` with ranked findings,
accepted/rejected options, exact proposed paths, before hashes, expected
outcomes, regression tests, and a recommended change or no-change decision.
Record explicit user acceptance before task-47.

# Follow-Up Nodes To Create

- task-47 and test-25 already own the accepted refinement and clean-bootstrap
  proof. Create no additional node unless the evidence requires out-of-scope
  work.

# Skill Candidates

- Record only a genuinely reusable workflow gap; do not edit skills here.

# Data Structures And Algorithms Notes

- Preserve deterministic absent-target creation, stable IDs, explicit
  prev/next routing, source hashes, and pack coverage.

# UX Notes

- Keep mdkg fixed as the product and quickstart/issues fixed as CTAs; improve
  only the agent's audience angle, promise, composition, and bounded copy
  instructions when Demo 2 evidence supports it.

# Security Notes

- Preserve public safety, exact allowlists, separate writer roles, and the
  distinction between Demo 2 publication approval and Demo 3 event authority.

# mdkg.dev Launch Implications

- No canonical mdkg.dev adoption belongs to this spike.

# Evidence And Sources

- Pending Goal 5 receipts and current source/operator contracts.
