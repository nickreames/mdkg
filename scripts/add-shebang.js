const fs = require("fs");
const path = require("path");
const { recordBuildReceipt } = require("./build-receipts");

const cliPath = path.join(__dirname, "..", "dist", "cli.js");
const shebang = "#!/usr/bin/env node";

if (!fs.existsSync(cliPath)) {
  console.error(`Missing build output: ${cliPath}`);
  process.exit(1);
}

const contents = fs.readFileSync(cliPath, "utf8");
if (!contents.startsWith(shebang)) {
  fs.writeFileSync(cliPath, `${shebang}\n${contents}`);
}

recordBuildReceipt({
  kind: "root",
  owner: "root",
  profile: "package",
  cache_hit: false,
  node: process.version,
});
