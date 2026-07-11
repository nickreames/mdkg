---
id: loop-1
type: loop
title: Security Audit
status: todo
priority: 1
loop_mode: readonly
loop_role: template
scope_refs: []
scope_description: Repository or package scope selected for a read-only security audit.
template_refs: []
materialization_mode: default_children
child_refs: []
pre_run_questions: [external_advisory_checks_approved, security_provider_workflow_approved, local_cache_writes_approved, audit_scope]
question_answer_refs: []
pre_approved_actions: [read_source, inspect_lockfiles, run_local_static_scans, create_mdkg_evidence]
approval_gated_actions: [external_advisory_checks, security_provider_workflow]
required_actions: [read_source, inspect_lockfiles, run_local_static_scans, create_mdkg_evidence]
requested_actions: [read_source, inspect_lockfiles, run_local_static_scans, create_mdkg_evidence]
prohibited_actions: [functional_changes, push_publish_deploy]
action_approval_refs: []
evidence_lanes: [source_security_review, credential_secret_exposure, dependency_advisories, public_exposure, package_export_surfaces, finding_triage]
evidence_lane_refs: []
lane_waiver_refs: []
lane_waiver_decision_refs: []
lane_waiver_approval_refs: []
run_refs: []
decision_refs: []
output_refs: []
approval_refs: []
evaluation_refs: []
definition_of_done: Security audit required lanes are complete or explicitly waived; residual follow-up is classified separately from definition-blocking gaps.
blocker_policy: spike_proposal_recommendation_continue
tags: [loop-template, audit, security]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
context_refs: []
evidence_refs: []
aliases: [security-audit-loop]
skills: [pursue-mdkg-loop]
created: 2026-07-06
updated: 2026-07-06
---

# Operating Model

Run a read-only security review over the selected scope. Ground findings in source, configuration, dependency metadata, generated artifacts, and existing mdkg context. Do not make code changes from this loop.

# Default Child Nodes

- Spike for threat model and attack surface discovery.
- Task or test nodes for validated remediation work.
- Checkpoint for scan evidence and residual risk.

# Definition Of Done

- Source/security-sensitive code is reviewed with source-grounded evidence.
- Credential and secret exposure checks are run or explicitly waived.
- Dependency advisory checks cover all publish-relevant packages or are
  explicitly waived.
- Public/docs/demo exposure surfaces are reviewed when in scope.
- Package, bundle, archive, subgraph, and publish surfaces are reviewed when in
  scope.
- Valid findings include affected files, impact, evidence, severity, and
  remediation direction.
- False positives, residual uncertainty, and non-blocking hardening work are
  recorded.
- Required lanes are complete or linked to accepted `decision_refs` or
  `approval_refs`.

# Required Evidence Lanes

| Lane | Required | Evidence Needed | Status | Blocker | Recovery Node | Decision Or Waiver |
| --- | --- | --- | --- | --- | --- | --- |
| source security review | yes | files and source-grounded findings | todo | none | none | none |
| credential/secret exposure | yes | local scan plus manual review notes | todo | none | none | none |
| dependency advisories | yes | root and subpackage advisory receipts | todo | external registry approval may be needed | proposal or approval request | none |
| public/docs/demo exposure | scope-dependent | reviewed public surfaces and claims | todo | none | none | none |
| package/bundle/archive/subgraph surfaces | scope-dependent | package and graph export review | todo | none | none | none |
| finding triage | yes | severity, impact, evidence, recommendation | todo | none | none | none |

# Pre-Run Questions

- Are external advisory checks such as `npm audit` approved for every package
  that may send dependency metadata to a registry?
- Is Codex Security or another multi-agent/security provider workflow approved?
- Are local test/build commands approved when they write caches or generated
  outputs outside committed source?
- Is the audit pre-publish, local-only, or scoped to a smaller package/folder?

# Pre-Approved Read-Only Actions

- Read source, docs, mdkg graph, package metadata, lockfiles, configs, tests,
  generated public surfaces, and local scripts.
- Run local static scans, `rg`, `mdkg show/search/pack/validate`, local tests,
  local builds, and package inspection commands that do not call external
  services.
- Create mdkg evidence, findings, spikes, proposals, tasks, tests, checkpoints,
  and open questions.
- Make provisional severity and priority calls for later human/orchestrator
  review.

# Approval-Gated Actions

- External registry/advisory/security-provider calls.
- Multi-agent delegation or privileged security tooling.
- Functional source, docs, template, generated command, or runtime changes.
- Push, publish, tag, deploy, DNS, analytics, or provider-side actions.

# Blocker Continuation

If a lane is blocked by missing credentials, private systems, external approval,
or unavailable runtime state, write blocker evidence, create or update a spike
and proposal with at least three viable paths, recommend one path, and continue
every other authorized audit lane.

Do not mark the whole loop blocked while any required or useful security audit
lane remains actionable. Do not mark the loop done when a required lane is only
represented as future work; it must be completed or explicitly waived.

# Closeout Matrix

Before closeout, update the required evidence lane table and classify every
follow-up as one of:

- definition-blocking: loop remains open until completed or waived;
- residual hardening: follow-up can remain after loop closeout;
- false positive: no action required, with evidence;
- accepted waiver: linked through `decision_refs` or `approval_refs`.

# Provisional Decisions And Open Questions

Record security severity calls, waiver candidates, approval requests, and
external-check questions here or in linked proposal/decision nodes before
treating them as accepted.
