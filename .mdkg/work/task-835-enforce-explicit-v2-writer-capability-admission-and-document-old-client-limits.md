---
id: task-835
type: task
title: Enforce explicit v2 writer capability admission and document old client limits
status: done
priority: 1
tags: [release-0.6.0, launch-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/pause-checkpoint-20260915.json, .mdkg/artifacts/goal-86/task-835-local-verification.json]
relates: []
blocked_by: [task-834, bug-39, bug-41, bug-42]
blocks: []
refs: [bug-7, dec-94, dec-96, test-477, test-480, chk-616, task-836]
context_refs: [goal-86, goal-84]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-13
updated: 2026-09-15
---

# Overview

Goal: Implement explicit v2 compatible-writer admission without promising control over an old executable.

Context: Bug7 legacy-writer and configuration-barrier receipts establish partial old-client writes and old-init bypasses. Dec94 accepted all-writers-upgraded adoption.

# Acceptance Criteria

- Extend existing versioned config/capability and migration journal boundaries;
  keep adoption explicit and atomically bind the fence to the reviewed migration.
- Compatible clients still operate on unmerged authored nodes; newer/unknown
  required capability writers refuse before authored/cache/event/lock effects.
- Reproduce actual0.5.2 warm/cold behavior; document its init/force-init bypass
  and the no-mixed-unsupported-writers requirement. Do not claim retroactive enforcement.
- Preview, interrupted apply, rollback and repeated application preserve exact
  ownership, stable identities and Git index. No implicit canonical migration.
- Local implementation evidence is separate from tests477/480 final-artifact proof;
  this task does not wait for Bug7/task826 aggregate acceptance.

# Files Affected

Existing config/version/identity migration and transaction helpers, focused regression/installed fixtures and owned guidance/evidence. No new Git wrapper or runtime enforcement.

# Implementation Notes

Owner: mdkg-project-agent, one writer in this checkout. The explicit Goal86 Run
on2026-09-15 authorizes this previously planned task's bounded implementation,
local validation, evidence
and reviewed explicit-path local commits on main; selected state does not authorize it.
No remote Git/push/tag/publication, provider/deployment, consumer/root/sibling
writes, canonical branch/worktree changes, canonical graph migration, bundle or
subgraph refresh, history rewrite, unrelated cleanup or global configuration changes.
Preserve partial Bug17 work, selected Goal73, runtime DB, Demo3 bundles and unknown
files. Stop on baseline movement, ownership collision, unknown custody, material
new decisions or missing authority. Fixture mutations belong only in owned
disposable local roots; never execute recovered Demo3 application payloads.

# Test Plan

Failing-before/passing-after old-writer and unknown-capability controls; preview zero writes; stale dependencies and interrupted recovery refusal; supported legacy/v2 commands continue working.

# Links / Artifacts

Local implementation verified on2026-09-15. The explicit configuration fence is
part of reviewed migration/upgrade and exact recovery, not an implicit adoption.
Schema1 remains the default; migration writes schema2 first and restores original
configuration last on rollback. Fresh compatibility admission now guards the
tested effect-owning entrypoints. Current init cannot erase a supported fence.
Actual0.5.2 ordinary new/task writers refuse before effects; old init/force-init
remain outside retroactive control. All writers must support adopted capabilities.

All1,585 source tests and86 focused correction tests pass. One unchanged227-file
intermediate tarball passes50 installed CLI scenarios on each
Node24.15.0/24.18.0/26.0.0, including native linked worktrees, uncommitted refs,
exact Git staging, actual pre-fence-package upgrade and changed-terminal refusal.
Two independent source-review findings were reproduced in11 cases and fixed:
direct snapshot sealing admission and terminal upgrade custody. Correction review
found both addressed. This is not fresh Standard or task828 security clearance.

Evidence: .mdkg/artifacts/goal-86/task-835-local-verification.json. Three owned
installed fixture trees were removed; recipes, receipts, logs and exact package
bytes remain. No canonical migration, staging, commit, remote/provider action,
bundle refresh or publication. Protected selection/runtime/Demo3/index bookends
match. Task836 owns killed-writer recovery; final artifact/platform/security,
release-ladder and seal gates remain open. Skill candidates:none.

Resumed by Nick after chk616 on2026-09-15. Exact checkpoint hashes match and
mdkg-project-agent resumes the existing claim. Consumer prerelease-v2 adoption
is unknown; qualify source-grounded synthetic/actual-published behavior without
claiming deployed adoption or silently rewriting consumer graphs.

Historical pause diagnosis:

Paused by Nick on 2026-09-15 under chk-616; diagnosis is preserved but no Task835
functional patch has been written. Keep status progress as historical unfinished
work, not an active writer lease. The paused goal prevents further execution.

Current migration leaves schema1 configuration. Preserved warm-cache fixtures
show published0.5.2 new/task writers can change authored/index state before
failing. Cold controls refuse without writes. A fixture-only schema2 fence blocks
those commands, but old init/force-init can bypass it; dec94's no-mixed-unsupported
writers policy remains necessary. Current event enable also creates its log for
unknown required features/writer capability; tested new/index/db/workspace
controls refuse. Other scout candidates remain source-traced, not reproduced.

Resume with exact custody re-inventory, then bind the fence into reviewed
migration/upgrade and recovery before patching all confirmed effect boundaries.
Do not interpret a version bump alone as complete protection. Keep diagnostic
exports/new-target ownership questions distinct from writes to the source graph.

- .mdkg/artifacts/goal-86/pause-checkpoint-20260915.json records exact custody,
  sanitized reproduction summaries, raw evidence hashes and remaining gates.
- Temporary diagnostics remain under /private/tmp/mdkg-goal86-writer-fence-nREhVd;
  reverify hashes or reproduce if unavailable. No final installed/platform or
  security acceptance is implied.
