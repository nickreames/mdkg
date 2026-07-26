#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

module.exports = async function* coverageReporter(source) {
  const outputPath = process.env.MDKG_COVERAGE_EVENT_PATH;
  let coverage;
  let testSummary;

  try {
    for await (const event of source) {
      if (event.type === "test:coverage") {
        coverage = event.data;
      } else if (event.type === "test:summary") {
        testSummary = event.data;
      }
      if (event.type === "test:pass") {
        yield `PASS ${event.data.name}\n`;
      } else if (event.type === "test:fail") {
        yield `FAIL ${event.data.name}\n`;
      } else if (event.type === "test:diagnostic" && event.data.level !== "info") {
        yield `${event.data.level.toUpperCase()} ${event.data.message}\n`;
      } else if (event.type === "test:stderr" || event.type === "test:stdout") {
        yield event.data.message;
      } else if (event.type === "test:summary") {
        yield `SUMMARY pass=${event.data.counts?.passed ?? 0} fail=${event.data.counts?.failed ?? 0} total=${event.data.counts?.tests ?? 0}\n`;
      }
    }
  } finally {
    if (outputPath) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(
        outputPath,
        `${JSON.stringify({ coverage, test_summary: testSummary }, null, 2)}\n`,
        "utf8",
      );
    }
  }
};
