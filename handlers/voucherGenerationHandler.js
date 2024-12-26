const VoucherService = require('../services/voucherService');
const { VOUCHER_IMAGES } = require('../constants/voucherImages');
const { formatVoucherMessage } = require('../utils/messageFormatter');

const voucherService = new VoucherService();

async function handleVoucherGeneration(bot, msg) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;

  try {
    const voucher = await voucherService.generateFreeVoucher(userId);
    await bot.sendPhoto(chatId, VOUCHER_IMAGES.free, {
      caption: formatVoucherMessage(voucher),
      parse_mode: 'MarkdownV2'
    });
  } catch (error) {
    await bot.sendMessage(chatId, 'Sorry! Try again later.');
  }
}