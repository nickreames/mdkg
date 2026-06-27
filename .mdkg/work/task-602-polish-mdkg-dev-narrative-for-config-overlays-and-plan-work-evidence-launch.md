---
id: task-602
type: task
title: polish mdkg.dev narrative for config overlays and plan work evidence launch
status: done
priority: 2
epic: epic-203
parent: goal-42
tags: [0.4.0, mdkg-dev, narrative, launch]
owners: []
links: []
artifacts: [mdkg-dev, mdkg-dev/src/pages/index.astro, CHANGELOG.md]
relates: []
blocked_by: [spike-22]
blocks: [task-605, task-606]
refs: [spike-22]
context_refs: []
evidence_refs: [chk-295, chk-301, chk-302, chk-303]
aliases: []
skills: [build-pack-and-execute-task]
created: 2026-06-26
updated: 2026-06-27
---
# Overview

Polish mdkg.dev copy and structure so the public launch narrative reflects the
new customization model and the established Plan -> Work -> Evidence framing.

# Acceptance Criteria

- mdkg.dev presents config overlays as the primary enterprise customization
  path.
- Forkable starters are not positioned as the default path.
- Copy covers custom skill mirrors, upgradable kernel behavior, and
  collaboration-profile naming only after `goal-41` facts are stable.
- Structured version metadata in `mdkg-dev/src/pages/index.astro` is no longer
  hardcoded to stale `0.3.7` facts and reflects the current public package
  version strategy.
- The public narrative covers 0.3.9 capabilities with source-backed examples
  and avoids implying that 0.4.0 is already published.
- Claims stay source-backed and low-hype.

# Files Affected

- `mdkg-dev/`
- changelog/release note inputs as needed

# Implementation Notes

- Do not change docs.mdkg.dev content in this task except shared source data.
- Avoid marketing copy that outruns implementation proof.
- Confirm deployed mdkg.dev structured data during `task-605` after deploy or
  approved preview promotion.

# Test Plan

- `npm --prefix mdkg-dev run build`
- `npm run smoke:mdkg-dev`
- Browser local desktop/mobile review in `task-605`
- Chrome live mdkg.dev structured-metadata verification in `task-605`

# Links / Artifacts

- `goal-41`
- `dec-51`
- `dec-52`
