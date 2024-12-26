const WithdrawalService = require('../services/withdrawalService');
const { formatWithdrawalMessage } = require('../utils/withdrawalFormatter');

const withdrawalService = new WithdrawalService();

async function handleWithdrawalMenu(bot, msg) {
  const chatId = msg.chat.id;
  
  await bot.sendMessage(chatId, 'Choose the percentage to be Withdrawn...', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '25%', callback_data: 'withdraw_25' },
          { text: '50%', callback_data: 'withdraw_50' },
          { text: '75%', callback_data: 'withdraw_75' },
          { text: '100%', callback_data: 'withdraw_100' }
        ]
      ]
    }
  });
}

async function handleWithdrawalCallback(bot, query) {
  const userId = query.from.id;
  const chatId = query.message.chat.id;
  const percentage = parseInt(query.data.split('_')[1]);

  try {
    const withdrawalAmount = await withdrawalService.calculateWithdrawalAmount(userId, percentage);
    
    await bot.sendMessage(
      chatId,
      `Do you confirm withdrawal of ${percentage}% of your available balance? ($${withdrawalAmount.toFixed(2)})`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'YES', callback_data: `confirm_withdraw_${percentage}` },
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

async function handleWithdrawalConfirmation(bot, query) {
  const userId = query.from.id;
  const chatId = query.message.chat.id;
  const percentage = parseInt(query.data.split('_')[2]);

  try {
    await withdrawalService.processWithdrawal(userId, percentage);
    await bot.sendMessage(
      chatId,
      'Your withdrawal request is successfully sent to administrators. It will auto-renew every day until approved or canceled.'
    );
  } catch (error) {
    await bot.answerCallbackQuery(query.id, {
      text: error.message,
      show_alert: true
    });
  }
}