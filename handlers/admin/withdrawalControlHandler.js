const { isAdmin } = require('../../utils/adminUtils');
const { formatPeriodicKeyboard } = require('../../utils/periodicKeyboardFormatter');
const WithdrawalControlService = require('../../services/admin/withdrawalControlService');

const withdrawalControlService = new WithdrawalControlService();

async function handleWithdrawalControl(bot, msg) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;

  if (!isAdmin(userId)) {
    await bot.sendMessage(chatId, '⛔ Unauthorized access');
    return;
  }

  const isWithdrawalsStopped = withdrawalControlService.isWithdrawalsStopped();
  const message = isWithdrawalsStopped
    ? 'This command resumes withdrawal processes immediately.'
    : 'This command stops all future user withdrawal requests and displays an error message to users who attempt.';

  const keyboard = isWithdrawalsStopped
    ? {
        inline_keyboard: [[
          { text: 'YES', callback_data: 'resume_withdrawals' },
          { text: 'NO', callback_data: 'cancel_withdrawal_control' }
        ]]
      }
    : formatPeriodicKeyboard('front');

  await bot.sendMessage(chatId, message, { reply_markup: keyboard });
}

async function handleWithdrawalControlCallbacks(bot, query) {
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
      case 'resume_withdrawals':
        await withdrawalControlService.resumeWithdrawals();
        await bot.sendMessage(chatId, 'Withdrawals resumed successfully.');
        break;

      case 'cancel_withdrawal_control':
        await bot.deleteMessage(chatId, query.message.message_id);
        break;

      default:
        if (query.data.startsWith('period_')) {
          const period = query.data.split('_')[1];
          await handleStopConfirmation(bot, query, period);
        } else if (query.data.startsWith('confirm_stop_withdrawals_')) {
          const period = query.data.split('_')[3];
          await withdrawalControlService.stopWithdrawals(period);
          await bot.sendMessage(chatId, `Withdrawals stopped for ${period}.`);
        }
    }
  } catch (error) {
    console.error('Error handling withdrawal control callback:', error);
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
    `Do you confirm stopping withdrawals for ${period}?`,
    {
      reply_markup: {
        inline_keyboard: [[
          { text: 'YES', callback_data: `confirm_stop_withdrawals_${period}` },
          { text: 'NO', callback_data: 'cancel_withdrawal_control' }
        ]]
      }
    }
  );
}

module.exports = {
  handleWithdrawalControl,
  handleWithdrawalControlCallbacks
};