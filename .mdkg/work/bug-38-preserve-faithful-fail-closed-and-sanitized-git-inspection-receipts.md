---
id: bug-38
type: bug
title: Preserve faithful fail-closed and sanitized Git inspection receipts
status: done
priority: 1
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-36-38-verification.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-84, bug-36, bug-35, test-484, test-485]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-09-11
updated: 2026-09-12
---
# Overview

Goal: qualify faithful, fail-closed, sanitized local Git inspection after the
bug-36 wrapper removal. Owner mdkg-project-agent. Independent static review of
git.ts working-source SHA256
20c7d3ff8ecf12d48fa31d36f41eee23f620a5ae8317b20da2420905b468aafd
found inherited status-column/path corruption, failed status becoming clean,
URL suffix echo, and mismatched fallback remote naming. A configured fsmonitor
execution boundary also needs a focused fixture.

Medium functional blocker and descriptor hardening, not a new validated
Standard-scan vulnerability. Chk-571 rejected a broad Git query-credential
candidate for lack of an established supported credential source/sink. Preserve
that decision and scan accounting; local synthetic echo is not exploit proof.

# Reproduction Steps

1. In an owned temporary Git repo, modify a tracked path without staging; compare
   the first status columns and path against raw native porcelain -z output.
2. Test mixed changes, renames, trailing spaces, tabs/newlines and Unicode.
3. Inject failed/oversized status output; check for successful false-clean state.
4. Use synthetic query/fragment/userinfo remotes, non-origin naming and a
   recording fsmonitor fixture. No real credentials or remote transport.

# Expected vs Actual

- Expected: exact paths/status columns, truthful remote name, failed required
  reads cannot produce clean success, no configured helper execution, and
  sanitized display descriptors without sensitive URL components.
- Before fix: source trimmed positional records, conflated failed status with
  empty output, kept URL suffixes and always named origin. Ten failing tests and
  two passing controls established the boundary before correction.

# Suspected Cause

Display sanitization is reused for machine porcelain; required status uses an
optional-read helper. URL and name selection are independent. Suppression of
optional Git locks alone does not disable configured fsmonitor helpers.

# Fix Plan

Allowed: src/commands/git.ts, direct tests and installed smoke, command docs,
and mdkg evidence. Separate raw NUL-delimited parsing from display sanitization;
fail closed without echoing failed subprocess output; select name/URL together;
use explicit safe descriptor redaction; disable fsmonitor per process without
global configuration. Follow the security fix workflow's independent pre-patch
and post-patch reads. Preserve legitimate HTTPS/SSH/SCP/local descriptions.

Done when: test-485 has failing-before/passing-after proof, installed checks,
broader regression validation and independent review; bind exact source and
package identity. Bug36 and task828 stay gated on verification. Assess retained
published0.5.2 bytes separately; do not infer affected versions from labels.

Exclusions: no Git mutation wrapper, remote Git, publication, provider action,
canonical migration, bundle/subgraph refresh, consumer/root/sibling edits or
historical evidence rewrite. Local commits need exact reviewed paths. Stop on
custody movement or material new decisions. Preserve selected73/runtime/bundle.

# Test Plan

Test-485: temporary synthetic Git repo controls and malformed/failing subprocess
fixtures, then build, focused Git/containment/contract tests, installed smoke,
full ordinary tests, CLI/docs/package checks, graph full/changed-only, SQLite and
diff checks. Final task828 security diff and task829 release ladder remain open.

# Links / Artifacts

- Local verification: .mdkg/artifacts/goal-84/bug-36-38-verification.json.
- 53 focused tests and 1402 complete ordinary tests pass. One exact intermediate
  package passes 26 refusals plus 16 inspection cases on each required Node
  runtime (24.15.0, 24.18.0, 26.0.0). Source fingerprints bind the evidence.
- The single independent review cycle found content filters, helper-name
  variants, mutable HEAD/tree pairing and POSIX-only filename fixture gaps;
  confirmed issues are addressed with regression proof. Tracked clean/process
  filters now fail closed, including initialized submodules, rather than execute
  helpers or fabricate normalization. Unused configured filters remain usable.
- Published0.5.2 retained bytes reproduce the original status, remote descriptor,
  failed-status and fsmonitor defects. No new broad credential exploit is claimed.
- Task828 final security acceptance, test484 full generic-boundary qualification
  and the final release ladder/seal remain open. Windows is unverified. This
  bounded implementation closeout does not qualify or publish0.6.0.
