---
id: test-235
type: test
title: pass 2 archive provenance and source evidence contract
status: done
priority: 1
tags: [mdkg-dev, archive]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-500]
blocks: [task-505]
refs: [archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24]
context_refs: []
evidence_refs: []
aliases: []
skills: []
cases: [archive-verify, readable-folder-committed, source-links-present]
created: 2026-06-23
updated: 2026-06-23
---
# Overview

Validate that pass-2 feedback provenance is durable.

# Target / Scope

- Archive sidecar and compressed cache.
- Readable `mdkg_preview_polish_pass2/` folder.
- Links from Goal 31, Goal 32, and design nodes.

# Preconditions / Environment

- Archive has been added.

# Test Cases

- `node dist/cli.js archive verify archive://archive.mdkg-dev-preview-polish-pass-2-2026-06-24 --json` succeeds.
- `mdkg_preview_polish_pass2/` remains present.
- New design/work nodes reference the archive URI.

# Results / Evidence

- Pending.
