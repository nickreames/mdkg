# Goal86 local Ubuntu qualification continuation

Goal: fill missing Linux ARM64 and emulated AMD64 installed-candidate evidence
under Test487, reusing the exact retained 6154e4ea920bfa09 artifact. Nick approved
the existing local Docker executor for final pre-publication gates. This is not
publication authority or a change to the generic mdkg runtime.

Context: canonical main 36e075b8d64babff04154704a721db4a82926ebe, 245 accepted
unstaged paths, unchanged protected selection/runtime/Demo3/public-release
hashes and no transient mutation lock at re-inventory. Supported Goal86 claim
is Test487, owner mdkg-project-agent. Earlier local ARM64/ext4 subset evidence
remains separate from Docker's LinuxKit kernel/overlayfs evidence.

Boundaries: explicit local Docker Unix socket only. Disposable uniquely named
and labelled containers/images; no unrelated container, VM, image or volume
cleanup. Pinned official Ubuntu index; public anonymous runtime downloads with
official checksum verification. No host mounts, forwarded credentials, Docker
socket mounts, privileged containers, host/global installs or configuration.
Network is available only for isolated dependency setup; test execution uses
network none, non-root uid10001, dropped capabilities and no-new-privileges.
Canonical source/package bytes, old receipts and drivers remain unchanged.

Evidence design: transfer a hash/mode allowlist of current package inputs,
qualification infrastructure, compiled inert test drivers and retained package.
No canonical work graph, runtime DB, events, Git metadata, raw security reports
or consumer payloads. Port only fixture npm paths, input-capture provenance and
platform labels into separate capsule copies; preserve case assertions and
record both original and derivative hashes. Do not silently reuse stale
qualification captures. Exact candidate admission and input checks run before
and after each family. Unsupported runtime controls use real Linux binaries.

Done when: missing rows have explicit pass/fail/unverified evidence bound to
image/runtime/candidate identities, failures remain visible, owned executors
are removed after diagnostics are captured, and protected bookends match.
Independent security acceptance, full package ladder/coverage and final sealing
remain separate gates. Bugs46/47 stay deferred/unresolved, Windows unqualified,
Goal85 paused. No new skill candidate.

## Execution observations and bounded harness amendments

Ubuntu24.04.4 is the container userspace; the verified local engine uses the
LinuxKit kernel. ARM64 execution is native to the ARM64 host. x86_64 execution
uses the existing Rosetta environment, visibly invoking Node with `--no-opt`
and its existing `/proc/.reset` preload. Neither was modified. This does not
establish native x86_64 performance or an Ubuntu host-kernel support claim.

The initial runtime family could not load Node26 because the isolated image
lacked libatomic.so.1. This was an executor setup failure before mdkg admission,
not a product refusal. Image-only libatomic1 installation corrected the loader;
the runtime family alone was rerun on both architectures. The19 expected safe
controls and two known unsupported old-init observations are counted separately.

A bounded independent read-only review prompted semantic read-only assertions,
corrected derivative platform labels, explicit outer-failure/unverified reporting,
and focused installed capability/umask controls. The supplement has a new capsule
identity. Passing original families do not inherit newer assertions. A later
runner-only correction initializes failed rows before stream persistence and
rejects progress-only JSON as final success; five isolated synthetic fault controls
verify that accounting. No product payload changed, and these controls are not
independent security acceptance. Real read-only observations cover warm/fresh
indexes; the cold-cache/read-only cross-product is not claimed.

The x86_64 representative scale family failed at its existing600000ms command
allowance during SQLite-backed v2 migration. Six earlier scale observation rows
completed, including JSON v2 migration; they do not establish the uncompleted
SQLite v2, bound/history and goal-routing rows. Native ARM64 completed all15
scale/routing cases. Preserve the failure and timing evidence; do not silently
raise the allowance, shrink the fixture, change product behavior, or mark the
uncompleted rows passed. This timing result alone does not confirm a new product
defect. Other family execution and final gates remain independently accountable.

## Reviewed selective emulation retry

The timeout is a repository qualification guard, not a product acceptance SLA.
After source review, one bounded harness-only retry was prepared under the
already approved local qualification scope. The helper's default remains
180000ms; an explicitly selected allowance is capped at900000ms. The retry
selects only SQLite for the2000-task scale matrix, then retains the unchanged
default bounds, history refusal and all four goal-routing combinations.
No product assertion, graph size, node limit, package input or runtime behavior
changed. Eighteen focused helper tests pass. Independent bounded read-only
review found no substantive launch issue; actual successful subset composition
must still be checked from the retry receipt.

Expected acceptance is11 newly executed rows plus the four JSON scale rows
from the original failure record. The two original SQLite legacy rows must not
be counted twice. Original timeout evidence stays intact. A separate capsule
binds the changed qualification helper/test inputs; unchanged package and other
family evidence are not invalidated by this non-shipping harness-only change.
