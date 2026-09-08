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

## A configured subgraph bundle is rejected (0.6.0 candidate)

Configured subgraph sources and imported-node bundle metadata must resolve to
contained regular files. Leaf links, linked ancestors, dangling links and
parent-directory traversal are rejected, including when a body reader already
has cached entries. ZIP archive and expansion limits still apply; the archive
byte limit is checked before and during the actual contained read.
An already-loaded body cache can still return its original bytes after genuine
file deletion; that is cached snapshot data, not fresh bundle verification.

An invalid enabled source produces subgraph health errors and omits that
subgraph's projected nodes/capabilities. Other aliases remain independent.
Show/pack may consequently report an unresolved imported node. Disabled sources
are not read. Read-only planning does not repair the source; explicit refresh
commands can still update derived caches before reporting failure. Do not treat
an omitted or unhealthy import as successfully verified evidence.

Ordinary native relative path spelling remains supported. Explicit
operator-selected external bundle inspection is a separate authority surface;
this restriction does not turn all bundle commands into repository-only reads.
Keep the checkout quiescent: the path-based checks are not a portable atomic
filesystem sandbox against concurrent ancestor replacement.

## Archive verification rejects a path or size (0.6.0 candidate)

Archive sidecars now use the same schema checks in direct verification and
normal graph parsing. Stored and compressed paths are sidecar-relative, but
their filesystem authority is the selected repository root. Absolute paths,
parent-directory components, NUL bytes, links and special files are rejected
before payload hashing. A genuinely absent raw copy remains optional when its
compressed cache verifies; a dangling raw link is an error, not absence.

Compressed input is bounded at 128 MiB and hashed from the same bytes parsed
as ZIP. Raw verification streams at most 64 MiB, matching the existing ZIP
single-entry uncompressed limit; other ZIP expansion limits still apply.
Contained-file mismatch receipts can still report actual digests. Invalid
external targets are not hashed. These are per-payload bounds, not an aggregate
archive-work budget or a portable atomic sandbox against concurrent writers.

Direct sidecar discovery uses bounded directory iteration and document reads:
`index.limits` can lower the default file, depth and byte budgets; they are capped
at the default safety envelope for this command. Legacy ID filtering occurs
before unrelated payload verification. Explicit `archive add` of an external
operator-selected source remains supported; this does not authorize sidecars
to read arbitrary external paths. Internal live `parseNode` consumers supply
`archiveRoot`; explicitly deferred historical parsing does not verify payloads.

## Nested workspace ownership in bundles (0.6.0 candidate)

The deepest registered workspace document root owns each file. Disabled,
private, and unselected roots remain ownership boundaries: their contents are
not borrowed by a selected public parent. A selected enabled public child is
exported once under its own alias. Private bundles also respect enabled state
and explicit workspace selection; private does not mean all registered roots.

Graph and skill discovery, historical snapshots, and independent-fork mappings
use the same ownership rule. Ordinary nested folders that are not registered
workspace roots remain part of their parent. Public references to private nodes
still fail validation rather than silently dropping evidence. On case-insensitive
filesystems, configured roots must use the exact directory-entry spelling;
case-only aliases fail with a workspace path-spelling diagnostic before export.
Correct the configuration spelling explicitly, without renaming graph history.
Separate case-sensitive paths remain distinct owners. Existing bundle
bytes are not changed by this fix; regenerating or distributing a replacement
is a separate explicit action. This ownership rule does not claim immunity to
concurrent filesystem replacement during export.

## A handoff warns about raw markers

Review the handoff manually. Warnings are aids, not proof that the content is safe or unsafe. Remove raw secrets, tokens, provider payloads, raw prompt dumps, and bulky runtime traces before sharing.
