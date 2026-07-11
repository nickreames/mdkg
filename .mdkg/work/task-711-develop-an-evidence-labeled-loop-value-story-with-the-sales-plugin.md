---
id: task-711
type: task
title: Develop an evidence labeled loop value story with the Sales plugin
status: done
priority: 1
epic: epic-229
prev: task-710
next: task-712
tags: [release, sales, audience, value]
owners: []
links: []
artifacts: []
relates: [goal-62, test-384]
blocked_by: [task-710]
blocks: [task-712]
refs: [test-384]
context_refs: [goal-62, epic-229, edd-71, dec-68, dec-73, prd-11, task-710]
evidence_refs: []
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Use Sales `index` routing to turn the capability inventory into a structural
value story for AI coding teams and agent-harness engineers.

# Acceptance Criteria

- Narrative covers audience job, current failure mode, loop workflow, value
  drivers, evidence, limits, and next action.
- Use the causal sequence: recurring audit/process problem, fork and readiness
  workflow, continuation and provenance value, product proof, public-alpha
  caveats, then the `Run a security audit loop` CTA.
- Every claim is labeled Known, Inferred, Assumed, or Missing.
- No invented ROI, adoption, customer quote, or competitive superiority appears.
- Goals remain outcome-oriented; loops are presented as durable processes.
- Security is the primary example and backend/API/CLI bloat is secondary.
- Avoid `self-healing`, autonomous-runtime, built-in scanner, model-routing, and
  sandbox claims that exceed mdkg ownership.

# Files Affected

List files/directories expected to change.

- mdkg planning/design records only

# Implementation Notes

- No CRM or customer connector is required.
- Use dogfood as product evidence, not as a customer outcome claim.
- Purpose-built public examples may be modeled on verified behavior but must not
  copy internal ids, receipts, or raw dogfood transcripts.

# Sales Routing Result

Sales `index` routes this work to the `build-business-case` structural-case
workflow. This is a generic product scenario, not an account-specific case, so
CRM and customer data are neither required nor available. The evidence supports
a causal value story, but it does not support quantified ROI, adoption, or
customer-outcome claims.

# Audience And Job

| Statement | Label | Evidence or boundary |
| --- | --- | --- |
| AI coding teams and agent-harness engineers need repeatable ways to direct work that spans more than one goal or agent pass. | Assumed | Target audience and problem statement accepted in `prd-11`; no market-size or adoption claim. |
| Their job is to define the process once, scope it to a repository, make readiness and approval boundaries explicit, keep useful work moving, and inspect what happened later. | Inferred | Causal interpretation of the Known fork, readiness, next, evidence, and provenance capabilities in `task-710`. |
| A security audit is the clearest first public example because it applies across codebases and naturally benefits from read-only boundaries, explicit evidence lanes, and approval-gated external checks. | Known decision | Accepted in `dec-73`; supported by the shipped security template and corrected `loop-5` dogfood. |

# Current Failure Mode

| Statement | Label | Evidence or boundary |
| --- | --- | --- |
| A one-off agent prompt can lose process intent, scope, approvals, evidence requirements, and follow-up state between attempts. | Assumed | Product problem hypothesis; do not present as measured customer behavior. |
| A goal is outcome-oriented, while a recurring audit needs a reusable process that may coordinate several goals and evidence lanes before its definition of done is satisfied. | Known product model | `dec-65`, `edd-66`, loop parser/contracts, and `task-710`. |
| Stopping at the first blocked lane can leave other authorized work undone. | Known design problem | `dec-67`, blocker-continuation policy, routing tests, and corrected dogfood. |

# Recurring Security-Audit Workflow

1. **Known:** Discover the bundled `security-audit` template with
   `mdkg loop list` and inspect it with `mdkg loop show`.
2. **Known:** Fork it for a repository scope. The default fork records
   provenance and materializes a linked spike, task, and test; planning-only and
   manual modes are available when that shape is not wanted.
3. **Known:** Answer first-class pre-run questions and record typed approval
   evidence for actions such as external advisory or provider checks.
4. **Known:** Let the coding-agent harness inspect source and run authorized
   tools while mdkg preserves the loop, child work, evidence, decisions, and
   closeout requirements.
5. **Known:** Use `mdkg loop plan` to inspect readiness and lane state, and
   `mdkg loop next` to route the next authorized child, evidence lane, blocker
   recovery path, or closeout action.
6. **Known:** When one lane is gated, continue another authorized lane. If a
   blocker needs resolution, record a source-grounded spike, at least three
   viable proposal options, a recommendation, and blocker evidence.
7. **Known:** Close only when required lanes are completed or explicitly waived
   through identity-scoped decision and approval refs; inspect run/evidence
   lineage with `mdkg loop runs`.

# Value Drivers

| Value driver | Causal chain | Label | Confidence |
| --- | --- | --- | --- |
| Repeatable setup | Seeded process -> scoped fork -> less need to reconstruct the audit contract for each repository | Inferred intended value from Known template/fork behavior | Medium |
| Clear operating boundaries | First-class questions, actions, prohibitions, and typed approvals -> explicit authorization state -> easier human/orchestrator review | Inferred intended value from Known validation/readiness behavior | High |
| More complete use of an agent pass | Blocker-aware routing -> another authorized lane or recovery path remains selectable -> useful work can continue before whole-loop blocking | Known behavior; operational value is Inferred | High |
| Inspectable lineage | Template identity/hash plus linked evidence and runs -> current/stale provenance and work history remain visible -> easier handoff and review | Known behavior; review benefit is Inferred | High |
| Honest closeout | Identity-scoped evidence and waivers -> unresolved lanes remain visible -> completion cannot be claimed from unrelated refs | Known behavior; risk-reduction benefit is Inferred | High |
| Safe exploration | Read-only functional-source boundary plus observational mdkg dry-run -> users can preview graph changes and run audits without authorizing implementation edits | Known behavior; confidence benefit is Inferred | High |

# Product Proof

- **Known:** One first-class loop type and the complete
  `list/show/fork/plan/next/runs` command family are implemented and documented.
- **Known:** All seven bundled templates pass installed-package SQLite smoke.
- **Known:** JSON and SQLite fork dry-runs preserve IDs, events, indexes, and
  files; read commands can use non-persisting projections.
- **Known:** Readiness bindings, typed refs, continuation, stale provenance, and
  closeout behavior have focused regression coverage.
- **Known:** Purpose-corrected security and backend/API/CLI dogfood loops reached
  their definitions of done; this proves product behavior, not customer impact.
- **Known:** Existing goal and Omni semantic-file regression behavior passed the
  local release-candidate gate.

# Evidence-Labeled Value Story

**Known problem model:** Goals capture outcomes. Some engineering work is a
repeatable process that spans goals, evidence, decisions, and more than one
attempt.

**Known workflow:** mdkg loops let you start from a reusable template, fork it
for a repository, answer readiness questions, record approvals, route the next
authorized work, retain provenance, and close against explicit evidence.

**Inferred value:** That durable process can reduce repeated setup, make partial
progress easier to preserve, and give humans or higher-level orchestrators a
clearer basis for review.

**Known proof:** v0.5.0's local release candidate includes seven templates,
observational dry-runs, typed readiness and waivers, blocker-aware routing,
stale-fork warnings, installed-package smoke, and completed security and
backend/API/CLI dogfood.

**Known caveat:** mdkg defines and preserves the process graph. Codex, Claude
Code, or another agent harness executes agents and tools. External advisories
or provider checks require their declared approval; mdkg is not a security
scanner or autonomous runtime.

**Known release posture:** This is a **Pre-v1 public alpha**. v0.5.0 is not
publicly available until Goal 64 verifies npm publication and activates the
shared site release state.

**Accepted next action:** **Run a security audit loop**. The CTA leads to a
purpose-built walkthrough, with a secondary link to the loop overview.

# Message Hierarchy

1. **Category:** Reusable, durable processes for multi-step agent work.
2. **Problem:** One-off prompts and goal-only tracking do not fully express a
   recurring audit's readiness, evidence, provenance, and closeout contract.
3. **Mechanism:** Fork a template, answer readiness questions, route authorized
   work, and retain evidence across attempts.
4. **Proof:** Seven templates, typed readiness, observational dry-run,
   blocker-aware routing, provenance diagnostics, and corrected dogfood.
5. **Boundary:** mdkg stores and validates process state; the harness executes.
6. **Qualifier:** Pre-v1 public alpha.
7. **Action:** Run a security audit loop; then learn how loops work.

# Copy Guardrails

## Allowed

- `Reusable loops for work that spans more than one goal.`
- `Fork a read-only audit template, answer readiness questions, and keep the
  process and evidence in your mdkg graph.`
- `Route the next authorized lane without treating the first blocker as the end
  of the entire loop.`
- `Inspect template provenance, evidence, waivers, and closeout state.`

These are Known or qualified Inferred statements grounded in `task-710`.

## Prohibited Or Missing

- `Self-healing`, `fully autonomous`, `guaranteed completion`, or `unblocked by
  default`.
- `Built-in security scanner`, `agent runtime`, `model router`, or `sandbox`.
- Any ROI, hours saved, adoption, defect-reduction, benchmark, customer quote,
  market-leadership, or superiority claim.
- Any statement that v0.5.0 is installed, published, or production-visible
  before Goal 64 evidence exists.

# Validation Gaps Reserved For Later

- **Missing:** Customer-language validation and measured outcome data. These are
  not required for this source-backed public-alpha announcement and cannot be
  implied.
- **Missing:** Production package/site availability until Goal 64.
- **Open design choice:** Exact headline and section composition remain subject
  to the three Product Design directions and operator selection in `task-713`.

# Test Plan

Run `test-384` and obtain operator alignment on the value hierarchy before visual
or copy architecture proceeds.

# Results / Evidence

- Sales `index` was used as the router and `build-business-case` supplied the
  structural-case sequence: audience context, workflow, use case, value drivers,
  product proof, caveats, and narrative.
- No CRM/customer dependency was introduced because this is a generic product
  scenario; no account, customer, commercial, or quantified claim is made.
- The hierarchy follows accepted `dec-73` decisions and the source-backed
  `task-710` ledger. Exact copy remains intentionally open for `task-713` and
  `task-714`.

# Links / Artifacts

- `dec-68`
- `dec-73`
- `prd-11`
