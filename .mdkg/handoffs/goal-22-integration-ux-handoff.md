# mdkg Agent Handoff

Use this handoff as a sanitized graph summary. Inspect source files before mutating durable state.

## Target
- qid: root:goal-22
- type: goal
- title: Complete runtime integration UX semantic references and handoff hardening
- status: progress
- priority: 1
- path: .mdkg/work/goal-22-complete-runtime-integration-ux-semantic-references-and-handoff-hardening.md
- goal_condition: mdkg is next-release ready after completed-goal lifecycle ergonomics, semantic context/evidence refs, richer checkpoints, workflow validation, warning migration UX, queue adapter contract docs, and sanitized handoff packaging are implemented, documented, tested in packed temp repos, and proven through dry-run publish gates.
- active_node: task-425

## Boundaries
- mdkg is durable semantic memory and graph state, not raw execution trace storage.
- Do not include raw secrets, credentials, model prompts, provider payloads, cookies, tokens, or bulky runtime artifacts in mdkg nodes or handoffs.
- Use refs, hashes, redacted summaries, archive links, artifact links, and checkpoints for evidence.
- Treat subgraph nodes as read-only planning context unless you are operating in the owning repo.
- Run validation before closing work or handing execution to another agent.

## Recommended Next Steps
- Run `mdkg goal current --json` and `mdkg goal next goal-22 --json` to confirm routing.
- Claim one actionable local node before implementation with `mdkg goal claim <goal-id> <work-id> --json`.
- Keep detailed implementation notes in Markdown body sections, not CLI flags.

## Required Checks
- npm run build
- npm run test
- npm run cli:check
- npm run cli:contract
- node dist/cli.js validate --json
- npm run smoke:goal-lifecycle
- npm run smoke:subgraph
- npm run smoke:work-invocation
- npm run smoke:semantic-refs
- npm run smoke:checkpoint-templates
- npm run smoke:handoff
- npm run smoke:integration-ux
- npm run prepublishOnly
- node scripts/assert-publish-ready.js
- npm pack --dry-run --json
- npm publish --dry-run
- git diff --check

## Required Skills
- pursue-mdkg-goal
- select-work-and-ground-context
- verify-close-and-checkpoint

## Latest Checkpoint
- root:chk-183 | checkpoint | Sanitized handoff command verified | backlog/p9 | .mdkg/work/chk-183-sanitized-handoff-command-verified.md

## Included Graph Context
- root:goal-22 | goal | Complete runtime integration UX semantic references and handoff hardening | progress/p1 | .mdkg/work/goal-22-complete-runtime-integration-ux-semantic-references-and-handoff-hardening.md
- root:epic-105 | epic | completed goal lifecycle and executable scope ergonomics | todo/p1 | .mdkg/work/epic-105-completed-goal-lifecycle-and-executable-scope-ergonomics.md
- root:epic-106 | epic | semantic context and evidence references across graph boundaries | todo/p1 | .mdkg/work/epic-106-semantic-context-and-evidence-references-across-graph-boundaries.md
- root:epic-107 | epic | checkpoint closeout templates and warning-safe evidence | todo/p1 | .mdkg/work/epic-107-checkpoint-closeout-templates-and-warning-safe-evidence.md
- root:epic-108 | epic | agent workflow validation and reusable integration templates | todo/p1 | .mdkg/work/epic-108-agent-workflow-validation-and-reusable-integration-templates.md
- root:epic-109 | epic | validation warning UX and historical graph migration | todo/p1 | .mdkg/work/epic-109-validation-warning-ux-and-historical-graph-migration.md
- root:epic-110 | epic | project DB queue adapter contract | todo/p1 | .mdkg/work/epic-110-project-db-queue-adapter-contract.md
- root:epic-111 | epic | handoff command and cross-repo agent prompt packaging | todo/p1 | .mdkg/work/epic-111-handoff-command-and-cross-repo-agent-prompt-packaging.md
- root:epic-112 | epic | goal-22 temp-repo proof and closeout | todo/p1 | .mdkg/work/epic-112-goal-22-temp-repo-proof-and-closeout.md
- root:task-413 | task | align goal-22 graph scope and generic naming boundary | done/p1 | .mdkg/work/task-413-align-goal-22-graph-scope-and-generic-naming-boundary.md
- root:task-414 | task | audit current integration friction and confirm generic contracts | done/p1 | .mdkg/work/task-414-audit-current-integration-friction-and-confirm-generic-contracts.md
- root:task-415 | task | implement completed-goal last-active-node semantics | done/p1 | .mdkg/work/task-415-implement-completed-goal-last-active-node-semantics.md
- root:task-416 | task | implement context refs and evidence refs on work nodes | done/p1 | .mdkg/work/task-416-implement-context-refs-and-evidence-refs-on-work-nodes.md
- root:task-417 | task | harden cross-subgraph blockers and read-only reference summaries | done/p1 | .mdkg/work/task-417-harden-cross-subgraph-blockers-and-read-only-reference-summaries.md
- root:task-418 | task | add checkpoint kinds and closeout templates | done/p1 | .mdkg/work/task-418-add-checkpoint-kinds-and-closeout-templates.md
- root:task-419 | task | add workflow validation subcommands and reusable integration fixtures | done/p1 | .mdkg/work/task-419-add-workflow-validation-subcommands-and-reusable-integration-fixtures.md
- root:task-420 | task | add warning categories changed-warning mode and heading migration UX | done/p1 | .mdkg/work/task-420-add-warning-categories-changed-warning-mode-and-heading-migration-ux.md
- root:task-421 | task | publish project DB queue adapter contract docs and JSON | done/p1 | .mdkg/work/task-421-publish-project-db-queue-adapter-contract-docs-and-json.md
- root:task-422 | task | implement mdkg handoff create and pack integration | done/p1 | .mdkg/work/task-422-implement-mdkg-handoff-create-and-pack-integration.md
- root:task-423 | task | update docs command matrix init assets help snapshots and publish readiness | done/p1 | .mdkg/work/task-423-update-docs-command-matrix-init-assets-help-snapshots-and-publish-readiness.md
- root:task-424 | task | add packed temp-repo integration UX smoke and prepublish gate | done/p1 | .mdkg/work/task-424-add-packed-temp-repo-integration-ux-smoke-and-prepublish-gate.md
- root:task-425 | task | write external runtime integration handoff megaprompt | progress/p1 | .mdkg/work/task-425-write-external-runtime-integration-handoff-megaprompt.md
- root:task-426 | task | close goal-22 evidence and confirm next-release readiness without publish | todo/p1 | .mdkg/work/task-426-close-goal-22-evidence-and-confirm-next-release-readiness-without-publish.md
- root:spike-11 | spike | research generic runtime integration graph handoff and reference patterns | done/p1 | .mdkg/work/spike-11-research-generic-runtime-integration-graph-handoff-and-reference-patterns.md
- root:chk-183 | checkpoint | Sanitized handoff command verified | backlog/p9 | .mdkg/work/chk-183-sanitized-handoff-command-verified.md

## Raw Content Warnings
- root:spike-11 (.mdkg/work/spike-11-research-generic-runtime-integration-graph-handoff-and-reference-patterns.md): raw_secret - raw secret marker detected; handoff omitted raw body content for this node

## Pack Summary
- generated_at: 2026-06-18T05:32:50.939Z
- node_count: 25
- tokens_estimate: 13041
- truncated: max_nodes=true max_bytes=false
- dropped: root:test-180, root:test-181, root:test-182, root:test-183, root:test-184, root:test-185, root:test-186, root:test-187, root:test-188, root:test-189

## Handoff Prompt
Continue from the target above. Preserve the boundaries, verify current repo state, use mdkg commands for structured lifecycle changes, and record validation evidence before closeout.
