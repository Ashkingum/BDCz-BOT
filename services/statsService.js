const { formatDateTime } = require('../utils/dateFormatter');

class StatsService {
  constructor() {
    this.dailyStats = {
      subscriptions: 0,
      vouchersGenerated: 0,
      pendingWithdrawals: 0,
      withdrawalsApproved: 0,
      payoutAmount: 0
    };

    this.overallStats = {
      totalSubscribers: 0,
      activeUsers: 0,
      inactiveUsers: 0,
      vouchersGenerated: 0,
      pendingWithdrawals: 0,
      withdrawalsApproved: 0,
      totalPayout: 0
    };

    this.lastReset = new Date();
    this.initDailyReset();
  }

  private initDailyReset() {
    // Reset daily stats at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    setTimeout(() => {
      this.resetDailyStats();
      // Set up daily interval
      setInterval(() => this.resetDailyStats(), 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);
  }

  private resetDailyStats() {
    this.dailyStats = {
      subscriptions: 0,
      vouchersGenerated: 0,
      pendingWithdrawals: 0,
      withdrawalsApproved: 0,
      payoutAmount: 0
    };
    this.lastReset = new Date();
  }

  getDailyStats() {
    return {
      ...this.dailyStats,
      lastReset: this.lastReset
    };
  }

  getOverallStats() {
    return this.overallStats;
  }

  // Update methods
  incrementSubscriptions() {
    this.dailyStats.subscriptions++;
    this.overallStats.totalSubscribers++;
  }

  updateActiveUsers(count) {
    this.overallStats.activeUsers = count;
    this.overallStats.inactiveUsers = this.overallStats.totalSubscribers - count;
  }

  recordVoucherGeneration() {
    this.dailyStats.vouchersGenerated++;
    this.overallStats.vouchersGenerated++;
  }

  recordWithdrawal(amount, isPending = true) {
    if (isPending) {
      this.dailyStats.pendingWithdrawals++;
      this.overallStats.pendingWithdrawals++;
    } else {
      this.dailyStats.withdrawalsApproved++;
      this.overallStats.withdrawalsApproved++;
      this.dailyStats.payoutAmount += amount;
      this.overallStats.totalPayout += amount;
    }
  }
}

module.exports = StatsService;