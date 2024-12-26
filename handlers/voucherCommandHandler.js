const VoucherService = require('../services/voucherService');
const { isAdmin } = require('../utils/adminUtils');
const { VOUCHER_IMAGES } = require('../constants/voucherImages');
const { formatVoucherMessage } = require('../utils/messageFormatter');

const voucherService = new VoucherService();

async function handleVoucherCommands(bot, msg) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;
  const command = msg.text.split(' ')[0];

  try {
    switch (command) {
      case '/freevoucher':
        const freeVoucher = voucherService.generateFreeVoucher(userId);
        await bot.sendPhoto(chatId, VOUCHER_IMAGES.free, {
          caption: formatVoucherMessage(freeVoucher),
          parse_mode: 'MarkdownV2'
        });
        break;

      case '/giftvoucher':
        if (!isAdmin(userId)) {
          await bot.sendMessage(chatId, 'Only administrators can generate gift vouchers');
          return;
        }
        const amount = parseInt(msg.text.split(' ')[1]);
        const giftVoucher = voucherService.generateGiftVoucher(userId, amount);
        await bot.sendPhoto(chatId, VOUCHER_IMAGES.gift, {
          caption: formatVoucherMessage(giftVoucher),
          parse_mode: 'MarkdownV2'
        });
        break;

      case '/checkvoucher':
        const currentVoucher = voucherService.getUserVoucher(userId);
        if (!currentVoucher || !currentVoucher.isValid()) {
          await bot.sendMessage(chatId, 'No valid voucher found');
          return;
        }
        await bot.sendPhoto(chatId, VOUCHER_IMAGES[currentVoucher.type], {
          caption: formatVoucherMessage(currentVoucher),
          parse_mode: 'MarkdownV2'
        });
        break;
    }
  } catch (error) {
    await bot.sendMessage(chatId, `Error: ${error.message}`);
  }
}

module.exports = {
  handleVoucherCommands
};