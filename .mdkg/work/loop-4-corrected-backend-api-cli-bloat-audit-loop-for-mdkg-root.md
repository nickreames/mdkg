---
id: loop-4
type: loop
title: Corrected backend API CLI bloat audit loop for mdkg root
status: done
priority: 1
scope_refs: []
loop_mode: readonly
loop_role: scoped
scope_description: mdkg root repository
template_refs: [template://loops/backend-api-cli-bloat-audit]
materialization_mode: default_children
child_refs: [spike-29, task-690, test-365]
run_refs: [chk-391]
decision_refs: []
output_refs: [prop-4, task-691, task-692, test-366]
approval_refs: []
evaluation_refs: [test-365]
definition_of_done: Backend API or CLI complexity lanes are reviewed or explicitly waived, and simplification recommendations are source-grounded.
blocker_policy: spike_proposal_recommendation_continue
tags: [loop-template, audit, backend, api, cli, loop-fork]
owners: []
links: []
artifacts: [template_path=.mdkg/templates/loops/backend-api-cli-bloat-audit.loop.md, template_hash=sha256:d1b45778e7322ef44851c3a0e797ab92f5d87d07ecf73676c86ca0e91aedf00d]
relates: [loop-2]
blocked_by: []
blocks: []
refs: [template://loops/backend-api-cli-bloat-audit, loop-2, prop-4, task-691, task-692, test-366]
context_refs: []
evidence_refs: [spike-29, task-690, test-365, chk-391]
aliases: []
skills: [pursue-mdkg-loop]
created: 2026-07-06
updated: 2026-07-06
---
# Fork Context

- Source template: template://loops/backend-api-cli-bloat-audit
- Source path: .mdkg/templates/loops/backend-api-cli-bloat-audit.loop.md
- Source hash: sha256:d1b45778e7322ef44851c3a0e797ab92f5d87d07ecf73676c86ca0e91aedf00d
- Scope: mdkg root repository
- Materialization mode: default_children
- Materialized child refs: spike-29, task-690, test-365
- Supersedes stale pre-hardening fork: loop-2

# Template Operating Model

# Operating Model

Run a read-only audit for backend, API, and CLI design bloat. Look for sprawling flags, mixed ownership, duplicated command logic, weak module boundaries, and overly broad abstractions.

# Default Child Nodes

- Spike for command/API inventory.
- Proposal node for simplification paths.
- Task nodes for focused refactors that preserve behavior.

# Definition Of Done

- Public surfaces and core ownership boundaries are inventoried.
- Bloat or coupling risks are tied to concrete source locations.
- Command/API flag sprawl, mixed ownership, duplicate handlers, module
  cohesion, and output/help consistency are reviewed or explicitly waived.
- Recommendations preserve compatibility unless explicitly accepted otherwise.
- Follow-up work is classified as definition-blocking or residual.

# Required Evidence Lanes

| Lane | Required | Evidence Needed | Status | Blocker | Recovery Node | Decision Or Waiver |
| --- | --- | --- | --- | --- | --- | --- |
| public command/API inventory | yes | command/API list and source refs | complete | none | none | none |
| flag and option sprawl | yes | flagged commands/options with rationale | complete | none | none | none |
| ownership boundaries | yes | module/command boundary notes | complete | none | none | none |
| duplicated command logic | yes | repeated handlers or helpers | complete | none | none | none |
| compatibility risk | yes | behavior-preserving recommendations | complete | external checks not approved but not required for local audit | none | none |
| simplification proposals | yes | at least three paths for major changes | complete | none | none | none |

Completed matrix for the 2026-07-06 read-only audit:

| Lane | Classification | Evidence | Blocker | Follow-Up |
| --- | --- | --- | --- | --- |
| public command/API inventory | complete | 115 command targets, 34 categories, live help samples, source refs in `spike-29` | none | none |
| flag and option sprawl | complete | `new` 24 flags, `pack` 20, parser/helper counts in `spike-29` | none | residual `task-691` |
| ownership boundaries | complete | handler-size and module-boundary inventory in `spike-29` | none | residual `task-691` |
| duplicated command logic | complete | dispatch/help/target/contract extraction refs in `spike-29` | none | residual `task-692` |
| compatibility risk | complete | command contract check passed; no behavior failure proven | downstream checks not approved and not needed for local audit | residual `test-366` |
| simplification proposals | complete | `prop-4` has three viable paths and recommended path | none | `task-691`, `task-692`, `test-366` |

# Pre-Run Questions

- Which command, API, package, or backend surface is in scope?
- Are local tests/builds approved when they write caches or generated outputs?
- Are external compatibility checks, service calls, or downstream repo checks
  approved?
- Should recommendations optimize for compatibility, simplicity, performance, or
  public CLI ergonomics first?

Answers used for this run:

- Scope: mdkg root repository CLI and backend command implementation.
- Local tests/builds: approved for read-only audit loops.
- External compatibility checks, service calls, and downstream repo checks: not
  approved for this run; not required for local evidence lanes.
- Optimization priority: compatibility first, then simplicity and public CLI
  ergonomics.

# Pre-Approved Read-Only Actions

- Inspect source, command registration, help text, tests, docs, generated command
  references, and package metadata.
- Run local CLI help, local tests/builds, `rg`, `mdkg show/search/pack/validate`,
  and static command/API inventory scripts.
- Create mdkg spikes, proposals, tasks, tests, checkpoints, and open questions.

# Approval-Gated Actions

- Functional code, docs, template, generated command, or public CLI behavior
  changes.
- External service calls or downstream compatibility checks.
- Push, publish, tag, deploy, or provider-side actions.

# Blocker Continuation

If external service behavior or compatibility impact cannot be proven, create a
spike, propose at least three viable paths, recommend one path, record blocker
evidence, and continue local source, docs, help, and test analysis.

Do not mark the whole loop blocked while another command/API lane remains
actionable. Do not close the loop until required lanes are complete or linked to
accepted `decision_refs` or `approval_refs`.

# Closeout Matrix

Classify follow-up work as compatibility-blocking, simplification residual,
accepted waiver, or false positive before marking the loop done or blocked.

Closeout classification:

- `prop-4`: accepted audit proposal output.
- `task-691`: residual simplification, not definition-blocking.
- `task-692`: residual contract-quality simplification, not
  definition-blocking.
- `test-366`: residual regression gate for future CLI refactor work, not
  definition-blocking.
- No false positives required a node.
- No accepted waivers were required; external/downstream compatibility checks
  were out of scope for the local read-only audit and did not block completing
  the required local lanes.

# Run Summary

Read-only backend/API/CLI bloat audit completed on 2026-07-06. The audit
inventoried public command/API surfaces, flag/option sprawl, ownership
boundaries, duplicated command logic, compatibility risk, and simplification
options. It found maintainability pressure in CLI dispatch and command-contract
generation, but no current compatibility-blocking bug.

The recommended path is `prop-4`: migrate toward typed command descriptors
incrementally while preserving the current public CLI. Implementation work is
residual and represented by `task-691`, `task-692`, and `test-366`.


# Blocker Continuation Guidance

Policy: spike_proposal_recommendation_continue

- Record blocker evidence on affected goals, subgoals, tasks, or loop branches.
- Create or request a source-grounded spike when uncertainty is material.
- Ask the executing agent or harness to use web grounding when current external facts are required.
- Create or request a proposal for non-trivial blockers with at least three viable paths.
- Record one recommended path and the rationale for choosing it.
- Continue other useful scoped work when safety and ownership rules allow.
- Reserve whole-loop blocked state for repeated or global blockers that prevent meaningful progress across the remaining scope.
