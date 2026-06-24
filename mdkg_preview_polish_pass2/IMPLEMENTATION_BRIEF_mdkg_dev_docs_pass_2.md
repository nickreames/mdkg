# Implementation Brief: mdkg.dev + docs.mdkg.dev Preview Polish Pass 2

## Purpose

This implementation pass turns the current Vercel previews from ambitious scaffolds into polished public product and documentation surfaces.

The previews already have the right foundation. The next work is mostly product communication, copy maturity, documentation information architecture, trust polish, and launch-readiness hardening.

## Target URLs

- Product/landing preview: `https://mdkg-dev.vercel.app/`
- Docs preview: `https://mdkg-docs.vercel.app/`

## Locked Decisions

### Branding

- No logo is required.
- Use simple text branding: `mdkg`.
- Full name remains `Markdown Knowledge Graph`.
- Visual style should remain clean, professional, OSS-native, restrained, and code-readable.
- Shared Ocean Flow color DNA with ochatr.ai is acceptable, but mdkg.dev should feel like a standalone OSS developer tool.

### Product Positioning

Primary public framing:

> Git-native project memory for AI coding agents.

Broader umbrella:

> AI-native software engineering.

Use the concrete `AI coding agents` framing in the hero and early sections. Use `AI-native software engineering` as the bigger category.

### Operating Model

Replace “golden loop” with:

> Plan → Work → Evidence

Expanded:

> Plan the goal. Execute one work node. Record evidence. Validate before moving on.

### Site Boundary

`mdkg.dev` should be a concise public product site. It should not explain documentation renderer choices, preview deployment, Starlight/GitBook, future canonical hosting, or launch scaffolding.

`docs.mdkg.dev` should be professional developer docs. It should not read like a migration note or planning document.

Internal planning material should remain in the repo, not in public docs navigation.

### Header Navigation

Recommended mdkg.dev nav:

```text
mdkg
Quickstart
Docs ↗
GitHub ↗
npm ↗
```

Move Alpha to footer/trust/hero note rather than primary nav.

External links should open in a new tab with `target="_blank"` and `rel="noopener noreferrer"`.

### Docs Route

`mdkg.dev/docs` should redirect to the documentation host or show a very minimal bridge. It should not be a meta page about docs tooling.

### Public Claims

Do not expose the Claims Evidence Matrix in public docs navigation for this pass. Use it internally to validate claims. The public trust surface should be `/trust` and docs Safety pages.

## Primary Product Story

AI coding agents are useful, but they lose project intent across sessions, branches, handoffs, and long-running work. Larger context windows help, but raw context is not the same as durable project memory.

Markdown Knowledge Graph stores structured project memory in Markdown and Git. Humans and agents can inspect the same source of truth, build deterministic context packs, create handoffs, record checkpoint evidence, and validate the graph before closeout.

## First-Run Setup vs Operating Loop

Do not mix setup and work execution into one generic code block.

### First-run setup

```bash
npm install -g mdkg
mdkg init --agent
mdkg index
mdkg status
mdkg validate
```

### Operating loop

```bash
mdkg goal current
mdkg goal next
mdkg pack WORK_ID
mdkg task done WORK_ID --checkpoint "Meaningful milestone"
mdkg validate
```

Only publish commands that are verified against the current CLI.

## Content Priorities

### Highest priority

1. Fix broken/collapsed command blocks.
2. Fix `/llms.txt` formatting.
3. Remove public meta/scaffold commentary.
4. Simplify nav and external link behavior.
5. Replace “golden loop” with `Plan → Work → Evidence`.
6. Add work node type explanation.
7. Add low-dependency/local-first security posture.

### Documentation priority

1. Rewrite docs home.
2. Add Work Node Types page.
3. Add Local-first and Low-dependency page.
4. Improve Install and Quickstart pages.
5. Tune Starlight right-hand TOC behavior.
6. Replace generated reference placeholder with useful minimal reference.
7. Rewrite public roadmap.

## Non-Goals for This Pass

- Full command reference generator.
- Full demo repo docs.
- Full MCP/subgraph/bundle guides.
- Full video/demo asset pipeline.
- Public claims matrix.
- Blog/article system.
- ochatr.ai integration beyond optional footer/link.

## Success Standard

A developer should land on mdkg.dev, understand that mdkg gives AI coding agents git-native project memory, install it, run a clean first-run path, understand the Plan → Work → Evidence loop, trust the local-first/low-dependency posture, and click through to GitHub/docs without encountering internal implementation commentary.
