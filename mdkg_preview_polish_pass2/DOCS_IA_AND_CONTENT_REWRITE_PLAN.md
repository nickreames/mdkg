# Docs IA and Content Rewrite Plan

## Goal

Make `docs.mdkg.dev` feel like professional developer documentation rather than a preview scaffold.

The docs should teach users how to install mdkg, initialize a repo, model work, build packs, create handoffs, record evidence, and validate before closeout.

## Public Docs Principles

1. Start with tasks, not architecture.
2. Teach the core loop before advanced features.
3. Separate concepts from guides from reference.
4. Remove meta commentary about docs tooling.
5. Keep advanced alpha docs available but secondary.
6. Add enough headings that the right-hand TOC is useful, or hide it on short pages.
7. Prefer accurate minimal docs over broad placeholder docs.

## Recommended Navigation

```text
Start Here
  Install
  Quickstart

Concepts
  Source of Truth
  Local-first and Low-dependency
  Repository Layout
  Plan → Work → Evidence
  Work Node Types
  Reference Types: Scope, Context, Evidence
  Glossary

Guides
  Give an Agent a Work Node
  Build a Context Pack
  Create an Agent Handoff
  Create a Research Spike
  Record Checkpoint Evidence
  Validate Before Closeout
  Use Skills with Agent Harnesses

Reference
  CLI Reference
  Node Types
  Frontmatter Fields
  Output Formats

Advanced Alpha
  Overview
  Read-only MCP
  Subgraphs
  Bundles
  Archives
  Graph Movement
  Project DB and Queues

Project
  Changelog
  Roadmap
  Public Alpha Contract
```

## Pages to Hide or Move Out of Public Navigation

- Claims Evidence Matrix
- Docs sync / renderer decision
- Launch checklist
- DNS/analytics deployment roadmap
- Any page that explains Starlight/GitBook as implementation detail

## Docs Home Rewrite

The docs home should answer:

1. What is mdkg?
2. What can I do first?
3. What is the core operating model?
4. Where do I go for concepts, guides, and reference?
5. What is public alpha?

Use the draft from `COPY_UPDATES_mdkg_dev_pass_2.md`.

## Work Node Types Page Outline

```markdown
# Work Node Types

mdkg uses familiar SDLC shapes as Markdown graph nodes.

## Why work nodes exist

Agents need more than files and prompts. They need bounded work, durable intent, evidence, and validation.

## Goal

A long-running objective or outcome. Goals route active work and preserve progress.

## Epic

A larger body of related work.

## Feature

A feature-sized deliverable. Feature nodes can be task-like when they represent executable work.

## Task

A concrete implementation unit.

## Bug

A defect, regression, or corrective work item.

## Test

Validation/proof work.

## Spike

Actionable research or planning work. Spikes do not run research automatically; they capture questions, findings, tradeoffs, recommendations, and follow-up work.

## Checkpoint

Evidence captured at a meaningful point in the workflow.

## Decision

A durable decision record.

## PRD / EDD / Rule

Planning and design context that can support work but is not necessarily executable work.

## How they fit together

goal
  ├─ epic
  │   ├─ feat
  │   │   ├─ task
  │   │   ├─ test
  │   │   └─ bug
  │   └─ spike
  └─ checkpoint evidence

## Agent usage

Agents should use `mdkg goal current`, `mdkg goal next`, `mdkg show`, and `mdkg pack WORK_ID` to discover bounded work instead of browsing the repo ad hoc.
```

## Local-first and Low-dependency Page Outline

```markdown
# Local-first and Low-dependency

Low dependency is part of mdkg’s security philosophy.

## Markdown is the source of truth

Project memory lives in `.mdkg/` Markdown files and frontmatter.

## Git tracks the memory layer

Changes can be reviewed, diffed, reverted, branched, and merged.

## Generated indexes are rebuildable

`.mdkg/index` exists for local access and performance, but Markdown remains canonical.

## Optional project DB state is advanced

`.mdkg/db` is optional local infrastructure for advanced workflows. It is not the default mental model for getting started.

## Modern Node and node:sqlite

mdkg uses modern Node capabilities where useful to limit extra runtime dependencies.

## What not to store

Do not store raw secrets, package-manager tokens, provider credentials, private keys, raw prompts, provider payloads, or sensitive production data in graph nodes.

## What mdkg does not claim

mdkg is not a hosted memory service, secret scanner, autonomous runtime, vector database, or replacement for code review.
```

## Quickstart Rewrite Notes

Quickstart should have two paths:

### Path A: New repo / no work exists

Show how to initialize and create a small example goal/task if commands are verified.

### Path B: Existing mdkg repo

Show how to inspect current work and build a pack.

Use this narrative:

1. Install.
2. Initialize.
3. Index.
4. Validate.
5. Select/create work.
6. Pack context.
7. Start/complete work.
8. Record checkpoint.
9. Validate.

## Reference Rewrite Notes

Until generated reference is ready:

- list core commands with one-line descriptions,
- group advanced alpha commands separately,
- tell users to run `mdkg --help`,
- avoid internal generated contract path commentary.

## Roadmap Rewrite Notes

Public roadmap should be product roadmap, not launch checklist.

Do not list:

- production DNS cutover,
- analytics activation,
- Starlight migration,
- Vercel preview work.

Do list:

- first-run UX,
- docs polish,
- work node docs,
- generated reference,
- demo repo,
- configurable skill mirrors,
- handoff examples,
- subgraph/MCP guides,
- v1 contract hardening.
