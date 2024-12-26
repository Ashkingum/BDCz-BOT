class PeriodicActionService {
  constructor() {
    this.activeActions = new Map();
  }

  async handlePeriodicAction(userId, period) {
    try {
      // Process the periodic action based on the selected time period
      const action = {
        userId,
        period,
        startTime: new Date(),
        status: 'active'
      };

      this.activeActions.set(userId, action);
      return { success: true };
    } catch (error) {
      console.error('Error processing periodic action:', error);
      return { success: false, error: 'Failed to process action' };
    }
  }

  getActiveAction(userId) {
    return this.activeActions.get(userId);
  }

  cancelAction(userId) {
    return this.activeActions.delete(userId);
  }
}

module.exports = new PeriodicActionService();