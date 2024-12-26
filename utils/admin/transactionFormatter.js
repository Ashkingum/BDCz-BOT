const { formatDateTime } = require('../dateFormatter');

function formatTransactionDetails(transaction) {
  return `*Transaction Details*\n\n` +
    `Txn ID: \`${transaction.txnId}\`\n` +
    `Username: ${transaction.username}\n` +
    `Amount: $${transaction.amount.toFixed(2)}`;
}

module.exports = { formatTransactionDetails };