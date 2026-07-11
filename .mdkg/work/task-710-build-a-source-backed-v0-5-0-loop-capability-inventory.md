---
id: task-710
type: task
title: Build a source backed v0.5.0 loop capability inventory
status: done
priority: 1
epic: epic-229
prev: test-400
next: task-711
tags: [release, capabilities, evidence, planning]
owners: []
links: []
artifacts: []
relates: [goal-62, test-383]
blocked_by: []
blocks: [task-711]
refs: [test-383, test-400, chk-428]
context_refs: [goal-61, goal-62, epic-229, edd-70, edd-71, dec-67, dec-68, dec-73, test-400]
evidence_refs: [chk-428]
aliases: []
skills: []
created: 2026-07-10
updated: 2026-07-10
---
# Overview

Build the release truth packet from completed source, tests, CLI output, package
contents, and corrected loop dogfood before any public narrative is drafted.

# Acceptance Criteria

- Inventory every user-visible loop command, metadata concept, seed, compatibility
  promise, limitation, and runtime boundary shipping in v0.5.0.
- Cover all seven seeded templates, readiness questions and approvals,
  provenance/stale-fork behavior, continuation routing, evidence and closeout,
  and observational dry-run/read guarantees.
- Each fact cites source/test/CLI/package/dogfood evidence.
- Unproven behavior is labeled Missing and excluded from release claims.

# Files Affected

List files/directories expected to change.

- mdkg graph planning/evidence nodes only
- No public source files in this planning task

# Implementation Notes

- Separate package/runtime truth, docs/reference truth, and positioning.
- Include residual public-alpha limitations.
- State explicitly that mdkg preserves loop state while an external coding-agent
  harness executes agents and tools.
- Treat dogfood as evidence for the claim ledger, not copyable public output.

# Capability Ledger

`Known` means the behavior is implemented and supported by the cited source,
CLI, package, test, or dogfood evidence. `Inferred` is a reasonable product-value
interpretation that must remain qualified. `Missing` is not proven by this
release candidate and must not appear as a public capability claim.

| Capability or boundary | Class | Evidence | Public wording boundary |
| --- | --- | --- | --- |
| `loop` is one first-class mdkg node type; template, scoped, and run-bearing behavior is represented through metadata and graph links. | Known | `src/graph/node.ts`; `node dist/cli.js help loop`; `tests/commands/loop.test.ts` | Say one durable loop type. Do not claim separate runtime job, `loop_template`, or `loop_run` types. |
| The public loop command family is `list`, `show`, `fork`, `plan`, `next`, and `runs`; raw custom loops can also be created through `mdkg new loop`. | Known | `src/commands/loop_descriptors.ts`; packaged `mdkg help loop`; `CLI_COMMAND_MATRIX.md` | Use exact generated syntax in reference material. Do not invent `run`, `execute`, `resume`, or hosted orchestration commands. |
| A fork records a scoped loop and defaults to three linked planning children: spike, task, and test. | Known | `src/commands/loop.ts`; `tests/commands/loop.test.ts`; `scripts/smoke-loop.js` | Describe graph materialization, not agent execution. |
| Fork materialization supports `default_children`, `planning_only`, and `manual`, including `--planning-only` and `--no-children` aliases. | Known | `src/commands/loop.ts`; `src/commands/loop_descriptors.ts`; packaged loop help | Keep examples deterministic and non-interactive. |
| Loop readiness uses first-class pre-run questions, typed decision answers, action approvals, evidence lanes, typed waivers, child/run/output refs, and definition-of-done state. | Known | `src/graph/node.ts`; `src/commands/loop.ts`; `test-376`; `test-377`; `test-378` | Say readiness and evidence are tracked by stable identity. Do not imply that prose alone satisfies a requirement. |
| Required and requested actions must be declared as pre-approved or approval-gated and cannot overlap prohibited actions. | Known | `src/graph/node.ts`; graph validation tests | Present approvals as explicit graph contracts, not blanket autonomy. |
| `mdkg loop plan` reports readiness, blockers, lane state, evidence, waivers, provenance, and closeout; `mdkg loop next` selects authorized child, lane, recovery, or closeout work. | Known | `src/commands/loop.ts`; `tests/commands/loop.test.ts`; `loop-5`; `loop-6` | Say mdkg routes the next authorized work. Do not say mdkg executes the work. |
| A blocked child does not stop a loop while another authorized child or recovery path remains. The supported recovery policy calls for a spike, a proposal with at least three viable options, a recommendation, blocker evidence, and continued useful work. | Known | `src/graph/node.ts`; `src/commands/loop.ts`; `dec-67`; `test-377`; corrected dogfood `loop-5` and `loop-6` | Use "continues around blockers" or "blocker-aware routing." Do not use "self-healing." |
| Loop closeout requires all required lanes to be completed or explicitly waived with identity-scoped decision and approval evidence. | Known | `src/commands/loop.ts`; `test-378`; `loop-5`; `chk-420`; `chk-421` | Do not imply that reaching a percentage automatically closes a loop. |
| Fork provenance retains template identity and content hash; list/show/plan report current, stale, missing-template, or unknown lineage without rewriting the fork. | Known | `src/commands/loop.ts`; `test-379`; `chk-412` | Say stale forks warn and remain inspectable. Do not promise automatic reconciliation. |
| Loop dry-run is observational for JSON and SQLite: it does not consume IDs, append events, persist an index, or write files. Read-only descriptor-backed commands use non-persisting projections when rebuilding state. | Known | `test-375`; `src/commands/loop_descriptors.ts`; `tests/commands/loop.test.ts`; `scripts/smoke-loop.js`; `chk-426` | This guarantee applies to mdkg command behavior, not arbitrary external tools invoked by an agent. |
| Seven bundled loop templates ship: security; design/frontend UX; backend/API/CLI bloat; tech-stack best practices; duplicate code/linting; test/CI/SKILL.md infrastructure; and user-story audit/recommendations. | Known | `.mdkg/templates/loops/`; `scripts/smoke-loop.js`; `chk-426` | Call them reusable starting points. Do not claim every template has been run on every repository type. |
| The security template is read-only with respect to functional source but may create mdkg findings, tasks, decisions, checkpoints, waivers, and evidence. External advisory/provider actions remain approval-gated. | Known | `.mdkg/templates/loops/security-audit.loop.md`; `dec-71`; `loop-5`; `chk-420`; `chk-421` | Explain the write boundary. Do not describe mdkg itself as a vulnerability scanner. |
| Completed local dogfood proves the corrected security and backend/API/CLI loops can exhaust or waive their declared lanes and reach closeout. | Known | `loop-5`; `loop-6`; `test-382`; `chk-420`; `chk-422`; `chk-426` | Use purpose-built public examples modeled on the workflow, not copied receipts or private repository output. |
| Existing goal behavior and MANIFEST, legacy SPEC, WORK, WORK_ORDER, RECEIPT, FEEDBACK, DISPUTE, and PROPOSAL regressions pass the release gate. | Known | `test-382`; `chk-425`; `chk-426` | State compatibility narrowly; do not claim universal downstream compatibility. |
| The installed-package release gate covers Node `>=24.15.0`, 577 tests on Node 24.16.0 and 26.0.0, CLI/docs contracts, all seven SQLite template smokes, and package-readiness checks. | Known | `package.json`; `scripts/smoke-loop.js`; `scripts/assert-publish-ready.js`; `chk-426` | These are local release-candidate results, not evidence that v0.5.0 is published. |
| Durable, reusable process state can reduce repeated setup and make agent work easier to inspect across attempts. | Inferred | The known graph, template, provenance, readiness, and evidence capabilities above | Present as intended value using "can" or "designed to," not as measured customer impact. |
| mdkg executes agents, chooses models, controls sandboxes, runs security scanners, or provides a hosted autonomous runtime. | Missing | Explicit ownership boundary in packaged loop help, `edd-70`, `dec-67`, and `chk-426` | Exclude. External coding-agent harnesses execute agents and tools. |
| Loops are autonomous, self-healing, guarantee completion, or remove the need for human/orchestrator approval. | Missing | No such runtime or outcome proof; approvals and waivers are explicit | Exclude these terms from public copy. |
| Customer adoption, ROI, time savings, defect reduction, scale limits, or superiority over competing products are proven. | Missing | No customer, benchmark, telemetry, or comparative evidence in this release candidate | Exclude numbers and superiority claims. |
| v0.5.0 is available from npm or production websites. | Missing until Goal 64 | Package remains `0.4.2`; `goal-64` owns versioning, publication, activation, and production proof | Draft release content must remain dormant and cannot advertise availability before registry verification. |

# Seven-Template Inventory

| Seed | Mode | Intended starting lane |
| --- | --- | --- |
| `security-audit` | read-only | Source security, secrets, advisories, exposure, package surfaces, and triage |
| `design-frontend-ux-audit` | read-only | Visual, responsive, interaction, accessibility, and design-system review |
| `backend-api-cli-bloat-audit` | read-only | Backend boundaries, API shape, CLI surface, modularity, and code-bloat review |
| `tech-stack-best-practices-audit` | read-only | Framework, dependency, configuration, and current stack-practice review |
| `duplicate-code-and-linting-audit` | read-only | Duplication, linting, formatter, and static-quality review |
| `test-ci-skill-infrastructure-audit` | read-only | Test strategy, CI gates, automation, and SKILL.md infrastructure review |
| `user-story-audit-and-recommendations` | planning | User-story coverage, gaps, recommendations, and follow-up planning |

# Public-Alpha Limits

- The release qualifier remains exactly **Pre-v1 public alpha**.
- mdkg stores and validates the process graph. Codex, Claude Code, or another
  agent harness performs source inspection, tool execution, approvals,
  sandboxes, traces, and model routing.
- `loop runs` inspects linked run/evidence records; it does not launch a run.
- External advisories and provider-backed security checks are not bundled into
  the local read-only contract and require explicit approval when requested.
- Stale forks are diagnosed, not automatically updated.
- CocoIndex, remote references, semantic search, generic CLI redesign, and
  runtime execution are outside v0.5.0 loop scope.
- Package publication, production activation, and fresh-install proof remain
  future Goal 64 evidence.

# Release Journey Inputs

The supported public journey is:

1. Keep the generic quickstart as the primary first-use path.
2. Introduce loops in the post-quickstart announcement section.
3. Use **Run a security audit loop** as the primary announcement CTA.
4. Teach the purpose-built security walkthrough with explicit read-only and
   approval boundaries.
5. Link onward to loop concepts and generated command reference.

The inventory supports that journey without turning dogfood receipts into
public copy or claiming that mdkg itself performs the audit.

# Test Plan

Run `test-383`, compare the inventory to the Goal 1 checkpoint, and pack it for
the Sales and Product Design tasks.

# Results / Evidence

- Package and runtime truth reconciled against `package.json`, packaged loop
  help, parser/validation source, command descriptors, seven seed files, and
  installed-package smoke coverage.
- Behavioral claims reconciled against `test-375` through `test-382`,
  `test-397`, `test-398`, corrected loops `loop-5` and `loop-6`, and release
  candidate checkpoint `chk-426`.
- Unsupported execution, autonomy, ROI, adoption, competitive, hosted-runtime,
  scanner, scale, and availability claims are classified Missing and excluded.
- Capability inventory is ready for claim-safety verification in `test-383`
  and for the evidence-labeled value narrative in `task-711`.

# Links / Artifacts

- `goal-61`
- `edd-71`
- `dec-73`
- `test-400`
