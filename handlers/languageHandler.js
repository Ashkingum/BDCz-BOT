const { removeKeyboard } = require('../utils/keyboardUtils');
const FreezeService = require('../services/freezeService');

const freezeService = new FreezeService();

async function handleLanguageSelection(bot, query) {
  const userId = query.from.id;
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const language = query.data.split('_')[1];

  try {
    // Delete previous message if account is frozen
    if (await freezeService.isAccountFrozen(userId)) {
      await bot.deleteMessage(chatId, messageId);
    }

    // Set language and send confirmation
    freezeService.setLanguageSelection(userId, language);
    
    await bot.sendMessage(
      chatId,
      getLanguageConfirmation(language),
      {
        parse_mode: 'Markdown',
        reply_markup: removeKeyboard()
      }
    );
  } catch (error) {
    console.error('Error handling language selection:', error);
    await bot.answerCallbackQuery(query.id, {
      text: '❌ Failed to set language. Please try again.',
      show_alert: true
    });
  }
}

function getLanguageConfirmation(language) {
  const messages = {
    en: 'Language set to English',
    es: 'Idioma configurado a Español',
    fr: 'Langue définie sur Français'
    // Add other languages as needed
  };
  return messages[language] || messages.en;
}

module.exports = { handleLanguageSelection };