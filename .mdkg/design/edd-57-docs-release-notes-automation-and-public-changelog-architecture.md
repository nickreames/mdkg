---
id: edd-57
type: edd
title: docs release notes automation and public changelog architecture
tags: [0.4.0, docs, release-notes, changelog, automation]
owners: []
links: []
artifacts: [CHANGELOG.md, CLI_COMMAND_MATRIX.md, docs, mdkg-dev, scripts]
relates: []
refs: [edd-56]
aliases: []
created: 2026-06-26
updated: 2026-06-26
---
# Overview

Define how mdkg keeps CLI docs, first-party skills, release notes, and public
changelog surfaces current as command capabilities expand.

# Architecture

- `CHANGELOG.md` remains the release source of truth.
- Generated command references and docs command checkers protect CLI examples.
- First-party skills are maintained as operational docs for repeatable agent
  workflows.
- The public release-notes surface consumes or reconciles with changelog entries
  instead of hand-copying disconnected release copy.

# Data model

- Release entry: version, date, highlights, compatibility notes, and detailed
  changes from `CHANGELOG.md`.
- Command capability inventory: generated from current CLI help/contract output.
- Skill coverage matrix: first-party skills mapped to current command families
  and workflows.

# APIs / interfaces

- Existing docs and release scripts should fail when public command examples or
  generated references drift from the CLI.
- New or expanded automation may add repo-local checks, but public behavior is
  governed by `goal-41` and `goal-42` implementation tasks.
- Release notes may live in docs.mdkg.dev or mdkg.dev, but must expose
  per-release cards and details.

# Failure modes

- CLI command added without docs/skill coverage: docs automation should fail.
- Release note exists only under `Unreleased` for a publish-bound version:
  publish-readiness checks should flag it.
- Public release page diverges from `CHANGELOG.md`: generated or checked content
  should fail until reconciled.

# Observability

- Docs check output should identify stale command examples, missing release
  entries, and uncovered command families.
- Release closeout checkpoints should record generated docs/changelog status.

# Security / privacy

- Public release notes and docs must not expose secrets, private prompts, raw
  execution traces, or unpublished package claims.
- Automation should prefer summarized evidence and durable refs.

# Testing strategy

- Command example validation against current CLI.
- Skill coverage audit for first-party `SKILL.md` files.
- Changelog-to-release-notes drift test.
- Browser/docs smoke once the public surface exists.

# Rollout plan

Use `goal-41` for CLI/docs automation foundations, then `goal-42` for public
release notes and launch-page implementation.
