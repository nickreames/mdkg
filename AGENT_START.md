# AGENT_START

This repository uses mdkg as durable project memory for humans and AI agents.

## Read order

Start here, then read in this order:
1. `.mdkg/core/SOUL.md`
2. `.mdkg/core/HUMAN.md`
3. `.mdkg/README.md`
4. `CLI_COMMAND_MATRIX.md`

If those files disagree, trust the source code and current CLI behavior first, then update the docs.

## Truth hierarchy

Use this order of trust:
- source code and tests
- mdkg rules, design docs, decision records, and work nodes
- `SOUL.md` and `HUMAN.md`
- relevant skills
- prior chat history

## First steps

If the active task is known:
- `mdkg show <id>`
- `mdkg pack <id>`
- `mdkg task start <id>` when durable execution begins
- `mdkg validate` before closeout

If the active task is not known:
- `mdkg search "..."`
- `mdkg next`
- `mdkg show <id>`
- `mdkg pack <id>`

## First-step skill

Use the canonical planning skill first when context is still being established:
- `mdkg skill show select-work-and-ground-context`

Stage-tagged discovery:
- `mdkg skill list --tags stage:plan --json`
- `mdkg skill list --tags stage:execute --json`
- `mdkg skill list --tags stage:review --json`

## Product-specific conventions

Codex / OpenAI:
- `AGENTS.md` is the product-facing wrapper doc
- `.agents/skills/` mirrors canonical skills from `.mdkg/skills/`

Claude:
- `CLAUDE.md` is the product-facing wrapper doc
- `.claude/skills/` mirrors canonical skills from `.mdkg/skills/`

mdkg remains canonical:
- `.mdkg/skills/` is the only source of truth for project skills
- mirrored skill folders are outputs, not edit locations
- mdkg does not execute skill scripts; runtimes decide whether to use them

## Core loop

Use this loop for normal work:
1. identify the work item
2. build a deterministic pack
3. execute with the smallest sufficient context
4. update structured task state with `mdkg task ...` and keep narrative/body edits in markdown
5. rely on the default JSONL event log and use `mdkg event enable` only if the file is missing
6. validate before closing work

## Closeout guidance

- Use `mdkg task done <id> --checkpoint "<title>"` when a task closes at a milestone boundary or needs durable narrative memory.
- Prefer checkpoints for parent closeout summaries:
  - feat closeout should summarize direct child work with `parent: <feat-id>`
  - epic closeout should summarize descendant work with `epic: <epic-id>`
- Parent status edits remain manual; mdkg does not yet provide a dedicated parent closeout command.
- If `events.jsonl` is missing, `mdkg task start` and `mdkg task done` will remind you how to recreate it.

## Editing boundary

- Use `mdkg task ...` for structured field changes such as status, priority, artifacts, refs, tags, blockers, and skills.
- Edit markdown directly for narrative body content, nuanced summaries, and manual parent-node closeout updates.
- Files outside mdkg-managed skill mirrors, such as local tool permission files, are not managed by mdkg unless documented explicitly.

## Repo-specific commands

Build and verification:
- `npm run build`
- `npm run test`
- `npm run cli:snapshot`
- `npm run cli:check`

When you need a full command reference, use `CLI_COMMAND_MATRIX.md` or `mdkg help <command>`.

Discovery and show commands also support structured exports when an agent needs machine-readable output:
- `--json`
- `--xml`
- `--toon`
- `--md`
