const { isAdmin } = require('../../utils/adminUtils');
const { formatAdminMenu } = require('../../utils/admin/menuFormatter');

async function handleAdminMenu(bot, msg) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;

  if (!isAdmin(userId)) {
    await bot.sendMessage(chatId, '⛔ Unauthorized access');
    return;
  }

  await bot.sendMessage(chatId, 'Administrator Menu', {
    reply_markup: formatAdminMenu()
  });
}

async function handleAdminCallbacks(bot, query) {
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
      case 'admin_transactions':
        await handleTransactionMenu(bot, query.message);
        break;
        
      case 'admin_mods':
        await handleModsMenu(bot, query.message);
        break;

      // ... other admin menu callbacks
    }
  } catch (error) {
    console.error('Error handling admin callback:', error);
    await bot.answerCallbackQuery(query.id, {
      text: '❌ An error occurred. Please try again.',
      show_alert: true
    });
  }
}

module.exports = {
  handleAdminMenu,
  handleAdminCallbacks
};