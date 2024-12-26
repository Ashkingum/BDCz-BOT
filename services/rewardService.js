class RewardService {
  constructor(accountService) {
    this.accountService = accountService;
    this.rewardInterval = null;
  }

  startRewardProcessing() {
    // Process rewards every 24 hours
    this.rewardInterval = setInterval(() => {
      this.processAllRewards();
    }, 24 * 60 * 60 * 1000);
  }

  stopRewardProcessing() {
    if (this.rewardInterval) {
      clearInterval(this.rewardInterval);
      this.rewardInterval = null;
    }
  }

  async processAllRewards() {
    for (const [username, account] of this.accountService.accounts) {
      try {
        const streakReward = account.processStreakReward();
        const stakingReward = account.processStakingRewards();
        
        if (streakReward > 0 || stakingReward > 0) {
          await this.accountService.updateStatus(username);
        }
      } catch (error) {
        console.error(`Error processing rewards for ${username}:`, error);
      }
    }
  }
}

module.exports = RewardService;