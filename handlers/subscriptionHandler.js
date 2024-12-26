const SubscriptionService = require('../services/subscriptionService');
const AccountService = require('../services/accountService');

const accountService = new AccountService();
let subscriptionService;

function initializeSubscriptionHandler(bot) {
  subscriptionService = new SubscriptionService(accountService, bot);
  subscriptionService.startSubscriptionChecks();
}

async function handleSubscriptionCheck(bot, msg) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;

  try {
    const isSubscribed = await subscriptionService.checkSubscriptionStatus(userId);
    
    if (isSubscribed) {
      await bot.sendMessage(chatId, 
        '✅ You are subscribed to all required channels!\n' +
        'All features are available.'
      );
    } else {
      await bot.sendMessage(chatId, 
        '⚠️ You are not subscribed to all required channels.\n' +
        '- Voucher generation is disabled\n' +
        '- 1% balance penalty per unsubscribed channel\n\n' +
        'Subscribe to all channels to restore features and recover 50% of penalties.'
      );
    }
  } catch (error) {
    console.error('Error checking subscriptions:', error);
    await bot.sendMessage(chatId, '❌ Failed to check subscription status. Please try again.');
  }
}

module.exports = {
  initializeSubscriptionHandler,
  handleSubscriptionCheck
};