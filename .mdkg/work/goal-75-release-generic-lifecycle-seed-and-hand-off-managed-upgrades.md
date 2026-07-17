---
id: goal-75
type: goal
title: Release generic lifecycle seed and hand off managed upgrades
status: blocked
priority: 2
goal_state: paused
goal_condition: Goal 75 is achieved only after a future operator supplies fresh explicit package publication approval, the accepted local lifecycle commit passes release validation, the package is published and independently verified, push tag and deployment authority are separately recorded where applicable, and managed consumer upgrades are handed off with exact released-version and commit receipts.
scope_refs: []
required_skills: [release-mdkg-package, service-boundary-ownership-check, verify-close-and-checkpoint]
required_checks: [mdkg goal show root:goal-75 --json, mdkg skill validate release-mdkg-package --json, npm view mdkg version --json, mdkg validate --changed-only --json, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [release, package, public-seed, handoff]
owners: [future-release-owner]
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: [generic-lifecycle-package-release-handoff]
skills: [release-mdkg-package, service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-16
updated: 2026-07-16
---
# Objective

Release the accepted generic lifecycle seed under fresh package authority, then
hand off reviewed managed upgrades without conflating publication, Git, deploy,
or consumer mutation approvals.

# End Condition

The frontmatter condition is satisfied only by a future release receipt and
version-specific managed-upgrade handoff. This policy lane does not satisfy it.

# Non-Goals

- No package, registry, push, tag, deployment, provider, or consumer mutation
  without a new explicit request and current approval.
- No release action inherited from `goal-74` completion or its local commit.

# Recursive Algorithm

1. Keep this goal paused until an operator explicitly requests package release.
2. Recheck repository, registry, release-line, and approval state at that time.
3. Invoke `release-mdkg-package` only after the explicit goal and current
   publication approval are confirmed.
4. Record package publication separately from push, tag, deploy, and consumer
   upgrade authority.
5. Verify the released package before creating managed-upgrade handoffs.

# Required Skills

- `release-mdkg-package`
- `service-boundary-ownership-check`
- `verify-close-and-checkpoint`

# Required Checks

- Future release checks are listed in frontmatter and must be refreshed against
  the then-current package and registry state.

# Acceptance Criteria

- Fresh explicit release approval is recorded.
- The exact released version and source commit are verified.
- Each later publication or consumer action has its own authority receipt.

# Definition Of Done

- Goal condition is achieved only after real release and verification evidence.
- Completion evidence names the exact package version and source commit.

# Stop Conditions

- Remain paused while publication approval is absent or stale.
- Stop on registry, package, Git, validation, or authority ambiguity.

# Current State

Paused handoff only. No package publication, registry credential inspection,
push, tag, deploy, or managed consumer upgrade is authorized by this node's
creation.

# Iteration Log

- 2026-07-16: Seeded as a separate paused successor to local lifecycle policy
  work. No release action performed.

# Skill Improvement Candidates

- Re-evaluate release commands and checks against current source when resumed.

# Completion Evidence

- Pending future explicit publication authority.
