---
id: epic-14
type: epic
title: 0.0.5 generic agent bootstrap and product specific skill onboarding
status: done
priority: 1
tags: [0_0_5, agent, bootstrap, skills, ux]
owners: []
links: []
artifacts: [src/commands/init.ts, src/commands/skill.ts, src/commands/skill_mirror.ts, src/commands/validate.ts, AGENT_START.md, README.md, CLI_COMMAND_MATRIX.md]
relates: [dec-16, dec-17, dec-18, epic-15]
blocked_by: []
blocks: [task-93, task-94, task-95, task-96, task-97, task-98, task-99, test-51, test-52, test-53, test-54, test-55]
refs: []
aliases: [agent-bootstrap, product-skill-onboarding]
skills: []
created: 2026-03-10
updated: 2026-03-10
---

# Goal

Make mdkg immediately legible to generic AI agents and mirror canonical project skills into the product-specific locations those agents already scan.

# Scope

- hard rename `init --omni` to `init --agent`
- shared `AGENT_START.md` startup guidance and wrapper docs
- append-focused `.agents/skills/` and `.claude/skills/` mirrors
- `mdkg skill sync` and validate-time mirror drift warnings
- AI-agent language across current docs and internal skills

# Milestones

- M1: generic agent bootstrap flag and docs shipped
- M2: shared startup artifact and wrapper docs shipped
- M3: product-specific skill mirrors and sync shipped
- M4: internal skill guidance aligned to the new startup flow

# Out of Scope

- automatic agent-provider metadata files beyond mirrored skills
- generic node mutation surface
- structured output formats beyond JSON

# Risks

- startup docs can drift from live help if not kept under explicit parity checks
- product-specific mirror directories can become destructive if sync is not conflict-safe

# Links / Artifacts

- `dec-16`
- `dec-17`
- `dec-18`
