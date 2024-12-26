const { formatDateTime } = require('../dateFormatter');

function formatWithdrawalList(withdrawals) {
  return withdrawals.map((w, i) => 
    `${i + 1}- ${w.username} - Amount: $${w.amount.toFixed(2)} - ${formatCountdown(w.requestDate)}`
  ).join('\n');
}

function formatWithdrawalDetails(withdrawal) {
  return `*Withdrawal Request Details*\n\n` +
    `Account Number: ${withdrawal.accountNumber}\n` +
    `Account Status: ${withdrawal.accountStatus}\n` +
    `Name: ${withdrawal.username}\n` +
    `Amount: $${withdrawal.amount.toFixed(2)}`;
}

function formatCountdown(requestDate) {
  const elapsed = Date.now() - requestDate;
  const hours = Math.floor(elapsed / (1000 * 60 * 60));
  const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}H ${minutes}m`;
}

module.exports = {
  formatWithdrawalList,
  formatWithdrawalDetails
};