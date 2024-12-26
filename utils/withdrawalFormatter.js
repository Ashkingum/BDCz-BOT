function formatWithdrawalMessage(amount, percentage) {
  return `Withdrawal Request\n\n` +
    `Amount: $${amount.toFixed(2)}\n` +
    `Percentage: ${percentage}%`;
}

module.exports = { formatWithdrawalMessage };