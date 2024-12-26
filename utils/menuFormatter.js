const { MENU_OPTIONS } = require('../constants/menuOptions');

function formatMainMenu() {
  return {
    inline_keyboard: [
      [
        { text: MENU_OPTIONS.ACCOUNT_STATUS.text, callback_data: MENU_OPTIONS.ACCOUNT_STATUS.callback },
        { text: MENU_OPTIONS.REFERRALS.text, callback_data: MENU_OPTIONS.REFERRALS.callback }
      ],
      [
        { text: MENU_OPTIONS.VOUCHER.text, callback_data: MENU_OPTIONS.VOUCHER.callback },
        { text: MENU_OPTIONS.WITHDRAWALS.text, callback_data: MENU_OPTIONS.WITHDRAWALS.callback }
      ],
      [
        { text: MENU_OPTIONS.STAKING.text, callback_data: MENU_OPTIONS.STAKING.callback },
        { text: MENU_OPTIONS.GAMEZ.text, callback_data: MENU_OPTIONS.GAMEZ.callback }
      ],
      [
        { text: MENU_OPTIONS.STATS.text, callback_data: MENU_OPTIONS.STATS.callback },
        { text: MENU_OPTIONS.FREEZER.text, callback_data: MENU_OPTIONS.FREEZER.callback }
      ],
      [
        { text: '🔙 Return to Menu', callback_data: 'return_menu' }
      ]
    ]
  };
}

module.exports = { formatMainMenu };