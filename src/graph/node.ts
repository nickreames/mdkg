import { FrontmatterValue, parseFrontmatter } from "./frontmatter";
import { EdgeMap, extractEdges } from "./edges";
import { TemplateSchema, TemplateSchemaMap } from "./template_schema";
import {
  extractAgentAttributes,
  isAgentFileType,
  AGENT_FILE_TYPES,
  validateAgentFrontmatter,
} from "./agent_file_types";
import {
  extractArchiveAttributes,
  isArchiveType,
  validateArchiveFrontmatter,
} from "./archive_file";
import { isCanonicalId, isPortableId, isPortableIdRef } from "../util/id";
import { validatePortableOrUriRef } from "../util/refs";
import { isLoopIdentity, parseLoopRefBinding } from "./loop_bindings";

export type Node = {
  id: string;
  type: string;
  title: string;
  created: string;
  updated: string;
  status?: string;
  priority?: number;
  tags: string[];
  owners: string[];
  links: string[];
  artifacts: string[];
  refs: string[];
  aliases: string[];
  skills: string[];
  edges: EdgeMap;
  attributes: Record<string, FrontmatterValue>;
  body: string;
  frontmatter: Record<string, FrontmatterValue>;
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const DEC_ID_RE = /^dec-[0-9]+$/;

export const WORK_TYPES = new Set(["goal", "loop", "epic", "feat", "task", "bug", "spike", "checkpoint", "test"]);
export const DEC_TYPES = new Set(["dec"]);
export const ALLOWED_TYPES = new Set([
  "rule",
  "prd",
  "edd",
  "dec",
  "prop",
  "goal",
  "loop",
  "epic",
  "feat",
  "task",
  "bug",
  "spike",
  "checkpoint",
  "test",
  "archive",
  ...AGENT_FILE_TYPES,
]);

const DEC_STATUS = new Set(["proposed", "accepted", "rejected", "superseded"]);
const GOAL_STATE = new Set(["active", "paused", "achieved", "blocked", "budget_limited", "archived"]);
const SKILL_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const GOAL_ATTRIBUTE_KEYS = [
  "goal_state",
  "goal_condition",
  "scope_refs",
  "active_node",
  "last_active_node",
  "required_skills",
  "required_checks",
  "max_iterations",
  "blocked_after_attempts",
];
const LOOP_MODES = new Set([
  "readonly",
  "planning",
  "patch_proposal",
  "write_with_approval",
  "autonomous_local",
]);
const LOOP_ROLES = new Set(["template", "scoped", "run_bearing"]);
const LOOP_MATERIALIZATION_MODES = new Set(["default_children", "planning_only", "manual"]);
const LOOP_BLOCKER_POLICIES = new Set(["spike_proposal_recommendation_continue"]);
const LOOP_ATTRIBUTE_KEYS = [
  "loop_mode",
  "loop_role",
  "scope_refs",
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
];

export type NodeParseOptions = {
  workStatusEnum: string[];
  priorityMin: number;
  priorityMax: number;
  templateSchemas: TemplateSchemaMap;
};

function formatError(filePath: string, message: string): Error {
  return new Error(`${filePath}: ${message}`);
}

function expectString(
  frontmatter: Record<string, FrontmatterValue>,
  key: string,
  filePath: string
): string {
  const value = frontmatter[key];
  if (typeof value !== "string") {
    throw formatError(filePath, `${key} must be a string`);
  }
  if (value.trim().length === 0) {
    throw formatError(filePath, `${key} must not be empty`);
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
  if (typeof value !== "string") {
    throw formatError(filePath, `${key} must be a string`);
  }
  if (value.trim().length === 0) {
    throw formatError(filePath, `${key} must not be empty`);
  }
  return value;
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

function requireLowercase(value: string, key: string, filePath: string): string {
  if (value !== value.toLowerCase()) {
    throw formatError(filePath, `${key} must be lowercase`);
  }
  return value;
}

function requireLowercaseList(values: string[], key: string, filePath: string): string[] {
  return values.map((value, index) => {
    if (value !== value.toLowerCase()) {
      throw formatError(filePath, `${key}[${index}] must be lowercase`);
    }
    return value;
  });
}

function isValidId(value: string): boolean {
  return isCanonicalId(value);
}

function requireIdFormat(value: string, key: string, filePath: string): string {
  if (!isValidId(value)) {
    throw formatError(filePath, `${key} must match <prefix>-<number> or reserved id`);
  }
  return value;
}

function requirePortableIdFormat(value: string, key: string, filePath: string): string {
  if (!isPortableId(value)) {
    throw formatError(filePath, `${key} must be a lowercase portable id`);
  }
  return value;
}

function requireDate(value: string, key: string, filePath: string): string {
  if (!DATE_RE.test(value)) {
    throw formatError(filePath, `${key} must be YYYY-MM-DD`);
  }
  return value;
}

function parsePriority(value: string, filePath: string, min: number, max: number): number {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed)) {
    throw formatError(filePath, "priority must be an integer");
  }
  if (parsed < min || parsed > max) {
    throw formatError(filePath, `priority must be between ${min} and ${max}`);
  }
  return parsed;
}

function normalizeIdList(
  values: string[],
  key: string,
  filePath: string,
  allowPortableIds = false
): string[] {
  return values.map((value) => {
    if (value !== value.toLowerCase()) {
      throw formatError(filePath, `${key} entries must be lowercase`);
    }
    const valid = allowPortableIds ? isPortableId(value) : isValidId(value);
    if (!valid) {
      throw formatError(filePath, `${key} entries must match <prefix>-<number> or reserved id`);
    }
    return value;
  });
}

function normalizeRefsList(
  values: string[],
  key: string,
  filePath: string,
  allowPortableOrUriRefs = false
): string[] {
  if (!allowPortableOrUriRefs) {
    return normalizeIdList(values, key, filePath);
  }
  return values.map((value) => {
    if (!validatePortableOrUriRef(value)) {
      throw formatError(filePath, `${key} entries must be portable ids or URI refs`);
    }
    return value;
  });
}

function normalizeSkillList(values: string[], filePath: string): string[] {
  return values.map((value, index) => {
    const normalized = value.toLowerCase();
    if (!SKILL_SLUG_RE.test(normalized)) {
      throw formatError(filePath, `skills[${index}] must be kebab-case`);
    }
    return normalized;
  });
}

function parsePositiveIntegerString(
  value: string,
  key: string,
  filePath: string
): string {
  if (!/^[1-9][0-9]*$/.test(value)) {
    throw formatError(filePath, `${key} must be a positive integer`);
  }
  return value;
}

function validateGoalFrontmatter(
  type: string,
  frontmatter: Record<string, FrontmatterValue>,
  filePath: string
): void {
  if (type !== "goal") {
    return;
  }

  const goalState = requireLowercase(expectString(frontmatter, "goal_state", filePath), "goal_state", filePath);
  if (!GOAL_STATE.has(goalState)) {
    throw formatError(filePath, `goal_state must be one of ${Array.from(GOAL_STATE).join(", ")}`);
  }

  const goalCondition = expectString(frontmatter, "goal_condition", filePath);
  if (goalCondition.length > 4000) {
    throw formatError(filePath, "goal_condition must be 4000 characters or fewer");
  }

  const activeNode = optionalString(frontmatter, "active_node", filePath);
  if (activeNode !== undefined) {
    const normalized = requireLowercase(activeNode, "active_node", filePath);
    if (!isPortableIdRef(normalized)) {
      throw formatError(filePath, "active_node must be a local id or qid");
    }
  }

  const lastActiveNode = optionalString(frontmatter, "last_active_node", filePath);
  if (lastActiveNode !== undefined) {
    const normalized = requireLowercase(lastActiveNode, "last_active_node", filePath);
    if (!isPortableIdRef(normalized)) {
      throw formatError(filePath, "last_active_node must be a local id or qid");
    }
  }

  const scopeRefs = optionalList(frontmatter, "scope_refs", filePath);
  for (const [index, value] of scopeRefs.entries()) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw formatError(filePath, `scope_refs[${index}] must not be empty`);
    }
    const normalized = requireLowercase(value, `scope_refs[${index}]`, filePath);
    if (!isPortableIdRef(normalized)) {
      throw formatError(filePath, `scope_refs[${index}] must be a local id or qid`);
    }
  }

  const requiredSkills = optionalList(frontmatter, "required_skills", filePath);
  normalizeSkillList(requiredSkills, filePath);

  const requiredChecks = optionalList(frontmatter, "required_checks", filePath);
  for (const [index, value] of requiredChecks.entries()) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw formatError(filePath, `required_checks[${index}] must not be empty`);
    }
  }

  const maxIterations = optionalString(frontmatter, "max_iterations", filePath);
  if (maxIterations !== undefined) {
    parsePositiveIntegerString(maxIterations, "max_iterations", filePath);
  }
  const blockedAfterAttempts = optionalString(frontmatter, "blocked_after_attempts", filePath);
  if (blockedAfterAttempts !== undefined) {
    parsePositiveIntegerString(blockedAfterAttempts, "blocked_after_attempts", filePath);
  }
}

function validateLoopRefList(
  frontmatter: Record<string, FrontmatterValue>,
  key: string,
  filePath: string
): void {
  const values = optionalList(frontmatter, key, filePath);
  for (const [index, value] of values.entries()) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw formatError(filePath, `${key}[${index}] must not be empty`);
    }
    const normalized = value.includes("://") ? value : requireLowercase(value, `${key}[${index}]`, filePath);
    if (!validatePortableOrUriRef(normalized)) {
      throw formatError(filePath, `${key}[${index}] must be a portable id, qid, or URI ref`);
    }
  }
}

function validateLoopStringList(
  frontmatter: Record<string, FrontmatterValue>,
  key: string,
  filePath: string
): void {
  const values = optionalList(frontmatter, key, filePath);
  const seen = new Set<string>();
  for (const [index, value] of values.entries()) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw formatError(filePath, `${key}[${index}] must not be empty`);
    }
    const normalized = value.trim().toLowerCase();
    if (!isLoopIdentity(normalized)) {
      throw formatError(filePath, `${key}[${index}] must be a stable lowercase identity`);
    }
    if (value.trim() !== normalized) {
      throw formatError(filePath, `${key}[${index}] must be lowercase; use ${normalized}`);
    }
    if (seen.has(normalized)) {
      throw formatError(filePath, `${key}[${index}] duplicates identity ${normalized}`);
    }
    seen.add(normalized);
  }
}

function validateLoopBindingList(
  frontmatter: Record<string, FrontmatterValue>,
  key: string,
  identityKey: string,
  refKeys: string[],
  filePath: string,
  requireEveryRefKey = false
): void {
  const values = optionalList(frontmatter, key, filePath);
  const identities = new Set(optionalList(frontmatter, identityKey, filePath).map((value) => value.toLowerCase()));
  const refsByKey = refKeys.map((refKey) => new Set(optionalList(frontmatter, refKey, filePath)));
  const seen = new Set<string>();
  for (const [index, value] of values.entries()) {
    if (typeof value !== "string") {
      throw formatError(filePath, `${key}[${index}] must use <identity>=<ref>`);
    }
    const binding = parseLoopRefBinding(value);
    if (!binding) {
      throw formatError(filePath, `${key}[${index}] must use <identity>=<ref>`);
    }
    if (!identities.has(binding.identity)) {
      throw formatError(filePath, `${key}[${index}] references undeclared ${identityKey} identity ${binding.identity}`);
    }
    const normalizedRef = binding.ref.includes("://")
      ? binding.ref
      : requireLowercase(binding.ref, `${key}[${index}]`, filePath);
    if (!validatePortableOrUriRef(normalizedRef)) {
      throw formatError(filePath, `${key}[${index}] must reference a portable id, qid, or URI ref`);
    }
    const included = requireEveryRefKey
      ? refsByKey.every((refs) => refs.has(binding.ref))
      : refsByKey.some((refs) => refs.has(binding.ref));
    if (!included) {
      const operator = requireEveryRefKey ? "each of" : "one of";
      throw formatError(filePath, `${key}[${index}] ref ${binding.ref} must also appear in ${operator} ${refKeys.join(", ")}`);
    }
    const pair = `${binding.identity}\u0000${binding.ref}`;
    if (seen.has(pair)) {
      throw formatError(filePath, `${key}[${index}] duplicates ${binding.identity}=${binding.ref}`);
    }
    seen.add(pair);
  }
}

function validateLoopActionSets(frontmatter: Record<string, FrontmatterValue>, filePath: string): void {
  const normalized = (key: string): string[] => optionalList(frontmatter, key, filePath).map((value) => value.trim().toLowerCase());
  const preApproved = new Set(normalized("pre_approved_actions"));
  const approvalGated = new Set(normalized("approval_gated_actions"));
  const required = normalized("required_actions");
  const requested = normalized("requested_actions");
  const prohibited = new Set(normalized("prohibited_actions"));

  for (const action of preApproved) {
    if (approvalGated.has(action)) {
      throw formatError(filePath, `action ${action} cannot be both pre_approved_actions and approval_gated_actions`);
    }
    if (prohibited.has(action)) {
      throw formatError(filePath, `action ${action} cannot be both pre_approved_actions and prohibited_actions`);
    }
  }
  for (const action of approvalGated) {
    if (prohibited.has(action)) {
      throw formatError(filePath, `action ${action} cannot be both approval_gated_actions and prohibited_actions`);
    }
  }
  for (const [key, actions] of [["required_actions", required], ["requested_actions", requested]] as const) {
    for (const action of actions) {
      if (!preApproved.has(action) && !approvalGated.has(action)) {
        throw formatError(filePath, `${key} references undeclared action ${action}`);
      }
      if (prohibited.has(action)) {
        throw formatError(filePath, `${key} cannot include prohibited action ${action}`);
      }
    }
  }
}

function validateLoopFrontmatter(
  type: string,
  frontmatter: Record<string, FrontmatterValue>,
  filePath: string
): void {
  if (type !== "loop") {
    return;
  }

  const loopMode = requireLowercase(expectString(frontmatter, "loop_mode", filePath), "loop_mode", filePath);
  if (!LOOP_MODES.has(loopMode)) {
    throw formatError(filePath, `loop_mode must be one of ${Array.from(LOOP_MODES).join(", ")}`);
  }

  const loopRole = requireLowercase(expectString(frontmatter, "loop_role", filePath), "loop_role", filePath);
  if (!LOOP_ROLES.has(loopRole)) {
    throw formatError(filePath, `loop_role must be one of ${Array.from(LOOP_ROLES).join(", ")}`);
  }

  const materializationMode = requireLowercase(
    expectString(frontmatter, "materialization_mode", filePath),
    "materialization_mode",
    filePath
  );
  if (!LOOP_MATERIALIZATION_MODES.has(materializationMode)) {
    throw formatError(
      filePath,
      `materialization_mode must be one of ${Array.from(LOOP_MATERIALIZATION_MODES).join(", ")}`
    );
  }

  const blockerPolicy = requireLowercase(
    expectString(frontmatter, "blocker_policy", filePath),
    "blocker_policy",
    filePath
  );
  if (!LOOP_BLOCKER_POLICIES.has(blockerPolicy)) {
    throw formatError(filePath, `blocker_policy must be one of ${Array.from(LOOP_BLOCKER_POLICIES).join(", ")}`);
  }

  expectString(frontmatter, "definition_of_done", filePath);
  optionalString(frontmatter, "scope_description", filePath);
  for (const key of [
    "pre_run_questions",
    "pre_approved_actions",
    "approval_gated_actions",
    "required_actions",
    "requested_actions",
    "prohibited_actions",
    "evidence_lanes",
  ]) {
    validateLoopStringList(frontmatter, key, filePath);
  }
  validateLoopActionSets(frontmatter, filePath);
  for (const key of [
    "scope_refs",
    "template_refs",
    "child_refs",
    "lane_waiver_refs",
    "run_refs",
    "decision_refs",
    "output_refs",
    "approval_refs",
    "evaluation_refs",
  ]) {
    validateLoopRefList(frontmatter, key, filePath);
  }
  validateLoopBindingList(frontmatter, "question_answer_refs", "pre_run_questions", ["decision_refs"], filePath);
  validateLoopBindingList(frontmatter, "action_approval_refs", "approval_gated_actions", ["approval_refs"], filePath);
  validateLoopBindingList(
    frontmatter,
    "evidence_lane_refs",
    "evidence_lanes",
    ["run_refs", "output_refs", "evaluation_refs", "evidence_refs"],
    filePath
  );
  validateLoopBindingList(
    frontmatter,
    "lane_waiver_decision_refs",
    "evidence_lanes",
    ["lane_waiver_refs", "decision_refs"],
    filePath,
    true
  );
  validateLoopBindingList(
    frontmatter,
    "lane_waiver_approval_refs",
    "evidence_lanes",
    ["approval_refs"],
    filePath
  );
}

function extractGoalAttributes(
  type: string,
  frontmatter: Record<string, FrontmatterValue>
): Record<string, FrontmatterValue> {
  if (type !== "goal") {
    return {};
  }
  const attributes: Record<string, FrontmatterValue> = {};
  for (const key of GOAL_ATTRIBUTE_KEYS) {
    const value = frontmatter[key];
    if (value !== undefined) {
      attributes[key] = value;
    }
  }
  return attributes;
}

function extractLoopAttributes(
  type: string,
  frontmatter: Record<string, FrontmatterValue>
): Record<string, FrontmatterValue> {
  if (type !== "loop") {
    return {};
  }
  const attributes: Record<string, FrontmatterValue> = {};
  for (const key of LOOP_ATTRIBUTE_KEYS) {
    const value = frontmatter[key];
    if (value !== undefined) {
      attributes[key] = value;
    }
  }
  return attributes;
}

function requireTemplateSchema(
  type: string,
  templateSchemas: TemplateSchemaMap,
  filePath: string
): TemplateSchema {
  const schema = templateSchemas[type];
  if (!schema) {
    throw formatError(filePath, `template schema missing for type ${type}`);
  }
  return schema;
}

const OPTIONAL_COMPAT_TEMPLATE_KEYS: Record<
  string,
  Record<string, "scalar" | "list" | "boolean">
> = {
  manifest: {
    contract_profile: "scalar",
    validation_policy_ref: "scalar",
    evidence_policy_ref: "scalar",
    profile: "scalar",
  },
  spec: {
    spec_kind: "scalar",
    contract_profile: "scalar",
    validation_policy_ref: "scalar",
    evidence_policy_ref: "scalar",
    profile: "scalar",
  },
  work: {
    contract_profile: "scalar",
    profile: "scalar",
  },
  work_order: {
    contract_profile: "scalar",
    validation_policy_ref: "scalar",
    evidence_policy_ref: "scalar",
    profile: "scalar",
  },
  receipt: {
    contract_profile: "scalar",
    receipt_kind: "scalar",
    redaction_class: "scalar",
    validation_policy_ref: "scalar",
    evidence_policy_ref: "scalar",
    profile: "scalar",
  },
};

function validateTemplateKeys(
  frontmatter: Record<string, FrontmatterValue>,
  schema: TemplateSchema,
  filePath: string
): void {
  for (const key of Object.keys(frontmatter)) {
    if (
      !schema.allowedKeys.has(key) &&
      OPTIONAL_COMPAT_TEMPLATE_KEYS[schema.type]?.[key] === undefined
    ) {
      throw formatError(filePath, `unknown key: ${key}`);
    }
  }

  for (const [key, value] of Object.entries(frontmatter)) {
    const expected = schema.keyKinds[key] ?? OPTIONAL_COMPAT_TEMPLATE_KEYS[schema.type]?.[key];
    if (!expected) {
      continue;
    }
    const isList = Array.isArray(value);
    const isBoolean = typeof value === "boolean";
    if (expected === "list" && !isList) {
      throw formatError(filePath, `${key} must be a list`);
    }
    if (expected === "boolean" && !isBoolean) {
      throw formatError(filePath, `${key} must be a boolean`);
    }
    if (expected === "scalar" && (isList || isBoolean)) {
      throw formatError(filePath, `${key} must be a string`);
    }
  }
}

export function parseNode(content: string, filePath: string, options: NodeParseOptions): Node {
  const { frontmatter, body } = parseFrontmatter(content, filePath);

  const type = requireLowercase(expectString(frontmatter, "type", filePath), "type", filePath);
  if (!ALLOWED_TYPES.has(type)) {
    throw formatError(filePath, `type must be one of ${Array.from(ALLOWED_TYPES).join(", ")}`);
  }
  const isAgentType = isAgentFileType(type);
  const isPortableType = isAgentType || isArchiveType(type);
  const schema = requireTemplateSchema(type, options.templateSchemas, filePath);
  validateTemplateKeys(frontmatter, schema, filePath);
  validateAgentFrontmatter(type, frontmatter, filePath);
  validateArchiveFrontmatter(type, frontmatter, filePath);
  validateGoalFrontmatter(type, frontmatter, filePath);
  validateLoopFrontmatter(type, frontmatter, filePath);

  const idValue = requireLowercase(expectString(frontmatter, "id", filePath), "id", filePath);
  const id = isPortableType
    ? requirePortableIdFormat(idValue, "id", filePath)
    : requireIdFormat(idValue, "id", filePath);

  const title = expectString(frontmatter, "title", filePath);
  const created = requireDate(expectString(frontmatter, "created", filePath), "created", filePath);
  const updated = requireDate(expectString(frontmatter, "updated", filePath), "updated", filePath);

  const statusValue = optionalString(frontmatter, "status", filePath);
  let status: string | undefined = undefined;
  const workStatus = new Set(options.workStatusEnum.map((value) => value.toLowerCase()));
  const allowedWorkStatus = type === "goal" ? new Set([...workStatus, "archived"]) : workStatus;
  if (WORK_TYPES.has(type)) {
    if (!statusValue) {
      throw formatError(filePath, "status is required for work items");
    }
    const normalized = requireLowercase(statusValue, "status", filePath);
    if (!allowedWorkStatus.has(normalized)) {
      throw formatError(filePath, `status must be one of ${Array.from(allowedWorkStatus).join(", ")}`);
    }
    status = normalized;
  } else if (DEC_TYPES.has(type)) {
    if (!statusValue) {
      throw formatError(filePath, "status is required for decision records");
    }
    const normalized = requireLowercase(statusValue, "status", filePath);
    if (!DEC_STATUS.has(normalized)) {
      throw formatError(filePath, `status must be one of ${Array.from(DEC_STATUS).join(", ")}`);
    }
    status = normalized;
  } else if (statusValue) {
    throw formatError(filePath, "status is not allowed for this type");
  }

  const priorityValue = optionalString(frontmatter, "priority", filePath);
  let priority: number | undefined = undefined;
  if (priorityValue !== undefined) {
    if (!WORK_TYPES.has(type)) {
      throw formatError(filePath, "priority is only allowed for work items");
    }
    priority = parsePriority(
      priorityValue,
      filePath,
      options.priorityMin,
      options.priorityMax
    );
  }

  const tags = requireLowercaseList(optionalList(frontmatter, "tags", filePath), "tags", filePath);
  const owners = requireLowercaseList(
    optionalList(frontmatter, "owners", filePath),
    "owners",
    filePath
  );
  const links = optionalList(frontmatter, "links", filePath);
  const artifacts = optionalList(frontmatter, "artifacts", filePath);
  const refs = normalizeRefsList(optionalList(frontmatter, "refs", filePath), "refs", filePath, true);
  const aliases = requireLowercaseList(
    optionalList(frontmatter, "aliases", filePath),
    "aliases",
    filePath
  );
  const skillsRaw = optionalList(frontmatter, "skills", filePath);
  const skills = normalizeSkillList(skillsRaw, filePath);
  if (skills.length > 0 && !WORK_TYPES.has(type)) {
    throw formatError(filePath, "skills is only allowed for work items");
  }
  normalizeIdList(optionalList(frontmatter, "scope", filePath), "scope", filePath);
  const supersedesValue = optionalString(frontmatter, "supersedes", filePath);
  if (supersedesValue !== undefined) {
    if (!DEC_TYPES.has(type)) {
      throw formatError(filePath, "supersedes is only allowed for decision records");
    }
    const normalized = requireLowercase(supersedesValue, "supersedes", filePath);
    if (!DEC_ID_RE.test(normalized)) {
      throw formatError(filePath, "supersedes must be a dec-# id");
    }
  }

  const edges = extractEdges(frontmatter, filePath, {
    allowPortableRefs: true,
    includeSemanticRefs: WORK_TYPES.has(type),
  });
  const attributes = {
    ...extractGoalAttributes(type, frontmatter),
    ...extractLoopAttributes(type, frontmatter),
    ...extractAgentAttributes(type, frontmatter),
    ...extractArchiveAttributes(type, frontmatter),
  };

  return {
    id,
    type,
    title,
    created,
    updated,
    status,
    priority,
    tags,
    owners,
    links,
    artifacts,
    refs,
    aliases,
    skills,
    edges,
    attributes,
    body,
    frontmatter,
  };
}
