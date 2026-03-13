---
name: author-mdkg-skill
description: Create or update an mdkg skill when a repeatable repo workflow should be codified or an existing skill has drifted from the current command surface for humans and AI agents.
tags: [stage:plan, writer:orchestrator, mdkg, skills, authoring]
version: 0.1.0
authors: [mdkg]
links: [AGENT_START.md, CLI_COMMAND_MATRIX.md, .mdkg/design/edd-5-mdkg-skills-integration-guide-v0-4-agent-skills-standard-and-packs.md]
---

# Goal

Create or update a focused mdkg skill that teaches a repeatable workflow without adding avoidable context or duplicated procedures.

## When To Use

- When a repo workflow is repeated often enough to deserve a reusable skill
- When an existing skill no longer matches the current command surface or docs
- When a builder asks to codify a procedure for future humans or agents

## Inputs

- Repo root
- Workflow trigger and desired outcome
- Any existing related skills, docs, or command references

## Steps

1. Check for an existing fit first with `mdkg skill list`, `mdkg skill search`, and `mdkg skill show <slug>`.
2. If an existing skill already covers the workflow, update it instead of creating a near-duplicate.
3. If the workflow is really task mutation or event provenance, prefer teaching `mdkg task ...` and `mdkg event ...` for structured fields while still allowing markdown narrative edits where they fit better.
4. If a new skill is justified, scaffold it with `mdkg skill new <slug> "<name>" --description "..."`.
5. Write the description so it says both what the skill does and when to use it.
6. Add only the minimum tags needed for discovery, including the correct `stage:*` tag and a single `writer:*` tag.
7. Keep the body concise and procedural; move detailed reference material into `references/` only when needed.
8. Validate the new or updated skill with `mdkg skill validate <slug>`.
9. If the skill changes the public workflow, update `AGENT_START.md`, `CLI_COMMAND_MATRIX.md`, root onboarding docs, and the skill registry in the same pass.
10. When mirrored product-specific skill folders are enabled, run `mdkg skill sync` after broad manual changes so `.agents/skills/` and `.claude/skills/` stay current.

## Outputs

- One valid `SKILL.md` using the mdkg canonical section shape
- Any needed `references/`, `assets/`, or opt-in `scripts/` scaffolding
- Updated docs and registry entries when the workflow surface changed

## Safety

- Do not create skills for one-off tasks or vague advice.
- Prefer repo truth over chat memory when deciding the skill body and examples.
- Do not add `scripts/` unless instructions are insufficient and deterministic execution really needs them.
- Only the durable writer stage should commit the new or updated skill.
- mdkg indexes and discovers skills, but does not execute skill scripts.

## Failure Handling

- If the trigger or writer role is unclear, stop and resolve that before authoring the skill.
- If multiple skills overlap, merge or narrow them instead of creating redundant procedures.
- If the workflow still feels too broad, split it into smaller skills before finalizing.
