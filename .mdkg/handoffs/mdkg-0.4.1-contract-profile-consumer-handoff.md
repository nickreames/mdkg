# mdkg Agent Handoff

Use this handoff as a sanitized graph summary. Inspect source files before mutating durable state.

## Target
- qid: root:task-648
- type: task
- title: prepare downstream-private contract-profile consumer handoff
- status: blocked
- priority: 1
- path: .mdkg/work/task-648-prepare-downstream-private-contract-profile-consumer-handoff.md

## Boundaries
- mdkg is durable semantic memory and graph state, not raw execution trace storage.
- Do not include raw secrets, credentials, model prompts, provider payloads, cookies, tokens, or bulky runtime artifacts in mdkg nodes or handoffs.
- Use refs, hashes, redacted summaries, archive links, artifact links, and checkpoints for evidence.
- Treat subgraph nodes as read-only planning context unless you are operating in the owning repo.
- Run validation before closing work or handing execution to another agent.

## Recommended Next Steps
- Run `mdkg show task-648 --json` and `mdkg pack task-648` to refresh local context.
- Use `mdkg task start|update|done` for lifecycle updates when the node is task-like.
- Keep detailed implementation notes in Markdown body sections, not CLI flags.

## Published Version Evidence
- Published package: `mdkg@0.4.1`.
- Published commit pushed to `origin/main`: `88a3cb433a40b8fbd6ecefc25e5668dc4e2ad26b`.
- Registry checks after publish: `npm view mdkg version --registry=https://registry.npmjs.org/` returned `0.4.1`; `npm view mdkg dist-tags --json --registry=https://registry.npmjs.org/` returned `{"latest":"0.4.1"}`.
- Clean temp global install: `/private/tmp/mdkg-0.4.1-postpublish.Hil88q`; installed binary `/private/tmp/mdkg-0.4.1-postpublish.Hil88q/bin/mdkg --version` returned `0.4.1`.
- Clean temp workflow workspace: `/private/tmp/mdkg-0.4.1-workspace-valid.66mnhk`.
- Published-package probes passed: `mdkg init --agent`, `mdkg validate --json`, `mdkg validate --profile omni-room --json`, `mdkg work validate --profile omni-room --json`, `mdkg skill sync --json`, `mdkg upgrade --dry-run --json`, `mdkg upgrade --apply --json`, final `mdkg status --json`, and final `mdkg validate --json`.

## Downstream Boundary
- Generic mdkg 0.4.1 behavior: MANIFEST/WORK/WORK_ORDER/RECEIPT semantic mirrors accept `contract_profile`; MANIFEST/WORK_ORDER/RECEIPT accept validation/evidence policy refs; RECEIPT accepts `receipt_kind` and `redaction_class`; `mdkg validate --profile omni-room` and `mdkg work validate --profile omni-room` run explicit profile checks after generic validation.
- Runtime-owned behavior remains downstream-private: queue execution, room identity, provider policy, final receipt authority, vault/sandbox semantics, billing or ledger state, and product-specific naming.
- Remote Git/project-memory primitives are not released 0.4.1 behavior. Treat them as deferred generic successor planning in `goal-51`/`goal-52`.
- No downstream repo, root workspace, deploy, provider, DNS, sandbox, or runtime state was mutated during this handoff.

## Required Checks
- none

## Required Skills
- none

## Latest Checkpoint
- root:chk-359 | checkpoint | mdkg 0.4.1 postpublish temp install validated | backlog/p9 | .mdkg/work/chk-359-mdkg-0-4-1-postpublish-temp-install-validated.md

## Included Graph Context
- root:task-648 | task | prepare downstream-private contract-profile consumer handoff | blocked/p1 | .mdkg/work/task-648-prepare-downstream-private-contract-profile-consumer-handoff.md
  refs: task-635, task-647
- root:goal-50 | goal | Publish mdkg 0.4.1 contract-profile support and validate consumers | blocked/p1 | .mdkg/work/goal-50-publish-mdkg-0-4-1-contract-profile-support-and-validate-consumers.md
  refs: goal-49, goal-48, goal-51, task-635, task-636, task-649, test-332, test-337
  context_refs: root:goal-51, root:task-650, root:test-338
- root:test-336 | test | 0.4.1 npm release and downstream-private consumer validation contract | blocked/p1 | .mdkg/work/test-336-0-4-1-npm-release-and-postpublish-consumer-validation-contract.md
  refs: task-649, test-337, task-645, task-646, task-647, task-648, test-332
- root:task-647 | task | run 0.4.1 postpublish temp install and workflow probes | done/p1 | .mdkg/work/task-647-run-0-4-1-postpublish-temp-install-and-workflow-probes.md
  refs: task-646
- root:goal-51 | goal | plan generic remote Git project-memory primitives | done/p1 | .mdkg/work/goal-51-plan-generic-remote-git-project-memory-primitives.md
  refs: goal-48, goal-50, task-649, test-337, task-650, test-338, dec-61, dec-62, edd-62, edd-63, goal-52
  context_refs: root:dec-61, root:dec-62, root:edd-62, root:edd-63, root:goal-52
- root:task-646 | task | publish mdkg 0.4.1 after explicit approval | done/p1 | .mdkg/work/task-646-publish-mdkg-0-4-1-after-explicit-approval.md
  refs: task-645
- root:task-650 | task | define generic remote Git project-memory primitive surface | done/p1 | .mdkg/work/task-650-define-generic-remote-git-project-memory-primitive-surface.md
  refs: goal-51, goal-50, test-337, dec-61, dec-62, edd-62, edd-63, goal-52
  context_refs: root:dec-61, root:dec-62, root:edd-62, root:edd-63, root:goal-52
- root:chk-359 | checkpoint | mdkg 0.4.1 postpublish temp install validated | backlog/p9 | .mdkg/work/chk-359-mdkg-0-4-1-postpublish-temp-install-validated.md
- root:test-338 | test | generic remote Git public naming contract | done/p1 | .mdkg/work/test-338-generic-remote-git-public-naming-contract.md
  refs: goal-51, goal-50, task-649, test-337, task-650, dec-61, dec-62, edd-62, edd-63, goal-52
  context_refs: root:dec-61, root:dec-62, root:edd-62, root:edd-63, root:goal-52

## Raw Content Warnings
- none

## Pack Summary
- generated_at: 2026-07-05T03:08:24.195Z
- node_count: 9
- tokens_estimate: 6483
- truncated: max_nodes=false max_bytes=false

## Handoff Prompt
Continue from the target above. Preserve the boundaries, verify current repo state, use mdkg commands for structured lifecycle changes, and record validation evidence before closeout.
