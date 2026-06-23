# mdkg.dev Claims Evidence Matrix

This file keeps public copy source-backed. Claims should stay aligned with shipped CLI behavior, generated docs, and explicit alpha boundaries.

| Page | Claim | Evidence source | Shipped? | Caveat / Safe wording |
|---|---|---|---|---|
| Home | Git-native project memory for AI-native software engineering | README, AGENT_START, `.mdkg` graph model | yes | Explain as Markdown/frontmatter in Git, not hosted memory. |
| Home | Deterministic context packs | `mdkg pack`, generated command contract | yes | Packs are context artifacts, not execution. |
| Home | Goals, tasks, spikes, checkpoints, and handoffs | CLI command contract and templates | yes | Required checks are report-only guidance. |
| Trust | No daemon, hosted index, vector database, or hidden cloud state required | CLI architecture and local index behavior | yes | Local SQLite is infrastructure, not canonical graph memory. |
| Trust | Handoff warnings are safety aids | handoff command and warning UX | yes | Do not claim comprehensive secret scanning or DLP. |
| Alpha | Read-only MCP | MCP command contract | yes | Read-only inspection, not full mutation parity. |
| Alpha | Project DB queues are advanced local delivery state | `mdkg db queue contract --json` | yes | Not canonical runtime history or a hosted queue. |
| Docs | Generated CLI reference | `dist/command-contract.json`, `docs:generate` | yes | Generated reference may be split into richer pages later. |
| Examples | Demo graphs show the golden path | goal-25 plan | pending | Do not claim demos exist publicly until task-450 is done. |
| Launch | mdkg.dev is production live | none | no | Goal-25 proves local pre-release readiness only. |
