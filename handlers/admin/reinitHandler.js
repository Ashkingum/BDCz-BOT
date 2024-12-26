const { isAdmin } = require('../../utils/adminUtils');
const ReinitService = require('../../services/admin/reinitService');

const reinitService = new ReinitService();

async function handleReinit(bot, msg) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;

  if (!isAdmin(userId)) {
    await bot.sendMessage(chatId, '⛔ Unauthorized access');
    return;
  }

  await bot.sendMessage(
    chatId,
    'Are you sure you want to permanently erase everything?',
    {
      reply_markup: {
        inline_keyboard: [[
          { text: 'YES', callback_data: 'confirm_reinit' },
          { text: 'NO', callback_data: 'cancel_reinit' }
        ]]
      }
    }
  );
}

async function handleReinitCallbacks(bot, query) {
  const userId = query.from.id;
  const chatId = query.message.chat.id;

  if (!isAdmin(userId)) {
    await bot.answerCallbackQuery(query.id, {
      text: '⛔ Unauthorized access',
      show_alert: true
    });
    return;
  }

  try {
    switch (query.data) {
      case 'confirm_reinit':
        const statusMessage = await bot.sendMessage(chatId, 'Starting system re-initialization...');
        await reinitService.reinitialize();
        await bot.editMessageText(
          'System re-initialization complete. All data has been reset.',
          {
            chat_id: chatId,
            message_id: statusMessage.message_id
          }
        );
        break;

      case 'cancel_reinit':
        await bot.deleteMessage(chatId, query.message.message_id);
        break;
    }
  } catch (error) {
    console.error('Error handling re-initialization:', error);
    await bot.answerCallbackQuery(query.id, {
      text: '❌ An error occurred. Please try again.',
      show_alert: true
    });
  }
}

module.exports = {
  handleReinit,
  handleReinitCallbacks
};