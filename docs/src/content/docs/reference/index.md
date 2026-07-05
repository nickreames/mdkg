---
title: CLI Reference
description: User-facing command entry points for common mdkg workflows.
---

Use this section when you know what you want to do and need the current command shape. If you are new to mdkg, start with [Install](/start-here/install/) and [Quickstart](/start-here/quickstart/) first.

## Common command groups

Uppercase placeholders such as `WORK_ID`, `GOAL_ID`, and `TASK_ID` are examples. Replace them with concrete ids from your repo before running the command.

## Choose by job

| Job | Start with | Then use |
| --- | --- | --- |
| Initialize a repo | `mdkg init --agent` | `mdkg index`, `mdkg validate` |
| Find work | `mdkg goal next` | `mdkg show WORK_ID`, `mdkg pack WORK_ID` |
| Record progress | `mdkg task start TASK_ID` | `mdkg task done TASK_ID --checkpoint "Done"` |
| Share context | `mdkg pack WORK_ID --profile concise` | `mdkg handoff create WORK_ID` |
| Diagnose health | `mdkg status` | `mdkg doctor --strict --json`, `mdkg fix plan --json` |
| Coordinate repos | `mdkg subgraph audit --json` | `mdkg bundle`, `mdkg subgraph sync` |
| Close out Git work | `mdkg git closeout --json` | `mdkg git push-ready --remote origin --branch main --json` |

First-run setup:

```bash
mdkg init --agent
mdkg index
mdkg status
mdkg validate
```

Discovery and routing:

```bash
mdkg search "query"
mdkg show WORK_ID
mdkg goal current
mdkg goal next GOAL_ID
```

Lifecycle and evidence:

```bash
mdkg goal claim GOAL_ID WORK_ID
mdkg task start TASK_ID
mdkg task done TASK_ID --checkpoint "Meaningful milestone"
mdkg checkpoint new "Review proof" --kind test-proof
```

Context transfer:

```bash
mdkg pack WORK_ID --profile concise
mdkg handoff create WORK_ID
```

Validation and repair planning:

```bash
mdkg doctor --strict --json
mdkg fix plan --json
mdkg format --headings --dry-run --summary --json --limit 20
```

Advanced alpha surfaces:

```bash
mdkg db queue contract --json
mdkg git inspect --json
mdkg mcp serve --stdio
mdkg subgraph audit --json
```

## Complete command list

Use the complete CLI reference when the common groups above do not cover the command you need:

- [Generated CLI Reference](generated-cli-reference.md)

## Integration metadata

Integrations, docs tooling, and compatibility checks can use the machine-readable metadata behind the reference:

- [Command Contract](command-contract.md)
- `dist/command-contract.json`
- `CLI_COMMAND_MATRIX.md`

Most readers should use the common groups or complete command list. The command contract is not the first-stop user guide.
