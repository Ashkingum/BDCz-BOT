const { formatVoucherMessage } = require('../../utils/messageFormatter');

class RedeemMessageHandler {
  static async sendRedeemInterface(bot, chatId, voucher) {
    const redeemMarkup = {
      inline_keyboard: [[
        { text: '🎟 Claim Voucher', callback_data: `redeem_${voucher.code}` }
      ]]
    };

    return bot.sendMessage(chatId,
      `*Ready to Redeem*\n${formatVoucherMessage(voucher)}\n\nClick below to claim:`,
      {
        parse_mode: 'MarkdownV2',
        reply_markup: redeemMarkup
      }
    );
  }

  static async sendError(bot, chatId, error) {
    return bot.sendMessage(chatId, `❌ ${error}`);
  }
}

module.exports = RedeemMessageHandler;