---
id: task-365
type: task
title: harden spike template init and upgrade compatibility
status: todo
priority: 1
epic: epic-84
parent: goal-14
tags: [spike, templates, init, upgrade]
owners: []
links: []
artifacts: []
relates: []
blocked_by: [task-348]
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-11
updated: 2026-06-11
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

# Links / Artifacts

- `task-348`
- `test-153`
