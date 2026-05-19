---
id: epic-25
type: epic
title: work work order and receipt contract hardening
status: done
priority: 2
tags: [future, work, work-order, receipt, schema, runtime-contract]
owners: []
links: []
artifacts: [.mdkg/templates/default/work.md, .mdkg/templates/default/work_order.md, .mdkg/templates/default/receipt.md, tests/fixtures/agent/valid/runtime-work/WORK.md, tests/fixtures/agent/valid/runtime-order/WORK_ORDER.md, tests/fixtures/agent/valid/runtime-receipt/RECEIPT.md, npm run test, npm run smoke:archive-work, omni-room-runtime room-trio validate]
relates: [epic-24, epic-26]
blocked_by: []
blocks: []
refs: [edd-3, edd-8]
aliases: [work-order-receipt-contracts, workflow-contract-hardening]
skills: []
created: 2026-05-17
updated: 2026-05-18
---

# Goal

Harden `WORK.md`, `WORK_ORDER.md`, and `RECEIPT.md` as first-class agent
workflow files before adding task-like lifecycle commands.

# Scope

These files remain frontmatter plus Markdown body. Frontmatter is for
deterministic parsing, indexing, validation, pack assembly, and runtime handoff.
Body content remains the place for human-readable intent, constraints, evidence,
and review context.

The public mdkg CLI/docs stay generic. Internal planning may use
`omni-room-runtime` fixtures as consumer evidence, but official npm package
language should not brand these as Omni file types.

# Milestones

- Preserve dotted portable IDs such as `work.generate-image`,
  `order.generate-image-1`, and `receipt.generate-image-1`.
- Preserve dependency refs including `skill_refs`, `tool_refs`, `model_refs`,
  `wasm_component_refs`, `runtime_image_refs`, and `subagent_refs`.
- Extend `WORK_ORDER.md` toward concrete input requirements, request refs,
  requested output shape, artifact policy, and status.
- Extend `RECEIPT.md` toward output artifact refs, cost refs, proof or
  attestation refs, verification status, and input/output hashes.
- Keep schemas free of raw secrets, credentials, ledger mutation, live payment
  state, and marketplace inventory mutation.
- Compare mdkg templates against `omni-room-runtime` fixtures before any
  implementation pass.

# Out of Scope

- No Postgres replacement. Production work orders, receipts, feedback, disputes,
  ledger, and marketplace state remain canonical in application databases.
- No lifecycle command implementation in this epic.
- No raw payload or secret storage in frontmatter.

# Risks

- Overfitting schemas to one runtime could weaken mdkg as a generic OSS
  standard.
- Too much frontmatter complexity can make authoring brittle for humans.
- Too little structure leaves runtimes unable to validate semantic mirrors.

# Closeout

Epic-25 is complete for the current `0.1.4` release line.

- `task-152` closed CLI/schema parity by adding `superseded` receipt status to
  `mdkg work receipt new|update`, docs, tests, and packed temp-repo smoke.
- `task-153` confirmed generic runtime-style fixtures and pack coverage for
  dependency refs, input/output descriptors, proof refs, artifacts, hashes, and
  `artifact://` versus `archive://` semantics.
- `task-154` closed public and seeded documentation for the semantic-mirror
  boundary: mdkg records committed mirrors and reviewable evidence, while real
  production order/receipt/payment/ledger/marketplace/execution state remains
  canonical outside mdkg.
- `task-148` remains open for post-publish consumer repo handoff prompts.

# Verification

- `npm run test`
- `npm run cli:check`
- `node dist/cli.js validate`
- `node dist/cli.js --root /Users/nick/git/omni-room-runtime/tests/fixtures/runtime-images/room-trio/workspace validate --json`
- `npm run smoke:archive-work`
- `npm run smoke:matrix`
- `npm run smoke:init`
- `npm run smoke:visibility`

# Links / Artifacts

- `task-132`
- `epic-26`
- `/Users/nick/git/omni-room-runtime`
