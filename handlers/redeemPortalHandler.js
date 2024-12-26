const LinkValidator = require('./redeemPortal/linkValidator');
const RedeemMessageHandler = require('./redeemPortal/messageHandler');
const AutoDeleteHandler = require('./redeemPortal/autoDelete');

async function handleRedeemPortal(bot, msg, redeemPortalService, voucherService) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;
  const token = msg.text.split('token=')[1];

  // Validate link
  const validation = LinkValidator.validateLink(token, redeemPortalService.activeLinks);
  if (!validation.valid) {
    await RedeemMessageHandler.sendError(bot, chatId, validation.error);
    return;
  }

  try {
    // Get user's voucher
    const voucher = voucherService.getUserVoucher(userId);
    if (!voucher) {
      await RedeemMessageHandler.sendError(bot, chatId, 'No voucher found to redeem');
      return;
    }

    // Send redeem interface
    const message = await RedeemMessageHandler.sendRedeemInterface(bot, chatId, voucher);
    
    // Schedule auto-deletion
    AutoDeleteHandler.scheduleMessageDeletion(bot, chatId, message.message_id);

  } catch (error) {
    console.error('Error handling redeem portal:', error);
    await RedeemMessageHandler.sendError(bot, chatId, 'Failed to process redemption. Please try again.');
  }
}

module.exports = { handleRedeemPortal };