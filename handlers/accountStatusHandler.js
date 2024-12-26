const { formatAccountStatus } = require('../utils/statusFormatter');
const { formatMainMenu } = require('../utils/menuFormatter');
const AccountService = require('../services/accountService');

const accountService = new AccountService();

async function handleAccountStatus(bot, msg) {
  const username = msg.from.username;
  const chatId = msg.chat.id;

  try {
    const account = accountService.getAccount(username);
    const statusMessage = formatAccountStatus(account);
    
    await bot.sendMessage(chatId, statusMessage, {
      parse_mode: 'Markdown',
      reply_markup: formatMainMenu()
    });
  } catch (error) {
    console.error('Error handling status request:', error);
    await bot.sendMessage(chatId, '❌ Failed to retrieve account status. Please try again.');
  }
}