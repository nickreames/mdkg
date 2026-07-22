---
id: goal-76
type: goal
title: Resolve v0.3.9 tag authority before any history rewrite
status: todo
priority: 2
goal_state: paused
goal_condition: Achieved when the immutable identity and publication reach of tag v0.3.9 are proven, an explicit current human decision defines whether a future repository-specific rewrite excludes the tagged range or preserves and republishes the tag safely without any override, a fresh-clone read-only git-gud audit confirms the chosen scope has no unresolved tag blocker, and bounded evidence is checkpointed. This goal never authorizes git-gud plan, apply, or push, tag mutation, force-push, package publication, deployment, or history rewrite.
scope_refs: [task-807, task-808, test-467, task-809]
required_skills: [select-work-and-ground-context, verify-close-and-checkpoint]
required_checks: [git show-ref --tags --dereference, git ls-remote --tags origin, git tag --points-at 072cf5193adf897fff5b5041bef90d0a8c2b0a68, /Users/nick/git/git-gud/target/debug/git-gud audit --range <approved-range> --format json, mdkg index, mdkg validate --changed-only --json, mdkg validate --summary --limit 20 --json, mdkg goal evaluate root:goal-76 --json, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [git-gud, tag, history-policy, follow-up]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-807, task-808, test-467, task-809]
refs: [task-807, task-808, test-467, task-809]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-21
updated: 2026-07-21
---
# Objective

Resolve the tag-policy blocker discovered by the post-publication read-only
audit before anyone creates a repository-specific mdkg rewrite goal.

# End Condition

The tag's local and remote identity is proven, a human-approved preservation or
range-exclusion policy is recorded, and a fresh-clone audit of that exact scope
has no unresolved tag blocker without `--allow-tag-drift`.

# Non-Goals

- Running any git-gud command other than read-only `audit`.
- Moving, deleting, recreating, or pushing a tag.
- Rewriting or force-pushing any ref, publishing npm, or deploying docs.

# Recursive Algorithm

1. Inventory local/live tag object and peeled commit identity read-only.
2. Enumerate no-override strategies and their compatibility with release and
   package provenance.
3. Obtain a current explicit human decision before any tag or rewrite action.
4. Audit only the approved future scope from a fresh clone.
5. Checkpoint bounded evidence and hand off a separate rewrite goal; grant no
   rewrite authority here.

# Required Skills

- `select-work-and-ground-context`
- `verify-close-and-checkpoint`

# Required Checks

- Local/live tag identity and reachability checks.
- One fresh-clone read-only git-gud audit for the approved range.
- Changed-only and bounded full graph validation plus `git diff --check`.

# Acceptance Criteria

- Tag `v0.3.9` at commit `072cf5193adf897fff5b5041bef90d0a8c2b0a68`
  is treated as immutable published provenance until explicit authority says
  otherwise.
- No solution depends on `--allow-tag-drift` or any other override.
- The selected achieved Goal 73 remains unchanged; Goal 76 stays paused until
  separately activated.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Budget or safety constraints prevent continued work.

# Current State

Paused and unselected. Fresh-clone audit of published mdkg SHA `049aa0f` found
273 commits, 72 requiring timestamp rewrite, zero merges, zero signed commits,
and one tagged commit: `072cf519` with `v0.3.9`. Git-gud correctly warned that
apply would require `--allow-tag-drift`; no override or non-audit command ran.

# Iteration Log

- 2026-07-21: Seeded as a follow-up to root Goal 63's normal-publication audit.
  Authoring and publication of this graph grant no tag or rewrite authority.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
