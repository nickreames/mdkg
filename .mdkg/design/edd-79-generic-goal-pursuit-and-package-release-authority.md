---
id: edd-79
type: edd
title: Generic goal pursuit and package release authority
tags: [lifecycle, skills, release-authority, public-seed]
owners: []
links: []
artifacts: []
relates: [dec-85, epic-254, goal-74]
refs: [dec-85, epic-254, goal-74]
aliases: [explicit-goal-qid-lifecycle, local-package-release-authority]
created: 2026-07-16
updated: 2026-07-16
---
# Overview

Define one portable goal-pursuit lifecycle for mdkg projects and a separate,
repository-local package release authority. The lifecycle must honor a supplied
goal QID even when local selected-goal state points at a stale or achieved goal.
It must also preserve evidence and ownership boundaries through local closeout
without turning ordinary goal work into publication work.

This design evolves the existing `pursue-mdkg-goal` skill. It does not create a
second lifecycle skill. The public default seed receives the same lifecycle
body, while package release instructions remain local to this repository.

# Architecture

The lifecycle has four distinct stages:

1. `select-work-and-ground-context` discovers work when the target is not yet
   established. It remains a read-only planning workflow.
2. `pursue-mdkg-goal` executes a supplied explicit goal QID. Selected-goal state
   is diagnostic context only and never overrides the supplied QID.
3. `verify-close-and-checkpoint` validates changed surfaces and records durable
   evidence. It remains a review workflow rather than a package publisher.
4. `release-mdkg-package` is a repository-local authority gate used only when
   an explicit package release goal is active and current publication approval
   has been recorded.

The canonical lifecycle skill lives under `.mdkg/skills/`. Configured
`.agents/skills/` and `.claude/skills/` copies are managed projections. The
public `assets/init/skills/default/pursue-mdkg-goal/SKILL.md` copy is
semantically identical to the canonical lifecycle body. The release skill is
never copied into `assets/init/skills/default/`.

# Data model

- `TARGET_GOAL_QID`: the explicit root-qualified goal supplied by the user or
  orchestrator. It is authoritative for the run.
- `SELECTED_GOAL_QID`: optional local state returned by `mdkg goal current`.
  It is a hint that may be absent, stale, paused, or achieved.
- `WORK_QID`: one actionable node returned by
  `mdkg goal next "$TARGET_GOAL_QID"`.
- `OWNER`: the explicit writer identity recorded on `WORK_QID` before claim.
- `EVIDENCE`: validation results and a durable checkpoint recorded before a
  local commit.
- `RELEASE_GOAL_QID`: a separate explicit goal whose scope grants package
  publication work only after current approval is confirmed.

# APIs / interfaces

Goal pursuit uses explicit QIDs at every goal boundary:

- `mdkg goal show <goal-qid> --json`
- `mdkg goal next <goal-qid> --json`
- explicit `owners` metadata on `<work-qid>` through the repository's supported
  owner-assignment or authorized frontmatter edit path
- `mdkg goal claim <goal-qid> <work-qid> --json`
- `mdkg checkpoint new <title> --kind goal-closeout --scope <refs> --json`
- `mdkg goal evaluate <goal-qid> --json`
- `mdkg goal done <goal-qid> --json` only after evaluation and evidence support
  closure

Local commit guidance stages only the paths owned by the completed work. It
does not imply push, merge, tag, publish, deploy, provider mutation, registry
credential inspection, or history rewrite authority.

# Failure modes

- The selected goal disagrees with the supplied QID: continue with the supplied
  QID after explicit show/next inspection and leave selection unchanged.
- One lane is blocked: record the blocker on that lane and continue other
  actionable scoped nodes before classifying the whole goal as blocked.
- Ownership is missing or overlaps: do not claim or write until an explicit
  owner is recorded and overlap is resolved.
- Required checks fail: keep the node open, record the failure, and do not
  create a closure commit.
- Goal evaluation does not support closure: do not run `goal done`; create or
  select the remaining scoped work.
- Release intent is implicit or approval is stale: leave the release goal
  paused and perform no package, registry, Git publication, tag, or deployment
  action.

# Observability

The durable trace consists of explicit goal show/next/claim/evaluate receipts,
task evidence, the final checkpoint, deterministic index/event metadata, and a
path-specific local commit. Before/after selected-goal receipts prove that the
execution did not activate, select, or clear another goal.

# Security / privacy

Skills, graph nodes, events, checkpoints, and handoffs must not contain secrets,
tokens, registry credentials, raw provider payloads, or customer data. Ordinary
goal pursuit must not inspect registry authentication. Release work may inspect
only the minimum credential state needed by an explicit release goal and must
never persist secret values.

# Testing strategy

- Compare canonical, configured projections, and public seed lifecycle copies.
- Assert explicit-QID, stale-selection, owner-before-claim,
  checkpoint-before-commit, evaluate-before-done, evidence-supported closure,
  blocker-continuation, path-specific commit, and no-push clauses.
- Initialize a temporary `mdkg init --agent` fixture and prove the lifecycle
  skill is discoverable with the updated body.
- Scan public seed content for repository, customer, and product-specific names.
- Prove `release-mdkg-package` is absent from public defaults.
- Review the baseline-to-commit path set to prove functional source, scripts,
  tests, package metadata, non-skill templates, and existing graph nodes did
  not change.

# Rollout plan

Land the lifecycle, local release authority, public seed, new policy graph, and
validation evidence in one path-specific local commit. Do not push or publish.
Keep `goal-75` paused until a later operator supplies an explicit release goal
execution request and fresh package publication approval.
