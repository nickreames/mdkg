---
id: prd-1
type: prd
title: AI-native SDLC presentation and live demo program requirements
tags: [presentation, live-demo, ai-native-sdlc, mdkg, requirements]
owners: [program-orchestrator]
links: [https://mdkg.dev/, https://docs.mdkg.dev/, https://github.com/nickreames/mdkg/issues]
artifacts: [deck/ai-native-sdlc.pptx, artifact://ai-native-sdlc-demo/demo-002, artifact://ai-native-sdlc-demo/demo-003]
relates: []
refs: [edd-1, dec-1, dec-2, dec-3, dec-4, dec-5, dec-6]
aliases: [ai-native-sdlc-program-requirements]
created: 2026-07-26
updated: 2026-07-26
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
- Produce a production-proven Demo 2 fallback and a fresh live Demo 3.
- Preserve public-alpha, pre-v1 honesty and invite concrete feedback.

# Non-goals

- Do not teach loops, subgraph mechanics, or graph-fork internals in the talk.
- Do not claim autonomy, benchmarks, provider behavior, or production proof without primary evidence.
- Do not make Remotion, animation, canonical-site adoption, or publication a presentation prerequisite.
- Do not allow a demo to redefine canonical mdkg.dev copy without a later adoption decision.
- Do not store credentials, raw prompts, private provider payloads, or private repository context.

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
- Demo 3 is a fresh specialized event run.
- The Demo 3 child goal uses this exact chain: positioning spike -> implementation task -> local test -> integration task -> canonical-site test -> publish task -> exact-SHA/live-URL test -> accepted checkpoint.
- Detail routes are /demo/2/ and /demo/3/; output routes are /demo/2/output/ and /demo/3/output/.
- Detail pages show sanitized source goal, specialized goal, work, and evidence.
- Outputs remain noindex and unlisted until Goal 8 decides otherwise.
- The reusable source stays conservative; publication authority exists only in specialized publication goals.
- Child run graphs remain owned artifacts and are not root-registered.

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
- Shared-source and publication goals require an accepted base SHA, exact allowlist, and exclusive quiet window.
- Commit, push, provider observation, provider mutation, DNS, tags, analytics, and package publication are separate authority levels.
- Goal 7 alone may authorize bounded allowlisted event commits and a non-force push after activation.
- The live sendoff must require the agent to continue through achieved child state, approved non-force push, both exact-SHA READY deployments, and verified public routes; a local build or commit is not completion.

# Acceptance Criteria

- One nested agent-ready graph contains Goals 1–8 with dedicated epics and deterministic actionable chains.
- Goal 1 closes the mdkg-only authoring pass; Goals 2–8 remain paused.
- No loop node exists.
- A private root projection can expose the program without making its run graphs writable projections.
- Presentation, rehearsal, fallback, live execution, and post-demo adoption have distinct completion conditions.
- Every external side effect has an explicit owner, gate, evidence requirement, and forbidden surface.

# Metrics / Success

- Presentation finishes by 35 minutes and every factual claim has primary-source coverage.
- Demo 2 has immutable exact-SHA production and recovery evidence.
- Demo 3 either passes exact-SHA/live gates or records a truthful hard blocker while Demo 2 is shown.
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
