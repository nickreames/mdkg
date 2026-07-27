---
id: task-9
type: task
title: Implement deterministic graph fork operator bootstrap and skill materialization
status: backlog
priority: 1
epic: epic-2
parent: goal-2
prev: task-8
next: task-10
tags: [ai-native-sdlc, presentation-demo, phase-2, step-6]
owners: [shared-source-writer]
links: []
artifacts: [artifacts/demo-platform/fork-contract.md, artifacts/demo-platform/operator-materialization-manifest.json, artifacts/demo-platform/task-9-bootstrap-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-2, epic-2, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-8]
context_refs: [goal-2, epic-2, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-8]
evidence_refs: []
aliases: [phase-2-step-6]
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Implement deterministic graph fork operator bootstrap and skill materialization. This is step 6 of 10 in Goal 2; it owns only the outcome named here and the authority granted by goal-2.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-2.
- The accepted Goal 2 mutation receipt still matches HEAD, paths, hashes, owner, and quiet window.
- Run fork commands from the repository root. Freeze the two command shapes as `mdkg graph fork examples/website-demo-template/.mdkg --target presentations/ai-native-sdlc-demo/runs/demo-002 --start-goal goal-1 --json` and the equivalent `demo-003` target.
- Implement `scripts/bootstrap-website-demo-run.js` as the reusable wrapper for the fork plus manifest-checked operator/skill materialization and public-safe receipt. Its interface is `node scripts/bootstrap-website-demo-run.js --source examples/website-demo-template --target <run-root> --start-goal goal-1 --manifest presentations/ai-native-sdlc-demo/artifacts/demo-platform/operator-materialization-manifest.json --receipt <run-root>/BOOTSTRAP_RECEIPT.json`.
- Bind every fork receipt to the canonical source tree hash, preserved source `goal-1`, target root, generated file inventory, and selected target `goal-1` before specialization. Later run-specialization nodes own specialized-goal proof.
- Materialize `AGENTS.md`, `AGENT_START.md`, `CLAUDE.md`, `CLI_COMMAND_MATRIX.md`, `DEMO_HANDOFF_PROMPT.md`, `DESIGN.md`, `WEBSITE_DEMO_TEMPLATE_BRIEF.md`, `CREATIVE_PRODUCTION_INTAKE.md`, `llms.txt`, and the `.agents/skills` and `.claude/skills` projections from an explicit hash-checked manifest.
- Define `artifacts/demo-platform/operator-materialization-manifest.json` with source path, target path, SHA-256, mode, required/optional flag, and projection-family fields; its companion receipt records the command, source tree hash, generated inventory, and repeat-run result.
- Materialization is idempotent only when every target hash matches the manifest. Missing inputs, unexpected targets, mismatched skill mirrors, or content drift fail closed before specialization.
- Fail if the target exists unexpectedly, a required operator file or skill mirror is absent, an ID changes, or the fork is not validation- and pack-ready.
- The first run requires an absent target; a repeat defaults to verify-only and succeeds only with the identical generated inventory and hashes. A deliberate drift fixture must fail.
- Child validation and goal routing must pass. Build concise and standard packs with the explicit edge list `parent,epic,relates,blocked_by,blocks,prev,next,context_refs,evidence_refs`; do not attempt to add `context_refs` to configured default edges.
- Keep all work local; publication and root registration of run graphs are forbidden.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-10 does not begin until this node is verified.

# Files Affected

- Only the exact mutable paths in the accepted Goal 2 mutation receipt.
- Repository-root `scripts/bootstrap-website-demo-run.js` is future implementation source and must appear explicitly in that receipt; it is not a nested program artifact.
- Program evidence under this nested graph.
- No unrelated root, product, Git, or provider surface.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- Fork startup and operator/skill materialization validate from an empty target.
- Repeating materialization from the same accepted source produces the same file list and content hashes or an explicit drift failure.
- A deliberately changed generated file, missing manifest input, mismatched skill mirror, and unexpected pre-existing target each fail closed.
- Forked `goal-1` preserves its ID, validates, routes to its first actionable node, and produces concise and standard packs containing the required context.
- The bootstrap command emits a stable public-safe JSON receipt containing source tree hash, target, preserved IDs, generated inventory, manifest hash, validation/routing/pack results, repeat mode, and failure classification.

# Links / Artifacts

- goal-2
- epic-2
- Evidence pending activation.
