const VoucherService = require('../../services/voucherService');
const { formatVoucherMenu } = require('../../utils/subscriberFormatter');

const voucherService = new VoucherService();

async function handleVoucherMenu(bot, msg, userId) {
  const chatId = msg.chat.id;

  await bot.sendMessage(chatId,
    'Generate vouchers for the selected user:',
    {
      reply_markup: formatVoucherMenu(userId)
    }
  );
}

async function handleVoucherGeneration(bot, query) {
  const [_, type, userId, amount, quantity] = query.data.split('_');
  const chatId = query.message.chat.id;

  try {
    const vouchers = [];
    for (let i = 0; i < parseInt(quantity); i++) {
      const voucher = type === 'free' 
        ? await voucherService.generateFreeVoucher(userId)
        : await voucherService.generateGiftVoucher(userId, parseFloat(amount));
      vouchers.push(voucher);
    }

    await bot.sendMessage(chatId, 
      `Successfully generated ${quantity} ${type} voucher(s) for the user.`
    );
  } catch (error) {
    await bot.sendMessage(chatId, 'Failed to generate vouchers.');
  }
}

module.exports = {
  handleVoucherMenu,
  handleVoucherGeneration
};