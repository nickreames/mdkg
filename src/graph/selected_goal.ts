import { atomicReplaceContainedFile, containedPathExists, readContainedFile } from "../core/filesystem_authority";
import { identityRef, parseIdentityRef } from "./identity";
import { identityMatches } from "./identity_refs";
import type { Index, IndexNode } from "./indexer";
import { MAX_CONFIG_BYTES } from "../core/config";

export type SelectedGoalState = {
  qid: string;
  id: string;
  ws: string;
  selected_at: string;
  stable_ref?: string;
};

export const SELECTED_GOAL_PATH = ".mdkg/state/selected-goal.json";

export function readLocalGoalSelection(root: string): { state?: SelectedGoalState; warning?: string } {
  try {
    if (!containedPathExists({ root, relativePath: SELECTED_GOAL_PATH })) return {};
    const parsed = JSON.parse(readContainedFile({ root, relativePath: SELECTED_GOAL_PATH, maxBytes: MAX_CONFIG_BYTES }));
    if (!parsed || typeof parsed !== "object" ||
      !["qid", "id", "ws", "selected_at"].every((key) => typeof parsed[key] === "string") ||
      (parsed.stable_ref !== undefined && (typeof parsed.stable_ref !== "string" || !parseIdentityRef(parsed.stable_ref)))) {
      return { warning: "selected goal state is malformed; run `mdkg goal select <goal-id>`" };
    }
    return { state: {
      qid: parsed.qid.toLowerCase(), id: parsed.id.toLowerCase(), ws: parsed.ws.toLowerCase(),
      selected_at: parsed.selected_at,
      ...(parsed.stable_ref !== undefined ? { stable_ref: parsed.stable_ref } : {}),
    } };
  } catch {
    return { warning: "selected goal state is unreadable; run `mdkg goal select <goal-id>`" };
  }
}

export function writeLocalGoalSelection(root: string, node: IndexNode, now = new Date()): void {
  const state: SelectedGoalState = {
    qid: node.qid, id: node.id, ws: node.ws, selected_at: now.toISOString(),
    ...(node.identity ? { stable_ref: identityRef(node.identity) } : {}),
  };
  atomicReplaceContainedFile({ root, relativePath: SELECTED_GOAL_PATH }, `${JSON.stringify(state, null, 2)}\n`);
}

// Aliases in checkout-local state are display hints, never identity authority.
// Migration deliberately leaves selection bytes untouched: an old unbound v2
// selection must be explicitly selected again, not guessed from a reused alias.
export function resolveLocalGoalSelection(index: Index, state: SelectedGoalState): { node?: IndexNode; warning?: string } {
  let node: IndexNode | undefined;
  if (state.stable_ref) {
    const matches = identityMatches(index.nodes, state.stable_ref, state.ws).filter((candidate) => !candidate.source?.imported);
    if (matches.length === 1) node = matches[0];
    else return { warning: "selected goal identity is missing or ambiguous; run `mdkg goal select <goal-id>`" };
  } else if (index.meta.graph_format?.format_version === 2) {
    return { warning: "selected goal has no immutable identity binding in format v2; run `mdkg goal select <goal-id>`" };
  } else {
    node = index.nodes[state.qid];
  }
  if (!node || node.type !== "goal" || node.source?.imported) return { warning: "selected goal is missing from the local graph" };
  return { node };
}

export function selectionRequiresIdentity(index: Index, state?: SelectedGoalState): boolean {
  return index.meta.graph_format?.format_version === 2 || Boolean(state?.stable_ref);
}
