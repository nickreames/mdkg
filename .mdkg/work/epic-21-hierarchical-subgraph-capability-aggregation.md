---
id: epic-21
type: epic
title: hierarchical subgraph snapshot aggregation
status: done
priority: 1
tags: [subgraph, orchestration, snapshot-bundle, capability-cache]
owners: []
links: []
artifacts: []
relates: [epic-19, epic-20, epic-22, epic-23, epic-27, task-171, epic-38]
blocked_by: []
blocks: [task-172, task-173, task-174, task-175, task-176, task-177, task-178, task-179, task-180]
refs: []
aliases: [subgraph-capability-aggregation]
skills: []
created: 2026-05-14
updated: 2026-05-30
---

# Goal

Design higher-level orchestration graphs that aggregate read-only child graph
snapshots from registered repos, submodules, agents, and projects.

The root graph should lazy-load child capabilities and semantic context from
full `.mdkg` snapshot bundles instead of scanning the full child checkout by
default.

# Locked Direction

- `mdkg subgraph ...` becomes the public orchestration command family.
- `mdkg bundle import ...` is removed from the public CLI and docs instead of
  remaining as a compatibility alias.
- `subgraphs` replaces `bundle_imports` as the semantic config surface.
- Each subgraph starts with `permissions: ["read"]`.
- Default freshness is 60 minutes.
- `mdkg subgraph refresh` reloads configured bundle sources only; it does not
  build bundles inside child repos.
- `mdkg capability resolve` is the first orchestration primitive and ranks
  deterministically.
- Stale subgraphs remain visible by default with degraded ranking; `--fresh-only`
  excludes them.

# Scope

- Aggregate read-only child graph data from snapshot bundles.
- Preserve root/child boundaries for `agents/` and `project/` submodule
  orchestration models.
- Preserve cache freshness and source visibility metadata.
- Avoid mutating child graph state from the root import view.
- Keep SQLite as a rebuildable local read model, not the durable interchange
  format.
- Keep bundle ZIPs as the committed/shareable snapshot artifacts.

# Milestones

- Root orchestration graphs can search, show, and pack imported child graph
  snapshot content.
- Aggregated records include source repo, source commit, bundle freshness,
  public/private profile, and visibility metadata.
- Higher-level graphs can lazy-load child capabilities and subagents without
  scanning full submodule contents.
- Child repos remain the mutation owners for their full mdkg graph state.
- Root orchestration graphs can resolve local and imported capabilities through
  one deterministic capability resolver.

# Out of Scope

- No direct write-through mutation into child snapshots.
- No generated semantic summaries unless a later design explicitly approves them.
- No hosted orchestration service.
- No request/work-order export protocol in this phase.
- No receipt-outcome weighted ranking in this phase.

# Risks

- Root graphs may reason over stale child snapshots unless freshness and commit
  metadata are prominent.
- Private-local snapshots must not be mistaken for public/export-safe bundles.
- Child repo cache failures should degrade clearly without corrupting root graph
  state.

# Closeout

Completed in the 0.1.4 implementation pass.

Delivered:
- `subgraphs` config as the semantic orchestration surface over bundle ZIP
  transport.
- Public `mdkg subgraph add/list/show/rm/enable/disable/verify/refresh`.
- Legacy `mdkg bundle import ...` removal from public onboarding with explicit
  upgrade guidance.
- `.mdkg/index/subgraphs.json` and SQLite schema v2 subgraph hydration.
- Read-path integration for list/search/show/pack/capability.
- Read-only mutation guards for subgraph qids.
- `mdkg capability resolve` with deterministic local plus subgraph ranking and
  stale degradation.
- Validation, doctor, public bundle, and public pack fail-closed behavior for
  subgraph visibility boundaries.
- Packed temp root/child/grandchild smoke coverage.

Verification:
- `npm run test`
- `npm run cli:check`
- `node dist/cli.js validate`
- `npm run smoke:consumer`
- `npm run smoke:matrix`
- `npm run smoke:upgrade`
- `npm run smoke:init`
- `npm run smoke:capabilities`
- `npm run smoke:archive-work`
- `npm run smoke:bundle`
- `npm run smoke:subgraph`
- `npm run smoke:visibility`
- `npm run smoke:sqlite`
- `npm run smoke:parallel`
- `node scripts/assert-publish-ready.js`
- `npm pack --dry-run --json`
- `npm publish --dry-run`
- `git diff --check`

# Links / Artifacts

- `epic-19`
- `epic-20`
- `epic-22`
- `epic-23`
- `epic-27`
- `task-171`
