---
id: chk-124
type: checkpoint
title: mdkg dev generated command docs gate passed
status: backlog
priority: 9
tags: [mdkg-dev, docs, cli-spec, test, 0-3-9]
owners: []
links: []
artifacts: [scripts/smoke-command-docs.js, dist/command-contract.json]
relates: [test-131]
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
scope: [test-131]
created: 2026-06-09
updated: 2026-06-09
---
# Summary

The mdkg.dev generated command docs gate contract passed. Generated command docs
now exist as a package-proven smoke artifact derived from the mdkg-native
command contract, not from hand-maintained command tables.

# Scope Covered

- `test-131`
- `task-346`
- `epic-73`

# Decisions Captured

- `edd-22`
- mdkg.dev launch planning is now allowed to proceed, but public website
  implementation remains a separate later slice.

# Implementation Summary

- The docs-readiness smoke consumes the packaged command contract.
- The generated reference embeds `contract_hash` and a
  `generated-from: dist/command-contract.json` marker.
- Public-only command records are rendered; hidden/internal records would be
  excluded by visibility filtering.
- Representative generated examples run in a temp repo with only the installed
  packed CLI.

# Verification / Testing

- `npm run smoke:command-docs` passed.
- `npm run prepublishOnly` passed end to end.
- The prepublish run included `npm run test` with 454/454 passing tests,
  `cli:check`, `cli:contract`, graph validation, all existing smokes, the new
  command-docs smoke, and final `node scripts/assert-publish-ready.js`.

# Known Issues / Follow-ups

- `task-330` should plan mdkg.dev information architecture and launch gates
  against this generated command-reference foundation.

# Links / Artifacts

- `scripts/smoke-command-docs.js`
- `dist/command-contract.json`
