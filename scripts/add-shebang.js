const fs = require("fs");
const path = require("path");

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
