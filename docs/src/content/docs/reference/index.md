---
title: CLI Reference
description: User-facing command entry points, generated reference material, and maintainer metadata.
---

Use this section when you know what you want to do and need the current command shape. If you are new to mdkg, start with [Install](/start-here/install/) and [Quickstart](/start-here/quickstart/) first.

## Common command groups

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
mdkg pack WORK_ID --pack-profile concise
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
mdkg mcp serve --stdio
mdkg subgraph audit --json
```

## Full reference

Use the generated CLI reference for broader command selection and examples:

- [Generated CLI Reference](generated-cli-reference.md)

## Integration metadata

Integration authors can use the machine-readable metadata behind the reference:

- [Command Contract](command-contract.md)
- `dist/command-contract.json`
- `CLI_COMMAND_MATRIX.md`

Most readers should use the generated reference. The command contract is for integrations, docs generation, and compatibility checks.
