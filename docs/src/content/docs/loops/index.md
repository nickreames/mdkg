---
title: Loops
description: Durable reusable processes that coordinate goals, readiness, evidence, blocker recovery, and closeout in an mdkg graph.
---

Loops are a first-class mdkg node type for work that must keep making progress
across more than one goal, lane, decision, or attempt. They are available in the
v0.5.0 **Pre-v1 public alpha** release experience.

Use a loop when the process itself should be reusable and inspectable: a
security audit, design review, test-infrastructure review, or another workflow
with a high definition of done.

> mdkg preserves and validates the process. Codex, Claude Code, or another
> coding-agent harness executes agents and tools.

## Goals and loops

| | Goal | Loop |
| --- | --- | --- |
| Primary concern | Reach one outcome | Run a durable process to a high definition of done |
| Typical scope | Tasks, tests, bugs, and supporting context | Multiple goals plus evidence lanes, decisions, approvals, attempts, and outputs |
| Reuse | Usually project-specific | Can be used directly, forked from a bundled template, or specialized for a scope |
| Blockers | May stop when its scoped work cannot proceed | Continues other authorized lanes and blocker-recovery work before the whole loop blocks |
| Closeout | Goal condition and required checks are satisfied | Every required lane is complete or explicitly waived with identity-matched evidence |

A goal remains the right choice for an outcome such as "ship account export."
A loop is the better choice for a process such as "audit the repository's
security posture, triage every finding, and account for every required evidence
lane."

## One node type, several roles

`loop` is one node type. A loop can act as:

- a reusable template under `.mdkg/templates/loops/`;
- a scoped loop forked for a repository, folder, or goal; or
- a run-bearing loop whose `run_refs`, evidence, decisions, and outputs preserve
  execution history.

These roles come from metadata and graph links. mdkg does not create separate
`loop_template` or `loop_run` node types.

Fork lineage records the template identity and content hash. If the source
template changes later, mdkg reports the fork as stale; it does not silently
rewrite project-specific state.

## Operating modes

`loop_mode` describes the permissions expected by the process. It does not turn
mdkg into a hosted runtime.

| Mode | Intended boundary |
| --- | --- |
| `readonly` | Inspect source and create mdkg evidence, without functional source changes |
| `planning` | Research, compare options, record decisions, and create future work |
| `patch_proposal` | Prepare reviewable change proposals without applying them automatically |
| `write_with_approval` | Allow specific writes only after the required approval evidence exists |
| `autonomous_local` | Permit explicitly scoped local work while push, publish, deploy, and provider actions remain separately controlled |

The loop's `pre_approved_actions`, `approval_gated_actions`, and
`prohibited_actions` are the effective operating contract. A mode name never
overrides those fields.

## The loop lifecycle

1. [Choose a template or create a raw loop](/loops/templates-and-forks/).
2. Fork it for a concrete scope and inspect its readiness questions.
3. Bind accepted decisions and approvals by identity.
4. Pack the loop and give that context to a coding-agent harness.
5. Use mdkg to [route authorized work and inspect evidence](/loops/readiness-routing-evidence-closeout/).
6. Close only when required evidence lanes are complete or explicitly waived.

Start with the [read-only security audit walkthrough](/loops/security-audit/) for
a complete, purpose-built example.

## Command discovery

Use the CLI itself for the current command contract:

```bash
mdkg loop --help
mdkg loop list
```

The [generated CLI reference](/reference/generated-cli-reference/) remains the
syntax authority for all flags and machine-readable output.

## Safety boundary

Loops do not launch agents, run models, call security providers, or grant
permissions by themselves. The graph records purpose, scope, readiness,
authorized actions, evidence, and closeout state. The operator and execution
harness remain responsible for tool use, sandboxes, model routing, and external
approvals.
