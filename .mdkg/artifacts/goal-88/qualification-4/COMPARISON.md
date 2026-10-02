# Goal88 corrected review checkpoint

NOT_READY. The two independent-review findings are corrected in tests only.
Runtime source remains `c13c7adba673b0de79ad55e87e0519e54cce5b95`. The tested
state was `17fe62e98a4cfbfb8fdad226a730709fa77ad9c7` plus the exact retained
`review-fix.diff.gz` (decompressed SHA256 `5625c07b6cd5d77750878b862df9ea31c2dd0d8f694225f98024649b7da69d65`).
Only the two listed test files change executable qualification behavior.
Evidence and graph narratives were attached after the frozen run.

Saved cloud cwd `/workspace/mdkg-cloud-goal88`, origin `nickreames/mdkg`, branch
`cloud/goal88-minimal-init`, plan base `ddafe0836fdc790cd36ba203afbcfc1878bbddd8`.
PR10 and PR11 were verified open, draft and unmerged. No Goal89 work began.

| Classification | Immutable comparison and outcome |
| --- | --- |
| Introduced, corrected | Cloud reproduced 23 pass / 3 fail in 26 cases: default and agent modes expected an appended CLAUDE router, and a positive changelog fixture still used 0.6.0. Tests now require exact authored CLAUDE preservation, retain AGENTS routing, compare every file after repeated init, reject a mismatched changelog and accept the runtime's actual version. No compatibility behavior was removed. |
| Corrected candidate | Node24.19.0 affected controls: 45/45. Node24.18.0 affected families: 26/26. Complete thresholded coverage: 2403 pass / 0 fail / 1 skip, 185 files, exit0 in 548470ms. Lines92.59%, branches84.27%, functions97.58%; unchanged floors89/77/96. All custody checks passed. |
| Inherited cloud demo | All37 package smokes ran;36 passed and demo-graph failed. Plan and candidate have identical103 semantic rows and verifier. All103 actual modes are0600; an in-memory-only0644 projection produces the exact accepted seal. Source bytes, accepted seal and fixture behavior were not changed. |
| Inherited site predicate | All9 site definitions ran after scoped Astro configuration;8 passed. Pass5 fails because quickstart line64 contains `--pack-profile concise`, which the identical base/candidate script forbids. The offending line is unchanged; the nearby Goal88 edit changes only the init output description. This is a read-only proof of the same failing predicate, not a claimed full baseline site smoke execution. |
| Resolved setup | Initial3 site attempts failed before assertions at unavailable home Astro configuration. Unchanged scripts passed their affected setup with task-scoped `XDG_CONFIG_HOME` and `ASTRO_TELEMETRY_DISABLED=1`; no HOME or global configuration change. |
| Unresolved hosted run | Exact c13 run36972314303 floating coverage exited1 after876713ms without timeout; minimum cancelled and full jobs skipped. Official artifact download reference succeeded, but native archive transfer failed with CONNECT proxy403. Archive11211594942 is482625436bytes, exceeding the small-file tool's32MiB limit. Raw failures remain UNCLASSIFIED. The later passing cloud run does not classify that earlier hosted result. |
| Required, incomplete | Complete passing prepublication ladder, corrected-candidate owner review/local acceptance, legacy-retirement decision and full platform/portable-filesystem qualification remain pending. Native Linux x64 installed18-case/51-call checks passed on24.18.0 and24.19.0 against the same retained artifact. LinuxARM64 and macOSARM64/x64 were NOT_RUN here; Windows remains unqualified. No platform substitution or Mac access. |

The parent reported separate local review results of2401 pass /3 fail,
26/26 baseline controls,37/37 package smokes and27 installed cases. These are
reported owner evidence, not cloud executions. Cloud's mode-dependent demo
failure is retained separately. New corrected-candidate review is pending.

The npm artifact is unchanged, not repacked:548015bytes, SHA256
`479c2f92ac760e008d4e374aebc57243e3a07520c51b2f7e388353d109f78c9a`.
Package input identity remains
`0a01d13d5f2d604da43ac30fac2c73e64d488a0ac180d6cf37ea46a1852a0a72`;
corrected qualification identity is
`525f55ac988953a836d5e855d998b15a4a2d65e219e0365475a012d330ff35c6`.
Earlier installed/package/site results are applicable to unchanged package
bytes; the corrected test harness has fresh affected and full-suite evidence.

## Minimal baseline remediation proposals

These proposals require their owner's review; no baseline fix was applied.

1. Demo: in `scripts/demo-graph-fixture.js` only, consider explicit materialization
   of the103 sealed, non-executable public source entries as0644 in the owned
   fixture before bootstrap verification. Keep its parent0700, original source
   inventory/modes and byte checks. Bind allowed projected entries/modes to the
   accepted source contract or verified Git100644 mode; refuse unrelated or
   executable-mode drift. Retain the accepted seal and strict verifier. Never
   chmod the canonical checkout or broadly reseal its inputs. The existing
   fixture copier preserves0600 and therefore reproduces this seal mismatch.
2. Site: owner review of quickstart line64 using the already supported canonical
   `mdkg pack WORK_ID --profile concise` spelling. Keep pass5's exclusion intact;
   qualify the one documentation correction with docs-command and pass5 checks.
3. Hosted: obtain a small approved extraction of `logs/coverage.log` and
   `coverage/coverage-event.json`, with available summary/manifest/receipt/progress
   files from artifact11211594942. Classify actual failures before any CI remedy.
   The prior invalid `/tmp/.git` and PID1 orphan problems have representative
   base controls, but do not explain every hosted failure. Fresh clean receipt
   roots and owned-descendant reaping are diagnostic controls, not accepted
   infrastructure changes or coverage waivers.

No broad CI rebuild, timeout extension, threshold reduction, baseline acceptance
change, goal closure, merge, release, tag, publication or deployment was made.
The full coverage raw13519 V8 files (3695750601bytes) remain in the owned saved
cloud cache. Their compressed manifest, structured event, summary and log are
committed; raw cache durability across executor loss is not guaranteed.
