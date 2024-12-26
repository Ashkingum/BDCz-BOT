// Add to existing messageFormatter.js
function formatStreakMessage(streakInfo) {
  return `🔥 *Current Streak: ${streakInfo.currentStreak} days*\n\n` +
    `💰 Reward: $${streakInfo.reward.toFixed(2)}\n` +
    `🎯 Next milestone: ${streakInfo.nextMilestone} days\n` +
    `⏳ Days until next reward: ${streakInfo.daysUntilNext}\n\n` +
    `_Keep your streak alive by checking in daily!_`;
}

module.exports = {
  // ... existing exports ...
  formatStreakMessage
};