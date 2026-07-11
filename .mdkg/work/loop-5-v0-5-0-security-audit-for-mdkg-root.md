---
id: loop-5
type: loop
title: v0.5.0 security audit for mdkg root
status: done
priority: 1
scope_refs: [root:goal-61]
loop_mode: readonly
loop_role: scoped
scope_description: mdkg root repository v0.5.0 local-only pre-publish security dogfood
template_refs: [template://loops/security-audit]
materialization_mode: default_children
child_refs: [spike-30, task-724, test-395]
pre_run_questions: [external_advisory_checks_approved, security_provider_workflow_approved, local_cache_writes_approved, audit_scope]
question_answer_refs: [external_advisory_checks_approved=dec-71, security_provider_workflow_approved=dec-71, local_cache_writes_approved=dec-71, audit_scope=dec-71]
pre_approved_actions: [read_source, inspect_lockfiles, run_local_static_scans, create_mdkg_evidence]
approval_gated_actions: [external_advisory_checks, security_provider_workflow]
required_actions: [read_source, inspect_lockfiles, run_local_static_scans, create_mdkg_evidence]
requested_actions: [read_source, inspect_lockfiles, run_local_static_scans, create_mdkg_evidence]
prohibited_actions: [functional_changes, push_publish_deploy]
action_approval_refs: []
evidence_lanes: [source_security_review, credential_secret_exposure, dependency_advisories, public_exposure, package_export_surfaces, finding_triage]
evidence_lane_refs: [source_security_review=chk-420, credential_secret_exposure=chk-420, public_exposure=chk-420, package_export_surfaces=chk-420, finding_triage=chk-420]
lane_waiver_refs: [dec-71, chk-415]
lane_waiver_decision_refs: [dependency_advisories=dec-71]
lane_waiver_approval_refs: [dependency_advisories=chk-415]
run_refs: [chk-420]
decision_refs: [dec-71]
output_refs: [spike-30, task-726, test-397, task-727, test-398, chk-421]
approval_refs: [chk-415]
evaluation_refs: [test-395]
definition_of_done: Security audit required lanes are complete or explicitly waived; residual follow-up is classified separately from definition-blocking gaps.
blocker_policy: spike_proposal_recommendation_continue
tags: [loop-template, audit, security, loop-fork, release-candidate, corrected-dogfood]
owners: []
links: []
artifacts: [template_path=.mdkg/templates/loops/security-audit.loop.md, template_hash=sha256:2c26211f628cd62474595191fdc106e051a839bf7232a2336852a1b44e1ca9ba]
relates: [root:goal-61]
blocked_by: []
blocks: []
refs: [template://loops/security-audit, dec-71, chk-415, spike-30, task-724, test-395, task-726, test-397, task-727, test-398, chk-420, chk-421, task-688, goal-64]
context_refs: [root:goal-61]
evidence_refs: [dec-71, chk-415, spike-30, chk-416, chk-417, chk-418, chk-419, chk-420, chk-421]
aliases: []
skills: [pursue-mdkg-loop]
created: 2026-07-10
updated: 2026-07-10
---
# Fork Context

- Source template: template://loops/security-audit
- Source path: .mdkg/templates/loops/security-audit.loop.md
- Source hash: sha256:2c26211f628cd62474595191fdc106e051a839bf7232a2336852a1b44e1ca9ba
- Scope: goal-61
- Materialization mode: default_children
- Materialized child refs: spike-30, task-724, test-395

# Template Operating Model

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
| source security review | yes | files and source-grounded findings | done | none | none | chk-420 |
| credential/secret exposure | yes | local scan plus manual review notes | done | none | none | chk-420 |
| dependency advisories | yes | root and subpackage advisory receipts | waived for local dogfood | external registry approval deferred to goal-64 | task-688 | dec-71 and chk-415 |
| public/docs/demo exposure | scope-dependent | reviewed public surfaces and claims | done | none | none | chk-420 |
| package/bundle/archive/subgraph surfaces | scope-dependent | package and graph export review | done | none | none | chk-420 |
| finding triage | yes | severity, impact, evidence, recommendation | done | none | none | chk-420 |

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

# Run Evidence

- `dec-71` answered every pre-run question and limited this execution to local
  source, package, and static audit work.
- `chk-415` approved only the matching dependency-advisory waiver; the real
  external scan remains `task-688` under `goal-64`.
- `spike-30` records clean lanes, residual uncertainty, and two validated
  findings. `chk-416` through `chk-419` prove both findings were fixed.
- `chk-420` is the audit run receipt and binds every completed local evidence
  lane. `chk-421` verifies the loop contract and child closeout.

# Closeout

Completed after `loop plan loop-5 --json` reported `closeout.ready: true`, no
invalid bindings, three completed child lanes, five completed evidence lanes,
and the one explicitly typed dependency-advisory waiver.


# Blocker Continuation Guidance

Policy: spike_proposal_recommendation_continue

- Record blocker evidence on affected goals, subgoals, tasks, or loop branches.
- Create or request a source-grounded spike when uncertainty is material.
- Ask the executing agent or harness to use web grounding when current external facts are required.
- Create or request a proposal for non-trivial blockers with at least three viable paths.
- Record one recommended path and the rationale for choosing it.
- Continue other useful scoped work when safety and ownership rules allow.
- Reserve whole-loop blocked state for repeated or global blockers that prevent meaningful progress across the remaining scope.
