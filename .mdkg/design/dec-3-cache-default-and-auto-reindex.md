---
id: dec-3
type: dec
title: cache is default and commands auto reindex when stale
status: accepted
tags: [cache, indexing, mdkg]
owners: []
links: []
artifacts: []
relates: []
refs: []
aliases: []
created: 2026-01-06
updated: 2026-01-14
---

# Context

Graph search and traversal should be fast even as documentation grows. A cache/index is required for good UX.

We also want low friction for humans and agents; stale caches should not cause confusing behavior.

# Decision

- caching is enabled by default
- authoritative global cache path: `.mdkg/index/global.json`
- commands that require graph data automatically rebuild the index when stale
- a manual command exists: `mdkg index`
- strict indexing is default; tolerant mode is an escape hatch

# Alternatives considered

- no cache (reject): slow scanning and parsing on every command
- cache optional default-off (reject): encourages slow, inconsistent usage
- require manual index always (reject): too easy to forget, poor agent UX

# Consequences

- index rebuild must be reliable and deterministic
- staleness detection must be correct (config and markdown mtimes)
- index path must remain gitignored and safe

# Links / references

- none
