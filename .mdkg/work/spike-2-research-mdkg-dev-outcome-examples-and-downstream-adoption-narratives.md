---
id: spike-2
type: spike
title: research mdkg.dev outcome examples and downstream adoption narratives
status: done
priority: 2
epic: epic-80
parent: goal-15
tags: [mdkg-dev, examples, downstream, spike]
owners: []
links: []
artifacts: []
relates: []
blocked_by: []
blocks: []
refs: []
aliases: []
skills: []
created: 2026-06-15
updated: 2026-06-15
---
# Research Question

Which public examples should `mdkg.dev` ship first, and how should downstream
repo adoption narratives stay dry-run-first and no-cross-repo-mutation by
default?

# Context And Constraints

- mdkg already has many smoke scripts. Public examples should reuse those
  command paths rather than inventing copy-only snippets.
- Downstream repos should not be mutated from docs. Adoption material should
  show `mdkg upgrade --dry-run`, graph validation, and explicit user approval
  before apply.
- Website implementation is deferred; this spike produces backlog and example
  contracts only.

# Search Plan

- Review current smoke scripts and README workflows.
- Use docs best-practice framing from Diataxis: examples and tutorials should be
  separate from reference.
- Use Google helpful-content guidance to prioritize original, useful examples
  over generic checklists.

# Findings

- Best first examples are the workflows that already have temp-repo or packed
  smoke proof: init/validate/status, goal loop, spike lifecycle, SPEC/WORK
  invocation, local queue bridge, snapshot policy, command-doc generation, and
  subgraph audit/upgrade planning.
- Downstream narratives should be story-shaped: "inspect current graph",
  "preview upgrade", "review changed managed assets", "apply", "validate", and
  "record handoff evidence".
- Examples should expose both human-readable and JSON command paths where
  automation matters.
- Public examples must avoid pretending mdkg executes work. `work trigger`
  creates mirrors/orders and optional queue delivery; it does not run a worker.

# Options And Tradeoffs

- Many small examples: easier to validate and search, but can feel fragmented.
- One narrative tutorial: easier to learn, but harder to keep current and test
  comprehensively.
- Example gallery backed by smoke manifests: strongest correctness story, but
  requires additional docs-generation plumbing.

# Recommendation

Ship an example ladder:

1. Fresh repo: `init --agent`, `index`, `validate`, `status`, `doctor`.
2. Planning loop: `new goal`, `new spike`, `goal claim`, `task done`.
3. Context handoff: `pack`, `search`, `show`, visibility-safe output.
4. SPEC/WORK: create reusable capability, trigger order, verify receipt.
5. Project DB: queue create/enqueue/claim/ack and snapshot queue policy.
6. Downstream adoption: dry-run upgrade, apply only after review, validate.

Each example should have a smoke owner or explicit "not yet launchable" marker.

# Follow-Up Nodes To Create

- `task-356`: map each guide/example to a smoke script or a new example smoke
  requirement.
- `test-148`: require public examples to execute in fresh temp repos before
  launch.
- `task-359` and `test-150`: include downstream dry-run upgrade narratives and
  no-cross-repo-mutation proof.
- `task-370` and `test-157`: record example proof and claim evidence.

# Skill Candidates

- Example-from-smoke skill: turn a smoke script into public docs without hiding
  setup, expected JSON, or failure modes.
- Downstream upgrade handoff skill: produce a dry-run-first prompt for child
  repos with no implicit mutation.

# Data Structures And Algorithms Notes

- Maintain an example manifest keyed by `example_id`, `commands`, `smoke_script`,
  `requires_network`, `writes_paths`, `expected_outputs`, and `docs_pages`.
- Example verification can diff command outputs semantically for stable fields
  while redacting temp paths.

# UX Notes

- Examples should show the exact next command after every receipt.
- JSON examples need field callouts for automation users; prose-only examples
  are not enough for agent orchestration.

# Security Notes

- Redact temp paths and never include token, npm auth, git remote credentials,
  or private repo names in public examples.
- Downstream docs must say root orchestration cannot mark child work complete
  without child receipts.

# mdkg.dev Launch Implications

- Public docs should launch with fewer, stronger examples rather than a large
  untested gallery.
- Downstream migration automation remains deferred; publish only dry-run-first
  narratives now.

# Evidence And Sources

- Local evidence: `scripts/smoke-init.js`, `scripts/smoke-goal.js`,
  `scripts/smoke-spike.js`, `scripts/smoke-work-invocation.js`,
  `scripts/smoke-db-queue-cli.js`, `scripts/smoke-subgraph.js`.
- Diataxis documentation framework: https://diataxis.fr/
- Google helpful content guidance:
  https://developers.google.com/search/docs/fundamentals/creating-helpful-content
