const { formatStreakMessage } = require('../utils/messageFormatter');
const StreakService = require('../services/streakService');

const streakService = new StreakService();

async function handleStreak(bot, msg) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;

  try {
    const streakInfo = streakService.checkIn(userId);
    
    await bot.sendMessage(chatId, 
      formatStreakMessage(streakInfo),
      { parse_mode: 'MarkdownV2' }
    );
  } catch (error) {
    console.error('Error handling streak:', error);
    await bot.sendMessage(chatId, '❌ Failed to process streak. Please try again.');
  }
}

module.exports = { handleStreak };