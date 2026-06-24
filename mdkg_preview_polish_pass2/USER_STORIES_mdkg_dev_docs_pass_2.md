# User Stories: mdkg.dev + docs.mdkg.dev Preview Polish Pass 2

This backlog is grouped by priority. Each story includes target URLs/sections, description, acceptance criteria, and copy or implementation guidance.


# P0 Stories

# P0-001: Fix collapsed command and terminal blocks on mdkg.dev

**Priority:** P0

## URL / Section To Update

- https://mdkg-dev.vercel.app/
- https://mdkg-dev.vercel.app/quickstart/

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The marketing site currently collapses multi-line CLI examples into one dense line. This is trust-breaking for a CLI product because first-time users must be able to visually inspect and copy commands precisely.

## Acceptance Criteria

- [ ] All terminal/code blocks preserve line breaks, indentation, and prompt formatting.
- [ ] Setup commands and operating-loop commands are split into separate blocks.
- [ ] Copyable blocks either omit `$` prompts or copy logic strips prompts safely.
- [ ] Mobile code blocks remain readable without breaking layout; horizontal scroll is acceptable for long commands but not for normal setup blocks.
- [ ] At least the homepage and quickstart page are manually checked in desktop and mobile viewport widths.

## Copy / Implementation Guidance

Prefer separate blocks for setup and operating loop:

```bash
npm install -g mdkg
mdkg init --agent
mdkg index
mdkg status
mdkg validate
```

```bash
mdkg goal current
mdkg goal next
mdkg pack WORK_ID
mdkg task done WORK_ID --checkpoint "Meaningful milestone"
mdkg validate
```

## Notes

This should be the first fix before any marketing copy polish.

---

# P0-002: Fix llms.txt formatting and content

**Priority:** P0

## URL / Section To Update

- https://mdkg-dev.vercel.app/llms.txt

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The current llms.txt output should preserve clear Markdown-like newlines and sections so humans and AI agents can parse it easily.

## Acceptance Criteria

- [ ] `/llms.txt` renders as `text/plain` or otherwise preserves newlines exactly.
- [ ] It includes a concise product definition, core promise, safety boundaries, and start commands.
- [ ] It links to mdkg.dev, docs.mdkg.dev, GitHub, npm, quickstart, trust, and alpha pages where URLs are known.
- [ ] It tells agents to prefer `mdkg pack WORK_ID` over ad hoc file lists when building work context.
- [ ] It does not include internal preview/scaffold commentary.

## Copy / Implementation Guidance

Use the llms.txt draft in `COPY_UPDATES_mdkg_dev_pass_2.md` as a starting point.

## Notes

Add `/llms-full.txt` later only if useful; do not block v0 on it.

---

# P0-003: Remove logo treatment and use simple mdkg wordmark

**Priority:** P0

## URL / Section To Update

- https://mdkg-dev.vercel.app/
- Header / nav

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The current public branding should not spend energy on a logo. For this stage, a simple `mdkg` wordmark is more credible and OSS-native.

## Acceptance Criteria

- [ ] Header brand uses text `mdkg` only, optionally with small subtitle `Markdown Knowledge Graph` if space allows.
- [ ] No standalone logo/icon is required in header or hero.
- [ ] Brand treatment feels like a serious OSS CLI/devtool rather than a SaaS marketing brand.
- [ ] Footer may use `mdkg` text only.

## Copy / Implementation Guidance

Header brand: `mdkg`

## Notes

Keep visual identity in color, typography, code blocks, and product clarity rather than an icon.

---

# P0-004: Simplify header navigation and open external links in new tabs

**Priority:** P0

## URL / Section To Update

- https://mdkg-dev.vercel.app/
- Header / nav / CTA links

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The top nav should be more concise and should distinguish internal anchors/routes from external destinations.

## Acceptance Criteria

- [ ] Recommended nav is `Quickstart`, `Docs ↗`, `GitHub ↗`, `npm ↗`.
- [ ] `Docs`, `GitHub`, and `npm` open in a new tab with `target="_blank"` and `rel="noopener noreferrer"` when external.
- [ ] `Alpha` is removed from primary nav and moved to footer/trust/hero note.
- [ ] Header is compact on mobile and does not wrap awkwardly.
- [ ] Primary CTA in hero remains focused on getting started or GitHub.

## Copy / Implementation Guidance

Header: `mdkg | Quickstart | Docs ↗ | GitHub ↗ | npm ↗`

## Notes

If docs production domain is not configured, link to the current docs preview during preview builds but keep production copy domain-oriented.

---

# P0-005: Replace mdkg.dev /docs meta page with redirect or clean docs bridge

**Priority:** P0

## URL / Section To Update

- https://mdkg-dev.vercel.app/docs/

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The current `/docs` route explains implementation details about the docs site and preview setup. Public users should not see meta commentary. The route should redirect to the docs host or show a minimal product-facing bridge.

## Acceptance Criteria

- [ ] Production `/docs` redirects to `https://docs.mdkg.dev` when ready.
- [ ] Preview `/docs` redirects to the preview docs URL or shows a minimal bridge with no Starlight/GitBook/meta commentary.
- [ ] No public copy explains that docs are a renderer, preview, future canonical host, or scaffold.
- [ ] Header Docs link points to the docs host directly where practical.

## Copy / Implementation Guidance

Minimal fallback bridge: `Markdown Knowledge Graph documentation is hosted at docs.mdkg.dev. Use the docs to install mdkg, learn the Plan → Work → Evidence loop, and give agents deterministic project context.`

## Notes

Keep repo-first docs ownership decisions in internal docs, not public route copy.

---

# P0-006: Remove public scaffold, preview, and implementation-meta commentary

**Priority:** P0

## URL / Section To Update

- https://mdkg-dev.vercel.app/
- https://mdkg-dev.vercel.app/docs/
- https://mdkg-docs.vercel.app/
- All docs pages

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The public sites should not sound like launch scaffolding. They should act as live product and documentation surfaces even when deployed to preview URLs.

## Acceptance Criteria

- [ ] Remove phrases like `future canonical`, `Starlight site`, `renderer`, `preview bridge`, `entry point until generator is added`, and `may summarize` from public-facing copy.
- [ ] Replace internal launch commentary with product/user-facing guidance.
- [ ] Public alpha caveats remain, but they describe mdkg product maturity rather than website implementation status.
- [ ] Internal launch planning content is moved to repo docs or hidden/noindex pages.

## Copy / Implementation Guidance

Replace meta copy with direct copy such as: `These docs teach the core mdkg workflow: initialize project memory, model work, build packs, create handoffs, record evidence, and validate before closeout.`

## Notes

This is a site-wide copy pass.

---

# P0-007: Hide Claims Evidence Matrix from public docs navigation

**Priority:** P0

## URL / Section To Update

- https://mdkg-docs.vercel.app/project/claims-evidence-matrix/
- Docs navigation

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The claims evidence matrix is useful internally, but it currently reads like governance/planning material. It should not be part of public docs navigation for v0.

## Acceptance Criteria

- [ ] Claims Evidence Matrix is removed from public docs nav.
- [ ] If retained as a route, it is noindexed or clearly internal-only.
- [ ] Public trust claims are handled through the Trust/Safety page instead.
- [ ] Homepage copy remains backed by the internal claims matrix but does not expose the matrix to normal users.

## Copy / Implementation Guidance

No public replacement required. Use `/trust` and docs Safety pages as the public-facing trust surface.

## Notes

A polished claims page can be considered later if there is a reason to make it public.

---

# P0-008: Remove public Starlight/GitBook implementation mentions from docs

**Priority:** P0

## URL / Section To Update

- https://mdkg-docs.vercel.app/
- https://mdkg-docs.vercel.app/reference/generated-cli-reference/
- Docs pages

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

Docs should teach mdkg, not document how the docs are generated/rendered. Public implementation details about Starlight/GitBook should be removed from user-facing docs.

## Acceptance Criteria

- [ ] No public docs page explains that Starlight is the docs renderer unless unavoidable in framework footer.
- [ ] Generated CLI reference page gives useful command guidance instead of explaining future generator work.
- [ ] Docs home reads as a live docs home, not a migration note.
- [ ] Internal docs generation policy remains in repo/internal docs only.

## Copy / Implementation Guidance

Generated reference fallback: `CLI reference is expanding during public alpha. Start with the core commands below. For complete live behavior, run mdkg --help and command-specific help in your installed version.`

## Notes

This overlaps with P0-006 but is docs-specific.

---

# P0-009: Define preview noindex and canonical policy

**Priority:** P0

## URL / Section To Update

- mdkg-dev preview deployment
- mdkg-docs preview deployment
- SEO metadata

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

Preview deployments should not compete with future canonical domains. Define and implement the safest practical noindex/canonical behavior for Vercel preview URLs.

## Acceptance Criteria

- [ ] Production URLs use canonical `https://mdkg.dev` and `https://docs.mdkg.dev` when ready.
- [ ] Preview URLs are noindexed if feasible without blocking manual review.
- [ ] Robots/meta behavior is documented.
- [ ] Sitemap includes only intended public routes for the current deployment context.
- [ ] Demo/preview routes are excluded from sitemap unless explicitly promoted.

## Copy / Implementation Guidance

Internal policy only; no public copy required.

## Notes

If preview noindex conflicts with manual review, document the tradeoff and defer implementation until production setup.

---


# P1 Stories

# P1-010: Replace “golden loop” with “Plan → Work → Evidence”

**Priority:** P1

## URL / Section To Update

- https://mdkg-dev.vercel.app/
- https://mdkg-dev.vercel.app/quickstart/
- https://mdkg-docs.vercel.app/start-here/quickstart/

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The external operating model should be `Plan → Work → Evidence`, not `golden loop`. This better captures goals, work node types, checkpoints, evidence refs, and validation.

## Acceptance Criteria

- [ ] Homepage section uses `Plan → Work → Evidence` as the main workflow model.
- [ ] Quickstart distinguishes setup commands from the operating loop.
- [ ] Docs explain that goals route work, work nodes represent SDLC units, checkpoints/evidence close the loop, and validation catches broken state.
- [ ] `golden loop` is removed or retained only as internal language.

## Copy / Implementation Guidance

`Plan the goal. Execute one work node. Record evidence. Validate before moving on.`

## Notes

This is a core messaging correction.

---

# P1-011: Separate first-run setup from operating loop

**Priority:** P1

## URL / Section To Update

- https://mdkg-dev.vercel.app/
- https://mdkg-dev.vercel.app/quickstart/
- https://mdkg-docs.vercel.app/start-here/quickstart/

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The user needs to understand that `init/index/status/validate` proves the local memory layer works, while `goal/pack/task/checkpoint/validate` is the ongoing agent workflow.

## Acceptance Criteria

- [ ] Homepage has separate sections or clearly separated code blocks for `First-run setup` and `Operating loop`.
- [ ] Quickstart docs narrate the difference between setup and ongoing work.
- [ ] Agents are instructed to use `goal current`, `goal next`, `pack`, `task done --checkpoint`, and `validate` for work.
- [ ] No single command block mixes install/setup and operating-loop commands into one ambiguous flow.

## Copy / Implementation Guidance

Section headings: `First, prove the repo memory layer works.` and `Then run the Plan → Work → Evidence loop.`

## Notes

This improves onboarding clarity.

---

# P1-012: Sharpen hero around AI coding agents and project memory

**Priority:** P1

## URL / Section To Update

- https://mdkg-dev.vercel.app/
- Homepage hero

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The hero should be concrete for the immediate launch audience. `AI-native software engineering` remains the umbrella, but `AI coding agents` should appear prominently.

## Acceptance Criteria

- [ ] Hero headline or subheadline explicitly mentions AI coding agents.
- [ ] Hero explains project memory, structured Markdown, Git, and deterministic packs/handoffs in plain language.
- [ ] Hero includes `local-first`, `low-dependency`, and `no hosted index` as concise trust signals.
- [ ] Hero avoids hype and does not overpromise autonomous execution.

## Copy / Implementation Guidance

Recommended hero: `Git-native project memory for AI coding agents.`

Subheadline: `Markdown Knowledge Graph turns structured Markdown in your repo into a Plan → Work → Evidence loop that humans and agents can inspect, pack, hand off, and validate.`

Support line: `Local-first. Low-dependency. No daemon, hosted index, vector database requirement, or hidden cloud state.`

## Notes

If you prefer the current headline, keep it but include AI coding agents in the subheadline.

---

# P1-013: Add homepage section for work node types and SDLC model

**Priority:** P1

## URL / Section To Update

- https://mdkg-dev.vercel.app/
- Homepage

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

Visitors need to understand that mdkg borrows familiar SDLC/agile shapes and embeds them as Markdown graph nodes.

## Acceptance Criteria

- [ ] Homepage includes a concise `Built around familiar SDLC shapes` section.
- [ ] Section names key node types: goals, epics, features, tasks, bugs, tests, spikes, checkpoints.
- [ ] Section explains that checkpoints/evidence record proof before closeout.
- [ ] Section links to the Work Node Types docs page.

## Copy / Implementation Guidance

`mdkg models software work with familiar SDLC shapes: goals route long-running objectives; epics and features group deliverables; tasks, bugs, tests, and spikes define concrete work; checkpoints record evidence before closeout.`

## Notes

This is key to making the product feel less abstract.

---

# P1-014: Add low-dependency/local-first security posture section

**Priority:** P1

## URL / Section To Update

- https://mdkg-dev.vercel.app/
- https://mdkg-docs.vercel.app/start-here/install/
- https://mdkg-docs.vercel.app/concepts/

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The site should emphasize that low dependency is part of mdkg’s security philosophy, especially for an npm CLI in a supply-chain-risk environment.

## Acceptance Criteria

- [ ] Homepage includes a concise low-dependency trust card/section.
- [ ] Docs include a concept page or install-page subsection on local-first and low-dependency posture.
- [ ] Copy explains TypeScript + modern Node, Markdown/Git authority, local generated artifacts, and optional node:sqlite-powered infrastructure.
- [ ] Copy avoids claiming zero dependencies unless true.
- [ ] Copy clarifies SQLite is local infrastructure where useful, not hidden authority.

## Copy / Implementation Guidance

`mdkg is intentionally boring infrastructure: TypeScript, modern Node, Markdown, Git, and local generated artifacts. SQLite is used where useful for local cache and advanced project DB workflows, but Markdown remains canonical.`

## Notes

Be precise with dependency claims by checking package reality.

---

# P1-015: Compress Advanced Alpha homepage section

**Priority:** P1

## URL / Section To Update

- https://mdkg-dev.vercel.app/
- Homepage Advanced Alpha section

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

Advanced alpha capabilities matter, but they should not distract from the first-run project-memory loop.

## Acceptance Criteria

- [ ] Homepage advanced alpha section is shortened to one concise paragraph plus optional compact cards.
- [ ] Advanced features are described as optional for larger workflows.
- [ ] Subgraphs, bundles, read-only MCP, archives, graph movement, workflow mirrors, and optional local queues are mentioned but not deeply explained.
- [ ] Section links to docs for advanced users.

## Copy / Implementation Guidance

`Advanced alpha surfaces exist for larger workflows: read-only MCP, subgraphs, bundles, archives, graph movement, workflow mirrors, and optional local queues. They are documented for early adopters; the first-run path does not depend on them.`

## Notes

Do not remove advanced docs; just lower homepage visibility.

---

# P1-016: Rewrite docs home as a real user-facing documentation home

**Priority:** P1

## URL / Section To Update

- https://mdkg-docs.vercel.app/

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

Docs home should teach users how to use mdkg, not discuss the documentation host or migration state.

## Acceptance Criteria

- [ ] Docs home opens with a clear definition of Markdown Knowledge Graph.
- [ ] It explains what the docs teach: install, initialize, model work, build packs, create handoffs, record evidence, validate.
- [ ] It provides a `Start here` path with 4-6 steps.
- [ ] It includes quick links to Install, Quickstart, Plan → Work → Evidence, Work Node Types, Trust/Safety, and CLI reference.
- [ ] It removes `future canonical host`, `Starlight`, `preview`, and docs-migration commentary.

## Copy / Implementation Guidance

Use the docs-home draft in `COPY_UPDATES_mdkg_dev_pass_2.md`.

## Notes

This should be one of the first docs copy rewrites.

---

# P1-017: Add Work Node Types concept page

**Priority:** P1

## URL / Section To Update

- https://mdkg-docs.vercel.app/concepts/
- New docs page

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The docs need a first-class explanation of work node types and how mdkg maps familiar SDLC/agile concepts into Markdown graph nodes.

## Acceptance Criteria

- [ ] New page exists under Concepts, likely `/concepts/work-node-types/`.
- [ ] Page defines goal, epic, feat, task, bug, test, spike, checkpoint, dec, prd, edd, and rule at appropriate depth.
- [ ] Page explains task-like lifecycle for feat/task/bug/test/spike if accurate.
- [ ] Page explains how checkpoints become evidence.
- [ ] Page includes a simple hierarchy diagram or text tree.
- [ ] Page includes at least one example of how an agent would use a work node.

## Copy / Implementation Guidance

See `DOCS_IA_AND_CONTENT_REWRITE_PLAN.md` for outline.

## Notes

This is more important than expanding advanced queue/subgraph docs right now.

---

# P1-018: Add Local-first and Low-dependency concept page

**Priority:** P1

## URL / Section To Update

- https://mdkg-docs.vercel.app/concepts/
- New docs page

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

Create a docs page that explains mdkg’s security philosophy: local-first, low-dependency, Markdown/Git authority, rebuildable caches, optional project DB state, and supply-chain posture.

## Acceptance Criteria

- [ ] New page exists under Concepts, likely `/concepts/local-first-low-dependency/`.
- [ ] Page explains what lives in Markdown, what is generated, what is optional, and what should not contain secrets.
- [ ] Page distinguishes `.mdkg/index` from `.mdkg/db`.
- [ ] Page explains modern Node and node:sqlite usage where applicable.
- [ ] Page avoids overclaiming dependency minimalism; it says low-dependency by design, not dependency-free unless true.

## Copy / Implementation Guidance

`Low dependency is part of mdkg’s security philosophy. The durable memory layer is Markdown in Git; generated caches are rebuildable; optional project DB state is local and advanced.`

## Notes

Link this from Install, Trust/Safety, and homepage.

---

# P1-019: Improve Install page around Node, package managers, and supply-chain posture

**Priority:** P1

## URL / Section To Update

- https://mdkg-docs.vercel.app/start-here/install/

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The install page is already one of the better pages. It should be upgraded with low-dependency/security rationale and package-manager clarity.

## Acceptance Criteria

- [ ] Node requirement is prominent and accurate.
- [ ] Supported install commands are verified for npm, pnpm, bun, and any npx/dlx/bunx path before inclusion.
- [ ] Page explains why modern Node is required if appropriate.
- [ ] Page mentions supply-chain hygiene: do not put package-manager tokens/credentials in mdkg graph nodes.
- [ ] Page links to Local-first and Low-dependency concept page.

## Copy / Implementation Guidance

`mdkg is designed to stay boring: modern Node, TypeScript, Markdown in Git, and local generated artifacts. Install it like a normal CLI, then keep secrets and package-manager credentials out of graph nodes.`

## Notes

Verify commands before documenting.

---

# P1-020: Improve Quickstart narrative and example work flow

**Priority:** P1

## URL / Section To Update

- https://mdkg-dev.vercel.app/quickstart/
- https://mdkg-docs.vercel.app/start-here/quickstart/

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

Quickstart should tell a short story: initialize memory, create or select work, pack context, do work, record evidence, validate.

## Acceptance Criteria

- [ ] Quickstart distinguishes `first-run setup` from `Plan → Work → Evidence`.
- [ ] It includes an example path for when no goal/work exists yet.
- [ ] It includes a path for working from an existing goal/work node.
- [ ] It shows what to give an agent, especially `mdkg pack WORK_ID` and/or `mdkg handoff create WORK_ID`.
- [ ] It avoids commands that are not verified.

## Copy / Implementation Guidance

Include commands only if verified:

```bash
mdkg new goal "Ship the first docs pass"
mdkg goal activate goal-1
mdkg new task "Fix quickstart copy" --goal goal-1
mdkg goal next
mdkg pack task-1
```

## Notes

If `--goal` flag or IDs differ, adapt to actual CLI behavior.

---

# P1-021: Tune Starlight right-hand table of contents behavior

**Priority:** P1

## URL / Section To Update

- https://mdkg-docs.vercel.app/
- All docs pages with `On this page → Overview`

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The current right-hand TOC often shows `On this page → Overview`, which feels noisy and scaffold-like. Tune the docs theme or add meaningful sections.

## Acceptance Criteria

- [ ] Short pages hide the right-hand TOC if it has no useful entries.
- [ ] Long pages have meaningful H2/H3 sections that make the TOC useful.
- [ ] Duplicate or awkward `On this page` text is removed where configurable.
- [ ] Docs pages no longer look like scaffolded placeholder content.

## Copy / Implementation Guidance

No copy requirement; this is docs UX configuration/content structure.

## Notes

If theme config cannot hide per-page TOC easily, add meaningful headings on core pages and defer minor pages.

---

# P1-022: Improve Repository Layout documentation rendering and clarity

**Priority:** P1

## URL / Section To Update

- https://mdkg-docs.vercel.app/concepts/repository-layout/

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The repository layout page is important because it explains what is source, cache, generated, optional, and committed. It should render clearly and be easy to scan.

## Acceptance Criteria

- [ ] Repository layout table renders cleanly in Starlight.
- [ ] Each path has clear purpose and commit/rebuild guidance.
- [ ] Page distinguishes `.mdkg/index` from `.mdkg/db` clearly.
- [ ] Page explains skill mirrors `.agents/skills` and `.claude/skills` without overclaiming future configurability.
- [ ] Page links to Local-first/Low-dependency and Trust/Safety pages.

## Copy / Implementation Guidance

Add a summary: `Markdown files, templates, archive sidecars, bundle manifests, and config are durable source. Generated indexes are rebuildable. Optional runtime DB files are advanced local state.`

## Notes

Consider using definition lists or cards if the Markdown table is cramped.

---

# P1-023: Replace generated CLI reference placeholder with useful minimal reference

**Priority:** P1

## URL / Section To Update

- https://mdkg-docs.vercel.app/reference/generated-cli-reference/
- https://mdkg-docs.vercel.app/reference/

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

Until the generated reference is fully integrated, the page should be useful rather than meta. Provide a concise core command reference.

## Acceptance Criteria

- [ ] Generated CLI Reference page no longer says it is merely an entry point until generation exists.
- [ ] Page lists core launch commands with one-line descriptions.
- [ ] Page points users to `mdkg --help` and command-specific help for complete live behavior.
- [ ] Advanced commands are grouped separately and marked advanced alpha.
- [ ] Page avoids stale metadata or version mismatch.

## Copy / Implementation Guidance

`CLI reference is expanding during public alpha. Start with the core commands below. For complete live behavior, run mdkg --help and command-specific help in your installed version.`

## Notes

Generated docs can replace this later.

---

# P1-024: Rewrite public roadmap as product roadmap, not deployment checklist

**Priority:** P1

## URL / Section To Update

- https://mdkg-docs.vercel.app/project/roadmap/

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The public roadmap should tell users what product/docs capabilities are coming, not list DNS cutover or analytics tasks.

## Acceptance Criteria

- [ ] Public roadmap removes deployment/DNS/analytics launch checklist items.
- [ ] Roadmap is grouped into `Now`, `Next`, and `Later` or equivalent.
- [ ] Roadmap emphasizes product themes: first-run UX, docs polish, work node docs, generated CLI reference, demo repo, configurable skill mirrors, handoff examples, subgraph/MCP guides, v1 contract hardening.
- [ ] Internal launch tasks move to internal docs or project tracker.

## Copy / Implementation Guidance

See `COPY_UPDATES_mdkg_dev_pass_2.md` for roadmap draft.

## Notes

Keep roadmap honest and lightweight.

---

# P1-025: Align Trust/Safety page with low-dependency and local-first posture

**Priority:** P1

## URL / Section To Update

- https://mdkg-dev.vercel.app/trust/
- docs Safety page

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The Trust page already has the right boundaries but should be tightened and tied to low-dependency/security philosophy.

## Acceptance Criteria

- [ ] Trust page clearly states local-first, no hosted index, no hosted runtime, no autonomous execution, no skill execution, and read-only MCP boundaries.
- [ ] Trust page explicitly says low-dependency is part of security philosophy.
- [ ] Trust page distinguishes Markdown source, generated index cache, and optional project DB state.
- [ ] It says raw-marker warnings are not full DLP/secret scanning.
- [ ] It links to docs concept pages for Local-first/Low-dependency and Repository Layout.

## Copy / Implementation Guidance

`Local-first and low-dependency are part of mdkg’s security posture. Project memory lives in Markdown and Git; generated indexes are rebuildable; optional SQLite-backed state stays local.`

## Notes

Avoid guaranteeing safety/security beyond actual behavior.

---

# P1-026: Tighten Alpha page into public-alpha contract

**Priority:** P1

## URL / Section To Update

- https://mdkg-dev.vercel.app/alpha/
- docs alpha page

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The alpha page should be honest but not discouraging. It should explain what is usable, what may change, and where users should start.

## Acceptance Criteria

- [ ] Page uses `Developer preview` and `pre-v1 public alpha` consistently.
- [ ] Page lists stable-enough core flows separately from advanced alpha surfaces.
- [ ] Page explains contracts that may change before v1.
- [ ] Page recommends trying mdkg on non-sensitive repos first.
- [ ] Page links to changelog, GitHub issues/discussions, quickstart, and trust.

## Copy / Implementation Guidance

`The core project-memory workflow is usable today. Advanced graph/cache/bundle/database contracts may change before v1. Start with a small repo, keep secrets out of graph nodes, and open an issue if the workflow breaks down.`

## Notes

Good alpha copy increases trust.

---


# P2 Stories

# P2-027: Add simple Plan → Work → Evidence diagram

**Priority:** P2

## URL / Section To Update

- https://mdkg-dev.vercel.app/
- Docs concepts pages

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

A simple diagram would make the operating model memorable and reduce text density.

## Acceptance Criteria

- [ ] Homepage includes a simple HTML/CSS or SVG diagram for Plan → Work → Evidence.
- [ ] Diagram is accessible, responsive, and not dependent on a heavy image/JS asset.
- [ ] Diagram maps Plan to goals/epics/decisions, Work to task/feat/bug/test/spike, Evidence to checkpoint/receipt/archive/validation.
- [ ] Diagram uses mdkg/Ocean Flow color DNA subtly.

## Copy / Implementation Guidance

Diagram labels: `Plan`, `Work`, `Evidence`, `Validate`.

## Notes

No image generation required; hand-authored diagram preferred.

---

# P2-028: Review SEO metadata and social cards

**Priority:** P2

## URL / Section To Update

- mdkg.dev pages
- docs.mdkg.dev pages

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

Ensure preview and future production pages have coherent titles, descriptions, canonical URLs, and social card metadata.

## Acceptance Criteria

- [ ] Homepage title includes `Markdown Knowledge Graph` and `git-native project memory` or equivalent.
- [ ] Quickstart, Trust, Alpha, and docs pages have unique descriptions.
- [ ] Open Graph and X/Twitter card metadata are present.
- [ ] Default OG image exists or is explicitly deferred.
- [ ] Preview canonical/noindex policy is respected.

## Copy / Implementation Guidance

Homepage meta description: `Markdown Knowledge Graph is git-native project memory for AI coding agents: structured Markdown, deterministic packs, handoffs, checkpoints, and validation without a hosted index.`

## Notes

Do not over-optimize; make metadata clean and accurate.

---

# P2-029: Run copy consistency pass across mdkg.dev, docs, README, and npm metadata

**Priority:** P2

## URL / Section To Update

- mdkg.dev
- docs.mdkg.dev
- README.md
- package/npm metadata

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

The same product should be described consistently across all public surfaces.

## Acceptance Criteria

- [ ] Top-level positioning is consistent: `git-native project memory for AI coding agents` or approved variant.
- [ ] `Markdown Knowledge Graph` and `mdkg` naming is consistent.
- [ ] Version metadata is consistent across package, README, docs, and site.
- [ ] Install commands match package reality.
- [ ] GitHub/npm descriptions are sharpened and aligned with site copy.

## Copy / Implementation Guidance

Preferred npm/GitHub description: `Git-native project memory for AI coding agents: structured Markdown, deterministic context packs, handoffs, checkpoints, and validation.`

## Notes

This prevents trust erosion.

---

# P2-030: Define lightweight Vercel analytics and CTA tracking plan

**Priority:** P2

## URL / Section To Update

- mdkg-dev Vercel deployment
- Analytics events

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

Measurement should be lightweight and privacy-aligned, but key CTA clicks should be visible after launch.

## Acceptance Criteria

- [ ] Decision documented: use Vercel Analytics if available on the deployment plan.
- [ ] Track or at least identify key CTA events: GitHub, npm, docs, quickstart, trust, copy install command.
- [ ] No invasive third-party tracking is introduced.
- [ ] Analytics status is not claimed publicly unless enabled.

## Copy / Implementation Guidance

No public copy required.

## Notes

Do not block launch on custom event tracking; basic analytics is enough for v0.

---

# P2-031: Refine docs navigation hierarchy and labels

**Priority:** P2

## URL / Section To Update

- https://mdkg-docs.vercel.app/
- Docs sidebar

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

Docs navigation should lead users through mdkg from setup to concepts to guides to reference, with advanced alpha visually secondary.

## Acceptance Criteria

- [ ] Top nav/sidebar starts with Start Here: Install, Quickstart.
- [ ] Concepts include Source of Truth, Local-first/Low-dependency, Repository Layout, Plan → Work → Evidence, Work Node Types, Reference Types, Glossary.
- [ ] Guides focus on practical workflows.
- [ ] Advanced Alpha remains present but secondary.
- [ ] Project/internal pages do not clutter main learning path.

## Copy / Implementation Guidance

Use `Reference Types: Scope, Context, Evidence` instead of vague `Work, Context, and Evidence` if adding `Plan → Work → Evidence` separately.

## Notes

Docs IA is more important than adding lots of new placeholder pages.

---

# P2-032: Normalize footer links and public utility links

**Priority:** P2

## URL / Section To Update

- mdkg.dev footer
- docs footer if configurable

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

Footer should include useful but lower-priority pages without cluttering the header.

## Acceptance Criteria

- [ ] Footer includes Trust, Alpha, llms.txt, GitHub, npm, Docs, and optionally ochatr.ai/personal site if appropriate.
- [ ] External links open in new tabs.
- [ ] Footer does not include internal planning docs.
- [ ] Footer copy reinforces public alpha and local-first posture succinctly.

## Copy / Implementation Guidance

Footer note: `Developer preview. Markdown stays in your repo. Advanced contracts may change before v1.`

## Notes

Footer is the right place for Alpha, not main nav.

---

# P2-033: Add supply-chain-safe install guidance callouts

**Priority:** P2

## URL / Section To Update

- Install docs
- Trust docs

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

Add small but explicit callouts about safe CLI installation and secrets hygiene.

## Acceptance Criteria

- [ ] Install docs remind users to verify package source and avoid storing package tokens in graph nodes.
- [ ] Trust docs explain mdkg warnings are not a secret scanner.
- [ ] Copy does not create fear; it presents boring hygiene.
- [ ] Package-manager-specific claims are accurate.

## Copy / Implementation Guidance

`Do not store npm tokens, provider credentials, private keys, raw prompts, or production payloads in mdkg graph nodes. mdkg can warn on obvious raw markers in some flows, but it is not a DLP system.`

## Notes

This aligns with local-first/low-dependency security philosophy.

---

# P2-034: Audit external link semantics and accessibility

**Priority:** P2

## URL / Section To Update

- mdkg.dev
- docs.mdkg.dev

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

External links and icons should be accessible and safe.

## Acceptance Criteria

- [ ] External links use `target=_blank` and `rel=noopener noreferrer` where applicable.
- [ ] External-link icons have accessible labels or are decorative.
- [ ] CTA buttons are keyboard accessible.
- [ ] Focus states are visible.
- [ ] Links do not rely on color alone.

## Copy / Implementation Guidance

Use visible `↗` in link text for external links where appropriate.

## Notes

This can be covered by QA/a11y pass.

---

# P2-035: Validate responsive design for content and code blocks

**Priority:** P2

## URL / Section To Update

- mdkg.dev
- docs.mdkg.dev

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

Both sites should work cleanly on mobile, where many conference visitors will open links.

## Acceptance Criteria

- [ ] Homepage hero, nav, code blocks, and cards work on common mobile widths.
- [ ] Docs sidebar/nav behaves correctly on mobile.
- [ ] Code blocks do not create page-level horizontal scrolling.
- [ ] Plan → Work → Evidence diagram remains legible or stacks cleanly.
- [ ] CTA buttons are tappable and do not crowd.

## Copy / Implementation Guidance

No copy requirement.

## Notes

Conference traffic will be phone-heavy.

---


# P3 Stories

# P3-036: Generate CLI reference from command contract

**Priority:** P3

## URL / Section To Update

- docs reference
- build scripts

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

Long-term, CLI docs should be generated from command metadata to avoid drift.

## Acceptance Criteria

- [ ] Generated reference plan exists.
- [ ] Generated pages can be built from command contract if available.
- [ ] Generated docs include command family, mutability, examples, output formats, and caveats.
- [ ] Manual fallback remains until generator is stable.

## Copy / Implementation Guidance

No public copy required beyond useful reference pages.

## Notes

Do not block current polish pass on full generator.

---

# P3-037: Add demo repo documentation

**Priority:** P3

## URL / Section To Update

- docs guides
- examples/demos

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

Future docs should show the golden demo repo and what users can run.

## Acceptance Criteria

- [ ] Demo repo/source location is documented.
- [ ] Demo includes one goal, one spike, one task, one checkpoint, one decision, one skill, and one handoff example if implemented.
- [ ] Docs show expected command flow.
- [ ] Demo preview URLs remain noindex unless promoted.

## Copy / Implementation Guidance

No immediate public copy required.

## Notes

This follows current polish pass.

---

# P3-038: Add read-only MCP guide

**Priority:** P3

## URL / Section To Update

- docs advanced alpha

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

Read-only MCP is a strong trust feature but should remain advanced until core docs are stronger.

## Acceptance Criteria

- [ ] Guide explains exact read-only tools exposed.
- [ ] Guide states MCP does not expose mutation, shell, SQL, arbitrary file reads, environment, or secret access.
- [ ] Guide includes setup command and safety caveats.
- [ ] Guide links to Trust/Safety.

## Copy / Implementation Guidance

`MCP is inspection-only in this release.`

## Notes

Add after Work Node Types and low-dependency pages.

---

# P3-039: Expand subgraphs, bundles, and graph movement docs

**Priority:** P3

## URL / Section To Update

- docs advanced alpha

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

Advanced orchestration features need docs eventually, but should not crowd launch path.

## Acceptance Criteria

- [ ] Subgraphs page explains read-only child graph orchestration and qids.
- [ ] Bundles page explains deterministic graph snapshots and visibility boundaries.
- [ ] Graph movement page explains clone/fork/import-template distinctions.
- [ ] All pages clearly mark advanced alpha status.

## Copy / Implementation Guidance

No immediate public copy required.

## Notes

Good post-launch docs work.

---

# P3-040: Create demo video and visual assets after copy stabilizes

**Priority:** P3

## URL / Section To Update

- mdkg.dev homepage
- docs guides
- social content

## User Story

As a developer, AI engineer, or AI coding-agent user evaluating Markdown Knowledge Graph, I want this surface to be clear, trustworthy, copy-pasteable, and free of internal scaffolding so that I can understand mdkg quickly and decide whether to try it or star the repo.

## Description

Video/visual assets are valuable, but copy and onboarding must stabilize first.

## Acceptance Criteria

- [ ] Plan → Work → Evidence visual model is finalized before video production.
- [ ] Short demo script exists.
- [ ] Video shows setup, pack, handoff, checkpoint, validate.
- [ ] Video does not imply autonomous execution.

## Copy / Implementation Guidance

No immediate public copy required.

## Notes

Future Remotion/screen recording work.

---
