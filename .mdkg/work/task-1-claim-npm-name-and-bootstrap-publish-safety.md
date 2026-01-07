---
id: task-1
type: task
title: claim npm name and bootstrap publish safety
status: done
priority: 0
epic: epic-1
tags: [npm, publish, safety]
links: [npm:mdkg]
artifacts: [publish-whitelist, tarball-verified, bin-wired]
relates: [rule-4, rule-5]
blocked_by: []
blocks: []
refs: []
aliases: []
created: 2026-01-06
updated: 2026-01-06
---

# Overview

Ensure the npm package name `mdkg` is claimed and publishing is configured so only safe artifacts are shipped (no `.mdkg/` content).

# Acceptance Criteria

- npm account is configured and able to publish packages
- `package.json` uses "files" whitelist to publish only `dist/`, `README.md`, `LICENSE`
- optional `.npmignore` added as a belt-and-suspenders safety measure
- `npm pack` output does not include `.mdkg/` or any index files
- `mdkg` binary is installable and runs (`mdkg --help`)

# Files Affected

- package.json
- README.md
- LICENSE
- .npmignore (optional)
- .gitignore

# Implementation Notes

- Prefer "files" whitelist over ignore blacklists.
- Ensure `bin` points to `dist/cli.js` (compiled JS) and file has a node shebang.
- Confirm `engines.node >=18`.

# Test Plan

- run `npm pack` and inspect tarball contents
- install locally from tarball to verify bin works

# Links / Artifacts

- rule-4 (repo safety)
- rule-5 (release and versioning)
