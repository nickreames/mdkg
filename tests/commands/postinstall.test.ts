import { test } from "node:test";
import assert from "node:assert/strict";
import path from "path";

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const postinstall = require(path.join(repoRoot, "scripts", "postinstall.js"));
const packageVersion = require(path.join(repoRoot, "package.json")).version;

test("postinstall hint prints starter command and PATH snippets when global bin is missing", () => {
  const message = postinstall.buildPostinstallMessage(
    { PATH: "/usr/bin" },
    "darwin",
    () => ({ status: 0, stdout: "/opt/homebrew\n" })
  );

  assert.match(message, new RegExp(`mdkg ${packageVersion.replace(/\./g, "\\.")} installed`));
  assert.match(message, /mdkg --help/);
  assert.match(message, /export PATH="\/opt\/homebrew\/bin:\$PATH"/);
  assert.match(message, /\.zshrc/);
  assert.match(message, /\.bashrc/);
});

test("postinstall hint avoids PATH snippets when global bin is already present", () => {
  const message = postinstall.buildPostinstallMessage(
    { PATH: `/usr/bin${path.delimiter}/opt/homebrew/bin` },
    "darwin",
    () => ({ status: 0, stdout: "/opt/homebrew\n" })
  );

  assert.match(message, /mdkg --help/);
  assert.doesNotMatch(message, /export PATH=/);
});
