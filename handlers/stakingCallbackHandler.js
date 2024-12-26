const StakingService = require('../services/stakingService');
const stakingService = new StakingService();

async function handleStakingCallbacks(bot, query) {
  const userId = query.from.id;
  const chatId = query.message.chat.id;

  try {
    switch (query.data) {
      case 'stake_new':
        await handleStakePercentageSelection(bot, query.message);
        break;

      case 'unstake':
        const unstakeResult = await stakingService.unstake(userId);
        if (unstakeResult.success) {
          await bot.sendMessage(chatId, 'Your stake is complete.');
        } else {
          await bot.sendMessage(chatId, 'Oops! Sorry about that..., please try again later.');
        }
        break;

      default:
        if (query.data.startsWith('stake_')) {
          const percentage = parseInt(query.data.split('_')[1]);
          await handleStakeConfirmation(bot, query, percentage);
        }
    }
  } catch (error) {
    await bot.answerCallbackQuery(query.id, {
      text: error.message,
      show_alert: true
    });
  }
}

async function handleStakeConfirmation(bot, query, percentage) {
  const userId = query.from.id;
  const chatId = query.message.chat.id;

  try {
    const stakeAmount = await stakingService.calculateStakeAmount(userId, percentage);
    
    await bot.sendMessage(
      chatId,
      `Do you confirm the staking of ${percentage}% of your available balance? ($${stakeAmount.toFixed(2)})`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'YES', callback_data: `confirm_stake_${percentage}` },
              { text: 'NO', callback_data: 'return_menu' }
            ]
          ]
        }
      }
    );
  } catch (error) {
    await bot.answerCallbackQuery(query.id, {
      text: error.message,
      show_alert: true
    });
  }
}

module.exports = { handleStakingCallbacks };