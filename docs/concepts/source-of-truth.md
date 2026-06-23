# Source Of Truth

mdkg is intentionally repo-native.

Trust order for durable project memory:

1. Markdown and frontmatter in `.mdkg/`
2. Git history and review
3. generated indexes and caches
4. optional local project DB state

Generated indexes are rebuildable. SQLite is local infrastructure where useful, not hidden product state.

## Why Markdown

- Humans can read it.
- Agents can inspect it.
- Git can diff it.
- Frontmatter gives machines enough structure to route work safely.
