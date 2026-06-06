---
name: author-mdkg-skill
description: Create or update an mdkg SKILL.md or SPEC.md when a repeatable workflow, capability, agent, tool, runtime, API, or projection contract should become durable mdkg-authored knowledge.
tags: [stage:plan, writer:orchestrator, mdkg, skills, authoring]
version: 0.2.0
authors: [mdkg]
links: [AGENT_START.md, CLI_COMMAND_MATRIX.md, .mdkg/design/edd-5-mdkg-skills-integration-guide-v0-4-agent-skills-standard-and-packs.md]
---

# Goal

Create or update focused mdkg-authored SKILL.md and SPEC.md assets that make
repeatable workflows and durable capabilities explicit without creating
duplicated procedures or projection-only behavior.

## When To Use

- When a repo workflow is repeated often enough to deserve a reusable skill
- When an existing skill no longer matches the current command surface or docs
- When a builder asks to codify a procedure for future humans or agents
- When a capability, agent, tool, runtime image, API, model, or integration
  needs a durable SPEC before it is projected into a runtime-specific config
- When `.codex/agents` or another projection surface contains behavior that
  should be mirrored into durable mdkg/SPEC/SKILL state

## Inputs

- Repo root
- Workflow trigger and desired outcome
- Any existing related skills, docs, or command references
- Candidate capability, resource, agent, tool, runtime, API, model, or
  integration boundary
- Source mdkg nodes and intended projection targets, if any

## Required Output Sections

For SKILL.md output, include:

- Purpose
- When to use
- Inputs
- Outputs
- Required capabilities
- Resources touched
- Steps
- Validation checks
- Closeout evidence
- Failure modes
- Safety rules
- Related SPECs
- Projection targets
- Open questions

For SPEC.md output, include:

- Identity
- Purpose
- Scope
- Non-goals
- Status
- Owners
- Source mdkg nodes
- Resource URIs
- Capabilities
- Inputs
- Outputs
- Dependencies
- Security boundaries
- Validation checks
- Closeout evidence
- Projection targets
- Versioning
- Change policy
- Open questions

## Steps

1. Check for an existing fit first with `mdkg skill list`, `mdkg skill search`, and `mdkg skill show <slug>`.
2. If an existing skill already covers the workflow, update it instead of creating a near-duplicate.
3. If a SPEC already covers the capability, update that SPEC or create a
   repair task instead of adding behavior only to a projection file.
4. Use existing templates from `.mdkg/templates/skills/` and
   `.mdkg/templates/specs/` before proposing a new template family.
5. If the workflow is really task mutation or event provenance, prefer teaching
   `mdkg task ...` and `mdkg event ...` for structured fields while still
   allowing markdown narrative edits where they fit better.
6. If a new skill is justified, scaffold it with
   `mdkg skill new <slug> "<name>" --description "..."`.
7. Write the description so it says both what the skill does and when to use it.
8. Add only the minimum tags needed for discovery, including the correct
   `stage:*` tag and a single `writer:*` tag.
9. Keep the body concise and procedural; move detailed reference material into
   `references/` only when needed.
10. Distinguish durable source from projection:
    mdkg/SPEC/SKILL is source; `.codex/agents`, future runtime manifests, and
    protocol resources are projections.
11. Add validation checks and closeout evidence to every authored or revised
    SKILL/SPEC.
12. If input is incomplete, create repair tasks instead of guessing.
13. Validate the new or updated skill with `mdkg skill validate <slug>`.
14. If the skill changes the public workflow, update `AGENT_START.md`,
    `CLI_COMMAND_MATRIX.md`, root onboarding docs, and the skill registry in the
    same pass.
15. When mirrored product-specific skill folders are enabled, run
    `mdkg skill sync` after broad manual changes so `.agents/skills/` and
    `.claude/skills/` stay current.

## Outputs

- One valid `SKILL.md` using the mdkg canonical section shape
- One valid `SPEC.md` when the work is a durable capability, agent, project,
  tool, runtime, API, model, or integration contract
- Any needed `references/`, `assets/`, or opt-in `scripts/` scaffolding
- Updated docs and registry entries when the workflow surface changed
- Repair tasks for weak, missing, ambiguous, projection-only, or unsafe input
- Validation and closeout evidence sufficient for a future agent to trust the
  asset

## Required Capabilities

- mdkg skill discovery
- mdkg capability discovery
- Markdown frontmatter and body authoring
- source/projection boundary review
- validation and closeout evidence review

## Resources Touched

- `.mdkg/skills/<slug>/SKILL.md`
- `.mdkg/templates/skills/`
- `.mdkg/templates/specs/`
- relevant `SPEC.md` nodes or template files
- `.agents/skills/` and `.claude/skills/` only through `mdkg skill sync`

## Validation Checks

- `mdkg skill validate <slug>`
- `mdkg capability search "<skill or spec concept>" --json`
- `mdkg validate`
- Template coverage check when template files are changed
- Projection validation report when `.codex/agents` or another projection
  target is involved

## Closeout Evidence

- Changed skill or SPEC paths
- Checks run and results
- Related mdkg nodes
- Projection targets reviewed
- Repair tasks created for incomplete inputs
- Explicit note that no generator/exporter was implemented unless selected work
  asked for it

## Safety Rules

- Do not create skills for one-off tasks or vague advice.
- Prefer repo truth over chat memory when deciding the skill body and examples.
- Do not add `scripts/` unless instructions are insufficient and deterministic execution really needs them.
- Only the durable writer stage should commit the new or updated skill.
- mdkg indexes and discovers skills, but does not execute skill scripts.
- Do not treat `.codex/agents`, future runtime manifests, or package exports as
  durable source of truth.
- Do not export secrets, provider credentials, raw auth state, production
  controls, wallet/ledger state, or local-only user paths into templates or
  projections.
- Do not create a skill-factory-agent until SKILL/SPEC templates and projection
  doctrine are stable.
- Draft `omni://` fields are optional future-facing hints, not finalized
  OmniTx semantics.

## Failure Handling

- If the trigger or writer role is unclear, stop and resolve that before authoring the skill.
- If multiple skills overlap, merge or narrow them instead of creating redundant procedures.
- If the workflow still feels too broad, split it into smaller skills before finalizing.
- If durable behavior exists only in a projection file, create or update a SPEC
  and record projection repair work.
- If a requested template family is missing, propose a template backlog task
  before inventing a one-off shape.
- If validation cannot run, record the exact blocker and keep the work open.

## Related SPECs

- Future `agent.*` SPECs for Codex and OmniRuntime agents
- Future capability, tool, model, runtime image, integration, and API SPECs
- Root/child project SPECs discovered through mdkg capability search

## Projection Targets

- `.codex/agents` TOML
- future OmniRuntime agent manifests
- future OmniTx resource/capability objects
- future OmniPL definitions

## Open Questions

- Which SPEC template families should be promoted into public seeded assets
  first?
- Which projection fields should be generated versus manually maintained?
- What validation command should become the canonical SPEC template coverage
  check?
