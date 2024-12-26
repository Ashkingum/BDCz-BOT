function formatAdminMenu() {
  return {
    inline_keyboard: [
      [
        { text: '📊 Account status', callback_data: 'admin_status' },
        { text: '👥 Referrals', callback_data: 'admin_referrals' }
      ],
      [
        { text: '🎟️ Generate Voucher', callback_data: 'admin_gen_voucher' },
        { text: '📤 Withdrawals', callback_data: 'admin_withdrawals' }
      ],
      [
        { text: '🔒 Staking', callback_data: 'admin_staking' },
        { text: '🎮 GameZ', callback_data: 'admin_gamez' }
      ],
      [
        { text: '📈 My Stats', callback_data: 'admin_stats' },
        { text: '❄️ Freezer', callback_data: 'admin_freezer' }
      ],
      [
        { text: '⚙️ Bot functions', callback_data: 'admin_bot_functions' },
        { text: '📢 Broadcasting', callback_data: 'admin_broadcast' }
      ],
      [
        { text: '👥 Subscribers', callback_data: 'admin_subscribers' },
        { text: '📝 Pending Withdrawals', callback_data: 'admin_pending_withdrawals' }
      ],
      [
        { text: '🎁 Generate gift vouchers', callback_data: 'admin_gift_vouchers' },
        { text: '🎫 Redeem portal', callback_data: 'admin_redeem_portal' }
      ],
      [
        { text: '💳 Transactions', callback_data: 'admin_transactions' },
        { text: '🛡️ Mods', callback_data: 'admin_mods' }
      ],
      [
        { text: '📊 General stats', callback_data: 'admin_general_stats' }
      ]
    ]
  };
}

module.exports = { formatAdminMenu };