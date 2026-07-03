import fs from "fs";
import path from "path";
import crypto from "crypto";
import { loadConfig } from "../core/config";
import {
  DEFAULT_FRONTMATTER_KEY_ORDER,
  formatFrontmatter,
  FrontmatterValue,
  parseFrontmatter,
} from "../graph/frontmatter";
import { buildIndex, Index, IndexNode } from "../graph/indexer";
import { loadIndex } from "../graph/index_cache";
import { writeDerivedIndexes } from "../graph/reindex";
import {
  AGENT_FILE_BASENAMES,
  AGENT_FILE_TYPES,
  AgentFileType,
  isManifestSemanticType,
} from "../graph/agent_file_types";
import { loadTemplate, renderTemplate } from "../templates/loader";
import { formatDate } from "../util/date";
import { NotFoundError, UsageError, ValidationError } from "../util/errors";
import { isPortableId, isPortableIdRef } from "../util/id";
import { archiveIdFromUri, isSha256Ref } from "../util/refs";
import { formatResolveError, resolveQid } from "../util/qid";
import { atomicWriteFile, writeFileExclusive } from "../util/atomic";
import { withMutationLock } from "../util/lock";
import { appendAutomaticEvent } from "./event_support";
import { runArchiveAddCommand } from "./archive";
import { resolveConfiguredProjectDbLayout } from "../core/project_db";
import { verifyProjectDb } from "../core/project_db_migrations";
import {
  enqueueProjectQueueMessage,
  ProjectQueueMessage,
  readProjectQueue,
} from "../core/project_db_queue";
import { collectValidateReceipt } from "./validate";
import { toNodeSummaryJson, writeJson } from "./query_output";
import { listWorkspaceDocFilesByAlias } from "../graph/workspace_files";

export type WorkContractNewCommandOptions = {
  root: string;
  title: string;
  id: string;
  agentId: string;
  kind: string;
  inputs: string;
  outputs: string;
  ws?: string;
  contractProfile?: string;
  requiredCapabilities?: string;
  pricingModel?: string;
  json?: boolean;
  now?: Date;
};

export type WorkOrderNewCommandOptions = {
  root: string;
  title: string;
  id: string;
  workId: string;
  requester: string;
  ws?: string;
  requestRef?: string;
  triggerRef?: string;
  payloadHash?: string;
  inputRefs?: string;
  queueRefs?: string;
  requestedOutputs?: string;
  constraintRefs?: string;
  contractProfile?: string;
  validationPolicyRef?: string;
  evidencePolicyRef?: string;
  json?: boolean;
  now?: Date;
};

export type WorkOrderUpdateCommandOptions = {
  root: string;
  id: string;
  ws?: string;
  status?: string;
  addInputRefs?: string;
  addQueueRefs?: string;
  addArtifacts?: string;
  json?: boolean;
  now?: Date;
};

export type WorkOrderStatusCommandOptions = {
  root: string;
  id: string;
  ws?: string;
  json?: boolean;
};

export type WorkTriggerCommandOptions = {
  root: string;
  targetRef: string;
  ws?: string;
  id?: string;
  title?: string;
  requester?: string;
  enqueue?: string;
  json?: boolean;
  now?: Date;
};

export type WorkReceiptNewCommandOptions = {
  root: string;
  title: string;
  id: string;
  workOrderId: string;
  outcome: string;
  ws?: string;
  receiptStatus?: string;
  costRef?: string;
  redactionPolicy?: string;
  contractProfile?: string;
  receiptKind?: string;
  redactionClass?: string;
  validationPolicyRef?: string;
  evidencePolicyRef?: string;
  artifacts?: string;
  proofRefs?: string;
  attestationRefs?: string;
  evidenceHashes?: string;
  inputHashes?: string;
  outputHashes?: string;
  json?: boolean;
  now?: Date;
};

export type WorkReceiptUpdateCommandOptions = {
  root: string;
  id: string;
  ws?: string;
  receiptStatus?: string;
  addArtifacts?: string;
  addProofRefs?: string;
  addAttestationRefs?: string;
  addEvidenceHashes?: string;
  json?: boolean;
  now?: Date;
};

export type WorkReceiptVerifyCommandOptions = {
  root: string;
  id: string;
  ws?: string;
  json?: boolean;
};

export type WorkValidateCommandOptions = {
  root: string;
  id?: string;
  ws?: string;
  type?: string;
  profile?: string;
  json?: boolean;
};

export type WorkArtifactAddCommandOptions = {
  root: string;
  targetId: string;
  file: string;
  id?: string;
  ws?: string;
  kind?: string;
  json?: boolean;
  now?: Date;
};

type WorkMutationReceipt = {
  workspace: string;
  id: string;
  qid: string;
  path: string;
  type: string;
  title: string;
};

type WorkOrderCreation = {
  receipt: WorkMutationReceipt;
  payloadHash: string;
  workId: string;
  workVersion: string;
};

type WorkTriggerQueueDelivery = {
  queue_name: string;
  queue_ref: string;
  message_id: string;
  message: ProjectQueueMessage;
  created: boolean;
  duplicate: boolean;
};

type WorkOrderStatusReceipt = {
  kind: "work_order_status";
  order: {
    workspace: string;
    id: string;
    qid: string;
    path: string;
    title: string;
    status?: string;
    work_id?: string;
    work_qid?: string;
    requester?: string;
    request_ref?: string;
    trigger_ref?: string;
    payload_hash?: string;
    input_refs: string[];
    queue_refs: string[];
    requested_outputs: string[];
    constraint_refs: string[];
    artifact_policy?: string;
    artifacts: string[];
    created: string;
    updated: string;
  };
  receipt_count: number;
  receipts: Array<{
    id: string;
    qid: string;
    path: string;
    title: string;
    receipt_status?: string;
    outcome?: string;
    redaction_policy?: string;
    artifacts: string[];
    proof_refs: string[];
    attestation_refs: string[];
    evidence_hashes: string[];
    input_hashes: string[];
    output_hashes: string[];
    updated: string;
  }>;
};

type WorkReceiptVerifyReceipt = {
  kind: "work_receipt_verify";
  ok: boolean;
  receipt: {
    workspace: string;
    id: string;
    qid: string;
    path: string;
    title: string;
    receipt_status?: string;
    outcome?: string;
    work_order_id?: string;
    work_order_qid?: string;
    redaction_policy?: string;
    artifacts: string[];
    proof_refs: string[];
    attestation_refs: string[];
    evidence_hashes: string[];
    input_hashes: string[];
    output_hashes: string[];
    updated: string;
  };
  work_order?: {
    id: string;
    qid: string;
    path: string;
    status?: string;
    work_id?: string;
    work_qid?: string;
    payload_hash?: string;
  };
  checks: Array<{
    name: string;
    ok: boolean;
    detail: string;
  }>;
  errors: string[];
  warnings: string[];
};

type WorkValidationDiagnostic = {
  severity: "warning" | "error";
  code: string;
  message: string;
  qid?: string;
};

type WorkValidateReceipt = {
  action: "work.validate";
  ok: boolean;
  type: AgentFileType | "all";
  validation_profile?: string;
  target?: ReturnType<typeof toNodeSummaryJson>;
  checked_count: number;
  nodes: Array<ReturnType<typeof toNodeSummaryJson>>;
  warning_count: number;
  error_count: number;
  warnings: string[];
  errors: string[];
  diagnostics: WorkValidationDiagnostic[];
};

const PRICING_MODELS = new Set(["free", "included", "quoted", "fixed", "metered", "subscription"]);
const ORDER_STATUSES = new Set(["submitted", "accepted", "running", "completed", "cancelled", "failed"]);
const RECEIPT_STATUSES = new Set(["recorded", "verified", "rejected", "superseded"]);
const OUTCOMES = new Set(["success", "partial", "failure"]);
const REDACTION_POLICIES = new Set(["refs_and_hashes_only", "redacted_summary", "external_private"]);
const WORKFLOW_VALIDATE_TYPES = new Set<string>(AGENT_FILE_TYPES);
const CONTRACT_METADATA_RE = /^[a-z][a-z0-9_]*(?:-[a-z0-9_]+)*$/;

function parseCsvList(raw?: string): string[] {
  if (!raw) {
    return [];
  }
  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function normalizeWorkspace(value?: string): string {
  if (!value) {
    return "root";
  }
  const normalized = value.toLowerCase();
  if (normalized === "all") {
    throw new UsageError("--ws all is not valid for work commands");
  }
  return normalized;
}

function normalizePortableId(value: string, flag: string): string {
  const normalized = value.toLowerCase();
  if (!isPortableId(normalized)) {
    throw new UsageError(`${flag} must be a lowercase portable id`);
  }
  return normalized;
}

function normalizePortableIdRef(value: string, flag: string): string {
  const normalized = value.toLowerCase();
  if (!isPortableIdRef(normalized)) {
    throw new UsageError(`${flag} must be a lowercase portable id or qid`);
  }
  return normalized;
}

function normalizeEnum(value: string, flag: string, allowed: Set<string>): string {
  const normalized = value.toLowerCase();
  if (!allowed.has(normalized)) {
    throw new UsageError(`${flag} must be one of ${Array.from(allowed).join(", ")}`);
  }
  return normalized;
}

function normalizeContractMetadataToken(value: string | undefined, flag: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  const normalized = value.toLowerCase();
  if (!CONTRACT_METADATA_RE.test(normalized)) {
    throw new UsageError(`${flag} must be lowercase snake/kebab style`);
  }
  return normalized;
}

function normalizeSha256Ref(value: string | undefined, flag: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  const normalized = value.toLowerCase();
  if (!isSha256Ref(normalized)) {
    throw new UsageError(`${flag} must be sha256:<64 lowercase hex chars>`);
  }
  return normalized;
}

function normalizeSha256Refs(value: string | undefined, flag: string): string[] {
  return parseCsvList(value).map((hash) => normalizeSha256Ref(hash, flag) as string);
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableJson(item)).join(",")}]`;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
      a.localeCompare(b)
    );
    return `{${entries
      .map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function hashStablePayload(value: unknown): string {
  return `sha256:${crypto.createHash("sha256").update(stableJson(value)).digest("hex")}`;
}

function buildWorkOrderPayloadHash(options: {
  workId: string;
  workVersion: string;
  requester: string;
  requestRef: string;
  triggerRef: string;
  inputRefs: string[];
  queueRefs: string[];
  requestedOutputs: string[];
  constraintRefs: string[];
}): string {
  return hashStablePayload({
    work_id: options.workId,
    work_version: options.workVersion,
    requester: options.requester,
    request_ref: options.requestRef,
    trigger_ref: options.triggerRef,
    input_refs: options.inputRefs,
    queue_refs: options.queueRefs,
    requested_outputs: options.requestedOutputs,
    constraint_refs: options.constraintRefs,
  });
}

function portableSegment(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9_]+/g, ".")
      .replace(/^[._-]+|[._-]+$/g, "")
      .slice(0, 80) || "work"
  );
}

function normalizeQueueName(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  const normalized = value.toLowerCase();
  if (!isPortableId(normalized)) {
    throw new UsageError("--enqueue must be a lowercase portable queue name");
  }
  return normalized;
}

function queueRefForWorkOrder(queueName: string, orderId: string): string {
  return `queue://project-db/${queueName}/${orderId}`;
}

function loadWorkTriggerQueueDatabase(root: string, queueName: string): string {
  const config = loadConfig(root);
  const verification = verifyProjectDb(root, config);
  if (!verification.ok) {
    throw new ValidationError(
      "work trigger --enqueue requires a valid project DB; run mdkg db init, mdkg db migrate, and mdkg db verify"
    );
  }
  const databasePath = resolveConfiguredProjectDbLayout(root, config.db).runtimeFile;
  const queue = readProjectQueue(databasePath, queueName);
  if (!queue) {
    throw new NotFoundError(`project DB queue not found: ${queueName}; run mdkg db queue create ${queueName}`);
  }
  if (queue.status !== "active") {
    throw new ValidationError(`project DB queue ${queueName} is paused; run mdkg db queue resume ${queueName}`);
  }
  return databasePath;
}

function slugifyTitle(title: string): string {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
  return slug || "work";
}

function toPosixPath(value: string): string {
  return value.split(path.sep).join("/");
}

function appendUnique(existing: string[], additions: string[]): string[] {
  const next = [...existing];
  const seen = new Set(existing);
  for (const addition of additions) {
    if (!seen.has(addition)) {
      next.push(addition);
      seen.add(addition);
    }
  }
  return next;
}

function toStringList(value: FrontmatterValue | undefined): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function maybeReindex(root: string, config: ReturnType<typeof loadConfig>): void {
  if (!config.index.auto_reindex) {
    return;
  }
  writeDerivedIndexes(root, config, buildIndex(root, config, { tolerant: config.index.tolerant }));
}

function requireReferenceNode(index: Index, ws: string, idOrQid: string, type: string, label: string): IndexNode {
  const resolved = resolveQid(index, idOrQid, ws);
  if (resolved.status !== "ok") {
    throw new NotFoundError(formatResolveError(label, idOrQid, resolved, ws));
  }
  const node = index.nodes[resolved.qid];
  if (!node || node.type !== type) {
    throw new NotFoundError(`${label} not found: ${idOrQid}`);
  }
  return node;
}

function resolveReadableWorkNode(index: Index, idOrQid: string, ws: string, type: string, label: string): IndexNode {
  const resolved = resolveQid(index, idOrQid, ws);
  if (resolved.status !== "ok") {
    throw new NotFoundError(formatResolveError(label, idOrQid, resolved, ws));
  }
  const node = index.nodes[resolved.qid];
  if (!node || node.type !== type) {
    throw new NotFoundError(`${label} not found: ${idOrQid}`);
  }
  return node;
}

function normalizeWorkflowValidateType(value: string | undefined): AgentFileType | undefined {
  if (value === undefined) {
    return undefined;
  }
  const normalized = value.toLowerCase();
  if (!WORKFLOW_VALIDATE_TYPES.has(normalized)) {
    throw new UsageError(`--type must be one of ${AGENT_FILE_TYPES.join(", ")}`);
  }
  return normalized as AgentFileType;
}

function isWorkflowNode(node: IndexNode): boolean {
  return WORKFLOW_VALIDATE_TYPES.has(node.type);
}

function resolveWorkflowTarget(index: Index, idOrQid: string, ws: string): IndexNode {
  const resolved = resolveQid(index, idOrQid, ws);
  if (resolved.status !== "ok") {
    throw new NotFoundError(formatResolveError("workflow record", idOrQid, resolved, ws));
  }
  const node = index.nodes[resolved.qid];
  if (!node || !isWorkflowNode(node)) {
    throw new NotFoundError(`workflow record not found: ${idOrQid}`);
  }
  return node;
}

function workflowDiagnosticCode(message: string): string {
  const rawMatch = /raw-content\.([a-z_]+)/.exec(message);
  if (rawMatch) {
    return `raw-content.${rawMatch[1]}`;
  }
  if (message.includes("missing recommended heading")) {
    return "heading.missing";
  }
  const manifestCompatMatch = /manifest\.compat\.([a-z_]+)/.exec(message);
  if (manifestCompatMatch) {
    return `manifest.compat.${manifestCompatMatch[1]}`;
  }
  const contractProfileMatch = /(contract-profile|receipt-kind|redaction-class)\.([a-z-]+)/.exec(message);
  if (contractProfileMatch) {
    return `${contractProfileMatch[1]}.${contractProfileMatch[2]}`;
  }
  if (message.includes("references missing") || message.includes("references missing node")) {
    return "reference.missing";
  }
  if (message.includes("must be named")) {
    return "schema.basename";
  }
  if (message.includes("must be") || message.includes("is required")) {
    return "schema.invalid";
  }
  if (message.includes("visibility:")) {
    return "visibility.policy";
  }
  return "validation.message";
}

function workflowDiagnosticQid(message: string, nodes: IndexNode[]): string | undefined {
  for (const node of nodes) {
    if (message.includes(node.qid) || message.includes(node.path)) {
      return node.qid;
    }
  }
  return undefined;
}

function workflowCandidatePaths(options: {
  root: string;
  config: ReturnType<typeof loadConfig>;
  ws: string;
  type?: AgentFileType;
  target?: IndexNode;
}): string[] {
  const values = new Set<string>();
  if (options.target) {
    values.add(options.target.path);
    values.add(path.resolve(options.root, options.target.path));
    return Array.from(values);
  }
  const basenames = options.type
    ? new Set([AGENT_FILE_BASENAMES[options.type]])
    : new Set(Object.values(AGENT_FILE_BASENAMES));
  const filesByAlias = listWorkspaceDocFilesByAlias(options.root, options.config);
  for (const [alias, files] of Object.entries(filesByAlias)) {
    if (options.ws !== "root" && alias !== options.ws) {
      continue;
    }
    for (const filePath of files) {
      if (!basenames.has(path.basename(filePath))) {
        continue;
      }
      values.add(filePath);
      values.add(path.relative(options.root, filePath).split(path.sep).join("/"));
    }
  }
  return Array.from(values);
}

function filterWorkflowMessages(messages: string[], nodes: IndexNode[], candidatePaths: string[]): string[] {
  if (nodes.length === 0 && candidatePaths.length === 0) {
    return [];
  }
  return messages.filter((message) =>
    nodes.some((node) => message.includes(node.qid) || message.includes(node.path)) ||
    candidatePaths.some((filePath) => message.includes(filePath))
  );
}

function buildWorkValidateReceipt(options: WorkValidateCommandOptions): WorkValidateReceipt {
  const config = loadConfig(options.root);
  const ws = normalizeWorkspace(options.ws);
  const { index } = loadIndex({ root: options.root, config, tolerant: true });
  const type = normalizeWorkflowValidateType(options.type);
  let targets: IndexNode[];
  let target: IndexNode | undefined;

  if (options.id) {
    target = resolveWorkflowTarget(index, options.id, ws);
    if (type && target.type !== type) {
      throw new UsageError(`workflow record ${target.qid} is ${target.type}, not ${type}`);
    }
    targets = [target];
  } else {
    targets = Object.values(index.nodes)
      .filter((node) => isWorkflowNode(node) && (!type || node.type === type))
      .sort((a, b) => a.qid.localeCompare(b.qid));
  }

  const candidatePaths = workflowCandidatePaths({ root: options.root, config, ws, type, target });
  const validation = collectValidateReceipt({ root: options.root, profile: options.profile });
  const warnings = filterWorkflowMessages(validation.warnings, targets, candidatePaths);
  const errors = filterWorkflowMessages(validation.errors, targets, candidatePaths);
  const diagnostics: WorkValidationDiagnostic[] = [
    ...warnings.map((message) => ({
      severity: "warning" as const,
      code: workflowDiagnosticCode(message),
      message,
      qid: workflowDiagnosticQid(message, targets),
    })),
    ...errors.map((message) => ({
      severity: "error" as const,
      code: workflowDiagnosticCode(message),
      message,
      qid: workflowDiagnosticQid(message, targets),
    })),
  ];

  return {
    action: "work.validate",
    ok: errors.length === 0,
    type: type ?? "all",
    ...(options.profile ? { validation_profile: options.profile } : {}),
    ...(target ? { target: toNodeSummaryJson(target) } : {}),
    checked_count: target ? 1 : candidatePaths.filter((value) => !path.isAbsolute(value)).length,
    nodes: targets.map((node) => toNodeSummaryJson(node)),
    warning_count: warnings.length,
    error_count: errors.length,
    warnings,
    errors,
    diagnostics,
  };
}

function printWorkValidateReceipt(receipt: WorkValidateReceipt, json?: boolean): void {
  if (json) {
    writeJson(receipt);
    if (!receipt.ok) {
      throw new ValidationError(`workflow validation failed with ${receipt.error_count} error(s)`);
    }
    return;
  }

  for (const warning of receipt.warnings) {
    console.error(`warning: ${warning}`);
  }
  if (!receipt.ok) {
    for (const error of receipt.errors) {
      console.error(error);
    }
    throw new ValidationError(`workflow validation failed with ${receipt.error_count} error(s)`);
  }
  console.log(`workflow validation ok: ${receipt.checked_count} file(s)`);
}

function resolveTriggerWorkNode(index: Index, ws: string, refRaw: string): {
  workNode: IndexNode;
  sourceNode?: IndexNode;
} {
  const ref = normalizePortableIdRef(refRaw, "<work-or-capability-ref>");
  const resolved = resolveQid(index, ref, ws);
  if (resolved.status !== "ok") {
    throw new NotFoundError(formatResolveError("work contract or capability", refRaw, resolved, ws));
  }
  const node = index.nodes[resolved.qid];
  if (!node) {
    throw new NotFoundError(`work contract or capability not found: ${refRaw}`);
  }
  if (node.type === "work") {
    return { workNode: node };
  }
  if (!isManifestSemanticType(node.type)) {
    throw new UsageError(`work trigger requires a WORK.md or MANIFEST.md/SPEC.md ref, got ${node.type}: ${node.qid}`);
  }

  const candidates = new Map<string, IndexNode>();
  const specDir = path.posix.dirname(node.path);
  for (const contractPath of toStringList(node.attributes.work_contracts)) {
    const normalizedPath = path.posix.normalize(path.posix.join(specDir, contractPath));
    for (const candidate of Object.values(index.nodes)) {
      if (candidate.type === "work" && candidate.ws === node.ws && candidate.path === normalizedPath) {
        candidates.set(candidate.qid, candidate);
      }
    }
  }
  for (const qid of node.edges.relates) {
    const candidate = index.nodes[qid];
    if (candidate?.type === "work") {
      candidates.set(candidate.qid, candidate);
    }
  }
  const reverseRelates = index.reverse_edges[node.qid]?.relates ?? [];
  for (const qid of reverseRelates) {
    const candidate = index.nodes[qid];
    if (candidate?.type === "work") {
      candidates.set(candidate.qid, candidate);
    }
  }

  const workNodes = Array.from(candidates.values()).sort((a, b) => a.qid.localeCompare(b.qid));
  const manifestLabel = node.type === "spec" ? "legacy SPEC.md" : "MANIFEST.md";
  if (workNodes.length === 0) {
    throw new NotFoundError(`${manifestLabel} ${node.qid} has no resolvable WORK.md contract`);
  }
  if (workNodes.length > 1) {
    throw new UsageError(
      `${manifestLabel} ${node.qid} has multiple work contracts; trigger one explicitly: ${workNodes
        .map((workNode) => workNode.qid)
        .join(", ")}`
    );
  }
  return { workNode: workNodes[0], sourceNode: node };
}

function nodeReceipt(root: string, node: IndexNode): WorkMutationReceipt {
  return {
    workspace: node.ws,
    id: node.id,
    qid: node.qid,
    path: node.path,
    type: node.type,
    title: node.title,
  };
}

function resolveOptionalQid(index: Index, ws: string, idOrQid: string | undefined): string | undefined {
  if (!idOrQid) {
    return undefined;
  }
  const resolved = resolveQid(index, idOrQid, ws);
  return resolved.status === "ok" ? resolved.qid : undefined;
}

function listReceiptsForOrder(index: Index, order: IndexNode): IndexNode[] {
  const orderRefs = new Set([order.id, order.qid, `${order.ws}:${order.id}`]);
  return Object.values(index.nodes)
    .filter((node) => node.type === "receipt" && orderRefs.has(String(node.attributes.work_order_id ?? "")))
    .sort((a, b) => a.qid.localeCompare(b.qid));
}

function buildWorkOrderStatusReceipt(index: Index, order: IndexNode): WorkOrderStatusReceipt {
  const workId = typeof order.attributes.work_id === "string" ? order.attributes.work_id : undefined;
  const receipts = listReceiptsForOrder(index, order).map((receipt) => ({
    id: receipt.id,
    qid: receipt.qid,
    path: receipt.path,
    title: receipt.title,
    receipt_status:
      typeof receipt.attributes.receipt_status === "string" ? receipt.attributes.receipt_status : undefined,
    outcome: typeof receipt.attributes.outcome === "string" ? receipt.attributes.outcome : undefined,
    redaction_policy:
      typeof receipt.attributes.redaction_policy === "string" ? receipt.attributes.redaction_policy : undefined,
    artifacts: receipt.artifacts,
    proof_refs: toStringList(receipt.attributes.proof_refs),
    attestation_refs: toStringList(receipt.attributes.attestation_refs),
    evidence_hashes: toStringList(receipt.attributes.evidence_hashes),
    input_hashes: toStringList(receipt.attributes.input_hashes),
    output_hashes: toStringList(receipt.attributes.output_hashes),
    updated: receipt.updated,
  }));
  return {
    kind: "work_order_status",
    order: {
      workspace: order.ws,
      id: order.id,
      qid: order.qid,
      path: order.path,
      title: order.title,
      status: typeof order.attributes.order_status === "string" ? order.attributes.order_status : undefined,
      work_id: workId,
      work_qid: resolveOptionalQid(index, order.ws, workId),
      requester: typeof order.attributes.requester === "string" ? order.attributes.requester : undefined,
      request_ref: typeof order.attributes.request_ref === "string" ? order.attributes.request_ref : undefined,
      trigger_ref: typeof order.attributes.trigger_ref === "string" ? order.attributes.trigger_ref : undefined,
      payload_hash: typeof order.attributes.payload_hash === "string" ? order.attributes.payload_hash : undefined,
      input_refs: toStringList(order.attributes.input_refs),
      queue_refs: toStringList(order.attributes.queue_refs),
      requested_outputs: toStringList(order.attributes.requested_outputs),
      constraint_refs: toStringList(order.attributes.constraint_refs),
      artifact_policy:
        typeof order.attributes.artifact_policy === "string" ? order.attributes.artifact_policy : undefined,
      artifacts: order.artifacts,
      created: order.created,
      updated: order.updated,
    },
    receipt_count: receipts.length,
    receipts,
  };
}

function buildArchiveIdsByWorkspace(index: Index): Record<string, Set<string>> {
  const byWorkspace: Record<string, Set<string>> = {};
  for (const node of Object.values(index.nodes)) {
    if (node.type !== "archive") {
      continue;
    }
    if (!byWorkspace[node.ws]) {
      byWorkspace[node.ws] = new Set();
    }
    byWorkspace[node.ws].add(node.id);
  }
  return byWorkspace;
}

function verifyArchiveRefs(
  index: Index,
  ws: string,
  refsByField: Record<string, string[]>,
  errors: string[]
): void {
  const archiveIdsByWorkspace = buildArchiveIdsByWorkspace(index);
  for (const [field, refs] of Object.entries(refsByField)) {
    for (const [indexValue, ref] of refs.entries()) {
      if (!ref.startsWith("archive://")) {
        continue;
      }
      const archiveId = archiveIdFromUri(ref);
      if (!archiveId) {
        errors.push(`${field}[${indexValue}] has malformed archive ref ${ref}`);
        continue;
      }
      if (!archiveIdsByWorkspace[ws]?.has(archiveId)) {
        errors.push(`${field}[${indexValue}] references missing archive ${ref}`);
      }
    }
  }
}

function addVerifyCheck(
  checks: WorkReceiptVerifyReceipt["checks"],
  errors: string[],
  name: string,
  ok: boolean,
  detail: string
): void {
  checks.push({ name, ok, detail });
  if (!ok) {
    errors.push(detail);
  }
}

function buildWorkReceiptVerifyReceipt(index: Index, receipt: IndexNode): WorkReceiptVerifyReceipt {
  const errors: string[] = [];
  const warnings: string[] = [];
  const checks: WorkReceiptVerifyReceipt["checks"] = [];
  const workOrderId =
    typeof receipt.attributes.work_order_id === "string" ? receipt.attributes.work_order_id : undefined;
  const workOrder = workOrderId
    ? resolveTypedReadableNode(index, receipt.ws, workOrderId, "work_order")
    : undefined;
  const workId = typeof workOrder?.attributes.work_id === "string" ? workOrder.attributes.work_id : undefined;
  const workNode = workId ? resolveTypedReadableNode(index, workOrder?.ws ?? receipt.ws, workId, "work") : undefined;
  const artifacts = receipt.artifacts;
  const proofRefs = toStringList(receipt.attributes.proof_refs);
  const attestationRefs = toStringList(receipt.attributes.attestation_refs);
  const evidenceHashes = toStringList(receipt.attributes.evidence_hashes);
  const inputHashes = toStringList(receipt.attributes.input_hashes);
  const outputHashes = toStringList(receipt.attributes.output_hashes);
  const evidenceCount =
    artifacts.length +
    proofRefs.length +
    attestationRefs.length +
    evidenceHashes.length +
    inputHashes.length +
    outputHashes.length;

  addVerifyCheck(
    checks,
    errors,
    "work_order_link",
    workOrder !== undefined,
    workOrder ? `linked to ${workOrder.qid}` : `work_order_id references missing WORK_ORDER.md ${workOrderId ?? ""}`.trim()
  );
  addVerifyCheck(
    checks,
    errors,
    "work_link",
    !workOrder || workNode !== undefined,
    workNode ? `linked to ${workNode.qid}` : workOrder ? `work_id references missing WORK.md ${workId ?? ""}`.trim() : "work order missing"
  );
  addVerifyCheck(
    checks,
    errors,
    "outcome",
    typeof receipt.attributes.outcome === "string",
    typeof receipt.attributes.outcome === "string" ? `outcome ${receipt.attributes.outcome}` : "outcome is missing"
  );
  addVerifyCheck(
    checks,
    errors,
    "receipt_status",
    receipt.attributes.receipt_status !== "rejected",
    receipt.attributes.receipt_status === "rejected"
      ? "receipt_status is rejected"
      : `receipt_status ${String(receipt.attributes.receipt_status ?? "unknown")}`
  );
  addVerifyCheck(
    checks,
    errors,
    "evidence_present",
    evidenceCount > 0,
    evidenceCount > 0 ? `${evidenceCount} evidence reference(s) present` : "receipt has no artifacts, proof refs, attestations, or hashes"
  );
  const archiveErrors: string[] = [];
  verifyArchiveRefs(
    index,
    receipt.ws,
    {
      artifacts,
      proof_refs: proofRefs,
      attestation_refs: attestationRefs,
    },
    archiveErrors
  );
  addVerifyCheck(
    checks,
    errors,
    "archive_refs",
    archiveErrors.length === 0,
    archiveErrors.length === 0 ? "archive refs resolve" : archiveErrors.join("; ")
  );
  if (typeof receipt.attributes.redaction_policy !== "string") {
    warnings.push("redaction_policy is missing; legacy receipt remains readable but not explicitly redaction-scoped");
  } else {
    addVerifyCheck(
      checks,
      errors,
      "redaction_policy",
      true,
      `redaction_policy ${receipt.attributes.redaction_policy}`
    );
  }

  return {
    kind: "work_receipt_verify",
    ok: errors.length === 0,
    receipt: {
      workspace: receipt.ws,
      id: receipt.id,
      qid: receipt.qid,
      path: receipt.path,
      title: receipt.title,
      receipt_status:
        typeof receipt.attributes.receipt_status === "string" ? receipt.attributes.receipt_status : undefined,
      outcome: typeof receipt.attributes.outcome === "string" ? receipt.attributes.outcome : undefined,
      work_order_id: workOrderId,
      work_order_qid: workOrder?.qid,
      redaction_policy:
        typeof receipt.attributes.redaction_policy === "string" ? receipt.attributes.redaction_policy : undefined,
      artifacts,
      proof_refs: proofRefs,
      attestation_refs: attestationRefs,
      evidence_hashes: evidenceHashes,
      input_hashes: inputHashes,
      output_hashes: outputHashes,
      updated: receipt.updated,
    },
    work_order: workOrder
      ? {
          id: workOrder.id,
          qid: workOrder.qid,
          path: workOrder.path,
          status:
            typeof workOrder.attributes.order_status === "string" ? workOrder.attributes.order_status : undefined,
          work_id: workId,
          work_qid: workNode?.qid,
          payload_hash:
            typeof workOrder.attributes.payload_hash === "string" ? workOrder.attributes.payload_hash : undefined,
        }
      : undefined,
    checks,
    errors,
    warnings,
  };
}

function resolveTypedReadableNode(
  index: Index,
  ws: string,
  idOrQid: string,
  type: string
): IndexNode | undefined {
  const resolved = resolveQid(index, idOrQid, ws);
  if (resolved.status !== "ok") {
    return undefined;
  }
  const node = index.nodes[resolved.qid];
  return node?.type === type ? node : undefined;
}

function writeFrontmatterFile(
  filePath: string,
  frontmatter: Record<string, FrontmatterValue>,
  body: string
): void {
  const lines = formatFrontmatter(frontmatter, DEFAULT_FRONTMATTER_KEY_ORDER);
  const content = ["---", ...lines, "---", body.trimStart()].join("\n");
  atomicWriteFile(filePath, content.endsWith("\n") ? content : `${content}\n`);
}

function mergeRenderedFrontmatter(
  content: string,
  filePath: string,
  additions: Record<string, FrontmatterValue | undefined>
): string {
  const entries = Object.entries(additions).filter((entry): entry is [string, FrontmatterValue] => entry[1] !== undefined);
  if (entries.length === 0) {
    return content;
  }
  const { frontmatter, body } = parseFrontmatter(content, filePath);
  for (const [key, value] of entries) {
    frontmatter[key] = value;
  }
  const lines = ["---", ...formatFrontmatter(frontmatter, DEFAULT_FRONTMATTER_KEY_ORDER), "---", body.trimStart()];
  const merged = lines.join("\n");
  return merged.endsWith("\n") ? merged : `${merged}\n`;
}

function createAgentWorkflowNode(options: {
  root: string;
  type: AgentFileType;
  title: string;
  id: string;
  ws?: string;
  overrides: Record<string, FrontmatterValue | undefined>;
  now?: Date;
}): WorkMutationReceipt {
  const config = loadConfig(options.root);
  const ws = normalizeWorkspace(options.ws);
  const workspace = config.workspaces[ws];
  if (!workspace) {
    throw new NotFoundError(`workspace not found: ${ws}`);
  }
  const id = normalizePortableId(options.id, "--id");
  const { index } = loadIndex({ root: options.root, config });
  if (index.nodes[`${ws}:${id}`]) {
    throw new UsageError(`node already exists: ${ws}:${id}`);
  }

  const today = formatDate(options.now ?? new Date());
  const slug = slugifyTitle(options.title);
  const filePath = path.resolve(
    options.root,
    workspace.path,
    workspace.mdkg_dir,
    "work",
    `${id}-${slug}`,
    AGENT_FILE_BASENAMES[options.type]
  );
  const template = loadTemplate(options.root, config, options.type);
  const renderedContent = renderTemplate(template, {
    id,
    type: options.type,
    title: options.title,
    created: today,
    updated: today,
    ...options.overrides,
  });
  const content = mergeRenderedFrontmatter(renderedContent, filePath, options.overrides);
  try {
    writeFileExclusive(filePath, content);
  } catch (err) {
    const code = typeof err === "object" && err !== null && "code" in err ? String((err as { code?: unknown }).code) : "";
    if (code === "EEXIST") {
      throw new UsageError(`node already exists: ${path.relative(options.root, filePath)}`);
    }
    throw err;
  }
  maybeReindex(options.root, config);
  appendAutomaticEvent({
    root: options.root,
    ws,
    kind: "WORK_NODE_CREATED",
    status: "ok",
    refs: [id],
    notes: `${options.type} semantic mirror created via mdkg work`,
    now: options.now,
  });
  return {
    workspace: ws,
    id,
    qid: `${ws}:${id}`,
    path: toPosixPath(path.relative(options.root, filePath)),
    type: options.type,
    title: options.title,
  };
}

function resolveWorkNode(
  index: Index,
  idOrQid: string,
  ws: string,
  allowedTypes: Set<string>,
  label: string
): IndexNode {
  const resolved = resolveQid(index, idOrQid, ws);
  if (resolved.status !== "ok") {
    throw new NotFoundError(formatResolveError(label, idOrQid, resolved, ws));
  }
  const node = index.nodes[resolved.qid];
  if (!node || !allowedTypes.has(node.type)) {
    throw new NotFoundError(`${label} not found: ${idOrQid}`);
  }
  if (node.source?.imported) {
    throw new UsageError(
      `cannot mutate read-only subgraph node ${node.qid}; update the source workspace for subgraph ${node.source.subgraph_alias}`
    );
  }
  return node;
}

function loadMutableAgentNode(root: string, idOrQid: string, wsRaw: string | undefined, type: string): {
  config: ReturnType<typeof loadConfig>;
  node: IndexNode;
  filePath: string;
  frontmatter: Record<string, FrontmatterValue>;
  body: string;
} {
  const config = loadConfig(root);
  const ws = normalizeWorkspace(wsRaw);
  const { index } = loadIndex({ root, config });
  const node = resolveWorkNode(index, idOrQid, ws, new Set([type]), type);
  const filePath = path.resolve(root, node.path);
  const parsed = parseFrontmatter(fs.readFileSync(filePath, "utf8"), filePath);
  return { config, node, filePath, frontmatter: { ...parsed.frontmatter }, body: parsed.body };
}

function printReceipt(action: string, receipt: WorkMutationReceipt, json?: boolean): void {
  if (json) {
    console.log(JSON.stringify({ action, node: receipt }, null, 2));
    return;
  }
  console.log(`work ${action}: ${receipt.qid} (${receipt.path})`);
}

function createWorkOrderForWork(options: {
  root: string;
  ws: string;
  title: string;
  id: string;
  workId: string;
  workNode: IndexNode;
  requester: string;
  requestRef?: string;
  triggerRef?: string;
  payloadHash?: string;
  inputRefs?: string;
  queueRefs?: string;
  requestedOutputs?: string;
  constraintRefs?: string;
  contractProfile?: string;
  validationPolicyRef?: string;
  evidencePolicyRef?: string;
  now?: Date;
}): WorkOrderCreation {
  const workVersion = String(options.workNode.attributes.version ?? "0.1.0");
  const requestRef = options.requestRef ?? "request.redacted";
  const triggerRef = options.triggerRef ?? "trigger.manual";
  const inputRefs = parseCsvList(options.inputRefs);
  const queueRefs = parseCsvList(options.queueRefs);
  const requestedOutputs =
    options.requestedOutputs !== undefined
      ? parseCsvList(options.requestedOutputs)
      : toStringList(options.workNode.attributes.outputs);
  const constraintRefs = parseCsvList(options.constraintRefs);
  const payloadHash =
    normalizeSha256Ref(options.payloadHash, "--payload-hash") ??
    buildWorkOrderPayloadHash({
      workId: options.workId,
      workVersion,
      requester: options.requester,
      requestRef,
      triggerRef,
      inputRefs,
      queueRefs,
      requestedOutputs,
      constraintRefs,
    });
  const receipt = createAgentWorkflowNode({
    root: options.root,
    ws: options.ws,
    type: "work_order",
    title: options.title,
    id: options.id,
    now: options.now,
    overrides: {
      work_id: options.workId,
      work_version: workVersion,
      requester: options.requester,
      order_status: "submitted",
      request_ref: requestRef,
      trigger_ref: triggerRef,
      payload_hash: payloadHash,
      contract_profile: normalizeContractMetadataToken(options.contractProfile, "--contract-profile"),
      validation_policy_ref: options.validationPolicyRef,
      evidence_policy_ref: options.evidencePolicyRef,
      input_refs: inputRefs,
      queue_refs: queueRefs,
      requested_outputs: requestedOutputs,
      constraint_refs: constraintRefs,
      artifact_policy: "commit_sidecar_and_zip",
      relates: [options.workId],
    },
  });
  return { receipt, payloadHash, workId: options.workId, workVersion };
}

function runWorkContractNewCommandLocked(options: WorkContractNewCommandOptions): void {
  const config = loadConfig(options.root);
  const ws = normalizeWorkspace(options.ws);
  const { index } = loadIndex({ root: options.root, config });
  const agentId = normalizePortableIdRef(options.agentId, "--agent-id");
  const kind = options.kind.toLowerCase();
  const resolvedAgent = resolveQid(index, agentId, ws);
  const relates =
    resolvedAgent.status === "ok" && isManifestSemanticType(index.nodes[resolvedAgent.qid]?.type ?? "")
      ? [agentId]
      : [];
  const requiredCapabilities = parseCsvList(options.requiredCapabilities);
  const contractProfile = normalizeContractMetadataToken(options.contractProfile, "--contract-profile");
  const receipt = createAgentWorkflowNode({
    root: options.root,
    ws,
    type: "work",
    title: options.title,
    id: options.id,
    now: options.now,
    overrides: {
      agent_id: agentId,
      kind,
      contract_profile: contractProfile,
      pricing_model: normalizeEnum(options.pricingModel ?? "quoted", "--pricing-model", PRICING_MODELS),
      required_capabilities: requiredCapabilities.length > 0 ? requiredCapabilities : [kind],
      inputs: parseCsvList(options.inputs),
      outputs: parseCsvList(options.outputs),
      receipt_required: true,
      relates,
    },
  });
  printReceipt("contract created", receipt, options.json);
}

function runWorkOrderNewCommandLocked(options: WorkOrderNewCommandOptions): void {
  const config = loadConfig(options.root);
  const ws = normalizeWorkspace(options.ws);
  const { index } = loadIndex({ root: options.root, config });
  const workId = normalizePortableIdRef(options.workId, "--work-id");
  const workNode = requireReferenceNode(index, ws, workId, "work", "work contract");
  const created = createWorkOrderForWork({
    root: options.root,
    ws,
    title: options.title,
    id: options.id,
    workId,
    workNode,
    requester: options.requester,
    requestRef: options.requestRef,
    triggerRef: options.triggerRef,
    payloadHash: options.payloadHash,
    inputRefs: options.inputRefs,
    queueRefs: options.queueRefs,
    requestedOutputs: options.requestedOutputs,
    constraintRefs: options.constraintRefs,
    contractProfile: options.contractProfile,
    validationPolicyRef: options.validationPolicyRef,
    evidencePolicyRef: options.evidencePolicyRef,
    now: options.now,
  });
  printReceipt("order created", created.receipt, options.json);
}

function runWorkTriggerCommandLocked(options: WorkTriggerCommandOptions): void {
  const config = loadConfig(options.root);
  const ws = normalizeWorkspace(options.ws);
  const { index } = loadIndex({ root: options.root, config });
  const { workNode, sourceNode } = resolveTriggerWorkNode(index, ws, options.targetRef);
  const requester = options.requester ?? "user.local";
  const requestRef = "request.redacted";
  const triggerRef = "trigger.mdkg-work-trigger";
  const requestedOutputs = toStringList(workNode.attributes.outputs);
  const payloadHash = buildWorkOrderPayloadHash({
    workId: workNode.id,
    workVersion: String(workNode.attributes.version ?? "0.1.0"),
    requester,
    requestRef,
    triggerRef,
    inputRefs: [],
    queueRefs: [],
    requestedOutputs,
    constraintRefs: [],
  });
  const id = options.id
    ? normalizePortableId(options.id, "--id")
    : `order.${portableSegment(workNode.id)}.${payloadHash.slice("sha256:".length, "sha256:".length + 12)}`;
  const title = options.title ?? `Trigger ${workNode.title}`;
  const enqueueQueue = normalizeQueueName(options.enqueue);
  const queueRef = enqueueQueue ? queueRefForWorkOrder(enqueueQueue, id) : undefined;
  const queueDatabasePath = enqueueQueue ? loadWorkTriggerQueueDatabase(options.root, enqueueQueue) : undefined;
  const created = createWorkOrderForWork({
    root: options.root,
    ws,
    title,
    id,
    workId: workNode.id,
    workNode,
    requester,
    requestRef,
    triggerRef,
    payloadHash,
    queueRefs: queueRef,
    now: options.now,
  });
  let queueDelivery: WorkTriggerQueueDelivery | undefined;
  if (enqueueQueue && queueDatabasePath && queueRef) {
    const queuePayload: Record<string, unknown> = {
      kind: "mdkg.work_order.triggered",
      schema_version: 1,
      target_ref: options.targetRef,
      work_id: workNode.id,
      work_qid: workNode.qid,
      work_order_id: created.receipt.id,
      work_order_qid: created.receipt.qid,
      work_order_path: created.receipt.path,
      requester,
      request_ref: requestRef,
      trigger_ref: triggerRef,
      payload_hash: created.payloadHash,
      queue_ref: queueRef,
      executed: false,
    };
    if (sourceNode) {
      queuePayload.source_qid = sourceNode.qid;
    }
    const delivery = enqueueProjectQueueMessage(queueDatabasePath, {
      queue_name: enqueueQueue,
      message_id: created.receipt.id,
      dedupe_key: created.receipt.qid,
      payload: queuePayload,
      now_ms: options.now?.getTime(),
    });
    queueDelivery = {
      queue_name: enqueueQueue,
      queue_ref: queueRef,
      message_id: created.receipt.id,
      message: delivery.message,
      created: delivery.created,
      duplicate: delivery.duplicate,
    };
  }
  const event = appendAutomaticEvent({
    root: options.root,
    ws,
    kind: queueDelivery ? "WORK_TRIGGER_ENQUEUED" : "WORK_TRIGGERED",
    status: "ok",
    refs: [created.receipt.id, workNode.id, ...(queueRef ? [queueRef] : [])],
    notes: queueDelivery
      ? `work trigger created order mirror and enqueued ${queueDelivery.message_id} on project DB queue ${queueDelivery.queue_name}; no work executed`
      : "work trigger created order mirror; no work executed",
    now: options.now,
  });

  if (options.json) {
    console.log(
      JSON.stringify(
        {
          action: "triggered",
          node: created.receipt,
          trigger: {
            target_ref: options.targetRef,
            source_qid: sourceNode?.qid,
            work_qid: workNode.qid,
            payload_hash: created.payloadHash,
            executed: false,
            enqueue: queueDelivery
              ? {
                  requested: true,
                  queue_name: queueDelivery.queue_name,
                  queue_ref: queueDelivery.queue_ref,
                  message_id: queueDelivery.message_id,
                  enqueued: true,
                  created: queueDelivery.created,
                  duplicate: queueDelivery.duplicate,
                  message_status: queueDelivery.message.status,
                  message_payload_hash: queueDelivery.message.payload_hash,
                }
              : { requested: false },
            event_appended: event !== undefined,
          },
        },
        null,
        2
      )
    );
    return;
  }
  console.log(`work triggered: ${created.receipt.qid} (${created.receipt.path})`);
  if (queueDelivery) {
    console.log(`queue enqueued: ${queueDelivery.queue_name}/${queueDelivery.message_id}`);
  }
}

function runWorkOrderUpdateCommandLocked(options: WorkOrderUpdateCommandOptions): void {
  const loaded = loadMutableAgentNode(options.root, options.id, options.ws, "work_order");
  if (options.status) {
    loaded.frontmatter.order_status = normalizeEnum(options.status, "--status", ORDER_STATUSES);
  }
  loaded.frontmatter.input_refs = appendUnique(
    toStringList(loaded.frontmatter.input_refs),
    parseCsvList(options.addInputRefs)
  );
  loaded.frontmatter.queue_refs = appendUnique(
    toStringList(loaded.frontmatter.queue_refs),
    parseCsvList(options.addQueueRefs)
  );
  loaded.frontmatter.artifacts = appendUnique(
    toStringList(loaded.frontmatter.artifacts),
    parseCsvList(options.addArtifacts)
  );
  loaded.frontmatter.updated = formatDate(options.now ?? new Date());
  writeFrontmatterFile(loaded.filePath, loaded.frontmatter, loaded.body);
  maybeReindex(options.root, loaded.config);
  printReceipt("order updated", nodeReceipt(options.root, loaded.node), options.json);
}

function runWorkOrderStatusCommandLocked(options: WorkOrderStatusCommandOptions): void {
  const config = loadConfig(options.root);
  const ws = normalizeWorkspace(options.ws);
  const { index } = loadIndex({ root: options.root, config });
  const order = resolveReadableWorkNode(index, options.id, ws, "work_order", "work order");
  const receipt = buildWorkOrderStatusReceipt(index, order);
  if (options.json) {
    console.log(JSON.stringify(receipt, null, 2));
    return;
  }
  console.log(`${receipt.order.qid}: ${receipt.order.status ?? "unknown"}`);
  console.log(`work: ${receipt.order.work_qid ?? receipt.order.work_id ?? "unknown"}`);
  console.log(`receipts: ${receipt.receipt_count}`);
}

function runWorkReceiptNewCommandLocked(options: WorkReceiptNewCommandOptions): void {
  const config = loadConfig(options.root);
  const ws = normalizeWorkspace(options.ws);
  const { index } = loadIndex({ root: options.root, config });
  const workOrderId = normalizePortableIdRef(options.workOrderId, "--work-order-id");
  requireReferenceNode(index, ws, workOrderId, "work_order", "work order");
  const receipt = createAgentWorkflowNode({
    root: options.root,
    ws,
    type: "receipt",
    title: options.title,
    id: options.id,
    now: options.now,
    overrides: {
      work_order_id: workOrderId,
      receipt_status: normalizeEnum(options.receiptStatus ?? "recorded", "--receipt-status", RECEIPT_STATUSES),
      outcome: normalizeEnum(options.outcome, "--outcome", OUTCOMES),
      cost_ref: options.costRef ?? "cost.redacted",
      redaction_policy: normalizeEnum(
        options.redactionPolicy ?? "refs_and_hashes_only",
        "--redaction-policy",
        REDACTION_POLICIES
      ),
      contract_profile: normalizeContractMetadataToken(options.contractProfile, "--contract-profile"),
      receipt_kind: normalizeContractMetadataToken(options.receiptKind, "--receipt-kind"),
      redaction_class: normalizeContractMetadataToken(options.redactionClass, "--redaction-class"),
      validation_policy_ref: options.validationPolicyRef,
      evidence_policy_ref: options.evidencePolicyRef,
      artifacts: parseCsvList(options.artifacts),
      proof_refs: parseCsvList(options.proofRefs),
      attestation_refs: parseCsvList(options.attestationRefs),
      evidence_hashes: normalizeSha256Refs(options.evidenceHashes, "--evidence-hashes"),
      input_hashes: normalizeSha256Refs(options.inputHashes, "--input-hashes"),
      output_hashes: normalizeSha256Refs(options.outputHashes, "--output-hashes"),
      relates: [workOrderId],
    },
  });
  printReceipt("receipt created", receipt, options.json);
}

function runWorkReceiptUpdateCommandLocked(options: WorkReceiptUpdateCommandOptions): void {
  const loaded = loadMutableAgentNode(options.root, options.id, options.ws, "receipt");
  if (options.receiptStatus) {
    loaded.frontmatter.receipt_status = normalizeEnum(
      options.receiptStatus,
      "--receipt-status",
      RECEIPT_STATUSES
    );
  }
  loaded.frontmatter.artifacts = appendUnique(
    toStringList(loaded.frontmatter.artifacts),
    parseCsvList(options.addArtifacts)
  );
  loaded.frontmatter.proof_refs = appendUnique(
    toStringList(loaded.frontmatter.proof_refs),
    parseCsvList(options.addProofRefs)
  );
  loaded.frontmatter.attestation_refs = appendUnique(
    toStringList(loaded.frontmatter.attestation_refs),
    parseCsvList(options.addAttestationRefs)
  );
  loaded.frontmatter.evidence_hashes = appendUnique(
    toStringList(loaded.frontmatter.evidence_hashes),
    normalizeSha256Refs(options.addEvidenceHashes, "--add-evidence-hashes")
  );
  loaded.frontmatter.updated = formatDate(options.now ?? new Date());
  writeFrontmatterFile(loaded.filePath, loaded.frontmatter, loaded.body);
  maybeReindex(options.root, loaded.config);
  printReceipt("receipt updated", nodeReceipt(options.root, loaded.node), options.json);
}

function runWorkReceiptVerifyCommandLocked(options: WorkReceiptVerifyCommandOptions): void {
  const config = loadConfig(options.root);
  const ws = normalizeWorkspace(options.ws);
  const { index } = loadIndex({ root: options.root, config });
  const receiptNode = resolveReadableWorkNode(index, options.id, ws, "receipt", "receipt");
  const receipt = buildWorkReceiptVerifyReceipt(index, receiptNode);
  if (options.json) {
    console.log(JSON.stringify(receipt, null, 2));
    if (!receipt.ok) {
      throw new ValidationError("receipt verification failed");
    }
    return;
  }
  console.log(`${receipt.receipt.qid}: ${receipt.ok ? "ok" : "failed"}`);
  for (const check of receipt.checks) {
    console.log(`- ${check.name}: ${check.ok ? "ok" : "failed"} - ${check.detail}`);
  }
  for (const warning of receipt.warnings) {
    console.log(`warning: ${warning}`);
  }
  if (!receipt.ok) {
    throw new ValidationError("receipt verification failed");
  }
}

function runWorkArtifactAddCommandLocked(options: WorkArtifactAddCommandOptions): void {
  const config = loadConfig(options.root);
  const ws = normalizeWorkspace(options.ws);
  const { index } = loadIndex({ root: options.root, config });
  const target = resolveWorkNode(
    index,
    options.targetId,
    ws,
    new Set(["work_order", "receipt"]),
    "work order or receipt"
  );

  const archiveLogs: string[] = [];
  const originalLog = console.log;
  console.log = (...args: unknown[]) => {
    archiveLogs.push(args.map(String).join(" "));
  };
  let archivePayload: { archive?: { id: string; archive_uri: string } } = {};
  try {
    runArchiveAddCommand({
      root: options.root,
      ws: target.ws,
      file: options.file,
      id: options.id,
      kind: options.kind ?? (target.type === "work_order" ? "source" : "artifact"),
      relates: target.id,
      json: true,
      now: options.now,
    });
    archivePayload = JSON.parse(archiveLogs.join("\n"));
  } finally {
    console.log = originalLog;
  }

  const archiveUri = archivePayload.archive?.archive_uri;
  if (!archiveUri) {
    throw new Error("archive add did not return an archive URI");
  }
  const loaded = loadMutableAgentNode(options.root, target.qid, target.ws, target.type);
  const archiveKind = (options.kind ?? (target.type === "work_order" ? "source" : "artifact")).toLowerCase();
  if (target.type === "work_order" && archiveKind === "source") {
    loaded.frontmatter.input_refs = appendUnique(toStringList(loaded.frontmatter.input_refs), [archiveUri]);
  } else {
    loaded.frontmatter.artifacts = appendUnique(toStringList(loaded.frontmatter.artifacts), [archiveUri]);
  }
  if (archivePayload.archive?.id) {
    loaded.frontmatter.relates = appendUnique(toStringList(loaded.frontmatter.relates), [archivePayload.archive.id]);
  }
  loaded.frontmatter.updated = formatDate(options.now ?? new Date());
  writeFrontmatterFile(loaded.filePath, loaded.frontmatter, loaded.body);
  maybeReindex(options.root, loaded.config);

  if (options.json) {
    console.log(
      JSON.stringify(
        {
          action: "artifact_registered",
          target: nodeReceipt(options.root, target),
          archive: archivePayload.archive,
        },
        null,
        2
      )
    );
    return;
  }
  console.log(`work artifact registered: ${target.qid} -> ${archiveUri}`);
}

function withWorkLock<T>(root: string, fn: () => T): T {
  const config = loadConfig(root);
  return withMutationLock(root, config.index.lock_timeout_ms, fn);
}

export function runWorkContractNewCommand(options: WorkContractNewCommandOptions): void {
  return withWorkLock(options.root, () => runWorkContractNewCommandLocked(options));
}

export function runWorkOrderNewCommand(options: WorkOrderNewCommandOptions): void {
  return withWorkLock(options.root, () => runWorkOrderNewCommandLocked(options));
}

export function runWorkOrderUpdateCommand(options: WorkOrderUpdateCommandOptions): void {
  return withWorkLock(options.root, () => runWorkOrderUpdateCommandLocked(options));
}

export function runWorkOrderStatusCommand(options: WorkOrderStatusCommandOptions): void {
  return runWorkOrderStatusCommandLocked(options);
}

export function runWorkTriggerCommand(options: WorkTriggerCommandOptions): void {
  return withWorkLock(options.root, () => runWorkTriggerCommandLocked(options));
}

export function runWorkReceiptNewCommand(options: WorkReceiptNewCommandOptions): void {
  return withWorkLock(options.root, () => runWorkReceiptNewCommandLocked(options));
}

export function runWorkReceiptUpdateCommand(options: WorkReceiptUpdateCommandOptions): void {
  return withWorkLock(options.root, () => runWorkReceiptUpdateCommandLocked(options));
}

export function runWorkReceiptVerifyCommand(options: WorkReceiptVerifyCommandOptions): void {
  return runWorkReceiptVerifyCommandLocked(options);
}

export function runWorkValidateCommand(options: WorkValidateCommandOptions): void {
  return printWorkValidateReceipt(buildWorkValidateReceipt(options), options.json);
}

export function runWorkArtifactAddCommand(options: WorkArtifactAddCommandOptions): void {
  return withWorkLock(options.root, () => runWorkArtifactAddCommandLocked(options));
}
