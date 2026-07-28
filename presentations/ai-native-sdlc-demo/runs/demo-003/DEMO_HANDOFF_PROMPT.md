# Demo Handoff Prompt

Use this state-neutral prompt for an agent working in a materialized run.
Replace `<run-root>` with the explicit run directory.

```text
You are executing goal-1 in a forked mdkg website-demo run. Do not rely on
hidden chat context, prior run state, or unqualified mdkg commands.

First run:

mdkg --root <run-root> validate --json
mdkg --root <run-root> goal next goal-1 --json
mdkg --root <run-root> pack spike-1 --profile concise \
  --edges context_refs,evidence_refs --skills auto --dry-run --stats

Inspect README.md, RUN_BINDING.json, CHILD_INTERFACE.json,
IMMUTABLE_CHILD_CONTRACT.json, DESIGN.md, WEBSITE_DEMO_TEMPLATE_BRIEF.md,
CREATIVE_PRODUCTION_INTAKE.md, prd-2, edd-1, dec-1, dec-2, and chk-3.
Verify that the binding, semantic source release, child interface, and authored
contract seal match before starting work.

For every selected node:

1. claim it with:
   mdkg --root <run-root> goal claim goal-1 <node-id> --json
2. start it with:
   mdkg --root <run-root> task start <node-id> --json
3. build its standard full-skill execution pack;
4. execute only that node and run its required checks;
5. close it with the structured task lifecycle;
6. run:
   mdkg --root <run-root> goal evaluate goal-1 --json
7. continue with:
   mdkg --root <run-root> goal next goal-1 --json

Use spike-1 to choose and record a compact public-safe audience, offer,
structure, visual direction, CSS-only motion, static proof, asset, and claims
plan within the immutable binding constraints. Do not rewrite authored goal,
design, work, test, skill, or operator content to specialize the run.

Build one complete portable DemoOutput.astro with static Astro and Ocean Flow.
Emit semantic HTML and CSS with zero client-side JavaScript. Do not use client
directives, hydration, inline or external runtime scripts, remote fonts,
analytics, forms, trackers, or third-party runtime assets. Use warm existing
dependencies only; do not install new packages during a timed run.

Continue through local validation, caller-owned canonical integration,
canonical validation, authority-gated publication, exact-SHA deployment
verification, public route verification, and an accepted execution checkpoint
when—and only when—the caller supplies valid matching authority receipts.
Integration and publication topology does not grant authority. Fail closed on
missing or drifted authority, force/history requirements, unrelated changes,
provider mutation, or an enumerated hard blocker.

Build shared output once and run shared-output checks serially. Record compact
deterministic receipts. Keep raw prompts, secrets, provider payloads,
credentials, private context, cookies, and bulky traces out of all files.
```
