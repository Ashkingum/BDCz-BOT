const { VOUCHER_IMAGES } = require('../constants/voucherImages');
const { formatVoucherMessage } = require('../utils/messageFormatter');
const VoucherService = require('../services/voucherService');

const voucherService = new VoucherService();

async function handleFreeVoucher(bot, msg) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;

  try {
    const freeVoucher = voucherService.generateFreeVoucher(userId);
    await bot.sendPhoto(chatId, VOUCHER_IMAGES.free, {
      caption: formatVoucherMessage(freeVoucher),
      parse_mode: 'MarkdownV2',
      reply_markup: {
        inline_keyboard: [[
          { text: 'Next', callback_data: 'free_next' }
        ]]
      }
    });
  } catch (error) {
    console.error('Error handling free voucher:', error);
    if (error.message === 'Cooldown period not elapsed') {
      await bot.sendMessage(chatId, '⏳ Please wait for the cooldown period to end before generating another free voucher.');
    } else {
      await bot.sendMessage(chatId, 'Failed to generate free voucher. Please try again.');
    }
  }
}

module.exports = {
  handleFreeVoucher
};