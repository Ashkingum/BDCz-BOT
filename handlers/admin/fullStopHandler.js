const { isAdmin } = require('../../utils/adminUtils');
const { formatPeriodicKeyboard } = require('../../utils/periodicKeyboardFormatter');
const FullStopService = require('../../services/admin/fullStopService');

const fullStopService = new FullStopService();

async function handleFullStop(bot, msg) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;

  if (!isAdmin(userId)) {
    await bot.sendMessage(chatId, '⛔ Unauthorized access');
    return;
  }

  const isFullyStopped = fullStopService.isFullyStopped();
  const message = isFullyStopped
    ? 'This command resumes subscriptions, free voucher generations, withdrawals, and stakings simultaneously, immediately.'
    : 'This command stops all future user subscriptions, free voucher generations, withdrawals, and stakings simultaneously and displays an error message to users who attempt any of these.';

  const keyboard = isFullyStopped
    ? {
        inline_keyboard: [[
          { text: 'YES', callback_data: 'full_resume' },
          { text: 'NO', callback_data: 'cancel_full_stop' }
        ]]
      }
    : formatPeriodicKeyboard('front');

  await bot.sendMessage(chatId, message, { reply_markup: keyboard });
}

async function handleFullStopCallbacks(bot, query) {
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
      case 'full_resume':
        await fullStopService.resumeAll();
        await bot.sendMessage(chatId, 'All functions resumed successfully.');
        break;

      case 'cancel_full_stop':
        await bot.deleteMessage(chatId, query.message.message_id);
        break;

      default:
        if (query.data.startsWith('period_')) {
          const period = query.data.split('_')[1];
          await handleStopConfirmation(bot, query, period);
        } else if (query.data.startsWith('confirm_full_stop_')) {
          const period = query.data.split('_')[3];
          await fullStopService.stopAll(period);
          await bot.sendMessage(chatId, `All functions stopped for ${period}.`);
        }
    }
  } catch (error) {
    console.error('Error handling full stop callback:', error);
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
    `Do you confirm a full stop of all functions for ${period}?`,
    {
      reply_markup: {
        inline_keyboard: [[
          { text: 'YES', callback_data: `confirm_full_stop_${period}` },
          { text: 'NO', callback_data: 'cancel_full_stop' }
        ]]
      }
    }
  );
}

module.exports = {
  handleFullStop,
  handleFullStopCallbacks
};