---
title: mdkg CLI and Agent UX EDD
status: planning snapshot
date: 2026-06-22
owner: Nicholas Reames
product: Markdown Knowledge Graph
---

# mdkg CLI and Agent UX EDD

## 1. Purpose

This document defines the desired CLI and agent UX for Markdown Knowledge Graph public alpha.

The central goal is that a human developer or AI coding agent can enter a repo, discover mdkg guidance, build deterministic context, execute work outside mdkg, record structured state/evidence, and validate before closing the loop.

mdkg should feel like a safe, inspectable project-memory layer rather than an autonomous executor.

## 2. Core agent UX thesis

> Agents should not guess how to use a repo’s memory. They should read startup docs and skills, use safe discovery commands, build deterministic packs, record checkpoints, and validate state before handing off or stopping.

The desired behavior is:

1. Agent reads `AGENT_START.md`.
2. Agent reads relevant skill instructions.
3. Agent uses `mdkg status`, `goal current`, `goal next`, `show`, `search`, and `pack` for discovery.
4. Agent uses `goal claim` or `task start` only when it is intentionally mutating lifecycle state.
5. Agent executes work using normal tools outside mdkg.
6. Agent records evidence/checkpoints through mdkg.
7. Agent runs required checks itself and records outcomes.
8. Agent runs `mdkg validate` before claiming done.
9. Agent creates `mdkg handoff create` when transferring context.

## 3. Golden agent loop

### Goal-driven loop

```bash
mdkg status
mdkg goal current
mdkg goal next
mdkg pack <work-id>
mdkg goal claim <work-id>
# execute selected concrete work outside mdkg
# run required checks outside mdkg
mdkg task done <work-id> --checkpoint "Meaningful milestone"
mdkg goal evaluate <goal-id>
mdkg validate
```

Important semantics:

- `goal next` is read-only.
- `goal claim` is mutating and records active node.
- Required checks are report-only guidance; agents must run commands and record evidence.
- Completed goals move `active_node` to `last_active_node` and should not look actionable.

### Concrete work loop

```bash
mdkg show <id>
mdkg pack <id>
mdkg task start <id>
# do work outside mdkg
mdkg task done <id> --checkpoint "Meaningful milestone"
mdkg validate
```

### Handoff loop

```bash
mdkg handoff create <id>
```

Use when:

- Switching agents.
- Switching sessions.
- Handing work to a human.
- Sanitizing context for a bounded next action.

## 4. Agent startup documents

### 4.1 `AGENT_START.md`

`AGENT_START.md` should remain the canonical first-hop doc.

It should tell agents:

- Trust source code and tests first.
- Then trust mdkg rules, design docs, decisions, and work nodes.
- Then trust `SOUL.md` and `HUMAN.md`.
- Then trust relevant skills.
- Then trust prior chat history.
- Prefer `mdkg pack <id>` over ad hoc file lists.
- Use `mdkg show/search/next/goal` for discovery.
- Use mutating lifecycle commands intentionally.
- Run and record required checks.
- Do not treat mdkg as an executor.
- Do not dump secrets or raw provider payloads into graph state.
- Do not mutate subgraph qids.

### 4.2 Agent startup acceptance criteria

A new agent should be able to answer:

- What is mdkg?
- What should I read first?
- How do I find current work?
- How do I build context?
- How do I start/claim work?
- How do I record progress?
- How do I validate?
- How do I hand off safely?
- What must I not do?

## 5. SKILL.md and agent skill UX

### 5.1 Canonical skill source

Canonical mdkg skills should live at:

```text
.mdkg/skills/<slug>/SKILL.md
```

Mirrors should be generated into agent-facing folders.

Current defaults include:

```text
.agents/skills/
.claude/skills/
```

### 5.2 Configurable mirrors

Public alpha polish should make skill mirror destinations configurable.

Required capabilities:

- Configurable mirror paths.
- Validation for configured mirrors.
- Clear status output for canonical source and mirror health.
- Safe sync behavior.
- Docs explaining how teams can support preferred agent harnesses.

Potential mirror concepts:

- `canonical`: `.mdkg/skills/<slug>/SKILL.md`
- `mirror`: `.agents/skills/<slug>/SKILL.md`
- `mirror`: `.claude/skills/<slug>/SKILL.md`
- `custom mirror`: user-configured path

### 5.3 Agent skill content requirements

A core mdkg skill should include:

- Product summary.
- Trust hierarchy.
- Golden loops.
- Read-only commands.
- Mutating commands.
- Safety boundaries.
- Examples for `pack`, `handoff`, `goal next`, `goal claim`, `task done`, and `validate`.
- What to do if graph validation fails.
- What to do if status reports stale index.
- How to interpret public/internal/private visibility.
- How to avoid writing secrets, raw prompts, or provider payloads.

## 6. Read-only vs mutating command clarity

Agents must be able to distinguish safe inspection from state mutation.

### Read-only discovery commands

Examples:

- `mdkg status`
- `mdkg show <id>`
- `mdkg list`
- `mdkg search <query>`
- `mdkg next`
- `mdkg goal show <goal-id>`
- `mdkg goal current`
- `mdkg goal next`
- `mdkg graph refs <id>`
- `mdkg capability ...` read commands
- `mdkg skill list/show/search`
- `mdkg validate`
- `mdkg doctor`, except any future mutating variants

### Mutating commands

Examples:

- `mdkg init`
- `mdkg upgrade --apply`
- `mdkg new`
- `mdkg task start/update/done`
- `mdkg goal activate/claim/pause/resume/done/archive/clear`
- `mdkg checkpoint create`
- `mdkg handoff create`, if it writes files
- `mdkg skill new/sync`
- `mdkg archive ...` mutating commands
- `mdkg graph clone/fork/import-template --apply`
- `mdkg fix apply` / `fix ids --apply`
- `mdkg format --apply`
- `mdkg db ...` mutating commands

CLI help, generated docs, and agent skills should label mutability.

## 7. Command selection guidance

### `show` vs `pack`

Use `show` when:

- Inspecting a single node.
- Confirming metadata.
- Reading a concise current state.

Use `pack` when:

- Giving an agent context to work.
- Pulling related scope/context/evidence.
- Preparing deterministic context for a task/goal/spike.

### `pack` vs `handoff`

Use `pack` when:

- The agent needs source context to work.
- Full node content and related refs are appropriate under visibility rules.

Use `handoff create` when:

- Transferring work to another agent/session.
- Summarizing next actions, boundaries, latest checkpoint, and required checks.
- Avoiding raw body dumping.

### `goal next` vs `goal claim`

Use `goal next` when:

- Discovering the next recommended work item.
- Staying read-only.

Use `goal claim` when:

- Recording that a specific node is now active.
- Beginning concrete work under a goal.

### `task start` vs `goal claim`

Use `goal claim` for goal-driven routing.

Use `task start` for task-like lifecycle state on a concrete node.

Agents may use both when appropriate, but should avoid mutating lifecycle state casually.

## 8. Node lifecycle guidance

Task-like nodes:

- `feat`
- `task`
- `bug`
- `test`
- `spike`

Lifecycle:

```bash
mdkg task start <id>
mdkg task update <id> ...
mdkg task done <id> --checkpoint "..."
```

Spikes are actionable research/planning nodes. They do not run research automatically. Agents should record:

- research question
- context
- sources/evidence
- findings
- options
- recommendation
- follow-up tasks/tests/skills
- docs or mdkg.dev implications

## 9. Handoff UX

`mdkg handoff create` is a launch-hero command and should be optimized for clarity.

Handoffs should include:

- goal/work state
- selected node
- latest checkpoint
- boundaries
- required checks
- next actions
- relevant context/evidence refs
- raw-marker warnings

Handoffs should not imply comprehensive sanitization.

Docs and CLI output should say:

> Handoff warnings are safety aids, not comprehensive secret scanning.

## 10. Validation UX

Validation should be part of the golden loop.

Agents should run:

```bash
mdkg validate
```

Before:

- marking work done
- completing goals
- creating final handoffs
- asking humans to review state

If validation fails, agent guidance should say:

1. Read validation diagnostics.
2. Do not ignore graph errors.
3. Fix broken references or lifecycle state.
4. Use `mdkg doctor --strict --json` for structured diagnostics when needed.
5. Use `mdkg fix plan` before applying repair commands.
6. Only use mutating repair commands with clear intent.

## 11. Status and doctor UX

`mdkg status` should be the operator summary.

It should clearly report:

- package/release state
- git state
- graph validity
- selected/current goal
- project DB state, if enabled
- generated cache freshness
- next recommended maintenance steps

`mdkg doctor --strict --json` should support scripts and agents with stable diagnostic IDs, severity, remediation, and refs.

## 12. Subgraph safety guidance

Agents need clear rules:

- Subgraph qids such as `child_repo:task-1` are read-only references.
- They can be used for planning context.
- Local ownership fields remain local-only.
- Mutating commands reject subgraph qids.
- To change child state, operate in the child repo directly through that repo’s mdkg graph.

## 13. MCP safety guidance

MCP should be documented as read-only.

Expose:

- status
- workspace/subgraph listing
- search
- show
- bounded in-memory pack
- goal current/next
- validation

Do not expose:

- mutation
- queue
- event surfaces
- archive mutation
- format mutation
- SQL
- shell
- arbitrary file reads
- environment
- secrets

This is a trust differentiator and should be clear in docs.

## 14. Failure modes to document

Agents and users should know how to respond to:

- Stale or missing index after init.
- Node not found.
- Validation errors.
- Duplicate IDs after branch merge.
- Private/internal refs in public bundles/packs.
- Skill mirror drift.
- Required checks not run.
- Archived goals excluded from routing.
- Completed goals with `last_active_node` history.
- Paused queues or leased queue messages, for advanced users.
- Attempts to mutate subgraph qids.

## 15. CLI help improvements

Each command family should expose:

- Short purpose.
- Common examples.
- Mutability label.
- Related commands.
- JSON output availability.
- Safety notes when relevant.

Example help concepts:

```text
Read-only: yes
Mutates graph: no
Useful before: mdkg pack <id>
Useful after: mdkg validate
```

Exact format is implementation-specific.

## 16. Public docs examples

The docs should include recipes for:

- New repo initialization.
- Give an agent one goal ID.
- Build a deterministic pack.
- Create and close a spike.
- Record a checkpoint.
- Create a handoff.
- Configure skill mirrors.
- Repair duplicate IDs after branch conflict.
- Inspect status and doctor output.

## 17. Summary

The CLI and agent UX should make mdkg safe and predictable for both humans and file-aware coding agents. The system should guide agents toward deterministic context packs and structured lifecycle state while making mutation boundaries, safety caveats, and validation expectations explicit.
