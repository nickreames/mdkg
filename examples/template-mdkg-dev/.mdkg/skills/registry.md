# Skills Registry

This directory stores Agent Skills packages used by mdkg tooling and orchestrators.

Use `mdkg skill new <slug> "<name>" --description "..."` to scaffold a new skill from the built-in Anthropic-aligned template.
Use `mdkg skill sync` to mirror canonical skills into `.agents/skills/` and `.claude/skills/` when agent bootstrap is enabled.
Use `CLI_COMMAND_MATRIX.md` as the canonical command and flag reference when updating skill procedures.

## Conventions

- One folder per skill slug.
- Use `SKILL.md` as the canonical skill entrypoint.
- Keep procedures deterministic and avoid embedding secrets.
- Create `scripts/` only when deterministic execution cannot be expressed safely as instructions.

## Registered Skills

<!-- mdkg:skill-registry:start -->
- `build-pack-and-execute-task`
  - name: `build-pack-and-execute-task`
  - stage: `stage:execute`
  - writer role: `writer:patch-only`
  - description: Build a deterministic mdkg pack for the active work item and use it as the execution handoff when coding or delegating to another AI agent.
- `pursue-mdkg-goal`
  - name: `pursue-mdkg-goal`
  - stage: `stage:execute`
  - writer role: `writer:orchestrator`
  - description: Pursue a selected mdkg goal by repeatedly selecting one scoped work item, executing it with evidence, and evaluating the goal until done, blocked, paused, or budget-limited.
- `select-work-and-ground-context`
  - name: `select-work-and-ground-context`
  - stage: `stage:plan`
  - writer role: `writer:read-only`
  - description: Select the right mdkg work item and ground execution before coding when the active task or context is still being established.
- `verify-close-and-checkpoint`
  - name: `verify-close-and-checkpoint`
  - stage: `stage:review`
  - writer role: `writer:orchestrator`
  - description: Verify code and mdkg state, attach evidence, and close work cleanly when the single-writer AI agent or human orchestrator is ready to perform durable writes.
<!-- mdkg:skill-registry:end -->
