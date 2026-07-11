---
title: Run A Read-Only Security Audit Loop
description: Fork the bundled security audit, resolve readiness, pack it for a coding-agent harness, and preserve evidence without functional source changes.
---

This walkthrough uses the bundled `security-audit` template to create a
purpose-built, read-only audit process for a repository. It is part of the
v0.5.0 **Pre-v1 public alpha** release experience.

The loop preserves scope, permissions, evidence lanes, decisions, and closeout
state. It does not launch a security scanner or agent.

## 1. Inspect the template

Start by reviewing the catalog and template contract:

```bash
mdkg loop list
mdkg loop show security-audit
```

The template includes source review, credential and secret exposure, dependency
advisories, public exposure, package surfaces, and finding triage. Some lanes
may be scope-dependent, but every required lane must be completed or explicitly
waived before closeout.

## 2. Preview the fork

Plan a fork for the current repository before writing anything:

```bash
mdkg loop fork security-audit --scope . --dry-run --json
```

The output is larger than this purpose-built excerpt. The important fields are:

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

Dry-run is observational. It writes no loop files, child nodes, events, index
state, filesystem output, or SQLite reservations. If no other writer changes
the graph, the real fork receives the same available identities.

## 3. Create the scoped loop

Run the same fork without `--dry-run`:

```bash
mdkg loop fork security-audit --scope . --json
mdkg loop plan LOOP_ID --json
```

Replace `LOOP_ID` with the id returned by the real fork. The readiness
projection identifies four unanswered questions:

```json
{
  "questions": {
    "unanswered_pre_run_questions": [
      "external_advisory_checks_approved",
      "security_provider_workflow_approved",
      "local_cache_writes_approved",
      "audit_scope"
    ]
  }
}
```

## 4. Resolve readiness by identity

Create an accepted decision through the normal mdkg workflow. In the decision,
record these example choices:

- audit scope: the local repository;
- functional source changes: prohibited;
- local cache writes from tests and builds: approved;
- external dependency advisory calls: not requested;
- external or multi-agent security-provider workflow: not requested.

For example:

```bash
mdkg new dec "Authorize the local read-only security audit" --status accepted --json
```

mdkg intentionally has no special "answer loop question" command. Edit the
scoped loop frontmatter and bind every question identity to the accepted
decision returned above:

```yaml
question_answer_refs:
  - external_advisory_checks_approved=DECISION_ID
  - security_provider_workflow_approved=DECISION_ID
  - local_cache_writes_approved=DECISION_ID
  - audit_scope=DECISION_ID
```

Replace `DECISION_ID` with the accepted decision id. Keep
`external_advisory_checks` and `security_provider_workflow` out of
`requested_actions` for this local example. They remain available only as
approval-gated options and do not become authorized implicitly.

Recheck the projection:

```bash
mdkg loop plan LOOP_ID --json
```

Read `unanswered_pre_run_questions`, `pending_approval_actions`,
`invalid_bindings`, and `closeout.missing` before proceeding.

## 5. Pack for an execution harness

Build bounded context for the loop:

```bash
mdkg pack LOOP_ID --profile concise
```

mdkg does not launch the audit. Give the resulting pack to Codex, Claude Code,
or another coding-agent harness that follows the repository's
`pursue-mdkg-loop` skill.

For this loop, **read-only** means:

- functional source, documentation, template, generated-command, and runtime
  changes are prohibited;
- source inspection, local static analysis, and approved local tests/builds are
  allowed; and
- the harness may create mdkg findings, spikes, proposals, tasks, tests,
  decisions, checkpoints, waivers, receipts, and evidence.

External registry advisory checks or security-provider workflows remain
approval-gated because they may disclose repository or dependency metadata.

## 6. Route authorized work

Ask mdkg which linked lane is useful and authorized next:

```bash
mdkg loop next LOOP_ID --json
```

`loop next` routes work; it does not execute or claim it. The harness should
pursue the selected child, record evidence, and ask again. When one branch is
blocked, it should create a source-grounded spike, compare at least three viable
options in a proposal, recommend a path, record blocker evidence, and continue
other authorized lanes.

The entire loop is blocked only when no authorized child work, evidence path,
or blocker-recovery path remains.

## 7. Inspect evidence and closeout

Inspect linked run and evidence refs:

```bash
mdkg loop runs LOOP_ID --json
mdkg loop plan LOOP_ID --json
```

The loop closes only when every required lane has identity-matched evidence or
an explicitly accepted typed waiver. Creating remediation tasks for future work
does not, by itself, complete an audit lane.

## Public example boundary

This walkthrough uses placeholders instead of real project ids, local paths,
template hashes, provider ids, or dogfood receipts. Only the commands shown in
the numbered steps are part of the workflow.

Next, read [readiness, routing, evidence, and closeout](/loops/readiness-routing-evidence-closeout/)
for the complete state model, or use the [generated CLI reference](/reference/generated-cli-reference/)
for exact syntax.
