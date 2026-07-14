---
id: edd-77
type: edd
title: mdkg v0.5.1 archive fix release and consumer verification
tags: [release, v0.5.1, npm, documentation, consumer-verification]
owners: []
links: []
artifacts: []
relates: [goal-71, dec-83, goal-70, goal-64]
refs: [goal-71, goal-70, dec-83, goal-64]
aliases: []
created: 2026-07-14
updated: 2026-07-14
---
# Overview

Release the archive ownership correction as v0.5.1 only after local package
qualification, then prove it against registry installs, the real root graph,
and production documentation.

# Architecture

Use four ordered gates: release candidate and CI, npm publication and clean
consumer install, real global/root no-touch proof, and public documentation
deployment. Goal 70 supplies the implementation commit; Goal 71 owns every
version and external mutation.

# Data model

- Goal 70 checkpoint and implementation commit.
- v0.5.1 version/changelog release commit.
- One explicit approval receipt covering all external mutations.
- Registry/tarball/install receipts.
- Root before/after hashes and Git state.
- Documentation deployment and final release checkpoint.

# APIs / interfaces

The shipped CLI and JSON surfaces are those accepted by `edd-76`/`dec-82`.
Publication uses npm `latest`. Documentation on mdkg.dev and docs.mdkg.dev must
describe the same `--all --ws`, qid, read-only error, and receipt contracts.

# Failure modes

Before npm publication, any failed gate returns to local repair. After
publication, failures are fixed forward. Root state that cannot be classified or
hashed blocks the real consumer test; unrelated untracked files are never
deleted or staged.

# Observability

Record exact commit/CI SHA, npm integrity and tarball metadata, resolved global
binary, root command JSON, before/after hashes, deployment identities, browser
checks, and no-tag state.

# Security / privacy

External mutations require explicit approval. Registry credentials remain
outside graph artifacts. Root imported bundles, child repos, gitlinks,
materializations, and raw archive Markdown are no-touch evidence surfaces.

# Testing strategy

Repeat local gates, install the registry tarball in a clean temp directory,
upgrade the real global binary, exercise `archive compress --all --json`, and
verify production docs on desktop and mobile.

# Rollout plan

Keep Goal 71 paused until Goal 70 is achieved. Do not tag by default. Publish
once, then fix forward if post-publication evidence reveals a defect.
