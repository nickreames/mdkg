---
title: mdkg Public Alpha Polish PRD
status: planning snapshot
date: 2026-06-22
owner: Nicholas Reames
product: Markdown Knowledge Graph
---

# mdkg Public Alpha Polish PRD

## 1. Purpose

This document defines the product and CLI polish required before launching `mdkg.dev` publicly.

The goal is not to add more advanced surface area. Markdown Knowledge Graph already has a broad and powerful command set. The launch goal is to make the first five minutes undeniable: install, initialize, inspect, pack, handoff, record, and validate should feel coherent, trustworthy, and well-documented.

## 2. Product polish thesis

> The public alpha should sell the core solution and document the advanced surfaces, not force new users to understand the entire system.

The polished first impression should communicate:

- Markdown is the source of truth.
- Git provides reviewable history.
- mdkg builds deterministic context for agents.
- Goals/tasks/spikes/checkpoints model SDLC state.
- Handoffs help transfer work between agents/sessions.
- Validation and repair commands keep project memory trustworthy.
- SQLite/project DB/queues/subgraphs/MCP are advanced alpha surfaces.

## 3. Launch-blocking cleanup

### 3.1 Version metadata drift

Current known issue:

- `package.json` reports `0.3.7`.
- README and CLI matrix still contain `0.3.6` metadata.

Requirement:

- Clean stale version references before mdkg.dev copy extraction.
- Prefer generated version insertion or avoid hard-coded versions where possible.
- Add a pre-publish drift check.

Acceptance criteria:

- Package version, changelog latest version, README visible version, CLI matrix metadata, command contract version, and site displayed version are consistent or intentionally generated from one source.

### 3.2 README and mdkg.dev parity

The README top third and mdkg.dev homepage should agree on:

- Positioning.
- Public alpha framing.
- Install commands.
- Node requirement.
- Golden first-run path.
- Core CTAs.
- Safety boundaries at an appropriate summary level.

Acceptance criteria:

- A first-time user reading README or mdkg.dev gets the same mental model.

### 3.3 Quickstart smoke test

The quickstart must be executable in a clean environment.

Required path:

```bash
mdkg init --agent
mdkg index
mdkg status
mdkg validate
```

Then at least one demo path:

```bash
mdkg goal next
mdkg pack <id>
mdkg handoff create <id>
```

Acceptance criteria:

- CI or a local smoke script verifies the documented quickstart.
- Expected outputs or summaries are captured for docs.

## 4. First-run experience

### 4.1 `mdkg init --agent` guidance

After `mdkg init --agent`, the CLI should print clear next steps.

Required guidance:

```text
Next:
  1. Run mdkg index
  2. Run mdkg status
  3. Run mdkg validate
  4. Read .mdkg/AGENT_START.md

For first agent context:
  mdkg search <term>
  mdkg show <id>
  mdkg pack <id>
```

Potential enhancement:

- Add `mdkg init --agent --index` or run indexing by default unless `--no-index`, if technically appropriate.

Acceptance criteria:

- A user is not left wondering why status/doctor are not clean immediately after init.

### 4.2 Beginner distinction: index vs project DB

Users must understand:

- `.mdkg/index` is rebuildable access/cache infrastructure.
- `.mdkg/db` is optional project application DB state for advanced workflows.
- Markdown remains canonical.

Acceptance criteria:

- Install/quickstart docs and status output do not make SQLite feel like hidden product state.

## 5. Command family visibility

### 5.1 Core launch UX

These command families should be treated as core for public alpha onboarding:

- `init`
- `index`
- `status`
- `new`
- `show`
- `list`
- `search`
- `next`
- `goal`
- `task`
- `pack`
- `handoff`
- `checkpoint`
- `skill`
- `validate`
- `doctor`
- `fix`
- `format`
- `upgrade`

Not every core command needs equal homepage visibility. `fix`, `format`, `doctor`, and `upgrade` are trust/maintenance features and should be visible in docs but secondary on the homepage.

### 5.2 Advanced alpha docs-only surface

These command families should be documented but not central to the homepage:

- `db`
- `db queue`
- `bundle`
- `subgraph`
- `graph clone/fork/import-template`
- `archive`
- `mcp`
- advanced SPEC/WORK/ORDER/RECEIPT usage

Acceptance criteria:

- Homepage remains focused on the golden path.
- Advanced docs exist or are clearly marked as advanced alpha.

## 6. CLI command consolidation review

The command surface is broad. Before launch, review whether the command hierarchy communicates intent clearly.

Review questions:

- Are there overlapping commands that confuse new users?
- Are `show`, `list`, `search`, `next`, `goal next`, and `goal claim` clearly distinguished?
- Are read-only vs mutating commands obvious?
- Are task-like node types clear: `feat`, `task`, `bug`, `test`, `spike`?
- Is `fix` documented as a repair family rather than a magic mutation command?
- Are `graph` and `subgraph` clearly separated: authored graph movement vs read-only orchestration context?
- Are `pack` and `handoff` clearly distinguished?

Acceptance criteria:

- `AGENT_START.md`, README, docs, and CLI help guide users toward the right command for common jobs.

## 7. SKILL.md and skill mirroring enhancement

### 7.1 Current state

Canonical skills live in:

```text
.mdkg/skills/<slug>/SKILL.md
```

Current mirrors include:

```text
.agents/skills/
.claude/skills/
```

This is useful, but should become configurable for public alpha polish.

### 7.2 Requirement: configurable skill mirrors

Skill mirror destinations should be configurable and validated.

Desired capabilities:

- Configure mirror destinations in mdkg config.
- Support named presets for known agent harness folder conventions.
- Preserve `.mdkg/skills/` as canonical source.
- Allow `.agents/skills/` and `.claude/skills/` as defaults or presets.
- Validate that configured mirrors are present and synchronized.
- Report mirror health in `mdkg skill validate` and/or `mdkg status`.
- Provide clear docs explaining canonical source vs mirrors.

Potential config shape, illustrative only:

```json
{
  "skills": {
    "mirrors": [
      { "name": "agents", "path": ".agents/skills", "enabled": true },
      { "name": "claude", "path": ".claude/skills", "enabled": true },
      { "name": "custom", "path": ".custom-agent/skills", "enabled": false }
    ]
  }
}
```

The exact schema should be designed by the coding agent.

### 7.3 Requirement: agent-facing skill guidance

Generated or mirrored `SKILL.md` files should help file-aware coding agents understand:

- What mdkg is.
- When to run `mdkg pack`.
- When to run `mdkg handoff create`.
- When to use `goal next` vs `goal claim`.
- How to record checkpoints.
- How to validate before closing work.
- What commands are read-only vs mutating.
- What not to do: do not treat mdkg as an executor, do not dump secrets, do not mutate subgraph qids.

Acceptance criteria:

- A Codex-style agent, Claude Code, or other file-aware coding harness can discover mdkg usage guidance from mirrored skills without guessing.

## 8. SQLite and project DB public framing

### 8.1 Required framing

Public copy should say:

> Markdown remains the durable source of truth. SQLite is local infrastructure where it helps: rebuildable access cache, optional project DB state, and advanced queue workflows.

Avoid saying:

- “SQLite is the database behind mdkg.”
- “mdkg stores your project in SQLite.”
- “mdkg requires a runtime database for normal use.”

### 8.2 Advanced project DB docs

Project DB/queue docs should emphasize:

- Optional advanced functionality.
- Local delivery state, not canonical event history.
- Useful for advanced users, nested graphs, and agent-to-agent communication.
- Experimental/pre-v1 and likely to evolve.
- Not part of the golden first-run path.

Acceptance criteria:

- New users understand that Markdown and Git are the product’s authority layer.
- Advanced users can still discover DB/queue capabilities.

## 9. Safety boundary docs

Safety boundaries must be explicit in README, mdkg.dev, and GitBook docs.

Required statements:

- mdkg is durable semantic memory, not raw execution trace storage.
- mdkg does not execute work automatically.
- mdkg does not execute skill scripts.
- MCP is read-only in this release.
- Subgraphs are read-only planning context.
- Mutating commands reject subgraph qids.
- Visibility filtering is metadata enforcement, not arbitrary body redaction.
- Handoff raw-marker checks are warnings, not comprehensive secret scanning.
- Queue state is delivery infrastructure, not canonical runtime history.
- Internal project DB events/reducers/leases/materializers are not public CLI surfaces yet.

Acceptance criteria:

- Safety boundaries page exists.
- Handoff docs include raw-marker limitations.
- MCP docs emphasize read-only scope.
- Project DB docs do not imply production execution state.

## 10. Generated documentation and command contract

The broad command surface should not be hand-documented from scratch.

Requirements:

- Generate command docs from command metadata where possible.
- Publish or link `command-contract.json`.
- Include command mutability/safety notes.
- Include output formats.
- Include examples for core commands.
- Include advanced alpha labels for advanced command families.

Acceptance criteria:

- Generated CLI reference can be rebuilt before release.
- Docs drift is reduced.

## 11. Node/runtime requirements

The install path must clearly state required Node version, especially because mdkg uses modern Node capabilities such as `node:sqlite`.

Required docs:

- Required Node version.
- How to check Node version.
- What error users might see if Node is too old.
- Recommended install options.
- Why SQLite is local infrastructure.

Acceptance criteria:

- A user does not discover Node incompatibility only after a confusing install failure.

## 12. Demo support polish

The CLI should support a clean demo path.

Requirements:

- Nested demo repo validates cleanly.
- Demo graph contains at least one goal, spike, task, checkpoint, decision, skill, and handoff example.
- Demo commands generate stable output suitable for docs/video.
- Demo can be reset or regenerated.
- Demo does not require private environment variables or external services.

Acceptance criteria:

- Demo can power mdkg.dev copy, screen recording, and GitBook quickstart examples.

## 13. Pre-publish hardening checklist

Required checks:

- Version drift check.
- Command contract generation check.
- README/site parity check.
- Quickstart smoke test.
- Demo repo validation.
- Link check.
- Site build.
- GitBook source check.
- Changelog latest release check.
- Node version requirement check.
- Package install check, if feasible.

## 14. Launch readiness summary

Markdown Knowledge Graph is ready for mdkg.dev public alpha when:

- The golden path is easy to run.
- Public positioning is consistent.
- Version metadata is clean.
- README and mdkg.dev agree.
- Docs distinguish core and advanced alpha surfaces.
- Safety boundaries are explicit.
- Skills/mirrors are documented and preferably configurable.
- Demo repo exists and validates.
- Pre-publish checks reduce drift risk.

## 15. Summary

The product already has enough power. The polish work should reduce cognitive load, improve first-run reliability, make agent usage obvious, and protect trust through honest public alpha boundaries.
