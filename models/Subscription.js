class Subscription {
  constructor(channelId) {
    this.channelId = channelId;
    this.isSubscribed = false;
    this.lastCheck = new Date();
    this.deductedAmount = 0;
  }

  markUnsubscribed(accountBalance) {
    if (this.isSubscribed) {
      this.isSubscribed = false;
      this.deductedAmount = accountBalance * 0.01; // 1% penalty
    }
  }

  markResubscribed() {
    if (!this.isSubscribed) {
      this.isSubscribed = true;
      const recoveredAmount = this.deductedAmount * 0.5; // 50% recovery
      this.deductedAmount = 0;
      return recoveredAmount;
    }
    return 0;
  }
}

module.exports = Subscription;