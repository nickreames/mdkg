// Test-only operator: callers own each synthetic checkout and have stopped
// its writers. Production has no automatic confirmation or approval wrapper.
export function reviewedFixtureRecovery(transaction: {
  inspectGraphTransaction: (...args: any[]) => any;
  continueGraphTransaction: (...args: any[]) => any;
}) {
  return (root: string, hash: string, mode: string, hooks = {}) => {
    const review = transaction.inspectGraphTransaction(root, hash).recovery[mode];
    return transaction.continueGraphTransaction(root, hash, mode, hooks, {
      lockEvidence: review.lock_evidence ?? undefined, confirmQuiescent: true,
    });
  };
}
