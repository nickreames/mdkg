import path from "path";
import { FrontmatterValue } from "./frontmatter";
import { isPortableId } from "../util/id";

export const AGENT_FILE_TYPES = [
  "spec",
  "work",
  "work_order",
  "receipt",
  "feedback",
  "dispute",
  "proposal",
] as const;

export type AgentFileType = (typeof AGENT_FILE_TYPES)[number];

export const AGENT_FILE_BASENAMES: Record<AgentFileType, string> = {
  spec: "SPEC.md",
  work: "WORK.md",
  work_order: "WORK_ORDER.md",
  receipt: "RECEIPT.md",
  feedback: "FEEDBACK.md",
  dispute: "DISPUTE.md",
  proposal: "PROPOSAL.md",
};

export const AGENT_ATTRIBUTE_KEY_ORDER: Record<AgentFileType, string[]> = {
  spec: [
    "version",
    "role",
    "runtime_mode",
    "work_contracts",
    "requested_capabilities",
    "skill_refs",
    "tool_refs",
    "model_refs",
    "wasm_component_refs",
    "runtime_image_refs",
    "subagent_refs",
    "resource_profile",
    "update_policy",
  ],
  work: [
    "version",
    "agent_id",
    "kind",
    "pricing_model",
    "required_capabilities",
    "skill_refs",
    "tool_refs",
    "model_refs",
    "wasm_component_refs",
    "runtime_image_refs",
    "subagent_refs",
    "inputs",
    "outputs",
    "receipt_required",
  ],
  work_order: [
    "version",
    "work_id",
    "work_version",
    "requester",
    "order_status",
    "request_ref",
  ],
  receipt: [
    "version",
    "work_order_id",
    "receipt_status",
    "outcome",
    "cost_ref",
  ],
  feedback: [
    "version",
    "target_id",
    "sentiment",
    "feedback_status",
    "source_ref",
  ],
  dispute: [
    "version",
    "work_order_id",
    "receipt_id",
    "dispute_status",
    "severity",
  ],
  proposal: [
    "version",
    "target_id",
    "proposal_status",
    "proposal_kind",
    "evidence_refs",
  ],
};

const SEMVER_RE = /^\d+\.\d+\.\d+(?:[-+][a-z0-9.-]+)?$/;
const LOWER_TOKEN_RE = /^[a-z][a-z0-9_]*(?:-[a-z0-9_]+)*$/;
const FIELD_DESCRIPTOR_RE = /^[a-z][a-z0-9_]*:[a-z][a-z0-9_]*(?::(?:required|optional))?$/;

const ROLE_VALUES = new Set([
  "orchestrator",
  "subagent",
  "standalone_agent",
  "tool_service",
  "remote_agent",
]);
const RUNTIME_MODE_VALUES = new Set([
  "room_orchestrated",
  "standalone",
  "tool_service",
  "remote",
]);
const UPDATE_POLICY_VALUES = new Set([
  "manual",
  "proposal_required",
  "automatic",
  "disabled",
]);
const PRICING_MODEL_VALUES = new Set([
  "free",
  "included",
  "quoted",
  "fixed",
  "metered",
  "subscription",
]);
const ORDER_STATUS_VALUES = new Set([
  "submitted",
  "accepted",
  "running",
  "completed",
  "cancelled",
  "failed",
]);
const RECEIPT_STATUS_VALUES = new Set(["recorded", "verified", "rejected"]);
const OUTCOME_VALUES = new Set(["success", "partial", "failure"]);
const SENTIMENT_VALUES = new Set(["positive", "neutral", "negative", "mixed"]);
const FEEDBACK_STATUS_VALUES = new Set(["new", "triaged", "accepted", "rejected"]);
const DISPUTE_STATUS_VALUES = new Set(["open", "investigating", "resolved", "rejected"]);
const SEVERITY_VALUES = new Set(["low", "medium", "high", "critical"]);
const PROPOSAL_STATUS_VALUES = new Set([
  "proposed",
  "accepted",
  "rejected",
  "superseded",
  "implemented",
]);
const PROPOSAL_KIND_VALUES = new Set([
  "spec_update",
  "work_update",
  "skill_update",
  "policy_update",
  "documentation",
]);

function formatError(filePath: string, message: string): Error {
  return new Error(`${filePath}: ${message}`);
}

export function isAgentFileType(type: string): type is AgentFileType {
  return (AGENT_FILE_TYPES as readonly string[]).includes(type);
}

export function validateAgentFileName(type: AgentFileType, filePath: string): void {
  const expected = AGENT_FILE_BASENAMES[type];
  if (path.basename(filePath) !== expected) {
    throw formatError(filePath, `${type} files must be named ${expected}`);
  }
}

function expectString(
  frontmatter: Record<string, FrontmatterValue>,
  key: string,
  filePath: string
): string {
  const value = frontmatter[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw formatError(filePath, `${key} is required and must be a non-empty string`);
  }
  if (value !== value.toLowerCase()) {
    throw formatError(filePath, `${key} must be lowercase`);
  }
  return value;
}

function optionalString(
  frontmatter: Record<string, FrontmatterValue>,
  key: string,
  filePath: string
): string | undefined {
  const value = frontmatter[key];
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "string" || value.trim().length === 0) {
    throw formatError(filePath, `${key} must be a non-empty string`);
  }
  if (value !== value.toLowerCase()) {
    throw formatError(filePath, `${key} must be lowercase`);
  }
  return value;
}

function expectBoolean(
  frontmatter: Record<string, FrontmatterValue>,
  key: string,
  filePath: string
): boolean {
  const value = frontmatter[key];
  if (typeof value !== "boolean") {
    throw formatError(filePath, `${key} is required and must be a boolean`);
  }
  return value;
}

function expectList(
  frontmatter: Record<string, FrontmatterValue>,
  key: string,
  filePath: string
): string[] {
  const value = frontmatter[key];
  if (!Array.isArray(value)) {
    throw formatError(filePath, `${key} is required and must be a list`);
  }
  return value as string[];
}

function optionalList(
  frontmatter: Record<string, FrontmatterValue>,
  key: string,
  filePath: string
): string[] {
  const value = frontmatter[key];
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value)) {
    throw formatError(filePath, `${key} must be a list`);
  }
  return value as string[];
}

function requirePortableId(value: string, key: string, filePath: string): void {
  if (!isPortableId(value)) {
    throw formatError(filePath, `${key} must be a lowercase portable id`);
  }
}

function requireSemver(value: string, key: string, filePath: string): void {
  if (!SEMVER_RE.test(value)) {
    throw formatError(filePath, `${key} must be a semantic version like 1.0.0`);
  }
}

function requireEnum(value: string, key: string, allowed: Set<string>, filePath: string): void {
  if (!allowed.has(value)) {
    throw formatError(filePath, `${key} must be one of ${Array.from(allowed).join(", ")}`);
  }
}

function requireLowerToken(value: string, key: string, filePath: string): void {
  if (!LOWER_TOKEN_RE.test(value)) {
    throw formatError(filePath, `${key} must be lowercase snake/kebab style`);
  }
}

function validateCapabilities(values: string[], key: string, filePath: string): void {
  for (const [index, value] of values.entries()) {
    if (value !== value.toLowerCase()) {
      throw formatError(filePath, `${key}[${index}] must be lowercase`);
    }
    if (!isPortableId(value)) {
      throw formatError(filePath, `${key}[${index}] must be a portable capability id`);
    }
  }
}

function validatePortableRefs(values: string[], key: string, filePath: string): void {
  for (const [index, value] of values.entries()) {
    if (value !== value.toLowerCase()) {
      throw formatError(filePath, `${key}[${index}] must be lowercase`);
    }
    if (!isPortableId(value)) {
      throw formatError(filePath, `${key}[${index}] must be a lowercase portable id`);
    }
  }
}

function validateRelativeMarkdownPaths(
  values: string[],
  key: string,
  basename: string,
  filePath: string
): void {
  for (const [index, value] of values.entries()) {
    if (path.isAbsolute(value) || value.split(/[\\/]/).includes("..")) {
      throw formatError(filePath, `${key}[${index}] must be a relative path`);
    }
    if (path.basename(value) !== basename) {
      throw formatError(filePath, `${key}[${index}] must point to ${basename}`);
    }
  }
}

function validateFieldDescriptors(values: string[], key: string, filePath: string): void {
  if (values.length === 0) {
    throw formatError(filePath, `${key} must not be empty`);
  }
  for (const [index, value] of values.entries()) {
    if (value !== value.toLowerCase() || !FIELD_DESCRIPTOR_RE.test(value)) {
      throw formatError(
        filePath,
        `${key}[${index}] must use name:type or name:type:required|optional`
      );
    }
  }
}

export function validateAgentFrontmatter(
  type: string,
  frontmatter: Record<string, FrontmatterValue>,
  filePath: string
): void {
  if (!isAgentFileType(type)) {
    return;
  }

  validateAgentFileName(type, filePath);

  const version = expectString(frontmatter, "version", filePath);
  requireSemver(version, "version", filePath);

  switch (type) {
    case "spec": {
      const role = expectString(frontmatter, "role", filePath);
      requireEnum(role, "role", ROLE_VALUES, filePath);
      const runtimeMode = expectString(frontmatter, "runtime_mode", filePath);
      requireEnum(runtimeMode, "runtime_mode", RUNTIME_MODE_VALUES, filePath);
      const updatePolicy = expectString(frontmatter, "update_policy", filePath);
      requireEnum(updatePolicy, "update_policy", UPDATE_POLICY_VALUES, filePath);
      validateRelativeMarkdownPaths(
        optionalList(frontmatter, "work_contracts", filePath),
        "work_contracts",
        "WORK.md",
        filePath
      );
      validateCapabilities(
        optionalList(frontmatter, "requested_capabilities", filePath),
        "requested_capabilities",
        filePath
      );
      validatePortableRefs(
        optionalList(frontmatter, "skill_refs", filePath),
        "skill_refs",
        filePath
      );
      validatePortableRefs(
        optionalList(frontmatter, "tool_refs", filePath),
        "tool_refs",
        filePath
      );
      validatePortableRefs(
        optionalList(frontmatter, "model_refs", filePath),
        "model_refs",
        filePath
      );
      validatePortableRefs(
        optionalList(frontmatter, "wasm_component_refs", filePath),
        "wasm_component_refs",
        filePath
      );
      validatePortableRefs(
        optionalList(frontmatter, "runtime_image_refs", filePath),
        "runtime_image_refs",
        filePath
      );
      validatePortableRefs(
        optionalList(frontmatter, "subagent_refs", filePath),
        "subagent_refs",
        filePath
      );
      const resourceProfile = optionalString(frontmatter, "resource_profile", filePath);
      if (resourceProfile) {
        requireLowerToken(resourceProfile, "resource_profile", filePath);
      }
      break;
    }
    case "work": {
      const agentId = expectString(frontmatter, "agent_id", filePath);
      requirePortableId(agentId, "agent_id", filePath);
      const kind = expectString(frontmatter, "kind", filePath);
      requireLowerToken(kind, "kind", filePath);
      const pricingModel = expectString(frontmatter, "pricing_model", filePath);
      requireEnum(pricingModel, "pricing_model", PRICING_MODEL_VALUES, filePath);
      validateCapabilities(
        expectList(frontmatter, "required_capabilities", filePath),
        "required_capabilities",
        filePath
      );
      validatePortableRefs(
        optionalList(frontmatter, "skill_refs", filePath),
        "skill_refs",
        filePath
      );
      validatePortableRefs(
        optionalList(frontmatter, "tool_refs", filePath),
        "tool_refs",
        filePath
      );
      validatePortableRefs(
        optionalList(frontmatter, "model_refs", filePath),
        "model_refs",
        filePath
      );
      validatePortableRefs(
        optionalList(frontmatter, "wasm_component_refs", filePath),
        "wasm_component_refs",
        filePath
      );
      validatePortableRefs(
        optionalList(frontmatter, "runtime_image_refs", filePath),
        "runtime_image_refs",
        filePath
      );
      validatePortableRefs(
        optionalList(frontmatter, "subagent_refs", filePath),
        "subagent_refs",
        filePath
      );
      validateFieldDescriptors(expectList(frontmatter, "inputs", filePath), "inputs", filePath);
      validateFieldDescriptors(expectList(frontmatter, "outputs", filePath), "outputs", filePath);
      expectBoolean(frontmatter, "receipt_required", filePath);
      break;
    }
    case "work_order": {
      const workId = expectString(frontmatter, "work_id", filePath);
      requirePortableId(workId, "work_id", filePath);
      const workVersion = expectString(frontmatter, "work_version", filePath);
      requireSemver(workVersion, "work_version", filePath);
      const requester = expectString(frontmatter, "requester", filePath);
      requirePortableId(requester, "requester", filePath);
      const orderStatus = expectString(frontmatter, "order_status", filePath);
      requireEnum(orderStatus, "order_status", ORDER_STATUS_VALUES, filePath);
      optionalString(frontmatter, "request_ref", filePath);
      break;
    }
    case "receipt": {
      const workOrderId = expectString(frontmatter, "work_order_id", filePath);
      requirePortableId(workOrderId, "work_order_id", filePath);
      const receiptStatus = expectString(frontmatter, "receipt_status", filePath);
      requireEnum(receiptStatus, "receipt_status", RECEIPT_STATUS_VALUES, filePath);
      const outcome = expectString(frontmatter, "outcome", filePath);
      requireEnum(outcome, "outcome", OUTCOME_VALUES, filePath);
      optionalString(frontmatter, "cost_ref", filePath);
      break;
    }
    case "feedback": {
      const targetId = expectString(frontmatter, "target_id", filePath);
      requirePortableId(targetId, "target_id", filePath);
      const sentiment = expectString(frontmatter, "sentiment", filePath);
      requireEnum(sentiment, "sentiment", SENTIMENT_VALUES, filePath);
      const feedbackStatus = expectString(frontmatter, "feedback_status", filePath);
      requireEnum(feedbackStatus, "feedback_status", FEEDBACK_STATUS_VALUES, filePath);
      optionalString(frontmatter, "source_ref", filePath);
      break;
    }
    case "dispute": {
      const workOrderId = expectString(frontmatter, "work_order_id", filePath);
      requirePortableId(workOrderId, "work_order_id", filePath);
      const receiptId = expectString(frontmatter, "receipt_id", filePath);
      requirePortableId(receiptId, "receipt_id", filePath);
      const disputeStatus = expectString(frontmatter, "dispute_status", filePath);
      requireEnum(disputeStatus, "dispute_status", DISPUTE_STATUS_VALUES, filePath);
      const severity = expectString(frontmatter, "severity", filePath);
      requireEnum(severity, "severity", SEVERITY_VALUES, filePath);
      break;
    }
    case "proposal": {
      const targetId = expectString(frontmatter, "target_id", filePath);
      requirePortableId(targetId, "target_id", filePath);
      const proposalStatus = expectString(frontmatter, "proposal_status", filePath);
      requireEnum(proposalStatus, "proposal_status", PROPOSAL_STATUS_VALUES, filePath);
      const proposalKind = expectString(frontmatter, "proposal_kind", filePath);
      requireEnum(proposalKind, "proposal_kind", PROPOSAL_KIND_VALUES, filePath);
      validatePortableRefs(optionalList(frontmatter, "evidence_refs", filePath), "evidence_refs", filePath);
      break;
    }
  }
}

export function extractAgentAttributes(
  type: string,
  frontmatter: Record<string, FrontmatterValue>
): Record<string, FrontmatterValue> {
  if (!isAgentFileType(type)) {
    return {};
  }
  const attributes: Record<string, FrontmatterValue> = {};
  for (const key of AGENT_ATTRIBUTE_KEY_ORDER[type]) {
    const value = frontmatter[key];
    if (value !== undefined) {
      attributes[key] = value;
    }
  }
  return attributes;
}
