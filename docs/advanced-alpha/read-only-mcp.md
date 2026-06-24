---
title: Read-only MCP
description: Expose mdkg graph context to MCP clients without enabling broad mutation.
---

mdkg includes a read-only local MCP server for tools that can speak MCP.

Use it when an orchestrator, editor, or agent runtime needs structured access to repository memory without shelling out for every read.

```bash
mdkg mcp serve --stdio --root /path/to/repo
```

The current public-alpha boundary is read-only. Tools expose status, workspace list, search, show, pack, goal current, goal next, and validation-style operations. Mutation-shaped calls should fail closed.

## Good uses

- inspect the selected goal
- search graph nodes
- show a node by id or qid
- build bounded packs for a work item
- validate graph state
- let a higher-level orchestrator compare multiple mdkg graphs

## Not yet

- broad task mutation through MCP
- worker execution
- cross-repo writes
- secret storage
- hosted graph services

MCP clients should still respect mdkg ownership boundaries. A root orchestrator can read child graph context, but child repo mutations should happen in the owning repo after explicit approval.

## Validation

Before depending on MCP in a workflow:

```bash
mdkg status --json
mdkg validate --json
mdkg mcp serve --stdio --root .
```

Keep stdout as newline-delimited JSON-RPC responses. Diagnostics should go to stderr so clients can parse responses reliably.
