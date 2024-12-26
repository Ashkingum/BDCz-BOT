const { formatStakingStatus } = require('../utils/stakingFormatter');
const StakingService = require('../services/stakingService');
const AccountService = require('../services/accountService');

const stakingService = new StakingService();
const accountService = new AccountService();

async function handleStakingMenu(bot, msg) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;

  try {
    const stakingStatus = await stakingService.getStakingStatus(userId);
    
    await bot.sendMessage(chatId, formatStakingStatus(stakingStatus), {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🔒 Stake', callback_data: 'stake_new' },
            { text: '🔓 Unstake', callback_data: 'unstake' }
          ],
          [{ text: '🔙 Return to Menu', callback_data: 'return_menu' }]
        ]
      }
    });
  } catch (error) {
    await bot.sendMessage(chatId, '❌ Failed to retrieve staking status.');
  }
}

async function handleStakePercentageSelection(bot, msg) {
  const chatId = msg.chat.id;
  
  if (!stakingService.hasAvailableSlots(msg.from.id)) {
    await bot.sendMessage(chatId, 'Oops! Sorry about that..., please try again later.');
    return;
  }

  await bot.sendMessage(chatId, 'Add new Stake.', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '25%', callback_data: 'stake_25' },
          { text: '50%', callback_data: 'stake_50' },
          { text: '75%', callback_data: 'stake_75' },
          { text: '100%', callback_data: 'stake_100' }
        ]
      ]
    }
  });
}

module.exports = {
  handleStakingMenu,
  handleStakePercentageSelection
};