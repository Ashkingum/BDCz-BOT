const path = require('path');

async function handleShareScreen(bot, msg) {
  try {
    await bot.sendPhoto(msg.chat.id, path.join(__dirname, '../assets/share.jpg'), {
      caption: '', // No caption as requested
      reply_markup: {
        inline_keyboard: [[
          { text: 'Next', callback_data: 'share_next' }
        ]]
      }
    });
  } catch (error) {
    console.error('Error sending share screen:', error);
    await bot.sendMessage(msg.chat.id, 'An error occurred. Please try again.');
  }
}

module.exports = {
  handleShareScreen
};