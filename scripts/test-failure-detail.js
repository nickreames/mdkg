// CI diagnostics only: omit messages, compared contents and outside paths.
const path = require("node:path");
const fs = require("node:fs");
const { fileURLToPath } = require("node:url");
const { types } = require("node:util");
const root = path.resolve(__dirname, "..");
const POLICY = "omit-payloads-v1", LIMIT = 4096;
const names = new Set(["Error", "AssertionError", "TypeError", "RangeError", "SyntaxError",
  "ReferenceError", "EvalError", "URIError", "AggregateError", "UsageError", "OtherError"]);
const codes = new Set(["ERR_ASSERTION", "ERR_TEST_FAILURE", "ERR_ACCESS_DENIED", "ERR_INVALID_ARG_TYPE",
  "ERR_INVALID_ARG_VALUE", "ERR_OUT_OF_RANGE", "ENOENT", "EACCES", "EPERM", "EEXIST", "EIO", "ETIMEDOUT"]);
const operators = new Set(["==", "===", "!=", "!==", "equal", "notEqual", "strictEqual", "notStrictEqual",
  "deepEqual", "notDeepEqual", "deepStrictEqual", "notDeepStrictEqual", "match", "doesNotMatch",
  "throws", "doesNotThrow", "rejects", "doesNotReject", "fail", "ifError"]);
const failureTypes = new Set(["testCodeFailure", "hookFailed", "subtestsFailed", "cancelledByParent",
  "testTimeoutFailure", "testAborted", "asyncActivity"]);
const nativeStackGetter = Object.getOwnPropertyDescriptor(new Error(), "stack")?.get;
function data(object, key) {
  for (let current = object, depth = 0; current && depth < 5; current = Object.getPrototypeOf(current), depth++) {
    const descriptor = Object.getOwnPropertyDescriptor(current, key);
    if (descriptor) return Object.hasOwn(descriptor, "value") ? descriptor.value : undefined;
  }
}
function sourceFile(file) {
  if (file === null || file === undefined) return null;
  if (typeof file !== "string" || file.length > 4096) return "[outside-repository]";
  try {
    const absolute = file.startsWith("file:") ? fileURLToPath(file) : path.resolve(root, file);
    const relative = path.relative(root, absolute).split(path.sep).join("/");
    return relative.length <= 200 && /^(?:src|dist|tests|scripts)\/[A-Za-z0-9_./-]+\.[cm]?[jt]sx?$/.test(relative) &&
      !relative.split("/").includes("..") && fs.lstatSync(absolute).isFile() ? relative : "[outside-repository]";
  } catch { return "[outside-repository]"; }
}
const position = value => Number.isSafeInteger(value) && value > 0 && value <= 100000000 ? value : null;
const location = (file, line, column) => ({ file: sourceFile(file), line: position(line), column: position(column) });
function shape(value) {
  if (value === null) return { kind: "null" };
  if (typeof value === "string") return { kind: "string", length: value.length };
  if (Array.isArray(value)) {
    const length = data(value, "length");
    return Number.isSafeInteger(length) && length >= 0 ? { kind: "array", length } : { kind: "object" };
  }
  if (typeof value === "boolean") return { kind: "boolean", value };
  return { kind: typeof value };
}
function frames(error) {
  const descriptor = Object.getOwnPropertyDescriptor(error, "stack");
  const stack = descriptor && Object.hasOwn(descriptor, "value") ? descriptor.value :
    typeof nativeStackGetter === "function" && descriptor?.get === nativeStackGetter && types.isNativeError(error) ? descriptor.get.call(error) : undefined;
  if (typeof stack !== "string") return [];
  const result = [];
  // Assertion messages may be large. Only inspect the terminal frame region.
  for (const match of stack.slice(-65536).matchAll(/^\s+at\s+.*?(?:\(|\s)(file:\/\/\/[^()\n]+|\/[^()\n]+):(\d+):(\d+)\)?$/gm)) {
    const frame = location(match[1], Number(match[2]), Number(match[3]));
    if (frame.file && frame.file !== "[outside-repository]" &&
        !result.some(item => JSON.stringify(item) === JSON.stringify(frame))) result.push(frame);
    if (result.length === 4) break;
  }
  return result;
}
function failureDetail(event) {
  const result = { schema_version: 1, policy: POLICY,
    location: location(data(event, "file"), data(event, "line"), data(event, "column")), errors: [], truncated: false };
  try {
    let error = data(data(event, "details"), "error"); const seen = new Set();
    while (error && typeof error === "object" && !seen.has(error) && result.errors.length < 4) {
      seen.add(error);
      const name = data(error, "name"), code = data(error, "code"), operator = data(error, "operator"), failureType = data(error, "failureType");
      result.errors.push({ name: names.has(name) ? name : "OtherError", code: codes.has(code) ? code : null,
        failure_type: failureTypes.has(failureType) ? failureType : null, operator: operators.has(operator) ? operator : null,
        actual: shape(data(error, "actual")), expected: shape(data(error, "expected")), locations: frames(error) });
      error = data(error, "cause");
    }
    result.truncated = Boolean(error);
  } catch { result.truncated = true; }
  while (Buffer.byteLength(JSON.stringify(result)) > LIMIT) {
    result.truncated = true;
    const last = result.errors.at(-1);
    if (last?.locations.length) last.locations.pop(); else result.errors.pop();
  }
  return result;
}
const keys = (value, expected) => value && typeof value === "object" && !Array.isArray(value) &&
  Object.keys(value).length === expected.length && expected.every(key => Object.hasOwn(value, key));
const validLocation = value => keys(value, ["file", "line", "column"]) &&
  (value.file === null || value.file === "[outside-repository]" || sourceFile(value.file) === value.file) &&
  (value.line === null || position(value.line) === value.line) && (value.column === null || position(value.column) === value.column);
function validShape(value) {
  if (value?.kind === "string" || value?.kind === "array") return keys(value, ["kind", "length"]) && Number.isSafeInteger(value.length) && value.length >= 0;
  if (value?.kind === "boolean") return keys(value, ["kind", "value"]) && typeof value.value === "boolean";
  return keys(value, ["kind"]) && ["null", "undefined", "object", "number", "bigint", "symbol", "function"].includes(value.kind);
}
function admitFailureDetail(value) {
  return keys(value, ["schema_version", "policy", "location", "errors", "truncated"]) && value.schema_version === 1 &&
    value.policy === POLICY && typeof value.truncated === "boolean" && validLocation(value.location) &&
    Array.isArray(value.errors) && value.errors.length <= 4 && value.errors.every(error =>
      keys(error, ["name", "code", "failure_type", "operator", "actual", "expected", "locations"]) && names.has(error.name) &&
      (error.code === null || codes.has(error.code)) && (error.failure_type === null || failureTypes.has(error.failure_type)) &&
      (error.operator === null || operators.has(error.operator)) && validShape(error.actual) && validShape(error.expected) &&
      Array.isArray(error.locations) && error.locations.length <= 4 && error.locations.every(validLocation)) &&
    Buffer.byteLength(JSON.stringify(value)) <= LIMIT;
}
module.exports = { failureDetail, admitFailureDetail, LIMIT };
