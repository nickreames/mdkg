---
id: spike-1
type: spike
title: Research the demo audience and proof path
status: todo
priority: 1
epic: epic-1
parent: goal-1
tags: [demo, research, mdkg-dev]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: [goal-1, edd-3, dec-1]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
---
# Research Question

What is the smallest live-demo proof that shows an agent can start from mdkg context, perform useful coding work, and close with evidence?

# Context And Constraints

- The demo must be public-inspectable and safe to include in this repo.
- The demo must be local-only; deploy and promotion are separate explicit decisions.
- The agent should need only `goal-1` and the local mdkg CLI to begin.

# Search Plan

- Inspect `DEMO_BRIEF.md`, `edd-3`, and `dec-1`.
- Compare candidate demo artifacts by expected live-talk clarity, implementation time, and validation simplicity.
- If external examples are used, summarize links rather than storing raw page dumps.

# Findings

- Pending execution. This spike should choose between static page, tiny CLI transcript, or generated README proof.

# Options And Tradeoffs

- static page: visually understandable, but requires more frontend polish.
- CLI transcript artifact: fastest, but less visually compelling in a talk.
- generated README proof: durable and simple, but less impressive live.

# Recommendation

Start with the smallest local artifact that can be validated quickly, then add polish only if it improves the live explanation.

# Follow-Up Nodes To Create

- task-1
- test-1

# Skill Candidates

- future demo-runner skill after one rehearsal

# Data Structures And Algorithms Notes

- Keep state in markdown files and mdkg nodes; avoid runtime services.

# UX Notes

- The audience should see the goal, the pack, the implementation, and the checkpoint in sequence.

# Security Notes

- Do not store raw prompts, credentials, provider payloads, or private repo references.

# mdkg.dev Launch Implications

- This graph can be used as a small proof on mdkg.dev after a later promotion decision.

# Evidence And Sources

- `DEMO_BRIEF.md`
- goal-1
- edd-3
- dec-1
