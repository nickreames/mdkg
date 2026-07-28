---
id: {{id}}
type: loop
title: {{title}}
status: {{status}}
priority: {{priority}}
loop_mode: planning
loop_role: scoped
scope_refs: []
scope_description: Set the repo folder goal or project area this loop governs.
template_refs: []
materialization_mode: default_children
child_refs: []
pre_run_questions: [scope_authority, local_cache_writes_approved, external_calls_approved]
question_answer_refs: []
pre_approved_actions: [read_source, run_local_discovery, create_mdkg_evidence]
approval_gated_actions: [external_calls]
required_actions: [read_source, run_local_discovery, create_mdkg_evidence]
requested_actions: [read_source, run_local_discovery, create_mdkg_evidence]
prohibited_actions: [functional_changes, push_publish_deploy]
action_approval_refs: []
evidence_lanes: [required_evidence, blocker_recovery, closeout_matrix]
evidence_lane_refs: []
lane_waiver_refs: []
lane_waiver_decision_refs: []
lane_waiver_approval_refs: []
run_refs: []
decision_refs: []
output_refs: []
approval_refs: []
evaluation_refs: []
definition_of_done: Loop required evidence lanes are complete or explicitly waived, and the closeout matrix records why the loop is done, blocked, or continuing.
blocker_policy: spike_proposal_recommendation_continue
epic: {{epic}}
parent: {{parent}}
prev: {{prev}}
next: {{next}}
tags: []
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: []
skills: [pursue-mdkg-loop]
created: {{created}}
updated: {{updated}}
---

# Operating Model

Describe the reusable process this loop represents and the work it should coordinate.

# Scope

State the repository, folder, goal, or project area this loop applies to.

# Definition Of Done

Define the high bar this loop must reach before it can close. A loop must not
close merely because follow-up nodes were created.

# Required Evidence Lanes

List the lanes the loop must complete or explicitly waive.

| Lane | Required | Evidence Needed | Status | Blocker | Recovery Node | Decision Or Waiver |
| --- | --- | --- | --- | --- | --- | --- |
| example lane | yes | source-grounded evidence | todo | none | none | none |

# Pre-Run Questions

Ask these before execution when the loop needs configuration or approval.

- Which scope is authoritative for this run?
- Are external network, provider, registry, security, browser, or multi-agent
  calls approved?
- Are local test/build commands approved when they write caches or generated
  outputs outside committed source?

# Pre-Approved Read-Only Actions

- Read source, docs, mdkg graph, package metadata, configs, and tests.
- Run local discovery commands and local tests/builds when allowed by the loop
  or user.
- Create mdkg evidence, spike, proposal, task, test, checkpoint, and
  open-question nodes.
- Make provisional triage decisions and record them for human or orchestrator
  approval.

# Approval-Gated Actions

- Functional source, docs, template, generated command, or runtime changes.
- Push, publish, tag, deploy, DNS, analytics, provider, or external registry
  actions.
- External calls that disclose repository, package, dependency, user, or
  provider metadata.
- Subagent or privileged tool delegation unless explicitly approved.

# Child Node Materialization

- Default child nodes to create immediately.
- Planning-only or no-child mode expectations.

# Template Lineage

- Template source.
- Forked scope.
- Local specialization.
- Reusable improvements to promote back.

# Run And Evidence Model

- Run records or event streams.
- Evidence, observations, findings, decisions, outputs, and receipts.

# Blocker Continuation Policy

When a branch is blocked, classify it as `recoverable_now`, `branch_blocked`,
`definition_blocking`, or `residual`.

- `recoverable_now`: request approval, use an approved local proof path, or run
  an already authorized tool.
- `branch_blocked`: create or update a spike/proposal/options node, record
  blocker evidence, and continue other linked work.
- `definition_blocking`: keep the loop open until the missing lane is completed
  or explicitly waived.
- `residual`: create follow-up work, mark it non-blocking, and allow closeout
  only if all required lanes are otherwise satisfied.

Whole-loop blocked state is allowed only when no authorized, useful, in-scope
linked work remains across the loop graph.

# Waiver And Decision Policy

- Use proposal or open-question nodes for candidate waivers.
- Use `decision_refs` for accepted design, product, or policy waivers.
- Use `approval_refs` for concrete human/orchestrator approval receipts,
  artifacts, or future approval nodes.
- A simple body section is transitional MVP evidence only; prefer durable linked
  nodes for long-lived waivers.

# Closeout Matrix

Before marking the loop done or blocked, update the required evidence lane table
and explain why each lane is complete, waived, residual, or blocking.

# Validation Plan

- Parser and template validation.
- Search, show, list, index, and pack visibility.
- Fork provenance and child materialization checks.

# Current State

- Not run yet.
