export type PackTruncation = {
  max_nodes: boolean;
  max_bytes: boolean;
  dropped: string[];
  max_chars?: boolean;
  max_lines?: boolean;
  max_tokens?: boolean;
  body_truncated?: string[];
};

export type PackProfile = "standard" | "concise" | "headers";
export type PackBodyMode = "full" | "summary" | "none";

export type PackMeta = {
  root: string;
  depth: number;
  verbose: boolean;
  generated_at: string;
  node_count: number;
  truncated: PackTruncation;
  profile?: PackProfile;
  body_mode?: PackBodyMode;
};

export type PackNode = {
  qid: string;
  id: string;
  workspace: string;
  type: string;
  title: string;
  status?: string;
  priority?: number;
  path: string;
  links: string[];
  artifacts: string[];
  refs: string[];
  aliases: string[];
  body: string;
};

export type PackResult = {
  meta: PackMeta;
  nodes: PackNode[];
};

export type PackBuildResult = {
  pack: PackResult;
  warnings: string[];
};

export type PackStatsNode = {
  qid: string;
  chars: number;
  lines: number;
  bytes: number;
  tokens_estimate: number;
};

export type PackStats = {
  nodes: PackStatsNode[];
  totals: {
    chars: number;
    lines: number;
    bytes: number;
    tokens_estimate: number;
  };
};

export type PackTruncationReport = {
  root: string;
  profile: PackProfile;
  limits: {
    max_chars?: number;
    max_lines?: number;
    max_tokens?: number;
  };
  before: {
    node_count: number;
    chars: number;
    lines: number;
    bytes: number;
    tokens_estimate: number;
  };
  after: {
    node_count: number;
    chars: number;
    lines: number;
    bytes: number;
    tokens_estimate: number;
  };
  dropped_nodes: string[];
  body_truncated_nodes: string[];
};
