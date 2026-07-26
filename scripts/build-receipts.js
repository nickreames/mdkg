const fs = require("node:fs");
const path = require("node:path");

function appendJsonLine(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, "utf8");
}

function recordBuildReceipt(value, receiptDir = process.env.MDKG_BUILD_RECEIPT_DIR) {
  if (!receiptDir) {
    return;
  }
  appendJsonLine(path.join(receiptDir, "build-events.jsonl"), {
    schema_version: 1,
    ...value,
  });
}

function readJsonLines(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  return fs.readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

module.exports = {
  appendJsonLine,
  readJsonLines,
  recordBuildReceipt,
};
