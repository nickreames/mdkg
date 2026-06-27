---
id: task-603
type: task
title: polish docs.mdkg.dev onboarding command references and upgrade guides
status: done
priority: 2
epic: epic-203
parent: goal-42
tags: [0.4.0, docs, onboarding, upgrade, commands]
owners: []
links: []
artifacts: [docs, CLI_COMMAND_MATRIX.md, README.md]
relates: []
blocked_by: [spike-22]
blocks: [task-605, task-606]
refs: [spike-22]
context_refs: []
evidence_refs: [chk-296, chk-301, chk-302, chk-303]
aliases: []
skills: [build-pack-and-execute-task]
created: 2026-06-26
updated: 2026-06-27
---
# Overview

Polish docs.mdkg.dev onboarding, command references, and upgrade guides around
the current CLI and the `0.3.9` customization model.

# Acceptance Criteria

- Docs explain config overlays after init and `mdkg upgrade --apply`.
- Docs explain arbitrary skill mirror paths while preserving canonical
  `.mdkg/skills/`.
- Docs cover `COLLABORATION.md` as canonical with `HUMAN.md` as a legacy alias.
- Docs explain 0.3.9 MANIFEST/SPEC and COLLABORATION/HUMAN compatibility
  bridges in task-oriented upgrade language.
- The source docs and live `docs.mdkg.dev/project/changelog/` expose 0.3.9
  capabilities with more than a one-line mention before launch-ready
  recommendation.
- Command examples pass the docs command checker.

# Files Affected

- `docs/`
- `CLI_COMMAND_MATRIX.md`
- `README.md` if public onboarding references need alignment

# Implementation Notes

- Keep command reference generated where possible.
- Put release narrative in release notes; keep guides task-oriented.

# Test Plan

- `npm --prefix docs run build`
- `npm run docs:check`
- `npm run smoke:mdkg-dev-docs`
- Browser local desktop/mobile docs verification and Chrome live docs
  verification in `task-605`
- `test-308`

# Links / Artifacts

- `goal-41`
- `edd-57`
