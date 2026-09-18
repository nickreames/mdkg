---
id: bug-42
type: bug
title: Prevent copied legacy JSON caches from overriding current authored metadata
status: done
priority: 1
tags: [release-0.6.0, cache-consistency]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/observational-boundary-verification.json, .mdkg/artifacts/goal-86/bug-42-local-verification.json]
relates: [bug-7, test-480]
blocked_by: [bug-41]
blocks: []
refs: [dec-96]
context_refs: [goal-86, goal-84]
evidence_refs: []
aliases: []
skills: []
created: 2026-09-15
updated: 2026-09-15
---
# Overview

Local verification on2026-09-15 is recorded in
.mdkg/artifacts/goal-86/bug-42-local-verification.json. The original reproduction
below is retained as intake evidence. Final test480/487 and task828 acceptance
remain separate; local closure is not a final-artifact or security clearance.

Goal: keep current authored metadata authoritative when legacy JSON caches are
copied or their timestamps do not preserve source-edit order. Owner is
mdkg-project-agent under the bounded Goal86 run. This is a functional publication
blocker discovered in installed read-only qualification, not a new Standard scan
finding or a reopening of achieved Bug5's clock-independent SQLite fingerprints.

The installed intermediate candidate returns an old task title from global.json
alongside the latest Markdown body after an ordinary filesystem copy. Search
also returns old metadata. It reproduces with JSON and SQLite configured backends
on Node24.15.0,24.18.0 and26.0.0. V2 and fresh/absent-cache controls pass the
corresponding semantic checks. The mounted filesystem refuses writes with EROFS,
and all inventories stay unchanged; this is a semantic freshness failure.

# Reproduction Steps

1. In a disposable legacy graph, index a task with an old title, then restore its
   latest authored title without rebuilding the cache.
2. Copy the graph, including cache, using ordinary filesystem copy semantics.
   Confirm the cache mtime is newer than the copied Markdown even though the
   cache content is older; isIndexStale currently returns false.
3. Run installed show and search. Show combines the old cached title with the
   current source body; search does not expose the latest authored title.
4. Repeat on an actual read-only APFS image, both configured backends and all
   three required runtimes. Do not repair the timestamps to make this case pass.

# Expected vs Actual

- Expected: ordinary inspection derives current authored metadata or fails with
  an explicit freshness/ambiguity diagnostic; derived caches are not identity or
  semantic authority. Reads preserve all checkout bytes and Git staging.
- Actual: mtime-only admission labels copied stale JSON metadata fresh. The
  broader mounted matrix records four semantic failures per runtime (two show
  and two search), while Git index and preview-write custody checks pass.

# Suspected Cause

src/graph/staleness.ts compares only config/document mtimes with global.json.
src/graph/index_cache.ts trusts a cache when that test returns false; legacy show
reads metadata from that cache and the body separately from current Markdown.
The v2 path already derives current working-tree nodes. Deletion, equal timestamps,
path aliases and other JSON projections require bounded sibling-case assessment.

# Fix Plan

Before editing, reproduce the minimal copied-cache case and inspect all callers,
published0.5.2 behavior and existing no-cache/no-reindex/auto_reindex contracts.
Extend the existing read/validation boundary so cache admission cannot establish
false authored freshness. Prefer existing source-bound fingerprint or in-memory
derivation mechanisms; do not invent identities, silently write during reads,
drop source fields, suppress warnings or require canonical migration.

Allowed: src/graph/staleness.ts, index/cache readers and directly required source
fingerprint/inspection helpers, regression/installed fixtures, and mdkg evidence.
Keep cache-bypass controls, legacy/v2 compatibility, explicit index regeneration,
resource bounds and Git staging intact. Large transaction redesign is out of
scope. A new performance/compatibility decision stops implementation for alignment.
Run after Bug41 and before finalized release inputs; final task828/test480/487
must independently verify the result. No remote, publication, provider, consumer,
canonical bundle/migration/branch/worktree or history action is authorized.

# Test Plan

Failing-before/passing-after copied, equal-mtime, older-mtime and deleted-source
cases; positive fresh-cache, absent-cache, explicit no-cache and no-reindex
controls; legacy/v2 and JSON/SQLite parity. Check authored fields, references,
body/metadata consistency and current goal routing, not merely command exit.
Repeat installed show/search/list/pack/MCP and exact inventory/index bookends on
macOS/Linux and required runtimes. Reuse the owned actual-read-only fixture;
four failures per runtime remain open until the final artifact passes.

Affected candidate: source HEAD38205296208c23fcfcc6fc821a295040be05c0bb plus
accepted dirty source; intermediate tarball SHA256
112a1313af33aa20fbcdb12e08a1918216a1f4e087e39ce4523a22bae5381db8.
Published0.5.2 affectedness was unestablished at intake; the subsequent retained
installed executable reproduces the same stale title/current body and missed
search result with unchanged files.

## Local Verification - 2026-09-15

Source-bound fingerprints now cover exact Markdown inventory/content, effective
configuration/templates, skill directory metadata and archive integrity admission.
Ordinary reads derive stale/unbound caches in memory without writing. Explicit
no-cache/no-reindex behavior, malformed-cache errors, v2 bypass and both configured
backends remain intact. Skill parsing and capability hashes use one captured read.
Explicit archive compression selects current sidecars independently of stale
caches, while retaining schema/identity/owner/full-set write preflight.

One independent bounded review found two candidate issues; both were reproduced
and fixed. Additional strict opt-out and archive-compression regressions are fixed.
All143 focused and1,515 complete source tests pass. One unchanged226-file
intermediate tarball passes242 CLI-only installed cases plus84 actual read-only
APFS checks on each Node24.15.0/24.18.0/26.0.0. The original12 mounted metadata
failures are resolved locally; image bytes/inventories/staging are preserved.
CLI/docs/contract/workflow checks pass. Failed attempts and invalidated packages
remain documented, including an accidentally overlapping build/test run which
was replaced by a clean serialized full run. No incomplete run counts as pass.

The package remains version0.5.2; this is not the final0.6.0 artifact. Linux,
fresh Standard, complete independent diff, release ladder/coverage and seal remain
open. Small synthetic timings show added content-admission I/O, not an optimization
or a new compatibility limit. Larger transaction redesign stays post0.6.0 unless
required qualification fails. Fifteen owned disposable fixture roots were removed;
diagnostics, runners and package bytes remain, and the read-only image is detached.

Main HEAD38205296208c23fcfcc6fc821a295040be05c0bb and protected selected Goal73,
runtime DB, Demo3 bundle and Git index hashes remain unchanged. No staging,
commit, remote, publication, provider, canonical migration or bundle refresh.

# Links / Artifacts

- .mdkg/artifacts/goal-86/observational-boundary-verification.json
- .mdkg/artifacts/goal-86/bug-42-local-verification.json
- Existing bugs5/21 and task767 were checked for overlapping coverage; preserve
  their completed historical evidence. Bug7 owns aggregate qualification.
- Skill coverage: source-grounded-diagnose-and-fix; goal/checkpoint skills.
  New skill candidates: none. This is enforced implementation, not a procedure.
