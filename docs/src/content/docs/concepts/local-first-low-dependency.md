---
title: Local-first and Low-dependency
description: mdkg's security posture starts with Markdown, Git, and rebuildable local artifacts.
---

Low dependency is part of mdkg's security philosophy.

## Markdown is the source of truth

Project memory lives in `.mdkg/` Markdown files and frontmatter. Humans can read it, agents can inspect it, and Git can review it.

## Git tracks the memory layer

mdkg state can be diffed, reverted, branched, merged, reviewed, and handed off like other repo files.

## Generated indexes are rebuildable

`.mdkg/index/` exists for local access and performance. It should not become hidden authority. Rebuild it with:

```bash
mdkg index
```

## Optional project DB state is advanced

`.mdkg/db/` is optional local infrastructure for advanced workflows such as queue delivery and sealed snapshots. It is not the default mental model for getting started.

## Modern Node and node:sqlite

mdkg uses modern Node capabilities where useful to reduce extra runtime dependencies. Follow the install page's Node requirement before relying on project DB features.

## What not to store

Do not store raw secrets, package-manager tokens, provider credentials, private keys, raw prompts, provider payloads, or sensitive production data in graph nodes.

Package-manager credentials and deployment tokens belong in your normal secret-management path, not in `.mdkg/` Markdown, checkpoints, examples, packs, or handoffs.

## What mdkg does not claim

mdkg is not a hosted memory service, secret scanner, autonomous runtime, vector database, or replacement for code review.
