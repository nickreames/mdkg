---
title: Safety Boundaries
description: What mdkg does and does not do.
---

Markdown Knowledge Graph is durable semantic memory, not an execution runtime.

The trust model is local-first and low-dependency: Markdown and Git stay authoritative, generated caches are rebuildable, and optional SQLite-backed project DB state stays local.

## What mdkg does

- Stores graph state in Markdown and frontmatter.
- Builds deterministic context packs.
- Records goals, tasks, spikes, checkpoints, decisions, and evidence refs.
- Creates bounded handoffs for humans and agents.
- Validates graph state and generated caches.

## What mdkg does not do

- It does not execute agent work automatically.
- It does not execute skill scripts.
- It is not a hosted memory service.
- It is not a hosted queue service.
- It is not a vector database.
- It is not a comprehensive secret scanner or DLP product.
- It is not a package-manager credential manager.
- It does not expose arbitrary SQL through public CLI commands.
- It does not make queue state canonical runtime history.

## What not to store

Keep these out of graph nodes, checkpoints, packs, handoffs, docs fixtures, and examples:

- npm tokens and package-manager auth files
- provider credentials and deployment tokens
- private keys
- raw prompts or raw model output
- provider payloads and production payloads
- bulky runtime traces

## Advanced alpha boundaries

- MCP is read-only.
- Subgraphs are read-only planning context.
- Mutating commands reject subgraph qids.
- Visibility filtering is metadata enforcement, not arbitrary body redaction.
- Handoff raw-marker warnings are safety aids, not comprehensive scanning.
- Internal project DB events, reducers, leases, and materializers are not public CLI surfaces.

## Public copy and release evidence

mdkg keeps release evidence in the repo, but not every public page should mirror
that evidence directly.

- `docs.mdkg.dev`, the generated CLI reference, and `CHANGELOG.md` are the
  reference surfaces for current commands, release notes, validation gates, and
  capability details.
- `mdkg.dev` homepage, demo, trust, and launch pages are public positioning
  surfaces. They should stay stable and user-facing unless the copy is
  objectively false, a public-copy task owns the wording, or the change is
  explicitly approved.
- Internal checkpoints, npm postpublish receipts, Vercel deployment ids, and
  provider logs can support docs and changelog updates, but they should not
  become homepage claims by default.
- Release currentness audits should check package metadata, docs, generated
  references, changelog coverage, and no-secret/public-claim safety. Homepage
  audits should focus on not overclaiming and on stable structured metadata,
  rather than forcing every internal operational milestone into marketing copy.
