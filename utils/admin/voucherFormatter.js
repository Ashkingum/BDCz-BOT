function formatBatchVoucherMenu() {
  return {
    inline_keyboard: [
      [
        { text: 'Gift Voucher', callback_data: 'batch_gift' },
        { text: 'Free Voucher', callback_data: 'batch_free' }
      ],
      [{ text: 'Return to Menu', callback_data: 'return_menu' }]
    ]
  };
}

function formatBatchGiftAmountMenu() {
  return {
    inline_keyboard: [
      [
        { text: '$1', callback_data: 'batch_gift_1' },
        { text: '$5', callback_data: 'batch_gift_5' },
        { text: '$10', callback_data: 'batch_gift_10' }
      ],
      [{ text: 'Cancel', callback_data: 'return_menu' }]
    ]
  };
}

function formatBatchQuantityMenu(type, amount = null) {
  const baseData = amount ? `batch_${type}_${amount}` : `batch_${type}`;
  
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
  formatBatchVoucherMenu,
  formatBatchGiftAmountMenu,
  formatBatchQuantityMenu
};