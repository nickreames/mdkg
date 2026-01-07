---
id: rule-guide
type: rule
title: agent guide (how to work in this repo using mdkg)
tags: [agents, workflow, mdkg]
created: 2026-01-06
updated: 2026-01-06
---

# Agent guide

This repo uses **mdkg** to manage documentation, decisions, and work tracking.

## Always start with a pack

Before coding, generate a context pack for the task you’re working on:

- `mdkg pack <task-id> --verbose`

Read:
- the task
- linked design docs (edd/prd)
- decision records (dec)
- rules (rule)

Do not begin implementation without understanding constraints in rules and decisions.

## Keep frontmatter valid and searchable

Frontmatter must remain strictly valid or indexing/search breaks.

- do not introduce multiline values
- do not introduce nested objects
- keep keys lowercase
- keep IDs lowercase
- keep `links: [...]` and `artifacts: [...]` in frontmatter for anything you want searchable
- keep graph fields (`epic`, `parent`, `relates`, `blocked_by`, `blocks`, `prev`, `next`) accurate

## Update the right fields

When you make a meaningful edit:
- update the node’s `updated: YYYY-MM-DD`
- update status and priority as needed

## Work item discipline

- Use `prev/next` to define an explicit “immediate next” chain when the workflow is linear.
- Use `priority: 0..9` for triage and non-linear backlogs.
- Keep `status` accurate.

## Use checkpoints to compress phases

After completing a meaningful phase:
- create a `chk-*` node summarizing work, verification, and links.
- link it to the epic or relevant tasks.
- optionally include a `scope` list of the nodes covered.

Checkpoints reduce context sprawl and improve future packs.

## Validate frequently

After making changes:
- run `mdkg validate`

If formatting drift is common (especially with agent edits):
- run `mdkg format` before committing.

## Indexing behavior

Index is cached by default and auto-reindexed when stale.

If debugging index issues:
- run `mdkg index`
- inspect errors from strict frontmatter enforcement