---
id: goal-15
type: goal
title: Launch mdkg.dev with research-backed docs examples and trust posture
status: todo
priority: 2
goal_state: paused
goal_condition: Launch mdkg.dev only after spike dogfooding, generated command docs, public examples, security posture, and downstream upgrade narratives are validated.
scope_refs: [epic-78, epic-79, epic-80, epic-81, epic-82, spike-1, spike-2, spike-3, spike-4, spike-5, task-354, task-355, task-356, task-357, task-358, task-359, task-360, task-361, task-362, task-370, task-371, test-147, test-148, test-149, test-150, test-157]
active_node: task-354
required_skills: [pursue-mdkg-goal, author-mdkg-skill, verify-close-and-checkpoint]
required_checks: [npm run build, npm run cli:contract, npm run smoke:command-docs, node dist/cli.js validate --json, npm run smoke:spike, git diff --check]
max_iterations: 25
blocked_after_attempts: 3
tags: [mdkg-dev, docs, launch, trust, seo, examples]
owners: []
links: []
artifacts: []
relates: [epic-76, epic-77, goal-21]
blocked_by: []
blocks: []
refs: [goal-14]
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-16
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

Paused until the mdkg.dev launch lane is explicitly resumed. First-class
`spike` support now exists in the local `0.3.2` release candidate and has
produced launch research evidence. Initial future active node is `task-354`.

`goal-14` dogfooding has created the first spike-backed launch research set:

- `spike-1`: mdkg.dev IA and generated command docs.
- `spike-2`: outcome examples and downstream adoption narratives.
- `spike-3`: security, trust, and no-secret posture.
- `spike-4`: SEO positioning and AI search readiness.
- `spike-5`: technical architecture, data structures, and algorithms narrative.

Follow-up scope added from those spikes:

- `task-370`: source-backed page evidence matrix.
- `task-371`: architecture and state-boundary visuals.
- `test-157`: source-backed claims and examples contract.

# Iteration Log

- 2026-06-15: `goal-14` spike dogfood created `spike-1` through `spike-5` and
  added `task-370`, `task-371`, and `test-157` as launch-readiness follow-up
  work. `goal-15` remains paused; no website implementation has started.
- 2026-06-16: `goal-14` closeout confirmed spike support is implemented and
  `0.3.2` is dry-run publish-ready. `goal-15` still remains paused; resume at
  `task-354` when mdkg.dev documentation/SEO/site work is explicitly selected.

# Skill Improvement Candidates

- Research-to-docs IA skill: turn spike findings plus generated command
  metadata into a page map without starting implementation.
- Example-from-smoke skill: turn packed/temp-repo smoke scripts into public docs
  with expected receipts and failure boundaries.
- Public no-secret docs audit skill: scan generated docs and examples for token
  patterns, private paths, unsupported execution claims, and missing redactions.
- SEO claim audit skill: reject public claims not backed by command metadata,
  smoke evidence, or spike findings.

# Completion Evidence

- Pending.

# Supersession Note

This paused historical mdkg.dev launch goal is superseded by `goal-21`, the versioned 0.4.0 canonical mdkg.dev launch readiness goal. It should be marked archived during `goal-16` only after archived goal lifecycle support is implemented.
