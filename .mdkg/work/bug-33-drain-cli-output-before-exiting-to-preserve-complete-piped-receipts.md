---
id: bug-33
type: bug
title: Drain CLI output before exiting to preserve complete piped receipts
status: done
priority: 1
tags: [release-0.6.0, local-qualification]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-33-verification.json]
relates: [bug-7]
blocked_by: []
blocks: []
refs: [goal-83, goal-84, chk-592, test-483]
context_refs: []
evidence_refs: []
aliases: []
skills: []
created: 2026-09-09
updated: 2026-09-09
---
# Overview

Large successful CLI responses are truncated when stdout is a pipe. Machine
consumers receive invalid JSON or incomplete text with exit code zero. This
blocks trustworthy migration/reconciliation plans and ordinary graph reads.
Owner: mdkg-project-agent under the approved Goal83/84 local qualification pass.
This is a behavioral publication blocker, not a newly attributed security finding.

# Reproduction Steps

1. Initialize an isolated graph and append approximately 1 MB of synthetic UTF-8
   text to a task. Run the installed CLI's show task-1 with and without --json.
2. Compare spawned piped output with the same command directed to a regular file.
3. Both published 0.5.2 and the intermediate candidate truncate near 64 KiB with
   exit zero; file output is complete. No maxBuffer error or signal occurs.
4. The private current-graph migration preview independently returned 65,536
   bytes of invalid JSON with exit zero. No migration was applied.

# Expected vs Actual

- expected: complete, byte-equivalent piped/file output and correct exit status.
- actual: piped JSON lacks its closing body and final sentinel; text is truncated.

# Suspected Cause

src/cli.ts main calls process.exit immediately after command completion, before
pending stdout/stderr writes drain. The affected-version assessment is confirmed
against the actual published 0.5.2 package and the local candidate on Node 26.0.0.

# Fix Plan

Goal: preserve complete stdout/stderr without changing command semantics or exit
codes. Use natural event-loop completion with process.exitCode, subject to source
regressions and installed runtime proof. Scope: src/cli.ts, focused CLI tests,
directly required qualification harnesses and Goal83/84 nodes/evidence/projections.
No unrelated refactor or transport-policy change. Preserve all nine pre-existing
dirty paths and selected/runtime/Demo3 bytes. No canonical migration, bundles,
remote Git, tags, publish, provider/deployment, root/sibling writes or global config.
Local explicit-path commits remain permitted after validation and review. Stop
for new ownership, baseline movement or materially new behavior/policy decisions.

# Test Plan

Failing-before/passing-after real subprocess tests must compare large UTF-8
structured/text output against complete file output, include slow consumers,
complete nonzero diagnostics and rejected asynchronous execution, and preserve
exit codes. Verify the installed candidate on Node 24.15.0, 24.18.0 and 26.0.0.
Re-run the frozen private graph preview without applying migration, then full
source/CLI/docs/graph/SQLite/diff checks. Final independent task-828 review remains
required; no final artifact seal or publication clearance is implied by this fix.

# Links / Artifacts

Private reproduction diagnostics: /private/tmp/mdkg-cli-drain.wOv5d7.
Original migration diagnostics: /private/tmp/mdkg-private-migration.eJKLVl.
Commit only compact sanitized evidence and hashes, not private graph bodies.

## Local Verification

Chk-592 and bug-33-verification.json record eight failing-before/passing-after
regressions, 24 installed cases across all three required Node versions, 79
focused tests, and a fresh 1349-test full suite with zero failures/skips.
CLI/docs parity and 26 release-contract checks pass. Bounded independent review
identified no patch-introduced issue; final task-828 review remains required.
The frozen private migration preview now returns its complete 2.95 MB JSON plan
and eight genuine blocking diagnostics. No migration was applied or waived.
This bounded output defect is locally fixed; the overall release is NOT_READY.
