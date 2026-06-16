---
id: task-365
type: task
title: harden spike template init and upgrade compatibility
status: done
priority: 1
epic: epic-84
parent: goal-14
tags: [spike, templates, init, upgrade]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-348]
blocks: [test-153]
refs: [test-153]
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-15
---
# Overview

Harden spike template delivery across fresh init, bundled init assets, and
upgrade paths so new and existing repos can adopt `spike` safely.

# Acceptance Criteria

- Source default templates include a validation-clean `spike` template with the
  agreed research sections.
- `mdkg init --agent` installs spike-aware templates/docs in fresh repos.
- `mdkg upgrade --dry-run --json` reports missing spike assets without mutating.
- `mdkg upgrade --apply --json` adds missing managed spike assets without
  silently overwriting local customized templates.
- Fresh-init and upgrade smokes cover the spike template path.

# Files Affected

- Template source and init assets.
- Upgrade/init smoke tests.

# Implementation Notes

- Follow existing managed-template upgrade policy.
- Keep citations/sources in Markdown body sections for this release.
- Avoid adding autonomous web-search or skill-generation behavior.

# Test Plan

- `npm run smoke:init`
- `npm run smoke:upgrade`
- `npm run smoke:spike`
- `node dist/cli.js validate --json`

# Results / Evidence

- `scripts/smoke-init.js` now asserts `.mdkg/templates/default/spike.md` exists
  after base init, optional SPEC/WORK template init, and agent init.
- Fresh-init smoke checks the spike template contains the required research
  sections and is listed in `.mdkg/init-manifest.json`.
- `scripts/smoke-upgrade.js` now removes `spike.md` from an older template
  workspace, verifies `mdkg upgrade --dry-run --json` plans the missing spike
  template, applies the upgrade, and verifies the restored template contents.
- Upgrade smoke also creates a customized `spike.md`, runs
  `mdkg upgrade --apply --json`, and verifies the customized template is
  reported as preserved and not overwritten.
- `npm run smoke:init`; passed.
- `npm run smoke:upgrade`; passed.
- `npm run smoke:spike`; passed earlier in this task sequence from a packed
  installed tarball.
- `node dist/cli.js validate --json`; passed before closeout with zero
  warnings/errors.

# Links / Artifacts

- `task-348`
- `test-153`
- `scripts/smoke-init.js`
- `scripts/smoke-upgrade.js`
