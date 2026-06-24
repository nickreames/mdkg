---
title: Demo Graphs
description: Plan reusable mdkg demo templates without turning demos into production launch state.
---

Demo graphs are useful for showing how an agent can start from a goal, read repo-local skills, build context, execute work, and record evidence.

They should be small, deterministic, and explicit about boundaries.

## First-success path

The repo includes `examples/demo-agentic-coding` as a small deterministic demo graph. It is not a public deployment proof. It is a local graph fixture that shows the first mdkg success path.

From `examples/demo-agentic-coding`, run:

```bash
mdkg validate --json
mdkg goal next goal-1 --json
mdkg show spike-1 --json
mdkg pack spike-1 --profile concise --dry-run --stats
mdkg show dec-1 --json
mdkg show chk-1 --json
mdkg capability search "pack" --kind skill --json
```

Expected results:

- Validation returns `ok: true`.
- Goal routing returns `spike-1` first.
- The pack dry-run includes the spike, task, and test nodes.
- The decision states that production promotion is out of scope.
- The checkpoint records accepted seed evidence.
- Capability search finds the pack-first skill.

Use returned IDs from the command receipts in real repos. Do not hardcode numeric IDs unless you are working in this demo fixture.

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
