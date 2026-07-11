---
id: loop-3
type: loop
title: Corrected security audit loop for mdkg root
status: todo
priority: 1
scope_refs: []
loop_mode: readonly
loop_role: scoped
scope_description: mdkg root repository
template_refs: [template://loops/security-audit]
materialization_mode: default_children
child_refs: [spike-28, task-689, test-364]
run_refs: []
decision_refs: []
output_refs: []
approval_refs: []
evaluation_refs: [test-364]
definition_of_done: Security audit required lanes are complete or explicitly waived; residual follow-up is classified separately from definition-blocking gaps.
blocker_policy: spike_proposal_recommendation_continue
tags: [loop-template, audit, security, loop-fork]
owners: []
links: []
artifacts: [template_path=.mdkg/templates/loops/security-audit.loop.md, template_hash=sha256:1d820ff9dbbbfdca5211d6a47f90869d9211eb600a33edd4cdbcab2a734907ea]
relates: [loop-1]
blocked_by: []
blocks: []
refs: [template://loops/security-audit, loop-1]
context_refs: []
evidence_refs: []
aliases: []
skills: [pursue-mdkg-loop]
created: 2026-07-06
updated: 2026-07-06
---
# Fork Context

- Source template: template://loops/security-audit
- Source path: .mdkg/templates/loops/security-audit.loop.md
- Source hash: sha256:1d820ff9dbbbfdca5211d6a47f90869d9211eb600a33edd4cdbcab2a734907ea
- Scope: mdkg root repository
- Materialization mode: default_children
- Materialized child refs: spike-28, task-689, test-364
- Supersedes failed dogfood evidence: loop-1

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


# Blocker Continuation Guidance

Policy: spike_proposal_recommendation_continue

- Record blocker evidence on affected goals, subgoals, tasks, or loop branches.
- Create or request a source-grounded spike when uncertainty is material.
- Ask the executing agent or harness to use web grounding when current external facts are required.
- Create or request a proposal for non-trivial blockers with at least three viable paths.
- Record one recommended path and the rationale for choosing it.
- Continue other useful scoped work when safety and ownership rules allow.
- Reserve whole-loop blocked state for repeated or global blockers that prevent meaningful progress across the remaining scope.
