---
id: chk-540
type: checkpoint
title: Generic lifecycle policy and release authority closeout
checkpoint_kind: goal-closeout
status: done
priority: 1
tags: [lifecycle, skills, public-seed, release-authority, local-only]
owners: [goal-60-mdkg-child-writer]
links: []
artifacts: [.mdkg/skills/pursue-mdkg-goal/SKILL.md, assets/init/skills/default/pursue-mdkg-goal/SKILL.md, .mdkg/skills/release-mdkg-package/SKILL.md]
relates: [edd-79, dec-85, goal-74]
blocked_by: []
blocks: []
refs: [edd-79, dec-85, epic-254, goal-74]
context_refs: [edd-79, dec-85]
evidence_refs: []
aliases: []
skills: [pursue-mdkg-goal, author-mdkg-skill, service-boundary-ownership-check, verify-close-and-checkpoint]
scope: [goal-74, epic-254, task-798, task-799, task-800, test-458, test-459, test-460]
created: 2026-07-16
updated: 2026-07-16
---
# Summary

Completed the generic lifecycle policy lane with one canonical explicit-QID
goal-pursuit skill, exact configured mirrors, an exact public default seed, and
a separate repository-local package release skill. All six scoped task/test
nodes are done. `goal-75` remains paused without publication authority.

This checkpoint was created before staging and commit so durable evidence
precedes the path-specific local commit.

# Scope Covered

The scope contains `goal-74`, `epic-254`, tasks `798..800`, tests `458..460`,
and paused release handoff `goal-75`.

## Changed Surfaces

- Canonical `pursue-mdkg-goal`, its two configured mirrors, and exact public
  default seed counterpart.
- Canonical repository-local `release-mdkg-package`, its two configured mirrors,
  managed metadata, and skill registry entry.
- New `edd-79`, `dec-85`, `epic-254`, `goal-74`, `goal-75`, tasks `798..800`,
  tests `458..460`, this checkpoint, and deterministic index metadata.
- No startup or wrapper file changed because the existing `mdkg init --agent`
  discovery path passed.

## Boundaries

- In scope: mdkg skill/policy graph, managed local projections, public lifecycle
  seed, disposable init proof, validation, and one local commit.
- Out of scope and unchanged: TypeScript, functional source, scripts, tests,
  package/lock metadata, dependencies, generated contracts, fixtures,
  non-skill templates, existing release goals, pre-existing semantic nodes,
  archives, bundles, subgraphs, and gitlinks.
- No push, package publication, registry credential inspection, tag, deploy,
  provider mutation, history rewrite, or subgraph synchronization occurred.
- Raw secrets, prompts, provider payloads, and bulky execution traces were not
  stored.

# Decisions Captured

- `edd-79` defines explicit-QID pursuit, stale selected-state handling,
  owner-before-claim, checkpoint/evaluate/done/commit ordering, and release
  isolation.
- `dec-85` requires a dedicated release goal plus current approval and forbids
  release authority in public defaults or ordinary closeout.

# Implementation Summary

- A supplied goal QID is authoritative. Selected state is a read-only hint that
  may be stale or achieved.
- Explicit show and next precede owner verification and explicit goal claim.
- A blocked lane records evidence while other actionable scope continues.
- Durable checkpoint evidence precedes goal evaluation and local commit.
- Goal done follows evaluation only when condition, scoped status, checks, and
  evidence support closure.
- Ordinary goal pursuit defaults to path-specific local commit with no push and
  no package, registry-authentication, tag, deploy, or provider action.
- Package publication is isolated in `release-mdkg-package`, which requires an
  explicit release goal and fresh publication approval. It is absent from public
  defaults.

# Goal Closeout

- Goal condition result: all implementation, policy, portability, release
  isolation, and protected-path requirements are evidenced; explicit final
  evaluate/done and the local commit follow this checkpoint.
- Scoped nodes closed: `task-798`, `task-799`, `task-800`, `test-458`,
  `test-459`, and `test-460` are done.
- Remaining deferred work: `goal-75` is paused until a future explicit release
  request and current publication approval.

# Verification / Testing

## Command Evidence

- Baseline `git rev-parse HEAD`, full status, `mdkg status --json`, and
  `mdkg goal current --json`: clean aligned
  `c8fd346392a247eb8affe65cf84cd4809d717c60`; selected achieved
  `root:goal-73` at `2026-07-16T15:43:02.912Z`.
- `mdkg skill validate --json`: 8 skills checked, 0 warnings, 0 errors.
- Lifecycle `cmp` and SHA-256: canonical, two mirrors, and public seed equal at
  `3b8493ee443a289ba257ed0e30045be84e9b647ef7ebfd88782319382f489776`.
- `mdkg init --agent` disposable fixture: 77 files created; lifecycle `0.2.0`
  discovered; fixture mirrors equal; release skill absent; fixture removed.
- Public named-product scan: no matches.
- Release skill validation and mirror comparisons: passed; public default
  absence passed.
- Protected baseline path assertions: no functional, package, script, test,
  non-skill-template, existing release-node, or pre-existing semantic changes.
- `mdkg index`, `mdkg validate --changed-only --json`, and bounded full
  validation: passed with 0 warnings and 0 errors.
- `git diff --check`: passed.
- Explicit `goal show`, `goal next`, and owned `goal claim` receipts used
  `root:goal-74`; selected `root:goal-73` remained unchanged.

## Pass / Fail Status

- PASS. No validation warning or error remains.

## Known Warnings

- `goal next` emitted informational warnings when traversal encountered linked
  non-actionable EDD, DEC, and paused release-goal context. Graph validation
  reported 0 warnings and 0 errors, and actionable routing completed normally.

# Known Issues / Follow-ups

- The final local commit SHA does not exist at checkpoint creation time by
  design; this checkpoint must precede the commit. The commit and final no-push
  state are returned in the child receipt.
- Package release and managed consumer upgrades remain deliberately deferred.

## Follow-up Refs

- `goal-75`

# Links / Artifacts

- `.mdkg/skills/pursue-mdkg-goal/SKILL.md`
- `assets/init/skills/default/pursue-mdkg-goal/SKILL.md`
- `.mdkg/skills/release-mdkg-package/SKILL.md`
- `edd-79`
- `dec-85`

# Raw Content Safety

- Evidence is summarized with QIDs, hashes, command outcomes, and paths. No raw
  secret, prompt, provider payload, registry credential, or bulky trace is
  retained.
