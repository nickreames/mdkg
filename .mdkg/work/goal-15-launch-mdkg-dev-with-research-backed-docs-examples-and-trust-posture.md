---
id: goal-15
type: goal
title: Launch mdkg.dev with research-backed docs examples and trust posture
status: todo
priority: 2
goal_state: paused
active_node: task-354
goal_condition: Launch mdkg.dev only after spike dogfooding, generated command docs, public examples, security posture, and downstream upgrade narratives are validated.
scope_refs: [epic-78, epic-79, epic-80, epic-81, epic-82, task-354, task-355, task-356, task-357, task-358, task-359, task-360, task-361, task-362, test-147, test-148, test-149, test-150]
required_skills: [pursue-mdkg-goal, author-mdkg-skill, verify-close-and-checkpoint]
required_checks: [npm run build, npm run cli:contract, npm run smoke:command-docs, node dist/cli.js validate --json, npm run smoke:spike, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [mdkg-dev, docs, launch, trust, seo, examples]
owners: []
links: []
artifacts: []
relates: [epic-76, epic-77]
blocked_by: []
blocks: []
refs: [goal-14]
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
---
# Objective

Prepare mdkg.dev for public launch through research-backed generated docs,
outcome guides, examples, security/trust positioning, and downstream upgrade
narratives.

# End Condition

- Generated command reference docs are produced from mdkg-native command
  contracts and cannot drift silently.
- Public guides explain real outcomes: initialize, inspect, plan, pack, use
  project DB queues, work with SPEC/WORK records, and manage subgraphs.
- Public examples are validated in fresh temp repos.
- Security/trust docs explain local-first boundaries, no-secret policy,
  generated caches, project DB runtime/state policy, and subgraph safety.
- Downstream upgrade narratives explain dry-run-first adoption and avoid
  cross-repo mutation.
- Spike dogfooding and SKILL.md enhancements shape the docs before launch.

# Non-Goals

- No mdkg.dev website launch until `goal-14` has shipped spike support.
- No public worker execution or public internal DB event/reducer/lease CLI.
- No real npm publish, git tag, or push from this paused goal.
- No SEO/marketing claims that are not backed by examples or docs.

# Recursive Algorithm

1. Inspect the current goal state, relevant graph nodes, and required skills.
2. Create missing mdkg nodes only when evidence shows they are needed.
3. Select one concrete child node and work it to completion.
4. Run required checks and record evidence.
5. Re-evaluate the end condition and continue, pause, or close.

# Required Skills

- `pursue-mdkg-goal`
- `author-mdkg-skill`
- `verify-close-and-checkpoint`

# Required Checks

- `npm run build`
- `npm run cli:contract`
- `npm run smoke:command-docs`
- `node dist/cli.js validate --json`
- `npm run smoke:spike`
- `git diff --check`

# Acceptance Criteria

- Goal remains paused until spike support can be dogfooded.
- Every launch doc has either generated command metadata, a tested example, or
  explicit research-spike evidence behind it.
- No public docs contain secrets, raw local paths, or misleading execution claims.
- Downstream repo upgrade material is dry-run-first and no-cross-repo-mutation by
  default.

# Definition Of Done

- Goal condition is achieved.
- Required checks have evidence.
- Completion evidence is recorded in the goal.

# Stop Conditions

- Goal is blocked beyond the configured attempt limit.
- Required context or permissions are missing.
- Budget or safety constraints prevent continued work.
- `goal-14` is not complete.
- Spike dogfood evidence is missing.

# Current State

Paused until first-class `spike` support exists and can produce launch research
evidence. Initial future active node is `task-354`.

# Iteration Log

- No iterations recorded yet.

# Skill Improvement Candidates

- None yet.

# Completion Evidence

- Pending.
