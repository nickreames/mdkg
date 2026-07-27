---
name: author-mdkg-skill
description: Create or update an mdkg SKILL.md or MANIFEST.md when a repeatable workflow, capability, agent, tool, runtime, API, or projection contract should become durable mdkg-authored knowledge.
tags: [stage:plan, writer:orchestrator, mdkg, skills, authoring]
version: 0.2.0
authors: [mdkg]
links: [AGENT_START.md, CLI_COMMAND_MATRIX.md, .mdkg/design/edd-5-mdkg-skills-integration-guide-v0-4-agent-skills-standard-and-packs.md]
---

# Goal

Create or update focused mdkg-authored SKILL.md and MANIFEST.md assets that make
repeatable workflows and durable capabilities explicit without creating
duplicated procedures or projection-only behavior.

## When To Use

- When a repo workflow is repeated often enough to deserve a reusable skill
- When an existing skill no longer matches the current command surface or docs
- When a builder asks to codify a procedure for future humans or agents
- When a capability, agent, tool, runtime image, API, model, or integration
  needs a durable MANIFEST before it is projected into a runtime-specific config
- When `.codex/agents` or another projection surface contains behavior that
  should be mirrored into durable mdkg/MANIFEST/SKILL state

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
- Related manifests
- Projection targets
- Open questions

For MANIFEST.md output, include:

- Identity
- Purpose
- Scope
- Non-goals
- Status
- Owners
- Source mdkg nodes
- Resource URIs
- Capabilities
- Contract profile, validation policy refs, and evidence policy refs when a
  downstream runtime or workflow profile needs generic semantic mirrors
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
3. If a manifest already covers the capability, update that MANIFEST or create a
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
    mdkg/MANIFEST/SKILL is source; `.codex/agents`, future runtime manifests, and
    protocol resources are projections.
11. Treat contract-profile fields as generic mdkg validation mirrors only.
    Downstream runtimes own execution semantics, queue state, provider state, and
    final receipt authority.
12. Add validation checks and closeout evidence to every authored or revised
    SKILL/MANIFEST.
13. If input is incomplete, create repair tasks instead of guessing.
14. Validate the new or updated skill with `mdkg skill validate <slug>`.
15. If the skill changes the public workflow, update `AGENT_START.md`,
    `CLI_COMMAND_MATRIX.md`, root onboarding docs, and the skill registry in the
    same pass.
16. When mirrored skill folders are enabled, run `mdkg skill sync` after broad
    manual changes so every configured `.mdkg/config.json`
    `customization.skill_mirrors.targets` path stays current. The default
    targets are `.agents/skills/` and `.claude/skills/`; other agent-local
    skill roots may be configured by the repo.

## Outputs

- One valid `SKILL.md` using the mdkg canonical section shape
- One valid `MANIFEST.md` when the work is a durable capability, agent, project,
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
- relevant `MANIFEST.md` nodes or template files, with legacy `SPEC.md`
  references retained only for compatibility
- configured mirrored skill roots only through `mdkg skill sync`

## Validation Checks

- `mdkg skill validate <slug>`
- `mdkg skill sync --json` when mirror targets are present
- `mdkg capability search "<skill or manifest concept>" --json`
- `mdkg validate --changed-only --json`
- `mdkg validate`
- Template coverage check when template files are changed
- Projection validation report when `.codex/agents` or another projection
  target is involved

## Closeout Evidence

- Changed skill or MANIFEST paths
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
- Do not create new `SPEC.md` capability docs; use `MANIFEST.md`. Keep legacy
  `SPEC.md` references only when documenting compatibility or migration repair.
- Do not export secrets, provider credentials, raw auth state, production
  controls, wallet/ledger state, or local-only user paths into templates or
  projections.
- Do not create a skill-factory-agent until SKILL/MANIFEST templates and projection
  doctrine are stable.
- Optional `draft_uri` fields are future-facing hints, not finalized protocol
  semantics. Use generic examples such as `capability://repo.inspect` or
  `mdkg://capability/repo.inspect` in canonical mdkg templates.
- Do not use downstream product names or product-specific URI schemes as public
  mdkg template examples.

## Failure Handling

- If the trigger or writer role is unclear, stop and resolve that before authoring the skill.
- If multiple skills overlap, merge or narrow them instead of creating redundant procedures.
- If the workflow still feels too broad, split it into smaller skills before finalizing.
- If durable behavior exists only in a projection file, create or update a MANIFEST
  and record projection repair work.
- If a requested template family is missing, propose a template backlog task
  before inventing a one-off shape.
- If validation cannot run, record the exact blocker and keep the work open.

## Related Manifests

- Future `agent.*` manifests for Codex and runtime agents
- Future capability, tool, model, runtime image, integration, and API manifests
- Root/child project manifests discovered through mdkg capability search

## Projection Targets

- `.codex/agents` TOML
- future runtime agent manifests
- future workflow/runtime protocol resource and capability objects
- future workflow/runtime protocol definitions

## Open Questions

- Which MANIFEST template families should be promoted into public seeded assets
  first?
- Which projection fields should be generated versus manually maintained?
- What validation command should become the canonical MANIFEST template coverage
  check?
