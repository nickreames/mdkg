import { Index } from "./indexer";
import { isManifestSemanticType } from "./agent_file_types";
import { archiveIdFromUri, isUriRef } from "../util/refs";
import { resolveQid } from "../util/qid";
import { collectGoalScope, GOAL_SCOPE_ACTIONABLE_TYPES, GOAL_SCOPE_ALLOWED_TYPES } from "./goal_scope";
import { parseLoopRefBindings } from "./loop_bindings";

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
      ["context_refs", edges.context_refs ?? []],
      ["evidence_refs", edges.evidence_refs ?? []],
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
        if ((edgeKey === "context_refs" || edgeKey === "evidence_refs") && isUriRef(value)) {
          continue;
        }
        const targetNode = nodes[value];
        if (
          targetNode &&
          ["epic", "parent", "prev", "next"].includes(edgeKey) &&
          !node.source?.imported &&
          targetNode.source?.imported
        ) {
          pushError(errors, `${qid}: ${edgeKey} cannot target read-only subgraph node ${value}`);
          continue;
        }
        if (!targetNode) {
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

function resolveNodeRef(index: Index, ws: string, value: string): Index["nodes"][string] | undefined {
  const qid = value.includes(":") ? value : `${ws}:${value}`;
  return index.nodes[qid];
}

function resolveTypedNodeRef(index: Index, ws: string, value: string, type: string): Index["nodes"][string] | undefined {
  const node = resolveNodeRef(index, ws, value);
  return node?.type === type ? node : undefined;
}

function isExternalWorkspaceRef(value: string, externalWorkspaces: Set<string> | undefined): boolean {
  const [workspace] = value.split(":");
  return Boolean(workspace && value.includes(":") && externalWorkspaces?.has(workspace));
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
    if (!isManifestSemanticType(node.type)) {
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
  externalWorkspaces: Set<string> | undefined,
  errors: string[] | null
): void {
  for (const [qid, node] of Object.entries(index.nodes)) {
    if (node.type !== "work_order") {
      continue;
    }
    const workId = node.attributes.work_id;
    if (typeof workId !== "string") {
      continue;
    }
    const workNode = resolveTypedNodeRef(index, node.ws, workId, "work");
    if (!workNode) {
      if (isExternalWorkspaceRef(workId, externalWorkspaces)) {
        continue;
      }
      if (allowMissing) {
        continue;
      }
      pushError(errors, `${qid}: work_id references missing WORK.md ${workId}`);
      continue;
    }
    const workVersion = node.attributes.work_version;
    if (
      typeof workVersion === "string" &&
      typeof workNode.attributes.version === "string" &&
      workVersion !== workNode.attributes.version
    ) {
      pushError(
        errors,
        `${qid}: work_version ${workVersion} does not match ${workNode.qid} version ${workNode.attributes.version}`
      );
    }
  }
}

function validateAgentWorkflowReceiptWorkOrderRefs(
  index: Index,
  allowMissing: boolean,
  externalWorkspaces: Set<string> | undefined,
  errors: string[] | null
): void {
  for (const [qid, node] of Object.entries(index.nodes)) {
    if (node.type !== "receipt") {
      continue;
    }
    const workOrderId = node.attributes.work_order_id;
    if (typeof workOrderId !== "string") {
      continue;
    }
    if (resolveTypedNodeRef(index, node.ws, workOrderId, "work_order")) {
      continue;
    }
    if (isExternalWorkspaceRef(workOrderId, externalWorkspaces)) {
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
    if (!isManifestSemanticType(node.type)) {
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

function resolveSpecRole(index: Index, ws: string, value: string): { qid: string; role?: string } | undefined {
  const resolved = resolveQid(index, value, ws);
  if (resolved.status !== "ok") {
    return undefined;
  }
  const node = index.nodes[resolved.qid];
  if (!node || !isManifestSemanticType(node.type)) {
    return undefined;
  }
  return {
    qid: node.qid,
    role: typeof node.attributes.role === "string" ? node.attributes.role : undefined,
  };
}

function validateAgentWorkflowSubagentRefs(
  index: Index,
  allowMissing: boolean,
  externalWorkspaces: Set<string> | undefined,
  errors: string[] | null
): void {
  const specRolesByWorkspace = buildSpecRolesByWorkspace(index);

  for (const [qid, node] of Object.entries(index.nodes)) {
    if (!isManifestSemanticType(node.type) && node.type !== "work") {
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
      const specNode = value.includes(":")
        ? resolveSpecRole(index, node.ws, value)
        : specRolesByWorkspace[node.ws]?.[value];
      if (!specNode) {
        if (isExternalWorkspaceRef(value, externalWorkspaces)) {
          continue;
        }
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
  externalWorkspaces: Set<string> | undefined,
  errors: string[] | null
): void {
  for (const [qid, node] of Object.entries(index.nodes)) {
    if (node.type !== "dispute") {
      continue;
    }
    const workOrderId = node.attributes.work_order_id;
    if (typeof workOrderId !== "string") {
      continue;
    }
    if (
      !resolveTypedNodeRef(index, node.ws, workOrderId, "work_order") &&
      !isExternalWorkspaceRef(workOrderId, externalWorkspaces) &&
      !allowMissing
    ) {
      pushError(errors, `${qid}: work_order_id references missing WORK_ORDER.md ${workOrderId}`);
    }

    const receiptId = node.attributes.receipt_id;
    if (typeof receiptId !== "string") {
      continue;
    }
    const receiptNode = resolveTypedNodeRef(index, node.ws, receiptId, "receipt");
    if (!receiptNode) {
      if (isExternalWorkspaceRef(receiptId, externalWorkspaces)) {
        continue;
      }
      if (allowMissing) {
        continue;
      }
      pushError(errors, `${qid}: receipt_id references missing RECEIPT.md ${receiptId}`);
      continue;
    }
    const receiptWorkOrderId = typeof receiptNode.attributes.work_order_id === "string"
      ? receiptNode.attributes.work_order_id
      : undefined;
    const receiptWorkOrderQid = receiptWorkOrderId
      ? receiptWorkOrderId.includes(":") ? receiptWorkOrderId : `${receiptNode.ws}:${receiptWorkOrderId}`
      : undefined;
    const disputeWorkOrderQid = workOrderId.includes(":") ? workOrderId : `${node.ws}:${workOrderId}`;
    if (receiptWorkOrderQid !== undefined && receiptWorkOrderQid !== disputeWorkOrderQid) {
      pushError(
        errors,
        `${qid}: receipt_id ${receiptId} belongs to work_order_id ${receiptWorkOrderId}, not ${workOrderId}`
      );
    }
  }
}

function buildNodeIdsByWorkspace(index: Index): Map<string, Set<string>> {
  const nodeIdsByWorkspace = new Map<string, Set<string>>();
  for (const node of Object.values(index.nodes)) {
    const ids = nodeIdsByWorkspace.get(node.ws) ?? new Set<string>();
    ids.add(node.id);
    nodeIdsByWorkspace.set(node.ws, ids);
  }
  return nodeIdsByWorkspace;
}

function validateAgentWorkflowNodeIdRef(
  qid: string,
  ws: string,
  field: string,
  value: string,
  nodeIdsByWorkspace: Map<string, Set<string>>,
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
  if (value.includes(":") && nodeIdsByWorkspace.get(workspace)?.has(value.split(":").slice(1).join(":"))) {
    return;
  }
  if (nodeIdsByWorkspace.get(ws)?.has(value)) {
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

function buildArchiveIdsByWorkspace(index: Index): Map<string, Set<string>> {
  const archiveIdsByWorkspace = new Map<string, Set<string>>();
  for (const node of Object.values(index.nodes)) {
    if (node.type !== "archive") {
      continue;
    }
    const ids = archiveIdsByWorkspace.get(node.ws) ?? new Set<string>();
    ids.add(node.id);
    archiveIdsByWorkspace.set(node.ws, ids);
  }
  return archiveIdsByWorkspace;
}

function validateArchiveUriValue(
  qid: string,
  ws: string,
  field: string,
  value: string,
  archiveIdsByWorkspace: Map<string, Set<string>>,
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
  if (archiveIdsByWorkspace.get(ws)?.has(archiveId)) {
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

function loopAttributeList(node: Index["nodes"][string], key: string): string[] {
  const value = node.attributes[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function resolveLoopEvidenceNode(index: Index, ws: string, ref: string): Index["nodes"][string] | undefined {
  const resolved = resolveQid(index, ref, ws);
  return resolved.status === "ok" ? index.nodes[resolved.qid] : undefined;
}

function isAcceptedLoopDecision(node: Index["nodes"][string]): boolean {
  return node.type === "dec" && node.status === "accepted";
}

function isVerifiedLoopApproval(node: Index["nodes"][string]): boolean {
  if (node.type === "dec") {
    return node.status === "accepted";
  }
  if (node.type === "checkpoint") {
    return node.status === "done";
  }
  return node.type === "receipt" && node.attributes.receipt_status === "verified";
}

function validateLoopTypedRefs(index: Index, allowMissing: boolean, errors: string[] | null): void {
  for (const [qid, node] of Object.entries(index.nodes)) {
    if (node.type !== "loop") {
      continue;
    }

    for (const ref of loopAttributeList(node, "decision_refs")) {
      if (isUriRef(ref)) {
        pushError(errors, `${qid}: decision_refs requires a local accepted dec ref, got ${ref}`);
        continue;
      }
      const target = resolveLoopEvidenceNode(index, node.ws, ref);
      if (!target) {
        if (!allowMissing) {
          pushError(errors, `${qid}: decision_refs references missing node ${ref}`);
        }
        continue;
      }
      if (!isAcceptedLoopDecision(target)) {
        pushError(errors, `${qid}: decision_refs ${ref} must target an accepted dec, got ${target.type}:${target.status ?? "none"}`);
      }
    }

    for (const ref of loopAttributeList(node, "approval_refs")) {
      if (isUriRef(ref)) {
        continue;
      }
      const target = resolveLoopEvidenceNode(index, node.ws, ref);
      if (!target) {
        if (!allowMissing) {
          pushError(errors, `${qid}: approval_refs references missing node ${ref}`);
        }
        continue;
      }
      if (!isVerifiedLoopApproval(target)) {
        pushError(
          errors,
          `${qid}: approval_refs ${ref} must target an accepted dec, done checkpoint, or verified receipt, got ${target.type}:${target.status ?? target.attributes.receipt_status ?? "none"}`
        );
      }
    }

    const checks: Array<{
      key: string;
      kind: "decision" | "approval" | "evidence";
    }> = [
      { key: "question_answer_refs", kind: "decision" },
      { key: "action_approval_refs", kind: "approval" },
      { key: "evidence_lane_refs", kind: "evidence" },
      { key: "lane_waiver_decision_refs", kind: "decision" },
      { key: "lane_waiver_approval_refs", kind: "approval" },
    ];
    for (const check of checks) {
      const bindings = parseLoopRefBindings(loopAttributeList(node, check.key));
      for (const binding of bindings) {
        if (isUriRef(binding.ref)) {
          if (check.kind === "decision") {
            pushError(errors, `${qid}: ${check.key} ${binding.identity} requires a local accepted dec ref, got ${binding.ref}`);
          }
          continue;
        }
        const target = resolveLoopEvidenceNode(index, node.ws, binding.ref);
        if (!target) {
          if (!allowMissing) {
            pushError(errors, `${qid}: ${check.key} ${binding.identity} references missing node ${binding.ref}`);
          }
          continue;
        }
        if (check.kind === "decision" && !isAcceptedLoopDecision(target)) {
          pushError(errors, `${qid}: ${check.key} ${binding.identity} must target an accepted dec`);
        }
        if (check.kind === "approval" && !isVerifiedLoopApproval(target)) {
          pushError(
            errors,
            `${qid}: ${check.key} ${binding.identity} must target an accepted dec, done checkpoint, or verified receipt`
          );
        }
      }
    }

    const waiverDecisionIdentities = new Set(
      parseLoopRefBindings(loopAttributeList(node, "lane_waiver_decision_refs")).map((binding) => binding.identity)
    );
    const waiverApprovalIdentities = new Set(
      parseLoopRefBindings(loopAttributeList(node, "lane_waiver_approval_refs")).map((binding) => binding.identity)
    );
    for (const identity of new Set([...waiverDecisionIdentities, ...waiverApprovalIdentities])) {
      if (!waiverDecisionIdentities.has(identity) || !waiverApprovalIdentities.has(identity)) {
        pushError(errors, `${qid}: lane waiver ${identity} requires both decision and approval bindings`);
      }
    }
  }
}

function validateSingleActiveRootGoals(index: Index, errors: string[] | null): void {
  const activeByWorkspace: Record<string, string[]> = {};
  for (const [qid, node] of Object.entries(index.nodes)) {
    if (node.type !== "goal" || node.source?.imported) {
      continue;
    }
    if (node.status === "progress" && node.attributes.goal_state === "active") {
      if (!activeByWorkspace[node.ws]) {
        activeByWorkspace[node.ws] = [];
      }
      activeByWorkspace[node.ws].push(qid);
    }
  }

  for (const [workspace, qids] of Object.entries(activeByWorkspace)) {
    if (qids.length <= 1) {
      continue;
    }
    pushError(
      errors,
      `${workspace}: multiple active root goals found: ${qids.sort().join(", ")}; run mdkg goal activate <goal-id> to select exactly one`
    );
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
  validateAgentWorkflowWorkOrderWorkRefs(index, allowMissing, externalWorkspaces, errors);
  validateAgentWorkflowReceiptWorkOrderRefs(index, allowMissing, externalWorkspaces, errors);
  validateAgentWorkflowSubagentRefs(index, allowMissing, externalWorkspaces, errors);
  validateAgentWorkflowDisputeRefs(index, allowMissing, externalWorkspaces, errors);
  validateAgentWorkflowFeedbackProposalRefs(index, allowMissing, knownSkillSlugs, externalWorkspaces, errors);
  validateArchiveUriRefs(index, allowMissing, errors);
  validateLoopTypedRefs(index, allowMissing, errors);
  validateGoalRefs(index, allowMissing, errors);
  validateSingleActiveRootGoals(index, errors);
  detectPrevNextCycles(index, errors);
  return errors;
}

export function validateGraph(index: Index, options: ValidateGraphOptions = {}): void {
  const errors = collectGraphErrors(index, options);
  if (errors.length > 0) {
    throw new Error(errors[0]);
  }
}
