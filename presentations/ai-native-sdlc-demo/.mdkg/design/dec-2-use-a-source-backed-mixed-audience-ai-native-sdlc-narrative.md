---
id: dec-2
type: dec
title: Use a source-backed mixed-audience AI-native SDLC narrative
status: accepted
tags: [presentation, narrative, claims, audience]
owners: [program-orchestrator]
links: [https://github.com/nickreames/mdkg/issues]
artifacts: [deck/citations/claim-matrix.md]
relates: []
refs: [prd-1, edd-1]
aliases: [ai-native-sdlc-narrative]
created: 2026-07-26
updated: 2026-07-26
---

# Context

The audience includes engineers and management, but the story should also serve individual builders and personal projects. Capability history must support the context-engineering argument without becoming a product chronology.

# Decision

Use Autocomplete (GitHub Copilot) -> Prompt engineering (conversational generate, explain, and refine) -> Reasoning (OpenAI o1) -> Tool-using agents (Claude Code, Cursor, and comparable harnesses) -> Conditional context (Agent Skills and `SKILL.md`) -> Long-horizon goal-driven agents (primary-source multi-hour evidence, including an 8+ hour claim only when directly supported). For every era, explain the capability shift, unit of work, human role, and remaining context constraint.

Use primary sources for dated and capability claims. Explain how model capability, reasoning effort, tool harnesses, and context length improve while context engineering remains necessary. Explain mdkg through spec-driven design, explicit requirements, architecture decisions, guardrails, Plan -> Work -> Evidence, and what completed, why, and what comes next. Ground the creator story in freeing attention for architecture and planning. Position mdkg as public alpha and pre-v1 with active improvements underway, without promising unreleased behavior. Close with: Try mdkg on one real project and send me feedback.

# Alternatives Considered

- Enterprise governance first: rejected because it narrows the product story.
- A CLI feature tour: rejected because it hides the SDLC problem.
- Conversational coding as the era title: considered, but Prompt engineering is selected.

# Consequences

Goal 3 maintains the claim matrix and visual QA. The reveal presents source and specialized goals as reusable versus executed specifications without teaching graph mechanics.

# Links / references

- prd-1
- edd-1
