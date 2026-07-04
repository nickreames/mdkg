---
name: service-boundary-ownership-check
description: Classify mdkg/runtime/sandbox/root ownership before boundary-sensitive planning so generic mdkg primitives are not given product-specific public names.
tags: [stage:plan, writer:orchestrator, mdkg, service-boundary, generic-capabilities]
authors: [mdkg]
links: [AGENT_START.md, CLI_COMMAND_MATRIX.md]
---

# Goal

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

## Steps

1. Identify the repo being changed and every repo whose authority is referenced.
2. Read the active node or user request, then inspect linked design, decision,
   checkpoint, and skill context only as needed.
3. Classify each mentioned primitive with the ownership matrix.
4. For mdkg-owned primitives, keep names generic and public-safe:
   remote/source descriptors, access refs, accepted revision proofs, graph
   discovery, history/why/next-work queries, and agent working-loop operations.
5. For authenticated Git access, store only opaque refs, capability names,
   hashes, or policy references. Do not store credentials, PATs, SSH key
   material, agent socket paths, raw provider payloads, or live secret values.
6. If product-specific runtime behavior is needed, record it as downstream
   consumer policy or private handoff context, not as a public mdkg primitive.
7. If the active publish/release node is not ready to own a primitive, create or
   update a separate mdkg-only planning node instead of overloading the release.
8. At closeout, record owner, consumer, forbidden surfaces, validation gates,
   and any intentionally deferred successor work.

## Outputs

- Owner/consumer/forbidden-surface classification
- Generic naming recommendation or rewrite target
- Follow-up planning node when ownership belongs to mdkg but implementation is
  not ready for the active release lane
- Validation and dirty-state evidence when durable writes are made

## Safety

- Prefer repo truth over chat memory.
- Keep secrets out of skills, references, and generated artifacts.
- Stop and resolve ambiguity instead of guessing.
- Do not publish, push, deploy, mutate downstream repos, refresh root bundles,
  or run live runtime/sandbox work unless the active node explicitly authorizes
  it.
- Do not add product-specific names to public mdkg primitives.
- Do not store raw Git credentials, access tokens, SSH key material, raw prompts,
  raw model output, queue bodies, provider dumps, or runtime state roots in
  mdkg.

## Failure Handling

- If required context or policy is unclear, stop and ask before proceeding.
- If the procedure needs more detail, load the specific reference rather than broad context.
- If a release/publish lane would need to claim unfinished remote Git or
  project-memory primitives, checkpoint the gap and route it to a generic
  successor planning node.
