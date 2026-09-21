---
id: bug-41
type: bug
title: Prevent configured Git helpers from executing through generic graph observations
status: done
priority: 1
tags: [release-0.6.0, observational-boundary]
owners: [mdkg-project-agent]
links: []
artifacts: [.mdkg/artifacts/goal-86/observational-boundary-reproductions.json, .mdkg/artifacts/goal-86/bug-41-local-verification.json]
relates: [bug-38, bug-35, test-484]
blocked_by: [bug-39]
blocks: []
refs: [dec-96, test-484, task-828, bug-43]
context_refs: [goal-86, goal-84]
evidence_refs: [chk-613]
aliases: []
skills: []
created: 2026-09-15
updated: 2026-09-15
---
# Local Verification - 2026-09-15

Local implementation accepted under chk613:1,474 discovered source tests pass,
and one225-file intermediate tarball passes726 installed cases on each required
Node24.15.0/24.18.0/26.0.0 runtime on macOS arm64. Three independent candidate
review hypotheses and its missing-HEAD question were parent-reproduced and
corrected. Source/package inputs remained frozen through the final proof.
The shared helper preserves effective configuration, exact porcelain paths and
safe Boolean/unused-filter behavior without executing configured helpers.

This is not final0.6.0, Linux, Standard scan, task828, coverage-floor, full-ladder
or artifact-seal acceptance. Goal86 remains NOT_READY and Goal85 stays paused.
Bug43 separately records pre-existing changed-warning path loss reproduced on
current and published0.5.2; it is not silently included as a fixed Bug41 case.
Bug42 is the next routed work. Protected state and all earlier dirty custody
are preserved; no staging, commit, remote or publication action occurred.

The following sections retain the original intake and remedy contract.

# Overview

Goal: make generic graph Git observations respect the accepted no-helper-execution
boundary. Owner is mdkg-project-agent. Bug38 completed this boundary for git
inspect; this successor covers other observational consumers without reopening
or rewriting its earned evidence. Bug35 fixes optional index bookkeeping only.

Both current and retained published 0.5.2 status execute a configured synthetic
fsmonitor hook that writes a marker, even when optional Git locks are disabled.
The current git inspect control does not execute the hook; published inspect does,
as already recorded by Bug38. Functional publication blocker; exploit severity
and external credential exposure are not established by this local reproduction.

# Reproduction Steps

1. Copy an owned synthetic graph/Git repo; install a fixture-only fsmonitor hook
   that writes one marker and returns a valid fixture token.
2. Set only that repository's core.fsmonitor and hook version through native Git.
3. Run status --json with GIT_OPTIONAL_LOCKS=0. The command succeeds and the marker
   is created on both retained published0.5.2 and the current built executable.
4. Run git inspect --json in a separate identical copy. Current inspection leaves
   no marker; the older executable reproduces the historical Bug38 boundary.

# Expected vs Actual

- Expected: observational CLI commands do not launch configured fsmonitor or
  content-filter helpers, and failed or refused status cannot become false-clean
  evidence. Ordinary safe observations and intentional graph writes still work.
- Actual: optional-lock suppression does not disable fsmonitor. Other helpers
  lack the specific defensive behavior already implemented for git inspect.

# Suspected Cause

src/commands/status.ts and separate child/bundle/validation/repair Git observation
helpers call status without the existing git inspect fsmonitor/filter guard.
The fsmonitor case is reproduced; assess each content-filter and failed-status
path before claiming its exposure or remedy. Reuse existing hardening rather than
inventing a new consumer-specific Git wrapper or trust framework.

# Fix Plan

Allowed: existing observational Git helpers and directly necessary generic
internal safety extraction, tests and sanitized mdkg evidence. Disable fsmonitor
per subprocess; extend the existing active-filter refusal/fail-closed policy
where reproduced, retaining truthful unknown/failure diagnostics and safe commands.
Do not introduce remote/auth probes, Git mutation commands, global configuration
changes, blanket filter disabling that falsely normalizes content, or implicit
permission from a clean receipt. Preserve Bug17 transport and Bug35 bookkeeping.

Execute after Bug39, before draft package inputs and installed acceptance freeze.
No external action, canonical graph migration/bundle refresh, consumer change,
publication or history mutation. Exact-path local commits remain separately reviewed.

# Test Plan

Synthetic fsmonitor and active/unused clean/process filters across root, registered
child, linked-worktree and submodule contexts; malformed/failing status must not
produce false-clean success or leak raw helper output. Trap Git/auth/remote effects,
assert complete fixture bookends and unchanged indexes/staging, plus retained
normal commands and graph mutation controls. Preserve published-version
assessment per case. Installed test479/484 and independent task828 reverify the
final candidate on the required macOS/Linux/runtime matrix; no missing proof waiver.

# Links / Artifacts

- .mdkg/artifacts/goal-86/observational-boundary-reproductions.json
- Bug38 original receipts remain historical achieved evidence for git inspect.
- Fresh Standard coverage remains task837; intake is not a security scan.
- New skill candidates: none. This is generic enforced CLI behavior.
