---
id: test-472
type: test
title: Prove canonical test CI audit lane identity and fork readiness
status: backlog
priority: 1
parent: goal-78
prev: task-813
tags: [loops, templates, tests, ci, test]
owners: []
links: []
artifacts: []
relates: [task-813, loop-7]
blocked_by: [task-813]
blocks: []
refs: [goal-78, task-813, loop-7, dec-86, chk-544]
context_refs: [goal-78, task-813, loop-7, dec-86, chk-544]
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint, pursue-mdkg-loop]
cases: [six_frontmatter_identities, six_body_identities, one_to_one_mapping, negative_lane_drift, observational_dry_run, disposable_real_fork, plan_next_pack_readiness, completed_loop_unchanged]
created: 2026-07-25
updated: 2026-07-25
---
# Overview

Prove the canonical test/CI/skill audit template exposes one stable identity per
required body lane and produces a decision-bindable disposable fork without
changing completed Loop 7.

# Target / Scope

- canonical test/CI/skill audit template
- frontmatter/body evidence-lane identity validator
- fork dry-run and isolated real-fork behavior
- loop show, plan, next, and concise pack

# Preconditions / Environment

- `root:task-813` is done.
- Use a disposable repository fixture for the real fork.
- Keep the current checkout's `root:loop-7` read-only.

# Test Cases

- Frontmatter declares exactly the six accepted stable identities.
- The body matrix declares exactly those six identities once each.
- Removing, duplicating, renaming, or adding a lane fails with the lane
  identity.
- `loop fork --dry-run` writes no node, index, event, SQLite reservation, or
  selected-goal state.
- A disposable real fork can bind all pre-run questions and all six lanes.
- `loop plan` has no invalid binding; `loop next` selects the grounding spike;
  concise pack dry-run succeeds.
- Completed `root:loop-7` content, evidence, status, and stored template hash
  remain unchanged in this repository.

# Results / Evidence

Attach identity validator cases, dry-run before/after state, disposable fork
IDs and readiness receipts, concise-pack stats, Loop 7 unchanged proof, and
final Git boundary to a test-proof checkpoint.

# Notes / Follow-ups

- Template lineage for existing forks remains historical; currentness is
  reported rather than silently rewritten.
