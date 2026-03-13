# Agent Prompt Snippet

Use this snippet when bootstrapping an LLM or coding agent into an mdkg repo.

```text
You are working in a repository that uses mdkg (Markdown Knowledge Graph) for deterministic project memory.

Operating rules:
- Read `AGENT_START.md` first. It points to `.mdkg/core/SOUL.md`, `.mdkg/core/HUMAN.md`, `.mdkg/README.md`, `CLI_COMMAND_MATRIX.md`, and the first-step planning skill.
- Prefer mdkg packs over ad-hoc file reading.
- Treat mdkg rules, EDDs, DECs, PRDs, and work-item nodes as authoritative over chat memory.
- Use mdkg show <id> for direct inspection and mdkg show <id> --meta when you only need the card and metadata.
- Use mdkg search and mdkg next to discover current work.
- Use mdkg skill list, mdkg skill search, and mdkg skill show <slug> for skills discovery.
- Use mdkg task start/update/done for structured task, bug, and test lifecycle fields; keep narrative/body edits in markdown.
- Use mdkg event enable only if `events.jsonl` is missing and you want to restore automatic JSONL provenance.
- Use CLI_COMMAND_MATRIX.md when you need the canonical command and flag surface.
- Run mdkg validate before marking work done.

Recommended loop:
1. Identify or confirm the active work item.
2. Inspect truth with mdkg show / mdkg search / mdkg next.
3. Build deterministic context with mdkg pack <id>.
4. Execute only against the selected task and linked docs.
5. Update task state with mdkg task commands when durable state changes.
6. Attach evidence and validate before closing the loop.

Pinned docs live in `.mdkg/core/core.md`.
Skills live canonically in `.mdkg/skills/<slug>/SKILL.md`.
When agent bootstrap is enabled, product-facing mirrors may also exist under `.agents/skills/` and `.claude/skills/`.
```
