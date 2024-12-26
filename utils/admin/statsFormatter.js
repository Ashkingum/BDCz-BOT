const { formatDateTime } = require('../dateFormatter');

function formatGeneralStats(dailyStats, overallStats) {
  return `*📊 General Statistics*\n\n` +
    `*1. Daily Statistics*\n` +
    `Last Reset: ${formatDateTime(dailyStats.lastReset)}\n\n` +
    `Daily Subscriptions: ${dailyStats.subscriptions}\n` +
    `Daily Vouchers Generated: ${dailyStats.vouchersGenerated}\n` +
    `Daily Pending Withdrawals: ${dailyStats.pendingWithdrawals}\n` +
    `Daily Withdrawals Approved: ${dailyStats.withdrawalsApproved}\n` +
    `Daily Payout Amount: $${dailyStats.payoutAmount.toFixed(2)}\n\n` +
    `*2. Overall Statistics*\n\n` +
    `Total Subscribers: ${overallStats.totalSubscribers}\n` +
    `Active Users: ${overallStats.activeUsers}\n` +
    `Inactive Users: ${overallStats.inactiveUsers}\n` +
    `Vouchers Generated: ${overallStats.vouchersGenerated}\n` +
    `Pending Withdrawals: ${overallStats.pendingWithdrawals}\n` +
    `Withdrawals Approved: ${overallStats.withdrawalsApproved}\n` +
    `Total Payout: $${overallStats.totalPayout.toFixed(2)}`;
}

module.exports = { formatGeneralStats };