const { VOUCHER_IMAGES } = require('../constants/voucherImages');
const { formatVoucherMessage } = require('../utils/messageFormatter');
const VoucherService = require('../services/voucherService');
const { isAdmin } = require('../utils/adminUtils');

const voucherService = new VoucherService();

async function handleGiftVoucher(bot, msg) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;

  try {
    if (!isAdmin(userId)) {
      await bot.sendMessage(chatId, '⛔ Only administrators can generate gift vouchers');
      return;
    }

    const amount = parseInt(msg.text.split(' ')[1]) || 1;
    if (![1, 5, 10].includes(amount)) {
      await bot.sendMessage(chatId, '❌ Invalid amount. Gift vouchers can only be $1, $5, or $10');
      return;
    }

    const giftVoucher = voucherService.generateGiftVoucher(userId, amount);
    await bot.sendPhoto(chatId, VOUCHER_IMAGES.gift[amount], {
      caption: formatVoucherMessage(giftVoucher),
      parse_mode: 'MarkdownV2',
      reply_markup: {
        inline_keyboard: [[
          { text: 'Next', callback_data: 'gift_next' }
        ]]
      }
    });
  } catch (error) {
    console.error('Error handling gift voucher:', error);
    await bot.sendMessage(chatId, 'Failed to generate gift voucher. Please try again.');
  }
}