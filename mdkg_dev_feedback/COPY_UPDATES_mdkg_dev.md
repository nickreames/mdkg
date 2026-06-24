# mdkg.dev marketing copy updates

This file extracts the highest-impact copy changes from the user stories into a shorter reference for manual polishing.

## Recommended homepage hero

```markdown
# Git-native project memory for AI-native software engineering.

Markdown Knowledge Graph turns structured Markdown in your repo into deterministic context packs, goals, checkpoints, skills, and handoffs for humans and AI agents — without a daemon, hosted index, vector database, or hidden cloud state.

[Get started] [Star on GitHub] [Read docs]

Developer preview. Pre-v1 public alpha. Markdown is the durable source of truth; generated indexes are rebuildable; advanced graph/cache/bundle/database contracts may change before v1.
```

## Better quickstart block

```bash
npm install -g mdkg
mdkg --version
mdkg init --agent
mdkg index
mdkg status
mdkg validate
```

Then:

```bash
mdkg goal current
mdkg goal next
mdkg pack WORK_ID
mdkg handoff create WORK_ID
mdkg task done WORK_ID --checkpoint "Meaningful milestone"
mdkg validate
```

## Problem section

```markdown
## AI coding agents lose the thread.

The most frustrating AI coding failures are often memory failures. Agents can write code, inspect files, and follow a prompt, but across sessions and handoffs they lose goals, miss decisions, confuse background context with executable work, and produce plausible code that is not aligned with the project.
```

## Bigger context section

```markdown
## Bigger context helps. It does not replace project memory.

Longer context windows let an agent hold more text at once. But raw context is still temporary, easy to overfill, and hard to review. Project memory should be structured, version-controlled, inspectable, and shared by humans and agents. That is why mdkg keeps durable work state in Markdown and Git.
```

## Work/context/evidence section

```markdown
## Work, context, and evidence are different things.

mdkg separates what an agent should do, what it should know, and what proves the current state.

- `scope_refs`: executable work scope — tasks, tests, bugs, features, and spikes a goal can route through.
- `context_refs`: background knowledge — decisions, PRDs, prior goals, plans, subgraph qids, or URI refs that inform the work.
- `evidence_refs`: proof — checkpoints, audits, receipts, archive sidecars, and artifacts that support the current state.
```

## Handoff section

```markdown
## Handoffs without raw project dumps.

`mdkg handoff create` builds copy-ready handoff prompts from graph context, goal/work state, latest checkpoints, boundaries, required checks, next actions, and raw-marker warnings.

Handoff warnings are safety aids, not comprehensive secret scanning.
```

## Trust block

```markdown
## Local-first by default.

mdkg is durable semantic memory, not a hosted runtime. Markdown in `.mdkg/` is the durable source of truth. Generated indexes are rebuildable. SQLite is local infrastructure where useful. mdkg does not execute work automatically, does not execute skill scripts, and does not expose broad mutation through MCP in this release.
```

## What mdkg is not

```markdown
mdkg is not an autonomous agent runtime, hosted memory service, vector database, comprehensive secret scanner, or replacement for human code review. It is a public-alpha CLI for making project memory durable, local, inspectable, and reusable.
```

## Feedback CTA

```markdown
If this problem feels familiar, try the quickstart and star the repo if mdkg seems useful. If your agents lose context in a different way, open an issue or send feedback — real workflow pain is shaping the public-alpha roadmap.
```
