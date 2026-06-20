---
id: epic-110
type: epic
title: project DB queue adapter contract
status: todo
priority: 1
tags: [project-db, queue, contract]
owners: []
links: []
artifacts: []
relates: [goal-22, goal-7]
blocked_by: [task-414]
blocks: [task-421, test-187]
refs: []
aliases: [queue-adapter-contract, public-queue-contract]
skills: []
created: 2026-06-17
updated: 2026-06-17
---
# Goal

Document and expose the stable public queue semantics that integration adapters can rely on.

# Scope

- Clarify public CLI queue behavior versus internal project DB helpers.
- Document canonical payload hash, dedupe, oldest-ready claim, lease-owner checked ack/fail, retry delay, expired lease reclaim, max-attempt dead-letter, and stats.
- Add a read-only contract surface or generated JSON contract for adapters.

# Acceptance Criteria

- Queue adapter contract is documented in public docs and init assets.
- Contract output or docs are covered by tests.
- mdkg does not claim ownership over raw runtime payload history.

# Milestones

- Define public queue adapter contract fields.
- Add docs or JSON contract output.
- Prove contract against public queue CLI behavior.

# Out of Scope

- Adding public event, reducer, lease, or materializer CLIs.

# Risks

- Contract docs must not encourage consumers to treat queue delivery rows as canonical event history.

# Related Work

- task-421
- test-187

# Links / Artifacts

- goal-22
