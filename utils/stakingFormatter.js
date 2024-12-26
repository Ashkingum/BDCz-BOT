const { formatDateTime } = require('./dateFormatter');

function formatStakingStatus(status) {
  const { vault, stakes } = status;

  let message = `Vault - $${vault.toFixed(2)}\n\n`;

  stakes.forEach(stake => {
    message += `Staked - $${stake.amount.toFixed(2)}\n`;
    message += `${formatDateTime(stake.timestamp)}\n`;
    if (stake.bonus > 0) {
      message += `Bonus - $${stake.bonus.toFixed(2)}\n`;
    }
    message += '\n';
  });

  return message;
}

module.exports = { formatStakingStatus };