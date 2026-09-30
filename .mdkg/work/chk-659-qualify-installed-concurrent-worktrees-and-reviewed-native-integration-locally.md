---
id: chk-659
type: checkpoint
title: Qualify installed concurrent worktrees and reviewed native integration locally
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/test-478-local-collaboration-qualification.json, .mdkg/artifacts/goal-86/test-478-installed-collaboration.cjs, .mdkg/artifacts/goal-86/test-478-installed-worker.cjs]
relates: [test-478, task-826, test-487, task-828, task-830, goal-86, dec-98]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [test-478]
created: 2026-09-28
updated: 2026-09-28
---
# Summary

Test478 has current local installed collaboration evidence on the retained
0.6.0 candidate. Actual concurrent linked worktrees, independent checkout
state, killed-writer recovery isolation and a reviewed four-conflict native
merge pass. Test478 remains progress; Goal86 remains active and NOT_READY.

# Scope Covered

One writer under Goal86/Dec98. Entry: main at
6d23981e70bc68798def73c81b9cd5fa7bc9f3df, 69 ahead/0 behind cached
origin/main and162 preserved dirty paths. No remote verification, staging or
commit. Only private qualification drivers, sanitized mdkg evidence and
required projections changed in this lane; package inputs remained unchanged.

Disposable native Git repositories, linked worktrees, commits and merges were
confined to owned /private/tmp fixtures. No canonical Git mutation, provider,
publication, blocked scan-context access, native helper, graph migration or
bundle/subgraph refresh occurred.

# Decisions Captured

Dec98 governs. Bugs46/47 remain DEFERRED / UNRESOLVED under paused Goal87,
not accepted/fixed. Portable Node support and explicit operator-confirmed
recovery remain unchanged. Goals85/87 stay paused and no release authority
follows from these tests.

# Implementation Summary

The bounded private driver installs the retained candidate with isolated
offline npm/Git configuration and existing artifact/process/fixture helpers.
Before/after checks bind all273 captured source inputs, the candidate, capture,
installed package files and both driver hashes. No repack was performed.

A trusted fixture worker holds actual installed CLI writer locks concurrently;
it also kills only its own child after a selected transaction write. Both
worktrees retain independent lock/journal/index/runtime/selection state. The
native integration resolves reviewed graph paths, configuration and source
separately; it does not apply blanket ours treatment to .mdkg.

# Verification / Testing

- Node24.18.0, macOS arm64; exact candidate SHA256
  6154e4ea920bfa09d57532171df808f3f406250b44b2b318f0bb48542f82cdca.
- Existing installed identity/collaboration family: pass,35697.163ms. It
  covers natural alias collisions, cross-links, tracked staged/unstaged nodes,
  same-identity/lifecycle/evidence/deletion decisions and replay/reintroduction.
- Existing installed Git-observation family:288 cases pass,160310.209ms,
  across standalone, actual worktrees, submodule and separate-gitdir fixtures.
  Both families completed before the new linked fixture's setup error. They
  were reused unchanged, not rerun by the final linked-only selection.
- Corrected linked family: pass,28743.405ms. Simultaneous creation and edits,
  same-checkout writer refusal, peer success,60 warm/cold JSON/SQLite reads
  with explicit --root and caller GIT_OPTIONAL_LOCKS=1, two actual SIGKILL
  journals, cross-checkout approval refusal and peer-state preservation pass.
- The merge had four actual conflicts: config, common node, colliding authored
  node and source. Invalid config and unresolved Git stages each refuse without
  mutation. Explicit resolution validates the whole graph and combined source;
  both ancestries survive. Obsolete decisions refuse, fresh replay is a no-op.
- Bounded independent static review found two harness issues (missing db init
  and a JSON-value rather than source-byte hash); both were corrected. Final
  readback found no additional concrete defect. This is not security clearance.
- Additional harness expectations were corrected for config-first refusal and
  stale decision reuse. All failed attempts and final results are retained in
  the receipt; no product source remedy or weakened guard was needed.
- Final graph/index/diff results and protected-state bookends are recorded in
  the linked receipt. No unrelated full suite or release ladder was rerun.

# Known Issues / Follow-ups

- Submodule/gitdir observational coverage is not full v2 collaboration or
  recovery qualification for submodule-backed linked worktrees.
- Unknown lock contents refusal does not prove malformed/incomplete journals.
- The newer sibling source-only commit intentionally remains unmerged; the
  native merge consumed the exact older reviewed incoming revision.
- Initial combined output was tool-truncated. Completed family summaries are
  retained; this checkpoint does not claim a retained full288-row ledger.
- Candidate retained, not sealed. Final macOS/Linux qualification, independent
  remediation acceptance, full ladder and exact artifact seal remain open.
  Windows is unqualified. Continue missing Test478 cases, then Test479.
- All four owned synthetic fixture roots were removed after terminal process
  checks and retaining diagnostics. They are reproducible, not trash-recoverable.

# Links / Artifacts

- Test478 receipt and two private drivers above; Goal86 requirement coverage.
- No local commit or remote/release mutation in this milestone. Protected
  selection/runtime/Demo3/public-release bytes remain unchanged.
- No persistent lease acquired; transient mutation locks released. Goal86's
  active_node remains Test478 as ongoing work, not standing writer authority.
- Skills reused: pursue-mdkg-goal and verify-close-and-checkpoint. Candidates:none.
