function formatDelayOptions() {
  return {
    inline_keyboard: [
      [
        { text: '0s', callback_data: 'broadcast_delay_0' },
        { text: '1m', callback_data: 'broadcast_delay_60' },
        { text: '5m', callback_data: 'broadcast_delay_300' }
      ],
      [
        { text: '30m', callback_data: 'broadcast_delay_1800' },
        { text: '1H', callback_data: 'broadcast_delay_3600' },
        { text: '12H', callback_data: 'broadcast_delay_43200' }
      ]
    ]
  };
}

function formatCountdown(scheduledTime) {
  const remaining = scheduledTime - Date.now();
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

module.exports = {
  formatDelayOptions,
  formatCountdown
};