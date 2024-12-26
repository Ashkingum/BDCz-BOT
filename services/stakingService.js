const { TimeFormatter } = require('../utils/timeUtils');

class StakingService {
  constructor() {
    this.stakes = new Map(); // userId -> stakes[]
    this.MAX_SLOTS = 3;
  }

  async getStakingStatus(userId) {
    const stakes = this.stakes.get(userId) || [];
    return {
      vault: this.calculateVaultValue(stakes),
      stakes: stakes.map(stake => ({
        amount: stake.amount,
        timestamp: stake.timestamp,
        bonus: stake.bonus
      }))
    };
  }

  hasAvailableSlots(userId) {
    const stakes = this.stakes.get(userId) || [];
    return stakes.length < this.MAX_SLOTS;
  }

  async calculateStakeAmount(userId, percentage) {
    const account = await accountService.getAccount(userId);
    return (account.getAvailableBalance() * percentage) / 100;
  }

  async stake(userId, percentage) {
    if (!this.hasAvailableSlots(userId)) {
      throw new Error('No available staking slots');
    }

    const amount = await this.calculateStakeAmount(userId, percentage);
    const account = await accountService.getAccount(userId);
    
    if (amount > account.getAvailableBalance()) {
      throw new Error('Insufficient balance for staking');
    }

    const stake = {
      amount,
      timestamp: new Date(),
      bonus: 0
    };

    const userStakes = this.stakes.get(userId) || [];
    userStakes.push(stake);
    this.stakes.set(userId, userStakes);

    account.addValue(-amount);
    return { success: true, amount };
  }

  async unstake(userId) {
    const stakes = this.stakes.get(userId) || [];
    const completedStakes = stakes.filter(stake => this.isStakeComplete(stake));

    if (completedStakes.length === 0) {
      return { success: false };
    }

    const account = await accountService.getAccount(userId);
    let totalAmount = 0;
    let totalBonus = 0;

    for (const stake of completedStakes) {
      totalAmount += stake.amount;
      totalBonus += stake.bonus;
    }

    account.addValue(totalAmount + totalBonus);
    this.stakes.set(userId, stakes.filter(stake => !this.isStakeComplete(stake)));

    return { success: true, amount: totalAmount, bonus: totalBonus };
  }

  private isStakeComplete(stake) {
    const now = new Date();
    return (now - stake.timestamp) >= (30 * 24 * 60 * 60 * 1000); // 30 days
  }

  private calculateVaultValue(stakes) {
    return stakes.reduce((total, stake) => total + stake.amount + stake.bonus, 0);
  }
}

module.exports = StakingService;