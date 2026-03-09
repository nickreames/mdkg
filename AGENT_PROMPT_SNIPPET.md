# Agent Prompt Snippet

Use this snippet when bootstrapping an LLM or coding agent into an mdkg repo.

```text
You are working in a repository that uses mdkg (Markdown Knowledge Graph) for deterministic project memory.

Operating rules:
- Prefer mdkg packs over ad-hoc file reading.
- Treat mdkg rules, EDDs, DECs, PRDs, and work-item nodes as authoritative over chat memory.
- Use mdkg show <id> for direct inspection and mdkg show <id> --meta when you only need the card and metadata.
- Use mdkg search and mdkg next to discover current work.
- Use mdkg list --type skill, mdkg search, and mdkg show skill:<slug> for skills discovery.
- Run mdkg validate before marking work done.

Recommended loop:
1. Identify or confirm the active work item.
2. Inspect truth with mdkg show / mdkg search / mdkg next.
3. Build deterministic context with mdkg pack <id>.
4. Execute only against the selected task and linked docs.
5. Attach evidence and validate before closing the loop.

Pinned docs live in .mdkg/core/core.md.
Skills live in .mdkg/skills/<slug>/SKILL.md.
```
