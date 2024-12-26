class WithdrawalService {
  constructor() {
    this.pendingWithdrawals = new Map();
    this.approvedWithdrawals = new Map();
    this.PAGE_SIZE = 10;
  }

  getPendingWithdrawals(page) {
    const sortedWithdrawals = Array.from(this.pendingWithdrawals.values())
      .sort((a, b) => a.requestDate - b.requestDate);
    
    const start = (page - 1) * this.PAGE_SIZE;
    return {
      withdrawals: sortedWithdrawals.slice(start, start + this.PAGE_SIZE),
      totalPages: Math.ceil(sortedWithdrawals.length / this.PAGE_SIZE),
      currentPage: page
    };
  }

  getWithdrawal(id) {
    return this.pendingWithdrawals.get(id);
  }

  async approveWithdrawal(id, txnId) {
    const withdrawal = this.pendingWithdrawals.get(id);
    if (!withdrawal) throw new Error('Withdrawal not found');

    withdrawal.status = 'approved';
    withdrawal.txnId = txnId;
    withdrawal.approvedAt = new Date();

    this.approvedWithdrawals.set(id, withdrawal);
    this.pendingWithdrawals.delete(id);

    return withdrawal;
  }

  async rejectWithdrawal(id) {
    return this.pendingWithdrawals.delete(id);
  }
}

module.exports = WithdrawalService;