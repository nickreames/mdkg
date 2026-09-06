---
id: task-818
type: task
title: Align bootstrap discovery links and native skill projections
status: done
priority: 1
parent: goal-81
tags: [alignment-002, execution-authorized]
owners: [mdkg-project-agent]
links: []
artifacts: []
relates: []
blocked_by: [task-817]
blocks: []
refs: [edd-80, dec-93, dec-18, goal-78]
context_refs: []
evidence_refs: []
aliases: []
skills: [select-work-and-ground-context, author-mdkg-skill, verify-close-and-checkpoint]
created: 2026-09-05
updated: 2026-09-05
---

# Overview

Finish bootstrap compatibility across generated links, canonical focused skills,
and native projections. Qualified scoped skill-maintenance/source work under
the explicit Goal 81 Run authorization; use author-mdkg-skill. Existing startup,
execution, and closeout skills need layout/authority compatibility, not new skills.

# Acceptance Criteria

- Every generated relative link resolves in fresh and upgraded consumer layouts.
- No circular mandatory startup reads; command matrix and skill bodies are loaded
  only when relevant.
- Canonical .mdkg/skills content is updated rather than duplicated. Native mirrors
  preserve unrelated folders and honor configured mirror targets.
- Legacy links have reviewed redirects where mdkg owns the bytes; customized
  root docs remain untouched and receive actionable compatibility diagnostics.
- Website discovery endpoints and maintained project docs are classified separately,
  not moved by scaffold rules or changed as public positioning.

# Files Affected

Future init skill assets, generated references and projection tests. Live canonical
skill edits need the explicitly scoped maintenance authority recorded here and
author-mdkg-skill; projected mirrors are outputs, not authoring targets.

# Implementation Notes

Reuse dec-18, edd-56 and completed goal-78 evidence. No new skill is currently
proposed. No public website copy edits or cross-repository rollout by implication.

# Test Plan

test-474 plus skill validation, mirror parity, configured custom targets,
same-slug conflicts, packaged assets, generated-link traversal and CLI/docs
consistency. Tests must use disposable repositories.

# Links / Artifacts

- edd-80, dec-18, goal-78, goal-81.
- 2026-09-05: canonical/public/native skills synchronized, 16 sync operations
  across two targets, zero pruned. Skill validation passed 8 skills with zero
  errors/warnings after building the updated seed. Focused bootstrap, upgrade,
  CLI, and containment tests passed 65/65. Full regression passed 678+26 tests;
  CLI/docs checks and packaged init/upgrade smokes passed (see test-474).

# Skill Maintenance Receipts

Existing skills searched: mdkg skill list; searches bootstrap, authority and
context; show/read existing author, select, pack, goal, loop, and verify skills.
Bootstrap had no exact new skill fit; context returned select and pack coverage.
Update-existing is preferred: each procedure already owns its trigger, so no new
skill or factory is justified. Canonical owners are mdkg; maintenance owner is
mdkg-project-agent under Goal 81/task-818.

| Slug and title | Generic trigger | Evidence / change |
| --- | --- | --- |
| select-work-and-ground-context — Select work and ground context | Enter or resume an unclear task | Init and upgraded consumer layouts require focused discovery; explicit goal routing and portable links updated. |
| build-pack-and-execute-task — Build pack and execute task | Prepare bounded execution context | Fresh and upgraded fixtures exercise portable skill output; removed implicit archive/bundle authority from patch handoff. |
| pursue-mdkg-goal — Pursue mdkg goal | Run an explicitly scoped planned goal | One high-risk authority need: explicit Run must authorize declared work without implying a default commit. |
| pursue-mdkg-loop — Pursue mdkg loop | Execute an approved linked loop | One high-risk authority need: read-only selection must not silently authorize planning writes or generated outputs. |
| author-mdkg-skill — Author mdkg skill | Maintain a qualified reusable procedure | Fresh and legacy bootstrap locations require owned-seed updates without implicit repository migration. |
| verify-close-and-checkpoint — Verify, close and checkpoint | Validate and close scoped work | One high-risk authority need: upgraded handoff must preserve explicit commit/bundle exclusions; hash-bound upgrade instruction added. |

For every row: surface classification is repeatable generic procedure (SKILL.md),
not current assignment, Runtime scheduling, or product orchestration. Inputs are
the explicit work QID, current source/Git evidence and approved action boundaries;
outputs are the procedure's scoped decision/pack/evidence/closeout, with no new
execution service. Resources are the existing canonical skill, bounded workspace
reference, command help, and matching public/native copies. Steps: inspect the
existing fit, update focused discovery and relevant authority text, synchronize
projections, validate, and attach this receipt. Security: no secrets, provider
access, implicit Git operations, or skill-script execution. Portability: relative
workspace references and generic mdkg commands; native adapters contain no new
vendor policy. Projections: .agents/skills, .claude/skills, assets/init/skills/default
and built dist/init copies. Validation: skill validation, exact projection hashes,
consumer link traversal, focused and full regression tests. Recommendation:
retain these bounded existing updates; new skill candidates: none.
