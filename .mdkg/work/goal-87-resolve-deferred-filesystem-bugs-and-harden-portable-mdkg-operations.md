---
id: goal-87
type: goal
title: Resolve deferred filesystem bugs and harden portable mdkg operations
status: blocked
priority: 2
goal_state: paused
goal_condition: Bugs46 and47 have complete portable remedies with independently verified metadata and containment evidence under a separately approved run; no deferred finding is misreported as fixed.
scope_refs: [bug-46, bug-47]
required_skills: [select-work-and-ground-context, pursue-mdkg-goal, verify-close-and-checkpoint]
required_checks: [npm run build, npm run test, node dist/cli.js validate --json, git diff --check, independent current-source security verification and installed-platform qualification]
max_iterations: 25
blocked_after_attempts: 3
tags: [deferred, hardening, post-0.6.0]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: [goal-86, bug-46, bug-47, epic-256]
context_refs: [goal-86, dec-98, epic-256]
evidence_refs: [chk-652]
aliases: []
skills: []
created: 2026-09-28
updated: 2026-09-28
---
# Objective

Resolve the two filesystem bugs deferred from 0.6.0 under Dec98, preserving
their existing identities, severity, reproductions and affected-version limits.
This is a paused follow-up, not a parallel writer or an active release gate.

# End Condition

Both scoped bugs have complete source remedies, failing-before/passing-after
regressions, independent review and installed evidence on supported platforms.
Metadata preservation must cover applicable owner/group/ACL and mode before
exposure; containment must address ancestor replacement, not just rechecks.
Until then both remain unresolved even if 0.6.0 is separately published.

# Non-Goals

- No current implementation, automatic activation or standing writer lease.
- No native/OS-specific layer under the present Node-only policy. A remedy
  requiring a materially different architecture needs a new explicit decision.
- No consumer policy, runtime sandbox, remote Git, publication, providers,
  cross-project changes, history rewrite or canonical graph migration.

# Recursive Algorithm

1. Wait for a separately authorized Run; re-inventory source and custody first.
2. Reproduce the retained defects in owned synthetic fixtures without opening
   blocked scan context or executing historical Demo3 payloads.
3. Design a complete portable remedy or stop for the precise architecture
   decision; do not call a partial mitigation remediation.
4. Claim and implement one scoped bug at a time, then independently verify it.
5. Run full integrated and installed acceptance, record residual uncertainty,
   evaluate the explicit goal and close only when its end condition holds.

# Required Skills

- select-work-and-ground-context, pursue-mdkg-goal, verify-close-and-checkpoint

# Required Checks

- Build, affected filesystem/caller tests, full suite before integration,
  graph/diff checks, independent source review and exact installed-package tests.

# Acceptance Criteria

- Existing private-file metadata and hard-linked peers are preserved correctly.
- Controlled ancestor swaps cannot redirect reads, writes or cleanup outside
  admitted authority, including callback-mediated callers and failure paths.
- Native Git worktrees and portable ordinary workflows remain usable.
- No expanded platform claim or native dependency without separate approval.

# Definition Of Done

- Each bug is genuinely fixed and verified, not merely deferred or documented.
- All required checks have exact source/artifact/runtime evidence.
- No publication authority is inferred; remaining custody and ownership released.

# Stop Conditions

- Unknown dirty ownership, writer collision or baseline movement.
- A required primitive or platform guarantee exceeds the approved Node contract.
- Inaccessible evidence, new external authority or incomplete security proof.

# Current State

PAUSED / UNCLAIMED. Nick requested deferral, not acceptance or completion.
Only planning is authorized by the current Goal86 continuation. No active node.

# Iteration Log

- 2026-09-28: Created with normal allocation and paused; reuses Bugs46/47.

# Skill Improvement Candidates

- None.

# Completion Evidence

- Pending.
