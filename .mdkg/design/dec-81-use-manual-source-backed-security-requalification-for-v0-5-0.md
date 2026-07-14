---
id: dec-81
type: dec
title: Use manual source-backed security requalification for v0.5.0
status: accepted
tags: [security, release, v0.5.0, requalification]
owners: []
links: []
artifacts: []
relates: [goal-69, goal-64, task-776, test-434, test-389]
refs: [edd-75, dec-80, chk-509, chk-510]
aliases: []
created: 2026-07-12
updated: 2026-07-12
---
# Context

The initial v0.5.0 repository audit retained 51 reportable candidates: 5 high,
28 medium, and 18 low. Goal 69 implemented fixes and direct regressions for
every candidate, then added a source-controlled exact-set verifier and completed
the full local prepublish and installed-package release ladder.

The original closeout contract also required a second Codex Security plugin
scan. Two setup attempts timed out without a scan starting. The operator then
explicitly directed that no second scan is required and requested a manual
source-backed confirmation of the initial fixes.

# Decision

For this v0.5.0 release only, replace the second plugin scan with an explicit
manual requalification of the original findings.

Manual requalification is sufficient only when all of the following are true:

- The canonical matrix still contains exactly 51 unique rows with the original
  5 high, 28 medium, and 18 low severity inventory.
- Every row names one completed owner task, an affected source sink, durable fix
  evidence, and one or more existing direct regression tests.
- The verifier fails on missing, duplicate, unresolved, severity-drifted, or
  absent-test rows.
- A manual source review confirms the implemented control for each finding
  family rather than trusting task status alone.
- Focused security regressions, the complete package suite, publish readiness,
  package dry-run, publish dry-run, and isolated installed-package probes pass.

This decision changes the verification method, not finding disposition. None of
the 51 findings is waived, suppressed, or removed.

# Alternatives considered

- Run a second Codex Security plugin scan. Rejected by explicit operator
  direction after repeated setup timeouts.
- Keep Goal 64 paused indefinitely. Rejected because the exact original set has
  complete source, regression, packaging, and manual review evidence.
- Waive the original findings. Rejected; every original row remains fixed and
  directly tested.

# Consequences

- task-776 and test-434 close on manual requalification evidence.
- Goal 69 can close after Goal 64 routing is revalidated.
- Goal 64 may resume at task-719 once test-389 is rechecked.
- Future releases are not automatically exempt from independent scanning.
- The residual risk is that manual review may miss a new variant outside the
  original finding families; normal CI, advisories, release checks, and
  post-release fix-forward policy remain in force.

# Links / references

- goal-69, goal-64, task-776, test-434, test-389
- security/v0.5.0-remediation-matrix.json
- scripts/verify-security-remediation.js
- chk-509, chk-510
