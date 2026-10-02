---
id: chk-654
type: checkpoint
title: Implement portable operator-confirmed graph recovery with exact evidence
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/node-portability/recovery-qualification.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-86, task-841, task-842, test-489, dec-98, goal-87]
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-841]
created: 2026-09-28
updated: 2026-09-28
---
# Summary

Task841's portable recovery implementation and affected callers are locally
verified. Production recovery no longer requires sysctl, procfs, UID eligibility
or a macOS/Linux allowlist. Every recovery write instead requires an explicit
operator assertion that all checkout writers stopped and fresh mode-specific
approval bound to exact checkout/journal/lock/file evidence.

Goal86 remains active and NOT_READY. Bugs46/47 remain DEFERRED / UNRESOLVED in
paused Goal87, not accepted or fixed. Goal85 remains paused and unpublished.

# Scope Covered

One writer, mdkg-project-agent, under the existing Goal86/Dec98 local run.
Entry main/HEAD was 6d23981e70bc68798def73c81b9cd5fa7bc9f3df,
69 commits ahead of cached origin/main, with108 preserved dirty files and
nothing staged. No remote verification, semantic DB lease or canonical graph
migration occurred. The receipt names entry custody and exact input hashes.

# Decisions Captured

Dec98: portable Node implementation, explicit quiescence, versioned approval,
unchanged single-writer/custody requirements. A confirmation is operator intent,
not authentication, OS proof or a distributed lease. Local PID probes only
refuse live/suspended/reused or ambiguous owners. Age/PID absence grants nothing.

# Implementation Summary

- Owner/claim version2 removes OS environment generation; complete legacy
  records remain exact historical bytes, not newly trusted OS evidence.
- Approval version2 binds lock presence/absence, the owner/claim chain,
  journal inventory, authored/control/dependency bytes, checkout and mode.
- `--confirm-quiescent` and fresh `--lock-evidence` are required even for an
  unfinished no-lock journal after a caught error. No-lock terminal repeats
  remain read-only. The private journal records the explicit assertion.
- Stale/missing approvals, false assertions, live/ambiguous owners, malformed
  claim/history, unknown files, changed custody and mode conflicts refuse.
- Both CLI entrypoints, option admission, source/seed guidance and generated
  command references agree. Native Git staging/history remain separate.

# Verification / Testing

- Both new regression cases fail before the fix: an OS utility was invoked,
  and unfinished no-lock recovery wrote without explicit confirmation.
- Focused tests:58/58; affected identity/migration/reconciliation/lock, ordinary
  writer/allocation and CLI tests:345/345, zero failures/skips,55,142.411166ms.
- One234-file intermediate installed0.6.0 tarball, SHA256
  9b312e91815bee8651b5c76bb24d6730ac041ce3153277166563b393888df2df,
  passes12 caught-error migration/reconciliation cases and11 real-SIGKILL
  cases. Every case preserves exact owned outcomes, Git staging and unrelated
  files. Normal prepack/postinstall pass; OS utility, UID and procfs/descriptor
  dependency traps report zero attempts. Recovery execution:131,470.614833ms.
- Runtime/platform:Node24.18.0,macOSarm64. This is not Linux, Windows, final
  artifact, full coverage or independent security acceptance.
- Build, CLI/command parity, generated docs/release notes,472 examples across
  63 files,8 skill validations and diff checks pass. Graph validation has zero
  errors and three pre-existing stale imported-bundle warnings.
- Initial harness typing/build reuse and npm lifecycle-output parsing issues
  were corrected; the receipt retains them. Both owned installed probes were
  removed on completion/failure. No recovered Demo3 payload was executed.

# Known Issues / Follow-ups

- Test489 still owns the complete combined installed observation/resource/
  writer/recovery contract; this checkpoint does not mark it passed.
- Final installed macOS/Linux, independent current-source acceptance, full
  repository/coverage/release ladder and exact artifact seal remain open.
- Selection Goal73, runtime DB and private Demo3 bundle hashes match entry.
  No standing lease or mutation lock remains; no source control staging,
  commit, push, tag, provider, deployment or publication occurred in this unit.
- All attributable work remains unstaged/uncommitted; exact paths are in the
  receipt. No unrelated custody was absorbed and no bundle was refreshed.
- Skills reused:goal pursuit, pack-first execution, source-grounded diagnosis
  and selective verification/checkpointing. New candidates:none.

# Links / Artifacts

- .mdkg/artifacts/goal-86/node-portability/recovery-qualification.json
- .mdkg/artifacts/goal-86/node-portability/recovery-installed-probe.cjs
- Dec98; Task841; Task842; Test489; Goal86; Goal87; Goal85.
