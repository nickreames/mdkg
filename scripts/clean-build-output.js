#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const mode = process.argv[2];
const targets = mode === "tests" ? ["dist/tests"] : ["dist"];

for (const target of targets) {
  fs.rmSync(path.join(root, target), { recursive: true, force: true });
}
