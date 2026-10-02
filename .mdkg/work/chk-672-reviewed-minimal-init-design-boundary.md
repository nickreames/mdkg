---
id: chk-672
type: checkpoint
title: Reviewed minimal init design boundary
status: review
priority: 1
tags: [cloud-planning, design-only]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-88/design-proposal.md, .mdkg/artifacts/goal-88/baseline-init.json, .mdkg/artifacts/goal-88/checks.json, docs/cloud-goal88-experiment.md]
relates: []
blocked_by: [task-844]
blocks: []
refs: [goal-88]
context_refs: [edd-83]
evidence_refs: []
aliases: []
skills: []
scope: [task-844]
created: 2026-10-02
updated: 2026-10-02
checkpoint_kind: review
---

# Summary

Task844's actual baseline audit and concrete migration proposal are available
for review. Design acceptance remains PENDING_NICK_REVIEW. The required
compatibility/removal choice has not been supplied; this record does not claim
approval or unblock task845.

# Scope Covered

task-844 under goal-88 and edd-83.
Depends on task-844. Implementations remain sequential and separately authorized.

# Decisions Captured

See .mdkg/artifacts/goal-88/design-proposal.md for the exact path inventory,
preservation/refusal and retained-original backup proposal, bounded mirror
admission gaps, owned implementation paths, and future installed acceptance.
The proposal retains verified startup redirects throughout 0.6.x and retires
only exact generated CLAUDE after trusted release proof and safe references.
The alternative keeps all existing legacy instructions in 0.6.1. Neither choice
is claimed accepted. Nick's new instruction authorizes the sequential cloud
implementation stack before PR10 merge; renewed Run/merge permission is not
needed to implement once this design choice is resolved.

# Known Issues / Follow-ups

The current instruction supersedes the plan-merge gate and provides the narrow
cloud implementation exception to local git-gud. The local prerequisite and
unknown Mac/concurrent aliases remain integration concerns; no new IDs were
allocated and no Mac access or history rewrite occurred.
goal-87 deferred filesystem limits and epic-257 hosted qualification remain
separate honest gaps. This checkpoint currently provides no implementation pass.

# Implementation Summary

Audit task844 has begun; source/tests/init assets/package metadata remain
unchanged from ddafe0836fdc790cd36ba203afbcfc1878bbddd8. This checkpoint is
not an implemented 0.6.1 candidate. Task845/846/test494/task847 and chk673/674
remain unmet. Goal88 is open and NOT_READY.

# Verification / Testing

PASS: supported build and test compilation; 219 focused baseline cases in ten
families (zero failures/skips); 32 audited source-built synthetic invocations;
CLI matrix/contract, workflow drift, docs499examples/0failures, graph0errors,
and 8-skill validation. Nested/case mirror target admission gaps are observations,
not passing future acceptance. Exact commands and input/log hashes are retained
in checks.json. Full candidate tests/coverage, installed0.6.1 acceptance and
release/platform/security qualification are NOT_RUN. Prior full-CI failures and
unclassified causes remain unresolved; no coverage/timeouts were weakened.

# Links / Artifacts

edd-83; docs/cloud-planning-experiment.md (historical); the actual current
artifacts listed above and docs/cloud-goal88-experiment.md.
