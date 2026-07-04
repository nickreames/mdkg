# Skills Registry

This directory stores Agent Skills packages used by mdkg tooling and orchestrators.

Use `mdkg skill new <slug> "<name>" --description "..."` to scaffold a new skill from the built-in Anthropic-aligned template.
Use `mdkg skill sync` to refresh configured `.mdkg/config.json` skill mirror targets from canonical `.mdkg/skills/`; defaults are `.agents/skills/` and `.claude/skills/`.
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
  - description: Create or update an mdkg SKILL.md or MANIFEST.md when a repeatable workflow, capability, agent, tool, runtime, API, or projection contract should become durable mdkg-authored knowledge.
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
- `service-boundary-ownership-check`
  - name: `service-boundary-ownership-check`
  - stage: `stage:plan`
  - writer role: `writer:orchestrator`
  - description: Classify mdkg/runtime/sandbox/root ownership before boundary-sensitive planning so generic mdkg primitives are not given product-specific public names.
- `verify-close-and-checkpoint`
  - name: `verify-close-and-checkpoint`
  - stage: `stage:review`
  - writer role: `writer:orchestrator`
  - description: Verify code and mdkg state, attach evidence, and close work cleanly when the single-writer AI agent or human orchestrator is ready to perform durable writes.
<!-- mdkg:skill-registry:end -->
