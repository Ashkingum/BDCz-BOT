const Streak = require('../models/Streak');

class StreakService {
  constructor() {
    this.streaks = new Map();
  }

  getStreak(userId) {
    if (!this.streaks.has(userId)) {
      this.streaks.set(userId, new Streak(userId));
    }
    return this.streaks.get(userId);
  }

  checkIn(userId) {
    const streak = this.getStreak(userId);
    const now = new Date();

    if (streak.shouldReset()) {
      streak.currentStreak = 0;
      streak.rewards = 0;
    } else if (streak.shouldRestart()) {
      streak.currentStreak = 0;
      streak.totalDays = 0;
      streak.rewards = 0;
    }

    streak.currentStreak++;
    streak.totalDays++;
    streak.lastCheckIn = now;

    const reward = streak.calculateReward();
    return {
      currentStreak: streak.currentStreak,
      reward,
      nextMilestone: this.getNextMilestone(streak.currentStreak),
      daysUntilNext: this.getDaysUntilNext(streak.currentStreak)
    };
  }

  getNextMilestone(currentStreak) {
    return Math.ceil(currentStreak / 30) * 30;
  }

  getDaysUntilNext(currentStreak) {
    return this.getNextMilestone(currentStreak) - currentStreak;
  }
}

module.exports = StreakService;