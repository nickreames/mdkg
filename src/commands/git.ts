import { GitStatusEntry, insideGitWorkTree, observeGit, readGitHead, readGitStatus } from "../util/git_observation";
import { ValidationError } from "../util/errors";
import { redactRemoteRef, remoteUsesOpaqueHelper } from "../util/git_remote";

type GitRemoteSummary = {
  name: string;
  fetch_url: string;
  push_url: string;
};

type GitSourceDescriptor = {
  kind: "git";
  repository_ref: string | null;
  remote: string | null;
  branch: string | null;
  access_ref: "external-git-auth";
};

type GitAcceptedRevision = {
  commit_sha: string | null;
  tree_hash: string | null;
  branch: string | null;
};

type GitInspectReceipt = {
  action: "git.inspect";
  ok: true;
  root: string;
  inside_work_tree: boolean;
  branch: string | null;
  head_sha: string | null;
  tree_hash: string | null;
  remotes: GitRemoteSummary[];
  status: {
    clean: boolean;
    entry_count: number;
    entries: GitStatusEntry[];
  };
  source_descriptor: GitSourceDescriptor;
  accepted_revision: GitAcceptedRevision;
  warnings: string[];
};

export type GitInspectCommandOptions = {
  root: string;
  json?: boolean;
};

function gitLine(cwd: string, args: string[]): string {
  // Remove only Git's output terminator, not whitespace from authored values.
  return observeGit(cwd, args).stdout.replace(/\r?\n$/, "");
}

function currentBranch(root: string): string | null {
  return gitLine(root, ["branch", "--show-current"]) || null;
}

function readTree(root: string, head: string): string {
  const value = gitLine(root, ["rev-parse", "--verify", `${head}^{tree}`]);
  if (!/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(value)) {
    throw new ValidationError("Git rev-parse observation failed; invalid tree identity");
  }
  return value;
}

function listRemotes(root: string): GitRemoteSummary[] {
  const output = gitLine(root, ["remote"]);
  if (!output) {
    return [];
  }
  return output
    .split(/\r?\n/)
    .filter(Boolean)
    .sort()
    .map((name) => {
      const opaqueHelper = remoteUsesOpaqueHelper(root, name);
      return {
        name,
        fetch_url: redactRemoteRef(gitLine(root, ["remote", "get-url", "--", name]), opaqueHelper),
        push_url: redactRemoteRef(gitLine(root, ["remote", "get-url", "--push", "--", name]), opaqueHelper),
      };
    });
}

function buildSourceDescriptor(inspect: GitInspectReceipt): GitSourceDescriptor {
  const remote = inspect.remotes.find((item) => item.name === "origin") ?? inspect.remotes[0];
  return {
    kind: "git",
    repository_ref: remote?.fetch_url ?? null,
    remote: remote?.name ?? null,
    branch: inspect.branch,
    access_ref: "external-git-auth",
  };
}

function buildAcceptedRevision(inspect: GitInspectReceipt): GitAcceptedRevision {
  return {
    commit_sha: inspect.head_sha,
    tree_hash: inspect.tree_hash,
    branch: inspect.branch,
  };
}

function collectInspectReceipt(root: string): GitInspectReceipt {
  const inside = insideGitWorkTree(root);
  const statusEntries = inside ? readGitStatus(root, { untracked: "all" }) : [];
  const head = inside ? readGitHead(root) : null;
  const receipt: GitInspectReceipt = {
    action: "git.inspect",
    ok: true,
    root,
    inside_work_tree: inside,
    branch: inside ? currentBranch(root) : null,
    head_sha: head,
    tree_hash: head ? readTree(root, head) : null,
    remotes: inside ? listRemotes(root) : [],
    status: {
      clean: inside && statusEntries.length === 0,
      entry_count: statusEntries.length,
      entries: statusEntries,
    },
    source_descriptor: {
      kind: "git",
      repository_ref: null,
      remote: null,
      branch: null,
      access_ref: "external-git-auth",
    },
    accepted_revision: {
      commit_sha: null,
      tree_hash: null,
      branch: null,
    },
    warnings: [],
  };
  receipt.source_descriptor = buildSourceDescriptor(receipt);
  receipt.accepted_revision = buildAcceptedRevision(receipt);
  if (!inside) {
    receipt.warnings.push("not inside a Git work tree");
  }
  return receipt;
}

function printJson(value: unknown): void {
  console.log(JSON.stringify(value, null, 2));
}

function printInspect(receipt: GitInspectReceipt): void {
  console.log(`git work tree: ${receipt.inside_work_tree ? "yes" : "no"}`);
  console.log(`branch: ${receipt.branch ?? "(detached or unknown)"}`);
  console.log(`head: ${receipt.head_sha ?? "(none)"}`);
  console.log(`tree: ${receipt.tree_hash ?? "(none)"}`);
  console.log(`status: ${receipt.status.clean ? "clean" : `${receipt.status.entry_count} change(s)`}`);
  for (const remote of receipt.remotes) {
    console.log(`remote ${remote.name}: ${remote.fetch_url}`);
  }
}

export function runGitInspectCommand(options: GitInspectCommandOptions): void {
  const receipt = collectInspectReceipt(options.root);
  if (options.json) {
    printJson(receipt);
    return;
  }
  printInspect(receipt);
}
