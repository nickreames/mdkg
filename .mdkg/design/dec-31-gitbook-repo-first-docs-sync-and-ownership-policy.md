---
tags: [mdkg-dev, gitbook, docs, ownership]
owners: []
links: []
artifacts: [mdkg_planning_docs.zip]
relates: [dec-30, edd-24, edd-27]
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
aliases: [gitbook-repo-first-docs-policy]
created: 2026-06-22
updated: 2026-06-22
id: dec-31
type: dec
title: GitBook repo-first docs sync and ownership policy
status: accepted
---
# Context

Goal-25 will create `/docs` as canonical documentation source while GitBook remains the intended professional renderer and hosted docs surface.

# Decision

- The mdkg repo is the canonical source for public docs.
- GitBook is a renderer or sync target, not the source of truth.
- Direct edits in GitBook are discouraged by policy and must be synced back through Git review if used.
- `/docs` must preserve existing committed docs unless the implementation task explicitly migrates or archives them.
- Generated command references are derived from the local command contract and checked for drift before closeout.
- Docs domain work, GitBook production configuration, and DNS changes are out of scope until explicitly requested.

# Alternatives considered

- Treat GitBook as the canonical authoring source: rejected because it would disconnect public docs from local command-contract generation and mdkg graph review.
- Keep docs external-only: rejected because goal-25 needs docs source, launch checks, and generated references in the same repo as the CLI.

# Consequences

- Docs can be reviewed, packed, validated, and evolved with the mdkg graph.
- Generated command reference drift can be caught by local checks.
- GitBook setup may require manual account/domain work later; goal-25 records readiness but does not claim live hosting.

# Links / references

- goal-25
- task-447
- task-448
- test-201
- dec-30
- archive://archive.mdkg-dev-planning-docs-2026-06-22
