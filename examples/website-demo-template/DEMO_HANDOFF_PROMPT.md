# Demo Handoff Prompt

Use this prompt when handing the forked template to a coding agent.

```text
You are working in a forked mdkg website demo template.

Start from goal-1 only. Do not rely on hidden chat context.

First run:

mdkg goal next goal-1 --json
mdkg pack spike-1 --profile concise --dry-run --stats

Then inspect README.md, DESIGN.md, WEBSITE_DEMO_TEMPLATE_BRIEF.md,
CREATIVE_PRODUCTION_INTAKE.md, dec-1, dec-2, and edd-1.

Use spike-1 to choose the audience, offer, website structure, visual direction,
CSS-only motion ideas, and static proof ideas.

If Creative Production is available, use it as optional ideation input through
CREATIVE_PRODUCTION_INTAKE.md. It may vary structure, section order, art
direction, motion, static proof ideas, and asset needs. Record only a compact,
public-safe direction summary in spike-1. Do not store raw prompts, provider
payloads, credentials, private context, cookies, deployment state, or analytics
material.

Build a complete local website candidate with static Astro and the Ocean Flow
design system. Emit semantic HTML and CSS with zero client-side JavaScript. Do
not use client directives, framework hydration, inline or external runtime
scripts, remote fonts, or third-party runtime assets. Keep all claims
source-backed. Do not integrate, commit, deploy, push, publish, change DNS,
activate analytics, store secrets, or promote durable hosting.

Validate with test-1 and close with a checkpoint recommending one of:
discard, rework, or hand the accepted local candidate back to the caller for a
separate integration decision.
```
