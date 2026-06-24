---
id: prd-10
type: prd
title: pass-5 launch-ready public-alpha polish requirements
tags: [mdkg-dev, public-alpha, launch-ready, pass-5]
owners: []
links: [https://mdkg-dev.vercel.app/, https://mdkg-docs.vercel.app/]
artifacts: [archive://archive.mdkg-dev-preview-audit-pass-5-2026-06-24]
relates: []
refs: [archive://archive.mdkg-dev-preview-audit-pass-5-2026-06-24]
aliases: []
created: 2026-06-24
updated: 2026-06-24
---
# Problem

The current previews are good enough to review, but not yet launch-ready. The pass-5 audit identifies credibility gaps that compound for first-time users: preview docs CTAs point at future production domains, Starlight navigation is noisy, command examples need validation, first-success outputs are not explicit enough, and the public surface still contains some meta commentary and maintainer-facing language.

# Users

- Developers evaluating mdkg as a local-first project memory CLI.
- AI coding agents using docs, `llms.txt`, and command examples to operate safely.
- Maintainers reviewing preview deployments before DNS/public launch decisions.
- Orchestrators comparing local docs proof to hosted Vercel previews.

# Goals

- Make the marketing and docs previews credible, copy-safe, and self-explanatory without private context.
- Turn "Plan -> Work -> Evidence" into a clear operating model supported by concrete commands and expected outputs.
- Document docs/preview URL behavior honestly until DNS is live.
- Add enough automated and manual QA gates to avoid regressing accessibility, links, metadata, command examples, and agent-readable files.

# Requirements

- Preview docs CTAs must target the Vercel docs preview until `docs.mdkg.dev` is live.
- Public command examples must be executable or explicitly marked illustrative.
- Docs must include first-success expected outputs, no-work-yet handling, troubleshooting, frontmatter examples, common mistakes, and generated reference guidance.
- Homepage must be tighter, less repetitive, and more conversion-oriented while staying low-hype.
- `llms.txt` and `llms-full.txt` must be plain-text friendly and useful to agents.
- Accessibility, performance, reduced-motion, high-contrast, noindex/canonical, link, and asset budgets must have measurable proof.
- GitHub metadata changes remain copy-ready handoff only.

# Non-Requirements

- No DNS, production promotion, analytics activation, npm publish, git tag, or public-launch announcement.
- No generated image/video assets are required.
- No Vercel secret/token material is stored in mdkg or public docs.

# Success Metrics

- Local and hosted previews pass the pass-5 smoke suite.
- Browser/Chrome desktop, tablet, and mobile checks show no blocking layout, navigation, console, or accessibility issues.
- Vercel deployment/log verification matches the pushed commits.
- Final checkpoint clearly identifies any deferred launch-side-effect work.

# Non-goals

# Acceptance Criteria

# Metrics / Success

# Risks

# Open Questions
