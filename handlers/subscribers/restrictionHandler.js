const { formatRestrictionMenu } = require('../../utils/subscriberFormatter');

async function handleRestrictionMenu(bot, msg, userId) {
  const chatId = msg.chat.id;

  await bot.sendMessage(chatId,
    'Restrict rights for the selected user:',
    {
      reply_markup: formatRestrictionMenu(userId)
    }
  );
}

async function handleRestrictionToggle(bot, query, restriction) {
  const userId = query.data.split('_')[2];
  const chatId = query.message.chat.id;
  const isAdding = query.data.startsWith('stop_');

  try {
    if (isAdding) {
      await subscriberService.addRestriction(userId, restriction);
      await bot.sendMessage(chatId, `${restriction} has been restricted.`);
    } else {
      await subscriberService.removeRestriction(userId, restriction);
      await bot.sendMessage(chatId, `${restriction} restriction has been removed.`);
    }
  } catch (error) {
    await bot.sendMessage(chatId, 'Failed to update restrictions.');
  }
}

module.exports = {
  handleRestrictionMenu,
  handleRestrictionToggle
};