---
title: mdkg GitBook Documentation Strategy
status: planning snapshot
date: 2026-06-22
owner: Nicholas Reames
product: Markdown Knowledge Graph / docs.mdkg.dev
---

# mdkg GitBook Documentation Strategy

## 1. Purpose

This document defines how GitBook should be used for Markdown Knowledge Graph documentation.

The decision is to use `mdkg.dev` as the owned static product site and GitBook as the professional developer documentation surface, ideally at `docs.mdkg.dev`. The repo remains the canonical source for documentation content and generated artifacts.

## 2. Strategic decision

Use GitBook for launch documentation.

Rationale:

- Faster professional docs surface than building a custom docs CMS.
- Good fit for developer docs, navigation, search, and quick iteration.
- Allows mdkg.dev to stay focused on product explanation and conversion.
- Reduces launch risk before AI Engineer World’s Fair.
- Keeps deeper docs out of the homepage.

Important boundary:

> GitBook is the public docs renderer. The mdkg repo remains the source of truth.

## 3. Site/docs division of responsibility

### mdkg.dev owns

- Landing page.
- Product positioning.
- Quickstart preview.
- Demo embeds.
- Conversion CTAs.
- `llms.txt` and public artifact links.
- Links to docs, GitHub, npm, socials, and ochatr.ai.
- Short origin/about note.

### docs.mdkg.dev owns

- Installation details.
- Full quickstart.
- Concepts.
- Guides.
- CLI reference.
- Safety boundaries.
- Public alpha contract.
- Advanced alpha docs.
- Changelog/roadmap.
- Contributor guidance.

## 4. Docs source location

Recommended source layout:

```text
mdkg/
├── docs/
│   ├── README.md or index.md
│   ├── start-here/
│   ├── concepts/
│   ├── guides/
│   ├── advanced-alpha/
│   ├── reference/
│   ├── project/
│   └── _generated/
├── dist/
│   └── command-contract.json
└── scripts/
    └── generate-docs.ts
```

The exact folder structure can follow GitBook sync requirements. The key requirement is that docs live in the repo and can be reviewed alongside code.

## 5. Docs navigation

Recommended GitBook navigation:

### Start here

- Overview
- Install
- Quickstart
- Public alpha contract
- Safety boundaries

### Concepts

- Source of truth hierarchy
- Repository layout
- Markdown nodes and frontmatter
- Node types
- Work, context, and evidence refs
- Goals and active work
- Packs
- Handoffs
- Checkpoints
- Skills and mirrors
- Visibility
- Index vs project DB

### Guides

- Initialize a repo for agents
- Give an AI agent a goal ID
- Build a deterministic context pack
- Create and close a research spike
- Record a checkpoint
- Generate an agent handoff
- Configure skill mirrors
- Validate before closing work
- Repair duplicate IDs after branch conflicts
- Upgrade a workspace safely

### Advanced alpha

- Read-only MCP
- Subgraphs
- Bundles
- Graph clone/fork/import-template
- Archives
- SPEC/WORK/WORK_ORDER/RECEIPT mirrors
- Project DB
- Local queues

### Reference

- CLI reference
- Command contract
- Output formats
- Node frontmatter fields
- Visibility model
- Generated files and caches
- Config
- Exit codes, if available

### Project

- Changelog
- Roadmap
- Contributing
- License
- About / origin

## 6. Required docs before launch

Minimum viable docs:

1. Overview
2. Install
3. Quickstart
4. Core concepts
5. Agent workflow guide
6. Pack guide
7. Goal/task/spike/checkpoint guide
8. Handoff guide
9. Skills and mirrors guide
10. Validation/status/doctor/fix guide
11. Repository layout and what to commit
12. Safety boundaries
13. Public alpha contract
14. Generated or semi-generated CLI reference
15. Changelog

## 7. Generated docs strategy

The command surface is large. Avoid hand-maintaining reference pages where possible.

Generated docs should come from:

- `dist/command-contract.json`
- CLI metadata
- command examples
- output format declarations
- mutability/safety metadata, if available

Generated reference pages should include:

- command name
- purpose
- usage
- flags
- output formats
- read-only or mutating status
- examples
- related commands
- safety notes
- alpha labels where appropriate

If the first launch cannot generate everything, start with semi-generated command family pages and link to the current CLI matrix.

## 8. Docs drift prevention

Required pre-publish checks:

- Generated command docs are fresh.
- Package version matches docs metadata.
- README/site/docs installation snippets match.
- Quickstart smoke test passes.
- Links are valid.
- Generated reference artifacts exist.
- Changelog latest version is represented.

Potential scripts:

```bash
npm run docs:generate
npm run docs:check-version
npm run docs:check-links
npm run smoke:quickstart
```

## 9. Quickstart design

Quickstart should be direct and executable.

Required sections:

1. Requirements
2. Install
3. Initialize
4. Index
5. Check status
6. Validate
7. Find work
8. Build a pack
9. Create a handoff
10. Next steps

Suggested command path:

```bash
mdkg init --agent
mdkg index
mdkg status
mdkg validate
mdkg goal next
mdkg pack <id>
mdkg handoff create <id>
```

Add expected output excerpts and “what this means” notes.

## 10. Repository layout docs

This page is critical.

It should answer:

- What files are source of truth?
- What should be committed?
- What is generated?
- What is rebuildable?
- What is optional runtime state?
- What is safe to delete and rebuild?
- What should not contain secrets?

It should explain:

```text
.mdkg/core/
.mdkg/design/
.mdkg/work/
.mdkg/templates/
.mdkg/skills/
.mdkg/archive/
.mdkg/bundles/
.mdkg/index/
.mdkg/db/
.mdkg/subgraphs/
.agents/skills/
.claude/skills/
```

The page should clearly distinguish `.mdkg/index` from `.mdkg/db`.

## 11. Safety boundaries docs

This page should be easy to find and linked from homepage/footer.

Must state:

- mdkg does not execute work.
- mdkg does not execute skill scripts.
- MCP is read-only.
- Subgraphs are read-only planning context.
- Mutating commands reject subgraph qids.
- Visibility filtering is metadata enforcement, not arbitrary body redaction.
- Handoff raw-marker warnings are not comprehensive secret scanning.
- Queue state is local delivery state, not canonical runtime history.
- Workflow mirrors are semantic mirrors, not production state.
- Internal project DB primitives are not public CLI surfaces yet.

## 12. Public alpha contract docs

This page should increase trust.

Recommended copy:

> Markdown Knowledge Graph is a developer preview and pre-v1 public alpha. It is usable today, but graph, cache, bundle, and database contracts may change before v1. Markdown files in your repo remain the durable source of truth.

Include:

- What is stable enough to try.
- What may change.
- How upgrades work.
- How generated caches behave.
- How to report issues.
- Where to find changelog.

## 13. Skills and SKILL.md-style docs

Docs should explain:

- Canonical skills live in `.mdkg/skills/<slug>/SKILL.md`.
- Mirrors are generated into agent-facing folders.
- Current defaults include `.agents/skills/` and `.claude/skills/`.
- Mirror destinations should become configurable.
- mdkg discovers and indexes skills but does not execute skill scripts.
- Skills help agents understand how to use mdkg safely.

The docs can reference SKILL.md-style agent workflows as a familiar mental model, while making mdkg’s distinction clear:

> Skills help agents reuse task-specific instructions. Markdown Knowledge Graph helps repos expose durable project memory, SDLC state, and graph context.

## 14. Advanced alpha docs guidance

Advanced docs should be clear and honest.

Each advanced feature page should include:

- What it is.
- When to use it.
- When not to use it.
- Safety boundaries.
- Example commands.
- Current limitations.
- Stability caveats.

Advanced areas:

- Project DB and queues.
- Subgraphs.
- Bundles.
- Archives.
- Graph clone/fork/import.
- MCP.
- Workflow mirrors.

Do not bury advanced features, but do not let them dominate the first-run docs.

## 15. Agent-readable docs bridge

GitBook is for humans, but mdkg should also serve agents.

Agent-facing requirements:

- `mdkg.dev/llms.txt`
- optional `mdkg.dev/llms-full.txt`
- public command contract
- raw Markdown source links where practical
- generated reference artifacts
- web version of agent startup guidance

Docs should include explicit agent guidance:

> Agents should prefer `mdkg pack <id>` over ad hoc file lists when building context for work.

## 16. Content lifecycle

Recommended workflow:

1. Update CLI/source.
2. Generate command contract.
3. Generate docs/reference.
4. Run quickstart smoke test.
5. Update README and mdkg.dev if positioning changed.
6. Sync docs to GitBook.
7. Run link/version checks.
8. Publish.

## 17. Summary

GitBook should give Markdown Knowledge Graph a professional docs surface quickly, while the mdkg repo remains the source of truth. The docs should teach the golden path, distinguish core and advanced alpha features, prevent safety misunderstandings, and reduce drift through generated artifacts and pre-publish checks.
