---
id: chk-642
type: checkpoint
title: Bind native Git fixtures to owned metadata and supervised process trees
checkpoint_kind: implementation
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/task-838-git-fixture-progress.json]
relates: [goal-86, task-838, dec-97]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-838]
created: 2026-09-22
updated: 2026-09-22
---
# Summary

Verified a bounded Task838 native-Git/process fixture increment. Current affected
checks pass105/105 on each local Node24.15.0/24.18.0/26.0.0 runtime. The same
intermediate installed package passed collaboration and12 graph-recovery cases
per runtime. Task838 and Goal86 remain active/incomplete; publication NOT_READY.

# Scope Covered

Explicit Goal86 continuation, owner mdkg-project-agent, under Dec97's Node.js
and local-only boundary. The preceding turn revalidated status without advancing
implementation; this turn reproduced and corrected concrete fixture defects.

## Changed Surfaces

- Git/process/fixture helpers under scripts/qualification-*.js; two MJS regression
  files; smoke-upgrade.js's owned factory/finalization. Three installed callers
  retain the previously drafted Git-adapter migration and are bound by this evidence.
- Task838, Goal86, this checkpoint, sanitized JSON and required mdkg projections.
- No TypeScript runtime, skills, package metadata or public CLI changes this turn.

## Boundaries

- In scope: local synthetic Git repositories/worktrees, native fixture commits,
  offline installation of one intermediate tarball, Node checks and read-only review.
- Out of scope: canonical Git changes, remote Git, blocked security context,
  native/Rust/Bun implementation, Linux/hosted execution, publication/providers,
  consumer/root/sibling changes, graph migration and bundle/subgraph refresh.
- No credentials, private operational payloads or recovered Demo3 application
  payloads were copied or executed. Raw security reports remain untouched.

# Decisions Captured

Dec97 and Task840's selective-test cadence remain unchanged. No security/platform
waiver; Bugs46/47, Bug60 and Linux qualification remain separate unresolved gates.
This adapter is qualification-only and does not restore removed public Git commands.

# Implementation Summary

Native Git inputs are bound to explicit owned roots/gitdirs/common dirs/indexes.
Mutable metadata hardlinks and executable/config/argument overrides fail closed;
ordinary local clone/worktree/Git-directory indirection remains exercised.

# Implementation Details

- Preserve immutable object sharing used by native local clones, but refuse
  hardlinked mutable refs/reflogs/control data. Disable ambient recursion until
  submodule custody is explicitly supported and qualified.
- Native Git evaluates active worktree-config Booleans; configured identities
  are preserved, including valueless/nonzero extension settings and false controls.
- Shared Node/Git process supervision tracks one outer group. Instrumented nested
  workers join it; timeout/signal escalates to the external owner. Only that owner
  may clean after shutdown proof. EPERM/unknown state retains the root.
- Upgrade finalization preserves original and cleanup errors and reports aggregate
  success afterward. The default macOS temp alias is canonicalized; an explicit
  symlink override is refused. A real factory test supplements source routing checks.
- This is not an OS sandbox, arbitrary detached-descendant guarantee or Bug46/47 fix.

# Verification / Testing

## Command Evidence

- Current focused selection: seven fixture/artifact/output/coverage/CI/ladder
  files,105/105 per Node24.15.0,24.18.0,26.0.0;6.373s,6.536s,6.621s wall time.
- Actual demo smoke passes on each runtime in6.777s,8.607s,8.406s; the later change
  affects only upgrade factory routing, not those demo inputs. Existing four-graph,
  bootstrap/repeat,19-node-pack and nine negative classifications are preserved.
- Installed collaboration plus12 graph-recovery cases per runtime pass using
  identical tarball SHA256058e981a86fee0e3902ab262eeedc1ac6ac59f7593ffd1f3c5d7ed8b8fc4c951.
  Identity/recovery durations127.954s,129.863s,132.694s, excluding build/install.
  This is an unsealed233-file intermediate package, not final installed acceptance.
- Fresh isolated compilation matched145 existing runtime files; public seed/core/
  template copies matched. The first comparison had a one-sided shebang-normalizing
  harness error, corrected without changing source/dist. npm prepack was explicitly
  bypassed for this intermediate fixture artifact; no release gate pass is inferred.
- Installed runs bind the Git helper before its typed-Boolean correction. Those
  callers do not configure worktreeConfig, so the branch-only correction is covered
  by current native controls. This does not claim exact final-source release proof.
- One bounded read-only reviewer found direct and compositional gaps. All received
  regression controls; the final temp-factory correction was locally executed.
  Reviewer did not run tests or grant Task828/Standard/release clearance.
- Full discovery includes171 files; the full suite/coverage ladder was not rerun.
  Bug60's deliberate failure is preserved, not hidden by the focused selection.

## Pass / Fail Status

PARTIAL / NOT_READY. A verified fixture increment is not Task838 completion,
pre-merge readiness, Linux evidence or a final artifact seal.

## Known Warnings

Three existing stale imported-graph warnings remain protected; no bundle refresh.

# Known Issues / Follow-ups

- Remaining fixture callers require classification/migration or tested intentional
  exceptions. Begin with surrounding smoke-branch-conflicts.js and legacy Git calls
  in smoke-upgrade.js. The43-file search inventory is not43 proven unsafe callers.
- Actual published0.5.2 upgrade/recovery was not rerun. No old blocked artifacts
  were sought. Durable final evidence custody and full installed acceptance remain.
- Bug60 design/failing regression, Bugs46/47, Linux, final independent review,
  full ladder and exact final seal still prevent Goal86 completion/publication.

## Follow-up Refs

Task838, Task839, Bug60, Task828, Task829, Task830, Test487; Goal85 remains paused.

# Links / Artifacts

- .mdkg/artifacts/goal-86/task-838-git-fixture-progress.json contains source/log/
  artifact hashes, retained compact case receipts, commands, limits and inventory.
- /private/tmp/mdkg-task838-git-qual.PPoK5C retains the intermediate tarball,
  manifest and diagnostic logs. Successful installed roots were individually
  removed after shutdown checks; this is temporary custody, not a release seal.
- main remains c10113489381badf2845fc378c49b317376f953e, cached67 ahead/0 behind;
  no remote verification, staging or commit. All prior partial source/skill work,
  selected Goal73, runtime DB and Demo3 bundle remain preserved.
- Skills: pursue-mdkg-goal, build-pack-and-execute-task, source-grounded diagnosis,
  verify-close-and-checkpoint. New skill candidates:none. No runtime lease acquired.

# Raw Content Safety

- Summarize evidence and use refs, hashes, and artifact links instead of raw secrets, raw prompts, raw payloads, or bulky execution traces.
