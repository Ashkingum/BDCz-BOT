class Streak {
  constructor(userId) {
    this.userId = userId;
    this.currentStreak = 0;
    this.lastCheckIn = null;
    this.totalDays = 0;
    this.rewards = 0;
  }

  calculateReward() {
    // $0.5 for each 30-day period
    return Math.floor(this.currentStreak / 30) * 0.5;
  }

  shouldReset() {
    if (!this.lastCheckIn) return false;
    
    const now = new Date();
    const timeDiff = now - this.lastCheckIn;
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    return hoursDiff >= 24;
  }

  shouldRestart() {
    return this.totalDays >= 360;
  }
}

module.exports = Streak;