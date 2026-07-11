---
id: prop-8
type: prop
title: Use one shared dormant release manifest and gated loop documentation
tags: [release, activation, docs, seo, accessibility]
owners: []
links: []
artifacts: []
relates: [goal-62, goal-63, goal-64, task-714, test-386]
refs: [edd-71, dec-73, dec-74, prd-11, prop-7, task-710, task-711, task-712]
aliases: []
created: 2026-07-10
updated: 2026-07-11
---
# Summary

Use one root-owned release manifest to keep the complete v0.5.0 loop experience
dormant across mdkg.dev and docs.mdkg.dev until Goal 64 verifies npm publication.
Both Astro sites consume the same state, support an explicit local/preview
override, and fail closed for production. Release content is source-controlled
in Goal 63 but is not promoted, indexed, or advertised while dormant.

# Motivation

Goal 63 needs to implement and visually verify the complete release experience
before npm publication. Hiding links alone is insufficient because guessed
routes, page metadata, sitemaps, Pagefind, LLM files, and structured data can
leak a release early. A shared, deterministic state contract lets Goal 3 test
the published experience locally while Goal 4 activates it with one auditable
change after package proof.

# Proposal

## Shared Manifest

Create one root source file owned by the release program:

`release/public-release.json`

```json
{
  "schema_version": 1,
  "release_id": "mdkg-v0.5.0-loops",
  "target_version": "0.5.0",
  "state": "draft",
  "qualifier": "Pre-v1 public alpha"
}
```

Contract:

- Allowed states are exactly `draft` and `published`.
- Goal 63 commits `draft` and leaves it unchanged.
- Goal 64 changes only `state` from `draft` to `published` after npm registry,
  integrity, tarball, fresh-install, and upgrade proof.
- A published build fails if root `package.json.version` differs from
  `target_version`.
- A production build fails if an environment override attempts to expose a
  draft release.
- The target version may exist in source-controlled planning state, but draft
  public HTML, metadata, structured data, sitemaps, search, and LLM files cannot
  advertise it.

## Visibility Projection

Both sites derive the same values:

- `published`: manifest state is `published`.
- `preview_visible`: manifest is draft, the explicit
  `PUBLIC_MDKG_RELEASE_PREVIEW=1` override is present, and the build is not a
  Vercel production build.
- `visible`: `published || preview_visible`.
- `indexable`: `published` only; previews remain noindex.

The override must not mutate the manifest. A Vercel production build with a
draft manifest remains dormant even if the override is accidentally set, and
the preferred implementation is to fail the build rather than silently expose
content.

## Dormant Output Contract

When `state` is `draft` without the local/preview override:

- mdkg.dev renders no v0.5.0 announcement, loop CTA, loop metadata, or target
  version claim.
- docs navigation contains no Loops group.
- Direct `/loops/**` requests either do not exist or render a generic unavailable
  state with `noindex, nofollow`; they cannot render the release guide content.
- Docs sitemap output excludes every `/loops/**` URL.
- Docs Pagefind output contains no loop-release page title, body, command,
  description, or target-version content.
- Marketing and docs LLM-facing text contains no dormant loop-release copy or
  route.
- Homepage JSON-LD continues to use the real package version, currently 0.4.2.
- Existing preview-wide noindex behavior remains unchanged.

An implementation may use a release-aware content gate or suppress routes at
build time. Acceptance is based on built output, direct-route behavior, search,
and metadata evidence, not on hiding navigation alone.

## Published Output Contract

When `state` is `published` and package version is 0.5.0:

- mdkg.dev renders the selected post-quickstart announcement.
- Docs render and navigate the complete top-level Loops group.
- Loop routes appear in docs sitemap and Pagefind.
- LLM-facing text may include the source-backed loop category, commands, safety
  boundaries, and docs routes.
- Homepage structured data advertises the real package version 0.5.0.
- All published pages remain qualified as `Pre-v1 public alpha` where release
  posture is stated.

## Local Preview Contract

With a draft manifest and `PUBLIC_MDKG_RELEASE_PREVIEW=1` outside production:

- Both sites render the same content and navigation planned for published state.
- Every preview page is noindex/nofollow and robots disallow crawling.
- Package/structured metadata remains truthful; the preview can label the target
  release but cannot claim npm availability.
- The committed manifest remains byte-for-byte draft before and after builds.

## Information Architecture

Add a top-level `Loops` group after `Concepts` and before `Guides`:

1. `/loops/` - **Loops**
   - What a loop is.
   - Goals versus loops.
   - mdkg process state versus agent-harness execution.
   - Read-only, planning, patch-proposal, write-with-approval, and autonomous-
     local metadata modes without implying a hosted runtime.
2. `/loops/templates-and-forks/` - **Templates and forks**
   - Seven bundled templates.
   - Raw loop creation versus template fork.
   - Default, planning-only, and manual child materialization.
   - Template identity/hash, stale warnings, and no automatic rewrite.
3. `/loops/readiness-routing-evidence-closeout/` - **Readiness, routing,
   evidence, and closeout**
   - Pre-run questions, typed decisions and approvals.
   - Authorized, approval-gated, and prohibited actions.
   - Evidence lanes, typed waivers, `plan`, `next`, `runs`, and closeout.
   - Spike/proposal/recommendation continuation when a lane is blocked.
4. `/loops/security-audit/` - **Run a read-only security audit loop**
   - Purpose-built first-use walkthrough.
   - Read-only source boundary and allowed mdkg evidence writes.
   - External advisory/provider approval boundary.
   - Sanitized command/output examples and next-step handoff.

Upgrade guidance remains in Start Here / Install. Version facts remain in
Project / Changelog and root `CHANGELOG.md`. Exact syntax remains generated CLI
reference. Backend/API/CLI bloat is a secondary example linked from Templates
and forks, not another homepage CTA.

## Homepage Journey

The release journey is unchanged across all visual options:

1. Existing hero.
2. Existing generic quickstart.
3. New incremental loop announcement.
4. Primary CTA to `https://docs.mdkg.dev/loops/security-audit/`.
5. Secondary text link to `https://docs.mdkg.dev/loops/`.

Shared exact copy:

- Eyebrow: `New in v0.5.0 · Pre-v1 public alpha`
- Primary CTA: `Run a security audit loop`
- Secondary link: `Learn how loops work`
- Runtime boundary: `mdkg preserves the process; your coding-agent harness
  executes agents and tools.`

Accepted selection in `dec-74`:

- Base: Direction 1, Process Rail.
- Headline: `Reusable loops for work that spans more than one goal.`
- Body: `Fork a read-only audit template, answer readiness questions, route the
  next authorized work, and keep decisions and evidence in your mdkg graph.
  mdkg preserves the process; your coding-agent harness executes agents and
  tools.`
- Proof labels: Fork a template, Resolve readiness, Route authorized work, and
  Inspect evidence and closeout.
- Direction 2 contributes the runtime-boundary sentence. Direction 3's catalog
  treatment belongs on Templates and forks.

## Purpose-Built Security Walkthrough

Use this exact command sequence, with output shortened to the named fields and
reconciled by docs command checks:

```bash
mdkg loop list
mdkg loop show security-audit
mdkg loop fork security-audit --scope . --dry-run --json
```

The dry-run example may show only:

```json
{
  "action": "planned",
  "dry_run": true,
  "template": { "ref": "template://loops/security-audit" },
  "loop": { "id": "LOOP_ID" },
  "materialization_mode": "default_children",
  "materialized_children": [
    { "type": "spike" },
    { "type": "task" },
    { "type": "test" }
  ]
}
```

Explain that dry-run writes nothing and the real fork should receive the same
available IDs. Then continue:

```bash
mdkg loop fork security-audit --scope . --json
mdkg loop plan LOOP_ID --json
```

The plan output identifies four required question answers. The walkthrough must
not invent an answer command. It should create an accepted decision through the
normal mdkg workflow, then show the actual identity-binding form in the scoped
loop file:

```yaml
question_answer_refs:
  - external_advisory_checks_approved=DECISION_ID
  - security_provider_workflow_approved=DECISION_ID
  - local_cache_writes_approved=DECISION_ID
  - audit_scope=DECISION_ID
```

The example answers should keep external advisory/provider work unrequested or
unapproved, approve local cache writes, and scope the run to local read-only
audit work. Continue with:

```bash
mdkg loop plan LOOP_ID --json
mdkg pack LOOP_ID --profile concise
mdkg loop next LOOP_ID --json
mdkg loop runs LOOP_ID --json
```

The walkthrough must say explicitly:

- mdkg does not launch the audit; run the packed loop through Codex, Claude Code,
  or another harness that follows the repo's `pursue-mdkg-loop` skill.
- Read-only forbids functional source changes but allows mdkg findings, spikes,
  proposals, tasks, tests, decisions, checkpoints, waivers, and evidence.
- External advisory/provider checks remain approval-gated.
- `loop next` routes authorized work or blocker recovery; it does not execute it.
- A loop closes only when required lanes are completed or explicitly waived.
- Public output uses placeholders, not real dogfood ids, local paths, hashes, or
  receipts.

Do not document a nonexistent `mdkg loop run`, `resume`, `execute`, or `note add`
command.

## Responsive Contract

- Desktop uses the existing 1120px container and one two-column announcement
  layout at widths above 900px.
- At 900px and below, stack message/actions before the selected proof element.
- At 560px and below, use existing 12px side gutters and 48px section padding;
  the primary CTA is full width and the secondary action remains a text link.
- Announcement heading uses section-scale `h2`, never hero-scale `h1`.
- No horizontal page overflow at 320 CSS px or 200% browser zoom.
- Code blocks use contained horizontal scrolling and do not force the page wide.
- Status rows wrap labels and state independently; color is never the only state
  signal.
- The section should add no more than approximately 1.5 390x844 viewports.

## Accessibility Contract

- One semantic `<section aria-labelledby>` with one `h2`; process steps use an
  ordered list and status data uses a list or table with meaningful headers.
- Source order is copy, primary CTA, secondary link, then proof element on all
  breakpoints.
- Both actions are keyboard reachable with a visible focus indicator; no custom
  focus trap or roving tabindex is introduced.
- Pointer targets are at least 44x44 CSS px where the whole control is intended
  as a target.
- Normal text and link contrast is at least 4.5:1; large text and meaningful UI
  graphics are at least 3:1; focus indicators reach at least 3:1 against adjacent
  colors.
- Light mdkg.dev plus Starlight light/dark/auto themes are checked.
- Reduced-motion users receive no required smooth-scroll or decorative motion.
- Heading order, landmarks, accessible names, current-page state, skip link,
  and mobile menu semantics remain valid.
- Tests cover keyboard traversal, 200% zoom, 320px reflow, and high-contrast/
  forced-colors behavior; screenshots alone are not compliance proof.

## SEO, Links, And Safety Contract

- Canonicals use `https://mdkg.dev/` and `https://docs.mdkg.dev/loops/...` only.
- Every loop page has one unique title and source-backed description; no
  duplicate release marketing page is added.
- Published sitemap, Pagefind, LLM, robots, Open Graph, and structured-data
  outputs agree with the manifest projection.
- CTA and all internal docs links are checked in both draft and active-preview
  builds; draft links cannot leak from rendered content.
- Built output is scanned for `/Users/`, raw `loop-5`/`goal-61`/checkpoint ids,
  template hashes, provider ids, tokens, secrets, private receipts, and copied
  dogfood text.
- Public examples use `LOOP_ID`, `DECISION_ID`, and neutral file names only.
- `Pre-v1 public alpha` is the exact qualifier. Do not use self-healing,
  autonomous runtime, built-in scanner, ROI, adoption, superiority, or npm
  availability language without Goal 64 proof.

## Required Build Evidence For Goal 63

Goal 63 must produce and inspect four modes:

1. Marketing draft build.
2. Docs draft build.
3. Marketing active-preview build with noindex.
4. Docs active-preview build with noindex.

Automated assertions must verify manifest immutability, fail-closed Vercel
production override, route availability, direct dormant-route response, nav,
sitemap, Pagefind, LLM files, robots/meta, structured version, links, exact copy,
and absence of forbidden content. Browser evidence must cover desktop and 390px
mobile announcement, docs navigation, all four loop routes, security walkthrough,
keyboard focus, no overflow, and both Starlight color schemes.

## Goal 63 Seed Blueprint

The accepted visual decision allowed `task-715` to materialize this blueprint as
`epic-236` through `epic-240`, `task-730` through `task-742`, and `test-401`
through `test-407`.

### Epic: Shared release-state foundation

- Add `release/public-release.json` in committed `draft` state.
- Add strict shared projection/validation helpers for both Astro sites.
- Fail Vercel production builds on draft override or published/version mismatch.
- Preserve existing preview-wide noindex behavior.

Tests:

- Manifest schema and state validation.
- Draft default and byte-for-byte build immutability.
- Local active preview without manifest mutation.
- Production override fail-closed behavior.
- Published-state/package-version parity fixture.

### Epic: Incremental homepage announcement

- Implement only the selected `prop-7` section after quickstart.
- Use exact accepted copy, CTA, secondary link, and runtime boundary.
- Gate rendering, sitemap/LLM copy, and structured metadata through release
  state.
- Preserve hero, generic quickstart, navigation, and following section.

Tests:

- Draft homepage has no dormant release terms or links.
- Active preview matches selected desktop and 390px hierarchy.
- CTA/link destinations and keyboard/focus order are correct.
- 320px reflow, 200% zoom, reduced motion, forced colors, and no overflow pass.

### Epic: Top-level Loops documentation

- Add the four exact routes and conditional top-level Loops sidebar group.
- Implement purpose-built overview, templates/forks, lifecycle, and security
  walkthrough content.
- Add direct-route unavailable/noindex behavior for draft state.
- Gate sitemap, Pagefind, LLM-facing text, metadata, and navigation.

Tests:

- Draft output and direct routes expose no release content.
- Active preview renders all four routes in desktop/mobile navigation.
- Pagefind and sitemap switch correctly with state.
- Dark/light/auto themes, headings, links, code overflow, and mobile menu pass.

### Epic: Upgrade, reference, and release facts

- Add source-backed upgrade guidance to existing Install surfaces.
- Add dormant v0.5.0 release content to existing Changelog/release-note flow.
- Regenerate CLI reference from descriptors; do not hand-author syntax.
- Keep package and public version facts at 0.4.2 throughout Goal 63.

Tests:

- Generated docs/reference checks pass.
- Draft public output contains no v0.5.0 availability claim.
- Active preview labels target release without claiming npm availability.
- Purpose-built commands parse against current CLI contract.

### Epic: Release-experience verification and closeout

- Extend existing mdkg-dev/docs/SEO/a11y smoke infrastructure for both states.
- Run local desktop/mobile browser review against selected artifact and audit.
- Scan built output for secrets, local paths, dogfood ids, hashes, unsupported
  claims, and dead links.
- Record dormant implementation evidence and return control to Goal 64.

Required implementation-goal checks:

```text
git status --short --branch
npm run build
npm run test
npm run cli:check
npm run cli:contract
npm run docs:check
npm run smoke:mdkg-dev
npm run smoke:mdkg-dev-docs
npm run smoke:mdkg-dev-seo
npm run smoke:mdkg-dev-a11y
node dist/cli.js validate --changed-only --json
node dist/cli.js validate --summary --json --limit 20
node dist/cli.js goal show goal-63 --json
node dist/cli.js goal next goal-63 --json
git diff --check
```

Goal 63 must not push, deploy, publish, tag, globally install, or change the
manifest to `published`.

# Impact

Goal 63 can implement the complete release locally without exposing it. Goal 64
can publish package code first, prove npm consumers, then activate both sites by
changing one manifest field and pushing the website activation commit.

# Risks

- A route that is merely absent from navigation can still leak through sitemap,
  Pagefind, direct access, metadata, or LLM files; built-output tests must cover
  every lane.
- Preview overrides can accidentally become production escape hatches; Vercel
  production must fail closed.
- Hand-written examples can drift from the generated command contract; docs
  checks must parse every command example.
- Conditional route content can leave titles or body text in Pagefind even when
  the visible slot is gated; draft search output must be inspected directly.
- A selected mock may contain illustrative unsupported syntax; implementation
  must use this contract and generated CLI reference, not copy the bitmap.

# Alternatives

- Keep loop pages live but hidden from navigation. Rejected because it leaks
  indexable release content.
- Maintain separate marketing and docs flags. Rejected because they can drift.
- Move release copy into Goal 64 at publication time. Rejected because it
  prevents local browser and accessibility verification before publish.
- Build a general multi-release framework. Rejected as unnecessary for v0.5.0.
- Require all dormant routes to be physically absent. Acceptable but not
  required if direct access returns a generic noindex unavailable state and all
  indexing lanes exclude the content.

# Next Steps

- Execute Goal 63 from `task-730` after Goal 62 closes and the implementation
  goal is explicitly activated.
- Keep the manifest draft and package version 0.4.2 through Goal 63.
- Return verified dormant implementation evidence to Goal 64.
