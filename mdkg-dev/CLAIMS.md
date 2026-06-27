# mdkg.dev Claims Evidence Matrix

This file keeps public copy source-backed. Claims should stay aligned with shipped CLI behavior, generated docs, and explicit alpha boundaries.

| Page | Claim | Evidence source | Shipped? | Caveat / Safe wording | Owner | Review status |
|---|---|---|---|---|---|---|
| Home | Git-native project memory for AI-native software engineering | README, AGENT_START, `.mdkg` graph model | yes | Explain as Markdown/frontmatter in Git, not hosted memory or an agent runtime. | mdkg maintainer | approved for public alpha |
| Home | Deterministic context packs | `mdkg pack`, generated command contract | yes | Packs are context artifacts, not execution or model output. | mdkg maintainer | approved for public alpha |
| Home | Goals, tasks, spikes, checkpoints, and handoffs | CLI command contract and templates | yes | Required checks are report-only guidance that users or agents must run. | mdkg maintainer | approved for public alpha |
| Home | `scope_refs`, `context_refs`, and `evidence_refs` separate execution from context and proof | validator/index behavior and 0.3.7 semantic refs | yes | Avoid implying every referenced node is actionable. | mdkg maintainer | approved for public alpha |
| Quickstart | First-run setup is install, init, index, status, validate, pack | README, AGENT_START, smoke tests | yes | Use placeholders like `WORK_ID`, not raw angle-bracket examples. | mdkg maintainer | approved for public alpha |
| Docs | Starlight is the docs renderer | `docs/` Astro/Starlight subproject and preview build | yes | `docs.mdkg.dev` is future canonical DNS; preview docs are hosted separately until DNS cutover. | mdkg.dev docs | approved for preview |
| Trust | Markdown remains authoritative | graph node files and cache/index design | yes | Local SQLite is support infrastructure, not canonical graph memory. | mdkg maintainer | approved for public alpha |
| Trust | No daemon, hosted index, vector database, or hidden cloud state required | CLI architecture and local index behavior | yes | Advanced workflows may use local generated state. | mdkg maintainer | approved for public alpha |
| Trust | mdkg does not execute work | command contract and work invocation boundary | yes | Worker execution, deployments, shell commands, provider calls, and model calls happen outside mdkg. | mdkg maintainer | approved for public alpha |
| Trust | Read-only MCP | MCP command contract | yes | Read-only inspection, not full mutation parity. | mdkg maintainer | approved for public alpha |
| Trust | Handoff warnings are safety aids | handoff command and warning UX | yes | Do not claim comprehensive secret scanning, DLP, or policy enforcement. | mdkg maintainer | approved for public alpha |
| Alpha | Project DB queues are advanced local delivery state | `mdkg db queue contract --json` | yes | Not canonical runtime history, hosted queue, or backend ledger. | mdkg maintainer | approved for public alpha |
| Alpha | Public alpha is usable today but pre-v1 | changelog, CLI command contract, goal-30 scope | yes | Encourage small pilot repos and upgrade dry-runs. | mdkg maintainer | approved for public alpha |
| Home | `0.4.0` launch-track copy and structured metadata describe the source release target, while npm availability and live production claims remain gated on postpublish and postdeploy evidence | `package.json`, npm registry, mdkg.dev JSON-LD smoke, goal-42 evidence | source-only until publish/deploy | Say the source target is `mdkg@0.4.0`; do not claim npm or live production availability until postpublish install validation and Vercel/Chrome live checks pass. | mdkg maintainer | approved for local validation |
| Examples | Demo graphs show the golden path | goal-25/goal-30 plan | pending | Do not claim public demos exist until demo graph work is complete and validated. | mdkg.dev docs | blocked from public claim |
| Launch | mdkg.dev is production live | none | no | Goal-30 targets validated previews, not DNS cutover, production promotion, analytics activation, or public launch. | mdkg.dev docs | blocked from public claim |
| Deferred | Hosted memory, hosted queues, arbitrary SQL, autonomous worker execution, broad MCP mutation parity | no shipped public contract | no | Mention only as explicit non-goals or deferred roadmap items. | mdkg maintainer | blocked from public claim |

## Blocked public claim phrases

Do not publish copy that implies:

- hosted memory or hosted queues are available
- mdkg executes workers, deploys code, or calls providers
- mdkg exposes arbitrary SQL
- mdkg is production-ready for every team
- mdkg provides comprehensive secret scanning, DLP, or policy enforcement
- mdkg has universal compatibility with every AI coding agent
