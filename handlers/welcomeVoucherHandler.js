const { VOUCHER_IMAGES } = require('../constants/voucherImages');
const { formatVoucherMessage } = require('../utils/messageFormatter');
const VoucherService = require('../services/voucherService');
const { getMainKeyboard, removeKeyboard } = require('../utils/keyboardUtils');

const voucherService = new VoucherService();

async function handleWelcomeVoucher(bot, msg) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;

  try {
    const welcomeVoucher = voucherService.generateWelcomeVoucher(userId);
    
    // Send welcome voucher with keyboard shown
    await bot.sendPhoto(chatId, VOUCHER_IMAGES.welcome, {
      caption: "Here's a welcome gift for you... enjoy.\n\nUse the Menu button for navigation.\n\n" + formatVoucherMessage(welcomeVoucher),
      parse_mode: 'MarkdownV2',
      reply_markup: getMainKeyboard(true)
    });

    // Send initial account status with keyboard hidden
    const account = accountService.getAccount(msg.from.username);
    await accountService.updateStatus(bot, msg.from.username);
    
    // Remove keyboard after initial display
    await bot.sendMessage(chatId, 'Type /menu to show options again', {
      reply_markup: removeKeyboard()
    });
  } catch (error) {
    console.error('Error handling welcome voucher:', error);
    await bot.sendMessage(chatId, 'Failed to generate welcome voucher. Please try again.', {
      reply_markup: removeKeyboard()
    });
  }
}