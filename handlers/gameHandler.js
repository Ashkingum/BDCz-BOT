const { formatGameMessage } = require('../utils/gameFormatter');

async function handleGameMenu(bot, msg) {
  const chatId = msg.chat.id;

  await bot.sendMessage(chatId, formatGameMessage(), {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[
        { text: '🔙 Return to Menu', callback_data: 'return_menu' }
      ]]
    }
  });
}

module.exports = { handleGameMenu };