const path = require('path');

async function handleVoucherScreen(bot, msg) {
  try {
    // Send voucher image
    await bot.sendPhoto(msg.chat.id, path.join(__dirname, '../assets/voucher.jpg'), {
      caption: '', // No caption as requested
      reply_markup: {
        inline_keyboard: [[
          { text: 'Next', callback_data: 'voucher_next' }
        ]]
      }
    });
  } catch (error) {
    console.error('Error sending voucher screen:', error);
    await bot.sendMessage(msg.chat.id, 'An error occurred. Please try again.');
  }
}

module.exports = {
  handleVoucherScreen
};