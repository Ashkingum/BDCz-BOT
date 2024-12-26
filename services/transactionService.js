const { generateTxnId } = require('../utils/transactionUtils');

class TransactionService {
  constructor() {
    this.transactions = new Map();
  }

  getTransaction(txnId) {
    return this.transactions.get(txnId);
  }

  async markAsPaid(txnId) {
    const transaction = this.transactions.get(txnId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    transaction.status = 'paid';
    transaction.paidAt = new Date();
    return transaction;
  }

  async deleteTransaction(txnId) {
    return this.transactions.delete(txnId);
  }
}

module.exports = TransactionService;