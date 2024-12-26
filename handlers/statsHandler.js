const StatsService = require('../services/statsService');
const { formatStatsMessage } = require('../utils/statsFormatter');

const statsService = new StatsService();

async function handleStats(bot, msg) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;

  try {
    const stats = await statsService.getUserStats(userId);
    await bot.sendMessage(chatId, formatStatsMessage(stats), {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: '🔙 Return to Menu', callback_data: 'return_menu' }
        ]]
      }
    });
  } catch (error) {
    console.error('Error retrieving stats:', error);
    await bot.sendMessage(chatId, '❌ Failed to retrieve statistics. Please try again.');
  }
}

module.exports = { handleStats };