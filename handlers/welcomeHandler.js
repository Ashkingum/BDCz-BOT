const { handleVoucherScreen } = require('./voucherHandler');
const { handleWithdrawalScreen } = require('./withdrawalHandler');
const { handleShareScreen } = require('./shareHandler');
const { handleStreakScreen } = require('./streakHandler');
const { handleWelcomeVoucher } = require('./welcomeVoucherHandler');

async function handleWelcomeSequence(bot, msg) {
  // ... existing welcome sequence code ...
}

async function handleWelcomeCallbacks(bot, query) {
  const chatId = query.message.chat.id;
  
  switch (query.data) {
    case 'welcome_return':
      handleWelcomeSequence(bot, query.message);
      break;
      
    case 'welcome_next':
      handleSubscriptionCheck(bot, query.message);
      break;

    case 'subscription_next':
      handleVoucherScreen(bot, query.message);
      break;

    case 'voucher_next':
      handleWithdrawalScreen(bot, query.message);
      break;

    case 'withdrawal_next':
      handleShareScreen(bot, query.message);
      break;

    case 'share_next':
      handleStreakScreen(bot, query.message);
      break;

    case 'streak_next':
      // Only send welcome voucher if not received before
      const hasReceivedWelcome = await voucherService.hasReceivedWelcomeVoucher(query.from.id);
      if (!hasReceivedWelcome) {
        handleWelcomeVoucher(bot, query.message);
      }
      break;
  }
}