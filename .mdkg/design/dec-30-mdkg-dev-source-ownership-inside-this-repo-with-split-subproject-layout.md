---
tags: [mdkg-dev, source-ownership, split-layout]
owners: []
links: []
artifacts: [mdkg_planning_docs.zip]
relates: []
refs: [archive://archive.mdkg-dev-planning-docs-2026-06-22]
aliases: [mdkg-dev-source-layout]
created: 2026-06-22
updated: 2026-06-22
id: dec-30
type: dec
title: mdkg.dev source ownership inside this repo with split subproject layout
status: accepted
---
# Context

Older mdkg.dev planning treated the docs/site as external-only context. The current approved direction is to keep canonical mdkg.dev website source inside this repo while preserving a clean split between site implementation, documentation source, and demo/template graphs.

# Decision

- Own canonical mdkg.dev source in this repo.
- Use /mdkg-dev for the Astro static site subproject.
- Use /docs for GitBook documentation source.
- Use /examples for demo repos and template graphs.
- Treat GitBook as a renderer or sync target; repo files remain canonical.
- Add subgraphs only after each subproject/example has its own valid .mdkg graph.
- Keep live demo previews and durable demo subdomains separate from canonical mdkg.dev SEO.

# Alternatives considered

- Keep mdkg.dev external-only: rejected because it leaves public launch planning disconnected from the CLI command contract and mdkg graph.
- Use one monolithic website/docs directory: rejected because it muddies docs source, site source, generated references, and demos.
- Build demos directly into the canonical website: rejected because live demos need disposable preview and promotion semantics.

# Consequences

- Future implementation has a clear filesystem ownership model.
- Public docs can be generated from local command contracts while still using GitBook-friendly source files.
- Demo graphs can dogfood mdkg clone/import/subgraph workflows without changing the canonical site.
- More launch checks are required because three source surfaces must remain aligned.

# Links / references

- goal-24
- goal-25
- prd-4
- prd-5
- edd-24
- edd-26
- edd-27
- archive://archive.mdkg-dev-planning-docs-2026-06-22
