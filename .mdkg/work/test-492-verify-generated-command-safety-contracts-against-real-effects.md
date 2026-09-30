---
id: test-492
type: test
title: Verify generated command safety contracts against real effects
status: done
priority: 1
tags: [release-0.6.0, current-security]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/current-security-audit-20260929.json, .mdkg/artifacts/goal-86/successor-installed-case-acceptance-20260930.json, .mdkg/artifacts/goal-86/successor-installed-platform-qualification-20260930.json, .mdkg/artifacts/goal-86/successor-security-acceptance-20260930.json]
relates: []
blocked_by: [bug-69]
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

Goal: qualify Bug69's generated command effect contract without erasing earlier evidence or expanding the release scope. Owner: mdkg-project-agent; Goal86 is the only execution lane.

# Target / Scope

Inventory every actual CLI handler's write behavior and compare generated safety mode, write paths and discovery projections; cover pack, work order, doctor and validate as known failing examples.

# Preconditions / Environment

Source remedies locally validated and independently reviewed; successor 0.6.0 tarball admitted by exact hash and package-input capture. Owned synthetic fixtures, Node >=24.18.0 <25, macOS and authorized local Ubuntu24 ARM64/x64 with native/emulated distinction. No canonical migration, branch/worktree change, remote Git, provider, publication or bundle refresh. Preserve selected Goal73/runtime DB/Demo3 and all unrelated custody.

# Test Cases

- Source/help/contract/docs/MCP/seeds/package inventories agree.
- Mixed commands expose conditional mutation rather than read-only fallback.
- Bounded default/flagged filesystem inventories prove declared write resources.
- Retained observations and invalid command/flag refusal preserve files and Git staging.
- Omitted safety declarations fail the generator contract check instead of silently becoming read-only.

# Results / Evidence

Not executed for fixes yet. Chk667 and current-security-audit-20260929.json bind the failing candidate and frozen source. Earlier platform passes are intermediate evidence; they do not qualify changed package inputs. Record selected command, source/tarball hashes, runtime/platform, duration, failure/pass counts and cleanup. Test-only harness changes need affected harness proof; package changes need successor candidate admission.

# Notes / Follow-ups

Done when all owned regression and installed controls pass on the final bytes, independent review is linked and protected bookends match. Keep Task828 complete-range independent diff, Task829 full37-smoke/coverage ladder and Task830 exact seal separate. Bugs46/47 remain deferred/unresolved, not accepted. No new features, native helper or skill authoring. Skill candidates: none.
