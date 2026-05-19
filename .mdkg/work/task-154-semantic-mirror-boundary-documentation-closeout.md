---
id: task-154
type: task
title: semantic mirror boundary documentation closeout
status: done
priority: 2
epic: epic-25
tags: [docs, semantic-mirror, postgres-boundary, receipt, work-order]
owners: []
links: []
artifacts: [README.md, CLI_COMMAND_MATRIX.md, AGENT_START.md, assets/init/README.md, assets/init/AGENT_START.md, .mdkg/core/rule-3-cli-contract.md, npm run cli:check, npm run smoke:init]
relates: [epic-25, epic-24, epic-26, task-148, task-152, task-153]
blocked_by: [task-153]
blocks: [task-148]
refs: [edd-3, edd-8, rule-3]
aliases: [semantic-mirror-boundary-docs]
skills: []
created: 2026-05-18
updated: 2026-05-18
---

# Overview

Close the documentation boundary for mdkg semantic mirrors so work contracts,
orders, receipts, archives, and visibility guidance stay clear for public OSS
users and internal runtime consumers.

# Acceptance Criteria

- README, command matrix, generated init docs, templates, and core CLI rules
  state that mdkg stores committed semantic mirrors only.
- Documentation explicitly excludes raw secrets, credentials, ledger mutation,
  live payment state, marketplace inventory mutation, and canonical production
  order or receipt state.
- Documentation explains that production systems such as Postgres remain
  canonical for real orders, receipts, feedback, disputes, ledger entries, and
  marketplace state.
- `artifact://...` and `archive://...` separation is documented in the workflow
  guidance.
- `task-148` remains the post-publish handoff task for consumer repo prompts.

# Files Affected

- `README.md`
- `CLI_COMMAND_MATRIX.md`
- `AGENT_START.md`
- `assets/init/README.md`
- `assets/init/AGENT_START.md`
- `.mdkg/core/rule-3-cli-contract.md`
- `.mdkg/templates/default/work.md`
- `.mdkg/templates/default/work_order.md`
- `.mdkg/templates/default/receipt.md`

# Implementation Notes

Keep public docs generic. Mention consumer repos only in mdkg graph work nodes
or handoff prompts, not as public CLI branding.

# Results

- Updated public and seeded docs to state that mdkg work contracts, work orders,
  and receipts are committed semantic mirrors only.
- Documented the canonical-system boundary for production orders, receipts,
  feedback, disputes, payment, ledger, marketplace inventory, fulfillment, and
  execution state.
- Documented that raw secrets, credentials, live payment state, ledger
  mutations, canonical marketplace state, and bulky raw payloads do not belong
  in mdkg work mirrors.
- Documented the `artifact://...` versus `archive://...` split in workflow
  guidance and default templates.
- Left `task-148` open as the post-publish handoff prompt task.

# Test Plan

- Run `npm run cli:check`.
- Run `npm run smoke:init`.
- Run `node dist/cli.js validate`.
- Run `git diff --check`.

# Verification

- `npm run cli:check`
- `npm run smoke:init`
- `node dist/cli.js validate`

# Links / Artifacts

- `task-148`
- `task-152`
- `task-153`
- `epic-25`
