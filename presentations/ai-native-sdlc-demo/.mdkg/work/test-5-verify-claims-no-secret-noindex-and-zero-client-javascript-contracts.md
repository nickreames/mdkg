---
id: test-5
type: test
title: Verify claims no-secret noindex and zero client JavaScript contracts
status: done
priority: 1
epic: epic-2
parent: goal-2
prev: test-4
next: test-6
tags: [ai-native-sdlc, presentation-demo, phase-2, step-9]
owners: [shared-source-writer]
links: []
artifacts: [artifacts/demo-platform/public-safety-visibility-zero-js-receipt.json]
relates: []
blocked_by: []
blocks: []
refs: [goal-2, epic-2, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-6, task-7, task-8, test-4]
context_refs: [goal-2, epic-2, prd-1, edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6, task-6, task-7, task-8, test-4]
evidence_refs: []
aliases: [phase-2-step-9]
skills: [build-pack-and-execute-task, verify-close-and-checkpoint]
cases: [claim_provenance, sanitized_source_execution_evidence, no_secrets_or_raw_payloads, listed_navigation, noindex_metadata, sitemap_exclusion, no_remote_runtime_assets, no_client_directives, no_emitted_javascript_or_hydration]
created: 2026-07-26
updated: 2026-07-26
---

# Overview

Validate verify claims no-secret noindex and zero client javascript contracts as step 9 of Goal 2. A passing result must include exact commands or observations, reviewed outputs, and public-safe evidence.

# Target / Scope

- Claim provenance and sanitized source-versus-executed evidence.
- Independent `listed` and `noindex` behavior across navigation, direct routes, metadata, and sitemap.
- No forbidden secret/prompt/provider fields, remote runtime assets, client directives, emitted JavaScript, hydration metadata, or unexpected scripts.
- Layout/accessibility/weight and fork/bootstrap checks are owned by tests 4 and 6.

# Preconditions / Environment

- Goal 2 Activation Conditions and writer ownership are accepted.
- All predecessor nodes are done with evidence.
- The current source, Git, graph, artifact, and provider state has been re-read where applicable.

# Test Cases

- `npm run smoke:mdkg-dev-seo`, `npm run smoke:mdkg-dev`, and the dedicated demo safety assertions pass against built output.
- Every user-visible capability statement resolves to an accepted claim/evidence row; `mdkg-dev/CLAIMS.md` matches the implemented state.
- Sanitization fixtures reject credentials, tokens, cookies, raw prompts, provider payloads, unrelated private context, and unsupported claims.
- `listed: false` removes a demo from gallery/navigation without breaking its direct route.
- `noindex: true` emits the accepted robots metadata and excludes the demo from sitemap discovery independently of `listed`.
- Built demo routes contain no remote fonts/scripts/runtime assets, `client:*` directives, emitted JavaScript bundles, hydration metadata, or unexpected `<script>` tags.
- `public-safety-visibility-zero-js-receipt.json` records claim rows, prohibited-field scans, gallery/navigation/sitemap inventories, route metadata, built script/JS inventory, commands/exits, warnings, and pass/blocker result.
- Any skipped, unavailable, or unreviewed case is a failure or explicit blocker.

# Results / Evidence

Pending activation. Populate `artifacts/demo-platform/public-safety-visibility-zero-js-receipt.json` with pass/fail evidence for every declared case.

# Notes / Follow-ups

- Do not advance to test-6 until the required result is evidenced.
