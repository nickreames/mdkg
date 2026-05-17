import fs from "fs";
import path from "path";
import { loadConfig } from "../core/config";
import {
  DEFAULT_FRONTMATTER_KEY_ORDER,
  formatFrontmatter,
  FrontmatterValue,
  parseFrontmatter,
} from "../graph/frontmatter";
import { buildIndex, Index, IndexNode } from "../graph/indexer";
import { loadIndex, writeIndex } from "../graph/index_cache";
import { AGENT_FILE_BASENAMES, AgentFileType } from "../graph/agent_file_types";
import { loadTemplate, renderTemplate } from "../templates/loader";
import { formatDate } from "../util/date";
import { NotFoundError, UsageError } from "../util/errors";
import { isPortableId } from "../util/id";
import { appendAutomaticEvent } from "./event_support";
import { runArchiveAddCommand } from "./archive";

export type WorkContractNewCommandOptions = {
  root: string;
  title: string;
  id: string;
  agentId: string;
  kind: string;
  inputs: string;
  outputs: string;
  ws?: string;
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
  inputRefs?: string;
  requestedOutputs?: string;
  constraintRefs?: string;
  json?: boolean;
  now?: Date;
};

export type WorkOrderUpdateCommandOptions = {
  root: string;
  id: string;
  ws?: string;
  status?: string;
  addInputRefs?: string;
  addArtifacts?: string;
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
  artifacts?: string;
  proofRefs?: string;
  attestationRefs?: string;
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
  json?: boolean;
  now?: Date;
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

const PRICING_MODELS = new Set(["free", "included", "quoted", "fixed", "metered", "subscription"]);
const ORDER_STATUSES = new Set(["submitted", "accepted", "running", "completed", "cancelled", "failed"]);
const RECEIPT_STATUSES = new Set(["recorded", "verified", "rejected"]);
const OUTCOMES = new Set(["success", "partial", "failure"]);

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

function normalizeEnum(value: string, flag: string, allowed: Set<string>): string {
  const normalized = value.toLowerCase();
  if (!allowed.has(normalized)) {
    throw new UsageError(`${flag} must be one of ${Array.from(allowed).join(", ")}`);
  }
  return normalized;
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
  const outputPath = path.resolve(root, config.index.global_index_path);
  writeIndex(outputPath, buildIndex(root, config, { tolerant: config.index.tolerant }));
}

function findNodeById(index: Index, ws: string, id: string, type?: string): IndexNode | undefined {
  const node = index.nodes[`${ws}:${id}`];
  if (!node) {
    return undefined;
  }
  if (type && node.type !== type) {
    return undefined;
  }
  return node;
}

function requireNodeById(index: Index, ws: string, id: string, type: string, label: string): IndexNode {
  const node = findNodeById(index, ws, id, type);
  if (!node) {
    throw new NotFoundError(`${label} not found: ${id}`);
  }
  return node;
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

function writeFrontmatterFile(
  filePath: string,
  frontmatter: Record<string, FrontmatterValue>,
  body: string
): void {
  const lines = formatFrontmatter(frontmatter, DEFAULT_FRONTMATTER_KEY_ORDER);
  const content = ["---", ...lines, "---", body.trimStart()].join("\n");
  fs.writeFileSync(filePath, content.endsWith("\n") ? content : `${content}\n`, "utf8");
}

function createAgentWorkflowNode(options: {
  root: string;
  type: AgentFileType;
  title: string;
  id: string;
  ws?: string;
  overrides: Record<string, FrontmatterValue>;
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
  const content = renderTemplate(template, {
    id,
    type: options.type,
    title: options.title,
    created: today,
    updated: today,
    ...options.overrides,
  });
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
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

function loadMutableAgentNode(root: string, id: string, wsRaw: string | undefined, type: string): {
  config: ReturnType<typeof loadConfig>;
  node: IndexNode;
  filePath: string;
  frontmatter: Record<string, FrontmatterValue>;
  body: string;
} {
  const config = loadConfig(root);
  const ws = normalizeWorkspace(wsRaw);
  const { index } = loadIndex({ root, config });
  const normalizedId = normalizePortableId(id, `<${type}-id>`);
  const node = requireNodeById(index, ws, normalizedId, type, type);
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

export function runWorkContractNewCommand(options: WorkContractNewCommandOptions): void {
  const config = loadConfig(options.root);
  const ws = normalizeWorkspace(options.ws);
  const { index } = loadIndex({ root: options.root, config });
  const agentId = normalizePortableId(options.agentId, "--agent-id");
  const relates = findNodeById(index, ws, agentId, "spec") ? [agentId] : [];
  const receipt = createAgentWorkflowNode({
    root: options.root,
    ws,
    type: "work",
    title: options.title,
    id: options.id,
    now: options.now,
    overrides: {
      agent_id: agentId,
      kind: options.kind.toLowerCase(),
      pricing_model: normalizeEnum(options.pricingModel ?? "quoted", "--pricing-model", PRICING_MODELS),
      required_capabilities: parseCsvList(options.requiredCapabilities),
      inputs: parseCsvList(options.inputs),
      outputs: parseCsvList(options.outputs),
      receipt_required: true,
      relates,
    },
  });
  printReceipt("contract created", receipt, options.json);
}

export function runWorkOrderNewCommand(options: WorkOrderNewCommandOptions): void {
  const config = loadConfig(options.root);
  const ws = normalizeWorkspace(options.ws);
  const { index } = loadIndex({ root: options.root, config });
  const workId = normalizePortableId(options.workId, "--work-id");
  const workNode = requireNodeById(index, ws, workId, "work", "work contract");
  const workVersion = String(workNode.attributes.version ?? "0.1.0");
  const receipt = createAgentWorkflowNode({
    root: options.root,
    ws,
    type: "work_order",
    title: options.title,
    id: options.id,
    now: options.now,
    overrides: {
      work_id: workId,
      work_version: workVersion,
      requester: options.requester,
      order_status: "submitted",
      request_ref: options.requestRef ?? "request.redacted",
      input_refs: parseCsvList(options.inputRefs),
      requested_outputs: parseCsvList(options.requestedOutputs),
      constraint_refs: parseCsvList(options.constraintRefs),
      artifact_policy: "commit_sidecar_and_zip",
      relates: [workId],
    },
  });
  printReceipt("order created", receipt, options.json);
}

export function runWorkOrderUpdateCommand(options: WorkOrderUpdateCommandOptions): void {
  const loaded = loadMutableAgentNode(options.root, options.id, options.ws, "work_order");
  if (options.status) {
    loaded.frontmatter.order_status = normalizeEnum(options.status, "--status", ORDER_STATUSES);
  }
  loaded.frontmatter.input_refs = appendUnique(
    toStringList(loaded.frontmatter.input_refs),
    parseCsvList(options.addInputRefs)
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

export function runWorkReceiptNewCommand(options: WorkReceiptNewCommandOptions): void {
  const config = loadConfig(options.root);
  const ws = normalizeWorkspace(options.ws);
  const { index } = loadIndex({ root: options.root, config });
  const workOrderId = normalizePortableId(options.workOrderId, "--work-order-id");
  requireNodeById(index, ws, workOrderId, "work_order", "work order");
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
      artifacts: parseCsvList(options.artifacts),
      proof_refs: parseCsvList(options.proofRefs),
      attestation_refs: parseCsvList(options.attestationRefs),
      input_hashes: parseCsvList(options.inputHashes),
      output_hashes: parseCsvList(options.outputHashes),
      relates: [workOrderId],
    },
  });
  printReceipt("receipt created", receipt, options.json);
}

export function runWorkReceiptUpdateCommand(options: WorkReceiptUpdateCommandOptions): void {
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
  loaded.frontmatter.updated = formatDate(options.now ?? new Date());
  writeFrontmatterFile(loaded.filePath, loaded.frontmatter, loaded.body);
  maybeReindex(options.root, loaded.config);
  printReceipt("receipt updated", nodeReceipt(options.root, loaded.node), options.json);
}

export function runWorkArtifactAddCommand(options: WorkArtifactAddCommandOptions): void {
  const config = loadConfig(options.root);
  const ws = normalizeWorkspace(options.ws);
  const { index } = loadIndex({ root: options.root, config });
  const targetId = normalizePortableId(options.targetId, "<order-or-receipt-id>");
  const target = index.nodes[`${ws}:${targetId}`];
  if (!target || (target.type !== "work_order" && target.type !== "receipt")) {
    throw new NotFoundError(`work order or receipt not found: ${options.targetId}`);
  }

  const archiveLogs: string[] = [];
  const originalLog = console.log;
  console.log = (...args: unknown[]) => {
    archiveLogs.push(args.map(String).join(" "));
  };
  let archivePayload: { archive?: { id: string; archive_uri: string } } = {};
  try {
    runArchiveAddCommand({
      root: options.root,
      ws,
      file: options.file,
      id: options.id,
      kind: options.kind ?? (target.type === "work_order" ? "source" : "artifact"),
      relates: targetId,
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
  const loaded = loadMutableAgentNode(options.root, targetId, ws, target.type);
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
