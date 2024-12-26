// Define all menu options and their configurations
const MENU_OPTIONS = {
  ACCOUNT_STATUS: {
    text: '📊 Account Status',
    callback: 'menu_status'
  },
  REFERRALS: {
    text: '👥 Referrals',
    callback: 'menu_referrals'
  },
  VOUCHER: {
    text: '🎟️ Generate Voucher',
    callback: 'menu_voucher'
  },
  WITHDRAWALS: {
    text: '📤 Withdrawals',
    callback: 'menu_withdraw'
  },
  STAKING: {
    text: '🔒 Staking',
    callback: 'menu_stake'
  },
  GAMEZ: {
    text: '🎮 GameZ',
    callback: 'menu_games'
  },
  STATS: {
    text: '📈 My Stats',
    callback: 'menu_stats'
  },
  FREEZER: {
    text: '❄️ Freezer',
    callback: 'menu_freeze'
  }
};

module.exports = { MENU_OPTIONS };