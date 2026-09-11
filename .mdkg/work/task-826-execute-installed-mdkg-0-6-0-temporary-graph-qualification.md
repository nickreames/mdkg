---
id: task-826
type: task
title: Execute installed mdkg 0.6.0 temporary graph qualification
status: backlog
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-7-init-discovery.json]
relates: []
blocked_by: [task-824, bug-7]
blocks: []
refs: []
context_refs: [goal-83]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-07
updated: 2026-09-09
---

# Overview

Goal: Installed candidate consumer workflows across all six acceptance families.

Context: The complete approved contract is goal-83 and bounded blocker ownership is goal-84.

# Acceptance Criteria

Use the built tarball rather than source imports as consumer CLI. Execute test-477 through test-482 with isolated npm caches/config and local-only remotes. Reproduce missing identity qualification via bug-7. Record commands, exact versions, fixture inputs and outcomes; preserve compact diagnostics and remove only owned fixtures. Never run recovered Demo 3 applications.

# Files Affected

scripts/ and tests/ qualification infrastructure; owned evidence; disposable /private/tmp repositories, package installs and private graph copy.

# Implementation Notes

This is the user-approved local-only 0.6.0 qualification pass. Owner mdkg-project-agent is the sole repository writer; use supported goal claims and transient locks. Preserve selected Goal 73, protected Demo 3 bundles, unrelated paths and runtime DB bytes. No remote Git, publication/dist-tags, tags, history rewriting, provider/deployment, consumer/root/sibling writes, canonical graph migration or bundle/subgraph refresh. Disposable local fixtures are allowed only under /private/tmp. Local explicit-path commits on main are authorized after validation and staged review. Stop for unknown custody, concurrent writer, baseline movement, required global configuration or materially new decisions.

# Test Plan

Each named fixture case has pass/fail and hash-bound runtime/package evidence; no missing runtimes or partial cases counted as pass.

# Links / Artifacts

Owning goal and dependencies are explicit above. Record exact commands, input/source/artifact hashes and pass/fail before completion.

## 2026-09-09 Installed Coverage Reconciliation

Chk-597 and the linked bug-7-init-discovery artifact provide a requirement-level
coverage map for test-477 through test-482. Bootstrap, branch, caught-error
recovery, MCP/cache parity, work/archive and scale scenarios have all executed
across the three required runtimes, on recorded intermediate candidates. This
does not qualify one final artifact or resolve policy-dependent failures.

Next independent gaps are an installed stale-upgrade-plan refusal and a tracked
node with simultaneous staged/unstaged edits, including pack and mutation proof.
Refresh graph-recovery evidence after the nullable-read optimization. The old
client v2 partial-write hazard, killed-writer recovery, legacy public-bundle
materialization and historical task309 migration disposition remain open.
Final task828 review, release ladder and exact artifact seal remain required.
Keep this aggregate uncompleted; no compatibility waiver or publication approval.
