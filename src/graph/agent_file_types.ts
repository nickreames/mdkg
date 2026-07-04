import path from "path";
import { FrontmatterValue } from "./frontmatter";
import { isPortableId, isPortableIdRef } from "../util/id";
import { isSha256Ref, validatePortableOrUriRef } from "../util/refs";

export const CANONICAL_MANIFEST_BASENAME = "MANIFEST.md";
export const LEGACY_SPEC_BASENAME = "SPEC.md";

export const AGENT_FILE_TYPES = [
  "manifest",
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
  manifest: CANONICAL_MANIFEST_BASENAME,
  spec: LEGACY_SPEC_BASENAME,
  work: "WORK.md",
  work_order: "WORK_ORDER.md",
  receipt: "RECEIPT.md",
  feedback: "FEEDBACK.md",
  dispute: "DISPUTE.md",
  proposal: "PROPOSAL.md",
};

const MANIFEST_ATTRIBUTE_KEYS = [
  "version",
  "spec_kind",
  "role",
  "runtime_mode",
  "work_contracts",
  "contract_profile",
  "validation_policy_ref",
  "evidence_policy_ref",
  "requested_capabilities",
  "skill_refs",
  "tool_refs",
  "model_refs",
  "wasm_component_refs",
  "runtime_image_refs",
  "subagent_refs",
  "resource_profile",
  "update_policy",
];

export const AGENT_ATTRIBUTE_KEY_ORDER: Record<AgentFileType, string[]> = {
  manifest: MANIFEST_ATTRIBUTE_KEYS,
  spec: MANIFEST_ATTRIBUTE_KEYS,
  work: [
    "version",
    "agent_id",
    "kind",
    "contract_profile",
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
    "trigger_ref",
    "payload_hash",
    "contract_profile",
    "validation_policy_ref",
    "evidence_policy_ref",
    "input_refs",
    "queue_refs",
    "requested_outputs",
    "constraint_refs",
    "artifact_policy",
  ],
  receipt: [
    "version",
    "work_order_id",
    "receipt_status",
    "outcome",
    "cost_ref",
    "redaction_policy",
    "contract_profile",
    "receipt_kind",
    "redaction_class",
    "validation_policy_ref",
    "evidence_policy_ref",
    "proof_refs",
    "attestation_refs",
    "evidence_hashes",
    "input_hashes",
    "output_hashes",
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

export const KNOWN_CONTRACT_PROFILES = new Set(["generic", "omni-room"]);
export const KNOWN_RECEIPT_KINDS = new Set(["worker", "final", "cleanup", "audit"]);
export const KNOWN_REDACTION_CLASSES = new Set(["public", "internal", "private", "restricted"]);

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
const SPEC_KIND_VALUES = new Set([
  "cli_tool",
  "api",
  "agent",
  "runtime_agent",
  "capability",
  "tool",
  "model",
  "runtime_image",
  "integration",
  "project_service",
]);
const DOCUMENTATION_ONLY_SPEC_KIND_ROUTES: Record<string, string> = {
  gap_register: "use an EDD, task, checkpoint, or goal for gap registers",
  checkpoint: "use a checkpoint node for checkpoint evidence",
  roadmap: "use an epic, goal, EDD, or PRD for roadmaps",
  audit: "use a task, checkpoint, or EDD for audits",
  go_no_go: "use a DEC, task, or checkpoint for go/no-go notes",
  planning_note: "use an EDD, task, or checkpoint for planning notes",
  launch_checklist: "use a task, test, checkpoint, or DEC for launch checklists",
};
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
const RECEIPT_STATUS_VALUES = new Set(["recorded", "verified", "rejected", "superseded"]);
const OUTCOME_VALUES = new Set(["success", "partial", "failure"]);
const REDACTION_POLICY_VALUES = new Set([
  "refs_and_hashes_only",
  "redacted_summary",
  "external_private",
]);
const ARTIFACT_POLICY_VALUES = new Set([
  "commit_sidecar_and_zip",
  "external_only",
  "local_only",
]);
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

export function isManifestSemanticType(type: string): type is "manifest" | "spec" {
  return type === "manifest" || type === "spec";
}

export function collectManifestSiblingConflicts(
  filePaths: string[],
  formatDir: (dirPath: string) => string
): string[] {
  const basenamesByDir = new Map<string, Set<string>>();
  for (const filePath of filePaths) {
    const basename = path.basename(filePath);
    if (basename !== CANONICAL_MANIFEST_BASENAME && basename !== LEGACY_SPEC_BASENAME) {
      continue;
    }
    const dirPath = path.dirname(filePath);
    const basenames = basenamesByDir.get(dirPath) ?? new Set<string>();
    basenames.add(basename);
    basenamesByDir.set(dirPath, basenames);
  }

  const conflicts: string[] = [];
  for (const [dirPath, basenames] of Array.from(basenamesByDir.entries()).sort()) {
    if (basenames.has(CANONICAL_MANIFEST_BASENAME) && basenames.has(LEGACY_SPEC_BASENAME)) {
      conflicts.push(
        `${formatDir(dirPath)}: MANIFEST.md and SPEC.md cannot both exist in the same logical Omni unit; keep MANIFEST.md and remove the legacy SPEC.md alias`
      );
    }
  }
  return conflicts;
}

export function validateAgentFileName(type: AgentFileType, filePath: string): void {
  const basename = path.basename(filePath);
  if (type === "spec" && basename === CANONICAL_MANIFEST_BASENAME) {
    return;
  }
  const expected = AGENT_FILE_BASENAMES[type];
  if (basename !== expected) {
    if (isManifestSemanticType(type)) {
      throw formatError(
        filePath,
        `manifest files must be named MANIFEST.md (canonical) or SPEC.md (legacy alias); ${type} files must be named ${expected}`
      );
    }
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

function expectRefString(
  frontmatter: Record<string, FrontmatterValue>,
  key: string,
  filePath: string
): string {
  const value = frontmatter[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw formatError(filePath, `${key} is required and must be a non-empty string`);
  }
  return value;
}

function optionalRefString(
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

function requirePortableIdRef(value: string, key: string, filePath: string): void {
  if (value !== value.toLowerCase() || !isPortableIdRef(value)) {
    throw formatError(filePath, `${key} must be a lowercase portable id or qid`);
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

function validateSpecKind(value: string, filePath: string): void {
  if (SPEC_KIND_VALUES.has(value)) {
    return;
  }
  const route = DOCUMENTATION_ONLY_SPEC_KIND_ROUTES[value];
  if (route) {
    throw formatError(
      filePath,
      `spec_kind ${value} is documentation-only; ${route}. MANIFEST.md must define a reusable invocable capability surface; legacy SPEC.md follows the same contract.`
    );
  }
  throw formatError(
    filePath,
    `spec_kind must be one of ${Array.from(SPEC_KIND_VALUES).join(", ")}; documentation-only records belong in normal mdkg nodes such as task, test, epic, goal, checkpoint, EDD, PRD, DEC, bug, feedback, dispute, or proposal.`
  );
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
    if (!isPortableIdRef(value)) {
      throw formatError(filePath, `${key}[${index}] must be a lowercase portable id or qid`);
    }
  }
}

function validateWorkInvocationAnchor(
  requiredCapabilities: string[],
  refsByKey: Record<string, string[]>,
  filePath: string
): void {
  const hasRequiredCapability = requiredCapabilities.length > 0;
  const hasDependencyRef = Object.values(refsByKey).some((values) => values.length > 0);
  if (hasRequiredCapability || hasDependencyRef) {
    return;
  }
  throw formatError(
    filePath,
    "WORK.md must include at least one required_capabilities entry or dependency ref in skill_refs, tool_refs, model_refs, wasm_component_refs, runtime_image_refs, or subagent_refs"
  );
}

function validatePortableOrUriRefs(values: string[], key: string, filePath: string): void {
  for (const [index, value] of values.entries()) {
    if (!validatePortableOrUriRef(value)) {
      throw formatError(filePath, `${key}[${index}] must be a portable id or URI ref`);
    }
  }
}

function validatePortableOrUriScalar(value: string, key: string, filePath: string): void {
  if (!validatePortableOrUriRef(value)) {
    throw formatError(filePath, `${key} must be a portable id or URI ref`);
  }
}

function requireContractMetadataToken(value: string, key: string, filePath: string): void {
  if (LOWER_TOKEN_RE.test(value)) {
    return;
  }
  const id =
    key === "receipt_kind"
      ? "receipt-kind.invalid"
      : key === "redaction_class"
        ? "redaction-class.invalid"
        : "contract-profile.invalid";
  throw formatError(filePath, `${id}: ${key} must be lowercase snake/kebab style`);
}

function optionalContractMetadataString(
  frontmatter: Record<string, FrontmatterValue>,
  key: string,
  filePath: string
): string | undefined {
  const value = frontmatter[key];
  if (value === undefined) {
    return undefined;
  }
  const id =
    key === "receipt_kind"
      ? "receipt-kind.invalid"
      : key === "redaction_class"
        ? "redaction-class.invalid"
        : "contract-profile.invalid";
  if (typeof value !== "string" || value.trim().length === 0) {
    throw formatError(filePath, `${id}: ${key} must be a non-empty string`);
  }
  return value;
}

function validateOptionalContractProfile(
  frontmatter: Record<string, FrontmatterValue>,
  filePath: string
): void {
  const contractProfile = optionalContractMetadataString(frontmatter, "contract_profile", filePath);
  if (contractProfile) {
    requireContractMetadataToken(contractProfile, "contract_profile", filePath);
  }
}

function validateOptionalPolicyRefs(
  frontmatter: Record<string, FrontmatterValue>,
  filePath: string
): void {
  const validationPolicyRef = optionalRefString(frontmatter, "validation_policy_ref", filePath);
  if (validationPolicyRef) {
    validatePortableOrUriScalar(validationPolicyRef, "validation_policy_ref", filePath);
  }
  const evidencePolicyRef = optionalRefString(frontmatter, "evidence_policy_ref", filePath);
  if (evidencePolicyRef) {
    validatePortableOrUriScalar(evidencePolicyRef, "evidence_policy_ref", filePath);
  }
}

function validateOptionalFieldDescriptors(values: string[], key: string, filePath: string): void {
  if (values.length === 0) {
    return;
  }
  validateFieldDescriptors(values, key, filePath);
}

function validateHashRefs(values: string[], key: string, filePath: string): void {
  for (const [index, value] of values.entries()) {
    if (!isSha256Ref(value)) {
      throw formatError(filePath, `${key}[${index}] must be sha256:<64 lowercase hex chars>`);
    }
  }
}

function validateHashRef(value: string, key: string, filePath: string): void {
  if (!isSha256Ref(value)) {
    throw formatError(filePath, `${key} must be sha256:<64 lowercase hex chars>`);
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
    case "manifest":
    case "spec": {
      const specKind = optionalString(frontmatter, "spec_kind", filePath);
      if (specKind) {
        validateSpecKind(specKind, filePath);
      }
      const role = expectString(frontmatter, "role", filePath);
      requireEnum(role, "role", ROLE_VALUES, filePath);
      const runtimeMode = expectString(frontmatter, "runtime_mode", filePath);
      requireEnum(runtimeMode, "runtime_mode", RUNTIME_MODE_VALUES, filePath);
      const updatePolicy = expectString(frontmatter, "update_policy", filePath);
      requireEnum(updatePolicy, "update_policy", UPDATE_POLICY_VALUES, filePath);
      validateOptionalContractProfile(frontmatter, filePath);
      validateOptionalPolicyRefs(frontmatter, filePath);
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
      requirePortableIdRef(agentId, "agent_id", filePath);
      const kind = expectString(frontmatter, "kind", filePath);
      requireLowerToken(kind, "kind", filePath);
      validateOptionalContractProfile(frontmatter, filePath);
      const pricingModel = expectString(frontmatter, "pricing_model", filePath);
      requireEnum(pricingModel, "pricing_model", PRICING_MODEL_VALUES, filePath);
      const requiredCapabilities = expectList(frontmatter, "required_capabilities", filePath);
      validateCapabilities(
        requiredCapabilities,
        "required_capabilities",
        filePath
      );
      const skillRefs = optionalList(frontmatter, "skill_refs", filePath);
      validatePortableRefs(skillRefs, "skill_refs", filePath);
      const toolRefs = optionalList(frontmatter, "tool_refs", filePath);
      validatePortableRefs(toolRefs, "tool_refs", filePath);
      const modelRefs = optionalList(frontmatter, "model_refs", filePath);
      validatePortableRefs(modelRefs, "model_refs", filePath);
      const wasmComponentRefs = optionalList(frontmatter, "wasm_component_refs", filePath);
      validatePortableRefs(wasmComponentRefs, "wasm_component_refs", filePath);
      const runtimeImageRefs = optionalList(frontmatter, "runtime_image_refs", filePath);
      validatePortableRefs(runtimeImageRefs, "runtime_image_refs", filePath);
      const subagentRefs = optionalList(frontmatter, "subagent_refs", filePath);
      validatePortableRefs(subagentRefs, "subagent_refs", filePath);
      validateWorkInvocationAnchor(
        requiredCapabilities,
        {
          skill_refs: skillRefs,
          tool_refs: toolRefs,
          model_refs: modelRefs,
          wasm_component_refs: wasmComponentRefs,
          runtime_image_refs: runtimeImageRefs,
          subagent_refs: subagentRefs,
        },
        filePath
      );
      validateFieldDescriptors(expectList(frontmatter, "inputs", filePath), "inputs", filePath);
      validateFieldDescriptors(expectList(frontmatter, "outputs", filePath), "outputs", filePath);
      expectBoolean(frontmatter, "receipt_required", filePath);
      break;
    }
    case "work_order": {
      const workId = expectString(frontmatter, "work_id", filePath);
      requirePortableIdRef(workId, "work_id", filePath);
      const workVersion = expectString(frontmatter, "work_version", filePath);
      requireSemver(workVersion, "work_version", filePath);
      const requester = expectRefString(frontmatter, "requester", filePath);
      validatePortableOrUriScalar(requester, "requester", filePath);
      const orderStatus = expectString(frontmatter, "order_status", filePath);
      requireEnum(orderStatus, "order_status", ORDER_STATUS_VALUES, filePath);
      validateOptionalContractProfile(frontmatter, filePath);
      validateOptionalPolicyRefs(frontmatter, filePath);
      const requestRef = optionalRefString(frontmatter, "request_ref", filePath);
      if (requestRef) {
        validatePortableOrUriScalar(requestRef, "request_ref", filePath);
      }
      const triggerRef = optionalRefString(frontmatter, "trigger_ref", filePath);
      if (triggerRef) {
        validatePortableOrUriScalar(triggerRef, "trigger_ref", filePath);
      }
      const payloadHash = optionalString(frontmatter, "payload_hash", filePath);
      if (payloadHash) {
        validateHashRef(payloadHash, "payload_hash", filePath);
      }
      validatePortableOrUriRefs(optionalList(frontmatter, "input_refs", filePath), "input_refs", filePath);
      validatePortableOrUriRefs(optionalList(frontmatter, "queue_refs", filePath), "queue_refs", filePath);
      validateOptionalFieldDescriptors(
        optionalList(frontmatter, "requested_outputs", filePath),
        "requested_outputs",
        filePath
      );
      validatePortableOrUriRefs(
        optionalList(frontmatter, "constraint_refs", filePath),
        "constraint_refs",
        filePath
      );
      const artifactPolicy = optionalString(frontmatter, "artifact_policy", filePath);
      if (artifactPolicy) {
        requireEnum(artifactPolicy, "artifact_policy", ARTIFACT_POLICY_VALUES, filePath);
      }
      break;
    }
    case "receipt": {
      const workOrderId = expectString(frontmatter, "work_order_id", filePath);
      requirePortableIdRef(workOrderId, "work_order_id", filePath);
      const receiptStatus = expectString(frontmatter, "receipt_status", filePath);
      requireEnum(receiptStatus, "receipt_status", RECEIPT_STATUS_VALUES, filePath);
      const outcome = expectString(frontmatter, "outcome", filePath);
      requireEnum(outcome, "outcome", OUTCOME_VALUES, filePath);
      const costRef = optionalRefString(frontmatter, "cost_ref", filePath);
      if (costRef) {
        validatePortableOrUriScalar(costRef, "cost_ref", filePath);
      }
      const redactionPolicy = optionalString(frontmatter, "redaction_policy", filePath);
      if (redactionPolicy) {
        requireEnum(redactionPolicy, "redaction_policy", REDACTION_POLICY_VALUES, filePath);
      }
      validateOptionalContractProfile(frontmatter, filePath);
      const receiptKind = optionalContractMetadataString(frontmatter, "receipt_kind", filePath);
      if (receiptKind) {
        requireContractMetadataToken(receiptKind, "receipt_kind", filePath);
      }
      const redactionClass = optionalContractMetadataString(frontmatter, "redaction_class", filePath);
      if (redactionClass) {
        requireContractMetadataToken(redactionClass, "redaction_class", filePath);
      }
      validateOptionalPolicyRefs(frontmatter, filePath);
      validatePortableOrUriRefs(optionalList(frontmatter, "proof_refs", filePath), "proof_refs", filePath);
      validatePortableOrUriRefs(
        optionalList(frontmatter, "attestation_refs", filePath),
        "attestation_refs",
        filePath
      );
      validateHashRefs(optionalList(frontmatter, "evidence_hashes", filePath), "evidence_hashes", filePath);
      validateHashRefs(optionalList(frontmatter, "input_hashes", filePath), "input_hashes", filePath);
      validateHashRefs(optionalList(frontmatter, "output_hashes", filePath), "output_hashes", filePath);
      break;
    }
    case "feedback": {
      const targetId = expectString(frontmatter, "target_id", filePath);
      requirePortableIdRef(targetId, "target_id", filePath);
      const sentiment = expectString(frontmatter, "sentiment", filePath);
      requireEnum(sentiment, "sentiment", SENTIMENT_VALUES, filePath);
      const feedbackStatus = expectString(frontmatter, "feedback_status", filePath);
      requireEnum(feedbackStatus, "feedback_status", FEEDBACK_STATUS_VALUES, filePath);
      optionalString(frontmatter, "source_ref", filePath);
      break;
    }
    case "dispute": {
      const workOrderId = expectString(frontmatter, "work_order_id", filePath);
      requirePortableIdRef(workOrderId, "work_order_id", filePath);
      const receiptId = expectString(frontmatter, "receipt_id", filePath);
      requirePortableIdRef(receiptId, "receipt_id", filePath);
      const disputeStatus = expectString(frontmatter, "dispute_status", filePath);
      requireEnum(disputeStatus, "dispute_status", DISPUTE_STATUS_VALUES, filePath);
      const severity = expectString(frontmatter, "severity", filePath);
      requireEnum(severity, "severity", SEVERITY_VALUES, filePath);
      break;
    }
    case "proposal": {
      const targetId = expectString(frontmatter, "target_id", filePath);
      requirePortableIdRef(targetId, "target_id", filePath);
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
