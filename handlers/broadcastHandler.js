const { channels } = require('../config/channels');
const { isAdmin } = require('../utils/adminUtils');

async function handleBroadcast(bot, msg) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;
  
  if (!isAdmin(userId)) {
    bot.sendMessage(chatId, 'You are not authorized to use broadcast commands.');
    return;
  }

  // Extract message to broadcast (remove /broadcast command)
  const broadcastMessage = msg.text.replace(/^\/broadcast\s+/, '');
  
  if (!broadcastMessage) {
    bot.sendMessage(chatId, 'Please provide a message to broadcast.\nFormat: /broadcast your message');
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  // Send status message
  const statusMsg = await bot.sendMessage(chatId, 'Broadcasting message...');

  // Broadcast to all channels
  for (const channel of channels) {
    try {
      await bot.sendMessage(`@${channel}`, broadcastMessage);
      successCount++;
      
      // Update status every 10 channels
      if (successCount % 10 === 0) {
        await bot.editMessageText(
          `Broadcasting... ${successCount}/${channels.length} channels completed`,
          {
            chat_id: chatId,
            message_id: statusMsg.message_id
          }
        );
      }
    } catch (error) {
      console.error(`Failed to send to ${channel}:`, error.message);
      errorCount++;
    }
  }

  // Send final status
  await bot.editMessageText(
    `Broadcast completed!\n✅ Sent to: ${successCount} channels\n❌ Failed: ${errorCount} channels`,
    {
      chat_id: chatId,
      message_id: statusMsg.message_id
    }
  );
}

module.exports = {
  handleBroadcast
};