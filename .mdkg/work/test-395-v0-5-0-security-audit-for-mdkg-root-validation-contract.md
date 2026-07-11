---
id: test-395
type: test
title: v0.5.0 security audit for mdkg root validation contract
status: done
priority: 1
parent: loop-5
tags: [loop-template, audit, security, loop-fork, loop-child, test]
owners: []
links: []
artifacts: []
relates: [loop-5, spike-30, task-724, task-726, task-727, test-397, test-398]
blocked_by: []
blocks: []
refs: [loop-5, template://loops/security-audit, spike-30, task-724, task-726, task-727, test-397, test-398]
context_refs: [root:goal-61, dec-71, chk-415, task-688, goal-64]
evidence_refs: [spike-30, dec-71, chk-415, chk-416, chk-417, chk-418, chk-419]
aliases: []
skills: [pursue-mdkg-loop]
cases: []
created: 2026-07-10
updated: 2026-07-10
---
# Test Contract

Validate that v0.5.0 security audit for mdkg root reaches its definition of done for goal-61.

# Cases

- Loop and linked child nodes are discoverable.
- Every required local evidence lane has an identity-scoped checkpoint binding.
- Dependency advisories are waived only by the matching decision and approval; unrelated refs cannot satisfy the lane.
- Both validated findings have implemented regression contracts and no unresolved local release blocker remains.
- External scan work remains visible in `task-688` rather than being falsely claimed complete.
- `loop plan loop-5` reports all children complete and closeout ready before the loop is closed.

# Evidence

Template: template://loops/security-audit

Source findings: `spike-30`. Local-only authorization: `dec-71`. Waiver approval: `chk-415`. Graph containment proof: `chk-416`, `chk-417`. ZIP-bound proof: `chk-418`, `chk-419`.
