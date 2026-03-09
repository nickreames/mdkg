# Pack Examples

These examples are abridged but source-aligned to the current pack exporters in `src/pack/export_md.ts` and `src/pack/export_json.ts`.

## Example 1: Concise dry-run summary

Command:

```bash
mdkg pack task-39 --profile concise --dry-run --stats
```

Shape:

```text
dry-run: no files written
root: root:task-39
profile: concise
body_mode: summary
format: md
nodes: 20
latest_checkpoint_qid: root:chk-3
latest_checkpoint_qid_hint: root:chk-3
included_nodes:
- root:task-39
- root:epic-4
- root:edd-2
...

qid           chars  lines  bytes  tokens
------------  -----  -----  -----  ------
root:task-39    432     15    432     108
...
TOTAL         13048    352  13048    3271
```

## Example 2: Markdown pack excerpt

Command:

```bash
mdkg pack task-1
```

Shape:

```md
# mdkg pack
root: root:task-1
depth: 2
verbose: false
profile: standard
body_mode: full
nodes: 1
truncated: max_nodes=false max_bytes=false max_chars=false max_lines=false max_tokens=false
generated_at: 2026-03-05T00:00:00.000Z

included_nodes:
- root:task-1

---

## root:task-1
qid: root:task-1
type: task
title: example task
status: todo
priority: 1
path: .mdkg/work/task-1-example-task.md
links: []
artifacts: []

# Overview

Example body content.
```

## Example 3: JSON pack excerpt with skills

Command:

```bash
mdkg pack task-1 --format json --skills auto --skills-depth full
```

Shape:

```json
{
  "meta": {
    "root": "root:task-1",
    "profile": "standard",
    "body_mode": "full",
    "latest_checkpoint_qid": "root:chk-3"
  },
  "nodes": [
    {
      "qid": "root:task-1",
      "id": "task-1",
      "workspace": "root",
      "type": "task",
      "title": "example task",
      "status": "todo",
      "priority": 1,
      "path": ".mdkg/work/task-1-example-task.md",
      "frontmatter": {},
      "body": "# Overview\n\nExample body content."
    },
    {
      "qid": "root:skill:build-pack-and-execute-task",
      "id": "skill:build-pack-and-execute-task",
      "workspace": "root",
      "type": "skill",
      "title": "build-pack-and-execute-task",
      "path": ".mdkg/skills/build-pack-and-execute-task/SKILL.md",
      "frontmatter": {
        "links": [
          "README.md",
          "PACK_EXAMPLES.md",
          "llms.txt"
        ],
        "aliases": [
          "build-pack-and-execute-task",
          "stage:execute",
          "mdkg",
          "pack-first",
          "context"
        ]
      },
      "body": "# Goal\n\nUse mdkg pack <id> as the default execution context..."
    }
  ]
}
```
