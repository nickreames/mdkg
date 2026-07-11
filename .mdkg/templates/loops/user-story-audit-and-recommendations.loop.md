---
id: loop-7
type: loop
title: User Story Audit And Recommendations
status: todo
priority: 1
loop_mode: planning
loop_role: template
scope_refs: []
scope_description: Product area feature set or repository selected for user story audit and recommendations.
template_refs: []
materialization_mode: default_children
child_refs: []
pre_run_questions: [target_audience, product_surface, evidence_sources, recommendation_scope]
question_answer_refs: []
pre_approved_actions: [read_docs, inspect_existing_stories, review_mdkg_graph, create_mdkg_evidence]
approval_gated_actions: [external_research_calls]
required_actions: [read_docs, inspect_existing_stories, review_mdkg_graph, create_mdkg_evidence]
requested_actions: [read_docs, inspect_existing_stories, review_mdkg_graph, create_mdkg_evidence]
prohibited_actions: [public_copy_changes, roadmap_reprioritization, push_publish_deploy]
action_approval_refs: []
evidence_lanes: [story_inventory, persona_alignment, gap_analysis, recommendation_options, followup_work]
evidence_lane_refs: []
lane_waiver_refs: []
lane_waiver_decision_refs: []
lane_waiver_approval_refs: []
run_refs: []
decision_refs: []
output_refs: []
approval_refs: []
evaluation_refs: []
definition_of_done: User story and product outcome lanes are reviewed or explicitly waived with actionable recommendations.
blocker_policy: spike_proposal_recommendation_continue
tags: [loop-template, audit, planning, user-stories]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: [user-story-audit-loop]
skills: [pursue-mdkg-loop]
created: 2026-07-06
updated: 2026-07-06
---

# Operating Model

Run a planning-oriented audit of user stories, product flows, acceptance criteria, and unresolved requirements. Prefer existing docs, source behavior, tests, issue references, and current mdkg decisions.

# Default Child Nodes

- Spike for story and flow inventory.
- Proposal node with at least three viable product or implementation paths where gaps exist.
- Task or test nodes for accepted story improvements.

# Definition Of Done

- Existing user stories and implied product outcomes are mapped.
- Missing personas, edge cases, acceptance criteria, and risks are documented.
- Source/docs behavior, known decisions, open questions, and recommendation
  tradeoffs are reviewed or explicitly waived.
- Recommendations are ordered by user value and implementation leverage.
- Follow-up work is classified as definition-blocking or residual.

# Required Evidence Lanes

| Lane | Required | Evidence Needed | Status | Blocker | Recovery Node | Decision Or Waiver |
| --- | --- | --- | --- | --- | --- | --- |
| story/outcome inventory | yes | stories, docs, goals, source behavior | todo | none | none | none |
| persona and journey gaps | yes | missing actors/flows/risk notes | todo | product context may be missing | spike/proposal | none |
| acceptance criteria | yes | criteria gaps and testability notes | todo | none | none | none |
| edge cases and failure modes | yes | grounded edge-case list | todo | none | none | none |
| decision/open-question mapping | yes | linked decisions/proposals/questions | todo | product approval may be needed | proposal | none |
| prioritized recommendations | yes | value/leverage/risk ordering | todo | none | none | none |

# Pre-Run Questions

- Which product area, user journey, or repo scope is in scope?
- Are assumptions allowed when product context is missing, or should the loop
  request decisions first?
- Are local tests/builds approved when they write caches or generated outputs?
- Should recommendations create implementation tasks, proposal nodes, or both?

# Pre-Approved Read-Only Actions

- Inspect docs, mdkg goals/decisions, source behavior, tests, issues captured in
  the repo, and product notes.
- Run local tests/builds and mdkg commands that do not call external services.
- Create mdkg stories, proposals, tasks, tests, spikes, and open questions.
- Make provisional prioritization recommendations for human/orchestrator
  approval.

# Approval-Gated Actions

- Product-scope changes, implementation changes, public copy changes, deploys,
  analytics, provider calls, or external issue-tracker mutations.

# Blocker Continuation

If product context is missing, create a spike with grounded assumptions, propose
at least three viable paths, recommend one path, mark blocker evidence, and
continue source, docs, workflow, and acceptance-criteria review.

Do not mark the whole loop blocked while another story/product lane remains
actionable. Do not close the loop until required lanes are complete or linked to
accepted `decision_refs` or `approval_refs`.

# Closeout Matrix

Classify follow-up work as definition-blocking product decision, residual story
improvement, accepted waiver, or false positive before marking the loop done or
blocked.
