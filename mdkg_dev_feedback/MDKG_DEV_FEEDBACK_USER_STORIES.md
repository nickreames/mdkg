# mdkg.dev + docs preview feedback user stories

Generated from a live crawl/review of the current Vercel preview surfaces and aligned to the prior mdkg.dev/product/docs/design/marketing strategy decisions.

## Review posture

The current preview is an impressive bootstrap: both the product landing page and Starlight docs are live, the core positioning is present, the docs navigation exists, public-alpha boundaries are visible, and the repo-first documentation model is already represented. The next pass should focus on turning planning scaffolds into public product copy, fixing first-run UX, adding launch-quality design/SEO/trust gates, and deepening the developer docs around the golden path.

## Highest-level recommendation

Ship a polished v0 around one promise:

> Markdown Knowledge Graph is git-native project memory for AI-native software engineering.

Everything else should support the first five minutes: understand the problem, install the CLI, initialize repo-local memory, build/index/validate, generate a pack or handoff, and star/provide feedback if useful.

## Crawl scope

- https://mdkg-dev.vercel.app/ — landing page
- https://mdkg-dev.vercel.app/quickstart/ — product-site quickstart
- https://mdkg-dev.vercel.app/trust/ — product-site trust boundaries
- https://mdkg-dev.vercel.app/alpha/ — product-site public alpha
- https://mdkg-dev.vercel.app/docs/ — product-site docs bridge
- https://mdkg-dev.vercel.app/llms.txt — agent-readable summary
- https://mdkg-docs.vercel.app/ — docs overview
- https://mdkg-docs.vercel.app/start-here/install/ — docs install
- https://mdkg-docs.vercel.app/start-here/quickstart/ — docs quickstart
- https://mdkg-docs.vercel.app/start-here/safety-boundaries/ — docs safety
- https://mdkg-docs.vercel.app/start-here/public-alpha-contract/ — docs alpha contract
- https://mdkg-docs.vercel.app/concepts/source-of-truth/ — source of truth concept
- https://mdkg-docs.vercel.app/concepts/repository-layout/ — repository layout concept
- https://mdkg-docs.vercel.app/concepts/work-context-evidence/ — semantic refs concept
- https://mdkg-docs.vercel.app/guides/agent-workflow/ — agent workflow guide
- https://mdkg-docs.vercel.app/guides/packs-and-handoffs/ — packs and handoffs guide
- https://mdkg-docs.vercel.app/advanced-alpha/overview/ — advanced alpha overview
- https://mdkg-docs.vercel.app/advanced-alpha/project-db-queues/ — project DB and queues
- https://mdkg-docs.vercel.app/reference/ — reference landing
- https://mdkg-docs.vercel.app/reference/command-contract/ — command contract reference
- https://mdkg-docs.vercel.app/reference/generated-cli-reference/ — generated reference placeholder
- https://mdkg-docs.vercel.app/project/changelog/ — changelog placeholder
- https://mdkg-docs.vercel.app/project/claims-evidence-matrix/ — claims evidence placeholder
- https://mdkg-docs.vercel.app/project/roadmap/ — roadmap placeholder

## Priority legend

- **P0**: Fix before sending real launch/article/conference traffic.
- **P1**: Strongly recommended for a polished public-alpha launch.
- **P2**: Valuable follow-up after the first polish pass; should not block v0 if time is tight.

## Story index

- **US-001 [P0]** — Fix broken command formatting in landing quickstart (First-run UX / DevEx)
- **US-002 [P0]** — Repair llms.txt placeholders and command examples (AI-agent-readable surface)
- **US-003 [P0]** — Remove internal planning language from public homepage (Marketing copy / Trust)
- **US-004 [P0]** — Move personal origin story out of the first public homepage pass (Brand / Positioning)
- **US-005 [P0]** — Rewrite semantic-ref cards to remove misleading “Evidence:” labels (Product clarity / Copy)
- **US-006 [P0]** — Clarify docs bridge behavior during preview vs production (Navigation / Docs integration)
- **US-007 [P0]** — Add a visible GitHub star CTA and OSS feedback CTA (Conversion)
- **US-008 [P0]** — Create a real claims evidence matrix, not just a pointer page (Trust / Claims QA)
- **US-009 [P0]** — Expand trust page from scaffold into user-facing trust/security posture (Trust / Safety)
- **US-010 [P0]** — Make production/preview indexing policy explicit (SEO / Deployment safety)
- **US-011 [P0]** — Add SEO metadata, social cards, and structured data baseline (SEO / Sharing)
- **US-012 [P0]** — Create or verify sitemap.xml and robots.txt for product and docs sites (Technical SEO)
- **US-013 [P0]** — Implement accessibility and performance quality gates (Quality / Launch readiness)
- **US-014 [P0]** — Implement DESIGN.md and apply restrained OSS visual system (Design system)
- **US-015 [P1]** — Add a product architecture diagram to the homepage hero or first-scroll section (Design / Product education)
- **US-016 [P1]** — Add a “Why not just bigger context windows?” homepage section (Marketing copy / Technical thesis)
- **US-017 [P1]** — Add “What you get in five minutes” conversion block (Conversion / DevEx)
- **US-018 [P1]** — Expand docs install page with multiple package-manager options and Node setup guidance (Docs / DevEx)
- **US-019 [P1]** — Turn docs quickstart into a complete golden-path walkthrough (Docs / First-run UX)
- **US-020 [P1]** — Fix repository layout table rendering and add “what to commit” guidance (Docs / Repo hygiene)
- **US-021 [P1]** — Add a glossary for mdkg concepts (Docs / Comprehension)
- **US-022 [P1]** — Add a dedicated guide: Give an AI agent a goal ID (Docs / Agent workflow)
- **US-023 [P1]** — Add a research spike guide (Docs / SDLC workflows)
- **US-024 [P1]** — Add a dedicated handoff guide with example output (Docs / Agent handoffs)
- **US-025 [P1]** — Document skills and configurable mirror roadmap (Docs / Agent skills)
- **US-026 [P1]** — Generate real command-level CLI reference pages (Docs / Reference)
- **US-027 [P1]** — Summarize latest changelog on docs instead of placeholder only (Docs / Release trust)
- **US-028 [P1]** — Turn roadmap placeholder into Now / Next / Later (Docs / Trust / Product direction)
- **US-030 [P1]** — Improve Project DB/Queues copy so it cannot be mistaken for hosted execution (Docs / Advanced alpha safety)
- **US-031 [P1]** — Add troubleshooting page for install, Node, index, and validation failures (Docs / Support)
- **US-033 [P1]** — Add terminal screenshot/product visual style and first real screenshots (Design / Product visuals)
- **US-034 [P1]** — Add homepage audience section: who mdkg is for (Marketing copy / Positioning)
- **US-035 [P1]** — Add “How mdkg relates to SKILL.md-style workflows” section (Marketing copy / Agent skills positioning)
- **US-036 [P1]** — Add docs homepage conversion path and stronger first paragraph (Docs / Conversion)
- **US-037 [P1]** — Add page-level summaries to every docs page (Docs / Skimmability)
- **US-038 [P1]** — Add “read-only vs mutating” labels across docs and command reference (Agent safety / Docs)
- **US-039 [P1]** — Add README/mdkg.dev/docs parity check (Docs drift / CI)
- **US-040 [P1]** — Add link checker and fix external/internal broken links (Quality / Navigation)
- **US-042 [P1]** — Create OG/social card visual assets (Marketing / Sharing)
- **US-043 [P1]** — Improve homepage footer with product, docs, social, and future personal links (Navigation / Conversion)
- **US-045 [P1]** — Add section-level CTAs instead of only top/bottom CTAs (Conversion / UX)
- **US-046 [P1]** — Add a practical “Before / After mdkg” comparison (Marketing copy / Product education)
- **US-047 [P1]** — Add example output snippets for status, pack, handoff, and validate (DevEx / Product proof)
- **US-048 [P1]** — Add demo repo path and future demo-policy page (Demos / Launch separation)
- **US-049 [P1]** — Add a high-signal “Why Markdown + frontmatter?” explanation (Marketing copy / Technical thesis)
- **US-050 [P1]** — Add “What mdkg is not” block on homepage (Trust / Positioning)
- **US-052 [P1]** — Add mobile-first polish pass for homepage and docs bridge (Responsive UX)
- **US-055 [P1]** — Create launch-readiness checklist page or doc (Launch operations)
- **US-056 [P1]** — Update GitHub repository description/topics to match mdkg.dev positioning (Conversion / GitHub proof)
- **US-058 [P1]** — Add a “Try this on a small repo first” safety/onboarding note (Trust / Onboarding)
- **US-029 [P2]** — Add advanced alpha pages for MCP, subgraphs, bundles, archives, graph movement, and workflow mirrors (Docs / Advanced)
- **US-032 [P2]** — Add copy-to-clipboard behavior for code blocks where appropriate (UX / DevEx)
- **US-041 [P2]** — Add Vercel analytics plan and minimal event tracking (Measurement)
- **US-044 [P2]** — Create a clean product wordmark/logo treatment (Design / Brand)
- **US-051 [P2]** — Add page-specific docs redirects/links from product site to matching docs pages (Navigation / Docs bridge)
- **US-053 [P2]** — Add docs search indexing check and improve page titles (Docs UX / Search)
- **US-054 [P2]** — Add basic image/diagram generation backlog with prompts (Design / Visual assets)
- **US-057 [P2]** — Add npm package page polish if package metadata is available (Conversion / Package trust)
- **US-059 [P2]** — Add a simple “feedback wanted” section tied to AI Engineer World’s Fair launch (Marketing / Community)
- **US-060 [P2]** — Add a first article landing-path alignment check (Content / Funnel)

---

# User stories

## US-001: Fix broken command formatting in landing quickstart

**Priority:** P0
**Theme:** First-run UX / DevEx
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/ — Quickstart section
- https://mdkg-dev.vercel.app/quickstart/ — Install and first run

### Description
The landing page and product quickstart currently collapse multiple shell commands into one unreadable line. This is a high-priority fix because the first-run path is the highest-conversion section of the site and the primary proof that mdkg is practical.

### Acceptance criteria
- [ ] Each shell command renders on its own line in a code block.
- [ ] Commands can be copied without prompts if needed, or with prompts consistently if the UI supports it.
- [ ] The canonical sequence is visible above the fold or one scroll below hero: install, version check, init, index, status, validate.
- [ ] Mobile layout does not horizontally overflow for basic quickstart commands.
- [ ] The same command sequence is consistent between homepage, quickstart page, docs install page, docs quickstart page, README top section, and llms.txt.

### Suggested copy / implementation notes
```bash
npm install -g mdkg
mdkg --version
mdkg init --agent
mdkg index
mdkg status
mdkg validate
```

## US-002: Repair llms.txt placeholders and command examples

**Priority:** P0
**Theme:** AI-agent-readable surface
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/llms.txt

### Description
The current llms.txt appears to lose placeholder values such as `<id>` because angle brackets are not escaped or represented safely. Since this file is explicitly for AI agents, it needs clean, literal, copyable instructions.

### Acceptance criteria
- [ ] Every command example in llms.txt includes valid placeholder text such as WORK_ID instead of swallowed angle-bracket placeholders.
- [ ] The file has readable line breaks and short sections instead of one long paragraph.
- [ ] llms.txt links to quickstart, trust, alpha, docs, GitHub, npm, and command reference once available.
- [ ] Agents are explicitly told to prefer `mdkg pack WORK_ID` over ad hoc file lists.
- [ ] The file states public-alpha boundaries and safety caveats in concise language.

### Suggested copy / implementation notes
Use placeholder names that survive plain-text rendering:

```text
mdkg pack WORK_ID
mdkg handoff create WORK_ID
```

Avoid raw `<id>` in `llms.txt` unless escaped and verified.

## US-003: Remove internal planning language from public homepage

**Priority:** P0
**Theme:** Marketing copy / Trust
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/ — Origin / Public-alpha honesty section

### Description
The homepage currently includes internal-goal language such as proving local pre-release readiness and keeping deployment out of scope. That is useful in planning docs, but it weakens public trust and confuses visitors who expect product copy.

### Acceptance criteria
- [ ] Homepage no longer says the goal proves local pre-release readiness or that production launch is out of scope.
- [ ] Public-alpha caveats remain, but are framed for users rather than implementers.
- [ ] Detailed launch-readiness language moves to internal docs or the alpha page.
- [ ] Footer/alpha page retains honest pre-v1 language without sounding unfinished or accidental.

### Suggested copy / implementation notes
Replace with:

> Developer preview. Pre-v1 public alpha. Markdown is the durable source of truth; generated indexes are rebuildable; advanced graph/cache/bundle/database contracts may change before v1.

## US-004: Move personal origin story out of the first public homepage pass

**Priority:** P0
**Theme:** Brand / Positioning
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/ — Origin section

### Description
Earlier strategy decided the first draft can omit Nicholas Reames entirely and add a later placeholder for headshot, short bio, origin story, and links. The current homepage already includes origin copy. That is not wrong long term, but for v0 it distracts from the standalone OSS developer-tool positioning.

### Acceptance criteria
- [ ] Homepage v0 either removes the origin section or replaces it with a small TODO hidden from public UI.
- [ ] Footer can include minimal GitHub/npm/docs links but does not foreground personal biography yet.
- [ ] A tracked placeholder exists for a future “Built by Nicholas Reames” section with headshot, bio, origin story, GitHub, X, LinkedIn, personal site, and ochatr.ai links.
- [ ] Future origin copy is clearly subordinate to the product story.

## US-005: Rewrite semantic-ref cards to remove misleading “Evidence:” labels

**Priority:** P0
**Theme:** Product clarity / Copy
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/ — Work, context, and evidence section

### Description
The current homepage uses “Evidence:” and “Caveat:” labels inside the scope/context/evidence cards. That makes the section feel like a claims matrix rather than product education, and it is especially confusing because `scope_refs` currently has a label that starts with “Evidence.”

### Acceptance criteria
- [ ] `scope_refs`, `context_refs`, and `evidence_refs` are explained in user-facing terms.
- [ ] The section clearly states: work is what to do, context is what to know, evidence is what proves the state.
- [ ] No card starts with the label “Evidence:” unless it is actually an evidence claim.
- [ ] A YAML example appears once and is visually readable.
- [ ] Docs concept page and homepage use the same definitions.

### Suggested copy / implementation notes
Suggested card copy:

- `scope_refs`: executable work scope — tasks, tests, bugs, features, and spikes a goal can route through.
- `context_refs`: background knowledge — decisions, PRDs, prior goals, plans, subgraph qids, or URI refs that inform the work.
- `evidence_refs`: proof — checkpoints, audits, receipts, archive sidecars, and artifacts that support the current state.

## US-006: Clarify docs bridge behavior during preview vs production

**Priority:** P0
**Theme:** Navigation / Docs integration
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/docs/

### Description
The product-site docs bridge says docs.mdkg.dev, but the live preview docs are currently at the Vercel preview URL. For preview review, the CTA should not mislead reviewers or send them to a domain that is not configured yet.

### Acceptance criteria
- [ ] In preview deployments, the docs CTA links to the live docs preview or clearly says docs.mdkg.dev is the intended production domain.
- [ ] In production, the docs CTA links to `docs.mdkg.dev`.
- [ ] No public page implies docs.mdkg.dev is live until DNS/custom domain is actually configured.
- [ ] The docs bridge explains repo-first docs ownership in one concise paragraph.

## US-007: Add a visible GitHub star CTA and OSS feedback CTA

**Priority:** P0
**Theme:** Conversion
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/ — hero/footer/CTA sections
- https://mdkg-docs.vercel.app/ — docs header/footer

### Description
The primary launch ask is not purchase or signup. It is connect/follow, star GitHub, try mdkg, and give feedback. The site should make GitHub star and feedback paths first-class without sounding needy.

### Acceptance criteria
- [ ] Hero includes “View GitHub” or “Star on GitHub” as a visible secondary CTA.
- [ ] Footer includes GitHub, npm, docs, issues/discussions, and feedback link if available.
- [ ] Docs pages include a persistent GitHub link and at least one route to issues/discussions or feedback.
- [ ] CTA copy sounds like an OSS maker sharing useful work, not a sales funnel.

### Suggested copy / implementation notes
CTA examples:

- “Try the quickstart”
- “Star on GitHub if useful”
- “Tell me where your coding agents lose context”
- “Open an issue with a workflow that breaks”

## US-008: Create a real claims evidence matrix, not just a pointer page

**Priority:** P0
**Theme:** Trust / Claims QA
**Website URL / section to update:**
- https://mdkg-docs.vercel.app/project/claims-evidence-matrix/
- mdkg-dev/CLAIMS.md

### Description
The docs currently point to a canonical claims file but do not show the actual matrix. Before polishing homepage copy, every public claim should map to shipped behavior, docs, command behavior, and caveats.

### Acceptance criteria
- [ ] Claims matrix includes page, claim, evidence source, shipped status, caveat/safe wording, and owner/status.
- [ ] Homepage hero claims are represented in the matrix.
- [ ] Trust/safety claims are represented in the matrix.
- [ ] Advanced alpha claims are marked advanced and caveated.
- [ ] The matrix blocks or softens claims about execution, hosted memory, hosted queues, arbitrary SQL, comprehensive secret scanning, production readiness, or universal agent compatibility unless verified.

## US-009: Expand trust page from scaffold into user-facing trust/security posture

**Priority:** P0
**Theme:** Trust / Safety
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/trust/
- https://mdkg-docs.vercel.app/start-here/safety-boundaries/

### Description
The trust pages have the right skeleton, but the product-site page still reads like a note to the launch team. The public trust page should be plain-spoken, slightly technical, and confidence-building.

### Acceptance criteria
- [ ] Trust page opens with a direct user promise: local-first project memory, not a hosted runtime.
- [ ] Sections distinguish “What mdkg stores,” “What mdkg does not do,” “MCP boundary,” “Queue boundary,” “Secret/prompt guidance,” and “Public alpha caveats.”
- [ ] The page explicitly says users should not store raw secrets, raw prompts, provider payloads, tokens, private keys, or sensitive production data in graph nodes.
- [ ] The page states handoff warnings are safety aids, not comprehensive DLP.
- [ ] The page links to safety docs and public alpha contract.

## US-010: Make production/preview indexing policy explicit

**Priority:** P0
**Theme:** SEO / Deployment safety
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/
- https://mdkg-docs.vercel.app/

### Description
The Vercel preview URLs are review surfaces. The future production domains should be indexable; preview URLs and unpromoted demo URLs should be noindex. This prevents duplicate or stale preview content from polluting SEO before mdkg.dev is ready.

### Acceptance criteria
- [ ] Preview deployments include `noindex,nofollow` or equivalent unless intentionally promoted.
- [ ] Production `mdkg.dev` allows indexing for homepage, quickstart, trust, alpha, docs bridge, and llms.txt as appropriate.
- [ ] Production `docs.mdkg.dev` allows indexing for stable docs pages.
- [ ] Unpromoted demo/preview URLs are noindex by default.
- [ ] Sitemap includes only canonical production pages.
- [ ] Canonical URLs point to production domains only when those domains are live.

## US-011: Add SEO metadata, social cards, and structured data baseline

**Priority:** P0
**Theme:** SEO / Sharing
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/
- https://mdkg-dev.vercel.app/quickstart/
- https://mdkg-dev.vercel.app/trust/
- https://mdkg-dev.vercel.app/alpha/

### Description
The content is strong enough to share soon, but launch pages need page-specific metadata, Open Graph/X cards, canonical URLs, and basic structured data so links render professionally and search engines understand the product.

### Acceptance criteria
- [ ] Every public page has title, description, canonical URL, Open Graph title/description/image, and X card metadata.
- [ ] Default OG image exists and matches the mdkg design system.
- [ ] Homepage includes SoftwareApplication JSON-LD if accurate and not overclaimed.
- [ ] Docs/quickstart pages include page-specific descriptions rather than duplicated generic metadata.
- [ ] Metadata respects preview noindex vs production index policy.

### Suggested copy / implementation notes
Homepage meta description draft:

> Markdown Knowledge Graph is git-native project memory for AI-native software engineering. Turn structured Markdown in your repo into deterministic context packs, goals, checkpoints, skills, and handoffs for humans and AI agents.

## US-012: Create or verify sitemap.xml and robots.txt for product and docs sites

**Priority:** P0
**Theme:** Technical SEO
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/sitemap.xml
- https://mdkg-dev.vercel.app/robots.txt
- https://mdkg-docs.vercel.app/sitemap.xml
- https://mdkg-docs.vercel.app/robots.txt

### Description
The llms.txt references sitemap.xml, but sitemap/robots need explicit verification for production and preview behavior.

### Acceptance criteria
- [ ] Product site has a sitemap for canonical production pages.
- [ ] Docs site has a sitemap or Starlight-generated sitemap for canonical docs pages.
- [ ] robots.txt points to sitemap location on production.
- [ ] Preview robots/noindex policy is implemented and tested.
- [ ] Broken or missing sitemap references fail a launch-readiness check.

## US-013: Implement accessibility and performance quality gates

**Priority:** P0
**Theme:** Quality / Launch readiness
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/
- https://mdkg-docs.vercel.app/

### Description
The sites should be fast, keyboard-friendly, and accessible because mdkg is positioning as a professional developer tool. Astro/Starlight are good foundations, but the project needs explicit gates so future visual work does not regress basics.

### Acceptance criteria
- [ ] Run and document Lighthouse or equivalent checks for product and docs previews.
- [ ] Keyboard navigation works for header, CTAs, docs nav, search, and footer links.
- [ ] Visible focus states exist for all interactive elements.
- [ ] Images/diagrams have useful alt text or are marked decorative.
- [ ] Color contrast meets baseline WCAG expectations.
- [ ] Reduced-motion behavior is respected for animations/transitions.
- [ ] Core Web Vitals targets are documented: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.
- [ ] No core content depends on client-only rendering.

## US-014: Implement DESIGN.md and apply restrained OSS visual system

**Priority:** P0
**Theme:** Design system
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/
- mdkg-dev/DESIGN.md

### Description
The current structure is useful, but the brand/design system needs to become explicit. mdkg.dev should share ochatr.ai color DNA while feeling like a standalone OSS developer tool.

### Acceptance criteria
- [ ] DESIGN.md exists in mdkg-dev or docs/design and defines brand attributes, colors, typography, spacing, components, diagrams, screenshots, and anti-patterns.
- [ ] Visual system uses mostly white/zinc surfaces with blue/sky/teal accents.
- [ ] Ocean Flow gradient is reserved for primary CTA or small accents, not broad backgrounds or body text.
- [ ] Code blocks use JetBrains Mono or a strong monospace fallback.
- [ ] Site looks like a serious OSS developer tool, not a generic SaaS waitlist page.
- [ ] Homepage and quickstart sections use consistent cards, buttons, badges, and terminal blocks.

## US-015: Add a product architecture diagram to the homepage hero or first-scroll section

**Priority:** P1
**Theme:** Design / Product education
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/ — hero / core loop

### Description
The homepage currently relies mostly on text and small step blocks. A concise architecture diagram would make the product legible in seconds: repo Markdown → mdkg CLI → packs/handoffs → human/agent work.

### Acceptance criteria
- [ ] Diagram communicates `.mdkg/` Markdown as source of truth.
- [ ] Diagram shows mdkg CLI producing deterministic packs/handoffs.
- [ ] Diagram shows humans and agents consuming the same project memory.
- [ ] Diagram is accessible with alt text and does not rely on animation.
- [ ] Diagram uses mdkg design tokens and restrained Ocean Flow accents.

### Suggested copy / implementation notes
Diagram label suggestion:

> Markdown + Git stay authoritative. mdkg builds bounded context for humans and agents.

## US-016: Add a “Why not just bigger context windows?” homepage section

**Priority:** P1
**Theme:** Marketing copy / Technical thesis
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/ — after problem section

### Description
The first launch article thesis is “AI Coding Agents Need Project Memory, Not Just Bigger Context Windows.” The site should echo that thesis because it is the strongest bridge between social/article traffic and product understanding.

### Acceptance criteria
- [ ] Homepage includes a short section distinguishing raw context from durable project memory.
- [ ] The section is fair: it acknowledges larger context windows are useful.
- [ ] The section explains why project memory should be structured, reviewable, version-controlled, and repo-native.
- [ ] The section links naturally to quickstart and docs concepts.

### Suggested copy / implementation notes
Draft:

## Bigger context helps. It does not replace project memory.

Longer context windows let an agent hold more text at once. But raw context is still temporary, easy to overfill, and hard to review. Project memory should be structured, version-controlled, inspectable, and shared by humans and agents. That is why mdkg keeps durable work state in Markdown and Git.

## US-017: Add “What you get in five minutes” conversion block

**Priority:** P1
**Theme:** Conversion / DevEx
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/
- https://mdkg-dev.vercel.app/quickstart/

### Description
The first five minutes are the conversion window. A concrete promise will help skeptical developers understand what they can test before investing time.

### Acceptance criteria
- [ ] Homepage includes a short “In five minutes” block near quickstart.
- [ ] The block avoids overpromising and focuses on install/init/status/validate/pack/handoff.
- [ ] Quickstart page mirrors this promise with exact commands.
- [ ] The block includes a GitHub star CTA after the user sees value.

### Suggested copy / implementation notes
Suggested block:

## What you can verify in five minutes

- Install the CLI.
- Initialize repo-local project memory.
- Build the access cache.
- Inspect graph health.
- Generate a bounded context pack or handoff.
- Validate before closing the loop.

## US-018: Expand docs install page with multiple package-manager options and Node setup guidance

**Priority:** P1
**Theme:** Docs / DevEx
**Website URL / section to update:**
- https://mdkg-docs.vercel.app/start-here/install/

### Description
The docs install page currently promotes npm as the validated path and mentions one-off runners later. The user wants npm, pnpm, bun, and possibly more DevEx options. The page should support multiple paths while clearly marking the canonical validated path.

### Acceptance criteria
- [ ] Install docs include npm, pnpm, and bun global install commands if verified.
- [ ] One-off commands such as npx/pnpm dlx/bunx are documented only if verified.
- [ ] Node >=24.15.0 requirement is prominent.
- [ ] Page includes how to check Node version.
- [ ] Page includes troubleshooting for “node:sqlite unavailable” or too-old Node, if applicable.
- [ ] Canonical validated path remains clear.

### Suggested copy / implementation notes
Suggested layout:

### Recommended public-alpha path
```bash
npm install -g mdkg
mdkg --version
```

### Other package managers
```bash
pnpm add -g mdkg
bun add -g mdkg
```

### Runtime requirement
mdkg requires Node.js >= 24.15.0 because it uses modern Node capabilities, including built-in local SQLite support where useful.

## US-019: Turn docs quickstart into a complete golden-path walkthrough

**Priority:** P1
**Theme:** Docs / First-run UX
**Website URL / section to update:**
- https://mdkg-docs.vercel.app/start-here/quickstart/

### Description
The docs quickstart has the right commands but needs more explanation, expected outputs, and “why this matters” context to help first-time users succeed.

### Acceptance criteria
- [ ] Quickstart explains each command in one sentence.
- [ ] Quickstart includes expected success signals after `status` and `validate`.
- [ ] Quickstart shows how to create a first task or use an existing demo graph if no work exists.
- [ ] Quickstart shows `pack` and `handoff` in a realistic sequence.
- [ ] Quickstart includes a final CTA: star GitHub, open an issue, or read agent workflow guide.
- [ ] Quickstart warns that required checks are guidance and users/agents must run them manually.

## US-020: Fix repository layout table rendering and add “what to commit” guidance

**Priority:** P1
**Theme:** Docs / Repo hygiene
**Website URL / section to update:**
- https://mdkg-docs.vercel.app/concepts/repository-layout/

### Description
The repository layout table appears collapsed in crawled text, making it hard to scan. This page is critical because users need to know which files are source, generated, ignored, or optional.

### Acceptance criteria
- [ ] Repository layout renders as a valid Markdown/HTML table in docs.
- [ ] Columns include path, purpose, commit policy, source/generated/runtime, and notes.
- [ ] Page explicitly answers “What should I commit?” and “What should I not commit?”
- [ ] Page distinguishes `.mdkg/index` rebuildable cache from `.mdkg/db` optional project application state.
- [ ] Page includes `.agents/skills` and `.claude/skills` as generated mirrors, not canonical source.

## US-021: Add a glossary for mdkg concepts

**Priority:** P1
**Theme:** Docs / Comprehension
**Website URL / section to update:**
- https://mdkg-docs.vercel.app/
- https://mdkg-docs.vercel.app/concepts/

### Description
mdkg has many concepts: graph nodes, goals, tasks, spikes, packs, handoffs, checkpoints, archives, skills, subgraphs, qids, project DB, queues. A glossary will reduce cognitive load for new users.

### Acceptance criteria
- [ ] Glossary page exists under Concepts or Reference.
- [ ] Glossary defines core launch terms first and advanced terms second.
- [ ] Definitions are short and user-facing.
- [ ] Glossary links to relevant guides/reference pages.
- [ ] Homepage and docs use glossary terms consistently.

## US-022: Add a dedicated guide: Give an AI agent a goal ID

**Priority:** P1
**Theme:** Docs / Agent workflow
**Website URL / section to update:**
- https://mdkg-docs.vercel.app/guides/agent-workflow/

### Description
The agent workflow guide currently lists commands and rules, but a more concrete guide should show the exact workflow a human uses when handing an agent a goal or work ID.

### Acceptance criteria
- [ ] Guide explains when to use `goal current`, `goal next`, `goal claim`, `pack`, `handoff`, and `task done`.
- [ ] Guide shows a human prompt template for an agent using mdkg.
- [ ] Guide clearly distinguishes read-only discovery commands from mutating lifecycle commands.
- [ ] Guide tells agents to prefer packs over ad hoc file lists.
- [ ] Guide includes closeout expectations: run checks, record evidence, validate.

### Suggested copy / implementation notes
Prompt snippet:

> Start by reading `AGENT_START.md`. Use `mdkg goal current`, `mdkg goal next`, and `mdkg pack WORK_ID` before editing. Do not browse files ad hoc unless the pack points you there. Run required checks manually, record evidence, and finish with `mdkg validate`.

## US-023: Add a research spike guide

**Priority:** P1
**Theme:** Docs / SDLC workflows
**Website URL / section to update:**
- https://mdkg-docs.vercel.app/guides/

### Description
Spikes are one of mdkg’s most compelling newer node types because they help turn fuzzy investigation into durable project memory. They deserve a concrete guide before or near launch.

### Acceptance criteria
- [ ] Guide defines a spike as actionable research/planning work, not an autonomous research agent.
- [ ] Guide shows creating a spike, starting it, recording findings, linking context/evidence, creating follow-up tasks/tests, and closing with checkpoint/validation.
- [ ] Guide includes a warning that mdkg does not perform web search or create follow-up nodes automatically.
- [ ] Guide ties spikes to mdkg.dev/product-planning use cases.

## US-024: Add a dedicated handoff guide with example output

**Priority:** P1
**Theme:** Docs / Agent handoffs
**Website URL / section to update:**
- https://mdkg-docs.vercel.app/guides/packs-and-handoffs/

### Description
Packs and handoffs are core differentiators. The current docs explain them briefly, but a launch-ready guide should show when to use each and what a handoff contains.

### Acceptance criteria
- [ ] Guide distinguishes packs from handoffs with a table.
- [ ] Guide includes example commands and a redacted sample handoff shape.
- [ ] Guide explains latest checkpoint, boundaries, required checks, next actions, and raw-marker warnings.
- [ ] Guide includes caveat that warnings are not comprehensive secret scanning.
- [ ] Guide includes one copy-ready agent transfer prompt.

## US-025: Document skills and configurable mirror roadmap

**Priority:** P1
**Theme:** Docs / Agent skills
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/ — Skills section
- https://mdkg-docs.vercel.app/guides/

### Description
Skill source/mirroring is important for Codex, Claude Code, and SKILL.md-style workflows. The docs should explain current behavior and explicitly mark configurable mirror destinations as a polish/roadmap item if not implemented yet.

### Acceptance criteria
- [ ] Docs explain canonical skill source: `.mdkg/skills/<slug>/SKILL.md`.
- [ ] Docs explain current mirrors: `.agents/skills/` and `.claude/skills/` if accurate.
- [ ] Docs explain that mdkg indexes/discovers skills but does not execute skill scripts.
- [ ] Docs include commands for `mdkg skill list/show/search/validate/sync` if accurate.
- [ ] Roadmap/TODO captures configurable mirror destinations and validation improvements.

## US-026: Generate real command-level CLI reference pages

**Priority:** P1
**Theme:** Docs / Reference
**Website URL / section to update:**
- https://mdkg-docs.vercel.app/reference/command-contract/
- https://mdkg-docs.vercel.app/reference/generated-cli-reference/

### Description
The reference section currently describes the intended generated reference but does not render command-level content. mdkg has a large command surface; reference docs should be generated from command metadata to avoid drift.

### Acceptance criteria
- [ ] Generated CLI reference renders command families and individual commands in Starlight or linked generated Markdown.
- [ ] Each command page includes purpose, usage, flags, output formats, read-only/mutating status, examples, related commands, safety notes, and alpha label where relevant.
- [ ] Reference is generated from `dist/command-contract.json` or the closest validated metadata artifact.
- [ ] Docs build/check fails if generated reference is stale.
- [ ] Advanced commands are labeled advanced alpha.

## US-027: Summarize latest changelog on docs instead of placeholder only

**Priority:** P1
**Theme:** Docs / Release trust
**Website URL / section to update:**
- https://mdkg-docs.vercel.app/project/changelog/

### Description
The changelog page currently points to the root changelog. That is okay as a source-of-truth rule, but the public docs should summarize the current release so users can tell the project is active and understand what changed recently.

### Acceptance criteria
- [ ] Changelog page shows current package version and latest release summary.
- [ ] Page links to canonical root CHANGELOG.md.
- [ ] Page avoids duplicating the entire changelog manually unless generated.
- [ ] Docs check verifies displayed latest version matches package/changelog metadata.
- [ ] Public alpha caveats link from changelog.

## US-028: Turn roadmap placeholder into Now / Next / Later

**Priority:** P1
**Theme:** Docs / Trust / Product direction
**Website URL / section to update:**
- https://mdkg-docs.vercel.app/project/roadmap/

### Description
The roadmap page has useful themes but can be made more decision-friendly with a Now/Next/Later split and explicit non-goals.

### Acceptance criteria
- [ ] Roadmap page includes Now, Next, Later, and Not planned for public alpha sections.
- [ ] Now focuses on golden path, docs, mdkg.dev, command reference, demo graph, launch readiness.
- [ ] Next includes skill mirror configurability, docs depth, demo videos, advanced docs, docs/domain launch.
- [ ] Later includes demo subdomains, visual graph explorer, deeper orchestration, ochatr integration as appropriate.
- [ ] Non-goals include hosted execution, hosted memory, comprehensive DLP, production runtime claims.

## US-030: Improve Project DB/Queues copy so it cannot be mistaken for hosted execution

**Priority:** P1
**Theme:** Docs / Advanced alpha safety
**Website URL / section to update:**
- https://mdkg-docs.vercel.app/advanced-alpha/project-db-queues/

### Description
Project DB and queues are powerful but muddy the value proposition if framed too centrally. The docs should repeatedly clarify that queues are local delivery state and advanced alpha infrastructure, not hosted execution history or canonical runtime state.

### Acceptance criteria
- [ ] Page opens with “advanced alpha local infrastructure.”
- [ ] Page distinguishes `.mdkg/index` from `.mdkg/db`.
- [ ] Page states queue payloads should be compact refs/redacted envelopes, not raw secrets/prompts/provider payloads.
- [ ] Page explains snapshot queue policies at a high level if documented.
- [ ] Page links back to trust/safety and alpha contract.

## US-031: Add troubleshooting page for install, Node, index, and validation failures

**Priority:** P1
**Theme:** Docs / Support
**Website URL / section to update:**
- https://mdkg-docs.vercel.app/start-here/

### Description
Public alpha users will hit predictable issues: Node version mismatch, missing index after init, stale generated cache, validation warnings, package-manager differences. A troubleshooting page can reduce churn and GitHub issue noise.

### Acceptance criteria
- [ ] Troubleshooting page exists under Start Here or Guides.
- [ ] Includes “Node version too old,” “mdkg status says index stale,” “validate warnings after init,” “global install command not found,” and “I do not have work nodes yet.”
- [ ] Each issue includes symptom, likely cause, and fix.
- [ ] Page links to GitHub issues for unresolved problems.

## US-033: Add terminal screenshot/product visual style and first real screenshots

**Priority:** P1
**Theme:** Design / Product visuals
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/ — hero and quickstart sections

### Description
The site needs at least one product visual beyond text: terminal output, context pack preview, handoff preview, or repo tree. This makes the CLI feel real and gives social/OG assets a stronger base.

### Acceptance criteria
- [ ] Hero or quickstart includes a styled terminal panel with believable mdkg output, not only commands.
- [ ] A repo-tree visual shows `.mdkg/` source-of-truth structure.
- [ ] Visuals use design tokens, high contrast, and accessible labels.
- [ ] Any output examples are accurate or marked illustrative.

## US-034: Add homepage audience section: who mdkg is for

**Priority:** P1
**Theme:** Marketing copy / Positioning
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/ — before or after core loop

### Description
The homepage explains what mdkg does, but it should more directly tell the right developers “this is for you.”

### Acceptance criteria
- [ ] Section lists 3–4 target users: solo AI-native developers, teams using coding agents, agent harness builders, repo maintainers coordinating human-agent work.
- [ ] Each audience card has a concrete pain and mdkg outcome.
- [ ] Section does not drift into broad enterprise sales language.

### Suggested copy / implementation notes
Example cards:

- For developers using Claude Code, Codex, Cursor, or terminal agents who keep re-explaining the project.
- For maintainers who want goals, decisions, evidence, and handoffs to survive across branches and sessions.
- For agent-workflow builders who need local-first context without a hosted memory service.

## US-035: Add “How mdkg relates to SKILL.md-style workflows” section

**Priority:** P1
**Theme:** Marketing copy / Agent skills positioning
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/
- https://mdkg-docs.vercel.app/guides/

### Description
The SKILL.md parallel helps developers quickly understand the mental model, but it must be positioned carefully: mdkg is repo-native project memory and SDLC state, not only a skill format.

### Acceptance criteria
- [ ] Homepage or docs include a small section comparing skills and mdkg project memory.
- [ ] Copy says skills help agents reuse task-specific instructions/resources; mdkg helps repos expose durable project memory, SDLC state, and workflow context.
- [ ] No claim of official compatibility with Anthropic or other vendors unless verified.
- [ ] Docs explain current skill mirroring behavior and future configurability.

## US-036: Add docs homepage conversion path and stronger first paragraph

**Priority:** P1
**Theme:** Docs / Conversion
**Website URL / section to update:**
- https://mdkg-docs.vercel.app/

### Description
The docs overview currently starts with “This Starlight site is the future canonical documentation host,” which is implementation/context rather than reader value. Move implementation details lower and open with what the docs help users accomplish.

### Acceptance criteria
- [ ] Docs overview first paragraph explains mdkg value and what the docs help the user do.
- [ ] Implementation note about Starlight/docs.mdkg.dev moves to a smaller “Docs source” note or footer.
- [ ] Start Here cards lead to Install, Quickstart, Agent Workflow, Safety, and Reference.
- [ ] Docs homepage includes GitHub/npm/product-site CTAs.

### Suggested copy / implementation notes
Suggested opening:

> These docs help you install Markdown Knowledge Graph, initialize repo-local project memory, build deterministic context packs, create handoffs, and validate graph state before closing work.

## US-037: Add page-level summaries to every docs page

**Priority:** P1
**Theme:** Docs / Skimmability
**Website URL / section to update:**
- https://mdkg-docs.vercel.app/ — all docs pages

### Description
Most docs pages are currently short and skeletal. Each page should start with a one- or two-sentence summary that tells users when to use the page and what they will learn.

### Acceptance criteria
- [ ] Every docs page has an opening summary under H1.
- [ ] Every docs page has at least one practical example or explicit link to the next practical guide.
- [ ] Advanced pages state stability level and caveats at the top.
- [ ] Short pages do not feel like placeholders unless intentionally marked “coming soon.”

## US-038: Add “read-only vs mutating” labels across docs and command reference

**Priority:** P1
**Theme:** Agent safety / Docs
**Website URL / section to update:**
- https://mdkg-docs.vercel.app/guides/agent-workflow/
- https://mdkg-docs.vercel.app/reference/

### Description
Agents need to know which commands are safe discovery and which mutate repo/graph state. This is a key mdkg trust and agent-UX feature.

### Acceptance criteria
- [ ] Agent workflow guide labels `goal next` as read-only and `goal claim` as mutating.
- [ ] Command reference includes read-only/mutating status for commands where metadata is known.
- [ ] Docs include a “safe discovery commands” list and a “mutating lifecycle commands” list.
- [ ] MCP docs explain why exposed tools are read-only.

## US-039: Add README/mdkg.dev/docs parity check

**Priority:** P1
**Theme:** Docs drift / CI
**Website URL / section to update:**
- README.md
- https://mdkg-dev.vercel.app/
- https://mdkg-docs.vercel.app/

### Description
The repo README is already stronger than the current landing/docs copy in places. Add a parity check or checklist so package version, install commands, alpha status, core positioning, and golden loop do not drift across surfaces.

### Acceptance criteria
- [ ] Checklist or script verifies package version appears consistently across README, site, docs, command contract, and changelog summary.
- [ ] Install commands are consistent or intentionally marked different by surface.
- [ ] Core tagline is consistent.
- [ ] README top third links to mdkg.dev and docs.mdkg.dev when live.
- [ ] Docs/site copy does not contradict README source-of-truth language.

## US-040: Add link checker and fix external/internal broken links

**Priority:** P1
**Theme:** Quality / Navigation
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/
- https://mdkg-docs.vercel.app/

### Description
The site has several external CTAs and future-domain links. A link checker should prevent bad review experiences and failed launch traffic.

### Acceptance criteria
- [ ] Automated link check runs for product site and docs site.
- [ ] Preview docs links point to preview docs or clearly indicate future production domain.
- [ ] GitHub, npm, docs, llms.txt, quickstart, trust, alpha, and edit-page links resolve correctly.
- [ ] Broken external links are either fixed or documented as launch blockers.
- [ ] Future-domain links do not appear as live until DNS is configured.

## US-042: Create OG/social card visual assets

**Priority:** P1
**Theme:** Marketing / Sharing
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/
- mdkg-dev/public/

### Description
The first article and social posts will link to mdkg.dev. The site needs professional preview cards that reinforce the technical thesis and OSS developer-tool tone.

### Acceptance criteria
- [ ] Default OG image exists at recommended social-card dimensions.
- [ ] Image includes product name and tagline.
- [ ] Visual uses white/zinc background and restrained blue/sky/teal accents.
- [ ] No headshot or personal branding in v0 OG image.
- [ ] Per-page OG images are optional but homepage default must work.

### Suggested copy / implementation notes
OG text:

Markdown Knowledge Graph
Git-native project memory for AI-native software engineering

## US-043: Improve homepage footer with product, docs, social, and future personal links

**Priority:** P1
**Theme:** Navigation / Conversion
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/ — footer

### Description
The footer already has product/learn links, but it should become the reliable router for GitHub, npm, docs, llms.txt, trust, alpha, and later Nicholas links.

### Acceptance criteria
- [ ] Footer includes Product: Home, Quickstart, Docs, npm, GitHub.
- [ ] Footer includes Learn: Trust, Public Alpha, llms.txt, Claims/Changelog if public.
- [ ] Footer includes Community/Feedback: Issues, Discussions, X/LinkedIn later if desired.
- [ ] Footer copy reinforces tagline without overusing hero text.
- [ ] Future personal links are placeholder tasks, not public clutter unless ready.

## US-045: Add section-level CTAs instead of only top/bottom CTAs

**Priority:** P1
**Theme:** Conversion / UX
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/

### Description
Developer visitors may enter/skim at different sections. Lightweight CTAs throughout the page can route them without making the site salesy.

### Acceptance criteria
- [ ] Quickstart section links to full quickstart docs/page.
- [ ] Packs/handoffs section links to docs guide.
- [ ] Trust section links to trust page.
- [ ] Advanced alpha section links to advanced docs overview.
- [ ] Final CTA emphasizes GitHub star/feedback and quickstart.

## US-046: Add a practical “Before / After mdkg” comparison

**Priority:** P1
**Theme:** Marketing copy / Product education
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/ — problem/solution area

### Description
A before/after comparison will make the value immediately understandable for developers who have felt agent context drift.

### Acceptance criteria
- [ ] Comparison shows “without mdkg” vs “with mdkg.”
- [ ] Rows include project goals, decisions, active work, evidence, handoffs, validation.
- [ ] Copy stays practical and non-hype.
- [ ] Comparison links to quickstart.

### Suggested copy / implementation notes
Example rows:

| Without mdkg | With mdkg |
|---|---|
| Goals live in chat history | Goals live in repo-local Markdown |
| Agents browse files ad hoc | Agents receive deterministic packs |
| Handoffs are raw context dumps | Handoffs are bounded next-action summaries |
| Evidence gets scattered | Checkpoints and evidence refs stay linked |

## US-047: Add example output snippets for status, pack, handoff, and validate

**Priority:** P1
**Theme:** DevEx / Product proof
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/
- https://mdkg-docs.vercel.app/start-here/quickstart/

### Description
Commands become more credible when readers can see representative output. Add short, accurate or explicitly illustrative snippets.

### Acceptance criteria
- [ ] Quickstart includes short expected output after `mdkg status` and `mdkg validate`.
- [ ] Packs/handoffs guide includes a redacted/shortened representative output shape.
- [ ] Output snippets are accurate for current CLI or clearly labeled illustrative.
- [ ] Long outputs are collapsed or linked to examples.

## US-048: Add demo repo path and future demo-policy page

**Priority:** P1
**Theme:** Demos / Launch separation
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/
- https://mdkg-docs.vercel.app/project/roadmap/

### Description
Demo deployment is deferred, but the site/docs should define where demo code lives and how future demo-N.mdkg.dev promotion will work so previews do not get mixed into canonical launch.

### Acceptance criteria
- [ ] Docs include a demo deployment/indexing policy page or roadmap entry.
- [ ] Policy states canonical site is mdkg.dev and docs are docs.mdkg.dev.
- [ ] Unpromoted Vercel preview/demo URLs are noindex and not canonical.
- [ ] Future durable demos likely use demo-N.mdkg.dev after review.
- [ ] Demo repo/folder path is identified if available.

## US-049: Add a high-signal “Why Markdown + frontmatter?” explanation

**Priority:** P1
**Theme:** Marketing copy / Technical thesis
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/ — Markdown plus Git section
- https://mdkg-docs.vercel.app/concepts/source-of-truth/

### Description
Markdown + frontmatter is one of the origin insights and product primitives. The site should explain it in practical terms: human-readable prose plus machine-readable routing metadata.

### Acceptance criteria
- [ ] Homepage explains Markdown and frontmatter in one concise section.
- [ ] Docs concept page explains what belongs in frontmatter vs body.
- [ ] Copy ties frontmatter to routing, validation, references, lifecycle state, and agent use.
- [ ] Section avoids sounding theoretical or like generic “knowledge graph” marketing.

### Suggested copy / implementation notes
Draft:

Markdown gives humans readable project memory. Frontmatter gives tools enough structure to route, validate, pack, and hand off that memory. Git makes every change reviewable.

## US-050: Add “What mdkg is not” block on homepage

**Priority:** P1
**Theme:** Trust / Positioning
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/
- https://mdkg-dev.vercel.app/trust/

### Description
The trust page covers boundaries, but a short homepage block will prevent overinterpretation from social visitors who skim.

### Acceptance criteria
- [ ] Homepage includes a compact “What mdkg is not” block near advanced/trust section.
- [ ] Block says mdkg is not an autonomous runtime, hosted memory service, vector database, comprehensive secret scanner, or replacement for code review.
- [ ] Block links to full trust page.
- [ ] Language is direct but not defensive.

## US-052: Add mobile-first polish pass for homepage and docs bridge

**Priority:** P1
**Theme:** Responsive UX
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/
- https://mdkg-dev.vercel.app/docs/

### Description
The site will be shared during AI Engineer World’s Fair and opened on phones. The homepage must be easy to scan on mobile, especially hero, quickstart commands, and CTAs.

### Acceptance criteria
- [ ] Hero headline wraps cleanly on narrow screens.
- [ ] CTA buttons stack or wrap without cramped layout.
- [ ] Terminal/code blocks can scroll horizontally or wrap safely without breaking commands.
- [ ] Feature cards stack in a sensible order.
- [ ] Footer links are tap-friendly.
- [ ] Docs bridge page is useful on mobile.

## US-055: Create launch-readiness checklist page or doc

**Priority:** P1
**Theme:** Launch operations
**Website URL / section to update:**
- mdkg-dev/LAUNCH_CHECKLIST.md
- docs/project/launch-readiness.md

### Description
The site now has enough surfaces that launch readiness needs an explicit checklist rather than memory. This will help you and Codex iterate quickly before pointing real traffic at mdkg.dev.

### Acceptance criteria
- [ ] Checklist includes build, lint, link check, metadata check, sitemap/robots, noindex/canonical, accessibility, performance, install command verification, README parity, docs parity, claims evidence review, GitHub/npm links, Vercel analytics, and DNS readiness.
- [ ] Checklist separates preview readiness from production readiness.
- [ ] Checklist includes manual mobile review and social-card preview review.
- [ ] Checklist includes “do not claim deployed docs.mdkg.dev until DNS is live.”

## US-056: Update GitHub repository description/topics to match mdkg.dev positioning

**Priority:** P1
**Theme:** Conversion / GitHub proof
**Website URL / section to update:**
- https://github.com/nickreames/mdkg

### Description
The GitHub repo is the main conversion target. Its current description in the crawled GitHub title still says “graph based documentation generation and management tool,” which is less sharp than the new positioning.

### Acceptance criteria
- [ ] GitHub repo description uses the new positioning: git-native project memory for AI-native software engineering.
- [ ] README top section matches mdkg.dev hero and quickstart.
- [ ] Repo topics include relevant keywords such as markdown, knowledge-graph, ai-agents, agentic-coding, project-memory, context-engineering, cli, typescript if appropriate.
- [ ] GitHub About/sidebar links to mdkg.dev and docs preview/production when ready.
- [ ] README has clear GitHub-star/feedback paths without sounding salesy.

## US-058: Add a “Try this on a small repo first” safety/onboarding note

**Priority:** P1
**Theme:** Trust / Onboarding
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/quickstart/
- https://mdkg-docs.vercel.app/start-here/quickstart/

### Description
Because mdkg is public alpha and writes repo-local scaffold files, new users should be encouraged to try it in a test branch or small repo first. This builds trust and reduces fear.

### Acceptance criteria
- [ ] Quickstart recommends trying mdkg on a small repo or new branch first.
- [ ] Quickstart explains what files are created at a high level.
- [ ] Quickstart links to repository layout / what to commit.
- [ ] Tone is reassuring, not scary.

### Suggested copy / implementation notes
Suggested note:

> Public alpha tip: try mdkg on a small repo or a fresh branch first. `mdkg init --agent` writes repo-local Markdown scaffolding under `.mdkg/` and agent-facing skill mirrors; generated indexes are rebuildable.

## US-029: Add advanced alpha pages for MCP, subgraphs, bundles, archives, graph movement, and workflow mirrors

**Priority:** P2
**Theme:** Docs / Advanced
**Website URL / section to update:**
- https://mdkg-docs.vercel.app/advanced-alpha/overview/

### Description
The advanced overview lists many surfaces but only Project DB/Queues has its own page. Add stub-to-useful pages for each advanced surface so early adopters can explore without confusing first-time users.

### Acceptance criteria
- [ ] Advanced alpha nav includes separate pages for read-only MCP, subgraphs, bundles, graph movement, archive sidecars, workflow mirrors, and project DB/queues.
- [ ] Each page states what it is, when to use it, when not to use it, example commands, safety boundaries, current limitations, and stability caveats.
- [ ] Advanced pages do not appear in the homepage hero path.
- [ ] MCP page explicitly states read-only scope and excluded surfaces.

## US-032: Add copy-to-clipboard behavior for code blocks where appropriate

**Priority:** P2
**Theme:** UX / DevEx
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/
- https://mdkg-dev.vercel.app/quickstart/
- https://mdkg-docs.vercel.app/start-here/install/
- https://mdkg-docs.vercel.app/start-here/quickstart/

### Description
Developer docs convert better when commands are easy to copy. Starlight may already support copy buttons; ensure product-site terminal blocks do too.

### Acceptance criteria
- [ ] Code blocks on product site have accessible copy buttons or clear copyable text.
- [ ] Copy excludes shell prompt characters unless intentionally included.
- [ ] Copy feedback is accessible and does not rely only on color.
- [ ] Mobile copy behavior works.

## US-041: Add Vercel analytics plan and minimal event tracking

**Priority:** P2
**Theme:** Measurement
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/
- https://mdkg-docs.vercel.app/

### Description
The launch measurement plan should stay privacy-friendly and lightweight. Vercel analytics is acceptable as the deployment platform’s built-in baseline, with optional event tracking for core CTAs.

### Acceptance criteria
- [ ] Analytics plan documents what is tracked: page views, GitHub clicks, npm clicks, docs clicks, quickstart clicks, social/ochatr links if present.
- [ ] If analytics is implemented, no invasive third-party analytics are added.
- [ ] Custom events are added only where useful and easy.
- [ ] Privacy note is compatible with mdkg local-first trust posture.
- [ ] Post-launch dashboard review cadence is documented.

## US-044: Create a clean product wordmark/logo treatment

**Priority:** P2
**Theme:** Design / Brand
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/
- mdkg-dev/DESIGN.md

### Description
The site currently appears text-first. A simple wordmark/logo treatment would help mdkg.dev feel intentional without creating a mascot or overdesigned brand.

### Acceptance criteria
- [ ] Header includes a clean mdkg/Markdown Knowledge Graph wordmark.
- [ ] Logo works in small sizes and monochrome.
- [ ] Logo avoids playful AI/robot imagery.
- [ ] Wordmark pairs well with GitHub/npm/social cards.
- [ ] DESIGN.md documents logo usage and anti-patterns.

## US-051: Add page-specific docs redirects/links from product site to matching docs pages

**Priority:** P2
**Theme:** Navigation / Docs bridge
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/quickstart/
- https://mdkg-dev.vercel.app/trust/
- https://mdkg-dev.vercel.app/alpha/

### Description
Product-site pages are short. Each should route users to deeper docs pages when they want more detail.

### Acceptance criteria
- [ ] Product quickstart links to docs install and docs quickstart.
- [ ] Product trust links to docs safety boundaries.
- [ ] Product alpha links to docs public alpha contract and changelog.
- [ ] Links resolve correctly in preview and production.

## US-053: Add docs search indexing check and improve page titles

**Priority:** P2
**Theme:** Docs UX / Search
**Website URL / section to update:**
- https://mdkg-docs.vercel.app/

### Description
Starlight provides a good docs foundation, but search quality depends on page titles and content. Some page titles use title case like “Source Of Truth”; make naming human-friendly and searchable.

### Acceptance criteria
- [ ] Docs page titles use natural title case, e.g. “Source of truth,” “Work, context, and evidence.”
- [ ] Search can find terms like pack, handoff, spike, scope_refs, context_refs, evidence_refs, MCP, project DB, queue, skill mirror.
- [ ] Docs navigation is ordered by user journey: install → quickstart → concepts → guides → reference → advanced.

## US-054: Add basic image/diagram generation backlog with prompts

**Priority:** P2
**Theme:** Design / Visual assets
**Website URL / section to update:**
- mdkg-dev/DESIGN.md
- docs/design/

### Description
We should preserve the diagram/image prompts from planning so future visual assets are consistent. This can live in DESIGN.md or a visual-assets backlog.

### Acceptance criteria
- [ ] DESIGN.md includes diagram style rules and prompts for architecture, core loop, semantic refs, repo layout, handoff flow, and trust boundaries.
- [ ] Prompts specify clean OSS developer-tool style, white/zinc background, blue/sky/teal accents, no mascot, no sci-fi glow.
- [ ] Each proposed visual maps to a page/section and has alt-text guidance.

## US-057: Add npm package page polish if package metadata is available

**Priority:** P2
**Theme:** Conversion / Package trust
**Website URL / section to update:**
- npm package link from mdkg.dev footer/header

### Description
The npm package link is a key conversion path. If package metadata is under your control, make sure npm description, keywords, repository, homepage, and README mirror the new positioning.

### Acceptance criteria
- [ ] package.json description matches mdkg.dev positioning.
- [ ] package.json homepage points to mdkg.dev when production is live or preview if intentionally temporary.
- [ ] package.json repository points to GitHub.
- [ ] keywords include package-discovery terms.
- [ ] Published README starts with install and public-alpha caveat.

## US-059: Add a simple “feedback wanted” section tied to AI Engineer World’s Fair launch

**Priority:** P2
**Theme:** Marketing / Community
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/
- https://github.com/nickreames/mdkg/issues

### Description
The launch posture is maker-not-taker: solving a common problem with OSS and asking for feedback. The site can include a tasteful feedback section without making AI Engineer World’s Fair dominate evergreen copy.

### Acceptance criteria
- [ ] A small feedback section invites developers to share where their AI coding agents lose context.
- [ ] Feedback CTA links to GitHub issues/discussions or a temporary feedback route.
- [ ] Copy avoids begging for support or over-promoting the conference.
- [ ] If conference-specific copy is included, it is easy to remove after the event.

### Suggested copy / implementation notes
Suggested CTA:

> If your coding agents lose context in a different way, open an issue or send feedback. I’m using real workflow pain to shape the public-alpha roadmap.

## US-060: Add a first article landing-path alignment check

**Priority:** P2
**Theme:** Content / Funnel
**Website URL / section to update:**
- https://mdkg-dev.vercel.app/
- upcoming article: AI Coding Agents Need Project Memory, Not Just Bigger Context Windows

### Description
The first article will send traffic to mdkg.dev. The homepage should mirror the article thesis, vocabulary, and CTA so readers feel continuity.

### Acceptance criteria
- [ ] Homepage includes “project memory, not just bigger context windows” concept.
- [ ] Article CTA points to a page that has matching language and clear quickstart.
- [ ] Homepage hero and article title do not conflict or introduce too many competing framings.
- [ ] GitHub star/try quickstart CTA appears near the landing path.
