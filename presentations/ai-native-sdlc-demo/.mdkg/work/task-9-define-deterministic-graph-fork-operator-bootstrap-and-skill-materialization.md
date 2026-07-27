---
id: task-9
type: task
title: Define deterministic graph fork operator bootstrap and skill materialization
status: backlog
priority: 1
epic: epic-2
parent: goal-2
prev: task-8
next: task-10
tags: [ai-native-sdlc, presentation-demo, phase-2, step-6]
owners: [program-orchestrator]
links: []
artifacts: [artifacts/demo-platform/fork-contract.md, artifacts/demo-platform/operator-materialization-manifest.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-2, epic-2, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-8]
context_refs: [goal-2, epic-2, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-8]
evidence_refs: []
aliases: [phase-2-step-6]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Define deterministic graph fork operator bootstrap and skill materialization. This is step 6 of 10 in Goal 2; it owns only the outcome named here and the authority granted by goal-2.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-2.
- Run fork commands from the repository root. Freeze the two command shapes as `mdkg graph fork examples/website-demo-template/.mdkg --target presentations/ai-native-sdlc-demo/runs/demo-002 --start-goal goal-1 --json` and the equivalent `demo-003` target.
- Bind every fork receipt to the canonical source tree hash, preserved source `goal-1`, target root, generated file inventory, and specialized `goal-1`.
- Materialize `AGENTS.md`, `AGENT_START.md`, `CLAUDE.md`, `CLI_COMMAND_MATRIX.md`, `DEMO_HANDOFF_PROMPT.md`, `DESIGN.md`, `WEBSITE_DEMO_TEMPLATE_BRIEF.md`, `CREATIVE_PRODUCTION_INTAKE.md`, `llms.txt`, and the `.agents/skills` and `.claude/skills` projections from an explicit hash-checked manifest.
- Define `artifacts/demo-platform/operator-materialization-manifest.json` with source path, target path, SHA-256, mode, required/optional flag, and projection-family fields; its companion receipt records the command, source tree hash, generated inventory, and repeat-run result.
- Materialization is idempotent only when every target hash matches the manifest. Missing inputs, unexpected targets, mismatched skill mirrors, or content drift fail closed before specialization.
- Fail if the target exists unexpectedly, a required operator file or skill mirror is absent, an ID changes, or the fork is not validation- and pack-ready.
- Keep all work local; publication and root registration of run graphs are forbidden.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-10 does not begin until this node is verified.

# Files Affected

- Only the exact allowlist established by goal-2 at activation.
- Program evidence under this nested graph.
- No unrelated root, product, Git, or provider surface.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- Static build emits all required detail and output routes.
- Built output has no client directives or generated JavaScript.
- listed/noindex, navigation, sitemap, source-versus-specialized evidence, and component selection are deterministic.
- Accessibility, responsive, claims, no-secret, and 500 KiB/250 KiB budgets pass.
- Fork startup and operator/skill materialization validate from an empty target.
- Repeating materialization from the same accepted source produces the same file list and content hashes or an explicit drift failure.

# Links / Artifacts

- goal-2
- epic-2
- Evidence pending activation.
