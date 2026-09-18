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

## Event validation limits (0.6.0 candidate)

Validation streams contained regular event-log files; it never rotates, deletes,
rewrites, or silently skips oversized history. Missing logs remain valid. Links,
special files, and exceeded limits produce validation errors, including through
MCP and Git materialization. A rejected/incomplete validation is not clearance.

Optional `events.validation` fields in `.mdkg/config.json` override these defaults:

| Field | Default | Hard safety ceiling |
| --- | ---: | ---: |
| `max_file_bytes` | 67,108,864 (64 MiB) | 536,870,912 (512 MiB) |
| `max_total_bytes` | 134,217,728 (128 MiB) | 536,870,912 (512 MiB) |
| `max_line_bytes` | 1,048,576 (1 MiB) | 8,388,608 (8 MiB) |
| `max_records` | 1,000,000 | 5,000,000 |
| `max_lines` | 2,000,000 | 10,000,000 |
| `max_errors` | 1,000 | 10,000 |

Overrides must be positive safe integers; unknown limit names are errors.
File and line limits are per file/line; total bytes, physical lines, nonblank
records, and event diagnostics are shared across enabled workspaces. Line bytes
exclude LF but include an optional CR. A trailing LF does not create an extra
physical line. At most `max_errors` event diagnostics plus one explicit
incomplete-validation diagnostic are returned.

Event bytes and decoded Markdown validation bytes also share
`index.limits.max_total_bytes`; the tightest remaining byte budget applies.
Blank lines, CRLF, UTF-8 split across read chunks, and a final line without LF
remain supported. Validation preserves existing event field semantics; append
commands do not rotate logs or guarantee that a growing log stays below limits.

For trusted history that exceeds a default, preserve it, review resource needs,
and explicitly increase the relevant configuration within the ceilings. If a
hard ceiling is exceeded, stop and plan an explicit archival/segmentation
workflow; do not delete history, bypass validation, or claim partial validation
is complete.

## Local template discovery errors (0.6.0 candidate)

`templates.root_path` and `templates.default_set` must be relative contained
paths. Absolute paths, drive-relative paths, NUL bytes and parent-directory
components are rejected before lookup. Nested sets and explicit `.` remain
supported; normal `./` prefixes and repeated separators are normalized.
Schema discovery preserves the configured set's case. The template body loader
retains its historical lowercase set lookup; use lowercase set names when the
same templates serve both paths on a case-sensitive filesystem.

Visible linked discovery roots and directories are rejected. Descendant links
and non-Markdown entries remain excluded from schema input. Missing local
required built-in types may use installed bundled fallback; malformed existing
templates do not silently fall back. An explicitly requested missing body set
still returns a not-found error.

Local schema reads use `index.limits`, capped at 100,000 Markdown files, 8 MiB
per file, 512 MiB total and depth 64 below the selected set. Lower configured
limits apply. Discovery also stops after ten times the effective `max_files`
directory entries, including ignored entries, so wide non-Markdown trees are
bounded. Local body reads use the same per-file bound; trusted installed
fallback assets are separate from these local-input budgets. Limit errors
leave source templates untouched and do not mean partial validation succeeded.
Keep the checkout quiescent during validation: path checks do not provide an
atomic filesystem sandbox against another process replacing ancestors.

## A handoff warns about raw markers

Review the handoff manually. Warnings are aids, not proof that the content is safe or unsafe. Remove raw secrets, tokens, provider payloads, raw prompt dumps, and bulky runtime traces before sharing.
