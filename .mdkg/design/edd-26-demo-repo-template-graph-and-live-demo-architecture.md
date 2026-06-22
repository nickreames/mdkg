---
tags: [mdkg-dev, examples, demo, subgraph]
owners: []
links: []
artifacts: [mdkg_planning_docs.zip]
relates: []
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
aliases: []
created: 2026-06-22
updated: 2026-06-22
id: edd-26
type: edd
title: demo repo template graph and live-demo architecture
---
# Overview

Demos should prove mdkg value through reusable template graphs and live preview workflows without replacing the canonical mdkg.dev site or harming SEO.

# Architecture

- /examples/demo-agentic-coding showcases a concrete agent coding flow.
- /examples/template-mdkg-dev provides a clone/forkable graph for website demo generation.
- Template graphs preserve IDs in separate repos and rely on graph import rewrite in same-repo imports.
- Preview deploys and durable demo subdomains stay separate from canonical mdkg.dev.

# Data model

- Template graph nodes: one umbrella goal, DESIGN/EDD decisions, tasks, tests, checkpoints, and optional skill-authoring tasks.
- Subgraph bundles: read-only root context after examples validate.

# APIs / interfaces

- Graph import-template.
- Subgraph add/verify/sync.
- Demo smoke and preview deployment hooks in future.

# Failure modes

- Demo graph ID conflicts.
- Dirty demo repo state before subgraph sync.
- SEO confusion if demos replace canonical pages.

# Observability

- Demo smoke reports import receipt, selected goal, validation result, preview URL when applicable, and teardown/promotion state.

# Security / privacy

- Demo repos must not include private data or live credentials.
- Rejected demo deployments should be noindexed or removed.

# Testing strategy

- Demo graph import smoke.
- Subgraph root-qualified qid contract.
- No-secret scan.

# Rollout plan

- Create examples in Goal 2.
- Register subgraphs only after each example graph validates.
- Leave production promotion to an explicit later request.
