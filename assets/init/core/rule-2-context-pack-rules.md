---
id: rule-2
type: rule
title: Focused context packs
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

Retrieve bounded linked context without treating every stored document as
mandatory startup material.

# Scope

Packs are generated context, not new authority or canonical project evidence.

# Requirements

- Start with `mdkg pack <qid> --pack-profile concise --dry-run --stats`.
- Generate a pack only when needed for the accepted task.
- Inspect relevant node bodies and skills when summaries are insufficient.
- Use verbose core guidance only when the task actually needs that detail.
- Treat checkpoints as historical evidence and recheck mutable state.
- Review visibility before sharing; a local default pack may contain private context.
- Keep generated pack output separate from authored graph records.

# Validation

Check included nodes, scope, freshness and output destination. A pack does not
authorize execution, make imported content trusted, or prove external state.
