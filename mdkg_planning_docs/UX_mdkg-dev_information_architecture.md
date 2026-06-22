---
title: mdkg.dev UX and Information Architecture
status: planning snapshot
date: 2026-06-22
owner: Nicholas Reames
product: Markdown Knowledge Graph / mdkg.dev
---

# mdkg.dev UX and Information Architecture

## 1. Purpose

This document defines the user experience and information architecture for `mdkg.dev`.

The site must make Markdown Knowledge Graph understandable before it makes it comprehensive. The first-time visitor should quickly understand that mdkg gives AI coding agents durable, repo-native project memory. The deep command surface should be progressively disclosed through docs, not loaded into the homepage.

## 2. UX principles

### 2.1 Teach the golden loop first

The homepage should center one working loop:

```bash
mdkg init --agent
mdkg index
mdkg status
mdkg goal next
mdkg pack <id>
mdkg task start <id>
# human or agent does the work
mdkg task done <id> --checkpoint "Meaningful milestone"
mdkg validate
```

And for handoffs:

```bash
mdkg handoff create <id>
```

Everything else should be introduced after this loop is understood.

### 2.2 Favor concrete developer language

Prefer:

- project memory
- repo-native source of truth
- deterministic context packs
- goals, tasks, checkpoints, handoffs
- Markdown + Git
- AI-native software engineering

Use “knowledge graph” as the product name and technical model, but avoid making it the only explanation.

### 2.3 Show trust boundaries clearly

Developers will trust the tool more if the site is direct about what mdkg does not do.

Important caveats:

- mdkg does not execute work.
- mdkg does not execute skill scripts.
- MCP is read-only.
- SQLite is local infrastructure, not hidden product state.
- Visibility filters are not arbitrary body redaction.
- Handoff warnings are not full secret scanning.
- Project DB and queues are advanced alpha.

### 2.4 Make the first five minutes undeniable

The user should be able to:

1. Understand the promise.
2. See install options.
3. Run a quickstart.
4. Generate or inspect a pack/handoff.
5. See validation.
6. Open GitHub/docs.

The first path should not require understanding subgraphs, bundles, queues, or MCP.

### 2.5 Optimize for mobile and conference use

AI Engineer World’s Fair and similar events create short attention windows. The site should work well from a phone after a QR/NFC handoff.

Mobile requirements:

- Short hero.
- Clear buttons.
- Copyable commands.
- Fast load.
- Minimal clutter.
- Social/GitHub/docs links easy to tap.
- A quick “what is this?” answer in the first screen.

## 3. Homepage information architecture

Recommended homepage order:

1. Hero
2. Quickstart / install
3. Problem
4. Core loop
5. Why Markdown + Git
6. Deterministic context packs
7. Work/context/evidence model
8. Goals, tasks, spikes, checkpoints
9. Agent handoffs
10. Skills and agent compatibility
11. Validation and repair trust gates
12. Advanced alpha preview
13. About / origin footnote
14. Final CTAs and footer

## 4. Hero section

### Goal

Explain the product in under 10 seconds and route developers to install, GitHub, or docs.

### Recommended copy

Headline:

> Git-native project memory for AI-native software engineering.

Subheadline:

> Markdown Knowledge Graph turns structured Markdown in your repo into deterministic context packs, goals, checkpoints, skills, and handoffs for humans and AI agents — without a daemon, hosted index, vector database, or hidden cloud state.

Trust line:

> Developer preview. Pre-v1 public alpha. Markdown is the source of truth; local indexes are rebuildable.

Primary CTA:

> Get started

Secondary CTAs:

> View GitHub

> Read docs

Optional tertiary:

> Watch demo

### Visual concept

Show a simple flow instead of an abstract graph:

```text
Markdown + frontmatter in Git
        ↓
mdkg index / validate
        ↓
deterministic pack / handoff
        ↓
human or AI agent works
        ↓
checkpoint + evidence
```

## 5. Quickstart section

### Goal

Make the CLI feel immediately usable.

### Requirements

- Show multiple package-manager options.
- Make the canonical path clear.
- Include Node version requirement nearby.
- Make `mdkg index` explicit after init.
- Include a short “what happens next” explanation.

### Example layout

Tabs:

- npm
- pnpm
- Bun
- one-off / npx-style, if verified

Snippet:

```bash
mdkg init --agent
mdkg index
mdkg status
mdkg validate
```

Follow-up snippet:

```bash
mdkg goal next
mdkg pack <id>
mdkg handoff create <id>
```

Copy:

> Initialize repo-local project memory, build the access cache, inspect status, and validate graph health before handing work to an agent.

## 6. Problem section

### Goal

Make the pain obvious before introducing features.

### Recommended heading

> AI coding agents lose the thread.

### Pain points

- Goals disappear into chat history.
- Architecture decisions are scattered across docs, issues, and prompts.
- Agents confuse background context with executable scope.
- Evidence and checkpoints are hard to reuse.
- Handoffs often become raw context dumps.
- Teams repeat the same explanations across sessions.

### Transition

> Markdown Knowledge Graph puts durable project memory where software teams already coordinate: inside the repo.

## 7. Core loop section

### Goal

Explain the product as a workflow, not a pile of commands.

Recommended cards:

1. **Initialize**
   `mdkg init --agent`

2. **Plan**
   Create/select goals, tasks, bugs, tests, features, and research spikes.

3. **Pack**
   `mdkg pack <id>` builds deterministic context for a node.

4. **Execute**
   A human or AI agent does the work.

5. **Record**
   `mdkg task done <id> --checkpoint "..."` records meaningful evidence.

6. **Validate**
   `mdkg validate`, `mdkg status`, `mdkg doctor`, and `mdkg fix` keep state trustworthy.

## 8. Why Markdown + Git section

### Goal

Explain the architectural taste.

### Recommended heading

> Project memory should be boring, inspectable, and version-controlled.

### Points

- Markdown is readable by humans and agents.
- Frontmatter gives structure without hiding state.
- Git provides history, review, branching, and conflict workflows.
- SQLite is local infrastructure where useful, not the source of truth.
- No hosted index or vector database is required.
- Rebuildable caches keep performance separate from authority.

## 9. Deterministic context packs section

### Goal

Make `mdkg pack` feel like the hero feature.

### Recommended heading

> Give agents the context they need — not a random pile of files.

### Copy

> `mdkg pack <id>` builds deterministic context from graph state. Instead of asking an agent to browse a repo ad hoc, point it at a goal, task, spike, bug, test, or feature and give it a structured pack with related context and evidence.

### Formats to mention

- Markdown
- JSON
- TOON
- XML

### Profiles to mention lightly

- standard
- concise
- headers

Avoid overexplaining profiles on the homepage. Link to docs.

## 10. Work/context/evidence model section

### Goal

Explain one of the strongest product insights from 0.3.7.

### Recommended heading

> Work, context, and evidence are different things.

### Copy

> Markdown Knowledge Graph separates executable scope from background context and proof. Agents can see what they should do, what they should know, and what evidence supports the current state.

Example:

```yaml
scope_refs:
  - task-12
context_refs:
  - dec-3
  - prd-1
evidence_refs:
  - checkpoint-8
  - archive://release.audit
```

Plain-language mapping:

- `scope_refs`: what is actionable.
- `context_refs`: what informs the work.
- `evidence_refs`: what proves or supports state.

## 11. Goals, tasks, spikes, checkpoints section

### Goal

Show mdkg as SDLC-aware project memory, not just a notes tool.

### Recommended heading

> Model the work agents need to follow.

### Include

- Goals for long-running objectives.
- Epics/features/tasks/bugs/tests for implementation structure.
- Spikes for actionable research and planning.
- Checkpoints for evidence and handoff history.
- Required checks as report-only guidance that humans/agents must run and record.

### Do not imply

- Spikes perform research automatically.
- Required checks execute automatically.
- mdkg replaces CI.

## 12. Handoffs section

### Goal

Show a concrete solution to multi-session / multi-agent friction.

### Recommended heading

> Create agent handoffs without dumping raw project history.

### Copy

> `mdkg handoff create` builds a copy-ready handoff from graph context, goal/work state, latest checkpoint, required checks, boundaries, next actions, and safety warnings.

Safety line:

> Handoff warnings are safety aids, not comprehensive secret scanning.

## 13. Skills and agent compatibility section

### Goal

Connect mdkg to SKILL.md-style agent workflows without overclaiming.

### Recommended heading

> Built for agents that learn from files.

### Copy

> Markdown Knowledge Graph keeps canonical skills in `.mdkg/skills/` and can mirror them into agent-facing skill directories. The goal is to help Codex-style agents, Claude Code, and other file-aware coding harnesses discover how to use the CLI safely.

Mention planned/polish requirement:

> Skill mirrors should become configurable so teams can support their preferred agent harnesses without hard-coded folder assumptions.

## 14. Validation and repair section

### Goal

Make mdkg feel serious and engineering-grade.

### Recommended heading

> Trust gates before you close the loop.

### Commands

- `mdkg validate`
- `mdkg status`
- `mdkg doctor`
- `mdkg fix`
- `mdkg format`

Copy:

> mdkg validates graph integrity, references, skills, event logs, and generated cache state. Repair and formatting commands help keep repo memory maintainable as branches, agents, and humans all create state.

`fix` should be included as core but low visibility: important for real-world branch safety, not a first-minute concept.

## 15. Advanced alpha preview

### Goal

Signal depth without overwhelming users.

Recommended heading:

> Advanced alpha surfaces for larger agentic workflows.

Cards, one sentence each:

- **Read-only MCP**: let agents inspect project memory without mutation, shell, SQL, arbitrary file reads, environment access, or secret surfaces.
- **Subgraphs**: plan across nested or child repos through read-only qids.
- **Graph movement**: clone, fork, or import graph templates for reusable project setups.
- **Bundles**: create deterministic graph snapshots for root/child orchestration.
- **Archives**: attach committed evidence and artifacts through sidecars and deterministic ZIP caches.
- **Workflow mirrors**: model SPEC, WORK, WORK_ORDER, RECEIPT, FEEDBACK, DISPUTE, and PROPOSAL files.
- **Project DB and queues**: optional advanced local infrastructure for delivery state and agent-to-agent coordination.

Add caveat:

> Advanced surfaces are documented for early adopters but are not the core first-run path.

## 16. About / origin footnote

### Goal

Add human credibility without distracting from the product.

### Placement

Near the bottom of the homepage, above the final CTA or in a small “About” card.

### Recommended framing

> Markdown Knowledge Graph grew out of Nicholas Reames’s own AI coding workflow: using Markdown files, frontmatter, reusable prompts, and filesystem-native project context to make agentic software development more reliable. The project predates the current SKILL.md-style agent skills wave, but shares the same practical belief: agents work better when durable instructions and context live in files they can inspect.

Keep it short. Link to Nicholas’s personal site and the longer origin story if needed.

## 17. Footer IA

Footer groups:

### Product

- Home
- Quickstart
- Docs
- GitHub
- npm
- Changelog

### Learn

- Core concepts
- Agent workflows
- Safety boundaries
- Public alpha contract
- Advanced alpha docs

### Nicholas

- nicholas-reames.com
- X
- LinkedIn
- GitHub
- ochatr.ai waitlist

## 18. GitBook docs navigation

Recommended top-level docs nav:

1. Start here
   - Overview
   - Install
   - Quickstart
   - Public alpha contract

2. Concepts
   - Source of truth
   - Repository layout
   - Node types
   - Work/context/evidence refs
   - Goals and active work
   - Packs
   - Handoffs
   - Skills
   - Visibility
   - Index vs project DB

3. Guides
   - Give an agent a goal ID
   - Build a deterministic pack
   - Create and close a research spike
   - Record checkpoints
   - Create an agent handoff
   - Validate before closing work
   - Configure skill mirrors
   - Repair duplicate IDs

4. Advanced alpha
   - Read-only MCP
   - Subgraphs
   - Bundles
   - Graph clone/fork/import
   - Archives
   - SPEC/WORK/ORDER/RECEIPT
   - Project DB and queues

5. Reference
   - CLI reference
   - Output formats
   - Node frontmatter
   - Config
   - Generated files
   - Exit codes, if available

6. Project
   - Changelog
   - Roadmap
   - Contributing
   - Safety boundaries

## 19. CTA behavior by visitor type

### First-time developer

Primary CTA: Install / Quickstart.

### Serious evaluator

Primary CTA: Docs / GitHub.

### Conference contact

Primary CTA: Understand what this is; then GitHub/docs/social.

### AI crawler or agent

Primary CTA: `llms.txt`, command contract, docs/reference.

### Future ochatr.ai user

Primary CTA: ochatr.ai waitlist after understanding mdkg’s role in the larger stack.

## 20. Summary

The UX should make Markdown Knowledge Graph feel simple before it reveals that it is deep. The homepage should sell the golden path: Markdown + Git as durable project memory, deterministic packs, structured work, checkpoints, handoffs, and validation. Advanced alpha surfaces should signal seriousness while staying secondary.
