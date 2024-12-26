class AutoDeleteHandler {
  static scheduleMessageDeletion(bot, chatId, messageId, delay = 30000) {
    setTimeout(async () => {
      try {
        await bot.deleteMessage(chatId, messageId);
      } catch (error) {
        console.error('Failed to delete expired redeem message:', error);
      }
    }, delay);
  }
}

module.exports = AutoDeleteHandler;