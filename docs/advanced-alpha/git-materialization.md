---
title: Native Git and mdkg
description: Migrate removed Git wrappers to native Git and retain read-only graph evidence.
---

## Breaking change in 0.6.0

The Git materialization and lifecycle wrappers are removed completely in the
0.6.0 candidate. The former subcommands `clone`, `fetch`, `push`,
`materialize`, `closeout`, and `push-ready` have no compatibility aliases.
This URL remains available so existing documentation links do not break.

mdkg owns graph meaning and portable project memory. Native Git owns repository
transport, branches, worktrees, staging, commits, merges and remote updates.
Authentication remains external to mdkg. A consumer that accepts untrusted
repositories must own its authentication, containment, hook/submodule policy,
cleanup, and exact-revision verification; invoking Git alone does not provide
that security boundary.

## Read-only revision inspection

`mdkg git inspect` remains available:

```bash
mdkg git inspect --json
mdkg validate --json
```

Inspection reports local commit/tree hashes, sanitized remote descriptors and
working-tree state without contacting remotes or refreshing the Git index.
Configured filesystem-monitor helpers are disabled for this observation. Status
paths and columns are preserved, including rename/copy source paths. Failed or
incomplete observations produce an error, never a successful clean receipt.
If tracked content requires a configured clean/process filter, including inside
an initialized submodule, inspection refuses rather than running that helper or
disabling normalization and reporting misleading changes. Review the filter
before using native Git to inspect that repository.

Remote descriptors are display evidence, not reusable transport inputs. URL
userinfo, queries and fragments are omitted; opaque helper payloads and malformed
URL-like values are withheld. This is not a general-purpose secret detector for
arbitrary local paths or repository names. Authentication remains external.
These are local observations, not remote acceptance, deployment or execution
proof. Structural receipt validation does not authenticate external work.

## Native Git equivalents

| Former responsibility | Explicit replacement |
| --- | --- |
| Clone or fetch a repository | Native Git clone/fetch under the caller's authority and security policy. |
| Materialize a verified source | Consumer-owned source acceptance; verify pinned revisions, isolate untrusted content and record consumer evidence. |
| Closeout or push readiness | Run mdkg validation and inspect its evidence, then independently review native Git status and diff. |
| Stage, commit or push | Native Git with an explicit reviewed path list and separately authorized destination. |
| Optional DB checkpoint | Explicit generic mdkg DB snapshot operations; never infer them from a Git operation. |

Do not replace the old stage-all wrapper with blind broad staging. Review authored
memory, derived caches, secrets, and unrelated work before choosing commit paths.
Preserve historical receipts as historical evidence; do not rewrite them into
claims that a new workflow executed.

## Branches and worktrees

Use one writer per checkout and ordinary linked worktrees for parallel branches.
A branch's authored nodes remain usable before commit. Graph reconciliation and
native Git integration are separate review steps; reconciliation does not stage
files, merge Git history, or grant authority to commit or push. Checkout-local
selection, locks, journals and live DB state are not shared graph authority.

Pin target, incoming and common-ancestor revisions. On the target, preview and
apply the reviewed mdkg reconciliation, validate, and commit its exact graph
result under explicit Git authority before starting the native merge. Resolve
graph paths to that reviewed result, handle source/configuration separately,
validate the combined tree, commit the ancestry-preserving merge, and verify
both parent ancestries plus repeated integration. Never blanket-choose `ours`
for `.mdkg`. Git history is not rewritten by an alias remapping.

The 0.6.0 release qualification must verify the complete linked-worktree and
ancestry-preserving integration protocol before release claims are made. A
simple worktree run does not prove submodule-backed topology or concurrent
writes to the same checkout.

Use [Graph movement](/advanced-alpha/graph-movement/) for graph operations and
[Project DB and queues](/advanced-alpha/project-db-queues/) for explicit optional
local state. There is no Git-workflow fallback behind another mdkg command.
