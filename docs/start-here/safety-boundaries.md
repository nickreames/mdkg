# Safety Boundaries

Markdown Knowledge Graph is durable semantic memory, not an execution runtime.

## Unresolved filesystem limits in the 0.6.0 candidate

Use an access-controlled checkout with one writer per checkout. Restrictive
per-file ACL/owner preservation and resistance to adversarial ancestor-directory
replacement are **deferred and unresolved**, not accepted or fixed findings.
Path, link, type and custody checks remain useful but are not an atomic sandbox
against a hostile concurrent process. Do not use mdkg to isolate mutually
untrusted writers sharing a filesystem.

SQLite observation uses built-in Node APIs and an in-memory database image,
not an mdkg-owned native helper. Memory use grows with the image size; unsafe
or insufficiently resourced inputs refuse without a writable-file fallback.
Recovery requires an explicit assertion that all checkout writers are stopped
and fresh exact evidence. A missing PID or old lock is not takeover authority.

## What mdkg Does

- Stores graph state in Markdown and frontmatter.
- Builds deterministic context packs.
- Records goals, tasks, spikes, checkpoints, decisions, and evidence refs.
- Creates bounded handoffs for humans and agents.
- Validates graph state and generated caches.

## What mdkg Does Not Do

- It does not execute agent work automatically.
- It does not execute skill scripts.
- It is not a hosted memory service.
- It is not a vector database.
- It is not a comprehensive secret scanner or DLP product.
- It does not make queue state canonical runtime history.

## Advanced Alpha Boundaries

- MCP is read-only.
- Subgraphs are read-only planning context.
- Mutating commands reject subgraph qids.
- Visibility filtering is metadata enforcement, not arbitrary body redaction.
- Handoff raw-marker warnings are safety aids, not comprehensive scanning.
- Internal project DB events, reducers, leases, and materializers are not public CLI surfaces.
