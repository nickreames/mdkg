---
id: spike-1
type: spike
title: research mdkg.dev information architecture and generated command docs
status: done
priority: 2
epic: epic-78
parent: goal-15
tags: [mdkg-dev, ia, generated-docs, spike]
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

What information architecture should `mdkg.dev` use so the public docs are
generated where possible, outcome-oriented where useful, and always grounded in
verified CLI behavior?

# Context And Constraints

- `mdkg.dev` must not become a marketing-only site. Public docs should derive
  command facts from `dist/command-contract.json`, `CLI_COMMAND_MATRIX.md`, and
  tested examples.
- Website implementation is out of scope for `goal-14`; this spike feeds paused
  `goal-15` and the later `task-354` IA work.
- Public docs must preserve release boundaries: no worker execution docs, no
  public internal event/reducer/lease/materializer CLI docs, and no unverified
  automation claims.

# Search Plan

- Review mdkg generated command contract, command docs smoke, README, and
  command matrix.
- Use Diataxis for docs mode separation.
- Use Google Search Central guidance on logical site organization, helpful
  content, and crawlable technical structure.

# Findings

- Docs need four distinct surfaces: learning/tutorial paths, task-oriented
  how-to guides, explanation pages, and generated reference. Mixing these into
  one command catalog makes the site harder to scan and harder to keep correct.
- mdkg already has a command metadata source of truth. The command reference
  should be generated from that source, then supplemented with hand-authored
  explanations only when the generated contract cannot express intent.
- The first IA should be organized around jobs users actually run:
  initialize a repo, inspect graph state, plan with goals/spikes, package
  context, use SPEC/WORK, run local DB queues/snapshots, and coordinate
  subgraphs.
- Search discovery should rely on clear page structure, descriptive URLs,
  crawlable content, and helpful original examples rather than broad keyword
  pages.

# Options And Tradeoffs

- Reference-first: easiest to generate and keep current, but weak for new users
  who need a task path before a command catalog.
- Guide-first: better for adoption, but higher drift risk unless every example
  is backed by smoke tests.
- Capability-map IA: strongest long-term framing for agents and humans, but
  needs careful copy so it does not hide common CLI workflows.

# Recommendation

Use a hybrid IA:

- Start: install, initialize, validate, and create first task/spike.
- Guides: outcome workflows grouped by operator job.
- Reference: generated command docs from mdkg-native command contract.
- Concepts: graph nodes, packs, skills, SPEC/WORK, project DB, subgraphs.
- Trust: local-first storage, no-secret policy, dry-run boundaries, subgraph
  safety.
- Examples: temp-repo validated workflows with command transcripts.
- Upgrade: dry-run-first adoption for existing repos.

`task-354` should turn this into a page map and decide generated versus
hand-authored ownership per page.

# Follow-Up Nodes To Create

- `task-354`: consume `spike-1` as required IA evidence.
- `task-370`: create the source-backed page evidence matrix.
- `test-157`: require public pages and command reference claims to identify
  generated source or proof evidence.

# Skill Candidates

- Research-to-docs IA skill: turn spike findings plus command metadata into a
  page map without starting implementation.
- Docs evidence matrix skill: record generated source, tested example, and
  owner for each public page.

# Data Structures And Algorithms Notes

- Recommended generated data shape: `page_id`, `source_kind`, `source_hash`,
  `command_ids`, `workflow_ids`, `example_smoke`, `visibility`, `danger_level`,
  `last_verified`.
- Command-reference generation should group commands by namespace and mutation
  policy, not alphabetically only.

# UX Notes

- The first screen should answer "what job can I do now?" before exposing a
  full CLI matrix.
- Reference pages need terse command syntax, examples, JSON/dry-run notes,
  mutation policy, and links back to outcome guides.

# Security Notes

- Generated docs should fail closed for hidden/internal command surfaces.
- Public pages must not include local absolute paths from smoke tests except in
  intentionally redacted/example form.

# mdkg.dev Launch Implications

- `mdkg.dev` launch should be blocked until generated command docs and at least
  one validated outcome guide are both present.
- IA should make deferred capabilities explicit, especially worker execution and
  internal DB helper surfaces.

# Evidence And Sources

- Local evidence: `dist/command-contract.json`, `CLI_COMMAND_MATRIX.md`,
  `scripts/smoke-command-docs.js`, `task-354`, `goal-15`.
- Diataxis documentation framework: https://diataxis.fr/
- Google Search Central SEO Starter Guide:
  https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google helpful content guidance:
  https://developers.google.com/search/docs/fundamentals/creating-helpful-content
