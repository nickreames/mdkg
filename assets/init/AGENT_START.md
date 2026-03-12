# AGENT_START

This repository uses mdkg for deterministic project memory.

Read these files in order:
1. `.mdkg/core/SOUL.md` if it exists
2. `.mdkg/core/HUMAN.md` if it exists
3. `.mdkg/README.md`
4. `CLI_COMMAND_MATRIX.md`

Trust order:
- source code
- mdkg rules, design docs, decisions, and work nodes
- SOUL/HUMAN collaboration anchors
- relevant skills
- chat history

If the active task is known:
- `mdkg pack <id>`
- `mdkg task start <id>` when durable work begins
- `mdkg task update <id> ...` as evidence accumulates
- `mdkg task done <id>` when work is complete
- `mdkg validate`

If no task is known:
- `mdkg search "..."`
- `mdkg show <id>`
- `mdkg next`
- then use `mdkg pack <id>`

Skill discovery:
- `mdkg skill list --tags stage:plan --json`
- `mdkg skill list --tags stage:execute --json`
- `mdkg skill list --tags stage:review --json`
- `mdkg skill show select-work-and-ground-context`

Conventions:
- `AGENTS.md` is the Codex/OpenAI-oriented wrapper doc.
- `CLAUDE.md` is the Claude-oriented wrapper doc.
- `.agents/skills/` and `.claude/skills/` mirror canonical skills from `.mdkg/skills/` when agent bootstrap is enabled.
- mdkg does not execute skill scripts; runtimes decide when and whether to do that.
- Prefer packs over ad-hoc file lists.
- Prefer task/event commands over hand-editing routine work-state changes.
- Use `mdkg task done <id> --checkpoint "<title>"` for milestone compression, not every routine task completion.
- Prefer checkpoints for feat/epic closeout summaries; parent status edits remain manual in 0.0.5.
- If events are disabled, `mdkg task start` and `mdkg task done` will remind you how to enable JSONL provenance.
