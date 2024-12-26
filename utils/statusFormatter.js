const { formatDateTime } = require('./dateFormatter');

function formatAccountStatus(account, newValue = 0) {
  const availableBalance = account.getAvailableBalance();
  const formattedAvailable = availableBalance === 'Nulle' 
    ? availableBalance 
    : `$${availableBalance.toFixed(2)}`;

  return `_BDCz account status_
📆 ${formatDateTime(account.lastUpdate)}
🆔️ Subscriber: ${account.username}
🛅 Account ${account.accountNumber}
👥 Referrals: ${account.referrals.length}/10
🔥 Streak: ${account.streak}
🪙 New added value: $${newValue.toFixed(2)}
💰 New balance: $${account.balance.toFixed(2)}
📈 Total generated: $${account.totalGenerated.toFixed(2)}
📤 Total withdrawn: $${account.totalWithdrawn.toFixed(2)}
🔓 Available balance: ${formattedAvailable}
🔒 Staked amount: $${account.stakedAmount.toFixed(2)}
🏦 Vault balance: $${account.getVaultBalance().toFixed(2)}`;
}

module.exports = { formatAccountStatus };