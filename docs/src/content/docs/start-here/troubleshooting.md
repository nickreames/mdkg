---
title: Troubleshooting
description: Common public-alpha mdkg setup and validation issues.
---

## `mdkg validate` reports stale cache warnings

Run:

```bash
mdkg index
mdkg validate --summary
```

Generated indexes are rebuildable access caches. Markdown graph files remain authoritative.

## `mdkg goal next` returns no node

Check the selected goal:

Replace `GOAL_ID` with a concrete goal id from your repo:

```bash
mdkg goal current --json
mdkg goal next GOAL_ID --json
```

Completed, achieved, archived, or paused goals may correctly return no actionable node. Clear stale selection when no work should be active:

```bash
mdkg goal clear --json
```

In a fresh repo, `node: null` can simply mean no work exists yet. Continue with [If no work exists yet](/start-here/quickstart/#if-no-work-exists-yet) and create a small task before expecting `goal next` to route.

## There are many heading warnings

Use bounded output first:

```bash
mdkg validate --summary --json --limit 20
mdkg format --headings --dry-run --summary --json --limit 20
```

Apply formatting only after reviewing the diff.

## A repo has project DB runtime files

Runtime DB files are local state. Verify the DB before deciding whether anything needs cleanup:

```bash
mdkg db verify --json
mdkg db stats --json
```

Do not commit `.mdkg/db/runtime/` files.

## A handoff warns about raw markers

Review the handoff manually. Warnings are aids, not proof that the content is safe or unsafe. Remove raw secrets, tokens, provider payloads, raw prompt dumps, and bulky runtime traces before sharing.
