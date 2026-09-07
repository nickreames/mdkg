import { UsageError } from "../util/errors";
import { MigrationParameters, planLegacyIdentityMigration, publicMigrationPlan } from "../graph/identity_migration";
import { applyGraphMigrationPlan, continueGraphTransaction, inspectGraphTransaction } from "../graph/identity_transaction";
import { readContainedFile } from "../core/filesystem_authority";
import { planIdentityReconciliation, ReconciliationParameters } from "../graph/identity_reconciliation_plan";

export function runGraphReconcileCommand(options: Omit<ReconciliationParameters, "decisions"> & {
  root: string; decisionsPath?: string; apply?: boolean; planHash?: string; json?: boolean;
}): void {
  if (options.apply && !options.planHash) throw new UsageError("graph reconcile --apply requires the exact reviewed --plan-hash");
  if (!options.apply && options.planHash) throw new UsageError("--plan-hash applies only with --apply; preview does not write");
  const decisions = options.decisionsPath ? JSON.parse(readContainedFile({ root: options.root, relativePath: options.decisionsPath,
    maxBytes: 1024 * 1024 })) : {};
  if (!decisions || typeof decisions !== "object" || Array.isArray(decisions)) throw new UsageError("--decisions must contain an object keyed by immutable mdkg:// references");
  const plan = planIdentityReconciliation(options.root, { ancestor: options.ancestor, incoming: options.incoming,
    target: options.target, decisions });
  console.log(JSON.stringify(options.apply ? applyGraphMigrationPlan(options.root, plan, options.planHash!) : publicMigrationPlan(plan), null, 2));
}

export function runGraphMigrateCommand(options: MigrationParameters & { root: string; apply?: boolean; planHash?: string; json?: boolean }): void {
  if (options.apply && !options.planHash) throw new UsageError("graph migrate --apply requires the exact reviewed --plan-hash");
  if (!options.apply && options.planHash) throw new UsageError("--plan-hash applies only with --apply; preview does not write");
  const plan = planLegacyIdentityMigration(options.root, {
    graphId: options.graphId, origin: options.origin, ancestor: options.ancestor,
  });
  const result = options.apply ? applyGraphMigrationPlan(options.root, plan, options.planHash!) : publicMigrationPlan(plan);
  console.log(JSON.stringify(result, null, 2));
}

export function runGraphRecoverCommand(options: { root: string; hash: string; resume?: boolean; rollback?: boolean; json?: boolean }): void {
  if (options.resume && options.rollback) throw new UsageError("graph recover requires at most one of --resume or --rollback");
  const result = options.resume || options.rollback
    ? continueGraphTransaction(options.root, options.hash, options.rollback ? "rollback" : "resume")
    : inspectGraphTransaction(options.root, options.hash);
  console.log(JSON.stringify(result, null, 2));
}
