const crypto = require('crypto');
const { channels } = require('../config/channels');
const { PORTAL_IMAGES } = require('../constants/portalImages');
const { TimeConverter } = require('../utils/timeUtils');

class RedeemPortalService {
  constructor() {
    this.activeLinks = new Map();
    this.lastDistribution = null;
    this.distributionInterval = null;
    this.endTime = null;
  }

  async startDistribution(bot, period) {
    // Clear any existing distribution
    if (this.distributionInterval) {
      clearInterval(this.distributionInterval);
    }

    // Set end time based on period
    const duration = TimeConverter.toMilliseconds(period);
    this.endTime = Date.now() + duration;

    // Initial distribution
    await this.distribute(bot);

    // Schedule periodic distributions
    this.distributionInterval = setInterval(async () => {
      if (Date.now() >= this.endTime) {
        this.stopDistribution();
        return;
      }
      await this.distribute(bot);
    }, this.getRandomInterval());
  }

  stopDistribution() {
    if (this.distributionInterval) {
      clearInterval(this.distributionInterval);
      this.distributionInterval = null;
    }
    this.endTime = null;
  }

  private getRandomInterval() {
    // Random interval between 5 and 15 minutes
    return Math.floor(Math.random() * (15 - 5 + 1) + 5) * 60 * 1000;
  }

  private getRandomChannel() {
    return channels[Math.floor(Math.random() * channels.length)];
  }

  private generateSecureToken() {
    return crypto.randomBytes(16).toString('hex');
  }

  private createSecureLink(token) {
    return `https://t.me/BillionDollarCodeZBot?start=redeem_${token}`;
  }

  // ... rest of the class implementation remains the same ...
}

module.exports = RedeemPortalService;