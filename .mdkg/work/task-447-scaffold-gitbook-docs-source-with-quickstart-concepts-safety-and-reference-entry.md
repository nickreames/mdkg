---
tags: [mdkg-dev, docs, gitbook]
owners: []
links: []
artifacts: []
relates: [task-445, task-448]
blocked_by: [task-445]
blocks: [task-448, test-201]
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
context_refs: [prd-4, prd-5, edd-24, edd-25, edd-27, dec-30]
evidence_refs: []
aliases: []
skills: []
created: 2026-06-22
updated: 2026-06-22
id: task-447
type: task
title: scaffold GitBook docs source with quickstart concepts safety and reference entrypoints
status: todo
priority: 1
parent: goal-25
epic: epic-123
---
# Overview

Create documentation source suitable for GitBook rendering while retaining repo ownership.

# Acceptance Criteria

- Executed only after goal-25 is explicitly activated and task-445 is done.
- `/docs` remains the canonical source for public documentation.
- Existing `/docs` files are preserved, linked, migrated, or explicitly archived; they are not silently overwritten.
- A repo-first GitBook policy is documented from the GitBook ownership decision.
- Initial docs navigation covers quickstart, concepts, safety, alpha, guides, reference, and advanced-alpha pages.
- Docs explicitly distinguish Markdown source of truth, rebuildable index, optional project DB, and local queue state.
- Docs do not claim GitBook is live at `docs.mdkg.dev` unless DNS/custom domain has actually been configured later.

# Files Affected

- `/docs`
- generated reference entrypoints selected by task-448

# Implementation Notes

- Keep stubs acceptable when clearly marked.
- Do not manually duplicate the full command reference if generated command docs are available.
- Record docs inventory and GitBook policy evidence.

# Test Plan

- Docs source lint/link check if available.
- Generated reference entrypoint check after task-448.
- `node dist/cli.js validate --json`

# Links / Artifacts

- archive://archive.mdkg-dev-planning-docs-2026-06-22
- parent: goal-25
- epic: epic-123
- context: GitBook repo-first ownership policy
- context: edd-27
