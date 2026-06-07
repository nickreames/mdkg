---
id: task-303
type: task
title: write downstream adoption handoff for root and child repos
status: done
priority: 2
epic: epic-61
parent: goal-9
prev: task-302
next: task-304
tags: [downstream, handoff, adoption]
owners: []
links: []
artifacts: [checks://git-diff-check]
relates: [goal-9, epic-61]
blocked_by: [task-302]
blocks: [task-304]
refs: [edd-15, dec-26, dec-27]
aliases: [0-3-0-downstream-handoff]
skills: [author-mdkg-skill]
created: 2026-06-06
updated: 2026-06-06
---
# Overview

Prepare downstream repos to adopt 0.3.0 deliberately after mdkg is accepted or
published.

# Acceptance Criteria

- Handoff explains optional SPEC adoption, work invocation commands, receipt verification, queue bridge, and no-secret boundaries.
- Handoff separates local accepted SHA, root subgraph refresh, and package-published adoption paths.
- No downstream repo is mutated in this task.

# Files Affected

- Handoff evidence in mdkg nodes or docs selected by the task.

# Implementation Notes

- Keep root and child adoption as follow-up work, not part of package publish readiness.

# Test Plan

- `node dist/cli.js validate`
- `node dist/cli.js capability search "downstream adoption" --json`

# 0.3.0 Downstream Adoption Handoff

This handoff is for root and child repos after the mdkg 0.3.0 source changes
are accepted, and separately after the package is actually published. It does
not mutate any downstream repo.

## What 0.3.0 Adds

- Optional `SPEC.md` capability records. Repos without SPEC files remain valid.
  When a repo does opt in, `mdkg spec list/show/validate` is the focused command
  family and `mdkg capability ...` remains the broader read-only discovery
  surface.
- Concrete SPEC and WORK linkage. SPEC and WORK capability records can expose
  read-only linkage arrays for related work contracts, work orders, and
  receipts.
- Deterministic work invocation mirrors. `mdkg work trigger` creates a
  submitted `WORK_ORDER.md` mirror from a WORK contract, or from a SPEC that has
  exactly one resolvable work contract. It never executes work.
- Review helpers. `mdkg work order status` reports order state and linked
  receipts; `mdkg work receipt verify` validates linkage, evidence hashes,
  archive refs, outcome, and redaction-policy checks.
- Optional queue delivery bridge. `mdkg work trigger --enqueue <queue>` requires
  an initialized, migrated, verified project DB and an explicitly created active
  local queue. It records a queue delivery message with `executed: false`; the
  queue remains local delivery state, not canonical event history.
- No-secret semantic mirror boundaries. SPEC, WORK, WORK_ORDER, and RECEIPT
  records must not store raw secrets, auth headers, live payment state, ledger
  mutations, marketplace inventory, fulfillment records, or canonical runtime
  state.

## Adoption Paths

### Local accepted SHA path

Use this only when a downstream repo is intentionally testing the mdkg source
worktree or a specific accepted commit before npm publication.

- Record the mdkg source SHA under the downstream repo's own task or goal.
- Use a local tarball or source checkout only as a temporary validation input.
- Run the downstream repo's normal mdkg validation plus any repo-specific
  smoke tests.
- Do not describe this path as public package availability.

### Root subgraph refresh path

Use this when a root repo tracks child mdkg graphs as subgraphs and needs
planning visibility into a child repo after 0.3.0 adoption.

- In the child repo, adopt mdkg 0.3.0 deliberately and validate there first.
- Create or refresh the child bundle according to the child repo's policy.
- In the root repo, run `mdkg subgraph sync <alias> --dry-run --json` first.
- Review the dry-run receipt, then run `mdkg subgraph sync <alias> --json` only
  when the child source is clean and the root-owned bundle update is intended.
- Do not mutate materialized inspection trees; they are generated read-only
  state.

### Package-published adoption path

Use this after `mdkg@0.3.0` is published to npm and verified from the registry.

- Install or upgrade mdkg using the repo's normal package path.
- Run `mdkg --version` and confirm `0.3.0`.
- Run `mdkg upgrade --dry-run --json` and inspect preserved customizations.
- Run `mdkg upgrade --apply --json` only after the repo owner accepts the
  scaffold/template/doc changes.
- Run `mdkg index`, `mdkg validate`, and the repo's mdkg-specific smoke checks.
- Adopt `SPEC.md` only where the repo has a real reusable capability surface to
  describe. Do not create placeholder SPEC files just because 0.3.0 supports
  them.

## Copy-Ready Megaprompt

```text
You are working in a downstream repo that already uses mdkg. Upgrade the repo's
mdkg graph and scaffolds for mdkg 0.3.0, but do not publish, tag, push, or
mutate unrelated product code.

Ground first:
- Read AGENTS.md or AGENT_START.md.
- Run git status --short.
- Run mdkg --version and record whether it is 0.3.0.
- Run mdkg upgrade --dry-run --json.
- Run mdkg index and mdkg validate.

Adoption rules:
- SPEC.md is optional. Repos with no SPEC files must remain valid.
- Add or update SPEC.md only for real reusable capability surfaces.
- Preserve downstream-local templates, custom docs, and product-specific
  examples unless the repo owner explicitly asks to replace them.
- Treat WORK.md, WORK_ORDER.md, and RECEIPT.md as committed semantic mirrors
  only. Do not store raw secrets, auth headers, live payment state, ledger
  mutations, marketplace inventory, fulfillment records, or canonical runtime
  state.
- Use refs, hashes, archive refs, artifact refs, and redacted summaries for
  evidence.

If upgrade is accepted:
- Run mdkg upgrade --apply --json.
- Run mdkg index.
- Run mdkg validate.
- Run mdkg capability list --kind spec --json.
- Run mdkg spec list --json.
- If the repo has a real WORK contract, smoke:
  mdkg work trigger <work-or-spec-ref> --json
  mdkg work order status <created-order> --json
  mdkg work receipt verify <created-receipt> --json
- If testing queue delivery, first initialize/migrate/verify project DB, create
  an explicit local queue with mdkg db queue create <queue>, then run
  mdkg work trigger <work-or-spec-ref> --enqueue <queue> --json. Confirm the
  queue message has executed:false and do not run worker execution from mdkg.

Closeout:
- Record what changed, what was preserved, and which checks passed.
- If this is a child repo used by a root subgraph, create or refresh its bundle
  according to repo policy, then let the root repo run subgraph sync separately.
```

## Guardrails

- Do not run downstream all-repo sync as part of mdkg package readiness.
- Do not claim package-published adoption until registry install has been
  verified separately.
- Do not introduce public queue, event, reducer, lease, or materializer behavior
  beyond the documented mdkg 0.3.0 command surface.
- Keep root and child adoption under repo-owned tasks with repo-local evidence.

# Evidence

- Handoff is recorded in this node and separates local accepted SHA, root
  subgraph refresh, and package-published adoption paths.
- The handoff covers optional SPEC adoption, `mdkg spec`, work trigger, order
  status, receipt verification, queue bridge delivery, and no-secret semantic
  mirror boundaries.
- No downstream repo was mutated.

# Links / Artifacts

- `goal-9`
