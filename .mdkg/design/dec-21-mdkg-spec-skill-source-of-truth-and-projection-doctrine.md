---
id: dec-21
type: dec
title: mdkg SPEC SKILL source of truth and projection doctrine
status: accepted
tags: [spec, skill, projection, doctrine, capability-authoring]
owners: []
links: []
artifacts: []
relates: [epic-39, edd-14]
refs: [edd-5, edd-7, dec-12, dec-18]
aliases: [spec-skill-source-of-truth, durable-capability-authoring-doctrine]
created: 2026-06-04
updated: 2026-06-04
---
# Context

Omni needs durable capability, agent, tool, API, runtime, and integration
authoring standards that can outlive a single runtime or product-specific agent
configuration surface.

# Decision

mdkg graph nodes, `SPEC.md`, and `SKILL.md` are the durable source for Omni
capability authoring. Product-specific files such as `.codex/agents` are
projection/export surfaces and must be traceable back to durable mdkg/SPEC/SKILL
sources.

# Alternatives considered

- Treat `.codex/agents` as canonical. Rejected because Codex projection formats
  can evolve and are runtime-specific.
- Build a generator first. Rejected because templates and standards are not yet
  stable enough.

# Consequences

- Durable capability details must not exist only in projection files.
- Future exporters must preserve source links and drift evidence.
- The first pass hardens Markdown standards and the existing
  `author-mdkg-skill` before building a factory agent.

# Links / references

- `edd-14`
- `dec-22`
