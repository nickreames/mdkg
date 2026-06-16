---
id: spike-4
type: spike
title: research mdkg.dev SEO positioning and AI search readiness
status: done
priority: 2
epic: epic-79
parent: goal-15
tags: [mdkg-dev, seo, positioning, ai-search, spike]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-15
updated: 2026-06-15
---
# Research Question

How should `mdkg.dev` position mdkg for search and AI-assisted discovery while
staying accurate, specific, and useful to developers?

# Context And Constraints

- mdkg is a CLI for deterministic project memory, graph-backed planning,
  context packs, local project DB queues/snapshots, SPEC/WORK mirrors, and
  subgraph orchestration.
- We should not market deferred features as shipped. Worker execution and public
  internal DB event/reducer/lease/materializer CLI remain out of scope.
- Public pages should optimize for user usefulness and command accuracy, not
  keyword stuffing.

# Search Plan

- Review Google Search Central SEO Starter Guide and generative AI search
  guidance.
- Review mdkg README, CHANGELOG, command matrix, and generated command contract
  for positioning claims that are already true.

# Findings

- Google's current guidance still centers useful, people-first, technically
  crawlable content. AI search visibility depends on the same foundations plus
  distinctive, non-commodity content.
- mdkg has a credible differentiated position: deterministic local project
  memory for humans and AI agents, with graph nodes, packs, skills, receipts,
  local queues, and subgraphs.
- Best landing-page claim: "local-first project memory and planning CLI for
  AI-assisted software work." Avoid broad "AI project management" positioning
  because it overpromises workflow automation.
- SEO pages should map to real outcomes and concepts, not arbitrary keyword
  variants.

# Options And Tradeoffs

- Broad AI-agent SEO: may attract traffic but risks unqualified expectations.
- Narrow CLI docs positioning: accurate but may under-explain why mdkg matters.
- Outcome-specific positioning: best balance. Lead with concrete jobs and then
  explain the architecture.

# Recommendation

Position mdkg.dev around verified outcomes:

- "Keep project memory deterministic and reviewable."
- "Give AI agents graph-backed context without a hosted control plane."
- "Plan with goals, tasks, tests, and research spikes."
- "Pack exactly the context needed for another agent or human."
- "Coordinate local project DB queues and snapshots without public hosted
  infrastructure."
- "Adopt mdkg in existing repos with dry-run upgrade receipts."

Use descriptive URLs such as `/guides/first-graph`, `/guides/research-spikes`,
`/reference/commands`, `/concepts/project-db-queue`, and `/trust/local-first`.

# Follow-Up Nodes To Create

- `task-357`: require a positioning matrix with audience, job, proof, page,
  query intent, and launch readiness.
- `task-362`: add launch-page structured-data and sitemap checks.
- `test-148`: make public examples the proof behind SEO landing claims.
- `task-370` and `test-157`: connect search claims to generated docs, examples,
  and spike evidence.

# Skill Candidates

- Search-backed positioning spike skill for turning verified CLI capability into
  page titles, descriptions, and proof points.
- SEO claim audit skill to reject claims not backed by local command docs or
  smoke evidence.

# Data Structures And Algorithms Notes

- Content architecture should store claim-to-proof edges: `claim_id`,
  `capability_refs`, `command_refs`, `smoke_refs`, `docs_page`, and
  `launch_status`.
- Page generation should emit canonical slugs from stable page ids, not titles.

# UX Notes

- Top navigation should speak in user jobs: Start, Guides, Reference, Trust,
  Examples, Upgrade.
- Search snippets need specific nouns: "mdkg", "project memory", "context
  pack", "research spike", "local queue", "subgraph".

# Security Notes

- Avoid SEO pages that imply mdkg stores secrets, controls infrastructure, or
  runs code remotely.
- AI-search content must not encourage scaled duplicated pages.

# mdkg.dev Launch Implications

- Launch copy should wait until `task-357` maps every claim to proof.
- A small number of high-quality, original pages is better than a large
  keyword-expanded site.

# Evidence And Sources

- Local evidence: README, CHANGELOG, `CLI_COMMAND_MATRIX.md`,
  `dist/command-contract.json`, smoke scripts.
- Google Search Central SEO Starter Guide:
  https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google Search Central generative AI optimization guide:
  https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google structured data docs:
  https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
