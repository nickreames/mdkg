---
title: mdkg Positioning and Origin Story
status: planning snapshot
date: 2026-06-22
owner: Nicholas Reames
product: Markdown Knowledge Graph
---

# mdkg Positioning and Origin Story

## 1. Purpose

This document captures the public narrative for Markdown Knowledge Graph: positioning, copy primitives, origin story, SKILL.md-style framing, and the bridge to Nicholas Reames and ochatr.ai.

The goal is to create a reusable source for mdkg.dev, README copy, social posts, launch articles, docs intros, and conference conversations.

## 2. Primary positioning

### One-liner

> Markdown Knowledge Graph is git-native project memory for AI-native software engineering.

### Expanded one-liner

> Markdown Knowledge Graph turns structured Markdown in your repo into deterministic context packs, goals, checkpoints, skills, and handoffs for humans, AI agents, and human-agent teams.

### Longer description

> Markdown Knowledge Graph (`mdkg`) is a local-first CLI for turning structured Markdown in a git repo into deterministic project memory. Markdown remains the source of truth, local indexes are rebuildable, and agents can use packs, goals, checkpoints, skills, and handoffs to work from durable repo context instead of ad hoc chat history.

## 3. Product category

Preferred category:

> AI-native software engineering infrastructure

More specific category:

> repo-native project memory for AI coding agents

Use “context engineering” as an important theme, not the entire brand.

Markdown Knowledge Graph sits at the intersection of:

- AI-native software engineering
- context engineering
- agentic coding workflows
- repo-native project memory
- SDLC structure
- human-agent collaboration
- SKILL.md-style file-based agent instructions
- local-first developer tooling

## 4. What mdkg is

Markdown Knowledge Graph is:

- a CLI
- a repo-native project memory layer
- a Markdown + frontmatter graph
- a deterministic context-pack builder
- a goal/task/spike/checkpoint lifecycle tool
- an agent handoff tool
- an agent skill manager/mirroring tool
- a validation and repair tool
- an advanced alpha substrate for multi-repo and multi-agent workflows

## 5. What mdkg is not

Markdown Knowledge Graph is not:

- an autonomous coding agent
- an execution runtime
- a hosted memory service
- a vector database product
- a daemon
- a replacement for GitHub issues, CI, or source control
- a comprehensive secret scanner
- a DLP product
- a production queue/event ledger
- a SaaS backend

## 6. Message pillars

### Pillar 1: Git-native project memory

Core idea:

> The repo should contain durable project memory that humans and agents can inspect, edit, review, branch, and validate.

Supporting lines:

- Put goals, decisions, tasks, evidence, and handoffs in Git.
- Stop trapping project memory in chat history.
- Markdown is human-editable and agent-readable.
- Frontmatter adds structure without hiding state.

### Pillar 2: Deterministic context for agents

Core idea:

> Agents should receive structured context from known graph state, not random file dumps.

Supporting lines:

- `mdkg pack <id>` gives an agent deterministic context for a specific node.
- Same repo state, same graph node, predictable context output.
- Packs can include scope, context, and evidence with visibility filters.

### Pillar 3: SDLC-aware agent workflows

Core idea:

> AI-native software development needs durable goals, tasks, spikes, checkpoints, and evidence.

Supporting lines:

- Goals model long-running objectives.
- Spikes capture research and planning.
- Checkpoints record meaningful progress and proof.
- Validation keeps references and lifecycle state trustworthy.

### Pillar 4: Safe handoffs and inspection

Core idea:

> Agent work should be transferable without dumping raw chat history or granting unnecessary mutation power.

Supporting lines:

- `mdkg handoff create` generates bounded next-action context.
- MCP is read-only.
- Subgraphs are read-only planning context.
- Handoff warnings are safety aids, not comprehensive secret scanning.

### Pillar 5: Low-dependency, local-first developer tooling

Core idea:

> The tool should be boring where it matters.

Supporting lines:

- TypeScript + Node.
- Markdown source of truth.
- Local SQLite infrastructure only where useful.
- No hosted index.
- No vector DB required.
- No hidden cloud state.

## 7. Homepage copy bank

### Hero headline options

1. Git-native project memory for AI-native software engineering.
2. Give your AI coding agents a repo-native source of truth.
3. Stop re-explaining your project to every AI coding session.
4. Turn Markdown into durable project memory for humans and AI agents.
5. Deterministic context packs, goals, checkpoints, and handoffs — in Git.

Recommended launch headline:

> Git-native project memory for AI-native software engineering.

### Hero subheadline

> Markdown Knowledge Graph turns structured Markdown in your repo into deterministic context packs, goals, checkpoints, skills, and handoffs for humans and AI agents — without a daemon, hosted index, vector database, or hidden cloud state.

### Trust line

> Developer preview. Pre-v1 public alpha. Markdown is the source of truth; local indexes are rebuildable.

### Problem heading

> AI coding agents lose the thread.

### Problem copy

> Goals disappear into chat history. Architecture decisions drift across files and prompts. Agents confuse background context with executable scope. Handoffs become raw context dumps. Markdown Knowledge Graph puts durable project memory back in the repo.

### Core loop heading

> One loop for humans and agents.

### Core loop copy

> Initialize repo memory, select work, build a deterministic pack, execute with a human or AI agent, record a checkpoint, and validate before moving on.

### Work/context/evidence heading

> Work, context, and evidence are different things.

### Work/context/evidence copy

> mdkg separates executable scope from background context and proof, so agents can see what they should do, what they should know, and what supports the current state.

### Handoff heading

> Agent handoffs without raw history dumps.

### Handoff copy

> `mdkg handoff create` builds a copy-ready handoff from graph context, goal/work state, latest checkpoints, boundaries, required checks, next actions, and safety warnings.

## 8. README intro draft

Recommended README opening:

```markdown
# Markdown Knowledge Graph

Git-native project memory for AI-native software engineering.

Markdown Knowledge Graph (`mdkg`) turns structured Markdown in your repo into deterministic context packs, goals, checkpoints, skills, and handoffs for humans, AI agents, and human-agent teams.

It is intentionally repo-native and boring: Markdown is the source of truth, Git tracks history, local indexes are rebuildable, and no daemon, hosted index, vector database, or hidden cloud state is required.

Developer preview: mdkg is a pre-v1 public alpha. It is usable today, but graph, cache, bundle, and database contracts may change before v1.
```

Then immediately show install and quickstart.

## 9. SKILL.md-style framing

Markdown Knowledge Graph can reference SKILL.md-style agent workflows as a familiar mental model, especially for users who understand file-based agent instructions.

Recommended framing:

> If SKILL.md-style folders help agents reuse task-specific instructions and resources, Markdown Knowledge Graph helps a repo expose durable project memory, SDLC state, evidence, and handoffs.

Avoid implying that mdkg is merely a skill manager.

Better distinction:

- Skills: reusable instructions/resources for an agent.
- mdkg: repo-native project memory and graph state for humans and agents.

Marketing line:

> Built for agents that learn from files: Markdown, frontmatter, skills, packs, and handoffs.

Docs line:

> Canonical skills live in `.mdkg/skills/<slug>/SKILL.md` and can be mirrored into agent-facing folders. mdkg discovers and validates skills but does not execute skill scripts.

## 10. Origin story

### Short homepage footnote

> Markdown Knowledge Graph grew out of Nicholas Reames’s own AI coding workflow: using Markdown files, frontmatter, reusable prompts, and filesystem-native project context to make agentic software development more reliable. The project predates the current SKILL.md-style agent skills wave, but shares the same practical belief: agents work better when durable instructions and context live in files they can inspect.

### Longer origin story draft

Before launching Markdown Knowledge Graph publicly, Nicholas Reames was already using Claude models as his primary software architecture partner. He used long-form planning with Claude Opus for Engineering Design Documents, product reasoning, architecture tradeoffs, and reusable agentic coding workflows.

Around the same period, a common idea circulated in AI builder circles: maybe all an agent really needs is a filesystem and Markdown files. That resonated because it matched how Nicholas was already working. The most reliable agent workflows were not hidden in a SaaS memory system or trapped in a chat transcript. They were written down as durable files: prompts, goals, design notes, decisions, task plans, and reusable instructions.

The architectural conclusion was simple but powerful: Markdown plus frontmatter is a practical substrate for human-agent software work. Markdown stays readable. Frontmatter gives machines structure. Git gives history and review. Agents can inspect files, build context, and leave behind evidence.

Markdown Knowledge Graph grew from that workflow. It is not trying to replace agents. It gives agents and humans a shared project memory layer inside the repo.

### What to avoid

Do not make the origin story sound like a claim of priority over Anthropic or any other company. The story should be personal, practical, and humble.

Good tone:

> This came from my own workflow before the broader skills pattern became mainstream.

Avoid tone:

> I invented SKILL.md before Anthropic.

## 11. Nicholas Reames bio for mdkg.dev

Short bio:

> Nicholas Reames is a professional full-stack software engineer working in AI applications. Outside of his professional work, he builds AI-native software systems, developer tools, and agent workflows, including Markdown Knowledge Graph and ochatr.ai.

Slightly warmer version:

> I’m Nicholas Reames, a full-stack software engineer working in AI applications. I build AI-native software tools in my free time, including Markdown Knowledge Graph and ochatr.ai.

Links:

- GitHub
- X
- LinkedIn
- nicholas-reames.com
- ochatr.ai

## 12. ochatr.ai bridge

mdkg should bridge to ochatr.ai without making ochatr.ai the main product.

Recommended copy:

> Markdown Knowledge Graph is the first public building block in a larger AI-native software stack I’m building. Long-term, ochatr.ai explores omni chat rooms, agent workflows, asynchronous work, multi-agent graphs, and value-based AI credits.

Shorter footer copy:

> Interested in the larger agentic workspace vision? Join the ochatr.ai waitlist.

Avoid making mdkg.dev feel like a waitlist funnel only. The primary CTA remains install/GitHub/docs.

## 13. Founder-style pivot post ingredients

Potential title:

> I’m launching the developer tool before the AI app.

Core points:

- I’m building ochatr.ai, but I do not want to rush out a subpar AI chat app.
- The deeper problem I keep running into is durable context for AI-native software work.
- Agents lose goals, decisions, and evidence across sessions.
- The most reliable substrate I have found is Markdown + frontmatter + Git.
- So I’m launching Markdown Knowledge Graph first.
- It is public alpha, open/developer-focused, and built to solve a real problem.
- It is the first building block of a larger AI-native software stack.
- I’ll be discussing it with builders at AI Engineer World’s Fair.

Tone:

- honest
- builder-to-builder
- practical
- quality-focused
- not hype-heavy

## 14. Conference pitch

Short version:

> I’m building Markdown Knowledge Graph, a git-native project memory layer for AI coding agents. It turns Markdown and frontmatter in a repo into deterministic context packs, goals, checkpoints, skills, and handoffs.

Longer version:

> I’m a full-stack software engineer working in AI applications. My public launch right now is Markdown Knowledge Graph: a local-first CLI that gives AI coding agents durable repo context without a hosted index or vector DB. Longer term, it becomes part of the agent workflow layer behind ochatr.ai.

Question to ask:

> How are you keeping AI coding agents aligned with project context across sessions?

## 15. Summary

The public narrative should be grounded and practical. Markdown Knowledge Graph exists because AI-native software engineering needs durable project memory that humans and agents can share. The origin story can humanize the project, but the product promise should stay focused: git-native project memory, deterministic context, structured SDLC state, handoffs, and validation.
