---
id: edd-12
type: edd
title: mdkg db command surface and project db foundation architecture
tags: [project-db, db-cli, sqlite, architecture, foundation]
owners: []
links: []
artifacts: []
relates: [epic-29, epic-30, epic-20]
refs: [rule-3, rule-4]
aliases: [mdkg-db-foundation, project-db-architecture, db-command-surface]
created: 2026-06-03
updated: 2026-06-03
---

# Overview

The first mdkg project database pass should add a clear `mdkg db ...` command
surface without confusing it with the existing rebuildable graph index cache.
The design keeps two database concepts separate:

- `.mdkg/index` is the rebuildable graph access cache.
- `.mdkg/db` is future project application state.

Markdown, sidecars, config, bundles, and mdkg graph nodes remain source of
truth for mdkg itself. Project DB files are application-state artifacts owned by
future lifecycle commands.

# Architecture

The DB foundation is split into two surfaces. Existing index-cache behavior
stays under `.mdkg/index` and remains rebuildable. Project application database
behavior starts under `.mdkg/db` and is managed by explicit lifecycle commands.

# APIs / interfaces

First implementation command surface:

- `mdkg db index rebuild`
- `mdkg db index status`
- `mdkg db index verify`
- `mdkg db init`
- `mdkg db migrate`
- `mdkg db verify`
- `mdkg db stats`

`mdkg index` remains available as a compatibility shortcut and should delegate
to the same rebuild behavior as `mdkg db index rebuild`.

# Data model

The generic project DB layout is:

- `.mdkg/db/schema`
- `.mdkg/db/runtime`
- `.mdkg/db/state`
- `.mdkg/db/receipts`

Active runtime databases, WAL, SHM, journal, lock, and temp files are ignored by
default. Schema files, manifests, receipt artifacts, and opt-in sealed snapshots
are commit-eligible by explicit project policy.

Config should keep project DB settings separate from `index.*` settings. The
first pass should cover enabled state, layout paths, runtime path, state path,
receipt path, schema version, and migration metadata. Profile support is
deferred until implementation evidence clarifies the right artifacts.

# Lifecycle behavior

`mdkg db init` creates the generic `.mdkg/db` layout and baseline schema
metadata. `mdkg db migrate` applies deterministic local migrations through
Node's built-in `node:sqlite`. `mdkg db verify` checks layout, config,
migration state, SQLite integrity, and receipt directory policy. `mdkg db stats`
reports deterministic human and JSON summaries such as DB size, table counts,
migration version, WAL state, snapshot/state pointers, and receipt counts.

# Exclusions

- No arbitrary agent SQL command.
- No hosted queue or external database requirement.
- No Rust sidecar implementation.
- No embeddings or vector DB work.
- No full profile system in the first implementation pass.
- No real npm publish without separate manual approval.

# Failure modes

Commands should fail clearly for malformed config, paths outside the repo,
missing layout directories, corrupt SQLite files, migration checksum drift, and
runtime WAL state that violates policy.

# Observability

Every `mdkg db ...` command should provide deterministic human output and JSON
receipts where the existing CLI pattern supports `--json`.

# Security / privacy

The first pass is not a secret manager and does not redact arbitrary DB content.
It must avoid committing active runtime/WAL files by default and must not expose
raw SQL mutation commands to agents.

# Testing strategy

The implementation should include unit tests, CLI tests, and packed temp-repo
smoke coverage. Fresh temp repos must prove the `mdkg db` command family works
without breaking `mdkg index`, SQLite index cache rebuilds, graph validation, or
normal mdkg init/upgrade behavior.

# Rollout plan

Implement under the selected `goal-1` loop, one task at a time. Finish with
prepublish dry-run evidence only; do not publish without separate user approval.

# Links / Artifacts

- `goal-1`
- `epic-30`
- `task-223`
- `task-231`
