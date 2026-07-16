---
id: epic-254
type: epic
title: Generic public skill policy and package release authority
status: done
priority: 1
tags: [lifecycle, skills, public-seed, release-authority]
owners: [goal-60-mdkg-child-writer]
links: []
artifacts: []
relates: [goal-74, goal-75]
blocked_by: []
blocks: []
refs: [edd-79, dec-85, goal-74, goal-75]
context_refs: [edd-79, dec-85]
evidence_refs: [chk-540]
aliases: []
skills: [pursue-mdkg-goal, author-mdkg-skill, service-boundary-ownership-check, verify-close-and-checkpoint]
created: 2026-07-16
updated: 2026-07-16
---
# Goal

Provide one explicit-QID lifecycle that can be shipped in the public agent seed
without package release authority, while preserving a narrow local release
handoff for repository maintainers.

# Scope

- Evolve canonical `pursue-mdkg-goal`, configured mirrors, and its exact public
  default seed counterpart.
- Add a repository-local `release-mdkg-package` skill and configured mirrors.
- Prove `mdkg init --agent` discovers the lifecycle skill.
- Record deterministic lifecycle, portability, release-isolation, and protected
  path evidence.
- Close `goal-74` locally and leave `goal-75` paused.

# Milestones

- Explicit-QID pursuit and local-only closeout contract authored.
- Public seed and configured mirrors validate with exact equality.
- Release authority is isolated from public defaults.
- Final checkpoint and local commit record complete evidence.

# Out of Scope

- Functional source, scripts, tests, package or lock metadata, dependencies,
  generated contracts, fixtures, and non-skill templates.
- Existing release goals and all other pre-existing semantic graph nodes.
- Push, publish, tag, deploy, provider mutation, history rewrite, archive or
  bundle generation, subgraph sync, and gitlink staging.

# Risks

- Selected-goal state can be stale and must not redirect explicit-QID work.
- A release procedure could leak into public defaults unless absence is tested.
- Managed mirrors can drift unless synchronization and exact hashes are checked.

# Links / Artifacts

- `edd-79`
- `dec-85`
- `goal-74`
- `goal-75`

# Closeout

Canonical/public lifecycle policy, local release authority, init discovery,
deterministic tests, protected-path proof, and local-only closeout evidence are
complete in `chk-540`. Package release remains paused in `goal-75`.
