# QA Checklist: mdkg.dev + docs.mdkg.dev Preview Polish Pass 2

Use this checklist before redeploying or sharing the updated previews.

## Build and Deployment

- [ ] mdkg-dev build succeeds.
- [ ] docs build succeeds.
- [ ] Vercel preview deploys successfully.
- [ ] Production URL assumptions are documented but not falsely claimed.
- [ ] No broken environment-specific links.

## Command Blocks

- [ ] Homepage command blocks preserve newlines.
- [ ] Quickstart command blocks preserve newlines.
- [ ] Docs command blocks preserve newlines.
- [ ] Copy buttons, if present, copy valid commands.
- [ ] `$` prompts are not copied accidentally unless intended.
- [ ] Mobile code blocks do not break the page.

## Navigation

- [ ] Header uses simple `mdkg` text, no logo.
- [ ] Header nav is concise.
- [ ] External links open in new tabs with `rel="noopener noreferrer"`.
- [ ] `/docs` route redirects or uses clean product-facing bridge.
- [ ] Alpha is not overemphasized in primary nav.
- [ ] Footer includes Trust, Alpha, llms.txt, GitHub, npm, Docs.

## Public Copy

- [ ] “Golden loop” is replaced with “Plan → Work → Evidence.”
- [ ] Homepage mentions AI coding agents early.
- [ ] Homepage explains first-run setup separately from operating loop.
- [ ] Homepage includes work node types.
- [ ] Homepage includes low-dependency/local-first posture.
- [ ] Advanced alpha section is concise.
- [ ] Public pages do not mention Starlight/GitBook/preview scaffolding.
- [ ] Public pages do not expose internal launch planning.
- [ ] No claims overpromise autonomous execution, secret safety, or production runtime maturity.

## Docs

- [ ] Docs home is user-facing.
- [ ] Install page emphasizes Node requirement and low-dependency posture.
- [ ] Quickstart tells a coherent story.
- [ ] Work Node Types page exists.
- [ ] Local-first and Low-dependency page exists.
- [ ] Repository Layout page is clear and readable.
- [ ] Generated CLI Reference page is useful even before full generation.
- [ ] Public roadmap is product-oriented.
- [ ] Claims Evidence Matrix is hidden/noindex/internal.
- [ ] Right-hand TOC is useful or hidden on short pages.

## Trust and Safety

- [ ] Trust page states local-first posture.
- [ ] Trust page states mdkg does not host repo data.
- [ ] Trust page states mdkg does not execute work automatically.
- [ ] Trust page states mdkg does not execute skill scripts.
- [ ] Trust page states MCP is read-only in this release.
- [ ] Trust page distinguishes Markdown source, index cache, and optional project DB state.
- [ ] Trust page says raw-marker warnings are not full DLP/secret scanning.
- [ ] Trust page says users should not store secrets/raw prompts/provider payloads in graph nodes.

## SEO and AI Crawlability

- [ ] `/llms.txt` preserves formatting and is useful.
- [ ] Page titles are unique.
- [ ] Meta descriptions are accurate.
- [ ] Open Graph metadata exists.
- [ ] X/Twitter card metadata exists if feasible.
- [ ] Canonical/noindex policy is documented.
- [ ] Preview URLs are noindexed if feasible.
- [ ] Sitemap includes intended routes only.
- [ ] Robots policy matches preview/production intent.

## Accessibility

- [ ] One H1 per page.
- [ ] Semantic headings in order.
- [ ] Buttons and links have accessible names.
- [ ] Focus states are visible.
- [ ] External-link icons are accessible or decorative.
- [ ] Images/diagrams have alt text or accessible text equivalents.
- [ ] Color contrast is acceptable.
- [ ] Reduced-motion preference is respected if animations exist.
- [ ] No information is conveyed only by color.

## Responsive Design

- [ ] Homepage works on phone-sized viewport.
- [ ] Header/nav works on mobile.
- [ ] Docs navigation works on mobile.
- [ ] Code blocks remain readable.
- [ ] Plan → Work → Evidence diagram stacks or scales cleanly.
- [ ] CTA buttons are easy to tap.

## Consistency

- [ ] README top-third aligns with mdkg.dev.
- [ ] npm/GitHub metadata aligns with mdkg.dev.
- [ ] Package version matches docs/site references.
- [ ] Install commands are verified.
- [ ] Product naming is consistent: Markdown Knowledge Graph / mdkg.
