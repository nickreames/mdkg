export type FrontmatterValue = string | boolean | string[];
export type ParsedFrontmatter = {
  frontmatter: Record<string, FrontmatterValue>;
  body: string;
};

const KEY_RE = /^[a-z][a-z0-9_]*$/;

export const DEFAULT_FRONTMATTER_KEY_ORDER = [
  "id",
  "type",
  "title",
  "checkpoint_kind",
  "status",
  "priority",
  "goal_state",
  "goal_condition",
  "scope_refs",
  "active_node",
  "last_active_node",
  "required_skills",
  "required_checks",
  "max_iterations",
  "blocked_after_attempts",
  "loop_mode",
  "loop_role",
  "scope_description",
  "template_refs",
  "materialization_mode",
  "child_refs",
  "pre_run_questions",
  "question_answer_refs",
  "pre_approved_actions",
  "approval_gated_actions",
  "required_actions",
  "requested_actions",
  "prohibited_actions",
  "action_approval_refs",
  "evidence_lanes",
  "evidence_lane_refs",
  "lane_waiver_refs",
  "lane_waiver_decision_refs",
  "lane_waiver_approval_refs",
  "run_refs",
  "decision_refs",
  "output_refs",
  "approval_refs",
  "evaluation_refs",
  "definition_of_done",
  "blocker_policy",
  "epic",
  "parent",
  "prev",
  "next",
  "supersedes",
  "version",
  "spec_kind",
  "role",
  "runtime_mode",
  "work_contracts",
  "contract_profile",
  "validation_policy_ref",
  "evidence_policy_ref",
  "requested_capabilities",
  "resource_profile",
  "update_policy",
  "agent_id",
  "kind",
  "receipt_kind",
  "redaction_class",
  "pricing_model",
  "required_capabilities",
  "inputs",
  "outputs",
  "receipt_required",
  "work_id",
  "work_version",
  "requester",
  "order_status",
  "request_ref",
  "trigger_ref",
  "payload_hash",
  "queue_refs",
  "work_order_id",
  "receipt_status",
  "outcome",
  "cost_ref",
  "redaction_policy",
  "target_id",
  "sentiment",
  "feedback_status",
  "source_ref",
  "receipt_id",
  "dispute_status",
  "severity",
  "proposal_status",
  "proposal_kind",
  "archive_kind",
  "source_path",
  "stored_path",
  "compressed_path",
  "mime_type",
  "byte_size",
  "sha256",
  "compressed_sha256",
  "visibility",
  "provenance",
  "ingest_status",
  "input_refs",
  "requested_outputs",
  "constraint_refs",
  "artifact_policy",
  "proof_refs",
  "attestation_refs",
  "evidence_hashes",
  "input_hashes",
  "output_hashes",
  "tags",
  "owners",
  "links",
  "artifacts",
  "relates",
  "blocked_by",
  "blocks",
  "refs",
  "context_refs",
  "evidence_refs",
  "aliases",
  "skills",
  "cases",
  "scope",
  "created",
  "updated",
];

function formatError(filePath: string, lineNumber: number, message: string): Error {
  return new Error(`${filePath}:${lineNumber}: ${message}`);
}

function parseList(valueRaw: string, filePath: string, lineNumber: number): string[] {
  if (!valueRaw.startsWith("[") || !valueRaw.endsWith("]")) {
    throw formatError(filePath, lineNumber, "list must be enclosed in [ ]");
  }

  const inner = valueRaw.slice(1, -1).trim();
  if (inner.length === 0) {
    return [];
  }

  const parts = inner.split(",");
  const items: string[] = [];
  for (let i = 0; i < parts.length; i += 1) {
    const item = parts[i].trim();
    if (item.length === 0) {
      throw formatError(filePath, lineNumber, "list items must be non-empty");
    }
    items.push(item);
  }

  return items;
}

function parseValue(valueRaw: string, filePath: string, lineNumber: number): FrontmatterValue {
  if (valueRaw.length === 0) {
    throw formatError(filePath, lineNumber, "value must not be empty");
  }

  if (valueRaw.startsWith("[")) {
    return parseList(valueRaw, filePath, lineNumber);
  }

  if (valueRaw === "true") {
    return true;
  }

  if (valueRaw === "false") {
    return false;
  }

  return valueRaw;
}

export function parseFrontmatter(content: string, filePath: string): ParsedFrontmatter {
  const lines = content.split(/\r?\n/);
  if (lines.length === 0 || lines[0].trim() !== "---") {
    throw formatError(filePath, 1, "frontmatter must start with ---");
  }

  let endIndex = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === "---") {
      endIndex = i;
      break;
    }
  }

  if (endIndex === -1) {
    throw formatError(filePath, 1, "frontmatter closing --- not found");
  }

  const frontmatter: Record<string, FrontmatterValue> = {};
  for (let i = 1; i < endIndex; i += 1) {
    const line = lines[i];
    const lineNumber = i + 1;

    if (line.trim().length === 0) {
      throw formatError(filePath, lineNumber, "frontmatter lines must not be blank");
    }

    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) {
      throw formatError(filePath, lineNumber, "frontmatter lines must be key: value");
    }

    const key = line.slice(0, colonIndex).trim();
    const rawValue = line.slice(colonIndex + 1).trim();

    if (!KEY_RE.test(key)) {
      throw formatError(filePath, lineNumber, `invalid key: ${key}`);
    }

    if (Object.prototype.hasOwnProperty.call(frontmatter, key)) {
      throw formatError(filePath, lineNumber, `duplicate key: ${key}`);
    }

    frontmatter[key] = parseValue(rawValue, filePath, lineNumber);
  }

  const body = lines.slice(endIndex + 1).join("\n");
  return { frontmatter, body };
}

function formatValue(value: FrontmatterValue): string {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }
    return `[${value.join(", ")}]`;
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  return value;
}

export function formatFrontmatter(
  frontmatter: Record<string, FrontmatterValue>,
  keyOrder: string[] = DEFAULT_FRONTMATTER_KEY_ORDER
): string[] {
  const keys = Object.keys(frontmatter);
  const keySet = new Set(keys);
  const ordered: string[] = [];
  for (const key of keyOrder) {
    if (keySet.has(key)) {
      ordered.push(key);
    }
  }
  const remaining = keys.filter((key) => !keyOrder.includes(key)).sort();
  ordered.push(...remaining);

  return ordered.map((key) => `${key}: ${formatValue(frontmatter[key])}`);
}
