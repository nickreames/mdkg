---
id: dec-16
type: dec
title: 0.0.5 init agent rename and generic agent language
status: accepted
tags: [0_0_5, agent, bootstrap, cli]
owners: []
links: []
artifacts: [src/cli.ts, src/commands/init.ts, README.md, AGENT_START.md]
relates: [dec-15, dec-17, dec-18, epic-14, epic-15]
refs: []
aliases: [init-agent-rename, generic-agent-language]
created: 2026-03-10
updated: 2026-03-10
---

# Context

`0.0.4` published a product-specific `--omni` bootstrap flag. That was acceptable pre-publish, but it is the wrong long-term UX for a generic OSS CLI whose core audience is humans plus many different AI agents.

# Decision

- Replace `mdkg init --omni` with `mdkg init --agent` as the only supported agent bootstrap flag.
- Generalize current docs, startup artifacts, and internal skills to talk about AI agents rather than Omni-specific behavior.
- Keep `--agent` independent from `--llm`.
- Treat historical `0.0.4` planning records that mention Omni as historical artifacts, not current runtime guidance.

# Alternatives considered

- Keep `--omni` indefinitely: rejected because it makes the published CLI feel tied to one external product.
- Keep both `--agent` and `--omni`: rejected because the package has negligible external usage and the extra compatibility surface is not worth the ongoing complexity.

# Consequences

- The current runtime and docs become product-neutral.
- Startup guidance can consistently talk about AI agents, Codex/OpenAI, Claude, and future orchestrators without pretending mdkg depends on a specific runtime.
- `0.0.5` becomes the release where generic agent bootstrap becomes the stable story.

# Links / references

- `dec-17`
- `dec-18`
- `epic-14`
