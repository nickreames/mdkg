import path from "path";
import { containedPathExists, readContainedFile } from "../core/filesystem_authority";
import { UsageError } from "../util/errors";
import { canonicalJson, identityHash, identityRef } from "./identity";
import { acceptedSemanticBase, readIdentityHistory } from "./identity_history";
import { GraphFileChange, IdentityPlanBase } from "./identity_migration";
import { IdentityDecisions, IdentityMergeResult, reconcileIdentitySnapshots } from "./identity_reconcile";
import { AuthoredSnapshot, graphControlSnapshot, indexAuthoredSnapshot, readAuthoredSnapshot, readGraphGit, resolveGraphRevision } from "./identity_snapshot";
import { assertNoPendingIdentityTransaction } from "./identity_transaction";
import { ALLOWED_TYPES, parseNode } from "./node";
import { loadTemplateSchemas } from "./template_schema";
import { buildSubgraphsIndex } from "./subgraphs";
import { buildSkillsIndex } from "./skills_indexer";
import { collectGraphErrors } from "./validate_graph";
import { collectVisibilityViolations, visibilityViolationMessages } from "./visibility";

export type ReconciliationParameters = { ancestor: string; incoming: string; target?: string; decisions?: IdentityDecisions };
export type ReconciliationPlan = IdentityPlanBase & {
  action: "graph.reconcile.plan";
  parameters: { ancestor: string; target: string; incoming: string; decisions: IdentityDecisions };
  semantic_base: { revision: string; tree_hash: string; receipt_path: string | null };
  classifications: IdentityMergeResult["classifications"];
  mappings: IdentityMergeResult["mappings"];
  path_manifest: Array<{ path: string; treatment: string }>;
  replay: { noop: boolean; previously_present: string[]; inspected_revisions: string[]; receipt_path: string | null };
  validation: { authored: string; dependencies: string; external_evidence: string };
};

const EXCLUSIONS = [".mdkg/index/", ".mdkg/bundles/", ".mdkg/pack/", ".mdkg/state/", ".mdkg/db/", ".mdkg/events/", ".git/"];
const RECEIPT_PATH = /^\.mdkg\/identity\/(migrations|reconciliations|templates|forks)\/[0-9a-f]{64}\.json$/;
const message = (error: unknown) => error instanceof Error ? error.message : String(error);

/** Validate a virtual authored candidate against live, read-only dependencies.
 * No cache is trusted, no source bundle is refreshed, no archive is reconstructed.
 */
export function validateReconciliationCandidate(root: string, candidate: AuthoredSnapshot) {
  const dependencies: Record<string, string | null> = {};
  const blocking: string[] = [];
  const capture = (file: string) => {
    const relative = path.relative(root, path.resolve(root, file)).split(path.sep).join("/");
    dependencies[relative] = containedPathExists({ root, relativePath: relative })
      ? identityHash(readContainedFile({ root, relativePath: relative }, null)) : null;
  };
  for (const subgraph of Object.values(candidate.config.subgraphs)) {
    if (!subgraph.enabled) continue;
    for (const source of subgraph.sources) if (source.enabled) capture(source.path);
  }
  const imported = buildSubgraphsIndex(root, candidate.config);
  for (const item of imported.index.subgraphs) blocking.push(...item.errors.map((error) => `subgraph ${item.alias}: ${error}`));
  const skills = buildSkillsIndex(root, candidate.config);
  for (const skill of Object.values(skills.skills)) capture(skill.path);
  const templates = loadTemplateSchemas(root, candidate.config, ALLOWED_TYPES);
  for (const entry of candidate.nodes) {
    for (const slug of entry.node.skills) if (!skills.skills[slug]) blocking.push(`${entry.qid}: skills reference missing slug: ${slug}`);
    if (entry.node.type !== "archive") continue;
    for (const attribute of ["stored_path", "compressed_path"]) {
      capture(path.posix.join(path.posix.dirname(entry.path), String(entry.node.attributes[attribute])));
    }
    try {
      // Default parser integrity checks verify actual payload/hash/size. The
      // historical parser deliberately does not read today's payload as proof.
      parseNode(entry.content, path.resolve(root, entry.path), {
        workStatusEnum: candidate.config.work.status_enum, priorityMin: candidate.config.work.priority_min,
        priorityMax: candidate.config.work.priority_max, templateSchemas: templates,
      });
    } catch (error) { blocking.push(`archive dependency requires separate exact transfer: ${message(error)}`); }
  }
  try {
    const index = indexAuthoredSnapshot(candidate, imported.index.nodes);
    blocking.push(...collectGraphErrors(index, { allowMissing: false, knownSkillSlugs: new Set(Object.keys(skills.skills)),
      externalWorkspaces: new Set(Object.keys(candidate.config.subgraphs)) }));
    blocking.push(...visibilityViolationMessages(collectVisibilityViolations(index, candidate.config)));
  } catch (error) { blocking.push(`strict candidate validation: ${message(error)}`); }
  return { dependencies, skillPaths: Object.values(skills.skills).map((skill) => skill.path).sort(), blocking: [...new Set(blocking)].sort() };
}

export function planIdentityReconciliation(root: string, parameters: ReconciliationParameters): ReconciliationPlan {
  assertNoPendingIdentityTransaction(root);
  const control = graphControlSnapshot(root);
  if (!control.head) throw new UsageError("reconciliation requires a local committed target and accepted ancestor");
  const targetRevision = resolveGraphRevision(root, parameters.target ?? "HEAD");
  if (targetRevision !== control.head) throw new UsageError("--target must identify current HEAD; reconciliation writes only the current authored checkout");
  if (readGraphGit(root, ["ls-files", "-u"])!.trim()) throw new UsageError("unresolved Git stages require explicit Git conflict resolution before semantic application");
  const current = readAuthoredSnapshot(root);
  const ancestor = readAuthoredSnapshot(root, parameters.ancestor);
  const incoming = readAuthoredSnapshot(root, parameters.incoming);
  if (current.format.format_version !== 2 || ancestor.format.format_version !== 2 || incoming.format.format_version !== 2 ||
    current.format.graph_id !== ancestor.format.graph_id || current.format.graph_id !== incoming.format.graph_id) {
    throw new UsageError("reconciliation requires the same versioned graph identity on all three inputs; migration/federation is separate");
  }
  for (const revision of [targetRevision, incoming.revision!]) {
    if (readGraphGit(root, ["merge-base", "--is-ancestor", ancestor.revision!, revision], true) === undefined) {
      throw new UsageError("accepted --ancestor must precede both target HEAD and incoming revision");
    }
  }
  const decisions = parameters.decisions ?? {};
  const known = new Set([...ancestor.nodes, ...current.nodes].map((entry) => identityRef(entry.node.identity!)));
  const sought = new Set(incoming.nodes.map((entry) => identityRef(entry.node.identity!)).filter((ref) => !known.has(ref)));
  const history = readIdentityHistory(root, current, targetRevision, sought);
  const accepted = acceptedSemanticBase(root, history, incoming);
  let base = accepted ? readAuthoredSnapshot(root, accepted.incoming.revision) : ancestor;
  if (accepted && base.revision !== ancestor.revision) {
    if (readGraphGit(root, ["merge-base", "--is-ancestor", base.revision!, ancestor.revision!], true) !== undefined) base = ancestor;
    else if (readGraphGit(root, ["merge-base", "--is-ancestor", ancestor.revision!, base.revision!], true) === undefined) {
      throw new UsageError("accepted Git ancestor and receipt semantic base are incomparable; explicit lineage decision required");
    }
  }
  const noop = !!accepted && accepted.incoming.revision === incoming.revision && Object.keys(decisions).length === 0;
  const previouslyIntegrated = new Set(history.previously_present);
  if (accepted) for (const entry of base.nodes) previouslyIntegrated.add(identityRef(entry.node.identity!));
  const result = noop ? { documents: current.nodes.map((entry) => ({ path: entry.path, ws: entry.ws,
    stable_ref: identityRef(entry.node.identity!), content: entry.content })), classifications: [], mappings: [], blocking: [] }
    : reconcileIdentitySnapshots(base, current, incoming, decisions, previouslyIntegrated);
  const templates = loadTemplateSchemas(root, current.config, ALLOWED_TYPES);
  const candidate: AuthoredSnapshot = { ...current, nodes: result.documents.map((document) => {
    const node = parseNode(document.content, path.resolve(root, document.path), {
      workStatusEnum: current.config.work.status_enum, priorityMin: current.config.work.priority_min,
      priorityMax: current.config.work.priority_max, templateSchemas: templates, deferArchiveIntegrity: true,
    });
    return { ...document, node, qid: `${document.ws}:${node.id}`, hash: identityHash(document.content) };
  }) };
  const validated = validateReconciliationCandidate(root, candidate);
  const blocking = [...result.blocking, ...validated.blocking];
  const writes: GraphFileChange[] = [];
  const input = new Map(current.nodes.map((entry) => [entry.path, entry.content]));
  const output = new Map(candidate.nodes.map((entry) => [entry.path, entry.content]));
  for (const file of [...new Set([...input.keys(), ...output.keys()])].sort()) {
    const before = input.get(file) ?? null;
    const after = output.get(file) ?? null;
    if (before !== after) writes.push({ path: file, before, after });
    if (!input.has(file) && containedPathExists({ root, relativePath: file })) blocking.push(`unowned destination already exists: ${file}`);
  }
  if (!noop) {
    for (const [file, evidence] of Object.entries(incoming.identity_evidence ?? {})) {
      const existing = current.identity_evidence?.[file];
      if (existing && existing.hash !== evidence.hash) blocking.push(`immutable identity evidence collision: ${file}`);
      else if (!existing) {
        if (!RECEIPT_PATH.test(file)) blocking.push(`unclassifiable incoming identity evidence: ${file}`);
        else writes.push({ path: file, before: null, after: evidence.content });
      }
    }
  }
  const semanticBase = { revision: base.revision!, tree_hash: base.tree_hash,
    receipt_path: accepted?.incoming.revision === base.revision ? accepted.path : null };
  const validation = { authored: blocking.length === 0 ? "strict candidate passed" : "blocked; not valid application evidence",
    dependencies: "local mounted sources, canonical skills and archive payloads fingerprinted; no refresh",
    external_evidence: "external receipt bodies and artifact locators preserved; not independently verified" };
  const payload = { schema_version: 1, kind: "graph-identity-reconciliation", graph_id: current.format.graph_id,
    ancestor: { revision: ancestor.revision!, tree_hash: ancestor.tree_hash }, target: { revision: targetRevision, tree_hash: current.tree_hash },
    incoming: { revision: incoming.revision!, tree_hash: incoming.tree_hash }, semantic_base: semanticBase,
    decisions, classifications: result.classifications, mappings: result.mappings,
    output_authored_hash: identityHash(canonicalJson(Object.fromEntries(candidate.nodes.map((entry) => [entry.path, entry.hash])))),
    validation, body_policy: "exact chosen body bytes; only proven structured references rebound",
    execution_state_policy: "selection, local locks, runtime DB, queues and Git staging are excluded" };
  const intent = identityHash(canonicalJson(payload));
  const receiptPath = noop ? accepted!.path : `.mdkg/identity/reconciliations/${intent.slice(7)}.json`;
  if (!noop) {
    if (containedPathExists({ root, relativePath: receiptPath }) || writes.some((entry) => entry.path === receiptPath)) {
      blocking.push(`receipt destination is already owned: ${receiptPath}`);
    } else writes.push({ path: receiptPath, before: null, after: `${JSON.stringify({ ...payload, intent_hash: intent }, null, 2)}\n` });
  }
  const incomingPaths = readGraphGit(root, ["diff", "--no-ext-diff", "--no-textconv", "--name-only", "-z", ancestor.revision!, incoming.revision!, "--"])!.split("\0").filter(Boolean);
  const authored = new Set([...ancestor.nodes, ...incoming.nodes].map((entry) => entry.path));
  const pathManifest = [...new Set([...incomingPaths, ...writes.map((entry) => entry.path)])].sort().map((file) => ({ path: file,
    treatment: writes.some((entry) => entry.path === file) ? "reviewed authored write"
      : authored.has(file) ? "authored input; target preserved"
      : file.startsWith(".mdkg/identity/") ? "immutable identity evidence; preserved"
      : EXCLUSIONS.some((prefix) => file.startsWith(prefix)) ? "generated or checkout-local; excluded"
      : "non-owned source/config/document/artifact; excluded" }));
  const revisions = new Map([ancestor, incoming, base].map((snapshot) => [snapshot.revision!, snapshot.tree_hash]));
  for (const acceptance of history.acceptances) revisions.set(acceptance.incoming.revision, acceptance.incoming.tree_hash);
  const body: Omit<ReconciliationPlan, "plan_hash"> = {
    schema_version: 1, action: "graph.reconcile.plan", parameters: { ancestor: ancestor.revision!, target: targetRevision,
      incoming: incoming.revision!, decisions }, input_tree_hash: current.tree_hash, input_files: current.files, control,
    semantic_base: semanticBase, classifications: result.classifications, mappings: result.mappings,
    writes: writes.sort((a, b) => a.path.localeCompare(b.path)), receipt_path: receiptPath,
    blocking: [...new Set(blocking)].sort(), generated_exclusions: EXCLUSIONS,
    dependency_files: validated.dependencies, skill_dependency_paths: validated.skillPaths,
    revision_evidence: [...revisions].sort().map(([revision, tree_hash]) => ({ revision, tree_hash })),
    path_manifest: pathManifest, replay: { noop, previously_present: history.previously_present,
      inspected_revisions: history.inspected_revisions, receipt_path: accepted?.path ?? null }, validation,
  };
  // Preview must not accidentally report a plan over a moving checkout.
  if (canonicalJson(graphControlSnapshot(root)) !== canonicalJson(control) || readAuthoredSnapshot(root).tree_hash !== current.tree_hash) {
    throw new UsageError("reconciliation baseline moved while planning; preserve state and re-inventory");
  }
  return { ...body, plan_hash: identityHash(canonicalJson(body)) };
}
