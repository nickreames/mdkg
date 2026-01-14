import { EdgeMap } from "../graph/edges";
import { Index } from "../graph/indexer";

const ARCH_TYPES = ["edd", "dec", "rule"] as const;
const FALLBACK_TYPES = [
  "edd",
  "dec",
  "rule",
  "prd",
  "prop",
  "epic",
  "feat",
  "task",
  "bug",
  "checkpoint",
] as const;
const WORK_TYPES = ["epic", "feat", "task", "bug", "checkpoint"] as const;

type OrderKey = {
  group: number;
  subgroup: number;
  type_priority: number;
  id_number: number;
  title: string;
  qid: string;
};

function idNumber(id: string): number {
  const match = id.match(/-(\d+)$/);
  if (!match) {
    return Number.POSITIVE_INFINITY;
  }
  const parsed = Number.parseInt(match[1], 10);
  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
}

function typePriority(type: string, order: readonly string[]): number {
  const idx = order.indexOf(type);
  if (idx === -1) {
    return order.length + 1;
  }
  return idx;
}

function rootRelationPriority(rootEdges: EdgeMap, qid: string): number {
  if (rootEdges.blocked_by.includes(qid)) {
    return 0;
  }
  if (rootEdges.blocks.includes(qid)) {
    return 1;
  }
  if (rootEdges.prev === qid) {
    return 2;
  }
  if (rootEdges.next === qid) {
    return 3;
  }
  if (rootEdges.relates.includes(qid)) {
    return 4;
  }
  return 5;
}

function immediateContextPriority(rootEdges: EdgeMap, qid: string, nodeType: string): number | undefined {
  if (rootEdges.parent === qid) {
    return 0;
  }
  if (rootEdges.epic === qid) {
    return 1;
  }
  if (rootEdges.relates.includes(qid) && nodeType === "checkpoint") {
    return 2;
  }
  if (rootEdges.blocked_by.includes(qid) || rootEdges.blocks.includes(qid)) {
    return 3;
  }
  return undefined;
}

function buildOrderKey(
  index: Index,
  rootQid: string,
  qid: string,
  depths: Map<string, number>
): OrderKey {
  const node = index.nodes[qid];
  const root = index.nodes[rootQid];
  const depth = depths.get(qid);
  const rootIsTask = root.type === "task" || root.type === "bug";

  if (qid === rootQid) {
    return {
      group: 0,
      subgroup: 0,
      type_priority: 0,
      id_number: idNumber(node.id),
      title: node.title.toLowerCase(),
      qid,
    };
  }

  if (rootIsTask) {
    const immediatePriority = depth === 1 ? immediateContextPriority(root.edges, qid, node.type) : undefined;
    if (immediatePriority !== undefined) {
      return {
        group: 1,
        subgroup: immediatePriority,
        type_priority: 0,
        id_number: idNumber(node.id),
        title: node.title.toLowerCase(),
        qid,
      };
    }

    if (ARCH_TYPES.includes(node.type as (typeof ARCH_TYPES)[number])) {
      return {
        group: 2,
        subgroup: 0,
        type_priority: typePriority(node.type, ARCH_TYPES),
        id_number: idNumber(node.id),
        title: node.title.toLowerCase(),
        qid,
      };
    }

    if (node.type === "prd") {
      return {
        group: 3,
        subgroup: 0,
        type_priority: 0,
        id_number: idNumber(node.id),
        title: node.title.toLowerCase(),
        qid,
      };
    }

    if (node.type === "prop") {
      return {
        group: 4,
        subgroup: 0,
        type_priority: 0,
        id_number: idNumber(node.id),
        title: node.title.toLowerCase(),
        qid,
      };
    }

    return {
      group: 5,
      subgroup: rootRelationPriority(root.edges, qid),
      type_priority: typePriority(node.type, WORK_TYPES),
      id_number: idNumber(node.id),
      title: node.title.toLowerCase(),
      qid,
    };
  }

  return {
    group: 1,
    subgroup: typePriority(node.type, FALLBACK_TYPES),
    type_priority: 0,
    id_number: idNumber(node.id),
    title: node.title.toLowerCase(),
    qid,
  };
}

export function orderPackNodes(
  index: Index,
  rootQid: string,
  qids: string[],
  depths: Map<string, number>
): string[] {
  return [...qids].sort((a, b) => {
    const keyA = buildOrderKey(index, rootQid, a, depths);
    const keyB = buildOrderKey(index, rootQid, b, depths);

    if (keyA.group !== keyB.group) {
      return keyA.group - keyB.group;
    }
    if (keyA.subgroup !== keyB.subgroup) {
      return keyA.subgroup - keyB.subgroup;
    }
    if (keyA.type_priority !== keyB.type_priority) {
      return keyA.type_priority - keyB.type_priority;
    }
    if (keyA.id_number !== keyB.id_number) {
      return keyA.id_number - keyB.id_number;
    }
    if (keyA.title !== keyB.title) {
      return keyA.title.localeCompare(keyB.title);
    }
    return keyA.qid.localeCompare(keyB.qid);
  });
}
