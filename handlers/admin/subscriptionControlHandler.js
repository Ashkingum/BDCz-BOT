const { isAdmin } = require('../../utils/adminUtils');
const { formatPeriodicKeyboard } = require('../../utils/periodicKeyboardFormatter');
const SubscriptionControlService = require('../../services/admin/subscriptionControlService');

const subscriptionControlService = new SubscriptionControlService();

async function handleSubscriptionControl(bot, msg) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;

  if (!isAdmin(userId)) {
    await bot.sendMessage(chatId, '⛔ Unauthorized access');
    return;
  }

  const isSubscriptionsStopped = subscriptionControlService.isSubscriptionsStopped();
  const message = isSubscriptionsStopped
    ? 'This command resumes subscription processes to BDCz immediately.'
    : 'This command stops all future subscriptions to the bot and displays an error message to users who attempt.';

  const keyboard = isSubscriptionsStopped
    ? {
        inline_keyboard: [[
          { text: 'YES', callback_data: 'resume_subs' },
          { text: 'NO', callback_data: 'cancel_subs_control' }
        ]]
      }
    : formatPeriodicKeyboard('front');

  await bot.sendMessage(chatId, message, { reply_markup: keyboard });
}

async function handleSubscriptionControlCallbacks(bot, query) {
  const userId = query.from.id;
  const chatId = query.message.chat.id;

  if (!isAdmin(userId)) {
    await bot.answerCallbackQuery(query.id, { 
      text: '⛔ Unauthorized access',
      show_alert: true 
    });
    return;
  }

  try {
    switch (query.data) {
      case 'resume_subs':
        await subscriptionControlService.resumeSubscriptions();
        await bot.sendMessage(chatId, 'Subscriptions resumed successfully.');
        break;

      case 'cancel_subs_control':
        await bot.deleteMessage(chatId, query.message.message_id);
        break;

      default:
        if (query.data.startsWith('period_')) {
          const period = query.data.split('_')[1];
          await handleStopConfirmation(bot, query, period);
        }
    }
  } catch (error) {
    console.error('Error handling subscription control callback:', error);
    await bot.answerCallbackQuery(query.id, {
      text: '❌ An error occurred. Please try again.',
      show_alert: true
    });
  }
}

async function handleStopConfirmation(bot, query, period) {
  const chatId = query.message.chat.id;
  
  await bot.sendMessage(
    chatId,
    `Do you confirm stopping subscriptions for ${period}?`,
    {
      reply_markup: {
        inline_keyboard: [[
          { text: 'YES', callback_data: `confirm_stop_subs_${period}` },
          { text: 'NO', callback_data: 'cancel_subs_control' }
        ]]
      }
    }
  );
}

module.exports = {
  handleSubscriptionControl,
  handleSubscriptionControlCallbacks
};