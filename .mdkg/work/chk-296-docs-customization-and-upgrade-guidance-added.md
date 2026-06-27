---
id: chk-296
type: checkpoint
title: docs customization and upgrade guidance added
checkpoint_kind: implementation
status: backlog
priority: 9
tags: []
owners: []
links: []
artifacts: []
relates: [task-603]
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: []
scope: [task-603]
created: 2026-06-27
updated: 2026-06-27
---
# Summary

Docs onboarding and repository-layout guidance now describe the 0.3.9
customization model: `.mdkg/config.json` overlays, arbitrary contained skill
mirror paths, `COLLABORATION.md` with legacy `HUMAN.md`, MANIFEST/SPEC
compatibility, and `mdkg upgrade --apply` behavior.

# Scope Covered

Scope is `task-603`: polish docs.mdkg.dev onboarding, command references, and
upgrade guidance around current CLI behavior.

## Changed Surfaces

- `docs/` onboarding and repository-layout content.
- docs smoke expectations.

## Boundaries

- in scope: source docs and local docs smoke coverage.
- out of scope: production deploy, DNS, analytics, npm publish, git tag, and
  final `0.4.0` release approval.
- raw secrets, raw prompts, raw payloads, and bulky execution traces excluded.

# Decisions Captured

- Org customization is documented as config-overlay driven after init plus
  upgrade application.
- Arbitrary skill mirrors are documented as contained paths while
  `.agents/skills` and `.claude/skills` remain defaults.
- `COLLABORATION.md` is the canonical operator/collaboration doc with
  one-release `HUMAN.md` bridge context.

# Implementation Summary

Docs now give task-oriented upgrade and customization guidance for the 0.3.9
CLI facts that goal-42 depends on. The release narrative stays in release
notes; guides focus on how to apply the capabilities.

# Implementation Details

- Code or graph surfaces changed: docs source and smoke assertions.
- Architecture or data-shape notes: source docs explain overlays and mirrors as
  upgradable kernel configuration rather than forks.
- Compatibility notes: MANIFEST/SPEC and COLLABORATION/HUMAN bridges are
  documented as transitional compatibility behavior.

# Verification / Testing

## Command Evidence

- command: `npm run smoke:mdkg-dev-docs`
- result: passed.

## Pass / Fail Status

- status: pass for local docs guidance coverage.

## Known Warnings

- warning: live `docs.mdkg.dev` requires approved push/deploy verification
  before launch-ready can be claimed.

# Known Issues / Follow-ups

- verify live docs after approved deploy.
- keep generated command references aligned through `docs:check`.

## Follow-up Refs

- `task-605`
- `test-308`
- `goal-42`

# Links / Artifacts

- `docs/`
- `CLI_COMMAND_MATRIX.md`
- `README.md`

# Raw Content Safety

- Summarized command receipts only; no raw secrets, raw prompts, raw payloads,
  or bulky logs are stored here.
