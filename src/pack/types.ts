export type PackTruncation = {
  max_nodes: boolean;
  max_bytes: boolean;
  dropped: string[];
};

export type PackMeta = {
  root: string;
  depth: number;
  verbose: boolean;
  generated_at: string;
  node_count: number;
  truncated: PackTruncation;
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
