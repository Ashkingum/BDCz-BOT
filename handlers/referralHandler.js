const { formatReferralList, formatReferralMessage } = require('../utils/referralFormatter');
const { generateReferralLink } = require('../utils/referralLinkGenerator');
const ReferralService = require('../services/referralService');

const referralService = new ReferralService();

async function handleReferralCommand(bot, msg) {
  const userId = msg.from.id;
  const chatId = msg.chat.id;

  try {
    const referrals = referralService.getUserReferrals(userId);
    const referralLink = generateReferralLink(userId);
    
    const keyboard = {
      inline_keyboard: [
        [
          { text: '👥 Invite Friends', callback_data: 'ref_invite' },
          { text: '📋 Copy Link', callback_data: 'ref_copy' }
        ],
        [{ text: '🔙 Return to Menu', callback_data: 'return_menu' }]
      ]
    };

    await bot.sendMessage(
      chatId,
      formatReferralMessage(referrals, referralLink),
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
        disable_web_page_preview: true
      }
    );
  } catch (error) {
    console.error('Error handling referral command:', error);
    await bot.sendMessage(chatId, '❌ Failed to retrieve referral information.');
  }
}

async function handleReferralCallbacks(bot, query) {
  const userId = query.from.id;
  const chatId = query.message.chat.id;

  try {
    const referrals = referralService.getUserReferrals(userId);
    
    if (referrals.length >= 10) {
      await bot.answerCallbackQuery(query.id, {
        text: 'You have already achieved the maximum number of referrals.',
        show_alert: true
      });
      return;
    }

    const referralLink = generateReferralLink(userId);
    
    switch (query.data) {
      case 'ref_invite':
        const messages = [
          `[treasure](${referralLink}) Guess what? I found treasure! And you should come mine with me.`,
          `Wanna make some free cash real quick?! [here's](${referralLink}) your chance... first come first serve.`
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        await bot.sendMessage(chatId, randomMessage, {
          parse_mode: 'Markdown',
          disable_web_page_preview: true
        });
        break;

      case 'ref_copy':
        await bot.answerCallbackQuery(query.id, {
          text: 'Referral link copied to clipboard!',
          show_alert: true
        });
        break;
    }
  } catch (error) {
    console.error('Error handling referral callback:', error);
    await bot.answerCallbackQuery(query.id, {
      text: '❌ An error occurred. Please try again.',
      show_alert: true
    });
  }
}