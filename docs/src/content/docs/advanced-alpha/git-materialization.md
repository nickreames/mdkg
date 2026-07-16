---
title: Verified Git Materialization
description: Accept an exact Git revision into a contained destination with bounded evidence.
---

Use `mdkg git materialize` when an orchestrator has already selected a Git source and must prove that the local tree exactly matches an accepted commit before making it available to later work. This is an advanced alpha source-ingestion boundary, not a package manager, deployment command, or replacement for `mdkg git clone`.

## Request contract

The command accepts one strict JSON object from a file or standard input:

```bash
mdkg git materialize --request materialize-request.json --json
```

```json
{
  "schema": "mdkg.git.materialize.request.v1",
  "source_ref": "catalog-source-v1",
  "repository_ref": "https://github.com/example/project.git",
  "access_ref": "public-https",
  "auth_capability": "unauthenticated",
  "target_ref": "refs/heads/main",
  "expected_commit": "0123456789abcdef0123456789abcdef01234567",
  "expected_tree": "89abcdef0123456789abcdef0123456789abcdef",
  "destination": "sources/project",
  "depth": "full",
  "submodule_policy": "deny",
  "project_memory_policy": "optional",
  "correlation_ref": "run-42",
  "evidence_refs": ["approval-17"]
}
```

The schema rejects unknown fields, duplicate keys, YAML, control characters, embedded credentials, credential-shaped opaque refs, option-shaped values, unsupported protocols, partial refs, abbreviated object ids, and unsafe destinations before Git executes.

| Field | Contract |
| --- | --- |
| `source_ref` | Stable caller-owned source identity. |
| `repository_ref` | Credential-free HTTPS, SSH, Git, file, SCP-like, or local Git source. |
| `access_ref` | Stable caller-owned access-policy identity, never a credential. |
| `auth_capability` | One of `unauthenticated`, `gh`, `ssh-agent`, `credential-helper`, or `git-environment`. |
| `target_ref` | Full `refs/heads/...` or `refs/tags/...` ref. Annotated tags are peeled to their commit. |
| `expected_commit` | Required full SHA-1 or SHA-256 commit id. |
| `expected_tree` | Optional full tree id using the same object format as the commit. |
| `destination` | Contained relative path beneath the current mdkg root. |
| `depth` | `full` or a positive integer. |
| `submodule_policy` | `deny` rejects gitlinks; `ignore` records bounded gitlink evidence without initializing submodules. |
| `project_memory_policy` | `required`, `optional`, or `forbidden` for discovered `.mdkg/config.json`. |
| `correlation_ref`, `evidence_refs` | Optional bounded opaque non-secret caller refs copied into the receipt. |

`source_ref`, `access_ref`, `correlation_ref`, and each `evidence_refs` value are identifiers, not secret containers. Stable namespaced values such as `catalog://org/source-v1`, `policy://git/public-read`, `run://materialization/42`, and `evidence://approval/17` are accepted. Assignment-shaped values and recognizable bearer, token, API-key, private-key, cloud-key, and JWT forms are rejected before Git executes. Put credentials only in the declared external authentication capability.

## Acceptance sequence

mdkg invokes system Git with an argument array, disables prompts and repository hooks, prohibits recursive submodules, fetches only the declared full ref, and verifies the observed commit, tree, and object format. Project-memory validation reads the candidate graph without indexing it and without executing repository scripts, hooks, skills, or commands.

The candidate stays in a same-parent temporary directory until every identity and policy check passes. Acceptance uses a same-parent atomic rename. An existing destination, a symlink escape, cancellation, or any failed check leaves no accepted destination. Cancellation terminates the active Git process group and removes bounded temporary state.

A positive numeric depth applies to clone and fetch. It is transport behavior, not permission to fetch an object id directly. Use `full` when history depth itself should not constrain the accepted source.

## Authentication and redaction

Authentication remains external. The declared capability only asks mdkg to confirm that the expected auth class is available:

- `unauthenticated` requires no auth state.
- `gh` checks `gh auth status`.
- `ssh-agent` checks that an SSH agent socket is declared.
- `credential-helper` checks that Git has a credential helper configured.
- `git-environment` checks for supported Git or SSH askpass/command environment configuration.

Receipts retain only capability availability and a bounded reason code. They never retain credential values, environment values, helper output, socket paths, raw Git output, repository contents, or absolute local paths. Repository evidence uses a transport, bounded label, and hash rather than echoing the raw source ref.

## Receipt and failures

Success and failure both use `mdkg.git.materialize.receipt.v1`. A success receipt includes the request hash, expected and observed revision identities, object format, policy outcomes, destination state, cleanup state, reason code, and warnings:

```json
{
  "schema": "mdkg.git.materialize.receipt.v1",
  "action": "git.materialize",
  "ok": true,
  "reason_code": "accepted",
  "request_hash": "sha256...",
  "observed_revision": {
    "commit": "0123456789abcdef0123456789abcdef01234567",
    "tree": "89abcdef0123456789abcdef0123456789abcdef",
    "object_format": "sha1"
  },
  "destination": {
    "path": "sources/project",
    "state": "accepted",
    "published": true
  },
  "cleanup": {
    "state": "complete",
    "temporary_paths_remaining": 0
  }
}
```

Materialization failures exit with code `2` and a bounded receipt. Representative reason codes include `invalid_request`, `auth_unavailable`, `destination_exists`, `target_ref_missing`, `commit_mismatch`, `tree_mismatch`, `submodules_denied`, `project_memory_required`, `project_memory_forbidden`, `project_memory_invalid`, `cancelled`, and `cleanup_failed`. Treat the reason code as the stable diagnostic surface; do not depend on raw Git stderr.

## Project-memory policy

- `required`: the accepted tree must contain valid mdkg project memory.
- `optional`: validate project memory when present; a source without `.mdkg/config.json` is accepted.
- `forbidden`: reject a source that contains `.mdkg/config.json`.

Discovery is intentionally inert. It does not hydrate SQLite, rebuild indexes, install skills, or execute repository-controlled behavior.

## Clone compatibility

`mdkg git clone` remains the direct system-Git convenience command for a caller that wants a contained clone without the strict request/accepted-revision protocol:

```bash
mdkg git clone https://github.com/example/project.git --target worktrees/project --branch main --json
```

Use `mdkg git materialize` for policy-bound source acceptance and bounded evidence. Use `mdkg git clone` for the existing clone workflow. Use `mdkg graph clone|fork|import-template` for mdkg graph-template movement rather than repository materialization.
