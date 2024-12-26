const { formatSubscriberList } = require('../../utils/subscriberFormatter');
const SubscriberService = require('../../services/subscriberService');

const subscriberService = new SubscriberService();

async function handleSubscriberList(bot, msg, page = 1) {
  const chatId = msg.chat.id;
  const { subscribers, totalPages, currentPage } = subscriberService.getSubscribersByPage(page);

  if (subscribers.length === 0) {
    await bot.sendMessage(chatId, 'No subscribers found.');
    return;
  }

  const keyboard = formatPaginationKeyboard(currentPage, totalPages);
  
  await bot.sendMessage(chatId, 
    formatSubscriberList(subscribers),
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    }
  );
}

function formatPaginationKeyboard(currentPage, totalPages) {
  const buttons = [];
  
  // Navigation buttons
  const navRow = [];
  if (currentPage > 1) {
    navRow.push({ text: '←', callback_data: `sub_page_${currentPage - 1}` });
  }
  navRow.push({ text: `${currentPage}/${totalPages}`, callback_data: 'noop' });
  if (currentPage < totalPages) {
    navRow.push({ text: '→', callback_data: `sub_page_${currentPage + 1}` });
  }
  buttons.push(navRow);

  // Return to menu button
  buttons.push([{ text: 'Return to Menu', callback_data: 'return_menu' }]);

  return { inline_keyboard: buttons };
}

module.exports = { handleSubscriberList };