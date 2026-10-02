---
id: task-831
type: task
title: Recheck mdkg 0.6.0 approval blockers and sealed candidate
status: done
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-85/publication-admission-20261001.json]
relates: []
blocked_by: [chk-570, task-828, task-837, test-487]
blocks: []
refs: []
context_refs: [goal-85, goal-86, dec-96]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-07
updated: 2026-10-01
---

# Fresh publication admission completed - 2026-10-01

Fresh Nick approval, authenticated nickreames identities, exact candidate
admission, unchanged package/harness fingerprints and absent 0.6.0 registry
version were independently verified. CLI/docs/package assertions and graph
checks passed; completed full qualification from Chk570 was reused only for
unchanged inputs. The admission receipt binds all evidence and limits.

Origin/main was subsequently pushed at 31c6c9a1. This task's completion is
preflight proof only. Task832's initial npm attempt was refused by 2FA policy;
Chk670 preserves that partial outcome. Nick then completed interactive approval,
and Chk671 records independent published-byte and clean-install verification.
Historical planning language below does not override current release approval.

# Historical successor contract - 2026-09-13

Under FUTURE fresh publication approval only, independently recheck chk570,
task828, fresh Standard task837, macOS/Linux test487 and every Goal84/86 blocker.
Rehash the exact sealed artifact and package inputs; reject reopened/stale or
missing gates. Never infer authority from goal state, a green report or old
approval. No implicit rebuild, remote Git, tag, provider or deployment action.

The earlier sections below retain their historical evidence. This current addendum,
updated dependencies, goal-86 and dec-96 govern the remaining work. Planning
authoring is not execution, qualification, a writer claim, or publication.

# Overview

Goal: Future fresh publication authority and independent candidate identity verification.

Context: Future goal-85 only; current authority excludes publication.

# Acceptance Criteria

Stay blocked and unclaimed until goal-85 receives fresh explicit publication authority. Verify chk-570 is completed, task-828 passed and goal-84 has no unresolved blockers. Independently verify exact version, source, package-input hashes, tarball integrity and validation freshness. Require the same qualified artifact; do not rebuild implicitly.

# Files Affected

Read goals, immutable candidate and fresh registry state only after explicit publication approval; no action in the current pass.

# Implementation Notes

This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

# Test Plan

Fresh authority receipt plus artifact/blocker recheck; goal done/evaluate alone never authorizes publication.

# Links / Artifacts

Owning goal and dependencies are explicit above. Record exact commands, input/source/artifact hashes and pass/fail before completion.
