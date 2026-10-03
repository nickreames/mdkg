# Goal90 validation plan

This is bounded implementation/draft evidence, not pre-merge or prepublication
acceptance. No future test result is asserted by this plan.

1. Baseline: freeze PR12 head, all worktree custody, selected state and versions;
   run existing CLI option, root/path, identity, working-storage and guidance
   controls in an owned clean TMPDIR under the retained subreaper. Retain actual
   failures separately. Avoid the known unbounded cloud full-test failure mode.
2. Registry: preview/apply/unregister controls; no implicit init; unknown names,
   malformed or changed binding; copied identity/default/registered collisions;
   links, case/Unicode/traversal/nesting/mirror overlap; stale hashes, active host
   lock, changed ignore metadata and interrupted ignore-before-registry ordering.
3. Dispatch: parameterize all concrete command families, both CLI entrypoints
   and MCP. Invalid names must fail before config/output/subprocess/cache writes.
   Named success controls must use only selected roots. Help/version must perform
   no graph/registry reads and global contract must include the selector.
4. Storage: same numeric aliases with separate identity/config/index fingerprints,
   IDs/reservations/locks, events/goal/loop state, DB/queues/snapshots, scratch,
   archive/pack/bundle and canonical/mirrored skills. Foreign/copied working
   binding refuses; no automatic migration or copying.
5. Privacy/scale: tracked small team root plus ignored large synthetic private
   root; filesystem read/write instrumentation, no canary in default outputs,
   index/events/public bundles/package inventory; budget default reads/bytes/time
   and memory against selected graph size. Public/private scope negative controls.
6. Exact installed artifact: npm pack/install into an isolated consumer, seal
   tar digest and payload inventory; run feature and nearby controls on native
   Node24.18.0/24.19.0/24.21.0. Retain frozen source/build/harness/artifact identity,
   commands, durations and explicit pass/fail/skip/not-run counts.
7. Static/docs: compiler, CLI matrix/options contract, generated command docs,
   release guidance/current0.6.3 candidate notes, docs site build, skill/graph
   validation and whitespace. Preserve excluded archive/bundle refresh bytes.
8. Draft checkpoint: retain final current checks and unresolved full-suite,
   thresholded coverage, package ladder, hosted portable/platform and owner-local
   gates. Do not dispatch/rerun broad CI to conceal known gaps. Parent reviews
   before any continuation; no merge or publication authority.
