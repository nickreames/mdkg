---
id: bug-60
type: bug
title: Enforce read-only SQLite opens for observational verification
status: done
priority: 1
tags: [release-0.6.0, observational]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/bug-60-local-resume-evidence.json, .mdkg/artifacts/goal-86/node-portability/receipt.json, .mdkg/artifacts/goal-86/node-portability/portable-source-progress.json, .mdkg/artifacts/goal-86/node-portability/runtime-qualification.json, .mdkg/artifacts/goal-86/node-portability/installed-qualification.json]
relates: []
blocked_by: []
blocks: []
refs: [task-837, goal-84, goal-86, task-828, dec-98, task-841, task-842, test-489, chk-655]
context_refs: [goal-86, goal-84, task-837]
evidence_refs: [chk-650, chk-653, chk-654, chk-655]
aliases: []
skills: []
created: 2026-09-17
updated: 2026-09-28
---
# Overview

## Current portable continuation - 2026-09-28

LOCAL IMPLEMENTATION AND INSTALLED ACCEPTANCE COMPLETE under Chk655. Observers
query a Node memory image, not a canonical SQLite pathname or OS descriptor.
Test489 passes86 SQLite cases, resource measurements,29 recovery cases and
real linked-worktree controls on identical installed bytes. Tasks841/842 are
done. Local closure unblocks Task839, not final Test487/Test488/Task828,
full ladder or seal acceptance. Goal86 remains NOT_READY. This was an adjacent
observational defect; the original fourteen-security-finding count is unchanged.

Historical prototype context before the completed implementation:

Chk652 records a bounded19/19 synthetic pass on Node24.18/macOS and explicit
Node26.0 missing-capability refusal. The prototype and source hash are in
node-portability/receipt.json. No production observer/caller was changed.
The4/16/32MiB samples establish feasibility only; a production memory/resource
contract, all caller regressions and installed qualification remain required.

Dec98 authorizes replacing descriptor-path observation with a Node-only
in-memory SQLite image after a bounded local proof. This bug was not deferred
with Bugs46/47; never reopen the known readOnly-only side effect.
Use source admission and exact before/after file checks, reject journal/recovery
states, restrict SQL writes/ATTACH, and preserve ordinary writer controls.
The prototype must assess bounded resource use and unsupported Node capability
before production changes. Node24.18 exposes deserialize; Node24.15 and the
installed26.0 do not. Nick approves a truthful capability/runtime revision;
Task842 owns synchronized metadata/guidance after proof, Test489 owns installed
acceptance. Task841 separately owns portable explicit lock recovery.

Additional owned helper/caller scope: src/core/sqlite_observation.ts,
src/core/project_db_queue.ts and directly required regression fixtures. No
native helper, OS utility, writable canonical observer, temp-copy fallback or
newly invented resource limit may be silently substituted. Later source/API
changes invalidate affected prior Bug60 evidence; retain those results as
historical, not current portable acceptance.

Observational status/validate/index-health paths open SQLite without explicit readOnly. Static source review did not establish an exploit or concrete native mutation, so this is a release-blocking observational-contract/platform gap, not an additional confirmed security finding.

Context: frozen draft0.6.0 source e42f1d93497119c9a1f8684df926510da91dea42.
Affected-version assessment is candidate-only until exact earlier local package
proof exists. Do not change Task837's fourteen-finding count.

Owner: mdkg-project-agent, one repository writer under the explicit Goal86 run. Allowed: this bounded generic source remedy, directly required helpers, regression/installed fixtures, release-critical truth corrections and sanitized mdkg evidence. Preserve authored history, selected Goal73, runtime DB, Demo3 bundles and unrelated custody. No canonical migration, bundle/subgraph refresh, remote Git, publication, provider/deployment, cross-project writes, global configuration or history rewrite. Stop for a materially new architecture/security decision; no documentation-only waiver.

# Reproduction Steps

Use owned disposable synthetic fixtures and exact installed bytes. Reproduce
before correction and retain all positive controls; never mutate canonical
Git metadata, runtime DB or protected graphs to exercise refusal.

# Expected vs Actual

Observational status/validate/index-health paths open SQLite without explicit readOnly. Static source review did not establish an exploit or concrete native mutation, so this is a release-blocking observational-contract/platform gap, not an additional confirmed security finding.

# Suspected Cause

src/core/project_db_migrations.ts:842-855 and src/graph/sqlite_index.ts:459 use writable-capable DatabaseSync connections during verification. Related snapshot readers must receive the same read-versus-write audit.

# Fix Plan

Current remedy: deserialize only a held-source Node image into memory, restrict
SQL writes/ATTACH/extensions and validate journal state plus source custody
before accepting results. Missing capabilities or insufficient image memory
refuse; there is no OS-path or temporary-copy fallback.

Historical baseline proposal, superseded after WAL-transition evidence:

Use explicit read-only opens for genuinely observational callers; retain intentional writer connections only under supported mutation commands. Admit contained ordinary files and relevant sidecar state before native opens. Fail honestly on unsupported/read-only recovery states without creating DBs, sidecars or directories. Do not claim immutable-mode shortcuts are safe for active databases.

Owned source and directly required regression scope:
- src/core/project_db_migrations.ts
- src/graph/sqlite_index.ts
- src/core/project_db_snapshot.ts
- src/commands/status.ts
- src/commands/validate.ts
- src/commands/mcp.ts

# Test Plan

- Inspect closed, WAL/SHM, hot-journal, missing, malformed and permission-enforced read-only fixtures with complete before/after inventories.
- Compare status, validate, index verify and snapshot read routes on macOS and Linux x86_64/ARM64; native versus emulated results explicit.
- Keep intentional migrations, runtime queue writers, index rebuilds and snapshot sealing functional with exact ownership; no global configuration.
- Bind failing-before and passing-after evidence to source/package hashes.
- Test488 and Task828 independently verify current remediation; final installed
  qualification and macOS/Linux acceptance remain separate from local closure.

# Links / Artifacts

- .mdkg/artifacts/goal-86/task-837-standard-security-audit.json
- g86-architecture-001 rejected as unproven security impact; native effects remain unqualified
- root:goal-86; root:goal-84; root:test-488; root:task-828; root:test-487

## Current State

2026-09-28 Chk655 records completed local remediation and Test489 installed
acceptance. Linux/final-platform, independent review, coverage/ladder/seal
remain downstream gates. Local bug closure is not release clearance; Task839
can now correct release-critical guidance. Older entries below preserve their
historical source/runtime limits and incomplete states.

2026-09-28 combined follow-up: after Task842 centralized capability checks and
early CLI runtime admission, the final affected selection passes343/343 with
zero failures/skips. The installed234-file candidate passes25 observer tests,
8 positive CLI workflows,4 actual Node26 no-effect refusals and the complete
loop smoke. Chk653/runtime-qualification.json bind this newer source state;
the earlier265-case receipt preserves its own previous helper hash. This is
still not Bug60 final independent/platform/installed-family closure.

2026-09-28 portable source milestone: all observational callers now query a
Node-owned in-memory SQLite image, with held-source custody checks and no
macOS/Linux descriptor path. Resource admission, SQL write/ATTACH refusal,
failure cleanup and ordinary writer controls are covered. The constructor-trap
regression failed before the change; the complete affected DB/index/snapshot/
allocation selection passes 265/265 on Node24.18.0/macOS arm64 with zero skips.
Node26.0.0 lacks deserialize and refuses before any source open. Build,
test compilation, CLI/command parity and diff checks pass. Exact nine-file
hashes and commands are in the portable-source-progress receipt.

This supersedes the descriptor implementation as current source, not its
historical evidence. Bug60 remains progress: runtime metadata Task842, portable
recovery Task841, installed Test489, Linux, independent review, full ladder and
artifact sealing remain incomplete. Available-memory checks are not a guarantee
against concurrent OOM; no fixed graph-size compatibility limit was invented.
Bugs46/47 remain separately deferred/unresolved, never accepted or fixed.

2026-09-25 committed-source runtime follow-up: the exact affected SQLite and
DB/index compiled suites passed 91/91 on both local Node24.15.0 and Node26.0.0
under macOS arm64, with no failures or skips. The source/test tree remains at
commit 6d23981e70bc68798def73c81b9cd5fa7bc9f3df with no dirty src/tests
paths; the linked JSON receipt binds source, test and compiled-test hashes,
durations and protected bookends. This extends the earlier Node24.18.0 91/91
evidence but is current-source testing, not a final installed artifact or Linux
result. Bug60 remains progress; Test488, Task828 and release gates are open.

2026-09-25 local source milestone: the ten Bug60 implementation and regression
paths were committed on main as
6d23981e70bc68798def73c81b9cd5fa7bc9f3df, after an exact staged-patch
match to a disposable clone containing only those paths on its parent commit.
Both canonical and isolated Node24.18/macOS arm64 affected suites passed
91/91. The isolated build, CLI/docs/CI checks and graph/index verification
passed; the disposable clone's initially missing generated caches were rebuilt
there only before its passing index check. The previous current-source full
suite passed 2224/2224 on unchanged Bug60 source bytes. No bundle, protected
state, graph evidence or unrelated source was staged. The earlier uncommitted
draft notes below remain historical; this source commit does not close the bug.
Linux descriptor behavior, Test488, independent Task828 review, final installed
candidate/platform qualification and the release ladder/seal remain open.
Goal86 is NOT_READY. The linked JSON receipt contains the exact path manifest.

2026-09-25 current-source integration rerun: after the test-only WAL expectation
correction, the full Node24.18.0/macOS arm64 suite passed 2224/2224 with zero
failures or skips (342556.576 ms) using approved local host process evidence.
Built CLI contract, documentation command examples and deterministic CI workflow
checks also pass. The restricted-sandbox failure and earlier 2223/2224 host run
remain recorded as failed intermediate attempts; neither is reclassified.
This is an unsealed dirty-source macOS result, not final-candidate, Linux,
Test488, independent security, full release-ladder or publication acceptance.
Bug60 remains in progress and Goal86 remains NOT_READY. Evidence: the linked
Bug60 local-resume JSON receipt.

2026-09-25 broad-suite integration check: the current-source Node24.18.0
macOS arm64 full test discovery, run with host process evidence available,
executed 2224 tests: 2223 passed and one failed in an older DB/index test.
The test expected `db verify` and `db stats` to succeed after it created an
empty `project.sqlite-wal`. That contradicted Bug60's already-tested
fail-closed observational contract. The existing SQLite observation suite
requires refusal for any transient sidecar. The DB/index test now preserves
its closed-DB positive controls and asserts explicit WAL refusal, warning and
unchanged runtime bytes. Its failing-before targeted case became 1/1 passing;
the complete DB/index test file passes 30/30. Bug60 implementation bytes did
not change. The full repository suite has not been rerun after this test-only
correction, so no full-pass claim is made.

The restricted-sandbox full run exited with OS ownership-evidence failures in
interrupted-writer tests. The exact 38-case family passed separately when
local host process evidence was available; this does not reclassify the
restricted run as passing. Current result and test hash are in the linked
JSON receipt and chk650. Linux, Test488, Task828, release ladder and final
candidate seal remain open; Bug60 and Goal86 are still NOT_READY.

2026-09-22 Node-only local remediation progress: a held read-only descriptor now
anchors each observational native SQLite open to its admitted file. The native
connection uses `/dev/fd/<fd>` on macOS or `/proc/self/fd/<fd>` on Linux, with
readOnly true; unsupported platforms refuse. Post-read admission compares the
canonical pathname, held device/inode, size and timestamps, so an atomic
replacement cannot return stale data. This does not resolve Bug47's broader
ancestor-directory race. The deterministic same-inode WAL-transition and
valid-database replacement regressions pass, with no observational sidecar
creation. Explicit snapshot sealing and queue writes retain their writer paths.

Build and test compilation pass. The complete focused observational source
suite is 61/61 passing on Node24.18.0/macOS arm64; the same 61/61 pass using
one isolated installed intermediate 0.6.0 tarball on each of Node24.15.0,
24.18.0 and26.0.0. Four selected race/writer controls additionally pass on
each of Node24.15.0 and26.0.0 against source bytes.
An independent read-only source review identified the pathname replacement gap,
confirmed the added check, and found no further concrete canonical-write path
in the directly reviewed observational callers. It was not security clearance.
Exact source and tarball hashes and the failed-before interleaving are retained
in .mdkg/artifacts/goal-86/bug-60-local-resume-evidence.json. This is local
subsystem evidence, not final-artifact, Linux, Test488, Task828, full-ladder or
publication acceptance. Keep Bug60 in progress and Goal86 NOT_READY.

2026-09-22 local Node.js continuation: corrected queue CLI arguments and cleanup
ordering, strengthened WAL receipt assertions, and added materializer plus actual
work-trigger WAL positive controls. The focused suite is 59/60 passing on Node
24.18.0/macOS arm64 in61.6s; the remaining test is a newly reproduced contract
failure, not a harness failure. One independent current-source review exposed
the same-inode journal-mode transition between admission and the native open.
After the scheduled writer closes, readOnly observation creates a32768-byte SHM
file and empty WAL file. This is distinct from an ancestor-directory swap.

Keep this bug unresolved and the draft source uncommitted. A Node-only design
must isolate observation from journal transitions or safely refuse without
side effects; more pathname checks or an immutable live-DB shortcut are not
accepted remedies. No native/hosted work or weaker concurrency guarantee is
authorized by Dec97. The failing regression is retained in
tests/core/sqlite_observation.test.ts; sanitized evidence is
.mdkg/artifacts/goal-86/bug-60-local-resume-evidence.json. Full/installed/final
platform qualification is deferred until the behavioral gap is resolved.
Continue independent Task838; do not increase the retained security-finding count.

2026-09-21 paused at Nick's request with an owned, uncommitted draft remedy.
Fresh native synthetic probes demonstrate WAL/SHM effects even with readOnly.
Build and test compilation pass; expanded regression run53/55 passing. Two new
CLI harness cases omit the required queue argument; later controls in those
cases remain unexecuted. No post-pause fixes or reruns. Full/installed/Linux and
candidate review remain incomplete. Chk637 records exact custody, log hashes,
release readiness and resumption decisions. No final qualification claimed.
