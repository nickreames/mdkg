import { Index } from "./indexer";
import { archiveIdFromUri } from "../util/refs";
import { collectGoalScope, GOAL_SCOPE_ACTIONABLE_TYPES, GOAL_SCOPE_ALLOWED_TYPES } from "./goal_scope";

export type ValidateGraphOptions = {
  allowMissing?: boolean;
  knownSkillSlugs?: Set<string>;
  externalWorkspaces?: Set<string>;
};

function pushError(errors: string[] | null, message: string): void {
  if (errors) {
    errors.push(message);
    return;
  }
  throw new Error(message);
}

function validateEdgeTargets(
  index: Index,
  allowMissing: boolean,
  knownSkillSlugs: Set<string> | undefined,
  externalWorkspaces: Set<string> | undefined,
  errors: string[] | null
): void {
  const nodes = index.nodes;
  for (const [qid, node] of Object.entries(nodes)) {
    const edges = node.edges;
    const edgeLists: Array<[string, string[]]> = [
      ["relates", edges.relates],
      ["blocked_by", edges.blocked_by],
      ["blocks", edges.blocks],
    ];

    if (edges.epic) {
      edgeLists.push(["epic", [edges.epic]]);
    }
    if (edges.parent) {
      edgeLists.push(["parent", [edges.parent]]);
    }
    if (edges.prev) {
      edgeLists.push(["prev", [edges.prev]]);
    }
    if (edges.next) {
      edgeLists.push(["next", [edges.next]]);
    }

    for (const [edgeKey, values] of edgeLists) {
      for (const value of values) {
        if (!nodes[value]) {
          const [workspace] = value.split(":");
          if (workspace && externalWorkspaces?.has(workspace)) {
            continue;
          }
          if (
            edgeKey === "relates" &&
            node.type === "proposal" &&
            node.attributes.proposal_kind === "skill_update" &&
            validateSkillRef(qid, edgeKey, value, knownSkillSlugs, allowMissing, errors)
          ) {
            continue;
          }
          if (allowMissing) {
            continue;
          }
          pushError(errors, `${qid}: ${edgeKey} references missing node ${value}`);
        }
      }
    }
  }
}

const SKILL_DOT_REF_RE = /^skill\.([a-z0-9]+(?:-[a-z0-9]+)*)$/;

function skillSlugFromDotRef(value: string): string | undefined {
  const localValue = value.includes(":") ? value.split(":").pop() ?? value : value;
  return SKILL_DOT_REF_RE.exec(localValue)?.[1];
}

function validateSkillRef(
  qid: string,
  field: string,
  value: string,
  knownSkillSlugs: Set<string> | undefined,
  allowMissing: boolean,
  errors: string[] | null
): boolean {
  const slug = skillSlugFromDotRef(value);
  if (!slug) {
    return false;
  }
  if (knownSkillSlugs === undefined || knownSkillSlugs.has(slug)) {
    return true;
  }
  if (allowMissing) {
    return true;
  }
  pushError(errors, `${qid}: ${field} references missing skill ${value}`);
  return true;
}

function validatePrevNextSymmetry(index: Index, _allowMissing: boolean, errors: string[] | null): void {
  const nodes = index.nodes;
  for (const [qid, node] of Object.entries(nodes)) {
    const edges = node.edges;
    if (edges.next) {
      const target = nodes[edges.next];
      if (!target) {
        continue;
      }
      if (target.edges.prev !== qid) {
        pushError(errors, `${qid}: next ${edges.next} missing matching prev`);
      }
    }
    if (edges.prev) {
      const target = nodes[edges.prev];
      if (!target) {
        continue;
      }
      if (target.edges.next !== qid) {
        pushError(errors, `${qid}: prev ${edges.prev} missing matching next`);
      }
    }
  }
}

function normalizeDocPath(value: string): string {
  return value.replace(/\\/g, "/").replace(/^\.\//, "");
}

function pathEndsWithContractRef(nodePath: string, contractRef: string): boolean {
  const normalizedNodePath = normalizeDocPath(nodePath);
  const normalizedContractRef = normalizeDocPath(contractRef);
  return (
    normalizedNodePath === normalizedContractRef ||
    normalizedNodePath.endsWith(`/${normalizedContractRef}`)
  );
}

function validateAgentWorkflowSpecWorkContracts(
  index: Index,
  allowMissing: boolean,
  errors: string[] | null
): void {
  const workNodesByWorkspace: Record<
    string,
    Array<{ qid: string; path: string; agentId?: string }>
  > = {};
  for (const node of Object.values(index.nodes)) {
    if (node.type !== "work") {
      continue;
    }
    if (!workNodesByWorkspace[node.ws]) {
      workNodesByWorkspace[node.ws] = [];
    }
    workNodesByWorkspace[node.ws].push({
      qid: node.qid,
      path: node.path,
      agentId: typeof node.attributes.agent_id === "string" ? node.attributes.agent_id : undefined,
    });
  }

  for (const [qid, node] of Object.entries(index.nodes)) {
    if (node.type !== "spec") {
      continue;
    }
    const workContracts = node.attributes.work_contracts;
    if (!Array.isArray(workContracts)) {
      continue;
    }
    const workspaceWorkNodes = workNodesByWorkspace[node.ws] ?? [];
    for (const [indexValue, value] of workContracts.entries()) {
      if (typeof value !== "string") {
        continue;
      }
      const matches = workspaceWorkNodes.filter((workNode) =>
        pathEndsWithContractRef(workNode.path, value)
      );
      if (matches.length === 0) {
        if (allowMissing) {
          continue;
        }
        pushError(
          errors,
          `${qid}: work_contracts[${indexValue}] references missing WORK.md ${value}`
        );
        continue;
      }
      if (matches.length > 1) {
        pushError(
          errors,
          `${qid}: work_contracts[${indexValue}] ambiguously matches ${matches
            .map((match) => match.qid)
            .sort()
            .join(", ")}`
        );
        continue;
      }
      const matchedWorkNode = matches[0];
      if (matchedWorkNode.agentId !== undefined && matchedWorkNode.agentId !== node.id) {
        pushError(
          errors,
          `${qid}: work_contracts[${indexValue}] references ${matchedWorkNode.qid} owned by agent_id ${matchedWorkNode.agentId}, not ${node.id}`
        );
      }
    }
  }
}

function validateAgentWorkflowWorkOrderWorkRefs(
  index: Index,
  allowMissing: boolean,
  errors: string[] | null
): void {
  const workNodesByWorkspaceAndId: Record<string, Record<string, { qid: string; version?: string }>> =
    {};
  for (const node of Object.values(index.nodes)) {
    if (node.type !== "work") {
      continue;
    }
    if (!workNodesByWorkspaceAndId[node.ws]) {
      workNodesByWorkspaceAndId[node.ws] = {};
    }
    workNodesByWorkspaceAndId[node.ws][node.id] = {
      qid: node.qid,
      version:
        typeof node.attributes.version === "string" ? node.attributes.version : undefined,
    };
  }

  for (const [qid, node] of Object.entries(index.nodes)) {
    if (node.type !== "work_order") {
      continue;
    }
    const workId = node.attributes.work_id;
    if (typeof workId !== "string") {
      continue;
    }
    const workNode = workNodesByWorkspaceAndId[node.ws]?.[workId];
    if (!workNode) {
      if (allowMissing) {
        continue;
      }
      pushError(errors, `${qid}: work_id references missing WORK.md ${workId}`);
      continue;
    }
    const workVersion = node.attributes.work_version;
    if (
      typeof workVersion === "string" &&
      workNode.version !== undefined &&
      workVersion !== workNode.version
    ) {
      pushError(
        errors,
        `${qid}: work_version ${workVersion} does not match ${workNode.qid} version ${workNode.version}`
      );
    }
  }
}

function validateAgentWorkflowReceiptWorkOrderRefs(
  index: Index,
  allowMissing: boolean,
  errors: string[] | null
): void {
  const workOrderIdsByWorkspace: Record<string, Set<string>> = {};
  for (const node of Object.values(index.nodes)) {
    if (node.type !== "work_order") {
      continue;
    }
    if (!workOrderIdsByWorkspace[node.ws]) {
      workOrderIdsByWorkspace[node.ws] = new Set();
    }
    workOrderIdsByWorkspace[node.ws].add(node.id);
  }

  for (const [qid, node] of Object.entries(index.nodes)) {
    if (node.type !== "receipt") {
      continue;
    }
    const workOrderId = node.attributes.work_order_id;
    if (typeof workOrderId !== "string") {
      continue;
    }
    if (workOrderIdsByWorkspace[node.ws]?.has(workOrderId)) {
      continue;
    }
    if (allowMissing) {
      continue;
    }
    pushError(errors, `${qid}: work_order_id references missing WORK_ORDER.md ${workOrderId}`);
  }
}

function buildSpecRolesByWorkspace(
  index: Index
): Record<string, Record<string, { qid: string; role?: string }>> {
  const specRolesByWorkspace: Record<string, Record<string, { qid: string; role?: string }>> = {};
  for (const node of Object.values(index.nodes)) {
    if (node.type !== "spec") {
      continue;
    }
    if (!specRolesByWorkspace[node.ws]) {
      specRolesByWorkspace[node.ws] = {};
    }
    specRolesByWorkspace[node.ws][node.id] = {
      qid: node.qid,
      role: typeof node.attributes.role === "string" ? node.attributes.role : undefined,
    };
  }
  return specRolesByWorkspace;
}

function validateAgentWorkflowSubagentRefs(
  index: Index,
  allowMissing: boolean,
  errors: string[] | null
): void {
  const specRolesByWorkspace = buildSpecRolesByWorkspace(index);

  for (const [qid, node] of Object.entries(index.nodes)) {
    if (node.type !== "spec" && node.type !== "work") {
      continue;
    }
    const subagentRefs = node.attributes.subagent_refs;
    if (!Array.isArray(subagentRefs)) {
      continue;
    }
    for (const [indexValue, value] of subagentRefs.entries()) {
      if (typeof value !== "string") {
        continue;
      }
      const specNode = specRolesByWorkspace[node.ws]?.[value];
      if (!specNode) {
        if (allowMissing) {
          continue;
        }
        pushError(errors, `${qid}: subagent_refs[${indexValue}] references missing SPEC.md ${value}`);
        continue;
      }
      if (specNode.role !== undefined && specNode.role !== "subagent") {
        pushError(
          errors,
          `${qid}: subagent_refs[${indexValue}] references ${specNode.qid} with role ${specNode.role}, not subagent`
        );
      }
    }
  }
}

function validateAgentWorkflowDisputeRefs(
  index: Index,
  allowMissing: boolean,
  errors: string[] | null
): void {
  const workOrderIdsByWorkspace: Record<string, Set<string>> = {};
  const receiptNodesByWorkspaceAndId: Record<
    string,
    Record<string, { qid: string; workOrderId?: string }>
  > = {};

  for (const node of Object.values(index.nodes)) {
    if (node.type === "work_order") {
      if (!workOrderIdsByWorkspace[node.ws]) {
        workOrderIdsByWorkspace[node.ws] = new Set();
      }
      workOrderIdsByWorkspace[node.ws].add(node.id);
    }
    if (node.type === "receipt") {
      if (!receiptNodesByWorkspaceAndId[node.ws]) {
        receiptNodesByWorkspaceAndId[node.ws] = {};
      }
      receiptNodesByWorkspaceAndId[node.ws][node.id] = {
        qid: node.qid,
        workOrderId:
          typeof node.attributes.work_order_id === "string"
            ? node.attributes.work_order_id
            : undefined,
      };
    }
  }

  for (const [qid, node] of Object.entries(index.nodes)) {
    if (node.type !== "dispute") {
      continue;
    }
    const workOrderId = node.attributes.work_order_id;
    if (typeof workOrderId !== "string") {
      continue;
    }
    if (!workOrderIdsByWorkspace[node.ws]?.has(workOrderId) && !allowMissing) {
      pushError(errors, `${qid}: work_order_id references missing WORK_ORDER.md ${workOrderId}`);
    }

    const receiptId = node.attributes.receipt_id;
    if (typeof receiptId !== "string") {
      continue;
    }
    const receiptNode = receiptNodesByWorkspaceAndId[node.ws]?.[receiptId];
    if (!receiptNode) {
      if (allowMissing) {
        continue;
      }
      pushError(errors, `${qid}: receipt_id references missing RECEIPT.md ${receiptId}`);
      continue;
    }
    if (receiptNode.workOrderId !== undefined && receiptNode.workOrderId !== workOrderId) {
      pushError(
        errors,
        `${qid}: receipt_id ${receiptId} belongs to work_order_id ${receiptNode.workOrderId}, not ${workOrderId}`
      );
    }
  }
}

function buildNodeIdsByWorkspace(index: Index): Record<string, Set<string>> {
  const nodeIdsByWorkspace: Record<string, Set<string>> = {};
  for (const node of Object.values(index.nodes)) {
    if (!nodeIdsByWorkspace[node.ws]) {
      nodeIdsByWorkspace[node.ws] = new Set();
    }
    nodeIdsByWorkspace[node.ws].add(node.id);
  }
  return nodeIdsByWorkspace;
}

function validateAgentWorkflowNodeIdRef(
  qid: string,
  ws: string,
  field: string,
  value: string,
  nodeIdsByWorkspace: Record<string, Set<string>>,
  allowSkillRef: boolean,
  knownSkillSlugs: Set<string> | undefined,
  externalWorkspaces: Set<string> | undefined,
  allowMissing: boolean,
  errors: string[] | null
): void {
  const [workspace] = value.split(":");
  if (workspace && value.includes(":") && externalWorkspaces?.has(workspace)) {
    return;
  }
  if (nodeIdsByWorkspace[ws]?.has(value)) {
    return;
  }
  if (
    allowSkillRef &&
    validateSkillRef(qid, field, value, knownSkillSlugs, allowMissing, errors)
  ) {
    return;
  }
  if (allowMissing) {
    return;
  }
  pushError(errors, `${qid}: ${field} references missing node ${value}`);
}

function validateAgentWorkflowFeedbackProposalRefs(
  index: Index,
  allowMissing: boolean,
  knownSkillSlugs: Set<string> | undefined,
  externalWorkspaces: Set<string> | undefined,
  errors: string[] | null
): void {
  const nodeIdsByWorkspace = buildNodeIdsByWorkspace(index);

  for (const [qid, node] of Object.entries(index.nodes)) {
    if (node.type !== "feedback" && node.type !== "proposal") {
      continue;
    }
    const targetId = node.attributes.target_id;
    if (typeof targetId === "string") {
      const allowSkillTarget =
        node.type === "proposal" && node.attributes.proposal_kind === "skill_update";
      validateAgentWorkflowNodeIdRef(
        qid,
        node.ws,
        "target_id",
        targetId,
        nodeIdsByWorkspace,
        allowSkillTarget,
        knownSkillSlugs,
        externalWorkspaces,
        allowMissing,
        errors
      );
    }
    if (node.type !== "proposal") {
      continue;
    }
    const evidenceRefs = node.attributes.evidence_refs;
    if (!Array.isArray(evidenceRefs)) {
      continue;
    }
    for (const [indexValue, value] of evidenceRefs.entries()) {
      if (typeof value !== "string") {
        continue;
      }
      validateAgentWorkflowNodeIdRef(
        qid,
        node.ws,
        `evidence_refs[${indexValue}]`,
        value,
        nodeIdsByWorkspace,
        true,
        knownSkillSlugs,
        externalWorkspaces,
        allowMissing,
        errors
      );
    }
  }
}

function buildArchiveIdsByWorkspace(index: Index): Record<string, Set<string>> {
  const archiveIdsByWorkspace: Record<string, Set<string>> = {};
  for (const node of Object.values(index.nodes)) {
    if (node.type !== "archive") {
      continue;
    }
    if (!archiveIdsByWorkspace[node.ws]) {
      archiveIdsByWorkspace[node.ws] = new Set();
    }
    archiveIdsByWorkspace[node.ws].add(node.id);
  }
  return archiveIdsByWorkspace;
}

function validateArchiveUriValue(
  qid: string,
  ws: string,
  field: string,
  value: string,
  archiveIdsByWorkspace: Record<string, Set<string>>,
  allowMissing: boolean,
  errors: string[] | null
): void {
  if (!value.startsWith("archive://")) {
    return;
  }
  const archiveId = archiveIdFromUri(value);
  if (!archiveId) {
    pushError(errors, `${qid}: ${field} has malformed archive ref ${value}`);
    return;
  }
  if (archiveIdsByWorkspace[ws]?.has(archiveId)) {
    return;
  }
  if (allowMissing) {
    return;
  }
  pushError(errors, `${qid}: ${field} references missing archive ${value}`);
}

function validateArchiveUriRefs(
  index: Index,
  allowMissing: boolean,
  errors: string[] | null
): void {
  const archiveIdsByWorkspace = buildArchiveIdsByWorkspace(index);
  const attributeListFields = [
    "input_refs",
    "constraint_refs",
    "proof_refs",
    "attestation_refs",
  ];
  const attributeScalarFields = ["request_ref", "cost_ref"];

  for (const [qid, node] of Object.entries(index.nodes)) {
    for (const [indexValue, value] of node.artifacts.entries()) {
      validateArchiveUriValue(
        qid,
        node.ws,
        `artifacts[${indexValue}]`,
        value,
        archiveIdsByWorkspace,
        allowMissing,
        errors
      );
    }

    const attributes = node.attributes ?? {};
    for (const field of attributeListFields) {
      const values = attributes[field];
      if (!Array.isArray(values)) {
        continue;
      }
      for (const [indexValue, value] of values.entries()) {
        if (typeof value !== "string") {
          continue;
        }
        validateArchiveUriValue(
          qid,
          node.ws,
          `${field}[${indexValue}]`,
          value,
          archiveIdsByWorkspace,
          allowMissing,
          errors
        );
      }
    }

    for (const field of attributeScalarFields) {
      const value = attributes[field];
      if (typeof value !== "string") {
        continue;
      }
      validateArchiveUriValue(
        qid,
        node.ws,
        field,
        value,
        archiveIdsByWorkspace,
        allowMissing,
        errors
      );
    }
  }
}

function validateGoalRefs(index: Index, allowMissing: boolean, errors: string[] | null): void {
  for (const [qid, node] of Object.entries(index.nodes)) {
    if (node.type !== "goal") {
      continue;
    }

    const scope = collectGoalScope(index, node, { includeCompatibilityRefs: false });
    for (const ref of scope.missingRefs) {
      if (allowMissing) {
        continue;
      }
      pushError(errors, `${qid}: scope_refs references missing node ${ref}`);
    }
    for (const ref of scope.invalidRefs) {
      const target = index.nodes[ref];
      const typeLabel = target ? target.type : "missing";
      pushError(
        errors,
        `${qid}: scope_refs references ${ref} with type ${typeLabel}, expected ${Array.from(GOAL_SCOPE_ALLOWED_TYPES).join(", ")}`
      );
    }

    const activeNode = node.attributes.active_node;
    if (typeof activeNode !== "string") {
      continue;
    }
    const activeQid = activeNode.includes(":") ? activeNode : `${node.ws}:${activeNode}`;
    const target = index.nodes[activeQid];
    if (!target) {
      if (allowMissing) {
        continue;
      }
      pushError(errors, `${qid}: active_node references missing node ${activeNode}`);
      continue;
    }
    if (!GOAL_SCOPE_ACTIONABLE_TYPES.has(target.type)) {
      pushError(
        errors,
        `${qid}: active_node references ${activeQid} with type ${target.type}, expected ${Array.from(GOAL_SCOPE_ACTIONABLE_TYPES).join(", ")}`
      );
      continue;
    }
    if (scope.qids.size > 0 && !scope.actionableQids.has(activeQid)) {
      pushError(errors, `${qid}: active_node ${activeQid} is not inside goal scope_refs`);
    }
  }
}

function detectPrevNextCycles(index: Index, errors: string[] | null): void {
  const nodes = index.nodes;
  const seen = new Set<string>();

  for (const start of Object.keys(nodes)) {
    if (seen.has(start)) {
      continue;
    }
    const path = new Map<string, number>();
    let current: string | undefined = start;
    while (current) {
      if (seen.has(current)) {
        break;
      }
      if (path.has(current)) {
        const entries = Array.from(path.keys());
        const cycleStart = path.get(current) ?? 0;
        const cycle = entries.slice(cycleStart);
        cycle.push(current);
        pushError(errors, `cycle detected in prev/next chain: ${cycle.join(" -> ")}`);
        break;
      }
      path.set(current, path.size);
      const nextQid: string | undefined = nodes[current]?.edges.next;
      if (!nextQid || !nodes[nextQid]) {
        break;
      }
      current = nextQid;
    }
    for (const visited of path.keys()) {
      seen.add(visited);
    }
  }
}

export function collectGraphErrors(index: Index, options: ValidateGraphOptions = {}): string[] {
  const errors: string[] = [];
  const allowMissing = options.allowMissing ?? false;
  const knownSkillSlugs = options.knownSkillSlugs;
  const externalWorkspaces = options.externalWorkspaces;
  validateEdgeTargets(index, allowMissing, knownSkillSlugs, externalWorkspaces, errors);
  validatePrevNextSymmetry(index, allowMissing, errors);
  validateAgentWorkflowSpecWorkContracts(index, allowMissing, errors);
  validateAgentWorkflowWorkOrderWorkRefs(index, allowMissing, errors);
  validateAgentWorkflowReceiptWorkOrderRefs(index, allowMissing, errors);
  validateAgentWorkflowSubagentRefs(index, allowMissing, errors);
  validateAgentWorkflowDisputeRefs(index, allowMissing, errors);
  validateAgentWorkflowFeedbackProposalRefs(index, allowMissing, knownSkillSlugs, externalWorkspaces, errors);
  validateArchiveUriRefs(index, allowMissing, errors);
  validateGoalRefs(index, allowMissing, errors);
  detectPrevNextCycles(index, errors);
  return errors;
}

export function validateGraph(index: Index, options: ValidateGraphOptions = {}): void {
  const errors = collectGraphErrors(index, options);
  if (errors.length > 0) {
    throw new Error(errors[0]);
  }
}
