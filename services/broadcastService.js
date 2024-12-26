const { TimeConverter } = require('../utils/timeUtils');

class BroadcastService {
  constructor() {
    this.scheduledBroadcasts = new Map();
    this.nextBroadcastId = 1;
  }

  scheduleBroadcast(message, targetType, delay) {
    const broadcastTime = Date.now() + TimeConverter.toMilliseconds(delay);
    
    const broadcast = {
      id: this.nextBroadcastId++,
      message,
      targetType,
      scheduledTime: broadcastTime,
      status: 'scheduled'
    };

    this.scheduledBroadcasts.set(broadcast.id, broadcast);
    return broadcast;
  }

  getScheduledBroadcasts() {
    return Array.from(this.scheduledBroadcasts.values())
      .filter(b => b.status === 'scheduled')
      .sort((a, b) => a.scheduledTime - b.scheduledTime);
  }

  getBroadcast(id) {
    return this.scheduledBroadcasts.get(id);
  }

  updateBroadcast(id, updates) {
    const broadcast = this.getBroadcast(id);
    if (!broadcast) return false;

    Object.assign(broadcast, updates);
    return true;
  }

  cancelBroadcast(id) {
    return this.scheduledBroadcasts.delete(id);
  }
}

module.exports = BroadcastService;