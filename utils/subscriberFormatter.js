// Add to existing subscriberFormatter.js

function formatVoucherMenu(userId) {
  return {
    inline_keyboard: [
      [
        { text: 'Gift Voucher', callback_data: `voucher_gift_${userId}` },
        { text: 'Free Voucher', callback_data: `voucher_free_${userId}` }
      ],
      [{ text: 'Return to Menu', callback_data: 'return_menu' }]
    ]
  };
}

function formatGiftAmountMenu(userId) {
  return {
    inline_keyboard: [
      [
        { text: '$1', callback_data: `voucher_gift_${userId}_1` },
        { text: '$5', callback_data: `voucher_gift_${userId}_5` },
        { text: '$10', callback_data: `voucher_gift_${userId}_10` }
      ],
      [{ text: 'Cancel', callback_data: 'return_menu' }]
    ]
  };
}

function formatQuantityMenu(userId, type, amount = null) {
  const baseData = amount ? `voucher_${type}_${userId}_${amount}` : `voucher_${type}_${userId}`;
  
  return {
    inline_keyboard: [
      [
        { text: '1', callback_data: `${baseData}_1` },
        { text: '2', callback_data: `${baseData}_2` },
        { text: '3', callback_data: `${baseData}_3` },
        { text: '4', callback_data: `${baseData}_4` },
        { text: '5', callback_data: `${baseData}_5` }
      ],
      [{ text: 'Cancel', callback_data: 'return_menu' }]
    ]
  };
}

module.exports = {
  // ... existing exports ...
  formatVoucherMenu,
  formatGiftAmountMenu,
  formatQuantityMenu
};