# Copy Updates: mdkg.dev + docs.mdkg.dev Preview Polish Pass 2

This document provides direct copy replacements and starter drafts for the next pass. Use these as source material, not as rigid final copy.

## Global Copy Rules

Use:

- Markdown Knowledge Graph
- mdkg
- git-native project memory
- AI coding agents
- AI-native software engineering
- Plan → Work → Evidence
- local-first
- low-dependency
- deterministic context packs
- handoffs
- checkpoint evidence
- public alpha / developer preview

Avoid:

- golden loop
- future canonical documentation host
- Starlight renderer
- preview bridge
- entry point until generator is added
- secret-safe
- fully secure
- autonomous execution
- production-ready runtime
- never loses context

## Homepage Hero

### Recommended Headline

```markdown
Git-native project memory for AI coding agents.
```

### Recommended Subheadline

```markdown
Markdown Knowledge Graph turns structured Markdown in your repo into a Plan → Work → Evidence loop that humans and agents can inspect, pack, hand off, and validate.
```

### Support Line

```markdown
Local-first. Low-dependency. No daemon, hosted index, vector database requirement, or hidden cloud state.
```

### CTA Labels

```text
Get started
View GitHub
Read docs
```

## Homepage Problem Section

```markdown
## AI coding agents lose the thread.

AI coding agents are good at generating code, but weak at preserving project intent across sessions, branches, handoffs, and long-running goals.

They forget decisions. They confuse background context with executable work. They cannot always distinguish evidence from TODOs. And when work moves between sessions, the handoff is often just a raw chat dump.

Markdown Knowledge Graph gives the repo a durable memory layer that humans and agents can both inspect.
```

## First-Run Setup Section

```markdown
## First, prove the repo memory layer works.

Initialize mdkg in a Git repo, build the local index, inspect status, and validate the graph.
```

```bash
npm install -g mdkg
mdkg init --agent
mdkg index
mdkg status
mdkg validate
```

## Operating Loop Section

```markdown
## Then run the Plan → Work → Evidence loop.

Plan the goal. Execute one work node. Record evidence. Validate before moving on.
```

```bash
mdkg goal current
mdkg goal next
mdkg pack WORK_ID
mdkg task done WORK_ID --checkpoint "Meaningful milestone"
mdkg validate
```

## Work Node Types Section

```markdown
## Built around familiar SDLC shapes.

mdkg models software work with familiar SDLC shapes: goals route long-running objectives; epics and features group deliverables; tasks, bugs, tests, and spikes define concrete work; checkpoints record evidence before closeout.

This gives humans and agents a shared operating model without adding a hosted project-management system.
```

## Plan → Work → Evidence Explainer

```markdown
## Plan → Work → Evidence

**Plan** captures durable intent: goals, epics, PRDs, engineering designs, decisions, and rules.

**Work** captures executable units: features, tasks, bugs, tests, and research spikes.

**Evidence** captures proof: checkpoints, receipts, archives, audits, and validation output.

mdkg keeps these connected in Markdown so agents can build bounded context instead of browsing a repo ad hoc.
```

## Work, Context, Evidence Reference Model

```markdown
## Work, context, and evidence are different things.

Agents need to know what to do, what to know, and what proves the current state. Those are related, but they are not the same thing.

```yaml
scope_refs:
  - task-12
context_refs:
  - dec-3
  - prd-1
evidence_refs:
  - checkpoint-8
  - archive://audit.report
```

- `scope_refs` describe executable work scope.
- `context_refs` describe background, plans, decisions, and read-only context.
- `evidence_refs` describe proof, receipts, checkpoints, archives, and audits.
```

## Low-Dependency / Local-First Section

```markdown
## Low-dependency by design.

mdkg is intentionally boring infrastructure: TypeScript, modern Node, Markdown, Git, and local generated artifacts.

Markdown remains canonical. Generated indexes are rebuildable. SQLite is used where useful for local cache and advanced project DB workflows, but it is not hidden authority.

This keeps the project memory layer inspectable, diffable, portable, and easier to reason about.
```

## Handoffs Section

```markdown
## Handoffs without raw project dumps.

`mdkg handoff create` builds copy-ready handoff prompts from graph context, goal/work state, latest checkpoints, boundaries, required checks, next actions, and raw-marker warnings.

Handoff warnings are safety aids, not comprehensive secret scanning.
```

## Advanced Alpha Section

```markdown
## Advanced alpha surfaces

mdkg also includes advanced public-alpha capabilities for larger workflows: read-only MCP, subgraphs, bundles, archives, graph movement, workflow mirrors, and optional local queues.

They are documented for early adopters; the first-run path does not depend on them.
```

## Trust Section

```markdown
## Local-first trust boundaries

mdkg does not host your repo, create a hosted index, or execute work automatically.

Project memory lives in Markdown and Git. Generated indexes are rebuildable. Optional SQLite-backed state stays local. MCP is read-only in this release, and mdkg does not execute skill scripts.

Keep secrets, raw prompts, provider payloads, tokens, private keys, and sensitive production data out of graph nodes.
```

## Alpha Page Draft

```markdown
# Developer preview

Markdown Knowledge Graph is in pre-v1 public alpha.

The core project-memory workflow is usable today: initialize a repo, model work, build packs, create handoffs, record checkpoint evidence, and validate the graph.

Advanced graph/cache/bundle/database contracts may change before v1. Start with a small repo, keep secrets out of graph nodes, and open an issue if the workflow breaks down.
```

## Docs Home Draft

```markdown
# Markdown Knowledge Graph Docs

Markdown Knowledge Graph is git-native project memory for AI coding agents and AI-assisted software engineering.

Use these docs to install mdkg, initialize a repo, model goals and work nodes, build deterministic packs, create handoffs, record evidence, and validate the graph before closeout.

## Start here

1. Install mdkg.
2. Run the quickstart.
3. Learn the Plan → Work → Evidence loop.
4. Give an agent a bounded work node.
5. Record checkpoint evidence.
6. Validate before moving on.

## Core concepts

- Source of truth
- Local-first and low-dependency
- Repository layout
- Plan → Work → Evidence
- Work node types
- Reference types: scope, context, evidence
```

## mdkg.dev /docs Fallback Bridge

Prefer redirect. If a bridge is required:

```markdown
# Markdown Knowledge Graph Docs

The Markdown Knowledge Graph documentation is hosted at docs.mdkg.dev.

Use the docs to install mdkg, learn the Plan → Work → Evidence loop, build deterministic packs, create handoffs, record evidence, and validate project memory.

[Open docs]
```

Do not mention Starlight, preview deployment, future canonical host, GitBook renderer, or repo sync on this public page.

## Generated CLI Reference Fallback

```markdown
# CLI Reference

CLI reference is expanding during public alpha.

Start with the core commands below. For complete live behavior, run `mdkg --help` and command-specific help in your installed version.

## Core commands

- `mdkg init --agent` — initialize repo-local project memory for human/agent workflows.
- `mdkg index` — rebuild the local access cache.
- `mdkg status` — inspect repo/package/graph health.
- `mdkg new` — create graph nodes and workflow files.
- `mdkg show` — inspect a node.
- `mdkg search` — find graph nodes.
- `mdkg goal` — manage long-running objectives and active work.
- `mdkg task` — start, update, and complete task-like work nodes.
- `mdkg pack` — build deterministic context for a work node.
- `mdkg handoff create` — create copy-ready agent handoffs.
- `mdkg validate` — validate graph integrity and warnings.
- `mdkg skill` — manage repo-local agent skills and mirrors.
- `mdkg fix` — plan and apply selected repairs, including ID repair.
```

## Public Roadmap Draft

```markdown
# Roadmap

Markdown Knowledge Graph is in developer preview and pre-v1 public alpha.

## Now

- Polish first-run setup.
- Improve docs and quickstart flows.
- Explain work node types and the Plan → Work → Evidence loop.
- Align mdkg.dev, docs, README, and npm metadata.
- Add useful minimal CLI reference.

## Next

- Configurable skill mirror destinations.
- Richer handoff examples.
- Demo repo and recorded walkthrough.
- Generated CLI reference from command metadata.
- Better guides for spikes, checkpoints, and agent handoffs.

## Later

- Deeper subgraph and bundle guides.
- Read-only MCP integration guide.
- Template graph examples.
- v1 contract hardening.
- Optional visual graph inspection.
```

## llms.txt Draft

```text
# Markdown Knowledge Graph

Markdown Knowledge Graph (mdkg) is git-native project memory for AI coding agents and AI-native software engineering.

## Core promise

- Structured Markdown and frontmatter stay in the repo.
- mdkg builds deterministic context packs, goals, checkpoints, skills, and handoffs.
- Markdown is the source of truth; generated indexes are rebuildable.
- mdkg does not execute work automatically.
- mdkg does not execute skill scripts.
- MCP is read-only in the current public alpha.
- Advanced graph/cache/bundle/database contracts may change before v1.

## Start

- Install: npm install -g mdkg
- Initialize: mdkg init --agent
- Index: mdkg index
- Inspect: mdkg status
- Validate: mdkg validate
- Pack context: mdkg pack WORK_ID
- Handoff: mdkg handoff create WORK_ID

## Important pages

- https://mdkg.dev/
- https://mdkg.dev/quickstart
- https://mdkg.dev/trust
- https://mdkg.dev/alpha
- https://docs.mdkg.dev/

## Agent guidance

Agents should prefer `mdkg pack WORK_ID` over ad hoc file lists when building context for bounded work.
```
