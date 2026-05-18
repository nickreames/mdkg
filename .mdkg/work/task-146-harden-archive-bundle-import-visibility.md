---
id: task-146
type: task
title: harden archive bundle import visibility
status: done
priority: 1
epic: epic-27
tags: [visibility, archive, bundle, import]
owners: []
links: []
artifacts: [src/commands/archive.ts, src/commands/bundle.ts, src/commands/bundle_import.ts, npm run smoke:visibility]
relates: [task-144, task-145]
blocked_by: []
blocks: [test-84]
refs: []
aliases: [archive-bundle-import-visibility]
skills: []
created: 2026-05-18
updated: 2026-05-18
---
# Overview

Make archive, bundle, and bundle-import visibility use the shared policy.

# Acceptance Criteria

- `mdkg archive add --visibility private|internal|public` defaults to
  `private`.
- `mdkg archive list --visibility ...` filters archive sidecars.
- Archive JSON receipts include visibility.
- Public bundles reuse shared fail-closed visibility checks.
- Public/internal bundle imports cannot be configured over private bundle
  profiles.

# Files Affected

- `src/commands/archive.ts`
- `src/commands/bundle.ts`
- `src/commands/bundle_import.ts`
- `src/core/config.ts`
- `src/cli.ts`

# Implementation Notes

Public bundle creation must fail before writing when public records reference
private archives, private workspace records, or private/internal imports.

# Results

Added archive add/list visibility flags and visibility in archive JSON
receipts. Public bundle creation now reuses the shared visibility reference
audit and considers imported graph projections without re-exporting imported
content. Bundle import config rejects public or internal visibility over private
bundle profiles.

# Test Plan

- Unit and CLI tests cover archive visibility flags, public bundle errors, and
  rejected public imports backed by private profiles.

# Verification

- `npm run test`
- `npm run smoke:bundle`
- `npm run smoke:bundle-import`
- `npm run smoke:visibility`
- `npm publish --dry-run`

# Links / Artifacts

- `mdkg archive add --visibility public`
- `mdkg bundle create --profile public`
- `mdkg bundle import add --visibility public --profile public`
