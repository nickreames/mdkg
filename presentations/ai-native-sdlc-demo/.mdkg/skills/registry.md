# Skills Registry

This directory stores Agent Skills packages used by mdkg tooling and orchestrators.

Use `mdkg skill new <slug> "<name>" --description "..."` to scaffold a new skill from the built-in Anthropic-aligned template.
Use `mdkg skill sync` to mirror canonical skills into configured `.mdkg/config.json` targets; defaults are `.agents/skills/` and `.claude/skills/`.
Use `CLI_COMMAND_MATRIX.md` as the canonical command and flag reference when updating skill procedures.

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
- `produce-powerpoint-with-artifact-tool`
  - name: `Produce PowerPoint with Artifact Tool`
  - stage: `stage:execute`
  - writer role: `writer:patch-only`
  - description: Plan, build, render, and visually verify a source-backed editable PowerPoint with Artifact Tool when Goal 3 or another approved presentation task requires a deterministic local deck.
- `publish-static-demo-with-exact-sha`
  - name: `Publish Static Demo with Exact-SHA Proof`
  - stage: `stage:execute`
  - writer role: `writer:orchestrator`
  - description: Prepare, authorize, non-force publish, and verify a static demo against exact Git and deployment SHAs when a goal crosses from accepted local evidence into public production.
- `pursue-mdkg-goal`
  - name: `pursue-mdkg-goal`
  - stage: `stage:execute`
  - writer role: `writer:orchestrator`
  - description: Pursue an explicit mdkg goal QID through owned scoped work, durable evidence, evaluation, and supported local-only closure while treating selected state as a hint.
- `pursue-mdkg-loop`
  - name: `pursue-mdkg-loop`
  - stage: `stage:execute`
  - writer role: `writer:orchestrator`
  - description: Pursue a selected mdkg loop by exhausting authorized linked work lanes, recording blocker recovery, and closing only when the loop definition of done is satisfied or explicitly waived.
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
