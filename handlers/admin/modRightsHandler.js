const ModRightsService = require('../../services/modRightsService');
const { isAdmin } = require('../../utils/adminUtils');
const { formatModRightsMenu } = require('../../utils/admin/modRightsFormatter');
const { formatPeriodicKeyboard } = require('../../utils/periodicKeyboardFormatter');

const modRightsService = new ModRightsService();

async function handleModRightsMenu(bot, msg) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!isAdmin(userId)) {
    await bot.sendMessage(chatId, '⛔ Unauthorized access');
    return;
  }

  const commands = modRightsService.getAllCommands();
  await bot.sendMessage(chatId,
    'Manage moderator permissions:',
    {
      reply_markup: formatModRightsMenu(commands)
    }
  );
}

async function handleModRightsToggle(bot, query) {
  const chatId = query.message.chat.id;
  const [_, command, username] = query.data.split('_');

  try {
    const isEnabled = modRightsService.togglePermission(username, command);
    const status = isEnabled ? 'added to' : 'removed from';
    
    await bot.answerCallbackQuery(query.id, {
      text: `Command ${status} moderator rights`,
      show_alert: true
    });

    // Update menu to reflect changes
    const commands = modRightsService.getAllCommands();
    await bot.editMessageReplyMarkup(
      formatModRightsMenu(commands, username),
      {
        chat_id: chatId,
        message_id: query.message.message_id
      }
    );

    // Notify moderator
    await bot.sendMessage(username,
      `${command} has been ${status} your moderator rights.`
    );
  } catch (error) {
    await bot.answerCallbackQuery(query.id, {
      text: 'Failed to update moderator rights',
      show_alert: true
    });
  }
}

module.exports = {
  handleModRightsMenu,
  handleModRightsToggle
};