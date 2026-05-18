---
id: task-145
type: task
title: add pack visibility filtering
status: done
priority: 1
epic: epic-27
tags: [visibility, pack, privacy]
owners: []
links: []
artifacts: [src/commands/pack.ts, tests/commands/pack.test.ts, npm run smoke:visibility]
relates: [task-144]
blocked_by: []
blocks: [test-84]
refs: []
aliases: [pack-visibility-filtering]
skills: []
created: 2026-05-18
updated: 2026-05-18
---
# Overview

Add explicit `mdkg pack --visibility public|internal|private` filtering for
public-safe and internal-safe handoff packs.

# Acceptance Criteria

- No flag preserves existing private-capable pack behavior.
- `--visibility public` includes only public records and fails when included
  records reference internal or private graph/archive/import records.
- `--visibility internal` includes public and internal records and fails when
  included records reference private records.
- Pack metadata records the requested visibility filter.

# Files Affected

- `src/commands/pack.ts`
- `src/pack/types.ts`
- `src/pack/export_md.ts`
- `src/pack/export_xml.ts`
- `src/cli.ts`

# Implementation Notes

The filter operates on mdkg record inclusion and frontmatter refs. It does not
inspect or redact arbitrary Markdown body text.

# Results

Added `mdkg pack --visibility public|internal|private`. Omitting the flag keeps
the existing private-capable behavior. Explicit public/internal packs filter
included records and fail closed when retained records reference less-visible
graph, archive, or imported records. Pack metadata now records the supplied
visibility filter in JSON, Markdown, and XML outputs.

# Test Plan

- CLI tests cover successful public packs, hidden private records, and
  fail-closed private archive/import references.

# Verification

- `npm run test`
- `npm run smoke:visibility`
- `npm publish --dry-run`

# Links / Artifacts

- `mdkg pack --visibility public`
