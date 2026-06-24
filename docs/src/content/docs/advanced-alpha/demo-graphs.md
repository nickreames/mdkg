---
title: Demo Graphs
description: Plan reusable mdkg demo templates without turning demos into production launch state.
---

Demo graphs are useful for showing how an agent can start from a goal, read repo-local skills, build context, execute work, and record evidence.

They should be small, deterministic, and explicit about boundaries.

## Recommended shape

- one ambitious umbrella goal
- one or more epics
- direct task and test nodes
- checkpoint requirements
- a short `AGENT_START.md`
- focused `.mdkg/skills/`
- no raw secrets, prompts, provider payloads, or credentials

## Template import

Use graph movement commands to copy a demo graph into a fresh repo or import a template into an existing repo with id rewrite.

```bash
mdkg graph import-template ./examples/template-mdkg-dev --start-goal goal-1 --select-goal --dry-run --json
```

Preview deployments and demo subdomains are separate launch work. A demo graph can describe those steps, but it should not store deployment tokens or turn a preview into production.

## Live demo policy

- Preview URLs are disposable review surfaces.
- Durable `demo-N.mdkg.dev` subdomains require explicit promotion.
- Canonical `mdkg.dev` should remain stable for SEO.
- Demo state should stay reviewable through mdkg checkpoints and git commits.
