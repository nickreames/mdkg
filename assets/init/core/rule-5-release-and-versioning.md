---
id: rule-5
type: rule
title: Compatibility and release boundaries
tags: [mdkg, guidance]
owners: []
links: []
artifacts: []
relates: []
refs: []
aliases: []
created: 2026-09-09
updated: 2026-09-09
---

# Purpose

Keep local qualification, compatibility and publication as distinct decisions.

# Scope

Projects choose their release policy. This seed does not authorize releasing
mdkg or the consuming project.

# Requirements

- Read the installed version and current format compatibility before migration.
- Preview scaffold upgrades; preserve customized guidance and provenance.
- Test the installed candidate, not only source imports, for consumer workflows.
- Bind qualification evidence to exact source and artifact inputs.
- Any package-input change invalidates an earlier candidate seal.
- Keep unresolved security, data-loss and compatibility findings explicit.
- Commits, pushes, tags, publication, deployment and history changes each require
  the applicable explicit authority; goal completion grants none implicitly.

# Validation

Recheck required tests, artifact identity and blocker disposition before an
authorized release. Report missing runtime, remote or hosted validation honestly.
