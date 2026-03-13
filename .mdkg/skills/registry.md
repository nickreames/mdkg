# Skills Registry

This directory stores Agent Skills packages used by mdkg tooling and orchestrators.

Use `mdkg skill new <slug> "<name>" --description "..."` to scaffold a new skill from the built-in Anthropic-aligned template.
Use `mdkg skill sync` to refresh `.agents/skills/` and `.claude/skills/` from canonical `.mdkg/skills/` when AI-agent bootstrap is enabled.
Use `CLI_COMMAND_MATRIX.md` as the canonical command and flag reference when updating skill procedures.
Use `AGENT_START.md` as the canonical first-read startup doc for agents.
Use `mdkg task ...` for structured task-like node fields and `mdkg event ...` when a workflow needs explicit or restored JSONL provenance.
Keep narrative body edits, nuanced summaries, and manual parent closeout updates in markdown.

## Conventions

- One folder per skill slug.
- Use `SKILL.md` as the canonical skill entrypoint.
- Keep procedures deterministic and avoid embedding secrets.
- Create `scripts/` only when deterministic execution cannot be expressed safely as instructions.

## Registered Skills

<!-- mdkg:skill-registry:start -->
- `author-mdkg-skill`
  - name: `author-mdkg-skill`
  - stage: `stage:plan`
  - writer role: `writer:orchestrator`
  - description: Create or update an mdkg skill when a repeatable repo workflow should be codified or an existing skill has drifted from the current command surface.
- `build-pack-and-execute-task`
  - name: `build-pack-and-execute-task`
  - stage: `stage:execute`
  - writer role: `writer:patch-only`
  - description: Build a deterministic mdkg pack for the active work item and use it as the execution handoff when coding or delegating to another agent.
- `select-work-and-ground-context`
  - name: `select-work-and-ground-context`
  - stage: `stage:plan`
  - writer role: `writer:read-only`
  - description: Select the right mdkg work item and ground execution before coding when the active task or context is still being established.
- `verify-close-and-checkpoint`
  - name: `verify-close-and-checkpoint`
  - stage: `stage:review`
  - writer role: `writer:orchestrator`
  - description: Verify code and mdkg state, attach evidence, and close work cleanly when the single-writer orchestrator is ready to perform durable writes.
<!-- mdkg:skill-registry:end -->
