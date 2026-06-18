---
id: spike-7
type: spike
title: research graph template fork UX for agent coding demos
status: done
priority: 2
epic: epic-92
parent: goal-18
tags: [0.3.5, spike, graph-template, demo]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-386, task-389]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-17
---
# Research Question

How should mdkg clone, fork, and import whole graphs so demo templates are reusable without ID conflicts?

# Context And Constraints

- Separate repos should preserve IDs.
- Same-repo imports must rewrite IDs and links.
- The website-template-mdkg demo requires start-from-goal clarity.

# Search Plan

- Review template import UX in project scaffolding tools.
- Inspect existing subgraph sync/materialize safety.
- Design source/destination path containment checks.

# Findings

- Existing graph transport already has two strong primitives:
  - `mdkg bundle create|verify|show|list` creates deterministic full-graph snapshot ZIPs with manifests, profile filtering, source tree hashes, generated indexes, archive sidecars, and public/private visibility gates.
  - `mdkg subgraph add|audit|upgrade-plan|sync|materialize` projects child graph bundles as read-only planning context, checks root-contained paths, refuses dirty child repos by default during sync, and materializes bundles into marked inspection trees.
- Legacy `mdkg bundle import ...` is intentionally not a supported path. The command matrix says it should direct users toward upgrade/subgraph workflows, so 0.3.5 should not revive that meaning.
- The 0.3.4 `fix ids` machinery already solves deterministic ID rewriting and safe link preservation for local duplicate IDs and Git-stage conflicts. Same-repo template import should reuse the same concepts, but it needs an import-specific receipt because every imported node may need an ID and filename rewrite before it enters the graph.
- Separate-repo clone and same-repo import are different enough that one ambiguous `import` command would be risky:
  - separate-repo clone/fork should preserve node IDs because the destination graph is a new ID namespace.
  - same-repo template import must rewrite every colliding numeric ID and update internal links before validation.
- Demo UX needs a first-class "start goal" output. A website-template-mdkg graph should be able to say: preserve the original start goal in a separate repo, or rewrite/select an imported start goal in the current repo.
- Subgraphs remain read-only orchestration views. They are useful for planning and capability discovery but are not the right mutation surface for cloning, forking, or importing authored nodes into the owning graph.

# Options And Tradeoffs

- Option A: add graph transport commands under a new `mdkg graph ...` namespace.
  - Pros: clear product language for whole-graph clone/fork/import, avoids overloading bundle/subgraph.
  - Cons: creates a new top-level command family and requires command matrix/help/docs coverage.
- Option B: extend `mdkg bundle` with clone/import subcommands.
  - Pros: implementation proximity to bundle parsing and verification.
  - Cons: conflicts with the existing decision that legacy bundle import should remain guided away; users may confuse read-only bundle handoff with authored graph mutation.
- Option C: extend `mdkg subgraph` to import/materialize into authored graph nodes.
  - Pros: reuse source configuration and materialization checks.
  - Cons: violates the read-only subgraph mental model and would blur single-writer ownership.
- Option D: make this only a smoke/script workflow for now.
  - Pros: smallest implementation.
  - Cons: does not satisfy the 0.3.5 product goal; demo templates remain manual and error-prone.

# Recommendation

- Add a new `mdkg graph ...` command family as the public 0.3.5 surface:
  - `mdkg graph clone <source-bundle-or-mdkg-dir> --target <path> [--json]`
  - `mdkg graph fork <source-bundle-or-mdkg-dir> --target <path> [--start-goal <goal-id>] [--json]`
  - `mdkg graph import-template <source-bundle-or-mdkg-dir> [--id-prefix <prefix>] [--start-goal <goal-id>] [--select-goal] [--dry-run] [--json]`
- Keep semantics strict:
  - clone/fork writes into an empty or mdkg-safe destination repo and preserves IDs.
  - import-template writes into the current repo and rewrites IDs/links deterministically before any authored node is committed.
  - dry-run is required and default-like for import-template unless `--apply` is passed.
  - receipts must include source hash, destination path, preserved or rewritten IDs, rewritten references, selected start goal, skipped files, and validation outcome.
- Build internal helpers around existing primitives:
  - parse and verify bundles with `parseBundle`/`verifyBundle`.
  - reuse path containment and materialized-marker patterns from `subgraph materialize`.
  - reuse or extract ID candidate/ref rewrite helpers from `fix ids` for import-template.
- Treat website-template-mdkg as dogfood planning only in this repo:
  - create mdkg nodes describing the template graph, start goal, demo flow, Vercel preview/subdomain decisions, DESIGN.md requirements, EDDs, tasks, tests, and skill candidates.
  - do not mutate a separate website-template-mdkg repo in 0.3.5 unless separately requested.

# Follow-Up Nodes To Create

- task-386
- task-387
- task-388
- task-389
- test-165
- test-166
- test-167

# Skill Candidates

- A future `clone-mdkg-template-graph` skill should document how to export a template bundle, fork it into a clean repo, run `goal activate`, and hand off only the starting goal to a coding agent.
- A future `author-demo-website-mdkg-graph` skill should capture the website demo graph recipe: DESIGN.md, product/SEO copy, deployment contract, preview URL evidence, durable demo-subdomain promotion, and teardown notes.

# Data Structures And Algorithms Notes

- Import receipts need a stable mapping shape: `{ from_id, to_id, from_path, to_path, reason, reference_rewrites[] }`.
- Candidate ID generation should be deterministic by type and numeric suffix, using existing graph IDs plus imported IDs as the used set.
- Reference rewriting must cover frontmatter scalar/list fields, graph-edge fields, body-local qid mentions where safe, and selected-goal/start-goal state. Imported external refs should remain unchanged.
- The import algorithm should stage in a temp directory, validate the rewritten graph in memory or in a scratch repo, then acquire the mutation lock and write files atomically.

# UX Notes

- Use `graph clone`/`graph fork` for separate-repo preserved-ID workflows and `graph import-template` for same-repo rewritten-ID workflows.
- Receipts should state whether the operation preserved IDs or rewrote IDs in the first screen of JSON.
- `import-template --dry-run --json` should be the documented first command. `--apply` should be explicit.
- `--select-goal` should only be allowed when `--start-goal` resolves to an imported or preserved goal and should write selected-goal state after validation.
- Help text must warn that subgraphs are read-only views, while graph clone/fork/import creates or imports authored graph state.

# Security Notes

- Never copy ignored runtime DB files, `.mdkg/pack/`, existing `.mdkg/bundles/`, `.mdkg/subgraphs/`, or raw archive source copies into authored graph state.
- Require root-contained target paths and reject parent-directory traversal, NUL bytes, and unsafe overwrite targets.
- Clone/fork must not mutate the source repo or source bundle.
- Same-repo import must hold the mutation lock and validate before/after graph state.
- Preserve subgraph read-only mutation guards; do not let import-template mutate a configured child graph through its subgraph alias.
- Receipts should be safe to commit and must not include secret file contents from archive payloads.

# Evidence And Sources

- `node dist/cli.js show goal-18 --json`
- `node dist/cli.js goal next goal-18 --json`
- `node dist/cli.js show spike-7 --json`
- `rg -n "subgraph|materialize|bundle|archive|import|clone|fork|template|id repair|fix ids" CLI_COMMAND_MATRIX.md README.md src scripts tests .mdkg/work/goal-18* .mdkg/work/task-386* .mdkg/work/task-387* .mdkg/work/task-388* .mdkg/work/task-389* .mdkg/work/test-165* .mdkg/work/test-166* .mdkg/work/test-167*`
- `sed -n '1,320p' src/commands/bundle.ts`
- `sed -n '1,360p' src/commands/subgraph.ts`
- `sed -n '1,360p' src/commands/fix.ts`
- `rg -n "export function runBundle|function buildBundle|export function buildBundle|parseBundle|verifyBundle|legacy|import" src/commands/bundle.ts`
- `rg -n "export function runSubgraphMaterialize|function runSubgraphMaterialize|function runSubgraphSync|audit|upgrade-plan|materialize" src/commands/subgraph.ts`
- `rg -n "duplicate|rewrite|applyDuplicate|git_stage|baseRef|writeFrontmatter|atomicWriteFile|rename|nextAvailable" src/commands/fix.ts`
