---
id: dec-14
type: dec
title: 0.0.4 release line and repo boundary normalization
status: accepted
tags: [release, 0_0_4, repo-boundary, docs]
owners: []
links: []
artifacts: [package.json, README.md, CLI_COMMAND_MATRIX.md, .mdkg/design/prd-2-mdkg-dev-external-docs-handoff-note.md]
relates: [prd-1, prd-2, epic-4, epic-6, epic-10, epic-12]
refs: []
aliases: [release-line-normalization, repo-boundary]
created: 2026-03-08
updated: 2026-03-08
---

# Context

The repo had drifted into mixed prepublish version language even though the actual published baseline is `0.0.3` and the next release target is `0.0.4`. The repo also accumulated mdkg.dev planning that belongs in a separate website/docs repository rather than the CLI repo graph.

# Decision

- Treat current command-surface, JSON discovery, skill namespace, task lifecycle, and event logging polish as `0.0.4` work.
- Keep versioning aligned to the real release line: `0.0.3` before the cut, then `0.0.4` for the prepared release tree.
- Externalize mdkg.dev website planning from this repo and keep only local onboarding/help artifacts here.
- Keep root docs, help, and command matrix backward-compatible across CLI evolution.

# Alternatives considered

- Keep mixed version shorthand until publish: rejected because it obscures the actual release line.
- Keep mdkg.dev planning active in this repo: rejected because it muddies CLI scope and prioritization.

# Consequences

- Active local work is easier to reason about against the real release line.
- The CLI repo graph stops carrying unrelated website backlog as if it were a CLI blocker.
- Future release cuts should update version labels deliberately instead of allowing roadmap shorthand to accumulate.

# Links / references

- `prd-2`
- `epic-4`
- `epic-6`
