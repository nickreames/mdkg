---
id: task-447
type: task
title: scaffold GitBook docs source with quickstart concepts safety and reference entrypoints
status: done
priority: 1
epic: epic-123
parent: goal-25
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

# Implementation Summary

Created the initial repo-owned GitBook-ready docs source under `/docs`.

Navigation and entry points:

- `docs/README.md`
- `docs/SUMMARY.md`
- `docs/start-here/install.md`
- `docs/start-here/quickstart.md`
- `docs/start-here/safety-boundaries.md`
- `docs/start-here/public-alpha-contract.md`
- `docs/concepts/source-of-truth.md`
- `docs/concepts/repository-layout.md`
- `docs/concepts/work-context-evidence.md`
- `docs/guides/agent-workflow.md`
- `docs/guides/packs-and-handoffs.md`
- `docs/advanced-alpha/overview.md`
- `docs/advanced-alpha/project-db-queues.md`
- `docs/reference/README.md`
- `docs/reference/command-contract.md`
- `docs/project/changelog.md`
- `docs/project/roadmap.md`
- `docs/_generated/README.md`

Existing docs preserved:

- `docs/agent-runtime-0.0.9-handoff.md`
- `docs/mdkg-0.1.8-db-queue-upgrade-megaprompt.md`

Safety cleanup:

- Sanitized local absolute repo paths in the preserved `docs/mdkg-0.1.8-db-queue-upgrade-megaprompt.md` historical prompt by replacing them with generic repo labels.
- Verified no `/Users/nick` paths remain in `docs` or `mdkg-dev` source.
- Verified no obvious key/token markers such as `PRIVATE KEY`, `AKIA`, `BEGIN RSA`, or `npm_...` appear in docs or mdkg-dev source.

Open dependency:

- task-448 still owns generated command-reference docs and drift checks. This task created the landing pages and placeholders only.

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
