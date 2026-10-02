---
id: test-491
type: test
title: Verify current audit remedies and installed boundary controls
status: done
priority: 1
tags: [release-0.6.0, current-security]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/current-security-audit-20260929.json, .mdkg/artifacts/goal-86/successor-installed-case-acceptance-20260930.json, .mdkg/artifacts/goal-86/successor-installed-platform-qualification-20260930.json, .mdkg/artifacts/goal-86/successor-security-acceptance-20260930.json]
relates: []
blocked_by: [bug-62, bug-63, bug-64, bug-65, bug-66, bug-67, bug-68]
blocks: []
refs: [goal-86, goal-84, task-828, bug-62, bug-63, bug-64, bug-65, bug-66, bug-67, bug-68, bug-69]
context_refs: []
evidence_refs: []
aliases: []
skills: [verify-close-and-checkpoint]
cases: []
created: 2026-09-29
updated: 2026-09-30
---
# Overview

Goal: qualify Bugs62-68's bounded current-security remedies without erasing earlier evidence or expanding the release scope. Owner: mdkg-project-agent; Goal86 is the only execution lane.

# Target / Scope

Seven current confirmed finding groups: archive payload visibility; generated Git-administration destinations; shared-inode event appends; exact frontmatter framing; diagnostic containment; whole-ID repair; workspace-bound evidence.

# Preconditions / Environment

Source remedies locally validated and independently reviewed; successor 0.6.0 tarball admitted by exact hash and package-input capture. Owned synthetic fixtures, Node >=24.18.0 <25, macOS and authorized local Ubuntu24 ARM64/x64 with native/emulated distinction. No canonical migration, branch/worktree change, remote Git, provider, publication or bundle refresh. Preserve selected Goal73/runtime DB/Demo3 and all unrelated custody.

# Test Cases

- Shared public/private directories in both orderings; nested archives; unknown adjacent files; conflicting resource claims; public ZIP/manifest sentinel absence and ordinary public/private positive controls.
- Ordinary/separate Git dirs, linked worktrees, redirected index/object/hook stores, direct and aggregate cache writers, identity preview/apply/recovery, sync dry-run/apply; assert no earlier output or native staging changes on refusal.
- In-root and outside-root hard-link peers; direct and automatic events; unchanged bytes on refusal; ordinary single-link append and existing rollback controls.
- Whitespace delimiters, LF/CRLF, title a---b, later body horizontal rules, empty/missing boundaries, unchanged previews, idempotence, identity migration/reconciliation/fork/import and format controls.
- Leaf/ancestor/root links, dangling links, direct special files, oversized text/cache, depth/entry limits, no external-byte disclosure or cache persistence, and normal diagnostics. Use bounded synthetic sentinels only; never execute an unbounded device read.
- Duplicate task-1 beside task-10/task-100, qualified foreign references, punctuation-delimited self notes, filenames and incidental substrings; preview/application count agreement, untouched canonical nodes and Git index.
- Identical aliases in two workspaces; no accidental association; explicit qualified links, same-workspace legacy and v2 positives; agreement with receipt verification; cold/warm/stale JSON and SQLite views.

# Results / Evidence

Not executed for fixes yet. Chk667 and current-security-audit-20260929.json bind the failing candidate and frozen source. Earlier platform passes are intermediate evidence; they do not qualify changed package inputs. Record selected command, source/tarball hashes, runtime/platform, duration, failure/pass counts and cleanup. Test-only harness changes need affected harness proof; package changes need successor candidate admission.

# Notes / Follow-ups

Done when all owned regression and installed controls pass on the final bytes, independent review is linked and protected bookends match. Keep Task828 complete-range independent diff, Task829 full37-smoke/coverage ladder and Task830 exact seal separate. Bugs46/47 remain deferred/unresolved, not accepted. No new features, native helper or skill authoring. Skill candidates: none.
