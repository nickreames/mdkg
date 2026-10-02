---
id: rule-4
type: rule
title: Repository ownership and portable state
tags: [mdkg, guidance]
owners: []
links: []
artifacts: []
relates: []
refs: []
aliases: []
created: 2026-09-09
updated: 2026-09-09
---

# Purpose

Preserve authored work and prevent local or private state from becoming shared
project memory by accident.

# Scope

Applies to graph files, generated output, archives and explicit exports.

# Requirements

- Re-inventory dirty paths and ownership before writes; preserve unknown work.
- Treat indexes and caches as derived data, never identity authority.
- Exclude live runtime databases, sidecars, locks and checkout-local execution
  state from portable knowledge; follow explicit policy for sealed snapshots.
- A sealed private artifact is not automatically safe for public disclosure.
- Store opaque external evidence references when full operational data belongs
  to a consumer-owned system; never embed credentials or live accounting state.
- Respect filesystem containment and stop on ambiguous symlinks or ownership.
- Do not automatically rebuild bundles, refresh subgraphs or clean preserved files.

# Validation

Review exact changed paths, destination and visibility. Validate exported
contents and evidence under the requested profile before sharing anything.
