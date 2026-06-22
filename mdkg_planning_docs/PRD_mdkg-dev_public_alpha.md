---
title: mdkg.dev Public Alpha PRD
status: planning snapshot
date: 2026-06-22
owner: Nicholas Reames
product: Markdown Knowledge Graph / mdkg.dev
---

# mdkg.dev Public Alpha PRD

## 1. Purpose

`mdkg.dev` is the public product surface for Markdown Knowledge Graph. Its first job is to help developers understand, install, test, and trust Markdown Knowledge Graph quickly.

The site should not try to explain the entire command surface at once. It should teach the golden path first: repo-native project memory, deterministic context packs, structured goals/tasks/checkpoints, agent handoffs, and validation. Advanced orchestration features should be discoverable through docs but not allowed to muddy the first impression.

The public launch should make this idea immediately legible:

> Markdown Knowledge Graph is git-native project memory for AI-native software engineering.

Expanded:

> Markdown Knowledge Graph turns structured Markdown in a repo into deterministic context packs, goals, checkpoints, skills, and handoffs for humans, AI agents, and human-agent teams.

## 2. Product context

Markdown Knowledge Graph is a local-first CLI for turning structured Markdown in a git repo into deterministic project memory. It is intentionally repo-native and boring:

- Markdown and frontmatter are the durable source of truth.
- Git provides reviewability, history, branching, and collaboration.
- Generated indexes are rebuildable.
- SQLite is local infrastructure where useful, not hidden product state.
- No daemon, hosted index, vector database, or hidden cloud memory is required.
- The tool does not execute work automatically.
- Its job is to make state, context, capabilities, evidence, and handoffs durable, inspectable, and safe to reuse.

`mdkg.dev` should reflect that philosophy. The site itself should be static, crawlable, fast, and generated from repo-owned sources where possible.

## 3. Launch positioning

### Primary headline

> Git-native project memory for AI-native software engineering.

### Primary subheadline

> Markdown Knowledge Graph turns structured Markdown in your repo into deterministic context packs, goals, checkpoints, skills, and handoffs for humans and AI agents — without a daemon, hosted index, vector database, or hidden cloud state.

### Secondary positioning lines

- Give AI coding agents a repo-native source of truth.
- Stop re-explaining your project to every new AI coding session.
- Keep goals, decisions, architecture, tasks, evidence, and handoffs in Git.
- Markdown stays authoritative. Local indexes are rebuildable.
- Built for humans, AI agents, and human-agent teams.

### Terminology

Use **Markdown Knowledge Graph** for public readability. Use **mdkg** for the package name, CLI commands, repo names, and technical references.

Preferred pattern:

> Markdown Knowledge Graph (`mdkg`) is git-native project memory for AI-native software engineering.

## 4. Public alpha contract

Use **developer preview** and **pre-v1 public alpha** rather than beta.

Recommended copy:

> Markdown Knowledge Graph is a pre-v1 public alpha. It is usable today, but graph, cache, bundle, and database contracts may change before v1. Markdown files in your repo remain the durable source of truth.

The alpha contract should be visible but not alarming. It should increase trust by being honest about the current state.

The alpha caveats should include:

- The package is usable but pre-v1.
- Graph/cache/bundle/database contracts can still change.
- Markdown remains authoritative.
- Generated indexes are rebuildable.
- Project DB and queue surfaces are advanced alpha infrastructure.
- mdkg does not execute work.
- Skills are discovered and mirrored, but mdkg does not execute skill scripts.
- MCP is read-only.
- Subgraphs are read-only planning context.
- Visibility filtering is metadata enforcement, not arbitrary body redaction.
- Handoff raw-marker warnings are not comprehensive secret scanning.

## 5. Target audiences

### Primary: AI-native software developers

Developers using tools such as terminal agents, Codex-style coding agents, Claude Code, Cursor, or other AI coding harnesses who need durable project memory across sessions.

Their questions:

- How do I stop agents from forgetting project goals?
- How do I keep context in the repo instead of hidden chat history?
- How do I give an agent enough context without dumping everything?
- How do I record what happened after an agent works?
- How do I validate graph state before continuing?

### Secondary: AI engineers and agent workflow builders

People building workflows around agents, skills, MCP, repo memory, orchestration, and multi-agent systems.

Their questions:

- Is there a deterministic project-memory substrate I can build on?
- Can agents inspect state without mutation permissions?
- Can I model handoffs, evidence, and checkpoints?
- Can this work across nested repos or subgraphs?
- Is this compatible with SKILL.md-style agent instruction patterns?

### Tertiary: founders, product builders, and future ochatr.ai users

People interested in AI-native software, long-term agent workflows, omni chat rooms, asynchronous work, and value-based AI application platforms.

Their questions:

- What is Nicholas building?
- Is Markdown Knowledge Graph part of a larger vision?
- Should I follow the project or join the ochatr.ai waitlist?

## 6. Primary user journeys

### Journey A: developer from social post

1. Sees X or LinkedIn post about AI agents losing project context.
2. Lands on `mdkg.dev`.
3. Understands the promise in under 10 seconds.
4. Copies install command or opens quickstart.
5. Views GitHub/npm.
6. Stars repo, tries CLI, or follows Nicholas.

### Journey B: conference QR / NFC contact

1. Meets Nicholas at AI Engineer World’s Fair.
2. Taps phone or scans QR to `nicholas-reames.com`.
3. Clicks Markdown Knowledge Graph.
4. Lands on `mdkg.dev`.
5. Sees concise product explanation and demo.
6. Opens GitHub/docs or joins ochatr.ai waitlist.

### Journey C: AI agent / crawler

1. Discovers `mdkg.dev/llms.txt`.
2. Reads product summary, quickstart, safety boundaries, docs links, and command contract references.
3. Uses generated command docs rather than stale prose.
4. Can instruct a coding agent how to use mdkg safely.

### Journey D: serious evaluator

1. Reads homepage.
2. Opens GitBook docs.
3. Reads quickstart, concepts, safety boundaries, and CLI reference.
4. Reviews public alpha caveats.
5. Tries demo repo.
6. Opens GitHub issues/discussions or contacts Nicholas.

## 7. Launch goals

The launch should optimize for clarity, trust, and adoption rather than completeness.

Primary goals:

- Make the core product promise immediately understandable.
- Provide a copy-paste quickstart that works.
- Drive GitHub stars, npm installs, and docs reads.
- Establish Markdown Knowledge Graph as a credible AI-native software engineering tool.
- Route interested users to Nicholas Reames, GitHub, X, LinkedIn, and ochatr.ai.
- Provide a professional docs surface through GitBook.
- Provide AI-agent-readable docs through `llms.txt`, generated references, and Markdown-friendly pages.
- Avoid overpromising advanced alpha surfaces.

## 8. Non-goals

For the initial mdkg.dev launch, do not:

- Build a full web app for editing mdkg graphs.
- Build a visual graph explorer.
- Build a custom documentation CMS.
- Explain every advanced command on the homepage.
- Market project DB queues as the primary product.
- Claim mdkg executes agent work.
- Claim mdkg is a comprehensive secret scanner or DLP product.
- Present ochatr.ai as the main launch product.
- Build a personal blog platform as a prerequisite.
- Require users to understand subgraphs, bundles, queues, or MCP before trying the golden path.

## 9. Core product story for homepage

The homepage should communicate this sequence:

1. AI coding agents lose the thread because context is often trapped in chat history, ad hoc prompts, and stale files.
2. Markdown Knowledge Graph puts durable project memory in the repo.
3. Markdown and frontmatter remain human-editable and agent-readable.
4. mdkg builds deterministic context packs for a goal/task/spike/test/bug/feature.
5. Humans or agents execute work using that context.
6. Work is recorded through checkpoints, evidence, and lifecycle state.
7. Validation catches broken graph state before teams continue.
8. Advanced users can explore skills, handoffs, read-only MCP, subgraphs, graph templates, archives, and optional queue workflows.

## 10. Required homepage sections

The launch homepage should include:

1. Hero with headline, subheadline, CTAs, and alpha trust line.
2. Quick install / quickstart snippet.
3. Problem section: agents lose goals, decisions, and evidence.
4. Core loop section.
5. Markdown + Git source-of-truth section.
6. Deterministic context packs section.
7. Goals/tasks/spikes/checkpoints section.
8. Work/context/evidence distinction section.
9. Handoff section.
10. Skills and SKILL.md-style agent workflow compatibility section.
11. Validation/status/doctor/fix trust gates section.
12. Advanced alpha preview.
13. About / origin footnote.
14. CTA footer with GitHub, npm, docs, X, LinkedIn, Nicholas site, and ochatr.ai.

## 11. Required documentation paths

`docs.mdkg.dev` should include at minimum:

- Quickstart
- Install and Node version requirements
- Core concepts
- Repository layout and what gets committed
- Agent workflow guide
- Pack guide
- Goal/task/spike/checkpoint guide
- Handoff guide
- Skills and mirrors guide
- Validation/status/doctor/fix guide
- Safety boundaries
- Public alpha contract
- Generated CLI reference or reference bridge
- Changelog
- Advanced alpha docs for subgraphs, bundles, archives, MCP, project DB, and queues

## 12. CTAs and routing

Primary CTA:

- Get started / Install mdkg

Secondary CTAs:

- View GitHub
- Read docs
- Watch demo

Tertiary CTAs:

- Follow Nicholas on X
- Connect on LinkedIn
- Visit Nicholas Reames personal site
- Join ochatr.ai waitlist

CTA priority should vary by page. The homepage should privilege install/GitHub/docs. The footer and about section can route to socials and ochatr.ai.

## 13. Public install requirements

Support multiple install paths for developer experience. Exact commands must be verified before publication, but the docs should support npm, pnpm, Bun, and potentially npx/pnpm dlx/bunx-style one-off usage when valid.

The install page must clearly state:

- Required Node version.
- How to check Node version.
- Recommended package manager options.
- How to initialize a repo.
- That `mdkg index` should run after init before status/doctor are treated as clean health gates.
- How to verify installation.

## 14. Success metrics

Initial launch success should be measured by trust and adoption signals:

- mdkg.dev visits
- docs visits
- GitHub stars
- npm downloads/installs
- quickstart page completion proxy
- demo page visits
- GitHub issue/discussion activity
- X/LinkedIn followers
- direct replies/DMs from developers
- ochatr.ai waitlist signups attributed to mdkg.dev
- conference conversations leading to GitHub/docs visits

Avoid over-indexing on revenue or paid conversion during this launch.

## 15. Launch readiness criteria

mdkg.dev should not launch publicly until:

- README top section and homepage positioning are aligned.
- Version metadata drift is cleaned up.
- Quickstart commands are smoke-tested.
- Install commands are verified.
- Node version requirements are visible.
- `init --agent -> index -> status -> validate` path is documented.
- Safety boundaries page exists.
- Public alpha contract page exists.
- GitBook docs home and quickstart exist.
- GitHub/npm/social/ochatr links work.
- `llms.txt` exists or is planned as a launch requirement.
- Demo repo or demo flow exists, even if the first video is simple.

## 16. Summary

The product does not need more feature breadth before mdkg.dev. It needs a polished first impression, a trustworthy alpha contract, generated or synchronized docs, and a golden path that makes the value obvious in minutes.

The launch thesis is:

> Markdown Knowledge Graph gives AI-native software teams durable, git-native project memory. mdkg.dev should make that promise obvious, testable, and trustworthy.
