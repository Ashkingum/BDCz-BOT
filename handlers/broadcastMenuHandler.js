const BroadcastService = require('../services/broadcastService');
const { formatDelayOptions } = require('../utils/broadcastFormatter');

const broadcastService = new BroadcastService();

async function handleBroadcastMenu(bot, msg) {
  const chatId = msg.chat.id;

  await bot.sendMessage(chatId, 'Broadcast Menu', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Compose', callback_data: 'broadcast_compose' },
          { text: 'Scheduled', callback_data: 'broadcast_scheduled' }
        ],
        [{ text: 'Return to Menu', callback_data: 'return_menu' }]
      ]
    }
  });
}

async function handleBroadcastCompose(bot, msg) {
  const chatId = msg.chat.id;

  await bot.sendMessage(chatId, 'Select target audience:', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Subscribers', callback_data: 'broadcast_to_subscribers' },
          { text: 'Channels', callback_data: 'broadcast_to_channels' }
        ],
        [{ text: 'Cancel', callback_data: 'broadcast_cancel' }]
      ]
    }
  });
}

async function handleScheduledBroadcasts(bot, msg) {
  const chatId = msg.chat.id;
  const broadcasts = broadcastService.getScheduledBroadcasts();

  if (broadcasts.length === 0) {
    await bot.sendMessage(chatId, 'No scheduled broadcasts.');
    return;
  }

  const message = broadcasts.map((b, i) => 
    `${i + 1}- ${b.targetType} - ${formatCountdown(b.scheduledTime)}\n"${b.message}"`
  ).join('\n\n');

  const keyboard = broadcasts.map((b, i) => ({
    text: `${i + 1}`,
    callback_data: `broadcast_edit_${b.id}`
  }));

  await bot.sendMessage(chatId, message, {
    reply_markup: {
      inline_keyboard: [keyboard]
    }
  });
}

module.exports = {
  handleBroadcastMenu,
  handleBroadcastCompose,
  handleScheduledBroadcasts
};