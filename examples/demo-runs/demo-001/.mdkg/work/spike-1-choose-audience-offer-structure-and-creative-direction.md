---
id: spike-1
type: spike
title: choose audience offer structure and creative direction
status: done
priority: 1
epic: epic-1
parent: goal-1
tags: [demo, creative-production, website, strategy]
owners: []
links: []
artifacts: [CREATIVE_PRODUCTION_INTAKE.md, DESIGN.md, DEMO_RUN_RECEIPT.md]
relates: [task-1, test-1, dec-1, dec-2, edd-1]
blocked_by: []
blocks: [task-1, test-1]
refs: []
context_refs: [edd-1, dec-1, dec-2]
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-06-29
updated: 2026-06-29
---
# Research Question

What audience, offer, page structure, interaction model, and creative direction
should this demo run use while preserving the Ocean Flow design system and
source-backed mdkg claims?

# Context And Constraints

- Start from the current `goal-1` and this graph only.
- Use `DESIGN.md` as the visual baseline.
- Use `CREATIVE_PRODUCTION_INTAKE.md` when Creative Production is available.
- Use Astro plus React Islands for the eventual implementation.
- Creative Production may propose differentiated structure, animation, visuals,
  and interaction ideas.
- Do not store secrets, raw prompt transcripts, provider payloads, credentials,
  or private repo context.
- Do not deploy, push, change DNS, activate analytics, or promote durable
  hosting from this template.

# Search Plan

- Read `WEBSITE_DEMO_TEMPLATE_BRIEF.md`.
- Read `DESIGN.md`.
- Read `CREATIVE_PRODUCTION_INTAKE.md`.
- Inspect `dec-1`, `dec-2`, and `edd-1`.
- Use Creative Production when available to explore visual direction; otherwise
  write a concise local creative direction in the spike findings.
- Record audience, offer, page structure, visual territory, motion/interaction
  ideas, React Island candidates, asset plan, source-backed content facts,
  explicit non-goals, and risks for `test-1`.

# Findings

Selected direction: `Agent-ready demo websites from one mdkg goal`.

- audience: engineering and product teams evaluating mdkg as a repeatable AI
  coding-agent workflow.
- offer: show how a forked mdkg graph can become a local website candidate
  without losing goal routing, evidence, safety, or preview approval boundaries.
- page structure: hero with graph-map visual, workflow section, interactive
  React Island console, public-safety section, and local-first closeout CTA.
- visual territory: Ocean Flow palette with white surfaces, ink typography,
  teal/blue gradients, and small citrine/coral accents for state contrast.
- motion and interaction: a focused React Island lets reviewers switch between
  Select, Shape, Build, and Verify stages.
- asset plan: use a public-safe SVG graph map that represents actual mdkg demo
  state instead of stock imagery.
- source-backed content facts: `goal next`, `pack --profile concise`,
  validation, no-secret checks, and Vercel approval boundaries.
- explicit non-goals: no Vercel deploy, DNS, analytics, push, tag, npm publish,
  or durable `demo-N.mdkg.dev` hosting.
- risks for `test-1`: dependency install, local build, responsive layout,
  console health, and no unsupported public claims.

# Options And Tradeoffs

- Full mdkg.dev clone: rejected because the demo should prove differentiated
  website generation.
- Abstract portfolio page: rejected because it would not show mdkg-specific
  graph behavior.
- Agent-ready launch room: accepted because it exposes the goal/run workflow
  and keeps source-backed claims inspectable.

# Recommendation

Build the `Agent-ready demo websites from one mdkg goal` site with Astro static
structure and one React Island for the run console. Keep the result local-first
until Browser/Chrome proof and explicit Vercel preview approval exist.

# Follow-Up Nodes To Create

- Use existing `task-1` for implementation unless research proves the template
  needs extra work nodes.

# Skill Candidates

- `select-work-and-ground-context`
- `verify-close-and-checkpoint`
- `creative-production:explore`

# Data Structures And Algorithms Notes

Pending.

# UX Notes

The first viewport should clearly show the literal offer and a visual graph map.
The interactive console should be useful but bounded: it explains run stages and
commands without becoming a full dashboard.

# Security Notes

Never retain secrets, raw prompts, provider payloads, or private context in the
template graph, generated website, or checkpoints.

# mdkg.dev Launch Implications

Preview and promotion decisions happen in the parent mdkg repo goals, not in
this template by default.

# Evidence And Sources

- `DESIGN.md`
- `CREATIVE_PRODUCTION_INTAKE.md`
- `DEMO_HANDOFF_PROMPT.md`
- `DEMO_RUN_RECEIPT.md`
