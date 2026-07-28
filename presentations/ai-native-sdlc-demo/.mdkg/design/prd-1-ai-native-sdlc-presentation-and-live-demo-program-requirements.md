---
id: prd-1
type: prd
title: AI-native SDLC presentation and live demo program requirements
tags: [presentation, live-demo, ai-native-sdlc, mdkg, requirements]
owners: [program-orchestrator]
links: [https://mdkg.dev/, https://docs.mdkg.dev/, https://github.com/nickreames/mdkg/issues]
artifacts: [deck/ai-native-sdlc.pptx, artifact://ai-native-sdlc-demo/demo-002, artifact://ai-native-sdlc-demo/demo-003, artifact://ai-native-sdlc-demo/demo-004]
relates: []
refs: [edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6]
aliases: [ai-native-sdlc-program-requirements]
created: 2026-07-26
updated: 2026-07-27
---

# Problem

AI coding has progressed from inline completion to long-horizon goal-driven agents, but longer context and more capable harnesses do not by themselves preserve requirements, decisions, authority, evidence, or next-work state. The presentation must explain that gap to engineers and leaders without becoming an enterprise-governance or CLI feature tour.

# Goals

- Deliver a source-backed 30–32 minute presentation with a 35-minute hard stop.
- Start a bounded live coding run at the beginning and reveal its result and evidence near the end.
- Explain Autocomplete through GitHub Copilot; Prompt engineering through conversational generate/explain/refine workflows; Reasoning through OpenAI o1; Tool-using agents through Claude Code, Cursor, and comparable harnesses; Conditional context through Agent Skills and `SKILL.md`; and Long-horizon goal-driven agents through primary-source evidence for multi-hour, including 8+ hour, work.
- Position mdkg as Git-native context engineering through Plan -> Work -> Evidence.
- Show how durable state answers what completed, why it happened, and what comes next.
- Connect spec-driven design, explicit requirements, architecture decisions, guardrails, and test evidence to the AI-native SDLC.
- Produce a production-proven Demo 2 fallback, a measured 30-minute Demo 3
  dress rehearsal, and a fresh live Demo 4.
- Preserve public-alpha, pre-v1 honesty and invite concrete feedback.

# Non-goals

- Do not teach loops, subgraph mechanics, or graph-fork internals in the talk.
- Do not claim autonomy, benchmarks, provider behavior, or production proof without primary evidence.
- Do not make Remotion, animation, canonical-site adoption, or publication a presentation prerequisite.
- Do not allow a demo to redefine canonical mdkg.dev copy without a later adoption decision.
- Do not store credentials, raw prompts, private provider payloads, or private repository context.
- Do not present multi-harness parity, eight-hour execution, or general
  long-horizon autonomy as a live-demo success criterion. Those capabilities
  may appear only as source-backed presentation context.

# Requirements

## Presentation

- Working title: AI-Native Software Development: From Autocomplete to Durable Agentic SDLC.
- Target 30–32 minutes and stop by 35 minutes.
- Kick off the live goal immediately.
- Record source, date, supported claim, approved paraphrase, confidence, and slide usage for each factual claim.
- Explain mdkg through the creator's architecture-and-planning motivation, not enterprise governance alone.
- Position model capability, reasoning effort, tool harnesses, and context length as improving together while making clear that context engineering still matters.
- Close with: Try mdkg on one real project and send me feedback.
- Describe mdkg as public alpha and pre-v1 with active improvements underway; do not promise dates or unreleased behavior.
- Commit editable source, notes, citations, assets, final PPTX, and rendered QA evidence.

## Demo program

- Demo 2 is the full production rehearsal and immutable fallback.
- Demo 3 is a zero-manual-edit instance of an accepted, production-capable
  source release used to measure the complete live path before the event.
- Demo 4 is forked only after Demo 3 findings are accepted and is the fresh
  live-event identity.
- Demo 2 local preparation first reconciles the canonical smoke contract and
  creates bounded local commits under a dedicated integration-owner gate.
  It then requires separate explicit publication approval bound to the actual
  fetched commit/path range. Local candidate or commit authority does not imply
  push, deployment observation, or public verification authority.
- Goal 6 must use Demo 2 execution, prompt, route, and rehearsal evidence to
  promote reusable structure into a versioned fork-ready source release. It
  applies only explicitly accepted refinements, defines one immutable
  per-run binding schema, proves two clean zero-manual-edit fixture forks,
  creates Demo 3 as an exact authored-content fork, attaches its frozen
  binding and interface receipt, and seals a single-harness 30-minute
  rehearsal contract without executing the child.
- Goal 7 executes Demo 3 as a measured dress rehearsal. Its audience-equivalent
  reveal gate is due by T+29:30 and the global stop/fallback boundary is T+30.
- Goal 9 consumes Demo 3 evidence, distinguishes reusable source defects from
  run-specific creative choices, applies explicitly accepted final deck and
  source/sendoff polish, releases a new source identity when needed, and
  creates Demo 4 from that source without hand-editing the child graph.
- Goal 10 executes the fresh Demo 4 live event under a separately frozen
  authority receipt.
- The canonical source and both timed child goals use this exact generic
  chain: positioning spike ->
  implementation task -> local test -> integration task -> canonical-site
  test -> publish task -> exact-SHA/live-URL test -> accepted checkpoint.
- Detail routes are /demo/2/, /demo/3/, and /demo/4/; output routes are
  /demo/2/output/, /demo/3/output/, and /demo/4/output/.
- Detail pages show the sanitized reusable source goal, immutable run binding,
  selected positioning decision, executed goal state, work, and evidence.
- Outputs remain noindex and unlisted until Goal 8 decides otherwise.
- The reusable source contains the complete generic topology but grants no
  publication authority. Its publication node remains caller-gated and
  disabled until a separately accepted external authority is activated.
- Authored goal, design, and work-node content in Demo 3 and Demo 4 must match
  the accepted source release. Run identity and bounded positioning inputs
  live in an immutable run binding; selected creative direction is recorded
  as a child decision artifact; statuses, evidence, checkpoints, and outputs
  are normal child-owned execution state.
- Direct post-fork edits to authored child graph content are prohibited. A
  reusable defect is fixed in the source and the absent target is recreated;
  a run-specific input is changed in the binding and the absent target is
  recreated.
- Child run graphs remain owned artifacts and are not root-registered.
- Both timed runs use one designated coding harness and one implementation
  writer. Mirrored operator files prove portability only; no alternate-harness
  execution or equivalence claim is required.
- The timed path uses warm dependencies, one portable
  `DemoOutput.astro` plus a thin wrapper, one build-once local validation
  ladder, and a prepared fast production verifier. No dependency installation,
  web research, image generation, remote assets, or package changes belong to
  the timed window.

## Landing page

- Static Astro, zero generated client JavaScript, and no client directives.
- No third-party runtime scripts, remote fonts, analytics, forms, or trackers.
- Ocean Flow palette, semantic HTML, keyboard access, reduced motion, responsive reflow, and WCAG AA contrast.
- Maximum 500 KiB initial transfer and no raster above 250 KiB.
- Required story: promise, context problem, Plan -> Work -> Evidence, what/why/next, inspectable proof, quickstart, and feedback.
- The agent chooses composition, metaphor, order, typography, imagery, and bounded marketing copy.

## Authority

- Graph-only separation provides path ownership, not Git isolation.
- The program writer owns this directory; one integration owner owns root mdkg, bundles, Git, commits, and pushes.
- Shared-source and publication goals require an accepted base SHA, exact
  allowlist, and exclusive quiet window. Demo 2 commits precede its push-range
  approval so the human accepts actual SHAs and paths rather than planned work.
- Commit, push, provider observation, provider mutation, DNS, tags, analytics, and package publication are separate authority levels.
- Goals 7 and 10 alone may execute their separately frozen rehearsal/event
  authorities. Each consumes a human-accepted, hash-bound prospective
  range-validation policy created by its predecessor.
- A writable child may execute an activated external authority but may not
  author, broaden, or replace it. Human approval, leases, allowlists,
  published-baseline state, provider access, and validity windows remain
  outside the writable run; the child receives only hash-bound read-only
  references.
- Preparation surfaces must be published through a separately accepted
  baseline-publication handoff before presentation/rehearsal kickoff `P0` and
  timed sendoff `T0`. The orchestrator records immutable `T0` immediately
  before invoking the exact child dispatch from a clean, zero-ahead,
  zero-behind published baseline. `T0` must occur within 45 seconds of `P0`,
  and the designated child must acknowledge by `T0+00:45`.
- The pre-event authority binds the clean pre-publication origin, expected
  preparation tree/manifest hash, activation rule, and prospective event
  policy. After the separately authorized baseline push, the timed goal derives
  the actual published baseline SHA and writes a hash-bound authority-activation
  receipt before dispatch; no future SHA is invented.
- Each timed authority pre-authorizes allowlisted edits, build-once validation,
  at most two pre-publication repairs, at most one production fix-forward,
  normal non-force `origin/main` push, read-only provider inspection, and
  live-route verification. Actual commit/range hashes are computed and proven
  against the prospective policy immediately before push; nonexistent future
  hashes are never pre-approved.
- Demo 2 publication approval is not reusable as Demo 3 or Demo 4 authority,
  and Demo 3 authority is not reusable for Demo 4.
- The live sendoff must require the agent to continue through achieved child state, approved non-force push, both exact-SHA READY deployments, and verified public routes; a local build or commit is not completion.
- The immutable timed contract uses the recorded sendoff invocation as `T0`:
  child acknowledgement by T+00:45, positioning by T+02, implementation by
  T+13, local critical validation by T+16, mechanical canonical integration
  by T+20, range proof and push by T+22, no new production repair after T+24,
  both exact-SHA deployments READY by T+26, routes and child checkpoint by
  T+28:30, consolidated reveal receipt by T+29:15, verified Demo 3/Demo 2
  selection by T+29:30, and stop/select Demo 2 at T+30.

# Acceptance Criteria

- One nested agent-ready graph contains Goals 1–10 with dedicated epics and
  deterministic actionable chains.
- Goal 1 closes the mdkg-only authoring pass; successor goals remain paused
  until their explicit activation gates.
- No loop node exists.
- A private root projection can expose the program without making its run graphs writable projections.
- Presentation, rehearsal, fallback, live execution, and post-demo adoption have distinct completion conditions.
- Every external side effect has an explicit owner, gate, evidence requirement, and forbidden surface.
- A semantic source-release manifest, run-binding hash, bootstrap receipt, and
  immutable child-contract seal make source-to-run lineage independently
  verifiable without hashing transient indexes, events, packs, or runtime
  state as authored identity.

# Metrics / Success

- Presentation finishes by 35 minutes and every factual claim has primary-source coverage.
- Demo 2 has immutable exact-SHA production and recovery evidence.
- Demo 3 records measured stage timing and either passes its T+29:30
  rehearsal gate or records a truthful blocker while Demo 2 is shown.
- Demo 4 either passes its exact-SHA/live reveal gate within the same global
  deadline or records a truthful live-event blocker while Demo 2 is shown.
- Audience can explain Plan -> Work -> Evidence and what/why/next.
- Feedback reaches the quickstart and GitHub issues without overstating maturity.

# Risks

- Concurrent root writers: reserve explicit integration windows.
- Live failure: preserve Demo 2 and enforce fail-closed reveal rules.
- Unsupported claims: block slides and public copy.
- Scope expansion: keep Remotion and canonical adoption in successor goals.
- Generic output: require positioning before implementation.
- Hidden JavaScript or bloat: enforce build-output tests and budgets.

# Open Questions

None for authoring. Later creative and adoption choices belong to their scoped spikes and decisions.
