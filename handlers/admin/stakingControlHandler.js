const { isAdmin } = require('../../utils/adminUtils');
const { formatPeriodicKeyboard } = require('../../utils/periodicKeyboardFormatter');
const StakingControlService = require('../../services/admin/stakingControlService');

const stakingControlService = new StakingControlService();

async function handleStakingControl(bot, msg) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;

  if (!isAdmin(userId)) {
    await bot.sendMessage(chatId, '⛔ Unauthorized access');
    return;
  }

  const isStakingStopped = stakingControlService.isStakingStopped();
  const message = isStakingStopped
    ? 'This command resumes staking processes immediately.'
    : 'This command stops all future personal stakings and displays an error message to users who attempt.';

  const keyboard = isStakingStopped
    ? {
        inline_keyboard: [[
          { text: 'YES', callback_data: 'resume_staking' },
          { text: 'NO', callback_data: 'cancel_staking_control' }
        ]]
      }
    : formatPeriodicKeyboard('front');

  await bot.sendMessage(chatId, message, { reply_markup: keyboard });
}

async function handleStakingControlCallbacks(bot, query) {
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
      case 'resume_staking':
        await stakingControlService.resumeStaking();
        await bot.sendMessage(chatId, 'Staking resumed successfully.');
        break;

      case 'cancel_staking_control':
        await bot.deleteMessage(chatId, query.message.message_id);
        break;

      default:
        if (query.data.startsWith('period_')) {
          const period = query.data.split('_')[1];
          await handleStopConfirmation(bot, query, period);
        } else if (query.data.startsWith('confirm_stop_staking_')) {
          const period = query.data.split('_')[3];
          await stakingControlService.stopStaking(period);
          await bot.sendMessage(chatId, `Staking stopped for ${period}.`);
        }
    }
  } catch (error) {
    console.error('Error handling staking control callback:', error);
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
    `Do you confirm stopping staking for ${period}?`,
    {
      reply_markup: {
        inline_keyboard: [[
          { text: 'YES', callback_data: `confirm_stop_staking_${period}` },
          { text: 'NO', callback_data: 'cancel_staking_control' }
        ]]
      }
    }
  );
}

module.exports = {
  handleStakingControl,
  handleStakingControlCallbacks
};