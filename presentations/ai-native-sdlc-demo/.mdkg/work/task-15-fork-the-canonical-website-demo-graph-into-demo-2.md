---
id: task-15
type: task
title: Fork the canonical website demo graph into Demo 2
status: done
priority: 1
epic: epic-4
parent: goal-4
prev: spike-4
next: task-16
tags: [ai-native-sdlc, presentation-demo, phase-4, step-2]
owners: [program-orchestrator]
links: []
artifacts: [runs/demo-002/BOOTSTRAP_RECEIPT.json, artifacts/demo-002/fork-receipt.json, artifacts/demo-002/source-goal-1.md]
relates: []
blocked_by: []
blocks: []
refs: [goal-4, epic-4, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, spike-4]
context_refs: [goal-4, epic-4, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, spike-1, spike-4]
evidence_refs: []
aliases: [phase-4-step-2]
skills: [select-work-and-ground-context, verify-close-and-checkpoint]
created: 2026-07-26
updated: 2026-07-27
---

# Overview

Fork the canonical website demo graph into Demo 2. This is step 2 of 9 in Goal 4; it owns only the outcome named here and the authority granted by goal-4.

# Acceptance Criteria

- The named outcome is complete and matches prd-1, edd-1, dec-1 through dec-6, and goal-4.
- From the repository root run the accepted wrapper exactly:
  `node scripts/bootstrap-website-demo-run.js --source examples/website-demo-template --target presentations/ai-native-sdlc-demo/runs/demo-002 --start-goal goal-1 --manifest presentations/ai-native-sdlc-demo/artifacts/demo-platform/operator-materialization-manifest.json --receipt presentations/ai-native-sdlc-demo/runs/demo-002/BOOTSTRAP_RECEIPT.json`.
- Require its embedded canonical fork command to remain
  `mdkg graph fork examples/website-demo-template/.mdkg --target presentations/ai-native-sdlc-demo/runs/demo-002 --start-goal goal-1 --json`.
- Preserve the local ID `goal-1`, record the source tree hash and fork receipt, and prove the target is a writable run graph rather than a root subgraph.
- Write `artifacts/demo-002/fork-receipt.json` with command, source root, source tree SHA-256, source `goal-1` QID/title/hash, target root, target `goal-1` QID/title/hash, created-file inventory, timestamp, and validation result.
- Capture the unmodified source goal at `artifacts/demo-002/source-goal-1.md`; target existence, ID drift, source hash drift, or validation failure stops this node without replacing files.
- Do not specialize source content until the unmodified fork plus operator
  bootstrap validates and its source identity is sealed.
- Bind Demo 2 to the exact canonical source graph hash and reserved ID/routes.
- Create the run through deterministic fork plus complete operator and skill materialization.
- Specialize requirements, design, authority, goal, work, and tests while preserving lineage.
- Complete local child execution, adapter integration, static/public-safety gates, and fallback capture.
- Do not stage, commit, push, inspect deployments, or claim public availability.
- Changed surfaces, commands, decisions, warnings, and artifacts are recorded in public-safe evidence.
- The successor task-16 does not begin until this node is verified.

# Files Affected

- Only the exact allowlist established by goal-4 at activation.
- Program evidence under this nested graph.
- No unrelated root, product, Git, or provider surface.

# Implementation Notes

- Re-read the active writer lease and current state immediately before mutation.
- Prefer deterministic mdkg, build, Git, and provider receipts over narrative claims.
- Keep raw prompts, credentials, tokens, cookies, provider payloads, and unrelated private context out of artifacts.
- Stop rather than broaden scope or authority.

# Test Plan

- Fork receipt preserves IDs and binds the exact source hash.
- The specialized graph validates, routes correctly, and differs visibly from the source.
- The local output is static, zero-JavaScript, accessible, noindex/unlisted, public-safe, responsive, and within budgets.
- Adapter routes work locally and candidate/fallback hashes and receipts verify.
- No Git or provider side effect occurred.

# Links / Artifacts

- goal-4
- epic-4
- Evidence pending activation.
