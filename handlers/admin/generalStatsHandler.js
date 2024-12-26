const StatsService = require('../../services/statsService');
const { formatGeneralStats } = require('../../utils/admin/statsFormatter');

const statsService = new StatsService();

async function handleGeneralStats(bot, msg) {
  const chatId = msg.chat.id;

  try {
    const dailyStats = statsService.getDailyStats();
    const overallStats = statsService.getOverallStats();

    await bot.sendMessage(chatId,
      formatGeneralStats(dailyStats, overallStats),
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '🔄 Refresh', callback_data: 'refresh_stats' },
            { text: '🔙 Return to Menu', callback_data: 'return_menu' }
          ]]
        }
      }
    );
  } catch (error) {
    console.error('Error handling general stats:', error);
    await bot.sendMessage(chatId, '❌ Failed to retrieve statistics.');
  }
}

async function handleStatsRefresh(bot, query) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  try {
    const dailyStats = statsService.getDailyStats();
    const overallStats = statsService.getOverallStats();

    await bot.editMessageText(
      formatGeneralStats(dailyStats, overallStats),
      {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '🔄 Refresh', callback_data: 'refresh_stats' },
            { text: '🔙 Return to Menu', callback_data: 'return_menu' }
          ]]
        }
      }
    );
  } catch (error) {
    console.error('Error refreshing stats:', error);
    await bot.answerCallbackQuery(query.id, {
      text: '❌ Failed to refresh statistics.',
      show_alert: true
    });
  }
}

module.exports = {
  handleGeneralStats,
  handleStatsRefresh
};