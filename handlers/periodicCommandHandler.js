const { formatPeriodicKeyboard } = require('../utils/periodicKeyboardFormatter');
const { handlePeriodicAction } = require('../services/periodicActionService');

async function handlePeriodicCommand(bot, msg) {
  const chatId = msg.chat.id;
  
  try {
    await bot.sendMessage(chatId, 'Select time period:', {
      reply_markup: formatPeriodicKeyboard('front')
    });
  } catch (error) {
    console.error('Error displaying periodic menu:', error);
    await bot.sendMessage(chatId, '❌ Failed to display periodic options. Please try again.');
  }
}

async function handlePeriodicCallbacks(bot, query) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  try {
    switch (query.data) {
      case 'periodic_next':
        await bot.editMessageReplyMarkup(
          formatPeriodicKeyboard('back'),
          {
            chat_id: chatId,
            message_id: messageId
          }
        );
        break;

      case 'periodic_prev':
        await bot.editMessageReplyMarkup(
          formatPeriodicKeyboard('front'),
          {
            chat_id: chatId,
            message_id: messageId
          }
        );
        break;

      case 'periodic_cancel':
        await bot.deleteMessage(chatId, messageId);
        break;

      default:
        if (query.data.startsWith('period_')) {
          const period = query.data.split('_')[1];
          await handlePeriodSelection(bot, query, period);
        }
    }
  } catch (error) {
    console.error('Error handling periodic callback:', error);
    await bot.answerCallbackQuery(query.id, {
      text: '❌ An error occurred. Please try again.',
      show_alert: true
    });
  }
}

async function handlePeriodSelection(bot, query, period) {
  const chatId = query.message.chat.id;
  
  try {
    await bot.sendMessage(
      chatId,
      `Do you confirm this action for ${period}?`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'YES', callback_data: `confirm_period_${period}` },
              { text: 'NO', callback_data: 'periodic_cancel' }
            ]
          ]
        }
      }
    );
  } catch (error) {
    await bot.sendMessage(chatId, 'Sorry! Please try again later.');
  }
}

module.exports = {
  handlePeriodicCommand,
  handlePeriodicCallbacks
};