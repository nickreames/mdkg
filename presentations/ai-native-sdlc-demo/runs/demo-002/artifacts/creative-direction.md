# Demo 2 creative direction

## Audience and offer

The page is for developers and technical leads already using coding agents who
want project context to survive tool, model, and session changes.

Primary promise:

> Keep the plan when the agent changes.

Supporting promise:

> Give coding agents durable requirements, decisions, and evidence—stored with
> the work.

## Page hierarchy

1. Hero with the continuity promise, public-alpha label, quickstart CTA, and
   feedback CTA.
2. Context-loss problem framed as a handoff problem, not a model failure.
3. Plan -> Work -> Evidence navigation chart.
4. Reusable `goal-1` versus specialized Demo 2 `goal-1`.
5. What completed, why it was done, and what comes next.
6. A bounded “try it on one real project” close.

## Visual system

- Bright light-mode Ocean Flow with paper, mist, deep ink, blue, cyan, and
  teal.
- A navigation chart rather than a terminal: plotted routes, coordinates,
  evidence stamps, dotted grid, and compact graph records.
- Large editorial type and asymmetrical sections, while retaining generous
  whitespace and an obvious reading order.
- Native HTML and CSS only; no image, font, script, or framework runtime asset.
- CSS-only line drift and marker pulse under normal motion. Disable both with
  `prefers-reduced-motion`.

## Proof model

- Source and specialized goals retain local ID `goal-1`.
- Their conditions, authority, work chain, and expected evidence visibly
  differ.
- The page does not teach forking. It labels the two cards “Reusable starting
  specification” and “Specialized execution specification.”
- The completed/why/next section is explicit and does not imply publication.

## Copy boundaries

- mdkg is public alpha and pre-v1.
- mdkg helps keep plans, work, and evidence inspectable in Git.
- Do not claim that mdkg writes code, guarantees agent success, replaces
  prompts, or eliminates context engineering.
- Do not use benchmarks, customer claims, testimonials, logos, or roadmap
  dates.

## Accessibility and responsive behavior

- Deep-ink text on white or mist backgrounds.
- Text links are underlined or visually distinct; buttons have visible focus.
- Semantic landmarks and headings preserve a logical order.
- The route collapses to one column below 760 px without horizontal scrolling.
- Decorative chart elements are hidden from assistive technology.

## Validation risks

- A plotted route can become illegible on mobile; use a linear vertical route
  below 760 px.
- Pale cyan text may miss contrast; reserve cyan for borders, fills, and large
  decorative marks.
- Proof cards can become too dense; keep the contrast to condition, authority,
  and next action.
- Static output must contain no script tag, hydration marker, remote URL, form,
  tracker, or analytics reference.
