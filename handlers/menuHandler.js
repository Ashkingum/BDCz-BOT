const { formatMainMenu } = require('../utils/menuFormatter');
const { MENU_OPTIONS } = require('../constants/menuOptions');

async function handleMenuCommand(bot, msg) {
  const chatId = msg.chat.id;
  
  try {
    await bot.sendMessage(
      chatId,
      '*Main Menu*\nSelect an option below:',
      {
        parse_mode: 'Markdown',
        reply_markup: formatMainMenu()
      }
    );
  } catch (error) {
    console.error('Error displaying menu:', error);
    await bot.sendMessage(chatId, '❌ Failed to display menu. Please try again.');
  }
}

async function handleMenuCallbacks(bot, query) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  try {
    switch (query.data) {
      case 'return_menu':
        await bot.editMessageText(
          '*Main Menu*\nSelect an option below:',
          {
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown',
            reply_markup: formatMainMenu()
          }
        );
        break;
        
      // Add other menu callback handlers here
    }
  } catch (error) {
    console.error('Error handling menu callback:', error);
    await bot.answerCallbackQuery(query.id, {
      text: '❌ An error occurred. Please try again.',
      show_alert: true
    });
  }
}

module.exports = {
  handleMenuCommand,
  handleMenuCallbacks
};