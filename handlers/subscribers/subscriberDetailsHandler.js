const { formatSubscriberDetails } = require('../../utils/subscriberFormatter');

async function handleSubscriberDetails(bot, msg, subscriber) {
  const chatId = msg.chat.id;

  const keyboard = {
    inline_keyboard: [
      [
        { text: '🔨 Ban', callback_data: `sub_ban_${subscriber.userId}` },
        { text: '🚫 Restrict', callback_data: `sub_restrict_${subscriber.userId}` }
      ],
      [
        { text: '🎟️ Vouchers', callback_data: `sub_vouchers_${subscriber.userId}` },
        { text: '❄️ Freeze', callback_data: `sub_freeze_${subscriber.userId}` }
      ],
      [{ text: 'Return to Menu', callback_data: 'return_menu' }]
    ]
  };

  await bot.sendMessage(chatId,
    formatSubscriberDetails(subscriber),
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard
    }
  );
}

async function handleSubscriberSearch(bot, msg) {
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId, 'Enter a username to continue:');
}

module.exports = {
  handleSubscriberDetails,
  handleSubscriberSearch
};