const FreezeService = require('../../services/freezeService');
const { formatPeriodicKeyboard } = require('../../utils/periodicKeyboardFormatter');

const freezeService = new FreezeService();

async function handleFreezeMenu(bot, msg, userId) {
  const chatId = msg.chat.id;
  const isFrozen = await freezeService.isAccountFrozen(userId);

  if (isFrozen) {
    await handleUnfreezePrompt(bot, chatId, userId);
  } else {
    await handleFreezePrompt(bot, chatId, userId);
  }
}

async function handleFreezePrompt(bot, chatId, userId) {
  await bot.sendMessage(chatId,
    'Select freeze duration:',
    {
      reply_markup: formatPeriodicKeyboard('front', `freeze_${userId}`)
    }
  );
}

async function handleUnfreezePrompt(bot, chatId, userId) {
  await bot.sendMessage(chatId,
    'Account is currently frozen. Would you like to unfreeze it?',
    {
      reply_markup: {
        inline_keyboard: [[
          { text: 'YES', callback_data: `unfreeze_${userId}` },
          { text: 'NO', callback_data: 'return_menu' }
        ]]
      }
    }
  );
}

async function handleFreezeConfirmation(bot, query, period) {
  const userId = query.data.split('_')[2];
  const chatId = query.message.chat.id;

  try {
    await freezeService.freezeAccount(userId, period);
    await bot.sendMessage(chatId, `Account frozen for ${period}.`);
  } catch (error) {
    await bot.sendMessage(chatId, 'Failed to freeze account.');
  }
}

async function handleUnfreeze(bot, query) {
  const userId = query.data.split('_')[1];
  const chatId = query.message.chat.id;

  try {
    await freezeService.unfreezeAccount(userId);
    await bot.sendMessage(chatId, 'Account has been unfrozen.');
  } catch (error) {
    await bot.sendMessage(chatId, 'Failed to unfreeze account.');
  }
}

module.exports = {
  handleFreezeMenu,
  handleFreezeConfirmation,
  handleUnfreeze
};