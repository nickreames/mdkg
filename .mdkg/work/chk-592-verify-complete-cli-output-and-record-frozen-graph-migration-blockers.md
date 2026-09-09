---
id: chk-592
type: checkpoint
title: Verify complete CLI output and record frozen graph migration blockers
checkpoint_kind: test-proof
status: done
priority: 9
tags: []
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-84/bug-33-verification.json]
relates: [goal-83, goal-84]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [bug-33]
created: 2026-09-09
updated: 2026-09-09
---
# Summary

The CLI now drains pending stdout and stderr before natural process termination.
Large structured responses and diagnostics are complete without changing exit
codes. Bug-33 has failing-before/passing-after source and installed proof.
Overall Goal83 remains NOT_READY; no package publication or canonical migration.

# Scope Covered

Bug-33 under Goal83/84, owned by mdkg-project-agent. Broader migration rehearsal
diagnostics remain tracked under bug-7; no compatibility policy was inferred.

## Changed Surfaces

src/cli.ts; tests/commands/cli_output.test.ts; bug-33, bug-7, Goal84,
test-483/task-828 routing, this checkpoint and bug-33 verification evidence.
Required index projections remain generated custody, excluded from the commit.

## Boundaries

One repository writer; explicit-path local commit after validation. No remote
Git, push, tag, publish, provider, deployment, root/sibling change, canonical
migration or bundle refresh. Existing bug-17 dirty source/test/evidence, selected
Goal73, runtime DB and protected Demo3 bundle remain unchanged. Temporary private
graph contents are not committed; only sanitized diagnostics and hashes survive.

# Decisions Captured

No new policy decisions. Old-client v2 adoption, killed-writer recovery and old
config-less public bundle materialization retain their unresolved treatment.

# Implementation Summary

Replace main's immediate process.exit calls with process.exitCode assignments.
Both successful commands and rejected asynchronous execution let Node drain
pending output. Bounded independent source review found no patch-introduced issue
and verified MCP EOF and oversized materialization-input termination controls.

# Test Proof

Eight subprocess regressions fail before and pass after: five large UTF-8 formats,
a slow consumer, handled diagnostics and rejected async diagnostics. Piped bytes
match regular-file output, including terminal sentinel and valid JSON. All eight
pass against the installed candidate on each of Node 24.15.0, 24.18.0 and 26.0.0.
The published 0.5.2 package and original candidate both reproduce truncation.
The broader CLI/MCP/Git-materialization group passes 79 tests.

# Verification / Testing

## Command Evidence

Fresh Node 24.18.0 npm test: 1349 passed, zero failed/skipped. CLI/docs parity and
26 release-contract tests pass. Complete command/output hashes are in the artifact.
Intermediate package SHA-256: 9ec0966f45e3a6e07ea35f98fd9f941bba1997e5a934ff8063232af02c0ee860.
This is a built 0.5.2-labelled development artifact, packed without prepack for
bounded qualification. It is not the final 0.6.0 seal or complete release ladder.

## Pass / Fail Status

Output regression and installed qualification pass. Full graph validation before
lifecycle closure has zero errors. Final projection/diff checks are recorded in
the verification artifact before local commit. Goal83 remains incomplete.

## Known Warnings

The frozen private graph preview now returns 2,952,912 bytes of valid JSON,
2,490 mappings and eight blocking diagnostics. Seven skill/tool bindings are not
proven in MANIFEST/WORK; task-309 has an unresolved mdkg://goal-10 artifact ref.
No migration is applied. The graph predates bug-33 intake, and its stored hash
identifies that exact snapshot rather than claiming it is the new current graph.

# Known Issues / Follow-ups

Classify those migration blockers without synthesizing history. Finish scale and
remaining installed families, bug-7 compatibility/recovery, bug-17, final separate
security diff review, release documentation/metadata, full ladder and artifact seal.

## Follow-up Refs

bug-7, bug-17, task-826, task-827, task-828, task-829, task-830, goal-83, goal-84.

# Links / Artifacts

.mdkg/artifacts/goal-84/bug-33-verification.json.
Diagnostics: /private/tmp/mdkg-cli-drain.wOv5d7. Original private graph snapshot
and initial truncated output: /private/tmp/mdkg-private-migration.eJKLVl.

# Raw Content Safety

No private graph bodies, credentials or provider payloads in committed evidence.
Goal-pursuit, source-grounded diagnosis, pack and verification skills reused;
skill candidates none. Bounded review does not substitute for task-828 clearance.
