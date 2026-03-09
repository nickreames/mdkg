# mdkg Skills Registry

This repo dogfoods mdkg skills for the primary human + agent loop.

- `select-work-and-ground-context`
  - stage: `stage:plan`
  - writer role: `writer:read-only`
  - purpose: choose the right work item and ground on repo truth before execution
- `build-pack-and-execute-task`
  - stage: `stage:execute`
  - writer role: `writer:patch-only`
  - purpose: build pack-first execution context and return patches/evidence without durable mdkg writes
- `verify-close-and-checkpoint`
  - stage: `stage:review`
  - writer role: `writer:orchestrator`
  - purpose: validate, attach evidence, checkpoint deliberately, and perform the single durable writer action

Use `mdkg list --type skill` to discover metadata and `mdkg show skill:<slug>` to inspect the full procedure.
