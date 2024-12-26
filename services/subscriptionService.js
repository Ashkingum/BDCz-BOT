const { channels } = require('../config/channels');
const Subscription = require('../models/Subscription');

class SubscriptionService {
  constructor(accountService, bot) {
    this.accountService = accountService;
    this.bot = bot;
    this.subscriptions = new Map(); // userId -> Map<channelId, Subscription>
    this.checkInterval = null;
  }

  async initializeUserSubscriptions(userId) {
    const userSubs = new Map();
    for (const channel of channels) {
      userSubs.set(channel, new Subscription(channel));
    }
    this.subscriptions.set(userId, userSubs);
  }

  async checkSubscriptionStatus(userId) {
    const userSubs = this.subscriptions.get(userId);
    if (!userSubs) return false;

    const account = this.accountService.getAccount(userId);
    if (!account) return false;

    let allSubscribed = true;
    let totalPenalty = 0;
    let totalRecovery = 0;

    for (const [channelId, subscription] of userSubs) {
      try {
        const chatMember = await this.bot.getChatMember(`@${channelId}`, userId);
        const isCurrentlySubscribed = ['member', 'administrator', 'creator'].includes(chatMember.status);

        if (!isCurrentlySubscribed && subscription.isSubscribed) {
          subscription.markUnsubscribed(account.balance);
          totalPenalty += subscription.deductedAmount;
          allSubscribed = false;
        } else if (isCurrentlySubscribed && !subscription.isSubscribed) {
          const recovered = subscription.markResubscribed();
          totalRecovery += recovered;
        }
      } catch (error) {
        console.error(`Error checking subscription for channel ${channelId}:`, error);
        allSubscribed = false;
      }
    }

    // Apply penalties and recoveries
    if (totalPenalty > 0) {
      account.balance -= totalPenalty;
    }
    if (totalRecovery > 0) {
      account.balance += totalRecovery;
    }

    return allSubscribed;
  }

  startSubscriptionChecks() {
    // Check subscriptions every hour
    this.checkInterval = setInterval(() => {
      this.checkAllSubscriptions();
    }, 60 * 60 * 1000);
  }

  async checkAllSubscriptions() {
    for (const [userId] of this.subscriptions) {
      await this.checkSubscriptionStatus(userId);
    }
  }

  isFullySubscribed(userId) {
    const userSubs = this.subscriptions.get(userId);
    if (!userSubs) return false;
    
    return Array.from(userSubs.values()).every(sub => sub.isSubscribed);
  }
}

module.exports = SubscriptionService;