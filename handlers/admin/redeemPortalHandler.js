const { formatPeriodicKeyboard } = require('../../utils/periodicKeyboardFormatter');
const RedeemPortalService = require('../../services/redeemPortalService');

const redeemPortalService = new RedeemPortalService();

async function handleRedeemPortalMenu(bot, msg) {
  const chatId = msg.chat.id;

  await bot.sendMessage(chatId,
    'Select redeem portal duration:',
    {
      reply_markup: formatPeriodicKeyboard('front', 'redeem')
    }
  );
}

async function handleRedeemPortalConfirmation(bot, query, period) {
  const chatId = query.message.chat.id;

  try {
    await bot.sendMessage(chatId,
      `Confirm redeem portal activation for ${period}?`,
      {
        reply_markup: {
          inline_keyboard: [[
            { text: 'YES', callback_data: `confirm_redeem_${period}` },
            { text: 'NO', callback_data: 'cancel_redeem' }
          ]]
        }
      }
    );
  } catch (error) {
    console.error('Error handling redeem portal confirmation:', error);
    await bot.sendMessage(chatId, 'Failed to process request.');
  }
}

async function activateRedeemPortal(bot, query, period) {
  const chatId = query.message.chat.id;

  try {
    const statusMsg = await bot.sendMessage(chatId, 'Activating redeem portal...');
    
    // Start portal distribution
    await redeemPortalService.startDistribution(bot, period);
    
    await bot.editMessageText(
      `Redeem portal activated for ${period}. Portal links will be distributed to random channels.`,
      {
        chat_id: chatId,
        message_id: statusMsg.message_id
      }
    );
  } catch (error) {
    console.error('Error activating redeem portal:', error);
    await bot.sendMessage(chatId, 'Failed to activate redeem portal.');
  }
}

module.exports = {
  handleRedeemPortalMenu,
  handleRedeemPortalConfirmation,
  activateRedeemPortal
};