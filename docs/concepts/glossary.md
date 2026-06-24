# Glossary

Common mdkg terms used in public docs.

## Graph

The repo-owned Markdown and frontmatter nodes under `.mdkg/`.

## Work node

A goal, task, test, spike, bug, feature, checkpoint, or related node that can be indexed, searched, shown, packed, and validated.

## Goal

An umbrella work node that scopes executable work, required checks, active-node routing, and closeout evidence.

## Spike

An actionable research work node. Spikes organize research questions, sources, tradeoffs, recommendations, and follow-up work without automatically searching the web or generating files.

## Checkpoint

Evidence recorded at a meaningful point in the work. Good checkpoints include commands run, pass/fail state, known warnings, boundaries, and follow-up refs.

## Pack

A deterministic context artifact built from graph state for humans or agents.

## Handoff

A sanitized transfer prompt that summarizes current state, boundaries, evidence, required checks, and next action.

## `scope_refs`

Executable work scope for a goal or node. These refs can route next work.

## `context_refs`

Background information that informs work but is not automatically actionable.

## `evidence_refs`

Proof supporting current state, such as checkpoints, receipts, audits, archives, and artifacts.

## Generated cache

Rebuildable outputs such as indexes, packs, command contracts, and docs references. Generated caches should not become hidden authority.
