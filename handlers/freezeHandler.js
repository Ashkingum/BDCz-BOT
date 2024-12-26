const FreezeService = require('../services/freezeService');
const { formatFreezeMessage } = require('../utils/freezeFormatter');

const freezeService = new FreezeService();

async function handleFreezeMenu(bot, msg) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;

  const isFrozen = await freezeService.isAccountFrozen(userId);
  
  if (isFrozen) {
    await handleFrozenAccount(bot, chatId);
  } else {
    await handleUnfrozenAccount(bot, chatId);
  }
}

async function handleFrozenAccount(bot, chatId) {
  await bot.sendMessage(chatId, 'Unfreeze account now!!!', {
    reply_markup: {
      inline_keyboard: [[
        { text: '🔓 Unfreeze', callback_data: 'unfreeze_account' }
      ]]
    }
  });
}

async function handleUnfrozenAccount(bot, chatId) {
  await bot.sendMessage(
    chatId,
    formatFreezeMessage(),
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '❄️ Freeze', callback_data: 'freeze_account' },
            { text: '🔙 Return to Menu', callback_data: 'return_menu' }
          ]
        ]
      }
    }
  );
}

async function handleFreezeCallbacks(bot, query) {
  const userId = query.from.id;
  const chatId = query.message.chat.id;

  try {
    switch (query.data) {
      case 'freeze_account':
        await freezeService.freezeAccount(userId);
        await bot.sendMessage(chatId, 'Account frozen. You can unfreeze at any time.');
        await handleFrozenAccount(bot, chatId);
        break;

      case 'unfreeze_account':
        await freezeService.unfreezeAccount(userId);
        await bot.sendMessage(chatId, 'Account unfrozen and fully functional.');
        await handleUnfrozenAccount(bot, chatId);
        break;
    }
  } catch (error) {
    await bot.answerCallbackQuery(query.id, {
      text: error.message,
      show_alert: true
    });
  }
}

module.exports = {
  handleFreezeMenu,
  handleFreezeCallbacks
};