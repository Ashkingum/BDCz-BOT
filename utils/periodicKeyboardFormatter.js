const { PERIODIC_OPTIONS } = require('../constants/periodicOptions');

function formatPeriodicKeyboard(view = 'front') {
  const options = view === 'front' ? PERIODIC_OPTIONS.front : PERIODIC_OPTIONS.back;
  
  const keyboard = [
    options.map(period => ({
      text: period.label,
      callback_data: `period_${period.value}`
    })),
    [
      {
        text: view === 'front' ? '➡️' : '⬅️',
        callback_data: view === 'front' ? 'periodic_next' : 'periodic_prev'
      },
      {
        text: '❌ Cancel',
        callback_data: 'periodic_cancel'
      }
    ]
  ];

  return { inline_keyboard: keyboard };
}

module.exports = { formatPeriodicKeyboard };