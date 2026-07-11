---
id: loop-2
type: loop
title: Design Frontend UX Audit
status: todo
priority: 1
loop_mode: readonly
loop_role: template
scope_refs: []
scope_description: Frontend application or user flow selected for design and UX audit.
template_refs: []
materialization_mode: default_children
child_refs: []
pre_run_questions: [target_surface, design_standard, browser_checks_approved, accessibility_priority]
question_answer_refs: []
pre_approved_actions: [read_source, inspect_design_tokens, capture_local_screenshots, create_mdkg_evidence]
approval_gated_actions: [external_design_tools]
required_actions: [read_source, inspect_design_tokens, capture_local_screenshots, create_mdkg_evidence]
requested_actions: [read_source, inspect_design_tokens, capture_local_screenshots, create_mdkg_evidence]
prohibited_actions: [visual_redesign_changes, deploy_preview_changes, push_publish_deploy]
action_approval_refs: []
evidence_lanes: [visual_consistency, accessibility_contrast, responsive_layout, interaction_ergonomics, design_system_fit, recommendations]
evidence_lane_refs: []
lane_waiver_refs: []
lane_waiver_decision_refs: []
lane_waiver_approval_refs: []
run_refs: []
decision_refs: []
output_refs: []
approval_refs: []
evaluation_refs: []
definition_of_done: UX and visual quality lanes are audited or explicitly waived against product design system and accessibility expectations.
blocker_policy: spike_proposal_recommendation_continue
tags: [loop-template, audit, design, ux, frontend]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: [design-ux-audit-loop]
skills: [pursue-mdkg-loop]
created: 2026-07-06
updated: 2026-07-06
---

# Operating Model

Run a read-only design and frontend UX audit. Compare the current interface against the local design system, product intent, accessibility expectations, contrast, responsive behavior, and interaction polish.

# Default Child Nodes

- Spike for product/design context and screenshot inventory.
- Test nodes for accessibility, contrast, and responsive checks.
- Proposal node for prioritized UX improvements.

# Definition Of Done

- Screens or flows are inspected with evidence.
- Design-system drift, accessibility issues, and UX friction are identified.
- Contrast, responsive behavior, interaction states, copy clarity, and visual
  hierarchy are reviewed or explicitly waived.
- Recommendations are prioritized by user impact and implementation risk.
- Follow-up work is classified as definition-blocking or residual.

# Required Evidence Lanes

| Lane | Required | Evidence Needed | Status | Blocker | Recovery Node | Decision Or Waiver |
| --- | --- | --- | --- | --- | --- | --- |
| route/screen inventory | yes | screens, flows, or source routes | todo | none | none | none |
| design-system alignment | yes | local tokens/components/standards review | todo | none | none | none |
| accessibility and contrast | yes | local proof or code-level review | todo | visual runtime may be unavailable | spike/proposal | none |
| responsive behavior | yes | viewport proof or source-grounded review | todo | browser/runtime may be unavailable | spike/proposal | none |
| interaction states | scope-dependent | hover/focus/error/loading review | todo | none | none | none |
| prioritized recommendations | yes | user impact and risk ordering | todo | none | none | none |

# Pre-Run Questions

- Which routes, screens, or flows are in scope?
- Is browser/runtime proof approved or available?
- Are local builds/tests approved when they write caches or generated outputs?
- Should the audit optimize toward current local design, ChatGPT/Codex-inspired
  interaction polish, accessibility, density, or conversion?

# Pre-Approved Read-Only Actions

- Inspect frontend source, design docs, tokens, CSS, components, screenshots,
  generated static output, and local docs.
- Run local builds/tests, static accessibility checks, `rg`, mdkg commands, and
  browser checks when available locally.
- Create mdkg findings, screenshots/artifact refs, proposals, tasks, tests, and
  open questions.

# Approval-Gated Actions

- Functional UI/code/docs changes.
- External design tools, provider calls, deploys, analytics, or production
  browser-session actions.

# Blocker Continuation

If visual runtime proof is blocked, write a spike with source-grounded options,
propose at least three ways to obtain evidence, recommend one path, mark blocker
evidence, and continue code-level design-system, accessibility, and interaction
analysis.

Do not mark the whole loop blocked while another UX lane remains actionable. Do
not close the loop until required lanes are complete or linked to accepted
`decision_refs` or `approval_refs`.

# Closeout Matrix

Classify follow-up work as definition-blocking UX evidence, residual polish,
accepted waiver, or false positive before marking the loop done or blocked.
