---
tags: [mdkg-dev, public-alpha, positioning, origin-story]
owners: []
links: []
artifacts: [mdkg_planning_docs.zip]
relates: []
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
aliases: []
created: 2026-06-22
updated: 2026-06-22
id: prd-4
type: prd
title: mdkg.dev public alpha product positioning and origin story
---
# Problem

mdkg has strong CLI and agent-memory capabilities, but public users need a coherent product story that explains why deterministic Markdown graph memory matters and how it differs from ad hoc prompts, vector-only recall, and raw execution traces.

# Goals

- Position mdkg as local-first durable semantic memory for humans and coding agents.
- Explain the origin story through practical SDLC friction: goals, tasks, tests, design decisions, checkpoints, skills, and receipts need durable refs.
- Connect public messaging to shipped capabilities and explicit safety boundaries.
- Make mdkg.dev useful for both humans and LLM agents.

# Non-goals

- Do not claim hosted SaaS behavior.
- Do not claim autonomous worker execution.
- Do not publish private graph content as marketing copy.

# Requirements

- Homepage and guide copy must anchor claims in shipped CLI surfaces.
- Install/quickstart path must get users to a valid graph and first goal quickly.
- Origin story must emphasize deterministic refs, graph validation, packs, and checkpoint evidence.
- LLM-facing docs must be concise, source-backed, and safe to quote.

# Acceptance Criteria

- Goal 2 can author homepage/origin/quickstart copy from this PRD without rereading the raw planning bundle.
- Public copy states what mdkg is and is not.
- Deferred capabilities are named as deferred, not implied as shipped.

# Metrics / Success

- A new user understands the core value within the first page.
- An agent can use the docs to initialize, validate, and work a goal.
- Marketing claims map to command references or design records.

# Risks

- Over-positioning could imply hosted runtime or execution features that mdkg deliberately does not own.
- Too much graph terminology could obscure the first-use path.

# Open Questions

- Which public examples best demonstrate value without leaking private repo details?
- What exact public-alpha label should be used at launch?
