function formatStatsMessage(stats) {
  return `- Days active: ${stats.daysActive}/360\n\n` +
    `Days inactive: ${stats.daysInactive}/360\n\n` +
    `Bonus Voucher codes received: ${stats.bonusVouchersReceived}\n\n` +
    `Voucher codes generated: ${stats.vouchersGenerated}\n\n` +
    `Voucher codes redeemed: ${stats.vouchersRedeemed}\n\n` +
    `Voucher codes expired: ${stats.vouchersExpired}\n\n` +
    `Highest streak record: ${stats.highestStreak}/360`;
}

module.exports = { formatStatsMessage };