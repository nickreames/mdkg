---
name: service-boundary-ownership-check
description: Classify mdkg/runtime/sandbox/root ownership before boundary-sensitive planning so generic mdkg primitives are not given product-specific public names.
tags: [stage:plan, writer:orchestrator, mdkg, service-boundary, generic-capabilities]
authors: [mdkg]
links: [AGENT_START.md, CLI_COMMAND_MATRIX.md]
---

# Purpose

Classify ownership before boundary-sensitive mdkg planning so generic project
memory primitives are described as mdkg capabilities and product-specific
runtime policy does not leak into public mdkg naming.

## When To Use

- Before planning or closing work that mentions remote Git repositories,
  authenticated Git access, `.mdkg` graph discovery, accepted revisions,
  history/why/next-work queries, agent working loops, root handoffs, runtime
  profiles, sandbox lifecycle, or downstream product consumers.
- When a work item appears to assign a generic mdkg primitive to a runtime,
  sandbox, backend, template, or product-specific public surface.
- Before writing release, publish-readiness, handoff, or skill language that
  could accidentally brand generic mdkg behavior around one downstream product.
- Before creating or closing a task that would change public website copy from
  internal release, deploy, npm, provider, or checkpoint evidence.

## Inputs

- Repo root
- Current task, goal, checkpoint, handoff, or user request
- Relevant design, decision, work, or skill nodes
- Current git/mdkg status when mutations or closeout are in scope

## Ownership Matrix

- `mdkg`: generic Git-native project memory, remote repository descriptors,
  authenticated Git access refs, `.mdkg` graph discovery, accepted revision
  evidence, history/why/next-work queries, and generic agent working-loop
  primitives.
- `runtime/product consumer`: product-specific profile behavior on top of mdkg
  primitives, including lifecycle policy, role assignment, execution queues,
  runtime receipts, local state roots, and product-owned handoff semantics.
- `sandbox/security boundary`: secure execution lifecycle, vault or secret
  grant refs, cleanup authority, redaction gates, and refs-only returns from a
  secure boundary.
- `root/backend/orchestrator`: request routing, acceptance of refs-only
  handoffs, coordination evidence, and follow-up graph routing.
- `templates/examples`: starter content and fixture catalogs consumed by
  runtimes through independent source descriptors.
- `public positioning`: homepage, demo, trust, and launch narrative copy. These
  pages can mention released capabilities, but they are not automatic mirrors of
  internal operational evidence.

## Steps

1. Identify the repo being changed and every repo whose authority is referenced.
2. Read the active node or user request, then inspect linked design, decision,
   checkpoint, and skill context only as needed.
3. Classify each mentioned primitive with the ownership matrix.
4. For mdkg-owned primitives, keep names generic and public-safe:
   remote/source descriptors, access refs, accepted revision proofs, graph
   discovery, history/why/next-work queries, and agent working-loop operations.
5. Classify each public surface before creating copy work:
   package/runtime truth, docs/reference truth, public positioning, and
   internal operational evidence are different ownership surfaces.
6. For authenticated Git access, store only opaque refs, capability names,
   hashes, or policy references. Do not store credentials, PATs, SSH key
   material, agent socket paths, raw provider payloads, or live secret values.
7. If product-specific runtime behavior is needed, record it as downstream
   consumer policy or private handoff context, not as a public mdkg primitive.
8. If internal release/deploy evidence needs to be public, route command truth,
   release facts, and validation evidence to docs/reference/changelog first.
   Change public positioning only when it is objectively false for users, an
   active public-copy node owns it, or the user approves the positioning change.
9. If the active publish/release node is not ready to own a primitive, create or
   update a separate mdkg-only planning node instead of overloading the release.
10. At closeout, record owner, consumer, forbidden surfaces, validation gates,
   and any intentionally deferred successor work.

## Outputs

- Owner/consumer/forbidden-surface classification
- Generic naming recommendation or rewrite target
- Follow-up planning node when ownership belongs to mdkg but implementation is
  not ready for the active release lane
- Validation and dirty-state evidence when durable writes are made

## Checkout And Publication Planning

- Re-inventory HEAD, branch, index, refs, worktrees, locks, and dirty-unit owners
  before accepting checkout custody or making guidance changes. Historical
  releases, selected goals, and a passing check do not grant a writer lease.
  Preserve inherited bytes and state; stop on a conflicting writer or drift.
- The reviewed existing-branch bootstrap/cleanup is a one-time exception on
  `main`. It does not open new feature branches, PRs, or publication.
- New feature branches and PRs wait for accepted full-history git-gud
  completion in the portfolio root's Task549. After that gate and a scoped
  authorization, plan one isolated native Git worktree and feature branch per
  owner and useful outcome from the accepted integration tip. mdkg library/docs
  PRs target `main`; stacks require actual dependencies. Nick manually reviews
  and merges.
- For deployed-app consumers, canonical `staging` is the intended integration
  branch. Preserve Web's reviewed `stage` source and `staging` deployment mirror
  until ancestry, environment isolation, hosting triggers, and rollback support
  a separately approved migration. This skill authorizes no rename or routing
  change in a consumer repository.
- Record separate dev/staging/prod data, credential refs, configuration,
  runtime resources, and synthetic fixtures. Require technical CI/hosting and
  environment controls; prose alone is not isolation proof. PR checks receive
  no production secrets. Review triggers on normal, backup, and rewritten refs
  before any proposed publication.
- A production-triggering publication needs explicit Nick approval of that
  consequence or an approved isolated route. A production action needs approval
  naming environment, exact candidate, action, and rollback. Commits, pushes,
  tags, releases, providers, history changes, root projections, and deployments
  each remain within their explicitly approved scopes.
- Keep repository cleanup separate from unfinished source, tracked cache, and
  release units. Retain published Goal85/Task832 evidence and achieved
  Goals78/82; paused Goal87 stays its own follow-up. Do not republish 0.6.0,
  refresh tracked SQLite, or repair runtime operational behavior as cleanup.

## Required Capabilities

- Read-only Git and focused mdkg discovery.
- Canonical skill authoring and supported mirror sync only when authorized.
- Unit-scoped graph, skill, mirror, and preservation checks.

## Resources Touched

- Assigned repository guidance and this canonical skill.
- Configured native mirrors through `mdkg skill sync`.
- Private baseline and validation receipts within the accepted scope.
- Root and consumer context is read-only unless separately authorized.

## Validation Checks

- Validate this skill with `mdkg skill validate service-boundary-ownership-check --json`.
- After authorized edits, run `mdkg skill sync --json`, then
  `mdkg skill validate --json` for canonical/mirror/public projection checks.
- Run `mdkg validate --changed-only --json` and full graph validation, plus
  `git diff --check`; distinguish warnings and stale caches from graph errors.
- Verify exact changed paths, unchanged inherited bytes/state/index/refs, and
  absence of conflicting writers. Do not refresh caches to hide a warning.

## Closeout Evidence

- Owner, authority, repo/HEAD/branch, baseline path/hash, and custody bookends.
- Exact guidance/mirror paths and each inherited, migration, or new unit's
  disposition, checks, and gaps.
- Accepted history gate evidence before future branch/PR work, and separate
  commit/publication/production approvals before those actions.
- Root or consumer decisions still pending; no clean-candidate claim for a
  dirty checkout or substitute clone.

## Safety Rules

- Prefer repo truth over chat memory.
- Keep secrets out of skills, references, and generated artifacts.
- Stop and resolve ambiguity instead of guessing.
- Do not publish, push, deploy, mutate downstream repos, refresh root bundles,
  or run live runtime/sandbox work unless the active node explicitly authorizes
  it.
- Do not add product-specific names to public mdkg primitives.
- Do not turn internal Vercel/npm/provider/checkpoint status into homepage or
  launch-narrative copy by default.
- Do not store raw Git credentials, access tokens, SSH key material, raw prompts,
  raw model output, queue bodies, provider dumps, or runtime state roots in
  mdkg.

## Failure Modes

- If required context or policy is unclear, stop and ask before proceeding.
- If the procedure needs more detail, load the specific reference rather than broad context.
- If a release/publish lane would need to claim unfinished remote Git or
  project-memory primitives, checkpoint the gap and route it to a generic
  successor planning node.
- If a paused goal, required mutation, or product decision falls outside current
  authority, return an exact patch proposal or blocker to the coordinator. Do
  not bypass the gate, weaken checks, or implement source merely to clean Git.

## Related Manifests

- None required; the assigned work contract and accepted decisions define scope.

## Projection Targets

- Canonical: `.mdkg/skills/service-boundary-ownership-check/SKILL.md`.
- Configured `.agents/skills/` and `.claude/skills/` mirrors only.
- Repository-only exclusion under DEC89: do not project this private policy
  into `assets/init/skills/default/`, built public seeds, or generic consumers.

## Open Questions

- Before future branch/PR work, the root coordinator must supply accepted
  Task549 full-history completion evidence.
- Before publication or production actions, resolve current origin freshness,
  branch/provider triggers, environment isolation, and exact action approval.
