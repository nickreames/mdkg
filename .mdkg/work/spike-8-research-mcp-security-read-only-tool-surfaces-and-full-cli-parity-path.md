---
id: spike-8
type: spike
title: research MCP security read-only tool surfaces and full CLI parity path
status: done
priority: 2
epic: epic-95
parent: goal-19
tags: [0.3.6, spike, mcp, security]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: [task-392, task-396]
refs: []
aliases: []
skills: []
created: 2026-06-16
updated: 2026-06-17
---
# Research Question

What local MCP surface gives orchestrators useful mdkg graph access now while preserving CLI-first single-writer ownership?

# Context And Constraints

- Phase one is read-only.
- Long-term path may include explicit lifecycle mutations, but broad CLI parity is future work.
- Manual node body editing remains LLM/agent responsibility.

# Search Plan

- Review MCP security and local-server patterns.
- Map mdkg CLI JSON outputs to read-only MCP tools.
- Identify future mutation allowlist boundaries and approval requirements.

# Findings

- The current MCP specification defines stdio as a standard transport where
  the client launches the server as a subprocess, JSON-RPC messages are
  newline-delimited, and the server must not write non-MCP content to stdout.
- Streamable HTTP is intentionally deferred. The spec requires Origin
  validation, localhost binding for local servers, and authentication
  considerations; those are unnecessary risk for the first local mdkg server.
- MCP tools are model-controlled and should be surfaced with trust and safety
  care. The first mdkg server should expose only read-only graph inspection
  tools and avoid broad mutation tools.
- Tool results should include structured content where useful. mdkg can return
  the same deterministic JSON-shaped records already used by CLI commands.
- Output must be bounded. Search and pack tools should expose limit controls
  and conservative defaults so an MCP client cannot accidentally pull the whole
  graph into one response.

# Options And Tradeoffs

- `mdkg mcp serve --stdio`: safest first step, works with local MCP clients,
  avoids HTTP auth/origin complexity, and keeps stdout reserved for JSON-RPC.
- HTTP MCP endpoint: useful later for long-running local services, but it needs
  explicit auth, origin checks, localhost binding, session handling, and a more
  complete threat model.
- Broad CLI parity over MCP: powerful, but it would bypass the current
  CLI-first single-writer operator model unless every mutation has an explicit
  approval and receipt boundary.
- Read-only plus future allowlist docs: enough for orchestrator inspection now
  while preserving a clear path to lifecycle writes later.

# Recommendation

- Implement `mdkg mcp serve --stdio` for `0.3.6`.
- Expose read-only tools for status, workspace/subgraph listing, search, show,
  pack, goal current, goal next, and validation summary.
- Require root selection through the existing `--root` mechanism and accept
  optional workspace hints in tool arguments rather than hidden workspace
  switching.
- Include subgraph nodes only through the existing read-only index projection;
  mutation of subgraph qids remains unavailable.
- Do not expose task, goal, workspace, graph import, queue, event, archive, or
  format mutation tools in the first MCP release.
- Document future mutation allowlists as a later design path, limited first to
  explicit lifecycle writes such as `task start/update/done` and
  `goal claim/pause/resume`, with operator approval and receipt evidence.

# Follow-Up Nodes To Create

- task-392
- task-393
- task-394
- task-396
- test-168
- test-169
- test-170

# Skill Candidates

- Future skill candidate: MCP server release-readiness validation for local
  stdio tools, no-mutation checks, and workspace/subgraph selection proof.

# Data Structures And Algorithms Notes

- Reuse the generated mdkg index and subgraph projection instead of adding a
  separate MCP index.
- Keep MCP search as bounded metadata search, matching the CLI search behavior
  rather than introducing new full-text semantics.
- Build MCP pack output through the existing pack graph traversal APIs, with a
  conservative default profile and node limit.

# UX Notes

- Public command shape should be `mdkg mcp serve --stdio`.
- Help text should explicitly say phase one is local, read-only, and does not
  execute work or mutate graph files.
- Tool names should be explicit and mdkg-prefixed, for example `mdkg_status`
  and `mdkg_search`, so clients do not confuse them with generic filesystem or
  shell tools.

# Security Notes

- No environment variables, npm tokens, raw filesystem reads, shell execution,
  arbitrary SQL, or graph mutation tools are exposed.
- Stdio avoids opening a network listener in phase one.
- The server must never write logs or diagnostics to stdout; stdout is reserved
  for JSON-RPC messages.
- Tool outputs intentionally expose mdkg graph content from the selected local
  root. Operators should treat that as local/private context unless they have
  reviewed visibility and pack policies.

# Evidence And Sources

- MCP specification 2025-06-18, Transports: stdio uses newline-delimited
  JSON-RPC over stdin/stdout and stdout must contain only MCP messages.
- MCP specification 2025-06-18, Tools: tools are model-controlled, clients
  should keep humans in the loop for sensitive operations, and servers should
  validate tool inputs, enforce access controls, and sanitize outputs.
- MCP specification 2025-06-18, Lifecycle: initialization negotiates protocol
  version, server capabilities, and implementation metadata before operation.
